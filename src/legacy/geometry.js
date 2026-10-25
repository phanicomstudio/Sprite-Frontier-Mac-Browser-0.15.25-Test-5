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
(/* @function geometry.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root mfgeometry. */ function (root) {
"use strict"  ;
  /* @function geometry.clone.2 — Handles clone within geometry. Inputs: value. Uses: structured clone; json parse; json stringify. Returns: typeof structured clone equals "function" selects structured clone using value or json parse using json stringify using value. */ function clone(value) {
    return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
  }
  /* @function geometry.geometryForDefinition.3 — Handles geometry for definition within geometry. Inputs: definition. Uses: array is array. Returns: a record containing blocking, sort, hotZones, depth; a record containing blocking, sort, hotZones, depth. */ function geometryForDefinition(definition) {
    if (!definition)
    return {
      blocking: [],
      sort: [],
      hotZones: [],
      depth: {
        mode: "anchor", offset: 0
      }
      ,
    }
    ;
    const geometry =
    definition.geometry && typeof definition.geometry === "object"
    ? definition.geometry
    : {
    }
    ;
    return {
      blocking: Array.isArray(geometry.blocking) ? geometry.blocking : [],
      sort: Array.isArray(geometry.sort) ? geometry.sort : [],
      hotZones: Array.isArray(geometry.hotZones) ? geometry.hotZones : [],
      depth:
      geometry.depth && typeof geometry.depth === "object"
      ? geometry.depth
      : {
        mode: "blocking-front", offset: 0
      }
      ,
    }
    ;
  }
  /* @function geometry.normalizePolygon.4 — Handles normalize polygon within geometry. Inputs: polygon; assignment pattern. Updates: copy id; copy space; copy points. Uses: clone; array is array; copy points map using a callback filter; copy points map. Returns: copy. */ function normalizePolygon(polygon, fallbackSpace = "ground") {
    const copy = clone(polygon || {
    }
    );
    copy.id = copy.id || "polygon";
    copy.space = copy.space === "sprite" ? "sprite" : fallbackSpace;
    copy.points = Array.isArray(copy.points)
    ? copy.points
    .map(/* @function geometry.callback.5 — Returns a record containing x, y. Inputs: point. Uses: number. Returns: a record containing x, y. */ (point) => ({
      x: Number(point?.x) || 0,
      y: Number(point?.y) || 0,
    }
    ))
    .filter(
    /* @function geometry.callback.6 — Returns number is finite using point x and number is finite using point y. Inputs: point. Uses: number is finite. Returns: number is finite using point x and number is finite using point y. */ (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
    )
    : [];
    return copy;
  }
  /* @function geometry.localGroundToWorld.7 — Handles local ground to world within geometry. Inputs: instance; point. Uses: number. Returns: a record containing x, y. */ function localGroundToWorld(instance, point) {
    return {
      x: Number(instance?.x || 0) + Number(point?.x || 0),
      y: Number(instance?.y || 0) + Number(point?.y || 0),
    }
    ;
  }
  /* @function geometry.worldGroundToLocal.8 — Handles world ground to local within geometry. Inputs: instance; point. Uses: number. Returns: a record containing x, y. */ function worldGroundToLocal(instance, point) {
    return {
      x: Number(point?.x || 0) - Number(instance?.x || 0),
      y: Number(point?.y || 0) - Number(instance?.y || 0),
    }
    ;
  }
  /* @function geometry.worldBlockingPolygons.9 — Handles world blocking polygons within geometry. Inputs: instance; definition. Uses: geometry for definition using definition blocking map using a callback filter using a callback map; geometry for definition using definition blocking map using a callback filter; geometry for definition using definition blocking map; geometry for definition. Returns: geometry for definition using definition blocking map using a callback filter using a callback map using a callback. */ function worldBlockingPolygons(instance, definition) {
    return geometryForDefinition(definition)
    .blocking.map(/* @function geometry.callback.10 — Returns normalize polygon using polygon, "ground". Inputs: polygon. Uses: normalize polygon. Returns: normalize polygon using polygon, "ground". */ (polygon) => normalizePolygon(polygon, "ground"))
    .filter(
    /* @function geometry.callback.11 — Returns polygon space equals "ground" and polygon points length is at least 3. Inputs: polygon. Returns: polygon space equals "ground" and polygon points length is at least 3. */ (polygon) => polygon.space === "ground" && polygon.points.length >= 3,
    )
    .map(/* @function geometry.callback.12 — Returns a record containing copied fields, points. Inputs: polygon. Uses: polygon points map. Returns: a record containing copied fields, points. */ (polygon) => ({
      ...polygon,
      points: polygon.points.map(/* @function geometry.callback.13 — Returns local ground to world using instance, point. Inputs: point. Uses: local ground to world. Returns: local ground to world using instance, point. */ (point) =>
      localGroundToWorld(instance, point),
      ),
    }
    ));
  }
  /* @function geometry.pointInPolygon.14 — Handles point in polygon within geometry. Inputs: point; points. Updates: j; inside. Uses: array is array; number. Returns: false; inside. */ function pointInPolygon(point, points) {
    if (!point || !Array.isArray(points) || points.length < 3) return false;
    let inside = false;
    const x = Number(point.x) || 0;
    const y = Number(point.y) || 0;
    for (let i = 0, j = points.length - 1;
    i < points.length;
    j = i++) {
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
  /* @function geometry.orientation.15 — Handles orientation within geometry. Inputs: a; b; c. Uses: number. Returns: 0; value is greater than 0 selects 1 or 2. */ function orientation(a, b, c) {
    const value =
    (Number(b.y) - Number(a.y)) * (Number(c.x) - Number(b.x)) -
    (Number(b.x) - Number(a.x)) * (Number(c.y) - Number(b.y));
    if (Math.abs(value) < 1e-9) return 0;
    return value > 0 ? 1 : 2;
  }
  /* @function geometry.onSegment.16 — Handles on segment within geometry. Inputs: a; b; c. Uses: number. Returns: number using b x is at most math max using number using a x, number using c x plus 1e-9 and number using b x plus 1e-9 is at least math min using number using a x, number using c x and number using b y is at most math max using number using a y, number using c y plus 1e-9 and number using b y plus 1e-9 is at least math min using number using a y, number using c y. */ function onSegment(a, b, c) {
    return (
    Number(b.x) <= Math.max(Number(a.x), Number(c.x)) + 1e-9 &&
    Number(b.x) + 1e-9 >= Math.min(Number(a.x), Number(c.x)) &&
    Number(b.y) <= Math.max(Number(a.y), Number(c.y)) + 1e-9 &&
    Number(b.y) + 1e-9 >= Math.min(Number(a.y), Number(c.y))
    );
  }
  /* @function geometry.segmentsIntersect.17 — Handles segments intersect within geometry. Inputs: p1; q1; p2; q2. Uses: orientation; on segment. Returns: true; true. */ function segmentsIntersect(p1, q1, p2, q2) {
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
  /* @function geometry.distancePointToSegment.18 — Handles distance point to segment within geometry. Inputs: point; a; b. Uses: number. Returns: math hypot using px minus ax, py minus ay; math hypot using px minus ax plus t multiplied by dx, py minus ay plus t multiplied by dy. */ function distancePointToSegment(point, a, b) {
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
  /* @function geometry.pointNearPolygon.19 — Handles point near polygon within geometry. Inputs: point; points; assignment pattern. Updates: i. Uses: point in polygon; number; array is array; distance point to segment. Returns: true; false. */ function pointNearPolygon(point, points, radius = 0) {
    if (pointInPolygon(point, points)) return true;
    const r = Math.max(0, Number(radius) || 0);
    if (!r || !Array.isArray(points) || points.length < 2) return false;
    for (let i = 0;
    i < points.length;
    i += 1) {
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
  /* @function geometry.polygonOverlapsRect.20 — Handles polygon overlaps rect within geometry. Inputs: points; rect. Updates: i. Uses: array is array; corners some; points some; segment intersects polygon. Returns: false; true. */ function polygonOverlapsRect(points, rect) {
    if (!Array.isArray(points) || points.length < 3 || !rect) return false;
    const corners = [
    {
      x: rect.x1, y: rect.y1
    }
    ,
    {
      x: rect.x2, y: rect.y1
    }
    ,
    {
      x: rect.x2, y: rect.y2
    }
    ,
    {
      x: rect.x1, y: rect.y2
    }
    ,
    ];
    if (corners.some(/* @function geometry.callback.21 — Returns point in polygon using p, points. Inputs: p. Uses: point in polygon. Returns: point in polygon using p, points. */ (p) => pointInPolygon(p, points))) return true;
    if (
    points.some(
    /* @function geometry.callback.22 — Returns p x is at least rect x1 and p x is at most rect x2 and p y is at least rect y1 and p y is at most rect y2. Inputs: p. Returns: p x is at least rect x1 and p x is at most rect x2 and p y is at least rect y1 and p y is at most rect y2. */ (p) =>
    p.x >= rect.x1 && p.x <= rect.x2 && p.y >= rect.y1 && p.y <= rect.y2,
    )
    )
    return true;
    for (let i = 0;
    i < 4;
    i += 1) {
      if (segmentIntersectsPolygon(corners[i], corners[(i + 1) % 4], points))
      return true;
    }
    return false;
  }
  /* @function geometry.segmentIntersectsPolygon.23 — Handles segment intersects polygon within geometry. Inputs: a; b; points. Updates: i. Uses: array is array; point in polygon; segments intersect. Returns: false; true. */ function segmentIntersectsPolygon(a, b, points) {
    if (!Array.isArray(points) || points.length < 3) return false;
    if (pointInPolygon(a, points) || pointInPolygon(b, points)) return true;
    for (let i = 0;
    i < points.length;
    i += 1) {
      const p = points[i];
      const q = points[(i + 1) % points.length];
      if (segmentsIntersect(a, b, p, q)) return true;
    }
    return false;
  }
  /* @function geometry.movementBlocked.24 — Handles movement blocked within geometry. Inputs: instance; definition; from point; to point. Uses: world blocking polygons using instance, definition some; world blocking polygons. Returns: world blocking polygons using instance, definition some using a callback. */ function movementBlocked(instance, definition, fromPoint, toPoint) {
    return worldBlockingPolygons(instance, definition).some(/* @function geometry.callback.25 — Returns segment intersects polygon using from point, to point, polygon points. Inputs: polygon. Uses: segment intersects polygon. Returns: segment intersects polygon using from point, to point, polygon points. */ (polygon) =>
    segmentIntersectsPolygon(fromPoint, toPoint, polygon.points),
    );
  }
  /* @function geometry.rectangleFromFootprint.26 — Handles rectangle from footprint within geometry. Inputs: footprint. Uses: number. Returns: a list of a record containing x, y, a record containing x, y, a record containing x, y, a record containing x, y. */ function rectangleFromFootprint(footprint) {
    const w = Math.max(0.05, Number(footprint?.w) || 1);
    const h = Math.max(0.05, Number(footprint?.h) || 1);
    return [
    {
      x: -w / 2, y: -h / 2
    }
    ,
    {
      x: w / 2, y: -h / 2
    }
    ,
    {
      x: w / 2, y: h / 2
    }
    ,
    {
      x: -w / 2, y: h / 2
    }
    ,
    ];
  }
  /* @function geometry.polygonBounds.27 — Handles polygon bounds within geometry. Inputs: points. Uses: array is array; points map. Returns: null; a record containing minX, minY, maxX, maxY. */ function polygonBounds(points) {
    if (!Array.isArray(points) || !points.length) return null;
    const xs = points.map(/* @function geometry.callback.28 — Returns number using p x or 0. Inputs: p. Uses: number. Returns: number using p x or 0. */ (p) => Number(p.x) || 0);
    const ys = points.map(/* @function geometry.callback.29 — Returns number using p y or 0. Inputs: p. Uses: number. Returns: number using p y or 0. */ (p) => Number(p.y) || 0);
    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys),
    }
    ;
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
  }
  ;
}
)(globalThis);
