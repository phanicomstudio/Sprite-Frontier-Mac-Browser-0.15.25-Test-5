// October 15, 2026 (0.15.27): separate asset files, FrontierAssets loader,
// generated offline bundles and the Cloudflare size budget.
// - FrontierAssets (src/asset-source.js) in http and file modes, with fakes:
//   url/imageURL/bytes/preloadedBytes, startup ordering, readable failures.
// - tools/build-offline.cjs output is byte-identical to the source files and
//   grouped by the loader's own rule.
// - tools/check-asset-sizes.cjs: ignore rules and Cloudflare limits.
// - No embedded base64 asset copies remain in maintained source.
const fs = require("node:fs"),
  vm = require("node:vm"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const root = path.join(__dirname, "..");
const loaderSource = fs.readFileSync(path.join(root, "src/asset-source.js"), "utf8");

/* @function offlineAssets1600.loader — Inputs: protocol ("http:" or "file:"), optional files map (path → Buffer) served by the fake fetch, optional offline table preinstalled by fake bundle scripts, and optional global overrides. Returns { A, context, scripts, alerts } after evaluating src/asset-source.js in a sandbox with a minimal document. Fake <script> tags "load" on the next tick, installing the table, or fail when missingGroups lists them. */
function loader(protocol, { files = {}, table = {}, missingGroups = [], overrides = {} } = {}) {
  const scripts = [],
    alerts = [],
    listeners = {};
  const document = {
    readyState: "complete",
    head: {
      /* @function offlineAssets1600.append — Inputs: fake script element. Records it and settles it asynchronously like a browser would. */
      append(script) {
        scripts.push(script.src);
        setTimeout(/* @function offlineAssets1600.settle — Inputs: none. Installs the bundle table or reports a load error. */ function () {
          const group = script.src.replace(/^offline\/|\.js$/g, "");
          if (missingGroups.includes(group)) return script.onerror();
          context.FrontierOfflineAssets = Object.assign(context.FrontierOfflineAssets || {}, table);
          script.onload();
        });
      },
    },
    body: {
      /* @function offlineAssets1600.prepend — Inputs: failure element. Records its text as a visible alert. */
      prepend(node) {
        alerts.push(node.textContent);
      },
    },
    /* @function offlineAssets1600.createElement — Inputs: tag name. Returns a plain object standing in for an element. */
    createElement(tag) {
      return { tag, style: {}, /* @function offlineAssets1600.setAttribute — Inputs: name, value. Stores the attribute. */ setAttribute(k, v) { this[k] = v; }, /* @function offlineAssets1600.remove — Inputs: none. No-op removal. */ remove() {} };
    },
    /* @function offlineAssets1600.getElementById — Inputs: ID. Returns null; the failure box is never already present. */
    getElementById() {
      return null;
    },
    /* @function offlineAssets1600.addEventListener — Inputs: event name and listener. Stores it. */
    addEventListener(name, fn) {
      listeners[name] = fn;
    },
  };
  const context = {
    location: { protocol },
    document,
    console: { /* @function offlineAssets1600.quietError — Inputs: ignored. Silences expected failure logging. */ error() {} },
    setTimeout,
    atob: /* @function offlineAssets1600.atob — Inputs: base64 text. Returns its binary string, as browsers do. */ function (text) {
      return Buffer.from(text, "base64").toString("latin1");
    },
    Uint8Array,
    Promise,
    Map,
    Set,
    Array,
    Object,
    Error,
    encodeURI,
    /* @function offlineAssets1600.fetch — Inputs: URL. Returns a fake Response for a known file, a 404 response otherwise. */
    async fetch(url) {
      const file = files[decodeURI(url)];
      return file
        ? { ok: true, status: 200, /* @function offlineAssets1600.arrayBuffer — Inputs: none. Returns the file's bytes as an ArrayBuffer. */ async arrayBuffer() { return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength); } }
        : { ok: false, status: 404 };
    },
    ...overrides,
  };
  context.globalThis = context;
  vm.runInNewContext(loaderSource, context);
  return { A: context.FrontierAssets, context, scripts, alerts };
}

/* @function offlineAssets1600.uri — Inputs: Buffer and MIME type. Returns the base64 data URI used by offline bundles. */
function uri(buffer, mime) {
  return "data:" + mime + ";base64," + buffer.toString("base64");
}

(/* @function offlineAssets1600.run — Inputs: none. Runs all checks in order; sets a failing exit code on any assertion error. */ async function () {
  const [door, saloon] = ["assets/models/runtime/antique-door-transition/assembly.glb", "assets/models/runtime/saloon-doors/pair.glb"];
  const doorBytes = fs.readFileSync(path.join(root, door)),
    saloonBytes = fs.readFileSync(path.join(root, saloon));
  const png = fs.readFileSync(path.join(root, "img/items/prop_ammo1.png"));

  // http mode: plain paths, startup preload, ordered callbacks, copies.
  let http = loader("http:", { files: { [door]: doorBytes, [saloon]: saloonBytes, "img/items/prop_ammo1.png": png } });
  assert.equal(http.A.mode, "http");
  assert.equal(http.A.url("img/items/prop_ammo1.png"), "img/items/prop_ammo1.png");
  const order = [];
  http.A.whenReady(/* @function offlineAssets1600.first — Inputs: none. Records order. */ function () { order.push(1); });
  http.A.whenReady(/* @function offlineAssets1600.second — Inputs: none. Records order. */ function () { order.push(2); });
  assert.deepEqual(order, [], "callbacks wait for startup assets");
  assert.throws(/* @function offlineAssets1600.early — Inputs: none. Reads before startup finished. */ function () { http.A.preloadedBytes(door); }, /not loaded/);
  await http.A.started;
  assert.deepEqual(order, [1, 2], "callbacks run in registration order");
  http.A.whenReady(/* @function offlineAssets1600.late — Inputs: none. Records order. */ function () { order.push(3); });
  assert.deepEqual(order, [1, 2, 3], "late callbacks run immediately");
  const a = http.A.preloadedBytes(door),
    b = http.A.preloadedBytes(door);
  assert.ok(Buffer.from(a).equals(doorBytes) && a !== b, "startup bytes are exact, fresh copies");
  assert.ok(Buffer.from(await http.A.bytes("img/items/prop_ammo1.png")).equals(png));
  await assert.rejects(http.A.bytes("img/items/missing.png"), /Could not load img\/items\/missing\.png \(404\)/);
  assert.deepEqual(http.scripts, [], "http mode never loads offline bundles");

  // http failure: a missing startup model shows a message and runs nothing.
  const broken = loader("http:", { files: { [door]: doorBytes } });
  let ran = false;
  broken.A.whenReady(/* @function offlineAssets1600.neverRuns — Inputs: none. Marks that startup ran despite failure. */ function () { ran = true; });
  await broken.A.started;
  assert.equal(ran, false);
  assert.match(broken.alerts[0], /could not start\. Could not load assets\/models\/runtime\/saloon-doors\/pair\.glb \(404\)/);

  // file mode: core bundle at startup, other groups on first use, data URIs.
  const castle = "assets/models/castle/Castle_Wall_4m.glb",
    castleBytes = fs.readFileSync(path.join(root, castle));
  const table = {
    [door]: uri(doorBytes, "model/gltf-binary"),
    [saloon]: uri(saloonBytes, "model/gltf-binary"),
    "img/items/prop_ammo1.png": uri(png, "image/png"),
    [castle]: uri(castleBytes, "model/gltf-binary"),
  };
  const file = loader("file:", { table });
  await file.A.started;
  assert.deepEqual(file.scripts, ["offline/core.js"]);
  assert.ok(Buffer.from(file.A.preloadedBytes(saloon)).equals(saloonBytes));
  assert.equal(file.A.url("img/items/prop_ammo1.png"), table["img/items/prop_ammo1.png"]);
  assert.equal(file.A.url("img/not-bundled.png"), "img/not-bundled.png", "unbundled images fall back to their path");
  assert.ok(Buffer.from(await file.A.bytes(castle)).equals(castleBytes));
  assert.deepEqual(file.scripts, ["offline/core.js", "offline/models-castle.js"], "castle bundle loads on first use, once");
  await file.A.bytes(castle);
  assert.equal(file.scripts.length, 2);
  await assert.rejects(file.A.bytes("assets/models/castle/Unknown.glb"), /not in the offline copy/);

  // file mode without bundles: readable instructions, nothing started.
  const missing = loader("file:", { missingGroups: ["core"] });
  await missing.A.started;
  assert.match(missing.alerts[0], /npm run build:offline, or open the game with npm start/);

  // Muzzle editor page: no startup models or bundles.
  const muzzle = loader("file:", { overrides: { FRONTIER_ASSET_STARTUP: [], FRONTIER_ASSET_GROUPS: [] } });
  await muzzle.A.started;
  assert.deepEqual(muzzle.scripts, []);
  assert.equal(muzzle.A.groupOf("img/characters/$Candy 1.png"), "characters");

  // Offline build: byte-identical, grouped by the loader's own rule.
  const offline = require("../tools/build-offline.cjs");
  const summary = offline.build(root);
  const groupOf = offline.groupRule(root);
  const expected = offline.listAssets(root);
  const installed = {};
  for (const name of Object.keys(summary.bundles)) {
    const sandbox = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(root, "offline", name + ".js"), "utf8"), sandbox);
    for (const [p, data] of Object.entries(sandbox.window.FrontierOfflineAssets)) {
      assert.equal(groupOf(p), name, p + " is in its loader group");
      assert.ok(Buffer.from(data.slice(data.indexOf(",") + 1), "base64").equals(fs.readFileSync(path.join(root, p))), p + " is byte-identical");
      installed[p] = true;
    }
  }
  assert.deepEqual(Object.keys(installed).sort(), expected, "every manifest asset is bundled exactly once");
  for (const p of [door, saloon, "img/characters/$Candy 1.png", "img/skyboxes/SkyBox_4.png", castle, "img/materials/trees/$$Joshua Tree 1.png"])
    assert.ok(installed[p], p + " is available offline");

  // Every outdoor bank entry names a real file whose hash matches its record.
  const outdoor = fs.readFileSync(path.join(root, "src/outdoor-assets.js"), "utf8");
  const crypto = require("node:crypto");
  let outdoorCount = 0;
  for (const m of outdoor.matchAll(/"image":\s*"([^"]+)",(?:(?!"image")[\s\S])*?"sha256":\s*"([0-9a-f]{64})"/g)) {
    outdoorCount++;
    assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(root, m[1]))).digest("hex"), m[2], m[1] + " matches its recorded hash");
  }
  assert.ok(outdoorCount >= 38, "outdoor bank entries checked: " + outdoorCount);

  // No embedded base64 asset copies remain in maintained source.
  const scan = [];
  for (const dir of ["src", "assets", "js", "plugins"])
    (/* @function offlineAssets1600.walk — Inputs: directory. Appends .js files below it. */ function walk(d) {
      for (const e of fs.readdirSync(path.join(root, d), { withFileTypes: true }))
        if (e.isDirectory()) walk(d + "/" + e.name);
        else if (e.name.endsWith(".js")) scan.push(d + "/" + e.name);
    })(dir);
  for (const f of scan) {
    const text = fs.readFileSync(path.join(root, f), "utf8");
    assert.ok(!/[A-Za-z0-9+/]{20000,}/.test(text), f + " contains no large embedded base64 data");
    assert.ok(fs.statSync(path.join(root, f)).size < 2 * 1048576, f + " is under 2 MB");
  }

  // Size budget and ignore rules.
  const sizes = require("../tools/check-asset-sizes.cjs");
  const rules = sizes.patterns("# c\ndocs/\n*.md\n/serve.cjs\nnode_modules\n");
  assert.ok(sizes.ignored(rules, "docs", true) && !sizes.ignored(rules, "docs", false));
  assert.ok(sizes.ignored(rules, "img/a/README.md", false) && sizes.ignored(rules, "serve.cjs", false) && !sizes.ignored(rules, "src/serve.cjs", false));
  assert.throws(/* @function offlineAssets1600.negation — Inputs: none. Parses an unsupported rule. */ function () { sizes.patterns("!keep.md"); }, /not supported/);
  const report = sizes.check(root);
  assert.deepEqual(report.tooLarge, [], "no deployable file exceeds 25 MiB");
  assert.equal(report.tooMany, false);
  const deployed = new Set(sizes.inventory(root).map(/* @function offlineAssets1600.deployedPath — Inputs: file record. Returns its path. */ function (f) { return f.path; }));
  for (const p of ["index.html", "src/asset-source.js", door, castle, "img/skyboxes/SkyBox_1.png"]) assert.ok(deployed.has(p), p + " is deployed");
  for (const p of deployed) assert.ok(!/^(docs|tests|tools|offline|reference|node_modules)\//.test(p) && !p.endsWith(".md"), p + " should not be deployed");

  console.log("PASS separate asset files: FrontierAssets http/file modes, startup order and failures, byte-identical offline bundles (" + expected.length + " files), outdoor hashes, no embedded copies, Cloudflare size budget (" + report.files + " deployable files).");
})().catch(/* @function offlineAssets1600.fail — Inputs: error. Prints it and fails the run. */ function (error) {
  console.error(error);
  process.exitCode = 1;
});
