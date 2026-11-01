# Sprite Frontier 0.16.16 — retained HUD dithering

November 1, 2026. Supersedes recurring whole-HUD capture and output-density palette processing in 0.16.15. Original palette/search equations, controls, supplied swatches, single world submission, transformed shaders and locked sprite presentation remain intact.

The main avoidable cost was DOM HUD capture: its original 10 Hz cap still allowed complete style cloning, image serialization and GPU upload repeatedly when nothing changed. Gameplay now retains independent device-panel images. An unchanged HUD reuses its texture; an ammo change rebuilds its weapon display only. The portrait owner exposes a paint revision so canvas pixels update without periodic whole-HUD snapshots. Blank gameplay editor overlays do not invalidate capture. Other visible canvases retain a bounded 4 Hz refresh fallback. Capture failures restore the original visible, interactive DOM controls.

Gameplay cloning yields after approximately 3 ms of preparation between elements. One initially uncached image encode can exceed that target; first-use capture, SVG decode and texture upload still have costs. Pause and authoring retain their established whole-window capture path. This is not a universal zero-cost or FPS guarantee.

The palette filter now processes logical game pixels at resolution 1 for every supported display density, including transition composition. Output scaling remains owned by the existing renderer. This intentionally keeps Bayer cells aligned to logical pixels instead of multiplying work by display density. Original shader math is unchanged.

Validation: original-plugin GPU pixel comparisons; real HUD reuse, changed ammo and one-panel rebuilding; supported output-density checks; upright custom-shader projections; textured world/HUD toggles/presets/pause; projectile-light persistence and actual emitters; core suites and comment coverage. Performance acceptance checks work elimination rather than fragile machine-specific FPS thresholds. A stationary measurement observed zero new captures across 1.5 seconds; startup/layout changes can require an additional capture.

Automatic normal maps are not enabled in this performance-only iteration. The confirmed next scope is world materials and sprites, excluding UI and skies, with authored normals taking precedence. The existing offline Sprite Fusion workbench remains available; automatic world-material normal consumption requires additional renderer integration, not merely writing unused PNGs.
