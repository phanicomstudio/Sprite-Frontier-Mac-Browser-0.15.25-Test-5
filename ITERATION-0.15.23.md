# Sprite Frontier 0.15.23 - performance iteration

October 12, 2026. Based on preserved 0.15.22. Implementation is current; validation/distribution status is in PERFORMANCE-AUDIT-1523.md.

Perspective opaque room surfaces and isolated door cinematics now use GPU sampling at the selected physical resolution. Crisp/Smooth selection remains intact; CPU geometry depth still governs sprite/model occlusion. Room alpha holes, BLEND doors, orthographic and unsupported contexts retain CPU fallback. Locked 0.15.17 camera-facing sprite tilt, proportions and frames remain unchanged.

Outdoor rendering caches exact terrain samples/tiles, prepares camera basis once, rejects conservative offscreen bounds, batches static triangles and uses conservative depth scanlines. Tessellation, texture coordinates and depth inclusion remain unchanged. Invalidation covers generation, spawn, terrain revision and edit identity; tiles are capped at 8192. Growing mesh capacity explicitly retires owned geometry/buffers while retaining shared textures.

Transfers reserve one owner. Destination texture preparation starts before playback; room decoding and initial door GPU work finish under black before animation. Concurrent requests and same-frame touch re-entry cannot queue another transfer. Gameplay input is blocked, cursor hidden, and no skip control exists. Failure/timeout releases ownership without another commit. Destination fade-in remains live rendered.

Options breathing persists across cell changes within the session, preserving phase/strength. Authored defaults apply before an Options choice; native commands can explicitly configure effective runtime. Application-restart persistence is not added. Native effects now draw inside the world frame before GPU submission rather than being discarded next frame.

The clean antique assembly replaces only the original embedded texture; shared identity, nodes and hinges match. Only the combined GLB/embedded texture is distributed. Supplied pack and previous releases remain intact.

## Reference and acceptance

Windows 10.0.26200; Intel Core Ultra 9 185H; 22 logical processors; Intel Arc through ANGLE/Direct3D11; automated headless Chrome. Total RAM querying was unavailable. Target: sustained 60 render FPS with p95 intervals below 20 ms in the recorded fixtures. This is not a universal hardware promise.

Matched 15-second moving-camera tests cover three scenes and six quality settings. Highest Smooth room rose from 9.3 to 89.8 FPS; forest 29.4 to 88.8; shared-door heavy fixture 9.0 to 76.0. Audit/raw results disclose tails, cold loading, further imported-model stress and resource counts. CPU submission does not prove GPU completion; asynchronous queries report Pixi and private room contexts separately, and cannot be summed as frame wall time. Native Windows/Mac acceptance remains separate.

## Maintenance and authoring

Existing resolution/filtering, door, arrival and authoring controls remain. GPU acceleration is automatic for eligible surfaces with no quality downgrade. Preserve every source explanation and historical document. Run test:audit, gameplay/model/hub tests and browser rendering/guard/transfer tests after changes. FUNCTION-REFERENCE-0.15.23.md/.json will index current source before distribution. Desktop uses a separate 0.15.23 profile; import older projects explicitly.


## October 12, 2026 - verified desktop startup supersedes earlier launch limitation
Windows Computer Use launched the actual 0.15.23-Release executable on the user desktop. Its returned window and screenshot confirm the game is rendering and displays prototype 0.15.23. Earlier subprocess/Electron automation failures are retained history and do not prove that the desktop application cannot launch. This verifies native startup only: native FPS/transition timing remains unmeasured. User input was detected during UI inspection, so control was yielded to avoid competing with the user. Source audit updated; archives still contain the earlier startup status and require documentation refresh before final delivery.


## October 12, 2026 - native Windows measurements supersede startup-only status

The actual Electron 44.5.1 Windows application was launched through Windows Computer Use. Measurements attach to its existing packaged renderer in a separate diagnostic copy with an isolated profile. They do not launch headless Chrome. The normal release remains free of a debug listener. The diagnostic page reported visible/focused state during inspection. The user also observed the repeated door and breathing tests on the desktop. Other desktop applications remained open, so these measurements describe this active desktop and do not isolate background CPU/GPU contention.

Each moving-scene/quality observation lasts 15 seconds. Physical framebuffer dimensions and content are unchanged. The matching before/after table above remains a controlled browser comparison; the native results below are separate and must not be substituted into that comparison.

| Native scene | Density | Filtering | FPS | p95 ms | Worst ms |
|---|---:|---|---:|---:|---:|
| forest | 1 | crisp | 65.1 | 22.0 | 35.2 |
| forest | 1.5 | crisp | 68.6 | 20.2 | 28.3 |
| forest | 2 | crisp | 63.7 | 22.8 | 33.0 |
| forest | 1 | smooth | 75.6 | 18.4 | 29.6 |
| forest | 1.5 | smooth | 69.3 | 20.2 | 30.3 |
| forest | 2 | smooth | 56.9 | 25.4 | 36.5 |
| textured-interior | 1 | crisp | 89.9 | 11.5 | 28.5 |
| textured-interior | 1.5 | crisp | 89.9 | 11.8 | 19.2 |
| textured-interior | 2 | crisp | 81.8 | 16.7 | 37.9 |
| textured-interior | 1 | smooth | 90.0 | 11.5 | 16.5 |
| textured-interior | 1.5 | smooth | 89.7 | 12.0 | 17.8 |
| textured-interior | 2 | smooth | 75.7 | 18.3 | 26.0 |
| model-heavy | 1 | crisp | 88.5 | 13.9 | 54.6 |
| model-heavy | 1.5 | crisp | 77.7 | 17.0 | 22.8 |
| model-heavy | 2 | crisp | 55.6 | 22.9 | 29.2 |
| model-heavy | 1 | smooth | 86.9 | 15.2 | 36.7 |
| model-heavy | 1.5 | smooth | 75.9 | 17.6 | 51.2 |
| model-heavy | 2 | smooth | 51.6 | 24.7 | 60.9 |

Highest Smooth textured-room performance is 75.7 FPS with p95 18.3 ms in this native run. The original nearly unplayable room behavior is no longer reproduced. The highest Smooth forest reaches 56.9 FPS and the shared-door stress fixture 51.6 FPS, both below the 60 FPS target. Several other p95 targets are also missed; see the full table. No resolution, filtering, effects or scene-content reduction was applied.

Native imported-mesh stress (twelve shared 1500-triangle meshes) reaches 32.0-75.2 FPS depending on mode, with highest Smooth 43.7 FPS. Native forest breathing/particle stress reaches 46.1-86.0 FPS; its textured interior reaches 72.8-89.9 FPS. CPU geometry/depth/terrain processing remains limiting. These are remaining optimization limits, not claims of universal 60 FPS. Raw observations retain all six imported-model and twelve effect cases.

Native asynchronous GPU profiling measures the private room color context at about 1.36 ms median and shared-door room context at about 1.30 ms; corresponding CPU scene submission medians are 10.3 and 12.5 ms. Forest CPU submission median is 14.4 ms. Main Pixi query results are retained separately in native-gpu-profile1523.json. Per-context GPU times are not additive frame wall times; browser/native heap values remain estimates rather than total RAM or VRAM.

All 24 native stress transfers across six quality modes produced exactly 24 commits and 24 completions, rejecting immediate duplicate requests and retaining breathing. Animation p95 is about 11.2-11.4 ms. One recorded interval reached 133.3 ms at a start boundary with transition elapsed time still zero, alongside a 144 ms main-thread task. Its exact source is unproven; the raw trace is retained. Do not interpret this run as a zero-spike guarantee. The remaining stress-animation intervals stay below 23 ms.

Four subsequent normal authored-speed saloon-pair transfers, alternating both directions, used the event configurations unchanged: 1.3-second approach, 1-second passage, 85-degree leaves at 65 degrees/second and normal random sound choices. Warm complete transfer duration was about 5.6 seconds (cold first 6.2 seconds); animation median 11.1 ms, p95 11.4 ms, worst 11.9 ms, no recorded slow frames. There was one commit/completion per activation and breathing stayed enabled. Stress-test shortened timings are not production defaults.

Native startup, real-frame timing and lifecycle validation are now established on Windows. macOS native execution remains unavailable; the Mac edition is a browser package. Earlier startup-only notes and failed subprocess methods remain historical and are superseded by this section. Repeatable native harness instructions are in tests/native/README.md.


## October 12, 2026 - final cinematic-clock validation

Supersedes the earlier readiness-boundary interpretation: scene lifecycle elapsed is not the door animation clock. The timing fixture now observes the exact seconds supplied to production door update, records readiness boundaries separately, and rejects empty moving-frame samples. The invalid intermediate measurement is retained as native-door-clock-correction1523.json. The original 133.3ms interval remains historical evidence with an unproven exact cause.

The corrected native all-six-mode run records 6094 moving intervals over 24 alternating cold/warm transfers. Median 11.1ms, p95 11.2ms, worst 44.5ms; 3 moving intervals over 40ms. All 24 commits/completions are exact and breathing remains enabled. Raw evidence: native-door-boundary-matrix1523.json. No production timing, filtering, geometry or resolution changed for this measurement correction.

Current function reference and comment coverage include 4535 maintained functions after six documented test-clock callbacks were added. Earlier 4529-count checkpoints are preserved history.
