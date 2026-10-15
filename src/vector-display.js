/* Per-map vector beam styling. No simulation or HUD changes. Gaps are deterministic
 * and bounded to one per straight segment; zero disables them without extra work. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function vector-display.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier vector. Uses: object freeze. */
(/* @function vector-display.installReviewed — Installs per-map vector beam styling and deterministic bounded segment gaps. Optional monochrome/glow treatment affects presentation only; zero-gap settings avoid additional work and do not change simulation/HUD state. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  const defaults = Object.freeze({
    enabled: false,
    monochrome: true,
    color: "#caffef",
    glow: 0.65,
    radius: 5,
    breaks: 0.08,
    gap: 2,
    sprites: "original",
    textures: "original",
  });
  /* Historical contract retained; October 14 reviewed explanation follows. @function vector-display.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: a list of "original", "phosphor", "outline" includes; error; /^#[0-9a-f]{6}$/i test; number is finite. Returns: a record containing copied fields, color. */
  /* @function vector-display.reviewedvalidate_2 — Normalizes per-map vector presentation. Inputs: optional partial value. Returns default-merged record with lowercase hex color; validates enabled/monochrome booleans, sprite/texture treatment enums, glow/break probability0-1, blur radius1-12 and gap1-8 logical pixels. Throws before adoption, preserves extra fields; no rendering or mutation. */ function validate(
    value = {},
  ) {
    const v = { ...defaults, ...value };
    if (
      !["original", "phosphor", "outline"].includes(v.sprites) ||
      !["original", "phosphor", "outline"].includes(v.textures)
    )
      throw Error("Invalid vector asset treatment.");
    if (
      typeof v.enabled !== "boolean" ||
      typeof v.monochrome !== "boolean" ||
      !/^#[0-9a-f]{6}$/i.test(v.color) ||
      !Number.isFinite(v.glow) ||
      v.glow < 0 ||
      v.glow > 1 ||
      !Number.isFinite(v.radius) ||
      v.radius < 1 ||
      v.radius > 12 ||
      !Number.isFinite(v.breaks) ||
      v.breaks < 0 ||
      v.breaks > 1 ||
      !Number.isFinite(v.gap) ||
      v.gap < 1 ||
      v.gap > 8
    )
      throw Error(
        "Vector display needs a hex color, glow/break amounts from 0 to 1, radius 1–12, and gap 1–8.",
      );
    return { ...v, color: v.color.toLowerCase() };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function vector-display.paths.3 — Handles paths within vector display. Inputs: path; v. Updates: x; y; start. Uses: result push; line. Returns: path; result. */
  /* @function vector-display.reviewedpaths_3 — Inserts deterministic beam gaps into straight path segments. Inputs: path commands in logical pixels and validated vector settings. Returns original array when disabled/no breaks, otherwise new command array retaining unchanged command references. Hash selects at most one gap on lines long enough; closePath becomes explicit closing line and Bezier endpoints update pen without curve gaps. No source mutation; malformed commands not validated here. */ function paths(
    path,
    v,
  ) {
    if (!v.enabled || !v.breaks) return path;
    const result = [];
    let x = 0,
      y = 0,
      start = null;
    /* Historical contract retained; October 14 reviewed explanation follows. @function vector-display.line.4 — Handles line within vector display. Inputs: nx; ny. Updates: x; y. Uses: result push. */
  /* @function vector-display.reviewedline_4 — Appends one optionally interrupted beam line. Inputs: nx/ny logical pixel endpoint and captured current pen/settings/output. Returns undefined; uses coordinate hash/probability and gap length to append line/move commands, then updates local pen. No input path mutation. */ function line(
      nx,
      ny,
    ) {
      const dx = nx - x,
        dy = ny - y,
        len = Math.hypot(dx, dy);
      const hash =
        Math.abs(
          Math.sin(x * 0.127 + y * 0.319 + nx * 0.173 + ny * 0.217) *
            43758.5453,
        ) % 1;
      if (len > v.gap * 4 && hash < v.breaks) {
        const t = 0.25 + (hash / Math.max(v.breaks, 0.001)) * 0.5,
          h = v.gap / len / 2;
        result.push(
          ["lineTo", x + dx * (t - h), y + dy * (t - h)],
          ["moveTo", x + dx * (t + h), y + dy * (t + h)],
        );
      }
      result.push(["lineTo", nx, ny]);
      x = nx;
      y = ny;
    }
    for (const c of path) {
      if (c[0] === "moveTo") {
        x = c[1];
        y = c[2];
        start = [x, y];
        result.push(c);
      } else if (c[0] === "lineTo") line(c[1], c[2]);
      else if (c[0] === "closePath" && start) line(...start);
      else {
        result.push(c);
        if (c[0] === "bezierCurveTo") {
          x = c[5];
          y = c[6];
        }
      }
    }
    return result;
  }
  root.FrontierVector = { defaults, validate, paths };
})(typeof window === "undefined" ? globalThis : window);
