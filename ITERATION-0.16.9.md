# Sprite Frontier 0.16.9 — actionable authoring and isometric visibility

October 29, 2026. Based on 0.16.8. Historical notes remain intact. This release completes the current correction slice of the incremental editor migration; it does not claim the entire earlier editor-design roadmap is finished. See FEATURE-STATUS-0.16.9.md for the explicit gap assessment.

## Everyday authoring

- Build has direct Wall, Floor, Ceiling, Stairs, Block, Prefab/model and individual terrain actions. Selecting a brush also activates painting. Drag on outdoor ground; the ring shows its area. Each drag is one Undo operation. Geometry/fixed-artwork interiors report that terrain is inapplicable.
- Construction uses the existing validated preview/placement owner. Pick a material thumbnail or import a seamless texture, then click the scene. Precise coordinates, less common shapes and optional previews remain accessible. Model materials remain in their asset-library slots.
- Select structural geometry to edit dimensions, position, rotation and material in the Inspector. Existing handles retain their world axes and snapping. Leaving a tool cancels its transient placement, retaining numeric drafts.
- Plan or Plan + scene shows a shared schematic when no specialized floor-plan tool is active. Click selects; Shift-click toggles; drag moves the shared selection with configurable snap. Delete selected and Undo operate on actual scene objects. Draw room and Background room retain detailed floor/artwork plans. No new scene data owner is created.
- Build > Isometric layout lets you compose with the actual placement tools. Rotation and tilt are in degrees, size in pixels/metre. Preview does not change the map camera until Use this camera for the map. Normal map presentation accepts tilt 15–75 degrees; fixed artwork retains its alignment tool.

## Enemies

Events > Create / edit enemies > choose a placed enemy. Health, attack-on-sight/retaliation, detection, engagement, pursuit falloff, patrol, firing cadence/pauses, aggression/cover, death animation, remains, respawn and sprite fields remain available. Choosing an event image alone does not create enemy behavior.

New pistol archetypes use 24 HP rather than 60 (six default four-damage pistol impacts). Existing authored/saved health remains unchanged. The newly generated wilderness fixture attacks on sight; existing saved retaliation fixtures retain that choice. Newly placed enemies inherit shared weapon damage unless Use shared weapon damage is cleared. Existing numeric enemy overrides stay explicit.

Supplied temporary Chiban/Turk profiles now use their actual two opposite views. Row zero crops and custom calibration remain intact; the matching left-facing view has its own frame crops/muzzles. No absent rotations are fabricated. A conservative migration upgrades only recognized old stock single-view calibration records; unrelated sheets remain unchanged. Locked camera-facing sprite tilt, anchoring and proportions are preserved.

## Weapon damage and sound

Events > Weapon damage and sounds lists all 16 project firearm/explosive profiles. Configure damage per projectile or pellet; explosion damage is separate. Original-default toggles remove only that override. The existing project-default history owns these edits and restarting the playtest refreshes equipped weapon clones.

Melee appears alongside them in its own current-map section, retaining the existing map-local Cerebral owner and ordinary scene Undo. Configure damage and swing sound there; reach, arc, cooldown and sprite remain under Blood / Cerebral and melee. Default melee stays silent.

Each weapon supports a supplied sound, an imported WAV/OGG/MP3, or the unchanged default sound. Imports must decode to a positive duration up to 60 seconds and be smaller than 2 MB. Embedded original bytes travel in project data and runtime exports, without a machine-specific path. Encoded per-asset/schema and aggregate project limits apply. Playback reuses the existing 24-voice SE pool; unavailable custom audio falls back to the original sound path. Player and enemy firing share that path. The old advanced editor retains imported sound assets during unrelated edits. Single-shell shotgun fallback now honors configured pellet damage; heavy-ammunition fallback retains its original half-damage rule using the configured value.

## Isometric visibility and shadows

Environment > Isometric visibility controls a soft player cutaway through 3D geometry, nearby occluded-enemy red outlines, enemy distance 0–40 metres and player-window radius 0.6–3 metres. Geometry-only depth gates the effect; terrain hills are not cut away. These effects run only during isometric gameplay, never perspective or fixed artwork. They do not change collision, cover, targeting or projectile line of sight. At most the player and twelve nearest eligible enemies use pooled overlay meshes. No world GPU readback or new texture per frame is used.

Environment > Shadow strength exposes separate outdoor sun and isometric ground-shadow multipliers (0–4). Apply affects all current project maps; new maps inherit the active values, imported maps keep authored values. Undo map operation restores only shadow fields and retains subsequent geometry edits. This intentionally remains separate from scene Undo.

Contact/blob shadows remain isometric gameplay only, default strength 1.75. Perspective keeps the outdoor sun system. NPC/enemy events have an Isometric ground shadow checkbox in creation and event editing; omitted means enabled. Existing grounded support, shrink/fade on ascent, terrain/geometry receivers and bounded caster budgets remain unchanged. Darkness/lighting is not used as a substitute for shadow opacity.

## Dithering

Environment > Dithering exposes enable, palette, preset, strength, scale and UI inclusion directly. All original parameters remain under Advanced settings. Original shader math, palettes, defaults and commands are unchanged. Fallout 2 still means the approved 231 supplied WebP swatches, not a claim of exact original game-file RGB values.

## Preservation and validation

Original comments, legacy controls, maps, assets, fixed-artwork alignment, generated overrides and history owners are retained. Scene data stays separate from playtest state. No new third-party code/game assets were introduced. Existing licenses and notices remain in the complete Windows distribution.

See TEST-REPORT-0.16.9.md for actual verification and FEATURE-STATUS-0.16.9.md for remaining architecture work. A displayed limitation is not evidence of implementation. The full historical design remains an incremental roadmap.
