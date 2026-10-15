# Standalone verification report — candidate 0.7.0

The Windows package uses Electron 44.5.1 with PixiJS 8.22.0/WebGL. It opens its own sandboxed window and loads offline assets without a browser or server. Electron has competitive measured frame processing and provides a bundled runtime. The observed procedural-audio allocation growth has been corrected and checked with a finite accelerated reproduction; this is not a guarantee of indefinite leak freedom.

## Measured comparison

Complete engine-frame CPU time in milliseconds, median / p99:

| Host | Exploration | Dense scenery | Combat and effects | Editor/HUD |
|---|---:|---:|---:|---:|
| Chrome | 2.2 / 4.2 | 3.6 / 6.9 | 3.1 / 5.9 | 3.5 / 6.0 |
| Electron 44 | 2.1 / 3.9 | 3.2 / 4.3 | 2.8 / 4.7 | 2.0 / 2.9 |
| NW.js | 2.3 / 3.5 | 3.4 / 5.3 | 2.9 / 4.6 | 2.2 / 3.6 |
| WebView2 test host | 1.9 / 3.4 | 3.8 / 6.1 | 3.2 / 5.2 | 2.8 / 4.0 |

Electron p95 CPU times were 3.3, 3.8, 4.0 and 2.6 ms respectively. Its short phase samples had rAF median intervals near 11.1 ms, p99 approximately 11.3–11.4 ms and no intervals above 25 ms. These timestamps measure frame scheduling, not physical display timing. Software-dispatched input reached an observed movement update in 9.2 ms median / 12.2 ms p95; this excludes physical input and display latency.

All hosts used the same 640×480 internal render buffer and workload script, Intel Arc through D3D11 and 22 reported logical processors. Content-window heights differed slightly; this is a short sequential comparison, not a fully controlled statistical experiment. WebView2 used a .NET host; Tauri itself was not built.

The final audio implementation was also measured at 854×480 widescreen. Exploration/dense/combat/editor CPU median / p95 / p99 were respectively 2.4/3.8/5.1, 3.9/5.5/6.2, 3.9/5.5/6.1 and 2.8/3.9/4.3 ms. rAF median was 11.1 ms. Combat had four intervals above 25 ms, two above 50 ms, maximum 133.3 ms, among 877 intervals; engine CPU maximum was 14.9 ms. The scheduling spikes are disclosed rather than attributed without evidence. Other phases had no intervals above 25 ms. An occluded-window run was rejected from these results.

Three warm reloads measured first rendered sprite with a 5 ms poll: median Chrome 303.5 ms, Electron 343.9 ms, NW.js 306.5 ms and WebView2 231.4 ms. These exclude OS/window creation and cold filesystem effects. Separate Electron logs observed a visible native window around 506–528 ms. WebView2 depends on the installed system runtime; Electron/NW.js bundle theirs. Smaller packages do not by themselves improve engine frame time.

## Optimizations and memory

Profiling identified repeated vector-stroke normalization. Batching consecutive compatible strokes and a bounded 128-color cache reduced the separate frozen dense-scene render median from 8.8 to 4.4 ms. Tested normal/dense frames and camera angles retained identical RGBA output. No effects, resolution, sound recipes or hardware acceleration were removed.

The user stopped the sustained test after 511 seconds. The workload contained 491 entities, 20 enemies and repeated firing/blood effects. Most shots collided quickly; this does not prove a large simultaneous projectile count. No JavaScript errors or WebGL-context loss were recorded. Retained JS heap was approximately 9.4 MB at both 60 and 301 seconds, but renderer private memory increased from approximately 203 to 562 MB. Reloading returned it to approximately 75 MB. The flat JS heap does not prove absence of native leaks.

Differential checks narrowed the growth to procedural firing audio. Completed sound graphs disconnect after both sources end and a 600 ms tail. A bounded per-AudioContext cache retains at most 32 idle processing graphs, reusing gains, filter and waveshaper. Oscillators and the stateful compressor remain fresh per voice. No voices or effects are dropped. Offline PCM comparisons covered eight cases including a reused voice; maximum reused-voice difference was below 0.00001, with original recipes and timing retained.

A finite accelerated test generated 2,560 standard voices over roughly 40 seconds, equivalent in voice count to 512 seconds at five shots/second, with higher concurrency. Processing-graph allocation plateaued at 53–55 graphs while voice count quadrupled. Renderer private memory started at 112 MB, peaked at 131 MB and fell to 119 MB after release. A separate 120-shot check created 385 nodes instead of 960 and disconnected all distinct nodes. This verifies bounded allocation in the reproduced fault, not a replacement full-pipeline 512-second soak. The user-requested stop of the original soak was respected.

## Functional evidence and remaining gates

The ZIP-extracted candidate passed visible armed/unarmed Candy, movement, combat, blood, editor event pages/global parameters, calibration, state reconstruction, live P movement with camera lock, aspect switching, 4:3 fullscreen without vertical cropping, local sound playback and world export/import. Native maximization preserved the 4:3 view. Real muted audio fixtures verified global exploration, map override, enemy-driven combat, death returning to exploration, restart and inventory-mode restoration. Fixtures are confined to the test clone.

Three clean-distribution launches and exits succeeded. Reopening retained the same single native window. The diagnostic ZIP-extracted test clone also exited without remaining matching processes. Final rebuild acceptance is recorded separately. Automated input tests deliberately suppress physical capture to prevent unattended mouse trapping. Physical controller/CRT behavior, physical input-to-display latency and user soundtrack content remain unverified.

## Runtime references

Electron's [process model](https://www.electronjs.org/docs/latest/tutorial/process-model) and [BrowserWindow API](https://www.electronjs.org/docs/latest/api/browser-window) describe the bundled renderer/window approach. [NW.js manifest documentation](https://docs.nwjs.io/References/Manifest%20Format/) describes its app packaging. [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) and [webview versions](https://v2.tauri.app/reference/webview-versions/) explain its system-WebView2 dependencies. Smaller distribution size alone does not establish faster gameplay.
