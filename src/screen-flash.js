/* Screen flash uses scalar state, never frame-buffer copies. MZ's remaining-
 * frames equation is linear alpha decay; seconds make it frame-rate independent.
 * A new flash replaces the previous one. Capture/restore keeps interrupted flashes. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function screen-flash.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier screen flash. */
(/* @function screen-flash.installReviewed — Installs scalar screen-flash state with frame-independent alpha decay. New flashes replace prior state and capture/restore preserves interruptions; no framebuffer copies are retained. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function screen-flash.color.2 — Handles color within screen flash. Inputs: value. Uses: array is array; value some; error. Returns: a list of spread element. */
  /* @function screen-flash.reviewedcolor_2 — Validates byte RGBA flash color. Inputs: four-element integer array0-255. Returns detached copy or throws on invalid shape/channel. No rendering/state mutation. */ function color(
    value,
  ) {
    if (
      !Array.isArray(value) ||
      value.length !== 4 ||
      value.some(
        /* Historical contract retained; October 14 reviewed explanation follows. @function screen-flash.callback.3 — Returns the inverse of number is integer using v or v is less than 0 or v is greater than 255. Inputs: v. Uses: number is integer. Returns: the inverse of number is integer using v or v is less than 0 or v is greater than 255. */
  /* @function screen-flash.reviewedcallback_3 — Detects invalid flash channel byte. Inputs: v. Returns true for noninteger/outside0-255; no mutation. */ (
          v,
        ) => !Number.isInteger(v) || v < 0 || v > 255,
      )
    )
      throw Error("Flash color requires four channels from 0 to 255.");
    return [...value];
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function screen-flash.validate.4 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: s. Uses: number is finite; error; color. Returns: a record containing color, duration, elapsed. */
  /* @function screen-flash.reviewedvalidate_4 — Validates interrupted flash state for save/restore. Inputs: s with color, duration/elapsed seconds. Returns detached color and finite timing; duration0..999/60 and elapsed0..duration. Throws before adoption; unknown fields omitted. */ function validate(
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
      throw Error("Invalid screen flash state.");
    return { color: color(s.color), duration: s.duration, elapsed: s.elapsed };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function screen-flash.create.5 — Builds a new instance and its public operations from the supplied configuration. Inputs: render. Returns: a record containing start, update, capture, restore, reset. */
  /* @function screen-flash.reviewedcreate_5 — Creates independent scalar flash controller. Inputs: synchronous render(rgbBytes,opacity0to1) callback. Returns start/update/capture/restore/reset API. Initializes invisible state without painting or retaining framebuffer; later renderer errors propagate. */ function create(
    render,
  ) {
    let state = { color: [255, 255, 255, 0], duration: 0, elapsed: 0 };
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-flash.paint.6 — Handles paint within screen flash. Inputs: no explicit arguments; uses enclosing module state. Uses: render; state color slice. */
  /* @function screen-flash.reviewedpaint_6 — Applies flash color and remaining linear opacity. Inputs: none. Returns undefined; passes detached RGB and alpha-byte/255 multiplied by remaining-duration fraction, zero when duration0. Does not alter timing; renderer errors propagate. */ function paint() {
      render(
        state.color.slice(0, 3),
        state.duration
          ? (state.color[3] / 255) * (1 - state.elapsed / state.duration)
          : 0,
      );
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-flash.start.7 — Handles start within screen flash. Inputs: channels; frames. Updates: state. Uses: color; number is integer; error; paint. */
  /* @function screen-flash.reviewedstart_7 — Replaces flash with validated color/duration. Inputs: channels byte RGBA and frames integer1-999 at60Hz. Returns undefined; validates before adoption then resets elapsed and paints. New flash supersedes old; renderer errors can occur after adoption. */ function start(
      channels,
      frames,
    ) {
      const checked = color(channels);
      if (!Number.isInteger(frames) || frames < 1 || frames > 999)
        throw Error("Flash duration requires 1–999 frames.");
      state = { color: checked, duration: frames / 60, elapsed: 0 };
      paint();
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-flash.update.8 — Advances this system using the current state and elapsed time. Inputs: dt. Updates: state elapsed. Uses: number is finite; error; paint. */
  /* @function screen-flash.reviewedupdate_8 — Advances flash decay by real elapsed time. Inputs: finite nonnegative dt seconds. Returns undefined; clamps elapsed to duration and paints even when complete. Invalid time throws before update; renderer failure after timing mutation propagates. */ function update(
      dt,
    ) {
      if (!Number.isFinite(dt) || dt < 0) throw Error("Invalid flash time.");
      state.elapsed = Math.min(state.duration, state.elapsed + dt);
      paint();
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-flash.capture.9 — Handles capture within screen flash. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using state. */
  /* @function screen-flash.reviewedcapture_9 — Copies interrupted flash state for persistence. Inputs: none. Returns structured clone of color/duration/elapsed. No framebuffer or renderer state retained; no mutation. */ function capture() {
      return structuredClone(state);
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-flash.restore.10 — Applies saved state to this system. Inputs: value. Updates: state. Uses: validate; paint. */
  /* @function screen-flash.reviewedrestore_10 — Adopts validated interrupted flash and repaints. Inputs: saved value. Returns undefined; validation fails before adoption, renderer failure after adoption propagates. Caller owns rollback if needed. */ function restore(
      value,
    ) {
      state = validate(value);
      paint();
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function screen-flash.reset.11 — Handles reset within screen flash. Inputs: no explicit arguments; uses enclosing module state. Updates: state. Uses: paint. */
  /* @function screen-flash.reviewedreset_11 — Clears flash to invisible default. Inputs: none. Returns undefined; replaces state with zero alpha/duration/elapsed and paints. Does not reset other screen effects; renderer errors propagate. */ function reset() {
      state = { color: [255, 255, 255, 0], duration: 0, elapsed: 0 };
      paint();
    }
    return { start, update, capture, restore, reset };
  }
  root.FrontierScreenFlash = { create, validate, color };
})(typeof window === "undefined" ? globalThis : window);
