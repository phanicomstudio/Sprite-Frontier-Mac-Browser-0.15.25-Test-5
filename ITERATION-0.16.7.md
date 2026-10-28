# Sprite Frontier 0.16.7 - enemy authoring and combat

October 28, 2026. Incremental source iteration based on 0.16.6, delivered through a reviewed Git branch. No external code or assets added. Prior releases and the exact baseline remain recoverable at db7d41284089f345b8a53490481b04d7341a8bbc (PR #9). This supersedes the earlier banked request for strong assistance/an Off option and the prior restriction of projectile direction to displayed frame sectors.

## Authoring enemies

Choose Events > Create / edit enemies. Select Place new enemies, a weapon archetype and sprite, then edit health, weapon/ammo/spread, patrol points (X,Y; X,Y in metres), engagement/pursuit distances, maximum spawn distance, stopping distance, burst/pause, cover chance and respawn. Set X/Y, count and spacing, then Place enemies. The result is an actual event, retaining ordinary event pages and save/respawn ownership.

In the Event Editor, the prominent Enemy settings / create enemy button applies the current page draft through normal validation before opening that same event's enemy settings. It can turn an ordinary newly created event into an enemy without discarding its pages. Validation errors keep the editor open. Creation through the enemy panel remains available and existing options are preserved.

Behavior presets scale the authored cover chance: Aggressive x0.25, Balanced x1, Defensive x1.5 (probability naturally caps at 100%). Engagement, pursuit, leash, movement and weapon cadence remain explicit overrides. Cover travel/holding lasts at most three seconds, followed by three seconds during which another cover request is suppressed. Reaching cover holds for 0.45/1/1.8 seconds respectively; blocked navigation still abandons after two seconds. This prevents repeated incoming shots from keeping an enemy indefinitely in cover. It does not guarantee every shot or terrain layout has a navigable flanking route.

Optional Death animation sprite and Remains sprite use the existing imported/calibrated sprite profile library (Muzzle / Aim). Death animation uses the first row, left to right, once over Death animation duration, then switches to remains. Choose artwork laid out accordingly. Missing assignments preserve existing presentation; no new artwork is required. Death animation age persists through the existing per-cell save state, resets on respawn, and gibbed actors retain existing gib visuals. Red versus Cream/synth blood is unchanged. This is a straightforward sheet sequence, not a new arbitrary animation timeline editor.

## Aim and weapon feedback

Player projectiles use continuous 360-degree cursor/camera aim in all supported views. The existing directional selector still displays the nearest sprite frame and supplies its calibrated muzzle position. The legacy fixed-camera sector-launch helper remains in source for historical/reference tests but no longer owns live launch direction. Player barrel artwork no longer overrides the actual intended trajectory. Enemy barrel calibration remains supported. Existing weapon spread and full swept collision remain active.

The isometric assistance coefficient is multiplied by 1.02: default 0.20 becomes 0.204, not 0.22. Acquisition remains six degrees/three metres near the cursor with obstruction checks. Fixed views use the same affine cursor helper; perspective uses bounded horizontal launch assistance at 0.15 x1.02. No Off option is added. Existing authored values remain preserved. Nothing steers a projectile after launch. Exact prior feel is available by restoring the baseline branch/commit above.

Physical discharges now create an 85 ms original generic star-shaped flash at the final calibrated, clearance-checked muzzle. Pellets from the same actor/frame share a flash, and the list is capped at 64. The old player-only uncalibrated flash is used only by legacy shots lacking physical positions. Flash size fades with lifetime and uses the existing static depth mask, rather than covering foreground walls. No Quake assets are introduced.

## Automatic static cover

Static sprite props/events, including nonsolid visual trees, participate automatically in projectile obstruction and enemy cover candidates. Opaque alpha pixels (>=128/255) block; transparent margins/gaps pass. The test uses the actual selected frame and locked camera-facing billboard plane, including camera pitch, affine projection, scale and ground inset. It does not require a manually authored collision box and does not change movement collision. Models retain their actual authored mesh/custom collision; explicit no-collision model/through settings remain authoritative. Actors retain existing combat body collision.

An alpha silhouette is a camera-facing sheet, not a manufactured three-dimensional trunk/leaf volume: its world plane follows the existing displayed billboard. Readable original images are required. Unavailable, cross-origin unreadable or >32 MiB alpha assets retain legacy collision fallback until usable; a nonsolid sprite without readable pixels cannot provide cover until loaded. Cached original alpha masks use one byte/pixel with a 32 MiB budget. A conservative world bounding sphere rejects distant candidates before mask decoding or camera queries. Coplanar segments sample half-pixel intervals up to 4096 steps. Ordinary crossing segments intersect the plane once; projectile radius does not inflate transparent pixels. Fast thin-surface crossings remain swept. Perspective target picking and cover evaluation share the same projectile obstruction service.

## Validation and compatibility

See RELEASE-VALIDATION-0.16.7.json for executed checks and scope. Tests include real authoring controls and reopening from MZ, non-cardinal launch directions, opaque/transparent hits across view types, cover timeout, death/remains/save age, real mouse/WASD/fire/zoom, fog sky separation, event-editor regression, existing door transitions, contact shadows, core gameplay and function comments. Preserve the locked 0.15.17 sprite tilt/proportions and first-person no-zoom behavior.

Current maps use additive enemy extension/save fields with defaults for older content. Project exports include existing edited modules; no new runtime loader dependency is required. No full native package is built for this routine source PR; the prior 0.16.6 Windows release remains intact. Merge only after review; main is not overwritten by publication.
