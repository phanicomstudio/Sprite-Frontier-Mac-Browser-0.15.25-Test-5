/* Shared model/volume transform math. Engine axes are X/Y horizontal, Z up.
 * Matrices are column-major. Composition is translation * Rz * Ry * Rx * scale.
 * Ray directions deliberately remain unnormalized after inverse transformation:
 * this preserves world-ray distance under nonuniform parent scaling. */
/* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model transform. */
(/* @function modelTransform.reviewed1 — Installs shared model transform math. Inputs: browser/global root. Returns nothing; registers FrontierModelTransform once without allocating geometry or creating UI. Engine X/Y are horizontal metres and Z is up; matrices are affine and column-major. */ function (
  root,
) {
  "use strict";
  const identity =
    /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.identity.2 — Returns a list of 1, 0, 0, 0. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of 1, 0, 0, 0. */
    /* @function modelTransform.reviewed2 — Creates a fresh identity matrix. Inputs: none. Returns a mutable 16-number column-major affine matrix; caller edits cannot affect any other transform. No external side effects. */ () => [
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    ];
  /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.multiply.3 — Composes two transforms in the order defined by this module. Inputs: a; b. Updates: c at col multiplied by 4 plus row. Uses: a new array fill. Returns: c. */
  /* @function modelTransform.reviewed3 — Composes affine transforms. Inputs: two 16-number column-major matrices a and b. Returns a new matrix a*b, meaning b is applied before a. Does not validate or mutate either matrix; callers supply finite valid transforms. */ function multiply(
    a,
    b,
  ) {
    const c = new Array(16).fill(0);
    for (let col = 0; col < 4; col++)
      for (let row = 0; row < 4; row++)
        for (let k = 0; k < 4; k++)
          c[col * 4 + row] += a[k * 4 + row] * b[col * 4 + k];
    return c;
  }
  /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.vector.4 — Transforms a point or direction using the provided matrix. Inputs: m; p; assignment pattern. Uses: a list of 0, 1, 2 map. Returns: a list of 0, 1, 2 map using a callback. */
  /* @function modelTransform.reviewed4 — Transforms a coordinate. Inputs: affine matrix m, three-number coordinate p, homogeneous weight w (1 for points, 0 for directions). Returns a new XYZ vector; translation affects points only. Does not normalize directions, preserving world ray distance under nonuniform scale. No source mutation. */ function vector(
    m,
    p,
    w = 1,
  ) {
    return [0, 1, 2].map(
      /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.callback.5 — Returns m at r multiplied by p at 0 plus m at 4 plus r multiplied by p at 1 plus m at 8 plus r multiplied by p at 2 plus m at 12 plus r multiplied by w. Inputs: r. Returns: m at r multiplied by p at 0 plus m at 4 plus r multiplied by p at 1 plus m at 8 plus r multiplied by p at 2 plus m at 12 plus r multiplied by w. */
      /* @function modelTransform.reviewed5 — Calculates one output coordinate of the matrix/vector product. Inputs: output-axis index r (0..2), with validated matrix/vector and homogeneous weight captured. Returns that finite coordinate in the destination space; no mutation or normalization. */ (
        r,
      ) => m[r] * p[0] + m[4 + r] * p[1] + m[8 + r] * p[2] + m[12 + r] * w,
    );
  }
  /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.validate.6 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: read; out scale some; error. Returns: out. */
  /* @function modelTransform.reviewed6 — Normalizes an authored local transform. Inputs: optional position/rotation/scale record. Returns detached XYZ arrays with defaults zero metres, zero degrees and unit scale. Rejects malformed/nonfinite triples or scale outside 0.001..1000. Input records remain unchanged; mirrored negative scale is deliberately unsupported. */ function validate(
    t = {},
  ) {
    const read =
      /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.read.7 — Handles read within model transform. Inputs: key; fallback. Uses: array is array; v every; error. Returns: a list of spread element. */
      /* @function modelTransform.reviewed7 — Reads one authored transform triple. Inputs: field key and default three-number array, with source transform captured. Returns a detached array. Throws for a non-array, wrong length or nonfinite element; never aliases input/default arrays. */ (
        key,
        fallback,
      ) => {
        const v = t[key] ?? fallback;
        if (!Array.isArray(v) || v.length !== 3 || !v.every(Number.isFinite))
          throw Error("Invalid model " + key);
        return [...v];
      };
    const out = {
      position: read("position", [0, 0, 0]),
      rotation: read("rotation", [0, 0, 0]),
      scale: read("scale", [1, 1, 1]),
    };
    if (
      out.scale.some(
        /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.callback.8 — Returns v is less than 0.001 or v is greater than 1000. Inputs: v. Returns: v is less than 0.001 or v is greater than 1000. */
        /* @function modelTransform.reviewed8 — Checks a model scale component against the supported positive bounds. Inputs: component v. Returns true outside 0.001..1000, causing enclosing validation to reject; no mutation. Keeps inverse transforms nonsingular and bounds predictable. */ (
          v,
        ) => v < 0.001 || v > 1000,
      )
    )
      throw Error("Model scale must be 0.001–1000");
    return out;
  }
  /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.matrix.9 — Handles matrix within model transform. Inputs: value. Updates: s at 0; s at 5; s at 10; out at 12; out at 13. Uses: validate; t rotation map; identity; multiply. Returns: out. */
  /* @function modelTransform.reviewed9 — Builds the engine transform matrix. Inputs: authored local transform (metres, XYZ Euler degrees, positive scale). Returns translation*Rz*Ry*Rx*scale in column-major form. Validates first and propagates invalid data errors. Neither source arrays nor shared identity matrices are modified. */ function matrix(
    value,
  ) {
    const t = validate(value),
      [x, y, z] = t.rotation.map(
        /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.callback.10 — Returns v multiplied by math pi divided by 180. Inputs: v. Returns: v multiplied by math pi divided by 180. */
        /* @function modelTransform.reviewed10 — Converts an authored Euler angle to radians for matrix construction. Inputs: finite degree value v. Returns radians, without state changes; this boundary prevents mixing editor degrees with trigonometric radians. */ (
          v,
        ) => (v * Math.PI) / 180,
      ),
      cx = Math.cos(x),
      sx = Math.sin(x),
      cy = Math.cos(y),
      sy = Math.sin(y),
      cz = Math.cos(z),
      sz = Math.sin(z);
    const rx = [1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1],
      ry = [cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1],
      rz = [cz, sz, 0, 0, -sz, cz, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      s = identity();
    s[0] = t.scale[0];
    s[5] = t.scale[1];
    s[10] = t.scale[2];
    const out = multiply(multiply(multiply(rz, ry), rx), s);
    out[12] = t.position[0];
    out[13] = t.position[1];
    out[14] = t.position[2];
    return out;
  }
  /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.inverse.11 — Computes the inverse transform used to convert world queries into local coordinates. Inputs: m. Updates: out at 12; out at 13; out at 14. Uses: error; vector. Returns: out. */
  /* @function modelTransform.reviewed11 — Inverts an affine matrix for local-space queries. Inputs: finite nonsingular 16-number matrix m. Returns a new inverse including translation. Throws when absolute linear determinant is below 1e-12; supports nonuniform scales but not projective matrices. Does not mutate m. */ function inverse(
    m,
  ) {
    const a = m[0],
      b = m[4],
      c = m[8],
      d = m[1],
      e = m[5],
      f = m[9],
      g = m[2],
      h = m[6],
      i = m[10],
      det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    if (Math.abs(det) < 1e-12) throw Error("Singular model transform");
    const out = [
        (e * i - f * h) / det,
        (f * g - d * i) / det,
        (d * h - e * g) / det,
        0,
        (c * h - b * i) / det,
        (a * i - c * g) / det,
        (b * g - a * h) / det,
        0,
        (b * f - c * e) / det,
        (c * d - a * f) / det,
        (a * e - b * d) / det,
        0,
        0,
        0,
        0,
        1,
      ],
      offset = vector(out, [m[12], m[13], m[14]], 0);
    out[12] = -offset[0];
    out[13] = -offset[1];
    out[14] = -offset[2];
    return out;
  }
  // A box has a local transform and positive full dimensions. Parent may be a
  // model transform or identity for an independent invisible event volume.
  /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.box.12 — model transform or identity for an independent invisible event volume. Inputs: value. Uses: /^[A-Za-z0-9_-]{1,60}$/ test; error; array is array; size every. Returns: a record containing id, name, size, transform. */
  /* @function modelTransform.reviewed12 — Validates an invisible oriented box volume. Inputs: record with stable ID, optional name, full local XYZ dimensions in metres and local transform. Returns detached normalized volume, bounding name to 80 characters. Rejects invalid ID, nonfinite/nonpositive sizes or sizes above 1000; preserves original record. */ function box(
    value,
  ) {
    if (
      !value ||
      typeof value.id !== "string" ||
      !/^[A-Za-z0-9_-]{1,60}$/.test(value.id)
    )
      throw Error("Invalid zone ID");
    const size = value.size;
    if (
      !Array.isArray(size) ||
      size.length !== 3 ||
      !size.every(
        /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.callback.13 — Returns number is finite using v and v is greater than 0 and v is at most 1000. Inputs: v. Uses: number is finite. Returns: number is finite using v and v is greater than 0 and v is at most 1000. */
        /* @function modelTransform.reviewed13 — Checks one full box dimension. Inputs: numeric dimension v in local metres. Returns true only for a finite size greater than zero and at most 1000. No mutation; enclosing volume validation rejects any false component. */ (
          v,
        ) => Number.isFinite(v) && v > 0 && v <= 1000,
      )
    )
      throw Error("Invalid box dimensions");
    return {
      id: value.id,
      name: String(value.name || value.id).slice(0, 80),
      size: [...size],
      transform: validate(value.transform),
    };
  }
  /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.rayBox.14 — Handles ray box within model transform. Inputs: origin; direction; value; assignment pattern; assignment pattern. Updates: array pattern; enter; exit. Uses: box; inverse; multiply; matrix. Returns: null; null. */
  /* @function modelTransform.reviewed14 — Intersects a world-space ray with an oriented box. Inputs: origin, direction, authored volume, optional affine parent and maximum ray distance. Returns first nonnegative ray parameter or null when outside the slab intersection/range. A unit world direction yields metres; inverse-transformed directions stay unnormalized. Invalid volume/singular transforms throw; inputs are unchanged. */ function rayBox(
    origin,
    direction,
    value,
    parent = identity(),
    maxDistance = Infinity,
  ) {
    const b = box(value),
      inv = inverse(multiply(parent, matrix(b.transform))),
      o = vector(inv, origin),
      d = vector(inv, direction, 0);
    let enter = 0,
      exit = maxDistance;
    for (let axis = 0; axis < 3; axis++) {
      const half = b.size[axis] / 2;
      if (Math.abs(d[axis]) < 1e-12) {
        if (o[axis] < -half || o[axis] > half) return null;
        continue;
      }
      let lo = (-half - o[axis]) / d[axis],
        hi = (half - o[axis]) / d[axis];
      if (lo > hi) [lo, hi] = [hi, lo];
      enter = Math.max(enter, lo);
      exit = Math.min(exit, hi);
      if (enter > exit) return null;
    }
    return enter;
  }
  /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.contains.15 — Handles contains within model transform. Inputs: point; value; assignment pattern. Uses: box; vector; inverse; multiply. Returns: p every using a callback. */
  /* @function modelTransform.reviewed15 — Tests whether a world point lies in an oriented box. Inputs: XYZ point, authored volume and optional affine parent matrix. Returns Boolean using local full dimensions and 1e-9 tolerance. Validates volume/inversion and propagates errors. No geometry or scene mutation. */ function contains(
    point,
    value,
    parent = identity(),
  ) {
    const b = box(value),
      p = vector(inverse(multiply(parent, matrix(b.transform))), point);
    return p.every(
      /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.callback.16 — Returns math abs using v is at most b size at i divided by 2 plus 1e-9. Inputs: v; i. Returns: math abs using v is at most b size at i divided by 2 plus 1e-9. */
      /* @function modelTransform.reviewed16 — Checks the transformed point against one local half-size. Inputs: coordinate v and axis index i, with normalized volume captured. Returns inclusive containment with 1e-9 local tolerance. No external mutation. */ (
        v,
        i,
      ) => Math.abs(v) <= b.size[i] / 2 + 1e-9,
    );
  }
  /* Historical contract retained; October 13, 2026 reviewed explanation follows. @function model-transform.corners.17 — Handles corners within model transform. Inputs: value; assignment pattern. Uses: box; multiply; matrix; out push. Returns: out. */
  /* @function modelTransform.reviewed17 — Enumerates transformed box vertices for visualization/bounds. Inputs: authored box and optional parent matrix. Returns eight new XYZ points in parent destination space, in stable nested sign order. Invalid box/inversion data errors propagate from validation; source volume and parent remain unchanged. */ function corners(
    value,
    parent = identity(),
  ) {
    const b = box(value),
      m = multiply(parent, matrix(b.transform)),
      out = [];
    for (const x of [-1, 1])
      for (const y of [-1, 1])
        for (const z of [-1, 1])
          out.push(
            vector(m, [
              (x * b.size[0]) / 2,
              (y * b.size[1]) / 2,
              (z * b.size[2]) / 2,
            ]),
          );
    return out;
  }
  root.FrontierModelTransform = {
    identity,
    multiply,
    vector,
    validate,
    matrix,
    inverse,
    box,
    rayBox,
    contains,
    corners,
  };
})(typeof window === "undefined" ? globalThis : window);
