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
