# Iteration 0.16.24 — horizon atmosphere and first-person sprite stability

November 1, 2026. Refines the earlier geometry-only fog rule without restoring a uniform sky tint.

## Atmosphere

Distance fog now has a continuous background bank. Distant empty space near the real camera horizon is filled with the effective far-fog color; a smooth upward transition blends it into the existing sky. Distant terrain/sprites/models retain their existing depth fog and converge on the same color. The bank draws after sky and before world geometry, so foreground assets, HUD and first-person hands are not painted over.

The horizon follows camera pitch and the active first-/third-person projection center. Fade extent responds to the existing fog end distance and projection. Existing map fog enable/color/start/end and runtime overrides remain the controls; no parallel fog setting is introduced. Upper sky artwork remains intact. Fixed/prerendered rooms, indoor geometry and orthographic/isometric views do not gain an artificial horizon; their existing geometry fog remains supported.

One pooled four-vertex mesh is added to the existing world submission per renderer. No volumetric simulation, textures, depth readbacks, particles or per-frame resource creation. A plain Canvas fallback uses a bounded set of four-pixel bands. Below the horizon, a camera ray/reference-ground-plane distance fades out nearby background fog, keeping empty vector foreground clear.

## First-person sprite sizing

User reported excessive apparent sprite tilt/zoom/receding in first-person while third-person is correct. The current artwork scale was derived from projected feet depth, which changes with look pitch and camera eye height. First-person now uses horizontal camera-forward distance for sprite pixels/metre; looking up/down at the same horizontal position no longer changes the image's scale through that feet-depth coupling.

This is a first-person-only scale correction, not a replacement upright/cylindrical billboard system. Camera-facing plane, aspect, frame selection, projected feet anchoring, normal lighting and physical collision remain independent. Third-person/isometric/authoring return the original scale exactly. Physical actor size/position and projectile aiming do not change. If a further art-plane inclination change is desired after testing, that remains a distinct presentation decision rather than an unannounced change to the locked third-person behavior.

## Validation

CPU checks cover fog enable/runtime override, indoor/isometric exclusions, pitch tracking, opacity and exact third-person scale preservation. Actual GPU pixels verify unchanged upper sky, full fog color at the empty horizon and clear near foreground, pitch movement and mesh reuse. Existing centered aim, projectile lighting, live normals and comment coverage remain regression gates. Performance evidence confirms the existing world-submission/cache contracts rather than promising zero GPU cost. Full Windows delivery gets offline executable acceptance and archive verification.

Warmed draw-only timings on this workstation: enabled normal maps median third/first/isometric 5.8 / 5.8 / 5.6 ms, p95 6.3 / 7.1 / 6.5 ms; one world submission/frame and no recurring warm normal generation. An initial warmup run timed out while resources were still pending; the subsequent isolated run settled and passed. These measurements are not universal FPS or zero-cost guarantees.
