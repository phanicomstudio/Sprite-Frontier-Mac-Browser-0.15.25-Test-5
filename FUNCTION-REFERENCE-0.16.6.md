# Function reference addendum — 0.16.6

October 26, 2026. Earlier references are retained; current units, behavior and limits are in ITERATION-0.16.6.md.

## app.arrivalPreview166, arrivalBlocked166

Inputs, returns, effects and limits: Destination world and world-metre candidate -> detached query context / standing-body obstruction. Reuses destination event models, shared geometry and existing page conditions; no active actor/source changes.

## app.arrivalPathBlocked166

Inputs, returns, effects and limits: Destination and paired-door candidate -> swept same-side corridor obstruction. Three body-height rays include thin geometry and omit only the transferred-through leaf. Runs only at transfer preflight.

## app.readableDoorArrival166; hubWorkbench.doorArrival163

Inputs, returns, effects and limits: Paired-door world entry -> first safe readable same-side 5–11-foot point, or null. Five-foot default supersedes one foot; bounded actual camera/body projection checks do not bypass collision or alter sprites.

## isometric.camera; app wheel/update

Inputs, returns, effects and limits: Transient camera scale 12–200 px/m and logical-pixel anchor; authored base remains 12–100. Full grounded-player framing and original inverse projection maintained. First-person zoom remains disabled.

## contactShadow.profile166

Inputs, returns, effects and limits: Finite height above floor metres -> bounded radius/opacity/softness. Rejects nonfinite height. Radius 0.30–0.24 m and opacity 0.16–0.08 over first two metres; grounded values restored on landing.

## contactShadow.grid166, slot166, draw166

Inputs, returns, effects and limits: Active scene/actor/Pixi/depth/projection -> nine receivers, pooled mesh slot, or bounded submitted count. Maximum eight actors and one nine-ray rebuild per frame. Analytic radial alpha, static receiver/depth clipping, shared sun depth upload when available; no image assets/readbacks/logging. Only isometric geometry gameplay.

## sunShadows.draw163; render.draw

Inputs, returns, effects and limits: Existing sun path publishes depth-frame identity for same-frame sharing; contact effect appends after model geometry before actors. Existing outdoor-sun restrictions and billboard presentation are unchanged.

## tests/browser/iteration166.cjs; updated door-return165 and earlier tests

Inputs, returns, effects and limits: Actual Chrome/native wheel/jump/door lifecycle plus pixel/timing evidence; controlled fixture settings only. Updated assertions explicitly supersede one-foot and 100 px/m historical expectations.

## authoringWorkspace.install; fullscreen166 UI acceptance

Inputs, returns, effects and limits: Moves the existing Fullscreen button to the main toolbar, retaining the original handler and export behavior. Playtest CSS keeps it above pause UI. Actual editor/playtest fullscreen entry and pause-menu exit are verified in Chrome/Windows, with asynchronous native state waits.
