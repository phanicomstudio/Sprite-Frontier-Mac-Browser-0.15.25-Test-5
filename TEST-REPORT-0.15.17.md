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
