/* MAINTAINER GUIDE
 * Native height-aware projectile sweeps and ricochets. Replaces the legacy 2D projectile functions after they load. Segment/AABB hits and terrain intersections choose the earliest collision, independent of display pixels.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function spatial.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf create projectile; mf update projectiles; mf resolve hitscan; mf frontier spatial. */
(/* @function spatial.installReviewed — Installs native height-aware projectile sweeps, terrain intersections and ricochets, replacing legacy 2D projectile public entry points. Earliest segment collisions use world coordinates/elevation, independent of display pixels. Inputs: existing MF engine namespace MF. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  MF,
) {
  const root = window;
  ("use strict");
  const originalCreate = MF.createProjectile;
  // Intersect a swept segment with an expanded AABB using slab intervals. Return earliest normalized time or null.
  /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.boxHit.2 — Intersect a swept segment with an expanded AABB using slab intervals. Return earliest normalized time or null. Inputs: a; b; box; radius. Updates: array pattern; enter; leave. Returns: null; null. */
  /* @function spatial.reviewedboxHit_2 — Intersects swept XYZ segment against radius-expanded axis-aligned bounds. Inputs: endpoint records a/b, box min/max and radius metres. Returns earliest normalized segment time0-1 or null on miss, including0 when initially inside. Slab tolerance1e-9 handles parallel directions. No mutation; assumes finite ordered bounds/nonnegative radius. */ function boxHit(
    a,
    b,
    box,
    radius,
  ) {
    let enter = 0,
      leave = 1;
    for (const axis of ["x", "y", "z"]) {
      const min = box.min[axis] - radius,
        max = box.max[axis] + radius,
        d = b[axis] - a[axis];
      if (Math.abs(d) < 1e-9) {
        if (a[axis] < min || a[axis] > max) return null;
      } else {
        let lo = (min - a[axis]) / d,
          hi = (max - a[axis]) / d;
        if (lo > hi) [lo, hi] = [hi, lo];
        enter = Math.max(enter, lo);
        leave = Math.min(leave, hi);
        if (enter > leave) return null;
      }
    }
    return enter;
  }
  const between =
    /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.between.3 — Returns a record containing x, y, z. Inputs: a; b; t. Returns: a record containing x, y, z. */
  /* @function spatial.reviewedbetween_3 — Interpolates a world-space segment. Inputs: a/b XYZ metre records and scalar t. Returns new XYZ coordinates; no clamp/mutation, so caller owns normalized t validity. */ (
      a,
      b,
      t,
    ) => ({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      z: a.z + (b.z - a.z) * t,
    });
  // Choose the nearest body/scenery/terrain collision; ignore the shooter and already penetrated entities.
  /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.sweep.4 — Choose the nearest body/scenery/terrain collision; ignore the shooter and already penetrated entities. Inputs: game; a; b; radius; owner id; ignore ids. Updates: lo; hi. Uses: root frontier activity query using game, math min using a x, b x minus radius minus 2, math min using a y, b y minus radius minus 2 filter; root frontier activity query; game scene events or a list of filter; entities push. Returns: result. */
  /* @function spatial.reviewedsweep_4 — Finds earliest body/terrain/map-boundary projectile hit. Inputs: game, world XYZ endpoints, radius metres, shooter ownerId and optional ignored-ID Set. Returns t/id/kind or null. Uses activity broad phase when installed, height-aware expanded body AABBs and adds player for nonplayer shots. Terrain sampled at0.08-metre spacing then14 bisections, flat floor analytic; map boundaries use radius inset. Does not test imported model meshes/room faces here; separate integration owns any additional geometry. No actor mutation; cache allocation/service errors propagate. */ function sweep(
    game,
    a,
    b,
    radius,
    ownerId,
    ignoreIds,
  ) {
    let result = null;
    const take =
      /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.take.5 — Handles take within spatial. Inputs: t; id; kind. Updates: result. */
  /* @function spatial.reviewedtake_5 — Retains nearest valid sweep hit. Inputs: normalized t or null, entity id and collision kind. Returns undefined; updates captured result only for t0-1 nearer than current. No gameplay mutation. */ (
        t,
        id,
        kind,
      ) => {
        if (t !== null && t >= 0 && t <= 1 && (!result || t < result.t))
          result = {
            t,
            id,
            kind,
          };
      };
    const entities = root.FrontierActivity
      ? root.FrontierActivity.query(
          game,
          Math.min(a.x, b.x) - radius - 2,
          Math.min(a.y, b.y) - radius - 2,
          Math.max(a.x, b.x) + radius + 2,
          Math.max(a.y, b.y) + radius + 2,
          false,
        ).filter(
          /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.callback.6 — Returns the inverse of e event id or e solid or e combat. Inputs: e. Returns: the inverse of e event id or e solid or e combat. */
  /* @function spatial.reviewedcallback_6 — Keeps broad-phase projectile collision candidates. Inputs: e. Returns true/truthy for non-event scenery or solid/combat events. No mutation; utility nonsolid events excluded. */ (
            e,
          ) => !e.eventId || e.solid || e.combat,
        )
      : [
          ...game.maps.frontier.entities,
          ...(game.sceneEvents || []).filter(
            /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.callback.7 — Returns e solid or e combat. Inputs: e. Returns: e solid or e combat. */
  /* @function spatial.reviewedcallback_7 — Keeps fallback event collision candidates. Inputs: e. Returns solid/combat truthiness; no mutation. */ (
              e,
            ) => e.solid || e.combat,
          ),
        ];
    if (ownerId !== game.player.id)
      entities.push({
        ...game.player,
        radius: MF.CONFIG.playerCollisionRadius,
        height: 1.65,
      });
    const minX = Math.min(a.x, b.x) - radius,
      maxX = Math.max(a.x, b.x) + radius,
      minY = Math.min(a.y, b.y) - radius,
      maxY = Math.max(a.y, b.y) + radius;
    for (const e of entities) {
      if (
        e.x + e.radius < minX ||
        e.x - e.radius > maxX ||
        e.y + e.radius < minY ||
        e.y - e.radius > maxY
      )
        continue;
      if (
        e.id === ownerId ||
        ignoreIds?.has(e.id) ||
        e.dead ||
        e.hidden ||
        e.alive === false
      )
        continue;
      const z = e.z || 0;
      if (
        Math.max(a.z, b.z) + radius < z ||
        Math.min(a.z, b.z) - radius > z + e.height
      )
        continue;
      take(
        boxHit(
          a,
          b,
          {
            min: {
              x: e.x - e.radius,
              y: e.y - e.radius,
              z,
            },
            max: {
              x: e.x + e.radius,
              y: e.y + e.radius,
              z: z + e.height,
            },
          },
          radius,
        ),
        e.id,
        "body",
      );
    }
    const distance = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z),
      steps = Math.max(1, Math.ceil(distance / 0.08));
    const floor =
      /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.floor.8 — Handles floor within spatial. Inputs: t. Uses: between; frontier terrain height. Returns: p z minus frontier terrain height using game source world, p x, p y minus radius. */
  /* @function spatial.reviewedfloor_8 — Computes projectile bottom clearance above terrain. Inputs: normalized segment t and captured a/b/radius/game. Returns metres (sample Z minus terrain height minus radius). No mutation; terrain failures propagate. */ (
        t,
      ) => {
        const p = between(a, b, t);
        return (
          p.z - FrontierTerrain.height(game.sourceWorld, p.x, p.y) - radius
        );
      };
    if (game.sourceWorld.terrain?.mode === "flat") {
      if (a.z <= radius) take(0, null, "terrain");
      else if (b.z <= radius)
        take((a.z - radius) / (a.z - b.z), null, "terrain");
    } else if (floor(0) <= 0) take(0, null, "terrain");
    else
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        if (result && t > result.t + 1 / steps) break;
        if (floor(t) <= 0) {
          let lo = (i - 1) / steps,
            hi = t;
          for (let n = 0; n < 14; n++) {
            const mid = (lo + hi) / 2;
            if (floor(mid) > 0) lo = mid;
            else hi = mid;
          }
          take(hi, null, "terrain");
          break;
        }
      }
    for (const axis of ["x", "y"]) {
      const limit =
        axis === "x"
          ? (game.sourceWorld.width ?? game.sourceWorld.size)
          : (game.sourceWorld.height ?? game.sourceWorld.size);
      const delta = b[axis] - a[axis];
      if (a[axis] < radius || a[axis] > limit - radius)
        take(0, null, "boundary");
      if (delta > 0 && b[axis] > limit - radius)
        take((limit - radius - a[axis]) / delta, null, "boundary");
      if (delta < 0 && b[axis] < radius)
        take((radius - a[axis]) / delta, null, "boundary");
    }
    return result;
  }
  MF.createProjectile =
    /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.createProjectile.9 — Handles create projectile within spatial. Inputs: game; owner; weapon; direction. Updates: target x; target y; target z; shot direction; shot position. Uses: original create; frontier render camera; root frontier muzzle point; between. Returns: shot. */
  /* @function spatial.reviewedcreateProjectile_9 — Extends legacy projectile creation with world-height muzzle/aim and optional light settings. Inputs: game, firing owner, weapon and spread direction. Returns created shot after replacing normalized XYZ direction/position/previousPosition/velocity. Camera ray targets60 metres ahead with near-player scenery excluded; fixed-room player and nonplayer aim use separate rules, authored barrel guide may override. Copies validated weapon light so later weapon edits cannot retarget live shot. Calls legacy creator which owns initial insertion/effects; dependencies may throw afterward. Coordinates metres, yaw/pitch offsets radians, velocity metres per second; artwork row selection never quantizes trajectory. */ function (
      game,
      owner,
      weapon,
      direction,
    ) {
      const shot = originalCreate(game, owner, weapon, direction),
        cam = FrontierRender.camera(game),
        pitch = cam.pitch + Math.atan(((cam.cy ?? 96) - 96) / 360),
        muzzle = root.FrontierMuzzle?.point(owner, game) || {
          x: owner.x,
          y: owner.y,
          z: (owner.z || 0) + 0.95,
        };
      const far = {
          x: cam.x + Math.sin(game.camera.yaw) * Math.cos(pitch) * 60,
          y: cam.y + Math.cos(game.camera.yaw) * Math.cos(pitch) * 60,
          z: cam.z + Math.sin(pitch) * 60,
        },
        aimStart = between(
          cam,
          far,
          Math.max(
            0,
            Math.min(
              0.99,
              ((muzzle.x - cam.x) * Math.sin(game.camera.yaw) +
                (muzzle.y - cam.y) * Math.cos(game.camera.yaw) +
                0.75) /
                (60 * Math.cos(pitch)),
            ),
          ),
        ),
        hit = sweep(game, aimStart, far, 0, owner.id),
        target = between(aimStart, far, hit?.t ?? 1);
      if (cam.orthographic && owner.id === game.player.id) {
        const point = game.pointer || game.roomAimPoint,
          aim = point && FrontierInterior.aim(game, point.x, point.y);
        if (aim) Object.assign(target, aim);
        else
          Object.assign(target, {
            x: muzzle.x + direction.x * 60,
            y: muzzle.y + direction.y * 60,
            z: muzzle.z,
          });
      }
      if (owner.id !== game.player.id) {
        // October 22, 2026: new event enemies aim at their actual opponent's
        // torso over the real distance. The old 60m aim plane remains below
        // for legacy non-enemy callers; it under-aimed across height changes.
        const victim = owner.enemyConfig && root.FrontierPartyCombat?.target(game, owner);
        if (victim) {
          const distance = Math.max(.001, Math.hypot(victim.x-owner.x,victim.y-owner.y));
          target.x = owner.x + direction.x * distance;
          target.y = owner.y + direction.y * distance;
          target.z = (victim.z || 0) + (victim.height || 1.65) * .6;
        } else {
          target.x = muzzle.x + direction.x * 60;
          target.y = muzzle.y + direction.y * 60;
          target.z = (game.player.z || 0) + 1;
        }
      }
      const length =
          Math.hypot(
            target.x - muzzle.x,
            target.y - muzzle.y,
            target.z - muzzle.z,
          ) || 1,
        horizontal =
          Math.hypot(target.x - muzzle.x, target.y - muzzle.y) / length;
      // Preserve the original continuous angular spread; artwork never quantizes shots.
      const baseYaw = Math.atan2(target.x - muzzle.x, target.y - muzzle.y),
        spread =
          owner.id === game.player.id
            ? Math.atan2(direction.x, direction.y) -
              (cam.orthographic
                ? Math.atan2(target.x - owner.x, target.y - owner.y)
                : game.camera.yaw)
            : 0,
        angle = baseYaw + spread + (muzzle.yawOffset || 0),
        elevation =
          Math.asin((target.z - muzzle.z) / length) + (muzzle.pitchOffset || 0);
      shot.direction = {
        x: Math.sin(angle) * Math.cos(elevation),
        y: Math.cos(angle) * Math.cos(elevation),
        z: Math.sin(elevation),
      };
      const guide = root.FrontierMuzzle?.barrel(owner, game);
      if (guide) {
        const spreadAngle =
            owner.id === game.player.id
              ? Math.atan2(direction.x, direction.y) - game.camera.yaw
              : 0,
          a = Math.atan2(guide.x, guide.y) + spreadAngle,
          e = Math.asin(Math.max(-1, Math.min(1, guide.z)));
        shot.direction = {
          x: Math.sin(a) * Math.cos(e),
          y: Math.cos(a) * Math.cos(e),
          z: Math.sin(e),
        };
      }
      // October 14: fixed-camera PLAYER shots follow the displayed affine sprite
      // sector with launch-only assistance. Third-person and NPC paths above
      // remain unchanged. Existing weapon spread is applied after assistance;
      // collision, hitscan, lifetime and projectile-light ownership stay shared.
      if (cam.orthographic && owner.id === game.player.id && root.FrontierFixedLaunch && root.FrontierMuzzle?.frame(owner, game)) {
        const launch = root.FrontierFixedLaunch.calculate(root, owner, game, target, { speed: shot.speed });
        const yaw = Math.atan2(launch.direction.x, launch.direction.y) + spread;
        const pitch = Math.asin(Math.max(-1, Math.min(1, launch.direction.z)));
        shot.direction = { x: Math.sin(yaw) * Math.cos(pitch), y: Math.cos(yaw) * Math.cos(pitch), z: Math.sin(pitch) };
      }
      shot.position = {
        ...muzzle,
      };
      // October 12, 2026: optional weapon emission settings are copied into this shot, so weapon changes cannot retarget a live light.
      if (weapon.light && root.FrontierLocalLighting)
        shot.light = root.FrontierLocalLighting.source(
          { ...game.sourceWorld?.lighting?.projectiles, ...weapon.light },
          "weapon-projectile-light",
        );
      shot.previousPosition = {
        ...muzzle,
      };
      shot.velocity = {
        x: shot.direction.x * shot.speed,
        y: shot.direction.y * shot.speed,
        z: shot.direction.z * shot.speed,
      };
      return shot;
    };
  // Reflect against the impacted scenery face, add bounded random variation, and move outside the surface before continuing.
  /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.bounce.10 — Reflect against the impacted scenery face, add bounded random variation, and move outside the surface before continuing. Inputs: game; p; hit. Updates: v x; v y; v z; p direction; p velocity. Uses: a list of spread element, spread element find; a list of "monster", "npc", "player" includes; root frontier parameters get; faces sort. Returns: false; false. */
  /* @function spatial.reviewedbounce_10 — Attempts one scenery-body ricochet. Inputs: game, live shot p and sweep hit. Returns false for nonbody/max bounce/missing or actor target/chance failure; true after reflected randomized direction, normalized velocity and0.025-metre outward position nudge. Chooses closest expanded AABB face, bounds minimum outward dot and increments ricochets. Mutates shot only; Math.random makes outcome nondeterministic, not mesh-normal reflection. */ function bounce(
    game,
    p,
    hit,
  ) {
    if (hit.kind !== "body" || (p.ricochets || 0) >= 1) return false;
    const e = [
      ...game.maps.frontier.entities,
      ...(game.sceneEvents || []),
    ].find(
      /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.callback.11 — Returns e id equals hit id. Inputs: e. Returns: e id equals hit id. */
  /* @function spatial.reviewedcallback_11 — Resolves impacted scenery record for ricochet. Inputs: e and captured hit.id. Returns equality; no mutation. */ (
        e,
      ) => e.id === hit.id,
    );
    if (
      !e ||
      ["monster", "npc", "player"].includes(e.kind) ||
      Math.random() >
        (e.ricochetChance ??
          root.FrontierParameters?.get(game.sourceWorld, "ricochetChance") ??
          0.2)
    )
      return false;
    const pos = p.position,
      r = p.radius,
      z = e.z || 0;
    const faces = [
      {
        d: Math.abs(pos.x - (e.x - e.radius - r)),
        n: {
          x: -1,
          y: 0,
          z: 0,
        },
      },
      {
        d: Math.abs(pos.x - (e.x + e.radius + r)),
        n: {
          x: 1,
          y: 0,
          z: 0,
        },
      },
      {
        d: Math.abs(pos.y - (e.y - e.radius - r)),
        n: {
          x: 0,
          y: -1,
          z: 0,
        },
      },
      {
        d: Math.abs(pos.y - (e.y + e.radius + r)),
        n: {
          x: 0,
          y: 1,
          z: 0,
        },
      },
      {
        d: Math.abs(pos.z - (z - r)),
        n: {
          x: 0,
          y: 0,
          z: -1,
        },
      },
      {
        d: Math.abs(pos.z - (z + e.height + r)),
        n: {
          x: 0,
          y: 0,
          z: 1,
        },
      },
    ];
    const n = faces.sort(
        /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.callback.12 — Returns a d minus b d. Inputs: a; b. Returns: a d minus b d. */
  /* @function spatial.reviewedcallback_12 — Orders AABB faces by contact distance. Inputs: face records a/b. Returns numeric distance difference; sort mutates only local face array. */ (
          a,
          b,
        ) => a.d - b.d,
      )[0].n,
      d = p.direction,
      dot = d.x * n.x + d.y * n.y + (d.z || 0) * n.z;
    let v = {
      x: d.x - 2 * dot * n.x + (Math.random() - 0.5) * 0.8,
      y: d.y - 2 * dot * n.y + (Math.random() - 0.5) * 0.8,
      z: (d.z || 0) - 2 * dot * n.z + (Math.random() - 0.5) * 0.8,
    };
    const outward = v.x * n.x + v.y * n.y + v.z * n.z;
    if (outward < 0.15) {
      v.x += (0.15 - outward) * n.x;
      v.y += (0.15 - outward) * n.y;
      v.z += (0.15 - outward) * n.z;
    }
    const length = Math.hypot(v.x, v.y, v.z);
    p.direction = {
      x: v.x / length,
      y: v.y / length,
      z: v.z / length,
    };
    p.velocity = {
      x: p.direction.x * p.speed,
      y: p.direction.y * p.speed,
      z: p.direction.z * p.speed,
    };
    p.position = {
      x: pos.x + n.x * 0.025,
      y: pos.y + n.y * 0.025,
      z: pos.z + n.z * 0.025,
    };
    p.previousPosition = {
      ...p.position,
    };
    p.ricochets = (p.ricochets || 0) + 1;
    return true;
  }
  // Move a projectile within remaining range/lifetime, resolve its first hit, and handle penetration or one scenery ricochet.
  /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.advance.13 — Move a projectile within remaining range/lifetime, resolve its first hit, and handle penetration or one scenery ricochet. Inputs: game; p; dt; ui; assignment pattern. Updates: p previous position; p position; p distance travelled; p age; p hit ids. Uses: sweep; between; game shot effects push; game shot effects shift. Returns: true; true. */
  /* @function spatial.reviewedadvance_13 — Advances shot and resolves its first collision for this call. Inputs: game, mutable p, dt seconds, impact UI and instant flag. Returns true to retain after penetration/ricochet or ordinary travel, false after terminal impact/range/lifetime expiry. Updates position/age/travel distance and bounded256 visual-trace list, calls impact handler, maintains penetrated-ID Set. instant sweeps remaining range, normal movement capped by lifetime. Penetration computes an unused exit probe then nudges forward; does not guarantee continuation past a full thick collider in one update. Dependency/impact errors propagate without local rollback. */ function advance(
    game,
    p,
    dt,
    ui,
    instant = false,
  ) {
    const remaining = Math.max(0, p.maxRange - p.distanceTravelled),
      distance = instant
        ? remaining
        : Math.min(
            remaining,
            p.speed * Math.min(dt, Math.max(0, p.lifetime - p.age)),
          ),
      a = {
        ...p.position,
      },
      b = {
        x: a.x + p.direction.x * distance,
        y: a.y + p.direction.y * distance,
        z: a.z + (p.direction.z || 0) * distance,
      },
      hit = sweep(game, a, b, p.radius, p.ownerId, p.hitIds);
    p.previousPosition = a;
    p.position = between(a, b, hit?.t ?? 1);
    p.distanceTravelled += distance * (hit?.t ?? 1);
    p.age += dt;
    game.shotEffects.push({
      map: p.map,
      from: a,
      to: {
        ...p.position,
      },
      z: p.position.z,
      color: p.visual.color,
      life: p.visual.life,
      maxLife: p.visual.life,
    });
    if (game.shotEffects.length > 256) game.shotEffects.shift();
    if (hit) {
      if (p.penetration > 0 && hit.id && !p.hitIds?.has(hit.id)) {
        MF.resolveProjectileImpact(game, p, hit, ui);
        p.hitIds ??= new Set();
        p.hitIds.add(hit.id);
        p.penetration--;
        const entity = game.runtime.entities.get(hit.id),
          exit = entity
            ? boxHit(
                {
                  ...p.position,
                  x: p.position.x + p.direction.x * 0.01,
                  y: p.position.y + p.direction.y * 0.01,
                  z: p.position.z + p.direction.z * 0.01,
                },
                b,
                {
                  min: {
                    x: entity.x - entity.radius,
                    y: entity.y - entity.radius,
                    z: entity.z || 0,
                  },
                  max: {
                    x: entity.x + entity.radius,
                    y: entity.y + entity.radius,
                    z: (entity.z || 0) + entity.height,
                  },
                },
                p.radius,
              )
            : null;
        p.ignoreId = hit.id;
        p.position = between(
          p.position,
          b,
          Math.min(1, 0.03 / Math.max(0.03, distance)),
        );
        return true;
      }
      if (bounce(game, p, hit)) return true;
      MF.resolveProjectileImpact(game, p, hit, ui);
      return false;
    }
    if (instant || p.age >= p.lifetime || p.distanceTravelled >= p.maxRange) {
      MF.resolveProjectileImpact(
        game,
        p,
        {
          id: null,
          kind: "expiry",
        },
        ui,
      );
      return false;
    }
    return true;
  }
  MF.updateProjectiles =
    /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.updateProjectiles.14 — Handles update projectiles within spatial. Inputs: game; dt; ui. Updates: game projectiles. Uses: game projectiles filter. */
  /* @function spatial.reviewedupdateProjectiles_14 — Updates only projectiles owned by active cell. Inputs: game, dt seconds and impact UI. Returns undefined; replaces projectile array with shots on currentMapId whose advance returns true. Off-map shots discarded without advancing; transient lighting follows remaining live shots. Mutation/impact errors propagate. */ (
      game,
      dt,
      ui,
    ) => {
      game.projectiles = game.projectiles.filter(
        /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.callback.15 — Returns p map equals game current map id and advance using game, p, dt. Inputs: p. Uses: advance. Returns: p map equals game current map id and advance using game, p, dt. */
  /* @function spatial.reviewedcallback_15 — Filters one projectile after active-cell advance. Inputs: p and captured game/dt/ui. Returns false for off-map, otherwise advance retention boolean. May mutate shot and gameplay through impact; errors propagate. */ (
          p,
        ) => p.map === game.currentMapId && advance(game, p, dt, ui),
      );
    };
  MF.resolveHitscan =
    /* Historical contract retained; October 14 reviewed explanation follows. @function spatial.resolveHitscan.16 — Handles resolve hitscan within spatial. Inputs: game; p; ui. Uses: advance. */
  /* @function spatial.reviewedresolveHitscan_16 — Resolves instantaneous shot with bounded continuation. Inputs: game, p and impact UI. Returns undefined; calls advance with dt0/instant true up to16 times while penetration/ricochet retains shot. Mutates shot/effects/impacts; cap prevents unbounded work and does not force an expiry impact when cap exhausted. Errors propagate. */ (
      game,
      p,
      ui,
    ) => {
      for (let i = 0; i < 16 && advance(game, p, 0, ui, true); i++);
    };
  MF.frontierSpatial = {
    boxHit,
    sweep,
    bounce,
  };
})(window.MF);
