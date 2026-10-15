/* Reusable vertical movement rules. hover follows ground clearance; flight uses
 * absolute altitude. Q descends and E ascends in flight; normal E remains jump.
 * Any actor can call update with its own authored profile and input axis. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function flight.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier flight. */
(/* @function flight.installReviewed — Installs reusable vertical flight/hover movement rules. Hover follows ground clearance, flight uses absolute altitude, and actor-specific profiles/input axes remain caller-owned; ordinary jump controls stay separate. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  const defaults = {
    mode: "ground",
    height: 2,
    ascent: 2,
    descent: 2,
    acceleration: 4,
    min: 0,
    max: 30,
  };
  // Authoring ranges keep velocities and altitude finite.
  /* Historical contract retained; October 14 reviewed explanation follows. @function flight.validate.2 — Authoring ranges keep velocities and altitude finite. Inputs: assignment pattern. Uses: a list of "ground", "hover", "flight" includes; object keys using defaults filter using a callback some; object keys using defaults filter; object keys. Returns: v. */
  /* @function flight.reviewedvalidate_2 — Normalizes actor flight profile. Inputs: optional partial value. Returns default-merged record, validates ground/hover/flight and finite fields: height0-30 metres, ascent/descent positive<=20 metres/second, acceleration positive<=50 metres/second squared, min>=-30/max<=100 metres with max>min. Extra fields retained; throws before adoption. Range does not imply collision clearance. */ function validate(
    value = {},
  ) {
    const v = {
      ...defaults,
      ...value,
    };
    if (
      !["ground", "hover", "flight"].includes(v.mode) ||
      Object.keys(defaults)
        .filter(
          /* Historical contract retained; October 14 reviewed explanation follows. @function flight.callback.3 — Returns k does not equal "mode". Inputs: k. Returns: k does not equal "mode". */
  /* @function flight.reviewedcallback_3 — Selects numeric profile keys. Inputs: k. Returns k!=mode; no mutation. */ (
            k,
          ) => k !== "mode",
        )
        .some(
          /* Historical contract retained; October 14 reviewed explanation follows. @function flight.callback.4 — Returns the inverse of number is finite using v at k. Inputs: k. Uses: number is finite. Returns: the inverse of number is finite using v at k. */
  /* @function flight.reviewedcallback_4 — Detects nonfinite flight parameter. Inputs: k and captured profile v. Returns !Number.isFinite(v[k]); no mutation. */ (
            k,
          ) => !Number.isFinite(v[k]),
        ) ||
      v.height < 0 ||
      v.height > 30 ||
      v.ascent <= 0 ||
      v.ascent > 20 ||
      v.descent <= 0 ||
      v.descent > 20 ||
      v.acceleration <= 0 ||
      v.acceleration > 50 ||
      v.min < -30 ||
      v.max > 100 ||
      v.max <= v.min
    )
      throw Error("Invalid flight profile.");
    return v;
  }
  // Return false for ground physics; otherwise own the actor vertical position.
  /* Historical contract retained; October 14 reviewed explanation follows. @function flight.update.5 — Return false for ground physics; otherwise own the actor vertical position. Inputs: actor; world; dt; assignment pattern; assignment pattern. Updates: actor flight velocity; actor z; actor grounded; actor vertical velocity; actor ground z. Uses: root frontier terrain height. Returns: false; true. */
  /* @function flight.reviewedupdate_5 — Owns actor vertical position for hover/flight. Inputs: actor, world, finite nonnegative dt seconds, axis expected-1..1 and validated profile(default world.flight). Returns false unchanged for ground mode, otherwise true after velocity smoothing/altitude adoption. Hover approaches terrain-relative clearance; flight integrates ascent/descent then clamps configured altitude and terrain floor. Mutates z/flightVelocity/grounded=false/verticalVelocity0/groundZ; does not sweep room/model ceiling geometry here, caller integration must enforce those restrictions. No validation of dt/axis here; service errors propagate. */ function update(
    actor,
    world,
    dt,
    axis = 0,
    profile = world.flight || defaults,
  ) {
    if (profile.mode === "ground") return false;
    const floor = root.FrontierTerrain.height(world, actor.x, actor.y);
    const speed = axis * (axis < 0 ? profile.descent : profile.ascent);
    actor.flightVelocity =
      (actor.flightVelocity || 0) +
      Math.max(
        -profile.acceleration * dt,
        Math.min(
          profile.acceleration * dt,
          speed - (actor.flightVelocity || 0),
        ),
      );
    const target =
      profile.mode === "hover"
        ? Math.max(
            floor,
            Math.min(
              profile.max,
              Math.max(profile.min, floor + profile.height),
            ),
          )
        : Math.max(
            floor,
            Math.min(
              profile.max,
              Math.max(
                profile.min,
                (actor.z ?? floor) + actor.flightVelocity * dt,
              ),
            ),
          );
    actor.z =
      profile.mode === "hover"
        ? (actor.z ?? floor) +
          (target - (actor.z ?? floor)) * Math.min(1, profile.acceleration * dt)
        : target;
    actor.grounded = false;
    actor.verticalVelocity = 0;
    actor.groundZ = floor;
    return true;
  }
  root.FrontierFlight = {
    defaults,
    validate,
    update,
  };
})(typeof window === "undefined" ? globalThis : window);
