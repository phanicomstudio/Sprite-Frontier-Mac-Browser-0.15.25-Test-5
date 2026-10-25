# Foundation validation — October 4, 2026

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
