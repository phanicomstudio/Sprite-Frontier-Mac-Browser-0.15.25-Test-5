# Patrol and party encounter

Open the editor, select Map, then choose **Add patrol and party encounter map**. This adds a separate flat map without overwriting existing maps or changing project starting values. Enter playtest and speak to Recruit combat companion at (3, 7). The event adds party actor 7; its combat event appears at (6, 7) and approaches the patrol ahead. The opponent patrols between (12, 7) and (12, 10).

Both combatants use editable event behavior profiles and existing test hitscan definitions. Companion membership controls appearance; shared targeting selects opponents and suppresses allied damage by default. These fixture weapons and statistics do not define the future skill, weapon or armor rules.

Windows Chrome live testing verifies separate map creation, conditional appearance, recruitment, ally targeting, actual damage and opponent defeat with the companion alive. Runtime event initiation is used for recruitment; dialogue continuation uses the UI. The test caught missing projectile collision for nonblocking combat events: movement collision and projectile damageability are now independent in both spatial and legacy collision paths. The cached source suite passes after this change.

Windows Chrome save/reload now also verifies party membership, a living companion and the defeated opponent's zero HP/dead state. The test deliberately clears membership and revives the live opponent before import, proving restoration rather than observing unchanged values.

Actual MZ Transfer Player commands now also pass a Windows Chrome round trip through the vector demo: membership remains shared, the opponent remains dead with zero HP after return, and map-local behavior home positions remain unchanged. The companion event is authored on the encounter map; this does not prove automatic companion spawning on other maps.

Still required: mouse interaction/authoring acceptance, portable test packaging, and Windows native/macOS platform acceptance. Companion follow formations, cross-map companion spawning, equipment database and general actor lifecycle are not established by this fixture.
