# 0.15.23 performance audit — October 12, 2026

Windows is the primary delivery. **Native Windows startup is verified on the user desktop.** Windows Computer Use launched the actual packaged 0.15.23-Release application and its window rendered the current iteration. Native frame-rate and transition measurements are recorded below using a separate copy with an isolated profile and an explicit loopback diagnostic listener; the ordinary release has no listener. Earlier subprocess/Electron automation failures are historical launch-method failures, not evidence that the desktop application cannot launch. Mac native testing remains unavailable.

## What changed

Room slowdown came from CPU per-pixel rasterization and Smooth sampling. Eligible opaque perspective rooms and isolated door cinematics now use GPU color sampling at full selected density; original CPU depth still controls sprites and models. Terrain repeated shared elevation/projection work, allocated many small objects and submitted separate meshes; exact caches, conservative bounds/scanlines and one static mesh reduce that work. Static model vertex transforms/projections/material preparation now reuse bounded records. GPU uploads and static geometry retention have explicit limits and disposal.

A Transfer Player command could permit another touch trigger in the same frame before transition ownership was visible. Both command and interaction paths now respect pending ownership. Cold decoding/uploads also occurred during door animation; destination decoding and nonblocking GPU readiness now finish under black before playback. Twenty-four alternating transfers passed exactly one commit/completion each; all six quality settings passed repeated transfers with no animation interval over 13 ms. Cold loading delays remain reported separately.

Options breathing previously belonged to a replaced cell runtime; a session controller preserves it across transfers. Native particles were appended after submission and discarded next frame; they now render before the world submission. Locked 0.15.17 camera-facing sprite tilt/proportions/frames remain unchanged. The clean antique door replaces its embedded texture with identical geometry/nodes.

## Reference and measurements

Windows 10.0.26200; Intel Core Ultra 9 185H, 22 logical processors; Intel Arc/ANGLE Direct3D11; headless Chrome. Total RAM query unavailable. Target is sustained 60 render FPS and p95 under 20 ms on these fixtures. CPU submission timings are separate from actual frame intervals. Asynchronous GPU queries record main Pixi and private room contexts separately; their times are not additive frame wall time. These figures are **browser results on Windows**, not native Windows application results.

Matched 15-second camera-motion observations, unchanged scene content and physical density:

| Scene | Density | Filtering | 0.15.22 FPS | 0.15.23 FPS | New p95 ms |
|---|---:|---|---:|---:|---:|
| forest | 1 | crisp | 34.9 | 90.0 | 11.7 |
| forest | 1.5 | crisp | 33.1 | 89.7 | 12.3 |
| forest | 2 | crisp | 31.0 | 88.5 | 13.9 |
| forest | 1 | smooth | 34.0 | 89.9 | 11.7 |
| forest | 1.5 | smooth | 31.3 | 89.6 | 12.8 |
| forest | 2 | smooth | 29.4 | 88.8 | 14 |
| textured-interior | 1 | crisp | 38.2 | 90.0 | 11.6 |
| textured-interior | 1.5 | crisp | 19.1 | 89.9 | 11.6 |
| textured-interior | 2 | crisp | 12.1 | 90.0 | 11.6 |
| textured-interior | 1 | smooth | 31.8 | 90.0 | 11.6 |
| textured-interior | 1.5 | smooth | 15.8 | 90.0 | 11.7 |
| textured-interior | 2 | smooth | 9.3 | 89.8 | 11.8 |
| model-heavy | 1 | crisp | 35.2 | 90.0 | 11.6 |
| model-heavy | 1.5 | crisp | 18.7 | 89.7 | 11.7 |
| model-heavy | 2 | crisp | 11.9 | 77.3 | 14.9 |
| model-heavy | 1 | smooth | 30.5 | 90.0 | 11.6 |
| model-heavy | 1.5 | smooth | 15.6 | 89.9 | 11.6 |
| model-heavy | 2 | smooth | 9.0 | 76.0 | 15 |

## Remaining limits

The additional twelve shared 1500-triangle meshes (18,136 submitted triangles) reach 55–56 FPS at highest density, versus 6–9 FPS previously; p95 is 25–27 ms. This misses the target. CPU model triangle/depth traversal remains the bottleneck; broader gameplay GPU depth/model integration is future work. No geometry or filtering was removed to obtain the improvement.

A longer forest fixture with breathing and about 440 active native particles reached about 50–62 FPS across modes, also missing the target in several settings. The corresponding interior reached 74–90 FPS. Shorter subsystem profiling produced higher forest throughput; this variation means the shorter run cannot override the sustained misses. In that profile, CPU terrain assembly was about 6.9 ms/frame, water 1.1, native effects 0.8 and submission 1.6; main GPU median 2.2 ms. Further terrain/frame-pacing work remains for dense effect scenes. The plain fixed-camera fixture reached about 90 FPS in all six settings.

Prepared room GPU texture count/pixel-byte estimates remained constant over repeated transfers. Static geometry caches cap 200,000 triangles/128 entries globally and 32 entries per asset. Private GPU upload caches cap 64 textures/256 MiB, with an individually larger requested image retained alone at full resolution. Eviction releases GPU copies and reloads if needed; no silent quality reduction. JavaScript heap samples alone do not prove retained-heap stability or total VRAM usage.

## Validation and evidence

84 pure regression scripts pass. Browser resolution, door/state roundtrip, occlusion, guards, locked sprite appearance and terrain buffer lifecycle pass; the projection test passes at its corrected pure-test path (the mistaken path attempt is retained in evidence). GPU shader/depth/filter/readiness/disposal and upload-cache eviction pass. Exact raster comparisons include 600 default/cached and 6000 subpixel/grid-center cases. Source function-comment coverage currently passes for 4529 functions; coverage proves presence, and source explanations remain the review authority.

PERFORMANCE-EVIDENCE contains raw timing/lifecycle/test observations. PERFORMANCE-AUDIT-1523.md retains investigation history and superseded checkpoints. Native Windows measurements below and the stated high-density/effects target misses remain explicit; this report does not claim universal or fully target-compliant performance.


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
