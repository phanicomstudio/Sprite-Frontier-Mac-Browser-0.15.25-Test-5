/* Terrain-only screen depth. Sprite masks use the same projected triangles as
 * textured ground, so slopes hide distant roots without changing entity XYZ. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function terrain-occlusion.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier terrain occlusion. */
(/* @function terrain-occlusion.installReviewed — Installs terrain-only screen inverse-depth and sprite masking services. Masks use the same projected triangles as textured ground, allowing slopes to hide distant roots without changing entity XYZ or locked billboard presentation. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  const step = 2;
  /* Historical contract retained; October 14 reviewed explanation follows. @function terrain-occlusion.begin.2 — Handles begin within pixel visibility against solid geometry. Inputs: ctx; width; height. Updates: d; ctx terrain depth cache; ctx terrain depth. Uses: d values fill. Returns: d. */
  /* @function terrain-occlusion.reviewedbegin_2 — Initializes reusable inverse-depth frame for terrain/solid masking. Inputs: render ctx and logical pixel width/height. Returns depth record; reads selected rasterStep(default2), reallocates Float32 buffer only for size/step changes, exposes it on ctx and fills zero (no occluder). Does not move geometry/actors. Validated positive dimensions/step assumed; allocation/service failures propagate. */ function begin(
    ctx,
    width,
    height,
  ) {
    let d = ctx.terrainDepthCache;
    const step = root.FrontierDisplay?.get().rasterStep || 2,
      w = Math.ceil(width / step),
      h = Math.ceil(height / step);
    if (!d || d.w !== w || d.h !== h || d.step !== step)
      d = ctx.terrainDepthCache = {
        w,
        h,
        step,
        values: new Float32Array(w * h),
      };
    ctx.terrainDepth = d;
    d.values.fill(0);
    return d;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function terrain-occlusion.triangle.3 — Rasterizes or processes one triangle for this module. Inputs: d; p. Updates: d values at k. Returns: without a result. */
  /* @function terrain-occlusion.reviewedtriangle_3 — Rasterizes one projected solid triangle into inverse-depth mask. Inputs: depth record d and three logical pixel vertices p with positive world camera depths. Returns undefined; rejects near-degenerate area, clips integer raster bounds, traverses conservative scanline spans and retains maximum interpolated reciprocal depth. Barycentric edge tolerance0.00001 preserves historical sample coverage; screen samples at raster-cell centres. Only d.values changes, no vertex/source mutation; invalid finite/depth data not repaired here. */ function triangle(
    d,
    p,
  ) {
    const [a, b, c] = p,
      den = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
    if (Math.abs(den) < 1e-8) return;
    const s = d.step,
      x0 = Math.max(0, Math.floor(Math.min(a.x, b.x, c.x) / s)),
      x1 = Math.min(d.w - 1, Math.floor(Math.max(a.x, b.x, c.x) / s)),
      y0 = Math.max(0, Math.floor(Math.min(a.y, b.y, c.y) / s)),
      y1 = Math.min(d.h - 1, Math.floor(Math.max(a.y, b.y, c.y) / s));
    /* October 12: traverse only each triangle scanline span. Expand the triangle by the existing barycentric -0.00001 tolerance, then retain the original inclusion/depth arithmetic below. This preserves conservative edge coverage while avoiding empty bounding-box samples. */ const tolerance = 0.00001,
      sumX = a.x + b.x + c.x,
      sumY = a.y + b.y + c.y,
      ax = a.x * (1 + 3 * tolerance) - sumX * tolerance,
      ay = a.y * (1 + 3 * tolerance) - sumY * tolerance,
      bx = b.x * (1 + 3 * tolerance) - sumX * tolerance,
      by = b.y * (1 + 3 * tolerance) - sumY * tolerance,
      cx = c.x * (1 + 3 * tolerance) - sumX * tolerance,
      cy = c.y * (1 + 3 * tolerance) - sumY * tolerance;
    for (let y = y0; y <= y1; y++) {
      const scanY = (y + 0.5) * s;
      let left = Infinity,
        right = -Infinity;
      for (let edge = 0; edge < 3; edge++) {
        const firstX = edge === 0 ? ax : edge === 1 ? bx : cx,
          firstY = edge === 0 ? ay : edge === 1 ? by : cy,
          secondX = edge === 0 ? bx : edge === 1 ? cx : ax,
          secondY = edge === 0 ? by : edge === 1 ? cy : ay;
        if (
          scanY < Math.min(firstY, secondY) ||
          scanY > Math.max(firstY, secondY)
        )
          continue;
        if (firstY === secondY) {
          left = Math.min(left, firstX, secondX);
          right = Math.max(right, firstX, secondX);
        } else {
          const crossing =
            firstX +
            ((secondX - firstX) * (scanY - firstY)) / (secondY - firstY);
          left = Math.min(left, crossing);
          right = Math.max(right, crossing);
        }
      }
      const rowStart =
          left === Infinity ? x0 : Math.max(x0, Math.floor(left / s - 0.5) - 1),
        rowEnd =
          left === Infinity ? x1 : Math.min(x1, Math.ceil(right / s - 0.5) + 1);
      for (let x = rowStart; x <= rowEnd; x++) {
        const px = (x + 0.5) * s,
          py = (y + 0.5) * s,
          u = ((b.y - c.y) * (px - c.x) + (c.x - b.x) * (py - c.y)) / den,
          v = ((c.y - a.y) * (px - c.x) + (a.x - c.x) * (py - c.y)) / den,
          t = 1 - u - v;
        if (u < -0.00001 || v < -0.00001 || t < -0.00001) continue;
        const inverse = u / a.depth + v / b.depth + t / c.depth,
          k = y * d.w + x;
        if (inverse > d.values[k]) d.values[k] = inverse;
      }
    }
  }
  /* @function terrain-occlusion.mask.4 — Builds visible screen regions by comparing sprite depth with the existing geometry depth buffer. Inputs: d; rect; depth. Updates: start; previous width. Uses: inverse at; runs get; regions push; runs set. Returns: rect; a record containing copied fields, regions. */ /* @function terrain-occlusion.supportMask � Inputs: depth buffer, pixel rectangle, scalar/function forward depth, optional camera and foot elevation. Returns visible rectangles. Reconstructs nearest surface height to exempt support below feet while preserving higher occluders; no geometry changes. October 9, 2026: optional support contains perspective camera and actor foot Z
   in world units. Geometry at/below that elevation cannot cut the camera-facing
   body; higher walls and hills still occlude. Reconstruct nearest surface height
   from inverse depth, with a 0.015-unit raster tolerance. No scene queries. */
  /* @function terrain-occlusion.supportMask � Inputs: depth buffer, pixel rectangle, scalar/function forward depth, optional camera and foot elevation. Returns visible rectangles. Reconstructs nearest surface height to exempt support below feet while preserving higher occluders; no geometry changes. October 9, 2026: optional support contains perspective camera and actor foot Z
   in world units. Geometry at/below that elevation cannot cut the camera-facing
   body; higher walls and hills still occlude. Reconstruct nearest surface height
   from inverse depth, with a 0.015-unit raster tolerance. No scene queries. */ function mask(d, rect, depth, support = null) {
    if (!d) return rect;
    const regions = [],
      runs = new Map(),
      s = d.step,
      x0 = Math.max(0, Math.floor(rect.x / s)),
      x1 = Math.min(d.w - 1, Math.floor((rect.x + rect.width) / s)),
      y0 = Math.max(0, Math.floor(rect.y / s)),
      y1 = Math.min(d.h - 1, Math.floor((rect.y + rect.height) / s));
    const inverseAt =
      /* Historical contract retained; October 14 reviewed explanation follows. @function terrain-occlusion.inverseAt.5 — Returns 1 divided by math max using 0.13, typeof depth equals "function" selects depth using y or depth. Inputs: y. Uses: depth. Returns: 1 divided by math max using 0.13, typeof depth equals "function" selects depth using y or depth. */
  /* @function terrain-occlusion.reviewedinverseAt_5 — Converts actor/prop depth to reciprocal at one screen row. Inputs: logical pixel y and captured scalar depth or pure depth(y) callback. Returns1/max(0.13,depth), inverse world metres. No source mutation; callback failures/nonfinite values propagate into caller. Row cache requires pure function stable for current mask call. */ (
        y,
      ) => 1 / Math.max(0.13, typeof depth === "function" ? depth(y) : depth);
    /* October 12, 2026: scalar prop depth and camera pitch do not vary per pixel. Hoist their reciprocal and trigonometry out of mask traversal; function-based billboard depth still evaluates at the original sample Y. */
    const constantInverse = typeof depth === "function" ? null : inverseAt(0),
      supportSin = support ? Math.sin(support.cam.pitch) : 0,
      supportCos = support ? Math.cos(support.cam.pitch) : 0;
    /* October 13, 2026: contact row depth is a pure screen-Y function. Evaluate it
   once per row into a reused double-precision buffer, preserving exact mask
   arithmetic without repeating ray divisions across every pixel column. The
   buffer is owned by this depth frame and grows only with raster height. */
    let inverseRows = null;
    if (constantInverse === null) {
      if (!d.maskRowInverse || d.maskRowInverse.length < d.h + 1)
        d.maskRowInverse = new Float64Array(d.h + 1);
      inverseRows = d.maskRowInverse;
      for (let row = y0; row <= y1 + 1; row++)
        inverseRows[row] = inverseAt((row + 0.5) * s);
    }
    for (let x = x0; x <= x1; x++) {
      let start = -1;
      for (let y = y0; y <= y1 + 1; y++) {
        const inverse = constantInverse ?? inverseRows[y],
          solid = d.values[y * d.w + x],
          sampleY = (y + 0.5) * s,
          hitZ =
            support && solid > 0
              ? support.cam.z +
                (supportSin +
                  (((support.cam.cy ?? 96) - sampleY) / 360) * supportCos) /
                  solid
              : Infinity,
          visible =
            y <= y1 &&
            (solid <= inverse + 0.002 * inverse ||
              (support && hitZ <= support.z + 0.015));
        if (visible && start < 0) start = y;
        if (!visible && start >= 0) {
          const left = Math.max(rect.x, x * s),
            top = Math.max(rect.y, start * s),
            right = Math.min(rect.x + rect.width, (x + 1) * s),
            bottom = Math.min(rect.y + rect.height, y * s);
          if (right > left && bottom > top) {
            const key = top + ":" + bottom,
              previous = runs.get(key);
            if (
              previous &&
              Math.abs(previous.x + previous.width - left) < 0.0001
            )
              previous.width = right - previous.x;
            else {
              const run = {
                x: left,
                y: top,
                width: right - left,
                height: bottom - top,
              };
              regions.push(run);
              runs.set(key, run);
            }
          }
          start = -1;
        }
      }
    }
    return { ...rect, regions };
  }
  root.FrontierTerrainOcclusion = { begin, triangle, mask };
})(window);
