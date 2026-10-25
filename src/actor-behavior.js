/* Shared continuous actor behavior. Authored profiles are immutable; controller
 * state belongs to one playtest and page. Home leashes stop reacquisition while
 * returning, avoiding endless pursuit when a target waits just beyond the leash. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier actor behavior. */
(/* @function actor-behavior.installReviewed — Installs continuous actor-behavior controllers with per-playtest/page state and home-leash return rules. Authored profiles remain immutable; this initializer does not start pursuit. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  const defaults =
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.defaults.2 — Returns a record containing mode, approach, speed, detectRange, chaseRange, homeRange, stopRange, wanderRadius. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing mode, approach, speed, detectRange, chaseRange, homeRange, stopRange, wanderRadius. */
  /* @function actor-behavior.defaults.2Reviewed — Creates a fresh authored behavior profile. Inputs: none. Returns sentinel defaults, speed 0.9 world units per second, ranges/radius in horizontal world units and a fresh empty waypoint list. Allocates independent data; does not install a controller or mutate a session. */ () => ({
      mode: "sentinel",
      approach: false,
      speed: 0.9,
      detectRange: 6,
      chaseRange: 10,
      homeRange: 12,
      stopRange: 1,
      wanderRadius: 4,
      points: [],
    });
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.validate.3 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Uses: defaults; root frontier event schema json; a list of "sentinel", "wander", "patrol" includes; error. Returns: v. */
  /* @function actor-behavior.validate.3Reviewed — Validates and copies an authored behavior profile over defaults. Inputs: JSON-compatible profile. Returns normalized profile without changing input. Rejects unsupported modes, non-boolean approach, nonfinite/negative ranges above 128, speed above 12, chase below detection or stop above detection, and invalid waypoint arrays/coordinates. Patrol needs 1–64 points; points use horizontal world coordinates 1–511. JSON-copy errors propagate; actual cell bounds are checked separately. */ function validate(
    value,
  ) {
    const v = { ...defaults(), ...root.FrontierEventSchema.json(value) };
    if (
      !["sentinel", "wander", "patrol"].includes(v.mode) ||
      typeof v.approach !== "boolean"
    )
      throw Error("Invalid actor behavior mode.");
    for (const k of [
      "speed",
      "detectRange",
      "chaseRange",
      "homeRange",
      "stopRange",
      "wanderRadius",
    ])
      if (!Number.isFinite(v[k]) || v[k] < 0 || v[k] > 128)
        throw Error("Invalid behavior " + k);
    if (
      v.speed > 12 ||
      v.chaseRange < v.detectRange ||
      v.stopRange > v.detectRange
    )
      throw Error("Behavior speed/range combination is invalid.");
    if (
      !Array.isArray(v.points) ||
      v.points.length > 64 ||
      (v.mode === "patrol" && !v.points.length)
    )
      throw Error("Patrol requires 1–64 waypoints.");
    for (const p of v.points)
      if (
        !p ||
        !Number.isFinite(p.x) ||
        !Number.isFinite(p.y) ||
        p.x < 1 ||
        p.y < 1 ||
        p.x > 511 ||
        p.y > 511
      )
        throw Error("Invalid patrol waypoint.");
    return v;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.update.4 — Advances this system using the current state and elapsed time. Inputs: e; page; dt; target; services; controllers. Updates: c; c goal; e x; e y; goal. Uses: controllers get; controllers set; phase; services bounds. Returns: without a result. */
  /* @function actor-behavior.update.4Reviewed — Advances one actor horizontal behavior controller for the active event page. Inputs: entity, page/profile, elapsed seconds, optional target position, bounds/collision/trace services and session controller Map. Returns nothing; nonpositive elapsed time or absent profile is a no-op. Creates page-specific home state, pursues within detection/leash rules, returns home, patrols or deterministically wanders. Travel is capped to 0.25 seconds and split into at most 0.05-world-unit collision probes. Mutates position, facing unless direction-fixed, displacement fields vx/vy (not per-second velocity), behavior phase and walk animation. Through pages bypass canStand but retain bounds. Service errors propagate; this does not itself perform vertical stair/ground resolution. */ function update(
    e,
    page,
    dt,
    target,
    services,
    controllers,
  ) {
    const p = page.behavior;
    if (!p || dt <= 0) return;
    let c = controllers.get(e.id);
    if (!c || c.page !== page) {
      c = {
        page,
        home: { x: e.x, y: e.y },
        phase: "idle",
        index: 0,
        turn: 0,
        goal: null,
        trace: [],
      };
      controllers.set(e.id, c);
    }
    const homeDistance = Math.hypot(e.x - c.home.x, e.y - c.home.y),
      distance = target ? Math.hypot(e.x - target.x, e.y - target.y) : Infinity;
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.phase.5 — Handles phase within actor behavior. Inputs: next. Updates: c phase. Uses: c trace push; c trace shift; services behavior trace. */
  /* @function actor-behavior.phase.5Reviewed — Records a behavior phase change only when different from the current phase. Inputs: next phase string chosen by the enclosing controller. Returns nothing; updates phase, retains the latest 16 trace entries and optionally reports to behaviorTrace. No duplicate notification for unchanged phase; reporting errors propagate. */ function phase(
      next,
    ) {
      if (c.phase !== next) {
        c.phase = next;
        c.trace.push(next);
        if (c.trace.length > 16) c.trace.shift();
        services.behaviorTrace?.(e.id, next);
      }
    }
    if (
      c.phase === "chase" &&
      (!p.approach || distance > p.chaseRange || homeDistance >= p.homeRange)
    ) {
      phase("return");
      c.goal = null;
    }
    if (c.phase === "return" && homeDistance < 0.06) {
      e.x = c.home.x;
      e.y = c.home.y;
      phase("idle");
    }
    if (
      c.phase !== "return" &&
      p.approach &&
      distance <= p.detectRange &&
      homeDistance < p.homeRange
    )
      phase("chase");
    let goal;
    if (c.phase === "return") goal = c.home;
    else if (c.phase === "chase") {
      if (distance > p.stopRange) goal = target;
    } else if (p.mode === "patrol") {
      goal = p.points[c.index];
      if (Math.hypot(e.x - goal.x, e.y - goal.y) < 0.06) {
        c.index = (c.index + 1) % p.points.length;
        goal = p.points[c.index];
      }
      phase("patrol");
    } else if (p.mode === "wander") {
      if (!c.goal || Math.hypot(e.x - c.goal.x, e.y - c.goal.y) < 0.06) {
        const angle = (c.turn = (c.turn + 1) % 1000000000) * 2.399963229728653;
        c.goal = {
          x: c.home.x + Math.cos(angle) * p.wanderRadius,
          y: c.home.y + Math.sin(angle) * p.wanderRadius,
        };
      }
      const bounds = services.bounds?.() || { width: 48, height: 48 };
      c.goal.x = Math.max(1, Math.min(bounds.width - 1, c.goal.x));
      c.goal.y = Math.max(1, Math.min(bounds.height - 1, c.goal.y));
      goal = c.goal;
      phase("wander");
    } else phase("idle");
    const bx = e.x,
      by = e.y;
    if (goal) {
      const dx = goal.x - e.x,
        dy = goal.y - e.y,
        d = Math.hypot(dx, dy),
        travel = Math.min(d, p.speed * Math.min(dt, 0.25)),
        steps = Math.ceil(travel / 0.05),
        bounds = services.bounds?.() || { width: 48, height: 48 };
      for (let i = 0; i < steps; i++) {
        const step = Math.min(0.05, travel - i * 0.05),
          x = e.x + (dx / (d || 1)) * step,
          y = e.y + (dy / (d || 1)) * step;
        if (
          x < 1 ||
          y < 1 ||
          x > bounds.width - 1 ||
          y > bounds.height - 1 ||
          (!page.through && services.canStand && !services.canStand(x, y, e.id))
        ) {
          c.goal = null;
          break;
        }
        e.x = x;
        e.y = y;
      }
      if (!page.mz?.directionFix && Math.hypot(e.x - bx, e.y - by) > 0.000001) {
        e.facingX = dx / (d || 1);
        e.facingY = dy / (d || 1);
      }
    }
    e.vx = e.x - bx;
    e.vy = e.y - by;
    e.behaviorPhase = c.phase;
    if (
      page.mz?.stepAnime ||
      (page.mz?.walkAnime !== false && Math.hypot(e.vx, e.vy) > 0.000001)
    ) {
      e.walkTime = (e.walkTime || 0) + dt;
      e.walkHold = 0.1;
    } else {
      e.walkTime = 0;
      e.walkHold = 0;
    }
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.snapshots.6 — Captures the current collection of state records. Inputs: value; assignment pattern. Uses: array is array; error; value map. Returns: a list of ; value map using a callback. */
  /* @function actor-behavior.snapshots.6Reviewed — Validates serialized behavior controllers before restoration. Inputs: optional array and horizontal cell bounds, default 512 by 512 world units. Returns fresh controller records, or an empty list for undefined. Rejects more than 1000 records, duplicate/invalid IDs, invalid page/phase/index/turn or out-of-bounds home/goals; accepts idle, patrol, wander, chase and return. Does not mutate input/controllers or bind pages; binding validation is separate. */ function snapshots(
    value,
    bounds = { width: 512, height: 512 },
  ) {
    if (value === undefined) return [];
    if (!Array.isArray(value) || value.length > 1000)
      throw Error("Invalid behavior snapshots.");
    const ids = new Set();
    return value.map(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.callback.7 — Provides the callback for value map. Inputs: v. Uses: ids has; number is integer; a list of "idle", "patrol", "wander", "chase" includes; error. Returns: a record containing id, page, phase, index, turn, home, goal. */
  /* @function actor-behavior.callback.7Reviewed — Checks and copies one saved controller record. Inputs: record with event ID, page index, phase, patrol index, wander turn and home/optional goal. Returns only supported saved fields and copied points; records IDs in a local uniqueness Set. Rejects duplicates, unknown phases and invalid integer limits before restoration; no session mutation. */ (
        v,
      ) => {
        if (
          !v ||
          typeof v.id !== "string" ||
          v.id.length > 100 ||
          ids.has(v.id) ||
          !Number.isInteger(v.page) ||
          v.page < 0 ||
          !["idle", "patrol", "wander", "chase", "return"].includes(v.phase) ||
          !Number.isInteger(v.index) ||
          v.index < 0 ||
          v.index > 63 ||
          !Number.isInteger(v.turn) ||
          v.turn < 0 ||
          v.turn > 1000000000
        )
          throw Error("Invalid behavior controller.");
        ids.add(v.id);
        const point =
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.point.8 — Handles point within actor behavior. Inputs: p. Uses: number is finite; error. Returns: a record containing x, y. */
  /* @function actor-behavior.point.8Reviewed — Validates one saved horizontal home/destination against cell bounds. Inputs: point with finite x/y world coordinates. Returns a new x/y pair. Rejects missing, nonfinite or positions outside 1 through width/height minus one, using size as legacy fallback. Does not mutate supplied points. */ (
            p,
          ) => {
            if (
              !p ||
              !Number.isFinite(p.x) ||
              !Number.isFinite(p.y) ||
              p.x < 1 ||
              p.y < 1 ||
              p.x > (bounds.width ?? bounds.size) - 1 ||
              p.y > (bounds.height ?? bounds.size) - 1
            )
              throw Error("Invalid behavior home or destination.");
            return { x: p.x, y: p.y };
          };
        return {
          id: v.id,
          page: v.page,
          phase: v.phase,
          index: v.index,
          turn: v.turn,
          home: point(v.home),
          goal: v.goal ? point(v.goal) : null,
        };
      },
    );
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.capture.9 — Handles capture within actor behavior. Inputs: events; controllers. Uses: events flat map. Returns: events flat map using a callback. */
  /* @function actor-behavior.capture.9Reviewed — Captures serializable behavior state for the supplied events. Inputs: current events and session controller Map. Returns fresh records only for controllers whose behavior page still belongs to its event. Copies home/goal coordinates and excludes transient trace data; does not mutate simulation or validate output. */ function capture(
    events,
    controllers,
  ) {
    return events.flatMap(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.callback.10 — Provides the callback for events flat map. Inputs: e. Uses: controllers get; e pages index of. Returns: chain and page is at least 0 selects a list of a record containing id, page, home, phase, index, turn, goal or a list of . */
  /* @function actor-behavior.callback.10Reviewed — Converts an event controller to a saved record when its page remains attached. Inputs: event with ID and page list. Returns a one-record array or empty array for flatMap. Stores numeric page index and copied home/goal rather than live page references; no mutation or new controller. */ (
        e,
      ) => {
        const c = controllers.get(e.id),
          page = e.pages.indexOf(c?.page);
        return c?.page?.behavior && page >= 0
          ? [
              {
                id: e.id,
                page,
                home: { ...c.home },
                phase: c.phase,
                index: c.index,
                turn: c.turn,
                goal: c.goal ? { ...c.goal } : null,
              },
            ]
          : [];
      },
    );
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.bindings.11 — Handles bindings within actor behavior. Inputs: value; events; bounds. Uses: snapshots; events find; error. Returns: checked. */
  /* @function actor-behavior.bindings.11Reviewed — Checks saved controller records against the supplied current event pages. Inputs: snapshots, events and cell bounds. Returns validated copies after confirming every page has behavior and saved patrol index fits its waypoint count. Throws on structural or binding mismatch before any controller writes; no session mutation. */ function bindings(
    value,
    events,
    bounds,
  ) {
    const checked = snapshots(value, bounds);
    for (const v of checked) {
      const page = events.find(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.callback.12 — Returns e id equals v id. Inputs: e. Returns: e id equals v id. */
  /* @function actor-behavior.callback.12Reviewed — Finds the event referenced by a validated saved controller. Inputs: candidate event. Returns whether its ID equals the captured saved ID; no mutation. Missing match is rejected by enclosing page validation. */ (
          e,
        ) => e.id === v.id,
      )?.pages[v.page];
      if (
        !page?.behavior ||
        v.index >= Math.max(1, page.behavior.points.length)
      )
        throw Error("Saved behavior does not match event page.");
    }
    return checked;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.restore.13 — Applies saved state to this system. Inputs: value; events; controllers; bounds. Uses: bindings; controllers set; events find. */
  /* @function actor-behavior.restore.13Reviewed — Restores validated behavior controllers into a session Map. Inputs: saved records, current events, controller Map and cell bounds. Returns nothing; validates the whole batch and page bindings first, then binds each record to its live page and resets trace to an empty list. Updates matching Map entries without clearing unrelated entries; validation errors leave writes unstarted. Assumes event pages stay unchanged during synchronous restoration. */ function restore(
    value,
    events,
    controllers,
    bounds,
  ) {
    const checked = bindings(value, events, bounds);
    for (const v of checked)
      controllers.set(v.id, {
        ...v,
        page: events.find(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function actor-behavior.callback.14 — Returns e id equals v id. Inputs: e. Returns: e id equals v id. */
  /* @function actor-behavior.callback.14Reviewed — Locates the live event page owner during validated controller restoration. Inputs: candidate event. Returns exact ID match with the saved record; no mutation. The enclosing binding check has already guaranteed a matching event/page. */ (
            e,
          ) => e.id === v.id,
        ).pages[v.page],
        trace: [],
      });
  }
  root.FrontierActorBehavior = {
    defaults,
    validate,
    update,
    snapshots,
    bindings,
    capture,
    restore,
  };
})(typeof window === "undefined" ? globalThis : window);
