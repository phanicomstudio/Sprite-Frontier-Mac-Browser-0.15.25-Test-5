/* October 13, 2026: real authoring, definition copies and portable round trip. */
'use strict';
const {chromium,launch}=require('./environment.cjs'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
(/* @function templateWorkflow.run — Inputs: none. Returns promise. Creates a blank room through actual controls, saves a merchant definition from an uncommitted event draft, places independent copies, overrides one stock, exports/imports the project and reloads local persistence. Uses isolated test state and retains evidence; closes browser on all outcomes. */async function(){
 const browser=await chromium.launch(launch);
 try{
  const page=await browser.newPage(),errors=[],definitionName='Template shop '+Date.now();
  page.on('pageerror',/* @function templateWorkflow.error — Inputs: browser exception. Returns array length; retains errors for explicit acceptance failure. */function(error){return errors.push(error.message);});
  await page.addInitScript(/* @function templateWorkflow.capture — Inputs: none. Returns nothing. Retains the actual factory-created library/controller and adapter; wraps neither their behavior nor persistence. These handles exist only in this fixture. */function(){
   /* @function templateWorkflow.factory — Inputs: global namespace name and test handle name. Returns nothing; installs a property wrapper before the namespace loads, preserving original factory arguments/result. */function factory(name,handle){
    let namespace;Object.defineProperty(window,name,{
     get:/* @function templateWorkflow.get — Inputs: none. Returns the installed production namespace. */function(){return namespace;},
     set:/* @function templateWorkflow.set — Inputs: production namespace. Returns nothing; retains its original create before adding the diagnostic handle. */function(value){namespace=value;const original=value.create;value.create=/* @function templateWorkflow.create — Inputs: original adapter. Returns original controller/service; captures adapter only for authoring entry points already used by context menus. */function(api){if(name==='FrontierHubWorkbench')window.templateApi=api;return window[handle]=original(api);};}
    });
   }
   factory('FrontierMaps','templateLibrary');factory('FrontierHubWorkbench','templateHub');
  });
  await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));await page.waitForSelector('#workspaceToggle');await page.locator('#workspaceToggle').click();
  await page.locator('#newMap').evaluate(/* @function templateWorkflow.newMap — Inputs: retained real launcher button. Returns nothing; opens actual dialog behind project disclosure. */function(button){button.click();});
  await page.locator('#newMapName').fill('Template workflow room');await page.locator('#newMapTemplate').selectOption('interior');await page.locator('#confirmNewMap').click();
  await page.locator('#buildingType').selectOption('shell');await page.locator('#building-width').fill('6');await page.locator('#building-depth').fill('6');await page.locator('#buildingPreview').click();await page.locator('#buildingConfirm').click();
  await page.evaluate(/* @function templateWorkflow.storage — Inputs: none. Returns nothing; opens the same production storage draft as the context menu at the actual room spawn. */function(){templateHub.storageSettings({...templateApi.world().spawn});});
  let dialog=page.getByRole('dialog',{name:'Container / merchant'});
  await dialog.getByLabel('Name',{exact:true}).fill('Source shop');await dialog.getByLabel('Behavior',{exact:true}).selectOption('merchant');await dialog.getByLabel('Stock item ID',{exact:true}).fill('healing-herb');await dialog.getByLabel('Stock quantity (whole items)',{exact:true}).fill('7');await dialog.getByRole('button',{name:'Apply',exact:true}).click();
  await page.locator('#mzEngineSettings > summary').click();await page.locator('#mzSaveDefinition').click();
  dialog=page.getByRole('dialog',{name:'Save reusable event definition'});await dialog.getByLabel('Definition name',{exact:true}).fill(definitionName);await dialog.getByRole('button',{name:'OK',exact:true}).click();
  assert.equal(await page.evaluate(/* @function templateWorkflow.unapplied — Inputs: none. Returns authored-event count; definition Save must not commit the still-open event draft. */function(){return templateApi.world().events.length;}),0);
  await page.locator('#mzEventOK').click();
  for(const [name,offset] of [['Shop A',-1],['Shop B',1]]){
   await page.evaluate(/* @function templateWorkflow.place — Inputs: horizontal offset metres. Returns nothing; opens real definition placement at independent room coordinates. */function(offset){const p=templateApi.world().spawn;templateHub.placeTemplate({x:p.x+offset,y:p.y+1});},offset);
   dialog=page.getByRole('dialog',{name:'Place reusable template'});await dialog.getByLabel('Template',{exact:true}).selectOption({label:definitionName});await dialog.getByRole('button',{name:'Apply',exact:true}).click();await page.locator('#mzEventName').fill(name);await page.locator('#mzEventOK').click();
  }
  await page.evaluate(/* @function templateWorkflow.override — Inputs: none. Returns nothing; opens existing Shop A through production storage authoring, preserving identity and other settings. */function(){const event=templateApi.world().events.find(/* @function templateWorkflow.shopA — Inputs: event. Returns Shop A name match. */function(value){return value.name==='Shop A';});templateHub.storageSettings({x:event.x,y:event.y},event);});
  dialog=page.getByRole('dialog',{name:'Container / merchant'});await dialog.getByLabel('Stock quantity (whole items)',{exact:true}).fill('3');await dialog.getByRole('button',{name:'Apply',exact:true}).click();await page.locator('#mzEventOK').click();
  const project=await page.locator('#exportProject').evaluate(/* @function templateWorkflow.export — Inputs: real export button. Returns parsed actual download Blob; temporarily captures URL creation and restores it even on failure. No export bytes are changed. */async function(button){const original=URL.createObjectURL;let blob;URL.createObjectURL=/* @function templateWorkflow.blob — Inputs: production Blob. Returns normal object URL and retains bytes for round-trip testing. */function(value){blob=value;return original.call(URL,value);};try{button.click();return JSON.parse(await blob.text());}finally{URL.createObjectURL=original;}});
  const active=project.maps.find(/* @function templateWorkflow.active — Inputs: map. Returns portable active ID match. */function(map){return map.id===project.active;}),shops=active.world.events;
  assert.equal(shops.length,3);assert.equal(active.world.interior.primitives.length,6);
  for(const event of shops)assert.equal(event.extensions.hub.stock[0].quantity,event.name==='Shop A'?3:7);
  assert.equal(project.templates.entries.find(/* @function templateWorkflow.definition — Inputs: bank entry. Returns fixture name match. */function(entry){return entry.name===definitionName;}).event.extensions.hub.stock[0].quantity,7);
  await page.locator('#importProject').setInputFiles({name:'template-roundtrip.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});
  await page.waitForFunction(/* @function templateWorkflow.imported — Inputs: none. Returns whether actual merge/import handler completed. No fabricated status or direct restore. */function(){return document.getElementById('message').textContent==='Imported maps added to this library.';});
  const imported=await page.evaluate(/* @function templateWorkflow.importEvidence — Inputs: none. Returns current portable active world and definition count after real import. */function(){const p=FrontierMaps.validate(templateLibrary.snapshot());return {active:p.active,world:p.maps.find(/* @function templateWorkflow.importMap — Inputs: map. Returns active match. */function(map){return map.id===p.active;}).world,templates:p.templates.entries.length};});
  assert.notEqual(imported.active,project.active);assert.equal(imported.world.events.length,3);assert.equal(imported.world.interior.primitives.length,6);
  await page.waitForFunction(/* @function templateWorkflow.saved — Inputs: none. Returns real local-save completion status. */function(){return document.getElementById('mapSaveStatus').textContent==='Maps saved on this computer.';});
  await page.reload();await page.waitForFunction(/* @function templateWorkflow.reloaded — Inputs: imported active ID. Returns whether IndexedDB-backed startup selected that same authored map. */function(id){return window.templateLibrary?.active===id;},imported.active);
  const loaded=await page.evaluate(/* @function templateWorkflow.loaded — Inputs: none. Returns validated reloaded current world; no direct restore or test injection. */function(){const p=FrontierMaps.validate(templateLibrary.snapshot());return p.maps.find(/* @function templateWorkflow.loadedMap — Inputs: map. Returns active match. */function(map){return map.id===p.active;}).world;});
  assert.deepEqual(loaded.events,imported.world.events);assert.deepEqual(loaded.interior,imported.world.interior);assert.deepEqual(errors,[]);
  fs.writeFileSync(path.resolve('test-artifacts/template-workflow1524.json'),JSON.stringify({at:new Date().toISOString(),map:imported.active,shops:loaded.events.map(/* @function templateWorkflow.shopEvidence — Inputs: authored event. Returns independent saved identity/name/quantity for concise evidence. */function(event){return {id:event.id,name:event.name,quantity:event.extensions.hub.stock[0].quantity};}),scope:'Actual room authoring, uncommitted definition Save, independent template copies/override, production project export/import and IndexedDB reload'},null,2));
  console.log('PASS real room/template/copy override/export/import/local reload workflow');
 }finally{await browser.close();}
})().catch(/* @function templateWorkflow.failure — Inputs: rejected error. Returns nothing; reports failed acceptance and nonzero exit. */function(error){console.error(error);process.exitCode=1;});
