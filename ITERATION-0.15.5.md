# Iteration 0.15.5 — forest and aiming corrections

Fixed-room aiming now positions the reticle every animation frame, independently of the 100 ms HUD refresh. Optional perspective barrel calibration retains its existing behavior.

Textured terrain clips triangles against the camera near plane instead of rejecting entire crossing tiles. Ground coverage extends farther, and deformed cells use quarter-unit triangles matching the water shoreline samples. Connected submerged bank tiles receive water even when they were not explicitly painted, eliminating dry squares inside the pool.

On textured maps, the third-person camera stays at least 0.18 world units above solid terrain, including a small clearance footprint. The basin floor, rather than the water surface, constrains its height, so underwater viewing remains available. Vector-map camera framing is unchanged.

Tree sprite anchors account for transparent padding below visible roots. The supplied Twisted Tree A had 171 pixels of bottom padding; source artwork is preserved.

Validation: browser regression verifies per-frame reticle movement while HUD refresh is held, camera clearance across positions/yaws/pitches, below-water/above-floor viewing, complete submerged basin coverage, and tree anchors. Input/terrain, optional barrel, water shoreline, water visibility, terrain authoring, room projection and capture/spread checks pass. Ground and underwater screenshots were inspected. Windows package is a playtest candidate; native acceptance has not been repeated for this iteration.

Play: extract the complete Windows ZIP, run Launch Sprite Frontier.cmd, then choose Supplied Assets Forest Test. Existing saved maps retain their authored terrain and water; rendering corrections apply without resetting them.
