/* Physical acceptance for native room construction. These cases check walking,
 * landing, headroom, independent connector alignment and persistent cell data. */
const assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const scope = {console}; scope.globalThis = scope;
for (const name of ['building-kit', 'room-physics']) vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/' + name + '.js'), 'utf8'), scope);
const kit = scope.FrontierBuildingKit, physics = scope.FrontierRoomPhysics;
const room = kit.shell({x: 10, y: 10, width: 8, depth: 8, height: 3});
assert.equal(room.primitives.length, 6);
assert.equal(room.primitives[0].moduleType,'floor');assert(physics.walkable({interior:room},10,10),'Independent shell floor contributes actual support in layout-style queries');
assert.equal(physics.blocked({interior: room}, 10, 10, 0), false, 'Clear room center must be walkable');
assert.equal(physics.blocked({interior: room}, 14, 10, 0), true, 'Visible east wall blocks the body');
assert.equal(physics.vertical({interior: room}, {x: 10, y: 10, z: 0, height: 1.65}, 2), 1.35, 'Jumping stops at ceiling underside');
const stairs = kit.stairs({x: 10, y: 10, width: 1.5, run: 3.6, rise: 2.4, steps: 12});
const world = {interior: {primitives: stairs, blockers: []}};
const actor = {x: 10, y: 8, z: 0, height: 1.65, grounded: true};
for (let i = 0; i < 12; i++) {
  const y = 8.2 + .3 * (i + .5), top = physics.step(world, actor, 10, y, .3);
  assert(top !== null, 'Each authored stair must permit walking step ' + i);
  assert(Math.abs(top - .2 * (i + 1)) < 1e-6);
  Object.assign(actor, {y, z: top});
}
assert(Math.abs(actor.z - 2.4) < 1e-6, 'Walking reaches upper landing height');
assert.equal(physics.vertical(world, {...actor, z: 3}, 1), 2.4, 'Falling onto the last tread lands on its geometry');
assert.equal(physics.blocked(world, actor.x, actor.y, actor.z), false, 'Landed body is not trapped in its support');
assert.equal(physics.step(world, {...actor, z: 0, grounded: false}, 10, 10, .3), null, 'Airborne motion cannot stair-snap');
const lowCeiling = kit.box('low', 'Low ceiling', 10, 8.35, 1.75, 2, 1, .2);
assert.equal(physics.step({interior: {primitives: [stairs[0], lowCeiling]}}, {x: 10, y: 8, z: 0, height: 1.65, grounded: true}, 10, 8.35, .3), null, 'Insufficient headroom rejects step');
const floor = kit.box('a', 'Floor A', 5, 5, -.2, 2, 2, .2), proposed = kit.box('b', 'Floor B', 7.15, 5, -.2, 2, 2, .2);
const snapped = kit.snap(proposed, [floor]);
assert.equal(snapped.primitive.x, 7); assert.equal(proposed.x, 7.15, 'Preview snapping does not mutate input');
assert.equal(snapped.connection.destination, 'right');
assert.equal(kit.snap({...proposed, x: 10}, [floor]).connection, null, 'Distant modules do not jump to unrelated connectors');
const upper=kit.box('upper','Upper landing',10,12.95,2.2,1.5,2,.2);upper.moduleType='floor';
const upperSnap=kit.snap(upper,[stairs.at(-1)]);assert(upperSnap.connection);assert(Math.abs(upperSnap.primitive.y-12.8)<1e-6);assert(Math.abs(upperSnap.primitive.z+upperSnap.primitive.h-2.4)<1e-6,'Landing joins the tread top, not the column centre');
const lower=kit.box('lower','Lower landing',10,7.05,-.2,1.5,2,.2);lower.moduleType='floor';const lowerSnap=kit.snap(lower,[stairs[0]]);assert(lowerSnap.connection);assert(Math.abs(lowerSnap.primitive.y-7.2)<1e-6);assert(Math.abs(lowerSnap.primitive.z+lowerSnap.primitive.h)<1e-6,'Lower landing joins the riser base');
// October 13: direct yaw edits must rotate stair landing anchors along with geometry.
for(const yaw of [Math.PI/2,Math.PI,-Math.PI/2,.37]){
 const step={...stairs[0],yaw},anchors=kit.connectors(step),direction=[-Math.sin(yaw),Math.cos(yaw)];
 const downhill=anchors.find(/* @function buildingTest.downhillAnchor — Inputs: rotated connector. Returns whether its horizontal normal opposes the step's rotated ascent direction. Does not mutate authored metadata. */function(anchor){return anchor.normal[0]*direction[0]+anchor.normal[1]*direction[1]<-.999;});
 assert(downhill);assert(Math.abs(downhill.point[2])<1e-9,'Rotated lower connector retains riser-base elevation');
 assert.deepEqual(step.stairDirection,stairs[0].stairDirection,'Connector calculation leaves authored baseline direction unchanged');
}
const restored = JSON.parse(JSON.stringify(room));
assert.equal(physics.blocked({interior: restored}, 14, 10, 0), true, 'Reloaded geometry retains collision');
console.log('PASS native room shell, connectors, walkable stairs, landing, ceiling headroom and persistence');
