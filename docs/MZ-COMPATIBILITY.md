# MZ compatibility — current 0.15.9 checkpoint

**Unfinished source iteration. No claim of exact MZ parity or platform release.** This document supersedes historical checkpoints in MZ-COMPATIBILITY-HISTORY.md.

References: supplied four editor screenshots, installed MZ documentation and extracted MZ 1.8 runtime source. Native editor interaction/layout/default verification is still pending. Registered support means executable implementation, not proven full compatibility.

## Event editor and project controls

| Area | Implemented and tested | Remaining limits |
|---|---|---|
| Map creation | New named flat/hills/generated maps preserve existing forest/tests; project save/import/export; stable numeric map IDs | 32-map project cap; templates/tests remain editable; external/variable transfer import policy |
| Event placement | Authoring terrain context menu Create/Edit/Duplicate/Delete; gameplay right-click preserved | Complete live acceptance across slope/interior/elevation combinations |
| Pages | Name/Note, numbered tabs, New/Copy/Paste/Delete/Clear, Apply/OK/Cancel; no fixed page limit; 2 MiB data budget | Full native control/keyboard acceptance; all page actions live coverage |
| Conditions | Six MZ slots, highest matching page, AND requirements; richer expressions preserved; dependency cache with bounded mutation history | Native selectors; advanced nested expression authoring and custom presenters implemented/tested |
| Appearance | None/profile picker, first-frame preview, priority and engine elevation/flying foldout | Native frame/face/tile selection and exact priority rendering |
| Movement | Fixed/random/approach/custom; partial routes and forced routes; source tests and dedicated dialogs | Jump and route codes41,43–45; visibility/opacity implemented; exact timing and runtime option override persistence |
| Triggers | Action/player-touch/event-touch/autorun/parallel; independent interpreters and serialized messages | Full native contact/retrigger/priority rules; parallel map transfer |
| Contents | Structural branches/choices/loops; copy/cut/paste/group selection/rebasing; dedicated dialogs | Drag editing and comprehensive native keyboard/context reference comparison |
| Drafts/persistence | Draft cancel, Apply staying open, undo/redo, map saving/JSON extension preservation; isolated playtests | Interpreter save-state completeness; template/Replace Event persistence |
| Room player | Source and live Chrome four WASD diagonals; live firing→S+D walking→idle | Native packaged acceptance |
| Party combat | Linked actor membership, allied targeting protection, companion attack fixtures | Actor database, spawn/follow, stats/equipment and complete travel persistence |

## Every command in the three-tab chooser

The generated CSV MZ-COMMAND-COVERAGE.csv records the same current registry. Dedicated dialogs retain extension data. Entries with no dialog/runtime stay disabled. Source or Chrome tests cover implemented subsets; exact native dialog layout/default/keyboard behavior is pending for every row.

| Tab | Category | Code | Command | Dialog | Runtime |
|---|---|---:|---|---|---|
| 1 | Message | 101 | Show Text | Dedicated dialog; native parity pending | speaker/background/window position implemented; faces and control codes pending |
| 1 | Message | 102 | Show Choices | Dedicated dialog; native parity pending | choice branching runtime implemented; complete native presentation parity pending |
| 1 | Message | 103 | Input Number | Dedicated dialog; native parity pending | number input implemented; native dialog layout/picker and controller parity pending |
| 1 | Message | 104 | Select Item | Pending | Pending |
| 1 | Message | 105 | Show Scrolling Text | Pending | Pending |
| 1 | Game Progression | 121 | Control Switches | Dedicated dialog; native parity pending | Registered; native parity pending |
| 1 | Game Progression | 122 | Control Variables | Dedicated dialog; native parity pending | all arithmetic with constant, variable and random operands implemented; Game Data/Script pending |
| 1 | Game Progression | 123 | Control Self Switch | Dedicated dialog; native parity pending | Registered; native parity pending |
| 1 | Game Progression | 124 | Control Timer | Dedicated dialog; native parity pending | Registered; native parity pending |
| 1 | Flow Control | 111 | Conditional Branch | Dedicated dialog; native parity pending | switch/variable/self-switch/party/item subtypes implemented; other subtypes pending |
| 1 | Flow Control | 112 | Loop | Direct insertion | Registered; native parity pending |
| 1 | Flow Control | 113 | Break Loop | Direct insertion | Registered; native parity pending |
| 1 | Flow Control | 115 | Exit Event Processing | Direct insertion | Registered; native parity pending |
| 1 | Flow Control | 117 | Common Event | Pending | Pending |
| 1 | Flow Control | 118 | Label | Dedicated dialog; native parity pending | Registered; native parity pending |
| 1 | Flow Control | 119 | Jump to Label | Dedicated dialog; native parity pending | Registered; native parity pending |
| 1 | Flow Control | 108 | Comment | Dedicated dialog; native parity pending | implemented (comments intentionally do not execute) |
| 1 | Party | 125 | Change Gold | Dedicated dialog; native parity pending | Registered; native parity pending |
| 1 | Party | 126 | Change Items | Dedicated dialog; native parity pending | inventory quantity execution implemented; item database picker pending |
| 1 | Party | 127 | Change Weapons | Pending | Pending |
| 1 | Party | 128 | Change Armors | Pending | Pending |
| 1 | Party | 129 | Change Party Member | Dedicated dialog; native parity pending | party membership implemented; actor initialization/database picker pending |
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
| 2 | Movement | 201 | Transfer Player | Dedicated dialog; native parity pending | main-event transfer and dedicated dialog implemented; parallel transfer pending |
| 2 | Movement | 202 | Set Vehicle Location | Pending | Pending |
| 2 | Movement | 203 | Set Event Location | Pending | Pending |
| 2 | Movement | 204 | Scroll Map | Pending | Pending |
| 2 | Movement | 205 | Set Movement Route | Dedicated dialog; native parity pending | forced routes implemented; complete native timing/target picker parity pending |
| 2 | Movement | 206 | Get on/off Vehicle | Pending | Pending |
| 2 | Character | 211 | Change Transparency | Dedicated dialog; native parity pending | player world-render visibility implemented; native dialog parity pending |
| 2 | Character | 216 | Change Player Followers | Pending | Pending |
| 2 | Character | 217 | Gather Followers | Pending | Pending |
| 2 | Character | 212 | Show Animation | Pending | Pending |
| 2 | Character | 213 | Show Balloon Icon | Pending | Pending |
| 2 | Character | 214 | Erase Event | Direct insertion | current-map-session erasure implemented; browser acceptance pending |
| 2 | Picture | 231 | Show Picture | Pending | Pending |
| 2 | Picture | 232 | Move Picture | Pending | Pending |
| 2 | Picture | 233 | Rotate Picture | Pending | Pending |
| 2 | Picture | 234 | Tint Picture | Pending | Pending |
| 2 | Picture | 235 | Erase Picture | Pending | Pending |
| 2 | Timing | 230 | Wait | Dedicated dialog; native parity pending | Registered; native parity pending |
| 2 | Screen | 221 | Fadeout Screen | Direct insertion | 24-frame screen fade/wait implemented; exact native rendering comparison pending |
| 2 | Screen | 222 | Fadein Screen | Direct insertion | 24-frame screen fade/wait implemented; exact native rendering comparison pending |
| 2 | Screen | 223 | Tint Screen | Dedicated dialog; native parity pending | GPU HSL desaturation/tone tween, duration/wait and dedicated dialog implemented; native defaults/layout comparison pending |
| 2 | Screen | 224 | Flash Screen | Dedicated dialog; native parity pending | flash color/duration/wait and dedicated dialog implemented; native dialog defaults/layout comparison pending |
| 2 | Screen | 225 | Shake Screen | Dedicated dialog; native parity pending | horizontal shake/duration/wait and dedicated dialog implemented; native layout/defaults comparison pending |
| 2 | Screen | 236 | Set Weather Effect | Pending | Pending |
| 2 | Audio & Video | 241 | Play BGM | Pending | Pending |
| 2 | Audio & Video | 242 | Fadeout BGM | Pending | Pending |
| 2 | Audio & Video | 243 | Save BGM | Pending | Pending |
| 2 | Audio & Video | 244 | Resume BGM | Pending | Pending |
| 2 | Audio & Video | 245 | Play BGS | Pending | Pending |
| 2 | Audio & Video | 246 | Fadeout BGS | Pending | Pending |
| 2 | Audio & Video | 249 | Play ME | Pending | Pending |
| 2 | Audio & Video | 250 | Play SE | Dedicated dialog; native parity pending | manifest-backed stereo SE playback and dedicated dialog implemented; native picker/layout comparison pending |
| 2 | Audio & Video | 251 | Stop SE | Direct insertion | stops pooled sound effects; no-parameter command |
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

## Transfer and screen behavior

201 resolves direct/variable operands at execution time using stable map IDs. Black/white fades last .4 seconds each; no-fade uses the same one-commit/one-resume contract. Same-map relocation retains the session. Continuations retain only the executing page/cursor/choice state and original map. Source ID collisions cannot replace the continuing command list. Self-switch branches/writes remain scoped to the origin; off-map event route lookup and erasure are skipped, player routes remain possible. Missing services reject before preceding effects. Missing/blocked/out-of-bounds destinations report failure. Parallel transfer is explicitly unsupported. Continuous coordinates are an engine extension; native MZ dialog parity and save-game interpreter adoption remain pending.

101 now carries independent text position/background and speaker into attached choices/number input. Blank speaker remains blank. Faces, control codes, pagination, sounds and exact window presentation remain pending. 221/222 use a separate screen brightness tween and .4-second interpreter wait, below dialogue/HUD. Scalar screen state is captured by runtime snapshots and restored across map travel; exported save/reload round-trip and malformed-state rejection pass.

## Evidence and performance

Full cached source suite passes at this checkpoint. Windows Chrome fixtures pass event-driven travel, chained/same-map transfer, parameter operands/extensions, combined text/choice presentation, fadeout/wait/fadein and fixed-room diagonals/fire-to-walk/idle. No native Windows0.15.9 executable test or Mac execution has been performed. Complete Windows/Mac browser distributions are not yet built.

Page cache uses event dependency keys, a fixed256-entry mutation ring and weak event ownership. Dynamic timer/spatial/custom conditions remain live; unrelated state mutations do not rescan static pages. PAGE-CACHE-BENCHMARK.json measures only selection, not complete game frame time. Replace Event/template reuse remains pending. Asset optimization is a staged proposal in ASSET-OPTIMIZATION-GUIDE.md, not an implemented optimization claim.
