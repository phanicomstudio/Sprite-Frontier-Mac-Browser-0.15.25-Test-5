# Sprite Frontier 0.15.13 — in development

Exact static geometry collision is implemented with shared local BVH data and continuous horizontal body sweeps. The editor offers None, actual model geometry and custom boxes. Orange translucent collision triangles provide a direct visual reference in authoring/debug mode. Interaction zones stay independent. Model mode replaces the legacy event footprint; NPC queries use their own bodies, and transparent appearance does not remove collision.

67 source regression commands passed. Focused browser checks prove actual WASD doorway passage/wall blocking, collision-mode controls, hidden/visible mesh overlay, debug hits and project roundtrip. Full remaining browser acceptance is running. The portable export/import gate remains pending: project downloads and an unrelated minimal text download are both canceled by the current browser environment.

See MODEL-GEOMETRY-COLLISION.md for workflow and current vertical-physics limitations, and MODEL-PERFORMANCE.md for scoped measurements. Complete new Windows/Mac browser packaging and final verification remain to be done. Earlier releases are preserved.

All 14 other browser commands passed. Authoring through the real game renderer shows the mesh overlay without page errors. Model-library download acceptance remains explicitly pending. Complete iteration candidate archives are being built for review/playtest.
