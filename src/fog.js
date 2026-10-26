/* October 26, 2026: default distance fog is Dusty Plum (#665263, from the OpenMW project haze color 0.40/0.32/0.39), enabled over 16–48 world metres. Existing explicit map overrides remain authorable. */
/* Map atmosphere, separate from future normal-mapped lighting. Authored values
 * survive world export; runtime overrides let weather/day-night systems animate
 * fog without rewriting the map. Distances use existing world units. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function fog.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier fog. Uses: object freeze. */
(/* @function fog.installReviewed — Installs atmosphere validation/blending services. Authored fog persists with maps; runtime overrides animate atmosphere without rewriting authored records, using world-distance units rather than framebuffer pixels. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  const defaults = Object.freeze({
    enabled: true,
    start: 16,
    end: 48,
    color: "#665263",
  });
  /* Historical contract retained; October 14 reviewed explanation follows. @function fog.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: number is finite; /^#[0-9a-f]{6}$/i test; error; f color to lower case. Returns: a record containing enabled, start, end, color. */
  /* @function fog.reviewedvalidate_2 — Normalizes authored/runtime fog configuration. Inputs: optional partial record. Returns new enabled/start/end/color record merged with defaults. Distances are world metres; start finite nonnegative, end greater than start and at most200; color six-digit hex lowercased. Throws on invalid values before adoption; no state mutation and unknown fields omitted. */ function validate(
    value = {},
  ) {
    const f = { ...defaults, ...value };
    if (
      typeof f.enabled !== "boolean" ||
      !Number.isFinite(f.start) ||
      !Number.isFinite(f.end) ||
      f.start < 0 ||
      f.end <= f.start ||
      f.end > 200 ||
      !/^#[0-9a-f]{6}$/i.test(f.color)
    )
      throw Error(
        "Fog needs start ≥ 0, end > start (maximum 200 world units), and a #RRGGBB color.",
      );
    return {
      enabled: f.enabled,
      start: f.start,
      end: f.end,
      color: f.color.toLowerCase(),
    };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function fog.settings.3 — Handles settings within fog. Inputs: game. Returns: game fog override or game source world fog or defaults. */
  /* @function fog.reviewedsettings_3 — Reads effective fog settings. Inputs: game. Returns runtime override, otherwise authored world fog, otherwise frozen defaults. No copy or validation/mutation; callers must not edit returned authored/default record in place. */ function settings(
    game,
  ) {
    return game.fogOverride || game.sourceWorld?.fog || defaults;
  }
  // Quantized opacity gives a bounded reusable GPU/palette cache (17 levels).
  /* Historical contract retained; October 14 reviewed explanation follows. @function fog.amount.4 — Quantized opacity gives a bounded reusable GPU/palette cache (17 levels). Inputs: f; depth. Returns: f enabled selects math round using math max using 0, math min using 1, depth minus f start divided by f end minus f start multiplied by 16 divided by 16 or 0. */
  /* @function fog.reviewedamount_4 — Computes bounded quantized fog opacity. Inputs: validated f and camera-depth value in matching world-distance units. Returns zero if disabled or clamped linear start/end blend rounded to nearest1/16 (17 levels). No mutation; expects finite depth and validated distinct endpoints. */ function amount(
    f,
    depth,
  ) {
    return f.enabled
      ? Math.round(
          Math.max(0, Math.min(1, (depth - f.start) / (f.end - f.start))) * 16,
        ) / 16
      : 0;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function fog.setRuntime.5 — Handles set runtime within fog. Inputs: game; value. Updates: game fog override. Uses: validate; settings. */
  /* @function fog.reviewedsetRuntime_5 — Applies a partial session fog override. Inputs: game and partial value. Returns undefined; merges current settings and validates before assigning game.fogOverride. Invalid values throw without assignment; authored map fog is unchanged. */ function setRuntime(
    game,
    value,
  ) {
    game.fogOverride = validate({ ...settings(game), ...value });
  }
  root.FrontierFog = {
    defaults,
    validate,
    settings,
    amount,
    setRuntime,
    /* Historical contract retained; October 14 reviewed explanation follows. @function fog.clearRuntime.6 — Handles clear runtime within fog. Inputs: game. Updates: game fog override. */
  /* @function fog.reviewedclearRuntime_6 — Removes session fog override. Inputs: game. Returns undefined; sets game.fogOverride null so authored/default settings apply again. No authored/persisted mutation. */ clearRuntime(
      game,
    ) {
      game.fogOverride = null;
    },
  };
})(typeof window === "undefined" ? globalThis : window);
