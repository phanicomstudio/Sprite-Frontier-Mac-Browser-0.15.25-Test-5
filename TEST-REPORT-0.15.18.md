# Verification — 0.15.18

October 9, 2026. Current checks supersede previous-release claims without removing those reports.

75 source regression commands passed, including upright sprite projection and function-comment coverage. 17 existing model/event browser commands passed; hub-door1517, guards1518 and sprite-scene1518 acceptance passed separately. The historical model-library download-finalization test is not used as evidence: file-protocol headless downloads can be canceled. New Save/Load acceptance retains the actual export Blob and reloads its exact JSON through the real file picker.

Camera checks: 40 geometry-room orbit/pitch positions and 60 actual-building orbit/pitch positions. Closed antique door body sweep blocks while real pointer interaction still transfers. HUD pause repeated three times, focused-button Escape, Options volume/cursor synchronization, recovery, Save and Load passed without page errors. Steep-pitch screenshots were visually inspected.

Function-comment coverage: 3,877 maintained functions at final indexing. Coverage proves explanatory labels exist; it is not a substitute for reviewing rationale and contracts.

The initial separate-strip prototype increased forest CPU submission time, so it was replaced before release with a pooled single mesh. Final local headless Chrome forest sample: 49 frames, median 29.6 ms and p95 31.8 ms for CPU draw submission; previous iteration baseline 53 frames, median 27.5 ms and p95 29.7 ms, using identical camera yaw, pitch and distance. These are short diagnostic samples, not GPU completion timings or a promised desktop frame rate. Model benchmark measurements are retained in the developer test artifacts.

Windows desktop and macOS hardware execution cannot be confirmed in this environment. Browser acceptance uses local Chrome on Windows. Archive hashes and fresh extracted-browser checks are recorded in the adjacent release record after packaging.
