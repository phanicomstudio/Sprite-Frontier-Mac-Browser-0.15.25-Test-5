# Sprite Frontier 0.15.25 — Test 2

October 14, 2026. Complete test distributions; supersedes the first 0.15.25 test packages for current testing. Earlier packages and their documentation remain preserved. This is not a claim that every game-builder workflow is finished.

## Visible tools

The top workspace now exposes map selection, New Map, New Project, Open Project, Save Project (JSON), map folder assignment, Build Structures, Sculpt Terrain, Muzzle / Aim, Place Item, Items, Events, and Fullscreen. Editor controls use larger text; event labels have an opaque backing. Fixed PNG room artwork remains visible in the editor.

## Projects and maps

New Project opens a blank-map form. It archives the current complete project locally before creating a one-map project. Open Project restores a dated local backup and preserves the outgoing project first. Save Project (JSON) creates a portable file; local backups are not a substitute for that file. Blank projects remain blank on reopening rather than acquiring bundled test maps.

Use Map folder to assign a path such as Test maps, Outside, or Outside/Saloon interiors. New maps inherit the active folder. These are grouped names/paths, not a collapsible RPG Maker map tree. Transfer IDs are unchanged.

## Build outdoors or indoors

Build Structures opens Tile Structure Builder. Paint floors or drag a rectangle, select wall/floor/ceiling textures, then Apply. Outdoor geometry retains sky, terrain, and open map navigation. Independently placed pieces remain intact. The building palette also previews modular pieces and snaps compatible connectors; Undo/Redo applies to confirmed changes.

Sculpt Terrain provides Raise, Lower, Flatten, Smooth, Paint ground texture, Erase painted texture, Paint water, and Erase water. Default ground texture affects the whole map. Texture to paint with brush is separate, allowing painted patches over vector ground. Left-drag commits one undoable stroke.

Editor flight retains altitude after ascend release. E/Space rises, Q descends, and Shift accelerates. Playtest resumes at editor XYZ and facing. The invalid-height bug that could send the player onto a ceiling is fixed. Normal gameplay gravity and collision resume in Playtest.

## Items

All 33 supplied PNGs are copied unchanged to img/items and registered in the shared item catalog. An offline byte-identical data mirror allows native/file-origin GPU rendering.

Place Item opens a definition picker, XY placement, quantity, sprite height in metres, and initial pickup method. Interact uses normal activation. Walk over creates a contact pickup. The collected original disappears through a saved self-switch. Picked-up items preserve their instance height in compact carried data. Any later drop is a static Interact item, regardless of initial pickup mode.

Inventory stacks are selectable and reveal descriptions and supported actions. Existing handgun/melee entries have Equip buttons. Authored HP-restoration items have Use. No food, ammunition, medical, or device effects are inferred from image names; configure definitions explicitly. Definitions expose description, world height, pickup method, HP recovery, and item-light settings.

First-person Drop previews the sprite at the crosshair surface; Confirm placement commits one item. Upward floor/table/shelf surfaces must be within 3 metres with room-volume clearance. Invalid placement retains inventory. Other views retain static feet placement. No throwing or physics is added.

Item light settings include enabled, color, radius, brightness, and vertical offset. Placed/dropped hosts use the map's enabled Local Lighting and its existing source budget. Inventory items emit no world light. Pickup/cleanup removes the host light. Per-item sources do not bypass the lighting master switch.

## Doors and map policy

Doors use named destination-arrival choices with position and facing displayed, plus Default map spawn. Author arrival XYZ/facing in the destination map's Cell settings / arrivals. Safe area suppresses ordinary combat; explicitly authored event commands retain their behavior. Dropped-item protection and recovery time remain separate settings.

## Validation and remaining work

Focused checks passed for editor altitude retention, outdoor layout painting and construction, terrain texture painting, normal gameplay movement, locked sprite presentation, comment coverage, original event behavior, item definitions, and item-light removal. The Windows candidate passed item authoring/contact pickup/inventory/static dropping/crosshair table placement, plus blank-project persistence and backup restore. High/Smooth performance testing is intentionally left to the user at their request.

The complete RPG Maker-style equipment/armor menu, controller navigation across all menus, a collapsible map tree, direct editing of arrivals inside the door dialog, and a fully unified selection inspector remain unfinished. Sky/cloud/mountain/water settings use existing workbenches; their desired consolidated visual palette and arbitrary terrain texture import are not claimed complete. New project assets currently share the available bank. Imported project JSON still uses the established merge workflow. Geometry collision and sprite clipping still require hands-on checking in user-authored structures.
