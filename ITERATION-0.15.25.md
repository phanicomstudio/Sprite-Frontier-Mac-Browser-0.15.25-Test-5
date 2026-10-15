# Sprite Frontier 0.15.25 — review workspace

October 14, 2026. Integrates staged usability/navigation repairs and fixed-camera launch alignment. Not packaged or pushed; user review is required before delivery. Third-person aim and locked sprite presentation remain unchanged. Previous release archives remain intact.

## Connected review changes

- Visible Build Room, Place Object, Place Door, Events, Items and fullscreen entry actions; Add Command in MZ Contents.
- Room-surface selection opens numeric Room inspector; hierarchy selection scrolls original properties into view.
- Door draft exposes placement X/Y and invalid event validation identifies the rejected field.
- Wheel zoom normalizes wheel units, accumulates a finer target and eases exponentially.
- Authoring jump/E ascends, Q descends and Shift accelerates. Editor navigation/camera bypass collision and fixed projection; ordinary playtest retains its normal movement/collision.
- Explicit Playtest requests pointer capture; fullscreen action remains accessible in playtest. Interactive/native verification is pending.
- Fixed-camera player shots use displayed affine sprite-sector alignment and calibrated muzzle, with up to five degrees of launch-only cursor correction. Normal weapon spread follows that correction; third-person/NPC paths are unchanged. Uses existing projectile/hitscan collision and lifetime ownership. No networking integration.

Checked so far: source-comment presence (5,681), locked sprite projection, event validation/interpreter, barrel guide compatibility, terrain/input/height-aware shots and branch editing. The initialized browser workspace flow passes blank cell, room preview/commit, Undo/Redo, clean playtest and export-mode guard.

Still required before review-ready: coupled fixed-camera firing acceptance, interactive zoom/flight/capture checks, direct toolbar/door/property workflows and small-package separation of preservation material. Existing 0.15.24 archives remain unchanged. No 0.15.25 release is authorized until the user reviews it.
