# Iteration 0.15.7 — terrain occlusion

Distant trees previously appeared inside the pool when viewed underwater. Entity positions were correct, but the renderer drew all billboards after terrain without checking whether the bank blocked them.

Textured terrain now supplies a small screen-space depth buffer from the same near-clipped triangles used for ground rendering. Sprite masks compare their camera depth with the nearest terrain at each screen region. The bank hides roots and obstructed trunk sections while visible branches remain above it. Waterline clipping and underwater viewing continue to operate. Terrain depth is cleared each frame and disabled on vector maps and rooms.

The buffer samples at two logical pixels. This is a terrain visibility correction within the existing billboard renderer, rather than a full scene depth-buffer rewrite. Close silhouettes may show small mask steps; performance measurements in headless Chrome are not native Windows benchmarks.

Validation: an underwater view of forest-tree-11 hides its root but retains upper artwork; tree coordinates and elevation match their original terrain. Above-water and underwater screenshots were inspected. Switching to the vector demo clears terrain masking. Browser checks also exercise camera clearance, forest generation, saved-library recovery and aiming. Source input/terrain, barrel, water and room regressions pass. Native Windows acceptance has not been repeated.

Delivery is a complete standalone Windows package. Extract the full ZIP into a new folder and run Launch Sprite Frontier.cmd. Choose Supplied Assets Forest Test. This iteration uses fresh local map and calibration namespaces; older stored projects are not automatically loaded.
