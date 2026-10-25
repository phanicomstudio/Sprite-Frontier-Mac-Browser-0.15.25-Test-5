# 0.15.3 — restored room aiming and authoring tools

Fixed-room shots again follow the continuous mouse target, as in 0.15.1. The eight-direction shot restriction is rolled back. Room zoom, normalized movement, cursor hiding and single-frame taps remain. The default launch starts in the outdoor Vector demo hub, including when an existing local map library last selected an interior. Selecting a map or loading a playtest still takes you to that chosen map. The Room Test exit stays outside its floor.

## Tools ready to use

See TOOLS-QUICKSTART.md for room scale, floor/collision drawing, furniture, exits, normal-map lighting, event dialogue and barrel calibration. These extend the existing tools; this release does not replace the room authoring workflow.

The new Aim / barrel calibration button sits beside Armed crosshair. Guides are stored by sheet profile, direction and animation frame. Place the muzzle, then a point beyond it along the drawn barrel. An optional forward-depth value supplies the third axis that a 2D line cannot encode. Existing crosshair aiming remains the default. Selecting Use calibrated barrel guide affects third-person perspective shots only. Fixed rooms, first person, holstered actors and frames without a guide retain existing aiming. No arm splitting or rotating pivot is used.

The calibrated reticle uses the same origin, direction and collision sweep as the shot, before weapon spread. Yaw/pitch corrections apply to both. It updates with the existing HUD interval rather than introducing a new full-frame pass. Disabled profiles return early. Copy row translates guide points with frame columns; undo and JSON import/export preserve profile data. Calibration is a separate JSON project asset; export it alongside your map project.

Editor polish: event templates now report local saving failures and permit updating existing templates at the library limit. Placed template IDs are unique. The event debugger samples only when its section is expanded. Room exit instructions explain the connected opening.

## Verification

All source regression tests passed, including new barrel validation/compatibility tests. Actual browser editor checks passed for dialogue, choices, branches, rewards, journal, self-switch pages, page copy/delete, templates, undo, rejected edits and JSON export/import. Room checks passed for scale, normalized movement, continuous off-axis cursor firing, zoom, cursor hiding and walking through the exterior exit.

Additional tool checks passed for entrance naming/facing, exterior exit authoring/destination/radius/delete, room light edit/undo, primitive drag/height/color/delete, map creation/rename, project export/import with remapped IDs, persistent authoring and outdoor startup. Normal generation, painting, undo, PNG export/import and the live GPU lighting filter passed. Barrel authoring, row copy, undo, JSON roundtrip, camera-angle/zoom trajectory consistency and reticle alignment passed. Water tests cover all 16 equipped/unequipped facing combinations and the underwater threshold; Cerebral crossfades, hub quest persistence and playtest save/load also passed. No browser/WebGL errors were observed.

Performance: large 512×256 map with 8,028 objects and 1,296 water cells measured 9.8 ms median / 15.7 ms p95 draw submission. A fixed room with 128 normal-lit sprites plus background measured 1.1 / 2.1 ms; 128 boxes with 640 faces measured 3.8 / 5.3 ms. Caches remained in use. These are headless Chrome CPU submission timings, not native FPS; load and garbage collection affect measurements.

Native Windows launch and physical controller/multiplayer hardware were not retested. This audit covers the listed workflows, not every possible authoring combination. The fixed-room firing redesign remains deferred. The normal workbench makes editable approximate normals from a height field; it cannot recover exact original mesh normals from a single rendered image. Baked shadows in supplied artwork remain baked. Optional depth occlusion, elevated floors and colored local lighting remain future work.
