/* October 12, 2026: prefab connectors are authored in engine-local metres.
 * Snapping translates a proposal; it never rotates a piece unexpectedly. Authors
 * set orientation before placement. Save records retain anchors and dimensions. */
(/* @function prefabPlacement.install — Inputs: browser/test global. Returns: nothing. Installs pure connector operations; no asset loading or world mutation. */ function (
  root,
) {
  "use strict";
  const normals = {
    bottom: [0, 0, -1],
    top: [0, 0, 1],
    left: [-1, 0, 0],
    right: [1, 0, 0],
    door: [0, -1, 0],
  };
  /* @function prefabPlacement.profile — Inputs: prefab dimension metadata and XYZ scale. Returns square/tower/wall physical profile or null. Roof footprints include 0.2m wall thickness in this kit; removes that allowance when matching clear room dimensions. Rejects unsupported/nonfinite dimensions without guessing arbitrary imported connectors. No mutation. */
  function profile(metadata, scale) {
    const d = metadata?.dimensions;
    if (!d) return null;
    let kind, w, h;
    if (d.clearDiameter !== undefined) {
      kind = "tower";
      w = h = d.clearDiameter;
    } else if (d.radius !== undefined) {
      kind = "tower";
      w = h = (d.radius - 0.2) * 2;
    } else if (d.clearWidth !== undefined) {
      kind = "square";
      w = d.clearWidth;
      h = d.clearDepth;
    } else if (
      d.width !== undefined &&
      d.depth !== undefined &&
      d.walkwayHeight === undefined
    ) {
      kind = "square";
      w = d.width - 0.4;
      h = d.depth - 0.4;
    } else if (d.walkwayHeight !== undefined) {
      kind = "wall";
      w = d.depth;
      h = d.walkwayHeight;
    } else return null;
    w *= Math.abs(scale?.[0] ?? 1);
    h *= Math.abs(scale?.[1] ?? 1);
    return Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0
      ? { kind, w, h }
      : null;
  }
  /* @function prefabPlacement.anchors — Inputs: prefab connector metadata and validated world transform. Returns world point/unit-normal/name records, excluding malformed or unsupported anchors. Scale/rotation affect point positions; inverse-transpose normal handling supports nonuniform scale. No mutation or retained scene references. */
  function anchors(metadata, transform) {
    const T = root.FrontierModelTransform,
      matrix = T.matrix(transform),
      inverse = T.inverse(matrix),
      result = [];
    for (const [name, point] of Object.entries(metadata?.connectors || {})) {
      const n = normals[name];
      if (
        !n ||
        !Array.isArray(point) ||
        point.length !== 3 ||
        !point.every(Number.isFinite)
      )
        continue;
      const normal = [
          inverse[0] * n[0] + inverse[1] * n[1] + inverse[2] * n[2],
          inverse[4] * n[0] + inverse[5] * n[1] + inverse[6] * n[2],
          inverse[8] * n[0] + inverse[9] * n[1] + inverse[10] * n[2],
        ],
        length = Math.hypot(...normal);
      if (length < 1e-9) continue;
      for (let i = 0; i < 3; i++) normal[i] /= length;
      result.push({ name, point: T.vector(matrix, point), normal });
    }
    return result;
  }
  /* @function prefabPlacement.snap — Inputs: proposed world transform/metadata, candidate ID/metadata/transform records and maximum metre gap. Returns cloned transform plus connection evidence or null connection. Matches opposed normals and compatible physical profiles; stable IDs break equal-gap ties. No rotation, parent/world mutation or model decoding. Throws malformed source transforms through shared validation. */
  function snap(transform, metadata, candidates, distance = 0.75) {
    if (!Number.isFinite(distance) || distance < 0 || distance > 10)
      throw Error("Prefab snap distance must be 0–10 metres.");
    const source = anchors(metadata, transform),
      kind = profile(metadata, transform.scale);
    let best = null;
    for (const candidate of candidates) {
      const targetKind = profile(candidate.metadata, candidate.transform.scale);
      if (
        !kind ||
        !targetKind ||
        kind.kind !== targetKind.kind ||
        Math.abs(kind.w - targetKind.w) > 0.001 ||
        Math.abs(kind.h - targetKind.h) > 0.001
      )
        continue;
      for (const a of source)
        for (const b of anchors(candidate.metadata, candidate.transform)) {
          if (
            a.normal[0] * b.normal[0] +
              a.normal[1] * b.normal[1] +
              a.normal[2] * b.normal[2] >
            -0.999
          )
            continue;
          if ((a.name === "door") !== (b.name === "door")) continue;
          const delta = [
              b.point[0] - a.point[0],
              b.point[1] - a.point[1],
              b.point[2] - a.point[2],
            ],
            gap = Math.hypot(...delta),
            key = candidate.id + "/" + b.name + "/" + a.name;
          if (
            gap <= distance &&
            (!best ||
              gap < best.gap - 1e-8 ||
              (Math.abs(gap - best.gap) < 1e-8 && key < best.key))
          )
            best = {
              gap,
              key,
              delta,
              targetId: candidate.id,
              source: a.name,
              target: b.name,
            };
        }
    }
    const result = structuredClone(transform);
    if (best) for (let i = 0; i < 3; i++) result.position[i] += best.delta[i];
    return { transform: result, connection: best };
  }
  root.FrontierPrefabPlacement = { profile, anchors, snap };
})(typeof window === "undefined" ? globalThis : window);
