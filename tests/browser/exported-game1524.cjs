/* October 13: independent startup of the folder created by the native UI.
 * Does not regenerate the entry or inject missing resources. */
'use strict';
const {chromium,launch}=require('./environment.cjs'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{fileURLToPath,pathToFileURL}=require('node:url');
(/* @function exportedGameTest.run â€” Inputs: saved native export evidence file (optional FRONTIER_EXPORT_EVIDENCE path). Returns promise. Opens its exact output, checks gameplay-only DOM and real options/inventory controls, and audits resource failures. Leaves export unchanged, closes browser on failure and does not claim animated travel/full performance acceptance. */async function(){
 const evidence=JSON.parse(fs.readFileSync(process.env.FRONTIER_EXPORT_EVIDENCE||'test-artifacts/native-export-ui1524.json','utf8')),browser=await chromium.launch(launch);
 try{
  const page=await browser.newPage(),errors=[],failed=[];
  page.on('pageerror',/* @function exportedGameTest.error â€” Inputs: exception. Returns array length; retains failure messages without suppression. */function(error){return errors.push(error.message);});
  page.on('requestfailed',/* @function exportedGameTest.failedResource â€” Inputs: actual resource request. Returns array length; records URL/reason for source closure checks. */function(request){return failed.push({url:request.url(),reason:request.failure()?.errorText});});
  await page.goto(pathToFileURL(path.join(evidence.directory,'index.html')).href);await page.waitForSelector('body.engineRuntime');
  for(const selector of ['#editor','#workspaceBar','#workspaceAssets','body > header','main > aside','#exportGame'])assert.equal(await page.locator(selector).count(),0);
  await page.keyboard.press('F2');assert.equal(await page.locator('body.engineAuthoring').count(),0);
  await page.keyboard.press('Escape');await page.locator('#pauseOptions').click();await page.locator('#renderScale').selectOption('2');await page.locator('#renderFiltering').selectOption('smooth');await page.locator('#pauseHand').selectOption('Fem');await page.locator('#pauseBack').click();if(process.env.FRONTIER_NATIVE_FINAL_MATERIAL==='1'){
    const saved=await page.locator('#pauseSave').evaluate(
      /* @function exportedGameTest.materialSave — Inputs: normal pause Save button. Returns production portable save bytes; observes its Blob without altering save data and restores URL creation on all outcomes. */async function(button){const original=URL.createObjectURL;let blob;URL.createObjectURL=/* @function exportedGameTest.materialBlob — Inputs: save Blob. Returns the ordinary object URL and retains exact data for acceptance only. */function(value){blob=value;return original.call(URL,value);};try{button.click();return JSON.parse(await blob.text());}finally{URL.createObjectURL=original;}});
    const event=saved.project.maps.find(/* @function exportedGameTest.savedActive — Inputs: map. Returns active identity match, no mutation. */map=>map.id===saved.project.active).world.events.find(/* @function exportedGameTest.savedMaterial — Inputs: event. Returns material fixture identity match, read-only. */event=>event.id==='material-instance');
    assert.equal(event.spatial.materials[0].color,'#00ff00');assert.equal(event.spatial.materials[0].repeatU,2);assert(event.spatial.materials[0].texture.startsWith('data:image/png;'));
    await page.locator('#loadCombat').setInputFiles({name:'material-native-save.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});
    await page.waitForFunction(/* @function exportedGameTest.materialLoaded — Inputs: none. Returns actual successful loader message; no direct state injection or simulated success. */function(){return document.getElementById('message').textContent==='Playtest restored.';});
  }
  await page.locator('#pauseResume').click();
  await page.keyboard.press('i');await page.waitForSelector('#inventoryPanel',{state:'visible'});await page.locator('#inventoryClose').click();await page.waitForSelector('#inventoryPanel',{state:'hidden'});
  await page.waitForTimeout(500);
  const unresolved=failed.filter(/* @function exportedGameTest.unresolved â€” Inputs: failed resource record. Returns whether the failure is not an intentional cancellation of an existing local file. Missing/other failures cannot be ignored. */function(record){return record.reason!=='net::ERR_ABORTED'||!record.url.startsWith('file:')||!fs.existsSync(fileURLToPath(record.url));});
  assert.deepEqual(errors,[]);assert.deepEqual(unresolved,[]);
  await page.locator('#view').screenshot({path:process.env.FRONTIER_EXPORT_EVIDENCE?'test-artifacts/native-export-ui-game1524-current.png':'test-artifacts/native-export-ui-game1524.png'});
  fs.writeFileSync(process.env.FRONTIER_EXPORT_EVIDENCE?'test-artifacts/native-export-ui-game1524-current.json':'test-artifacts/native-export-ui-game1524.json',JSON.stringify({directory:evidence.directory,scope:'Independently opened exact native-UI output; startup, quality/hand options, inventory, F2 guard and requested resource closure',errors,unresolved},null,2));console.log('PASS actual native-UI exported folder startup, clean gameplay DOM, options, inventory and resource requests');
 }finally{await browser.close();}
})().catch(/* @function exportedGameTest.failure â€” Inputs: rejected error. Returns nothing; preserves evidence and sets unsuccessful exit. */function(error){console.error(error);process.exitCode=1;});
