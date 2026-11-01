# Live normals function reference — November 1, 2026

This supplements retained source comments and the 0.16.17 history. Current behavior is defined in ITERATION-0.16.18.md.

- `FrontierAutomaticNormals.image/load/pixels`: retain original native albedo and publish separate real normal images/RGBA records. Source hashes, layout validation, serial generation and bounded storage remain authoritative. Historical relief-return contracts are superseded by adjacent dated comments.
- `generate`: emits bounded real PNG normals; `lit` is an empty compatibility field for new records. Prior cached records may still contain unused relief.
- `FrontierLiveNormals.authored`: identity-safe custom decode, 64 MiB cache, asynchronous error fallback, explicit removal/default restoration.
- `normalSource/releaseNormal`: shared clamp/repeat GPU sources and cold eviction, independent of albedo ownership.
- `uniforms/mesh`: bounded per-pool typed light uniforms and four-vertex live material; exact sprite crop, mask, transform, opacity and camera-facing basis.
- `tangentGLSL`: world/UV derivative basis for slopes and rotated textures; evaluate before divergent lighting branches.
- `basis/sample`: retained transparent-model CPU fallback with matching normal directions, radius/falloff/color, sun and room blockers.
- `terrainLighting.prepare`: adds normal texture/uniforms to the existing mesh and light data, including animated water's original vertex/UV ownership.
- `geometryGPU.draw`: receives optional orthographic flag; shares the bounded texture LRU between albedo and normals and keeps original world depth/fog/occlusion.
- `modelRenderer.material/triangle`: keeps per-material authored normal texture and scale, preserving source channels and fallback behavior.
- `render.candy`, `interiors.furniture/background`, `pixi.drawImage`: supply physical surface descriptors without changing projection. Fixed artwork is a calibrated plane approximation.
- `localLighting.frame`: existing light budget/emission plus outdoor-only authored sun orientation; shadow renderer contracts unchanged.

Validation successors: `tests/browser/live-normals1618.cjs`, `automatic-normals1618.cjs`, `normal-performance1618.cjs`; historical tests remain intact. Relevant existing lighting, projectile, model, runtime and door suites remain required.
