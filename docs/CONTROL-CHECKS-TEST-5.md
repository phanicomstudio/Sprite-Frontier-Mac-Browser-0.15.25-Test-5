# October 14, 2026 — control checks and moved options

Compared the initialized Test 4 editor against Test 5 in isolated Chromium profiles. No user project was changed. The comparison includes hidden/collapsed controls and selects; it is not limited to the current category.

| Preservation check | Test 4 | Test 5 | Removed |
| --- | ---: | ---: | ---: |
| Buttons | 549 | 556 | 0 |
| Named input/select/textarea controls | 316 | 320 | 0 |
| Existing dropdown choices | Compared by value | Compared by value | 0 |

Every enabled inventoried button has its own click binding, an ancestor control binding or an applicable native form action. Ordinary document click listeners are excluded from that check. Disabled native-only folder export explains browser availability. Binding presence alone does not prove that a complete workflow behaves correctly.

## Changes in location and behavior

- Build Structures opens Tile Room Editor in its own large dialog. Its tile tools, dimensions, ceiling checkbox, materials, Apply and Discard controls retain their established IDs/handlers. The dock also keeps Open Tile Room Editor.
- Grid dimensions and room height are expandable inside that window. Wall/floor/ceiling texture choices are separate; each accepts an image upload. New ceilings use the existing Tin ceiling texture.
- Scene names highlight without scrolling. Edit selected is the explicit jump to properties. Row Delete stays in place; Delete selected is the new one-transaction group operation.
- Optional example-map creation controls are grouped under Optional examples and test maps; their handlers and source are preserved. Other existing categories and options remain available.
- Delete current map reports last-map or incoming-link rejection next to the map controls. Create another map before removing the last one, or retarget incoming links named in the explanation. No data-integrity guard was silently bypassed.

## Behavior exercised in production UI

Passed: Shift range, Ctrl subset, Select all shown, repeated direct deletion without scrolling, mixed event/light deletion, one-step group Undo, separate tile window, decoded custom texture upload, independent role textures, texture Undo, saved layout materials and modal keyboard ownership/F2 exit.

Passed: map duplicate/delete/Undo/Redo, preservation of later edits, incoming-link rejection, visible last-map rejection, project creation, local persistence, archive/restore and map isolation.

Passed: tile rectangle/erase/door drafting; layout commit/save/import/reload; rejected boundary strokes; retained grid during invalid input; saloon wall/spawn entry recovery and real WASD; editor altitude retention; actual stair ascent/jump/landing/descent; independent round modules and assembly move/turn/resize/duplicate/Undo; existing single-surface texture import.

Passed: maintained function-comment coverage, layout generation/arrivals and locked 0.15.17 sprite presentation. Existing source comments/history remain intact.

Not represented as newly certified here: every combination among all 556 controls, native folder-export behavior, all hardware/controller configurations, high/smooth performance, or the user's unsupplied edited project. General feature limitations in TEST-BUILD-0.15.25-TEST-2.md remain applicable. Native executable packages share the checked authoring source; their archive inventory/hashes are separately verified.
