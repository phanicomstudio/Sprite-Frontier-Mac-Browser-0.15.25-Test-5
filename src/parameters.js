/* Editable project rules. World JSON stores a validated full snapshot; older
 * worlds inherit defaults. Keep this schema, editor fields and consuming modules
 * synchronized. Units are world units, seconds and radians unless labeled. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function parameters.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier parameters. Uses: object from entries; object entries using fields map; object entries. */
(/* @function parameters.installReviewed — Installs editable project-rule defaults/validation/access. Validated world snapshots own settings and older worlds inherit defaults; units follow explicit schema labels (world units, seconds and radians where applicable). Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  const fields = {
    dripSoundRange: {
      label: "Bleeding sound reach (world units; 3 tile-equivalents default)",
      value: 3,
      min: 0,
      max: 30,
      step: 0.5,
    },
    aggroRange: {
      label: "Enemy awareness radius (units)",
      value: 8,
      min: 0,
      max: 48,
      step: 0.5,
    },
    aggroLeash: {
      label: "Enemy pursuit leash (units)",
      value: 12,
      min: 0,
      max: 60,
      step: 0.5,
    },
    aggroCalm: {
      label: "Enemy calm delay (seconds)",
      value: 3,
      min: 0,
      max: 30,
      step: 0.5,
    },
    playerSpeed: {
      label: "Walk speed (units/second)",
      value: 3.2,
      min: 0.1,
      max: 20,
      step: 0.1,
    },
    sprintMultiplier: {
      label: "Sprint multiplier",
      value: 2,
      min: 1,
      max: 5,
      step: 0.1,
    },
    jumpHeight: {
      label: "Jump apex height (units)",
      value: 0.96,
      min: 0.05,
      max: 8,
      step: 0.05,
    },
    gravity: {
      label: "Gravity (units/second²)",
      value: 12,
      min: 1,
      max: 40,
      step: 0.5,
    },
    stepHeight: {
      label: "Automatic step height (units)",
      value: 0.6,
      min: 0,
      max: 1.5,
      step: 0.05,
    },
    aimMin: {
      label: "Aim down limit (degrees)",
      value: (-0.7 * 180) / Math.PI,
      min: -60,
      max: 0,
      step: 1,
    },
    aimMax: {
      label: "Aim up limit (degrees)",
      value: (0.6 * 180) / Math.PI,
      min: 0,
      max: 60,
      step: 1,
    },
    mouseYaw: {
      label: "Mouse yaw sensitivity",
      value: 0.004,
      min: 0.0005,
      max: 0.02,
      step: 0.0005,
    },
    mousePitch: {
      label: "Mouse pitch sensitivity",
      value: 0.003,
      min: 0.0005,
      max: 0.02,
      step: 0.0005,
    },
    zoomMin: {
      label: "Closest camera distance",
      value: 2.3,
      min: 1.6,
      max: 6,
      step: 0.1,
    },
    zoomMax: {
      label: "Farthest camera distance",
      value: 7,
      min: 2,
      max: 20,
      step: 0.5,
    },
    interactionFeet: {
      label: "Default interaction reach (feet)",
      value: 6,
      min: 1,
      max: 30,
      step: 0.5,
    },
    ricochetChance: {
      label: "Scenery ricochet probability (0–1)",
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.05,
    },
  };
  const defaults = Object.fromEntries(
    Object.entries(fields).map(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function parameters.callback.2 — Returns a list of key, f value. Inputs: array pattern. Returns: a list of key, f value. */
  /* @function parameters.callback.2Reviewed — Builds the default parameter snapshot from field metadata. Inputs: field key and schema record. Returns key/default-value pair for Object.fromEntries; no schema mutation. Units and supported bounds remain attached to the field record. */ ([
        key,
        f,
      ]) => [key, f.value],
    ),
  );
  // Sanitize the complete parameter snapshot before any rule changes become live.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function parameters.validate.3 — Sanitize the complete parameter snapshot before any rule changes become live. Inputs: assignment pattern. Updates: result at key. Uses: array is array; error; object entries; number is finite. Returns: result. */
  /* @function parameters.validate.3Reviewed — Validates a complete project-rule snapshot before adoption. Inputs: optional object, default empty. Returns fresh supported-key record using field defaults for missing/nullish values. Rejects arrays/nonobjects, nonfinite/out-of-range numbers, reversed/equal camera distances and reversed/equal aim limits. Drops unknown keys without changing input; units follow each field label, including degrees for aim and feet for interaction reach. Does not itself install rules or persist the world. */ function validate(
    value = {},
  ) {
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw Error("Invalid global parameters.");
    const result = {};
    for (const [key, f] of Object.entries(fields)) {
      const v = value[key] ?? f.value;
      if (!Number.isFinite(v) || v < f.min || v > f.max)
        throw Error("Invalid " + f.label + ".");
      result[key] = v;
    }
    if (result.zoomMin >= result.zoomMax)
      throw Error("Closest zoom must be less than farthest zoom.");
    if (result.aimMin >= result.aimMax)
      throw Error("Aim down limit must be below aim up limit.");
    return result;
  }
  // Return an authored setting without allocating a merged object per frame.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function parameters.get.4 — Return an authored setting without allocating a merged object per frame. Inputs: world; key. Returns: chain or the fallback defaults at key. */
  /* @function parameters.get.4Reviewed — Reads one authored project rule without allocating merged defaults per frame. Inputs: optional world and parameter key. Returns authored non-nullish value or schema default; unknown keys return undefined. Does not validate or mutate data, so world adoption must validate snapshots first. Units match the field definition. */ function get(
    world,
    key,
  ) {
    return world?.parameters?.[key] ?? defaults[key];
  }
  root.FrontierParameters = { fields, defaults, validate, get };
})(typeof window === "undefined" ? globalThis : window);
