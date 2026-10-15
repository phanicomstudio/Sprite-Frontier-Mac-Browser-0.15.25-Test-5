/*:
 * @target MZ
 * @plugindesc v0.9.0 Save-safe player deaths, gib/death-image options, weapon frag feed and BloodSystem integration. A Phanicom Cohos Cooperation.
 * @version 0.9.0
 * @author Phanicom
 *
 * @command OpenMuzzleCalibrator
 * @text Open Muzzle Calibrator
 * @desc Playtest-only visual muzzle editor for 3-column x 8-row @8D_ character sheets. Uses the current player sheet when Character Sheet is blank.
 *
 * @arg CharacterSheet
 * @text Character Sheet
 * @type file
 * @dir img/characters/
 * @default
 * @desc Optional sheet to calibrate. Leave blank to use the player's current character sheet.
 *
 * @arg StartProfile
 * @text Starting Weapon Profile
 * @type string
 * @default
 * @desc Optional profile ID such as handgun or shotgun. Blank starts on the equipped weapon profile or the first profile.
 *
 * @param AttackKey
 * @text Attack Keyboard Key
 * @type string
 * @default F
 * @desc Keyboard key used to attack. Examples: F, X, Q, SPACE, SHIFT.
 *
 * @param AttackKeyCode
 * @text Legacy Attack KeyCode
 * @type number
 * @min 0
 * @max 255
 * @default 70
 * @desc Legacy fallback. Used only if Attack Keyboard Key cannot be resolved.
 *
 * @param AttackGamepadButton
 * @text Attack Gamepad Button
 * @type number
 * @min -1
 * @max 31
 * @default 5
 * @desc Gamepad button index mapped to ABS attack. 5 is commonly RB/R1. -1 disables.
 *
 * @param DefaultEmptySound
 * @text Default Empty / Dry-Fire SE
 * @type file
 * @dir audio/se/
 * @default Out of ammo
 * @desc SE played when an Item-based ABS weapon attempts to fire without enough ammo. Filename only; do not include .ogg.
 *
 * @param DryFireCooldown
 * @text Dry-Fire Cooldown
 * @type number
 * @min 1
 * @max 120
 * @default 10
 * @desc Frames before another empty click can play while the trigger remains held.
 *
 * @param WeaponProfiles
 * @text Weapon Type Profiles
 * @type struct<WeaponProfile>[]
 * @default ["{\"ProfileId\":\"oozi_biotech\",\"DisplayName\":\"Oozi-BioTech DNA Scrambler\",\"Family\":\"beam\",\"RuntimeType\":\"projectile\",\"FireMode\":\"semi\",\"AudioProfile\":\"none\",\"DefaultSE\":\"Laser1\",\"TracerColor\":\"#00ff00\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-165\",\"Muzzle4X\":\"-95\",\"Muzzle4Y\":\"-160\",\"Muzzle6X\":\"95\",\"Muzzle6Y\":\"-160\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-180\",\"Muzzle1X\":\"-70\",\"Muzzle1Y\":\"-160\",\"Muzzle3X\":\"70\",\"Muzzle3Y\":\"-160\",\"Muzzle9X\":\"70\",\"Muzzle9Y\":\"-175\",\"Muzzle7X\":\"-70\",\"Muzzle7Y\":\"-175\"}","{\"ProfileId\":\"needle_gun\",\"DisplayName\":\"Needle Gun\",\"Family\":\"projectile\",\"RuntimeType\":\"projectile\",\"FireMode\":\"semi\",\"AudioProfile\":\"standard\",\"DefaultSE\":\"\",\"TracerColor\":\"#ffcf70\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-165\",\"Muzzle4X\":\"-95\",\"Muzzle4Y\":\"-160\",\"Muzzle6X\":\"95\",\"Muzzle6Y\":\"-160\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-180\",\"Muzzle1X\":\"-70\",\"Muzzle1Y\":\"-160\",\"Muzzle3X\":\"70\",\"Muzzle3Y\":\"-160\",\"Muzzle9X\":\"70\",\"Muzzle9Y\":\"-175\",\"Muzzle7X\":\"-70\",\"Muzzle7Y\":\"-175\"}","{\"ProfileId\":\"plasma_gun\",\"DisplayName\":\"Plasma Gun\",\"Family\":\"plasma\",\"RuntimeType\":\"projectile\",\"FireMode\":\"semi\",\"AudioProfile\":\"plasma\",\"DefaultSE\":\"\",\"TracerColor\":\"#75e6ff\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-165\",\"Muzzle4X\":\"-95\",\"Muzzle4Y\":\"-160\",\"Muzzle6X\":\"95\",\"Muzzle6Y\":\"-160\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-180\",\"Muzzle1X\":\"-70\",\"Muzzle1Y\":\"-160\",\"Muzzle3X\":\"70\",\"Muzzle3Y\":\"-160\",\"Muzzle9X\":\"70\",\"Muzzle9Y\":\"-175\",\"Muzzle7X\":\"-70\",\"Muzzle7Y\":\"-175\"}","{\"ProfileId\":\"burst_machine_gun\",\"DisplayName\":\"Burst Machine Gun\",\"Family\":\"firearm\",\"RuntimeType\":\"projectile\",\"FireMode\":\"burst\",\"AudioProfile\":\"standard\",\"DefaultSE\":\"\",\"TracerColor\":\"#ffcf70\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-165\",\"Muzzle4X\":\"-95\",\"Muzzle4Y\":\"-160\",\"Muzzle6X\":\"95\",\"Muzzle6Y\":\"-160\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-180\",\"Muzzle1X\":\"-70\",\"Muzzle1Y\":\"-160\",\"Muzzle3X\":\"70\",\"Muzzle3Y\":\"-160\",\"Muzzle9X\":\"70\",\"Muzzle9Y\":\"-175\",\"Muzzle7X\":\"-70\",\"Muzzle7Y\":\"-175\"}","{\"ProfileId\":\"heavy_machine_gun\",\"DisplayName\":\"Heavy Machine Gun\",\"Family\":\"firearm\",\"RuntimeType\":\"projectile\",\"FireMode\":\"auto\",\"AudioProfile\":\"large\",\"DefaultSE\":\"\",\"TracerColor\":\"#ffcf70\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-165\",\"Muzzle4X\":\"-95\",\"Muzzle4Y\":\"-160\",\"Muzzle6X\":\"95\",\"Muzzle6Y\":\"-160\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-180\",\"Muzzle1X\":\"-70\",\"Muzzle1Y\":\"-160\",\"Muzzle3X\":\"70\",\"Muzzle3Y\":\"-160\",\"Muzzle9X\":\"70\",\"Muzzle9Y\":\"-175\",\"Muzzle7X\":\"-70\",\"Muzzle7Y\":\"-175\"}","{\"ProfileId\":\"handgun\",\"DisplayName\":\"Handgun\",\"Family\":\"firearm\",\"RuntimeType\":\"projectile\",\"FireMode\":\"semi\",\"AudioProfile\":\"standard\",\"DefaultSE\":\"\",\"TracerColor\":\"#ffcf70\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-165\",\"Muzzle4X\":\"-95\",\"Muzzle4Y\":\"-160\",\"Muzzle6X\":\"95\",\"Muzzle6Y\":\"-160\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-180\",\"Muzzle1X\":\"-70\",\"Muzzle1Y\":\"-160\",\"Muzzle3X\":\"70\",\"Muzzle3Y\":\"-160\",\"Muzzle9X\":\"70\",\"Muzzle9Y\":\"-175\",\"Muzzle7X\":\"-70\",\"Muzzle7Y\":\"-175\"}","{\"ProfileId\":\"rocket_launcher\",\"DisplayName\":\"Rocket Launcher\",\"Family\":\"rocket\",\"RuntimeType\":\"projectile\",\"FireMode\":\"semi\",\"AudioProfile\":\"large\",\"DefaultSE\":\"\",\"TracerColor\":\"#ff9b66\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-165\",\"Muzzle4X\":\"-95\",\"Muzzle4Y\":\"-160\",\"Muzzle6X\":\"95\",\"Muzzle6Y\":\"-160\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-180\",\"Muzzle1X\":\"-70\",\"Muzzle1Y\":\"-160\",\"Muzzle3X\":\"70\",\"Muzzle3Y\":\"-160\",\"Muzzle9X\":\"70\",\"Muzzle9Y\":\"-175\",\"Muzzle7X\":\"-70\",\"Muzzle7Y\":\"-175\"}","{\"ProfileId\":\"grenade\",\"DisplayName\":\"Grenade\",\"Family\":\"thrown\",\"RuntimeType\":\"projectile\",\"FireMode\":\"semi\",\"AudioProfile\":\"none\",\"DefaultSE\":\"\",\"TracerColor\":\"#ffcf70\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-145\",\"Muzzle4X\":\"-55\",\"Muzzle4Y\":\"-150\",\"Muzzle6X\":\"55\",\"Muzzle6Y\":\"-150\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-165\",\"Muzzle1X\":\"-45\",\"Muzzle1Y\":\"-145\",\"Muzzle3X\":\"45\",\"Muzzle3Y\":\"-145\",\"Muzzle9X\":\"45\",\"Muzzle9Y\":\"-160\",\"Muzzle7X\":\"-45\",\"Muzzle7Y\":\"-160\"}","{\"ProfileId\":\"beam_weapon\",\"DisplayName\":\"Beam Weapon\",\"Family\":\"beam\",\"RuntimeType\":\"projectile\",\"FireMode\":\"semi\",\"AudioProfile\":\"none\",\"DefaultSE\":\"Laser2\",\"TracerColor\":\"#ff00ff\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-165\",\"Muzzle4X\":\"-95\",\"Muzzle4Y\":\"-160\",\"Muzzle6X\":\"95\",\"Muzzle6Y\":\"-160\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-180\",\"Muzzle1X\":\"-70\",\"Muzzle1Y\":\"-160\",\"Muzzle3X\":\"70\",\"Muzzle3Y\":\"-160\",\"Muzzle9X\":\"70\",\"Muzzle9Y\":\"-175\",\"Muzzle7X\":\"-70\",\"Muzzle7Y\":\"-175\"}","{\"ProfileId\":\"gyro_jet_weapon\",\"DisplayName\":\"Gyro Jet Weapon\",\"Family\":\"gyro\",\"RuntimeType\":\"projectile\",\"FireMode\":\"semi\",\"AudioProfile\":\"grape\",\"DefaultSE\":\"\",\"TracerColor\":\"#ffd28a\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-165\",\"Muzzle4X\":\"-95\",\"Muzzle4Y\":\"-160\",\"Muzzle6X\":\"95\",\"Muzzle6Y\":\"-160\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-180\",\"Muzzle1X\":\"-70\",\"Muzzle1Y\":\"-160\",\"Muzzle3X\":\"70\",\"Muzzle3Y\":\"-160\",\"Muzzle9X\":\"70\",\"Muzzle9Y\":\"-175\",\"Muzzle7X\":\"-70\",\"Muzzle7Y\":\"-175\"}","{\"ProfileId\":\"shotgun\",\"DisplayName\":\"Shotgun\",\"Family\":\"firearm\",\"RuntimeType\":\"shotgun\",\"FireMode\":\"semi\",\"AudioProfile\":\"shotgun\",\"DefaultSE\":\"\",\"TracerColor\":\"#ffd28a\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-165\",\"Muzzle4X\":\"-95\",\"Muzzle4Y\":\"-160\",\"Muzzle6X\":\"95\",\"Muzzle6Y\":\"-160\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-180\",\"Muzzle1X\":\"-70\",\"Muzzle1Y\":\"-160\",\"Muzzle3X\":\"70\",\"Muzzle3Y\":\"-160\",\"Muzzle9X\":\"70\",\"Muzzle9Y\":\"-175\",\"Muzzle7X\":\"-70\",\"Muzzle7Y\":\"-175\"}","{\"ProfileId\":\"satchel_charge\",\"DisplayName\":\"Satchel Charge\",\"Family\":\"thrown\",\"RuntimeType\":\"projectile\",\"FireMode\":\"semi\",\"AudioProfile\":\"none\",\"DefaultSE\":\"\",\"TracerColor\":\"#ffcf70\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-145\",\"Muzzle4X\":\"-55\",\"Muzzle4Y\":\"-150\",\"Muzzle6X\":\"55\",\"Muzzle6Y\":\"-150\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-165\",\"Muzzle1X\":\"-45\",\"Muzzle1Y\":\"-145\",\"Muzzle3X\":\"45\",\"Muzzle3Y\":\"-145\",\"Muzzle9X\":\"45\",\"Muzzle9Y\":\"-160\",\"Muzzle7X\":\"-45\",\"Muzzle7Y\":\"-160\"}","{\"ProfileId\":\"cluster_bomb\",\"DisplayName\":\"Cluster Bomb\",\"Family\":\"thrown\",\"RuntimeType\":\"projectile\",\"FireMode\":\"semi\",\"AudioProfile\":\"none\",\"DefaultSE\":\"\",\"TracerColor\":\"#ffcf70\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-145\",\"Muzzle4X\":\"-55\",\"Muzzle4Y\":\"-150\",\"Muzzle6X\":\"55\",\"Muzzle6Y\":\"-150\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-165\",\"Muzzle1X\":\"-45\",\"Muzzle1Y\":\"-145\",\"Muzzle3X\":\"45\",\"Muzzle3Y\":\"-145\",\"Muzzle9X\":\"45\",\"Muzzle9Y\":\"-160\",\"Muzzle7X\":\"-45\",\"Muzzle7Y\":\"-160\"}","{\"ProfileId\":\"sniper_rifle\",\"DisplayName\":\"Sniper Rifle\",\"Family\":\"firearm\",\"RuntimeType\":\"projectile\",\"FireMode\":\"semi\",\"AudioProfile\":\"large\",\"DefaultSE\":\"\",\"TracerColor\":\"#ffcf70\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-165\",\"Muzzle4X\":\"-95\",\"Muzzle4Y\":\"-160\",\"Muzzle6X\":\"95\",\"Muzzle6Y\":\"-160\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-180\",\"Muzzle1X\":\"-70\",\"Muzzle1Y\":\"-160\",\"Muzzle3X\":\"70\",\"Muzzle3Y\":\"-160\",\"Muzzle9X\":\"70\",\"Muzzle9Y\":\"-175\",\"Muzzle7X\":\"-70\",\"Muzzle7Y\":\"-175\"}","{\"ProfileId\":\"cryo_auged_armament\",\"DisplayName\":\"Cryo Auged Armament\",\"Family\":\"cryo\",\"RuntimeType\":\"projectile\",\"FireMode\":\"semi\",\"AudioProfile\":\"cryo\",\"DefaultSE\":\"\",\"TracerColor\":\"#bdefff\",\"MuzzleForward\":\"0.20\",\"Muzzle2X\":\"0\",\"Muzzle2Y\":\"-165\",\"Muzzle4X\":\"-95\",\"Muzzle4Y\":\"-160\",\"Muzzle6X\":\"95\",\"Muzzle6Y\":\"-160\",\"Muzzle8X\":\"0\",\"Muzzle8Y\":\"-180\",\"Muzzle1X\":\"-70\",\"Muzzle1Y\":\"-160\",\"Muzzle3X\":\"70\",\"Muzzle3Y\":\"-160\",\"Muzzle9X\":\"70\",\"Muzzle9Y\":\"-175\",\"Muzzle7X\":\"-70\",\"Muzzle7Y\":\"-175\"}"]
 * @desc Expandable weapon profile library. Add new entries at any time. Item note tags select one with profile=PROFILE_ID; direct Item-note fields override profile defaults.
 *
 * @param EnemyCombatProfiles
 * @text Enemy Combat Profiles
 * @type struct<EnemyCombatProfile>[]
 * @default []
 * @desc Reusable ABS event combat definitions. Events can use <PhanicomABS: profile=PROFILE_ID> and override individual fields locally.
 *
 * @param ActorWeaponCalibrationProfiles
 * @text Actor Weapon Calibration Profiles
 * @type struct<ActorWeaponCalibrationProfile>[]
 * @default []
 * @desc Preferred v0.8.3 player calibration system: Actor ID + Weapon Profile ID + 8 muzzle positions + 8 Aim Angles in degrees.
 *
 * @param DefaultEnemyHP
 * @text Default Enemy HP
 * @type number
 * @min 1
 * @default 30
 * @desc HP used by <PhanicomABS> events unless hp= is supplied.
 *
 * @param DefaultHitRadius
 * @text Default Enemy Hit Radius
 * @type number
 * @decimals 2
 * @min 0.05
 * @default 0.34
 * @desc Fallback event collision radius if a usable pixel-alpha sprite mask is unavailable.
 *
 * @param CombatantAlphaThreshold
 * @text Combatant Alpha Threshold
 * @type number
 * @min 1
 * @max 255
 * @default 32
 * @desc Sprite alpha at or above this value counts as a projectile hit on <PhanicomABS> events.
 *
 * @param PlayerHitRadius
 * @text Player Hit Radius
 * @type number
 * @decimals 2
 * @min 0.05
 * @default 0.30
 * @desc Radius used when enemy projectiles collide with the player.
 *
 * @param DefaultDeathSelfSwitch
 * @text Legacy Death Self Switch (Unused in v0.5.0)
 * @type select
 * @option A
 * @option B
 * @option C
 * @option D
 * @option None
 * @default A
 * @desc Legacy parameter retained for compatibility. v0.5.0 routes normal deaths to A and successful gib deaths to B.
 *
 * @param CoverAlphaThreshold
 * @text Cover Alpha Threshold
 * @type number
 * @min 1
 * @max 255
 * @default 32
 * @desc Sprite alpha at or above this value blocks projectiles for <PhanicomCover>.
 *
 * @param BloodEffects
 * @text Procedural Blood FX
 * @type boolean
 * @on On
 * @off Off
 * @default true
 * @desc Enables procedural blood droplets and impact splashes for ABS combatants.
 *
 * @param DefaultBloodColor
 * @text Default Blood Color
 * @type string
 * @default #7d0b0c
 * @desc Default enemy blood color. Override per event with blood=#RRGGBB.
 *
 * @param DefaultBloodDroplets
 * @text Default Blood Droplets
 * @type number
 * @min 0
 * @max 64
 * @default 8
 * @desc Approximate procedural droplet count per damaging hit. Override per enemy with bloodAmount=.
 *
 * @param PersistentBlood
 * @text Persistent Ground Blood
 * @type boolean
 * @on On
 * @off Off
 * @default true
 * @desc Leaves small procedural blood stains after impacts.
 *
 * @param MaxBloodDecals
 * @text Maximum Blood Stains
 * @type number
 * @min 0
 * @max 500
 * @default 80
 * @desc Oldest blood stains are removed when this limit is exceeded.
 *
 * @param GibEffects
 * @text Sprite-Derived Body Explosions
 * @type boolean
 * @on On
 * @off Off
 * @default true
 * @desc Enables opt-in sprite-derived body fragmentation on qualifying killing blows.
 *
 * @param DefaultGibThreshold
 * @text Default Gib Damage Threshold
 * @type number
 * @min 0
 * @default 25
 * @desc Minimum killing-blow damage for an enemy with gib=true to body-explode.
 *
 * @param MaxGibFragments
 * @text Maximum Gib Fragments
 * @type number
 * @min 0
 * @max 200
 * @default 48
 * @desc Global cap for live sprite-derived body fragments.
 *
 * @param GibBloodBurst
 * @text Gib Blood Burst Droplets
 * @type number
 * @min 0
 * @max 128
 * @default 18
 * @desc Initial procedural blood droplets emitted when a gib death fractures. Override per enemy with gibBloodBurst=.
 *
 * @param GibBleedChance
 * @text Gib Fragment Bleed Chance
 * @type number
 * @decimals 2
 * @min 0.00
 * @max 1.00
 * @default 0.35
 * @desc Fraction of body fragments that emit short blood trails. Override per enemy with gibBleedChance=.
 *
 * @param GibBleedFrames
 * @text Gib Fragment Bleed Frames
 * @type number
 * @min 0
 * @max 120
 * @default 12
 * @desc Number of initial frames during which selected fragments can bleed. Override per enemy with gibBleedFrames=.
 *
 * @param GoldenEyeAudio
 * @text GoldenEye-Style Procedural Gun Audio
 * @type boolean
 * @on On
 * @off Off
 * @default true
 * @desc Uses integrated filtered synth firearm sounds for ABS projectile/hitscan/shotgun attacks. No old ABS plugin dependency.
 *
 * @param GoldenEyeStandardVolume
 * @text GoldenEye Standard Volume
 * @type number
 * @decimals 2
 * @min 0.10
 * @max 30.00
 * @default 8.00
 * @desc Synth body multiplier. Matches the proven Phanicom GoldenEye audio reference defaults.
 *
 * @param GoldenEyeOutputGain
 * @text GoldenEye Final Output Gain
 * @type number
 * @decimals 2
 * @min 0.10
 * @max 60.00
 * @default 6.00
 * @desc Final gain after filtering/compression. Lower this first if the new gun audio is too loud.
 *
 * @param ShowDebugOverlay
 * @text Debug Overlay
 * @type boolean
 * @on On
 * @off Off
 * @default true
 * @desc Shows live weapon, projectile, enemy, and cover status on the map.
 *
 * @param ShowDebug
 * @text Debug Logging
 * @type boolean
 * @on On
 * @off Off
 * @default true
 * @desc Prints combat diagnostics to the developer console.
 *
 * @param PlayerDeathEnabled
 * @text Enable Player Death Sequence
 * @type boolean
 * @default true
 * @desc Leader death gets a short live-simulation delay before Game Over.
 *
 * @param PlayerDeathMode
 * @text Player Death Presentation
 * @type select
 * @option Normal (keep character)
 * @value normal
 * @option Death Image
 * @value sprite
 * @option Always Gib
 * @value gib
 * @option Damage-Based Gib / Death Image
 * @value damage
 * @default damage
 *
 * @param PlayerDeathDelay
 * @text Death Delay (seconds)
 * @type number
 * @decimals 2
 * @min 0
 * @max 30
 * @default 3
 *
 * @param PlayerGibMetric
 * @text Gib Damage Check
 * @type select
 * @option Killing-Hit Damage
 * @value hit
 * @option Overkill Beyond Remaining HP
 * @value overkill
 * @default hit
 *
 * @param PlayerGibThreshold
 * @text Player Gib Threshold
 * @type number
 * @min 0
 * @default 25
 * @desc Damage must reach this amount in damage-based mode. Uses existing Gib Effects switch/cap.
 *
 * @param PlayerDeathImage
 * @text Player Death Image
 * @type file
 * @dir img/pictures/
 * @default
 * @desc Standalone transparent corpse picture; blank uses fallen current frame. Does not change actor graphics.
 *
 * @param PlayerDeathImageScale
 * @text Death Image Scale
 * @type number
 * @decimals 2
 * @min 0.01
 * @max 10
 * @default 1
 *
 * @param PlayerDeathBloodCount
 * @text Player Death Blood Count
 * @type number
 * @min 0
 * @max 128
 * @default 18
 *
 * @param KillFeedEnabled
 * @text Enable Kill Feed
 * @type boolean
 * @default true
 *
 * @param KillFeedSeconds
 * @text Kill Feed Duration (seconds)
 * @type number
 * @min 1
 * @max 60
 * @default 6
 *
 * @param KillFeedLines
 * @text Kill Feed Maximum Lines
 * @type number
 * @min 1
 * @max 10
 * @default 5
 *
 * @param KillFeedWidth
 * @text Kill Feed Width (pixels)
 * @type number
 * @min 200
 * @max 2000
 * @default 600
 *
 * @param KillFeedMessages
 * @text Default Frag Messages
 * @type string[]
 * @default ["{killer} fragged {victim}","{victim} was taken out by {killer}","{killer} finished {victim} with {weapon}"]
 *
 * @param KillFeedWeaponRules
 * @text Weapon Frag Message Pools
 * @type struct<PhanicomFragRule>[]
 * @default ["{\"WeaponKey\":\"oozi_biotech\",\"Messages\":\"[\\\"{killer} scrambled {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"needle_gun\",\"Messages\":\"[\\\"{killer} perforated {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"plasma_gun\",\"Messages\":\"[\\\"{killer} vaporized {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"burst_machine_gun\",\"Messages\":\"[\\\"{killer} fragged {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"heavy_machine_gun\",\"Messages\":\"[\\\"{killer} fragged {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"handgun\",\"Messages\":\"[\\\"{killer} fragged {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"rocket_launcher\",\"Messages\":\"[\\\"{killer} rocketed {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"grenade\",\"Messages\":\"[\\\"{killer} blew up {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"beam_weapon\",\"Messages\":\"[\\\"{killer} zapped {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"gyro_jet_weapon\",\"Messages\":\"[\\\"{killer} fragged {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"shotgun\",\"Messages\":\"[\\\"{killer} buckshot-blasted {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"satchel_charge\",\"Messages\":\"[\\\"{killer} fragged {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"cluster_bomb\",\"Messages\":\"[\\\"{killer} fragged {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"sniper_rifle\",\"Messages\":\"[\\\"{killer} picked off {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"cryo_auged_armament\",\"Messages\":\"[\\\"{killer} froze {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"melee\",\"Messages\":\"[\\\"{killer} cut down {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}"]
 * @desc Keys: item:ID, weapon profile ID, family, or attack type. First matching priority wins.
 *
 * @command SetPlayerDeathMode
 * @text Set Player Death Mode (Saved)
 * @arg mode
 * @type select
 * @option Default Parameter
 * @value default
 * @option Normal
 * @value normal
 * @option Death Image
 * @value sprite
 * @option Always Gib
 * @value gib
 * @option Damage-Based
 * @value damage
 * @default default
 *
 * @command SetKillFeed
 * @text Set Kill Feed (Saved)
 * @arg enabled
 * @type select
 * @option Default Parameter
 * @value default
 * @option Show
 * @value true
 * @option Hide
 * @value false
 * @default default
 *
 * @help
 * v0.9.0 DEATH, FRAG FEED AND SAVE SAFETY
 * Load Phanicom_ActiveCombat ABOVE Phanicom_BloodSystem; disable the six old
 * blood plugins. Existing <CreamBleed> actor and <PhanicomABS: ...> event
 * tags remain supported. Enemy blood=regular/cream/synth/none/#RRGGBB now
 * resolves through BloodSystem. Cream hit/gib/fracture sprays use enhanced
 * synth particles; regular/custom ground gore keeps its existing physics.
 * none suppresses blood without suppressing body fragments.
 *
 * Enable Player Death Sequence controls leader defeat on the map. During
 * its delay, existing projectiles, enemies and FX continue; player input,
 * menus, encounters and queued transfers stop. Game Over occurs when the
 * countdown ends, even if another party member is alive (ABS uses leader).
 * Revival before timeout cancels it. Disable to restore engine Game Over.
 * Normal keeps the actor graphic. Death Image uses the selected standalone
 * img/pictures image at the death point. Blank uses a fallen current-frame
 * pose. Always Gib uses existing sprite-derived fragments. Damage-Based
 * uses killing-hit damage >=25 by default; below threshold uses Death Image.
 * Both hit damage and overkill checks are constant-time and inexpensive.
 * Global Gib Effects and Max Gib Fragments still apply; blocked gibbing
 * falls back to the death image. No actor graphics are permanently changed.
 * Player Death Blood Count applies to initial death/rupture blood only.
 *
 * KILL FEED: top right, newest at bottom. Tokens: {killer}, {actor} (alias),
 * {victim}, {target} (alias), {weapon}. Names come from actor.name() and the
 * enemy EVENT name. Text is literal; no script evaluation or escape codes.
 * Weapon Frag Message Pools can contain several alternatives per weapon.
 * Lookup order: item:ID, explicit enemy killWeapon, weapon profile ID,
 * family, attack type, Default Frag Messages. Names/weapon credit are
 * captured when firing, so weapon switches do not relabel in-flight kills.
 * Enemy example: <PhanicomABS: hp=60 attack=projectile blood=cream
 * killWeapon=handgun killWeaponName="Handgun">
 * kills via PhanicomABS.damageEvent without shot data credit Environment.
 *
 * SAVE / LOAD: BloodSystem actor overrides and passive hiding remain in
 * Game_System. This plugin does not overwrite them. Death-mode/feed command
 * overrides, pending death countdown, and unexpired feed rows are saved.
 * Plugin Manager settings are project defaults, applied to old/new saves;
 * command Default clears only that saved override. Old saves initialize
 * missing fields lazily. Current-map event HP/dead/cooldown state is already
 * stored on Game_Event and survives saving/loading. Transfers/recreating a
 * map still rebuild enemy HP per the original ABS; self switches persist.
 * Runtime projectiles, fragments, droplets and decals are intentionally
 * transient and clear on every load/new game, INCLUDING same-map loads.
 * A death saved mid-delay resumes its remaining time; its visual is rebuilt
 * from current assets without replaying damage or kill-feed entries.
 * No PIXI objects or live character references are written to Game_System.
 * Test with a backup save; this file replaces Phanicom_ActiveCombat.js.
 *

 * ============================================================================
 * Phanicom_ActiveCombat.js v0.8.4 EXPERIMENTAL
 * A Phanicom Cohos Cooperation.
 * ============================================================================
 *
 * This is a fresh RPG Maker MZ implementation modeled after the physical
 * projectile philosophy of the Phanicom JS Isometric Engine v0.20.x.
 * It does NOT depend on the older SovietBlaze/Infantry ABS stack.
 *
 * CORE RULES
 * ----------
 * - Switch = which Item-based weapon is equipped.
 * - Item note = what that weapon does.
 * - <PhanicomABS> = THIS EVENT is an ABS combatant. No Enemy database ID.
 * - <PhanicomABS> uses THIS EVENT'S CURRENT VISIBLE SPRITE PIXELS as its hurt mask.
 * - <PhanicomCover> = THIS EVENT'S CURRENT VISIBLE SPRITE PIXELS block shots.
 * - Player and enemies use the same projectile simulation and swept collision.
 * - Projectiles are runtime objects, never RPG Maker events.
 *
 * ---------------------------------------------------------------------------
 * WEAPON TYPE PROFILES (v0.6.1)
 * ---------------------------------------------------------------------------
 * Plugin Manager -> Weapon Type Profiles is an expandable array. Fifteen
 * seeded profiles begin with Candy-sized muzzle X/Y values instead of 0,0.
 * current Dark West weapon profiles are seeded by default, but the array has
 * no hard-coded weapon-count ceiling. Add another struct entry for future
 * weapon families/types.
 *
 * Select a profile from an Item note with:
 *   profile=handgun
 *   profile=beam_weapon
 *   profile=oozi_biotech
 *
 * ---------------------------------------------------------------------------
 * CURRENT PROFILE MODEL (v0.8.4)
 * ---------------------------------------------------------------------------
 * Use only these visible Plugin Manager sections:
 *
 *   Weapon Type Profiles
 *     Weapon mechanics: projectile/fire mode/audio/tracer/range/etc.
 *
 *   Actor Weapon Calibration Profiles
 *     One Actor + one Weapon Profile + one sprite sheet calibration:
 *     8 muzzle X/Y points and 8 Aim Angles in degrees.
 *
 *   Enemy Combat Profiles
 *     Enemy combat stats plus enemy muzzle X/Y and Aim Angles.
 *
 * Actor Muzzle Profiles and vector-based Firing Calibration Profiles are legacy
 * systems. They are hidden from Plugin Manager in v0.8.4. Their readers remain
 * in code only for compatibility.
 *
 * ---------------------------------------------------------------------------
 * ACTOR WEAPON CALIBRATION PROFILES (v0.8.3 — PREFERRED)
 * ---------------------------------------------------------------------------
 * Player calibration is now intentionally simple:
 *   Actor ID + Weapon Profile ID + Character Sheet
 *   + 8 muzzle X/Y points
 *   + 8 Aim Angles in DEGREES.
 *
 * Angle convention:
 *   0   = right
 *   90  = down
 *   -90 = up
 *   180 = left
 *
 * The runtime converts degrees to normalized X/Y vectors internally.
 *
 * Enemy Combat Profiles now expose the same per-direction Aim Angle fields.
 * Legacy Firing Calibration Profiles (Aim X/Y vectors) remain readable for
 * backward compatibility but are deprecated for new content.
 *
 * ---------------------------------------------------------------------------
 * FIRING CALIBRATION PROFILES (v0.8.2 — LEGACY COMPATIBILITY)
 * ---------------------------------------------------------------------------
 * A calibration belongs to a specific sprite + weapon combination and stores
 * 8 muzzle points plus 8 authored aim vectors.
 *
 * Player auto-match: Actor ID + Weapon Profile ID.
 * Enemy auto-match: Enemy Combat Profile ID.
 * Explicit override: calibration=CALIBRATION_ID.
 *
 * If no calibration exists, normal mathematical 8-way aim remains the fallback.
 *
 * The external HTML tool supports click-drag:
 *   drag start = muzzle
 *   drag end   = barrel direction / aim vector
 *
 * ---------------------------------------------------------------------------
 * ACTOR / ENEMY PROFILE DATA (v0.8.0)
 * ---------------------------------------------------------------------------
 * Actor Muzzle Profiles are keyed by Actor ID. If the party leader has one,
 * those 8-direction coordinates become the player's normal muzzle geometry.
 * Priority: muzzleOverride= -> Actor Muzzle Profile -> Weapon Profile ->
 * legacy muzzle= -> 0,0.
 *
 * Enemy Combat Profiles are reusable event combat definitions:
 *   <PhanicomABS: profile=raider_shotgun>
 *
 * Local event values still override profile values:
 *   <PhanicomABS: profile=raider_shotgun hp=100 blood=#55aa33>
 *
 * See tools/Phanicom_ABS_ProfileEditor.html for the editor-side visual click
 * tool. Load a 3x8 @8D_ PNG, click all 8 muzzle points, then copy the generated
 * profile JSON into Actor Muzzle Profiles or Enemy Combat Profiles.
 *
 * ---------------------------------------------------------------------------
 * VISUAL MUZZLE CALIBRATOR (v0.7.0)
 * ---------------------------------------------------------------------------
 * During Playtest, use the Plugin Command:
 *
 *   Phanicom Active Combat -> Open Muzzle Calibrator
 *
 * Leave Character Sheet blank to use the player's current sheet. The tool
 * expects the Phanicom @8D_ layout: 3 columns x 8 direction rows. It displays
 * the middle animation frame from every row. Click the literal muzzle on each
 * frame; the tool converts that click into the existing bottom-center X/Y
 * muzzle coordinate system automatically.
 *
 * APPLY SESSION updates the selected Weapon Profile immediately for the current
 * playtest so you can close the calibrator and test shots without restarting.
 * COPY VALUES copies all 16 Muzzle#X/Muzzle#Y values plus a directional
 * muzzleOverride string for permanent entry into Plugin Manager / Item notes.
 *
 * This tool does NOT change combat coordinate math.
 *
 * Example:
 * <PhanicomABSWeapon: equipSwitch=662 profile=handgun damage=10 ammoItem=402 ammoPerShot=1>
 *
 * Profiles supply defaults for runtime type, family, fire mode, audio/SE,
 * tracer color, muzzleForward, and all eight visual muzzle X/Y offsets.
 * A value written directly in the Item note ALWAYS wins over its profile.
 * Existing weapons without profile= continue using the v0.6.0 rules.
 * v0.6.3: Items also auto-match profiles by exact Item name after normalization.
 * If a profile resolves, its Plugin Manager muzzle data drives the player muzzle.
 * Use muzzleOverride= for an intentional one-Item exception.
 * Legacy muzzle= remains supported for Items that do not resolve a profile.
 *
 * Family is intentionally separate from Runtime Type. Grenade, Satchel Charge
 * and Cluster Bomb are seeded family=thrown while temporarily retaining the
 * current projectile runtime. This leaves room for a future true thrown/arc
 * runtime without changing the profile architecture or existing Item data.
 *
 * Beam defaults preserve the old beam patch mapping:
 *   oozi_biotech -> green family visual default + RPG Maker SE Laser1
 *   beam_weapon  -> pink family visual default + RPG Maker SE Laser2
 * ---------------------------------------------------------------------------
 * GOLDENEYE-STYLE PROCEDURAL FIREARM AUDIO
 * ---------------------------------------------------------------------------
 * v0.4.9 integrates the soft filtered synth firearm family previously used by
 * Phanicom's GoldenEye ABS audio override. It is implemented directly here and
 * does NOT depend on the old SovietBlaze / Infantry ABS stack.
 *
 * Defaults:
 *   projectile / hitscan -> standard gunshot profile
 *   shotgun              -> shotgun blast profile
 *   melee                 -> no procedural gunshot
 *
 * Optional per-weapon/per-enemy field:
 *   audio=standard | shotgun | large | plasma | cryo | grape | none
 *   audioVolume=1.0
 *
 * Existing Item sound=SomeSE still takes priority for that PLAYER weapon and
 * uses RPG Maker's normal AudioManager SE path instead of procedural audio.
 *
 * ---------------------------------------------------------------------------
 * ITEM WEAPON NOTE
 * ---------------------------------------------------------------------------
 * Recommended one-line MZ syntax:
 *
 * <PhanicomABSWeapon: equipSwitch=662 type=projectile damage=10 speed=45 range=35 radius=0.015 cooldown=12 spread=0.7 tracerColor=#ffcf70 tracerLife=0.08>
 *
 * Optional muzzle fields:
 *
 *   muzzle=0,-82
 *
 * Uses the same visual muzzle offset, in PIXELS, for every facing.
 *
 * OR precise 8-direction offsets:
 *
 *   muzzle=2:8,-74|4:-26,-78|6:28,-78|8:4,-96|1:-20,-70|3:22,-70|7:-20,-90|9:20,-90
 *
 * Directions use RPG Maker numpad notation. The muzzle offset is VISUAL height/
 * placement, not map depth. Projectile physics remains centered on the character
 * feet-plane while tracer/cover collision is evaluated at the muzzle's visual
 * pixel offset. This is intentional for tall full-body sprites.
 *
 * Other projectile fields:
 *   equipSwitch   Existing switch that means this weapon Item is equipped.
 *   type          projectile | hitscan | shotgun | melee
 *   damage        Damage on hit.
 *   speed         Tiles per second. Phanicom-engine-like default 45.
 *   range         Maximum travel in tiles.
 *   radius        Physical projectile disk radius in tiles.
 *   cooldown      Semi/burst recovery frames after a completed trigger cycle.
 *   fireMode      semi | burst | auto. Default semi.
 *   fireRate      Auto-fire interval in frames. Defaults to cooldown.
 *   burstCount    Number of rounds in a burst. Default 3.
 *   burstDelay    Frames between rounds inside a burst. Default 4.
 *   ammoItem      RPG Maker Item ID used as ammunition. 0/omitted = unlimited.
 *   ammoPerShot   Number of ammo Items consumed per actual round/trigger shot. Default 1.
 *   emptySound    Optional audio/se filename override for dry fire. Default is Plugin Manager value.
 *   spread        Spread in degrees. Projectile/hitscan uses Gaussian spread; shotgun uses this as the full pellet cone.
 *   pellets       Shotgun pellet count. Default 8 when type=shotgun.
 *   tracerColor   CSS hex color.
 *   tracerLife    Seconds a tracer segment remains visible.
 *   ammoItem      Optional Item database ID for ammunition.
 *   ammoCost      Ammo consumed per shot. Default 1.
 *   muzzleForward Small physical offset forward from shooter in tiles. Default .20.
 *   penetration   Optional opaque-pixel penetration budget. 0 = stop at cover.
 *   sound         Optional RPG Maker SE filename without extension.
 *   volume        Optional SE volume, default 90.
 *   pitch         Optional SE pitch, default 100.
 *
 * Melee example:
 * Shotgun example:
 * <PhanicomABSWeapon: equipSwitch=431 type=shotgun damage=6 pellets=8 speed=42 range=22 spread=14 cooldown=35 ammoItem=410 ammoPerShot=1 tracerColor=#ffd28a tracerLife=0.06>
 *
 * Full-auto Item-ammo example:
 * <PhanicomABSWeapon: equipSwitch=670 type=projectile fireMode=auto fireRate=5 damage=6 speed=48 range=40 spread=2 ammoItem=402 ammoPerShot=1>
 *
 * Three-round burst example:
 * <PhanicomABSWeapon: equipSwitch=671 type=projectile fireMode=burst burstCount=3 burstDelay=4 cooldown=28 damage=7 speed=46 range=38 spread=2 ammoItem=402 ammoPerShot=1>
 *
 * Melee example:
 * <PhanicomABSWeapon: equipSwitch=700 type=melee damage=15 range=1.25 arc=75 cooldown=24 maxTargets=1 sound=Sword1>
 *
 * ---------------------------------------------------------------------------
 * ABS ENEMY / COMBATANT EVENT
 * ---------------------------------------------------------------------------
 * Passive target only:
 *
 * <PhanicomABS>
 *
 * Target with custom HP:
 *
 * <PhanicomABS: hp=60>
 *
 * Shooting enemy:
 *
 * <PhanicomABS: hp=60 attack=projectile damage=8 range=20 fireRate=60 speed=38 spread=2 tracerColor=#ff8a5b enemyMuzzle=2:0,-70|4:-55,-68|6:55,-68|8:0,-78|1:-42,-66|3:42,-66|7:-42,-74|9:42,-74>
 *
 * Hitscan enemy:
 *
 * <PhanicomABS: attack=hitscan damage=6 range=24 fireRate=45 spread=1.5>
 *
 * Shotgun enemy:
 *
 * <PhanicomABS: hp=90 attack=shotgun damage=5 pellets=7 range=16 fireRate=80 speed=38 spread=18 tracerColor=#ff9a65 muzzle=0,-70>
 *
 * Melee enemy:
 *
 * <PhanicomABS: attack=melee damage=12 range=1.2 fireRate=60>
 *
 * Enemy attack fields:
 *   attack        none | projectile | hitscan | shotgun | melee. Default none.
 *   damage        Damage to player.
 *   range         Attack/acquisition range in tiles.
 *   fireRate      Frames between attacks. Default 60.
 *   speed         Projectile speed in tiles/sec.
 *   radius        Projectile radius.
 *   spread        Degrees of spread. For shotgun this is the full pellet cone.
 *   pellets       Shotgun pellet count. Default 8.
 *   tracerColor   Projectile tracer color.
 *   tracerLife    Tracer persistence in seconds.
 *   enemyMuzzle   Enemy-only visual muzzle pixel offset. Supports either x,y
 *                  or the full 8-direction syntax used by Item weapons.
 *   muzzle        Legacy enemy muzzle fallback. Existing tags remain valid.
 *   muzzleForward Physical forward spawn offset in tiles.
 *
 * Enemy muzzle priority:
 *   enemyMuzzle=  -> explicit new enemy setting
 *   muzzle=       -> legacy fallback
 *   0,0           -> final fallback
 *   penetration   Opaque-pixel penetration budget.
 *   deathSwitch   A/B/C/D/None. Default plugin setting, normally A.
 *   hitRadius     Fallback collision radius if the current sprite mask is unavailable.
 *   alpha         Optional hurt-mask alpha threshold. Default plugin setting.
 *   blood         Procedural blood color, e.g. #7d0b0c or #65d44c.
 *   bloodAmount   Approximate droplets per hit.
 *   gib           true enables optional sprite-derived body explosion on qualifying death.
 *   gibThreshold  Minimum final-hit damage needed to gib.
 *   gibBloodBurst Approximate droplets emitted at the instant of fracture.
 *   gibBleedChance Fraction 0-1 of fragments that leave short blood trails.
 *   gibBleedFrames Number of starting frames during which selected fragments bleed.
 *
 * Projectile hits use the CURRENT VISIBLE CHARACTER FRAME as the event hurt mask:
 * opaque pixels take hits; transparent pixels remain shoot-through. If no usable
 * sprite/frame mask is available, hitRadius is used as a conservative fallback.
 *
 * Runtime HP belongs to THIS EVENT. At 0 HP, v0.5.0 routes death by outcome:
 *   normal death -> Self Switch A
 *   successful gib death -> Self Switch B
 * This works naturally with Phanicom's <ResetSelfSwitches> respawn plugin.
 *
 * ---------------------------------------------------------------------------
 * PIXEL-ALPHA COVER
 * ---------------------------------------------------------------------------
 * Put this in an event Note:
 *
 * <PhanicomCover>
 *
 * The CURRENT CHARACTER FRAME is used as a projectile mask:
 * - opaque/visible pixels block
 * - transparent pixels do not
 * - chair legs block only where their pixels exist
 * - holes/gaps remain shoot-through
 * - no tile-sized collision box is substituted
 *
 * Optional:
 * <PhanicomCover: material=wood alpha=32>
 *
 * Supported material penetration costs in v0.2:
 *   glass = 0.40 per opaque pixel
 *   wood  = 1.00 per opaque pixel
 *   generic = 1.00 per opaque pixel
 *   metal = 3.00 per opaque pixel
 *
 * You can override cost directly:
 * <PhanicomCover: material=wood penetrationCost=1.5>
 *
 * A weapon with penetration=0 stops at its first opaque cover pixel.
 * A weapon with penetration=12 may pass through a thin object if the contiguous
 * opaque thickness * material cost does not exceed its remaining budget.
 *
 * IMPORTANT: pixel cover requires the event to have a character graphic on its
 * active page. The alpha mask is cached per bitmap/frame for performance.
 *
 * ---------------------------------------------------------------------------
 * PROCEDURAL BLOOD / BODY EXPLOSIONS
 * ---------------------------------------------------------------------------
 * Per-enemy blood color and density:
 * <PhanicomABS: hp=60 blood=#7d0b0c bloodAmount=8>
 * <PhanicomABS: hp=80 blood=#65d44c bloodAmount=10>
 *
 * Optional catastrophic death:
 * <PhanicomABS: hp=60 blood=#7d0b0c gib=true gibThreshold=25>
 *
 * A qualifying killing blow fragments the CURRENT VISIBLE SPRITE FRAME into
 * temporary sprite-derived chunks and adds a larger procedural blood burst.
 * Death routing in v0.5.0:
 *   normal death -> Self Switch A
 *   successful gib death -> Self Switch B
 * Only one of A/B is ON for a given death.
 *
 * ---------------------------------------------------------------------------
 * INPUT
 * ---------------------------------------------------------------------------
 * Attack Keyboard Key is configurable in Plugin Manager. Examples:
 * F, X, Q, E, SPACE, SHIFT.
 * Gamepad button is separately configurable.
 *
 * ---------------------------------------------------------------------------
 * PUBLIC SCRIPT CALLS
 * ---------------------------------------------------------------------------
 * PhanicomABS.attack();
 * PhanicomABS.currentWeapon();
 * PhanicomABS.eventState(eventId);
 * PhanicomABS.damageEvent(eventId, amount);
 * PhanicomABS.debugStatus();
 *
 * ---------------------------------------------------------------------------
 * v0.4 EXPERIMENTAL NOTES
 * ---------------------------------------------------------------------------
 * - Diagonal facing is captured at Game_Player.moveByInput/executeMove plus moveDiagonally, with a short diagonal lock so helper cardinal calls cannot collapse 1/3/7/9 before firing.
 * - Player HP damage is applied to $gameParty.leader().
 * - Enemy attack AI is deliberately simple: range check + direct aim. Cover and
 *   terrain physically intercept the actual projectile rather than AI pretending
 *   a shot was blocked.
 * - <PhanicomABS> and <PhanicomCover> share the same cached current-frame
 *   pixel-alpha mask engine. Enemy hurt detection is therefore full-sprite, not
 *   concentrated at the RPG Maker event base/feet.
 * - Current-map event HP survives save/load; transfers/map rebuilds reinitialize it.
 * ============================================================================
 */

/*~struct~WeaponProfile:
 * @param DisplayName
 * @text Display Name
 * @type string
 * @default New Weapon Profile
 * @desc Human-readable name shown while editing. The Item note uses Profile ID, not this label.
 *
 * @param ProfileId
 * @text Profile ID
 * @type string
 * @default new_weapon
 * @desc Stable note-tag ID, e.g. handgun or beam_weapon. Keep unique. Item syntax: profile=handgun
 *
 * @param Family
 * @text Weapon Family
 * @type string
 * @default projectile
 * @desc Free-text future-facing family such as firearm, beam, thrown, rocket, plasma, cryo, gyro. Stored separately from Runtime Type.
 *
 * @param RuntimeType
 * @text Current Runtime Type
 * @type string
 * @default projectile
 * @desc Current ABS simulation type. Existing engine values: projectile, hitscan, shotgun, melee. Future runtimes can be added without replacing profiles.
 *
 * @param FireMode
 * @text Default Fire Mode
 * @type select
 * @option Semi Automatic
 * @value semi
 * @option Burst
 * @value burst
 * @option Full Automatic
 * @value auto
 * @default semi
 * @desc Default fire mode for Items using this profile. Item fireMode= overrides it.
 *
 * @param AudioProfile
 * @text Procedural Audio Profile
 * @type string
 * @default standard
 * @desc Integrated synth profile: standard, shotgun, large, plasma, cryo, grape, none. Ignored when Default SE is set.
 *
 * @param DefaultSE
 * @text Default RPG Maker SE
 * @type file
 * @dir audio/se/
 * @default
 * @desc Optional normal SE override. Oozi defaults Laser1 (green); Beam Weapon defaults Laser2 (pink). Item sound= overrides it.
 *
 * @param TracerColor
 * @text Default Tracer / Beam Color
 * @type string
 * @default #ffcf70
 * @desc Default tracer color. Item tracerColor= overrides it.
 *
 * @param MuzzleForward
 * @text Physical Muzzle Forward
 * @type number
 * @decimals 2
 * @min 0
 * @default 0.20
 * @desc Physical projectile origin distance in map cells. Visual X/Y muzzle offsets below are pixels.
 *
 * @param Muzzle2X
 * @text South (2) Muzzle X
 * @type number
 * @min -2000
 * @max 2000
 * @default 0
 * @desc Pixel X offset for south/front-facing fire.
 *
 * @param Muzzle2Y
 * @text South (2) Muzzle Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -165
 * @desc Pixel Y offset for south/front-facing fire. Negative moves upward.
 *
 * @param Muzzle4X
 * @text West (4) Muzzle X
 * @type number
 * @min -2000
 * @max 2000
 * @default -95
 *
 * @param Muzzle4Y
 * @text West (4) Muzzle Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -160
 *
 * @param Muzzle6X
 * @text East (6) Muzzle X
 * @type number
 * @min -2000
 * @max 2000
 * @default 95
 *
 * @param Muzzle6Y
 * @text East (6) Muzzle Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -160
 *
 * @param Muzzle8X
 * @text North (8) Muzzle X
 * @type number
 * @min -2000
 * @max 2000
 * @default 0
 *
 * @param Muzzle8Y
 * @text North (8) Muzzle Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -180
 *
 * @param Muzzle1X
 * @text Southwest (1) Muzzle X
 * @type number
 * @min -2000
 * @max 2000
 * @default -70
 *
 * @param Muzzle1Y
 * @text Southwest (1) Muzzle Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -160
 *
 * @param Muzzle3X
 * @text Southeast (3) Muzzle X
 * @type number
 * @min -2000
 * @max 2000
 * @default 70
 *
 * @param Muzzle3Y
 * @text Southeast (3) Muzzle Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -160
 *
 * @param Muzzle9X
 * @text Northeast (9) Muzzle X
 * @type number
 * @min -2000
 * @max 2000
 * @default 70
 *
 * @param Muzzle9Y
 * @text Northeast (9) Muzzle Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -175
 *
 * @param Muzzle7X
 * @text Northwest (7) Muzzle X
 * @type number
 * @min -2000
 * @max 2000
 * @default -70
 *
 * @param Muzzle7Y
 * @text Northwest (7) Muzzle Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -175
 */


/*~struct~ActorMuzzleProfile:
 * @param DisplayName
 * @text Display Name
 * @type string
 * @default New Actor Muzzle Profile
 *
 * @param ActorId
 * @text Actor
 * @type actor
 * @default 1
 * @desc Player muzzle geometry is selected by the party leader's Actor ID.
 *
 * @param CharacterSheet
 * @text Character Sheet Reference
 * @type file
 * @dir img/characters/
 * @default
 * @desc Editor/calibration reference only. Runtime uses the actor's visible sprite.
 *
 * @param Muzzle2X
 * @text South (2) X
 * @type number
 * @min -2000
 * @max 2000
 * @default 0
 * @param Muzzle2Y
 * @text South (2) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -165
 * @param Muzzle4X
 * @text West (4) X
 * @type number
 * @min -2000
 * @max 2000
 * @default -95
 * @param Muzzle4Y
 * @text West (4) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -160
 * @param Muzzle6X
 * @text East (6) X
 * @type number
 * @min -2000
 * @max 2000
 * @default 95
 * @param Muzzle6Y
 * @text East (6) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -160
 * @param Muzzle8X
 * @text North (8) X
 * @type number
 * @min -2000
 * @max 2000
 * @default 0
 * @param Muzzle8Y
 * @text North (8) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -180
 * @param Muzzle1X
 * @text Southwest (1) X
 * @type number
 * @min -2000
 * @max 2000
 * @default -70
 * @param Muzzle1Y
 * @text Southwest (1) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -160
 * @param Muzzle3X
 * @text Southeast (3) X
 * @type number
 * @min -2000
 * @max 2000
 * @default 70
 * @param Muzzle3Y
 * @text Southeast (3) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -160
 * @param Muzzle9X
 * @text Northeast (9) X
 * @type number
 * @min -2000
 * @max 2000
 * @default 70
 * @param Muzzle9Y
 * @text Northeast (9) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -175
 * @param Muzzle7X
 * @text Northwest (7) X
 * @type number
 * @min -2000
 * @max 2000
 * @default -70
 * @param Muzzle7Y
 * @text Northwest (7) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -175
 */

/*~struct~EnemyCombatProfile:
 * @param DisplayName
 * @text Display Name
 * @type string
 * @default New Enemy Combat Profile
 *
 * @param ProfileId
 * @text Profile ID
 * @type string
 * @default new_enemy
 * @desc Stable ID used by event notes: <PhanicomABS: profile=new_enemy>
 *
 * @param CharacterSheet
 * @text Character Sheet Reference
 * @type file
 * @dir img/characters/
 * @default
 * @desc Editor/calibration reference only. Runtime combat stays attached to the event's current visible sprite.
 *
 * @param CalibrationId
 * @text Firing Calibration ID
 * @type string
 * @default
 * @desc Optional explicit Firing Calibration ID. Blank allows Enemy Profile ID auto-match.
 *
 * @param Hp
 * @text HP
 * @type number
 * @min 1
 * @default 60
 *
 * @param Attack
 * @text Attack Type
 * @type select
 * @option None
 * @value none
 * @option Projectile
 * @value projectile
 * @option Hitscan
 * @value hitscan
 * @option Shotgun
 * @value shotgun
 * @option Melee
 * @value melee
 * @default projectile
 *
 * @param Damage
 * @text Damage
 * @type number
 * @min 0
 * @default 8
 *
 * @param Range
 * @text Range
 * @type number
 * @decimals 2
 * @min 0.1
 * @default 18
 *
 * @param FireRate
 * @text Fire Rate (frames)
 * @type number
 * @min 1
 * @default 60
 *
 * @param Speed
 * @text Projectile Speed
 * @type number
 * @decimals 2
 * @min 0.01
 * @default 38
 *
 * @param Radius
 * @text Projectile Radius
 * @type number
 * @decimals 3
 * @min 0.001
 * @default 0.015
 *
 * @param Spread
 * @text Spread (degrees)
 * @type number
 * @decimals 2
 * @min 0
 * @default 1.5
 *
 * @param Pellets
 * @text Shotgun Pellets
 * @type number
 * @min 1
 * @default 8
 *
 * @param TracerColor
 * @text Tracer Color
 * @type string
 * @default #ff8a5b
 *
 * @param TracerLife
 * @text Tracer Life
 * @type number
 * @decimals 2
 * @min 0
 * @default 0.08
 *
 * @param MuzzleForward
 * @text Physical Muzzle Forward
 * @type number
 * @decimals 2
 * @min 0
 * @default 0.20
 *
 * @param AudioProfile
 * @text Audio Profile
 * @type string
 * @default standard
 *
 * @param AudioVolume
 * @text Audio Volume Scale
 * @type number
 * @decimals 2
 * @min 0
 * @max 4
 * @default 1.0
 *
 * @param BloodColor
 * @text Blood Color
 * @type string
 * @default #7d0b0c
 *
 * @param BloodAmount
 * @text Blood Droplets
 * @type number
 * @min 0
 * @max 64
 * @default 8
 *
 * @param Gib
 * @text Gib Enabled
 * @type boolean
 * @default false
 *
 * @param GibThreshold
 * @text Gib Threshold
 * @type number
 * @min 0
 * @default 1
 *
 * @param Muzzle2X
 * @text South (2) X
 * @type number
 * @min -2000
 * @max 2000
 * @default 0
 * @param Muzzle2Y
 * @text South (2) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -70
 * @param Muzzle4X
 * @text West (4) X
 * @type number
 * @min -2000
 * @max 2000
 * @default -55
 * @param Muzzle4Y
 * @text West (4) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -68
 * @param Muzzle6X
 * @text East (6) X
 * @type number
 * @min -2000
 * @max 2000
 * @default 55
 * @param Muzzle6Y
 * @text East (6) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -68
 * @param Muzzle8X
 * @text North (8) X
 * @type number
 * @min -2000
 * @max 2000
 * @default 0
 * @param Muzzle8Y
 * @text North (8) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -78
 * @param Muzzle1X
 * @text Southwest (1) X
 * @type number
 * @min -2000
 * @max 2000
 * @default -42
 * @param Muzzle1Y
 * @text Southwest (1) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -66
 * @param Muzzle3X
 * @text Southeast (3) X
 * @type number
 * @min -2000
 * @max 2000
 * @default 42
 * @param Muzzle3Y
 * @text Southeast (3) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -66
 * @param Muzzle9X
 * @text Northeast (9) X
 * @type number
 * @min -2000
 * @max 2000
 * @default 42
 * @param Muzzle9Y
 * @text Northeast (9) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -74
 * @param Muzzle7X
 * @text Northwest (7) X
 * @type number
 * @min -2000
 * @max 2000
 * @default -42
 * @param Muzzle7Y
 * @text Northwest (7) Y
 * @type number
 * @min -2000
 * @max 2000
 * @default -74
 *
 * @param AimAngle2
 * @text South (2) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default 90
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param AimAngle4
 * @text West (4) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default 180
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param AimAngle6
 * @text East (6) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default 0
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param AimAngle8
 * @text North (8) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default -90
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param AimAngle1
 * @text Southwest (1) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default 135
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param AimAngle3
 * @text Southeast (3) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default 45
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param AimAngle9
 * @text Northeast (9) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default -45
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param AimAngle7
 * @text Northwest (7) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default -135
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 */

/*~struct~FiringCalibrationProfile:
 * @param DisplayName
 * @text Display Name
 * @type string
 * @default New Firing Calibration
 *
 * @param CalibrationId
 * @text Calibration ID
 * @type string
 * @default new_calibration
 *
 * @param ActorId
 * @text Player Actor
 * @type actor
 * @default 0
 * @desc Player auto-match key. 0 disables Actor auto-match.
 *
 * @param WeaponProfileId
 * @text Weapon Profile ID
 * @type string
 * @default
 * @desc Player auto-match weapon profile, e.g. handgun or shotgun.
 *
 * @param EnemyProfileId
 * @text Enemy Combat Profile ID
 * @type string
 * @default
 * @desc Enemy auto-match combat profile, e.g. raider_shotgun.
 *
 * @param CharacterSheet
 * @text Character Sheet Reference
 * @type file
 * @dir img/characters/
 * @default
 *
 * @param Muzzle2X
 * @text South (2) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default 0
 *
 * @param Muzzle2Y
 * @text South (2) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -165
 *
 * @param Aim2X
 * @text South (2) Aim X
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default 0
 *
 * @param Aim2Y
 * @text South (2) Aim Y
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default 1
 *
 * @param Muzzle4X
 * @text West (4) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -95
 *
 * @param Muzzle4Y
 * @text West (4) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -160
 *
 * @param Aim4X
 * @text West (4) Aim X
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default -1
 *
 * @param Aim4Y
 * @text West (4) Aim Y
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default 0
 *
 * @param Muzzle6X
 * @text East (6) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default 95
 *
 * @param Muzzle6Y
 * @text East (6) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -160
 *
 * @param Aim6X
 * @text East (6) Aim X
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default 1
 *
 * @param Aim6Y
 * @text East (6) Aim Y
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default 0
 *
 * @param Muzzle8X
 * @text North (8) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default 0
 *
 * @param Muzzle8Y
 * @text North (8) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -180
 *
 * @param Aim8X
 * @text North (8) Aim X
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default 0
 *
 * @param Aim8Y
 * @text North (8) Aim Y
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default -1
 *
 * @param Muzzle1X
 * @text Southwest (1) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -70
 *
 * @param Muzzle1Y
 * @text Southwest (1) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -160
 *
 * @param Aim1X
 * @text Southwest (1) Aim X
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default -0.7071
 *
 * @param Aim1Y
 * @text Southwest (1) Aim Y
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default 0.7071
 *
 * @param Muzzle3X
 * @text Southeast (3) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default 70
 *
 * @param Muzzle3Y
 * @text Southeast (3) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -160
 *
 * @param Aim3X
 * @text Southeast (3) Aim X
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default 0.7071
 *
 * @param Aim3Y
 * @text Southeast (3) Aim Y
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default 0.7071
 *
 * @param Muzzle9X
 * @text Northeast (9) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default 70
 *
 * @param Muzzle9Y
 * @text Northeast (9) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -175
 *
 * @param Aim9X
 * @text Northeast (9) Aim X
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default 0.7071
 *
 * @param Aim9Y
 * @text Northeast (9) Aim Y
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default -0.7071
 *
 * @param Muzzle7X
 * @text Northwest (7) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -70
 *
 * @param Muzzle7Y
 * @text Northwest (7) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -175
 *
 * @param Aim7X
 * @text Northwest (7) Aim X
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default -0.7071
 *
 * @param Aim7Y
 * @text Northwest (7) Aim Y
 * @type number
 * @decimals 4
 * @min -1
 * @max 1
 * @default -0.7071
 *
 */

/*~struct~ActorWeaponCalibrationProfile:
 * @param DisplayName
 * @text Display Name
 * @type string
 * @default Candy Handgun
 *
 * @param ActorId
 * @text Actor
 * @type actor
 * @default 1
 *
 * @param WeaponProfileId
 * @text Weapon Profile ID
 * @type string
 * @default handgun
 * @desc Must match a Weapon Type Profile ID such as handgun, shotgun, plasma_gun.
 *
 * @param CharacterSheet
 * @text Character Sheet Reference
 * @type file
 * @dir img/characters/
 * @default
 * @desc Reference for visual calibration. Runtime uses the actor's live sprite.
 *
 * @param Muzzle2X
 * @text South (2) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default 0
 *
 * @param Muzzle2Y
 * @text South (2) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -165
 *
 * @param AimAngle2
 * @text South (2) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default 90
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param Muzzle4X
 * @text West (4) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -95
 *
 * @param Muzzle4Y
 * @text West (4) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -160
 *
 * @param AimAngle4
 * @text West (4) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default 180
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param Muzzle6X
 * @text East (6) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default 95
 *
 * @param Muzzle6Y
 * @text East (6) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -160
 *
 * @param AimAngle6
 * @text East (6) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default 0
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param Muzzle8X
 * @text North (8) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default 0
 *
 * @param Muzzle8Y
 * @text North (8) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -180
 *
 * @param AimAngle8
 * @text North (8) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default -90
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param Muzzle1X
 * @text Southwest (1) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -70
 *
 * @param Muzzle1Y
 * @text Southwest (1) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -160
 *
 * @param AimAngle1
 * @text Southwest (1) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default 135
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param Muzzle3X
 * @text Southeast (3) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default 70
 *
 * @param Muzzle3Y
 * @text Southeast (3) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -160
 *
 * @param AimAngle3
 * @text Southeast (3) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default 45
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param Muzzle9X
 * @text Northeast (9) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default 70
 *
 * @param Muzzle9Y
 * @text Northeast (9) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -175
 *
 * @param AimAngle9
 * @text Northeast (9) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default -45
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 * @param Muzzle7X
 * @text Northwest (7) Muzzle X
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -70
 *
 * @param Muzzle7Y
 * @text Northwest (7) Muzzle Y
 * @type number
 * @decimals 2
 * @min -2000
 * @max 2000
 * @default -175
 *
 * @param AimAngle7
 * @text Northwest (7) Aim Angle
 * @type number
 * @decimals 2
 * @min -360
 * @max 360
 * @default -135
 * @desc Degrees in screen coordinates: 0=right, 90=down, -90=up, 180=left.
 *
 */

(() => {
    "use strict";

    const PLUGIN_NAME = "Phanicom_ActiveCombat";
    const params = PluginManager.parameters(PLUGIN_NAME);
    const ATTACK_SYMBOL = "phanicomAbsAttack";
    const EPS = 1e-8;
    const DEG = Math.PI / 180;

    function keyNameToCode(name) {
        const raw = String(name || "").trim().toUpperCase();
        if (raw.length === 1) return raw.charCodeAt(0);
        const named = {
            SPACE: 32, ENTER: 13, RETURN: 13, SHIFT: 16, CTRL: 17, CONTROL: 17,
            ALT: 18, TAB: 9, ESC: 27, ESCAPE: 27, BACKSPACE: 8,
            LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
        };
        return named[raw] || 0;
    }

    const configuredKeyCode = keyNameToCode(params.AttackKey) || Number(params.AttackKeyCode || 70);

    // v0.4.9 preserves the v0.4.8b startup fix: CFG uses clamp() while it is being built, so the
    // helper must exist before CFG initialization. Keeping this as a normal
    // function declaration also makes the ordering robust to future edits.
    function clamp(v, lo, hi) {
        return Math.max(lo, Math.min(hi, v));
    }

    const CFG = Object.freeze({
        attackKeyName: String(params.AttackKey || "F"),
        attackKeyCode: configuredKeyCode,
        attackGamepadButton: Number(params.AttackGamepadButton ?? 5),
        defaultEmptySound: String(params.DefaultEmptySound || "Out of ammo"),
        dryFireCooldown: Math.max(1, Math.min(120, Number(params.DryFireCooldown || 10))),
        defaultEnemyHp: Math.max(1, Number(params.DefaultEnemyHP || 30)),
        defaultHitRadius: Math.max(0.05, Number(params.DefaultHitRadius || 0.34)),
        combatantAlphaThreshold: Math.max(1, Math.min(255, Number(params.CombatantAlphaThreshold || 32))),
        playerHitRadius: Math.max(0.05, Number(params.PlayerHitRadius || 0.30)),
        defaultDeathSwitch: String(params.DefaultDeathSelfSwitch || "A"),
        coverAlphaThreshold: Math.max(1, Math.min(255, Number(params.CoverAlphaThreshold || 32))),
        bloodEffects: String(params.BloodEffects ?? "true") === "true",
        defaultBloodColor: String(params.DefaultBloodColor || "#7d0b0c"),
        defaultBloodDroplets: Math.max(0, Math.min(64, Number(params.DefaultBloodDroplets || 8))),
        persistentBlood: String(params.PersistentBlood ?? "true") === "true",
        maxBloodDecals: Math.max(0, Math.min(500, Number(params.MaxBloodDecals || 80))),
        gibEffects: String(params.GibEffects ?? "true") === "true",
        defaultGibThreshold: Math.max(0, Number(params.DefaultGibThreshold || 25)),
        maxGibFragments: Math.max(0, Math.min(200, Number(params.MaxGibFragments || 48))),
        gibBloodBurst: Math.max(0, Math.min(128, Number(params.GibBloodBurst || 18))),
        gibBleedChance: clamp(Number(params.GibBleedChance ?? 0.35), 0, 1),
        gibBleedFrames: Math.max(0, Math.min(120, Number(params.GibBleedFrames || 12))),
        goldenEyeAudio: String(params.GoldenEyeAudio ?? "true") === "true",
        goldenEyeStandardVolume: Math.max(0.10, Number(params.GoldenEyeStandardVolume || 8.00)),
        goldenEyeOutputGain: Math.max(0.10, Number(params.GoldenEyeOutputGain || 6.00)),
        debugOverlay: String(params.ShowDebugOverlay ?? "true") === "true",
        debug: String(params.ShowDebug ?? "true") === "true",
    });


    function deathNumber(key, fallback, min, max) {
        const n = params[key] === undefined || params[key] === '' ? fallback : Number(params[key]);
        return Number.isFinite(n) ? clamp(n, min, max) : fallback;
    }
    function jsonArray(value, fallback = []) {
        try { const result = JSON.parse(value); return Array.isArray(result) ? result : fallback; }
        catch (_) { return fallback; }
    }
    const DEFAULT_FRAG_RULES = ["{\"WeaponKey\":\"oozi_biotech\",\"Messages\":\"[\\\"{killer} scrambled {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"needle_gun\",\"Messages\":\"[\\\"{killer} perforated {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"plasma_gun\",\"Messages\":\"[\\\"{killer} vaporized {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"burst_machine_gun\",\"Messages\":\"[\\\"{killer} fragged {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"heavy_machine_gun\",\"Messages\":\"[\\\"{killer} fragged {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"handgun\",\"Messages\":\"[\\\"{killer} fragged {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"rocket_launcher\",\"Messages\":\"[\\\"{killer} rocketed {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"grenade\",\"Messages\":\"[\\\"{killer} blew up {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"beam_weapon\",\"Messages\":\"[\\\"{killer} zapped {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"gyro_jet_weapon\",\"Messages\":\"[\\\"{killer} fragged {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"shotgun\",\"Messages\":\"[\\\"{killer} buckshot-blasted {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"satchel_charge\",\"Messages\":\"[\\\"{killer} fragged {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"cluster_bomb\",\"Messages\":\"[\\\"{killer} fragged {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"sniper_rifle\",\"Messages\":\"[\\\"{killer} picked off {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"cryo_auged_armament\",\"Messages\":\"[\\\"{killer} froze {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}","{\"WeaponKey\":\"melee\",\"Messages\":\"[\\\"{killer} cut down {victim}\\\",\\\"{victim} fell to {killer}'s {weapon}\\\",\\\"{killer} finished {victim} with {weapon}\\\"]\"}"];
    const DEATH = Object.freeze({
        enabled: params.PlayerDeathEnabled !== 'false',
        mode: ['normal','sprite','gib','damage'].includes(params.PlayerDeathMode) ? params.PlayerDeathMode : 'damage',
        metric: params.PlayerGibMetric === 'overkill' ? 'overkill' : 'hit',
        threshold: deathNumber('PlayerGibThreshold',25,0,999999),
        delayFrames: Math.round(deathNumber('PlayerDeathDelay',3,0,30)*60),
        image: String(params.PlayerDeathImage || ''),
        imageScale: deathNumber('PlayerDeathImageScale',1,.01,10),
        bloodCount: deathNumber('PlayerDeathBloodCount',18,0,128),
        feed: params.KillFeedEnabled !== 'false',
        feedFrames: Math.round(deathNumber('KillFeedSeconds',6,1,60)*60),
        feedLines: Math.round(deathNumber('KillFeedLines',5,1,10)),
        feedWidth: deathNumber('KillFeedWidth',600,200,2000),
        messages: jsonArray(params.KillFeedMessages, ['{killer} fragged {victim}']).filter(x => typeof x === 'string'),
        rules: jsonArray(params.KillFeedWeaponRules, DEFAULT_FRAG_RULES).flatMap(raw => {
            try { const r = typeof raw === 'string' ? JSON.parse(raw) : raw;
                return [{key:String(r.WeaponKey || ''),messages:jsonArray(r.Messages).filter(x=>typeof x==='string')}];
            } catch (_) { return []; }
        })
    });

    const hypot = (x, y) => Math.hypot(x, y) || 1;
    const log = (...args) => { if (CFG.debug) console.log(`[${PLUGIN_NAME}]`, ...args); };

    // ---------------------------------------------------------------------
    // Input bridge
    // ---------------------------------------------------------------------
    if (CFG.attackKeyCode > 0) Input.keyMapper[CFG.attackKeyCode] = ATTACK_SYMBOL;
    if (CFG.attackGamepadButton >= 0) Input.gamepadMapper[CFG.attackGamepadButton] = ATTACK_SYMBOL;

    const RawInput = { pressed: false, triggered: false };

    // v0.4.5: combat aim is isolated from movement. Current held input is read
    // immediately; the last non-zero aim persists after release so standing
    // diagonal facing can still fire diagonally.
    const CombatAim = { keys: new Set(), lastDir8: 2, lastSource: "fallback" };
    const AIM_KEY_CODES = new Set([37, 38, 39, 40, 65, 68, 83, 87]);
    const _Input_onKeyDown_PhanicomABS = Input._onKeyDown;
    Input._onKeyDown = function(event) {
        _Input_onKeyDown_PhanicomABS.call(this, event);
        if (AIM_KEY_CODES.has(Number(event.keyCode))) CombatAim.keys.add(Number(event.keyCode));
        if (Number(event.keyCode) === CFG.attackKeyCode && !RawInput.pressed) {
            RawInput.triggered = true;
            RawInput.pressed = true;
        }
    };
    const _Input_onKeyUp_PhanicomABS = Input._onKeyUp;
    Input._onKeyUp = function(event) {
        _Input_onKeyUp_PhanicomABS.call(this, event);
        if (AIM_KEY_CODES.has(Number(event.keyCode))) CombatAim.keys.delete(Number(event.keyCode));
        if (Number(event.keyCode) === CFG.attackKeyCode) RawInput.pressed = false;
    };
    window.addEventListener("blur", () => CombatAim.keys.clear());

    // ---------------------------------------------------------------------
    // Note parsing helpers
    // ---------------------------------------------------------------------
    function parseAttributePairs(text) {
        const out = {};
        const re = /([A-Za-z][\w]*)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g;
        let m;
        while ((m = re.exec(String(text || "")))) {
            out[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
        }
        return out;
    }

    function parseLegacyKeyValueBlock(text, tagName) {
        const re = new RegExp(`<${tagName}\\s*>([\\s\\S]*?)<\\/${tagName}\\s*>`, "i");
        const m = String(text || "").match(re);
        if (!m) return null;
        const out = {};
        for (const raw of m[1].split(/\r?\n/)) {
            const line = raw.trim();
            if (!line || line.startsWith("#") || line.startsWith("//")) continue;
            const eq = line.indexOf("=");
            if (eq <= 0) continue;
            out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
        }
        return out;
    }

    function parseTagOptions(note, tagName) {
        /*
         * v0.4.7: Merge EVERY matching inline tag on the object/event.
         *
         * Previous revisions used String.match() without the global flag, so
         * only the FIRST <PhanicomABS: ...> tag was ever parsed. That meant an
         * event using one tag for attack settings and a second tag for blood /
         * gib settings silently lost everything in the second tag.
         *
         * We now scan all occurrences in note order and merge their key/value
         * pairs. Later tags override earlier values when the same key appears.
         * A bare <PhanicomABS> still counts as a valid marker and contributes
         * no options of its own.
         */
        const text = String(note || "");
        const re = new RegExp(`<${tagName}(?:\s*:?\s*([^>]*))?>`, "gi");
        const merged = {};
        let found = false;
        let m;
        while ((m = re.exec(text))) {
            found = true;
            Object.assign(merged, parseAttributePairs(m[1] || ""));
        }
        return found ? merged : null;
    }

    function parseWeaponNote(text) {
        const note = String(text || "");
        const single = note.match(/<PhanicomABSWeapon\s*:?\s+([^>]+)>/i);
        if (single) {
            const attrs = parseAttributePairs(single[1]);
            if (Object.keys(attrs).length > 0) return attrs;
        }
        return parseLegacyKeyValueBlock(note, "PhanicomABSWeapon");
    }

    function num(obj, key, fallback) {
        const n = Number(obj?.[key]);
        return Number.isFinite(n) ? n : fallback;
    }
    function int(obj, key, fallback) { return Math.trunc(num(obj, key, fallback)); }
    function str(obj, key, fallback) {
        const value = obj?.[key];
        return value === undefined || value === null || value === "" ? fallback : String(value);
    }

    function parseOffsetPair(text) {
        const m = String(text || "").trim().match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
        return m ? { x: Number(m[1]), y: Number(m[2]) } : null;
    }

    // Supports either "0,-82" or "2:8,-74|4:-26,-78|...".
    function parseMuzzleSpec(text) {
        const raw = String(text || "").trim();
        const shared = parseOffsetPair(raw);
        if (shared) return { shared, byDirection: null };
        const byDirection = {};
        for (const part of raw.split("|")) {
            const m = part.match(/^\s*([12346789])\s*:\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
            if (m) byDirection[Number(m[1])] = { x: Number(m[2]), y: Number(m[3]) };
        }
        return Object.keys(byDirection).length ? { shared: { x: 0, y: 0 }, byDirection } : { shared: { x: 0, y: 0 }, byDirection: null };
    }

    function muzzleForDirection(spec, dir) {
        if (!spec) return { x: 0, y: 0 };
        return spec.byDirection?.[Number(dir)] || spec.shared || { x: 0, y: 0 };
    }

    // ---------------------------------------------------------------------
    // Data-driven weapon profiles (v0.6.1)
    // ---------------------------------------------------------------------
    // MZ stores struct arrays as a JSON array whose entries are themselves
    // JSON strings. This parser also accepts plain objects so hand-edited test
    // data and future serialization changes fail gracefully.
    function parseStructArray(raw) {
        if (!raw) return [];
        try {
            const outer = JSON.parse(raw);
            if (!Array.isArray(outer)) return [];
            return outer.map(entry => {
                if (entry && typeof entry === "object") return entry;
                try { return JSON.parse(String(entry || "{}")); }
                catch (_) { return null; }
            }).filter(Boolean);
        } catch (_) {
            return [];
        }
    }

    function profileKey(value) {
        return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    }

    const FALLBACK_WEAPON_PROFILES = Object.freeze([
        {"ProfileId":"oozi_biotech","DisplayName":"Oozi-BioTech DNA Scrambler","Family":"beam","RuntimeType":"projectile","FireMode":"semi","AudioProfile":"none","DefaultSE":"Laser1","TracerColor":"#00ff00","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-165","Muzzle4X":"-95","Muzzle4Y":"-160","Muzzle6X":"95","Muzzle6Y":"-160","Muzzle8X":"0","Muzzle8Y":"-180","Muzzle1X":"-70","Muzzle1Y":"-160","Muzzle3X":"70","Muzzle3Y":"-160","Muzzle9X":"70","Muzzle9Y":"-175","Muzzle7X":"-70","Muzzle7Y":"-175"},
        {"ProfileId":"needle_gun","DisplayName":"Needle Gun","Family":"projectile","RuntimeType":"projectile","FireMode":"semi","AudioProfile":"standard","DefaultSE":"","TracerColor":"#ffcf70","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-165","Muzzle4X":"-95","Muzzle4Y":"-160","Muzzle6X":"95","Muzzle6Y":"-160","Muzzle8X":"0","Muzzle8Y":"-180","Muzzle1X":"-70","Muzzle1Y":"-160","Muzzle3X":"70","Muzzle3Y":"-160","Muzzle9X":"70","Muzzle9Y":"-175","Muzzle7X":"-70","Muzzle7Y":"-175"},
        {"ProfileId":"plasma_gun","DisplayName":"Plasma Gun","Family":"plasma","RuntimeType":"projectile","FireMode":"semi","AudioProfile":"plasma","DefaultSE":"","TracerColor":"#75e6ff","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-165","Muzzle4X":"-95","Muzzle4Y":"-160","Muzzle6X":"95","Muzzle6Y":"-160","Muzzle8X":"0","Muzzle8Y":"-180","Muzzle1X":"-70","Muzzle1Y":"-160","Muzzle3X":"70","Muzzle3Y":"-160","Muzzle9X":"70","Muzzle9Y":"-175","Muzzle7X":"-70","Muzzle7Y":"-175"},
        {"ProfileId":"burst_machine_gun","DisplayName":"Burst Machine Gun","Family":"firearm","RuntimeType":"projectile","FireMode":"burst","AudioProfile":"standard","DefaultSE":"","TracerColor":"#ffcf70","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-165","Muzzle4X":"-95","Muzzle4Y":"-160","Muzzle6X":"95","Muzzle6Y":"-160","Muzzle8X":"0","Muzzle8Y":"-180","Muzzle1X":"-70","Muzzle1Y":"-160","Muzzle3X":"70","Muzzle3Y":"-160","Muzzle9X":"70","Muzzle9Y":"-175","Muzzle7X":"-70","Muzzle7Y":"-175"},
        {"ProfileId":"heavy_machine_gun","DisplayName":"Heavy Machine Gun","Family":"firearm","RuntimeType":"projectile","FireMode":"auto","AudioProfile":"large","DefaultSE":"","TracerColor":"#ffcf70","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-165","Muzzle4X":"-95","Muzzle4Y":"-160","Muzzle6X":"95","Muzzle6Y":"-160","Muzzle8X":"0","Muzzle8Y":"-180","Muzzle1X":"-70","Muzzle1Y":"-160","Muzzle3X":"70","Muzzle3Y":"-160","Muzzle9X":"70","Muzzle9Y":"-175","Muzzle7X":"-70","Muzzle7Y":"-175"},
        {"ProfileId":"handgun","DisplayName":"Handgun","Family":"firearm","RuntimeType":"projectile","FireMode":"semi","AudioProfile":"standard","DefaultSE":"","TracerColor":"#ffcf70","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-165","Muzzle4X":"-95","Muzzle4Y":"-160","Muzzle6X":"95","Muzzle6Y":"-160","Muzzle8X":"0","Muzzle8Y":"-180","Muzzle1X":"-70","Muzzle1Y":"-160","Muzzle3X":"70","Muzzle3Y":"-160","Muzzle9X":"70","Muzzle9Y":"-175","Muzzle7X":"-70","Muzzle7Y":"-175"},
        {"ProfileId":"rocket_launcher","DisplayName":"Rocket Launcher","Family":"rocket","RuntimeType":"projectile","FireMode":"semi","AudioProfile":"large","DefaultSE":"","TracerColor":"#ff9b66","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-165","Muzzle4X":"-95","Muzzle4Y":"-160","Muzzle6X":"95","Muzzle6Y":"-160","Muzzle8X":"0","Muzzle8Y":"-180","Muzzle1X":"-70","Muzzle1Y":"-160","Muzzle3X":"70","Muzzle3Y":"-160","Muzzle9X":"70","Muzzle9Y":"-175","Muzzle7X":"-70","Muzzle7Y":"-175"},
        {"ProfileId":"grenade","DisplayName":"Grenade","Family":"thrown","RuntimeType":"projectile","FireMode":"semi","AudioProfile":"none","DefaultSE":"","TracerColor":"#ffcf70","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-145","Muzzle4X":"-55","Muzzle4Y":"-150","Muzzle6X":"55","Muzzle6Y":"-150","Muzzle8X":"0","Muzzle8Y":"-165","Muzzle1X":"-45","Muzzle1Y":"-145","Muzzle3X":"45","Muzzle3Y":"-145","Muzzle9X":"45","Muzzle9Y":"-160","Muzzle7X":"-45","Muzzle7Y":"-160"},
        {"ProfileId":"beam_weapon","DisplayName":"Beam Weapon","Family":"beam","RuntimeType":"projectile","FireMode":"semi","AudioProfile":"none","DefaultSE":"Laser2","TracerColor":"#ff00ff","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-165","Muzzle4X":"-95","Muzzle4Y":"-160","Muzzle6X":"95","Muzzle6Y":"-160","Muzzle8X":"0","Muzzle8Y":"-180","Muzzle1X":"-70","Muzzle1Y":"-160","Muzzle3X":"70","Muzzle3Y":"-160","Muzzle9X":"70","Muzzle9Y":"-175","Muzzle7X":"-70","Muzzle7Y":"-175"},
        {"ProfileId":"gyro_jet_weapon","DisplayName":"Gyro Jet Weapon","Family":"gyro","RuntimeType":"projectile","FireMode":"semi","AudioProfile":"grape","DefaultSE":"","TracerColor":"#ffd28a","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-165","Muzzle4X":"-95","Muzzle4Y":"-160","Muzzle6X":"95","Muzzle6Y":"-160","Muzzle8X":"0","Muzzle8Y":"-180","Muzzle1X":"-70","Muzzle1Y":"-160","Muzzle3X":"70","Muzzle3Y":"-160","Muzzle9X":"70","Muzzle9Y":"-175","Muzzle7X":"-70","Muzzle7Y":"-175"},
        {"ProfileId":"shotgun","DisplayName":"Shotgun","Family":"firearm","RuntimeType":"shotgun","FireMode":"semi","AudioProfile":"shotgun","DefaultSE":"","TracerColor":"#ffd28a","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-165","Muzzle4X":"-95","Muzzle4Y":"-160","Muzzle6X":"95","Muzzle6Y":"-160","Muzzle8X":"0","Muzzle8Y":"-180","Muzzle1X":"-70","Muzzle1Y":"-160","Muzzle3X":"70","Muzzle3Y":"-160","Muzzle9X":"70","Muzzle9Y":"-175","Muzzle7X":"-70","Muzzle7Y":"-175"},
        {"ProfileId":"satchel_charge","DisplayName":"Satchel Charge","Family":"thrown","RuntimeType":"projectile","FireMode":"semi","AudioProfile":"none","DefaultSE":"","TracerColor":"#ffcf70","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-145","Muzzle4X":"-55","Muzzle4Y":"-150","Muzzle6X":"55","Muzzle6Y":"-150","Muzzle8X":"0","Muzzle8Y":"-165","Muzzle1X":"-45","Muzzle1Y":"-145","Muzzle3X":"45","Muzzle3Y":"-145","Muzzle9X":"45","Muzzle9Y":"-160","Muzzle7X":"-45","Muzzle7Y":"-160"},
        {"ProfileId":"cluster_bomb","DisplayName":"Cluster Bomb","Family":"thrown","RuntimeType":"projectile","FireMode":"semi","AudioProfile":"none","DefaultSE":"","TracerColor":"#ffcf70","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-145","Muzzle4X":"-55","Muzzle4Y":"-150","Muzzle6X":"55","Muzzle6Y":"-150","Muzzle8X":"0","Muzzle8Y":"-165","Muzzle1X":"-45","Muzzle1Y":"-145","Muzzle3X":"45","Muzzle3Y":"-145","Muzzle9X":"45","Muzzle9Y":"-160","Muzzle7X":"-45","Muzzle7Y":"-160"},
        {"ProfileId":"sniper_rifle","DisplayName":"Sniper Rifle","Family":"firearm","RuntimeType":"projectile","FireMode":"semi","AudioProfile":"large","DefaultSE":"","TracerColor":"#ffcf70","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-165","Muzzle4X":"-95","Muzzle4Y":"-160","Muzzle6X":"95","Muzzle6Y":"-160","Muzzle8X":"0","Muzzle8Y":"-180","Muzzle1X":"-70","Muzzle1Y":"-160","Muzzle3X":"70","Muzzle3Y":"-160","Muzzle9X":"70","Muzzle9Y":"-175","Muzzle7X":"-70","Muzzle7Y":"-175"},
        {"ProfileId":"cryo_auged_armament","DisplayName":"Cryo Auged Armament","Family":"cryo","RuntimeType":"projectile","FireMode":"semi","AudioProfile":"cryo","DefaultSE":"","TracerColor":"#bdefff","MuzzleForward":"0.20","Muzzle2X":"0","Muzzle2Y":"-165","Muzzle4X":"-95","Muzzle4Y":"-160","Muzzle6X":"95","Muzzle6Y":"-160","Muzzle8X":"0","Muzzle8Y":"-180","Muzzle1X":"-70","Muzzle1Y":"-160","Muzzle3X":"70","Muzzle3Y":"-160","Muzzle9X":"70","Muzzle9Y":"-175","Muzzle7X":"-70","Muzzle7Y":"-175"}
    ]);

    function profileMuzzleSpec(raw) {
        const byDirection = {};
        for (const dir of [2,4,6,8,1,3,9,7]) {
            const x = Number(raw?.[`Muzzle${dir}X`]);
            const y = Number(raw?.[`Muzzle${dir}Y`]);
            byDirection[dir] = {
                x: Number.isFinite(x) ? x : 0,
                y: Number.isFinite(y) ? y : 0,
            };
        }
        return { shared: { x: 0, y: 0 }, byDirection };
    }

    function profileAimSpec(raw) {
        const byDirection = {};
        for (const dir of [2,4,6,8,1,3,9,7]) {
            const x = Number(raw?.[`Aim${dir}X`]);
            const y = Number(raw?.[`Aim${dir}Y`]);
            if (Number.isFinite(x) && Number.isFinite(y) && Math.hypot(x, y) > EPS) {
                byDirection[dir] = normalize(x, y);
            }
        }
        return { byDirection };
    }

    function aimVectorForDirection(aimSpec, dir) {
        const v = aimSpec?.byDirection?.[Number(dir)];
        return v && Math.hypot(v.x, v.y) > EPS ? normalize(v.x, v.y) : directionVector(dir);
    }

    function angleDegreesToVector(degrees) {
        const rad = Number(degrees || 0) * DEG;
        return normalize(Math.cos(rad), Math.sin(rad));
    }

    function profileAngleAimSpec(raw) {
        const byDirection = {};
        for (const dir of [2,4,6,8,1,3,9,7]) {
            const key = `AimAngle${dir}`;
            const value = Number(raw?.[key]);
            if (Number.isFinite(value)) byDirection[dir] = angleDegreesToVector(value);
        }
        return { byDirection };
    }

    function compileWeaponProfile(raw) {
        const id = profileKey(raw?.ProfileId || raw?.DisplayName);
        if (!id) return null;
        return {
            id,
            displayName: String(raw?.DisplayName || raw?.ProfileId || id),
            family: String(raw?.Family || "projectile").trim().toLowerCase(),
            runtimeType: String(raw?.RuntimeType || "projectile").trim().toLowerCase(),
            fireMode: String(raw?.FireMode || "semi").trim().toLowerCase(),
            audioProfile: String(raw?.AudioProfile || "standard").trim().toLowerCase(),
            sound: String(raw?.DefaultSE || "").trim(),
            tracerColor: String(raw?.TracerColor || "#ffcf70").trim(),
            muzzleForward: Math.max(0, Number(raw?.MuzzleForward ?? 0.20) || 0),
            muzzleSpec: profileMuzzleSpec(raw),
        };
    }

    const configuredProfileStructs = parseStructArray(params.WeaponProfiles);
    // When updating an existing project, plugins.js may not yet contain the new
    // parameter. In that case the 15 seeded profiles still exist immediately;
    // opening/saving Plugin Manager exposes the editable metadata defaults.
    const WEAPON_PROFILE_LIST = (configuredProfileStructs.length ? configuredProfileStructs : FALLBACK_WEAPON_PROFILES)
        .map(compileWeaponProfile).filter(Boolean);
    const WEAPON_PROFILES = new Map();
    for (const profile of WEAPON_PROFILE_LIST) {
        WEAPON_PROFILES.set(profileKey(profile.id), profile);
        WEAPON_PROFILES.set(profileKey(profile.displayName), profile);
    }

    // ---------------------------------------------------------------------
    // Actor muzzle profiles + reusable enemy combat profiles (v0.8.0)
    // ---------------------------------------------------------------------
    function compileActorMuzzleProfile(raw) {
        const actorId = Math.max(0, Number(raw?.ActorId || 0) | 0);
        if (!actorId) return null;
        return {
            actorId,
            displayName: String(raw?.DisplayName || `Actor ${actorId}`),
            characterSheet: String(raw?.CharacterSheet || ""),
            muzzleSpec: profileMuzzleSpec(raw),
        };
    }

    const ACTOR_MUZZLE_PROFILE_LIST = parseStructArray(params.ActorMuzzleProfiles || "[]")
        .map(compileActorMuzzleProfile).filter(Boolean);
    const ACTOR_MUZZLE_PROFILES = new Map(
        ACTOR_MUZZLE_PROFILE_LIST.map(profile => [profile.actorId, profile])
    );

    function currentActorMuzzleProfile() {
        const actorId = $gameParty?.leader?.()?.actorId?.() || 0;
        return ACTOR_MUZZLE_PROFILES.get(actorId) || null;
    }

    function compileEnemyCombatProfile(raw) {
        const id = profileKey(raw?.ProfileId || raw?.DisplayName);
        if (!id) return null;
        const attack = String(raw?.Attack || "none").trim().toLowerCase();
        return {
            id,
            displayName: String(raw?.DisplayName || raw?.ProfileId || id),
            characterSheet: String(raw?.CharacterSheet || ""),
            calibrationId: profileKey(raw?.CalibrationId || ""),
            maxHp: Math.max(1, Number(raw?.Hp || 60)),
            attack: ["projectile","hitscan","shotgun","melee"].includes(attack) ? attack : "none",
            damage: Math.max(0, Number(raw?.Damage || 8)),
            range: Math.max(0.1, Number(raw?.Range || (attack === "melee" ? 1.2 : 18))),
            fireRate: Math.max(1, Number(raw?.FireRate || 60) | 0),
            speed: Math.max(0.01, Number(raw?.Speed || 38)),
            radius: Math.max(0.001, Number(raw?.Radius || 0.015)),
            spreadDegrees: Math.max(0, Number(raw?.Spread ?? (attack === "shotgun" ? 18 : 1.5))),
            pellets: Math.max(1, Number(raw?.Pellets || (attack === "shotgun" ? 8 : 1)) | 0),
            tracerColor: String(raw?.TracerColor || "#ff8a5b"),
            tracerLife: Math.max(0, Number(raw?.TracerLife || 0.08)),
            muzzleForward: Math.max(0, Number(raw?.MuzzleForward || 0.20)),
            muzzleSpec: profileMuzzleSpec(raw),
            aimSpec: profileAngleAimSpec(raw),
            audioProfile: String(raw?.AudioProfile || (attack === "shotgun" ? "shotgun" : (["projectile","hitscan"].includes(attack) ? "standard" : "none"))).toLowerCase(),
            audioVolume: clamp(Number(raw?.AudioVolume ?? 1.0), 0, 4),
            bloodColor: String(raw?.BloodColor || CFG.defaultBloodColor),
            bloodAmount: Math.max(0, Math.min(64, Number(raw?.BloodAmount ?? CFG.defaultBloodDroplets) | 0)),
            gib: /^(true|1|yes|on)$/i.test(String(raw?.Gib || "false")),
            gibThreshold: Math.max(0, Number(raw?.GibThreshold ?? CFG.defaultGibThreshold)),
        };
    }

    const ENEMY_COMBAT_PROFILE_LIST = parseStructArray(params.EnemyCombatProfiles)
        .map(compileEnemyCombatProfile).filter(Boolean);
    const ENEMY_COMBAT_PROFILES = new Map();
    for (const profile of ENEMY_COMBAT_PROFILE_LIST) {
        ENEMY_COMBAT_PROFILES.set(profileKey(profile.id), profile);
        ENEMY_COMBAT_PROFILES.set(profileKey(profile.displayName), profile);
    }

    function compileFiringCalibration(raw) {
        const id = profileKey(raw?.CalibrationId || raw?.DisplayName);
        if (!id) return null;
        return {
            id,
            displayName: String(raw?.DisplayName || raw?.CalibrationId || id),
            actorId: Math.max(0, Number(raw?.ActorId || 0) | 0),
            weaponProfileId: profileKey(raw?.WeaponProfileId || ""),
            enemyProfileId: profileKey(raw?.EnemyProfileId || ""),
            characterSheet: String(raw?.CharacterSheet || ""),
            muzzleSpec: profileMuzzleSpec(raw),
            aimSpec: profileAimSpec(raw),
        };
    }

    const FIRING_CALIBRATION_LIST = parseStructArray(params.FiringCalibrationProfiles || "[]")
        .map(compileFiringCalibration).filter(Boolean);
    const FIRING_CALIBRATIONS = new Map();
    for (const c of FIRING_CALIBRATION_LIST) {
        FIRING_CALIBRATIONS.set(profileKey(c.id), c);
        FIRING_CALIBRATIONS.set(profileKey(c.displayName), c);
    }

    function playerFiringCalibration(actorId, weaponProfileId, explicitId = "") {
        if (explicitId) {
            const c = FIRING_CALIBRATIONS.get(profileKey(explicitId));
            if (c) return c;
        }
        const aid = Number(actorId || 0) | 0;
        const wid = profileKey(weaponProfileId || "");
        if (!aid || !wid) return null;
        return FIRING_CALIBRATION_LIST.find(c => c.actorId === aid && c.weaponProfileId === wid) || null;
    }

    function enemyFiringCalibration(enemyProfileId, explicitId = "") {
        if (explicitId) {
            const c = FIRING_CALIBRATIONS.get(profileKey(explicitId));
            if (c) return c;
        }
        const eid = profileKey(enemyProfileId || "");
        if (!eid) return null;
        return FIRING_CALIBRATION_LIST.find(c => c.enemyProfileId === eid) || null;
    }

    function compileActorWeaponCalibration(raw) {
        const actorId = Math.max(0, Number(raw?.ActorId || 0) | 0);
        const weaponProfileId = profileKey(raw?.WeaponProfileId || "");
        if (!actorId || !weaponProfileId) return null;
        return {
            displayName: String(raw?.DisplayName || `Actor ${actorId} ${weaponProfileId}`),
            actorId,
            weaponProfileId,
            characterSheet: String(raw?.CharacterSheet || ""),
            muzzleSpec: profileMuzzleSpec(raw),
            aimSpec: profileAngleAimSpec(raw),
        };
    }

    const ACTOR_WEAPON_CALIBRATION_LIST = parseStructArray(params.ActorWeaponCalibrationProfiles)
        .map(compileActorWeaponCalibration).filter(Boolean);

    function actorWeaponCalibration(actorId, weaponProfileId) {
        const aid = Number(actorId || 0) | 0;
        const wid = profileKey(weaponProfileId || "");
        if (!aid || !wid) return null;
        return ACTOR_WEAPON_CALIBRATION_LIST.find(c =>
            c.actorId === aid && c.weaponProfileId === wid
        ) || null;
    }

    // ---------------------------------------------------------------------
    // Visual Muzzle Calibrator (v0.7.0)
    // ---------------------------------------------------------------------
    // The calibrator is deliberately an editor convenience layer only. It
    // reads/writes the same muzzleSpec objects already consumed by combat, so
    // projectile spawning, world coordinates and muzzle math remain untouched.
    const CAL_DIRS = Object.freeze([
        { dir: 2, name: "South", row: 0 },
        { dir: 4, name: "West", row: 1 },
        { dir: 6, name: "East", row: 2 },
        { dir: 8, name: "North", row: 3 },
        { dir: 1, name: "Southwest", row: 4 },
        { dir: 3, name: "Southeast", row: 5 },
        { dir: 9, name: "Northeast", row: 6 },
        { dir: 7, name: "Northwest", row: 7 },
    ]);

    function cloneDirectionalMuzzle(spec) {
        const out = {};
        for (const entry of CAL_DIRS) {
            const p = muzzleForDirection(spec, entry.dir);
            out[entry.dir] = {
                x: Math.round(Number(p?.x) || 0),
                y: Math.round(Number(p?.y) || 0),
            };
        }
        return out;
    }

    function directionalMuzzleSpec(points) {
        const byDirection = {};
        for (const entry of CAL_DIRS) {
            const p = points?.[entry.dir] || { x: 0, y: 0 };
            byDirection[entry.dir] = {
                x: Math.round(Number(p.x) || 0),
                y: Math.round(Number(p.y) || 0),
            };
        }
        return { shared: { x: 0, y: 0 }, byDirection };
    }

    function directionalMuzzleString(points) {
        return CAL_DIRS.map(entry => {
            const p = points?.[entry.dir] || { x: 0, y: 0 };
            return `${entry.dir}:${Math.round(Number(p.x) || 0)},${Math.round(Number(p.y) || 0)}`;
        }).join("|");
    }

    function calibrationParameterText(profile, points) {
        const lines = [
            `Profile: ${profile?.displayName || profile?.id || "unknown"} (${profile?.id || "unknown"})`,
        ];
        for (const entry of CAL_DIRS) {
            const p = points?.[entry.dir] || { x: 0, y: 0 };
            lines.push(`Muzzle${entry.dir}X=${Math.round(Number(p.x) || 0)}`);
            lines.push(`Muzzle${entry.dir}Y=${Math.round(Number(p.y) || 0)}`);
        }
        lines.push("");
        lines.push(`muzzleOverride=${directionalMuzzleString(points)}`);
        return lines.join("\n");
    }

    function copyTextToClipboard(textToCopy) {
        const value = String(textToCopy || "");
        try {
            if (navigator?.clipboard?.writeText) {
                navigator.clipboard.writeText(value).catch(() => {});
                return true;
            }
        } catch (_) {}
        try {
            const area = document.createElement("textarea");
            area.value = value;
            area.style.position = "fixed";
            area.style.left = "-10000px";
            area.style.top = "0";
            document.body.appendChild(area);
            area.focus();
            area.select();
            const ok = document.execCommand("copy");
            document.body.removeChild(area);
            return !!ok;
        } catch (_) {
            return false;
        }
    }

    class Window_PhanicomMuzzleProfiles extends Window_Command {
        makeCommandList() {
            for (const profile of WEAPON_PROFILE_LIST) {
                this.addCommand(profile.displayName, "profile", true, profile.id);
            }
        }
    }

    class Window_PhanicomMuzzleActions extends Window_HorzCommand {
        maxCols() { return 4; }
        makeCommandList() {
            this.addCommand("Apply Session", "apply");
            this.addCommand("Copy Values", "copy");
            this.addCommand("Reset Profile", "reset");
            this.addCommand("Close", "close");
        }
    }

    class Window_PhanicomMuzzleStatus extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._sceneRef = null;
        }
        setSceneRef(scene) {
            this._sceneRef = scene;
            this.refresh();
        }
        refresh() {
            this.contents.clear();
            const s = this._sceneRef;
            if (!s) return;
            const profile = s.currentCalibrationProfile?.();
            const points = s.currentCalibrationPoints?.();
            const sheet = s._sheetName || "(none)";
            const copied = s._copyMessage || "";
            this.contents.fontSize = 17;
            this.drawText(`Sheet: ${sheet}    Profile: ${profile?.displayName || "(none)"}`, 0, 0, this.innerWidth, "left");
            if (!points) return;
            const top = CAL_DIRS.slice(0, 4).map(e => {
                const p = points[e.dir];
                return `${e.dir} ${e.name}: ${p.x},${p.y}`;
            }).join("    ");
            const bottom = CAL_DIRS.slice(4).map(e => {
                const p = points[e.dir];
                return `${e.dir} ${e.name}: ${p.x},${p.y}`;
            }).join("    ");
            this.contents.fontSize = 14;
            this.drawText(top, 0, 27, this.innerWidth, "left");
            this.drawText(bottom, 0, 49, this.innerWidth, "left");
            this.contents.fontSize = 16;
            const note = copied || "Click directly on a muzzle. X/Y are calculated from the frame's bottom-center origin.";
            this.drawText(note, 0, 73, this.innerWidth, "left");
        }
    }

    class Scene_PhanicomMuzzleCalibrator extends Scene_MenuBase {
        static prepare(args = {}) {
            this._request = {
                sheet: String(args.CharacterSheet || "").trim(),
                profile: String(args.StartProfile || "").trim(),
            };
        }

        create() {
            super.create();
            this._request = Scene_PhanicomMuzzleCalibrator._request || {};
            this._sheetName = this._request.sheet || $gamePlayer?.characterName?.() || "";
            this._calibrations = new Map();
            this._frameViews = [];
            this._frameLayer = new PIXI.Container();
            this._frameLayer.sortableChildren = true;
            const wlIndex = this.children.indexOf(this._windowLayer);
            this.addChildAt(this._frameLayer, wlIndex >= 0 ? wlIndex : this.children.length);

            this.createCalibratorWindows();
            this.loadCalibratorSheet();
            this.selectInitialProfile();
        }

        profileWindowWidth() {
            return Math.max(230, Math.min(300, Math.floor(Graphics.boxWidth * 0.24)));
        }

        guideHeight() { return 86; }
        actionHeight() { return 72; }
        statusHeight() { return 126; }

        createCalibratorWindows() {
            const pw = this.profileWindowWidth();
            const gh = this.guideHeight();
            const ah = this.actionHeight();
            const sh = this.statusHeight();

            this._profileWindow = new Window_PhanicomMuzzleProfiles(
                new Rectangle(0, 0, pw, Graphics.boxHeight)
            );
            this._profileWindow.setHandler("cancel", this.popScene.bind(this));
            this.addWindow(this._profileWindow);

            this._guideWindow = new Window_Help(
                new Rectangle(pw, 0, Graphics.boxWidth - pw, gh)
            );
            this._guideWindow.setText(
                "Visual Muzzle Calibrator — @8D_ 3 columns × 8 rows\n" +
                "Click the actual muzzle on any displayed middle frame. Values update immediately."
            );
            this.addWindow(this._guideWindow);

            const actionY = Graphics.boxHeight - ah;
            this._actionWindow = new Window_PhanicomMuzzleActions(
                new Rectangle(pw, actionY, Graphics.boxWidth - pw, ah)
            );
            this._actionWindow.setHandler("apply", this.applyCalibrationSession.bind(this));
            this._actionWindow.setHandler("copy", this.copyCalibrationValues.bind(this));
            this._actionWindow.setHandler("reset", this.resetCalibrationProfile.bind(this));
            this._actionWindow.setHandler("close", this.popScene.bind(this));
            this._actionWindow.setHandler("cancel", this.popScene.bind(this));
            this.addWindow(this._actionWindow);

            const statusY = actionY - sh;
            this._statusWindow = new Window_PhanicomMuzzleStatus(
                new Rectangle(pw, statusY, Graphics.boxWidth - pw, sh)
            );
            this._statusWindow.setSceneRef(this);
            this.addWindow(this._statusWindow);
        }

        selectInitialProfile() {
            const equipped = (() => {
                try { return currentWeapon?.()?.profileId || ""; }
                catch (_) { return ""; }
            })();
            const requested = profileKey(this._request.profile || equipped);
            let index = 0;
            if (requested) {
                const found = WEAPON_PROFILE_LIST.findIndex(p => profileKey(p.id) === requested || profileKey(p.displayName) === requested);
                if (found >= 0) index = found;
            }
            this._profileWindow.select(index);
            this._lastProfileId = "";
            this.syncSelectedProfile(true);
        }

        currentCalibrationProfile() {
            const id = this._profileWindow?.currentExt?.();
            return WEAPON_PROFILES.get(profileKey(id)) || WEAPON_PROFILE_LIST[0] || null;
        }

        currentCalibrationPoints() {
            const profile = this.currentCalibrationProfile();
            if (!profile) return null;
            if (!this._calibrations.has(profile.id)) {
                this._calibrations.set(profile.id, cloneDirectionalMuzzle(profile.muzzleSpec));
            }
            return this._calibrations.get(profile.id);
        }

        syncSelectedProfile(force = false) {
            const profile = this.currentCalibrationProfile();
            const id = profile?.id || "";
            if (!force && id === this._lastProfileId) return;
            this._lastProfileId = id;
            this.currentCalibrationPoints();
            this._copyMessage = "";
            this.refreshMarkers();
            this._statusWindow?.refresh();
        }

        loadCalibratorSheet() {
            this.clearFrameLayer();
            if (!this._sheetName) {
                this._copyMessage = "No character sheet selected and the player has no current sheet.";
                this._statusWindow.refresh();
                SoundManager.playBuzzer();
                return;
            }
            this._sheetBitmap = ImageManager.loadCharacter(this._sheetName);
            this._sheetBitmap.addLoadListener(() => this.buildFrameViews());
        }

        clearFrameLayer() {
            if (!this._frameLayer) return;
            for (const child of [...this._frameLayer.children]) {
                this._frameLayer.removeChild(child);
                if (child.destroy) child.destroy({ children: true });
            }
            this._frameViews = [];
        }

        buildFrameViews() {
            this.clearFrameLayer();
            const bitmap = this._sheetBitmap;
            if (!bitmap || bitmap.width <= 0 || bitmap.height <= 0) return;

            const frameW = bitmap.width / 3;
            const frameH = bitmap.height / 8;
            this._frameW = frameW;
            this._frameH = frameH;

            const pw = this.profileWindowWidth();
            const gridX = pw;
            const gridY = this.guideHeight();
            const gridW = Graphics.boxWidth - pw;
            const gridH = Graphics.boxHeight - this.guideHeight() - this.statusHeight() - this.actionHeight();
            const cellW = gridW / 4;
            const cellH = gridH / 2;
            const scale = Math.max(0.15, Math.min(
                (cellW - 26) / frameW,
                (cellH - 34) / frameH,
                1.35
            ));
            this._frameScale = scale;

            CAL_DIRS.forEach((entry, i) => {
                const col = i % 4;
                const row = Math.floor(i / 4);
                const cellX = gridX + col * cellW;
                const cellY = gridY + row * cellH;
                const displayW = frameW * scale;
                const displayH = frameH * scale;
                const x = cellX + (cellW - displayW) / 2;
                const y = cellY + 25 + Math.max(0, (cellH - 25 - displayH) / 2);

                const border = new PIXI.Graphics();
                border.lineStyle(1, 0xffffff, 0.30);
                border.drawRect(x - 4, y - 4, displayW + 8, displayH + 8);
                border.zIndex = 0;
                this._frameLayer.addChild(border);

                const sprite = new Sprite(bitmap);
                sprite.setFrame(frameW, entry.row * frameH, frameW, frameH); // middle column
                sprite.x = x;
                sprite.y = y;
                sprite.scale.set(scale, scale);
                sprite.zIndex = 1;
                this._frameLayer.addChild(sprite);

                const label = new PIXI.Text(
                    `${entry.dir}  ${entry.name}`,
                    { fontFamily: "GameFont", fontSize: 16, fill: 0xffffff, stroke: 0x000000, strokeThickness: 3 }
                );
                label.x = cellX + 8;
                label.y = cellY + 2;
                label.zIndex = 2;
                this._frameLayer.addChild(label);

                const marker = new PIXI.Graphics();
                marker.zIndex = 3;
                this._frameLayer.addChild(marker);

                this._frameViews.push({
                    entry, sprite, marker, x, y,
                    width: displayW, height: displayH,
                    frameW, frameH, scale
                });
            });

            this.refreshMarkers();
            this._statusWindow.refresh();
        }

        refreshMarkers() {
            const points = this.currentCalibrationPoints();
            if (!points) return;
            for (const view of this._frameViews) {
                const p = points[view.entry.dir] || { x: 0, y: 0 };
                // Existing combat coordinates use frame bottom-center as 0,0.
                const sourceX = view.frameW / 2 + p.x;
                const sourceY = view.frameH + p.y;
                const sx = view.x + sourceX * view.scale;
                const sy = view.y + sourceY * view.scale;
                const m = view.marker;
                m.clear();
                m.lineStyle(2, 0xffcc33, 1.0);
                m.drawCircle(sx, sy, 7);
                m.moveTo(sx - 11, sy); m.lineTo(sx + 11, sy);
                m.moveTo(sx, sy - 11); m.lineTo(sx, sy + 11);
            }
        }

        update() {
            super.update();
            this.syncSelectedProfile(false);
            this.updateFrameClick();
        }

        updateFrameClick() {
            if (!TouchInput.isTriggered() || !this._sheetBitmap?.isReady?.()) return;
            const x = TouchInput.x;
            const y = TouchInput.y;
            for (const view of this._frameViews) {
                if (x < view.x || x > view.x + view.width || y < view.y || y > view.y + view.height) continue;

                const localX = (x - view.x) / view.scale;
                const localY = (y - view.y) / view.scale;

                // Convert literal clicked pixel into the ABS's EXISTING
                // bottom-center offset system. No runtime math is changed.
                const offsetX = Math.round(localX - view.frameW / 2);
                const offsetY = Math.round(localY - view.frameH);

                const points = this.currentCalibrationPoints();
                points[view.entry.dir] = { x: offsetX, y: offsetY };
                this._copyMessage = `${view.entry.name} set to X ${offsetX}, Y ${offsetY}`;
                SoundManager.playCursor();
                this.refreshMarkers();
                this._statusWindow.refresh();
                return;
            }
        }

        applyCalibrationSession() {
            const profile = this.currentCalibrationProfile();
            const points = this.currentCalibrationPoints();
            if (!profile || !points) {
                SoundManager.playBuzzer();
                return;
            }
            // Mutate only the live compiled profile object. Item parsing will
            // see this immediately on the map after the scene closes.
            profile.muzzleSpec = directionalMuzzleSpec(points);
            this._copyMessage = `Applied ${profile.displayName} to this playtest session.`;
            this._statusWindow.refresh();
            SoundManager.playOk();
            this._actionWindow.activate();
        }

        copyCalibrationValues() {
            const profile = this.currentCalibrationProfile();
            const points = this.currentCalibrationPoints();
            if (!profile || !points) {
                SoundManager.playBuzzer();
                return;
            }
            const ok = copyTextToClipboard(calibrationParameterText(profile, points));
            this._copyMessage = ok
                ? "Copied all profile X/Y values + muzzleOverride string."
                : "Clipboard API unavailable. Values remain visible on screen.";
            this._statusWindow.refresh();
            ok ? SoundManager.playOk() : SoundManager.playBuzzer();
            this._actionWindow.activate();
        }

        resetCalibrationProfile() {
            const profile = this.currentCalibrationProfile();
            if (!profile) return;
            this._calibrations.set(profile.id, cloneDirectionalMuzzle(profile.muzzleSpec));
            this._copyMessage = `Reset ${profile.displayName} to its currently loaded profile values.`;
            this.refreshMarkers();
            this._statusWindow.refresh();
            SoundManager.playCancel();
            this._actionWindow.activate();
        }

        terminate() {
            this.clearFrameLayer();
            super.terminate();
        }
    }

    window.Scene_PhanicomMuzzleCalibrator = Scene_PhanicomMuzzleCalibrator;

    PluginManager.registerCommand(PLUGIN_NAME, "OpenMuzzleCalibrator", args => {
        if (!Utils.isOptionValid("test")) {
            console.warn(`[${PLUGIN_NAME}] Muzzle Calibrator is playtest-only.`);
            SoundManager.playBuzzer();
            return;
        }
        Scene_PhanicomMuzzleCalibrator.prepare(args || {});
        SceneManager.push(Scene_PhanicomMuzzleCalibrator);
    });

    function weaponProfileFor(raw, item = null) {
        // v0.6.3: an explicit profile= always wins. If it is omitted, try the
        // RPG Maker Item name so the seeded profile library works immediately
        // with existing Items named "Handgun", "Shotgun", etc. This keeps the
        // Plugin Manager profile array as the practical source of weapon-type
        // muzzle data without forcing every existing Item note to be rewritten.
        const requested = str(raw, "profile", str(raw, "weaponProfile", ""));
        if (requested) return WEAPON_PROFILES.get(profileKey(requested)) || null;
        if (item?.name) return WEAPON_PROFILES.get(profileKey(item.name)) || null;
        return null;
    }

    function parseWeaponItem(item) {
        if (!item || !item.note) return null;
        const raw = parseWeaponNote(item.note);
        if (!raw) return null;

        const profile = weaponProfileFor(raw, item);
        // Direct Item-note values always override profile defaults. Profiles are
        // convenience/default data, never a hidden second source of authority.
        const type = str(raw, "type", profile?.runtimeType || "projectile").toLowerCase();
        const family = str(raw, "family", profile?.family || type).toLowerCase();
        const equipSwitch = int(raw, "equipSwitch", 0);
        if (equipSwitch <= 0) return null;

        const defaultCooldown = type === "melee" ? 24 : (type === "shotgun" ? 35 : 12);
        // v0.6.3 muzzle precedence:
        //   1) muzzleOverride=  -> deliberate per-Item exception
        //   2) resolved profile -> Plugin Manager weapon-profile values
        //   3) legacy muzzle=    -> older Items that do not use a profile
        //   4) 0,0 fallback
        //
        // This is intentionally different from v0.6.1/0.6.2. Once an Item is
        // attached to a profile (explicitly or by Item name), editing that
        // profile must visibly move the PLAYER muzzle as the editor implies.
        const hasMuzzleOverride = raw.muzzleOverride !== undefined && raw.muzzleOverride !== null && String(raw.muzzleOverride).trim() !== "";
        const hasLegacyMuzzle = raw.muzzle !== undefined && raw.muzzle !== null && String(raw.muzzle).trim() !== "";
        const actorMuzzleProfile = currentActorMuzzleProfile();
        const actorId = $gameParty?.leader?.()?.actorId?.() || 0;
        const explicitCalibrationId = str(raw, "calibration", "");
        const actorWeaponCal = actorWeaponCalibration(actorId, profile?.id || "");
        const firingCalibration = playerFiringCalibration(actorId, profile?.id || "", explicitCalibrationId);
        const muzzleSpec = hasMuzzleOverride
            ? parseMuzzleSpec(String(raw.muzzleOverride))
            : (actorWeaponCal?.muzzleSpec
                || firingCalibration?.muzzleSpec
                || actorMuzzleProfile?.muzzleSpec
                || profile?.muzzleSpec
                || (hasLegacyMuzzle ? parseMuzzleSpec(String(raw.muzzle)) : parseMuzzleSpec("0,0")));
        const requestedMode = str(raw, "fireMode", profile?.fireMode || "semi").toLowerCase();
        const fireMode = ["semi", "burst", "auto"].includes(requestedMode) ? requestedMode : "semi";
        const defaultAudio = profile?.audioProfile || (type === "shotgun" ? "shotgun" : (["projectile", "hitscan"].includes(type) ? "standard" : "none"));

        return {
            itemId: item.id,
            name: item.name || `Item ${item.id}`,
            equipSwitch,
            profileId: profile?.id || "",
            profileName: profile?.displayName || "",
            calibrationId: actorWeaponCal
                ? `actor:${actorId}:${profile?.id || ""}`
                : (firingCalibration?.id || profileKey(explicitCalibrationId)),
            aimSpec: actorWeaponCal?.aimSpec || firingCalibration?.aimSpec || null,
            family,
            type,
            damage: Math.max(0, num(raw, "damage", 10)),
            speed: Math.max(0.01, num(raw, "speed", 45)),
            range: Math.max(0.01, num(raw, "range", type === "melee" ? 1.25 : 35)),
            radius: Math.max(0.001, num(raw, "radius", 0.015)),
            cooldown: Math.max(1, int(raw, "cooldown", defaultCooldown)),
            spreadRadians: Math.max(0, num(raw, "spread", type === "shotgun" ? 14 : 0)) * DEG,
            pellets: Math.max(1, int(raw, "pellets", type === "shotgun" ? 8 : 1)),
            tracerColor: str(raw, "tracerColor", profile?.tracerColor || "#ffcf70"),
            tracerLife: Math.max(0, num(raw, "tracerLife", 0.08)),
            muzzleForward: Math.max(0, num(raw, "muzzleForward", num(raw, "muzzleOffset", profile?.muzzleForward ?? 0.20))),
            muzzleSpec,
            penetration: Math.max(0, num(raw, "penetration", 0)),
            // v0.6.0: Item-based ammunition. `ammoPerShot` is the documented
            // name; legacy `ammoCost` remains accepted as an alias.
            ammoItem: Math.max(0, int(raw, "ammoItem", 0)),
            ammoCost: Math.max(0, int(raw, "ammoPerShot", int(raw, "ammoCost", 1))),
            emptySound: str(raw, "emptySound", CFG.defaultEmptySound),
            fireMode,
            fireRate: Math.max(1, int(raw, "fireRate", int(raw, "cooldown", defaultCooldown))),
            burstCount: Math.max(1, int(raw, "burstCount", 3)),
            burstDelay: Math.max(1, int(raw, "burstDelay", 4)),
            arcRadians: clamp(num(raw, "arc", 75), 1, 360) * DEG,
            maxTargets: Math.max(1, int(raw, "maxTargets", 1)),
            sound: str(raw, "sound", profile?.sound || ""),
            volume: clamp(int(raw, "volume", 90), 0, 100),
            pitch: clamp(int(raw, "pitch", 100), 50, 150),
            audioProfile: str(raw, "audio", defaultAudio).toLowerCase(),
            audioVolume: clamp(num(raw, "audioVolume", 1.0), 0, 4),
        };
    }

    function parseCombatEvent(eventData) {
        const opts = parseTagOptions(eventData?.note || "", "PhanicomABS");
        if (opts === null) return null;

        const requestedProfile = str(opts, "profile", "");
        const profile = requestedProfile
            ? ENEMY_COMBAT_PROFILES.get(profileKey(requestedProfile)) || null
            : null;
        const explicitCalibrationId = str(opts, "calibration", profile?.calibrationId || "");
        const firingCalibration = enemyFiringCalibration(profile?.id || requestedProfile, explicitCalibrationId);

        const deathRaw = str(opts, "deathSwitch", CFG.defaultDeathSwitch);
        const deathSwitch = /^(A|B|C|D)$/i.test(deathRaw) ? deathRaw.toUpperCase() : "None";
        const attack = str(opts, "attack", profile?.attack || "none").toLowerCase();

        const hasEnemyMuzzle = opts.enemyMuzzle !== undefined && opts.enemyMuzzle !== null && String(opts.enemyMuzzle).trim() !== "";
        const hasLegacyMuzzle = opts.muzzle !== undefined && opts.muzzle !== null && String(opts.muzzle).trim() !== "";
        const muzzleSpec = hasEnemyMuzzle
            ? parseMuzzleSpec(String(opts.enemyMuzzle))
            : (hasLegacyMuzzle
                ? parseMuzzleSpec(String(opts.muzzle))
                : (firingCalibration?.muzzleSpec
                    || profile?.muzzleSpec
                    || parseMuzzleSpec("0,0")));

        const localAimSpec = { byDirection: {} };
        let hasLocalAimAngle = false;
        for (const dir of [2,4,6,8,1,3,9,7]) {
            const key = `aimAngle${dir}`;
            if (opts[key] !== undefined) {
                const value = Number(opts[key]);
                if (Number.isFinite(value)) {
                    localAimSpec.byDirection[dir] = angleDegreesToVector(value);
                    hasLocalAimAngle = true;
                }
            }
        }
        const resolvedAimSpec = hasLocalAimAngle
            ? localAimSpec
            : (profile?.aimSpec || firingCalibration?.aimSpec || null);

        return {
            profileId: profile?.id || profileKey(requestedProfile),
            profileName: profile?.displayName || "",
            calibrationId: profile?.id || firingCalibration?.id || profileKey(explicitCalibrationId),
            aimSpec: resolvedAimSpec,
            maxHp: Math.max(1, num(opts, "hp", profile?.maxHp ?? CFG.defaultEnemyHp)),
            hitRadius: Math.max(0.05, num(opts, "hitRadius", CFG.defaultHitRadius)),
            alpha: clamp(int(opts, "alpha", CFG.combatantAlphaThreshold), 1, 255),
            deathSwitch,
            attack: ["projectile", "hitscan", "shotgun", "melee"].includes(attack) ? attack : "none",
            damage: Math.max(0, num(opts, "damage", profile?.damage ?? 8)),
            range: Math.max(0.1, num(opts, "range", profile?.range ?? (attack === "melee" ? 1.2 : 18))),
            fireRate: Math.max(1, int(opts, "fireRate", profile?.fireRate ?? 60)),
            speed: Math.max(0.01, num(opts, "speed", profile?.speed ?? 38)),
            radius: Math.max(0.001, num(opts, "radius", profile?.radius ?? 0.015)),
            spreadRadians: Math.max(0, num(opts, "spread", profile?.spreadDegrees ?? (attack === "shotgun" ? 18 : 1.5))) * DEG,
            pellets: Math.max(1, int(opts, "pellets", profile?.pellets ?? (attack === "shotgun" ? 8 : 1))),
            tracerColor: str(opts, "tracerColor", profile?.tracerColor || "#ff8a5b"),
            tracerLife: Math.max(0, num(opts, "tracerLife", profile?.tracerLife ?? 0.08)),
            muzzleForward: Math.max(0, num(opts, "muzzleForward", profile?.muzzleForward ?? 0.20)),
            muzzleSpec,
            penetration: Math.max(0, num(opts, "penetration", 0)),
            audioProfile: str(opts, "audio", profile?.audioProfile || (attack === "shotgun" ? "shotgun" : (["projectile", "hitscan"].includes(attack) ? "standard" : "none"))).toLowerCase(),
            audioVolume: clamp(num(opts, "audioVolume", profile?.audioVolume ?? 1.0), 0, 4),
            killWeapon: str(opts, "killWeapon", ""),
            killWeaponName: str(opts, "killWeaponName", ""),
            bloodColor: str(opts, "blood", profile?.bloodColor || CFG.defaultBloodColor),
            bloodAmount: Math.max(0, Math.min(64, int(opts, "bloodAmount", profile?.bloodAmount ?? CFG.defaultBloodDroplets))),
            gib: opts.gib !== undefined
                ? /^(true|1|yes|on)$/i.test(str(opts, "gib", "false"))
                : !!profile?.gib,
            gibThreshold: Math.max(0, num(opts, "gibThreshold", profile?.gibThreshold ?? CFG.defaultGibThreshold)),
            gibBloodBurst: Math.max(0, Math.min(128, int(opts, "gibBloodBurst", CFG.gibBloodBurst))),
            gibBleedChance: clamp(num(opts, "gibBleedChance", CFG.gibBleedChance), 0, 1),
            gibBleedFrames: Math.max(0, Math.min(120, int(opts, "gibBleedFrames", CFG.gibBleedFrames))),
        };
    }

    function parseCoverEvent(eventData) {
        const opts = parseTagOptions(eventData?.note || "", "PhanicomCover");
        if (opts === null) return null;
        const material = str(opts, "material", "generic").toLowerCase();
        const materialCosts = { glass: 0.40, wood: 1.00, generic: 1.00, metal: 3.00 };
        return {
            material,
            alpha: clamp(int(opts, "alpha", CFG.coverAlphaThreshold), 1, 255),
            penetrationCost: Math.max(0.01, num(opts, "penetrationCost", materialCosts[material] ?? 1.0)),
        };
    }

    // ---------------------------------------------------------------------
    // Runtime
    // ---------------------------------------------------------------------
    const Runtime = {
        projectiles: [], tracers: [], muzzleFlashes: [], impacts: [],
        bloodParticles: [], bloodDecals: [], gibs: [],
        cooldown: 0, serial: 0, mapId: 0,
        playerBurstRemaining: 0,
        playerBurstTimer: 0,
        playerBurstWeaponId: 0,
        lastAttackResult: "Waiting for attack input",
        lastInputSeen: "none",
        lastEnemyResult: "none",
        enemyAiSummary: "none",
        lastResolvedDirection: 2,
        lastAimSource: "fallback",
        lastGibDebug: "none",
    };

    function resetRuntimeForMap() {
        clearPlayerDeathVisual();
        Runtime.projectiles.length = 0;
        Runtime.tracers.length = 0;
        Runtime.muzzleFlashes.length = 0;
        Runtime.impacts.length = 0;
        Runtime.bloodParticles.length = 0;
        Runtime.bloodDecals.length = 0;
        for (const gib of Runtime.gibs) destroyGibEffect(gib);
        Runtime.gibs.length = 0;
        Runtime.cooldown = 0;
        Runtime.playerBurstRemaining = 0;
        Runtime.playerBurstTimer = 0;
        Runtime.playerBurstWeaponId = 0;
        Runtime.mapId = $gameMap?.mapId?.() || 0;
        Runtime.lastAttackResult = "Map initialized";
        Runtime.lastEnemyResult = "none";
        Runtime.enemyAiSummary = "none";
        Runtime.lastResolvedDirection = 2;
        Runtime.lastAimSource = "fallback";
        Runtime.lastGibDebug = "none";
        CombatAim.keys.clear();
        CombatAim.lastDir8 = 2;
        CombatAim.lastSource = "fallback";
    }

    // ---------------------------------------------------------------------
    // Event combat state
    // ---------------------------------------------------------------------
    function ensureEventState(event) {
        if (!event || !event.event) return null;
        const eventData = event.event();
        const cfg = parseCombatEvent(eventData);
        if (!cfg) return null;
        const noteText = String(eventData?.note || "");
        if (!event._phanicomABSState) {
            event._phanicomABSState = {
                hp: cfg.maxHp, maxHp: cfg.maxHp, hitRadius: cfg.hitRadius,
                deathSwitch: cfg.deathSwitch, dead: false,
                attackCfg: cfg,
                cooldown: Math.floor(Math.random() * Math.max(1, cfg.fireRate)),
                noteCache: noteText,
            };
            log("Initialized ABS event", event.eventId(), event._phanicomABSState);
        } else if (event._phanicomABSState.noteCache !== noteText) {
            // Refresh edited inline note settings without reconstructing combat.
            const state = event._phanicomABSState;
            state.maxHp = cfg.maxHp;
            state.hp = Math.min(state.hp, state.maxHp);
            state.hitRadius = cfg.hitRadius;
            state.deathSwitch = cfg.deathSwitch;
            state.attackCfg = cfg;
            state.noteCache = noteText;
            log("Refreshed ABS event note config", event.eventId(), cfg);
        }
        return event._phanicomABSState;
    }

    function combatEvents() {
        if (!$gameMap) return [];
        return $gameMap.events().filter(e => {
            const s = ensureEventState(e);
            return !!s && !s.dead && !e.isErased?.();
        });
    }

    function coverEvents() {
        if (!$gameMap) return [];
        return $gameMap.events().filter(e => !e.isErased?.() && parseCoverEvent(e.event()));
    }

    // v0.5.0 death routing.  Corpse presentation belongs to the event pages:
    //   - ordinary death uses Self Switch A
    //   - a death that ACTUALLY created gib fragments uses Self Switch B
    //
    // Both switches are written every time so stale state can never leave A and
    // B active together.  This also remains compatible with the existing
    // ResetTaggedSelfSwitches plugin, which clears A/B when the event respawns.
    function activateDeathRoute(event, gibSucceeded) {
        if (!event || !$gameMap) return;
        const keyBase = [$gameMap.mapId(), event.eventId()];
        $gameSelfSwitches.setValue([...keyBase, "A"], !gibSucceeded);
        $gameSelfSwitches.setValue([...keyBase, "B"], !!gibSucceeded);
    }

    function spawnImpact(x, y, kind = "hit", visualOffset = { x: 0, y: 0 }, blood = null) {
        Runtime.impacts.push({ x, y, kind, blood, visualOffset: { ...visualOffset }, life: 0.16, maxLife: 0.16 });
        if (Runtime.impacts.length > 128) Runtime.impacts.shift();
    }

    function randomRange(min, max) { return min + Math.random() * (max - min); }

    function spawnBloodBurst(x, y, visualOffset, direction, color, amount, scale = 1) {
        if (!CFG.bloodEffects) return;
        const blood = bloodDefinition(color);
        if (!blood.enabled || Number(amount) === 0) return;
        if (blood.profile === 'cream' && window.PhanicomBlood) {
            window.PhanicomBlood.sprayPixels((x+.5)*$gameMap.tileWidth()+(visualOffset?.x||0),
                (y+.5)*$gameMap.tileHeight()+(visualOffset?.y||0),
                {blood:'cream',color:blood.color,count:Math.max(0,Math.round((amount??CFG.defaultBloodDroplets)*scale)),spraySize:Math.max(.01,scale)});
            return;
        }
        color = blood.color;
        const d = direction || { x: 0, y: 1 };
        const count = Math.max(0, Math.round((Number(amount) || CFG.defaultBloodDroplets) * scale));
        const baseAngle = Math.atan2(d.y, d.x);
        for (let n = 0; n < count; n++) {
            const angle = baseAngle + Math.PI + randomRange(-1.15, 1.15);
            const speed = randomRange(45, 150) * Math.max(0.5, scale);
            Runtime.bloodParticles.push({
                x, y, visualOffset: { ...(visualOffset || { x: 0, y: 0 }) },
                ox: 0, oy: 0,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - randomRange(15, 70),
                gravity: randomRange(150, 260),
                radius: randomRange(1.3, 3.8) * Math.min(1.6, Math.max(0.65, scale)),
                color: color || CFG.defaultBloodColor,
                life: randomRange(0.32, 0.72), maxLife: 0.72,
                settled: false,
            });
        }
        if (Runtime.bloodParticles.length > 320) Runtime.bloodParticles.splice(0, Runtime.bloodParticles.length - 320);
    }

    function addBloodDecal(p) {
        if (!CFG.persistentBlood || CFG.maxBloodDecals <= 0) return;
        Runtime.bloodDecals.push({
            x: p.x, y: p.y, visualOffset: { ...(p.visualOffset || { x: 0, y: 0 }) },
            ox: p.ox, oy: p.oy, radius: p.radius * randomRange(1.1, 2.2),
            color: p.color, alpha: randomRange(0.30, 0.58),
        });
        while (Runtime.bloodDecals.length > CFG.maxBloodDecals) Runtime.bloodDecals.shift();
    }

    // v0.4.8: emit one blood droplet from a moving gib fragment while
    // keeping the droplet in the existing ground-gore system.  The fragment
    // lives in PIXI/screen coordinates, so we convert its current global screen
    // point into a stable visual offset anchored to the dead event's map point.
    function spawnGibTrailDroplet(effect, item) {
        if (!CFG.bloodEffects || !effect?.event || !item?.sprite || item.sprite.destroyed) return;
        const blood = bloodDefinition(effect.bloodColor);
        if (!blood.enabled) return;
        const event = effect.event;
        const baseX = event._realX ?? event.x ?? 0;
        const baseY = event._realY ?? event.y ?? 0;
        // v0.6.5: toGlobal() walks PIXI's parent transform chain. During a
        // Scene_Map -> menu transition that chain can briefly be detached,
        // which previously produced `Cannot read property 'position' of null`.
        // Never ask PIXI for a global transform unless the fragment is still
        // attached to a live display parent.
        if (!item.sprite.parent || !effect.container?.parent) return;
        let global = null;
        try {
            global = item.sprite.toGlobal
                ? item.sprite.toGlobal(new PIXI.Point(0, 0))
                : null;
        } catch (_) {
            return;
        }
        if (!global) return;
        if (blood.profile === 'cream' && window.PhanicomBlood) {
            window.PhanicomBlood.sprayPixels(global.x+$gameMap.displayX()*$gameMap.tileWidth(),
                global.y+$gameMap.displayY()*$gameMap.tileHeight(),{blood:'cream',color:blood.color,count:1});
            return;
        }
        const baseScreen = worldToScreen(baseX, baseY, { x: 0, y: 0 });
        const visualOffset = { x: global.x - baseScreen.x, y: global.y - baseScreen.y };

        Runtime.bloodParticles.push({
            x: baseX,
            y: baseY,
            visualOffset,
            ox: 0,
            oy: 0,
            vx: item.vx * 0.28 + randomRange(-35, 35),
            vy: item.vy * 0.24 - randomRange(8, 42),
            gravity: randomRange(165, 275),
            radius: randomRange(1.0, 2.6),
            color: blood.color,
            life: randomRange(0.24, 0.52),
            maxLife: 0.52,
            settled: false,
        });
        if (Runtime.bloodParticles.length > 320) {
            Runtime.bloodParticles.splice(0, Runtime.bloodParticles.length - 320);
        }
    }

    /* ---------------------------------------------------------------------
     * v0.4.6 PIXI gib/death-fragment subsystem + v0.4.8 blood integration
     * ---------------------------------------------------------------------
     * IMPORTANT FREEZE RULE:
     * This subsystem is intentionally isolated from projectile physics, enemy
     * AI, blood, cover, weapon resolution and 8-direction aiming. v0.4.6
     * changes ONLY how opt-in body fragments are captured, rendered and
     * updated on death.
     *
     * The implementation follows the proven architecture used by Phanicom's
     * FragmentDeath_Pixi_v1_0 plugin:
     *   1. Find the live Sprite_Character for THIS event.
     *   2. Read sprite.texture.frame -- the exact frame currently visible.
     *   3. Create sub-textures directly from sprite.texture.baseTexture.
     *   4. Put a temporary fragment container in the sprite's OWN parent.
     *   5. Position every fragment relative to the sprite's anchor.
     *   6. Hide the source sprite for the current frame, then allow the normal
     *      Self Switch death flow to continue immediately afterward.
     *
     * This avoids the Bitmap.blt()/map-coordinate path used by earlier ABS
     * revisions, which was the source of the non-rendering gib failures.
     * ------------------------------------------------------------------ */

    function destroyGibEffect(effect) {
        if (!effect) return;
        try {
            for (const item of effect.fragments || []) {
                if (item.texture) item.texture.destroy(false);
                if (item.sprite && !item.sprite.destroyed) item.sprite.destroy();
            }
            if (effect.container?.parent) effect.container.parent.removeChild(effect.container);
            if (effect.container && !effect.container.destroyed) {
                effect.container.destroy({ children: false });
            }
        } catch (_) {}
    }

    function cloneLiveSpriteFrame(sprite) {
        if (!sprite?.texture?.baseTexture) return null;
        let frame = sprite.texture.frame;
        if (frame?.width === 0 && sprite._bushDepth > 0 && sprite._upperBody?._frame?.width > 0) {
            frame = {x:sprite._frame.x,y:sprite._frame.y,width:sprite._upperBody._frame.width,height:sprite._frame.height};
        }
        if (!frame || frame.width <= 0 || frame.height <= 0) return null;
        return {
            baseTexture: sprite.texture.baseTexture,
            x: frame.x,
            y: frame.y,
            width: frame.width,
            height: frame.height,
        };
    }

    function createLiveFragmentTexture(frame, sx, sy, sw, sh) {
        const rect = new PIXI.Rectangle(frame.x + sx, frame.y + sy, sw, sh);
        return new PIXI.Texture(frame.baseTexture, rect);
    }

    function copySpriteVisualState(from, to) {
        to.alpha = from.alpha;
        to.rotation = from.rotation;
        if (from.scale && to.scale) to.scale.set(from.scale.x, from.scale.y);
        if (from.skew && to.skew) to.skew.set(from.skew.x, from.skew.y);
        to.z = from.z;
        to.zIndex = from.zIndex ?? from.z;
        to.spriteId = from.spriteId || 0;
        to.blendMode = from.blendMode;
    }

    function spawnSpriteGibs(event, bloodColor, direction, killDamage = 0, threshold = 0) {
        const debugPrefix = `enabled=${!!CFG.gibEffects} damage=${killDamage} threshold=${threshold}`;
        if (!CFG.gibEffects || CFG.maxGibFragments <= 0) {
            Runtime.lastGibDebug = `${debugPrefix} | BLOCKED: global gib setting`;
            return 0;
        }

        const source = spriteForCharacter(event);
        if (!source) {
            Runtime.lastGibDebug = `${debugPrefix} | BLOCKED: live Sprite_Character not found`;
            return 0;
        }
        if (!source.parent) {
            Runtime.lastGibDebug = `${debugPrefix} | BLOCKED: source sprite has no parent`;
            return 0;
        }

        const frame = cloneLiveSpriteFrame(source);
        if (!frame) {
            Runtime.lastGibDebug = `${debugPrefix} | BLOCKED: current PIXI texture frame unavailable`;
            return 0;
        }

        // 5x8 = 40 possible chunks, staying under the default global cap of 48
        // while producing a visibly fragmented body for tall rendered sprites.
        const cols = 5;
        const rows = 8;
        const maxPieces = Math.max(1, CFG.maxGibFragments);
        const fragments = [];
        const container = new PIXI.Container();

        // The fragment container occupies exactly the original sprite's local
        // coordinate system. This is the key reliability improvement over the
        // old worldToScreen-based gib renderer.
        container.x = source.x;
        container.y = source.y;
        copySpriteVisualState(source, container);

        const anchorX = source.anchor ? source.anchor.x : 0;
        const anchorY = source.anchor ? source.anchor.y : 0;
        const left = -frame.width * anchorX;
        const top = -frame.height * anchorY;
        const dir = direction || { x: 0, y: 1 };

        let created = 0;
        for (let row = 0; row < rows && created < maxPieces; row++) {
            const sy0 = Math.floor(row * frame.height / rows);
            const sy1 = Math.floor((row + 1) * frame.height / rows);
            const sh = sy1 - sy0;
            if (sh <= 0) continue;

            for (let col = 0; col < cols && created < maxPieces; col++) {
                const sx0 = Math.floor(col * frame.width / cols);
                const sx1 = Math.floor((col + 1) * frame.width / cols);
                const sw = sx1 - sx0;
                if (sw <= 0) continue;

                try {
                    const texture = createLiveFragmentTexture(frame, sx0, sy0, sw, sh);
                    const frag = new PIXI.Sprite(texture);
                    frag.anchor.set(0.5, 0.5);
                    frag.alpha = 1;
                    frag.tint = source.tint !== undefined ? source.tint : 0xFFFFFF;
                    frag.blendMode = source.blendMode;

                    const localX = left + sx0 + sw / 2;
                    const localY = top + sy0 + sh / 2;
                    frag.x = localX;
                    frag.y = localY;

                    // Outward scatter is derived from the chunk's position in
                    // the body, with an additional push from the killing shot.
                    const nx = frame.width > 0 ? ((sx0 + sw / 2) / frame.width - 0.5) * 2 : 0;
                    const ny = frame.height > 0 ? ((sy0 + sh / 2) / frame.height - 0.5) * 2 : 0;
                    const vx = nx * randomRange(45, 95) + dir.x * randomRange(45, 125) + randomRange(-55, 55);
                    const vy = ny * randomRange(10, 38) + dir.y * randomRange(10, 45) - randomRange(85, 190);
                    const vr = randomRange(-4.8, 4.8);

                    container.addChild(frag);
                    fragments.push({
                        sprite: frag, texture, x: localX, y: localY, vx, vy, vr,
                        bleeds: false, bleedEmissions: 0
                    });
                    created++;
                } catch (e) {
                    log('PIXI gib fragment creation failed', e);
                }
            }
        }

        if (created <= 0) {
            destroyGibEffect({ container, fragments });
            Runtime.lastGibDebug = `${debugPrefix} | BLOCKED: 0 PIXI fragments created`;
            return 0;
        }

        // Insert beside the live character sprite, exactly as the proven
        // standalone FragmentDeath plugin does. This keeps rendering in the
        // character display hierarchy without touching the ABS blood layers.
        const parent = source.parent;
        const index = parent.getChildIndex(source);
        parent.addChildAt(container, Math.min(index + 1, parent.children.length));

        // Hide only the live source sprite that supplied the captured frame.
        // v0.5.0 decides the death page immediately after this function returns:
        // successful fragment creation routes to B; otherwise normal death routes A.
        source.visible = false;

        // v0.4.8 gore integration.  Fragment rendering itself remains the
        // proven v0.4.6/v0.4.7 live-PIXI implementation; only blood emission is
        // attached here.  Per-enemy values are already merged by the v0.4.7
        // parser and are supplied through the live death configuration.
        const liveCfg = event === $gamePlayer ? { gibBloodBurst: DEATH.bloodCount } : (parseCombatEvent(event.event()) || {});
        const burstCount = Math.max(0, Number(liveCfg.gibBloodBurst ?? CFG.gibBloodBurst));
        const bleedChance = clamp(Number(liveCfg.gibBleedChance ?? CFG.gibBleedChance), 0, 1);
        const bleedFrames = Math.max(0, Number(liveCfg.gibBleedFrames ?? CFG.gibBleedFrames));

        for (const item of fragments) {
            item.bleeds = Math.random() < bleedChance;
            item.bleedEmissions = 0;
        }

        // v0.5.1 CAMERA-LOCK: capture the death point in map/world coordinates.
        // The fragment container still begins at the exact live sprite screen
        // position, but every update re-projects this fixed map point through
        // $gameMap.adjustX/adjustY. This keeps the gibs physically attached to
        // the place where the enemy died while the camera/player scrolls.
        const deathMapX = Number(event._realX ?? event.x ?? 0);
        const deathMapY = Number(event._realY ?? event.y ?? 0);
        const tw = $gameMap.tileWidth();
        const th = $gameMap.tileHeight();
        const baseScreenX = Math.round($gameMap.adjustX(deathMapX) * tw + tw / 2);
        const baseScreenY = Math.round($gameMap.adjustY(deathMapY) * th + th);
        const sourceScreenOffsetX = container.x - baseScreenX;
        const sourceScreenOffsetY = container.y - baseScreenY;

        const effect = {
            mapId: $gameMap.mapId(),
            eventId: event.eventId?.() || 0,
            isPlayer: event === $gamePlayer,
            event,
            container,
            fragments,
            age: 0,
            frameAge: 0,
            duration: randomRange(1.8, 2.8),
            gravity: randomRange(145, 220),
            fadeStart: 0.42,
            bloodColor: bloodColor || CFG.defaultBloodColor,
            bleedFrames,
            bleedChance,
            deathMapX,
            deathMapY,
            sourceScreenOffsetX,
            sourceScreenOffsetY,
        };
        Runtime.gibs.push(effect);

        // Keep the number of simultaneous death effects bounded. The existing
        // MaxGibFragments parameter still limits chunks within each explosion;
        // this additional effect cap prevents abandoned containers piling up.
        while (Runtime.gibs.length > 8) destroyGibEffect(Runtime.gibs.shift());

        // Initial rupture spray at the instant the body fractures.  This uses
        // the normal blood particle/decal system, so color, layering and ground
        // stains remain identical to ordinary projectile impacts.
        spawnBloodBurst(
            event._realX ?? event.x,
            event._realY ?? event.y,
            { x: 0, y: -Math.max(20, frame.height * 0.45) },
            direction,
            effect.bloodColor,
            burstCount,
            1.0
        );

        Runtime.lastGibDebug = `${debugPrefix} | TRIGGERED PIXI frame=${Math.round(frame.width)}x${Math.round(frame.height)} fragments=${created} burst=${burstCount} bleed=${bleedChance}`;
        return created;
    }

    // v0.6.5 MENU/SCENE SAFETY
    // Scene_Map is destroyed/rebuilt when a menu scene is pushed. Gib
    // containers are transient PIXI children of the map display tree, so they
    // must be detached BEFORE the old spriteset is torn down. We keep the
    // container, fragment textures and physics state alive in Runtime.gibs,
    // freeze simulation while no map scene is active, and reattach to the new
    // character/tilemap parent after returning.
    function suspendGibEffectsForSceneChange() {
        for (const effect of Runtime.gibs) {
            if (!effect?.container || effect.container.destroyed) continue;
            try {
                if (effect.container.parent) {
                    effect.container.parent.removeChild(effect.container);
                }
                effect.suspended = true;
            } catch (_) {
                effect.suspended = true;
            }
        }
    }

    function resumeGibEffectIfNeeded(effect) {
        if (!effect?.container || effect.container.destroyed) return false;
        if (effect.container.parent) {
            effect.suspended = false;
            return true;
        }

        // Reuse the current event's Sprite_Character only to locate the live
        // map display parent. The fragment visuals themselves remain the exact
        // textures captured at the moment of death.
        const liveEvent = effect.isPlayer ? $gamePlayer : ($gameMap?.event?.(effect.eventId) || effect.event);
        if (!liveEvent) return false;
        effect.event = liveEvent;

        const source = spriteForCharacter(liveEvent);
        const parent = source?.parent;
        if (!parent || parent.destroyed) return false;

        try {
            let index = parent.children?.length ?? 0;
            if (source && parent.getChildIndex) {
                const sourceIndex = parent.getChildIndex(source);
                if (sourceIndex >= 0) index = Math.min(sourceIndex + 1, parent.children.length);
            }
            parent.addChildAt(effect.container, index);
            effect.suspended = false;
            return true;
        } catch (_) {
            return false;
        }
    }

    function updateGibEffects(dt) {
        // Never advance PIXI fragment physics in menu/title/battle scenes.
        // This is intentionally a true freeze: age, fade, gravity and blood
        // trail counters all resume from the same values on return.
        if (!(SceneManager._scene instanceof Scene_Map)) return;
        if (!SceneManager._scene?._spriteset || SceneManager.isSceneChanging()) return;

        for (const effect of Runtime.gibs) {
            if (!effect) continue;
            if (!$gameMap || effect.mapId !== $gameMap.mapId()) {
                effect.age = effect.duration;
                continue;
            }

            // A map scene rebuilt after a pushed menu has a new PIXI tree.
            // Reattach the preserved gib container before touching positions.
            if (!resumeGibEffectIfNeeded(effect)) {
                // If the new map display tree is not ready yet, keep the
                // effect frozen instead of destroying it or dereferencing null.
                continue;
            }

            effect.age += dt;
            effect.frameAge = (effect.frameAge || 0) + 1;

            // v0.5.1 CAMERA-LOCK: the gib physics remain local to the
            // fragment container, but the container itself is anchored to the
            // fixed map coordinate captured at death. Using adjustX/adjustY
            // makes this follow normal RPG Maker map scrolling and looping
            // behavior without following the player or the dead event page.
            if (effect.container && !effect.container.destroyed) {
                const tw = $gameMap.tileWidth();
                const th = $gameMap.tileHeight();
                const anchorX = Math.round($gameMap.adjustX(effect.deathMapX) * tw + tw / 2);
                const anchorY = Math.round($gameMap.adjustY(effect.deathMapY) * th + th);
                effect.container.x = anchorX + (effect.sourceScreenOffsetX || 0);
                effect.container.y = anchorY + (effect.sourceScreenOffsetY || 0);
            }

            const progress = clamp(effect.age / Math.max(EPS, effect.duration), 0, 1);
            const fade = progress <= effect.fadeStart
                ? 0
                : clamp((progress - effect.fadeStart) / Math.max(EPS, 1 - effect.fadeStart), 0, 1);

            for (const item of effect.fragments) {
                const frag = item.sprite;
                if (!frag || frag.destroyed) continue;
                item.vy += effect.gravity * dt;
                item.x += item.vx * dt;
                item.y += item.vy * dt;
                frag.x = item.x;
                frag.y = item.y;
                frag.rotation += item.vr * dt;
                frag.alpha = Math.max(0, 1 - fade);

                // Selected fragments leave only a short, sparse blood trail.
                // Emission is limited to the configured opening frames and one
                // droplet every three frames, avoiding a particle storm while
                // still making the fracture visibly spray as chunks separate.
                if (item.bleeds && effect.frameAge <= effect.bleedFrames &&
                    effect.frameAge % 3 === 0 && item.bleedEmissions < 4) {
                    spawnGibTrailDroplet(effect, item);
                    item.bleedEmissions++;
                }
            }
        }

        for (const effect of Runtime.gibs.filter(g => !g || g.age >= g.duration)) {
            destroyGibEffect(effect);
        }
        Runtime.gibs = Runtime.gibs.filter(g => g && g.age < g.duration);
    }

    function applyDamageToEvent(event, amount, shot = null) {
        const state = ensureEventState(event);
        if (!state || state.dead) return false;
        const dealt = Math.max(0, Number(amount) || 0);
        if (dealt <= 0) return false;
        state.hp = Math.max(0, state.hp - dealt);
        event._phanicomABSFlashFrames = 8;
        event._phanicomABSLastHitDirection = shot?.direction ? { ...shot.direction } : null;
        // Put the blood/impact at the actual projectile contact point when one is
        // available. With tall pixel-masked sprites this prevents hit FX from
        // collapsing back to the event's feet/base position.
        const impactX = shot?.position?.x ?? event._realX ?? event.x;
        const impactY = shot?.position?.y ?? event._realY ?? event.y;
        spawnImpact(impactX, impactY, "blood", shot?.visualOffset || { x: 0, y: 0 }, state.attackCfg?.bloodColor);
        spawnBloodBurst(impactX, impactY, shot?.visualOffset || { x: 0, y: 0 }, shot?.direction,
            state.attackCfg?.bloodColor, state.attackCfg?.bloodAmount, 1);
        log(`Event ${event.eventId()} took ${dealt}. HP ${state.hp}/${state.maxHp}`);
        if (state.hp <= 0) {
            // v0.4.6 PIXI gib path. Re-parse the LIVE event note at the
            // instant of death so stale cached config cannot suppress gibs. During
            // this revision, gib=true ALWAYS attempts the proven live-PIXI-frame
            // fragmentation path before normal death-page switching. gibThreshold
            // remains diagnostic/non-blocking so only the renderer is under test.
            const liveCfg = parseCombatEvent(event.event()) || state.attackCfg || {};
            state.attackCfg = liveCfg;
            const gibEnabled = !!liveCfg.gib;
            const gibThreshold = liveCfg.gibThreshold ?? CFG.defaultGibThreshold;
            let gibFragmentsCreated = 0;
            if (gibEnabled) {
                gibFragmentsCreated = spawnSpriteGibs(
                    event, liveCfg.bloodColor, shot?.direction, dealt, gibThreshold
                );
            } else {
                Runtime.lastGibDebug = `enabled=false damage=${dealt} threshold=${gibThreshold} | BLOCKED: enemy gib flag false/not parsed`;
            }

            // Route from the REAL gib result, not merely from gib=true.  If the
            // renderer could not create fragments for any reason, the event
            // receives the normal corpse route (A) instead of a false gib route.
            const gibSucceeded = gibFragmentsCreated > 0;
            state.dead = true;
            addFrag(shot, event.event()?.name || `Event ${event.eventId()}`);
            activateDeathRoute(event, gibSucceeded);
            log(`Event ${event.eventId()} defeated. Death route=${gibSucceeded ? "B (gib)" : "A (normal)"}. ${Runtime.lastGibDebug}`);
        }
        return true;
    }

    function applyDamageToPlayer(amount, shot = null) {
        const actor = $gameParty?.leader?.();
        if (!actor || actor.isDead?.()) return false;
        const dealt = Math.max(0, Number(amount) || 0);
        if (dealt <= 0) return false;
        const beforeHp = actor.hp;
        actor.gainHp(-dealt);
        actor.onDamage?.(dealt);
        if (actor.isDead()) {
            if (DEATH.enabled) beginPlayerDeath(dealt, beforeHp, shot);
            else addFrag(shot, actor.name());
        }
        $gamePlayer._phanicomABSFlashFrames = 8;
        spawnImpact($gamePlayer._realX ?? $gamePlayer.x, $gamePlayer._realY ?? $gamePlayer.y, "playerHit", shot?.visualOffset || { x: 0, y: 0 }, actorBlood(actor));
        Runtime.lastEnemyResult = `PLAYER HIT ${dealt} | HP ${actor.hp}/${actor.mhp}`;
        log(Runtime.lastEnemyResult);
        return true;
    }

    // ---------------------------------------------------------------------
    // Eight-direction facing bridge
    // ---------------------------------------------------------------------
    // RPG Maker's vanilla direction() only retains 2/4/6/8.  Rather than rely
    // on a private field from any particular diagonal movement plugin, record
    // the direction whenever the engine is actually asked to move diagonally.
    // This makes the ABS compatible with Phanicom_DiagonalMovement and with
    // other MZ movement plugins that ultimately call moveDiagonally().
    function diagonalNumber(horz, vert) {
        if (horz === 4 && vert === 2) return 1;
        if (horz === 6 && vert === 2) return 3;
        if (horz === 4 && vert === 8) return 7;
        if (horz === 6 && vert === 8) return 9;
        return 0;
    }

    function rememberDirection8(character, dir, diagonalLock = false) {
        const d = Number(dir);
        if (![1,2,3,4,6,7,8,9].includes(d) || !character) return;
        character._phanicomABSLastDirection8 = d;
        character._phanicomABSDirectionFrame = Graphics.frameCount || 0;
        if ([1,3,7,9].includes(d) && diagonalLock) {
            character._phanicomABSDiagonalLockUntilFrame = (Graphics.frameCount || 0) + 3;
        }
    }

    const _Game_Player_moveByInput_PhanicomABS = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        const d8 = Number(Input.dir8 || 0);
        if ([1,2,3,4,6,7,8,9].includes(d8)) {
            rememberDirection8(this, d8, [1,3,7,9].includes(d8));
            CombatAim.lastDir8 = d8;
            CombatAim.lastSource = "movement input";
        }
        return _Game_Player_moveByInput_PhanicomABS.call(this);
    };

    if (typeof Game_Player.prototype.executeMove === "function") {
        const _Game_Player_executeMove_PhanicomABS = Game_Player.prototype.executeMove;
        Game_Player.prototype.executeMove = function(direction) {
            const d8 = Number(direction);
            if ([1,2,3,4,6,7,8,9].includes(d8)) rememberDirection8(this, d8, [1,3,7,9].includes(d8));
            return _Game_Player_executeMove_PhanicomABS.call(this, direction);
        };
    }

    const _Game_CharacterBase_moveDiagonally_PhanicomABS = Game_CharacterBase.prototype.moveDiagonally;
    Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
        const d8 = diagonalNumber(Number(horz), Number(vert));
        if (d8) {
            rememberDirection8(this, d8, true);
            if (this === $gamePlayer) {
                CombatAim.lastDir8 = d8;
                CombatAim.lastSource = "moveDiagonally";
            }
        }
        return _Game_CharacterBase_moveDiagonally_PhanicomABS.call(this, horz, vert);
    };

    const _Game_CharacterBase_moveStraight_PhanicomABS = Game_CharacterBase.prototype.moveStraight;
    Game_CharacterBase.prototype.moveStraight = function(d) {
        const n = Number(d);
        const frame = Graphics.frameCount || 0;
        const locked = frame <= Number(this._phanicomABSDiagonalLockUntilFrame || -1);
        const directInput = this === $gamePlayer ? Number(Input.dir8 || 0) : 0;
        if ([2,4,6,8].includes(n) && (!locked || directInput === n)) rememberDirection8(this, n, false);
        return _Game_CharacterBase_moveStraight_PhanicomABS.call(this, d);
    };

    // ---------------------------------------------------------------------
    // Facing and aim
    // ---------------------------------------------------------------------
    function normalize(x, y) {
        const len = hypot(x, y);
        return { x: x / len, y: y / len };
    }

    function directionVector(dir) {
        switch (Number(dir)) {
            case 1: return normalize(-1, 1); case 2: return { x: 0, y: 1 };
            case 3: return normalize(1, 1); case 4: return { x: -1, y: 0 };
            case 6: return { x: 1, y: 0 }; case 7: return normalize(-1, -1);
            case 8: return { x: 0, y: -1 }; case 9: return normalize(1, -1);
            default: return { x: 0, y: 1 };
        }
    }

    // Resolve the player's current aim intent directly from held directional
    // inputs before consulting movement state.  This removes the former delay
    // where diagonal fire only became available after several diagonal steps.
    // Keyboard state is read explicitly so simultaneous orthogonal keys produce
    // a diagonal on the very first attack frame; Input.dir8 remains the gamepad
    // and plugin-friendly fallback.
    function heldKeyboardAimDir8() {
        const left  = CombatAim.keys.has(37) || CombatAim.keys.has(65) || !!Input._currentState?.left;
        const up    = CombatAim.keys.has(38) || CombatAim.keys.has(87) || !!Input._currentState?.up;
        const right = CombatAim.keys.has(39) || CombatAim.keys.has(68) || !!Input._currentState?.right;
        const down  = CombatAim.keys.has(40) || CombatAim.keys.has(83) || !!Input._currentState?.down;
        const hx = (right ? 1 : 0) - (left ? 1 : 0);
        const vy = (down ? 1 : 0) - (up ? 1 : 0);
        if (hx < 0 && vy > 0) return 1; if (hx === 0 && vy > 0) return 2; if (hx > 0 && vy > 0) return 3;
        if (hx < 0 && vy === 0) return 4; if (hx > 0 && vy === 0) return 6;
        if (hx < 0 && vy < 0) return 7; if (hx === 0 && vy < 0) return 8; if (hx > 0 && vy < 0) return 9;
        return 0;
    }

    function heldGamepadAimDir8() {
        try {
            const pads = navigator.getGamepads?.() || [];
            for (const pad of pads) {
                if (!pad || !pad.connected || !pad.axes || pad.axes.length < 2) continue;
                let x = Number(pad.axes[0] || 0), y = Number(pad.axes[1] || 0);
                const dead = 0.28;
                if (Math.abs(x) < dead) x = 0; if (Math.abs(y) < dead) y = 0;
                if (x === 0 && y === 0) continue;
                const ax = Math.abs(x), ay = Math.abs(y);
                if (ax > dead && ay > dead && Math.min(ax, ay) / Math.max(ax, ay) >= 0.40) {
                    if (x < 0 && y > 0) return 1; if (x > 0 && y > 0) return 3;
                    if (x < 0 && y < 0) return 7; if (x > 0 && y < 0) return 9;
                }
                return ax >= ay ? (x < 0 ? 4 : 6) : (y < 0 ? 8 : 2);
            }
        } catch (_) {}
        return 0;
    }

    function resolvePlayerAttackDir8() {
        // v0.4.5 AIM AUTHORITY ORDER:
        // 1) A currently-held keyboard/gamepad direction updates remembered aim immediately.
        // 2) When input is neutral, an @8D_ sprite's persistent visual direction is
        //    authoritative. Phanicom_8DirectionalSprites exposes phanicom8Direction(),
        //    which is exactly the direction the player is visibly facing after movement.
        // 3) Fall back to the ABS remembered direction, then vanilla facing.
        let d8 = heldKeyboardAimDir8();
        let source = d8 ? "held keyboard" : "";
        if (!d8) {
            d8 = heldGamepadAimDir8();
            if (d8) source = "held gamepad";
        }
        if (d8) {
            CombatAim.lastDir8 = d8;
            CombatAim.lastSource = source;
            Runtime.lastAimSource = source;
            rememberDirection8($gamePlayer, d8, [1,3,7,9].includes(d8));
            return d8;
        }

        // Prefer the visual-facing state supplied by Phanicom_8DirectionalSprites.
        try {
            if ($gamePlayer && typeof $gamePlayer.phanicom8Direction === "function") {
                const visual = Number($gamePlayer.phanicom8Direction());
                if ([1,2,3,4,6,7,8,9].includes(visual)) {
                    CombatAim.lastDir8 = visual;
                    Runtime.lastAimSource = "8D visual facing";
                    $gamePlayer._phanicomABSLastDirection8 = visual;
                    return visual;
                }
            }
        } catch (_) {}

        const remembered = Number(CombatAim.lastDir8 || $gamePlayer?._phanicomABSLastDirection8 || 0);
        if ([1,2,3,4,6,7,8,9].includes(remembered)) {
            CombatAim.lastDir8 = remembered;
            Runtime.lastAimSource = "remembered aim";
            return remembered;
        }

        Runtime.lastAimSource = "vanilla facing";
        return Number($gamePlayer?.direction?.() || 2);
    }

    function characterDirection8(character) {
        if (!character) return 2;
        const recorded = Number(character._phanicomABSLastDirection8);
        if ([1,2,3,4,6,7,8,9].includes(recorded)) { Runtime.lastResolvedDirection = recorded; return recorded; }
        try {
            if (typeof character.direction8 === "function") {
                const d = Number(character.direction8());
                if ([1,2,3,4,6,7,8,9].includes(d)) return d;
            }
        } catch (_) {}
        for (const value of [character._direction8, character._diagDirection, character._diagonalDirection, character._phanicomDirection8]) {
            const d = Number(value); if ([1,2,3,4,6,7,8,9].includes(d)) return d;
        }
        const cardinal = Number(character.direction?.() || 2); Runtime.lastResolvedDirection = cardinal; return cardinal;
    }

    function gaussian() {
        let u = 0, v = 0;
        while (!u) u = Math.random();
        while (!v) v = Math.random();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    function applySpread(direction, spreadRadians) {
        if (!(spreadRadians > 0)) return { ...direction };
        const angle = Math.atan2(direction.y, direction.x) + gaussian() * spreadRadians;
        return { x: Math.cos(angle), y: Math.sin(angle) };
    }

    // Shotguns use a bounded cone rather than independent Gaussian shots.  Each
    // pellet gets a small jitter so the pattern reads organically instead of as
    // a perfectly mathematical fan, while always remaining inside the requested
    // full cone angle.
    function shotgunDirections(baseDirection, pellets, coneRadians) {
        const count = Math.max(1, Math.trunc(pellets || 1));
        const base = Math.atan2(baseDirection.y, baseDirection.x);
        const half = Math.max(0, coneRadians || 0) * 0.5;
        if (count === 1 || half <= EPS) return [{ ...baseDirection }];
        const result = [];
        for (let i = 0; i < count; i++) {
            const t = count === 1 ? 0.5 : i / (count - 1);
            const even = -half + t * half * 2;
            const spacing = (half * 2) / Math.max(1, count - 1);
            const jitter = (Math.random() - 0.5) * spacing * 0.45;
            const angle = base + clamp(even + jitter, -half, half);
            result.push({ x: Math.cos(angle), y: Math.sin(angle) });
        }
        return result;
    }

    // ---------------------------------------------------------------------
    // Weapon resolution
    // ---------------------------------------------------------------------
    function parsedWeaponItems() {
        const list = [];
        if (!$dataItems) return list;
        for (let i = 1; i < $dataItems.length; i++) {
            const weapon = parseWeaponItem($dataItems[i]);
            if (weapon) list.push(weapon);
        }
        return list;
    }

    function currentWeapon() {
        if (!$dataItems || !$gameSwitches) return null;
        const active = [];
        for (let i = 1; i < $dataItems.length; i++) {
            const weapon = parseWeaponItem($dataItems[i]);
            if (weapon && $gameSwitches.value(weapon.equipSwitch)) active.push(weapon);
        }
        if (active.length > 1) log("Multiple ABS weapon switches ON; using lowest Item ID.", active);
        return active[0] || null;
    }

    function hasAmmo(weapon) {
        if (!weapon?.ammoItem || weapon.ammoCost <= 0) return true;
        const ammo = $dataItems?.[weapon.ammoItem];
        return !!ammo && $gameParty.numItems(ammo) >= weapon.ammoCost;
    }
    function consumeAmmo(weapon) {
        if (!weapon?.ammoItem || weapon.ammoCost <= 0) return;
        const ammo = $dataItems?.[weapon.ammoItem];
        if (ammo) $gameParty.loseItem(ammo, weapon.ammoCost, false);
    }

    function playDryFireSound(weapon) {
        const name = String(weapon?.emptySound || CFG.defaultEmptySound || "").trim();
        if (name) AudioManager.playSe({ name, volume: 90, pitch: 100, pan: 0 });
    }

    function cancelPlayerBurst() {
        Runtime.playerBurstRemaining = 0;
        Runtime.playerBurstTimer = 0;
        Runtime.playerBurstWeaponId = 0;
    }
    // ---------------------------------------------------------------------
    // GoldenEye-style procedural firearm audio (v0.4.9)
    // ---------------------------------------------------------------------
    // This is intentionally self-contained.  The older Infantry/SovietBlaze
    // stack is NOT required.  The synthesis follows the proven Phanicom
    // GoldenEye audio reference: a short filtered oscillator/sub-oscillator
    // body, mild waveshaping, and compression rather than harsh arcade noise.
    const GoldenEyeAudio = { ctx: null };

    function goldenEyeContext() {
        if (GoldenEyeAudio.ctx) return GoldenEyeAudio.ctx;
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;
            GoldenEyeAudio.ctx = new AC();
            return GoldenEyeAudio.ctx;
        } catch (e) {
            log("GoldenEye audio unavailable", e);
            return null;
        }
    }

    function goldenEyeResume(ctx) {
        if (ctx && ctx.state === "suspended" && typeof ctx.resume === "function") {
            ctx.resume().catch(() => {});
        }
    }

    function goldenEyeDistortionCurve(amount) {
        const samples = 256;
        const curve = new Float32Array(samples);
        const k = Math.max(0, Number(amount) || 0);
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
        }
        return curve;
    }

    function playGoldenEyeWomp(options = {}) {
        if (!CFG.goldenEyeAudio) return;
        const ctx = goldenEyeContext();
        if (!ctx) return;
        goldenEyeResume(ctx);

        const now = ctx.currentTime;
        const duration = clamp(options.duration ?? 0.16, 0.04, 1.2);
        const volumeScale = clamp(options.volumeScale ?? 1.0, 0, 4);
        const volume = clamp((options.volume ?? 0.16) * CFG.goldenEyeStandardVolume * volumeScale, 0.0001, 24.0);
        const startFreq = clamp(options.startFreq ?? 180, 20, 1600);
        const endFreq = clamp(options.endFreq ?? 70, 20, 1600);
        const filterStart = clamp(options.filterStart ?? 900, 80, 6000);
        const filterEnd = clamp(options.filterEnd ?? 260, 60, 6000);
        const attack = clamp(options.attack ?? 0.006, 0.001, duration * 0.35);
        const releaseStart = clamp(options.releaseStart ?? duration * 0.22, attack, duration);

        const osc = ctx.createOscillator();
        const sub = ctx.createOscillator();
        const gain = ctx.createGain();
        const subGain = ctx.createGain();
        const outputGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const compressor = ctx.createDynamicsCompressor();
        const shaper = ctx.createWaveShaper();

        osc.type = options.wave || "sine";
        sub.type = "sine";
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
        sub.frequency.setValueAtTime(Math.max(20, startFreq * 0.5), now);
        sub.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq * 0.5), now + duration);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(filterStart, now);
        filter.frequency.exponentialRampToValueAtTime(filterEnd, now + duration);
        filter.Q.setValueAtTime(options.q ?? 1.3, now);

        shaper.curve = goldenEyeDistortionCurve(options.drive ?? 0.7);
        shaper.oversample = "2x";

        compressor.threshold.setValueAtTime(-12, now);
        compressor.knee.setValueAtTime(18, now);
        compressor.ratio.setValueAtTime(2.5, now);
        compressor.attack.setValueAtTime(0.003, now);
        compressor.release.setValueAtTime(0.09, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + attack);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.45), now + releaseStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        subGain.gain.setValueAtTime(0.0001, now);
        subGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * (options.subMix ?? 0.32)), now + attack);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        outputGain.gain.setValueAtTime(CFG.goldenEyeOutputGain, now);

        osc.connect(shaper);
        shaper.connect(filter);
        filter.connect(gain);
        sub.connect(subGain);
        subGain.connect(gain);
        gain.connect(compressor);
        compressor.connect(outputGain);
        outputGain.connect(ctx.destination);

        osc.start(now);
        sub.start(now);
        osc.stop(now + duration + 0.03);
        sub.stop(now + duration + 0.03);
    }

    function playGoldenEyeProfile(profile, volumeScale = 1.0) {
        const p = String(profile || "standard").toLowerCase();
        if (!CFG.goldenEyeAudio || p === "none" || p === "off") return;

        if (p === "shotgun") {
            playGoldenEyeWomp({ duration: 0.20, startFreq: 155, endFreq: 48, filterStart: 680, filterEnd: 160, volume: 0.46, volumeScale, wave: "triangle", drive: 0.55, subMix: 0.42 });
            setTimeout(() => playGoldenEyeWomp({ duration: 0.12, startFreq: 120, endFreq: 44, filterStart: 520, filterEnd: 140, volume: 0.30, volumeScale, wave: "sine", drive: 0.35, subMix: 0.30 }), 28);
            return;
        }
        if (p === "large") {
            playGoldenEyeWomp({ duration: 0.28, startFreq: 115, endFreq: 36, filterStart: 520, filterEnd: 120, volume: 0.34, volumeScale, wave: "sine", drive: 0.50, subMix: 0.55 });
            return;
        }
        if (p === "plasma") {
            playGoldenEyeWomp({ duration: 0.20, startFreq: 265, endFreq: 88, filterStart: 1120, filterEnd: 260, volume: 0.30, volumeScale, wave: "sine", drive: 0.38, subMix: 0.28 });
            return;
        }
        if (p === "cryo") {
            playGoldenEyeWomp({ duration: 0.24, startFreq: 520, endFreq: 260, filterStart: 1500, filterEnd: 520, volume: 0.20, volumeScale, wave: "sine", drive: 0.18, subMix: 0.08 });
            return;
        }
        if (p === "grape") {
            playGoldenEyeWomp({ duration: 0.22, startFreq: 135, endFreq: 42, filterStart: 560, filterEnd: 130, volume: 0.46, volumeScale, wave: "triangle", drive: 0.42, subMix: 0.45 });
            return;
        }

        // Standard handgun / rifle projectile family.
        playGoldenEyeWomp({ duration: 0.13, startFreq: 210, endFreq: 72, filterStart: 820, filterEnd: 220, volume: 0.34, volumeScale, wave: "triangle", drive: 0.45, subMix: 0.24 });
    }

    function playWeaponSound(weapon) {
        if (!weapon) return;
        // Existing explicit RPG Maker SE remains an opt-in override for player
        // weapons.  If no SE is named, use the integrated procedural profile.
        if (weapon.sound) {
            AudioManager.playSe({ name: weapon.sound, volume: weapon.volume ?? 90, pitch: weapon.pitch ?? 100, pan: 0 });
            return;
        }
        playGoldenEyeProfile(weapon.audioProfile, weapon.audioVolume);
    }

    function playEnemyWeaponSound(cfg) {
        if (!cfg) return;
        playGoldenEyeProfile(cfg.audioProfile, cfg.audioVolume);
    }

    // ---------------------------------------------------------------------
    // Projectile creation
    // ---------------------------------------------------------------------
    function createProjectile(config, direction, source) {
        const d = normalize(direction.x, direction.y);
        const origin = source.position;
        const forward = Math.max(0, Number(config.muzzleForward) || 0);
        const x = origin.x + d.x * forward;
        const y = origin.y + d.y * forward;
        const range = Math.max(0.01, Number(config.range) || 18);
        const speed = Math.max(0.01, Number(config.speed) || 45);
        return {
            credit: shotCredit(config, source),
            id: ++Runtime.serial,
            ownerType: source.ownerType,
            ownerEventId: source.ownerEventId || 0,
            itemId: source.itemId || 0,
            damage: Math.max(0, Number(config.damage) || 0),
            position: { x, y }, previousPosition: { x, y },
            direction: d, velocity: { x: d.x * speed, y: d.y * speed },
            speed, radius: Math.max(0.001, Number(config.radius) || 0.015),
            maxRange: range, lifetime: Math.max(0.1, range / speed + 0.25), age: 0,
            distanceTravelled: 0,
            visual: { color: config.tracerColor || "#ffcf70", life: Math.max(0, Number(config.tracerLife) || 0.08) },
            visualOffset: { ...(source.visualOffset || { x: 0, y: 0 }) },
            penetrationRemaining: Math.max(0, Number(config.penetration) || 0),
        };
    }

    // ---------------------------------------------------------------------
    // Swept collision math
    // ---------------------------------------------------------------------
    function circleSweep(a, b, c, radius) {
        const dx = b.x - a.x, dy = b.y - a.y;
        const mx = a.x - c.x, my = a.y - c.y;
        const aa = dx * dx + dy * dy;
        const cc = mx * mx + my * my - radius * radius;
        if (cc <= EPS) return 0;
        if (aa < EPS) return null;
        const bb = mx * dx + my * dy;
        const disc = bb * bb - aa * cc;
        if (disc < 0) return null;
        const t = (-bb - Math.sqrt(disc)) / aa;
        return t >= -EPS && t <= 1 + EPS ? clamp(t, 0, 1) : null;
    }

    // Sweep the projectile's VISUAL path through one ABS event's current sprite
    // frame. This is the same alpha-mask principle used by <PhanicomCover>, but
    // the result damages the event instead of blocking as environmental cover.
    function sweepOneCombatantSprite(shot, event, state, a, b) {
        const sprite = spriteForCharacter(event);
        const mask = sprite ? frameMaskForSprite(sprite) : null;
        if (!sprite || !mask || !sprite.visible || sprite.opacity <= 0) return null;

        const sa = worldToScreen(a.x, a.y, shot.visualOffset);
        const sb = worldToScreen(b.x, b.y, shot.visualOffset);
        const bounds = sprite.getBounds?.();
        if (bounds) {
            const minX = Math.min(sa.x, sb.x), maxX = Math.max(sa.x, sb.x);
            const minY = Math.min(sa.y, sb.y), maxY = Math.max(sa.y, sb.y);
            if (maxX < bounds.x || minX > bounds.x + bounds.width ||
                maxY < bounds.y || minY > bounds.y + bounds.height) return null;
        }

        const dx = sb.x - sa.x, dy = sb.y - sa.y;
        const pixels = Math.max(1, Math.ceil(Math.hypot(dx, dy)));
        const alphaThreshold = state.attackCfg?.alpha ?? CFG.combatantAlphaThreshold;
        for (let i = 0; i <= pixels; i++) {
            const t = i / pixels;
            const x = sa.x + dx * t, y = sa.y + dy * t;
            if (spriteAlphaAtScreen(event, x, y) >= alphaThreshold) {
                return { t, event, kind: "event", pixelMask: true };
            }
        }
        return null;
    }

    function earliestCombatantHit(shot, a, b) {
        let best = null;
        if (shot.ownerType === "player") {
            for (const event of combatEvents()) {
                const state = ensureEventState(event);

                // Primary v0.2.1 behavior: the visible opaque pixels of the
                // event's CURRENT frame are its projectile hurt mask. This fixes
                // tall sprites only being hittable at the event base/feet.
                let hit = sweepOneCombatantSprite(shot, event, state, a, b);

                // Fallback only when no usable sprite/frame mask exists. This
                // preserves functionality for temporarily unloaded/invisible
                // graphics without weakening normal pixel-perfect collision.
                if (!hit) {
                    const sprite = spriteForCharacter(event);
                    const maskAvailable = !!(sprite && frameMaskForSprite(sprite));
                    if (!maskAvailable) {
                        const center = { x: event._realX ?? event.x, y: event._realY ?? event.y };
                        const t = circleSweep(a, b, center, state.hitRadius + shot.radius);
                        if (t !== null) hit = { t, event, kind: "event", pixelMask: false };
                    }
                }

                if (hit && (!best || hit.t < best.t)) best = hit;
            }
        } else if (shot.ownerType === "event") {
            // Player collision remains the compact world-space radius in v0.2.1.
            // This update specifically changes <PhanicomABS> event hurt masks.
            const center = { x: $gamePlayer._realX ?? $gamePlayer.x, y: $gamePlayer._realY ?? $gamePlayer.y };
            const t = circleSweep(a, b, center, CFG.playerHitRadius + shot.radius);
            if (t !== null) best = { t, event: null, kind: "player" };
        }
        return best;
    }

    function passageBlockedBetween(ax, ay, bx, by) {
        const dx = bx - ax, dy = by - ay;
        const dist = Math.hypot(dx, dy);
        if (dist < EPS) return null;
        const steps = Math.max(1, Math.ceil(dist / 0.08));
        let ptx = Math.floor(ax), pty = Math.floor(ay);
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const x = ax + dx * t, y = ay + dy * t;
            if (!$gameMap.isValid(Math.floor(x), Math.floor(y))) return t;
            const tx = Math.floor(x), ty = Math.floor(y);
            if (tx !== ptx || ty !== pty) {
                const sx = tx - ptx, sy = ty - pty;
                let blocked = false;
                if (sx > 0) blocked ||= !$gameMap.isPassable(ptx, pty, 6) || !$gameMap.isPassable(tx, ty, 4);
                if (sx < 0) blocked ||= !$gameMap.isPassable(ptx, pty, 4) || !$gameMap.isPassable(tx, ty, 6);
                if (sy > 0) blocked ||= !$gameMap.isPassable(ptx, pty, 2) || !$gameMap.isPassable(tx, ty, 8);
                if (sy < 0) blocked ||= !$gameMap.isPassable(ptx, pty, 8) || !$gameMap.isPassable(tx, ty, 2);
                if (blocked) return t;
                ptx = tx; pty = ty;
            }
        }
        return null;
    }

    // ---------------------------------------------------------------------
    // Shared pixel-alpha sprite masks for ABS combatants and cover
    // ---------------------------------------------------------------------
    // Masks are cached per Bitmap and per currently displayed source frame.
    // This avoids expensive getImageData() calls during projectile updates while
    // still respecting animated sprites and 8-direction sheets frame-by-frame.
    const SpriteMaskCache = new WeakMap();

    function activeSpriteset() { return SceneManager._scene?._spriteset || null; }
    function spriteForCharacter(character) {
        const sprites = activeSpriteset()?._characterSprites;
        if (!Array.isArray(sprites)) return null;
        return sprites.find(s => s && s._character === character) || null;
    }

    function frameMaskForSprite(sprite) {
        const bitmap = sprite?.bitmap;
        const frame = sprite?._frame;
        if (!bitmap || !bitmap.isReady?.() || !frame || frame.width <= 0 || frame.height <= 0) return null;
        let byFrame = SpriteMaskCache.get(bitmap);
        if (!byFrame) { byFrame = new Map(); SpriteMaskCache.set(bitmap, byFrame); }
        const fx = Math.floor(frame.x), fy = Math.floor(frame.y), fw = Math.floor(frame.width), fh = Math.floor(frame.height);
        const key = `${fx},${fy},${fw},${fh}`;
        if (byFrame.has(key)) return byFrame.get(key);
        try {
            const ctx = bitmap.context || bitmap._context;
            if (!ctx) return null;
            const image = ctx.getImageData(fx, fy, fw, fh).data;
            const alpha = new Uint8Array(fw * fh);
            for (let i = 0, p = 3; i < alpha.length; i++, p += 4) alpha[i] = image[p];
            const mask = { x: fx, y: fy, width: fw, height: fh, alpha };
            byFrame.set(key, mask);
            return mask;
        } catch (e) {
            log("Sprite alpha-mask read failed", e);
            return null;
        }
    }

    function spriteAlphaAtScreen(character, screenX, screenY) {
        const sprite = spriteForCharacter(character);
        if (!sprite || !sprite.visible || sprite.opacity <= 0 || !sprite.worldTransform) return 0;
        const mask = frameMaskForSprite(sprite);
        if (!mask) return 0;
        try {
            // worldTransform handles screen translation, scale, rotation, and any
            // parent transforms. The anchor adjustment maps the local point into
            // the currently cropped source frame rather than the full sheet.
            const local = sprite.worldTransform.applyInverse(new PIXI.Point(screenX, screenY));
            const px = Math.floor(local.x + sprite.anchor.x * mask.width);
            const py = Math.floor(local.y + sprite.anchor.y * mask.height);
            if (px < 0 || py < 0 || px >= mask.width || py >= mask.height) return 0;
            return mask.alpha[py * mask.width + px] * (sprite.opacity / 255);
        } catch (_) {
            return 0;
        }
    }

    function coverAlphaAtScreen(event, screenX, screenY) {
        return spriteAlphaAtScreen(event, screenX, screenY);
    }

    function worldToScreen(x, y, visualOffset = null) {
        const tw = $gameMap.tileWidth(), th = $gameMap.tileHeight();
        return {
            x: ($gameMap.adjustX(x) + 0.5) * tw + (visualOffset?.x || 0),
            y: ($gameMap.adjustY(y) + 0.5) * th + (visualOffset?.y || 0),
        };
    }


    // v0.8.1 CALIBRATED MUZZLE ANCHOR
    // The profile editor measures from the literal bottom-center of the
    // displayed Sprite_Character frame. Earlier runtime code applied those
    // offsets from the center of the character's map tile instead.
    //
    // Convert the editor's frame-relative offset into the existing projectile
    // visual-offset system by adding the difference between MZ's real
    // character screen anchor and our generic world projection.
    // Physics/world coordinates are not changed.
    function muzzleOffsetForCharacter(character, muzzleSpec, dir) {
        const picked = muzzleForDirection(muzzleSpec, dir);
        if (!character || !$gameMap) return { ...picked };

        const wx = character._realX ?? character.x ?? 0;
        const wy = character._realY ?? character.y ?? 0;
        const projected = worldToScreen(wx, wy, null);

        let anchorX = projected.x;
        let anchorY = projected.y;
        try {
            if (typeof character.screenX === "function") anchorX = character.screenX();
            if (typeof character.screenY === "function") anchorY = character.screenY();
        } catch (_) {}

        return {
            x: picked.x + (anchorX - projected.x),
            y: picked.y + (anchorY - projected.y),
        };
    }

    // Returns the first contiguous opaque run encountered in this cover sprite.
    function sweepOneCover(shot, event, coverCfg, a, b) {
        const sprite = spriteForCharacter(event);
        if (!sprite || !sprite.visible || sprite.opacity <= 0 || !sprite.bitmap?.isReady?.()) return null;
        const sa = worldToScreen(a.x, a.y, shot.visualOffset);
        const sb = worldToScreen(b.x, b.y, shot.visualOffset);
        const bounds = sprite.getBounds?.();
        if (bounds) {
            const minX = Math.min(sa.x, sb.x), maxX = Math.max(sa.x, sb.x);
            const minY = Math.min(sa.y, sb.y), maxY = Math.max(sa.y, sb.y);
            if (maxX < bounds.x || minX > bounds.x + bounds.width || maxY < bounds.y || minY > bounds.y + bounds.height) return null;
        }
        const dx = sb.x - sa.x, dy = sb.y - sa.y;
        const pixels = Math.max(1, Math.ceil(Math.hypot(dx, dy)));
        let first = -1, last = -1, opaqueSamples = 0;
        let insideRun = false;
        for (let i = 0; i <= pixels; i++) {
            const t = i / pixels;
            const x = sa.x + dx * t, y = sa.y + dy * t;
            const solid = coverAlphaAtScreen(event, x, y) >= coverCfg.alpha;
            if (solid) {
                if (first < 0) first = i;
                last = i;
                opaqueSamples++;
                insideRun = true;
            } else if (insideRun) {
                break;
            }
        }
        if (first < 0) return null;
        return {
            kind: "cover", event, coverCfg,
            t: first / pixels,
            exitT: Math.min(1, (last + 1) / pixels),
            opaquePixels: opaqueSamples,
            cost: opaqueSamples * coverCfg.penetrationCost,
        };
    }

    function earliestCoverHit(shot, a, b) {
        let best = null;
        for (const event of coverEvents()) {
            const cfg = parseCoverEvent(event.event());
            const hit = sweepOneCover(shot, event, cfg, a, b);
            if (hit && (!best || hit.t < best.t)) best = hit;
        }
        return best;
    }

    function sweepProjectile(shot, a, b) {
        let hit = earliestCombatantHit(shot, a, b);
        const wallT = passageBlockedBetween(a.x, a.y, b.x, b.y);
        if (wallT !== null && (!hit || wallT < hit.t)) hit = { t: wallT, kind: "wall", event: null };
        const cover = earliestCoverHit(shot, a, b);
        if (cover && (!hit || cover.t < hit.t)) hit = cover;
        return hit;
    }

    // ---------------------------------------------------------------------
    // Visual records
    // ---------------------------------------------------------------------
    function emitTracer(shot, a, b) {
        if (!(shot.visual.life > 0)) return;
        Runtime.tracers.push({
            from: { ...a }, to: { ...b }, visualOffset: { ...shot.visualOffset },
            color: shot.visual.color, life: shot.visual.life, maxLife: shot.visual.life,
        });
        if (Runtime.tracers.length > 320) Runtime.tracers.shift();
    }

    function emitMuzzleFlash(position, direction, visualOffset) {
        Runtime.muzzleFlashes.push({
            x: position.x, y: position.y, direction: { ...direction },
            visualOffset: { ...visualOffset }, life: 0.085, maxLife: 0.085,
        });
        if (Runtime.muzzleFlashes.length > 48) Runtime.muzzleFlashes.shift();
    }

    // ---------------------------------------------------------------------
    // Projectile advance / penetration
    // ---------------------------------------------------------------------
    function resolveProjectileImpact(shot, hit) {
        if (!hit) return;
        if (hit.kind === "event" && hit.event) applyDamageToEvent(hit.event, shot.damage, shot);
        else if (hit.kind === "player") applyDamageToPlayer(shot.damage, shot);
        else if (hit.kind === "wall") spawnImpact(shot.position.x, shot.position.y, "wall", shot.visualOffset);
        else if (hit.kind === "cover") spawnImpact(shot.position.x, shot.position.y, "cover", shot.visualOffset);
    }

    function advanceProjectile(shot, dt, instant = false) {
        let remaining = Math.max(0, shot.maxRange - shot.distanceTravelled);
        let travel = instant ? remaining : Math.min(remaining, shot.speed * Math.min(dt, Math.max(0, shot.lifetime - shot.age)));
        if (travel <= EPS) return false;

        let current = { ...shot.position };
        let distanceLeft = travel;
        let guard = 0;
        while (distanceLeft > EPS && guard++ < 8) {
            const target = { x: current.x + shot.direction.x * distanceLeft, y: current.y + shot.direction.y * distanceLeft };
            const hit = sweepProjectile(shot, current, target);
            const t = hit?.t ?? 1;
            const contact = { x: current.x + (target.x - current.x) * t, y: current.y + (target.y - current.y) * t };
            emitTracer(shot, current, contact);
            const segmentDistance = distanceLeft * t;
            shot.distanceTravelled += segmentDistance;
            shot.previousPosition = { ...current };
            shot.position = { ...contact };

            if (!hit) {
                current = target;
                shot.position = { ...target };
                shot.distanceTravelled += distanceLeft * (1 - t);
                distanceLeft = 0;
                break;
            }

            if (hit.kind === "cover" && shot.penetrationRemaining + EPS >= hit.cost) {
                shot.penetrationRemaining = Math.max(0, shot.penetrationRemaining - hit.cost);
                spawnImpact(contact.x, contact.y, "penetrate", shot.visualOffset);
                const passedFraction = Math.max(hit.exitT - hit.t, 1 / Math.max(1, Math.ceil(distanceLeft * $gameMap.tileWidth())));
                const passDistance = distanceLeft * passedFraction;
                const exit = { x: contact.x + shot.direction.x * passDistance, y: contact.y + shot.direction.y * passDistance };
                emitTracer(shot, contact, exit);
                shot.distanceTravelled += passDistance;
                shot.position = { ...exit };
                current = exit;
                distanceLeft = Math.max(0, distanceLeft - segmentDistance - passDistance);
                continue;
            }

            resolveProjectileImpact(shot, hit);
            return false;
        }

        shot.age += dt;
        return !(instant || shot.age >= shot.lifetime - EPS || shot.distanceTravelled >= shot.maxRange - EPS);
    }

    function updateProjectiles(dt) {
        Runtime.projectiles = Runtime.projectiles.filter(shot => advanceProjectile(shot, dt, false));
    }

    // ---------------------------------------------------------------------
    // Player melee
    // ---------------------------------------------------------------------
    function performPlayerMelee(weapon, direction) {
        const px = $gamePlayer._realX ?? $gamePlayer.x, py = $gamePlayer._realY ?? $gamePlayer.y;
        const cosLimit = Math.cos(weapon.arcRadians * 0.5);
        const candidates = [];
        for (const event of combatEvents()) {
            const ex = event._realX ?? event.x, ey = event._realY ?? event.y;
            const dx = ex - px, dy = ey - py, dist = Math.hypot(dx, dy);
            if (dist > weapon.range || dist < EPS) continue;
            const dot = (dx / dist) * direction.x + (dy / dist) * direction.y;
            if (dot + EPS < cosLimit) continue;
            candidates.push({ event, dist });
        }
        candidates.sort((a, b) => a.dist - b.dist);
        for (const target of candidates.slice(0, weapon.maxTargets)) applyDamageToEvent(target.event, weapon.damage, { direction, ownerType: "player", credit: shotCredit(weapon, {ownerType:"player",itemId:weapon.itemId}), visualOffset: { x: 0, y: 0 }, melee: true });
        Runtime.impacts.push({ x: px + direction.x * Math.min(weapon.range, 0.75), y: py + direction.y * Math.min(weapon.range, 0.75), kind: "melee", direction: { ...direction }, arc: weapon.arcRadians, range: weapon.range, visualOffset: { x: 0, y: 0 }, life: 0.10, maxLife: 0.10 });
    }

    // Spawn one projectile/hitscan or a physical shotgun pellet pattern.
    // Every pellet is a normal Phanicom projectile: it gets its own tracer,
    // swept collision, pixel-cover interaction, damage, and penetration budget.
    function spawnShotPattern(config, baseDirection, source, visualOffset, attackType) {
        const type = String(attackType || config.type || config.attack || "projectile").toLowerCase();
        const directions = type === "shotgun"
            ? shotgunDirections(baseDirection, config.pellets || 8, config.spreadRadians || 0)
            : [applySpread(baseDirection, config.spreadRadians || 0)];
        let spawned = 0;
        for (const dir of directions) {
            const shot = createProjectile(config, dir, { ...source, visualOffset });
            if (type === "hitscan") advanceProjectile(shot, 0, true);
            else Runtime.projectiles.push(shot);
            spawned++;
        }
        // One muzzle flash per trigger pull, not one per pellet.
        emitMuzzleFlash(source.position, baseDirection, visualOffset);
        return spawned;
    }

    // ---------------------------------------------------------------------
    // Player weapon handling (v0.6.0)
    // ---------------------------------------------------------------------
    // One physical trigger event always routes through firePlayerShot().
    // Ammo is removed only after all ordinary fire gates pass and immediately
    // before the projectile/melee attack is actually created.
    function firePlayerShot(weapon, cooldownAfterShot) {
        if (playerDefeated()) return false;
        if (!$gameMap || !$gamePlayer) {
            Runtime.lastAttackResult = "BLOCKED: map/player unavailable";
            return false;
        }
        if ($gameMessage?.isBusy?.() || SceneManager._scene?._messageWindow?.isOpen?.()) {
            Runtime.lastAttackResult = "BLOCKED: message window busy";
            return false;
        }
        if (!weapon) {
            const parsed = parsedWeaponItems();
            Runtime.lastAttackResult = parsed.length
                ? `NO EQUIPPED WEAPON: ${parsed.length} tagged item(s), no equip switch ON`
                : "NO WEAPON TAGS FOUND";
            log(Runtime.lastAttackResult, parsed);
            SoundManager.playBuzzer();
            return false;
        }

        // Item ammo is checked at the last safe moment. A blocked attack never
        // consumes ammunition. Shotguns consume once per trigger pull, not once
        // per pellet, because this function is called once for the whole pattern.
        if (!hasAmmo(weapon)) {
            Runtime.lastAttackResult = `EMPTY: ${weapon.name} requires Item ${weapon.ammoItem} x${weapon.ammoCost}`;
            playDryFireSound(weapon);
            Runtime.cooldown = CFG.dryFireCooldown;
            cancelPlayerBurst();
            return false;
        }

        const dirNum = resolvePlayerAttackDir8();
        // Pose remains 8-way, but the actual projectile follows the calibrated
        // authored barrel vector for this sprite + weapon combination.
        const facing = aimVectorForDirection(weapon.aimSpec, dirNum);
        // v0.8.1: apply picker coordinates from the player's literal sprite
        // bottom-center anchor, not the center of the map tile.
        const visualOffset = muzzleOffsetForCharacter($gamePlayer, weapon.muzzleSpec, dirNum);

        consumeAmmo(weapon);
        playWeaponSound(weapon);
        Runtime.cooldown = Math.max(0, Number(cooldownAfterShot) || 0);

        if (weapon.type === "melee") {
            const direction = applySpread(facing, weapon.spreadRadians);
            performPlayerMelee(weapon, direction);
            Runtime.lastAttackResult = `FIRED: melee ${weapon.name} dir=${dirNum}`;
            return true;
        }

        const sourcePos = { x: $gamePlayer._realX ?? $gamePlayer.x, y: $gamePlayer._realY ?? $gamePlayer.y };
        const spawned = spawnShotPattern(
            weapon,
            facing,
            { ownerType: "player", itemId: weapon.itemId, position: sourcePos },
            visualOffset,
            weapon.type
        );
        const ammoText = weapon.ammoItem
            ? ` ammoItem=${weapon.ammoItem} left=${$gameParty.numItems($dataItems[weapon.ammoItem])}`
            : "";
        Runtime.lastAttackResult = `FIRED: ${weapon.type} ${weapon.name} mode=${weapon.fireMode} dir=${dirNum}${weapon.type === "shotgun" ? ` pellets=${spawned}` : ""}${ammoText}`;
        log(Runtime.lastAttackResult, weapon);
        return true;
    }

    function beginPlayerBurst(weapon) {
        if (!weapon || Runtime.cooldown > 0 || Runtime.playerBurstRemaining > 0) return false;
        const fired = firePlayerShot(weapon, 0);
        if (!fired) return false;
        Runtime.playerBurstRemaining = Math.max(0, weapon.burstCount - 1);
        Runtime.playerBurstWeaponId = weapon.itemId;
        Runtime.playerBurstTimer = Runtime.playerBurstRemaining > 0 ? weapon.burstDelay : 0;
        if (Runtime.playerBurstRemaining <= 0) Runtime.cooldown = weapon.cooldown;
        return true;
    }

    function updatePlayerBurst() {
        if (Runtime.playerBurstRemaining <= 0) return false;
        const weapon = currentWeapon();
        if (!weapon || weapon.itemId !== Runtime.playerBurstWeaponId || weapon.fireMode !== "burst") {
            cancelPlayerBurst();
            return false;
        }
        if (Runtime.playerBurstTimer > 0) {
            Runtime.playerBurstTimer--;
            return true;
        }
        const fired = firePlayerShot(weapon, 0);
        if (!fired) {
            cancelPlayerBurst();
            return true;
        }
        Runtime.playerBurstRemaining--;
        if (Runtime.playerBurstRemaining > 0) {
            Runtime.playerBurstTimer = weapon.burstDelay;
        } else {
            Runtime.playerBurstWeaponId = 0;
            Runtime.cooldown = weapon.cooldown;
        }
        return true;
    }

    function updatePlayerWeaponInput() {
        // Finish an already-started burst even after the trigger is released.
        // Changing weapons cancels the remainder safely.
        if (updatePlayerBurst()) return;

        const mappedTriggered = Input.isTriggered(ATTACK_SYMBOL);
        const rawTriggered = RawInput.triggered;
        const triggered = mappedTriggered || rawTriggered;
        const held = Input.isPressed(ATTACK_SYMBOL) || RawInput.pressed;

        if (triggered) {
            Runtime.lastInputSeen = rawTriggered ? `raw keyCode ${CFG.attackKeyCode}` : ATTACK_SYMBOL;
        }

        const weapon = currentWeapon();

        if (!weapon) {
            if (triggered) firePlayerShot(null, 0);
            return;
        }

        if (weapon.fireMode === "auto") {
            if (held && Runtime.cooldown <= 0) firePlayerShot(weapon, weapon.fireRate);
            return;
        }

        if (weapon.fireMode === "burst") {
            if (triggered && Runtime.cooldown <= 0) beginPlayerBurst(weapon);
            return;
        }

        // Semi-auto remains exactly one shot per new press.
        if (triggered && Runtime.cooldown <= 0) firePlayerShot(weapon, weapon.cooldown);
    }

    // Public/manual attack call keeps legacy behavior by treating the call as
    // one trigger pull according to the equipped weapon's configured fire mode.
    function attack() {
        const weapon = currentWeapon();
        if (!weapon) return firePlayerShot(null, 0);
        if (Runtime.cooldown > 0 || Runtime.playerBurstRemaining > 0) {
            Runtime.lastAttackResult = `BLOCKED: cooldown ${Runtime.cooldown}`;
            return false;
        }
        if (weapon.fireMode === "burst") return beginPlayerBurst(weapon);
        return firePlayerShot(weapon, weapon.fireMode === "auto" ? weapon.fireRate : weapon.cooldown);
    }

    // ---------------------------------------------------------------------
    // Enemy attacks: same projectile engine, different owner.
    // ---------------------------------------------------------------------
    function updateEnemyCombat() {
        const playerActor = $gameParty?.leader?.();
        if (!playerActor || (playerActor.isDead?.() && !pendingDeath())) {
            Runtime.enemyAiSummary = "player unavailable/dead";
            return;
        }
        const px = $gamePlayer._realX ?? $gamePlayer.x, py = $gamePlayer._realY ?? $gamePlayer.y;
        let armed = 0, inRange = 0, cooling = 0, fired = 0, passive = 0;

        for (const event of combatEvents()) {
            const state = ensureEventState(event);
            const cfg = state?.attackCfg;
            if (!cfg || state.dead) continue;
            if (cfg.attack === "none") { passive++; continue; }
            armed++;

            const ex = event._realX ?? event.x, ey = event._realY ?? event.y;
            const dx = px - ex, dy = py - ey, dist = Math.hypot(dx, dy);
            if (dist > cfg.range || dist < EPS) continue;
            inRange++;

            if (state.cooldown > 0) {
                state.cooldown--;
                cooling++;
                continue;
            }

            const aim = normalize(dx, dy);
            state.cooldown = cfg.fireRate;

            if (cfg.attack === "melee") {
                applyDamageToPlayer(cfg.damage, { ownerType: "event", ownerEventId: event.eventId(), credit: shotCredit(cfg, {ownerType:"event",ownerEventId:event.eventId()}), direction: aim, visualOffset: { x: 0, y: 0 }, melee: true });
                Runtime.lastEnemyResult = `Enemy ${event.eventId()} melee attack`;
                fired++;
                continue;
            }

            // Face the player for directional muzzle selection when possible.
            // setDirection remains cardinal for RPG Maker sprite compatibility;
            // diagonal intent is stored separately for Phanicom's resolver.
            const ax = Math.abs(dx), ay = Math.abs(dy);
            let aimDir;
            if (ax > 0.35 && ay > 0.35) aimDir = diagonalNumber(dx < 0 ? 4 : 6, dy < 0 ? 8 : 2);
            else if (ax >= ay) aimDir = dx < 0 ? 4 : 6;
            else aimDir = dy < 0 ? 8 : 2;
            event._phanicomABSLastDirection8 = aimDir;
            if ([2,4,6,8].includes(aimDir)) event.setDirection?.(aimDir);

            // The player-relative vector chooses the 8-way pose; the firing
            // calibration supplies this sprite/weapon's actual barrel angle.
            const calibratedAim = aimVectorForDirection(cfg.aimSpec, aimDir);
            const visualOffset = muzzleOffsetForCharacter(event, cfg.muzzleSpec, aimDir);
            playEnemyWeaponSound(cfg);
            const spawned = spawnShotPattern(cfg, calibratedAim, { ownerType: "event", ownerEventId: event.eventId(), position: { x: ex, y: ey } }, visualOffset, cfg.attack);
            Runtime.lastEnemyResult = `Enemy ${event.eventId()} fired ${cfg.attack}${cfg.attack === "shotgun" ? ` pellets=${spawned}` : ""}`;
            fired++;
        }

        Runtime.enemyAiSummary = `armed=${armed} inRange=${inRange} cooldown=${cooling} fired=${fired} passive=${passive}`;
    }

    // v0.6.5: detach transient gib PIXI containers before Scene_Map's
    // display tree can be destroyed by a pushed menu scene.
    const _Scene_Map_stop_PhanicomGibs = Scene_Map.prototype.stop;
    Scene_Map.prototype.stop = function() {
        suspendGibEffectsForSceneChange();
        _Scene_Map_stop_PhanicomGibs.call(this);
    };

    const _Scene_Map_terminate_PhanicomGibs = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        suspendGibEffectsForSceneChange();
        _Scene_Map_terminate_PhanicomGibs.call(this);
    };

    // ---------------------------------------------------------------------
    // Frame integration
    // ---------------------------------------------------------------------
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (Runtime.mapId !== $gameMap.mapId()) resetRuntimeForMap();
        if (SceneManager.isSceneChanging()) return;
        const dt = 1 / 60;
        if (Runtime.cooldown > 0) Runtime.cooldown--;
        if (!playerDefeated()) updatePlayerWeaponInput();
        RawInput.triggered = false;
        updateEnemyCombat();
        updateProjectiles(dt);
        for (const tracer of Runtime.tracers) tracer.life -= dt;
        Runtime.tracers = Runtime.tracers.filter(t => t.life > 0);
        for (const flash of Runtime.muzzleFlashes) flash.life -= dt;
        Runtime.muzzleFlashes = Runtime.muzzleFlashes.filter(f => f.life > 0);
        for (const impact of Runtime.impacts) impact.life -= dt;
        Runtime.impacts = Runtime.impacts.filter(i => i.life > 0);
        for (const p of Runtime.bloodParticles) {
            p.life -= dt; p.vy += p.gravity * dt; p.ox += p.vx * dt; p.oy += p.vy * dt;
            if (!p.settled && p.life <= 0) { p.settled = true; addBloodDecal(p); }
        }
        Runtime.bloodParticles = Runtime.bloodParticles.filter(p => p.life > 0);
        updateGibEffects(dt);
        updateDeathAndFeed();
    };

    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        const restore = Runtime.restoreAfterLoad;
        _Game_Map_setup.call(this, mapId);
        resetRuntimeForMap();
        // MZ can rebuild the saved map after a project version update. Preserve
        // saved combat progress through that one load-time rebuild only.
        if (restore?.mapId === Number(mapId)) {
            for (const saved of restore.events) {
                const event = this.event(saved.id);
                if (event && parseCombatEvent(event.event())) {
                    event._phanicomABSState = { ...saved.state, noteCache: '' };
                    ensureEventState(event);
                }
            }
        }
        Runtime.restoreAfterLoad = null;
    };

    // ---------------------------------------------------------------------
    // Damage flashes
    // ---------------------------------------------------------------------
    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);
        const character = this._character;
        if (!character) return;
        if (character._phanicomABSFlashFrames > 0) {
            character._phanicomABSFlashFrames--;
            this.setBlendColor([255, 255, 255, 150]);
        } else if (this.getBlendColor?.()[3] > 0) {
            this.setBlendColor([0, 0, 0, 0]);
        }
    };

    // ---------------------------------------------------------------------
    // FX renderer
    // ---------------------------------------------------------------------
    function colorToHex(css, fallback = 0xffcf70) {
        try {
            if (typeof css === "number") return css;
            const text = String(css || "").trim();
            if (/^#[0-9a-f]{6}$/i.test(text)) return parseInt(text.slice(1), 16);
            if (/^#[0-9a-f]{3}$/i.test(text)) {
                const s = text.slice(1); return parseInt(s[0]+s[0]+s[1]+s[1]+s[2]+s[2], 16);
            }
        } catch (_) {}
        return fallback;
    }

    const _Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
    Spriteset_Map.prototype.createUpperLayer = function() {
        _Spriteset_Map_createUpperLayer.call(this);

        // Ground-gore layer: inserted into Tilemap so it participates in map
        // sorting and remains below every character/event sprite.  z=0.90 keeps
        // it above the ground plane while still below even "Below Characters"
        // event sprites (normally z=1).
        this._phanicomABSBloodGraphics = new PIXI.Graphics();
        this._phanicomABSBloodGraphics.z = 0.90;
        this._phanicomABSBloodGraphics.zIndex = 0.90;
        (this._tilemap || this).addChild(this._phanicomABSBloodGraphics);

        // Combat-light layer: tracers, muzzle flashes and non-blood impact cues
        // remain above the map so gunfire stays readable. Blood is never drawn here.
        this._phanicomABSGraphics = new PIXI.Graphics();
        this._phanicomABSGraphics.zIndex = 9999;
        this.addChild(this._phanicomABSGraphics);
        if (CFG.debugOverlay) {
            this._phanicomABSDebugSprite = new Sprite(new Bitmap(820, 245));
            this._phanicomABSDebugSprite.x = 8; this._phanicomABSDebugSprite.y = 8; this._phanicomABSDebugSprite.z = 999999;
            this.addChild(this._phanicomABSDebugSprite);
        }
    };

    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        this.updatePhanicomABSGraphics();
        this.updatePhanicomABSDebug();
    };

    Spriteset_Map.prototype.updatePhanicomABSGraphics = function() {
        const g = this._phanicomABSGraphics;
        const bg = this._phanicomABSBloodGraphics;
        if (!g) return;
        g.clear();
        if (bg) {
            bg.clear();
            // PIXI Graphics line style is sticky. Explicitly disable it before
            // every blood pass so the tracer's pale core can never leak into
            // gore rendering as a white "selection" outline.
            bg.lineStyle(0, 0x000000, 0);
            for (const d of Runtime.bloodDecals) {
                const p = worldToScreen(d.x, d.y, d.visualOffset);
                bg.beginFill(colorToHex(d.color, 0x7d0b0c), d.alpha);
                bg.drawEllipse(p.x + d.ox, p.y + d.oy, d.radius * 1.8, d.radius * 0.65);
                bg.endFill();
            }
            for (const b of Runtime.bloodParticles) {
                const p = worldToScreen(b.x, b.y, b.visualOffset);
                const alpha = clamp(b.life / Math.max(EPS, b.maxLife), 0, 1);
                bg.beginFill(colorToHex(b.color, 0x7d0b0c), 0.85 * alpha);
                bg.drawCircle(p.x + b.ox, p.y + b.oy, b.radius);
                bg.endFill();
            }
            // Fallback blood/player-hit puffs also belong on the gore layer.
            for (const i of Runtime.impacts) {
                if (i.kind !== "blood" && i.kind !== "playerHit") continue;
                if (CFG.bloodEffects && i.kind !== "playerHit") continue;
                const blood = bloodDefinition(i.blood || CFG.defaultBloodColor);
                if (!blood.enabled) continue;
                const p = worldToScreen(i.x, i.y, i.visualOffset);
                const alpha = clamp(i.life / Math.max(EPS, i.maxLife), 0, 1);
                bg.beginFill(colorToHex(blood.color, 0x7d0b0c), 0.7 * alpha);
                bg.drawCircle(p.x, p.y, 7 * (1.1 - 0.25 * alpha));
                bg.endFill();
            }
        }
        for (const t of Runtime.tracers) {
            const a = worldToScreen(t.from.x, t.from.y, t.visualOffset);
            const b = worldToScreen(t.to.x, t.to.y, t.visualOffset);
            const alpha = clamp(t.life / Math.max(EPS, t.maxLife), 0, 1);
            g.lineStyle(2.2, colorToHex(t.color), 0.80 * alpha); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y);
            g.lineStyle(0.7, 0xfff2bd, 0.90 * alpha); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y);
        }
        for (const f of Runtime.muzzleFlashes) {
            const p = worldToScreen(f.x, f.y, f.visualOffset);
            const q = { x: p.x + f.direction.x * 26, y: p.y + f.direction.y * 26 };
            const alpha = clamp(f.life / Math.max(EPS, f.maxLife), 0, 1);
            g.beginFill(0xfff2bd, 0.85 * alpha); g.drawCircle(p.x, p.y, 6 + 7 * alpha); g.endFill();
            g.lineStyle(5, 0xffb84a, 0.32 * alpha); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y);
        }
        for (const i of Runtime.impacts) {
            const p = worldToScreen(i.x, i.y, i.visualOffset);
            const alpha = clamp(i.life / Math.max(EPS, i.maxLife), 0, 1);
            if (i.kind === "blood" || i.kind === "playerHit") {
                // Blood/player-hit visuals are rendered exclusively by the
                // lower gore layer above; never draw them on the upper FX layer.
                continue;
            } else if (i.kind === "melee") {
                const d = i.direction || { x: 1, y: 0 }, base = Math.atan2(d.y, d.x), radius = Math.min(72, i.range * $gameMap.tileWidth()), half = (i.arc || Math.PI / 2) * 0.5;
                g.lineStyle(3, 0xffcf70, 0.65 * alpha); g.arc(p.x, p.y, radius, base - half, base + half);
            } else {
                const color = i.kind === "penetrate" ? 0xffd36b : 0xc6b58a;
                g.lineStyle(2, color, 0.75 * alpha); g.drawCircle(p.x, p.y, 5 * (1.2 - alpha * 0.2));
            }
        }
    };

    function debugStatusLines() {
        const parsed = parsedWeaponItems();
        const active = currentWeapon();
        const targets = $gameMap ? combatEvents().length : 0;
        const covers = $gameMap ? coverEvents().length : 0;
        const actor = $gameParty?.leader?.();
        const lines = [
            `PHANICOM ABS v0.8.4 DEBUG`,
            `Attack: ${CFG.attackKeyName} (keyCode ${CFG.attackKeyCode}) | mapped ${Input.keyMapper[CFG.attackKeyCode] || "NONE"}`,
            `Last input: ${Runtime.lastInputSeen}`,
            `Tagged weapon items: ${parsed.length}`,
            active ? `Equipped: ${active.name} (Item ${active.itemId}) | Switch ${active.equipSwitch}=ON | profile=${active.profileId || "none"} | family=${active.family} | mode=${active.fireMode}` : `Equipped: NONE`,
            active && active.ammoItem ? `Ammo: Item ${active.ammoItem} x${$gameParty.numItems($dataItems[active.ammoItem])} | per shot=${active.ammoCost}` : `Ammo: unlimited`,
            `ABS targets: ${targets} | Pixel cover events: ${covers}`,
            `Facing dir8: ${characterDirection8($gamePlayer)} | 8Dvisual=${typeof $gamePlayer?.phanicom8Direction === "function" ? $gamePlayer.phanicom8Direction() : "n/a"} | Aim=${resolvePlayerAttackDir8()} (${Runtime.lastAimSource}) | held=${heldKeyboardAimDir8() || heldGamepadAimDir8() || 0}`,
            `Projectiles: ${Runtime.projectiles.length} | Player cooldown: ${Runtime.cooldown} | burst=${Runtime.playerBurstRemaining}`,
            `Blood particles: ${Runtime.bloodParticles.length} | stains: ${Runtime.bloodDecals.length} | gibs: ${Runtime.gibs.length}`,
            `Gib debug: ${Runtime.lastGibDebug}`,
            (() => { const e = combatEvents()[0]; const c = e ? ensureEventState(e)?.attackCfg : null; return c ? `Enemy cfg: gib=${c.gib} threshold=${c.gibThreshold} attack=${c.attack}` : `Enemy cfg: none`; })(),
            `Enemy AI: ${Runtime.enemyAiSummary}`,
            actor ? `Player HP: ${actor.hp}/${actor.mhp}` : `Player HP: unavailable`,
            `Player result: ${Runtime.lastAttackResult}`,
            `Enemy result: ${Runtime.lastEnemyResult}`,
        ];
        return lines;
    }

    Spriteset_Map.prototype.updatePhanicomABSDebug = function() {
        const sprite = this._phanicomABSDebugSprite;
        if (!sprite?.bitmap) return;
        const b = sprite.bitmap; b.clear(); b.paintOpacity = 180; b.fillRect(0, 0, b.width, b.height, "#000000"); b.paintOpacity = 255; b.fontSize = 17;
        let y = 4; for (const line of debugStatusLines()) { b.drawText(line, 8, y, b.width - 16, 20, "left"); y += 20; }
    };

    // ---------------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------------
    // v0.9.0: only JSON-safe gameplay data goes in Game_System. PIXI objects,
    // projectiles and character references remain in Runtime and clear on load.
    function deathSave() {
        if (!$gameSystem._phanicomABSDeathFeed) {
            $gameSystem._phanicomABSDeathFeed = { version: 1, pending: null, feed: [], overrides: {} };
        }
        return $gameSystem._phanicomABSDeathFeed;
    }
    function deathMode() { return deathSave().overrides.mode || DEATH.mode; }
    function pendingDeath() {
        const pending = deathSave().pending;
        const actor = $gameParty?.leader?.();
        if (pending && (!actor || actor.actorId() !== pending.actorId || !actor.isDead())) {
            deathSave().pending = null;
            clearPlayerDeathVisual();
            return null;
        }
        return pending;
    }
    function playerDefeated() { return !!$gameParty?.leader?.()?.isDead?.(); }
    function bloodDefinition(subject) {
        if (window.PhanicomBlood) {
            try { return window.PhanicomBlood.resolve(subject); } catch (_) {}
        }
        const value = String(subject || CFG.defaultBloodColor).toLowerCase();
        return { type: value, enabled: value !== 'none', profile: /^(cream|synth)$/.test(value) ? 'cream' : 'regular',
            color: /^(cream|synth)$/.test(value) ? '#F5F5DC' : value === 'regular' ? CFG.defaultBloodColor : value };
    }
    function actorBlood(actor) {
        if (window.PhanicomBlood) return window.PhanicomBlood.resolve(actor).type;
        return /<CreamBleed>/i.test(actor.actor()?.note || '') ? 'cream' : CFG.defaultBloodColor;
    }
    function shotCredit(config, source) {
        const actor = $gameParty?.leader?.();
        const event = source.ownerType === 'event' ? $gameMap.event(source.ownerEventId) : null;
        return {
            killer: source.ownerType === 'player' ? (actor?.name() || 'Player') : (event?.event()?.name || 'Environment'),
            actorId: source.ownerType === 'player' ? (actor?.actorId() || 0) : 0,
            weapon: config.killWeaponName || config.name || config.profileName || config.profileId || config.type || config.attack || 'attack',
            keys: [source.itemId ? `item:${source.itemId}` : '', config.killWeapon,
                config.profileId, config.family, config.type || config.attack].filter(Boolean).map(String)
        };
    }
    function addFrag(shot, victim) {
        if (!(deathSave().overrides.feed ?? DEATH.feed)) return;
        // Credit is captured at firing, so changing weapon/leader before impact
        // cannot steal a projectile's name or weapon-specific message pool.
        const credit = shot?.credit || { killer: 'Environment', weapon: 'damage', keys: [] };
        let pool = DEATH.messages;
        for (const key of credit.keys) {
            const rule = DEATH.rules.find(r => r.key.toLowerCase() === key.toLowerCase());
            if (rule?.messages.length) { pool = rule.messages; break; }
        }
        const template = pool[Math.floor(Math.random() * pool.length)] || '{killer} fragged {victim}';
        const values = { killer: credit.killer, actor: credit.killer, victim, target: victim, weapon: credit.weapon };
        const text = template.replace(/\{(killer|actor|victim|target|weapon)\}/gi, (_, key) => values[key.toLowerCase()]);
        deathSave().feed.push({ text, remaining: DEATH.feedFrames });
        deathSave().feed = deathSave().feed.slice(-DEATH.feedLines);
    }
    function clearPlayerDeathVisual() {
        if (Runtime.deathBody) {
            const body = Runtime.deathBody;
            if (body.parent) body.parent.removeChild(body);
            // ImageManager owns picture base textures. Never destroy those.
            body.destroy({ children: true });
            Runtime.deathBody = null;
        }
        if (Runtime.deathBodyTexture) {
            Runtime.deathBodyTexture.destroy(false);
            Runtime.deathBodyTexture = null;
        }
        Runtime.deathPresented = false;
    }
    function beginPlayerDeath(damage = 0, beforeHp = 0, shot = null) {
        if (!DEATH.enabled || !playerDefeated() || pendingDeath()) return;
        const actor = $gameParty.leader();
        const mode = deathMode();
        const measure = DEATH.metric === 'overkill' ? Math.max(0, damage - beforeHp) : damage;
        const gib = mode === 'gib' || (mode === 'damage' && measure >= DEATH.threshold);
        const source = spriteForCharacter($gamePlayer);
        const offset = source?._frame?.height ? -source._frame.height * 0.45 : -24;
        const pending = deathSave().pending = {
            actorId: actor.actorId(), mapId: $gameMap.mapId(), remaining: DEATH.delayFrames,
            outcome: gib ? 'gib' : mode === 'normal' ? 'normal' : 'sprite',
            x: $gamePlayer._realX ?? $gamePlayer.x, y: $gamePlayer._realY ?? $gamePlayer.y,
            direction: shot?.direction ? { x: shot.direction.x, y: shot.direction.y } : { x: 0, y: 1 },
            damage, blood: actorBlood(actor), bloodOffset: offset
        };
        cancelPlayerBurst();
        addFrag(shot, actor.name());
        // Save state records the death once. Rebuilding visuals after loading
        // never re-applies damage, repeats the feed, or resets the countdown.
        presentPlayerDeath(pending);
        if (pending.outcome !== 'gib') {
            spawnBloodBurst(pending.x, pending.y, { x: 0, y: offset }, pending.direction,
                pending.blood, DEATH.bloodCount);
        }
    }
    function presentPlayerDeath(pending) {
        if (!pending || Runtime.deathPresented || pending.mapId !== $gameMap.mapId()) return;
        const source = spriteForCharacter($gamePlayer);
        if (!source?.parent || !source.bitmap?.isReady() || !cloneLiveSpriteFrame(source)) return;
        if (pending.outcome === 'gib') {
            const count = spawnSpriteGibs($gamePlayer, pending.blood, pending.direction, pending.damage, DEATH.threshold);
            if (count > 0) {
                Runtime.deathPresented = true;
                return;
            }
            pending.outcome = 'sprite'; // Global gib disable / unusable frame: visible corpse fallback.
        }
        if (pending.outcome === 'sprite') {
            const body = new PIXI.Container();
            copySpriteVisualState(source, body);
            if (DEATH.image) {
                const picture = new Sprite(ImageManager.loadPicture(DEATH.image));
                picture.anchor.set(0.5, 1);
                picture.scale.set(DEATH.imageScale, DEATH.imageScale);
                body.addChild(picture);
            } else {
                const frame = cloneLiveSpriteFrame(source);
                const picture = new PIXI.Sprite(createLiveFragmentTexture(frame, 0, 0, frame.width, frame.height));
                picture.anchor.set(0.5, 0.5);
                picture.rotation = Math.PI / 2;
                picture.y = -frame.width / 2;
                body.addChild(picture);
                // Only this small Texture wrapper is ours, not its base texture.
                Runtime.deathBodyTexture = picture.texture;
            }
            body.x = source.x; body.y = source.y;
            pending.screenOffsetX = source.x - ($gameMap.adjustX(pending.x) + 0.5) * $gameMap.tileWidth();
            pending.screenOffsetY = source.y - ($gameMap.adjustY(pending.y) + 0.5) * $gameMap.tileHeight();
            source.parent.addChild(body);
            Runtime.deathBody = body;
            source.visible = false;
        }
        Runtime.deathPresented = true;
    }
    function updateDeathAndFeed() {
        for (const entry of deathSave().feed) entry.remaining--;
        deathSave().feed = deathSave().feed.filter(entry => entry.remaining > 0);
        let pending = pendingDeath();
        if (!pending && DEATH.enabled && playerDefeated()) {
            beginPlayerDeath(); // Script/environmental HP loss also gets a safe delay.
            pending = pendingDeath();
        }
        if (!pending) return;
        presentPlayerDeath(pending);
        if (Runtime.deathBody) {
            const body = Runtime.deathBody;
            if (!body.parent) spriteForCharacter($gamePlayer)?.parent?.addChild(body);
            body.x = ($gameMap.adjustX(pending.x) + 0.5) * $gameMap.tileWidth() + (pending.screenOffsetX || 0);
            body.y = ($gameMap.adjustY(pending.y) + 0.5) * $gameMap.tileHeight() + (pending.screenOffsetY || 0);
        }
        pending.remaining = Math.max(0, pending.remaining - 1);
    }
    const originalCheckGameover = Scene_Map.prototype.checkGameover;
    Scene_Map.prototype.checkGameover = function() {
        if (DEATH.enabled && playerDefeated()) {
            if (!pendingDeath()) beginPlayerDeath();
            if (pendingDeath()?.remaining > 0) return;
            SceneManager.goto(Scene_Gameover);
            return;
        }
        pendingDeath(); // Clear a revived actor's pending defeat.
        originalCheckGameover.call(this);
    };
    // Keep simulation running, but stop dead-player movement, menus, random
    // encounters and queued transfers from interrupting the presentation.
    const deathCanMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        return !(DEATH.enabled && playerDefeated()) && deathCanMove.call(this);
    };
    for (const name of ['updateTransferPlayer', 'updateEncounter', 'updateCallMenu']) {
        const original = Scene_Map.prototype[name];
        Scene_Map.prototype[name] = function() {
            if (!(DEATH.enabled && playerDefeated())) return original.apply(this, arguments);
        };
    }
    // Saving serializes Game_Event HP/dead state and Game_System death/feed.
    // Loading, even onto the SAME map ID, must discard the previous run's FX.
    const createObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        resetRuntimeForMap();
        Runtime.restoreAfterLoad = null;
        const result = createObjects.apply(this, arguments);
        Runtime.mapId = 0;
        return result;
    };
    const extractContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        resetRuntimeForMap();
        const result = extractContents.apply(this, arguments);
        Runtime.mapId = $gameMap.mapId();
        Runtime.restoreAfterLoad = {
            mapId: $gameMap.mapId(),
            events: $gameMap.events().filter(e => e._phanicomABSState).map(e => ({
                id: e.eventId(), state: { ...e._phanicomABSState }
            }))
        };
        deathSave();
        return result;
    };
    const deathMapStart = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        deathMapStart.apply(this, arguments);
        Runtime.restoreAfterLoad = null;
    };
    const deathSpriteUpdate = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        deathSpriteUpdate.apply(this, arguments);
        if (this._character === $gamePlayer && DEATH.enabled) {
            const pending = pendingDeath();
            if (pending && pending.outcome !== 'normal' && Runtime.deathPresented) this.visible = false;
        }
    };
    // A screen-space bitmap is redrawn only when the visible text changes;
    // no scrolling window, escape-code evaluation, or per-frame text layout.
    const deathSceneUpdate = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        deathSceneUpdate.apply(this, arguments);
        if (SceneManager.isSceneChanging()) return;
        const rows = (deathSave().overrides.feed ?? DEATH.feed) ? deathSave().feed : [];
        const text = rows.map(r => r.text).join('\n');
        if (!this._phanicomFragFeed && rows.length) {
            const width = Math.min(DEATH.feedWidth, Graphics.width);
            this._phanicomFragFeed = new Sprite(new Bitmap(width, DEATH.feedLines * 30 + 12));
            this._phanicomFragFeed.x = Math.max(0, Graphics.width - width - 16);
            this._phanicomFragFeed.y = 16;
            this.addChild(this._phanicomFragFeed);
        }
        if (this._phanicomFragFeed && this._phanicomFragText !== text) {
            this._phanicomFragText = text;
            const b = this._phanicomFragFeed.bitmap;
            b.clear(); b.fontSize = 20; b.textColor = '#FFFFFF'; b.outlineColor = '#000000'; b.outlineWidth = 4;
            rows.forEach((row, i) => {
                b.fillRect(0, i * 30, b.width, 28, 'rgba(0,0,0,0.45)');
                b.drawText(row.text, 8, i * 30, b.width - 16, 28, 'right');
            });
        }
    };
    const deathSceneTerminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        if (Runtime.deathBody?.parent) Runtime.deathBody.parent.removeChild(Runtime.deathBody);
        if (this._phanicomFragFeed) {
            this._phanicomFragFeed.bitmap.destroy();
            this.removeChild(this._phanicomFragFeed);
            this._phanicomFragFeed.destroy();
            this._phanicomFragFeed = null;
        }
        deathSceneTerminate.apply(this, arguments);
    };
    PluginManager.registerCommand(PLUGIN_NAME, 'SetPlayerDeathMode', args => {
        if (['normal', 'sprite', 'gib', 'damage'].includes(args.mode)) deathSave().overrides.mode = args.mode;
        else if (args.mode === 'default') delete deathSave().overrides.mode;
    });
    PluginManager.registerCommand(PLUGIN_NAME, 'SetKillFeed', args => {
        if (args.enabled === 'default') delete deathSave().overrides.feed;
        else deathSave().overrides.feed = args.enabled === 'true';
    });

    window.PhanicomABS = {
        version: "0.9.0",
        attack, currentWeapon, parsedWeaponItems, debugStatus: debugStatusLines,
        setPlayerDeathMode(mode) {
            if (mode === 'default') delete deathSave().overrides.mode;
            else if (['normal','sprite','gib','damage'].includes(mode)) deathSave().overrides.mode = mode;
            else return false;
            return true;
        },
        setKillFeedEnabled(value) {
            if (value === 'default') delete deathSave().overrides.feed;
            else if (typeof value === 'boolean') deathSave().overrides.feed = value;
            else return false;
            return true;
        },
        eventState(eventId) {
            const event = $gameMap?.event?.(Number(eventId));
            return event ? ensureEventState(event) : null;
        },
        damageEvent(eventId, amount) {
            const event = $gameMap?.event?.(Number(eventId));
            return event ? applyDamageToEvent(event, amount, null) : false;
        },
        resetMapState: resetRuntimeForMap,
        _runtime: Runtime,
    };

    console.log(`${PLUGIN_NAME} v0.9.0 loaded - attack=${CFG.attackKeyName}/${CFG.attackKeyCode}, combatant-alpha=${CFG.combatantAlphaThreshold}, cover-alpha=${CFG.coverAlphaThreshold} - A Phanicom Cohos Cooperation.`);
})();

/*~struct~PhanicomFragRule:
 * @param WeaponKey
 * @text Weapon Key
 * @type string
 * @default handgun
 * @desc item:ID, profile ID, family, or attack type.
 * @param Messages
 * @text Message Alternatives
 * @type string[]
 * @default ["{killer} fragged {victim}","{victim} fell to {killer}'s {weapon}"]
 */
