/* October 24, 2026 — 0.16.2 current behavior and units are described in ITERATION-0.16.2.md; earlier contracts below remain history. New camera/tactics helpers preserve existing owners and transactional validation. */
/* Room data is independent of artwork and interaction mode. Static face and
 * collision caches rebuild only after a validated edit, never every frame. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function interiors.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier interior. */
(/* @function interiors.installReviewed — Installs artwork-independent room data and static face/collision cache services. Caches rebuild at validated edits; rendering and interaction mode do not change authored dimensions. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  const cache = new WeakMap(),
    images = new Map();
  const defaults = {
    mode: "fixed",
    image: "img/interiors/Room_Test_A.png",
    imageWidth: 1129,
    imageHeight: 636,
    camera: {
      originX: 4,
      originY: 14,
      screenX: 568,
      screenY: 382,
      axisXX: 41.9,
      axisXY: 12.2,
      axisYX: 44.7,
      axisYY: -11.4,
      heightScale: 150,
      yaw: -Math.PI / 4,
    },
    floor: [
      [4, 4],
      [14, 4],
      [14, 14],
      [4, 14],
    ],
    blockers: [],
    sprites: [],
    primitives: [],
    entrances: [{ id: "entry", name: "Main entrance", x: 9, y: 7.5, yaw: 0 }],
    exits: [],
  };
  const number =
    /* @function interiors.number.2 — Returns number is finite using v and v is at least min and v is at most max. Inputs: v; min; max. Uses: number is finite. Returns: number is finite using v and v is at least min and v is at most max. */ (
      v,
      min,
      max,
    ) => Number.isFinite(v) && v >= min && v <= max;
  const asset =
    /* @function interiors.asset.3 — Returns typeof v equals "string" and v length is less than 16000000 and /^(img\/|data:image\/(png|jpeg|webp);base64,)/ test using v and the inverse of v includes using "..". Inputs: v. Uses: /^(img\/|data:image\/(png|jpeg|webp);base64,)/ test; v includes. Returns: typeof v equals "string" and v length is less than 16000000 and /^(img\/|data:image\/(png|jpeg|webp);base64,)/ test using v and the inverse of v includes using "..". */ (
      v,
    ) =>
      typeof v === "string" &&
      v.length < 16000000 &&
      /^(img\/|data:image\/(png|jpeg|webp);base64,)/.test(v) &&
      !v.includes("..");
  /* @function interiors.polygon.4 — Handles polygon within interior rooms and their camera. Inputs: p; bounds. Updates: area. Uses: array is array; p some; error; cross. Returns: p map using a callback. */ function polygon(
    p,
    bounds,
  ) {
    if (
      !Array.isArray(p) ||
      p.length < 3 ||
      p.length > 64 ||
      p.some(
        /* @function interiors.callback.5 — Returns the inverse of array is array using v or v length does not equal 2 or the inverse of number using v at 0, 0.5, bounds width minus 0.5 or the inverse of number using v at 1, 0.5, bounds height minus 0.5. Inputs: v. Uses: array is array; number. Returns: the inverse of array is array using v or v length does not equal 2 or the inverse of number using v at 0, 0.5, bounds width minus 0.5 or the inverse of number using v at 1, 0.5, bounds height minus 0.5. */ (
          v,
        ) =>
          !Array.isArray(v) ||
          v.length !== 2 ||
          !number(v[0], 0.5, bounds.width - 0.5) ||
          !number(v[1], 0.5, bounds.height - 0.5),
      )
    )
      throw Error("Floor needs 3–64 points inside the map.");
    let area = 0;
    for (let i = 0; i < p.length; i++) {
      const a = p[i],
        b = p[(i + 1) % p.length];
      area += a[0] * b[1] - b[0] * a[1];
    }
    if (Math.abs(area) < 0.1) throw Error("Floor outline has no area.");
    for (let i = 0; i < p.length; i++)
      for (let j = i + 1; j < p.length; j++) {
        if (j === i + 1 || (i === 0 && j === p.length - 1)) continue;
        const a = p[i],
          b = p[(i + 1) % p.length],
          c = p[j],
          d = p[(j + 1) % p.length],
          cross =
            /* @function interiors.cross.6 — Returns v at 0 minus u at 0 multiplied by w at 1 minus u at 1 minus v at 1 minus u at 1 multiplied by w at 0 minus u at 0. Inputs: u; v; w. Returns: v at 0 minus u at 0 multiplied by w at 1 minus u at 1 minus v at 1 minus u at 1 multiplied by w at 0 minus u at 0. */ (
              u,
              v,
              w,
            ) => (v[0] - u[0]) * (w[1] - u[1]) - (v[1] - u[1]) * (w[0] - u[0]);
        if (
          cross(a, b, c) * cross(a, b, d) < 0 &&
          cross(c, d, a) * cross(c, d, b) < 0
        )
          throw Error("Floor edges cannot cross.");
      }
    return p.map(
      /* @function interiors.callback.7 — Returns a list of spread element. Inputs: v. Returns: a list of spread element. */ (
        v,
      ) => [...v],
    );
  }
  /* @function interiors.validate.8 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: v; bounds. Updates: r light; r floor; r at key. Uses: a list of "fixed", "geometry" includes; asset; number; error. Returns: undefined; a record containing mode, image, copied fields, light, imageWidth, imageHeight, camera, floor. */ function validate(
    v,
    bounds,
  ) {
    if (v === undefined) return undefined;
    const r = {
      ...defaults,
      ...v,
      camera: { ...defaults.camera, ...v.camera },
    };
    if (
      !["fixed", "geometry"].includes(r.mode) ||
      !asset(r.image) ||
      !number(r.imageWidth, 1, 4096) ||
      !number(r.imageHeight, 1, 4096)
    )
      throw Error("Invalid interior artwork or mode.");
    for (const [k, n] of Object.entries(r.camera))
      if (!number(n, -10000, 10000)) throw Error("Invalid room camera " + k);
    const c = r.camera;
    if (
      Math.abs(c.axisXX * c.axisYY - c.axisXY * c.axisYX) < 0.1 ||
      c.heightScale < 1 ||
      c.heightScale > 500
    )
      throw Error("Room camera axes must form a usable floor.");
    if (r.normal !== undefined && !asset(r.normal))
      throw Error("Invalid room normal map.");
    r.light = {
      ambient: 0.35,
      strength: 0.8,
      x: -0.5,
      y: 0.5,
      z: 1,
      ...r.light,
    };
    for (const k of ["ambient", "strength", "x", "y", "z"])
      if (
        !number(
          r.light[k],
          k === "ambient" ? 0 : k === "strength" ? 0 : -1,
          k === "strength" ? 2 : 1,
        )
      )
        throw Error("Invalid room lighting.");
    if (Math.hypot(r.light.x, r.light.y, r.light.z) < 0.01)
      throw Error("Light direction cannot be zero.");
    r.floor = polygon(r.floor, bounds);
    if (root.FrontierRoomLayout)
      r.layout = root.FrontierRoomLayout.validate(r.layout, bounds);
    const ids = new Set();
    const lists = ["blockers", "sprites", "primitives", "entrances", "exits"];
    for (const key of lists) {
      if (!Array.isArray(r[key]) || r[key].length > 256)
        throw Error("Too many room " + key);
      r[key] = r[key].map(
        /* @function interiors.callback.9 — Provides the callback for r at key map. Inputs: e. Uses: /^[a-z0-9_-]{1,64}$/i test; ids has; number; error. Returns: o. */ (
          e,
        ) => {
          if (
            typeof e.id !== "string" ||
            !/^[a-z0-9_-]{1,64}$/i.test(e.id) ||
            ids.has(e.id) ||
            typeof e.name !== "string" ||
            e.name.length > 80 ||
            !number(e.x, 1, bounds.width - 1) ||
            !number(e.y, 1, bounds.height - 1)
          )
            throw Error("Invalid room " + key + " placement");
          ids.add(e.id);
          const o = { ...e };
          if (["blockers", "primitives"].includes(key)) {
            if (
              e.yaw !== undefined &&
              !number(e.yaw, -Math.PI * 100, Math.PI * 100)
            )
              throw Error("Invalid primitive rotation.");
            for (const k of ["w", "d"])
              if (
                !number(e[k], 0.05, 100) ||
                e.x -
                  (Math.abs(Math.cos(e.shape === "round" ? 0 : e.yaw || 0)) *
                    e.w +
                    Math.abs(Math.sin(e.shape === "round" ? 0 : e.yaw || 0)) *
                      e.d) /
                    2 <
                  0.5 ||
                e.y -
                  (Math.abs(Math.sin(e.shape === "round" ? 0 : e.yaw || 0)) *
                    e.w +
                    Math.abs(Math.cos(e.shape === "round" ? 0 : e.yaw || 0)) *
                      e.d) /
                    2 <
                  0.5 ||
                e.x +
                  (Math.abs(Math.cos(e.shape === "round" ? 0 : e.yaw || 0)) *
                    e.w +
                    Math.abs(Math.sin(e.shape === "round" ? 0 : e.yaw || 0)) *
                      e.d) /
                    2 >
                  bounds.width - 0.5 ||
                e.y +
                  (Math.abs(Math.sin(e.shape === "round" ? 0 : e.yaw || 0)) *
                    e.w +
                    Math.abs(Math.cos(e.shape === "round" ? 0 : e.yaw || 0)) *
                      e.d) /
                    2 >
                  bounds.height - 0.5
              )
                throw Error("Block footprint is outside map.");
            if (key === "primitives" && e.shape !== undefined) {
              if (e.shape !== "round" || !root.FrontierRoundGeometry)
                throw Error("Unknown room shape.");
              root.FrontierRoundGeometry.primitiveFaces(e);
              if (
                Math.abs(e.w - e.radius * 2) > 1e-6 ||
                Math.abs(e.d - e.radius * 2) > 1e-6
              )
                throw Error("Round bounds must match diameter.");
            }
            if (
              key === "primitives" &&
              e.texture !== undefined &&
              !asset(e.texture)
            )
              throw Error("Invalid room surface texture.");
            if (
              key === "primitives" &&
              e.tileSize !== undefined &&
              !number(e.tileSize, 0.05, 100)
            )
              throw Error("Texture repeat size must be .05–100 world units.");
            if (key === "primitives") {
              if (
                e.textureMapping !== undefined &&
                !["auto", "repeat", "fit", "wallHeight"].includes(e.textureMapping)
              )
                throw Error("Unknown texture mapping mode.");
              if (
                e.preserveAspect !== undefined &&
                typeof e.preserveAspect !== "boolean"
              )
                throw Error("Texture aspect setting must be boolean.");
              for (const k of [
                "textureRotation",
                "textureOffsetU",
                "textureOffsetV",
              ])
                if (e[k] !== undefined && !number(e[k], -10000, 10000))
                  throw Error("Invalid texture control " + k);
            }
            if (
              key === "primitives" &&
              (!number(e.z, -30, 100) ||
                !number(e.h, 0.02, 30) ||
                !/^#[0-9a-f]{6}$/i.test(e.color))
            )
              throw Error("Invalid primitive height/color.");
          }
          if (key === "sprites" && e.normal !== undefined && !asset(e.normal))
            throw Error("Invalid sprite normal map.");
          if (
            key === "sprites" &&
            (!asset(e.image) ||
              !number(e.height, 0.1, 10) ||
              !number(e.width, 0.1, 10) ||
              !number(e.radius, 0, 5))
          )
            throw Error("Invalid furniture sprite.");
          if (
            ["entrances", "exits"].includes(key) &&
            e.z !== undefined &&
            !number(e.z, -30, 100)
          )
            throw Error("Invalid doorway elevation.");
          if (key === "entrances" && !number(e.yaw, -Math.PI * 2, Math.PI * 2))
            throw Error("Invalid entrance facing.");
          if (
            key === "exits" &&
            (!number(e.radius, 0.2, 5) ||
              typeof e.map !== "string" ||
              e.map.length > 64 ||
              typeof e.entrance !== "string" ||
              e.entrance.length > 64)
          )
            throw Error("Invalid exit destination.");
          return o;
        },
      );
    }
    return {
      mode: r.mode,
      // October 14: outdoor structure geometry shares room primitives without
      // replacing terrain, sky or outdoor navigation with an interior boundary.
      ...(r.outdoor === true ? { outdoor: true } : {}),
      image: r.image,
      ...(r.normal ? { normal: r.normal } : {}),
      light: r.light,
      imageWidth: r.imageWidth,
      imageHeight: r.imageHeight,
      camera: r.camera,
      floor: r.floor,
      ...(r.layout ? { layout: r.layout } : {}),
      ...Object.fromEntries(
        lists.map(
          /* @function interiors.callback.10 — Returns a list of k, r at k. Inputs: k. Returns: a list of k, r at k. */ (
            k,
          ) => [k, r[k]],
        ),
      ),
    };
  }
  /* @function interiors.inside.11 — Handles inside within interior rooms and their camera. Inputs: p; x; y. Updates: j; yes. Returns: yes. */ function inside(
    p,
    x,
    y,
  ) {
    let yes = false;
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const a = p[i],
        b = p[j];
      if (
        a[1] > y !== b[1] > y &&
        x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]
      )
        yes = !yes;
    }
    return yes;
  }
  /* @function interiors.segmentDistance.12 — Handles segment distance within interior rooms and their camera. Inputs: x; y; a; b. Returns: math hypot using x minus a at 0 minus dx multiplied by t, y minus a at 1 minus dy multiplied by t. */ function segmentDistance(
    x,
    y,
    a,
    b,
  ) {
    const dx = b[0] - a[0],
      dy = b[1] - a[1],
      t = Math.max(
        0,
        Math.min(
          1,
          ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1),
        ),
      );
    return Math.hypot(x - a[0] - dx * t, y - a[1] - dy * t);
  }
  /* @function interiors.data.13 — Handles data within interior rooms and their camera. Inputs: w. Updates: c. Uses: cache get; r floor map; a list of spread element, spread element map; r primitives filter. Returns: null; c. */ function data(
    w,
  ) {
    const r = w.interior;
    if (!r) return null;
    let c = cache.get(r);
    if (c) return c;
    const edges = r.floor.map(
        /* @function interiors.callback.14 — Returns a list of a, r floor at i plus 1 % r floor length. Inputs: a; i. Returns: a list of a, r floor at i plus 1 % r floor length. */ (
          a,
          i,
        ) => [a, r.floor[(i + 1) % r.floor.length]],
      ),
      boxes = [
        ...r.blockers,
        ...r.primitives.filter(
          /* @function interiors.callback.15 — Returns e h is greater than 0.3. Inputs: e. Returns: e h is greater than 0.3. */ (
            e,
          ) => e.h > 0.3,
        ),
      ].map(
        /* @function interiors.callback.16 — Returns a record containing copied fields, x0, x1, y0, y1. Inputs: e. Returns: a record containing copied fields, x0, x1, y0, y1. */ (
          e,
        ) => ({
          ...e,
          x0: e.x - e.w / 2,
          x1: e.x + e.w / 2,
          y0: e.y - e.d / 2,
          y1: e.y + e.d / 2,
        }),
      ),
      faces = [];
    for (const e of r.primitives) {
      // October 12, 2026: round polygons are shared with the physical footprint.
      // Horizontal disk faces may be triangles, so centers use actual vertex counts.
      if (e.shape === "round") {
        for (const points of root.FrontierRoundGeometry.primitiveFaces(e)) {
          let cx = 0,
            cy = 0,
            cz = 0;
          for (const p of points) {
            cx += p[0];
            cy += p[1];
            cz += p[2];
          }
          faces.push({
            id: e.id,
            points,
            roundMapping: root.FrontierRoundGeometry.mapping(e, points),
            color: e.color,
            texture: e.texture,
            tileSize: e.tileSize || 1,
            textureMapping: e.textureMapping,
            preserveAspect: e.preserveAspect,
            textureRotation: e.textureRotation,
            textureOffsetU: e.textureOffsetU,
            textureOffsetV: e.textureOffsetV,
            x: cx / points.length,
            y: cy / points.length,
            z: cz / points.length,
          });
        }
        continue;
      }
      const x = e.x - e.w / 2,
        y = e.y - e.d / 2,
        z = e.z,
        h = e.h,
        a = [x, y, z],
        b = [x + e.w, y, z],
        c = [x + e.w, y + e.d, z],
        d = [x, y + e.d, z],
        A = [x, y, z + h],
        B = [x + e.w, y, z + h],
        C = [x + e.w, y + e.d, z + h],
        D = [x, y + e.d, z + h];
      // October 12, 2026: box yaw rotates actual vertices about the authored center.
      // Collision uses the same orientation, so rotating a wall cannot leave a stale footprint.
      const yaw = e.yaw || 0,
        cos = Math.cos(yaw),
        sin = Math.sin(yaw);
      for (const p of [a, b, c, d, A, B, C, D]) {
        const dx = p[0] - e.x,
          dy = p[1] - e.y;
        p[0] = e.x + cos * dx - sin * dy;
        p[1] = e.y + sin * dx + cos * dy;
      }
      for (const points of [
        [A, B, C, D],
        [d, c, b, a],
        [a, b, B, A],
        [b, c, C, B],
        [c, d, D, C],
        [d, a, A, D],
      ])
        faces.push({
          id: e.id,
          points,
          color: e.color,
          texture: e.texture,
          tileSize: e.tileSize || 1,
          textureMapping: e.textureMapping,
          preserveAspect: e.preserveAspect,
          textureRotation: e.textureRotation,
          textureOffsetU: e.textureOffsetU,
          textureOffsetV: e.textureOffsetV,
          x:
            points.reduce(
              /* @function interiors.callback.17 — Returns n plus p at 0. Inputs: n; p. Returns: n plus p at 0. */ (
                n,
                p,
              ) => n + p[0],
              0,
            ) / 4,
          y:
            points.reduce(
              /* @function interiors.callback.18 — Returns n plus p at 1. Inputs: n; p. Returns: n plus p at 1. */ (
                n,
                p,
              ) => n + p[1],
              0,
            ) / 4,
          z:
            points.reduce(
              /* @function interiors.callback.19 — Returns n plus p at 2. Inputs: n; p. Returns: n plus p at 2. */ (
                n,
                p,
              ) => n + p[2],
              0,
            ) / 4,
        });
    }
    c = { edges, boxes, faces };
    cache.set(r, c);
    return c;
  }
  /* @function interiors.blocked.20 — Tests whether the proposed movement or location meets a solid obstacle. Inputs: w; x; y; assignment pattern; assignment pattern. Uses: data; inside; c edges some; room exits some. Returns: false; true. */ function blocked(
    w,
    x,
    y,
    r = 0.13,
    z = 0,
  ) {
    const room = w.interior;
    if (!room) return false;
    const c = data(w);
    const boundary =
      room.layout && root.FrontierRoomPhysics
        ? !root.FrontierRoomPhysics.walkable(w, x, y, r)
        : !inside(room.floor, x, y) ||
          c.edges.some(
            /* @function interiors.callback.21 — Returns segment distance using x, y, a is less than r. Inputs: array pattern. Uses: segment distance. Returns: segment distance using x, y, a is less than r. */ ([
              a,
              b,
            ]) => segmentDistance(x, y, a, b) < r,
          );
    const corridor =
      boundary &&
      room.exits.some(
        /* @function interiors.callback.22 — Returns the inverse of inside using room floor, e x, e y and math hypot using x minus e x, y minus e y is less than e radius plus r and c edges some using a callback. Inputs: e. Uses: inside; c edges some. Returns: the inverse of inside using room floor, e x, e y and math hypot using x minus e x, y minus e y is less than e radius plus r and c edges some using a callback. */ (
          e,
        ) =>
          !inside(room.floor, e.x, e.y) &&
          Math.hypot(x - e.x, y - e.y) < e.radius + r &&
          c.edges.some(
            /* @function interiors.callback.23 — Returns segment distance using e x, e y, a is less than e radius. Inputs: array pattern. Uses: segment distance. Returns: segment distance using e x, e y, a is less than e radius. */ ([
              a,
              b,
            ]) => segmentDistance(e.x, e.y, a, b) < e.radius,
          ),
      );
    if (!room.outdoor && boundary && !corridor) return true;
    // October 12, 2026: complete primitive volumes supersede the old h>.3 footprint
    // filter below. Retain the former path for standalone legacy integrations.
    if (root.FrontierRoomPhysics)
      return (
        root.FrontierRoomPhysics.blocked(w, x, y, z, r) ||
        room.sprites.some(
          /* @function interiors.spriteVolume1524 - Inputs: furniture record. Returns: footprint overlap; independent sprite collision remains unchanged. No mutation. */ function (
            e,
          ) {
            return e.radius && Math.hypot(x - e.x, y - e.y) < r + e.radius;
          },
        )
      );
    return (
      c.boxes.some(
        /* @function interiors.callback.24 — Returns x plus r is greater than e x0 and x minus r is less than e x1 and y plus r is greater than e y0 and y minus r is less than e y1 and e h equals undefined or z is less than e z plus e h minus 0.001 and z plus 1.65 is greater than e z. Inputs: e. Returns: x plus r is greater than e x0 and x minus r is less than e x1 and y plus r is greater than e y0 and y minus r is less than e y1 and e h equals undefined or z is less than e z plus e h minus 0.001 and z plus 1.65 is greater than e z. */ (
          e,
        ) =>
          x + r > e.x0 &&
          x - r < e.x1 &&
          y + r > e.y0 &&
          y - r < e.y1 &&
          (e.h === undefined || (z < e.z + e.h - 0.001 && z + 1.65 > e.z)),
      ) ||
      room.sprites.some(
        /* @function interiors.callback.25 — Returns e radius and math hypot using x minus e x, y minus e y is less than r plus e radius. Inputs: e. Returns: e radius and math hypot using x minus e x, y minus e y is less than r plus e radius. */ (
          e,
        ) => e.radius && Math.hypot(x - e.x, y - e.y) < r + e.radius,
      )
    );
  }
  /* @function interiors.camera.26 — Calculates the camera view or constrains its position against this module’s solid geometry. Inputs: game. Returns: null; a record containing orthographic, x, y, z, yaw, pitch, cx, cy. */ function camera(
    game,
  ) {
    const iso = root.FrontierIsometric?.camera(game);
    if (iso) return iso;
    const r = game.sourceWorld.interior;
    if (r?.mode !== "fixed") return null;
    const baseFit = Math.min(
        (game.viewWidth || 640) / r.imageWidth,
        480 / r.imageHeight,
      ),
      zoom = Math.max(1, Math.min(3, game.camera?.roomZoom || 1)),
      fit = baseFit * zoom,
      ox =
        ((game.viewWidth || 640) - r.imageWidth * baseFit) / 2 +
        r.imageWidth * 0.5 * baseFit * (1 - zoom),
      oy =
        (480 - r.imageHeight * baseFit) / 2 +
        r.imageHeight * 0.68 * baseFit * (1 - zoom);
    return {
      orthographic: true,
      x: 20,
      y: -2,
      z: 12,
      yaw: r.camera.yaw,
      pitch: -0.37,
      cx: 320,
      cy: 240,
      fit,
      ox,
      oy,
      room: r,
    };
  }
  /* @function interiors.project.27 — Converts a world-space position into this renderer’s screen-space representation. Inputs: cam; x; y; assignment pattern. Returns: a record containing x, y, scale, depth. */ function project(
    cam,
    x,
    y,
    z = 0,
  ) {
    const c = cam.room.camera,
      dx = x - c.originX,
      dy = y - c.originY;
    return {
      x: cam.ox + (c.screenX + dx * c.axisXX + dy * c.axisYX) * cam.fit,
      y:
        cam.oy +
        (c.screenY + dx * c.axisXY + dy * c.axisYY - z * c.heightScale) *
          cam.fit,
      scale: c.heightScale * cam.fit,
      depth: cam.outdoorIsometric ? ((x-cam.x)*Math.sin(cam.yaw)+(y-cam.y)*Math.cos(cam.yaw))*Math.cos(cam.pitch)+(z-cam.z)*Math.sin(cam.pitch) : 24 + ((x - 9) * Math.sin(cam.yaw) + (y - 9) * Math.cos(cam.yaw)),
    };
  }
  /* @function interiors.groundPoint.28 — Handles ground point within interior rooms and their camera. Inputs: cam; sx; sy. Returns: a record containing x, y. */ function groundPoint(
    cam,
    sx,
    sy,
  ) {
    const c = cam.room.camera,
      x = (sx - cam.ox) / cam.fit - c.screenX,
      y = (sy - cam.oy) / cam.fit - c.screenY,
      det = c.axisXX * c.axisYY - c.axisXY * c.axisYX;
    return {
      x: c.originX + (x * c.axisYY - y * c.axisYX) / det,
      y: c.originY + (y * c.axisXX - x * c.axisXY) / det,
    };
  }
  // Fixed rooms aim on a horizontal plane at weapon height. A hovered body
  // supplies its center; empty artwork supplies an orthographic plane point.
  /* @function interiors.aim.29 — supplies its center; empty artwork supplies an orthographic plane point. Inputs: game; sx; sy. Uses: camera; root frontier render pick; ground point. Returns: null; a record containing x, y, z. */ function aim(
    game,
    sx,
    sy,
  ) {
    const iso = root.FrontierIsometric?.aim(game, sx, sy);
    if (iso) return iso;
    const cam = camera(game);
    if (!cam) return null;
    const hit = root.FrontierRender?.pick(game, sx, sy),
      z = (game.player.z || 0) + 0.95;
    if (hit)
      return {
        x: hit.x,
        y: hit.y,
        z: (hit.z || 0) + Math.min(1, hit.height / 2),
      };
    return {
      ...groundPoint(cam, sx, sy + z * cam.room.camera.heightScale * cam.fit),
      z,
    };
  }
  /* @function interiors.nearClip.30 — Handles near clip within interior rooms and their camera. Inputs: cam; vertices. Uses: depth; out push; a map. Returns: out. */ function nearClip(
    cam,
    vertices,
  ) {
    const depth =
        /* @function interiors.depth.31 — Returns p at 0 minus cam x multiplied by math sin using cam yaw plus p at 1 minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus p at 2 minus cam z multiplied by math sin using cam pitch. Inputs: p. Returns: p at 0 minus cam x multiplied by math sin using cam yaw plus p at 1 minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus p at 2 minus cam z multiplied by math sin using cam pitch. */ (
          p,
        ) =>
          ((p[0] - cam.x) * Math.sin(cam.yaw) +
            (p[1] - cam.y) * Math.cos(cam.yaw)) *
            Math.cos(cam.pitch) +
          (p[2] - cam.z) * Math.sin(cam.pitch),
      out = [];
    for (let i = 0; i < vertices.length; i++) {
      const a = vertices[i],
        b = vertices[(i + 1) % vertices.length],
        da = depth(a),
        db = depth(b),
        inside = da >= 0.13;
      if (inside) out.push(a);
      if (inside !== db >= 0.13) {
        const t = (0.13 - da) / (db - da);
        out.push(
          a.map(
            /* @function interiors.callback.32 — Returns n plus b at k minus n multiplied by t. Inputs: n; k. Returns: n plus b at k minus n multiplied by t. */ (
              n,
              k,
            ) => n + (b[k] - n) * t,
          ),
        );
      }
    }
    return out;
  }
  /* @function interiors.image.33 — Handles image within interior rooms and their camera. Inputs: src. Updates: im src. Uses: images has; images set; images delete; images keys using next. Returns: null; images get using src. */ function image(
    src,
  ) {
    if (!src) return null;
    if (!images.has(src)) {
      const im = new Image();
      im.src =
        src === "img/interiors/Room_Test_A.png" && root.FrontierRoomArt
          ? root.FrontierRoomArt
          : src;
      images.set(src, im);
      if (images.size > 64) images.delete(images.keys().next().value);
    }
    return images.get(src);
  }
  /* @function interiors.background.34 — Handles background within interior rooms and their camera. Inputs: ctx; game; cam. Updates: ctx vector display; ctx asset normal; ctx asset light. Uses: image; ctx draw image. Returns: without a result. */ function background(
    ctx,
    game,
    cam,
  ) {
    if (!cam.orthographic) return;
    const im = image(cam.room.image);
    if (im?.complete && im.naturalWidth) {
      const style = ctx.vectorDisplay;
      ctx.vectorDisplay = null;
      ctx.assetNormal = image(cam.room.normal);
      ctx.assetLight = cam.room.light;
      ctx.drawImage(
        im,
        0,
        0,
        im.naturalWidth,
        im.naturalHeight,
        cam.ox,
        cam.oy,
        cam.room.imageWidth * cam.fit,
        cam.room.imageHeight * cam.fit,
      );
      ctx.assetNormal = null;
      ctx.assetLight = null;
      ctx.vectorDisplay = style;
    }
  }
  /* @function interiors.furniture.35 — Handles furniture within interior rooms and their camera. Inputs: ctx; e; p. Updates: ctx asset normal; ctx asset light. Uses: image; ctx draw image. Returns: without a result. */ function furniture(
    ctx,
    e,
    p,
  ) {
    const im = image(e.image);
    if (!im?.complete || !im.naturalWidth) return;
    ctx.assetNormal = image(e.normal);
    ctx.assetLight = ctx.world.interior.light;
    ctx.drawImage(
      im,
      0,
      0,
      im.naturalWidth,
      im.naturalHeight,
      p.x - (e.width * p.scale) / 2,
      p.y - e.height * p.scale,
      e.width * p.scale,
      e.height * p.scale,
    );
    ctx.assetNormal = null;
    ctx.assetLight = null;
  }
  /* @function interiors.outline.36 — Handles outline within interior rooms and their camera. Inputs: ctx; w; cam; project. Updates: ctx vector display; ctx fog depth; ctx fill style; ctx font. Uses: line; data; project; r exits includes. Returns: without a result. */ function outline(
    ctx,
    w,
    cam,
    project,
  ) {
    const r = w.interior;
    if (!r) return;
    const style = ctx.vectorDisplay;
    ctx.vectorDisplay = null;
    ctx.fogDepth = 0;
    /* @function interiors.line.37 — Handles line within interior rooms and their camera. Inputs: points; color. Updates: ctx stroke style; ctx line width; begun. Uses: ctx begin path; project; ctx at begun selects "lineTo" or "moveTo"; ctx stroke. */ function line(
      points,
      color,
    ) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      let begun = false;
      for (const a of points) {
        const p = project(cam, a[0], a[1], 0);
        if (p) {
          ctx[begun ? "lineTo" : "moveTo"](p.x, p.y);
          begun = true;
        }
      }
      ctx.stroke();
    }
    line([...r.floor, r.floor[0]], "#72e6a2");
    for (const e of data(w).boxes)
      line(
        [
          [e.x0, e.y0],
          [e.x1, e.y0],
          [e.x1, e.y1],
          [e.x0, e.y1],
          [e.x0, e.y0],
        ],
        "#ff8070",
      );
    for (const e of [...r.entrances, ...r.exits]) {
      const p = project(cam, e.x, e.y, 0);
      if (p) {
        ctx.fillStyle = r.exits.includes(e) ? "#ffd273" : "#72e6a2";
        ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
        ctx.font = "9px monospace";
        ctx.fillText(e.name, p.x + 5, p.y);
      }
    }
    ctx.vectorDisplay = style;
  }
  /* @function interiors.testWorld.38 — Handles test world within interior rooms and their camera. Inputs: base; assignment pattern. Updates: w width; w height; w size; w objects; w events. Uses: structured clone; frontier terrain validate; frontier water validate; frontier sky validate. Returns: frontier world validate using w. */ function testWorld(
    base,
    geometry = false,
  ) {
    const w = structuredClone(base);
    w.width = w.height = w.size = 24;
    w.objects = [];
    w.events = [];
    w.spawn = { x: 9, y: 8 };
    w.terrain = FrontierTerrain.validate({
      mode: "flat",
      amplitude: 0,
      frequency: 0.12,
    });
    w.water = FrontierWater.validate();
    w.sky = FrontierSky.validate({ ...FrontierSky.defaults, enabled: false });
    w.fog = FrontierFog.validate({ enabled: false });
    w.interior = structuredClone(defaults);
    if (geometry) {
      w.interior.mode = "geometry";
      w.interior.primitives = [
        {
          id: "floor",
          name: "Floor slab",
          x: 9,
          y: 9,
          w: 10,
          d: 10,
          z: -0.1,
          h: 0.1,
          color: "#645247",
        },
        {
          id: "rear-wall",
          name: "Rear wall",
          x: 9,
          y: 14,
          w: 10,
          d: 0.2,
          z: 0,
          h: 3,
          color: "#39534b",
        },
        {
          id: "side-wall",
          name: "Side wall",
          x: 4,
          y: 9,
          w: 0.2,
          d: 10,
          z: 0,
          h: 3,
          color: "#493b39",
        },
      ];
    }
    w.vectorDisplay = FrontierVector.validate({ enabled: false });
    return FrontierWorld.validate(w);
  }
  /* @function interiors.structureDraft — Inputs: authored world dimensions. Returns a fresh empty geometry container for outdoor construction; does not mutate the map. Uses full-map bounds and retains terrain/sky through outdoor=true. Existing interiors are cloned, never converted. Caller commits through validated Undo. */
  function structureDraft(world) {
    if (world.interior) return structuredClone(world.interior);
    const width = world.width ?? world.size, height = world.height ?? world.size;
    return { ...structuredClone(defaults), mode: "geometry", outdoor: true,
      floor: [[0.5,0.5],[width-0.5,0.5],[width-0.5,height-0.5],[0.5,height-0.5]],
      primitives: [], blockers: [], sprites: [], entrances: [], exits: [] };
  }
  root.FrontierInterior = {
    structureDraft,
    defaults,
    validate,
    inside,
    blocked,
    aim,
    nearClip,
    camera,
    project,
    groundPoint,
    background,
    furniture,
    outline,
    data,
    testWorld,
    image,
  };
})(typeof window === "undefined" ? globalThis : window);
