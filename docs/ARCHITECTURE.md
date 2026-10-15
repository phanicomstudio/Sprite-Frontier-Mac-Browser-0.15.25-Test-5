<!-- October 9, 2026: current 0.15.19 behavior is documented in ITERATION-0.15.19.md. Prior upright sprite and Arial pause notes below are superseded, retained as history. -->

## Current update — 0.15.18, October 9, 2026

Read ITERATION-0.15.18.md and CAMERA-SPRITE-PAUSE-GUIDE.md for current camera, sprite, door collision and pause behavior. Older version-specific statements below are retained history and superseded where the current guide differs.

# Architecture and extension boundaries — 0.15.9

The browser and Electron hosts share the same engine. Hosts own windows/serving only. app.js connects input, authoring, simulation and presentation; keep new gameplay rules in services instead of extending that connection layer indefinitely.

## Data and state

world.js and map-library.js validate map/project data before adoption. event-schema.js migrates versioned events and preserves bounded JSON extension namespaces. event-data.js and event-conditions.js define authoring records and expression validation/evaluation. Authoring drafts are detached from maps. events.js creates separate playtest state; event-state.js captures/restores shared named state across map travel. save.js preflights saves before mutation. Stable map/event IDs must survive exports and migrations; duplicate/import remapping must also update travel references.

## Events and services

mz-command-catalog.js describes presentation and support status. mz-commands.js validates/lowers numeric MZ records; gameplay-commands.js adds engine-specific named state operations. mz-dialogs.js and gameplay-dialogs.js collect parameters. mz-command-editing.js owns nested structural edits. events.js executes bounded main/parallel interpreters; services supply movement, messages, combat and scene changes. Unsupported commands must remain explicitly unavailable or diagnosed. Add a command by registering schema/validation, authoring dialog, lowering/runtime service and acceptance evidence together.

actor-behavior.js owns bounded Wander/Patrol/Sentinel/pursuit/return controllers, original homes and diagnostics. party-combat.js coordinates supported allied targeting/cooldowns. State definitions are intentionally extensible: GAMEPLAY-DATA-EXTENSIONS.md governs future skill/weapon/armor properties. Current test mechanics are examples, not a fixed MZ database contract.

## Rendering and resources

terrain.js supplies support heights; water.js supplies water surfaces. render.js and pixi-renderer.js project billboards and enforce terrain occlusion. Keep physical placement independent of camera projection; water remains traversable for camera views while solid terrain requires clearance. interiors.js owns fixed-room projection. directions.js/movement.js retain diagonal movement/animation.

normal-workbench.js owns drafts and profile application. normal-bindings.js validates bounded PNG/extension records. sprite-lighting.js is the pure shading operation; normal-worker.js moves preparation off-thread when supported. normal-render-cache.js owns revision/source cancellation, prepared-image budgets and release. Never regenerate pixels inside each frame. scene-transition.js owns transfer gating/continuation, screen-melt.js the bounded model and screen-melt-overlay.js transient capture surfaces.

## Collaboration rules

Use explicit schema migrations, finite bounded JSON and stable namespaced properties. Preserve unknown extensions; reject malformed imports before changing state. Comment ownership, invariants and non-obvious algorithms. Diagnostics must remain bounded and actionable. Keep test hooks outside shipped gameplay flows. Add source-contract tests and representative authored browser scenarios; tests/browser/README.md states their scope.

Keep layered originals separate from runtime variants. ASSET-INVENTORY.json is a scoped payload inventory, not live residency. The asset guide/roadmap prioritizes measurement, reproducible variants, packing by lifetime, streaming and conservative visibility. All future changes must preserve anchors, alpha, travel persistence and underwater occlusion.

Historical foundation assessment is retained in ARCHITECTURE-HISTORY.md. CODE-GUIDE.md and COLLEAGUE-HANDOFF.md provide detailed module navigation.


## October 9, 2026 — 0.15.17 extension

See HUB-DOOR-GUIDE.md for the complete current authoring contract. New independent
modules are model-visibility, hub-state, hub-workbench, hub-fixtures, door-audio,
door-transition and offline item/door asset manifests. Existing templates and
undo boundaries own authored changes. Playtest hub records own stock/drop state;
map resources remain shared. Scene-transition owns transfer commit/resume and
cancels previews. Every new callback/function has its own source contract; the
current dated reference is FUNCTION-REFERENCE-0.15.17.md. Earlier explanations
above remain historical where behavior differs.


## October 15, 2026 — campaign structure and shell

Projects carry `campaign.areas` (Campaign → Area → Map). `src/campaign.js` owns the pure rules; `map-library.js` stores, reconciles and persists the campaign with the project and includes it in map-operation history; `src/campaign-shell.js` is the authoring-only left pane and routes map actions to the existing library controls. Areas are organisation only and never affect map IDs, transfers or loading. Authoring is now three panes (tree, view, inspector/palette). See docs/CAMPAIGN-EDITOR.md.

## October 15, 2026 (0.15.27) — asset files and loading

Images and models exist only as files (`img/`, `assets/models/`). `src/asset-source.js` (`FrontierAssets`) resolves them: paths and fetch over http(s); generated `offline/` bundles (tools/build-offline.cjs) when opened from disk. `app.js` and the editor shell start through `FrontierAssets.whenReady` after the built-in door models load. Catalogue scripts carry metadata only. The superseded embedded mirrors are described in git history before 0.15.27. See docs/ASSETS-AND-HOSTING.md.
