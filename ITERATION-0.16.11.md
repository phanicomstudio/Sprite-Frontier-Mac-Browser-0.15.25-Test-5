# Sprite Frontier 0.16.11 — integrated inventory and authoring

October 29, 2026. This is the combined iteration requested after the isolated 0.16.10 Skill-O-Matic prototype. Earlier release documents remain historical evidence; the behavior described here supersedes their pending-feature notes where explicitly stated.

## Play and inventory

Press I or the remote's Inventory control. The supplied Inventory Screen Asset Test artwork occupies the available height in widescreen and 4:3 without stretching. The description sits above eight selectable items in two columns. Invisible hit regions follow the original upper/lower D-pad arms and scroll two entries at a time. The four original round buttons are Equip, Use, Drop and Close, from left to right; tooltips and E/U/D/Escape provide discoverable alternatives. Wheel scrolling stays inside inventory. Quantities, item properties and weapon ammunition use existing session and save owners, not a second inventory. A last-copy pistol carries its magazine when dropped, stored or sold; direct-pool weapons keep their shared ammunition pool. Unsupported use actions reject without consuming items.

The original artwork is img/ui/inventory/screens/default/base.png. data/ui/inventory/default.json documents native-pixel layout; src/inventory-skins.js is its offline runtime manifest. The layers folder reserves future modular overlays. Explained.png is reference only. No replacement D-pad artwork was drawn.

## Items and crafting

Open Items & Recipes in the editor header or Objects workspace. Select/search an item, edit its name, multiline description, category, price, supported healing/weapon profile and optional PNG. Keep item edits before changing selection. Keep recipe edits records the current recipe draft; Save project definitions commits the complete validated catalog and recipes through project history. Cancel discards that dialog draft. Referenced IDs cannot be removed until their authored/live references are retargeted. Prices can be zero. PNG uploads are portable embedded data, limited to 512 KiB and 4096 pixels per side.

The 24 starter materials are ordinary items. Their original RPG Maker IDs and available descriptions are preserved. Plastic Scrap and base Phaneton Condensate still have no confirmed descriptions; no description is invented. Add missing starter items safely adds absent identities to an older custom catalog without replacing existing definitions or granting stock.

Use COMBINE on the remote to select up to five item/count components. Exact order-independent quantities select applicable recipe results. Consume checkboxes distinguish ingredients from retained tools/blueprints; both must be owned. Invalid combinations or capacity failures consume nothing. Recipes with alternative outputs remain separately selectable. No production recipes are invented: author them in Items & Recipes. The three source database recipe tags remain reference-only. Skill-O-Matic retains its original scrolling A/B/C artwork, red remote button and TEST SCAN placeholder; a production skill roster is not fabricated.

## Connected construction

Build → Draw room / buildings is the primary connected rectangle workflow. Create optional Buildings and Storeys, choose independent wall/floor/ceiling materials, and enter dimensions or drag a footprint on the actual ground. Storey elevation is a reference; Align floor is explicit. Putting a room or independent object in a group does not move it. Independent scene objects can be assigned to a selected room.

Select generated surfaces through the scene or hierarchy. Transforms, material mapping and deletion record persistent overrides. Parent room resizing retains compatible edits. Make Independent detaches effective geometry and suppresses its former generated part; Restore Generated Part explicitly restores ownership. Generated aperture slabs also retain individual overrides. Deleted components do not silently reappear after reload. Existing fixed-artwork/freeform tools remain specialized capabilities rather than being discarded.

Select a connected wall to create an opening with optional local or transfer door event. Real jamb/lintel geometry supplies both rendering and collision. Opening controls resize/retarget or remove the linked opening/door. Shared boundaries require explicit joining of coincident walls; unaligned resizing or invalid openings are rejected with the draft intact. Correct the dimensions or explicitly unlink/detach before retrying; topology conflicts are not silently guessed. The connected generator is rectangular; it does not claim a new automatic arbitrary-polygon repair engine.

Local doors use the existing event self-switch/save system, shared door model, animated leaf and corresponding collision. Closing waits if the player blocks the leaf. Transfer doors retain the existing cinematic, melt, fade, destination validation and reciprocal front-side arrival owner. Shared Scene transforms, the original event-page editor and model material controls stay available in the contextual inspector. Storey isolation affects editor visibility only, never exported collision.

## Focused examples and rendering

Fresh projects replace redundant old room/hub examples with Door Test Hall, Door Test Room and Door Test Courtyard. These cover local passage and cinematic, fade and isometric melt returns. Existing saved/imported maps are preserved. Legacy fixture source/history remains available for compatibility evidence; retiring examples does not remove prerendered/isometric/3D support.

Isometric sprite/event visibility derives from inverse-projected viewport bounds at the current zoom, tilt and yaw. Shared positive affine depth preserves distant geometry and sprite occlusion without moving the camera or changing billboard tilt. Terrain, models and sprites share authored fog distances; sky is excluded. Only tiny distant isometric sprites reduce cosmetic animation/lighting frequency (5 Hz below 24 pixels, 2 Hz below 12 pixels, with hysteresis). Nearby combat, movement, collisions, death/direction changes and perspective presentation remain full detail. The 0.15.17 camera-facing sprite proportions and deliberate perspective sun/isometric contact-shadow split remain intact.

## Validation and delivery

Run npm test (or each package script with the supplied Node runtime), test:integration1611, test:models and test:hub. The release includes browser acceptance for original-art inventory, catalog save/reload/crafting, actual ammunition transactions, connected geometry, local-door collision/projectile passage, cinematic/melt/fade round trips, wide-zoom visibility, existing palette GPU comparisons and Skill-O-Matic. Function-comment coverage remains mandatory. Controlled headless render timing is fixture-specific, not a universal frame-rate guarantee.

The Windows distribution contains the complete executable/runtime, assets, source comments, licenses, guides and tests. Extract the entire ZIP before using Launch Sprite Frontier.cmd. Source ZIP downloads from GitHub are not the Windows application. No prior release is overwritten and no PR is automatically merged.
