## October 22, 2026 — current iteration 0.16.0

See EDITOR-REDESIGN-0.16.0.md for the implemented foundation, migration limits and remaining milestones, and SPRITEFUSION-0.16.0.md for local native-resolution generation, licensing and build provenance. Earlier explanations below remain historical; this dated entry supersedes conflicting UI, generation and normal-budget descriptions.

## October 22, 2026 — current iteration 0.15.27

See ENEMY-EVENTS-AND-FONTS-0.15.27.md for enemy events, arsenal archetypes, supplied sprites, muzzles, respawn/save ownership and readable editor/selectable gameplay fonts. This dated record supersedes conflicting behavior below; earlier explanations remain history.

## October 22, 2026 — current iteration 0.15.26

See PROJECTILE-ARSENAL-0.15.26.md for active finite projectile collision, weapon/ammo authoring, overdamage gibbing, cream/synth alias behavior, provenance and verification limits. src/ballistics.js owns shared swept movement and terminal impacts; src/arsenal.js owns presets and inventory ammo accounting; Phanicom_BloodSystem retains victim-owned blood identity. Earlier behavior descriptions below are preserved history and are superseded where this dated record explicitly differs.

# Sprite Frontier 0.15.25 — user test build

October 14, 2026. User authorized packaging for hands-on testing. See TEST-BUILD-0.15.25.md for changes and outstanding verification. Prior release claims below are preserved history, not certification of this build.

# October 14, 2026 — final delivery record

See RELEASE-VALIDATION-0.15.24.md for current acceptance, measurements and limitations, including the user-directed end of exhaustive manual comment review. Earlier pending/candidate statements below are chronological history. Final distributions include this report; executable application behavior is unchanged from the tested second candidate.

# Sprite Frontier 0.15.24 — release candidate

October 14, 2026. This complete iteration includes the engine/editor workspace, modular and round room construction, supplied castle/prop assets, geometry collision, per-instance materials and bounded local lighting. See AUTHORING-GUIDE-0.15.24.md, EDITOR-CONTROLS-0.15.24.md and VALIDATION-1524.md for current behavior, evidence and limits. Final packaged Windows acceptance is pending; this heading does not claim release completion. Earlier version headings below remain history.

# Current iteration: Sprite Frontier 0.15.23

October 12, 2026. Read ITERATION-0.15.23.md and PERFORMANCE-REPORT-1523.md for current behavior, measurements and unresolved limits. Windows is the primary package; native Windows startup, moving-scene timing and door lifecycle tests are verified. See the report for measured target misses and limits. Earlier current-version headings below remain preserved history and are superseded by this entry.

<!-- October 9, 2026: current 0.15.19 behavior is documented in ITERATION-0.15.19.md. Prior upright sprite and Arial pause notes below are superseded, retained as history. -->

## Current update — 0.15.18, October 9, 2026

Read ITERATION-0.15.18.md and CAMERA-SPRITE-PAUSE-GUIDE.md for current camera, sprite, door collision and pause behavior. Older version-specific statements below are retained history and superseded where the current guide differs.

## Current iteration — 0.15.17, October 9, 2026



Use ITERATION-0.15.17.md and HUB-DOOR-GUIDE.md for current behavior. Older version

claims below are retained historical notes and are superseded by those guides.

Windows: extract the full archive and run Launch Sprite Frontier.cmd.

Mac: extract the full browser archive and open index.html in Chrome. Keep the

entire folder together. Choose Hub Test to try the new doors, shops and static

items; original test maps remain available.



Current iteration: 0.15.15 fixes real-building stairs and post-landing movement. See ITERATION-0.15.15.md for current behavior and verification.



Complete 0.15.15 iteration candidate: walkable static model geometry, stairs, roofs, jumping/landing and ceiling collision. 68 source checks and 15 browser checks pass; see ITERATION-0.15.15.md for remaining release gates.



# Sprite Frontier 0.15.15



Complete new iteration with static 3D models, shared model resources and independent collision/interaction volumes. MODEL-AUTHORING.md explains importing and placing models and making door-only interactions. MODEL-PERFORMANCE.md records measured costs and limitations. Earlier iterations and bundled test maps are preserved; this release uses independent saved-state storage.



# Existing engine features



Complete iteration candidate for exploration, quests and combat with a readable event editor. Read PROJECT-OVERVIEW.md for design/status and ITERATION-0.15.15.md for current changes and verification.



## Play



Browser: open index.html in Chrome with the entire folder kept together. Optional Node development server: npm start. Windows distribution: extract the complete archive and run Launch Sprite Frontier.cmd. The Mac edition is a browser folder, not a native macOS app.



Select Supplied Assets Forest Test in Active map for textured terrain, trees and a pool with no enemies. Click the view to capture look; Escape releases it. WASD moves, E jumps, V changes camera and P enters point-and-click mode. F2 opens authoring.



## Author



New map adds a separate map and preserves bundled test maps. In authoring mode right-click ground and choose Create Event Here. Configure pages/appearance/behavior/commands, then Apply or OK. Cancel discards unapplied changes. Map tab can add the Courier or Patrol Encounter example as separate maps. Export all maps for backups and colleague exchange; local browser storage alone is not a backup.



Sprite normals: open the normal workbench, choose/load a profile, generate or import normals, preview and Apply. Map transition can use fade or melt. See EVENT-AUTHORING.md, SPRITE-NORMALS.md, SCREEN-MELT.md, COURIER-EXAMPLE.md and PARTY-ENCOUNTER.md.



## Verify and extend



COLLEAGUE-HANDOFF.md explains workflow and module contracts. CODE-GUIDE.md, GAMEPLAY-DATA-EXTENSIONS.md and MZ-COMPATIBILITY.md record extension boundaries and deferrals. ASSET-OPTIMIZATION-GUIDE.md covers dimensions/formats/packing/memory and the staged optimization roadmap.



Source regression commands are in package.json. Portable browser fixtures and dependency instructions are in tests/browser/README.md. Browser checks passed on Windows Chrome. macOS remains untested. Native automated launch currently encounters a workspace ACL error before rendering; complete archives have passed integrity checks; native Windows 0.15.9 startup was confirmed by the user; native Windows 0.15.10 and macOS execution remain unverified. This is not a full MZ-parity claim. Previous iterations remain intact.



## October 10, 2026 — rendering iteration update

Current rendering architecture and authoring instructions are in RENDERING-1522.md. PERFORMANCE-1522.md retains preliminary runs and the superseding precise-memory matrix. FUNCTION-REFERENCE-0.15.22.md/.json index maintained source contracts. Historical notes above remain intact; their resolution/breathing pending statements are superseded by the implemented controls, native command dialog and isolated live preview.

High-density browser acceptance now covers aspect/fullscreen/preference reload, door cinematic dimensions and cell/project state roundtrip, camera clearance at 40 pitch/orbit combinations, door body blocking, room/model occlusion and pause/menu interactions. Packaging verification and native platform testing status are recorded separately at delivery.


## Final release status — October 10, 2026

Supersedes the development/pending status above: 0.15.22 is the complete resolution, filtering and native breathing iteration. Required source suites, comment coverage, high-density browser lifecycle/door/occlusion/guard tests and the eighteen-case precise-memory performance matrix passed. The browser archive was extracted and its real rendering-controls/preview/lifecycle test passed; both distribution manifests were hash-verified. Original assets and prior source block comments were compared with 0.15.21 and remain intact. Earlier release manifests were also verified unchanged.

Complete Windows and Mac browser archives contain source, assets, function reference, guides and validation evidence. Native macOS execution was unavailable. Windows browser checks passed; the packaged runtime version probe exited successfully without diagnostic output, which does not prove native graphical acceptance. Manual native Windows/Mac acceptance remains explicitly unverified, rather than being represented as tested. Performance and GPU-memory limitations are documented in PERFORMANCE-1522.md and VALIDATION-1522.md.


## October 12, 2026 - 0.15.23 current behavior
See ITERATION-0.15.23.md and PERFORMANCE-AUDIT-1523.md for current rendering, preparation ownership, performance evidence and limitations. Earlier version-specific instructions above remain history and are superseded where these documents differ. Locked 0.15.17 camera-facing sprite presentation remains mandatory.


## October 12, 2026 - verified desktop startup supersedes earlier launch limitation
Windows Computer Use launched the actual 0.15.23-Release executable on the user desktop. Its returned window and screenshot confirm the game is rendering and displays prototype 0.15.23. Earlier subprocess/Electron automation failures are retained history and do not prove that the desktop application cannot launch. This verifies native startup only: native FPS/transition timing remains unmeasured. User input was detected during UI inspection, so control was yielded to avoid competing with the user. Source audit updated; archives still contain the earlier startup status and require documentation refresh before final delivery.


## October 12, 2026 - current Windows delivery status

Native Windows measurement and authored-speed door acceptance supersede earlier startup-only notes. Read PERFORMANCE-REPORT-1523.md for the current native results, the retained startup-boundary spike and remaining forest/model/effect target misses. Source and archive checks are recorded in VALIDATION-1523.md. tests/native/README.md explains the repeatable isolated diagnostic harness. No diagnostic configuration or profile is included in either complete release package.


## October 14, 2026 — Test 2 authoring update

See TEST-BUILD-0.15.25-TEST-2.md for the current workflows, validation and remaining limitations. Earlier release descriptions above are retained history. New native item sprites use FrontierSprites single-frame metadata; item placement uses normal event pages/self-switches, compact carried/drop state, the shared prop surface query, and active-cell light budgeting. Map folder metadata is authoring-only. Blank projects suppress example-map recovery migrations. No change to the locked 0.15.17 player sprite presentation.


## October 14, 2026 — Test 3 editor layout and deletion

Supersedes Test 2 three-column authoring layout: project actions are at the top; scene, build tools, categories and original property controls share a scrollable left dock. The playable edit view occupies the right. Authoring uses readable Arial text; game rendering and 0.15.17 sprite presentation are unchanged. Scene entries expose Delete alongside their names and route through the original owner transaction; Undo and Redo are visible on the top toolbar. Shared image/model asset files are retained when placed instances are deleted.

Validation: real browser authors geometry, deletes a wall with the visible action, restores it with Undo, verifies left/right bounds, edits properties and checks playtest/runtime guards. Performance checks remain assigned to the user.


## October 14, 2026 — Test 4 room movement and tile drafting

Current behavior supersedes Test 3 handoff and boundary-stroke behavior. Entering playtest retains a clear editor XYZ position. If editor noclip or an edited spawn overlaps room collision or lies outside the painted floor, the runtime tries nearby supported points and authored tile centres, checking full body clearance. It does not rewrite the spawn, geometry or camera. If no clear point exists, it remains in the editor and reports the problem. Both editor/playtest transitions focus the game view so a hidden form control does not retain keyboard ownership.

Tile painting and doorway insertion validate proposed additions before changing the draft. Out-of-bounds/capacity failures leave a usable draft; later paint and erase work without discarding it. Invalid dimensional fields preserve the previously rendered grid and show a correction message rather than clearing the canvas. Plan canvases and fieldsets fit the left dock, and touch painting suppresses browser scroll gestures.

Validation: production browser controls reproduce a wall-overlapping saloon spawn, enter playtest nearby and move with WASD; reject an edge stroke then paint/erase/apply successfully; preserve canvas pixels during invalid input; verify dock bounds. Existing editor altitude/playtest, terrain/input and locked sprite-presentation checks are retained. Performance profiling remains with the user.


## October 14, 2026 — Test 5 scene selection and separate Tile Room Editor

Supersedes Test 3/4 hierarchy navigation: clicking a scene name highlights it without scrolling away. Edit selected explicitly opens its properties. Shift-click selects a visible range; Ctrl/Cmd-click toggles individual entries. Select all shown follows the search filter; Clear selection resets it. Delete selected removes the highlighted instances in one validated Undo transaction, including mixed room/event/light selections. A row Delete removes only that row. Both deletion paths retain dock/list scroll position, with normal end-of-list clamping, and preserve shared assets.

Build Structures now opens a large, separate modal Tile Room Editor. The dock launcher remains available. Wall, floor and ceiling each have a texture picker, thumbnail and PNG/JPEG/WebP file loader (8MB maximum per file). Imported textures are embedded in portable authored data. New layouts default to Tin ceiling, rather than roof tiles. Saved older textures remain available for deliberate replacement. Apply room layout commits geometry and saved role choices; its visible replacement checkbox controls whether selected textures replace existing layout overrides. Apply textures to all room surfaces updates generated or named structural wall/floor/ceiling primitives in one Undo step without changing dimensions; unclassified furniture/boxes are retained. Original compiler preservation remains the default for other callers.

The modal keeps settings and the grid in separate panes. It retains unsaved draft when closed normally; Apply/Discard are explicit. World movement is paused while this authoring window owns input; F2 closes it before switching mode. Existing mode-reset behavior for uncommitted drafts remains applicable. Original grid dimensional controls remain under Grid dimensions and room height.

Delete current map still prevents deleting the last map or a map with incoming references. Rejections now explain the reason beside the buttons, including how to create a replacement map; no silent action or removed user files. Successful map deletion, map Undo/Redo and retained subsequent edits were exercised through the real controls. Optional authored encounter/courier examples remain under Optional examples and test maps. No prior controls/options were removed. See CONTROL-CHECKS-TEST-5.md for scope/evidence; this is not a certification of every possible engine workflow.
