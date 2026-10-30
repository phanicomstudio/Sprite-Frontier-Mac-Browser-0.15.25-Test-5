# Function changes — 0.16.14

`DrawContext.begin()` retains and resets `drawStage` before pooled world assembly. `end()` applies existing world effects to that owner and submits the root once. World drawing services append to `drawStage` rather than the HUD root.

`hudCompose()` and `composeMelt()` append overlays without moving finished world meshes or rendering an intermediate world copy. Removed `composeWorld1613()`; its additional submission and texture are superseded.

Terrain, sky, shadows and isometric reveal vertex shaders consume the active Pixi projection/world/local matrices. UVs and physical lighting coordinates are unchanged.

See tests/browser/projection1614.cjs for exact upright GPU quadrant checks and tests/browser/dither1614.cjs for preset toggles, visibility, pause/resume and one-submission regression.
