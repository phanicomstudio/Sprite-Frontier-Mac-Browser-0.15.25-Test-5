// Deliberately narrow sandbox bridge: no filenames/paths supplied by renderer.
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('FrontierDesktop',{musicCatalog:()=>ipcRenderer.invoke('frontier:music-catalog')});
