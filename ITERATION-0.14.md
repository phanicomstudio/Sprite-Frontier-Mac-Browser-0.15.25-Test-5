# Sprite Frontier 0.14 — Water viewpoints and shorelines

Extract the whole Windows ZIP and run **Launch Sprite Frontier.cmd**.

Open **F2 → Terrain → Water material**. Animation settings controls texture scale, surface warp strength/speed and flow. Underwater camera effect separately controls distortion enable, strength, speed and wave count. Apply water material saves those settings with the map. Imported water textures use the same animation path as the placeholder.

Water surfaces stay level but clip to sampled terrain, following slopes, basins and islands. The painted area defines their maximum extent. Lower or raise the terrain within that area to reshape the shoreline. Quarter-unit sampling approximates curved banks; there is no fluid simulation or automatic flooding outside painted cells.

Above a surface, the submerged body remains hidden. Below that surface, the body is visible. World distortion activates only when the camera is inside a painted wet area below its water height. No tint is added. Remote, portrait, weapon panels and cursor remain outside the distortion.

Cached shoreline triangles rebuild after terrain revisions or water edits. Fully wet cells use two triangles; shoreline cells use finer geometry. Visible-neighborhood culling and pooled GPU meshes remain in place.

Validation: existing simulation/authoring regression suites, shoreline and camera boundary tests, actual GPU filter rendering, editor/save round-trip, HUD/fullscreen inventory/melee/music acceptance, and large-map render submission check. Windows runtime launch was not separately repeated for this iteration; browser WebGL rendering and package integrity were verified. Swimming remains deferred.
