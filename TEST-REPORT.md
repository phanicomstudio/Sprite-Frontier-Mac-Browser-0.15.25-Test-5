# 0.15.17 validation — October 9, 2026

- 74 source regression commands passed, including previous event/collision/save
  coverage and new hub persistence, model visibility and door timeline tests.
- Function-comment coverage passed: 3,824 maintained functions/callbacks. The
  current dated function index uses exact source contracts; vendor code remains
  separate. Meaningfulness is reviewed separately from label coverage.
- 17 existing browser model/event commands passed (all except the historical
  model-library download-finalization test). The new hub acceptance also passes:
  actual pointer-click doorway travel, textured antique model preview, paired
  sliding author controls, Apply/Cancel, purchase/sale, static drop/pickup,
  protected-cell cleanup, pawn recovery, Escape skip and actual exported
  playtest Blob reload preserving item properties and authored project doors.
- Eight-instance shared BVH / textured 1,500-triangle fixture: collision median
  1.8 ms, p95 2.9 ms; raster median 2.0 ms, p95 2.8 ms at 640x480 logical viewport.
  These are local synthetic measurements, not a promise for all hardware/models.
- Five converted OGG door sounds were decoded completely. Browser model pixels
  and sound selection roles are tested; no subjective listening test is claimed.
- Native Electron automation could not launch its process in this environment.
  Browser acceptance uses actual Chrome on Windows. macOS hardware was not
  available; the Mac delivery is a browser package, not a native app.

Archive manifests are checked after full package assembly. The release-adjacent
RELEASE-0.15.17.md records final archive verification. Keep prior releases intact.

## Historical reports below (superseded where different)

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
