/* October 13: coarse CPU stage profile for the dense hills regression.
 * One timer per terrain draw/batch/frame; no per-triangle timing or readback. */
'use strict';
const {chromium}=require(process.env.FRONTIER_PLAYWRIGHT||'playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(/* @function outdoorProfile.run — Inputs: existing isolated native diagnostic. Returns promise. Profiles actual drawing at highest Smooth for disabled/enabled player lighting. Writes bounded stage evidence and restores renderer/quality/mouse capture. Does not change source files or user projects. */async function(){
 const browser=await chromium.connectOverCDP('http://127.0.0.1:9544'),page=browser.contexts()[0].pages()[0];assert(page.url().includes('native-editor1524/resources/app/index.html'));
 try{
  await page.evaluate(/* @function outdoorProfile.install — Inputs: none. Returns nothing; installs coarse timing wrappers around production methods, retaining originals for cleanup. No per-pixel instrumentation. */function(){
   const ctx=FrontierPixi.current();window.outdoorProfile={draw:FrontierRender.draw,outdoor:FrontierOutdoorAssets.draw,batch:ctx.terrainBatch1523,display:FrontierDisplay.get(),samples:[],lit:false,ctx};
   FrontierOutdoorAssets.draw=/* @function outdoorProfile.terrain — Inputs: original terrain draw arguments. Returns original result; adds one complete terrain-stage duration per frame. */function(...args){const start=performance.now();try{return outdoorProfile.outdoor.apply(this,args);}finally{outdoorProfile.terrainMs=performance.now()-start;}};
   ctx.terrainBatch1523=/* @function outdoorProfile.batch — Inputs: original terrain batch arguments. Returns original result; records one buffer/submission preparation duration, not GPU elapsed time. */function(...args){const start=performance.now();try{return outdoorProfile.batch.apply(this,args);}finally{outdoorProfile.batchMs=performance.now()-start;}};
   FrontierRender.draw=/* @function outdoorProfile.draw — Inputs: canvas and actual game. Returns unchanged production draw result. Diagnostic lighting toggles last only for the draw; samples are bounded to 3,000 records. */function(canvas,game){
    const state=outdoorProfile,start=performance.now(),lighting=game.sourceWorld.lighting;state.game=game;game.sourceWorld.lighting={...lighting,enabled:state.lit};state.terrainMs=state.batchMs=0;
    try{return state.draw(canvas,game);}finally{if(state.samples.length<3000)state.samples.push({total:performance.now()-start,terrain:state.terrainMs,batch:state.batchMs,triangles:state.ctx.terrainBatchState?.mesh.geometry.indexBuffer.data.length/3||0});game.sourceWorld.lighting=lighting;}
   };
  });
  await page.waitForFunction(/* @function outdoorProfile.ready — Inputs: none. Returns whether an actual outdoor textured frame is available. Does not substitute a fixture or suppress errors. */function(){return !!outdoorProfile.game&&!outdoorProfile.game.sourceWorld.interior&&!!outdoorProfile.game.sourceWorld.groundMaterial;});
  await page.evaluate(/* @function outdoorProfile.quality — Inputs: none. Returns nothing; sets supported highest Smooth only in the isolated profile. */function(){FrontierDisplay.set({scale:2,filtering:'smooth'});});
  const records=[];
  for(const lit of [false,true]){
   await page.evaluate(/* @function outdoorProfile.mode — Inputs: lighting flag. Returns nothing; clears bounded timing evidence for this mode. */function(value){outdoorProfile.lit=value;outdoorProfile.samples=[];},lit);await page.waitForTimeout(6000);
   const evidence=await page.evaluate(/* @function outdoorProfile.evidence — Inputs: none. Returns detached timing samples and scene counts. Read-only diagnostics; no GPU synchronization. */function(){return {samples:outdoorProfile.samples.slice(5),entities:outdoorProfile.game.entities?.length,sourceObjects:outdoorProfile.game.sourceWorld.objects.length,sourceEvents:outdoorProfile.game.sourceWorld.events.length};});records.push({lit,...evidence});
  }
  fs.writeFileSync(path.resolve(__dirname,'../../test-artifacts/native-outdoor-profile1524.json'),JSON.stringify({scope:'Coarse actual Windows CPU stages; GPU elapsed not measured',records},null,2));
  for(const record of records){const average={};for(const key of ['total','terrain','batch','triangles']){let sum=0;for(const sample of record.samples)sum+=sample[key];average[key]=sum/record.samples.length;}console.log(record.lit?'lit':'unlit',average,'entities',record.entities);}
 }finally{
  await page.evaluate(/* @function outdoorProfile.restore — Inputs: none. Returns nothing; restores original methods/preferences and releases mouse capture before disconnecting. Safe after partial setup. */function(){document.exitPointerLock?.();if(window.outdoorProfile){FrontierRender.draw=outdoorProfile.draw;FrontierOutdoorAssets.draw=outdoorProfile.outdoor;outdoorProfile.ctx.terrainBatch1523=outdoorProfile.batch;FrontierDisplay.set({scale:outdoorProfile.display.scale,filtering:outdoorProfile.display.filtering});delete window.outdoorProfile;}});await browser.close();
 }
})().catch(/* @function outdoorProfile.failure — Inputs: rejected error. Returns nothing; reports unsuccessful profiling without claiming a baseline. */function(error){console.error(error);process.exitCode=1;});
