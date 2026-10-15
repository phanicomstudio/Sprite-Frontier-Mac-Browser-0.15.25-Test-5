/* Transfer ownership: fade out -> commit once -> fade in -> resume once.
 * Simulation is gated while busy. Trace is bounded and contains no asset/event
 * payloads. Native MZ fade speed is 24 frames (0.4 seconds at 60 Hz). */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function scene-transition.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier scene transition. */
(/* @function scene-transition.installReviewed — Installs cell-transfer lifecycle ownership for preparation, effects and commit/resume. Busy state gates simulation/input, each transfer commits/resumes once and diagnostics stay bounded; registration does not initiate travel. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  /* @function scene-transition.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: object pattern. Returns: a record containing reserve, update, busy, debug. */ function create({
    commit,
    complete,
    opacity,
    melt,
    door,
    ready,
    prepare,
    preparationReady,
  }) {
    let job = null,
      phase = "idle",
      elapsed = 0;
    const trace = [];
    /* @function scene-transition.record.3 — Handles record within scene transition. Inputs: action. Uses: trace push; trace shift. */ function record(
      action,
    ) {
      trace.push({ action, map: job?.map, fade: job?.fade });
      if (trace.length > 16) trace.shift();
    }
    /* @function scene-transition.reserve.4 — Handles reserve within scene transition. Inputs: value. Updates: job; phase; elapsed. Uses: error; a list of 0, 1, 2 includes; a list of "fade", "melt" includes; melt begin. */ /* @function scene-transition.reserve1517 — Inputs: transfer job with validated fade/style and optional door config. Reserves one transfer, prepares presentation before commit, downgrades missing door assets to reported fade. Returns nothing; throws concurrent/invalid jobs. October 9 extends prior fade/melt contract. */ function reserve(
      value,
    ) {
      if (job) throw Error("A map transition is already pending.");
      if (![0, 1, 2].includes(value.fade))
        throw Error("Invalid transfer fade.");
      if (
        value.effect !== undefined &&
        !["fade", "melt", "door", "immediate"].includes(value.effect)
      )
        throw Error("Invalid transition effect.");
      if (value.effect === "melt" && !melt)
        throw Error("Screen melt service is unavailable.");
      /* October 12: initiate destination asset preparation once at reservation, before cinematic playback. Preparation is read-only; commit still owns the one actual cell change. */ prepare?.(
        value,
      );
      if (value.effect === "door") {
        if (!door) throw Error("Door presentation unavailable.");
        try {
          door.begin(value.door);
        } catch (error) {
          door.end();
          door.report?.(
            "Door presentation unavailable; using fade: " + error.message,
          );
          value = { ...value, effect: "fade" };
        }
      }
      if (value.effect === "melt") melt.begin(value);
      job = value;
      phase =
        value.effect === "door"
          ? door.ready
            ? "door-preparing"
            : "door"
          : value.effect === "melt"
            ? "melt-commit"
            : "out";
      elapsed = 0;
      record("reserved");
      opacity(
        phase === "door-preparing" ? 1 : 0,
        value.fade === 1 ? "white" : "black",
      );
    }
    /* @function scene-transition.update.5 — Advances this system using the current state and elapsed time. Inputs: dt. Updates: phase; job; elapsed. Uses: number is finite; error; commit; record. Returns: false; true. */ function update(
      dt,
    ) {
      if (!job) return false;
      if (!Number.isFinite(dt) || dt < 0)
        throw Error(
          "Invalid transition time.",
        ); /* 2026-10-09: door playback completes into black before the one transfer commit. Closing is heard behind the camera; destination then fades in. */
      /* October 12: cold decode/shader initialization occurs under opaque loading cover before cinematic time starts. Warm transfers still pass this phase once; no queued activation or skipping. */ if (
        phase === "door-preparing"
      ) {
        try {
          elapsed += dt;
          if (elapsed > 10) throw Error("Door resource preparation timed out.");
          if ((!preparationReady || preparationReady(job)) && door.ready()) {
            phase = "door";
            elapsed = 0;
            opacity(0, "black");
            record("door-ready");
          }
        } catch (error) {
          door.end();
          record("failed");
          job = null;
          phase = "idle";
          opacity(0, "black");
          throw error;
        }
        return true;
      }
      if (phase === "door") {
        try {
          if (door.update(dt)) {
            opacity(1, "black");
            commit(job);
            record("committed");
            door.end();
            phase = "in";
            elapsed = 0;
          }
        } catch (error) {
          door.end();
          record("failed");
          job = null;
          phase = "idle";
          opacity(0, "black");
          throw error;
        }
        return true;
      }
      if (phase === "melt-commit" || phase === "melt") {
        try {
          if (phase === "melt-commit") {
            commit(job);
            record("committed");
            phase = "melt";
          }
          if (melt.update(dt)) {
            const finished = job;
            record("completed");
            job = null;
            phase = "idle";
            melt.end();
            complete(finished);
          }
        } catch (error) {
          record("failed");
          job = null;
          phase = "idle";
          melt.end();
          opacity(0, "black");
          throw error;
        }
        return true;
      }
      const duration = job.fade === 2 || job.effect === "immediate" ? 0 : 0.4;
      elapsed += dt;
      if (phase === "out") {
        opacity(
          duration ? Math.min(1, elapsed / duration) : 0,
          job.fade === 1 ? "white" : "black",
        );
        if (elapsed >= duration) {
          try {
            commit(job);
            record("committed");
            phase = "in";
            elapsed = 0;
          } catch (error) {
            record("failed");
            job = null;
            phase = "idle";
            opacity(0, "black");
            throw error;
          }
        }
      }
      if (phase === "in" && ready && !ready(job) && elapsed < 10) {
        opacity(1, "black");
        return true;
      }
      if (phase === "in" && (duration === 0 || elapsed >= duration)) {
        const finished = job;
        record("completed");
        job = null;
        phase = "idle";
        opacity(0, "black");
        complete(finished);
      } else if (phase === "in")
        opacity(1 - elapsed / duration, job.fade === 1 ? "white" : "black");
      return true;
    }
    /* @function scene-transition.skip1517 — Inputs: none. Completes any reserved presentation, committing only if not already committed. Returns false when idle; true when skipped. Clears overlay before continuation; failures retain diagnostics and never re-commit automatically. */
    function skip() {
      if (!job) return false;
      const finished = job;
      try {
        if (["out", "door", "melt-commit"].includes(phase)) {
          commit(job);
          record("committed");
        }
        record("skipped");
        job = null;
        phase = "idle";
        door?.end();
        melt?.end();
        opacity(0, "black");
        complete(finished);
        return true;
      } catch (error) {
        record("failed");
        job = null;
        phase = "idle";
        door?.end();
        melt?.end();
        opacity(0, "black");
        throw error;
      }
    }
    /* October 12, 2026: only the opaque door phase owns the complete world view. Fade-in and melt still require live destination rendering; never use busy alone to suppress them. */
    /* October 12, 2026 — current ownership includes door-preparing: the black cover hides resource decoding and GPU warmup before the opaque cinematic. The getter below returns true for both phases; destination fade-in/loading after commit and melt remain live-rendered. Supersedes the earlier door-only description while retaining it as history. */
    return {
      reserve,
      update,
      skip,
      get ownsWorldView /* @function scene-transition.ownsWorldView1523 — Inputs: none. Returns true only while a reserved door cinematic covers the world with its own opaque canvas. No mutation; false during destination loading/fade-in or melt so those phases retain live rendering. */() {
        return !!job && (phase === "door" || phase === "door-preparing");
      },
      get busy /* @function scene-transition.busy.6 — Handles busy within scene transition. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of the inverse of job. */() {
        return !!job;
      },
      debug:
        /* @function scene-transition.debug.7 — Returns a record containing phase, elapsed, trace. Inputs: no explicit arguments; uses enclosing module state. Uses: trace map. Returns: a record containing phase, elapsed, trace. */ () => ({
          phase,
          elapsed,
          trace: trace.map(
            /* @function scene-transition.callback.8 — Returns a record containing copied fields. Inputs: e. Returns: a record containing copied fields. */ (
              e,
            ) => ({ ...e }),
          ),
        }),
    };
  }
  root.FrontierSceneTransition = { create };
})(typeof window === "undefined" ? globalThis : window);
