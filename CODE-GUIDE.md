# Engine maintenance guide — 0.6.0

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
