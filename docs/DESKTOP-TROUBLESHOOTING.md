# Windows desktop candidate

Extract the complete package, then open **Sprite Frontier.exe**. Keep its neighboring runtime files and **resources** folder together. The launcher command file is optional. The application loads local assets directly; no server or browser is needed.

## Controls and window

F11 or the Fullscreen button toggles fullscreen. The Display menu selects 4:3 or widescreen. P locks camera look and enables the live HUD cursor; P again resumes the existing view. I opens inventory. F2 opens the in-level editor. Escape releases mouse capture. Reopening the same game focuses its existing window.

## If launch fails

Record the exact dialog, whether the window appeared, and the package version. Do not infer an out-of-memory fault from an access-violation message. On this computer, the original Electron failures reproduced through the restricted command-launch environment, while normal Windows launches worked. The desktop runtime remains hardware accelerated; no graphics-disable workaround is shipped.

Advanced diagnostics are opt-in: create **diagnostics.json** beside the executable containing `{"enabled":true,"port":9241}` before launching. Use a free local port. This enables a localhost debugging listener and a separate local test profile. Logs rotate at 256 KB and process samples retain the last thirty minutes. Remove the configuration for ordinary play. Do not distribute the configuration or test profile with a released game.

## Assets, music and project backups

Add exploration tracks to **resources/app/audio/bgm/exploration** and combat tracks to **resources/app/audio/bgm/combat**. Enter filenames with extensions in the editor's soundtrack settings. Empty playlists remain silent. No soundtrack was supplied with this candidate. Map exploration tracks override global exploration; switching modes chooses a fresh track from the beginning.

Export authored world JSON and muzzle-profile JSON for durable backups. Browser/local profile storage is convenience storage, not a substitute for project exports. Playtest exports are currently partial snapshots; see README for their limits.

## Verification limits

The reproduced procedural-audio growth was corrected with bounded processing-graph reuse. Finite tests do not establish indefinite leak freedom; report any repeatable growth with the workload and version. Physical controller, CRT output/overscan and physical input-to-display latency require hardware testing. The WebView2 comparison was a test host, not a packaged Tauri version.
