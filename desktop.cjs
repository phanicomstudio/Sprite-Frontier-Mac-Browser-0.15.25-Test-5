/* Desktop lifecycle. The engine stays in its sandboxed renderer; this process
 * owns the window, fullscreen key, launch diagnostics and clean shutdown.
 * diagnostics.json beside the executable is an explicit, local-only test opt-in;
 * ordinary distributions contain no diagnostic file or debugging listener. */
'use strict';
const {app,BrowserWindow,ipcMain}=require('electron');
const fs=require('node:fs'),path=require('node:path');
// Each complete iteration has an independent profile; older authored maps
// remain untouched and may be explicitly imported through the project UI.
app.setPath('userData',path.join(app.getPath('appData'),'Sprite-Frontier-0.15.17'));
const root=path.dirname(process.execPath);
let diagnostics=null,win=null,metricsTimer=null;
try{const candidate=JSON.parse(fs.readFileSync(path.join(root,'diagnostics.json'),'utf8'));if(candidate.enabled===true&&Number.isInteger(candidate.port)&&candidate.port>=1024&&candidate.port<=65535)diagnostics=candidate;}catch{}
if(diagnostics){
  const profile=path.join(root,'.diagnostic-profile');fs.mkdirSync(profile,{recursive:true});app.setPath('userData',profile);
  app.commandLine.appendSwitch('remote-debugging-address','127.0.0.1');
  app.commandLine.appendSwitch('remote-debugging-port',String(diagnostics.port));
}
const started=Date.now(),samples=[];
// Fixed project folders only; renderer cannot request arbitrary filesystem paths.
// Scan on project opening/explicit refresh, never in the render loop.
ipcMain.handle('frontier:music-catalog',/* @function desktop.callback.1 — Returns object from entries using a list of "exploration", "combat" map using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: object from entries; a list of "exploration", "combat" map. Returns: object from entries using a list of "exploration", "combat" map using a callback. */ ()=>Object.fromEntries(['exploration','combat'].map(/* @function desktop.callback.2 — Provides the callback for a list of "exploration", "combat" map. Inputs: category. Updates: names. Uses: path join; fs readdir sync using folder, a record containing withFileTypes filter using a callback map using a callback sort using slice; fs readdir sync using folder, a record containing withFileTypes filter using a callback map using a callback sort; fs readdir sync using folder, a record containing withFileTypes filter using a callback map. Returns: a list of category, names. */ category=>{
  const folder=path.join(__dirname,'audio','bgm',category);
  let names=[];try{names=fs.readdirSync(folder,{withFileTypes:true}).filter(/* @function desktop.callback.3 — Returns e is file using and /\.(ogg|mp3|wav|m4a|webm)$/i test using e name and the inverse of e name includes using "..". Inputs: e. Uses: e is file; /\.(ogg|mp3|wav|m4a|webm)$/i test; e name includes. Returns: e is file using and /\.(ogg|mp3|wav|m4a|webm)$/i test using e name and the inverse of e name includes using "..". */ e=>e.isFile()&&/\.(ogg|mp3|wav|m4a|webm)$/i.test(e.name)&&!e.name.includes('..')).map(/* @function desktop.callback.4 — Returns e name. Inputs: e. Returns: e name. */ e=>e.name).sort().slice(0,500);}catch{}
  return [category,names];
})));
/* @function desktop.record.5 — Handles record within desktop. Inputs: event; assignment pattern. Uses: path join; fs exists sync; fs stat sync; fs rename sync. Returns: without a result. */ function record(event,details={}){
  if(!diagnostics)return;
  const file=path.join(root,'desktop-diagnostics.jsonl');
  try{if(fs.existsSync(file)&&fs.statSync(file).size>256*1024)fs.renameSync(file,file+'.previous');fs.appendFileSync(file,JSON.stringify({at:Date.now(),sinceLaunchMs:Date.now()-started,event,...details})+'\n');}catch{}
}
// Reopening the same application focuses its window instead of duplicating a
// render loop. Separately authored game packages can use distinct app names.
if(!app.requestSingleInstanceLock()){app.quit();}
else{
  app.on('second-instance',/* @function desktop.callback.6 — Provides the callback for app on. Inputs: no explicit arguments; uses enclosing module state. Uses: win is minimized; win restore; win show; win focus. */ ()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus();}});
  app.on('child-process-gone',/* @function desktop.callback.7 — Returns record using "child-process-gone", details. Inputs: ; details. Uses: record. Returns: record using "child-process-gone", details. */ (_,details)=>record('child-process-gone',details));
  app.whenReady().then(/* @function desktop.callback.8 — Provides the callback for app when ready using then. Inputs: no explicit arguments; uses enclosing module state. Updates: win; metrics timer. Uses: record; path join; win set menu; win once. */ async()=>{
    record('ready',{versions:process.versions});
    win=new BrowserWindow({width:1280,height:960,minWidth:800,minHeight:600,title:'Phanicom · Sprite Frontier',show:false,autoHideMenuBar:true,backgroundColor:'#000000',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,preload:path.join(__dirname,'desktop-preload.cjs')}});
    win.setMenu(null);
    win.once('ready-to-show',/* @function desktop.callback.9 — Provides the callback for win once. Inputs: no explicit arguments; uses enclosing module state. Uses: win show; record. */ ()=>{win.show();record('visible');});
    win.webContents.setWindowOpenHandler(/* @function desktop.callback.10 — Returns a record containing action. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing action. */ ()=>({action:'deny'}));
    const entry=path.join(__dirname,'index.html');
    win.webContents.on('will-navigate',/* @function desktop.callback.11 — Provides the callback for win web contents on. Inputs: event; url. Uses: require using "node:url" path to file url; require; event prevent default. */ (event,url)=>{if(url!==require('node:url').pathToFileURL(entry).href)event.preventDefault();});
    win.webContents.on('render-process-gone',/* @function desktop.callback.12 — Returns record using "renderer-gone", details. Inputs: ; details. Uses: record. Returns: record using "renderer-gone", details. */ (_,details)=>record('renderer-gone',details));
    win.webContents.on('before-input-event',/* @function desktop.callback.13 — Provides the callback for win web contents on. Inputs: event; input. Uses: win set full screen; win is full screen; event prevent default. */ (event,input)=>{if(input.type==='keyDown'&&input.key==='F11'){win.setFullScreen(!win.isFullScreen());event.preventDefault();}});
    win.on('closed',/* @function desktop.callback.14 — Provides the callback for win on. Inputs: no explicit arguments; uses enclosing module state. Updates: win. */ ()=>{win=null;});
    await win.loadFile(entry);record('loaded');
    if(diagnostics){
      // Keep only the last thirty minutes: diagnostic monitoring is bounded.
      metricsTimer=setInterval(/* @function desktop.callback.15 — Provides the callback for set interval. Inputs: no explicit arguments; uses enclosing module state. Uses: samples push; date now; app get app metrics; samples shift. */ ()=>{samples.push({at:Date.now(),processes:app.getAppMetrics()});if(samples.length>360)samples.shift();try{fs.writeFileSync(path.join(root,'desktop-metrics.json'),JSON.stringify(samples));}catch{}},5000);
    }
  }).catch(/* @function desktop.callback.16 — Provides the callback for app when ready using then using a callback catch. Inputs: error. Uses: record; app quit. */ error=>{record('startup-error',{message:error.stack});app.quit();});
  app.on('window-all-closed',/* @function desktop.callback.17 — Returns app quit using . Inputs: no explicit arguments; uses enclosing module state. Uses: app quit. Returns: app quit using . */ ()=>app.quit());
  app.on('before-quit',/* @function desktop.callback.18 — Provides the callback for app on. Inputs: no explicit arguments; uses enclosing module state. Uses: clear interval; record. */ ()=>{if(metricsTimer)clearInterval(metricsTimer);record('quit');});
}

