/* Horizontal screen shake follows a 60 Hz logical clock so render frequency
 * cannot change its path. It settles at zero after duration; capture is scalar.
 * Starting another shake changes power/speed/duration without snapping position. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function screen-shake.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier screen shake. */
(/* @function screen-shake.installReviewed — Installs horizontal screen-shake scalar state on a 60 Hz logical clock. It settles to zero and new power/speed/duration changes preserve current position; registration does not move world actors. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function screen-shake.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: s. Uses: number is integer; a list of - 1, 1 includes; number is finite; error. Returns: a record containing copied fields. */
  /* @function screen-shake.reviewedvalidate_2 — Validates portable shake scalars. Inputs: saved s. Returns shallow copied state; power/speed integers1-9, remaining ticks -1024..999, direction±1, finite offset magnitude at most64 logical pixels and fraction0..<1. Negative remaining permits waveform settling. Throws before adoption; unknown fields retained and no state mutation. */ function validate(
    s,
  ) {
    if (
      !s ||
      !Number.isInteger(s.power) ||
      s.power < 1 ||
      s.power > 9 ||
      !Number.isInteger(s.speed) ||
      s.speed < 1 ||
      s.speed > 9 ||
      !Number.isInteger(s.remaining) ||
      s.remaining < -1024 ||
      s.remaining > 999 ||
      ![-1, 1].includes(s.direction) ||
      !Number.isFinite(s.offset) ||
      Math.abs(s.offset) > 64 ||
      !Number.isFinite(s.fraction) ||
      s.fraction < 0 ||
      s.fraction >= 1
    )
      throw Error("Invalid screen shake state.");
    return { ...s };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function screen-shake.create.3 — Builds a new instance and its public operations from the supplied configuration. Inputs: render. Returns: a record containing start, update, capture, restore, reset. */
  /* @function screen-shake.reviewedcreate_3 — Creates independent horizontal-shake controller. Inputs: synchronous render(offsetPixels) callback. Returns start/update/capture/restore/reset API with private scalar state; does not paint immediately. No world mutation; callback failures propagate during later painting. */ function create(
    render,
  ) {
    let state = {
      power: 5,
      speed: 5,
      remaining: 0,
      direction: 1,
      offset: 0,
      fraction: 0,
    };
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-shake.paint.4 — Handles paint within screen shake. Inputs: no explicit arguments; uses enclosing module state. Uses: render. */
  /* @function screen-shake.reviewedpaint_4 — Applies rounded horizontal shake offset. Inputs: none. Returns undefined; invokes captured renderer with Math.round(state.offset) logical pixels. No scalar changes; renderer side effects/errors remain caller-owned. */ function paint() {
      render(Math.round(state.offset));
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-shake.start.5 — Handles start within screen shake. Inputs: power; speed; frames. Uses: number is integer; error; object assign; paint. */
  /* @function screen-shake.reviewedstart_5 — Starts or replaces shake amplitude/cadence/duration. Inputs: integer power/speed1-9 and frames1-999 at60Hz. Returns undefined; validates first, updates parameters/remaining while retaining offset/direction/fraction, then paints. Invalid parameters leave state; renderer failure occurs after state update. */ function start(
      power,
      speed,
      frames,
    ) {
      if (
        !Number.isInteger(power) ||
        power < 1 ||
        power > 9 ||
        !Number.isInteger(speed) ||
        speed < 1 ||
        speed > 9 ||
        !Number.isInteger(frames) ||
        frames < 1 ||
        frames > 999
      )
        throw Error("Invalid screen shake parameters.");
      Object.assign(state, { power, speed, remaining: frames });
      paint();
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-shake.tick.6 — Handles tick within screen shake. Inputs: no explicit arguments; uses enclosing module state. Updates: state offset; state direction. Returns: without a result. */
  /* @function screen-shake.reviewedtick_6 — Advances one60Hz shake step and settling. Inputs: none. Returns undefined; no-op settled, otherwise updates offset/direction and decrements remaining, including negative settling ticks until crossing zero. Uses power*speed/10 logical pixels per tick; no rendering here. */ function tick() {
      if (state.remaining <= 0 && state.offset === 0) return;
      const step = ((state.power * state.speed) / 10) * state.direction,
        next = state.offset + step;
      state.offset = state.remaining <= 1 && state.offset * next < 0 ? 0 : next;
      if (state.offset > 2 * state.power) state.direction = -1;
      if (state.offset < -2 * state.power) state.direction = 1;
      state.remaining--;
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-shake.update.7 — Advances this system using the current state and elapsed time. Inputs: dt. Updates: state fraction. Uses: number is finite; error; tick; paint. */
  /* @function screen-shake.reviewedupdate_7 — Advances shake from elapsed seconds. Inputs: finite nonnegative dt. Returns undefined; accumulates fractional60Hz ticks, executes at most2048 ticks per call and paints. Extra whole ticks beyond cap are discarded rather than queued. Rejects nonfinite/negative or overflow time before tick loop; renderer errors propagate after state changes. */ function update(
      dt,
    ) {
      if (!Number.isFinite(dt) || dt < 0) throw Error("Invalid shake time.");
      const frames = state.fraction + dt * 60;
      if (!Number.isFinite(frames))
        throw Error("Shake time exceeds finite range.");
      const ticks = Math.floor(frames + 1e-9);
      state.fraction = Math.max(0, frames - ticks);
      for (let i = 0; i < Math.min(ticks, 2048); i++) tick();
      paint();
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-shake.capture.8 — Handles capture within screen shake. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing copied fields. */
  /* @function screen-shake.reviewedcapture_8 — Snapshots portable shake scalars. Inputs: none. Returns shallow state copy; all supported fields primitive. No renderer calls or mutation. */ function capture() {
      return { ...state };
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-shake.restore.9 — Applies saved state to this system. Inputs: value. Updates: state. Uses: validate; paint. */
  /* @function screen-shake.reviewedrestore_9 — Restores validated shake state and paints offset. Inputs: saved value. Returns undefined; invalid scalars throw before adoption, renderer errors propagate after adoption. Caller owns travel/save transaction, not this controller. */ function restore(
      value,
    ) {
      state = validate(value);
      paint();
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-shake.reset.10 — Handles reset within screen shake. Inputs: no explicit arguments; uses enclosing module state. Updates: state. Uses: paint. */
  /* @function screen-shake.reviewedreset_10 — Returns shake to default settled state. Inputs: none. Returns undefined; replaces state with zero offset/fraction/remaining and default power/speed/direction, paints zero. Renderer failure propagates; no actor changes. */ function reset() {
      state = {
        power: 5,
        speed: 5,
        remaining: 0,
        direction: 1,
        offset: 0,
        fraction: 0,
      };
      paint();
    }
    return { start, update, capture, restore, reset };
  }
  root.FrontierScreenShake = { create, validate };
})(typeof window === "undefined" ? globalThis : window);
