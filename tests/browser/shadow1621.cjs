const assert=require('node:assert/strict'),path=require('node:path'),{
  chromium,launch
}
=require('./environment.cjs'),observe=require('./host-observer1611.cjs');

(/* @function shadow1621.run — Inputs: none. Exercises real bounded shadow meshes with six simultaneous casters while idle and rotating; checks no cache-budget disappearances after warmup. Uses existing scene terrain and actual receiver sweeps. */async function(){
  const browser=await chromium.launch({
    ...launch,args:['--allow-file-access-from-files']
  });
  try{
    const page=await browser.newPage();
    await observe(page);
    await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));
    await page.locator('#workspaceToggle').waitFor();
    const result=await page.evaluate(/* @function shadow1621.probe — Inputs: none. Returns actual submitted caster counts and bounded ray work; test-only cloned actors never enter saved map data. */function(){
      const g=testHost1611.roomApi.game(),ctx=FrontierPixi.current();
      g.authoring=false;
      g.sourceWorld={
        ...g.sourceWorld,interior:undefined,presentation:FrontierIsometric.validate({
          mode:'perspective'
        }),lighting:FrontierLocalLighting.validate({
          enabled:true,sun:{
            enabled:true
          }
        })
      };
      g.camera.firstPerson=false;
      FrontierRender.draw(document.getElementById('view'),g);
      ctx.terrainDepth ||= {
        w:64,h:48,values:new Float32Array(64*48)
      };
      const cam=FrontierRender.camera(g),actors=[];
      for(let i=0;i<6;i++)actors.push({
        ...g.player,id:'shadow-test-'+i,kind:'player',spriteProfile:'candy-armed',holstered:false,x:g.player.x+(i%3)*.4,y:g.player.y+Math.floor(i/3)*.4,height:1.65
      });
      const counts=[],rays=[];
      for(let i=0;i<20;i++){
        g.elapsed+=.03;
        if(i>=8)cam.yaw+=.03;
        counts.push(FrontierSunShadows.draw163(ctx,g,cam,actors,FrontierRender.project));
        rays.push(g.sunShadowDebug.rays);
      }
      const split=FrontierSunShadows.draw163(ctx,g,{
        ...cam,orthographic:true
      },actors,FrontierRender.project);
      FrontierPixi.end();
      return {
        counts,rays,split
      };
    });
    assert(result.counts.slice(4).every(/* @function shadow1621.stable — Inputs: submitted caster count. Requires all six cached casters remain submitted after startup budget warms. */function(n){
      return n===6;
    }),JSON.stringify(result));
    assert(result.rays.every(/* @function shadow1621.budget — Inputs: frame ray count. Enforces original two-grid/90-ray upper bound. */function(n){
      return n<=90;
    }));
    assert.equal(result.split,0);
    console.log('PASS six cached shadows retained idle/rotation, 90-ray bound and orthographic sun exclusion',result.counts);
  }finally{
    await browser.close();
  }
})().catch(/* @function shadow1621.failure — Inputs: test error. Reports failure after closing browser and sets failing exit status. */function(e){
  console.error(e);
  process.exitCode=1;
});


