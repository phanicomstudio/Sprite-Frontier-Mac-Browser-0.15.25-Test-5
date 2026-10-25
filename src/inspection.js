/* Inspection CRT scrolling has no extra timer/frame loop.
 * New text resets to the top; overflow starts moving after a reading pause.
 * Hover and manual wheel input suspend automatic motion. Events stay inside
 * this screen, preventing camera zoom or page scrolling while reading. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function inspection.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier inspection. Uses: document get element by id; screen add event listener. */
(/* @function inspection.installReviewed — Installs inspection-screen scrolling on the existing frame loop. Reading delay, hover and manual wheel suspension are separate from camera/page scrolling; no additional timer/render loop is created. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  const screen = document.getElementById("inspectionScroll"),
    description = document.getElementById("descriptionScreen");
  let text = "",
    changed = 0,
    last = 0,
    hover = false,
    manual = 0,
    ended = 0,
    position = 0;
  screen.addEventListener(
    "mouseenter",
    /* Historical contract retained; October 14 reviewed explanation follows. @function inspection.callback.2 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: hover. Returns: assignment. */
  /* @function inspection.reviewedcallback_2 — Suspends inspection auto-scroll on hover. Inputs: ignored mouseenter. Returns assigned true; sets local hover only, no camera changes. */ () =>
      (hover = true),
  );
  screen.addEventListener(
    "mouseleave",
    /* Historical contract retained; October 14 reviewed explanation follows. @function inspection.callback.3 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: hover. Returns: assignment. */
  /* @function inspection.reviewedcallback_3 — Releases hover suspension. Inputs: ignored mouseleave. Returns assigned false; other reading/manual timers still govern scrolling. */ () =>
      (hover = false),
  );
  screen.addEventListener(
    "wheel",
    /* Historical contract retained; October 14 reviewed explanation follows. @function inspection.callback.4 — Provides the callback for screen add event listener. Inputs: event. Updates: screen scroll top; position; manual. Uses: document get element by id using "gameFrame" class list contains; document get element by id; event prevent default; event stop propagation. Returns: without a result. */
  /* @function inspection.reviewedcallback_4 — Consumes manual wheel scrolling only in HUD cursor mode. Inputs: DOM wheel event. Returns undefined; outside mode no-op, otherwise prevents default/stops propagation, adds deltaY to screen scrollTop, stores position and manual timestamp milliseconds. Treats deltaY as pixels without deltaMode conversion; no camera zoom. Required DOM errors propagate. */ (
      event,
    ) => {
      if (!document.getElementById("gameFrame").classList.contains("hudCursor"))
        return;
      event.preventDefault();
      event.stopPropagation();
      screen.scrollTop += event.deltaY;
      position = screen.scrollTop;
      manual = performance.now();
    },
    { passive: false },
  );
  /* Historical contract retained; October 14 reviewed explanation follows. @function inspection.update.5 — Advances this system using the current state and elapsed time. Inputs: point mode. Updates: last; text; changed; ended; screen scroll top. Uses: performance now. Returns: without a result. */
  /* @function inspection.reviewedupdate_5 — Advances inspection reading scroll on existing frame loop. Inputs: pointMode (currently unused). Returns undefined; text changes reset top/read delay, hover or manual wheel pauses, overflow advances12 CSS pixels/second with dt capped0.05 seconds, waits3 seconds initially/4 after wheel and5 at end then loops. Uses performance timestamps milliseconds and local scroll state only; no new timers or world mutation. DOM errors propagate. */ function update(
    pointMode,
  ) {
    const now = performance.now(),
      dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (description.textContent !== text) {
      text = description.textContent;
      changed = now;
      ended = 0;
      screen.scrollTop = 0;
      position = 0;
    }
    const max = screen.scrollHeight - screen.clientHeight;
    if (max <= 1 || hover || now - manual < 4000 || now - changed < 3000)
      return;
    if (screen.scrollTop < max - 1) {
      position = Math.min(max, position + dt * 12);
      screen.scrollTop = Math.floor(position);
      ended = 0;
    } else if (!ended) ended = now;
    else if (now - ended > 5000) {
      screen.scrollTop = 0;
      position = 0;
      changed = now;
      ended = 0;
    }
  }
  root.FrontierInspection = { update };
})(window);
