# Validation — 0.16.14

October 30, 2026. Passed:

- Complete core regression script and original plugin shader/default/palette checks.
- Original-plugin GPU pixel comparisons, authoring controls, save/load and HUD lifecycle.
- Exact four-colour quadrant placement using each of the four production custom vertex shaders, with/without filtering at 300x180 and 640x480. This detects inverted, stretched and misplaced geometry.
- Wilderness UI on/off/on, repeated Quake/original/Fallout 2 preset changes and pause/resume.
- One-second production measurement: 65 assembled frames, 65 renderer submissions, zero explicit world-copy render targets. Previous 0.16.13 produced two submissions per frame in each of three preset measurements. This verifies removal of the extra pass; it is not a hardware-independent FPS guarantee.
- Current visibility/movement and cinematic/melt/fade door integration tests.
- Maintained function-comment coverage: 7,109 functions.
- Packaged Windows Electron acceptance: repeated preset switches, 47,683 lit pixels in the sampled world region, version 0.16.14, no world-copy texture and no HUD capture error. Test profile and diagnostics removed after shutdown.

The older rendering-matrix1522 browser test could not execute its matrix because its active-map selector is hidden in play mode; its retired hub-saloon fixture also predates the current map library. This is recorded as an unexecuted legacy matrix, not a passing check. Current visibility, projection, preset and packaged tests exercise the changed rendering path.
