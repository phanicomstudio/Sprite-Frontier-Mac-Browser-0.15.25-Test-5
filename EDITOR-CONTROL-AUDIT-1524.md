# Editor control acceptance audit

October 12, 2026. This is a work checklist, not a completion certificate.
The accepted full specification is `EDITOR-REQUIREMENTS-1524.txt` in the workspace.
Each row needs source inspection, an authoring workflow test, persistence evidence
and actual Windows verification before it can be marked complete.

| Feature | Current owning controls/source | Outstanding acceptance |
| --- | --- | --- |
| Workspace and clean playtest | engine-workspace.js | Scene hierarchy/search; window-size QA; runtime construction |
| Blank interiors and map management | map-library.js, room-editor.js | Full create/duplicate/delete/spawn/arrival workflow |
| Painted room layouts | layout-editor.js, room-layout.js | Real editor paint/erase/door/stack round-trip tests |
| Modular construction | building-editor.js, building-kit.js | Group connectors; premade castle kit; round palette |
| Round rooms | round-geometry.js, interiors.js, room-physics.js | Editor controls, native visual acceptance and light blocking |
| Surface transforms | building-editor.js, room-editor.js | Local axes, rotation/resize handles and snap overrides |
| Imported props and paintings | prop-editor.js, prop-placement.js | Imported-surface placement, direct gizmos, decorative windows |
| Materials | room-surfaces.js, room-editor.js | Thumbnail/import library and model material-slot controls |
| Geometry collision | model-events.js, room-physics.js | Reported sprite/door cases and native stress/recovery checks |
| Events and doors | Existing event/model/door authoring | End-to-end drag placement, destination and transition controls |
| Sky and distant scenery | sky.js | Image panorama renderer and per-map skybox picker; seam repair |
| Local lighting | lighting-editor.js, local-lighting.js | Outdoor terrain, round blocking, native performance |
| Native effects | Existing native-effects/parameter dialogs | Audit routine controls against supported runtime fields |
| Gameplay records | Existing database/event/hub controls | Audit items, shops, ownership, weapons and HUD controls |
| Diagnostics | Cell diagnostics and light panel | Verify memory/count/cleanup accuracy under actual usage |
| Save, reload and templates | Existing map/project/template paths | Complete combined authoring round-trip |
| Exported games | Runtime guard and workspace presentation | Construct and independently test authoring-free game packages |

Keep earlier history and function explanations. Every subsequently added control
must define its units, saved ownership, supported range, reset behavior and
failure feedback. Unsupported settings must be explicit rather than silent.

October 12 export-boundary inspection: app.js initializes editor workbenches and map-library.js constructs authoring controls during shared startup. FRONTIER_RUNTIME_ONLY currently guards entry and presentation; this does not prove an independently constructed export excludes authoring code. Required next implementation: separate runtime startup/project loading and exported asset closure, then independently test the generated game including F2 and gameplay save/load.


## October 13, 2026 - current acceptance evidence

The October 12 table and export-boundary paragraph above remain historical.
This update supersedes their statements that these tested portions have no
acceptance evidence; it does not mark the whole editor complete.

| Portion checked | Evidence | Still required |
| --- | --- | --- |
| Painted blank interior, erase/hole, doorway, undo/redo, save/import/reload | Browser and actual Windows layout1524 workflow; raised-floor arrivals repaired | Stacked/round combined authoring workflow |
| Straight stairs and upper/lower landing joins | Production support checks plus Windows W/E/S walking, jump, landing and descent | Whole-flight group transforms/snapping |
| Directly rotated step landing anchors | building1524 contracts at three quarter turns and arbitrary yaw; browser layout regression passes | Native interactive rotated-flight acceptance |
| Supplied bed and painting | Actual Windows props1524 placement, wall attachment, collision and project round-trip | Imported-model parent attachment, window decoration and full transform gizmos |
| Runtime startup and gameplay | Constructed standalone browser fixture; Windows runtime save/load, inventory and two-way cell transfer | User-facing complete export, external asset closure, source markup extraction, animated doors and full runtime performance |
| Contact visibility | Windows thin-wall screenshots, pure ray depth contracts and nine browser rectangle-invariance comparisons | Door meshes, corners, raised support and contact-specific performance; opposite-side camera retraction is observational |
| Furnished rendering | October 13 Windows 18-case resolution/filter/light matrix | Outdoor lighting, full projectile gameplay, transitions, effects compatibility and final release runs |

Latest function-comment presence check: 4,934 maintained functions. This count
is not semantic documentation acceptance; older generic explanations still
need review and the function reference must be regenerated for delivery.

## October 13 - subsequent verified changes

| Portion checked | Evidence | Remaining boundary |
| --- | --- | --- |
| Stair assemblies: world/local move, whole-flight turn, resize, duplicate and undo | Extended layout1524 passes browser and actual Windows; pure assembly tests include resized climb and bounded repeated yaw | Combined prefab stacking and furnished map workflows |
| Standalone round floor/ceiling/wall roles | Extended browser/Windows layout checks verify hollow centre, perimeter blocking and overhead clearance | Wider visual QA and prefab tower/roof joins |
| Imported upright model attachments | Pure translation/yaw/scaled-pivot/JSON-reload tests; existing supplied-prop browser workflow passes | Actual model-host click placement; tilted/nested hosts explicitly unsupported |
| Terrain local lighting | Bundled GPU pixel tests verify radius, box/round blocking, disabled-light equivalence and resource reuse | Full weather/effects/projectile compatibility and final release performance |
| Outdoor movement performance | Actual Windows 18 quality/filter/light cases; highest Smooth observed 58.2/55.9/55.5 fps for unlit/player/eight lights | High frame-time tails (p95 25.9–29.5 ms) still require final audit; not a guarantee for arbitrary maps |
| Generated runtime startup after assembly module exclusion | runtime-start1524 passes authoring-module omission, pause/options, save/load, inventory, two-way stateful travel and F2 guard | Final export asset closure, animated transitions and delivery packages |

Function-comment presence now passes for 5,077 functions before subsequent edits. Semantic explanation review and regenerated function reference remain required. Windows diagnostic tests now release pointer capture before disconnecting; test executables remain isolated and muted. No release-completion claim is implied by this checkpoint.

October 13: expanded material and prop acceptance passed in the actual Windows application. Layout workflow includes thumbnail assignment, bounded image import, embedded texture preservation through JSON/production validation, unchanged geometry dimensions and Undo. Props workflow includes genuine pointer placement on imported vertical mesh geometry, model-parent metadata, separate room-wall attachment, project round-trip and room-specific GPU lighting readback. Function-comment presence check passes at 5,090 maintained functions. Imported-model hosts remain explicitly upright and independent; direct prop gizmos, window-sticker authoring and model material-slot controls remain unfinished.

October 13: per-map sky authoring and native sky rendering are implemented and verified. Four original PNG assets are lazily embedded for origin-clean offline uploads. Optional renderer wrap blending passed actual GPU seam continuity; earlier edited candidates remain unaccepted. Typed cloud/ridge fields replace routine JSON editing. Transition readiness includes sky decoding; runtime builder includes lazy sky resources. Actual Windows moving terrain/sky matrix passed all eighteen cases, with highest Smooth 78.3/75.5/76.4 fps across unlit/player/eight-transient-light cases (CPU p95 16.0/17.2/17.0 ms). Not a controlled comparison to earlier fixtures, not measured GPU time/full projectile gameplay. Direct model scene selection and handles also passed actual Windows. Exported-game sky asset closure still needs its own generated-package run before delivery.


### October 13, 2026 — camera endpoint clearance and opaque texture cutouts

Camera boom retraction alone could stop at an eye anchor that already overlapped a thin door: the camera clearance volume is wider than the actor body. The final camera endpoint now uses actual geometry separation, with up to eight corrections and a validated prior-safe position fallback. Diagnostics disclose unresolved confined-space cases. This changes camera clearance, not the locked 0.15.17 sprite tilt, proportions or frames. Real Windows door tests verify body blocking, sprite depth and 24 camera orbit cases.

The supplied Painting_one texture contains fully transparent pixels despite its OPAQUE material declaration. Previously this sent the entire model scene through CPU color rendering. OPAQUE cutouts now retain GPU color rendering; shared CPU depth samples alpha only where needed and preserves historical UV, filtering and material-alpha arithmetic. MASK, BLEND and distance coverage retain their existing fallback behavior. Geometry collision remains independent of texture transparency.

The first native repair measurement improved highest/Smooth furnished-room throughput from about 11–13 fps to 53–64 fps across the three light cases. These are observed CPU/frame throughput results, not GPU timing or a claim of universal performance. The alpha-only refinement passed 200 exact historical depth comparisons and real GPU cutout checks; its native matrix remains in progress. Function-comment presence coverage passes at 5,231 maintained functions; semantic documentation review remains a separate delivery gate. Earlier measurements and source history are retained.

October 13 alpha-only refinement: actual Windows furnished matrix completed all 18 resolution/filter/light cases. Highest/Smooth observed 70.1 fps unlit, 70.1 fps one light, 60.3 fps eight transient emissions; CPU p95 14.8/14.7/17.0 ms. Evidence: test-artifacts/native-furnished-alpha-only-oct13-1524.json. No near-first ordering change was introduced. This does not replace transition/gameplay acceptance.

October 13: Windows completed 24 cold/warm door transfers across six quality modes, then four normal-tempo highest/Smooth transfers (1.3-second approach, 1-second passage plus configured leaf movement). Each accepted exactly one commit/completion despite a second activation attempt; breathing remained enabled. Evidence is separate native-door-matrix1523.json and native-door-normal1524.json. Silent test sounds and controlled fixture transfers do not prove all authored sound choices or all destination content.

October 13 native menu acceptance: 40 geometry camera-volume cases (23 boom retractions), closed-door body sweep, repeated pause/Resume and focused Escape, hand choice, master volume, Save/Load, literal-art transparent action boundaries, Escape retaining native fullscreen, and explicit Exit Fullscreen passed. Native adapter forbids the browser-only simulated exit fallback. Evidence screenshot: native-pause-art1524.png.

October 13 effects compatibility: actual Windows 12 scene/quality cases retained bounded fire/ash/rain emissions and active breathing. Highest/Smooth observed 68.3 fps in the textured interior and 51.0 fps in the populated forest, with frame p95 22.3/26.7 ms. This is measured stress behavior, not a 60 fps guarantee for the forest. Terrain elevation caches now cap at 65,536 samples per live world, retaining exact recomputation; the 70,000-sample stress test passes. Tile caches retain their independent 8,192 bound.

October 13 construction workflow repair: imported open-top rooms/towers previously required an upper surface to click before proposing an upper story. Placement elevation offset now supplies an explicit vertical proposal before compatible connector snapping. Browser acceptance uses real controls/pointer previews for square stories, two hollow tower sections and a matching roof, default geometry collision, Undo and validated project serialization. Native expanded acceptance remains running at this checkpoint.

October 13 expanded native castle acceptance passed: actual square-room story placement/snapping, open hollow tower stacking, matching tower roof, geometry collision defaults, Undo and production project validation. Browser and native use the same real placement controls; elevation proposal avoids inventing cap geometry. Presence coverage now passes for 5,262 maintained functions.


### October 13: typed cell, door, effect and stock controls

Cell settings now provide named-arrival ID/name/XY/facing rows, fog enable/start/end/color, and sprite-normal ambient/strength/direction fields. Facing displays degrees and saves radians; fog distances use metres. Apply validates the complete draft as one undo step. Routine cell JSON fields are superseded; exact earlier source and explanations remain archived. Browser and Windows verify save validation, Undo and invalid-range rejection.

Door zone size and rotation use XYZ controls; black-space hold has its own seconds field. Moving leaves and static frames retain their numeric composition subdialogs; raw assembly JSON is under Advanced. Browser and Windows verify paired sliding leaves, zone dimensions/rotation/hold and ordinary event Save. Transitions still have no skip action.

Native emitters have an Enabled checkbox and validator-matching ranges. Disabled records now stay disabled when reapplied. Breathing and player/follower/event note-tag opt-in tests pass in browser and Windows. Map actor tags remain ColorPoolPlayer/ColorPoolFollowers; event opt-in remains ColorPool.

Containers/merchants use typed starting-stock rows for item ID, integral quantity, stack ownership, NPC owner ID and cleanup protection. Custom extensible properties remain under Advanced. Browser and Windows verify ownership, properties and invalid quantity rejection. Initial authored stock is separate from session merchant/storage contents.

Generated-game packaging now collects recognized authored local image/audio/font paths outside the built-in banks, preserving byte contents and rejecting missing resources before destination creation. Embedded model bundles remain in portable project data. Core banks are still conservatively retained; this is resource closure improvement, not complete unused-asset pruning. Updated generated sky-game startup, menus, saves, two-way travel and editor-shortcut guard pass in the browser; final regenerated Windows-game acceptance remains required.


October 13, 2026 — Map-library capacity: the former 32-map cap is superseded in project validation, creation, duplication, imports, examples and recovery. No arbitrary map-count cap remains. Numeric MZ identities still use the documented 1–999999 compatibility range; project import retains its byte-size guard. Inactive map records must not be submitted to the active scene renderer. Large project serialization/storage costs remain separate from active-cell frame costs.


October 13, 2026 — Large cell libraries: removed the secondary 32-cell saved-hub-state limit as well as the authored-map cap. Preserved per-cell stack limits and recovery budgets. Cleanup now resolves policy only for its bounded records instead of cloning the whole project/model bank once per second; visited-cell IDs are cached per store and extended by the cell service. Pure tests preserve 256 visited-cell storage records across JSON Save/Load and verify eight policy lookups for an eight-record cleanup budget. A 128-cell exported browser game passes actual menus, Save/Load and two-way interpreter travel; Windows generated-game travel passed before the secondary persistence/cleanup repair and is being repeated with that repair. This is not a claim of arbitrary-size project memory or serialization performance.


October 13, 2026 — Windows large-library acceptance after persistence/cleanup repair: freshly generated 128-cell package (`work/runtime-large-1524-c`) opened in the isolated Windows desktop wrapper and passed actual gameplay-only DOM, highest Smooth options and two-way interpreter travel with independent skies/shared state. `native-cell-scale1524.json` compares identical active world: two maps 89.5 FPS, 128 maps 90.0 FPS, both p95 11.4 ms over 179 sampled animation intervals after warmup. Each case retained one decoded sky/one panorama mesh and zero full-project snapshot calls during ordinary play. This measures desktop animation intervals, not GPU time; it does not establish arbitrary large-library startup/save memory limits or performance for larger active scenes. `hub-state1517.cjs` separately validates 256 visited-cell storage records and eight-policy-lookups cleanup budget. Prior 32-map/32-cell restrictions are superseded, not retained current policy.


October 13, 2026 — Post-cap-change Windows regression: `sprite-door1524` passes real clean-door blocking, front torso/feet visibility, behind-door torso occlusion and identical historical image rectangles at three pitches. `stock-controls1524` passes typed stock/ownership/protection and invalid quantity rejection after cleanup policy changes. `castle-workflow1524` passes square/tower stacking, hollow tower centre, matching roof, validated save and Undo. Thin-wall `sprite-contact1524` remains observational: screenshots and image-rectangle equality are retained; behind/end contact retractions can bring the camera almost to actor position and must not be misrepresented as a broad locomotion visibility guarantee. Corner/raised-support acceptance still remains.


October 13, 2026 — Raised floor/corner acceptance extends the real door fixture with a two-metre solid support platform and perpendicular adjacent wall. Actual Windows keyboard walking stops at Y9.7885, Z2.0. Front torso and feet survive masking and the behind-door torso is occluded at pitches -0.6/0/+0.6; image rectangles remain identical to historical scalar-depth presentation. All 24 camera yaw/pitch samples remain outside the door mesh and primitive clearance ranges with no unresolved camera separation. `native-sprite-door1524-raised.json` and screenshots retain this evidence. The +0.6 image was visually inspected: intact feet/torso above the raised support; wall correctly occludes the left edge. This supplements earlier stairs/jump/landing tests, rather than proving all arbitrary corner geometries.


October 13, 2026 — Actual projectile gameplay lighting: `tests/native/projectile-lights1524.cjs` imports a simple 30-metre room, equips the shipped shotgun without changing combat parameters, and fires via actual F-key input. Across scales 1/1.5/2 and Crisp/Smooth, peak live shots = 16, active lights = 8, omitted lights = 8. Every case reaches zero shots/zero lights through normal simulation, without manual despawn. Highest Smooth records 90.2 FPS, 11.3 ms CPU p95 and 12.5 ms frame p95. These are actual desktop frame/submission measurements in the simple-room fixture, not GPU elapsed time or furnished-room performance. Furnished/native-effects matrices remain complementary evidence with their documented lower throughput. Export-copy/comment/binary closure guards and the original non-raised door/camera regression also pass after the latest changes.


October 13, 2026 — Named arrival elevation: typed rows now preserve optional Z (-100–100 metres), with blank meaning automatic floor selection. Add at player uses actual XYZ and facing. Existing explicit Z is no longer lost when reopening/applying the cell dialog; invalid explicit elevations reject before adoption. Browser/native cell controls verify saved Z3, fog and normal lighting, Undo and invalid drafts; automatic blank-Z acceptance is being extended separately. Inherited specialized test run descriptions are marked historical with accurate current contracts, rather than discarded. AUTHORING-GUIDE-0.15.24.md consolidates current instructions and explicit limits; BUILDING-AUTHORING-1524.md retains prior amendments as marked history.
### October 13, 2026 — remaining delivery gates after native export acceptance

The actual Windows Export Game folder was independently opened and passed
gameplay-only startup, options, inventory, editor-shortcut exclusion and resource
closure checks. Evidence: `test-artifacts/native-export-ui1524-current.json`
and `test-artifacts/native-desktop-export-ui-game1524-current.json`.
Template placement, independent stock overrides and saved active-cell reload
also passed in Windows (`native-template-workflow1524.json`). These supersede
earlier entries calling those particular checks pending.

Completion is still unproven: item-definition and weapon-balance authoring,
existing HUD/kill-feed parameter controls, semantic comment review, final
feature-to-control checklist, complete release packaging and packaged Windows
acceptance remain delivery gates. The native export fixture is a tested game
export, not the full editor release. Decorative imported window models use the
existing attachment workflow; a separate 2D sticker authoring tool is not yet
exposed. Do not interpret comment presence or individual fixture passes as full
scope completion.

Weapon spread source contracts now explicitly describe Gaussian deviation,
degree/radian conversion, zero overrides, historical handgun fallback and
detached validation. `tests/weapon-tuning1524.cjs` verifies those public behaviors
and bounds. Earlier generated descriptions remain marked history.

### October 13, 2026 — HUD kill-feed control acceptance

The earlier missing kill-feed control gate is now implemented. Starting gameplay
values has an inherited-settings switch, Enabled, general message pools and
typed weapon-specific rules. Project extensions preserve the override through
normal export/import/save data. Session construction applies it to the native
host's retained parameter reference; inheritance restores exact shipped values.
No new HUD overlay or transition skip was introduced.

`tests/kill-feed-settings1524.cjs` passes detached validation, parameter-reference
identity, rejected-draft atomicity and exact reset. The real control workflow
`tests/browser/kill-feed-controls1524.cjs` passes in browser and in the already
opened Windows editor through `tests/native/editor1524.cjs`. It edits messages,
exports production data, confirms runtime adoption, rejects blank text and
restores inheritance. Generated runtime startup/save/load/two-way travel also
passes with the new module. Actual kill-event presentation and customized
exported-game behavior still need their own acceptance; this paragraph does
not claim those from a parameter inspection.

### October 13, 2026 — item catalog authoring and runtime persistence

Starting gameplay values now exposes inherited or project-owned item definitions:
stable ID, name, whole-gold price, sprite/profile, imported dropped-model choice,
new-drop cleanup protection and Advanced extensible properties. Native inventory
quantities, ownership and drop positions remain independently saved stacks.
Project validation rejects missing catalog model bundles; import remaps model
IDs and rejects conflicting definitions before adoption. Active drop metadata
rebuilds on catalog-reference change without loading dormant worlds.

`tests/item-definitions1524.cjs` verifies detached metadata, extension retention,
validation rejection, inherited reset, merge remapping and conflict handling.
`tests/browser/item-controls1524.cjs` passes production controls/export/runtime
adoption/invalid-price/reset in both browser and actual Windows editor. The
existing room/template/import/reload workflow passes after the merge changes.
`FRONTIER_RUNTIME_CATALOG=1 tests/browser/runtime-start1524.cjs` verifies customized
item and HUD definitions in generated gameplay, Save/Load and two-way interpreter
travel. These gates do not yet prove actual rendered dropped-model placement or
a real kill event using the customized text; those acceptance cases remain.

New modules were formatted for readability; source explanations and historical
comments remain. Function-comment presence passes at 5,524 functions, separate
from the ongoing semantic documentation review and complete release packaging.

### October 13, 2026 — native weapon editor acceptance and packaging preparation

Starting gameplay values exposes opt-in native profile overrides, with typed
damage/ammunition/ballistic/cadence/pattern/audio fields and explicit units.
Profile identity and family remain shipped native capabilities. Seconds convert
to inherited 60-Hz cadence units; degree arcs convert to radians; projectile
speed/radius/range aliases and lifetime stay consistent. Unchecked profiles reset
to captured shipped definitions in the same Map retained by the host.

`tests/weapon-definitions1524.cjs` verifies units, coherent aliases, atomic
rejection and inheritance. `tests/browser/weapon-controls1524.cjs` passes actual
controls, project export and rejected burst counts in browser and Windows via
the native adapter. Generated runtime catalog acceptance now includes weapon
damage/cadence after Save/Load and two-way cell travel. These supersede prior
entries calling weapon-balance controls absent. Actual customized attacks and
kill text still need gameplay acceptance, not merely parameter inspection.

`work/package1524.cjs` is prepared and syntax checked, but has not yet produced
release packages. It refuses existing destinations, retains native runtime
licenses, creates complete Windows/browser copies and hash manifests, and
rejects diagnostics/profile artifacts. `PERFORMANCE-EVIDENCE/0.15.24` retains
63 exact native evidence files with hashes, including historical/interim cases.
Do not treat those archival cases as current success claims. Runtime active-cell
ownership, 256-cell persistence/cleanup and gameplay-default regressions pass.

### October 13, 2026 — real combat acceptance and starting-value history

`tests/browser/catalog-combat1524.cjs` passes both browser and actual Windows
native execution. Production controls author 40 handgun damage and a custom
general message pool, ordinary map import creates a real monster room, and one
F-key attack kills through normal projectile simulation. The existing HUD
message device displays the custom killer/victim/weapon template. No synthetic
damage or impact calls are used. This supersedes the earlier pending actual
customized-attack/kill-text gate for this fixture.

The final control audit found starting-value Apply lacked Undo. Compact separate
history now stores successful before/after defaults, with existing bounded
history service, not world/model snapshots. Undo/Redo start fresh playtests;
failed adoption preserves history; project restore/load clears it. Expanded
weapon-controls browser acceptance verifies native damage before/after actual
Undo/Redo. Windows acceptance of this new history step remains pending.

All twelve starting-values function contracts were reviewed and rewritten with
purpose, inputs, results, draft/adoption effects, bounds and failure ownership.
Earlier descriptions remain marked historical. The module is formatted for
manual maintenance; gameplay-default regressions and 5,565-function presence
coverage pass. EDITOR-CONTROLS-0.15.24.md maps supported features to controls and
limits. Semantic review and packaged release acceptance remain separate gates.

### October 13, 2026 — Windows history and per-weapon emission

Expanded native weapon-control acceptance now passes the real starting-value
Undo/Redo step in Windows, superseding its pending status above. The banked
projectile-light requirement also exposed an authoring gap: native per-weapon
emission already existed, but its fields were absent from the profile editor.
Weapon profiles now offer inherit/off/custom emission with typed color, radius,
brightness, falloff and flicker. Shared source validation and active budgets
remain authoritative; position belongs to the live projectile.

Expanded `catalog-combat1524` passes browser and actual Windows. Cell-wide
projectile emission is disabled, yet the configured weapon's custom color is
observed during normal F-key projectile simulation. Its real kill displays the
custom HUD text, and impact removes projectile/emission without manual despawn.
This is functional acceptance, not an additional performance matrix.

The banked material requirements still need scrutiny: current generated surfaces
have texture import/mapping controls, while imported GLB material slots retain
authored textures. The checklist's unsupported slot-replacement label does not
by itself resolve the request to texture supplied primitives through the same
authoring pipeline. Keep the goal active until that scope is resolved in code
and evidence, alongside semantic source review and complete release packaging.

### October 13, 2026 — imported material-slot foundation, still incomplete

`src/model-materials.js` defines portable per-instance slot overrides, original
UV repeat/aspect/rotation/offset mapping, tint retaining source alpha, and shared
surface-cache image resolution. Source GLB geometry/UV arrays are untouched.
`model-materials1524` passes detached mapping math, invalid-resource rejection and
alpha retention; spatial component validation now retains validated overrides.
Existing model-event tests pass. This is data/schema foundation only: main
CPU/GPU rendering, transition readiness, typed slot controls, persistence/native
visual acceptance and performance verification remain implementation gates.
Do not call imported material editing complete from these pure tests.

### October 13, 2026 — material rendering and slot controls, Windows pending

Per-instance material overrides now integrate CPU color/depth and real GPU color,
with shared image resolution, tint retaining source alpha, repeating UV mapping
and cache invalidation for override/aspect changes. Transition preparation starts
assigned image decoding and readiness waits for decoded/explicitly failed images.
Portable project validation reuses already staged model decoding to reject
nonexistent slots and mapping without authored UVs.

The selected-model slot modal uses typed fields, source/shared thumbnails and
bounded local texture import. Apply is one existing world-history transaction;
GLB source bytes/geometry/collision remain unchanged. Runtime exports omit the
new authoring modal, raising the established omission count from 17 to 18.

`model-material-controls1524` passes browser production controls, embedded image,
portable UV/tint metadata, normal Undo and actual CPU/GPU pixels (15,391 / 15,845
green pixels in the isolated fixture). The GPU check rejects CPU fallback.
Historical sampler/raster tests retain all assertions after repairing their
literal export-assignment inspection for formatted source: 9,600 sampler,
600 raster and 6,000 subpixel comparisons pass. Generated runtime startup,
menus/Save/Load/travel and model-event/map validation also pass. Native material
workflow, visual review, persistence/reload and performance remain explicit gates.



### October 14, 2026 — material acceptance and export boundary

Supersedes the October 13 material Windows/persistence/performance pending notes.
The real native slot workflow passes CPU/GPU rendering, Undo, portable merge and
local reload. The final visible-model material matrix passes all six presets at
about 90 FPS. The fresh furnished workflow and 18-case lighting matrix also pass;
use VALIDATION-1524.md for measured scope and retained lower effects-heavy results.

The new material modal exposed a strict desktop-export inventory mismatch. The
native boundary now matches all 18 omitted modules; no inventory assertion was
relaxed. The actual Windows folder chooser produced 435 files, and its exact
output passed native gameplay-only startup/options/inventory and material Save/Load.
Generated runtime two-way travel retains custom catalogs and material overrides.

Current source checks: existing 60-command script and 24 current-iteration pure
checks pass. The expanded comment gate covers tools too: 5,669 functions/callbacks.
Manual semantic review remains a delivery gate, alongside synchronized final
reference/docs and full Windows/Mac browser distributions. Older generated comments
are retained and supplemented with reviewed contracts, never silently stripped.


October 14 delivery update: complete candidate package checks and exact-package native workspace/menu guards passed; see RELEASE-VALIDATION-0.15.24.md and the packaged/native acceptance JSON for current evidence and limits. Earlier pending rows remain history. User requested stopping exhaustive manual comment review and moving to delivery; no claim of full semantic audit is made.
