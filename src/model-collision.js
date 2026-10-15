/* SAT intersection between an affine transformed authored box and the player's
 * upright body bounds. Full parent/child transforms include nonuniform scale.
 * This is deliberately independent of graphic size and event solid/priority. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model collision. */
(/* @function model-collision.reviewed1 — Registers collision queries independent of graphics. Inputs: browser/global root. Returns nothing; installs FrontierModelCollision APIs. Queries use world X/Y horizontal metres and Z up, with positive half extents; no simulation or mesh decode occurs at script load. */ function (
  root,
) {
  "use strict";
  const dot =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.dot.2 — Returns a reduce using a callback, 0. Inputs: a; b. Uses: a reduce. Returns: a reduce using a callback, 0. */
      /* @function model-collision.reviewed2 — Computes a vector dot product for collision projection. Inputs: same-length numeric vectors a/b. Returns scalar sum; no normalization, validation or source mutation. Callers supply finite 3D vectors in a common space. */ (
        a,
        b,
      ) =>
        a.reduce(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.callback.3 — Returns n plus v multiplied by b at i. Inputs: n; v; i. Returns: n plus v multiplied by b at i. */
          /* @function model-collision.reviewed3 — Accumulates one dot-product component. Inputs: sum n, coordinate v and index i, with vector b captured. Returns n+v*b[i]; no external mutation. */ (
            n,
            v,
            i,
          ) => n + v * b[i],
          0,
        ),
    sub =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.sub.4 — Returns a map using a callback. Inputs: a; b. Uses: a map. Returns: a map using a callback. */
      /* @function model-collision.reviewed4 — Subtracts collision vectors. Inputs: same-length a/b arrays in common coordinate space. Returns new componentwise a-b array; neither input is changed or normalized. */ (
        a,
        b,
      ) =>
        a.map(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.callback.5 — Returns v minus b at i. Inputs: v; i. Returns: v minus b at i. */
          /* @function model-collision.reviewed5 — Subtracts one vector component. Inputs: coordinate v and index i, with b captured. Returns v-b[i] in the original coordinate units; no mutation. */ (
            v,
            i,
          ) => v - b[i],
        ),
    cross =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.cross.6 — Returns a list of a at 1 multiplied by b at 2 minus a at 2 multiplied by b at 1, a at 2 multiplied by b at 0 minus a at 0 multiplied by b at 2, a at 0 multiplied by b at 1 minus a at 1 multiplied by b at 0. Inputs: a; b. Returns: a list of a at 1 multiplied by b at 2 minus a at 2 multiplied by b at 1, a at 2 multiplied by b at 0 minus a at 0 multiplied by b at 2, a at 0 multiplied by b at 1 minus a at 1 multiplied by b at 0. */
      /* @function model-collision.reviewed6 — Builds a separating-axis candidate by cross product. Inputs: finite 3D vectors a/b. Returns a new perpendicular vector, deliberately unnormalized. Degenerate axes are skipped later; no source mutation. */ (
        a,
        b,
      ) => [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
      ];
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.intersects.7 — Tests geometric overlap using the module’s separating-axis or region test. Inputs: corners; center; half. Uses: sub; cross; edges flat map; corners map. Returns: false; true. */
  /* @function model-collision.reviewed7 — Tests an affine box against upright actor bounds via SAT. Inputs: eight transformed corners in stable box order, world center and positive world half extents. Returns false on any separating axis, true for penetration. Tests basis/face/edge-cross axes, skips near-zero axes and treats boundary contact as nonpenetrating with 1e-7 projection tolerance. Pure query; caller validates geometry. */ function intersects(
    corners,
    center,
    half,
  ) {
    const edges = [
        sub(corners[4], corners[0]),
        sub(corners[2], corners[0]),
        sub(corners[1], corners[0]),
      ],
      basis = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      axes = [
        ...basis,
        cross(edges[0], edges[1]),
        cross(edges[1], edges[2]),
        cross(edges[2], edges[0]),
        ...edges.flatMap(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.callback.8 — Returns basis map using a callback. Inputs: e. Uses: basis map. Returns: basis map using a callback. */
          /* @function model-collision.reviewed8 — Builds edge-cross separating axes. Inputs: one transformed box edge e. Returns three axes crossing it with world unit basis, without normalization or outside mutation. */ (
            e,
          ) =>
            basis.map(
              /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.callback.9 — Returns cross using e, b. Inputs: b. Uses: cross. Returns: cross using e, b. */
              /* @function model-collision.reviewed9 — Crosses one transformed edge with a world basis vector. Inputs: basis vector b, with e captured. Returns new axis candidate; zero vectors remain for enclosing degeneracy check. */ (
                b,
              ) => cross(e, b),
            ),
        ),
      ];
    for (const axis of axes) {
      if (Math.hypot(...axis) < 1e-9) continue;
      const projected = corners.map(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.callback.10 — Returns dot using p, axis. Inputs: p. Uses: dot. Returns: dot using p, axis. */
          /* @function model-collision.reviewed10 — Projects one transformed corner onto a SAT axis. Inputs: corner p, with axis captured. Returns scalar dot product in the common projection space. No mutation. */ (
            p,
          ) => dot(p, axis),
        ),
        mid = dot(center, axis),
        radius = half.reduce(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.callback.11 — Returns n plus math abs using axis at i multiplied by v. Inputs: n; v; i. Returns: n plus math abs using axis at i multiplied by v. */
          /* @function model-collision.reviewed11 — Computes upright-box projection radius. Inputs: accumulated radius n, half-size v in world metres and index i. Returns sum of absolute-axis weighted half extents; no source mutation. */ (
            n,
            v,
            i,
          ) => n + Math.abs(axis[i]) * v,
          0,
        );
      if (
        Math.max(...projected) <= mid - radius + 1e-7 ||
        Math.min(...projected) >= mid + radius - 1e-7
      )
        return false;
    }
    return true;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.blocked.12 — Tests whether the proposed movement or location meets a solid obstacle. Inputs: game; x; y; assignment pattern; assignment pattern. Updates: game model collision debug. Uses: root frontier model library get; frontier model mesh collision query; frontier model events matrix; frontier model transform corners. Returns: true; true. */
  /* @function model-collision.reviewed12 — Checks proposed horizontal body movement against model collision. Inputs: live game, proposed x/y metres, optional body radius (0.13 m) and actor (default player). Returns Boolean for swept mesh/endpoint authored-box collision. Uses actor height (default 1.65 m), skips dead/self/explicit-none hosts, and writes focused mesh-query diagnostics. Missing mesh assets skip; does not commit movement, change sprite presentation or decode models. */ function blocked(
    game,
    x,
    y,
    radius = 0.13,
    actor = game.player,
  ) {
    const height = actor.height || 1.65,
      half = [radius, radius, height / 2],
      center = [x, y, (actor.z || 0) + half[2]];
    for (const e of game.sceneEvents || []) {
      if (e === actor || e.dead) continue;
      if (e.spatial?.collisionMode === "none") continue;
      if (e.spatial?.collisionMode === "mesh") {
        const asset = root.FrontierModelLibrary?.get(e.modelId);
        if (asset?.scene && root.FrontierModelMeshCollision) {
          const stats = {};
          const hit = FrontierModelMeshCollision.query(
            asset,
            FrontierModelEvents.matrix(e),
            [actor.x, actor.y, center[2]],
            center,
            half,
            stats,
          );
          game.modelCollisionDebug = {
            ...stats,
            hit: hit !== null,
            hostId: e.id,
          };
          if (hit !== null) return true;
        }
        continue;
      }
      for (const box of e.spatial?.collisionBoxes || []) {
        const corners = FrontierModelTransform.corners(
          box,
          FrontierModelEvents.matrix(e),
        );
        if (intersects(corners, center, half)) return true;
      }
    }
    return false;
  }
  // Mesh support is separate from interaction zones and old sprite footprints.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.support.13 — Mesh support is separate from interaction zones and old sprite footprints. Inputs: game; x; y; low; high; assignment pattern. Updates: best; game model support debug. Uses: root frontier model library get; frontier model mesh collision support; frontier model events matrix. Returns: best. */
  /* @function model-collision.reviewed13 — Finds the highest model tread/support in an elevation range. Inputs: live game, world x/y, low/high Z metres and body radius (default 0.13 m). Returns highest support Z or null, updating support diagnostics. Queries live mesh-mode hosts only; interaction volumes and sprite size do not act as floors. Does not move player or adopt an asset. */ function support(
    game,
    x,
    y,
    low,
    high,
    radius = 0.13,
  ) {
    let best = null;
    const stats = {};
    for (const e of game.sceneEvents || []) {
      if (e.dead || e.spatial?.collisionMode !== "mesh") continue;
      const asset = root.FrontierModelLibrary?.get(e.modelId);
      if (!asset?.scene) continue;
      const z = FrontierModelMeshCollision.support(
        asset,
        FrontierModelEvents.matrix(e),
        x,
        y,
        low,
        high,
        stats,
        radius,
      );
      if (z !== null && (best === null || z > best)) best = z;
    }
    game.modelSupportDebug = { ...stats, height: best };
    return best;
  }
  // Sweep the complete body vertically: falling lands on solid geometry and
  // ascending hits undersides rather than letting the head enter a ceiling.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.vertical.14 — ascending hits undersides rather than letting the head enter a ceiling. Inputs: game; actor; end z; assignment pattern. Updates: nearest. Uses: root frontier model library get; frontier model mesh collision query; frontier model events matrix. Returns: nearest equals null selects end z or actor z or 0 plus end z minus actor z or 0 multiplied by math max using 0, nearest minus 0.0001 divided by math max using 0.0001, math abs using end z minus actor z or 0. */
  /* @function model-collision.reviewed14 — Sweeps an upright body vertically through model meshes. Inputs: live game, actor, requested feet endZ metres and radius. Returns cleared feet elevation at the nearest hit with a 0.0001 m skin, or requested elevation if unobstructed. Checks full height for head/underside contact; skips dead/nonmesh/missing assets. Pure motion proposal, no actor/velocity commit. */ function vertical(
    game,
    actor,
    endZ,
    radius = 0.13,
  ) {
    const h = actor.height || 1.65,
      half = [radius, radius, h / 2],
      start = [actor.x, actor.y, (actor.z || 0) + h / 2],
      end = [actor.x, actor.y, endZ + h / 2];
    let nearest = null;
    for (const e of game.sceneEvents || []) {
      if (e.dead || e.spatial?.collisionMode !== "mesh") continue;
      const asset = root.FrontierModelLibrary?.get(e.modelId);
      if (!asset?.scene) continue;
      const hit = FrontierModelMeshCollision.query(
        asset,
        FrontierModelEvents.matrix(e),
        start,
        end,
        half,
      );
      if (hit !== null && (nearest === null || hit < nearest)) nearest = hit;
    }
    return nearest === null
      ? endZ
      : (actor.z || 0) +
          (endZ - (actor.z || 0)) *
            Math.max(
              0,
              nearest -
                0.0001 / Math.max(0.0001, Math.abs(endZ - (actor.z || 0))),
            );
  }
  // Return a proposed stair elevation; caller commits only after all other
  // blockers pass. Sweeps check upward clearance and raised horizontal travel.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.step.15 — blockers pass. Sweeps check upward clearance and raised horizontal travel. Inputs: game; x; y; assignment pattern. Uses: root frontier parameters get; support; vertical; blocked. Returns: null; null. */
  /* @function model-collision.reviewed15 — Proposes a safe mesh stair step. Inputs: live game, proposed world x/y and radius. Returns candidate XYZ or null when airborne/unreachable/blocked. Searches three reach offsets up to one radius within configured stepHeight (default 0.6 m), checks upward body clearance and raised horizontal sweep. Caller commits only after other blockers pass; player state and geometry remain unchanged. */ function step(
    game,
    x,
    y,
    radius = 0.13,
  ) {
    const p = game.player;
    if (p.grounded === false) return null;
    const amount =
        root.FrontierParameters?.get(game.sourceWorld, "stepHeight") ?? 0.6,
      z = p.z || 0,
      dx = x - p.x,
      dy = y - p.y,
      length = Math.hypot(dx, dy);
    if (!length) return null;
    // A bevel/riser can meet the body before a tread lies beneath its feet.
    // Search no further than one body radius, sweep every proposed raised path,
    // and commit the destination atomically in locomotion after all blockers.
    for (const reach of [0, radius * 0.5, radius]) {
      const tx = x + (dx / length) * reach,
        ty = y + (dy / length) * reach,
        top = support(game, tx, ty, z + 0.0001, z + amount, radius);
      if (top === null) continue;
      const raised = { ...p, z: top + 0.0001 };
      if (Math.abs(vertical(game, p, raised.z, radius) - raised.z) > 1e-5)
        continue;
      if (blocked(game, tx, ty, radius, raised)) continue;
      return { x: tx, y: ty, z: top };
    }
    return null;
  } // Camera boom is swept as a small volume, not a single ray. This keeps
  // the near view clear of thin walls, corners and ceilings at any look angle.
  // Water never participates: underwater viewing remains available.
  /* @function modelCollision.cameraSeparation — Inputs: live game, proposed camera-volume centre and half extents in world metres, plus caller-owned diagnostics. Returns deepest static overlap correction/host or null. Room candidates first pass conservative horizontal/vertical bounds; imported models use their shared BVH. Collision-disabled/dead objects are skipped. No actor, source geometry or sprite presentation mutation. */
  function cameraSeparation(game, center, half, stats) {
    let best = null,
      distance = 0;
    /* @function modelCollision.retainCameraSeparation — Inputs: optional world translation and host identity. Returns nothing; keeps deepest actual endpoint overlap for one bounded correction step. Writes local result only. */
    function retain(vector, host) {
      if (!vector) return;
      const depth = Math.hypot(...vector);
      if (depth > distance) {
        distance = depth;
        best = { vector, host };
      }
    }
    const room = game.sourceWorld?.interior;
    if (room?.mode === "geometry") {
      const nearby = new Set(),
        horizontal = Math.hypot(half[0], half[1]);
      for (const piece of room.primitives)
        if (
          piece.z < center[2] + half[2] &&
          piece.z + piece.h > center[2] - half[2] &&
          root.FrontierRoomPhysics.overlap(
            piece,
            center[0],
            center[1],
            horizontal,
          )
        )
          nearby.add(piece.id);
      for (const face of root.FrontierInterior.data(game.sourceWorld).faces) {
        if (!nearby.has(face.id)) continue;
        for (let i = 1; i < face.points.length - 1; i++) {
          stats.separationRoomTriangles =
            (stats.separationRoomTriangles || 0) + 1;
          retain(
            root.FrontierModelMeshCollision.triangleSeparation(
              [face.points[0], face.points[i], face.points[i + 1]],
              center,
              half,
            ),
            face.id,
          );
        }
      }
    }
    for (const entity of game.sceneEvents || []) {
      if (
        entity.dead ||
        !entity.spatial ||
        entity.spatial.collisionMode === "none" ||
        (entity.spatial.collisionMode !== "mesh" &&
          !entity.spatial.collisionBoxes?.length)
      )
        continue;
      const matrix = root.FrontierModelEvents.matrix(entity);
      if (entity.spatial?.collisionMode === "mesh") {
        const asset = root.FrontierModelLibrary?.get(entity.modelId);
        if (asset?.scene)
          retain(
            root.FrontierModelMeshCollision.separation(
              asset,
              matrix,
              center,
              half,
              stats,
            ),
            entity.id,
          );
      } else
        for (const box of entity.spatial?.collisionBoxes || []) {
          const corners = root.FrontierModelTransform.corners(box, matrix);
          for (const [a, b, c, d] of [
            [0, 1, 3, 2],
            [4, 6, 7, 5],
            [0, 4, 5, 1],
            [2, 3, 7, 6],
            [0, 2, 6, 4],
            [1, 5, 7, 3],
          ]) {
            retain(
              root.FrontierModelMeshCollision.triangleSeparation(
                [corners[a], corners[b], corners[c]],
                center,
                half,
              ),
              entity.id,
            );
            retain(
              root.FrontierModelMeshCollision.triangleSeparation(
                [corners[a], corners[c], corners[d]],
                center,
                half,
              ),
              entity.id,
            );
          }
        }
    }
    return best;
  }
  /* @function model-collision.camera.16 — Water never participates: underwater viewing remains available. Inputs: game; result. Updates: hit; nearest; host id; game model camera debug; result x. Uses: frontier model events matrix; root frontier model library get; frontier model mesh collision query; frontier model transform corners. Returns: result; result. */ /* @function modelCollision.camera1524 — Inputs: live game and proposed gameplay camera. Returns same mutable camera record constrained by a swept near-plane-enclosing volume and static overlap repair; author mode bypasses constraints. World units are metres. Writes bounded diagnostics/one prior-safe point, never actor position or sprite orientation/proportions/frames. Up to eight 5 mm-skinned corrections resolve corners; verified prior-safe fallback handles unresolved confined spaces, otherwise diagnostics explicitly mark inability to fit. October 13 extends the retained sweep-only contract above. */ function camera(
    game,
    result,
  ) {
    if (game.authoring) return result;
    const p = game.player,
      start = [p.x, p.y, (p.z || 0) + 1.3],
      end = [result.x, result.y, result.z],
      half = [0.2, 0.2, 0.2];
    // The near plane is .13 world units away with a 360-pixel focal length.
    // Enclose all four corners, including the asymmetric pitch-framing center.
    const width = game.viewWidth || 640,
      cx = result.cx ?? width / 2,
      cy = result.cy ?? 96;
    const clearance = Math.max(
      0.2,
      Math.hypot(
        0.13,
        (0.13 * Math.max(cx, width - cx)) / 360,
        (0.13 * Math.max(Math.abs(cy), Math.abs(480 - cy))) / 360,
      ) + 0.02,
    );
    half[0] = half[1] = half[2] = clearance;
    let nearest = 1,
      hostId = null;
    const stats = {};
    // October 9: room primitives are solid for camera volume as well as actors.
    // Sweep both triangle sides, including floors/ceilings; water is never queried.
    const room = game.sourceWorld?.interior;
    if (room?.mode === "geometry")
      for (const face of root.FrontierInterior.data(game.sourceWorld).faces) {
        for (let i = 1; i < face.points.length - 1; i++) {
          const hit = FrontierModelMeshCollision.sweepTriangle(
            [face.points[0], face.points[i], face.points[i + 1]],
            start,
            end,
            half,
          );
          if (hit !== null && hit < nearest) {
            nearest = hit;
            hostId = face.id;
          }
        }
      }

    for (const e of game.sceneEvents || []) {
      if (e.dead || e.spatial?.collisionMode === "none") continue;
      const matrix = FrontierModelEvents.matrix(e);
      let hit = null;
      if (e.spatial?.collisionMode === "mesh") {
        const asset = root.FrontierModelLibrary?.get(e.modelId);
        if (asset?.scene)
          hit = FrontierModelMeshCollision.query(
            asset,
            matrix,
            start,
            end,
            half,
            stats,
          );
      } else
        for (const box of e.spatial?.collisionBoxes || []) {
          const corners = FrontierModelTransform.corners(box, matrix);
          for (const [a, b, c, d] of [
            [0, 1, 3, 2],
            [4, 6, 7, 5],
            [0, 4, 5, 1],
            [2, 3, 7, 6],
            [0, 2, 6, 4],
            [1, 5, 7, 3],
          ])
            for (const tri of [
              [a, b, c],
              [a, c, d],
            ]) {
              const t = FrontierModelMeshCollision.sweepTriangle(
                tri.map(
                  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.callback.17 — Returns corners at i. Inputs: i. Returns: corners at i. */
                  /* @function model-collision.reviewed17 — Selects a box corner for camera face triangulation. Inputs: stable corner index i. Returns captured transformed corner reference without copying or mutation; the enclosing camera query owns diagnostics and sweep tests. */ (
                    i,
                  ) => corners[i],
                ),
                start,
                end,
                half,
              );
              if (t !== null && (hit === null || t < hit)) hit = t;
            }
        }
      if (hit !== null && hit < nearest) {
        nearest = hit;
        hostId = e.id;
      }
    }
    const length = Math.hypot(
        ...end.map(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-collision.callback.18 — Returns v minus start at i. Inputs: v; i. Returns: v minus start at i. */
          /* @function model-collision.reviewed18 — Builds the camera sweep displacement vector. Inputs: proposed end coordinate v and axis index i, with start captured. Returns v-start[i] metres. No source mutation or camera commit. */ (
            v,
            i,
          ) => v - start[i],
        ),
      ),
      fraction = Math.max(
        0,
        nearest - (nearest < 1 ? 0.02 / Math.max(0.02, length) : 0),
      );
    game.modelCameraDebug = {
      ...stats,
      hostId,
      fraction,
      clearance,
      obstructed: nearest < 1,
    };
    if (nearest < 1) {
      result.x = start[0] + (end[0] - start[0]) * fraction;
      result.y = start[1] + (end[1] - start[1]) * fraction;
      result.z = start[2] + (end[2] - start[2]) * fraction;
    }
    // October 13: a sweep beginning inside the larger camera clearance box can
    // legitimately stop at fraction zero. Retraction alone then leaves the near
    // plane in geometry. Repair the final stationary volume on either side of
    // triangle winding, with bounded corner iterations and a verified prior-safe
    // fallback for spaces too narrow for the conservative volume.
    const point = [result.x, result.y, result.z];
    let correction = cameraSeparation(game, point, half, stats),
      iterations = 0,
      totalCorrection = 0;
    while (correction && iterations < 8) {
      for (let axis = 0; axis < 3; axis++)
        point[axis] += correction.vector[axis];
      totalCorrection += Math.hypot(...correction.vector);
      hostId = correction.host;
      iterations++;
      correction = cameraSeparation(game, point, half, stats);
    }
    let usedPriorSafe = false;
    if (
      correction &&
      game.modelCameraSafePosition &&
      !cameraSeparation(game, game.modelCameraSafePosition, half, stats)
    ) {
      for (let axis = 0; axis < 3; axis++)
        point[axis] = game.modelCameraSafePosition[axis];
      correction = null;
      usedPriorSafe = true;
    }
    result.x = point[0];
    result.y = point[1];
    result.z = point[2];
    if (!correction) game.modelCameraSafePosition = [...point];
    game.modelCameraDebug = {
      ...game.modelCameraDebug,
      ...stats,
      hostId,
      obstructed: nearest < 1 || iterations > 0,
      separationIterations: iterations,
      separationDistance: totalCorrection,
      separationUnresolved: !!correction,
      usedPriorSafe,
    };
    return result;
  }
  root.FrontierModelCollision = {
    intersects,
    blocked,
    support,
    vertical,
    step,
    camera,
  };
})(typeof window === "undefined" ? globalThis : window);
