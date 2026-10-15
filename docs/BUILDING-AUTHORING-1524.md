# Building tools — preserved authoring history

October 13, 2026: current consolidated instructions are in AUTHORING-GUIDE-0.15.24.md. The baseline and dated amendments below are retained history; later dated explanations supersede earlier pending-feature statements.

Use Return to editor, then Project and view settings → New map. Choose **Blank
3D interior** and give it a separate name. A blank interior has a walkable floor
outline and an arrival, but no walls or visible room shell.

The left building palette creates walls, slabs, blocks, open doorways, straight
stairs or a complete rectangular shell. Center X/Y default to the new cell's
spawn. X is left/right, Y is forward/back and Z is up/down. Enter dimensions,
choose material and press Preview placement. The green outline is uncommitted.
Place preview creates one undo operation; Cancel preview leaves the cell alone.

A shell adds independently editable floor, four walls and ceiling. Its width
and depth describe the clear interior; walls sit just outside it. Creating a
shell in a cell already containing geometry appends its pieces and replaces the
floor outline. Use a fresh blank interior to avoid accidental duplicate shells.

Stair width, run, rise and step count define a straight flight. Step height is
rise/count, and tread depth is run/count. Quarter turns orient the flight around
Z. Choose a rise/count within the configured player step height for walking.
Leave a floor/ceiling opening and enough headroom above the stairs. Individual
step columns are ordinary primitives with actual volume, not invisible ramps.

With Select/move active, click a visible room surface. Its yellow outline and
XYZ handles identify it. Drag a handle to constrain translation to that axis.
Grid size in Interior authoring quantizes movement; zero allows free movement.
Other transforms/material values use the selected-element numeric controls.
Duplicate creates a preview rather than immediately adding another object.

For textures, repeat size is independent of geometry size. Repeat mode is for
seamless textures. Fit mode places one image on each complete face; this is useful
for authored panel art that looks doubled when tiled. Optional aspect preservation
uses the decoded image width/height. Rotation is degrees; offsets are repeats.
Apply selected element commits mapping with the normal undo transaction.

Imported model placement, wall attachments, lighting and exported-game workflow
are still being implemented. This guide will be extended with verified controls.

## October 12, 2026 - models, inspection and local lights

Show supplied furniture and building models loads choices without importing every
asset. Choose a model, floor/wall placement, scale and stand-off, then Pick
placement surface. Click actual visible geometry and confirm the green wireframe.
Wall attachments keep the wall solid and follow its edit transforms. Unconfigured
models use geometry collision automatically; turn it off for decorative art when
wanted. Existing explicit collision overrides remain preserved.

Enter room view selects a first-person author inspection camera at the saved
spawn. Cutaway near walls and ceiling is editor-only; playtest retains them.
Room-surface rotation now changes actual geometry/collision instead of exchanging
unrotated footprint dimensions. Numeric yaw is radians around engine Z.

Local lighting appears in the properties panel. Enable it for the cell, set ambient
brightness and active budget, then add a light at the current author position.
Its parameters include world XYZ, color, radius, brightness, falloff and flicker.
Attach to event changes XYZ to model-local offsets following its transform. Player
and projectile sources are opt-in and have their own parameter choices. Removed
projectiles leave no independent light emitter. Source radius outlines are editor-only.
Current shadow coverage is room volumes, bounded to 32 blockers/eight active lights;
imported triangle/terrain shadows are not implemented. CPU model lighting is vertex
sampled. Complete outdoor rendering and native Windows performance validation remain
required before release; these controls do not prove those gates are finished.

## Round geometry - October 12, 2026
The building palette now offers Round tower room, Curved wall section, Round floor and Round ceiling. Radius is the clear inner radius for walls/rooms; thickness extends outward. Segment counts are 8-64; fewer segments create more visibly polygonal rooms. Arc angles are degrees and quarter turns set arc direction. Preview shows actual inner/outer edges. Placement is one history action. Curved pieces currently do not use box connector snapping: proper curved assembly connectors are pending. Curved wall Repeat coordinates continue around the circumference; Fit covers the full authored arc once. Room light blocking still needs round-shape integration, so illuminated tower acceptance is not complete.


October 12 subsequent lighting update supersedes the pending-round-shadow statement above: round slabs/rings/arcs now block radius lights with matching CPU/GPU circular volume queries. Shadows use smooth circular edges; the visible/collision edges remain polygonal, so low segment counts show a small shadow-boundary approximation. Each round piece counts as one of 32 active shadow blockers. Native performance acceptance is still pending.


## Prefab assembly and surface placement - October 12, 2026
Show castle rooms, towers and roofs loads the separate catalog; only a chosen GLB enters the shared project library. The prefab snap checkbox/distance controls compatible anchor alignment; Shift-click bypasses for individual placement. Set additional yaw and uniform scale first. A roof bottom can match a compatible room/tower top; wall ends join their walkway anchors. Source/target size families must match. Room model floors extend 0.2m below their walking-level pivot. Imported triangles and outdoor terrain can now be picked for placement. Outdoor objects remain upright; imported-model wall placement is currently static and does not follow parent edits (room primitive wall attachments do). Native visual/performance validation remains pending.


### October 12, 2026: verified painted-room workflow and elevation

Create a map with the **Blank 3D interior** template, enter the editor, choose **Room**, and open **Room layout grid**. The top-down grid is a draft until **Apply room layout**. Choose Rectangle and drag between floor cells, or use Paint and Erase. Erasing removes real generated floor support; it does not leave an invisible ground plane.

Choose Door and click near an outside edge of an existing painted tile. Internal joins between painted tiles already stay open. A perimeter doorway supplies an opening and headroom in the wall; it does not create floor outside the room or define a cell transfer. Add the separate transfer event and destination arrival for gameplay travel.

Tile size, origin X/Y, floor elevation Z, clear room height and slab thickness use world metres. X/Y are horizontal and Z is vertical. Apply commits one undo step. Directly placed independent modules remain separate. When raising the generated floor, supported spawn and entrance points follow the actual generated floor tops. Invalid entrances are checked individually. An arrival already supported by an independent platform retains its authored height and facing.

The automated editor workflow verifies rectangle painting, a centre-hole erasure, a south doorway, one-step Undo/Redo, a two-metre floor raise, actual world-file import, local project save and app reload. After reload, use Project and view settings to select the saved map if startup has selected the historical demo. This evidence covers browser authoring; native elevated-room and staircase workflow acceptance remains pending.


October 13, 2026: stair connector correction. Direct yaw edits now rotate the stored baseline ascent direction with the connector normals. Lower landing edges retain the preceding tread elevation after rotation; querying connectors does not mutate saved stair metadata. Quarter-turn and arbitrary-yaw contracts pass. This supersedes the October 12 assumption that stored ascent direction was already current world direction after direct edits. Rotating a whole flight as a group remains a separate editor acceptance requirement.


## October 13 - export a playable browser game from Windows

Open the editor, choose Map, and expand Map library. Export all maps creates an authoring backup. Export playable game folder opens a native folder chooser: choose a parent directory and confirm Create game folder here. The editor creates a new dated child folder and reports its path. Open its index.html to play; F2 and authoring controls are unavailable. The exported game retains gameplay pause/options and inventory. Cancel leaves the project unchanged. Export errors appear in the map status; a partially created folder is identified only if it exists. Do not treat incomplete folders as usable exports.

This checkpoint includes conservative runtime asset banks. Asset pruning and arbitrary external resources are still under acceptance review; full Windows/Mac distribution packages are separate release deliverables.

## October 13, 2026 - grouped stairs and round module acceptance

A stair flight has an explicit assembly identity. Select a tread and leave Whole assembly checked to move, turn, resize or duplicate the entire flight. Ordinary walls stay independent. Move handles support world or local axes; X/Y are horizontal, Z is up. At a quarter-turn, local X follows the flight rather than world X. Turn uses the blue up-axis handle, with 30 degrees per projected metre and a configurable angular snap. Resize uses local dimensions and anchors the flight at its lowest elevation. Rise metadata scales with the geometry so stepping remains consistent. Numeric part fields still edit only the selected part.

Mixed-orientation assemblies cannot be resized with one local-axis scale without shear; the editor reports this rather than corrupting them. Round modules keep circular cross-sections when resized horizontally. Whole-flight snapping uses exposed landing connectors and does not snap to internal tread joins. Each confirmed edit is one undo transaction; duplication assigns a new assembly identity.

Standalone round floor, ceiling and wall modules now save the correct physical roles. Hollow tower walls block their perimeter while leaving the centre walkable. The browser and actual Windows editor workflow both passed room drafting, doorway creation, save/import/reload, live stair ascent/jump/landing/descent, hollow round support/ceiling collision, and assembly movement/turn/resize/duplicate/undo. The left asset palette remains available while the right Room inspector is selected. These checks supersede the earlier pending native stair/round-module acceptance statements above; prefab stacking and wider furnished-map acceptance remain separate gates.

## October 13 - material thumbnails and embedded texture import

Select a room primitive, open Texture thumbnails, and choose a supplied material visually. Apply selected element commits the choice through normal undo history. Repeat size is measured in world metres; offsets are texture repeats; rotation is degrees. Fit maps one image per face. These controls do not resize collision geometry.

Import surface texture accepts PNG, JPEG or WebP under 8 MB and up to 4096 pixels per side. Imported pixels become a draft choice. Apply embeds the data URL in that primitive so portable map/project files retain the texture without the original desktop path. On selection/reload, saved imported choices are reconstructed in the selector. Canceling the file picker leaves the draft alone; invalid images report an editor message. This is surface assignment, not yet a project-wide deduplicated material library or imported-model material-slot override. Reusing large embedded textures across many separate primitives increases serialized project size; final asset closure/deduplication remains an export acceptance requirement.

## October 13 - direct placed-model transforms

Open Models and wall decorations, then Edit placed models. Enable scene model editing, select a placed model in the list or scene, and drag a colored handle. This explicit mode owns scene clicks so a room wall behind the model cannot intercept the selection. Move supports world/local axes and metre snapping. Turn uses the world up axis, 30 degrees per projected metre, with degree snapping. Resize changes one local model scale based on the decoded geometry's actual dimension; invalid or zero-width dimensions reject clearly. These handles affect the full model event, not individual GLB mesh nodes.

Completed drags, duplication and deletion use the shared validated Undo history. Preview drags do not change saved geometry. Attached decorations rebase their host-local position/rotation when manually adjusted, so the next synchronization preserves the edit. Shared model assets remain single references; duplication copies individual event settings. Deleting a host retains dependent decorations at their last placement for explicit repair. Nested or tilted imported attachment hosts remain unsupported.

Actual browser and Windows workflows passed Move Z, Turn Z, local-X Resize, Duplicate, Delete and Undo on a supplied bed, alongside imported-mesh/room-wall attachment, portable project validation and room lighting pixel checks. Direct scene selection receives a separate ray-picking check; combined attachment-adjustment and prefab-stack workflows remain broader acceptance gates.

## October 13 - per-map image skies and distant layers

Choose Map, expand Sky and distant scenery, and select one of four supplied panoramas. Orientation is degrees. Enable sky affects the map; Apply saves one undoable transaction. Remove cloud/mountain rows for a plain image sky, or add/configure up to twelve overlays using typed distance (metres), height (metres), parallax (0–1), color and cloud angular speed (radians/second) fields. Reset prepares historical procedural defaults as a draft; Apply commits them. Image skies can also fill the open backdrop of a geometry interior; ceilings and walls continue to occlude them normally. Fixed artwork rooms retain their artwork backdrop.

The original PNGs are preserved. Blend horizontal wrap seams samples two half-turn-shifted copies with complementary smooth weights so neither source seam is visible. This modifies material sampling, not the source files, and changes the panorama's blended appearance. Disable it to inspect the unmodified source wrapping. The earlier AI-edited candidates remain unaccepted and are not runtime assets.

Sky bytes load lazily from trusted per-image embedded scripts because offline browser WebGL cannot upload opaque-origin file images. Pure tests confirm embedded bytes match original PNGs exactly. Cell transitions prepare the selected sky under their readiness cover. Diagnostics distinguish decoded source RGBA and GPU texture estimates; encoded strings and driver overhead are explicitly excluded. The bank is bounded to four images per application and one panorama mesh per renderer.

Browser and actual Windows sky tests passed typed authoring, portable settings, rendered color, distinct camera directions, full-turn equality and seam continuity. The separate actual Windows moving hills/sky matrix passed all eighteen quality/filter/light cases. Highest Smooth observed 78.3 fps unlit, 75.5 with player light and 76.4 with eight transient light emissions; CPU p95 was 16.0, 17.2 and 17.0 ms respectively. These are observations of this fixture, not a guarantee for arbitrary authored scenes; GPU elapsed time and full projectile gameplay were not measured. Earlier terrain-only observations remain historical and are not a controlled comparison to this run.


### October 13: stacking open imported room/tower modules

Under Models and wall decorations, Placement elevation offset proposes a vertical offset of -100 to 100 metres before connector snapping. It is an editor proposal preference; the confirmed transform is saved on the placed event. For a three-metre story, click the lower floor with an offset of 3 and compatible connector snapping enabled. The bottom/top metadata anchors align the story precisely. Open towers do not need an artificial ceiling merely to provide a clickable upper surface. Use negative offsets to sink a prop deliberately; surface stand-off remains a separate contact gap. Invalid nonfinite/out-of-range offsets reject the preview without changing the map.


### October 13: typed cell, door, effect and stock controls

Cell settings now provide named-arrival ID/name/XY/facing rows, fog enable/start/end/color, and sprite-normal ambient/strength/direction fields. Facing displays degrees and saves radians; fog distances use metres. Apply validates the complete draft as one undo step. Routine cell JSON fields are superseded; exact earlier source and explanations remain archived. Browser and Windows verify save validation, Undo and invalid-range rejection.

Door zone size and rotation use XYZ controls; black-space hold has its own seconds field. Moving leaves and static frames retain their numeric composition subdialogs; raw assembly JSON is under Advanced. Browser and Windows verify paired sliding leaves, zone dimensions/rotation/hold and ordinary event Save. Transitions still have no skip action.

Native emitters have an Enabled checkbox and validator-matching ranges. Disabled records now stay disabled when reapplied. Breathing and player/follower/event note-tag opt-in tests pass in browser and Windows. Map actor tags remain ColorPoolPlayer/ColorPoolFollowers; event opt-in remains ColorPool.

Containers/merchants use typed starting-stock rows for item ID, integral quantity, stack ownership, NPC owner ID and cleanup protection. Custom extensible properties remain under Advanced. Browser and Windows verify ownership, properties and invalid quantity rejection. Initial authored stock is separate from session merchant/storage contents.

Generated-game packaging now collects recognized authored local image/audio/font paths outside the built-in banks, preserving byte contents and rejecting missing resources before destination creation. Embedded model bundles remain in portable project data. Core banks are still conservatively retained; this is resource closure improvement, not complete unused-asset pruning. Updated generated sky-game startup, menus, saves, two-way travel and editor-shortcut guard pass in the browser; final regenerated Windows-game acceptance remains required.
