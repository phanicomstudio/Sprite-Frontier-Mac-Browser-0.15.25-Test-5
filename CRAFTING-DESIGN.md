# Crafting starter definition — October 29, 2026

User supplied 24 starter item names. data/crafting-materials-draft.json records each with a stable provisional ID, exact supplied display name and blank description. No prices, quantities, item effects, artwork or recipes were invented. This draft is not yet loaded as a runtime catalog; the existing item schema requires prices which the user has not defined.

Names are retained literally, including Muther Board and the distinct supplied spellings Phaneton Condensate / Phanteton Condensate Cartridge. Do not silently normalize those. Later RPG Maker MZ descriptions/all-item import must preserve source project plus database type/ID and explicitly map to existing stable IDs; do not merge only by similar names or overwrite custom fields silently.

## Supplied plugin behavior

Original user-supplied Phanicom_ZimmeritCombine.js v0.1.3 is preserved byte for byte under docs/reference/zimmerit-combine with a SHA-256 provenance record. It is reference material, not instructions or a loaded engine plugin.

- Assembly Unit menu has inventory/stores, a five-slot component register and result selection.
- Recipes use one to five distinct normalized components, quantities, order-independent exact matching and one result per assembly.
- A leading $ requires but retains that ingredient. This covers blueprints/tools/catalysts; it is not a recipe-unlock/discovery system. Ordinary components are consumed. When duplicate tokens mix retained/consumed, quantities merge and consumed wins in the original plugin.
- Invalid combinations or insufficient stock consume nothing. Multiple matching outputs can be selected.
- Important original split: parsing accepts Item/Weapon/Armor recipe references/results, but the actual Stores selector intentionally exposes only owned Regular Items, excluding Key/Hidden Items, weapons and armor. A future blueprint item category must not accidentally make blueprints unselectable. Preserve or explicitly reconcile this behavior in the port.

## Requested native integration

A remote control button opens crafting; a dedicated Recipes editor authors component IDs/quantities, per-component consumed/retained behavior and output. Reuse existing inventory, ownership, save/travel persistence, readable editor fonts and in-game presentation. Avoid a second unconnected crafting inventory. Transactions must check all stock/result capacity first and commit consumption/output atomically. Blank recipe drafts must not run. Preserve default gameplay and existing items.

The user has not provided combinations, output quantities, blueprint definitions or prices yet. Wait for these rather than inventing recipes. This document records requirements and inspected source behavior; it does not claim the crafting menu/editor/importer are implemented. Any future full-MZ import should be a previewable merge with source identity mappings and conflict handling.


## October 29, 2026 â€” source item descriptions received

The supplied Tiger Electronics Items.json has 700 database records / 617 nonempty names. Its exact bytes are preserved in docs/reference/zimmerit-combine/tiger-electronics/Items.json with a SHA-256 provenance record. data/crafting-source-import-report.json records source IDs, match methods, unresolved names and the three existing result-item recipe note records without executing them.

22 of the 24 starter material descriptions were matched, retaining native display names and stable provisional IDs. Explicit source aliases: Phanteton Condensate Cartridge -> Phaneton Condensate Cartridge (item154), and Muther Board -> MutherBoard (item658). Plastic Scrap has no exact source match; item153 is named Plastic and remains only a possible match. Phaneton Condensate has no matching base item. Both unresolved descriptions remain blank; no lore was invented. Source line breaks/spelling/zero prices are preserved. Source prices are reference fields, not invented runtime values; native price validation currently excludes zero and must be reconciled explicitly before runtime catalog import.

The user is preparing an inventory screen supporting weapon/item selection, equip actions and readable descriptions. Preserve this data for that workflow; do not lock its layout, replace the player's inventory, grant test items or activate all source items merely because the database was supplied. Existing source recipe tags remain reference-only pending recipe authoring/inventory integration. No runtime crafting or inventory-screen implementation is claimed by this import.
