/* Autonomous MZ-page motion in continuous map units. One authored MZ tile is
 * one world unit. Cadence uses the runtime's 30*(5-frequency) stop frames;
 * movement uses 2^speed/256 units per frame at a 60 Hz logical time base.
 * Custom routes will register their controller without changing this API. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function event-motion.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event motion. */
(/* @function event-motion.installReviewed — Installs autonomous event-page motion in continuous world units. One MZ tile equals one world unit; cadence/movement use the documented 60 Hz logical-time convention, with controller ownership per runtime. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-motion.update.2 — Advances this system using the current state and elapsed time. Inputs: event; page; dt; player; services; controllers. Updates: control; event facing x; event facing y; control custom; control route error. Uses: controllers get; controllers set; root frontier mzroutes start; services log. Returns: without a result. */
  /* @function event-motion.reviewedupdate_2 — Advances autonomous event-page movement. Inputs: mutable event, validated page, dt seconds, player, host services and per-event controller Map. Returns undefined; no-op absent MZ metadata or dt<=0. Reinitializes controller on page identity change, initializes facing if absent, runs custom route or cadence-based approach/random targets. Speed is2^moveSpeed/256 metres per60Hz tick; target travel swept every0.05 metre with one-metre bounds inset, through bypasses solids but not bounds. Mutates position, per-update displacement vx/vy, facing and walk timers. Custom start/step failures log and stop that route; other collision/service failures propagate. Animation follows actual motion or stepAnime. No sprite tilt or authored-page mutation. */ function update(
    event,
    page,
    dt,
    player,
    services,
    controllers,
  ) {
    let m = page.mz;
    if (!m || dt <= 0) return;
    let control = controllers.get(event.id);
    if (!control || control.page !== page) {
      control = { page, stop: 0, target: null };
      controllers.set(event.id, control);
      if (event.facingX === undefined) {
        const dir = m.image.direction;
        event.facingX = dir === 6 ? 1 : dir === 4 ? -1 : 0;
        event.facingY = dir === 8 ? 1 : dir === 2 ? -1 : 0;
      }
    }
    if (page.movement === "custom" && !control.custom && !control.routeError) {
      try {
        control.custom = root.FrontierMZRoutes.start(
          m.moveRoute,
          page,
          services,
        );
      } catch (error) {
        control.routeError = error.message;
        services.log?.(error.message);
      }
    }
    if (control.custom) m = control.custom.settings;
    const bx = event.x,
      by = event.y,
      bounds = services.bounds?.() || { width: 48, height: 48 };
    if (page.movement !== "stationary" && !control.routeError) {
      control.stop += dt * 60;
      if (control.custom && !control.target) {
        try {
          root.FrontierMZRoutes.step(control, event, player, services, dt);
        } catch (error) {
          control.routeError = error.message;
          control.custom.done = true;
          control.target = null;
          services.log?.("Movement route stopped: " + error.message);
        }
      }
      if (
        !control.custom &&
        !control.target &&
        control.stop >= 30 * (5 - m.moveFrequency)
      ) {
        let dx = 0,
          dy = 0;
        if (page.movement === "approach") {
          const x = player.x - event.x,
            y = player.y - event.y;
          if (Math.hypot(x, y) > 0.6) {
            if (Math.abs(x) > Math.abs(y)) dx = Math.sign(x);
            else dy = Math.sign(y);
          }
        } else if (page.movement === "random") {
          const choice = Math.floor(Math.random() * 4);
          dx = [0, -1, 1, 0][choice];
          dy = [-1, 0, 0, 1][choice];
        }
        if (dx || dy) {
          control.target = { x: event.x + dx, y: event.y + dy };
          if (!m.directionFix) {
            event.facingX = dx;
            event.facingY = dy;
          }
        }
        control.stop = 0;
      }
      if (control.target) {
        const dx = control.target.x - event.x,
          dy = control.target.y - event.y,
          length = Math.hypot(dx, dy),
          travel = Math.min(length, (2 ** m.moveSpeed / 256) * 60 * dt),
          x = event.x + (dx / (length || 1)) * travel,
          y = event.y + (dy / (length || 1)) * travel;
        // Sweep the segment so a delayed frame cannot leap across a thin obstacle.
        const steps = Math.max(1, Math.ceil(travel / 0.05));
        let allowed = true;
        for (let i = 1; i <= steps; i++) {
          const sx = event.x + ((x - event.x) * i) / steps,
            sy = event.y + ((y - event.y) * i) / steps;
          if (
            sx < 1 ||
            sy < 1 ||
            sx > bounds.width - 1 ||
            sy > bounds.height - 1 ||
            (!(control.custom ? control.custom.through : page.through) &&
              !services.canStand(sx, sy, event.id))
          ) {
            allowed = false;
            break;
          }
        }
        if (allowed) {
          event.x = x;
          event.y = y;
          if (length <= travel + 0.000001) {
            root.FrontierMZRoutes?.arrived(control, true);
            control.target = null;
            control.stop = 0;
          }
        } else {
          root.FrontierMZRoutes?.arrived(control, false);
          control.target = null;
          control.stop = 0;
        }
      }
    }
    event.vx = event.x - bx;
    event.vy = event.y - by;
    const moving = Math.hypot(event.vx, event.vy) > 0.000001;
    if (m.stepAnime || (m.walkAnime && moving)) {
      event.walkTime = (event.walkTime || 0) + dt;
      event.walkHold = 0.1;
    } else {
      event.walkHold = 0;
      event.walkTime = 0;
    }
  }
  root.FrontierEventMotion = { update };
})(typeof window === "undefined" ? globalThis : window);
