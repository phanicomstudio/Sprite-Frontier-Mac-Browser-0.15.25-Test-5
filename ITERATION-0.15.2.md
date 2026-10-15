# 0.15.2 — editor audit and room corrections

## Event authoring

The audit uses the real editor forms to place an NPC, author dialogue and choices, branch on the answer, award an item, update a journal entry and enable a second page. It also checks page copy/delete, complete-branch copy/paste, invalid-input rollback, undo and world export/import.

Corrected problems:

- Conditional Branch / Else / End were incorrectly listed as page conditions and missing from the command menu. They now belong to Contents → Logic. Page conditions list only supported activation conditions.
- Deleting the selected last page could read a nonexistent page in the preview. Page indices are now bounded during deletion and preview.
- Rejected edits could leave runtime events out of sync with the restored authored world. Rejection now restores both and reports the error inside the modal event editor.
- Command insertion selection could carry into another event/page. Changing context clears it; Append at end clears it explicitly.
- Copy/paste of a branch marker could orphan its End. Copy now includes the whole conditional block; Delete on the branch removes its block. Structural arrows are disabled; use whole-block copy/paste to relocate branches.
- World export/import controls now appear under Map.

## Try dialogue

Import **examples/Dialogue-room.json** under F2 → Map → Import world JSON. This replaces the active map; export your work first. Open F2 → Events, select Dialogue audit NPC, then Open event pages. Test this event starts the conversation; choose the second answer to receive the test token and journal entry and activate the Accepted page. The test uses a fresh runtime; Return to event editor restores authoring mode.

For your own event: F2 → Place → choose Event and click the floor. Select it and open Event pages. Name the event/page; choose the graphic, interaction trigger, reach and blocking behavior, then Save page. In Contents add Show message and keep Conversation checked for a dialogue window with Continue. Show choices records a **1-based** answer in the named variable. Add Conditional branch with that variable and a minimum value. A matching End is added automatically. Select End to insert commands inside the branch; use Append at end for commands after it. Page conditions and branch numeric conditions use “at least,” not exact equality. Higher-numbered matching pages take precedence.

Add a second page conditioned on Self switch A and use Set self switch A ON in the initial branch for one-time conversations/rewards. Test this event and Return to event editor provide a short iteration loop. Changes apply through Save/Add/Update buttons; closing does not apply unfinished form fields. Errors appear inside the event window. Export world or Export all maps preserves authored data; Export state preserves a live playtest.

## Room and movement corrections

- Fixed-camera rooms select the nearest of eight whole-sprite firing directions. Bullets travel horizontally from the calibrated muzzle in that direction, retaining weapon spread/calibration offsets. The crosshair selects a direction rather than an exact arbitrary impact point. No rotating arm/pivot layer is required.
- Room Test's exit is outside the floor. Its connected opening permits walking across the floor boundary into the exterior trigger. The exit marking is drawn outside the room; disconnected exterior circles do not open collision boundaries.
- Regular cursor is hidden over the view while armed fixed-room aiming is active. P mode continues to use its interaction cursor; editor controls retain their cursor.
- A brief movement tap shows one walk frame for up to 0.1 seconds, then returns to idle. Release does not continue advancing animation. Sustained input still cycles, and physical movement stops immediately on release.
- The editable scale ruler, fixed-room zoom and normalized projected movement from 0.15.1 remain available. The room's current character scale remains yours to tune.

Third-person per-sheet barrel/crosshair calibration remains banked; this release does not implement a second barrel guide point. Multiplayer replication is future work. Normal maps, simple boxes and painter ordering retain the documented 0.15 limitations.

Browser acceptance and source regression checks passed. Native Windows launch was not retested. The audit verifies the listed workflows, not every possible authored combination; invalid data remains validated before import/apply. Performance timings are headless Chrome draw submission, not native FPS.

Performance: the final comparable large-map run measured 9.0 ms median / 13.0 ms p95, versus 9.7 / 14.3 ms for 0.15.1 in the adjacent run. Fixed-room stress with 128 normal-lit sprites measured 0.9 / 2.3 ms; 128 boxes measured 4.1 / 6.7 ms. Timings vary with system load; heap snapshots also vary with garbage collection timing. No new full-frame processing is added. Collision/face/texture/filter caches and event-driven previews remain in use.
