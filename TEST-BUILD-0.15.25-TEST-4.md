# Sprite Frontier 0.15.25 Test 4


## October 14, 2026 — Test 4 room movement and tile drafting

Current behavior supersedes Test 3 handoff and boundary-stroke behavior. Entering playtest retains a clear editor XYZ position. If editor noclip or an edited spawn overlaps room collision or lies outside the painted floor, the runtime tries nearby supported points and authored tile centres, checking full body clearance. It does not rewrite the spawn, geometry or camera. If no clear point exists, it remains in the editor and reports the problem. Both editor/playtest transitions focus the game view so a hidden form control does not retain keyboard ownership.

Tile painting and doorway insertion validate proposed additions before changing the draft. Out-of-bounds/capacity failures leave a usable draft; later paint and erase work without discarding it. Invalid dimensional fields preserve the previously rendered grid and show a correction message rather than clearing the canvas. Plan canvases and fieldsets fit the left dock, and touch painting suppresses browser scroll gestures.

Validation: production browser controls reproduce a wall-overlapping saloon spawn, enter playtest nearby and move with WASD; reject an edge stroke then paint/erase/apply successfully; preserve canvas pixels during invalid input; verify dock bounds. Existing editor altitude/playtest, terrain/input and locked sprite-presentation checks are retained. Performance profiling remains with the user.

Complete Windows and Mac/browser packages; previous releases are preserved. General feature limitations from TEST-BUILD-0.15.25-TEST-2.md remain applicable.
