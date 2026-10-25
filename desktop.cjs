/* Desktop lifecycle. The engine stays in its sandboxed renderer; this process
 * owns the window, fullscreen key, launch diagnostics and clean shutdown.
 * diagnostics.json beside the executable is an explicit, local-only test opt-in;
 * ordinary distributions contain no diagnostic file or debugging listener. */
'use strict';
const {app,BrowserWindow,ipcMain}=require('electron');
const fs=require('node:fs'),path=require('node:path');
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
ipcMain.handle('frontier:music-catalog',()=>Object.fromEntries(['exploration','combat'].map(category=>{
  const folder=path.join(__dirname,'audio','bgm',category);
  let names=[];try{names=fs.readdirSync(folder,{withFileTypes:true}).filter(e=>e.isFile()&&/\.(ogg|mp3|wav|m4a|webm)$/i.test(e.name)&&!e.name.includes('..')).map(e=>e.name).sort().slice(0,500);}catch{}
  return [category,names];
})));
function record(event,details={}){
  if(!diagnostics)return;
  const file=path.join(root,'desktop-diagnostics.jsonl');
  try{if(fs.existsSync(file)&&fs.statSync(file).size>256*1024)fs.renameSync(file,file+'.previous');fs.appendFileSync(file,JSON.stringify({at:Date.now(),sinceLaunchMs:Date.now()-started,event,...details})+'\n');}catch{}
}
// Reopening the same application focuses its window instead of duplicating a
// render loop. Separately authored game packages can use distinct app names.
if(!app.requestSingleInstanceLock()){app.quit();}
else{
  app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.show();win.focus();}});
  app.on('child-process-gone',(_,details)=>record('child-process-gone',details));
  app.whenReady().then(async()=>{
    record('ready',{versions:process.versions});
    win=new BrowserWindow({width:1280,height:960,minWidth:800,minHeight:600,title:'Phanicom · Sprite Frontier',show:false,autoHideMenuBar:true,backgroundColor:'#000000',webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,preload:path.join(__dirname,'desktop-preload.cjs')}});
    win.setMenu(null);
    win.once('ready-to-show',()=>{win.show();record('visible');});
    win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
    const entry=path.join(__dirname,'index.html');
    win.webContents.on('will-navigate',(event,url)=>{if(url!==require('node:url').pathToFileURL(entry).href)event.preventDefault();});
    win.webContents.on('render-process-gone',(_,details)=>record('renderer-gone',details));
    win.webContents.on('before-input-event',(event,input)=>{if(input.type==='keyDown'&&input.key==='F11'){win.setFullScreen(!win.isFullScreen());event.preventDefault();}});
    win.on('closed',()=>{win=null;});
    await win.loadFile(entry);record('loaded');
    if(diagnostics){
      // Keep only the last thirty minutes: diagnostic monitoring is bounded.
      metricsTimer=setInterval(()=>{samples.push({at:Date.now(),processes:app.getAppMetrics()});if(samples.length>360)samples.shift();try{fs.writeFileSync(path.join(root,'desktop-metrics.json'),JSON.stringify(samples));}catch{}},5000);
    }
  }).catch(error=>{record('startup-error',{message:error.stack});app.quit();});
  app.on('window-all-closed',()=>app.quit());
  app.on('before-quit',()=>{if(metricsTimer)clearInterval(metricsTimer);record('quit');});
}
