/* October 12, 2026: grid room authoring compiles into ordinary room primitives.
 * Shared tile edges create no internal walls. Row runs keep surface/collision
 * counts modest. Manual edits survive recompilation of stable generated IDs as
 * deltas from their previous layoutBase, rather than being silently overwritten. */
(/* @function roomLayout.install — Inputs: browser/global namespace. Returns: nothing. Installs pure layout validation/generation and boundary synchronization. No DOM or per-frame generation. */ function (
  root,
) {
  "use strict";
  /* @function roomLayout.validate — Inputs: optional grid layout and map bounds. Returns: isolated canonical layout or undefined. Throws malformed/out-of-map cells, duplicate IDs, excessive capacity or invalid doorway sides. Units are metres; tile coordinates are integer indices from the origin. */
  function validate(value, bounds) {
    if (value === undefined) return undefined;
    const v = {
      originX: 2,
      originY: 2,
      tile: 2,
      z: 0,
      height: 3,
      thickness: 0.2,
      ceiling: true,
      cells: [],
      doors: [],
      ...value,
    };
    for (const [key, min, max] of [
      ["originX", 1, 511],
      ["originY", 1, 511],
      ["tile", 0.5, 8],
      ["z", -29, 79],
      ["height", 1.8, 20],
      ["thickness", 0.05, 0.5],
    ])
      if (!Number.isFinite(v[key]) || v[key] < min || v[key] > max)
        throw Error("Invalid room layout " + key + ".");
    if (
      typeof v.ceiling !== "boolean" ||
      !Array.isArray(v.cells) ||
      v.cells.length > 128 ||
      !Array.isArray(v.doors) ||
      v.doors.length > 64
    )
      throw Error("Layout supports 128 floor tiles and 64 doorway edges.");
    const used = new Set(),
      cells = [];
    for (const p of v.cells) {
      if (
        !Array.isArray(p) ||
        p.length !== 2 ||
        !p.every(Number.isInteger) ||
        p[0] < 0 ||
        p[1] < 0
      )
        throw Error("Layout cells need nonnegative integer coordinates.");
      const key = p.join(",");
      if (used.has(key)) continue;
      used.add(key);
      if (
        v.originX + p[0] * v.tile - v.thickness < 0.5 ||
        v.originY + p[1] * v.tile - v.thickness < 0.5 ||
        v.originX + (p[0] + 1) * v.tile + v.thickness > bounds.width - 0.5 ||
        v.originY + (p[1] + 1) * v.tile + v.thickness > bounds.height - 0.5
      )
        throw Error("Room layout tile exceeds map bounds.");
      cells.push([...p]);
    }
    cells.sort(
      /* @function roomLayout.orderCells — Inputs: two integer tile points. Returns: row-major stable ordering. No mutation beyond the private copied array's sort. */ function (
        a,
        b,
      ) {
        return a[1] - b[1] || a[0] - b[0];
      },
    );
    const doors = [];
    for (const d of v.doors) {
      if (
        !d ||
        !Number.isInteger(d.x) ||
        !Number.isInteger(d.y) ||
        !["north", "south", "east", "west"].includes(d.side) ||
        !used.has(d.x + "," + d.y)
      )
        throw Error("Doorway must belong to a floor tile edge.");
      doors.push({ x: d.x, y: d.y, side: d.side });
    }
    // October 14 Test 5: explicit role materials are portable authoring data.
    // Old layouts without this field keep their existing per-piece textures.
    let materials;
    if (v.materials !== undefined) {
      if (!v.materials || typeof v.materials !== "object") throw Error("Invalid layout materials.");
      materials = {};
      for (const role of ["wall","floor","ceiling"]) {
        const material = v.materials[role];
        if (!material || (material.texture !== undefined && (typeof material.texture !== "string" || material.texture.length >= 16000000 || !/^(img\/|data:image\/(png|jpeg|webp);base64,)/.test(material.texture) || material.texture.includes("..")))) throw Error("Invalid " + role + " layout texture.");
        if (!Number.isFinite(material.tileSize) || material.tileSize <= 0 || material.tileSize > 100) throw Error("Invalid layout texture repeat size.");
        materials[role] = {texture:material.texture,tileSize:material.tileSize,preserveAspect:true};
      }
    }
    return { ...v, cells, doors, ...(materials ? {materials} : {}) };
  }
  /* @function roomLayout.compile — Inputs: validated layout, optional material records and existing ordinary primitives. Returns: generated floor/wall/ceiling pieces and bounding floor outline. No world mutation. Doorways leave a 0.9m by 2.1m open volume. Capacity overflow throws before commit. */
  function compile(layout, materials = {}, existing = []) {
    const kit = root.FrontierBuildingKit,
      occupied = new Set(),
      pieces = [],
      rows = new Map();
    for (const [x, y] of layout.cells) {
      occupied.add(x + "," + y);
      if (!rows.has(y)) rows.set(y, []);
      rows.get(y).push(x);
    }
    const previous = new Map();
    for (const e of existing)
      if (e.layoutGroup === "grid-layout") previous.set(e.id, e);
    /* @function roomLayout.add — Inputs: fresh primitive and module role. Returns: nothing. Records the generated base and reapplies existing transform/material overrides for matching IDs. Does not mutate the previous scene record. */
    function add(piece, type) {
      piece.moduleType = type;
      piece.layoutGroup = "grid-layout";
      piece.layoutBase = {
        x: piece.x,
        y: piece.y,
        z: piece.z,
        w: piece.w,
        d: piece.d,
        h: piece.h,
        yaw: 0,
      };
      piece.layoutMaterial = {};
      for (const key of [
        "texture",
        "tileSize",
        "textureMapping",
        "textureRotation",
        "textureOffsetU",
        "textureOffsetV",
        "preserveAspect",
        "color",
      ])
        if (piece[key] !== undefined) piece.layoutMaterial[key] = piece[key];
      const old = previous.get(piece.id);
      if (old?.layoutBase) {
        for (const key of ["x", "y", "z", "w", "d", "h", "yaw"])
          piece[key] =
            (piece[key] || 0) + ((old[key] || 0) - (old.layoutBase[key] || 0));
        for (const key of [
          "texture",
          "tileSize",
          "textureMapping",
          "textureRotation",
          "textureOffsetU",
          "textureOffsetV",
          "preserveAspect",
          "color",
        ])
          if (
            old[key] !== undefined &&
            (!old.layoutMaterial || old[key] !== old.layoutMaterial[key])
          )
            piece[key] = old[key];
      }
      pieces.push(piece);
    }
    const t = layout.tile,
      h = layout.height,
      z = layout.z,
      thickness = layout.thickness;
    // Merge consecutive cells in each row. Adjacent row surfaces meet without
    // overlapping volume; floor ownership remains selectable by stable row ID.
    for (const [row, xs] of rows) {
      let start = xs[0],
        last = start;
      for (let i = 1; i <= xs.length; i++) {
        const x = xs[i];
        if (x === last + 1) {
          last = x;
          continue;
        }
        const width = (last - start + 1) * t,
          cx = layout.originX + ((start + last + 1) * t) / 2,
          cy = layout.originY + (row + 0.5) * t,
          id = "layout-row-" + row + "-" + start + "-" + last;
        add(
          kit.box(
            id + "-floor",
            "Floor row " + row,
            cx,
            cy,
            z - thickness,
            width,
            t,
            thickness,
            materials.floor,
          ),
          "floor",
        );
        if (layout.ceiling)
          add(
            kit.box(
              id + "-ceiling",
              "Ceiling row " + row,
              cx,
              cy,
              z + h,
              width,
              t,
              thickness,
              materials.ceiling,
            ),
            "ceiling",
          );
        start = last = x;
      }
    }
    const sides = [
        ["north", 0, 1],
        ["south", 0, -1],
        ["east", 1, 0],
        ["west", -1, 0],
      ],
      groups = new Map();
    for (const [x, y] of layout.cells)
      for (const [side, dx, dy] of sides) {
        if (occupied.has(x + dx + "," + (y + dy))) continue;
        const horizontal = dy !== 0,
          key = side + "/" + (horizontal ? y : x);
        if (!groups.has(key))
          groups.set(key, {
            side,
            dx,
            dy,
            fixed: horizontal ? y : x,
            items: [],
          });
        const door = layout.doors.some(
          /* @function roomLayout.matchesDoor - Inputs: doorway edge. Returns: exact tile/side match; no mutation. */ function (
            d,
          ) {
            return d.x === x && d.y === y && d.side === side;
          },
        );
        groups.get(key).items.push({ coordinate: horizontal ? x : y, door });
      }
    /* @function roomLayout.cornerCount - Inputs: integer grid vertex. Returns: number of occupied adjacent tiles. Distinguishes convex/concave joins so wall volumes neither leave corner gaps nor overlap. */
    function cornerCount(x, y) {
      let count = 0;
      for (const dx of [-1, 0])
        for (const dy of [-1, 0])
          if (occupied.has(x + dx + "," + (y + dy))) count++;
      return count;
    }
    /* @function roomLayout.wallRun - Inputs: edge group, first/last cell indices and doorway flag. Returns: nothing. Creates one merged wall run or three doorway pieces. Vertical end caps fill convex joins and trim concave joins against horizontal walls, preserving the floor's clear area. */
    function wallRun(group, first, last, door) {
      const horizontal = group.dy !== 0,
        variable = ((first + last + 1) * t) / 2,
        fixed = (group.fixed + 0.5) * t,
        id =
          "layout-wall-" +
          group.side +
          "-" +
          group.fixed +
          "-" +
          first +
          "-" +
          last;
      let cx =
          layout.originX +
          (horizontal ? variable : fixed) +
          (group.dx * (t + thickness)) / 2,
        cy =
          layout.originY +
          (horizontal ? fixed : variable) +
          (group.dy * (t + thickness)) / 2,
        length = (last - first + 1) * t;
      if (!horizontal) {
        const vertexX = group.fixed + (group.dx > 0 ? 1 : 0),
          low = cornerCount(vertexX, first),
          high = cornerCount(vertexX, last + 1),
          lower = low === 1 ? -thickness : low === 3 ? thickness : 0,
          upper = high === 1 ? thickness : high === 3 ? -thickness : 0;
        cy += (lower + upper) / 2;
        length += upper - lower;
      }
      if (length < 0.05)
        throw Error("Tile size is too small for this wall thickness.");
      if (door) {
        if (length < 1.3 || h <= 2.1)
          throw Error(
            "Doorway tiles require at least 1.3m width and more than 2.1m height.",
          );
        const opening = 0.9,
          jamb = (length - opening) / 2;
        for (const sign of [-1, 1])
          add(
            kit.box(
              id + "-jamb-" + (sign < 0 ? "a" : "b"),
              "Doorway jamb",
              cx + (horizontal ? (sign * (opening + jamb)) / 2 : 0),
              cy + (horizontal ? 0 : (sign * (opening + jamb)) / 2),
              z,
              horizontal ? jamb : thickness,
              horizontal ? thickness : jamb,
              2.1,
              materials.wall,
            ),
            "wall",
          );
        add(
          kit.box(
            id + "-lintel",
            "Doorway lintel",
            cx,
            cy,
            z + 2.1,
            horizontal ? length : thickness,
            horizontal ? thickness : length,
            h - 2.1,
            materials.wall,
          ),
          "wall",
        );
      } else
        add(
          kit.box(
            id,
            "Wall " + group.side,
            cx,
            cy,
            z,
            horizontal ? length : thickness,
            horizontal ? thickness : length,
            h,
            materials.wall,
          ),
          "wall",
        );
    }
    for (const group of groups.values()) {
      group.items.sort(
        /* @function roomLayout.orderEdges - Inputs: two perimeter entries. Returns: ascending tile coordinate; only private generated lists are sorted. */ function (
          a,
          b,
        ) {
          return a.coordinate - b.coordinate;
        },
      );
      let first = null,
        last = null;
      for (const item of group.items) {
        if (item.door) {
          if (first !== null) wallRun(group, first, last, false);
          first = last = null;
          wallRun(group, item.coordinate, item.coordinate, true);
          continue;
        }
        if (first === null) {
          first = last = item.coordinate;
        } else if (item.coordinate === last + 1) last = item.coordinate;
        else {
          wallRun(group, first, last, false);
          first = last = item.coordinate;
        }
      }
      if (first !== null) wallRun(group, first, last, false);
    }
    if (
      pieces.length +
        existing.filter(
          /* @function roomLayout.otherPieces — Inputs: primitive. Returns: whether it belongs to independent authoring rather than the recompiled grid. */ function (
            e,
          ) {
            return e.layoutGroup !== "grid-layout";
          },
        ).length >
      256
    )
      throw Error(
        "This layout exceeds 256 room pieces. Use fewer tiles or ceiling segments.",
      );
    if (!layout.cells.length) return { primitives: pieces, floor: null };
    let x0 = Infinity,
      y0 = Infinity,
      x1 = -Infinity,
      y1 = -Infinity;
    for (const [x, y] of layout.cells) {
      x0 = Math.min(x0, layout.originX + x * t);
      y0 = Math.min(y0, layout.originY + y * t);
      x1 = Math.max(x1, layout.originX + (x + 1) * t);
      y1 = Math.max(y1, layout.originY + (y + 1) * t);
    }
    return {
      primitives: pieces,
      floor: [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ],
    };
  }
  /* @function roomLayout.synchronize — Inputs: authored world. Returns: nothing. Expands the coarse room outline to current generated floor/step volumes after direct edits; exact walkability remains their union. Does not regenerate or overwrite individually edited geometry. */
  function synchronize(world) {
    const room = world.interior;
    if (!room?.layout) return;
    let x0 = Infinity,
      x1 = -Infinity,
      y0 = Infinity,
      y1 = -Infinity;
    for (const e of room.primitives) {
      if (!["floor", "stair"].includes(e.moduleType)) continue;
      const c = Math.abs(Math.cos(e.yaw || 0)),
        s = Math.abs(Math.sin(e.yaw || 0)),
        w = (e.w * c + e.d * s) / 2,
        d = (e.w * s + e.d * c) / 2;
      x0 = Math.min(x0, e.x - w);
      x1 = Math.max(x1, e.x + w);
      y0 = Math.min(y0, e.y - d);
      y1 = Math.max(y1, e.y + d);
    }
    if (Number.isFinite(x0))
      room.floor = [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ];
  }
  /* @function roomLayout.synchronizeArrivals — Inputs: authored world after layout commit, validated layout and compiled owned pieces. Returns nothing. Moves unsupported spawn/entrances onto the first painted tile and updates Z for points supported by generated floors, including manually retained floor-height edits. Independent supported floors retain their existing arrival height. Empty layouts leave arrivals unchanged; geometry/world validation still owns rejection and undo. Coordinates and top elevations are world metres. */
  function synchronizeArrivals(world, layout, pieces) {
    if (!layout.cells.length) return;
    const floors = pieces.filter(
      /* @function roomLayout.arrivalFloor — Inputs: generated primitive. Returns whether it is a floor support surface, excluding walls and ceilings from arrival elevation selection. */ function (
        piece,
      ) {
        return piece.moduleType === "floor";
      },
    );
    const grid = {
        ...world,
        interior: { ...world.interior, primitives: floors },
      },
      first = layout.cells[0];
    /* @function roomLayout.anchorArrival — Inputs: mutable authored point and fallback X/Y. Returns nothing. Repairs unsupported horizontal positions and sets feet Z only when supported by actual owned floor geometry. Queries full body footprint before selecting highest floor top; no terrain/ceiling shortcut. */
    function anchor(point, fallback) {
      if (!root.FrontierRoomPhysics.walkable(world, point.x, point.y)) {
        point.x = fallback.x;
        point.y = fallback.y;
        point.z = fallback.z;
      }
      if (root.FrontierRoomPhysics.walkable(grid, point.x, point.y)) {
        const height = root.FrontierRoomPhysics.support(
          grid,
          point.x,
          point.y,
          -30,
          100,
        );
        if (height !== null) point.z = height;
      }
    }
    anchor(world.spawn, {
      x: layout.originX + (first[0] + 0.5) * layout.tile,
      y: layout.originY + (first[1] + 0.5) * layout.tile,
      z: layout.z,
    });
    for (const entrance of world.interior.entrances)
      anchor(entrance, world.spawn);
  }
  root.FrontierRoomLayout = {
    validate,
    compile,
    synchronize,
    synchronizeArrivals,
  };
})(typeof window === "undefined" ? globalThis : window);
