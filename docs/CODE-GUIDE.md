<!-- October 9, 2026: current 0.15.19 behavior is documented in ITERATION-0.15.19.md. Prior upright sprite and Arial pause notes below are superseded, retained as history. -->

## Current update — 0.15.18, October 9, 2026

Read ITERATION-0.15.18.md and CAMERA-SPRITE-PAUSE-GUIDE.md for current camera, sprite, door collision and pause behavior. Older version-specific statements below are retained history and superseded where the current guide differs.

# Engine maintenance guide — 0.15.16

Current release: see ITERATION-0.15.16.md for camera, landing and recovery behavior. FUNCTION-REFERENCE.md covers every owned runtime function, including the earlier engine. Older release sections below are retained as history.

This project is becoming a reusable game builder, not a single finished game. The current demo exercises engine systems; its title, Candy, weapons, terrain seed and events are test content. Future games should supply their own project data instead of forking movement, renderer or editor code. Separately titled game export, multiple maps, expansion installation and mod loading are architectural direction, not completed shipping tools in 0.6.

## Start here years from now

Read README.md for controls, CHANGELOG.md for implemented history, PLUGIN-PORT.md for compatibility limits, and TEST-REPORT-06.md for actual verification. Comments in executable modules explain their purpose and significant blocks. The compressed Pixi distribution, image payloads and archived originals are exceptions: they are dependencies/data, and their boundaries are documented rather than hand-edited.

The project uses ordinary scripts, not a bundler. Each module exports a named global. **Script order in index.html is an interface contract.** Module-level closures keep private caches/state out of other systems. The muzzle editor has its own document and loads its own dependencies.

## Ownership and load sequence

| Layer | Files | Responsibility / how to change it |
|---|---|---|
| Shell | index.html, style.css | Menu/HUD/editor DOM and responsive viewport. Keep IDs synchronized with application handlers. |
| Rendering backend | vendor/pixi.min.js, src/pixi-renderer.js | Pixi WebGL, pooled Graphics/Sprites/Text. Replace the adapter without changing simulation coordinates. Vendor is Pixi 8.22.0; preserve its license. |
| Project defaults | project/*.json and corresponding src/*-data.js | Movement tuning, collision definitions, demo terrain/sky, event prefabs, HUD portrait metadata. Keep offline mirrors semantically equal. |
| Native world | world.js, terrain.js, sky.js | Seed generation, bounded import schemas, height-field support and atmospheric layers. |
| Source behavior | src/legacy/*, plugins/phanicom-synth-footsteps.js | Original Frontier rules and synth sounds. Native hosts override only selected public functions. |
| Plugin adaptation | js/plugins/*.Core.js and native *.js hosts | Extracted MZ parsers/equations plus native integration. See the feature matrix before assuming source parity. |
| Audio | audio-manifest.js, se-audio.js, audio.js | Local filenames, bounded SE voice pool and shared procedural context. |
| Actor visuals | directions.js, candy.js, candy-unarmed.js, sprites.js | Generic row mapping/animation and sheet resolution. New sheets require metadata, not movement changes. |
| Muzzle | muzzle-data.js, muzzle.js, muzzle-editor.js | Frame points, validation and projection inversion. Keep drawing and firing frame selection identical. |
| Presentation | render.js, device-hud.js | Projection, depth sorting, CRT screen contents, portraits and movable HUD modules. |
| Authoring/runtime events | events.js, editor.js, parser.js | Validated page/command data, isolated interpreter, editor forms and authored conversation topics. |
| App lifecycle | app.js, adapter.js, save.js | Runtime construction, input modes, simulation, import/export, undo and save validation. |
| Hosts | serve.cjs, desktop.cjs | Optional local HTTP and experimental Electron window. No engine rules belong here. |

## Coordinates and units

World X/Y are horizontal, Z is elevation. At yaw zero forward is +Y; yaw uses `atan2(x,y)`. Rendering uses logical 640×480 for 4:3 and 854×480 for widescreen. CSS fits these to available space; client/browser pixels are converted before picking or authoring.

One displayed foot is **0.3 world units**. Actor visual height is approximately 1.65 units. Movement is 3.2 units/second, sprint 2×, normalized diagonally. Collision radius is 0.13. Change movement values in project/settings.json and its offline mirror. A world unit is the physics contract; the foot label is a conversion, not a tile requirement.

Projection focal length is 360 logical pixels. Near plane is 0.12; clipping uses 0.13 for numerical clearance. The reticle is at viewport horizontal center and logical Y=96. Camera framing keeps Candy below it and visible across pitch/zoom. Changes to this contract require updating ray construction, muzzle inversion and input-terrain tests together.

## Authored data versus temporary playtest

`world` in app.js is authored content. `game` is a runtime rebuilt from it. `session` clones events and owns Maps for global switches, self-switches, inventory and variables. Editor edits pass through `mutate`: snapshot → edit → validation → undo record → restart. Invalid changes restore the snapshot.

Switching to editor/playtest resets temporary progress. World Export preserves content, not progress. Playtest Export includes player weapon ID/ammo/HP/position/death mode, event state and blood identities. It currently excludes live enemies' damage, camera, holster state, flying projectiles, particles, active event execution and HUD layout. It is a test snapshot, not the final game save format.

The save validator is pure. It must reject the entire save before replacing live state. Weapon data is reconstructed with equip after scalar restoration; never assign a serialized weapon string over `player.weapon`.

## Common changes

### Add an event command

1. Add a whitelisted command and its limits in events.validate.
2. Implement its runtime behavior in createSession.update. Keep per-frame command budgets bounded.
3. Add editor.fields, addCommand serialization and summary text.
4. Add tests for validation, execution and JSON round-trip. Do not introduce arbitrary JavaScript evaluation into game data.

### Add a condition or page trigger

Update checkCondition/activePage plus editor controls and runtime trigger detection. Highest matching page wins. All conditions on a page must pass; additional conditions are AND. Variable/item conditions are `value >= threshold`. Self-switch keys include event ID to prevent one chest changing every chest.

### Add a sprite or diagonal sheet

Set columns/rows/frame dimensions, crop frames, anchorX, referenceHeight and a direction map. Sector order starts from the actor facing away from the camera and proceeds through the metadata row order. Unarmed Candy maps sectors to rows `[3,2,0,1]`; armed Candy uses `[3,6,2,5,0,4,1,7]`. Walk sequence defaults to `[1,2,1,0]` at 0.14 seconds. Movement and firing should not know sheet row counts.

Custom calibrated NPC sheets are assigned by spriteProfile in the event editor. Profile IDs must match imported calibration data. Default-sheet images use embedded data for file:// WebGL compatibility. New uploaded sheets embed their image in the profile; keep a separate source PNG in the asset tree as a durable authoring copy.

### Calibrate a weapon barrel

Use the calibration tool, choose row/frame, click projectile origin, then flash point. Stored coordinates are absolute pixels on the full sheet, not offsets from the crop. Yaw/pitch corrections are degrees. The runtime subtracts frame crop/anchor, converts reference pixels to world scale, then inverts the same billboard projection. Use row copy only when the weapon tip stays at the same local position across animation; otherwise author each frame.

Angle corrections affect the world firing direction. The red preview line is an authoring cue, not a simulated ballistic path. Actor profile selection determines calibration, not weapon ID; separate armed sheets should have separate profile IDs.

### Add a weapon or change a supplied one

Plugin settings in data/ported-plugin-settings.json and src/plugin-settings.js preserve the supplied profile metadata and two tagged source items. Core parsing follows source defaults when no explicit item tuning is present. The native host creates a bounded demo magazine for every profile. Supply explicit gameplay stats rather than assuming a family name implements explosive/beam mechanics. See PLUGIN-PORT.md.

### Add sounds

Put files in audio/se and update data/audio-manifest.json plus its offline JS mirror. Name is extension-free; file retains exact case, spaces and extension. HTML audio uses URL-encoded filenames. BGM/BGS/ME folders are reserved; playback controllers for them are not implemented yet. Master volume must affect procedural and file sounds together.

### Add a HUD device / portrait

Separate shell art, opaque aperture backing, screen content and interactive controls. Register the module in device-hud.js; use percent positions inside gameFrame. TAB releases mouse look and freezes the world for HUD manipulation. Do not reset camera yaw/pitch when leaving menus. HUD portrait metadata chooses idle/damage/health bands; current art has one neutral frame, so state changes intentionally show the same portrait until additional artwork is supplied.

### Add game projects, mods and expansions later

Prefer a project manifest with stable game ID/title/version, entry map, engine compatibility and asset roots. Multiple maps should have stable IDs and entity namespaces. Expansion manifests should declare dependencies and order. Mods should have validated declarative overrides before introducing executable hooks. Avoid global device/weapon assets hardcoded to Candy when moving the demo into its first real game project. These are future interfaces; 0.6 has not committed a release schema.

## Editable global rules and soundtrack

parameters.js defines field labels, bounds and defaults; app.js builds editor inputs from that schema. The validated snapshot is world.parameters, so changing a tuning value in the editor is portable with world exports. Consumers use get(world,key) without merging objects every frame. Jump launch velocity is sqrt(2 × gravity × jumpHeight); discrete integration gives an approximate apex. Mouse and gamepad share authored pitch limits. Adding a rule requires its schema field, native consumer and regression tests.

music.js stores world.music: exploration, combat, mapExploration and volume. Track names are filenames including extensions under audio/bgm. A nonempty mapExploration playlist replaces global exploration. Shuffled bags avoid repeated tracks until each has played and prevent boundary repetition with two or more entries. Nearby live enemies select combat; no enemies/dead player select exploration. The current one-map demo holds both global and map settings on its world; future project manifests should own the global defaults and maps should own overrides. Missing tracks are skipped once per playlist activation. Playback unlock is linked to the shared user gesture, and restart/stop clears the voice. There is no supplied BGM music to audition yet.

## Performance rules

Reuse GPU objects/textures; do not upload the full scene as a canvas texture each frame. Cache static terrain samples by authored world identity. Editor mutation replaces the world object, invalidating the cache. If future code mutates terrain in place, explicitly invalidate that cache.

Blood updates at fixed 60Hz so original equations retain timing; the application caps simulation dt at 0.05s. Bound transient collections: 256 projectiles, 512 spray particles, 256 passive drops, 32 flashes, 24 SE voices; configured decals/fragments have additional caps. Prefer in-place compaction for high-volume lifecycles. DOM inventory/labels refresh at 10Hz; portrait/equipment screens redraw on state changes. Hidden tabs skip simulation/render work.

Do not promise a fixed FPS from CPU submission benchmarks. Profile simulation, GPU fill, draw calls, audio and DOM independently with representative scenes. Optimize measured hotspots while retaining movement/collision tests.

## Testing and debugging

`npm test` runs dependency-free regressions. `node tests/browser06.cjs` requires separately available Playwright and Chrome; set PLAYWRIGHT_MODULE and CHROME_PATH if needed. It deliberately replaces requestPointerLock with a no-op and uses DOM events. Background tests must never capture the user's physical mouse. Browser tests close their browser in a finally block even on failures.

Older browser-demo.cjs/browser-events.cjs tested historical controls/modal dialogue and are retained as history; they are not current release acceptance tests. Do not run them as background input tests. Current smoke uses browser06.cjs.

Load order failures normally appear as undefined globals. Asset problems appear as missing naturalWidth/failed requests. File:// WebGL failures often require embedded image data, not a change to movement. Electron access-violation dialogs remain unverified desktop-host failures; do not relaunch Electron repeatedly while troubleshooting the engine.

## 0.11 extension points

world.js owns dimensions, limits, activity validation and generation. activity.js owns spatial cells and motion scheduling; never delete actors to make them sleep. events.js calls the motion service while keeping global command execution live. inspection.js is driven by the existing app frame, not a second timer. render.js limits grid work and caches terrain heights. Keep boundaries consistent in world/events/terrain/spatial/save/adapter/editor/app when changing the map schema.


## 0.12 ownership
- terrain.js validates/samples generated and edited heights; terrain-brush.js changes sparse vertices/cells.
- water.js validates materials, indexes painted cells, loads reusable texture assets and builds projected surfaces.
- pixi-renderer.js owns pooled water meshes, repeat textures and sprite/vector waterline masks; render.js chooses the projected cutoff.
- flight.js is a reusable vertical movement API; app.js chooses player flight versus ground physics.
- asset-style.js prepares cached raster silhouettes/phosphor variants; vector-display.js owns map appearance settings.
- editor-tools.js groups forms by task and commits brush strokes through app.js validated undo transactions.
- world.js validates every new persistent field; save.js also validates optional player altitude.

## 0.13 ownership
See ITERATION-0.13.md. cerebral.js validates Blood/Cerebral-related rules, schedules proximity drains and configures starter melee. device-hud.js composites full-canvas layers only when dirty. world.js retains validated source flags/rules; save.js retains Cerebral and magazine scalars. app.js coordinates editor bindings and runtime calls. music-catalog.js is generated from data/music-catalog.json for offline browser use.
# 0.15 additions

`src/map-library.js` owns authored map IDs/names, selection, local IndexedDB persistence and validated portable project backups. `app.js` supplies world replacement and map generation; runtime playtest state resets when switching. Terrain/water/events remain in each individual world. Automatic persistence follows authored restarts, with imported projects added to the library.

`src/water.js` derives a bounded wet slope rim around painted floor cells, clips water polygons at the camera near plane and chooses pool height from surrounding banks. Terrain revision invalidates geometry and rim buckets. `src/render.js` preserves one-unit terrain bends in coarse grid lines and draws anomaly rocks with a distinct full-color stroke.


## 0.15 interior and journey architecture
interiors.js validates room/travel data and caches floor edges, collision bounds and static box faces. room-art.js owns the built-in room image once; maps reference its filename. room-editor.js uses shared validated mutation/undo and redraws only visible dirty previews. normal-workbench.js bounds buffers to 512 pixels per side and rebuilds on interaction. pixi-renderer.js caches normal textures/filters and applies optional directional lighting per image. render.js chooses fixed affine orthographic projection or existing perspective; painter ordering remains in use. muzzle.js inverts the orthographic floor axes for authored muzzle positions.
map-library.js owns authored projects and default connections. app.js owns runtime journey snapshots, shared inventory/player state and journal, with entrance validation and enter-only gate triggers. events.js exposes the journal command. save.js validates the optional project/journey/journal extension before replacing runtime state; older single-map saves remain supported. Selector changes start fresh tests; gate travel restores local state.
Tests: tests/interiors15.cjs checks validation, projection, collision and caches. Release browser acceptance covers authoring, travel, saves, normals, water and animation; performance reports live beside the Windows ZIP.

### 0.15.1 fixed-room aim
FrontierInterior.aim inverts the orthographic plane at weapon height or returns a picked actor center. Adapter.updateAim aligns facing; ActiveCombat uses that facing for its pattern; spatial.js shares the cursor target for projectile construction and keeps angular spread. app.js delivers logical canvas pointer coordinates and positions the existing reticle. Fixed rooms do not acquire pointer lock. Room scale edits heightScale through the same validated mutation and undo path; previews are event driven. Floor exit artwork projects the same radius used by travel checks.

## 0.15.2 audit corrections
Event command-menu options must match editor.fields/addCommand and FrontierEvents validation. Conditional markers are commands, not page conditions. Whole branch clipboard/deletion preserves matching markers; selection resets across event/page contexts. preview bounds the selected page; mutate restores runtime and undo/redo lists on rejection. Dialog validation feedback lives inside eventWorkbench.
Exterior fixed-room exits open only a corridor overlapping an existing floor edge; normal inside movement avoids corridor checks. Travel requires crossing outside the floor when its exit center is exterior. Sprite aim is quantized before muzzle selection; spatial constructs a horizontal ray from that muzzle with existing spread/offsets. Multiplayer replication remains future. Tap release holds its last frame for 0.1 seconds without advancing walkTime.

## Barrel guide authoring (0.15.3)
Optional profile aimMode cursor/barrel and per-frame barrelX/barrelY/barrelDepth preserve phanicom-muzzles/1 backward compatibility. FrontierMuzzle.barrel returns the camera-relative unit direction including calibration corrections; spatial adds weapon spread and retains origin/swept collision. App reticle projects the same unspread ray. Fixed rooms and first person opt out. Calibration UI edits local data until Apply, with bounded undo. tests/barrel153.cjs checks validation and direction math. TOOLS-QUICKSTART.md documents the image-plane/depth ambiguity.

Movement route modules (0.15.9 work in progress): src/mz-routes.js validates MZ numeric route records and owns command execution/controller overrides; src/event-motion.js performs continuous-coordinate swept movement; src/mz-route-dialog.js owns isolated route drafts and parameter controls. Command 205 registers independently in mz-commands.js/mz-dialogs.js, while events.js owns target resolution and route waits. Unknown extension fields in route records survive schema validation; unsupported route opcodes are rejected before execution. Route parity limitations are tracked in MZ-COMPATIBILITY.md.

Parallel scheduling (0.15.9): createSession owns cloned runtime events and shared game state. events.js owns a main interpreter context plus contexts keyed by parallel event ID. Each context owns execution, waiting, route waiting and choice branches. loadContext/saveContext use the same command executor for all contexts. The message owner directs next/choose/cancelChoice to the context that opened the shared message. Movement, forced routes and timer update once in the root frame. Page changes replace only the affected parallel context. parallelDebug() exposes context progress; finite per-context/frame budgets are host adaptations. Runtime interpreter-progress serialization is not implemented.

Transfer ownership: transfer-player.js resolves operands; scene-transition.js coordinates one commit/adoption; event-continuation.js carries only the executing page/cursor/origin map. app.js supplies map-scoped self-switch services. screen-fade.js owns event brightness separately; event-runtime.js requiresService preflight prevents service-dependent commands from silently failing. textPresentation avoids merging text window settings into following choices.

Advanced condition presentation: FrontierConditionEditor.register(type,presenter,optionalFactory), after FrontierConditions.register(type,{validate,evaluate}). Presenter receives draft node and field helpers; factory makes a new JSON node. Shared condition validation bounds all accepted trees. No presenter/evaluator functions are serialized. Page editor stores extras as expressions beside the six baseline slots. Session entity resolver supplies live spatial subjects/targets without copying registry maps per frame.

Event template foundation: FrontierEventTemplates.compile validates and freezes definitions once; instantiate shares immutable page data and owns identity/placement. snapshot returns a detached export. Runtime/editor integration is pending; callers must validate destination-map bounds before adoption. Do not mutate template pages during execution.

Project templates are additive under templates; older project schema/1 files default to an empty template bank. Imports merge banks with ID mapping instead of overwriting; consumers of template references must use the returned mapping. Imported direct MZ map destinations in definitions are remapped with map numeric identities.

Runtime replacement boundary: session.replaceEvent validates definition/version/placement before cancellation. It retains target identity/coordinates, cancels old owned execution/motion/message, and supports reset/preserve self switches. Definitions share frozen page data; references and debug traces are detached. replacementRevision must participate in scene rebuilding when app integration lands. This API is presently internal and is not an enabled authoring command.

Template history: entry-only transactions,8MiB/32-record combined undo/redo cap. Failures preserve pending transaction. Project restoration resets session history. Removing a referenced definition is rejected; bank IDs/versions remain stable. Bank cache recompiles only when project.templates identity changes. Runtime Replace Event is registered outside native MZ commands; engine dialogs preserve baseline command tab organization.


## October 9, 2026 — 0.15.17 extension

See HUB-DOOR-GUIDE.md for the complete current authoring contract. New independent
modules are model-visibility, hub-state, hub-workbench, hub-fixtures, door-audio,
door-transition and offline item/door asset manifests. Existing templates and
undo boundaries own authored changes. Playtest hub records own stock/drop state;
map resources remain shared. Scene-transition owns transfer commit/resume and
cancels previews. Every new callback/function has its own source contract; the
current dated reference is FUNCTION-REFERENCE-0.15.17.md. Earlier explanations
above remain historical where behavior differs.


## October 10, 2026 — rendering iteration update

Current rendering architecture and authoring instructions are in RENDERING-1522.md. PERFORMANCE-1522.md retains preliminary runs and the superseding precise-memory matrix. FUNCTION-REFERENCE-0.15.22.md/.json index maintained source contracts. Historical notes above remain intact; their resolution/breathing pending statements are superseded by the implemented controls, native command dialog and isolated live preview.

High-density browser acceptance now covers aspect/fullscreen/preference reload, door cinematic dimensions and cell/project state roundtrip, camera clearance at 40 pitch/orbit combinations, door body blocking, room/model occlusion and pause/menu interactions. Packaging verification and native platform testing status are recorded separately at delivery.


## Final release status — October 10, 2026

Supersedes the development/pending status above: 0.15.22 is the complete resolution, filtering and native breathing iteration. Required source suites, comment coverage, high-density browser lifecycle/door/occlusion/guard tests and the eighteen-case precise-memory performance matrix passed. The browser archive was extracted and its real rendering-controls/preview/lifecycle test passed; both distribution manifests were hash-verified. Original assets and prior source block comments were compared with 0.15.21 and remain intact. Earlier release manifests were also verified unchanged.

Complete Windows and Mac browser archives contain source, assets, function reference, guides and validation evidence. Native macOS execution was unavailable. Windows browser checks passed; the packaged runtime version probe exited successfully without diagnostic output, which does not prove native graphical acceptance. Manual native Windows/Mac acceptance remains explicitly unverified, rather than being represented as tested. Performance and GPU-memory limitations are documented in PERFORMANCE-1522.md and VALIDATION-1522.md.


## October 12, 2026 - 0.15.23 current behavior
See ITERATION-0.15.23.md and PERFORMANCE-AUDIT-1523.md for current rendering, preparation ownership, performance evidence and limitations. Earlier version-specific instructions above remain history and are superseded where these documents differ. Locked 0.15.17 camera-facing sprite presentation remains mandatory.


### 0.15.23 rendering ownership
`camera-basis.js` retains exact frame camera arithmetic. `outdoor-assets.js` owns weak world caches for heights/tiles; terrain revision and source edits invalidate them. `pixi-renderer.js` owns pooled mesh buffers and explicitly destroys exclusive geometry on growth. `geometry-gpu.js` owns private context textures/program/buffers and nonblocking setup fences; density replacement destroys and loses the retired context. `model-renderer.js` keeps opaque room GPU color separate from shared CPU depth, plus bounded camera-independent static model geometry (200,000 triangles/128 entries globally; 32 entries per asset). Exact parent matrix or scene replacement invalidates a model record. `scene-transition.js` owns one reservation/commit; app preparation starts shared destination decode before playback, door readiness waits under a black cover, and failure clears ownership. Options breathing reuses one session controller; authored map settings remain intact. No per-frame diagnostic logging is added.


## October 14, 2026 — Test 2 authoring update

See TEST-BUILD-0.15.25-TEST-2.md for the current workflows, validation and remaining limitations. Earlier release descriptions above are retained history. New native item sprites use FrontierSprites single-frame metadata; item placement uses normal event pages/self-switches, compact carried/drop state, the shared prop surface query, and active-cell light budgeting. Map folder metadata is authoring-only. Blank projects suppress example-map recovery migrations. No change to the locked 0.15.17 player sprite presentation.


## October 14, 2026 — Test 3 editor layout and deletion

Supersedes Test 2 three-column authoring layout: project actions are at the top; scene, build tools, categories and original property controls share a scrollable left dock. The playable edit view occupies the right. Authoring uses readable Arial text; game rendering and 0.15.17 sprite presentation are unchanged. Scene entries expose Delete alongside their names and route through the original owner transaction; Undo and Redo are visible on the top toolbar. Shared image/model asset files are retained when placed instances are deleted.

Validation: real browser authors geometry, deletes a wall with the visible action, restores it with Undo, verifies left/right bounds, edits properties and checks playtest/runtime guards. Performance checks remain assigned to the user.


## October 14, 2026 — Test 4 room movement and tile drafting

Current behavior supersedes Test 3 handoff and boundary-stroke behavior. Entering playtest retains a clear editor XYZ position. If editor noclip or an edited spawn overlaps room collision or lies outside the painted floor, the runtime tries nearby supported points and authored tile centres, checking full body clearance. It does not rewrite the spawn, geometry or camera. If no clear point exists, it remains in the editor and reports the problem. Both editor/playtest transitions focus the game view so a hidden form control does not retain keyboard ownership.

Tile painting and doorway insertion validate proposed additions before changing the draft. Out-of-bounds/capacity failures leave a usable draft; later paint and erase work without discarding it. Invalid dimensional fields preserve the previously rendered grid and show a correction message rather than clearing the canvas. Plan canvases and fieldsets fit the left dock, and touch painting suppresses browser scroll gestures.

Validation: production browser controls reproduce a wall-overlapping saloon spawn, enter playtest nearby and move with WASD; reject an edge stroke then paint/erase/apply successfully; preserve canvas pixels during invalid input; verify dock bounds. Existing editor altitude/playtest, terrain/input and locked sprite-presentation checks are retained. Performance profiling remains with the user.


## October 14, 2026 — Test 5 scene selection and separate Tile Room Editor

Supersedes Test 3/4 hierarchy navigation: clicking a scene name highlights it without scrolling away. Edit selected explicitly opens its properties. Shift-click selects a visible range; Ctrl/Cmd-click toggles individual entries. Select all shown follows the search filter; Clear selection resets it. Delete selected removes the highlighted instances in one validated Undo transaction, including mixed room/event/light selections. A row Delete removes only that row. Both deletion paths retain dock/list scroll position, with normal end-of-list clamping, and preserve shared assets.

Build Structures now opens a large, separate modal Tile Room Editor. The dock launcher remains available. Wall, floor and ceiling each have a texture picker, thumbnail and PNG/JPEG/WebP file loader (8MB maximum per file). Imported textures are embedded in portable authored data. New layouts default to Tin ceiling, rather than roof tiles. Saved older textures remain available for deliberate replacement. Apply room layout commits geometry and saved role choices; its visible replacement checkbox controls whether selected textures replace existing layout overrides. Apply textures to all room surfaces updates generated or named structural wall/floor/ceiling primitives in one Undo step without changing dimensions; unclassified furniture/boxes are retained. Original compiler preservation remains the default for other callers.

The modal keeps settings and the grid in separate panes. It retains unsaved draft when closed normally; Apply/Discard are explicit. World movement is paused while this authoring window owns input; F2 closes it before switching mode. Existing mode-reset behavior for uncommitted drafts remains applicable. Original grid dimensional controls remain under Grid dimensions and room height.

Delete current map still prevents deleting the last map or a map with incoming references. Rejections now explain the reason beside the buttons, including how to create a replacement map; no silent action or removed user files. Successful map deletion, map Undo/Redo and retained subsequent edits were exercised through the real controls. Optional authored encounter/courier examples remain under Optional examples and test maps. No prior controls/options were removed. See CONTROL-CHECKS-TEST-5.md for scope/evidence; this is not a certification of every possible engine workflow.
