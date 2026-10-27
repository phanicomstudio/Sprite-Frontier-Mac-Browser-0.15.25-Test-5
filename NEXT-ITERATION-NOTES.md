# Following 0.15

Delivered: selectable fixed-camera Room Test and free-camera Geometry Ruin, floor/collision/entrance/exit editor, independent furniture sprites, connected hub travel, persistent visited-map state, relic/journal demonstration, normal-map workbench and directional normal lighting, brief-input animation, shared underwater classification and Cerebral crossfades.

Next useful milestones: layered foreground occlusion or optional depth maps; stairs/ramps and elevated walkable geometry; room lighting with colored local lights and dynamic shadows; more hub quests and interaction authoring; asset reuse across large projects. Preserve performance budgets and cached rendering as these expand.

Awaiting supplied art: Blood damage portraits, dedicated melee sheet and replacement player/armed sheets. Candy retains the single portrait. Future work also includes swimming; the current water remains an opaque animated surface with underwater screen distortion.

## Banked 2026-10-06: per-sheet barrel/aim calibration
Add an aim guide beside muzzle calibration: muzzle origin plus a second barrel-direction point, keyed by sprite sheet/profile with direction/frame overrides. Expose cursor-aim versus calibrated-barrel trajectory modes and show their distinction clearly. Crosshair placement below the visibility preference must share the actual aiming calculation; moving only its artwork is insufficient. Preserve existing projectile spread and collision sweeps. Test all equipped directional frames in perspective and fixed rooms. This feature is not part of 0.15.1.

Superseding the pivot proposal: retain whole-body sprite sheets. Fixed rooms fire along the eight sprite directions; the cursor selects the nearest pose. Third person needs per-sheet muzzle/barrel alignment and matching crosshair calibration. Multiplayer/co-op should replicate the same world-space shot, not calculate a different ray per viewer. Separate rotating arms are not requested.

0.15.3 supersedes eight-direction room shots: cursor aiming restored. Optional third-person barrel guides are now authored per sheet/frame; fixed-room firing redesign is deferred.


## October 9, 2026 — bank implemented in 0.15.17

Per-model distance overrides/sinking, hub doors/arrivals, reusable placement,
static event-item drops, containers/merchants/pawn recovery, ownership metadata,
protected cell cleanup and diagnostics are connected. RE-inspired black-space
hinged/sliding door presentation and supplied sound selections are connected.
HUB-DOOR-GUIDE.md records current scope and explicit limitations. Prior banked
notes are preserved; future item combat unification, theft consequences and
streaming/LOD remain future work rather than silently implied features.


## October 14, 2026 — banked for the next iteration: obvious tile deletion

User reports that Tile Room Editor still offers no apparent way to delete painted tiles in Test 5. Treat this as an unresolved usability requirement even though an Erase floor dropdown option exists. The user explicitly requested banking this change for the next iteration, not implementing or packaging another build now.

Required next-iteration behavior: provide a clearly visible Delete/Erase tiles action directly beside the grid, with clear active-tool feedback. Support removing individual tiles and dragging across several tiles without hunting through a dropdown. Apply must remove the corresponding authored floor/ceiling pieces and rebuild perimeter walls/door ownership consistently; Undo must restore the removed layout. Verify deletion of both unsaved draft tiles and previously applied tiles, including save/reload and an empty layout. Preserve existing painting, texture controls, source comments, history and prior releases.

Status: BANKED / pending implementation and verification. This note does not claim the issue is fixed.


## October 14, 2026 — banked: reconsider room-editor workflow before implementation

User clarified that floor erasure coupled to generated walls/ceilings is insufficient: floors, walls and ceilings need independently understandable editing/removal. The user requests banking a broader editor redesign, discussing it later, and consulting on the design first. Do not interpret this as authorization to implement or package another redesign now.

This supersedes the narrow proposed remedy in the preceding obvious-tile-deletion entry: adding a visible tile eraser alone does not resolve the user's concern. Keep that historical report, but treat the solution as undecided.

Future consultation should establish the intended room-building workflow, how tiles relate to separately editable floors/walls/ceilings, explicit selection/deletion for each surface type, and what regeneration/Apply preserves or replaces. Agree on a small concrete design/mockup and acceptance criteria before changing implementation. Preserve existing options, projects, source explanations and releases.

Status: BANKED / design consultation pending. No further implementation or packaging requested at this time.

## October 22, 2026 — upcoming release: enemy event archetypes

Status: user-authorized upcoming-release scope, added to the roster. User will provide sprites. This entry records requirements; it does not claim the implementation or architecture audit is complete. Completed projectile/arsenal/gib work is delivered separately in full 0.15.26 Windows and Mac/browser packages. Preserve those packages unchanged.

Required work:
- Audit shipped test enemies; convert standalone enemies into actual events without losing behavior, identity, authored settings or saved state. Identify architecture conflicts before implementation.
- Provide reusable enemy event archetypes for the established arsenal, with per-instance weapon, ammunition, accuracy, health, damage, movement and aggression overrides.
- Make repeated placement simple: choose an archetype, place multiple enemies and edit individual overrides.
- Allow user-selected sprites. Initially accept single-view camera-facing sprites using the locked existing billboard presentation. Prepare optional Candy-style directional animation metadata without requiring missing directions or changing sprite tilt/proportions.
- Reuse existing muzzle authoring/calibration, including support for later directional frames. Do not add a disconnected muzzle-coordinate system.
- Offer explicit respawn modes: remain dead, respawn after leaving and re-entering the cell, or respawn after an authored delay. Define timer/cell ownership and save restoration before implementation so respawns do not duplicate events, inventory, loot or kill rewards.
- Reuse event/combat, finite projectile collision, blood, gib and sprite architecture. Cream and synth are aliases for the SAME blood identity; preserve cream versus regular red particles and stains.
- Preserve existing options, source comments, history and prior releases. Document authoring and deliver a complete new iteration with full Windows/Mac browser packages.

Acceptance: verify event migration, repeated placement, instance overrides, sprite selection, firing and muzzle alignment, ammunition limits, impacts, ordinary death/overdamage gibbing, all three respawn modes, save/load and cell transitions in first-person, third-person and snapped isometric/fixed cameras. Run maintained-function comment coverage and focused behavior tests. No new Quake assets or copied GPL implementation are authorized by this addition.

Asset intake: sprites to be provided by the user. Use the existing test sprites for architecture checks when useful; do not invent required directional artwork. The separate room-editor redesign remains banked for later consultation.


## October 22, 2026 — enemy roster implemented in 0.15.27

The roster above is implemented with Chiban and Mechanical Turk, plus readable authoring and project/event font selection. See ENEMY-EVENTS-AND-FONTS-0.15.27.md. Separate room-editor consultation remains banked; earlier roster text remains history.

## October 26, 2026 — next-iteration roster: rendering direction and door authoring

Status: BANKED / analysis and requirements only; no renderer or gameplay behavior changed by this entry.

Source: ChatGPT chat "Alisa Rendering Techniques" (6adfa8e0-cf84-83e8-905c-2a37367d2ef0), read October 26. Five turns were available. Several assistant replies were content-reference placeholders; one detailed visual analysis and all five user messages were readable. The reader listed ten screenshot paths out of fifteen images mentioned in messages. Screenshot (11123) was inspected directly: a StarCraft Terran cinematic with strong red/green accents, warm practical light, deep shadows and softened imagery. Do not claim all reference images or hidden replies were reviewed, or that the analysis verifies Alisa's actual rendering implementation.

### Rendering: default legacy real-time appearance with normal maps

Explicit user decisions: target Alisa's gameplay environments and cutscene appearance, StarCraft 1 cinematics, and Castlevania 64 menus/house sequence; use legacy real-time rendering WITH normal-map additions; Blender 2.5b is a stylistic touchstone. Make this the standard appearance without requiring manual setup, while allowing overrides. This does not require installing or embedding obsolete Blender.

Translate the direction into an integrated default material/lighting profile: rich diffuse textures, simple broad specular highlights, restrained reflections, staged colored key/fill lighting, selective darkness and modest image softness. Preserve normal-map sprite lighting and the existing Sprite Fusion workflow. Avoid making modern metallic/roughness materials a prerequisite. Fog, beams, glow, grading and resolution treatment are candidate supporting techniques to evaluate against references and performance, not individually confirmed new subsystems. Do not replace real-time gameplay with mandatory offline background renders; retain existing prerendered/fixed, isometric and 3D spaces.

Apply defaults automatically to new content and unconfigured materials/maps. Preserve explicit authored lighting, textures, normal strength and presentation settings on existing projects; offer an undoable apply-profile operation rather than silently overwriting them. Expose readable controls under Environment/material inspection with optional advanced settings. Maintain locked 0.15.17 sprite tilt, proportions, frame/muzzle alignment and camera behavior. Gothic menu art direction concerns in-game presentation; the editor retains its readable system font and existing user font choices.

Implementation assessment must distinguish missing engine features from settings already supported, check renderer/export compatibility and light/post-processing budgets, then define measurable defaults. Validate the same original test room in perspective, fixed and isometric views, with and without normal maps; verify actor/background coherence, useful dark-area visibility, text/HUD readability, save/reload, overrides and Windows/Mac browser exports. Suggested visual benchmarks: ornate warm interior, colored industrial corridor, and gothic gameplay menu. Reference artwork is inspiration, not licensed shipping assets. This roster item is not a promise that any filter can recreate detailed reference art automatically.

### Paired doors: automatic destination arrival (explicit October 26 request)

Default two-way links target a named reciprocating destination door, not hand-entered arrival coordinates. Place the player about one foot (0.3048 metres) in front of that door on its authored walkable exit side, facing away. Example: leaving the saloon arrives outside its entrance facing the street. Preserve advanced explicit arrival overrides. Resolve orientation from destination-door facing, check collision/clearance and floor elevation, and suppress immediate bounce-back. If a safe arrival cannot be found, report it rather than silently placing inside geometry. Validate both directions, rotated doors, camera modes, save/load and existing transition styles. Do not imply multiplayer/party support exists; apply to supported transferred actors without overlap when applicable.

### Shared move/rotate controls (explicit October 26 request)

Keep current free dragging and add Blender-style X/Y/Z axis movement handles and a Move/Rotate option for existing/new doors, events, props and other supported scene objects. Reuse shared selection and transforms; expose grid/angle snapping and numeric properties, with one history transaction per completed manipulation. Door rotation updates automatic arrival facing/offset consistently. Distinguish editing world axes from camera/screen axes and retain locked sprite billboarding; a facing override must not change sprite presentation.

## October 26, 2026 — 0.16.3 roster implementation

The preceding October 26 banked requirements now have a source implementation described in ITERATION-0.16.3.md. Later user steering adds default darkness rather than a general geometry-shadow overhaul; subtle Diablo-style player-light falloff; Dusty Plum distance fog; stronger adjustable sky saturation; outdoor-only sprite sun silhouettes; receiver deformation over terrain and geometry; and explicit performance budgets. The active sun path uses receiver-conforming meshes, superseding the initial ground-plane prototype. No Daggerfall/Diablo/Alisa assets or implementation were copied. This entry does not claim a full scene shadow mapper or released native packages.

## October 26, 2026 — BANKED: camera/input parity and cursor-directed snapped combat

Status: user explicitly requests banking for the next iteration. No implementation or packaging is authorized by this entry.

User report: in the current isometric playtest, mouse input has no useful effect, so snapped combat with slight cursor magnetism is not functioning; zoom also appears inert. Treat this as an unresolved interaction regression despite earlier helper-level and launch tests passing. The established 3D/third-person experience is the parity benchmark across supported view types.

Required behavior:
- WASD controls player movement. Shooting aims toward the mouse/cursor direction, then snaps to the nearest supported firing angle. Movement must not override cursor-directed firing while the player is moving. This supersedes the 0.16.2 movement-priority aiming rule during shooting; retain its historical rationale and existing supported angle set unless separately changed.
- Keep slight, bounded cursor/target magnetism, with visible-target/obstruction rules. It must assist aiming without replacing cursor control or making physical projectiles home around geometry. Preserve the accuracy/spread variable and swept projectile collision.
- Make mouse aim usable in isometric and fixed views, with correct screen-to-world mapping at all supported zoom levels. Check cursor visibility/aim feedback and pointer-capture behavior in actual playtest, including moving and firing together.
- Restore effective zoom input in isometric mode and consistent zoom behavior across supported cameras. Orthographic projection needs a real visible scale response; matching perspective controls must not leave the view unchanged. Keep aim projection, UI scaling, sprite proportions/locked billboard presentation and muzzle alignment correct after zooming.
- Audit first-person, third-person, snapped isometric and fixed-camera controls together, using working 3D/third-person behavior as the benchmark while respecting each camera's presentation. Preserve existing options and make any unavoidable camera-specific difference explicit.

Acceptance: exercise real mouse movement/position, shooting, WASD+shooting and zoom inputs in the shipped Windows app and browser build, in windowed/fullscreen and supported display ratios. Verify firing direction, snap-angle choice, subtle magnetism, wall obstruction and projectile impact after zoom, plus correct movement and muzzle alignment. Helper calculations and programmatically launched projectiles alone are insufficient evidence of usable mouse/zoom controls. Preserve high performance and run relevant camera/input/combat regressions and maintained-function comment coverage when implemented.

### October 26, 2026 — BANKED: Dusty Plum fog must not cover the sky

User reports that plum fog covers the sky, especially noticeably in vector mode. Treat this as an unresolved atmosphere/rendering regression in the next iteration, alongside mouse/zoom parity. Dusty Plum is distance fog for world geometry, not a global color wash over the sky or panorama. Skyboxes/procedural sky must retain their authored colors, saturation and contrast. Audit vector/phosphor/outline and textured presentation separately, including background clears, sky layer fog state and post-processing; the cause has not yet been established. Verify an obvious distant-geometry fog gradient while the sky remains unaffected across camera types, zoom, display ratios and local/runtime exports. Preserve existing map overrides and high performance. Banked only; no rendering changes made by this note.


## October 26, 2026 - 0.16.4 implementation of banked input/sky work

The user subsequently authorized the next iteration in Git plus a local PC version only. The two preceding BANKED entries are historical intake, not the current status. See ITERATION-0.16.4.md and RELEASE-VALIDATION-0.16.4.json for implementation and measured delivery gates. Existing sprite presentation, weapon spread, collision and authoring systems remain in place.


## October 26, 2026 - 0.16.5 door return-side correction

User reported a DOOM-transition return spawning behind the original entrance, facing the wrong way. All paired-door transition styles now retain the successful approach side and align outward actor/camera/cursor facing. This supersedes unconditional authored-front return placement from 0.16.3/0.16.4. See ITERATION-0.16.5.md for persistence, blocked arrivals and validation.


## October 26, 2026 - 0.16.6 readability and jump-contact follow-up

User supplied a door close-up and a preferred camera-distance reference (about five feet/five W taps), requested isometric zoom parity with normal third-person, and requested a subtle shrinking/growing ground contact blob for jump feedback. Five-foot minimum plus bounded same-side camera-safe placement supersedes the prior one-foot default; transient isometric zoom reaches 200 px/m with framing; pooled receiver-conforming contact blobs supply jump feedback. See ITERATION-0.16.6.md. First-person zoom remains disabled.
