# RPG Maker MZ inspection and editor direction

Inspected: Test Project for chat gpt.zip, supplied by the user. This is an inspection report, not a change to the running engine or a completed MZ importer.

## Findings from the supplied project

The project marker and runtime headers identify MZ 1.8.0. It contains one 17 × 13 map, a player start at (8, 6), a six-plane map data array, no map events, four empty common-event records, and no configured plugins. Map data contains only tile IDs 2816 and 0. The project uses an 816 × 624 game/UI area. Its bundled PixiJS version is 5.3.12.

Database record counts (excluding null slots): 8 actors, 8 classes, 235 skills, 30 items, 50 weapons, 100 armors, 5 enemies, 5 troops, 30 states, 120 animations, and 6 tilesets. Counts describe this supplied starter database, not authored gameplay or requirements for our engine. Switch/variable arrays each have 21 slots, including the initial index-zero slot.

The archive includes game runtime scripts and data, not the desktop map/event editor source. rmmz_windows.js and rmmz_scenes.js implement game windows/scenes; they are not the authoring application's UI. Official editor documentation supplements the runtime inspection. There are no authored map events here with which to verify a complex import. Later importer testing will need purpose-built fixtures or a project containing representative authored events.

## Decision

Keep our continuous-coordinate, sprite-based world and shared in-level editor/runtime. Reproduce MZ's useful event-authoring workflow rather than importing its tile-based movement, combat, whole game runtime, or desktop UI. Build a native command registry and typed event model; treat future MZ import as a translation layer. Do not change the present demo as part of this inspection.

The main scene remains the live camera view. Select or place an event in the level, then edit it in an inspector. Authoring pauses event execution; playtesting uses an isolated copy of state. Preserve the current editor camera and authored definitions when returning from playtest. Our existing framework already provides much of this foundation.

## Event model verified in runtime code

A map event has an ID, name, note, x/y and ordered pages. Each page owns conditions, graphics, movement settings, behavior flags, priority, trigger and command contents. The highest-index page whose enabled conditions all pass becomes active. No passing page means the event has no active page. Do not mistake page priority for command execution order.

MZ conditions include two independent switch tests, a variable threshold, a self-switch, possession of an item, and an actor in the party. They combine with AND. Runtime variable checks accept values greater than or equal to the threshold; that boundary should be covered in tests. Self-switch identity includes map ID, event ID and channel A–D. Our present single-world event ID keys should become world/map-scoped before multi-map import or persistence.

MZ's editor event name is an authoring label. Our current event name is also shown to the player. Introduce separate authoring name and visible/display name so imported labels such as EV001 do not become unwanted inspection text. Retain separate inspection text, notes and localization-ready text references.

Trigger values: 0 action button, 1 player touch, 2 event touch, 3 autorun, 4 parallel. Our action equivalent is a reachable aimed target plus holstered left-click/controller interaction; it must retain feet-based reach and line-of-sight checks. Touch triggers need spatial overlap and entry/contact semantics rather than integer-tile equality. Autorun owns foreground execution; parallel events need independent execution state and update budgets. Their repeated execution and interruption rules must be explicit.

MZ commands are records containing code, indent and parameters. The inspected runtime has 114 explicitly named command handlers. This is not a count of every possible serialized record: text/script continuation rows, end markers and structural records also occur. For example, Show Text (101) consumes text rows (401); choices use branch records; Script (355) consumes continuation rows (655). A translator must parse command groups and nesting, not turn each numeric record into an independent UI row.

The interpreter tracks command index, branch state, waiting, child/common-event execution and event identity. Wait modes cover messages, transfers, movement routes, animations, screen scrolling and other asynchronous operations. Common events are reusable command lists; nested calls require a bounded call stack. Budget execution per frame so loops and parallel events cannot freeze the game.

## What our editor already has, and what is missing

| Area | Current demo | Recommended extension |
|---|---|---|
| Placement | In-level selection, placement, movement; optional map | Placement gizmos, named selection list and duplicate event |
| Pages | Add/delete, page preview, highest matching page | Tabs, duplicate/copy/paste/clear, explicit active-page indicator |
| Conditions | One always/global switch/self-switch condition | Multiple AND conditions; variables and inventory checks |
| Commands | Flat message/switch/self-switch/give-item/wait/local-transfer list | Categorized picker, nested branches, choices, common events |
| State | Session switches/self-switches/item stacks | Named variable database, stable IDs and save-state serialization |
| Triggers | Interact and player touch | Event touch, then autorun/parallel with scheduler limits |
| Appearance | Vector graphic choices and solid flag | Sprite asset/frame picker, dimensions, footprint and vertical bounds |
| Movement | Player controls and basic enemy movement | Event/NPC routes in world coordinates; wait-until-complete |
| Transfers | Local x/y reposition | Named destination/scene and safe spawn validation |
| Feedback | Inspection CRT and fallback messages | Distinguish nonblocking description/log from blocking choices/dialogue |
| Debugging | Preview pages, isolated playtests | Condition explanations, state watch, command trace and breakpoints |

## Recommended next editor implementation

First build the event authoring foundation: page tabs and copy/duplicate controls; named switch/variable/item selectors; combined page conditions; a command palette; structured conditional branches; choices; and common-event definitions/calls. Extend the interpreter and validation together with the editor so every selectable command actually works in playtest. Do not expose attractive but inert command buttons.

Prioritize these native command groups:

1. **Information:** inspection text, pickup/log notification, intentional dialogue, choices and comments. Preserve the user's rule that descriptions use the inspection module when available. A choice still needs a response UI and explicit pause/wait behavior; imported Show Text cannot always be silently reclassified as a nonblocking description.
2. **Progression:** switches, self-switches, variables, item grant/remove, and conditions. Inventory conditions enable collectible HUD devices later; device visibility should follow item ownership without conflating ownership with temporarily minimizing a device.
3. **Flow:** if/else, call common event, exit execution and wait. Add bounded loops later; avoid labels/jumps as the first authoring interface.
4. **World:** safe transfer, erase/hide event, move/face actor and trigger volume controls. Named world-space targets replace assumptions about tiles.
5. **Presentation:** sound, music, picture layers and screen effects after their rendering/audio services exist.

A command definition should provide its ID, label/category, parameter schema, editor fields, summary, validation and runtime handler. Register future plugin commands through the same interface. Separate this registry from DOM controls, the Canvas/Pixi renderer, and project serialization.

Use a readable nested native structure such as an if command with then/else child lists. Convert to/from MZ's indentation and structural codes at the importer boundary. Keep source code/parameters/location metadata for diagnostics, but execute only the translated native commands. Proposed schema changes need a new version or an explicit migration from the current sprite-frontier/1 data; existing scenes must continue to load.

## Adaptations specific to our world

MZ's map flattening is indexed as (layer × height + y) × width + x. Four planes are visual tiles; region IDs use plane 5. Plane 4 contains shadow data. Tile passage uses tileset flags and multiple layers, so tile graphics alone are insufficient to infer collisions.

A future converter needs an explicit tile-to-world scale, origin and asset/collision mapping. One MZ tile must not automatically be treated as our one-foot unit (0.3 world units). Map regions can become trigger volumes or biome/zone labels. Tile passage can seed conservative obstacle footprints; our vertical object height, stepping/jumping, terrain and projectile geometry remain authoritative.

MZ movement routes are grid-oriented. Native routes should use continuous world positions, our collision/movement services and seconds-based timing. Do not copy MZ speed numbers into the player's established 3.2-unit movement tuning. NPC route speeds can be translated through a documented conversion.

MZ visual priority (below/same/above characters) should not override physical world-space depth arbitrarily. Adapt it into presentation layers or collider behavior only where the intended meaning is clear. Preserve our explicit dimensions and terrain-grounded sprites.

## Import and plugin strategy

Inspect-only import should report every command and asset reference before creating a translated scene. The provided map has no events, so it is suitable for map structure checks, not proof of complete event compatibility.

First translation subset: text/comments, switches/self-switches, fixed waits and basic item changes. Next: conditional branches, variables, choices and common events. Map transfers and routes follow once multi-scene and actor movement services exist. Unsupported commands remain visible with exact source locations and explanations; never silently discard them or claim full compatibility.

Raw Script commands, script-based variable operands/conditions and movement-route script calls require review or deliberate native replacements. Plugin Command (357) carries a plugin name, command name and arguments; preserve these for later registered adapters. No authored plugins were present in this project and none have been tested or ported.

The supplied runtime bundles PixiJS 5.3.12. A move to a newer Pixi renderer does not automatically preserve custom filters, shaders, blend behavior or window hooks from an MZ plugin. Inspect each supplied plugin's dependencies and compare representative visual outputs before choosing a compatibility adapter or rewrite. Effekseer files are also present, so MZ animation data may depend on that separate effect system.

Retain database records and metadata where useful, but do not import MZ's turn-based battle or actor-stat assumptions into our existing combat. Skills can reference native target actions and Skill-O-Matic display data; their rules still need to be defined. Future cooperation will need authority and ownership rules for switches, inventory and event execution; stable IDs and separable state help prepare for it without implementing networking now.

## Acceptance checks for the next implementation

- A two-page pickup grants an item once, flips its self-switch, and selects the empty page.
- Combined conditions use AND; a variable exactly at its threshold passes.
- A later valid page overrides earlier pages; invalid conditions explain why a page is inactive.
- Choices execute the selected branch; cancel follows its authored policy.
- Common events return correctly; recursive calls and infinite loops hit explicit limits.
- Parallel events update independently without taking foreground dialogue ownership.
- Save/reload preserves switches, variables, inventory and scene-scoped self-switches.
- Fresh playtest resets temporary state while retaining authored data and camera viewpoint.
- Export/import retains nested commands and emits diagnostics for unsupported MZ records.
- Descriptions and notifications respect device UI routing without accidental pointer-lock release.

## Evidence and scope

Read directly: project marker; map, system, common-event and database JSON; empty plugin configuration; Game_Event page logic; Game_Interpreter dispatch/waits/message/common-event/script/plugin behavior; DataManager database/save handling; map layer/region lookup; existing Phanicom event interpreter and inspector. The source project was not modified or launched. Default art/audio was not bulk-extracted. The editor plan is a recommendation, not a tested compatibility claim.

Official workflow references: [Map event settings](https://rpgmakerofficial.com/product/MZ_help-en/01_09_03.html), [Event command categories](https://rpgmakerofficial.com/product/MZ_help-en/01_10.html), and [Common event settings](https://rpgmakerofficial.com/product/MZ_help-en/01_08_11.html). Runtime code was used to verify behavior where precise details matter.
