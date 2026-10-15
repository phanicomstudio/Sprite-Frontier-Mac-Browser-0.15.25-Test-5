/* October 10, 2026: logical scene coordinates stay independent of physical
 * output resolution. A 480-unit view preserves the locked camera/sprite framing;
 * render scale increases actual GPU pixels and solid raster samples together. */
(/* @function display-settings.install — Inputs: root namespace. Installs validated local display preferences. Reads browser storage defensively; unavailable storage uses performance/crisp defaults. No rendering allocation. */ function (
  root,
) {
  "use strict";
  const key = "frontier.display.0.15.22";
  let settings = { scale: 1, filtering: "crisp" },
    wide = false;
  /* @function display-settings.validate — Inputs: candidate preferences. Returns copied supported render scale and filtering. Throws invalid data before changing runtime or persistence. Scale is physical pixels per logical unit. */
  function validate(value) {
    if (
      ![1, 1.5, 2].includes(value.scale) ||
      !["crisp", "smooth"].includes(value.filtering)
    )
      throw Error("Choose a supported resolution and texture filter.");
    return { scale: value.scale, filtering: value.filtering };
  }
  try {
    const saved = root.localStorage?.getItem(key);
    if (saved) settings = validate(JSON.parse(saved));
  } catch {}
  root.FrontierDisplay = {
    /* @function display-settings.get — Inputs: none. Returns a preference copy, logical dimensions and actual output dimensions. No mutation; wide aspect retains 854 logical units. */
    /* @function display-settings.smooth � Inputs: none. Returns filtering flag without allocating a preference snapshot; solid raster sampling calls this per texel. */
    smooth() {
      return settings.filtering === "smooth";
    },
    /* @function display-settings.dimensions � Inputs: none. Returns copied preferences and logical/physical dimensions for UI and buffer sizing. No allocation occurs in pixel loops. */
    get() {
      const width = wide ? 854 : 640;
      return {
        ...settings,
        width,
        height: 480,
        pixelWidth: Math.round(width * settings.scale),
        pixelHeight: Math.round(480 * settings.scale),
        rasterStep: 2 / settings.scale,
      };
    },
    /* @function display-settings.set — Inputs: complete scale/filter settings. Validates, updates runtime and saves locally. Returns current dimensional settings. Storage failures retain working runtime preferences. */
    set(value) {
      settings = validate(value);
      try {
        root.localStorage?.setItem(key, JSON.stringify(settings));
      } catch {}
      return this.get();
    },
    /* @function display-settings.aspect — Inputs: boolean wide aspect. Changes logical width independently of scale, returns dimensional settings. Does not alter pixel density or stored quality. */
    aspect(value) {
      wide = !!value;
      return this.get();
    },
    validate,
  };
})(typeof window !== "undefined" ? window : globalThis);
