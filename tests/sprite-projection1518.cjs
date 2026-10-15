// Test-only export exposes the private painter; production API remains unchanged.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root={};root.window=root;root.globalThis=root;
const sheet={image:{complete:true,naturalWidth:256},frames:[{x:0,y:0,w:120,h:330,anchorX:60}],columns:1,referenceHeight:310,groundInset:20};
root.FrontierSprites={sheet:/* @function sprite-projection1518.sheet — Inputs: entity ignored. Returns deterministic loaded frame with a twenty-pixel ground inset; no effects. */ ()=>sheet};
root.FrontierDirections={select:/* @function sprite-projection1518.direction — Inputs: entity/camera ignored. Returns the single fixture frame; no effects. */ ()=>({row:0,column:0})};
vm.createContext(root);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/terrain-occlusion.js'),'utf8'),root);
// October 14, 2026: expose the private painter independently of production formatting.
const renderSource=fs.readFileSync(path.join(__dirname,'../src/render.js'),'utf8');
const exportPattern=/root\.FrontierRender\s*=\s*\{/;
assert(exportPattern.test(renderSource),'Production render export must exist before test-only painter exposure');
vm.runInContext(renderSource.replace(exportPattern,'root.FrontierRender={candy,'),root);
for(const pitch of [-.7,-.3,0,.3,.6]){
 const cam={x:0,y:-5,z:2,yaw:0,pitch,cx:320,cy:350+(-2*Math.cos(pitch)-5*Math.sin(pitch))*360/(5*Math.cos(pitch)-2*Math.sin(pitch))},e={x:0,y:0,z:0,height:1.65},feet=root.FrontierRender.project(cam,0,0,0),head=root.FrontierRender.project(cam,0,0,1.65),calls=[];
 const ctx={world:{},setImageClip:/* @function sprite-projection1518.clip — Inputs: region record. Stores current visibility mask for draw assertions; no rendering effects. */ function(clip){this.clip=clip;},drawImage:/* @function sprite-projection1518.draw — Inputs: standard canvas image/source/destination coordinates. Retains draw arguments and mask; no effects outside fixture. */ function(...args){calls.push({args,clip:this.clip});}};
 assert(root.FrontierRender.candy(ctx,e,feet,cam));assert.equal(calls.length,1);
 assert(Math.abs(calls[0].args[6]-(feet.y-1.65*feet.scale))<1e-6,'Locked 0.15.17 camera-facing top');
 const last=calls.at(-1).args;assert(Math.abs(calls[0].clip.y+calls[0].clip.height-feet.y)<1e-6,'Bottom is projected feet, never below ground');
 // Project a real flat support floor and ensure center body pixels remain visible.
 const floor={w:320,h:240,step:2,values:new Float32Array(320*240)};
 for(const points of [[[-8,-1,0],[8,-1,0],[8,12,0]],[[-8,-1,0],[8,12,0],[-8,12,0]]]){const projected=points.map(/* @function sprite-projection1519.floorPoint � Inputs: world XYZ tuple. Returns projected floor vertex in logical pixels and world depth; no effects. */ point=>root.FrontierRender.project(cam,...point));if(projected.every(Boolean))root.FrontierTerrainOcclusion.triangle(floor,projected);}
 ctx.terrainDepth=floor;calls.length=0;root.FrontierRender.candy(ctx,e,feet,cam);
 const rect=calls[0].clip;
 for(const y of [Math.max(4,rect.y+4),Math.min(476,feet.y-4)])assert(rect.regions.some(/* @function sprite-projection1519.supportVisible � Inputs: visible rectangle. Returns whether the tested center body point remains visible over its support floor. */ r=>feet.x>=r.x&&feet.x<=r.x+r.width&&y>=r.y&&y<=r.y+r.height),'Support floor must not hide actor head or feet '+JSON.stringify({pitch,y,feet,rect}));
 // A nearer wall must still hide the sprite. The fix must not turn depth off.
 const depth={w:320,h:240,step:2,values:new Float32Array(320*240).fill(10)};ctx.terrainDepth=depth;calls.length=0;
 root.FrontierRender.candy(ctx,e,feet,cam);assert(calls.every(/* @function sprite-projection1518.hidden — Inputs: retained draw. Returns whether nearer wall removed every visible region; no effects. */ call=>call.clip.regions.length===0));
}
console.log('PASS locked camera-facing sprite head/feet at five pitch angles; single-rectangle presentation; real wall occlusion retained');

