/* October 13: exercise the actual native export button and folder chooser.
 * Operator/computer-use selects the isolated test parent folder. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require(process.env.FRONTIER_PLAYWRIGHT||'playwright');
(/* @function nativeExportTest.run — Inputs: existing loopback diagnostic window. Returns promise. Opens the visible map-library export action and waits up to five minutes for the real native chooser. Verifies resulting folder/manifest and preserves it for independent runtime checks. No dialog bypass, arbitrary export paths, deletion or user-project changes. */async function(){
 const browser=await chromium.connectOverCDP('http://127.0.0.1:9544');
 try{
  const page=browser.contexts()[0].pages()[0];assert(/native-editor1524(?:-mapmanagement)?\/resources\/app\/index.html/.test(page.url()));
  if(!await page.locator('body.engineAuthoring').count())await page.locator('#workspaceToggle').click();
  await page.getByRole('button',{name:'Map',exact:true}).click();
  const group=page.locator('details.workspaceGroup').filter({has:page.locator('#exportGame')});if(await group.getAttribute('open')===null)await group.locator(':scope > summary').click();
  await page.locator('#exportGame').click();
  await page.waitForFunction(/* @function nativeExportTest.finished — Inputs: none. Returns whether the actual export handler reported success or failure. Reads status only, never dismisses native dialog. */function(){return /Game folder created:|Game export failed:/.test(document.getElementById('mapSaveStatus').textContent);},null,{timeout:300000});
  const status=await page.locator('#mapSaveStatus').textContent();assert(status.startsWith('Game folder created:'),status);
  const directory=status.slice('Game folder created: '.length).split(' (')[0],owned=path.resolve(__dirname,'../../../../work/native-export-ui1524');assert(path.resolve(directory).startsWith(owned+path.sep),'Test chooser must target the isolated export parent');
  const manifest=JSON.parse(fs.readFileSync(path.join(directory,'RUNTIME-MANIFEST.json'),'utf8'));assert(manifest.omitted.includes('src/editor.js'));assert(!fs.existsSync(path.join(directory,'src/editor.js')));assert(fs.readFileSync(path.join(directory,'index.html'),'utf8').includes('window.FRONTIER_RUNTIME_ONLY=true;'));
  fs.writeFileSync(path.resolve(__dirname,'../../test-artifacts/native-export-ui1524-current.json'),JSON.stringify({directory,status,files:manifest.files.length,scope:'Actual Windows export chooser; independent exported-game startup remains required'},null,2));console.log('PASS actual Windows Export Game folder:',directory);
 }finally{await browser.close();}
})().catch(/* @function nativeExportTest.failure — Inputs: rejected error. Returns nothing; prints failure and marks unsuccessful exit while preserving diagnostic export evidence. */function(error){console.error(error);process.exitCode=1;});
