/* Tint state is a four-channel tween independent of the GPU implementation.
 * MZ's remaining-frame interpolation is linear; seconds preserve that curve
 * across rendering rates. Zero-frame commands apply immediately. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function screen-tone.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier screen tone. */
(/* @function screen-tone.installReviewed — Installs four-channel tint tween state independently of GPU implementation. Seconds preserve native linear interpolation and zero-duration commands apply immediately; renderer owns the actual filter. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function screen-tone.tone.2 — Handles tone within screen tone. Inputs: v; assignment pattern. Uses: array is array; v some; error. Returns: a list of spread element. */
  /* @function screen-tone.reviewedtone_2 — Validates four-channel tone values. Inputs: array v and optional integer requirement. Returns detached copy; RGB offsets finite -255..255, gray amount0..255, integers required for authored start but floating interpolation allowed for snapshots. Throws on invalid shape/range; no mutation. */ function tone(
    v,
    integer = false,
  ) {
    if (
      !Array.isArray(v) ||
      v.length !== 4 ||
      v.some(
        /* Historical contract retained; October 14 reviewed explanation follows. @function screen-tone.callback.3 — Returns the inverse of number is finite using n or integer and the inverse of number is integer using n or n is less than i equals 3 selects 0 or - 255 or n is greater than 255. Inputs: n; i. Uses: number is finite; number is integer. Returns: the inverse of number is finite using n or integer and the inverse of number is integer using n or n is less than i equals 3 selects 0 or - 255 or n is greater than 255. */
  /* @function screen-tone.reviewedcallback_3 — Detects invalid tone component. Inputs: n/index i with captured integer flag. Returns true for nonfinite/noninteger-when-required or RGB/gray range violation. No mutation. */ (
          n,
          i,
        ) =>
          !Number.isFinite(n) ||
          (integer && !Number.isInteger(n)) ||
          n < (i === 3 ? 0 : -255) ||
          n > 255,
      )
    )
      throw Error("Invalid screen tone.");
    return [...v];
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function screen-tone.validate.4 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: s. Uses: number is finite; error; tone. Returns: a record containing value, from, target, duration, elapsed. */
  /* @function screen-tone.reviewedvalidate_4 — Validates saved tint tween state. Inputs: s with value/from/target arrays and duration/elapsed seconds. Returns detached channel arrays and timing duration0..999/60, elapsed0..duration. Throws before adoption; accepts intermediate floating channels and does not infer consistency between value and timing. */ function validate(
    s,
  ) {
    if (
      !s ||
      !Number.isFinite(s.duration) ||
      s.duration < 0 ||
      s.duration > 999 / 60 ||
      !Number.isFinite(s.elapsed) ||
      s.elapsed < 0 ||
      s.elapsed > s.duration
    )
      throw Error("Invalid screen tone state.");
    return {
      value: tone(s.value),
      from: tone(s.from),
      target: tone(s.target),
      duration: s.duration,
      elapsed: s.elapsed,
    };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function screen-tone.create.5 — Builds a new instance and its public operations from the supplied configuration. Inputs: render. Returns: a record containing start, update, capture, restore, reset. */
  /* @function screen-tone.reviewedcreate_5 — Creates independent scalar tint tween controller. Inputs: synchronous render(toneArray) callback. Returns start/update/capture/restore/reset API. Starts neutral without painting; GPU filter ownership remains outside controller. */ function create(
    render,
  ) {
    let state = {
      value: [0, 0, 0, 0],
      from: [0, 0, 0, 0],
      target: [0, 0, 0, 0],
      duration: 0,
      elapsed: 0,
    };
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-tone.paint.6 — Handles paint within screen tone. Inputs: no explicit arguments; uses enclosing module state. Uses: render. */
  /* @function screen-tone.reviewedpaint_6 — Sends detached current tint to renderer. Inputs: none. Returns undefined; copies four channels so callback cannot mutate private array. Callback effects/errors propagate; no timer changes. */ function paint() {
      render([...state.value]);
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-tone.start.7 — Handles start within screen tone. Inputs: value; frames. Updates: value; state. Uses: tone; number is integer; error; paint. */
  /* @function screen-tone.reviewedstart_7 — Starts tint from current value toward authored target. Inputs: integer four-channel value and frames0-999 at60Hz. Returns undefined; validates first, retains current as from, sets target/timing, applies immediately when frames0 then paints. Replaces prior tween continuously; renderer failure follows scalar adoption. */ function start(
      value,
      frames,
    ) {
      value = tone(value, true);
      if (!Number.isInteger(frames) || frames < 0 || frames > 999)
        throw Error("Tint duration requires 0–999 frames.");
      state = {
        value: frames ? [...state.value] : [...value],
        from: [...state.value],
        target: value,
        duration: frames / 60,
        elapsed: 0,
      };
      paint();
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-tone.update.8 — Advances this system using the current state and elapsed time. Inputs: dt. Updates: state elapsed; state value. Uses: number is finite; error; state from map; paint. Returns: without a result. */
  /* @function screen-tone.reviewedupdate_8 — Advances linear tint tween using elapsed seconds. Inputs: finite nonnegative dt. Returns undefined; no-op duration0/alreadycomplete, otherwise clamps elapsed, interpolates from/target or assigns exact target at end, then paints. Invalid time fails before mutation; renderer errors propagate afterward. */ function update(
      dt,
    ) {
      if (!Number.isFinite(dt) || dt < 0) throw Error("Invalid tone time.");
      if (!state.duration || state.elapsed === state.duration) return;
      state.elapsed = Math.min(state.duration, state.elapsed + dt);
      const t = state.elapsed / state.duration;
      state.value =
        state.elapsed === state.duration
          ? [...state.target]
          : state.from.map(
              /* Historical contract retained; October 14 reviewed explanation follows. @function screen-tone.callback.9 — Returns v plus state target at i minus v multiplied by t. Inputs: v; i. Returns: v plus state target at i minus v multiplied by t. */
  /* @function screen-tone.reviewedcallback_9 — Interpolates one tint component. Inputs: source v/index i and captured normalized t/target. Returns v+(target[i]-v)*t; no mutation. RGB/gray remain within validated endpoints. */ (
                v,
                i,
              ) => v + (state.target[i] - v) * t,
            );
      paint();
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-tone.capture.10 — Handles capture within screen tone. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using state. */
  /* @function screen-tone.reviewedcapture_10 — Snapshots interrupted tint tween. Inputs: none. Returns detached structured clone of current/from/target and timing. No GPU resources or mutation. */ function capture() {
      return structuredClone(state);
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-tone.restore.11 — Applies saved state to this system. Inputs: value. Updates: state. Uses: validate; paint. */
  /* @function screen-tone.reviewedrestore_11 — Restores validated scalar tint tween then paints. Inputs: saved value. Returns undefined; validation before adoption, renderer failure after adoption propagates. Caller owns overall save/travel rollback. */ function restore(
      value,
    ) {
      state = validate(value);
      paint();
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-tone.reset.12 — Handles reset within screen tone. Inputs: no explicit arguments; uses enclosing module state. Updates: state. Uses: paint. */
  /* @function screen-tone.reviewedreset_12 — Clears tint to neutral channels. Inputs: none. Returns undefined; replaces arrays/timing with zeros then paints. Other effects unchanged; renderer errors propagate. */ function reset() {
      state = {
        value: [0, 0, 0, 0],
        from: [0, 0, 0, 0],
        target: [0, 0, 0, 0],
        duration: 0,
        elapsed: 0,
      };
      paint();
    }
    return { start, update, capture, restore, reset };
  }
  root.FrontierScreenTone = { create, validate, tone };
})(typeof window === "undefined" ? globalThis : window);
