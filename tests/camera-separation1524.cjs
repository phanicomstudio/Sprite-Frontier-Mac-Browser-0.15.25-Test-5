"use strict";
const assert = require("node:assert/strict");
require("../src/model-transform.js");
require("../src/model-scene.js");
require("../src/model-mesh-collision.js");
const collision = FrontierModelMeshCollision,
  T = FrontierModelTransform,
  plane = [
    [-2, 0, -2],
    [2, 0, -2],
    [2, 0, 2],
  ],
  half = [0.25, 0.25, 0.25],
  start = [0, -0.1, 0];
const translation = collision.triangleSeparation(plane, start, half);
assert(
  translation && translation[1] < 0,
  "Near-side volume resolves away from wall",
);
const end = [
  start[0] + translation[0],
  start[1] + translation[1],
  start[2] + translation[2],
];
assert.equal(
  collision.sweepTriangle(plane, end, end, half),
  null,
  "Repaired stationary volume is actually clear",
);
assert.equal(
  collision.triangleSeparation(plane, [0, -0.25, 0], half),
  null,
  "Tangency does not cause jitter",
);
assert.equal(
  collision.triangleSeparation([...plane].reverse(), start, half)[1],
  translation[1],
  "Winding does not reverse repair side",
);
const asset = {
  meshes: [
    [
      {
        positions: new Float32Array([-2, 0, -2, 2, 0, -2, 2, 0, 2, -2, 0, 2]),
        indices: new Uint16Array([0, 1, 2, 0, 2, 3]),
      },
    ],
  ],
  scene: { instances: [{ mesh: 0, matrix: T.identity() }] },
};
const matrix = T.matrix({
    position: [4, 8, 1],
    rotation: [0, 0, 37],
    scale: [2, 3, 0.7],
  }),
  normal = T.vector(T.matrix({ rotation: [0, 0, 37] }), [0, -1, 0], 0),
  center = [4 + normal[0] * 0.1, 8 + normal[1] * 0.1, 1],
  before = Array.from(asset.meshes[0][0].positions),
  tree = collision.build(asset),
  stats = {};
let corrections = 0,
  correction = collision.separation(asset, matrix, center, half, stats);
while (correction && corrections < 8) {
  for (let axis = 0; axis < 3; axis++) center[axis] += correction[axis];
  corrections++;
  correction = collision.separation(asset, matrix, center, half, stats);
}
assert(corrections > 0 && corrections < 8);
assert.equal(correction, null);
assert.equal(
  collision.query(asset, matrix, center, center, half),
  null,
  "Rotated nonuniform mesh camera endpoint is clear",
);
assert.equal(collision.build(asset), tree, "Repair shares existing asset BVH");
assert.deepEqual(
  Array.from(asset.meshes[0][0].positions),
  before,
  "No geometry mutation",
);
assert(stats.separationTriangles > 0);
console.log(
  "PASS static camera separation, winding/tangency, rotated nonuniform mesh clearance and shared immutable BVH",
);
