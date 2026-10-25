# Sprite Frontier 0.15.24 — validation record

October 14, 2026. Working acceptance record; distribution certification remains
pending until both complete packages and their final checks are finished.
Earlier observations are retained in PERFORMANCE-EVIDENCE/0.15.24, including
failed/interim tests. The dated manifest identifies exact original bytes.

## Actual Windows acceptance

The current isolated Windows editor passed the full furnished authoring workflow,
including supplied furniture, painting attachment, direct transforms, normal
Undo and lazy asset behavior. Separate accepted native workflows cover square
and round construction, castle/tower stacking, materials, cell/effect/door/stock
controls, template copies with independent 7/3/7 stock, project import and local
reload. The saved active-map startup regression is repaired.

Imported-model material controls passed real slot editing, embedded image,
source-UV mapping and tint, Undo, project import and IndexedDB reload. Actual
CPU and GPU preview pixels are checked independently; GPU fallback cannot satisfy
the GPU assertion. Mixed slots require UVs on every affected primitive. Source
model geometry, collision, alpha and original GLB bytes remain unchanged.

The October 14 Windows native chooser exported 435 files, with all 18 authoring
modules omitted. The exact output was opened as a Windows game and passed clean
runtime DOM, F2 guard, highest Smooth settings, hand selection, pause/resume,
inventory, resource requests and Save/Load retaining its material override.
The generated two-cell package also passed actual interpreter-driven travel and
Save/Load with custom item/HUD/weapon definitions and embedded material overrides.

The final exported-game test initially raced initial native loading by reloading
before loadFile settled. The retained native diagnostic log identifies ERR_ABORTED;
the harness now waits for load completion before reloading. Settled startup and
all original acceptance assertions pass. This is not classified as a rendering
performance measurement.

## Native performance

The final furnished-room matrix uses six supported presets (scales 1/1.5/2,
Crisp/Smooth) and three lighting cases: 18 observations of six seconds each.
At highest Smooth the unlit fixture measured about 90.0 FPS, one light 83.6 FPS,
and eight transient projectile-position light emissions 71.2 FPS. The last case
measures production lighting during rendering; it does not simulate full attacks.
The highest Crisp eight-emission observation measured 73.2 FPS. CPU p95 ranged
from 10.4 to 12.5 ms in these highest-quality samples. These are CPU submission
and render-interval timings, not GPU elapsed measurements.

The visible, persisted model-material fixture measured about 90 FPS in every
preset over five seconds each. Acceptance requires the model to enter the visible
renderer. The earlier material timing without that explicit visibility gate is
retained as an interim observation and is not the authoritative material test.

Separate actual shotgun-input acceptance produced 16 projectiles, capped lighting
at eight, and returned naturally to zero projectiles/lights in every preset.
Its simple-room highest Smooth case measured 90.2 FPS; that fixture is distinct
from the furnished stress scene. Earlier effects-heavy highest Smooth tests
measured about 68.3 FPS in the room and 51 FPS in the forest. The engine does not
claim universal 60 FPS for arbitrary content or hardware.

The two-versus-128-cell Windows comparison used the same active scene: 89.5 versus
90.0 FPS, with 11.4 ms frame p95 and no full-project snapshots during ordinary
play. Inactive authored cells add storage/startup/save costs, not scene rendering.
This does not establish unlimited project memory or loading-time performance.

## Regression and documentation checks

The existing maintained test script passed all 60 commands; all 25 current-iteration
pure tests passed. Locked sprite presentation, thin doors, raised support/corners,
stairs/landing and camera-clearance checks are retained in native evidence.
Sampler/raster equivalence keeps all 9,600 sampler, 600 raster and 6,000 subpixel
comparisons. Formatting changes preserve the locked 0.15.17 presentation.

The function-comment presence gate now includes maintained tools and passes 5,671
functions/callbacks. Nine comment-only modules pass syntax-tree equivalence against retained pre-review
bytes, protecting return/newline behavior while allowing formatting and comments.
Historical comments are retained. Semantic review is still
in progress: presence is not proof that every explanation is useful. Recent
reviewed contracts cover model transform spaces/units, project validation and
IndexedDB commit/failure behavior, native lifecycle/export boundaries and audio
ownership/envelopes. The current function reference must be regenerated after
that review, followed by the final package checks.

## Supported limits and final delivery gates

Lighting evaluates at most eight sources, with bounded transient lifetimes and
limited generated-primitive blockers. Imported mesh and terrain shadow casting
are unsupported. Tilted/nested attachment hosts reject explicitly. Spiral stairs
remain future work; decorative windows currently use imported models. UV mapping
requires authored coordinates and does not infer them. Asset banks are retained
conservatively in exported games; complete asset pruning is not claimed.

Final gates remaining: finish the semantic source/documentation audit, synchronize
current guides/reference/history, produce both full distributions and verify
package manifests/contents and the packaged Windows startup. Actual macOS hardware
is unavailable; browser/package checks performed here must not be called a native
Mac test.


### October 14 — source review checkpoint

The exact current reference indexes 5,671 maintained functions, including tools.
Nine comment-only modules pass executable syntax equivalence: pooled Pixi drawing,
audio/music, model container/library/transform, native lifecycle/preload and asset
inventory. The unchanged baseline plus current checks remain passing. The old
upright sprite-band helper is explicitly marked historical and unused by normal
locked presentation; it must not be substituted for the current path.

validation/COMMENT-PURPOSE-REVIEW-1524.json lists 721 remaining generic-purpose
phrases for manual review against source bodies and surrounding rationale. This
is a review queue, not a claim that all 721 functions are incorrect. It prevents
using the presence count as a substitute for the requested human-readable audit.
Complete that review and update the queue/reference before distribution creation.

### October 14 - recovery and current verification

The saved Windows exported-game test reopened successfully after restart. All 60 baseline commands and 27 top-level 1524 checks pass. Coverage counts 5,672 functions/callbacks. Executable syntax remains identical for 102 reviewed modules and 164 archived readable-format modules. Two test-only declaration lookups were repaired for whitespace, retaining original behavioral assertions. Current references are regenerated; 610 generic-purpose contracts remain in the refreshed semantic review queue. These counts supersede earlier checkpoints. Documentation review, full packaging and release acceptance remain pending.

### October 14 - persistence/history review checkpoint

Reviewed map-library saving, switching, getters, template operations and local restore/load contracts against their bodies. Corrected the old remember() purpose while retaining it as superseded history. Added accurate limits for validation versus later host adoption failures, synchronous template-history callbacks and serialized-byte accounting versus actual memory. Stable numeric map/import remapping comments now distinguish shallow catalog copies from deep imported worlds and outer adoption validation. Template-history/map-identity behavior tests and exact executable syntax comparisons pass. Full semantic audit and distribution acceptance remain pending.


### October 14 - current documentation verification checkpoint

Function reference indexes 5,672 maintained functions/callbacks. The refreshed generic-purpose review queue has 496 candidates; it is a heuristic subset and does not prove all other contracts complete. Reviewed modules since recovery include activity/aggro, asset styling, event runtime/state/continuation/context, room-plan editor, movement/recovery/model targeting, map library key operations, template history/map identities, fog/directions/projectiles, scalar screen effects, water/vector display, cursor/input, normal bindings/cache, page cache/event motion/team targeting, sprite lighting and terrain inverse-depth helpers. Original source contracts are retained as superseded history. Syntax equivalence remains passing for 102 reviewed modules and 164 archived readable-format modules. Recent targeted checks pass, including 2,400 exact terrain-depth comparisons. Final semantic audit, full distributions and packaged-release acceptance are still pending; no completion claim is made.



### October 14, 2026 — continued semantic comment review after usage reset

Reviewed 116 current function contracts against their bodies across model-renderer (19), actor-behavior (13), behavior-dialog (7), transfer-player (5), editor-tools (45), number-input (11), quest-example (7), gameplay-commands (2), and gameplay-dialogs (7). Existing historical explanations remain; dated directly adjacent contracts distinguish current behavior. The renderer review supersedes the historical CPU-only introduction, and transfer documentation distinguishes destination resolution from current scene-loading ownership. Editor documentation explicitly records embedded water data, host-owned Undo/persistence, brush interpolation limits, map-local prefab ownership and callback failure behavior. No executable changes were made in this batch.

PASS: comment-semantics1524 (102 reviewed modules and 164 reformatted modules), function-comments1516 (5,672 functions), actor-behavior159, transfer-player159, gameplay-commands159, mz-number159, quest-maps159 and quest-lifecycle159. Function reference rebuilt from current source. Current generic-purpose review candidates: 391. This heuristic count is not a claim that every unflagged explanation is sufficient; the semantic review remains unfinished. Release packaging and final packaged Windows acceptance remain pending.


October 14 continuation: additionally reviewed all 18 remaining structural MZ command-editing contracts and the encounter fixture constructor. Documented inclusive range expansion, cloned versus referenced choice bodies, index-based choice preservation, unsupported malformed-block repair and host-owned Undo/validation. PASS mz-choices159 and mz-branch-editing159, plus repeated exact semantic-tree and comment-presence gates. These checks cover the documented structural editing paths; they do not replace final packaged desktop acceptance.


October 14 continuation: reviewed ten template-dialog contracts and five normal-worker contracts against implementation, preserving historical explanations. Template documentation distinguishes project-bank Save from event-draft Apply and synchronous callback acceptance from external rollback; normal preparation documents transferable resources, 32-row worker batches, AbortError and cleanup ownership. PASS event-templates159 and the comment-presence/exact semantic-tree gates. Reference updated; current generic-purpose candidates 377. Generated worker source string was not modified in this comment-only pass. Semantic review, packaging and final release acceptance remain unfinished.


October 14 continuation: reviewed 27 spatial model-editor contracts, preserving the previously documented automatic mesh-collision visual choice, and three project parameter contracts. Model draft comments now distinguish local units/rotation, dialog rebuilds, independent library changes, deferred validation and host-owned Apply/Undo/persistence. PASS exact semantic-tree equivalence, function-comment presence and model-scene1517. Function reference regenerated; semantic review and release acceptance remain pending.


Correction to the immediately preceding October 14 checkpoint: model-scene1517 was an incorrect test filename and did not run (MODULE_NOT_FOUND). The comment/syntax checks did pass. Located the actual maintained tests and ran model-scene1511 and model-events1511 successfully; these are the valid model behavior checks for this batch. Retained the prior note with this explicit correction rather than silently overwriting history.


October 14, 2026 — user-directed release preparation: user explicitly requested ending the exhaustive manual comment review and proceeding. Presence coverage remains 5,672; reviewed explanations and all history remain preserved, but complete manual semantic audit is not claimed. Final package creation and packaged Windows verification are the next gates.


October 14 packaged acceptance: first full archives were produced and all manifest bytes matched (browser 1,248 files; Windows 1,324). Actual packaged Windows executable launched with 0.15.24 clean playtest and return-to-editor control visible. Desktop interaction then encountered a minimized window and was not counted as workflow acceptance. Packaged baseline/current checks: Windows 83/85, with two failures caused by regression tests depending on external sibling historical release folders; browser 84/85 with desktop-only semantic check inapplicable, while its sibling folders happened to be available. Repaired source tests by preserving exact .22 model-renderer and .23 terrain-occlusion reference bytes inside SOURCE-HISTORY/regression-references and referring to those packaged copies. Both repaired regressions and comment presence now pass in source. Existing archives remain preserved first candidates; complete replacement distributions and final native workflow acceptance are still required.
