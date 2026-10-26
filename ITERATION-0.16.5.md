# Sprite Frontier 0.16.5 — return to the entered door side

October 26, 2026. Supersedes 0.16.3/0.16.4's unconditional authored-facing arrival on return trips. Existing transition effects remain presentation-only.

## Current behavior

A successful door departure records which side the player approached in the source cell. Returning through the reciprocating door places the player 0.3048 metres (one foot) from that door on the same approach side, facing away. Approach side is measured against the authored door normal; it works even if that normal points opposite the side used by the player. The remembered sign follows the door's current position/orientation rather than stale world coordinates.

The rule is shared by DOOM melt, cinematic 3D doors, fades and immediate cuts. It does not depend on animation direction or transition artwork. Perspective camera yaw and movement/actor facing agree with the outward arrival. Fixed and isometric cells keep their authored cameras and receive a projected outward cursor target, so the next armed aiming update cannot turn the player back. A first-person view remains first-person across paired 3D-cell transfers; first-person zoom remains disabled.

Destination doors not previously used retain their authored walkable-side default. Once a door is used, the latest successful approach side becomes its return side. New ordinary doors already default to automatic reciprocal pairing. Named door selections still identify exact pairs when multiple doors exist; ambiguous automatic pairings reject rather than guess. Explicit advanced coordinate/map-spawn transfers remain available and are not silently converted into paired-door links.

If the remembered arrival side is blocked, the transfer rejects visibly. It never searches the opposite side as a fallback. Source-door identity comes from the actual event interaction, so several doors between the same two cells do not share a single side record. Legacy direct travel callers may infer a source only when exactly one matching door exists.

## Persistence and compatibility

Gameplay hub state gains an additive doorSides array of stable map ID, event ID and +1/-1 sign. It is saved by the existing playtest save system and validated before load. Old saves without it adopt an empty array. Duplicate identities, malformed signs and oversized records reject before adoption. At most 100,000 distinct used doors are retained; capacity is checked before transfer and records are never silently evicted. There is no per-frame traversal/logging or new render pass.

Memory is updated only after a successful transfer commit; failed blocked/ambiguous arrivals leave it untouched. Fresh playtests still start fresh gameplay state. Authored map data, event definitions, sprite presentation, muzzle calibration and physical projectiles are unchanged. The existing desktop save profile remains in use. Older engine versions ignore the new memory field; returning to such an older engine cannot provide this new guarantee.

## Validation and delivery

The unit test covers four rotations, both approach sides, exact one-foot/outward placement, save/load, old saves, invalid and ambiguous pairs. The real browser and complete Windows executable tests activate production door interactions and complete all four effect timelines, deliberately approaching opposite the authored normal. They verify return position, perspective heading, first-person retention, blocked-side rejection and outward armed aim in fixed/isometric views after normal updates. The core gameplay suite, hub persistence, door timelines, transitions, export inventory, 0.16.4 input/fog acceptance and maintained-function comment coverage also run.

This is a complete Windows-only iteration, preserving 0.16.4 and earlier releases. No third-party code/assets or new licensing obligations were introduced. See RELEASE-VALIDATION-0.16.5.json and FUNCTION-REFERENCE-0.16.5.md.
