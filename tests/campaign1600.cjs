// October 15, 2026: campaign Area/Map structure contracts (src/campaign.js).
// Covers folder migration, reconciliation invariants, every author operation,
// input immutability and readable rejections. Pure data: no DOM or storage.
const fs = require("fs"),
  vm = require("vm"),
  path = require("path"),
  assert = require("node:assert/strict");
const context = vm.createContext({ structuredClone, JSON });
vm.runInContext(fs.readFileSync(path.join(__dirname, "../src/campaign.js"), "utf8"), context);
const C = context.FrontierCampaign;

/* @function campaign1600.plain — Inputs: value produced inside the VM context. Returns an equivalent plain object from this realm so deepStrictEqual compares data, not prototypes. */
function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

/* @function campaign1600.areaIds — Inputs: campaign record. Returns its area IDs in order, for compact ordering assertions. */
function areaIds(campaign) {
  const out = [];
  for (const area of campaign.areas) out.push(area.id);
  return out;
}

/* @function campaign1600.areaNames — Inputs: campaign record. Returns its area display names in order. */
function areaNames(campaign) {
  const out = [];
  for (const area of campaign.areas) out.push(area.name);
  return out;
}

/* @function campaign1600.rejects — Inputs: FrontierCampaign operation name, argument list and expected message pattern. Returns nothing; asserts the operation throws an Error whose message matches, proving the rejection is readable rather than a crash. */
function rejects(operation, args, pattern) {
  let error = null;
  try {
    C[operation](...args);
  } catch (caught) {
    error = caught;
  }
  assert.ok(error, operation + " should reject");
  assert.match(error.message, pattern);
}

const maps = [
  { id: "demo", folder: "" },
  { id: "saloon", folder: "Dustwater" },
  { id: "saloon-cellar", folder: "Dustwater" },
  { id: "mine", folder: "Old mine" },
  { id: "forest" },
];

// Migration: folders become areas in first-seen order; no folder → Main area.
const derived = plain(C.derive(maps));
assert.deepEqual(derived, {
  areas: [
    { id: "main-area", name: "Main area", maps: ["demo", "forest"] },
    { id: "dustwater", name: "Dustwater", maps: ["saloon", "saloon-cellar"] },
    { id: "old-mine", name: "Old mine", maps: ["mine"] },
  ],
});
assert.deepEqual(plain(C.reconcile(undefined, maps)), derived, "missing campaign is derived");
assert.deepEqual(plain(C.validate(derived, maps)), derived, "derived campaign is valid");

// Reconcile: drops unknown/duplicate maps, fixes bad IDs, places new maps.
const damaged = {
  areas: [
    { id: "town", name: "Town", maps: ["demo", "ghost", "demo"] },
    { id: "town", name: "Town copy", maps: ["saloon"] },
    null,
    { id: "bad id!", name: "  ", maps: [] },
  ],
};
const fixed = plain(C.reconcile(damaged, maps, "town-copy"));
assert.deepEqual(areaIds(fixed), ["town", "town-copy", "untitled-area"]);
assert.deepEqual(fixed.areas[0].maps, ["demo"]);
assert.deepEqual(fixed.areas[1].maps, ["saloon", "saloon-cellar", "mine", "forest"], "unplaced maps join the preferred area");
assert.equal(fixed.areas[2].name, "Untitled area");
rejects("validate", [damaged, maps], /exactly once/);
assert.deepEqual(plain(C.reconcile({ areas: [] }, [])).areas, [{ id: "main-area", name: "Main area", maps: [] }]);

// Author operations return new records and leave the input unchanged.
const before = JSON.stringify(derived);
const added = C.addArea(derived, "  Dustwater ", 1);
assert.equal(added.id, "dustwater-2", "IDs stay unique");
assert.deepEqual(areaNames(plain(added.campaign)), ["Main area", "Dustwater", "Dustwater", "Old mine"]);
rejects("addArea", [derived, "   "], /Enter a name/);
rejects("addArea", [derived, "x".repeat(81)], /80 characters/);

const renamed = plain(C.renameArea(derived, "old-mine", "Abandoned mine"));
assert.equal(renamed.areas[2].name, "Abandoned mine");
assert.equal(renamed.areas[2].id, "old-mine", "rename keeps the stable ID");
rejects("renameArea", [derived, "nowhere", "X"], /no longer exists/);

const merged = plain(C.removeArea(derived, "dustwater", "main-area"));
assert.deepEqual(areaIds(merged), ["main-area", "old-mine"]);
assert.deepEqual(merged.areas[0].maps, ["demo", "forest", "saloon", "saloon-cellar"], "maps move, never disappear");
rejects("removeArea", [derived, "dustwater", "dustwater"], /different area/);
rejects("removeArea", [{ areas: [derived.areas[0]] }, "main-area", "main-area"], /at least one area/);

assert.deepEqual(areaIds(plain(C.moveArea(derived, "old-mine", -1))), ["main-area", "old-mine", "dustwater"]);
assert.deepEqual(areaIds(plain(C.moveArea(derived, "main-area", -1))), ["main-area", "dustwater", "old-mine"], "clamped at the top");
rejects("moveArea", [derived, "main-area", 0.5], /whole number/);

const moved = plain(C.moveMap(derived, "forest", "old-mine", 0));
assert.deepEqual(moved.areas[0].maps, ["demo"]);
assert.deepEqual(moved.areas[2].maps, ["forest", "mine"]);
assert.deepEqual(plain(C.moveMap(derived, "saloon-cellar", "dustwater", 0)).areas[1].maps, ["saloon-cellar", "saloon"], "reorder within an area");
rejects("moveMap", [derived, "ghost", "main-area"], /not part of this campaign/);
rejects("moveMap", [derived, "demo", "nowhere"], /no longer exists/);
assert.equal(C.areaOf(derived, "mine").id, "old-mine");
assert.equal(C.areaOf(derived, "ghost"), null);

assert.equal(JSON.stringify(derived), before, "operations never mutate their input");
console.log("PASS campaign areas: folder migration, reconcile invariants, add/rename/remove/move area, move/reorder map, immutability and readable rejections.");
