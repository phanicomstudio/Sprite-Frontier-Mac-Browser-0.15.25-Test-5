/* October 12, 2026: authoring acceptance against a desktop-launched diagnostic
 * Electron window. This adapter reuses existing fixtures and their assertions;
 * it never launches a browser or loads a user's production profile. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const fixture=process.argv[2],endpoint=process.env.FRONTIER_NATIVE_CDP||'http://127.0.0.1:9544';
// October 14: new focused item/project acceptance reuses the actual native window.
if(!['item-flow1525','project-flow1525','workspace1524','props1524','layout1524','sprite-contact1524','sprite-door1524','sky1524','guards1522','castle-workflow1524','cell-controls1524','effect-controls1524','door-controls1524','stock-controls1524','map-management1524','template-workflow1524','kill-feed-controls1524','item-controls1524','weapon-controls1524','catalog-combat1524','model-material-controls1524'].includes(fixture))throw Error('Choose an editor acceptance fixture.');
const address=new URL(endpoint);
if(address.protocol!=='http:'||address.hostname!=='127.0.0.1'||!address.port)throw Error('Use an explicit loopback diagnostic endpoint.');
const filename=path.resolve(__dirname,'../browser',fixture+'.cjs');let code=fs.readFileSync(filename,'utf8');
code=code.replace('await chromium.launch(launch)','await chromium.connectOverCDP('+JSON.stringify(endpoint)+')');
code=code.replace('await browser.newPage({viewport:{width:1600,height:1100}})','browser.contexts()[0].pages()[0]');
code=code.replace('await browser.newPage()','browser.contexts()[0].pages()[0]');
code=code.replace(/await page\.goto\([\s\S]+?\);/,'await page.reload();');
code=code.replaceAll('test-artifacts/workspace1524.png','test-artifacts/native-workspace1524.png').replaceAll('test-artifacts/props1524.png','test-artifacts/native-props1524.png').replaceAll('test-artifacts/sky1524.png','test-artifacts/native-sky1524.png');
// Contact evidence stays separate from browser screenshots and is observational.
if(fixture==='sprite-contact1524')code=code.replaceAll('sprite-contact1524-','native-sprite-contact1524-').replaceAll('sprite-contact1524.json','native-sprite-contact1524.json');
if(code.includes('await chromium.launch(')||code.includes('await browser.newPage(')||code.includes('await page.goto('))throw Error('Fixture changed; review native adapter before running.');
code=code.replaceAll('await browser.close();',"await require('../native/input-cleanup1524.cjs').release(browser);await browser.close();");
if(fixture==='sprite-door1524')code=code.replaceAll('sprite-door1524-','native-sprite-door1524-').replaceAll('sprite-door1524.json','native-sprite-door1524.json');
// October 13, 2026: native Escape must pause while retaining fullscreen; browser fallback simulation is forbidden in this acceptance.
if(fixture==='guards1522'){code=code.replace(/if\(await page\.locator\('#pauseControls'\)\.isHidden\(\)\)\{[\s\S]*?\}/,"assert(await page.evaluate(/* @function nativeGuards.fullscreen — Inputs: none. Returns actual document fullscreen state without mutation; native Escape may not use simulated exit fallback. */function(){return !!document.fullscreenElement;}),'Native Escape retains fullscreen');");code=code.replaceAll('PASS fullscreen pause fallback,','PASS native fullscreen pause retains fullscreen,');code=code.replaceAll('test-artifacts/pause-art1519.png','test-artifacts/native-pause-art1524.png');}
if(fixture==='template-workflow1524')code=code.replaceAll('test-artifacts/template-workflow1524.json','test-artifacts/native-template-workflow1524.json');
const test=new Module(filename,module);test.filename=filename;test.paths=Module._nodeModulePaths(path.dirname(filename));test._compile(code,filename);
