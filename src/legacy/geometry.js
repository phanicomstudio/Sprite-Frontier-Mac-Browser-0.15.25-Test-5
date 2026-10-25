/* MAINTAINER GUIDE
 * Original Frontier geometry utilities retained for compatibility. Coordinates are ground-plane points; native elevation-aware combat lives in spatial.js. Keep source provenance and compare reference archives before altering inherited behavior.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/*
  METROPOLIS FRONTIER 0.18.2 — shared Prop geometry helpers.

  This file contains no editor UI and no gameplay loop. It is intentionally
  small enough to be shared by Game and Editor. Ground-space polygons are
  logical world data; sprite-space polygons are visual interaction hit regions.
*/
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function geometry.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root mfgeometry. */
(/* @function geometry.installReviewed — Installs preserved ground-plane prop geometry utilities for compatibility. Elevation-aware gameplay belongs to native spatial services; source provenance and reference behavior remain retained. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.clone.2 — Handles clone within geometry. Inputs: value. Uses: structured clone; json parse; json stringify. Returns: typeof structured clone equals "function" selects structured clone using value or json parse using json stringify using value. */
  /* @function geometry.reviewedclone_2 — Copies compatibility data. Inputs: value. Returns structuredClone when available, otherwise JSON round-trip. No input mutation; uncloneable/circular values throw. JSON fallback loses unsupported values, so maintained callers use portable records. */ function clone(
    value,
  ) {
    return typeof structuredClone === "function"
      ? structuredClone(value)
      : JSON.parse(JSON.stringify(value));
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.geometryForDefinition.3 — Handles geometry for definition within geometry. Inputs: definition. Uses: array is array. Returns: a record containing blocking, sort, hotZones, depth; a record containing blocking, sort, hotZones, depth. */
  /* @function geometry.reviewedgeometryForDefinition_3 — Reads legacy prop geometry with safe empty/default collections. Inputs: optional definition. Returns blocking/sort/hotZones/depth record retaining existing array/object references; absent definition uses anchor depth, present malformed geometry defaults blocking-front. No mutation or validation of individual polygons. */ function geometryForDefinition(
    definition,
  ) {
    if (!definition)
      return {
        blocking: [],
        sort: [],
        hotZones: [],
        depth: {
          mode: "anchor",
          offset: 0,
        },
      };
    const geometry =
      definition.geometry && typeof definition.geometry === "object"
        ? definition.geometry
        : {};
    return {
      blocking: Array.isArray(geometry.blocking) ? geometry.blocking : [],
      sort: Array.isArray(geometry.sort) ? geometry.sort : [],
      hotZones: Array.isArray(geometry.hotZones) ? geometry.hotZones : [],
      depth:
        geometry.depth && typeof geometry.depth === "object"
          ? geometry.depth
          : {
              mode: "blocking-front",
              offset: 0,
            },
    };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.normalizePolygon.4 — Handles normalize polygon within geometry. Inputs: polygon; assignment pattern. Updates: copy id; copy space; copy points. Uses: clone; array is array; copy points map using a callback filter; copy points map. Returns: copy. */
  /* @function geometry.reviewednormalizePolygon_4 — Creates normalized legacy polygon copy. Inputs: polygon and fallbackSpace(defaultground). Returns cloned record with default ID, sprite space only when explicitly sprite and finite numeric point list. Missing/NaN point components become0, Infinity points filtered. No source mutation; clone failures propagate. Ground coordinates world units, sprite coordinates pixel-local. */ function normalizePolygon(
    polygon,
    fallbackSpace = "ground",
  ) {
    const copy = clone(polygon || {});
    copy.id = copy.id || "polygon";
    copy.space = copy.space === "sprite" ? "sprite" : fallbackSpace;
    copy.points = Array.isArray(copy.points)
      ? copy.points
          .map(
            /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.callback.5 — Returns a record containing x, y. Inputs: point. Uses: number. Returns: a record containing x, y. */
  /* @function geometry.reviewedcallback_5 — Coerces one polygon point. Inputs: nullable point. Returns numeric x/y with invalid/falsey numeric values default0. No mutation; nonfinite infinities removed by following filter. */ (
              point,
            ) => ({
              x: Number(point?.x) || 0,
              y: Number(point?.y) || 0,
            }),
          )
          .filter(
            /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.callback.6 — Returns number is finite using point x and number is finite using point y. Inputs: point. Uses: number is finite. Returns: number is finite using point x and number is finite using point y. */
  /* @function geometry.reviewedcallback_6 — Retains finite normalized polygon points. Inputs: point. Returns finite x/y boolean; no mutation. */ (
              point,
            ) => Number.isFinite(point.x) && Number.isFinite(point.y),
          )
      : [];
    return copy;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.localGroundToWorld.7 — Handles local ground to world within geometry. Inputs: instance; point. Uses: number. Returns: a record containing x, y. */
  /* @function geometry.reviewedlocalGroundToWorld_7 — Translates local footprint point by instance XY anchor. Inputs: instance and point in ground units. Returns new world XY, missing components0. No rotation/scale/elevation handling; caller uses legacy translation-only convention. */ function localGroundToWorld(
    instance,
    point,
  ) {
    return {
      x: Number(instance?.x || 0) + Number(point?.x || 0),
      y: Number(instance?.y || 0) + Number(point?.y || 0),
    };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.worldGroundToLocal.8 — Handles world ground to local within geometry. Inputs: instance; point. Uses: number. Returns: a record containing x, y. */
  /* @function geometry.reviewedworldGroundToLocal_8 — Subtracts instance XY anchor from world point. Inputs: instance/point in common ground units. Returns local XY, missing components0. No rotation/scale or mutation. */ function worldGroundToLocal(
    instance,
    point,
  ) {
    return {
      x: Number(point?.x || 0) - Number(instance?.x || 0),
      y: Number(point?.y || 0) - Number(instance?.y || 0),
    };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.worldBlockingPolygons.9 — Handles world blocking polygons within geometry. Inputs: instance; definition. Uses: geometry for definition using definition blocking map using a callback filter using a callback map; geometry for definition using definition blocking map using a callback filter; geometry for definition using definition blocking map; geometry for definition. Returns: geometry for definition using definition blocking map using a callback filter using a callback map using a callback. */
  /* @function geometry.reviewedworldBlockingPolygons_9 — Builds translated ground collision polygons for legacy prop. Inputs: instance/definition. Returns normalized detached polygon records with world XY points, only ground polygons with at least3 vertices. Does not include sprite hotzones or height-aware mesh collision. Clone/coercion errors propagate, no source mutation. */ function worldBlockingPolygons(
    instance,
    definition,
  ) {
    return geometryForDefinition(definition)
      .blocking.map(
        /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.callback.10 — Returns normalize polygon using polygon, "ground". Inputs: polygon. Uses: normalize polygon. Returns: normalize polygon using polygon, "ground". */
  /* @function geometry.reviewedcallback_10 — Normalizes one blocking polygon as ground by default. Inputs: polygon. Returns detached normalized record; no source mutation, clone errors propagate. */ (
          polygon,
        ) => normalizePolygon(polygon, "ground"),
      )
      .filter(
        /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.callback.11 — Returns polygon space equals "ground" and polygon points length is at least 3. Inputs: polygon. Returns: polygon space equals "ground" and polygon points length is at least 3. */
  /* @function geometry.reviewedcallback_11 — Keeps viable ground-space collision polygons. Inputs: polygon. Returns ground-space and at least3-point predicate; no geometric self-intersection validation or mutation. */ (
          polygon,
        ) => polygon.space === "ground" && polygon.points.length >= 3,
      )
      .map(
        /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.callback.12 — Returns a record containing copied fields, points. Inputs: polygon. Uses: polygon points map. Returns: a record containing copied fields, points. */
  /* @function geometry.reviewedcallback_12 — Copies polygon with translated world point list. Inputs: normalized polygon. Returns new record/points retaining other cloned metadata. No source mutation. */ (
          polygon,
        ) => ({
          ...polygon,
          points: polygon.points.map(
            /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.callback.13 — Returns local ground to world using instance, point. Inputs: point. Uses: local ground to world. Returns: local ground to world using instance, point. */
  /* @function geometry.reviewedcallback_13 — Translates one footprint vertex by current instance anchor. Inputs: point. Returns world XY; no mutation. */ (
              point,
            ) => localGroundToWorld(instance, point),
          ),
        }),
      );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.pointInPolygon.14 — Handles point in polygon within geometry. Inputs: point; points. Updates: j; inside. Uses: array is array; number. Returns: false; inside. */
  /* @function geometry.reviewedpointInPolygon_14 — Tests even-odd containment in2D. Inputs: point and polygon point array in same coordinate units. Returns false missing/less than3, otherwise ray-crossing boolean. Coerces missing/NaN components0; boundary inclusion follows inequality rather than separate edge test. No mutation; no elevation/radius handling. */ function pointInPolygon(
    point,
    points,
  ) {
    if (!point || !Array.isArray(points) || points.length < 3) return false;
    let inside = false;
    const x = Number(point.x) || 0;
    const y = Number(point.y) || 0;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = Number(points[i].x) || 0;
      const yi = Number(points[i].y) || 0;
      const xj = Number(points[j].x) || 0;
      const yj = Number(points[j].y) || 0;
      const intersects =
        yi > y !== yj > y &&
        x < ((xj - xi) * (y - yi)) / (yj - yi || Number.EPSILON) + xi;
      if (intersects) inside = !inside;
    }
    return inside;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.orientation.15 — Handles orientation within geometry. Inputs: a; b; c. Uses: number. Returns: 0; value is greater than 0 selects 1 or 2. */
  /* @function geometry.reviewedorientation_15 — Classifies planar turn for segment intersection. Inputs: a/b/c same-space points. Returns0 collinear tolerance1e-9,1 clockwise or2 counterclockwise in algebraic XY convention. Number coercion without fallback; invalid coordinates not validated. No mutation. */ function orientation(
    a,
    b,
    c,
  ) {
    const value =
      (Number(b.y) - Number(a.y)) * (Number(c.x) - Number(b.x)) -
      (Number(b.x) - Number(a.x)) * (Number(c.y) - Number(b.y));
    if (Math.abs(value) < 1e-9) return 0;
    return value > 0 ? 1 : 2;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.onSegment.16 — Handles on segment within geometry. Inputs: a; b; c. Uses: number. Returns: number using b x is at most math max using number using a x, number using c x plus 1e-9 and number using b x plus 1e-9 is at least math min using number using a x, number using c x and number using b y is at most math max using number using a y, number using c y plus 1e-9 and number using b y plus 1e-9 is at least math min using number using a y, number using c y. */
  /* @function geometry.reviewedonSegment_16 — Tests bounding inclusion for collinear point b on a-c. Inputs: a/b/c same coordinate space. Returns inclusive coordinate-box check with1e-9 tolerance. Does not itself establish collinearity; caller checks orientation. No mutation. */ function onSegment(
    a,
    b,
    c,
  ) {
    return (
      Number(b.x) <= Math.max(Number(a.x), Number(c.x)) + 1e-9 &&
      Number(b.x) + 1e-9 >= Math.min(Number(a.x), Number(c.x)) &&
      Number(b.y) <= Math.max(Number(a.y), Number(c.y)) + 1e-9 &&
      Number(b.y) + 1e-9 >= Math.min(Number(a.y), Number(c.y))
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.segmentsIntersect.17 — Handles segments intersect within geometry. Inputs: p1; q1; p2; q2. Uses: orientation; on segment. Returns: true; true. */
  /* @function geometry.reviewedsegmentsIntersect_17 — Tests inclusive2D segment crossing/touch. Inputs: endpoints p1/q1,p2/q2 in same units. Returns boolean using orientation and collinear containment. No radius/elevation or mutation; assumes finite points. */ function segmentsIntersect(
    p1,
    q1,
    p2,
    q2,
  ) {
    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);
    if (o1 !== o2 && o3 !== o4) return true;
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;
    return false;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.distancePointToSegment.18 — Handles distance point to segment within geometry. Inputs: point; a; b. Uses: number. Returns: math hypot using px minus ax, py minus ay; math hypot using px minus ax plus t multiplied by dx, py minus ay plus t multiplied by dy. */
  /* @function geometry.revieweddistancePointToSegment_18 — Computes closest planar distance to finite segment. Inputs: point/a/b in same coordinate units. Returns distance with clamped projection; near-zero squared length<=1e-12 uses endpoint distance. Missing/NaN components0. No mutation or height handling. */ function distancePointToSegment(
    point,
    a,
    b,
  ) {
    const px = Number(point?.x) || 0,
      py = Number(point?.y) || 0;
    const ax = Number(a?.x) || 0,
      ay = Number(a?.y) || 0;
    const bx = Number(b?.x) || 0,
      by = Number(b?.y) || 0;
    const dx = bx - ax,
      dy = by - ay;
    const len2 = dx * dx + dy * dy;
    if (len2 <= 1e-12) return Math.hypot(px - ax, py - ay);
    const t = Math.max(
      0,
      Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2),
    );
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.pointNearPolygon.19 — Handles point near polygon within geometry. Inputs: point; points; assignment pattern. Updates: i. Uses: point in polygon; number; array is array; distance point to segment. Returns: true; false. */
  /* @function geometry.reviewedpointNearPolygon_19 — Tests containment or radius-near polygon edges. Inputs: point, points and radius(default0) in same units. Returns true inside or distance<=nonnegative radius; false invalid/short edges without containment. Coerces invalid radius0. No mutation; includes closing edge. */ function pointNearPolygon(
    point,
    points,
    radius = 0,
  ) {
    if (pointInPolygon(point, points)) return true;
    const r = Math.max(0, Number(radius) || 0);
    if (!r || !Array.isArray(points) || points.length < 2) return false;
    for (let i = 0; i < points.length; i += 1) {
      if (
        distancePointToSegment(
          point,
          points[i],
          points[(i + 1) % points.length],
        ) <= r
      )
        return true;
    }
    return false;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.polygonOverlapsRect.20 — Handles polygon overlaps rect within geometry. Inputs: points; rect. Updates: i. Uses: array is array; corners some; points some; segment intersects polygon. Returns: false; true. */
  /* @function geometry.reviewedpolygonOverlapsRect_20 — Tests polygon against axis-aligned rectangle. Inputs: points and rect x1/y1/x2/y2 in same space, ordered bounds expected. Returns false missing/short polygon, true for contained corner/vertex or edge intersection. No mutation; no elevation/radius semantics. */ function polygonOverlapsRect(
    points,
    rect,
  ) {
    if (!Array.isArray(points) || points.length < 3 || !rect) return false;
    const corners = [
      {
        x: rect.x1,
        y: rect.y1,
      },
      {
        x: rect.x2,
        y: rect.y1,
      },
      {
        x: rect.x2,
        y: rect.y2,
      },
      {
        x: rect.x1,
        y: rect.y2,
      },
    ];
    if (
      corners.some(
        /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.callback.21 — Returns point in polygon using p, points. Inputs: p. Uses: point in polygon. Returns: point in polygon using p, points. */
  /* @function geometry.reviewedcallback_21 — Tests rectangle corner inside polygon. Inputs: p and captured points. Returns containment result; no mutation. */ (
          p,
        ) => pointInPolygon(p, points),
      )
    )
      return true;
    if (
      points.some(
        /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.callback.22 — Returns p x is at least rect x1 and p x is at most rect x2 and p y is at least rect y1 and p y is at most rect y2. Inputs: p. Returns: p x is at least rect x1 and p x is at most rect x2 and p y is at least rect y1 and p y is at most rect y2. */
  /* @function geometry.reviewedcallback_22 — Tests polygon vertex within rectangle bounds. Inputs: p and captured rect. Returns inclusive XY bounds predicate; no mutation. */ (
          p,
        ) =>
          p.x >= rect.x1 && p.x <= rect.x2 && p.y >= rect.y1 && p.y <= rect.y2,
      )
    )
      return true;
    for (let i = 0; i < 4; i += 1) {
      if (segmentIntersectsPolygon(corners[i], corners[(i + 1) % 4], points))
        return true;
    }
    return false;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.segmentIntersectsPolygon.23 — Handles segment intersects polygon within geometry. Inputs: a; b; points. Updates: i. Uses: array is array; point in polygon; segments intersect. Returns: false; true. */
  /* @function geometry.reviewedsegmentIntersectsPolygon_23 — Tests planar segment against polygon interior/edges. Inputs: a/b and points. Returns false invalid/less than3, otherwise endpoint containment or inclusive edge crossing. No source mutation; no thickness/elevation check. */ function segmentIntersectsPolygon(
    a,
    b,
    points,
  ) {
    if (!Array.isArray(points) || points.length < 3) return false;
    if (pointInPolygon(a, points) || pointInPolygon(b, points)) return true;
    for (let i = 0; i < points.length; i += 1) {
      const p = points[i];
      const q = points[(i + 1) % points.length];
      if (segmentsIntersect(a, b, p, q)) return true;
    }
    return false;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.movementBlocked.24 — Handles movement blocked within geometry. Inputs: instance; definition; from point; to point. Uses: world blocking polygons using instance, definition some; world blocking polygons. Returns: world blocking polygons using instance, definition some using a callback. */
  /* @function geometry.reviewedmovementBlocked_24 — Tests legacy zero-radius movement segment against prop footprints. Inputs: instance, definition and world fromPoint/toPoint. Returns true if any translated ground polygon intersects. Does not perform modern body/mesh/support collision. No mutation; normalization errors propagate. */ function movementBlocked(
    instance,
    definition,
    fromPoint,
    toPoint,
  ) {
    return worldBlockingPolygons(instance, definition).some(
      /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.callback.25 — Returns segment intersects polygon using from point, to point, polygon points. Inputs: polygon. Uses: segment intersects polygon. Returns: segment intersects polygon using from point, to point, polygon points. */
  /* @function geometry.reviewedcallback_25 — Tests one world blocking polygon against movement segment. Inputs: polygon and captured endpoints. Returns segment intersection boolean; no mutation. */ (
        polygon,
      ) => segmentIntersectsPolygon(fromPoint, toPoint, polygon.points),
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.rectangleFromFootprint.26 — Handles rectangle from footprint within geometry. Inputs: footprint. Uses: number. Returns: a list of a record containing x, y, a record containing x, y, a record containing x, y, a record containing x, y. */
  /* @function geometry.reviewedrectangleFromFootprint_26 — Creates centred local rectangular footprint. Inputs: optional footprint w/h in ground units. Returns4 XY corners; defaults sizes1, clamps each minimum0.05. Does not rotate/translate or mutate; nonfinite Infinity not rejected here. */ function rectangleFromFootprint(
    footprint,
  ) {
    const w = Math.max(0.05, Number(footprint?.w) || 1);
    const h = Math.max(0.05, Number(footprint?.h) || 1);
    return [
      {
        x: -w / 2,
        y: -h / 2,
      },
      {
        x: w / 2,
        y: -h / 2,
      },
      {
        x: w / 2,
        y: h / 2,
      },
      {
        x: -w / 2,
        y: h / 2,
      },
    ];
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.polygonBounds.27 — Handles polygon bounds within geometry. Inputs: points. Uses: array is array; points map. Returns: null; a record containing minX, minY, maxX, maxY. */
  /* @function geometry.reviewedpolygonBounds_27 — Computes planar polygon bounds. Inputs: point array. Returns minX/minY/maxX/maxY or null missing/empty. Number-coerces coordinates with falsey/NaN fallback0; Infinity retained, so caller validates geometry. No mutation. */ function polygonBounds(
    points,
  ) {
    if (!Array.isArray(points) || !points.length) return null;
    const xs = points.map(
      /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.callback.28 — Returns number using p x or 0. Inputs: p. Uses: number. Returns: number using p x or 0. */
  /* @function geometry.reviewedcallback_28 — Reads coerced X for bounds. Inputs: p. Returns Number(p.x) or0; no mutation. */ (
        p,
      ) => Number(p.x) || 0,
    );
    const ys = points.map(
      /* Historical contract retained; October 14 reviewed explanation follows. @function geometry.callback.29 — Returns number using p y or 0. Inputs: p. Uses: number. Returns: number using p y or 0. */
  /* @function geometry.reviewedcallback_29 — Reads coerced Y for bounds. Inputs: p. Returns Number(p.y) or0; no mutation. */ (
        p,
      ) => Number(p.y) || 0,
    );
    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys),
    };
  }
  root.MFGeometry = {
    geometryForDefinition,
    normalizePolygon,
    localGroundToWorld,
    worldGroundToLocal,
    worldBlockingPolygons,
    pointInPolygon,
    segmentsIntersect,
    segmentIntersectsPolygon,
    distancePointToSegment,
    pointNearPolygon,
    polygonOverlapsRect,
    movementBlocked,
    rectangleFromFootprint,
    polygonBounds,
  };
})(globalThis);
