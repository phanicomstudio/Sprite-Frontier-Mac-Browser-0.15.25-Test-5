# Iteration 0.15.8 — map event authoring

In authoring mode (F2), right-click the ground and choose Create event here. Right-click an event to edit, duplicate or delete it. Right-drag still turns the camera. Gameplay right-click retains inspection.

The editor opens a draft with map coordinates filled in. Configure visible height, elevation offset and grounded or flying behavior inside it. Grounded events follow terrain; flying events maintain their starting altitude during movement. Through controls the existing two-dimensional collision footprint.

Use pages for conditional states. Each page supplies appearance, conditions, movement, priority, collision, trigger and ordered commands. Starting points cover dialogue NPCs, pickups, scenery, doors, map transitions, enemies, quest interactions and scripted sequences. These use the same event model. Commands support dialogue/choices, switches, variables, inventory, journal, branching, waits, movement and map transfers.

Apply commits the draft as one undoable edit. Cancel discards it. Apply and playtest commits and runs the event; Return to event editor resumes a new draft. Creating, editing, duplicating and deleting use project history. Save/export/import preserve authored events; import remaps event map destinations alongside map exits. Export the project before moving between Windows and browser editions, since browser storage is local to its profile.

This is an RPG Maker-inspired editor, not full MZ compatibility. Custom movement routes, animation timelines and arbitrary scripts are explicitly unsupported. Flying does not supply unrestricted 3D navigation. Enemy presets use the existing combat system. The forest starts without enemies; authoring one intentionally adds it.

Validation includes context creation/cancellation, ordered dialogue commands, duplicate/delete, undo/redo, isolated drafts, playtest/return, saved-project reload, project JSON round-trip and room placement. Existing engine tests and new height/map-transfer tests pass. Chrome on Windows is the browser test environment; native macOS has not been tested. Native Windows launch acceptance has not been repeated for this release.

Complete Windows and Mac browser packages include all assets and source. Extract into a new folder. Windows: Launch Sprite Frontier.cmd. Mac browser: open index.html in Chrome. No earlier iteration is required. This release uses fresh 0.15.8 map/template/calibration storage to avoid stale generated data.
