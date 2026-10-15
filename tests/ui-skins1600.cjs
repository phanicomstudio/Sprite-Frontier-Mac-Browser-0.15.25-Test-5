// October 15, 2026 (0.15.28): interface skin manifests and choice rules
// (src/ui-skins.js) with a minimal fake DOM, plus the shipped Phanicom pack:
// it validates, its images exist, and its rectangles sit on its images.
const fs = require("node:fs"),
  vm = require("node:vm"),
  path = require("node:path"),
  assert = require("node:assert/strict");
const root = path.join(__dirname, "..");

/* @function uiSkins1600.fakeElement — Inputs: none. Returns an object with the parts of a DOM element ui-skins.js uses: style, classList, dataset, querySelector for a child <img>, removeAttribute. */
function fakeElement() {
  const classes = new Set();
  const img = { dataset: {}, hidden: false, src: "", /* @function uiSkins1600.imgRemoveAttribute — Inputs: name. Clears src. */ removeAttribute() { this.src = ""; } };
  return {
    style: { props: {}, /* @function uiSkins1600.setProperty — Inputs: name, value. Records a custom property. */ setProperty(k, v) { this.props[k] = v; } },
    dataset: {},
    img,
    classList: {
      /* @function uiSkins1600.toggle — Inputs: class name and force flag. Adds or removes it. */
      toggle(name, on) {
        if (on) classes.add(name);
        else classes.delete(name);
      },
      /* @function uiSkins1600.contains — Inputs: class name. Returns whether it is set. */
      contains(name) {
        return classes.has(name);
      },
    },
    /* @function uiSkins1600.querySelector — Inputs: selector. Returns the device's frame image for ":scope > img", or a fake inspection screen. */
    querySelector(selector) {
      return selector === ":scope > img" ? img : (this.inner ||= fakeElement());
    },
  };
}

/* @function uiSkins1600.load — Inputs: stored preference (or undefined) and pack index. Returns { S, html, devices, ids, events, store, scripts } after evaluating src/ui-skins.js in a sandbox. Pack scripts requested by load() are recorded, not run. */
function load(saved, packs = [{ id: "phanicom-devices", name: "Phanicom devices" }, { id: "brass", name: "Brass" }]) {
  const store = new Map(saved ? [["frontier.skin.1600", saved]] : []);
  const devices = { ".remoteDevice": fakeElement(), ".portraitDevice": fakeElement(), ".combinedDevice": fakeElement() };
  const ids = { pauseArtwork: fakeElement(), journalButton: fakeElement(), remoteInventory: fakeElement(), remoteResume: fakeElement(), remoteAsk: fakeElement(), equipmentScreen: fakeElement() };
  const html = fakeElement();
  const events = [],
    scripts = [];
  const context = {
    FrontierSkinPacks: packs,
    console: { /* @function uiSkins1600.quietWarn — Inputs: ignored. Silences expected load warnings. */ warn() {} },
    localStorage: {
      /* @function uiSkins1600.getItem — Inputs: key. Returns the stored value or null. */
      getItem(k) {
        return store.has(k) ? store.get(k) : null;
      },
      /* @function uiSkins1600.setItem — Inputs: key and value. Stores it. */
      setItem(k, v) {
        store.set(k, v);
      },
    },
    document: {
      documentElement: html,
      /* @function uiSkins1600.docQuery — Inputs: selector. Returns the matching fake device. */
      querySelector(s) {
        return devices[s] || null;
      },
      /* @function uiSkins1600.byId — Inputs: element ID. Returns the matching fake element. */
      getElementById(id) {
        return ids[id] || null;
      },
      /* @function uiSkins1600.createElement — Inputs: tag. Returns a fake script element. */
      createElement() {
        return { /* @function uiSkins1600.scriptRemove — Inputs: none. No-op. */ remove() {} };
      },
      head: { /* @function uiSkins1600.headAppend — Inputs: script. Records its source. */ append(s) { scripts.push(s.src); } },
    },
    Image: class {
      /* @function uiSkins1600.Image — Inputs: none. Builds a fake image. */
      constructor() {
        this.src = "";
      }
    },
    CustomEvent: class {
      /* @function uiSkins1600.CustomEvent — Inputs: type and init. Builds a minimal event. */
      constructor(type, init) {
        this.type = type;
        this.detail = init.detail;
      }
    },
    Option: class {
      /* @function uiSkins1600.Option — Inputs: label and value. Builds an option record. */
      constructor(label, value) {
        this.label = label;
        this.value = value;
      }
    },
    /* @function uiSkins1600.dispatchEvent — Inputs: event. Records it. */
    dispatchEvent(e) {
      events.push(e);
    },
    /* @function uiSkins1600.addEventListener — Inputs: ignored. No-op. */
    addEventListener() {},
  };
  context.globalThis = context;
  vm.runInNewContext(fs.readFileSync(path.join(root, "src/ui-skins.js"), "utf8"), context);
  return { S: context.FrontierSkins, html, devices, ids, events, store, scripts, context };
}

/* @function uiSkins1600.manifest — Inputs: overrides. Returns a valid sample manifest with the overrides applied. */
function manifest(overrides = {}) {
  return {
    schema: "sprite-frontier-skin/1",
    id: "brass",
    name: "Brass",
    controls: { image: "remote.png", hotspots: { journal: [10, 10, 20, 5], inventory: [40, 10, 20, 5] } },
    portrait: { frames: ["frame.png"] },
    status: { image: "status.webp", screens: { equipment: [10, 10, 80, 30], inspection: [10, 50, 80, 30] } },
    pause: { image: "pause.jpg", menu: [20, 60, 60, 30], settings: [10, 10, 80, 80] },
    ...overrides,
  };
}

// Validation: paths stay inside the pack; rectangles are sane; errors are readable.
let t = load();
const ok = t.S.validate(manifest());
assert.equal(ok.modules.controls.image, "skins/brass/remote.png");
assert.deepEqual(JSON.parse(JSON.stringify(ok.modules.portrait.frames)), ["skins/brass/frame.png"]);
assert.equal(ok.modules.controls.rects.resume, undefined, "hotspots are optional");
for (const [bad, message] of [
  [{ schema: "x" }, /schema/],
  [{ id: "minimal" }, /not "minimal"/],
  [{ id: "Bad Id" }, /lowercase/],
  [{ name: "" }, /1–60/],
  [{ controls: { image: "../escape.png", hotspots: {} } }, /inside the skin folder/],
  [{ controls: { image: "https://x/y.png", hotspots: {} } }, /inside the skin folder/],
  [{ controls: { image: "remote.gif", hotspots: {} } }, /PNG, JPEG or WebP/],
  [{ controls: { image: "r.png", hotspots: { journal: [10, 10, 0, 5] } } }, /lie on its image/],
  [{ controls: { image: "r.png", hotspots: { journal: [10, 10, 5] } } }, /\[x, y, width, height\]/],
  [{ status: { image: "s.png", screens: { equipment: [1, 1, 10, 10] } } }, /equipment and inspection/],
  [{ pause: { image: "p.png", menu: [1, 1, 10, 10] } }, /menu and settings/],
  [{ portrait: { frames: [] } }, /1–4 images/],
])
  assert.throws(/* @function uiSkins1600.badManifest — Inputs: none. Validates one broken manifest. */ function () { t.S.validate(manifest(bad)); }, message);
const partial = t.S.validate({ schema: "sprite-frontier-skin/1", id: "brass", name: "Brass", status: manifest().status });
assert.deepEqual(JSON.parse(JSON.stringify(Object.keys(partial.modules))), ["status"], "a pack may supply only some devices");

// Default: campaign → phanicom-devices, minimal frames until its script registers.
assert.equal(t.S.choice(), "campaign");
assert.equal(t.html.dataset.skin, "minimal", "minimal frames while the pack loads");
assert.deepEqual(t.scripts, ["skins/phanicom-devices/skin.js"], "the wanted pack is requested");
t.S.register({ ...manifest(), id: "phanicom-devices", name: "Phanicom devices" });
assert.equal(t.html.dataset.skin, "phanicom-devices");
assert.equal(t.html.dataset.skinControls, "framed");
assert.ok(t.devices[".remoteDevice"].classList.contains("skinFramed"));
assert.equal(t.devices[".remoteDevice"].img.src, "skins/phanicom-devices/remote.png");
assert.equal(t.ids.journalButton.style.left, "10%");
assert.equal(t.ids.remoteResume.style.left, "", "a hotspot the pack omits keeps the stylesheet position (inline cleared)");
assert.equal(t.html.style.props["--skin-pause-menu-y"], "60%");
assert.equal(t.S.portraitFrames().length, 1);
assert.equal(t.events.at(-1).type, "frontier-skin-change");

// Player chooses Minimal: images removed, inline geometry cleared, stored.
t.S.choose("minimal");
assert.equal(t.html.dataset.skin, "minimal");
assert.ok(t.devices[".combinedDevice"].classList.contains("skinPlain"));
assert.equal(t.devices[".remoteDevice"].img.hidden, true);
assert.equal(t.ids.journalButton.style.left, "", "minimal stylesheet takes over");
assert.equal(t.html.style.props["--skin-pause-image"], "none");
assert.equal(t.S.portraitFrames().length, 0);
assert.equal(t.store.get("frontier.skin.1600"), "minimal");
assert.throws(/* @function uiSkins1600.unlisted — Inputs: none. Chooses an unlisted skin. */ function () { t.S.choose("chrome"); }, /listed interface/);

// Campaign default applies only while the player follows the campaign.
t.S.setCampaignDefault("brass");
assert.equal(t.html.dataset.skin, "minimal", "player choice wins");
t.S.choose("campaign");
assert.ok(t.scripts.includes("skins/brass/skin.js"), "campaign pack is loaded on demand");
t.S.register(manifest());
assert.equal(t.html.dataset.skin, "brass");
t.S.setCampaignDefault("not-installed");
assert.equal(t.html.dataset.skin, "phanicom-devices", "unknown campaign skins fall back to the default pack");

// Saved choice and options list.
assert.equal(load("minimal").S.choice(), "minimal");
assert.equal(load("gone").S.choice(), "campaign", "a pack removed since is ignored");
assert.deepEqual(JSON.parse(JSON.stringify(load().S.options(true))).map(/* @function uiSkins1600.optionValue — Inputs: option. Returns its value. */ function (o) { return o.value; }), ["campaign", "minimal", "phanicom-devices", "brass"]);

// The shipped Phanicom pack: valid, images present, rectangles on its images.
const packContext = { FrontierSkins: { /* @function uiSkins1600.capture — Inputs: manifest. Stores it for checking. */ register(m) { packContext.manifest = m; } } };
vm.runInNewContext(fs.readFileSync(path.join(root, "skins/phanicom-devices/skin.js"), "utf8"), packContext);
const pack = t.S.validate(packContext.manifest);
for (const entry of Object.values(pack.modules))
  for (const file of entry.frames || [entry.image]) assert.ok(fs.statSync(path.join(root, file)).size > 0, file + " exists");
assert.deepEqual(JSON.parse(JSON.stringify(Object.keys(pack.modules).sort())), ["controls", "pause", "portrait", "status"]);
const index = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "skins/index.js"), "utf8"), { window: index });
assert.deepEqual(JSON.parse(JSON.stringify(index.FrontierSkinPacks)).map(/* @function uiSkins1600.packId — Inputs: index entry. Returns its ID. */ function (p) { return p.id; }), ["phanicom-devices"]);
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert.ok(!/img\/ui\//.test(html) && !/img\/ui\//.test(fs.readFileSync(path.join(root, "style.css"), "utf8")), "no hard-coded device art paths remain");
assert.ok(html.indexOf("skins/index.js") < html.indexOf("src/ui-skins.js") && html.indexOf("src/ui-skins.js") < html.indexOf("skins/phanicom-devices/skin.js"), "index, engine, default pack load in order");

console.log("PASS interface skins: manifest validation and readable errors, partial packs, default pack, player choice, campaign default, fallback for unknown packs, shipped Phanicom pack files and geometry.");
