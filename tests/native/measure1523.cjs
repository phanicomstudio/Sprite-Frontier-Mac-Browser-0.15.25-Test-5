/* October 12, 2026: native Windows measurement adapter. Reuses the exact browser
 * fixtures against an already desktop-launched, isolated diagnostic copy. It
 * never starts a headless browser, changes production code, or opens user saves.
 * Start the copy with diagnostics.json enabled on a loopback-only port first. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module');
const permitted=new Set(['sustained-matrix1523','door-cycles1523','imported-stress1523','effects-matrix1523','gpu-profile1523']);
const fixture=process.argv[2],endpoint=process.env.FRONTIER_NATIVE_CDP||'http://127.0.0.1:9443';
if(!permitted.has(fixture))throw Error('Choose a documented native measurement fixture.');
const address=new URL(endpoint);
if(address.protocol!=='http:'||address.hostname!=='127.0.0.1'||!address.port)throw Error('Native diagnostics must use an explicit loopback-only HTTP port.');
const filename=path.resolve(__dirname,'../browser',fixture+'.cjs');
let code=fs.readFileSync(filename,'utf8');
// Fixture callbacks and assertions are retained. Only launch/window selection,
// navigation and output naming change; the existing packaged page is reloaded
// so test-only accessors can capture the actual engine namespaces at startup.
code=code.replace("await chromium.launch({...launch,args:[...(launch.args||[]),'--enable-precise-memory-info']})",'await chromium.connectOverCDP('+JSON.stringify(endpoint)+')');
// October 13, 2026: the new workspace hides the legacy map selector. This fixture uses its retained change handler; visible map controls have separate authoring acceptance.
if(fixture==='door-cycles1523')code=code.replace("p.selectOption('#activeMap','hub-test')","p.selectOption('#activeMap','hub-test',{force:true})");
code=code.replace('await chromium.launch(launch)','await chromium.connectOverCDP('+JSON.stringify(endpoint)+')');
code=code.replace('await browser.newPage({viewport:{width:1600,height:1100}})','browser.contexts()[0].pages()[0]');
code=code.replace('await browser.newPage()','browser.contexts()[0].pages()[0]');
code=code.replace("'file:///'+path.resolve('index.html').replaceAll('\\\\','/')",fixture==='door-cycles1523'?'p.url()':'page.url()');
for(const result of ['door-normal1524','moving-matrix1523','sustained-matrix1523','door-matrix1523','door-cycles1523','imported-stress1523','effects-matrix1523','gpu-profile1523'])code=code.replaceAll('test-artifacts/'+result+'.json','test-artifacts/native-'+result+'.json');
code=code.replace('Headless Chrome on Windows; CPU render submission timings, not GPU completion or native platform acceptance','Native Electron Windows desktop diagnostic copy; real render intervals and CPU submission, GPU completion separately measured by gpu-profile fixture');
if(code.includes('await chromium.launch(')||code.includes('await browser.newPage('))throw Error('Fixture launch changed: review native adapter before measuring.');
// Compile in the original fixture location so its relative environment helper
// and local asset paths retain the same contracts as browser measurements.
// October 13: retained hidden selector drives fixture setup only; real visible authoring controls are tested independently.
code=code.replace(/(\w+\.selectOption\('#activeMap',('[^']*'|"[^"]*"))\)/g,'$1,{force:true})');
if(fixture==='effects-matrix1523')code=code.replace("page.selectOption('#activeMap',scene==='forest'?forest:'hub-saloon')","page.selectOption('#activeMap',scene==='forest'?forest:'hub-saloon',{force:true})");
const measurement=new Module(filename,module);
measurement.filename=filename;measurement.paths=Module._nodeModulePaths(path.dirname(filename));
measurement._compile(code,filename);
