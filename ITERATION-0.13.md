# Sprite Frontier 0.13 — Blood / Cerebral HUD

Extract the entire Windows ZIP, then run **Launch Sprite Frontier.cmd** beside **Sprite Frontier.exe**. No browser, npm or internet is needed. Keep resources/app intact.

## Test controls
- P: live point-and-click mode. The illustrated Inventory button opens inventory; the remote's Power button resumes mouse look. Invisible hit areas scale with the artwork. I remains the inventory shortcut.
- 1: pistol. 2: starter melee weapon. Space: draw/holster. Click/F attacks outside P mode; P-mode clicks still interact regardless of weapon state.
- T: ask about a nearby NPC with authored topics. This preserves the parser without an extra remote overlay.
- F2 → Database → Blood / Cerebral and melee: author Cerebral maximum, drain amount/interval/radius, background thresholds and melee name/damage/reach/arc/cadence/sprite profile. Test Cerebral -5 and Restore Cerebral update the live preview. Apply stores validated rules with undo.
- Select scenery and use Toggle selected scenery as Cerebral source to turn its proximity effect on/off. Source position follows ordinary mouse placement/elevation tools and survives world export/import.

## Demo
The Cerebral anomaly is a rock seven tiles to the right of spawn. Within five tiles it removes five Cerebral points every three seconds. Leaving range resets that source's timer. Depletion clamps to zero; dead players are unaffected. One tile equals one world unit for this rule, independent of visual grid spacing. Multiple sources accumulate independently.
The shallow wading pool remains near spawn. Seven exploration and three combat tracks ship preselected; empty map overrides fall back to global exploration. Existing randomized sequences and combat exit fade are retained. Desktop Refresh audio folders discovers later additions; browser builds use data/music-catalog.json and its offline script mirror.

## HUD architecture
HP is Blood; MP is Cerebral. Portrait layers back-to-front: ONE selected background, Candy Portrait 1A, Portrait Chassis, Portrait TV Lense. Every layer preserves its 766×681 canvas. Background defaults: >90% black; >70%–90% Level 1; >30%–70% Level 2; <=30% Level 3. Thresholds are editable and percentages use the authored maximum. No fabricated grimace or low-Blood art: Candy's supplied single portrait remains through damage. Accessible portrait text/title reports Blood and Cerebral values.
img/ui/portrait-tv owns chassis/lens; img/portraits/candy owns character states; img/portraits/sanity retains authored filenames for Cerebral backgrounds. Former TV A/B are superseded reference assets.
Layer 4 is one movable combined module: upper round screen holds weapon identity/ammunition, lower round screen holds immersion and inspection content. Its bottom rectangular screen is unassigned. The separate Vitality TV is removed. Long descriptions scroll within the lower screen and hover/wheel pauses automatic scrolling.
Phanicom Remote Fixed is in img/ui. Inventory and Power hotspots use normalized full-image rectangles and consume only their button areas. Layout handles remain available in HUD layout mode; extra INV/PLAY/ASK overlays are removed. The old chassis skin selector is hidden because it does not apply to this authored stack.

## Melee and persistence
Melee reuses the ported arc/range/damage/cooldown logic and the nearby spatial query. It creates no projectile, muzzle flash or ammo deduction. Blank melee sprite profile uses the current armed artwork as a temporary fallback; a calibrated melee profile can be assigned when the new sheet arrives. Weapon magazines persist across switching and playtest saves; Cerebral values, rules, source flags and thresholds also round-trip. Inactive weapon magazine counts are validated scalar data.
Normal-mapped lighting and textured map transfers remain future milestones; no missing portrait or melee art is generated in this build.

## Maintenance and validation
src/cerebral.js owns rule validation, percentage bands, proximity timing and starter melee configuration. src/device-hud.js owns cached compositing and percentage HUD hit areas/layout. app.js binds controls and invokes these modules; world.js/save.js validate persistent fields. Extend validation before adding state.
Portrait canvases redraw only when an image loads or the background band changes. Music folders are scanned only on opening/refresh. Melee and Cerebral use existing nearby spatial queries. Assets ship locally.
Tests cover legacy combat/events/terrain/fog/culling, Cerebral boundaries/timers, browser HUD layers and thresholds, real proximity source, melee hit/no ammo, invisible Inventory hotspot in fullscreen, rule edits, world round-trip and equipment keys. Native package verification is recorded separately in the Windows report.
