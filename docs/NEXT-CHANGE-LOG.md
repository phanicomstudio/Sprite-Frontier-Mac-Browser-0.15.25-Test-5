# Next-change log

User playtest observations for the next iteration. Recording an entry does not mean its fix has been implemented. Add further observations here as they arrive.

## SF-001 — Directional player poses depend on holstering

- **Reported:** October 4, 2026.
- **Status:** Accepted for now; no change requested.
- **User observation:** “We only have multidirectional movement after pressing Space.”
- **Reproduction:** Launch with the default drawn weapon. Move using WASD and diagonals. Candy remains facing away from the camera. Press Space to holster, then move again: movement now changes the directional pose.
- **Confirmed distinction:** WASD movement itself supports multiple directions in both states. The restriction concerns character facing and the displayed sprite direction.
- **Cause:** The player starts with `holstered: false`. Movement updates facing only when holstered/unarmed. Each armed update sets facing to camera yaw. Directional rendering compares that facing against the same camera yaw, so its relative angle stays zero and selects Candy's back row.
- **Relevant code:** `src/movement.js` movement-facing policy; `src/app.js` armed aim update; `src/adapter.js` initial weapon state and aim; `src/directions.js` camera-relative row selection.
- **User decision:** Armed facing should remain tied to camera aim for now. Holstered facing follows movement. Keep the current behavior.
- **Future consideration:** Revisit separate body and aim orientation only if the user requests a different control policy.
- **Checks if this behavior is revisited:** Test all eight movement directions with the weapon drawn and holstered; test camera rotation while idle and moving; confirm projectile direction remains consistent with the chosen aim policy; verify Space still toggles weapon state; preserve 3.2 walk speed, 2× sprint, diagonal normalization and synth footsteps.

No gameplay code was changed when this entry was recorded.

## SF-002 — E is jump

- **Requested:** October 4, 2026.
- **Status:** Implemented as a test foundation in prototype 0.3; see DEMO-03.md.
- **Required behavior:** Press E to jump, whether the weapon is drawn or holstered.
- **Implementation direction:** Add player height, vertical velocity, grounded state and gravity. Jump starts from the terrain surface and lands on the surface beneath the player. Keep existing horizontal walk/sprint behavior.
- **Acceptance checks:** E starts a jump while grounded; holding E does not trigger repeated midair jumps; movement and aiming remain usable during a jump; landing respects hills and slopes; editor/form input does not trigger jumping.
- **Not yet specified:** Jump height, gravity and airborne movement tuning. Choose a small configurable baseline during implementation for playtesting.

## SF-003 — Right-click interacts while holstered

- **Requested:** October 4, 2026.
- **Status:** Implemented for event interactions in prototype 0.2; tested for range, item collection and isolated playtest state. Broader prop interactions remain future work.
- **Required behavior:** Right-click performs an interaction when the weapon is holstered.
- **Implementation direction:** Select a reachable interactable using camera/world targeting and route it through an interaction action. Separate interaction clicks from camera dragging; the current view handler treats pointer dragging as camera input and must respect the new control.
- **Acceptance checks:** Holstered right-click triggers a reachable target once; it does not fire the weapon or open the browser context menu; out-of-range targets are not activated; editor/form input is unaffected; verify both pointer-locked and released mouse states.
- **Unspecified:** Armed right-click behavior and which initial objects support interaction. Do not infer an armed aim binding from this request.

## SF-004 — Undulating terrain, hills and slopes

- **Requested:** October 4, 2026.
- **Status:** Implemented as a test foundation in prototype 0.3; see DEMO-03.md.
- **Required behavior:** Worlds must support varying terrain height, including hills and slopes, rather than being limited to a flat plane.
- **Implementation direction:** Define a shared terrain-height query in horizontal x/y coordinates with vertical z. Store terrain generation parameters or authored height data in the world document. Rendering, grounding, jumping, prop placement, camera following, collision and projectile obstruction must use the same terrain surface. Visual height variation alone is insufficient.
- **Sequence:** Establish terrain data and surface queries first, then player grounding/jump, followed by terrain rendering and height-aware collision/ballistics. Coordinate this with the planned WebGL renderer so terrain is structural geometry beneath the sprite entities.
- **Acceptance checks:** A known seed reproduces the same hills; Candy follows the surface without floating or sinking; jumping lands at the correct height; trees and rocks sit on the surface; camera follows changing player elevation; terrain can obstruct shots; exported/imported worlds preserve terrain; a flat terrain preset remains available for regression testing.
- **Initial scope:** A modest generated hill/slope test world. No large-world streaming or sophisticated terrain sculpting is required yet.

These entries record requirements for the next iteration; they have not been implemented.

## SF-005 — Layered horizon, parallax backgrounds, skybox and moving clouds

- **Requested:** October 4, 2026.
- **Status:** Vector panoramic/parallax/cloud layers implemented in prototype 0.3. PNG/sprite assets and a visual layer inspector remain future asset work.
- **Required behavior:** Support a horizon/background, parallax background layers, a skybox or surrounding sky, and moving cloud layers. Layers must accept PNGs and sprites later; the initial presentation uses clean vector graphics.
- **Initial representation:** Blue/red vector silhouettes, outlines and cloud shapes against the current black background. Keep each layer independently configurable rather than baking the scenery into one image.
- **Data model direction:** Layer definitions specify asset or vector source, ordering, angular placement/coverage, scale, parallax behavior, opacity and animation/drift settings. Share these definitions between editor, world serialization and renderer. Different layers can eventually use different asset types.
- **Camera behavior:** Distant sky responds to camera yaw/pitch without nearby-object translation. Background layers can use depth-dependent parallax; clouds have their own time-based drift. Specify whether a layer represents distant scenery or actual world geometry so camera elevation and hills do not produce inconsistent movement.
- **Rendering boundary:** Composite distant scenery behind terrain and world entities. Preserve the ability to replace vector layer artwork with transparent PNGs or animated sprite sheets without changing movement or combat. Skybox is a rendering mode, not an assumption that every background is a flat screen overlay.
- **Acceptance checks:** Camera rotation and pitch reveal continuous surrounding scenery without obvious wrap seams; parallax layers move at distinct configured rates; clouds drift independently of player movement; terrain and sprites remain in front of the background; hills and jumps do not detach the horizon incorrectly; export/import preserves layer settings; PNG/sprite substitution uses the same layer contract.
- **Not yet specified:** Number of layers, artwork, cloud speeds, weather and day/night behavior. Weather and day/night systems are not added to this request by inference.

The vector stage is now implemented; see DEMO-03.md.

## SF-006 — In-level editor and MZ-style event foundation

- **Status:** Implemented in prototype 0.2.
- **Includes:** Gameplay-like authoring navigation; direct scene selection, placement and Shift-drag movement; event pages and preview; self/global switches; interaction/player-touch triggers; message/item/wait/local-transfer commands; editable command list; authored JSON export/import; isolated playtests.
- **Scope:** An eventing foundation, not full MZ compatibility. See EVENT-EDITOR.md for supported behavior and remaining limits.

## SF-007 — Placeable ammunition boxes

- **Status:** Implemented in prototype 0.2.
- **Includes:** Three boxes near generated-world spawn; Place ammo box scene tool; 24-round one-time pickup; self-switch-driven empty appearance/message.

## SF-008 — Broader props

- **Status:** Planned for the next iteration at the user's request.
- **Scope:** Broader prop assets/definitions and authoring beyond the existing vector tree/rock/arch test fixtures and the current ammo-box event. Specific prop roster remains to be defined.


## SF-009 — Reliable mouse look and partial controller input

- **Status:** Implemented in prototype 0.3.
- **Includes:** Gameplay mouse hover look independent of targets/firing, single-click pointer capture, capture-denied fallback, Escape/resume, editor/dialogue gating; standard gamepad movement/look and gameplay actions with drift deadzones and press edges.
- **Verification:** Chrome real pointer capture and denied-capture fallback passed; gamepad simulation passed. Physical controller verification remains pending.

## SF-010 — Preset landscape test scene

- **Status:** Implemented in prototype 0.3.
- **Includes:** Labelled ammo pickups, guide, enemies, hills/valley, layered ridges and drifting clouds on default launch. Export/import preserves landscape and event data.

SF-011 — Implemented: third-person full-body framing stays centered across zoom; nearest distance is 2.8. Camera height adjusts the orbit angle. First-person eye height remains 1.55. Verified zoom/pitch/height/elevation combinations and browser launch.


SF-012 — Implemented: native 640×480 game view, fullscreen 4:3 with black borders, centered interaction coordinates.
SF-013 — Planned: modular diegetic UI, world/character/weapon attachments and configurable screen modules inside 4:3 safe area.

SF-014 — CRT display target: 4:3 fullscreen, black borders, 5% overlay safety margins. Physical CRT output, adapter, resolution and refresh-rate validation pending hardware.

SF-015 — Revised third-person framing: head stays beneath center aim ray, whole sprite fits at minimum distance 4.2. Candy no longer receives distance opacity fading.


SF-016 — Close full-body vanity zoom restored; framing raises Candy progressively to keep feet visible. Windowed view is height-limited while retaining 4:3. Closest vanity framing can overlap the central aiming area.


SF-017 — Implemented selectable 4:3 default and 16:9 widescreen, windowed and fullscreen. Canvas width and scene input/projection center adapt; sprites retain proportions. Verified both ratios fit browser height.


SF-018 — Crosshair fixed at 20% viewport height, aligned with camera aim ray. Full-body zoom stays beneath it across tested camera angles; interaction coordinates and projection updated for both ratios.


SF-019 — Vertical aim widened by approximately 9 degrees upward and downward for mouse and controller. Orbit clamp also widened to accommodate downward aiming. Full-body framing checks pass at new limits.


SF-020 — Replaced unstable pitch-dependent zoom math with camera-space framing. Aim pitch spans -0.7 to +0.6 radians. Look angle no longer changes sprite depth or zoom; automated tests bound camera distance and browser checks exercised both limits. Camera obstruction/terrain clearance remains a future camera task.


SF-021 — Height-aware player movement implemented. Grounded automatic step height 0.3; airborne feet clear low solids; descending jumps land on object tops; leaving high support starts falling. Original horizontal radius, speed and axis sliding preserved. Tests verify small steps, normal rock jump/landing and tall blockers.


SF-022 — Reduced camera orbit response to vertical look to 75%. Projection framing compensates to retain full player and fixed crosshair; projectile aim accounts for projection offset. Upright billboards remain ground anchored. Minimum safe zoom depth 2.3. Tests verify bounds and crosshair ray alignment.


SF-023 — World foot defined as 0.3 units; default reach 6 feet. Holstered target name/distance shown within range and unobstructed. Left click interacts/picks up through event commands; right click inspects configurable event text. Inspector reach shown in feet.\nSF-024 — Inventory panel [I], available in fullscreen, pauses gameplay. Current reserve/loaded ammunition plus generic event-granted item stacks; resets with fresh playtests. Modular UI migration planned.


## SF-025 — Pickup notifications without dialogue (next iteration)
Status: Planned, explicitly deferred by user.
Observed: Ammo pickup opens a modal message with Continue. The dialogue releases pointer lock, and acknowledging it leaves mouse look uncaptured.
Requested: Ordinary pickups display a small Fallout-style notification (for example, "Added: 24 × 9mm rounds") without a Continue button, pausing gameplay, changing focus, or releasing pointer lock. Let notifications expire automatically and support successive pickups. Keep authored conversation dialogue separate from pickup feedback. Verify inventory/ammo updates and one-time pickup behavior still work.

## SF-026 — Restore gameplay input after inventory (next iteration)
Status: Planned alongside SF-025.
Observed: Inventory correctly releases mouse capture for menu use, but closing it leaves the cursor visible and requires another click to resume mouse look.
Requested: Remember the pre-menu input/capture state. Closing inventory with its button or I should focus the game view and restore captured mouse look when it was active before opening, without firing, interacting, or requiring another click. Preserve a previously uncaptured state rather than forcing capture. Handle browser capture rejection with the existing hover-look fallback. Verify fullscreen and windowed behavior.

## SF-027 — Bottom-screen object information / modular HUD (next iteration)
Status: Planned with SF-025 and SF-026.
Requested: Move targeted object names, distance, interaction hints, and inspection descriptions from the crosshair/player area to the bottom of the game view. Build toward a Fallout-style modular HUD with separate configurable target-information, inspection, and pickup-log elements. Keep text clear of the player and crosshair, avoid overlapping health/ammo or notification text, and respect CRT safe margins in both 4:3 and 16:9, windowed and fullscreen. These informational elements must not take focus or release mouse capture.

## SF-028 — Skill-O-Matic module reference and assets
Status: Inspected; implementation planned.
Source: Desktop/UI Elements.zip; supplied Instagram screenshot is the layout reference.
Inspected PNGs: Skill-o-matic A (housing/window/scroll track), B (long strip of LCD rows with indicator lamps and unlit segment pattern), C (ribbed physical scrollbar thumb).
Requested: Select Skill-O-Matic in HUD cursor mode; use its physical scroll control to browse skills. Clip the scrolling B layer and live LCD-style skill names within A's window; position C in A's track. Match orange/red segmented text and align each name to a row. Keep artwork separate from skill definitions and target-action logic; preserve camera on entering/exiting HUD interaction. Target skill rules are not yet defined.

SF-029 — Device HUD test: supplied remote, Candy head portrait TV, equipment/inspection/status CRT modules. Tab HUD cursor mode pauses gameplay and preserves camera on return; editor F2. Move/minimize/restore devices in HUD mode. Classic and Navigator CRT shell choices. Layout adjustments are session-only. Skill-O-Matic not yet functional.\nSF-030 — Holstering preserves current facing and updates remembered movement facing; only later movement changes holstered facing.


SF-031 — Fixed transparent CRT gaps with opaque backing layers and skin-specific screen bounds. Dedicated HUD portrait asset/metadata separate from gameplay sheet; health bands, transient damage and idle frame selection supported. Neutral placeholder shared across states pending custom portrait artwork. Browser verified damage-to-critical transition and no errors.


SF-032 — All descriptive event messages route to inspection CRT when present, without modal Continue or releasing pointer capture. Long text scrolls in Tab HUD mode. Event interpreter supports nonblocking message consumption while retaining modal fallback when no inspection element exists. Guide control instructions updated. Browser verified guide text in CRT, no busy modal and preserved pointer lock.


## SF-033 — Device typography and acquired HUD items
Current: Supplied CHECKBK0.TTF bundled locally and applied to device screen text and inventory.
Future: Modular HUD devices are actual collectible in-game items. Acquiring a device makes its UI functionality available. When no applicable device is owned, generic information uses a crumpled-paper UI with a separately supplied handwritten font. Keep font and presentation settings per module; the paper fallback must not inherit the Checkbook device font. Inventory ownership-to-HUD availability, paper artwork and handwritten font are pending.

## SF-034 — Checkbook for all visible text (next iteration)
Status: Planned; explicitly deferred by user.
Requested: Apply the supplied Checkbook font to all visible text for now, including page headings, controls, editor fields, menus, HUD modules, notifications, and text drawn on game canvases. Preserve readability at both display ratios and CRT-safe sizes. Baked lettering in supplied device artwork is part of the artwork and remains unchanged. The future crumpled-paper UI will use its own handwritten font when supplied.

SF-035 — Vanilla MZ 1.8.0 project inspection completed. One empty 17×13 map, no plugins, bundled Pixi 5.3.12. Recommended next editor work: combined page conditions, named variables/switches, structured branches/choices, common events and command registry in the existing in-level editor. Full findings: outputs/MZ-EDITOR-INSPECTION.md. No engine/import implementation performed in this inspection.


## 0.6 implementation and engine direction — 2026-10-04

Delivered this iteration: native profile/blood adaptation, armed/unarmed sheet switching, muzzle tool, topic parser, SE layout, editable global rules and soundtrack playlists. See CHANGELOG.md and PLUGIN-PORT.md for exact fidelity and remaining work.

Confirmed direction: reusable builder powering separately titled games, maps/events, expansions and mods. Future project manifest/export and mod compatibility remain planned, with engine/content separation required. Global parameter authoring is now a starting surface; broader event overrides and comprehensive property forms remain planned.

0.11: banked P-mode/inspection/map-scale changes implemented. Lighting remains future scope. See ITERATION-0.11.md.
