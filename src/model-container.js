/* glTF/GLB container boundary. Parsing is separate from rendering and storage.
 * Imported resources stay in a named asset bundle; events store only its ID.
 * Based on Khronos glTF 2.0 container specification. No network fetching occurs. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-container.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model container. */
(/* @function model-container.reviewed1 — Registers the glTF/GLB container boundary. Inputs: browser/global root. Returns nothing; installs parser/path/statistics APIs and 64 MiB import limit. Creates shared TextDecoder only, with no rendering/storage/network work. */ function (
  root,
) {
  "use strict";
  const MAX_BYTES = 64 * 1024 * 1024,
    decoder = new TextDecoder();
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-container.document.2 — Handles document within model container. Inputs: value. Uses: error; value extensions required join. Returns: value. */
  /* @function model-container.reviewed2 — Checks supported glTF document version/extensions. Inputs: parsed JSON value. Returns the same document for glTF 2.0 with no required extensions. Throws otherwise; required-extension decoding is unsupported here. No mutation or registration of the model. */ function document(
    value,
  ) {
    if (!value || value.asset?.version !== "2.0")
      throw Error("Only glTF 2.0 models are supported");
    if (value.extensionsRequired?.length)
      throw Error(
        "Required glTF extensions need a registered decoder: " +
          value.extensionsRequired.join(", "),
      );
    return value;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-container.parse.3 — Handles parse within model container. Inputs: bytes. Updates: offset; json; binary. Uses: error; view get uint32; document; json parse. Returns: a record containing json, binary; a record containing json, binary. */
  /* @function model-container.reviewed3 — Parses explicit glTF JSON or GLB bytes. Inputs: Uint8Array or array-buffer-compatible bytes. Returns JSON and optional binary chunk view. Enforces 64 MiB, GLB v2 exact length, aligned bounded chunks, first JSON chunk and no duplicate JSON/BIN. Rejects malformed JSON/document. Does not copy all GLB data, fetch dependencies or evaluate scripts. */ function parse(
    bytes,
  ) {
    const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    if (data.byteLength > MAX_BYTES)
      throw Error("Model exceeds 64 MiB import budget");
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    if (data.byteLength < 4 || view.getUint32(0, true) !== 0x46546c67)
      return { json: document(JSON.parse(decoder.decode(data))), binary: null };
    if (
      data.byteLength < 20 ||
      view.getUint32(4, true) !== 2 ||
      view.getUint32(8, true) !== data.byteLength
    )
      throw Error("Invalid GLB header");
    let offset = 12,
      json,
      binary = null,
      chunk = 0;
    while (offset < data.byteLength) {
      if (offset + 8 > data.byteLength) throw Error("Truncated GLB chunk");
      const size = view.getUint32(offset, true),
        type = view.getUint32(offset + 4, true);
      offset += 8;
      if (size % 4 || offset + size > data.byteLength)
        throw Error("Invalid GLB chunk length");
      const payload = data.subarray(offset, offset + size);
      if (chunk === 0 && type !== 0x4e4f534a)
        throw Error("GLB must begin with JSON");
      if (type === 0x4e4f534a) {
        if (json) throw Error("Duplicate GLB JSON");
        json = JSON.parse(decoder.decode(payload));
      } else if (type === 0x004e4942) {
        if (binary) throw Error("Duplicate GLB binary");
        binary = payload;
      }
      offset += size;
      chunk++;
    }
    return { json: document(json), binary };
  }
  // Canonical relative bundle paths protect portable exports against traversal.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-container.resourcePath.4 — Canonical relative bundle paths protect portable exports against traversal. Inputs: value. Uses: value includes; value starts with; /^[a-z]+:/i test; error. Returns: value. */
  /* @function model-container.reviewed4 — Validates a canonical portable bundle-relative path. Inputs: path string. Returns unchanged safe slash-separated path. Rejects empty paths, backslashes, absolute/protocol prefixes and empty/dot/dot-dot components. No filesystem lookup, URI fetch or source mutation. */ function resourcePath(
    value,
  ) {
    if (
      typeof value !== "string" ||
      !value ||
      value.includes("\\") ||
      value.startsWith("/") ||
      /^[a-z]+:/i.test(value)
    )
      throw Error("Model resources must use relative bundle paths");
    const parts = value.split("/");
    if (
      parts.some(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-container.callback.5 — Returns the inverse of p or p equals "." or p equals "..". Inputs: p. Returns: the inverse of p or p equals "." or p equals "..". */
        /* @function model-container.reviewed5 — Rejects noncanonical path segments. Inputs: segment p. Returns true for empty, dot or dot-dot, causing the enclosing bundle path check to throw. No file operations. */ (
          p,
        ) => !p || p === "." || p === "..",
      )
    )
      throw Error("Invalid model resource path");
    return value;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-container.statistics.6 — Handles statistics within model container. Inputs: json. Updates: vertices; triangles. Uses: number is integer; error. Returns: a record containing triangles, vertices, primitives, materials, images, animated, skinned. */
  /* @function model-container.reviewed6 — Counts supported static model geometry. Inputs: parsed glTF JSON. Returns triangles/vertices/primitives/materials/images and Boolean animated/skinned metadata. Requires valid VEC3 position counts and complete triangle index counts; other topology/errors throw. Animation/skinning flags report source content rather than promising runtime playback. No image decode or geometry mutation. */ function statistics(
    json,
  ) {
    let triangles = 0,
      vertices = 0,
      primitives = 0;
    for (const mesh of json.meshes || [])
      for (const p of mesh.primitives || []) {
        const position = json.accessors?.[p.attributes?.POSITION];
        if (
          !position ||
          position.type !== "VEC3" ||
          !Number.isInteger(position.count) ||
          position.count < 0
        )
          throw Error("Invalid model position accessor");
        const count =
          p.indices === undefined
            ? position.count
            : json.accessors?.[p.indices]?.count;
        if (!Number.isInteger(count) || count < 0)
          throw Error("Invalid model index accessor");
        const mode = p.mode ?? 4;
        if (mode !== 4)
          throw Error("Initial model renderer requires triangle primitives");
        if (count % 3)
          throw Error("Triangle primitive has incomplete triangle");
        vertices += position.count;
        triangles += count / 3;
        primitives++;
      }
    return {
      triangles,
      vertices,
      primitives,
      materials: json.materials?.length || 0,
      images: json.images?.length || 0,
      animated: !!json.animations?.length,
      skinned: !!json.skins?.length,
    };
  }
  root.FrontierModelContainer = {
    parse,
    resourcePath,
    statistics,
    limits: { maxBytes: MAX_BYTES },
  };
})(typeof window === "undefined" ? globalThis : window);
