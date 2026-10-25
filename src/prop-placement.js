/* October 12, 2026: independent model placement math. Asset bounds are already
 * converted from glTF Y-up into engine Z-up by model-scene. Surface placement
 * uses transformed geometry bounds, not an assumed mesh origin or graphic size. */
(/* @function propPlacement.install — Inputs: browser/global namespace. Returns: nothing. Installs pure fitting and room attachment operations. Requires the existing model transform namespace when called. */ function (
  root,
) {
  "use strict";
  /* @function propPlacement.corners — Inputs: compiled scene bounds and model rotation/scale. Returns: eight transformed bounds corners without translation. Throws invalid transform through shared validation. Does not decode meshes or mutate assets. */
  function corners(bounds, rotation, scale) {
    const matrix = root.FrontierModelTransform.matrix({ rotation, scale }),
      points = [];
    for (const x of [bounds.min[0], bounds.max[0]])
      for (const y of [bounds.min[1], bounds.max[1]])
        for (const z of [bounds.min[2], bounds.max[2]])
          points.push(root.FrontierModelTransform.vector(matrix, [x, y, z]));
    return points;
  }
  /* @function propPlacement.fit — Inputs: bounds, surface point/normal, scale, additional yaw degrees and stand-off metres. Returns: model position/rotation/scale aligned to that surface. Floor contacts preserve vertical orientation; walls align the authored -Y front outward and keep Z up. Throws nonfinite or nonhorizontal/nonvertical normals. No world mutation. */
  function fit(
    bounds,
    point,
    normal,
    scale = [1, 1, 1],
    yaw = 0,
    offset = 0.005,
  ) {
    if (
      !bounds ||
      ![...point, ...normal, yaw, offset].every(Number.isFinite) ||
      offset < 0 ||
      offset > 1
    )
      throw Error("Invalid surface placement values.");
    const length = Math.hypot(...normal);
    if (length < 0.001) throw Error("Surface normal is missing.");
    const n = normal.map(
      /* @function propPlacement.normalize — Inputs: normal component. Returns: its unit-vector component; no mutation. */ function (
        v,
      ) {
        return v / length;
      },
    );
    const wall = Math.abs(n[2]) < 0.01;
    if (!wall && n[2] < 0.99)
      throw Error("Choose an upward floor or a vertical wall.");
    const rotation = [
        0,
        0,
        yaw + (wall ? (Math.atan2(n[0], -n[1]) * 180) / Math.PI : 0),
      ],
      transformed = corners(bounds, rotation, scale);
    const min = [Infinity, Infinity, Infinity],
      max = [-Infinity, -Infinity, -Infinity];
    let contact = Infinity;
    for (const p of transformed) {
      for (let i = 0; i < 3; i++) {
        min[i] = Math.min(min[i], p[i]);
        max[i] = Math.max(max[i], p[i]);
      }
      contact = Math.min(contact, p[0] * n[0] + p[1] * n[1] + p[2] * n[2]);
    }
    const center = [
      (min[0] + max[0]) / 2,
      (min[1] + max[1]) / 2,
      (min[2] + max[2]) / 2,
    ];
    const position = point.map(
      /* @function propPlacement.centerOnSurface — Inputs: surface component and axis index. Returns: centered model translation on tangent axes. No mutation. */ function (
        v,
        i,
      ) {
        return v - center[i];
      },
    );
    const projected =
      position[0] * n[0] + position[1] * n[1] + position[2] * n[2];
    const required =
      point[0] * n[0] +
      point[1] * n[1] +
      point[2] * n[2] +
      offset -
      contact -
      projected;
    for (let i = 0; i < 3; i++) position[i] += n[i] * required;
    return { position, rotation, scale: [...scale] };
  }
  /* @function propPlacement.attachRoom — Inputs: primitive and fitted model transform. Returns: compact parent-relative position plus rotation history. Coordinates normalize by parent dimensions so resizing preserves attachment position proportionally. No mutation; parent geometry is not cut open. */
  function attachRoom(parent, transform) {
    const yaw = parent.yaw || 0,
      c = Math.cos(yaw),
      s = Math.sin(yaw),
      dx = transform.position[0] - parent.x,
      dy = transform.position[1] - parent.y;
    return {
      parentKind: "room",
      parentId: parent.id,
      local: [
        (c * dx + s * dy) / parent.w,
        (-s * dx + c * dy) / parent.d,
        (transform.position[2] - parent.z) / parent.h,
      ],
      rotation: [...transform.rotation],
      parentYaw: yaw,
    };
  }
  /* @function propPlacement.modelTransform — Inputs: world and upright model event. Returns its validated Z-up world transform (metres/degrees), including terrain-relative elevation. Rejects tilted hosts because this attachment mode keeps decorative fronts vertical. No mutation or asset decoding. */
  function modelTransform(world, parent) {
    const rotation = parent.spatial?.rotation || [0, 0, 0];
    if (Math.abs(rotation[0]) > 0.0001 || Math.abs(rotation[1]) > 0.0001)
      throw Error("Wall attachments require an upright model host.");
    return root.FrontierModelTransform.validate({
      position: [
        parent.x,
        parent.y,
        (root.FrontierTerrain?.height(world, parent.x, parent.y) || 0) +
          (parent.heightOffset ?? (parent.elevation || 0) * 0.3),
      ],
      rotation,
      scale: parent.spatial?.scale || [1, 1, 1],
    });
  }
  /* @function propPlacement.attachModel — Inputs: world, upright host model event and fitted decorative transform. Returns saved model-local pivot and relative yaw. Parent movement, yaw and scaling carry the pivot; the decoration retains its own authored scale. Rejects invalid/tilted hosts before placement. No mutation. */
  function attachModel(world, parent, transform) {
    if (
      !parent ||
      parent.spatial?.visual !== "model" ||
      parent.extensions?.placement
    )
      throw Error("Decorative model hosts must be independent objects.");
    const host = modelTransform(world, parent),
      local = root.FrontierModelTransform.vector(
        root.FrontierModelTransform.inverse(
          root.FrontierModelTransform.matrix(host),
        ),
        transform.position,
      );
    return {
      parentKind: "model",
      parentId: parent.id,
      local,
      rotation: [...transform.rotation],
      parentYaw: host.rotation[2],
    };
  }
  /* @function propPlacement.synchronize — Inputs: authored world. Returns: number of updated attached events. Mutates only events with a valid placement parent record; missing parents leave last placement intact for explicit author repair. Height offset is relative to the terrain used by runtime event rendering. Runs at edit/validation boundaries, never per render frame. */
  // October 13: the room-parent branch below remains unchanged. Model parents
  // additionally support independent upright buildings. Missing parents retain
  // the last placement; nested/cyclic or tilted hosts reject the edit transaction.
  /* @function propPlacement.synchronizeModelsAndRooms — Inputs: authored world. Returns count of refreshed decorative events; updates their pivots and yaw at validation/edit boundaries only. Room parents use normalized dimensions; model parents use inverse-transformed local pivots. Model decoration scale stays authored. Invalid metadata/unsupported hosts throw for transaction rollback; missing hosts retain last placement for repair. */
  function synchronize(world) {
    let changed = 0;
    for (const event of world.events || []) {
      const a = event.extensions?.placement;
      if (a?.parentKind === "model") {
        const parent = world.events.find(
          /* @function propPlacement.modelParent — Inputs: event record. Returns stable model-parent identity match. No mutation. */ function (
            candidate,
          ) {
            return (
              candidate.id === a.parentId &&
              candidate.spatial?.visual === "model"
            );
          },
        );
        if (!parent) continue;
        if (parent === event || parent.extensions?.placement)
          throw Error("Decorative model hosts must be independent objects.");
        if (
          !Array.isArray(a.local) ||
          a.local.length !== 3 ||
          !a.local.every(Number.isFinite)
        )
          throw Error("Invalid model attachment coordinates.");
        const host = modelTransform(world, parent),
          point = root.FrontierModelTransform.vector(
            root.FrontierModelTransform.matrix(host),
            a.local,
          );
        event.x = point[0];
        event.y = point[1];
        event.heightOffset =
          point[2] -
          (root.FrontierTerrain?.height(world, event.x, event.y) || 0);
        event.elevation = 0;
        if (event.spatial)
          event.spatial.rotation = [
            a.rotation[0],
            a.rotation[1],
            a.rotation[2] + host.rotation[2] - a.parentYaw,
          ];
        changed++;
        continue;
      }
      if (a?.parentKind !== "room") continue;
      const parent = world.interior?.primitives.find(
        /* @function propPlacement.parentLookup — Inputs: primitive. Returns: stable parent ID match. No mutation. */ function (
          e,
        ) {
          return e.id === a.parentId;
        },
      );
      if (!parent) continue;
      if (
        !Array.isArray(a.local) ||
        a.local.length !== 3 ||
        !a.local.every(Number.isFinite)
      )
        throw Error("Invalid attachment coordinates.");
      const yaw = parent.yaw || 0,
        c = Math.cos(yaw),
        s = Math.sin(yaw),
        x = a.local[0] * parent.w,
        y = a.local[1] * parent.d;
      event.x = parent.x + c * x - s * y;
      event.y = parent.y + s * x + c * y;
      const z = parent.z + a.local[2] * parent.h;
      event.heightOffset =
        z - (root.FrontierTerrain?.height(world, event.x, event.y) || 0);
      event.elevation = 0;
      if (event.spatial)
        event.spatial.rotation = [
          a.rotation[0],
          a.rotation[1],
          a.rotation[2] + ((yaw - a.parentYaw) * 180) / Math.PI,
        ];
      changed++;
    }
    return changed;
  }
  root.FrontierPropPlacement = {
    corners,
    fit,
    attachRoom,
    attachModel,
    modelTransform,
    synchronize,
  };
})(typeof window === "undefined" ? globalThis : window);
