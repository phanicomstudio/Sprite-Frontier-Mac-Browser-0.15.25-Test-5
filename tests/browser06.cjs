/* Own-app smoke test. Intentionally disables pointer lock and uses DOM events
 * so headless tests cannot trap the user's physical mouse in a hidden window.
 * Install Playwright separately or set PLAYWRIGHT_MODULE to an existing copy. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH});
 try{
  const page=await browser.newPage({viewport:{width:1500,height:1100}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{HTMLCanvasElement.prototype.requestPointerLock=function(){return Promise.resolve();};});
  await page.goto('file:///'+path.join(__dirname,'../index.html').replaceAll('\\','/'));
  await page.evaluate(()=>{const draw=FrontierRender.draw;FrontierRender.draw=(c,g)=>{window.testGame=g;return draw(c,g);};});
  await page.waitForFunction(()=>window.testGame&&FrontierPixi.app?.stage.children.some(c=>c instanceof PIXI.Sprite));
  assert.equal(await page.evaluate(()=>FrontierSprites.sheet(testGame.player).id),'candy-armed');
  await page.evaluate(()=>{document.getElementById('view').focus();document.dispatchEvent(new KeyboardEvent('keydown',{key:' '}));document.dispatchEvent(new KeyboardEvent('keyup',{key:' '}));});
  assert.equal(await page.evaluate(()=>FrontierSprites.sheet(testGame.player).id),'candy-unarmed');
  await page.evaluate(()=>{document.dispatchEvent(new KeyboardEvent('keydown',{key:' '}));document.dispatchEvent(new KeyboardEvent('keyup',{key:' '}));});
  const combat=await page.evaluate(()=>{testGame.combatCooldown=0;const ammo=testGame.player.ammoLoaded;MF.fireShot(testGame,320,96,testGame.ui);const origin=testGame.projectiles.at(-1).position,flash=testGame.muzzleFlashes.at(-1);PhanicomABS.equip(testGame,'shotgun');testGame.projectiles=[];testGame.combatCooldown=0;MF.fireShot(testGame,320,96,testGame.ui);return {origin,flash,spent:ammo-testGame.player.ammoLoaded,pellets:testGame.projectiles.length};});
  assert(combat.origin.z>1.2);assert.equal(combat.origin.z,combat.flash.z);assert.equal(combat.pellets,8);assert.equal(combat.spent,2);
  await page.evaluate(()=>{document.getElementById('openMuzzle').click();});
  const frame=page.frames().find(f=>f.url().includes('muzzle-editor.html'));await frame.waitForFunction(()=>document.getElementById('profile').options.length>0);
  await frame.evaluate(()=>{document.getElementById('yaw').value=4;document.getElementById('yaw').dispatchEvent(new Event('input'));document.getElementById('apply').click();});
  await page.waitForFunction(()=>FrontierMuzzle.profiles.get('candy-armed').muzzles['0:0'].yawOffset===4);
  await page.evaluate(()=>{document.getElementById('muzzleClose').click();document.getElementById('edit').click();});

  // Select an actual prefab ID rather than relying on a generated prop index.
  await page.evaluate(()=>{const s=document.getElementById('selection');s.value=[...s.options].find(o=>o.text.includes('[event]')).value;s.dispatchEvent(new Event('change'));});
  const before=await page.locator('#eventPage option').count();await page.evaluate(()=>document.getElementById('copyPage').click());assert.equal(await page.locator('#eventPage option').count(),before+1);
  await page.locator('#openEventEditor').click();
  await page.locator('#eventName').fill('Regression supply');await page.evaluate(()=>document.getElementById('savePage').click());assert.equal(await page.locator('#eventName').inputValue(),'Regression supply');
  await page.locator('#closeEventWindow').click();
  await page.locator('#parameter-jumpHeight').fill('1.5');await page.locator('#parameter-playerSpeed').fill('4');
  await page.evaluate(()=>document.getElementById('applyParameters').click());
  await page.waitForFunction(()=>testGame.sourceWorld.parameters.jumpHeight===1.5);
  assert.equal(await page.evaluate(()=>testGame.sourceWorld.parameters.jumpHeight),1.5);
  await page.evaluate(()=>{FrontierMusicPicker.useManifest({exploration:['Forest.ogg','Road.ogg','Temple.ogg'],combat:['Danger.ogg']});const pick=(id,track)=>{const input=document.getElementById(id);input.picker.available.value=track;input.picker.group.querySelector('.addTrack').click();};pick('musicExploration','Forest.ogg');pick('musicExploration','Road.ogg');pick('musicCombat','Danger.ogg');pick('musicMap','Temple.ogg');});
  await page.evaluate(()=>document.getElementById('applyMusic').click());
  await page.waitForFunction(()=>testGame.sourceWorld.music.mapExploration[0]==='Temple.ogg');
  assert.equal(await page.evaluate(()=>testGame.sourceWorld.music.mapExploration[0]),'Temple.ogg');
  await page.evaluate(()=>{document.getElementById('edit').click();});
  const save=await page.evaluate(()=>({schema:'phanicom-playtest/1',world:testGame.sourceWorld,player:{x:24,y:24,hp:90,ammoLoaded:5,ammoReserve:40,weapon:'handgun',deathMode:'damage'},blood:{hidden:false,actors:{player:'cream'}},switches:[['loaded',true]],variables:[],selfSwitches:[],inventory:[]}));
  await page.locator('#loadCombat').setInputFiles({name:'save.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(save))});
  await page.waitForFunction(()=>testGame.player.hp===90);
  assert.equal(await page.evaluate(()=>typeof testGame.player.weapon),'object');assert.equal(await page.evaluate(()=>testGame.player.weapon.id),'handgun');
  const blood=await page.evaluate(()=>{PhanicomBlood.sprayCharacter(testGame.player,{count:18});testGame.player.hp=1;for(let i=0;i<25;i++)PhanicomBlood.update(testGame,1/60);return {layer:testGame.bloodFX.at(-1)?.layer,drips:testGame.passiveDrips.length};});assert.equal(blood.layer,'cream');assert(blood.drips>0);
  const cursor=await page.evaluate(async()=>{testGame.player.hp=100;testGame.player.x=24;testGame.player.y=24;const key=k=>document.dispatchEvent(new KeyboardEvent('keydown',{key:k}));key('p');const yaw=testGame.camera.yaw,pitch=testGame.camera.pitch,x=testGame.player.x,y=testGame.player.y;key('w');key('ArrowLeft');document.getElementById('view').dispatchEvent(new PointerEvent('pointermove',{clientX:800,clientY:400,movementX:100,movementY:100}));await new Promise(r=>setTimeout(r,180));for(const k of ['w','ArrowLeft'])document.dispatchEvent(new KeyboardEvent('keyup',{key:k}));const result={moved:Math.hypot(testGame.player.x-x,testGame.player.y-y),stable:yaw===testGame.camera.yaw&&pitch===testGame.camera.pitch};key('p');return result;});assert(cursor.moved>0);assert(cursor.stable);
  const stopped=await page.evaluate(()=>{testGame.player.hp=0;PhanicomBlood.update(testGame,1/60);return testGame.passiveDrips.filter(d=>d.actorId===testGame.player.id).length;});assert.equal(stopped,0);
  await page.evaluate(()=>{document.getElementById('aspect').value='16:9';document.getElementById('aspect').dispatchEvent(new Event('change'));});assert.equal(await page.locator('#view').getAttribute('width'),'854');
  await page.evaluate(()=>{document.getElementById('aspect').value='4:3';document.getElementById('aspect').dispatchEvent(new Event('change'));});
  assert.deepEqual(errors,[]);await page.screenshot({path:path.join(__dirname,'../preview-06.png')});
  console.log('PASS: local-file Pixi/Candy, holster sheet switching, calibrated shot/flash, shotgun, calibration Apply, editor page copy/save, playtest save/load weapon reconstruction, cream/passive blood, aspect switch; pointer lock disabled.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
