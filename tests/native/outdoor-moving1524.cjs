/* October 12, 2026: outdoor keyboard-movement frame-throughput matrix. Connects only to the
 * already desktop-launched isolated diagnostic copy with the new terrain shader.
 * Measures actual render intervals and CPU submission during W/S movement; no pixel readback, GPU
 * finish or hidden browser. Emission stress exercises production radius lighting
 * with transient projectile-position records, not full projectile gameplay. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.FRONTIER_PLAYWRIGHT||'playwright');
// October 13: optional sky stress keeps its evidence separate from the earlier
// terrain-only matrix and uses the same movement/quality/light protocol.
const skyStress=process.env.FRONTIER_SKY_STRESS==='1';
const output=path.resolve(__dirname,'../../test-artifacts/'+(skyStress?'native-outdoor-sky-moving1524.json':'native-outdoor-moving1524.json'));
(/* @function nativePerformance.run — Inputs: none; loopback endpoint environment variable. Returns: promise. Measures the isolated generated hills map across all six quality modes and three light cases. Saves raw observations and restores preferences/instrumentation. Throws wrong-window or missing-fixture errors; does not open user projects or persist fixture mutations. */ async function(){
  const endpoint=process.env.FRONTIER_NATIVE_CDP||'http://127.0.0.1:9544',address=new URL(endpoint);
  assert(address.hostname==='127.0.0.1'&&address.protocol==='http:');
  const browser=await chromium.connectOverCDP(endpoint),page=browser.contexts()[0].pages()[0],errors=[];
  assert(page.url().includes('native-editor1524/resources/app/index.html'),'Measure the isolated native snapshot only');
  page.on('pageerror',/* @function nativePerformance.captureError — Inputs: page exception. Returns array length; retains explicit failures without suppressing them. */ function(error){return errors.push(error.message);});
  try{
    await page.reload();await page.waitForFunction(/* @function outdoorPerformance.rendererReady — Inputs: none. Returns whether the production renderer is ready. No mutation. */function(){return !!window.FrontierRender;});
    await page.evaluate(/* @function outdoorPerformance.observe — Inputs: none. Returns nothing. Retains the actual game through an output-preserving renderer wrapper solely for fixture setup. */function(){const draw=FrontierRender.draw;FrontierRender.draw=/* @function outdoorPerformance.capture — Inputs: canvas and real game. Returns unchanged draw result and exposes current scene for diagnostic import. */function(canvas,game){window.testGame=game;return draw(canvas,game);};});
    await page.waitForFunction(/* @function outdoorPerformance.scene — Inputs: none. Returns whether an actual frame exposed game state. */function(){return !!window.testGame;});
    const world=await page.evaluate(/* @function outdoorPerformance.fixture — Inputs: optional sky-stress boolean. Returns a validated empty outdoor hills map using a banked moss texture and enabled player light. Actual coordinator import owns replacement; no hidden source modification. */function(skyStress){const grass=FrontierOutdoorAssets.assets.find(/* @function outdoorPerformance.grass — Inputs: supplied asset record. Returns whether its name identifies the banked moss texture. No decoding/scene mutation. */function(asset){return asset.id==='ground-moss';});if(!grass)throw Error('Moss fixture resource missing');const world=FrontierWorld.generate('outdoor-lighting-1524',48,48);world.objects=[];world.events=[];world.groundMaterial=grass.id;world.terrain={mode:'hills',amplitude:.6,frequency:.12};world.lighting=FrontierLocalLighting.validate({enabled:true,ambient:.15,player:{enabled:true,radius:6}});if(skyStress)world.sky={enabled:true,layers:[],panorama:{asset:'sky-4',orientation:0,wrapBlend:true}};return FrontierWorld.validate(world);},skyStress);
    await page.locator('#import').setInputFiles({name:'outdoor-lighting-fixture.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(world))});await page.waitForFunction(/* @function outdoorPerformance.imported — Inputs: none. Returns whether coordinator owns the imported outdoor seed; failures remain visible in status. */function(){return testGame.sourceWorld.seed==='outdoor-lighting-1524';});
    await page.evaluate(/* @function outdoorPerformance.camera — Inputs: none. Returns nothing; aims the diagnostic view down at visible terrain without moving the player. */function(){Object.assign(testGame.camera,{yaw:0,pitch:-.45,distance:4,firstPerson:false});});
    if(skyStress)await page.waitForFunction(/* @function outdoorPerformance.skyDecoded � Inputs: none. Returns real ready status of the lazy sky-4 source before steady-state timing. Does not fake decoded resources or suppress failures. */function(){return FrontierSkyPanorama.status('sky-4').ready;});
    await page.waitForTimeout(1000);
    if(await page.locator('body.engineAuthoring').count())await page.locator('#workspaceToggle').click();
    await page.evaluate(/* @function nativePerformance.instrument — Inputs: none. Returns nothing. Wraps actual scene drawing, preserving production output. Fixture light/projectile records are installed only during rendering and restored before simulation continues. Bounded arrays retain timings; all original settings remain recoverable. */ function(){
      window.nativePerf={originalDraw:FrontierRender.draw,display:FrontierDisplay.get(),mode:0,times:[],intervals:[],last:0,peakLights:0,peakModels:0};
      FrontierRender.draw=/* @function nativePerformance.draw — Inputs: canvas and actual game. Returns unchanged draw result. Times CPU submission and consecutive render starts; moving emission stress uses eight bounded positions. No source pixels/readback/logging; finally restores authored lighting and simulation projectile ownership. */ function(canvas,game){
        const state=nativePerf,start=performance.now();if(state.last&&state.intervals.length<10000)state.intervals.push(start-state.last);state.last=start;
        const settings=game.sourceWorld.lighting,shots=game.projectiles;
        if(state.mode===0)game.sourceWorld.lighting={...settings,enabled:false};
        else if(state.mode===2){game.sourceWorld.lighting={...settings,enabled:true,ambient:.1,budget:8,lights:[],player:{...settings.player,enabled:false},projectiles:{...settings.projectiles,enabled:true,radius:4,intensity:.8}};const fixture=[];for(let i=0;i<8;i++){const angle=i*Math.PI/4+game.elapsed*.3;fixture.push({id:'native-light-'+i,map:game.currentMapId,position:{x:game.player.x+Math.cos(angle)*2,y:game.player.y+Math.sin(angle)*2,z:1}});}game.projectiles=fixture;}
        try{const result=state.originalDraw(canvas,game);state.peakLights=Math.max(state.peakLights,game.lightFrame?.lights.length||0);state.peakModels=Math.max(state.peakModels,game.modelDebug?.instances||0);if(state.times.length<10000)state.times.push(performance.now()-start);return result;}finally{game.sourceWorld.lighting=settings;game.projectiles=shots;}
      };
    });
    const observations=[];
    for(const [mode,scene] of [[0,'outdoor-unlit'],[1,'outdoor-player-light'],[2,'outdoor-eight-projectile-light-emission']]){
      for(const filtering of ['crisp','smooth'])for(const scale of [1,1.5,2]){
        await page.evaluate(/* @function nativePerformance.mode — Inputs: mode/filter/scale record. Returns nothing. Applies supported display preferences and resets bounded timing buffers after the previous observation; changes only the isolated diagnostic profile. */ function(value){nativePerf.mode=value.mode;FrontierDisplay.set({filtering:value.filtering,scale:value.scale});nativePerf.times=[];nativePerf.intervals=[];nativePerf.last=0;nativePerf.peakLights=0;nativePerf.peakModels=0;},{mode,filtering,scale});
        if(await page.locator('#pauseControls').isVisible())await page.locator('#pauseResume').click();
        await page.locator('#view').focus();const movementStart=await page.evaluate(/* @function outdoorMoving.start — Inputs: none. Returns actual horizontal player position before trusted keyboard motion. Read-only. */function(){return {x:testGame.player.x,y:testGame.player.y};});
        const direction=observations.length%2?'s':'w';await page.keyboard.down(direction);try{await page.waitForTimeout(6000);}finally{await page.keyboard.up(direction);}
        const movementEnd=await page.evaluate(/* @function outdoorMoving.end — Inputs: none. Returns actual horizontal player position after production movement; no teleporting or direct camera motion. */function(){return {x:testGame.player.x,y:testGame.player.y};});
        const distance=Math.hypot(movementEnd.x-movementStart.x,movementEnd.y-movementStart.y);assert(distance>.5,'Movement benchmark must actually move the player: '+JSON.stringify({direction,movementStart,movementEnd}));
        const metrics=await page.evaluate(/* @function nativePerformance.metrics — Inputs: none. Returns actual frame throughput, CPU and frame-tail statistics, display/budgets and diagnostic model counts. Excludes first five frames. CPU submission is not GPU elapsed time; heap is not texture memory. Reads only and does not synchronize GPU work. */ function(){
          const state=nativePerf,times=state.times.slice(5),intervals=state.intervals.slice(5);
          times.sort(/* @function nativePerformance.sortCpu — Inputs: timing pair. Returns ascending difference for local CPU quantiles. */ function(a,b){return a-b;});
          let total=0;for(const value of intervals)total+=value;
          intervals.sort(/* @function nativePerformance.sortFrames — Inputs: interval pair. Returns ascending difference for local latency quantiles. */ function(a,b){return a-b;});
          return {frames:intervals.length,fps:total?1000*intervals.length/total:0,cpuMedianMs:times[Math.floor(times.length*.5)],cpuP95Ms:times[Math.floor(times.length*.95)],frameP95Ms:intervals[Math.floor(intervals.length*.95)],worstFrameMs:intervals.at(-1),peakLights:state.peakLights,peakModels:state.peakModels,display:FrontierDisplay.get(),terrainLighting:!!FrontierPixi.current().terrainBatchState?.lightState,jsHeapBytes:performance.memory?.usedJSHeapSize??null};
        });
        assert(metrics.frames>10,'Observation needs real sustained frames');assert(await page.evaluate(/* @function outdoorPerformance.terrainSubmitted — Inputs: none. Returns whether production terrain batch has active triangles and, in lit modes, its actual shader state. No rendering override. */function(){const batch=FrontierPixi.current().terrainBatchState;return !!batch?.mesh.geometry.indexBuffer.data.length&&(nativePerf.mode===0||!!batch.lightState);}), 'Actual terrain must be submitted with lighting in lit modes');
        if(mode===2)assert.equal(metrics.peakLights,8,'Stress must activate eight production light sources');
        observations.push({scene,scale,filtering,direction,movementStart,movementEnd,distance,...metrics});console.log(scene,scale,filtering,metrics.fps.toFixed(1)+' fps',metrics.cpuP95Ms.toFixed(1)+' ms CPU p95');
      }
    }
    assert.deepEqual(errors,[]);fs.writeFileSync(output,JSON.stringify({at:new Date().toISOString(),platform:'Desktop-launched Windows Electron diagnostic snapshot',sampleMs:6000,skyStress,gpuElapsed:'not measured',scope:'Actual Windows W/S movement across dense hills in all quality/light modes; transient emission is not complete projectile gameplay',observations},null,2));
  }finally{
    await page.evaluate(/* @function nativePerformance.restore — Inputs: none. Returns nothing. Releases mouse capture, restores original production draw and display preferences, and deletes transient instrumentation. Does not save test lighting or alter shared asset files. */ function(){document.exitPointerLock?.();if(window.nativePerf){FrontierRender.draw=nativePerf.originalDraw;FrontierDisplay.set({scale:nativePerf.display.scale,filtering:nativePerf.display.filtering});delete window.nativePerf;}}).catch(/* @function nativePerformance.restoreFailure — Inputs: restoration exception. Returns nothing; logs explicit cleanup failure rather than assuming restoration succeeded. */ function(error){console.error('Native cleanup failed',error.message);});
    await browser.close();
  }
})().catch(/* @function nativePerformance.failure — Inputs: rejected error. Returns nothing. Reports failed verification and sets nonzero exit status. */ function(error){console.error(error);process.exitCode=1;});
