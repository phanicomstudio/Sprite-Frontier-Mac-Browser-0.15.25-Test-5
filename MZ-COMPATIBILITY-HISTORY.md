# MZ compatibility checklist — 0.15.9 development

This checklist is a work ledger, not a claim of completed parity. Source references: four user screenshots; installed help-en/01_09_03.html; supplied MZ 1.8.0 rmmz_objects.js and rmmz_managers.js. Runtime comparisons take precedence when prose disagrees (variable page threshold is >=). No original editor source has been recovered.

## Page controls and editing

| Feature | Current evidence/status |
|---|---|
| Name/Note and editor-only name | Replacement UI exists; basic Chrome acceptance passes; exact reference comparison pending |
| Numbered page tabs | Replacement UI exists; basic Chrome acceptance passes; exact reference comparison pending |
| New/Copy/Paste/Delete/Clear page | Insert-after-current and defaults implemented; New/Delete verified in Chrome; Copy/Paste/Clear acceptance pending |
| Two switches, variable >=, self switch, item, actor | Condition foundation in progress |
| Image selector and empty image default | Pending asset selector and runtime |
| Fixed/Random/Approach/Custom movement, speed/frequency | Custom route data/controller/dialog implemented for codes 1–13, 15–38; exact cadence and remaining route codes pending |
| Walking/Stepping/Direction Fix/Through | Pending UI and runtime parity |
| Below/Same/Above priority; five triggers | Parallel interpreters now independent and browser-tested; exact priority/contact semantics and full native comparison pending |
| OK/Cancel/Apply | Apply remains open and Cancel preserves last Apply: Chrome fixture passes; OK and isolated return acceptance pending |
| Contents keyboard/context/multiselect/drag/group editing | Replacement list exists; structural selection and rebasing tests pass; full keyboard/context/drag acceptance pending |
| Unknown extension JSON, migrations | Foundation tests pass for migrations and unknown extension round-trip |
| Fixed-room eight-direction animation | Source regression passes; browser acceptance pending |

## Every palette command

| Tab | Category | Code | Command | Dialog | Runtime |
|---|---|---:|---|---|---|
| 1 | Message | 101 | Show Text | Pending | Pending |
| 1 | Message | 102 | Show Choices | Dedicated six-choice dialog; native layout/default verification pending | Selected/cancel/nested branches and text combination tested; control codes/presentation pending |
| 1 | Message | 103 | Input Number | Dedicated variable/digits dialog tested; native picker/layout pending | Digit wrap/clamp, no cancel, assignment, wait and text/parallel integration tested; controller/presentation parity pending |
| 1 | Message | 104 | Select Item | Pending | Pending |
| 1 | Message | 105 | Show Scrolling Text | Pending | Pending |
| 1 | Game Progression | 121 | Control Switches | Pending | Pending |
| 1 | Game Progression | 122 | Control Variables | Partial: dedicated arithmetic and Constant/Variable/Random controls tested in Chrome; exact MZ radio/picker layout pending | Six operations, execution-time operands and random ranges tested; Game Data/Script pending |
| 1 | Game Progression | 123 | Control Self Switch | Pending | Pending |
| 1 | Game Progression | 124 | Control Timer | Pending | Pending |
| 1 | Flow Control | 111 | Conditional Branch | Pending | Pending |
| 1 | Flow Control | 112 | Loop | Direct insertion implemented; Loop verified in Chrome | Runtime fixture passes; live MZ comparison pending |
| 1 | Flow Control | 113 | Break Loop | Direct insertion implemented; Loop verified in Chrome | Runtime fixture passes; live MZ comparison pending |
| 1 | Flow Control | 115 | Exit Event Processing | Direct insertion implemented; Loop verified in Chrome | Runtime fixture passes; live MZ comparison pending |
| 1 | Flow Control | 117 | Common Event | Pending | Pending |
| 1 | Flow Control | 118 | Label | Dedicated label-name dialog implemented; browser acceptance pending | Label/jump runtime fixture passes; jumps across branches require further parity checks |
| 1 | Flow Control | 119 | Jump to Label | Dedicated label-name dialog implemented; browser acceptance pending | Label/jump runtime fixture passes; jumps across branches require further parity checks |
| 1 | Flow Control | 108 | Comment | Pending | Pending |
| 1 | Party | 125 | Change Gold | Pending | Pending |
| 1 | Party | 126 | Change Items | Pending | Pending |
| 1 | Party | 127 | Change Weapons | Pending | Pending |
| 1 | Party | 128 | Change Armors | Pending | Pending |
| 1 | Party | 129 | Change Party Member | Pending | Pending |
| 1 | Actor | 311 | Change HP | Pending | Pending |
| 1 | Actor | 312 | Change MP | Pending | Pending |
| 1 | Actor | 326 | Change TP | Pending | Pending |
| 1 | Actor | 313 | Change State | Pending | Pending |
| 1 | Actor | 314 | Recover All | Pending | Pending |
| 1 | Actor | 315 | Change EXP | Pending | Pending |
| 1 | Actor | 316 | Change Level | Pending | Pending |
| 1 | Actor | 317 | Change Parameter | Pending | Pending |
| 1 | Actor | 318 | Change Skill | Pending | Pending |
| 1 | Actor | 319 | Change Equipment | Pending | Pending |
| 1 | Actor | 320 | Change Name | Pending | Pending |
| 1 | Actor | 321 | Change Class | Pending | Pending |
| 1 | Actor | 324 | Change Nickname | Pending | Pending |
| 1 | Actor | 325 | Change Profile | Pending | Pending |
| 2 | Movement | 201 | Transfer Player | Pending | Pending |
| 2 | Movement | 202 | Set Vehicle Location | Pending | Pending |
| 2 | Movement | 203 | Set Event Location | Pending | Pending |
| 2 | Movement | 204 | Scroll Map | Pending | Pending |
| 2 | Movement | 205 | Set Movement Route | Dedicated target/route dialog tested; native picker/layout pending | Player/event forcing and wait tested; full route parity pending |
| 2 | Movement | 206 | Get on/off Vehicle | Pending | Pending |
| 2 | Character | 211 | Change Transparency | Pending | Pending |
| 2 | Character | 216 | Change Player Followers | Pending | Pending |
| 2 | Character | 217 | Gather Followers | Pending | Pending |
| 2 | Character | 212 | Show Animation | Pending | Pending |
| 2 | Character | 213 | Show Balloon Icon | Pending | Pending |
| 2 | Character | 214 | Erase Event | Pending | Pending |
| 2 | Picture | 231 | Show Picture | Pending | Pending |
| 2 | Picture | 232 | Move Picture | Pending | Pending |
| 2 | Picture | 233 | Rotate Picture | Pending | Pending |
| 2 | Picture | 234 | Tint Picture | Pending | Pending |
| 2 | Picture | 235 | Erase Picture | Pending | Pending |
| 2 | Timing | 230 | Wait | Pending | Pending |
| 2 | Screen | 221 | Fadeout Screen | Pending | Pending |
| 2 | Screen | 222 | Fadein Screen | Pending | Pending |
| 2 | Screen | 223 | Tint Screen | Pending | Pending |
| 2 | Screen | 224 | Flash Screen | Pending | Pending |
| 2 | Screen | 225 | Shake Screen | Pending | Pending |
| 2 | Screen | 236 | Set Weather Effect | Pending | Pending |
| 2 | Audio & Video | 241 | Play BGM | Pending | Pending |
| 2 | Audio & Video | 242 | Fadeout BGM | Pending | Pending |
| 2 | Audio & Video | 243 | Save BGM | Pending | Pending |
| 2 | Audio & Video | 244 | Resume BGM | Pending | Pending |
| 2 | Audio & Video | 245 | Play BGS | Pending | Pending |
| 2 | Audio & Video | 246 | Fadeout BGS | Pending | Pending |
| 2 | Audio & Video | 249 | Play ME | Pending | Pending |
| 2 | Audio & Video | 250 | Play SE | Pending | Pending |
| 2 | Audio & Video | 251 | Stop SE | Pending | Pending |
| 2 | Audio & Video | 261 | Play Movie | Pending | Pending |
| 3 | Scene Control | 301 | Battle Processing | Pending | Pending |
| 3 | Scene Control | 302 | Shop Processing | Pending | Pending |
| 3 | Scene Control | 303 | Name Input Processing | Pending | Pending |
| 3 | Scene Control | 351 | Open Menu Screen | Pending | Pending |
| 3 | Scene Control | 352 | Open Save Screen | Pending | Pending |
| 3 | Scene Control | 353 | Game Over | Pending | Pending |
| 3 | Scene Control | 354 | Return to Title Screen | Pending | Pending |
| 3 | System Settings | 132 | Change Battle BGM | Pending | Pending |
| 3 | System Settings | 133 | Change Victory ME | Pending | Pending |
| 3 | System Settings | 139 | Change Defeat ME | Pending | Pending |
| 3 | System Settings | 140 | Change Vehicle BGM | Pending | Pending |
| 3 | System Settings | 134 | Change Save Access | Pending | Pending |
| 3 | System Settings | 135 | Change Menu Access | Pending | Pending |
| 3 | System Settings | 136 | Change Encounter | Pending | Pending |
| 3 | System Settings | 137 | Change Formation Access | Pending | Pending |
| 3 | System Settings | 138 | Change Window Color | Pending | Pending |
| 3 | System Settings | 322 | Change Actor Images | Pending | Pending |
| 3 | System Settings | 323 | Change Vehicle Image | Pending | Pending |
| 3 | Map | 281 | Change Map Name Display | Pending | Pending |
| 3 | Map | 282 | Change Tileset | Pending | Pending |
| 3 | Map | 283 | Change Battle Background | Pending | Pending |
| 3 | Map | 284 | Change Parallax | Pending | Pending |
| 3 | Map | 285 | Get Location Info | Pending | Pending |
| 3 | Battle | 331 | Change Enemy HP | Pending | Pending |
| 3 | Battle | 332 | Change Enemy MP | Pending | Pending |
| 3 | Battle | 342 | Change Enemy TP | Pending | Pending |
| 3 | Battle | 333 | Change Enemy State | Pending | Pending |
| 3 | Battle | 334 | Enemy Recover All | Pending | Pending |
| 3 | Battle | 335 | Enemy Appear | Pending | Pending |
| 3 | Battle | 336 | Enemy Transform | Pending | Pending |
| 3 | Battle | 337 | Show Battle Animation | Pending | Pending |
| 3 | Battle | 339 | Force Action | Pending | Pending |
| 3 | Battle | 340 | Abort Battle | Pending | Pending |
| 3 | Advanced | 355 | Script | Pending | Pending |
| 3 | Advanced | 357 | Plugin Command | Pending | Pending |

All palette entries must acquire a dedicated dialog (where MZ uses one), validated data, execution evidence and authoring fixtures before parity can be marked complete. Structural continuation records are separately required: 0, 401, 405, 408, 402–404, 411–413, 505, 601–605 and 655. Custom movement-route records have their own catalogue and tests; plugin commands need a registered plugin schema.

Custom autonomous route checkpoint: codes 1–13 and 15–38 have runtime implementations and route authoring controls. Source and Chrome fixtures cover collision retry/skip, wait, repeat/completion, authored-state isolation and dialog cancellation. Codes 14 and 39–45 remain pending; forced route command 205 is covered in the following checkpoint. Native editor layout, route cadence and complete keyboard parity are unverified. This checkpoint supersedes earlier blanket statements that Custom routes are wholly unavailable.

Set Movement Route (205) checkpoint: dedicated Character/route dialog implemented, with Player/This Event/numeric event target and nested route draft. Runtime supports forcing routes and Wait for Completion; missing targets are skipped following installed MZ runtime. Browser fixture verifies chooser tab 2, Player selection, route insertion, default wait flag and authored persistence. Source fixtures verify event/player completion, non-waiting continuation, repeat+wait and unsupported-route rejection before event effects. Exact MZ movement speed on diagonals, forced-route interruption/restoration of autonomous routes, persistent character option overrides, full target database picker and native dialog layout remain pending. Prior statement that 205 is wholly pending is superseded by this checkpoint.

Show Choices checkpoint: command 102 and section records 402/403/404 implemented. Six-choice dedicated dialog, generated section groups, structural group validation, index-based body preservation and unknown marker extension retention are supported. Runtime covers nested choices, selected branches, cancel-to-choice, cancel branch, disallow, default focus, arrow navigation, Enter, Escape and choice-window right-click cancellation. Show Text immediately followed by choices shares one message. Existing whole-suite regressions and source choice fixture passed; Windows Chrome authoring/playtest fixture passed. Complete MZ window placement/background styling, control-code rendering, native editor defaults/layout and controller navigation remain pending. Index-based preservation after editing is tested internally but not yet compared to live native MZ behavior.


Parallel interpreter checkpoint: each parallel page now owns its command position, wait, route wait and branch state. Highest-page changes replace the parallel interpreter; inactive/erased pages stop scheduling. Main interaction/autorun remains separate. Shared messages serialize and Continue/choices/cancellation route to their owning context. Shared clock and motion update once per frame. Stable event order is retained while within budgets; 64 commands per interpreter and 4096 per frame are host safety limits, with rotating service under budget pressure. Those limits are adaptations, not native MZ constants. Source tests cover concurrent waits/main execution, page reset, message ownership, choice response, timer-once and 80-loop fairness; Windows Chrome playtest confirms ongoing parallel work during autorun waits and dialogue. Runtime source comparison verifies first-update parallel execution. Native UI comparison, complete common-event support and interpreter-progress save/resume remain pending.


Input Number checkpoint: command 103 has validated variable ID/1–8 digit parameters and a dedicated authoring dialog. Runtime per-digit wrapping, initial-value clamping, first-digit focus, navigation, no cancellation and variable assignment follow installed MZ runtime/documentation. Text followed by number input shares the message. Responses route to the owning parallel/main interpreter. Source fixtures and Windows Chrome authoring/playtest passed. Native editor variable picker/layout, exact window placement, controller interaction, sound and message control codes remain pending. Current overview/handoff now describe this candidate instead of older releases.

## Runtime registry checkpoint
`src/event-runtime.js` separates new runtime command validators and executors from interpreter control flow. Register a unique namespaced type with `validate` and `execute`; reserved control-flow types cannot be replaced. Unknown execution types are reported before an event starts. Executors can return wait, message or stop directives. Editor dialogs and MZ opcode lowering remain separate registrations/integration points.

Change Gold (MZ 125) now supports increase/decrease with constant or variable operands, clamps to 0–99,999,999 and persists through event-state capture/restore. `tests/mz-gold159.cjs` verifies arithmetic, limits, variable operands, state round trips and custom handler waits. The complete source suite passed at this checkpoint. The new parameter dialog has not yet been browser-verified; native MZ UI parity and platform package testing remain pending. This is still an unfinished complete-iteration candidate, not a release.

Gold branch verification: MZ runtime source `Game_Interpreter.command111` confirms subtype 7 comparisons are >=, <= and < (in that order). The new gold expression evaluator and dedicated Conditional Branch fields use those comparisons. Source fixtures verify equality boundaries and both branch/Else execution paths; `work/test-gold-ui159.cjs` verifies Change Gold variable-operand authoring and Gold branch parameter output in Windows Chrome. Full source suite passed again. Native dialog layout/defaults remain unverified; this evidence does not establish Mac or desktop package acceptance.

## Change Items checkpoint
MZ opcode 126 now lowers into the separately registered `mzItems` runtime handler. Constant/variable Increase/Decrease operands update the same `item-N` inventory checked by item conditions. MZ runtime source confirms the default 99-item limit and deleting zero-count entries; both are implemented. Signed variable operands preserve MZ operation semantics. Source fixtures verify clamp/removal/condition integration/isolation, and Windows Chrome verifies the dedicated dialog's variable-operand output. Full source suite passed. Item IDs currently use numeric fields: named database selection, item metadata/use behavior and native layout/default verification remain pending, so this is partial command compatibility.

## Extended-condition preservation checkpoint
Applying page edits previously rebuilt conditions solely from the six MZ checkbox slots, silently dropping richer expressions. `FrontierEventSchema.extraPageConditions` now preserves conditions not represented by existing slots, including expression extension data. The editor displays a notice for additional required conditions. Branch dialogs containing extended expressions disable conflicting MZ fields and preserve the expression; advanced expression authoring remains pending. Windows Chrome fixture `work/test-extra-conditions159.cjs` verifies successful Apply, expression/extension retention and branch preservation. Full source suite passed. Native UI parity is not claimed for these engine-specific notices.

## Page capacity, performance and replacement requirements
The fixed 100-page host cap is removed. Pages are limited by the actual 2 MiB serialized event budget, not an MZ-style count. The editor reports pages, commands and bytes under engine properties. `FrontierEvents.diagnostics(event)` provides the same data on demand; `services.debug:true` enables cumulative page-check counting. Sizing is not performed per frame. A source fixture validates 1,000 pages and exposes the 1,000-check worst case when the lowest page matches. Full source suite and the extended-condition browser regression pass. This does not establish a frame-time budget for large events.

Required next work: page dependency indexing/invalidation, bounded active-page cache and benchmarks on forest/parallel/quest fixtures. Spatial/timer conditions require appropriate invalidation rather than caching forever. Disabled diagnostics must remain cheap; logs must be bounded and exclude asset payloads. New modules and behaviors require comments describing ownership, invariants, failure behavior and extension contracts, with author-visible diagnostics for unsupported operations.

Replace Event is a requested engine command, not implemented yet. Its contract should reference a shared template by stable ID instead of embedding duplicate pages; retain target instance identity/position by default, explicitly choose reset versus preserve self-switches and event-local state, replace atomically at an interpreter boundary, cancel the replaced instance's old parallel/route/message ownership, rebuild collision/render bindings and release unused resources. Persist the replacement/template version through travel and save/load, isolate it from authored data during playtest, and provide undoable authoring edits plus a bounded replacement debug trace. Defer replacing a currently executing event until its command boundary. Test replacements during waits, messages, parallel execution, combat and reload. Do not enable a chooser control until the runtime contract works.

Numeric map-reference work for Transfer Player has begun in `src/map-identities.js` but is not loaded or integrated; Transfer Player remains pending. Stable map numbers must survive creation/reordering/export/import before native numeric transfer records can be supported reliably.

## Stable numeric map identity checkpoint
`src/map-identities.js` is now loaded and integrated with the map library. Existing string IDs remain intact; additive `mzId` fields are preserved by project validation/save/export. Legacy projects receive IDs once; snapshots assign new maps without renumbering existing maps. Import assigns fresh numeric IDs and remaps direct MZ 201 references between imported maps without mutating source data. Variable-based and external numeric references still require explicit import policy before Transfer Player is enabled. Tests cover reorder/save stability, collisions and internal-reference remapping. Full source suite plus Windows Chrome separate-map/forest-preservation regression pass. Transfer Player runtime/dialog remains pending.

## Page-cache checkpoint
`src/page-cache.js` is loaded before events and creates a WeakMap cache per session. Ordinary state-only conditions reuse active-page results until tracked collection mutation/replacement or gold changes. Collection set/add/delete/clear methods record meaningful changes. Restored maps/sets are automatically observed on their next query. Timer, distance and unknown/custom expressions bypass caching, including nested groups containing them. Runtime page definitions are immutable by contract; deliberate definition changes must call `session.invalidatePages(event)` or invalidate all.

This first cache invalidates conservatively on any tracked state collection change; it is not a per-key dependency index. A continuously changing parallel variable can therefore invalidate unrelated events. Per-key indexing and representative frame/memory benchmarks remain pending. Cache sizing avoids retained lists of ended events; no per-frame serialization is added. Debug exposes hit/miss/dynamic/invalidation counters; expensive event-size reports are on demand.

Evidence: 1,000-page fixture plus 100 repeated queries produces no extra scan after the first. Mutation, collection replacement, restore, actor/gold changes and timer/custom fallback tests pass. The full source suite passes with cache preloaded (`npm run test:cached`), and Windows Chrome parallel wait/dialogue/page-change regression passes. These are functional and scan-count checks, not a measured whole-game performance claim.

## Per-key cache refinement and measurement
Page plans now compile known condition dependencies (including nested AND/OR/NOT, comparison variables and self-switch instance keys). Each observed collection keeps a fixed 256-entry mutation ring. Unrelated changes update the cache snapshot without reevaluating pages; relevant mutations/clear/replacement or missing history trigger a safe scan. Unknown/timer/spatial expressions still bypass caching. Runtime state mutation must use collection instance methods; bypassing observation with prototype calls is outside the extension contract. Explicit page-definition edits require invalidatePages.

Full cached source suite and Windows Chrome parallel regression pass. The fixture verifies 500 unrelated variable changes and 500 unrelated switch changes without another page scan, plus safe history-overflow fallback. `PAGE-CACHE-BENCHMARK.json` records this machine's selection-only Node benchmark: 10,000 queries against 1,000 pages, only lowest matching, uncached ~142 ms versus cached ~5.9 ms. This excludes rendering, assets, command execution, dynamic conditions and Mac browsers; it is not a whole-game frame-time promise. Representative game benchmarks remain required.

## Transfer Player destination contract
`src/transfer-player.js` validates the six MZ 201 operands and resolves direct or execution-time variable destinations using stable numeric map IDs. Direction 0 preserves facing; 2/4/6/8 map to engine yaw. Fade 0/1/2 is retained as data. Destination resolution is read-only and checks playable map bounds plus an optional collision callback. Continuous coordinates are supported as an engine extension; MZ integer records round-trip. The operand ordering and variable-read timing are verified against MZ Game_Interpreter.command201. Native dialog defaults/layout remain unverified.

The command is NOT enabled: scene loading, fade/wait behavior and interpreter continuation across map replacement are pending. Validation now understands 201, while lowering produces an explicit unsupported record; a fixture proves rejection before preceding event effects. Source fixtures cover direct/variable resolution, changed variable map ID, missing/blocked/out-of-bounds destinations, facing, fade data and extension preservation. Full cached suite and Windows Chrome map-creation/forest-preservation regression pass. Next: transition ownership and continuation, then dedicated destination selection/dialog and live travel tests.

## Interpreter continuation foundation
`src/event-continuation.js` defines a versioned JSON contract containing the executing authored page, compiled-command cursor, wait and choice-branch state. It revalidates/recompiles before adoption; unsupported commands, malformed state and busy destination interpreters reject atomically. Session capture refuses active messages/forced routes or parallel ownership. It stores only the executing page, avoiding a copy of every event page. Tests verify JSON round trip, resumed wait/cursor without replay and failure guards. Full cached source suite and Windows Chrome parallel regression pass.

This API is not yet wired into map switching or save-game persistence. Chained transitions need retained origin ownership; transferred This Event/self-switch/route semantics require explicit verification. Scene fade/wait coordination, live transfer continuation, dedicated 201 dialog and platform checks remain pending. Do not enable Transfer Player until these invariants hold. Next implementation should reserve a transition at the command boundary, transfer main-interpreter ownership once, restore shared state and then adopt continuation without replaying the transfer itself.

## Current checkpoint — live transfer and screen presentation
This checkpoint supersedes the earlier pending Transfer Player notes. MZ 201 now executes through a scene-owned reservation: 0.4-second black/white fade out, one map commit, fade in and one main-interpreter continuation adoption; no-fade transfers use the same ownership contract. Same-map relocation retains the session. Chained transfers retain the executing source page despite a destination event ID collision. The continuation keeps originMap: self-switch writes/branches use originating-map state, off-map event movement lookup is skipped, and Erase Event is guarded by current-map ownership as in MZ. Player lookup remains available. Direct/variable destinations resolve at execution time, use stable numeric map identities, and reject missing, blocked or out-of-bounds destinations. Continuous coordinates remain an engine extension.
Dedicated Transfer Player dialog is enabled with project map names/IDs, direct or variable designation, coordinates, direction and fade. Exact native UI/default/keyboard parity remains unverified. Parallel transfer is explicitly rejected before preceding effects; save-game interpreter continuation integration and import remapping policy for variable/external map references remain pending.
Show Text now carries independent textPresentation through attached choices/number input. Speaker can be blank; top/middle/bottom and window/dim/transparent are rendered. Choice position/background remain separate. Faces, control codes, full native message appearance and pagination remain pending. Fadeout/Fadein (221/222) use registered runtime service, missing-service atomic preflight and .4-second interpreter wait. Screen brightness uses a separate bounded scalar tween under dialogue/HUD, distinct from scene-transition fade. Its capture/restore API is tested but not yet wired into exported playtest states.
Evidence: cached source suite passes, including scene-transition159 and live-transfer159. Windows Chrome fixtures pass live cross-map fade/continuation, chained same-map relocation, destination dialog operands/extensions, independent text/choice settings and fadeout/wait/fadein. No native Windows package or Mac execution evidence yet.
Next: remaining command/dialog coverage, richer condition authoring, Replace Event/template persistence, party database/spawn/equipment/persistence, native reference UI acceptance, fixed-room live acceptance, final overview/handoff and complete platform distributions. Goal remains active; 0.15.9 remains unfinished.
