<!-- October 9, 2026: current 0.15.19 behavior is documented in ITERATION-0.15.19.md. Prior upright sprite and Arial pause notes below are superseded, retained as history. -->

# Camera, sprites and pause — 0.15.18

October 9, 2026. This guide supersedes the screen-upright perspective sprite and pause controls described in earlier iterations. Earlier explanations are retained as history.

## Playtest controls

Escape or controller Start opens pause. Resume or Escape closes it even when a button has focus or HUD cursor mode is active. Closing pause does not require browser pointer capture, change camera orientation, or leave a hidden button focused.

The supplied Menu 1B artwork is the pause background. The four actions are Resume, Save, Load and Options. Options contains Master Volume, Hand Cursor, Get Unstuck and Back. Text uses readable 20-pixel Arial instead of the small decorative gameplay font.

Save downloads the existing complete playtest JSON, including authored maps and journey/cell state. Load opens a JSON picker and uses the existing size/schema validation before replacing state. Canceling the picker changes nothing. Loading from pause leaves the restored playtest paused until Resume/Escape. Save does not replace bundled test maps.

Master Volume controls the existing music, effects and combat bridges, in the normalized range 0–1. The chosen value also applies if the Web Audio context is created later. Audio still requires a user gesture. The hand selector shares the existing Ang/Fem/Glove preference and preloaded assets with the header selector. Main gameplay menus and open dialogs use that hand. Native operating-system file pickers and native select popups retain their system cursor.

Get Unstuck uses the existing safe-position recovery service; its result appears in Options. It does not discard the event or inventory state. Return with Back, then Resume. It remains a recovery tool, not proof that every possible imported mesh is free of movement edge cases.

## Why sprite clipping happened

The previous perspective painter drew an image vertically on the screen while calculating depth for a plane that was vertical in the world. At steep camera pitch, the displayed head/feet and the depth test represented different positions. Floor or wall pixels could therefore cut into a correctly positioned actor.

Perspective sprites now form a world-upright, feet-anchored cylindrical billboard. Head, feet and intermediate bands are projected through the same camera as model geometry. At most eight bands describe each visible sprite. The Pixi path places them in one reusable mesh and one shared atlas texture, with one optional depth mask. The Canvas fallback draws the bounded bands directly. The floor inset documented for each asset is respected; it is not an actor-height adjustment.

Depth occlusion is retained: a wall genuinely in front of an actor still hides it. This is not a draw-on-top setting. Sprite targeting follows the projected body. Fixed-camera artwork rooms retain their existing orthographic image projection because that artwork has no free physical camera pitch.

## Camera solids

The gameplay perspective camera sweeps a conservative volume from player eye height to its desired position. It now includes geometry-room primitives as well as transformed model meshes and authored collision boxes. Floor and ceiling faces participate. Clearance accounts for the 0.13-world-unit near plane, 360-pixel focal length, logical viewport width and asymmetric vertical framing center, plus a small margin.

The nearest obstruction retracts the camera before contact. This is immediate safety retraction; it does not use a delayed interpolation that can pass through a wall. Existing textured-ground clearance remains active, and water itself is not a solid camera obstruction. First-person eye positioning uses the model/room guard too. Authoring mode bypasses the model/room sweep; fixed artwork cameras remain their authored orthographic view.

Engine world coordinates use Z for height; imported glTF Y-up conversion remains owned by the existing model transform pipeline. All camera volume and sprite depth calculations use engine world space. `game.modelCameraDebug` reports host ID, clearance, fraction and obstruction status without per-frame console logging.

## Doors

Bundled visible antique transfer doors are now closed solid meshes. Door-only interaction zones remain independent of that mesh. Configuring an existing visible door retains its model and scale and enables mesh collision. Newly created invisible transfer zones remain non-solid; use the model/collision editor when a separate physical model is needed.

The cinematic transition animates its private presentation model while world play is frozen, then changes cells. This iteration does not add a separate in-world hinged-door open/close physics state. Static mesh collision and cinematic animation are different systems.

## Maintenance and verification

Changes are isolated in a new iteration and desktop/map-library profile. Earlier releases and comments remain intact. Current function locations/contracts are in FUNCTION-REFERENCE-0.15.18.md and .json. Source comments carry dated rationale for superseded rendering and pause behavior. The coverage check checks existence; behavior tests and review check accuracy.

Relevant tests: sprite-projection1518.cjs checks five pitches, projected feet/head and retained wall occlusion; browser/guards1518.cjs checks forty room camera angles, repeated HUD/focused Escape, hand selection, volume, actual Save/Load and closed-door body sweeps; browser/model-camera-recovery.cjs checks sixty real-building camera angles and recovery; browser/hub-door1517.cjs retains full hub/door/drop/save acceptance.
