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
