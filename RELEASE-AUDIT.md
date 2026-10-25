# Release verification — 0.15.16

Complete new Windows and Mac browser packages include runtime assets, source, function reference, authoring guides and tests. Earlier releases are preserved.

- 71 source regression commands passed.
- 17 model/event browser commands passed after all code/comment changes.
- Actual building: stairs at four scale combinations, roofs, ledges, angled jump landings.
- Camera: 60 real-building orbit poses, with 9 obstructed positions retracted; none crossed the tested solid walls.
- Escape pause, Get Unstuck, velocity reset and Resume passed through the real UI.
- Every maintained function has a source explanation: 3,624 in source/Windows including tests, 3,605 in browser package including tests (native-only files excluded).
- Documentation insertion preserved parsed syntax trees.
- Shared 1,500-triangle benchmark: eight continuous body queries median 2.2ms, p95 3.3ms in this environment; model rasterization median 2.5ms. These are scoped microbenchmarks, not a whole-game FPS guarantee.
- Full ZIP manifests independently hash-checked; extracted-package camera/recovery/landing/comment coverage tests passed. Exact Export-button Blob bytes imported into a clean project through its file picker.

## Platform limits

User confirmed native Windows 0.15.15 launch and successful stair walking. New 0.15.16 source is browser-tested; native Windows 0.15.16 and actual macOS execution need user platform checks. No macOS host is available here. Automated disk download finalization is canceled by this environment even for a minimal unrelated Blob; generated project content and import/reload are verified without claiming that download-path test passed.

## Remaining scope

No automatic interior creation, animated/deforming mesh collision, moving-platform physics or cell-streaming implementation is claimed. Interior dressing is authored separately. Get Unstuck is temporary insurance while real-model contact cases continue to be tested. See ITERATION-0.15.16.md and MODEL-AUTHORING.md.


## October 9, 2026 — 0.15.17

Current hub/door/item/model visibility changes are documented in HUB-DOOR-GUIDE.md
and ITERATION-0.15.17.md. 74 source checks and 18 browser acceptance commands pass;
3,824 function comments are indexed. Native Electron automation could not launch;
Mac is a complete browser edition. See TEST-REPORT-0.15.17.md for scope/limits.
