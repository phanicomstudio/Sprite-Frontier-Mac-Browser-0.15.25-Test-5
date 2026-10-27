// October 26: 0.16.6 supersedes one-foot default with five-foot minimum.
// October 26: exercise pairing ambiguity, actual facing convention and atomic transforms independently of DOM.
const assert=require('node:assert/strict');
require('../src/local-lighting.js');require('../src/hub-workbench.js');require('../src/authoring-scene.js');
const door={id:'saloon',x:12,y:18,spatial:{visual:'model',rotation:[0,0,180]},extensions:{hub:{kind:'door',map:'street',entrance:'auto-door'}}};
const world={events:[door],objects:[],interior:{primitives:[{id:'wall',x:3,y:4,z:0,yaw:0}]}};
const D=FrontierHubWorkbench.doorArrival163;
let entry=D(world,'street','auto-door');assert.equal(entry.doorId,'saloon');assert(Math.abs(entry.y-16.476)<1e-8);assert(Math.cos(entry.yaw)<-.99);
assert.equal(D(world,'missing','auto-door'),null);world.events.push({...structuredClone(door),id:'second'});assert.equal(D(world,'street','auto-door'),null);assert.equal(D(world,'street','door:saloon').doorId,'saloon');world.events.pop();
let commits=0;const scene=FrontierAuthoringScene.create({world:/* @function iteration163.world — Inputs: none. Returns synthetic authored fixture for transactional adapter checks. */function(){return world;},active:/* @function iteration163.active — Inputs: none. Returns fixture cell ID, with no mutation. */function(){return 'room';},editing:/* @function iteration163.editing — Inputs: none. Returns authoring mode for this fixture. */function(){return true;},mutate:/* @function iteration163.commit — Inputs: validated adapter operation. Executes and counts a fixture transaction; returns success. Production rollback is exercised separately in browser tests. */function(operation){operation();commits++;return true;}});
const ref={kind:'event',id:'saloon',cellId:'room'};
scene.transform163(ref,'move',0,2);assert.equal(door.x,14);assert.equal(commits,1);
scene.transform163(ref,'rotate',2,Math.PI/2);entry=D(world,'street','door:saloon');assert(entry.x>door.x);assert(Math.sin(entry.yaw)>.99);assert.equal(commits,2);
assert.throws(/* @function iteration163.rejectNonfinite — Inputs: none. Attempts a nonfinite move; expected rejection must not increment history. */function(){scene.transform163(ref,'move',0,Infinity);});assert.equal(commits,2);
assert.equal(FrontierLocalLighting.appearance163().mode,'legacy');assert.equal(FrontierLocalLighting.appearanceFilter163({mode:'neutral'}),'none');
assert.throws(/* @function iteration163.rejectSoftness — Inputs: none. Attempts an out-of-bounds image filter; authoritative validation rejects it before save. */function(){FrontierLocalLighting.appearance163({softness:50});});
console.log('PASS reciprocal ambiguity, named pairs, five-foot offset, away-facing after rotation, single transform commits, bounded rendering profiles');

// Outdoor-only safety: even an enabled sun cannot produce a draw inside an interior.
assert.equal(FrontierLocalLighting.spriteSunShadow163({}, {sourceWorld:{interior:{},lighting:{enabled:true}}},{},{kind:'player'},null),false);
require('../src/fog.js');assert.equal(FrontierFog.defaults.color,'#665263');assert.equal(FrontierLocalLighting.validate().ambient,.4);assert(FrontierLocalLighting.validate().enabled);
console.log('PASS default darkness, Dusty Plum distance fog and categorical indoor sun-shadow exclusion');
