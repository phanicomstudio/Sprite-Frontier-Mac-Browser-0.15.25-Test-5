# Function reference additions — 0.16.21

November 1, 2026. Prior references remain historical/current for unchanged functions.

- `FrontierFirstPerson.validate(value)`: detached character-profile image/animation definitions; checks source safety, numeric bounds and resource limits. Throws before adoption.
- `FrontierFirstPerson.assignment(player)`: matching equipped-weapon/character entry, or Candy handgun default; null for holstered/unmatched characters. No mutation.
- `FrontierFirstPerson.draw(ctx, game, cam)`: bounded lazy image cache, movement sway, firing-frame timing and recovery, shared normal/world-light rendering and muzzle flash. Returns whether drawn. Uses view pixels and seconds; never changes gameplay aim. Unsupported views/images return false.
- `FrontierLocalLighting.sample(snapshot,x,y,z,out,ownerId)`: optional actor ID filters only light records explicitly excluding that owner. World XYZ in metres, reusable RGB output; ownership participates in static cache keys. Existing calls without an ID retain their semantics.
- `FrontierSunShadows.draw163`: retains deferred cache, refreshes oldest grids first with ID tie-breaks and rejects orthographic sun casting. Shader depth tolerance accounts for receiver slope over one CPU-depth texel. Existing terrain/static-geometry receiver sweeps, eight-caster and 90-ray limits remain.
- Weapon editor import handlers read one bounded PNG/WebP into a draft; Apply owns persistence. Validation/decode failures retain previous saved definitions.

Coverage check: tests/function-comments1516.cjs. Behavioral entry point: `test:iteration1621`; existing lighting/combat/export tests remain required. Source comments describe internal ownership and failure behavior.
