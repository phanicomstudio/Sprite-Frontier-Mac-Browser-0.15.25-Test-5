/* Temporary playtest escape hatch. History is runtime-only, bounded and reset
 * with each game. Recovery never changes authored maps, inventory or events. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function player-recovery.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier player recovery. */
(/* @function player-recovery.installReviewed — Installs the temporary Get Unstuck playtest recovery service. Safe-position history is bounded, runtime-owned and reset per game; recovery must not modify authored maps, inventory or events. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  const histories = new WeakMap();
  // Check a proposed body position against map bounds, room walls, event/model
  // collision and legacy solids. Returns false for occupied or airborne points.
  /* Historical contract retained; October 14 reviewed explanation follows. @function player-recovery.checkSafe.2 — collision and legacy solids. Returns false for occupied or airborne points. Inputs: game; point. Uses: root frontier interior blocked; root frontier model collision blocked; solids some. Returns: false; false. */
  /* @function player-recovery.reviewedcheckSafe_2 — Tests a candidate recovery body position conservatively. Inputs: live game and point XY/Z metres with grounded flag. Returns false when airborne, outside half-metre map inset or blocked by interior/model/legacy/event solids; otherwise true. Uses 0.13-metre body radius and candidate Z with live player shape. Does not independently prove support: grounded flag/candidate producer supplies that assumption. Model check may update collision diagnostics; safe wrapper restores them. Optional geometry services may be absent, so result covers available services only; malformed dependencies throw. */ function checkSafe(
    game,
    point,
  ) {
    const p = game.player,
      w = game.sourceWorld;
    if (
      !point.grounded ||
      point.x < 0.5 ||
      point.y < 0.5 ||
      point.x > (w.width ?? w.size) - 0.5 ||
      point.y > (w.height ?? w.size) - 0.5
    )
      return false;
    if (root.FrontierInterior?.blocked(w, point.x, point.y, 0.13, point.z))
      return false;
    if (
      root.FrontierModelCollision?.blocked(game, point.x, point.y, 0.13, {
        ...p,
        ...point,
      })
    )
      return false;
    const solids = [
      ...(game.maps?.frontier?.entities || []),
      ...(game.sceneEvents || []),
    ];
    return !solids.some(
      /* Historical contract retained; October 14 reviewed explanation follows. @function player-recovery.callback.3 — Returns e does not equal p and the inverse of e dead and e solid does not equal false and e radius and math abs using e x minus point x is less than e radius plus 0.13 and math abs using e y minus point y is less than e radius plus 0.13 and point z is less than e z or 0 plus e height minus 0.001. Inputs: e. Returns: e does not equal p and the inverse of e dead and e solid does not equal false and e radius and math abs using e x minus point x is less than e radius plus 0.13 and math abs using e y minus point y is less than e radius plus 0.13 and point z is less than e z or 0 plus e height minus 0.001. */
  /* @function player-recovery.reviewedcallback_3 — Detects overlapping live legacy/event solid for recovery. Inputs: e and captured player/candidate. Returns truthy when nonplayer/living/solid radius record overlaps XY square bounds expanded by 0.13 metres and candidate feet below its top minus 0.001 metre. No mutation; this is conservative radius-box exclusion, not mesh contact. */ (
        e,
      ) =>
        e !== p &&
        !e.dead &&
        e.solid !== false &&
        e.radius &&
        Math.abs(e.x - point.x) < e.radius + 0.13 &&
        Math.abs(e.y - point.y) < e.radius + 0.13 &&
        point.z < (e.z || 0) + e.height - 0.001,
    );
  }
  // Run a safety probe without replacing the last gameplay collision trace.
  /* Historical contract retained; October 14 reviewed explanation follows. @function player-recovery.safe.4 — Run a safety probe without replacing the last gameplay collision trace. Inputs: game; point. Updates: game model collision debug. Uses: check safe. Returns: check safe using game, point. */
  /* @function player-recovery.reviewedsafe_4 — Probes recovery safety without replacing gameplay collision trace. Inputs: game and candidate point. Returns checkSafe boolean, restoring game.modelCollisionDebug in finally even when check throws. Does not mutate candidate/source; other check errors propagate. */ function safe(
    game,
    point,
  ) {
    const before = game.modelCollisionDebug;
    try {
      return checkSafe(game, point);
    } finally {
      game.modelCollisionDebug = before;
    }
  }
  // Remember up to 30 distinct, stationary-height safe locations. The half-unit
  // spacing avoids choosing another point on the same troublesome contact.
  /* Historical contract retained; October 14 reviewed explanation follows. @function player-recovery.remember.5 — spacing avoids choosing another point on the same troublesome contact. Inputs: game. Updates: list. Uses: safe; histories get; histories set; list at. Returns: without a result; without a result. */
  /* @function player-recovery.reviewedremember_5 — Records distinct runtime safe positions for later recovery. Inputs: live game. Returns undefined; probes grounded player snapshot, stores it only at least 0.5 metre XY from latest entry and keeps newest 30 in WeakMap. No authored/inventory mutation. Z defaults zero and grounded defaults true unless explicitly false; support assumption follows player simulation. Probe failures propagate. */ function remember(
    game,
  ) {
    const p = game.player,
      point = { x: p.x, y: p.y, z: p.z || 0, grounded: p.grounded !== false };
    if (!safe(game, point)) return;
    let list = histories.get(game);
    if (!list) histories.set(game, (list = []));
    if (
      list.length &&
      Math.hypot(point.x - list.at(-1).x, point.y - list.at(-1).y) < 0.5
    )
      return;
    list.push(point);
    if (list.length > 30) list.shift();
  }
  // Restore a clear recent position at least one unit away. If none survives
  // changed geometry, search the spawn neighborhood for a clear supported spot.
  // Returns success/failure and records the outcome for diagnostics.
  /* Historical contract retained; October 14 reviewed explanation follows. @function player-recovery.recover.6 — Returns success/failure and records the outcome for diagnostics. Inputs: game. Updates: z; game recovery debug; game player step; game moving. Uses: histories get; list slice using reverse using filter; list slice using reverse; list slice. Returns: false; true. */
  /* @function player-recovery.reviewedrecover_6 — Moves player to a bounded safe candidate after getting stuck. Inputs: live game. Returns success boolean; tries recent safe entries at least one metre XY away, then spawn and 16-direction rings at 0.5/1/2/3/4 metres. Spawn samples use terrain and optional model support up to 30 metres above terrain, followed by safe probe. On success resets displacement/jump/walk/proposed-step state and writes recovery diagnostics; on no candidate changes only failure diagnostics. Does not change authored maps/inventory/events; terrain/dependency errors propagate and no safe point is fabricated. */ function recover(
    game,
  ) {
    const p = game.player,
      w = game.sourceWorld,
      list = histories.get(game) || [],
      candidates = list
        .slice()
        .reverse()
        .filter(
          /* Historical contract retained; October 14 reviewed explanation follows. @function player-recovery.callback.7 — Returns math hypot using q x minus p x, q y minus p y is at least 1. Inputs: q. Returns: math hypot using q x minus p x, q y minus p y is at least 1. */
  /* @function player-recovery.reviewedcallback_7 — Keeps historical recovery locations sufficiently far from current contact. Inputs: q and captured player. Returns XY distance at least one metre. No mutation; elevation is not included in spacing. */ (
            q,
          ) => Math.hypot(q.x - p.x, q.y - p.y) >= 1,
        );
    const spawn = w.spawn;
    if (spawn)
      for (const distance of [0, 0.5, 1, 2, 3, 4])
        for (let i = 0; i < (distance ? 16 : 1); i++) {
          const angle = (i * Math.PI) / 8,
            x = spawn.x + Math.cos(angle) * distance,
            y = spawn.y + Math.sin(angle) * distance;
          let z = root.FrontierTerrain.height(w, x, y);
          const top = root.FrontierModelCollision?.support(
            game,
            x,
            y,
            z,
            z + 30,
          );
          if (top !== null && top !== undefined) z = Math.max(z, top);
          candidates.push({ x, y, z, grounded: true });
        }
    const point = candidates.find(
      /* Historical contract retained; October 14 reviewed explanation follows. @function player-recovery.callback.8 — Returns safe using game, q. Inputs: q. Uses: safe. Returns: safe using game, q. */
  /* @function player-recovery.reviewedcallback_8 — Accepts the first currently safe recovery candidate. Inputs: q and captured game. Returns safe-probe boolean while preserving gameplay collision diagnostics. No candidate mutation; probe errors propagate. */ (
        q,
      ) => safe(game, q),
    );
    if (!point) {
      game.recoveryDebug = {
        success: false,
        reason: "No clear supported recovery position",
      };
      return false;
    }
    Object.assign(p, point, {
      vx: 0,
      vy: 0,
      verticalVelocity: 0,
      groundZ: point.z,
      walkTime: 0,
      walkHold: 0,
    });
    game.playerStep = null;
    game.moving = false;
    game.recoveryDebug = { success: true, position: { ...point } };
    return true;
  }
  // October 14, 2026: editor noclip may end inside walls or outside a painted
  // floor; a changed spawn can be invalid too. Resolve only at Playtest entry.
  /* @function playerRecovery.enterPlaytest — Inputs: live game after grounding. Returns true when its current body is clear or a nearby supported room position is found, false when none exists. Keeps valid XYZ/camera unchanged; probes 16-direction rings up to four metres, authored tile centres and spawn, ordered by distance from editor position. Candidate support is sampled below the body (never a ceiling above it). On success resets runtime motion only; authored geometry/spawn and inventory remain unchanged. Checks run once per mode switch, never per frame. */
  function enterPlaytest(game) {
    const p = game.player, w = game.sourceWorld;
    if (safe(game, { ...p, grounded: true })) return true;
    const candidates = [];
    for (const distance of [0.25, 0.5, 1, 2, 3, 4])
      for (let i = 0; i < 16; i++) {
        const angle = i * Math.PI / 8;
        candidates.push({ x: p.x + Math.cos(angle) * distance, y: p.y + Math.sin(angle) * distance, z: p.z });
      }
    const layout = w.interior?.layout;
    if (layout) for (const [x, y] of layout.cells)
      candidates.push({ x: layout.originX + (x + 0.5) * layout.tile, y: layout.originY + (y + 0.5) * layout.tile, z: layout.z });
    if (w.spawn) candidates.push({ ...w.spawn, z: w.spawn.z ?? 0 });
    candidates.sort(/* @function playerRecovery.nearestEntry — Inputs: two candidate points. Returns distance ordering from preserved editor XY. No scene changes. */ function(a, b) {
      return Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y);
    });
    for (const candidate of candidates) {
      const sample = { ...p, ...candidate, grounded: true, verticalVelocity: 0 };
      root.FrontierTerrain.ground(sample, w, 0, [], game);
      if (!safe(game, sample)) continue;
      Object.assign(p, { x: sample.x, y: sample.y, z: sample.z, groundZ: sample.groundZ, grounded: true, verticalVelocity: 0, vx: 0, vy: 0, walkTime: 0, walkHold: 0 });
      game.playerStep = null;
      game.moving = false;
      return true;
    }
    return false;
  }
  root.FrontierPlayerRecovery = { safe, remember, recover, enterPlaytest };
})(typeof window === "undefined" ? globalThis : window);
