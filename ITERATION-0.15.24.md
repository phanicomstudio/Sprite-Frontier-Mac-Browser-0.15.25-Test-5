# October 14, 2026 — final delivery record

See RELEASE-VALIDATION-0.15.24.md for current acceptance, measurements and limitations, including the user-directed end of exhaustive manual comment review. Earlier pending/candidate statements below are chronological history. Final distributions include this report; executable application behavior is unchanged from the tested second candidate.

# October 14, 2026 — packaging checkpoint

The implementation-in-progress entry below is retained history. Current native workflow/performance evidence is recorded in VALIDATION-1524.md and PERFORMANCE-EVIDENCE/0.15.24. Full Windows and Mac browser distributions are now being prepared, with final packaged Windows acceptance still pending. The user explicitly requested moving on from the exhaustive manual comment audit: all 5,672 maintained functions pass comment-presence checks, the reviewed contracts are preserved, and exact syntax checks confirm comment/format edits preserve behavior. The remaining manual review queue is not represented as completed. Standing preservation/readability requirements continue for new work.

# Sprite Frontier 0.15.24 — implementation in progress

October 12, 2026. This folder is the next complete iteration's working source.
It is not a released package. Previous releases remain unchanged.

## Implemented and checked so far

- Editor workspace with a building palette, central scene and existing property
  categories. Existing nodes/listeners are moved, not cloned. Playtest hides the
  authoring chrome and retains a return-to-editor action.
- Runtime-only editor mode guard. Complete exported-game construction and
  independent runtime acceptance are still required.
- Separately named blank geometry interior template, preserving existing cells.
- Room shell, wall/floor/ceiling/block/doorway/straight-stair generation; explicit
  preview, confirm and cancel; opposing-face connector snapping for single pieces.
- Direct room-face selection, XYZ translation handles, duplicate preview and
  quarter-turn footprint rotation. Numeric properties remain in Interior authoring.
- Native room primitive support, stair-step proposals, falling landing and upward
  ceiling sweeps. Independent blockers remain separate and visible in authoring.
- Material repeat size, fit-per-face mode, optional source aspect preservation,
  UV offsets and rotation. CPU/GPU room rendering use the same mapped UVs.
- Supplied castle texture copied unchanged into the shared material directory.

## Evidence and limits

`tests/building1524.cjs` passes physical shell, step-by-step stair ascent,
landing, ceiling headroom, connector alignment and JSON persistence cases.
`tests/browser/workspace1524.cjs` passes the real initialized editor flow:
new named blank interior, shell preview/commit, undo/redo, clean playtest and
runtime F2 guard. `tests/interiors15.cjs` remains green. Function comment coverage
passed at 4,592 functions before the latest workspace category observer addition;
rerun coverage after subsequent changes.

These results do not prove complete goal acceptance. Visual inspection found
that authoring cameras outside a closed untextured shell can show an opaque
white wall/ceiling and conceal the player. Gameplay camera collision is bypassed
intentionally in authoring. Add usable interior framing/cutaway controls and
verify both authoring and actual playtest views. Do not call this solved based
on structural assertions alone.

## Required remaining work

- Complete grid room painting/erasing/openings and predictable assembled-module
  snapping with ghost feedback, rotations and suitable texture thumbnails.
- Integrate supplied model templates/props; floor and wall placement, attached
  paintings/decorative windows, arbitrary model transforms and reusable overrides.
- Reproduce and repair reported sprite/body/camera clipping with closed doors,
  thin geometry, walls/corners and jumping. Preserve locked 0.15.17 presentation.
- Independent local lighting, ambient/player/attached/projectile sources,
  budgets/lifetime cleanup, controls, persistence and explicit blocking limits.
- Complete runtime export workflow and independently test an exported game.
- Whole authoring workflow, project round-trip, doors/hub state, menus, breathing,
  effects, resolution/filter compatibility and meaningful regressions.
- Native Windows desktop performance matrix with furnished/illuminated rooms and
  projectile stress. Browser checks above are not native Windows measurements.
- Accurate useful comment review, updated function references/architecture/guides,
  release validation, and full new Windows/Mac browser packages.

Spiral staircases remain future work as requested. No goal completion claim or
final release archive exists for this iteration yet.

## October 12, 2026 - subsequent implementation checkpoint

Supersedes the earlier pending-prop/lighting statements only for the portions
listed here; full iteration acceptance is still incomplete.

- Supplied catalog contains the 13 furniture/painting GLBs, seven blank building
  modules and straight stair template. Original bytes and SHA-256 are inventoried.
  Catalog loading is explicit/lazy, and only a chosen GLB is imported/decoded.
- Floor/wall placement previews use actual transformed asset bounds, including
  non-bottom pivots. Placed models are ordinary event records with independent
  geometry collision and interaction zones. Painting attachments store normalized
  parent coordinates and follow room-wall translation, resize and yaw at edits.
- Room primitive yaw now rotates actual faces and physical volumes together.
  Connector anchors follow yaw. Authoring outlines use the same orientation.
- Editor-only cutaway and Enter room view address the earlier closed-shell
  inspection problem. Playtest/export do not discard collision or room faces.
- Explicit user instruction: unconfigured 3D models use geometry collision by
  default. Draft Visual → 3D model chooses mesh automatically; deliberate none or
  custom overrides remain available and are retained.
- Local-light settings/UI and rendering now exist: ambient, placed/attached,
  player and projectile choices, source color/radius/brightness/falloff/flicker,
  optional stepped brightness and active-budget diagnostics. Native projectile
  position records feed emission; removed/cross-cell shots leave no light state.
- GPU rooms interpolate actual world coordinates and apply radius light with
  room-volume blocking. CPU models sample/cache geometry-vertex illumination;
  sprites receive local illumination independently of HUD and normal/color maps.
  No source texture regeneration occurs per moving-light frame.

Tests: prop-placement1524.cjs, lighting1524.cjs, model-events1511.cjs pass. Real
browser props1524.cjs places supplied bed and Bosch painting, validates portable
project round-trip and checks actual default collision through the model draft
UI. Its GPU pixel readback confirms ambient darkening and increased room output
from a placed source; this is visual evidence, not a performance measurement.
Function-comment coverage passes at 4,698 functions.

Remaining: full grid/painting/erasing layout workflow, richer material thumbnails,
imported arbitrary-primitive material overrides, complete editor transform and
round-trip acceptance, reported clipping reproduction/repairs, exported-game
construction, outdoor terrain lighting integration, full compatibility and native
Windows performance testing, comment/reference review and final packages.
Current light shadow coverage is up to 32 room primitive blockers with up to eight
active lights. Imported triangle/terrain shadow casting is explicitly unsupported;
CPU model lighting is vertex sampled. Validate visual and performance limitations
before declaring the requested lighting scope complete. No native Windows
performance claim is made by this checkpoint.

## October 12, 2026 - round geometry checkpoint
User added circular tower rooms and round geometry. New round-geometry.js generates closed polygonal disks, hollow rings and capped wall arcs with bounded 8-128 segment counts. A direct Node check verifies disk/ring face counts, clear hollow center and invalid-count rejection. Editor, rendering, physical collision and lighting integration remain pending; this generator alone is not delivered round-room support. Spiral staircases remain future work.


Round surfaces now feed the cached room renderer and exact convex-sector footprint collision. round1524.cjs passes hollow-center/wall contact, disk support, falling/rising floor/ceiling clamps, open half-arcs, schema persistence and circular shell construction. Rectangular building and interior regression suites pass. Palette controls, continuous curved texture mapping, camera collision and round-light blocking still require integration/verification before round rooms are exposed as complete authoring support.


Round camera sweeps and circumference texture-repeat/fit checks now pass in round1524.cjs; source comment coverage is 4,751. Full editor expansion is saved in workspace EDITOR-REQUIREMENTS-1524.txt and tracked by EDITOR-CONTROL-AUDIT-1524.md. Four sky edit candidates and unchanged originals are banked separately; numerical edge checks do not prove seamless wrapping, and sky 4 requires further repair. No runtime skybox support or release completion is claimed.


The actual building palette now creates circular shells, curved walls and circular slabs with bounded radius/segment/arc controls and real curved ghost outlines. Browser workspace1524.cjs verifies round shell preview, three-piece commit and undo alongside rectangular/history/playtest checks. Author inspection now honors explicit spawn elevation. Curved connector snapping and round light shadows remain unfinished. This browser workflow evidence does not substitute for native Windows acceptance.


Round shadow blocking now retains hollow centers and handles arcs/disks using one bounded blocker record per round primitive. CPU and GPU share circular segment/volume tests. round-light1524.cjs passes interior/exterior, open/closed arc, disk ceiling and budget cases. Real browser props1524.cjs compiles the live shader and verifies inside/outside round illumination with an isolated eight-pixel GPU probe. Circular shadows approximate faceted mesh edges; physical/rendered geometry remains faceted. Native Windows performance remains unverified.


Searchable grouped scene inventory now routes room/prop/event/light selections to existing properties. Browser workspace1524.cjs verifies selecting a tower by search, changing radius/inner radius/arc in degrees, and undo. A dimensional cache signature prevents stale round surfaces during in-place author transactions. Nine textured castle prefab GLBs are authored and banked: 4/6/8m square rooms, 6/8m hollow tower sections, 4m castle walkway wall, matching gable/conical roofs. Production decode/triangle tests verify doorway/jamb/tower/walkway cases. Separate explicit lazy catalog and per-choice geometry defaults are integrated. Automatic prefab snapping, full stack/roof visual acceptance and native performance remain pending; roof variants are solid caps without attics/hatches.


Prefab connector snapping now operates in the actual placement path with configurable metre gap and Shift bypass. Compatible profiles, opposed world normals, stable tie-breaking and transforms are verified by prefab-placement1524.cjs. Real browser props1524.cjs verifies nine catalog choices, on-demand selected roof decode, unselected tower remaining undecoded and geometry-default reset. Model/terrain surface picking is integrated; moving imported-parent attachments remain pending. The first asynchronous catalog assertion ran before loading finished; corrected test waits for the real populated option and passes. Full native stack/door/roof workflow remains an acceptance gate.


## October 12 - interim native Windows evidence and performance regression
Launched work/native-editor1524/Sprite Frontier.exe through desktop computer use with an isolated diagnostic profile and loopback port 9544; ordinary releases remain untouched. Native editor1524.cjs workspace1524 and props1524 pass against that existing Electron window. Native screenshot confirms editor/workspace display. Local diagnostic connection initially blocked by sandbox EACCES; granted turn network permission and reran successfully.
Native performance1524.cjs records eighteen six-second furnished-room observations across scales 1/1.5/2 and Crisp/Smooth, with unlit, one-light and eight transient projectile-light-emission cases. Highest Smooth measured approximately 17.6-18.0 FPS (CPU p95 55.2-57.2ms), while unlit highest Crisp measured 70 FPS; highest Crisp with light cases was approximately 39 FPS. This is an actual regression requiring repair, not release acceptance. Raw results: test-artifacts/native-interim-matrix1524.json. The fixture measures live render intervals/CPU submission without readback; it does not measure GPU elapsed time or full projectile gameplay.
Next performance investigation: CPU imported-model color/filter sampling remains active for furnished geometry while room color already uses GPU. Preserve shared depth, locked billboard presentation, fog, alpha, coverage and material sampler behavior when repairing the bottleneck. No native performance success or final packaging claim is made.


### October 12, 2026: resumed native GPU model performance check
Actual desktop-launched Windows diagnostic snapshot passed supplied prop placement and project round-trip acceptance. The 18-observation furnished-room matrix completed after the opaque-model GPU color repair. Highest-resolution Smooth measured 90.0 FPS unlit, 89.7 FPS with one light, and 70.6 FPS with eight transient projectile-position light sources, compared with approximately 18 FPS before repair. CPU submission p95 was 9.7, 9.2 and 9.4 ms respectively. These are six-second interim observations, not GPU elapsed timings or complete projectile gameplay, transition, exported-game or release acceptance. Raw before and after JSON is preserved in test-artifacts. Remaining implementation and release gates still apply.


## October 13, 2026 - contact-depth verification checkpoint

Contact row depths now use a reused double-precision row buffer. Each screen row is evaluated once rather than once per overlapping pixel column. 450 visibility-mask comparisons against the preserved 0.15.23 implementation match exactly; the buffer is reused after sizing. This does not change sprite tilt, proportions, frames or image rectangles.

The isolated browser diagnostic now records front, opposite-side and wall-end contact at three pitches. Camera collision retracts sharply in the latter cases, so those images are observations, not an occlusion acceptance certificate. Imported doors, broader contact cases and current Windows performance remain required before accepting this correction.


October 13 native checkpoint: supplied prop placement/painting attachment/collision/project round-trip passed in the desktop-launched muted diagnostic. All 18 furnished-room quality/light observations completed. Highest Smooth: 88.8 fps unlit, 85.3 fps one light, 69.5 fps eight transient projectile-position lights; CPU p95 12.8/12.9/11.8 ms respectively. Raw dated data: test-artifacts/native-matrix-contact-oct13-1524.json; previous data retained as native-matrix-pre-contact-oct12-1524.json. This validates sustained rendering in this fixture, not complete projectile gameplay, contact-specific frame cost, animated door transitions or final package performance.


## October 13, 2026 - user-facing Windows game export

Map library now provides Export playable game folder in the native editor. It validates a project snapshot, generates a runtime entry, then opens the native parent-folder chooser. Main-process source/script/style ownership checks precede the chooser. Destination paths come only from that chooser; a fresh dated child folder uses exclusive writes. Existing exports/releases remain unchanged. Missing source resources are rejected before folder creation; only genuinely created partial folders are reported as incomplete. Browser authoring retains project backup export and explains that native folder export is Windows-only at this checkpoint.

The actual button/chooser created an isolated export (native-export-ui1524.json). The exact output passed independent browser startup and a desktop-launched muted Windows wrapper: gameplay-only DOM, F2 guard, resolution/filter/hand options, inventory and requested resource closure. Raw native evidence is native-desktop-export-ui-game1524.json. The restarted diagnostic selected the contact-test map, so this is not yet the furnished-cell export acceptance case. The first chooser run correctly caught a stale diagnostic's missing runtime-maps.js; the diagnostic source was refreshed consistently and the repeated export passed.

Core image/audio/font banks remain conservatively included. Arbitrary external authored asset closure, pruning, complete authoring source/markup removal and final Windows/Mac release packaging remain unfinished. This export action is working acceptance progress, not a final release certificate.


October 13 outdoor lighting checkpoint: the real Windows hills fixture completed all 18 resolution/filter/light observations without renderer exceptions. Highest Smooth measured 46.6 fps unlit, 42.3 fps with the player light, and 40.5 fps with eight transient moving light sources. CPU p95 was 23.9/26.0/29.6 ms. This dense hills baseline is materially slower than the furnished room and remains an outdoor performance investigation; no claim of universal 60 fps is made. Raw data: test-artifacts/native-outdoor-lighting1524.json. Terrain uses its actual batched lighting shader in lit modes; emission records are not complete projectile gameplay.


## October 13 subsequent checkpoint (supersedes missing evidence above)

Actual Windows acceptance now covers grouped stairs and round roles, material thumbnail/import controls, supplied furniture and paintings, direct model handles, model-host attachment, per-cell original-image skies and wrap continuity, generated authoring-free sky games, thin-door sprite/camera clearance, pause/fullscreen menus, breathing across repeated normal/stress doors, and square/tower prefab stacking with a matching roof. See EDITOR-CONTROL-AUDIT-1524.md for precise evidence and unsupported boundaries.

Opaque texture cutouts retain GPU color while CPU depth samples alpha only where necessary. Highest/Smooth furnished throughput observed 70.1/70.1/60.3 fps for unlit/one-light/eight transient emissions. Populated forest effects stress observed about 51 fps at highest/Smooth, so universal 60 fps is not claimed. Cache bounds, frame-time tails, final exported-game verification, semantic documentation review and complete packages remain delivery gates. This checkpoint is not a release certificate.


October 13, 2026 — Large cell libraries: removed the secondary 32-cell saved-hub-state limit as well as the authored-map cap. Preserved per-cell stack limits and recovery budgets. Cleanup now resolves policy only for its bounded records instead of cloning the whole project/model bank once per second; visited-cell IDs are cached per store and extended by the cell service. Pure tests preserve 256 visited-cell storage records across JSON Save/Load and verify eight policy lookups for an eight-record cleanup budget. A 128-cell exported browser game passes actual menus, Save/Load and two-way interpreter travel; Windows generated-game travel passed before the secondary persistence/cleanup repair and is being repeated with that repair. This is not a claim of arbitrary-size project memory or serialization performance.


October 13, 2026 — Windows large-library acceptance after persistence/cleanup repair: freshly generated 128-cell package (`work/runtime-large-1524-c`) opened in the isolated Windows desktop wrapper and passed actual gameplay-only DOM, highest Smooth options and two-way interpreter travel with independent skies/shared state. `native-cell-scale1524.json` compares identical active world: two maps 89.5 FPS, 128 maps 90.0 FPS, both p95 11.4 ms over 179 sampled animation intervals after warmup. Each case retained one decoded sky/one panorama mesh and zero full-project snapshot calls during ordinary play. This measures desktop animation intervals, not GPU time; it does not establish arbitrary large-library startup/save memory limits or performance for larger active scenes. `hub-state1517.cjs` separately validates 256 visited-cell storage records and eight-policy-lookups cleanup budget. Prior 32-map/32-cell restrictions are superseded, not retained current policy.


October 13, 2026 — Actual projectile gameplay lighting: `tests/native/projectile-lights1524.cjs` imports a simple 30-metre room, equips the shipped shotgun without changing combat parameters, and fires via actual F-key input. Across scales 1/1.5/2 and Crisp/Smooth, peak live shots = 16, active lights = 8, omitted lights = 8. Every case reaches zero shots/zero lights through normal simulation, without manual despawn. Highest Smooth records 90.2 FPS, 11.3 ms CPU p95 and 12.5 ms frame p95. These are actual desktop frame/submission measurements in the simple-room fixture, not GPU elapsed time or furnished-room performance. Furnished/native-effects matrices remain complementary evidence with their documented lower throughput. Export-copy/comment/binary closure guards and the original non-raised door/camera regression also pass after the latest changes.


October 13, 2026 — Named arrival elevation: typed rows now preserve optional Z (-100–100 metres), with blank meaning automatic floor selection. Add at player uses actual XYZ and facing. Existing explicit Z is no longer lost when reopening/applying the cell dialog; invalid explicit elevations reject before adoption. Browser/native cell controls verify saved Z3, fog and normal lighting, Undo and invalid drafts; automatic blank-Z acceptance is being extended separately. Inherited specialized test run descriptions are marked historical with accurate current contracts, rather than discarded. AUTHORING-GUIDE-0.15.24.md consolidates current instructions and explicit limits; BUILDING-AUTHORING-1524.md retains prior amendments as marked history.
