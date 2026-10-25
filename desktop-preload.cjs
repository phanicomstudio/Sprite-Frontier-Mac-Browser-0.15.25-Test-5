// Deliberately narrow sandbox bridge: no filenames/paths supplied by renderer.
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('FrontierDesktop',{musicCatalog:/* @function desktop-preload.musicCatalog.1 — Returns ipc renderer invoke using "frontier:music-catalog". Inputs: no explicit arguments; uses enclosing module state. Uses: ipc renderer invoke. Returns: ipc renderer invoke using "frontier:music-catalog". */ ()=>ipcRenderer.invoke('frontier:music-catalog')});
