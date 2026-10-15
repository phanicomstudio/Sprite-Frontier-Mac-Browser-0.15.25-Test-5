const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const scope={console,Uint8Array,Uint16Array,Uint32Array,Float32Array,DataView,TextDecoder,atob,btoa};scope.window=scope;scope.globalThis=scope;
for(const name of ['model-transform','model-container','model-scene','model-library','model-events','prop-placement'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/'+name+'.js'),'utf8'),scope);
assert.equal(scope.FrontierModelEvents.validate({visual:'model',modelId:'building'}).collisionMode,'mesh','An unconfigured model uses geometry automatically');
assert.equal(scope.FrontierModelEvents.validate({visual:'model',modelId:'building',collisionMode:'none'}).collisionMode,'none','Explicit decorative override is preserved');
assert.equal(scope.FrontierModelEvents.validate({visual:'model',modelId:'building',collisionMode:'custom'}).collisionMode,'custom','Explicit custom collision is preserved');
const bounds={min:[-.5,-.05,-1],max:[.5,.05,1]},placement=scope.FrontierPropPlacement;
const wall=placement.fit(bounds,[5,8,2],[0,-1,0]);
assert.equal(wall.rotation[2],0);assert(Math.abs(wall.position[1]-7.945)<1e-8,'Back of painting clears outward wall plane');
assert.equal(wall.position[2],2,'Wall placement centers artwork at clicked height');
const floor=placement.fit(bounds,[5,8,0],[0,0,1],[2,2,2],0,0);
assert.equal(floor.position[2],2,'Non-bottom model pivot rests the geometry on floor');
const parent={id:'wall',x:5,y:8,z:0,w:4,d:.2,h:3};
const attached=placement.attachRoom(parent,wall),event={x:wall.position[0],y:wall.position[1],heightOffset:wall.position[2],spatial:{rotation:wall.rotation},extensions:{placement:attached}};
const world={events:[event],interior:{primitives:[parent]}};
parent.x+=3;parent.z+=1;placement.synchronize(world);
assert.equal(event.x,8);assert.equal(event.heightOffset,3,'Moving wall carries attached painting vertically');
const restored=JSON.parse(JSON.stringify(world));restored.interior.primitives[0].x+=1;placement.synchronize(restored);assert.equal(restored.events[0].x,9,'Attachment survives JSON reload');
const assetRoot=path.join(__dirname,'../assets/models/supplied');
for(const file of ['Antique_Box_Bed_V3.glb','Antique_Round_Table.glb','Painting_Bosch.glb','Straight_Stairs_Template.glb']){
 const bytes=new Uint8Array(fs.readFileSync(path.join(assetRoot,file))),id=file.replace(/\W/g,'-');
 scope.FrontierModelLibrary.importBundle({id,name:file,entry:file,files:{[file]:bytes}});
 const asset=scope.FrontierModelLibrary.get(id);assert(asset.scene.instances.length>0);
 const fitted=placement.fit(asset.scene.bounds,[10,10,0],[0,0,1],[1,1,1],0,0),corners=placement.corners(asset.scene.bounds,fitted.rotation,fitted.scale);
 assert(Math.abs(Math.min(...corners.map(/* @function propPlacementTest.bottom — Inputs: transformed corner. Returns: translated elevation; no mutation. */ function(p){return p[2]+fitted.position[2];})))<1e-6,file+' rests on actual floor bounds');
}
console.log('PASS floor/wall fitting, non-origin pivots, attached-wall movement/reload and real supplied GLB decoding');

// October 13: imported upright building hosts carry decorative attachments.
const modelHost={id:'host',x:10,y:20,heightOffset:2,spatial:{visual:'model',rotation:[0,0,90],scale:[2,3,1]}};
const decorTransform={position:[7,22,4],rotation:[0,0,180],scale:[1,1,1]};
const modelWorld={events:[modelHost]};
const modelDecor={id:'art',x:7,y:22,heightOffset:4,spatial:{visual:'model',rotation:[0,0,180],scale:[1,1,1]},extensions:{placement:placement.attachModel(modelWorld,modelHost,decorTransform)}};
modelWorld.events.push(modelDecor);modelHost.x+=5;modelHost.heightOffset+=1;modelHost.spatial.rotation[2]=180;
placement.synchronize(modelWorld);assert(Math.abs(modelDecor.x-13)<1e-8);assert(Math.abs(modelDecor.y-17)<1e-8);assert.equal(modelDecor.heightOffset,5);assert.equal(modelDecor.spatial.rotation[2],270);
const modelReload=JSON.parse(JSON.stringify(modelWorld));modelReload.events[0].spatial.scale[0]=4;placement.synchronize(modelReload);assert(Math.abs(modelReload.events[1].x-11)<1e-8);assert.deepEqual(modelReload.events[1].spatial.scale,[1,1,1],'Host scaling carries attachment pivot, preserving decoration size');
modelHost.spatial.rotation[0]=30;assert.throws(/* @function propPlacementTest.tiltedAttachment — Inputs: none. Returns synchronization result or documented tilted-host rejection. Changes only fixture data. */ function(){placement.synchronize(modelWorld);},/upright/);
console.log('PASS imported-model attachment translation/yaw/scaled pivot and serialized reload; tilted hosts explicitly rejected');
