# Performance audit — October 12, 2026

Development status: incomplete. Based on preserved 0.15.22; no release acceptance claimed.

## Confirmed source findings

- model-renderer.js triangle rasterization and Smooth texture interpolation execute on CPU. Smooth sampling allocates channel arrays per sample and performs four-neighbor wrap/interpolation work. Room surfaces and imported models upload completed CPU images to Pixi.
- app.js frame always renders world and native effects after transition update, including while door cinematics occupy the screen. Door rendering adds a separate CPU model pass to this cost.
- Previous 0.15.22 measurements already show 112.5 ms median CPU render work in high-resolution Smooth interior and 134.5 ms in shared-model fixture. These are not GPU times or sustained FPS.
- scene-transition.js rejects concurrent jobs, but reservation protection alone does not prove duplicate activation cannot occur after completion. Trace interaction and interpreter ownership before changing transfer semantics.

## Validation plan and gates

Measure real animation-frame intervals, CPU sections and available GPU timing across forest, textured room, model-heavy scene, all three densities and both filters. Include cold/warm loading and repeated two-way doors. Preserve equivalent camera/content and raw evidence. Inspect actual browser renderer/backend; hardware queries through CIM currently unavailable. Do not label software-renderer numbers as hardware GPU performance.

Target: sustained 60 FPS on an explicitly recorded reference configuration, with p95 frame interval near one display refresh and no severe cinematic stalls. Record misses honestly. Preserve physical resolution, filtering, content, locked sprites, collision and depth protection. GPU migration must retain depth interoperability with existing sprites and terrain.

Deliver complete new Windows/Mac browser packages only after implementation, behavior regression, documentation/comment coverage and sustained performance acceptance. Goal remains active.

## October 12 checkpoint: door presentation ownership
Baseline eighteen-case CPU matrix completed in test-artifacts/rendering-matrix1522.json. Opaque door phase now suppresses hidden world/native-effects draws; fade-in and melt remain live. tests/transition-performance1523.cjs verifies phase ownership plus concurrent rejection and exactly one commit/resume; existing scene-transition159 and door-hub1517 pass. Function coverage passed 4168 before the new dedicated test. Browser door1522 acceptance is running. This does not yet fix CPU interior rasterization, duplicate post-completion interactions, or destination preparation; goal remains incomplete.

## Allocation-free sampler checkpoint
Production CPU rasterization resolves texture/sampler/filter once per triangle, uses scalar perspective UV weights, and reuses one RGBA buffer per triangle. Preserved original sampler remains a reference. 9600 deterministic comparisons verify exact sampling equivalence across Crisp/Smooth and repeat/mirror/clamp modes. Live occlusion acceptance passed. Latest highest-density Smooth medians: interior 41.6 ms; model-heavy 46 ms. These short CPU observations are encouraging but remain above the target and do not prove sustained FPS. Raw observations retained as after-allocation-removal1523.json. GPU migration and broader sustained evidence remain required.

## Transfer re-entry checkpoint
Source evidence: runInterpreter clears execution after a transfer, then the same session update can start an overlapping touch/autorun event before app transition gating on the next frame. Added transitionPending service gate immediately after main interpreter work, plus first-owner checks in both app transfer entry points. Dedicated overlap regression now passes; existing touch debounce/events/door suites pass. This fixes the identified same-frame queue path, not yet proof of every user-reported repeated transfer. Repeated live transfers and cold/warm preparation remain required.

## Destination lookup and sustained instrumentation
Transfer Player destination validation previously called mapLibrary.snapshot(), cloning all maps and exporting model bundles just to find one destination. Optional read-only resolveMap lookup now avoids this; same-map lookups use the live authored world. Legacy map-array callers retain compatibility. Direct/variable transfer, chained continuation, off-map state and new no-snapshot lookup tests pass. New sustained-matrix1523 browser benchmark records six-second-per-quality render intervals, CPU duration, heap and browser GPU backend/extension metadata. It does not yet measure GPU elapsed queries; GPU milliseconds remain explicitly unavailable. Its live process must finish before interpreting results. Source function coverage passed 4210 before added lookup tests.

## Scanline raster checkpoint
Triangle bounding-box traversal now computes a conservative horizontal span per row; original barycentric inclusion/depth/sampling remain authoritative. 300 exact pixel/depth comparisons against preserved 0.15.22 pass, including perspective/orthographic, clipped screen bounds and both filtering modes. Live occlusion acceptance passes. Prior sustained evidence is retained in before-scanline1523.json. GPU investigation: Pixi world meshes already support sampled textures, but model/terrain inverse-depth currently feeds CPU sprite visibility regions; migrating only room color to a GPU mesh would leave CPU depth work and risks incorrect billboard masking. A replacement must preserve shared depth interoperability, perspective UVs and support-height exemption, rather than simply drawing textured quads. No GPU migration acceptance claimed.

## Mask traversal checkpoint
Latest completed scanline benchmark highest-density Smooth: forest 32.98 render FPS / 29.3 ms median CPU; interior 28.71 FPS / 33 ms CPU; model-heavy 26.77 FPS / 35.9 ms CPU. Still below target. Raw prior result retained as after-scanline-before-mask1523.json. Small vector props no longer scan full-viewport depth masks; conservative bounds include local paths, stroke, health bars and corpse rotation. Furniture keeps full bounds. Mask scalar depth reciprocal and support camera trigonometry are hoisted; function-based sprite depth remains unchanged. Tests must prove masking and locked presentation before release.

Mask checkpoint verification: current occlusion1522 browser acceptance and locked sprite-projection1518 pass. Historical terrain-occlusion157 harness fails due to its hardcoded old release URL, so it is not counted as current acceptance. Longer post-mask benchmark remains running.

## Active-cell synchronization checkpoint
map-library remember/switchTo previously invoked snapshot() and discarded the full cloned project. syncActive1523 now performs only the required active-world clone, shared model reference refresh and numeric identity maintenance. snapshot() remains a complete isolated clone for save/export. Real browser door, home/return state, pawn recovery, inventory/drop, project round-trip acceptance passed. Function coverage passed 4217. Longer post-mask results remain below target (highest Smooth forest 33.05 FPS, interior 28.61, model-heavy 23.61); masking was not the dominant remaining cost. Next audit must profile individual render subsystems and submission, and address destination preparation/long transfer cycling. No release claimed.

## Inclusive subsystem CPU profile
Test-only wrappers measured highest-density Smooth on equivalent fixtures. Forest outdoor-assets draw: 28.9 ms/frame inclusive, terrain depth 4.67, submission 3.81, masks 0.90. Interior room geometry: 32.94 ms/frame, models 0.82, submission 0.17. Shared-model fixture room geometry: 33.93, models 4.88, submission 0.18. Timings are inclusive and must not be added where nested. Instrumentation has overhead; raw observations retained in subsystem-profile1523.json. These establish room pixel work and outdoor asset rendering as dominant paths rather than masks. Hardware backend: Intel Arc via ANGLE D3D11, browser reports 22 logical threads. GPU elapsed extension is supported; bounded asynchronous query harness now running, avoids blocking GPU synchronization and discards disjoint results.

## Measured GPU elapsed time
Asynchronous WebGL2 elapsed queries completed without blocking synchronization: highest-density Smooth forest GPU median 2.553 ms/p95 5.732 (162 samples), interior 0.518/0.602 (157), shared-model scene 0.512/0.624 (147). Corresponding inclusive CPU medians 33.8/34.8/38.3 ms. Queries cover actual Pixi renderer submission GPU commands, including uploads, not simulation or browser compositing; disjoint results are discarded. Raw gpu-profile1523.json retained. This confirms substantial unused GPU capacity and CPU-dominated room rasterization. Outdoor path generates/clips/sorts many subdivided terrain triangles and submits individual textured meshes; terrain geometry/depth and submission batching need attention. Test-only profiling functions all documented; coverage 4273 passes. Release performance remains unmet.

## GPU geometry prototype checkpoint
New geometry-gpu.js is experimental and deliberately not loaded by index.html until shared-depth interoperability is verified. Native WebGL2 depth resolves overlapping perspective triangles; GPU sampling handles Crisp/Smooth at requested physical dimensions; reusable vertex buffer and per-image textures avoid per-pixel JavaScript sampling. Real browser geometry-gpu1523 test passes shader setup, near/far overlap even with far submitted last, 2x physical density, both filters, shared texture counts and explicit disposal. Initial prototype supports repeated opaque/masked room materials; live fog, imported sampler modes, Canvas composition and CPU sprite support masks remain integration requirements. No production speed improvement or visual parity claimed from this isolated test.

## Live GPU room integration checkpoint
Perspective opaque room faces now use geometry-gpu color sampling at selected physical dimensions. CPU raster traversal writes inverse depth only; existing locked billboard support masks and imported model depth remain authoritative. Transparent materials and fixed/Canvas contexts keep historical CPU color path. Density changes release old GPU backend and Pixi upload resources. Resolution1522 real browser acceptance, occlusion1522, exact CPU raster reference and 4285-function comment coverage pass; room screenshot inspected with textures/door/player present. Isolated GPU shader test remains valid. Performance profile running; parity for additional camera angles/materials/resource lifecycle and full sustained acceptance still required. Prototype header history is superseded for supported live opaque perspective rooms only.

## User-reported breathing transition regression
Options breathing was previously game-local; room transfers create a new game object and controller from destination defaults, often disabled. setOptions now adopts a session-wide controller reused across cell replacements, preserving enabled state, phase, strength and fades. Map defaults still govern before the user chooses Options; native commands explicitly configure effective runtime. No authored map mutation. Pure test covers disabled-default source/destination, controller identity, zero-time cinematic freeze, exact phase/strength preservation and native disable override. Existing breathing suite and 4286-function comment coverage pass. Live door-cycle regression still required. Session persistence across application reload is not added by this fix.

## Corrected GPU eligibility
Prior integration benchmarks were actually CPU fallback, established by room-backend1523 authoritative backend diagnostics. Source wood textures alpha ranges are floor 249–255 and walls 200–255 with zero fully transparent texels. Existing room materials force OPAQUE output after excluding alpha below 1; rejecting all non-255 source texels was overly restrictive. GPU eligibility now accepts all nonzero-alpha room textures and explicitly forces material opaque output in shader; actual zero-alpha holes retain CPU fallback. Live occlusion and 4314-function coverage pass. Re-measurement and broader GPU visual acceptance remain required; supersedes earlier assumption that prior room screenshots proved the GPU path was active.

## Outdoor exact height cache
Outdoor terrain repeated hill/trigonometric elevation evaluation at shared quarter-grid triangle corners every frame. Added world-owned exact sample cache; generation/spawn/seed/edit revision/edits identity changes invalidate it. Signature checks occur once per draw, not per sample. Tessellation, clipping, texture coordinates, sorting and shared depth unchanged. Current profiling process started before once-per-draw optimization, so results cannot prove its final effect; rerun required. Original comments and source assets retained. Main room backend diagnosis now proves GPU path with 7 ms CPU median and 89.5 FPS in six-second room fixture; broader modes still pending.

## Terrain batching checkpoint
Static outdoor sorted triangles now submit through one reusable Pixi MeshGeometry with the same affine UVs, filtering, asset-style source and painter order. CPU depth raster remains unchanged. Active buffer views exclude stale triangles; capacity grows only when necessary. Animated water retains original path. Terrain cache uses numeric quarter-grid keys and per-draw signature invalidation including map dimensions. Brush revision, amplitude, edit-object replacement and spawn invalidation exact-value tests pass; 4318-function coverage passes. Longer terrain profile completed; raw subsystem-profile1523.json retained. Visual comparison, buffer shrink/growth and full modes still require acceptance before release.

## Cached exact terrain tiles and conservative rejection
Unchanged terrain tile grids/triangles now reuse world-owned cached records, invalidated with elevation samples and capped at 8192 tiles. Bounds derive from every exact tessellated vertex, preserving the existing 1x1/4x4 criterion. Eight-corner projected AABB rejection skips only all-behind or wholly offscreen tiles; near-plane crossing is conservatively retained. Exact vertex/tessellation/revision and near-plane regression tests pass, as does 4321-function comment coverage. Profile completed. Broader forest visual/depth comparison and sustained full-mode matrix remain required; six-second instrumented fixtures alone are not final performance acceptance.

## Shared projection and exact clipping checkpoint
Terrain camera basis is computed once per draw; shared cached grid vertices reuse per-frame forward depth and projection. Fully front/behind polygons avoid unnecessary near-plane output allocation; crossing interpolation remains historical. 500 exact clipping comparisons against preserved 0.15.22 pass across yaw/pitch/crossings. Cached height/tessellation tests and comment coverage pass. Instrumented profile completed; still requires sustained moving-camera and full-mode acceptance. No content reduction, resolution/filter changes or altered sprite presentation.

## Terrain depth and destination preparation checkpoint
Terrain inverse-depth now uses conservative scanline spans expanded by historical barycentric tolerance; 2400 exact grid comparisons against preserved 0.15.22 pass across all densities and clipped edges. Latest instrumented highest Smooth medians/FPS: forest 22.8 ms / 41.8, room 8.5 / 86.8, heavy 12.9 / 65.7. Forest still below target. Destination reservation now starts shared room-image and event-model texture decode before door playback, without switching maps or cloning project. Scene/overlap transfer tests and 4327-function coverage pass. Real cold/warm/live transfer lifecycle acceptance remains required.

## Prepared camera basis checkpoint
Terrain projection now retains camera yaw/pitch sine/cosine once per draw through a pure factory; 9000 exact output comparisons against unchanged 0.15.22 projection pass, including alternate logical framing and near rejection. Real door lifecycle test after early destination preparation passes with hub state/inventory/pawn recovery/export roundtrip. Full prolonged transfer lifecycle still pending. Comment coverage 4330 passes.

## Repeated real door transfer evidence
24 alternating hinged transfers at highest Smooth resolution passed, including cold first transfer, warm repeats, duplicate activation rejection, exactly one authoritative commit/completion each and session breathing enabled/strength retained. First transfer 3503 ms; warm median 3306 ms. Cinematic intervals: 5594 samples, median 11.1 ms, p95 22.2 ms, worst 133.4 ms. Retained room texture pixels stayed 34,676,736 bytes; default browser heap reporting rounded to 462 MB, insufficient to prove retained heap stability. Actual query/retained-resource evidence still needed. Cinematic tail stalls remain an audit item, not declared resolved. Function coverage 4356 passes.

## GPU cinematic integration checkpoint
Isolated door Canvas contexts now use shared GPU geometry for opaque/masked imported door parts, retaining original world transforms, clipped UVs, depth, filtering and glTF sampler wrapping. BLEND materials preserve CPU fallback; gameplay model/sprite depth is unaffected. GPU backend is context-owned and releases previous resources on density change. Live model preview/door test running; visual appearance, saloon framing, sounds and repeated timing must be verified before accepting this path.

## Cinematic resource lifecycle
GPU backend destruction now deletes every texture/buffer/program/VAO and explicitly loses the retired private WebGL context before density recreation, avoiding reliance on delayed context garbage collection. Added diagnostic texture counts/decoded byte estimates for room and isolated door backends; estimates explicitly exclude driver overhead. GPU door screenshot inspected: supplied textured assembly centered against black. Repeated 24 GPU transfers passed exact lifecycle and breathing preservation with precise heap reporting. Resource-count collection was added after that run started and requires the next run; no unsupported stable-retained-heap claim.

## Preparation ownership acceptance
Dedicated tests prove preparation occurs before cinematic begin exactly once, concurrent reservation rejects before additional preparation, commit/end/completion ordering remains correct, and preparation exceptions leave idle ownership with no extra commit. Function coverage 4372 passes. Automatic persistence now retries without allocating complete project snapshots while a cinematic is busy; the active precise-memory/resource-count repeated-door run must finish before evaluating its impact.

## Remaining stall trace instrumentation
Latest repeated-door run after snapshot deferral still had median 11.1 ms/p95 11.3 ms/worst 133.6 ms; deferral did not prove the rare stall resolved. Room GPU retained 3 textures / 34,676,736 pixel bytes and door retained 2 textures / 2,250,004 bytes from first through last transfer. Added bounded slow-frame records with map, commit count, transition phase/elapsed and browser main-thread long-task timestamps to correlate rare stalls. This is test-only instrumentation; next run waits for scene benchmark completion to avoid competing browsers distorting performance.

## Full six-second quality matrix after integration
All 18 observations completed without competing performance browser. Textured room 85.8–90 FPS across modes; model-heavy 64.1–90. Forest 47.9–61.5 FPS, highest Smooth 52.1 FPS/p95 24.5 ms; highest Crisp 47.9/p95 25.4. Forest target remains unmet. Heavy high-mode p95 20.1–21.9 ms also needs frame-pacing consideration despite average over 60. Raw sustained-matrix1523.json retained; stationary short fixture matrix is not sufficient final sustained/moving acceptance. Door slow-frame trace run now live after matrix completion.

## Cold door readiness phase
Slow-frame trace identified three stalls only before the first commit; later warm transfers had no >40 ms door-owned frame. Real door service now exposes readiness: selected shared textures decode, then closed-pose GPU drawing warms shaders/uploads under an opaque loading cover before timeline advances. Scene owns input/hidden-world rendering through door-preparing and door phases; exactly one commit still occurs after animation. Decode failure cleans up to idle without commit. Existing scene/melt/reservation tests and 4375-function coverage pass; a new cold/warm browser run must validate cover layering and actual animation intervals. Loading latency remains measured separately, not erased from reports.

## Conservative frustum-plane optimization
Prepared camera now evaluates AABB extrema against camera-space planes instead of allocating/projecting all eight terrain-bound corners. Near crossings and roundoff margins remain visible; no distance/detail reduction. 1500 comparisons prove no previously visible terrain bound is newly rejected, and 9000 exact projection comparisons still pass. Function coverage 4376 passes. Performance profile running. Door readiness loading and animation intervals must be separated in final evidence; transition cover moved above the cinematic canvas so setup stays covered.

## Destination decoding readiness gate
Cold room texture onload reads can occur after private door readiness, so transition now also waits for explicit shared destination pixel readiness before animation. Room cache exposes ready/failed separately; failed textures retain existing color fallback. Ten-second preparation timeout cleans ownership without commit. Dedicated tests verify no animation advancement during destination decode, one commit after readiness, and clean timeout. New actual-animation-only repeated-door run is live with corrected cover layering and precise resource evidence. Loading duration remains included in total transfer latency and must be reported separately.

## Native effects submission ordering
Audit found app appended native particles after FrontierRender already submitted Pixi stage; following frame begin removed them before rendering. Native effect draw now occurs inside the world draw immediately before its single GPU submission, with paused/editor/cinematic-aware effectDelta supplied by app. Effects therefore share breathing/scene filters while DOM HUD remains stable. Standalone draws default to zero effect advancement. 4387-function coverage passes; real resolution/emitter/breathing browser acceptance running. Performance must include actually visible effects in final tests.

## Non-blocking GPU readiness
Private cinematic backend now fences its first submitted GPU work and polls completion with zero timeout under the readiness cover, rather than assuming decoded textures imply completed GPU initialization. No finish/readback waits are added. Fence failures flow through transition cleanup, and retirement deletes fences before losing context. 4390-function coverage passes; repeated real transfer run now checks animation-only intervals. Prototype test also exercises real fence completion asynchronously. No stall-resolution claim until results complete.


## Completed readiness evidence and clean door replacement
The 24-transfer animation-only run completed: 6,167 intervals, median 11.1 ms, p95 11.3 ms, worst 22.2 ms, with no recorded animation interval over 40 ms. Commit and completion counts each equal 24; duplicate activation rejected and session breathing preserved. Two main-thread loading long tasks (85 and 78 ms) remain disclosed outside the animation sample. Resource counts remained three room textures and two cinematic textures. This is automated headless Chrome evidence, not native desktop acceptance or proof of stable retained JavaScript heap.

The supplied clean antique assembly replaces only the embedded image; parsed nodes, scenes, meshes and accessor records exactly match the previous assembly. Runtime and offline embedded mirrors contain the selected combined GLB only. Door preview/transfer, inventory, cleanup, named arrival and project/state roundtrip browser tests pass with the replacement. Function-comment coverage passes for 4,391 maintained functions. The real GPU shader test also passes asynchronous readiness-fence completion. Final full-mode sustained performance and packaging remain pending.


## Stationary matrix and terrain buffer ownership
Latest six-second stationary 18-mode matrix: all average frame rates exceed 60 FPS (forest 66.4-89.7, textured room 90.0-90.1, shared-door heavy fixture 82.4-90.0). These replace earlier stationary measurements, not the required longer moving-camera evidence; forest highest Smooth p95 remains 20 ms. A 15-second-per-mode camera sweep is running across all 18 cases.

Bundled Pixi Mesh.destroy does not destroy owned Geometry buffers, so growing the terrain batch now explicitly destroys its exclusive geometry and buffers while preserving the shared texture. Added real bundled-Pixi lifecycle acceptance for growth and shrink; result pending. Earlier mesh-only disposal description is superseded.


## Longer camera motion matrix and verified disposal
All 18 fifteen-second camera-sweep observations completed on Intel Arc/ANGLE headless Chrome, 22 logical hardware threads: forest 88.5-90.0 FPS (highest Smooth p95 14.0 ms), textured room 89.8-90.0 FPS, shared-door model-heavy fixture 76.0-90.0 FPS (highest Smooth p95 15.0 ms). One room intermediate-density Crisp worst interval reached 33.3 ms; other observed worst intervals stayed under 24 ms. The sweep varies yaw by 0.45 radians and pitch by 0.1; no character traversal or broad arbitrary model stress is implied. Raw moving-matrix1523.json retains every observation and physical resolution settings. Real bundled Pixi terrain growth/shrink acceptance confirms retired geometry/buffers disposed, shared texture survives, and shrinking updates active indices without replacement.

Equivalent 0.15.22 fifteen-second motion baseline is now running from an external harness without editing the preserved release. Final comparison, broader imported-model stress, full-mode door timing, GPU timing including private contexts, final regression gates, documentation/reference regeneration and packages remain outstanding.


## Imported-model stress exposes remaining work
Twelve shared generated 1500-triangle meshes plus the saloon door (18,136 submitted triangles) measured 24.5-31.2 FPS across modes, with p95 46.8-56.3 ms. The earlier door-heavy fixture did not cover this geometry cost. Rendering now opts into draw-local transformed-vertex reuse, memoized forward depth/projection and per-primitive material preparation; ordinary scene iterator callers retain independent point arrays by default. No geometry/content reduction or camera-facing sprite change. Exact triangle raster and model transform suites pass; stress rerun and broader visual/depth acceptance are pending. This prevents premature full performance acceptance.


## Full-mode door and regression checkpoints
All six density/filter presets completed four alternating door transfers each, with one commit/completion per activation, rejected duplicate requests and breathing preserved. Per-mode animation p95 11.5 ms; worst 11.8-12.3 ms; no recorded slow-animation frames. GPU query evidence now separates private room context (median about 1.2 ms) from main Pixi submission (room about 0.32 ms); these are not additive frame wall time. Existing 83 pure regression scripts passed before the subsequent imported-model optimization; required reruns remain.

Imported-model cache integration initially exposed a prepared-projector signature error and an overly broad source replacement that affected room clipping. Browser stress assertions failed explicitly; both were corrected, and current stress run must finish before acceptance. Exact opt-in transformed-point comparisons pass across changing transforms; default scene callbacks retain independent arrays. Function-comment coverage passes for 4,437 functions. Native Windows startup probe is prepared but has not run yet.


## Native attempt and static model cache checkpoint
Native Windows Electron startup attempt failed before application initialization (Process failed to launch). This establishes no native acceptance; temporary workspace diagnostic configuration was removed. Headless Chrome evidence remains distinct.

Static geometry caching improved the imported 18,136-triangle fixture to 43.5-74.4 FPS; high-density modes still missed the target. Latest changes also avoid no-op near-plane edge traversal and empty pixel bounds, reuse one surface-owned Float64 RGBA scratch, and traverse existing projected vertices without allocating edge pairs. Exact default/cached triangle raster comparison passes 600 cases. Cache retention is capped globally at 200,000 triangles and 128 entries, and 32 entries per asset; large single records bypass retention. Dedicated invalidation/eviction/source-immutability test added. Current stress rerun pending; no claim that high-density imported stress meets 60 FPS yet.


## Static model cache acceptance and sample-center rejection
Cache reuse/invalidation, per-asset/global eviction and source immutability tests pass. Latest stress after scratch/edge reuse: 45.0-75.9 FPS, highest Smooth 55.1 FPS/p95 26.1 ms; high-density target remains unmet. Exact sample-center bound rejection now skips triangles only when no raster grid center lies inside an axis interval, with conservative roundoff margin and no geometry-size cutoff. All 600 default/cached and 6,000 subpixel/grid-center comparisons against 0.15.22 produce identical pixel/depth arrays. Current 15-second-per-mode stress rerun measures this latest change. Additional final regressions and packages remain outstanding.


## Equivalent imported baseline and current limitations
Matched fifteen-second imported 18,136-triangle motion fixture baseline completed: highest Smooth 6.2 FPS/p95 227.3 ms in 0.15.22, versus current 55.0 FPS/p95 27.0 ms; highest Crisp 8.6 versus 56.0. Current lowest-density modes 82.3-82.7, intermediate 68.2-75.2. Geometry count remains 18,136 throughout. This substantial improvement does not meet the 60 FPS/p95 <20 ms goal at high density, and intermediate tail latency can exceed 20 ms. Remaining cost is CPU triangle/depth traversal/projection; broader gameplay GPU model/depth integration is future work, not silently claimed completed. Raw baseline-imported1522.json and imported-stress1523.json preserve equivalent evidence. Visible native effects plus breathing matrix is running, followed by final current-source regressions and packaging.


## Windows package verification checkpoint
The actual packaged Windows executable was attempted and failed before app initialization. Native-testing staging is retained separately; final Windows distribution is assembled fresh in the -Release directory, never copied from diagnostic staging. Windows is primary. Browser-on-Windows measurements do not prove packaged Windows performance. Fixed-camera fixture passes all six modes near 90 FPS; effects stress misses are disclosed and shorter profiles cannot override sustained results. Full archive hash/extracted checks and native desktop playtest remain pending.


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


## October 12, 2026 - door timing clock correction

The first boundary-only check incorrectly used sceneTransition.debug().elapsed. This lifecycle counter remains zero throughout the door phase, so that attempted timing run was invalid despite successful transfer-count assertions. It produced no moving samples and is not acceptance evidence. The correction captures the actual elapsed seconds passed to the production door update, preserves its calls/settings, and asserts more than 100 moving intervals. The original native 133.3ms interval cannot be classified as preparation from the lifecycle counter alone; its raw trace remains retained and its precise source remains unproven. Supersedes the earlier start-boundary interpretation, not the original measured interval.


## October 12, 2026 - final cinematic-clock validation

Supersedes the earlier readiness-boundary interpretation: scene lifecycle elapsed is not the door animation clock. The timing fixture now observes the exact seconds supplied to production door update, records readiness boundaries separately, and rejects empty moving-frame samples. The invalid intermediate measurement is retained as native-door-clock-correction1523.json. The original 133.3ms interval remains historical evidence with an unproven exact cause.

The corrected native all-six-mode run records 6094 moving intervals over 24 alternating cold/warm transfers. Median 11.1ms, p95 11.2ms, worst 44.5ms; 3 moving intervals over 40ms. All 24 commits/completions are exact and breathing remains enabled. Raw evidence: native-door-boundary-matrix1523.json. No production timing, filtering, geometry or resolution changed for this measurement correction.

Current function reference and comment coverage include 4535 maintained functions after six documented test-clock callbacks were added. Earlier 4529-count checkpoints are preserved history.
