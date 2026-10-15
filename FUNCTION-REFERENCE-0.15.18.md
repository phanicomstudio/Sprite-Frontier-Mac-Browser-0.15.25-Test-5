# Current function contracts — 0.15.18

October 9, 2026. Exact source comments, indexed at current locations. Earlier
FUNCTION-REFERENCE files remain intact as history. Coverage checks existence;
behavior tests and manual review check usefulness and accuracy.

### src/activity.js:6

@function activity.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier activity.

### src/activity.js:8

@function activity.cache.2 — Handles cache within activity. Inputs: game. Updates: c. Uses: caches get; dynamic push; buckets has; buckets set. Returns: c.

### src/activity.js:9

@function activity.query.3 — Finds records or geometry intersecting the requested region. Inputs: game; min x; min y; max x; max y; assignment pattern. Uses: cache; c buckets get; out push. Returns: out.

### src/activity.js:10

@function activity.actors.4 — Handles actors within activity. Inputs: game. Uses: cache; a list of spread element, spread element filter; game scene events or a list of filter. Returns: a list of spread element, spread element filter using a callback.

### src/activity.js:10

@function activity.callback.5 — Returns e combat. Inputs: e. Returns: e combat.

### src/activity.js:10

@function activity.callback.6 — Returns math hypot using e x minus p x, e y minus p y is at most math max using r reduced distance, root frontier parameters get using game source world, "aggroRange", root frontier parameters get using game source world, "aggroLeash" plus r hysteresis or e aggro. Inputs: e. Uses: root frontier parameters get. Returns: math hypot using e x minus p x, e y minus p y is at most math max using r reduced distance, root frontier parameters get using game source world, "aggroRange", root frontier parameters get using game source world, "aggroLeash" plus r hysteresis or e aggro.

### src/activity.js:11

@function activity.motionDelta.7 — Handles motion delta within activity. Inputs: game; event; page; dt. Updates: s; s tier; s pending. Uses: cache; states get; states set. Returns: dt; 0.

### src/actor-behavior.js:4

@function actor-behavior.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier actor behavior.

### src/actor-behavior.js:5

@function actor-behavior.defaults.2 — Returns a record containing mode, approach, speed, detectRange, chaseRange, homeRange, stopRange, wanderRadius. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing mode, approach, speed, detectRange, chaseRange, homeRange, stopRange, wanderRadius.

### src/actor-behavior.js:6

@function actor-behavior.validate.3 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Uses: defaults; root frontier event schema json; a list of "sentinel", "wander", "patrol" includes; error. Returns: v.

### src/actor-behavior.js:7

@function actor-behavior.update.4 — Advances this system using the current state and elapsed time. Inputs: e; page; dt; target; services; controllers. Updates: c; c goal; e x; e y; goal. Uses: controllers get; controllers set; phase; services bounds. Returns: without a result.

### src/actor-behavior.js:9

@function actor-behavior.phase.5 — Handles phase within actor behavior. Inputs: next. Updates: c phase. Uses: c trace push; c trace shift; services behavior trace.

### src/actor-behavior.js:17

@function actor-behavior.snapshots.6 — Captures the current collection of state records. Inputs: value; assignment pattern. Uses: array is array; error; value map. Returns: a list of ; value map using a callback.

### src/actor-behavior.js:17

@function actor-behavior.callback.7 — Provides the callback for value map. Inputs: v. Uses: ids has; number is integer; a list of "idle", "patrol", "wander", "chase" includes; error. Returns: a record containing id, page, phase, index, turn, home, goal.

### src/actor-behavior.js:17

@function actor-behavior.point.8 — Handles point within actor behavior. Inputs: p. Uses: number is finite; error. Returns: a record containing x, y.

### src/actor-behavior.js:18

@function actor-behavior.capture.9 — Handles capture within actor behavior. Inputs: events; controllers. Uses: events flat map. Returns: events flat map using a callback.

### src/actor-behavior.js:18

@function actor-behavior.callback.10 — Provides the callback for events flat map. Inputs: e. Uses: controllers get; e pages index of. Returns: chain and page is at least 0 selects a list of a record containing id, page, home, phase, index, turn, goal or a list of .

### src/actor-behavior.js:19

@function actor-behavior.bindings.11 — Handles bindings within actor behavior. Inputs: value; events; bounds. Uses: snapshots; events find; error. Returns: checked.

### src/actor-behavior.js:19

@function actor-behavior.callback.12 — Returns e id equals v id. Inputs: e. Returns: e id equals v id.

### src/actor-behavior.js:20

@function actor-behavior.restore.13 — Applies saved state to this system. Inputs: value; events; controllers; bounds. Uses: bindings; controllers set; events find.

### src/actor-behavior.js:20

@function actor-behavior.callback.14 — Returns e id equals v id. Inputs: e. Returns: e id equals v id.

### src/adapter.js:5

@function adapter.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf screen to iso; mf hit test; mf update aim; mf make frontier game.

### src/adapter.js:8

@function adapter.screenToIso.2 — Returns chain equals "fixed" selects frontier interior aim using game, mx, my or a record containing x, y. Inputs: game; mx; my. Uses: frontier interior aim. Returns: chain equals "fixed" selects frontier interior aim using game, mx, my or a record containing x, y.

### src/adapter.js:9

@function adapter.hitTest.3 — Returns null. Inputs: no explicit arguments; uses enclosing module state. Returns: null.

### src/adapter.js:10

@function adapter.updateAim.4 — Handles update aim within adapter. Inputs: game. Updates: game player facing x; game player facing y. Uses: frontier interior aim. Returns: without a result.

### src/adapter.js:16

@function adapter.makeFrontierGame.5 — Handles make frontier game within adapter. Inputs: world; log. Updates: game source world; game local player id; game players; game runtime; game ui. Uses: world objects map; structured clone; entities map; registry set. Returns: game.

### src/adapter.js:17

@function adapter.callback.6 — Returns a record containing copied fields, z, type, name, maxHp, hp, dead. Inputs: e. Uses: window frontier terrain height. Returns: a record containing copied fields, z, type, name, maxHp, hp, dead.

### src/adapter.js:25

@function adapter.callback.7 — Returns a list of e id, e. Inputs: e. Returns: a list of e id, e.

### src/adapter.js:53

@function adapter.emit.8 — Handles emit within adapter. Inputs: type; payload. Uses: game events push; game events shift.

### src/adapter.js:62

@function adapter.getCollisionZones.9 — Handles get collision zones within adapter. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element, spread element map; entities filter; game scene events or a list of filter. Returns: a list of spread element, spread element map using a callback.

### src/adapter.js:63

@function adapter.callback.10 — Returns the inverse of e dead. Inputs: e. Returns: the inverse of e dead.

### src/adapter.js:63

@function adapter.callback.11 — Returns the inverse of e dead and e solid or e combat. Inputs: e. Returns: the inverse of e dead and e solid or e combat.

### src/adapter.js:63

@function adapter.callback.12 — Returns a record containing id, x1, y1, x2, y2. Inputs: e. Returns: a record containing id, x1, y1, x2, y2.

### src/adapter.js:68

@function adapter.getBlockingPolygons.13 — Handles get blocking polygons within adapter. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of .

### src/adapter.js:72

@function adapter.addEntity.14 — Handles add entity within adapter. Inputs: map; e. Uses: entities push; registry set.

### src/adapter.js:79

@function adapter.updateWeaponHUD.15 — Handles update weapon hud within adapter. Inputs: no explicit arguments; uses enclosing module state.

### src/adapter.js:81

@function adapter.updateHover.16 — Handles update hover within adapter. Inputs: no explicit arguments; uses enclosing module state.

### src/aggro.js:4

@function aggro.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier aggro.

### src/aggro.js:6

@function aggro.enemies.2 — Handles enemies within aggro. Inputs: game. Uses: a list of spread element, spread element filter. Returns: a list of spread element, spread element filter using a callback.

### src/aggro.js:6

@function aggro.callback.3 — Returns e kind equals "monster". Inputs: e. Returns: e kind equals "monster".

### src/aggro.js:7

@function aggro.update.4 — Advances this system using the current state and elapsed time. Inputs: game; dt. Updates: e aggro; e aggro timer; active; game in combat. Uses: rule; root frontier activity actors; enemies; root frontier party combat target.

### src/aggro.js:9

@function aggro.rule.5 — Returns root frontier parameters get using game source world, name. Inputs: name. Uses: root frontier parameters get. Returns: root frontier parameters get using game source world, name.

### src/aggro.js:23

@function aggro.provoke.6 — Handles provoke within aggro. Inputs: game; id. Updates: e aggro; e aggro timer. Uses: game runtime entities get.

### src/app.js:5

@function app.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Updates: audio music; pause panel id; pause panel hidden; pause panel inner html; $ using "pauseResume" onclick. Uses: $; mf create frontier audio; frontier music create; document create element.

### src/app.js:7

@function app.$.2 — Handles $ within application input, simulation and editor coordination. Inputs: id. Uses: elements has; elements set; document get element by id; elements get. Returns: elements get using id.

### src/app.js:22

@function app.pauseOptions — Inputs: none. Shows options without unpausing and synchronizes existing volume/cursor controls; returns nothing.

### src/app.js:24

@function app.pauseBack — Inputs: none. Restores pause actions while keeping gameplay frozen; returns nothing.

### src/app.js:26

@function app.pauseSave — Inputs: none. Delegates to validated full playtest export; pause remains active and browser download owns file selection.

### src/app.js:28

@function app.pauseLoad — Inputs: none. Opens the existing playtest file picker; cancellation retains current state.

### src/app.js:30

@function app.pauseVolume — Inputs: none. Copies normalized 0..1 master gain to the shared control and updates percent; audio failure follows existing bridge.

### src/app.js:32

@function app.pauseHand — Inputs: none. Selects an existing preloaded hand and invokes its preference persistence; no asset duplication.

### src/app.js:34

@function app.onclick.3 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: capture look. Returns: capture look using .

### src/app.js:35

@function app.onclick.4 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "recoveryStatus" text content. Uses: keys clear; mouse reset; frontier player recovery recover; $.

### src/app.js:38

@function app.callback.5 — Provides the callback for frontier screen fade create. Inputs: amount. Updates: screen layer style opacity.

### src/app.js:39

@function app.callback.6 — Provides the callback for frontier screen flash create. Inputs: rgb; alpha. Updates: flash layer style background; flash layer style opacity. Uses: rgb join.

### src/app.js:40

@function app.callback.7 — Provides the callback for frontier screen shake create. Inputs: offset. Updates: view style transform.

### src/app.js:41

@function app.callback.8 — Returns frontier pixi set tone using value. Inputs: value. Uses: frontier pixi set tone. Returns: frontier pixi set tone using value.

### src/app.js:42

@function app.capture.9 — Returns frontier pixi capture using canvas. Inputs: canvas. Uses: frontier pixi capture. Returns: frontier pixi capture using canvas.

### src/app.js:43

@function app.transitionEffect1517 — Inputs: none. Returns cell-selected door/melt/fade/immediate mode, with reduced-motion preference forcing fade. No mutation; October 9 supersedes fade/melt-only selection above.

### src/app.js:44

@function app.doorSound — Inputs: name and gain 0–1. Returns bounded SE playback result; missing files are silent.

### src/app.js:44

@function app.doorError — Inputs: message. Displays resource failure without per-frame logging; returns nothing.

### src/app.js:45

@function app.destinationReady1517 — Inputs: transition job unused. Returns whether destination model textures are ready (or have explicitly failed). Starts each shared prepare once, and holds black during asynchronous decode.

### src/app.js:45

@function app.opacity.11 — Handles opacity within application input, simulation and editor coordination. Inputs: amount; color. Updates: fade layer style background; fade layer style opacity.

### src/app.js:45

@function app.commit.12 — Handles commit within application input, simulation and editor coordination. Inputs: t. Updates: travel cooldown. Uses: object assign; frontier terrain ground; journey set; capture runtime. Returns: without a result.

### src/app.js:45

@function app.complete.13 — Handles complete within application input, simulation and editor coordination. Inputs: t. Uses: session restore continuation.

### src/app.js:46

@function app.reserveEventTransfer.14 — Handles reserve event transfer within application input, simulation and editor coordination. Inputs: parameters; continuation. Updates: continuation origin map. Uses: frontier transfer player resolve; map library snapshot; scene transition reserve; transition effect. Returns: true.

### src/app.js:46

@function app.canStand.15 — Returns the inverse of frontier interior blocked using destination, x, y and the inverse of destination objects some using a callback and the inverse of destination events some using a callback. Inputs: destination; x; y. Uses: frontier interior blocked; destination objects some; destination events some. Returns: the inverse of frontier interior blocked using destination, x, y and the inverse of destination objects some using a callback and the inverse of destination events some using a callback.

### src/app.js:46

@function app.callback.16 — Returns math hypot using e x minus x, e y minus y is less than e radius plus 0.13. Inputs: e. Returns: math hypot using e x minus x, e y minus y is less than e radius plus 0.13.

### src/app.js:46

@function app.callback.17 — Provides the callback for destination events some. Inputs: e. Uses: frontier events active page. Returns: chain and the inverse of p through and p priority equals "normal" and math hypot using e x minus x, e y minus y is less than 0.55.

### src/app.js:49

@function app.captureRuntime.18 — Handles capture runtime within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event state capture; screen fade capture; screen flash capture; screen shake capture. Returns: a record containing copied fields, screenFade, screenFlash, screenShake, screenTone, behaviors, replacements, player.

### src/app.js:49

@function app.callback.19 — Returns a record containing id, x, y. Inputs: e. Returns: a record containing id, x, y.

### src/app.js:49

@function app.callback.20 — Returns e id does not equal "player". Inputs: e. Returns: e id does not equal "player".

### src/app.js:49

@function app.callback.21 — Returns a record containing id, x, y, hp, dead, gibbed. Inputs: e. Returns: a record containing id, x, y, hp, dead, gibbed.

### src/app.js:50

@function app.restoreRuntime.22 — Handles restore runtime within application input, simulation and editor coordination. Inputs: state; shared. Updates: session state self switches; event x; event y; game scene signature; session state at k. Uses: screen tone restore; screen shake restore; screen flash restore; screen fade restore.

### src/app.js:50

@function app.callback.23 — Returns v id equals e id. Inputs: v. Returns: v id equals e id.

### src/app.js:52

@function app.attemptTravel.24 — Handles attempt travel within application input, simulation and editor coordination. Inputs: exit. Updates: travel cooldown; pending travel. Uses: map library get; dest world interior entrances find; dest world travel entrances find; log. Returns: without a result; without a result.

### src/app.js:52

@function app.cellArrival — Inputs: arrival. Returns matching named doorway; no effects.

### src/app.js:52

@function app.callback.25 — Returns e id equals exit entrance. Inputs: e. Returns: e id equals exit entrance.

### src/app.js:52

@function app.callback.26 — Returns e id equals exit entrance. Inputs: e. Returns: e id equals exit entrance.

### src/app.js:52

@function app.callback.27 — Provides the callback for dest world events some. Inputs: e. Uses: frontier events active page. Returns: chain and the inverse of page through and page priority does not equal "below" and page priority does not equal "above" and math hypot using e x minus entry x, e y minus entry y is less than 0.55.

### src/app.js:52

@function app.callback.28 — Returns math hypot using e x minus entry x, e y minus entry y is less than e radius plus 0.13. Inputs: e. Returns: math hypot using e x minus entry x, e y minus entry y is less than e radius plus 0.13.

### src/app.js:53

@function app.journalEntry.29 — Handles journal entry within application input, simulation and editor coordination. Inputs: key; text. Uses: journal set; journal render.

### src/app.js:54

@function app.journalRender.30 — Handles journal render within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Updates: li text content. Uses: $; list replace children; journal values; document create element. Returns: without a result.

### src/app.js:56

@function app.toggleHolster.31 — Handles toggle holster within application input, simulation and editor coordination. Inputs: game; ui. Updates: game player facing x; game player facing y; game player movement facing. Uses: original holster.

### src/app.js:72

@function app.log.32 — Records a human-readable runtime message. Inputs: text. Updates: $ using "message" text content; $ using "descriptionScreen" text content; notice timer. Uses: $; clear timeout; set timeout.

### src/app.js:76

@function app.callback.33 — Provides the callback for set timeout. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "descriptionScreen" text content. Uses: $.

### src/app.js:83

@function app.ammo.34 — Clone the ammo prefab so separately placed boxes never share pages or command arrays. Inputs: id; x; y. Uses: structured clone. Returns: a record containing copied fields, id, x, y.

### src/app.js:90

@function app.generated.35 — Build the preset demonstration world and add authored conversation topics and terrain/sky defaults. Inputs: seed; assignment pattern; assignment pattern. Updates: result parameters; result music; result asset catalog; result cerebral; source name. Uses: frontier world generate; frontier parameters validate; frontier music validate; structured clone. Returns: result.

### src/app.js:93

@function app.callback.36 — Returns math hypot using e x minus source x, e y minus source y is greater than 2. Inputs: e. Returns: math hypot using e x minus source x, e y minus source y is greater than 2.

### src/app.js:95

@function app.callback.37 — Returns e name includes using "guide". Inputs: e. Uses: e name includes. Returns: e name includes using "guide".

### src/app.js:116

@function app.callback.38 — Returns math abs using e x minus cx is greater than 4 or math abs using e y minus cy is greater than 4. Inputs: e. Returns: math abs using e x minus cx is greater than 4 or math abs using e y minus cy is greater than 4.

### src/app.js:124

@function app.dialogue.39 — Handles dialogue within application input, simulation and editor coordination. Inputs: message. Updates: number input controller; $ using "dialogue" hidden; $ using "descriptionScreen" text content; $ using "descriptionScreen" scroll top; mouse paused. Uses: $; mouse reset; string; choices replace children. Returns: false; true.

### src/app.js:143

@function app.onclick.40 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: session choose. Returns: session choose using i.

### src/app.js:144

@function app.callback.41 — Returns session input number using value. Inputs: value. Uses: session input number. Returns: session input number using value.

### src/app.js:153

@function app.toggleHUD.42 — and simulation continue. Returning preserves the existing camera orientation. Inputs: no explicit arguments; uses enclosing module state. Updates: hud mode; $ using "inventoryPanel" hidden; drag; game pointer. Uses: $ using "gameFrame" class list toggle; $; keys clear; mouse reset. Returns: without a result.

### src/app.js:164

@function app.onchange.43 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier device hud skin; $. Returns: frontier device hud skin using $ using "hudSkin" value.

### src/app.js:167

@function app.inventoryToggle.44 — Remember whether gameplay owned mouse look before the inventory opened, then restore that mode on close. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "inventoryPanel" hidden; inventory resume; play paused; drag; mouse paused. Uses: $; keys clear; mouse reset; document exit pointer lock. Returns: without a result.

### src/app.js:181

@function app.onclick.45 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: inventory toggle; click feedback.

### src/app.js:182

@function app.onclick.46 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: click feedback; $; inventory toggle; toggle hud.

### src/app.js:189

@function app.journalToggle.47 — Handles journal toggle within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "journalPanel" hidden; play paused. Uses: $; keys clear; release look; journal render. Returns: without a result.

### src/app.js:190

@function app.callback.48 — Provides the callback for document add event listener. Inputs: e. Uses: e key to lower case; /INPUT|TEXTAREA|SELECT/ test; e prevent default; journal toggle.

### src/app.js:192

@function app.inventoryRender.49 — Render inventory values from runtime state; ammo is displayed from combat reserve/loaded counts. Inputs: no explicit arguments; uses enclosing module state. Updates: li text content. Uses: $; list replace children; a list of spread element filter; document create element.

### src/app.js:207

@function app.restart.51 — Stop old footsteps and create a fresh runtime copy. Authored world stays intact; switches, pickups and combat reset unless explicitly restored. Inputs: assignment pattern; assignment pattern. Updates: $ using "seed" value; $ using "mapWidth" value; $ using "mapHeight" value; $ using "inventoryPanel" hidden; $ using "journalPanel" hidden. Uses: $; map library remember; footsteps stop; music stop.

### src/app.js:230

@function app.bounds.52 — Calculates or applies the enclosing limits for this module’s data. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier world dimensions. Returns: frontier world dimensions using world.

### src/app.js:230

@function app.motionDelta.53 — Returns frontier activity motion delta using game, event, page. Inputs: event; page; dt. Uses: frontier activity motion delta. Returns: frontier activity motion delta using game, event, page.

### src/app.js:231

@function app.behaviorCanMove.54 — Handles behavior can move within application input, simulation and editor coordination. Inputs: event. Uses: game runtime entities get. Returns: the inverse of chain and the inverse of chain is greater than 0.

### src/app.js:231

@function app.behaviorTarget.55 — Handles behavior target within application input, simulation and editor coordination. Inputs: event; page; player. Uses: game runtime entities get; frontier party combat target. Returns: chain equals "monster" selects frontier party combat target using game, actor or player.

### src/app.js:231

@function app.playSE.56 — Returns phanicom se play event using sound, log. Inputs: sound. Uses: phanicom se play event. Returns: phanicom se play event using sound, log.

### src/app.js:231

@function app.stopSE.57 — Returns phanicom se stop using . Inputs: no explicit arguments; uses enclosing module state. Uses: phanicom se stop. Returns: phanicom se stop using .

### src/app.js:231

@function app.templateBank.58 — Returns map library template bank using . Inputs: no explicit arguments; uses enclosing module state. Uses: map library template bank. Returns: map library template bank using .

### src/app.js:231

@function app.resolveEntity.59 — Returns chain. Inputs: id. Uses: game runtime entities get. Returns: chain.

### src/app.js:231

@function app.screenFade.60 — Returns screen fade start using out. Inputs: out. Uses: screen fade start. Returns: screen fade start using out.

### src/app.js:231

@function app.screenFlash.61 — Returns screen flash start using color, frames. Inputs: color; frames. Uses: screen flash start. Returns: screen flash start using color, frames.

### src/app.js:231

@function app.screenShake.62 — Returns screen shake start using power, speed, frames. Inputs: power; speed; frames. Uses: screen shake start. Returns: screen shake start using power, speed, frames.

### src/app.js:231

@function app.screenTone.63 — Handles screen tone within application input, simulation and editor coordination. Inputs: tone; frames. Uses: frontier pixi tone supported; error; screen tone start.

### src/app.js:231

@function app.currentMap.64 — Returns active runtime map. Inputs: no explicit arguments; uses enclosing module state. Returns: active runtime map.

### src/app.js:231

@function app.selfSwitchMap.65 — Returns map equals active runtime map selects session state self switches or a new map. Inputs: map. Uses: journey get. Returns: map equals active runtime map selects session state self switches or a new map.

### src/app.js:231

@function app.setSelfSwitch.66 — Handles set self switch within application input, simulation and editor coordination. Inputs: map; key; value. Updates: saved self switches. Uses: session state self switches set; journey get; error; switches set.

### src/app.js:231

@function app.transferMap.67 — Returns attempt travel using a record containing map, entrance. Inputs: map; entrance. Uses: attempt travel. Returns: attempt travel using a record containing map, entrance.

### src/app.js:231

@function app.canStand.68 — Returns the inverse of blocked using x, y, 0.13. Inputs: x; y; id. Uses: blocked; game runtime entities get. Returns: the inverse of blocked using x, y, 0.13.

### src/app.js:232

@function app.item.69 — Handles item within application input, simulation and editor coordination. Inputs: id; amount. Updates: game player ammo reserve.

### src/app.js:263

@function app.preview.70 — Resolve event pages into scene entities and cache the result by page/position signature. Preserve damage state for existing IDs when a page changes. Inputs: no explicit arguments; uses enclosing module state. Updates: game party membership; game authoring; game selected id; game scene signature; game scene events. Uses: events map; events map using a callback join; events map using a callback filter. Returns: without a result; without a result.

### src/app.js:269

@function app.callback.71 — Returns editing selects event id equals chain selects math min using editor page index, event pages length minus 1 or 0 or session active page using event. Inputs: event. Uses: session active page. Returns: editing selects event id equals chain selects math min using editor page index, event pages length minus 1 or 0 or session active page using event.

### src/app.js:270

@function app.callback.72 — Returns event id plus ":" plus pages at i plus ":" plus event x plus ":" plus event y plus ":" plus event elevation or 0 plus ":" plus the inverse of the inverse of event transparent plus ":" plus event opacity or the fallback 255 plus ":" plus event mz or chain selects event walk time or 0 or "". Inputs: event; i. Returns: event id plus ":" plus pages at i plus ":" plus event x plus ":" plus event y plus ":" plus event elevation or 0 plus ":" plus the inverse of the inverse of event transparent plus ":" plus event opacity or the fallback 255 plus ":" plus event mz or chain selects event walk time or 0 or "".

### src/app.js:273

@function app.callback.73 — Provides the callback for events map. Inputs: event; i. Uses: phanicom abs parse event; game runtime entities get; frontier terrain height; world events find. Returns: null; entity.

### src/app.js:282

@function app.callback.74 — Returns e id equals event id. Inputs: e. Returns: e id equals event id.

### src/app.js:282

@function app.callback.75 — Returns e id equals event id. Inputs: e. Returns: e id equals event id.

### src/app.js:282

@function app.callback.76 — Returns p commands some using a callback. Inputs: p. Uses: p commands some. Returns: p commands some using a callback.

### src/app.js:282

@function app.callback.77 — Returns c type equals "giveItem" and c item equals "ammo9". Inputs: c. Returns: c type equals "giveItem" and c item equals "ammo9".

### src/app.js:293

@function app.mutate.78 — Handles mutate within application input, simulation and editor coordination. Inputs: action; callback. Updates: world; redo history; $ using "eventEditorStatus" text content; history. Uses: structured clone; history slice; redo history slice; action.

### src/app.js:314

@function app.moveObject.79 — Reject overlapping props and route movement through validated undoable mutation. Inputs: id; x; y. Uses: a list of spread element, spread element find; world objects some; log; mutate. Returns: without a result; without a result.

### src/app.js:315

@function app.callback.80 — Returns e id equals id. Inputs: e. Returns: e id equals id.

### src/app.js:317

@function app.callback.81 — Returns o id does not equal id and math hypot using o x minus x, o y minus y is less than o radius plus e radius. Inputs: o. Returns: o id does not equal id and math hypot using o x minus x, o y minus y is less than o radius plus e radius.

### src/app.js:321

@function app.callback.82 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e x; e y.

### src/app.js:328

@function app.remove.83 — Remove the selected authored object/event, reset selection, and rebuild preview. Inputs: id. Uses: mutate; editor choose; preview.

### src/app.js:329

@function app.callback.84 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world objects; world events. Uses: world objects filter; world events or a list of filter.

### src/app.js:330

@function app.callback.85 — Returns e id does not equal id. Inputs: e. Returns: e id does not equal id.

### src/app.js:331

@function app.callback.86 — Returns e id does not equal id. Inputs: e. Returns: e id does not equal id.

### src/app.js:338

@function app.mode.87 — Switch editor/playtest state, release capture and restart from authored data. F2 is the editor shortcut; Tab remains the HUD menu. Inputs: no explicit arguments; uses enclosing module state. Updates: editing; mouse paused; capture attempted; play paused; drag. Uses: mouse reset; document exit pointer lock; keys clear; $.

### src/app.js:356

@function app.blocked.88 — Test world bounds and solid footprints for NPC/editor movement. Player step/jump collision is handled by terrain.js. Inputs: x; y; assignment pattern; assignment pattern. Uses: frontier model collision blocked; frontier interior blocked; frontier activity query using game, x minus 2, y minus 2 some; frontier activity query. Returns: frontier model collision blocked using game, x, y or frontier interior blocked using world, x, y or x is less than 0.5 or y is less than 0.5 or x is greater than world width or the fallback world size minus 0.5 or y is greater than world height or the fallback world size minus 0.5 or frontier activity query using game, x minus 2, y minus 2 some using a callback or game scene events or a list of some using a callback.

### src/app.js:357

@function app.callback.89 — Returns e does not equal ignore and the inverse of e dead and math abs using e x minus x is less than e radius plus radius and math abs using e y minus y is less than e radius plus radius. Inputs: e. Returns: e does not equal ignore and the inverse of e dead and math abs using e x minus x is less than e radius plus radius and math abs using e y minus y is less than e radius plus radius.

### src/app.js:357

@function app.callback.90 — Returns e does not equal ignore and e solid and math abs using e x minus x is less than e radius plus radius and math abs using e y minus y is less than e radius plus radius. Inputs: e. Returns: e does not equal ignore and e solid and math abs using e x minus x is less than e radius plus radius and math abs using e y minus y is less than e radius plus radius.

### src/app.js:360

@function app.move.91 — Move one axis at a time to slide along blocking footprints. Inputs: e; dx; dy; radius; ignore. Updates: e x; e y. Uses: blocked.

### src/app.js:365

@function app.shoot.92 — Gate firing against editor, menu, event execution and death before calling the combat host. Inputs: no explicit arguments; uses enclosing module state. Updates: game room aim point. Uses: mf fire shot.

### src/app.js:369

@function app.screenPoint.93 — Convert CSS/browser coordinates into logical canvas pixels; do not mix client pixels with projected points. Inputs: event. Uses: view get bounding client rect. Returns: a record containing x, y.

### src/app.js:379

@function app.nearbyTarget.94 — Require P mode, a nearby projected target and a clear reach ray. World foot conversion is presentation only. Inputs: point. Uses: frontier render pick; session events find; frontier parameters get; mf frontier spatial sweep. Returns: null; null.

### src/app.js:382

@function app.callback.95 — Returns e id equals chain. Inputs: e. Returns: e id equals chain.

### src/app.js:400

@function app.clickFeedback.96 — Start the reachable event interact trigger; pickups are authored giveItem/self-switch commands. Inputs: no explicit arguments; uses enclosing module state. Uses: phanicom se play.

### src/app.js:401

@function app.interact.97 — Handles interact within application input, simulation and editor coordination. Inputs: point. Uses: nearby target; log; session start; click feedback. Returns: without a result; without a result.

### src/app.js:413

@function app.inspect.98 — Display authored inspection text in the HUD, with sensible fallback descriptions. Inputs: point. Uses: nearby target; log; click feedback. Returns: without a result; without a result.

### src/app.js:426

@function app.place.99 — Intersect a screen ray with terrain and delegate placement at the resulting world coordinates. Inputs: point. Uses: frontier render ground point; place at; log.

### src/app.js:432

@function app.placeAt.100 — Select, erase or instantiate an authored prop/event/ammo prefab within level bounds. Inputs: x; y. Uses: log; $; a list of spread element, spread element map using a callback sort; a list of spread element, spread element map. Returns: without a result; without a result.

### src/app.js:439

@function app.callback.101 — Returns a record containing e, d. Inputs: e. Returns: a record containing e, d.

### src/app.js:442

@function app.callback.102 — Returns a d minus b d. Inputs: a; b. Returns: a d minus b d.

### src/app.js:448

@function app.callback.103 — Returns t id equals selected. Inputs: t. Returns: t id equals selected.

### src/app.js:448

@function app.callback.104 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Uses: world events push; structured clone; world objects push; frontier world entity.

### src/app.js:455

@function app.callback.105 — Returns math hypot using e x minus x, e y minus y is less than 1.5. Inputs: e. Returns: math hypot using e x minus x, e y minus y is less than 1.5.

### src/app.js:460

@function app.callback.106 — Returns math hypot using o x minus x, o y minus y is less than o radius plus e radius. Inputs: o. Returns: math hypot using o x minus x, o y minus y is less than o radius plus e radius.

### src/app.js:464

@function app.callback.107 — Returns world objects push using e. Inputs: no explicit arguments; uses enclosing module state. Uses: world objects push. Returns: world objects push using e.

### src/app.js:472

@function app.world.108 — Returns world. Inputs: no explicit arguments; uses enclosing module state. Returns: world.

### src/app.js:472

@function app.templates.109 — Returns chain. Inputs: no explicit arguments; uses enclosing module state. Uses: map library snapshot. Returns: chain.

### src/app.js:472

@function app.saveTemplate.110 — Returns map library save template using name, event. Inputs: name; event. Uses: map library save template. Returns: map library save template using name, event.

### src/app.js:472

@function app.undoTemplate.111 — Returns map library undo template using . Inputs: no explicit arguments; uses enclosing module state. Uses: map library undo template. Returns: map library undo template using .

### src/app.js:472

@function app.redoTemplate.112 — Returns map library redo template using . Inputs: no explicit arguments; uses enclosing module state. Uses: map library redo template. Returns: map library redo template using .

### src/app.js:472

@function app.maps.113 — Returns chain or a list of . Inputs: no explicit arguments; uses enclosing module state. Uses: map library snapshot. Returns: chain or a list of .

### src/app.js:473

@function app.runtime.114 — Returns session debug using . Inputs: no explicit arguments; uses enclosing module state. Uses: session debug. Returns: session debug using .

### src/app.js:473

@function app.testEvent.115 — Handles test event within application input, simulation and editor coordination. Inputs: id. Updates: event test origin. Uses: mode; object assign; session events find; session start.

### src/app.js:473

@function app.callback.116 — Returns e id equals id. Inputs: e. Returns: e id equals id.

### src/app.js:474

@function app.returnEditor.117 — Handles return editor within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Updates: game player x; game player y; event test origin. Uses: mode; object assign.

### src/app.js:478

@function app.callback.118 — Provides the callback for view add event listener. Inputs: event. Uses: editor choose; frontier render pick; screen point; editor open event.

### src/app.js:479

@function app.onclick.119 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: world; history. Uses: confirm; generated; $; number. Returns: without a result; without a result.

### src/app.js:488

@function app.onchange.120 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: view width; game view width. Uses: $; document document element style set property.

### src/app.js:495

@function app.onclick.121 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: document exit fullscreen; $ using "viewport" request fullscreen; $; log.

### src/app.js:505

@function app.callback.122 — Provides the callback for document add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "fullscreen" text content. Uses: $.

### src/app.js:509

@function app.onclick.123 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: game camera first person; $ using "camera" text content. Uses: log; $. Returns: without a result.

### src/app.js:515

@function app.onchange.124 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:515

@function app.callback.125 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world terrain. Uses: $.

### src/app.js:522

@function app.onchange.126 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:522

@function app.callback.127 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world terrain. Uses: number; $.

### src/app.js:529

@function app.onchange.128 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:529

@function app.callback.129 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world sky. Uses: $.

### src/app.js:536

@function app.oninput.130 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: game camera height. Uses: number; $. Returns: assignment.

### src/app.js:537

@function app.onclick.131 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: world. Uses: redo history push; structured clone; history pop; restart.

### src/app.js:545

@function app.onclick.132 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: world. Uses: history push; structured clone; redo history pop; restart.

### src/app.js:546

@function app.onchange.133 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: log; $. Returns: log using "Scene tool: " plus $ using "sceneTool" selected options at 0 text content.

### src/app.js:547

@function app.onclick.134 — Responds to a button or clickable control. Inputs: event. Uses: $ using "map" get bounding client rect; $; place at. Returns: without a result.

### src/app.js:553

@function app.onclick.135 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: a href; a download. Uses: url create object url; json stringify; document create element; a click.

### src/app.js:561

@function app.callback.136 — Returns url revoke object url using url. Inputs: no explicit arguments; uses enclosing module state. Uses: url revoke object url. Returns: url revoke object url using url.

### src/app.js:565

@function app.onchange.137 — Applies a changed control value to its owning system. Inputs: event. Updates: world; $ using "seed" value; history; event target value. Uses: error; frontier world validate; json parse; f text. Returns: without a result.

### src/app.js:586

@function app.oncontextmenu.138 — Handles oncontextmenu within application input, simulation and editor coordination. Inputs: event. Uses: event prevent default; session cancel choice.

### src/app.js:587

@function app.onclick.139 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: mouse paused; capture attempted. Uses: session next; mouse reset.

### src/app.js:594

@function app.oninput.140 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Uses: audio set volume; number; $. Returns: audio set volume using number using $ using "volume" value.

### src/app.js:595

@function app.callback.141 — Returns audio unlock using catch using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: audio unlock using catch; audio unlock. Returns: audio unlock using catch using a callback.

### src/app.js:595

@function app.callback.142 — Provides the callback for audio unlock using catch. Inputs: no explicit arguments; uses enclosing module state.

### src/app.js:602

@function app.callback.143 — Returns audio unlock using catch using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: audio unlock using catch; audio unlock. Returns: audio unlock using catch using a callback.

### src/app.js:602

@function app.callback.144 — Provides the callback for audio unlock using catch. Inputs: no explicit arguments; uses enclosing module state.

### src/app.js:609

@function app.releaseLook.145 — Clear motion baselines/held input and relinquish pointer lock. Optional pause stops gameplay while a menu is open. Inputs: assignment pattern. Updates: mouse paused; capture attempted; play paused; drag. Uses: mouse reset; keys clear; document exit pointer lock.

### src/app.js:620

@function app.resumePause — Inputs: none. Clears simulation pause and held input, hides pause immediately; restores look only when gameplay owns it. Returns nothing; no camera changes. Busy dialogue retains released look.

### src/app.js:622

@function app.captureLook.146 — Acquire look only in gameplay. Preserve yaw/pitch and reset mouse deltas so restoring capture cannot snap the view. Inputs: no explicit arguments; uses enclosing module state. Updates: mouse paused; play paused; capture attempted; game pointer. Uses: $; mouse reset; view focus; audio unlock using catch. Returns: without a result.

### src/app.js:633

@function app.callback.147 — Provides the callback for audio unlock using catch. Inputs: no explicit arguments; uses enclosing module state.

### src/app.js:638

@function app.callback.148 — Provides the callback for request catch. Inputs: no explicit arguments; uses enclosing module state. Uses: log.

### src/app.js:648

@function app.rotate.149 — Apply mouse sensitivity and bounded pitch. Keep limits consistent with gamepad input and framing tests. Inputs: dx; dy. Updates: game camera yaw; game camera pitch. Uses: frontier parameters get; clamp pitch. Returns: without a result.

### src/app.js:654

@function app.form.150 — Returns /INPUT|SELECT|TEXTAREA|BUTTON/ test using event target tag name. Inputs: event. Uses: /INPUT|SELECT|TEXTAREA|BUTTON/ test. Returns: /INPUT|SELECT|TEXTAREA|BUTTON/ test using event target tag name.

### src/app.js:655

@function app.callback.151 — Provides the callback for document add event listener. Inputs: event. Updates: $ using "weaponProfile" value. Uses: number input controller key; event key to lower case; event prevent default; event stop propagation. Returns: without a result; without a result.

### src/app.js:685

@function app.callback.152 — Returns keys delete using event key to lower case using . Inputs: event. Uses: keys delete; event key to lower case. Returns: keys delete using event key to lower case using .

### src/app.js:686

@function app.callback.153 — Returns release look using . Inputs: no explicit arguments; uses enclosing module state. Uses: release look. Returns: release look using .

### src/app.js:687

@function app.hubWorld — Inputs: none. Returns live authored world, no effects.

### src/app.js:687

@function app.hubGame — Inputs: none. Returns live runtime; no effects.

### src/app.js:687

@function app.hubSession — Inputs: none. Returns event session; no effects.

### src/app.js:687

@function app.hubState — Inputs: none. Returns session-owned compact store; no effects.

### src/app.js:687

@function app.hubMap — Inputs: none. Returns stable active cell ID; no effects.

### src/app.js:687

@function app.hubMaps — Inputs: none. Returns copied project snapshot; authoring synchronization is owned by map library.

### src/app.js:687

@function app.hubEditor — Inputs: none. Returns existing undo/draft event editor.

### src/app.js:687

@function app.hubTemplates — Inputs: none. Returns copied reusable bank.

### src/app.js:687

@function app.hubTemplateBank — Inputs: none. Returns compiled immutable bank.

### src/app.js:687

@function app.hubPause — Inputs: pause flag. Releases look and gates simulation while storage is open; returning leaves mouse released.

### src/app.js:687

@function app.hubPreview — Inputs: door configuration. Runs isolated presentation without transfer.

### src/app.js:689

@function app.hubToolAction — Inputs: click unused. Opens on-demand authoring/diagnostic UI; errors shown once.

### src/app.js:690

@function app.world.154 — Returns world. Inputs: no explicit arguments; uses enclosing module state. Returns: world.

### src/app.js:690

@function app.editor.155 — Returns editor. Inputs: no explicit arguments; uses enclosing module state. Returns: editor.

### src/app.js:690

@function app.editing.156 — Returns editing. Inputs: no explicit arguments; uses enclosing module state. Returns: editing.

### src/app.js:691

@function app.callback.157 — Returns event prevent default using . Inputs: event. Uses: event prevent default. Returns: event prevent default using .

### src/app.js:692

@function app.callback.158 — Returns mouse reset using . Inputs: no explicit arguments; uses enclosing module state. Uses: mouse reset. Returns: mouse reset using .

### src/app.js:693

@function app.callback.159 — Provides the callback for view add event listener. Inputs: no explicit arguments; uses enclosing module state. Uses: mouse reset.

### src/app.js:700

@function app.suppressMiddle.160 — Handles suppress middle within application input, simulation and editor coordination. Inputs: event. Updates: drag. Uses: event prevent default; event stop immediate propagation; keys clear; mouse reset. Returns: without a result.

### src/app.js:702

@function app.callback.161 — Provides the callback for view add event listener. Inputs: event. Updates: game pointer; drag; drag brush; drag point handled. Uses: screen point; view focus; $; frontier render pick. Returns: without a result; without a result.

### src/app.js:727

@function app.callback.162 — Provides the callback for view add event listener. Inputs: event. Updates: game pointer; game brush ghost; drag moved; game drag ghost; drag x. Uses: view get bounding client rect; screen point; mouse motion; rotate. Returns: without a result; without a result.

### src/app.js:754

@function app.callback.163 — Provides the callback for view add event listener. Inputs: event. Updates: drag; game drag ghost. Uses: terrain tools end; screen point; move object; $. Returns: without a result; without a result.

### src/app.js:773

@function app.callback.164 — Returns e id equals chain. Inputs: e. Returns: e id equals chain.

### src/app.js:778

@function app.callback.165 — Provides the callback for view add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: drag; game drag ghost. Uses: terrain tools end.

### src/app.js:785

@function app.callback.166 — Provides the callback for document add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: drag; mouse paused; capture attempted. Uses: keys clear; mouse reset.

### src/app.js:799

@function app.callback.167 — Provides the callback for document add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: mouse paused. Uses: log.

### src/app.js:806

@function app.callback.168 — Provides the callback for view add event listener. Inputs: event. Updates: game camera room zoom; game camera distance. Uses: event prevent default; frontier parameters get. Returns: without a result; without a result.

### src/app.js:817

@function app.update.169 — Ordered simulation: poll input → pause gate → locomotion/ground → events → combat/effects → NPC attacks. dt is seconds and capped by frame(). Inputs: dt. Updates: pending travel; travel cooldown; game elapsed; pads; $ using "controllerStatus" text content. Uses: screen fade update; screen flash update; screen shake update; screen tone update. Returns: without a result; without a result.

### src/app.js:883

@function app.callback.170 — Returns x is less than 0.5 or y is less than 0.5 or x is greater than world width or the fallback world size minus 0.5 or y is greater than world height or the fallback world size minus 0.5. Inputs: x; y. Returns: x is less than 0.5 or y is less than 0.5 or x is greater than world width or the fallback world size minus 0.5 or y is greater than world height or the fallback world size minus 0.5.

### src/app.js:883

@function app.callback.171 — Returns frontier terrain blocked using game, x, y. Inputs: x; y; r. Uses: frontier terrain blocked. Returns: frontier terrain blocked using game, x, y.

### src/app.js:939

@function app.callback.172 — Returns assignment is greater than 0. Inputs: e. Updates: e life. Returns: assignment is greater than 0.

### src/app.js:950

@function app.frame.173 — Browser animation clock. Draw world/HUD every visible frame; slower DOM labels update at 10Hz. Never reset camera to open/close a menu. Inputs: time. Updates: last; pause panel hidden; game next minimap; reticle style left; reticle style top. Uses: phanicom se begin frame; request animation frame; update; music update. Returns: without a result; without a result.

### src/app.js:989

@function app.openMenu.174 — Remember previous look ownership and freeze simulation before exposing cursor controls. Inputs: id. Updates: menu resume; $ using id hidden. Uses: release look; $.

### src/app.js:995

@function app.closeMenu.175 — Restore the previous gameplay/HUD mode without changing camera orientation. Inputs: id. Updates: $ using id hidden; play paused. Uses: $; capture look.

### src/app.js:1000

@function app.callback.176 — Returns a new option. Inputs: array pattern. Returns: a new option.

### src/app.js:1001

@function app.onchange.177 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: world weapon spreads; weapon spread value. Uses: number; frontier weapon tuning validate; map library remember; log.

### src/app.js:1004

@function app.onchange.178 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: phanicom abs equip; $; view focus; log.

### src/app.js:1010

@function app.onchange.179 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: phanicom blood set player type; $. Returns: phanicom blood set player type using $ using "bloodType" value.

### src/app.js:1011

@function app.onclick.180 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: phanicom blood spray character. Returns: phanicom blood spray character using game player, a record containing count.

### src/app.js:1015

@function app.onclick.181 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: $ using "openMuzzle" click; $. Returns: $ using "openMuzzle" click using .

### src/app.js:1016

@function app.onclick.182 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: open menu; $ using "muzzleFrame" content window post message; $; frontier muzzle export.

### src/app.js:1024

@function app.onclick.183 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: close menu. Returns: close menu using "muzzlePanel".

### src/app.js:1026

@function app.applyMuzzles.184 — Validate profiles before replacing them and persist a convenience copy locally. Export JSON for portable saves. Inputs: data. Uses: frontier muzzle load; local storage set item; json stringify; frontier muzzle export.

### src/app.js:1035

@function app.callback.185 — Provides the callback for window add event listener. Inputs: event. Uses: $; apply muzzles; log.

### src/app.js:1046

@function app.onchange.186 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: apply muzzles; json parse; $ using "muzzleImport" files at 0 text; $.

### src/app.js:1057

@function app.onclick.187 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: ask event. Uses: nearby target; session events filter using a callback sort; session events filter; log. Returns: without a result.

### src/app.js:1061

@function app.callback.188 — Returns chain and math hypot using e x minus game player x, e y minus game player y is at most e range. Inputs: e. Returns: chain and math hypot using e x minus game player x, e y minus game player y is at most e range.

### src/app.js:1061

@function app.callback.189 — Returns math hypot using a x minus game player x, a y minus game player y minus math hypot using b x minus game player x, b y minus game player y. Inputs: a; b. Returns: math hypot using a x minus game player x, a y minus game player y minus math hypot using b x minus game player x, b y minus game player y.

### src/app.js:1071

@function app.onclick.190 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: close menu. Returns: close menu using "askPanel".

### src/app.js:1072

@function app.onsubmit.191 — Handles onsubmit within application input, simulation and editor coordination. Inputs: event. Uses: event prevent default; log; frontier parser ask; $.

### src/app.js:1078

@function app.download.192 — Create a temporary JSON download URL and revoke it after the browser starts the download. Inputs: data; name. Updates: a href; a download. Uses: document create element; url create object url; json stringify; a click.

### src/app.js:1086

@function app.callback.193 — Returns url revoke object url using a href. Inputs: no explicit arguments; uses enclosing module state. Uses: url revoke object url. Returns: url revoke object url using a href.

### src/app.js:1089

@function app.onclick.194 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: journey set; capture runtime; download; map library snapshot.

### src/app.js:1098

@function app.onchange.195 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: world; active runtime map; game player holstered; game death mode; session state at key. Uses: $; error; frontier save validate; json parse. Returns: without a result.

### src/app.js:1106

@function app.callback.196 — Returns state screen tone and state screen tone value some using a callback or state screen tone elapsed is less than state screen tone duration and state screen tone target some using a callback. Inputs: array pattern. Uses: state screen tone value some; state screen tone target some. Returns: state screen tone and state screen tone value some using a callback or state screen tone elapsed is less than state screen tone duration and state screen tone target some using a callback.

### src/app.js:1106

@function app.callback.197 — Returns v does not equal 0. Inputs: v. Returns: v does not equal 0.

### src/app.js:1106

@function app.callback.198 — Returns v does not equal 0. Inputs: v. Returns: v does not equal 0.

### src/app.js:1145

@function app.clampPitch.199 — same validated/undoable mutation path as other editor changes. Inputs: value. Uses: frontier parameters get. Returns: math max using frontier parameters get using world, "aimMin" multiplied by math pi divided by 180, math min using frontier parameters get using world, "aimMax" multiplied by math pi divided by 180, value.

### src/app.js:1149

@function app.cerebralRefresh.200 — Handles cerebral refresh within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "cerebral-" plus k value; $ using "cerebral-threshold" plus i value; $ using "melee-" plus k value. Uses: $.

### src/app.js:1150

@function app.parametersRefresh.201 — Handles parameters refresh within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "vectorPreset" value; $ using "vectorSprites" value; $ using "vectorTextures" value; $ using "vectorEnabled" checked; $ using "vectorMono" checked. Uses: cerebral refresh; $; object keys; frontier parameters get.

### src/app.js:1157

@function app.onclick.202 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:1157

@function app.callback.203 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world cerebral. Uses: frontier cerebral validate; number; $; a list of 0, 1, 2 map.

### src/app.js:1157

@function app.callback.204 — Returns number using $ using "cerebral-threshold" plus i value. Inputs: i. Uses: number; $. Returns: number using $ using "cerebral-threshold" plus i value.

### src/app.js:1157

@function app.callback.205 — Returns a list of k, a list of "name", "spriteProfile" includes using k selects $ using "melee-" plus k value or number using $ using "melee-" plus k value. Inputs: k. Uses: a list of "name", "spriteProfile" includes; $; number. Returns: a list of k, a list of "name", "spriteProfile" includes using k selects $ using "melee-" plus k value or number using $ using "melee-" plus k value.

### src/app.js:1158

@function app.onclick.206 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: game player cerebral.

### src/app.js:1159

@function app.onclick.207 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: game player cerebral.

### src/app.js:1160

@function app.onclick.208 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:1160

@function app.callback.209 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e cerebral source. Uses: world objects find; error.

### src/app.js:1160

@function app.callback.210 — Returns e id equals $ using "selection" value. Inputs: e. Uses: $. Returns: e id equals $ using "selection" value.

### src/app.js:1161

@function app.world.211 — Returns world. Inputs: no explicit arguments; uses enclosing module state. Returns: world.

### src/app.js:1161

@function app.generate.212 — Returns generated using $ using "seed" value or "PHANICOM", number using $ using "mapWidth" value, number using $ using "mapHeight" value. Inputs: no explicit arguments; uses enclosing module state. Uses: generated; $; number. Returns: generated using $ using "seed" value or "PHANICOM", number using $ using "mapWidth" value, number using $ using "mapHeight" value.

### src/app.js:1161

@function app.replace.213 — Handles replace within application input, simulation and editor coordination. Inputs: next; options. Updates: drag; world; $ using "seed" value; $ using "mapWidth" value; $ using "mapHeight" value. Uses: terrain tools end; keys clear; mouse reset; $.

### src/app.js:1162

@function app.world.214 — Returns world. Inputs: no explicit arguments; uses enclosing module state. Returns: world.

### src/app.js:1162

@function app.game.215 — Returns game. Inputs: no explicit arguments; uses enclosing module state. Returns: game.

### src/app.js:1162

@function app.maps.216 — Returns map library snapshot using maps. Inputs: no explicit arguments; uses enclosing module state. Uses: map library snapshot. Returns: map library snapshot using maps.

### src/app.js:1162

@function app.active.217 — Returns map library active. Inputs: no explicit arguments; uses enclosing module state. Returns: map library active.

### src/app.js:1162

@function app.editing.218 — Returns editing. Inputs: no explicit arguments; uses enclosing module state. Returns: editing.

### src/app.js:1163

@function app.world.219 — Returns world. Inputs: no explicit arguments; uses enclosing module state. Returns: world.

### src/app.js:1164

@function app.world.220 — Returns world. Inputs: no explicit arguments; uses enclosing module state. Returns: world.

### src/app.js:1164

@function app.choose.221 — Returns editor choose using id. Inputs: id. Uses: editor choose. Returns: editor choose using id.

### src/app.js:1164

@function app.refresh.222 — Handles refresh within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Uses: restart.

### src/app.js:1165

@function app.onclick.223 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:1165

@function app.callback.224 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world parameters; game camera pitch. Uses: frontier parameters validate; object from entries; object keys using frontier parameters fields map; object keys.

### src/app.js:1165

@function app.callback.225 — Returns a list of key, number using $ using "parameter-" plus key value. Inputs: key. Uses: number; $. Returns: a list of key, number using $ using "parameter-" plus key value.

### src/app.js:1166

@function app.onclick.226 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:1166

@function app.callback.227 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world parameters. Uses: frontier parameters validate.

### src/app.js:1167

@function app.onclick.228 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:1167

@function app.callback.229 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world width; world height; world size; world grid spacing. Uses: number; $.

### src/app.js:1168

@function app.onclick.230 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:1168

@function app.callback.231 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world activity. Uses: frontier world activity settings; object from entries; a list of "activeDistance", "reducedDistance", "reducedInterval", "hysteresis" map.

### src/app.js:1168

@function app.callback.232 — Returns a list of name, number using $ using "activity-" plus name value. Inputs: name. Uses: number; $. Returns: a list of name, number using $ using "activity-" plus name value.

### src/app.js:1169

@function app.onclick.233 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:1169

@function app.callback.234 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world vector display. Uses: frontier vector validate; $; number.

### src/app.js:1171

@function app.onchange.235 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: $ using "applyVector" onclick; $. Returns: $ using "applyVector" onclick using .

### src/app.js:1172

@function app.onchange.236 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:1172

@function app.callback.237 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world vector display. Uses: frontier vector validate; $.

### src/app.js:1173

@function app.onclick.238 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:1173

@function app.callback.239 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world vector display. Uses: frontier vector validate.

### src/app.js:1174

@function app.onclick.240 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:1174

@function app.callback.241 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world fog. Uses: frontier fog validate; $; number.

### src/app.js:1175

@function app.callback.242 — Returns e name. Inputs: e. Returns: e name.

### src/app.js:1176

@function app.onclick.243 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: audio unlock using then; audio unlock.

### src/app.js:1176

@function app.callback.244 — Provides the callback for audio unlock using then. Inputs: no explicit arguments; uses enclosing module state. Uses: $; phanicom se play; number.

### src/app.js:1177

@function app.onclick.245 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:1177

@function app.callback.246 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world click feedback. Uses: $; number.

### src/app.js:1178

@function app.onclick.247 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/app.js:1178

@function app.callback.248 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world asset catalog; world music. Uses: frontier music picker catalog; frontier music validate; lines; number.

### src/app.js:1178

@function app.lines.249 — Returns $ using id value split using /\n/ map using a callback filter using boolean. Inputs: id. Uses: $ using id value split using /\n/ map using a callback filter; $ using id value split using /\n/ map; $ using id value split; $. Returns: $ using id value split using /\n/ map using a callback filter using boolean.

### src/app.js:1178

@function app.callback.250 — Returns s trim using . Inputs: s. Uses: s trim. Returns: s trim using .

### src/asset-style.js:4

@function asset-style.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier asset style.

### src/asset-style.js:5

@function asset-style.image.2 — Handles image within asset style. Inputs: source; settings; treatment. Updates: variants; c width; c height; edge; pixels data at i plus 3. Uses: cache get; cache set; variants has; variants get. Returns: source; variants get using key.

### src/audio.js:5

@function audio.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf plugins; mf create frontier audio.

### src/audio.js:11

@function audio.register.2 — Handles register within audio. Inputs: plugin. Uses: registry set.

### src/audio.js:17

@function audio.createAudio.3 — Own shared audio context and bridge synth footsteps into the native game services. Inputs: no explicit arguments; uses enclosing module state. Uses: root phanicom se set unlock. Returns: audio.

### src/audio.js:20

@function audio.unlock.4 — Handles unlock within audio. Inputs: no explicit arguments; uses enclosing module state. Updates: context; master; sfx; master gain value; sfx gain value. Uses: context create gain; sfx connect; master connect; audio music unlock. Returns: without a result.

### src/audio.js:37

@function audio.setVolume.5 — Handles set volume within audio. Inputs: value. Updates: master gain value. Uses: audio music set volume; root phanicom se set volume; root phanicom combat core set volume.

### src/audio.js:46

@function audio.playAt.6 — Handles play at within audio. Inputs: name; x; y; assignment pattern. Uses: root phanicom se play. Returns: chain.

### src/audio.js:56

@function audio.claimFootsteps.7 — Handles claim footsteps within audio. Inputs: id. Updates: owner. Returns: false; true.

### src/audio.js:61

@function audio.releaseFootsteps.8 — Handles release footsteps within audio. Inputs: id. Updates: owner.

### src/audio.js:65

@function audio.synthSweep.9 — Handles synth sweep within audio. Inputs: opts. Updates: osc type; osc onended. Uses: context create oscillator; context create gain; osc frequency set value at time; osc frequency exponential ramp to value at time. Returns: false; true.

### src/audio.js:79

@function audio.onended.10 — Cleans up or advances audio state when playback finishes. Inputs: no explicit arguments; uses enclosing module state. Uses: osc disconnect; gain disconnect.

### src/audio.js:87

@function audio.start.11 — Handles start within audio. Inputs: game; log. Uses: registry get; plugin hooks start. Returns: a record containing update, stop.

### src/audio.js:100

@function audio.update.12 — Advances this system using the current state and elapsed time. Inputs: dt. Uses: plugin hooks update.

### src/audio.js:103

@function audio.stop.13 — Handles stop within audio. Inputs: no explicit arguments; uses enclosing module state. Uses: plugin hooks stop.

### src/audio.js:111

@function audio.callback.14 — Returns audio unlock using . Inputs: no explicit arguments; uses enclosing module state. Uses: audio unlock. Returns: audio unlock using .

### src/behavior-dialog.js:2

@function behavior-dialog.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier behavior dialog.

### src/behavior-dialog.js:2

@function behavior-dialog.open.2 — Handles open within behavior dialog. Inputs: value; accept. Updates: d id; d class name; d inner html; l text content; mode value. Uses: structured clone; frontier actor behavior defaults; document create element; mode append.

### src/behavior-dialog.js:2

@function behavior-dialog.field.3 — Handles field within behavior dialog. Inputs: key; label; assignment pattern. Updates: l text content; input type; input step; input checked; input value. Uses: document create element; l append; d append.

### src/behavior-dialog.js:3

@function behavior-dialog.callback.4 — Returns p x plus ", " plus p y. Inputs: p. Returns: p x plus ", " plus p y.

### src/behavior-dialog.js:3

@function behavior-dialog.callback.5 — Returns d close using . Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using .

### src/behavior-dialog.js:3

@function behavior-dialog.callback.6 — Provides the callback for the enclosing behavior dialog operation. Inputs: no explicit arguments; uses enclosing module state. Updates: next at k; error text content. Uses: points value trim; points value trim using split using /\n/ map; points value trim using split; object entries.

### src/behavior-dialog.js:3

@function behavior-dialog.callback.7 — Provides the callback for points value trim using split using /\n/ map. Inputs: line. Uses: line split; error; number. Returns: a record containing x, y.

### src/behavior-dialog.js:3

@function behavior-dialog.callback.8 — Returns d remove using . Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using .

### src/cerebral.js:3

@function cerebral.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier cerebral.

### src/cerebral.js:5

@function cerebral.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: number is finite; error; array is array; r thresholds some. Returns: a record containing max, thresholds, amount, interval, radius, transition, melee.

### src/cerebral.js:7

@function cerebral.callback.3 — Returns the inverse of number is finite using n or n is less than 0 or n is greater than 100. Inputs: n. Uses: number is finite. Returns: the inverse of number is finite using n or n is less than 0 or n is greater than 100.

### src/cerebral.js:7

@function cerebral.callback.4 — Returns i and n is at least r thresholds at i minus 1. Inputs: n; i. Returns: i and n is at least r thresholds at i minus 1.

### src/cerebral.js:10

@function cerebral.band.5 — Handles band within cerebral. Inputs: value; max; thresholds. Returns: pct is at most thresholds at 2 selects 3 or pct is at most thresholds at 1 selects 2 or pct is at most thresholds at 0 selects 1 or 0.

### src/cerebral.js:13

@function cerebral.update.6 — re-entering starts a full interval, avoiding invisible distant damage. Inputs: game; dt. Updates: p cerebral; game cerebral timers; elapsed. Uses: root frontier activity query; active add; game cerebral timers get; game cerebral timers set. Returns: without a result.

### src/cerebral.js:15

@function cerebral.configure.7 — Starter melee uses the same ported hit/arc/cooldown logic as other profiles. Inputs: game. Updates: game player cerebral. Uses: root phanicom abs weapons get; root phanicom abs weapons set; structured clone.

### src/condition-editor.js:4

@function condition-editor.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier condition editor.

### src/condition-editor.js:5

@function condition-editor.register.2 — Handles register within condition editor. Inputs: type; presenter; create. Updates: labels at type. Uses: presenters has; root frontier conditions types using includes; root frontier conditions types; error.

### src/condition-editor.js:6

@function condition-editor.defaults.3 — Handles defaults within condition editor. Inputs: type. Uses: presenters get using type create; presenters get. Returns: a record containing all, any, not, compare, switch, selfSwitch, item, actor at type or chain.

### src/condition-editor.js:7

@function condition-editor.open.4 — Handles open within condition editor. Inputs: initial; accept. Updates: d id; d class name; title text content; status role; d onclose. Uses: root frontier conditions validate; defaults; document create element; d append.

### src/condition-editor.js:8

@function condition-editor.button.5 — Handles button within condition editor. Inputs: parent; text; fn. Updates: b type; b text content; b onclick. Uses: document create element; parent append. Returns: b.

### src/condition-editor.js:9

@function condition-editor.select.6 — Handles select within condition editor. Inputs: parent; label; options; value; change. Updates: l text content; s value; s onchange. Uses: document create element; s set attribute; s append; string. Returns: s.

### src/condition-editor.js:9

@function condition-editor.onchange.7 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: change. Returns: change using s value.

### src/condition-editor.js:10

@function condition-editor.input.8 — Handles input within condition editor. Inputs: parent; label; value; change; assignment pattern. Updates: l text content; i type; i value; i step; i oninput. Uses: document create element; i set attribute; l append; parent append. Returns: i.

### src/condition-editor.js:10

@function condition-editor.oninput.9 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Uses: change. Returns: change using numeric selects + i value or i value.

### src/condition-editor.js:11

@function condition-editor.mutate.10 — Handles mutate within condition editor. Inputs: fn. Updates: status text content; draft. Uses: structured clone; fn; root frontier conditions validate; render.

### src/condition-editor.js:12

@function condition-editor.scalar.11 — Handles scalar within condition editor. Inputs: parent; label; object; key. Uses: document create element; wrap append; object assign; parent append.

### src/condition-editor.js:12

@function condition-editor.callback.12 — Provides the callback for select. Inputs: type. Updates: object at key. Uses: render.

### src/condition-editor.js:12

@function condition-editor.callback.13 — Returns assignment. Inputs: v. Updates: object at key. Returns: assignment.

### src/condition-editor.js:12

@function condition-editor.callback.14 — Returns assignment. Inputs: v. Updates: object at key. Returns: assignment.

### src/condition-editor.js:13

@function condition-editor.operand.15 — Handles operand within condition editor. Inputs: parent; label; object; key. Uses: document create element; box append; object assign; parent append.

### src/condition-editor.js:13

@function condition-editor.callback.16 — Provides the callback for select. Inputs: kind. Updates: object at key. Uses: render.

### src/condition-editor.js:13

@function condition-editor.callback.17 — Returns assignment. Inputs: x. Updates: v key. Returns: assignment.

### src/condition-editor.js:14

@function condition-editor.node.18 — Handles node within condition editor. Inputs: parent; e; replace; path. Updates: box dataset condition path; note text content; box query selector using "select" disabled. Uses: document create element; parent append; select; object entries.

### src/condition-editor.js:14

@function condition-editor.callback.19 — Returns mutate using a callback. Inputs: type. Uses: mutate. Returns: mutate using a callback.

### src/condition-editor.js:14

@function condition-editor.callback.20 — Returns replace using a record containing copied fields, copied fields. Inputs: no explicit arguments; uses enclosing module state. Uses: replace; defaults; structured clone. Returns: replace using a record containing copied fields, copied fields.

### src/condition-editor.js:15

@function condition-editor.callback.21 — Provides the callback for e children for each. Inputs: child; i. Uses: document create element; box append; node; button.

### src/condition-editor.js:15

@function condition-editor.callback.22 — Returns assignment. Inputs: v. Updates: e children at i. Returns: assignment.

### src/condition-editor.js:15

@function condition-editor.callback.23 — Returns mutate using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/condition-editor.js:15

@function condition-editor.callback.24 — Returns e children splice using i, 1. Inputs: no explicit arguments; uses enclosing module state. Uses: e children splice. Returns: e children splice using i, 1.

### src/condition-editor.js:15

@function condition-editor.callback.25 — Returns mutate using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/condition-editor.js:15

@function condition-editor.callback.26 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: array pattern.

### src/condition-editor.js:15

@function condition-editor.callback.27 — Returns mutate using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback.

### src/condition-editor.js:15

@function condition-editor.callback.28 — Returns e children push using defaults using "switch". Inputs: no explicit arguments; uses enclosing module state. Uses: e children push; defaults. Returns: e children push using defaults using "switch".

### src/condition-editor.js:16

@function condition-editor.callback.29 — Returns assignment. Inputs: v. Updates: e child. Returns: assignment.

### src/condition-editor.js:17

@function condition-editor.callback.30 — Returns assignment. Inputs: v. Updates: e operator. Returns: assignment.

### src/condition-editor.js:18

@function condition-editor.callback.31 — Returns a list of v, v. Inputs: v. Returns: a list of v, v.

### src/condition-editor.js:18

@function condition-editor.callback.32 — Returns assignment. Inputs: v. Updates: e key. Returns: assignment.

### src/condition-editor.js:18

@function condition-editor.callback.33 — Returns assignment. Inputs: v. Updates: e key. Returns: assignment.

### src/condition-editor.js:18

@function condition-editor.callback.34 — Returns assignment. Inputs: v. Updates: e count. Returns: assignment.

### src/condition-editor.js:18

@function condition-editor.callback.35 — Returns assignment. Inputs: v. Updates: e value. Returns: assignment.

### src/condition-editor.js:19

@function condition-editor.callback.36 — Returns assignment. Inputs: v. Updates: e key. Returns: assignment.

### src/condition-editor.js:19

@function condition-editor.callback.37 — Returns assignment. Inputs: v. Updates: e operator. Returns: assignment.

### src/condition-editor.js:19

@function condition-editor.callback.38 — Returns assignment. Inputs: v. Updates: e value. Returns: assignment.

### src/condition-editor.js:20

@function condition-editor.callback.39 — Returns assignment. Inputs: v. Updates: e key. Returns: assignment.

### src/condition-editor.js:20

@function condition-editor.callback.40 — Returns assignment. Inputs: v. Updates: e value. Returns: assignment.

### src/condition-editor.js:21

@function condition-editor.callback.41 — Returns assignment. Inputs: v. Updates: e target. Returns: assignment.

### src/condition-editor.js:21

@function condition-editor.callback.42 — Returns assignment. Inputs: v. Updates: e radius. Returns: assignment.

### src/condition-editor.js:22

@function condition-editor.callback.43 — Returns assignment. Inputs: v. Updates: e at key. Returns: assignment.

### src/condition-editor.js:22

@function condition-editor.callback.44 — Returns assignment. Inputs: v. Updates: e operator. Returns: assignment.

### src/condition-editor.js:24

@function condition-editor.render.45 — Builds or refreshes the visible representation of this system. Inputs: no explicit arguments; uses enclosing module state. Uses: tree replace children; node.

### src/condition-editor.js:24

@function condition-editor.callback.46 — Returns assignment. Inputs: v. Updates: draft. Returns: assignment.

### src/condition-editor.js:24

@function condition-editor.callback.47 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: status text content. Uses: accept; root frontier conditions validate; d close.

### src/condition-editor.js:24

@function condition-editor.callback.48 — Returns d close using . Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using .

### src/condition-editor.js:24

@function condition-editor.onclose.49 — Releases or restores dialog state after closing. Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using .

### src/cursor.js:4

@function cursor.callback.1 — Provides the callback for a callback. Inputs: root. Updates: image id; image alt; image hidden; select value; cross checked. Uses: document get element by id; document create element; document get element by id using "viewport" append; pairs set.

### src/cursor.js:10

@function cursor.callback.2 — Provides the callback for a list of "A", "B" map. Inputs: state. Updates: img src. Uses: encode uricomponent. Returns: img.

### src/cursor.js:13

@function cursor.refresh.3 — Handles refresh within cursor. Inputs: no explicit arguments; uses enclosing module state. Updates: image src; image hidden. Uses: pairs get; frame class list toggle.

### src/cursor.js:14

@function cursor.onchange.4 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: local storage set item; refresh.

### src/cursor.js:15

@function cursor.onchange.5 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: local storage set item; string.

### src/cursor.js:17

@function cursor.menuMove — Inputs: pointer event in client pixels. Moves preloaded hand over open menu/dialog controls; toggles visibility on entry/exit, no asset loads.

### src/cursor.js:18

@function cursor.callback.6 — Provides the callback for frame add event listener. Inputs: e. Updates: inside; image style left; image style top.

### src/cursor.js:19

@function cursor.callback.7 — Provides the callback for frame add event listener. Inputs: e. Updates: inside; image style left; image style top. Uses: refresh.

### src/cursor.js:20

@function cursor.callback.8 — Provides the callback for frame add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: inside. Uses: refresh.

### src/cursor.js:21

@function cursor.callback.9 — Provides the callback for document add event listener. Inputs: e. Updates: buttons. Uses: refresh.

### src/cursor.js:22

@function cursor.callback.10 — Provides the callback for document add event listener. Inputs: e. Updates: buttons. Uses: refresh.

### src/cursor.js:23

@function cursor.reset.11 — Handles reset within cursor. Inputs: no explicit arguments; uses enclosing module state. Updates: buttons. Uses: refresh.

### src/cursor.js:23

@function cursor.callback.12 — Provides the callback for document add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: inside. Uses: frame matches; refresh.

### src/cursor.js:24

@function cursor.update.13 — Advances this system using the current state and elapsed time. Inputs: point mode; unarmed; editing; assignment pattern. Updates: enabled; buttons; reticle hidden. Uses: frame class list toggle; refresh.

### src/device-hud.js:4

@function device-hud.callback.1 — Provides the callback for a callback. Inputs: root. Updates: el dataset module; bar class name; bar text content; min text content; min title. Uses: document get element by id; face get context; a list of 1, 2, 3 map; weights slice.

### src/device-hud.js:6

@function device-hud.callback.2 — Returns "img/portraits/sanity/Sanity Level " plus n plus ".png". Inputs: n. Returns: "img/portraits/sanity/Sanity Level " plus n plus ".png".

### src/device-hud.js:7

@function device-hud.callback.3 — Provides the callback for paths map. Inputs: path. Updates: image onload; image src. Returns: image.

### src/device-hud.js:7

@function device-hud.onload.4 — Processes a resource after it finishes loading. Inputs: no explicit arguments; uses enclosing module state. Updates: dirty. Returns: assignment.

### src/device-hud.js:8

@function device-hud.update.5 — Advances this system using the current state and elapsed time. Inputs: game. Updates: last time; last world; weights; weights at band; progress. Uses: frontier cerebral band; performance now; weights slice; from map.

### src/device-hud.js:11

@function device-hud.callback.6 — Returns v multiplied by 1 minus t plus i equals band selects t or 0. Inputs: v; i. Returns: v multiplied by 1 minus t plus i equals band selects t or 0.

### src/device-hud.js:18

@function device-hud.onclick.7 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: min text content. Uses: el class list toggle; el class list contains.

### src/device-hud.js:18

@function device-hud.onpointerdown.8 — Begins the pointer-driven interaction. Inputs: e. Updates: drag. Uses: document get element by id using "gameFrame" class list contains; document get element by id; e prevent default; el get bounding client rect. Returns: without a result.

### src/device-hud.js:18

@function device-hud.onpointermove.9 — Updates the active pointer-driven interaction. Inputs: e. Updates: el style left; el style top; el style right; el style bottom. Uses: document get element by id using "gameFrame" get bounding client rect; document get element by id. Returns: without a result.

### src/device-hud.js:18

@function device-hud.onpointercancel.10 — Cancels the active pointer-driven interaction. Inputs: no explicit arguments; uses enclosing module state. Updates: drag. Returns: assignment.

### src/device-hud.js:20

@function device-hud.skin.11 — Handles skin within device hud. Inputs: no explicit arguments; uses enclosing module state.

### src/directions.js:5

@function directions.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier directions.

### src/directions.js:9

@function directions.select.2 — Quantize facing relative to camera into a metadata row, then choose idle or walking animation column. Inputs: entity; camera yaw; spec; camera. Returns: a record containing row, column.

### src/door-audio.js:3

@function doorAudio.install — Inputs: root browser global. Exposes a small selector; returns nothing, allocates no audio voices and performs no playback.

### src/door-audio.js:6

@function doorAudio.select — Inputs: phase open/close/creak; setting with mode random/manual/none and optional name; random unit-interval generator. Returns a manifest name or null for silence/invalid input. Has no side effects beyond consuming one random value. Call once at a phase boundary; manual names must exist in the manifest.

### src/door-audio.js:9

@function doorAudio.manualExists — Inputs: manifest entry. Returns whether its name matches the requested manual sound; no side effects.

### src/door-transition.js:4

@function door-transition.install — Inputs: root namespace. Installs validation, timeline and presentation factories. Returns nothing; creates no canvases until requested.

### src/door-transition.js:7

@function door-transition.number — Inputs: value, fallback and allowed numeric range. Returns finite value or fallback; throws outside range. Units belong to the requesting field. No mutation.

### src/door-transition.js:9

@function door-transition.vector — Inputs: optional three-component vector and fallback. Returns copied finite vector; throws for malformed values. World/local units depend on field.

### src/door-transition.js:11

@function door-transition.sound — Inputs: optional sound choice. Returns normalized random/manual/none choice with gain 0–1. Throws invalid mode/name; missing resources produce silence at playback.

### src/door-transition.js:13

@function door-transition.validate — Inputs: optional door composition. Returns JSON-safe normalized copy; rejects invalid timing/assets/nodes or more than two moving leaves. Hinges use engine Z-up degrees/sec; slides use local world units/sec.

### src/door-transition.js:19

@function door-transition.singularScale — Inputs: local scale component. Returns whether zero/near-zero would collapse geometry; no effects.

### src/door-transition.js:19

@function door-transition.normalizedSlide — Inputs: direction component. Returns unit-vector component so distance is in actual world units.

### src/door-transition.js:25

@function door-transition.axisRotation — Inputs: nonzero local hinge axis and degrees. Returns a column-major rotation matrix using normalized axis. No mutation; used only for visual transition meshes, not world collision.

### src/door-transition.js:27

@function door-transition.duration — Inputs: normalized leaf. Returns motion time in seconds; hinged degrees/s or sliding units/s. No state changes.

### src/door-transition.js:29

@function door-transition.timeline — Inputs: validated configuration, elapsed seconds. Returns phase, progress and each leaf's opening fraction. Does not mutate config. Unequal leaves finish before passage; synchronized leaves share the longest duration.

### src/door-transition.js:31

@function door-transition.create — Inputs: canvas host, sound playback and diagnostic callbacks. Returns begin/update/end/preview operations. Uses a reusable 640x480 canvas; geometry and textures decode once. Errors are reported and propagate for transfer fallback.

### src/door-transition.js:34

@function door-transition.asset — Inputs: shared asset ID. Returns decoded asset or throws unavailable ID. Built-in GLB decodes once outside the project library, so it is not duplicated in every project save.

### src/door-transition.js:34

@function door-transition.byte — Inputs: base64-decoded character. Returns its byte code; no effects.

### src/door-transition.js:36

@function door-transition.begin — Inputs: optional configuration. Validates and prepares all resources before starting; returns nothing. Throws unavailable node/assets. Clears stale phase cues and reveals black-backed canvas.

### src/door-transition.js:36

@function door-transition.nodeExists — Inputs: mesh instance. Returns whether requested node matches; no mutation.

### src/door-transition.js:38

@function door-transition.cue — Inputs: phase key. Chooses one sound per boundary and sends it to bounded engine playback. Missing/none cues are silent; no audio objects allocated here.

### src/door-transition.js:40

@function door-transition.draw — Inputs: timeline state. Renders selected frame/leaves against black space with private local animation matrices. Returns nothing. Camera advances toward then through doorway; closing happens behind a black cover.

### src/door-transition.js:42

@function door-transition.meshInstance — Inputs: shared instance. Returns requested node match; no effects.

### src/door-transition.js:42

@function door-transition.inversePivot — Inputs: pivot component. Returns negative local component; no effects.

### src/door-transition.js:42

@function door-transition.slideComponent — Inputs: local direction component. Returns scaled slide distance in world units; no effects.

### src/door-transition.js:46

@function door-transition.update — Inputs: elapsed seconds. Advances presentation once, emits opening/closing cues at boundaries, returns true when complete. Rendering failures propagate; caller must end and fall back.

### src/door-transition.js:48

@function door-transition.end — Inputs: none. Stops preview frame scheduling, hides canvas and clears preview ownership; returns nothing. Does not commit any map.

### src/door-transition.js:50

@function door-transition.preview — Inputs: configuration. Runs presentation without changing maps; returns nothing. Errors report and close; scheduling is canceled by end.

### src/door-transition.js:50

@function door-transition.previewFrame — Inputs: browser timestamp milliseconds. Advances bounded seconds; returns nothing. Stops on completion/failure, without changing gameplay.

### src/editor-tools.js:5

@function editor-tools.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier editor tools.

### src/editor-tools.js:6

@function editor-tools.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: api. Updates: box id; box inner html; ground text content; ground picker id; ground picker onchange. Uses: $ using "sceneTool" closest; $; document create element; ground picker append. Returns: a record containing begin, move, end, refresh, select, active.

### src/editor-tools.js:7

@function editor-tools.$.3 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id.

### src/editor-tools.js:9

@function editor-tools.callback.4 — Returns a category equals "ground". Inputs: a. Returns: a category equals "ground".

### src/editor-tools.js:9

@function editor-tools.callback.5 — Returns a new option. Inputs: a. Returns: a new option.

### src/editor-tools.js:9

@function editor-tools.onchange.6 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback.

### src/editor-tools.js:9

@function editor-tools.callback.7 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: w ground material. Uses: api world.

### src/editor-tools.js:11

@function editor-tools.callback.8 — Returns "<label>" plus label plus "<input id=\"water-" plus k plus "\" type=\"number\" min=\"" plus min plus "\" max=\"" plus max plus "\" step=\"0.01\"></label>". Inputs: array pattern. Returns: "<label>" plus label plus "<input id=\"water-" plus k plus "\" type=\"number\" min=\"" plus min plus "\" max=\"" plus max plus "\" step=\"0.01\"></label>".

### src/editor-tools.js:11

@function editor-tools.callback.9 — Returns "<label>" plus label plus "<input id=\"water-" plus k plus "\" type=\"number\" min=\"" plus min plus "\" max=\"" plus max plus "\" step=\"0.001\"></label>". Inputs: array pattern. Returns: "<label>" plus label plus "<input id=\"water-" plus k plus "\" type=\"number\" min=\"" plus min plus "\" max=\"" plus max plus "\" step=\"0.001\"></label>".

### src/editor-tools.js:12

@function editor-tools.callback.10 — Returns "<label>" plus label plus "<input id=\"flight-" plus k plus "\" type=\"number\" step=\"0.1\"></label>". Inputs: array pattern. Returns: "<label>" plus label plus "<input id=\"flight-" plus k plus "\" type=\"number\" step=\"0.1\"></label>".

### src/editor-tools.js:13

@function editor-tools.onclick.11 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback.

### src/editor-tools.js:13

@function editor-tools.callback.12 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: w water. Uses: api world; frontier water validate; $; number.

### src/editor-tools.js:15

@function editor-tools.callback.13 — Returns a list of k, number using $ using "water-" plus k value. Inputs: k. Uses: number; $. Returns: a list of k, number using $ using "water-" plus k value.

### src/editor-tools.js:20

@function editor-tools.onclick.14 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback.

### src/editor-tools.js:20

@function editor-tools.callback.15 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: w terrain edits; w water; w terrain edits at x plus "," plus y; w water cells at x plus "," plus y; w terrain revision. Uses: api world; frontier water pool heights; frontier water validate; frontier terrain base height.

### src/editor-tools.js:29

@function editor-tools.onclick.16 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback.

### src/editor-tools.js:29

@function editor-tools.callback.17 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: api world using flight. Uses: api world; frontier flight validate; $; object from entries.

### src/editor-tools.js:31

@function editor-tools.callback.18 — Returns a list of k, number using $ using "flight-" plus k value. Inputs: k. Uses: number; $. Returns: a list of k, number using $ using "flight-" plus k value.

### src/editor-tools.js:38

@function editor-tools.onchange.19 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: reader onload. Uses: $; reader read as data url. Returns: without a result.

### src/editor-tools.js:39

@function editor-tools.onload.20 — Processes a resource after it finishes loading. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback.

### src/editor-tools.js:39

@function editor-tools.callback.21 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: api world using water. Uses: api world; frontier water validate.

### src/editor-tools.js:49

@function editor-tools.refresh.22 — Rebuild editor inputs from authored data after undo/import/restart. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "groundMaterial" value; $ using "libraryType" value; $ using "underwaterEnabled" checked; $ using "waterLevel" value; $ using "waterColor" value. Uses: $; api world; $ using "libraryType" replace children; a list of a record containing id, name, kind, a record containing id, name, kind, a record containing id, name, kind, a record containing id, name, kind map.

### src/editor-tools.js:64

@function editor-tools.callback.23 — Returns a new option. Inputs: t. Returns: a new option.

### src/editor-tools.js:64

@function editor-tools.callback.24 — Returns o value equals old. Inputs: o. Returns: o value equals old.

### src/editor-tools.js:67

@function editor-tools.callback.25 — Returns a new option. Inputs: e. Returns: a new option.

### src/editor-tools.js:69

@function editor-tools.callback.26 — Returns o value equals w texture. Inputs: o. Returns: o value equals w texture.

### src/editor-tools.js:71

@function editor-tools.stamp.27 — Handles stamp within editor tools. Inputs: p; assignment pattern. Uses: number; $; frontier brush paint; api world.

### src/editor-tools.js:75

@function editor-tools.begin.28 — Snapshot a brush stroke before any preview mutation. Inputs: p. Updates: stroke. Uses: structured clone; api world; stamp. Returns: false; true.

### src/editor-tools.js:85

@function editor-tools.move.29 — Distance-based interpolated stamps avoid gaps on fast mouse drags. Inputs: p. Updates: stroke last. Uses: stamp. Returns: without a result; without a result.

### src/editor-tools.js:92

@function editor-tools.end.30 — Roll preview back first, then commit via the shared validated undo path. Inputs: assignment pattern. Updates: stroke. Uses: api world; structured clone; object assign; api mutate. Returns: false; true.

### src/editor-tools.js:96

@function editor-tools.callback.31 — Returns object assign using api world using , after. Inputs: no explicit arguments; uses enclosing module state. Uses: object assign; api world. Returns: object assign using api world using , after.

### src/editor-tools.js:101

@function editor-tools.callback.32 — Returns o value equals "place". Inputs: o. Returns: o value equals "place".

### src/editor-tools.js:104

@function editor-tools.onclick.33 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "sceneTool" value. Uses: $.

### src/editor-tools.js:108

@function editor-tools.onclick.34 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback.

### src/editor-tools.js:108

@function editor-tools.callback.35 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: event id; event name; event x; event y; event sprite profile. Uses: api world; $ using "typeName" value trim; $; error.

### src/editor-tools.js:109

@function editor-tools.callback.36 — Returns e id equals $ using "selection" value. Inputs: e. Uses: $. Returns: e id equals $ using "selection" value.

### src/editor-tools.js:109

@function editor-tools.callback.37 — Returns t name equals name. Inputs: t. Returns: t name equals name.

### src/editor-tools.js:120

@function editor-tools.callback.38 — Returns t name does not equal name. Inputs: t. Returns: t name does not equal name.

### src/editor-tools.js:123

@function editor-tools.onclick.39 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: $; api choose; $ using "openEventEditor" click.

### src/editor-tools.js:129

@function editor-tools.onclick.40 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback.

### src/editor-tools.js:129

@function editor-tools.callback.41 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e vector treatment. Uses: a list of spread element, spread element find; api world; error; $.

### src/editor-tools.js:130

@function editor-tools.callback.42 — Returns e id equals $ using "selection" value. Inputs: e. Uses: $. Returns: e id equals $ using "selection" value.

### src/editor-tools.js:138

@function editor-tools.callback.43 — Returns chain equals "Combat testing". Inputs: el. Uses: el query selector. Returns: chain equals "Combat testing".

### src/editor-tools.js:147

@function editor-tools.select.44 — Handles select within editor tools. Inputs: tab. Updates: selected; $ using "sceneTool" value. Uses: end; object entries; el class list toggle; btn set attribute.

### src/editor-tools.js:151

@function editor-tools.onclick.45 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: select. Returns: select using tab.

### src/editor-tools.js:154

@function editor-tools.active.46 — Returns $ using "sceneTool" value equals "brush". Inputs: no explicit arguments; uses enclosing module state. Uses: $. Returns: $ using "sceneTool" value equals "brush".

### src/editor-workbench.js:4

@function editor-workbench.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier workbench.

### src/editor-workbench.js:5

@function editor-workbench.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: object pattern. Updates: dialog id; dialog inner html; advanced inner html; $ using "eventPage" closest using "label" hidden; options inner html. Uses: document create element; document body append; $; $ using "eventProperties" append. Returns: a record containing open, resetSelection, advanceSelection, selectedIndex.

### src/editor-workbench.js:6

@function editor-workbench.$.3 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id.

### src/editor-workbench.js:18

@function editor-workbench.tabs.4 — Handles tabs within editor workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: b text content; b onclick. Uses: selected; $ using "eventTabs" replace children; $; chain or a list of entries.

### src/editor-workbench.js:18

@function editor-workbench.onclick.5 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: set page; tabs.

### src/editor-workbench.js:19

@function editor-workbench.debug.6 — Handles debug within editor workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "eventDebugger" text content. Uses: $; api runtime; json stringify. Returns: without a result.

### src/editor-workbench.js:20

@function editor-workbench.open.7 — Handles open within editor workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: inspector hidden; timer. Uses: selected; refresh; tabs; dialog show modal. Returns: without a result.

### src/editor-workbench.js:21

@function editor-workbench.close.8 — Handles close within editor workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: timer. Uses: dialog close; clear interval.

### src/editor-workbench.js:22

@function editor-workbench.callback.9 — Provides the callback for dialog add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: timer. Uses: clear interval.

### src/editor-workbench.js:24

@function editor-workbench.callback.10 — Provides the callback for $ using "commandList" add event listener. Inputs: event. Updates: command selection. Uses: event target closest; a list of spread element index of; $; row class list toggle. Returns: without a result.

### src/editor-workbench.js:25

@function editor-workbench.onclick.11 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: page clipboard. Uses: structured clone; selected; page.

### src/editor-workbench.js:26

@function editor-workbench.onclick.12 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "eventEditorStatus" text content. Uses: selected; structured clone; candidate pages splice; page. Returns: without a result; without a result.

### src/editor-workbench.js:26

@function editor-workbench.callback.13 — Returns e pages splice using page using plus 1, 0, structured clone using page clipboard. Inputs: no explicit arguments; uses enclosing module state. Uses: e pages splice; page; structured clone. Returns: e pages splice using page using plus 1, 0, structured clone using page clipboard.

### src/editor-workbench.js:26

@function editor-workbench.callback.14 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Uses: set page; page; tabs.

### src/editor-workbench.js:27

@function editor-workbench.resetSelection.15 — Handles reset selection within editor workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: command selection. Uses: $; row class list remove.

### src/editor-workbench.js:28

@function editor-workbench.onclick.16 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "eventEditorStatus" text content; command clipboard. Uses: selected; page; a list of "else", "end" includes; $. Returns: without a result; without a result.

### src/editor-workbench.js:29

@function editor-workbench.onclick.17 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: selected; page; api mutate. Returns: without a result.

### src/editor-workbench.js:29

@function editor-workbench.callback.18 — Returns p commands splice using command selection is less than 0 selects p commands length or command selection, 0, spread element. Inputs: no explicit arguments; uses enclosing module state. Uses: p commands splice; structured clone. Returns: p commands splice using command selection is less than 0 selects p commands length or command selection, 0, spread element.

### src/editor-workbench.js:30

@function editor-workbench.onclick.19 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: return button hidden. Uses: selected; close; api test event.

### src/editor-workbench.js:31

@function editor-workbench.onclick.20 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: return button hidden; $ using "eventDebugger" text content. Uses: api runtime; api return editor; open; $.

### src/editor-workbench.js:34

@function editor-workbench.templateList.21 — Handles template list within editor workbench. Inputs: no explicit arguments; uses enclosing module state. Uses: $ using "eventTemplates" replace children; $; templates map.

### src/editor-workbench.js:34

@function editor-workbench.callback.22 — Returns a new option. Inputs: e; i. Uses: string. Returns: a new option.

### src/editor-workbench.js:35

@function editor-workbench.onclick.23 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "eventEditorStatus" text content; templates at prior. Uses: selected; templates find index; $; structured clone. Returns: without a result; without a result.

### src/editor-workbench.js:35

@function editor-workbench.callback.24 — Returns t name equals e name. Inputs: t. Returns: t name equals e name.

### src/editor-workbench.js:36

@function editor-workbench.onclick.25 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: e id; e x. Uses: $; structured clone; number; crypto random uuid. Returns: without a result; without a result.

### src/editor-workbench.js:36

@function editor-workbench.callback.26 — Returns api world using events push using e. Inputs: no explicit arguments; uses enclosing module state. Uses: api world using events push; api world. Returns: api world using events push using e.

### src/editor-workbench.js:36

@function editor-workbench.callback.27 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Uses: choose; open.

### src/editor-workbench.js:37

@function editor-workbench.advanceSelection.28 — Handles advance selection within editor workbench. Inputs: count. Updates: command selection. Uses: a list of spread element entries; $; row class list toggle.

### src/editor-workbench.js:37

@function editor-workbench.selectedIndex.29 — Returns command selection. Inputs: no explicit arguments; uses enclosing module state. Returns: command selection.

### src/editor.js:5

@function editor.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier editor.

### src/editor.js:7

@function editor.$.2 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id.

### src/editor.js:9

@function editor.create.3 — Construct isolated editor/event state through the caller services. Inputs: api. Updates: api; $ using "selection" onchange; $ using "eventPage" onchange; $ using "applyPosition" onclick; $ using "deleteSelected" onclick. Uses: $; fields; frontier workbench create; $ using "eventWorkbench" add event listener. Returns: a record containing openEvent, beginEvent, duplicateEvent, deleteEvent, choose, refresh, selected, selectedId.

### src/editor.js:11

@function editor.world.4 — Returns draft world or authored api world using . Inputs: no explicit arguments; uses enclosing module state. Uses: authored api world. Returns: draft world or authored api world using .

### src/editor.js:11

@function editor.preview.5 — Handles preview within editor. Inputs: no explicit arguments; uses enclosing module state. Uses: authored api preview.

### src/editor.js:11

@function editor.mutate.6 — Handles mutate within editor. Inputs: action; callback. Updates: draft world; draft valid; $ using "eventEditorStatus" text content. Uses: authored api mutate; structured clone; action; frontier world validate. Returns: authored api mutate using action, callback.

### src/editor.js:13

@function editor.selected.7 — Returns a list of spread element, spread element find using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element, spread element find; api world. Returns: a list of spread element, spread element find using a callback.

### src/editor.js:13

@function editor.callback.8 — Returns e id equals selected id. Inputs: e. Returns: e id equals selected id.

### src/editor.js:15

@function editor.resetCommand.9 — Exit command-edit mode and rebuild input fields with defaults. Inputs: no explicit arguments; uses enclosing module state. Updates: command index; $ using "addCommand" text content. Uses: $; fields.

### src/editor.js:21

@function editor.choose.10 — Change selection and reset page/command editing to avoid applying controls to the wrong event. Inputs: id. Updates: selected id; page index. Uses: workbench reset selection; reset command; refresh; api preview.

### src/editor.js:30

@function editor.refresh.11 — Rebuild forms from authored data; use textContent for user text and keep selection/page indices in range. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "selection" value; $ using "objectX" value; $ using "objectY" value; $ using "objectElevation" value; $ using "openEventEditor" disabled. Uses: api world; $ using "selection" replace children; $; all map. Returns: without a result.

### src/editor.js:32

@function editor.callback.12 — Returns a new option. Inputs: e. Returns: a new option.

### src/editor.js:42

@function editor.callback.13 — Returns a new option. Inputs: p; i. Uses: string. Returns: a new option.

### src/editor.js:56

@function editor.callback.14 — Returns a list of c type, c key, spread element join using ":". Inputs: c. Uses: a list of c type, c key, spread element join. Returns: a list of c type, c key, spread element join using ":".

### src/editor.js:65

@function editor.callback.15 — Provides the callback for page commands for each. Inputs: command; i. Updates: depth; li style margin left; text text content; edit text content; edit onclick. Uses: document create element; summary; li append; a list of "branch", "else", "end" includes.

### src/editor.js:74

@function editor.onclick.16 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: command index; $ using "commandType" value; $ using "addCommand" text content; $ using id value; $ using "cmdDialogue" checked. Uses: $; fields; command options join; string.

### src/editor.js:88

@function editor.callback.17 — Provides the callback for the enclosing editor operation. Inputs: no explicit arguments; uses enclosing module state. Updates: array pattern.

### src/editor.js:91

@function editor.callback.18 — Provides the callback for the enclosing editor operation. Inputs: no explicit arguments; uses enclosing module state. Updates: array pattern.

### src/editor.js:94

@function editor.callback.19 — Provides the callback for the enclosing editor operation. Inputs: no explicit arguments; uses enclosing module state. Uses: page commands splice; error.

### src/editor.js:98

@function editor.onclick.20 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback, a callback.

### src/editor.js:98

@function editor.callback.21 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Uses: action.

### src/editor.js:101

@function editor.callback.22 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Uses: reset command; refresh.

### src/editor.js:113

@function editor.summary.23 — Produce a readable command label for the editor list. Add a branch when introducing a command type. Inputs: c. Uses: c options join. Returns: "Travel to " plus c map plus " / " plus c entrance; "Show choices: " plus c options join using " / " plus " → " plus c key.

### src/editor.js:127

@function editor.fields.24 — Create the controls needed by the selected command type; these values are converted and validated on apply. Inputs: no explicit arguments; uses enclosing module state. Updates: map select id; map select value; entrance id; map select onchange; label inner html. Uses: $; holder replace children; input; api maps.

### src/editor.js:131

@function editor.input.25 — Build a labeled form control for the current command, keeping IDs aligned with addCommand. Inputs: id; label; value; assignment pattern. Updates: l text content; e id; e type; e value. Uses: document create element; l append; holder append.

### src/editor.js:140

@function editor.callback.26 — Returns m id equals "room-test". Inputs: m. Returns: m id equals "room-test".

### src/editor.js:140

@function editor.update.27 — Advances this system using the current state and elapsed time. Inputs: no explicit arguments; uses enclosing module state. Updates: entrance value. Uses: maps find; entrance replace children; chain or chain or a list of map; a list of spread element some.

### src/editor.js:140

@function editor.callback.28 — Returns m id equals map select value. Inputs: m. Returns: m id equals map select value.

### src/editor.js:140

@function editor.callback.29 — Returns a new option. Inputs: e. Returns: a new option.

### src/editor.js:140

@function editor.callback.30 — Returns o value equals "entry". Inputs: o. Returns: o value equals "entry".

### src/editor.js:170

@function editor.onchange.31 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: choose; $. Returns: choose using $ using "selection" value.

### src/editor.js:171

@function editor.onchange.32 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: page index. Uses: number; $; workbench reset selection; reset command.

### src/editor.js:179

@function editor.onclick.33 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: selected; number; $; api mutate.

### src/editor.js:181

@function editor.callback.34 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e x; e y; e elevation.

### src/editor.js:184

@function editor.onclick.35 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: selected; api remove.

### src/editor.js:189

@function editor.onclick.36 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: selected; api mutate. Returns: without a result.

### src/editor.js:192

@function editor.callback.37 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e x; e y; e height; e height offset; e movement mode. Uses: $; number; json parse; frontier parser compile.

### src/editor.js:217

@function editor.callback.38 — Returns s trim using . Inputs: s. Uses: s trim. Returns: s trim using .

### src/editor.js:217

@function editor.callback.39 — Provides the callback for $ using "additionalConditions" value split using /\n/ filter using a callback map. Inputs: s. Uses: s trim using split; s trim; a list of "variable", "item" includes; number. Returns: a record containing type, key, copied fields.

### src/editor.js:235

@function editor.onclick.40 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "eventEditorStatus" text content. Uses: selected; structured clone; candidate pages splice; frontier events validate. Returns: without a result; without a result.

### src/editor.js:241

@function editor.callback.41 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: p name. Uses: structured clone; e pages splice.

### src/editor.js:250

@function editor.onclick.42 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: selected; api mutate. Returns: without a result.

### src/editor.js:253

@function editor.callback.43 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: page index. Uses: e pages push; frontier events page.

### src/editor.js:260

@function editor.onclick.44 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: selected; api mutate. Returns: without a result.

### src/editor.js:263

@function editor.callback.45 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: page index. Uses: e pages splice.

### src/editor.js:268

@function editor.onclick.46 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: command map; command entrance; command key; command operation; command value. Uses: selected; $; number; $ using "cmdOptions" value split using /\n/ map using a callback filter. Returns: without a result.

### src/editor.js:284

@function editor.callback.47 — Returns s trim using . Inputs: s. Uses: s trim. Returns: s trim using .

### src/editor.js:299

@function editor.callback.48 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e pages at page index commands at command index. Uses: workbench selected index; e pages at page index commands splice.

### src/editor.js:303

@function editor.callback.49 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Uses: reset command; refresh; workbench advance selection.

### src/editor.js:312

@function editor.page.50 — Returns page index. Inputs: no explicit arguments; uses enclosing module state. Returns: page index.

### src/editor.js:312

@function editor.setPage.51 — Handles set page within editor. Inputs: i. Updates: page index. Uses: workbench reset selection; reset command; refresh; api preview.

### src/editor.js:313

@function editor.discardDraft.52 — Handles discard draft within editor. Inputs: no explicit arguments; uses enclosing module state. Updates: draft world; draft id. Uses: refresh.

### src/editor.js:314

@function editor.beginDraft.53 — Handles begin draft within editor. Inputs: event; assignment pattern. Updates: draft world; draft id; draft valid; draft world events at index; $ using "eventEditorStatus" text content. Uses: structured clone; authored api world; draft world events find index; draft world events push. Returns: without a result.

### src/editor.js:314

@function editor.callback.54 — Returns e id equals event id. Inputs: e. Returns: e id equals event id.

### src/editor.js:315

@function editor.applyDraft.55 — Handles apply draft within editor. Inputs: assignment pattern. Updates: draft valid; draft world; draft id; $ using "eventEditorStatus" text content. Uses: $ using "addCommand" onclick; $; $ using "savePage" onclick; structured clone. Returns: without a result; without a result.

### src/editor.js:315

@function editor.callback.56 — Returns e id equals incoming id. Inputs: e. Returns: e id equals incoming id.

### src/editor.js:315

@function editor.callback.57 — Returns m id equals command map. Inputs: m. Returns: m id equals command map.

### src/editor.js:315

@function editor.callback.58 — Returns e id equals command entrance. Inputs: e. Returns: e id equals command entrance.

### src/editor.js:315

@function editor.callback.59 — Provides the callback for authored api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: list at index. Uses: authored api world; list find index; list push.

### src/editor.js:315

@function editor.callback.60 — Returns e id equals id. Inputs: e. Returns: e id equals id.

### src/editor.js:315

@function editor.callback.61 — Returns choose using id. Inputs: no explicit arguments; uses enclosing module state. Uses: choose. Returns: choose using id.

### src/editor.js:316

@function editor.onclick.62 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: begin draft; selected. Returns: begin draft using selected using .

### src/editor.js:320

@function editor.onclick.63 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: apply draft. Returns: apply draft using .

### src/editor.js:320

@function editor.onclick.64 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: apply draft. Returns: apply draft using true.

### src/editor.js:320

@function editor.onclick.65 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: $ using "eventWorkbench" close; $. Returns: $ using "eventWorkbench" close using .

### src/editor.js:322

@function editor.callback.66 — Returns a new option. Inputs: name. Returns: a new option.

### src/editor.js:323

@function editor.onchange.67 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: presets value. Uses: api mutate. Returns: without a result.

### src/editor.js:323

@function editor.callback.68 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e combat note; e pages; p commands; p movement; p priority. Uses: selected; frontier events page; e pages push.

### src/editor.js:332

@function editor.callback.69 — Returns a record containing value, text. Inputs: o. Returns: a record containing value, text.

### src/editor.js:332

@function editor.callback.70 — Returns types includes using c value. Inputs: c. Uses: types includes. Returns: types includes using c value.

### src/editor.js:333

@function editor.callback.71 — Provides the callback for $ using "eventProperties" add event listener. Inputs: event. Uses: event target matches; $ using "savePage" onclick; $.

### src/editor.js:334

@function editor.onclick.72 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: old return; begin draft; selected.

### src/editor.js:339

@function editor.onclick.73 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mz editor open. Returns: mz editor open using .

### src/editor.js:341

@function editor.openEvent.74 — Returns mz editor open using . Inputs: no explicit arguments; uses enclosing module state. Uses: mz editor open. Returns: mz editor open using .

### src/editor.js:341

@function editor.beginEvent.75 — Returns mz editor begin using event, is new. Inputs: event; is new. Uses: mz editor begin. Returns: mz editor begin using event, is new.

### src/editor.js:342

@function editor.duplicateEvent.76 — Returns mz editor duplicate using id. Inputs: id. Uses: mz editor duplicate. Returns: mz editor duplicate using id.

### src/editor.js:343

@function editor.deleteEvent.77 — Returns authored api remove using id. Inputs: id. Uses: authored api remove. Returns: authored api remove using id.

### src/editor.js:344

@function editor.selectedId.78 — Handles selected id within editor. Inputs: no explicit arguments; uses enclosing module state. Returns: selected id.

### src/editor.js:347

@function editor.pageIndex.79 — Handles page index within editor. Inputs: no explicit arguments; uses enclosing module state. Returns: mz editor page index.

### src/encounter-example.js:2

@function encounter-example.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier encounter example.

### src/encounter-example.js:2

@function encounter-example.world.2 — Handles world within encounter example. Inputs: base. Updates: w seed; w spawn; w objects; w terrain; w water. Uses: structured clone; frontier water validate; frontier events create; frontier actor behavior validate. Returns: frontier world validate using w.

### src/event-conditions.js:4

@function event-conditions.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier conditions. Uses: register.

### src/event-conditions.js:6

@function event-conditions.key.2 — Returns typeof v equals "string" and v length is greater than 0 and v length is at most 120. Inputs: v. Returns: typeof v equals "string" and v length is greater than 0 and v length is at most 120.

### src/event-conditions.js:7

@function event-conditions.register.3 — Handles register within event conditions. Inputs: type; definition. Uses: key; definitions has; error; definitions set.

### src/event-conditions.js:8

@function event-conditions.value.4 — Handles value within event conditions. Inputs: v. Uses: a list of "constant", "variable" includes; error; key; number is finite. Returns: a record containing kind, key; a record containing kind, value.

### src/event-conditions.js:9

@function event-conditions.read.5 — Handles read within event conditions. Inputs: v; state. Uses: state variables get. Returns: v kind equals "variable" selects chain or the fallback 0 or v value.

### src/event-conditions.js:10

@function event-conditions.validate.6 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: expression; assignment pattern; assignment pattern. Uses: error; definitions has; definitions get using expression type validate; definitions get. Returns: a record containing copied fields, copied fields, type.

### src/event-conditions.js:10

@function event-conditions.callback.7 — Returns validate using e, depth plus 1, budget. Inputs: e. Uses: validate. Returns: validate using e, depth plus 1, budget.

### src/event-conditions.js:11

@function event-conditions.evaluate.8 — Handles evaluate within event conditions. Inputs: expression; context. Uses: definitions get; error; d evaluate. Returns: the inverse of the inverse of d evaluate using expression, context, a callback.

### src/event-conditions.js:11

@function event-conditions.callback.9 — Returns evaluate using e, context. Inputs: e. Uses: evaluate. Returns: evaluate using e, context.

### src/event-conditions.js:12

@function event-conditions.validate.10 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e; check. Uses: array is array; error; e children map. Returns: a record containing children.

### src/event-conditions.js:12

@function event-conditions.evaluate.11 — Returns e children every using test. Inputs: e; c; test. Uses: e children every. Returns: e children every using test.

### src/event-conditions.js:13

@function event-conditions.validate.12 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e; check. Uses: array is array; error; e children map. Returns: a record containing children.

### src/event-conditions.js:13

@function event-conditions.evaluate.13 — Returns e children some using test. Inputs: e; c; test. Uses: e children some. Returns: e children some using test.

### src/event-conditions.js:14

@function event-conditions.validate.14 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e; check. Uses: check. Returns: a record containing child.

### src/event-conditions.js:14

@function event-conditions.evaluate.15 — Returns the inverse of test using e child. Inputs: e; c; test. Uses: test. Returns: the inverse of test using e child.

### src/event-conditions.js:15

@function event-conditions.validate.16 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: comparisons has; error; value. Returns: a record containing left, right, operator.

### src/event-conditions.js:15

@function event-conditions.evaluate.17 — Handles evaluate within event conditions. Inputs: e; c. Uses: read; a record containing eq, ne, lt, le, gt, ge at e operator. Returns: a record containing eq, ne, lt, le, gt, ge at e operator using .

### src/event-conditions.js:15

@function event-conditions.eq.18 — Returns a equals b. Inputs: no explicit arguments; uses enclosing module state. Returns: a equals b.

### src/event-conditions.js:15

@function event-conditions.ne.19 — Returns a does not equal b. Inputs: no explicit arguments; uses enclosing module state. Returns: a does not equal b.

### src/event-conditions.js:15

@function event-conditions.lt.20 — Returns a is less than b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is less than b.

### src/event-conditions.js:15

@function event-conditions.le.21 — Returns a is at most b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is at most b.

### src/event-conditions.js:15

@function event-conditions.gt.22 — Returns a is greater than b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is greater than b.

### src/event-conditions.js:15

@function event-conditions.ge.23 — Returns a is at least b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is at least b.

### src/event-conditions.js:16

@function event-conditions.validate.24 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: key; error; a list of "A", "B", "C", "D" includes; number is finite. Returns: a record containing key, copied fields.

### src/event-conditions.js:16

@function event-conditions.evaluate.25 — Handles evaluate within event conditions. Inputs: e; c. Uses: c state switches get; c state self switches get; c state inventory get; c state actors has. Returns: chain or the fallback false equals e value; chain or the fallback false equals e value.

### src/event-conditions.js:18

@function event-conditions.validate.26 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: key; comparisons has; number is finite; error. Returns: a record containing key, operator, value.

### src/event-conditions.js:18

@function event-conditions.evaluate.27 — Handles evaluate within event conditions. Inputs: e; c. Uses: c state at type equals "skill" selects "skills" or "reputation" get; a record containing eq, ne, lt, le, gt, ge at e operator. Returns: a record containing eq, ne, lt, le, gt, ge at e operator using .

### src/event-conditions.js:18

@function event-conditions.eq.28 — Returns a equals b. Inputs: no explicit arguments; uses enclosing module state. Returns: a equals b.

### src/event-conditions.js:18

@function event-conditions.ne.29 — Returns a does not equal b. Inputs: no explicit arguments; uses enclosing module state. Returns: a does not equal b.

### src/event-conditions.js:18

@function event-conditions.lt.30 — Returns a is less than b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is less than b.

### src/event-conditions.js:18

@function event-conditions.le.31 — Returns a is at most b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is at most b.

### src/event-conditions.js:18

@function event-conditions.gt.32 — Returns a is greater than b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is greater than b.

### src/event-conditions.js:18

@function event-conditions.ge.33 — Returns a is at least b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is at least b.

### src/event-conditions.js:19

@function event-conditions.validate.34 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: key; error. Returns: a record containing key, value.

### src/event-conditions.js:19

@function event-conditions.evaluate.35 — Returns chain or the fallback false equals e value. Inputs: e; c. Uses: c state factions get. Returns: chain or the fallback false equals e value.

### src/event-conditions.js:20

@function event-conditions.validate.36 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: key; number is finite; error. Returns: a record containing target, radius.

### src/event-conditions.js:20

@function event-conditions.evaluate.37 — Handles evaluate within event conditions. Inputs: e; c. Uses: c resolve entity. Returns: the inverse of the inverse of a and the inverse of the inverse of b and math hypot using a x minus b x, a y minus b y is at most e radius.

### src/event-conditions.js:21

@function event-conditions.validate.38 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: number is integer; a list of "ge", "le" includes; error. Returns: a record containing seconds, operator.

### src/event-conditions.js:21

@function event-conditions.evaluate.39 — Returns the inverse of the inverse of chain and e operator equals "ge" selects c state timer remaining is at least e seconds or c state timer remaining is at most e seconds. Inputs: e; c. Returns: the inverse of the inverse of chain and e operator equals "ge" selects c state timer remaining is at least e seconds or c state timer remaining is at most e seconds.

### src/event-conditions.js:22

@function event-conditions.validate.40 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: number is integer; a list of "ge", "le", "lt" includes; error. Returns: a record containing amount, operator.

### src/event-conditions.js:22

@function event-conditions.evaluate.41 — Handles evaluate within event conditions. Inputs: e; c. Returns: e operator equals "ge" selects gold is at least e amount or e operator equals "le" selects gold is at most e amount or gold is less than e amount.

### src/event-conditions.js:23

@function event-conditions.legacy.42 — Handles legacy within event conditions. Inputs: c. Uses: validate. Returns: validate using c expression; a record containing type, children.

### src/event-conditions.js:24

@function event-conditions.types.43 — Returns a list of spread element. Inputs: no explicit arguments; uses enclosing module state. Uses: definitions keys. Returns: a list of spread element.

### src/event-context.js:1

@function event-context.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event context.

### src/event-context.js:2

@function event-context.close.2 — Handles close within event context. Inputs: no explicit arguments; uses enclosing module state. Updates: menu hidden.

### src/event-context.js:3

@function event-context.install.3 — Handles install within event context. Inputs: value. Updates: api; menu; menu id; menu hidden. Uses: document create element; menu set attribute; document body append; document add event listener.

### src/event-context.js:3

@function event-context.callback.4 — Provides the callback for document add event listener. Inputs: e. Uses: menu contains; close.

### src/event-context.js:3

@function event-context.callback.5 — Provides the callback for document add event listener. Inputs: e. Uses: close.

### src/event-context.js:4

@function event-context.open.6 — Handles open within event context. Inputs: object pattern. Updates: menu style left; menu style top; menu hidden. Uses: api editing; menu replace children; api world using events find; api world. Returns: without a result.

### src/event-context.js:4

@function event-context.action.7 — Handles action within event context. Inputs: label; fn; assignment pattern. Updates: button text content; button disabled; button onclick. Uses: document create element; button set attribute; menu append.

### src/event-context.js:4

@function event-context.onclick.8 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: close; fn.

### src/event-context.js:5

@function event-context.callback.9 — Returns e id equals event id. Inputs: e. Returns: e id equals event id.

### src/event-context.js:5

@function event-context.configureDoor — Inputs: none. Opens existing event's private door draft; no commit until Apply.

### src/event-context.js:5

@function event-context.configureStorage — Inputs: none. Opens existing event's storage draft; preserves pages.

### src/event-context.js:5

@function event-context.callback.10 — Provides the callback for action. Inputs: no explicit arguments; uses enclosing module state. Uses: api editor using choose; api editor; api editor using open event.

### src/event-context.js:5

@function event-context.callback.11 — Returns api editor using duplicate event using e id. Inputs: no explicit arguments; uses enclosing module state. Uses: api editor using duplicate event; api editor. Returns: api editor using duplicate event using e id.

### src/event-context.js:5

@function event-context.callback.12 — Returns api editor using delete event using e id. Inputs: no explicit arguments; uses enclosing module state. Uses: api editor using delete event; api editor. Returns: api editor using delete event using e id.

### src/event-context.js:6

@function event-context.callback.13 — Provides the callback for action. Inputs: no explicit arguments; uses enclosing module state. Updates: event elevation; event height; event height offset; event movement mode. Uses: frontier events create; crypto random uuid; api editor using begin event; api editor.

### src/event-context.js:7

@function event-context.newDoor — Inputs: none. Opens invisible doorway authoring at clicked terrain XY.

### src/event-context.js:7

@function event-context.newStorage — Inputs: none. Opens storage definition at terrain point.

### src/event-context.js:7

@function event-context.newTemplate — Inputs: none. Opens bank picker for independent event instance.

### src/event-continuation.js:6

@function event-continuation.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event continuation.

### src/event-continuation.js:7

@function event-continuation.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Updates: commands. Uses: number is integer; number is finite; array is array; error. Returns: a record containing originMap, source, commands, index, pageIndex, waiting, choices.

### src/event-continuation.js:7

@function event-continuation.callback.3 — Returns c type equals "unsupported". Inputs: c. Returns: c type equals "unsupported".

### src/event-continuation.js:8

@function event-continuation.capture.4 — Handles capture within event continuation. Inputs: execution; event; waiting; choices. Uses: error; structured clone; validate. Returns: value.

### src/event-motion.js:5

@function event-motion.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event motion.

### src/event-motion.js:6

@function event-motion.update.2 — Advances this system using the current state and elapsed time. Inputs: event; page; dt; player; services; controllers. Updates: control; event facing x; event facing y; control custom; control route error. Uses: controllers get; controllers set; root frontier mzroutes start; services log. Returns: without a result.

### src/event-runtime.js:3

@function event-runtime.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event runtime. Uses: "message choices choicePrompt numberInput branch else end forceRoute eraseEvent controlTimer exitEvent repeat breakLoop jumpLabel label loop selfSwitch switch journal variable partyMember mzVariables giveItem wait transferMap transfer transferPlayer choiceSection choiceCancel choiceEnd unsupported" split; register.

### src/event-runtime.js:5

@function event-runtime.register.2 — Handles register within event runtime. Inputs: type; definition. Uses: /^[A-Za-z][A-Za-z0-9:_-]{0,99}$/ test; builtins has; handlers has; error.

### src/event-runtime.js:6

@function event-runtime.validate.3 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: command. Uses: handlers get; error; root frontier event schema json; definition validate. Returns: c.

### src/event-runtime.js:7

@function event-runtime.preflight.4 — Handles preflight within event runtime. Inputs: commands. Uses: commands map. Returns: commands map using a callback.

### src/event-runtime.js:7

@function event-runtime.callback.5 — Provides the callback for commands map. Inputs: command. Uses: handlers has; validate; builtins has. Returns: validate using command; command.

### src/event-runtime.js:8

@function event-runtime.execute.6 — Handles execute within event runtime. Inputs: command; context. Uses: handlers get; error; d execute; array is array. Returns: result.

### src/event-runtime.js:9

@function event-runtime.validate.7 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: a list of 0, 1 includes; number is integer; error.

### src/event-runtime.js:9

@function event-runtime.execute.8 — Handles execute within event runtime. Inputs: c; object pattern. Updates: state gold. Uses: state variables get; string.

### src/event-runtime.js:10

@function event-runtime.validate.9 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: number is integer; a list of 0, 1 includes; error.

### src/event-runtime.js:10

@function event-runtime.execute.10 — Handles execute within event runtime. Inputs: c; object pattern. Uses: state variables get; string; state inventory get; state inventory set.

### src/event-runtime.js:11

@function event-runtime.validate.11 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: number is integer; error.

### src/event-runtime.js:11

@function event-runtime.execute.12 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services play se.

### src/event-runtime.js:12

@function event-runtime.validate.13 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: no explicit arguments; uses enclosing module state.

### src/event-runtime.js:12

@function event-runtime.execute.14 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services stop se.

### src/event-runtime.js:13

@function event-runtime.validate.15 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: array is array; c tone some; number is integer; error.

### src/event-runtime.js:13

@function event-runtime.callback.16 — Returns the inverse of number is integer using v or v is less than i equals 3 selects 0 or - 255 or v is greater than 255. Inputs: v; i. Uses: number is integer. Returns: the inverse of number is integer using v or v is less than i equals 3 selects 0 or - 255 or v is greater than 255.

### src/event-runtime.js:13

@function event-runtime.execute.17 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services screen tone. Returns: c wait and c frames selects a record containing wait or undefined.

### src/event-runtime.js:14

@function event-runtime.validate.18 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: number is integer; error.

### src/event-runtime.js:14

@function event-runtime.execute.19 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services screen shake. Returns: c wait selects a record containing wait or undefined.

### src/event-runtime.js:15

@function event-runtime.validate.20 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: array is array; c color some; number is integer; error.

### src/event-runtime.js:15

@function event-runtime.callback.21 — Returns the inverse of number is integer using v or v is less than 0 or v is greater than 255. Inputs: v. Uses: number is integer. Returns: the inverse of number is integer using v or v is less than 0 or v is greater than 255.

### src/event-runtime.js:15

@function event-runtime.execute.22 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services screen flash. Returns: c wait selects a record containing wait or undefined.

### src/event-runtime.js:16

@function event-runtime.validate.23 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: error.

### src/event-runtime.js:16

@function event-runtime.execute.24 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services screen fade. Returns: a record containing wait.

### src/event-runtime.js:17

@function event-runtime.validate.25 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: error.

### src/event-runtime.js:17

@function event-runtime.execute.26 — Handles execute within event runtime. Inputs: c; object pattern. Updates: player transparent.

### src/event-runtime.js:18

@function event-runtime.validate.27 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: /^[A-Za-z0-9_-]{1,64}$/ test; number is safe integer; a list of "reset", "preserve" includes; error.

### src/event-runtime.js:20

@function event-runtime.execute.28 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services current map; error; replace event; services template bank.

### src/event-runtime.js:24

@function event-runtime.has.29 — Returns handlers has using type. Inputs: type. Uses: handlers has. Returns: handlers has using type.

### src/event-runtime.js:24

@function event-runtime.get.30 — Returns handlers get using type. Inputs: type. Uses: handlers get. Returns: handlers get using type.

### src/event-schema.js:4

@function event-schema.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event schema.

### src/event-schema.js:5

@function event-schema.callback.2 — Returns a record containing copied fields, schemaVersion, extensions. Inputs: event. Uses: structured clone. Returns: a record containing copied fields, schemaVersion, extensions.

### src/event-schema.js:6

@function event-schema.json.3 — Handles json within event schema. Inputs: value. Uses: check; json stringify; error; structured clone. Returns: structured clone using value.

### src/event-schema.js:6

@function event-schema.check.4 — Handles check within event schema. Inputs: v; depth. Uses: error; number is finite; seen has; seen add. Returns: without a result; without a result.

### src/event-schema.js:7

@function event-schema.extensions.5 — Handles extensions within event schema. Inputs: value. Uses: array is array; error; /^[1-9][0-9]*$/ test; string. Returns: a record containing ; json using value.

### src/event-schema.js:8

@function event-schema.migrate.6 — Handles migrate within event schema. Inputs: event. Updates: e; version. Uses: structured clone; number is integer; error; migrations get. Returns: e.

### src/event-schema.js:9

@function event-schema.pageDefaults.7 — Returns a record containing moveSpeed, moveFrequency, walkAnime, stepAnime, directionFix, moveRoute, image, conditionSlots. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing moveSpeed, moveFrequency, walkAnime, stepAnime, directionFix, moveRoute, image, conditionSlots.

### src/event-schema.js:10

@function event-schema.pageSettings.8 — Handles page settings within event schema. Inputs: value. Updates: v move route. Uses: page defaults; json; number is integer; error. Returns: v.

### src/event-schema.js:11

@function event-schema.annotations.9 — Handles annotations within event schema. Inputs: checked; source. Updates: e note; e display name; e pages. Uses: migrate; extensions; error; e pages map. Returns: e.

### src/event-schema.js:11

@function event-schema.callback.10 — Returns a record containing copied fields, copied fields, copied fields, extensions, commands. Inputs: p; i. Uses: root frontier actor behavior validate; page settings; extensions; p commands map. Returns: a record containing copied fields, copied fields, copied fields, extensions, commands.

### src/event-schema.js:11

@function event-schema.callback.11 — Returns a record containing copied fields, extensions. Inputs: c; j. Uses: extensions. Returns: a record containing copied fields, extensions.

### src/event-schema.js:12

@function event-schema.extraPageConditions.12 — Handles extra page conditions within event schema. Inputs: page. Uses: object entries using chain or a record containing filter using a callback map; object entries using chain or a record containing filter; object entries; a list of page condition, spread element filter using a callback map. Returns: a list of page condition, spread element filter using a callback map using a callback.

### src/event-schema.js:12

@function event-schema.callback.13 — Returns s enabled. Inputs: array pattern. Returns: s enabled.

### src/event-schema.js:12

@function event-schema.callback.14 — Returns a record containing type, key, copied fields. Inputs: array pattern. Uses: key starts with. Returns: a record containing type, key, copied fields.

### src/event-schema.js:12

@function event-schema.callback.15 — Provides the callback for a list of page condition, spread element filter. Inputs: c. Uses: represented find index; represented splice. Returns: false; true.

### src/event-schema.js:12

@function event-schema.callback.16 — Returns s type equals c type and s key equals c key and s type does not equal "variable" and s type does not equal "item" or s value equals c value. Inputs: s. Returns: s type equals c type and s key equals c key and s type does not equal "variable" and s type does not equal "item" or s value equals c value.

### src/event-schema.js:12

@function event-schema.callback.17 — Returns structured clone using c. Inputs: c. Uses: structured clone. Returns: structured clone using c.

### src/event-state.js:2

@function event-state.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event state.

### src/event-state.js:4

@function event-state.entries.2 — Sparse named values: absent skills/reputation are zero; absent factions are false. Inputs: value; name; assignment pattern. Uses: array is array; error; keys has; number is finite. Returns: rows map using a callback.

### src/event-state.js:4

@function event-state.callback.3 — Returns a list of spread element. Inputs: e. Returns: a list of spread element.

### src/event-state.js:5

@function event-state.validate.4 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: array is array; actors some; error; keys has. Returns: a record containing skills, reputation, factions, gold, partyActors, quests, timer.

### src/event-state.js:5

@function event-state.callback.5 — Returns typeof id does not equal "string" or the inverse of id or id length is greater than 120. Inputs: id. Returns: typeof id does not equal "string" or the inverse of id or id length is greater than 120.

### src/event-state.js:6

@function event-state.capture.6 — Handles capture within event state. Inputs: state. Uses: validate. Returns: validate using a record containing skills, reputation, factions, partyActors, quests, timer, gold.

### src/event-state.js:7

@function event-state.restore.7 — Applies saved state to this system. Inputs: state; value. Updates: state skills; state reputation; state factions; state gold; state actors. Uses: validate.

### src/event-templates.js:4

@function event-templates.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event templates. Uses: object freeze.

### src/event-templates.js:6

@function event-templates.validId.2 — Returns typeof id equals "string" and /^[A-Za-z0-9_-]{1,64}$/ test using id. Inputs: id. Uses: /^[A-Za-z0-9_-]{1,64}$/ test. Returns: typeof id equals "string" and /^[A-Za-z0-9_-]{1,64}$/ test using id.

### src/event-templates.js:7

@function event-templates.freeze.3 — Handles freeze within event templates. Inputs: value. Uses: object is frozen; object values; freeze; object freeze. Returns: value.

### src/event-templates.js:8

@function event-templates.validate.4 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: bank. Uses: array is array; error; a new text encoder encode; json stringify. Returns: a record containing schema, entries, extensions.

### src/event-templates.js:12

@function event-templates.callback.5 — Provides the callback for bank entries map. Inputs: entry. Updates: source x; source y. Uses: valid id; ids has; number is safe integer; error. Returns: a record containing id, name, version, event, extensions.

### src/event-templates.js:26

@function event-templates.compile.6 — Handles compile within event templates. Inputs: bank. Uses: freeze; validate; checked entries map; object freeze. Returns: object freeze using a record containing snapshot, size, version, instantiate.

### src/event-templates.js:27

@function event-templates.callback.7 — Returns a list of entry id, entry. Inputs: entry. Returns: a list of entry id, entry.

### src/event-templates.js:28

@function event-templates.snapshot.8 — Captures this system’s current data for persistence or inspection. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using checked.

### src/event-templates.js:28

@function event-templates.version.9 — Returns chain. Inputs: id. Uses: by id get. Returns: chain.

### src/event-templates.js:29

@function event-templates.instantiate.10 — Handles instantiate within event templates. Inputs: id; placement; version. Updates: engine event number; extensions at "sprite-frontier". Uses: by id get; error; valid id; number is finite. Returns: a record containing copied fields, id, x, y, extensions.

### src/event-templates.js:46

@function event-templates.references.11 — Handles references within event templates. Inputs: value; bank; events. Uses: array is array; error; validate using bank entries map; validate. Returns: a list of ; value map using a callback.

### src/event-templates.js:49

@function event-templates.callback.12 — Returns a list of e id, e version. Inputs: e. Returns: a list of e id, e version.

### src/event-templates.js:49

@function event-templates.callback.13 — Returns e id. Inputs: e. Returns: e id.

### src/event-templates.js:50

@function event-templates.callback.14 — Provides the callback for value map. Inputs: r. Uses: targets has; seen has; valid id; definitions get. Returns: a record containing id, template, version, statePolicy.

### src/event-templates.js:57

@function event-templates.merge.15 — The returned mapping lets future command references follow renamed entries. Inputs: existing; incoming; assignment pattern. Updates: id; entry id; command parameters at 1; key; extensions at key. Uses: validate; a entries map; ids has; original slice. Returns: a record containing bank, mapping.

### src/event-templates.js:58

@function event-templates.callback.16 — Returns e id. Inputs: e. Returns: e id.

### src/event-templates.js:68

@function event-templates.remapReferences.17 — Handles remap references within event templates. Inputs: event; mapping. Updates: command template. Uses: mapping has; mapping get.

### src/event-templates.js:69

@function event-templates.empty.18 — Returns a record containing schema, entries. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing schema, entries.

### src/events.js:5

@function events.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier events. Uses: object freeze.

### src/events.js:12

@function events.serializedBytes.2 — UTF-8 size without allocating an encoded byte buffer; also works in isolated test runtimes. Inputs: value. Updates: bytes. Uses: json stringify; c code point at. Returns: bytes.

### src/events.js:13

@function events.validName.3 — Returns typeof value equals "string" and /^[A-Za-z0-9_-]{1,60}$/ test using value. Inputs: value. Uses: /^[A-Za-z0-9_-]{1,60}$/ test. Returns: typeof value equals "string" and /^[A-Za-z0-9_-]{1,60}$/ test using value.

### src/events.js:14

@function events.point.4 — Returns value and number is finite using value x and number is finite using value y and value x is at least 1 and value y is at least 1 and value x is at most bounds width minus 1 and value y is at most bounds height minus 1. Inputs: value; assignment pattern. Uses: number is finite. Returns: value and number is finite using value x and number is finite using value y and value x is at least 1 and value y is at least 1 and value x is at most bounds width minus 1 and value y is at most bounds height minus 1.

### src/events.js:16

@function events.page.5 — Construct a new page with explicit defaults, including one demonstration message. Inputs: assignment pattern. Returns: a record containing name, graphic, trigger, solid, condition, commands.

### src/events.js:29

@function events.create.6 — Construct isolated editor/event state through the caller services. Inputs: id; x; y. Uses: page. Returns: a record containing id, name, x, y, range, inspection, pages.

### src/events.js:36

@function events.checkCondition.7 — Sanitize one page condition; variable/item conditions are numeric thresholds and self-switches are A through D. Inputs: c. Uses: error; root frontier conditions validate; a list of "always", "selfSwitch", "switch", "variable" includes; a list of "A", "B", "C", "D" includes. Returns: a record containing type, expression; a record containing type, key, copied fields.

### src/events.js:53

@function events.validate.8 — Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields. Inputs: events; assignment pattern; assignment pattern. Uses: array is array; error; events map; result map. Returns: root frontier event schema selects result map using a callback or result.

### src/events.js:56

@function events.callback.9 — Provides the callback for events map. Inputs: event. Uses: valid name; ids has; point; number is finite. Returns: a record containing copied fields, activity, vectorTreatment, copied fields, copied fields, copied fields, copied fields, copied fields.

### src/events.js:86

@function events.callback.10 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: error.

### src/events.js:91

@function events.callback.11 — Provides the callback for event pages map. Inputs: p. Updates: stack at stack length minus 1. Uses: graphics includes; triggers includes; a list of "always", "selfSwitch", "switch", "variable" includes; array is array. Returns: a record containing name, graphic, trigger, solid, movement, priority, through, condition.

### src/events.js:101

@function events.callback.12 — Provides the callback for p commands map. Inputs: command. Uses: error; root frontier mzcommands validate; valid name; a list of "set", "add" includes. Returns: root frontier mzcommands validate using command; a record containing type, key, operation, value.

### src/events.js:154

@function events.callback.13 — Returns typeof s does not equal "string" or the inverse of s trim using or s length is greater than 120. Inputs: s. Uses: s trim. Returns: typeof s does not equal "string" or the inverse of s trim using or s length is greater than 120.

### src/events.js:182

@function events.callback.14 — Returns root frontier event schema annotations using e, events at i. Inputs: e; i. Uses: root frontier event schema annotations. Returns: root frontier event schema annotations using e, events at i.

### src/events.js:186

@function events.diagnostics.15 — Diagnostic sizing is explicit/on demand; do not serialize event data each frame. Inputs: event. Uses: event pages reduce; serialized bytes. Returns: a record containing id, pages, commands, serializedBytes, byteBudget.

### src/events.js:186

@function events.callback.16 — Returns n plus p commands length. Inputs: n; p. Returns: n plus p commands length.

### src/events.js:187

@function events.activePage.17 — Handles active page within events. Inputs: event; state. Uses: state erased events has; state page cache selection; scan pages. Returns: - 1; state page cache selects state page cache selection using event, a callback or scan pages using event, state.

### src/events.js:189

@function events.callback.18 — Returns scan pages using event, state. Inputs: no explicit arguments; uses enclosing module state. Uses: scan pages. Returns: scan pages using event, state.

### src/events.js:192

@function events.scanPages.19 — Separate uncached scan allows correctness fixtures and dynamic-condition fallback. Inputs: event; state. Updates: state page checks. Uses: a list of event pages at i condition, spread element every. Returns: i; - 1.

### src/events.js:197

@function events.matches.20 — Returns c type equals "expression" selects root frontier conditions evaluate using c expression, a record containing state, eventId, subject, resolveEntity or c type equals "always" or c type equals "selfSwitch" and state self switches get using event id plus ":" plus c key equals true or c type equals "switch" and state switches get using c key equals true or c type equals "variable" and chain or 0 is at least c value or c type equals "item" and state inventory get using c key or 0 is at least c value or c type equals "actor" and the inverse of the inverse of chain. Inputs: c. Uses: root frontier conditions evaluate; state self switches get; state switches get; state variables get. Returns: c type equals "expression" selects root frontier conditions evaluate using c expression, a record containing state, eventId, subject, resolveEntity or c type equals "always" or c type equals "selfSwitch" and state self switches get using event id plus ":" plus c key equals true or c type equals "switch" and state switches get using c key equals true or c type equals "variable" and chain or 0 is at least c value or c type equals "item" and state inventory get using c key or 0 is at least c value or c type equals "actor" and the inverse of the inverse of chain.

### src/events.js:197

@function events.resolveEntity.21 — Returns chain. Inputs: id. Uses: state entities get. Returns: chain.

### src/events.js:203

@function events.createSession.22 — Clone authored events and own temporary switches, inventory, variable values and interpreter state. Inputs: authored events; services. Updates: state entities; state page cache. Uses: structured clone; root frontier page cache create; fresh context. Returns: a record containing captureContinuation, restoreContinuation, captureBehaviors, restoreBehaviors, replaceEvent, replacementRevision, replacementReferences, replacementDebug.

### src/events.js:210

@function events.get.23 — Returns id equals "player" selects state player or chain or events find using a callback or chain. Inputs: id. Uses: services resolve entity; events find. Returns: id equals "player" selects state player or chain or events find using a callback or chain.

### src/events.js:210

@function events.callback.24 — Returns e id equals id. Inputs: e. Returns: e id equals id.

### src/events.js:214

@function events.freshContext.25 — Returns a record containing execution, message, waiting, routeWait, choiceBranches, pageIndex. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing execution, message, waiting, routeWait, choiceBranches, pageIndex.

### src/events.js:216

@function events.saveContext.26 — Handles save context within events. Inputs: no explicit arguments; uses enclosing module state. Uses: object assign.

### src/events.js:217

@function events.loadContext.27 — Handles load context within events. Inputs: context. Updates: current context; object pattern. Uses: save context.

### src/events.js:218

@function events.publishMessage.28 — Handles publish message within events. Inputs: value. Updates: message; current context message; message owner. Uses: services message. Returns: services message using value.

### src/events.js:219

@function events.respond.29 — Handles respond within events. Inputs: fn. Uses: load context; fn. Returns: fn using .

### src/events.js:224

@function events.replaceEvent.30 — validated template bank; this boundary additionally validates map placement. Inputs: id; bank; template; assignment pattern. Updates: message owner; context route wait; object pattern; events at index; next definition revision. Uses: events find index; error; a list of "reset", "preserve" includes; bank instantiate. Returns: next.

### src/events.js:225

@function events.callback.31 — Returns e id equals id. Inputs: e. Returns: e id equals id.

### src/events.js:251

@function events.skipBranch.32 — Skip to the matching Else/End while respecting nested branches. Inputs: allow else. Returns: without a result; without a result.

### src/events.js:253

@function events.start.33 — Start an eligible event only when no other event is running and the selected page trigger matches. Inputs: event; trigger. Updates: commands; waiting; route wait; execution. Uses: events includes; activation frame get; active page; root frontier mzcommands lower. Returns: false; false.

### src/events.js:260

@function events.callback.34 — Returns c type equals "transferPlayer". Inputs: c. Returns: c type equals "transferPlayer".

### src/events.js:261

@function events.callback.35 — Provides the callback for commands find. Inputs: c. Uses: root frontier event runtime get. Returns: key and typeof services at key does not equal "function".

### src/events.js:262

@function events.callback.36 — Returns c type equals "forceRoute" and c route list some using a callback. Inputs: c. Uses: c route list some. Returns: c type equals "forceRoute" and c route list some using a callback.

### src/events.js:262

@function events.callback.37 — Returns r code equals 44. Inputs: r. Returns: r code equals 44.

### src/events.js:265

@function events.callback.38 — Returns e id equals c target. Inputs: e. Returns: e id equals c target.

### src/events.js:266

@function events.callback.39 — Returns c type equals "unsupported". Inputs: c. Returns: c type equals "unsupported".

### src/events.js:275

@function events.runInterpreter.40 — Handles run interpreter within events. Inputs: dt; player. Updates: route wait; waiting; execution; message; current context message. Uses: forced routes has; a list of "message", "choices", "choicePrompt", "numberInput" includes; root frontier event runtime get; root frontier event runtime has. Returns: without a result; without a result.

### src/events.js:291

@function events.callback.41 — Returns e id equals execution event id. Inputs: e. Returns: e id equals execution event id.

### src/events.js:316

@function events.callback.42 — Returns e id equals execution event id. Inputs: e. Returns: e id equals execution event id.

### src/events.js:321

@function events.callback.43 — Returns e id equals execution event id. Inputs: e. Returns: e id equals execution event id.

### src/events.js:321

@function events.callback.44 — Returns + chain equals command target. Inputs: e. Returns: + chain equals command target.

### src/events.js:333

@function events.callback.45 — Returns c type equals "label" and c name equals command name. Inputs: c. Returns: c type equals "label" and c name equals command name.

### src/events.js:343

@function events.callback.46 — Returns value. Inputs: no explicit arguments; uses enclosing module state. Returns: value.

### src/events.js:343

@function events.callback.47 — Returns old plus value. Inputs: no explicit arguments; uses enclosing module state. Returns: old plus value.

### src/events.js:343

@function events.callback.48 — Returns old minus value. Inputs: no explicit arguments; uses enclosing module state. Returns: old minus value.

### src/events.js:343

@function events.callback.49 — Returns old multiplied by value. Inputs: no explicit arguments; uses enclosing module state. Returns: old multiplied by value.

### src/events.js:343

@function events.callback.50 — Returns old divided by value. Inputs: no explicit arguments; uses enclosing module state. Returns: old divided by value.

### src/events.js:343

@function events.callback.51 — Returns old % value. Inputs: no explicit arguments; uses enclosing module state. Returns: old % value.

### src/events.js:356

@function events.callback.52 — Returns e id equals execution event id. Inputs: e. Returns: e id equals execution event id.

### src/events.js:369

@function events.update.53 — Advances this system using the current state and elapsed time. Inputs: dt; player. Updates: state player; frame budget; state timer remaining; direction; direction time. Uses: active page; forced routes has; services motion delta; services behavior can move.

### src/events.js:379

@function events.routeSwitch.54 — Returns state switches set using key, value. Inputs: key; value. Uses: state switches set. Returns: state switches set using key, value.

### src/events.js:388

@function events.routeSwitch.55 — Returns state switches set using key, value. Inputs: key; value. Uses: state switches set. Returns: state switches set using key, value.

### src/events.js:390

@function events.callback.56 — Returns activation frame get using event or 0 is at most frame number and chain equals "parallel". Inputs: event. Uses: activation frame get; active page. Returns: activation frame get using event or 0 is at most frame number and chain equals "parallel".

### src/events.js:391

@function events.callback.57 — Returns e id equals id. Inputs: e. Returns: e id equals id.

### src/events.js:410

@function events.captureContinuation.58 — Handles capture continuation within events. Inputs: no explicit arguments; uses enclosing module state. Uses: error; root frontier event continuation capture; events find. Returns: root frontier event continuation capture using execution, events find using a callback, waiting.

### src/events.js:410

@function events.callback.59 — Returns e id equals chain. Inputs: e. Returns: e id equals chain.

### src/events.js:411

@function events.restoreContinuation.60 — Handles restore continuation within events. Inputs: value. Updates: execution; waiting; choice branches. Uses: error; root frontier event continuation validate; save context.

### src/events.js:412

@function events.captureBehaviors.61 — Returns chain or a list of . Inputs: no explicit arguments; uses enclosing module state. Uses: root frontier actor behavior capture. Returns: chain or a list of .

### src/events.js:412

@function events.restoreBehaviors.62 — Returns chain. Inputs: value. Uses: root frontier actor behavior restore; services bounds. Returns: chain.

### src/events.js:413

@function events.replacementRevision.63 — Handles replacement revision within events. Inputs: no explicit arguments; uses enclosing module state. Returns: replacement revision.

### src/events.js:413

@function events.replacementReferences.64 — Returns structured clone using a list of spread element. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone; replacement references values. Returns: structured clone using a list of spread element.

### src/events.js:413

@function events.replacementDebug.65 — Returns structured clone using replacement trace. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using replacement trace.

### src/events.js:414

@function events.invalidatePages.66 — Returns chain. Inputs: event. Uses: state page cache invalidate. Returns: chain.

### src/events.js:414

@function events.activePage.67 — Returns active page using event, state. Inputs: event. Uses: active page. Returns: active page using event, state.

### src/events.js:415

@function events.parallelDebug.68 — Returns a list of spread element map using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element map. Returns: a list of spread element map using a callback.

### src/events.js:415

@function events.callback.69 — Returns a record containing id, page, command, waiting, message. Inputs: array pattern. Returns: a record containing id, page, command, waiting, message.

### src/events.js:416

@function events.playerRouteActive.70 — Handles player route active within events. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element some; forced routes keys. Returns: a list of spread element some using a callback.

### src/events.js:416

@function events.callback.71 — Returns the inverse of events includes using e. Inputs: e. Uses: events includes. Returns: the inverse of events includes using e.

### src/events.js:417

@function events.choose.72 — Handles choose within events. Inputs: index. Uses: respond. Returns: respond using a callback.

### src/events.js:417

@function events.callback.73 — Provides the callback for respond. Inputs: no explicit arguments; uses enclosing module state. Uses: number is integer; choice branches set; state variables set; publish message. Returns: without a result.

### src/events.js:418

@function events.inputNumber.74 — Handles input number within events. Inputs: value. Uses: respond. Returns: respond using a callback.

### src/events.js:418

@function events.callback.75 — Provides the callback for respond. Inputs: no explicit arguments; uses enclosing module state. Uses: number is integer; state variables set; publish message. Returns: false; true.

### src/events.js:419

@function events.cancelChoice.76 — Handles cancel choice within events. Inputs: no explicit arguments; uses enclosing module state. Uses: respond. Returns: respond using a callback.

### src/events.js:419

@function events.callback.77 — Provides the callback for respond. Inputs: no explicit arguments; uses enclosing module state. Uses: choice branches set; publish message. Returns: false; true.

### src/events.js:420

@function events.debug.78 — Handles debug within events. Inputs: no explicit arguments; uses enclosing module state. Uses: events map; a list of spread element map. Returns: a record containing pageCache, pageChecks, diagnosticsEnabled, eventBudgets, execution, waiting, message, parallel.

### src/events.js:420

@function events.callback.79 — Returns a record containing id, page, command, waiting. Inputs: array pattern. Returns: a record containing id, page, command, waiting.

### src/events.js:420

@function events.callback.80 — Returns a record containing id, name, activePage, conditions. Inputs: e. Uses: active page; e pages map. Returns: a record containing id, name, activePage, conditions.

### src/events.js:420

@function events.callback.81 — Returns a record containing page, passes, conditions. Inputs: p; i. Uses: active page. Returns: a record containing page, passes, conditions.

### src/events.js:421

@function events.next.82 — Handles next within events. Inputs: no explicit arguments; uses enclosing module state. Uses: respond. Returns: respond using a callback.

### src/events.js:421

@function events.callback.83 — Provides the callback for respond. Inputs: no explicit arguments; uses enclosing module state. Uses: publish message. Returns: without a result.

### src/events.js:423

@function events.busy.84 — Handles busy within events. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of the inverse of chain or the inverse of the inverse of main context execution and main context execution trigger does not equal "parallel".

### src/events.js:426

@function events.message.85 — Handles message within events. Inputs: no explicit arguments; uses enclosing module state. Returns: chain or null.

### src/flight.js:4

@function flight.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier flight.

### src/flight.js:10

@function flight.validate.2 — Authoring ranges keep velocities and altitude finite. Inputs: assignment pattern. Uses: a list of "ground", "hover", "flight" includes; object keys using defaults filter using a callback some; object keys using defaults filter; object keys. Returns: v.

### src/flight.js:16

@function flight.callback.3 — Returns k does not equal "mode". Inputs: k. Returns: k does not equal "mode".

### src/flight.js:16

@function flight.callback.4 — Returns the inverse of number is finite using v at k. Inputs: k. Uses: number is finite. Returns: the inverse of number is finite using v at k.

### src/flight.js:19

@function flight.update.5 — Return false for ground physics; otherwise own the actor vertical position. Inputs: actor; world; dt; assignment pattern; assignment pattern. Updates: actor flight velocity; actor z; actor grounded; actor vertical velocity; actor ground z. Uses: root frontier terrain height. Returns: false; true.

### src/fog.js:4

@function fog.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier fog. Uses: object freeze.

### src/fog.js:7

@function fog.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: number is finite; /^#[0-9a-f]{6}$/i test; error; f color to lower case. Returns: a record containing enabled, start, end, color.

### src/fog.js:12

@function fog.settings.3 — Handles settings within fog. Inputs: game. Returns: game fog override or game source world fog or defaults.

### src/fog.js:14

@function fog.amount.4 — Quantized opacity gives a bounded reusable GPU/palette cache (17 levels). Inputs: f; depth. Returns: f enabled selects math round using math max using 0, math min using 1, depth minus f start divided by f end minus f start multiplied by 16 divided by 16 or 0.

### src/fog.js:15

@function fog.setRuntime.5 — Handles set runtime within fog. Inputs: game; value. Updates: game fog override. Uses: validate; settings.

### src/fog.js:16

@function fog.clearRuntime.6 — Handles clear runtime within fog. Inputs: game. Updates: game fog override.

### src/gameplay-commands.js:4

@function gameplay-commands.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier gameplay commands. Uses: root frontier event runtime register; object freeze.

### src/gameplay-commands.js:6

@function gameplay-commands.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: object has own; a list of "set", "add", "remove" includes; error; a list of "skill", "reputation", "inventory" includes. Returns: without a result.

### src/gameplay-commands.js:11

@function gameplay-commands.execute.3 — Handles execute within gameplay commands. Inputs: c; object pattern. Updates: value. Uses: error; map delete; map get; number is finite. Returns: without a result; without a result.

### src/gameplay-defaults.js:3

@function gameplay-defaults.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier gameplay defaults.

### src/gameplay-defaults.js:4

@function gameplay-defaults.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Uses: error; root frontier event state validate; number is finite; root frontier event schema json. Returns: a record containing schema, copied fields, extensions.

### src/gameplay-defaults.js:5

@function gameplay-defaults.open.3 — Handles open within gameplay defaults. Inputs: initial; accept. Updates: d id; d class name; d inner html; section dataset collection; legend text content. Uses: validate; document create element; d set attribute; input.

### src/gameplay-defaults.js:6

@function gameplay-defaults.input.4 — Handles input within gameplay defaults. Inputs: parent; label; type; value. Updates: l text content; i type; i value; i step. Uses: document create element; i set attribute; l append; parent append. Returns: i.

### src/gameplay-defaults.js:9

@function gameplay-defaults.row.5 — Handles row within gameplay defaults. Inputs: assignment pattern; assignment pattern. Updates: container class name; key input max length; kind value; member value; kind onchange. Uses: document create element; input; kind set attribute; kind append.

### src/gameplay-defaults.js:9

@function gameplay-defaults.refresh.6 — Handles refresh within gameplay defaults. Inputs: no explicit arguments; uses enclosing module state. Updates: val parent element hidden; member hidden; val type.

### src/gameplay-defaults.js:9

@function gameplay-defaults.onclick.7 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: rows splice; rows index of; container remove.

### src/gameplay-defaults.js:10

@function gameplay-defaults.onclick.8 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: status text content. Uses: row. Returns: without a result.

### src/gameplay-defaults.js:12

@function gameplay-defaults.onclick.9 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: result at collection; status text content. Uses: d close; party value split using "," map using a callback filter; party value split using "," map; party value split. Returns: without a result.

### src/gameplay-defaults.js:12

@function gameplay-defaults.callback.10 — Returns s trim using . Inputs: s. Uses: s trim. Returns: s trim using .

### src/gameplay-defaults.js:12

@function gameplay-defaults.callback.11 — Returns a list of r key input value, r kind value equals "boolean" selects r member value equals "true" or r kind value equals "number" selects + r val value or r val value. Inputs: r. Returns: a list of r key input value, r kind value equals "boolean" selects r member value equals "true" or r kind value equals "number" selects + r val value or r val value.

### src/gameplay-defaults.js:12

@function gameplay-defaults.onclose.12 — Releases or restores dialog state after closing. Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using .

### src/gameplay-dialogs.js:2

@function gameplay-dialogs.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier gameplay dialogs.

### src/gameplay-dialogs.js:4

@function gameplay-dialogs.open.2 — Handles open within gameplay dialogs. Inputs: initial; accept. Updates: d id; d class name; d inner html; key max length; domain value. Uses: structured clone; document create element; d set attribute; select.

### src/gameplay-dialogs.js:5

@function gameplay-dialogs.field.3 — Handles field within gameplay dialogs. Inputs: label; node. Updates: wrap text content. Uses: document create element; node set attribute; wrap append; d append. Returns: node.

### src/gameplay-dialogs.js:6

@function gameplay-dialogs.select.4 — Handles select within gameplay dialogs. Inputs: label; entries. Uses: field; document create element; s append. Returns: s.

### src/gameplay-dialogs.js:9

@function gameplay-dialogs.refresh.5 — Handles refresh within gameplay dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: operation query selector using "[value=\"add\"]" disabled; operation value; kind value; kind parent element hidden; value parent element hidden. Uses: a list of "skill", "reputation", "inventory" includes; operation query selector; number is finite.

### src/gameplay-dialogs.js:11

@function gameplay-dialogs.onclick.6 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: c value; status text content. Uses: d close; root frontier event runtime validate; accept. Returns: without a result.

### src/gameplay-dialogs.js:11

@function gameplay-dialogs.onclose.7 — Releases or restores dialog state after closing. Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using .

### src/gameplay-dialogs.js:13

@function gameplay-dialogs.summary.8 — Handles summary within gameplay dialogs. Inputs: c. Uses: string. Returns: names at c domain or c domain plus ": " plus c key plus " · " plus c operation plus c operation equals "remove" selects "" or " " plus string using c value.

### src/hub-fixtures.js:3

@function hub-fixtures.install — Inputs: root namespace. Publishes fixture builder; returns nothing and loads no assets.

### src/hub-fixtures.js:5

@function hub-fixtures.base — Inputs: stable seed. Returns empty 24x24 validated map with shared textured ground. Generated enemy/prop fixtures are cleared only in this new map.

### src/hub-fixtures.js:7

@function hub-fixtures.door — Inputs: ID, name, XY, destination map/arrival and optional style. Returns invisible self-targeted doorway event; no runtime mutation. Zone occupies a local 0.9x0.3x2.1 unit box.

### src/hub-fixtures.js:9

@function hub-fixtures.store — Inputs: ID/name/XY and store kind. Returns chest event with compact starting stock and public ownership. Inventories become per-instance saved records on first interaction.

### src/hub-fixtures.js:11

@function hub-fixtures.create — Inputs: none. Returns four independent new map records: hub/shop/protected home/wilderness. Linking uses named arrivals and explicit door styles; no existing map/test fixture is overwritten.

### src/hub-fixtures.js:11

@function hub-fixtures.assetByte — Inputs: decoded character. Returns GLB byte, no effects.

### src/hub-state.js:4

@function hub-state.install — Exposes pure validation and mutable gameplay operations. Inputs: root namespace. Returns: nothing; installs FrontierHubState. No allocations of model/sprite resources.

### src/hub-state.js:7

@function hub-state.settings — Validates cell cleanup and ownership-independent arrival settings. Inputs: optional settings record. Returns: normalized clone. Throws on invalid times/arrival values; world coordinates use X/Y horizontal and Z up.

### src/hub-state.js:15

@function hub-state.owner — Normalizes public/player/NPC ownership. Inputs: optional owner record. Returns: fresh record. Throws for invalid kind or missing NPC ID; does not implement theft consequences.

### src/hub-state.js:17

@function hub-state.item — Checks a compact item stack without decoding its shared assets. Inputs: stack record. Returns: sanitized clone with ownership. Throws for bad IDs/count/properties or oversized data. Properties remain extensible plain JSON.

### src/hub-state.js:17

@function hub-state.propertyJSON — Inputs: JSON key and property value. Returns serializable value, throws nonfinite or function/symbol/undefined data so import never silently loses item properties.

### src/hub-state.js:19

@function hub-state.empty — Creates fresh session-owned persistence. Inputs: none. Returns: a JSON-compatible empty store; no shared mutable arrays.

### src/hub-state.js:21

@function hub-state.validate — Reconstructs bounded saved cell state before adoption. Inputs: optional serialized store. Returns: a fresh normalized store. Throws on malformed/oversized records; never changes live state.

### src/hub-state.js:22

@function hub-state.validateStack — Validates each saved storage stack. Inputs: stack. Returns: normalized item; throws on invalid data, with no live effects.

### src/hub-state.js:27

@function hub-state.cell — Gets or initializes one compact cell record. Inputs: store and stable cell ID. Returns: mutable cell data; throws before inserting an invalid ID or exceeding 32 cells. Does not load world resources.

### src/hub-state.js:29

@function hub-state.drop — Commits a static stack at an already collision-checked location. Inputs: store, cell ID, stack, world-space point. Returns: new drop record; throws before mutation for invalid placement/capacity. Inventory subtraction is owned by the caller after successful commit.

### src/hub-state.js:31

@function hub-state.pickup — Removes one drop by stable instance ID. Inputs: store, cell ID, drop ID. Returns: removed stack or null if unavailable. Caller owns inventory credit; removal and credit must be synchronous to avoid duplicate pickups.

### src/hub-state.js:31

@function hub-state.findDrop — Locates the requested drop. Inputs: record. Returns: ID equality; no side effects.

### src/hub-state.js:33

@function hub-state.tick — Advances shared unpaused time and processes a bounded number of expired drops. Inputs: store, elapsed seconds, cell-policy map, maximum records (default 64). Returns: transfer count. Quest/protected/full-recovery records stay in their cell; no valuable item is silently deleted. No per-drop timers or hidden runtime objects remain after transfer.

### src/hub-state.js:49

@function hub-state.carry — Inputs: store, event inventory Map and stack. Returns nothing. Validates count/detail capacities before atomically crediting inventory; preserves per-stack properties/ownership/quest protection. No artwork retained.

### src/hub-state.js:51

@function hub-state.consume — Inputs: store, event inventory Map, item ID and fallback metadata. Returns one-unit stack, or throws insufficient count. Removes matching per-stack detail when available; legacy event-given items use shared fallback. No new runtime resource allocation.

### src/hub-state.js:51

@function hub-state.findCarried — Inputs: carried stack. Returns requested ID match, no mutation.

### src/hub-workbench.js:7

@function hub-workbench.install — Inputs: browser/global namespace. Publishes pure validation and UI/runtime factory. Returns nothing; no world is loaded at module evaluation.

### src/hub-workbench.js:11

@function hub-workbench.validateEvent — Inputs: hub event extension. Returns normalized door/container/merchant/pawnshop settings; throws malformed fields before import/adoption. World placement is owned by the event, zone transforms remain local.

### src/hub-workbench.js:11

@function hub-workbench.stockStack — Inputs: stock stack. Returns validated compact item; throws invalid quantities/ownership.

### src/hub-workbench.js:15

@function hub-workbench.dialog — Inputs: title and optional dismiss handler. Returns modal element with status/footer. Close removes it and restores pause through caller. All fields are large plain-language controls.

### src/hub-workbench.js:15

@function hub-workbench.closeDialog — Inputs: close event unused. Removes UI and calls optional dismissal; no persistent data changed.

### src/hub-workbench.js:19

@function hub-workbench.field — Inputs: parent, label, type, initial value and optional choices. Returns input/select/textarea and appends accessible label. Does not modify authored state.

### src/hub-workbench.js:23

@function hub-workbench.button — Inputs: parent, readable label and operation. Returns button. On error displays message in owning dialog; never commits a partial operation itself.

### src/hub-workbench.js:23

@function hub-workbench.buttonAction — Inputs: click unused. Calls operation; catches and displays failures. Returns nothing, no automated retries.

### src/hub-workbench.js:27

@function hub-workbench.finish — Inputs: modal and apply callback. Appends Apply/Cancel, opens modal. Apply closes only after successful operation; Cancel leaves drafts untouched.

### src/hub-workbench.js:27

@function hub-workbench.applyDialog — Inputs: none. Validates/commits via supplied operation then closes. Throws preserve draft for correction.

### src/hub-workbench.js:27

@function hub-workbench.cancelDialog — Inputs: none. Closes without applying draft; no persistent side effects.

### src/hub-workbench.js:31

@function hub-workbench.create — Inputs: application adapter providing getters, mutation, editor, travel, pause, sound preview. Returns authoring/runtime operations; mutable session stores remain owned by application. No independent timers are created.

### src/hub-workbench.js:35

@function hub-workbench.catalog — Inputs: item ID. Returns shared small definition or readable fallback. No image/model decode; unknown engine items remain droppable as a generic chest.

### src/hub-workbench.js:35

@function hub-workbench.findItem — Inputs: catalog entry. Returns matching stable ID; no effects.

### src/hub-workbench.js:39

@function hub-workbench.current — Inputs: none. Returns session store and current cell state. Lazy initialization is bounded by the hub store's 32-cell limit.

### src/hub-workbench.js:43

@function hub-workbench.cellSettings — Inputs: none. Opens a private cell policy draft including named arrivals, atmosphere and default transition. Apply uses undoable world mutation; Cancel changes nothing.

### src/hub-workbench.js:45

@function hub-workbench.addArrival — Inputs: none. Adds a named point to the private JSON draft at player XY/yaw. Does not alter world until Apply.

### src/hub-workbench.js:47

@function hub-workbench.applyCell — Inputs: none. Validates policy, fog and light before undoable mutation. Returns nothing. Each cell carries its own settings through export/import.

### src/hub-workbench.js:47

@function hub-workbench.commitCell — Inputs: none. Assigns prevalidated cell settings, fog and transition mode to current authored world; caller records undo.

### src/hub-workbench.js:53

@function hub-workbench.doorSettings — Inputs: placement point and optional existing event. Opens destination, zone and transition draft. Selecting Apply creates/updates an invisible event through the existing event draft, requiring its final Apply as usual.

### src/hub-workbench.js:53

@function hub-workbench.mapOption — Inputs: map. Returns name/ID option pair; no effects.

### src/hub-workbench.js:59

@function hub-workbench.openLeaves — Inputs: click unused. Opens a private numeric composition editor; applying changes only the parent draft until final event Apply.

### src/hub-workbench.js:63

@function hub-workbench.leafModel — Inputs: shared model. Returns name/ID option; no loading or mutation.

### src/hub-workbench.js:69

@function hub-workbench.applyLeaves — Inputs: none. Reads at most two leaf controls into validated local-space draft. Throws invalid values without modifying original event.

### src/hub-workbench.js:69

@function hub-workbench.leafNumber — Inputs: numeric control. Returns number for validation; no effects.

### src/hub-workbench.js:73

@function hub-workbench.openFrame — Inputs: none. Opens frame-only/door-only selection without touching source geometry. Returns nothing.

### src/hub-workbench.js:73

@function hub-workbench.frameModel — Inputs: shared asset. Returns option pair without decode.

### src/hub-workbench.js:73

@function hub-workbench.applyFrame — Inputs: none. Validates frame selection and replaces only parent draft; final event Apply persists.

### src/hub-workbench.js:75

@function hub-workbench.soundOption — Inputs: manifest entry. Returns readable name pair; no decode/effects.

### src/hub-workbench.js:79

@function hub-workbench.readDoor — Inputs: none. Returns validated private transition configuration; throws malformed draft before preview or mutation.

### src/hub-workbench.js:81

@function hub-workbench.previewDoor — Inputs: none. Validates private settings and plays presentation only; no map/state change.

### src/hub-workbench.js:81

@function hub-workbench.hingedPreset — Inputs: none. Replaces private frame/leaves draft with supplied 176-triangle composition.

### src/hub-workbench.js:83

@function hub-workbench.applyDoor — Inputs: none. Validates destination/zone and opens event draft with extension metadata. Existing event pages remain intact. Never makes the building mesh itself clickable.

### src/hub-workbench.js:83

@function hub-workbench.destination — Inputs: map record. Returns selected ID match; no effects.

### src/hub-workbench.js:83

@function hub-workbench.arrivalExists — Inputs: arrival. Returns selected ID match; no effects.

### src/hub-workbench.js:83

@function hub-workbench.roomArrival — Inputs: entrance. Returns selected ID match; no effects.

### src/hub-workbench.js:83

@function hub-workbench.travelArrival — Inputs: entrance. Returns selected ID match; no effects.

### src/hub-workbench.js:93

@function hub-workbench.storageSettings — Inputs: location and optional event. Opens reusable container/merchant/pawnshop definition; stock and ownership are validated before existing event draft opens. Runtime stock persists independently per stable event ID.

### src/hub-workbench.js:93

@function hub-workbench.applyStorage — Inputs: none. Validates private settings and opens an event draft; stock is copied only when first used in gameplay.

### src/hub-workbench.js:101

@function hub-workbench.placeTemplate — Inputs: terrain point. Offers saved definitions and opens an independent instance draft at point. Keeps source definitions and test maps unchanged.

### src/hub-workbench.js:101

@function hub-workbench.templateOption — Inputs: definition. Returns readable label and ID; no effects.

### src/hub-workbench.js:101

@function hub-workbench.applyTemplate — Inputs: none. Instantiates selected definition with a new identity at terrain XY and opens draft. Throws empty/missing template selection.

### src/hub-workbench.js:105

@function hub-workbench.dropItem — Inputs: ID and quantity default one. Returns new placed stack, or throws before inventory change. Places statically near feet at terrain/model support height; no rigid-body simulation or throwing.

### src/hub-workbench.js:109

@function hub-workbench.inventory — Inputs: inventory list. Appends clearly labeled drop-one buttons for event items. Built-in weapons/ammo retain combat ownership until item unification; no unsupported weapon dropping button is shown.

### src/hub-workbench.js:109

@function hub-workbench.inventoryDrop — Inputs: click unused. Commits one static drop; outer button catches failure.

### src/hub-workbench.js:113

@function hub-workbench.tick — Inputs: unpaused elapsed seconds. Processes budgeted cleanup once per second and refreshes active-cell render references only on change. No cleanup during authoring/pause; no distant runtime entities retained.

### src/hub-workbench.js:113

@function hub-workbench.dropEntity — Inputs: compact drop. Returns active render/pick reference using shared item graphic/model. Never allocates textures or creates collision/timers.

### src/hub-workbench.js:117

@function hub-workbench.storageDialog — Inputs: event and validated hub metadata. Opens paused stock/trade panel with prices. Container takes/deposits, merchant buys/sells and pawn shop recovers compact stacks. Mutations remain synchronous; full inventory/recovery never discards records silently.

### src/hub-workbench.js:117

@function hub-workbench.resumeStorage — Inputs: none. Releases menu pause; no stock changes.

### src/hub-workbench.js:121

@function hub-workbench.refreshStorage — Inputs: none. Rebuilds panel after committed operation. Shows quantities, prices and current gold; returns nothing. No per-frame rebuild.

### src/hub-workbench.js:121

@function hub-workbench.takeStock — Inputs: none. Debits price and transfers one stack unit to event inventory; depleted stock removed. Throws before mutation for insufficient funds.

### src/hub-workbench.js:121

@function hub-workbench.depositStock — Inputs: none. Transfers one carried item to this container/shop after capacity check. Merchant credits catalog sale value; properties extensibility remains in stock records.

### src/hub-workbench.js:123

@function hub-workbench.closeStorage — Inputs: none. Closes panel and resumes through close handler; no implicit transaction.

### src/hub-workbench.js:129

@function hub-workbench.interact — Inputs: reachable engine hit. Returns true if this service handled drop/door/storage; otherwise false so event commands run normally. Door travel validates arrival through existing transfer owner.

### src/hub-workbench.js:129

@function hub-workbench.pickupRecord — Inputs: compact drop. Returns ID match; no mutation.

### src/hub-workbench.js:133

@function hub-workbench.diagnostics — Inputs: none. Opens on-demand counts and encoded/decoded texture estimates. Lists visited cells without loading assets; no expensive per-frame serialization.

### src/hub-workbench.js:133

@function hub-workbench.closeDiagnostics — Inputs: none. Removes diagnostics without changing state.

### src/input.js:5

@function input.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier input.

### src/input.js:8

@function input.stick.2 — Apply a radial deadzone and normalize controller magnitude so diagonal input stays bounded. Inputs: assignment pattern; assignment pattern; assignment pattern. Updates: x; y. Uses: number is finite. Returns: a record containing x, y; a record containing x, y.

### src/input.js:23

@function input.gamepadReader.3 — Remember prior button states to emit one-shot actions while keeping continuous move/look/fire values. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing poll.

### src/input.js:26

@function input.poll.4 — Handles poll within keyboard, mouse and controller input. Inputs: pads; assignment pattern. Updates: identity; previous. Uses: array from using pads or a list of find; array from; previous clear; pad buttons map using a callback filter. Returns: a record containing connected, actions, move, look, sprint; a record containing connected, name, actions, move, look, fireHeld, sprint.

### src/input.js:27

@function input.callback.5 — Returns chain and p mapping equals "standard". Inputs: p. Returns: chain and p mapping equals "standard".

### src/input.js:47

@function input.callback.6 — Returns b pressed or b value is greater than 0.5 selects i or - 1. Inputs: b; i. Returns: b pressed or b value is greater than 0.5 selects i or - 1.

### src/input.js:47

@function input.callback.7 — Returns i is at least 0. Inputs: i. Returns: i is at least 0.

### src/input.js:52

@function input.callback.8 — Returns the inverse of previous has using i and bindings at i. Inputs: i. Uses: previous has. Returns: the inverse of previous has using i and bindings at i.

### src/input.js:52

@function input.callback.9 — Returns bindings at i. Inputs: i. Returns: bindings at i.

### src/input.js:73

@function input.mouseLook.10 — Track a motion baseline for unlocked look and relative deltas for captured look. Reset on mode/focus changes. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing reset, motion.

### src/input.js:76

@function input.reset.11 — Handles reset within keyboard, mouse and controller input. Inputs: no explicit arguments; uses enclosing module state. Updates: previous.

### src/input.js:80

@function input.motion.12 — Handles motion within keyboard, mouse and controller input. Inputs: event; locked; enabled. Updates: previous. Returns: a record containing x, y; a record containing x, y.

### src/inspection.js:5

@function inspection.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier inspection. Uses: document get element by id; screen add event listener.

### src/inspection.js:6

@function inspection.callback.2 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: hover. Returns: assignment.

### src/inspection.js:6

@function inspection.callback.3 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: hover. Returns: assignment.

### src/inspection.js:7

@function inspection.callback.4 — Provides the callback for screen add event listener. Inputs: event. Updates: screen scroll top; position; manual. Uses: document get element by id using "gameFrame" class list contains; document get element by id; event prevent default; event stop propagation. Returns: without a result.

### src/inspection.js:8

@function inspection.update.5 — Advances this system using the current state and elapsed time. Inputs: point mode. Updates: last; text; changed; ended; screen scroll top. Uses: performance now. Returns: without a result.

### src/interiors.js:3

@function interiors.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier interior.

### src/interiors.js:8

@function interiors.number.2 — Returns number is finite using v and v is at least min and v is at most max. Inputs: v; min; max. Uses: number is finite. Returns: number is finite using v and v is at least min and v is at most max.

### src/interiors.js:9

@function interiors.asset.3 — Returns typeof v equals "string" and v length is less than 16000000 and /^(img\/|data:image\/(png|jpeg|webp);base64,)/ test using v and the inverse of v includes using "..". Inputs: v. Uses: /^(img\/|data:image\/(png|jpeg|webp);base64,)/ test; v includes. Returns: typeof v equals "string" and v length is less than 16000000 and /^(img\/|data:image\/(png|jpeg|webp);base64,)/ test using v and the inverse of v includes using "..".

### src/interiors.js:10

@function interiors.polygon.4 — Handles polygon within interior rooms and their camera. Inputs: p; bounds. Updates: area. Uses: array is array; p some; error; cross. Returns: p map using a callback.

### src/interiors.js:10

@function interiors.callback.5 — Returns the inverse of array is array using v or v length does not equal 2 or the inverse of number using v at 0, 0.5, bounds width minus 0.5 or the inverse of number using v at 1, 0.5, bounds height minus 0.5. Inputs: v. Uses: array is array; number. Returns: the inverse of array is array using v or v length does not equal 2 or the inverse of number using v at 0, 0.5, bounds width minus 0.5 or the inverse of number using v at 1, 0.5, bounds height minus 0.5.

### src/interiors.js:11

@function interiors.cross.6 — Returns v at 0 minus u at 0 multiplied by w at 1 minus u at 1 minus v at 1 minus u at 1 multiplied by w at 0 minus u at 0. Inputs: u; v; w. Returns: v at 0 minus u at 0 multiplied by w at 1 minus u at 1 minus v at 1 minus u at 1 multiplied by w at 0 minus u at 0.

### src/interiors.js:11

@function interiors.callback.7 — Returns a list of spread element. Inputs: v. Returns: a list of spread element.

### src/interiors.js:12

@function interiors.validate.8 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: v; bounds. Updates: r light; r floor; r at key. Uses: a list of "fixed", "geometry" includes; asset; number; error. Returns: undefined; a record containing mode, image, copied fields, light, imageWidth, imageHeight, camera, floor.

### src/interiors.js:15

@function interiors.callback.9 — Provides the callback for r at key map. Inputs: e. Uses: /^[a-z0-9_-]{1,64}$/i test; ids has; number; error. Returns: o.

### src/interiors.js:16

@function interiors.callback.10 — Returns a list of k, r at k. Inputs: k. Returns: a list of k, r at k.

### src/interiors.js:17

@function interiors.inside.11 — Handles inside within interior rooms and their camera. Inputs: p; x; y. Updates: j; yes. Returns: yes.

### src/interiors.js:18

@function interiors.segmentDistance.12 — Handles segment distance within interior rooms and their camera. Inputs: x; y; a; b. Returns: math hypot using x minus a at 0 minus dx multiplied by t, y minus a at 1 minus dy multiplied by t.

### src/interiors.js:19

@function interiors.data.13 — Handles data within interior rooms and their camera. Inputs: w. Updates: c. Uses: cache get; r floor map; a list of spread element, spread element map; r primitives filter. Returns: null; c.

### src/interiors.js:19

@function interiors.callback.14 — Returns a list of a, r floor at i plus 1 % r floor length. Inputs: a; i. Returns: a list of a, r floor at i plus 1 % r floor length.

### src/interiors.js:19

@function interiors.callback.15 — Returns e h is greater than 0.3. Inputs: e. Returns: e h is greater than 0.3.

### src/interiors.js:19

@function interiors.callback.16 — Returns a record containing copied fields, x0, x1, y0, y1. Inputs: e. Returns: a record containing copied fields, x0, x1, y0, y1.

### src/interiors.js:20

@function interiors.callback.17 — Returns n plus p at 0. Inputs: n; p. Returns: n plus p at 0.

### src/interiors.js:20

@function interiors.callback.18 — Returns n plus p at 1. Inputs: n; p. Returns: n plus p at 1.

### src/interiors.js:20

@function interiors.callback.19 — Returns n plus p at 2. Inputs: n; p. Returns: n plus p at 2.

### src/interiors.js:21

@function interiors.blocked.20 — Tests whether the proposed movement or location meets a solid obstacle. Inputs: w; x; y; assignment pattern; assignment pattern. Uses: data; inside; c edges some; room exits some. Returns: false; true.

### src/interiors.js:21

@function interiors.callback.21 — Returns segment distance using x, y, a is less than r. Inputs: array pattern. Uses: segment distance. Returns: segment distance using x, y, a is less than r.

### src/interiors.js:21

@function interiors.callback.22 — Returns the inverse of inside using room floor, e x, e y and math hypot using x minus e x, y minus e y is less than e radius plus r and c edges some using a callback. Inputs: e. Uses: inside; c edges some. Returns: the inverse of inside using room floor, e x, e y and math hypot using x minus e x, y minus e y is less than e radius plus r and c edges some using a callback.

### src/interiors.js:21

@function interiors.callback.23 — Returns segment distance using e x, e y, a is less than e radius. Inputs: array pattern. Uses: segment distance. Returns: segment distance using e x, e y, a is less than e radius.

### src/interiors.js:21

@function interiors.callback.24 — Returns x plus r is greater than e x0 and x minus r is less than e x1 and y plus r is greater than e y0 and y minus r is less than e y1 and e h equals undefined or z is less than e z plus e h minus 0.001 and z plus 1.65 is greater than e z. Inputs: e. Returns: x plus r is greater than e x0 and x minus r is less than e x1 and y plus r is greater than e y0 and y minus r is less than e y1 and e h equals undefined or z is less than e z plus e h minus 0.001 and z plus 1.65 is greater than e z.

### src/interiors.js:21

@function interiors.callback.25 — Returns e radius and math hypot using x minus e x, y minus e y is less than r plus e radius. Inputs: e. Returns: e radius and math hypot using x minus e x, y minus e y is less than r plus e radius.

### src/interiors.js:22

@function interiors.camera.26 — Calculates the camera view or constrains its position against this module’s solid geometry. Inputs: game. Returns: null; a record containing orthographic, x, y, z, yaw, pitch, cx, cy.

### src/interiors.js:23

@function interiors.project.27 — Converts a world-space position into this renderer’s screen-space representation. Inputs: cam; x; y; assignment pattern. Returns: a record containing x, y, scale, depth.

### src/interiors.js:24

@function interiors.groundPoint.28 — Handles ground point within interior rooms and their camera. Inputs: cam; sx; sy. Returns: a record containing x, y.

### src/interiors.js:27

@function interiors.aim.29 — supplies its center; empty artwork supplies an orthographic plane point. Inputs: game; sx; sy. Uses: camera; root frontier render pick; ground point. Returns: null; a record containing x, y, z.

### src/interiors.js:28

@function interiors.nearClip.30 — Handles near clip within interior rooms and their camera. Inputs: cam; vertices. Uses: depth; out push; a map. Returns: out.

### src/interiors.js:28

@function interiors.depth.31 — Returns p at 0 minus cam x multiplied by math sin using cam yaw plus p at 1 minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus p at 2 minus cam z multiplied by math sin using cam pitch. Inputs: p. Returns: p at 0 minus cam x multiplied by math sin using cam yaw plus p at 1 minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus p at 2 minus cam z multiplied by math sin using cam pitch.

### src/interiors.js:28

@function interiors.callback.32 — Returns n plus b at k minus n multiplied by t. Inputs: n; k. Returns: n plus b at k minus n multiplied by t.

### src/interiors.js:29

@function interiors.image.33 — Handles image within interior rooms and their camera. Inputs: src. Updates: im src. Uses: images has; images set; images delete; images keys using next. Returns: null; images get using src.

### src/interiors.js:30

@function interiors.background.34 — Handles background within interior rooms and their camera. Inputs: ctx; game; cam. Updates: ctx vector display; ctx asset normal; ctx asset light. Uses: image; ctx draw image. Returns: without a result.

### src/interiors.js:31

@function interiors.furniture.35 — Handles furniture within interior rooms and their camera. Inputs: ctx; e; p. Updates: ctx asset normal; ctx asset light. Uses: image; ctx draw image. Returns: without a result.

### src/interiors.js:32

@function interiors.outline.36 — Handles outline within interior rooms and their camera. Inputs: ctx; w; cam; project. Updates: ctx vector display; ctx fog depth; ctx fill style; ctx font. Uses: line; data; project; r exits includes. Returns: without a result.

### src/interiors.js:32

@function interiors.line.37 — Handles line within interior rooms and their camera. Inputs: points; color. Updates: ctx stroke style; ctx line width; begun. Uses: ctx begin path; project; ctx at begun selects "lineTo" or "moveTo"; ctx stroke.

### src/interiors.js:33

@function interiors.testWorld.38 — Handles test world within interior rooms and their camera. Inputs: base; assignment pattern. Updates: w width; w height; w size; w objects; w events. Uses: structured clone; frontier terrain validate; frontier water validate; frontier sky validate. Returns: frontier world validate using w.

### src/legacy/combat.js:12

@function combat.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf resolve projectile impact; mf toggle holster; mf reload; mf fire shot.

### src/legacy/combat.js:23

@function combat.toggleHolster.2 — SPACE key: toggle equipped pistol between holstered and drawn. Inputs: game; ui. Updates: game player holstered; game player facing x; game player facing y. Uses: ui log; mf update aim; game audio play at; ui update weapon hud. Returns: without a result.

### src/legacy/combat.js:51

@function combat.reload.3 — R key: move reserve rounds into the current magazine up to magazineSize. Inputs: game; ui. Updates: p ammo loaded; p ammo reserve. Uses: ui log; game audio play at; set timeout; ui update weapon hud. Returns: without a result; without a result.

### src/legacy/combat.js:81

@function combat.callback.4 — Returns chain. Inputs: no explicit arguments; uses enclosing module state. Uses: game audio play at. Returns: chain.

### src/legacy/combat.js:95

@function combat.randomNormal.5 — Gaussian random number used for natural-looking shot scatter. Inputs: no explicit arguments; uses enclosing module state. Updates: u; v. Returns: math sqrt using - 2 multiplied by math log using u multiplied by math cos using 2 multiplied by math pi multiplied by v.

### src/legacy/combat.js:103

@function combat.addGroundHole.6 — Persist a small ground impact mark, capped so the array cannot grow forever. Inputs: game; x; y. Uses: game bullet holes push; game bullet holes shift.

### src/legacy/combat.js:115

@function combat.spawnBloodBurst.7 — Emit directional blood particles. `forceX/forceY` is normally the bullet direction from shooter -> target, so the spray reads as impact rather than a symmetric fireworks burst. Inputs: game; e; force x; force y; assignment pattern; assignment pattern. Uses: game particles push.

### src/legacy/combat.js:154

@function combat.addDeathPool.8 — Put a larger pooled stain under a killed target immediately. Inputs: game; e; dir x; dir y. Uses: game blood stains push; game blood stains shift.

### src/legacy/combat.js:173

@function combat.provokeFaction.9 — Attacking one faction member flips the lightweight world faction record. This is intentionally not a full reputation system yet; it is enough to prove shared hostility without hard-coding specific actor ids into AI. Inputs: game; e; ui. Updates: game world factions; game world factions at e faction; f reputation; f status; f hostile. Uses: game runtime events emit; ui log. Returns: without a result; without a result.

### src/legacy/combat.js:197

@function combat.updateKillGroup.10 — Record authored kill-groups so content can react after a whole local group dies. Inputs: game; e. Updates: game world kill groups; game world kill groups at group; state killed at e id; state cleared; game world flags. Uses: object values; object keys; game runtime events emit. Returns: without a result; without a result.

### src/legacy/combat.js:240

@function combat.hitMonster.11 — Apply one 9mm hit and begin knock-down physics at 0 HP. Inputs: game; e; ui; damage; shot. Updates: e hp; e hit vx; e hit vy; e stun time; e dead. Uses: game runtime entities get; number; game runtime events emit; spawn blood burst. Returns: without a result.

### src/legacy/combat.js:305

@function combat.breakBottle.12 — Destroy a bottle and emit pixel-glass debris. Inputs: game; e; ui. Updates: e alive. Uses: game runtime events emit; game particles push; ui log.

### src/legacy/combat.js:335

@function combat.dropRandomLoot.13 — === EDIT HERE: CRATE LOOT TABLE === Current probabilities: 42% ammo / 34% scrip / 24% junk. Inputs: game; e. Updates: item id; amount; name; color. Uses: game runtime add entity.

### src/legacy/combat.js:385

@function combat.breakPhysicsBox.14 — Destroy a pushable box, emit material-colored debris, then spawn one loot drop. Inputs: game; e; ui. Updates: e alive. Uses: game runtime events emit; game particles push; drop random loot; game audio play at.

### src/legacy/combat.js:426

@function combat.resolveProjectileImpact.15 — Shared impact policy for every firing model. Ownership and direction come from the shot, not the player's current position/weapon. NPCs retain the prototype's protected status but still physically stop a projectile. Inputs: game; shot; hit; ui. Updates: target hp. Uses: game runtime entities get; provoke faction; hit monster; break bottle.

### src/legacy/combat.js:466

@function combat.fireShot.16 — Mouse picking supplies a body's ground center when pointing at its sprite. Otherwise invert the isometric projection. Random angular spread changes the physical trajectory; damage always waits for a swept contact. No hit roll. Inputs: game; mx; my; ui. Updates: dx; dy; p facing x; p facing y. Uses: game audio play at; ui log; hit test; screen to iso. Returns: false; true.

### src/legacy/geometry.js:12

@function geometry.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root mfgeometry.

### src/legacy/geometry.js:14

@function geometry.clone.2 — Handles clone within geometry. Inputs: value. Uses: structured clone; json parse; json stringify. Returns: typeof structured clone equals "function" selects structured clone using value or json parse using json stringify using value.

### src/legacy/geometry.js:19

@function geometry.geometryForDefinition.3 — Handles geometry for definition within geometry. Inputs: definition. Uses: array is array. Returns: a record containing blocking, sort, hotZones, depth; a record containing blocking, sort, hotZones, depth.

### src/legacy/geometry.js:51

@function geometry.normalizePolygon.4 — Handles normalize polygon within geometry. Inputs: polygon; assignment pattern. Updates: copy id; copy space; copy points. Uses: clone; array is array; copy points map using a callback filter; copy points map. Returns: copy.

### src/legacy/geometry.js:59

@function geometry.callback.5 — Returns a record containing x, y. Inputs: point. Uses: number. Returns: a record containing x, y.

### src/legacy/geometry.js:65

@function geometry.callback.6 — Returns number is finite using point x and number is finite using point y. Inputs: point. Uses: number is finite. Returns: number is finite using point x and number is finite using point y.

### src/legacy/geometry.js:70

@function geometry.localGroundToWorld.7 — Handles local ground to world within geometry. Inputs: instance; point. Uses: number. Returns: a record containing x, y.

### src/legacy/geometry.js:77

@function geometry.worldGroundToLocal.8 — Handles world ground to local within geometry. Inputs: instance; point. Uses: number. Returns: a record containing x, y.

### src/legacy/geometry.js:84

@function geometry.worldBlockingPolygons.9 — Handles world blocking polygons within geometry. Inputs: instance; definition. Uses: geometry for definition using definition blocking map using a callback filter using a callback map; geometry for definition using definition blocking map using a callback filter; geometry for definition using definition blocking map; geometry for definition. Returns: geometry for definition using definition blocking map using a callback filter using a callback map using a callback.

### src/legacy/geometry.js:86

@function geometry.callback.10 — Returns normalize polygon using polygon, "ground". Inputs: polygon. Uses: normalize polygon. Returns: normalize polygon using polygon, "ground".

### src/legacy/geometry.js:88

@function geometry.callback.11 — Returns polygon space equals "ground" and polygon points length is at least 3. Inputs: polygon. Returns: polygon space equals "ground" and polygon points length is at least 3.

### src/legacy/geometry.js:90

@function geometry.callback.12 — Returns a record containing copied fields, points. Inputs: polygon. Uses: polygon points map. Returns: a record containing copied fields, points.

### src/legacy/geometry.js:92

@function geometry.callback.13 — Returns local ground to world using instance, point. Inputs: point. Uses: local ground to world. Returns: local ground to world using instance, point.

### src/legacy/geometry.js:98

@function geometry.pointInPolygon.14 — Handles point in polygon within geometry. Inputs: point; points. Updates: j; inside. Uses: array is array; number. Returns: false; inside.

### src/legacy/geometry.js:117

@function geometry.orientation.15 — Handles orientation within geometry. Inputs: a; b; c. Uses: number. Returns: 0; value is greater than 0 selects 1 or 2.

### src/legacy/geometry.js:124

@function geometry.onSegment.16 — Handles on segment within geometry. Inputs: a; b; c. Uses: number. Returns: number using b x is at most math max using number using a x, number using c x plus 1e-9 and number using b x plus 1e-9 is at least math min using number using a x, number using c x and number using b y is at most math max using number using a y, number using c y plus 1e-9 and number using b y plus 1e-9 is at least math min using number using a y, number using c y.

### src/legacy/geometry.js:132

@function geometry.segmentsIntersect.17 — Handles segments intersect within geometry. Inputs: p1; q1; p2; q2. Uses: orientation; on segment. Returns: true; true.

### src/legacy/geometry.js:144

@function geometry.distancePointToSegment.18 — Handles distance point to segment within geometry. Inputs: point; a; b. Uses: number. Returns: math hypot using px minus ax, py minus ay; math hypot using px minus ax plus t multiplied by dx, py minus ay plus t multiplied by dy.

### src/legacy/geometry.js:161

@function geometry.pointNearPolygon.19 — Handles point near polygon within geometry. Inputs: point; points; assignment pattern. Updates: i. Uses: point in polygon; number; array is array; distance point to segment. Returns: true; false.

### src/legacy/geometry.js:179

@function geometry.polygonOverlapsRect.20 — Handles polygon overlaps rect within geometry. Inputs: points; rect. Updates: i. Uses: array is array; corners some; points some; segment intersects polygon. Returns: false; true.

### src/legacy/geometry.js:199

@function geometry.callback.21 — Returns point in polygon using p, points. Inputs: p. Uses: point in polygon. Returns: point in polygon using p, points.

### src/legacy/geometry.js:202

@function geometry.callback.22 — Returns p x is at least rect x1 and p x is at most rect x2 and p y is at least rect y1 and p y is at most rect y2. Inputs: p. Returns: p x is at least rect x1 and p x is at most rect x2 and p y is at least rect y1 and p y is at most rect y2.

### src/legacy/geometry.js:215

@function geometry.segmentIntersectsPolygon.23 — Handles segment intersects polygon within geometry. Inputs: a; b; points. Updates: i. Uses: array is array; point in polygon; segments intersect. Returns: false; true.

### src/legacy/geometry.js:227

@function geometry.movementBlocked.24 — Handles movement blocked within geometry. Inputs: instance; definition; from point; to point. Uses: world blocking polygons using instance, definition some; world blocking polygons. Returns: world blocking polygons using instance, definition some using a callback.

### src/legacy/geometry.js:228

@function geometry.callback.25 — Returns segment intersects polygon using from point, to point, polygon points. Inputs: polygon. Uses: segment intersects polygon. Returns: segment intersects polygon using from point, to point, polygon points.

### src/legacy/geometry.js:232

@function geometry.rectangleFromFootprint.26 — Handles rectangle from footprint within geometry. Inputs: footprint. Uses: number. Returns: a list of a record containing x, y, a record containing x, y, a record containing x, y, a record containing x, y.

### src/legacy/geometry.js:254

@function geometry.polygonBounds.27 — Handles polygon bounds within geometry. Inputs: points. Uses: array is array; points map. Returns: null; a record containing minX, minY, maxX, maxY.

### src/legacy/geometry.js:256

@function geometry.callback.28 — Returns number using p x or 0. Inputs: p. Uses: number. Returns: number using p x or 0.

### src/legacy/geometry.js:257

@function geometry.callback.29 — Returns number using p y or 0. Inputs: p. Uses: number. Returns: number using p y or 0.

### src/legacy/projectiles.js:14

@function projectiles.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf create projectile; mf sweep projectile; mf update projectiles; mf resolve hitscan; mf projectile geometry.

### src/legacy/projectiles.js:17

@function projectiles.dot.2 — Returns a x multiplied by b x plus a y multiplied by b y. Inputs: a; b. Returns: a x multiplied by b x plus a y multiplied by b y.

### src/legacy/projectiles.js:18

@function projectiles.sub.3 — Returns a record containing x, y. Inputs: a; b. Returns: a record containing x, y.

### src/legacy/projectiles.js:23

@function projectiles.circleHit.4 — Earliest t in [0,1] at which segment a→b enters a circle; null = miss. Inputs: a; b; c; r. Uses: sub; dot. Returns: 0; null.

### src/legacy/projectiles.js:40

@function projectiles.edgeHit.5 — Capsule intersection for a polygon edge: endpoint circles plus both sides of the edge's radius-wide strip. This retains rounded disk collision at corners instead of overblocking with a rectangular broad-phase expansion. Inputs: a; b; u; v; r. Uses: take; circle hit; sub; dot. Returns: best; best.

### src/legacy/projectiles.js:42

@function projectiles.take.6 — Handles take within projectiles. Inputs: t. Updates: best.

### src/legacy/projectiles.js:75

@function projectiles.polygonHit.7 — Union edge capsules with the filled polygon; supports concave blockers and returns an immediate hit for shots spawned inside solid geometry. Inputs: a; b; points; r. Updates: best. Uses: window mfgeometry point in polygon; edge hit. Returns: 0; best.

### src/legacy/projectiles.js:86

@function projectiles.rectPoints.8 — Returns a list of a record containing x, y, a record containing x, y, a record containing x, y, a record containing x, y. Inputs: z. Returns: a list of a record containing x, y, a record containing x, y, a record containing x, y, a record containing x, y.

### src/legacy/projectiles.js:107

@function projectiles.sweepProjectile.9 — Shared physical query for hitscan and projectiles. Visual picking only supplies an aim direction; it never decides whether a bullet caused damage. Inputs: game; p; a; b. Uses: grid get collision zones; take; polygon hit; rect points. Returns: null; hit.

### src/legacy/projectiles.js:111

@function projectiles.take.10 — Handles take within projectiles. Inputs: t; id; kind. Updates: hit.

### src/legacy/projectiles.js:164

@function projectiles.createProjectile.11 — Configuration is cloned into each shot: switching weapons cannot change a bullet already in flight. Range/lifetime cap travel before the sweep. Inputs: game; owner; weapon; direction. Returns: a record containing id, map, ownerId, weaponId, damage, damageType, position, previousPosition.

### src/legacy/projectiles.js:212

@function projectiles.emitTravel.12 — Records use world endpoints. Camera movement cannot detach a tracer. Inputs: game; p; a; b. Uses: game shot effects push; game shot effects shift. Returns: without a result.

### src/legacy/projectiles.js:236

@function projectiles.advance.13 — Move a projectile within remaining range/lifetime, resolve its first hit, and handle penetration or one scenery ricochet. Inputs: game; p; seconds; ui; assignment pattern. Updates: p previous position; p position; p distance travelled; p age. Uses: sweep projectile; emit travel; mf resolve projectile impact. Returns: false; false.

### src/legacy/projectiles.js:280

@function projectiles.updateProjectiles.14 — Handles update projectiles within projectiles. Inputs: game; dt; ui. Updates: game projectiles. Uses: game projectiles filter.

### src/legacy/projectiles.js:283

@function projectiles.callback.15 — Returns p map equals game current map id and advance using game, p, dt. Inputs: p. Uses: advance. Returns: p map equals game current map id and advance using game, p, dt.

### src/legacy/projectiles.js:289

@function projectiles.resolveHitscan.16 — Returns advance using game, p, 0. Inputs: game; p; ui. Uses: advance. Returns: advance using game, p, 0.

### src/map-identities.js:2

@function map-identities.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier map identities.

### src/map-identities.js:3

@function map-identities.assign.2 — Handles assign within map identities. Inputs: maps. Uses: number is integer; used has; error; used add. Returns: maps map using a callback.

### src/map-identities.js:3

@function map-identities.callback.3 — Provides the callback for maps map. Inputs: map. Uses: used has; error; used add. Returns: a record containing copied fields; a record containing copied fields, mzId.

### src/map-identities.js:4

@function map-identities.resolve.4 — Handles resolve within map identities. Inputs: maps; id. Uses: maps find. Returns: maps find using a callback.

### src/map-identities.js:4

@function map-identities.callback.5 — Returns map mz id equals id. Inputs: map. Returns: map mz id equals id.

### src/map-identities.js:5

@function map-identities.remapIncoming.6 — Handles remap incoming within map identities. Inputs: existing; incoming. Updates: c parameters at 1. Uses: existing map; assign using structured clone using incoming map; assign; structured clone. Returns: maps.

### src/map-identities.js:5

@function map-identities.callback.7 — Returns m mz id. Inputs: m. Returns: m mz id.

### src/map-identities.js:6

@function map-identities.callback.8 — Provides the callback for assign using structured clone using incoming map. Inputs: m. Uses: used has; mapping set; used add. Returns: a record containing copied fields, mzId.

### src/map-library.js:3

@function map-library.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier maps.

### src/map-library.js:4

@function map-library.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Uses: array is array; error; frontier map identities assign; value maps map. Returns: a record containing schema, active, maps, models, gameplayDefaults, templates.

### src/map-library.js:4

@function map-library.callback.3 — Provides the callback for value maps map. Inputs: m. Uses: /^[a-z0-9_-]{1,64}$/i test; ids has; m name trim; error. Returns: a record containing id, name, copied fields, world.

### src/map-library.js:4

@function map-library.callback.4 — Returns m id. Inputs: m. Returns: m id.

### src/map-library.js:5

@function map-library.database.5 — Handles database within map library. Inputs: no explicit arguments; uses enclosing module state. Returns: a new promise.

### src/map-library.js:5

@function map-library.callback.6 — Provides the callback for the enclosing map library operation. Inputs: resolve; reject. Updates: r onupgradeneeded; r onsuccess; r onerror. Uses: indexed db open.

### src/map-library.js:5

@function map-library.onupgradeneeded.7 — Returns r result create object store using "projects". Inputs: no explicit arguments; uses enclosing module state. Uses: r result create object store. Returns: r result create object store using "projects".

### src/map-library.js:5

@function map-library.onsuccess.8 — Returns resolve using r result. Inputs: no explicit arguments; uses enclosing module state. Uses: resolve. Returns: resolve using r result.

### src/map-library.js:5

@function map-library.onerror.9 — Returns reject using r error. Inputs: no explicit arguments; uses enclosing module state. Uses: reject. Returns: reject using r error.

### src/map-library.js:6

@function map-library.storage.10 — Handles storage within map library. Inputs: value. Uses: database; db close. Returns: await.

### src/map-library.js:6

@function map-library.callback.11 — Provides the callback for the enclosing map library operation. Inputs: resolve; reject. Updates: r onsuccess; tx oncomplete; tx onerror; tx onabort. Uses: db transaction; tx object store; store put; store get.

### src/map-library.js:6

@function map-library.onsuccess.12 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: result. Returns: assignment.

### src/map-library.js:6

@function map-library.oncomplete.13 — Returns resolve using result. Inputs: no explicit arguments; uses enclosing module state. Uses: resolve. Returns: resolve using result.

### src/map-library.js:6

@function map-library.onerror.14 — Returns reject using tx error. Inputs: no explicit arguments; uses enclosing module state. Uses: reject. Returns: reject using tx error.

### src/map-library.js:6

@function map-library.onabort.15 — Returns reject using tx error. Inputs: no explicit arguments; uses enclosing module state. Uses: reject. Returns: reject using tx error.

### src/map-library.js:7

@function map-library.create.16 — Builds a new instance and its public operations from the supplied configuration. Inputs: api. Updates: room interior exits; ruin interior exits; demo travel; demo objects; guide name. Uses: frontier gameplay defaults validate; frontier event templates empty; structured clone; api world. Returns: a record containing remember, switchTo, snapshot, gameplayDefaults, saveTemplate, undoTemplate, redoTemplate, templateHistoryDebug.

### src/map-library.js:11

@function map-library.callback.17 — Returns the inverse of demo travel exits some using a callback. Inputs: e. Uses: demo travel exits some. Returns: the inverse of demo travel exits some using a callback.

### src/map-library.js:11

@function map-library.callback.18 — Returns math hypot using e x minus g x, e y minus g y is less than 2. Inputs: g. Returns: math hypot using e x minus g x, e y minus g y is less than 2.

### src/map-library.js:17

@function map-library.onchange.19 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: api world using transition effect. Uses: api world; remember.

### src/map-library.js:18

@function map-library.onclick.20 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier gameplay defaults open. Returns: frontier gameplay defaults open using project gameplay defaults, a callback.

### src/map-library.js:18

@function map-library.callback.21 — Provides the callback for frontier gameplay defaults open. Inputs: value. Updates: project gameplay defaults. Uses: remember; api replace; structured clone; api world.

### src/map-library.js:19

@function map-library.$.22 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id.

### src/map-library.js:19

@function map-library.status.23 — Returns assignment. Inputs: text. Updates: $ using "mapSaveStatus" text content. Uses: $. Returns: assignment.

### src/map-library.js:20

@function map-library.refresh.24 — Handles refresh within map library. Inputs: no explicit arguments; uses enclosing module state. Updates: transition picker value; picker value; $ using "mapName" value. Uses: project maps find; picker replace children; project maps map; $.

### src/map-library.js:21

@function map-library.callback.25 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### src/map-library.js:21

@function map-library.callback.26 — Returns a new option. Inputs: m. Returns: a new option.

### src/map-library.js:21

@function map-library.callback.27 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### src/map-library.js:22

@function map-library.snapshot.28 — Captures this system’s current data for persistence or inspection. Inputs: no explicit arguments; uses enclosing module state. Updates: project models; project maps; project maps find using a callback world. Uses: frontier model library export bundles; frontier map identities assign; project maps find; structured clone. Returns: structured clone using project.

### src/map-library.js:22

@function map-library.callback.29 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### src/map-library.js:23

@function map-library.remember.30 — Retains a bounded list of sufficiently separated safe player positions. Inputs: no explicit arguments; uses enclosing module state. Updates: timer. Uses: snapshot; clear timeout; status; set timeout. Returns: without a result.

### src/map-library.js:23

@function map-library.callback.31 — Returns save using . Inputs: no explicit arguments; uses enclosing module state. Uses: save. Returns: save using .

### src/map-library.js:24

@function map-library.save.32 — Handles save within map library. Inputs: no explicit arguments; uses enclosing module state. Uses: storage; snapshot; status.

### src/map-library.js:25

@function map-library.switchTo.33 — Handles switch to within map library. Inputs: id; options. Updates: project active. Uses: project maps some; snapshot; refresh; api replace. Returns: without a result.

### src/map-library.js:25

@function map-library.callback.34 — Returns m id equals id. Inputs: m. Returns: m id equals id.

### src/map-library.js:25

@function map-library.callback.35 — Returns m id equals id. Inputs: m. Returns: m id equals id.

### src/map-library.js:25

@function map-library.callback.36 — Returns m id equals id. Inputs: m. Returns: m id equals id.

### src/map-library.js:26

@function map-library.onchange.37 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: switch to. Returns: switch to using picker value.

### src/map-library.js:27

@function map-library.onclick.38 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: project maps find using a callback name. Uses: $ using "mapName" value trim; $; api log; project maps find. Returns: without a result.

### src/map-library.js:27

@function map-library.callback.39 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### src/map-library.js:28

@function map-library.createMap.40 — Handles create map within map library. Inputs: name; template. Updates: world objects; world events; world terrain; world water. Uses: error; name trim; a list of "flat", "hills", "demo" includes; api generate. Returns: id.

### src/map-library.js:29

@function map-library.onclick.41 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: project. Uses: error; snapshot; crypto random uuid; validate.

### src/map-library.js:31

@function map-library.onclick.42 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: project. Uses: error; snapshot; frontier map identities assign using a list of spread element, a record containing id, a record containing id slice; frontier map identities assign.

### src/map-library.js:40

@function map-library.openNewMap.43 — Handles open new map within map library. Inputs: assignment pattern. Updates: $ using "newMapName" value; $ using "newMapTemplate" value; $ using "newMapError" text content. Uses: $; dialog show modal; $ using "newMapName" focus; $ using "newMapName" select.

### src/map-library.js:41

@function map-library.onclick.44 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: open new map. Returns: open new map using .

### src/map-library.js:41

@function map-library.onclick.45 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: open new map; $. Returns: open new map using $ using "mapTemplate" value.

### src/map-library.js:42

@function map-library.onclick.46 — Responds to a button or clickable control. Inputs: event. Updates: $ using "newMapError" text content. Uses: event prevent default; create map; $; dialog close.

### src/map-library.js:43

@function map-library.onclick.47 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: open new map. Returns: open new map using "demo".

### src/map-library.js:44

@function map-library.callback.48 — Returns remember using . Inputs: no explicit arguments; uses enclosing module state. Uses: remember. Returns: remember using .

### src/map-library.js:44

@function map-library.onclick.49 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model workbench open. Returns: frontier model workbench open using .

### src/map-library.js:44

@function map-library.onclick.50 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: state enabled; debug button text content. Uses: debug button set attribute; string.

### src/map-library.js:45

@function map-library.onclick.51 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api download; snapshot. Returns: api download using snapshot using , "sprite-frontier-maps.json".

### src/map-library.js:46

@function map-library.onchange.52 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: incoming maps; m id; e map; command map; e spatial model id. Uses: $; error; validate; json parse. Returns: without a result.

### src/map-library.js:46

@function map-library.callback.53 — Returns m mz id. Inputs: m. Returns: m mz id.

### src/map-library.js:46

@function map-library.callback.54 — Returns a list of id, incoming maps at i mz id. Inputs: id; i. Returns: a list of id, incoming maps at i mz id.

### src/map-library.js:46

@function map-library.callback.55 — Returns a list of m id, "map-" plus crypto random uuid using . Inputs: m. Uses: crypto random uuid. Returns: a list of m id, "map-" plus crypto random uuid using .

### src/map-library.js:46

@function map-library.callback.56 — Returns old id equals entry id. Inputs: old. Returns: old id equals entry id.

### src/map-library.js:47

@function map-library.gameplayDefaults.57 — Handles gameplay defaults within map library. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using project gameplay defaults.

### src/map-library.js:47

@function map-library.saveTemplate.58 — Handles save template within map library. Inputs: name; event. Updates: project templates. Uses: name trim; error; crypto random uuid; structured clone. Returns: structured clone using checked entries at using - 1.

### src/map-library.js:47

@function map-library.undoTemplate.59 — Handles undo template within map library. Inputs: no explicit arguments; uses enclosing module state. Uses: template history undo. Returns: template history undo using a callback.

### src/map-library.js:47

@function map-library.callback.60 — Provides the callback for template history undo. Inputs: entry. Updates: project templates. Uses: snapshot; project maps some; project templates entries some; error.

### src/map-library.js:47

@function map-library.uses.61 — Returns event pages some using a callback. Inputs: event. Uses: event pages some. Returns: event pages some using a callback.

### src/map-library.js:47

@function map-library.callback.62 — Returns p commands some using a callback. Inputs: p. Uses: p commands some. Returns: p commands some using a callback.

### src/map-library.js:47

@function map-library.callback.63 — Returns c type equals "replaceEvent" and c template equals entry id. Inputs: c. Returns: c type equals "replaceEvent" and c template equals entry id.

### src/map-library.js:47

@function map-library.callback.64 — Returns m world events some using uses. Inputs: m. Uses: m world events some. Returns: m world events some using uses.

### src/map-library.js:47

@function map-library.callback.65 — Returns e id does not equal entry id and uses using e event. Inputs: e. Uses: uses. Returns: e id does not equal entry id and uses using e event.

### src/map-library.js:47

@function map-library.callback.66 — Returns e id does not equal entry id. Inputs: e. Returns: e id does not equal entry id.

### src/map-library.js:47

@function map-library.redoTemplate.67 — Handles redo template within map library. Inputs: no explicit arguments; uses enclosing module state. Uses: template history redo. Returns: template history redo using a callback.

### src/map-library.js:47

@function map-library.callback.68 — Provides the callback for template history redo. Inputs: entry. Updates: project templates. Uses: frontier event templates validate; remember.

### src/map-library.js:47

@function map-library.templateHistoryDebug.69 — Returns template history debug using . Inputs: no explicit arguments; uses enclosing module state. Uses: template history debug. Returns: template history debug using .

### src/map-library.js:47

@function map-library.templateBank.70 — Handles template bank within map library. Inputs: no explicit arguments; uses enclosing module state. Updates: template cache; template source. Uses: frontier event templates compile. Returns: template cache.

### src/map-library.js:47

@function map-library.active.71 — Handles active within map library. Inputs: no explicit arguments; uses enclosing module state. Returns: project active.

### src/map-library.js:47

@function map-library.getByNumber.72 — Handles get by number within map library. Inputs: number. Uses: frontier map identities resolve. Returns: frontier map identities resolve using project maps, number.

### src/map-library.js:47

@function map-library.get.73 — Handles get within map library. Inputs: id. Uses: project maps find. Returns: project maps find using a callback.

### src/map-library.js:47

@function map-library.callback.74 — Returns m id equals id. Inputs: m. Returns: m id equals id.

### src/map-library.js:47

@function map-library.restore.75 — Applies saved state to this system. Inputs: value. Updates: project. Uses: validate; frontier model library restore; template history clear; refresh.

### src/map-library.js:47

@function map-library.callback.76 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### src/map-library.js:47

@function map-library.load.77 — Handles load within map library. Inputs: no explicit arguments; uses enclosing module state. Updates: project; project active; forest world; r camera height scale; e y. Uses: storage; validate; frontier model library restore; project maps some. Returns: without a result.

### src/map-library.js:47

@function map-library.callback.78 — Returns m id equals "demo". Inputs: m. Returns: m id equals "demo".

### src/map-library.js:47

@function map-library.callback.79 — Returns e id equals m id. Inputs: e. Returns: e id equals m id.

### src/map-library.js:47

@function map-library.callback.80 — Returns m id equals "outdoor-assets-test". Inputs: m. Returns: m id equals "outdoor-assets-test".

### src/map-library.js:50

@function map-library.callback.81 — Returns chain. Inputs: e. Uses: e sprite profile starts with. Returns: chain.

### src/map-library.js:52

@function map-library.callback.82 — Returns m id equals "outdoor-assets-test". Inputs: m. Returns: m id equals "outdoor-assets-test".

### src/map-library.js:54

@function map-library.callback.83 — Returns m id equals "room-test". Inputs: m. Returns: m id equals "room-test".

### src/map-library.js:54

@function map-library.callback.84 — Returns e id equals "room-exit". Inputs: e. Returns: e id equals "room-exit".

### src/map-library.js:54

@function map-library.callback.85 — Returns e id equals "entry". Inputs: e. Returns: e id equals "entry".

### src/map-library.js:54

@function map-library.callback.86 — Returns m id equals "demo". Inputs: m. Returns: m id equals "demo".

### src/map-library.js:54

@function map-library.callback.87 — Returns m id equals "room-test". Inputs: m. Returns: m id equals "room-test".

### src/map-library.js:54

@function map-library.callback.88 — Returns m id equals "ruin-test". Inputs: m. Returns: m id equals "ruin-test".

### src/map-library.js:54

@function map-library.callback.89 — Returns the inverse of old demo world travel exits some using a callback. Inputs: e. Uses: old demo world travel exits some. Returns: the inverse of old demo world travel exits some using a callback.

### src/map-library.js:54

@function map-library.callback.90 — Returns math hypot using e x minus g x, e y minus g y is less than 2. Inputs: g. Returns: math hypot using e x minus g x, e y minus g y is less than 2.

### src/map-library.js:54

@function map-library.callback.91 — Returns e id equals "hub-guide". Inputs: e. Returns: e id equals "hub-guide".

### src/map-library.js:54

@function map-library.callback.92 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### src/model-collision.js:4

@function model-collision.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model collision.

### src/model-collision.js:4

@function model-collision.dot.2 — Returns a reduce using a callback, 0. Inputs: a; b. Uses: a reduce. Returns: a reduce using a callback, 0.

### src/model-collision.js:4

@function model-collision.callback.3 — Returns n plus v multiplied by b at i. Inputs: n; v; i. Returns: n plus v multiplied by b at i.

### src/model-collision.js:4

@function model-collision.sub.4 — Returns a map using a callback. Inputs: a; b. Uses: a map. Returns: a map using a callback.

### src/model-collision.js:4

@function model-collision.callback.5 — Returns v minus b at i. Inputs: v; i. Returns: v minus b at i.

### src/model-collision.js:4

@function model-collision.cross.6 — Returns a list of a at 1 multiplied by b at 2 minus a at 2 multiplied by b at 1, a at 2 multiplied by b at 0 minus a at 0 multiplied by b at 2, a at 0 multiplied by b at 1 minus a at 1 multiplied by b at 0. Inputs: a; b. Returns: a list of a at 1 multiplied by b at 2 minus a at 2 multiplied by b at 1, a at 2 multiplied by b at 0 minus a at 0 multiplied by b at 2, a at 0 multiplied by b at 1 minus a at 1 multiplied by b at 0.

### src/model-collision.js:5

@function model-collision.intersects.7 — Tests geometric overlap using the module’s separating-axis or region test. Inputs: corners; center; half. Uses: sub; cross; edges flat map; corners map. Returns: false; true.

### src/model-collision.js:5

@function model-collision.callback.8 — Returns basis map using a callback. Inputs: e. Uses: basis map. Returns: basis map using a callback.

### src/model-collision.js:5

@function model-collision.callback.9 — Returns cross using e, b. Inputs: b. Uses: cross. Returns: cross using e, b.

### src/model-collision.js:5

@function model-collision.callback.10 — Returns dot using p, axis. Inputs: p. Uses: dot. Returns: dot using p, axis.

### src/model-collision.js:5

@function model-collision.callback.11 — Returns n plus math abs using axis at i multiplied by v. Inputs: n; v; i. Returns: n plus math abs using axis at i multiplied by v.

### src/model-collision.js:6

@function model-collision.blocked.12 — Tests whether the proposed movement or location meets a solid obstacle. Inputs: game; x; y; assignment pattern; assignment pattern. Updates: game model collision debug. Uses: root frontier model library get; frontier model mesh collision query; frontier model events matrix; frontier model transform corners. Returns: true; true.

### src/model-collision.js:8

@function model-collision.support.13 — Mesh support is separate from interaction zones and old sprite footprints. Inputs: game; x; y; low; high; assignment pattern. Updates: best; game model support debug. Uses: root frontier model library get; frontier model mesh collision support; frontier model events matrix. Returns: best.

### src/model-collision.js:11

@function model-collision.vertical.14 — ascending hits undersides rather than letting the head enter a ceiling. Inputs: game; actor; end z; assignment pattern. Updates: nearest. Uses: root frontier model library get; frontier model mesh collision query; frontier model events matrix. Returns: nearest equals null selects end z or actor z or 0 plus end z minus actor z or 0 multiplied by math max using 0, nearest minus 0.0001 divided by math max using 0.0001, math abs using end z minus actor z or 0.

### src/model-collision.js:14

@function model-collision.step.15 — blockers pass. Sweeps check upward clearance and raised horizontal travel. Inputs: game; x; y; assignment pattern. Uses: root frontier parameters get; support; vertical; blocked. Returns: null; null.

### src/model-collision.js:29

@function model-collision.camera.16 — Water never participates: underwater viewing remains available. Inputs: game; result. Updates: hit; nearest; host id; game model camera debug; result x. Uses: frontier model events matrix; root frontier model library get; frontier model mesh collision query; frontier model transform corners. Returns: result; result.

### src/model-collision.js:51

@function model-collision.callback.17 — Returns corners at i. Inputs: i. Returns: corners at i.

### src/model-collision.js:54

@function model-collision.callback.18 — Returns v minus start at i. Inputs: v; i. Returns: v minus start at i.

### src/model-container.js:4

@function model-container.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model container.

### src/model-container.js:6

@function model-container.document.2 — Handles document within model container. Inputs: value. Uses: error; value extensions required join. Returns: value.

### src/model-container.js:7

@function model-container.parse.3 — Handles parse within model container. Inputs: bytes. Updates: offset; json; binary. Uses: error; view get uint32; document; json parse. Returns: a record containing json, binary; a record containing json, binary.

### src/model-container.js:9

@function model-container.resourcePath.4 — Canonical relative bundle paths protect portable exports against traversal. Inputs: value. Uses: value includes; value starts with; /^[a-z]+:/i test; error. Returns: value.

### src/model-container.js:9

@function model-container.callback.5 — Returns the inverse of p or p equals "." or p equals "..". Inputs: p. Returns: the inverse of p or p equals "." or p equals "..".

### src/model-container.js:10

@function model-container.statistics.6 — Handles statistics within model container. Inputs: json. Updates: vertices; triangles. Uses: number is integer; error. Returns: a record containing triangles, vertices, primitives, materials, images, animated, skinned.

### src/model-debug.js:3

@function model-debug.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model debug. Uses: edges push.

### src/model-debug.js:6

@function model-debug.draw.2 — Draws this system’s current state into the supplied rendering context. Inputs: ctx; game; cam; entities. Updates: ctx fog depth; ctx global alpha; ctx line width; ctx font; ctx stroke style. Uses: ctx save; frontier model events matrix; frontier model library get; frontier model scene triangles. Returns: without a result.

### src/model-debug.js:6

@function model-debug.callback.3 — Provides the callback for frontier model scene triangles. Inputs: points. Uses: points map; p some; ctx begin path; ctx move to. Returns: without a result.

### src/model-debug.js:6

@function model-debug.callback.4 — Returns frontier render project using cam, spread element. Inputs: v. Uses: frontier render project. Returns: frontier render project using cam, spread element.

### src/model-debug.js:6

@function model-debug.callback.5 — Returns the inverse of v. Inputs: v. Returns: the inverse of v.

### src/model-debug.js:6

@function model-debug.callback.6 — Returns frontier render project using cam, spread element. Inputs: p. Uses: frontier render project. Returns: frontier render project using cam, spread element.

### src/model-editor.js:3

@function model-editor.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model editor.

### src/model-editor.js:4

@function model-editor.el.2 — Handles el within model editor. Inputs: tag; text. Updates: e text content. Uses: document create element. Returns: e.

### src/model-editor.js:5

@function model-editor.button.3 — Handles button within model editor. Inputs: text; fn. Updates: b type; b onclick. Uses: el. Returns: b.

### src/model-editor.js:6

@function model-editor.open.4 — Handles open within model editor. Inputs: event; events; accept. Updates: d class name; d style css text. Uses: structured clone; el; d set attribute; d append.

### src/model-editor.js:7

@function model-editor.field.5 — Handles field within model editor. Inputs: parent; name; input. Updates: l style css text. Uses: input set attribute; el; l append; parent append. Returns: input.

### src/model-editor.js:8

@function model-editor.select.6 — Handles select within model editor. Inputs: parent; name; items; current; change. Updates: s value; s onchange. Uses: el; s append; field. Returns: field using parent, name, s.

### src/model-editor.js:8

@function model-editor.onchange.7 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: change. Returns: change using s value.

### src/model-editor.js:9

@function model-editor.vector.8 — Transforms a point or direction using the provided matrix. Inputs: parent; name; values. Updates: n type; n step; n value; n style width; n oninput. Uses: el; row append; field; parent append.

### src/model-editor.js:9

@function model-editor.oninput.9 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: values at axis. Uses: number. Returns: assignment.

### src/model-editor.js:10

@function model-editor.callback.10 — Returns assignment. Inputs: v. Updates: value visual. Returns: assignment.

### src/model-editor.js:11

@function model-editor.callback.11 — Returns a list of m id, m name plus " (" plus m triangles plus " tris)". Inputs: m. Returns: a list of m id, m name plus " (" plus m triangles plus " tris)".

### src/model-editor.js:11

@function model-editor.callback.12 — Returns assignment. Inputs: v. Updates: value model id. Returns: assignment.

### src/model-editor.js:12

@function model-editor.callback.13 — Returns frontier model workbench open using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model workbench open. Returns: frontier model workbench open using a callback.

### src/model-editor.js:12

@function model-editor.callback.14 — Provides the callback for frontier model workbench open. Inputs: id. Updates: value visual; value model id. Uses: d close; open.

### src/model-editor.js:13

@function model-editor.callback.15 — Provides the callback for select. Inputs: v. Updates: value collision mode; section hidden. Uses: d query selector all.

### src/model-editor.js:14

@function model-editor.callback.16 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: value rotation; value scale. Uses: d close; open.

### src/model-editor.js:15

@function model-editor.boxes.17 — Handles boxes within model editor. Inputs: key; title; zones. Updates: section dataset collision boxes; section hidden. Uses: el; section append; button; d append.

### src/model-editor.js:15

@function model-editor.render.18 — Builds or refreshes the visible representation of this system. Inputs: no explicit arguments; uses enclosing module state. Updates: name value; name oninput; box event id; box transform; box transform position. Uses: list replace children; el; f append; field.

### src/model-editor.js:15

@function model-editor.oninput.19 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: box name. Returns: assignment.

### src/model-editor.js:15

@function model-editor.callback.20 — Returns e id does not equal event id. Inputs: e. Returns: e id does not equal event id.

### src/model-editor.js:15

@function model-editor.callback.21 — Returns a list of e id, e name. Inputs: e. Returns: a list of e id, e name.

### src/model-editor.js:15

@function model-editor.callback.22 — Returns assignment. Inputs: v. Updates: box event id. Returns: assignment.

### src/model-editor.js:15

@function model-editor.callback.23 — Returns assignment. Inputs: v. Updates: box trigger. Returns: assignment.

### src/model-editor.js:15

@function model-editor.callback.24 — Returns frontier model gizmo open using box, value, render. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model gizmo open. Returns: frontier model gizmo open using box, value, render.

### src/model-editor.js:15

@function model-editor.callback.25 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: value at key splice; value at key index of; render.

### src/model-editor.js:15

@function model-editor.callback.26 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: crypto random uuid; value at key push; render.

### src/model-editor.js:18

@function model-editor.drawMode — Stores a visibility mode in the private draft. Inputs: mode string. Returns: nothing. No live event changes; Apply validates the draft.

### src/model-editor.js:19

@function model-editor.drawDistance — Updates a private distance value in world units. Inputs: DOM input event, ignored. Returns: nothing. Invalid numbers are rejected on Apply; no simulation or collision changes.

### src/model-editor.js:21

@function model-editor.callback.27 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: status text content. Uses: frontier model events validate; accept; d close.

### src/model-editor.js:21

@function model-editor.callback.28 — Returns d close using . Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using .

### src/model-editor.js:21

@function model-editor.callback.29 — Returns d remove using . Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using .

### src/model-events.js:4

@function model-events.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model events.

### src/model-events.js:5

@function model-events.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Uses: a list of "sprite", "model", "none" includes; error; /^[A-Za-z0-9_-]{1,60}$/ test; a list of "none", "custom", "mesh" includes. Returns: undefined; a record containing visual, collisionMode, copied fields, rotation, scale, collisionBoxes, interactionZones.

### src/model-events.js:5

@function model-events.boxes.3 — Handles boxes within event model transforms and spatial settings. Inputs: values; zones. Uses: array is array; error; values or a list of map. Returns: values or a list of map using a callback.

### src/model-events.js:5

@function model-events.callback.4 — Provides the callback for values or a list of map. Inputs: v. Uses: frontier model transform box; ids has; error; ids add. Returns: box; a record containing copied fields, eventId, trigger, enabled.

### src/model-events.js:6

@function model-events.entityFields.5 — Handles entity fields within event model transforms and spatial settings. Inputs: component. Uses: a list of "mesh", "none" includes. Returns: a record containing ; a record containing modelId, modelTransform, spatial, copied fields, copied fields.

### src/model-events.js:7

@function model-events.matrix.6 — Handles matrix within event model transforms and spatial settings. Inputs: entity. Uses: frontier model transform matrix. Returns: frontier model transform matrix using a record containing position, rotation, scale.

### src/model-events.js:8

@function model-events.contains.7 — Handles contains within event model transforms and spatial settings. Inputs: entity; point; assignment pattern. Uses: chain or a list of filter. Returns: chain or a list of filter using a callback.

### src/model-events.js:8

@function model-events.callback.8 — Returns b enabled does not equal false and frontier model transform contains using point, b, matrix using entity. Inputs: b. Uses: frontier model transform contains; matrix. Returns: b enabled does not equal false and frontier model transform contains using point, b, matrix using entity.

### src/model-events.js:9

@function model-events.rayZones.9 — Handles ray zones within event model transforms and spatial settings. Inputs: entity; origin; direction; max distance. Uses: matrix; frontier model transform ray box; hits push; hits sort. Returns: hits sort using a callback.

### src/model-events.js:9

@function model-events.callback.10 — Returns a distance minus b distance or a zone id locale compare using b zone id. Inputs: a; b. Uses: a zone id locale compare. Returns: a distance minus b distance or a zone id locale compare using b zone id.

### src/model-gizmo.js:3

@function model-gizmo.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model gizmo.

### src/model-gizmo.js:4

@function model-gizmo.apply.2 — Handles apply within model gizmo. Inputs: box; mode; axis; amount. Updates: box transform position at axis; box transform rotation at axis; box size at axis.

### src/model-gizmo.js:5

@function model-gizmo.open.3 — Handles open within model gizmo. Inputs: box; spatial; changed. Updates: d class name; d style css text; title text content; help text content; canvas width. Uses: document create element; d set attribute; mode set attribute; mode append. Returns: a record containing canvas, draw.

### src/model-gizmo.js:5

@function model-gizmo.onclick.4 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using .

### src/model-gizmo.js:5

@function model-gizmo.callback.5 — Provides the callback for d add event listener. Inputs: no explicit arguments; uses enclosing module state. Uses: changed; d remove.

### src/model-gizmo.js:5

@function model-gizmo.callback.6 — Returns v minus asset scene bounds min at i. Inputs: v; i. Returns: v minus asset scene bounds min at i.

### src/model-gizmo.js:6

@function model-gizmo.project.7 — Converts a world-space position into this renderer’s screen-space representation. Inputs: p. Returns: a record containing x, y.

### src/model-gizmo.js:7

@function model-gizmo.draw.8 — Draws this system’s current state into the supplied rendering context. Inputs: no explicit arguments; uses enclosing module state. Updates: ctx stroke style; ctx line width; handles; v at axis; ctx fill style. Uses: canvas get context; ctx clear rect; ctx begin path; frontier model scene triangles.

### src/model-gizmo.js:7

@function model-gizmo.callback.9 — Provides the callback for frontier model scene triangles. Inputs: points. Uses: points map; ctx move to; ctx line to.

### src/model-gizmo.js:7

@function model-gizmo.callback.10 — Returns n plus world at i. Inputs: n; i. Returns: n plus world at i.

### src/model-gizmo.js:7

@function model-gizmo.callback.11 — Returns n to fixed using 2. Inputs: n. Uses: n to fixed. Returns: n to fixed using 2.

### src/model-gizmo.js:7

@function model-gizmo.callback.12 — Returns n to fixed using 2. Inputs: n. Uses: n to fixed. Returns: n to fixed using 2.

### src/model-gizmo.js:7

@function model-gizmo.callback.13 — Returns n to fixed using 1. Inputs: n. Uses: n to fixed. Returns: n to fixed using 1.

### src/model-gizmo.js:8

@function model-gizmo.pointer.14 — Handles pointer within model gizmo. Inputs: e. Uses: canvas get bounding client rect. Returns: a record containing x, y.

### src/model-gizmo.js:8

@function model-gizmo.onpointerdown.15 — Begins the pointer-driven interaction. Inputs: e. Updates: drag. Uses: pointer; handles find; canvas set pointer capture. Returns: without a result.

### src/model-gizmo.js:8

@function model-gizmo.callback.16 — Returns math hypot using p x minus h x, p y minus h y is less than 18. Inputs: h. Returns: math hypot using p x minus h x, p y minus h y is less than 18.

### src/model-gizmo.js:8

@function model-gizmo.onpointermove.17 — Updates the active pointer-driven interaction. Inputs: e. Updates: drag last. Uses: pointer; apply; draw. Returns: without a result.

### src/model-gizmo.js:8

@function model-gizmo.onpointercancel.18 — Cancels the active pointer-driven interaction. Inputs: no explicit arguments; uses enclosing module state. Updates: drag. Returns: assignment.

### src/model-library.js:3

@function model-library.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model library.

### src/model-library.js:6

@function model-library.resource.2 — Handles resource within shared 3D assets. Inputs: bundle; uri. Uses: uri starts with; /^data:([^,]*?);base64,(.*)$/ exec; error; atob. Returns: uint8 array from using text, a callback; bundle files at p.

### src/model-library.js:6

@function model-library.callback.3 — Returns c char code at using 0. Inputs: c. Uses: c char code at. Returns: c char code at using 0.

### src/model-library.js:8

@function model-library.accessor.4 — Handles accessor within shared 3D assets. Inputs: json; buffers; index. Updates: n; out at i multiplied by width plus k. Uses: error; number is integer; view at spec at 1; number is finite. Returns: out.

### src/model-library.js:9

@function model-library.decode.5 — Handles decode within shared 3D assets. Inputs: bundle. Uses: frontier model container parse; j buffers or a list of map; j meshes or a list of map; j images or a list of map. Returns: a record containing json, meshes, images, statistics.

### src/model-library.js:9

@function model-library.callback.6 — Provides the callback for j buffers or a list of map. Inputs: b; i. Uses: resource; error. Returns: bytes.

### src/model-library.js:9

@function model-library.callback.7 — Returns mesh primitives or a list of map using a callback. Inputs: mesh. Uses: mesh primitives or a list of map. Returns: mesh primitives or a list of map using a callback.

### src/model-library.js:9

@function model-library.callback.8 — Provides the callback for mesh primitives or a list of map. Inputs: p. Uses: error; a list of 5121, 5123, 5125 includes; accessor; uint32 array from. Returns: a record containing positions, indices, uv, normals, material.

### src/model-library.js:9

@function model-library.callback.9 — Returns i. Inputs: ; i. Returns: i.

### src/model-library.js:9

@function model-library.callback.10 — Returns the inverse of number is integer using v or v is less than 0 or v is at least positions length divided by 3. Inputs: v. Uses: number is integer. Returns: the inverse of number is integer using v or v is less than 0 or v is at least positions length divided by 3.

### src/model-library.js:9

@function model-library.callback.11 — Provides the callback for j images or a list of map. Inputs: image. Uses: resource; /\.jpe?g$/i test; error; buffers at v buffer subarray. Returns: a record containing bytes, mime; a record containing bytes, mime.

### src/model-library.js:10

@function model-library.importBundle.12 — Decodes and registers a model’s resource bundle under a shared asset identity. Inputs: value. Updates: total; files at p; decoded scene. Uses: /^[A-Za-z0-9_-]{1,60}$/ test; error; frontier model container resource path; object entries. Returns: a record containing copied fields, bytes, id.

### src/model-library.js:11

@function model-library.get.13 — Handles get within shared 3D assets. Inputs: id. Uses: cache get. Returns: cache get using id or null.

### src/model-library.js:12

@function model-library.list.14 — Handles list within shared 3D assets. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element map; records values. Returns: a list of spread element map using a callback.

### src/model-library.js:12

@function model-library.callback.15 — Returns a record containing id, name, entry, revision, copied fields, bytes. Inputs: b. Uses: cache get; object values using b files reduce; object values. Returns: a record containing id, name, entry, revision, copied fields, bytes.

### src/model-library.js:12

@function model-library.callback.16 — Returns n plus b length. Inputs: n; b. Returns: n plus b length.

### src/model-library.js:13

@function model-library.exportBundles.17 — Handles export bundles within shared 3D assets. Inputs: no explicit arguments; uses enclosing module state. Updates: export revision; export cache. Uses: a list of spread element map; records values. Returns: export cache; assignment.

### src/model-library.js:13

@function model-library.callback.18 — Returns a record containing id, name, entry, files. Inputs: b. Uses: object from entries; object entries using b files map; object entries. Returns: a record containing id, name, entry, files.

### src/model-library.js:13

@function model-library.callback.19 — Provides the callback for object entries using b files map. Inputs: array pattern. Updates: i; s. Uses: string from char code; bytes subarray; btoa. Returns: a list of p, btoa using s.

### src/model-library.js:16

@function model-library.validateBundles.20 — current library. Runtime integration calls replace only after validation. Inputs: values. Uses: array is array; error; values map. Returns: values map using a callback.

### src/model-library.js:16

@function model-library.callback.21 — Provides the callback for values map. Inputs: v. Updates: bundle bytes; total; files at p; decoded scene. Uses: /^[A-Za-z0-9_-]{1,60}$/ test; ids has; error; ids add. Returns: a record containing bundle, decoded.

### src/model-library.js:16

@function model-library.callback.22 — Returns c char code at using 0. Inputs: c. Uses: c char code at. Returns: c char code at using 0.

### src/model-library.js:17

@function model-library.restore.23 — Applies saved state to this system. Inputs: values. Updates: bundle revision. Uses: validate bundles; records clear; cache clear; records set.

### src/model-library.js:18

@function model-library.merge.24 — Handles merge within shared 3D assets. Inputs: values. Updates: id. Uses: export bundles; current map; used has; json stringify. Returns: a record containing models, mapping.

### src/model-library.js:18

@function model-library.callback.25 — Returns a list of v id, v. Inputs: v. Returns: a list of v id, v.

### src/model-mesh-collision.js:5

@function model-mesh-collision.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model mesh collision.

### src/model-mesh-collision.js:6

@function model-mesh-collision.dot.2 — Returns a reduce using a callback, 0. Inputs: a; b. Uses: a reduce. Returns: a reduce using a callback, 0.

### src/model-mesh-collision.js:6

@function model-mesh-collision.callback.3 — Returns n plus v multiplied by b at i. Inputs: n; v; i. Returns: n plus v multiplied by b at i.

### src/model-mesh-collision.js:6

@function model-mesh-collision.sub.4 — Returns a map using a callback. Inputs: a; b. Uses: a map. Returns: a map using a callback.

### src/model-mesh-collision.js:6

@function model-mesh-collision.callback.5 — Returns v minus b at i. Inputs: v; i. Returns: v minus b at i.

### src/model-mesh-collision.js:6

@function model-mesh-collision.cross.6 — Returns a list of a at 1 multiplied by b at 2 minus a at 2 multiplied by b at 1, a at 2 multiplied by b at 0 minus a at 0 multiplied by b at 2, a at 0 multiplied by b at 1 minus a at 1 multiplied by b at 0. Inputs: a; b. Returns: a list of a at 1 multiplied by b at 2 minus a at 2 multiplied by b at 1, a at 2 multiplied by b at 0 minus a at 0 multiplied by b at 2, a at 0 multiplied by b at 1 minus a at 1 multiplied by b at 0.

### src/model-mesh-collision.js:8

@function model-mesh-collision.bounds.7 — Bounds encloses all supplied vertices in a world/local axis-aligned box. Inputs: points. Uses: a list of 0, 1, 2 map. Returns: a record containing min, max.

### src/model-mesh-collision.js:8

@function model-mesh-collision.callback.8 — Returns math min using spread element. Inputs: i. Uses: points map. Returns: math min using spread element.

### src/model-mesh-collision.js:8

@function model-mesh-collision.callback.9 — Returns p at i. Inputs: p. Returns: p at i.

### src/model-mesh-collision.js:8

@function model-mesh-collision.callback.10 — Returns math max using spread element. Inputs: i. Uses: points map. Returns: math max using spread element.

### src/model-mesh-collision.js:8

@function model-mesh-collision.callback.11 — Returns p at i. Inputs: p. Returns: p at i.

### src/model-mesh-collision.js:10

@function model-mesh-collision.overlap.12 — Overlap rejects disjoint query/BVH boxes before any triangle math. Inputs: a; b. Uses: a min every. Returns: a min every using a callback.

### src/model-mesh-collision.js:10

@function model-mesh-collision.callback.13 — Returns v is at most b max at i plus 1e-7 and a max at i is at least b min at i minus 1e-7. Inputs: v; i. Returns: v is at most b max at i plus 1e-7 and a max at i is at least b min at i minus 1e-7.

### src/model-mesh-collision.js:12

@function model-mesh-collision.build.14 — Build bakes node transforms once and retains a shared median-split BVH. Inputs: asset. Uses: caches has; caches get; frontier model scene triangles; frontier model transform identity. Returns: caches get using asset; result.

### src/model-mesh-collision.js:12

@function model-mesh-collision.callback.15 — Returns triangles push using a record containing points, bounds. Inputs: points. Uses: triangles push; bounds. Returns: triangles push using a record containing points, bounds.

### src/model-mesh-collision.js:12

@function model-mesh-collision.node.16 — Handles node within shared triangle collision queries. Inputs: indices. Updates: box min at k; box max at k. Uses: box max map; lengths index of; indices sort; node. Returns: a record containing copied fields, indices; a record containing copied fields, children.

### src/model-mesh-collision.js:12

@function model-mesh-collision.callback.17 — Returns v minus box min at i. Inputs: v; i. Returns: v minus box min at i.

### src/model-mesh-collision.js:12

@function model-mesh-collision.callback.18 — Returns triangles at a bounds min at axis plus triangles at a bounds max at axis minus triangles at b bounds min at axis plus triangles at b bounds max at axis. Inputs: a; b. Returns: triangles at a bounds min at axis plus triangles at a bounds max at axis minus triangles at b bounds min at axis plus triangles at b bounds max at axis.

### src/model-mesh-collision.js:12

@function model-mesh-collision.callback.19 — Returns i. Inputs: ; i. Returns: i.

### src/model-mesh-collision.js:15

@function model-mesh-collision.sweepTriangle.20 — separating axes. Boundary contact alone is allowed (standing/tangency). Inputs: points; start; end; half. Updates: inside; depth; escape; enter; exit. Uses: sub; cross; edges flat map; raw map. Returns: null; null.

### src/model-mesh-collision.js:15

@function model-mesh-collision.callback.21 — Returns basis map using a callback. Inputs: e. Uses: basis map. Returns: basis map using a callback.

### src/model-mesh-collision.js:15

@function model-mesh-collision.callback.22 — Returns cross using e, b. Inputs: b. Uses: cross. Returns: cross using e, b.

### src/model-mesh-collision.js:15

@function model-mesh-collision.callback.23 — Returns v divided by length. Inputs: v. Returns: v divided by length.

### src/model-mesh-collision.js:15

@function model-mesh-collision.callback.24 — Returns dot using v, axis. Inputs: v. Uses: dot. Returns: dot using v, axis.

### src/model-mesh-collision.js:15

@function model-mesh-collision.callback.25 — Returns n plus v multiplied by math abs using axis at i. Inputs: n; v; i. Returns: n plus v multiplied by math abs using axis at i.

### src/model-mesh-collision.js:18

@function model-mesh-collision.query.26 — then returns the earliest world-space body/triangle contact or null. Inputs: asset; matrix; start; end; half; assignment pattern. Uses: build; t inverse; corners push; t vector. Returns: null; nearest.

### src/model-mesh-collision.js:18

@function model-mesh-collision.callback.27 — Returns v plus a list of x, y, z at i multiplied by half at i. Inputs: v; i. Returns: v plus a list of x, y, z at i multiplied by half at i.

### src/model-mesh-collision.js:18

@function model-mesh-collision.visit.28 — Handles visit within shared triangle collision queries. Inputs: n. Updates: stats nodes; stats triangles; nearest. Uses: overlap; visit; triangle points map; sweep triangle. Returns: without a result; without a result.

### src/model-mesh-collision.js:18

@function model-mesh-collision.callback.29 — Returns t vector using matrix, p. Inputs: p. Uses: t vector. Returns: t vector using matrix, p.

### src/model-mesh-collision.js:22

@function model-mesh-collision.support.30 — Winding is deliberately ignored: imported double-sided static floors work. Inputs: asset; matrix; x; y; low; high; assignment pattern; assignment pattern. Uses: build; t inverse; corners push; t vector. Returns: null; best.

### src/model-mesh-collision.js:25

@function model-mesh-collision.visit.31 — Handles visit within shared triangle collision queries. Inputs: n. Updates: stats nodes; stats triangles; z; polygon; best. Uses: overlap; n children for each; t points map; sub. Returns: without a result; without a result.

### src/model-mesh-collision.js:27

@function model-mesh-collision.callback.32 — Returns t vector using matrix, v. Inputs: v. Uses: t vector. Returns: t vector using matrix, v.

### src/model-mesh-collision.js:35

@function model-mesh-collision.callback.33 — Returns v plus b at k minus v multiplied by t. Inputs: v; k. Returns: v plus b at k minus v multiplied by t.

### src/model-mesh-collision.js:35

@function model-mesh-collision.callback.34 — Returns p at 2. Inputs: p. Returns: p at 2.

### src/model-renderer.js:6

@function model-renderer.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model renderer.

### src/model-renderer.js:8

@function model-renderer.prepare.2 — Handles prepare within model renderer. Inputs: asset. Updates: state promise. Uses: textures has; textures get; textures set; promise all using asset images map using a callback then using a callback catch. Returns: textures get using asset; state.

### src/model-renderer.js:8

@function model-renderer.callback.3 — Provides the callback for asset images map. Inputs: image. Updates: c width; c height. Uses: create image bitmap; bitmap close; error; document create element. Returns: a record containing width, height, data.

### src/model-renderer.js:8

@function model-renderer.callback.4 — Provides the callback for promise all using asset images map using a callback then. Inputs: p. Updates: state pixels; state ready.

### src/model-renderer.js:8

@function model-renderer.callback.5 — Provides the callback for promise all using asset images map using a callback then using a callback catch. Inputs: e. Updates: state error.

### src/model-renderer.js:9

@function model-renderer.frame.6 — Runs the animation-clock simulation and rendering work, then schedules the next frame. Inputs: ctx; width; height. Updates: canvas width; canvas height; s. Uses: surfaces get; document create element; canvas get context; surfaces set. Returns: s.

### src/model-renderer.js:11

@function model-renderer.material1517 — Inputs: asset, primitive and optional map fog. Returns base material and parsed fog color; no mutation. October 9 supersedes origin-only fog with per-pixel camera-depth blending.

### src/model-renderer.js:12

@function model-renderer.sample.8 — Handles sample within model renderer. Inputs: asset; state; m; u; v. Uses: m factor map; wrap. Returns: m factor map using a callback; m factor map using a callback.

### src/model-renderer.js:12

@function model-renderer.callback.9 — Returns x multiplied by 255. Inputs: x. Returns: x multiplied by 255.

### src/model-renderer.js:12

@function model-renderer.wrap.10 — Handles wrap within model renderer. Inputs: n; mode. Returns: math max using 0, math min using 0.999999, n; math min using 0.999999, f is at most 1 selects f or 2 minus f.

### src/model-renderer.js:12

@function model-renderer.callback.11 — Returns f multiplied by image data at i plus k. Inputs: f; k. Returns: f multiplied by image data at i plus k.

### src/model-renderer.js:13

@function model-renderer.clip.12 — Handles clip within model renderer. Inputs: vertices; cam. Uses: depth; out push; a point map; a uv map. Returns: out.

### src/model-renderer.js:13

@function model-renderer.depth.13 — Returns frontier render depth using cam, spread element. Inputs: v. Uses: frontier render depth. Returns: frontier render depth using cam, spread element.

### src/model-renderer.js:13

@function model-renderer.callback.14 — Returns v plus b point at k minus v multiplied by t. Inputs: v; k. Returns: v plus b point at k minus v multiplied by t.

### src/model-renderer.js:13

@function model-renderer.callback.15 — Returns v plus b uv at k minus v multiplied by t. Inputs: v; k. Returns: v plus b uv at k minus v multiplied by t.

### src/model-renderer.js:14

@function model-renderer.triangle.16 — Rasterizes or processes one triangle for this module. Inputs: surface; depth; vertices; asset; state; m; cam. Updates: pixels at k multiplied by 4 plus channel; pixels at k multiplied by 4 plus 3; depth values at k. Uses: vertices map; projected some; a list of 0, 1 map; sample. Returns: 0; 0.

### src/model-renderer.js:14

@function model-renderer.callback.17 — Returns a record containing copied fields, uv. Inputs: v. Uses: frontier render project. Returns: a record containing copied fields, uv.

### src/model-renderer.js:14

@function model-renderer.callback.18 — Returns the inverse of number is finite using p x or the inverse of number is finite using p y. Inputs: p. Uses: number is finite. Returns: the inverse of number is finite using p x or the inverse of number is finite using p y.

### src/model-renderer.js:14

@function model-renderer.callback.19 — Returns weights at 0 multiplied by a uv at axis plus weights at 1 multiplied by b uv at axis plus weights at 2 multiplied by c uv at axis. Inputs: axis. Returns: weights at 0 multiplied by a uv at axis plus weights at 1 multiplied by b uv at axis plus weights at 2 multiplied by c uv at axis.

### src/model-renderer.js:15

@function model-renderer.composite.20 — Handles composite within model renderer. Inputs: ctx; surface. Updates: ctx global alpha; ctx fog depth. Uses: surface context put image data; ctx sources get using surface canvas update; ctx sources get; ctx save.

### src/model-renderer.js:18

@function model-renderer.geometry.21 — This prevents a room face's centroid sort from covering nearer geometry. Inputs: ctx; game; cam; faces. Uses: frame; /^#([a-f0-9]{6})$/i exec; parse int; face points map. Returns: without a result.

### src/model-renderer.js:18

@function model-renderer.callback.22 — Returns a record containing point, uv. Inputs: point. Returns: a record containing point, uv.

### src/model-renderer.js:19

@function model-renderer.transform.23 — Handles transform within model renderer. Inputs: entity. Uses: frontier model transform matrix. Returns: frontier model transform matrix using a record containing position, rotation, scale.

### src/model-renderer.js:22

@function model-renderer.visible.24 — entirely behind or outside the view. Near-plane crossings remain visible. Inputs: asset; m; cam; width. Uses: points push; frontier model transform vector; points map; depths every. Returns: false; true.

### src/model-renderer.js:22

@function model-renderer.callback.25 — Returns frontier render depth using cam, spread element. Inputs: p. Uses: frontier render depth. Returns: frontier render depth using cam, spread element.

### src/model-renderer.js:22

@function model-renderer.callback.26 — Returns d is less than 0.13. Inputs: d. Returns: d is less than 0.13.

### src/model-renderer.js:22

@function model-renderer.callback.27 — Returns d is less than 0.13. Inputs: d. Returns: d is less than 0.13.

### src/model-renderer.js:22

@function model-renderer.callback.28 — Returns frontier render project using cam, spread element. Inputs: p. Uses: frontier render project. Returns: frontier render project using cam, spread element.

### src/model-renderer.js:22

@function model-renderer.callback.29 — Returns p x is less than 0. Inputs: p. Returns: p x is less than 0.

### src/model-renderer.js:22

@function model-renderer.callback.30 — Returns p x is greater than width. Inputs: p. Returns: p x is greater than width.

### src/model-renderer.js:22

@function model-renderer.callback.31 — Returns p y is less than 0. Inputs: p. Returns: p y is less than 0.

### src/model-renderer.js:22

@function model-renderer.callback.32 — Returns p y is greater than 480. Inputs: p. Returns: p y is greater than 480.

### src/model-renderer.js:23

@function model-renderer.draw1517 — Inputs: render context, game, camera and instances. Draws shared geometry with private transition scene overrides; uses original asset for texture cache, stable distance coverage and per-pixel fog. Returns nothing; writes shared depth/diagnostics. October 9 extends static-only contract without modifying source meshes.

### src/model-renderer.js:23

@function model-renderer.callback.34 — Returns e model id and the inverse of e transparent. Inputs: e. Returns: e model id and the inverse of e transparent.

### src/model-renderer.js:23

@function model-renderer.callback.35 — Provides the callback for frontier model scene triangles. Inputs: points; p; node; index. Updates: pixels. Uses: points map; clip; triangle; material.

### src/model-renderer.js:23

@function model-renderer.callback.36 — Provides the callback for points map. Inputs: point; k. Returns: a record containing point, uv.

### src/model-renderer.js:25

@function model-renderer.memoryBytes — Inputs: none. Returns decoded RGBA byte estimate for live shared-library textures already prepared. Does not load assets or count GPU copies; unavailable/unprepared assets contribute zero.

### src/model-scene.js:4

@function model-scene.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model scene.

### src/model-scene.js:5

@function model-scene.nodeMatrix.2 — Handles node matrix within model scene. Inputs: node. Updates: m at col multiplied by 4 plus row. Uses: error; array is array; node matrix every; a list of spread element, spread element, spread element every. Returns: a list of spread element; m.

### src/model-scene.js:5

@function model-scene.callback.3 — Returns math abs using v is less than 1e-9. Inputs: v. Returns: math abs using v is less than 1e-9.

### src/model-scene.js:7

@function model-scene.compile.4 — Handles compile within model scene. Inputs: asset. Uses: error; visit; t identity. Returns: a record containing instances, bounds.

### src/model-scene.js:7

@function model-scene.visit.5 — Handles visit within model scene. Inputs: index; parent; depth. Updates: i; bounds min at k; bounds max at k. Uses: number is integer; error; active has; seen has.

### src/model-scene.js:10

@function model-scene.triangles.6 — imported node transforms cannot differ between visibility and picking. Inputs: asset; scene; parent; callback. Updates: i. Uses: t multiply; a list of 0, 1, 2 map; callback.

### src/model-scene.js:10

@function model-scene.callback.7 — Provides the callback for a list of 0, 1, 2 map. Inputs: k. Uses: t vector; p positions subarray. Returns: t vector using m, p positions subarray using v, v plus 3.

### src/model-scene.js:11

@function model-scene.rayTriangle.8 — Handles ray triangle within model scene. Inputs: origin; direction; points. Uses: sub; cross; dot. Returns: null; null.

### src/model-scene.js:11

@function model-scene.sub.9 — Returns a map using a callback. Inputs: a; b. Uses: a map. Returns: a map using a callback.

### src/model-scene.js:11

@function model-scene.callback.10 — Returns v minus b at i. Inputs: v; i. Returns: v minus b at i.

### src/model-scene.js:11

@function model-scene.cross.11 — Returns a list of a at 1 multiplied by b at 2 minus a at 2 multiplied by b at 1, a at 2 multiplied by b at 0 minus a at 0 multiplied by b at 2, a at 0 multiplied by b at 1 minus a at 1 multiplied by b at 0. Inputs: a; b. Returns: a list of a at 1 multiplied by b at 2 minus a at 2 multiplied by b at 1, a at 2 multiplied by b at 0 minus a at 0 multiplied by b at 2, a at 0 multiplied by b at 1 minus a at 1 multiplied by b at 0.

### src/model-scene.js:11

@function model-scene.dot.12 — Returns a reduce using a callback, 0. Inputs: a; b. Uses: a reduce. Returns: a reduce using a callback, 0.

### src/model-scene.js:11

@function model-scene.callback.13 — Returns v plus x multiplied by b at i. Inputs: v; x; i. Returns: v plus x multiplied by b at i.

### src/model-targeting.js:3

@function model-targeting.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model targeting.

### src/model-targeting.js:4

@function model-targeting.ray.2 — Handles ray within model targeting. Inputs: game; sx; sy. Uses: frontier render camera; frontier interior ground point; d map. Returns: a record containing origin, direction, maxDistance; a record containing origin, direction.

### src/model-targeting.js:4

@function model-targeting.callback.3 — Returns v divided by length. Inputs: v. Returns: v divided by length.

### src/model-targeting.js:4

@function model-targeting.callback.4 — Returns v divided by length. Inputs: v. Returns: v divided by length.

### src/model-targeting.js:5

@function model-targeting.geometry.5 — Handles geometry within model targeting. Inputs: origin; direction; entities; assignment pattern. Uses: frontier model library get; frontier model scene triangles; frontier model renderer transform. Returns: nearest.

### src/model-targeting.js:5

@function model-targeting.callback.6 — Provides the callback for frontier model scene triangles. Inputs: points. Updates: nearest. Uses: frontier model scene ray triangle.

### src/model-targeting.js:8

@function model-targeting.roomGeometry.7 — player reach rays must meet the actual room surfaces, not centroid order. Inputs: game; origin; direction; assignment pattern. Updates: nearest. Uses: frontier interior data; frontier model scene ray triangle. Returns: null; nearest.

### src/model-targeting.js:9

@function model-targeting.obstruction.8 — Handles obstruction within model targeting. Inputs: game; origin; direction; entities; max distance. Uses: geometry; room geometry. Returns: geometry using origin, direction, entities or room geometry using game, origin, direction.

### src/model-targeting.js:10

@function model-targeting.terrain.9 — Handles terrain within model targeting. Inputs: game; origin; direction; distance. Updates: t. Uses: origin map; frontier terrain height. Returns: false; true.

### src/model-targeting.js:10

@function model-targeting.callback.10 — Returns v plus direction at i multiplied by t. Inputs: v; i. Returns: v plus direction at i multiplied by t.

### src/model-targeting.js:11

@function model-targeting.pick.11 — Handles pick within model targeting. Inputs: game; sx; sy; entities; assignment pattern. Updates: hit. Uses: ray; geometry; frontier model transform ray box; frontier model events matrix. Returns: hit selects a record containing copied fields, zoneDepth or null; a record containing id, eventId, name, x, y, z, height, zoneHit.

### src/model-targeting.js:11

@function model-targeting.callback.12 — Returns v plus r direction at i multiplied by hit distance. Inputs: v; i. Returns: v plus r direction at i multiplied by hit distance.

### src/model-targeting.js:11

@function model-targeting.callback.13 — Returns v plus r direction at i multiplied by hit distance. Inputs: v; i. Returns: v plus r direction at i multiplied by hit distance.

### src/model-targeting.js:11

@function model-targeting.callback.14 — Returns event id equals hit event id. Inputs: event. Returns: event id equals hit event id.

### src/model-targeting.js:11

@function model-targeting.callback.15 — Returns event id equals hit event id. Inputs: event. Returns: event id equals hit event id.

### src/model-targeting.js:11

@function model-targeting.callback.16 — Returns a distance minus b distance or a entity id locale compare using b entity id or a zone id locale compare using b zone id. Inputs: a; b. Uses: a entity id locale compare; a zone id locale compare. Returns: a distance minus b distance or a entity id locale compare using b entity id or a zone id locale compare using b zone id.

### src/model-targeting.js:11

@function model-targeting.callback.17 — Returns v minus reach origin at i. Inputs: v; i. Returns: v minus reach origin at i.

### src/model-targeting.js:11

@function model-targeting.callback.18 — Returns v divided by length. Inputs: v. Returns: v divided by length.

### src/model-targeting.js:11

@function model-targeting.callback.19 — Returns v divided by length. Inputs: v. Returns: v divided by length.

### src/model-transform.js:5

@function model-transform.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model transform.

### src/model-transform.js:6

@function model-transform.identity.2 — Returns a list of 1, 0, 0, 0. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 1, 0, 0, 0.

### src/model-transform.js:7

@function model-transform.multiply.3 — Composes two transforms in the order defined by this module. Inputs: a; b. Updates: c at col multiplied by 4 plus row. Uses: a new array fill. Returns: c.

### src/model-transform.js:8

@function model-transform.vector.4 — Transforms a point or direction using the provided matrix. Inputs: m; p; assignment pattern. Uses: a list of 0, 1, 2 map. Returns: a list of 0, 1, 2 map using a callback.

### src/model-transform.js:8

@function model-transform.callback.5 — Returns m at r multiplied by p at 0 plus m at 4 plus r multiplied by p at 1 plus m at 8 plus r multiplied by p at 2 plus m at 12 plus r multiplied by w. Inputs: r. Returns: m at r multiplied by p at 0 plus m at 4 plus r multiplied by p at 1 plus m at 8 plus r multiplied by p at 2 plus m at 12 plus r multiplied by w.

### src/model-transform.js:9

@function model-transform.validate.6 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: read; out scale some; error. Returns: out.

### src/model-transform.js:9

@function model-transform.read.7 — Handles read within model transform. Inputs: key; fallback. Uses: array is array; v every; error. Returns: a list of spread element.

### src/model-transform.js:9

@function model-transform.callback.8 — Returns v is less than 0.001 or v is greater than 1000. Inputs: v. Returns: v is less than 0.001 or v is greater than 1000.

### src/model-transform.js:10

@function model-transform.matrix.9 — Handles matrix within model transform. Inputs: value. Updates: s at 0; s at 5; s at 10; out at 12; out at 13. Uses: validate; t rotation map; identity; multiply. Returns: out.

### src/model-transform.js:10

@function model-transform.callback.10 — Returns v multiplied by math pi divided by 180. Inputs: v. Returns: v multiplied by math pi divided by 180.

### src/model-transform.js:11

@function model-transform.inverse.11 — Computes the inverse transform used to convert world queries into local coordinates. Inputs: m. Updates: out at 12; out at 13; out at 14. Uses: error; vector. Returns: out.

### src/model-transform.js:14

@function model-transform.box.12 — model transform or identity for an independent invisible event volume. Inputs: value. Uses: /^[A-Za-z0-9_-]{1,60}$/ test; error; array is array; size every. Returns: a record containing id, name, size, transform.

### src/model-transform.js:14

@function model-transform.callback.13 — Returns number is finite using v and v is greater than 0 and v is at most 1000. Inputs: v. Uses: number is finite. Returns: number is finite using v and v is greater than 0 and v is at most 1000.

### src/model-transform.js:15

@function model-transform.rayBox.14 — Handles ray box within model transform. Inputs: origin; direction; value; assignment pattern; assignment pattern. Updates: array pattern; enter; exit. Uses: box; inverse; multiply; matrix. Returns: null; null.

### src/model-transform.js:16

@function model-transform.contains.15 — Handles contains within model transform. Inputs: point; value; assignment pattern. Uses: box; vector; inverse; multiply. Returns: p every using a callback.

### src/model-transform.js:16

@function model-transform.callback.16 — Returns math abs using v is at most b size at i divided by 2 plus 1e-9. Inputs: v; i. Returns: math abs using v is at most b size at i divided by 2 plus 1e-9.

### src/model-transform.js:17

@function model-transform.corners.17 — Handles corners within model transform. Inputs: value; assignment pattern. Uses: box; multiply; matrix; out push. Returns: out.

### src/model-visibility.js:4

@function model-visibility.install — Publishes visibility helpers without loading assets or changing game state. Inputs: root, browser/global namespace. Returns: nothing; installs FrontierModelVisibility.

### src/model-visibility.js:6

@function model-visibility.validate — Normalizes a saved per-instance draw policy. Inputs: value, optional policy record. Returns: a fresh mode/distance record. Throws for unsupported modes or distances outside 1–10000 world units; does not mutate input.

### src/model-visibility.js:12

@function model-visibility.distance — Measures horizontal distance from camera to conservative world-space bounds. Inputs: entity, decoded asset, camera. Returns: nonnegative world units. Full rotation/scale is applied to eight corners; unloaded assets fall back to their origin. No state changes; conservative bounds can retain a model slightly longer.

### src/model-visibility.js:22

@function model-visibility.candidates — Adds distant model instances missed by the legacy origin-based spatial query. Inputs: game, camera, nearby entity array. Returns: a new deduplicated candidate array; stores aggregate visibility diagnostics on game. Does not wake actors or alter collision. Scans model references only; decoded geometry remains shared.

### src/model-volumes.js:3

@function model-volumes.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model volumes.

### src/model-volumes.js:4

@function model-volumes.update.2 — Advances this system using the current state and elapsed time. Inputs: game; session. Updates: state; state inside; game model zone debug. Uses: states get; states set; frontier model events contains using host, position map; frontier model events contains.

### src/model-volumes.js:4

@function model-volumes.callback.3 — Returns b id. Inputs: b. Returns: b id.

### src/model-volumes.js:4

@function model-volumes.callback.4 — Returns e id equals entry host id. Inputs: e. Returns: e id equals entry host id.

### src/model-volumes.js:4

@function model-volumes.callback.5 — Returns b id equals entry zone id. Inputs: b. Returns: b id equals entry zone id.

### src/model-volumes.js:4

@function model-volumes.callback.6 — Returns e id equals entry event id. Inputs: e. Returns: e id equals entry event id.

### src/model-volumes.js:5

@function model-volumes.debug.7 — Handles debug within model volumes. Inputs: session. Uses: states get; structured clone. Returns: s selects a record containing inside, pending, dropped or a record containing inside, pending, dropped.

### src/model-workbench.js:3

@function model-workbench.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model workbench.

### src/model-workbench.js:4

@function model-workbench.el.2 — Handles el within model workbench. Inputs: tag; text. Updates: n text content. Uses: document create element. Returns: n.

### src/model-workbench.js:5

@function model-workbench.open.3 — Handles open within model workbench. Inputs: assignment pattern. Updates: d class name; d style css text; files type; files multiple; folder type. Uses: el; d set attribute; d append; files set attribute.

### src/model-workbench.js:5

@function model-workbench.onSelect.4 — Handles on select within model workbench. Inputs: no explicit arguments; uses enclosing module state.

### src/model-workbench.js:6

@function model-workbench.label.5 — Handles label within model workbench. Inputs: text; input. Updates: l style css text. Uses: el; l append; d append.

### src/model-workbench.js:6

@function model-workbench.onchange.6 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: folder value.

### src/model-workbench.js:6

@function model-workbench.onchange.7 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: files value.

### src/model-workbench.js:7

@function model-workbench.show.8 — Handles show within model workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: status text content; ctx terrain depth; info text content. Uses: frontier model library get; frontier model renderer prepare; bounds min map; bounds max map. Returns: without a result; without a result.

### src/model-workbench.js:7

@function model-workbench.callback.9 — Returns v plus bounds max at i divided by 2. Inputs: v; i. Returns: v plus bounds max at i divided by 2.

### src/model-workbench.js:7

@function model-workbench.callback.10 — Returns v minus bounds min at i. Inputs: v; i. Returns: v minus bounds min at i.

### src/model-workbench.js:7

@function model-workbench.callback.11 — Returns m id equals list value. Inputs: m. Returns: m id equals list value.

### src/model-workbench.js:7

@function model-workbench.callback.12 — Returns n plus p data byte length. Inputs: n; p. Returns: n plus p data byte length.

### src/model-workbench.js:8

@function model-workbench.refresh.13 — Handles refresh within model workbench. Inputs: selected. Updates: list value. Uses: list replace children; frontier model library list; list append; show.

### src/model-workbench.js:9

@function model-workbench.onclick.14 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: import button disabled; bundle at path; status text content. Uses: error; selected find; file array buffer; id value trim.

### src/model-workbench.js:9

@function model-workbench.callback.15 — Returns /\.glb$/i test using f name. Inputs: f. Uses: /\.glb$/i test. Returns: /\.glb$/i test using f name.

### src/model-workbench.js:9

@function model-workbench.callback.16 — Returns /\.gltf$/i test using f name. Inputs: f. Uses: /\.gltf$/i test. Returns: /\.gltf$/i test using f name.

### src/model-workbench.js:10

@function model-workbench.onclick.17 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: on select; d close. Returns: without a result.

### src/model-workbench.js:10

@function model-workbench.onclick.18 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using .

### src/model-workbench.js:10

@function model-workbench.callback.19 — Provides the callback for d add event listener. Inputs: no explicit arguments; uses enclosing module state. Uses: d remove.

### src/movement.js:5

@function movement.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf frontier movement. Uses: object freeze.

### src/movement.js:14

@function movement.movePlayer.2 — Combine keyboard/analog axes, normalize diagonals, rotate by yaw and substep collision. Animate only when position actually changes. Inputs: game; keys; dt; blocked; assignment pattern. Updates: f; s; dx; dy; p x. Uses: number; keys has; rules get; blocked.

### src/music-picker.js:4

@function music-picker.callback.1 — Provides the callback for a callback. Inputs: root. Updates: original closest using "label" hidden; group class name; group inner html; group query selector using "h4" text content; group query selector using ".addTrack" onclick. Uses: $; original closest; document create element; group query selector.

### src/music-picker.js:4

@function music-picker.$.2 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id.

### src/music-picker.js:8

@function music-picker.onclick.3 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: original value. Uses: original value split using "\n" filter; original value split; names includes; names push. Returns: without a result.

### src/music-picker.js:9

@function music-picker.onclick.4 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: original value. Uses: original value split using "\n" filter using a callback join; original value split using "\n" filter; original value split; refresh.

### src/music-picker.js:9

@function music-picker.callback.5 — Returns n and n does not equal playlist value. Inputs: n. Returns: n and n does not equal playlist value.

### src/music-picker.js:13

@function music-picker.refresh.6 — Handles refresh within music picker. Inputs: no explicit arguments; uses enclosing module state. Updates: p group query selector using ".assetWarning" text content. Uses: $; input value split using "\n" filter; input value split; p available replace children.

### src/music-picker.js:13

@function music-picker.callback.7 — Returns a new option. Inputs: n. Returns: a new option.

### src/music-picker.js:13

@function music-picker.callback.8 — Returns a new option. Inputs: n. Returns: a new option.

### src/music-picker.js:13

@function music-picker.callback.9 — Returns the inverse of known includes using n. Inputs: n. Uses: known includes. Returns: the inverse of known includes using n.

### src/music-picker.js:14

@function music-picker.scan.10 — Handles scan within music picker. Inputs: no explicit arguments; uses enclosing module state. Updates: button disabled; catalog; status text content. Uses: root frontier desktop music catalog; refresh.

### src/music-picker.js:16

@function music-picker.catalog.11 — Returns structured clone using catalog. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using catalog.

### src/music-picker.js:16

@function music-picker.useManifest.12 — Handles use manifest within music picker. Inputs: value. Updates: catalog. Uses: structured clone; refresh.

### src/music.js:5

@function music.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier music.

### src/music.js:8

@function music.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Updates: result at key. Uses: error; number is finite; array is array; list some. Returns: result.

### src/music.js:13

@function music.callback.3 — Returns typeof name does not equal "string" or name length is greater than 180 or the inverse of name trim using or name includes using ".." or /[\\/:]/ test using name or the inverse of /^.+\.(ogg|mp3|wav|m4a|webm)$/i test using name. Inputs: name. Uses: name trim; name includes; /[\\/:]/ test; /^.+\.(ogg|mp3|wav|m4a|webm)$/i test. Returns: typeof name does not equal "string" or name length is greater than 180 or the inverse of name trim using or name includes using ".." or /[\\/:]/ test using name or the inverse of /^.+\.(ogg|mp3|wav|m4a|webm)$/i test using name.

### src/music.js:14

@function music.callback.4 — Returns name trim using . Inputs: name. Uses: name trim. Returns: name trim using .

### src/music.js:19

@function music.playlist.5 — track at a bag boundary. Inject RNG for reproducible tests. Inputs: tracks; assignment pattern. Returns: a callback.

### src/music.js:21

@function music.callback.6 — Provides the callback for the enclosing music operation. Inputs: no explicit arguments; uses enclosing module state. Updates: bag; array pattern; last. Uses: random; bag at; bag pop. Returns: null; assignment.

### src/music.js:24

@function music.effective.7 — Handles effective within music. Inputs: settings; mode. Returns: mode equals "combat" selects settings combat or settings map exploration length selects settings map exploration or settings exploration.

### src/music.js:25

@function music.create.8 — Builds a new instance and its public operations from the supplied configuration. Inputs: assignment pattern. Updates: audio preload; audio onended; audio onerror. Returns: a record containing unlock, setVolume, update, stop, mode, track.

### src/music.js:25

@function music.clock.9 — Returns date now using divided by 1000. Inputs: no explicit arguments; uses enclosing module state. Uses: date now. Returns: date now using divided by 1000.

### src/music.js:31

@function music.applyVolume.10 — Handles apply volume within music. Inputs: no explicit arguments; uses enclosing module state. Updates: audio volume.

### src/music.js:32

@function music.switchMode.11 — Handles switch mode within music. Inputs: value. Updates: mode; next. Uses: failed clear; audio pause; playlist; effective.

### src/music.js:33

@function music.fadeStep.12 — Handles fade step within music. Inputs: no explicit arguments; uses enclosing module state. Updates: gain; transition. Uses: clock; apply volume; switch mode. Returns: without a result.

### src/music.js:41

@function music.playNext.13 — Handles play next within music. Inputs: no explicit arguments; uses enclosing module state. Updates: track; audio src; audio current time. Uses: effective; next; failed has; audio pause. Returns: without a result; without a result.

### src/music.js:47

@function music.callback.14 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: blocked. Returns: assignment.

### src/music.js:47

@function music.callback.15 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: blocked. Returns: assignment.

### src/music.js:49

@function music.onerror.16 — Handles onerror within music. Inputs: no explicit arguments; uses enclosing module state. Uses: decode uricomponent; audio src split using "/" pop; audio src split; failed add.

### src/music.js:52

@function music.unlock.17 — Handles unlock within music. Inputs: no explicit arguments; uses enclosing module state. Updates: unlocked. Uses: play next.

### src/music.js:53

@function music.setVolume.18 — Handles set volume within music. Inputs: value. Updates: volume. Uses: apply volume.

### src/music.js:54

@function music.update.19 — Advances this system using the current state and elapsed time. Inputs: game. Updates: world; config; transition; gain. Uses: switch mode; clock; fade step. Returns: without a result.

### src/music.js:65

@function music.stop.20 — Handles stop within music. Inputs: no explicit arguments; uses enclosing module state. Updates: transition; gain; next; blocked; world. Uses: audio pause; audio remove attribute; audio load.

### src/music.js:66

@function music.mode.21 — Handles mode within music. Inputs: no explicit arguments; uses enclosing module state. Returns: mode.

### src/music.js:66

@function music.track.22 — Handles track within music. Inputs: no explicit arguments; uses enclosing module state. Returns: audio src.

### src/muzzle-editor.js:5

@function muzzle-editor.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Updates: canvas onclick; $ using "aimMode" onchange; $ using "barrelDepth" onchange; $ using "clearBarrel" onclick; $ using "undoCalibration" onclick. Uses: $; canvas get context; structured clone; window add event listener.

### src/muzzle-editor.js:6

@function muzzle-editor.$.2 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id.

### src/muzzle-editor.js:8

@function muzzle-editor.remember.3 — Retains a bounded list of sufficiently separated safe player positions. Inputs: no explicit arguments; uses enclosing module state. Uses: undo push; structured clone; undo shift.

### src/muzzle-editor.js:9

@function muzzle-editor.profile.4 — Returns data profiles find using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: data profiles find. Returns: data profiles find using a callback.

### src/muzzle-editor.js:9

@function muzzle-editor.callback.5 — Returns p id equals $ using "profile" value. Inputs: p. Uses: $. Returns: p id equals $ using "profile" value.

### src/muzzle-editor.js:9

@function muzzle-editor.indices.6 — Returns a list of number using $ using "row" value, number using $ using "column" value. Inputs: no explicit arguments; uses enclosing module state. Uses: number; $. Returns: a list of number using $ using "row" value, number using $ using "column" value.

### src/muzzle-editor.js:11

@function muzzle-editor.selectedPoint.7 — Create missing frame calibration with center defaults; subsequent edits affect only the selected frame. Inputs: no explicit arguments; uses enclosing module state. Updates: p muzzles at row plus ":" plus col. Uses: profile; indices. Returns: assignment.

### src/muzzle-editor.js:19

@function muzzle-editor.controls.8 — Populate direction/frame controls and choose the correct sheet image for the selected profile. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "rows" value; $ using "columns" value; $ using "referenceHeight" value; image; image src. Uses: profile; $ using "row" replace children; $; array from.

### src/muzzle-editor.js:24

@function muzzle-editor.callback.9 — Returns a new option. Inputs: ; i. Returns: a new option.

### src/muzzle-editor.js:28

@function muzzle-editor.callback.10 — Returns a new option. Inputs: ; i. Returns: a new option.

### src/muzzle-editor.js:38

@function muzzle-editor.refresh.11 — Rebuild forms from authored data; use textContent for user text and keep selection/page indices in range. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "profile" value. Uses: $; $ using "profile" replace children; data profiles map; data profiles some.

### src/muzzle-editor.js:40

@function muzzle-editor.callback.12 — Returns a new option. Inputs: p. Returns: a new option.

### src/muzzle-editor.js:41

@function muzzle-editor.callback.13 — Returns p id equals id. Inputs: p. Returns: p id equals id.

### src/muzzle-editor.js:45

@function muzzle-editor.read.14 — Populate numeric angle controls from the selected muzzle and redraw its markers. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "aimMode" value; $ using "barrelDepth" value; $ using "yaw" value; $ using "pitch" value. Uses: selected point; $; profile; draw.

### src/muzzle-editor.js:52

@function muzzle-editor.draw.15 — Draws this system’s current state into the supplied rendering context. Inputs: no explicit arguments; uses enclosing module state. Updates: canvas width; canvas height; ctx image smoothing enabled; ctx fill style; ctx stroke style. Uses: profile; indices; selected point; ctx fill rect.

### src/muzzle-editor.js:74

@function muzzle-editor.onclick.16 — Responds to a button or clickable control. Inputs: e. Updates: m x; m y; m barrel x; m barrel y; m barrel depth. Uses: profile; indices; canvas get bounding client rect; selected point.

### src/muzzle-editor.js:89

@function muzzle-editor.onchange.17 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: profile using aim mode. Uses: remember; profile; $; draw.

### src/muzzle-editor.js:90

@function muzzle-editor.onchange.18 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: selected point using barrel depth. Uses: remember; selected point; number; $.

### src/muzzle-editor.js:91

@function muzzle-editor.onclick.19 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: remember; selected point; read.

### src/muzzle-editor.js:92

@function muzzle-editor.onclick.20 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: data; $ using "profile" value; $ using "row" value; $ using "column" value. Uses: $; indices; undo pop; refresh.

### src/muzzle-editor.js:93

@function muzzle-editor.onchange.21 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: m yaw offset; m pitch offset. Uses: remember; selected point; number; $.

### src/muzzle-editor.js:100

@function muzzle-editor.onchange.22 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: profile using reference height. Uses: remember; profile; number; $.

### src/muzzle-editor.js:103

@function muzzle-editor.onclick.23 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: p muzzles at row plus ":" plus i. Uses: profile; indices; structured clone; selected point.

### src/muzzle-editor.js:115

@function muzzle-editor.onchange.24 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "result" text content; pending. Uses: $. Returns: without a result; without a result.

### src/muzzle-editor.js:119

@function muzzle-editor.callback.25 — Provides the callback for the enclosing muzzle editor operation. Inputs: resolve. Updates: r onload. Uses: r read as data url.

### src/muzzle-editor.js:121

@function muzzle-editor.onload.26 — Processes a resource after it finishes loading. Inputs: no explicit arguments; uses enclosing module state. Uses: resolve. Returns: resolve using r result.

### src/muzzle-editor.js:127

@function muzzle-editor.onclick.27 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: img src; $ using "profile" value; $ using "result" text content. Uses: img decode; error; number; $. Returns: without a result; without a result.

### src/muzzle-editor.js:154

@function muzzle-editor.callback.28 — Returns i. Inputs: ; i. Returns: i.

### src/muzzle-editor.js:166

@function muzzle-editor.onclick.29 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "result" text content. Uses: frontier muzzle validate; window parent post message; $.

### src/muzzle-editor.js:180

@function muzzle-editor.onclick.30 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "result" text content; a href; a download. Uses: frontier muzzle validate; $; document create element; url create object url. Returns: without a result.

### src/muzzle-editor.js:189

@function muzzle-editor.callback.31 — Returns url revoke object url using a href. Inputs: no explicit arguments; uses enclosing module state. Uses: url revoke object url. Returns: url revoke object url using a href.

### src/muzzle-editor.js:192

@function muzzle-editor.onchange.32 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: data; $ using "result" text content. Uses: frontier muzzle validate; json parse; $ using "import" files at 0 text; $.

### src/muzzle-editor.js:202

@function muzzle-editor.callback.33 — Provides the callback for window add event listener. Inputs: event. Updates: data; undo. Uses: frontier muzzle validate; refresh.

### src/muzzle.js:5

@function muzzle.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier muzzle. Uses: load.

### src/muzzle.js:9

@function muzzle.validate.2 — Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields. Inputs: data. Uses: array is array; error; ids has; ids add. Returns: structured clone using data.

### src/muzzle.js:17

@function muzzle.callback.3 — Returns the inverse of number is integer using r or r is less than 0 or r is at least p rows. Inputs: r. Uses: number is integer. Returns: the inverse of number is integer using r or r is less than 0 or r is at least p rows.

### src/muzzle.js:20

@function muzzle.callback.4 — Returns the inverse of number is integer using c or c is less than 0 or c is at least p columns. Inputs: c. Uses: number is integer. Returns: the inverse of number is integer using c or c is less than 0 or c is at least p columns.

### src/muzzle.js:21

@function muzzle.callback.5 — Returns the inverse of number is finite using f at k. Inputs: k. Uses: number is finite. Returns: the inverse of number is finite using f at k.

### src/muzzle.js:35

@function muzzle.load.6 — Validate then install muzzle profiles keyed by ID. Existing unrelated profiles remain available. Inputs: data. Uses: validate; profiles set.

### src/muzzle.js:39

@function muzzle.spec.7 — Resolve the actor profile ID; default the player to the armed Candy calibration. Inputs: entity. Uses: profiles get. Returns: profiles get using entity sprite profile or entity id equals "player" or entity kind equals "player" selects "candy-armed" or "".

### src/muzzle.js:43

@function muzzle.frame.8 — Select the same directional animation frame used for drawing so muzzle points stay synchronized. Inputs: entity; game. Uses: spec; root frontier render camera; frontier directions select. Returns: null; a record containing profile, copied fields, frame.

### src/muzzle.js:54

@function muzzle.point.9 — Convert authored full-sheet pixels into billboard-local offsets, then invert projection into world XYZ. Inputs: entity; game; assignment pattern. Uses: frame; frontier render camera; frontier render project. Returns: null; null.

### src/muzzle.js:78

@function muzzle.barrel.10 — Resolve only when firing/reticle updating, never mutate the sheet while drawing. Inputs: entity; game. Uses: spec; frame; frontier render camera. Returns: null; null.

### src/muzzle.js:94

@function muzzle.export.11 — Handles export within muzzle. Inputs: no explicit arguments; uses enclosing module state. Uses: profiles values. Returns: a record containing schema, profiles.

### src/mz-command-catalog.js:3

@function mz-command-catalog.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier mzcatalog.

### src/mz-command-editing.js:2

@function mz-command-editing.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier mzcommand editing.

### src/mz-command-editing.js:3

@function mz-command-editing.marker.2 — Returns a record containing type, code, indent, parameters. Inputs: code; indent. Returns: a record containing type, code, indent, parameters.

### src/mz-command-editing.js:4

@function mz-command-editing.bounds.3 — Calculates or applies the enclosing limits for this module’s data. Inputs: commands; index. Updates: otherwise. Uses: error. Returns: a record containing end, otherwise.

### src/mz-command-editing.js:5

@function mz-command-editing.insertBranch.4 — Handles insert branch within mz command editing. Inputs: command. Uses: structured clone; marker. Returns: a list of c, marker using 0, indent plus 1, spread element, marker using 412, indent.

### src/mz-command-editing.js:6

@function mz-command-editing.replaceBranch.5 — Handles replace branch within mz command editing. Inputs: commands; index; command. Updates: c indent; commands at index. Uses: bounds; structured clone; commands splice; marker. Returns: commands.

### src/mz-command-editing.js:7

@function mz-command-editing.groupRange.6 — Handles group range within mz command editing. Inputs: commands; start; assignment pattern. Updates: changed; start; end. Uses: commands for each; a list of b start, b end, spread element some. Returns: a list of start, end.

### src/mz-command-editing.js:8

@function mz-command-editing.callback.7 — Provides the callback for commands for each. Inputs: c; i. Uses: openers has; stack push; openers get; sections has.

### src/mz-command-editing.js:9

@function mz-command-editing.callback.8 — Returns start is at most i and i is at most end. Inputs: i. Returns: start is at most i and i is at most end.

### src/mz-command-editing.js:11

@function mz-command-editing.rebase.9 — Handles rebase within mz command editing. Inputs: commands; indent. Uses: number is integer; error; commands filter; mz map. Returns: commands map using a callback.

### src/mz-command-editing.js:11

@function mz-command-editing.callback.10 — Returns c type equals "mz". Inputs: c. Returns: c type equals "mz".

### src/mz-command-editing.js:11

@function mz-command-editing.callback.11 — Returns c indent or 0. Inputs: c. Returns: c indent or 0.

### src/mz-command-editing.js:11

@function mz-command-editing.callback.12 — Provides the callback for commands map. Inputs: command. Updates: c indent. Uses: structured clone; error. Returns: c.

### src/mz-command-editing.js:12

@function mz-command-editing.choiceBounds.13 — Handles choice bounds within mz command editing. Inputs: commands; index. Uses: error; a list of 402, 403 includes; sections push. Returns: a record containing end, sections.

### src/mz-command-editing.js:13

@function mz-command-editing.insertChoices.14 — Handles insert choices within mz command editing. Inputs: command; assignment pattern. Uses: structured clone; c parameters at 0 for each; rows push; marker. Returns: rows.

### src/mz-command-editing.js:13

@function mz-command-editing.callback.15 — Returns rows push using a record containing type, code, indent, parameters, spread element. Inputs: label; i. Uses: rows push; bodies get; marker. Returns: rows push using a record containing type, code, indent, parameters, spread element.

### src/mz-command-editing.js:14

@function mz-command-editing.replaceChoices.16 — Handles replace choices within mz command editing. Inputs: commands; index; command. Updates: command. Uses: choice bounds; sections for each; insert choices; sections map using a callback find. Returns: commands.

### src/mz-command-editing.js:14

@function mz-command-editing.callback.17 — Provides the callback for sections for each. Inputs: start; i. Uses: bodies set; structured clone; commands slice.

### src/mz-command-editing.js:14

@function mz-command-editing.callback.18 — Returns commands at i. Inputs: i. Returns: commands at i.

### src/mz-command-editing.js:14

@function mz-command-editing.callback.19 — Returns c code equals row code and row code equals 403 or c parameters at 0 equals row parameters at 0. Inputs: c. Returns: c code equals row code and row code equals 403 or c parameters at 0 equals row parameters at 0.

### src/mz-commands.js:4

@function mz-commands.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier mzcommands. Uses: root frontier mzcatalog or a list of flat map; register.

### src/mz-commands.js:5

@function mz-commands.callback.2 — Returns g commands map using a callback. Inputs: g. Uses: g commands map. Returns: g commands map using a callback.

### src/mz-commands.js:5

@function mz-commands.callback.3 — Returns a list of c code, a record containing copied fields, tab, category. Inputs: c. Returns: a list of c code, a record containing copied fields, tab, category.

### src/mz-commands.js:6

@function mz-commands.integer.4 — Returns number is integer using v and v is at least min and v is at most max. Inputs: v; min; max. Uses: number is integer. Returns: number is integer using v and v is at least min and v is at most max.

### src/mz-commands.js:7

@function mz-commands.range.5 — Handles range within mz commands. Inputs: p. Uses: integer; error.

### src/mz-commands.js:8

@function mz-commands.register.6 — Handles register within mz commands. Inputs: code; definition. Uses: integer; handlers has; error; handlers set.

### src/mz-commands.js:9

@function mz-commands.validate.7 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: command. Uses: integer; array is array; error; root frontier event schema json. Returns: c.

### src/mz-commands.js:10

@function mz-commands.list.8 — Handles list within mz commands. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element map; catalogue values. Returns: a list of spread element map using a callback.

### src/mz-commands.js:10

@function mz-commands.callback.9 — Returns a record containing copied fields, status. Inputs: c. Uses: handlers has; handlers get. Returns: a record containing copied fields, status.

### src/mz-commands.js:11

@function mz-commands.lower.10 — Handles lower within mz commands. Inputs: commands; assignment pattern. Uses: commands flat map. Returns: commands flat map using a callback.

### src/mz-commands.js:11

@function mz-commands.callback.11 — Provides the callback for commands flat map. Inputs: c. Uses: structured clone; handlers get; catalogue get; d lower. Returns: a list of structured clone using c; a list of a record containing type, code, name.

### src/mz-commands.js:12

@function mz-commands.condition.12 — Handles condition within mz commands. Inputs: p. Uses: string; error. Returns: a record containing type, key, value; a record containing type, left, right, operator.

### src/mz-commands.js:21

@function mz-commands.branch.13 — Handles branch within mz commands. Inputs: c. Uses: root frontier conditions validate; condition. Returns: c expression selects root frontier conditions validate using c expression or root frontier conditions validate using condition using c parameters.

### src/mz-commands.js:22

@function mz-commands.validate.14 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: error.

### src/mz-commands.js:22

@function mz-commands.lower.15 — Returns a list of a record containing type, out. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of a record containing type, out.

### src/mz-commands.js:23

@function mz-commands.validate.16 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: integer; error.

### src/mz-commands.js:23

@function mz-commands.lower.17 — Returns a list of a record containing type, sound. Inputs: c. Uses: structured clone. Returns: a list of a record containing type, sound.

### src/mz-commands.js:24

@function mz-commands.validate.18 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: error.

### src/mz-commands.js:24

@function mz-commands.lower.19 — Returns a list of a record containing type. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of a record containing type.

### src/mz-commands.js:25

@function mz-commands.validate.20 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: array is array; p at 0 some; integer; error.

### src/mz-commands.js:25

@function mz-commands.callback.21 — Returns the inverse of integer using v, i equals 3 selects 0 or - 255, 255. Inputs: v; i. Uses: integer. Returns: the inverse of integer using v, i equals 3 selects 0 or - 255, 255.

### src/mz-commands.js:25

@function mz-commands.lower.22 — Returns a list of a record containing type, tone, frames, wait. Inputs: c. Returns: a list of a record containing type, tone, frames, wait.

### src/mz-commands.js:26

@function mz-commands.validate.23 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: integer; error.

### src/mz-commands.js:26

@function mz-commands.lower.24 — Returns a list of a record containing type, power, speed, frames, wait. Inputs: c. Returns: a list of a record containing type, power, speed, frames, wait.

### src/mz-commands.js:27

@function mz-commands.validate.25 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: array is array; p at 0 some; integer; error.

### src/mz-commands.js:27

@function mz-commands.callback.26 — Returns the inverse of integer using v, 0, 255. Inputs: v. Uses: integer. Returns: the inverse of integer using v, 0, 255.

### src/mz-commands.js:27

@function mz-commands.lower.27 — Returns a list of a record containing type, color, frames, wait. Inputs: c. Returns: a list of a record containing type, color, frames, wait.

### src/mz-commands.js:28

@function mz-commands.validate.28 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: integer; error.

### src/mz-commands.js:28

@function mz-commands.lower.29 — Returns a list of a record containing type, value. Inputs: c. Returns: a list of a record containing type, value.

### src/mz-commands.js:29

@function mz-commands.validate.30 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: error; root frontier transfer player validate.

### src/mz-commands.js:29

@function mz-commands.lower.31 — Returns a list of a record containing type, parameters. Inputs: c. Uses: structured clone. Returns: a list of a record containing type, parameters.

### src/mz-commands.js:30

@function mz-commands.validate.32 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: integer; array is array; c lines some; c lines join.

### src/mz-commands.js:30

@function mz-commands.callback.33 — Returns typeof x does not equal "string". Inputs: x. Returns: typeof x does not equal "string".

### src/mz-commands.js:30

@function mz-commands.lower.34 — Returns a list of a record containing type, text, dialogue, speaker, background, position, faceName, faceIndex. Inputs: c. Uses: c lines join. Returns: a list of a record containing type, text, dialogue, speaker, background, position, faceName, faceIndex.

### src/mz-commands.js:31

@function mz-commands.validate.35 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: array is array; integer; p at 0 some; error.

### src/mz-commands.js:31

@function mz-commands.callback.36 — Returns typeof s does not equal "string" or s length is greater than 1000. Inputs: s. Returns: typeof s does not equal "string" or s length is greater than 1000.

### src/mz-commands.js:31

@function mz-commands.lower.37 — Returns a list of a record containing type, options, cancelType, defaultType, position, background, indent. Inputs: c. Uses: structured clone. Returns: a list of a record containing type, options, cancelType, defaultType, position, background, indent.

### src/mz-commands.js:32

@function mz-commands.validate.38 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: integer; error.

### src/mz-commands.js:32

@function mz-commands.lower.39 — Returns a list of a record containing type, itemId, operation, operand, value. Inputs: c. Returns: a list of a record containing type, itemId, operation, operand, value.

### src/mz-commands.js:33

@function mz-commands.validate.40 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: integer; error.

### src/mz-commands.js:33

@function mz-commands.lower.41 — Returns a list of a record containing type, operation, operand, value. Inputs: c. Returns: a list of a record containing type, operation, operand, value.

### src/mz-commands.js:34

@function mz-commands.validate.42 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: integer; error.

### src/mz-commands.js:34

@function mz-commands.lower.43 — Returns a list of a record containing type, variable, digits. Inputs: c. Uses: string. Returns: a list of a record containing type, variable, digits.

### src/mz-commands.js:35

@function mz-commands.validate.44 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: integer; error.

### src/mz-commands.js:35

@function mz-commands.lower.45 — Returns a list of a record containing type, choice, indent. Inputs: c. Returns: a list of a record containing type, choice, indent.

### src/mz-commands.js:36

@function mz-commands.validate.46 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: error.

### src/mz-commands.js:36

@function mz-commands.lower.47 — Returns a list of a record containing type, indent. Inputs: c. Returns: a list of a record containing type, indent.

### src/mz-commands.js:37

@function mz-commands.validate.48 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: error.

### src/mz-commands.js:37

@function mz-commands.lower.49 — Returns a list of a record containing type, indent. Inputs: c. Returns: a list of a record containing type, indent.

### src/mz-commands.js:38

@function mz-commands.validate.50 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: array is array; c lines some; error.

### src/mz-commands.js:38

@function mz-commands.callback.51 — Returns typeof x does not equal "string". Inputs: x. Returns: typeof x does not equal "string".

### src/mz-commands.js:38

@function mz-commands.lower.52 — Returns a list of . Inputs: no explicit arguments; uses enclosing module state. Returns: a list of .

### src/mz-commands.js:39

@function mz-commands.validate.53 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: branch.

### src/mz-commands.js:39

@function mz-commands.lower.54 — Returns a list of a record containing type, condition. Inputs: c. Uses: branch. Returns: a list of a record containing type, condition.

### src/mz-commands.js:40

@function mz-commands.validate.55 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: no explicit arguments; uses enclosing module state.

### src/mz-commands.js:40

@function mz-commands.lower.56 — Returns a list of a record containing type. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of a record containing type.

### src/mz-commands.js:40

@function mz-commands.validate.57 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: no explicit arguments; uses enclosing module state.

### src/mz-commands.js:40

@function mz-commands.lower.58 — Returns a list of a record containing type. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of a record containing type.

### src/mz-commands.js:40

@function mz-commands.validate.59 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: no explicit arguments; uses enclosing module state.

### src/mz-commands.js:40

@function mz-commands.lower.60 — Returns a list of . Inputs: no explicit arguments; uses enclosing module state. Returns: a list of .

### src/mz-commands.js:41

@function mz-commands.validate.61 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: range; integer; error.

### src/mz-commands.js:41

@function mz-commands.lower.62 — Returns array from using a record containing length, a callback. Inputs: c. Uses: array from. Returns: array from using a record containing length, a callback.

### src/mz-commands.js:41

@function mz-commands.callback.63 — Returns a record containing type, key, value. Inputs: ; i. Uses: string. Returns: a record containing type, key, value.

### src/mz-commands.js:42

@function mz-commands.validate.64 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: range; integer; error; number is finite.

### src/mz-commands.js:42

@function mz-commands.lower.65 — Handles lower within mz commands. Inputs: c. Uses: error; structured clone. Returns: a list of a record containing type, parameters.

### src/mz-commands.js:43

@function mz-commands.validate.66 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: a list of "A", "B", "C", "D" includes; integer; error.

### src/mz-commands.js:43

@function mz-commands.lower.67 — Returns a list of a record containing type, key, value. Inputs: c. Returns: a list of a record containing type, key, value.

### src/mz-commands.js:44

@function mz-commands.validate.68 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: integer; error.

### src/mz-commands.js:44

@function mz-commands.lower.69 — Returns a list of a record containing type, seconds. Inputs: c. Returns: a list of a record containing type, seconds.

### src/mz-commands.js:45

@function mz-commands.validate.70 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: integer; error; root frontier mzroutes validate.

### src/mz-commands.js:45

@function mz-commands.lower.71 — Handles lower within mz commands. Inputs: c. Uses: root frontier mzroutes validate; route list find; error. Returns: a list of a record containing type, target, route.

### src/mz-commands.js:45

@function mz-commands.callback.72 — Returns the inverse of root frontier mzroutes supported using x code. Inputs: x. Uses: root frontier mzroutes supported. Returns: the inverse of root frontier mzroutes supported using x code.

### src/mz-commands.js:46

@function mz-commands.validate.73 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: integer; error.

### src/mz-commands.js:46

@function mz-commands.lower.74 — Returns a list of a record containing type, start, seconds. Inputs: c. Returns: a list of a record containing type, start, seconds.

### src/mz-commands.js:47

@function mz-commands.validate.75 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: error.

### src/mz-commands.js:47

@function mz-commands.lower.76 — Returns a list of a record containing type. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of a record containing type.

### src/mz-commands.js:48

@function mz-commands.validate.77 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: integer; error.

### src/mz-commands.js:48

@function mz-commands.lower.78 — Handles lower within mz commands. Inputs: c. Uses: error; string. Returns: a list of a record containing type, id, add.

### src/mz-commands.js:49

@function mz-commands.validate.79 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: error.

### src/mz-commands.js:49

@function mz-commands.lower.80 — Returns a list of a record containing type, indent. Inputs: c. Returns: a list of a record containing type, indent.

### src/mz-commands.js:50

@function mz-commands.validate.81 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: error.

### src/mz-commands.js:50

@function mz-commands.lower.82 — Returns a list of a record containing type, name, indent. Inputs: c. Returns: a list of a record containing type, name, indent.

### src/mz-commands.js:51

@function mz-commands.validateStructure.83 — Handles validate structure within mz commands. Inputs: commands. Updates: b cancel; stack at using - 1 else. Uses: choice stack push; choice stack at; number is integer; b seen has.

### src/mz-commands.js:52

@function mz-commands.serialize.84 — Handles serialize within mz commands. Inputs: command. Uses: error; validate; structured clone; records push. Returns: records.

### src/mz-commands.js:53

@function mz-commands.deserialize.85 — Handles deserialize within mz commands. Inputs: records. Updates: previous lines. Uses: a list of 401, 405, 408, 655 includes; commands at; error; assignment push. Returns: commands map using validate.

### src/mz-commands.js:54

@function mz-commands.get.86 — Returns handlers get using code. Inputs: code. Uses: handlers get. Returns: handlers get using code.

### src/mz-commands.js:54

@function mz-commands.metadata.87 — Returns catalogue get using code. Inputs: code. Uses: catalogue get. Returns: catalogue get using code.

### src/mz-dialogs.js:3

@function mz-dialogs.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier mzdialogs. Uses: register.

### src/mz-dialogs.js:4

@function mz-dialogs.register.2 — Handles register within mz dialogs. Inputs: code; builder. Uses: builders has; error; builders set.

### src/mz-dialogs.js:5

@function mz-dialogs.select.3 — Handles select within mz dialogs. Inputs: id; items; value. Updates: s id; s value. Uses: document create element; s append; string. Returns: s.

### src/mz-dialogs.js:6

@function mz-dialogs.number.4 — Handles number within mz dialogs. Inputs: id; value; assignment pattern; assignment pattern. Uses: document create element; object assign. Returns: e.

### src/mz-dialogs.js:7

@function mz-dialogs.field.5 — Handles field within mz dialogs. Inputs: parent; label; control. Updates: e text content. Uses: document create element; e append; parent append. Returns: control.

### src/mz-dialogs.js:8

@function mz-dialogs.group.6 — Handles group within mz dialogs. Inputs: parent; title. Updates: l text content. Uses: document create element; e append; parent append. Returns: e.

### src/mz-dialogs.js:9

@function mz-dialogs.textarea.7 — Handles textarea within mz dialogs. Inputs: value. Updates: e value; e rows. Uses: document create element. Returns: e.

### src/mz-dialogs.js:10

@function mz-dialogs.open.8 — Handles open within mz dialogs. Inputs: code; initial; on apply; assignment pattern. Updates: d class name; title text content; status class name; ok text content; cancel text content. Uses: builders get; error; document create element; d set attribute.

### src/mz-dialogs.js:10

@function mz-dialogs.onclick.9 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using .

### src/mz-dialogs.js:10

@function mz-dialogs.onclick.10 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: status text content. Uses: root frontier mzcommands validate; reader; on apply; d close.

### src/mz-dialogs.js:10

@function mz-dialogs.callback.11 — Provides the callback for d add event listener. Inputs: no explicit arguments; uses enclosing module state. Uses: reader dispose; d remove.

### src/mz-dialogs.js:11

@function mz-dialogs.callback.12 — Provides the callback for register. Inputs: body; c. Updates: upper class name; empty class name; empty text content; info text content. Uses: document create element; body append; group; face append. Returns: a callback.

### src/mz-dialogs.js:11

@function mz-dialogs.callback.13 — Returns a record containing parameters, lines. Inputs: no explicit arguments; uses enclosing module state. Uses: text value split. Returns: a record containing parameters, lines.

### src/mz-dialogs.js:12

@function mz-dialogs.callback.14 — Provides the callback for register. Inputs: body; c. Uses: field; textarea; chain or a list of join. Returns: a callback.

### src/mz-dialogs.js:12

@function mz-dialogs.callback.15 — Returns a record containing parameters, lines. Inputs: no explicit arguments; uses enclosing module state. Uses: text value split. Returns: a record containing parameters, lines.

### src/mz-dialogs.js:13

@function mz-dialogs.callback.16 — Provides the callback for register. Inputs: body; c. Uses: group; field; number; select. Returns: a callback.

### src/mz-dialogs.js:13

@function mz-dialogs.callback.17 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:14

@function mz-dialogs.callback.18 — Provides the callback for register. Inputs: body; c. Updates: type onchange; pending text content. Uses: group; field; number; select. Returns: a callback.

### src/mz-dialogs.js:14

@function mz-dialogs.rebuild.19 — Handles rebuild within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: controls text content; read. Uses: controls replace children; field; number. Returns: without a result.

### src/mz-dialogs.js:14

@function mz-dialogs.read.20 — Returns p slice using 3. Inputs: no explicit arguments; uses enclosing module state. Uses: p slice. Returns: p slice using 3.

### src/mz-dialogs.js:14

@function mz-dialogs.read.21 — Returns a list of 0, + n value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 0, + n value.

### src/mz-dialogs.js:14

@function mz-dialogs.read.22 — Returns a list of 1, + n value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 1, + n value.

### src/mz-dialogs.js:14

@function mz-dialogs.read.23 — Returns a list of 2, + a value, + b value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 2, + a value, + b value.

### src/mz-dialogs.js:14

@function mz-dialogs.callback.24 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Uses: read. Returns: a record containing parameters.

### src/mz-dialogs.js:15

@function mz-dialogs.callback.25 — Provides the callback for register. Inputs: body; c. Uses: field; select; a list of "A", "B", "C", "D" map. Returns: a callback.

### src/mz-dialogs.js:15

@function mz-dialogs.callback.26 — Returns a list of x, x. Inputs: x. Returns: a list of x, x.

### src/mz-dialogs.js:15

@function mz-dialogs.callback.27 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:16

@function mz-dialogs.callback.28 — Provides the callback for register. Inputs: body; c. Updates: layout class name; name size; status role; b type; b text content. Uses: root phanicom audio manifest or a list of map; names map; names includes; choices push. Returns: read.

### src/mz-dialogs.js:17

@function mz-dialogs.callback.29 — Returns a name. Inputs: a. Returns: a name.

### src/mz-dialogs.js:17

@function mz-dialogs.callback.30 — Returns a list of n, n. Inputs: n. Returns: a list of n, n.

### src/mz-dialogs.js:19

@function mz-dialogs.parameter.31 — Handles parameter within mz dialogs. Inputs: title; value; min; max. Updates: slider type; slider oninput; input oninput. Uses: group; number; slider set attribute; g append. Returns: input.

### src/mz-dialogs.js:19

@function mz-dialogs.oninput.32 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: input value. Returns: assignment.

### src/mz-dialogs.js:19

@function mz-dialogs.oninput.33 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: slider value. Returns: assignment.

### src/mz-dialogs.js:20

@function mz-dialogs.read.34 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:20

@function mz-dialogs.callback.35 — Returns root phanicom se preview event using read using parameters at 0, a callback catch using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: root phanicom se preview event using read using parameters at 0, a callback catch; root phanicom se preview event; read. Returns: root phanicom se preview event using read using parameters at 0, a callback catch using a callback.

### src/mz-dialogs.js:20

@function mz-dialogs.callback.36 — Returns assignment. Inputs: text. Updates: status text content. Returns: assignment.

### src/mz-dialogs.js:20

@function mz-dialogs.callback.37 — Returns assignment. Inputs: e. Updates: status text content. Returns: assignment.

### src/mz-dialogs.js:20

@function mz-dialogs.callback.38 — Returns root phanicom se stop preview using . Inputs: no explicit arguments; uses enclosing module state. Uses: root phanicom se stop preview. Returns: root phanicom se stop preview using .

### src/mz-dialogs.js:20

@function mz-dialogs.dispose.39 — Returns root phanicom se stop preview using . Inputs: no explicit arguments; uses enclosing module state. Uses: root phanicom se stop preview. Returns: root phanicom se stop preview using .

### src/mz-dialogs.js:22

@function mz-dialogs.callback.40 — Provides the callback for register. Inputs: body; c. Updates: layout class name; preview id; preview width; preview height; ctx fill style. Uses: group; document create element; colors append; layout append. Returns: a callback.

### src/mz-dialogs.js:24

@function mz-dialogs.callback.41 — Provides the callback for a list of "Red", "Green", "Blue", "Gray" map. Inputs: name; i. Updates: row class name; slider type. Uses: document create element; settings append; number; slider set attribute. Returns: field using row, name, number using "mzTone" plus name, p at 0 at i, i equals 3 selects 0 or - 255.

### src/mz-dialogs.js:27

@function mz-dialogs.repaint.42 — Handles repaint within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: i; image data at i plus k. Uses: channels map; ctx put image data.

### src/mz-dialogs.js:27

@function mz-dialogs.callback.43 — Returns + e value. Inputs: e. Returns: + e value.

### src/mz-dialogs.js:28

@function mz-dialogs.callback.44 — Provides the callback for channels for each. Inputs: input; i. Updates: input oninput; sliders at i oninput.

### src/mz-dialogs.js:28

@function mz-dialogs.oninput.45 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: sliders at i value. Uses: repaint.

### src/mz-dialogs.js:28

@function mz-dialogs.oninput.46 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: input value. Uses: repaint.

### src/mz-dialogs.js:28

@function mz-dialogs.onclick.47 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: channels for each; repaint.

### src/mz-dialogs.js:28

@function mz-dialogs.callback.48 — Provides the callback for channels for each. Inputs: e; i. Updates: e value; sliders at i value.

### src/mz-dialogs.js:29

@function mz-dialogs.callback.49 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Uses: channels map. Returns: a record containing parameters.

### src/mz-dialogs.js:29

@function mz-dialogs.callback.50 — Returns + e value. Inputs: e. Returns: + e value.

### src/mz-dialogs.js:31

@function mz-dialogs.callback.51 — Provides the callback for register. Inputs: body; c. Updates: wait type; wait id; wait checked. Uses: group; field; number; document create element. Returns: a callback.

### src/mz-dialogs.js:31

@function mz-dialogs.callback.52 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:32

@function mz-dialogs.callback.53 — Provides the callback for register. Inputs: body; c. Updates: preview style height; wait type; wait checked; wait id. Uses: group; a list of "Red", "Green", "Blue", "Intensity" map; document create element; preview set attribute. Returns: a callback.

### src/mz-dialogs.js:32

@function mz-dialogs.callback.54 — Returns field using colors, name, number using "mzFlash" plus name, p at 0 at i, 0. Inputs: name; i. Uses: field; number. Returns: field using colors, name, number using "mzFlash" plus name, p at 0 at i, 0.

### src/mz-dialogs.js:32

@function mz-dialogs.repaint.55 — Handles repaint within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: preview style background. Uses: channels slice using 0, 3 map using a callback join; channels slice using 0, 3 map; channels slice.

### src/mz-dialogs.js:32

@function mz-dialogs.callback.56 — Returns + e value. Inputs: e. Returns: + e value.

### src/mz-dialogs.js:32

@function mz-dialogs.callback.57 — Returns assignment. Inputs: e. Updates: e oninput. Returns: assignment.

### src/mz-dialogs.js:32

@function mz-dialogs.callback.58 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Uses: channels map. Returns: a record containing parameters.

### src/mz-dialogs.js:32

@function mz-dialogs.callback.59 — Returns + e value. Inputs: e. Returns: + e value.

### src/mz-dialogs.js:33

@function mz-dialogs.callback.60 — Provides the callback for register. Inputs: body; c. Uses: field; number. Returns: a callback.

### src/mz-dialogs.js:33

@function mz-dialogs.callback.61 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:34

@function mz-dialogs.callback.62 — Provides the callback for register. Inputs: body; c. Updates: type onchange; advanced type; advanced text content; advanced id; native condition type. Uses: field; select; document create element; body append. Returns: a callback.

### src/mz-dialogs.js:34

@function mz-dialogs.rebuild.63 — Handles rebuild within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: read. Uses: controls replace children; field; number; select.

### src/mz-dialogs.js:34

@function mz-dialogs.read.64 — Returns a list of 0, + id value, + op value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 0, + id value, + op value.

### src/mz-dialogs.js:34

@function mz-dialogs.read.65 — Returns a list of 1, + id value, + operand value, + n value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 1, + id value, + operand value, + n value.

### src/mz-dialogs.js:34

@function mz-dialogs.callback.66 — Returns a list of x, x. Inputs: x. Returns: a list of x, x.

### src/mz-dialogs.js:34

@function mz-dialogs.read.67 — Returns a list of 2, id value, + op value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 2, id value, + op value.

### src/mz-dialogs.js:34

@function mz-dialogs.read.68 — Returns a list of 3, + seconds value, + comparison value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 3, + seconds value, + comparison value.

### src/mz-dialogs.js:34

@function mz-dialogs.read.69 — Returns a list of 7, + amount value, + op value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 7, + amount value, + op value.

### src/mz-dialogs.js:34

@function mz-dialogs.read.70 — Returns t equals 4 selects a list of 4, + id value, 0 or a list of 8, + id value. Inputs: no explicit arguments; uses enclosing module state. Returns: t equals 4 selects a list of 4, + id value, 0 or a list of 8, + id value.

### src/mz-dialogs.js:34

@function mz-dialogs.onclick.71 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: expression. Uses: sync expression.

### src/mz-dialogs.js:34

@function mz-dialogs.syncExpression.72 — Handles sync expression within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: native condition disabled; type disabled; notice text content. Uses: controls query selector all using "input,select" for each; controls query selector all.

### src/mz-dialogs.js:34

@function mz-dialogs.callback.73 — Returns assignment. Inputs: e. Updates: e disabled. Returns: assignment.

### src/mz-dialogs.js:34

@function mz-dialogs.onclick.74 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: baseline; notice text content. Uses: root frontier mzcommands lower; read; root frontier condition editor open. Returns: without a result.

### src/mz-dialogs.js:34

@function mz-dialogs.callback.75 — Provides the callback for root frontier condition editor open. Inputs: value. Updates: expression. Uses: sync expression.

### src/mz-dialogs.js:34

@function mz-dialogs.callback.76 — Returns a record containing parameters, expression, createElse. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone; read. Returns: a record containing parameters, expression, createElse.

### src/mz-dialogs.js:35

@function mz-dialogs.callback.77 — Provides the callback for register. Inputs: body; c. Updates: initialize type; initialize id; initialize checked; info text content. Uses: field; number; select; document create element. Returns: a callback.

### src/mz-dialogs.js:35

@function mz-dialogs.callback.78 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:36

@function mz-dialogs.callback.79 — Provides the callback for register. Inputs: body; c. Updates: operation onchange. Uses: field; select; group; number. Returns: a callback.

### src/mz-dialogs.js:36

@function mz-dialogs.refresh.80 — Handles refresh within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: minutes disabled; seconds disabled.

### src/mz-dialogs.js:36

@function mz-dialogs.callback.81 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:37

@function mz-dialogs.callback.82 — Provides the callback for register. Inputs: body; c. Updates: input id; input value; input max length. Uses: document create element; field. Returns: a callback.

### src/mz-dialogs.js:37

@function mz-dialogs.callback.83 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:38

@function mz-dialogs.callback.84 — Provides the callback for register. Inputs: body; c. Updates: edit type; edit id; edit text content; target onchange; edit onclick. Uses: frontier mzroutes defaults; field; select; number. Returns: a callback.

### src/mz-dialogs.js:38

@function mz-dialogs.refresh.85 — Handles refresh within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: id disabled; summary text content.

### src/mz-dialogs.js:38

@function mz-dialogs.onclick.86 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier mzroute dialog open. Returns: frontier mzroute dialog open using route, a callback, a record containing forced.

### src/mz-dialogs.js:38

@function mz-dialogs.callback.87 — Provides the callback for frontier mzroute dialog open. Inputs: value. Updates: route. Uses: refresh.

### src/mz-dialogs.js:38

@function mz-dialogs.callback.88 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:39

@function mz-dialogs.callback.89 — Provides the callback for register. Inputs: body; c. Updates: input id; input value; input max length. Uses: group; document create element; inputs push; field. Returns: a callback.

### src/mz-dialogs.js:39

@function mz-dialogs.callback.90 — Returns a list of i, "Choice " plus i plus 1. Inputs: ; i. Returns: a list of i, "Choice " plus i plus 1.

### src/mz-dialogs.js:39

@function mz-dialogs.callback.91 — Returns a list of i, "Choice " plus i plus 1. Inputs: ; i. Returns: a list of i, "Choice " plus i plus 1.

### src/mz-dialogs.js:39

@function mz-dialogs.callback.92 — Provides the callback for the enclosing mz dialogs operation. Inputs: no explicit arguments; uses enclosing module state. Uses: inputs map; labels at; labels pop; labels some. Returns: a record containing parameters.

### src/mz-dialogs.js:39

@function mz-dialogs.callback.93 — Returns i value. Inputs: i. Returns: i value.

### src/mz-dialogs.js:39

@function mz-dialogs.callback.94 — Returns the inverse of s. Inputs: s. Returns: the inverse of s.

### src/mz-dialogs.js:40

@function mz-dialogs.callback.95 — Provides the callback for register. Inputs: body; c. Uses: field; number. Returns: a callback.

### src/mz-dialogs.js:40

@function mz-dialogs.callback.96 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:41

@function mz-dialogs.callback.97 — Provides the callback for register. Inputs: body; c. Updates: operand onchange. Uses: field; number; group; select. Returns: a callback.

### src/mz-dialogs.js:41

@function mz-dialogs.onchange.98 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: value min; value max; value parent element first child text content.

### src/mz-dialogs.js:41

@function mz-dialogs.callback.99 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:42

@function mz-dialogs.callback.100 — Provides the callback for register. Inputs: body; c. Updates: operand onchange. Uses: field; group; select; number. Returns: a callback.

### src/mz-dialogs.js:42

@function mz-dialogs.onchange.101 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: value min; value max; value parent element first child text content.

### src/mz-dialogs.js:42

@function mz-dialogs.callback.102 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:44

@function mz-dialogs.callback.103 — Provides the callback for register. Inputs: body; c; context. Updates: designation onchange; notice text content. Uses: field; select; group; rebuild. Returns: a callback.

### src/mz-dialogs.js:45

@function mz-dialogs.rebuild.104 — Handles rebuild within mz dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: x step; y step; read. Uses: destination replace children; destination append; object assign; document create element.

### src/mz-dialogs.js:45

@function mz-dialogs.callback.105 — Returns a list of m mz id, string using m mz id pad start using 3, "0" plus ": " plus m name. Inputs: m. Uses: string using m mz id pad start; string. Returns: a list of m mz id, string using m mz id pad start using 3, "0" plus ": " plus m name.

### src/mz-dialogs.js:45

@function mz-dialogs.callback.106 — Returns id equals p at 1. Inputs: array pattern. Returns: id equals p at 1.

### src/mz-dialogs.js:45

@function mz-dialogs.read.107 — Returns a list of 0, + map value, + x value, + y value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 0, + map value, + x value, + y value.

### src/mz-dialogs.js:45

@function mz-dialogs.read.108 — Returns a list of 1, + map value, + x value, + y value. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 1, + map value, + x value, + y value.

### src/mz-dialogs.js:46

@function mz-dialogs.callback.109 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Uses: read. Returns: a record containing parameters.

### src/mz-dialogs.js:47

@function mz-dialogs.callback.110 — Provides the callback for register. Inputs: body; c. Uses: field; select. Returns: a callback.

### src/mz-dialogs.js:47

@function mz-dialogs.callback.111 — Returns a record containing parameters. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing parameters.

### src/mz-dialogs.js:48

@function mz-dialogs.has.112 — Returns builders has using code. Inputs: code. Uses: builders has. Returns: builders has using code.

### src/mz-editor.js:5

@function mz-editor.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier mzeditor.

### src/mz-editor.js:6

@function mz-editor.clone.2 — Returns structured clone using v. Inputs: v. Uses: structured clone. Returns: structured clone using v.

### src/mz-editor.js:6

@function mz-editor.el.3 — Handles el within mz editor. Inputs: tag; text. Updates: e text content. Uses: document create element. Returns: e.

### src/mz-editor.js:7

@function mz-editor.button.4 — Handles button within mz editor. Inputs: text; fn. Updates: b type; b onclick. Uses: el. Returns: b.

### src/mz-editor.js:9

@function mz-editor.blankPage.5 — Returns a record containing name, graphic, trigger, solid, movement, priority, through, condition. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event schema page defaults. Returns: a record containing name, graphic, trigger, solid, movement, priority, through, condition.

### src/mz-editor.js:10

@function mz-editor.groupRange.6 — Returns frontier mzcommand editing group range using spread element. Inputs: rest element. Uses: frontier mzcommand editing group range. Returns: frontier mzcommand editing group range using spread element.

### src/mz-editor.js:11

@function mz-editor.create.7 — Builds a new instance and its public operations from the supplied configuration. Inputs: object pattern. Updates: d id; d class name; d inner html; row class name; enabled type. Uses: el; d set attribute; document body append; d query selector using ".mzImageMovement fieldset" append. Returns: a record containing begin, open, duplicate, pageIndex, isOpen.

### src/mz-editor.js:15

@function mz-editor.callback.8 — Returns frontier model editor open using draft, api world using events, a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model editor open; api world. Returns: frontier model editor open using draft, api world using events, a callback.

### src/mz-editor.js:15

@function mz-editor.callback.9 — Returns edit using a callback. Inputs: checked. Uses: edit. Returns: edit using a callback.

### src/mz-editor.js:15

@function mz-editor.callback.10 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: draft spatial. Returns: assignment.

### src/mz-editor.js:15

@function mz-editor.$.11 — Returns d query selector using "#" plus id. Inputs: id. Uses: d query selector. Returns: d query selector using "#" plus id.

### src/mz-editor.js:15

@function mz-editor.field.12 — Handles field within mz editor. Inputs: parent; text; input. Uses: el; label append; parent append. Returns: input.

### src/mz-editor.js:16

@function mz-editor.callback.13 — Returns $ using "mzMoveSpeed" append using a new option. Inputs: name; i. Uses: $ using "mzMoveSpeed" append; $. Returns: $ using "mzMoveSpeed" append using a new option.

### src/mz-editor.js:16

@function mz-editor.callback.14 — Returns $ using "mzMoveFrequency" append using a new option. Inputs: name; i. Uses: $ using "mzMoveFrequency" append; $. Returns: $ using "mzMoveFrequency" append using a new option.

### src/mz-editor.js:17

@function mz-editor.onchange.15 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: input disabled; value disabled.

### src/mz-editor.js:19

@function mz-editor.callback.16 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: placement height offset value; placement movement mode value.

### src/mz-editor.js:20

@function mz-editor.callback.17 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: collect; status; frontier template dialogs save. Returns: without a result.

### src/mz-editor.js:20

@function mz-editor.callback.18 — Returns status using "Saved reusable definition: " plus entry name plus ". Event draft has not been Applied.". Inputs: entry. Uses: status. Returns: status using "Saved reusable definition: " plus entry name plus ". Event draft has not been Applied.".

### src/mz-editor.js:20

@function mz-editor.callback.19 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: status; api at method.

### src/mz-editor.js:20

@function mz-editor.callback.20 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: collect; frontier template dialogs replace; api world; api templates.

### src/mz-editor.js:20

@function mz-editor.callback.21 — Returns edit using a callback. Inputs: command. Uses: edit. Returns: edit using a callback.

### src/mz-editor.js:20

@function mz-editor.callback.22 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: command indent. Uses: draft pages at page index commands splice.

### src/mz-editor.js:21

@function mz-editor.callback.23 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: collect; frontier gameplay dialogs open.

### src/mz-editor.js:21

@function mz-editor.callback.24 — Returns edit using a callback. Inputs: command. Uses: edit. Returns: edit using a callback.

### src/mz-editor.js:21

@function mz-editor.callback.25 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: command indent. Uses: draft pages at page index commands splice.

### src/mz-editor.js:23

@function mz-editor.callback.26 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: collect; frontier event schema extra page conditions; frontier condition editor open; extras map.

### src/mz-editor.js:23

@function mz-editor.callback.27 — Returns edit using a callback. Inputs: expression. Uses: edit. Returns: edit using a callback.

### src/mz-editor.js:23

@function mz-editor.callback.28 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: p condition; p conditions. Uses: object entries using settings using p condition slots filter using a callback map; object entries using settings using p condition slots filter; object entries; settings.

### src/mz-editor.js:23

@function mz-editor.callback.29 — Returns slot enabled. Inputs: array pattern. Returns: slot enabled.

### src/mz-editor.js:23

@function mz-editor.callback.30 — Returns a record containing type, key, copied fields. Inputs: array pattern. Uses: key starts with. Returns: a record containing type, key, copied fields.

### src/mz-editor.js:25

@function mz-editor.status.31 — Returns assignment. Inputs: text. Updates: $ using "mzEventStatus" text content. Uses: $. Returns: assignment.

### src/mz-editor.js:26

@function mz-editor.settings.32 — Handles settings within mz editor. Inputs: p. Updates: p mz; p mz condition slots at key; p mz image profile. Uses: frontier event schema page defaults. Returns: p mz.

### src/mz-editor.js:27

@function mz-editor.onchange.33 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "mzMoveRoute" disabled. Uses: $.

### src/mz-editor.js:27

@function mz-editor.onclick.34 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: collect; frontier mzroute dialog open; settings.

### src/mz-editor.js:27

@function mz-editor.callback.35 — Returns edit using a callback. Inputs: value. Uses: edit. Returns: edit using a callback.

### src/mz-editor.js:27

@function mz-editor.callback.36 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: settings using draft pages at page index move route. Uses: settings. Returns: assignment.

### src/mz-editor.js:28

@function mz-editor.callback.37 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: collect; frontier behavior dialog open.

### src/mz-editor.js:28

@function mz-editor.callback.38 — Returns edit using a callback. Inputs: value. Uses: edit. Returns: edit using a callback.

### src/mz-editor.js:28

@function mz-editor.callback.39 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: draft pages at page index behavior.

### src/mz-editor.js:28

@function mz-editor.callback.40 — Returns edit using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: edit. Returns: edit using a callback.

### src/mz-editor.js:28

@function mz-editor.callback.41 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state.

### src/mz-editor.js:29

@function mz-editor.collect.42 — Handles collect within mz editor. Inputs: no explicit arguments; uses enclosing module state. Updates: draft name; draft note; draft at key; draft movement mode; draft display name. Uses: $; string; settings; frontier event schema extra page conditions. Returns: without a result.

### src/mz-editor.js:30

@function mz-editor.edit.43 — Handles edit within mz editor. Inputs: action. Updates: draft; draft redo. Uses: collect; clone; action; frontier events validate.

### src/mz-editor.js:31

@function mz-editor.commandName.44 — Handles command name within mz editor. Inputs: c. Uses: frontier gameplay dialogs summary; frontier mzcommands metadata; c parameters at 0 join; c lines or a list of join. Returns: frontier gameplay dialogs summary using c; "".

### src/mz-editor.js:32

@function mz-editor.refresh.45 — Handles refresh within mz editor. Inputs: no explicit arguments; uses enclosing module state. Updates: behavior summary text content; budget notice text content; extra notice text content; extra notice hidden; $ using "mzEventTitle" text content. Uses: settings; frontier events diagnostics; frontier event schema extra page conditions; $. Returns: without a result.

### src/mz-editor.js:32

@function mz-editor.callback.46 — Provides the callback for draft pages map. Inputs: p; i. Uses: button; string; b set attribute. Returns: b.

### src/mz-editor.js:32

@function mz-editor.callback.47 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: page index. Uses: collect; selection clear; refresh.

### src/mz-editor.js:33

@function mz-editor.drawCommands.48 — Handles draw commands within mz editor. Inputs: no explicit arguments; uses enclosing module state. Updates: row class name; row dataset index; row style padding left; row text content; row onclick. Uses: $; list replace children; el; row set attribute.

### src/mz-editor.js:33

@function mz-editor.onclick.49 — Responds to a button or clickable control. Inputs: event. Updates: selection; anchor. Uses: array from; selection has; selection delete; selection add.

### src/mz-editor.js:33

@function mz-editor.callback.50 — Returns math min using i, anchor plus n. Inputs: ; n. Returns: math min using i, anchor plus n.

### src/mz-editor.js:33

@function mz-editor.ondblclick.51 — Handles ondblclick within mz editor. Inputs: no explicit arguments; uses enclosing module state. Updates: selection; anchor. Uses: edit command; chooser.

### src/mz-editor.js:33

@function mz-editor.oncontextmenu.52 — Handles oncontextmenu within mz editor. Inputs: event. Updates: selection. Uses: event prevent default; selection has; draw commands; context menu.

### src/mz-editor.js:34

@function mz-editor.range.53 — Handles range within mz editor. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element filter; group range. Returns: indices length selects group range using commands, math min using spread element, math max using spread element or a list of commands length, commands length minus 1.

### src/mz-editor.js:34

@function mz-editor.callback.54 — Returns i is less than commands length. Inputs: i. Returns: i is less than commands length.

### src/mz-editor.js:35

@function mz-editor.copy.55 — Handles copy within mz editor. Inputs: assignment pattern. Updates: command clipboard. Uses: range; clone; draft pages at page index commands slice; edit.

### src/mz-editor.js:35

@function mz-editor.callback.56 — Returns draft pages at page index commands splice using a, b minus a plus 1. Inputs: no explicit arguments; uses enclosing module state. Uses: draft pages at page index commands splice. Returns: draft pages at page index commands splice using a, b minus a plus 1.

### src/mz-editor.js:36

@function mz-editor.paste.57 — Handles paste within mz editor. Inputs: no explicit arguments; uses enclosing module state. Uses: edit. Returns: without a result.

### src/mz-editor.js:36

@function mz-editor.callback.58 — Returns draft pages at page index commands splice using index, 0, spread element. Inputs: no explicit arguments; uses enclosing module state. Uses: draft pages at page index commands splice; frontier mzcommand editing rebase. Returns: draft pages at page index commands splice using index, 0, spread element.

### src/mz-editor.js:37

@function mz-editor.remove.59 — Handles remove within mz editor. Inputs: no explicit arguments; uses enclosing module state. Uses: range; edit.

### src/mz-editor.js:37

@function mz-editor.callback.60 — Returns draft pages at page index commands splice using a, b minus a plus 1. Inputs: no explicit arguments; uses enclosing module state. Uses: draft pages at page index commands splice. Returns: draft pages at page index commands splice using a, b minus a plus 1.

### src/mz-editor.js:38

@function mz-editor.editCommand.61 — Handles edit command within mz editor. Inputs: no explicit arguments; uses enclosing module state. Updates: initial create else. Uses: frontier gameplay dialogs open; frontier template dialogs replace; api world; api templates. Returns: without a result; without a result.

### src/mz-editor.js:38

@function mz-editor.callback.62 — Returns edit using a callback. Inputs: command. Uses: edit. Returns: edit using a callback.

### src/mz-editor.js:38

@function mz-editor.callback.63 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: draft pages at page index commands at index. Returns: assignment.

### src/mz-editor.js:38

@function mz-editor.callback.64 — Returns edit using a callback. Inputs: command. Uses: edit. Returns: edit using a callback.

### src/mz-editor.js:38

@function mz-editor.callback.65 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: draft pages at page index commands at index. Returns: assignment.

### src/mz-editor.js:38

@function mz-editor.callback.66 — Returns edit using a callback. Inputs: value. Uses: edit. Returns: edit using a callback.

### src/mz-editor.js:38

@function mz-editor.callback.67 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: draft pages at page index commands at index. Uses: frontier mzcommand editing replace branch; frontier mzcommand editing replace choices.

### src/mz-editor.js:39

@function mz-editor.contextMenu.68 — Handles context menu within mz editor. Inputs: x; y. Updates: menu id; menu class name; menu style left; menu style top. Uses: document query selector using "#mzCommandContext" remove; document query selector; el; menu set attribute.

### src/mz-editor.js:39

@function mz-editor.callback.69 — Returns chooser using math min using spread element. Inputs: no explicit arguments; uses enclosing module state. Uses: chooser. Returns: chooser using math min using spread element.

### src/mz-editor.js:39

@function mz-editor.callback.70 — Returns copy using true. Inputs: no explicit arguments; uses enclosing module state. Uses: copy. Returns: copy using true.

### src/mz-editor.js:39

@function mz-editor.callback.71 — Returns copy using . Inputs: no explicit arguments; uses enclosing module state. Uses: copy. Returns: copy using .

### src/mz-editor.js:39

@function mz-editor.callback.72 — Provides the callback for the enclosing mz editor operation. Inputs: no explicit arguments; uses enclosing module state. Updates: selection. Uses: draft pages at page index commands map; draw commands.

### src/mz-editor.js:39

@function mz-editor.callback.73 — Returns i. Inputs: ; i. Returns: i.

### src/mz-editor.js:39

@function mz-editor.callback.74 — Returns chain. Inputs: no explicit arguments; uses enclosing module state. Uses: navigator clipboard write text using a list of spread element map using a callback join using "\n" catch; navigator clipboard write text; a list of spread element map using a callback join; a list of spread element map. Returns: chain.

### src/mz-editor.js:39

@function mz-editor.callback.75 — Returns command name using draft pages at page index commands at i or a record containing . Inputs: i. Uses: command name. Returns: command name using draft pages at page index commands at i or a record containing .

### src/mz-editor.js:39

@function mz-editor.callback.76 — Returns status using "Clipboard is unavailable.". Inputs: no explicit arguments; uses enclosing module state. Uses: status. Returns: status using "Clipboard is unavailable.".

### src/mz-editor.js:39

@function mz-editor.callback.77 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: menu remove; fn.

### src/mz-editor.js:39

@function mz-editor.close.78 — Handles close within mz editor. Inputs: event. Uses: menu contains; menu remove; document remove event listener.

### src/mz-editor.js:39

@function mz-editor.callback.79 — Returns document add event listener using "pointerdown", close. Inputs: no explicit arguments; uses enclosing module state. Uses: document add event listener. Returns: document add event listener using "pointerdown", close.

### src/mz-editor.js:40

@function mz-editor.chooser.80 — Handles chooser within mz editor. Inputs: index. Updates: modal class name; columns class name. Uses: collect; el; modal set attribute; modal append.

### src/mz-editor.js:40

@function mz-editor.callback.81 — Returns show using i. Inputs: no explicit arguments; uses enclosing module state. Uses: show. Returns: show using i.

### src/mz-editor.js:40

@function mz-editor.callback.82 — Returns modal close using . Inputs: no explicit arguments; uses enclosing module state. Uses: modal close. Returns: modal close using .

### src/mz-editor.js:40

@function mz-editor.show.83 — Handles show within mz editor. Inputs: tab. Updates: b disabled; b title. Uses: columns replace children; el; frontier mzcatalog filter; section append.

### src/mz-editor.js:40

@function mz-editor.callback.84 — Returns g tab equals tab. Inputs: g. Returns: g tab equals tab.

### src/mz-editor.js:40

@function mz-editor.callback.85 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: modal close; accept; frontier mzdialogs open; api maps.

### src/mz-editor.js:40

@function mz-editor.accept.86 — Returns edit using a callback. Inputs: command. Uses: edit. Returns: edit using a callback.

### src/mz-editor.js:40

@function mz-editor.callback.87 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: command indent. Uses: p commands splice; frontier mzcommand editing insert branch; frontier mzcommand editing insert choices.

### src/mz-editor.js:40

@function mz-editor.callback.88 — Returns modal remove using . Inputs: no explicit arguments; uses enclosing module state. Uses: modal remove. Returns: modal remove using .

### src/mz-editor.js:41

@function mz-editor.selectImage.89 — Handles select image within mz editor. Inputs: no explicit arguments; uses enclosing module state. Updates: modal class name; list size; list value; preview width; preview height. Uses: el; modal set attribute; modal append; frontier events graphics filter.

### src/mz-editor.js:41

@function mz-editor.callback.90 — Returns g does not equal "none". Inputs: g. Returns: g does not equal "none".

### src/mz-editor.js:41

@function mz-editor.show.91 — Handles show within mz editor. Inputs: no explicit arguments; uses enclosing module state. Uses: preview get context; ctx clear rect; frontier sprites sheet; ctx draw image.

### src/mz-editor.js:41

@function mz-editor.callback.92 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: edit; modal close.

### src/mz-editor.js:41

@function mz-editor.callback.93 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: settings using p image profile; p graphic. Uses: settings; frontier events graphics includes.

### src/mz-editor.js:41

@function mz-editor.callback.94 — Returns modal close using . Inputs: no explicit arguments; uses enclosing module state. Uses: modal close. Returns: modal close using .

### src/mz-editor.js:41

@function mz-editor.callback.95 — Returns modal remove using . Inputs: no explicit arguments; uses enclosing module state. Uses: modal remove. Returns: modal remove using .

### src/mz-editor.js:42

@function mz-editor.callback.96 — Provides the callback for the enclosing mz editor operation. Inputs: no explicit arguments; uses enclosing module state. Uses: draft pages splice; blank page.

### src/mz-editor.js:42

@function mz-editor.callback.97 — Provides the callback for the enclosing mz editor operation. Inputs: no explicit arguments; uses enclosing module state. Updates: page clipboard. Uses: clone.

### src/mz-editor.js:42

@function mz-editor.callback.98 — Provides the callback for the enclosing mz editor operation. Inputs: no explicit arguments; uses enclosing module state. Uses: draft pages splice; clone.

### src/mz-editor.js:42

@function mz-editor.callback.99 — Provides the callback for the enclosing mz editor operation. Inputs: no explicit arguments; uses enclosing module state. Updates: page index. Uses: draft pages splice.

### src/mz-editor.js:42

@function mz-editor.callback.100 — Provides the callback for the enclosing mz editor operation. Inputs: no explicit arguments; uses enclosing module state. Updates: draft pages at page index. Uses: blank page.

### src/mz-editor.js:42

@function mz-editor.callback.101 — Returns edit using fn. Inputs: no explicit arguments; uses enclosing module state. Uses: edit. Returns: edit using fn.

### src/mz-editor.js:43

@function mz-editor.begin.102 — Handles begin within mz editor. Inputs: event; assignment pattern. Updates: draft; draft extensions at "sprite-frontier"; draft name; draft note; draft display name. Uses: frontier event schema migrate; api world using events map; api world; string using number pad start. Returns: without a result.

### src/mz-editor.js:43

@function mz-editor.callback.103 — Returns chain or 0. Inputs: e. Returns: chain or 0.

### src/mz-editor.js:44

@function mz-editor.apply.104 — Handles apply within mz editor. Inputs: assignment pattern; assignment pattern. Updates: world events at i; draft; draft history; draft redo; return id. Uses: collect; clone; api world; world events find index.

### src/mz-editor.js:44

@function mz-editor.callback.105 — Returns e id equals draft id. Inputs: e. Returns: e id equals draft id.

### src/mz-editor.js:44

@function mz-editor.callback.106 — Returns e id equals draft id. Inputs: e. Returns: e id equals draft id.

### src/mz-editor.js:44

@function mz-editor.callback.107 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: list at index. Uses: api world; list find index; list push; clone.

### src/mz-editor.js:44

@function mz-editor.callback.108 — Returns e id equals checked id. Inputs: e. Returns: e id equals checked id.

### src/mz-editor.js:44

@function mz-editor.callback.109 — Returns choose using checked id. Inputs: no explicit arguments; uses enclosing module state. Uses: choose. Returns: choose using checked id.

### src/mz-editor.js:45

@function mz-editor.onclick.110 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: apply. Returns: apply using true.

### src/mz-editor.js:45

@function mz-editor.onclick.111 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: apply. Returns: apply using .

### src/mz-editor.js:45

@function mz-editor.onclick.112 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using .

### src/mz-editor.js:45

@function mz-editor.onclick.113 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using .

### src/mz-editor.js:45

@function mz-editor.onclick.114 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: apply. Returns: apply using false, true.

### src/mz-editor.js:45

@function mz-editor.callback.115 — Provides the callback for d add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: draft. Uses: document query selector using "#mzCommandContext" remove; document query selector.

### src/mz-editor.js:46

@function mz-editor.callback.116 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: return button hidden. Uses: api return editor; begin; api world using events find; api world.

### src/mz-editor.js:46

@function mz-editor.callback.117 — Returns e id equals return id. Inputs: e. Returns: e id equals return id.

### src/mz-editor.js:47

@function mz-editor.callback.118 — Provides the callback for $ using "mzCommandList" add event listener. Inputs: event. Updates: selection; draft; page index; anchor; handled. Uses: event key to lower case; chooser; edit command; remove.

### src/mz-editor.js:47

@function mz-editor.callback.119 — Returns i. Inputs: ; i. Returns: i.

### src/mz-editor.js:48

@function mz-editor.open.120 — Returns begin using selected using . Inputs: no explicit arguments; uses enclosing module state. Uses: begin; selected. Returns: begin using selected using .

### src/mz-editor.js:48

@function mz-editor.duplicate.121 — Handles duplicate within mz editor. Inputs: id. Updates: copy id; copy name. Uses: api world using events find; api world; clone; crypto random uuid.

### src/mz-editor.js:48

@function mz-editor.callback.122 — Returns e id equals id. Inputs: e. Returns: e id equals id.

### src/mz-editor.js:48

@function mz-editor.pageIndex.123 — Handles page index within mz editor. Inputs: no explicit arguments; uses enclosing module state. Returns: page index.

### src/mz-editor.js:48

@function mz-editor.isOpen.124 — Handles is open within mz editor. Inputs: no explicit arguments; uses enclosing module state. Returns: d open.

### src/mz-route-dialog.js:2

@function mz-route-dialog.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier mzroute dialog.

### src/mz-route-dialog.js:3

@function mz-route-dialog.open.2 — Handles open within mz route dialog. Inputs: initial; accept; assignment pattern. Updates: d class name; d id; d style max width; body style display; body style grid template columns. Uses: frontier mzroutes validate; frontier mzroutes defaults; el; d append.

### src/mz-route-dialog.js:3

@function mz-route-dialog.el.3 — Handles el within mz route dialog. Inputs: tag; text. Updates: n text content. Uses: document create element. Returns: n.

### src/mz-route-dialog.js:3

@function mz-route-dialog.button.4 — Handles button within mz route dialog. Inputs: text; fn. Updates: n type; n onclick. Uses: el. Returns: n.

### src/mz-route-dialog.js:3

@function mz-route-dialog.onchange.5 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: route at key. Returns: assignment.

### src/mz-route-dialog.js:4

@function mz-route-dialog.refresh.6 — Handles refresh within mz route dialog. Inputs: no explicit arguments; uses enclosing module state. Uses: list replace children; route list for each.

### src/mz-route-dialog.js:4

@function mz-route-dialog.callback.7 — Provides the callback for route list for each. Inputs: c; i. Updates: row style display; row style width; row ondblclick. Uses: button; c parameters join; row set attribute; string.

### src/mz-route-dialog.js:4

@function mz-route-dialog.callback.8 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: selected. Uses: refresh; list focus.

### src/mz-route-dialog.js:4

@function mz-route-dialog.ondblclick.9 — Returns parameters using c code, c parameters, a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: parameters. Returns: parameters using c code, c parameters, a callback.

### src/mz-route-dialog.js:4

@function mz-route-dialog.callback.10 — Provides the callback for parameters. Inputs: p. Updates: route list at i. Uses: refresh.

### src/mz-route-dialog.js:5

@function mz-route-dialog.parameters.11 — Handles parameters within mz route dialog. Inputs: code; values; done. Updates: modal class name; input type; input min; input max; input step. Uses: frontier mzdialogs open; structured clone; a list of 15, 27, 28, 29 includes; done. Returns: without a result; without a result.

### src/mz-route-dialog.js:5

@function mz-route-dialog.callback.12 — Returns done using record parameters. Inputs: record. Uses: done. Returns: done using record parameters.

### src/mz-route-dialog.js:5

@function mz-route-dialog.callback.13 — Returns input append using a new option. Inputs: name; i. Uses: input append. Returns: input append using a new option.

### src/mz-route-dialog.js:5

@function mz-route-dialog.callback.14 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: status text content. Uses: frontier mzroutes validate; frontier mzroutes defaults; done; modal close.

### src/mz-route-dialog.js:5

@function mz-route-dialog.callback.15 — Returns modal close using . Inputs: no explicit arguments; uses enclosing module state. Uses: modal close. Returns: modal close using .

### src/mz-route-dialog.js:5

@function mz-route-dialog.onclose.16 — Releases or restores dialog state after closing. Inputs: no explicit arguments; uses enclosing module state. Uses: modal remove. Returns: modal remove using .

### src/mz-route-dialog.js:6

@function mz-route-dialog.callback.17 — Returns parameters using code, a list of , a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: parameters. Returns: parameters using code, a list of , a callback.

### src/mz-route-dialog.js:6

@function mz-route-dialog.callback.18 — Provides the callback for parameters. Inputs: p. Uses: route list splice; refresh.

### src/mz-route-dialog.js:7

@function mz-route-dialog.onkeydown.19 — Handles onkeydown within mz route dialog. Inputs: e. Updates: selected; clipboard. Uses: e prevent default; refresh; route list splice; a list of "c", "x", "v" includes.

### src/mz-route-dialog.js:8

@function mz-route-dialog.callback.20 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: accept; frontier mzroutes validate; d close.

### src/mz-route-dialog.js:8

@function mz-route-dialog.callback.21 — Returns d close using . Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using .

### src/mz-route-dialog.js:8

@function mz-route-dialog.onclose.22 — Releases or restores dialog state after closing. Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using .

### src/mz-routes.js:3

@function mz-routes.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier mzroutes.

### src/mz-routes.js:5

@function mz-routes.supported.2 — Returns code is at least 0 and code is at most 40 and code does not equal 14 or code equals 42 or code equals 44. Inputs: code. Returns: code is at least 0 and code is at most 40 and code does not equal 14 or code equals 42 or code equals 44.

### src/mz-routes.js:6

@function mz-routes.defaults.3 — Handles defaults within mz routes. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing repeat, skippable, wait, list.

### src/mz-routes.js:7

@function mz-routes.validate.4 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Uses: root frontier event schema json; array is array; r list at; error. Returns: r.

### src/mz-routes.js:8

@function mz-routes.start.5 — Handles start within mz routes. Inputs: route; page; assignment pattern. Uses: validate; r list find; error; r list some. Returns: a record containing route, index, wait, done, settings, through.

### src/mz-routes.js:8

@function mz-routes.callback.6 — Returns the inverse of supported using c code. Inputs: c. Uses: supported. Returns: the inverse of supported using c code.

### src/mz-routes.js:8

@function mz-routes.callback.7 — Returns c code equals 44. Inputs: c. Returns: c code equals 44.

### src/mz-routes.js:10

@function mz-routes.face.8 — Handles face within mz routes. Inputs: e; s; x; y. Updates: e facing x; e facing y.

### src/mz-routes.js:11

@function mz-routes.toward.9 — Handles toward within mz routes. Inputs: e; p. Returns: math abs using x is greater than math abs using y selects a list of math sign using x, 0 or a list of 0, math sign using y.

### src/mz-routes.js:12

@function mz-routes.step.10 — Proposes a raised stair destination only when both upward and forward body clearance pass. Inputs: control; e; player; services; dt. Updates: r wait; r index; r done; v; control target. Uses: toward; v map; face; services play se. Returns: without a result; without a result.

### src/mz-routes.js:14

@function mz-routes.callback.11 — Returns - x. Inputs: x. Returns: - x.

### src/mz-routes.js:14

@function mz-routes.callback.12 — Returns - x. Inputs: x. Returns: - x.

### src/mz-routes.js:19

@function mz-routes.callback.13 — Returns - n. Inputs: n. Returns: - n.

### src/mz-routes.js:25

@function mz-routes.arrived.14 — Handles arrived within mz routes. Inputs: control; success. Updates: control route step. Returns: without a result.

### src/normal-bindings.js:3

@function normal-bindings.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier normal bindings.

### src/normal-bindings.js:5

@function normal-bindings.extensions.2 — Preserve future properties only as bounded, finite JSON: reject silent JSON loss. Inputs: value. Uses: copy; array is array; error; json stringify. Returns: out.

### src/normal-bindings.js:5

@function normal-bindings.copy.3 — Handles copy within normal bindings. Inputs: v; depth. Updates: out at key. Uses: error; number is finite; array is array; v map. Returns: v; v.

### src/normal-bindings.js:5

@function normal-bindings.callback.4 — Returns copy using x, depth plus 1. Inputs: x. Uses: copy. Returns: copy using x, depth plus 1.

### src/normal-bindings.js:6

@function normal-bindings.validate.5 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Uses: array is array; error; value entries map. Returns: a record containing schema, entries; a record containing schema, entries.

### src/normal-bindings.js:6

@function normal-bindings.callback.6 — Provides the callback for value entries map. Inputs: e. Updates: bytes. Uses: ids has; error; ids add; /^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/ test. Returns: a record containing profile, png, width, height, light, copied fields.

### src/normal-bindings.js:6

@function normal-bindings.word.7 — Returns raw char code at using o multiplied by 16777216 plus raw char code at using o plus 1 << 16 plus raw char code at using o plus 2 << 8 plus raw char code at using o plus 3. Inputs: o. Uses: raw char code at. Returns: raw char code at using o multiplied by 16777216 plus raw char code at using o plus 1 << 16 plus raw char code at using o plus 2 << 8 plus raw char code at using o plus 3.

### src/normal-render-cache.js:4

@function normal-render-cache.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier normal render cache.

### src/normal-render-cache.js:5

@function normal-render-cache.record.2 — Handles record within normal render cache. Inputs: profile; message. Uses: trace push; trace shift.

### src/normal-render-cache.js:6

@function normal-render-cache.clear.3 — Handles clear within normal render cache. Inputs: next. Updates: item canvas width; item canvas height; bytes; bank. Uses: cache values; item cancel abort; root frontier pixi release image; cache clear.

### src/normal-render-cache.js:7

@function normal-render-cache.image.4 — Handles image within normal render cache. Inputs: source; profile; next. Updates: item canvas width; item canvas height; bytes; item reserved; item. Uses: clear; next entries find; cache get; item cancel abort. Returns: source; item canvas or source.

### src/normal-render-cache.js:7

@function normal-render-cache.callback.5 — Returns e profile equals profile. Inputs: e. Returns: e profile equals profile.

### src/normal-render-cache.js:8

@function normal-render-cache.isCurrent.6 — Returns own version equals version and cache get using profile equals item and the inverse of item cancel signal aborted. Inputs: no explicit arguments; uses enclosing module state. Uses: cache get. Returns: own version equals version and cache get using profile equals item and the inverse of item cancel signal aborted.

### src/normal-render-cache.js:9

@function normal-render-cache.callback.7 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Updates: offthread canvas width; offthread canvas height; item canvas; last preparation; normal src. Uses: performance now; root frontier normal worker prepare; is current; record. Returns: without a result; without a result.

### src/normal-render-cache.js:10

@function normal-render-cache.callback.8 — Returns set timeout using resolve, 0. Inputs: resolve. Uses: set timeout. Returns: set timeout using resolve, 0.

### src/normal-render-cache.js:12

@function normal-render-cache.clear.9 — Returns clear using null. Inputs: no explicit arguments; uses enclosing module state. Uses: clear. Returns: clear using null.

### src/normal-render-cache.js:12

@function normal-render-cache.debug.10 — Returns a record containing bytes, profiles, prepared, lastPreparation, trace. Inputs: no explicit arguments; uses enclosing module state. Uses: trace map. Returns: a record containing bytes, profiles, prepared, lastPreparation, trace.

### src/normal-render-cache.js:12

@function normal-render-cache.callback.11 — Returns a record containing copied fields. Inputs: e. Returns: a record containing copied fields.

### src/normal-workbench.js:3

@function normal-workbench.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier normal workbench.

### src/normal-workbench.js:3

@function normal-workbench.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: api. Updates: box inner html; panel id; panel inner html; panel style font; $ using "normalSource" onchange. Uses: document create element; document get element by id using "editor" append; document get element by id; document body append.

### src/normal-workbench.js:4

@function normal-workbench.$.3 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id.

### src/normal-workbench.js:5

@function normal-workbench.rebuild.4 — Handles rebuild within normal workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: normals; normals data at o plus c; out data at o plus c; out data at o plus 3; normals data at o plus 3. Uses: ctx create image data; number; $; light map. Returns: without a result.

### src/normal-workbench.js:5

@function normal-workbench.callback.5 — Returns v divided by lm. Inputs: v. Returns: v divided by lm.

### src/normal-workbench.js:5

@function normal-workbench.at.6 — Returns height at math max using 0, math min using h minus 1, b multiplied by w plus math max using 0, math min using w minus 1, a. Inputs: a; b. Returns: height at math max using 0, math min using h minus 1, b multiplied by w plus math max using 0, math min using w minus 1, a.

### src/normal-workbench.js:6

@function normal-workbench.schedule.7 — Handles schedule within normal workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: queued. Uses: request animation frame.

### src/normal-workbench.js:6

@function normal-workbench.callback.8 — Provides the callback for request animation frame. Inputs: no explicit arguments; uses enclosing module state. Updates: queued. Uses: rebuild.

### src/normal-workbench.js:7

@function normal-workbench.remember.9 — Retains a bounded list of sufficiently separated safe player positions. Inputs: no explicit arguments; uses enclosing module state. Uses: undo push; height slice; undo shift.

### src/normal-workbench.js:8

@function normal-workbench.generate.10 — Handles generate within normal workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: imported normals; d at i; height at i. Uses: remember; rebuild. Returns: without a result.

### src/normal-workbench.js:9

@function normal-workbench.load.11 — Handles load within normal workbench. Inputs: file. Uses: error; url create object url; url revoke object url. Returns: await.

### src/normal-workbench.js:9

@function normal-workbench.callback.12 — Provides the callback for the enclosing normal workbench operation. Inputs: resolve; reject. Updates: im onload; im onerror; im src.

### src/normal-workbench.js:9

@function normal-workbench.onload.13 — Processes a resource after it finishes loading. Inputs: no explicit arguments; uses enclosing module state. Uses: resolve. Returns: resolve using im.

### src/normal-workbench.js:9

@function normal-workbench.onerror.14 — Returns reject using error using "Cannot decode image". Inputs: no explicit arguments; uses enclosing module state. Uses: reject; error. Returns: reject using error using "Cannot decode image".

### src/normal-workbench.js:10

@function normal-workbench.onchange.15 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: loaded profile; canvas width; canvas height; source; height. Uses: load; $; ctx clear rect; ctx draw image.

### src/normal-workbench.js:11

@function normal-workbench.onchange.16 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: c width; c height; i; candidate data at i; imported normals. Uses: error; load; $; document create element.

### src/normal-workbench.js:12

@function normal-workbench.onchange.17 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: c width; c height; imported normals; height at i. Uses: error; load; $; document create element.

### src/normal-workbench.js:13

@function normal-workbench.paint.18 — Handles paint within normal workbench. Inputs: ev. Updates: light; imported normals; height at k. Uses: canvas get bounding client rect; $; schedule; number. Returns: without a result; without a result.

### src/normal-workbench.js:14

@function normal-workbench.onpointerdown.19 — Begins the pointer-driven interaction. Inputs: e. Updates: painting. Uses: remember; canvas set pointer capture; paint. Returns: without a result.

### src/normal-workbench.js:14

@function normal-workbench.onpointermove.20 — Updates the active pointer-driven interaction. Inputs: e. Uses: paint.

### src/normal-workbench.js:14

@function normal-workbench.onpointercancel.21 — Cancels the active pointer-driven interaction. Inputs: no explicit arguments; uses enclosing module state. Updates: painting. Returns: assignment.

### src/normal-workbench.js:15

@function normal-workbench.onclick.22 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: imported normals. Uses: remember; height fill; rebuild.

### src/normal-workbench.js:15

@function normal-workbench.onclick.23 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: imported normals; height. Uses: undo pop; rebuild.

### src/normal-workbench.js:16

@function normal-workbench.download.24 — Handles download within normal workbench. Inputs: kind. Updates: c width; c height; p data at i multiplied by 4; p data at i multiplied by 4 plus 1; p data at i multiplied by 4 plus 2. Uses: rebuild; document create element; c get context; q put image data. Returns: without a result.

### src/normal-workbench.js:16

@function normal-workbench.callback.25 — Provides the callback for c to blob. Inputs: blob. Updates: a href; a download. Uses: url create object url; document create element; a click; set timeout.

### src/normal-workbench.js:16

@function normal-workbench.callback.26 — Returns url revoke object url using u. Inputs: no explicit arguments; uses enclosing module state. Uses: url revoke object url. Returns: url revoke object url using u.

### src/normal-workbench.js:17

@function normal-workbench.onclick.27 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: canvas width; canvas height; source; height; undo. Uses: $; frontier sprites sheet; error; im decode.

### src/normal-workbench.js:18

@function normal-workbench.onclick.28 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: c width; c height; $ using "normalStatus" text content. Uses: $; error; rebuild; document create element.

### src/normal-workbench.js:18

@function normal-workbench.callback.29 — Returns e profile equals loaded profile. Inputs: e. Returns: e profile equals loaded profile.

### src/normal-workbench.js:18

@function normal-workbench.callback.30 — Returns e profile does not equal loaded profile. Inputs: e. Returns: e profile does not equal loaded profile.

### src/normal-workbench.js:18

@function normal-workbench.callback.31 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: api world using sprite normals. Uses: api world.

### src/normal-workbench.js:18

@function normal-workbench.callback.32 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "normalStatus" text content. Uses: $.

### src/normal-workbench.js:19

@function normal-workbench.onclick.33 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "normalStatus" text content. Uses: error; $; frontier normal bindings validate; api world.

### src/normal-workbench.js:19

@function normal-workbench.callback.34 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: api world using sprite normals. Uses: api world; bank entries filter.

### src/normal-workbench.js:19

@function normal-workbench.callback.35 — Returns e profile does not equal id. Inputs: e. Returns: e profile does not equal id.

### src/normal-workbench.js:19

@function normal-workbench.callback.36 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "normalStatus" text content. Uses: $.

### src/normal-workbench.js:20

@function normal-workbench.onclick.37 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: download. Returns: download using "normal".

### src/normal-workbench.js:20

@function normal-workbench.onclick.38 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: download. Returns: download using "height".

### src/normal-workbench.js:20

@function normal-workbench.onclick.39 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: $; picker replace children; a list of spread element map; frontier muzzle profiles keys.

### src/normal-workbench.js:20

@function normal-workbench.callback.40 — Returns a new option. Inputs: id. Returns: a new option.

### src/normal-workbench.js:20

@function normal-workbench.onclick.41 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: panel close. Returns: panel close using .

### src/normal-worker.js:4

@function normal-worker.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier normal worker.

### src/normal-worker.js:5

@function normal-worker.prepare.2 — Handles prepare within normal worker. Inputs: source; binding; signal. Updates: worker; bitmap; canvas width; canvas height. Uses: root frontier sprite lighting validate to string; root frontier sprite lighting prepare to string; url create object url; create image bitmap. Returns: null; a record containing canvas, metrics.

### src/normal-worker.js:8

@function normal-worker.callback.3 — Provides the callback for the enclosing normal worker operation. Inputs: resolve; reject. Updates: abort; worker onmessage; worker onerror. Uses: signal add event listener; worker post message.

### src/normal-worker.js:8

@function normal-worker.abort.4 — Returns reject using a new domexception. Inputs: no explicit arguments; uses enclosing module state. Uses: reject. Returns: reject using a new domexception.

### src/normal-worker.js:8

@function normal-worker.onmessage.5 — Returns e data error selects reject using error using e data error or resolve using e data. Inputs: e. Uses: reject; error; resolve. Returns: e data error selects reject using error using e data error or resolve using e data.

### src/normal-worker.js:8

@function normal-worker.onerror.6 — Returns reject using error using e message or "Normal worker failed.". Inputs: e. Uses: reject; error. Returns: reject using error using e message or "Normal worker failed.".

### src/number-input.js:3

@function number-input.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier number input.

### src/number-input.js:4

@function number-input.initial.2 — Handles initial within number input. Inputs: value; digits. Uses: number is integer; error; number. Returns: math floor using math max using 0, math min using 10 raised to digits minus 1, number using value or 0.

### src/number-input.js:5

@function number-input.change.3 — Handles change within number input. Inputs: value; digits; index; up. Updates: value. Uses: initial; number is integer; error. Returns: value minus old multiplied by place plus old plus up selects 1 or 9 % 10 multiplied by place.

### src/number-input.js:6

@function number-input.mount.4 — Handles mount within number input. Inputs: container; message; accept. Updates: box class name; row class name; b type; b onclick; b text content. Uses: initial; document create element; box set attribute; b set attribute. Returns: a record containing value, key.

### src/number-input.js:6

@function number-input.refresh.5 — Handles refresh within number input. Inputs: assignment pattern. Uses: string using value pad start; string; digits for each; digits at selected focus.

### src/number-input.js:6

@function number-input.callback.6 — Provides the callback for digits for each. Inputs: b; i. Updates: b text content. Uses: b set attribute; string.

### src/number-input.js:6

@function number-input.onclick.7 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: selected. Uses: refresh.

### src/number-input.js:6

@function number-input.callback.8 — Provides the callback for the enclosing number input operation. Inputs: no explicit arguments; uses enclosing module state. Updates: value. Uses: change; refresh.

### src/number-input.js:6

@function number-input.callback.9 — Provides the callback for the enclosing number input operation. Inputs: no explicit arguments; uses enclosing module state. Updates: value. Uses: change; refresh.

### src/number-input.js:6

@function number-input.callback.10 — Returns accept using value. Inputs: no explicit arguments; uses enclosing module state. Uses: accept. Returns: accept using value.

### src/number-input.js:6

@function number-input.value.11 — Returns value. Inputs: no explicit arguments; uses enclosing module state. Returns: value.

### src/number-input.js:6

@function number-input.key.12 — Handles key within number input. Inputs: key. Updates: selected; value. Uses: a list of "arrowleft", "arrowright", "arrowup", "arrowdown" includes; change; accept; refresh. Returns: false; true.

### src/outdoor-assets.js:1

@function outdoor-assets.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier outdoor assets.

### src/outdoor-assets.js:1

@function outdoor-assets.image.2 — Handles image within outdoor assets. Inputs: id. Updates: im src. Uses: assets find; images has; images set; images get. Returns: null; images get using id.

### src/outdoor-assets.js:1

@function outdoor-assets.callback.3 — Returns a id equals id. Inputs: a. Returns: a id equals id.

### src/outdoor-assets.js:1

@function outdoor-assets.install.4 — Handles install within outdoor assets. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier sprites sheet; frontier muzzle load; assets filter using a callback map; assets filter.

### src/outdoor-assets.js:1

@function outdoor-assets.callback.5 — Returns a category does not equal "ground" and a category does not equal "rugs". Inputs: a. Returns: a category does not equal "ground" and a category does not equal "rugs".

### src/outdoor-assets.js:1

@function outdoor-assets.callback.6 — Returns a record containing id, sheet, sheetData, rows, columns, frameWidth, frameHeight, referenceHeight. Inputs: a. Returns: a record containing id, sheet, sheetData, rows, columns, frameWidth, frameHeight, referenceHeight.

### src/outdoor-assets.js:1

@function outdoor-assets.world.7 — Handles world within outdoor assets. Inputs: base. Updates: w seed; w size; w width; w height; w spawn. Uses: structured clone; assets filter; frontier sprites sheet; frontier world rng. Returns: frontier world validate using w.

### src/outdoor-assets.js:1

@function outdoor-assets.callback.8 — Returns a category equals "trees". Inputs: a. Returns: a category equals "trees".

### src/outdoor-assets.js:1

@function outdoor-assets.callback.9 — Returns math hypot using e x minus x, e y minus y is less than 1.5. Inputs: e. Returns: math hypot using e x minus x, e y minus y is less than 1.5.

### src/outdoor-assets.js:1

@function outdoor-assets.callback.10 — Returns a record containing id, name, kind, spriteProfile. Inputs: a. Returns: a record containing id, name, kind, spriteProfile.

### src/outdoor-assets.js:2

@function outdoor-assets.clipTerrain.11 — Clip terrain triangles before projection instead of dropping whole near tiles. Inputs: cam; poly. Uses: depth; out push; a map. Returns: out.

### src/outdoor-assets.js:2

@function outdoor-assets.depth.12 — Returns p at 0 minus cam x multiplied by math sin using cam yaw plus p at 1 minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus p at 2 minus cam z multiplied by math sin using cam pitch. Inputs: p. Returns: p at 0 minus cam x multiplied by math sin using cam yaw plus p at 1 minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus p at 2 minus cam z multiplied by math sin using cam pitch.

### src/outdoor-assets.js:2

@function outdoor-assets.callback.13 — Returns v plus t multiplied by b at k minus v. Inputs: v; k. Returns: v plus t multiplied by b at k minus v.

### src/outdoor-assets.js:3

@function outdoor-assets.draw.14 — Draws this system’s current state into the supplied rendering context. Inputs: ctx; game; cam; project. Uses: image; frontier terrain occlusion begin; frontier world dimensions; frontier terrain height. Returns: without a result.

### src/outdoor-assets.js:6

@function outdoor-assets.callback.15 — Returns a list of u, v, frontier terrain height using world, u, v. Inputs: array pattern. Uses: frontier terrain height. Returns: a list of u, v, frontier terrain height using world, u, v.

### src/outdoor-assets.js:6

@function outdoor-assets.callback.16 — Returns project using cam, spread element. Inputs: v. Uses: project. Returns: project using cam, spread element.

### src/outdoor-assets.js:6

@function outdoor-assets.callback.17 — Returns the inverse of v. Inputs: v. Returns: the inverse of v.

### src/outdoor-assets.js:6

@function outdoor-assets.callback.18 — Returns v x is less than 0. Inputs: v. Returns: v x is less than 0.

### src/outdoor-assets.js:6

@function outdoor-assets.callback.19 — Returns v x is greater than game view width. Inputs: v. Returns: v x is greater than game view width.

### src/outdoor-assets.js:6

@function outdoor-assets.callback.20 — Returns v y is less than 0. Inputs: v. Returns: v y is less than 0.

### src/outdoor-assets.js:6

@function outdoor-assets.callback.21 — Returns v y is greater than 480. Inputs: v. Returns: v y is greater than 480.

### src/outdoor-assets.js:6

@function outdoor-assets.callback.22 — Returns v slice using 0, 2. Inputs: v. Uses: v slice. Returns: v slice using 0, 2.

### src/outdoor-assets.js:6

@function outdoor-assets.callback.23 — Returns s plus v depth. Inputs: s; v. Returns: s plus v depth.

### src/outdoor-assets.js:7

@function outdoor-assets.callback.24 — Returns b depth minus a depth. Inputs: a; b. Returns: b depth minus a depth.

### src/page-cache.js:6

@function page-cache.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier page cache.

### src/page-cache.js:11

@function page-cache.observe.2 — Handles observe within page cache. Inputs: value. Updates: record. Uses: observed get; observed set; object define property. Returns: null; record.

### src/page-cache.js:12

@function page-cache.value.3 — Handles value within page cache. Inputs: rest element. Updates: record changes at record revision % history size. Uses: this has; object is; this get; original apply. Returns: result.

### src/page-cache.js:14

@function page-cache.stableExpression.4 — Handles stable expression within page cache. Inputs: e. Uses: e children every; stable expression; a list of "compare", "switch", "selfSwitch", "item" includes. Returns: false; e children every using stable expression.

### src/page-cache.js:15

@function page-cache.stablePage.5 — Handles stable page within page cache. Inputs: page. Uses: a list of page condition, spread element every. Returns: a list of page condition, spread element every using a callback.

### src/page-cache.js:15

@function page-cache.callback.6 — Returns c type equals "expression" selects stable expression using c expression or a list of "always", "switch", "selfSwitch", "variable" includes using c type. Inputs: c. Uses: stable expression; a list of "always", "switch", "selfSwitch", "variable" includes. Returns: c type equals "expression" selects stable expression using c expression or a list of "always", "switch", "selfSwitch", "variable" includes using c type.

### src/page-cache.js:18

@function page-cache.dependencies.7 — remain dynamic until their dependencies are explicitly supported here. Inputs: event. Uses: object from entries; collections map; expression; add. Returns: a record containing keys, gold.

### src/page-cache.js:18

@function page-cache.callback.8 — Returns a list of k, a new set. Inputs: k. Returns: a list of k, a new set.

### src/page-cache.js:18

@function page-cache.add.9 — Returns chain. Inputs: type; key. Uses: keys at a record containing switch, selfSwitch, variable, item, actor, quest, skill, reputation at type add. Returns: chain.

### src/page-cache.js:19

@function page-cache.expression.10 — Handles expression within page cache. Inputs: e. Updates: gold. Uses: e children for each; expression; add.

### src/page-cache.js:22

@function page-cache.affected.11 — Handles affected within page cache. Inputs: record; previous; keys. Uses: keys has. Returns: false; true.

### src/page-cache.js:23

@function page-cache.create.12 — Builds a new instance and its public operations from the supplied configuration. Inputs: state. Returns: a record containing selection, stats, invalidate.

### src/page-cache.js:24

@function page-cache.selection.13 — Handles selection within page cache. Inputs: event; scan. Updates: entry; entry dependencies; entry refs; entry versions; entry gold. Uses: entries get; event pages every; dependencies; entries set. Returns: scan using ; entry result.

### src/page-cache.js:25

@function page-cache.callback.14 — Returns state at key. Inputs: key. Returns: state at key.

### src/page-cache.js:25

@function page-cache.callback.15 — Returns chain or the fallback 0. Inputs: record. Returns: chain or the fallback 0.

### src/page-cache.js:26

@function page-cache.callback.16 — Provides the callback for refs every. Inputs: value; i. Uses: affected. Returns: the inverse of keys size or value equals entry refs at i and records at i and the inverse of affected using records at i, entry versions at i, keys.

### src/page-cache.js:29

@function page-cache.invalidate.17 — Handles invalidate within page cache. Inputs: event. Updates: entries. Uses: entries delete.

### src/parameters.js:4

@function parameters.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier parameters. Uses: object from entries; object entries using fields map; object entries.

### src/parameters.js:25

@function parameters.callback.2 — Returns a list of key, f value. Inputs: array pattern. Returns: a list of key, f value.

### src/parameters.js:27

@function parameters.validate.3 — Sanitize the complete parameter snapshot before any rule changes become live. Inputs: assignment pattern. Updates: result at key. Uses: array is array; error; object entries; number is finite. Returns: result.

### src/parameters.js:35

@function parameters.get.4 — Return an authored setting without allocating a merged object per frame. Inputs: world; key. Returns: chain or the fallback defaults at key.

### src/parser.js:5

@function parser.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier parser.

### src/parser.js:7

@function parser.normalize.2 — Returns string using text normalize using "NFKC" to lower case using replace using /[^\p{L}\p{N}\s]/gu, " " replace using /\s+/g, " " trim using . Inputs: text. Uses: string using text normalize using "NFKC" to lower case using replace using /[^\p{L}\p{N}\s]/gu, " " replace using /\s+/g, " " trim; string using text normalize using "NFKC" to lower case using replace using /[^\p{L}\p{N}\s]/gu, " " replace; string using text normalize using "NFKC" to lower case using replace; string using text normalize using "NFKC" to lower case. Returns: string using text normalize using "NFKC" to lower case using replace using /[^\p{L}\p{N}\s]/gu, " " replace using /\s+/g, " " trim using .

### src/parser.js:9

@function parser.compile.3 — Validate and normalize topic/profile metadata once before use; invalid authoring must fail before runtime execution. Inputs: topics. Uses: array is array; error; topics map. Returns: topics map using a callback.

### src/parser.js:11

@function parser.callback.4 — Provides the callback for topics map. Inputs: topic. Uses: array is array; topic aliases some; /^[A-Za-z0-9_-]{1,60}$/ test; error. Returns: a record containing copied fields, aliases.

### src/parser.js:12

@function parser.callback.5 — Returns typeof a does not equal "string" or a length is greater than 160. Inputs: a. Returns: typeof a does not equal "string" or a length is greater than 160.

### src/parser.js:21

@function parser.ask.6 — Match normalized user text against visible aliases, preferring exact then longest whole-word matches. Inputs: input; topics; assignment pattern. Updates: score; best. Uses: normalize using input replace; normalize; state switches get; " " plus query plus " " includes. Returns: "What would you like to ask about?"; chain or "I don't know anything about that. Try another subject.".

### src/party-combat.js:2

@function party-combat.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier party combat.

### src/party-combat.js:3

@function party-combat.alive.2 — Returns e and the inverse of e dead and e hp is greater than 0. Inputs: e. Returns: e and the inverse of e dead and e hp is greater than 0.

### src/party-combat.js:4

@function party-combat.allied.3 — Handles allied within party combat. Inputs: game; e. Uses: game party membership has; string. Returns: chain equals game player id or the inverse of the inverse of chain and chain.

### src/party-combat.js:5

@function party-combat.target.4 — Handles target within party combat. Inputs: game; actor. Uses: allied; a list of spread element filter using a callback sort; a list of spread element filter; game runtime entities values. Returns: a list of spread element filter using a callback sort using a callback at 0 or null.

### src/party-combat.js:5

@function party-combat.callback.5 — Returns e id does not equal actor id and alive using e and friend selects e kind equals "monster" and the inverse of allied using game, e and e hostile does not equal false or e aggro or allied using game, e. Inputs: e. Uses: alive; allied. Returns: e id does not equal actor id and alive using e and friend selects e kind equals "monster" and the inverse of allied using game, e and e hostile does not equal false or e aggro or allied using game, e.

### src/party-combat.js:5

@function party-combat.callback.6 — Returns math hypot using a x minus actor x, a y minus actor y minus math hypot using b x minus actor x, b y minus actor y or a id locale compare using b id. Inputs: a; b. Uses: a id locale compare. Returns: math hypot using a x minus actor x, a y minus actor y minus math hypot using b x minus actor x, b y minus actor y or a id locale compare using b id.

### src/party-combat.js:6

@function party-combat.canDamage.7 — Handles can damage within party combat. Inputs: game; source; victim. Uses: allied. Returns: true; chain equals true or the inverse of allied using game, source and allied using game, victim.

### src/party-combat.js:9

@function party-combat.advanceCooldowns.8 — idle actors recover too; the host invokes this once before event movement. Inputs: actors; dt. Updates: e stun time; e attack time. Uses: number is finite. Returns: without a result.

### src/pixi-renderer.js:5

@function pixi-renderer.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier pixi.

### src/pixi-renderer.js:12

@function pixi-renderer.color.2 — Bound the palette cache: dynamic mod colors cannot grow it indefinitely. Inputs: value. Uses: colors has; colors get; c to number; colors delete. Returns: colors get using value; parsed.

### src/pixi-renderer.js:22

@function pixi-renderer.constructor.3 — function Object() { [native code] } Inputs: application. Updates: this app; this graphics; this sprites; this texts; this sources. Uses: this beam layer add child.

### src/pixi-renderer.js:35

@function pixi-renderer.begin.4 — Handles begin within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this gi; this si; this ti; this graphic; this pending stroke. Uses: this app stage remove children; this beam layer remove children; this beam layer add child; this beam clear.

### src/pixi-renderer.js:52

@function pixi-renderer.point.5 — Handles point within pixi renderer. Inputs: x; y. Returns: a list of m at 0 multiplied by x plus m at 2 multiplied by y plus m at 4, m at 1 multiplied by x plus m at 3 multiplied by y plus m at 5.

### src/pixi-renderer.js:57

@function pixi-renderer.gfx.6 — Handles gfx within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this graphics at this gi; g mask; this graphic masks at this gi minus 1; this graphic. Uses: g clear; mask clear; mask rect; mask fill. Returns: this graphic.

### src/pixi-renderer.js:69

@function pixi-renderer.save.7 — Handles save within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: this stack push.

### src/pixi-renderer.js:76

@function pixi-renderer.restore.8 — Applies saved state to this system. Inputs: no explicit arguments; uses enclosing module state. Updates: this graphic. Uses: this stack pop; this flush stroke; object assign.

### src/pixi-renderer.js:80

@function pixi-renderer.translate.9 — Handles translate within pixi renderer. Inputs: x; y. Updates: this matrix at 4; this matrix at 5. Uses: this point.

### src/pixi-renderer.js:86

@function pixi-renderer.scale.10 — Handles scale within pixi renderer. Inputs: x; y. Updates: this matrix at 0; this matrix at 1; this matrix at 2; this matrix at 3.

### src/pixi-renderer.js:93

@function pixi-renderer.rotate.11 — Handles rotate within pixi renderer. Inputs: angle. Uses: object assign.

### src/pixi-renderer.js:101

@function pixi-renderer.beginPath.12 — Handles begin path within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this path.

### src/pixi-renderer.js:105

@function pixi-renderer.moveTo.13 — Handles move to within pixi renderer. Inputs: x; y. Uses: this path push; this point.

### src/pixi-renderer.js:109

@function pixi-renderer.lineTo.14 — Handles line to within pixi renderer. Inputs: x; y. Uses: this path push; this point.

### src/pixi-renderer.js:113

@function pixi-renderer.bezierCurveTo.15 — Handles bezier curve to within pixi renderer. Inputs: a; b; c; d; x; y. Uses: this path push; this point.

### src/pixi-renderer.js:117

@function pixi-renderer.closePath.16 — Handles close path within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: this path push.

### src/pixi-renderer.js:123

@function pixi-renderer.flushStroke.17 — Handles flush stroke within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this pending stroke. Uses: this graphic stroke. Returns: without a result.

### src/pixi-renderer.js:130

@function pixi-renderer.fogAmount.18 — Handles fog amount within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: root frontier fog amount. Returns: chain or 0.

### src/pixi-renderer.js:131

@function pixi-renderer.fogRGB.19 — Handles fog rgb within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: color. Returns: color using this fog color color.

### src/pixi-renderer.js:132

@function pixi-renderer.painted.20 — Handles painted within pixi renderer. Inputs: value. Updates: rgb. Uses: color; this fog amount; this fog palette has; this fog palette get. Returns: original; this fog palette get using key.

### src/pixi-renderer.js:141

@function pixi-renderer.spriteFog.21 — Handles sprite fog within pixi renderer. Inputs: a. Updates: this fog color; f matrix; this fog filters at index. Uses: this fog rgb. Returns: null; this fog filters at index.

### src/pixi-renderer.js:156

@function pixi-renderer.stroke.22 — Handles stroke within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this graphic; this beam added; this beam filter strength; this beam layer alpha; this pending stroke. Uses: this flush stroke; this app stage add child; this painted; root frontier vector paths.

### src/pixi-renderer.js:173

@function pixi-renderer.waterQuad.23 — Handles water quad within pixi renderer. Inputs: points; material; x; y; assignment pattern. Updates: this graphic; c width; c height; pixels data at o; pixels data at o plus 1. Uses: this flush stroke; document create element; c get context; q create image data.

### src/pixi-renderer.js:183

@function pixi-renderer.fill.24 — Handles fill within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: this flush stroke; this gfx; g at method; this painted.

### src/pixi-renderer.js:185

@function pixi-renderer.rectPath.25 — Handles rect path within pixi renderer. Inputs: x; y; w; h. Uses: this begin path; this move to; this line to; this close path.

### src/pixi-renderer.js:194

@function pixi-renderer.strokeRect.26 — Handles stroke rect within pixi renderer. Inputs: x; y; w; h. Uses: this rect path; this stroke.

### src/pixi-renderer.js:199

@function pixi-renderer.fillRect.27 — Handles fill rect within pixi renderer. Inputs: x; y; w; h. Uses: this flush stroke; this rect path; this gfx; g at method.

### src/pixi-renderer.js:211

@function pixi-renderer.setGraphicClip.28 — Handles set graphic clip within pixi renderer. Inputs: rect. Updates: this graphic; this graphic clip. Uses: this flush stroke.

### src/pixi-renderer.js:214

@function pixi-renderer.drawSpriteBands — Inputs: loaded atlas image or cached lighting/style canvas, frame pixel rectangle, up to eight projected bands, optional depth-mask regions. Returns nothing. Reuses GPU geometry and masks at visible-entity high-water mark; no per-frame texture creation. Bands are world-upright and use the same depth plane as the mask. Canvas fallback remains in render.candy.

### src/pixi-renderer.js:230

@function pixi-renderer.setImageClip.29 — Handles set image clip within pixi renderer. Inputs: rect. Updates: this image clip.

### src/pixi-renderer.js:231

@function pixi-renderer.drawImage.30 — Handles draw image within pixi renderer. Inputs: image; sx; sy; sw; sh; dx; dy; dw; dh. Updates: source; texture; this sprites at this si; sprite texture; sprite alpha. Uses: this flush stroke; this sources get; this sources set; this crops set.

### src/pixi-renderer.js:268

@function pixi-renderer.fillText.31 — Handles fill text within pixi renderer. Inputs: value; x; y. Updates: this texts at this ti; text text; text style font size; text style font family; text style fill. Uses: this flush stroke; string; number; this font match.

### src/pixi-renderer.js:289

@function pixi-renderer.end.32 — Handles end within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this app stage filters; this underwater filter; u u time; u u strength; u u frequency. Uses: this flush stroke; p gl program from; screen tone some; this app renderer render.

### src/pixi-renderer.js:298

@function pixi-renderer.callback.33 — Returns v does not equal 0. Inputs: v. Returns: v does not equal 0.

### src/pixi-renderer.js:308

@function pixi-renderer.init.34 — Handles init within pixi renderer. Inputs: canvas. Updates: app; adapter; root frontier pixi backend; failed. Uses: document fonts load; app init; app stop.

### src/pixi-renderer.js:327

@function pixi-renderer.context.35 — Initialize Pixi once, return null while starting, then reuse a drawing adapter and resize as needed. Inputs: canvas. Updates: started. Uses: init; canvas get context; app renderer resize; adapter begin. Returns: canvas get context using "2d"; null.

### src/pixi-renderer.js:339

@function pixi-renderer.releaseImage.36 — Handles release image within pixi renderer. Inputs: image. Uses: adapter sources get; adapter crops get using image values; adapter crops get; texture destroy. Returns: without a result.

### src/pixi-renderer.js:341

@function pixi-renderer.capture.37 — Handles capture within pixi renderer. Inputs: target. Uses: app renderer render; target get context using "2d" draw image; target get context; document get element by id.

### src/pixi-renderer.js:342

@function pixi-renderer.toneSupported.38 — Returns the inverse of failed. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of failed.

### src/pixi-renderer.js:342

@function pixi-renderer.setTone.39 — Handles set tone within pixi renderer. Inputs: value. Uses: screen tone set.

### src/pixi-renderer.js:343

@function pixi-renderer.end.40 — Handles end within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: adapter end.

### src/pixi-renderer.js:346

@function pixi-renderer.app.41 — Handles app within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Returns: app.

### src/player-recovery.js:3

@function player-recovery.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier player recovery.

### src/player-recovery.js:7

@function player-recovery.checkSafe.2 — collision and legacy solids. Returns false for occupied or airborne points. Inputs: game; point. Uses: root frontier interior blocked; root frontier model collision blocked; solids some. Returns: false; false.

### src/player-recovery.js:11

@function player-recovery.callback.3 — Returns e does not equal p and the inverse of e dead and e solid does not equal false and e radius and math abs using e x minus point x is less than e radius plus 0.13 and math abs using e y minus point y is less than e radius plus 0.13 and point z is less than e z or 0 plus e height minus 0.001. Inputs: e. Returns: e does not equal p and the inverse of e dead and e solid does not equal false and e radius and math abs using e x minus point x is less than e radius plus 0.13 and math abs using e y minus point y is less than e radius plus 0.13 and point z is less than e z or 0 plus e height minus 0.001.

### src/player-recovery.js:14

@function player-recovery.safe.4 — Run a safety probe without replacing the last gameplay collision trace. Inputs: game; point. Updates: game model collision debug. Uses: check safe. Returns: check safe using game, point.

### src/player-recovery.js:17

@function player-recovery.remember.5 — spacing avoids choosing another point on the same troublesome contact. Inputs: game. Updates: list. Uses: safe; histories get; histories set; list at. Returns: without a result; without a result.

### src/player-recovery.js:21

@function player-recovery.recover.6 — Returns success/failure and records the outcome for diagnostics. Inputs: game. Updates: z; game recovery debug; game player step; game moving. Uses: histories get; list slice using reverse using filter; list slice using reverse; list slice. Returns: false; true.

### src/player-recovery.js:21

@function player-recovery.callback.7 — Returns math hypot using q x minus p x, q y minus p y is at least 1. Inputs: q. Returns: math hypot using q x minus p x, q y minus p y is at least 1.

### src/player-recovery.js:23

@function player-recovery.callback.8 — Returns safe using game, q. Inputs: q. Uses: safe. Returns: safe using game, q.

### src/quest-example.js:3

@function quest-example.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier quest example.

### src/quest-example.js:5

@function quest-example.change.2 — Returns a record containing type, domain, key, operation, copied fields. Inputs: domain; key; operation; value. Returns: a record containing type, domain, key, operation, copied fields.

### src/quest-example.js:6

@function quest-example.text.3 — Returns a record containing type, text, dialogue. Inputs: text. Returns: a record containing type, text, dialogue.

### src/quest-example.js:6

@function quest-example.branch.4 — Returns a record containing type, condition. Inputs: expression. Returns: a record containing type, condition.

### src/quest-example.js:7

@function quest-example.events.5 — Handles events within quest example. Inputs: no explicit arguments; uses enclosing module state. Updates: npc name; npc pages at 0 commands; accepted condition; accepted commands; completed condition. Uses: root frontier events create; text; branch; change. Returns: root frontier events validate using a list of npc, chest.

### src/quest-example.js:12

@function quest-example.maps.6 — Allocate identities before building transfer commands; no bundled map is mutated. Inputs: base; identities. Updates: home events; authored at 1 x; store events; trainer name; trainer pages at 0 commands. Uses: array is array; error; events; blank. Returns: a list of a record containing copied fields, name, world, a record containing copied fields, name, world.

### src/quest-example.js:15

@function quest-example.blank.7 — Handles blank within quest example. Inputs: no explicit arguments; uses enclosing module state. Updates: w seed; w spawn; w objects; w events; w terrain. Uses: structured clone; root frontier water validate. Returns: w.

### src/quest-example.js:18

@function quest-example.gate.8 — Handles gate within quest example. Inputs: name; target. Updates: e name; e pages at 0 commands. Uses: root frontier events create. Returns: e.

### src/render.js:5

@function render.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier render.

### src/render.js:8

@function render.vector.2 — Draw temporary vector silhouettes in local coordinates. Replace art without coupling visual shape to world collision. Inputs: ctx; kind; px; py; w; h. Updates: x stroke style; x line width; y. Uses: ctx save; ctx translate; ctx scale; line.

### src/render.js:16

@function render.line.3 — Handles line within world projection and drawing. Inputs: points. Uses: x begin path; points for each; x stroke.

### src/render.js:18

@function render.callback.4 — Returns i selects x line to using spread element or x move to using spread element. Inputs: p; i. Uses: x line to; x move to. Returns: i selects x line to using spread element or x move to using spread element.

### src/render.js:63

@function render.candy.5 — Resolve a sprite sheet/frame and scale from reference pixel height; anchor the frame at the projected feet. Inputs: ctx; e; p; cam. Updates: ctx asset glow. Uses: frontier sprites sheet; frontier directions select; root frontier water level; root frontier water obscures. Returns: false; true.

### src/render.js:80

@function render.bandDepth — Inputs: screen y pixels. Returns upright plane forward depth in world units without side effects.

### src/render.js:112

@function render.callback.6 — Returns horizontal divided by math cos using cam pitch plus cam cy or the fallback 96 minus y divided by 360 multiplied by math sin using cam pitch. Inputs: y. Returns: horizontal divided by math cos using cam pitch plus cam cy or the fallback 96 minus y divided by 360 multiplied by math sin using cam pitch.

### src/render.js:119

@function render.camera.7 — Build the camera position and pitch-aware framing from player elevation, zoom and view width. Inputs: game. Updates: floor; result z. Uses: root frontier interior camera; rules get; frontier terrain height; root frontier model collision camera. Returns: fixed; a record containing x, y, z, cx, yaw, pitch.

### src/render.js:145

@function render.depth.8 — Compute forward distance in the tilted camera basis; used for clipping and sorting. Inputs: cam; x; y; assignment pattern. Returns: x minus cam x multiplied by math sin using cam yaw plus y minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus z minus cam z multiplied by math sin using cam pitch.

### src/render.js:149

@function render.project.9 — Project world XYZ into logical screen coordinates and scale; reject geometry behind the near plane. Inputs: cam; x; y; assignment pattern. Uses: root frontier interior project; depth. Returns: root frontier interior project using cam, x, y; null.

### src/render.js:160

@function render.draw.10 — Painter-order scene: sky → terrain grid → sorted sprites/props → editor overlays → travel/effects → death overlay. Inputs: canvas; game. Updates: game view width; cam underwater; ctx terrain depth; ctx world; ctx underwater. Uses: root frontier pixi context; canvas get context; camera; root frontier water submerged. Returns: without a result.

### src/render.js:182

@function render.groundHeight.11 — Handles ground height within world projection and drawing. Inputs: x; y. Uses: heights has; heights set; frontier terrain height; heights get. Returns: heights get using key.

### src/render.js:185

@function render.straightSegment.12 — Clip a terrain grid edge at the near plane before projecting to avoid inverted giant lines. Inputs: ax; ay; bx; by. Updates: a; b; ctx fog depth. Uses: ground height; project; depth; ctx begin path. Returns: without a result.

### src/render.js:204

@function render.segment.13 — bends even when the visible grid spacing is two or more units. Inputs: ax; ay; bx; by. Uses: straight segment. Returns: without a result.

### src/render.js:213

@function render.callback.14 — Returns game drag ghost id equals e id selects a record containing copied fields, x, y, z or e. Inputs: e. Uses: frontier terrain height. Returns: game drag ghost id equals e id selects a record containing copied fields, x, y, z or e.

### src/render.js:214

@function render.callback.15 — Returns p at 2 equals e points at 0 at 2. Inputs: p. Returns: p at 2 equals e points at 0 at 2.

### src/render.js:221

@function render.callback.16 — Returns e kind equals "roomFace". Inputs: e. Returns: e kind equals "roomFace".

### src/render.js:225

@function render.layer.17 — Returns e kind equals "roomFace" and e points every using a callback selects - 1 or 0. Inputs: e. Uses: e points every. Returns: e kind equals "roomFace" and e points every using a callback selects - 1 or 0.

### src/render.js:225

@function render.callback.18 — Returns p at 2 equals e points at 0 at 2. Inputs: p. Returns: p at 2 equals e points at 0 at 2.

### src/render.js:226

@function render.callback.19 — Returns a record containing e, p. Inputs: e. Uses: project. Returns: a record containing e, p.

### src/render.js:229

@function render.callback.20 — Returns q p and q p depth is less than 45 and the inverse of q e transparent and the inverse of q e model id and q e kind does not equal "roomFace" and q e kind does not equal "none" or game authoring. Inputs: q. Returns: q p and q p depth is less than 45 and the inverse of q e transparent and the inverse of q e model id and q e kind does not equal "roomFace" and q e kind does not equal "none" or game authoring.

### src/render.js:229

@function render.callback.21 — Returns layer using a e minus layer using b e or b p depth minus a p depth. Inputs: a; b. Uses: layer. Returns: layer using a e minus layer using b e or b p depth minus a p depth.

### src/render.js:240

@function render.callback.22 — Returns array is array using v selects project using cam, spread element or project using cam, v x, v y. Inputs: v. Uses: array is array; project. Returns: array is array using v selects project using cam, spread element or project using cam, v x, v y.

### src/render.js:240

@function render.callback.23 — Returns ctx at i selects "lineTo" or "moveTo" using p x, p y. Inputs: p; i. Uses: ctx at i selects "lineTo" or "moveTo". Returns: ctx at i selects "lineTo" or "moveTo" using p x, p y.

### src/render.js:284

@function render.callback.24 — Returns a record containing x, y. Inputs: ; i. Returns: a record containing x, y.

### src/render.js:284

@function render.callback.25 — Returns the inverse of outside or the inverse of frontier interior inside using game source world interior floor, q x, q y. Inputs: q. Uses: frontier interior inside. Returns: the inverse of outside or the inverse of frontier interior inside using game source world interior floor, q x, q y.

### src/render.js:284

@function render.callback.26 — Returns project using cam, q x, q y. Inputs: q. Uses: project. Returns: project using cam, q x, q y.

### src/render.js:284

@function render.callback.27 — Returns ctx at i selects "lineTo" or "moveTo" using q x, q y. Inputs: q; i. Uses: ctx at i selects "lineTo" or "moveTo". Returns: ctx at i selects "lineTo" or "moveTo" using q x, q y.

### src/render.js:294

@function render.callback.28 — Returns e id equals game selected id. Inputs: e. Returns: e id equals game selected id.

### src/render.js:370

@function render.callback.29 — Provides the callback for root phanicom blood draw. Inputs: rest element. Updates: ctx fog depth. Uses: project. Returns: p.

### src/render.js:386

@function render.map.30 — Draw the overview map independently of the perspective renderer; its coordinates are world X/Y. Inputs: canvas; world; game; editing. Updates: c fill style; c stroke style. Uses: canvas get context; c fill rect; c begin path; c arc.

### src/render.js:409

@function render.groundPoint.31 — Raymarch and refine the terrain intersection for editor placement, preserving raised terrain. Inputs: game; sx; sy. Updates: t; lo; hi; previous. Uses: camera; frontier interior ground point; at; frontier terrain height. Returns: frontier interior ground point using cam, sx, sy; a record containing x, y.

### src/render.js:416

@function render.at.32 — Returns a record containing x, y, z. Inputs: t. Returns: a record containing x, y, z.

### src/render.js:444

@function render.pick.33 — Choose the nearest projected entity containing the pointer, using one pass instead of sorting all candidates. Inputs: game; sx; sy; assignment pattern. Updates: nearest; best; game model target debug. Uses: camera; root frontier activity query; root frontier model targeting pick; project. Returns: nearest.

### src/room-editor.js:3

@function room-editor.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier room editor.

### src/room-editor.js:3

@function room-editor.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: api. Updates: box inner html; connections inner html; label text content; i id; i type. Uses: document get element by id; document create element; host append; $. Returns: a record containing refresh, draw.

### src/room-editor.js:6

@function room-editor.$.3 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id.

### src/room-editor.js:10

@function room-editor.room.4 — Handles room within room editor. Inputs: no explicit arguments; uses enclosing module state. Uses: api world. Returns: api world using interior.

### src/room-editor.js:10

@function room-editor.travel.5 — Handles travel within room editor. Inputs: no explicit arguments; uses enclosing module state. Uses: room; api world. Returns: room using or api world using travel or a record containing entrances, exits.

### src/room-editor.js:10

@function room-editor.entries.6 — Handles entries within room editor. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of "blockers", "sprites", "primitives", "entrances" flat map. Returns: a list of "blockers", "sprites", "primitives", "entrances" flat map using a callback.

### src/room-editor.js:10

@function room-editor.callback.7 — Returns chain or a list of . Inputs: k. Uses: k equals "entrances" or k equals "exits" selects travel using or room using at k map; travel; room. Returns: chain or a list of .

### src/room-editor.js:10

@function room-editor.callback.8 — Returns a record containing key, e. Inputs: e. Returns: a record containing key, e.

### src/room-editor.js:10

@function room-editor.chosen.9 — Handles chosen within room editor. Inputs: no explicit arguments; uses enclosing module state. Uses: entries using find; entries. Returns: entries using find using a callback.

### src/room-editor.js:10

@function room-editor.callback.10 — Returns v e id equals selected. Inputs: v. Returns: v e id equals selected.

### src/room-editor.js:11

@function room-editor.fillSelection.11 — Handles fill selection within room editor. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "roomElementName" value; i closest using "label" hidden; i value; $ using "roomElementColor" closest using "label" hidden; $ using "roomElementColor" value. Uses: chosen; $; i closest; $ using "roomElementColor" closest.

### src/room-editor.js:12

@function room-editor.arrival.12 — Handles arrival within room editor. Inputs: id. Updates: $ using "roomArrival" value. Uses: api maps using find; api maps; $ using "roomArrival" replace children; $.

### src/room-editor.js:12

@function room-editor.callback.13 — Returns m id equals $ using "roomDestination" value. Inputs: m. Uses: $. Returns: m id equals $ using "roomDestination" value.

### src/room-editor.js:12

@function room-editor.callback.14 — Returns a new option. Inputs: e. Returns: a new option.

### src/room-editor.js:13

@function room-editor.refresh.15 — Handles refresh within room editor. Inputs: no explicit arguments; uses enclosing module state. Updates: dirty; $ using "roomCharacterPixels" value; $ using "roomScaleReadout" text content; $ using id value; $ using "roomMode" value. Uses: room; $; $ using "roomSelection" replace children; entries using map.

### src/room-editor.js:13

@function room-editor.callback.16 — Returns a new option. Inputs: object pattern. Returns: a new option.

### src/room-editor.js:13

@function room-editor.callback.17 — Returns a new option. Inputs: m. Returns: a new option.

### src/room-editor.js:14

@function room-editor.onchange.18 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: selected; dirty. Uses: $; fill selection.

### src/room-editor.js:14

@function room-editor.onchange.19 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: arrival. Returns: arrival using .

### src/room-editor.js:15

@function room-editor.onclick.20 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback.

### src/room-editor.js:15

@function room-editor.callback.21 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: w interior; w interior mode; w terrain; w water. Uses: api world; $; structured clone; frontier terrain validate. Returns: without a result.

### src/room-editor.js:16

@function room-editor.oninput.22 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "roomScaleReadout" text content; dirty. Uses: $.

### src/room-editor.js:16

@function room-editor.onclick.23 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback.

### src/room-editor.js:16

@function room-editor.callback.24 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: room using camera height scale. Uses: room; error; number; $.

### src/room-editor.js:17

@function room-editor.onclick.25 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback.

### src/room-editor.js:17

@function room-editor.callback.26 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: room using camera. Uses: room; error; object from entries; keys map.

### src/room-editor.js:17

@function room-editor.callback.27 — Returns a list of k, number using $ using "roomCam-" plus k value. Inputs: k. Uses: number; $. Returns: a list of k, number using $ using "roomCam-" plus k value.

### src/room-editor.js:18

@function room-editor.readImage.28 — Handles read image within room editor. Inputs: file. Uses: error. Returns: await.

### src/room-editor.js:18

@function room-editor.callback.29 — Provides the callback for the enclosing room editor operation. Inputs: resolve; reject. Updates: r onload; r onerror. Uses: r read as data url.

### src/room-editor.js:18

@function room-editor.onload.30 — Processes a resource after it finishes loading. Inputs: no explicit arguments; uses enclosing module state. Updates: im onload; im onerror; im src.

### src/room-editor.js:18

@function room-editor.onload.31 — Processes a resource after it finishes loading. Inputs: no explicit arguments; uses enclosing module state. Uses: resolve; reject; error. Returns: im width is at most 4096 and im height is at most 4096 selects resolve using a record containing src, width, height or reject using error using "Image must be at most 4096 pixels per side.".

### src/room-editor.js:18

@function room-editor.onerror.32 — Returns reject using error using "Cannot decode image.". Inputs: no explicit arguments; uses enclosing module state. Uses: reject; error. Returns: reject using error using "Cannot decode image.".

### src/room-editor.js:19

@function room-editor.onchange.33 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "roomImage" value. Uses: read image; $; api mutate; api log.

### src/room-editor.js:19

@function room-editor.callback.34 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: room using image; room using image width; room using image height. Uses: room; error.

### src/room-editor.js:20

@function room-editor.onchange.35 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "roomNormalImage" value. Uses: read image; $; api mutate; api log.

### src/room-editor.js:20

@function room-editor.callback.36 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: v e normal; room using normal. Uses: room; error; chosen.

### src/room-editor.js:21

@function room-editor.onclick.37 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback.

### src/room-editor.js:21

@function room-editor.callback.38 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: room using light. Uses: room; error; number; $.

### src/room-editor.js:22

@function room-editor.onchange.39 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: sprite; $ using "roomSpriteImage" value. Uses: read image; $; api log.

### src/room-editor.js:23

@function room-editor.onclick.40 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback.

### src/room-editor.js:23

@function room-editor.callback.41 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: v e name; v e at k; v e color; v e map; v e entrance. Uses: chosen; error; $ using "roomElementName" value trim; $.

### src/room-editor.js:24

@function room-editor.onclick.42 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: chosen; api mutate.

### src/room-editor.js:24

@function room-editor.callback.43 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: r at v key; selected. Uses: travel; room; r at v key filter.

### src/room-editor.js:24

@function room-editor.callback.44 — Returns e id does not equal selected. Inputs: e. Returns: e id does not equal selected.

### src/room-editor.js:25

@function room-editor.transform.45 — Handles transform within room editor. Inputs: no explicit arguments; uses enclosing module state. Updates: cam fit; cam ox; cam oy. Uses: api world; room; frontier interior camera. Returns: a record containing to, from, cam; a record containing to, from.

### src/room-editor.js:25

@function room-editor.to.46 — Returns frontier interior project using cam, p at 0, p at 1. Inputs: p. Uses: frontier interior project. Returns: frontier interior project using cam, p at 0, p at 1.

### src/room-editor.js:25

@function room-editor.from.47 — Returns frontier interior ground point using cam, x, y. Inputs: x; y. Uses: frontier interior ground point. Returns: frontier interior ground point using cam, x, y.

### src/room-editor.js:25

@function room-editor.to.48 — Returns a record containing x, y. Inputs: p. Returns: a record containing x, y.

### src/room-editor.js:25

@function room-editor.from.49 — Returns a record containing x, y. Inputs: x; y. Returns: a record containing x, y.

### src/room-editor.js:26

@function room-editor.point.50 — Handles point within room editor. Inputs: ev. Uses: canvas get bounding client rect; transform using from; transform; api world. Returns: a record containing x, y.

### src/room-editor.js:27

@function room-editor.onpointerdown.51 — Begins the pointer-driven interaction. Inputs: ev. Updates: dirty; best; target; drag; selected. Uses: point; $; draft push; transform. Returns: without a result; without a result.

### src/room-editor.js:28

@function room-editor.onpointermove.52 — Updates the active pointer-driven interaction. Inputs: ev. Updates: drag last; dirty. Uses: point.

### src/room-editor.js:29

@function room-editor.onpointerup.53 — Handles onpointerup within room editor. Inputs: no explicit arguments; uses enclosing module state. Updates: drag. Uses: api mutate. Returns: without a result.

### src/room-editor.js:29

@function room-editor.callback.54 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: room using floor at d floor; e x; e y; w spawn; w travel. Uses: api world; room; entries using find; entries. Returns: without a result; without a result.

### src/room-editor.js:29

@function room-editor.callback.55 — Returns v e id equals d id. Inputs: v. Returns: v e id equals d id.

### src/room-editor.js:30

@function room-editor.onpointercancel.56 — Cancels the active pointer-driven interaction. Inputs: no explicit arguments; uses enclosing module state. Updates: drag; dirty.

### src/room-editor.js:30

@function room-editor.onclick.57 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: draft; dirty. Uses: api log; api mutate. Returns: without a result.

### src/room-editor.js:30

@function room-editor.callback.58 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: room using floor. Uses: room; error; draft map.

### src/room-editor.js:30

@function room-editor.callback.59 — Returns a list of spread element. Inputs: p. Returns: a list of spread element.

### src/room-editor.js:30

@function room-editor.onclick.60 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: draft; drag; dirty.

### src/room-editor.js:31

@function room-editor.draw.61 — Draws this system’s current state into the supplied rendering context. Inputs: no explicit arguments; uses enclosing module state. Updates: dirty; ctx fill style; ctx font; ctx stroke style; ctx line width. Uses: api editing; box class list contains; transform; room. Returns: without a result; without a result.

### src/room-editor.js:31

@function room-editor.line.62 — Handles line within room editor. Inputs: points; color; assignment pattern. Updates: ctx stroke style; ctx line width; ctx fill style. Uses: ctx begin path; points entries; t to; ctx at i selects "lineTo" or "moveTo".

### src/save.js:8

@function save.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier save.

### src/save.js:11

@function save.validate.2 — Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields. Inputs: save. Updates: magazines at id; result at key; result project; result journey; result journal. Uses: error; root frontier world validate; root phanicom abs weapons has; number is finite. Returns: result.

### src/save.js:45

@function save.callback.3 — Provides the callback for save journey map. Inputs: entry. Uses: array is array; seen has; error; seen add. Returns: a list of entry at 0, a record containing copied fields, copied fields, replacements, copied fields, copied fields, copied fields, copied fields, player.

### src/save.js:45

@function save.callback.4 — Returns m id equals entry at 0. Inputs: m. Returns: m id equals entry at 0.

### src/save.js:45

@function save.callback.5 — Provides the callback for m world events map. Inputs: event. Uses: replacements find; result project templates entries find. Returns: reference selects a record containing copied fields, pages or event.

### src/save.js:45

@function save.callback.6 — Returns r id equals event id. Inputs: r. Returns: r id equals event id.

### src/save.js:45

@function save.callback.7 — Returns t id equals reference template. Inputs: t. Returns: t id equals reference template.

### src/save.js:45

@function save.callback.8 — Returns a record containing id, x, y, hp, dead, gibbed. Inputs: a. Returns: a record containing id, x, y, hp, dead, gibbed.

### src/save.js:45

@function save.callback.9 — Returns a record containing id, x, y. Inputs: a. Returns: a record containing id, x, y.

### src/save.js:45

@function save.callback.10 — Provides the callback for save journal map. Inputs: e. Uses: array is array; error. Returns: a list of spread element.

### src/scene-transition.js:4

@function scene-transition.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier scene transition.

### src/scene-transition.js:5

@function scene-transition.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: object pattern. Returns: a record containing reserve, update, busy, debug.

### src/scene-transition.js:5

@function scene-transition.record.3 — Handles record within scene transition. Inputs: action. Uses: trace push; trace shift.

### src/scene-transition.js:6

@function scene-transition.reserve1517 — Inputs: transfer job with validated fade/style and optional door config. Reserves one transfer, prepares presentation before commit, downgrades missing door assets to reported fade. Returns nothing; throws concurrent/invalid jobs. October 9 extends prior fade/melt contract.

### src/scene-transition.js:7

@function scene-transition.update.5 — Advances this system using the current state and elapsed time. Inputs: dt. Updates: phase; job; elapsed. Uses: number is finite; error; commit; record. Returns: false; true.

### src/scene-transition.js:14

@function scene-transition.skip1517 — Inputs: none. Completes any reserved presentation, committing only if not already committed. Returns false when idle; true when skipped. Clears overlay before continuation; failures retain diagnostics and never re-commit automatically.

### src/scene-transition.js:15

@function scene-transition.busy.6 — Handles busy within scene transition. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of the inverse of job.

### src/scene-transition.js:15

@function scene-transition.debug.7 — Returns a record containing phase, elapsed, trace. Inputs: no explicit arguments; uses enclosing module state. Uses: trace map. Returns: a record containing phase, elapsed, trace.

### src/scene-transition.js:15

@function scene-transition.callback.8 — Returns a record containing copied fields. Inputs: e. Returns: a record containing copied fields.

### src/screen-fade.js:4

@function screen-fade.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier screen fade.

### src/screen-fade.js:4

@function screen-fade.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: s. Uses: a list of "opacity", "from", "to" some; number is finite; a list of 0, 0.4 includes; error. Returns: a record containing opacity, from, to, elapsed, duration.

### src/screen-fade.js:4

@function screen-fade.callback.3 — Returns the inverse of number is finite using s at k or s at k is less than 0 or s at k is greater than 1. Inputs: k. Uses: number is finite. Returns: the inverse of number is finite using s at k or s at k is less than 0 or s at k is greater than 1.

### src/screen-fade.js:4

@function screen-fade.create.4 — Builds a new instance and its public operations from the supplied configuration. Inputs: render. Returns: a record containing start, update, capture, restore, reset.

### src/screen-fade.js:4

@function screen-fade.start.5 — Handles start within screen fade. Inputs: out. Updates: from; to; elapsed; duration.

### src/screen-fade.js:4

@function screen-fade.update.6 — Advances this system using the current state and elapsed time. Inputs: dt. Updates: elapsed; opacity; duration. Uses: number is finite; error; render.

### src/screen-fade.js:4

@function screen-fade.capture.7 — Handles capture within screen fade. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing opacity, from, to, elapsed, duration.

### src/screen-fade.js:4

@function screen-fade.restore.8 — Applies saved state to this system. Inputs: s. Updates: s; object pattern. Uses: validate; render.

### src/screen-fade.js:4

@function screen-fade.reset.9 — Handles reset within screen fade. Inputs: no explicit arguments; uses enclosing module state. Updates: opacity; from; to; elapsed; duration. Uses: render.

### src/screen-flash.js:4

@function screen-flash.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier screen flash.

### src/screen-flash.js:5

@function screen-flash.color.2 — Handles color within screen flash. Inputs: value. Uses: array is array; value some; error. Returns: a list of spread element.

### src/screen-flash.js:5

@function screen-flash.callback.3 — Returns the inverse of number is integer using v or v is less than 0 or v is greater than 255. Inputs: v. Uses: number is integer. Returns: the inverse of number is integer using v or v is less than 0 or v is greater than 255.

### src/screen-flash.js:6

@function screen-flash.validate.4 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: s. Uses: number is finite; error; color. Returns: a record containing color, duration, elapsed.

### src/screen-flash.js:7

@function screen-flash.create.5 — Builds a new instance and its public operations from the supplied configuration. Inputs: render. Returns: a record containing start, update, capture, restore, reset.

### src/screen-flash.js:8

@function screen-flash.paint.6 — Handles paint within screen flash. Inputs: no explicit arguments; uses enclosing module state. Uses: render; state color slice.

### src/screen-flash.js:9

@function screen-flash.start.7 — Handles start within screen flash. Inputs: channels; frames. Updates: state. Uses: color; number is integer; error; paint.

### src/screen-flash.js:10

@function screen-flash.update.8 — Advances this system using the current state and elapsed time. Inputs: dt. Updates: state elapsed. Uses: number is finite; error; paint.

### src/screen-flash.js:11

@function screen-flash.capture.9 — Handles capture within screen flash. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using state.

### src/screen-flash.js:12

@function screen-flash.restore.10 — Applies saved state to this system. Inputs: value. Updates: state. Uses: validate; paint.

### src/screen-flash.js:13

@function screen-flash.reset.11 — Handles reset within screen flash. Inputs: no explicit arguments; uses enclosing module state. Updates: state. Uses: paint.

### src/screen-melt-overlay.js:3

@function screen-melt-overlay.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier screen melt overlay.

### src/screen-melt-overlay.js:4

@function screen-melt-overlay.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: object pattern. Returns: a record containing begin, update, end, debug.

### src/screen-melt-overlay.js:4

@function screen-melt-overlay.makeCanvas.3 — Returns document create element using "canvas". Inputs: no explicit arguments; uses enclosing module state. Uses: document create element. Returns: document create element using "canvas".

### src/screen-melt-overlay.js:6

@function screen-melt-overlay.end.4 — Handles end within screen melt overlay. Inputs: no explicit arguments; uses enclosing module state. Updates: canvas width; canvas height; old; overlay; model. Uses: overlay remove.

### src/screen-melt-overlay.js:7

@function screen-melt-overlay.draw.5 — Draws this system’s current state into the supplied rendering context. Inputs: no explicit arguments; uses enclosing module state. Uses: overlay get context; ctx clear rect; model strips; ctx draw image.

### src/screen-melt-overlay.js:8

@function screen-melt-overlay.begin.6 — Handles begin within screen melt overlay. Inputs: no explicit arguments; uses enclosing module state. Updates: model; old; overlay; canvas width; canvas height. Uses: error; root frontier screen melt create; make canvas; capture.

### src/screen-melt-overlay.js:9

@function screen-melt-overlay.update.7 — Advances this system using the current state and elapsed time. Inputs: dt. Uses: error; model advance; draw. Returns: done.

### src/screen-melt-overlay.js:9

@function screen-melt-overlay.debug.8 — Returns a record containing active, canvasBytes, model. Inputs: no explicit arguments; uses enclosing module state. Uses: model debug. Returns: a record containing active, canvasBytes, model.

### src/screen-melt.js:4

@function screen-melt.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier screen melt.

### src/screen-melt.js:4

@function screen-melt.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: width; height; assignment pattern. Updates: offsets at 0; offsets at i. Uses: number is integer; error; sample. Returns: a record containing advance, done, strips, debug.

### src/screen-melt.js:4

@function screen-melt.sample.3 — Handles sample within screen melt. Inputs: no explicit arguments; uses enclosing module state. Uses: random; number is finite; error. Returns: r.

### src/screen-melt.js:4

@function screen-melt.advance.4 — Handles advance within screen melt. Inputs: dt. Updates: pending; done; y; offsets at i. Uses: number is finite; error. Returns: true; done.

### src/screen-melt.js:4

@function screen-melt.done.5 — Handles done within screen melt. Inputs: no explicit arguments; uses enclosing module state. Returns: done.

### src/screen-melt.js:4

@function screen-melt.strips.6 — Returns array from using offsets, a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: array from. Returns: array from using offsets, a callback.

### src/screen-melt.js:4

@function screen-melt.callback.7 — Returns a record containing x, width, y. Inputs: y; i. Returns: a record containing x, width, y.

### src/screen-melt.js:4

@function screen-melt.debug.8 — Returns a record containing ticks, strips, done, bytes. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing ticks, strips, done, bytes.

### src/screen-shake.js:4

@function screen-shake.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier screen shake.

### src/screen-shake.js:5

@function screen-shake.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: s. Uses: number is integer; a list of - 1, 1 includes; number is finite; error. Returns: a record containing copied fields.

### src/screen-shake.js:6

@function screen-shake.create.3 — Builds a new instance and its public operations from the supplied configuration. Inputs: render. Returns: a record containing start, update, capture, restore, reset.

### src/screen-shake.js:7

@function screen-shake.paint.4 — Handles paint within screen shake. Inputs: no explicit arguments; uses enclosing module state. Uses: render.

### src/screen-shake.js:8

@function screen-shake.start.5 — Handles start within screen shake. Inputs: power; speed; frames. Uses: number is integer; error; object assign; paint.

### src/screen-shake.js:9

@function screen-shake.tick.6 — Handles tick within screen shake. Inputs: no explicit arguments; uses enclosing module state. Updates: state offset; state direction. Returns: without a result.

### src/screen-shake.js:10

@function screen-shake.update.7 — Advances this system using the current state and elapsed time. Inputs: dt. Updates: state fraction. Uses: number is finite; error; tick; paint.

### src/screen-shake.js:11

@function screen-shake.capture.8 — Handles capture within screen shake. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing copied fields.

### src/screen-shake.js:12

@function screen-shake.restore.9 — Applies saved state to this system. Inputs: value. Updates: state. Uses: validate; paint.

### src/screen-shake.js:13

@function screen-shake.reset.10 — Handles reset within screen shake. Inputs: no explicit arguments; uses enclosing module state. Updates: state. Uses: paint.

### src/screen-tone.js:4

@function screen-tone.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier screen tone.

### src/screen-tone.js:5

@function screen-tone.tone.2 — Handles tone within screen tone. Inputs: v; assignment pattern. Uses: array is array; v some; error. Returns: a list of spread element.

### src/screen-tone.js:5

@function screen-tone.callback.3 — Returns the inverse of number is finite using n or integer and the inverse of number is integer using n or n is less than i equals 3 selects 0 or - 255 or n is greater than 255. Inputs: n; i. Uses: number is finite; number is integer. Returns: the inverse of number is finite using n or integer and the inverse of number is integer using n or n is less than i equals 3 selects 0 or - 255 or n is greater than 255.

### src/screen-tone.js:6

@function screen-tone.validate.4 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: s. Uses: number is finite; error; tone. Returns: a record containing value, from, target, duration, elapsed.

### src/screen-tone.js:7

@function screen-tone.create.5 — Builds a new instance and its public operations from the supplied configuration. Inputs: render. Returns: a record containing start, update, capture, restore, reset.

### src/screen-tone.js:8

@function screen-tone.paint.6 — Handles paint within screen tone. Inputs: no explicit arguments; uses enclosing module state. Uses: render.

### src/screen-tone.js:9

@function screen-tone.start.7 — Handles start within screen tone. Inputs: value; frames. Updates: value; state. Uses: tone; number is integer; error; paint.

### src/screen-tone.js:10

@function screen-tone.update.8 — Advances this system using the current state and elapsed time. Inputs: dt. Updates: state elapsed; state value. Uses: number is finite; error; state from map; paint. Returns: without a result.

### src/screen-tone.js:10

@function screen-tone.callback.9 — Returns v plus state target at i minus v multiplied by t. Inputs: v; i. Returns: v plus state target at i minus v multiplied by t.

### src/screen-tone.js:11

@function screen-tone.capture.10 — Handles capture within screen tone. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using state.

### src/screen-tone.js:12

@function screen-tone.restore.11 — Applies saved state to this system. Inputs: value. Updates: state. Uses: validate; paint.

### src/screen-tone.js:13

@function screen-tone.reset.12 — Handles reset within screen tone. Inputs: no explicit arguments; uses enclosing module state. Updates: state. Uses: paint.

### src/se-audio.js:5

@function se-audio.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root phanicom se. Uses: root phanicom audio manifest or a list of map.

### src/se-audio.js:6

@function se-audio.callback.2 — Returns a list of a name, a file. Inputs: a. Returns: a list of a name, a file.

### src/se-audio.js:9

@function se-audio.play.3 — Resolve a manifest sound, reuse an available voice and apply global gain and pitch. Missing files return false. Inputs: name; assignment pattern; assignment pattern; assignment pattern; report; assignment pattern. Updates: voice; voice busy; voice group; audio onended; audio onerror. Uses: files get; error; pool find; pool push. Returns: false; false.

### src/se-audio.js:13

@function se-audio.callback.4 — Returns the inverse of v busy or v audio ended. Inputs: v. Returns: the inverse of v busy or v audio ended.

### src/se-audio.js:24

@function se-audio.onended.5 — Cleans up or advances audio state when playback finishes. Inputs: no explicit arguments; uses enclosing module state. Updates: voice busy.

### src/se-audio.js:25

@function se-audio.onerror.6 — Handles onerror within se audio. Inputs: no explicit arguments; uses enclosing module state. Updates: voice busy. Uses: report.

### src/se-audio.js:33

@function se-audio.callback.7 — Provides the callback for audio play using catch. Inputs: error. Updates: voice busy. Uses: report.

### src/se-audio.js:37

@function se-audio.has.8 — Returns files has using name. Inputs: name. Uses: files has. Returns: files has using name.

### src/se-audio.js:37

@function se-audio.beginFrame.9 — Handles begin frame within se audio. Inputs: no explicit arguments; uses enclosing module state. Uses: frame names clear.

### src/se-audio.js:37

@function se-audio.playEvent.10 — Handles play event within se audio. Inputs: sound; report; assignment pattern. Uses: number is integer; error; files has; frame names has. Returns: true; true.

### src/se-audio.js:44

@function se-audio.setUnlock.11 — Handles set unlock within se audio. Inputs: fn. Updates: unlock.

### src/se-audio.js:44

@function se-audio.previewEvent.12 — Handles preview event within se audio. Inputs: sound; report. Uses: this stop; unlock; context resume; this play event. Returns: this play event using sound, report, "preview".

### src/se-audio.js:44

@function se-audio.stopPreview.13 — Handles stop preview within se audio. Inputs: no explicit arguments; uses enclosing module state. Uses: this stop.

### src/se-audio.js:44

@function se-audio.stop.14 — Handles stop within se audio. Inputs: group. Updates: voice busy; voice audio current time. Uses: frame names clear; voice audio pause.

### src/se-audio.js:44

@function se-audio.setVolume.15 — Handles set volume within se audio. Inputs: v. Updates: volume.

### src/se-audio.js:47

@function se-audio.setContext.16 — Handles set context within se audio. Inputs: ctx; master. Updates: pool length; context; output. Uses: this stop; voice source disconnect; voice gain disconnect; voice panner disconnect.

### src/se-audio.js:53

@function se-audio.context.17 — Handles context within se audio. Inputs: no explicit arguments; uses enclosing module state. Returns: context.

### src/se-audio.js:56

@function se-audio.voices.18 — Handles voices within se audio. Inputs: no explicit arguments; uses enclosing module state. Returns: pool length.

### src/se-audio.js:59

@function se-audio.debug.19 — Handles debug within se audio. Inputs: no explicit arguments; uses enclosing module state. Uses: pool filter using a callback map; pool filter. Returns: a record containing limit, voices, active.

### src/se-audio.js:59

@function se-audio.callback.20 — Returns v busy and the inverse of v audio ended. Inputs: v. Returns: v busy and the inverse of v audio ended.

### src/se-audio.js:59

@function se-audio.callback.21 — Returns a record containing group, pitch, pan, volume. Inputs: v. Returns: a record containing group, pitch, pan, volume.

### src/sky.js:5

@function sky.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier sky.

### src/sky.js:28

@function sky.validate.2 — Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields. Inputs: value. Uses: structured clone; array is array; error; value layers map. Returns: structured clone using defaults; a record containing enabled, layers.

### src/sky.js:33

@function sky.callback.3 — Provides the callback for value layers map. Inputs: l. Uses: ids has; a list of "ridge", "cloud" includes; /^#[0-9a-f]{6}$/i test; number is finite. Returns: a record containing id, kind, color, distance, height, parallax, speed.

### src/sky.js:45

@function sky.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: ctx; game; cam; project. Updates: ctx fog depth; ctx stroke style; ctx line width; previous. Uses: ctx save; project; ctx begin path; ctx move to. Returns: without a result.

### src/spatial.js:5

@function spatial.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf create projectile; mf update projectiles; mf resolve hitscan; mf frontier spatial.

### src/spatial.js:10

@function spatial.boxHit.2 — Intersect a swept segment with an expanded AABB using slab intervals. Return earliest normalized time or null. Inputs: a; b; box; radius. Updates: array pattern; enter; leave. Returns: null; null.

### src/spatial.js:27

@function spatial.between.3 — Returns a record containing x, y, z. Inputs: a; b; t. Returns: a record containing x, y, z.

### src/spatial.js:32

@function spatial.sweep.4 — Choose the nearest body/scenery/terrain collision; ignore the shooter and already penetrated entities. Inputs: game; a; b; radius; owner id; ignore ids. Updates: lo; hi. Uses: root frontier activity query using game, math min using a x, b x minus radius minus 2, math min using a y, b y minus radius minus 2 filter; root frontier activity query; game scene events or a list of filter; entities push. Returns: result.

### src/spatial.js:34

@function spatial.take.5 — Handles take within spatial. Inputs: t; id; kind. Updates: result.

### src/spatial.js:41

@function spatial.callback.6 — Returns the inverse of e event id or e solid or e combat. Inputs: e. Returns: the inverse of e event id or e solid or e combat.

### src/spatial.js:41

@function spatial.callback.7 — Returns e solid or e combat. Inputs: e. Returns: e solid or e combat.

### src/spatial.js:63

@function spatial.floor.8 — Handles floor within spatial. Inputs: t. Uses: between; frontier terrain height. Returns: p z minus frontier terrain height using game source world, p x, p y minus radius.

### src/spatial.js:100

@function spatial.createProjectile.9 — Handles create projectile within spatial. Inputs: game; owner; weapon; direction. Updates: target x; target y; target z; shot direction; shot position. Uses: original create; frontier render camera; root frontier muzzle point; between. Returns: shot.

### src/spatial.js:140

@function spatial.bounce.10 — Reflect against the impacted scenery face, add bounded random variation, and move outside the surface before continuing. Inputs: game; p; hit. Updates: v x; v y; v z; p direction; p velocity. Uses: a list of spread element, spread element find; a list of "monster", "npc", "player" includes; root frontier parameters get; faces sort. Returns: false; false.

### src/spatial.js:142

@function spatial.callback.11 — Returns e id equals hit id. Inputs: e. Returns: e id equals hit id.

### src/spatial.js:176

@function spatial.callback.12 — Returns a d minus b d. Inputs: a; b. Returns: a d minus b d.

### src/spatial.js:208

@function spatial.advance.13 — Move a projectile within remaining range/lifetime, resolve its first hit, and handle penetration or one scenery ricochet. Inputs: game; p; dt; ui; assignment pattern. Updates: p previous position; p position; p distance travelled; p age; p hit ids. Uses: sweep; between; game shot effects push; game shot effects shift. Returns: true; true.

### src/spatial.js:263

@function spatial.updateProjectiles.14 — Handles update projectiles within spatial. Inputs: game; dt; ui. Updates: game projectiles. Uses: game projectiles filter.

### src/spatial.js:264

@function spatial.callback.15 — Returns p map equals game current map id and advance using game, p, dt. Inputs: p. Uses: advance. Returns: p map equals game current map id and advance using game, p, dt.

### src/spatial.js:267

@function spatial.resolveHitscan.16 — Handles resolve hitscan within spatial. Inputs: game; p; ui. Uses: advance.

### src/sprite-lighting.js:4

@function sprite-lighting.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier sprite lighting.

### src/sprite-lighting.js:5

@function sprite-lighting.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: number is finite; error. Returns: s.

### src/sprite-lighting.js:6

@function sprite-lighting.prepare.3 — Handles prepare within sprite lighting. Inputs: art; normal; settings. Updates: i; out at i plus 3; out at i plus c. Uses: validate; number is integer; error. Returns: a record containing width, height, data.

### src/sprites.js:5

@function sprites.callback.1 — Provides the callback for a callback. Inputs: root. Updates: frontier candy id; frontier candy columns; frontier candy reference height; frontier candy unarmed columns; frontier candy unarmed reference height.

### src/sprites.js:13

@function sprites.sheet.2 — Choose unarmed/armed/player/NPC sheet metadata without changing movement or combat logic. Inputs: entity. Updates: image; image src. Uses: frontier muzzle profiles get; images get; images set. Returns: frontier candy unarmed; null.

### src/template-dialogs.js:4

@function template-dialogs.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier template dialogs.

### src/template-dialogs.js:5

@function template-dialogs.dialog.2 — Handles dialog within template dialogs. Inputs: title. Updates: d class name; d id; h text content. Uses: document create element; d set attribute; d append; document body append. Returns: d.

### src/template-dialogs.js:5

@function template-dialogs.callback.3 — Returns d remove using . Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using .

### src/template-dialogs.js:6

@function template-dialogs.field.4 — Handles field within template dialogs. Inputs: d; label; input. Updates: l text content. Uses: document create element; input set attribute; l append; d append. Returns: input.

### src/template-dialogs.js:7

@function template-dialogs.buttons.5 — Handles buttons within template dialogs. Inputs: d; accept. Updates: b type; b text content; b onclick. Uses: document create element; notice set attribute; footer append; d append.

### src/template-dialogs.js:7

@function template-dialogs.onclick.6 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: notice text content. Uses: d close; accept. Returns: without a result.

### src/template-dialogs.js:8

@function template-dialogs.save.7 — Handles save within template dialogs. Inputs: event; api; done. Updates: name max length; name value; note text content. Uses: dialog; field; document create element; d append.

### src/template-dialogs.js:8

@function template-dialogs.callback.8 — Provides the callback for buttons. Inputs: no explicit arguments; uses enclosing module state. Uses: api save template; done.

### src/template-dialogs.js:9

@function template-dialogs.replace.9 — Handles replace within template dialogs. Inputs: initial; context; done. Updates: target value; templates value; policy value; note text content. Uses: dialog; field; document create element; target append.

### src/template-dialogs.js:13

@function template-dialogs.callback.10 — Provides the callback for buttons. Inputs: no explicit arguments; uses enclosing module state. Uses: entries find; error; structured clone; root frontier event runtime validate.

### src/template-dialogs.js:13

@function template-dialogs.callback.11 — Returns e id equals templates value. Inputs: e. Returns: e id equals templates value.

### src/template-history.js:4

@function template-history.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier template history.

### src/template-history.js:5

@function template-history.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: assignment pattern. Uses: number is safe integer; error. Returns: a record containing push, undo, redo, clear, debug.

### src/template-history.js:8

@function template-history.size.3 — Returns a new text encoder encode using json stringify using entry length. Inputs: entry. Uses: a new text encoder encode; json stringify. Returns: a new text encoder encode using json stringify using entry length.

### src/template-history.js:9

@function template-history.trim.4 — Handles trim within template history. Inputs: no explicit arguments; uses enclosing module state. Updates: bytes. Uses: undo shift; redo shift.

### src/template-history.js:10

@function template-history.push.5 — Handles push within template history. Inputs: entry. Updates: bytes; redo. Uses: structured clone; size; undo push; trim.

### src/template-history.js:11

@function template-history.undo.6 — Handles undo within template history. Inputs: adopt. Uses: undo at; adopt; structured clone; undo pop. Returns: false; true.

### src/template-history.js:12

@function template-history.redo.7 — Handles redo within template history. Inputs: adopt. Uses: redo at; adopt; structured clone; redo pop. Returns: false; true.

### src/template-history.js:13

@function template-history.clear.8 — Handles clear within template history. Inputs: no explicit arguments; uses enclosing module state. Updates: undo; redo; bytes.

### src/template-history.js:13

@function template-history.debug.9 — Returns a record containing undo, redo, bytes, maxBytes, maxEntries. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing undo, redo, bytes, maxBytes, maxEntries.

### src/terrain-brush.js:4

@function terrain-brush.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier brush.

### src/terrain-brush.js:6

@function terrain-brush.paint.2 — Handles paint within terrain brush. Inputs: world; point; tool; radius; strength; target. Updates: world terrain edits; world water; snapshot at sx plus "," plus sy; water cells at k; sum. Uses: root frontier water validate; root frontier terrain base height; root frontier water invalidate. Returns: touched.

### src/terrain-occlusion.js:3

@function terrain-occlusion.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier terrain occlusion.

### src/terrain-occlusion.js:5

@function terrain-occlusion.begin.2 — Handles begin within pixel visibility against solid geometry. Inputs: ctx; width; height. Updates: d; ctx terrain depth cache; ctx terrain depth. Uses: d values fill. Returns: d.

### src/terrain-occlusion.js:6

@function terrain-occlusion.triangle.3 — Rasterizes or processes one triangle for this module. Inputs: d; p. Updates: d values at k. Returns: without a result.

### src/terrain-occlusion.js:7

@function terrain-occlusion.mask.4 — Builds visible screen regions by comparing sprite depth with the existing geometry depth buffer. Inputs: d; rect; depth. Updates: start; previous width. Uses: inverse at; runs get; regions push; runs set. Returns: rect; a record containing copied fields, regions.

### src/terrain-occlusion.js:8

@function terrain-occlusion.inverseAt.5 — Returns 1 divided by math max using 0.13, typeof depth equals "function" selects depth using y or depth. Inputs: y. Uses: depth. Returns: 1 divided by math max using 0.13, typeof depth equals "function" selects depth using y or depth.

### src/terrain.js:5

@function terrain.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier terrain.

### src/terrain.js:8

@function terrain.validate.2 — Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields. Inputs: value. Uses: a list of "flat", "hills", "random" includes; number is finite; error; validate edits. Returns: a record containing mode, amplitude, frequency; a record containing mode, amplitude, frequency, edits, revision.

### src/terrain.js:21

@function terrain.baseHeight.3 — Calculates deterministic terrain elevation before authored edits. Inputs: world; x; y. Updates: hash; phase; blend. Uses: phases get; c char code at; phases set; hill. Returns: 0; t amplitude multiplied by math sin using x multiplied by t frequency plus phase multiplied by math cos using y multiplied by t frequency minus phase multiplied by 0.65 plus math sin using x plus y multiplied by t frequency multiplied by 0.53 plus phase multiplied by 0.35.

### src/terrain.js:28

@function terrain.hill.4 — Returns math exp using - x minus cx raised to 2 plus y minus cy raised to 2 divided by radius raised to 2. Inputs: cx; cy; radius. Returns: math exp using - x minus cx raised to 2 plus y minus cy raised to 2 divided by radius raised to 2.

### src/terrain.js:32

@function terrain.validateEdits.5 — Edits are limited and validated independently from terrain generation settings. Inputs: assignment pattern. Updates: out at k. Uses: array is array; error; object keys; object entries. Returns: out.

### src/terrain.js:33

@function terrain.height.6 — Samples the world’s terrain elevation, including authored edits. Inputs: world; x; y. Uses: base height; at. Returns: base height using world, x, y; base height using world, x, y plus at using 0, 0 multiplied by 1 minus fx plus at using 1, 0 multiplied by fx multiplied by 1 minus fy plus at using 0, 1 multiplied by 1 minus fx plus at using 1, 1 multiplied by fx multiplied by fy.

### src/terrain.js:33

@function terrain.at.7 — Returns edits at ix plus dx plus "," plus iy plus dy or 0. Inputs: dx; dy. Returns: edits at ix plus dx plus "," plus iy plus dy or 0.

### src/terrain.js:35

@function terrain.jump.8 — Start a jump only when alive and grounded; vertical velocity and gravity determine clearance. Inputs: player; world. Updates: player grounded; player vertical velocity. Uses: root frontier parameters get. Returns: true; false.

### src/terrain.js:44

@function terrain.ground.9 — Integrate vertical movement, choose support height, and clamp landing to terrain or reachable object tops. Inputs: player; world; dt; assignment pattern; assignment pattern. Updates: floor; player ground z; player grounded; player vertical velocity; player z. Uses: height; root frontier parameters get; root frontier model collision support; root frontier model collision vertical. Returns: without a result.

### src/terrain.js:80

@function terrain.blocked.10 — Test world bounds and solid footprints for NPC/editor movement. Player step/jump collision is handled by terrain.js. Inputs: game; x; y; assignment pattern. Updates: game player step; step z; x; y. Uses: root frontier model collision blocked; root frontier model collision step; root frontier interior blocked; height. Returns: true; true.

### src/terrain.js:88

@function terrain.callback.11 — Returns e solid. Inputs: e. Returns: e solid.

### src/terrain.js:88

@function terrain.callback.12 — Provides the callback for root frontier activity selects root frontier activity query using game, x minus 2, y minus 2 or a list of spread element, spread element some. Inputs: e. Returns: false; false.

### src/transfer-player.js:7

@function transfer-player.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier transfer player.

### src/transfer-player.js:8

@function transfer-player.integer.2 — Returns number is integer using v and v is at least min and v is at most max. Inputs: v; min; max. Uses: number is integer. Returns: number is integer using v and v is at least min and v is at most max.

### src/transfer-player.js:9

@function transfer-player.validate.3 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: parameters. Uses: structured clone; array is array; integer; a list of 0, 2, 4, 6 includes. Returns: p.

### src/transfer-player.js:10

@function transfer-player.callback.4 — Returns number is finite using v and v is at least 0 and v is at most 999999. Inputs: v. Uses: number is finite. Returns: number is finite using v and v is at least 0 and v is at most 999999.

### src/transfer-player.js:12

@function transfer-player.resolve.5 — Handles resolve within transfer player. Inputs: parameters; object pattern. Uses: validate; read; integer; error. Returns: a record containing map, mapNumber, entry, direction, fade.

### src/transfer-player.js:12

@function transfer-player.read.6 — Returns chain or the fallback 0. Inputs: id. Uses: variables get; string. Returns: chain or the fallback 0.

### src/vector-display.js:3

@function vector-display.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier vector. Uses: object freeze.

### src/vector-display.js:6

@function vector-display.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: a list of "original", "phosphor", "outline" includes; error; /^#[0-9a-f]{6}$/i test; number is finite. Returns: a record containing copied fields, color.

### src/vector-display.js:9

@function vector-display.paths.3 — Handles paths within vector display. Inputs: path; v. Updates: x; y; start. Uses: result push; line. Returns: path; result.

### src/vector-display.js:10

@function vector-display.line.4 — Handles line within vector display. Inputs: nx; ny. Updates: x; y. Uses: result push.

### src/water.js:4

@function water.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier water.

### src/water.js:11

@function water.validate.2 — Validate authored material/cells and reject malformed or oversized assets. Inputs: assignment pattern. Uses: array is array; error; number is finite; /^#[0-9a-f]{6}$/i test. Returns: a record containing copied fields, copied fields, cells.

### src/water.js:27

@function water.level.3 — Fast point lookup used for sprite waterline clipping. Inputs: world; x; y. Uses: surface index using world rim get; surface index. Returns: z does not equal undefined selects z or surface index using world rim get using key.

### src/water.js:34

@function water.surfaceIndex.4 — wet/dry neighbors qualify: this does not flood unpainted flat countryside. Inputs: world. Updates: wet; index. Uses: regions get; object entries using cells map; object entries; key split using "," map. Returns: index; index.

### src/water.js:40

@function water.callback.5 — Returns a record containing key, z. Inputs: array pattern. Returns: a record containing key, z.

### src/water.js:49

@function water.add.6 — Handles add within water. Inputs: key; z. Uses: key split using "," map; key split; buckets has; buckets set.

### src/water.js:55

@function water.nearClip.7 — their world coordinates when a water triangle crosses the near plane. Inputs: cam; coords; z. Uses: depth; out push. Returns: out.

### src/water.js:56

@function water.depth.8 — Returns p at 0 minus cam x multiplied by math sin using cam yaw plus p at 1 minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus z minus cam z multiplied by math sin using cam pitch. Inputs: p. Returns: p at 0 minus cam x multiplied by math sin using cam yaw plus p at 1 minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus z minus cam z multiplied by math sin using cam pitch.

### src/water.js:60

@function water.geometry.9 — Quarter-unit triangulation follows the sampled height field, including islands. Inputs: world; x; y; z. Updates: cache. Uses: shorelines get; shorelines set; cache tiles has; cache tiles get. Returns: cache tiles get using key; full.

### src/water.js:65

@function water.callback.10 — Returns p at 2 is less than z. Inputs: p. Returns: p at 2 is less than z.

### src/water.js:66

@function water.cut.11 — Handles cut within water. Inputs: poly. Uses: out push; triangles push; a list of out at 0, out at i, out at i plus 1 map.

### src/water.js:66

@function water.callback.12 — Returns a list of p at 0, p at 1. Inputs: p. Returns: a list of p at 0, p at 1.

### src/water.js:67

@function water.sample.13 — Returns samples at b multiplied by n plus 1 plus a. Inputs: a; b. Returns: samples at b multiplied by n plus 1 plus a.

### src/water.js:70

@function water.submerged.14 — Handles submerged within water. Inputs: world; cam; subject. Uses: level; root frontier terrain height. Returns: cam z is less than z; true.

### src/water.js:74

@function water.obscures.15 — Handles obscures within water. Inputs: world; cam; x; y; feet. Uses: level; root frontier terrain height. Returns: z does not equal undefined and root frontier terrain height using world, x, y is less than z and z is greater than feet and the inverse of cam underwater and cam z is at least z.

### src/water.js:77

@function water.poolHeights.16 — its center: hill slopes must not leave a raised water platform. Inputs: world; cx; cy. Updates: bank. Uses: root frontier terrain height. Returns: a record containing surface, bottom.

### src/water.js:78

@function water.image.17 — Handles image within water. Inputs: name. Updates: img src. Uses: images has; images delete; images keys using next; images keys. Returns: null; img complete and img natural width selects img or null.

### src/water.js:86

@function water.draw.18 — Assemble only nearby surface tiles; retained GPU meshes supply UV animation. Inputs: ctx; game; cam; project. Updates: ctx vector display; ctx fog depth; ctx global alpha; ctx fill style. Uses: surface index; visible push; buckets get; performance now. Returns: without a result; without a result.

### src/water.js:94

@function water.callback.19 — Returns project using cam, spread element, z. Inputs: p. Uses: project. Returns: project using cam, spread element, z.

### src/water.js:94

@function water.callback.20 — Returns the inverse of p. Inputs: p. Returns: the inverse of p.

### src/water.js:94

@function water.callback.21 — Returns p depth is greater than 45. Inputs: p. Returns: p depth is greater than 45.

### src/water.js:99

@function water.callback.22 — Returns ctx at i selects "lineTo" or "moveTo" using p x, p y. Inputs: p; i. Uses: ctx at i selects "lineTo" or "moveTo". Returns: ctx at i selects "lineTo" or "moveTo" using p x, p y.

### src/water.js:106

@function water.invalidate.23 — Handles invalidate within water. Inputs: world. Uses: regions delete; shorelines delete.

### src/weapon-tuning.js:3

@function weapon-tuning.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier weapon tuning.

### src/weapon-tuning.js:4

@function weapon-tuning.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: array is array; object keys; error; object entries. Returns: result.

### src/weapon-tuning.js:11

@function weapon-tuning.degrees.3 — Handles degrees within weapon tuning. Inputs: world; weapon. Returns: chain or the fallback weapon id equals "handgun" selects 0.5 or weapon spread radians or 0 multiplied by 180 divided by math pi.

### src/weapon-tuning.js:12

@function weapon-tuning.radians.4 — Returns degrees using world, weapon multiplied by math pi divided by 180. Inputs: world; weapon. Uses: degrees. Returns: degrees using world, weapon multiplied by math pi divided by 180.

### src/world.js:5

@function world.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier world.

### src/world.js:8

@function world.dimensions.2 — Legacy square maps use size; new maps store explicit rectangular bounds. Inputs: w. Uses: number is integer; error. Returns: a record containing width, height.

### src/world.js:9

@function world.activitySettings.3 — Handles activity settings within world. Inputs: assignment pattern. Uses: number is finite; error. Returns: r.

### src/world.js:12

@function world.rng.4 — Hash the seed and return a deterministic random stream. Keep generator order stable if old seeds must reproduce worlds. Inputs: seed. Updates: s. Uses: string; c char code at. Returns: a callback.

### src/world.js:15

@function world.callback.5 — Provides the callback for the enclosing world operation. Inputs: no explicit arguments; uses enclosing module state. Updates: s; t. Returns: t ^ t >>> 14 >>> 0 divided by 4294967296.

### src/world.js:24

@function world.entity.6 — Instantiate a prop using canonical project definitions; imported values cannot override tuned collision dimensions. Inputs: kind; x; y; id. Returns: a record containing id, kind, x, y, radius, height.

### src/world.js:32

@function world.generate.7 — Scatter seeded props with clearance around spawn, then create a ring of demonstration enemies. Inputs: seed; assignment pattern; assignment pattern. Updates: world objects. Uses: dimensions; rng; string; random. Returns: world.

### src/world.js:42

@function world.candidates.8 — Handles candidates within world. Inputs: x; y. Uses: out push; buckets get. Returns: out.

### src/world.js:49

@function world.callback.9 — Returns math hypot using e x minus x, e y minus y is less than e radius plus 1. Inputs: e. Returns: math hypot using e x minus x, e y minus y is less than e radius plus 1.

### src/world.js:56

@function world.callback.10 — Returns math hypot using e x minus x, e y minus y is greater than 1.5. Inputs: e. Returns: math hypot using e x minus x, e y minus y is greater than 1.5.

### src/world.js:62

@function world.validate.11 — Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields. Inputs: w. Updates: result events; result prefabs; result interior; result travel; result cerebral. Uses: number is integer; array is array; error; dimensions. Returns: result.

### src/world.js:67

@function world.inside.12 — Returns p and number is finite using p x and number is finite using p y and p x is at least 1 and p y is at least 1 and p x is at most width minus 1 and p y is at most height minus 1. Inputs: p. Uses: number is finite. Returns: p and number is finite using p x and number is finite using p y and p x is at least 1 and p y is at least 1 and p x is at most width minus 1 and p y is at most height minus 1.

### src/world.js:73

@function world.callback.13 — Provides the callback for w objects map. Inputs: e. Uses: ids has; kinds includes; inside; error. Returns: a record containing copied fields, elevation, copied fields, copied fields, copied fields, copied fields, copied fields.

### src/world.js:83

@function world.callback.14 — Returns e elevation or 0 multiplied by 0.3 is less than 1.65 and e elevation or 0 multiplied by 0.3 plus e height is greater than 0 and math hypot using e x minus result spawn x, e y minus result spawn y is less than e radius plus 0.3. Inputs: e. Returns: e elevation or 0 multiplied by 0.3 is less than 1.65 and e elevation or 0 multiplied by 0.3 plus e height is greater than 0 and math hypot using e x minus result spawn x, e y minus result spawn y is less than e radius plus 0.3.

### src/world.js:84

@function world.callback.15 — Returns e id. Inputs: e. Returns: e id.

### src/world.js:85

@function world.callback.16 — Returns e elevation or 0 multiplied by 0.3 is less than 1.65 and e elevation or 0 multiplied by 0.3 plus 1.65 is greater than 0 and e pages some using a callback and math hypot using e x minus result spawn x, e y minus result spawn y is less than 0.55. Inputs: e. Uses: e pages some. Returns: e elevation or 0 multiplied by 0.3 is less than 1.65 and e elevation or 0 multiplied by 0.3 plus 1.65 is greater than 0 and e pages some using a callback and math hypot using e x minus result spawn x, e y minus result spawn y is less than 0.55.

### src/world.js:85

@function world.callback.17 — Returns p solid and the inverse of p through and p priority equals "normal". Inputs: p. Returns: p solid and the inverse of p through and p priority equals "normal".

### src/world.js:86

@function world.callback.18 — Provides the callback for w prefabs map. Inputs: t. Uses: seen has; kinds includes; error; seen add. Returns: a record containing id, name, kind, copied fields, copied fields.

### src/world.js:105

@function world.callback.19 — Returns typeof n does not equal "string" or n includes using ".." or /[\\/:]/ test using n or the inverse of /^.+\.(ogg|mp3|wav|m4a|webm)$/i test using n. Inputs: n. Uses: n includes; /[\\/:]/ test; /^.+\.(ogg|mp3|wav|m4a|webm)$/i test. Returns: typeof n does not equal "string" or n includes using ".." or /[\\/:]/ test using n or the inverse of /^.+\.(ogg|mp3|wav|m4a|webm)$/i test using n.

### js/plugins/Phanicom_ActiveCombat.Core.js:6

@function Phanicom_ActiveCombat.Core.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root phanicom combat core. Uses: number; parse struct array using params weapon profiles map using compile weapon profile filter; parse struct array using params weapon profiles map; parse struct array.

### js/plugins/Phanicom_ActiveCombat.Core.js:17

@function Phanicom_ActiveCombat.Core.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### js/plugins/Phanicom_ActiveCombat.Core.js:21

@function Phanicom_ActiveCombat.Core.leader.3 — Returns a record containing actorId. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing actorId.

### js/plugins/Phanicom_ActiveCombat.Core.js:22

@function Phanicom_ActiveCombat.Core.actorId.4 — Returns 1. Inputs: no explicit arguments; uses enclosing module state. Returns: 1.

### js/plugins/Phanicom_ActiveCombat.Core.js:27

@function Phanicom_ActiveCombat.Core.currentActorMuzzleProfile.5 — Returns null. Inputs: no explicit arguments; uses enclosing module state. Returns: null.

### js/plugins/Phanicom_ActiveCombat.Core.js:27

@function Phanicom_ActiveCombat.Core.actorWeaponCalibration.6 — Returns null. Inputs: no explicit arguments; uses enclosing module state. Returns: null.

### js/plugins/Phanicom_ActiveCombat.Core.js:27

@function Phanicom_ActiveCombat.Core.playerFiringCalibration.7 — Returns null. Inputs: no explicit arguments; uses enclosing module state. Returns: null.

### js/plugins/Phanicom_ActiveCombat.Core.js:27

@function Phanicom_ActiveCombat.Core.enemyFiringCalibration.8 — Returns null. Inputs: no explicit arguments; uses enclosing module state. Returns: null.

### js/plugins/Phanicom_ActiveCombat.Core.js:28

@function Phanicom_ActiveCombat.Core.clamp.9 — Handles clamp within phanicom active combat.core. Inputs: v; lo; hi. Returns: math max using lo, math min using hi, v.

### js/plugins/Phanicom_ActiveCombat.Core.js:32

@function Phanicom_ActiveCombat.Core.parseAttributePairs.10 — Read key/value text without evaluating it; quotes permit names containing spaces. Inputs: text. Updates: m; out at m at 1. Uses: re exec; string; m at 2 replace. Returns: out.

### js/plugins/Phanicom_ActiveCombat.Core.js:44

@function Phanicom_ActiveCombat.Core.parseLegacyKeyValueBlock.11 — Read old multiline note tags so existing weapon authoring remains compatible. Inputs: text; tag name. Updates: out at line slice using 0, eq trim using . Uses: string using text or "" match; string; m at 1 split; raw trim. Returns: null; out.

### js/plugins/Phanicom_ActiveCombat.Core.js:61

@function Phanicom_ActiveCombat.Core.parseTagOptions.12 — Read modern note-tag options and fall back to legacy block syntax. Inputs: note; tag name. Updates: m; found. Uses: string; re exec; object assign; parse attribute pairs. Returns: found selects merged or null.

### js/plugins/Phanicom_ActiveCombat.Core.js:89

@function Phanicom_ActiveCombat.Core.parseWeaponNote.13 — Extract weapon tag options from the supplied MZ note format. Inputs: text. Uses: string; note match; parse attribute pairs; object keys. Returns: attrs; parse legacy key value block using note, "PhanicomABSWeapon".

### js/plugins/Phanicom_ActiveCombat.Core.js:99

@function Phanicom_ActiveCombat.Core.num.14 — Read a finite numeric option or use its configured fallback. Inputs: obj; key; fallback. Uses: number; number is finite. Returns: number is finite using n selects n or fallback.

### js/plugins/Phanicom_ActiveCombat.Core.js:104

@function Phanicom_ActiveCombat.Core.int.15 — Read a numeric option and truncate to an integer. Inputs: obj; key; fallback. Uses: num. Returns: math trunc using num using obj, key, fallback.

### js/plugins/Phanicom_ActiveCombat.Core.js:108

@function Phanicom_ActiveCombat.Core.str.16 — Read a textual option or default. Inputs: obj; key; fallback. Uses: string. Returns: value equals undefined or value equals null or value equals "" selects fallback or string using value.

### js/plugins/Phanicom_ActiveCombat.Core.js:113

@function Phanicom_ActiveCombat.Core.parseOffsetPair.17 — Parse a muzzle pixel offset pair from authored note text. Inputs: text. Uses: string using text or "" trim using match; string using text or "" trim; string; number. Returns: m selects a record containing x, y or null.

### js/plugins/Phanicom_ActiveCombat.Core.js:121

@function Phanicom_ActiveCombat.Core.parseMuzzleSpec.18 — Parse per-direction muzzle offsets using original MZ direction IDs. Inputs: text. Updates: by direction at number using m at 1. Uses: string using text or "" trim; string; parse offset pair; raw split. Returns: a record containing shared, byDirection; object keys using by direction length selects a record containing shared, byDirection or a record containing shared, byDirection.

### js/plugins/Phanicom_ActiveCombat.Core.js:153

@function Phanicom_ActiveCombat.Core.muzzleForDirection.19 — Look up a directional muzzle entry with the original fallback rules. Inputs: spec; dir. Uses: number. Returns: a record containing x, y; chain or spec shared or a record containing x, y.

### js/plugins/Phanicom_ActiveCombat.Core.js:164

@function Phanicom_ActiveCombat.Core.parseStructArray.20 — Decode MZ plugin struct arrays, whose entries may themselves be JSON strings. Inputs: raw. Uses: json parse; array is array; outer map using a callback filter; outer map. Returns: a list of ; a list of .

### js/plugins/Phanicom_ActiveCombat.Core.js:169

@function Phanicom_ActiveCombat.Core.callback.21 — Provides the callback for outer map. Inputs: entry. Uses: json parse; string. Returns: entry; json parse using string using entry or "{}".

### js/plugins/Phanicom_ActiveCombat.Core.js:185

@function Phanicom_ActiveCombat.Core.profileKey.22 — Canonicalize profile names for ID/display-name lookup. Inputs: value. Uses: string using value or "" trim using to lower case using replace using /[^a-z0-9]+/g, "_" replace; string using value or "" trim using to lower case using replace; string using value or "" trim using to lower case; string using value or "" trim. Returns: string using value or "" trim using to lower case using replace using /[^a-z0-9]+/g, "_" replace using /^_+|_+$/g, "".

### js/plugins/Phanicom_ActiveCombat.Core.js:189

@function Phanicom_ActiveCombat.Core.profileMuzzleSpec.23 — Build directional muzzle metadata from a weapon profile. Inputs: raw. Updates: by direction at dir. Uses: number; number is finite. Returns: a record containing shared, byDirection.

### js/plugins/Phanicom_ActiveCombat.Core.js:211

@function Phanicom_ActiveCombat.Core.profileAimSpec.24 — Build per-direction aim vectors from profile fields. Inputs: raw. Updates: by direction at dir. Uses: number; number is finite; normalize. Returns: a record containing byDirection.

### js/plugins/Phanicom_ActiveCombat.Core.js:228

@function Phanicom_ActiveCombat.Core.aimVectorForDirection.25 — Resolve the profile aim vector for an MZ direction. Inputs: aim spec; dir. Uses: number; normalize; direction vector. Returns: v and math hypot using v x, v y is greater than eps selects normalize using v x, v y or direction vector using dir.

### js/plugins/Phanicom_ActiveCombat.Core.js:233

@function Phanicom_ActiveCombat.Core.angleDegreesToVector.26 — Convert authored barrel angle degrees into a normalized source 2D direction. Inputs: degrees. Uses: number; normalize. Returns: normalize using math cos using rad, math sin using rad.

### js/plugins/Phanicom_ActiveCombat.Core.js:238

@function Phanicom_ActiveCombat.Core.profileAngleAimSpec.27 — Convert directional angle fields into vectors for legacy compatibility. Inputs: raw. Updates: by direction at dir. Uses: number; number is finite; angle degrees to vector. Returns: a record containing byDirection.

### js/plugins/Phanicom_ActiveCombat.Core.js:253

@function Phanicom_ActiveCombat.Core.compileWeaponProfile.28 — Convert supplied plugin profile fields into runtime weapon defaults. Inputs: raw. Uses: profile key; string; string using chain or "projectile" trim using to lower case; string using chain or "projectile" trim. Returns: null; a record containing id, displayName, family, runtimeType, fireMode, audioProfile, sound, tracerColor.

### js/plugins/Phanicom_ActiveCombat.Core.js:271

@function Phanicom_ActiveCombat.Core.compileEnemyCombatProfile.29 — Convert authored enemy profile fields into validated runtime combat options. Inputs: raw. Uses: profile key; string using chain or "none" trim using to lower case; string using chain or "none" trim; string. Returns: null; a record containing id, displayName, characterSheet, calibrationId, maxHp, attack, damage, range.

### js/plugins/Phanicom_ActiveCombat.Core.js:304

@function Phanicom_ActiveCombat.Core.normalize.30 — Normalize a 2D vector safely; coordinate conventions remain those of the supplied plugin. Inputs: x; y. Uses: hypot. Returns: a record containing x, y.

### js/plugins/Phanicom_ActiveCombat.Core.js:312

@function Phanicom_ActiveCombat.Core.directionVector.31 — Translate MZ keypad direction IDs into unit world vectors. Inputs: dir. Uses: number; normalize. Returns: normalize using - 1, 1; a record containing x, y.

### js/plugins/Phanicom_ActiveCombat.Core.js:341

@function Phanicom_ActiveCombat.Core.gaussian.32 — Generate Gaussian random deviation for the original weapon spread model. Inputs: no explicit arguments; uses enclosing module state. Updates: u; v. Returns: math sqrt using - 2 multiplied by math log using u multiplied by math cos using 2 multiplied by math pi multiplied by v.

### js/plugins/Phanicom_ActiveCombat.Core.js:348

@function Phanicom_ActiveCombat.Core.applySpread.33 — Rotate an aim vector by sampled angular spread; preserve the source distribution. Inputs: direction; spread radians. Uses: gaussian. Returns: a record containing copied fields; a record containing x, y.

### js/plugins/Phanicom_ActiveCombat.Core.js:360

@function Phanicom_ActiveCombat.Core.shotgunDirections.34 — Create the original cone of pellet directions. Native host limits count to protect frame budgets. Inputs: base direction; pellets; cone radians. Uses: clamp; result push. Returns: a list of a record containing copied fields; result.

### js/plugins/Phanicom_ActiveCombat.Core.js:385

@function Phanicom_ActiveCombat.Core.weaponProfileFor.35 — Resolve explicit profile ID, name or source item association. Inputs: raw; assignment pattern. Uses: str; weapon profiles get; profile key. Returns: weapon profiles get using profile key using requested or null; weapon profiles get using profile key using item name or null.

### js/plugins/Phanicom_ActiveCombat.Core.js:397

@function Phanicom_ActiveCombat.Core.parseWeaponItem.36 — Merge authored weapon note options with the original profile/default rules. Tune supplied item notes before changing parser defaults. Inputs: item. Uses: parse weapon note; weapon profile for; str using raw, "type", chain or "projectile" to lower case; str. Returns: null; null.

### js/plugins/Phanicom_ActiveCombat.Core.js:479

@function Phanicom_ActiveCombat.Core.parseCombatEvent.37 — Parse event combat note tags into enemy attack, timing, hitbox and death options. Inputs: event data. Updates: local aim spec by direction at dir; has local aim angle. Uses: parse tag options; str; enemy combat profiles get; profile key. Returns: null; a record containing profileId, profileName, calibrationId, aimSpec, maxHp, hitRadius, alpha, deathSwitch.

### js/plugins/Phanicom_ActiveCombat.Core.js:558

@function Phanicom_ActiveCombat.Core.goldenEyeContext.38 — Get or create the procedural weapon audio context; the native host supplies its shared context. Inputs: no explicit arguments; uses enclosing module state. Updates: golden eye audio ctx. Uses: log. Returns: golden eye audio ctx; null.

### js/plugins/Phanicom_ActiveCombat.Core.js:572

@function Phanicom_ActiveCombat.Core.goldenEyeResume.39 — Resume suspended procedural audio after a permitted user gesture. Inputs: ctx. Uses: ctx resume using catch; ctx resume.

### js/plugins/Phanicom_ActiveCombat.Core.js:574

@function Phanicom_ActiveCombat.Core.callback.40 — Provides the callback for ctx resume using catch. Inputs: no explicit arguments; uses enclosing module state.

### js/plugins/Phanicom_ActiveCombat.Core.js:580

@function Phanicom_ActiveCombat.Core.goldenEyeDistortionCurve.41 — Build the source waveshaper curve used by procedural weapon sounds. Inputs: amount. Updates: curve at i. Uses: number. Returns: curve.

### js/plugins/Phanicom_ActiveCombat.Core.js:597

@function Phanicom_ActiveCombat.Core.acquireSoundGraph.42 — Handles acquire sound graph within phanicom active combat.core. Inputs: ctx. Updates: idle. Uses: idle sound graphs get; idle sound graphs set; idle pop; ctx create gain. Returns: a record containing graph, idle.

### js/plugins/Phanicom_ActiveCombat.Core.js:607

@function Phanicom_ActiveCombat.Core.playGoldenEyeWomp.43 — Generate the supplied oscillator/noise/filter weapon envelope; preserve its timing when adjusting gain. Inputs: assignment pattern. Updates: osc type; sub type; filter type; shaper curve; shaper oversample. Uses: golden eye context; golden eye resume; clamp; ctx create oscillator. Returns: without a result; without a result.

### js/plugins/Phanicom_ActiveCombat.Core.js:671

@function Phanicom_ActiveCombat.Core.releaseGraph.44 — Handles release graph within phanicom active combat.core. Inputs: no explicit arguments; uses enclosing module state. Uses: set timeout. Returns: without a result.

### js/plugins/Phanicom_ActiveCombat.Core.js:673

@function Phanicom_ActiveCombat.Core.callback.45 — Provides the callback for set timeout. Inputs: no explicit arguments; uses enclosing module state. Updates: osc onended; sub onended. Uses: node disconnect; idle push.

### js/plugins/Phanicom_ActiveCombat.Core.js:686

@function Phanicom_ActiveCombat.Core.playGoldenEyeProfile.46 — Select the supplied procedural sound recipe by profile name. Inputs: profile; assignment pattern. Uses: string using profile or "standard" to lower case; string; play golden eye womp; set timeout. Returns: without a result; without a result.

### js/plugins/Phanicom_ActiveCombat.Core.js:694

@function Phanicom_ActiveCombat.Core.callback.47 — Returns play golden eye womp using a record containing duration, startFreq, endFreq, filterStart, filterEnd, volume, volumeScale, wave. Inputs: no explicit arguments; uses enclosing module state. Uses: play golden eye womp. Returns: play golden eye womp using a record containing duration, startFreq, endFreq, filterStart, filterEnd, volume, volumeScale, wave.

### js/plugins/Phanicom_ActiveCombat.Core.js:741

@function Phanicom_ActiveCombat.Core.setAudioContext.48 — Handles set audio context within phanicom active combat.core. Inputs: ctx. Updates: golden eye audio ctx.

### js/plugins/Phanicom_ActiveCombat.Core.js:744

@function Phanicom_ActiveCombat.Core.setVolume.49 — Handles set volume within phanicom active combat.core. Inputs: value. Updates: cfg golden eye output gain. Uses: number.

### js/plugins/Phanicom_ActiveCombat.js:6

@function Phanicom_ActiveCombat.callback.1 — Provides the callback for a callback. Inputs: root. Updates: mf fire shot; mf resolve projectile impact; root phanicom abs. Uses: root phanicom plugin settings items find; core parse weapon item; weapons set.

### js/plugins/Phanicom_ActiveCombat.js:11

@function Phanicom_ActiveCombat.callback.2 — Returns i name equals profile display name. Inputs: i. Returns: i name equals profile display name.

### js/plugins/Phanicom_ActiveCombat.js:28

@function Phanicom_ActiveCombat.equip.3 — Clone a parsed weapon profile into player state; clamp loaded rounds and cancel queued bursts. Inputs: game; id. Updates: game player weapon; game player magazines; game player magazines at game player previous weapon; game player ammo loaded; game player previous weapon. Uses: weapons get; error; structured clone. Returns: weapon.

### js/plugins/Phanicom_ActiveCombat.js:40

@function Phanicom_ActiveCombat.pattern.4 — Emit melee, shotgun or single-projectile patterns from calibrated origins, with bounded projectile/flash counts. Inputs: game; owner; weapon; base; ui. Updates: p penetration; p hit ids; p profile id; first. Uses: root frontier activity query; mf resolve projectile impact; root frontier weapon tuning radians; core shotgun directions. Returns: without a result.

### js/plugins/Phanicom_ActiveCombat.js:84

@function Phanicom_ActiveCombat.sound.5 — Prefer an available explicit SE; otherwise use the original procedural weapon sound profile. Inputs: game; weapon; owner. Uses: root phanicom se has; root phanicom se play; core play golden eye profile.

### js/plugins/Phanicom_ActiveCombat.js:95

@function Phanicom_ActiveCombat.shot.6 — Enforce holster/alive/cooldown/ammunition rules, emit one attack and set its firing cadence. Inputs: game; ui; assignment pattern. Updates: game combat cooldown; game burst; p firing until; p ammo loaded. Uses: root phanicom se play; number; ui log; mf update aim. Returns: false; false.

### js/plugins/Phanicom_ActiveCombat.js:117

@function Phanicom_ActiveCombat.fireShot.7 — Handles fire shot within phanicom active combat. Inputs: game; x; y; ui. Updates: game burst. Uses: shot. Returns: false; ok.

### js/plugins/Phanicom_ActiveCombat.js:131

@function Phanicom_ActiveCombat.update.8 — Countdown cooldown/burst in seconds; automatic fire reads held input while semi fire is edge-triggered by app.js. Inputs: game; dt; held. Updates: game combat cooldown; game burst; b timer. Uses: shot. Returns: without a result.

### js/plugins/Phanicom_ActiveCombat.js:149

@function Phanicom_ActiveCombat.resolveProjectileImpact.9 — Handles resolve projectile impact within phanicom active combat. Inputs: game; p; hit; ui. Updates: game particles length; messages. Uses: game runtime entities get; root frontier party combat can damage; game runtime events emit; original impact. Returns: without a result.

### js/plugins/Phanicom_ActiveCombat.js:177

@function Phanicom_ActiveCombat.setPlayerDeathMode.10 — Handles set player death mode within phanicom active combat. Inputs: game; mode. Updates: game death mode. Uses: a list of "normal", "sprite", "gib", "damage" includes; error.

### js/plugins/Phanicom_ActiveCombat.js:182

@function Phanicom_ActiveCombat.exportState.11 — Handles export state within phanicom active combat. Inputs: game. Returns: a record containing weapon, ammoLoaded, ammoReserve, hp, deathMode.

### js/plugins/Phanicom_BloodSystem.Core.js:6

@function Phanicom_BloodSystem.Core.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root phanicom blood core. Uses: number; a callback.

### js/plugins/Phanicom_BloodSystem.Core.js:14

@function Phanicom_BloodSystem.Core.constructor.2 — function Object() { [native code] } Inputs: x; y; assignment pattern; assignment pattern. Updates: this start x; this start y; this x; this y; this velocity x.

### js/plugins/Phanicom_BloodSystem.Core.js:29

@function Phanicom_BloodSystem.Core.update.3 — Advances this system using the current state and elapsed time. Inputs: no explicit arguments; uses enclosing module state. Updates: this x; this y; this velocity y; this velocity x; this opacity.

### js/plugins/Phanicom_BloodSystem.Core.js:43

@function Phanicom_BloodSystem.Core.isDead.4 — Handles is dead within phanicom blood system.core. Inputs: no explicit arguments; uses enclosing module state. Returns: this life is at least this max life or this opacity is at most 0.

### js/plugins/Phanicom_BloodSystem.Core.js:46

@function Phanicom_BloodSystem.Core.draw.5 — Draws this system’s current state into the supplied rendering context. Inputs: sprite. Uses: $game map display x; $game map tile width; $game map display y; $game map tile height. Returns: without a result.

### js/plugins/Phanicom_BloodSystem.Core.js:62

@function Phanicom_BloodSystem.Core.callback.6 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Returns: synth blood particle.

### js/plugins/Phanicom_BloodSystem.Core.js:65

@function Phanicom_BloodSystem.Core.constructor.7 — function Object() { [native code] } Inputs: x; y; assignment pattern; assignment pattern; assignment pattern. Updates: this start x; this start y; this x; this y; this velocity x.

### js/plugins/Phanicom_BloodSystem.Core.js:91

@function Phanicom_BloodSystem.Core.update.8 — Advances this system using the current state and elapsed time. Inputs: no explicit arguments; uses enclosing module state. Updates: this x; this y; this velocity y; this velocity x; this pulse phase.

### js/plugins/Phanicom_BloodSystem.Core.js:110

@function Phanicom_BloodSystem.Core.isDead.9 — Handles is dead within phanicom blood system.core. Inputs: no explicit arguments; uses enclosing module state. Returns: this life is at least this max life or this opacity is at most 0.

### js/plugins/Phanicom_BloodSystem.Core.js:113

@function Phanicom_BloodSystem.Core.draw.10 — Draws this system’s current state into the supplied rendering context. Inputs: sprite. Uses: $game map display x; $game map tile width; $game map display y; $game map tile height. Returns: without a result.

### js/plugins/Phanicom_BloodSystem.Core.js:161

@function Phanicom_BloodSystem.Core.constructor.11 — function Object() { [native code] } Inputs: no explicit arguments; uses enclosing module state. Updates: this ctx.

### js/plugins/Phanicom_BloodSystem.Core.js:170

@function Phanicom_BloodSystem.Core.createArcadeSound.12 — Handles create arcade sound within phanicom blood system.core. Inputs: type; duration; freq start; assignment pattern; assignment pattern. Updates: curve at i; wave shaper curve; oscillator type; oscillator frequency value; gain gain value. Uses: this ctx create oscillator; this ctx create gain; this ctx create wave shaper; oscillator frequency linear ramp to value at time. Returns: without a result.

### js/plugins/Phanicom_BloodSystem.Core.js:196

@function Phanicom_BloodSystem.Core.playSquelchyDrip.13 — Handles play squelchy drip within phanicom blood system.core. Inputs: no explicit arguments; uses enclosing module state. Updates: drip osc type; noise data at i; noise buffer; noise filter type. Uses: this ctx create oscillator; drip osc frequency set value at time; drip osc frequency linear ramp to value at time; this ctx create gain. Returns: without a result.

### js/plugins/Phanicom_BloodSystem.js:6

@function Phanicom_BloodSystem.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root phanicom blood. Uses: number.

### js/plugins/Phanicom_BloodSystem.js:12

@function Phanicom_BloodSystem.attach.2 — Attach the blood API to a runtime and initialize transient particles/decals/fragments and timers. Inputs: game. Updates: current; game blood state; game blood fx; game blood decals; game gib fragments.

### js/plugins/Phanicom_BloodSystem.js:28

@function Phanicom_BloodSystem.identity.3 — Resolve actor override, authored blood identity or default; normalize cream/synth and hex colors. Inputs: subject. Uses: /<CreamBleed>/i test; a list of "regular", "cream", "none" includes; /^#[\da-f]{3}([\da-f]{3})?$/i test; a list of spread element map using a callback join. Returns: "cream"; "regular".

### js/plugins/Phanicom_BloodSystem.js:33

@function Phanicom_BloodSystem.callback.4 — Returns c plus c. Inputs: c. Returns: c plus c.

### js/plugins/Phanicom_BloodSystem.js:37

@function Phanicom_BloodSystem.resolve.5 — Translate a blood identity into particle color, count, duration and enabled/profile flags. Inputs: subject. Uses: identity; type starts with; number. Returns: a record containing type, enabled, profile, color, dripColor, particleCount, duration.

### js/plugins/Phanicom_BloodSystem.js:45

@function Phanicom_BloodSystem.sprayAt.6 — Emit bounded original-equation particles at world coordinates, freezing a local billboard basis for their motion. Inputs: x; y; assignment pattern. Updates: p origin; p right; p depth; p layer. Uses: resolve; number; frontier terrain height; game blood fx push. Returns: 0; 0.

### js/plugins/Phanicom_BloodSystem.js:73

@function Phanicom_BloodSystem.damage.7 — Use actual impact position and victim identity to trigger a configured blood burst. Inputs: game; actor; shot. Updates: current. Uses: resolve; spray at; number. Returns: without a result.

### js/plugins/Phanicom_BloodSystem.js:83

@function Phanicom_BloodSystem.fragments.8 — Split the active sprite frame into bounded gib pieces with independent world motion. Inputs: game; actor. Uses: frontier sprites sheet; frontier directions select; game gib fragments push. Returns: 0; count.

### js/plugins/Phanicom_BloodSystem.js:106

@function Phanicom_BloodSystem.death.9 — Apply configured gib threshold/death mode, blood burst, persistent stain and player death delay. Inputs: game; actor; shot; before. Updates: current; actor gibbed; game death until; actor death mode. Uses: resolve; number; fragments; spray at.

### js/plugins/Phanicom_BloodSystem.js:132

@function Phanicom_BloodSystem.update.10 — Fixed-rate particle integration preserves source equations; transient arrays compact in place instead of allocating filters. Inputs: game; dt. Updates: current; game blood accumulator; game blood fx at update; game blood fx length; game passive drips length. Uses: p update; p is dead; /<NoBleedEffect>/i test; root frontier world activity settings.

### js/plugins/Phanicom_BloodSystem.js:149

@function Phanicom_BloodSystem.callback.11 — Returns the inverse of a dead and a hp is greater than 0 and a hp is at most number using settings hp threshold or 10 and resolve using a enabled. Inputs: a. Uses: number; resolve. Returns: the inverse of a dead and a hp is greater than 0 and a hp is at most number using settings hp threshold or 10 and resolve using a enabled.

### js/plugins/Phanicom_BloodSystem.js:149

@function Phanicom_BloodSystem.callback.12 — Returns a list of a id, a. Inputs: a. Returns: a list of a id, a.

### js/plugins/Phanicom_BloodSystem.js:196

@function Phanicom_BloodSystem.draw.13 — Project world effects into the active renderer. Passive drops follow their actor; sprays keep their spawn basis. Restore alpha afterward. Inputs: ctx; game; cam; project. Updates: ctx fill style; ctx global alpha. Uses: project; ctx fill rect; game runtime entities get; ctx save.

### js/plugins/Phanicom_BloodSystem.js:243

@function Phanicom_BloodSystem.setActorType.14 — Handles set actor type within phanicom blood system. Inputs: id; type. Updates: current blood state actors at id. Uses: identity.

### js/plugins/Phanicom_BloodSystem.js:248

@function Phanicom_BloodSystem.setPlayerType.15 — Handles set player type within phanicom blood system. Inputs: type. Uses: api set actor type.

### js/plugins/Phanicom_BloodSystem.js:251

@function Phanicom_BloodSystem.setFollowerType.16 — Handles set follower type within phanicom blood system. Inputs: index; type. Uses: api set actor type. Returns: false; true.

### js/plugins/Phanicom_BloodSystem.js:257

@function Phanicom_BloodSystem.getActorType.17 — Handles get actor type within phanicom blood system. Inputs: id. Uses: current runtime entities get; identity. Returns: actor selects identity using actor or null.

### js/plugins/Phanicom_BloodSystem.js:261

@function Phanicom_BloodSystem.resetBloodTypes.18 — Handles reset blood types within phanicom blood system. Inputs: no explicit arguments; uses enclosing module state. Updates: current blood state actors; current passive drips length. Uses: current drip timers clear.

### js/plugins/Phanicom_BloodSystem.js:268

@function Phanicom_BloodSystem.hideBleeding.19 — Handles hide bleeding within phanicom blood system. Inputs: no explicit arguments; uses enclosing module state. Updates: current blood state hidden; current passive drips length.

### js/plugins/Phanicom_BloodSystem.js:272

@function Phanicom_BloodSystem.showBleeding.20 — Handles show bleeding within phanicom blood system. Inputs: no explicit arguments; uses enclosing module state. Updates: current blood state hidden.

### js/plugins/Phanicom_BloodSystem.js:275

@function Phanicom_BloodSystem.isBleedingVisible.21 — Handles is bleeding visible within phanicom blood system. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of current blood state hidden.

### js/plugins/Phanicom_BloodSystem.js:278

@function Phanicom_BloodSystem.clearSprays.22 — Handles clear sprays within phanicom blood system. Inputs: no explicit arguments; uses enclosing module state. Updates: current blood fx length.

### js/plugins/Phanicom_BloodSystem.js:281

@function Phanicom_BloodSystem.sprayActor.23 — Handles spray actor within phanicom blood system. Inputs: id; assignment pattern. Uses: api spray event. Returns: api spray event using id, options.

### js/plugins/Phanicom_BloodSystem.js:289

@function Phanicom_BloodSystem.sprayPixels.24 — Handles spray pixels within phanicom blood system. Inputs: x; y; assignment pattern. Uses: spray at. Returns: spray at using current player x plus x divided by 190, current player y, a record containing z, copied fields.

### js/plugins/Phanicom_BloodSystem.js:297

@function Phanicom_BloodSystem.sprayCharacter.25 — Handles spray character within phanicom blood system. Inputs: actor; assignment pattern. Uses: spray at. Returns: spray at using actor x, actor y, a record containing blood, z, copied fields.

### js/plugins/Phanicom_BloodSystem.js:305

@function Phanicom_BloodSystem.sprayEvent.26 — Handles spray event within phanicom blood system. Inputs: id; assignment pattern. Uses: current runtime entities get; api spray character. Returns: actor selects api spray character using actor, options or 0.

### js/plugins/Phanicom_BloodSystem.js:311

@function Phanicom_BloodSystem.exportState.27 — Handles export state within phanicom blood system. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using current blood state.

### js/plugins/Phanicom_BloodSystem.js:314

@function Phanicom_BloodSystem.restoreState.28 — Handles restore state within phanicom blood system. Inputs: state. Updates: current blood state; current passive drips length. Uses: error; object values; identity; structured clone.

### plugins/phanicom-synth-footsteps.js:59

@function phanicom-synth-footsteps.callback.1 — Provides the callback for a callback. Inputs: mf. Uses: mf plugins register.

### plugins/phanicom-synth-footsteps.js:70

@function phanicom-synth-footsteps.getAudioSystem.2 — Locate the engine AudioSystem exposed to the active plugin session. The normal location is ctx.game.audio. The runtime location is retained as a compatibility fallback in case engine service ownership changes. Inputs: ctx. Returns: ctx game audio; ctx runtime audio.

### plugins/phanicom-synth-footsteps.js:97

@function phanicom-synth-footsteps.isPlayerSprinting.3 — Determine whether the player is currently using the engine sprint input. Sprinting is read from input state rather than inferred from velocity. This preserves the intended walk/sprint sound distinction even when collision or another system alters actual displacement. Inputs: game. Uses: keys has. Returns: false; keys has using "ShiftLeft".

### plugins/phanicom-synth-footsteps.js:119

@function phanicom-synth-footsteps.movementDistance.4 — Return actual successful player displacement during this update. player.vx/player.vy are written after movement/collision resolution, so attempting to walk into a solid obstacle does not produce false steps. Inputs: game. Uses: number. Returns: 0; math hypot using vx, vy.

### plugins/phanicom-synth-footsteps.js:139

@function phanicom-synth-footsteps.finiteNumber.5 — Convert a configuration value to a finite number with a fallback. Inputs: value; fallback. Uses: number; number is finite. Returns: number is finite using number selects number or fallback.

### plugins/phanicom-synth-footsteps.js:337

@function phanicom-synth-footsteps.start.6 — Handles start within phanicom synth footsteps. Inputs: ctx. Updates: ctx state distance; ctx state last sound time; ctx state audio; ctx state owns footsteps; ctx state warned missing audio. Uses: get audio system; ctx log; audio claim footsteps. Returns: without a result.

### plugins/phanicom-synth-footsteps.js:391

@function phanicom-synth-footsteps.update.7 — Advances this system using the current state and elapsed time. Inputs: ctx; dt. Updates: ctx state audio; ctx state warned missing audio; ctx state owns footsteps; ctx state distance; ctx state last sound time. Uses: get audio system; ctx log; audio claim footsteps; movement distance. Returns: without a result; without a result.

### plugins/phanicom-synth-footsteps.js:652

@function phanicom-synth-footsteps.stop.8 — Handles stop within phanicom synth footsteps. Inputs: ctx. Updates: ctx state distance; ctx state last sound time; ctx state audio; ctx state owns footsteps. Uses: get audio system; audio release footsteps.

### tests/actor-behavior159.cjs:1

@function actor-behavior159.canStand.1 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/actor-behavior159.cjs:1

@function actor-behavior159.bounds.2 — Calculates or applies the enclosing limits for this module’s data. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing width, height.

### tests/actor-behavior159.cjs:2

@function actor-behavior159.update.3 — Advances this system using the current state and elapsed time. Inputs: target; assignment pattern. Uses: b update.

### tests/actor-behavior159.cjs:4

@function actor-behavior159.canStand.4 — Returns x is less than 5.15. Inputs: x. Returns: x is less than 5.15.

### tests/actor-behavior159.cjs:4

@function actor-behavior159.callback.5 — Returns b validate using a record containing mode. Inputs: no explicit arguments; uses enclosing module state. Uses: b validate. Returns: b validate using a record containing mode.

### tests/actor-behavior159.cjs:4

@function actor-behavior159.callback.6 — Returns b validate using a record containing detectRange, chaseRange. Inputs: no explicit arguments; uses enclosing module state. Uses: b validate. Returns: b validate using a record containing detectRange, chaseRange.

### tests/actor-behavior159.cjs:4

@function actor-behavior159.callback.7 — Returns b validate using a record containing points. Inputs: no explicit arguments; uses enclosing module state. Uses: b validate; array using 65 fill; array. Returns: b validate using a record containing points.

### tests/actor-behavior159.cjs:7

@function actor-behavior159.callback.8 — Returns frontier events validate using a list of outside, a new set, a record containing width, height. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier events validate. Returns: frontier events validate using a list of outside, a new set, a record containing width, height.

### tests/actor-behavior159.cjs:9

@function actor-behavior159.callback.9 — Returns b restore using a list of a record containing copied fields, page, a list of live, resumed. Inputs: no explicit arguments; uses enclosing module state. Uses: b restore. Returns: b restore using a list of a record containing copied fields, page, a list of live, resumed.

### tests/actor-behavior159.cjs:9

@function actor-behavior159.callback.10 — Returns b snapshots using a list of a record containing copied fields, home, a record containing width, height. Inputs: no explicit arguments; uses enclosing module state. Uses: b snapshots. Returns: b snapshots using a list of a record containing copied fields, home, a record containing width, height.

### tests/actor-behavior159.cjs:11

@function actor-behavior159.callback.11 — Returns b bindings using a list of a record containing copied fields, id, a list of live, a record containing width, height. Inputs: no explicit arguments; uses enclosing module state. Uses: b bindings. Returns: b bindings using a list of a record containing copied fields, id, a list of live, a record containing width, height.

### tests/actor-behavior159.cjs:11

@function actor-behavior159.callback.12 — Returns b bindings using a list of a record containing copied fields, index, a list of live, a record containing width, height. Inputs: no explicit arguments; uses enclosing module state. Uses: b bindings. Returns: b bindings using a list of a record containing copied fields, index, a list of live, a record containing width, height.

### tests/actor-behavior159.cjs:13

@function actor-behavior159.get.13 — Returns 3. Inputs: no explicit arguments; uses enclosing module state. Returns: 3.

### tests/actor-behavior159.cjs:13

@function actor-behavior159.behaviorCanMove.14 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/barrel153.cjs:2

@function barrel153.select.1 — Returns a record containing row, column. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing row, column.

### tests/barrel153.cjs:2

@function barrel153.camera.2 — Calculates the camera view or constrains its position against this module’s solid geometry. Inputs: g. Returns: g camera.

### tests/barrel153.cjs:5

@function barrel153.callback.3 — Returns assignment. Inputs: m. Updates: m barrel depth. Returns: assignment.

### tests/barrel153.cjs:5

@function barrel153.callback.4 — Returns delete m barrel y. Inputs: m. Returns: delete m barrel y.

### tests/barrel153.cjs:5

@function barrel153.callback.5 — Provides the callback for the enclosing barrel153 operation. Inputs: m. Updates: m barrel x; m barrel y.

### tests/barrel153.cjs:5

@function barrel153.callback.6 — Returns api validate using copy. Inputs: no explicit arguments; uses enclosing module state. Uses: api validate. Returns: api validate using copy.

### tests/browser/behavior-dialog.cjs:2

@function behavior-dialog.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; browser new page; p on; p goto.

### tests/browser/behavior-dialog.cjs:3

@function behavior-dialog.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/behavior-dialog.cjs:3

@function behavior-dialog.callback.3 — Returns window frontier mzeditor. Inputs: no explicit arguments; uses enclosing module state. Returns: window frontier mzeditor.

### tests/browser/behavior-dialog.cjs:4

@function behavior-dialog.callback.4 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: window fixture world; e pages at 0 commands; fixture world events; window fixture editor. Uses: document get element by id using "mzEventEditor" remove; document get element by id; frontier world generate; frontier events create.

### tests/browser/behavior-dialog.cjs:4

@function behavior-dialog.world.5 — Returns fixture world. Inputs: no explicit arguments; uses enclosing module state. Returns: fixture world.

### tests/browser/behavior-dialog.cjs:4

@function behavior-dialog.mutate.6 — Returns f using . Inputs: f. Uses: f. Returns: f using .

### tests/browser/behavior-dialog.cjs:4

@function behavior-dialog.choose.7 — Handles choose within behavior dialog. Inputs: no explicit arguments; uses enclosing module state.

### tests/browser/behavior-dialog.cjs:4

@function behavior-dialog.selected.8 — Returns fixture world events at 0. Inputs: no explicit arguments; uses enclosing module state. Returns: fixture world events at 0.

### tests/browser/behavior-dialog.cjs:5

@function behavior-dialog.open.9 — Returns p get by role using "button", a record containing name, exact click using . Inputs: no explicit arguments; uses enclosing module state. Uses: p get by role using "button", a record containing name, exact click; p get by role. Returns: p get by role using "button", a record containing name, exact click using .

### tests/browser/behavior-dialog.cjs:5

@function behavior-dialog.callback.10 — Returns fixture world events at 0 pages at 0 behavior. Inputs: no explicit arguments; uses enclosing module state. Returns: fixture world events at 0 pages at 0 behavior.

### tests/browser/behavior-dialog.cjs:5

@function behavior-dialog.callback.11 — Returns fixture world events at 0 pages at 0 behavior. Inputs: no explicit arguments; uses enclosing module state. Returns: fixture world events at 0 pages at 0 behavior.

### tests/browser/behavior-dialog.cjs:5

@function behavior-dialog.callback.12 — Returns fixture world events at 0 pages at 0 behavior mode. Inputs: no explicit arguments; uses enclosing module state. Returns: fixture world events at 0 pages at 0 behavior mode.

### tests/browser/behavior-dialog.cjs:5

@function behavior-dialog.callback.13 — Returns fixture world events at 0 pages at 0 behavior points length. Inputs: no explicit arguments; uses enclosing module state. Returns: fixture world events at 0 pages at 0 behavior points length.

### tests/browser/behavior-dialog.cjs:5

@function behavior-dialog.callback.14 — Returns fixture world events at 0 pages at 0 behavior mode. Inputs: no explicit arguments; uses enclosing module state. Returns: fixture world events at 0 pages at 0 behavior mode.

### tests/browser/behavior-dialog.cjs:5

@function behavior-dialog.callback.15 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/camera-sweep.cjs:2

@function camera-sweep.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; require; b new page; p on.

### tests/browser/camera-sweep.cjs:2

@function camera-sweep.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/camera-sweep.cjs:2

@function camera-sweep.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw; window masks; frontier terrain occlusion mask.

### tests/browser/camera-sweep.cjs:2

@function camera-sweep.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/camera-sweep.cjs:2

@function camera-sweep.mask.5 — Builds visible screen regions by comparing sprite depth with the existing geometry depth buffer. Inputs: d; r; z. Uses: mask; masks set. Returns: value.

### tests/browser/camera-sweep.cjs:2

@function camera-sweep.callback.6 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/camera-sweep.cjs:2

@function camera-sweep.callback.7 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: object assign; frontier terrain height; masks clear.

### tests/browser/camera-sweep.cjs:3

@function camera-sweep.callback.8 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: floor; min clearance. Uses: object assign; frontier terrain height; frontier render camera; error. Returns: a record containing cases, underwater, minClearance, trees, floating.

### tests/browser/camera-sweep.cjs:3

@function camera-sweep.callback.9 — Returns chain. Inputs: e. Uses: e sprite profile starts with. Returns: chain.

### tests/browser/camera-sweep.cjs:3

@function camera-sweep.callback.10 — Returns math abs using e z minus frontier terrain height using g source world, e x, e y is greater than 1e-7. Inputs: e. Uses: frontier terrain height. Returns: math abs using e z minus frontier terrain height using g source world, e x, e y is greater than 1e-7.

### tests/browser/camera-sweep.cjs:3

@function camera-sweep.callback.11 — Returns e id. Inputs: e. Returns: e id.

### tests/browser/camera-sweep.cjs:3

@function camera-sweep.callback.12 — Returns frontier pixi context using document get element by id using "view" terrain depth equals null. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier pixi context; document get element by id. Returns: frontier pixi context using document get element by id using "view" terrain depth equals null.

### tests/browser/camera-sweep.cjs:3

@function camera-sweep.callback.13 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/context-history.cjs:3

@function context-history.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; require; b new page; p on.

### tests/browser/context-history.cjs:3

@function context-history.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/context-history.cjs:3

@function context-history.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/context-history.cjs:3

@function context-history.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/context-history.cjs:3

@function context-history.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/context-history.cjs:4

@function context-history.callback.6 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: y; x. Uses: document get element by id; v get bounding client rect; frontier render ground point; frontier render pick. Returns: a record containing x, y.

### tests/browser/context-history.cjs:5

@function context-history.create.7 — Builds a new instance and its public operations from the supplied configuration. Inputs: no explicit arguments; uses enclosing module state. Uses: p mouse click; p get by role using "menuitem", a record containing name click; p get by role; p wait for selector.

### tests/browser/context-history.cjs:6

@function context-history.callback.8 — Returns g source world events length. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length.

### tests/browser/context-history.cjs:7

@function context-history.callback.9 — Returns g source world events length. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length.

### tests/browser/context-history.cjs:7

@function context-history.callback.10 — Returns g source world events at 0 pages at 0 commands at 0 lines at 0. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 pages at 0 commands at 0 lines at 0.

### tests/browser/context-history.cjs:7

@function context-history.callback.11 — Returns g source world events at 0 name. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 name.

### tests/browser/context-history.cjs:9

@function context-history.callback.12 — Returns g source world events at 0 id. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 id.

### tests/browser/context-history.cjs:9

@function context-history.menu.13 — Handles menu within context history. Inputs: id. Uses: p evaluate.

### tests/browser/context-history.cjs:9

@function context-history.callback.14 — Returns frontier event context open using a record containing clientX, clientY, point, eventId. Inputs: id. Uses: frontier event context open. Returns: frontier event context open using a record containing clientX, clientY, point, eventId.

### tests/browser/context-history.cjs:10

@function context-history.callback.15 — Returns g source world events length equals 2. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length equals 2.

### tests/browser/context-history.cjs:10

@function context-history.callback.16 — Returns g source world events find using a callback id. Inputs: id. Uses: g source world events find. Returns: g source world events find using a callback id.

### tests/browser/context-history.cjs:10

@function context-history.callback.17 — Returns e id does not equal id. Inputs: e. Returns: e id does not equal id.

### tests/browser/context-history.cjs:10

@function context-history.callback.18 — Returns e click using . Inputs: e. Uses: e click. Returns: e click using .

### tests/browser/context-history.cjs:10

@function context-history.callback.19 — Returns g source world events length equals 1. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length equals 1.

### tests/browser/context-history.cjs:10

@function context-history.callback.20 — Returns e click using . Inputs: e. Uses: e click. Returns: e click using .

### tests/browser/context-history.cjs:10

@function context-history.callback.21 — Returns g source world events length equals 2. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length equals 2.

### tests/browser/context-history.cjs:10

@function context-history.callback.22 — Returns g source world events length equals 1. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length equals 1.

### tests/browser/context-history.cjs:10

@function context-history.callback.23 — Returns e click using . Inputs: e. Uses: e click. Returns: e click using .

### tests/browser/context-history.cjs:10

@function context-history.callback.24 — Returns g source world events length equals 2. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length equals 2.

### tests/browser/context-history.cjs:10

@function context-history.callback.25 — Returns e click using . Inputs: e. Uses: e click. Returns: e click using .

### tests/browser/context-history.cjs:10

@function context-history.callback.26 — Returns g source world events length equals 1. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length equals 1.

### tests/browser/context-history.cjs:10

@function context-history.callback.27 — Returns g source world events at 0 name. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 name.

### tests/browser/context-history.cjs:11

@function context-history.callback.28 — Returns json parse using json stringify using g source world events at 0. Inputs: no explicit arguments; uses enclosing module state. Uses: json parse; json stringify. Returns: json parse using json stringify using g source world events at 0.

### tests/browser/context-history.cjs:11

@function context-history.callback.29 — Returns m world events some using a callback. Inputs: m. Uses: m world events some. Returns: m world events some using a callback.

### tests/browser/context-history.cjs:11

@function context-history.callback.30 — Returns e name equals "MZ browser fixture". Inputs: e. Returns: e name equals "MZ browser fixture".

### tests/browser/context-history.cjs:11

@function context-history.callback.31 — Returns g source world events some using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: g source world events some. Returns: g source world events some using a callback.

### tests/browser/context-history.cjs:11

@function context-history.callback.32 — Returns e name equals "MZ browser fixture". Inputs: e. Returns: e name equals "MZ browser fixture".

### tests/browser/context-history.cjs:11

@function context-history.callback.33 — Returns json parse using json stringify using g source world events find using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: json parse; json stringify; g source world events find. Returns: json parse using json stringify using g source world events find using a callback.

### tests/browser/context-history.cjs:11

@function context-history.callback.34 — Returns e name equals "MZ browser fixture". Inputs: e. Returns: e name equals "MZ browser fixture".

### tests/browser/context-history.cjs:11

@function context-history.callback.35 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/courier-journey.cjs:2

@function courier-journey.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; require; b new page; p on.

### tests/browser/courier-journey.cjs:2

@function courier-journey.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/courier-journey.cjs:2

@function courier-journey.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/courier-journey.cjs:2

@function courier-journey.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/courier-journey.cjs:2

@function courier-journey.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/courier-journey.cjs:2

@function courier-journey.callback.6 — Returns g source world events some using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: g source world events some. Returns: g source world events some using a callback.

### tests/browser/courier-journey.cjs:2

@function courier-journey.callback.7 — Returns e id equals "courier-contact". Inputs: e. Returns: e id equals "courier-contact".

### tests/browser/courier-journey.cjs:2

@function courier-journey.callback.8 — Returns e id equals "courier-travel". Inputs: e. Returns: e id equals "courier-travel".

### tests/browser/courier-journey.cjs:2

@function courier-journey.callback.9 — Returns e id equals "courier-travel". Inputs: e. Returns: e id equals "courier-travel".

### tests/browser/courier-journey.cjs:3

@function courier-journey.interact.10 — Handles interact within courier journey. Inputs: id; assignment pattern. Uses: p evaluate; p wait for function; p locator using "#dialogueChoices button" nth using choice click; p locator using "#dialogueChoices button" nth. Returns: without a result; without a result.

### tests/browser/courier-journey.cjs:3

@function courier-journey.callback.11 — Provides the callback for p evaluate. Inputs: id. Uses: g event session events find; g event session start; error.

### tests/browser/courier-journey.cjs:3

@function courier-journey.callback.12 — Returns e id equals id. Inputs: e. Returns: e id equals id.

### tests/browser/courier-journey.cjs:3

@function courier-journey.callback.13 — Returns g event session busy. Inputs: no explicit arguments; uses enclosing module state. Returns: g event session busy.

### tests/browser/courier-journey.cjs:3

@function courier-journey.callback.14 — Returns g event session busy. Inputs: no explicit arguments; uses enclosing module state. Returns: g event session busy.

### tests/browser/courier-journey.cjs:3

@function courier-journey.callback.15 — Returns g event session message or the inverse of g event session busy. Inputs: no explicit arguments; uses enclosing module state. Returns: g event session message or the inverse of g event session busy.

### tests/browser/courier-journey.cjs:3

@function courier-journey.callback.16 — Returns g event session busy. Inputs: no explicit arguments; uses enclosing module state. Returns: g event session busy.

### tests/browser/courier-journey.cjs:3

@function courier-journey.callback.17 — Returns the inverse of the inverse of g event session message options. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of the inverse of g event session message options.

### tests/browser/courier-journey.cjs:4

@function courier-journey.callback.18 — Returns g event session state quests has using "courier-letter". Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state quests has. Returns: g event session state quests has using "courier-letter".

### tests/browser/courier-journey.cjs:5

@function courier-journey.callback.19 — Returns g event session state quests get using "courier-letter". Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state quests get. Returns: g event session state quests get using "courier-letter".

### tests/browser/courier-journey.cjs:6

@function courier-journey.travel.20 — Handles travel within courier journey. Inputs: target event. Uses: p evaluate.

### tests/browser/courier-journey.cjs:6

@function courier-journey.callback.21 — Provides the callback for p evaluate. Inputs: id. Uses: g event session events find; g event session start; error.

### tests/browser/courier-journey.cjs:6

@function courier-journey.callback.22 — Returns e id equals id. Inputs: e. Returns: e id equals id.

### tests/browser/courier-journey.cjs:7

@function courier-journey.callback.23 — Returns g source world events some using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: g source world events some. Returns: g source world events some using a callback.

### tests/browser/courier-journey.cjs:7

@function courier-journey.callback.24 — Returns e id equals "courier-container". Inputs: e. Returns: e id equals "courier-container".

### tests/browser/courier-journey.cjs:7

@function courier-journey.callback.25 — Returns g event session state inventory get using "sealed-letter". Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state inventory get. Returns: g event session state inventory get using "sealed-letter".

### tests/browser/courier-journey.cjs:8

@function courier-journey.saveReload.26 — Handles save reload within courier journey. Inputs: no explicit arguments; uses enclosing module state. Uses: p wait for event; p locator using "#saveCombat" click; p locator; fs read file sync. Returns: saved.

### tests/browser/courier-journey.cjs:8

@function courier-journey.callback.27 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state inventory clear; g event session state quests clear; g event session state reputation clear.

### tests/browser/courier-journey.cjs:8

@function courier-journey.callback.28 — Returns json stringify using a list of spread element equals json stringify using expected. Inputs: expected. Uses: json stringify. Returns: json stringify using a list of spread element equals json stringify using expected.

### tests/browser/courier-journey.cjs:8

@function courier-journey.callback.29 — Returns a list of spread element. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of spread element.

### tests/browser/courier-journey.cjs:9

@function courier-journey.callback.30 — Returns g event session state inventory get using "sealed-letter". Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state inventory get. Returns: g event session state inventory get using "sealed-letter".

### tests/browser/courier-journey.cjs:9

@function courier-journey.callback.31 — Returns g event session state inventory get using "sealed-letter". Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state inventory get. Returns: g event session state inventory get using "sealed-letter".

### tests/browser/courier-journey.cjs:10

@function courier-journey.callback.32 — Returns g source world events some using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: g source world events some. Returns: g source world events some using a callback.

### tests/browser/courier-journey.cjs:10

@function courier-journey.callback.33 — Returns e id equals "courier-contact". Inputs: e. Returns: e id equals "courier-contact".

### tests/browser/courier-journey.cjs:10

@function courier-journey.callback.34 — Returns g event session state quests get using "courier-letter". Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state quests get. Returns: g event session state quests get using "courier-letter".

### tests/browser/courier-journey.cjs:10

@function courier-journey.callback.35 — Returns g event session state inventory get using "courier-reward". Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state inventory get. Returns: g event session state inventory get using "courier-reward".

### tests/browser/courier-journey.cjs:10

@function courier-journey.callback.36 — Returns g event session state reputation get using "town". Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state reputation get. Returns: g event session state reputation get using "town".

### tests/browser/courier-journey.cjs:10

@function courier-journey.callback.37 — Returns g event session state inventory get using "courier-reward". Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state inventory get. Returns: g event session state inventory get using "courier-reward".

### tests/browser/courier-journey.cjs:10

@function courier-journey.callback.38 — Returns g event session state inventory has using "sealed-letter". Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state inventory has. Returns: g event session state inventory has using "sealed-letter".

### tests/browser/courier-journey.cjs:11

@function courier-journey.callback.39 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/depth-order-room.cjs:2

@function depth-order-room.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p goto; path resolve using "index.html" replace all.

### tests/browser/depth-order-room.cjs:2

@function depth-order-room.callback.2 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/depth-order-room.cjs:2

@function depth-order-room.draw.3 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/depth-order-room.cjs:2

@function depth-order-room.callback.4 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/depth-order-room.cjs:3

@function depth-order-room.callback.5 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: c width; c height; t fill style; image src; frontier sprites sheet. Uses: document get element by id; frontier pixi context; original sheet; document create element. Returns: a record containing cases, underwater, samples.

### tests/browser/depth-order-room.cjs:3

@function depth-order-room.callback.6 — Returns a record containing x, y, w, h, anchorX. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing x, y, w, h, anchorX.

### tests/browser/depth-order-room.cjs:3

@function depth-order-room.sheet.7 — Returns sheets get using e kind equals "player" selects "player" or e id or original sheet using e. Inputs: e. Uses: sheets get; original sheet. Returns: sheets get using e kind equals "player" selects "player" or e id or original sheet using e.

### tests/browser/depth-order-room.cjs:3

@function depth-order-room.drawImage.8 — Handles draw image within depth order room. Inputs: image; rest element. Uses: images has; order push; images get; original draw call. Returns: original draw call using this, image, spread element.

### tests/browser/depth-order-room.cjs:3

@function depth-order-room.callback.9 — Provides the callback for a list of a list of "near", 0.4, a list of "event", 1.2, a list of "far", 2.4 map. Inputs: array pattern. Uses: frontier terrain height. Returns: a record containing id, kind, spriteProfile, x, y, z, height, priority.

### tests/browser/depth-order-room.cjs:3

@function depth-order-room.callback.10 — Returns a record containing id, p. Inputs: e. Uses: frontier render project. Returns: a record containing id, p.

### tests/browser/depth-order-room.cjs:3

@function depth-order-room.callback.11 — Returns order includes using e id. Inputs: e. Uses: order includes. Returns: order includes using e id.

### tests/browser/depth-order-room.cjs:3

@function depth-order-room.callback.12 — Returns b p depth minus a p depth. Inputs: a; b. Returns: b p depth minus a p depth.

### tests/browser/depth-order-room.cjs:3

@function depth-order-room.callback.13 — Returns e id. Inputs: e. Returns: e id.

### tests/browser/depth-order-room.cjs:3

@function depth-order-room.callback.14 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/depth-order.cjs:2

@function depth-order.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p goto; path resolve using "index.html" replace all.

### tests/browser/depth-order.cjs:2

@function depth-order.callback.2 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/depth-order.cjs:2

@function depth-order.draw.3 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/depth-order.cjs:2

@function depth-order.callback.4 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/depth-order.cjs:3

@function depth-order.callback.5 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: c width; c height; t fill style; image src; frontier sprites sheet. Uses: document get element by id; frontier pixi context; original sheet; document create element. Returns: a record containing cases, underwater, samples.

### tests/browser/depth-order.cjs:3

@function depth-order.callback.6 — Returns a record containing x, y, w, h, anchorX. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing x, y, w, h, anchorX.

### tests/browser/depth-order.cjs:3

@function depth-order.sheet.7 — Returns sheets get using e kind equals "player" selects "player" or e id or original sheet using e. Inputs: e. Uses: sheets get; original sheet. Returns: sheets get using e kind equals "player" selects "player" or e id or original sheet using e.

### tests/browser/depth-order.cjs:3

@function depth-order.drawImage.8 — Handles draw image within depth order. Inputs: image; rest element. Uses: images has; order push; images get; original draw call. Returns: original draw call using this, image, spread element.

### tests/browser/depth-order.cjs:3

@function depth-order.callback.9 — Provides the callback for a list of a list of "near", 0.4, a list of "event", 1.2, a list of "far", 2.4 map. Inputs: array pattern. Uses: frontier terrain height. Returns: a record containing id, kind, spriteProfile, x, y, z, height, priority.

### tests/browser/depth-order.cjs:3

@function depth-order.callback.10 — Returns a record containing id, p. Inputs: e. Uses: frontier render project. Returns: a record containing id, p.

### tests/browser/depth-order.cjs:3

@function depth-order.callback.11 — Returns order includes using e id. Inputs: e. Uses: order includes. Returns: order includes using e id.

### tests/browser/depth-order.cjs:3

@function depth-order.callback.12 — Returns b p depth minus a p depth. Inputs: a; b. Returns: b p depth minus a p depth.

### tests/browser/depth-order.cjs:3

@function depth-order.callback.13 — Returns e id. Inputs: e. Returns: e id.

### tests/browser/depth-order.cjs:3

@function depth-order.callback.14 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/event-interaction.cjs:3

@function event-interaction.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; require; b new page; p on.

### tests/browser/event-interaction.cjs:3

@function event-interaction.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/event-interaction.cjs:3

@function event-interaction.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/event-interaction.cjs:3

@function event-interaction.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/event-interaction.cjs:3

@function event-interaction.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/event-interaction.cjs:4

@function event-interaction.callback.6 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: y; x. Uses: document get element by id; v get bounding client rect; frontier render ground point; frontier render pick. Returns: a record containing x, y.

### tests/browser/event-interaction.cjs:5

@function event-interaction.create.7 — Builds a new instance and its public operations from the supplied configuration. Inputs: no explicit arguments; uses enclosing module state. Uses: p mouse click; p get by role using "menuitem", a record containing name click; p get by role; p wait for selector.

### tests/browser/event-interaction.cjs:6

@function event-interaction.callback.8 — Returns g source world events length. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length.

### tests/browser/event-interaction.cjs:7

@function event-interaction.callback.9 — Returns g source world events at 0 pages at 0 solid. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 pages at 0 solid.

### tests/browser/event-interaction.cjs:7

@function event-interaction.callback.10 — Returns g source world events length. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length.

### tests/browser/event-interaction.cjs:7

@function event-interaction.callback.11 — Returns g source world events at 0 pages at 0 commands at 0 lines at 0. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 pages at 0 commands at 0 lines at 0.

### tests/browser/event-interaction.cjs:7

@function event-interaction.callback.12 — Returns g source world events at 0 name. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 name.

### tests/browser/event-interaction.cjs:7

@function event-interaction.callback.13 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: y; x. Uses: document get element by id; v get bounding client rect; frontier render pick; error. Returns: a record containing x, y.

### tests/browser/event-interaction.cjs:7

@function event-interaction.callback.14 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: object assign; frontier terrain height.

### tests/browser/event-interaction.cjs:7

@function event-interaction.callback.15 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: y; x. Uses: document get element by id; v get bounding client rect; frontier render pick; error. Returns: a record containing x, y.

### tests/browser/event-interaction.cjs:7

@function event-interaction.callback.16 — Returns g event session message. Inputs: no explicit arguments; uses enclosing module state. Returns: g event session message.

### tests/browser/event-interaction.cjs:7

@function event-interaction.callback.17 — Returns g event session message text. Inputs: no explicit arguments; uses enclosing module state. Returns: g event session message text.

### tests/browser/event-interaction.cjs:7

@function event-interaction.callback.18 — Returns the inverse of g event session busy. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of g event session busy.

### tests/browser/event-interaction.cjs:7

@function event-interaction.callback.19 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/guards1518.cjs:2

@function model-camera-recovery.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; browser new page; page on; page add init script.

### tests/browser/guards1518.cjs:2

@function model-camera-recovery.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/guards1518.cjs:2

@function model-camera-recovery.callback.3 — Provides the callback for page add init script. Inputs: no explicit arguments; uses enclosing module state. Uses: object define property.

### tests/browser/guards1518.cjs:2

@function model-camera-recovery.get.4 — Returns value. Inputs: no explicit arguments; uses enclosing module state. Returns: value.

### tests/browser/guards1518.cjs:2

@function model-camera-recovery.set.5 — Handles set within model camera recovery. Inputs: v. Updates: v create; value.

### tests/browser/guards1518.cjs:2

@function model-camera-recovery.create.6 — Builds a new instance and its public operations from the supplied configuration. Inputs: rest element. Updates: window library. Uses: create. Returns: assignment.

### tests/browser/guards1518.cjs:2

@function model-camera-recovery.callback.7 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/guards1518.cjs:2

@function model-camera-recovery.draw.8 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/guards1518.cjs:2

@function model-camera-recovery.callback.9 — Returns window g and window library. Inputs: no explicit arguments; uses enclosing module state. Returns: window g and window library.

### tests/browser/guards1518.cjs:6

@function guards1518.roomReady — Inputs: none. Returns whether live geometry cell is active; no effects.

### tests/browser/guards1518.cjs:7

@function guards1518.roomSweep — Inputs: none. Orbits camera beside wall over pitch extrema, checking volume against every rendered room face. Returns count/retractions; temporarily moves player for fixture.

### tests/browser/guards1518.cjs:23

@function guards1518.captureSave — Inputs: none. Captures export Blob before file-protocol headless download cancellation; does not alter serialized contents.

### tests/browser/guards1518.cjs:23

@function guards1518.exportBlob — Inputs: Blob. Retains actual save Blob and returns normal object URL; no file writes.

### tests/browser/guards1518.cjs:23

@function guards1518.readSave — Inputs: none. Returns actual exported JSON text; no effects.

### tests/browser/guards1518.cjs:27

@function guards1518.closedDoor — Inputs: none. Sweeps an upright player body through the actual antique closed-door mesh; returns true when it blocks. Does not move runtime player.

### tests/browser/guards1518.cjs:27

@function guards1518.doorEntity — Inputs: event. Returns whether fixture is the shop door.

### tests/browser/guards1518.cjs:28

@function guards1518.failure — Inputs: error. Reports acceptance failure and nonzero process exit; no suppression.

### tests/browser/hub-door1517.cjs:2

@function hub-door1517.run â€” Inputs: none. Runs real-browser hub/menu/door/drop/save acceptance; returns a promise. Closes browser even on failure; fixture state never writes prior release data.

### tests/browser/hub-door1517.cjs:3

@function hub-door1517.pageError â€” Inputs: browser error. Appends message for final assertion; no recovery hides errors.

### tests/browser/hub-door1517.cjs:4

@function hub-door1517.captureAdapter â€” Inputs: none. Installs test-only accessors before modules load to capture existing service APIs without changing production implementation.

### tests/browser/hub-door1517.cjs:4

@function hub-door1517.workbenchGet â€” Inputs: none. Returns captured namespace.

### tests/browser/hub-door1517.cjs:4

@function hub-door1517.workbenchSet â€” Inputs: namespace. Wraps creation to retain application adapter in test window.

### tests/browser/hub-door1517.cjs:4

@function hub-door1517.workbenchCreate â€” Inputs: adapter. Returns original instance and stores it for browser acceptance.

### tests/browser/hub-door1517.cjs:4

@function hub-door1517.mapsGet â€” Inputs: none. Returns captured map namespace.

### tests/browser/hub-door1517.cjs:4

@function hub-door1517.mapsSet â€” Inputs: namespace. Wraps library factory for test access, preserving original calls.

### tests/browser/hub-door1517.cjs:4

@function hub-door1517.mapsCreate â€” Inputs: adapter. Returns original map library and retains it in test scope.

### tests/browser/hub-door1517.cjs:5

@function hub-door1517.captureExport — Inputs: none. Retains the actual export Blob before browser download delivery; production export remains unchanged.

### tests/browser/hub-door1517.cjs:5

@function hub-door1517.exportURL — Inputs: Blob. Returns original URL and retains its exact bytes for acceptance; no rewrite.

### tests/browser/hub-door1517.cjs:6

@function hub-door1517.ready â€” Inputs: none. Returns whether application APIs exist; no effects.

### tests/browser/hub-door1517.cjs:8

@function hub-door1517.pointerPosition — Inputs: none. Positions player within doorway range and fixes test camera; leaves fixture geometry unchanged.

### tests/browser/hub-door1517.cjs:9

@function hub-door1517.pointerDoor — Inputs: none. Finds actual projected interaction pixels for fixture door; returns CSS coordinates or fails.

### tests/browser/hub-door1517.cjs:9

@function hub-door1517.pointerArrived — Inputs: none. Returns real clicked door destination.

### tests/browser/hub-door1517.cjs:10

@function hub-door1517.pointerReturn — Inputs: none. Queues immediate hub return to continue remaining acceptance.

### tests/browser/hub-door1517.cjs:10

@function hub-door1517.pointerBack — Inputs: none. Returns hub arrival.

### tests/browser/hub-door1517.cjs:12

@function hub-door1517.cellValue â€” Inputs: none. Returns applied cleanup setting.

### tests/browser/hub-door1517.cjs:14

@function hub-door1517.preview â€” Inputs: none. Starts private antique door preview with silent sounds.

### tests/browser/hub-door1517.cjs:15

@function hub-door1517.previewPixels â€” Inputs: none. Returns number of non-black canvas pixels after texture load; no rendering changes.

### tests/browser/hub-door1517.cjs:17

@function hub-door1517.drop â€” Inputs: none. Grants test inventory, drops one item and pauses cleanup for deterministic check.

### tests/browser/hub-door1517.cjs:18

@function hub-door1517.dropCounts â€” Inputs: none. Returns inventory and active-cell counts; no mutation.

### tests/browser/hub-door1517.cjs:19

@function hub-door1517.travelHome â€” Inputs: none. Resumes and queues home transfer with a short 3D door sequence.

### tests/browser/hub-door1517.cjs:19

@function hub-door1517.homeReady â€” Inputs: none. Returns whether named home arrival committed.

### tests/browser/hub-door1517.cjs:20

@function hub-door1517.homeInventory â€” Inputs: none. Returns carried count across real cell transfer.

### tests/browser/hub-door1517.cjs:21

@function hub-door1517.homeDrop â€” Inputs: none. Drops one item in protected home then advances a cleanup test; asserts protection through returned state later.

### tests/browser/hub-door1517.cjs:22

@function hub-door1517.protectedCount â€” Inputs: none. Returns home's saved static-drop count.

### tests/browser/hub-door1517.cjs:23

@function hub-door1517.returnHub â€” Inputs: none. Queues immediate return to named hub arrival.

### tests/browser/hub-door1517.cjs:23

@function hub-door1517.hubReady â€” Inputs: none. Returns whether hub return committed.

### tests/browser/hub-door1517.cjs:24

@function hub-door1517.recoveryCount â€” Inputs: none. Returns recovered abandoned hub-item count.

### tests/browser/hub-door1517.cjs:26

@function hub-door1517.roundtrip â€” Inputs: none. Validates serialized compact state and project including door metadata. Returns diagnostic scalar counts.

### tests/browser/hub-door1517.cjs:29

@function hub-door1517.eventCount — Inputs: none. Returns author event count, no effects.

### tests/browser/hub-door1517.cjs:30

@function hub-door1517.authorDoor — Inputs: none. Opens transfer draft at test terrain point.

### tests/browser/hub-door1517.cjs:32

@function hub-door1517.authoredDoor — Inputs: none. Returns saved paired leaf count; no effects.

### tests/browser/hub-door1517.cjs:32

@function hub-door1517.findDoor — Inputs: authored event. Returns name match; no mutation.

### tests/browser/hub-door1517.cjs:33

@function hub-door1517.cancelDraft — Inputs: none. Opens another unsaved door draft; no persistence.

### tests/browser/hub-door1517.cjs:33

@function hub-door1517.afterCancel — Inputs: none. Returns authored count; no effects.

### tests/browser/hub-door1517.cjs:35

@function hub-door1517.shopInteract — Inputs: none. Opens real workbench stock interaction with fixture merchant data and test gold.

### tests/browser/hub-door1517.cjs:36

@function hub-door1517.purchase — Inputs: none. Returns gold and item count after real button transaction.

### tests/browser/hub-door1517.cjs:36

@function hub-door1517.sale — Inputs: none. Returns credited gold.

### tests/browser/hub-door1517.cjs:37

@function hub-door1517.pickup — Inputs: none. Creates one static drop and picks through the actual interaction service; returns resulting counts.

### tests/browser/hub-door1517.cjs:37

@function hub-door1517.findDrop — Inputs: runtime drop. Returns stable ID match, no effects.

### tests/browser/hub-door1517.cjs:39

@function hub-door1517.longDoor — Inputs: none. Queues deliberately slow test transition.

### tests/browser/hub-door1517.cjs:39

@function hub-door1517.skippedReady — Inputs: none. Returns whether skip committed destination; no mutation.

### tests/browser/hub-door1517.cjs:41

@function hub-door1517.seedSave — Inputs: none. Adds explicit metadata for save/reload acceptance and releases pause.

### tests/browser/hub-door1517.cjs:42

@function hub-door1517.saveBytes — Inputs: none. Returns exact playtest export Blob text.

### tests/browser/hub-door1517.cjs:43

@function hub-door1517.reloadReady — Inputs: none. Returns whether fresh APIs exist.

### tests/browser/hub-door1517.cjs:43

@function hub-door1517.restoreReady — Inputs: none. Returns metadata restored from exact playtest export.

### tests/browser/hub-door1517.cjs:43

@function hub-door1517.restoredStack — Inputs: compact stack. Returns metadata match.

### tests/browser/hub-door1517.cjs:43

@function hub-door1517.restoredCell — Inputs: none. Returns active saved cell.

### tests/browser/hub-door1517.cjs:43

@function hub-door1517.restoredDoor — Inputs: none. Returns authored door presence in restored project.

### tests/browser/hub-door1517.cjs:43

@function hub-door1517.savedMap — Inputs: map. Returns stable hub ID match.

### tests/browser/hub-door1517.cjs:43

@function hub-door1517.savedDoor — Inputs: event. Returns test door name match.

### tests/browser/hub-door1517.cjs:45

@function hub-door1517.failure â€” Inputs: failure. Reports evidence and sets nonzero exit status; no assertion bypass.

### tests/browser/isolated-return.cjs:3

@function isolated-return.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p on; p goto.

### tests/browser/isolated-return.cjs:3

@function isolated-return.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/isolated-return.cjs:3

@function isolated-return.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/isolated-return.cjs:3

@function isolated-return.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/isolated-return.cjs:3

@function isolated-return.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/isolated-return.cjs:4

@function isolated-return.callback.6 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: y; x. Uses: document get element by id; v get bounding client rect; frontier render ground point; frontier render pick. Returns: a record containing x, y.

### tests/browser/isolated-return.cjs:5

@function isolated-return.create.7 — Builds a new instance and its public operations from the supplied configuration. Inputs: no explicit arguments; uses enclosing module state. Uses: p mouse click; p get by role using "menuitem", a record containing name click; p get by role; p wait for selector.

### tests/browser/isolated-return.cjs:6

@function isolated-return.callback.8 — Returns g source world events length. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length.

### tests/browser/isolated-return.cjs:7

@function isolated-return.callback.9 — Returns g source world events length. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length.

### tests/browser/isolated-return.cjs:7

@function isolated-return.callback.10 — Returns g source world events at 0 pages at 0 commands at 0 lines at 0. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 pages at 0 commands at 0 lines at 0.

### tests/browser/isolated-return.cjs:7

@function isolated-return.callback.11 — Returns e click using . Inputs: e. Uses: e click. Returns: e click using .

### tests/browser/isolated-return.cjs:7

@function isolated-return.callback.12 — Returns g event session message. Inputs: no explicit arguments; uses enclosing module state. Returns: g event session message.

### tests/browser/isolated-return.cjs:7

@function isolated-return.callback.13 — Returns g event session message text. Inputs: no explicit arguments; uses enclosing module state. Returns: g event session message text.

### tests/browser/isolated-return.cjs:7

@function isolated-return.callback.14 — Returns the inverse of g event session busy. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of g event session busy.

### tests/browser/isolated-return.cjs:7

@function isolated-return.callback.15 — Returns g event session state skills set using "temporary-test", 99. Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state skills set. Returns: g event session state skills set using "temporary-test", 99.

### tests/browser/isolated-return.cjs:7

@function isolated-return.callback.16 — Returns g event session state skills has using "temporary-test". Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state skills has. Returns: g event session state skills has using "temporary-test".

### tests/browser/isolated-return.cjs:7

@function isolated-return.callback.17 — Returns g source world events at 0 name. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 name.

### tests/browser/isolated-return.cjs:7

@function isolated-return.callback.18 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; require; b new page; p on.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.5 — Returns window g and frontier pixi app. Inputs: no explicit arguments; uses enclosing module state. Returns: window g and frontier pixi app.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.6 — Returns frontier world validate using g source world transition effect. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier world validate. Returns: frontier world validate using g source world transition effect.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.7 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: e pages at 0 commands; window old x. Uses: frontier events create; g event session events push; g event session start.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.8 — Returns document query selector using "#gameFrame canvas[aria-hidden=\"true\"]". Inputs: no explicit arguments; uses enclosing module state. Uses: document query selector. Returns: document query selector using "#gameFrame canvas[aria-hidden=\"true\"]".

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.9 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: document query selector; c get context using "2d" get image data; c get context; a some. Returns: a some using a callback.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.10 — Returns i % 4 does not equal 3 and v is greater than 30. Inputs: v; i. Returns: i % 4 does not equal 3 and v is greater than 30.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.11 — Returns the inverse of document query selector using "#gameFrame canvas[aria-hidden=\"true\"]". Inputs: no explicit arguments; uses enclosing module state. Uses: document query selector. Returns: the inverse of document query selector using "#gameFrame canvas[aria-hidden=\"true\"]".

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.12 — Returns g event session state skills get using "MeltDone" equals 1. Inputs: no explicit arguments; uses enclosing module state. Uses: g event session state skills get. Returns: g event session state skills get using "MeltDone" equals 1.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.13 — Returns g player x. Inputs: no explicit arguments; uses enclosing module state. Returns: g player x.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.14 — Returns g source world interior mode. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world interior mode.

### tests/browser/melt-crossmap.cjs:2

@function melt-crossmap.callback.15 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-authoring.cjs:3

@function model-authoring.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Updates: files at n. Uses: chromium launch; require; b new page; p on.

### tests/browser/model-authoring.cjs:3

@function model-authoring.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-authoring.cjs:3

@function model-authoring.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/model-authoring.cjs:3

@function model-authoring.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/model-authoring.cjs:3

@function model-authoring.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/model-authoring.cjs:3

@function model-authoring.callback.6 — Provides the callback for p evaluate. Inputs: files. Uses: frontier model library import bundle; object from entries; object entries using files map; object entries.

### tests/browser/model-authoring.cjs:3

@function model-authoring.callback.7 — Returns a list of k, uint8 array from using atob using v, a callback. Inputs: array pattern. Uses: uint8 array from; atob. Returns: a list of k, uint8 array from using atob using v, a callback.

### tests/browser/model-authoring.cjs:3

@function model-authoring.callback.8 — Returns c char code at using 0. Inputs: c. Uses: c char code at. Returns: c char code at using 0.

### tests/browser/model-authoring.cjs:4

@function model-authoring.callback.9 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: y; x. Uses: document get element by id; v get bounding client rect; frontier render ground point; frontier render pick. Returns: a record containing x, y.

### tests/browser/model-authoring.cjs:5

@function model-authoring.create.10 — Builds a new instance and its public operations from the supplied configuration. Inputs: no explicit arguments; uses enclosing module state. Uses: p mouse click; p get by role using "menuitem", a record containing name click; p get by role; p wait for selector.

### tests/browser/model-authoring.cjs:6

@function model-authoring.callback.11 — Returns g source world events length. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length.

### tests/browser/model-authoring.cjs:7

@function model-authoring.callback.12 — Returns g source world events at 0 pages at 0 solid. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 pages at 0 solid.

### tests/browser/model-authoring.cjs:7

@function model-authoring.callback.13 — Returns g source world events length. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length.

### tests/browser/model-authoring.cjs:7

@function model-authoring.callback.14 — Returns g source world events at 0 spatial model id. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 spatial model id.

### tests/browser/model-authoring.cjs:7

@function model-authoring.callback.15 — Returns g source world events at 0 pages at 0 commands at 0 lines at 0. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 pages at 0 commands at 0 lines at 0.

### tests/browser/model-authoring.cjs:7

@function model-authoring.callback.16 — Returns g source world events at 0 name. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 name.

### tests/browser/model-authoring.cjs:7

@function model-authoring.callback.17 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: y; x. Uses: document get element by id; v get bounding client rect; frontier render pick; error. Returns: a record containing x, y.

### tests/browser/model-authoring.cjs:7

@function model-authoring.callback.18 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: object assign; frontier terrain height.

### tests/browser/model-authoring.cjs:7

@function model-authoring.callback.19 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: y; x. Uses: document get element by id; v get bounding client rect; frontier render pick; error. Returns: a record containing x, y.

### tests/browser/model-authoring.cjs:7

@function model-authoring.callback.20 — Returns g event session message. Inputs: no explicit arguments; uses enclosing module state. Returns: g event session message.

### tests/browser/model-authoring.cjs:7

@function model-authoring.callback.21 — Returns g event session message text. Inputs: no explicit arguments; uses enclosing module state. Returns: g event session message text.

### tests/browser/model-authoring.cjs:7

@function model-authoring.callback.22 — Returns the inverse of g event session busy. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of g event session busy.

### tests/browser/model-authoring.cjs:7

@function model-authoring.callback.23 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-camera-recovery.cjs:2

@function model-camera-recovery.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; browser new page; page on; page add init script.

### tests/browser/model-camera-recovery.cjs:2

@function model-camera-recovery.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-camera-recovery.cjs:2

@function model-camera-recovery.callback.3 — Provides the callback for page add init script. Inputs: no explicit arguments; uses enclosing module state. Uses: object define property.

### tests/browser/model-camera-recovery.cjs:2

@function model-camera-recovery.get.4 — Returns value. Inputs: no explicit arguments; uses enclosing module state. Returns: value.

### tests/browser/model-camera-recovery.cjs:2

@function model-camera-recovery.set.5 — Handles set within model camera recovery. Inputs: v. Updates: v create; value.

### tests/browser/model-camera-recovery.cjs:2

@function model-camera-recovery.create.6 — Builds a new instance and its public operations from the supplied configuration. Inputs: rest element. Updates: window library. Uses: create. Returns: assignment.

### tests/browser/model-camera-recovery.cjs:2

@function model-camera-recovery.callback.7 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/model-camera-recovery.cjs:2

@function model-camera-recovery.draw.8 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/model-camera-recovery.cjs:2

@function model-camera-recovery.callback.9 — Returns window g and window library. Inputs: no explicit arguments; uses enclosing module state. Returns: window g and window library.

### tests/browser/model-camera-recovery.cjs:6

@function model-camera-recovery.callback.10 — Provides the callback for page evaluate. Inputs: bytes. Updates: w objects; w events; w terrain; e spatial. Uses: frontier model library import bundle; uint8 array from; atob; library snapshot.

### tests/browser/model-camera-recovery.cjs:6

@function model-camera-recovery.callback.11 — Returns c char code at using 0. Inputs: c. Uses: c char code at. Returns: c char code at using 0.

### tests/browser/model-camera-recovery.cjs:6

@function model-camera-recovery.callback.12 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### tests/browser/model-camera-recovery.cjs:7

@function model-camera-recovery.callback.13 — Returns g scene events some using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: g scene events some. Returns: g scene events some using a callback.

### tests/browser/model-camera-recovery.cjs:7

@function model-camera-recovery.callback.14 — Returns e model id equals "real-building". Inputs: e. Returns: e model id equals "real-building".

### tests/browser/model-camera-recovery.cjs:8

@function model-camera-recovery.callback.15 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: p x; p y; p z; p grounded; g scene events. Uses: g scene events find; frontier model library get; frontier model events matrix; frontier model collision support. Returns: a record containing checks, retractions.

### tests/browser/model-camera-recovery.cjs:8

@function model-camera-recovery.callback.16 — Returns e id equals "building". Inputs: e. Returns: e id equals "building".

### tests/browser/model-camera-recovery.cjs:15

@function model-camera-recovery.callback.17 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: g player x; g player y; g player z; g player grounded; g player vertical velocity. Uses: frontier player recovery remember.

### tests/browser/model-camera-recovery.cjs:16

@function model-camera-recovery.callback.18 — Returns g player vertical velocity equals 0 and g player grounded and g recovery debug success. Inputs: no explicit arguments; uses enclosing module state. Returns: g player vertical velocity equals 0 and g player grounded and g recovery debug success.

### tests/browser/model-camera-recovery.cjs:17

@function model-camera-recovery.callback.19 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p on; p add init script.

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.3 — Provides the callback for p add init script. Inputs: no explicit arguments; uses enclosing module state. Uses: object define property.

### tests/browser/model-crossing.cjs:2

@function model-crossing.get.4 — Returns value. Inputs: no explicit arguments; uses enclosing module state. Returns: value.

### tests/browser/model-crossing.cjs:2

@function model-crossing.set.5 — Handles set within model crossing. Inputs: v. Updates: v create; value.

### tests/browser/model-crossing.cjs:2

@function model-crossing.create.6 — Builds a new instance and its public operations from the supplied configuration. Inputs: rest element. Updates: window library. Uses: create. Returns: assignment.

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.7 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/model-crossing.cjs:2

@function model-crossing.draw.8 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.9 — Returns window g and window library. Inputs: no explicit arguments; uses enclosing module state. Returns: window g and window library.

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.10 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: world objects; world events; world terrain; enter pages at 0 commands; exit pages at 0 commands. Uses: library snapshot; project maps find; frontier events create; frontier model events validate.

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.11 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.12 — Returns a record containing id, eventId, trigger, size, transform. Inputs: trigger. Returns: a record containing id, eventId, trigger, size, transform.

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.13 — Returns chain equals "Entered volume". Inputs: no explicit arguments; uses enclosing module state. Returns: chain equals "Entered volume".

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.14 — Returns g model zone debug trigger. Inputs: no explicit arguments; uses enclosing module state. Returns: g model zone debug trigger.

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.15 — Returns the inverse of g event session busy. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of g event session busy.

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.16 — Returns chain equals "Exited volume". Inputs: no explicit arguments; uses enclosing module state. Returns: chain equals "Exited volume".

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.17 — Returns g model zone debug trigger. Inputs: no explicit arguments; uses enclosing module state. Returns: g model zone debug trigger.

### tests/browser/model-crossing.cjs:2

@function model-crossing.callback.18 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-editor.cjs:2

@function model-editor.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p on; p goto.

### tests/browser/model-editor.cjs:2

@function model-editor.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-editor.cjs:2

@function model-editor.callback.3 — Returns window frontier model editor and window frontier events. Inputs: no explicit arguments; uses enclosing module state. Returns: window frontier model editor and window frontier events.

### tests/browser/model-editor.cjs:2

@function model-editor.callback.4 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: window fixture; window saved. Uses: frontier events create; frontier model editor open.

### tests/browser/model-editor.cjs:2

@function model-editor.callback.5 — Returns assignment. Inputs: v. Updates: saved. Returns: assignment.

### tests/browser/model-editor.cjs:2

@function model-editor.callback.6 — Returns frontier events validate using a list of a record containing copied fields, spatial at 0 spatial. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier events validate. Returns: frontier events validate using a list of a record containing copied fields, spatial at 0 spatial.

### tests/browser/model-editor.cjs:2

@function model-editor.callback.7 — Returns frontier model editor open using a record containing copied fields, spatial, a list of fixture, a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model editor open. Returns: frontier model editor open using a record containing copied fields, spatial, a list of fixture, a callback.

### tests/browser/model-editor.cjs:2

@function model-editor.callback.8 — Provides the callback for frontier model editor open. Inputs: no explicit arguments; uses enclosing module state. Uses: error.

### tests/browser/model-editor.cjs:2

@function model-editor.callback.9 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-geometry.cjs:2

@function model-geometry.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p goto; path resolve using "index.html" replace all.

### tests/browser/model-geometry.cjs:2

@function model-geometry.callback.2 — Returns window frontier model renderer. Inputs: no explicit arguments; uses enclosing module state. Returns: window frontier model renderer.

### tests/browser/model-geometry.cjs:2

@function model-geometry.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: canvas width; canvas height; ctx terrain depth. Uses: document create element; canvas get context; ctx clear rect; face. Returns: a record containing cases, behind, front.

### tests/browser/model-geometry.cjs:2

@function model-geometry.face.4 — Returns a record containing points, color. Inputs: y; color. Returns: a record containing points, color.

### tests/browser/model-geometry.cjs:2

@function model-geometry.callback.5 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-gizmo.cjs:2

@function model-gizmo.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p on; p goto.

### tests/browser/model-gizmo.cjs:2

@function model-gizmo.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-gizmo.cjs:2

@function model-gizmo.callback.3 — Returns window frontier model gizmo. Inputs: no explicit arguments; uses enclosing module state. Returns: window frontier model gizmo.

### tests/browser/model-gizmo.cjs:2

@function model-gizmo.callback.4 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: window event fixture. Uses: frontier events create; frontier model editor open.

### tests/browser/model-gizmo.cjs:2

@function model-gizmo.callback.5 — Returns assignment. Inputs: v. Updates: window accepted. Returns: assignment.

### tests/browser/model-gizmo.cjs:2

@function model-gizmo.drag.6 — Handles drag within model gizmo. Inputs: assignment pattern. Uses: canvas bounding box; p mouse move; p mouse down; p mouse up.

### tests/browser/model-gizmo.cjs:2

@function model-gizmo.callback.7 — Returns event fixture spatial. Inputs: no explicit arguments; uses enclosing module state. Returns: event fixture spatial.

### tests/browser/model-gizmo.cjs:2

@function model-gizmo.callback.8 — Returns accepted interaction zones at 0 transform position at 0. Inputs: no explicit arguments; uses enclosing module state. Returns: accepted interaction zones at 0 transform position at 0.

### tests/browser/model-gizmo.cjs:2

@function model-gizmo.callback.9 — Returns accepted interaction zones at 0 size at 0. Inputs: no explicit arguments; uses enclosing module state. Returns: accepted interaction zones at 0 size at 0.

### tests/browser/model-gizmo.cjs:2

@function model-gizmo.callback.10 — Returns accepted interaction zones at 0 transform rotation at 0. Inputs: no explicit arguments; uses enclosing module state. Returns: accepted interaction zones at 0 transform rotation at 0.

### tests/browser/model-gizmo.cjs:2

@function model-gizmo.callback.11 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-library.cjs:2

@function model-library.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: require using "fs" mkdir sync; require; chromium launch; path resolve.

### tests/browser/model-library.cjs:2

@function model-library.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-library.cjs:2

@function model-library.callback.3 — Provides the callback for p add init script. Inputs: no explicit arguments; uses enclosing module state. Uses: object define property.

### tests/browser/model-library.cjs:2

@function model-library.get.4 — Returns value. Inputs: no explicit arguments; uses enclosing module state. Returns: value.

### tests/browser/model-library.cjs:2

@function model-library.set.5 — Handles set within shared 3D assets. Inputs: v. Updates: v create; value.

### tests/browser/model-library.cjs:2

@function model-library.create.6 — Builds a new instance and its public operations from the supplied configuration. Inputs: rest element. Updates: window library. Uses: create. Returns: result.

### tests/browser/model-library.cjs:2

@function model-library.callback.7 — Returns window frontier model workbench. Inputs: no explicit arguments; uses enclosing module state. Returns: window frontier model workbench.

### tests/browser/model-library.cjs:2

@function model-library.callback.8 — Returns frontier model workbench open using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model workbench open. Returns: frontier model workbench open using a callback.

### tests/browser/model-library.cjs:2

@function model-library.callback.9 — Returns assignment. Inputs: id. Updates: window selected model. Returns: assignment.

### tests/browser/model-library.cjs:2

@function model-library.callback.10 — Returns frontier model library get using "panel-ui". Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model library get. Returns: frontier model library get using "panel-ui".

### tests/browser/model-library.cjs:2

@function model-library.callback.11 — Provides the callback for d locator using "canvas" evaluate. Inputs: c. Updates: i. Uses: c get context using "2d" get image data; c get context. Returns: count.

### tests/browser/model-library.cjs:2

@function model-library.callback.12 — Returns selected model. Inputs: no explicit arguments; uses enclosing module state. Returns: selected model.

### tests/browser/model-library.cjs:2

@function model-library.callback.13 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: event spatial. Uses: library snapshot; frontier events create; frontier model events validate; project maps find using a callback world events push.

### tests/browser/model-library.cjs:2

@function model-library.callback.14 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### tests/browser/model-library.cjs:2

@function model-library.callback.15 — Returns frontier model library get using "panel-ui" and library snapshot using maps some using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model library get; library snapshot using maps some; library snapshot. Returns: frontier model library get using "panel-ui" and library snapshot using maps some using a callback.

### tests/browser/model-library.cjs:2

@function model-library.callback.16 — Returns m world events some using a callback. Inputs: m. Uses: m world events some. Returns: m world events some using a callback.

### tests/browser/model-library.cjs:2

@function model-library.callback.17 — Returns e id equals "model-saved" and chain equals "panel-ui" and e spatial collision mode equals "mesh". Inputs: e. Returns: e id equals "model-saved" and chain equals "panel-ui" and e spatial collision mode equals "mesh".

### tests/browser/model-library.cjs:2

@function model-library.callback.18 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: project models at 0 name; model materials at 0 pbr metallic roughness base color factor; project models at 0 files at "panel.gltf". Uses: library snapshot; json parse; atob; btoa. Returns: project.

### tests/browser/model-library.cjs:2

@function model-library.callback.19 — Returns frontier model library list using length equals 2. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model library list. Returns: frontier model library list using length equals 2.

### tests/browser/model-library.cjs:2

@function model-library.callback.20 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: library snapshot; project maps find using a callback world events find; project maps find; frontier model library get. Returns: a record containing old, added, color.

### tests/browser/model-library.cjs:2

@function model-library.callback.21 — Returns m id equals "demo". Inputs: m. Returns: m id equals "demo".

### tests/browser/model-library.cjs:2

@function model-library.callback.22 — Returns e id equals "model-saved". Inputs: e. Returns: e id equals "model-saved".

### tests/browser/model-library.cjs:2

@function model-library.callback.23 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### tests/browser/model-library.cjs:2

@function model-library.callback.24 — Returns e id equals "model-saved". Inputs: e. Returns: e id equals "model-saved".

### tests/browser/model-library.cjs:2

@function model-library.callback.25 — Returns m world events some using a callback. Inputs: m. Uses: m world events some. Returns: m world events some using a callback.

### tests/browser/model-library.cjs:2

@function model-library.callback.26 — Returns e id equals "model-saved" and e spatial collision mode equals "mesh". Inputs: e. Returns: e id equals "model-saved" and e spatial collision mode equals "mesh".

### tests/browser/model-library.cjs:2

@function model-library.callback.27 — Returns m files at "panel.bin". Inputs: m. Returns: m files at "panel.bin".

### tests/browser/model-library.cjs:2

@function model-library.callback.28 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-mesh-movement.cjs:2

@function model-mesh-movement.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; browser new page; page on; page add init script.

### tests/browser/model-mesh-movement.cjs:2

@function model-mesh-movement.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-mesh-movement.cjs:2

@function model-mesh-movement.callback.3 — Provides the callback for page add init script. Inputs: no explicit arguments; uses enclosing module state. Uses: object define property.

### tests/browser/model-mesh-movement.cjs:2

@function model-mesh-movement.get.4 — Returns value. Inputs: no explicit arguments; uses enclosing module state. Returns: value.

### tests/browser/model-mesh-movement.cjs:2

@function model-mesh-movement.set.5 — Handles set within model mesh movement. Inputs: v. Updates: v create; value.

### tests/browser/model-mesh-movement.cjs:2

@function model-mesh-movement.create.6 — Builds a new instance and its public operations from the supplied configuration. Inputs: rest element. Updates: window library. Uses: create. Returns: assignment.

### tests/browser/model-mesh-movement.cjs:2

@function model-mesh-movement.callback.7 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/model-mesh-movement.cjs:2

@function model-mesh-movement.draw.8 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/model-mesh-movement.cjs:2

@function model-mesh-movement.callback.9 — Returns window g and window library. Inputs: no explicit arguments; uses enclosing module state. Returns: window g and window library.

### tests/browser/model-mesh-movement.cjs:3

@function model-mesh-movement.callback.10 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: world objects; world events; world terrain; window start; host spatial. Uses: wall; bytes set; frontier model library import bundle; a new text encoder encode.

### tests/browser/model-mesh-movement.cjs:3

@function model-mesh-movement.wall.11 — Handles wall within model mesh movement. Inputs: x0; x1; z0; z1. Uses: vertices push; indices push.

### tests/browser/model-mesh-movement.cjs:3

@function model-mesh-movement.callback.12 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### tests/browser/model-mesh-movement.cjs:3

@function model-mesh-movement.callback.13 — Returns g scene events some using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: g scene events some. Returns: g scene events some using a callback.

### tests/browser/model-mesh-movement.cjs:3

@function model-mesh-movement.callback.14 — Returns e model id equals "door-building". Inputs: e. Returns: e model id equals "door-building".

### tests/browser/model-mesh-movement.cjs:3

@function model-mesh-movement.callback.15 — Returns g scene events find using a callback solid. Inputs: no explicit arguments; uses enclosing module state. Uses: g scene events find. Returns: g scene events find using a callback solid.

### tests/browser/model-mesh-movement.cjs:3

@function model-mesh-movement.callback.16 — Returns e id equals "building". Inputs: e. Returns: e id equals "building".

### tests/browser/model-mesh-movement.cjs:3

@function model-mesh-movement.callback.17 — Returns g player y is greater than start y plus 2. Inputs: no explicit arguments; uses enclosing module state. Returns: g player y is greater than start y plus 2.

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.18 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: g player x; g player y; g player z; g player grounded.

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.19 — Returns g player y is less than start y plus 1.4. Inputs: no explicit arguments; uses enclosing module state. Returns: g player y is less than start y plus 1.4.

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.20 — Returns chain. Inputs: no explicit arguments; uses enclosing module state. Returns: chain.

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.21 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: library snapshot; library restore; json parse; json stringify.

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.22 — Returns chain equals "mesh". Inputs: no explicit arguments; uses enclosing module state. Uses: g scene events find. Returns: chain equals "mesh".

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.23 — Returns e id equals "building". Inputs: e. Returns: e id equals "building".

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.24 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: library snapshot; project maps find using a callback world events find; project maps find; frontier model editor open.

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.25 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.26 — Returns e id equals "building". Inputs: e. Returns: e id equals "building".

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.27 — Returns assignment. Inputs: v. Updates: window applied collision. Returns: assignment.

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.28 — Returns applied collision collision mode. Inputs: no explicit arguments; uses enclosing module state. Returns: applied collision collision mode.

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.29 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: canvas width; canvas height; ctx fill. Uses: document create element; canvas get context; ctx fill bind; frontier model debug draw. Returns: a record containing hidden, visible.

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.fill.30 — Handles fill within model mesh movement. Inputs: no explicit arguments; uses enclosing module state. Uses: fill.

### tests/browser/model-mesh-movement.cjs:4

@function model-mesh-movement.callback.31 — Returns g authoring equals true. Inputs: no explicit arguments; uses enclosing module state. Returns: g authoring equals true.

### tests/browser/model-mesh-movement.cjs:5

@function model-mesh-movement.callback.32 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-mesh-performance.cjs:2

@function model-mesh-performance.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Updates: files at name. Uses: chromium launch; b new page; fs read file sync using dir plus "/" plus name to string; fs read file sync.

### tests/browser/model-mesh-performance.cjs:2

@function model-mesh-performance.callback.2 — Returns window frontier model renderer. Inputs: no explicit arguments; uses enclosing module state. Returns: window frontier model renderer.

### tests/browser/model-mesh-performance.cjs:2

@function model-mesh-performance.callback.3 — Provides the callback for p evaluate. Inputs: files. Updates: canvas width; canvas height; ctx terrain depth; stats; tested triangles. Uses: object from entries; object entries using files map; object entries; performance now. Returns: a record containing collisionTriangles, sharedCollision, buildMs, collisionInstances, collisionSamples, collisionMedianMs, collisionP95Ms, testedTriangles.

### tests/browser/model-mesh-performance.cjs:2

@function model-mesh-performance.callback.4 — Returns a list of k, uint8 array from using atob using v, a callback. Inputs: array pattern. Uses: uint8 array from; atob. Returns: a list of k, uint8 array from using atob using v, a callback.

### tests/browser/model-mesh-performance.cjs:2

@function model-mesh-performance.callback.5 — Returns c char code at using 0. Inputs: c. Uses: c char code at. Returns: c char code at using 0.

### tests/browser/model-mesh-performance.cjs:2

@function model-mesh-performance.callback.6 — Returns a minus b. Inputs: a; b. Returns: a minus b.

### tests/browser/model-mesh-performance.cjs:2

@function model-mesh-performance.callback.7 — Returns frontier model transform matrix using a record containing position, rotation, scale. Inputs: ; i. Uses: frontier model transform matrix. Returns: frontier model transform matrix using a record containing position, rotation, scale.

### tests/browser/model-mesh-performance.cjs:2

@function model-mesh-performance.callback.8 — Returns a minus b. Inputs: a; b. Returns: a minus b.

### tests/browser/model-mesh-performance.cjs:2

@function model-mesh-performance.callback.9 — Returns n plus p data byte length. Inputs: n; p. Returns: n plus p data byte length.

### tests/browser/model-mesh-performance.cjs:2

@function model-mesh-performance.callback.10 — Returns n plus p data byte length. Inputs: n; p. Returns: n plus p data byte length.

### tests/browser/model-mesh-performance.cjs:2

@function model-mesh-performance.callback.11 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-overlap.cjs:2

@function model-overlap.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p on; p goto.

### tests/browser/model-overlap.cjs:2

@function model-overlap.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-overlap.cjs:2

@function model-overlap.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/model-overlap.cjs:2

@function model-overlap.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/model-overlap.cjs:2

@function model-overlap.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/model-overlap.cjs:2

@function model-overlap.callback.6 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: logic range; logic pages at 0 commands; frontier activity query; second id; second spatial interaction zones at 0 id. Uses: object assign; frontier events create; g event session events push; frontier model events validate. Returns: a record containing id, off, far, blocked, started, text.

### tests/browser/model-overlap.cjs:2

@function model-overlap.query.7 — Finds records or geometry intersecting the requested region. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of host.

### tests/browser/model-overlap.cjs:2

@function model-overlap.query.8 — Finds records or geometry intersecting the requested region. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of host, a record containing id, modelId, x, y, z.

### tests/browser/model-overlap.cjs:2

@function model-overlap.callback.9 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-performance.cjs:2

@function model-performance.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Updates: files at name. Uses: chromium launch; b new page; fs read file sync using dir plus "/" plus name to string; fs read file sync.

### tests/browser/model-performance.cjs:2

@function model-performance.callback.2 — Returns window frontier model renderer. Inputs: no explicit arguments; uses enclosing module state. Returns: window frontier model renderer.

### tests/browser/model-performance.cjs:2

@function model-performance.callback.3 — Provides the callback for p evaluate. Inputs: files. Updates: canvas width; canvas height; ctx terrain depth; stats. Uses: object from entries; object entries using files map; object entries; performance now. Returns: a record containing glbTriangles, glbTextureBytes, culledBehind, culledSide, visibleCenter, triangles, vertices, textureBytes.

### tests/browser/model-performance.cjs:2

@function model-performance.callback.4 — Returns a list of k, uint8 array from using atob using v, a callback. Inputs: array pattern. Uses: uint8 array from; atob. Returns: a list of k, uint8 array from using atob using v, a callback.

### tests/browser/model-performance.cjs:2

@function model-performance.callback.5 — Returns c char code at using 0. Inputs: c. Uses: c char code at. Returns: c char code at using 0.

### tests/browser/model-performance.cjs:2

@function model-performance.callback.6 — Returns a minus b. Inputs: a; b. Returns: a minus b.

### tests/browser/model-performance.cjs:2

@function model-performance.callback.7 — Returns n plus p data byte length. Inputs: n; p. Returns: n plus p data byte length.

### tests/browser/model-performance.cjs:2

@function model-performance.callback.8 — Returns n plus p data byte length. Inputs: n; p. Returns: n plus p data byte length.

### tests/browser/model-performance.cjs:2

@function model-performance.callback.9 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-real-building.cjs:2

@function model-real-building.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; browser new page; page on; page add init script.

### tests/browser/model-real-building.cjs:2

@function model-real-building.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-real-building.cjs:2

@function model-real-building.callback.3 — Provides the callback for page add init script. Inputs: no explicit arguments; uses enclosing module state. Uses: object define property.

### tests/browser/model-real-building.cjs:2

@function model-real-building.get.4 — Returns value. Inputs: no explicit arguments; uses enclosing module state. Returns: value.

### tests/browser/model-real-building.cjs:2

@function model-real-building.set.5 — Handles set within model real building. Inputs: v. Updates: v create; value.

### tests/browser/model-real-building.cjs:2

@function model-real-building.create.6 — Builds a new instance and its public operations from the supplied configuration. Inputs: rest element. Updates: window library. Uses: create. Returns: assignment.

### tests/browser/model-real-building.cjs:2

@function model-real-building.callback.7 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/model-real-building.cjs:2

@function model-real-building.draw.8 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/model-real-building.cjs:2

@function model-real-building.callback.9 — Returns window g and window library. Inputs: no explicit arguments; uses enclosing module state. Returns: window g and window library.

### tests/browser/model-real-building.cjs:6

@function model-real-building.callback.10 — Provides the callback for page evaluate. Inputs: object pattern. Updates: world objects; world events; world terrain; window start; host spatial. Uses: frontier model library get; frontier model library import bundle; uint8 array from; atob.

### tests/browser/model-real-building.cjs:6

@function model-real-building.callback.11 — Returns c char code at using 0. Inputs: c. Uses: c char code at. Returns: c char code at using 0.

### tests/browser/model-real-building.cjs:6

@function model-real-building.callback.12 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### tests/browser/model-real-building.cjs:6

@function model-real-building.callback.13 — Returns g scene events some using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: g scene events some. Returns: g scene events some using a callback.

### tests/browser/model-real-building.cjs:6

@function model-real-building.callback.14 — Returns e model id equals "real-building". Inputs: e. Returns: e model id equals "real-building".

### tests/browser/model-real-building.cjs:6

@function model-real-building.callback.15 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: g camera yaw. Returns: assignment.

### tests/browser/model-real-building.cjs:6

@function model-real-building.callback.16 — Returns g player x is less than start x minus 3 multiplied by v at 0 and g player z is greater than 1.5 multiplied by v at 2. Inputs: v. Returns: g player x is less than start x minus 3 multiplied by v at 0 and g player z is greater than 1.5 multiplied by v at 2.

### tests/browser/model-real-building.cjs:6

@function model-real-building.callback.17 — Returns a record containing p, start, step, support, hit. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier parameters get. Returns: a record containing p, start, step, support, hit.

### tests/browser/model-real-building.cjs:6

@function model-real-building.callback.18 — Returns g player z is greater than 1.8 multiplied by v at 2. Inputs: v. Returns: g player z is greater than 1.8 multiplied by v at 2.

### tests/browser/model-real-building.cjs:6

@function model-real-building.callback.19 — Returns g player grounded. Inputs: no explicit arguments; uses enclosing module state. Returns: g player grounded.

### tests/browser/model-real-building.cjs:6

@function model-real-building.callback.20 — Returns g player x. Inputs: no explicit arguments; uses enclosing module state. Returns: g player x.

### tests/browser/model-real-building.cjs:6

@function model-real-building.callback.21 — Returns g player x is less than x minus 0.1. Inputs: x. Returns: g player x is less than x minus 0.1.

### tests/browser/model-real-building.cjs:7

@function model-real-building.callback.22 — Provides the callback for page evaluate. Inputs: local x. Updates: g player x; g player y; g player z; g player grounded; g player vertical velocity. Uses: g scene events find; frontier model collision support; error.

### tests/browser/model-real-building.cjs:7

@function model-real-building.callback.23 — Returns e id equals "building". Inputs: e. Returns: e id equals "building".

### tests/browser/model-real-building.cjs:7

@function model-real-building.callback.24 — Returns g player grounded. Inputs: no explicit arguments; uses enclosing module state. Returns: g player grounded.

### tests/browser/model-real-building.cjs:7

@function model-real-building.callback.25 — Returns g player grounded equals false. Inputs: no explicit arguments; uses enclosing module state. Returns: g player grounded equals false.

### tests/browser/model-real-building.cjs:7

@function model-real-building.callback.26 — Returns g player grounded. Inputs: no explicit arguments; uses enclosing module state. Returns: g player grounded.

### tests/browser/model-real-building.cjs:7

@function model-real-building.callback.27 — Returns g player y. Inputs: no explicit arguments; uses enclosing module state. Returns: g player y.

### tests/browser/model-real-building.cjs:7

@function model-real-building.callback.28 — Returns math abs using g player y minus y is greater than 0.1. Inputs: y. Returns: math abs using g player y minus y is greater than 0.1.

### tests/browser/model-real-building.cjs:9

@function model-real-building.callback.29 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-render.cjs:2

@function model-render.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; browser new page; page on; page goto.

### tests/browser/model-render.cjs:2

@function model-render.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-render.cjs:2

@function model-render.callback.3 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/model-render.cjs:2

@function model-render.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/model-render.cjs:2

@function model-render.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/model-render.cjs:2

@function model-render.callback.6 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier activity query; g camera yaw; g camera pitch. Uses: frontier model library import bundle; a new text encoder encode; json stringify.

### tests/browser/model-render.cjs:2

@function model-render.query.7 — Finds records or geometry intersecting the requested region. Inputs: rest element. Uses: query. Returns: a list of spread element, a record containing id, kind, modelId, x, y, z, height.

### tests/browser/model-render.cjs:2

@function model-render.callback.8 — Returns chain is greater than 100. Inputs: no explicit arguments; uses enclosing module state. Returns: chain is greater than 100.

### tests/browser/model-render.cjs:2

@function model-render.callback.9 — Returns a record containing copied fields, shared. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model library get. Returns: a record containing copied fields, shared.

### tests/browser/model-render.cjs:2

@function model-render.callback.10 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-room-occlusion.cjs:2

@function model-room-occlusion.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p on; p goto.

### tests/browser/model-room-occlusion.cjs:2

@function model-room-occlusion.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-room-occlusion.cjs:2

@function model-room-occlusion.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/model-room-occlusion.cjs:2

@function model-room-occlusion.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/model-room-occlusion.cjs:2

@function model-room-occlusion.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/model-room-occlusion.cjs:2

@function model-room-occlusion.callback.6 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: logic range; logic pages at 0 commands; frontier activity query; host y; g source world interior. Uses: object assign; frontier events create; g event session events push; frontier model events validate. Returns: a record containing id, off, far, blocked, started, text, roomCameraBlocked, cameraClear.

### tests/browser/model-room-occlusion.cjs:2

@function model-room-occlusion.query.7 — Finds records or geometry intersecting the requested region. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of host.

### tests/browser/model-room-occlusion.cjs:2

@function model-room-occlusion.query.8 — Finds records or geometry intersecting the requested region. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of host, a record containing id, modelId, x, y, z.

### tests/browser/model-room-occlusion.cjs:2

@function model-room-occlusion.query.9 — Finds records or geometry intersecting the requested region. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of host.

### tests/browser/model-room-occlusion.cjs:2

@function model-room-occlusion.camera.10 — Calculates the camera view or constrains its position against this module’s solid geometry. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing x, y, z, yaw, pitch, cx, cy.

### tests/browser/model-room-occlusion.cjs:2

@function model-room-occlusion.callback.11 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-targeting.cjs:2

@function model-targeting.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p on; p goto.

### tests/browser/model-targeting.cjs:2

@function model-targeting.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-targeting.cjs:2

@function model-targeting.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/model-targeting.cjs:2

@function model-targeting.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/model-targeting.cjs:2

@function model-targeting.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/model-targeting.cjs:2

@function model-targeting.callback.6 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: logic range; logic pages at 0 commands; frontier activity query; host y. Uses: object assign; frontier events create; g event session events push; frontier model events validate. Returns: a record containing id, off, far, blocked, started, text.

### tests/browser/model-targeting.cjs:2

@function model-targeting.query.7 — Finds records or geometry intersecting the requested region. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of host.

### tests/browser/model-targeting.cjs:2

@function model-targeting.query.8 — Finds records or geometry intersecting the requested region. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of host, a record containing id, modelId, x, y, z.

### tests/browser/model-targeting.cjs:2

@function model-targeting.callback.9 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-walkable.cjs:2

@function model-walkable.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; browser new page; page on; page add init script.

### tests/browser/model-walkable.cjs:2

@function model-walkable.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-walkable.cjs:2

@function model-walkable.callback.3 — Provides the callback for page add init script. Inputs: no explicit arguments; uses enclosing module state. Uses: object define property.

### tests/browser/model-walkable.cjs:2

@function model-walkable.get.4 — Returns value. Inputs: no explicit arguments; uses enclosing module state. Returns: value.

### tests/browser/model-walkable.cjs:2

@function model-walkable.set.5 — Handles set within model walkable. Inputs: v. Updates: v create; value.

### tests/browser/model-walkable.cjs:2

@function model-walkable.create.6 — Builds a new instance and its public operations from the supplied configuration. Inputs: rest element. Updates: window library. Uses: create. Returns: assignment.

### tests/browser/model-walkable.cjs:2

@function model-walkable.callback.7 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/model-walkable.cjs:2

@function model-walkable.draw.8 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/model-walkable.cjs:2

@function model-walkable.callback.9 — Returns window g and window library. Inputs: no explicit arguments; uses enclosing module state. Returns: window g and window library.

### tests/browser/model-walkable.cjs:3

@function model-walkable.callback.10 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: world objects; world events; world terrain; window start; host spatial. Uses: quad; bytes set; frontier model library import bundle; a new text encoder encode.

### tests/browser/model-walkable.cjs:3

@function model-walkable.quad.11 — Handles quad within model walkable. Inputs: a; b; c; d. Uses: vertices push; indices push.

### tests/browser/model-walkable.cjs:3

@function model-walkable.callback.12 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### tests/browser/model-walkable.cjs:3

@function model-walkable.callback.13 — Returns g scene events some using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: g scene events some. Returns: g scene events some using a callback.

### tests/browser/model-walkable.cjs:3

@function model-walkable.callback.14 — Returns e model id equals "walk-building". Inputs: e. Returns: e model id equals "walk-building".

### tests/browser/model-walkable.cjs:3

@function model-walkable.callback.15 — Returns g player y is greater than start y plus 3. Inputs: no explicit arguments; uses enclosing module state. Returns: g player y is greater than start y plus 3.

### tests/browser/model-walkable.cjs:3

@function model-walkable.callback.16 — Returns math abs using g player z minus 0.6 is less than 0.001. Inputs: no explicit arguments; uses enclosing module state. Returns: math abs using g player z minus 0.6 is less than 0.001.

### tests/browser/model-walkable.cjs:3

@function model-walkable.callback.17 — Returns g player z is greater than 0.8. Inputs: no explicit arguments; uses enclosing module state. Returns: g player z is greater than 0.8.

### tests/browser/model-walkable.cjs:3

@function model-walkable.callback.18 — Returns g player grounded and math abs using g player z minus 0.6 is less than 0.001. Inputs: no explicit arguments; uses enclosing module state. Returns: g player grounded and math abs using g player z minus 0.6 is less than 0.001.

### tests/browser/model-walkable.cjs:3

@function model-walkable.callback.19 — Returns g player y is greater than start y plus 5.5. Inputs: no explicit arguments; uses enclosing module state. Returns: g player y is greater than start y plus 5.5.

### tests/browser/model-walkable.cjs:3

@function model-walkable.callback.20 — Returns g player grounded and math abs using g player z is less than 0.001. Inputs: no explicit arguments; uses enclosing module state. Returns: g player grounded and math abs using g player z is less than 0.001.

### tests/browser/model-walkable.cjs:4

@function model-walkable.callback.21 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Updates: files at n. Uses: chromium launch; b new page; p on; p add init script.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.3 — Provides the callback for p add init script. Inputs: no explicit arguments; uses enclosing module state. Uses: object define property.

### tests/browser/model-worlds.cjs:2

@function model-worlds.get.4 — Returns maps. Inputs: no explicit arguments; uses enclosing module state. Returns: maps.

### tests/browser/model-worlds.cjs:2

@function model-worlds.set.5 — Handles set within model worlds. Inputs: v. Updates: v create; maps.

### tests/browser/model-worlds.cjs:2

@function model-worlds.create.6 — Builds a new instance and its public operations from the supplied configuration. Inputs: rest element. Updates: window library. Uses: create. Returns: assignment.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.7 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/model-worlds.cjs:2

@function model-worlds.draw.8 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window game. Uses: draw. Returns: draw using c, g.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.9 — Returns window game and window library. Inputs: no explicit arguments; uses enclosing module state. Returns: window game and window library.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.10 — Provides the callback for p evaluate. Inputs: files. Uses: frontier model library import bundle; object from entries; object entries using files map; object entries.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.11 — Returns a list of k, uint8 array from using atob using v, a callback. Inputs: array pattern. Uses: uint8 array from; atob. Returns: a list of k, uint8 array from using atob using v, a callback.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.12 — Returns c char code at using 0. Inputs: c. Uses: c char code at. Returns: c char code at using 0.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.13 — Provides the callback for p evaluate. Inputs: id. Updates: e spatial; game camera yaw; game camera pitch. Uses: library snapshot; project maps find; frontier events create; frontier model events validate.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.14 — Returns m id equals id. Inputs: m. Returns: m id equals id.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.15 — Returns game scene events filter using a callback length equals 2. Inputs: no explicit arguments; uses enclosing module state. Uses: game scene events filter. Returns: game scene events filter using a callback length equals 2.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.16 — Returns e model id equals "world-fixture". Inputs: e. Returns: e model id equals "world-fixture".

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.17 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: logic range. Uses: game scene events find; game event session events find; frontier model events validate; frontier render project. Returns: a record containing edit, play, ray, point, range.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.18 — Returns e id equals "fixture-0". Inputs: e. Returns: e id equals "fixture-0".

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.19 — Returns e id equals host id. Inputs: e. Returns: e id equals host id.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.20 — Returns a record containing map, models, render, interior, textured. Inputs: no explicit arguments; uses enclosing module state. Uses: game scene events filter using a callback map; game scene events filter. Returns: a record containing map, models, render, interior, textured.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.21 — Returns e model id equals "world-fixture". Inputs: e. Returns: e model id equals "world-fixture".

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.22 — Returns a record containing z, expected, rotation, scale. Inputs: e. Uses: frontier terrain height. Returns: a record containing z, expected, rotation, scale.

### tests/browser/model-worlds.cjs:2

@function model-worlds.callback.23 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; require; b new page; p on.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/normal-worker.cjs:2

@function normal-worker.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.6 — Returns frontier normal workbench. Inputs: no explicit arguments; uses enclosing module state. Returns: frontier normal workbench.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.7 — Returns e click using . Inputs: e. Uses: e click. Returns: e click using .

### tests/browser/normal-worker.cjs:2

@function normal-worker.png.8 — Returns sharp using a record containing create png using to buffer using . Inputs: w; color. Uses: sharp using a record containing create png using to buffer; sharp using a record containing create png; sharp. Returns: sharp using a record containing create png using to buffer using .

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.9 — Returns document get element by id using "normalCanvas" width equals 32. Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id. Returns: document get element by id using "normalCanvas" width equals 32.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.10 — Returns document get element by id using "normalStatus" text content includes using "ready". Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id using "normalStatus" text content includes; document get element by id. Returns: document get element by id using "normalStatus" text content includes using "ready".

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.11 — Returns array from using document get element by id using "normalCanvas" get context using "2d" get image data using 16, 16, 1 data. Inputs: no explicit arguments; uses enclosing module state. Uses: array from; document get element by id using "normalCanvas" get context using "2d" get image data; document get element by id using "normalCanvas" get context; document get element by id. Returns: array from using document get element by id using "normalCanvas" get context using "2d" get image data using 16, 16, 1 data.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.12 — Returns document get element by id using "normalStatus" text content includes using "must match". Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id using "normalStatus" text content includes; document get element by id. Returns: document get element by id using "normalStatus" text content includes using "must match".

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.13 — Returns document get element by id using "normalStatus" text content includes using "Loaded candy-armed". Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id using "normalStatus" text content includes; document get element by id. Returns: document get element by id using "normalStatus" text content includes using "Loaded candy-armed".

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.14 — Returns chain equals 1. Inputs: no explicit arguments; uses enclosing module state. Returns: chain equals 1.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.15 — Returns frontier world validate using g source world sprite normals entries at 0 profile. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier world validate. Returns: frontier world validate using g source world sprite normals entries at 0 profile.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.16 — Returns frontier normal render cache debug using prepared is greater than 0. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier normal render cache debug. Returns: frontier normal render cache debug using prepared is greater than 0.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.17 — Returns frontier normal render cache debug using . Inputs: no explicit arguments; uses enclosing module state. Uses: frontier normal render cache debug. Returns: frontier normal render cache debug using .

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.18 — Returns frontier normal render cache debug using prepared. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier normal render cache debug. Returns: frontier normal render cache debug using prepared.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.19 — Returns e click using . Inputs: e. Uses: e click. Returns: e click using .

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.20 — Returns chain equals 0. Inputs: no explicit arguments; uses enclosing module state. Returns: chain equals 0.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.21 — Returns frontier normal render cache debug using bytes equals 0. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier normal render cache debug. Returns: frontier normal render cache debug using bytes equals 0.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.22 — Returns e click using . Inputs: e. Uses: e click. Returns: e click using .

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.23 — Returns chain equals 1. Inputs: no explicit arguments; uses enclosing module state. Returns: chain equals 1.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.24 — Returns m id equals project active. Inputs: m. Returns: m id equals project active.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.25 — Returns document get element by id using "importProject" value equals "". Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id. Returns: document get element by id using "importProject" value equals "".

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.26 — Returns chain equals 1. Inputs: no explicit arguments; uses enclosing module state. Returns: chain equals 1.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.27 — Returns frontier world validate using g source world sprite normals entries at 0 profile. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier world validate. Returns: frontier world validate using g source world sprite normals entries at 0 profile.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.28 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: a width; n width; a height; n height; ac fill style. Uses: document create element; a get context; n get context; ac fill rect. Returns: a record containing exact, cancelled.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.29 — Returns v equals expected data at i. Inputs: v; i. Returns: v equals expected data at i.

### tests/browser/normal-worker.cjs:2

@function normal-worker.callback.30 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/pages-ui.cjs:3

@function pages-ui.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p on; p goto.

### tests/browser/pages-ui.cjs:3

@function pages-ui.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/pages-ui.cjs:3

@function pages-ui.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/pages-ui.cjs:3

@function pages-ui.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/pages-ui.cjs:3

@function pages-ui.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/pages-ui.cjs:4

@function pages-ui.callback.6 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: y; x. Uses: document get element by id; v get bounding client rect; frontier render ground point; frontier render pick. Returns: a record containing x, y.

### tests/browser/pages-ui.cjs:5

@function pages-ui.create.7 — Builds a new instance and its public operations from the supplied configuration. Inputs: no explicit arguments; uses enclosing module state. Uses: p mouse click; p get by role using "menuitem", a record containing name click; p get by role; p wait for selector.

### tests/browser/pages-ui.cjs:6

@function pages-ui.callback.8 — Returns g source world events length. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length.

### tests/browser/pages-ui.cjs:7

@function pages-ui.callback.9 — Returns g source world events length. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events length.

### tests/browser/pages-ui.cjs:7

@function pages-ui.callback.10 — Returns g source world events at 0 pages length. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 pages length.

### tests/browser/pages-ui.cjs:7

@function pages-ui.callback.11 — Returns g source world events at 0 pages at 0 commands at 0 lines at 0. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 pages at 0 commands at 0 lines at 0.

### tests/browser/pages-ui.cjs:7

@function pages-ui.callback.12 — Returns g source world events at 0 name. Inputs: no explicit arguments; uses enclosing module state. Returns: g source world events at 0 name.

### tests/browser/pages-ui.cjs:7

@function pages-ui.callback.13 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; require; b new page; p on.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/party-travel.cjs:2

@function party-travel.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.6 — Returns g source world events some using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: g source world events some. Returns: g source world events some using a callback.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.7 — Returns e id equals "encounter-patrol". Inputs: e. Returns: e id equals "encounter-patrol".

### tests/browser/party-travel.cjs:2

@function party-travel.callback.8 — Returns g runtime entities get using "encounter-patrol". Inputs: no explicit arguments; uses enclosing module state. Uses: g runtime entities get. Returns: g runtime entities get using "encounter-patrol".

### tests/browser/party-travel.cjs:2

@function party-travel.callback.9 — Returns g runtime entities has using "encounter-companion". Inputs: no explicit arguments; uses enclosing module state. Uses: g runtime entities has. Returns: g runtime entities has using "encounter-companion".

### tests/browser/party-travel.cjs:2

@function party-travel.callback.10 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: g event session events find; g event session start; error.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.11 — Returns e id equals "recruit-companion". Inputs: e. Returns: e id equals "recruit-companion".

### tests/browser/party-travel.cjs:2

@function party-travel.callback.12 — Returns g event session message. Inputs: no explicit arguments; uses enclosing module state. Returns: g event session message.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.13 — Returns g runtime entities get using "encounter-companion". Inputs: no explicit arguments; uses enclosing module state. Uses: g runtime entities get. Returns: g runtime entities get using "encounter-companion".

### tests/browser/party-travel.cjs:2

@function party-travel.callback.14 — Returns g party membership has using "7". Inputs: no explicit arguments; uses enclosing module state. Uses: g party membership has. Returns: g party membership has using "7".

### tests/browser/party-travel.cjs:2

@function party-travel.callback.15 — Returns g runtime entities get using "encounter-patrol" hp. Inputs: no explicit arguments; uses enclosing module state. Uses: g runtime entities get. Returns: g runtime entities get using "encounter-patrol" hp.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.16 — Returns g runtime entities get using "encounter-patrol" hp is less than hp. Inputs: hp. Uses: g runtime entities get. Returns: g runtime entities get using "encounter-patrol" hp is less than hp.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.17 — Returns chain. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier party combat target; g runtime entities get. Returns: chain.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.18 — Returns g runtime entities get using "encounter-patrol" dead. Inputs: no explicit arguments; uses enclosing module state. Uses: g runtime entities get. Returns: g runtime entities get using "encounter-patrol" dead.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.19 — Returns g runtime entities get using "encounter-companion" dead. Inputs: no explicit arguments; uses enclosing module state. Uses: g runtime entities get. Returns: g runtime entities get using "encounter-companion" dead.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.20 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: enemy dead; enemy hp. Uses: g event session state actors clear; g runtime entities get.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.21 — Returns document get element by id using "loadCombat" value equals "". Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id. Returns: document get element by id using "loadCombat" value equals "".

### tests/browser/party-travel.cjs:2

@function party-travel.callback.22 — Returns g party membership has using "7" and chain. Inputs: no explicit arguments; uses enclosing module state. Uses: g party membership has; g runtime entities get. Returns: g party membership has using "7" and chain.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.23 — Returns g runtime entities get using "encounter-companion" dead. Inputs: no explicit arguments; uses enclosing module state. Uses: g runtime entities get. Returns: g runtime entities get using "encounter-companion" dead.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.24 — Returns g runtime entities get using "encounter-patrol" hp. Inputs: no explicit arguments; uses enclosing module state. Uses: g runtime entities get. Returns: g runtime entities get using "encounter-patrol" hp.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.25 — Returns m id equals saved project active. Inputs: m. Returns: m id equals saved project active.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.26 — Returns m id equals "demo". Inputs: m. Returns: m id equals "demo".

### tests/browser/party-travel.cjs:2

@function party-travel.callback.27 — Returns g event session capture behaviors using map using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: g event session capture behaviors using map; g event session capture behaviors. Returns: g event session capture behaviors using map using a callback.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.28 — Returns a list of v id, v home. Inputs: v. Returns: a list of v id, v home.

### tests/browser/party-travel.cjs:2

@function party-travel.travel.29 — Handles travel within party travel. Inputs: number; spawn. Uses: p evaluate.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.30 — Provides the callback for p evaluate. Inputs: object pattern. Updates: e pages at 0 commands. Uses: frontier events create; g event session events push; g event session start; error.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.31 — Returns g source world seed does not equal "patrol-party-example". Inputs: no explicit arguments; uses enclosing module state. Returns: g source world seed does not equal "patrol-party-example".

### tests/browser/party-travel.cjs:2

@function party-travel.callback.32 — Returns g party membership has using "7". Inputs: no explicit arguments; uses enclosing module state. Uses: g party membership has. Returns: g party membership has using "7".

### tests/browser/party-travel.cjs:2

@function party-travel.callback.33 — Returns g source world seed equals "patrol-party-example". Inputs: no explicit arguments; uses enclosing module state. Returns: g source world seed equals "patrol-party-example".

### tests/browser/party-travel.cjs:2

@function party-travel.callback.34 — Returns chain. Inputs: no explicit arguments; uses enclosing module state. Uses: g runtime entities get. Returns: chain.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.35 — Returns g runtime entities get using "encounter-patrol" hp. Inputs: no explicit arguments; uses enclosing module state. Uses: g runtime entities get. Returns: g runtime entities get using "encounter-patrol" hp.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.36 — Returns g party membership has using "7". Inputs: no explicit arguments; uses enclosing module state. Uses: g party membership has. Returns: g party membership has using "7".

### tests/browser/party-travel.cjs:2

@function party-travel.callback.37 — Returns g event session capture behaviors using map using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: g event session capture behaviors using map; g event session capture behaviors. Returns: g event session capture behaviors using map using a callback.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.38 — Returns a list of v id, v home. Inputs: v. Returns: a list of v id, v home.

### tests/browser/party-travel.cjs:2

@function party-travel.callback.39 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/placement.cjs:2

@function placement.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p goto; path resolve using "index.html" replace all.

### tests/browser/placement.cjs:2

@function placement.callback.2 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/placement.cjs:2

@function placement.draw.3 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/placement.cjs:2

@function placement.callback.4 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/browser/placement.cjs:2

@function placement.callback.5 — Returns es map using a callback. Inputs: es. Uses: es map. Returns: es map using a callback.

### tests/browser/placement.cjs:2

@function placement.callback.6 — Returns e value. Inputs: e. Returns: e value.

### tests/browser/placement.cjs:2

@function placement.callback.7 — Returns a list of "room-test", "outdoor-assets-test" includes using x. Inputs: x. Uses: a list of "room-test", "outdoor-assets-test" includes. Returns: a list of "room-test", "outdoor-assets-test" includes using x.

### tests/browser/placement.cjs:2

@function placement.callback.8 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: g source world terrain; g player z. Uses: frontier terrain height.

### tests/browser/placement.cjs:2

@function placement.callback.9 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: y; x. Uses: document get element by id; v get bounding client rect; frontier render ground point; frontier render pick. Returns: a record containing x, y, h.

### tests/browser/placement.cjs:2

@function placement.callback.10 — Returns g source world events find using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: g source world events find. Returns: g source world events find using a callback.

### tests/browser/placement.cjs:2

@function placement.callback.11 — Returns e name starts with using "Placement ". Inputs: e. Uses: e name starts with. Returns: e name starts with using "Placement ".

### tests/browser/placement.cjs:2

@function placement.callback.12 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/browser/sprite-scene1518.cjs:2

@function model-camera-recovery.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; browser new page; page on; page add init script.

### tests/browser/sprite-scene1518.cjs:2

@function model-camera-recovery.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser/sprite-scene1518.cjs:2

@function model-camera-recovery.callback.3 — Provides the callback for page add init script. Inputs: no explicit arguments; uses enclosing module state. Uses: object define property.

### tests/browser/sprite-scene1518.cjs:2

@function model-camera-recovery.get.4 — Returns value. Inputs: no explicit arguments; uses enclosing module state. Returns: value.

### tests/browser/sprite-scene1518.cjs:2

@function model-camera-recovery.set.5 — Handles set within model camera recovery. Inputs: v. Updates: v create; value.

### tests/browser/sprite-scene1518.cjs:2

@function model-camera-recovery.create.6 — Builds a new instance and its public operations from the supplied configuration. Inputs: rest element. Updates: window library. Uses: create. Returns: assignment.

### tests/browser/sprite-scene1518.cjs:2

@function model-camera-recovery.callback.7 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser/sprite-scene1518.cjs:2

@function sprite-scene1518.captureContext — Inputs: canvas. Returns actual render adapter, retaining it for GPU buffer assertions; no production behavior changes.

### tests/browser/sprite-scene1518.cjs:2

@function model-camera-recovery.draw.8 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/browser/sprite-scene1518.cjs:2

@function model-camera-recovery.callback.9 — Returns window g and window library. Inputs: no explicit arguments; uses enclosing module state. Returns: window g and window library.

### tests/browser/sprite-scene1518.cjs:5

@function sprite-scene1518.angle — Inputs: radians. Places actor clear of walls and sets steep camera pitch; no authored data changes.

### tests/browser/sprite-scene1518.cjs:6

@function sprite-scene1518.canvasLighting — Inputs: none. Exercises the lighting cache's canvas resource shape through the real GPU sprite path; normal settings are otherwise unchanged.

### tests/browser/sprite-scene1518.cjs:6

@function sprite-scene1518.litImage — Inputs: atlas image and cache arguments. Returns a canvas for the player and delegates other assets unchanged; test-only override.

### tests/browser/sprite-scene1518.cjs:7

@function sprite-scene1518.backend — Inputs: none. Returns selected renderer label without effects.

### tests/browser/sprite-scene1518.cjs:7

@function sprite-scene1518.finiteUV — Inputs: none. Returns whether the GPU registered the lighting canvas and all active pooled UV coordinates are finite.

### tests/browser/sprite-scene1518.cjs:7

@function sprite-scene1518.meshUV — Inputs: mesh. Returns whether its shared UV buffer has valid numbers; no effects.

### tests/browser/sprite-scene1518.cjs:8

@function sprite-scene1518.normalizeCamera � Inputs: none. Sets identical yaw, pitch in radians and distance in world units for comparable forest submission measurements; test only.

### tests/browser/sprite-scene1518.cjs:9

@function sprite-scene1518.resetSamples — Inputs: none. Clears bounded frame timing buffer after asset warmup; no runtime changes.

### tests/browser/sprite-scene1518.cjs:10

@function sprite-scene1518.samples — Inputs: none. Returns sorted CPU draw submission times in milliseconds and sample count; GPU completion is not measured.

### tests/browser/sprite-scene1518.cjs:10

@function sprite-scene1518.sort — Inputs: two milliseconds values. Returns ascending numeric ordering.

### tests/browser/sprite-scene1518.cjs:11

@function sprite-scene1518.failure — Inputs: error. Reports browser fixture failure and marks nonzero exit; browser cleanup is handled above.

### tests/browser-demo.cjs:3

@function browser-demo.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p on; p add init script.

### tests/browser-demo.cjs:3

@function browser-demo.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser-demo.cjs:3

@function browser-demo.callback.3 — Provides the callback for p add init script. Inputs: no explicit arguments; uses enclosing module state. Updates: element prototype request pointer lock; window test pads. Uses: object define property.

### tests/browser-demo.cjs:3

@function browser-demo.requestPointerLock.4 — Returns promise reject using a new error. Inputs: no explicit arguments; uses enclosing module state. Uses: promise reject. Returns: promise reject using a new error.

### tests/browser-demo.cjs:3

@function browser-demo.value.5 — Returns window test pads. Inputs: no explicit arguments; uses enclosing module state. Returns: window test pads.

### tests/browser-demo.cjs:3

@function browser-demo.callback.6 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser-demo.cjs:3

@function browser-demo.draw.7 — Draws this system’s current state into the supplied rendering context. Inputs: canvas; game. Updates: window test game. Uses: draw.

### tests/browser-demo.cjs:4

@function browser-demo.callback.8 — Returns test game source world terrain mode. Inputs: no explicit arguments; uses enclosing module state. Returns: test game source world terrain mode.

### tests/browser-demo.cjs:4

@function browser-demo.callback.9 — Returns test game source world sky layers length. Inputs: no explicit arguments; uses enclosing module state. Returns: test game source world sky layers length.

### tests/browser-demo.cjs:4

@function browser-demo.callback.10 — Returns test game scene events filter using a callback length. Inputs: no explicit arguments; uses enclosing module state. Uses: test game scene events filter. Returns: test game scene events filter using a callback length.

### tests/browser-demo.cjs:4

@function browser-demo.callback.11 — Returns e is ammo. Inputs: e. Returns: e is ammo.

### tests/browser-demo.cjs:4

@function browser-demo.callback.12 — Returns test game camera yaw. Inputs: no explicit arguments; uses enclosing module state. Returns: test game camera yaw.

### tests/browser-demo.cjs:4

@function browser-demo.callback.13 — Returns test game camera yaw. Inputs: no explicit arguments; uses enclosing module state. Returns: test game camera yaw.

### tests/browser-demo.cjs:4

@function browser-demo.callback.14 — Returns test game player ammo loaded. Inputs: no explicit arguments; uses enclosing module state. Returns: test game player ammo loaded.

### tests/browser-demo.cjs:4

@function browser-demo.callback.15 — Returns test game player ammo loaded. Inputs: no explicit arguments; uses enclosing module state. Returns: test game player ammo loaded.

### tests/browser-demo.cjs:4

@function browser-demo.callback.16 — Returns test game player ammo loaded. Inputs: no explicit arguments; uses enclosing module state. Returns: test game player ammo loaded.

### tests/browser-demo.cjs:4

@function browser-demo.callback.17 — Returns test game camera yaw. Inputs: no explicit arguments; uses enclosing module state. Returns: test game camera yaw.

### tests/browser-demo.cjs:4

@function browser-demo.callback.18 — Returns test game camera yaw. Inputs: no explicit arguments; uses enclosing module state. Returns: test game camera yaw.

### tests/browser-demo.cjs:4

@function browser-demo.callback.19 — Returns test game camera yaw. Inputs: no explicit arguments; uses enclosing module state. Returns: test game camera yaw.

### tests/browser-demo.cjs:5

@function browser-demo.callback.20 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: test game camera yaw; window test pads. Uses: array from.

### tests/browser-demo.cjs:5

@function browser-demo.callback.21 — Returns a record containing pressed, value. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing pressed, value.

### tests/browser-demo.cjs:5

@function browser-demo.callback.22 — Returns test game player y. Inputs: no explicit arguments; uses enclosing module state. Returns: test game player y.

### tests/browser-demo.cjs:5

@function browser-demo.callback.23 — Returns test game player y. Inputs: no explicit arguments; uses enclosing module state. Returns: test game player y.

### tests/browser-demo.cjs:5

@function browser-demo.callback.24 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: test pads at 0 axes.

### tests/browser-demo.cjs:5

@function browser-demo.callback.25 — Returns test game camera yaw. Inputs: no explicit arguments; uses enclosing module state. Returns: test game camera yaw.

### tests/browser-demo.cjs:5

@function browser-demo.callback.26 — Returns test game camera yaw. Inputs: no explicit arguments; uses enclosing module state. Returns: test game camera yaw.

### tests/browser-demo.cjs:5

@function browser-demo.callback.27 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: test pads at 0 axes; test pads at 0 buttons at 7 pressed.

### tests/browser-demo.cjs:5

@function browser-demo.callback.28 — Returns test game player ammo loaded. Inputs: no explicit arguments; uses enclosing module state. Returns: test game player ammo loaded.

### tests/browser-demo.cjs:5

@function browser-demo.callback.29 — Returns test game player ammo loaded. Inputs: no explicit arguments; uses enclosing module state. Returns: test game player ammo loaded.

### tests/browser-demo.cjs:5

@function browser-demo.callback.30 — Returns test game player ammo loaded. Inputs: no explicit arguments; uses enclosing module state. Returns: test game player ammo loaded.

### tests/browser-demo.cjs:5

@function browser-demo.callback.31 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: test pads at 0 buttons at 7 pressed; test pads at 0 buttons at 1 pressed.

### tests/browser-demo.cjs:5

@function browser-demo.callback.32 — Returns test game player z minus test game player ground z. Inputs: no explicit arguments; uses enclosing module state. Returns: test game player z minus test game player ground z.

### tests/browser-demo.cjs:5

@function browser-demo.callback.33 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: test pads.

### tests/browser-demo.cjs:5

@function browser-demo.callback.34 — Returns test game player grounded. Inputs: no explicit arguments; uses enclosing module state. Returns: test game player grounded.

### tests/browser-demo.cjs:6

@function browser-demo.callback.35 — Returns test game camera yaw. Inputs: no explicit arguments; uses enclosing module state. Returns: test game camera yaw.

### tests/browser-demo.cjs:6

@function browser-demo.callback.36 — Returns test game camera yaw. Inputs: no explicit arguments; uses enclosing module state. Returns: test game camera yaw.

### tests/browser-demo.cjs:6

@function browser-demo.callback.37 — Returns test game camera yaw. Inputs: no explicit arguments; uses enclosing module state. Returns: test game camera yaw.

### tests/browser-demo.cjs:6

@function browser-demo.callback.38 — Returns test game source world terrain amplitude. Inputs: no explicit arguments; uses enclosing module state. Returns: test game source world terrain amplitude.

### tests/browser-demo.cjs:6

@function browser-demo.callback.39 — Returns test game source world sky enabled. Inputs: no explicit arguments; uses enclosing module state. Returns: test game source world sky enabled.

### tests/browser-events.cjs:3

@function browser-events.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; browser new page; page on; page goto.

### tests/browser-events.cjs:3

@function browser-events.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser-events.cjs:3

@function browser-events.callback.3 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser-events.cjs:3

@function browser-events.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: canvas; game. Updates: window event test game. Uses: draw.

### tests/browser-events.cjs:5

@function browser-events.targetAmmo.5 — Handles target ammo within browser events. Inputs: no explicit arguments; uses enclosing module state. Uses: page evaluate; page locator using "#view" dispatch event; page locator.

### tests/browser-events.cjs:5

@function browser-events.callback.6 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: event test game camera yaw; event test game camera pitch.

### tests/browser-events.cjs:6

@function browser-events.scenePoint.7 — Handles scene point within browser events. Inputs: x; y; assignment pattern. Uses: page evaluate. Returns: page evaluate using a callback, a record containing x, y, above.

### tests/browser-events.cjs:6

@function browser-events.callback.8 — Provides the callback for page evaluate. Inputs: object pattern. Uses: frontier render camera; frontier render project; document get element by id using "view" get bounding client rect; document get element by id. Returns: a record containing x, y.

### tests/browser-events.cjs:11

@function browser-events.callback.9 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: aside scroll top. Uses: document query selector; document get element by id; inspector get bounding client rect; aside get bounding client rect.

### tests/browser06.cjs:5

@function browser06.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; browser new page; page on; page add init script.

### tests/browser06.cjs:9

@function browser06.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/browser06.cjs:10

@function browser06.callback.3 — Provides the callback for page add init script. Inputs: no explicit arguments; uses enclosing module state. Updates: htmlcanvas element prototype request pointer lock.

### tests/browser06.cjs:10

@function browser06.requestPointerLock.4 — Handles request pointer lock within browser06. Inputs: no explicit arguments; uses enclosing module state. Uses: promise resolve. Returns: promise resolve using .

### tests/browser06.cjs:12

@function browser06.callback.5 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/browser06.cjs:12

@function browser06.draw.6 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window test game. Uses: draw. Returns: draw using c, g.

### tests/browser06.cjs:13

@function browser06.callback.7 — Returns window test game and chain. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier pixi app stage children some. Returns: window test game and chain.

### tests/browser06.cjs:13

@function browser06.callback.8 — Returns c instanceof pixi sprite. Inputs: c. Returns: c instanceof pixi sprite.

### tests/browser06.cjs:14

@function browser06.callback.9 — Returns frontier sprites sheet using test game player id. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier sprites sheet. Returns: frontier sprites sheet using test game player id.

### tests/browser06.cjs:15

@function browser06.callback.10 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id using "view" focus; document get element by id; document dispatch event.

### tests/browser06.cjs:16

@function browser06.callback.11 — Returns frontier sprites sheet using test game player id. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier sprites sheet. Returns: frontier sprites sheet using test game player id.

### tests/browser06.cjs:17

@function browser06.callback.12 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: document dispatch event.

### tests/browser06.cjs:18

@function browser06.callback.13 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: test game combat cooldown; test game projectiles. Uses: mf fire shot; test game projectiles at; test game muzzle flashes at; phanicom abs equip. Returns: a record containing origin, flash, spent, pellets.

### tests/browser06.cjs:20

@function browser06.callback.14 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id using "openMuzzle" click; document get element by id.

### tests/browser06.cjs:21

@function browser06.callback.15 — Returns f url using includes using "muzzle-editor.html". Inputs: f. Uses: f url using includes; f url. Returns: f url using includes using "muzzle-editor.html".

### tests/browser06.cjs:21

@function browser06.callback.16 — Returns document get element by id using "profile" options length is greater than 0. Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id. Returns: document get element by id using "profile" options length is greater than 0.

### tests/browser06.cjs:22

@function browser06.callback.17 — Provides the callback for frame evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: document get element by id using "yaw" value. Uses: document get element by id; document get element by id using "yaw" dispatch event; document get element by id using "apply" click.

### tests/browser06.cjs:23

@function browser06.callback.18 — Returns frontier muzzle profiles get using "candy-armed" muzzles at "0:0" yaw offset equals 4. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier muzzle profiles get. Returns: frontier muzzle profiles get using "candy-armed" muzzles at "0:0" yaw offset equals 4.

### tests/browser06.cjs:24

@function browser06.callback.19 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id using "muzzleClose" click; document get element by id; document get element by id using "edit" click.

### tests/browser06.cjs:27

@function browser06.callback.20 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: s value. Uses: document get element by id; a list of spread element find; s dispatch event.

### tests/browser06.cjs:27

@function browser06.callback.21 — Returns o text includes using "[event]". Inputs: o. Uses: o text includes. Returns: o text includes using "[event]".

### tests/browser06.cjs:28

@function browser06.callback.22 — Returns document get element by id using "copyPage" click using . Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id using "copyPage" click; document get element by id. Returns: document get element by id using "copyPage" click using .

### tests/browser06.cjs:30

@function browser06.callback.23 — Returns document get element by id using "savePage" click using . Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id using "savePage" click; document get element by id. Returns: document get element by id using "savePage" click using .

### tests/browser06.cjs:33

@function browser06.callback.24 — Returns document get element by id using "applyParameters" click using . Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id using "applyParameters" click; document get element by id. Returns: document get element by id using "applyParameters" click using .

### tests/browser06.cjs:34

@function browser06.callback.25 — Returns test game source world parameters jump height equals 1.5. Inputs: no explicit arguments; uses enclosing module state. Returns: test game source world parameters jump height equals 1.5.

### tests/browser06.cjs:35

@function browser06.callback.26 — Returns test game source world parameters jump height. Inputs: no explicit arguments; uses enclosing module state. Returns: test game source world parameters jump height.

### tests/browser06.cjs:36

@function browser06.callback.27 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier music picker use manifest; pick.

### tests/browser06.cjs:36

@function browser06.pick.28 — Handles pick within browser06. Inputs: id; track. Updates: input picker available value. Uses: document get element by id; input picker group query selector using ".addTrack" click; input picker group query selector.

### tests/browser06.cjs:37

@function browser06.callback.29 — Returns document get element by id using "applyMusic" click using . Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id using "applyMusic" click; document get element by id. Returns: document get element by id using "applyMusic" click using .

### tests/browser06.cjs:38

@function browser06.callback.30 — Returns test game source world music map exploration at 0 equals "Temple.ogg". Inputs: no explicit arguments; uses enclosing module state. Returns: test game source world music map exploration at 0 equals "Temple.ogg".

### tests/browser06.cjs:39

@function browser06.callback.31 — Returns test game source world music map exploration at 0. Inputs: no explicit arguments; uses enclosing module state. Returns: test game source world music map exploration at 0.

### tests/browser06.cjs:40

@function browser06.callback.32 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: document get element by id using "edit" click; document get element by id.

### tests/browser06.cjs:41

@function browser06.callback.33 — Returns a record containing schema, world, player, blood, switches, variables, selfSwitches, inventory. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing schema, world, player, blood, switches, variables, selfSwitches, inventory.

### tests/browser06.cjs:43

@function browser06.callback.34 — Returns test game player hp equals 90. Inputs: no explicit arguments; uses enclosing module state. Returns: test game player hp equals 90.

### tests/browser06.cjs:44

@function browser06.callback.35 — Returns typeof test game player weapon. Inputs: no explicit arguments; uses enclosing module state. Returns: typeof test game player weapon.

### tests/browser06.cjs:44

@function browser06.callback.36 — Returns test game player weapon id. Inputs: no explicit arguments; uses enclosing module state. Returns: test game player weapon id.

### tests/browser06.cjs:45

@function browser06.callback.37 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: test game player hp. Uses: phanicom blood spray character; phanicom blood update; test game blood fx at. Returns: a record containing layer, drips.

### tests/browser06.cjs:46

@function browser06.callback.38 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: test game player hp; test game player x; test game player y. Uses: key; document get element by id using "view" dispatch event; document get element by id; document dispatch event. Returns: result.

### tests/browser06.cjs:46

@function browser06.key.39 — Returns document dispatch event using a new keyboard event. Inputs: k. Uses: document dispatch event. Returns: document dispatch event using a new keyboard event.

### tests/browser06.cjs:46

@function browser06.callback.40 — Returns set timeout using r, 180. Inputs: r. Uses: set timeout. Returns: set timeout using r, 180.

### tests/browser06.cjs:47

@function browser06.callback.41 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: test game player hp. Uses: phanicom blood update; test game passive drips filter. Returns: test game passive drips filter using a callback length.

### tests/browser06.cjs:47

@function browser06.callback.42 — Returns d actor id equals test game player id. Inputs: d. Returns: d actor id equals test game player id.

### tests/browser06.cjs:48

@function browser06.callback.43 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: document get element by id using "aspect" value. Uses: document get element by id; document get element by id using "aspect" dispatch event.

### tests/browser06.cjs:49

@function browser06.callback.44 — Provides the callback for page evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: document get element by id using "aspect" value. Uses: document get element by id; document get element by id using "aspect" dispatch event.

### tests/browser06.cjs:53

@function browser06.callback.45 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/cerebral13.cjs:2

@function cerebral13.callback.1 — Returns c validate using v. Inputs: no explicit arguments; uses enclosing module state. Uses: c validate. Returns: c validate using v.

### tests/cerebral13.cjs:2

@function cerebral13.query.2 — Finds records or geometry intersecting the requested region. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of source.

### tests/door-hub1517.cjs:7

@function door-hub1517.badComposition â€” Inputs: none. Attempts invalid third leaf; expected validation error prevents resource allocation.

### tests/door-hub1517.cjs:9

@function door-hub1517.commit â€” Inputs: job unused. Counts commits; no real map mutation.

### tests/door-hub1517.cjs:9

@function door-hub1517.complete â€” Inputs: job unused. Counts resumed continuations.

### tests/door-hub1517.cjs:9

@function door-hub1517.opacity â€” Inputs: opacity/color ignored. Stub has no effects.

### tests/door-hub1517.cjs:9

@function door-hub1517.begin â€” Inputs: config ignored. Resets synthetic presentation clock.

### tests/door-hub1517.cjs:9

@function door-hub1517.update â€” Inputs: seconds. Returns true when synthetic sequence reaches 1s.

### tests/door-hub1517.cjs:9

@function door-hub1517.end â€” Inputs: none. Counts presentation cleanup.

### tests/door-hub1517.cjs:13

@function door-hub1517.randomOpen â€” Inputs: none. Returns deterministic lower bound for open pool selection.

### tests/door-hub1517.cjs:13

@function door-hub1517.randomClose â€” Inputs: none. Returns deterministic upper bound below one for close selection.

### tests/editor08.cjs:2

@function editor08.message.1 — Handles message within editor08. Inputs: m. Updates: displayed. Returns: false.

### tests/editor08.cjs:2

@function editor08.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/editor08.cjs:2

@function editor08.canStand.3 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/editor08.cjs:3

@function editor08.callback.4 — Returns e validate using a list of a record containing copied fields, pages. Inputs: no explicit arguments; uses enclosing module state. Uses: e validate. Returns: e validate using a list of a record containing copied fields, pages.

### tests/editor08.cjs:3

@function editor08.callback.5 — Returns e validate using a list of a record containing copied fields, elevation. Inputs: no explicit arguments; uses enclosing module state. Uses: e validate. Returns: e validate using a list of a record containing copied fields, elevation.

### tests/editor08.cjs:4

@function editor08.message.6 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/editor08.cjs:4

@function editor08.log.7 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/editor08.cjs:4

@function editor08.canStand.8 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-capacity159.cjs:1

@function event-capacity159.callback.1 — Returns a record containing type, key, operation, value. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing type, key, operation, value.

### tests/event-capacity159.cjs:1

@function event-capacity159.message.2 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-capacity159.cjs:1

@function event-capacity159.canStand.3 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-capacity159.cjs:1

@function event-capacity159.log.4 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/event-capacity159.cjs:1

@function event-capacity159.callback.5 — Returns f validate using a list of a record containing copied fields, pages. Inputs: no explicit arguments; uses enclosing module state. Uses: f validate; array using f limits commands plus 1 fill; array. Returns: f validate using a list of a record containing copied fields, pages.

### tests/event-capacity159.cjs:3

@function event-capacity159.callback.6 — Returns a record containing copied fields, condition, commands. Inputs: ; i. Uses: f page. Returns: a record containing copied fields, condition, commands.

### tests/event-capacity159.cjs:4

@function event-capacity159.message.7 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-capacity159.cjs:4

@function event-capacity159.canStand.8 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-capacity159.cjs:4

@function event-capacity159.log.9 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/event-capacity159.cjs:5

@function event-capacity159.callback.10 — Returns f validate using a list of a record containing copied fields, inspection. Inputs: no explicit arguments; uses enclosing module state. Uses: f validate; "x" repeat. Returns: f validate using a list of a record containing copied fields, inspection.

### tests/event-continuation159.cjs:1

@function event-continuation159.message.1 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/event-continuation159.cjs:1

@function event-continuation159.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/event-continuation159.cjs:1

@function event-continuation159.canStand.3 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-continuation159.cjs:3

@function event-continuation159.callback.4 — Returns next restore continuation using invalid. Inputs: no explicit arguments; uses enclosing module state. Uses: next restore continuation. Returns: next restore continuation using invalid.

### tests/event-continuation159.cjs:3

@function event-continuation159.callback.5 — Returns next restore continuation using duplicate. Inputs: no explicit arguments; uses enclosing module state. Uses: next restore continuation. Returns: next restore continuation using duplicate.

### tests/event-continuation159.cjs:4

@function event-continuation159.callback.6 — Returns next restore continuation using snapshot. Inputs: no explicit arguments; uses enclosing module state. Uses: next restore continuation. Returns: next restore continuation using snapshot.

### tests/event-continuation159.cjs:5

@function event-continuation159.callback.7 — Returns talking capture continuation using . Inputs: no explicit arguments; uses enclosing module state. Uses: talking capture continuation. Returns: talking capture continuation using .

### tests/event-foundation.cjs:2

@function event-foundation.message.1 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-foundation.cjs:2

@function event-foundation.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/event-foundation.cjs:2

@function event-foundation.canStand.3 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-foundation.cjs:2

@function event-foundation.message.4 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-foundation.cjs:2

@function event-foundation.log.5 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/event-foundation.cjs:2

@function event-foundation.canStand.6 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-foundation.cjs:2

@function event-foundation.callback.7 — Returns f validate using a list of a record containing copied fields, pages. Inputs: no explicit arguments; uses enclosing module state. Uses: f validate. Returns: f validate using a list of a record containing copied fields, pages.

### tests/event-motion159.cjs:2

@function event-motion159.page.1 — Returns a record containing movement, through, mz. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event schema page defaults. Returns: a record containing movement, through, mz.

### tests/event-motion159.cjs:2

@function event-motion159.entity.2 — Returns a record containing id, x, y. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing id, x, y.

### tests/event-motion159.cjs:3

@function event-motion159.bounds.3 — Calculates or applies the enclosing limits for this module’s data. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing width, height.

### tests/event-motion159.cjs:3

@function event-motion159.canStand.4 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-motion159.cjs:5

@function event-motion159.canStand.5 — Returns the inverse of x is greater than 5.4 and x is less than 5.6. Inputs: x. Returns: the inverse of x is greater than 5.4 and x is less than 5.6.

### tests/event-replacement159.cjs:3

@function event-replacement159.add.1 — Returns a record containing type, key, operation, value. Inputs: key. Returns: a record containing type, key, operation, value.

### tests/event-replacement159.cjs:8

@function event-replacement159.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/event-replacement159.cjs:8

@function event-replacement159.message.3 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/event-replacement159.cjs:8

@function event-replacement159.canStand.4 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-replacement159.cjs:8

@function event-replacement159.bounds.5 — Calculates or applies the enclosing limits for this module’s data. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing width, height.

### tests/event-replacement159.cjs:10

@function event-replacement159.callback.6 — Returns s replace event using "target", bank, "missing". Inputs: no explicit arguments; uses enclosing module state. Uses: s replace event. Returns: s replace event using "target", bank, "missing".

### tests/event-replacement159.cjs:14

@function event-replacement159.callback.7 — Returns s replace event using "target", bank, "fresh". Inputs: no explicit arguments; uses enclosing module state. Uses: s replace event. Returns: s replace event using "target", bank, "fresh".

### tests/event-replacement159.cjs:16

@function event-replacement159.message.8 — Handles message within event replacement159. Inputs: m. Uses: shown push. Returns: false.

### tests/event-replacement159.cjs:22

@function event-replacement159.callback.9 — Returns frontier event templates references using a list of a record containing copied fields, version, bank snapshot using , a list of old. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event templates references; bank snapshot. Returns: frontier event templates references using a list of a record containing copied fields, version, bank snapshot using , a list of old.

### tests/event-replacement159.cjs:22

@function event-replacement159.callback.10 — Returns frontier event templates references using a list of refs at 0, refs at 0, bank snapshot using , a list of old. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event templates references; bank snapshot. Returns: frontier event templates references using a list of refs at 0, refs at 0, bank snapshot using , a list of old.

### tests/event-replacement159.cjs:22

@function event-replacement159.callback.11 — Returns frontier event templates references using refs, bank snapshot using , a list of . Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event templates references; bank snapshot. Returns: frontier event templates references using refs, bank snapshot using , a list of .

### tests/event-replacement159.cjs:25

@function event-replacement159.templateBank.12 — Returns bank. Inputs: no explicit arguments; uses enclosing module state. Returns: bank.

### tests/event-replacement159.cjs:26

@function event-replacement159.templateBank.13 — Returns bank. Inputs: no explicit arguments; uses enclosing module state. Returns: bank.

### tests/event-replacement159.cjs:29

@function event-replacement159.templateBank.14 — Returns bank. Inputs: no explicit arguments; uses enclosing module state. Returns: bank.

### tests/event-templates159.cjs:11

@function event-templates159.callback.1 — Provides the callback for assert throws. Inputs: no explicit arguments; uses enclosing module state. Uses: a pages at 0 commands push.

### tests/event-templates159.cjs:15

@function event-templates159.callback.2 — Returns compiled instantiate using "missing", a record containing id, x, y. Inputs: no explicit arguments; uses enclosing module state. Uses: compiled instantiate. Returns: compiled instantiate using "missing", a record containing id, x, y.

### tests/event-templates159.cjs:15

@function event-templates159.callback.3 — Returns compiled instantiate using "tree", a record containing id, x, y, 2. Inputs: no explicit arguments; uses enclosing module state. Uses: compiled instantiate. Returns: compiled instantiate using "tree", a record containing id, x, y, 2.

### tests/event-templates159.cjs:16

@function event-templates159.callback.4 — Returns t compile using a record containing copied fields, entries. Inputs: no explicit arguments; uses enclosing module state. Uses: t compile. Returns: t compile using a record containing copied fields, entries.

### tests/event-templates159.cjs:16

@function event-templates159.callback.5 — Returns t compile using a record containing copied fields, schema. Inputs: no explicit arguments; uses enclosing module state. Uses: t compile. Returns: t compile using a record containing copied fields, schema.

### tests/event-templates159.cjs:17

@function event-templates159.callback.6 — Returns compiled instantiate using "tree", a record containing id, x, y. Inputs: no explicit arguments; uses enclosing module state. Uses: compiled instantiate. Returns: compiled instantiate using "tree", a record containing id, x, y.

### tests/event-templates159.cjs:20

@function event-templates159.validate.7 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: world. Uses: structured clone. Returns: structured clone using world.

### tests/event-templates159.cjs:24

@function event-templates159.callback.8 — Returns frontier maps validate using a record containing copied fields, templates. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier maps validate. Returns: frontier maps validate using a record containing copied fields, templates.

### tests/event-touch159.cjs:1

@function event-touch159.canStand.1 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-touch159.cjs:1

@function event-touch159.message.2 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-touch159.cjs:1

@function event-touch159.log.3 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/event-touch159.cjs:2

@function event-touch159.canStand.4 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-touch159.cjs:2

@function event-touch159.message.5 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event-touch159.cjs:2

@function event-touch159.log.6 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/event-touch159.cjs:2

@function event-touch159.bounds.7 — Calculates or applies the enclosing limits for this module’s data. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing width, height.

### tests/event158.cjs:1

@function event158.transferMap.1 — Returns assignment. Inputs: rest element. Updates: destination. Returns: assignment.

### tests/event158.cjs:1

@function event158.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/event158.cjs:1

@function event158.canStand.3 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/event158.cjs:1

@function event158.callback.4 — Returns f validate using a list of a record containing copied fields, copied fields. Inputs: no explicit arguments; uses enclosing module state. Uses: f validate. Returns: f validate using a list of a record containing copied fields, copied fields.

### tests/events.cjs:10

@function events.message.1 — Returns assignment. Inputs: value. Updates: message. Returns: assignment.

### tests/events.cjs:10

@function events.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/events.cjs:10

@function events.item.3 — Returns assignment. Inputs: id; amount. Updates: given. Returns: assignment.

### tests/events.cjs:10

@function events.canStand.4 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/events.cjs:19

@function events.item.5 — Returns update. Inputs: no explicit arguments; uses enclosing module state. Returns: update.

### tests/events.cjs:24

@function events.canStand.6 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/events.cjs:25

@function events.callback.7 — Returns assignment. Inputs: e. Updates: e id. Returns: assignment.

### tests/events.cjs:25

@function events.callback.8 — Returns assignment. Inputs: e. Updates: e pages at 0 commands. Returns: assignment.

### tests/events.cjs:25

@function events.callback.9 — Returns assignment. Inputs: e. Updates: e pages at 0 condition. Returns: assignment.

### tests/events.cjs:25

@function events.callback.10 — Returns assignment. Inputs: e. Updates: e pages at 0 commands. Returns: assignment.

### tests/events.cjs:25

@function events.callback.11 — Returns e validate using a list of e. Inputs: no explicit arguments; uses enclosing module state. Uses: e validate. Returns: e validate using a list of e.

### tests/events.cjs:26

@function events.callback.12 — Returns e validate using a list of box, a new set. Inputs: no explicit arguments; uses enclosing module state. Uses: e validate. Returns: e validate using a list of box, a new set.

### tests/fixed-diagonals159.cjs:4

@function fixed-diagonals159.callback.1 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/fixed-diagonals159.cjs:6

@function fixed-diagonals159.callback.2 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/fixed-diagonals159.cjs:6

@function fixed-diagonals159.callback.3 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/fixed-diagonals159.cjs:7

@function fixed-diagonals159.callback.4 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/fog10.cjs:3

@function fog10.callback.1 — Returns f validate using value. Inputs: no explicit arguments; uses enclosing module state. Uses: f validate. Returns: f validate using value.

### tests/function-comments1516.cjs:5

@function function-comments1516.scan.1 — Handles scan within function comments1516. Inputs: dir. Uses: fs readdir sync; path join; e is directory; scan.

### tests/function-comments1516.cjs:7

@function function-comments1516.visit.2 — Handles visit within function comments1516. Inputs: n; parent. Uses: /^(FunctionDeclaration|FunctionExpression|ArrowFunctionExpression)$/ test; comments filter using a callback at; comments filter; assert. Returns: without a result.

### tests/function-comments1516.cjs:7

@function function-comments1516.callback.3 — Returns c end is at most start and text slice using c end, start trim using equals "". Inputs: c. Uses: text slice using c end, start trim; text slice. Returns: c end is at most start and text slice using c end, start trim using equals "".

### tests/function-comments1516.cjs:7

@function function-comments1516.callback.4 — Returns visit using q, n. Inputs: q. Uses: visit. Returns: visit using q, n.

### tests/gameplay-commands159.cjs:4

@function gameplay-commands159.log.1 — Records a human-readable runtime message. Inputs: x. Uses: logs push. Returns: logs push using x.

### tests/gameplay-commands159.cjs:4

@function gameplay-commands159.message.2 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/gameplay-commands159.cjs:8

@function gameplay-commands159.callback.3 — Returns frontier event runtime validate using a record containing type, key, copied fields. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event runtime validate. Returns: frontier event runtime validate using a record containing type, key, copied fields.

### tests/gameplay-commands159.cjs:9

@function gameplay-commands159.callback.4 — Returns a list of "key" plus i, i. Inputs: ; i. Returns: a list of "key" plus i, i.

### tests/gameplay-commands159.cjs:9

@function gameplay-commands159.callback.5 — Returns frontier event runtime execute using a record containing type, domain, key, operation, value, a record containing state. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event runtime execute. Returns: frontier event runtime execute using a record containing type, domain, key, operation, value, a record containing state.

### tests/gameplay-defaults159.cjs:3

@function gameplay-defaults159.callback.1 — Returns d validate using a record containing copied fields, copied fields. Inputs: no explicit arguments; uses enclosing module state. Uses: d validate. Returns: d validate using a record containing copied fields, copied fields.

### tests/gameplay-state159.cjs:12

@function gameplay-state159.callback.1 — Returns frontier event state validate using a record containing skills. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event state validate. Returns: frontier event state validate using a record containing skills.

### tests/gameplay-state159.cjs:13

@function gameplay-state159.callback.2 — Returns frontier event state validate using a record containing factions. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event state validate. Returns: frontier event state validate using a record containing factions.

### tests/hub-state1517.cjs:7

@function hub-state1517.badOwner — Tests rejection before ownership state is adopted. Inputs: none. Returns: validation result if unexpectedly accepted; assert captures expected error.

### tests/input-terrain.cjs:7

@function input-terrain.callback.1 — Returns a record containing pressed, value. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing pressed, value.

### tests/input-terrain.cjs:12

@function input-terrain.callback.2 — Returns c frontier world validate using a record containing copied fields, terrain. Inputs: no explicit arguments; uses enclosing module state. Uses: c frontier world validate. Returns: c frontier world validate using a record containing copied fields, terrain.

### tests/input-terrain.cjs:12

@function input-terrain.callback.3 — Returns c frontier sky validate using a record containing enabled, layers. Inputs: no explicit arguments; uses enclosing module state. Uses: c frontier sky validate. Returns: c frontier sky validate using a record containing enabled, layers.

### tests/input-terrain.cjs:14

@function input-terrain.callback.4 — Provides the callback for mf make frontier game. Inputs: no explicit arguments; uses enclosing module state.

### tests/input-terrain.cjs:14

@function input-terrain.callback.5 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/input-terrain.cjs:15

@function input-terrain.callback.6 — Provides the callback for mf make frontier game. Inputs: no explicit arguments; uses enclosing module state.

### tests/input-terrain.cjs:18

@function input-terrain.callback.7 — Provides the callback for mf make frontier game. Inputs: no explicit arguments; uses enclosing module state.

### tests/input-terrain.cjs:36

@function input-terrain.obstacleRun.8 — Handles obstacle run within input terrain. Inputs: height; jumping. Updates: stood. Uses: mf make frontier game; t ground; t jump; mf frontier movement move player. Returns: a record containing g, stood.

### tests/input-terrain.cjs:38

@function input-terrain.callback.9 — Provides the callback for mf make frontier game. Inputs: no explicit arguments; uses enclosing module state.

### tests/input-terrain.cjs:42

@function input-terrain.callback.10 — Returns t blocked using g, x, y. Inputs: x; y; r. Uses: t blocked. Returns: t blocked using g, x, y.

### tests/input-terrain.cjs:64

@function input-terrain.aim.11 — Handles aim within input terrain. Inputs: objects. Updates: g camera pitch; g camera distance; g player weapon spread radians. Uses: mf make frontier game; mf fire shot. Returns: g projectiles at 0 direction.

### tests/input-terrain.cjs:64

@function input-terrain.callback.12 — Provides the callback for mf make frontier game. Inputs: no explicit arguments; uses enclosing module state.

### tests/interiors15.cjs:5

@function interiors15.callback.1 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/interiors15.cjs:9

@function interiors15.callback.2 — Returns i validate using a record containing copied fields, floor, w. Inputs: no explicit arguments; uses enclosing module state. Uses: i validate. Returns: i validate using a record containing copied fields, floor, w.

### tests/interiors15.cjs:9

@function interiors15.callback.3 — Returns i validate using a record containing copied fields, camera, w. Inputs: no explicit arguments; uses enclosing module state. Uses: i validate. Returns: i validate using a record containing copied fields, camera, w.

### tests/interiors15.cjs:9

@function interiors15.callback.4 — Returns i validate using a record containing copied fields, sprites, w. Inputs: no explicit arguments; uses enclosing module state. Uses: i validate. Returns: i validate using a record containing copied fields, sprites, w.

### tests/interiors15.cjs:10

@function interiors15.callback.5 — Returns p length equals 3 and p every using number is finite. Inputs: p. Uses: p every. Returns: p length equals 3 and p every using number is finite.

### tests/interiors15.cjs:11

@function interiors15.message.6 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/interiors15.cjs:11

@function interiors15.log.7 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/interiors15.cjs:11

@function interiors15.journal.8 — Handles journal within interiors15. Inputs: key; text. Updates: called. Uses: assert equal.

### tests/interiors15.cjs:11

@function interiors15.canStand.9 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/interiors15.cjs:12

@function interiors15.callback.10 — Returns c frontier cerebral validate using a record containing transition. Inputs: no explicit arguments; uses enclosing module state. Uses: c frontier cerebral validate. Returns: c frontier cerebral validate using a record containing transition.

### tests/large11.cjs:4

@function large11.callback.1 — Returns e x is less than 128 and e y is less than 256. Inputs: e. Returns: e x is less than 128 and e y is less than 256.

### tests/large11.cjs:4

@function large11.callback.2 — Returns w validate using a record containing copied fields, height. Inputs: no explicit arguments; uses enclosing module state. Uses: w validate. Returns: w validate using a record containing copied fields, height.

### tests/large11.cjs:4

@function large11.callback.3 — Returns w generate using "bad", 513, 48. Inputs: no explicit arguments; uses enclosing module state. Uses: w generate. Returns: w generate using "bad", 513, 48.

### tests/large11.cjs:4

@function large11.callback.4 — Returns w validate using a record containing copied fields, gridSpacing. Inputs: no explicit arguments; uses enclosing module state. Uses: w validate. Returns: w validate using a record containing copied fields, gridSpacing.

### tests/large11.cjs:5

@function large11.callback.5 — Provides the callback for context mf make frontier game. Inputs: no explicit arguments; uses enclosing module state.

### tests/large11.cjs:5

@function large11.callback.6 — Returns math abs using e x minus 80 is less than e radius plus 0.13 and math abs using e y minus 200 is less than e radius plus 0.13. Inputs: e. Returns: math abs using e x minus 80 is less than e radius plus 0.13 and math abs using e y minus 200 is less than e radius plus 0.13.

### tests/large11.cjs:7

@function large11.message.7 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/large11.cjs:7

@function large11.log.8 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/large11.cjs:7

@function large11.canStand.9 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/large11.cjs:7

@function large11.bounds.10 — Calculates or applies the enclosing limits for this module’s data. Inputs: no explicit arguments; uses enclosing module state. Uses: w dimensions. Returns: w dimensions using rectangular.

### tests/large11.cjs:7

@function large11.motionDelta.11 — Returns a motion delta using game, e, p. Inputs: e; p; dt. Uses: a motion delta. Returns: a motion delta using game, e, p.

### tests/live-transfer159.cjs:2

@function live-transfer159.transfer.1 — Returns a record containing type, code, indent, parameters. Inputs: n. Returns: a record containing type, code, indent, parameters.

### tests/live-transfer159.cjs:2

@function live-transfer159.add.2 — Returns a record containing type, key, operation, value. Inputs: k. Returns: a record containing type, key, operation, value.

### tests/live-transfer159.cjs:2

@function live-transfer159.message.3 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/live-transfer159.cjs:2

@function live-transfer159.log.4 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/live-transfer159.cjs:2

@function live-transfer159.canStand.5 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/live-transfer159.cjs:2

@function live-transfer159.transferPlayer.6 — Handles transfer player within live transfer159. Inputs: p; c. Uses: reserved push. Returns: true.

### tests/live-transfer159.cjs:10

@function live-transfer159.currentMap.7 — Returns current. Inputs: no explicit arguments; uses enclosing module state. Returns: current.

### tests/live-transfer159.cjs:10

@function live-transfer159.selfSwitchMap.8 — Returns origin switches. Inputs: no explicit arguments; uses enclosing module state. Returns: origin switches.

### tests/live-transfer159.cjs:10

@function live-transfer159.setSelfSwitch.9 — Handles set self switch within live transfer159. Inputs: map; key; value. Uses: assert equal; origin switches set.

### tests/map-identities159.cjs:2

@function map-identities159.callback.1 — Returns m mz id. Inputs: m. Returns: m mz id.

### tests/map-identities159.cjs:2

@function map-identities159.callback.2 — Returns m mz id. Inputs: m. Returns: m mz id.

### tests/map-identities159.cjs:2

@function map-identities159.callback.3 — Returns m assign using a list of a record containing mzId, a record containing mzId. Inputs: no explicit arguments; uses enclosing module state. Uses: m assign. Returns: m assign using a list of a record containing mzId, a record containing mzId.

### tests/map-identities159.cjs:2

@function map-identities159.callback.4 — Returns m assign using a list of a record containing mzId. Inputs: no explicit arguments; uses enclosing module state. Uses: m assign. Returns: m assign using a list of a record containing mzId.

### tests/map-identities159.cjs:3

@function map-identities159.callback.5 — Returns m mz id. Inputs: m. Returns: m mz id.

### tests/maps141.cjs:2

@function maps141.callback.1 — Returns p validate using a record containing copied fields, active. Inputs: no explicit arguments; uses enclosing module state. Uses: p validate. Returns: p validate using a record containing copied fields, active.

### tests/maps141.cjs:2

@function maps141.callback.2 — Returns p validate using a record containing copied fields, maps. Inputs: no explicit arguments; uses enclosing module state. Uses: p validate. Returns: p validate using a record containing copied fields, maps.

### tests/maps141.cjs:2

@function maps141.callback.3 — Returns p validate using a record containing copied fields, maps. Inputs: no explicit arguments; uses enclosing module state. Uses: p validate. Returns: p validate using a record containing copied fields, maps.

### tests/maps141.cjs:2

@function maps141.callback.4 — Returns p validate using a record containing copied fields, maps. Inputs: no explicit arguments; uses enclosing module state. Uses: p validate. Returns: p validate using a record containing copied fields, maps.

### tests/model-camera1516.cjs:2

@function model-camera1516.get.1 — Returns asset. Inputs: no explicit arguments; uses enclosing module state. Returns: asset.

### tests/model-container1511.cjs:1

@function model-container1511.callback.1 — Returns c parse using glb subarray using 0, glb length minus 1. Inputs: no explicit arguments; uses enclosing module state. Uses: c parse; glb subarray. Returns: c parse using glb subarray using 0, glb length minus 1.

### tests/model-container1511.cjs:1

@function model-container1511.callback.2 — Returns c resource path using "../outside.bin". Inputs: no explicit arguments; uses enclosing module state. Uses: c resource path. Returns: c resource path using "../outside.bin".

### tests/model-container1511.cjs:1

@function model-container1511.callback.3 — Returns c resource path using "https://example.org/model.bin". Inputs: no explicit arguments; uses enclosing module state. Uses: c resource path. Returns: c resource path using "https://example.org/model.bin".

### tests/model-container1511.cjs:1

@function model-container1511.callback.4 — Returns c parse using buffer from using "{\"asset\":{\"version\":\"1.0\"}}". Inputs: no explicit arguments; uses enclosing module state. Uses: c parse; buffer from. Returns: c parse using buffer from using "{\"asset\":{\"version\":\"1.0\"}}".

### tests/model-debug1511.cjs:1

@function model-debug1511.project.1 — Converts a world-space position into this renderer’s screen-space representation. Inputs: c; x; y; z. Returns: a record containing x, y.

### tests/model-debug1511.cjs:1

@function model-debug1511.save.2 — Handles save within model debug1511. Inputs: no explicit arguments; uses enclosing module state.

### tests/model-debug1511.cjs:1

@function model-debug1511.restore.3 — Applies saved state to this system. Inputs: no explicit arguments; uses enclosing module state.

### tests/model-debug1511.cjs:1

@function model-debug1511.beginPath.4 — Handles begin path within model debug1511. Inputs: no explicit arguments; uses enclosing module state.

### tests/model-debug1511.cjs:1

@function model-debug1511.moveTo.5 — Handles move to within model debug1511. Inputs: no explicit arguments; uses enclosing module state.

### tests/model-debug1511.cjs:1

@function model-debug1511.lineTo.6 — Handles line to within model debug1511. Inputs: no explicit arguments; uses enclosing module state.

### tests/model-debug1511.cjs:1

@function model-debug1511.stroke.7 — Handles stroke within model debug1511. Inputs: no explicit arguments; uses enclosing module state.

### tests/model-debug1511.cjs:1

@function model-debug1511.fillText.8 — Handles fill text within model debug1511. Inputs: no explicit arguments; uses enclosing module state.

### tests/model-events1511.cjs:3

@function model-events1511.callback.1 — Returns e validate using a record containing visual. Inputs: no explicit arguments; uses enclosing module state. Uses: e validate. Returns: e validate using a record containing visual.

### tests/model-events1511.cjs:3

@function model-events1511.callback.2 — Returns e validate using a record containing copied fields, interactionZones. Inputs: no explicit arguments; uses enclosing module state. Uses: e validate. Returns: e validate using a record containing copied fields, interactionZones.

### tests/model-landing1516.cjs:1

@function model-landing1516.get.1 — Returns a record containing stepHeight, gravity, jumpHeight at k. Inputs: w; k. Returns: a record containing stepHeight, gravity, jumpHeight at k.

### tests/model-landing1516.cjs:1

@function model-landing1516.callback.2 — Returns frontier terrain blocked using game, p x plus dx, p y plus dy. Inputs: array pattern. Uses: frontier terrain blocked. Returns: frontier terrain blocked using game, p x plus dx, p y plus dy.

### tests/model-landing1516.cjs:1

@function model-landing1516.callback.3 — Returns frontier model collision blocked using game, p x, p y. Inputs: d. Uses: frontier model collision blocked. Returns: frontier model collision blocked using game, p x, p y.

### tests/model-library1511.cjs:3

@function model-library1511.callback.1 — Returns l import bundle using a record containing copied fields, id, files. Inputs: no explicit arguments; uses enclosing module state. Uses: l import bundle. Returns: l import bundle using a record containing copied fields, id, files.

### tests/model-library1511.cjs:3

@function model-library1511.callback.2 — Returns l accessor using bad, a list of binary, 0. Inputs: no explicit arguments; uses enclosing module state. Uses: l accessor. Returns: l accessor using bad, a list of binary, 0.

### tests/model-library1511.cjs:3

@function model-library1511.callback.3 — Returns l restore using a list of a record containing copied fields, entry. Inputs: no explicit arguments; uses enclosing module state. Uses: l restore. Returns: l restore using a list of a record containing copied fields, entry.

### tests/model-library1511.cjs:3

@function model-library1511.callback.4 — Returns l import bundle using missing. Inputs: no explicit arguments; uses enclosing module state. Uses: l import bundle. Returns: l import bundle using missing.

### tests/model-mesh-collision1513.cjs:1

@function model-mesh-collision1513.wall.1 — Handles wall within model mesh collision1513. Inputs: x0; x1; z0; z1. Uses: vertices push; indices push.

### tests/model-mesh-collision1513.cjs:2

@function model-mesh-collision1513.get.2 — Returns asset. Inputs: no explicit arguments; uses enclosing module state. Returns: asset.

### tests/model-scene1511.cjs:3

@function model-scene1511.callback.1 — Returns assignment. Inputs: p. Updates: triangle. Returns: assignment.

### tests/model-scene1511.cjs:3

@function model-scene1511.callback.2 — Returns s compile using a record containing copied fields, json. Inputs: no explicit arguments; uses enclosing module state. Uses: s compile. Returns: s compile using a record containing copied fields, json.

### tests/model-scene1511.cjs:3

@function model-scene1511.callback.3 — Returns s compile using a record containing copied fields, json. Inputs: no explicit arguments; uses enclosing module state. Uses: s compile. Returns: s compile using a record containing copied fields, json.

### tests/model-transform1511.cjs:1

@function model-transform1511.near.1 — Returns assert using math abs using a minus b is less than 1e-8, formatted text. Inputs: a; b. Uses: assert. Returns: assert using math abs using a minus b is less than 1e-8, formatted text.

### tests/model-transform1511.cjs:4

@function model-transform1511.callback.2 — Returns near using v, a list of 10, 22, 7 at i. Inputs: v; i. Uses: near. Returns: near using v, a list of 10, 22, 7 at i.

### tests/model-transform1511.cjs:5

@function model-transform1511.callback.3 — Returns near using v, p at i. Inputs: v; i. Uses: near. Returns: near using v, p at i.

### tests/model-transform1511.cjs:6

@function model-transform1511.callback.4 — Returns t matrix using a record containing scale. Inputs: no explicit arguments; uses enclosing module state. Uses: t matrix. Returns: t matrix using a record containing scale.

### tests/model-transform1511.cjs:6

@function model-transform1511.callback.5 — Returns t box using a record containing copied fields, size. Inputs: no explicit arguments; uses enclosing module state. Uses: t box. Returns: t box using a record containing copied fields, size.

### tests/model-visibility1517.cjs:4

@function model-visibility1517.get — Supplies a shared decoded bounds fixture. Inputs: model ID, ignored. Returns: fixture asset; no resource allocation or game changes.

### tests/model-visibility1517.cjs:11

@function model-visibility1517.invalid — Exercises validation failure for a negative draw distance. Inputs: none. Returns: validation result if unexpectedly accepted; expected throw is captured by assert.

### tests/model-volumes1511.cjs:1

@function model-volumes1511.callback.1 — Returns a record containing id, pages. Inputs: id. Returns: a record containing id, pages.

### tests/model-volumes1511.cjs:1

@function model-volumes1511.activePage.2 — Returns 0. Inputs: no explicit arguments; uses enclosing module state. Returns: 0.

### tests/model-volumes1511.cjs:1

@function model-volumes1511.start.3 — Handles start within model volumes1511. Inputs: e. Uses: started push. Returns: true.

### tests/model-walkable1514.cjs:3

@function model-walkable1514.quad.1 — Handles quad within model walkable1514. Inputs: a; b; c; d. Uses: vertices push; indices push.

### tests/model-walkable1514.cjs:9

@function model-walkable1514.get.2 — Returns asset. Inputs: no explicit arguments; uses enclosing module state. Returns: asset.

### tests/model-walkable1514.cjs:15

@function model-walkable1514.get.3 — Returns ceiling. Inputs: no explicit arguments; uses enclosing module state. Returns: ceiling.

### tests/model-walkable1514.cjs:19

@function model-walkable1514.get.4 — Returns low ceiling. Inputs: no explicit arguments; uses enclosing module state. Returns: low ceiling.

### tests/mz-branch-editing159.cjs:2

@function mz-branch-editing159.branch.1 — Returns a record containing type, code, indent, parameters, createElse, extensions. Inputs: key; otherwise. Returns: a record containing type, code, indent, parameters, createElse, extensions.

### tests/mz-branch-editing159.cjs:3

@function mz-branch-editing159.callback.2 — Returns c code. Inputs: c. Returns: c code.

### tests/mz-branch-editing159.cjs:3

@function mz-branch-editing159.callback.3 — Returns c code. Inputs: c. Returns: c code.

### tests/mz-branch-editing159.cjs:3

@function mz-branch-editing159.callback.4 — Returns c code equals 411. Inputs: c. Returns: c code equals 411.

### tests/mz-branch-editing159.cjs:4

@function mz-branch-editing159.record.5 — Returns a record containing type, code, indent, parameters. Inputs: code; parameters. Returns: a record containing type, code, indent, parameters.

### tests/mz-branch-editing159.cjs:4

@function mz-branch-editing159.message.6 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-branch-editing159.cjs:4

@function mz-branch-editing159.log.7 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-branch-editing159.cjs:4

@function mz-branch-editing159.canStand.8 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-choices159.cjs:1

@function mz-choices159.mz.1 — Returns a record containing type, code, indent, parameters. Inputs: code; indent; rest element. Returns: a record containing type, code, indent, parameters.

### tests/mz-choices159.cjs:2

@function mz-choices159.sw.2 — Returns mz using 121, indent, id. Inputs: id; indent. Uses: mz. Returns: mz using 121, indent, id.

### tests/mz-choices159.cjs:3

@function mz-choices159.session.3 — Handles session within mz choices159. Inputs: no explicit arguments; uses enclosing module state. Updates: e pages at 0 commands. Uses: f create; structured clone; f create session; f validate. Returns: s.

### tests/mz-choices159.cjs:3

@function mz-choices159.log.4 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-choices159.cjs:3

@function mz-choices159.message.5 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/mz-choices159.cjs:3

@function mz-choices159.canStand.6 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-choices159.cjs:7

@function mz-choices159.callback.7 — Returns c code equals 403. Inputs: c. Returns: c code equals 403.

### tests/mz-choices159.cjs:7

@function mz-choices159.callback.8 — Returns c code equals 121 and c parameters at 0 equals 4. Inputs: c. Returns: c code equals 121 and c parameters at 0 equals 4.

### tests/mz-choices159.cjs:7

@function mz-choices159.callback.9 — Returns c code equals 402. Inputs: c. Returns: c code equals 402.

### tests/mz-choices159.cjs:8

@function mz-choices159.message.10 — Handles message within mz choices159. Inputs: m. Uses: messages push. Returns: false.

### tests/mz-choices159.cjs:8

@function mz-choices159.log.11 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-choices159.cjs:8

@function mz-choices159.canStand.12 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-choices159.cjs:9

@function mz-choices159.callback.13 — Returns frontier mzcommands validate using mz using 102, 0, a list of "Only". Inputs: no explicit arguments; uses enclosing module state. Uses: frontier mzcommands validate; mz. Returns: frontier mzcommands validate using mz using 102, 0, a list of "Only".

### tests/mz-erase159.cjs:1

@function mz-erase159.log.1 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-erase159.cjs:1

@function mz-erase159.message.2 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-erase159.cjs:1

@function mz-erase159.canStand.3 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-flow159.cjs:1

@function mz-flow159.c.1 — Returns a record containing type, code, parameters, indent. Inputs: code; assignment pattern; assignment pattern. Returns: a record containing type, code, parameters, indent.

### tests/mz-flow159.cjs:1

@function mz-flow159.run.2 — Handles run within mz flow159. Inputs: commands. Updates: event pages at 0 commands. Uses: frontier events create; frontier events create session; frontier events validate; assert. Returns: session.

### tests/mz-flow159.cjs:1

@function mz-flow159.log.3 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-flow159.cjs:1

@function mz-flow159.message.4 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-flow159.cjs:1

@function mz-flow159.canStand.5 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-forced-routes159.cjs:1

@function mz-forced-routes159.c.1 — Returns a record containing code, parameters. Inputs: code; rest element. Returns: a record containing code, parameters.

### tests/mz-forced-routes159.cjs:1

@function mz-forced-routes159.mz.2 — Returns a record containing type, code, indent, parameters. Inputs: code; rest element. Returns: a record containing type, code, indent, parameters.

### tests/mz-forced-routes159.cjs:2

@function mz-forced-routes159.fixture.3 — Handles fixture within mz forced routes159. Inputs: target; wait; assignment pattern. Updates: actor extensions; actor pages at 0 mz; actor pages at 0 mz move speed; trigger pages at 0 commands. Uses: f create; frontier event schema page defaults; mz; c. Returns: a record containing session, player, authored, logs.

### tests/mz-forced-routes159.cjs:2

@function mz-forced-routes159.bounds.4 — Calculates or applies the enclosing limits for this module’s data. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing width, height.

### tests/mz-forced-routes159.cjs:2

@function mz-forced-routes159.log.5 — Records a human-readable runtime message. Inputs: x. Uses: logs push. Returns: logs push using x.

### tests/mz-forced-routes159.cjs:2

@function mz-forced-routes159.message.6 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-forced-routes159.cjs:2

@function mz-forced-routes159.canStand.7 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-forced-routes159.cjs:8

@function mz-forced-routes159.log.8 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-forced-routes159.cjs:8

@function mz-forced-routes159.message.9 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-forced-routes159.cjs:8

@function mz-forced-routes159.canStand.10 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-foundation159.cjs:2

@function mz-foundation159.callback.1 — Returns s migrate using a record containing copied fields, schemaVersion. Inputs: no explicit arguments; uses enclosing module state. Uses: s migrate. Returns: s migrate using a record containing copied fields, schemaVersion.

### tests/mz-foundation159.cjs:2

@function mz-foundation159.callback.2 — Returns s extensions using a record containing bad. Inputs: no explicit arguments; uses enclosing module state. Uses: s extensions. Returns: s extensions using a record containing bad.

### tests/mz-foundation159.cjs:5

@function mz-foundation159.record.3 — Returns a record containing type, code, indent, parameters, copied fields. Inputs: code; assignment pattern; assignment pattern. Returns: a record containing type, code, indent, parameters, copied fields.

### tests/mz-foundation159.cjs:5

@function mz-foundation159.log.4 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-foundation159.cjs:5

@function mz-foundation159.canStand.5 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-foundation159.cjs:5

@function mz-foundation159.message.6 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-foundation159.cjs:6

@function mz-foundation159.callback.7 — Returns r validate structure using a list of record using 411. Inputs: no explicit arguments; uses enclosing module state. Uses: r validate structure; record. Returns: r validate structure using a list of record using 411.

### tests/mz-foundation159.cjs:6

@function mz-foundation159.callback.8 — Returns r validate structure using a list of record using 111, a list of 0, 1, 0. Inputs: no explicit arguments; uses enclosing module state. Uses: r validate structure; record. Returns: r validate structure using a list of record using 111, a list of 0, 1, 0.

### tests/mz-foundation159.cjs:6

@function mz-foundation159.log.9 — Records a human-readable runtime message. Inputs: x. Updates: error. Returns: assignment.

### tests/mz-foundation159.cjs:6

@function mz-foundation159.canStand.10 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-foundation159.cjs:6

@function mz-foundation159.message.11 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-foundation159.cjs:7

@function mz-foundation159.callback.12 — Returns c code. Inputs: c. Returns: c code.

### tests/mz-foundation159.cjs:7

@function mz-foundation159.callback.13 — Returns c tab equals 3. Inputs: c. Returns: c tab equals 3.

### tests/mz-foundation159.cjs:7

@function mz-foundation159.callback.14 — Returns c code equals 205 and c status includes using "pending". Inputs: c. Uses: c status includes. Returns: c code equals 205 and c status includes using "pending".

### tests/mz-gold159.cjs:3

@function mz-gold159.message.1 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/mz-gold159.cjs:3

@function mz-gold159.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-gold159.cjs:3

@function mz-gold159.canStand.3 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-gold159.cjs:4

@function mz-gold159.mz.4 — Returns a record containing type, code, indent, parameters. Inputs: rest element. Returns: a record containing type, code, indent, parameters.

### tests/mz-gold159.cjs:5

@function mz-gold159.session.5 — Handles session within mz gold159. Inputs: commands. Updates: e pages at 0 commands. Uses: f create; f create session; f validate; s start. Returns: s.

### tests/mz-gold159.cjs:7

@function mz-gold159.callback.6 — Returns frontier event state validate using a record containing gold. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event state validate. Returns: frontier event state validate using a record containing gold.

### tests/mz-gold159.cjs:10

@function mz-gold159.validate.7 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: number is integer; error.

### tests/mz-gold159.cjs:10

@function mz-gold159.execute.8 — Handles execute within mz gold159. Inputs: c; object pattern. Updates: state gold. Returns: a record containing wait.

### tests/mz-gold159.cjs:12

@function mz-gold159.callback.9 — Returns r register using "test:award", a record containing . Inputs: no explicit arguments; uses enclosing module state. Uses: r register. Returns: r register using "test:award", a record containing .

### tests/mz-gold159.cjs:12

@function mz-gold159.callback.10 — Returns r register using "wait", a record containing validate, execute. Inputs: no explicit arguments; uses enclosing module state. Uses: r register. Returns: r register using "wait", a record containing validate, execute.

### tests/mz-gold159.cjs:12

@function mz-gold159.validate.11 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-gold159.cjs:12

@function mz-gold159.execute.12 — Handles execute within mz gold159. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-gold159.cjs:12

@function mz-gold159.callback.13 — Returns r validate using a record containing type, amount. Inputs: no explicit arguments; uses enclosing module state. Uses: r validate. Returns: r validate using a record containing type, amount.

### tests/mz-gold159.cjs:13

@function mz-gold159.callback.14 — Returns frontier mzcommands validate using mz using 0, 1, 0. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier mzcommands validate; mz. Returns: frontier mzcommands validate using mz using 0, 1, 0.

### tests/mz-gold159.cjs:17

@function mz-gold159.command.15 — Returns a record containing type, code, indent, parameters. Inputs: code; assignment pattern. Returns: a record containing type, code, indent, parameters.

### tests/mz-gold159.cjs:21

@function mz-gold159.callback.16 — Returns frontier conditions validate using frontier mzcommands condition using a list of 7, 100, 3. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier conditions validate; frontier mzcommands condition. Returns: frontier conditions validate using frontier mzcommands condition using a list of 7, 100, 3.

### tests/mz-groups159.cjs:1

@function mz-groups159.c.1 — Returns a record containing type, code, indent, parameters, extensions. Inputs: code; assignment pattern. Returns: a record containing type, code, indent, parameters, extensions.

### tests/mz-groups159.cjs:1

@function mz-groups159.callback.2 — Returns c indent. Inputs: c. Returns: c indent.

### tests/mz-groups159.cjs:1

@function mz-groups159.callback.3 — Returns e rebase using commands, 32. Inputs: no explicit arguments; uses enclosing module state. Uses: e rebase. Returns: e rebase using commands, 32.

### tests/mz-items159.cjs:2

@function mz-items159.mz.1 — Returns a record containing type, code, indent, parameters. Inputs: code; rest element. Returns: a record containing type, code, indent, parameters.

### tests/mz-items159.cjs:2

@function mz-items159.message.2 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/mz-items159.cjs:2

@function mz-items159.log.3 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-items159.cjs:2

@function mz-items159.canStand.4 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-items159.cjs:6

@function mz-items159.callback.5 — Returns frontier mzcommands validate using mz using 126, 0, 0. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier mzcommands validate; mz. Returns: frontier mzcommands validate using mz using 126, 0, 0.

### tests/mz-number159.cjs:1

@function mz-number159.mz.1 — Returns a record containing type, code, indent, parameters. Inputs: code; rest element. Returns: a record containing type, code, indent, parameters.

### tests/mz-number159.cjs:1

@function mz-number159.message.2 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/mz-number159.cjs:1

@function mz-number159.log.3 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-number159.cjs:1

@function mz-number159.canStand.4 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-number159.cjs:2

@function mz-number159.callback.5 — Returns n initial using 1, 9. Inputs: no explicit arguments; uses enclosing module state. Uses: n initial. Returns: n initial using 1, 9.

### tests/mz-number159.cjs:2

@function mz-number159.callback.6 — Returns n change using 1, 3, 3. Inputs: no explicit arguments; uses enclosing module state. Uses: n change. Returns: n change using 1, 3, 3.

### tests/mz-number159.cjs:4

@function mz-number159.message.7 — Handles message within mz number159. Inputs: m. Uses: messages push. Returns: false.

### tests/mz-number159.cjs:6

@function mz-number159.callback.8 — Returns frontier mzcommands validate using mz using 103, 7, 0. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier mzcommands validate; mz. Returns: frontier mzcommands validate using mz using 103, 7, 0.

### tests/mz-number159.cjs:6

@function mz-number159.callback.9 — Returns frontier mzcommands validate using mz using 103, 0, 1. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier mzcommands validate; mz. Returns: frontier mzcommands validate using mz using 103, 0, 1.

### tests/mz-parallel159.cjs:1

@function mz-parallel159.add.1 — Returns a record containing type, key, operation, value. Inputs: key; assignment pattern. Returns: a record containing type, key, operation, value.

### tests/mz-parallel159.cjs:1

@function mz-parallel159.wait.2 — Returns a record containing type, seconds. Inputs: seconds. Returns: a record containing type, seconds.

### tests/mz-parallel159.cjs:1

@function mz-parallel159.event.3 — Handles event within mz parallel159. Inputs: id; commands; assignment pattern. Updates: e pages at 0 trigger; e pages at 0 commands. Uses: f create. Returns: e.

### tests/mz-parallel159.cjs:1

@function mz-parallel159.log.4 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-parallel159.cjs:1

@function mz-parallel159.message.5 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/mz-parallel159.cjs:1

@function mz-parallel159.canStand.6 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-parallel159.cjs:4

@function mz-parallel159.message.7 — Handles message within mz parallel159. Inputs: m. Uses: displayed push. Returns: false.

### tests/mz-parallel159.cjs:7

@function mz-parallel159.callback.8 — Returns event using "loop-" plus i, a list of a record containing type, code, indent, parameters, add using "loop-" plus i, a record containing type, code, indent, parameters. Inputs: ; i. Uses: event; add. Returns: event using "loop-" plus i, a list of a record containing type, code, indent, parameters, add using "loop-" plus i, a record containing type, code, indent, parameters.

### tests/mz-parallel159.cjs:7

@function mz-parallel159.callback.9 — Returns n is greater than 0 and n is less than 100. Inputs: n. Returns: n is greater than 0 and n is less than 100.

### tests/mz-route-se159.cjs:2

@function mz-route-se159.callback.1 — Returns r validate using a record containing copied fields, list. Inputs: no explicit arguments; uses enclosing module state. Uses: r validate. Returns: r validate using a record containing copied fields, list.

### tests/mz-route-se159.cjs:2

@function mz-route-se159.callback.2 — Returns r start using route, page. Inputs: no explicit arguments; uses enclosing module state. Uses: r start. Returns: r start using route, page.

### tests/mz-route-se159.cjs:3

@function mz-route-se159.playSE.3 — Returns calls push using s. Inputs: s. Uses: calls push. Returns: calls push using s.

### tests/mz-route-se159.cjs:3

@function mz-route-se159.playSE.4 — Returns calls push using s. Inputs: s. Uses: calls push. Returns: calls push using s.

### tests/mz-route-se159.cjs:3

@function mz-route-se159.playSE.5 — Handles play se within mz route se159. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-route-se159.cjs:4

@function mz-route-se159.log.6 — Records a human-readable runtime message. Inputs: t. Uses: logs push. Returns: logs push using t.

### tests/mz-route-se159.cjs:4

@function mz-route-se159.message.7 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/mz-route-se159.cjs:4

@function mz-route-se159.canStand.8 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-route-se159.cjs:4

@function mz-route-se159.playSE.9 — Returns calls push using s. Inputs: s. Uses: calls push. Returns: calls push using s.

### tests/mz-route-se159.cjs:6

@function mz-route-se159.playSE.10 — Handles play se within mz route se159. Inputs: no explicit arguments; uses enclosing module state. Uses: error.

### tests/mz-route-se159.cjs:6

@function mz-route-se159.callback.11 — Returns broken update using 0.1, a record containing x, y. Inputs: no explicit arguments; uses enclosing module state. Uses: broken update. Returns: broken update using 0.1, a record containing x, y.

### tests/mz-route-se159.cjs:6

@function mz-route-se159.callback.12 — Returns t includes using "Missing sound fixture". Inputs: t. Uses: t includes. Returns: t includes using "Missing sound fixture".

### tests/mz-routes159.cjs:2

@function mz-routes159.c.1 — Returns a record containing code, parameters. Inputs: code; rest element. Returns: a record containing code, parameters.

### tests/mz-routes159.cjs:3

@function mz-routes159.bounds.2 — Calculates or applies the enclosing limits for this module’s data. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing width, height.

### tests/mz-routes159.cjs:3

@function mz-routes159.canStand.3 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-routes159.cjs:3

@function mz-routes159.routeSwitch.4 — Returns switches set using k, v. Inputs: k; v. Uses: switches set. Returns: switches set using k, v.

### tests/mz-routes159.cjs:4

@function mz-routes159.blocked.5 — Tests whether the proposed movement or location meets a solid obstacle. Inputs: skippable. Updates: p mz move route. Uses: structured clone; c; frontier event motion update; assert equal. Returns: sw.

### tests/mz-routes159.cjs:4

@function mz-routes159.canStand.6 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/mz-routes159.cjs:4

@function mz-routes159.routeSwitch.7 — Returns sw set using k, v. Inputs: k; v. Uses: sw set. Returns: sw set using k, v.

### tests/mz-routes159.cjs:6

@function mz-routes159.callback.8 — Returns frontier mzroutes start using a record containing copied fields, list, page. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier mzroutes start; frontier mzroutes defaults; c. Returns: frontier mzroutes start using a record containing copied fields, list, page.

### tests/mz-routes159.cjs:6

@function mz-routes159.callback.9 — Returns frontier mzroutes validate using a record containing copied fields, list. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier mzroutes validate; frontier mzroutes defaults; c. Returns: frontier mzroutes validate using a record containing copied fields, list.

### tests/mz-se159.cjs:1

@function mz-se159.constructor.1 — function Object() { [native code] } Inputs: no explicit arguments; uses enclosing module state. Updates: this paused; this ended; this current time.

### tests/mz-se159.cjs:1

@function mz-se159.play.2 — Handles play within mz se159. Inputs: no explicit arguments; uses enclosing module state. Updates: this paused. Uses: promise resolve. Returns: promise resolve using .

### tests/mz-se159.cjs:1

@function mz-se159.pause.3 — Handles pause within mz se159. Inputs: no explicit arguments; uses enclosing module state. Updates: this paused.

### tests/mz-se159.cjs:2

@function mz-se159.node.4 — Returns a record containing gain, pan, connect, disconnect. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing gain, pan, connect, disconnect.

### tests/mz-se159.cjs:2

@function mz-se159.connect.5 — Handles connect within mz se159. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-se159.cjs:2

@function mz-se159.disconnect.6 — Handles disconnect within mz se159. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-se159.cjs:2

@function mz-se159.createMediaElementSource.7 — Handles create media element source within mz se159. Inputs: no explicit arguments; uses enclosing module state. Uses: node. Returns: node using .

### tests/mz-se159.cjs:2

@function mz-se159.callback.8 — Returns se play event using sound. Inputs: no explicit arguments; uses enclosing module state. Uses: se play event. Returns: se play event using sound.

### tests/mz-se159.cjs:4

@function mz-se159.callback.9 — Provides the callback for se play event. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-se159.cjs:4

@function mz-se159.callback.10 — Returns se play event using a record containing copied fields, name. Inputs: no explicit arguments; uses enclosing module state. Uses: se play event. Returns: se play event using a record containing copied fields, name.

### tests/mz-se159.cjs:5

@function mz-se159.callback.11 — Returns se play event using sound. Inputs: no explicit arguments; uses enclosing module state. Uses: se play event. Returns: se play event using sound.

### tests/mz-se159.cjs:5

@function mz-se159.callback.12 — Returns se play event using a record containing copied fields, pan. Inputs: no explicit arguments; uses enclosing module state. Uses: se play event. Returns: se play event using a record containing copied fields, pan.

### tests/mz-se159.cjs:6

@function mz-se159.log.13 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-se159.cjs:6

@function mz-se159.message.14 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/mz-se159.cjs:6

@function mz-se159.canStand.15 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-se159.cjs:6

@function mz-se159.playSE.16 — Returns calls push using s. Inputs: s. Uses: calls push. Returns: calls push using s.

### tests/mz-se159.cjs:6

@function mz-se159.stopSE.17 — Returns calls push using "stop". Inputs: no explicit arguments; uses enclosing module state. Uses: calls push. Returns: calls push using "stop".

### tests/mz-state159.cjs:1

@function mz-state159.message.1 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-state159.cjs:1

@function mz-state159.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-state159.cjs:1

@function mz-state159.canStand.3 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-state159.cjs:1

@function mz-state159.callback.4 — Returns frontier event state validate using a record containing partyActors. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event state validate. Returns: frontier event state validate using a record containing partyActors.

### tests/mz-state159.cjs:1

@function mz-state159.callback.5 — Returns frontier event state validate using a record containing quests. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event state validate. Returns: frontier event state validate using a record containing quests.

### tests/mz-timer159.cjs:1

@function mz-timer159.log.1 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-timer159.cjs:1

@function mz-timer159.message.2 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-timer159.cjs:1

@function mz-timer159.canStand.3 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-timer159.cjs:1

@function mz-timer159.compare.4 — Returns frontier conditions evaluate using frontier conditions validate using a record containing type, seconds, operator, a record containing state. Inputs: seconds; operator. Uses: frontier conditions evaluate; frontier conditions validate. Returns: frontier conditions evaluate using frontier conditions validate using a record containing type, seconds, operator, a record containing state.

### tests/mz-timer159.cjs:2

@function mz-timer159.callback.5 — Returns frontier event state validate using a record containing timer. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event state validate. Returns: frontier event state validate using a record containing timer.

### tests/mz-timer159.cjs:2

@function mz-timer159.callback.6 — Returns frontier event state validate using a record containing timer. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event state validate. Returns: frontier event state validate using a record containing timer.

### tests/mz-variables159.cjs:2

@function mz-variables159.record.1 — Returns a record containing type, code, indent, parameters. Inputs: p. Returns: a record containing type, code, indent, parameters.

### tests/mz-variables159.cjs:3

@function mz-variables159.message.2 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-variables159.cjs:3

@function mz-variables159.log.3 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/mz-variables159.cjs:3

@function mz-variables159.canStand.4 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/mz-variables159.cjs:3

@function mz-variables159.callback.5 — Returns frontier mzcommands validate using record using a list of 1, 1, 0, 2. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier mzcommands validate; record. Returns: frontier mzcommands validate using record using a list of 1, 1, 0, 2.

### tests/normal-bindings159.cjs:1

@function normal-bindings159.callback.1 — Returns b validate using a record containing copied fields, entries. Inputs: no explicit arguments; uses enclosing module state. Uses: b validate. Returns: b validate using a record containing copied fields, entries.

### tests/normal-bindings159.cjs:1

@function normal-bindings159.callback.2 — Returns b validate using a record containing copied fields, entries. Inputs: no explicit arguments; uses enclosing module state. Uses: b validate. Returns: b validate using a record containing copied fields, entries.

### tests/normal-bindings159.cjs:1

@function normal-bindings159.callback.3 — Returns b validate using a record containing copied fields, entries. Inputs: no explicit arguments; uses enclosing module state. Uses: b validate. Returns: b validate using a record containing copied fields, entries.

### tests/normal-bindings159.cjs:1

@function normal-bindings159.callback.4 — Returns b validate using a record containing copied fields, entries. Inputs: no explicit arguments; uses enclosing module state. Uses: b validate. Returns: b validate using a record containing copied fields, entries.

### tests/normal-bindings159.cjs:2

@function normal-bindings159.bad.5 — Returns 0. Inputs: no explicit arguments; uses enclosing module state. Returns: 0.

### tests/normal-bindings159.cjs:2

@function normal-bindings159.callback.6 — Returns b validate using a record containing copied fields, entries. Inputs: no explicit arguments; uses enclosing module state. Uses: b validate. Returns: b validate using a record containing copied fields, entries.

### tests/normal-bindings159.cjs:2

@function normal-bindings159.callback.7 — Returns b validate using a record containing copied fields, entries. Inputs: no explicit arguments; uses enclosing module state. Uses: b validate. Returns: b validate using a record containing copied fields, entries.

### tests/normal-bindings159.cjs:2

@function normal-bindings159.callback.8 — Returns b validate using a record containing copied fields, entries. Inputs: no explicit arguments; uses enclosing module state. Uses: b validate. Returns: b validate using a record containing copied fields, entries.

### tests/normal-cache159.cjs:2

@function normal-cache159.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: vm run in new context; fs read file sync; require using "node:path" join; require.

### tests/normal-cache159.cjs:2

@function normal-cache159.prepare.2 — Returns a new promise. Inputs: source; binding; signal. Returns: a new promise.

### tests/normal-cache159.cjs:2

@function normal-cache159.callback.3 — Returns pending push using a record containing source, signal, resolve. Inputs: resolve. Uses: pending push. Returns: pending push using a record containing source, signal, resolve.

### tests/normal-cache159.cjs:2

@function normal-cache159.releaseImage.4 — Returns released push using c. Inputs: c. Uses: released push. Returns: released push using c.

### tests/normal-cache159.cjs:2

@function normal-cache159.callback.5 — Returns set timeout using r, 0. Inputs: r. Uses: set timeout. Returns: set timeout using r, 0.

### tests/normal-cache159.cjs:2

@function normal-cache159.callback.6 — Returns set timeout using r, 0. Inputs: r. Uses: set timeout. Returns: set timeout using r, 0.

### tests/normal-cache159.cjs:2

@function normal-cache159.callback.7 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/page-cache159.cjs:2

@function page-cache159.callback.1 — Returns a record containing copied fields, condition, commands. Inputs: ; i. Uses: f page. Returns: a record containing copied fields, condition, commands.

### tests/page-cache159.cjs:2

@function page-cache159.message.2 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/page-cache159.cjs:2

@function page-cache159.log.3 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/page-cache159.cjs:2

@function page-cache159.canStand.4 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/page-cache159.cjs:13

@function page-cache159.validate.5 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing .

### tests/page-cache159.cjs:13

@function page-cache159.evaluate.6 — Returns context state live. Inputs: c; context. Returns: context state live.

### tests/party-target159.cjs:1

@function party-target159.callback.1 — Returns a list of e id, e. Inputs: e. Returns: a list of e id, e.

### tests/port06.cjs:5

@function port06.load.1 — Handles load within port06. Inputs: name. Uses: vm run in context; fs read file sync; path join.

### tests/port06.cjs:9

@function port06.callback.2 — Returns assignment. Inputs: d. Updates: d profiles at 0 columns. Returns: assignment.

### tests/port06.cjs:9

@function port06.callback.3 — Returns assignment. Inputs: d. Updates: d profiles at 0 reference height. Returns: assignment.

### tests/port06.cjs:9

@function port06.callback.4 — Returns d profiles at 0 frames pop using . Inputs: d. Uses: d profiles at 0 frames pop. Returns: d profiles at 0 frames pop using .

### tests/port06.cjs:9

@function port06.callback.5 — Returns assignment. Inputs: d. Updates: d profiles at 0 direction rows. Returns: assignment.

### tests/port06.cjs:9

@function port06.callback.6 — Returns assignment. Inputs: d. Updates: d profiles at 0 direction frame seconds. Returns: assignment.

### tests/port06.cjs:9

@function port06.callback.7 — Returns assignment. Inputs: d. Updates: d profiles at 0 muzzles at "0:0" x. Returns: assignment.

### tests/port06.cjs:9

@function port06.callback.8 — Returns m validate using copy. Inputs: no explicit arguments; uses enclosing module state. Uses: m validate. Returns: m validate using copy.

### tests/port06.cjs:11

@function port06.callback.9 — Returns p compile using a list of a record containing aliases, answer. Inputs: no explicit arguments; uses enclosing module state. Uses: p compile. Returns: p compile using a list of a record containing aliases, answer.

### tests/port06.cjs:12

@function port06.resolve.10 — Handles resolve within port06. Inputs: type. Uses: a list of "cream", "regular", "none" includes; error.

### tests/port06.cjs:18

@function port06.callback.11 — Returns scope frontier save validate using a record containing copied fields, partyActors. Inputs: no explicit arguments; uses enclosing module state. Uses: scope frontier save validate. Returns: scope frontier save validate using a record containing copied fields, partyActors.

### tests/port06.cjs:19

@function port06.callback.12 — Returns assignment. Inputs: s. Updates: s player weapon. Returns: assignment.

### tests/port06.cjs:19

@function port06.callback.13 — Returns assignment. Inputs: s. Updates: s player x. Returns: assignment.

### tests/port06.cjs:19

@function port06.callback.14 — Returns assignment. Inputs: s. Updates: s player ammo loaded. Returns: assignment.

### tests/port06.cjs:19

@function port06.callback.15 — Returns assignment. Inputs: s. Updates: s switches. Returns: assignment.

### tests/port06.cjs:19

@function port06.callback.16 — Returns assignment. Inputs: s. Updates: s blood actors player. Returns: assignment.

### tests/port06.cjs:19

@function port06.callback.17 — Returns scope frontier save validate using copy. Inputs: no explicit arguments; uses enclosing module state. Uses: scope frontier save validate. Returns: scope frontier save validate using copy.

### tests/port06.cjs:26

@function port06.callback.18 — Returns rules validate using a record containing zoomMin, zoomMax. Inputs: no explicit arguments; uses enclosing module state. Uses: rules validate. Returns: rules validate using a record containing zoomMin, zoomMax.

### tests/port06.cjs:26

@function port06.callback.19 — Returns rules validate using a record containing jumpHeight. Inputs: no explicit arguments; uses enclosing module state. Uses: rules validate. Returns: rules validate using a record containing jumpHeight.

### tests/port06.cjs:31

@function port06.callback.20 — Returns music validate using a record containing exploration. Inputs: no explicit arguments; uses enclosing module state. Uses: music validate. Returns: music validate using a record containing exploration.

### tests/port06.cjs:32

@function port06.callback.21 — Returns 0.2. Inputs: no explicit arguments; uses enclosing module state. Returns: 0.2.

### tests/port06.cjs:34

@function port06.constructor.22 — function Object() { [native code] } Inputs: no explicit arguments; uses enclosing module state. Updates: this paused. Uses: voices push.

### tests/port06.cjs:34

@function port06.play.23 — Handles play within port06. Inputs: no explicit arguments; uses enclosing module state. Updates: this paused. Uses: promise resolve. Returns: promise resolve using .

### tests/port06.cjs:34

@function port06.pause.24 — Handles pause within port06. Inputs: no explicit arguments; uses enclosing module state. Updates: this paused.

### tests/port06.cjs:34

@function port06.removeAttribute.25 — Handles remove attribute within port06. Inputs: no explicit arguments; uses enclosing module state. Updates: this src.

### tests/port06.cjs:34

@function port06.load.26 — Handles load within port06. Inputs: no explicit arguments; uses enclosing module state.

### tests/port06.cjs:35

@function port06.callback.27 — Returns music time. Inputs: no explicit arguments; uses enclosing module state. Returns: music time.

### tests/quest-lifecycle159.cjs:2

@function quest-lifecycle159.make.1 — Returns frontier events create session using frontier quest example events using , a record containing log, message. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier events create session; frontier quest example events. Returns: frontier events create session using frontier quest example events using , a record containing log, message.

### tests/quest-lifecycle159.cjs:2

@function quest-lifecycle159.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/quest-lifecycle159.cjs:2

@function quest-lifecycle159.message.3 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/quest-lifecycle159.cjs:3

@function quest-lifecycle159.interact.4 — Handles interact within quest lifecycle159. Inputs: s; id; assignment pattern. Uses: assert; s start; s events find; s update.

### tests/quest-lifecycle159.cjs:3

@function quest-lifecycle159.callback.5 — Returns e id equals id. Inputs: e. Returns: e id equals id.

### tests/quest-lifecycle159.cjs:7

@function quest-lifecycle159.callback.6 — Returns frontier event runtime validate using a record containing type, domain, key, operation, value. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event runtime validate. Returns: frontier event runtime validate using a record containing type, domain, key, operation, value.

### tests/quest-lifecycle159.cjs:7

@function quest-lifecycle159.callback.7 — Returns frontier event runtime validate using a record containing type, domain, key, operation, value. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event runtime validate. Returns: frontier event runtime validate using a record containing type, domain, key, operation, value.

### tests/quest-maps159.cjs:5

@function quest-maps159.callback.1 — Returns e id equals "courier-travel". Inputs: e. Returns: e id equals "courier-travel".

### tests/quest-maps159.cjs:6

@function quest-maps159.callback.2 — Returns c frontier quest example maps using base, a list of . Inputs: no explicit arguments; uses enclosing module state. Uses: c frontier quest example maps. Returns: c frontier quest example maps using base, a list of .

### tests/regression155.cjs:2

@function regression155.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p on; p goto.

### tests/regression155.cjs:2

@function regression155.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/regression155.cjs:2

@function regression155.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw.

### tests/regression155.cjs:2

@function regression155.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/regression155.cjs:2

@function regression155.callback.5 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/regression155.cjs:2

@function regression155.callback.6 — Returns document pointer lock element. Inputs: no explicit arguments; uses enclosing module state. Returns: document pointer lock element.

### tests/regression155.cjs:2

@function regression155.callback.7 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: g ui time. Uses: performance now; document get element by id using "view" dispatch event; document get element by id; parse float. Returns: a record containing left, top, x, y, hudHeld.

### tests/regression155.cjs:2

@function regression155.callback.8 — Returns request animation frame using a callback. Inputs: r. Uses: request animation frame. Returns: request animation frame using a callback.

### tests/regression155.cjs:2

@function regression155.callback.9 — Returns request animation frame using r. Inputs: no explicit arguments; uses enclosing module state. Uses: request animation frame. Returns: request animation frame using r.

### tests/regression155.cjs:3

@function regression155.callback.10 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: minimum; underwater; wet. Uses: object assign; frontier terrain height; frontier render camera; frontier water level. Returns: a record containing minimum, underwater, missing, treeInset, anchorsLoaded, loaded.

### tests/regression155.cjs:4

@function regression155.callback.11 — Returns frontier sprites sheet using e. Inputs: e. Uses: frontier sprites sheet. Returns: frontier sprites sheet using e.

### tests/regression155.cjs:4

@function regression155.callback.12 — Returns s image complete. Inputs: s. Returns: s image complete.

### tests/regression155.cjs:5

@function regression155.callback.13 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: g player x; g player y; g player z; g camera pitch; g camera yaw. Uses: frontier terrain height.

### tests/regression155.cjs:5

@function regression155.callback.14 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier render camera; frontier terrain height; frontier water level. Returns: a record containing copied fields, floor, level.

### tests/regression155.cjs:5

@function regression155.callback.15 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: g player x; g player y; g player z; g camera pitch; g camera distance.

### tests/regression155.cjs:5

@function regression155.callback.16 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/run.cjs:7

@function run.callback.1 — Returns w objects push using a record containing copied fields. Inputs: w. Uses: w objects push. Returns: w objects push using a record containing copied fields.

### tests/run.cjs:7

@function run.callback.2 — Returns assignment. Inputs: w. Updates: w spawn x. Returns: assignment.

### tests/run.cjs:7

@function run.callback.3 — Returns assignment. Inputs: w. Updates: w objects at 0 kind. Returns: assignment.

### tests/run.cjs:7

@function run.callback.4 — Returns assignment. Inputs: w. Updates: w objects at 0 x. Returns: assignment.

### tests/run.cjs:7

@function run.callback.5 — Returns assignment. Inputs: w. Updates: w objects at 0 x. Returns: assignment.

### tests/run.cjs:7

@function run.callback.6 — Returns assignment. Inputs: w. Updates: w size. Returns: assignment.

### tests/run.cjs:7

@function run.callback.7 — Returns w validate using w. Inputs: no explicit arguments; uses enclosing module state. Uses: w validate. Returns: w validate using w.

### tests/run.cjs:8

@function run.game.8 — Handles game within run. Inputs: objects. Uses: mf make frontier game. Returns: mf make frontier game using a record containing spawn, objects, a callback.

### tests/run.cjs:8

@function run.callback.9 — Provides the callback for mf make frontier game. Inputs: no explicit arguments; uses enclosing module state.

### tests/run.cjs:9

@function run.callback.10 — Returns e type equals "actor.damaged". Inputs: e. Returns: e type equals "actor.damaged".

### tests/run.cjs:11

@function run.callback.11 — Returns e type equals "actor.killed". Inputs: e. Returns: e type equals "actor.killed".

### tests/run.cjs:16

@function run.callback.12 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/run.cjs:17

@function run.callback.13 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/run.cjs:22

@function run.now.14 — Returns clock. Inputs: no explicit arguments; uses enclosing module state. Returns: clock.

### tests/run.cjs:22

@function run.register.15 — Handles register within run. Inputs: p. Updates: plugin.

### tests/run.cjs:24

@function run.claimFootsteps.16 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/run.cjs:24

@function run.releaseFootsteps.17 — Handles release footsteps within run. Inputs: no explicit arguments; uses enclosing module state.

### tests/run.cjs:24

@function run.synthSweep.18 — Returns sweeps push using o. Inputs: o. Uses: sweeps push. Returns: sweeps push using o.

### tests/run.cjs:25

@function run.log.19 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/scene-transition159.cjs:1

@function scene-transition159.commit.1 — Returns update. Inputs: no explicit arguments; uses enclosing module state. Returns: update.

### tests/scene-transition159.cjs:1

@function scene-transition159.complete.2 — Returns update. Inputs: no explicit arguments; uses enclosing module state. Returns: update.

### tests/scene-transition159.cjs:1

@function scene-transition159.opacity.3 — Returns assignment. Inputs: value. Updates: last. Returns: assignment.

### tests/scene-transition159.cjs:2

@function scene-transition159.commit.4 — Handles commit within scene transition159. Inputs: no explicit arguments; uses enclosing module state. Uses: error.

### tests/scene-transition159.cjs:2

@function scene-transition159.complete.5 — Returns assert fail using "must not resume". Inputs: no explicit arguments; uses enclosing module state. Uses: assert fail. Returns: assert fail using "must not resume".

### tests/scene-transition159.cjs:2

@function scene-transition159.opacity.6 — Handles opacity within scene transition159. Inputs: no explicit arguments; uses enclosing module state.

### tests/scene-transition159.cjs:2

@function scene-transition159.callback.7 — Returns failed update using 0. Inputs: no explicit arguments; uses enclosing module state. Uses: failed update. Returns: failed update using 0.

### tests/scene-transition159.cjs:5

@function scene-transition159.commit.8 — Returns update. Inputs: no explicit arguments; uses enclosing module state. Returns: update.

### tests/scene-transition159.cjs:5

@function scene-transition159.complete.9 — Returns update. Inputs: no explicit arguments; uses enclosing module state. Returns: update.

### tests/scene-transition159.cjs:5

@function scene-transition159.opacity.10 — Handles opacity within scene transition159. Inputs: no explicit arguments; uses enclosing module state.

### tests/scene-transition159.cjs:5

@function scene-transition159.begin.11 — Returns update. Inputs: no explicit arguments; uses enclosing module state. Returns: update.

### tests/scene-transition159.cjs:5

@function scene-transition159.update.12 — Advances this system using the current state and elapsed time. Inputs: dt. Updates: time. Returns: assignment is at least 1.

### tests/scene-transition159.cjs:5

@function scene-transition159.end.13 — Returns update. Inputs: no explicit arguments; uses enclosing module state. Returns: update.

### tests/scene-transition159.cjs:5

@function scene-transition159.callback.14 — Returns t reserve using a record containing map, fade, effect. Inputs: no explicit arguments; uses enclosing module state. Uses: t reserve. Returns: t reserve using a record containing map, fade, effect.

### tests/scene-transition159.cjs:5

@function scene-transition159.commit.15 — Handles commit within scene transition159. Inputs: no explicit arguments; uses enclosing module state. Uses: error.

### tests/scene-transition159.cjs:5

@function scene-transition159.complete.16 — Returns assert fail using . Inputs: no explicit arguments; uses enclosing module state. Uses: assert fail. Returns: assert fail using .

### tests/scene-transition159.cjs:5

@function scene-transition159.opacity.17 — Handles opacity within scene transition159. Inputs: no explicit arguments; uses enclosing module state.

### tests/scene-transition159.cjs:5

@function scene-transition159.begin.18 — Handles begin within scene transition159. Inputs: no explicit arguments; uses enclosing module state.

### tests/scene-transition159.cjs:5

@function scene-transition159.update.19 — Advances this system using the current state and elapsed time. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/scene-transition159.cjs:5

@function scene-transition159.end.20 — Returns update. Inputs: no explicit arguments; uses enclosing module state. Returns: update.

### tests/scene-transition159.cjs:5

@function scene-transition159.callback.21 — Returns bad update using 0.1. Inputs: no explicit arguments; uses enclosing module state. Uses: bad update. Returns: bad update using 0.1.

### tests/screen-fade159.cjs:1

@function screen-fade159.callback.1 — Returns assignment. Inputs: n. Updates: rendered. Returns: assignment.

### tests/screen-fade159.cjs:1

@function screen-fade159.callback.2 — Returns assignment. Inputs: n. Updates: rendered. Returns: assignment.

### tests/screen-fade159.cjs:1

@function screen-fade159.callback.3 — Returns restored restore using a record containing copied fields, opacity. Inputs: no explicit arguments; uses enclosing module state. Uses: restored restore. Returns: restored restore using a record containing copied fields, opacity.

### tests/screen-fade159.cjs:2

@function screen-fade159.log.4 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/screen-fade159.cjs:2

@function screen-fade159.message.5 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/screen-fade159.cjs:2

@function screen-fade159.canStand.6 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/screen-fade159.cjs:2

@function screen-fade159.screenFade.7 — Returns calls push using v. Inputs: v. Uses: calls push. Returns: calls push using v.

### tests/screen-flash159.cjs:2

@function screen-flash159.callback.1 — Returns assignment. Inputs: rgb; alpha. Updates: painted. Returns: assignment.

### tests/screen-flash159.cjs:5

@function screen-flash159.callback.2 — Returns assignment. Inputs: rgb; alpha. Updates: painted. Returns: assignment.

### tests/screen-flash159.cjs:7

@function screen-flash159.callback.3 — Returns restored start using a list of 0, 0, 0, 256, 30. Inputs: no explicit arguments; uses enclosing module state. Uses: restored start. Returns: restored start using a list of 0, 0, 0, 256, 30.

### tests/screen-flash159.cjs:7

@function screen-flash159.callback.4 — Returns restored start using a list of 0, 0, 0, 0, 0. Inputs: no explicit arguments; uses enclosing module state. Uses: restored start. Returns: restored start using a list of 0, 0, 0, 0, 0.

### tests/screen-flash159.cjs:7

@function screen-flash159.callback.5 — Returns restored restore using a record containing copied fields, elapsed. Inputs: no explicit arguments; uses enclosing module state. Uses: restored restore. Returns: restored restore using a record containing copied fields, elapsed.

### tests/screen-flash159.cjs:10

@function screen-flash159.log.6 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/screen-flash159.cjs:10

@function screen-flash159.message.7 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/screen-flash159.cjs:10

@function screen-flash159.canStand.8 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/screen-flash159.cjs:10

@function screen-flash159.screenFlash.9 — Returns calls push using a record containing color, frames. Inputs: color; frames. Uses: calls push. Returns: calls push using a record containing color, frames.

### tests/screen-flash159.cjs:13

@function screen-flash159.callback.10 — Returns frontier mzcommands validate using a record containing type, code, parameters. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier mzcommands validate. Returns: frontier mzcommands validate using a record containing type, code, parameters.

### tests/screen-melt-overlay159.cjs:3

@function screen-melt-overlay159.makeCanvas.1 — Handles make canvas within screen melt overlay159. Inputs: no explicit arguments; uses enclosing module state. Uses: canvases push. Returns: c.

### tests/screen-melt-overlay159.cjs:3

@function screen-melt-overlay159.setAttribute.2 — Handles set attribute within screen melt overlay159. Inputs: no explicit arguments; uses enclosing module state.

### tests/screen-melt-overlay159.cjs:3

@function screen-melt-overlay159.remove.3 — Handles remove within screen melt overlay159. Inputs: no explicit arguments; uses enclosing module state.

### tests/screen-melt-overlay159.cjs:3

@function screen-melt-overlay159.getContext.4 — Handles get context within screen melt overlay159. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing clearRect, drawImage.

### tests/screen-melt-overlay159.cjs:3

@function screen-melt-overlay159.clearRect.5 — Handles clear rect within screen melt overlay159. Inputs: no explicit arguments; uses enclosing module state.

### tests/screen-melt-overlay159.cjs:3

@function screen-melt-overlay159.drawImage.6 — Handles draw image within screen melt overlay159. Inputs: rest element. Uses: calls push.

### tests/screen-melt-overlay159.cjs:4

@function screen-melt-overlay159.append.7 — Handles append within screen melt overlay159. Inputs: no explicit arguments; uses enclosing module state.

### tests/screen-melt-overlay159.cjs:4

@function screen-melt-overlay159.capture.8 — Handles capture within screen melt overlay159. Inputs: no explicit arguments; uses enclosing module state.

### tests/screen-melt-overlay159.cjs:5

@function screen-melt-overlay159.callback.9 — Returns service begin using . Inputs: no explicit arguments; uses enclosing module state. Uses: service begin. Returns: service begin using .

### tests/screen-melt-overlay159.cjs:5

@function screen-melt-overlay159.callback.10 — Returns a at 3 is greater than 0 and a at 4 is greater than 0. Inputs: a. Returns: a at 3 is greater than 0 and a at 4 is greater than 0.

### tests/screen-melt-overlay159.cjs:5

@function screen-melt-overlay159.callback.11 — Returns c width equals 1 and c height equals 1. Inputs: c. Returns: c width equals 1 and c height equals 1.

### tests/screen-melt-overlay159.cjs:5

@function screen-melt-overlay159.callback.12 — Returns service update using 0. Inputs: no explicit arguments; uses enclosing module state. Uses: service update. Returns: service update using 0.

### tests/screen-melt-overlay159.cjs:6

@function screen-melt-overlay159.append.13 — Handles append within screen melt overlay159. Inputs: no explicit arguments; uses enclosing module state.

### tests/screen-melt-overlay159.cjs:6

@function screen-melt-overlay159.capture.14 — Handles capture within screen melt overlay159. Inputs: no explicit arguments; uses enclosing module state. Uses: error.

### tests/screen-melt-overlay159.cjs:6

@function screen-melt-overlay159.callback.15 — Returns broken begin using . Inputs: no explicit arguments; uses enclosing module state. Uses: broken begin. Returns: broken begin using .

### tests/screen-melt159.cjs:1

@function screen-melt159.seed.1 — Handles seed within screen melt159. Inputs: no explicit arguments; uses enclosing module state. Returns: a callback.

### tests/screen-melt159.cjs:1

@function screen-melt159.callback.2 — Returns update multiplied by 17 % 100 divided by 100. Inputs: no explicit arguments; uses enclosing module state. Returns: update multiplied by 17 % 100 divided by 100.

### tests/screen-melt159.cjs:1

@function screen-melt159.callback.3 — Returns v y equals 480. Inputs: v. Returns: v y equals 480.

### tests/screen-melt159.cjs:1

@function screen-melt159.callback.4 — Returns m create using 5000, 480. Inputs: no explicit arguments; uses enclosing module state. Uses: m create. Returns: m create using 5000, 480.

### tests/screen-melt159.cjs:1

@function screen-melt159.callback.5 — Returns m create using 640, 480, a record containing random. Inputs: no explicit arguments; uses enclosing module state. Uses: m create. Returns: m create using 640, 480, a record containing random.

### tests/screen-melt159.cjs:1

@function screen-melt159.random.6 — Returns na n. Inputs: no explicit arguments; uses enclosing module state. Returns: na n.

### tests/screen-melt159.cjs:1

@function screen-melt159.callback.7 — Returns c advance using - 1. Inputs: no explicit arguments; uses enclosing module state. Uses: c advance. Returns: c advance using - 1.

### tests/screen-shake159.cjs:1

@function screen-shake159.callback.1 — Returns assignment. Inputs: x. Updates: painted. Returns: assignment.

### tests/screen-shake159.cjs:3

@function screen-shake159.callback.2 — Provides the callback for frontier screen shake create. Inputs: no explicit arguments; uses enclosing module state.

### tests/screen-shake159.cjs:5

@function screen-shake159.callback.3 — Returns frontier screen shake validate using other capture using . Inputs: no explicit arguments; uses enclosing module state. Uses: frontier screen shake validate; other capture. Returns: frontier screen shake validate using other capture using .

### tests/screen-shake159.cjs:6

@function screen-shake159.callback.4 — Returns shake start using 0, 5, 60. Inputs: no explicit arguments; uses enclosing module state. Uses: shake start. Returns: shake start using 0, 5, 60.

### tests/screen-shake159.cjs:6

@function screen-shake159.callback.5 — Returns shake restore using a record containing copied fields, offset. Inputs: no explicit arguments; uses enclosing module state. Uses: shake restore. Returns: shake restore using a record containing copied fields, offset.

### tests/screen-shake159.cjs:6

@function screen-shake159.callback.6 — Returns shake restore using a record containing copied fields, fraction. Inputs: no explicit arguments; uses enclosing module state. Uses: shake restore. Returns: shake restore using a record containing copied fields, fraction.

### tests/screen-shake159.cjs:6

@function screen-shake159.callback.7 — Returns shake update using - 1. Inputs: no explicit arguments; uses enclosing module state. Uses: shake update. Returns: shake update using - 1.

### tests/screen-shake159.cjs:7

@function screen-shake159.log.8 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/screen-shake159.cjs:7

@function screen-shake159.message.9 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/screen-shake159.cjs:7

@function screen-shake159.canStand.10 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/screen-shake159.cjs:7

@function screen-shake159.screenShake.11 — Returns calls push using p. Inputs: rest element. Uses: calls push. Returns: calls push using p.

### tests/screen-tone159.cjs:1

@function screen-tone159.callback.1 — Returns assignment. Inputs: v. Updates: painted. Returns: assignment.

### tests/screen-tone159.cjs:1

@function screen-tone159.callback.2 — Returns assignment. Inputs: v. Updates: painted. Returns: assignment.

### tests/screen-tone159.cjs:1

@function screen-tone159.callback.3 — Returns other start using a list of 0, 0, 0, - 1, 60. Inputs: no explicit arguments; uses enclosing module state. Uses: other start. Returns: other start using a list of 0, 0, 0, - 1, 60.

### tests/screen-tone159.cjs:1

@function screen-tone159.callback.4 — Returns other restore using a record containing copied fields, duration. Inputs: no explicit arguments; uses enclosing module state. Uses: other restore. Returns: other restore using a record containing copied fields, duration.

### tests/screen-tone159.cjs:2

@function screen-tone159.log.5 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/screen-tone159.cjs:2

@function screen-tone159.message.6 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/screen-tone159.cjs:2

@function screen-tone159.canStand.7 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/screen-tone159.cjs:2

@function screen-tone159.screenTone.8 — Returns calls push using p. Inputs: rest element. Uses: calls push. Returns: calls push using p.

### tests/sky122.cjs:1

@function sky122.save.1 — Handles save within sky122. Inputs: no explicit arguments; uses enclosing module state. Updates: depth.

### tests/sky122.cjs:1

@function sky122.restore.2 — Applies saved state to this system. Inputs: no explicit arguments; uses enclosing module state. Updates: this fog depth.

### tests/sky122.cjs:1

@function sky122.beginPath.3 — Handles begin path within sky122. Inputs: no explicit arguments; uses enclosing module state.

### tests/sky122.cjs:1

@function sky122.moveTo.4 — Handles move to within sky122. Inputs: no explicit arguments; uses enclosing module state.

### tests/sky122.cjs:1

@function sky122.lineTo.5 — Handles line to within sky122. Inputs: no explicit arguments; uses enclosing module state.

### tests/sky122.cjs:1

@function sky122.bezierCurveTo.6 — Handles bezier curve to within sky122. Inputs: no explicit arguments; uses enclosing module state.

### tests/sky122.cjs:1

@function sky122.closePath.7 — Handles close path within sky122. Inputs: no explicit arguments; uses enclosing module state.

### tests/sky122.cjs:1

@function sky122.stroke.8 — Handles stroke within sky122. Inputs: no explicit arguments; uses enclosing module state. Uses: assert equal.

### tests/sky122.cjs:1

@function sky122.callback.9 — Returns a record containing x, y, depth, scale. Inputs: c; x; y; z. Returns: a record containing x, y, depth, scale.

### tests/spatial-conditions159.cjs:1

@function spatial-conditions159.log.1 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/spatial-conditions159.cjs:1

@function spatial-conditions159.message.2 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/spatial-conditions159.cjs:1

@function spatial-conditions159.canStand.3 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/sprite-lighting159.cjs:1

@function sprite-lighting159.callback.1 — Returns l validate using a record containing x, y, z. Inputs: no explicit arguments; uses enclosing module state. Uses: l validate. Returns: l validate using a record containing x, y, z.

### tests/sprite-lighting159.cjs:1

@function sprite-lighting159.callback.2 — Returns l prepare using a, a record containing copied fields, width. Inputs: no explicit arguments; uses enclosing module state. Uses: l prepare. Returns: l prepare using a, a record containing copied fields, width.

### tests/sprite-lighting159.cjs:1

@function sprite-lighting159.callback.3 — Returns l validate using a record containing ambient. Inputs: no explicit arguments; uses enclosing module state. Uses: l validate. Returns: l validate using a record containing ambient.

### tests/sprite-projection1518.cjs:5

@function sprite-projection1518.sheet — Inputs: entity ignored. Returns deterministic loaded frame with a twenty-pixel ground inset; no effects.

### tests/sprite-projection1518.cjs:6

@function sprite-projection1518.direction — Inputs: entity/camera ignored. Returns the single fixture frame; no effects.

### tests/sprite-projection1518.cjs:12

@function sprite-projection1518.clip — Inputs: region record. Stores current visibility mask for draw assertions; no rendering effects.

### tests/sprite-projection1518.cjs:12

@function sprite-projection1518.draw — Inputs: standard canvas image/source/destination coordinates. Retains draw arguments and mask; no effects outside fixture.

### tests/sprite-projection1518.cjs:18

@function sprite-projection1518.hidden — Inputs: retained draw. Returns whether nearer wall removed every visible region; no effects.

### tests/template-history159.cjs:3

@function template-history159.callback.1 — Returns history undo using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: history undo. Returns: history undo using a callback.

### tests/template-history159.cjs:3

@function template-history159.callback.2 — Provides the callback for history undo. Inputs: no explicit arguments; uses enclosing module state. Uses: error.

### tests/template-history159.cjs:3

@function template-history159.callback.3 — Returns assignment. Inputs: e. Updates: entry. Returns: assignment.

### tests/template-history159.cjs:3

@function template-history159.callback.4 — Returns assert equal using e id, "c". Inputs: e. Uses: assert equal. Returns: assert equal using e id, "c".

### tests/template-history159.cjs:4

@function template-history159.callback.5 — Provides the callback for history undo. Inputs: no explicit arguments; uses enclosing module state.

### tests/template-history159.cjs:5

@function template-history159.callback.6 — Returns h create using a record containing maxBytes. Inputs: no explicit arguments; uses enclosing module state. Uses: h create. Returns: h create using a record containing maxBytes.

### tests/terrain-occlusion157.cjs:2

@function terrain-occlusion157.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: chromium launch; b new page; p on; p goto.

### tests/terrain-occlusion157.cjs:2

@function terrain-occlusion157.callback.2 — Returns errors push using e message. Inputs: e. Uses: errors push. Returns: errors push using e message.

### tests/terrain-occlusion157.cjs:2

@function terrain-occlusion157.callback.3 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: frontier render draw; window masks; frontier terrain occlusion mask.

### tests/terrain-occlusion157.cjs:2

@function terrain-occlusion157.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: c; g. Updates: window g. Uses: draw. Returns: draw using c, g.

### tests/terrain-occlusion157.cjs:2

@function terrain-occlusion157.mask.5 — Builds visible screen regions by comparing sprite depth with the existing geometry depth buffer. Inputs: d; r; z. Uses: mask; masks set. Returns: value.

### tests/terrain-occlusion157.cjs:2

@function terrain-occlusion157.callback.6 — Returns window g. Inputs: no explicit arguments; uses enclosing module state. Returns: window g.

### tests/terrain-occlusion157.cjs:2

@function terrain-occlusion157.callback.7 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: object assign; frontier terrain height; masks clear.

### tests/terrain-occlusion157.cjs:3

@function terrain-occlusion157.callback.8 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier pixi context; document get element by id; frontier render camera; g maps frontier entities find. Returns: a record containing camera, tree, root, rootVisible, upperVisible, regions, depthBuffer, treeCount.

### tests/terrain-occlusion157.cjs:3

@function terrain-occlusion157.callback.9 — Returns e id equals "forest-tree-11". Inputs: e. Returns: e id equals "forest-tree-11".

### tests/terrain-occlusion157.cjs:3

@function terrain-occlusion157.contains.10 — Returns clip regions some using a callback. Inputs: x; y. Uses: clip regions some. Returns: clip regions some using a callback.

### tests/terrain-occlusion157.cjs:3

@function terrain-occlusion157.callback.11 — Returns x is at least r x and x is less than r x plus r width and y is at least r y and y is less than r y plus r height. Inputs: r. Returns: x is at least r x and x is less than r x plus r width and y is at least r y and y is less than r y plus r height.

### tests/terrain-occlusion157.cjs:4

@function terrain-occlusion157.callback.12 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Uses: performance now; times sort. Returns: a record containing medianFrameMs, p95FrameMs.

### tests/terrain-occlusion157.cjs:4

@function terrain-occlusion157.callback.13 — Returns request animation frame using a callback. Inputs: r. Uses: request animation frame. Returns: request animation frame using a callback.

### tests/terrain-occlusion157.cjs:4

@function terrain-occlusion157.callback.14 — Provides the callback for request animation frame. Inputs: t. Updates: previous. Uses: times push; r.

### tests/terrain-occlusion157.cjs:4

@function terrain-occlusion157.callback.15 — Returns a minus b. Inputs: a; b. Returns: a minus b.

### tests/terrain-occlusion157.cjs:4

@function terrain-occlusion157.callback.16 — Provides the callback for p evaluate. Inputs: no explicit arguments; uses enclosing module state. Updates: g camera pitch.

### tests/terrain-occlusion157.cjs:4

@function terrain-occlusion157.callback.17 — Returns frontier pixi context using document get element by id using "view" terrain depth equals null. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier pixi context; document get element by id. Returns: frontier pixi context using document get element by id using "view" terrain depth equals null.

### tests/terrain-occlusion157.cjs:4

@function terrain-occlusion157.callback.18 — Provides the callback for a callback using catch. Inputs: e. Updates: process exit code.

### tests/terrain-water12.cjs:4

@function terrain-water12.callback.1 — Returns v validate using a record containing warp. Inputs: no explicit arguments; uses enclosing module state. Uses: v validate. Returns: v validate using a record containing warp.

### tests/terrain-water12.cjs:4

@function terrain-water12.callback.2 — Returns v validate using a record containing texture. Inputs: no explicit arguments; uses enclosing module state. Uses: v validate. Returns: v validate using a record containing texture.

### tests/terrain-water12.cjs:4

@function terrain-water12.callback.3 — Returns v validate using a record containing cells. Inputs: no explicit arguments; uses enclosing module state. Uses: v validate. Returns: v validate using a record containing cells.

### tests/terrain-water12.cjs:4

@function terrain-water12.callback.4 — Returns t validate using a record containing mode, amplitude, frequency, edits. Inputs: no explicit arguments; uses enclosing module state. Uses: t validate. Returns: t validate using a record containing mode, amplitude, frequency, edits.

### tests/terrain-water12.cjs:4

@function terrain-water12.callback.5 — Returns w validate using a record containing copied fields, water. Inputs: no explicit arguments; uses enclosing module state. Uses: w validate; v validate. Returns: w validate using a record containing copied fields, water.

### tests/terrain-water12.cjs:5

@function terrain-water12.callback.6 — Returns f validate using a record containing min, max. Inputs: no explicit arguments; uses enclosing module state. Uses: f validate. Returns: f validate using a record containing min, max.

### tests/transfer-player159.cjs:5

@function transfer-player159.callback.1 — Returns t resolve using a list of 0, 4, 4, 5, context. Inputs: no explicit arguments; uses enclosing module state. Uses: t resolve. Returns: t resolve using a list of 0, 4, 4, 5, context.

### tests/transfer-player159.cjs:5

@function transfer-player159.callback.2 — Returns t resolve using a list of 0, 9, 20, 5, context. Inputs: no explicit arguments; uses enclosing module state. Uses: t resolve. Returns: t resolve using a list of 0, 9, 20, 5, context.

### tests/transfer-player159.cjs:5

@function transfer-player159.callback.3 — Returns t resolve using a list of 0, 9, 4, 5, a record containing copied fields, canStand. Inputs: no explicit arguments; uses enclosing module state. Uses: t resolve. Returns: t resolve using a list of 0, 9, 4, 5, a record containing copied fields, canStand.

### tests/transfer-player159.cjs:5

@function transfer-player159.canStand.4 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/transfer-player159.cjs:5

@function transfer-player159.callback.5 — Returns t validate using a list of 1, 1, 0, 2. Inputs: no explicit arguments; uses enclosing module state. Uses: t validate. Returns: t validate using a list of 1, 1, 0, 2.

### tests/transfer-player159.cjs:5

@function transfer-player159.callback.6 — Returns t validate using a list of 0, 3, 4, 5. Inputs: no explicit arguments; uses enclosing module state. Uses: t validate. Returns: t validate using a list of 0, 3, 4, 5.

### tests/transfer-player159.cjs:8

@function transfer-player159.message.7 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/transfer-player159.cjs:8

@function transfer-player159.log.8 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/transfer-player159.cjs:8

@function transfer-player159.canStand.9 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/transparency159.cjs:1

@function transparency159.c.1 — Returns a record containing code, parameters. Inputs: code; rest element. Returns: a record containing code, parameters.

### tests/transparency159.cjs:1

@function transparency159.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state.

### tests/transparency159.cjs:1

@function transparency159.bounds.3 — Calculates or applies the enclosing limits for this module’s data. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing width, height.

### tests/transparency159.cjs:1

@function transparency159.canStand.4 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true.

### tests/transparency159.cjs:1

@function transparency159.callback.5 — Returns frontier mzroutes validate using a record containing copied fields, list. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier mzroutes validate; c. Returns: frontier mzroutes validate using a record containing copied fields, list.

### tests/transparency159.cjs:2

@function transparency159.message.6 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false.

### tests/vector112.cjs:1

@function vector112.callback.1 — Returns v validate using a record containing radius. Inputs: no explicit arguments; uses enclosing module state. Uses: v validate. Returns: v validate using a record containing radius.

### tests/vector112.cjs:1

@function vector112.callback.2 — Returns v validate using a record containing breaks. Inputs: no explicit arguments; uses enclosing module state. Uses: v validate. Returns: v validate using a record containing breaks.

### tests/vector112.cjs:1

@function vector112.callback.3 — Returns c at 0 equals "moveTo" and c at 1 is greater than 0. Inputs: c. Returns: c at 0 equals "moveTo" and c at 1 is greater than 0.

### tests/water14.cjs:4

@function water14.callback.1 — Returns p at 0 is at most 0.500001. Inputs: p. Returns: p at 0 is at most 0.500001.

### tests/water14.cjs:4

@function water14.callback.2 — Returns math abs using p at 0 minus 0.5 is less than 0.00001. Inputs: p. Returns: math abs using p at 0 minus 0.5 is less than 0.00001.

### tests/water14.cjs:7

@function water14.callback.3 — Returns v validate using a record containing underwaterStrength. Inputs: no explicit arguments; uses enclosing module state. Uses: v validate. Returns: v validate using a record containing underwaterStrength.

### tests/water14.cjs:7

@function water14.callback.4 — Returns v validate using a record containing underwaterFrequency. Inputs: no explicit arguments; uses enclosing module state. Uses: v validate. Returns: v validate using a record containing underwaterFrequency.

### tests/water14.cjs:7

@function water14.callback.5 — Returns v validate using a record containing underwaterEnabled. Inputs: no explicit arguments; uses enclosing module state. Uses: v validate. Returns: v validate using a record containing underwaterEnabled.

### tests/water141.cjs:3

@function water141.callback.1 — Returns p at 0 is less than 6. Inputs: p. Returns: p at 0 is less than 6.

### tests/water141.cjs:4

@function water141.callback.2 — Returns p at 1 is at least 0.13 minus 1e-8. Inputs: p. Returns: p at 1 is at least 0.13 minus 1e-8.

### desktop.cjs:22

@function desktop.callback.1 — Returns object from entries using a list of "exploration", "combat" map using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: object from entries; a list of "exploration", "combat" map. Returns: object from entries using a list of "exploration", "combat" map using a callback.

### desktop.cjs:22

@function desktop.callback.2 — Provides the callback for a list of "exploration", "combat" map. Inputs: category. Updates: names. Uses: path join; fs readdir sync using folder, a record containing withFileTypes filter using a callback map using a callback sort using slice; fs readdir sync using folder, a record containing withFileTypes filter using a callback map using a callback sort; fs readdir sync using folder, a record containing withFileTypes filter using a callback map. Returns: a list of category, names.

### desktop.cjs:24

@function desktop.callback.3 — Returns e is file using and /\.(ogg|mp3|wav|m4a|webm)$/i test using e name and the inverse of e name includes using "..". Inputs: e. Uses: e is file; /\.(ogg|mp3|wav|m4a|webm)$/i test; e name includes. Returns: e is file using and /\.(ogg|mp3|wav|m4a|webm)$/i test using e name and the inverse of e name includes using "..".

### desktop.cjs:24

@function desktop.callback.4 — Returns e name. Inputs: e. Returns: e name.

### desktop.cjs:27

@function desktop.record.5 — Handles record within desktop. Inputs: event; assignment pattern. Uses: path join; fs exists sync; fs stat sync; fs rename sync. Returns: without a result.

### desktop.cjs:36

@function desktop.callback.6 — Provides the callback for app on. Inputs: no explicit arguments; uses enclosing module state. Uses: win is minimized; win restore; win show; win focus.

### desktop.cjs:37

@function desktop.callback.7 — Returns record using "child-process-gone", details. Inputs: ; details. Uses: record. Returns: record using "child-process-gone", details.

### desktop.cjs:38

@function desktop.callback.8 — Provides the callback for app when ready using then. Inputs: no explicit arguments; uses enclosing module state. Updates: win; metrics timer. Uses: record; path join; win set menu; win once.

### desktop.cjs:42

@function desktop.callback.9 — Provides the callback for win once. Inputs: no explicit arguments; uses enclosing module state. Uses: win show; record.

### desktop.cjs:43

@function desktop.callback.10 — Returns a record containing action. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing action.

### desktop.cjs:45

@function desktop.callback.11 — Provides the callback for win web contents on. Inputs: event; url. Uses: require using "node:url" path to file url; require; event prevent default.

### desktop.cjs:46

@function desktop.callback.12 — Returns record using "renderer-gone", details. Inputs: ; details. Uses: record. Returns: record using "renderer-gone", details.

### desktop.cjs:47

@function desktop.callback.13 — Provides the callback for win web contents on. Inputs: event; input. Uses: win set full screen; win is full screen; event prevent default.

### desktop.cjs:48

@function desktop.callback.14 — Provides the callback for win on. Inputs: no explicit arguments; uses enclosing module state. Updates: win.

### desktop.cjs:52

@function desktop.callback.15 — Provides the callback for set interval. Inputs: no explicit arguments; uses enclosing module state. Uses: samples push; date now; app get app metrics; samples shift.

### desktop.cjs:54

@function desktop.callback.16 — Provides the callback for app when ready using then using a callback catch. Inputs: error. Uses: record; app quit.

### desktop.cjs:55

@function desktop.callback.17 — Returns app quit using . Inputs: no explicit arguments; uses enclosing module state. Uses: app quit. Returns: app quit using .

### desktop.cjs:56

@function desktop.callback.18 — Provides the callback for app on. Inputs: no explicit arguments; uses enclosing module state. Uses: clear interval; record.

### desktop-preload.cjs:3

@function desktop-preload.musicCatalog.1 — Returns ipc renderer invoke using "frontier:music-catalog". Inputs: no explicit arguments; uses enclosing module state. Uses: ipc renderer invoke. Returns: ipc renderer invoke using "frontier:music-catalog".

### serve.cjs:7

@function serve.callback.1 — Provides the callback for http create server. Inputs: req; res. Uses: path resolve; decode uricomponent; req url split; p starts with. Returns: without a result.

### serve.cjs:15

@function serve.callback.2 — Provides the callback for fs read file. Inputs: e; data. Uses: res write head; res end; res set header; path extname. Returns: without a result.

### serve.cjs:31

@function serve.callback.3 — Returns console log using "Sprite Frontier: http://127.0.0.1:8765". Inputs: no explicit arguments; uses enclosing module state. Returns: console log using "Sprite Frontier: http://127.0.0.1:8765".
