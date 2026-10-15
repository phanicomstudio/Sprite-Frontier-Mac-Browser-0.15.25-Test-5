/* October 12, 2026: authored arrival repair ownership. A layout commit must
 * recover each invalid entrance even when spawn X/Y remains valid, without
 * moving a deliberately authored independent platform's arrival height. */
'use strict';
const assert=require('node:assert/strict');require('../src/room-physics.js');require('../src/room-layout.js');
const layout={originX:2,originY:2,tile:2,z:2,cells:[[0,0]]};
const generated=[{id:'grid-floor',layoutGroup:'grid-layout',moduleType:'floor',x:3,y:3,z:1.8,w:2,d:2,h:.2,yaw:0},{id:'ceiling',moduleType:'ceiling',x:3,y:3,z:5,w:2,d:2,h:.2,yaw:0}];
const platform={id:'independent',moduleType:'floor',x:10,y:10,z:4.8,w:2,d:2,h:.2,yaw:0};
const world={spawn:{x:3,y:3,z:0},interior:{primitives:[...generated,platform],entrances:[{id:'supported',x:3,y:3,z:0,yaw:1},{id:'invalid',x:40,y:40,z:0,yaw:2},{id:'platform',x:10,y:10,z:5,yaw:3}]}};
FrontierRoomLayout.synchronizeArrivals(world,layout,generated);
assert.deepEqual(world.spawn,{x:3,y:3,z:2});assert.equal(world.interior.entrances[0].z,2);
assert.deepEqual(world.interior.entrances[1],{id:'invalid',x:3,y:3,z:2,yaw:2},'Invalid entrance is repaired independently of valid spawn');
assert.deepEqual(world.interior.entrances[2],{id:'platform',x:10,y:10,z:5,yaw:3},'Independent platform arrival retains its height and facing');
generated[0].z=2.5;FrontierRoomLayout.synchronizeArrivals(world,layout,generated);assert.equal(world.spawn.z,2.7,'Actual retained manual floor top overrides nominal layout height');assert.equal(world.interior.entrances[0].z,2.7);assert.equal(world.interior.entrances[2].z,5);
const before=JSON.stringify(world);FrontierRoomLayout.synchronizeArrivals(world,{...layout,cells:[]},[]);assert.equal(JSON.stringify(world),before,'Empty layout does not invent floor support or move authored arrivals');
world.spawn={x:10,y:10,z:5};world.interior.entrances[1]={id:'invalid',x:40,y:40,z:0,yaw:2};FrontierRoomLayout.synchronizeArrivals(world,layout,generated);assert.deepEqual(world.spawn,{x:10,y:10,z:5});assert.deepEqual(world.interior.entrances[1],{id:'invalid',x:10,y:10,z:5,yaw:2},'Recovery prefers the valid independent spawn and does not invent grid elevation there');
console.log('PASS raised/manual floor arrivals, independently invalid entrances, preserved platform height/facing and empty-layout ownership');
