# Sprite Frontier 0.5.0

PixiJS 8.22.0 is bundled locally (vendor/pixi.min.js, MIT license alongside it). Native WebGL graphics, sprites and text now render the world; our own projection, simulation and collision remain. DOM device HUD and overview map remain separate. No network or installation is required for index.html. Performance improvement has not yet been benchmarked on the user's hardware.

All editable visible text uses Checkbook; baked lettering in device artwork remains part of the supplied images. Inventory closes back into captured gameplay when opened from active gameplay; HUD cursor mode remains separate. Notifications reset after six seconds; inspection descriptions remain in the inspection CRT.

Editor foundation: page copying; primary switch, self-switch, variable threshold or inventory-count condition; up to eight additional AND conditions; named variable set/add commands. Additional condition lines use switch:questStarted, variable:progress:3 or item:keycard:1. Last matching page wins. Existing worlds remain compatible. This is not a complete MZ editor clone: choices, command branches, common events, MZ imports and authored plugin ports remain future work.

Desktop: desktop.cjs provides an Electron window with F11 fullscreen and the same game/editor. The separately supplied portable runtime uses Electron 38.8.6. Automated startup tests fail with Windows access-violation code 0xC0000005 before loading the game; it is experimental, not a verified working desktop release. Repeated automatic launch attempts have stopped.

Validation: original gameplay/event/terrain suites pass; combined conditions/variables round-trip tests pass. Chrome confirms PixiJS/WebGL, loaded Checkbook and no page exceptions. Physical controller, CRT output and Electron startup remain unverified.
