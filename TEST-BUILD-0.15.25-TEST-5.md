# Sprite Frontier 0.15.25 Test 5


## October 14, 2026 — Test 5 scene selection and separate Tile Room Editor

Supersedes Test 3/4 hierarchy navigation: clicking a scene name highlights it without scrolling away. Edit selected explicitly opens its properties. Shift-click selects a visible range; Ctrl/Cmd-click toggles individual entries. Select all shown follows the search filter; Clear selection resets it. Delete selected removes the highlighted instances in one validated Undo transaction, including mixed room/event/light selections. A row Delete removes only that row. Both deletion paths retain dock/list scroll position, with normal end-of-list clamping, and preserve shared assets.

Build Structures now opens a large, separate modal Tile Room Editor. The dock launcher remains available. Wall, floor and ceiling each have a texture picker, thumbnail and PNG/JPEG/WebP file loader (8MB maximum per file). Imported textures are embedded in portable authored data. New layouts default to Tin ceiling, rather than roof tiles. Saved older textures remain available for deliberate replacement. Apply room layout commits geometry and saved role choices; its visible replacement checkbox controls whether selected textures replace existing layout overrides. Apply textures to all room surfaces updates generated or named structural wall/floor/ceiling primitives in one Undo step without changing dimensions; unclassified furniture/boxes are retained. Original compiler preservation remains the default for other callers.

The modal keeps settings and the grid in separate panes. It retains unsaved draft when closed normally; Apply/Discard are explicit. World movement is paused while this authoring window owns input; F2 closes it before switching mode. Existing mode-reset behavior for uncommitted drafts remains applicable. Original grid dimensional controls remain under Grid dimensions and room height.

Delete current map still prevents deleting the last map or a map with incoming references. Rejections now explain the reason beside the buttons, including how to create a replacement map; no silent action or removed user files. Successful map deletion, map Undo/Redo and retained subsequent edits were exercised through the real controls. Optional authored encounter/courier examples remain under Optional examples and test maps. No prior controls/options were removed. See CONTROL-CHECKS-TEST-5.md for scope/evidence; this is not a certification of every possible engine workflow.

Full new Windows and Mac/browser distributions. Earlier packages remain intact. Prior Test 2 general feature limitations remain applicable; performance checks remain assigned to the user.
