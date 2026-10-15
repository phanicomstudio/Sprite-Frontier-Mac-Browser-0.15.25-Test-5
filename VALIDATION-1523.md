
# October 12, 2026 - final acceptance audit

The complete objective is unchanged: investigate, optimize, measure and deliver
0.15.23 based on 0.15.22, preserving appearance/content/history. This dated entry
adds current evidence without removing earlier documentation.

| Requirement | Authoritative evidence | Outcome |
|---|---|---|
| Causes, CPU/GPU separation | PERFORMANCE-AUDIT-1523.md; sampler/raster equivalence; subsystem/gpu-profile JSON plus native GPU profile | CPU raster/sampling, repeated geometry work and transfer ownership/loading identified; private room color and door rendering moved to GPU |
| Every density/filter mode in forest, textured room and models | moving-matrix1523.json and native-moving-matrix1523.json, 18 cases each at 15 seconds | Same selected physical resolution and fixture content; measured misses retained |
| Larger models and effects/breathing | imported-stress1523.json, effects-matrix1523.json and native counterparts | Six imported-model and twelve effect cases; CPU geometry/terrain limits reported |
| Cold/warm and repeated transfers in both directions | door-cycles1523.json, door-matrix1523.json, native-door-matrix1523.json | 24 transfers per run, exactly one commit/completion per activation; duplicate attempts rejected |
| Normal authored door timing | native-authored-door-cycles1523.json | Four alternating saloon-pair transfers with saved 1.3s approach/1s passage; worst animation interval 11.9ms |
| Loading ownership, readiness, failure restoration | transition-performance1523.cjs, GPU readiness test and lifecycle observations | Shared decode/upload preparation before playback, one reservation, bounded failure/timeout restoration |
| Input, cursor, cues and no skipping | app cutscene guards, unchanged door cue timeline, door/state regression | Cinematic owns gameplay input; no added skip interface; authored sounds preserved |
| Hub persistence, arrival and return | hub suites, browser door1522 and native transfer observations | Named arrivals, state roundtrip, cleanup/container/drop invariants pass |
| Locked 0.15.17 tilt/proportions/frames; collision/camera/menu/HUD | sprite-projection1518, sprite-scene1518, occlusion1522 and guards1522 | Locked presentation and guards preserved |
| Breathing through cell replacement | pure/browser breathing tests and every native door result | Session enabled state and strength preserved |
| Comments, documentation and earlier iterations | function-comments1516; 4529-function reference; dated report/architecture/guides; prior manifests | Coverage passes; historical source comments/explanations and releases retained; coverage does not automatically prove usefulness |
| Relevant regressions | pure-regressions1523.json: 84; final-browser-regressions1523.json: corrected 7 | Passed; mistaken test-path attempt retained with successful correction |
| Primary native Windows validation | native-runtime1523.json and six native measurement files | Actual desktop Electron window measured; separate from headless Chrome |
| Complete Windows/Mac browser packages | final distribution manifests, archive verifier and extracted-browser acceptance | Full packages, test debug configuration/profile excluded; no patches/hotfixes |

## Measured limits remain explicit

Target: sustained 60 FPS and p95 below 20ms on the recorded desktop, not universal
hardware. Native highest Smooth room is 75.7 FPS / 18.3ms p95. Forest/shared-model
and dense effects/imported geometry miss targets in some modes. Exact figures,
CPU bottlenecks and further optimization work are in PERFORMANCE-REPORT-1523.md.

The native stress trace retains one 133.3ms start-boundary interval at elapsed
zero with a 144ms main-thread task; its exact source is unproven. Normal authored
transfers have no measured slow frame. This is not a zero-stutter guarantee.
Mac native execution is unavailable; its deliverable is a browser package. Heap
and texture-byte estimates are distinct from total RAM/VRAM and cannot prove
all possible long-term leak behavior. Desktop background applications were open.

## Packaging verification

The final refresh regenerates archives after native evidence/docs are copied.
It rejects diagnostic configurations/profiles/logs in release folders. The
verifier checks every archive file's SHA-256 and size, extracts the browser
package, and confirms previous 0.15.22 manifests remain unchanged. Browser
acceptance is then run against those extracted contents, independently of the
source tree. Final command outcomes are retained alongside raw audit evidence.


## October 12, 2026 - final cinematic-clock validation

Supersedes the earlier readiness-boundary interpretation: scene lifecycle elapsed is not the door animation clock. The timing fixture now observes the exact seconds supplied to production door update, records readiness boundaries separately, and rejects empty moving-frame samples. The invalid intermediate measurement is retained as native-door-clock-correction1523.json. The original 133.3ms interval remains historical evidence with an unproven exact cause.

The corrected native all-six-mode run records 6094 moving intervals over 24 alternating cold/warm transfers. Median 11.1ms, p95 11.2ms, worst 44.5ms; 3 moving intervals over 40ms. All 24 commits/completions are exact and breathing remains enabled. Raw evidence: native-door-boundary-matrix1523.json. No production timing, filtering, geometry or resolution changed for this measurement correction.

Current function reference and comment coverage include 4535 maintained functions after six documented test-clock callbacks were added. Earlier 4529-count checkpoints are preserved history.
