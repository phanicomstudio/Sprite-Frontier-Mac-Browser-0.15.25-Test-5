/* MAINTAINER GUIDE
 * Original Frontier 2D projectile implementation retained for baseline tests. spatial.js replaces its public entry points in the running game. Update the native host, not this reference implementation, for 3D behavior.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* 0.20.2d — World-space ballistics, independent of camera and effects lifetime.
 * Units: x/y and radii are world cells; speed is cells/second; time is seconds.
 * Sweep a disk across each blocker/target, choosing the earliest contact. A
 * long dt therefore cannot tunnel through a thin wall. Polygons use their true
 * edges, including concave outlines; no broad footprint is added over door gaps.
 * Simulation emits impact/travel records; combat owns damage and renderer owns
 * projection. Future motion/impact policies can replace those boundaries without
 * turning visual tracers into physical entities. No future physics is simulated.
 */
(/* @function projectiles.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf create projectile; mf sweep projectile; mf update projectiles; mf resolve hitscan; mf projectile geometry. */ function (MF) {
"use strict"  ;
  const EPS = 1e-9;
  const dot = /* @function projectiles.dot.2 — Returns a x multiplied by b x plus a y multiplied by b y. Inputs: a; b. Returns: a x multiplied by b x plus a y multiplied by b y. */ (a, b) => a.x * b.x + a.y * b.y;
  const sub = /* @function projectiles.sub.3 — Returns a record containing x, y. Inputs: a; b. Returns: a record containing x, y. */ (a, b) => ({
    x: a.x - b.x, y: a.y - b.y
  }
  );
/** Earliest t in [0,1] at which segment a→b enters a circle; null = miss. */
  /* @function projectiles.circleHit.4 — Earliest t in [0,1] at which segment a→b enters a circle; null = miss. Inputs: a; b; c; r. Uses: sub; dot. Returns: 0; null. */ function circleHit(a, b, c, r) {
    const d = sub(b, a),
    m = sub(a, c),
    aa = dot(d, d),
    cc = dot(m, m) - r * r;
    if (cc <= EPS) return 0;
    if (aa < EPS) return null;
    const bb = dot(m, d),
    disc = bb * bb - aa * cc;
    if (disc < 0) return null;
    const t = (-bb - Math.sqrt(disc)) / aa;
    return t >= -EPS && t <= 1 + EPS ? Math.max(0, Math.min(1, t)) : null;
  }
/** Capsule intersection for a polygon edge: endpoint circles plus both sides
   * of the edge's radius-wide strip. This retains rounded disk collision at
   * corners instead of overblocking with a rectangular broad-phase expansion.
   */
  /* @function projectiles.edgeHit.5 — Capsule intersection for a polygon edge: endpoint circles plus both sides of the edge's radius-wide strip. This retains rounded disk collision at corners instead of overblocking with a rectangular broad-phase expansion. Inputs: a; b; u; v; r. Uses: take; circle hit; sub; dot. Returns: best; best. */ function edgeHit(a, b, u, v, r) {
    let best = null;
    const take = /* @function projectiles.take.6 — Handles take within projectiles. Inputs: t. Updates: best. */ (t) => {
      if (t !== null && (best === null || t < best)) best = t;
    }
    ;
    take(circleHit(a, b, u, r));
    take(circleHit(a, b, v, r));
    const e = sub(v, u),
    len = Math.hypot(e.x, e.y);
    if (len < EPS) return best;
    const tangent = {
      x: e.x / len, y: e.y / len
    }
    ,
    normal = {
      x: -tangent.y, y: tangent.x
    }
    ;
    const m = sub(a, u),
    d = sub(b, a),
    n = dot(m, normal),
    dn = dot(d, normal);
    const along = dot(m, tangent);
    if (Math.abs(n) <= r + EPS && along >= 0 && along <= len) take(0);
    if (Math.abs(dn) > EPS)
    for (const side of [-r, r]) {
      const t = (side - n) / dn,
      at = along + t * dot(d, tangent);
      if (t >= 0 && t <= 1 && at >= -EPS && at <= len + EPS) take(t);
    }
    return best;
  }
/** Union edge capsules with the filled polygon; supports concave blockers and
   * returns an immediate hit for shots spawned inside solid geometry. */
  /* @function projectiles.polygonHit.7 — Union edge capsules with the filled polygon; supports concave blockers and returns an immediate hit for shots spawned inside solid geometry. Inputs: a; b; points; r. Updates: best. Uses: window mfgeometry point in polygon; edge hit. Returns: 0; best. */ function polygonHit(a, b, points, r) {
    if (window.MFGeometry.pointInPolygon(a, points)) return 0;
    let best = null;
    for (let i = 0;
    i < points.length;
    i++) {
      const t = edgeHit(a, b, points[i], points[(i + 1) % points.length], r);
      if (t !== null && (best === null || t < best)) best = t;
    }
    return best;
  }
  const rectPoints = /* @function projectiles.rectPoints.8 — Returns a list of a record containing x, y, a record containing x, y, a record containing x, y, a record containing x, y. Inputs: z. Returns: a list of a record containing x, y, a record containing x, y, a record containing x, y, a record containing x, y. */ (z) => [
  {
    x: z.x1, y: z.y1
  }
  ,
  {
    x: z.x2, y: z.y1
  }
  ,
  {
    x: z.x2, y: z.y2
  }
  ,
  {
    x: z.x1, y: z.y2
  }
  ,
  ];
/** Shared physical query for hitscan and projectiles. Visual picking only
   * supplies an aim direction; it never decides whether a bullet caused damage.
   */
  /* @function projectiles.sweepProjectile.9 — Shared physical query for hitscan and projectiles. Visual picking only supplies an aim direction; it never decides whether a bullet caused damage. Inputs: game; p; a; b. Uses: grid get collision zones; take; polygon hit; rect points. Returns: null; hit. */ function sweepProjectile(game, p, a, b) {
    const map = game.maps[p.map];
    if (!map) return null;
    let hit = null;
    const take = /* @function projectiles.take.10 — Handles take within projectiles. Inputs: t; id; kind. Updates: hit. */ (t, id, kind) => {
      if (t !== null && (!hit || t < hit.t - EPS)) hit = {
        t, id, kind
      }
      ;
    }
    ;
    const grid = game.runtime.grid;
    for (const zone of grid.getCollisionZones(p.map)) {
      if (zone.id === p.ownerId) continue;
      take(polygonHit(a, b, rectPoints(zone), p.radius), zone.id, "body");
    }
    for (const poly of grid.getBlockingPolygons(p.map)) {
      if (poly.id === p.ownerId) continue;
      take(polygonHit(a, b, poly.points, p.radius), poly.id, "wall");
    }
    for (const e of map.entities) {
      if (e.id === p.ownerId || e.hidden || e.alive === false || e.dead)
      continue;
// Bottles have no movement blocker; their independent hit radius is real
// world geometry. Other bodies already come from GridSystem.
      if (e.type === "bottle")
      take(
      circleHit(a, b, e, (e.projectileRadius ?? 0.1) + p.radius),
      e.id,
      "target",
      );
    }
    const player = game.player;
    if (player && p.ownerId !== player.id && p.map === game.currentMapId)
    take(
    circleHit(a, b, player, MF.CONFIG.playerCollisionRadius + p.radius),
    player.id,
    "target",
    );
// Leaving a map consumes the shot at the boundary, never in another map.
    for (const [axis, max] of [
    ["x", map.size.w],
    ["y", map.size.h],
    ]) {
      if (a[axis] < p.radius || a[axis] > max - p.radius)
      take(0, null, "boundary");
      const delta = b[axis] - a[axis];
      if (delta > 0 && b[axis] > max - p.radius)
      take((max - p.radius - a[axis]) / delta, null, "boundary");
      if (delta < 0 && b[axis] < p.radius)
      take((p.radius - a[axis]) / delta, null, "boundary");
    }
    return hit;
  }
/** Configuration is cloned into each shot: switching weapons cannot change a
   * bullet already in flight. Range/lifetime cap travel before the sweep.
   */
  /* @function projectiles.createProjectile.11 — Configuration is cloned into each shot: switching weapons cannot change a bullet already in flight. Range/lifetime cap travel before the sweep. Inputs: game; owner; weapon; direction. Returns: a record containing id, map, ownerId, weaponId, damage, damageType, position, previousPosition. */ function createProjectile(game, owner, weapon, direction) {
    const cfg = weapon.projectile || {
    }
    ,
    len = Math.hypot(direction.x, direction.y) || 1;
    const d = {
      x: direction.x / len, y: direction.y / len
    }
    ;
    const speed = cfg.speed ?? 45;
    return {
      id: "projectile-" + ++game.projectileSerial,
      map: game.currentMapId,
      ownerId: owner.id,
      weaponId: weapon.id,
      damage: weapon.damage ?? 6,
      damageType: weapon.caliber || "ballistic",
      position: {
        x: owner.x, y: owner.y
      }
      ,
      previousPosition: {
        x: owner.x, y: owner.y
      }
      ,
      direction: d,
      velocity: {
        x: d.x * speed, y: d.y * speed
      }
      ,
      speed,
      radius: cfg.radius ?? 0.015,
      maxRange: cfg.range ?? 18,
      lifetime: cfg.lifetime ?? 2,
      age: 0,
      distanceTravelled: 0,
      visual: {
        z: cfg.visualZ ?? 30,
        color: cfg.tracerColor || "#ffcf70",
        life: cfg.tracerLife ?? 0.08,
      }
      ,
      impact: cfg.impact || "stop",
      motion: "linear",
    }
    ;
  }
/** Records use world endpoints. Camera movement cannot detach a tracer. */
  /* @function projectiles.emitTravel.12 — Records use world endpoints. Camera movement cannot detach a tracer. Inputs: game; p; a; b. Uses: game shot effects push; game shot effects shift. Returns: without a result. */ function emitTravel(game, p, a, b) {
    if (p.visual.life <= 0) return;
    game.shotEffects.push({
      map: p.map,
      from: {
        ...a
      }
      ,
      to: {
        ...b
      }
      ,
      z: p.visual.z,
      color: p.visual.color,
      life: p.visual.life,
      maxLife: p.visual.life,
    }
    );
    if (game.shotEffects.length > 256) game.shotEffects.shift();
  }
/** Integrate bounded travel, stop at the earliest contact and publish impact.
   * Returns whether the shot remains alive. instant uses range rather than dt,
   * allowing hitscan to share all obstruction and damage semantics. */
// Move a projectile within remaining range/lifetime, resolve its first hit, and handle penetration or one scenery ricochet.
  /* @function projectiles.advance.13 — Move a projectile within remaining range/lifetime, resolve its first hit, and handle penetration or one scenery ricochet. Inputs: game; p; seconds; ui; assignment pattern. Updates: p previous position; p position; p distance travelled; p age. Uses: sweep projectile; emit travel; mf resolve projectile impact. Returns: false; false. */ function advance(game, p, seconds, ui, instant = false) {
    const remaining = Math.max(0, p.maxRange - p.distanceTravelled);
    const distance = instant
    ? remaining
    : Math.min(
    remaining,
    p.speed * Math.min(seconds, Math.max(0, p.lifetime - p.age)),
    );
    const a = {
      ...p.position
    }
    ,
    b = {
      x: a.x + p.direction.x * distance,
      y: a.y + p.direction.y * distance,
    }
    ;
    p.previousPosition = a;
    const hit = sweepProjectile(game, p, a, b),
    t = hit?.t ?? 1;
    p.position = {
      x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t
    }
    ;
    p.distanceTravelled += distance * t;
    p.age += seconds;
    emitTravel(game, p, a, p.position);
    if (hit) {
      MF.resolveProjectileImpact(game, p, hit, ui);
      return false;
    }
    if (
    instant ||
    p.age >= p.lifetime - EPS ||
    p.distanceTravelled >= p.maxRange - EPS
    ) {
      MF.resolveProjectileImpact(game, p, {
        id: null, kind: "expiry"
      }
      , ui);
      return false;
    }
    return true;
  }
  /* @function projectiles.updateProjectiles.14 — Handles update projectiles within projectiles. Inputs: game; dt; ui. Updates: game projectiles. Uses: game projectiles filter. */ function updateProjectiles(game, dt, ui) {
// Pausing/transition gating is owned by main.update. Map entry clears shots.
    game.projectiles = game.projectiles.filter(
    /* @function projectiles.callback.15 — Returns p map equals game current map id and advance using game, p, dt. Inputs: p. Uses: advance. Returns: p map equals game current map id and advance using game, p, dt. */ (p) => p.map === game.currentMapId && advance(game, p, dt, ui),
    );
  }
  MF.createProjectile = createProjectile;
  MF.sweepProjectile = sweepProjectile;
  MF.updateProjectiles = updateProjectiles;
  MF.resolveHitscan = /* @function projectiles.resolveHitscan.16 — Returns advance using game, p, 0. Inputs: game; p; ui. Uses: advance. Returns: advance using game, p, 0. */ (game, p, ui) => advance(game, p, 0, ui, true);
  MF.projectileGeometry = {
    circleHit, polygonHit
  }
  ;
}
)((window.MF = window.MF || {
}
));
