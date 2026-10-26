// October 26: independent startup of production-descriptor runtime package.
const assert=require('node:assert/strict'),path=require('node:path');
const {chromium,launch}=require('./environment.cjs');
(/* @function runtime163.run — Inputs: optional FRONTIER_RUNTIME_CHECK path. Opens packaged runtime unchanged, checks gameplay-only DOM, appearance, controls and missing resources. Closes browser on every outcome; does not claim native chooser or desktop hardware certification. */async function(){
 const browser=await chromium.launch(launch);
 try{const page=await browser.newPage(),errors=[],failed=[];
 page.on('pageerror',/* @function runtime163.error — Inputs: browser exception. Retains message for acceptance without suppressing failures. */function(e){errors.push(e.message);});
 page.on('requestfailed',/* @function runtime163.resource — Inputs: failed request. Retains failure URL for exact portable closure checking. */function(r){if(r.failure()?.errorText!=='net::ERR_ABORTED')failed.push(r.url());});
 await page.goto(require('node:url').pathToFileURL(path.resolve(process.env.FRONTIER_RUNTIME_CHECK||'../work/runtime-163-check/index.html')).href);
 await page.waitForSelector('body.engineRuntime');for(const selector of ['#editor','#workspaceAssets','#sceneTransformHandles','#exportGame'])assert.equal(await page.locator(selector).count(),0);
 await page.keyboard.press('F2');assert.equal(await page.locator('body.engineAuthoring').count(),0);
 await page.keyboard.press('Escape');await page.locator('#pauseOptions').click();await page.locator('#pauseBack').click();await page.locator('#pauseResume').click();
 await page.keyboard.press('i');await page.waitForSelector('#inventoryPanel',{state:'visible'});await page.locator('#inventoryClose').click();await page.waitForTimeout(300);
 assert.equal(await page.evaluate(/* @function runtime163.sunModule — Inputs: none. Returns whether the portable package loaded the real receiver-conforming shadow service and enabled default appearance; no state mutation. */function(){return !!window.FrontierSunShadows && document.getElementById('view').style.filter.includes('contrast');}),true);
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);console.log('PASS standalone runtime startup, appearance/shadow module closure, no authoring DOM, F2 guard, pause/options and inventory');
 }finally{await browser.close();}
})();
