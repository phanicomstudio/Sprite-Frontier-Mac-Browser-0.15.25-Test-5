> Historical snapshot. Current controls/features/limits: README.md, CODE-GUIDE.md and TEST-REPORT-06.md.

# In-level event editor — prototype 0.2

**Updated in 0.3:** DEMO-03.md describes new mouse/controller controls, terrain, jumping and sky layers. This document covers the event-authoring workflow.

Refresh the prototype, then click **Open editor** or press Tab. The editor uses the same scene, projection, sprites and player-scale camera as playtest. WASD moves through the level; right-drag looks around. Authoring movement ignores object collision to let you reach placements. Combat and event execution are paused.

## Place and select

Choose a Scene tool:

- **Select / move:** left-click an object's visible outline/card to inspect it. Shift-drag the selected object to move its feet along the ground; a red cross previews the destination. You can also enter X/Y and click Move selected.
- **Place object:** use the existing tree/rock/sentinel/arch palette and click the ground in the scene.
- **Place event:** click the ground to create a named NPC-outline event with an interaction/message page.
- **Place ammo box:** click the ground to create a ready-to-use ammunition event.

The overview map remains an optional placement/selection aid. Selecting an event shows a red outline, coordinates and interaction-range ring. The editor sidebar scrolls to expose page and command controls. Delete and Undo work on the authored world, including events and commands.

## Pages and commands

Select an event, then choose a page to preview its appearance directly in the level. Page preview does not activate any switches. Apply page settings to save changes to the name, range, appearance, trigger, collision and condition. The last matching page wins during playtest; an event with no matching page is absent.

Current conditions: Always, Self Switch A–D ON, named Global Switch ON.

Current appearances: NPC outline, closed chest/ammo box, open chest/empty box, trigger marker. These are vector graphics, ready to be replaced by sprite-asset references in a later asset iteration.

Current triggers: interaction and player touch. Player-touch triggers on entering a 0.65-unit area rather than executing every frame while inside.

Commands have form controls rather than raw JSON:

- Show message, advanced with Continue or Enter.
- Set a self switch or global switch ON/OFF.
- Give an item. `ammo9` also adds rounds to the player's reserve.
- Wait for a specified number of seconds.
- Transfer to a safe x/y location within this level. A blocked destination is rejected.

Add, edit, delete and reorder commands. Unknown commands and invalid fields are rejected by the shared world validator. Page settings require **Apply page settings**; command edits require **Update command**. Unsaved form fields are not exported.

This is an MZ-inspired event foundation, not full RPG Maker compatibility. Choices, conditional command branches, variables, movement routes, autorun/parallel execution, event-to-event touch, arbitrary plugin commands and cross-map transfers are not implemented.

## Ammo boxes and interaction

New generated worlds include three boxes near the player spawn and a guide. Each box grants **24 rounds**, sets its own Self Switch A, and changes to its empty page. A second interaction displays an empty-box message without awarding more ammunition.

In playtest, press Space to holster, approach a box and right-click its outline. While pointer-locked, right-click targets the center crosshair. Interaction checks range and ground-space obstruction from ordinary props. Armed facing continues to follow camera aim as previously accepted. Right-drag looks around; dragging does not also interact.

## Authored data and playtest isolation

Tab returns to a fresh playtest at the authoring viewpoint when that location is safe. Playtest starts from a copy of event definitions. Self switches, inventory, pickups, messages, HP and ammunition are temporary. Returning to the editor restores the authored design; starting another playtest resets temporary state.

Export world saves objects and event pages. Import reconstructs them through the shared validator. Existing v1 worlds without an `events` array still load; their event list starts empty. This additive event extension keeps the `sprite-frontier/1` world identifier. It does not claim compatibility with Frontier module schema 0.18 or native MZ maps.

Editable event definitions/presets are in `project/events.json`; `src/event-data.js` is the checked offline mirror. `src/events.js` is the sole interpreter. `src/editor.js` owns the inspector; `src/app.js` coordinates the shared scene and authoring/playtest lifecycle. Gameplay never changes the authored world document.

## Scope remaining

Broader props and sprite libraries are planned for the next iteration. Jumping, hills/terrain heights, vector sky/parallax/cloud layers and height-aware ballistics are now implemented in 0.3. Rendering still has the documented Canvas/depth limitations.
