const assert=require('node:assert/strict'),path=require('node:path'),{
  chromium,launch
}
=require('./environment.cjs');

(/* @function horizon1624.run — Inputs: none. Verifies real background shader pixels, pooled mesh reuse and camera-pitch movement using the existing renderer. Pixel reads are test-only; browser always closes. */async function(){
  const browser=await chromium.launch({
    ...launch,args:['--allow-file-access-from-files']
  });
  try{
    const page=await browser.newPage();
    await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));
    await page.waitForFunction(/* @function horizon1624.ready — Inputs: none. Waits for the actual Pixi adapter. */function(){
      return !!FrontierPixi.current();
    });
    const result=await page.evaluate(/* @function horizon1624.pixels — Inputs: none. Renders only sky/background fog into the original world stage for isolated exact pixel comparisons; no production hooks or substitute shader. */function(){
      const ctx=FrontierPixi.current(),game={
        sourceWorld:{
          fog:FrontierFog.validate({
            color:'#665263'
          })
        },camera:{
          firstPerson:false
        },viewWidth:640
      },cam={
        pitch:0,cy:240
      },P=PIXI;

      /* @function horizon1624.draw — Inputs: camera pitch radians. Returns selected GPU pixels and mesh identity from the real horizon layer. No readback exists in production. */function draw(pitch,outdoorIsometric=false){
        ctx.begin?.();
        ctx.drawStage.removeChildren();
        ctx.fillStyle='#204080';
        ctx.globalAlpha=1;
        ctx.fogDepth=0;
        ctx.fillRect(0,0,640,480);
        FrontierHorizonFog.draw(ctx,game,{
          ...cam,pitch,orthographic:outdoorIsometric,outdoorIsometric
        });
        const mesh=ctx.drawStage.children.at(-1);
        ctx.app.renderer.render({
          container:ctx.drawStage,target:ctx.paletteWorld?.texture
        });
        const target=P.RenderTexture.create({
          width:640,height:480
        });
        ctx.app.renderer.render({
          container:ctx.drawStage,target
        });
        const pixels=ctx.app.renderer.extract.pixels({
          target
        }).pixels;
        const output={
          top:Array.from(pixels.slice((10*640+320)*4,(10*640+320)*4+4)),horizon:Array.from(pixels.slice((240*640+320)*4,(240*640+320)*4+4)),bottom:Array.from(pixels.slice((470*640+320)*4,(470*640+320)*4+4))
        };
        target.destroy(true);
        return {
          output,mesh
        };
      }

      const first=draw(0),second=draw(.4);
      return {
        first:first.output,second:second.output,iso:draw(0,true).output,reused:first.mesh===second.mesh
      };
    });
    assert.deepEqual(result.first.top,[32,64,128,255]);
    assert.deepEqual(result.first.horizon,[102,82,99,255]);
    assert.deepEqual(result.first.bottom,[102,82,99,255]);
    assert.deepEqual(result.iso.top,[102,82,99,255]);
    assert.deepEqual(result.iso.bottom,[102,82,99,255]);
    assert(result.reused);
    assert.notDeepEqual(result.second.horizon,result.first.horizon);
    await page.waitForTimeout(600);
    await page.screenshot({
      path:'test-artifacts/horizon1624.png'
    });
    console.log('PASS actual fog fills empty background, upper sky unchanged, pitch tracking and shared mesh reuse',result);
  }finally{
    await browser.close();
  }
})().catch(/* @function horizon1624.failure — Inputs: error. Reports failed GPU acceptance with nonzero exit after cleanup. */function(e){
  console.error(e);
  process.exitCode=1;
});


