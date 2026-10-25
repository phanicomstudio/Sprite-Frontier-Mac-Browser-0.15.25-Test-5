> Historical snapshot. Current controls/features/limits: README.md, CODE-GUIDE.md and TEST-REPORT-06.md.

# Phanicom Sprite Frontier — foundation assessment

**Historical assessment of prototype 0.1.** See EVENT-EDITOR.md for 0.2 and DEMO-03.md for the current 0.3 terrain, input, sky and spatial-combat implementation.

Working title: Sprite Frontier, prototype 0.1. This is a new standalone project, not a modified Metropolis Frontier release. The source ZIP and desktop files remain unchanged.

## Reference hierarchy

1. User's foundation brief governs scope and priorities.
2. Daggerfall Online governs the intended exploration feel: responsive camera-relative traversal, mouse look, spatial scale and orientation. Its site describes a browser-native WebGL2 renderer and WASD/mouse controls: https://daggerfalljs.dev/. This prototype has not yet been calibrated against a hands-on Daggerfall session; matching its precise feel remains an acceptance task.
3. Metropolis Frontier 0.20.7d governs simulation philosophy, movement baseline and combat behavior.
4. Virtual Hydlide governs third-person sprite adventure presentation and replayable worlds: https://en.wikipedia.org/wiki/Virtual_Hydlide. Its disc archive was inventoried only; no game assets were extracted.
5. Daggerfall Unity is an additional architecture/art reference: https://github.com/Interkarma/daggerfall-unity. No Daggerfall code or assets are included.

The source archive's AGENTS.md and other documents were inspected as reference material about the existing project. They were not treated as user requests to alter that project.

## Assessment

The useful inheritance is world-space simulation, explicit content loading, clone-before-play, semantic events, and a shared editor/runtime representation. Isometric projection, picking, depth order and the old camera should be replaced. Reusing the whole engine would bring unnecessary coupling to the old content schema and presentation.

The supplied engine uses a Canvas 2D renderer (`src/render/renderer.js`), despite the brief describing it as WebGL2. The new project's target should be WebGL2 with a depth buffer, terrain meshes and billboard cards. The current bounded foundation uses a software perspective projection on Canvas to prove controls, sprites, editing and the combat adapter without graphics dependencies. It is an interim renderer, not a finished 3D/WebGL engine. Vector props are actual Canvas paths; Candy alone is raster sprite artwork.

## Reuse / Adapt / Replace

| System inspected in Frontier | Decision | Foundation / next action |
| --- | --- | --- |
| Input (`main.js`) | Adapt | Keep responsive WASD, opposing-key cancellation, blur clearing, Shift sprint and form-control gating; add pointer lock and camera look. |
| Movement (`systems/world.js`) | Adapt | Carry 3.2 speed, 2× sprint, diagonal normalization, axis sliding, 0.08 step cap, displacement-based facing and animation. Replace inverse isometric input projection with camera-relative movement. |
| Player/session state (`state.js`, `runtime/runtime.js`) | Adapt | Clone authored objects into live entities. Separate camera and input from entity state. Local player alias retained for the legacy port; `players` registry and `localPlayerId` establish explicit ownership. |
| Entity registry (`runtime/entity-registry.js`) | Adapt | Stable IDs and registry lookups. Small Map-backed registry now; port richer indexes when needed. |
| Weapon state and damage (`systems/combat.js`) | Reuse | Copied unchanged. Original reload, holster, ammunition, spread, damage, faction and kill events remain. Firing is one shot per click/key press, matching the original click-driven firing; no invented automatic-fire cadence. A 9mm fixture proves the port; its values are project data. |
| Projectile simulation (`systems/projectiles.js`) | Reuse now; adapt later | Copied unchanged: swept earliest contact, range/lifetime, velocity, obstruction, owner IDs and effects independent of physical shots. Currently horizontal x/y only. |
| Collision (`systems/grid.js`, `engine/collision.js`, `shared/geometry.js`) | Adapt | Geometry utilities copied unchanged. Current generated props use simple AABB footprints shared by movement and projectile queries. Add height-aware colliders and shared broad phase later. |
| Asset resolution (`systems/assets/asset-registry.js`, loaders) | Adapt | Carry stable asset IDs, metadata and package-local resolution concept. Initial Candy asset loaded locally; generalized direction selector consumes row metadata. Full asset package support is deferred. |
| Animation (`sprites.js`) | Adapt | Preserve [idle, B, idle, A] cadence at 0.14 seconds. Direction selection changes from four screen-facing rows to N camera-relative rows. |
| Module loading (`shared/module-package-loader.js`, assembler) | Adapt | Preserve parse → canonical data → validate → instantiate. New `sprite-frontier/1` world format; not presented as compatible with Frontier schema 0.18. |
| Plugins (`runtime/plugins.js`) | Adapt | Minimal registration/lifecycle adapter supports the supplied footsteps plugin unchanged. This is not full compatibility with every Frontier plugin. |
| Audio (`systems/audio.js`, footsteps plugin) | Reuse / adapt | Original Phanicom Synth Footsteps 1.0.1 file unchanged; small shared WebAudio service reproduces frequency and envelope behavior. Movement hooks run after collision resolution. |
| Editor (`editor/module-document.js`, history, runtime bridge) | Adapt | One document, checkpoint before edits, one runtime; editor pauses play and shares world data. Initial top-down workbench rather than copied isometric authoring UI. |
| World serialization (`editor/module-package.js`) | Adapt | JSON export/import, canonical validation and round-trip tests. Exports authored world, not HP, ammunition or live projectiles. |
| Projection, sprite picking, isometric depth order, camera | Replace | Perspective projection and camera-relative billboards now; depth-buffered WebGL renderer next. |

## Project structure

```text
index.html / style.css          application and editor shell
project/settings.json          entity definitions, movement and test weapon
assets/candy-armed.png          user-provided sprite, unchanged
plugins/phanicom-synth-footsteps.js  supplied plugin, unchanged
src/project-data.js            offline mirror of settings JSON (test checks equality)
src/world.js                   seeded generator, entity factory, shared validator
src/movement.js                adapted Frontier controller
src/directions.js              generalized N-direction frame selection
src/candy.js                   frame crops and sheet metadata
src/adapter.js                 canonical world → live entities, combat facade
src/legacy/                    unchanged combat, projectiles, geometry
src/audio.js                   minimal audio service and plugin registration
src/render.js                  replaceable vector/sprite perspective renderer
src/app.js                     input, loop, small editor and lifecycle orchestration
tests/run.cjs                  simulation/data regressions
serve.cjs                      optional local development server
```

Next ownership split: move editor handlers into `src/editor/`, camera into `src/camera.js`, and simulation update into `src/simulation.js` once the first controls review identifies the behavior to keep. Keep one runtime and one loop. Avoid creating a parallel editor gameplay engine.

## World coordinates and entity model

Current axes: **x/y are horizontal**, **z is height**, one world unit is a logical metre for scale. This preserves the original projectile coordinate convention. World bounds are 48 × 48; spawn is the player's feet position. Terrain is flat at z=0. Generation is seeded and deterministic; authored objects are stored explicitly, not regenerated on import. Combat randomness remains inherited Math.random, so only world generation—not the complete simulation—is deterministic.

Canonical current data:

```json
{
  "schemaVersion": "sprite-frontier/1",
  "seed": "PHANICOM",
  "size": 48,
  "spawn": {"x": 24, "y": 24},
  "objects": [{"id":"tree-1","kind":"tree","x":20,"y":20,"radius":0.34,"height":4}]
}
```

Derived dimensions come from entity definitions; the validator rebuilds them to avoid accepting arbitrary collider values. Editor and runtime use this same authored document; runtime copies add HP, velocity, death, stun and other transient state. Imported and procedural worlds both use `makeFrontierGame(world, log)` after validation. No importer is implemented.

Proposed next schema: stable `definitionId`, `position:{x,y,z}`, `rotation:{yaw}`, `scale`, `spriteAssetId`, `collider`, `components` and explicit spawn entities. Chunk IDs can be derived from position; do not implement streaming yet. Version any migration explicitly. Add Phaneroscape translation at the loader boundary after its output contract is available; do not try to execute arbitrary MZ plugins.

## Player, camera and aim

The controller produces successful displacement. Camera holds yaw, pitch, distance and height separately. Unarmed/holstered movement determines player orientation; drawn weapon orientation follows camera yaw. Rendering quantizes only the displayed pose. Projectile directions remain continuous.

Current camera supports mouse drag, pointer-locked mouse look, arrow yaw, pitch range approximately −37° to +17°, adjustable distance and height. Third person is default. An inexpensive first-person debug toggle exists, but no separate first-person content is being developed. Camera collision avoidance is deferred.

**Movement parity boundary:** Frontier used an isometric inverse projection to equalize screen distance; it intentionally results in different ground distance for horizontal/vertical screen input. That projection-specific transform is not reused. The new controller uses the exact 3.2 configuration baseline and retained movement rules in the perspective world. Perceived pace still requires user playtesting at the chosen camera scale. No acceleration curve exists in Frontier's inspected controller, so none is invented here.

Current aiming is camera **yaw** projected onto the horizontal simulation plane. Pitch changes viewing, but does not change projectile elevation. Full crosshair-ray convergence, muzzle offsets and vertical shots belong in the next combat-adapter milestone; do not claim those are done. Ground-plane debugging is deliberate for this small slice.

## Directional sprites

`FrontierDirections.select(entity, cameraYaw, spec)` accepts N evenly spaced directions, explicit row mapping, idle column, walk sequence and timing. Candy's row order is front, left, right, back, front-left, front-right, back-right, back-left. Camera-relative sector mapping is `[3,6,2,5,0,4,1,7]`. The selected frame uses alpha-bounded crops and a consistent feet anchor. The original 1200 × 4800 sheet is included unchanged; some artwork/edge artifacts in source frames may require a later asset-authoring pass.

Environmental billboards currently face the view. Configurable fixed-facing, yaw-only, crossed cards and sprite-depth intersection need the WebGL renderer; not claimed here.

## Combat port

The preserved files call a narrow adapter providing registry, map bounds, collision footprints, events, aim conversion and UI feedback. Fire state and damage remain in original code. Damage occurs after swept physical contact, not because a visible tracer reaches a pixel. Each projectile snapshots owner, weapon, direction, velocity, damage and tuning.

Before co-op, remove the remaining legacy player assumptions from damage feedback and aim input, pass commands per controller, and use stable shot IDs. A player registry alone is not co-op support. Networking, replication and prediction are intentionally absent.

## Editor and persistence

Initial workbench: choose a kind, place by map click, select by stable ID, inspect/edit x/y, move, delete, undo, export/import JSON. Collision-safe placement and spawn protection prevent unusable starts. Playback instantiates the authored data again and resets combat. Undo is in memory; exported files are the persistence mechanism.

Proposed next workbench step: selecting by map click, drag movement, yaw/scale/collider inspector, player/enemy spawn authoring, dirty-state prompts and world-space selection outlines. Keep file handles and selection outside the world document. These are not part of the current implementation.

## Milestones

1. **Inspection and contracts:** completed assessment, separate project, input/movement/combat boundaries.
2. **Playable foundation:** current Candy/vector world, seeded generation, collision, third-person camera, horizontal physical combat and small world editor.
3. **Feel review:** user tests against Frontier and Daggerfall Online; tune follow scale, rotation sensitivity, aiming policy and input priorities without silently changing movement defaults.
4. **Rendering/ballistics:** native WebGL2 line and billboard pipelines with depth; camera collision, true 3D aim/muzzle handling and vertical projectile sweep.
5. **Authoring and assets:** seamless ground textures, sprite library, rotation/scale/collider editing, spawns and richer schema.
6. **Later bridges:** Phaneroscape importer contract, then 2–4 player simulation ownership and co-op transport. No networking or importer now.

## Verification limits

Tests cover reproducible generation, data validation, settings mirrors, movement speed/diagonal clamp/sprint, blocked walk animation, directional mapping, original reload/holster, damage, kill events and non-tunneling projectile obstruction. Browser smoke checks cover loading, editor interactions, file round trips, camera and input without page errors. Audio plugin hooks and sound-envelope scheduling are checked; perceived loudness and exact subjective control feel need user playtesting. No claim of cross-browser coverage, 3D occlusion correctness, co-op or full Frontier module compatibility.

## October 12, 2026 - 0.15.24 editor and local-lighting work (unreleased)

Native building-kit generation writes ordinary room primitives. Room-physics
queries those same volumes for support, step proposals and vertical sweeps.
Primitive yaw is shared by face generation, collision, connector anchors and
parent-relative decorative attachments. No collider is silently left behind.
Building/prop previews remain transient until one validated app.mutate transaction.
The adapter now returns commit acceptance; older callers may ignore this result.

The workspace moves original DOM controls into categorized disclosures and a
building/model palette. IDs/listeners are retained. Author-view cutaway affects
visible/pickable faces only; collision and saved rooms retain complete geometry.
Prop placements are normal model events using shared assets; they do not create
whole-mesh interaction targets. Supplied GLBs load/decode on explicit selection.

Local-lighting owns validation, active-source budgets and bounded static samples.
The GPU room backend interpolates actual world points; CPU models use vertex
samples; sprites receive independent tint. HUD assets outside the world canvas
remain unaffected. Room volume shadows cover at most 32 boxes and active lights
at most eight; diagnostics expose truncated coverage. Imported mesh/terrain
shadow casting and complete outdoor terrain light rendering remain unverified or
unfinished. A projectile light derives from its live spatial position, never a
separate retained particle list; optional weapon settings are copied into shots.

### October 12, 2026: independent runtime map service
Added src/runtime-maps.js as the exported-game owner of validated maps, model bundles, compiled templates and active-cell identity. It starts the authored active cell, preserves elevated arrival coordinates, retains the existing portable save shape and does not access editor IndexedDB, create controls, append demo maps or expose template-editing operations. Scene replacement receives detached world data; unknown destinations fail before mutation and scene replacement errors restore the prior active ID. tests/runtime-maps1524.cjs verifies these ownership contracts with DOM/storage unavailable. Integration into shared app startup and independently generated game-package acceptance remain unfinished; this module is not yet wired into index.html or app.js.

October 12 runtime integration checkpoint: index.html now loads runtime-maps.js and app.js selects its factory only for FRONTIER_RUNTIME_ONLY. Startup uses the exported active identity rather than requiring demo. The gameplayDefaults property matches the existing coordinator contract. Real browser runtime-start1524 acceptance verifies a distinctive exported seed, no map-library authoring controls and no F2 entry. Existing workspace authoring/undo/redo acceptance also passes. Shared workbench initialization and final authoring-free package construction remain required; this checkpoint supersedes the earlier unwired-module note without removing that history.

October 12 workbench boundary checkpoint: app.js now skips room/building/prop/light/layout, effects, normal-map authoring and terrain-tool construction in exported runtime mode. Runtime-start acceptance also replaces those eight authoring scripts with empty responses and verifies their factories are absent while actual authored-cell startup and F2 guard pass. Editor workspace acceptance still passes. Shared event/model workbenches, coordinator DOM dependencies and independently constructed export packages remain to be separated and verified.

October 12 event-workbench boundary checkpoint: runtime startup now skips FrontierEditor.create and authoring-only hub buttons/context bindings. Hub gameplay inventory, storage, dropped-item cleanup and transfer behavior remain initialized. Runtime-start acceptance omits editor.js, editor-workbench.js and event-context.js in addition to the prior eight workbenches and verifies all corresponding namespaces remain absent. Active-scene replacement now treats editor selection as optional. Final generated package construction, gameplay save/load/transfer acceptance and remaining model workbench dependencies are not certified by this startup-only test.

October 12 generated-entry checkpoint: src/runtime-export.js now validates portable project data and produces runtime HTML with eleven proven editor-only script tags removed. It embeds runtime startup data before engine scripts and escapes HTML-sensitive characters and Unicode line separators. Browser runtime-start1524 now writes and opens the actual generated entry, verifies authored seed and absent workbench factories, and removes its uniquely named fixture file afterward. A literal closing-script sequence in the authored map name remains data and does not break startup. This replaces simulated omission evidence with a generated entry test; complete asset closure, runtime-only DOM, remaining shared sources, native export acceptance and distributable archive construction remain unfinished.

October 12 generated-runtime interaction checkpoint: browser runtime-start1524 now exercises Escape pause, Options, highest-resolution Smooth preferences, selected hand cursor, production gameplay-save Blob and validated file load, pause retention after loading, Resume and inventory open/close in the generated entry without eleven authoring modules. It checks the save contains only its single authored fixture map and correct active identity, and that loading does not create map authoring controls. This does not certify native exported gameplay, transitions, downloads reaching user-selected storage, full asset closure or removal of remaining shared authoring controls.

October 12 runtime transfer checkpoint: generated-entry acceptance now uses two authored cells with unique numeric identities, clear named arrivals and actual interact-event transferMap commands. It drives the production event interpreter, observes the real rendered scene change, verifies a gameplay variable survives transfer, waits the production return cooldown and returns through the destination event. The fixture still covers pause/options, two-cell portable save/load and inventory without eleven authoring modules. This supersedes the single-cell fixture scope in the prior checkpoint; native transfer/export, rendered door cinematics, full cell-state semantics and final archive acceptance remain unverified.

October 12 runtime transaction checkpoint: shared app.mutate now explicitly rejects runtime-only authoring before executing callbacks, copying undo state or restarting scenes. Generated-entry acceptance invokes a remaining fog-control handler and verifies unchanged authored fog plus explicit rejection. Gameplay save/load, inventory and two-way event-driven travel still pass. This defense is not a substitute for physically removing remaining authoring DOM/source from final exported games; that deliverable remains unfinished.

October 12 live runtime chrome removal: engine-workspace removes the editor header, sidebar and footer before rendering runtime presentation, preserving only the attached hidden gameplay load input. No workspace bar or asset palette is constructed. Existing cursor preference references are retained privately for pause options; music-picker authoring refresh is skipped during runtime scene restoration. Generated-entry acceptance checks absent authoring DOM plus options, save/load, inventory and two-way travel with no page exceptions. This supersedes the earlier hidden-chrome runtime presentation; original editor behavior/history remains intact. The generated source HTML still contains shared bootstrap control markup before startup removal, and final source/asset packaging and actual Windows exported-game acceptance remain unfinished.

October 12 runtime source manifest checkpoint: generated entry now omits fifteen proven authoring sources, adding model library UI, spatial draft/gizmo and event-command editor to the earlier eleven. Actual generated-entry startup and gameplay interaction/return-travel acceptance passes with those namespaces absent. Generator returns exact retained relative script paths and rejects unsafe script paths; this is a source dependency seed, explicitly not full texture/audio/CSS asset closure. Package collector, final native exported-game acceptance and full iteration delivery remain unfinished.

October 12 interim package builder: tools/runtime-package.cjs copies the generated entry's retained scripts, linked root styles and core img/audio/fonts banks into a fresh directory, records a manifest and preserves source comments and binary bytes. It refuses existing destinations, symlinks, unsafe relative paths, omitted-script inclusion and missing files before creation. tests/runtime-package1524 verifies these contracts with an isolated temporary fixture. Core banks are conservatively retained; external authored resources and optimal asset pruning remain unresolved. A real engine package has not yet been constructed or accepted by this unit test.

October 12 standalone browser folder checkpoint: constructed work/runtime-export1524-resource-repaired outside engine source. Generated-runtime interaction acceptance passes from that actual folder, with fifteen authoring files absent and live editor chrome removed. Request audit exposed a hidden muzzle-calibration iframe loading a missing authoring page; generated entry now uses about:blank for that unused iframe. Request acceptance rejects unresolved failures; intentional music cancellation is accepted only for ERR_ABORTED with a verified existing local file. Core banks remain conservative, arbitrary authored-resource closure/pruning is unfinished, and these fixture browser results do not certify native exports or final release packages. Earlier interim folders are preserved.

October 12 actual Windows export checkpoint: prepared isolated work/native-runtime1524 using preserved installed runtime libraries and the accepted standalone browser export, with a separate diagnostic profile/loopback port. Launched its executable on the user's desktop. tests/native/runtime1524 passes gameplay-only DOM, F2 authoring guard, Escape pause/options, High Smooth preferences, selected glove cursor, production save/load with pause retention and inventory. Screenshot and scoped evidence are in test-artifacts/native-runtime1524.*. This is a diagnostic fixture, not a release; export performance, native two-way travel/cinematics, custom-resource closure/pruning and full iteration authoring/collision/effects/release gates remain unfinished.

October 12 native exported travel checkpoint: tests/native/runtime1524 now reloads the isolated desktop export, observes its real renderer, activates authored transfer events through the production interpreter and verifies nativeTravelProof=19 survives both departure and return. It also repeats gameplay-only DOM/F2, pause/options, save/load and inventory checks. Draw wrapping is restored in finally after failures as well as successes. New screenshot/evidence uses native-runtime-travel1524.* so the earlier startup evidence remains separate. This fixture covers immediate cell changes, not animated door transition performance, arbitrary exported projects or final iteration acceptance.

October 12 real grid workflow checkpoint: tests/browser/layout1524 authors a nine-tile rectangle through pointer input, erases its centre, adds an outer south doorway, applies once, validates the exact production export and verifies hole/floor support plus doorway geometry and inside approach. It exercises one-step Undo/Redo, actual world-file import, waits for IndexedDB save completion, reloads the app and reselects the saved map through visible workspace controls. Layout cells/door metadata survive exactly. Perimeter openings do not grant invisible walkable floor outside the cell; mesh clearance and floor policy are checked separately. Native grid workflow, elevated/stacked stairs and full editor acceptance remain unfinished.

October 12 raised-layout arrival repair: previous Apply only relocated arrivals when the spawn lost horizontal support, leaving existing supported spawn/entrance Z below a newly elevated floor and failing to repair an invalid entrance when spawn remained valid. roomLayout.synchronizeArrivals now checks each point independently, relocates unsupported points to the recovered spawn/first tile and selects height from actual generated floor geometry, including retained manual floor offsets. Supported independent floors preserve their arrival heights; walls/ceilings never supply arrival Z. Real editor regression raises the existing grid two metres, verifies unchanged spawn X/Y and Z=2 for spawn/entrances, then imports and reloads that elevated layout. Browser grid workflow, pure layout suite and comment coverage pass. Native elevated arrival/stair acceptance remains pending.

October 12 arrival ownership edge cases: tests/layout-arrivals1524 verifies invalid entrance recovery with a valid spawn, actual manually shifted floor tops, exclusion of ceilings, unchanged independent platform height/facing, empty-layout nonmutation and recovery onto an independent valid spawn. Existing building shell/connector/stair/headroom/persistence tests also pass. Added an explicit current grid authoring walkthrough without replacing earlier guide history. Native elevated-room and assembled stair acceptance remain unfinished.

October 12 independent floor support repair: standalone box floors and square shell floors previously lacked moduleType role metadata, so layout-mode walkability ignored them even though their geometry rendered and had collision. building-editor now records explicit piece roles and buildingKit.shell records floor/wall/ceiling roles. Runtime retains the actual support union; wall/ceiling geometry is not classified as floor. Real layout browser acceptance places an independent landing outside the painted cells and verifies production walkability after validation. Existing shell/stair/landing/headroom tests and function comments pass. Complete assembled staircase editor/native traversal remains pending.

October 12 stair landing connector repair: old generic face-centre anchors put horizontal floor connectors at slab mid-height and stair connectors at column mid-height. Walking-surface joins now use floor tops and each stair's uphill tread/downhill previous-tread level, with explicit stepRise and world stairDirection metadata persisted through export. Wall connectors retain historical centres. Pure upper/lower landing snap checks pass. Actual browser editor authors twelve steps and snaps an upper floor from a nearby preview, then validates ascent through production step queries and same-height landing support/clearance. The step query intentionally returns null for level travel; level landing uses support rather than inventing a stair rise. Live keyboard-driven traversal and native assembled-stair acceptance remain unfinished.

October 12 live browser stair traversal checkpoint: layout1524 now authors and snaps both landings plus a twelve-step flight through UI, imports its authored lower-landing spawn, enters playtest, focuses the game view and uses real W/S/E key events. It verifies live ascent to Z=4.4 without body penetration, jumping and grounded landing on the upper floor, then descent and grounded recovery at Z=2. No player teleport/velocity/height adjustment is used during movement; only the diagnostic camera is oriented along the flight. Button focus intentionally filters ordinary gameplay keys, so the test focuses the view before locomotion. This strengthens prior support-query evidence but is browser acceptance; actual Windows assembled-stair traversal and renderer/sprite clipping cases remain unfinished.

October 12 actual Windows grid/stair checkpoint: verified old test windows closed, refreshed only the isolated editor diagnostic's building/layout sources and enabled muteAudio before launch. Native adapter now accepts layout1524 and reruns the same real UI/persistence/keyboard assertions against the desktop-launched Electron window. It passes rectangle/erase/door, hole/approach support, raised arrivals, world import, IndexedDB reload, independent floor, twelve-step flight with snapped landings, live W ascent, E jump/landing and S descent. Source fixture assertions execute in the actual Windows renderer; no hidden browser is launched. Completed test window closed afterward. Diagnostic-only audio muting does not affect releases or explicit audio checks. Native visual sprite/camera clipping acceptance, full performance matrices and remaining iteration gates remain unfinished.

October 12 preserved clipping guards with new workspace: high-resolution Smooth occlusion1522 passes room-geometry camera rays/player reach and model occlusion. Updated only guards1518's project/fullscreen control navigation to the visible authoring workspace, retaining its collision expectations and earlier comments. Its forty geometry camera sweeps pass (23 retractions), as do HUD pause/Save/Load, closed-door body sweep, fullscreen fallback, transparent literal-art hitboxes and Exit Fullscreen. These results do not prove the user's visual billboard-versus-wall/door contact cases are repaired; that acceptance remains explicitly unfinished under locked 0.15.17 presentation.

October 12 visual contact reproduction and provisional depth repair: sprite-contact1524 imports an isolated thin-wall world through actual coordinator startup and records production masks/screenshots at three camera pitches. Downward contact showed most body pixels occluded despite clear physical body. Added contact-only visibility depth derived from actor horizontal position and camera ray rows. Sprite image rectangle/frame/scale/tilt/anchor are unchanged; ordinary scalar depth remains away from contact and for orthographic/level views. Support surfaces do not activate primitive contact; mesh contact reuses collision queries with diagnostics restored. The clean downward screenshot now shows the full body in front of the wall. This is provisional evidence, not full clipping acceptance: silhouettes/side walls, doors/models, ground support, numerical regressions and actual Windows performance still require testing. Earlier constant-plane rationale is retained as historical behavior, with this dated contact-only exception explicitly superseding it.


## October 13, 2026 - contact-depth verification checkpoint

Contact row depths now use a reused double-precision row buffer. Each screen row is evaluated once rather than once per overlapping pixel column. 450 visibility-mask comparisons against the preserved 0.15.23 implementation match exactly; the buffer is reused after sizing. This does not change sprite tilt, proportions, frames or image rectangles.

The isolated browser diagnostic now records front, opposite-side and wall-end contact at three pitches. Camera collision retracts sharply in the latter cases, so those images are observations, not an occlusion acceptance certificate. Imported doors, broader contact cases and current Windows performance remain required before accepting this correction.


October 13, 2026: stair connector correction. Direct yaw edits now rotate the stored baseline ascent direction with the connector normals. Lower landing edges retain the preceding tread elevation after rotation; querying connectors does not mutate saved stair metadata. Quarter-turn and arbitrary-yaw contracts pass. This supersedes the October 12 assumption that stored ascent direction was already current world direction after direct edits. Rotating a whole flight as a group remains a separate editor acceptance requirement.


October 13 presentation guard: nine browser contact scenarios compare the actual production sprite image rectangles using corrected visibility depth versus the historical scalar for the identical frame and camera. All rectangles match exactly. The override is fixture-only and always restored. This proves unchanged projected bounds, not every atlas-frame selection/proportion detail; complete visual clipping acceptance remains pending. The native diagnostic also recorded the three-position/three-pitch contact matrix in native-sprite-contact1524.json.


## October 13, 2026 - user-facing Windows game export

Map library now provides Export playable game folder in the native editor. It validates a project snapshot, generates a runtime entry, then opens the native parent-folder chooser. Main-process source/script/style ownership checks precede the chooser. Destination paths come only from that chooser; a fresh dated child folder uses exclusive writes. Existing exports/releases remain unchanged. Missing source resources are rejected before folder creation; only genuinely created partial folders are reported as incomplete. Browser authoring retains project backup export and explains that native folder export is Windows-only at this checkpoint.

The actual button/chooser created an isolated export (native-export-ui1524.json). The exact output passed independent browser startup and a desktop-launched muted Windows wrapper: gameplay-only DOM, F2 guard, resolution/filter/hand options, inventory and requested resource closure. Raw native evidence is native-desktop-export-ui-game1524.json. The restarted diagnostic selected the contact-test map, so this is not yet the furnished-cell export acceptance case. The first chooser run correctly caught a stale diagnostic's missing runtime-maps.js; the diagnostic source was refreshed consistently and the repeated export passed.

Core image/audio/font banks remain conservatively included. Arbitrary external authored asset closure, pruning, complete authoring source/markup removal and final Windows/Mac release packaging remain unfinished. This export action is working acceptance progress, not a final release certificate.


October 13: outdoor terrain now has an optional batched radius-lighting shader. The existing screen positions, affine texture UVs, painter order and CPU depth submission are unchanged. An additional XYZ/depth plus inverse-depth attribute reconstructs perspective-correct world positions solely for illumination. One shader/mesh shares the terrain geometry at its existing capacity; growth retires the lighting mesh/shader before the existing geometry owner destroys all buffers. Disabled lighting retains the historical mesh. Eight lights and 32 room-volume blockers remain the shader limits; imported geometry and terrain shadows remain unsupported. Actual Pixi pixel tests cover ambient, radius, box/round blockers, stepped brightness, unequal-depth affine UV preservation and buffer retirement. Real outdoor/native performance acceptance is next.


October 13 outdoor CPU repair: coarse native timing identified terrain preparation/shared depth at approximately 21 ms of the 23 ms scene draw, with 21,056 triangles; batching itself was about 2 ms. Terrain now retains one exact sorted view packet per drawing context only while world/projector identity, camera, viewport, terrain parameters/revision, seed/spawn and edit-record identity remain unchanged. Mutable lighting/textures still update every draw, and shared depth is cleared/resubmitted for model/sprite interoperability. Changed inputs rebuild historical geometry. XYZ vertex rows now provide identical UV X/Y without three copied arrays per triangle. Depth scan conversion uses scalar expanded vertices instead of allocating three point objects, preserving arithmetic order. Exact depth (2,400 cases), near clipping (500 cases) and cached-depth/invalidation contracts pass. Moving-camera Windows acceptance remains required; idle cache results alone cannot certify movement performance.


October 13: superseded movement-only callback explanations retained verbatim. The current applyHandle service covers move, yaw and resize previews/commits.

@function buildingEditor.dragDelta - Inputs: world-axis unit component. Returns captured drag distance in metres; group/space remain owned by pointer-down.
@function buildingEditor.previewDelta - Inputs: captured axis component. Returns draw-only movement; authored positions are unchanged until pointer-up.
@function buildingEditor.previewMember - Inputs: selected part. Returns translated draw-only clone with unchanged dimensions/materials.

October 13, 2026: upright imported-model wall attachments now retain a host-local pivot and relative yaw. Moving, turning or scaling the host carries the decorative object; its own scale remains unchanged. Only independent upright hosts are supported, avoiding nested attachment cycles and unsupported tilt/shear. Missing hosts retain the last placement for author repair. Pure tests cover transformed positioning, yaw, host scaling, JSON reload and tilted-host rejection. Existing room-wall attachments and supplied-prop browser acceptance continue to pass. Actual Windows model-host click placement remains an acceptance gate.

October 13, 2026: the expanded props workflow now clicks an actual vertical face of the supplied upright bed model and commits a small decorative painting with model-parent metadata. Existing room-wall placement and portable project validation remain exercised separately. GPU lighting readback now explicitly captures the room renderer's backend, rather than whichever model/room backend was created last; the earlier ambiguous test hook is superseded. The room ambient/radius/round-blocking assertions remain unchanged and pass in the browser. Native expanded acceptance is recorded after its run, not inferred.


### October 13, 2026 — camera endpoint clearance and opaque texture cutouts

Camera boom retraction alone could stop at an eye anchor that already overlapped a thin door: the camera clearance volume is wider than the actor body. The final camera endpoint now uses actual geometry separation, with up to eight corrections and a validated prior-safe position fallback. Diagnostics disclose unresolved confined-space cases. This changes camera clearance, not the locked 0.15.17 sprite tilt, proportions or frames. Real Windows door tests verify body blocking, sprite depth and 24 camera orbit cases.

The supplied Painting_one texture contains fully transparent pixels despite its OPAQUE material declaration. Previously this sent the entire model scene through CPU color rendering. OPAQUE cutouts now retain GPU color rendering; shared CPU depth samples alpha only where needed and preserves historical UV, filtering and material-alpha arithmetic. MASK, BLEND and distance coverage retain their existing fallback behavior. Geometry collision remains independent of texture transparency.

The first native repair measurement improved highest/Smooth furnished-room throughput from about 11–13 fps to 53–64 fps across the three light cases. These are observed CPU/frame throughput results, not GPU timing or a claim of universal performance. The alpha-only refinement passed 200 exact historical depth comparisons and real GPU cutout checks; its native matrix remains in progress. Function-comment presence coverage passes at 5,231 maintained functions; semantic documentation review remains a separate delivery gate. Earlier measurements and source history are retained.

October 13, 2026: prop placement elevation offset is an editor preference (-100 to 100 metres). It adjusts the candidate world Z before metadata connector snapping and is persisted only through the resulting ordinary event height offset. The previous surface-only proposal made open tower stacking awkward because no upper floor existed to click. Negative offsets provide deliberate sinking without changing geometry or UVs. Existing placement/attachment transforms remain authoritative.


October 13, 2026 — Map-library capacity: the former 32-map cap is superseded in project validation, creation, duplication, imports, examples and recovery. No arbitrary map-count cap remains. Numeric MZ identities still use the documented 1–999999 compatibility range; project import retains its byte-size guard. Inactive map records must not be submitted to the active scene renderer. Large project serialization/storage costs remain separate from active-cell frame costs.


October 13, 2026 — Large cell libraries: removed the secondary 32-cell saved-hub-state limit as well as the authored-map cap. Preserved per-cell stack limits and recovery budgets. Cleanup now resolves policy only for its bounded records instead of cloning the whole project/model bank once per second; visited-cell IDs are cached per store and extended by the cell service. Pure tests preserve 256 visited-cell storage records across JSON Save/Load and verify eight policy lookups for an eight-record cleanup budget. A 128-cell exported browser game passes actual menus, Save/Load and two-way interpreter travel; Windows generated-game travel passed before the secondary persistence/cleanup repair and is being repeated with that repair. This is not a claim of arbitrary-size project memory or serialization performance.


October 13, 2026 — Windows large-library acceptance after persistence/cleanup repair: freshly generated 128-cell package (`work/runtime-large-1524-c`) opened in the isolated Windows desktop wrapper and passed actual gameplay-only DOM, highest Smooth options and two-way interpreter travel with independent skies/shared state. `native-cell-scale1524.json` compares identical active world: two maps 89.5 FPS, 128 maps 90.0 FPS, both p95 11.4 ms over 179 sampled animation intervals after warmup. Each case retained one decoded sky/one panorama mesh and zero full-project snapshot calls during ordinary play. This measures desktop animation intervals, not GPU time; it does not establish arbitrary large-library startup/save memory limits or performance for larger active scenes. `hub-state1517.cjs` separately validates 256 visited-cell storage records and eight-policy-lookups cleanup budget. Prior 32-map/32-cell restrictions are superseded, not retained current policy.


October 13, 2026 — Actual projectile gameplay lighting: `tests/native/projectile-lights1524.cjs` imports a simple 30-metre room, equips the shipped shotgun without changing combat parameters, and fires via actual F-key input. Across scales 1/1.5/2 and Crisp/Smooth, peak live shots = 16, active lights = 8, omitted lights = 8. Every case reaches zero shots/zero lights through normal simulation, without manual despawn. Highest Smooth records 90.2 FPS, 11.3 ms CPU p95 and 12.5 ms frame p95. These are actual desktop frame/submission measurements in the simple-room fixture, not GPU elapsed time or furnished-room performance. Furnished/native-effects matrices remain complementary evidence with their documented lower throughput. Export-copy/comment/binary closure guards and the original non-raised door/camera regression also pass after the latest changes.


October 13, 2026 — Named arrival elevation: typed rows now preserve optional Z (-100–100 metres), with blank meaning automatic floor selection. Add at player uses actual XYZ and facing. Existing explicit Z is no longer lost when reopening/applying the cell dialog; invalid explicit elevations reject before adoption. Browser/native cell controls verify saved Z3, fog and normal lighting, Undo and invalid drafts; automatic blank-Z acceptance is being extended separately. Inherited specialized test run descriptions are marked historical with accurate current contracts, rather than discarded. AUTHORING-GUIDE-0.15.24.md consolidates current instructions and explicit limits; BUILDING-AUTHORING-1524.md retains prior amendments as marked history.


October 13, 2026 — Restored editor active map: project startup formerly forced `demo` whenever that built-in record existed, even after saving/importing another active map. Startup now retains the validated saved `project.active`. Fresh projects still choose demo through their defaults. The complete prior map-library source is archived byte-for-byte in SOURCE-HISTORY/2026-10-13/map-library-before-active-restore.source-bytes, including the removed reset callback/comment. The combined browser template workflow now passes real shell construction, definition Save without event Apply, independent merchant copies/stock override, production export/import and IndexedDB reload on the imported active map. Native acceptance is running separately.


October 14, 2026 — imported-model material ownership: per-instance spatial.materials
records carry slot texture/tint and source-UV mapping, while source GLB geometry,
alpha and collision remain immutable. CPU/shared depth and GPU color consume the
same mapping; cache identity includes override and image-aspect state. Transition
preparation starts shared image loads and readiness waits under its existing cover.
The editor modal is the eighteenth omitted authoring module in gameplay exports;
the native descriptor validator enforces that same exact inventory. Project
validation checks map and reusable-template asset/slot references before adoption.
Imported item catalogs establish a new starting-value history baseline, preventing
pre-import Undo from removing definitions required by imported cells.

October 14, 2026 — comment coverage scope expands to maintained packaging/artwork
tools. Presence passes for 5,669 functions; it remains separate from semantic
review. Earlier contracts are retained beside reviewed purpose/units/ownership
explanations. Native evidence uses dated/hash-disambiguated copies when a fixture
screenshot changes; previous evidence and manifests are never overwritten.


October 14, 2026 — comment-only behavior guard: reviewed modules retain exact
pre-review bytes under SOURCE-HISTORY/2026-10-14/comment-review-baselines. The new
comment-semantics1524 check compares executable syntax trees while excluding only
source offsets/literal spelling. It caught the need to group a returned playlist
closure across added comments, preventing JavaScript automatic-semicolon insertion
from changing the return. Nine modules now match their baseline trees exactly.
The expanded presence gate passes 5,671 functions and remains distinct from the
manual purpose/units/ownership/failure review. No sprite behavior changes were made.

### October 14 - movement, recovery and picking documentation review

Reviewed source contracts now explain horizontal per-update displacement versus velocity units, fixed-camera inverse axes, proposed stair-step adoption, bounded recovery history/search and its grounded-state assumption. Model picking documents normalized world rays, rendered-triangle obstruction, sampled-terrain limits, event-range plus camera/player reach checks and deterministic zone ordering. Original contracts remain as superseded history. Executable syntax equivalence passes for 102 reviewed modules and 164 readable-format modules; input/terrain and model-event behavioral checks pass. No sprite presentation or movement behavior was changed by this review.


### October 14 - environment/display contract review

Water contracts now distinguish authored one-metre cells, sampled connected basin fill, quarter-metre shoreline geometry, identity/revision cache invalidation and bounded texture/tile caches. The old mixed-neighbour-only shoreline note is superseded by the current connected-fill implementation; retained source comments explain both history and current behavior. Underwater view classification is documented as a sampling heuristic, not fluid physics. Vector beam gaps are documented as deterministic presentation changes only. No executable changes were made; syntax equivalence and input/terrain behavior checks pass.



October 14, 2026 — source explanation review continued without behavior changes. Model texture preparation documents cached asynchronous failure and no automatic retry; reference sampling remains separate from the allocation-reusing production sampler. Actor vx/vy in behavior update are per-update displacement, not per-second velocity. Editor brush previews restore original data before entering the host Undo transaction; imported water currently embeds data URLs, superseding the retained filename-only historical note. Map-local reusable prefabs remain distinct from the project event-template bank. Gameplay/behavior dialog accept callbacks own authoring adoption; a throwing external callback is not automatically rolled back by the modal itself. Exact syntax-tree comparison passed for all protected sources.
