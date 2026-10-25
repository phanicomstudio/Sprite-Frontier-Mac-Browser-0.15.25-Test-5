# Proposed replacement goal — Sprite Frontier

Status: proposed replacement for the active exact-MZ-parity goal. This document does not itself change the active goal. Preserve all existing implementation, tests, assets, earlier iterations and compatibility evidence.

Deliver the next complete Sprite Frontier iteration with a readable, extensible event editor suitable for Daggerfall/Fallout-style exploration, quests and combat. Use RPG Maker MZ's event editor as the workflow reference, rather than requiring every MZ command or exact visual parity.

## Authoring workflow

In authoring mode, right-click ground to Create Event Here; right-click events to Edit, Duplicate or Delete. Preserve gameplay right-click behavior. Keep familiar Name, Note, numbered pages, page operations, conditions, image selection, autonomous movement, options, priority, triggers and an ordered command list. Support dedicated parameter dialogs, nested command groups, keyboard editing, isolated drafts and correct OK/Cancel/Apply behavior. Use large, readable controls and clear explanations. Never present unsupported behavior as functional.

## Gameplay priorities

Implement and demonstrate dialogue and choices; skill and inventory checks; quest, faction and reputation conditions; doors, containers, pickups and loot; map travel; and persistent world changes. Support NPC and enemy Wander, Patrol and Sentinel behavior, configurable approach/chase distances and return behavior. Party members must participate in combat. Define the minimal player, party, inventory, quest and faction data needed by these workflows rather than adding disconnected controls.

Retain nested AND/OR/NOT conditions and extensible typed comparisons. Support unlimited event pages within explicit data and execution budgets, reusable event definitions and Replace Event for completed interactions. Existing physical jumping remains authoritative; scripted route jumping may be deferred and must never compete with player jump ownership when introduced.

## Engine and project requirements

Preserve continuous coordinates, terrain deformation, textured ground, pools, interiors, grounded and flying events, and camera clearance while allowing underwater views. Fix and verify all four fixed-camera WASD diagonals and aim/fire/walk/idle transitions. Make New Map obvious and preserve bundled test maps. Keep separate authoring and playtest state; support undo/redo, project saving, export/import and reliable reload without stale iteration settings.

Separate schemas, migrations, command definitions, validation, conditions, presentation and runtime services. Preserve unknown extension data. Prioritize bounded execution, selective updates, useful source comments and bounded debug traces with actionable errors. Provide an easy sprite normal-map generation/import/preview/apply/remove workflow. Add an optional Doom-inspired screen-melt transition. Publish a practical asset optimization roadmap covering formats, dimensions, packing, transparency, mipmaps, memory and loading, using historical game techniques as references and measured engine constraints as evidence.

## Acceptance and delivery

Validate complete authored scenarios: branching NPC conversation with a skill check; persistent quest progression and a one-time reward; a door or container; map travel and reload; NPC patrol/chase/return; and an encounter with party combat. Verify cancellation, page precedence, waits, save persistence, extension preservation and return from isolated playtest. Measure representative performance and resource budgets. Keep a compatibility ledger distinguishing verified MZ behavior, intentional adaptations, assumptions and deferred commands.

Update the concise overview, architecture/extension guide, asset guide, roadmap and colleague handoff. Deliver complete new Windows and Mac browser packages with required assets and instructions. Keep previous releases intact. Report actual platform testing and remaining limitations accurately; no patches or hotfixes.

Exact MZ command coverage, native pixel-perfect geometry and unused MZ-specific battle/vehicle systems are deferred unless needed by the accepted gameplay scenarios. Deferral does not excuse missing runtime behavior for controls offered as supported.
