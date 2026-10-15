/* October 10, 2026: shared room material pixels. Texture coordinates are world
 * units divided by repeat size. Reading images occurs once, not every frame. */
(/* @function room-surfaces.install — Inputs: browser namespace. Installs an independent bounded material cache. Returns nothing; images load only when requested. */ function (
  root,
) {
  "use strict";
  const cache = new Map(),
    failed = new Set();
  /* @function room-surfaces.get — Inputs: trusted validated relative image URL. Returns decoded RGBA pixels or null while loading/after failure. Loads once, caps images at 4096 per side, logs one failure and never blocks a render frame. */
  function get(url) {
    if (!url) return null;
    if (cache.has(url)) return cache.get(url);
    cache.set(url, null);
    const image = new Image();
    image.onload =
      /* @function room-surfaces.decode — Inputs: none; reads the loaded image. Stores one shared RGBA buffer, returns nothing. Oversized or unreadable assets fail visibly without disrupting the scene. */ function () {
        try {
          if (image.width > 4096 || image.height > 4096)
            throw Error("Room texture exceeds 4096 pixels");
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          ctx.drawImage(image, 0, 0);
          const pixels = ctx.getImageData(0, 0, image.width, image.height);
          cache.set(url, {
            width: image.width,
            height: image.height,
            data: pixels.data,
          });
        } catch (error) {
          failed.add(url);
          console.warn("Room texture unavailable:", url, error.message);
        }
      };
    image.onerror =
      /* @function room-surfaces.failure — Inputs: none. Reports a failed image once; the cached null keeps the color fallback and prevents retry storms. Returns nothing. */ function () {
        failed.add(url);
        console.warn("Room texture unavailable:", url);
      };
    image.src = root.FrontierAssets.url(url); /* 0.15.27: PNG file, or offline copy from disk */
    return null;
  }
  /* @function room-surfaces.uv — Inputs: a face and its world point. Returns planar UV in repeats, using the face's dominant normal. This keeps adjoining panels aligned and textures unchanged when boxes resize. No mutation. */
  function uv(face, point) {
    // October 12, 2026: cylinder sectors share circumference coordinates rather
    // than changing dominant projection axes at each quadrant. Unwrap near this
    // sector midpoint so the seam's final edge reaches a full circumference.
    if (face.roundMapping) {
      const m = face.roundMapping;
      let angle = Math.atan2(point[1] - m.y, point[0] - m.x);
      while (angle - m.reference > Math.PI) angle -= Math.PI * 2;
      while (angle - m.reference < -Math.PI) angle += Math.PI * 2;
      return [
        ((angle - m.start) * m.radius) / (face.tileSize || 1),
        -(point[2] - m.base) / (face.tileSize || 1),
      ];
    }
    const [a, b, c] = face.points,
      ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]],
      ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]],
      normal = [
        ab[1] * ac[2] - ab[2] * ac[1],
        ab[2] * ac[0] - ab[0] * ac[2],
        ab[0] * ac[1] - ab[1] * ac[0],
      ],
      s = face.tileSize || 1;
    if (
      Math.abs(normal[2]) >= Math.max(Math.abs(normal[0]), Math.abs(normal[1]))
    )
      return [point[0] / s, point[1] / s];
    return Math.abs(normal[0]) > Math.abs(normal[1])
      ? [point[1] / s, -point[2] / s]
      : [point[0] / s, -point[2] / s];
  }
  /* @function room-surfaces.memoryBytes — Inputs: none. Returns retained texture pixel bytes, excluding compressed source files. Diagnostic call only; does not allocate pixels. */
  function memoryBytes() {
    let count = 0;
    for (const value of cache.values()) count += value?.data.byteLength || 0;
    return count;
  }
  /* @function room-surfaces.status1523 — Inputs: relative texture URL. Returns decoded-ready and explicit-failure flags without starting loads or allocating pixel buffers. Empty URLs are ready color-only surfaces. Lets transition preparation wait for expensive source reads before animation rather than treating every cached null as failure. */
  function status(url) {
    return { ready: !url || !!cache.get(url), failed: failed.has(url) };
  }
  /* @function roomSurfaces.mappedUv1524 — Inputs: face carrying material controls and a world-space point. Returns: rotated/offset planar UV repeats. Default controls preserve earlier mapping; preserveAspect uses decoded image proportions. Fit mode maps one image to each complete face, with no image rewrite. No per-frame pixel regeneration. */
  function mappedUv(face, point) {
    let [u, v] = uv(face, point);
    if (face.textureMapping === "fit" && face.roundMapping) {
      const m = face.roundMapping;
      u *= (face.tileSize || 1) / (m.radius * m.sweep);
      v = 1 + (v * (face.tileSize || 1)) / m.height;
    } else if (face.textureMapping === "fit") {
      let minU = Infinity,
        maxU = -Infinity,
        minV = Infinity,
        maxV = -Infinity;
      for (const corner of face.points) {
        const q = uv(face, corner);
        minU = Math.min(minU, q[0]);
        maxU = Math.max(maxU, q[0]);
        minV = Math.min(minV, q[1]);
        maxV = Math.max(maxV, q[1]);
      }
      u = (u - minU) / (maxU - minU || 1);
      v = (v - minV) / (maxV - minV || 1);
    } else if (face.preserveAspect) {
      const pixels = cache.get(face.texture);
      if (pixels) v *= pixels.width / pixels.height;
    }
    const angle = ((face.textureRotation || 0) * Math.PI) / 180,
      c = Math.cos(angle),
      s = Math.sin(angle);
    return [
      u * c - v * s + (face.textureOffsetU || 0),
      u * s + v * c + (face.textureOffsetV || 0),
    ];
  }
  root.FrontierRoomSurfaces = { get, uv: mappedUv, memoryBytes, status };
})(window);
