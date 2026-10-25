# Editable gameplay definitions

User requirement, 2026-10-07: skills, weapons and armor will work differently in this engine. Their definitions and properties must remain editable and extensible in later iterations. MZ's database, statistics, damage formulas, equipment slots and progression rules are references only, not engine requirements.

## Separate definitions from live state

Stable string identifiers connect authored content to definitions. Live player/party state stores values, inventory quantities and equipment references; it must not duplicate the full definition on every event or save entry. Project starting values initialize new games; they are distinct from reusable skill/item definitions and saved progression.

Current skill checks use deterministic numeric values keyed by name. Speech35 in the courier fixture is an example threshold, not a universal skill range, progression formula or random-roll system. Current bounds are resource/validation limits. Future skill definitions should describe the intended value type, range, default, progression and check behavior explicitly, with migrations when meaning changes. Do not reinterpret existing saved values silently.

Weapons and armor should share an extensible item-definition boundary while retaining type-specific validation and runtime services. Properties such as damage behavior, reach, ammunition, durability, resistances, protection, weight, equipment slots and appearance must be configurable only when their runtime behavior is connected. These examples are candidate properties, not a mandated final statistics system. Existing handgun/weapon registry behavior is a test foundation; a general equipment database and armor simulation are not yet implemented.

## Extension contract for future implementation

- Use explicit definition schema versions and migrations. Keep identifier changes separate from display-name edits; report unresolved references before adopting a project.
- Separate property definitions, validation, editor presentation and runtime consumers. A new weapon/armor/skill property must not require rewriting event branching, inventory or map placement.
- Preserve namespaced unknown extension data through project save/export/import and save-game round trips. Unsupported execution must produce a clear diagnostic; retaining data alone does not imply behavior is implemented.
- Build dedicated readable property controls from registered property definitions. Do not expose placeholder damage or armor controls that have no runtime effect.
- Keep shared definitions out of per-frame work. Cache validated definitions and invalidate affected consumers when definitions change. Bound imported definitions, extension data and diagnostics.
- Verify custom properties, migration, editor cancellation, changed definitions, equipment references, save/reload and party use with representative fixtures before claiming completion.

## Current implementation limits

Named skills/reputation/factions/quests and inventory event commands provide a foundation for conditions and quests. They do not implement a general skill database, editable weapon/armor database, equipment slots, armor mitigation or custom progression. `FrontierGameplayCommands`, `FrontierConditions` and the independent runtime/dialog registries keep those event integrations separate. The new gameplay database must connect to these boundaries rather than embedding final combat rules in quest commands.


## October 9, 2026 — 0.15.17 extension

See HUB-DOOR-GUIDE.md for the complete current authoring contract. New independent
modules are model-visibility, hub-state, hub-workbench, hub-fixtures, door-audio,
door-transition and offline item/door asset manifests. Existing templates and
undo boundaries own authored changes. Playtest hub records own stock/drop state;
map resources remain shared. Scene-transition owns transfer commit/resume and
cancels previews. Every new callback/function has its own source contract; the
current dated reference is FUNCTION-REFERENCE-0.15.17.md. Earlier explanations
above remain historical where behavior differs.
