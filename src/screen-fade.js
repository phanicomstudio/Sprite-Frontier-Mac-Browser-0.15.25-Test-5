/* Frame-independent screen brightness tween. Only scalar state is captured.
 * Native MZ uses 24 frames for event Fadeout/Fadein, equivalent to .4 seconds.
 * Scene transfers own a separate layer; resetting a map clears this effect. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function screen-fade.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier screen fade. */
(/* @function screen-fade.installReviewed — Installs frame-independent scalar screen-brightness tweening. Event fades use the native 24-frame/0.4-second timing convention; map transfer cover is separately owned and captured data contains no renderer closures. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function screen-fade.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: s. Uses: a list of "opacity", "from", "to" some; number is finite; a list of 0, 0.4 includes; error. Returns: a record containing opacity, from, to, elapsed, duration. */
  /* @function screenFade.reviewedvalidate_2 — Validates portable event-fade state. Inputs: s. Returns opacity/from/to dimensionless0-1, elapsed seconds0-0.4 and duration exactly0 or0.4. Throws on missing/nonfinite/range-invalid values; no adoption/rendering. Does not require elapsed at most duration because completed state retains elapsed0.4 while duration becomes0. */ function validate(
    s,
  ) {
    if (
      !s ||
      ["opacity", "from", "to"].some(
        /* Historical contract retained; October 14 reviewed explanation follows. @function screen-fade.callback.3 — Returns the inverse of number is finite using s at k or s at k is less than 0 or s at k is greater than 1. Inputs: k. Uses: number is finite. Returns: the inverse of number is finite using s at k or s at k is less than 0 or s at k is greater than 1. */
  /* @function screenFade.reviewedcallback_3 — Detects invalid fade opacity scalar. Inputs: field name k and captured s. Returns true for nonfinite/outside0-1; no mutation. */ (
          k,
        ) => !Number.isFinite(s[k]) || s[k] < 0 || s[k] > 1,
      ) ||
      !Number.isFinite(s.elapsed) ||
      s.elapsed < 0 ||
      s.elapsed > 0.4 ||
      ![0, 0.4].includes(s.duration)
    )
      throw Error("Invalid screen fade state.");
    return {
      opacity: s.opacity,
      from: s.from,
      to: s.to,
      elapsed: s.elapsed,
      duration: s.duration,
    };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function screen-fade.create.4 — Builds a new instance and its public operations from the supplied configuration. Inputs: render. Returns: a record containing start, update, capture, restore, reset. */
  /* @function screenFade.reviewedcreate_4 — Creates independent event-fade controller. Inputs: synchronous render(opacity) callback. Returns start/update/capture/restore/reset API with neutral private scalar state; no immediate rendering. Separate scene-transfer cover is not controlled here. */ function create(
    render,
  ) {
    let opacity = 0,
      from = 0,
      to = 0,
      elapsed = 0,
      duration = 0;
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-fade.start.5 — Handles start within screen fade. Inputs: out. Updates: from; to; elapsed; duration. */
  /* @function screenFade.reviewedstart_5 — Starts0.4-second fade from current opacity. Inputs: out flag (truthy out, falsey in; command layer validates boolean). Returns undefined; stores current from/target1or0, resets elapsed/duration. Does not paint until update, preserving continuous interrupted fade. No world mutation. */ function start(
      out,
    ) {
      from = opacity;
      to = out ? 1 : 0;
      elapsed = 0;
      duration = 0.4;
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-fade.update.6 — Advances this system using the current state and elapsed time. Inputs: dt. Updates: elapsed; opacity; duration. Uses: number is finite; error; render. */
  /* @function screenFade.reviewedupdate_6 — Advances event fade and applies opacity. Inputs: finite nonnegative dt seconds. Returns undefined; interpolates/clamps to endpoint and marks duration0 on completion, then invokes render even if idle. Invalid time throws before mutation; renderer errors propagate after timing changes. */ function update(
      dt,
    ) {
      if (!Number.isFinite(dt) || dt < 0)
        throw Error("Invalid screen fade time.");
      if (duration) {
        elapsed = Math.min(duration, elapsed + dt);
        opacity = from + ((to - from) * elapsed) / duration;
        if (elapsed === duration) {
          opacity = to;
          duration = 0;
        }
      }
      render(opacity);
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-fade.capture.7 — Handles capture within screen fade. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing opacity, from, to, elapsed, duration. */
  /* @function screenFade.reviewedcapture_7 — Snapshots event-fade scalar state. Inputs: none. Returns fresh opacity/from/to/elapsed/duration record; no renderer closures/resources or mutation. */ function capture() {
      return { opacity, from, to, elapsed, duration };
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-fade.restore.8 — Applies saved state to this system. Inputs: s. Updates: s; object pattern. Uses: validate; render. */
  /* @function screenFade.reviewedrestore_8 — Adopts validated saved event fade and paints. Inputs: s. Returns undefined; validates before private assignment, then invokes renderer. Validation failures leave prior state, renderer errors follow adoption and caller owns overall transaction recovery. */ function restore(
      s,
    ) {
      s = validate(s);
      ({ opacity, from, to, elapsed, duration } = s);
      render(opacity);
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-fade.reset.9 — Handles reset within screen fade. Inputs: no explicit arguments; uses enclosing module state. Updates: opacity; from; to; elapsed; duration. Uses: render. */
  /* @function screenFade.reviewedreset_9 — Clears event fade to visible gameplay. Inputs: none. Returns undefined; sets all scalars zero and renders opacity0. Does not remove separately owned scene-transition cover; renderer errors propagate. */ function reset() {
      opacity = from = to = elapsed = duration = 0;
      render(0);
    }
    return { start, update, capture, restore, reset };
  }
  root.FrontierScreenFade = { create, validate };
})(typeof window === "undefined" ? globalThis : window);
