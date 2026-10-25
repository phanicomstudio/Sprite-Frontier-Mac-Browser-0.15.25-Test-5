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
(function (root) {
"use strict"  ;
  function clone(value) {
    return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
  }
  function geometryForDefinition(definition) {
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
  function normalizePolygon(polygon, fallbackSpace = "ground") {
    const copy = clone(polygon || {
    }
    );
    copy.id = copy.id || "polygon";
    copy.space = copy.space === "sprite" ? "sprite" : fallbackSpace;
    copy.points = Array.isArray(copy.points)
    ? copy.points
    .map((point) => ({
      x: Number(point?.x) || 0,
      y: Number(point?.y) || 0,
    }
    ))
    .filter(
    (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
    )
    : [];
    return copy;
  }
  function localGroundToWorld(instance, point) {
    return {
      x: Number(instance?.x || 0) + Number(point?.x || 0),
      y: Number(instance?.y || 0) + Number(point?.y || 0),
    }
    ;
  }
  function worldGroundToLocal(instance, point) {
    return {
      x: Number(point?.x || 0) - Number(instance?.x || 0),
      y: Number(point?.y || 0) - Number(instance?.y || 0),
    }
    ;
  }
  function worldBlockingPolygons(instance, definition) {
    return geometryForDefinition(definition)
    .blocking.map((polygon) => normalizePolygon(polygon, "ground"))
    .filter(
    (polygon) => polygon.space === "ground" && polygon.points.length >= 3,
    )
    .map((polygon) => ({
      ...polygon,
      points: polygon.points.map((point) =>
      localGroundToWorld(instance, point),
      ),
    }
    ));
  }
  function pointInPolygon(point, points) {
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
  function orientation(a, b, c) {
    const value =
    (Number(b.y) - Number(a.y)) * (Number(c.x) - Number(b.x)) -
    (Number(b.x) - Number(a.x)) * (Number(c.y) - Number(b.y));
    if (Math.abs(value) < 1e-9) return 0;
    return value > 0 ? 1 : 2;
  }
  function onSegment(a, b, c) {
    return (
    Number(b.x) <= Math.max(Number(a.x), Number(c.x)) + 1e-9 &&
    Number(b.x) + 1e-9 >= Math.min(Number(a.x), Number(c.x)) &&
    Number(b.y) <= Math.max(Number(a.y), Number(c.y)) + 1e-9 &&
    Number(b.y) + 1e-9 >= Math.min(Number(a.y), Number(c.y))
    );
  }
  function segmentsIntersect(p1, q1, p2, q2) {
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
  function distancePointToSegment(point, a, b) {
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
  function pointNearPolygon(point, points, radius = 0) {
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
  function polygonOverlapsRect(points, rect) {
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
    if (corners.some((p) => pointInPolygon(p, points))) return true;
    if (
    points.some(
    (p) =>
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
  function segmentIntersectsPolygon(a, b, points) {
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
  function movementBlocked(instance, definition, fromPoint, toPoint) {
    return worldBlockingPolygons(instance, definition).some((polygon) =>
    segmentIntersectsPolygon(fromPoint, toPoint, polygon.points),
    );
  }
  function rectangleFromFootprint(footprint) {
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
  function polygonBounds(points) {
    if (!Array.isArray(points) || !points.length) return null;
    const xs = points.map((p) => Number(p.x) || 0);
    const ys = points.map((p) => Number(p.y) || 0);
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
