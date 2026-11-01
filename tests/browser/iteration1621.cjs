const assert=require('node:assert/strict'),path=require('node:path'),{
  chromium,launch
}
=require('./environment.cjs'),observe=require('./host-observer1611.cjs');

(/* @function iteration1621.run — Inputs: none. Exercises actual browser camera entry, overlay, character assignment and owner light sampling; browser is isolated and always closed. */async function(){

  const browser=await chromium.launch({
    ...launch,args:['--allow-file-access-from-files']
  });

  try{

    const page=await browser.newPage({
      viewport:{
        width:1600,height:1000
      }
    }),errors=[];
    await observe(page);

    page.on('pageerror',/* @function iteration1621.error — Inputs: uncaught browser error. Collects failures for hard assertion without suppressing runtime behavior. */function(e){
      errors.push(e.message);
    });

    await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));
    await page.locator('#workspaceToggle').waitFor();

    const result=await page.evaluate(/* @function iteration1621.probe — Inputs: none. Uses current live game and real original renderer. Verifies owner exclusion, projectile illumination and actual overlay readiness without persisted user data. */async function(){

      const g=testHost1611.roomApi.game();
      g.authoring=false;
      g.player.holstered=false;
      g.player.spriteProfile='candy-armed';
      g.player.weapon=structuredClone(PhanicomABS.weapons.get('handgun'));
      g.camera.firstPerson=true;

      const def=FrontierFirstPerson.assignment(g.player);
      if(!def)throw Error('No Candy pistol assignment');

      const image=new Image();
      image.src=def.src;
      await image.decode();

      g.sourceWorld={
        ...g.sourceWorld,interior:undefined,presentation:FrontierIsometric.validate({
          mode:'perspective'
        }),lighting:FrontierLocalLighting.validate({
          enabled:true,ambient:0,player:{
            enabled:true,intensity:1,radius:6
          }
        })
      };

      const f=FrontierLocalLighting.frame(g,g.elapsed),p=g.player,other=FrontierLocalLighting.sample(f,p.x,p.y,(p.z||0)+1.2),owner=FrontierLocalLighting.sample(f,p.x,p.y,(p.z||0)+1.2,undefined,p.id||'player');

      g.projectiles=[MF.createProjectile(g,p,g.player.weapon,{
        x:0,y:1,z:0
      })];
      const shotFrame=FrontierLocalLighting.frame(g,g.elapsed),shot=shotFrame.lights.find(/* @function iteration1621.shot — Inputs: active light. Finds actual mandatory projectile emitter for owner-light regression. */function(l){
        return l.projectile;
      });

      const lit=FrontierLocalLighting.sample(shotFrame,shot.x,shot.y,shot.z,undefined,p.id||'player');

      FrontierRender.draw(document.getElementById('view'),g);
      await new Promise(/* @function iteration1621.decodeWait — Inputs: resolve callback. Allows the real overlay Image to decode; no renderer replacement. */function(resolve){
        setTimeout(resolve,200);
      });
      FrontierRender.draw(document.getElementById('view'),g);

      const shown=!!g.firstPersonDebug;
      g.player.holstered=true;
      const hidden=FrontierFirstPerson.assignment(g.player)===null;

      const oldZ=p.z;p.z=100;p.holstered=false;
      p.weapon.firstPerson=FrontierFirstPerson.validate({'candy-armed':{...def,spawnForward:.7,spawnRight:-.2,spawnUp:-.25}});
      const expected=FrontierFirstPerson.muzzle(p,g,FrontierRender.camera(g)),actual=MF.createProjectile(g,p,p.weapon,{x:0,y:1,z:0});
      const spawnMatch=Math.hypot(actual.position.x-expected.x,actual.position.y-expected.y,actual.position.z-expected.z)<1e-8;
      p.z=oldZ;
      return {
        owner,other,lit,shown,hidden,spawnMatch,width:image.naturalWidth,weapon:g.player.weapon.id
      };

    });

    assert(result.shown&&result.hidden);assert(result.spawnMatch,"Actual projectile must use configured first-person origin");
    assert.equal(result.width,1920);
    assert(result.owner.every(/* @function iteration1621.dark — Inputs: RGB channel. Requires no owner contribution at zero ambient. */function(n){
      return n===0;
    }));
    assert(result.other[0]>0);
    assert(result.lit[0]>0);

    await page.evaluate(/* @function iteration1621.visual � Inputs: none. Leaves the actual armed view visible for screenshot verification. */function(){
      const g=testHost1611.roomApi.game();
      g.player.holstered=false;
      g.camera.firstPerson=true;
      g.sourceWorld.lighting.ambient=.6;
      g.projectiles=[];
      FrontierRender.draw(document.getElementById('view'),g);
    });

    await page.screenshot({
      path:'test-artifacts/first-person1621.png'
    });

    await page.evaluate(/* @function iteration1621.cameraSetup � Inputs: none. Prepares the live perspective camera at its actual zoom limit. */function(){
      const g=testHost1611.roomApi.game();
      g.camera.firstPerson=false;
      g.camera.distance=FrontierParameters.get(g.sourceWorld,'zoomMin');
    });

    await page.locator('#view').dispatchEvent('wheel',{
      deltaY:-100,deltaMode:0
    });

    const wheel=await page.evaluate(/* @function iteration1621.wheelResult � Inputs: none. Reads actual handler result, no alternate camera implementation. */function(){
      return testHost1611.roomApi.game().camera.firstPerson;
    });

    assert(wheel,'Inward wheel at perspective minimum enters first person');
  await page.locator('#view').dispatchEvent('wheel',{deltaY:100,deltaMode:0});
  assert.equal(await page.evaluate(/* @function iteration1622.outwardWheel � Inputs: none. Reads the actual camera handler after outward wheel input; first-person must return to third person without changing its lens. */function(){return testHost1611.roomApi.game().camera.firstPerson;}),false);


    await page.evaluate(/* @function iteration1621.isoSetup � Inputs: none. Sets real isometric presentation and resets first-person state to test restricted wheel entry. */function(){
      const g=testHost1611.roomApi.game();
      g.camera.firstPerson=false;
      g.sourceWorld.presentation=FrontierIsometric.validate({
        mode:'isometric'
      });
      testHost1611.roomApi.world().presentation=g.sourceWorld.presentation;
      g.camera.isoScale=200;
    });

    await page.locator('#view').dispatchEvent('wheel',{
      deltaY:-100,deltaMode:0
    });

    assert.equal(await page.evaluate(/* @function iteration1621.isoResult � Inputs: none. Returns live camera mode after actual wheel handler. */function(){
      return testHost1611.roomApi.game().camera.firstPerson;
    }),false);

    assert.deepEqual(errors,[]);
    console.log('PASS first-person actual artwork, holster visibility, passive owner exclusion and mandatory projectile response',result);

  }finally{
    await browser.close();
  }

})().catch(/* @function iteration1621.failure — Inputs: assertion/runtime error. Prints actionable failure and sets nonzero exit after cleanup. */function(e){
  console.error(e);
  process.exitCode=1;
});


