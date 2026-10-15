# Courier quest example

Open the editor, select the Map tab, and choose **Add courier quest example (2 maps)**. This adds a town and archive with independent identities and selects the town. Existing maps remain intact. The project needs two free slots within its 32-map budget.

The contact is at (5, 5). Accepting the task requires Speech 35. Optional Speech practice at (3, 5) explicitly sets current playtest Speech to 40; it does not change project starting values. The travel event at (8, 7) leads to the archive. Collect the letter at (5, 5), then use the archive travel event at (8, 7) to return. Delivering the letter consumes it, grants one courier-reward item and five town reputation, and completes the quest. Later conversations cannot grant another reward. The archive container remains empty after collection.

All behavior is ordinary editable event data. The two maps have flat ground and no enemies. Export all maps to keep both maps and their travel links. Runtime progression belongs in the playtest save; project export preserves authored events and starting values. Selecting a map through the toolbar starts a fresh playtest; use the travel events to retain progression.

Verified: source quest lifecycle including failed/declined checks, container gating, JSON state restore and one-time reward; source map validation and reciprocal numeric travel identities; Windows Chrome browser map creation, original map choices, selected town and linked project export. All 65 cached source fixtures passed after this addition.

The combined Windows Chrome browser scenario now also passes: failed Speech check, optional practice, quest acceptance, archive travel, collection twice, playtest save/reload, return travel, delivery twice, completed save/reload and another conversation. The test clears live inventory/quest/reputation before importing each save to prove restoration rather than merely observing unchanged state. Dialogue and choice buttons are operated through the UI; event initiation uses the runtime test hook, so map mouse interaction is a separate pending check.

Playtest progress controls now remain outside editor tabs. Export/import your playtest there without entering authoring, which starts a fresh session.

Pending: actual map mouse interaction coverage, native Windows and macOS acceptance. This source candidate is unfinished and is not a packaged release.
