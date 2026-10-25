# 0.15.25 user test build

This is a complete test iteration, not a certified final release. Previous releases remain intact. Source history and large diagnostic evidence remain preserved in the source workspace, separated from the everyday test package.

Try the visible Build Room, Place Object, Place Door, Events, Items and Fullscreen toolbar actions. In an event editor use Add Command. Select room geometry to expose its numeric Room properties. Door placement now has X/Y fields, and validation identifies the invalid field.

Editor: WASD moves; E/jump or Space rises; Q descends; Shift accelerates; right-drag looks around. Editor navigation bypasses collision; entering playtest restores normal collision. Wheel zoom now accumulates finer adjustments and eases toward the target. Playtest requests real mouse capture; P mode deliberately uses a free cursor. Fullscreen remains distinct from maximized playtest layout; use Fullscreen and pause Options / Exit Fullscreen.

Fixed-camera player projectile/hitscan launches follow the displayed sprite-sector direction with subtle cursor correction capped at five degrees at launch. Weapon spread remains; bullets do not home. Third-person aiming is unchanged. Calibration and actual directional metadata are reused, rather than invented muzzle offsets.

Known verification status: syntax, function-comment presence, locked sprite projection, events and input/terrain checks pass; existing browser workspace flow passes. New toolbar/door flows, native flight/zoom/capture and coupled fixed-camera combat still require interactive acceptance. Items currently opens existing starting-gameplay values at Item definitions; a fully separate item database UI remains unfinished. Event behavior conversion for static props and package asset deduplication remain unfinished. This build is provided now at the user's request to test.

Windows: extract all files and run Sprite Frontier.exe. Browser package: extract and open index.html using the existing browser/server guidance.
