/* October 22, 2026: structural intent and normalized legacy ownership gates.
 * These exercise effective geometry and cell/type identity, not UI snapshots. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const scope={console,structuredClone};scope.globalThis=scope;
for(const file of ['building-kit','room-layout','authoring-scene'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/'+file+'.js'),'utf8'),scope);
const R=scope.FrontierRoomLayout,S=scope.FrontierAuthoringScene,bounds={width:40,height:40};
const recipe=R.validate({cells:[[0,0],[1,0],[0,1],[1,1]]},bounds),generated=R.compile(recipe);
let world={interior:{layout:recipe,primitives:generated.primitives},objects:[{id:'same',name:'Prop',x:8,y:8}],events:[{id:'same',name:'Event',x:9,y:8}]};
const before=structuredClone(world),deleted=world.interior.primitives.find(/* @function authoringTest.wall — Inputs: part. Returns first perimeter wall match; no writes. */function(p){return p.moduleType==='wall';});
world.interior.primitives=world.interior.primitives.filter(/* @function authoringTest.removeWall — Inputs: part. Returns whether it is not the intentional deletion target. */function(p){return p.id!==deleted.id;});
R.captureEdits(before,world);let roundTrip=R.validate(JSON.parse(JSON.stringify(world.interior.layout)),bounds);
assert(!R.compile(roundTrip,{},world.interior.primitives).primitives.some(/* @function authoringTest.noResurrection — Inputs: generated part. Returns deleted-ID match for absence assertion. */function(p){return p.id===deleted.id;}));
const raised={...roundTrip,height:4};assert(!R.compile(raised,{},world.interior.primitives).primitives.some(/* @function authoringTest.resizeSuppression — Inputs: part. Returns deleted ID match after compatible height resize. */function(p){return p.id===deleted.id;}));
const detachedWorld=structuredClone(before),detachBefore=structuredClone(detachedWorld),detach=detachedWorld.interior.primitives[0];delete detach.layoutGroup;delete detach.layoutBase;delete detach.layoutMaterial;
R.captureEdits(detachBefore,detachedWorld);assert.equal(R.compile(detachedWorld.interior.layout,{},detachedWorld.interior.primitives).primitives.some(/* @function authoringTest.noDuplicate — Inputs: generated part. Returns detached origin ID match. */function(p){return p.id===detach.id;}),false);
const paintedWorld=structuredClone(before),paintBefore=structuredClone(paintedWorld),painted=paintedWorld.interior.primitives[0];painted.texture='img/materials/walls/Tex_Castle_2.png';painted.z+=.4;
R.captureEdits(paintBefore,paintedWorld);const persisted=R.compile({...paintedWorld.interior.layout,height:4},{},[]).primitives[0];assert.equal(persisted.texture,painted.texture);assert.equal(persisted.z,painted.z);
assert.throws(/* @function authoringTest.topologyConflict — Inputs: none. Returns failed regeneration when an edited row loses its identity. Original ledger remains unchanged and recoverable. */function(){R.compile({...paintedWorld.interior.layout,cells:[[0,0]]},{},[]);},/conflict/);
assert.equal(paintedWorld.interior.layout.edits.parts[0].id,painted.id);
assert.equal(S.resolve(world,'a',{cellId:'b',kind:'event',id:'same'}),null);
assert.equal(S.resolve(world,'a',{cellId:'a',kind:'object',id:'same'}).name,'Prop');
assert.equal(S.resolve(world,'a',{cellId:'a',kind:'event',id:'same'}).name,'Event');
let active='a',commits=0;const scene=S.create({world:/* @function authoringTest.world — Inputs: none. Returns current fixture source; no writes. */function(){return world;},active:/* @function authoringTest.active — Inputs: none. Returns current fixture cell ID. */function(){return active;},editing:/* @function authoringTest.editing — Inputs: none. Returns true for authorized fixture authoring. */function(){return true;},mutate:/* @function authoringTest.commit — Inputs: action. Executes one fixture transaction and counts it. Production validation is separately tested through browser integration. */function(action){action();commits++;return true;},removeMany:/* @function authoringTest.remove — Inputs: owner targets. Returns whether exactly two typed targets are forwarded in one operation. */function(targets){return targets.length===2;}});
const refs=scene.list().filter(/* @function authoringTest.sameIds — Inputs: normalized reference. Returns fixture same-ID records. */function(r){return r.id==='same';});scene.select(refs);assert.equal(scene.selection().length,2);assert(scene.remove());scene.update(refs[0],{x:10});assert.equal(commits,1);assert.equal(world.objects[0].x,10);
assert.throws(/* @function authoringTest.rejectUnsupported — Inputs: none. Attempts unsupported object height, which must fail before a transaction. */function(){scene.update(refs[0],{h:3});},/specialized/);assert.equal(commits,1);
const snapshot=scene.snapshot(refs[0]);snapshot.name='Not source';assert.equal(world.objects[0].name,'Prop');active='b';assert.equal(scene.selection().length,0);
console.log('PASS persistent suppression/paint/transform through regeneration and serialization, detach prevents duplicates, topology conflict retains edits, typed cell/kind IDs, isolated snapshots and one owner transaction');
