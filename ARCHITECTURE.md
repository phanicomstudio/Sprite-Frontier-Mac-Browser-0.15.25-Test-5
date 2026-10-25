# Phanicom Sprite Frontier — foundation assessment

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
