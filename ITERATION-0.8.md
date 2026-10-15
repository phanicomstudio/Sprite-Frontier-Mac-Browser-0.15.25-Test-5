# Windows iteration 0.8

This build extends verified Windows 0.7 without changing its packaged release. Electron 44.5.1 and PixiJS 8.22 remain in use.

F2 opens in-level authoring. Select an event and choose Edit event pages, or double-click an event. The dedicated event window contains page tabs, conditions, appearance, movement, priority, trigger and ordered commands. Show Text can be a conversation that waits for Continue or a non-blocking inspection log. Show Choices stores a one-based result in a variable. Conditional branches compare page-style conditions; Else and End provide indented flow. New branches insert their matching End automatically. Select a command row to insert before it; copy/paste and reorder controls are available. Structural edits are validated atomically, so incomplete branches are rejected.

Test this event starts an isolated session. Return to event editor restores the authoring camera and position. The debugger lists active pages, execution position and switches/variables; it samples only while the workbench is open. Templates save authored event definitions locally, without runtime state. Export worlds for durable backups.

Drag selected objects directly on terrain. Elevation is a signed integer in feet: zero rests on terrain, positive raises and negative sinks. One foot is 0.3 engine units. Offset persists on hills and through save/export/import; object size is separate. Undo and Redo cover authored transactions. Optional grid snapping and collision overlays remain future work.

Soundtrack pickers list exploration/combat folders. Refresh audio folders discovers new files through a fixed-folder sandbox bridge, without loading sound data. Add/remove playlist entries, then Apply soundtrack. Map override uses exploration files; an empty override uses global exploration. Missing files are flagged. The world export includes a static catalog; current full-game export remains future scope.

The Conversation test NPC has two pages and a choice/self-switch transition for testing. Parallel pages allow normal gameplay while executing, except conversational prompts; one bounded round-robin interpreter schedules automatic pages. This is an MZ-inspired native editor, not full MZ command/plugin compatibility. Complex movement routes, topic forms and a full shipping-game exporter remain future scope.
