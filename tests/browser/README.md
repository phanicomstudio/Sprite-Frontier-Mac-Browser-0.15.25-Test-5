# Browser acceptance

Use Node and Playwright in a developer workspace. Install Playwright and its Chromium browser with the standard Playwright setup. Run these files from any directory; they locate their own iteration. FRONTIER_PLAYWRIGHT can point to an external Playwright module; FRONTIER_CHROME can point to an installed Chrome executable. Neither dependency is needed to play the game.

Run event-interaction.cjs, context-history.cjs, courier-journey.cjs, camera-sweep.cjs and melt-crossmap.cjs individually with Node. Temporary screenshots/JSON go to test-artifacts in the iteration folder. Each browser starts with fresh isolated storage.

Pointer interaction uses real clicks; event-interaction sets player/camera position through a diagnostic hook to isolate targeting. Context-history supplies existing blank-event selection through the context service, while its creation uses ground pointer input. Courier journey uses runtime start hooks to isolate state/travel and actual dialogue buttons. Camera sweep samples computed cameras. These scopes must accompany reported results. macOS execution remains pending until run on that platform.

Also run party-travel.cjs for recruitment/combat/save/travel, and normal-worker.cjs for the normal workflow and worker pixel parity. Normal fixtures additionally require Sharp (or FRONTIER_SHARP pointing to its module). Party fixture uses runtime start/position hooks to isolate combat and persistence; it does not claim automatic cross-map companion spawning.

Run pages-ui.cjs to create and apply 25 event pages through the editor. Run isolated-return.cjs to verify Apply, event playtest, and return discard temporary gameplay state. Both use real editor controls; isolated-return starts the event through the editor playtest control and injects a temporary skill solely to verify restoration.

placement.cjs tests real ground clicks on a textured map configured with sloped terrain and a fixed-camera room; terrain setup uses a diagnostic hook. behavior-dialog.cjs tests dedicated patrol/approach controls and private drafts in an isolated editor fixture, with runtime behavior covered by actor-behavior159.cjs.
