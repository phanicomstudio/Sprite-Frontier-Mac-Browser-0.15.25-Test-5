# Current editor control checklist — 0.15.24

October 13, 2026. This is the current control map; dated checkpoints in
EDITOR-CONTROL-AUDIT-1524.md preserve history. Read AUTHORING-GUIDE-0.15.24.md
for workflows. Coordinates are X left/right, Y forward/back, Z elevation, in
world metres. Angles shown in degrees convert to radians where the runtime
requires them. Player options, editor view preferences and authored cell data
have separate ownership.

| Feature | Controls and saved ownership | Evidence / limits |
|---|---|---|
| Maps/cells | Map library: blank interior/flat/hills templates; create, rename, duplicate, delete, active map, project export/import | Windows map-management and template workflows; no arbitrary 32-map cap. Numeric identities and project byte guards remain. Direct linked destinations must be retargeted before deletion. |
| Room shells and pieces | Build rooms and modules: wall, floor, ceiling, doorway, block, straight stairs, shell; dimensions and elevation; proposal then confirm/cancel | Construction, stairs/landing and castle workflows. Structural geometry is the default collision. |
| Grid rooms | Room layout grid: origin, tile metres, elevation, height, thickness, floor painting/erasing, perimeter walls and ceiling, materials | Layout workflow and portable room data. Grid dimensions are independent of image repeat size. |
| Round rooms/towers | Generated round geometry and imported castle kit: radius/arc/segments, round floors/ceilings and wall rings; premade hollow sections and roofs | Round geometry and native castle stacking acceptance. Spiral staircases remain future work. |
| Geometry transforms | Scene selection and Move/Turn/Resize handles; selected numeric XYZ dimensions/positions; world/local axes, duplicate/delete | Native construction/selection acceptance and Undo. Turn uses the up axis for generated architectural pieces. |
| Model transforms | Models and wall decorations → Edit placed models: selection, numeric XYZ position/rotation/scale and direct handles | Native supplied furniture/model workflow. Geometry collision stays enabled unless deliberately overridden. |
| Snapping | Grid and compatible opposing connectors; toggle snapping, spacing/tolerance, placement elevation offset | Square/tower stacking and matching roof acceptance. Invalid/noncompatible joins remain explicit preview decisions. |
| Materials | Role thumbnails, local image import/assignment, repeat size, aspect preservation, UV offset/rotation, fit mode | Native layout/material workflow. Mapping changes do not resize geometry. October 13: supersedes the earlier unsupported slot-replacement note. Imported-model slots support per-instance image/tint, UV repeat/aspect/offset/rotation and inheritance reset. Mapping requires UVs on every primitive in the affected slot; source GLB geometry is unchanged. |
| Decoration/attachment | Model surface placement, wall-mounted painting, parent/local transform, detach; decorative windows use imported models | Native room-wall and upright imported-host attachment tests. Tilted/nested imported hosts reject; separate 2D sticker tool is not exposed. |
| Collision | Default structural mesh/primitive collision; authored overrides and diagnostic views; interaction zones separate | Thin door, raised support/corner, camera volume, stair/jump/landing tests. Texture transparency does not disable physical geometry. |
| Door/transfer events | Event placement; invisible interaction/trigger zone dimensions and local transforms; destination/arrival, activation/reach | Door and cell controls, two-way runtime travel. Physical collision and click zones are distinct. |
| Door transitions | Style selection, door/frame composition, paired hinge or slide leaves, direction, speed, open/close sounds, black hold | Native transfer matrix and normal-tempo cycles. Cursor/input remain blocked during cinematic; no skip action. |
| Templates | Save event definition and place independent instances with overrides; template Undo/Redo | Windows source/copy stock 7/3/7, export/import and reload. Instance identity remains independent. |
| Atmosphere/arrivals | Cell settings: fog, normal-map lighting, arrivals XYZ/facing, dropped-item policy and protected cells | Typed cell control tests. Blank arrival Z means automatic support selection. |
| Sky/distant scenery | Sky and distant scenery: enabled panorama, per-map asset, orientation/wrap blending; cloud/ridge layer fields | Independent native skies through exported travel; lazy bounded image/GPU resources. Original images and superseded candidates retained. |
| Local lighting | Local lighting: cell ambient, bounded placed sources, radius/color/intensity, player/projectile source selection, attachment and influence view | Native room/terrain pixels, actual projectile lifetimes and six-quality gameplay test. Up to 8 evaluated lights, 128 authored sources; limited primitive blockers, no imported-mesh/terrain shadow casting. |
| Native effects | Weather/liquid/effect parameter editor, emitter Enabled/XYZ/rates, breathing controls and color-pool parameters/notes | Native effects matrix, disabled-emitter and breathing persistence tests. Map ColorPoolPlayer/ColorPoolFollowers opt-in; events use ColorPool. |
| Items | Starting gameplay values → Item definitions: ID/name/whole-gold price, sprite/profile/model, cleanup protection; Advanced properties | Browser and Windows controls; project catalog, import remapping/conflict protection and exported Save/Load/travel. Static drops retain current native 0.2 model scale. |
| Containers/shops/ownership | Typed starting-stock rows, quantity, public/player/NPC ownership, protection; merchant/container/pawn-shop event options | Native stock validation; compact runtime storage is separate from initial authored stock. |
| NPC/gameplay values | Event pages/conditions/behavior/combat notes; Starting gameplay values for gold, skills, reputation, factions, quests and party IDs | Existing event/gameplay tests and production validation. Specialized combat notes remain advanced. |
| Weapons | Starting gameplay values → Native weapon parameters: per-profile overrides, damage/ammo/ballistics/cadence/pattern/audio; per-map spread separately | Browser and Windows controls; units/aliases; real F-key kill uses configured damage. Profile families remain native, not user-defined executable code. |
| HUD kill feed | Starting gameplay values → HUD kill feed: inherited/Enabled, general pool, per-profile messages and placeholders | Browser and Windows real kill shows customized message in existing HUD device. Import retains host HUD preferences. |
| Diagnostics | Cell diagnostics, model-library counts/memory, local-light diagnostics/influence, collision/debug views, performance evidence | Counts reflect their documented active/resource scope; decoded/GPU byte estimates are not measured driver allocation. No expensive frame logging added. |
| Undo/persistence | Existing edit transactions; separate map/template history, previews, status, local save; portable project export/import | Native complete authoring workflows and active-cell reload repair. Starting-value Apply restarts playtest; its dialog Cancel abandons the draft. |
| Player menus/display | Literal menu art and transparent hit boundaries; selected hand, master volume, Get Unstuck, render resolution/filtering, explicit fullscreen exit | Native pause/fullscreen/focused Escape/Save/Load acceptance. Locked 0.15.17 sprite presentation is unchanged. |
| Engine/runtime separation | Editor asset/scene/properties layout; Playtest/Return to editor; exported gameplay-only DOM and blocked authoring shortcuts | Actual Windows folder export and independent exported-game startup/resource closure. Shared runtime modules retain required validation; core asset banks remain conservative. |

The checklist identifies supported controls and explicit limitations rather than
claiming every imaginable setting. The historical audit retains earlier pending
states; newer dated acceptance supersedes those specific states. Complete
release-package acceptance and semantic source review remain final delivery
gates at the time this checklist was written.
