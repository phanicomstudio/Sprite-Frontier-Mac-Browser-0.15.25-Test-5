# Function reference addendum — 0.16.4

October 26, 2026. Prior references remain history. Current behavior and units are in ITERATION-0.16.4.md. Adjacent source contracts remain authoritative.

## app.cursorAim164

Inputs: Active world and edit mode from closure. Returns: Boolean: fixed/isometric gameplay uses cursor aim. Effects/limits: None; shared routing prevents invisible mouse look in orthographic play.

## app pointer/capture/shoot/reticle handlers

Inputs: Real browser mouse deltas/positions, buttons and logical display. Returns: Existing handler result. Effects/limits: Update bounded cursor, submit existing firing owner, position DOM reticle; preserve pause/capture gates.

## app wheel/update

Inputs: Wheel deltaMode/deltaY and simulation dt seconds. Returns: No result. Effects/limits: Ease camera-local roomZoom/isoScale/distance; cancel on replacement, ignore pause/transfer and first-person gameplay wheel.

## isometric.camera/aim

Inputs: Live game and logical cursor XY. Returns: Affine camera or null; world torso target or null. Effects/limits: No project writes; scale honors transient zoom, fixed artwork wins, movement cannot override distant cursor.

## render.draw

Inputs: Live game and canvas. Returns: No result. Effects/limits: Neutral background clear; existing geometry depth fog retained; no global sky tint.

## tests/browser/iteration164.cjs

Inputs: Browser path or isolated Windows CDP endpoint. Returns: Promise; nonzero failure status on assertion/error. Effects/limits: Actual keyboard/mouse/wheel/fullscreen acceptance; observation hooks and test-only GPU pixel readback; isolated fixture settings; evidence outside package.

## tests/zoom164.cjs

Inputs: Current source. Returns: Test exit status. Effects/limits: 54 affine projection inversions across 4:3/16:9, three scales and three yaws; fixed/free-flight camera precedence; authored scale isolation.
