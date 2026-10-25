# Changelog

Earlier entries summarize existing iteration reports and request logs. Newest entry records implementation, not future promises.

## 0.8.0 — 2026-10-04

- Added dedicated MZ-style event workbench with tabs, command insertion/copy/paste, debugger, isolated event testing and reusable templates.
- Added conversational text, choices, validated branch/Else/End flow, autorun/parallel scheduling, autonomous movement and event priority/through settings.
- Added mouse dragging with draw-only object preview, signed terrain-relative elevation and undo/redo.
- Added cached soundtrack dropdowns/playlists and a fixed-folder sandbox bridge; world exports include a validated catalog.
- Added a two-page conversation demo and regression coverage. See ITERATION-0.8.md for controls and remaining scope.
## 0.7.0 — 2026-10-04

- Added sandboxed desktop window lifecycle, single-instance focus, F11 fullscreen and orderly shutdown. Diagnostic logging and process metrics are opt-in and bounded.
- Profiled vector rendering and batched consecutive compatible strokes; cached parsed colors in a bounded 128-entry cache. Frozen-scene comparisons retained identical RGBA output across tested camera angles and dense scenery.
- Compared native Electron, NW.js and a WebView2 test host with the actual engine. WebView2 measurements are not a completed Tauri implementation.
- Added explicit disconnection of completed procedural weapon sound graphs after both sources end and a 600 ms tail, plus a bounded 32-idle-graph cache. Stateful compressors and oscillators remain per voice. PCM parity checks passed; 2,560 accelerated voices plateaued at 53–55 processing graphs and renderer memory fell after release.
- Verified 854×480 widescreen frame processing and compared three warm renderer startups per host; see DESKTOP-PERFORMANCE.md for percentiles, scheduling spikes and method limits.
- Verified real local exploration/combat playback using temporary audio fixtures in a test clone, including map override, enemy aggression, death returning to exploration, and track restart. No test music is shipped.
- Sustained stress testing ran for 511 seconds before the user requested stopping. Retained JavaScript heap was 9,433,092 bytes at 60 seconds and 9,408,108 bytes at 301 seconds, with no recorded JavaScript errors or lost graphics context. This does not prove indefinite leak freedom.

## 0.6.0 — 2026-10-04

- Added fifteen native combat profiles using supplied parsers/spread/audio; semi/auto/burst, shotgun, melee, hitscan and penetration paths.
- Added native blood identities, source particle equations, fixed-rate passive drips, hide/show, bounded stains/gibs and death delay.
- Added armed/unarmed Candy switching and generic four/eight-direction sheet/profile handling.
- Added per-sheet/row/frame projectile/flash calibration, angle offsets, upload/Apply/JSON import-export.
- Added local ask-about parser, event topic authoring and guide/remote example.
- Adopted MZ-inspired asset folders and included 124 accessible SE files; missing stock Laser1/2 aliases use supplied beam sounds.
- Added validated editor global movement/jump/gravity/step/aim/sensitivity/zoom/reach/ricochet settings with persistence/reset/undo.
- Added randomized exploration/combat playlists and map exploration override; no BGM files supplied yet.
- Added playtest state export/import for player combat, event state and blood identities.
- Fixed save restoration overwriting the equipped weapon object; strengthened muzzle/topic/save validation.
- Fixed melee event/player target selection, passive drip fidelity, shared blood audio context, F2/interaction instructions and delayed/widescreen death overlay.
- Added maintained code comments, readable executable blocks, README, code guide, changelog, fidelity ledger and regression report.
- Cached terrain samples/event preview/DOM references; bounded effects/audio voices; reduced UI refresh; retained pooled Pixi resources and hidden-tab skipping.
- Background acceptance disables pointer capture and closes test browsers even on failure.

Still incomplete: full specialized source weapon-family/cover/equip/AI/command/death-override parity; standalone desktop repair; universal property editor; multiple maps and shipping game/mod/expansion export; Skill-O-Matic gameplay and paper fallback; additional portrait expression art.

## 0.5.2

- Rear scenery no longer pulls aim behind the muzzle; added randomized one-bounce scenery ricochet.

## 0.5.1

- Embedded Candy image fixes file:// WebGL sprite loading and associated loop failure.

## 0.5.0

- Real pooled Pixi WebGL renderer, offline vendor, event AND conditions/variables/page copying and Checkbook text.
- Experimental Electron entry point subsequently found unreliable on this machine.

## 0.4 series

- Modular draggable/minimizable CRT devices, opaque screens, portrait metadata, remote controls and frozen-camera cursor mode.
- Inventory, reach labels, holstered left-click interaction/right-click inspection, nonblocking descriptions/pickups and holster-facing preservation.

## 0.3 series

- Mouse/controller, preset ammo, variable terrain and vector sky/parallax/cloud layers.
- 4:3/widescreen/fullscreen, zoom framing, pitch/reticle alignment and stabilized billboards.
- Height-aware jumps/steps and terrain/projectile obstruction.

## 0.2 / 0.1

- Seeded vector/sprite exploration foundation with Frontier movement/combat/footsteps.
- In-level editor, page/command events, world import/export and isolated playtests.

## 0.6.1
- P toggles live cursor mode: camera orientation stays locked while movement and simulation continue. Cursor coordinates select loot and inspection targets.
- Enemy aggression now owns combat state; dead enemies end pursuit and passive bleeding.
- Passive drip audio is audible within 3 world units by default, editable in global parameters.
- Separate audio/bgm/exploration and audio/bgm/combat folders; demo playlists use these paths. Empty playlists stay silent; transitions start new randomized tracks at zero.

