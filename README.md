# Phanicom Sprite Frontier 0.8.0

A sprite-first exploration engine and in-level game-builder prototype. Long-term direction: separately titled games with their own maps, events and assets, expansions and mods. The current generated world and Candy are test content.

## Run

For the Windows desktop package, extract the entire ZIP and open **Sprite Frontier.exe**, or **Launch Sprite Frontier.cmd**. Keep the executable, runtime files and resources folder together. No browser, server, Node installation or network connection is required to play or edit.

The source/browser package also works by opening **index.html**. With Node installed, npm start serves it at http://127.0.0.1:8765. Do not open files inside the ZIP.

Native launches and the principal game/editor checks pass. The observed audio allocation growth was corrected with bounded graph reuse and verified with 2,560 accelerated voices. See DESKTOP-PERFORMANCE.md for measurements and limits. The earlier restricted-process launch failures do not reproduce when launching the application normally from Windows.

## Controls

| Input | Action |
|---|---|
| WASD / Shift | Move / sprint |
| Mouse; click once; Esc | Look; capture / release |
| Wheel | Zoom |
| Space | Draw/holster, switch armed/unarmed Candy |
| Left click / F while armed | Fire |
| Left click while holstered | Interact/pick up reachable target |
| Right click while holstered | Inspect reachable target |
| R / E | Reload / jump |
| P | Freeze view, manipulate HUD cursor; P returns |
| I | Inventory; close restores prior mode |
| F2 | In-level editor / fresh playtest |
| V | First/third-person debug view |

Standard gamepad: left stick move, right stick look, RT fire, A interact, B jump, X reload, Y holster, L3 sprint, LB camera, Start pause. Physical hardware remains to be tested. Header offers fullscreen and 4:3/16:9. HUD modules can be dragged/minimized in P mode. Actual CRT overscan depends on hardware.

## Authoring and tools

F2 enters the same level for editing. WASD/right-drag explores it; scene tools select/place props, events and ammo. Shift-drag moves selections. Numeric positions, map placement, undo and world JSON export/import are available.

Events support pages with highest-match precedence, global/self-switches, variable/item thresholds, AND conditions, interaction/touch triggers and message/switch/self-switch/item/wait/transfer commands. Copy pages and edit/reorder/delete commands. Author inspection text, topic aliases, sprite profile IDs and source combat notes. This is an MZ-inspired subset, not the whole MZ command catalogue.

**Global parameters:** walk/sprint, jump apex, gravity, step height, aim limits in degrees, mouse sensitivity, zoom limits, default interaction feet and ricochet chance. Apply validates, saves to world data and restarts the playtest; Reset restores defaults. Event reach overrides the global default. Other weapon/enemy options currently use profile/note metadata; a universal form for every property remains future work.

**Soundtrack:** exploration/combat filenames, one per line, stored in audio/bgm/exploration and audio/bgm/combat respectively. Nonempty map exploration tracks override global exploration. Random shuffle bags play each track before refilling and avoid immediate repeats with multiple tracks. Aggroed living enemies activate combat music; returning to exploration starts its playlist anew. Main volume and music multiplier both apply. Empty playlists are silent. No BGM files were supplied; transitions currently replace tracks without crossfades or position resume.

**Muzzle/flash calibrator:** choose profile, row and animation frame; click projectile or flash point, adjust yaw/pitch corrections, copy a row, Apply and Export JSON. Uploaded sheets create additional profiles usable by event spriteProfile IDs. Browser local storage is convenience persistence; exported JSON is the durable project copy.

**Ask about:** near the guide, P → ASK on the remote. Topics are local aliases/answers with optional switch gates. Editor topic example: [{"aliases":["ammo","ammunition"],"answer":"Supply boxes contain rounds."}]. No AI/network/eval is involved.

**World export** saves authored content. **Playtest export** saves player combat/blood identity and event switches/variables/inventory. It excludes enemy damage, projectiles, active commands, camera, holster state and HUD placement; it is a prototype snapshot rather than the final save-game format.

## Maintenance

Assets use audio/bgm,bgs,me,se and img/characters,pictures,weapons,hud/portraits plus fonts. 124 supplied SE files are included. Separate portrait metadata supports health/damage/idle states; current art has one neutral portrait, so states intentionally share it. Custom visible text uses Checkbook.

Read **CODE-GUIDE.md** for module ownership, units/load order and extension recipes; **CHANGELOG.md** for implemented history; **PLUGIN-PORT.md** for compatibility boundaries; **TEST-REPORT-06.md** for verification. Historical reports remain snapshots. NEXT-CHANGE-LOG.md preserves user observations and future requests.

npm test runs dependency-free tests. Current browser acceptance is tests/browser06.cjs with separately available Playwright/Chrome (see CODE-GUIDE); pointer capture is disabled during background testing.

Limits: fixed 48×48 map, geometric collision, painter-order occlusion, basic AI, incomplete specialized weapon-family effects, no multiplayer/MZ importer/full game-export wizard, unresolved desktop startup. Full source plugin visual/effect parity is not yet achieved; see the ledger.

Provenance: user-supplied Frontier, Candy/UI art, Checkbook font and Dark West plugins/settings/audio. Pixi 8.22.0 is bundled with license. Archived originals/dependencies are preserved; no Daggerfall/Virtual Hydlide game assets are included.

