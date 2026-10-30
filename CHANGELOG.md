## 0.16.0 — October 22, 2026

UI Audit Setup foundation: five workspaces, typed contextual selection, integrated plans, persistent generated-part intent and explicit detach/restore. Exact pinned Sprite Fusion WASM replaces automatic silhouette generation, preserving native pixels and sheet cells. Read EDITOR-REDESIGN-0.16.0.md for scope and remaining milestones; SPRITEFUSION-0.16.0.md for license/build details. Earlier release notes remain unchanged below.

## October 22, 2026 — current iteration 0.15.27

See ENEMY-EVENTS-AND-FONTS-0.15.27.md for enemy events, arsenal archetypes, supplied sprites, muzzles, respawn/save ownership and readable editor/selectable gameplay fonts. This dated record supersedes conflicting behavior below; earlier explanations remain history.

## October 22, 2026 — current iteration 0.15.26

See PROJECTILE-ARSENAL-0.15.26.md for active finite projectile collision, weapon/ammo authoring, overdamage gibbing, cream/synth alias behavior, provenance and verification limits. src/ballistics.js owns shared swept movement and terminal impacts; src/arsenal.js owns presets and inventory ammo accounting; Phanicom_BloodSystem retains victim-owned blood identity. Earlier behavior descriptions below are preserved history and are superseded where this dated record explicitly differs.

# 0.15.3

Restored continuous room cursor shots; retained exterior exit and outdoor startup. Added optional third-person per-sheet/per-frame muzzle/barrel guides, forward depth, real-ray reticle, undo and JSON workflow. Audited room/map/dialogue/normal tools; improved template feedback/IDs and expanded-only debugger sampling. See ITERATION-0.15.3.md.

## 0.15.2 — 2026-10-06
- Audited UI event authoring: dialogue, choices, branches, journal, rewards and conditioned pages.
- Fixed command menu, page deletion preview, rejected-edit rollback and modal error feedback.
- Reset insertion selection, added Append at end, and preserve complete branches on copy/paste/delete.
- Included an authored dialogue-room example and instructions.
- Exterior room exit corridors, eight-direction room fire, aiming cursor hiding and single-frame taps.

## 0.15.1 — 2026-10-06
- Correct Room Test proportions and provide a visible room character-scale ruler/slider with undo.
- Cursor aiming, sprite facing and horizontal weapon-height trajectories in fixed rooms.
- Immediate firing without camera capture; P interaction remains separate.
- Broad floor-projected exit patch and safer arrival placement.
- Migrate original test calibration while preserving customized settings.

## 0.15 — 2026-10-05
- Fixed orthographic Room Test and free-camera primitive Geometry Ruin.
- Room floor/collision, furniture, spawn and map-connection authoring.
- Connected hub travel, persistent visited maps, relic quest and journal.
- In-house height/normal-map workbench and cached directional normal lighting.
- Brief-input animation, shared underwater visibility/effect classification and Cerebral crossfades.
- Cached geometry/collision and deduplicated room artwork; measured outdoor and room stress checks.

## 0.14.1 — 2026-10-05
- Map picker, named independent maps, local library saving and project backup/import.
- Fixed missing Cerebral update in normal play; identifiable anomaly and inspection details.
- Lower bank-relative pools, adjoining wet slope coverage, accurate grid bends and near-plane clipping.
- Contained weapon icon/ammo/text and scrolling immersion viewport.

## 0.14.0 — 2026-10-05
- Terrain-clipped level water shorelines with cached geometry and viewport culling.
- Camera-height dependent sprite occlusion; underwater bodies visible without tint.
- Editable world-only underwater distortion with independent strength, speed and frequency.

## 0.13.0 — 2026-10-05
- Layered authored portrait, Cerebral backgrounds and single Candy damage fallback; removed Vitality TV.
- Combined weapon/immersion chassis and invisible aligned remote Inventory/Power buttons.
- Editable Cerebral proximity sources, thresholds and starter melee; persistent Cerebral and per-weapon magazines.
- Banked exploration/combat tracks and static audio catalog included and preselected.
- Retained prior cursor, fog, Vectrex, water, terrain and event/editor fixes.

## 0.12.2
- Fixed distance fog extinguishing mountain/cloud vector beams.
- Fixed stale sprite glow transforms and made artwork controls apply immediately.
- Added an editable shallow pool near demo spawn.

## 0.12.1
Vectrex appearance controls now have a dedicated editor tab rather than being buried under Map settings.

## 0.12.0

Added focused editor tabs, sparse terrain brushes with stroke undo/redo, seeded undulation, opaque painted water and reusable texture materials, waterline clipping, player hover/free flight, full-color vector and cached raster treatments, reusable named types and separate map event list. Water textures can be embedded for portable map export. Existing gameplay and cursor fixes remain.

## 0.11.2
Per-map UVMC2-inspired vector beam preset: cyan-white core, pooled soft glow, configurable line gaps and original-color option. HUD and sprites retain their appearance. Existing maps default to the original renderer.

## 0.11.1

Hand cursor remains inside the fullscreen viewport; the native inspection scrollbar is hidden while wheel/auto scrolling remains available. Object names omit distance and wrap inside the shared inspection scroll area.

## 0.11.0

Weapon-independent P-mode actions; uncluttered hover names; contained automatic/manual CRT scrolling; rectangular map authoring and backward migration; spatial scenery queries; bounded terrain rendering; distance-scheduled ambient event motion with persistent state and always-active quest policy. See ITERATION-0.11.md.

# Version 0.10 — 2026-10-05

P-mode actions on press with pointer capture; editable success sound/volume; per-map depth fog with runtime overrides; clearer desktop launch instructions. Lighting is reserved for a future iteration.

# Version 0.9 — 2026-10-05

Live P-mode hover/pickup/inspection, three paired hand cursors, crosshair visibility options, armed directional movement with firing alignment, and combat-to-exploration fades. See ITERATION-0.9.md for controls and maintainer details.

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


0.11.1 also suppresses native middle-button autoscroll in the viewport and clears stale held movement/drag input on middle press.


## October 9, 2026 — 0.15.17

Current hub/door/item/model visibility changes are documented in HUB-DOOR-GUIDE.md
and ITERATION-0.15.17.md. 74 source checks and 18 browser acceptance commands pass;
3,824 function comments are indexed. Native Electron automation could not launch;
Mac is a complete browser edition. See TEST-REPORT-0.15.17.md for scope/limits.


## 0.16.11 - October 29, 2026

Combined original-art inventory, transparent D-pad controls, shared item/recipe authoring and atomic crafting; connected rectangular rooms/buildings/storeys, persistent component overrides, explicit shared walls and real door openings; focused door-test maps replace redundant fresh-project examples; zoom-aware isometric visibility, fog and cosmetic LOD. Existing saves, original sprite presentation, shadow-system splits and prior release documentation remain preserved. See ITERATION-0.16.11.md and TEST-REPORT-0.16.11.md.


## 0.16.12 - October 29, 2026

Editor fullscreen retains its toolbar and supports Escape plus a visible exit button; desktop F11 recovers from HTML fullscreen before toggling native fullscreen. Complete cumulative Windows release, same compatible 0.16.11 project profile. See ITERATION-0.16.12.md.
