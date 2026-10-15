/* October 13, 2026: isolated desktop exported-game cell-count comparison.
 * Both cases use the identical active world and quality. This records frame
 * intervals, not GPU timing or a promise of performance for arbitrary worlds. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.FRONTIER_PLAYWRIGHT||'playwright');
(/* @function cellScale.run — Inputs: none. Returns promise. Connects only to the isolated Windows large-library fixture, compares two/128 authored cells at highest Smooth, and checks no project snapshot occurs during ordinary play. Leaves source files unchanged and releases input on every outcome. */ async function(){
 const browser=await chromium.connectOverCDP('http://127.0.0.1:9547');
 const page=browser.contexts()[0].pages()[0];
 assert(page.url().includes('native-runtime-sky1524-large-c/resources/app/index.html'));
 try{
  await page.addInitScript(/* @function cellScale.capture — Inputs: none. Returns nothing. Retains actual runtime map service and renderer; wraps original calls without changing scene rendering. Only the detached test input's inactive map count varies. */ function(){
   let maps,renderer;
   Object.defineProperty(window,'FrontierRuntimeMaps',{
    get:/* @function cellScale.getMaps — Inputs: none. Returns installed factory. */function(){return maps;},
    set:/* @function cellScale.setMaps — Inputs: namespace. Returns nothing. Wraps create to install the selected diagnostic library count, then counts full snapshots without replacing their behavior. */function(value){
     maps=value;const create=value.create;
     value.create=/* @function cellScale.create — Inputs: actual scene adapter and exported data. Returns real service. Uses a detached project with two or 128 maps; no authoring files or live worlds are altered. */function(api,project){
      const input=structuredClone(project||window.FRONTIER_EXPORTED_PROJECT);
      input.maps=input.maps.slice(0,Number(sessionStorage.getItem('cellScaleCount')||128));
      const service=create(api,input),snapshot=service.snapshot;window.scaleSnapshots=0;
      service.snapshot=/* @function cellScale.snapshot — Inputs: none. Returns unchanged production snapshot and increments diagnostic counter. */function(){window.scaleSnapshots++;return snapshot();};
      window.scaleLibrary=service;return service;
     };
    }
   });
   Object.defineProperty(window,'FrontierRender',{
    get:/* @function cellScale.getRenderer — Inputs: none. Returns installed renderer. */function(){return renderer;},
    set:/* @function cellScale.setRenderer — Inputs: namespace. Returns nothing; observes original draw to retain active scene. */function(value){renderer=value;const draw=value.draw;value.draw=/* @function cellScale.draw — Inputs: original draw arguments. Returns unchanged drawing result and retains the actual active game. */function(...args){window.scaleGame=args[1];return draw.apply(this,args);};}
   });
  });
  const results=[];
  for(const count of [2,128]){
   await page.evaluate(/* @function cellScale.selectCount — Inputs: diagnostic cell count. Returns nothing; persists only isolated fixture preference for next reload. */function(value){sessionStorage.setItem('cellScaleCount',String(value));},count);
   await page.reload();
   await page.waitForFunction(/* @function cellScale.ready — Inputs: none. Returns active world and sky readiness; no mutations. */function(){return window.scaleGame?.sourceWorld.seed==='RUNTIME-1524'&&FrontierSkyPanorama.status('sky-1').ready;});
   await page.keyboard.press('Escape');await page.locator('#pauseOptions').click();
   await page.locator('#renderScale').selectOption('2');await page.locator('#renderFiltering').selectOption('smooth');
   await page.locator('#pauseBack').click();await page.locator('#pauseResume').click();
   await page.waitForTimeout(1000);
   const result=await page.evaluate(/* @function cellScale.measure — Inputs: none. Returns promise with 180 actual animation intervals and ordinary-play snapshot count. Does not manually draw, step simulation, clone the project, or read GPU pixels during sampling. Units milliseconds/FPS. */async function(){
    window.scaleSnapshots=0;
    const times=[];let previous=performance.now();
    for(let i=0;i<180;i++){
     const now=await new Promise(/* @function cellScale.nextFrame — Inputs: promise resolver. Returns nothing; schedules one browser animation timestamp without altering the game loop. */function(resolve){requestAnimationFrame(resolve);});
     times.push(now-previous);previous=now;
    }
    times.shift();times.sort(/* @function cellScale.numeric — Inputs: two millisecond intervals. Returns ascending numeric order for p95. */function(a,b){return a-b;});
    return {fps:1000/(times.reduce(/* @function cellScale.sum — Inputs: accumulated milliseconds and next interval. Returns sum, no effects. */function(total,value){return total+value;},0)/times.length),p95:times[Math.floor(times.length*.95)],snapshots:scaleSnapshots,seed:scaleGame.sourceWorld.seed,sky:FrontierSkyPanorama.diagnostics(FrontierPixi.current())};
   });
   assert.equal(result.snapshots,0,'Ordinary play must not copy the whole library');
   assert.equal(result.sky.meshes,1);assert.equal(result.sky.decoded,1);
   results.push({cells:count,...result});
  }
  fs.writeFileSync(path.resolve(__dirname,'../../test-artifacts/native-cell-scale1524.json'),JSON.stringify({at:new Date().toISOString(),scope:'Same active world, highest Smooth, desktop Windows, two versus 128 dormant authored-cell records; frame intervals include desktop/browser scheduling, no GPU timer',results},null,2));
  console.log('PASS ordinary play makes zero full-library snapshots; cell-count frame evidence',JSON.stringify(results));
 }finally{await require('./input-cleanup1524.cjs').release(browser);await browser.close();}
})().catch(/* @function cellScale.failure — Inputs: rejected error. Returns nothing; prints failed gate and marks nonzero exit. */function(error){console.error(error);process.exitCode=1;});
