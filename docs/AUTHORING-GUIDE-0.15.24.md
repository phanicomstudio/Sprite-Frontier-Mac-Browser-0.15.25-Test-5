# Sprite Frontier 0.15.24 authoring guide

Current working instructions, October 13, 2026. Earlier design explanations and
dated changes remain in BUILDING-AUTHORING-1524.md and ARCHITECTURE-HISTORY.md.
The release acceptance checklist is separate; this guide does not certify that
unlisted workflows or arbitrary project sizes have been tested.

## Make a new interior

Return to the editor and open the Map controls. Create a separately named map
using Blank 3D interior. The initial floor outline supports walking, but it does
not include a visible shell. Use a new cell when testing a new shell: creating a
second shell appends geometry rather than replacing existing walls.

There is no 32-map or 32-visited-cell limit. Inactive cells retain authored and
saved records; the selected cell owns the rendered scene. Large project loading
and saving still consume storage and memory. Project import has a 100 MB guard,
and numeric MZ compatibility identities range from 1 to 999999. The shared imported-model bank supports 256 models and 128 MiB of decoded bundle bytes; one bundle is limited to 64 MiB. These resource limits are separate from map count.

X and Y are horizontal; Z is elevation. Distances are metres. Camera yaw and
internal rotations use radians, but authoring controls explicitly marked degrees
accept degrees. These coordinates differ from the Y-up convention inside GLB;
the importer performs that conversion.

## Build and stack rooms

Use the building palette for walls, floors, ceilings, blocks, open doorways,
straight stairs and complete rectangular shells. Choose dimensions and material,
then preview before placing. Green previews are drafts. Place commits one Undo
operation; Cancel leaves the authored cell unchanged.

A rectangular shell contains individually selectable walls, floor and ceiling.
Its width/depth describe the clear interior. The walls sit outside that space.
Click a surface to select it, then use axis handles or numeric properties. Move,
turn, resize, duplicate and delete use the shared Undo history. World/local axes
and snap settings are editor preferences; saved transforms belong to the piece.

Round construction supports floor/ceiling slabs, rings and curved wall arcs.
Keep the segment count reasonable: it controls the visible faceting and collision
geometry. Hollow towers preserve their central opening. A solid roof remains a
solid roof; an attic entrance is not automatically cut into it.

The supplied prefab suite includes square room sections, hollow tower sections,
castle walls and matching roofs. Use matching dimensions and connector snapping.
For open-topped modules, Placement elevation offset raises the next preview to
the upper connector. The tested six-metre room/tower modules use three-metre
storeys: offsets 3 and 6 place the next storey and roof. The final height is saved
as an ordinary placement transform. A negative offset deliberately sinks a model.

Straight stairs use width, run, rise and step count. Rise/count is step height;
run/count is tread depth. Keep step height within the player's walkable step
limit, leave headroom, and cut an opening in upper floors/ceilings. Flights can
be moved, turned, resized and duplicated as assemblies. Spiral stairs remain
future work.

## Materials and decoration

Surface texture controls show thumbnails. Import surface texture accepts PNG,
JPEG or WebP under 8 MB, with dimensions up to 4096 pixels per side. Apply embeds
the imported image in that surface's saved material. It no longer depends on
the original desktop file. Canceling an import does not commit the draft.

Repeat size changes the texture pattern independently of wall dimensions.
Repeat is appropriate for seamless stone; Fit places one image across a face,
which is useful for panel art. Aspect preservation uses image dimensions.
Offsets are measured in repeats, and texture rotation is in degrees.

Imported GLB props retain their authored material slots. Per-instance replacement
of those slots and a deduplicated project-wide imported-texture library are not
currently exposed. Repeating large embedded surface textures increases project
size; use shared built-in textures when appropriate.

The prop tools import and place furniture, paintings and other models. Preview
against the selected floor/wall or other supported host surface. Wall-mounted
paintings save an attachment, so translating, yawing or scaling the upright host
keeps the decoration in place. Host-local offsets are saved. Tilted or nested
imported attachment hosts are deliberately unsupported. Removing a host leaves
its decorations at their last placement for repair. Decorative windows can use
the same model placement; a separate 2D window-sticker tool is not exposed.

Structural and generated pieces use geometry collision by default. Interaction
zones are separate from collision: an invisible clickable volume is not a wall.
Use the collision view to inspect the actual configured shape. Overrides are
deliberate per-object settings.

## Arrivals, doors and reusable events

Cell settings provide typed arrival ID/name, X/Y, optional Z and facing fields. Leave Z blank for automatic floor selection, or enter an elevation for a particular storey. Add arrival
at player position creates a draft row; Apply validates and commits it. Doors
link a destination cell to a named arrival. Keep return links explicit so the
same hub state is restored when leaving an interior.

Place an event and configure its clickable/trigger zone independently of its
model. Door-zone dimensions are metres and rotation controls are degrees.
Choose leaf/frame assets, hinge or slide movement, paired leaves, speed,
direction, sounds and transition style. Advanced composition properties remain
in an expandable JSON panel. The black-space hold control is seconds.

Door transitions hide the interaction hand and block gameplay input. Skipping
is not implemented. Leaf/frame-only compositions are allowed where the chosen
assets and motion make sense.

Save a configured event as a reusable definition, then place independent copies
and adjust their individual settings. Saving a definition does not Apply an
unfinished event draft. Replacing an event with a definition retains its identity
and position; choose the self-switch reset/preserve policy explicitly.

Typed container/shop rows expose item ID, whole quantity, ownership, NPC owner,
quest protection and advanced custom properties. The cell cleanup policy controls
dropped items; protected cells and protected quest stacks retain their items.
Eligible items move to bounded recovery rather than being silently deleted.

## Environment and lighting

Choose a panorama independently for each map. The four supplied skies are
banked; wrap blending is performed by the sky renderer, preserving the original
images. Orientation is degrees. Supported cloud/mountain layer controls are
separate from the panorama. Changing cells does not select one global sky.

Cell fog controls provide enabled, start/end distances and color. Normal-map
lighting direction is a separate sprite texture-space effect, not a placed
world light. Radius lighting provides ambient brightness, placed/attached
sources, optional player light and optional projectile emission.

At most eight lights are active in a frame; the cell can contain 128 authored
sources. Selection and omitted-source counts are diagnostic. Projectile lights
derive from live shots and disappear with them. Up to 32 room primitives act as
shadow blockers. Imported model/terrain shadow casting is not inferred. Round
shadow volumes use smooth circular boundaries while low-segment geometry is
faceted, so their edges can differ slightly.

Native effect controls expose weather/emitter rates and positions, liquids,
color pooling and breathing settings. Disabled emitters retain their disabled
state when reopened. Map notes control player/follower color-pooling opt-in;
event notes control event opt-in. These are not replaced by new opt-in checkboxes.
Breathing is a player option and persists across cell transitions.

## Save, test and export

Use Apply to commit drafts. Committed authoring changes are saved locally; use
Export project for a portable authoring backup. Scene Undo and map-membership Undo are distinct. Map duplication
creates independent world data and rebases direct self-links; deletion rejects
known incoming links. Map-management Undo retains later edits to restored maps.

Playtest uses the gameplay view; Return to editor resumes authoring. Pause menus
use the selected hand cursor. Options include master volume, cursor, resolution,
filtering, Get Unstuck and explicit fullscreen exit. Escape pauses while retaining
fullscreen in the Windows build.

Export Game creates a separate playable folder. Its HUD and menus remain, while
authoring modules, controls and F2 entry are omitted or guarded. Open the exported
entry independently to test it. Keep the folder together: local textures, sound,
fonts and lazy sky resources accompany it. The current collector preserves
complete core asset banks rather than promising minimum possible export size.

Use cell diagnostics to check geometry, texture estimates, active/omitted lights,
cleanup and frame costs. Highest resolution/Smooth costs depend on the active
scene. Native measurements are listed in the iteration audit; they do not promise
the same frame rate for arbitrary maps or hardware.

The 0.15.17 camera-facing sprite tilt, proportions and frame presentation are
locked. Collision/depth/camera fixes must preserve them.
## HUD kill feed — October 13 addition

Open **Starting gameplay values** in the map/project tools. The **HUD kill feed**
section can inherit shipped settings or save an override. Clear **Use shipped
kill-feed settings** to customize Enabled, general messages and weapon-specific
rules. Enter one message per line. Literal placeholders are `{killer}`,
`{victim}` and `{weapon}`; no scripts are evaluated. A matching weapon profile
rule replaces the general pool. Messages display through the existing HUD
message device. Apply starts the same fresh playtest as other starting values.

These settings belong to the project, survive project export/import and saved
game restoration, and apply across cells. Selecting shipped settings removes
the override. Each pool supports 1–64 nonblank messages, at most 240 characters
per message; up to 64 unique weapon rules are accepted. Invalid drafts stay in
the dialog without changing runtime settings. Per-profile IDs match native
weapon IDs, not display names. Item-definition and weapon-balance editors remain
separate delivery work.

## Item definitions — October 13 addition

**Starting gameplay values → Item definitions** edits the project catalog.
Clear **Use shipped item definitions**, expand a definition or add one, then
set its stable ID, readable name, whole-gold price, sprite graphic/profile and
optional imported dropped-item model. Model assets are selected from the project
bank. Properties remain extensible data under Advanced. Apply starts a fresh
playtest. Definitions do not replace inventory quantities, ownership or stored
drop locations; those belong to session stacks.

Prices accept 1–1,000,000 whole gold; the existing merchant resale behavior is
unchanged. IDs support up to 100 characters, names up to 120, and a catalog up
to 2,000 definitions. Dropped models retain the current native 0.2 scale and
static placement behavior. Unknown saved item IDs use the existing generic
fallback. Changing a definition's ID does not rename existing inventory stacks.

Project import merges incoming definitions and remaps their model references.
A differing definition for an already existing stable ID rejects the import
before adoption: use a distinct ID or matching definition. Import keeps host
project-wide HUD preferences. Catalog visual changes invalidate only active
dropped-item render metadata, without loading inactive cells.

## Native weapon parameters — October 13 addition

Open **Starting gameplay values → Native weapon parameters**, expand a shipped
profile and select **Override profile-ID**. Damage, ammunition, range, ballistic
speed/radius, cadence, burst count, shotgun pellets, melee arc/target count and
sound parameters have typed controls. Cadence fields use seconds; melee arc uses
degrees. Procedural sound gain uses 0–4 (1 is normal), while supplied-sound volume
uses 0–100. Sound IDs refer to the existing supplied sound bank; an unavailable
firing sound retains the native procedural fallback. These controls configure
existing native profiles rather than adding a new weapon family.

Apply starts a fresh playtest and equips profiles from the new project metadata.
Unchecked overrides restore shipped presets. Save/Load and cell travel retain
project settings. Importing additional cells keeps the host project's weapon and
HUD preferences. Angular spread remains the existing per-map control; optional
projectile light emission remains governed by cell lighting and bounded light
budgets. Projectile aliases and lifetime are synchronized when speed/range/radius
changes. The engine's 64-pellet and 32-burst bounds remain enforced.

## Starting-value Undo/Redo — October 13 addition

The Map library has **Undo starting values** and **Redo starting values**.
Each successful Apply in Starting gameplay values creates one independent,
bounded history entry covering state, item/weapon definitions and HUD settings.
Undo/Redo each start the same fresh playtest as Apply. They leave map geometry,
models and event-definition history intact. History is local to the authoring
session and resets when the project is restored/reloaded. Invalid drafts and
Cancel do not create records. Earlier notes saying only Cancel was available
are superseded by this addition.

## Per-weapon projectile lights — October 13 addition

Within an enabled native weapon override, **Projectile light mode** chooses
inheritance, disabled for this weapon, or custom emission. Custom controls set
color, radius in metres, brightness (0–4), falloff (0.5–4) and flicker (0–0.3).
Cell local lighting must be enabled. A custom weapon light can emit when the
cell-wide default projectile emission is disabled; a weapon's explicit disabled
setting suppresses its own light. Inherited mode retains shipped profile/cell
behavior. Live projectile position owns the light position, and impact/despawn
removes it naturally. Every source still competes within the active light budget.

## Imported-model material slots — October 13 addition

Select a placed model under **Models and wall decorations → Edit placed models**,
then choose **Edit selected model materials**. Each authored GLB slot has an
independent override switch, original thumbnail, shared surface-image choices,
local PNG/JPEG/WebP import, tint, repeats, UV offsets, rotation and aspect option.
Apply creates one world Undo step; Cancel abandons the draft. Clearing a slot's
override restores its original material. Geometry, collision and original GLB
bytes remain unchanged. Texture imports are embedded in saved instance data.

Repeats are dimensionless multiples of original UV coordinates; they are not
world metres. Generated room surfaces retain their separate world-repeat control.
Slots without authored UVs permit tint only and report why texture mapping is
unavailable. Imported slots retain their original alpha mode and factor alpha;
the assigned image supplies texel alpha. CPU masking and GPU color use the same
mapping. Shared cache decoding is included in cell-transition readiness.

Images are limited to PNG/JPEG/WebP under 8 MB and 4096 pixels per side. Instance
overrides support up to 64 slot records and 12 MiB of URI payload; source slot
existence/UVs are validated against the project's model bank. Earlier notes
labeling per-instance material-slot editing unsupported are superseded by this
implementation; final Windows visual/performance acceptance is still pending.



## October 13 — imported-model material slots

Select an imported model under Models and wall decorations, expand Edit placed
models, then choose Edit selected model materials. Each source material has its
own slot. Enable its override, select a shared project image or import a local
PNG/JPEG/WebP, and edit repeats, image aspect, offsets and rotation. Tint is
optional. Clear the override to inherit the original material. Apply records
one ordinary world-edit transaction; Cancel abandons the draft.

Repeats use the source UV coordinates, independently of model dimensions. Every
primitive in the affected slot needs source UVs for texture mapping; slots
without complete UVs support tint only. Imports are bounded to 8 MiB and 4096
pixels per side; embedded override data is portable with project export.
Original glTF alpha, geometry and collision are retained. This supersedes the
earlier note that imported-model slot replacement was unavailable.

Windows acceptance covers real slot controls, rendered CPU and GPU tint, Undo,
portable project import and local reload. The generated gameplay package also
retains embedded overrides through Save/Load and two-way cell travel. Starting
value Undo history resets after importing a project so older records cannot
remove item definitions used by newly imported maps.
