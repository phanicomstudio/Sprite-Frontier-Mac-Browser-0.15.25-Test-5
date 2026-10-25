// Deliberately narrow sandbox bridge: no filenames/paths supplied by renderer.
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("FrontierDesktop", {
  musicCatalog:
    /* @function desktop-preload.musicCatalog.1 — Returns ipc renderer invoke using "frontier:music-catalog". Inputs: no explicit arguments; uses enclosing module state. Uses: ipc renderer invoke. Returns: ipc renderer invoke using "frontier:music-catalog". */ /* @function desktopPreload.musicCatalogReviewed � Inputs: none. Returns a promise for fixed project exploration/combat music filenames. IPC performs bounded reads in the main process; errors reject. No path parameter, arbitrary filesystem access or renderer Node integration. */ () =>
      ipcRenderer.invoke("frontier:music-catalog"),
  engineDocument:
    /* @function desktopPreload.engineDocument — Inputs: none. Returns promise for the installed engine HTML only. The main process checks the requesting window; no filename or arbitrary file access is exposed. */ function () {
      return ipcRenderer.invoke("frontier:engine-document");
    },
  exportGame:
    /* @function desktopPreload.exportGame — Inputs: generated runtime descriptor, never a destination path. Returns main-process export result. A native directory chooser owns destination authorization; errors are reported as data. */ function (
      entry,
    ) {
      return ipcRenderer.invoke("frontier:export-game", entry);
    },
});
