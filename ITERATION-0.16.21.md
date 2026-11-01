# Iteration 0.16.21 — first-person weapons, owner lighting and shadow stability

November 1, 2026. Supersedes the pending November 1 implementation roster in NEXT-ITERATION-NOTES.md for the behavior below. Prior notes and releases remain intact.

## Delivered behavior

- Candy's supplied transparent 1920 × 1080 pistol frame is preserved byte-for-byte under `img/weapons/first-person/candy/pistol/armed-test.png`. It appears only in perspective first-person while the pistol is unholstered. No unarmed artwork is invented.
- Character/weapon assignments live in existing project weapon overrides, not a parallel save system. Weapon settings offer image import/path, character sprite-profile ID, uniform animation rows/columns, firing FPS, scale and normalized muzzle position. First frame is idle; a shot plays the supplied firing strip, if any. Candy currently has one frame. Reload/equip artwork has not been supplied and is not claimed.
- Movement drives light viewmodel sway with exponential settling. Weapon-specific cooldown determines bounded visual shot recovery. This does not shake the camera, move the crosshair, alter physical aim or change the locked third-person sprite plane. Flashes use the displayed muzzle anchor; physical projectile creation and collision remain authoritative.
- A fresh inward wheel action at the settled closest third-person zoom enters first-person during perspective 3D gameplay. Fixed and isometric map wheel behavior is unchanged. First-person itself still has no zoom. V remains the explicit camera toggle; wheel-out return is not introduced.
- The passive player pool excludes its owning actor from scalar and live-normal illumination. Scene lights, sunlight and the player's own mandatory projectile lights continue to affect the player. First-person artwork uses the shared automatic normal cache and world-light path.
- Existing per-map lighting controls now explain near-zero ambient, map-specific player light and outdoor sunlight. For dark interiors: enable lighting, lower Ambient brightness, add lamps/torches and choose whether Player light is on. For night: lower ambient and disable outdoor sunlight if appropriate. Apply uses existing transactional map persistence.
- Sun receiver grids retain cached silhouettes when their refresh is deferred. Oldest-grid scheduling prevents starvation during rotation; stable ID ties avoid equal-distance reorder. Limits remain eight casters/two grid rebuilds (90 rays) per frame. Projected receiver slope informs the existing coarse-depth rejection to reduce self-rejection on terrain. No extra depth samples/readbacks or logging were added. Sun silhouettes are perspective-only; isometric uses its separate contact blobs.
- Newly created armed enemy archetypes use aggressive behavior, 15% base cover chance (with existing aggressive modifier) and 0.35 s burst pause, in addition to actual weapon cadence. Existing authored enemies retain their chosen behavior. Existing continuous aiming, collision, accuracy, hit reaction, blood/gib types, damage and sound customization remain intact.

## Reference and limits

Bakersfield is the combat/art direction reference; this release does not claim identical animation, sound, timings or a complete visual recreation. Its concrete combat changes are the first-person weapon feedback and engagement defaults; existing hit/death/impact mechanics were regression-tested rather than silently replaced. The comparison courtyard art scene remains a proposed design exercise, not a delivered map.

First-person image imports are PNG/WebP, up to 8 MB each, validated with a 24 MB encoded per-weapon assignment budget and 32 character entries. Packaged paths remain relative. Runtime image retention is bounded at 32 distinct sources and 64 MiB decoded RGBA; unsupported/failed images retain a usable world view. Automatic normal generation retains existing size/cache limits and custom shader/world-light ownership. No new per-frame image decoding or normal generation is introduced.

## Validation

Core suites, first-person assignment/schema round trip, actual browser wheel/overlay/holster behavior, owner-light exclusion and projectile response, six-caster shadow budget stability, existing combat authoring/aim/flashes/cover/death, mandatory projectile persistence, live sprite/terrain/model normals and runtime export inventory are checked. Screenshot verification confirms alpha and framing with the existing HUD.

Warmed render measurements (this workstation, draw-only, not universal FPS): normals enabled median third/first/isometric 8.3 / 9.0 / 8.1 ms; p95 12.2 / 14.1 / 11.2 ms. One world submission per frame, bounded normal cache, no recurring warmed normal generation. Timing variance prevents a zero-cost claim. The shadow scheduling test establishes no budget-induced disappearance; it cannot establish absence of every possible project-specific geometry/depth artifact.
