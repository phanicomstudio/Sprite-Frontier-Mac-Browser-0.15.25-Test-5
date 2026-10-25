# Sprite Frontier 0.16.2

October 24, 2026. Earlier releases, source rationale and guides remain preserved. This iteration supersedes the missing orthographic creation option and continuously triggered enemy pistol behavior in 0.16.1.

## Isometric authoring and test map

Choose **World → New map → Isometric / orthographic — Fallout style**. To change an existing cell, choose **Environment → Camera / presentation**, select its gameplay projection, then Apply. Scale is logical pixels per metre and angle is degrees in the UI. This is saved cell data and one normal Undo step; it does not convert geometry into background artwork. Fixed artwork alignment remains a separate preserved tool.

The Active map list includes **Isometric Textured Wilderness**, an independent copy of Supplied Assets Forest Test with all 141 original tree props, ground, terrain and water retained. The original map remains available. The copy adds a pistol patrol near the clearing and a static cover chest. The patrol retaliates when attacked and has a 100% cover-response chance for demonstration; ordinary enemies default to 25%. New-project examples are added to existing example projects, while intentionally blank projects remain blank.

Playtest with F2. Movement follows the fixed view. During firing, moving actors use movement-facing and stationary actors use cursor-facing cardinal aim. Nearby unobstructed enemies receive light launch-only attraction; no homing or guaranteed hit is introduced. The existing affine displayed-frame/muzzle launch adapter is shared with fixed artwork rooms, retaining its five-degree correction limit and calibrated frame alignment. Accuracy/spread and swept physical impacts still apply. Exploration/combat operate in the same cell without replacing terrain or resetting actors. Editor free-flight remains the existing authoring view; the gameplay camera is assessed in playtest.

## Enemy events

Use **Events → Enemy events**. Weapon damage, projectile and minimum cadence come from the same arsenal as the player; damage and accuracy retain existing instance overrides. Configure awareness/detection, engagement distance, pursuit cutoff, home leash, approach stopping distance, shots per burst, extra pause after a burst, cover chance, and patrol XY pairs separated by semicolons (for example `30,30; 34,30`). Distances are metres, pauses simulation seconds and cover chance percent. Existing advanced page behaviors retain their locomotion ownership; avoid assigning a separate page patrol while also configuring an enemy patrol.

The default pistol fires one shot then waits its 0.25-second weapon interval plus a 0.7-second authorable pause. Setting pause to zero allows repeated semi-automatic trigger pulls at the same legal minimum cadence as the player. Automatic weapons can use larger bursts. This iteration does not add a new magazine/reload system; existing player and enemy ammunition ownership remains intact.

Enemies return toward their spawn beyond pursuit or home limits. Cover response is checked once per nearby approaching hostile projectile. Only a different static solid noncombat event qualifies, and its actual collision must block the shooter-to-cover line. A direct or one-corner route must pass swept clearance checks; ordinary collision remains authoritative during movement. Blocked movement abandons the candidate after two seconds. This is bounded local cover routing, not a general navigation mesh or a promise to solve arbitrary mazes. Tactics are transient; existing HP, death, ammo and respawn persistence remains unchanged.

## Wall materials

Premade wood wall/panel images now use Automatic material mapping to fit once vertically from the wall base to its top. Horizontal repeat size remains independent. **Fit floor to ceiling; repeat horizontally** explicitly enables this for imported decorated wall images. Seamless materials retain repetition, and explicit prior Repeat/UV overrides remain respected. Choose Automatic or the full-height option to repair a previously explicit repeating wall. Baseboard and crown must be contained in the source texture; no image pixels or wall dimensions are rewritten.

## Validation and compatibility

Real browser tests exercise the new fixture, camera UI, enemy controls, physical projectile launch, cardinal/movement aim, visible-target attraction versus occluded targets, static-event cover collision, patrol/pursuit, pistol pauses, and full-height UVs. Existing authoring, ballistics, enemy placement/state/respawn tests and function-comment coverage are rerun. Windows keeps the compatible Sprite-Frontier-0.16.0 profile. Export project JSON for a portable backup. No sprite billboard tilt/proportions or third-party asset/license changes are made.

## Map lighting

Choose **Environment → Map lighting**. Enable lighting on this map, set ambient brightness (0–1), then Apply map lighting. Add a light at the author position and set its color, XYZ metres, radius, intensity, falloff and flicker; Apply selected light commits that source. Player and projectile lights are independent toggles. Settings are saved per cell and use normal Undo. Eight active lights are supported; room primitives block them. Terrain and imported mesh shadow casting remain unsupported. Directional normal-map sprite preparation remains available through Sprite normals.
