## Current update — 0.15.18, October 9, 2026

Read ITERATION-0.15.18.md and CAMERA-SPRITE-PAUSE-GUIDE.md for current camera, sprite, door collision and pause behavior. Older version-specific statements below are retained history and superseded where the current guide differs.

# Hubs, static items and doors — 0.15.17

Current behavior, October 9, 2026. Existing maps and earlier releases remain intact.

## Try the new cells

Choose **Hub Test** in Active map. The three antique door models lead to Hub Shop,
Protected Player Room and Hub Wilderness. The wilderness passage uses screen
melt; shop/home doors use the supplied antique 3D door. Arrivals are named `entry`.
The supplies chest gives five test tokens and 100 gold once. Shop and home cells
are deliberately unfurnished test spaces: dress them or replace their geometry in
the editor. They demonstrate independent state, not a finished town.

Holster with Space, use P for cursor targeting, and click a reachable door, chest
or item. Camera direction, range and solid geometry still constrain targeting.
Escape pauses ordinary play; during a cell transition it skips presentation and
commits the transfer once. Reduced-motion preference uses fade by default.

## Place a door on your building

1. F2 enters authoring. Right-click ground and choose **Create Door here**.
2. Choose destination cell and its named arrival (`spawn` also works). Add named
   points with **Cell settings / arrivals** in the destination first.
3. Choose 3D door, screen melt, fade, immediate, or cell default. Set the zone size,
   rotation and elevation offset. Negative offset sinks the event into terrain.
4. Apply this setup to an event draft. **OK/Apply in Event Editor** saves the actual
   event; Cancel there discards changes since its previous Apply.
5. Select and drag the invisible door event in authoring, or edit its numeric
   position. Its outline is an authoring reference, hidden during normal play.

A separate door event does not make the building's entire surface clickable.
For an attached doorway, use the existing model-zone editor and link a local
interaction zone to this door event's ID. Attached zones follow model transforms.
Configuring an existing event as a Door replaces that event's visual/spatial
settings with the invisible transfer zone; create a separate event to keep the
building model. Existing command pages are retained, but the hub service owns
interaction for this event. Conditional/quest door logic remains editable through
ordinary event commands instead of this simple direct-transfer preset.

## Door presentation

**Edit moving door leaves** provides separate model/node, swing or slide,
angle, speed, slide distance and local transform controls for up to two leaves.
Hinge axis and slide axis are local X/Y/Z vectors. Engine coordinates are X/Y
horizontal, Z up; glTF Y-up is converted on import. Swing speed is degrees/sec;
slide speed is world units/sec. Signed angle or slide axis determines direction.
Advanced composition fields retain precise pivots. A null pivot uses the selected
node's origin; author a hinge pivot into the asset, or supply an explicit pivot.

**Edit static frame** enables a selected frame node or no frame. Door-only,
frame-only, single, paired, synchronized and independent timing are supported.
A frame-only scene approaches/passes its opening without moving a leaf. The
antique preset selects frame node 0 and leaf node 1 of the shared assembly.

Camera approaches, leaves open with opening/optional creak cues, camera passes
into black, then the closing cue plays behind black before destination reveal.
The close animation is not shown from behind. This is our independent engine
presentation, not copied RE/Doom/OpenMW code. Missing door geometry reports a
message and falls back to fade. Destination texture readiness holds black up to
10 seconds, then releases it; it does not leave a permanent loading overlay.
Preview changes no map. Starting a real transition cancels any old preview.

Open, close and optional creak sounds each support Random, Manual or Silent and
0–1 volume. Random picks the appropriate role pool once per phase, rather than
changing per frame. Five supplied clips are converted to OGG; see
`audio/se/DOOR-SOUNDS.md` for original filenames. Keep source/license records for
any assets you distribute. No unused Blender backup or separate duplicate door
models are included.

## Items, containers and recovery

I opens inventory. **Drop one** places an event item statically at the player's
feet and current support elevation. There is no throwing, physics or placement
preview in this iteration. Click it within range to pick it up. Test items use a
shared chest graphic until custom item sprites are banked under `img/items`.
Definitions are in `data/items.json` and their offline mirror `src/item-manifest.js`.
Shared sprite profiles/models can be referenced by ID; artwork is never copied
into every dropped stack. Built-in combat weapons/ammunition retain their existing
combat state and do not expose Drop until the future unified item system.

Right-click creates a container/merchant, with starting stock and public,
player or NPC ownership. Merchant buttons buy/sell at catalog prices; containers
store/take; pawn shops recover the abandoned-item pool. Stock becomes saved per
stable event ID on first interaction. Editing starting stock does not overwrite
already initialized playtest stock. Ownership is metadata; theft consequences,
unique equipment rules and dialogue commerce are not implemented yet.

Per-stack JSON properties, ownership and quest protection survive pickup,
drop, storage and hub playtest saves. Legacy event inventory commands still use
item counts rather than addressing a specific property-bearing instance.
Skills/weapons/armor rules remain independent, editable engine definitions.

Cleanup uses unpaused gameplay seconds. A normal cell defaults to 3,600 seconds;
Hub Test fixtures use 120. Protected home/inn cells keep items. Quest-protected
items remain. Expired items move to pawn recovery without retaining hidden render
entities; a full recovery pool leaves items in place. Authoring/fresh playtests
reset temporary gameplay state. Real cell transfers preserve it. Export State
saves gameplay (including drops/stores); Export Project saves authored definitions.

## Templates and performance

Save reusable definition in Event Editor, then right-click **Place reusable
 template here**. Copies have independent identities and editable overrides;
self-linked interaction zones are retargeted to the new instance. Doors,
containers, merchants and NPCs use the same existing template bank.

For a 3D event, set Default, Custom distance or No distance culling in Model and
collision settings. Distance is measured to transformed bounds, not just the
origin. The last eight units (or 20% for short ranges) use stable coverage fading;
map fog uses each model pixel's camera depth. Offscreen and near-plane clipping
still apply. Unlimited landmarks cost more and do not wake distant actors.
Elevation offset below zero sinks geometry, collision and attached zones together.

**Cell diagnostics** reports active references, compact drops/stores, recovery,
cleanup clock, encoded shared model bytes and prepared CPU RGBA texture estimates.
The estimate excludes GPU copies, sprite textures and private preview fallback.
Limits: 32 visited cell records, 2,000 drops per cell, 2,000 storage entries/stacks,
2,000 carried detail stacks, 500 recovery records by default (maximum 2,000), 8 KiB
JSON properties per item. Cleanup examines at most 64 records per tick in fair
rotation. Pages remain data-budgeted rather than arbitrarily capped at 20.

## Extend safely

`hub-state.js` is persistence/validation, `hub-workbench.js` connects menus and
runtime, `door-transition.js` owns only presentation, `scene-transition.js` owns
one transfer commit. Add item definitions without changing collision/rendering.
Add leaf motion types in validation, timeline, presentation and tests together.
Preserve previous comments/docs. `FUNCTION-REFERENCE-0.15.17.md` indexes current
source contracts; run function-comment coverage and relevant behavior checks.


## October 12, 2026 - 0.15.23 current behavior
See ITERATION-0.15.23.md and PERFORMANCE-AUDIT-1523.md for current rendering, preparation ownership, performance evidence and limitations. Earlier version-specific instructions above remain history and are superseded where these documents differ. Locked 0.15.17 camera-facing sprite presentation remains mandatory.
