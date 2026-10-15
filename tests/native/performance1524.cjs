/* October 12, 2026: interim native frame-throughput matrix. Connects only to the
 * already desktop-launched isolated diagnostic copy after props1524 acceptance.
 * Measures actual render intervals and CPU submission; no pixel readback, GPU
 * finish or hidden browser. Emission stress exercises production radius lighting
 * with transient projectile-position records, not full projectile gameplay. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.FRONTIER_PLAYWRIGHT||'playwright');
// Optional named evidence preserves earlier matrix observations.
const reportTag=process.env.FRONTIER_PERF_TAG||'';if(reportTag&&!/^[a-z0-9-]{1,60}$/.test(reportTag))throw Error('Invalid performance evidence tag.');
const output=path.resolve(__dirname,'../../test-artifacts/'+(reportTag?'native-furnished-'+reportTag+'-1524.json':'native-interim-matrix1524.json'));
(/* @function nativePerformance.run — Inputs: none; loopback endpoint environment variable. Returns: promise. Measures the current furnished native diagnostic room across all six quality modes and three light cases. Saves raw observations and restores preferences/instrumentation. Throws wrong-window or missing-fixture errors; does not open user projects or persist fixture mutations. */ async function(){
  const endpoint=process.env.FRONTIER_NATIVE_CDP||'http://127.0.0.1:9544',address=new URL(endpoint);
  assert(address.hostname==='127.0.0.1'&&address.protocol==='http:');
  const browser=await chromium.connectOverCDP(endpoint),page=browser.contexts()[0].pages()[0],errors=[];
  // October 13: permit the second explicitly owned fresh editor fixture; user profiles remain forbidden.
  assert(page.url().includes('native-editor1524/resources/app/index.html')||page.url().includes('native-editor1524-mapmanagement/resources/app/index.html')||page.url().includes('native-editor1524-final/resources/app/index.html'),'Measure the isolated native snapshot only');
  page.on('pageerror',/* @function nativePerformance.captureError — Inputs: page exception. Returns array length; retains explicit failures without suppressing them. */ function(error){return errors.push(error.message);});
  try{
    assert(await page.evaluate(/* @function nativePerformance.fixtureReady — Inputs: none. Returns whether the real native props fixture and supplied bed exist. No scene mutation. */ function(){return !!window.testGame&&!!FrontierModelLibrary.get('supplied-antique-box-bed-v3');}));
    if(await page.locator('body.engineAuthoring').count())await page.locator('#workspaceToggle').click();
    await page.evaluate(/* @function nativePerformance.instrument — Inputs: none. Returns nothing. Wraps actual scene drawing, preserving production output. Fixture light/projectile records are installed only during rendering and restored before simulation continues. Bounded arrays retain timings; all original settings remain recoverable. */ function(){
      window.nativePerf={originalDraw:FrontierRender.draw,display:FrontierDisplay.get(),mode:0,times:[],intervals:[],last:0,peakLights:0,peakModels:0,peakCameraCorrections:0};
      FrontierRender.draw=/* @function nativePerformance.draw — Inputs: canvas and actual game. Returns unchanged draw result. Times CPU submission and consecutive render starts; moving emission stress uses eight bounded positions. No source pixels/readback/logging; finally restores authored lighting and simulation projectile ownership. */ function(canvas,game){
        const state=nativePerf,start=performance.now();if(state.last&&state.intervals.length<10000)state.intervals.push(start-state.last);state.last=start;
        const settings=game.sourceWorld.lighting,shots=game.projectiles;
        if(state.mode===0)game.sourceWorld.lighting={...settings,enabled:false};
        else if(state.mode===2){game.sourceWorld.lighting={...settings,enabled:true,ambient:.1,budget:8,lights:[],player:{...settings.player,enabled:false},projectiles:{...settings.projectiles,enabled:true,radius:4,intensity:.8}};const fixture=[];for(let i=0;i<8;i++){const angle=i*Math.PI/4+game.elapsed*.3;fixture.push({id:'native-light-'+i,map:game.currentMapId,position:{x:game.player.x+Math.cos(angle)*2,y:game.player.y+Math.sin(angle)*2,z:1}});}game.projectiles=fixture;}
        try{const result=state.originalDraw(canvas,game);state.peakLights=Math.max(state.peakLights,game.lightFrame?.lights.length||0);state.peakModels=Math.max(state.peakModels,game.modelDebug?.instances||0);state.peakCameraCorrections=Math.max(state.peakCameraCorrections,game.modelCameraDebug?.separationIterations||0);if(state.times.length<10000)state.times.push(performance.now()-start);return result;}finally{game.sourceWorld.lighting=settings;game.projectiles=shots;}
      };
    });
    const observations=[];
    for(const [mode,scene] of [[0,'furnished-unlit'],[1,'furnished-one-light'],[2,'furnished-eight-projectile-light-emission']]){
      for(const filtering of ['crisp','smooth'])for(const scale of [1,1.5,2]){
        await page.evaluate(/* @function nativePerformance.mode — Inputs: mode/filter/scale record. Returns nothing. Applies supported display preferences and resets bounded timing buffers after the previous observation; changes only the isolated diagnostic profile. */ function(value){nativePerf.mode=value.mode;FrontierDisplay.set({filtering:value.filtering,scale:value.scale});nativePerf.times=[];nativePerf.intervals=[];nativePerf.last=0;nativePerf.peakLights=0;nativePerf.peakModels=0;nativePerf.peakCameraCorrections=0;},{mode,filtering,scale});
        await page.waitForTimeout(6000);
        const metrics=await page.evaluate(/* @function nativePerformance.metrics — Inputs: none. Returns actual frame throughput, CPU and frame-tail statistics, display/budgets and diagnostic model counts. Excludes first five frames. CPU submission is not GPU elapsed time; heap is not texture memory. Reads only and does not synchronize GPU work. */ function(){
          const state=nativePerf,times=state.times.slice(5),intervals=state.intervals.slice(5);
          times.sort(/* @function nativePerformance.sortCpu — Inputs: timing pair. Returns ascending difference for local CPU quantiles. */ function(a,b){return a-b;});
          let total=0;for(const value of intervals)total+=value;
          intervals.sort(/* @function nativePerformance.sortFrames — Inputs: interval pair. Returns ascending difference for local latency quantiles. */ function(a,b){return a-b;});
          return {frames:intervals.length,fps:total?1000*intervals.length/total:0,cpuMedianMs:times[Math.floor(times.length*.5)],cpuP95Ms:times[Math.floor(times.length*.95)],frameP95Ms:intervals[Math.floor(intervals.length*.95)],worstFrameMs:intervals.at(-1),peakLights:state.peakLights,peakModels:state.peakModels,peakCameraCorrections:state.peakCameraCorrections,display:FrontierDisplay.get(),roomBackend:testGame.roomBackend,modelBackend:testGame.modelDebug?.backend,jsHeapBytes:performance.memory?.usedJSHeapSize??null};
        });
        assert(metrics.frames>10,'Observation needs real sustained frames');assert(metrics.peakModels>=1,'Furnished fixture must actually render a model');
        if(mode===2)assert.equal(metrics.peakLights,8,'Stress must activate eight production light sources');
        observations.push({scene,scale,filtering,...metrics});console.log(scene,scale,filtering,metrics.fps.toFixed(1)+' fps',metrics.cpuP95Ms.toFixed(1)+' ms CPU p95');
      }
    }
    assert.deepEqual(errors,[]);fs.writeFileSync(output,JSON.stringify({at:new Date().toISOString(),platform:'Desktop-launched Electron 44.5.1 Windows diagnostic snapshot',sampleMs:6000,gpuElapsed:'not measured',scope:'Interim furnished-room throughput and light emission; not full release performance acceptance',observations},null,2));
  }finally{
    await page.evaluate(/* @function nativePerformance.restore — Inputs: none. Returns nothing. Releases mouse capture, restores original production draw and display preferences, and deletes transient instrumentation. Does not save test lighting or alter shared asset files. */ function(){document.exitPointerLock?.();if(window.nativePerf){FrontierRender.draw=nativePerf.originalDraw;FrontierDisplay.set({scale:nativePerf.display.scale,filtering:nativePerf.display.filtering});delete window.nativePerf;}}).catch(/* @function nativePerformance.restoreFailure — Inputs: restoration exception. Returns nothing; logs explicit cleanup failure rather than assuming restoration succeeded. */ function(error){console.error('Native cleanup failed',error.message);});
    await browser.close();
  }
})().catch(/* @function nativePerformance.failure — Inputs: rejected error. Returns nothing. Reports failed verification and sets nonzero exit status. */ function(error){console.error(error);process.exitCode=1;});
