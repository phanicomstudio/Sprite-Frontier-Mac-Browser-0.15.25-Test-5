/* October 14, 2026: the following CPU-baseline introduction is historical. Current supported opaque color uses the GPU; shared CPU inverse-depth and alpha coverage still protect sprite presentation. */
/* Static model rasterization shares the terrain's inverse-depth grid. The
 * logical half-resolution surface is reused; model and terrain depth then mask
 * billboards together. Asset decoding/texture reads never repeat per instance.
 * This CPU baseline is measured before release; backend replacement can retain
 * scene, material and interaction contracts. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model renderer. */
(/* @function model-renderer.installReviewed — Installs shared static-model color/depth rendering and resource preparation. Current GPU color retains CPU shared inverse-depth/alpha coverage; per-asset decoding and static geometry are reused across instances without changing locked sprite presentation. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  const surfaces = new WeakMap(),
    textures = new WeakMap(),
    roomSurfaces = new WeakMap(),
    gpuRooms = new WeakMap(),
    gpuPreviews = new WeakMap(),
    gpuModels = new WeakMap(),
    opaqueImages = new WeakMap();
  const whitePixel = {
    width: 1,
    height: 1,
    data: new Uint8Array([255, 255, 255, 255]),
  };
  /* @function modelRenderer.mappedUV1524 — Inputs: optional precomputed slot mapping and original UV components. Returns: mapped pair when the material service exists, otherwise the original pair. Keeps legacy standalone renderer tests/callers valid; no asset array mutation. */
  function mappedUV1524(mapping, u, v) {
    const original = [u, v];
    return root.FrontierModelMaterials
      ? root.FrontierModelMaterials.uv(mapping, original)
      : original;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.prepare.2 — Handles prepare within model renderer. Inputs: asset. Updates: state promise. Uses: textures has; textures get; textures set; promise all using asset images map using a callback then using a callback catch. Returns: textures get using asset; state. */
  /* @function model-renderer.prepare.2Reviewed — Prepares shared model texture pixels once per asset identity. Inputs: decoded asset with embedded image bytes and MIME types. Returns the cached state immediately, including its asynchronous promise; successful decode publishes RGBA byte records and ready=true. Failure is captured as state.error and leaves ready=false, without an automatic retry. Does not change asset data; browser image/canvas APIs are required. */ function prepare(
    asset,
  ) {
    if (textures.has(asset)) return textures.get(asset);
    const state = { ready: false, pixels: [], error: null };
    textures.set(asset, state);
    state.promise = Promise.all(
      asset.images.map(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.3 — Provides the callback for asset images map. Inputs: image. Updates: c width; c height. Uses: create image bitmap; bitmap close; error; document create element. Returns: a record containing width, height, data. */
  /* @function model-renderer.callback.3Reviewed — Decodes one embedded model image into CPU-readable RGBA bytes. Inputs: image bytes and MIME type. Returns an asynchronous width/height in source pixels and RGBA byte record. Rejects decode/read failures or images above 16,777,216 pixels; closes the bitmap after drawing or explicit size rejection. Allocates a temporary canvas; preparation owns rejection handling. */ async (
          image,
        ) => {
          const bitmap = await createImageBitmap(
            new Blob([image.bytes], { type: image.mime }),
          );
          if (bitmap.width * bitmap.height > 16777216) {
            bitmap.close();
            throw Error("Model texture exceeds 16 megapixels");
          }
          const c = document.createElement("canvas");
          c.width = bitmap.width;
          c.height = bitmap.height;
          const ctx = c.getContext("2d", { willReadFrequently: true });
          ctx.drawImage(bitmap, 0, 0);
          bitmap.close();
          return {
            width: c.width,
            height: c.height,
            data: ctx.getImageData(0, 0, c.width, c.height).data,
          };
        },
      ),
    )
      .then(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.4 — Provides the callback for promise all using asset images map using a callback then. Inputs: p. Updates: state pixels; state ready. */
  /* @function model-renderer.callback.4Reviewed — Publishes the completed batch of decoded texture records. Inputs: ordered pixel records matching asset.images. Returns nothing; stores the records and marks the shared preparation state ready only after every image succeeds. No asset mutation or further decoding. */ (
          p,
        ) => {
          state.pixels = p;
          state.ready = true;
        },
      )
      .catch(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.5 — Provides the callback for promise all using asset images map using a callback then using a callback catch. Inputs: e. Updates: state error. */
  /* @function model-renderer.callback.5Reviewed — Records asynchronous texture preparation failure for renderer readiness checks. Inputs: caught error with message. Returns nothing and resolves the catch branch; stores state.error while ready remains false. Does not retry, clear the asset cache or rethrow. */ (
          e,
        ) => {
          state.error = e.message;
        },
      );
    return state;
  }
  /* @function model-renderer.frame.6 — Runs the animation-clock simulation and rendering work, then schedules the next frame. Inputs: ctx; width; height. Updates: canvas width; canvas height; s. Uses: surfaces get; document create element; canvas get context; surfaces set. Returns: s. */ /* @function modelRenderer.rasterFrame1524 — Inputs: adapter and logical viewport width/height in pixels. Returns adapter-owned CPU raster surface at the selected raster step, clears its RGBA bytes and initializes shared inverse depth when absent. Quality changes retire upload texture/backing canvas before replacement. This is framebuffer ownership, not a simulation/animation clock; October 13 supersedes the retained autogenerated frame description above. */ function frame(
    ctx,
    width,
    height,
  ) {
    let s = surfaces.get(ctx);
    const step = root.FrontierDisplay?.get().rasterStep || 2,
      w = Math.ceil(width / step),
      h = Math.ceil(height / step);
    if (!s || s.w !== w || s.h !== h || s.step !== step) {
      /* October 10, 2026: density changes retire the previous upload texture and shrink its backing canvas before replacing the CPU raster buffers. Avoid retaining a chain of old quality presets in GPU memory. */ if (
        s
      ) {
        root.FrontierPixi?.releaseImage(s.canvas);
        s.canvas.width = s.canvas.height = 1;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      s = {
        w,
        h,
        step,
        canvas,
        context: canvas.getContext("2d"),
        image: new ImageData(w, h),
      };
      surfaces.set(ctx, s);
    }
    s.image.data.fill(0);
    if (!ctx.terrainDepth) FrontierTerrainOcclusion.begin(ctx, width, height);
    return s;
  }
  /* @function model-renderer.material.7 — Handles material within model renderer. Inputs: asset; p. Returns: a record containing factor, texture, alphaMode, cutoff. */ /* @function model-renderer.material1517 — Inputs: asset, primitive and optional map fog. Returns base material and parsed fog color; no mutation. October 9 supersedes origin-only fog with per-pixel camera-depth blending. */
  /* @function modelRenderer.instanceMaterial1524 — Inputs: decoded asset, primitive, fog, coverage and optional instance. Returns: original glTF material semantics plus validated slot texture/tint override. Replacement images reuse the room cache; alpha mode/source geometry remain unchanged. Missing/decoding images temporarily retain source pixels, and transition readiness separately waits for requested images. */
  function material(asset, p, fog, coverage = 1, entity) {
    const m = asset.json.materials?.[p.material] || {},
      pbr = m.pbrMetallicRoughness || {};
    const override = entity?.spatial?.materials?.[p.material],
      image = override?.texture
        ? root.FrontierRoomSurfaces.get(override.texture)
        : null;
    return {
      factor: root.FrontierModelMaterials?.tint(
        override?.color,
        pbr.baseColorFactor || [1, 1, 1, 1],
      ) ||
        pbr.baseColorFactor || [1, 1, 1, 1],
      overrideImage: image,
      overrideSampler: override ? { wrapS: 10497, wrapT: 10497 } : null,
      texture: pbr.baseColorTexture?.index,
      alphaMode: m.alphaMode || "OPAQUE",
      cutoff: m.alphaCutoff ?? 0.5,
      coverage,
      fog,
      fogColor: fog?.enabled ? parseInt(fog.color.slice(1), 16) : 0,
    };
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.sample.8 — Handles sample within model renderer. Inputs: asset; state; m; u; v. Uses: m factor map; wrap. Returns: m factor map using a callback; m factor map using a callback. */
  /* @function model-renderer.sample.8Reviewed — Preserved allocating reference for model texture sampling; the production raster loop uses sampleInto1523. Inputs: decoded asset, prepared pixels, material multipliers and normalized UV coordinates. Returns floating-point RGBA intensities on the source byte scale, using nearest sampling or four-neighbor interpolation according to Smooth filtering. Missing texture pixels return material color. Honors glTF repeat/mirror/clamp without mutating pixels; malformed records can throw. */ function sample(
    asset,
    state,
    m,
    u,
    v,
  ) {
    const texture = asset.json.textures?.[m.texture],
      image = state.pixels[texture?.source];
    if (!image)
      return m.factor.map(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.9 — Returns x multiplied by 255. Inputs: x. Returns: x multiplied by 255. */
  /* @function model-renderer.callback.9Reviewed — Converts one normalized material color channel to the source-byte intensity scale when texture pixels are unavailable. Inputs: channel multiplier. Returns multiplier times 255, without clamping or mutation; caller supplies valid factors. */ (
          x,
        ) => x * 255,
      );
    const sampler = asset.json.samplers?.[texture.sampler] || {};
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.wrap.10 — Handles wrap within model renderer. Inputs: n; mode. Returns: math max using 0, math min using 0.999999, n; math min using 0.999999, f is at most 1 selects f or 2 minus f. */
  /* @function model-renderer.wrap.10Reviewed — Maps a normalized UV component into the reference sampler range. Inputs: coordinate and glTF wrap enum; 33071 clamps, 33648 mirrors, other values repeat. Returns a coordinate below one to keep texel indexing inside the image. Handles negative repeat/mirror coordinates; requires finite numeric input and changes no state. */ function wrap(
      n,
      mode,
    ) {
      if (mode === 33071) return Math.max(0, Math.min(0.999999, n));
      if (mode === 33648) {
        const f = ((n % 2) + 2) % 2;
        return Math.min(0.999999, f <= 1 ? f : 2 - f);
      }
      return n - Math.floor(n);
    }
    /* October 10, 2026: smooth sampling interpolates source texels before solid rasterization. Enlarging the completed raster alone cannot recover texture detail. Neighbor lookup respects repeat/mirror/clamp modes, including seams. */ if (
      root.FrontierDisplay?.smooth()
    ) {
      const tx = wrap(u, sampler.wrapS) * image.width - 0.5,
        ty = wrap(v, sampler.wrapT) * image.height - 0.5,
        x0 = Math.floor(tx),
        y0 = Math.floor(ty),
        fx = tx - x0,
        fy = ty - y0,
        xA = Math.floor(wrap(x0 / image.width, sampler.wrapS) * image.width),
        xB = Math.floor(
          wrap((x0 + 1) / image.width, sampler.wrapS) * image.width,
        ),
        yA = Math.floor(wrap(y0 / image.height, sampler.wrapT) * image.height),
        yB = Math.floor(
          wrap((y0 + 1) / image.height, sampler.wrapT) * image.height,
        );
      return m.factor.map(
        /* @function model-renderer.bilinearChannel1522 — Inputs: material multiplier and channel index. Returns bilinear source intensity multiplied by the material factor. Uses four neighboring texels; no shared texture mutation. */ (
          factor,
          channel,
        ) =>
          factor *
          ((image.data[(yA * image.width + xA) * 4 + channel] * (1 - fx) +
            image.data[(yA * image.width + xB) * 4 + channel] * fx) *
            (1 - fy) +
            (image.data[(yB * image.width + xA) * 4 + channel] * (1 - fx) +
              image.data[(yB * image.width + xB) * 4 + channel] * fx) *
              fy),
      );
    }
    const x = Math.floor(wrap(u, sampler.wrapS) * image.width),
      y = Math.floor(wrap(v, sampler.wrapT) * image.height),
      i = (y * image.width + x) * 4;
    return m.factor.map(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.11 — Returns f multiplied by image data at i plus k. Inputs: f; k. Returns: f multiplied by image data at i plus k. */
  /* @function model-renderer.callback.11Reviewed — Multiplies a nearest source texel channel by its material factor. Inputs: factor and RGBA channel index. Returns floating-point intensity from the captured texel offset and image bytes; does not clamp or mutate the texture. */ (
        f,
        k,
      ) => f * image.data[i + k],
    );
  }

  /* October 12, 2026: original sample() above remains as the documented reference. The production raster loop now reuses one color buffer and resolves texture/sampler state once per triangle, avoiding arrays and closures for every covered pixel. Sampling math, wrap modes, alpha and depth remain unchanged. */
  /* @function model-renderer.wrap1523 — Inputs: normalized coordinate and glTF wrap enum. Returns clamped, mirrored or repeated coordinate below one. No mutation; same boundary rules as the preserved sampler. */
  function wrap1523(n, mode) {
    if (mode === 33071) return Math.max(0, Math.min(0.999999, n));
    if (mode === 33648) {
      const f = ((n % 2) + 2) % 2;
      return Math.min(0.999999, f <= 1 ? f : 2 - f);
    }
    return n - Math.floor(n);
  }
  /* @function model-renderer.sampleInto1523 — Inputs: resolved source image, sampler, material factor, normalized UV, Smooth flag and reusable four-channel output. Writes floating-point RGBA intensities into output; returns nothing. Missing images use material color. Four-neighbor interpolation preserves glTF wrap seams; no allocation or asset mutation. */
  function sampleInto1523(image, sampler, factor, u, v, smooth, out) {
    if (!image) {
      for (let channel = 0; channel < 4; channel++)
        out[channel] = factor[channel] * 255;
      return;
    }
    const width = image.width,
      height = image.height,
      data = image.data;
    if (!smooth) {
      const i =
        (Math.floor(wrap1523(v, sampler.wrapT) * height) * width +
          Math.floor(wrap1523(u, sampler.wrapS) * width)) *
        4;
      for (let channel = 0; channel < 4; channel++)
        out[channel] = factor[channel] * data[i + channel];
      return;
    }
    const tx = wrap1523(u, sampler.wrapS) * width - 0.5,
      ty = wrap1523(v, sampler.wrapT) * height - 0.5,
      x0 = Math.floor(tx),
      y0 = Math.floor(ty),
      fx = tx - x0,
      fy = ty - y0;
    const xa = Math.floor(wrap1523(x0 / width, sampler.wrapS) * width),
      xb = Math.floor(wrap1523((x0 + 1) / width, sampler.wrapS) * width),
      ya = Math.floor(wrap1523(y0 / height, sampler.wrapT) * height),
      yb = Math.floor(wrap1523((y0 + 1) / height, sampler.wrapT) * height);
    const aa = (ya * width + xa) * 4,
      ab = (ya * width + xb) * 4,
      ba = (yb * width + xa) * 4,
      bb = (yb * width + xb) * 4;
    for (let channel = 0; channel < 4; channel++)
      out[channel] =
        factor[channel] *
        ((data[aa + channel] * (1 - fx) + data[ab + channel] * fx) * (1 - fy) +
          (data[ba + channel] * (1 - fx) + data[bb + channel] * fx) * fy);
  }
  /* @function model-renderer.sampleAlpha1524. October 13, 2026: Samples only alpha for shared depth cutouts. Inputs: decoded RGBA image, glTF wrap sampler, scalar material alpha, normalized UV and Smooth flag. Returns the same floating-point alpha byte as sampleInto1523; missing images return material alpha times 255. Preserves bilinear arithmetic and wrap behavior, allocates nothing and changes no assets. RGB interpolation is unnecessary when this pass writes only depth. */
  function sampleAlpha1524(image, sampler, factor, u, v, smooth) {
    if (!image) {
      return factor * 255;
    }
    const width = image.width,
      height = image.height,
      data = image.data;
    if (!smooth) {
      const i =
        (Math.floor(wrap1523(v, sampler.wrapT) * height) * width +
          Math.floor(wrap1523(u, sampler.wrapS) * width)) *
        4;
      return factor * data[i + 3];
    }
    const tx = wrap1523(u, sampler.wrapS) * width - 0.5,
      ty = wrap1523(v, sampler.wrapT) * height - 0.5,
      x0 = Math.floor(tx),
      y0 = Math.floor(ty),
      fx = tx - x0,
      fy = ty - y0;
    const xa = Math.floor(wrap1523(x0 / width, sampler.wrapS) * width),
      xb = Math.floor(wrap1523((x0 + 1) / width, sampler.wrapS) * width),
      ya = Math.floor(wrap1523(y0 / height, sampler.wrapT) * height),
      yb = Math.floor(wrap1523((y0 + 1) / height, sampler.wrapT) * height);
    const aa = (ya * width + xa) * 4,
      ab = (ya * width + xb) * 4,
      ba = (yb * width + xa) * 4,
      bb = (yb * width + xb) * 4;
    return (
      factor *
      ((data[aa + 3] * (1 - fx) + data[ab + 3] * fx) * (1 - fy) +
        (data[ba + 3] * (1 - fx) + data[bb + 3] * fx) * fy)
    );
  }
  /* @function model-renderer.clip.12 — Handles clip within model renderer. Inputs: vertices; cam. Uses: depth; out push; a point map; a uv map. Returns: out. */ /* @function model-renderer.clipContract1523 — Inputs: world-space point/UV polygon, camera and optional exact forward-depth callback. Returns unchanged vertices plus interpolated near-plane crossings at 0.13 world units; no source mutation. Optional callback memoizes only the same authoritative depths. */ function clip(
    vertices,
    cam,
    depthOverride = null,
  ) {
    /* October 12: a prepared three-vertex polygon wholly on one side needs no output array or edge traversal. Exact 0.13 boundary remains unchanged; crossing polygons use historical interpolation. */ if (
      depthOverride &&
      vertices.length === 3
    ) {
      const a = depthOverride(vertices[0]),
        b = depthOverride(vertices[1]),
        c = depthOverride(vertices[2]);
      if (a >= 0.13 && b >= 0.13 && c >= 0.13) return vertices;
      if (a < 0.13 && b < 0.13 && c < 0.13) return [];
    }
    const depth =
        /* @function model-renderer.depth.13 — Returns frontier render depth using cam, spread element. Inputs: v. Uses: frontier render depth. Returns: frontier render depth using cam, spread element. */ (
          v,
        ) =>
          depthOverride
            ? depthOverride(v)
            : FrontierRender.depth(cam, ...v.point),
      out = [];
    for (let i = 0; i < vertices.length; i++) {
      const a = vertices[i],
        b = vertices[(i + 1) % vertices.length],
        da = depth(a),
        db = depth(b),
        inside = da >= 0.13;
      if (inside) out.push(a);
      if (inside !== db >= 0.13) {
        const t = (0.13 - da) / (db - da);
        out.push({
          point: a.point.map(
            /* @function model-renderer.callback.14 — Returns v plus b point at k minus v multiplied by t. Inputs: v; k. Returns: v plus b point at k minus v multiplied by t. */ (
              v,
              k,
            ) => v + (b.point[k] - v) * t,
          ),
          uv: a.uv.map(
            /* @function model-renderer.callback.15 — Returns v plus b uv at k minus v multiplied by t. Inputs: v; k. Returns: v plus b uv at k minus v multiplied by t. */ (
              v,
              k,
            ) => v + (b.uv[k] - v) * t,
          ),
        });
      }
    }
    return out;
  }
  /* @function model-renderer.triangle.16 — Rasterizes or processes one triangle for this module. Inputs: surface; depth; vertices; asset; state; m; cam. Updates: pixels at k multiplied by 4 plus channel; pixels at k multiplied by 4 plus 3; depth values at k. Uses: vertices map; projected some; a list of 0, 1 map; sample. Returns: 0; 0. */ /* @function model-renderer.triangleContract1523 — Inputs: owned RGBA surface, shared inverse-depth grid, clipped world/UV triangle, decoded asset/texture state, material and camera. Optional depthOnly omits color for opaque GPU rooms; projectionOverride supplies identical logical coordinates from draw-local cache. Returns number of written pixels; updates only surface/depth, preserves sampling and edge rules, ignores degenerate/nonfinite triangles. */ function triangle(
    surface,
    depth,
    vertices,
    asset,
    state,
    m,
    cam,
    depthOnly = false,
    projectionOverride = null,
  ) {
    const projected = vertices.map(
      /* @function model-renderer.callback.17 — Returns a record containing copied fields, uv. Inputs: v. Uses: frontier render project. Returns: a record containing copied fields, uv. */ (
        v,
      ) =>
        projectionOverride
          ? projectionOverride(v)
          : { ...FrontierRender.project(cam, ...v.point), uv: v.uv },
    );
    if (
      projected.some(
        /* @function model-renderer.callback.18 — Returns the inverse of number is finite using p x or the inverse of number is finite using p y. Inputs: p. Uses: number is finite. Returns: the inverse of number is finite using p x or the inverse of number is finite using p y. */ (
          p,
        ) => !Number.isFinite(p.x) || !Number.isFinite(p.y),
      )
    )
      return 0;
    const [a, b, c] = projected,
      den = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
    if (Math.abs(den) < 1e-8) return 0;
    const s = surface.step,
      x0 = Math.max(0, Math.floor(Math.min(a.x, b.x, c.x) / s)),
      x1 = Math.min(surface.w - 1, Math.floor(Math.max(a.x, b.x, c.x) / s)),
      y0 = Math.max(0, Math.floor(Math.min(a.y, b.y, c.y) / s)),
      y1 = Math.min(surface.h - 1, Math.floor(Math.max(a.y, b.y, c.y) / s));
    /* October 12: an empty clipped pixel bound cannot write color or depth; avoid texture/edge allocations for offscreen triangles without changing submitted geometry. */ if (
      x0 > x1 ||
      y0 > y1
    )
      return 0;
    /* October 12: small projected triangles often contain no sample center on at least one axis. Reject only when all grid centers lie strictly outside their bounds, retaining a 1e-8 logical-pixel roundoff margin; no triangle size/detail threshold is used. */ if (
      (x0 + 0.5) * s > Math.max(a.x, b.x, c.x) + 1e-8 ||
      (x1 + 0.5) * s < Math.min(a.x, b.x, c.x) - 1e-8 ||
      (y0 + 0.5) * s > Math.max(a.y, b.y, c.y) + 1e-8 ||
      (y1 + 0.5) * s < Math.min(a.y, b.y, c.y) - 1e-8
    )
      return 0;
    const vertexLight =
      !depthOnly && m.lighting && root.FrontierLocalLighting
        ? vertices.map(
            /* @function modelRenderer.vertexLight1524 - Inputs: world/UV vertex. Returns: shared illumination at the actual geometry vertex. Static samples are bounded/cached; no texture pixels are regenerated. */ function (
              v,
            ) {
              return root.FrontierLocalLighting.sample(m.lighting, ...v.point);
            },
          )
        : null;
    const pixels = surface.image.data,
      texture = asset.json.textures?.[m.texture],
      image = m.overrideImage || state.pixels[texture?.source],
      sampler =
        m.overrideSampler || asset.json.samplers?.[texture?.sampler] || {},
      smooth = !!root.FrontierDisplay?.smooth(),
      color =
        surface.colorScratch1523 ||
        (surface.colorScratch1523 = new Float64Array(4));
    let written = 0; /* October 12: triangle rasterization is synchronous and non-reentrant; reuse one surface-owned RGBA scratch and index existing projected vertices rather than allocating three edge pairs per triangle. Exact arithmetic/sampling stays unchanged. */
    /* October 12, 2026: constrain each scanline to the triangle's horizontal span instead of scanning its entire bounding box. Expand by one sample to preserve floating-point edge inclusion; existing barycentric tests remain authoritative. This saves work without changing density or sampling. */
    for (let y = y0; y <= y1; y++) {
      const scanY = (y + 0.5) * s;
      let left = Infinity,
        right = -Infinity;
      for (let edge = 0; edge < 3; edge++) {
        const first = projected[edge],
          second = projected[(edge + 1) % 3];
        if (
          scanY < Math.min(first.y, second.y) ||
          scanY > Math.max(first.y, second.y)
        )
          continue;
        if (first.y === second.y) {
          left = Math.min(left, first.x, second.x);
          right = Math.max(right, first.x, second.x);
        } else {
          const crossing =
            first.x +
            ((second.x - first.x) * (scanY - first.y)) / (second.y - first.y);
          left = Math.min(left, crossing);
          right = Math.max(right, crossing);
        }
      }
      const rowStart = Math.max(x0, Math.floor(left / s - 0.5) - 1),
        rowEnd = Math.min(x1, Math.ceil(right / s - 0.5) + 1);
      for (let x = rowStart; x <= rowEnd; x++) {
        if (
          m.coverage !== undefined &&
          m.coverage < 1 &&
          ((x % 4) * 4 + (y % 4) + 0.5) / 16 > m.coverage
        )
          continue;
        const px = (x + 0.5) * s,
          py = (y + 0.5) * s,
          u = ((b.y - c.y) * (px - c.x) + (c.x - b.x) * (py - c.y)) / den,
          v = ((c.y - a.y) * (px - c.x) + (a.x - c.x) * (py - c.y)) / den,
          w = 1 - u - v;
        if (u < 0 || v < 0 || w < 0) continue;
        const reciprocal = cam.orthographic
            ? 1 / (u * a.depth + v * b.depth + w * c.depth)
            : u / a.depth + v / b.depth + w / c.depth,
          k = y * surface.w + x;
        if (reciprocal <= depth.values[k]) continue;
        /* October 12: opaque GPU room color still populates the exact CPU inverse-depth grid for locked billboard masking, without CPU texture interpolation. */ if (
          depthOnly
        ) {
          // October 13: only cutout materials need texture sampling on this depth-only
          // path. Opaque beds/walls still avoid all CPU color interpolation. Sampling
          // uses the retained exact UV/filter/factor math so sprite visibility agrees
          // with the GPU cutoff rather than filling the transparent holes as solids.
          if (m.alphaDepth) {
            const wa = cam.orthographic ? u : u / a.depth / reciprocal,
              wb = cam.orthographic ? v : v / b.depth / reciprocal,
              wc = cam.orthographic ? w : w / c.depth / reciprocal;
            const alpha = sampleAlpha1524(
              image,
              sampler,
              m.factor[3],
              wa * a.uv[0] + wb * b.uv[0] + wc * c.uv[0],
              wa * a.uv[1] + wb * b.uv[1] + wc * c.uv[1],
              smooth,
            );
            if (alpha < 1) continue;
          }
          depth.values[k] = reciprocal;
          written++;
          continue;
        }
        /* @function model-renderer.callback.19 — Returns weights at 0 multiplied by a uv at axis plus weights at 1 multiplied by b uv at axis plus weights at 2 multiplied by c uv at axis. Inputs: axis. Returns: weights at 0 multiplied by a uv at axis plus weights at 1 multiplied by b uv at axis plus weights at 2 multiplied by c uv at axis. */ const wa =
            cam.orthographic ? u : u / a.depth / reciprocal,
          wb = cam.orthographic ? v : v / b.depth / reciprocal,
          wc = cam.orthographic ? w : w / c.depth / reciprocal;
        sampleInto1523(
          image,
          sampler,
          m.factor,
          wa * a.uv[0] + wb * b.uv[0] + wc * c.uv[0],
          wa * a.uv[1] + wb * b.uv[1] + wc * c.uv[1],
          smooth,
          color,
        );
        if (vertexLight)
          for (let channel = 0; channel < 3; channel++)
            color[channel] *=
              wa * vertexLight[0][channel] +
              wb * vertexLight[1][channel] +
              wc * vertexLight[2][channel];
        if (m.alphaMode === "MASK" && color[3] / 255 < m.cutoff) continue;
        if (color[3] < 1) continue;
        const fogAmount = m.fog?.enabled
          ? Math.max(
              0,
              Math.min(
                1,
                (1 / reciprocal - m.fog.start) / (m.fog.end - m.fog.start),
              ),
            )
          : 0;
        for (let channel = 0; channel < 3; channel++)
          pixels[k * 4 + channel] =
            color[channel] * (1 - fogAmount) +
            ((m.fogColor >> ((2 - channel) * 8)) & 255) * fogAmount;
        pixels[k * 4 + 3] = m.alphaMode === "OPAQUE" ? 255 : color[3];
        depth.values[k] = reciprocal;
        written++;
      }
    }
    return written;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.composite.20 — Handles composite within model renderer. Inputs: ctx; surface. Updates: ctx global alpha; ctx fog depth. Uses: surface context put image data; ctx sources get using surface canvas update; ctx sources get; ctx save. */
  /* @function model-renderer.composite.20Reviewed — Uploads the CPU raster image and composites it into the logical viewport. Inputs: drawing adapter and reusable raster surface with pixel dimensions and logical raster step. Returns nothing; updates any cached upload texture, temporarily disables extra alpha/fog and scales the image into logical pixels. Restores drawing state on normal completion; drawing failures propagate without a local finally. */ function composite(
    ctx,
    surface,
  ) {
    surface.context.putImageData(surface.image, 0, 0);
    ctx.sources?.get(surface.canvas)?.update();
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.fogDepth = 0;
    ctx.drawImage(
      surface.canvas,
      0,
      0,
      surface.w,
      surface.h,
      0,
      0,
      surface.w * surface.step,
      surface.h * surface.step,
    );
    ctx.restore();
  }

  /* @function model-renderer.opaque1523 — Inputs: decoded shared pixel record or null while loading. Returns whether every texel has nonzero alpha under the historical room OPAQUE material rule; caches the one-time inspection by record identity. Null uses the existing solid color fallback. Textures with zero-alpha holes retain the CPU path for exact alpha/depth semantics. */
  function opaque1523(pixel) {
    if (!pixel) return true;
    if (opaqueImages.has(pixel)) return opaqueImages.get(pixel);
    let result = true;
    for (let i = 3; i < pixel.data.length; i += 4)
      if (pixel.data[i] < 1) {
        result = false;
        break;
      }
    opaqueImages.set(pixel, result);
    return result;
  }
  // October 13: OPAQUE textures can contain zero-alpha cutouts. Their color
  // stays on the GPU while the shared CPU depth tests only those alpha samples.
  // Physical collision remains triangle-based; transparent pixels do not carve
  // a doorway. MASK/BLEND and distance-coverage fallbacks remain separate limits.
  const alphaMinimumCache1524 = new WeakMap();
  /* @function modelRenderer.alphaMinimum1524 — Inputs: decoded immutable RGBA pixel record or null fallback. Returns cached minimum source alpha byte (0–255). Scans each record once; retains no new pixel buffers. Null uses historical white fallback alpha 255. Allows opaque holes without forcing unrelated meshes onto CPU color rasterization. */
  function alphaMinimum1524(pixel) {
    if (!pixel) return 255;
    if (alphaMinimumCache1524.has(pixel))
      return alphaMinimumCache1524.get(pixel);
    let minimum = 255;
    for (let i = 3; i < pixel.data.length; i += 4) {
      minimum = Math.min(minimum, pixel.data[i]);
      if (!minimum) break;
    }
    alphaMinimumCache1524.set(pixel, minimum);
    return minimum;
  }
  /* @function model-renderer.gpuRoom1523 — Inputs: live Pixi adapter, game viewport and camera, room faces. Returns reusable GPU backend for supported opaque perspective room surfaces, or null for Canvas/fixed-camera/transparent fallback. Density changes release old upload and GPU resources before recreation. No gameplay mutation; creation failures fall back with one warning. */
  function gpuRoom1523(ctx, game, cam, faces) {
    if (!ctx.app || cam.orthographic || !root.FrontierGeometryGPU) return null;
    const density = root.FrontierDisplay?.get().scale || 1,
      width = game.viewWidth || 640;
    let state = gpuRooms.get(ctx);
    if (state?.failed) return null;
    if (!state || state.width !== width || state.density !== density) {
      if (state) {
        root.FrontierPixi.releaseImage(state.backend.canvas);
        state.backend.destroy();
      }
      try {
        state = {
          width,
          density,
          backend: root.FrontierGeometryGPU.create(
            Math.round(width * density),
            Math.round(480 * density),
            width,
            480,
          ),
        };
        gpuRooms.set(ctx, state);
      } catch (error) {
        gpuRooms.set(ctx, { failed: true });
        console.warn("GPU room fallback:", error.message);
        return null;
      }
    }
    return state.backend;
  }
  // Room polygons enter the same per-pixel depth buffer as imported models.
  // This prevents a room face's centroid sort from covering nearer geometry.
  /* @function model-renderer.geometry.21 — This prevents a room face's centroid sort from covering nearer geometry. Inputs: ctx; game; cam; faces. Uses: frame; /^#([a-f0-9]{6})$/i exec; parse int; face points map. Returns: without a result. */ function geometry(
    ctx,
    game,
    cam,
    faces,
  ) {
    if (!faces.length) return;
    /* October 10, 2026: keep the room upload separate from model uploads. Deferred Pixi draws retain the texture until flush; clearing one shared canvas for models erased the room. Both surfaces still share the same collision depth grid. */ let room =
      roomSurfaces.get(ctx);
    if (!room) {
      room = {};
      roomSurfaces.set(ctx, room);
    }
    if (!ctx.terrainDepth)
      FrontierTerrainOcclusion.begin(ctx, game.viewWidth || 640, 480);
    room.terrainDepth = ctx.terrainDepth;
    const surface = frame(room, game.viewWidth || 640, 480),
      asset = { json: {} },
      state = { pixels: [] },
      gpu = gpuRoom1523(ctx, game, cam, faces),
      gpuTriangles = [];
    for (const face of faces) {
      const pixel = root.FrontierRoomSurfaces.get(face.texture);
      asset.json.textures = [{ source: 0 }];
      state.pixels = [pixel];
      const color = /^#([a-f0-9]{6})$/i.exec(face.color || "");
      const n = color ? parseInt(color[1], 16) : 0x334455,
        m = {
          lighting: game.lightFrame,
          alphaDepth: alphaMinimum1524(pixel) < 1,
          factor: [
            ((n >> 16) & 255) / 255,
            ((n >> 8) & 255) / 255,
            (n & 255) / 255,
            1,
          ],
          alphaMode: "OPAQUE",
          ...(pixel ? { texture: 0 } : {}),
        },
        vertices = face.points.map(
          /* @function model-renderer.callback.22 — Returns a record containing point, uv. Inputs: point. Returns: a record containing point, uv. */ (
            point,
          ) => ({ point, uv: root.FrontierRoomSurfaces.uv(face, point) }),
        ),
        clipped = cam.orthographic ? vertices : clip(vertices, cam);
      for (let i = 1; i < clipped.length - 1; i++) {
        const tri = [clipped[0], clipped[i], clipped[i + 1]];
        triangle(surface, ctx.terrainDepth, tri, asset, state, m, cam, !!gpu);
        if (gpu)
          gpuTriangles.push({
            image: pixel || whitePixel,
            factor: m.factor,
            opaque: true,
            vertices: tri.map(
              /* @function model-renderer.gpuVertex1523 — Inputs: clipped world vertex with UV. Returns logical projected coordinates, positive forward depth and original planar UV for GPU perspective interpolation. No scene mutation. */ function (
                vertex,
              ) {
                const projected = root.FrontierRender.project(
                  cam,
                  ...vertex.point,
                );
                return {
                  x: projected.x,
                  y: projected.y,
                  depth: projected.depth,
                  u: vertex.uv[0],
                  v: vertex.uv[1],
                  world: vertex.point,
                };
              },
            ),
          });
      }
    }
    if (gpu) {
      gpu.draw(gpuTriangles, !!root.FrontierDisplay?.smooth(), game.lightFrame);
      ctx.sources?.get(gpu.canvas)?.update();
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fogDepth = 0;
      ctx.drawImage(
        gpu.canvas,
        0,
        0,
        gpu.canvas.width,
        gpu.canvas.height,
        0,
        0,
        game.viewWidth || 640,
        480,
      );
      ctx.restore();
      game.roomBackend = "GPU color / CPU shared depth";
    } else {
      root.FrontierIsometricVisibility169?.cutout(ctx,surface);
      composite(ctx, surface);
      game.roomBackend = "CPU";
    }
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.transform.23 — Handles transform within model renderer. Inputs: entity. Uses: frontier model transform matrix. Returns: frontier model transform matrix using a record containing position, rotation, scale. */
  /* @function model-renderer.transform.23Reviewed — Builds the model instance transform used by rendering. Inputs: entity with engine Z-up world position in metres, optional rotation in degrees and scale factors. Returns a new transform matrix; missing height/rotation/scale use zero/identity defaults. Does not mutate the instance; invalid supplied transforms or missing transform service propagate failures. */ function transform(
    entity,
  ) {
    return FrontierModelTransform.matrix({
      position: [entity.x, entity.y, entity.z || 0],
      rotation: entity.modelTransform?.rotation || [0, 0, 0],
      scale: entity.modelTransform?.scale || [1, 1, 1],
    });
  }
  // Conservative corner bounds avoid transforming every triangle in models
  // entirely behind or outside the view. Near-plane crossings remain visible.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.visible.24 — entirely behind or outside the view. Near-plane crossings remain visible. Inputs: asset; m; cam; width. Uses: points push; frontier model transform vector; points map; depths every. Returns: false; true. */
  /* @function model-renderer.visible.24Reviewed — Conservatively tests transformed asset bounding corners against the logical viewport. Inputs: compiled asset bounds, instance matrix, camera and viewport width in logical pixels; height is the engine logical 480 pixels. Returns false only when all corners are behind the perspective near threshold or beyond one screen edge; near crossings remain visible. Allocates corner/projection arrays without scene mutation; this is frustum rejection, not obstruction or distance culling. */ function visible(
    asset,
    m,
    cam,
    width,
  ) {
    const b = asset.scene.bounds,
      points = [];
    for (const x of [b.min[0], b.max[0]])
      for (const y of [b.min[1], b.max[1]])
        for (const z of [b.min[2], b.max[2]])
          points.push(FrontierModelTransform.vector(m, [x, y, z]));
    const depths = points.map(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.25 — Returns frontier render depth using cam, spread element. Inputs: p. Uses: frontier render depth. Returns: frontier render depth using cam, spread element. */
  /* @function model-renderer.callback.25Reviewed — Measures one transformed bounding corner in camera depth. Inputs: Z-up world point in metres. Returns the render service camera-depth value, without mutation; the enclosing visibility test uses it for near-plane rejection. */ (
        p,
      ) => FrontierRender.depth(cam, ...p),
    );
    if (
      !cam.orthographic &&
      depths.every(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.26 — Returns d is less than 0.13. Inputs: d. Returns: d is less than 0.13. */
  /* @function model-renderer.callback.26Reviewed — Tests whether a bounding corner is behind the perspective near threshold. Inputs: camera depth in world units. Returns depth < 0.13; every corner must satisfy this predicate to reject the model. No mutation. */ (
          d,
        ) => d < 0.13,
      )
    )
      return false;
    if (
      depths.some(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.27 — Returns d is less than 0.13. Inputs: d. Returns: d is less than 0.13. */
  /* @function model-renderer.callback.27Reviewed — Detects a bounding corner crossing the near threshold. Inputs: camera depth in world units. Returns depth < 0.13; any such corner preserves the model for subsequent clipping rather than relying on unstable screen projections. No mutation. */ (
          d,
        ) => d < 0.13,
      )
    )
      return true;
    const q = points.map(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.28 — Returns frontier render project using cam, spread element. Inputs: p. Uses: frontier render project. Returns: frontier render project using cam, spread element. */
  /* @function model-renderer.callback.28Reviewed — Projects a transformed bounding corner for screen-edge rejection. Inputs: Z-up world point in metres. Returns the render service screen projection in logical pixels; no scene mutation. */ (
        p,
      ) => FrontierRender.project(cam, ...p),
    );
    return (
      !q.every(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.29 — Returns p x is less than 0. Inputs: p. Returns: p x is less than 0. */
  /* @function model-renderer.callback.29Reviewed — Tests a projected corner against the left viewport edge. Inputs: screen point in logical pixels. Returns x < 0; the enclosing every test rejects only an entirely offscreen bound. No mutation. */ (
          p,
        ) => p.x < 0,
      ) &&
      !q.every(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.30 — Returns p x is greater than width. Inputs: p. Returns: p x is greater than width. */
  /* @function model-renderer.callback.30Reviewed — Tests a projected corner against the right viewport edge. Inputs: screen point in logical pixels. Returns x > captured viewport width; the enclosing every test rejects only an entirely offscreen bound. No mutation. */ (
          p,
        ) => p.x > width,
      ) &&
      !q.every(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.31 — Returns p y is less than 0. Inputs: p. Returns: p y is less than 0. */
  /* @function model-renderer.callback.31Reviewed — Tests a projected corner against the top viewport edge. Inputs: screen point in logical pixels. Returns y < 0; the enclosing every test rejects only an entirely offscreen bound. No mutation. */ (
          p,
        ) => p.y < 0,
      ) &&
      !q.every(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-renderer.callback.32 — Returns p y is greater than 480. Inputs: p. Returns: p y is greater than 480. */
  /* @function model-renderer.callback.32Reviewed — Tests a projected corner against the bottom viewport edge. Inputs: screen point in logical pixels. Returns y > engine logical height 480; the enclosing every test rejects only an entirely offscreen bound. No mutation. */ (
          p,
        ) => p.y > 480,
      )
    );
  }
  /* @function model-renderer.previewGPU1523 — Inputs: isolated door Canvas context, preview viewport, camera and model instances. Returns true after GPU color rendering or false for unsupported/unavailable fallback. Does not replace gameplay model depth; door view has no billboards or terrain. Reuses decoded images and GPU buffers; density changes destroy old resources. BLEND materials keep historical CPU fallback. */
  function previewGPU1523(ctx, game, cam, models) {
    if (!ctx.doorGPU || !root.FrontierGeometryGPU || cam.orthographic)
      return false;
    const width = game.viewWidth || 640,
      density = root.FrontierDisplay?.get().scale || 1;
    let cached = gpuPreviews.get(ctx);
    if (cached?.failed) return false;
    if (!cached || cached.width !== width || cached.density !== density) {
      if (cached) cached.backend.destroy();
      try {
        cached = {
          width,
          density,
          backend: root.FrontierGeometryGPU.create(
            Math.round(width * density),
            Math.round(480 * density),
            width,
            480,
          ),
        };
        gpuPreviews.set(ctx, cached);
      } catch (error) {
        gpuPreviews.set(ctx, { failed: true });
        console.warn("GPU door fallback:", error.message);
        return false;
      }
    }
    const triangles = [];
    let unsupported = false;
    for (const entity of models) {
      const asset =
        entity.transitionAsset || FrontierModelLibrary.get(entity.modelId);
      if (!asset?.scene) continue;
      const matrix = transform(entity);
      if (!visible(asset, matrix, cam, width)) continue;
      const state = prepare(entity.transitionSource || asset);
      FrontierModelScene.triangles(
        asset,
        asset.scene,
        matrix,
        /* @function model-renderer.previewTriangle1523 — Inputs: transformed points, mesh primitive, node unused and triangle offset. Builds clipped GPU triangle records with original UVs/materials. No authored asset changes; marks unsupported blending for fallback. */ function (
          points,
          primitive,
          node,
          index,
        ) {
          const m = material(asset, primitive, undefined, 1, entity);
          if (m.alphaMode === "BLEND") {
            unsupported = true;
            return;
          }
          const texture = asset.json.textures?.[m.texture],
            image =
              m.overrideImage || state.pixels[texture?.source] || whitePixel,
            sampler =
              m.overrideSampler ||
              asset.json.samplers?.[texture?.sampler] ||
              {},
            vertices = [];
          for (let i = 0; i < 3; i++) {
            const offset = primitive.indices[index + i] * 2;
            vertices.push({
              point: points[i],
              uv: mappedUV1524(
                root.FrontierModelMaterials?.mapping(
                  entity.spatial?.materials?.[primitive.material],
                  state.pixels[texture?.source],
                ),
                primitive.uv?.[offset] ?? 0,
                primitive.uv?.[offset + 1] ?? 0,
              ),
            });
          }
          const clipped = clip(vertices, cam);
          for (let i = 1; i < clipped.length - 1; i++)
            triangles.push({
              image,
              factor: m.factor,
              opaque: m.alphaMode === "OPAQUE",
              cutoff: m.alphaMode === "MASK" ? m.cutoff : 1 / 255,
              sampler,
              vertices: [clipped[0], clipped[i], clipped[i + 1]].map(
                /* @function model-renderer.previewVertex1523 — Inputs: clipped world vertex and UV. Returns unchanged logical projection plus perspective UV for GPU color/depth. */ function (
                  vertex,
                ) {
                  const projected = FrontierRender.project(
                    cam,
                    ...vertex.point,
                  );
                  return {
                    x: projected.x,
                    y: projected.y,
                    depth: projected.depth,
                    u: vertex.uv[0],
                    v: vertex.uv[1],
                  };
                },
              ),
            });
        },
      );
    }
    if (unsupported) return false;
    cached.backend.draw(triangles, !!root.FrontierDisplay?.smooth());
    if (!cached.warmupStarted) {
      cached.backend.beginWarmup();
      cached.warmupStarted = true;
    }
    ctx.drawImage(
      cached.backend.canvas,
      0,
      0,
      cached.backend.canvas.width,
      cached.backend.canvas.height,
      0,
      0,
      width,
      480,
    );
    ctx.gpuPreviewStats = cached.backend.diagnostics();
    game.modelDebug = {
      instances: models.length,
      triangles: triangles.length,
      backend: "GPU cinematic",
    };
    return true;
  }
  /* @function model-renderer.draw.33 — Draws this system’s current state into the supplied rendering context. Inputs: ctx; game; cam; entities. Updates: game model debug. Uses: entities filter; performance now; frame; frontier model library get. Returns: without a result. */ /* @function model-renderer.draw1517 — Inputs: render context, game, camera and instances. Draws shared geometry with private transition scene overrides; uses original asset for texture cache, stable distance coverage and per-pixel fog. Returns nothing; writes shared depth/diagnostics. October 9 extends static-only contract without modifying source meshes. */ const worldTriangleCache1523 =
      new WeakMap(),
    worldTriangleRetention1523 = new Map();
  let worldTriangleCount1523 = 0;
  /* @function modelRenderer.gpuModels1524 — Inputs: live Pixi adapter, viewport/camera and eligible model instances. Returns owned GPU state for opaque perspective gameplay models or null for the retained CPU path. Rejects alpha holes, MASK/BLEND materials, distance coverage and fixed cameras so earlier semantics remain available. Density changes dispose old resources; creation failure warns once. Does not alter geometry, collision, sprite tilt or source assets. */
  /* @function modelRenderer.gpuOpaqueCutouts1524 — Inputs: Pixi adapter, live viewport/camera and model list. Returns reused GPU state for perspective OPAQUE models, including zero-alpha texture holes. Shared CPU depth samples cutout alpha separately; unrelated opaque models retain fast depth-only work. MASK/BLEND, distance coverage and fixed views retain historical CPU fallback. October 13 supersedes the retained blanket alpha-hole rejection above. No source, collision or sprite presentation mutation. */ function gpuModels1524(
    ctx,
    game,
    cam,
    models,
  ) {
    if (!ctx.app || cam.orthographic || !root.FrontierGeometryGPU) return null;
    for (const entity of models) {
      if ((entity.modelCoverage ?? 1) < 1) return null;
      const asset =
        entity.transitionAsset || FrontierModelLibrary.get(entity.modelId);
      if (!asset?.scene) continue;
      const state = prepare(entity.transitionSource || asset);
      for (const primitives of asset.meshes)
        for (const primitive of primitives) {
          const m = material(asset, primitive, undefined, 1, entity);
          if (m.alphaMode !== "OPAQUE" || m.factor[3] < 1 / 255)
            return null; /* October 13: zero-alpha OPAQUE pixels use shader cutoff plus alpha-aware CPU depth, not whole-scene color fallback. */
        }
    }
    const width = game.viewWidth || 640,
      density = root.FrontierDisplay?.get().scale || 1;
    let state = gpuModels.get(ctx);
    if (state?.failed) return null;
    if (!state || state.width !== width || state.density !== density) {
      if (state) {
        root.FrontierPixi?.releaseImage(state.backend.canvas);
        state.backend.destroy();
      }
      try {
        state = {
          width,
          density,
          backend: root.FrontierGeometryGPU.create(
            Math.round(width * density),
            Math.round(480 * density),
            width,
            480,
          ),
          prior: null,
        };
        gpuModels.set(ctx, state);
      } catch (error) {
        gpuModels.set(ctx, { failed: true });
        console.warn("GPU model fallback:", error.message);
        return null;
      }
    }
    return state;
  }
  /* @function model-renderer.worldTriangles1523 — Inputs: immutable decoded/compiled asset, instance world matrix and stable entity ID. Returns camera-independent triangle vertex/UV records, reused while exact matrix values match. Asset-owned LRU holds at most 32 instances; global retention caps 200,000 triangles/128 entries, with individual assets over 100,000 triangles bypassing retention. Library asset replacement invalidates naturally; animated/private assets own separate identity. Does not mutate source geometry or camera. */
  /* @function modelRenderer.mappedWorldTriangles1524 — Inputs: immutable asset, instance matrix/identity and optional validated slot overrides. Returns: retained geometry with independently mapped UVs. Override identity and decoded aspect token invalidate mapping while collision/source arrays stay untouched. Existing retention bounds still apply; no image bytes enter cache keys. */
  function worldTriangles1523(asset, m, key, overrides) {
    const mappings = overrides ? new Map() : null;
    let aspectToken = "";
    if (overrides)
      for (const [slot, override] of Object.entries(overrides)) {
        const texture =
            asset.json.textures?.[
              asset.json.materials?.[slot]?.pbrMetallicRoughness
                ?.baseColorTexture?.index
            ],
          mapping = root.FrontierModelMaterials.mapping(
            override,
            prepare(asset).pixels[texture?.source],
          );
        mappings.set(Number(slot), mapping);
        aspectToken += slot + ":" + mapping.aspect + ";";
      }
    let records = worldTriangleCache1523.get(asset);
    if (!records) {
      records = new Map();
      worldTriangleCache1523.set(asset, records);
    }
    let cached = records.get(key);
    if (
      cached &&
      cached.overrides === overrides &&
      cached.aspectToken === aspectToken &&
      cached.scene === asset.scene &&
      cached.matrix.length === m.length &&
      cached.matrix.every(
        /* @function model-renderer.sameWorldMatrix1523 — Inputs: retained matrix component and index. Returns exact component equality with current transform; no tolerances or mutation. */ function (
          value,
          index,
        ) {
          return value === m[index];
        },
      )
    ) {
      records.delete(key);
      records.set(key, cached);
      const retained = worldTriangleRetention1523.get(cached);
      if (retained) {
        worldTriangleRetention1523.delete(cached);
        worldTriangleRetention1523.set(cached, retained);
      }
      return cached.triangles;
    }
    const triangles = [],
      vertices = new WeakMap();
    FrontierModelScene.triangles(
      asset,
      asset.scene,
      m,
      /* @function model-renderer.collectWorldTriangle1523 — Inputs: transformed read-only points, primitive, scene node and index offset. Appends immutable camera-independent vertices and primitive reference in original order. Shares vertex records only within their primitive transform; source arrays remain untouched. */ function (
        points,
        primitive,
        node,
        index,
      ) {
        const tri = [];
        for (let k = 0; k < 3; k++) {
          const point = points[k];
          let vertex = vertices.get(point);
          if (!vertex) {
            const uvIndex = primitive.indices[index + k] * 2;
            vertex = {
              point,
              uv: mappedUV1524(
                mappings?.get(primitive.material),
                primitive.uv?.[uvIndex] ?? 0,
                primitive.uv?.[uvIndex + 1] ?? 0,
              ),
            };
            vertices.set(point, vertex);
          }
          tri.push(vertex);
        }
        triangles.push({ vertices: tri, primitive });
      },
      true,
    );
    if (triangles.length <= 100000) {
      if (cached && worldTriangleRetention1523.has(cached)) {
        worldTriangleCount1523 -= cached.triangles.length;
        worldTriangleRetention1523.delete(cached);
      }
      records.delete(key);
      const entry = {
        scene: asset.scene,
        matrix: Array.from(m),
        triangles,
        overrides,
        aspectToken,
      };
      records.set(key, entry);
      worldTriangleRetention1523.set(entry, { owner: records, key });
      worldTriangleCount1523 += triangles.length;
      while (records.size > 32) {
        const firstKey = records.keys().next().value,
          retired = records.get(firstKey);
        records.delete(firstKey);
        if (worldTriangleRetention1523.delete(retired))
          worldTriangleCount1523 -= retired.triangles.length;
      }
      while (
        worldTriangleCount1523 > 200000 ||
        worldTriangleRetention1523.size > 128
      ) {
        const retired = worldTriangleRetention1523.keys().next().value,
          location = worldTriangleRetention1523.get(retired);
        worldTriangleRetention1523.delete(retired);
        worldTriangleCount1523 -= retired.triangles.length;
        if (location.owner.get(location.key) === retired)
          location.owner.delete(location.key);
      }
    }
    return triangles;
  }
  /* @function model-renderer.drawContract1523 — Inputs: renderer context, runtime game, frame camera and candidate entities. Draws eligible visible models in original order into shared inverse-depth and color buffers, preserving fog/coverage/sampling. Reuses bounded static world geometry and draw-local exact projection; updates game.modelDebug, without modifying asset/source/sprite presentation. Missing assets skip and private door GPU remains separate. */ function draw(
    ctx,
    game,
    cam,
    entities,
  ) {
    const models = entities.filter(
      /* @function model-renderer.callback.34 — Returns e model id and the inverse of e transparent. Inputs: e. Returns: e model id and the inverse of e transparent. */ (
        e,
      ) => e.modelId && !e.transparent,
    );
    if (!models.length) return;
    if (previewGPU1523(ctx, game, cam, models)) return;
    const start = performance.now(),
      surface = frame(ctx, game.viewWidth || 640, 480),
      depth = ctx.terrainDepth,
      gpu = gpuModels1524(ctx, game, cam, models),
      gpuTriangles = [];
    let prior = null;
    // Snapshot structural/terrain depth before these models. CPU triangle depth stays
    // authoritative for billboard masking; the GPU overlay compares only prior world
    // geometry while its own depth buffer resolves model/model occlusion.
    if (gpu) {
      if (!gpu.prior || gpu.prior.length !== depth.values.length)
        gpu.prior = new Float32Array(depth.values.length);
      gpu.prior.set(depth.values);
      prior = { w: depth.w, h: depth.h, values: gpu.prior };
    }
    let triangles = 0,
      pixels = 0,
      instances = 0,
      culled = 0;
    for (const e of models) {
      const asset = e.transitionAsset || FrontierModelLibrary.get(e.modelId);
      if (!asset?.scene) continue;
      const m = transform(e);
      if (!visible(asset, m, cam, game.viewWidth || 640)) {
        culled++;
        continue;
      }
      const state = prepare(e.transitionSource || asset),
        preparedVertices = new WeakMap(),
        materials = new Map(),
        fog = root.FrontierFog?.settings(game),
        basis = root.FrontierCameraBasis?.create(cam, FrontierRender.project),
        depths = new WeakMap();
      /* @function model-renderer.cachedDepth1523 — Inputs: immutable triangle vertex. Returns exact camera forward depth cached by transformed point for this draw only; no source/camera mutation. Legacy camera arithmetic remains authoritative. */
      const cachedDepth =
        /* @function model-renderer.cachedDepthCallable1523 — Inputs: immutable vertex. Returns draw-local exact forward depth; no source mutation or retained frame resources. */ function (
          v,
        ) {
          if (!depths.has(v.point))
            depths.set(v.point, FrontierRender.depth(cam, ...v.point));
          return depths.get(v.point);
        };
      /* @function model-renderer.cachedProjection1523 — Inputs: triangle vertex including interpolated near-clip output. Returns exact projection with UV, reusing a prepared record for shared vertices. Clipped vertices project directly; no shared point/UV mutation. */
      const cachedProjection =
        /* @function model-renderer.cachedProjectionCallable1523 — Inputs: original or near-clipped vertex. Returns projected coordinates with UV; source data and locked sprite presentation remain unchanged. */ function (
          v,
        ) {
          if (!preparedVertices.has(v.point))
            preparedVertices.set(v.point, {
              ...(basis
                ? basis(cam, ...v.point)
                : FrontierRender.project(cam, ...v.point)),
              uv: v.uv,
            });
          return preparedVertices.get(v.point);
        };

      /* October 12, 2026: the callback/vertex contracts below are retained history, superseded by the camera-independent collection helper and per-frame projection cache. */
      /* @function model-renderer.callback.35 — Provides the callback for frontier model scene triangles. Inputs: points; p; node; index. Updates: pixels. Uses: points map; clip; triangle; material. */
      /* @function model-renderer.callback.36 — Provides the callback for points map. Inputs: point; k. Returns: a record containing point, uv. */
      instances++;
      for (const record of worldTriangles1523(
        asset,
        m,
        e.id || e,
        e.spatial?.materials,
      )) {
        const p = record.primitive,
          vertices = record.vertices,
          clipped = cam.orthographic
            ? vertices
            : clip(vertices, cam, cachedDepth);
        if (!materials.has(p)) {
          const value = {
              ...material(asset, p, fog, e.modelCoverage ?? 1, e),
              lighting: game.lightFrame,
            },
            texture = asset.json.textures?.[value.texture];
          value.alphaDepth =
            alphaMinimum1524(
              value.overrideImage || state.pixels[texture?.source],
            ) *
              value.factor[3] <
            1;
          materials.set(p, value);
        }
        for (let i = 1; i < clipped.length - 1; i++) {
          triangles++;
          const tri = [clipped[0], clipped[i], clipped[i + 1]],
            mat = materials.get(p);
          pixels += triangle(
            surface,
            depth,
            tri,
            asset,
            state,
            mat,
            cam,
            !!gpu,
            cachedProjection,
          );
          if (gpu) {
            const texture = asset.json.textures?.[mat.texture];
            gpuTriangles.push({
              image:
                mat.overrideImage ||
                state.pixels[texture?.source] ||
                whitePixel,
              factor: mat.factor,
              opaque: true,
              sampler:
                mat.overrideSampler ||
                asset.json.samplers?.[texture?.sampler] ||
                {},
              fog: mat.fog,
              vertices: tri.map(
                /* @function modelRenderer.gpuWorldVertex1524 — Inputs: clipped world/UV vertex. Returns exact projected depth, UV and world position for GPU filtering/light/fog. Reuses the same draw-local projection as CPU depth; no mutation. */ function (
                  vertex,
                ) {
                  const q = cachedProjection(vertex);
                  return {
                    x: q.x,
                    y: q.y,
                    depth: q.depth,
                    u: vertex.uv[0],
                    v: vertex.uv[1],
                    world: vertex.point,
                  };
                },
              ),
            });
          }
        }
      }
    }
    if (gpu) {
      gpu.backend.draw(
        gpuTriangles,
        !!root.FrontierDisplay?.smooth(),
        game.lightFrame,
        prior,
      );
      ctx.sources?.get(gpu.backend.canvas)?.update();
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fogDepth = 0;
      ctx.drawImage(
        gpu.backend.canvas,
        0,
        0,
        gpu.backend.canvas.width,
        gpu.backend.canvas.height,
        0,
        0,
        game.viewWidth || 640,
        480,
      );
      ctx.restore();
    } else {root.FrontierIsometricVisibility169?.cutout(ctx,surface);composite(ctx, surface);}
    game.modelDebug = {
      instances,
      culled,
      triangles,
      pixels,
      backend: gpu ? "GPU opaque color / CPU shared depth" : "CPU",
      milliseconds: performance.now() - start,
    };
  }
  /* @function model-renderer.memoryBytes — Inputs: none. Returns decoded RGBA byte estimate for live shared-library textures already prepared. Does not load assets or count GPU copies; unavailable/unprepared assets contribute zero. */
  function memoryBytes() {
    let bytes = 0;
    for (const entry of root.FrontierModelLibrary.list()) {
      const asset = root.FrontierModelLibrary.get(entry.id),
        state = textures.get(asset);
      for (const image of state?.pixels || []) bytes += image.data.byteLength;
    }
    return bytes;
  }
  /* @function model-renderer.gpuDiagnostics1523 — Inputs: active drawing context. Returns current room/preview GPU resource estimates or null when not allocated. Does not load resources or retain inactive contexts; diagnostic only. */
  function gpuDiagnostics1523(ctx) {
    return {
      worldGeometry: {
        entries: worldTriangleRetention1523.size,
        triangles: worldTriangleCount1523,
        maxTriangles: 200000,
        maxEntries: 128,
      },
      room: gpuRooms.get(ctx)?.backend?.diagnostics() || null,
      models: gpuModels.get(ctx)?.backend?.diagnostics() || null,
      preview: gpuPreviews.get(ctx)?.backend?.diagnostics() || null,
    };
  }
  /* @function model-renderer.previewReady1523 — Inputs: isolated door Canvas context. Returns non-blocking GPU warmup completion, or true for the CPU fallback. Throws backend fence failure; owns no map/input state. */
  function previewReady1523(ctx) {
    return gpuPreviews.get(ctx)?.backend?.warmupReady() ?? true;
  }
  root.FrontierModelRenderer = {
    previewReady: previewReady1523,
    draw,
    geometry,
    prepare,
    transform,
    visible,
    memoryBytes,
    gpuDiagnostics: gpuDiagnostics1523,
  };
})(window);
