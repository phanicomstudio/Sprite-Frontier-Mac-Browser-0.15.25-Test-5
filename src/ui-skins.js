/* October 15, 2026 (0.15.28): interface skins.
 *
 * The in-game interface has four devices, each a fixed slot in the layout:
 *   controls  journal / inventory / resume buttons   (.remoteDevice)
 *   portrait  character portrait with Blood/Cerebral (.portraitDevice)
 *   status    weapon screen and inspection screen    (.combinedDevice)
 *   pause     pause menu and options                 (#pauseArtwork)
 *
 * A skin pack (skins/<id>/skin.js) supplies frame art for any of them, plus
 * where the buttons and screens sit on that art, as percentages of the image.
 * A device a pack does not supply, or every device when no pack is chosen,
 * uses the built-in minimal frame drawn by CSS (engine-workspace.css,
 * "Minimal interface"). Skins never change gameplay, controls or element IDs.
 *
 * Which skin is used: the player's choice in Options (stored per browser);
 * by default the campaign's skin (project.uiSkin, set in the editor); by
 * default for campaigns, "phanicom-devices". "minimal" means no pack.
 *
 * Adding a pack: create skins/<id>/skin.js calling FrontierSkins.register()
 * with the manifest described in docs/INTERFACE-SKINS.md, put its images in
 * the same folder, and list it in skins/index.js.
 */
(/* @function uiSkins.install — Inputs: browser global root; expects the game DOM (scripts load at the end of <body>) and FrontierAssets. Returns nothing. Publishes FrontierSkins and applies the current choice immediately. */ function (root) {
  "use strict";
  const KEY = "frontier.skin.1600";
  const DEFAULT_PACK = "phanicom-devices";
  const MINIMAL = "minimal";
  const ID = /^[a-z0-9][a-z0-9-]{0,63}$/;
  const RECT_KEYS = Object.freeze({
    controls: ["journal", "inventory", "resume", "ask"],
    status: ["equipment", "inspection"],
    pause: ["menu", "settings"],
  });
  const packs = new Map();
  const loading = new Map();
  let choice = "campaign",
    campaignDefault = DEFAULT_PACK,
    active = null,
    portraitFrames = [];

  /* @function uiSkins.index — Inputs: none. Returns the pack list from skins/index.js ([{ id, name }]), keeping only well-formed entries. Missing index means no packs. */
  function index() {
    const list = Array.isArray(root.FrontierSkinPacks) ? root.FrontierSkinPacks : [];
    return list.filter(/* @function uiSkins.indexEntry — Inputs: index entry. Returns true for { id, name } with a valid ID and a 1–60 character name. */ function (p) {
      return p && ID.test(p.id) && p.id !== MINIMAL && typeof p.name === "string" && p.name.trim().length > 0 && p.name.length <= 60;
    });
  }

  /* @function uiSkins.rect — Inputs: candidate rectangle and a label for errors. Returns a copied [x, y, width, height] in percent of the frame image. Throws a readable error unless all four are finite, the size is positive and the rectangle stays within -10…110 % (a little overhang is allowed for art with soft edges). */
  function rect(value, label) {
    if (!Array.isArray(value) || value.length !== 4 || !value.every(Number.isFinite))
      throw Error(label + " must be [x, y, width, height] in percent.");
    const [x, y, w, h] = value;
    if (w <= 0 || h <= 0 || x < -10 || y < -10 || x + w > 110 || y + h > 110)
      throw Error(label + " must lie on its image (percent of width and height).");
    return [x, y, w, h];
  }

  /* @function uiSkins.image — Inputs: pack ID, relative image path from the manifest, and a label for errors. Returns the site path "skins/<id>/<path>". Throws for empty paths, absolute paths, URLs, "..", or types other than PNG, JPEG or WebP, so a pack can only use images inside its own folder. */
  function image(id, value, label) {
    if (typeof value !== "string" || !value || value.length > 200 || value.includes("..") || value.startsWith("/") || /^[a-z][a-z0-9+.-]*:/i.test(value) || value.includes("\\"))
      throw Error(label + " must be an image file inside the skin folder.");
    if (!/\.(png|jpe?g|webp)$/i.test(value)) throw Error(label + " must be a PNG, JPEG or WebP image.");
    return "skins/" + id + "/" + value;
  }

  /* @function uiSkins.validate — Inputs: manifest passed to register(). Returns a normalized, frozen copy with resolved image paths. Each device section is optional; an absent one falls back to the minimal frame. Throws a readable error naming the first invalid field; nothing is registered in that case. */
  function validate(value) {
    if (!value || value.schema !== "sprite-frontier-skin/1") throw Error('A skin manifest needs schema "sprite-frontier-skin/1".');
    if (!ID.test(value.id || "") || value.id === MINIMAL) throw Error("Skin id must be lowercase letters, digits and dashes, and not \"minimal\".");
    if (typeof value.name !== "string" || !value.name.trim() || value.name.length > 60) throw Error("Skin name must be 1–60 characters.");
    const out = { id: value.id, name: value.name.trim(), modules: {} };
    for (const key of ["controls", "status", "pause"]) {
      const m = value[key];
      if (m === undefined) continue;
      const entry = { image: image(value.id, m?.image, key + ".image"), rects: {} };
      const rects = key === "controls" ? m.hotspots : key === "status" ? m.screens : m;
      for (const name of RECT_KEYS[key])
        if (rects?.[name] !== undefined) entry.rects[name] = rect(rects[name], key + "." + name);
      if (key !== "controls" && Object.keys(entry.rects).length !== RECT_KEYS[key].length)
        throw Error(key + " must define " + RECT_KEYS[key].join(" and ") + ".");
      out.modules[key] = entry;
    }
    if (value.portrait !== undefined) {
      const frames = value.portrait?.frames;
      if (!Array.isArray(frames) || !frames.length || frames.length > 4)
        throw Error("portrait.frames must list 1–4 images drawn over the portrait.");
      out.modules.portrait = {
        frames: frames.map(/* @function uiSkins.frame — Inputs: frame path and index. Returns its resolved site path. */ function (f, i) {
          return image(value.id, f, "portrait.frames[" + i + "]");
        }),
      };
    }
    return Object.freeze(out);
  }

  /* @function uiSkins.register — Inputs: skin manifest (see validate). Returns the normalized pack. Called by skins/<id>/skin.js. Re-applies the interface if this pack is the one currently wanted. Throws on invalid manifests; the error is reported in the console by the pack loader. */
  function register(manifest) {
    const pack = validate(manifest);
    packs.set(pack.id, pack);
    if (wanted() === pack.id) apply();
    return pack;
  }

  /* @function uiSkins.load — Inputs: pack ID listed in skins/index.js. Returns a promise for the registered pack, loading skins/<id>/skin.js once. Works over http(s) and from disk (plain script tag). Rejects with a readable message if the script is missing or does not register that ID. */
  function load(id) {
    if (packs.has(id)) return Promise.resolve(packs.get(id));
    if (!index().some(/* @function uiSkins.listed — Inputs: index entry. Returns true when it has this ID. */ function (p) { return p.id === id; }))
      return Promise.reject(Error("Skin \"" + id + "\" is not listed in skins/index.js."));
    if (!loading.has(id))
      loading.set(id, new Promise(/* @function uiSkins.loadScript — Inputs: resolve/reject. Returns nothing; adds the pack script and settles once it ran. */ function (resolve, reject) {
        const script = document.createElement("script");
        script.src = "skins/" + id + "/skin.js";
        script.onload = /* @function uiSkins.loaded — Inputs: load event ignored. Resolves with the pack, or rejects if the script did not register it. */ function () {
          script.remove();
          if (packs.has(id)) resolve(packs.get(id));
          else {
            loading.delete(id);
            reject(Error("skins/" + id + "/skin.js did not register a skin with id \"" + id + "\"."));
          }
        };
        script.onerror = /* @function uiSkins.loadFailed — Inputs: error event ignored. Rejects with the missing path and allows a retry. */ function () {
          script.remove();
          loading.delete(id);
          reject(Error("Could not load skins/" + id + "/skin.js."));
        };
        document.head.append(script);
      }));
    return loading.get(id);
  }

  /* @function uiSkins.wanted — Inputs: none. Returns the pack ID that should be shown now: the player's choice, or the campaign default when the player chose "campaign". "minimal" means no pack. */
  function wanted() {
    return choice === "campaign" ? campaignDefault : choice;
  }

  /* @function uiSkins.place — Inputs: element (may be null) and a percent rectangle, or null to clear. Returns nothing; sets or removes inline left/top/width/height so the minimal stylesheet takes over when cleared. */
  function place(element, r) {
    if (!element) return;
    const s = element.style;
    if (!r) {
      s.left = s.top = s.width = s.height = "";
      return;
    }
    s.left = r[0] + "%";
    s.top = r[1] + "%";
    s.width = r[2] + "%";
    s.height = r[3] + "%";
  }

  /* @function uiSkins.setImage — Inputs: <img> element (may be null) and site path, or null for none. Returns nothing; sets the source through FrontierAssets (offline copy from disk) and hides the image when there is none. */
  function setImage(img, path) {
    if (!img) return;
    if (path) {
      if (img.dataset.skinSource !== path) {
        img.src = root.FrontierAssets ? root.FrontierAssets.url(path) : path;
        img.dataset.skinSource = path;
      }
      img.hidden = false;
    } else {
      img.removeAttribute("src");
      delete img.dataset.skinSource;
      img.hidden = true;
    }
  }

  /* @function uiSkins.apply — Inputs: none. Returns nothing. Shows the wanted pack if it is loaded (starting its load otherwise, with the minimal frames shown meanwhile), or minimal frames. Marks each device element skinFramed or skinPlain, sets frame images and geometry, prepares portrait frame images and announces "frontier-skin-change" so the portrait repaints. Safe to call repeatedly. */
  function apply() {
    const id = wanted();
    const pack = id === MINIMAL ? null : packs.get(id) || null;
    if (id !== MINIMAL && !pack)
      load(id).catch(/* @function uiSkins.applyFailed — Inputs: load error. Logs it; the minimal frames stay. */ function (error) {
        console.warn(error.message);
      });
    active = pack;
    const html = document.documentElement,
      modules = pack ? pack.modules : {};
    html.dataset.skin = pack ? pack.id : MINIMAL;
    const devices = {
      controls: document.querySelector(".remoteDevice"),
      portrait: document.querySelector(".portraitDevice"),
      status: document.querySelector(".combinedDevice"),
      pause: document.getElementById("pauseArtwork"),
    };
    for (const [key, element] of Object.entries(devices)) {
      const framed = !!modules[key];
      html.dataset["skin" + key[0].toUpperCase() + key.slice(1)] = framed ? "framed" : "plain";
      if (!element) continue;
      element.classList.toggle("skinFramed", framed);
      element.classList.toggle("skinPlain", !framed);
    }
    const controls = modules.controls;
    setImage(devices.controls?.querySelector(":scope > img"), controls?.image);
    for (const [name, elementId] of [["journal", "journalButton"], ["inventory", "remoteInventory"], ["resume", "remoteResume"], ["ask", "remoteAsk"]])
      place(document.getElementById(elementId), controls?.rects[name] || null);
    const status = modules.status;
    setImage(devices.status?.querySelector(":scope > img"), status?.image);
    place(document.getElementById("equipmentScreen"), status?.rects.equipment || null);
    place(devices.status?.querySelector(".immersionScreen"), status?.rects.inspection || null);
    const pause = modules.pause;
    if (pause) {
      const url = root.FrontierAssets ? root.FrontierAssets.url(pause.image) : pause.image;
      html.style.setProperty("--skin-pause-image", 'url("' + url.replaceAll('"', "%22") + '")');
      for (const [name, r] of Object.entries(pause.rects)) {
        html.style.setProperty("--skin-pause-" + name + "-x", r[0] + "%");
        html.style.setProperty("--skin-pause-" + name + "-y", r[1] + "%");
        html.style.setProperty("--skin-pause-" + name + "-w", r[2] + "%");
        html.style.setProperty("--skin-pause-" + name + "-h", r[3] + "%");
      }
    } else html.style.setProperty("--skin-pause-image", "none");
    portraitFrames = (modules.portrait?.frames || []).map(/* @function uiSkins.portraitImage — Inputs: frame site path. Returns an Image that requests a portrait repaint when it finishes loading. */ function (path) {
      const im = new Image();
      im.onload = /* @function uiSkins.portraitLoaded — Inputs: load event ignored. Announces the change so the portrait redraws with this frame. */ function () {
        root.dispatchEvent(new CustomEvent("frontier-skin-change", { detail: { id: html.dataset.skin } }));
      };
      im.src = root.FrontierAssets ? root.FrontierAssets.url(path) : path;
      return im;
    });
    root.dispatchEvent(new CustomEvent("frontier-skin-change", { detail: { id: html.dataset.skin } }));
  }

  /* @function uiSkins.choose — Inputs: "campaign", "minimal" or a pack ID from skins/index.js. Returns nothing. Stores the player's choice for this browser and applies it. Throws "Choose a listed interface." for anything else, changing nothing. */
  function choose(value) {
    if (value !== "campaign" && value !== MINIMAL && !index().some(/* @function uiSkins.chooseListed — Inputs: index entry. Returns true for the chosen ID. */ function (p) { return p.id === value; }))
      throw Error("Choose a listed interface.");
    choice = value;
    try {
      root.localStorage?.setItem(KEY, value);
    } catch {
      /* Session-only preference when storage is unavailable. */
    }
    apply();
  }

  /* @function uiSkins.setCampaignDefault — Inputs: the campaign's skin ID (project.uiSkin), or undefined. Returns nothing. Invalid or unlisted IDs fall back to "phanicom-devices" so an imported project from another install still shows a working interface. Re-applies only when the visible skin changes. */
  function setCampaignDefault(id) {
    const next = id === MINIMAL || index().some(/* @function uiSkins.defaultListed — Inputs: index entry. Returns true for this ID. */ function (p) { return p.id === id; }) ? id : DEFAULT_PACK;
    if (next === campaignDefault) return;
    const before = wanted();
    campaignDefault = next;
    if (wanted() !== before) apply();
  }

  /* @function uiSkins.options — Inputs: whether to include the "campaign default" entry (players: yes; the editor's campaign setting: no). Returns [{ value, label }] for a select. */
  function options(includeCampaign) {
    const list = includeCampaign ? [{ value: "campaign", label: "Campaign default" }] : [];
    list.push({ value: MINIMAL, label: "Minimal" });
    for (const p of index()) list.push({ value: p.id, label: p.name });
    return list;
  }

  /* @function uiSkins.bind — Inputs: <select> element. Returns it after filling it with the player's choices, selecting the current one and applying changes. Several bound selects stay in step. */
  function bind(select) {
    select.replaceChildren();
    for (const o of options(true)) select.append(new Option(o.label, o.value));
    select.value = choice;
    select.addEventListener("change", /* @function uiSkins.bindChange — Inputs: change event ignored. Applies the chosen interface; an invalid choice snaps back with its reason in the title. */ function () {
      try {
        choose(select.value);
        select.title = "";
      } catch (error) {
        select.title = error.message;
        select.value = choice;
      }
    });
    root.addEventListener("frontier-skin-change", /* @function uiSkins.bindFollow — Inputs: skin-change event ignored. Keeps this select showing the current choice. */ function () {
      select.value = choice;
    });
    return select;
  }

  try {
    const saved = root.localStorage?.getItem(KEY);
    if (saved === "campaign" || saved === MINIMAL || index().some(/* @function uiSkins.savedListed — Inputs: index entry. Returns true for the saved ID. */ function (p) { return p.id === saved; })) choice = saved;
  } catch {
    /* Unavailable storage keeps the campaign default. */
  }

  root.FrontierSkins = Object.freeze({
    DEFAULT_PACK,
    validate,
    register,
    load,
    choose,
    setCampaignDefault,
    options,
    bind,
    apply,
    /* @function uiSkins.choice — Inputs: none. Returns the player's stored choice ("campaign", "minimal" or a pack ID). */
    choice() {
      return choice;
    },
    /* @function uiSkins.active — Inputs: none. Returns the pack currently shown, or null for minimal. */
    active() {
      return active;
    },
    /* @function uiSkins.portraitFrames — Inputs: none. Returns the loaded Image objects the active pack draws over the portrait (empty for minimal). Allocation-free; safe while drawing. */
    portraitFrames() {
      return portraitFrames;
    },
  });
  apply();
})(globalThis);
