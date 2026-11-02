# Function reference additions — 0.16.23

November 1, 2026.

- FrontierFirstPerson.alignFacing(game): returns true after synchronizing player facingX/facingY and movementFacing with camera yaw in perspective cells. Returns false for fixed/isometric cells. Does not move the actor/camera, change sprite planes or mutate authored maps. Called from both first-person exit routes.
- FrontierRender.camera(game): first-person result now includes cy=240 logical pixels; third-person framing remains unchanged.
- Spatial projectile creation: first-person pitch directly defines the centered camera ray; existing third-person raised-crosshair compensation stays separate. Physical muzzle offset and camera-ray convergence still pass through original collision/accuracy ownership.
- Application reticle update: centered first-person marker cannot be overwritten by third-person barrel-marker placement; fixed/isometric marker owners remain unchanged.

Acceptance: tests/browser/aim1623.cjs; tests/function-comments1516.cjs and existing first-person/lighting suites.
