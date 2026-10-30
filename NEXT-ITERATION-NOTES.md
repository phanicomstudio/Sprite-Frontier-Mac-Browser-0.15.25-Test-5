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


October 26 follow-up: fullscreen remains available for editor playtesting. The original control is promoted to the main toolbar, retaining its handler and pause exit; native/browser fullscreen UI acceptance passes.

## October 28, 2026 - BANKED: enemy authoring and automatic silhouette cover

Status: next-iteration requirements only; no runtime behavior changed by this entry.

Enemy authoring: expose Health, weapon/ammunition/spread, patrol, engagement range, pursuit cutoff, spawn leash, stopping distance, burst/pause, cover chance and respawn settings directly from an enemy's Event Editor/selection. Preserve existing Enemy events panel and event pages while consolidating access. Make creating an enemy from scratch explicit: choose enemy archetype, sprite and behavior, then place an actual event. Selecting an image alone must not imply enemy configuration.

Add optional death-animation sprite and remains sprite selectors, with appropriate frame/timing authoring and a clear preview. Unassigned assets must remain valid until the author supplies artwork. Integrate death animation, remains, gibbing, blood type, respawn and saved death state without conflicting visual owners. Preserve Cream/synth as one blood type and the locked sprite presentation.

Cover: static buildings, trees, props and static events should be eligible automatically; a special Static cover event must not be required. Explicit user clarification: use visible opaque sprite pixels as literal cover, with transparent pixels allowing shots through, without requiring a manually authored collision box. For 3D buildings/models, use actual geometry. Do not treat the whole rectangular sprite image as opaque cover or change movement collision merely to provide projectile cover.

Implementation must reconcile silhouette tests with the existing camera-facing billboard, alpha/cutout appearance, calibrated frames, physical projectile swept paths and all camera modes. Test the projectile intersection against the actual displayed frame's alpha silhouette at its world-space billboard plane; holes and empty margins must remain passable. Use the same obstruction rule for enemy cover assessment and projectile impacts, including static event sprites and model geometry. Review existing depth/alpha collision architecture before implementation; do not promise pixel-volume thickness or invent invisible boxes. Cache frame masks and use bounded broad-phase candidates to keep performance high. Validate opaque hits, transparent misses, thin features, animation/frame changes, rotated views, moving shots, cover seeking, save/reload and exports. Keep enemy cover choice tied to actual protection from the attacker, rather than proximity to a tagged event alone.

### October 28, 2026 - BANKED: cursor aim assistance too weak

User reports the current shooting magnetism is so light it is imperceptible. Increase its useful, noticeable assistance and expose an understandable strength setting. Preserve mouse-directed aim and the supported firing-angle snapping; movement must not override shooting direction. Clarify during implementation whether the current weakness comes from acquisition range, correction strength or snapped-angle quantization before tuning. Assist only toward eligible visible targets near the cursor, with obstruction checks and bounded correction; retain accuracy/spread and physical projectile trajectories rather than introducing homing or shots through cover. Validate actual mouse movement and firing in isometric/fixed, third-person and first-person presentation, especially while moving, at close/far zoom and near multiple targets. Preserve performance and provide a clear off option. This is banked feedback, not an implemented tuning change.

### October 28, 2026 - UPDATED: magnetism tuning decision supersedes preceding intake

The user reassessed the existing aim assistance as good. The preceding request for noticeably stronger assistance, adjustable strength and an Off option is SUPERSEDED and must not be implemented on that basis. For the next iteration, retain the current assistance style and apply only a relative 2 percent boost (baseline strength multiplied by 1.02); do not add an Off option. Preserve the current algorithm, parameter values and behavior as a documented recoverable fallback before tuning, so the existing feel can be restored exactly. Identify the actual strength parameter against source before editing; do not interpret this as adding two percentage points or broadening acquisition/snap rules. Validate the small change across supported cameras without changing spread, obstruction rules or physical projectile behavior. Banked only; current runtime remains unchanged.

### October 28, 2026 - BANKED: aggression, free aim and muzzle flash

User reports enemies hide too much and do not feel aggressive enough; snap-to-combat feels limiting and may not be working as intended. Audit actual gameplay before claiming the snap behavior works. Provide understandable enemy behavior choices for aggression, pursuing and hiding/cover. Reuse existing engagement/pursuit/leash, burst/pause and cover settings rather than creating competing AI owners. Proposed direction: aggressive enemies actively pressure and fire; balanced enemies alternate attacks and cover; defensive enemies favor cover. Cover must not become an indefinite nonattacking state. Determine exact presets against runtime and preserve per-enemy overrides, weapon firing cadence parity and patrol/respawn behavior.

Requested aiming direction: restore 360-degree aiming with slight cursor magnetism and closest-angle snapping. Proposed interpretation to validate in implementation: continuous world-space aim/projectile direction, while the character uses its closest available directional sprite/animation frame; sprite sector availability must not limit firing direction. Preserve calibrated muzzle positions for the chosen frame, existing spread, collision and supported cameras. The prior request to constrain firing to supported angles is superseded where it conflicts with this new free-aim direction. Retain a recoverable baseline. The separately approved relative 2 percent magnetism increase and no Off option still apply unless user revises them.

Add muzzle flashes through existing muzzle calibration for player and enemy weapons to mask the abrupt visible projectile emergence at the barrel. Flash is cosmetic: do not conceal wall penetration, shift the physical projectile origin through cover, or replace real projectile simulation. Use original/generic visuals, appropriate short lifetime and weapon-dependent timing, respecting depth/occlusion and camera modes. Preserve locked sprite presentation. Validate moving and shooting, full-circle aim, nearest visual frames, muzzle alignment, weapon cadence, cover transitions and real playtest feel in isometric/fixed and perspective cameras. Requirements banked only; no gameplay or rendering changes yet.


## October 28, 2026 - 0.16.7 implementation

The preceding October 28 enemy authoring, automatic silhouette cover, revised 2% magnetism, aggression/free aim and muzzle-flash entries are now implemented in the source branch. See ITERATION-0.16.7.md for current behavior, compatibility and explicit limits; RELEASE-VALIDATION-0.16.7.json records executed checks. The earlier aggressive magnetism/Off-option suggestion remains superseded. Previous source baseline is retained for exact rollback.

## October 29, 2026 - BANKED: temporary enemy directions and combat clarity

User tested Windows 0.16.8 and requested these corrections for the next iteration. Planning only; no gameplay, assets, defaults or saved maps changed by this entry.

- Use the available left/right views in the temporary Chiban and Mechanical Turk sheets instead of forcing every facing to the first row. Current built-in profiles declare one row. Inspect the actual supplied artwork, map only available views, preserve frame proportions/anchors and locked camera-facing sprite tilt, and calibrate muzzle/flash positions for every adopted frame. Do not invent missing rotations or constrain continuous projectile aim to available sprite angles. Verify movement and aiming in perspective, first-person and isometric/fixed presentations.
- Review enemy durability against player pistol damage and make Health easy to find in the placed-enemy workflow. Current pistol archetype is 60 HP; do not silently change authored health or assume the reported durability is solely HP rather than missed impacts. Verify actual damage and saved per-enemy overrides.
- Make attack-on-sight versus retaliation explicit in enemy creation and inspection. The wilderness fixture intentionally sets hostile=false (retaliation), so its waiting to be attacked is presently authored behavior. Review the test fixture's intended aggression and communicate it clearly; preserve intentional retaliatory enemies and existing settings. Verify detection/engagement, pursuit and finite cover behavior.

Current authoring route: F2 -> Events -> Create / edit enemies -> Edit placed enemy -> Health / Aggression / Detection range -> Apply enemy changes. Preserve the equivalent Event Editor enemy-settings entry point.

## October 29, 2026 - BANKED: actionable tools and terrain activation

User reports the Terrain brush compatibility section is empty, then finds Raise terrain settings but dragging does nothing. Source inspection: authoringWorkspace.activate('terrainTools') opens/relocates the field without setting sceneTool='brush'; actual viewport painting is gated by editorTools.active(), which only accepts that separate sceneTool value. Treat visible selected tools that are not active as a workflow defect. Verify the empty compatibility shell and actual pointer routing against the shipped Windows package during implementation.

User direction: too many menus and obtuse wording; collapse everyday authoring into usable, actionable tools. Choosing a tool must activate it and expose only its relevant settings. Terrain Raise/Lower/Flatten/Smooth/Paint should be direct actions, with clear active-state feedback and a visible affected area. No second Scene tool switch or old category tab should be required. Describe interaction in ordinary language (for example, drag on the ground to raise it); show a useful explanation when the hovered surface cannot be edited. Hide irrelevant fields such as Flatten height while raising. Remove empty duplicate sections only after their real controls are migrated and verified; retain all capabilities and advanced access.

Carry the same interaction contract through object placement, movement, rotation, material painting, doors and enemy placement. One clear entry per task, one active tool, contextual settings and consistent Undo. This reinforces the approved unified editor architecture; do not add another standalone editor or another layer of menus. Banked for next iteration, not implemented in 0.16.8.

## October 29, 2026 - BANKED: shared construction materials and readable contact shadows

Construction workflow: directly choose Wall, Floor, Stairs, Block or Prefab, place by clicking/dragging in the scene, adjust with visible move/rotate/resize handles, and choose seamless material thumbnails with repeat scale. Use the same workflow inside rooms and outdoors. Selection exposes the existing object's dimensions/material immediately; advanced controls remain available without prerequisites.

User reports player shadows are too subtle. Add a project-wide shadow darkness/strength control with a clear visual preview, applying consistently across perspective 3D and isometric modes. Inspect existing sun-shadow versus contact-blob owners; keep their purposes distinguishable and do not change world lighting/darkness as a substitute for shadow opacity. Preserve outdoor-only sun behavior, terrain/geometry conformity, existing sprite presentation and high performance. Verify equivalent appearance at comparable character screen scale in both views, including jumping and landings.

Provide an NPC/enemy event option to use the same ground contact/blob shadow as the player, especially in isometric mode. Reuse the shared shadow renderer rather than introducing separate enemy effects. Expose this through actionable event creation/inspection settings, with a coherent shared default and explicit per-event override; retain existing authored values. Blob stays grounded under the actor and responds to height above the actual supporting surface, using the previously requested subtle shrink/fade on ascent and recovery approaching ground. Avoid overlapping blobs or unintended double darkness where sun and contact shadows combine. Banked only; no shadow behavior changes in current build.


## October 29, 2026 - clarified deliberate shadow split

User clarified that contact/blob shadows must remain limited to isometric gameplay. The separate outdoor sun-shadow system remains responsible for perspective 3D. This supersedes any reading of the preceding parity request as adding blobs to perspective mode. Strength controls should expose the separate systems clearly. User additionally requires preserving all deliberate architecture/presentation/gameplay splits while consolidating UI; document boundaries and flag changes before implementation.


## October 29, 2026 — 0.16.9 correction slice

Direct terrain activation, visible brush area, actionable piece placement/material import, two-view enemy metadata, discoverable HP/hostility, separate shadow strengths/event contact option, shared weapon damage/imported SFX, simple original dithering controls, isometric composition angles, real geometry cutaway/enemy contours and shared plan manipulation are implemented and covered by focused acceptance in this branch. Prior banked entries remain history; current workflow is ITERATION-0.16.9.md. FEATURE-STATUS-0.16.9.md explicitly records larger unimplemented architecture proposals. User requested completing those too; do not treat disclosure alone as implementation or mark the whole redesign finished. Preserve deliberate splits.


## October 29, 2026 — BANKED: isometric visibility, fog and zoom-aware LOD

User reports sprites/events popping out during movement when zoomed out in isometric mode. User explicitly requests banking the fix for the next iteration; do not change gameplay/rendering or rebuild the current package now.

Source assessment (not a reproduced visual acceptance result): render.js queries a fixed camera-centred +/-52 metre region and filters billboard candidates using the legacy camera-depth <45 cutoff. Zoom-out expands the visible map without expanding those limits. Isometric billboard fog uses player-relative forward depth, whereas model fog uses camera depth. Default Dusty Plum fog is 16–48 metres, so the billboard cutoff can occur before full fog coverage. Fog exists in isometric mode; this is a visibility/fog consistency issue, not evidence that fog is disabled or events are deleted.

Next-iteration requirements:
- Derive conservative isometric render candidates from the actual viewport, zoom, yaw/tilt, terrain/elevation and object bounds. Include partly visible tall/wide sprites and models rather than relying only on their origins. Avoid abrupt visible popping during movement/zoom.
- Establish a consistent documented world-distance convention for isometric sprite, model and terrain fog. Coordinate culling with the fog boundary when enabled; retain visible objects when fog is disabled. Preserve the deliberate separation of sky grading from geometry fog and fixed-artwork alignment from live geometry.
- Keep render visibility separate from actor/event simulation scheduling, collision, projectile sweeps, cover, acquisition and save state. Increasing render coverage must not wake every distant enemy or discard sleeping state.
- Evaluate zoom-aware, screen-size LOD as a companion performance measure, as suggested by the user. Prefer bounded distant animation refresh, normal-lighting updates, shadow/effect work and appropriate existing model LOD/geometry simplification where supported. LOD is not permission to hide clearly visible objects, change locked billboard tilt/proportions, degrade nearby combat or silently approximate the exact palette-dither shader. Preserve full nearby player/enemy behavior and the separate sun/isometric-contact shadow systems.
- Use hysteresis/smooth transitions so crossing LOD bands does not flicker or thrash caches. Reuse pooled/cached resources and spatial queries; avoid unbounded per-frame all-world work.

Acceptance: reproduce on Isometric Textured Wilderness; move/zoom at minimum/default/maximum scales and several yaw/tilt angles; test fog on/off and changed ranges, large/tall sprites, models, event enemies, raised terrain and map edges. Verify partial-screen visibility, stable transitions, collision/aim/AI parity and save persistence. Measure candidate counts, frame cost and cache/memory behavior on dense maps; do not assume an LOD policy improves performance without measurement. Recheck perspective/fixed modes, sky exclusion, exact dithering and maintained-function comments.

Status: BANKED / not implemented in 0.16.9. LOD policy and budgets must be chosen against measurements during the next iteration.


## October 29, 2026 - BANKED: Zimmerit crafting and starter materials

User supplied Phanicom_ZimmeritCombine.js and 24 item names. Exact names/blank descriptions are recorded in data/crafting-materials-draft.json; original plugin/provenance in docs/reference/zimmerit-combine/. CRAFTING-DESIGN.md records reviewed behavior and the requested remote button plus Recipes authoring section. No combinations or prices supplied; do not invent them or claim runtime crafting exists. Later user plans to import descriptions, potentially all items, from an MZ project; retain source project/type/ID mappings and stable native references.


## October 29, 2026 - crafting descriptions imported into draft

User supplied Items.json and is preparing an inventory screen for weapon/item selection, equipment and descriptions. Original source/provenance retained; 22/24 draft descriptions matched with source project/type/ID. Plastic Scrap and base Phaneton Condensate remain unresolved; Plastic is only a candidate. See crafting-source-import-report.json and CRAFTING-DESIGN.md. Do not silently activate source recipes/all items, normalize zero prices or redesign the inventory before the user supplies their screen direction.


## October 29, 2026 — BANKED: discoverable Item Editor and descriptions

User explicitly requests a place to define items and write/edit their descriptions in the next iteration. Provide one clear Items authoring entry, integrated with the upcoming inventory and recipe workflows, adapting the existing project item-definition owner rather than creating a parallel catalog.

Required everyday controls: create/duplicate/delete/search items; stable ID, readable name, multiline description, category, icon/image, and applicable price/equipment/use properties. Show only applicable properties; retain advanced capabilities. Item descriptions must be editable in ordinary text fields and readable from the in-game inventory. Crafting recipes and pickups must reference the same stable definitions. Do not require editing JSON or RPG Maker note tags for everyday item authoring.

Preserve existing definitions and user-written descriptions, source project/type/ID import mappings, authored/runtime inventory separation and existing save/export behavior. Preview future MZ merges and resolve conflicting descriptions explicitly; no silent overwrite or name-only deduplication. Reject or guide deletion of items referenced by recipes/events/inventories rather than leaving dangling references. Reconcile legitimate imported zero prices explicitly; never invent a price merely to satisfy the current positive-price validator. Keep all 24 starter names and the two unresolved source matches visible.

Acceptance: create an item with multiline description, edit it, reference it in a recipe/pickup, read it in inventory, and verify Undo plus save/reload/project and runtime exports. Confirm existing items and source mappings survive import/edit round trips. This is banked for the next iteration, not implemented in the current packaged release.


## October 29, 2026 - BANKED: Skill-O-Matic skill-on-target UI

User supplied A fixed housing, B underlying scrollable skill-slot strip and C draggable thumb for the right-hand groove. Assets copied byte-for-byte to img/ui/skill-o-matic with metadata/hashes. Skill labels use readable segmented LCD-style lettering. Click skill then world target; slider down scrolls to later skills. Clip B under A, synchronize hit areas/text/scroll and prevent UI click-through into weapons/world actions. See SKILL-O-MATIC-DESIGN.md. User references Fallout 1/2/Sonora behavior; exact native rules must be audited before claiming parity. Hold full runtime/inventory implementation while user supplies UI design.


Skill-O-Matic visual clarification: user provided finalized composition, preserved under docs/reference/skill-o-matic/user-final-appearance.png. Match red-orange segmented lettering/unlit segments, clipped rows and fitted slider; displayed skills are placeholders only. See SKILL-O-MATIC-DESIGN.md.


## October 29, 2026 — 0.16.10 Skill-O-Matic prototype

User authorized one working placeholder skill plus a red remote button before finishing the inventory design. Skill-O-Matic A/B/C composition, LCD TEST SCAN label, actual slider/wheel/key scrolling and safe skill-then-target routing are implemented through existing pause/HUD/reach/inspection owners. Empty rows are disabled test art, not canonical skills. No native Fallout chance/cost/progression system is claimed. Full inventory/crafting/item editor and previously banked isometric culling/fog/LOD remain pending; this prototype does not silently begin those implementations. See ITERATION-0.16.10.md and SKILL-O-MATIC-DESIGN.md.
