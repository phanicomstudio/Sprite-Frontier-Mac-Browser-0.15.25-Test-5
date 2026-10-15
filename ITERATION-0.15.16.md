# Sprite Frontier 0.15.16

Complete new Windows and Mac browser distributions. Previous iterations remain intact.

## Changes

- Ground-following sweeps the full body down before lowering feet. Previously, landing on a steep stair-rail bevel could stop the fall correctly, then the next ground update snapped the body into the bevel. This caused all movement and jumping to fail. The real building now has an angled-landing regression grid in addition to ordinary stair/roof tests.
- Third-person cameras sweep a small clearance volume from the player's chest to the requested orbit position. Solid mesh triangles and authored collision boxes shorten the boom. Walls, ceilings and corners participate; water does not. Editor inspection remains free.
- Upright sprite occlusion uses the appropriate depth at each screen row. Looking down beside a wall no longer compares the entire sprite against its feet's depth.
- Escape pauses gameplay and displays Get Unstuck and Resume. Controller Start opens the same controls. Recovery uses up to 30 recent safe points, then searches near the spawn. It clears velocities and pending step proposals without resetting inventory, events or authored maps. If no clear point exists it reports failure instead of forcing a position inside geometry.
- Every maintained function and callback has an explanatory source label and contract. FUNCTION-REFERENCE.md and FUNCTION-REFERENCE.json index all 3,624 functions, including legacy functions. The documentation-only edits were checked against parsed syntax trees to ensure unchanged behavior. A regression check rejects missing labels.

## Authoring and interiors

Continue to import GLB/glTF through the model library and choose actual static geometry collision. Model collision remains independent from door and interaction zones. Real interior floors, walls and ceilings can be traversed using the same static geometry; dress those interiors with separate props, lighting and events. This iteration does not invent interior surfaces missing from an exterior shell, add moving-platform physics or implement automatic interior-cell streaming.

## Validation and limits

71 source regression commands; existing model/event browser checks; actual building stair, roof and side-ledge traversal at four scale combinations; angled landing grid; 60 actual-building camera orbit poses; pause/recovery/resume UI. Source documentation coverage: 3,624 functions. Archives and extracted-package checks are recorded in the external release verification report.

0.15.15 native launch and stair traversal were confirmed by the user's desktop test. 0.15.16 still needs a user native playtest; no macOS host is available here. Browser checks use Windows Chrome. Existing agent-environment disk-download cancellation is a platform limitation; exact Export-button Blob contents and clean file-picker import are checked independently.

Static triangle collision is not a general rigid-body simulator. Very unusual geometry can still expose contacts requiring follow-up; Get Unstuck is a temporary recovery aid, not proof that all contacts are solved. Camera contraction is immediate and follows solid collision modes; non-solid decoration intentionally does not constrain it. Fixed-room camera composition is preserved.

## Function guide

ModelMeshCollision.build/query/sweepTriangle/support own cached geometry, continuous body contact and walkable footprints. ModelCollision.blocked/vertical/step/camera integrate those queries into gameplay. Terrain.ground controls grounded state and gravity. PlayerRecovery.safe/remember/recover own the bounded escape history. TerrainOcclusion.mask accepts either a constant depth or a screen-row depth function. Render.candy supplies upright sprite depth; Render.camera resolves orbit and solid clearance. App.releaseLook/captureLook/frame bind pause controls and retain recovery points.
