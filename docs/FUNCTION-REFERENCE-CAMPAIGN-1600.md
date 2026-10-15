# October 15, 2026 — function-reference supplement: campaign shell

Supplements FUNCTION-REFERENCE-0.15.24.md and the Test 4/Test 5 supplements. Every function also carries its full contract in its source comment.

## `FrontierCampaign` (src/campaign.js)

Pure functions; none mutate their arguments.

- `derive(maps)` → `{areas}`: one area per distinct map folder, in first-seen order; maps without a folder go to "Main area".
- `reconcile(campaign, maps, preferredAreaId?)` → `{areas}`: repairs any input to the invariants (≥1 area, unique IDs, each map exactly once, only existing maps). Unplaced maps join the preferred area, else the first. Missing campaign → `derive`. Never throws.
- `validate(campaign, maps)` → `{areas}`: returns the campaign only if it already meets the invariants; otherwise throws "Campaign areas must list each map exactly once and use unique IDs."
- `areaOf(campaign, mapId)` → area or `null`.
- `addArea(campaign, name, index?)` → `{campaign, id}`. Throws for blank/over-80-character names or beyond 256 areas.
- `renameArea(campaign, id, name)`, `moveArea(campaign, id, step)`, `moveMap(campaign, mapId, areaId, index?)` → new campaign. Throw readable errors for unknown IDs or invalid input.
- `removeArea(campaign, id, targetId)` → new campaign with the area's maps appended to the target. Refuses the last area or target = removed area.

## Map library controller additions (src/map-library.js)

Published to authoring builds as `window.FrontierMapLibrary` (src/app.js).

- `campaignView()` → detached `{title, active, campaign, maps:[{id,name,folder}]}`; reconciles first.
- `updateCampaign(candidate)`: strict `validate`, adopt, refresh selectors, schedule saving.
- `renameCampaign(title)`: sets the 1–80 character project title.
- `renameMap(id, name)`: renames any map; ID unchanged.
- `preferArea(id)`: the next new map joins this area.
- `refresh()` now reconciles `project.campaign` and dispatches `frontier-campaign-change`. Map-operation history (`mapHistory1524`) records the campaign with each before/after membership, so undoing a delete returns the map to its area.

## Campaign shell (src/campaign-shell.js)

Self-installing authoring pane; no public API. Key internal operations: `commit(candidate, message)` (campaign Undo/Redo, 50 steps), `travel(from, to, label)` (Undo/Redo reconciled against current maps), `openMap(id)` (dispatches the Active map picker's change), `newMapIn(areaId)`, `runOnMap(id, buttonId)` (routes to the existing Duplicate/Delete current map buttons), `inlineRename`, `showMenu`, `confirmDeleteArea`, `render`/`queueRender` (skipped while a rename is open).
