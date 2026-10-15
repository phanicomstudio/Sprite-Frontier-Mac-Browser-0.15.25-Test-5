/* October 13: actual bundled Pixi terrain shader pixel and ownership checks.
 * Tiny synchronous readback is confined to validation, never benchmarks. */
'use strict';
const {chromium,launch}=require('./environment.cjs'),path=require('node:path'),assert=require('node:assert/strict');
(/* @function terrainLightingTest.run — Inputs: none. Returns promise. Uses the actual terrain batch to verify ambient/radius illumination, unchanged unlit color, bounded reuse and retirement. Does not change authored files; browser closes on failure. */async function(){
 const browser=await chromium.launch(launch);
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',/* @function terrainLightingTest.error — Inputs: page exception. Returns array length; retains renderer failures. */function(error){return errors.push(error.message);});
  await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));await page.waitForFunction(/* @function terrainLightingTest.ready — Inputs: none. Returns whether real Pixi context is initialized. Read-only. */function(){return !!FrontierPixi.current();});
  const result=await page.evaluate(/* @function terrainLightingTest.exercise — Inputs: none. Returns pixels and ownership evidence from a tiny test triangle. Mutates only renderer fixture state; no gameplay or saved project edits. */function(){
   const ctx=FrontierPixi.current(),image=document.createElement('canvas');image.width=image.height=2;const paint=image.getContext('2d');paint.fillStyle='#ffffff';paint.fillRect(0,0,2,2);
   const material={textureImage:image,scale:1,color:'#ffffff'},cell={p:[{x:0,y:0,depth:10},{x:32,y:0,depth:10},{x:0,y:32,depth:10}],coords:[[0,0],[1,0],[0,1]],world:[[0,0,0],[0,0,0],[0,0,0]]},base={ambient:.25,steps:0,lights:[],blockers:[]};
   /* @function terrainLightingTest.pixel — Inputs: optional bounded light snapshot. Returns RGBA of the actual batched shader at one covered pixel. Clears fixture stage/filter state and submits synchronously; GPU readback remains test-only. */
   function pixel(snapshot){ctx.begin();ctx.breathing=null;ctx.underwater=null;ctx.localLightFrame=snapshot;ctx.terrainBatch1523([cell],material);ctx.end();const gl=ctx.app.renderer.gl,pixel=new Uint8Array(4),r=ctx.app.renderer.resolution;gl.readPixels(Math.floor(4*r),gl.drawingBufferHeight-Math.floor(5*r),1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);return Array.from(pixel);}
   const unlit=pixel(null),ambient=pixel(base),state=ctx.terrainBatchState.lightState,radius=pixel({...base,lights:[{x:0,y:0,z:1,radius:2,rgb:[1,1,1],intensity:1,falloff:1}]});
   const lamp={x:2,y:0,z:0,radius:4,rgb:[1,1,1],intensity:1,falloff:1},blocker={x:1,y:0,z:-.5,w:.2,d:2,h:1,yaw:0};
   const shadow=pixel({...base,lights:[lamp],blockers:[blocker]}),roundShadow=pixel({...base,lights:[lamp],blockers:[{...blocker,radius:.3,innerRadius:.1,arcStart:0,arcSweep:Math.PI*2}]}),quantized=pixel({...base,steps:4});
   const pattern=document.createElement('canvas');pattern.width=pattern.height=2;const patternPaint=pattern.getContext('2d');patternPaint.fillStyle='#ff0000';patternPaint.fillRect(0,0,1,2);patternPaint.fillStyle='#0000ff';patternPaint.fillRect(1,0,1,2);material.textureImage=pattern;cell.p[0].depth=1;cell.p[1].depth=7;cell.p[2].depth=20;
   const affineUnlit=pixel(null),affineLit=pixel({...base,ambient:1});
   const reuse=state===ctx.terrainBatchState.lightState,old=ctx.terrainBatchState,geometry=old.mesh.geometry,buffers=[...geometry.buffers];
   ctx.terrainBatch1523(Array(Math.ceil(old.capacity/3)+1).fill(cell),material);return {unlit,ambient,radius,shadow,roundShadow,quantized,affineUnlit,affineLit,reuse,retiredLighting:old.lightState===null,retiredGeometry:geometry.buffers===null,buffersReleased:buffers.every(/* @function terrainLightingTest.released — Inputs: retired owned buffer. Returns whether its storage was destroyed. Does not modify the resource. */function(buffer){return buffer.data===null||buffer.destroyed===true;})};
  });
  assert.deepEqual(errors,[]);assert(result.unlit[0]>=250);assert(Math.abs(result.ambient[0]-64)<=2,JSON.stringify(result));assert(Math.abs(result.radius[0]-191)<=2,JSON.stringify(result));assert(Math.abs(result.shadow[0]-64)<=2&&Math.abs(result.roundShadow[0]-64)<=2,JSON.stringify(result));assert(Math.abs(result.quantized[0]-85)<=2);assert.deepEqual(result.affineLit,result.affineUnlit,'Ambient-one lighting must preserve historical affine UVs at unequal vertex depths');assert(result.reuse&&result.retiredLighting&&result.retiredGeometry&&result.buffersReleased);console.log('PASS actual terrain ambient/radius pixels, unlit color, lighting reuse and geometry retirement');
 }finally{await browser.close();}
})().catch(/* @function terrainLightingTest.failure — Inputs: rejected error. Returns nothing; reports failure with unsuccessful exit. */function(error){console.error(error);process.exitCode=1;});
