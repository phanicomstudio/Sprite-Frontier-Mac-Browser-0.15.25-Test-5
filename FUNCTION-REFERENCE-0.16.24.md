# Function reference additions — 0.16.24

November 1, 2026.

- FrontierHorizonFog.profile(game,cam): effective fog color, camera-horizon Y and projected upward fade in logical pixels, or null for disabled/interior/orthographic cases. Uses world metres for fog range. Does not modify saved settings.
- FrontierHorizonFog.opacity(profile,y): smooth bounded 0–1 background coverage for tests/CPU reasoning; no state change.
- FrontierHorizonFog.draw(ctx,game,cam): one lazy pooled Pixi quad and uniforms, drawn inside the existing world submission before foreground geometry. Returns false when inapplicable. Bounded Canvas bands are fallback; unsupported adapters skip safely. No readbacks or texture generation.
- FrontierFirstPerson.spriteScale(game,actor,cam,feetProjection): first-person-only pixels/metre from horizontal camera-forward distance; otherwise returns original projected scale exactly. Avoids feet-height/pitch size coupling without moving actors or replacing billboard planes. Behind/near-degenerate actors retain the prior scale fallback.

Regression entry: test:iteration1624; tests/horizon1624.cjs and tests/browser/horizon1624.cjs. Existing aim1623, projectile-light-always1619 and live-normals1618 remain applicable. Function-comment gate remains tests/function-comments1516.cjs.
