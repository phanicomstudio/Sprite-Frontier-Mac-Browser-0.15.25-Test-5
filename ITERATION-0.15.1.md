# 0.15.1 — fixed room calibration and controls

Room Test now displays Candy at twice the previous height, using Straika's room screenshot as a proportional reference. The original room artwork is unchanged.

**F2 → Room → Character height in room image** provides a scale slider and a height ruler at the spawn point. Match the ruler to a person or furniture in your rendered image, then Apply room character scale. Undo restores the previous scale. This calibrates character and furniture display height; floor outlines, positions, exits and collision footprints stay in place. Camera alignment remains available for floor-axis calibration.

Fixed rooms use the mouse cursor for aiming, with a moving crosshair. Click fires immediately, without capturing or rotating the camera. Empty-room aiming is inverted onto a horizontal plane at weapon height; hovering an actor aims at its body. Sprite facing and muzzle placement follow the same target. P continues to enable interaction rather than firing. Outdoor and free-camera aiming retain their existing behavior.

The Room Test exit is a broad highlighted patch projected onto the floor, with its visible boundary matching the trigger radius. Walk into it to return to the hub; no precise click is needed. The entrance is farther from the patch to prevent accidental immediate return. Existing unmodified Room Test settings migrate to the corrected scale and exit. Customized calibration or exit settings remain intact.

Browser checks passed: firing and facing in four cursor directions, first-click firing, movable reticle without pointer lock, scale apply/undo and walking through the exit. Existing travel/save, animation, normal lighting, Cerebral and water checks passed. Source validation/regression checks passed. Native Windows launch was not retested.

Performance checks remained within the existing test budget. The outdoor 512×256 stress map measured 11.0 ms median / 15.3 ms p95 draw submission and 60 MB heap. The 128-sprite normal-lit room measured 1.6 / 3.2 ms; the 128-box room measured 5.8 / 9.9 ms. Room stress measurements ran alongside other checks and are not a direct isolated comparison with 0.15. Timings are CPU draw submission in headless Chrome, not native FPS or GPU completion. No new full-frame processing was added; aiming is calculated on demand and the scale preview redraws when edited.

See ITERATION-0.15.md for the underlying room tools and current rendering/lighting limits.

Mouse-wheel zoom in fixed rooms ranges from the full image to 3× magnification, focused toward the floor. Orbit/rotation remain disabled. Movement maps screen directions through the calibrated floor axes and normalizes projected distance, including diagonals; zoom magnifies the whole scene consistently. Collision substeps remain active.
