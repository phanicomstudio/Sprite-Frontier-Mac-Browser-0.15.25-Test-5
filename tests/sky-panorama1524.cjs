"use strict";
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm");
const scope = { console, structuredClone };
scope.window = scope;
for (const name of ["sky-panorama", "sky"])
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, "../src/" + name + ".js"), "utf8"),
    scope,
  );
assert.equal(scope.FrontierSkyPanorama.catalog.length, 4);
const settings = {
  enabled: true,
  layers: [],
  panorama: { asset: "sky-4", orientation: 45, wrapBlend: true },
};
assert.deepEqual(
  JSON.parse(JSON.stringify(scope.FrontierSky.validate(settings))),
  settings,
);
assert.equal(
  scope.FrontierSky.validate().panorama,
  undefined,
  "Historical procedural defaults stay unchanged",
);
for (const invalid of [
  { asset: "sky-5", orientation: 0, wrapBlend: true },
  { asset: "sky-1", orientation: NaN, wrapBlend: true },
  { asset: "sky-1", orientation: 36001, wrapBlend: true },
  { asset: "sky-1", orientation: 0, wrapBlend: "yes" },
])
  assert.throws(
    /* @function skyContracts.rejectInvalid — Inputs: none. Returns validation result or expected rejection for malformed fixture settings. No loading/side effects. */ function () {
      scope.FrontierSkyPanorama.validate(invalid);
    },
    /Invalid/,
  );
assert.equal(
  scope.FrontierSkyPanorama.status("sky-1").ready,
  false,
  "Status does not start loading",
);
assert.equal(
  scope.FrontierSkyPanorama.memoryBytes(),
  0,
  "Validation alone does not decode images",
);
// October 15, 2026 (0.15.27): supersedes the assets/skyboxes/sky-N.js data-script
// check. Skies load their PNG files through FrontierAssets; from disk, the
// generated offline bundle holds the same bytes (tests/offline-assets1600.cjs).
const skySource = fs.readFileSync(path.join(__dirname, "../src/sky-panorama.js"), "utf8");
assert(skySource.includes("FrontierAssets.imageURL(entry.url)"), "Skies load their PNG files through FrontierAssets");
assert(!/script\.src\s*=\s*"assets\/skyboxes\//.test(skySource), "No sky data scripts are requested");
for (let number = 1; number <= 4; number++)
  assert(fs.statSync(path.join(__dirname, "../img/skyboxes/SkyBox_" + number + ".png")).size > 0, "Sky PNG " + number + " exists");
console.log(
  "PASS per-map panorama schema, historical defaults, invalid settings and sky PNG files loaded through FrontierAssets",
);
