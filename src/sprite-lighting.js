/* Pure normal-map lighting preparation. Hosts cache the resulting pixels per
 * sprite/binding revision, never perform this work for each game frame. RGB
 * normals use +Y upward; alpha always comes from the artwork. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function sprite-lighting.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier sprite lighting. */
(/* @function sprite-lighting.installReviewed — Installs pure normal-map pixel preparation shared with worker/cache hosts. Resulting sheets retain artwork alpha and RGB normals use +Y upward; cached revision preparation belongs outside each rendered frame. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function sprite-lighting.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: number is finite; error. Returns: s. */
  /* @function sprite-lighting.reviewedvalidate_2 — Normalizes directional normal-light settings. Inputs: optional partial settings. Returns default-merged new record with ambient0-1, strength0-2 and XYZ direction components -1..1, all finite and vector length at least0.01. Direction is normalized during preparation, not here. Unknown fields retained; invalid values throw before adoption and no pixel/state mutation. */ function validate(
    settings = {},
  ) {
    const s = {
      ambient: 0.35,
      strength: 0.8,
      x: -0.5,
      y: 0.5,
      z: 1,
      ...settings,
    };
    for (const k of ["ambient", "strength", "x", "y", "z"])
      if (
        !Number.isFinite(s[k]) ||
        s[k] < (k === "ambient" || k === "strength" ? 0 : -1) ||
        s[k] > (k === "strength" ? 2 : 1)
      )
        throw Error("Invalid sprite light " + k);
    if (Math.hypot(s.x, s.y, s.z) < 0.01)
      throw Error("Sprite light direction cannot be zero.");
    return s;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function sprite-lighting.prepare.3 — Handles prepare within sprite lighting. Inputs: art; normal; settings. Updates: i; out at i plus 3; out at i plus c. Uses: validate; number is integer; error. Returns: a record containing width, height, data. */
  /* @function sprite-lighting.reviewedprepare_3 — Shades one artwork pixel block using matching RGB normal pixels. Inputs: art/normal width/height/data records and light settings. Returns new width/height/Uint8ClampedArray RGBA preserving artwork alpha and multiplying RGB by ambient plus positive normalized normal-light dot times strength, clamped255. Requires equal integer dimensions1-8192 and exact four-byte-per-pixel arrays; rejects zero-length visible normal. RGB normals decode0-255 to-1..1 with +Y up in artwork normal space. No source mutation; cache/worker host must bound allocations and keep preparation outside frame traversal. */ function prepare(
    art,
    normal,
    settings,
  ) {
    const s = validate(settings);
    if (
      !art ||
      !normal ||
      !Number.isInteger(art.width) ||
      !Number.isInteger(art.height) ||
      art.width < 1 ||
      art.height < 1 ||
      art.width > 8192 ||
      art.height > 8192 ||
      normal.width !== art.width ||
      normal.height !== art.height ||
      art.data?.length !== art.width * art.height * 4 ||
      normal.data?.length !== art.data.length
    )
      throw Error(
        "Artwork and normal map must have matching dimensions up to 8192.",
      );
    const out = new Uint8ClampedArray(art.data.length),
      lm = Math.hypot(s.x, s.y, s.z),
      l = [s.x / lm, s.y / lm, s.z / lm];
    for (let i = 0; i < out.length; i += 4) {
      out[i + 3] = art.data[i + 3];
      if (!out[i + 3]) continue;
      const nx = normal.data[i] / 127.5 - 1,
        ny = normal.data[i + 1] / 127.5 - 1,
        nz = normal.data[i + 2] / 127.5 - 1,
        nm = Math.sqrt(nx * nx + ny * ny + nz * nz);
      if (nm < 0.01)
        throw Error("Normal map contains a zero-length visible normal.");
      const shade =
        s.ambient +
        s.strength * Math.max(0, (nx * l[0] + ny * l[1] + nz * l[2]) / nm);
      for (let c = 0; c < 3; c++)
        out[i + c] = Math.min(255, Math.round(art.data[i + c] * shade));
    }
    return { width: art.width, height: art.height, data: out };
  }
  root.FrontierSpriteLighting = { validate, prepare };
})(typeof window === "undefined" ? globalThis : window);
