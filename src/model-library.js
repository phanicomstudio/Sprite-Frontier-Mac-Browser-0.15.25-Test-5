/* Shared resource bundles, decoded once per revision. This boundary never
 * reads remote URLs. Importers supply every dependent file explicitly. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model library. */
(/* @function model-library.reviewed1 — Registers shared offline model-bundle ownership. Inputs: browser/global root. Returns nothing; creates ID-to-bundle/decoded caches and installs FrontierModelLibrary APIs. Import/decode runs only on explicit boundary calls; no network or render-time filesystem reads. */ function (
  root,
) {
  "use strict";
  const records = new Map(),
    cache = new Map();
  let revision = 0,
    exportRevision = -1,
    exportCache = null;
  const components = {
      5120: [1, "getInt8"],
      5121: [1, "getUint8"],
      5122: [2, "getInt16"],
      5123: [2, "getUint16"],
      5125: [4, "getUint32"],
      5126: [4, "getFloat32"],
    },
    widths = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.resource.2 — Handles resource within shared 3D assets. Inputs: bundle; uri. Uses: uri starts with; /^data:([^,]*?);base64,(.*)$/ exec; error; atob. Returns: uint8 array from using text, a callback; bundle files at p. */
  /* @function model-library.reviewed2 — Resolves bytes inside an explicit imported bundle. Inputs: bundle and glTF resource URI. Returns embedded base64 bytes or stored entry-relative bytes. Rejects unsupported data URIs, unsafe/missing local paths and malformed base64. Does not fetch a URL, mutate source bytes or resolve against the project root. */ function resource(
    bundle,
    uri,
  ) {
    if (uri.startsWith("data:")) {
      const match = /^data:([^,]*?);base64,(.*)$/.exec(uri);
      if (!match) throw Error("Only base64 embedded resources are supported");
      const text = atob(match[2]);
      return Uint8Array.from(
        text /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.3 — Returns c char code at using 0. Inputs: c. Uses: c char code at. Returns: c char code at using 0. */,
        /* @function model-library.reviewed3 — Converts one decoded base64 character to a byte. Inputs: binary-string character c. Returns its code unit 0..255 for Uint8Array construction; no external side effects. */ (
          c,
        ) => c.charCodeAt(0),
      );
    } // Resource URIs are relative to the glTF entry, not the project root.
    const relative = FrontierModelContainer.resourcePath(
        decodeURIComponent(uri),
      ),
      directory = bundle.entry.slice(0, bundle.entry.lastIndexOf("/") + 1),
      p = FrontierModelContainer.resourcePath(directory + relative);
    if (!bundle.files[p]) throw Error("Missing model resource: " + p);
    return bundle.files[p];
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.accessor.4 — Handles accessor within shared 3D assets. Inputs: json; buffers; index. Updates: n; out at i multiplied by width plus k. Uses: error; number is integer; view at spec at 1; number is finite. Returns: out. */
  /* @function model-library.reviewed4 — Decodes a glTF accessor into contiguous numeric data. Inputs: parsed JSON, explicit buffer byte arrays and accessor index. Returns Uint32Array for unnormalized unsigned-int accessors, otherwise Float32Array. Supports declared scalar/vector/matrix widths, little-endian stride/offset and integer normalization. Rejects sparse/unsupported/missing/out-of-bounds/nonfinite data or count above one million. Original buffers remain unchanged; coordinates retain source space. */ function accessor(
    json,
    buffers,
    index,
  ) {
    const a = json.accessors?.[index],
      v = json.bufferViews?.[a?.bufferView],
      spec = components[a?.componentType],
      width = widths[a?.type];
    if (!a || !v || !spec || !width || a.sparse)
      throw Error("Unsupported or invalid model accessor");
    const bytes = buffers[v.buffer];
    if (!bytes) throw Error("Missing accessor buffer");
    const stride = v.byteStride ?? spec[0] * width,
      start = (v.byteOffset || 0) + (a.byteOffset || 0);
    if (
      !Number.isInteger(a.count) ||
      a.count < 0 ||
      a.count > 1000000 ||
      stride < spec[0] * width ||
      start < 0 ||
      start + (a.count ? stride * (a.count - 1) + spec[0] * width : 0) >
        (v.byteOffset || 0) + v.byteLength ||
      start + (a.count ? stride * (a.count - 1) + spec[0] * width : 0) >
        bytes.length
    )
      throw Error("Accessor outside buffer bounds");
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength),
      out =
        a.componentType === 5125 && !a.normalized
          ? new Uint32Array(a.count * width)
          : new Float32Array(a.count * width);
    for (let i = 0; i < a.count; i++)
      for (let k = 0; k < width; k++) {
        let n = view[spec[1]](start + i * stride + k * spec[0], true);
        if (a.normalized) {
          if (a.componentType === 5120) n = Math.max(-1, n / 127);
          else if (a.componentType === 5121) n /= 255;
          else if (a.componentType === 5122) n = Math.max(-1, n / 32767);
          else if (a.componentType === 5123) n /= 65535;
          else throw Error("Unsupported normalized accessor");
        }
        if (!Number.isFinite(n)) throw Error("Nonfinite model coordinate");
        out[i * width + k] = n;
      }
    return out;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.decode.5 — Handles decode within shared 3D assets. Inputs: bundle. Uses: frontier model container parse; j buffers or a list of map; j meshes or a list of map; j images or a list of map. Returns: a record containing json, meshes, images, statistics. */
  /* @function model-library.reviewed5 — Decodes supported static model data without registering it. Inputs: complete bundle with entry and dependent bytes. Returns parsed JSON, primitive position/index/UV/normal arrays, image byte views and statistics. Rejects unsupported topology or missing/truncated/invalid resources. Does not perform network I/O, image pixel decoding or animation playback; scene compilation is a separate boundary. */ function decode(
    bundle,
  ) {
    const parsed = FrontierModelContainer.parse(bundle.files[bundle.entry]),
      j = parsed.json;
    const buffers = (j.buffers || []).map(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.6 — Provides the callback for j buffers or a list of map. Inputs: b; i. Uses: resource; error. Returns: bytes. */
      /* @function model-library.reviewed6 — Resolves one declared model buffer. Inputs: buffer declaration b and index i. Returns explicit URI bytes or first GLB binary chunk. Throws for unavailable/short bytes; never synthesizes missing resource contents or mutates the declaration. */ (
        b,
        i,
      ) => {
        const bytes = b.uri
          ? resource(bundle, b.uri)
          : i === 0
            ? parsed.binary
            : null;
        if (!bytes || bytes.length < b.byteLength)
          throw Error("Missing or truncated model buffer");
        return bytes;
      },
    );
    const meshes = (j.meshes || []).map(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.7 — Returns mesh primitives or a list of map using a callback. Inputs: mesh. Uses: mesh primitives or a list of map. Returns: mesh primitives or a list of map using a callback. */
      /* @function model-library.reviewed7 — Decodes a model mesh into its primitive list. Inputs: mesh declaration. Returns new primitive records through the captured decoder; unsupported data errors propagate. Does not register or render a mesh. */ (
        mesh,
      ) =>
        (mesh.primitives || []).map(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.8 — Provides the callback for mesh primitives or a list of map. Inputs: p. Uses: error; a list of 5121, 5123, 5125 includes; accessor; uint32 array from. Returns: a record containing positions, indices, uv, normals, material. */
          /* @function model-library.reviewed8 — Decodes one static triangle primitive. Inputs: primitive declaration p. Returns positions, triangle indices, optional UV/normals and material slot. Requires VEC3 positions and unsigned scalar triangle indices; rejects other topology, incomplete/out-of-range indices and invalid accessors. Sequential indices are generated only for nonindexed geometry. Does not alter source topology or collision. */ (
            p,
          ) => {
            if ((p.mode ?? 4) !== 4)
              throw Error("Only triangle primitives are currently supported");
            if (j.accessors?.[p.attributes?.POSITION]?.type !== "VEC3")
              throw Error("Model positions must be VEC3");
            if (p.indices !== undefined) {
              const indexAccessor = j.accessors?.[p.indices];
              if (
                !indexAccessor ||
                indexAccessor.type !== "SCALAR" ||
                ![5121, 5123, 5125].includes(indexAccessor.componentType) ||
                indexAccessor.normalized
              )
                throw Error(
                  "Triangle indices must be unsigned scalar integers",
                );
            }
            const positions = accessor(j, buffers, p.attributes.POSITION),
              indices =
                p.indices === undefined
                  ? Uint32Array.from(
                      {
                        length: positions.length / 3,
                      } /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.9 — Returns i. Inputs: ; i. Returns: i. */,
                      /* @function model-library.reviewed9 — Builds sequential indices for a nonindexed primitive. Inputs: unused source item and vertex index i. Returns i as the original vertex-order index, preserving triangle ordering. No outside mutation. */ (
                        _,
                        i,
                      ) => i,
                    )
                  : accessor(j, buffers, p.indices);
            if (
              indices.length % 3 ||
              [...indices].some(
                /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.10 — Returns the inverse of number is integer using v or v is less than 0 or v is at least positions length divided by 3. Inputs: v. Uses: number is integer. Returns: the inverse of number is integer using v or v is less than 0 or v is at least positions length divided by 3. */
                /* @function model-library.reviewed10 — Detects invalid triangle vertex references. Inputs: index v, with decoded position count captured. Returns true if noninteger, negative or beyond vertex count, causing enclosing decode to reject. No source mutation. */ (
                  v,
                ) => !Number.isInteger(v) || v < 0 || v >= positions.length / 3,
              )
            )
              throw Error("Invalid triangle indices");
            return {
              positions,
              indices,
              uv:
                p.attributes.TEXCOORD_0 === undefined
                  ? null
                  : accessor(j, buffers, p.attributes.TEXCOORD_0),
              normals:
                p.attributes.NORMAL === undefined
                  ? null
                  : accessor(j, buffers, p.attributes.NORMAL),
              material: p.material ?? null,
            };
          },
        ),
    );
    const images = (j.images || []).map(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.11 — Provides the callback for j images or a list of map. Inputs: image. Uses: resource; /\.jpe?g$/i test; error; buffers at v buffer subarray. Returns: a record containing bytes, mime; a record containing bytes, mime. */
      /* @function model-library.reviewed11 — Resolves encoded model image bytes. Inputs: image declaration. Returns byte/mime record from explicit resource URI or a bounded GLB buffer view. Rejects missing/out-of-range views. Does not decode RGBA pixels, modify alpha/material properties or fetch remote files. */ (
        image,
      ) => {
        if (image.uri)
          return {
            bytes: resource(bundle, image.uri),
            mime:
              image.mimeType ||
              (/\.jpe?g$/i.test(image.uri) ? "image/jpeg" : "image/png"),
          };
        const v = j.bufferViews?.[image.bufferView];
        if (
          !v ||
          !buffers[v.buffer] ||
          v.byteLength < 0 ||
          (v.byteOffset || 0) + v.byteLength > buffers[v.buffer].length
        )
          throw Error("Invalid model image buffer");
        return {
          bytes: buffers[v.buffer].subarray(
            v.byteOffset || 0,
            (v.byteOffset || 0) + v.byteLength,
          ),
          mime: image.mimeType,
        };
      },
    );
    return {
      json: j,
      meshes,
      images,
      statistics: FrontierModelContainer.statistics(j),
    };
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.importBundle.12 — Decodes and registers a model’s resource bundle under a shared asset identity. Inputs: value. Updates: total; files at p; decoded scene. Uses: /^[A-Za-z0-9_-]{1,60}$/ test; error; frontier model container resource path; object entries. Returns: a record containing copied fields, bytes, id. */
  /* @function model-library.reviewed12 — Imports and registers a complete model bundle. Inputs: stable ID/name/entry and dependent byte arrays. Returns decoded statistics plus total encoded bytes and ID. Copies/validates resource paths, limits bundle to 64 MiB, decodes and compiles source scene before replacing that asset ID. Failures propagate and leave existing asset records; revision may advance during an unsuccessful attempt. No remote fetching. */ function importBundle(
    value,
  ) {
    if (
      !value ||
      !/^[A-Za-z0-9_-]{1,60}$/.test(value.id) ||
      typeof value.name !== "string"
    )
      throw Error("Invalid model identity");
    const entry = FrontierModelContainer.resourcePath(value.entry),
      files = {};
    let total = 0;
    for (const [name, data] of Object.entries(value.files || {})) {
      const p = FrontierModelContainer.resourcePath(name),
        bytes =
          data instanceof Uint8Array
            ? new Uint8Array(data)
            : new Uint8Array(data);
      total += bytes.length;
      if (total > FrontierModelContainer.limits.maxBytes)
        throw Error("Model bundle exceeds 64 MiB");
      files[p] = bytes;
    }
    if (!files[entry]) throw Error("Model entry file missing");
    const bundle = {
        id: value.id,
        name: value.name.slice(0, 80),
        entry,
        files,
        revision: ++revision,
      },
      decoded = decode(bundle);
    if (root.FrontierModelScene)
      decoded.scene = root.FrontierModelScene.compile(decoded);
    records.set(bundle.id, bundle);
    cache.set(bundle.id, decoded);
    return { ...decoded.statistics, bytes: total, id: bundle.id };
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.get.13 — Handles get within shared 3D assets. Inputs: id. Uses: cache get. Returns: cache get using id or null. */
  /* @function model-library.reviewed13 — Looks up an already decoded shared asset. Inputs: stable model ID. Returns cached asset reference or null. Constant-time read, no decoding/allocation; callers must treat source geometry/material arrays as immutable. */ function get(
    id,
  ) {
    return cache.get(id) || null;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.list.14 — Handles list within shared 3D assets. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element map; records values. Returns: a list of spread element map using a callback. */
  /* @function model-library.reviewed14 — Lists shared asset metadata for pickers/diagnostics. Inputs: none. Returns new ID/name/entry/revision/statistics/encoded-byte records. Does not clone GLB data, decode images or make hidden assets render. Byte count describes encoded resources, not GPU allocation. */ function list() {
    return [...records.values()].map(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.15 — Returns a record containing id, name, entry, revision, copied fields, bytes. Inputs: b. Uses: cache get; object values using b files reduce; object values. Returns: a record containing id, name, entry, revision, copied fields, bytes. */
      /* @function model-library.reviewed15 — Builds one asset metadata row. Inputs: registered bundle b. Returns identity/revision plus decoded statistics and summed encoded byte count. Reads shared cache without mutating bundle or cloning its model arrays. */ (
        b,
      ) => ({
        id: b.id,
        name: b.name,
        entry: b.entry,
        revision: b.revision,
        ...cache.get(b.id).statistics,
        bytes: Object.values(b.files).reduce(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.16 — Returns n plus b length. Inputs: n; b. Returns: n plus b length. */
          /* @function model-library.reviewed16 — Sums encoded bundle bytes. Inputs: accumulated size n and byte array b. Returns n+b.length in bytes; no allocation or external mutation. */ (
            n,
            b,
          ) => n + b.length,
          0,
        ),
      }),
    );
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.exportBundles.17 — Handles export bundles within shared 3D assets. Inputs: no explicit arguments; uses enclosing module state. Updates: export revision; export cache. Uses: a list of spread element map; records values. Returns: export cache; assignment. */
  /* @function model-library.reviewed17 — Serializes shared bundles for portable project data. Inputs: none. Returns memoized base64 records, reusing them until library revision changes. Explicit boundary work converts bytes in chunks; not called per ordinary frame. Returned cached records must be treated read-only. No disk/network writes or source-byte changes. */ function exportBundles() {
    if (exportRevision === revision) return exportCache;
    exportRevision = revision;
    return (exportCache = [...records.values()].map(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.18 — Returns a record containing id, name, entry, files. Inputs: b. Uses: object from entries; object entries using b files map; object entries. Returns: a record containing id, name, entry, files. */
      /* @function model-library.reviewed18 — Builds one portable asset record. Inputs: registered bundle b. Returns stable ID/name/entry and base64 file map, omitting transient decode/revision cache. Only export boundary allocates encoded strings; source bundle remains unchanged. */ (
        b,
      ) => ({
        id: b.id,
        name: b.name,
        entry: b.entry,
        files: Object.fromEntries(
          Object.entries(b.files).map(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.19 — Provides the callback for object entries using b files map. Inputs: array pattern. Updates: i; s. Uses: string from char code; bytes subarray; btoa. Returns: a list of p, btoa using s. */
            /* @function model-library.reviewed19 — Encodes a resource for portable storage. Inputs: relative path and Uint8Array tuple. Returns path/base64 tuple; 8192-byte chunks avoid oversized spread calls. Does not write files or mutate bytes; invalid encoding errors propagate. */ ([
              p,
              bytes,
            ]) => {
              let s = "";
              for (let i = 0; i < bytes.length; i += 8192)
                s += String.fromCharCode(...bytes.subarray(i, i + 8192));
              return [p, btoa(s)];
            },
          ),
        ),
      }),
    ));
  }
  // Imported project data is staged first: a rejected bundle cannot wipe the
  // current library. Runtime integration calls replace only after validation.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.validateBundles.20 — current library. Runtime integration calls replace only after validation. Inputs: values. Uses: array is array; error; values map. Returns: values map using a callback. */
  /* @function model-library.reviewed20 — Stages a portable asset bank before adoption. Inputs: array of base64 bundle records. Returns validated bundle/decoded pairs without clearing existing library. Rejects over 256 models, duplicate/invalid IDs, invalid/missing paths/bytes, bundle above 64 MiB or aggregate above 128 MiB. Optional scene compiler runs in staging; caller owns commit. */ function validateBundles(
    values,
  ) {
    if (!Array.isArray(values) || values.length > 256)
      throw Error("Invalid model library");
    const ids = new Set();
    let total = 0;
    return values.map(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.21 — Provides the callback for values map. Inputs: v. Updates: bundle bytes; total; files at p; decoded scene. Uses: /^[A-Za-z0-9_-]{1,60}$/ test; ids has; error; ids add. Returns: a record containing bundle, decoded. */
      /* @function model-library.reviewed21 — Validates and decodes one staged bundle. Inputs: portable record v. Returns detached bundle and compiled decoded data. Tracks duplicate IDs and aggregate byte budget in the enclosing staging operation. Any error aborts staging without replacing shared bank; no source or filesystem mutation. */ (
        v,
      ) => {
        if (
          !v ||
          typeof v.id !== "string" ||
          !/^[A-Za-z0-9_-]{1,60}$/.test(v.id) ||
          typeof v.name !== "string" ||
          ids.has(v.id)
        )
          throw Error("Invalid or duplicate model ID");
        ids.add(v.id);
        const entry = FrontierModelContainer.resourcePath(v.entry),
          files = {};
        let bundleBytes = 0;
        for (const [name, b64] of Object.entries(v.files || {})) {
          const p = FrontierModelContainer.resourcePath(name);
          if (typeof b64 !== "string" || b64.length > 90000000)
            throw Error("Invalid encoded model resource");
          if (
            Math.floor((b64.length * 3) / 4) >
            FrontierModelContainer.limits.maxBytes + 2
          )
            throw Error("Model resource exceeds 64 MiB");
          const bytes = Uint8Array.from(
            atob(
              b64,
            ) /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.22 — Returns c char code at using 0. Inputs: c. Uses: c char code at. Returns: c char code at using 0. */,
            /* @function model-library.reviewed22 — Converts staged resource base64 characters to bytes. Inputs: decoded binary character c. Returns its code unit for an independent Uint8Array. No shared bank or original string mutation. */ (
              c,
            ) => c.charCodeAt(0),
          );
          bundleBytes += bytes.length;
          if (bundleBytes > FrontierModelContainer.limits.maxBytes)
            throw Error("Model bundle exceeds 64 MiB");
          total += bytes.length;
          if (total > 128 * 1024 * 1024)
            throw Error("Project model library exceeds 128 MiB");
          files[p] = bytes;
        }
        if (!files[entry]) throw Error("Model entry file missing");
        const bundle = { id: v.id, name: v.name.slice(0, 80), entry, files },
          decoded = decode(bundle);
        if (root.FrontierModelScene)
          decoded.scene = root.FrontierModelScene.compile(decoded);
        return { bundle, decoded };
      },
    );
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.restore.23 — Applies saved state to this system. Inputs: values. Updates: bundle revision. Uses: validate bundles; records clear; cache clear; records set. */
  /* @function model-library.reviewed23 — Atomically replaces the asset bank after validation. Inputs: complete portable bundle array. Returns nothing; stages all bundles first, then clears/installs records and decoded caches with new revisions. Validation failures retain old bank. Invalidates memoized exports through revision changes; does not render or save to disk. */ function restore(
    values,
  ) {
    const staged = validateBundles(values);
    records.clear();
    cache.clear();
    for (const { bundle, decoded } of staged) {
      bundle.revision = ++revision;
      records.set(bundle.id, bundle);
      cache.set(bundle.id, decoded);
    }
    revision++;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.merge.24 — Handles merge within shared 3D assets. Inputs: values. Updates: id. Uses: export bundles; current map; used has; json stringify. Returns: a record containing models, mapping. */
  /* @function model-library.reviewed24 — Merges imported assets without losing host identities. Inputs: incoming portable bundle array. Returns validated merged model records and old-to-new ID mapping. Reuses byte-identical same-ID records; conflicting content gets a new UUID. Reads memoized host export and stages whole candidate before caller adoption. Does not alter either source array or commit the merged bank. */ function merge(
    values,
  ) {
    const current = exportBundles(),
      used = new Map(
        current.map(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-library.callback.25 — Returns a list of v id, v. Inputs: v. Returns: a list of v id, v. */
          /* @function model-library.reviewed25 — Indexes an existing portable asset by stable ID. Inputs: host record v. Returns ID/record tuple; retains read-only record reference for equality/conflict checks. No source mutation. */ (
            v,
          ) => [v.id, v],
        ),
      ),
      mapping = new Map(),
      merged = [...current];
    for (const incoming of values) {
      let id = incoming.id;
      if (used.has(id)) {
        if (JSON.stringify(used.get(id)) === JSON.stringify(incoming)) {
          mapping.set(id, id);
          continue;
        }
        id = "model-" + crypto.randomUUID();
      }
      mapping.set(incoming.id, id);
      const item = { ...incoming, id };
      used.set(id, item);
      merged.push(item);
    }
    validateBundles(merged);
    return { models: merged, mapping };
  }
  root.FrontierModelLibrary = {
    importBundle,
    get,
    list,
    exportBundles,
    validateBundles,
    restore,
    merge,
    accessor,
    decodeStatic: decode,
  };
})(typeof window === "undefined" ? globalThis : window);
