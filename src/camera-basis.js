/* October 12, 2026: exact perspective projection with one camera-basis evaluation per terrain frame. Historical render.project remains authoritative and unchanged for other callers. */
(/* @function camera-basis.install1523 — Inputs: browser/global namespace. Installs pure factory; no renderer resources or simulation mutation. */ function (
  root,
) {
  "use strict";
  /* @function camera-basis.create1523 — Inputs: immutable-for-frame camera and original projection fallback. Returns projector with precomputed yaw/pitch sine/cosine. Caller must recreate after camera changes. Perspective output exactly matches render.project arithmetic, logical pixel units and 0.12-unit near rejection; orthographic or different-camera calls delegate unchanged. */
  function create(cam, fallback) {
    const sy = Math.sin(cam.yaw),
      cy = Math.cos(cam.yaw),
      sp = Math.sin(cam.pitch),
      cp = Math.cos(cam.pitch);
    const prepared =
      /* @function camera-basis.project1523 — Inputs: camera identity and world XYZ coordinates (Z defaults zero). Returns projected logical X/Y, pixels-per-world-unit scale and forward depth, or null behind near plane. Uses retained camera rotation values without altering framing. No side effects. */ function (
        camera,
        x,
        y,
        z = 0,
      ) {
        if (camera !== cam || cam.orthographic)
          return fallback(camera, x, y, z);
        const dx = x - cam.x,
          dy = y - cam.y,
          forward = dx * sy + dy * cy,
          d = ((x - cam.x) * sy + (y - cam.y) * cy) * cp + (z - cam.z) * sp,
          side = dx * cy - dy * sy,
          up = (z - cam.z) * cp - forward * sp;
        if (d < 0.12) return null;
        return {
          x: (cam.cx || 320) + (side * 360) / d,
          y: (cam.cy ?? 96) - (up * 360) / d,
          scale: 360 / d,
          depth: d,
        };
      };
    let planeWidth = 0,
      planeHeight = 0,
      planes = null;
    const nx = sy * cp,
      ny = cy * cp,
      nz = sp;
    /* @function camera-basis.bounds1523 — Inputs: world-space AABB minimum/maximum, logical viewport width/height. Returns conservative visibility using extrema of camera frustum planes, avoiding eight corner projections. Near crossings and roundoff margins remain visible. Uses immutable-for-frame camera; caches viewport plane coefficients without changing geometry. */
    prepared.bounds =
      /* @function camera-basis.boundsCallback1523 — Inputs: world AABB extrema and logical viewport dimensions. Returns conservative frustum visibility with cached plane coefficients; no scene mutation. Near-plane/roundoff margins retain candidates. See bounds1523 contract above for units and ownership. */ function (
        x0,
        y0,
        z0,
        x1,
        y1,
        z1,
        width,
        height = 480,
      ) {
        if (cam.orthographic) return true;
        x0 -= cam.x;
        x1 -= cam.x;
        y0 -= cam.y;
        y1 -= cam.y;
        z0 -= cam.z;
        z1 -= cam.z;
        const minimum =
            nx * (nx >= 0 ? x0 : x1) +
            ny * (ny >= 0 ? y0 : y1) +
            nz * (nz >= 0 ? z0 : z1),
          maximum =
            nx * (nx >= 0 ? x1 : x0) +
            ny * (ny >= 0 ? y1 : y0) +
            nz * (nz >= 0 ? z1 : z0);
        if (maximum < 0.12 - 1e-9) return false;
        if (minimum < 0.12 + 1e-9) return true;
        if (!planes || planeWidth !== width || planeHeight !== height) {
          planeWidth = width;
          planeHeight = height;
          const cx = cam.cx || 320,
            cy0 = cam.cy ?? 96;
          planes = [
            [cx * nx + 360 * cy, cx * ny - 360 * sy, cx * nz],
            [
              (width - cx) * nx - 360 * cy,
              (width - cx) * ny + 360 * sy,
              (width - cx) * nz,
            ],
            [
              cy0 * nx + 360 * sy * sp,
              cy0 * ny + 360 * cy * sp,
              cy0 * nz - 360 * cp,
            ],
            [
              (height - cy0) * nx - 360 * sy * sp,
              (height - cy0) * ny - 360 * cy * sp,
              (height - cy0) * nz + 360 * cp,
            ],
          ];
        }
        for (const plane of planes) {
          const value =
            plane[0] * (plane[0] >= 0 ? x1 : x0) +
            plane[1] * (plane[1] >= 0 ? y1 : y0) +
            plane[2] * (plane[2] >= 0 ? z1 : z0);
          if (value < -0.000001) return false;
        }
        return true;
      };
    return prepared;
  }

  root.FrontierCameraBasis = { create };
})(typeof window === "undefined" ? globalThis : window);
