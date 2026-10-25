"use strict";
const assert = require("node:assert/strict");
require("../src/model-materials.js");
const api = FrontierModelMaterials;
const source = {
  0: {
    texture: "assets/materials/castle.png",
    repeatU: 2,
    repeatV: 3,
    rotation: 90,
    offsetU: 0.25,
    offsetV: -0.5,
    preserveAspect: true,
  },
};
const checked = api.validate(source);
checked[0].offsetU = 1;
assert.equal(source[0].offsetU, 0.25);
globalThis.FrontierRoomSurfaces = {
  get: /* @function modelMaterialsTest.image — Inputs: project texture URL. Returns: immutable 2:1 fixture image dimensions; does not decode or copy buffers. Isolates UV math from real image/GPU acceptance. */ () => ({
    width: 200,
    height: 100,
  }),
};
const original = [0.5, 0.25],
  mapping = api.mapping(api.validate(source)[0]),
  uv = api.uv(mapping, original);
assert.ok(Math.abs(uv[0] - -1.25) < 1e-12);
assert.ok(Math.abs(uv[1] - 0.5) < 1e-12);
assert.deepEqual(original, [0.5, 0.25]);
assert.equal(api.uv(null, original), original);
assert.deepEqual(api.tint("#ff0000", [0.2, 0.3, 0.4, 0.5]), [1, 0, 0, 0.5]);
for (const invalid of [
  { 0: { texture: "../outside.png" } },
  { 0: { texture: "https://example.com/image.png" } },
  { 0: { repeatU: 0 } },
  { 0: { rotation: Infinity } },
  { 256: {} },
  { 0: { color: "#fff" } },
])
  assert.throws(
    /* @function modelMaterialsTest.reject — Inputs: none; captures malformed instance mapping. Returns: validation only on erroneous acceptance; expected failures protect portable paths and numeric bounds. No source mutation. */ () =>
      api.validate(invalid),
  );
console.log(
  "PASS detached material slots, UV repeat/aspect/rotation/offset, retained alpha and portable resource bounds",
);
// October 13: reject a mixed slot even when another primitive supplies UVs.
const mixed = {
  json: { materials: [{}] },
  meshes: [[{ material: 0, uv: new Float32Array(2) }, { material: 0 }]],
};
assert.throws(
  /* @function modelMaterialsTest.mixedUV — Inputs: none. Returns validation only if incorrectly accepted; checks missing-UV rejection for a shared slot before adoption. No source mutation. */ () =>
    api.checkSlots(api.validate({ 0: { repeatU: 2 } }), mixed),
);
api.checkSlots(api.validate({ 0: { color: "#ffffff" } }), mixed);
assert.throws(
  /* @function modelMaterialsTest.missingSlot — Inputs: none. Returns validation only if invalid slot is accepted; verifies nonexistent source materials fail before project adoption. */ () =>
    api.checkSlots(api.validate({ 1: { color: "#ffffff" } }), mixed),
);
