# Function reference — 0.16.16

November 1, 2026. `paletteDither.signature1616` detects meaningful HUD/layout/control/canvas changes at the existing 10 Hz upper bound. `panelKey1616` keys individual device panels; `backgrounds1616` embeds changed-panel background assets once; `inlineAsync1616` uses shallow `inlineNode` cloning and task yields between approximately 3 ms slices. `panels1616` retains decoded panel images and composes one HUD texture. Existing `captureHud` owns generation checks, failure recovery and legacy pause/editor capture. `hudCompose` schedules captures only when needed; unchanged HUD textures remain GPU-owned. These functions do not mutate authored maps, take input from controls, generate normal maps or add world snapshots.

The portrait owner's existing `update` function increments `paintRevision1616` only when its canvas is actually repainted. Both palette `apply` and `transition` use logical filter resolution 1 independently of display output density. Metrics are bounded counters/timing summaries; no per-frame logging is added.

`tests/browser/dither-performance1616.cjs` exercises real isolated playtest HUD ownership, idle reuse, ammo refresh, a single changed panel, output scales 1/1.5/2 and exception reporting. It does not substitute a mock compositor or make universal hardware timing claims. Earlier references remain history.
