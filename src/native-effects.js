/* October 10, 2026: native world effects, independent of RPG Maker hooks.
 * Serialized settings contain no live particles. Pools are bounded, rebuilt on
 * cell changes, and sample existing inverse depth so walls hide particles. */
(/* @function native-effects.install — Inputs: engine namespace. Publishes validation, renderer and diagnostic APIs; no images or particles allocated at installation. */ function (
  root,
) {
  "use strict";
  const kinds = [
      "rain",
      "fire",
      "steam",
      "dust",
      "ash",
      "spores",
      "insects",
      "drips",
      "debris",
      "grass",
      "reeds",
      "tumbleweed",
      "mushrooms",
      "wireweed",
      "roaches",
      "gnats",
      "centipedes",
      "flies",
      "litter",
      "cobweb",
    ],
    live = new WeakMap(),
    sourceCache = new WeakMap();
  /* @function native-effects.number — Inputs: value, fallback and inclusive bounds. Returns a finite numeric value or throws a readable validation error. No mutation; units supplied by the setting contract. */
  function number(value, fallback, min, max) {
    const n = value ?? fallback;
    if (!Number.isFinite(n) || n < min || n > max)
      throw Error("Effect value must be between " + min + " and " + max);
    return n;
  }
  /* @function native-effects.validate — Inputs: optional map effects record. Returns a compact JSON-safe clone. Rejects unknown emitters, oversized notes, invalid coordinates and budgets above 1024 particles. Rates are particles/second; positions/radius are world units. */
  function validate(value = {}) {
    const notes = value.notes ?? "";
    if (typeof notes !== "string" || notes.length > 16000)
      throw Error("Map notes exceed 16000 characters");
    const emitters = [];
    if (
      !Array.isArray(value.emitters ?? []) ||
      (value.emitters ?? []).length > 64
    )
      throw Error("Use at most 64 emitters");
    for (const source of value.emitters ?? []) {
      if (!kinds.includes(source.kind)) throw Error("Unknown native effect");
      emitters.push({
        kind: source.kind,
        x: number(source.x, 12, 0, 512),
        y: number(source.y, 12, 0, 512),
        z: number(source.z, 2, -100, 100),
        radius: number(source.radius, 3, 0.1, 100),
        rate: number(source.rate, 15, 0, 200),
        enabled: source.enabled !== false,
      });
    }
    const color = value.color ?? {};
    return {
      notes,
      budget: number(value.budget, 256, 0, 1024),
      emitters,
      color: {
        enabled: color.enabled === true,
        strength: number(color.strength, 0.4, 0, 1),
        speed: number(color.speed, 0.3, 0, 3),
        palette: color.palette === "wizards" ? "wizards" : "original",
      },
      breathing: root.FrontierBreathing
        ? root.FrontierBreathing.validate(value.breathing)
        : {
            enabled: value.breathing?.enabled === true,
            amplitude: number(value.breathing?.amplitude, 0.01, 0, 0.05),
            frequency: number(value.breathing?.frequency, 0.3, 0.01, 2),
          },
    };
  }
  /* @function native-effects.optIn — Inputs: validated map settings and entity role/note. Returns explicit map player/follower opt-in or event-note opt-in. Map color activation does not silently recolor actors. */
  function optIn(settings, role, note = "") {
    return (
      settings?.color?.enabled &&
      (role === "player"
        ? /<ColorPoolPlayer>/i.test(settings.notes)
        : role === "follower"
          ? /<ColorPoolFollowers>/i.test(settings.notes)
          : /<ColorPool>/i.test(note))
    );
  }
  /* @function native-effects.roof — Inputs: world and world XY. Returns the lowest room face above one unit, or infinity outdoors. Samples only horizontal faces; openings remain open. No mutation. */
  function roof(world, x, y, game) {
    let height = Infinity;
    for (const entity of game?.sceneEvents || []) {
      if (entity.spatial?.collisionMode !== "mesh") continue;
      const asset = root.FrontierModelLibrary?.get(entity.modelId);
      if (!asset?.scene) continue;
      const z = root.FrontierModelMeshCollision.support(
        asset,
        root.FrontierModelEvents.matrix(entity),
        x,
        y,
        1,
        100,
        {},
        0,
      );
      if (z !== null) height = Math.min(height, z);
    }
    for (const face of root.FrontierInterior.data(world)?.faces || []) {
      const points = face.points,
        z = points[0][2];
      if (
        z <= 1 ||
        !points.every(
          /* @function native-effects.flatFace — Inputs: vertex. Returns whether its height matches this horizontal face, within .001 world units. */ function (
            p,
          ) {
            return Math.abs(p[2] - z) < 0.001;
          },
        )
      )
        continue;
      let x0 = Infinity,
        x1 = -Infinity,
        y0 = Infinity,
        y1 = -Infinity;
      for (const p of points) {
        x0 = Math.min(x0, p[0]);
        x1 = Math.max(x1, p[0]);
        y0 = Math.min(y0, p[1]);
        y1 = Math.max(y1, p[1]);
      }
      if (x >= x0 && x <= x1 && y >= y0 && y <= y1)
        height = Math.min(height, z);
    }
    return height;
  }
  /* @function native-effects.sources — Inputs: authored world. Returns a cached list of at most 64 world/event emitter definitions. Events opt in with <NativeEffect: kind> in their notes. Event coordinates are resolved at spawning time so moving hosts carry their emission origins. Does not change authored events. */
  function sources(world) {
    if (sourceCache.has(world)) return sourceCache.get(world);
    const list = [...(world.nativeEffects?.emitters || [])];
    for (const event of world.events || []) {
      const pattern = /<NativeEffect:\s*([a-z]+)\s*>/gi;
      let match;
      while ((match = pattern.exec(event.note || "")) && list.length < 64) {
        const kind = match[1].toLowerCase();
        if (kinds.includes(kind))
          list.push({
            kind,
            eventId: event.id,
            x: event.x,
            y: event.y,
            z: kind === "rain" ? 5 : 0,
            radius: kind === "rain" ? 4 : 0.5,
            rate: kind === "rain" ? 20 : 5,
            enabled: true,
          });
      }
      if (list.length >= 64) break;
    }
    sourceCache.set(world, list);
    return list;
  }
  /* @function native-effects.draw — Inputs: gameplay canvas, current game and elapsed seconds. Advances a bounded map-local pool and draws world-projected effects behind solid depth. Paused/cutscene callers pass zero seconds. Cell replacement releases the weakly held pool. Returns nothing. */
  function draw(canvas, game, dt) {
    const world = game.sourceWorld,
      settings = world.nativeEffects;
    if (!settings) return;
    const emitters = sources(world);
    if (!emitters.length) return;
    let state = live.get(world);
    if (!state) {
      state = {
        particles: [],
        credit: new Float32Array(emitters.length),
        spawned: 0,
      };
      live.set(world, state);
    }
    const ctx = root.FrontierPixi?.current() || canvas.getContext("2d"),
      cam = root.FrontierRender.camera(game),
      depth = ctx.terrainDepth;
    ctx.save();
    for (let index = 0; index < emitters.length; index++) {
      const source = emitters[index],
        host = source.eventId
          ? game.runtime?.entities?.get(source.eventId) ||
            game.sceneEvents?.find(
              /* @function native-effects.host — Inputs: visible event entity. Returns whether ID matches this emitter host. */ function (
                entity,
              ) {
                return entity.id === source.eventId;
              },
            )
          : null,
        emitter = host
          ? { ...source, x: host.x, y: host.y, z: (host.z || 0) + source.z }
          : source;
      if (!emitter.enabled) continue;
      state.credit[index] += dt * emitter.rate;
      while (state.credit[index] >= 1) {
        state.credit[index]--;
        if (state.particles.length >= settings.budget) break;
        const angle = Math.random() * Math.PI * 2,
          r = Math.sqrt(Math.random()) * emitter.radius,
          x = emitter.x + Math.sin(angle) * r,
          y = emitter.y + Math.cos(angle) * r;
        if (emitter.kind === "rain" && roof(world, x, y, game) < emitter.z)
          continue;
        state.particles.push({
          kind: emitter.kind,
          x,
          y,
          z: emitter.z,
          life: 2,
          age: 0,
        });
        state.spawned++;
      }
    }
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.age += dt;
      p.z +=
        dt *
        (p.kind === "rain" || p.kind === "drips"
          ? -7
          : p.kind === "fire"
            ? 1
            : [
                  "grass",
                  "reeds",
                  "mushrooms",
                  "wireweed",
                  "cobweb",
                  "litter",
                ].includes(p.kind)
              ? 0
              : 0.3);
      const ground = root.FrontierTerrain.height(world, p.x, p.y);
      if (p.age > p.life || p.z < ground) {
        state.particles.splice(i, 1);
        continue;
      }
      const q = root.FrontierRender.project(cam, p.x, p.y, p.z);
      if (
        !q ||
        q.x < 0 ||
        q.y < 0 ||
        q.x >= (game.viewWidth || 640) ||
        q.y >= 480
      )
        continue;
      if (
        depth &&
        depth.values[
          Math.floor(q.y / depth.step) * depth.w + Math.floor(q.x / depth.step)
        ] >
          1 / q.depth + 0.001
      )
        continue;
      ctx.globalAlpha = Math.max(0, 1 - p.age / p.life);
      ctx.strokeStyle =
        p.kind === "fire"
          ? "#ef8640"
          : p.kind === "rain"
            ? "#93b8cf"
            : "#b2b9a1";
      ctx.fillStyle = ctx.strokeStyle;
      if (p.kind === "rain" || p.kind === "drips") {
        ctx.beginPath();
        ctx.moveTo(q.x, q.y);
        ctx.lineTo(q.x - 1, q.y - 5);
        ctx.stroke();
      } else if (["grass", "reeds", "wireweed"].includes(p.kind)) {
        ctx.strokeStyle = p.kind === "wireweed" ? "#706255" : "#809052";
        ctx.beginPath();
        ctx.moveTo(q.x, q.y);
        ctx.lineTo(q.x - 3, q.y - 12);
        ctx.moveTo(q.x, q.y);
        ctx.lineTo(q.x + 3, q.y - 10);
        ctx.stroke();
      } else if (p.kind === "mushrooms") {
        ctx.fillStyle = "#9c3c30";
        ctx.fillRect(q.x - 3, q.y - 8, 6, 3);
        ctx.fillStyle = "#c1baa1";
        ctx.fillRect(q.x - 1, q.y - 5, 2, 5);
      } else if (p.kind === "cobweb") {
        ctx.strokeStyle = "#adb5b5";
        ctx.beginPath();
        ctx.moveTo(q.x - 8, q.y - 8);
        ctx.lineTo(q.x + 8, q.y + 8);
        ctx.moveTo(q.x + 8, q.y - 8);
        ctx.lineTo(q.x - 8, q.y + 8);
        ctx.moveTo(q.x - 8, q.y);
        ctx.lineTo(q.x + 8, q.y);
        ctx.stroke();
      } else if (p.kind === "tumbleweed") {
        ctx.strokeStyle = "#84775f";
        ctx.strokeRect(q.x - 4, q.y - 4, 8, 8);
      } else ctx.fillRect(q.x, q.y, 2, 2);
    }
    ctx.restore();
  }
  /* @function native-effects.diagnostics — Inputs: world. Returns active particle count, hard budget and total spawned for readable performance reporting. Does not create a pool. */
  function diagnostics(world) {
    const state = live.get(world);
    return {
      particles: state?.particles.length || 0,
      budget: world.nativeEffects?.budget || 0,
      spawned: state?.spawned || 0,
    };
  }
  root.FrontierNativeEffects = {
    validate,
    optIn,
    draw,
    diagnostics,
    kinds,
    sources,
  };
})(typeof window === "undefined" ? globalThis : window);
