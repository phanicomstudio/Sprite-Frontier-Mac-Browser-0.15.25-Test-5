/* Camera rays and spatial-event picking. Geometry is an occluder, never an
 * automatic gameplay event target. Equal hits sort by host and zone IDs. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-targeting.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model targeting. */
(/* @function model-targeting.installReviewed — Installs camera-ray spatial-event picking with geometry occlusion. Geometry alone is not a gameplay event target; equal-distance event hits sort deterministically by host/zone identity. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.ray.2 — Handles ray within model targeting. Inputs: game; sx; sy. Uses: frontier render camera; frontier interior ground point; d map. Returns: a record containing origin, direction, maxDistance; a record containing origin, direction. */
  /* @function modelTargeting.reviewedray_2 — Builds a normalized world picking ray for the rendered camera. Inputs: game and sx/sy logical display pixels. Returns world XYZ metre origin and unit direction; orthographic mode also provides finite maxDistance. Fixed artwork starts at Z100 and projects through floor, perspective uses focal scale360 and camera yaw/pitch radians. No mutation; assumes valid camera/alignment and propagates missing service errors. */ function ray(
    game,
    sx,
    sy,
  ) {
    const cam = FrontierRender.camera(game);
    if (cam.orthographic) {
      const floor = FrontierInterior.groundPoint(cam, sx, sy),
        top = FrontierInterior.groundPoint(
          cam,
          sx,
          sy + 100 * cam.room.camera.heightScale * cam.fit,
        ),
        d = [floor.x - top.x, floor.y - top.y, -100],
        length = Math.hypot(...d);
      return {
        origin: [top.x, top.y, 100],
        direction: d.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.callback.3 — Returns v divided by length. Inputs: v. Returns: v divided by length. */
  /* @function modelTargeting.reviewedcallback_3 — Normalizes one orthographic ray component. Inputs: v with captured positive length. Returns v/length, dimensionless; no mutation. Degenerate camera vectors are not repaired here. */ (
            v,
          ) => v / length,
        ),
        maxDistance: length + 20,
      };
    }
    const side = (sx - (cam.cx || 320)) / 360,
      up = ((cam.cy ?? 96) - sy) / 360,
      forward = Math.cos(cam.pitch) - up * Math.sin(cam.pitch),
      d = [
        forward * Math.sin(cam.yaw) + side * Math.cos(cam.yaw),
        forward * Math.cos(cam.yaw) - side * Math.sin(cam.yaw),
        Math.sin(cam.pitch) + up * Math.cos(cam.pitch),
      ],
      length = Math.hypot(...d);
    return {
      origin: [cam.x, cam.y, cam.z],
      direction: d.map(
        /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.callback.4 — Returns v divided by length. Inputs: v. Returns: v divided by length. */
  /* @function modelTargeting.reviewedcallback_4 — Normalizes one perspective ray component. Inputs: v with captured length. Returns unit-direction component; no mutation. */ (
          v,
        ) => v / length,
      ),
    };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.geometry.5 — Handles geometry within model targeting. Inputs: origin; direction; entities; assignment pattern. Uses: frontier model library get; frontier model scene triangles; frontier model renderer transform. Returns: nearest. */
  /* @function modelTargeting.reviewedgeometry_5 — Finds nearest rendered model triangle on a ray. Inputs: world metre origin, normalized direction, candidate entities and maxDistance metres (default Infinity). Returns entity/distance or null. Skips absent model IDs, transparent entities and unloaded scenes; traverses transformed triangles, not coarse collision boxes. Only local nearest accumulator changes; model/render dependency errors propagate. */ function geometry(
    origin,
    direction,
    entities,
    maxDistance = Infinity,
  ) {
    let nearest = null;
    for (const e of entities) {
      if (!e.modelId || e.transparent) continue;
      const asset = FrontierModelLibrary.get(e.modelId);
      if (!asset?.scene) continue;
      FrontierModelScene.triangles(
        asset,
        asset.scene,
        FrontierModelRenderer.transform(e),
        /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.callback.6 — Provides the callback for frontier model scene triangles. Inputs: points. Updates: nearest. Uses: frontier model scene ray triangle. */
  /* @function modelTargeting.reviewedcallback_6 — Updates nearest model picking intersection. Inputs: transformed triangle points and captured ray/entity/limit. Returns undefined; intersects ray and retains nearer non-null hit within maxDistance. No source/asset mutation; intersection errors propagate. */ (
          points,
        ) => {
          const distance = FrontierModelScene.rayTriangle(
            origin,
            direction,
            points,
          );
          if (
            distance !== null &&
            distance <= maxDistance &&
            (!nearest || distance < nearest.distance)
          )
            nearest = { entity: e, distance };
        },
      );
    }
    return nearest;
  }
  // Use the same cached room faces as rendering. Both camera visibility and
  // player reach rays must meet the actual room surfaces, not centroid order.
  /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.roomGeometry.7 — player reach rays must meet the actual room surfaces, not centroid order. Inputs: game; origin; direction; assignment pattern. Updates: nearest. Uses: frontier interior data; frontier model scene ray triangle. Returns: null; nearest. */
  /* @function modelTargeting.reviewedroomGeometry_7 — Finds nearest positive room-surface obstruction. Inputs: game, world XYZ origin, normalized direction and maxDistance metres. Returns faceId/distance or null outside geometry rooms/without interior service. Uses cached rendered faces, optionally author-view filtered, fans polygons into triangles and ignores hits within 0.00001 metre. No world mutation; geometry services may populate their caches and errors propagate. */ function roomGeometry(
    game,
    origin,
    direction,
    maxDistance = Infinity,
  ) {
    if (
      game.sourceWorld?.interior?.mode !== "geometry" ||
      !root.FrontierInterior
    )
      return null;
    let nearest = null;
    for (const face of root.FrontierAuthorView?.faces(
      game,
      root.FrontierRender.camera(game),
      FrontierInterior.data(game.sourceWorld).faces,
    ) || FrontierInterior.data(game.sourceWorld).faces)
      for (let i = 1; i < face.points.length - 1; i++) {
        const distance = FrontierModelScene.rayTriangle(origin, direction, [
          face.points[0],
          face.points[i],
          face.points[i + 1],
        ]);
        if (
          distance !== null &&
          distance > 1e-5 &&
          distance <= maxDistance &&
          (!nearest || distance < nearest.distance)
        )
          nearest = { faceId: face.id, distance };
      }
    return nearest;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.obstruction.8 — Handles obstruction within model targeting. Inputs: game; origin; direction; entities; max distance. Uses: geometry; room geometry. Returns: geometry using origin, direction, entities or room geometry using game, origin, direction. */
  /* @function modelTargeting.reviewedobstruction_8 — Tests either model or room obstruction before a reach/visibility endpoint. Inputs: game, world ray, entities and maxDistance metres. Returns model hit when present, otherwise room hit, or null. Intended as truthy obstruction test, not a globally nearest model-versus-room ranking. No source mutation; dependency errors propagate. */ function obstruction(
    game,
    origin,
    direction,
    entities,
    maxDistance,
  ) {
    return (
      geometry(origin, direction, entities, maxDistance) ||
      roomGeometry(game, origin, direction, maxDistance)
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.terrain.9 — Handles terrain within model targeting. Inputs: game; origin; direction; distance. Updates: t. Uses: origin map; frontier terrain height. Returns: false; true. */
  /* @function modelTargeting.reviewedterrain_9 — Samples terrain along an interaction ray. Inputs: game, world origin, normalized direction and endpoint distance metres. Returns false without terrain service, otherwise true if ray samples fall more than 0.02 metre beneath terrain. Samples every0.08 metre from0.08, excluding final0.04; narrow terrain intersections between samples may be missed. No terrain mutation; invalid samples/dependencies propagate. */ function terrain(
    game,
    origin,
    direction,
    distance,
  ) {
    if (!root.FrontierTerrain) return false;
    for (let t = 0.08; t < distance - 0.04; t += 0.08) {
      const p = origin.map(
        /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.callback.10 — Returns v plus direction at i multiplied by t. Inputs: v; i. Returns: v plus direction at i multiplied by t. */
  /* @function modelTargeting.reviewedcallback_10 — Evaluates one ray sample coordinate. Inputs: origin component v and index i with captured t metres/direction. Returns world coordinate v+direction[i]*t; no mutation. */ (
          v,
          i,
        ) => v + direction[i] * t,
      );
      if (p[2] < FrontierTerrain.height(game.sourceWorld, p[0], p[1]) - 0.02)
        return true;
    }
    return false;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.pick.11 — Handles pick within model targeting. Inputs: game; sx; sy; entities; assignment pattern. Updates: hit. Uses: ray; geometry; frontier model transform ray box; frontier model events matrix. Returns: hit selects a record containing copied fields, zoneDepth or null; a record containing id, eventId, name, x, y, z, height, zoneHit. */
  /* @function modelTargeting.reviewedpick_11 — Picks authored model hosts or reachable gameplay interaction zones. Inputs: game, logical pixel sx/sy, candidate entities and authoring flag. Returns picked host copy with zoneDepth for editor, or event/zone identity and hit XYZ/depth for gameplay, otherwise null. Gameplay requires living nontransparent spatial host, event range and both camera visibility and chest-height reach unobstructed by models/room/terrain; equal hits sort by host/zone IDs. Authoring uses geometry/custom boxes without gameplay reach rules. Does not execute events or move actors; service errors propagate. Ray endpoint clearance is0.025 metre, reach origin0.9 metre above player feet. */ function pick(
    game,
    sx,
    sy,
    entities,
    authoring = false,
  ) {
    const r = ray(game, sx, sy),
      hits = [];
    if (authoring) {
      let hit = geometry(r.origin, r.direction, entities, r.maxDistance || 100);
      for (const e of entities)
        if (e.spatial && !e.dead)
          for (const box of [
            ...e.spatial.collisionBoxes,
            ...e.spatial.interactionZones,
          ]) {
            const distance = FrontierModelTransform.rayBox(
              r.origin,
              r.direction,
              box,
              FrontierModelEvents.matrix(e),
              r.maxDistance || 100,
            );
            if (distance !== null && (!hit || distance < hit.distance))
              hit = { entity: e, distance };
          }
      return hit
        ? {
            ...hit.entity,
            zoneDepth: FrontierRender.project(
              FrontierRender.camera(game),
              ...r.origin.map(
                /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.callback.12 — Returns v plus r direction at i multiplied by hit distance. Inputs: v; i. Returns: v plus r direction at i multiplied by hit distance. */
  /* @function modelTargeting.reviewedcallback_12 — Computes world point of editor host ray hit. Inputs: origin component v/index i with captured normalized ray and hit distance metres. Returns v+direction[i]*distance for depth projection; no mutation. */ (
                  v,
                  i,
                ) => v + r.direction[i] * hit.distance,
              ),
            )?.depth,
          }
        : null;
    }
    for (const e of entities)
      if (e.spatial && !e.dead && !e.transparent)
        for (const hit of FrontierModelEvents.rayZones(
          e,
          r.origin,
          r.direction,
          r.maxDistance || 100,
        )) {
          const point = r.origin.map(
              /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.callback.13 — Returns v plus r direction at i multiplied by hit distance. Inputs: v; i. Returns: v plus r direction at i multiplied by hit distance. */
  /* @function modelTargeting.reviewedcallback_13 — Computes world point of gameplay zone ray hit. Inputs: origin component v/index i and captured hit distance metres. Returns world component; no mutation. */ (
                v,
                i,
              ) => v + r.direction[i] * hit.distance,
            ),
            logic =
              game.eventSession?.events?.find(
                /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.callback.14 — Returns event id equals hit event id. Inputs: event. Returns: event id equals hit event id. */
  /* @function modelTargeting.reviewedcallback_14 — Resolves zone event in live event-session records. Inputs: event and captured hit.eventId. Returns identity match; no mutation. Authored fallback is used when absent. */ (
                  event,
                ) => event.id === hit.eventId,
              ) ||
              game.sourceWorld.events.find(
                /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.callback.15 — Returns event id equals hit event id. Inputs: event. Returns: event id equals hit event id. */
  /* @function modelTargeting.reviewedcallback_15 — Resolves zone event in authored records. Inputs: event and captured hit.eventId. Returns identity match; no mutation. Missing event excludes zone from gameplay picking. */ (
                  event,
                ) => event.id === hit.eventId,
              );
          if (!logic) continue;
          const distance = Math.hypot(
            point[0] - game.player.x,
            point[1] - game.player.y,
            point[2] - (game.player.z || 0),
          );
          if (distance > logic.range) continue;
          hits.push({ ...hit, point, logic });
        }
    hits.sort(
      /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.callback.16 — Returns a distance minus b distance or a entity id locale compare using b entity id or a zone id locale compare using b zone id. Inputs: a; b. Uses: a entity id locale compare; a zone id locale compare. Returns: a distance minus b distance or a entity id locale compare using b entity id or a zone id locale compare using b zone id. */
  /* @function modelTargeting.reviewedcallback_16 — Orders gameplay zone hits deterministically. Inputs: hits a/b. Returns distance comparison then host/zone lexical IDs on ties. Mutates only hits array through sort, not events/assets; assumes valid IDs. */ (
        a,
        b,
      ) =>
        a.distance - b.distance ||
        a.entity.id.localeCompare(b.entity.id) ||
        a.zone.id.localeCompare(b.zone.id),
    );
    for (const hit of hits) {
      const blocked = obstruction(
        game,
        r.origin,
        r.direction,
        entities,
        hit.distance - 0.025,
      );
      if (blocked || terrain(game, r.origin, r.direction, hit.distance))
        continue;
      const reachOrigin = [
          game.player.x,
          game.player.y,
          (game.player.z || 0) + 0.9,
        ],
        reach = hit.point.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.callback.17 — Returns v minus reach origin at i. Inputs: v; i. Returns: v minus reach origin at i. */
  /* @function modelTargeting.reviewedcallback_17 — Computes chest-to-zone reach vector component. Inputs: hit coordinate v/index i with captured reachOrigin. Returns metre difference; no mutation. */ (
            v,
            i,
          ) => v - reachOrigin[i],
        ),
        length = Math.hypot(...reach);
      if (
        length > 0.001 &&
        (obstruction(
          game,
          reachOrigin,
          reach.map(
            /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.callback.18 — Returns v divided by length. Inputs: v. Returns: v divided by length. */
  /* @function modelTargeting.reviewedcallback_18 — Normalizes reach vector for geometry obstruction test. Inputs: component v and positive captured length metres. Returns dimensionless unit component; no mutation. Caller skips length at most0.001 metre. */ (
              v,
            ) => v / length,
          ),
          entities,
          length - 0.025,
        ) ||
          terrain(
            game,
            reachOrigin,
            reach.map(
              /* Historical contract retained; October 14 reviewed explanation follows. @function model-targeting.callback.19 — Returns v divided by length. Inputs: v. Returns: v divided by length. */
  /* @function modelTargeting.reviewedcallback_19 — Normalizes reach vector for terrain visibility sampling. Inputs: v and captured positive length metres. Returns unit direction component; no mutation. */ (
                v,
              ) => v / length,
            ),
            length,
          ))
      )
        continue;
      const p = FrontierRender.project(
        FrontierRender.camera(game),
        ...hit.point,
      );
      return {
        id: hit.eventId,
        eventId: hit.eventId,
        name: hit.zone.name,
        x: hit.point[0],
        y: hit.point[1],
        z: hit.point[2],
        height: 0.1,
        zoneHit: true,
        modelHostId: hit.entity.id,
        zoneId: hit.zone.id,
        zoneDepth: p?.depth,
      };
    }
    return null;
  }
  root.FrontierModelTargeting = {
    ray,
    geometry,
    roomGeometry,
    obstruction,
    pick,
  };
})(window);
