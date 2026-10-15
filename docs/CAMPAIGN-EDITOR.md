# Campaign editor

October 15, 2026. Phase 1 of the full-campaign toolset: the campaign shell and Campaign → Area → Map structure. Later phases add blueprints with per-instance overrides, campaign tools (validate all, play from here), dialogue and quest editors, and folder packages.

## The workspace

Authoring mode now has three panes, in the style of the Neverwinter Nights Aurora toolset and the Metropolis Frontier Module Editor:

| Pane | Contents |
| --- | --- |
| Left | **Campaign tree** — the campaign, its areas and their maps — and **In this map**, the list of placed objects in the open map |
| Centre | The game view you edit and playtest in |
| Right | **Inspector and palette** — the Map/Room/Terrain/Place/Events tabs, properties of the selected object, and the build and placement tools |

Playtest hides both side panes, as before. On narrow windows the right pane moves below the view.

## Campaigns, areas and maps

- A **project is one campaign**. Its name is the project title; click it at the top of the tree to rename it.
- An **area** groups related maps, such as a town with its interiors or a dungeon with its levels. Every map belongs to exactly one area.
- Areas only organise authoring. They never change map IDs, door or transfer targets, loading or performance.

### Working in the tree

| To | Do this |
| --- | --- |
| Open a map | Click it. The open map is highlighted. |
| Rename a map or area | Double-click it, or use **⋯ → Rename**. Enter saves, Escape cancels. Renaming never breaks doors or transfers, because IDs stay the same. |
| Add an area | **+ Area**. It appears after the open map's area, ready to name. |
| Create a map | **+ Map** creates one in the open map's area; **⋯ → New map here…** on an area creates one there. Both use the usual New map dialog. |
| Move a map | Drag it onto another area or between maps, or use **⋯ → Move to …**. |
| Reorder areas | Area **⋯ → Move up / Move down**. |
| Duplicate or delete a map | Map **⋯ → Duplicate** (the copy joins the same area) or **Delete map…**. These use the existing map actions, so deleting still refuses the last map or a map other maps link to, and **Undo map operation** restores it into its area. |
| Delete an area | Area **⋯ → Delete area…** and choose where its maps go. Maps are never deleted with an area. A campaign keeps at least one area. |
| Find a map | Type in **Find a map**. Areas whose name matches show all their maps. |

**Undo / Redo** under the campaign name undo tree changes (areas, map order, names): up to 50 steps per session. World edits keep the toolbar **Undo change**; map create, duplicate and delete keep **Undo map operation**.

Which areas are expanded is remembered per browser; it is not part of the project.

## Saving and older projects

The campaign is saved inside the existing project, in local browser storage and in **Save Project (JSON)**. The shape is:

```json
"campaign": {
  "areas": [
    { "id": "hub-town", "name": "Hub town", "maps": ["hub-test", "hub-saloon"] }
  ]
}
```

- Projects saved before campaigns existed get areas from their **map folders** the first time they open; maps without a folder go to **Main area**. The folder names stay on the maps and appear as small labels under map names when they differ from the area.
- A damaged or hand-edited campaign is repaired on load instead of blocking the project: unknown maps are dropped, duplicates removed, and unplaced maps join the first area. Edits made in the tree are checked strictly and rejected with a message if invalid.
- A new blank project starts with a single area.
- Exported games carry the campaign data but never show the tree.

## For developers

| File | Owns |
| --- | --- |
| `src/campaign.js` | `FrontierCampaign`: pure data rules (derive from folders, reconcile, validate, add/rename/remove/move area, move map). No DOM or storage. |
| `src/map-library.js` | Stores `project.campaign`, reconciles it on every refresh, records it with map-operation history, and exposes `campaignView`, `updateCampaign`, `renameCampaign`, `renameMap`, `preferArea`. |
| `src/campaign-shell.js` | The left pane: tree rendering, menus, inline rename, drag and drop, campaign Undo/Redo. Routes map open/create/duplicate/delete to the existing controls. Authoring only; excluded from game exports (`src/runtime-export.js`, `tools/desktop-export.cjs`). |
| `engine-workspace.css` | Three-pane layout, under the October 15 section. |

Tests: `tests/campaign1600.cjs` (data rules) and `tests/browser/campaign-shell1600.cjs` (the tree through real controls, including reload persistence).
