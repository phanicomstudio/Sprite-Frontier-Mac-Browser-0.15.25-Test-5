> Historical snapshot. Current controls/features/limits: README.md, CODE-GUIDE.md and TEST-REPORT-06.md.

# Prototype 0.3 — preset landscape and input test

Refresh the open demo. If you have an older imported world loaded, choose **Generate world** to return to the preset. Initial launch also uses the preset automatically.

## What is ready to test

- Three **AMMO · 24** boxes beside the starting clearing, with a one-time 24-round pickup and empty appearance.
- The guide explains the controls and test features.
- Raised hills ahead/right, a second hill toward the left, and a valley. The spawn clearing stays flat so pickups and controls are easy to test.
- Two surrounding horizon/ridge layers and two independently drifting cloud layers. All are blue vector outlines; distant layers have different translation/parallax behavior and respond to camera yaw/pitch.
- Terrain-aware player grounding, prop/event placement, camera elevation, editor ground picking and projectile collision.
- **E** jumps. Movement keeps Frontier's 3.2 walk speed, 2× sprint and diagonal clamp.

The preset is defined by `project/settings.json` and `project/events.json`, with checked offline mirrors. Export/import preserves terrain parameters, sky-layer definitions and event pages. Old v1 worlds load with flat terrain unless height settings are present.

## Mouse look

Move the mouse over the gameplay view: the camera looks around without any button held. The crosshair stays centered and aims with the camera. It does not require an enemy, a hit or a shot.

Click the view once, or click **Mouse look / resume**, to capture the mouse for continuous turning. The activation click does not fire. Subsequent left-clicks fire; holstered right-click targets an event under the center crosshair. **Escape** releases the mouse. Click once to resume. If the host browser rejects pointer capture, motion over the view still looks around without dragging, but the cursor remains bounded by the view/window.

Editor mode releases gameplay mouse look so selecting and placing objects remains usable. Right-drag still rotates the editor camera. Dialogues and loss of focus suspend mouse input. Returning to play re-enables look over the view.

## Basic controller support

Standard browser-mapped gamepads use:

| Control (Xbox-style labels) | Action |
| --- | --- |
| Left stick | Analog movement |
| Right stick | Camera yaw/pitch |
| RT | Fire one shot per press |
| A / bottom face button | Interact while holstered; continue dialogue |
| B / right face button | Jump |
| X / left face button | Reload |
| Y / top face button | Draw/holster |
| L3 / left-stick click | Sprint while held |
| LB | First/third-person debug view |
| Start | Pause/resume play |

Press a controller button to make the device visible to the browser. Click the demo once for audio activation. The sidebar reports whether a standard-layout controller is detected. Stick deadzones suppress drift; analog movement scales speed without exceeding the keyboard baseline. Action buttons use press edges so a held trigger does not unintentionally empty the magazine. Disconnecting the pad clears its inputs.

Controller support currently covers gameplay and dialogue, not the event inspector or an on-screen editor cursor. Nonstandard controller mappings, remapping, vibration and hardware-specific behavior are not implemented. Input decoding and simulated gamepad browser checks pass; a physical device was not available for verification.

## Terrain and sky authoring

The editor's Landscape section switches between **Hills and valleys** and a **Flat test plane**, changes hill amplitude, and toggles sky layers. These edits participate in Undo and world export. Layer distance, height, parallax, color and drift speed are transparent world/project data; a full visual layer inspector and PNG/sprite layer replacement remain later asset work.

The terrain is real shared height data, not an overlay: Candy lands on it, objects sit on it, editor rays intersect it, and hills stop shots. `src/spatial.js` adapts the copied combat/projectile foundation to height-aware linear trajectories and swept volume/terrain contact. Original source files remain intact. Damage, ammunition, spread and weapon state still come from the original combat code.

## Remaining limits

Rendering remains the small Canvas perspective/vector prototype. It has no depth-buffered terrain/sprite occlusion; vector lines can show through geometry. Camera obstruction avoidance, sculpted terrain, cliffs/caves, asset-backed sky layers and wider prop libraries remain future work. Sky uses surrounding panoramic layers rather than a textured cubemap. The preset is a bounded 48 × 48 test world, not a streamed open world.

Browser API references: [Pointer Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API) and [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API). The implemented fallback and mappings were verified separately as described in TEST-REPORT.md.
