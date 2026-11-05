const path=require('node:path'),assert=require('node:assert/strict'),fs=require('node:fs'),{
  chromium,launch
}
=require('./environment.cjs'),observe=require('./host-observer1611.cjs');

(/* @function normalPerformance.run1617 — Inputs: none. Measures real warmed wilderness rendering with defaults on/off in independent browser lifetimes, across first/third/isometric cameras. Enforces unchanged submission counts and no warm normal generation; timings are evidence, not universal FPS guarantees. */async function(){
  const browser=await chromium.launch({
    ...launch,args:['--allow-file-access-from-files']
  }),reports=[];
  try{
    for(const enabled of [false,true]){
      const context=await browser.newContext({
        viewport:{
          width:1600,height:1000
        }
      }),page=await context.newPage(),errors=[];
      await page.addInitScript(/* @function normalPerformance.flag1617 — Inputs: diagnostic enable Boolean. Sets only an isolated startup comparison flag before engine registration; production defaults remain enabled. */function(value){
        window.FRONTIER_AUTOMATIC_NORMALS_ENABLED=value;
      },enabled);
      page.on('pageerror',/* @function normalPerformance.error1617 — Inputs: actual renderer error. Records failures for the final assertion without suppressing them. */function(error){
        errors.push(error.message);
      });
      await observe(page);
      await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));
      await page.locator('#workspaceToggle').click();
      await page.locator('#activeMap').selectOption('isometric-wilderness');
      await page.evaluate(/* @function normalPerformance.stationary1617 — Inputs: none. Removes isolated test events through the original authoring owner to avoid AI movement affecting paired camera measurements. Retains real wilderness terrain, objects, textures, lighting and sprite presentation. */function(){
        testHost1611.roomApi.mutate(/* @function normalPerformance.fixture1617 — Inputs: none. Changes test-only event and palette state; no user project is opened. */function(){
          const world=testHost1611.roomApi.world();
          world.events=[];
          world.paletteDither={
            ...FrontierPaletteDither.defaults,enabled:false
          };
        });
      });
      await page.locator('#workspaceToggle').click();
      for(const mode of ['third','first','isometric']){
        await page.evaluate(/* @function normalPerformance.camera1617 — Inputs: requested existing camera mode. Applies a real source presentation setting through the existing mutation owner, then selects its original runtime camera. Does not replace projection, sprite or lighting functions. */function(mode){
          testHost1611.roomApi.mutate(/* @function normalPerformance.presentation1617 — Inputs: none. Selects the existing supported cell presentation for the isolated scene. */function(){
            testHost1611.roomApi.world().presentation=FrontierIsometric.validate({
              mode:mode==='isometric'?'isometric':'perspective'
            });
          });
          const game=testHost1611.roomApi.game();
          game.camera.firstPerson=mode==='first';
          FrontierRender.draw(document.getElementById('view'),game);
        },mode);
        await page.waitForTimeout(1300);
        await page.waitForFunction(/* @function normalPerformance.warm1617 — Inputs: none. Requires real pending image/worker queues to settle before timing. */function(){
          const d=FrontierAutomaticNormals.debug();
          return !d.pending&&!d.generationPending;
        },{
        },{
          timeout:60000
        });
        const result=await page.evaluate(/* @function normalPerformance.measure1617 — Inputs: none. Times original draw plus test-only GPU completion; counts actual normal renderer submissions over thirty frames. Restores the renderer method even on failure. No per-frame metrics are added to production. */function(){
          const game=testHost1611.roomApi.game(),view=document.getElementById('view'),adapter=FrontierPixi.current(),renderer=adapter.app.renderer,original=renderer.render,gl=renderer.gl,times=[],before=FrontierAutomaticNormals.debug();
          let calls=0;
          renderer.render=/* @function normalPerformance.submit1617 — Inputs: original renderer arguments. Counts then delegates unchanged; no extra rendering or source mutations. */function(...args){
            calls++;
            return original.apply(this,args);
          };
          try{
            for(let i=0;i<30;i++){
              const start=performance.now();
              FrontierRender.draw(view,game);
              gl.finish();
              if(i>=10)times.push(performance.now()-start);
            }
            times.sort(/* @function normalPerformance.order1617 — Inputs: two measured millisecond durations. Returns ascending numeric order for percentiles. */function(a,b){
              return a-b;
            });
            return {
              p50:times[Math.floor(times.length*.5)],p95:times[Math.floor(times.length*.95)],calls,frames:30,before,after:FrontierAutomaticNormals.debug(),orthographic:!!FrontierRender.camera(game).orthographic,firstPerson:!!game.camera.firstPerson
            };
          }finally{
            renderer.render=original;
          }
        });
        assert.equal(result.calls,result.frames,JSON.stringify({
          enabled,mode,result
        }));
        assert.equal(result.after.generated,result.before.generated);
        assert.equal(result.after.loads,result.before.loads);
        assert(result.after.bytes<=result.after.limit);
        reports.push({
          enabled,mode,...result
        });
      }
      assert.deepEqual(errors,[]);
      await context.close();
    }
    fs.writeFileSync('test-artifacts/normal-performance1617.json',JSON.stringify({
      reports,note:'Paired warm real rendering; source cache and GPU drivers affect timings. Structural gates prevent extra world submissions and recurring generation.'
    },null,2));
    console.log('PASS one submission/frame and zero recurring normal generation across first/third/isometric; bounded cache',JSON.stringify(reports.map(/* @function normalPerformance.summary1617 — Inputs: one full report. Returns compact timing and memory evidence for delivery logs. */function(r){
      return {
        enabled:r.enabled,mode:r.mode,p50:r.p50,p95:r.p95,bytes:r.after.bytes,fallbacks:r.after.budgetFallbacks
      };
    })));
  }finally{
    await browser.close();
  }
})().catch(/* @function normalPerformance.failure1617 — Inputs: measured regression or renderer failure. Reports nonzero status after cleanup; does not relax the gate. */function(error){
  console.error(error);
  process.exitCode=1;
});


