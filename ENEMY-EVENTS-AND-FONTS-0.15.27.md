# Enemy events and fonts — 0.15.27

October 22, 2026. This dated record supersedes older standalone-monster and shared decorative-editor-font behavior. Earlier releases, comments and explanations remain historical references.

## Author enemies

Choose **Enemy Events** on the top toolbar. Select an arsenal archetype, name, sprite, HP, damage per projectile, accuracy/spread in degrees, ammo, movement speed, detection range, aggression and blood. Set X/Y in world metres, number (1–100) and spacing, then **Place enemies**. Each batch is one validated Undo transaction; rejected bounds/spawn-clearance edits roll back together. The window remains open for another batch. **Edit placed enemy** changes an instance without replacing its other event pages/commands.

Presets cover Pistol, Shotgun, Double shotgun, Needle Gun, Heavy Machine Gun, Grenade launcher, Rocket Launcher and Beam Weapon. They share the actual finite-projectile arsenal, impacts and damage. Ammo is a per-enemy whole-round pool; -1 explicitly means unlimited. Double shotgun/Heavy Machine Gun retain last-round weaker discharges. Empty enemies do not shoot or play firing audio. Damage is per projectile; splash retains its authored weapon parameters. Attack on sight uses detection range; retaliate requires provocation. Speed 0 makes ordinary pursuit stationary. Existing behavior-owned patrol/route pages retain their own locomotion/acquisition: use Events to edit those routes, rather than treating simple pursuit fields as a replacement route editor.

**Save reusable archetype** uses the existing map prefab library. Same-name saves replace that type deliberately; placed instances do not silently update. Types remain map-scoped. Existing event/template tools remain available for full event authoring and copying.

## Sprite and muzzle workflow

Choose `enemy-chiban` (Chiban VK) or `enemy-turk` (Mechanical Turk), or another registered profile. Both user-supplied PNGs are preserved byte-for-byte under img/characters. Their full four-row sheets remain intact; initial metadata selects the front row with three animation frames. No directional artwork is fabricated. Locked 0.15.17 camera-facing sprite tilt/proportions remain unchanged.

**Muzzle / Aim** opens the existing calibration editor. Select the sprite profile to edit projectile/flash points per frame; the supplied initial points are editable starting calibrations. Import additional sheets through that existing tool, then reopen Enemy Events to select them. Future directional metadata uses the same schema. Weapon and sprite choices are independent; selecting another weapon does not fabricate a new weapon pose. Enemy aiming now uses the actual opponent torso at the real world distance, replacing the old 60-metre-height approximation for these actors while retaining spread and shared collision.

Blood options are Red, Cream / synth and None. Cream and synth are aliases for ONE blood type. Existing particles, stains and overdamage sprite fragments use the victim identity. Sprite selection does not guess a blood type.

## Respawn and persistence

Remain dead preserves defeat across real transfers and save/load. Re-enter cell restores spawn/HP/initial ammo after an actual transfer to another cell and back; loading a save or same-cell teleport does not count. Delay counts active-cell simulation seconds only: menus, editing and inactive cells pause it. Remaining seconds and ammo survive saves/travel. Respawn reuses the actor/event ID, never appends another enemy.

Combat snapshots self-switches before a lethal impact. Respawn restores only the flags changed by that death, preserving preexisting event/quest flags. Arbitrary custom event-command side effects remain authored behavior; respawn is not a general rollback of inventory or quests. Editor mode changes/fresh playtests and authoring map switches still reset temporary playtest state by the established policy.

## Fonts

Authoring chrome, dialogs and Muzzle / Aim use readable system/Arial faces. Decorative fonts are limited to gameplay. **Text Fonts → Default in-game text font** offers Checkbook and Arial Rounded Bold. Apply uses the existing project-settings transaction and starts a fresh playtest. The choice persists as gameplayDefaults.extensions.gameFont.

The ordinary Event editor adds **Event text font**: inherit project, Checkbook or Arial Rounded Bold. Apply event properties to save the override as event.extensions.textFont. It affects that event's dialogue, choices and description text, including native Show Text. Closing clears the override so it cannot leak into another event. GPU text/Canvas labels follow the project face; editor canvas labels stay readable. Event overrides affect event text, rather than replacing the entire HUD font.

The user-provided Arial Rounded TTF and ZIP copyright notice are preserved in fonts/arialroundedmtbold.ttf and fonts/ARIAL-ROUNDED-COPYRIGHT.txt. The notice identifies Monotype Typography Ltd., 1993; it is retained as supplied, not relabeled as open source or a new license grant. Existing Checkbook/vendor notices remain. No Quake assets or copied implementation source are introduced.

## Architecture audit

Validation migrates world.objects monsters into actual events by stable ID, retaining position, sprite/dimensions and original object metadata as history in the extension. Existing combat events gain metadata while retaining tags/pages. Party companions are excluded; repeated migration does not duplicate enemies. Other objects remain scenery.

src/enemies.js owns migration, configurations, arsenal selection, ammo and respawn. src/enemy-workbench.js owns private UI drafts committed through existing application validation/Undo. Actual projection remains in app.preview; attacks/damage/collision remain in PhanicomABS and ballistics. Compact enemyState data joins existing per-cell journey snapshots; actor HP/position/death stay in existing actor records. Old saves without enemyState initialize from restored actors. Save validation bounds IDs, ammo, delay and death-switch records before adoption.

src/fonts.js owns the closed two-font registry and draft controls. Existing project extensions/event annotations persist choices. The existing interpreter publisher carries the event override to native/legacy messages; imported font keys cannot supply arbitrary CSS or URLs.

## Verification and limits

Production-browser checks cover stable event migration, batch placement/types/instance overrides, supplied single-view profiles, all eight weapons in first/third/isometric/fixed camera contexts, calibrated muzzle origins, zero-spread torso convergence, grenade fuse, finite ammo, actual lethal damage, real playtest export/import, event-command travel, permanent/reentry/delayed respawns and prior self-switch preservation. Font checks load the actual TTF, use project settings, validate inheritance/overrides for native/legacy messages, reject unknown keys and inspect real GPU text style. Companion regression covers recruitment, combat, defeat, save/load and actual cell travel with original behavior homes.

Focused event, projectile, item, weapon, blood and locked-sprite regressions and maintained-function comment coverage are required. Coverage proves comments exist; it does not claim a new manual audit of every inherited function. Tests use isolated browser profiles. This is not a complete manual playthrough of every custom map, macOS host acceptance or high/smooth performance certification; the user retains high/smooth checks. Complete Windows and Mac/browser packages share source, and previous .26 packages remain unchanged.

The separate room-editor redesign remains banked for consultation. Earlier source-history/performance archives remain in previous release/source folders, as documented in .26; they are not deleted or duplicated here.
