# Iteration 0.15.14 — walkable static model geometry

Complete source iteration with model surface support, stairs, roof/box-top landing and ceiling response. Select Use actual model geometry (static) in the event spatial editor. Existing models, zones, sprite events and maps remain supported. Previous iterations are preserved and storage keys are versioned.

Validation: 68 source commands and 15 browser commands passed. The browser test imports a glTF stair/platform, walks up with W, jumps and lands with E, then falls off to terrain. Source tests add thin-wall sweeps, fast landing, transformed roofs, low stair headroom and 45-degree support limits. These use synthetic geometry; the user's building has not been imported in this test environment.

Limitations: static meshes only; no moving-platform or deforming collision. NPC horizontal geometry blocking remains available, but NPC stair/jump navigation remains terrain based. Materials support the documented base-color renderer rather than full PBR. Project-download finalization is still a separate pending verification gate because this environment cancels even minimal unrelated text downloads. Windows desktop startup was confirmed by the user's 0.15.13 screenshot; 0.15.14 native startup and macOS browser behavior require fresh verification.

Architecture: model-mesh-collision.js caches triangle BVHs and handles continuous body sweeps and support rays. model-collision.js adapts event instances, footprint probes and stair clearance. terrain.js combines terrain, old sprite tops and model support; app.js supplies the game context. Interaction targets continue to use independent named zones. See MODEL-GEOMETRY-COLLISION.md and MODEL-AUTHORING.md.
