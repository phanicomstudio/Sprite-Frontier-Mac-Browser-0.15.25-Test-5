# Sprite Frontier 0.15.25 Test 3


## October 14, 2026 — Test 3 editor layout and deletion

Supersedes Test 2 three-column authoring layout: project actions are at the top; scene, build tools, categories and original property controls share a scrollable left dock. The playable edit view occupies the right. Authoring uses readable Arial text; game rendering and 0.15.17 sprite presentation are unchanged. Scene entries expose Delete alongside their names and route through the original owner transaction; Undo and Redo are visible on the top toolbar. Shared image/model asset files are retained when placed instances are deleted.

Validation: real browser authors geometry, deletes a wall with the visible action, restores it with Undo, verifies left/right bounds, edits properties and checks playtest/runtime guards. Performance checks remain assigned to the user.

Complete Windows and Mac/browser distributions. All Test 2 limitations in TEST-BUILD-0.15.25-TEST-2.md remain applicable. Earlier packages are preserved.
