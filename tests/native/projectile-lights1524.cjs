/* October 13, 2026: native keyboard-fired projectile lighting acceptance.
 * This complements synthetic emission stress with actual combat and lifetimes. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.FRONTIER_PLAYWRIGHT||'playwright');
(/* @function projectileLights.run — Inputs: none. Returns promise. Imports a detached room into the isolated Windows editor, fires the production shotgun through F key input in all six quality modes, verifies bounded lights and eventual removal, and records actual frame submission timings. No production profiles or release files are touched; input and drawing wrappers are restored on every outcome. */async function(){
 const browser=await chromium.connectOverCDP('http://127.0.0.1:9544'),page=browser.contexts()[0].pages()[0],errors=[];
 assert(page.url().includes('native-editor1524-mapmanagement/resources/app/index.html'));
 page.on('pageerror',/* @function projectileLights.error — Inputs: page exception. Returns array length; retains failures for acceptance. */function(error){return errors.push(error.message);});
 try{
  await page.reload();
  await page.evaluate(/* @function projectileLights.observe — Inputs: none. Returns nothing. Wraps actual rendering to capture game and bounded CPU/frame/light observations; no fake projectiles or light records are injected. */function(){
   const original=FrontierRender.draw;
   window.projectileCheck={original,times:[],intervals:[],last:0,peakLights:0,peakShots:0,dropped:0};
   FrontierRender.draw=/* @function projectileLights.draw — Inputs: canvas and active game. Returns original draw result. Measures CPU submission and records existing light/projectile counts, bounded to the isolated test interval. Units milliseconds. */function(canvas,game){
    const state=projectileCheck,now=performance.now();window.projectileGame=game;
    const value=state.original(canvas,game);
    if(state.record){state.times.push(performance.now()-now);if(state.last)state.intervals.push(now-state.last);state.last=now;state.peakLights=Math.max(state.peakLights,game.lightFrame?.lights.length||0);state.peakShots=Math.max(state.peakShots,game.projectiles.length);state.dropped=Math.max(state.dropped,game.lightFrame?.droppedLights||0);}
    return value;
   };
  });
  await page.waitForFunction(/* @function projectileLights.ready — Inputs: none. Returns actual game/shotgun availability; read-only. */function(){return !!window.projectileGame&&PhanicomABS.weapons.has('shotgun');});
  const fixture=await page.evaluate(/* @function projectileLights.fixture — Inputs: none. Returns validated room with normal collision and enabled projectile emission. Uses authored fixture data, not altered combat speeds or synthetic lights. */function(){
   const room=FrontierBuildingKit.shell({x:20,y:20,width:30,depth:30,height:6,ceiling:false});
   return FrontierWorld.validate({...projectileGame.sourceWorld,objects:[],events:[],spawn:{x:20,y:12,z:0},lighting:FrontierLocalLighting.validate({enabled:true,ambient:.3,budget:8,projectiles:{enabled:true}}),sky:{enabled:false,layers:[]},interior:{...structuredClone(FrontierInterior.defaults),mode:'geometry',floor:room.floor,primitives:room.primitives,blockers:[],sprites:[],entrances:[],exits:[]}});
  });
  await page.locator('#import').setInputFiles({name:'projectile-light-room.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(fixture))});
  await page.waitForFunction(/* @function projectileLights.imported — Inputs: none. Returns whether actual coordinator adopted the isolated room. */function(){return projectileGame.sourceWorld.spawn.y===12&&projectileGame.sourceWorld.events.length===0;});
  const results=[];
  for(const filtering of ['crisp','smooth'])for(const scale of [1,1.5,2]){
   await page.evaluate(/* @function projectileLights.configure — Inputs: supported scale/filter pair. Returns nothing. Applies production display preferences and equips an existing shotgun with ammunition for ordinary combat input; does not change weapon parameters. Resets only test observations. */function(value){
    FrontierDisplay.set(value);PhanicomABS.equip(projectileGame,'shotgun');projectileGame.player.holstered=false;projectileGame.player.ammoLoaded=12;Object.assign(projectileGame.camera,{yaw:0,pitch:0,distance:4});
    Object.assign(projectileCheck,{times:[],intervals:[],last:0,peakLights:0,peakShots:0,dropped:0,record:true});
   },{scale,filtering});
   await page.locator('#view').focus();
   for(let i=0;i<8;i++){await page.keyboard.press('f');await page.waitForTimeout(180);}
   await page.waitForTimeout(700);
   const metrics=await page.evaluate(/* @function projectileLights.metrics — Inputs: none. Returns bounded live-projectile/light peaks and actual CPU/frame quantiles. Stops observation; no GPU readback or scene mutation. */function(){
    const state=projectileCheck;state.record=false;
    const cpu=state.times.slice(5).sort(/* @function projectileLights.cpuOrder — Inputs: CPU millisecond pair. Returns numeric order. */function(a,b){return a-b;}),intervals=state.intervals.slice(5);
    let total=0;for(const value of intervals)total+=value;
    intervals.sort(/* @function projectileLights.frameOrder — Inputs: frame millisecond pair. Returns numeric order. */function(a,b){return a-b;});
    return {frames:intervals.length,fps:1000*intervals.length/total,cpuP95:cpu[Math.floor(cpu.length*.95)],frameP95:intervals[Math.floor(intervals.length*.95)],peakLights:state.peakLights,peakShots:state.peakShots,droppedLights:state.dropped};
   });
   assert(metrics.frames>20);assert(metrics.peakShots>0,'Keyboard firing must create actual projectiles');assert(metrics.peakLights>0&&metrics.peakLights<=8,'Actual projectile lights obey budget');
   await page.waitForFunction(/* @function projectileLights.expired — Inputs: none. Returns whether actual combat removed all shots and lighting retained no emission. No manual despawn. */function(){return projectileGame.projectiles.length===0&&(projectileGame.lightFrame?.lights.length||0)===0;},{},{timeout:15000});
   results.push({scale,filtering,...metrics});
  }
  assert.deepEqual(errors,[]);fs.writeFileSync(path.resolve(__dirname,'../../test-artifacts/native-projectile-lights1524.json'),JSON.stringify({at:new Date().toISOString(),scope:'Desktop Windows actual F-key shotgun firing, normal projectile simulation/lifetimes, all six quality modes; CPU submission/frame intervals, no GPU timer',results},null,2));
  console.log('PASS actual keyboard-fired projectile lights, budget and lifetime cleanup',JSON.stringify(results));
 }finally{
  await page.evaluate(/* @function projectileLights.restore — Inputs: none. Returns nothing. Restores original draw and releases pointer lock; isolated fixture files/profile remain separate. */function(){document.exitPointerLock?.();if(window.projectileCheck)FrontierRender.draw=projectileCheck.original;});
  await require('./input-cleanup1524.cjs').release(browser);await browser.close();
 }
})().catch(/* @function projectileLights.failure — Inputs: rejected error. Returns nothing; reports failed acceptance and nonzero exit. */function(error){console.error(error);process.exitCode=1;});
