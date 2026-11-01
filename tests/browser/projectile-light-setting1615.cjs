const path=require('node:path'),assert=require('node:assert/strict'),{chromium,launch}=require('./environment.cjs'),observe=require('./host-observer1611.cjs');
/* @function projectileSettingTest.read1615 — Inputs: none. Returns detached canonical authored lighting and normal-bank snapshot through the original test-observed owner. Defaults are normalized only for comparison; no state is written. */
function read(){const world=testHost1611.roomApi.world();return {lighting:FrontierLocalLighting.validate(world.lighting),normals:JSON.stringify(world.spriteNormals||null)};}
/* @function projectileSettingTest.open1615 — Inputs: isolated Playwright page. Opens the real map-lighting controls through visible workspace actions. Does not apply settings or fabricate source data. */
async function open(page){await page.getByRole('button',{name:'Environment',exact:true}).click();await page.getByRole('button',{name:'Map lighting',exact:true}).click();}
(/* @function projectileSettingTest.run1615 — Inputs: none. Verifies immediate checkbox persistence through playtest, save/reload and Undo, real projectile-factory emission across camera types, and preservation of other lights/normal bindings. Isolated browser closes on every failure. */async function(){
 const browser=await chromium.launch({...launch,args:['--allow-file-access-from-files']});
 try{
  const page=await browser.newPage({viewport:{width:1600,height:1050}}),errors=[];
  page.on('pageerror',/* @function projectileSettingTest.error1615 — Inputs: renderer exception. Records real errors without suppressing them. */function(error){errors.push(error.message);});
  await observe(page);await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));
  await page.keyboard.press('F2');await open(page);const before=await page.evaluate(read);
  await page.locator('#localProjectileLight').check();await page.keyboard.press('F2');
  const enabled=await page.evaluate(read);assert(enabled.lighting.projectiles.enabled,'Checkbox must commit without another Apply step');
  const frames=await page.evaluate(/* @function projectileSettingTest.emit1615 — Inputs: none. Creates real shots through the installed calibrated projectile factory, then samples the production light frame synchronously in each supported camera mode. Restores runtime presentation and actual projectile list; no authored weapon/light policy is changed. */function(){
   const game=testHost1611.roomApi.game(),prior=game.projectiles,source=game.sourceWorld,first=game.camera.firstPerson,reports=[];
   try{for(const mode of ['third','first','isometric']){game.sourceWorld={...source,presentation:FrontierIsometric.validate({mode:mode==='isometric'?'isometric':'perspective'})};game.camera.firstPerson=mode==='first';game.projectiles=[];
    for(let i=0;i<12;i++)game.projectiles.push(MF.createProjectile(game,game.player,game.player.weapon,{x:0,y:1,z:0}));
    const frame=FrontierLocalLighting.frame(game,game.elapsed);reports.push({mode,enabled:game.sourceWorld.lighting.projectiles.enabled,lights:frame.lights.filter(/* @function projectileSettingTest.projectile1615 — Inputs: submitted source. Returns only actual projectile emitters, excluding the existing player light. */function(light){return light.id.startsWith('projectile-');}).length,budget:game.sourceWorld.lighting.budget});
    const off=MF.createProjectile(game,game.player,{...game.player.weapon,light:{enabled:false}},{x:0,y:1,z:0});game.projectiles=[off];reports.at(-1).weaponDisabled=FrontierLocalLighting.frame(game,game.elapsed).lights.every(/* @function projectileSettingTest.explicitOff1615 — Inputs: light. Requires explicit per-weapon off to remain authoritative over map default. */function(light){return !light.id.startsWith('projectile-');});
   }}finally{game.sourceWorld=source;game.camera.firstPerson=first;game.projectiles=prior;}return reports;
  });
  for(const frame of frames){assert(frame.enabled&&frame.lights>0&&frame.lights<=frame.budget,JSON.stringify(frame));assert(frame.weaponDisabled);}
  await page.keyboard.press('F2');await open(page);assert(await page.locator('#localProjectileLight').isChecked());
  await page.locator('#localProjectileLight').uncheck();await page.keyboard.press('F2');assert.equal((await page.evaluate(read)).lighting.projectiles.enabled,false);
  await page.keyboard.press('F2');await page.locator('#undo').click();await open(page);assert(await page.locator('#localProjectileLight').isChecked());
  const preserved=await page.evaluate(read);enabled.lighting.projectiles.enabled=before.lighting.projectiles.enabled;preserved.lighting.projectiles.enabled=before.lighting.projectiles.enabled;assert.deepEqual(preserved,before);
  await page.waitForFunction(/* @function projectileSettingTest.saved1615 — Inputs: none. Waits for original IndexedDB save owner before reload; no alternate persistence mechanism is used. */function(){return document.getElementById('mapSaveStatus').textContent==='Maps saved on this computer.';});
  await page.reload();await page.keyboard.press('F2');await open(page);assert(await page.locator('#localProjectileLight').isChecked());assert.deepEqual(errors,[]);
  console.log('PASS projectile-light checkbox through playtest, disable/Undo and save/reload; real camera-independent emitters, budgets, per-weapon opt-out and preserved map/normal settings');
 }finally{await browser.close();}
})().catch(/* @function projectileSettingTest.failure1615 — Inputs: acceptance failure. Reports nonzero status without touching user projects or replacing production light calculations. */function(error){console.error(error);process.exitCode=1;});
