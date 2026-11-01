# 0.16.15 validation

October 31, 2026. Reproduced the reported checkbox-only workflow: it was a form draft discarded on playtest. The immediate transaction fix passes the new real browser regression: check without Apply, fresh playtest, disable, Undo, original IndexedDB save/reload, real calibrated projectile-factory lights across first/third/isometric camera presentation, budget cap and explicit per-weapon opt-out. Canonical saved ambient/player/source/sun/shadow settings and normal bank remain unchanged.

All 62 core scripts passed. The dedicated test:lighting gate passed radius/falloff/occlusion/budget/despawn/cell-isolation and dropped-light checks; weapon override validation; normal-lighting direction/alpha; normal-bank validation; cache cancellation/reuse; real GPU terrain ambient/radius pixels; integrated Sprite Fusion generation of the native 1200×2400 Chiban sheet, Apply, validated roundtrip, Undo, runtime worker preparation and failed-job retention. Function-comment coverage: 7,120 functions.

The recent 0.16.14 shader projection and filtered-world visibility/submission regressions were rerun. Sprite Fusion vendored files were checked against their pinned SHA-256 provenance, including generated WASM/glue and license. No upstream generator code or rendering algorithm was changed for this correction.

No test opens a user profile or modifies authored user projects. Per-weapon custom lights and explicitly disabled maps retain their existing semantics. Other numeric lighting drafts still require Apply. Regression tests reduce future risk without claiming that all possible future changes are proven safe.
