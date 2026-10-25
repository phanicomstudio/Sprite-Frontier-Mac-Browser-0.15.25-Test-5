/* Spatial broad phase and conservative distance scheduling.
 * Props are indexed once per runtime; nearby queries touch only 8-unit cells.
 * Moving monsters/events are merged live so collision never uses stale positions.
 * Sleeping is scheduling, never deletion: HP, pages and inventory remain intact.
 * Automatic pages and explicitly always-active events never sleep. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function activity.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier activity. */
(/* @function activity.installReviewed — Installs conservative spatial broad-phase and distance scheduling services. Static props use 8-unit cells; moving actors/events remain live and sleeping never deletes authored/runtime state. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  const caches = new WeakMap(),
    states = new WeakMap();
  /* Historical contract retained; October 14 reviewed explanation follows. @function activity.cache.2 — Handles cache within activity. Inputs: game. Updates: c. Uses: caches get; dynamic push; buckets has; buckets set. Returns: c. */
  /* @function activity.reviewedcache_2 — Builds or retrieves the session spatial index. Inputs: live game with frontier entities and sourceWorld activity rules. Returns cached 8-metre buckets, live monster references and normalized scheduling rules. Mutates only private WeakMap on first access; source entity membership is assumed fixed for the session. Missing game/schema dependencies throw. */ function cache(
    game,
  ) {
    let c = caches.get(game);
    if (!c) {
      const buckets = new Map(),
        dynamic = [];
      for (const e of game.maps.frontier.entities) {
        if (e.kind === "monster") {
          dynamic.push(e);
          continue;
        }
        const k = Math.floor(e.x / 8) + ":" + Math.floor(e.y / 8);
        if (!buckets.has(k)) buckets.set(k, []);
        buckets.get(k).push(e);
      }
      c = {
        buckets,
        dynamic,
        rules: root.FrontierWorld.activitySettings(game.sourceWorld.activity),
      };
      caches.set(game, c);
    }
    return c;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function activity.query.3 — Finds records or geometry intersecting the requested region. Inputs: game; min x; min y; max x; max y; assignment pattern. Uses: cache; c buckets get; out push. Returns: out. */
  /* @function activity.reviewedquery_3 — Collects broad-phase candidates for an inclusive world XY rectangle in metres. Inputs: game, minX/minY/maxX/maxY and optional solid event filter. Returns a new array of coarse static bucket candidates plus exactly bounded live monsters/events; callers must perform narrow-phase checks. solid filters scene events only, not static props or monsters. Initializes cache if needed; invalid inputs are not validated here. */ function query(
    game,
    minX,
    minY,
    maxX,
    maxY,
    solid = false,
  ) {
    const c = cache(game),
      out = [];
    for (let x = Math.floor(minX / 8); x <= Math.floor(maxX / 8); x++)
      for (let y = Math.floor(minY / 8); y <= Math.floor(maxY / 8); y++)
        for (const e of c.buckets.get(x + ":" + y) || []) out.push(e);
    for (const e of c.dynamic)
      if (e.x >= minX && e.x <= maxX && e.y >= minY && e.y <= maxY) out.push(e);
    for (const e of game.sceneEvents || [])
      if (
        (!solid || e.solid) &&
        e.x >= minX &&
        e.x <= maxX &&
        e.y >= minY &&
        e.y <= maxY
      )
        out.push(e);
    return out;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function activity.actors.4 — Handles actors within activity. Inputs: game. Uses: cache; a list of spread element, spread element filter; game scene events or a list of filter. Returns: a list of spread element, spread element filter using a callback. */
  /* @function activity.reviewedactors_4 — Selects potential combat actors near the player without deleting sleeping state. Inputs: live game. Returns monsters and combat-enabled scene events within the maximum reduced/detection/leash distance plus hysteresis, retaining already aggressive actors regardless of distance. Distances use world XY metres. Initializes cache; no actor mutation; missing parameter service throws. */ function actors(
    game,
  ) {
    const r = cache(game).rules,
      p = game.player;
    return [
      ...cache(game).dynamic,
      ...(game.sceneEvents || []).filter(
        /* Historical contract retained; October 14 reviewed explanation follows. @function activity.callback.5 — Returns e combat. Inputs: e. Returns: e combat. */
  /* @function activity.reviewedcallback_5 — Selects scene events participating in combat. Inputs: live event e. Returns its combat record as a truthy inclusion value. No mutation; absent combat records exclude decoration and utility events. */ (
          e,
        ) => e.combat,
      ),
    ].filter(
      /* Historical contract retained; October 14 reviewed explanation follows. @function activity.callback.6 — Returns math hypot using e x minus p x, e y minus p y is at most math max using r reduced distance, root frontier parameters get using game source world, "aggroRange", root frontier parameters get using game source world, "aggroLeash" plus r hysteresis or e aggro. Inputs: e. Uses: root frontier parameters get. Returns: math hypot using e x minus p x, e y minus p y is at most math max using r reduced distance, root frontier parameters get using game source world, "aggroRange", root frontier parameters get using game source world, "aggroLeash" plus r hysteresis or e aggro. */
  /* @function activity.reviewedcallback_6 — Keeps nearby or already aggressive combat actors. Inputs: actor e and captured player/rules/game. Returns true when XY metre distance is within the conservative scheduling boundary or e.aggro is true. No state changes; configured detection/leash ranges prevent scheduling from suppressing acquisition. */ (
        e,
      ) =>
        Math.hypot(e.x - p.x, e.y - p.y) <=
          Math.max(
            r.reducedDistance,
            root.FrontierParameters.get(game.sourceWorld, "aggroRange"),
            root.FrontierParameters.get(game.sourceWorld, "aggroLeash"),
          ) +
            r.hysteresis || e.aggro,
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function activity.motionDelta.7 — Handles motion delta within activity. Inputs: game; event; page; dt. Updates: s; s tier; s pending. Uses: cache; states get; states set. Returns: dt; 0. */
  /* @function activity.reviewedmotionDelta_7 — Schedules event motion using distance tiers and hysteresis. Inputs: game, event, current page and elapsed dt in seconds. Returns dt for always/autorun/parallel or active events, zero for dormant/not-yet-due events, otherwise accumulated reduced time capped at interval plus 0.1 seconds. Mutates private per-event tier/pending state; dormant time is discarded to avoid a catch-up jump. Requires validated page/rules and finite nonnegative dt; dependency errors propagate. */ function motionDelta(
    game,
    event,
    page,
    dt,
  ) {
    if (
      event.activity === "always" ||
      page.trigger === "autorun" ||
      page.trigger === "parallel"
    )
      return dt;
    const r = cache(game).rules,
      distance = Math.hypot(event.x - game.player.x, event.y - game.player.y);
    let s = states.get(event);
    if (!s) {
      s = { tier: "active", pending: 0 };
      states.set(event, s);
    }
    const margin = r.hysteresis;
    // Separate entering/leaving thresholds prevent rapid toggles at a boundary.
    if (s.tier === "active" && distance > r.activeDistance + margin)
      s.tier = "reduced";
    else if (s.tier !== "active" && distance < r.activeDistance)
      s.tier = "active";
    if (s.tier === "reduced" && distance > r.reducedDistance + margin)
      s.tier = "dormant";
    else if (s.tier === "dormant" && distance < r.reducedDistance)
      s.tier = "reduced";
    if (s.tier === "dormant") {
      s.pending = 0;
      return 0;
    }
    if (s.tier === "active") {
      s.pending = 0;
      return dt;
    }
    s.pending += dt;
    if (s.pending < r.reducedInterval) return 0;
    const elapsed = Math.min(s.pending, r.reducedInterval + 0.1);
    s.pending = 0;
    return elapsed;
  }
  root.FrontierActivity = { query, actors, motionDelta };
})(typeof window === "undefined" ? globalThis : window);
