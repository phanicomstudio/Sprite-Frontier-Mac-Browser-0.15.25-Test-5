# Sprite Frontier 0.16.4 — cursor combat, zoom and sky fog

October 26, 2026. This iteration implements the two banked interaction/rendering reports. Source is delivered through a reviewed Git branch. This milestone is a complete **Windows PC only** distribution, explicitly requested by the user; no Mac/browser package is built. Browser tests still verify the shared source. Earlier releases and documentation remain preserved.

## Play controls

WASD moves in the current view. In isometric and fixed artwork views, move the mouse to aim; the reticle follows it. Space draws/holsters, 1 equips the handgun, F or a left click fires, R reloads. The first click after releasing capture activates play and does not deliberately fire. Escape pauses/releases capture. Perspective views retain mouse look and their central aiming marker. F2 returns to editing.

In isometric play, walking no longer overrides cursor-directed firing. The old 0.16.2 movement-priority rule and four-world-cardinal preliminary rounding are superseded. The existing calibrated directional frame/launch system selects the nearest **supported displayed sprite angle** once, including existing diagonal frames. This is screen-space selection through the actual affine camera, not a second competing world-axis snap. Existing muzzle offsets, frame layout, accuracy/spread and swept projectile physics remain authoritative. Slight visible-target attraction retains its six-degree, 40-metre and unobstructed-line restrictions; launch correction remains bounded to five degrees, with no homing after launch. Cream and synth remain the same blood type.

Captured mouse movement accumulates a bounded virtual cursor; uncaptured movement uses the displayed canvas coordinates. Both retain logical-pixel and breathing-filter conversion. The same camera predicate controls capture initialization, pointer input, firing, mouse-look exclusion and reticle position. A fixed artwork cell takes precedence over an incidental isometric presentation flag. Editor free flight keeps its independent navigation.

## Zoom

The wheel accumulates and eases a transient target on the current camera. Isometric zoom changes affine pixels/metre (12–100) instead of the unused perspective distance. Fixed artwork retains its 1–3 image zoom. Third-person retains its existing bounded camera-distance zoom. First-person retains its original projection and ignores the wheel, following the user's explicit correction during this iteration. An initial first-person magnification experiment was removed before delivery because it was unnecessary and changed sprite appearance. The original 360-pixel lens, terrain projection, picking, contact depth and camera clearance are unchanged.

Wheel input remains normalized for pixel/line/page devices and ignored while paused or transferring. Camera replacement cancels stale easing. Zoom does not overwrite authored cell scale, fixed-camera calibration or saved project data. Native profile intentionally stays Sprite-Frontier-0.16.3 because this iteration has no schema migration; existing projects remain available. Import a project explicitly when moving from an older profile.

## Fog and sky

The screen clear is neutral black rather than the fog color. Dusty Plum remains a distance blend on world geometry; uncovered sky no longer receives a full-screen plum fill. Sky layers retain their zero fog depth, while existing panorama sampling remains independent of fog. Existing per-map fog, sky saturation, contrast and lighting overrides remain available. No extra fullscreen fog pass, GPU readback or per-frame diagnostic logging is introduced.

## Architecture and validation

See FUNCTION-REFERENCE-0.16.4.md for changed owners, tests/zoom164.cjs for affine zoom projection checks and tests/browser/iteration164.cjs for real input acceptance. The latter observes real projectile creation after keyboard/mouse input; it never invokes the firing function directly. Controlled fixture changes remove hostile interference and choose camera/display settings. Test-only pixel readbacks compare sky and geometry under original/phosphor/outline treatments. The same test runs against Chrome source and the staged Windows executable, using an isolated diagnostic profile that is removed before packaging.

The existing 0.16.3 doors, authoring handles, lighting and bounded receiver shadows remain part of this full iteration. No new third-party code/assets or licensing obligations were added. This focused iteration does not replace the room editor or claim that every backlog feature has shipped.
