# Sprite Frontier editor redesign: source assessment and implementation contract

October 22, 2026. Baseline: complete 0.15.27. Basis: the complete UI Audit Setup discussion supplied by the owner, the 0.15.27 handoff and control inventory, and all 13 supplied screenshots. This is the required pre-implementation assessment; statements below distinguish existing implementation from intended work.

## Agreed direction

One authoring environment, five workspaces: **World, Build, Objects, Events, Environment**. Use a compact header, left creation palette, primary live viewport, contextual inspector and optional hierarchy/assets/history. The latest mockups place the inspector on the right; this supersedes the earlier all-controls-on-the-left arrangement while retaining the large playable viewport. The inspector must collapse when not needed. Advanced capabilities remain reachable. Do not replace the old scrolling dashboard with another dashboard behind five tabs.

Generated parts remain attached to their room until explicitly detached. Component deletion, transform and material edits persist. Buildings and Storeys are optional structural organization; membership alone never moves geometry. The Door tool cuts compatible geometry and optionally adds an event-backed door. Rooms, loaded cells and camera/combat presentation are separate concepts. 3D, fixed-background and isometric spaces coexist in one project.

### Visual reference review

All 13 images were inspected in the conversation. Images 1 and 4 show the first workspace mockup; images 2 and 5 repeat the construction-method references. Image 7 shows the refined workspace with Material/Paint as a permanent tool. Image 8 distinguishes recipe, generated parts, overrides and effective scene. Image 9 shows plan and perspective operating on one scene. Image 10 shows optional building/storey hierarchy. Image 11 shows generated/customized/expanded construction. Image 12 shows the shared saloon/storage boundary. Image 13 shows the cell graph; image 3 illustrates local, cinematic and melt doors. Image 6 shows direct surface editing and independent material/deletion expectations.

The screenshots establish design and behavior references, not supplied runtime art. Blender/BIM/blockout/prefab examples illustrate complementary construction modes; the adventure-room and door/game screenshots illustrate presentation. No pictured third-party geometry, texture, door or game asset is authorized for import. External source pages were not supplied; review is of the actual pictures provided, not a claim to have inspected their websites.

## Current architecture reconciled with the design

| Concern | Actual 0.15.27 ownership | Required adaptation |
| --- | --- | --- |
| Workspace | `engine-workspace.js` moves existing nodes and retains listeners; `editor.js` categories still filter tool fieldsets | Replace navigation/presentation incrementally; avoid cloned controls, duplicate IDs and parallel event handlers |
| Selection | `scene-hierarchy.js` retains its own highlighted ID set; room, prop/event and light selectors remain separate authorities; viewport/model gizmos have their own selection paths | One typed selection service keyed by cell, kind and stable ID; route existing owners through adapters; preserve Shift-range and Ctrl/Cmd-toggle behavior |
| Transactions | `app.js:mutate` clones, validates, synchronizes and restarts preview, with bounded Undo/Redo; map operations, templates and defaults have separate histories | Route scene edits through existing transaction boundary. Do not fake one global history by firing unrelated Undo buttons; display history scope explicitly during migration |
| Tile rooms | `layout-editor.js` stores one `interior.layout`; `room-layout.js` generates `interior.primitives` tagged `grid-layout` | Persist intent independently of compiled output; adopt legacy room without inferring lost historical deletions |
| Generated identity | Row and wall IDs contain span endpoints. Matching IDs retain deltas/material edits; topology changes can alter IDs | Stable room/segment identities, explicit correspondence and recoverable unresolved overrides. No array-index or nearest-wall guessing |
| Independent construction | `building-editor.js`, `building-kit.js`, `building-assemblies.js`, `round-geometry.js` create ordinary primitives and assemblies | Preserve geometry; expose capabilities in the shared inspector. Do not reclassify furniture/boxes solely from labels |
| Fixed artwork | `room-editor.js` owns image alignment, floor outline, footprints, sprites, entrances/exits; `interiors.js` owns validated room data/cache | Integrate its actual plan editor as a mode, preserve image/world coordinate conversion and pixel character ruler |
| Imported architecture | Model workbenches and placement services use event instances with spatial/model data and shared assets | Treat an imported model as an instance; transform/material/collision adapters operate on that instance. Individual mesh walls are not independently editable primitives without explicit mesh-editing support |
| Doors | Event/door/hub workbenches already configure interaction, destination and arrival; `scene-transition.js` uses fade/melt/door/immediate services | Link opening, physical assembly and existing event. Do not implement another transfer state machine |
| Collision | Room primitives, floor support, terrain and imported meshes have separate runtime services | Debug the effective runtime collision, not an approximate editor-only outline; edits invalidate affected caches at commit |
| Combat/cameras | Existing gameplay owns camera switching, fixed/isometric modes, event enemies and projectiles | Editor visibility and camera state never rewrite runtime presentation or enemy/save state; retain locked 0.15.17 sprite tilt |
| Persistence/export | Validated worlds, project library/defaults/assets, runtime saves and editor preferences have separate ownership | Versioned opt-in authoring extension; maintain unknown supported legacy records; portable project and runtime export round trips are release gates |

### Primary conflicts to resolve before retiring controls

1. `interior` currently represents a cell-wide physical/presentation configuration, not a list of architectural rooms. A new Room object must not replace it mechanically.
2. One grid-layout group per cell cannot represent several independently regenerable rooms. Each adopted/new generator needs a namespaced room identity; legacy IDs and event references must remain stable through adoption.
3. Recipe plus primitive output currently coexist as saved data. During compatibility migration output must be a derived materialization, never a second independently writable authority. New-format consumers rebuild from recipe/overrides; legacy records remain authoritative until explicitly adopted.
4. Topology-changing regeneration cannot always preserve an override safely. Keep unmatched edits and block destructive commitment pending explicit resolve/keep/detach decisions. A warning after silently losing edits is insufficient.
5. Door jambs/lintels cut generated walls, but do not remove any coincident imported/independent wall. Preview must identify the host and detect conflicting solids.
6. Current map navigation intentionally starts a fresh playtest. In-game travel preserves journey state. Do not unify these by changing save semantics accidentally.
7. Current transactions restart the preview. Preserving editor camera/selection across restart needs an explicit editor-state snapshot, separate from gameplay save state.

## Target interface and control migration

| Current controls | Destination / replacement | Preservation requirement |
| --- | --- | --- |
| Project new/open/save, export world/project/playable folder | File/Project menu, explicit save type | Clearly distinguish authored project, single world and playtest state |
| Active map, new/rename/duplicate/delete map, templates/folders | World → Cells | Keep delete guards and incoming-link explanations; retain explicit map-history scope |
| Map connections, entrances/exits, travel settings | World → Connections and selected Door/Arrival inspector | Existing event and arrival IDs remain the source of truth |
| Build Structures, Tile Room Editor, Interior authoring, Build rooms/modules | Build → Draw Room / Pieces / Background Plan | One destination per capability; keep legacy access for parity until validated |
| Paint/erase grid; finish outline/cancel drawing | Active tool options and viewport/plan | Separate occupancy painting from individual part deletion; drafts are explicit |
| Surface/role textures and thumbnail palettes | Build → Paint Material; selected-surface inspector | Shared material picker; retain role defaults, texture upload, UV scale/rotation/offset/aspect |
| Box numeric fields, building gizmos, model transforms | Contextual Transform inspector with typed adapters | Units and supported axes explicit; common multi-selection properties only |
| Scene search/select/edit/delete buttons and row delete | Hierarchy and contextual selection toolbar | Preserve multi-selection and stable scroll/focus; never delete shared assets through instance Delete |
| Prop/model/furniture catalogs, shared library, placement preview | Objects/Build → Asset Browser | Keep source assets, per-instance overrides, connector snap and explicit preview confirmation |
| Event pages, reusable types, enemy events, door/item placement | Events palette and contextual workbenches | Preserve full event vocabulary and limitations, archetypes, muzzle calibration and respawn settings |
| Terrain/landscape/water | Build → Terrain | Keep brush options and existing terrain collision/render ownership |
| Background image/camera/room scale | Environment and Background Plan context | Preserve pixel scale and image-to-world alignment |
| Local lighting, sky, fog, cloud, soundtrack, Vectrex | Environment | Separate placed light selection from global environment settings |
| Fonts, weapons/ammo/items, blood, skills, defaults | Project Settings / Gameplay | Preserve Checkbook/Arial selection, cream/synth identity, arsenal and definitions |
| Muzzle/Aim, normals, diagnostics/collision views | Tools / contextual Advanced | Advanced does not mean removed; source-specific editors remain accessible |
| Playtest/save runtime/options/controller/sound | Play toolbar and runtime menus | Hide authoring in runtime exports; input shortcuts gated by mode and focused text fields |

`CONTROL-MIGRATION.csv` maps every captured control instance to a proposed destination and carries source ownership. Items in the broad shared section are explicitly marked for contextual review; the inventory alone cannot decide every dynamic control's meaning. This is a complete inventory mapping with a review queue, not a claim of completed implementation parity.

## Normalized data model and compatibility proposal

Keep the existing persisted world as the compatibility envelope. Build a normalized editor view over its typed records, retaining the original payload and source location. Use discriminated references `{cellId, kind, id}` rather than ambiguous ID strings. Capabilities describe selection, transform, material, collision, duplication and deletion. Unsupported operations are unavailable with a reason; do not pretend all object types have identical dimensions or materials.

Add versioned authoring metadata only after validators, portable project export/import and runtime export preserve it. Proposed logical records:

| Record | Authoritative data / references |
| --- | --- |
| Cell | Existing map ID; representation 3D/fixed/hybrid derived or explicitly configured; independent presentation configuration |
| Building | Stable ID, name, optional transform policy and member IDs. Membership is organizational unless an explicit group transform occurs |
| Storey | Stable ID, optional building ID, name and elevation reference in metres. Visibility/isolation preferences belong to editor state |
| Room | Stable ID; optional building/storey references; generator recipe and revision, stable vertex/segment IDs, role materials and override ledger |
| StructurePart | Independent authored geometry or derived generated component with parent room/segment reference; existing runtime primitive data retained |
| Override | Target stable component; material/transform/suppression/opening intent; recorded generator revision; unmatched edits retained for conflict review |
| Boundary | Explicitly joined room-edge references, one physical wall, per-side materials and attached openings; intentional parallel walls permitted |
| Opening | Stable ID, host boundary/part ID, along-wall placement and dimensions in metres; physical cut-out derived deterministically |
| Door | Opening reference, existing event/assembly reference; behavior local or transfer; transition effect separate |
| Connection | Source event/exit, destination cell and explicit arrival reference/facing; links to existing transfer command rather than duplicate transfer logic |
| Prefab | Existing instance/source identity and local overrides; explicit unpack/detach |

Migration rules:

- Opening an old project is read-only adoption into the editor view. Do not automatically regenerate, rename IDs, assign conventional storeys or rewrite textures.
- Recognize surviving layout metadata and current effective geometry. Do not infer an absent wall was intentionally deleted in older projects; the owner can explicitly adopt the current effective result and review differences.
- Write an adoption transaction with original data preserved in project history/backups. Carry every independent piece, event page, arrival, shared model reference and unknown supported extension through the round trip.
- Detach preserves effective geometry/world position/material/collision, removes generator ownership and adds suppression for the generated origin. Restore Generated Part is a separate deliberate action; preview collision with detached pieces first.
- Ordinary room resize preserves stable edge identity. Split/merge/topology operations require explicit correspondence; ambiguous edits remain recoverable and unresolved, never reassigned by array index.
- Shared boundaries are intentional joins. Never automatically merge nearby walls: thickness, elevations, materials and ownership can legitimately differ.
- Refuse destructive downgrade when newer authoritative authoring records cannot be understood. New runtime/export adapters must compile effective geometry once; older runtime materializations are compatibility output, not another edit store.

## Ordered milestones and release gates

1. **Assessment and preservation:** this document, per-control matrix, reference review, fixture/project snapshots, typed adapter contract and regression baseline. No redundant UI retirement yet.
2. **Shared selection/inspection:** adapters for primitive, event/prop, model and light; single selection and common actions; contextual controls and input focus guards. Test viewport/hierarchy/plan agreement, multi-delete and one-gesture Undo.
3. **Persistent hybrid geometry:** adopt legacy generator, retain component edits/suppression, explicit detach/restore, deterministic regeneration and conflict review. Test resize, topology conflicts, save/reload and collision agreement.
4. **Integrated doors/connections:** host-based cut-outs plus optional existing door event; local versus transfer behavior, explicit arrivals; existing cinematic/melt/fade/immediate services. Handle host deletion and invalid opening size atomically.
5. **Organization/workspace:** optional buildings/storeys, shared boundaries, five workspaces, assets and material tools; integrate real plan and fixed-background editing. Preserve uncluttered default and expert access.
6. **Mixed-environment acceptance and retirement:** 3D exterior plus local-door interior, cinematic transfer to prerendered cell, melt to isometric/hybrid cell, enemy snap-to-combat and return, save/reload. Only then retire mapped redundant entry points, with complete Windows and Mac-browser packages.

Each implementation milestone must be a usable tested slice. A future feature is not represented by a working-looking button. Preserve the old implementation privately for parity checks until replacements pass; everyday UI should expose one canonical operation.

## Regression and acceptance plan

| Gate | Evidence required |
| --- | --- |
| Baseline preservation | Existing layout/building/assemblies/arrival, model, event, enemy, projectile, font, travel/save and sprite guard suites; function-comment coverage |
| Source/recipe integrity | Deterministic compile, deleted wall remains deleted, painted material/UV persists, detached part never duplicates, unrelated cells/parts unchanged, unresolved override recoverable |
| Selection/history | Typed IDs cannot collide; deleted/stale targets safe; text input never triggers Delete/G/R/S; Shift range/Ctrl toggle retained; reject rolls back all linked changes; one drag one transaction |
| Visual/collision agreement | Floor/wall/ceiling deletion checked with actual player/projectile services; doors have real headroom and no hidden overlapping wall; stairs and raised floors traversable |
| Door/travel | Local doors do not transfer; transfer commits once; arrivals exist and are supported; cinematic/melt/fade/immediate across 3D/fixed/isometric; reciprocal links only after explicit anchors |
| Organization | Group membership does not move world coordinates; hide/isolate does not change exported collision; shared wall has one physical representation; parallel walls remain possible |
| Project round trip | Legacy project import, new save/reopen, export/import, runtime package load; authored data distinct from runtime inventory/deaths and editor preferences |
| Mixed presentation | Combat camera changes preserve actor positions, enemies, doors, inventory and switches without unintended cell reload; fixed-image alignment and locked sprite presentation retained |
| UI parity | All migrated controls have owners/destinations and exercised workflows; no duplicate IDs/listeners, nested full-page scrolling or invisible rejection; small and large windows checked |
| Distribution | Complete new source/docs/function reference and independent Windows/Mac-browser packages; previous releases retained; archive file/hash verification and browser smoke tests |

Current status: source assessment and screenshot review complete; migration matrix prepared separately. No new editor release or replacement feature has passed these gates yet. High/smooth performance remains a user-run check unless explicitly added to this iteration's validation scope.
