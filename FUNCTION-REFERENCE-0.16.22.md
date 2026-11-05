# Function reference additions — 0.16.22

November 1, 2026. Prior function references remain for unchanged behavior.

- FrontierFirstPerson.motion(state, dt, distance): seconds/metres in, smooth reference-pixel XY out. Mutates only transient sway state; fixed cadence and bounded amplitude prevent run-speed acceleration. Exponential filters settle at rest. Teleports do not drive sway.
- FrontierFirstPerson.muzzle(actor, game, cam): assigned first-person player only; camera-basis forward/right/up offsets produce world XYZ metres. Null for other actors/views. Physical launch collision and camera-target direction remain in existing spatial/ballistics owners.
- First-person validation accepts bounded spawnForward, spawnRight and spawnUp with migration defaults. The weapon editor reads these through the same project transaction as artwork/flash settings.
- The actual wheel handler exits first-person on outward input, restores/clamps third-person distance and clears stale zoom intent. It never magnifies the first-person lens.

Tests: tests/first-person1622.cjs; updated tests/browser/iteration1621.cjs for outward wheel and actual custom launch; lighting suite and tests/function-comments1516.cjs.
