> Historical snapshot. Current controls/features/limits: README.md, CODE-GUIDE.md and TEST-REPORT-06.md.

# Foundation validation — October 4, 2026

## Prototype 0.3 — mouse/controller and landscape

Passed dependency-free tests for mouse delta state, controller drift deadzones/press edges/disconnect, analog movement scaling, terrain height reproducibility, landscape serialization/validation, grounded jumping/landing, height-aware prop sweeps, hill obstruction, original damage through the spatial adapter, and all prior movement/event/audio regressions.

Passed Chrome browser checks with pointer capture deliberately rejected: mouse motion looks without dragging or targeting; the first capture click consumes no ammunition; subsequent clicks fire; Escape suspends mouse look; click resumes. Simulated standard gamepad checks covered movement, looking, firing once per press, jumping and disconnect. Editor hover does not rotate its camera; right-drag still does. Terrain amplitude and sky toggles update authored data.

A separate real Chrome pointer-lock check passed capture, motion, firing and Escape release. Event editor regressions passed after updating interaction targeting to the centered crosshair: selection/placement, page and command editing, dragging, export, one-time ammunition collection and fresh-playtest isolation. Default scene preview shows labelled ammo boxes, raised terrain and cloud outlines.

**Not tested on physical controller hardware.** No claim of broad browser/controller compatibility. Renderer remains Canvas wireframe/billboards with no depth-buffered occlusion or collision-safe camera. PNG/sprite sky assets remain future work.

## Prototype 0.2 — in-level event editor

Passed simulation checks for page precedence, self switches, one-time ammo pickup, isolated fresh playtests, touch-entry activation, wait timing, safe local transfers, invalid-command rejection, event JSON round-trip, and event-data mirror equality. Existing movement, projectile, damage, ammo/reload and synth-footstep checks still pass.

Passed Chrome browser checks: direct scene event selection and ammo-box placement; empty-page preview; page and command editing; coordinate movement and Shift-drag movement; event export; holstered right-click granting 24 reserve rounds once; empty-page interaction; returning to the authored full-box design; fresh-playtest state reset; no uncaught page errors. Preview images were visually inspected.

Reproducible browser test: `tests/browser-events.cjs` requires Playwright, a running local server, and an available browser. `PLAYWRIGHT_MODULE`, `CHROME_PATH` and `FRONTIER_URL` can override those locations. Dependency-free checks use `npm test`.

Remaining limits: full MZ command/trigger coverage, terrain and sky layers, broader props, and depth-buffered rendering are not implemented. Pointer-lock interaction is implemented but the automated interaction regression uses the released mouse; subjective control feel still requires user review.

## Prototype 0.1 — initial foundation

Passed dependency-free tests:

- Identical seeds produce identical authored worlds; different seeds differ.
- Invalid coordinates, duplicate IDs, unknown object types, invalid bounds and blocked spawn are rejected.
- JSON project settings and offline mirror match.
- Walk speed 3.2, sprint speed 6.4, equal diagonal speed, opposing-key cancellation, and zero walk animation when blocked.
- Candy camera-relative direction mapping.
- Original projectile contact applies damage and consumes ammunition.
- A nearer rock blocks a projectile before a target, even with a long timestep.
- Target death emits original kill events and effects.
- Reload reserve accounting and holstered-fire prevention.
- Original synth plugin schedules 100→30 Hz walking and 120→40 Hz sprinting, with 0.6 effective local gain; no sound hook on blocked movement; ownership released on stop.

Passed browser smoke checks in installed desktop Chrome, headless mode:

- Load and render with no uncaught page errors.
- Open editor; import test JSON; select and move a tree; export and inspect resulting JSON.
- Delete and undo restore expected object lists.
- Adjust camera height; return to play; walk and schedule actual WebAudio oscillator nodes.
- Fire, reload, holster and toggle camera without errors.
- Captured and visually inspected preview: black world, blue vector grid/props, red targets, Candy back pose, HUD and overview map.

Byte comparisons confirmed unchanged copied source: combat.js, projectiles.js, geometry.js and phanicom-synth-footsteps.js. Candy PNG is copied without image alteration; framing uses metadata.

Not verified: subjective sound playback/loudness, exact Daggerfall Online control feel, all Candy animation poses, pointer-lock behavior across browsers, browser compatibility beyond Chrome, full 3D occlusion, vertical projectiles, network play, and imported Phaneroscape content. The screenshot is a development preview, not evidence of those capabilities.
