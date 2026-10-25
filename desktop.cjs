/* Desktop lifecycle. The engine stays in its sandboxed renderer; this process
 * owns the window, fullscreen key, launch diagnostics and clean shutdown.
 * diagnostics.json beside the executable is an explicit, local-only test opt-in;
 * ordinary distributions contain no diagnostic file or debugging listener. */
"use strict";
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("node:fs"),
  path = require("node:path");
// Each complete iteration has an independent profile; older authored maps
// remain untouched and may be explicitly imported through the project UI.
// October 12, 2026: the new iteration uses its own profile; prior 0.15.21/0.15.22 profiles remain available for explicit project import.
// October 22, 2026: retain the established profile location so upgrading to
// 0.15.26 preserves local authored projects; do not migrate/delete user data.
// October 22, 2026 — 0.16.0 supersedes shared-profile use above: native-size
// normals and generated edit ledgers can exceed older validators. Isolate the
// new profile so previous releases retain their original data. Import an
// exported project JSON explicitly; no legacy profile is copied or deleted.
app.setPath(
  "userData",
  path.join(app.getPath("appData"), "Sprite-Frontier-0.16.0"),
);
const root = path.dirname(process.execPath);
let diagnostics = null,
  win = null,
  metricsTimer = null;
try {
  const candidate = JSON.parse(
    fs.readFileSync(path.join(root, "diagnostics.json"), "utf8"),
  );
  if (
    candidate.enabled === true &&
    Number.isInteger(candidate.port) &&
    candidate.port >= 1024 &&
    candidate.port <= 65535
  )
    diagnostics = candidate;
} catch {}
if (diagnostics) {
  const profile = path.join(root, ".diagnostic-profile");
  fs.mkdirSync(profile, { recursive: true });
  app.setPath("userData", profile);
  app.commandLine.appendSwitch("remote-debugging-address", "127.0.0.1");
  app.commandLine.appendSwitch(
    "remote-debugging-port",
    String(diagnostics.port),
  );
  // October 12: non-audio acceptance windows opt into silence before renderer
  // startup, preventing overlapping background music. Release/audio tests do
  // not set this diagnostic preference and retain ordinary sound behavior.
  if (diagnostics.muteAudio === true)
    app.commandLine.appendSwitch("mute-audio");
}
const started = Date.now(),
  samples = [];

/* @function desktop.exportSender — Inputs: IPC event. Returns whether the installed engine window owns the request. No arbitrary renderer or navigation can request source reads/export dialogs. */
function exportSender(event) {
  return (
    !!win &&
    event.sender === win.webContents &&
    event.sender.getURL() ===
      require("node:url").pathToFileURL(path.join(__dirname, "index.html")).href
  );
}
ipcMain.handle(
  "frontier:engine-document",
  /* @function desktop.engineDocument — Inputs: IPC event. Returns installed HTML after sender validation; throws for foreign windows or runtime-only packages. Reads one fixed file, never a renderer-supplied path. */ function (
    event,
  ) {
    if (
      !exportSender(event) ||
      !fs.existsSync(path.join(__dirname, "tools", "runtime-package.cjs"))
    )
      throw Error("Game export is available in the editor only.");
    return fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  },
);
ipcMain.handle(
  "frontier:export-game",
  /* @function desktop.exportGame — Inputs: originating IPC event and generated runtime descriptor. Returns promise for cancelled/success/error status. Validates fixed source inventories, opens a native parent-directory chooser, and creates a fresh dated child folder with exclusive writes. Never deletes/replaces releases or accepts destination paths from the renderer. Copies are conservative until asset pruning acceptance; failures retain an explicitly incomplete folder for inspection. */ async function (
    event,
    entry,
  ) {
    if (!exportSender(event))
      return {
        ok: false,
        error: "Export request did not come from the editor.",
      };
    let destination = null;
    try {
      const builder = require("./tools/runtime-package.cjs"),
        boundary = require("./tools/desktop-export.cjs");
      boundary.validate(
        fs.readFileSync(path.join(__dirname, "index.html"), "utf8"),
        entry,
      );
      const choice = await dialog.showOpenDialog(win, {
        title: "Choose where to create the game folder",
        buttonLabel: "Create game folder here",
        properties: ["openDirectory", "createDirectory"],
      });
      if (choice.canceled || choice.filePaths.length !== 1)
        return { cancelled: true };
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      destination = path.join(
        choice.filePaths[0],
        "Sprite-Frontier-Game-" + stamp,
      );
      const manifest = builder.build(__dirname, entry, destination);
      return { ok: true, directory: destination, files: manifest.files.length };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
        incompleteDirectory:
          destination && fs.existsSync(destination) ? destination : null,
      };
    }
  },
);

// Fixed project folders only; renderer cannot request arbitrary filesystem paths.
// Scan on project opening/explicit refresh, never in the render loop.
ipcMain.handle(
  "frontier:music-catalog" /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.1 — Returns object from entries using a list of "exploration", "combat" map using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: object from entries; a list of "exploration", "combat" map. Returns: object from entries using a list of "exploration", "combat" map using a callback. */,
  /* @function desktop.reviewed1 — Lists music available in this installed project. Inputs: IPC arguments unused. Returns exploration/combat filename arrays, capped to 500 per category. Reads only fixed audio/bgm folders; absent/unreadable folders produce empty lists. No renderer-controlled path or per-frame scan. */ () =>
    Object.fromEntries(
      ["exploration", "combat"].map(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.2 — Provides the callback for a list of "exploration", "combat" map. Inputs: category. Updates: names. Uses: path join; fs readdir sync using folder, a record containing withFileTypes filter using a callback map using a callback sort using slice; fs readdir sync using folder, a record containing withFileTypes filter using a callback map using a callback sort; fs readdir sync using folder, a record containing withFileTypes filter using a callback map. Returns: a list of category, names. */
        /* @function desktop.reviewed2 — Scans one known music category. Inputs: exploration or combat category from the fixed list. Returns category/name-list tuple sorted alphabetically and capped to 500. Filesystem errors produce an empty category, not a failed game startup; no mutation of audio files. */ (
          category,
        ) => {
          const folder = path.join(__dirname, "audio", "bgm", category);
          let names = [];
          try {
            names = fs
              .readdirSync(folder, { withFileTypes: true })
              .filter(
                /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.3 — Returns e is file using and /\.(ogg|mp3|wav|m4a|webm)$/i test using e name and the inverse of e name includes using "..". Inputs: e. Uses: e is file; /\.(ogg|mp3|wav|m4a|webm)$/i test; e name includes. Returns: e is file using and /\.(ogg|mp3|wav|m4a|webm)$/i test using e name and the inverse of e name includes using "..". */
                /* @function desktop.reviewed3 — Filters catalog directory entries. Inputs: filesystem entry e. Returns true only for regular OGG/MP3/WAV/M4A/WebM files with no double-dot substring; rejects directories and unsafe names. No filesystem changes. */ (
                  e,
                ) =>
                  e.isFile() &&
                  /\.(ogg|mp3|wav|m4a|webm)$/i.test(e.name) &&
                  !e.name.includes(".."),
              )
              .map(
                /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.4 — Returns e name. Inputs: e. Returns: e name. */
                /* @function desktop.reviewed4 — Extracts a validated music filename. Inputs: accepted regular-file directory entry. Returns its basename only; no path expansion or mutation. */ (
                  e,
                ) => e.name,
              )
              .sort()
              .slice(0, 500);
          } catch {}
          return [category, names];
        },
      ),
    ),
);
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.record.5 — Handles record within desktop. Inputs: event; assignment pattern. Uses: path join; fs exists sync; fs stat sync; fs rename sync. Returns: without a result. */
/* @function desktop.reviewed5 — Records optional native diagnostics. Inputs: event name and JSON-serializable details. Returns nothing; writes elapsed/wall time only when diagnostics are explicitly enabled. Rotates above 256 KiB; write/rotation failures are intentionally nonfatal. Ordinary releases create no diagnostic logs. */ function record(
  event,
  details = {},
) {
  if (!diagnostics) return;
  const file = path.join(root, "desktop-diagnostics.jsonl");
  try {
    if (fs.existsSync(file) && fs.statSync(file).size > 256 * 1024)
      fs.renameSync(file, file + ".previous");
    fs.appendFileSync(
      file,
      JSON.stringify({
        at: Date.now(),
        sinceLaunchMs: Date.now() - started,
        event,
        ...details,
      }) + "\n",
    );
  } catch {}
}
// Reopening the same application focuses its window instead of duplicating a
// render loop. Separately authored game packages can use distinct app names.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on(
    "second-instance" /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.6 — Provides the callback for app on. Inputs: no explicit arguments; uses enclosing module state. Uses: win is minimized; win restore; win show; win focus. */,
    /* @function desktop.reviewed6 — Handles a second launch of the same installed application. Inputs: Electron event arguments unused. Returns nothing; restores a minimized existing window, shows it and gives it focus. Does not start a second render loop; absent window is harmless. */ () => {
      if (win) {
        if (win.isMinimized()) win.restore();
        win.show();
        win.focus();
      }
    },
  );
  app.on(
    "child-process-gone" /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.7 — Returns record using "child-process-gone", details. Inputs: ; details. Uses: record. Returns: record using "child-process-gone", details. */,
    /* @function desktop.reviewed7 — Reports a terminated Electron child process. Inputs: unused event and Electron details. Returns record result (undefined); writes only opted-in diagnostics and does not attempt to restart or hide the process failure. */ (
      _,
      details,
    ) => record("child-process-gone", details),
  );
  app
    .whenReady()
    .then(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.8 — Provides the callback for app when ready using then. Inputs: no explicit arguments; uses enclosing module state. Updates: win; metrics timer. Uses: record; path join; win set menu; win once. */
      /* @function desktop.reviewed8 — Creates and loads the sole game/editor window once Electron is ready. Inputs: none. Returns a promise resolving after fixed entry loading and optional bounded metrics setup. Installs sandboxed preload/navigation/fullscreen handlers and a hidden 1280x960 window (minimum 800x600). Errors propagate to startup failure handling; no arbitrary renderer Node access. */ async () => {
        record("ready", { versions: process.versions });
        win = new BrowserWindow({
          width: 1280,
          height: 960,
          minWidth: 800,
          minHeight: 600,
          title: "Phanicom · Sprite Frontier",
          show: false,
          autoHideMenuBar: true,
          backgroundColor: "#000000",
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            preload: path.join(__dirname, "desktop-preload.cjs"),
          },
        });
        win.setMenu(null);
        win.once(
          "ready-to-show" /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.9 — Provides the callback for win once. Inputs: no explicit arguments; uses enclosing module state. Uses: win show; record. */,
          /* @function desktop.reviewed9 — Shows the completed first native frame. Inputs: ready-to-show event arguments unused. Returns nothing; makes the existing window visible and optionally records visibility. Does not create or navigate another window. */ () => {
            win.show();
            record("visible");
          },
        );
        win.webContents.setWindowOpenHandler(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.10 — Returns a record containing action. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing action. */
          /* @function desktop.reviewed10 — Rejects requests to open additional native windows. Inputs: requested window details unused. Returns Electron denial record unconditionally; gameplay/editor stay in one owned window. No filesystem or navigation side effects. */ () => ({
            action: "deny",
          }),
        );
        const entry = path.join(__dirname, "index.html");
        win.webContents.on(
          "will-navigate" /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.11 — Provides the callback for win web contents on. Inputs: event; url. Uses: require using "node:url" path to file url; require; event prevent default. */,
          /* @function desktop.reviewed11 — Restricts native navigation to the installed entry. Inputs: Electron navigation event and destination URL. Returns nothing; prevents any URL differing from this package index.html. The fixed allowed file is unchanged; renderer cannot redirect this privileged preload to a foreign page. */ (
            event,
            url,
          ) => {
            if (url !== require("node:url").pathToFileURL(entry).href)
              event.preventDefault();
          },
        );
        win.webContents.on(
          "render-process-gone" /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.12 — Returns record using "renderer-gone", details. Inputs: ; details. Uses: record. Returns: record using "renderer-gone", details. */,
          /* @function desktop.reviewed12 — Reports renderer termination. Inputs: unused Electron event and process details. Returns diagnostic record result; does not claim automatic recovery. Normal releases remain silent and diagnostics stay opt-in. */ (
            _,
            details,
          ) => record("renderer-gone", details),
        );
        win.webContents.on(
          "before-input-event" /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.13 — Provides the callback for win web contents on. Inputs: event; input. Uses: win set full screen; win is full screen; event prevent default. */,
          /* @function desktop.reviewed13 — Handles desktop fullscreen shortcut. Inputs: Electron event and keyboard input record. Returns nothing; F11 keyDown toggles the existing native window fullscreen and prevents duplicate renderer handling. All other keys, including Escape for the pause UI, retain their usual routing. */ (
            event,
            input,
          ) => {
            if (input.type === "keyDown" && input.key === "F11") {
              win.setFullScreen(!win.isFullScreen());
              event.preventDefault();
            }
          },
        );
        win.on(
          "closed" /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.14 — Provides the callback for win on. Inputs: no explicit arguments; uses enclosing module state. Updates: win. */,
          /* @function desktop.reviewed14 — Clears ownership after native window destruction. Inputs: closed event arguments unused. Returns nothing; sets the shared window reference to null so later handlers cannot focus a destroyed window. */ () => {
            win = null;
          },
        );
        await win.loadFile(entry);
        record("loaded");
        if (diagnostics) {
          // Keep only the last thirty minutes: diagnostic monitoring is bounded.
          metricsTimer = setInterval(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.15 — Provides the callback for set interval. Inputs: no explicit arguments; uses enclosing module state. Uses: samples push; date now; app get app metrics; samples shift. */
            /* @function desktop.reviewed15 — Collects bounded native process metrics. Inputs: timer arguments unused. Returns nothing; records a sample every 5000 ms and keeps at most 360 (30 minutes). Writes diagnostic JSON beside this isolated executable; file errors do not interrupt gameplay. Runs only when diagnostics enabled. */ () => {
              samples.push({ at: Date.now(), processes: app.getAppMetrics() });
              if (samples.length > 360) samples.shift();
              try {
                fs.writeFileSync(
                  path.join(root, "desktop-metrics.json"),
                  JSON.stringify(samples),
                );
              } catch {}
            },
            5000,
          );
        }
      },
    )
    .catch(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.16 — Provides the callback for app when ready using then using a callback catch. Inputs: error. Uses: record; app quit. */
      /* @function desktop.reviewed16 — Handles failed desktop startup. Inputs: rejected load/initialization Error. Returns nothing; records its stack if diagnostics enabled and quits the incomplete app. Does not report successful loading or leave another render window running. */ (
        error,
      ) => {
        record("startup-error", { message: error.stack });
        app.quit();
      },
    );
  app.on(
    "window-all-closed" /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.17 — Returns app quit using . Inputs: no explicit arguments; uses enclosing module state. Uses: app quit. Returns: app quit using . */,
    /* @function desktop.reviewed17 — Quits when the last native window closes. Inputs: event arguments unused. Returns nothing; all platforms use this single-window lifecycle rather than keeping background music/gameplay alive. */ () =>
      app.quit(),
  );
  app.on(
    "before-quit" /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function desktop.callback.18 — Provides the callback for app on. Inputs: no explicit arguments; uses enclosing module state. Uses: clear interval; record. */,
    /* @function desktop.reviewed18 — Stops diagnostic sampling during shutdown. Inputs: before-quit event arguments unused. Returns nothing; clears an existing metrics interval and optionally records quit, without changing project data or older releases. */ () => {
      if (metricsTimer) clearInterval(metricsTimer);
      record("quit");
    },
  );
}
