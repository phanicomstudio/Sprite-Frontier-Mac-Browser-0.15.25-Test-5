/* October 13, 2026: per-instance glTF material-slot overrides. Source GLBs,
 * geometry, collision and authored UV arrays remain immutable. Overrides reuse
 * the room-surface image cache; their mapping uses repeats over original UVs,
 * not inferred world metres. Runtime/editor integration follows this contract. */
(/* @function modelMaterials.install — Inputs: browser/global root. Returns: nothing; installs pure validation/mapping and shared-image resolution helpers. No decoding, GPU allocation or source modification occurs at load. */ function (
  root,
) {
  "use strict";
  /* @function modelMaterials.validate — Inputs: optional slot-index dictionary. Returns: detached canonical overrides, or undefined for original materials. Up to 64 overridden slots (indices 0–255). Rejects unsafe paths, malformed colors/UV controls and payloads above 12 MiB before adoption. Coordinates are dimensionless native UV repeats; rotation is degrees. Source slots/UV existence is checked by the authoring owner against the selected asset. */
  function validate(value) {
    if (value === undefined) return undefined;
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value) ||
      Object.keys(value).length > 64
    )
      throw Error("Model materials require up to 64 slot overrides.");
    const result = {};
    let bytes = 0;
    for (const [slot, record] of Object.entries(value)) {
      if (
        !/^(0|[1-9][0-9]{0,2})$/.test(slot) ||
        Number(slot) > 255 ||
        !record ||
        typeof record !== "object" ||
        Array.isArray(record)
      )
        throw Error("Invalid model material slot.");
      const texture = record.texture;
      if (texture !== undefined) {
        if (
          typeof texture !== "string" ||
          !texture ||
          texture.length > 12 * 1024 * 1024
        )
          throw Error("Invalid model material image.");
        const embedded =
            /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(
              texture,
            ),
          local =
            /^[A-Za-z0-9_-][A-Za-z0-9_./ -]*$/.test(texture) &&
            !texture.split("/").includes("..");
        if (!embedded && !local)
          throw Error(
            "Model material image must be a project image or embedded PNG/JPEG/WebP.",
          );
        bytes += texture.length;
      }
      if (record.color !== undefined && !/^#[0-9a-f]{6}$/i.test(record.color))
        throw Error("Model material tint must be a six-digit color.");
      const normalized = {
        repeatU: record.repeatU ?? 1,
        repeatV: record.repeatV ?? 1,
        offsetU: record.offsetU ?? 0,
        offsetV: record.offsetV ?? 0,
        rotation: record.rotation ?? 0,
        preserveAspect: record.preserveAspect ?? false,
      };
      if (typeof normalized.preserveAspect !== "boolean")
        throw Error("Model material aspect option must be Boolean.");
      for (const key of ["repeatU", "repeatV"])
        if (
          !Number.isFinite(normalized[key]) ||
          normalized[key] < 0.001 ||
          normalized[key] > 1000
        )
          throw Error("Model texture repeats must be 0.001–1,000.");
      for (const key of ["offsetU", "offsetV", "rotation"])
        if (
          !Number.isFinite(normalized[key]) ||
          Math.abs(normalized[key]) > 10000
        )
          throw Error(
            "Model UV offsets/rotation must be finite within ±10,000.",
          );
      result[slot] = {
        ...normalized,
        ...(texture === undefined ? {} : { texture }),
        ...(record.color === undefined ? {} : { color: record.color }),
      };
    }
    if (bytes > 12 * 1024 * 1024)
      throw Error("Model material images exceed 12 MiB per instance.");
    return result;
  }
  /* @function modelMaterials.mapping — Inputs: validated optional slot override and optional original decoded image for aspect calculation. Returns: precomputed UV coefficients and shared image (null while loading). Texture reads use the existing bounded-dimension surface cache; no source image copy or geometry mutation. Original texture is retained when texture is absent. */
  function mapping(override, originalImage) {
    if (!override) return null;
    const image = override.texture
        ? root.FrontierRoomSurfaces.get(override.texture)
        : originalImage || null,
      angle = (override.rotation * Math.PI) / 180;
    return {
      override,
      image,
      cos: Math.cos(angle),
      sin: Math.sin(angle),
      aspect: override.preserveAspect && image ? image.width / image.height : 1,
    };
  }
  /* @function modelMaterials.uv — Inputs: precomputed optional mapping and immutable original two-component UV. Returns: new transformed UV pair, or the original pair for inheritance. Scale, optional image aspect, degree rotation and offsets apply in that order. Does not overwrite source UV arrays; unknown geometry dimensions are deliberately not inferred. */
  function uv(map, value) {
    if (!map) return value;
    const config = map.override,
      u = value[0] * config.repeatU,
      v = value[1] * config.repeatV * map.aspect;
    return [
      u * map.cos - v * map.sin + config.offsetU,
      u * map.sin + v * map.cos + config.offsetV,
    ];
  }
  /* @function modelMaterials.tint — Inputs: optional validated hexadecimal tint and original glTF RGBA factor. Returns: original factor for inheritance or new RGB override retaining original alpha. No alpha mode/collision change; source factor is never mutated. */
  function tint(color, factor) {
    if (!color) return factor;
    const n = parseInt(color.slice(1), 16);
    return [
      ((n >> 16) & 255) / 255,
      ((n >> 8) & 255) / 255,
      (n & 255) / 255,
      factor[3],
    ];
  }
  /* @function modelMaterials.prepare — Inputs: destination authored world. Returns: nothing; starts shared asynchronous decoding for requested instance textures before door playback. No map switch, geometry clone or duplicate decoded pixels. Existing surface cache reports explicit failures. */
  function prepare(world) {
    for (const event of world.events || []) {
      if (!event.spatial?.materials) continue;
      for (const record of Object.values(event.spatial.materials))
        if (record.texture) root.FrontierRoomSurfaces.get(record.texture);
    }
  }
  /* @function modelMaterials.ready — Inputs: destination world. Returns: whether every requested instance image decoded or explicitly failed. Read-only status checks start no loads and permit existing failure fallback; called under transition readiness cover. */
  function ready(world) {
    for (const event of world.events || []) {
      if (!event.spatial?.materials) continue;
      for (const record of Object.values(event.spatial.materials))
        if (record.texture) {
          const status = root.FrontierRoomSurfaces.status(record.texture);
          if (!status.ready && !status.failed) return false;
        }
    }
    return true;
  }
  /* @function modelMaterials.checkSlots — Inputs: validated optional overrides and staged decoded source asset. Returns: nothing; rejects nonexistent material slots or texture/mapping changes on primitives without source UVs. Tint-only changes remain valid without UVs. Called at project adoption, not each frame; does not mutate source models or infer planar UVs. */
  function checkSlots(overrides, asset) {
    if (!overrides) return;
    for (const [slot, record] of Object.entries(overrides)) {
      if (!asset?.json.materials?.[slot])
        throw Error("Missing model material slot: " + slot);
      const needsUV =
        record.texture !== undefined ||
        record.repeatU !== 1 ||
        record.repeatV !== 1 ||
        record.offsetU !== 0 ||
        record.offsetV !== 0 ||
        record.rotation !== 0 ||
        record.preserveAspect;
      for (const primitives of asset.meshes)
        for (const primitive of primitives)
          if (primitive.material === Number(slot) && needsUV && !primitive.uv)
            throw Error(
              "Model material slot " + slot + " needs authored UV coordinates.",
            );
    }
  }
  root.FrontierModelMaterials = {
    validate,
    mapping,
    uv,
    tint,
    prepare,
    ready,
    checkSlots,
  };
})(typeof window === "undefined" ? globalThis : window);
