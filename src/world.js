/* MAINTAINER GUIDE
 * Seeded world generation and import validation. Rectangular bounds, legacy migration and bounded generation are shared with movement, events, saves and rendering.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function world.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier world. */
(/* @function world.installReviewed — Installs seeded world generation, bounded import validation and explicit legacy migration. Authored rectangular bounds and validated terrain/events are shared with movement, saves and rendering; registration does not generate a separate live playtest. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  // Legacy square maps use size; new maps store explicit rectangular bounds.
  /* @function world.dimensions.2 — Legacy square maps use size; new maps store explicit rectangular bounds. Inputs: w. Uses: number is integer; error. Returns: a record containing width, height. */ function dimensions(
    w,
  ) {
    const width = w.width ?? w.size ?? 48,
      height = w.height ?? w.size ?? 48;
    if (
      !Number.isInteger(width) ||
      !Number.isInteger(height) ||
      width < 16 ||
      height < 16 ||
      width > 512 ||
      height > 512
    )
      throw Error("Map width and height must be integers from 16 to 512.");
    return { width, height };
  }
  /* @function world.activitySettings.3 — Handles activity settings within world. Inputs: assignment pattern. Uses: number is finite; error. Returns: r. */ function activitySettings(
    v = {},
  ) {
    const r = {
      activeDistance: 24,
      reducedDistance: 48,
      reducedInterval: 0.25,
      hysteresis: 4,
      ...v,
    };
    if (
      !Number.isFinite(r.activeDistance) ||
      r.activeDistance < 16 ||
      r.activeDistance > 128 ||
      !Number.isFinite(r.reducedDistance) ||
      r.reducedDistance < r.activeDistance + 8 ||
      r.reducedDistance > 256 ||
      !Number.isFinite(r.reducedInterval) ||
      r.reducedInterval < 0.1 ||
      r.reducedInterval > 2 ||
      !Number.isFinite(r.hysteresis) ||
      r.hysteresis < 0 ||
      r.hysteresis > 8
    )
      throw Error("Invalid activity distances/interval.");
    return r;
  }
  const kinds = ["tree", "rock", "monster", "ruin"];
  // Hash the seed and return a deterministic random stream. Keep generator order stable if old seeds must reproduce worlds.
  /* @function world.rng.4 — Hash the seed and return a deterministic random stream. Keep generator order stable if old seeds must reproduce worlds. Inputs: seed. Updates: s. Uses: string; c char code at. Returns: a callback. */ function rng(
    seed,
  ) {
    let s = 2166136261;
    for (const c of String(seed)) s = Math.imul(s ^ c.charCodeAt(0), 16777619);
    return /* @function world.callback.5 — Provides the callback for the enclosing world operation. Inputs: no explicit arguments; uses enclosing module state. Updates: s; t. Returns: t ^ t >>> 14 >>> 0 divided by 4294967296. */ () => {
      s += 0x6d2b79f5;
      let t = Math.imul(s ^ (s >>> 15), s | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  // Instantiate a prop using canonical project definitions; imported values cannot override tuned collision dimensions.
  /* @function world.entity.6 — Instantiate a prop using canonical project definitions; imported values cannot override tuned collision dimensions. Inputs: kind; x; y; id. Returns: a record containing id, kind, x, y, radius, height. */ function entity(
    kind,
    x,
    y,
    id,
  ) {
    const d = root.FrontierProject.definitions[kind];
    return {
      id,
      kind,
      x,
      y,
      radius: d.radius,
      height: d.height,
    };
  }
  // Scatter seeded props with clearance around spawn, then create a ring of demonstration enemies.
  /* @function world.generate.7 — Scatter seeded props with clearance around spawn, then create a ring of demonstration enemies. Inputs: seed; assignment pattern; assignment pattern. Updates: world objects. Uses: dimensions; rng; string; random. Returns: world. */ function generate(
    seed,
    width = 48,
    height = 48,
  ) {
    dimensions({ width, height });
    const random = rng(seed),
      world = {
        schemaVersion: "sprite-frontier/1",
        seed: String(seed),
        size: width,
        width,
        height,
        gridSpacing: 2,
        spawn: {
          x: width / 2,
          y: height / 2,
        },
        objects: [],
      };
    const buckets = new Map(),
      cell = 4;
    const candidates =
      /* @function world.candidates.8 — Handles candidates within world. Inputs: x; y. Uses: out push; buckets get. Returns: out. */ (
        x,
        y,
      ) => {
        const out = [];
        for (
          let a = Math.floor(x / cell) - 1;
          a <= Math.floor(x / cell) + 1;
          a++
        )
          for (
            let b = Math.floor(y / cell) - 1;
            b <= Math.floor(y / cell) + 1;
            b++
          )
            out.push(...(buckets.get(a + ":" + b) || []));
        return out;
      };
    for (
      let i = 0;
      i < Math.min(10000, Math.round((230 * width * height) / 2304));
      i++
    ) {
      const x = 2 + random() * (width - 4),
        y = 2 + random() * (height - 4);
      if (Math.hypot(x - width / 2, y - height / 2) < 4) continue;
      const r = random(),
        kind = r < 0.68 ? "tree" : r < 0.93 ? "rock" : "ruin";
      if (
        candidates(x, y).some(
          /* @function world.callback.9 — Returns math hypot using e x minus x, e y minus y is less than e radius plus 1. Inputs: e. Returns: math hypot using e x minus x, e y minus y is less than e radius plus 1. */ (
            e,
          ) => Math.hypot(e.x - x, e.y - y) < e.radius + 1,
        )
      )
        continue;
      const item = entity(kind, x, y, "prop-" + i);
      world.objects.push(item);
      const key = Math.floor(x / cell) + ":" + Math.floor(y / cell);
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(item);
    }
    for (let i = 0; i < 9; i++) {
      const a = (i * Math.PI * 2) / 9,
        x = width / 2 + Math.sin(a) * Math.min(9, width / 3),
        y = height / 2 + Math.cos(a) * Math.min(9, height / 3);
      world.objects = world.objects.filter(
        /* @function world.callback.10 — Returns math hypot using e x minus x, e y minus y is greater than 1.5. Inputs: e. Returns: math hypot using e x minus x, e y minus y is greater than 1.5. */ (
          e,
        ) => Math.hypot(e.x - x, e.y - y) > 1.5,
      );
      world.objects.push(entity("monster", x, y, "sentinel-" + i));
    }
    return world;
  }
  // Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields.
  /* @function world.validate.11 — Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields. Inputs: w. Updates: result events; result prefabs; result interior; result travel; result cerebral. Uses: number is integer; array is array; error; dimensions. Returns: result. */ function validate(
    w,
  ) {
    if (
      !w ||
      w.schemaVersion !== "sprite-frontier/1" ||
      typeof w.seed !== "string" ||
      w.seed.length > 100 ||
      !Number.isInteger(w.width ?? w.size) ||
      !Number.isInteger(w.height ?? w.size) ||
      !Array.isArray(w.objects) ||
      w.objects.length > 20000
    )
      throw Error(
        "Expected a Sprite Frontier v1 world, at most 20000 objects.",
      );
    // October 22, 2026: stable-ID legacy enemy conversion precedes event validation.
    w = root.FrontierEnemies?.migrate(w) || w;
    const { width, height } = dimensions(w);
    if (w.width !== undefined && w.size !== undefined && w.size !== width)
      throw Error("Legacy size must match width.");
    const gridSpacing = w.gridSpacing ?? 2;
    if (!Number.isInteger(gridSpacing) || gridSpacing < 1 || gridSpacing > 16)
      throw Error("Grid spacing must be 1–16 world units.");
    const ids = new Set();
    const inside =
      /* @function world.inside.12 — Returns p and number is finite using p x and number is finite using p y and p x is at least 1 and p y is at least 1 and p x is at most width minus 1 and p y is at most height minus 1. Inputs: p. Uses: number is finite. Returns: p and number is finite using p x and number is finite using p y and p x is at least 1 and p y is at least 1 and p x is at most width minus 1 and p y is at most height minus 1. */ (
        p,
      ) =>
        p &&
        Number.isFinite(p.x) &&
        Number.isFinite(p.y) &&
        p.x >= 1 &&
        p.y >= 1 &&
        p.x <= width - 1 &&
        p.y <= height - 1;
    if (!inside(w.spawn)) throw Error("Spawn is outside the world.");
    if (
      w.spawn.z !== undefined &&
      (!Number.isFinite(w.spawn.z) || w.spawn.z < -30 || w.spawn.z > 100)
    )
      throw Error("Invalid spawn elevation.");
    const result = {
      schemaVersion: w.schemaVersion,
      seed: w.seed,
      size: width,
      width,
      height,
      gridSpacing,
      activity: activitySettings(w.activity),
      spawn: {
        x: w.spawn.x,
        y: w.spawn.y,
        ...(w.spawn.z === undefined ? {} : { z: w.spawn.z }),
      },
      objects: w.objects.map(
        /* @function world.callback.13 — Provides the callback for w objects map. Inputs: e. Uses: ids has; kinds includes; inside; error. Returns: a record containing copied fields, elevation, copied fields, copied fields, copied fields, copied fields, copied fields. */ (
          e,
        ) => {
          if (
            !e ||
            typeof e.id !== "string" ||
            !e.id ||
            e.id.length > 100 ||
            ids.has(e.id) ||
            !kinds.includes(e.kind) ||
            !inside(e)
          )
            throw Error("Invalid object, position or duplicate ID.");
          ids.add(e.id);
          const elevation = e.elevation ?? 0;
          if (!Number.isInteger(elevation) || Math.abs(elevation) > 100)
            throw Error("Elevation must be an integer from -100 to 100 feet.");
          if (
            e.vectorTreatment &&
            !["map", "original", "phosphor", "outline"].includes(
              e.vectorTreatment,
            )
          )
            throw Error("Invalid asset treatment.");
          if (
            e.name !== undefined &&
            (typeof e.name !== "string" || e.name.length > 80)
          )
            throw Error("Invalid object name.");
          if (
            e.spriteProfile !== undefined &&
            (typeof e.spriteProfile !== "string" ||
              e.spriteProfile.length > 100)
          )
            throw Error("Invalid sprite profile.");
          if (
            e.typeId !== undefined &&
            (typeof e.typeId !== "string" || e.typeId.length > 100)
          )
            throw Error("Invalid type reference.");
          if (
            e.cerebralSource !== undefined &&
            typeof e.cerebralSource !== "boolean"
          )
            throw Error("Invalid Cerebral source");
          return {
            ...entity(e.kind, e.x, e.y, e.id),
            elevation,
            ...(e.cerebralSource ? { cerebralSource: true } : {}),
            ...(e.name ? { name: e.name } : {}),
            ...(e.spriteProfile ? { spriteProfile: e.spriteProfile } : {}),
            ...(e.typeId ? { typeId: e.typeId } : {}),
            ...(e.vectorTreatment
              ? { vectorTreatment: e.vectorTreatment }
              : {}),
          };
        },
      ),
    };
    if (
      result.objects.some(
        /* @function world.callback.14 — Returns e elevation or 0 multiplied by 0.3 is less than 1.65 and e elevation or 0 multiplied by 0.3 plus e height is greater than 0 and math hypot using e x minus result spawn x, e y minus result spawn y is less than e radius plus 0.3. Inputs: e. Returns: e elevation or 0 multiplied by 0.3 is less than 1.65 and e elevation or 0 multiplied by 0.3 plus e height is greater than 0 and math hypot using e x minus result spawn x, e y minus result spawn y is less than e radius plus 0.3. */ (
          e,
        ) =>
          (e.elevation || 0) * 0.3 < 1.65 &&
          (e.elevation || 0) * 0.3 + e.height > 0 &&
          Math.hypot(e.x - result.spawn.x, e.y - result.spawn.y) <
            e.radius + 0.3,
      )
    )
      throw Error("An object blocks the player spawn.");
    result.events = root.FrontierEvents.validate(
      w.events === undefined ? [] : w.events,
      new Set([
        "player",
        ...result.objects.map(
          /* @function world.callback.15 — Returns e id. Inputs: e. Returns: e id. */ (
            e,
          ) => e.id,
        ),
      ]),
      result,
    );
    if (
      result.events.some(
        /* @function world.callback.16 — Returns e elevation or 0 multiplied by 0.3 is less than 1.65 and e elevation or 0 multiplied by 0.3 plus 1.65 is greater than 0 and e pages some using a callback and math hypot using e x minus result spawn x, e y minus result spawn y is less than 0.55. Inputs: e. Uses: e pages some. Returns: e elevation or 0 multiplied by 0.3 is less than 1.65 and e elevation or 0 multiplied by 0.3 plus 1.65 is greater than 0 and e pages some using a callback and math hypot using e x minus result spawn x, e y minus result spawn y is less than 0.55. */ (
          e,
        ) =>
          (e.elevation || 0) * 0.3 < 1.65 &&
          (e.elevation || 0) * 0.3 + 1.65 > 0 &&
          e.pages.some(
            /* @function world.callback.17 — Returns p solid and the inverse of p through and p priority equals "normal". Inputs: p. Returns: p solid and the inverse of p through and p priority equals "normal". */ (
              p,
            ) => p.solid && !p.through && p.priority === "normal",
          ) &&
          Math.hypot(e.x - result.spawn.x, e.y - result.spawn.y) < 0.55,
      )
    )
      throw Error("A solid event blocks the player spawn.");
    if (w.prefabs !== undefined) {
      if (!Array.isArray(w.prefabs) || w.prefabs.length > 100)
        throw Error("Invalid type library.");
      const seen = new Set();
      result.prefabs = w.prefabs.map(
        /* @function world.callback.18 — Provides the callback for w prefabs map. Inputs: t. Uses: seen has; kinds includes; error; seen add. Returns: a record containing id, name, kind, copied fields, copied fields. */ (
          t,
        ) => {
          if (
            typeof t.id !== "string" ||
            seen.has(t.id) ||
            typeof t.name !== "string" ||
            t.name.length > 80 ||
            !kinds.includes(t.kind)
          )
            throw Error("Invalid reusable type.");
          seen.add(t.id);
          if (
            t.spriteProfile !== undefined &&
            (typeof t.spriteProfile !== "string" ||
              t.spriteProfile.length > 100)
          )
            throw Error("Invalid type sprite.");
          return {
            id: t.id,
            name: t.name,
            kind: t.kind,
            ...(t.spriteProfile ? { spriteProfile: t.spriteProfile } : {}),
            ...(t.event
              ? {
                  event: root.FrontierEvents.validate(
                    [{ ...t.event, x: 1, y: 1 }],
                    new Set(),
                    result,
                  )[0],
                }
              : {}),
          };
        },
      );
    }
    if (root.FrontierInterior && w.interior !== undefined)
      result.interior = root.FrontierInterior.validate(w.interior, result);
    if (w.travel !== undefined) {
      const room = root.FrontierInterior.validate(
        {
          ...root.FrontierInterior.defaults,
          entrances: w.travel.entrances || [],
          exits: w.travel.exits || [],
        },
        result,
      );
      result.travel = { entrances: room.entrances, exits: room.exits };
    }
    if (root.FrontierCerebral)
      result.cerebral = root.FrontierCerebral.validate(w.cerebral);
    if (w.groundMaterial !== undefined) {
      if (
        !/^ground-(moss|forest-litter|mossy-stone|earth)$/.test(
          w.groundMaterial,
        )
      )
        throw Error("Invalid ground material.");
      result.groundMaterial = w.groundMaterial;
    }
    if (w.transitionEffect !== undefined) {
      if (!["fade", "melt", "door", "immediate"].includes(w.transitionEffect))
        throw Error("Invalid map transition effect.");
      result.transitionEffect = w.transitionEffect;
    }
    if (w.spriteNormals !== undefined)
      result.spriteNormals = root.FrontierNormalBindings.validate(
        w.spriteNormals,
      );
    result.terrain = root.FrontierTerrain.validate(w.terrain);
    result.sky = root.FrontierSky.validate(w.sky);
    if (root.FrontierWater) result.water = root.FrontierWater.validate(w.water);
    for (const key of Object.keys(result.terrain.edits || {})) {
      const [x, y] = key.split(",").map(Number);
      if (x > width || y > height) throw Error("Terrain edit outside map.");
    }
    for (const key of Object.keys(result.water?.cells || {})) {
      const [x, y] = key.split(",").map(Number);
      if (x >= width || y >= height) throw Error("Water outside map.");
    }
    if (root.FrontierFlight)
      result.flight = root.FrontierFlight.validate(w.flight);
    if (root.FrontierFog) result.fog = root.FrontierFog.validate(w.fog);
    if (root.FrontierVector)
      result.vectorDisplay = root.FrontierVector.validate(w.vectorDisplay);
    if (root.FrontierWeaponTuning)
      result.weaponSpreads = root.FrontierWeaponTuning.validate(
        w.weaponSpreads,
      );
    if (root.FrontierParameters)
      result.parameters = root.FrontierParameters.validate(w.parameters);
    if (root.FrontierMusic) result.music = root.FrontierMusic.validate(w.music);
    const feedback = w.clickFeedback || { sound: "Click 1", volume: 0.5 };
    if (
      typeof feedback.sound !== "string" ||
      feedback.sound.length > 180 ||
      /[\\/:]/.test(feedback.sound) ||
      !Number.isFinite(feedback.volume) ||
      feedback.volume < 0 ||
      feedback.volume > 1
    )
      throw Error("Invalid click sound/volume.");
    result.clickFeedback = { sound: feedback.sound, volume: feedback.volume };
    if (w.assetCatalog) {
      result.assetCatalog = {};
      for (const category of ["exploration", "combat"]) {
        const names = w.assetCatalog[category];
        if (
          !Array.isArray(names) ||
          names.length > 500 ||
          names.some(
            /* @function world.callback.19 — Returns typeof n does not equal "string" or n includes using ".." or /[\\/:]/ test using n or the inverse of /^.+\.(ogg|mp3|wav|m4a|webm)$/i test using n. Inputs: n. Uses: n includes; /[\\/:]/ test; /^.+\.(ogg|mp3|wav|m4a|webm)$/i test. Returns: typeof n does not equal "string" or n includes using ".." or /[\\/:]/ test using n or the inverse of /^.+\.(ogg|mp3|wav|m4a|webm)$/i test using n. */ (
              n,
            ) =>
              typeof n !== "string" ||
              n.includes("..") ||
              /[\\/:]/.test(n) ||
              !/^.+\.(ogg|mp3|wav|m4a|webm)$/i.test(n),
          )
        )
          throw Error("Invalid asset catalog.");
        result.assetCatalog[category] = [...new Set(names)];
      }
    }
    // 2026-10-09: cell policy survives project roundtrips; gameplay drops live in saves.
    if (root.FrontierHubState)
      result.cell = root.FrontierHubState.settings(w.cell);
    if (w.doorTransition !== undefined)
      result.doorTransition = root.FrontierDoorTransition.validate(
        w.doorTransition,
      );
    if (root.FrontierNativeEffects)
      result.nativeEffects = root.FrontierNativeEffects.validate(
        w.nativeEffects,
      );
    // October 12, 2026: radius lighting remains independent cell data and survives portable project validation.
    if (root.FrontierLocalLighting)
      result.lighting = root.FrontierLocalLighting.validate(w.lighting);
    return result;
  }
  root.FrontierWorld = {
    rng,
    entity,
    generate,
    validate,
    dimensions,
    activitySettings,
  };
})(typeof window === "undefined" ? globalThis : window);
