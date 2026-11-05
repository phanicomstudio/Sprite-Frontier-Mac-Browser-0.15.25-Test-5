# Sprite Frontier 0.16.6 — readable arrivals, close isometric zoom and contact feedback

October 26, 2026. Implements the user's three follow-up reports. Supersedes the one-foot paired-door offset from 0.16.3–0.16.5 and the 100 px/m transient zoom cap from 0.16.4. Earlier source, explanations and releases remain preserved.

## Door arrival and camera framing

The prior one-foot placement could leave the third-person camera pinned against the door leaf, rendering the player thousands of pixels tall. Paired doors now begin at five feet (1.524 m) on the remembered approach side, facing away. Preflight tries up to seven points in one-foot increments, five to eleven feet from the door, and chooses the first safe point with readable actual collision-constrained third-person framing. The bundled obstructed door test settles around eight feet, matching the user's visual reference much better than the original close-up.

Preflight checks room/event/prop standing space, actual model body collision and a three-height swept corridor from just outside the target leaf. Ignoring that transferred-through leaf in the corridor query does not ignore any other wall or model. Thin intervening walls still block the larger spawn offset. The third-person body must fit within 60% of logical screen height with head/feet margins; the camera retains its existing projection and collision rather than ignoring walls or shrinking the sprite artwork. Fixed/isometric and first-person retain their own camera presentation. If no clear same-side point fits, the transfer rejects visibly instead of spawning behind the door or through another wall. This means very confined spaces may require an explicitly authored advanced arrival or a suitable camera presentation.

All four door effects use this preflight and the same saved approach-side memory. The 0.16.5 outward heading, first-person retention, fixed/isometric cursor alignment and blocked-side rule remain. Advanced explicit coordinate arrivals stay available.

## Isometric wheel zoom

The transient playtest scale now reaches 200 logical pixels/metre instead of 100. The authored starting-scale bounds remain 12–100 and saved values are unchanged. At maximum, the 1.65 m player projects to 330 logical pixels, compared with approximately 258 at the unobstructed closest normal third-person distance. The camera's feet anchor moves down as zoom increases so a grounded full-size character fits within the 480-pixel view. Shared projection, cursor inversion, frame snapping and calibrated muzzle logic remain authoritative; no sprite-tilt/proportion changes or first-person zoom were introduced.

Very close zoom naturally shows less surrounding space. During large jumps the receiving ground may leave that tightly cropped view; wheel out for a broader view. There is no automatic zoom jump or change to physics.

## Subtle isometric contact blobs

A small soft blob remains on the receiving terrain, room floor or static geometry beneath each nearby eligible character. It is separate from outdoor sun silhouettes and does not require sunlight indoors. As height above its receiver increases, radius shrinks gently from 0.30 to 0.24 m over two metres, opacity falls from 0.16 to 0.08 and the edge softens. Landing restores the contact size/density. It follows horizontal motion and the actual ground rather than floating at sprite height. Water-submerged, hidden, transparent and dead actors skip the effect; void/disconnected receiver triangles are omitted.

The effect is currently for opted-in isometric geometry gameplay, not prerendered artwork or perspective cameras. It uses the existing geometry-only swept receiver service, a pooled analytic radial shader and depth occlusion, with no new image asset. Terrain vertex heights update cheaply between cached geometry queries. Fixed budgets are eight nearby characters, nine vertices/eight triangles per blob and at most one nine-ray receiver rebuild per frame. The packed existing CPU depth upload is shared with sun shadows when available; otherwise one reusable depth source is updated. There are no production GPU readbacks, per-frame logs, per-character image textures or unbounded mesh allocation.

## Verification and local delivery

Browser and complete Windows executable tests activate actual door interactions for melt/cinematic/fade/immediate round trips, measure the resulting player projection after ordinary updates and retain the original approach side. Real wheel input proves zoom parity and full grounded-body framing; real keyboard jump/gravity proves floor attachment, smaller/lighter airborne blob and restored landing contact. GPU pixel comparison confirms the blob actually contributes visible pixels, and focused timing checks exercise the bounded cost. Core gameplay, prior input/fog, shared authoring/door/sun receiver tests, export inventory and function-comment coverage also run. See RELEASE-VALIDATION-0.16.6.json for measured evidence and limits.

Delivery remains a complete Windows-only package using the existing desktop save profile. No new third-party code/assets or licensing obligations. Source changes are a review branch stacked on the prior iteration; earlier releases remain intact.

## Editor/playtest fullscreen access

Later October 26 steering confirms fullscreen must remain available from the editor for playtesting, not just exports. The original Fullscreen button is now in the main workspace toolbar instead of buried in Advanced tools, retaining its existing handler. It remains reachable above the pause panel. If the mouse is captured, press Escape before clicking it. F2 switches between editing/playtesting while the viewport is fullscreen; during playtest, Escape opens pause and Options > Exit Fullscreen leaves it. No duplicate fullscreen owner or export-only restriction was introduced.

Real Chrome and Windows UI tests enter fullscreen from editing and playtesting and exit through the existing pause option. Native checks wait for actual fullscreen events/window restoration rather than assuming synchronous transitions.
