# Editor redesign foundation — 0.16.0

October 22, 2026. Implementation basis: the complete **UI Audit Setup** discussion, all 13 supplied screenshots and the reconciled 0.15.27 source assessment. This is the first implemented migration slice, not completion of every proposed 0.16.x milestone. The full contract, data-model proposal, risks and later acceptance scenarios remain in `EDITOR-REDESIGN-PLAN-0.16.md`; every captured control has a proposed destination in `reference/CONTROL-MIGRATION-0.16.csv`.

## Available in this release

- Five workspaces: **World, Build, Objects, Events, Environment**. Compact top controls include Playtest, active cell, Undo/Redo and Project/Tools. The left creation palette stays visible while the hierarchy list scrolls. The live viewport occupies the centre; the contextual inspector is on the right, following the latest supplied mockups.
- Typed scene selection distinguishes cell, object kind and stable ID. Hierarchy range/toggle selection, common-property inspection and atomic multi-delete share that service. Existing viewport surface selection routes into it. Single structural surfaces expose position, dimensions, rotation and material; other supported records expose common name/position fields. Specialized model, event, round-geometry, UV and light controls remain available through their owning tools.
- **Build → Draw room** uses the existing generator controls and large plan canvas inside the workspace. Scene, Plan and Plan+scene are editor presentation options. **Background / collision plan** uses the actual existing artwork/collision plan. The same authored world and existing transaction/history callbacks remain authoritative; switching views does not change gameplay cameras or sprite tilt.
- Generated deletion is persistent intent, not merely removing a cached primitive. An individual wall, floor or ceiling deleted through any ordinary world transaction remains suppressed when the same recipe regenerates. Materials and transform deltas are also captured separately. Generated parts stay linked until **Make independent**; detachment preserves the effective geometry under a new independent ID and suppresses the origin so regeneration cannot duplicate it.
- **Generated edits / restore** explicitly restores a chosen generated origin. Detached geometry remains independent. The UI warns that restoring an origin can deliberately overlap a detached piece; Undo reverses the operation.
- Compatible generator changes retain edits. Topology changes that lose edited identities are rejected before commit with the conflicting component ID; current data and its ledger remain recoverable. This release does not guess correspondence or silently discard an edit.
- Delete and Ctrl/Cmd Z/Y work when authoring owns keyboard input. Text/select/contenteditable fields and modal dialogs retain their own input. Escape returns to selection. Existing gameplay shortcuts remain governed by the runtime.
- Sprite Fusion replaces automatic silhouette normal generation. See `SPRITEFUSION-0.16.0.md` for the exact local Rust/WASM integration, native frame handling, user workflow, limits and commercial-use notices.

## Existing capabilities are preserved

**Project / Tools → Advanced tools / compatibility panels** retains original controls and listeners for parity during migration. Tool palettes move the actual owning fieldset into contextual settings, then return it when changing tools. Event, enemy, model, normal and gameplay workbenches keep their existing validated callbacks. Source comments and earlier documentation remain intact.

This release does not collapse all history systems into a misleading global Undo: scene transactions, map operations, reusable event templates and gameplay defaults retain their existing owners. The top Undo/Redo controls are scene history. Map/default/template histories are still available in the corresponding compatibility panels. Runtime exports omit the new authoring services and generator payload; existing normal-binding shading remains in the exported game.

## Still scheduled, not represented as completed features

Optional Buildings/Storeys, multiple independently generated rooms per cell, persistent segment IDs through topology changes, conflict-resolution UI, explicit shared boundaries, integrated host-cutting functional doors, a cell-connection graph, broad multi-transform/material painting and the complete mixed-environment saloon acceptance scene remain subsequent implementation milestones. Existing construction/doors/transfers are retained; these future replacements are not working-looking placeholder buttons.

The old grid generator still identifies rows and wall runs by span endpoints. The edit ledger fixes deletion and compatible regeneration now; it is not a claim of full polygon-room correspondence. Legacy primitive materialization is retained as a compatibility stage. Recipe/intent authority and a normalized editor adapter prepare the later schema work without rewriting every existing map into an unproven format.

Plan mode here integrates existing generator and collision/artwork tools. It is not yet a new universal plan gizmo for every imported mesh or arbitrary object type. Group hide/isolate, configurable G/R/S manipulation and reciprocal door creation are likewise not advertised as implemented. Current runtime cinematic/melt/fade/immediate transfers, fixed/isometric cameras and event enemies continue to operate through their established services.

## Upgrade and data handling

Windows 0.16.0 uses an independent `Sprite-Frontier-0.16.0` application profile because new full-size normal bindings can exceed older validators. Export a portable project JSON from your previous release and import it through World. No old profile, project or release is moved/deleted. Browser storage remains tied to its normal origin; a newly extracted file package may have a different storage context. Keep a portable project backup.

Old maps are not regenerated merely by opening them. Existing generated pieces retain their IDs until explicitly edited or detached. Historical absent parts cannot safely be inferred as intentional deletions; the ledger records new operations. Runtime inventory/enemy state and editor view/selection remain separate from authored map data.

## Validation

`RELEASE-VALIDATION-0.16.0.json` records the actual completed gates. The new browser scenarios cover five-workspace startup, integrated plan, hierarchy/inspector, compatible regeneration after deletion, restore/detach, actual upstream WASM and native-resolution profile binding. Existing combat/enemy/font/travel/item regression scenarios run through preserved compatibility controls; they do not substitute for new-UI acceptance.

Three older regression harnesses depended on one-line formatting/private export spacing. They now locate exact source spans or accept normal whitespace, retaining their arithmetic/cache/eviction assertions. The historical clipping reference is bundled unchanged so the test no longer needs a neighbouring release directory.

High/smooth performance, native macOS execution and completion of the full architectural redesign are not certified by this foundation release.
