/* October 12, 2026: runtime map ownership contract. Schema validation remains
 * covered by production project tests; this fixture isolates scene/persistence
 * boundaries with deliberately unavailable DOM and storage services. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
let installed=[],scenes=[],rejectScene=false;
const project={schema:'sprite-frontier-maps/1',active:'castle',models:[],gameplayDefaults:{health:100},templates:{entries:[]},maps:[{id:'castle',world:{spawn:{x:2,y:3,z:4}}},{id:'tower',world:{spawn:{x:5,y:6,z:7}}}]};
const root={
 FrontierMaps:{/* @function runtimeMapsTest.validate — Inputs: fixture project. Returns detached valid fixture; throws deliberately malformed input. Tests service ownership, not production schema rules. */validate(value){if(!value?.maps)throw Error('invalid fixture');return structuredClone(value);}},
 FrontierModelLibrary:{/* @function runtimeMapsTest.models — Inputs: model bundle array. Returns nothing; records installation to prove explicit export ownership. */restore(value){installed.push(structuredClone(value));}},
 FrontierEventTemplates:{/* @function runtimeMapsTest.compile — Inputs: saved definitions. Returns a detached compiled fixture; used to verify cache invalidation after restore. */compile(value){return structuredClone(value);}},
 FrontierMapIdentities:{/* @function runtimeMapsTest.resolve — Inputs: maps and zero-based fixture identity. Returns selected fixture map. Production numeric identity validation is separate. */resolve(maps,number){return maps[number];}}
};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/runtime-maps.js'),'utf8'),{window:root,structuredClone});
const service=root.FrontierRuntimeMaps.create({/* @function runtimeMapsTest.replace — Inputs: detached world and transfer options. Returns nothing; records scenes, or injects scene failure to verify active-ID rollback. */replace(world,options){if(rejectScene)throw Error('scene failed');scenes.push({world,options});}},project);
assert.equal(installed.length,1);service.load();assert.equal(service.active,'castle');assert.equal(scenes[0].world.spawn.z,4);
scenes[0].world.spawn.z=99;assert.equal(service.get('castle').world.spawn.z,4);
const options={travel:true,entry:{x:5,y:6,z:8,yaw:.5}};service.switchTo('tower',options);assert.equal(scenes[1].options,options);assert.equal(service.active,'tower');
assert.throws(/* @function runtimeMapsTest.unknown — Inputs: none. Returns attempted transfer; verifies unknown-cell rejection without scene mutation. */function(){service.switchTo('missing');},/Unknown runtime map/);
rejectScene=true;assert.throws(/* @function runtimeMapsTest.sceneFailure — Inputs: none. Returns attempted transfer; verifies failed replacement restores prior active identity. */function(){service.switchTo('castle');},/scene failed/);assert.equal(service.active,'tower');rejectScene=false;
const snapshot=service.snapshot();snapshot.maps[0].world.spawn.z=50;assert.equal(service.get('castle').world.spawn.z,4);
const defaults=service.gameplayDefaults;defaults.health=1;assert.equal(service.gameplayDefaults.health,100);
const bank=service.templateBank();assert.equal(service.templateBank(),bank);
service.restore(project);assert.notEqual(service.templateBank(),bank);assert.equal(service.active,'castle');
assert.throws(/* @function runtimeMapsTest.invalidRestore — Inputs: none. Returns attempted invalid restore; confirms validation precedes project replacement. */function(){service.restore({});},/invalid fixture/);assert.equal(service.active,'castle');
assert.equal(service.saveTemplate,undefined);assert.equal(service.undoTemplate,undefined);service.remember();
console.log('PASS runtime map ownership, active-cell startup, elevated transfer, rollback, save isolation and absence of authoring API');

// October 13, 2026: project capacity and scene ownership are independent.
const many = structuredClone(project);
many.maps = [];
for (let i = 0; i < 256; i++) many.maps.push({ id: 'cell-' + i, world: { spawn: { x: i, y: 0, z: 0 } } });
many.active = 'cell-0';
const selectedScenes = [];
const largeService = root.FrontierRuntimeMaps.create({
 /* @function runtimeMapsTest.largeReplace — Inputs: the detached selected world. Returns array length; records every scene installation, so dormant cells cannot silently be installed while loading a large project. No renderer is mocked beyond this explicit scene boundary. */
 replace(world) { return selectedScenes.push(world); }
}, many);
assert.equal(selectedScenes.length, 0);
largeService.load();
assert.equal(selectedScenes.length, 1);
assert.equal(selectedScenes[0].spawn.x, 0);
largeService.switchTo('cell-255');
assert.equal(selectedScenes.length, 2);
assert.equal(selectedScenes[1].spawn.x, 255);
assert.equal(largeService.snapshot().maps.length, 256);
console.log('PASS 256-cell runtime library installs only the selected scene on load and transfer');
