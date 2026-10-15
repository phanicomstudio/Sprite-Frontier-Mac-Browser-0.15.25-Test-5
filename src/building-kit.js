/* October 12, 2026: native modular authoring. Dimensions are metres/world units;
 * X/Y form the floor plane and Z is up. Generated boxes remain ordinary room
 * primitives, so geometry, collision, undo and saved projects share ownership.
 * No model or texture is copied for each placed module. */
(/* @function buildingKit.install — Inputs: browser/global namespace. Returns: nothing. Installs pure generation and connector operations; no DOM, cache or world mutation. */ function (
  root,
) {
  "use strict";
  /* @function buildingKit.dimension — Inputs: numeric value, descriptive label and inclusive bounds. Returns: validated number. Throws on nonfinite/out-of-range dimensions before any authoring transaction starts. Units are metres unless the label identifies a count. */
  function dimension(value, label, minimum, maximum) {
    if (!Number.isFinite(value) || value < minimum || value > maximum)
      throw Error(
        label + " must be between " + minimum + " and " + maximum + ".",
      );
    return value;
  }
  /* @function buildingKit.box — Inputs: ID, label, center X/Y, base Z, width/depth/height, material record. Returns: a new standard room primitive. Does not mutate inputs; material mapping is independent of physical dimensions. */
  function box(id, name, x, y, z, w, d, h, material = {}) {
    return {
      id,
      name,
      x,
      y,
      z,
      w,
      d,
      h,
      color: material.color || "#ffffff",
      texture: material.texture || undefined,
      tileSize: material.tileSize || 2,
      ...material,
    };
  }
  /* @function buildingKit.shell — Inputs: center X/Y, clear width/depth, floor elevation, clear height, thickness, optional ceiling and material records. Returns: floor outline, six independent primitives (five without ceiling), and safe central spawn. Throws invalid dimensions; leaves existing rooms untouched. Walls sit outside clear interior edges, corners meet without overlapping wall volumes. */
  function shell(options) {
    const {
      x,
      y,
      z = 0,
      width,
      depth,
      height = 3,
      thickness = 0.2,
      ceiling = true,
      id = "shell",
    } = options;
    dimension(x, "Center X", 1, 10000);
    dimension(y, "Center Y", 1, 10000);
    dimension(width, "Room width", 2, 80);
    dimension(depth, "Room depth", 2, 80);
    dimension(height, "Room height", 1.8, 20);
    dimension(thickness, "Thickness", 0.05, 1);
    dimension(z, "Floor elevation", -29, 79);
    const x0 = x - width / 2,
      x1 = x + width / 2,
      y0 = y - depth / 2,
      y1 = y + depth / 2;
    const primitives = [
      box(
        id + "-floor",
        "Floor",
        x,
        y,
        z - thickness,
        width,
        depth,
        thickness,
        options.floorMaterial,
      ),
      box(
        id + "-north",
        "North wall",
        x,
        y1 + thickness / 2,
        z,
        width + thickness * 2,
        thickness,
        height,
        options.wallMaterial,
      ),
      box(
        id + "-south",
        "South wall",
        x,
        y0 - thickness / 2,
        z,
        width + thickness * 2,
        thickness,
        height,
        options.wallMaterial,
      ),
      box(
        id + "-west",
        "West wall",
        x0 - thickness / 2,
        y,
        z,
        thickness,
        depth,
        height,
        options.wallMaterial,
      ),
      box(
        id + "-east",
        "East wall",
        x1 + thickness / 2,
        y,
        z,
        thickness,
        depth,
        height,
        options.wallMaterial,
      ),
    ];
    if (ceiling)
      primitives.push(
        box(
          id + "-ceiling",
          "Ceiling",
          x,
          y,
          z + height,
          width,
          depth,
          thickness,
          options.ceilingMaterial,
        ),
      );
    // October 12, 2026: explicit roles let independently placed shell floors
    // participate in painted-layout support without treating walls as ground.
    primitives[0].moduleType = "floor";
    for (let i = 1; i < 5; i++) primitives[i].moduleType = "wall";
    if (ceiling) primitives[5].moduleType = "ceiling";
    return {
      floor: [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ],
      primitives,
      spawn: { x, y, z },
    };
  }
  /* @function buildingKit.stairs — Inputs: flight center X/Y, base Z, width/run/rise, integral step count, quarter-turn orientation and material. Returns: nonoverlapping adjacent step columns with matching tops/risers, grouped by assemblyId. Throws invalid input. Flight ascends +Y at zero turns; each component remains independently editable. */
  function stairs(options) {
    const {
      x,
      y,
      z = 0,
      width = 1.5,
      run = 3.6,
      rise = 2.4,
      steps = 12,
      turns = 0,
      id = "stairs",
      material,
    } = options;
    dimension(width, "Stair width", 0.5, 10);
    dimension(run, "Stair run", 0.5, 40);
    dimension(rise, "Stair rise", 0.1, 20);
    dimension(steps, "Step count", 1, 64);
    dimension(z, "Stair base", -29, 79);
    if (!Number.isInteger(steps) || !Number.isInteger(turns))
      throw Error("Step count and quarter turns must be whole numbers.");
    const angle = (turns * Math.PI) / 2,
      c = Math.round(Math.cos(angle)),
      s = Math.round(Math.sin(angle)),
      tread = run / steps,
      result = [];
    for (let i = 0; i < steps; i++) {
      const offset = -run / 2 + tread * (i + 0.5);
      const e = box(
        id + "-" + i,
        "Stair step " + (i + 1),
        x - s * offset,
        y + c * offset,
        z,
        c ? width : tread,
        c ? tread : width,
        (rise * (i + 1)) / steps,
        material,
      );
      e.assemblyId = id;
      e.moduleType = "stair";
      // October 12: landing connectors need walking-surface heights, including
      // the lower riser edge, rather than the centre of a tall step column.
      e.stepRise = rise / steps;
      e.stairDirection = [-s, c];
      result.push(e);
    }
    return result;
  }
  /* @function buildingKit.connectors — Inputs: room primitive with optional yaw in radians. Returns: six rotated connector records in world metres with outward normals; floor/stair side anchors use walking-surface elevations. Does not mutate geometry. Imported rotated anchors use the model transform pipeline instead. */
  function connectors(e) {
    const anchors = [
      {
        name: "left",
        point: [e.x - e.w / 2, e.y, e.z + e.h / 2],
        normal: [-1, 0, 0],
      },
      {
        name: "right",
        point: [e.x + e.w / 2, e.y, e.z + e.h / 2],
        normal: [1, 0, 0],
      },
      {
        name: "front",
        point: [e.x, e.y - e.d / 2, e.z + e.h / 2],
        normal: [0, -1, 0],
      },
      {
        name: "back",
        point: [e.x, e.y + e.d / 2, e.z + e.h / 2],
        normal: [0, 1, 0],
      },
      { name: "bottom", point: [e.x, e.y, e.z], normal: [0, 0, -1] },
      { name: "top", point: [e.x, e.y, e.z + e.h], normal: [0, 0, 1] },
    ];
    const c = Math.cos(e.yaw || 0),
      s = Math.sin(e.yaw || 0);
    for (const anchor of anchors) {
      const dx = anchor.point[0] - e.x,
        dy = anchor.point[1] - e.y,
        nx = anchor.normal[0],
        ny = anchor.normal[1];
      anchor.point[0] = e.x + c * dx - s * dy;
      anchor.point[1] = e.y + s * dx + c * dy;
      anchor.normal[0] = c * nx - s * ny;
      anchor.normal[1] = s * nx + c * ny;
    }
    // Floor joins align their top surfaces even when slabs have different
    // thicknesses. Stair joins use the previous tread height on the downhill
    // riser and the current tread height on the uphill edge; walls retain the
    // historical face-centre anchors. Normals/dimensions are unchanged.
    if (e.moduleType === "floor" || e.moduleType === "stair")
      for (const anchor of anchors) {
        if (anchor.normal[2] !== 0) continue;
        anchor.point[2] = e.z + e.h;
        // October 13: stairDirection describes the generated step before direct
        // yaw edits. Rotate it with the face normals so the downhill connector
        // remains at the preceding tread height after numeric/quarter turns.
        if (e.moduleType === "stair" && Array.isArray(e.stairDirection)) {
          const dx = c * e.stairDirection[0] - s * e.stairDirection[1],
            dy = s * e.stairDirection[0] + c * e.stairDirection[1];
          if (anchor.normal[0] * dx + anchor.normal[1] * dy < -0.99)
            anchor.point[2] -= e.stepRise || 0;
        }
      }
    return anchors;
  }
  /* @function buildingKit.snap — Inputs: proposed primitive, nearby candidates and maximum connector gap in metres. Returns: translated clone plus connection evidence, or unchanged clone with null connection. Matches opposing normals; stable ID/name tie-break avoids iteration-order jitter. No mutation or scene scan outside the supplied candidate list. */
  function snap(proposed, candidates, distance = 0.4) {
    let best = null;
    for (const target of candidates) {
      if (target.id === proposed.id) continue;
      for (const a of connectors(proposed))
        for (const b of connectors(target)) {
          if (
            a.normal[0] * b.normal[0] +
              a.normal[1] * b.normal[1] +
              a.normal[2] * b.normal[2] >
            -0.99
          )
            continue;
          const dx = b.point[0] - a.point[0],
            dy = b.point[1] - a.point[1],
            dz = b.point[2] - a.point[2];
          const gap = Math.hypot(dx, dy, dz),
            key = target.id + "/" + b.name + "/" + a.name;
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
              target: target.id,
              source: a.name,
              destination: b.name,
            };
        }
    }
    return {
      primitive: {
        ...proposed,
        x: proposed.x + (best?.dx || 0),
        y: proposed.y + (best?.dy || 0),
        z: proposed.z + (best?.dz || 0),
      },
      connection: best,
    };
  }
  /* @function buildingKit.round — Inputs: ID/name, center XYZ, outer/inner radii, height, bounded segment count, material and optional arc angles in radians. Returns a standard persisted round primitive with enclosing dimensions for editor handles. Throws invalid surfaces; no scene mutation. Collision consumes actual round polygons rather than these bounds. */
  function round(
    id,
    name,
    x,
    y,
    z,
    radius,
    innerRadius,
    h,
    segments = 32,
    material = {},
    arc = {},
  ) {
    const e = {
      ...box(id, name, x, y, z, radius * 2, radius * 2, h, material),
      shape: "round",
      radius,
      innerRadius,
      segments,
      ...arc,
    };
    root.FrontierRoundGeometry.primitiveFaces(e);
    return e;
  }
  /* @function buildingKit.roundShell — Inputs: center XY, clear inner radius, floor Z, clear height, thickness, optional ceiling, 8-64 segments and independent materials. Returns circular floor outline, hollow wall/slabs and safe center spawn. Throws invalid dimensions before placement. Clear radius refers to polygon vertices; side midpoint clearance is slightly smaller for low segment counts. No cell mutation. */
  function roundShell(options) {
    const {
      x,
      y,
      z = 0,
      radius = 4,
      height = 3,
      thickness = 0.2,
      segments = 32,
      ceiling = true,
      id = "tower",
    } = options;
    dimension(radius, "Clear radius", 1, 40);
    dimension(height, "Room height", 1.8, 20);
    dimension(thickness, "Thickness", 0.05, 1);
    dimension(segments, "Segments", 8, 64);
    dimension(z, "Floor elevation", -29, 79);
    if (!Number.isInteger(segments))
      throw Error("Segments must be a whole number.");
    const primitives = [
      round(
        id + "-floor",
        "Round floor",
        x,
        y,
        z - thickness,
        radius,
        0,
        thickness,
        segments,
        options.floorMaterial,
      ),
      round(
        id + "-wall",
        "Tower wall",
        x,
        y,
        z,
        radius + thickness,
        radius,
        height,
        segments,
        options.wallMaterial,
      ),
    ];
    primitives[0].moduleType = "floor";
    primitives[1].moduleType = "wall";
    if (ceiling) {
      const slab = round(
        id + "-ceiling",
        "Round ceiling",
        x,
        y,
        z + height,
        radius,
        0,
        thickness,
        segments,
        options.ceilingMaterial,
      );
      slab.moduleType = "ceiling";
      primitives.push(slab);
    }
    const floor = [];
    for (let i = 0; i < segments; i++) {
      const angle = (i * Math.PI * 2) / segments;
      floor.push([x + Math.cos(angle) * radius, y + Math.sin(angle) * radius]);
    }
    return { floor, primitives, spawn: { x, y, z } };
  }
  root.FrontierBuildingKit = {
    box,
    shell,
    stairs,
    connectors,
    snap,
    round,
    roundShell,
  };
})(typeof window === "undefined" ? globalThis : window);
