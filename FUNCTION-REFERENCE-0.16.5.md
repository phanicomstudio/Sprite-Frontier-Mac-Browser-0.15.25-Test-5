# Function reference addendum — 0.16.5

October 26, 2026. Prior references and explanations remain preserved; current behavior is in ITERATION-0.16.5.md.

## hubWorkbench.doorDeparture165

Inputs, returns, effects and limits: Source world/map, transfer and live player -> detached map/door/sign or null. Horizontal world-metre projection; no state mutation; real interaction carries stable source event ID.

## hubWorkbench.doorArrival163

Inputs, returns, effects and limits: Destination world/source/selector plus optional store/destination map -> same-side one-foot arrival/yaw, or null for missing/ambiguous pair. Saved sign overrides initial authored normal; no opposite-side fallback.

## hubState.checkedDoorSide165, doorSide165, rememberDoorSide165, validate, empty

Inputs, returns, effects and limits: Validate, read and commit additive saved approach-side records. Old saves adopt empty history; duplicate/invalid/over-capacity data reject. Per-transfer lookup only; no map/asset mutation.

## app.attemptTravel, commit, map adoption, arrivalFacing165

Inputs, returns, effects and limits: Resolve saved side, check destination clearance and history capacity before reservation, record successful departure after commit. Align actor/movement/perspective heading or projected fixed/isometric cursor after placement. Preserve first-person across paired 3D travel; no first-person zoom.

## tests/door-return165.cjs and tests/browser/door-return165.cjs

Inputs, returns, effects and limits: Rotated side persistence and real production interaction/timeline tests in Chrome/Windows. Includes blocked return, saved-state validation and post-update armed facing. Fixture maps only; no alternate transfer implementation.
