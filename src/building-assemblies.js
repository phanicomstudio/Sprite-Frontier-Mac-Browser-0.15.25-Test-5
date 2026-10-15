/* October 13: editor-only transforms for generated stair assemblies. Parts
 * retain ordinary geometry/collision and IDs. The owning editor transaction
 * validates bounds and supplies undo; helpers never write history or files. */
(/* @function buildingAssemblies.install — Inputs: browser/global namespace. Returns nothing; publishes pure membership/preview helpers and explicitly mutating transforms. No DOM or scene allocation at installation. */ function (
  root,
) {
  "use strict";
  /* @function buildingAssemblies.members — Inputs: primitive list, selected ID and whole-assembly flag. Returns live matching records, or an empty array for stale selection. Ordinary walls remain individual; assembly identity is explicit metadata. Does not mutate or retain records. */
  function members(primitives, id, whole = true) {
    const selected = primitives.find(
      /* @function buildingAssemblies.selected — Inputs: primitive. Returns stable-ID selection match. */ function (
        piece,
      ) {
        return piece.id === id;
      },
    );
    if (!selected) return [];
    return whole && selected.assemblyId
      ? primitives.filter(
          /* @function buildingAssemblies.sameAssembly — Inputs: primitive. Returns exact assembly identity match, without grouping unrelated room surfaces. */ function (
            piece,
          ) {
            return piece.assemblyId === selected.assemblyId;
          },
        )
      : [selected];
  }
  /* @function buildingAssemblies.bounds — Inputs: nonempty part list. Returns enclosing world XY center, width/depth and Z base/height, accounting for each part's yaw. Throws empty input. Bounds are conservative for round/arc shapes and are used for editor pivots/previews, not physical collision. */
  function bounds(parts) {
    if (!parts.length) throw Error("Select a building piece first.");
    let x0 = Infinity,
      y0 = Infinity,
      z0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity,
      z1 = -Infinity;
    for (const part of parts) {
      const c = Math.abs(Math.cos(part.yaw || 0)),
        s = Math.abs(Math.sin(part.yaw || 0)),
        w = (part.w * c + part.d * s) / 2,
        d = (part.w * s + part.d * c) / 2;
      x0 = Math.min(x0, part.x - w);
      x1 = Math.max(x1, part.x + w);
      y0 = Math.min(y0, part.y - d);
      y1 = Math.max(y1, part.y + d);
      z0 = Math.min(z0, part.z);
      z1 = Math.max(z1, part.z + part.h);
    }
    return {
      x: (x0 + x1) / 2,
      y: (y0 + y1) / 2,
      z: z0,
      w: x1 - x0,
      d: y1 - y0,
      h: z1 - z0,
    };
  }
  /* @function buildingAssemblies.axis — Inputs: selected part, X/Y/Z axis name and local-space flag. Returns unit world direction; local horizontal axes follow part yaw, Z remains up. Throws unknown axis. Does not change selected geometry. */
  function axis(part, name, local = false) {
    if (!["x", "y", "z"].includes(name)) throw Error("Unknown transform axis.");
    if (name === "z") return [0, 0, 1];
    const angle = local ? part.yaw || 0 : 0,
      c = Math.cos(angle),
      s = Math.sin(angle);
    return name === "x" ? [c, s, 0] : [-s, c, 0];
  }
  /* @function buildingAssemblies.translate — Inputs: primitive list, selected ID, finite XYZ delta in world metres and whole flag. Returns transformed member count. Mutates only matching positions, leaving dimensions/materials/IDs unchanged. Throws invalid deltas before mutation; owning validated transaction handles out-of-map rejection atomically. */
  function translate(primitives, id, delta, whole = true) {
    if (
      !Array.isArray(delta) ||
      delta.length !== 3 ||
      !delta.every(
        /* @function buildingAssemblies.finiteDelta — Inputs: delta component. Returns finite-number validity. */ function (
          value,
        ) {
          return Number.isFinite(value);
        },
      )
    )
      throw Error("Movement needs finite X/Y/Z distances.");
    const parts = members(primitives, id, whole);
    for (const part of parts) {
      part.x += delta[0];
      part.y += delta[1];
      part.z += delta[2];
    }
    return parts.length;
  }
  /* @function buildingAssemblies.rotate — Inputs: primitive list, selected ID, finite angle in radians and whole flag. Returns transformed member count. Rotates centers and yaw around the assembly's enclosing XY center; individual pieces rotate around their own center. Baseline stair direction metadata remains unchanged because connectors rotate it with yaw. Materials and elevation are unchanged; validation/history belong to caller. */
  function rotate(primitives, id, angle, whole = true) {
    if (!Number.isFinite(angle)) throw Error("Rotation must be finite.");
    const parts = members(primitives, id, whole);
    if (!parts.length) return 0;
    const pivot = bounds(parts),
      c = Math.cos(angle),
      s = Math.sin(angle);
    for (const part of parts) {
      const x = part.x - pivot.x,
        y = part.y - pivot.y;
      part.x = pivot.x + c * x - s * y;
      part.y = pivot.y + s * x + c * y;
      const yaw = (part.yaw || 0) + angle;
      part.yaw = Math.atan2(Math.sin(yaw), Math.cos(yaw));
    }
    return parts.length;
  }
  /* @function buildingAssemblies.localBounds — Inputs: nonempty selected parts and reference yaw in radians. Returns local XY center/spans and world Z base/span for resize pivots. Throws mixed nonaligned orientations instead of approximating unsupported shear. Does not mutate geometry; round single pieces use their conservative diameter. */
  function localBounds(parts, yaw) {
    if (!parts.length) throw Error("Select a building piece first.");
    const c = Math.cos(yaw),
      s = Math.sin(yaw);
    let x0 = Infinity,
      y0 = Infinity,
      z0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity,
      z1 = -Infinity;
    for (const part of parts) {
      if (
        Math.abs(Math.sin((part.yaw || 0) - yaw)) > 1e-7 ||
        Math.cos((part.yaw || 0) - yaw) < 0.9999999
      )
        throw Error(
          "Resize assembly parts must share one orientation. Edit the changed part separately.",
        );
      const x = c * part.x + s * part.y,
        y = -s * part.x + c * part.y;
      x0 = Math.min(x0, x - part.w / 2);
      x1 = Math.max(x1, x + part.w / 2);
      y0 = Math.min(y0, y - part.d / 2);
      y1 = Math.max(y1, y + part.d / 2);
      z0 = Math.min(z0, part.z);
      z1 = Math.max(z1, part.z + part.h);
    }
    return {
      x: (x0 + x1) / 2,
      y: (y0 + y1) / 2,
      z: z0,
      w: x1 - x0,
      d: y1 - y0,
      h: z1 - z0,
    };
  }
  /* @function buildingAssemblies.resize — Inputs: primitive list, selected ID, local X/Y/Z dimension, positive scale factor and whole flag. Returns changed member count. Scales aligned parts about their local XY center and lowest Z base; Z also scales stair rise metadata. Round X/Y resize stays circular by scaling both radii/diameters. Validates all computed dimensions before mutating; rejects mixed orientations, negative/too-small geometry and unsupported multi-part round groups. Materials/UV settings stay independent. Owning transaction enforces world bounds/history. */
  function resize(primitives, id, name, factor, whole = true) {
    if (
      !["x", "y", "z"].includes(name) ||
      !Number.isFinite(factor) ||
      factor <= 0
    )
      throw Error("Resize needs a positive scale and X/Y/Z dimension.");
    const parts = members(primitives, id, whole);
    if (!parts.length) return 0;
    const yaw = parts[0].yaw || 0,
      box = localBounds(parts, yaw),
      c = Math.cos(yaw),
      s = Math.sin(yaw),
      copies = structuredClone(parts);
    if (
      parts.length > 1 &&
      parts.some(
        /* @function buildingAssemblies.roundGroup — Inputs: part. Returns whether a round member would require unsupported mixed group scaling. */ function (
          part,
        ) {
          return part.shape === "round";
        },
      )
    )
      throw Error("Resize round modules individually.");
    for (const part of copies) {
      let x = c * part.x + s * part.y,
        y = -s * part.x + c * part.y;
      if (name === "x") {
        x = box.x + (x - box.x) * factor;
        part.w *= factor;
      } else if (name === "y") {
        y = box.y + (y - box.y) * factor;
        part.d *= factor;
      } else {
        part.z = box.z + (part.z - box.z) * factor;
        part.h *= factor;
        if (part.stepRise !== undefined) part.stepRise *= factor;
      }
      part.x = c * x - s * y;
      part.y = s * x + c * y;
      if (part.shape === "round" && name !== "z") {
        part.radius *= factor;
        part.innerRadius = (part.innerRadius || 0) * factor;
        part.w = part.d = part.radius * 2;
      }
      if (
        part.w < 0.05 ||
        part.d < 0.05 ||
        part.h < 0.01 ||
        part.w > 100 ||
        part.d > 100 ||
        part.h > 100
      )
        throw Error(
          "Resize exceeds supported dimensions (5 cm minimum width/depth; 1 cm minimum height).",
        );
    }
    for (let i = 0; i < parts.length; i++) Object.assign(parts[i], copies[i]);
    return parts.length;
  }
  /* @function buildingAssemblies.duplicate — Inputs: part list, selected ID, unique new prefix and whole flag. Returns detached preview copies shifted one enclosing width along world X. Whole copies receive a new assembly ID; single-part copies detach from their old assembly. Does not duplicate attached events/props or mutate source geometry. Caller validates capacity/placement before commit. */
  function duplicate(primitives, id, prefix, whole = true) {
    const originals = members(primitives, id, whole),
      box = bounds(originals),
      copies = [];
    for (let i = 0; i < originals.length; i++) {
      const copy = structuredClone(originals[i]);
      copy.id = prefix + "-" + i;
      copy.name += " copy";
      copy.x += box.w;
      if (whole && originals.length > 1) copy.assemblyId = prefix;
      else delete copy.assemblyId;
      copies.push(copy);
    }
    return copies;
  }
  /* @function buildingAssemblies.snap — Inputs: building kit, proposed parts, candidate primitives and maximum connector distance in metres. Returns detached translated parts plus matching evidence, or unchanged clones. Internal matching anchors are removed so a flight joins at exposed surfaces. Round pieces deliberately have no box connectors. Stable IDs/anchor names break ties; no scene mutation or implicit rotation. */
  function snap(kit, parts, candidates, distance = 0.4) {
    const anchors = [];
    for (const part of parts)
      if (part.shape !== "round")
        for (const anchor of kit.connectors(part))
          anchors.push({ ...anchor, partId: part.id });
    const exposed = anchors.filter(
      /* @function buildingAssemblies.exposed — Inputs: source anchor. Returns whether another source part has an exactly opposed coincident connector, marking an internal join. Tolerance is 0.1 millimetres; no metadata mutation. */ function (
        anchor,
      ) {
        return !anchors.some(
          /* @function buildingAssemblies.internalMate — Inputs: another source anchor. Returns opposed coincident identity across different parts. */ function (
            other,
          ) {
            return (
              other.partId !== anchor.partId &&
              anchor.normal[0] * other.normal[0] +
                anchor.normal[1] * other.normal[1] +
                anchor.normal[2] * other.normal[2] <
                -0.99 &&
              Math.hypot(
                ...anchor.point.map(
                  /* @function buildingAssemblies.anchorDistance — Inputs: point component and index. Returns world-coordinate difference for a bounded three-component distance. */ function (
                    value,
                    index,
                  ) {
                    return value - other.point[index];
                  },
                ),
              ) < 0.0001
            );
          },
        );
      },
    );
    let best = null;
    for (const candidate of candidates) {
      if (
        candidate.shape === "round" ||
        parts.some(
          /* @function buildingAssemblies.excludeSelf — Inputs: proposed part. Returns candidate identity match, preventing an assembly snapping to itself. */ function (
            part,
          ) {
            return part.id === candidate.id;
          },
        )
      )
        continue;
      for (const destination of kit.connectors(candidate))
        for (const source of exposed) {
          if (
            source.normal[0] * destination.normal[0] +
              source.normal[1] * destination.normal[1] +
              source.normal[2] * destination.normal[2] >
            -0.99
          )
            continue;
          const dx = destination.point[0] - source.point[0],
            dy = destination.point[1] - source.point[1],
            dz = destination.point[2] - source.point[2],
            gap = Math.hypot(dx, dy, dz),
            key =
              candidate.id +
              "/" +
              destination.name +
              "/" +
              source.partId +
              "/" +
              source.name;
          if (
            gap <= distance &&
            (!best ||
              gap < best.gap - 1e-8 ||
              (Math.abs(gap - best.gap) < 1e-8 && key < best.key))
          )
            best = {
              gap,
              key,
              dx,
              dy,
              dz,
              target: candidate.id,
              source: source.name,
              destination: destination.name,
            };
        }
    }
    const copies = structuredClone(parts);
    if (best)
      for (const part of copies) {
        part.x += best.dx;
        part.y += best.dy;
        part.z += best.dz;
      }
    return { primitives: copies, connection: best };
  }
  root.FrontierBuildingAssemblies = {
    members,
    bounds,
    localBounds,
    axis,
    translate,
    rotate,
    resize,
    duplicate,
    snap,
  };
})(typeof window === "undefined" ? globalThis : window);
