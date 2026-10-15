# Verification — 0.15.19

October 9, 2026. 75 source regression commands passed, including function-comment coverage (3,879 functions), restored camera-facing scale/tilt at five pitch angles, actual projected support-floor masking and nearer-wall masking.

Chrome browser acceptance passed room camera collision at forty positions, repeated pause/Resume and focused Escape, cursor and volume sync, real Save/Load and closed-door collision. Fullscreen entry, pause fallback, transparent action hitboxes and explicit Exit Fullscreen passed. Pause artwork screenshot was visually checked: labels sit on the four original plates with full black backing and selected hand cursor.

Steep-pitch browser rendering checks retain the camera-facing sprite and test lighting-canvas resources. Existing collision and source regressions passed; this does not prove every authored mesh is watertight or every game state is correct. Native Windows and macOS hardware execution remain unconfirmed here. Browsers that reserve Escape may leave fullscreen before opening pause; Keyboard Lock is used where available.

Final archive integrity and fresh extracted-browser acceptance are recorded in the adjacent release record.
