/* Decode static glTF scene hierarchy into reusable mesh instances. A node's
 * mesh remains shared; only its matrix differs. Engine is Z-up, glTF is Y-up.
 * Animated/skinned assets are rejected explicitly until animation is wired. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-scene.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model scene. */
(/* @function model-scene.installReviewed — Installs static glTF scene compilation with shared source meshes and instance matrices. Source Y-up converts to engine Z-up at this boundary; unsupported animated/skinned scenes reject explicitly. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function model-scene.nodeMatrix.2 — Handles node matrix within model scene. Inputs: node. Updates: m at col multiplied by 4 plus row. Uses: error; array is array; node matrix every; a list of spread element, spread element, spread element every. Returns: a list of spread element; m. */
  /* @function modelScene.reviewednodeMatrix_2 — Builds source glTF node affine transform. Inputs: node with matrix or TRS. Returns new16-element column-major matrix in source Y-up coordinates. Rejects matrix+TRS, nonfinite/nonaffine matrix, wrong TRS lengths, nearzero scale and quaternion length outside1±0.001; missing TRS defaults identity. Scale multiplies rotation columns, translation source metres. No node mutation; transform service required. */ function nodeMatrix(
    node,
  ) {
    const T = FrontierModelTransform;
    if (node.matrix !== undefined) {
      if (node.translation || node.rotation || node.scale)
        throw Error("glTF node cannot combine matrix and TRS");
      if (
        !Array.isArray(node.matrix) ||
        node.matrix.length !== 16 ||
        !node.matrix.every(Number.isFinite) ||
        node.matrix[3] !== 0 ||
        node.matrix[7] !== 0 ||
        node.matrix[11] !== 0 ||
        node.matrix[15] !== 1
      )
        throw Error("Invalid glTF node matrix");
      return [...node.matrix];
    }
    const t = node.translation ?? [0, 0, 0],
      q = node.rotation ?? [0, 0, 0, 1],
      s = node.scale ?? [1, 1, 1];
    if (
      t.length !== 3 ||
      q.length !== 4 ||
      s.length !== 3 ||
      ![...t, ...q, ...s].every(Number.isFinite) ||
      s.some(
        /* Historical contract retained; October 14 reviewed explanation follows. @function model-scene.callback.3 — Returns math abs using v is less than 1e-9. Inputs: v. Returns: math abs using v is less than 1e-9. */
  /* @function modelScene.reviewedcallback_3 — Detects singular source scale component. Inputs: v. Returns abs(v)<1e-9; no mutation. Negative nonzero scale supported. */ (
          v,
        ) => Math.abs(v) < 1e-9,
      )
    )
      throw Error("Invalid glTF node TRS");
    const length = Math.hypot(...q);
    if (Math.abs(length - 1) > 1e-3)
      throw Error("glTF rotation must be a unit quaternion");
    const [x, y, z, w] = q,
      m = [
        1 - 2 * (y * y + z * z),
        2 * (x * y + z * w),
        2 * (x * z - y * w),
        0,
        2 * (x * y - z * w),
        1 - 2 * (x * x + z * z),
        2 * (y * z + x * w),
        0,
        2 * (x * z + y * w),
        2 * (y * z - x * w),
        1 - 2 * (x * x + y * y),
        0,
        ...t,
        1,
      ];
    for (let col = 0; col < 3; col++)
      for (let row = 0; row < 3; row++) m[col * 4 + row] *= s[col];
    return m;
  }
  const conversion = [1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1];
  /* Historical contract retained; October 14 reviewed explanation follows. @function model-scene.compile.4 — Handles compile within model scene. Inputs: asset. Uses: error; visit; t identity. Returns: a record containing instances, bounds. */
  /* @function modelScene.reviewedcompile_4 — Compiles static selected glTF scene into shared mesh instances and engine bounds. Inputs: decoded asset with json/meshes. Returns instances with source node IDs/names/mesh indices and engine matrices plus XYZ min/max. Rejects skins/animations, missing scene/mesh, cyclic/multiply-parented nodes, hierarchy depth>128 or no mesh instances. Converts source(x,y,z) to engine(x,-z,y) Z-up once per compiled instance. No source mutation; local traversal allocations/errors propagate. */ function compile(
    asset,
  ) {
    const T = FrontierModelTransform,
      j = asset.json;
    if (j.skins?.length || j.animations?.length)
      throw Error(
        "Animated/skinned models are not supported in this iteration",
      );
    const nodes = j.nodes || [],
      scene = j.scenes?.[j.scene ?? 0];
    if (!scene) throw Error("Model requires a glTF scene");
    const instances = [],
      seen = new Set(),
      active = new Set(),
      bounds = {
        min: [Infinity, Infinity, Infinity],
        max: [-Infinity, -Infinity, -Infinity],
      };
    /* Historical contract retained; October 14 reviewed explanation follows. @function model-scene.visit.5 — Handles visit within model scene. Inputs: index; parent; depth. Updates: i; bounds min at k; bounds max at k. Uses: number is integer; error; active has; seen has. */
  /* @function modelScene.reviewedvisit_5 — Traverses one selected scene node and children. Inputs: node index, parent source matrix and hierarchy depth. Returns undefined; validates identity/depth/unique parent, composes source local matrix, records engine-converted instance and bounds of transformed positions, then recurses. Mutates only local seen/active/instances/bounds. Invalid hierarchy/mesh/transform throws; no asset rewrite. */ function visit(
      index,
      parent,
      depth,
    ) {
      if (!Number.isInteger(index) || !nodes[index] || depth > 128)
        throw Error("Invalid model node hierarchy");
      if (active.has(index) || seen.has(index))
        throw Error("Cyclic or multiply parented model node");
      active.add(index);
      seen.add(index);
      const node = nodes[index],
        matrix = T.multiply(parent, nodeMatrix(node));
      if (node.mesh !== undefined) {
        const mesh = asset.meshes[node.mesh];
        if (!mesh) throw Error("Invalid model mesh reference");
        const engineMatrix = T.multiply(conversion, matrix);
        instances.push({
          node: index,
          name: node.name || "Part " + index,
          mesh: node.mesh,
          matrix: engineMatrix,
        });
        for (const primitive of mesh)
          for (let i = 0; i < primitive.positions.length; i += 3) {
            const p = T.vector(
              engineMatrix,
              primitive.positions.subarray(i, i + 3),
            );
            for (let k = 0; k < 3; k++) {
              bounds.min[k] = Math.min(bounds.min[k], p[k]);
              bounds.max[k] = Math.max(bounds.max[k], p[k]);
            }
          }
      }
      for (const child of node.children || []) visit(child, matrix, depth + 1);
      active.delete(index);
    }
    for (const index of scene.nodes || []) visit(index, T.identity(), 0);
    if (!instances.length) throw Error("Model scene has no mesh");
    return { instances, bounds };
  }
  // Iterator feeds both rendering and triangle occlusion tests, guaranteeing
  // imported node transforms cannot differ between visibility and picking.
  /* @function model-scene.triangles.6 — imported node transforms cannot differ between visibility and picking. Inputs: asset; scene; parent; callback. Updates: i. Uses: t multiply; a list of 0, 1, 2 map; callback. */ /* @function model-scene.trianglesReuse1523 — Inputs: decoded asset, compiled scene, parent matrix, triangle callback and optional reusePoints. Returns nothing; calls callback in unchanged primitive/index order. Transforms are local-to-world engine units. October 12, 2026: optional reusePoints caches transformed vertex arrays only within this traversal. Rendering opts in with read-only callbacks; legacy callers retain independent point arrays by default. No asset or cross-frame cache is retained. */ function triangles(
    asset,
    scene,
    parent,
    callback,
    reusePoints = false,
  ) {
    const T = FrontierModelTransform;
    for (const instance of scene.instances) {
      const m = T.multiply(parent, instance.matrix);
      for (const p of asset.meshes[instance.mesh]) {
        const transformed = reusePoints ? new Map() : null;
        for (let i = 0; i < p.indices.length; i += 3) {
          const points = [0, 1, 2].map(
            /* Historical contract retained; October 14 reviewed explanation follows. @function model-scene.callback.7 — Provides the callback for a list of 0, 1, 2 map. Inputs: k. Uses: t vector; p positions subarray. Returns: t vector using m, p positions subarray using v, v plus 3. */
  /* @function modelScene.reviewedcallback_7 — Transforms one indexed triangle vertex into engine world coordinates. Inputs: corner index k0-2 with captured primitive/index/world matrix and optional local transformed Map. Returns independent XYZ by default or reused point when reusePoints enabled; reuse callers must not mutate/retain as writable. Cache lives only within one primitive traversal, no asset mutation. */ (
              k,
            ) => {
              const v = p.indices[i + k] * 3;
              if (transformed?.has(v)) return transformed.get(v);
              const point = T.vector(m, p.positions.subarray(v, v + 3));
              transformed?.set(v, point);
              return point;
            },
          );
          callback(points, p, instance, i);
        }
      }
    }
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function model-scene.rayTriangle.8 — Handles ray triangle within model scene. Inputs: origin; direction; points. Uses: sub; cross; dot. Returns: null; null. */
  /* @function modelScene.reviewedrayTriangle_8 — Intersects a ray with triangle using double-sided Moller-Trumbore arithmetic. Inputs: origin/direction XYZ arrays and3 same-space vertices. Returns nonnegative ray parameter or null for parallel/degenerate/miss/behind; parameter is metre distance only if direction normalized. Includes triangle edges and t0, determinant tolerance1e-9. No mutation/max-distance clamp; caller applies limit and validated finite input. */ function rayTriangle(
    origin,
    direction,
    points,
  ) {
    const sub =
        /* Historical contract retained; October 14 reviewed explanation follows. @function model-scene.sub.9 — Returns a map using a callback. Inputs: a; b. Uses: a map. Returns: a map using a callback. */
  /* @function modelScene.reviewedsub_9 — Subtracts component vectors for ray intersection. Inputs: same-length a/b arrays. Returns new difference array, no mutation; caller supplies3 components. */ (
          a,
          b,
        ) =>
          a.map(
            /* Historical contract retained; October 14 reviewed explanation follows. @function model-scene.callback.10 — Returns v minus b at i. Inputs: v; i. Returns: v minus b at i. */
  /* @function modelScene.reviewedcallback_10 — Subtracts one vector component. Inputs: v/index i and captured b. Returns v-b[i]; no mutation. */ (
              v,
              i,
            ) => v - b[i],
          ),
      cross =
        /* Historical contract retained; October 14 reviewed explanation follows. @function model-scene.cross.11 — Returns a list of a at 1 multiplied by b at 2 minus a at 2 multiplied by b at 1, a at 2 multiplied by b at 0 minus a at 0 multiplied by b at 2, a at 0 multiplied by b at 1 minus a at 1 multiplied by b at 0. Inputs: a; b. Returns: a list of a at 1 multiplied by b at 2 minus a at 2 multiplied by b at 1, a at 2 multiplied by b at 0 minus a at 0 multiplied by b at 2, a at 0 multiplied by b at 1 minus a at 1 multiplied by b at 0. */
  /* @function modelScene.reviewedcross_11 — Computes3D cross product. Inputs: a/b XYZ arrays. Returns new perpendicular vector; no normalization/mutation, unit dimension follows inputs. */ (
          a,
          b,
        ) => [
          a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0],
        ],
      dot =
        /* Historical contract retained; October 14 reviewed explanation follows. @function model-scene.dot.12 — Returns a reduce using a callback, 0. Inputs: a; b. Uses: a reduce. Returns: a reduce using a callback, 0. */
  /* @function modelScene.revieweddot_12 — Computes vector dot product. Inputs: a/b equal-length arrays. Returns summed products; no mutation, caller supplies finite3D components. */ (
          a,
          b,
        ) =>
          a.reduce(
            /* Historical contract retained; October 14 reviewed explanation follows. @function model-scene.callback.13 — Returns v plus x multiplied by b at i. Inputs: v; x; i. Returns: v plus x multiplied by b at i. */
  /* @function modelScene.reviewedcallback_13 — Accumulates one dot product component. Inputs: sum v, component x/index i with captured b. Returns sum+x*b[i]; no mutation. */ (
              v,
              x,
              i,
            ) => v + x * b[i],
            0,
          ),
      a = sub(points[1], points[0]),
      b = sub(points[2], points[0]),
      h = cross(direction, b),
      det = dot(a, h);
    if (Math.abs(det) < 1e-9) return null;
    const f = 1 / det,
      s = sub(origin, points[0]),
      u = f * dot(s, h);
    if (u < 0 || u > 1) return null;
    const q = cross(s, a),
      v = f * dot(direction, q);
    if (v < 0 || u + v > 1) return null;
    const distance = f * dot(b, q);
    return distance >= 0 ? distance : null;
  }
  root.FrontierModelScene = { nodeMatrix, compile, triangles, rayTriangle };
})(typeof window === "undefined" ? globalThis : window);
