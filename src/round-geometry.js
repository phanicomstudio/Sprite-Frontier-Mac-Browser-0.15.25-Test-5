/* October 12, 2026: shared round surface generation. X/Y are horizontal,
 * Z is up; all dimensions are metres. Rendering and collision must consume
 * these same surfaces, never the enclosing box of a hollow wall. */
(/* @function roundGeometry.install — Inputs: browser or test global. Returns nothing; installs pure surface generation without loading assets or changing cells. */ function (
  root,
) {
  "use strict";
  /* @function roundGeometry.faces — Inputs: center x/y, base z, outer radius,
   * optional inner radius, height, segment count and start/sweep radians.
   * Returns polygon faces for a closed solid disk or hollow wall arc. Throws
   * invalid/nonfinite dimensions before allocating geometry. No input mutation.
   * Partial arcs have end caps; full circles share their final seam exactly. */
  function faces(options) {
    const {
      x,
      y,
      z = 0,
      radius,
      innerRadius = 0,
      height,
      segments = 32,
      start = 0,
      sweep = Math.PI * 2,
    } = options;
    for (const number of [x, y, z, radius, innerRadius, height, start, sweep]) {
      if (!Number.isFinite(number))
        throw Error("Round dimensions must be finite.");
    }
    if (
      radius <= 0 ||
      innerRadius < 0 ||
      innerRadius >= radius ||
      height <= 0 ||
      !Number.isInteger(segments) ||
      segments < 8 ||
      segments > 128 ||
      sweep <= 0 ||
      sweep > Math.PI * 2
    )
      throw Error("Invalid round geometry dimensions.");
    const full = Math.abs(sweep - Math.PI * 2) < 1e-10,
      result = [];
    /* @function roundGeometry.point — Inputs: radial distance, seam index and elevation. Returns world XYZ; full-circle end index reuses the start angle to avoid numerical seam cracks. Has no side effects. */
    function point(r, index, elevation) {
      const angle =
        start + (full && index === segments ? 0 : (sweep * index) / segments);
      return [x + Math.cos(angle) * r, y + Math.sin(angle) * r, elevation];
    }
    for (let i = 0; i < segments; i++) {
      const a = point(radius, i, z),
        b = point(radius, i + 1, z),
        A = point(radius, i, z + height),
        B = point(radius, i + 1, z + height);
      result.push([a, b, B, A]);
      if (innerRadius > 0) {
        const c = point(innerRadius, i, z),
          d = point(innerRadius, i + 1, z),
          C = point(innerRadius, i, z + height),
          D = point(innerRadius, i + 1, z + height);
        result.push([d, c, C, D], [A, B, D, C], [b, a, c, d]);
        if (!full && i === 0) result.push([c, a, A, C]);
        if (!full && i === segments - 1) result.push([b, d, D, B]);
      } else {
        result.push([[x, y, z + height], A, B], [[x, y, z], b, a]);
        if (!full && i === 0)
          result.push([[x, y, z], a, A, [x, y, z + height]]);
        if (!full && i === segments - 1)
          result.push([b, [x, y, z], [x, y, z + height], B]);
      }
    }
    return result;
  }
  const cache = new WeakMap();
  /* @function roundGeometry.primitiveFaces — Inputs: round room primitive with radius/innerRadius, h and optional arc/yaw. Returns cached world polygons. A dimensional signature detects temporary in-place author transactions before validation produces a new record; malformed edits still throw rather than reuse old geometry. No world mutation. */
  function primitiveFaces(e) {
    const signature = [
      e.x,
      e.y,
      e.z,
      e.radius,
      e.innerRadius,
      e.h,
      e.segments,
      e.arcStart,
      e.yaw,
      e.arcSweep,
    ].join("/");
    let entry = cache.get(e);
    if (!entry || entry.signature !== signature) {
      const polygons = faces({
        x: e.x,
        y: e.y,
        z: e.z,
        radius: e.radius,
        innerRadius: e.innerRadius ?? 0,
        height: e.h,
        segments: e.segments || 32,
        start: (e.arcStart || 0) + (e.yaw || 0),
        sweep: e.arcSweep ?? Math.PI * 2,
      });
      entry = { signature, polygons };
      cache.set(e, entry);
    }
    return entry.polygons;
  }
  /* @function roundGeometry.overlap — Inputs: validated round primitive, body floor-plane center X/Y and square footprint half-size in metres. Returns true only when one actual disk/ring sector overlaps the footprint. Tests separating axes of convex bottom polygons and body axes, leaving a hollow ring center clear. Touching within one micrometre is permitted. Reads cached geometry without mutation. */
  function overlap(e, x, y, radius) {
    for (const polygon of primitiveFaces(e)) {
      let bottom = true;
      for (const p of polygon)
        if (Math.abs(p[2] - e.z) > 1e-8) {
          bottom = false;
          break;
        }
      if (!bottom) continue;
      const axes = [
        [1, 0],
        [0, 1],
      ];
      for (let i = 0; i < polygon.length; i++) {
        const a = polygon[i],
          b = polygon[(i + 1) % polygon.length],
          dx = b[0] - a[0],
          dy = b[1] - a[1],
          length = Math.hypot(dx, dy);
        if (length > 1e-9) axes.push([-dy / length, dx / length]);
      }
      let separated = false;
      for (const [ax, ay] of axes) {
        let low = Infinity,
          high = -Infinity;
        for (const p of polygon) {
          const projection = p[0] * ax + p[1] * ay;
          low = Math.min(low, projection);
          high = Math.max(high, projection);
        }
        const center = x * ax + y * ay,
          extent = radius * (Math.abs(ax) + Math.abs(ay));
        if (center + extent <= low + 1e-6 || center - extent >= high - 1e-6) {
          separated = true;
          break;
        }
      }
      if (!separated) return true;
    }
    return false;
  }
  /* @function roundGeometry.mapping — Inputs: validated round primitive and one generated face polygon. Returns cylindrical UV metadata for curved vertical faces, or undefined for caps/slabs. Uses the sector midpoint to unwrap seam angles continuously; partial radial caps retain ordinary planar mapping. No scene mutation. */
  function mapping(e, points) {
    const a = points[0],
      b = points[1],
      r0 = Math.hypot(a[0] - e.x, a[1] - e.y),
      r1 = Math.hypot(b[0] - e.x, b[1] - e.y);
    if (Math.abs(r0 - r1) > 1e-6 || r0 < 1e-8) return undefined;
    let low = Infinity,
      high = -Infinity;
    for (const p of points) {
      low = Math.min(low, p[2]);
      high = Math.max(high, p[2]);
    }
    if (high - low < 1e-8) return undefined;
    const start = (e.arcStart || 0) + (e.yaw || 0),
      sweep = e.arcSweep ?? Math.PI * 2;
    let reference =
      Math.atan2((a[1] + b[1]) / 2 - e.y, (a[0] + b[0]) / 2 - e.x) - start;
    reference = ((reference % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    return {
      x: e.x,
      y: e.y,
      start,
      reference: reference + start,
      radius: r0,
      sweep,
      base: e.z,
      height: e.h,
    };
  }
  root.FrontierRoundGeometry = { faces, primitiveFaces, overlap, mapping };
})(typeof window === "undefined" ? globalThis : window);
