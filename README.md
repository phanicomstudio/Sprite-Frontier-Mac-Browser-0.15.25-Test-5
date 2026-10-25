# Phanicom Sprite Frontier 0.1

Open `index.html` in a desktop browser. Everything is local; no installation, account, downloads or build step is required. Alternatively, with Node installed run `npm start` and open http://127.0.0.1:8765.

This separate project is the first engineering foundation for the user's sprite-first exploration engine. See **ARCHITECTURE.md** for the assessment, reuse/adapt/replace table, data model, combat port and milestone sequence.

## Play

- WASD: camera-relative movement. Shift: 2× sprint.
- Drag the view: yaw and pitch. Double-click: pointer-lock mouse look. Escape: release mouse.
- Left/right arrows: yaw. Wheel: third-person distance. Height slider is in the editor.
- Click or F: fire the drawn 9mm test weapon. Space: holster/draw. R: reload.
- Tab: editor/play. V: optional first-person debug view.
- Sound starts after a click or keypress. Volume slider controls the shared audio output.

## Edit a world

Open editor, choose a kind and click the overview map. Select an object in the list, change X/Y and click Move selected. Delete selected or use the erase tool. Undo restores placements. Export world creates a JSON file; Import world JSON restores it. Returning to play reloads authored objects and resets combat.

Enter the same seed and Generate world to recreate the original procedural layout. Export before regenerating if you want to keep edits. World JSON does not save combat progress.

## Included

Candy's supplied eight-direction sheet; clean blue/red vector props on black; Frontier movement defaults and animation cadence; unchanged original projectile/damage code; unchanged Phanicom Synth Footsteps 1.0.1 plugin, connected through a small audio host.

## Current limits

Flat terrain, ground-plane projectiles, basic footprint collision and Canvas perspective rendering. Pitch is viewing only; shots follow horizontal yaw. No camera collision avoidance, depth-buffered occlusion, multiplayer, importer, quest system or full module compatibility. This is a foundation to review, not a completed RPG engine.

## Checks

`npm test` runs dependency-free data and simulation regressions. Browser smoke validation used installed Chrome. Source checks confirm the copied combat, projectile, geometry and synth plugin files are byte-identical to the supplied archive.

## Provenance

Reference source: user-supplied `metropolis-frontier-0.20.7d.zip`. Candy artwork: user-supplied `Candy_Armed_8R_3C_spritesheet.png`. Source headers and plugin attribution retained. This local development copy does not establish redistribution rights for original engine/artwork; no external publication was performed. Virtual Hydlide and Daggerfall assets are not included.
