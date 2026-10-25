/* October 13: exact native-UI output inside an isolated desktop wrapper.
 * Reuses browser gameplay assertions without a hidden browser launch. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
// October 14: permit the new explicitly owned material-export fixture and retain
// its evidence separately from prior native-UI observations. Wait for native
// initial loading before test reload: interrupting loadFile is a harness race,
// and must not be mistaken for an exported-game startup failure.
const finalMaterial=process.env.FRONTIER_NATIVE_FINAL_MATERIAL==='1';
const filename=path.resolve(__dirname,'../browser/exported-game1524.cjs');let code=fs.readFileSync(filename,'utf8');
if(finalMaterial)code=code.replaceAll('native-export-ui-game1524-current','native-export-ui-game1524-final-material');
code=code.replace('await chromium.launch(launch)',"await chromium.connectOverCDP('http://127.0.0.1:"+(finalMaterial?'9549':'9546')+"')").replace('await browser.newPage()','browser.contexts()[0].pages()[0]');
code=code.replace("await page.goto(pathToFileURL(path.join(evidence.directory,'index.html')).href);","assert(page.url().includes('native-runtime-ui1524/resources/app/index.html')||page.url().includes('native-runtime-ui1524-current/resources/app/index.html')||page.url().includes('native-runtime-ui1524-final-material/resources/app/index.html'),'Only the isolated UI-export wrapper may be tested');await page.waitForLoadState('load');await page.reload();");
code=code.replaceAll('native-export-ui-game1524','native-desktop-export-ui-game1524');
if(code.includes('chromium.launch(')||code.includes('page.goto(')||code.includes('browser.newPage('))throw Error('Export fixture changed; review native adapter.');
code=code.replaceAll('await browser.close();',"await require('../native/input-cleanup1524.cjs').release(browser);await browser.close();");
const test=new Module(filename,module);test.filename=filename;test.paths=Module._nodeModulePaths(path.dirname(filename));test._compile(code,filename);
