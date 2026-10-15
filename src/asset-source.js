/* October 15, 2026 (0.15.27): one place that decides where image and model
 * bytes come from.
 *
 * Served over http(s) — `npm start`, Cloudflare, any static host — every asset
 * is an ordinary file (PNG, GLB) loaded by its path. This is the normal mode.
 *
 * Opened straight from disk (file://), browsers refuse to let WebGL or canvas
 * read pixels from local files, and fetch() cannot read them at all. For that
 * case `npm run build:offline` writes offline/*.js bundles holding byte-
 * identical copies as data URIs. They are generated, never committed, and
 * loaded only in file mode: offline/core.js at startup; the characters,
 * castle, supplied model and skybox bundles only when first needed.
 *
 * Startup: a few assets are needed synchronously while the game builds its
 * first project (the two built-in door models). FrontierAssets loads them
 * first, then runs every whenReady() callback in registration order. app.js and
 * the editor shell start through whenReady(), so they never see a half-loaded
 * engine. If loading fails, a plain message explains what to do and the game
 * does not start half-broken.
 *
 * Replaces the 0.15.25 embedded mirrors (outdoor-assets dataURL fields,
 * room-texture-data.js, item-image-data.js, candy-image-data.js, room-art.js,
 * door-asset.js, saloon-door-data.js, assets/skyboxes/sky-N.js and the bytes
 * inside the castle/supplied catalogs). Those files were removed in 0.15.27.
 */
(/* @function assetSource.install — Inputs: browser global root. Returns nothing. Publishes FrontierAssets and immediately starts loading the startup assets for the current mode. Must load before any script that calls FrontierAssets (see index.html order). */ function (root) {
  "use strict";

  /** Assets that startup code reads synchronously. Keep this list short.
   * A page that needs none (the muzzle editor) sets
   * window.FRONTIER_ASSET_STARTUP = [] before this script. */
  const STARTUP = Object.freeze(
    Array.isArray(root.FRONTIER_ASSET_STARTUP)
      ? root.FRONTIER_ASSET_STARTUP.slice()
      : [
          "assets/models/runtime/antique-door-transition/assembly.glb",
          "assets/models/runtime/saloon-doors/pair.glb",
        ],
  );
  /** Offline bundles loaded at startup in file mode. Other bundles load on
   * first use. Overridable the same way with FRONTIER_ASSET_GROUPS. */
  const STARTUP_GROUPS = Object.freeze(
    Array.isArray(root.FRONTIER_ASSET_GROUPS) ? root.FRONTIER_ASSET_GROUPS.slice() : ["core"],
  );
  const protocol = root.location?.protocol || "http:";
  const mode = protocol === "http:" || protocol === "https:" ? "http" : "file";
  const preloaded = new Map();
  const groupLoads = new Map();
  const queue = [];
  let ready = false,
    failed = null;

  /* @function assetSource.groupOf — Inputs: site-relative asset path. Returns the offline bundle name holding it in file mode: models-castle, models-supplied, skyboxes, characters or core. Pure; tools/build-offline.cjs loads this same function, so the two cannot disagree. */
  function groupOf(path) {
    if (path.startsWith("img/characters/")) return "characters";
    if (path.startsWith("assets/models/castle/")) return "models-castle";
    if (path.startsWith("assets/models/supplied/")) return "models-supplied";
    if (path.startsWith("img/skyboxes/")) return "skyboxes";
    return "core";
  }

  /* @function assetSource.table — Inputs: none. Returns the offline data table installed by offline/*.js bundles (path → data URI), or an empty object. Read-only. */
  function table() {
    return root.FrontierOfflineAssets || {};
  }

  /* @function assetSource.decode — Inputs: data URI string with base64 payload. Returns its bytes as a new Uint8Array. Throws on malformed input. Used only in file mode, where fetch() of local files is unavailable. */
  function decode(uri) {
    const comma = uri.indexOf(",");
    if (!uri.startsWith("data:") || comma < 0 || !uri.slice(0, comma).endsWith(";base64"))
      throw Error("Offline asset data is malformed.");
    const text = atob(uri.slice(comma + 1)),
      bytes = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i);
    return bytes;
  }

  /* @function assetSource.loadGroup — Inputs: offline bundle name. Returns a promise resolving once offline/<name>.js has run (file mode only). Each bundle loads at most once; a failure is remembered so callers get the same clear error instead of repeated requests. */
  function loadGroup(name) {
    if (!groupLoads.has(name))
      groupLoads.set(
        name,
        new Promise(
          /* @function assetSource.groupScript — Inputs: promise resolve/reject. Returns nothing; adds the bundle's script tag and settles when it loads or fails. The tag is removed afterwards; the data stays in FrontierOfflineAssets. */ function (resolve, reject) {
            const script = root.document.createElement("script");
            script.src = "offline/" + name + ".js";
            script.onload = /* @function assetSource.groupLoaded — Inputs: load event ignored. Returns nothing; resolves the bundle promise. */ function () {
              script.remove();
              resolve();
            };
            script.onerror = /* @function assetSource.groupMissing — Inputs: error event ignored. Returns nothing; rejects with instructions for building the offline bundles. */ function () {
              script.remove();
              reject(Error("The offline copy of the game assets is missing (offline/" + name + ".js). Run npm run build:offline, or open the game with npm start."));
            };
            root.document.head.append(script);
          },
        ),
      );
    return groupLoads.get(name);
  }

  /* @function assetSource.fetchBytes — Inputs: site-relative asset path. Returns a promise for its bytes (Uint8Array) fetched over http(s). Rejects with a message naming the file when the server answers with an error or the request fails. */
  async function fetchBytes(path) {
    let response;
    try {
      response = await fetch(encodeURI(path));
    } catch {
      throw Error("Could not load " + path + ". Check the connection and reload.");
    }
    if (!response.ok) throw Error("Could not load " + path + " (" + response.status + ").");
    return new Uint8Array(await response.arrayBuffer());
  }

  /* @function assetSource.bytes — Inputs: site-relative asset path (e.g. "assets/models/castle/Castle_Wall_4m.glb"). Returns a promise for a fresh Uint8Array copy of the file, so callers may keep or transfer it. Uses the startup cache, the offline bundle in file mode, or fetch over http(s). Rejects with a readable message when the asset is unavailable. */
  async function bytes(path) {
    if (preloaded.has(path)) return preloaded.get(path).slice();
    if (mode === "file") {
      await loadGroup(groupOf(path));
      const uri = table()[path];
      if (!uri) throw Error("Asset is not in the offline copy: " + path + ". Run npm run build:offline again.");
      return decode(uri);
    }
    return fetchBytes(path);
  }

  /* @function assetSource.url — Inputs: site-relative image path. Returns the string to put in an <img>/Image src: the path itself over http(s), or the offline data URI in file mode when its bundle is loaded. Falls back to the path, so a missing offline copy shows as an ordinary broken image rather than an exception. Synchronous; for lazily bundled images use imageURL(). */
  function url(path) {
    if (mode === "http") return path;
    return table()[path] || path;
  }

  /* @function assetSource.imageURL — Inputs: site-relative image path. Returns a promise for the same value as url(), after loading the image's offline bundle in file mode (used for skyboxes, which are not in the startup bundle). Over http(s) it resolves immediately to the path. */
  async function imageURL(path) {
    if (mode === "file") await loadGroup(groupOf(path));
    return url(path);
  }

  /* @function assetSource.preloadedBytes — Inputs: one of the STARTUP asset paths. Returns a fresh Uint8Array copy, synchronously. Throws when called for an asset that is not part of startup or before startup finished; callers run inside whenReady(). */
  function preloadedBytes(path) {
    if (!preloaded.has(path)) throw Error("Startup asset is not loaded: " + path);
    return preloaded.get(path).slice();
  }

  /* @function assetSource.showFailure — Inputs: Error that stopped startup. Returns nothing. Shows a plain, fixed message at the top of the page (role="alert") so the player sees why the game did not start, and logs the error. Idempotent. */
  function showFailure(error) {
    console.error(error);
    const doc = root.document;
    if (!doc?.body || doc.getElementById("assetFailure")) return;
    const box = doc.createElement("div");
    box.id = "assetFailure";
    box.setAttribute("role", "alert");
    box.style.cssText = "position:fixed;z-index:10000;top:0;left:0;right:0;padding:16px 20px;background:#fff;color:#0b0c0c;border-bottom:4px solid #d4351c;font:18px/1.4 system-ui,sans-serif";
    box.textContent = "Sprite Frontier could not start. " + error.message;
    doc.body.prepend(box);
  }

  /* @function assetSource.run — Inputs: callback registered with whenReady. Returns nothing; runs it, reporting any exception as an uncaught page error (so it is visible and testable) without stopping later callbacks. */
  function run(callback) {
    try {
      callback();
    } catch (error) {
      setTimeout(/* @function assetSource.rethrow — Inputs: none. Rethrows the callback's error asynchronously as an uncaught page error. */ function () {
        throw error;
      });
    }
  }

  /* @function assetSource.whenReady — Inputs: callback taking no arguments. Returns nothing. Runs the callback once startup assets are loaded, in the order callbacks were registered; runs it immediately if startup already finished. Never runs it after a startup failure (the failure message is shown instead). */
  function whenReady(callback) {
    if (failed) return;
    if (ready) run(callback);
    else queue.push(callback);
  }

  /* @function assetSource.start — Inputs: none. Returns a promise that settles after startup assets are loaded (or failed) and queued callbacks ran. File mode loads the startup offline bundles (core, plus any holding a startup asset) and decodes the startup models; http mode fetches them in parallel. Waits for the document to finish parsing so callbacks see the complete page. */
  async function start() {
    try {
      if (mode === "file") {
        const groups = new Set(STARTUP_GROUPS);
        for (const path of STARTUP) groups.add(groupOf(path));
        await Promise.all(Array.from(groups, loadGroup));
        for (const path of STARTUP) {
          const uri = table()[path];
          if (!uri) throw Error("Asset is not in the offline copy: " + path + ". Run npm run build:offline again.");
          preloaded.set(path, decode(uri));
        }
      } else {
        const loaded = await Promise.all(STARTUP.map(fetchBytes));
        STARTUP.forEach(/* @function assetSource.keep — Inputs: path and index. Returns nothing; stores the fetched bytes for synchronous use. */ function (path, i) {
          preloaded.set(path, loaded[i]);
        });
      }
      if (root.document?.readyState === "loading")
        await new Promise(/* @function assetSource.domReady — Inputs: resolve. Returns nothing; resolves once the page has finished parsing. */ function (resolve) {
          root.document.addEventListener("DOMContentLoaded", resolve, { once: true });
        });
      ready = true;
      while (queue.length) run(queue.shift());
    } catch (error) {
      failed = error;
      queue.length = 0;
      if (root.document?.readyState === "loading")
        root.document.addEventListener("DOMContentLoaded", /* @function assetSource.reportLater — Inputs: none. Shows the failure once the page body exists. */ function () { showFailure(error); }, { once: true });
      else showFailure(error);
    }
  }

  root.FrontierAssets = Object.freeze({
    mode,
    startupGroups: STARTUP_GROUPS,
    startup: STARTUP,
    groupOf,
    url,
    imageURL,
    bytes,
    preloadedBytes,
    whenReady,
    started: start(),
  });
})(globalThis);
