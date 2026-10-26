/* October 26, 2026: default radius lighting is enabled with 0.4 ambient; a subtle warm player light defaults on with six-metre smooth falloff. Earlier disabled-default comments below are superseded; explicit revision-1 map overrides survive. */
/* October 12, 2026: independently authored radius lighting. Emission is separate
 * from enemy detection and exploration. No game assets or third-party lighting
 * implementation are used. World coordinates are metres with Z up. */
(/* @function localLighting.install — Inputs: browser/global namespace. Returns: nothing. Installs validated cell lighting, bounded active-frame selection and CPU sampling. No GPU context or DOM is created here. */ function (
  root,
) {
  "use strict";
  // October 14: active item-light membership changes only with scene/drop references.
  const itemHosts1525 = new WeakMap();
  const caches = new WeakMap(),
    MAX_LIGHTS = 8,
    MAX_BLOCKERS = 32;
  /* @function localLighting.finite — Inputs: value, label, inclusive numeric bounds. Returns: validated number; throws a readable parameter error before saving invalid state. */
  function finite(value, label, min, max) {
    if (!Number.isFinite(value) || value < min || value > max)
      throw Error(label + " must be " + min + "–" + max + ".");
    return value;
  }
  /* @function localLighting.source — Inputs: light record and fallback ID. Returns: isolated validated light settings. Position is world-space unless eventId attaches its offset to an event. Throws malformed IDs, colors or out-of-range settings. */
  function source(value = {}, id = "light") {
    const v = {
      id,
      name: "Light",
      enabled: true,
      x: 0,
      y: 0,
      z: 1.5,
      color: "#fff0cf",
      radius: 4,
      intensity: 1,
      falloff: 2,
      flicker: 0,
      ...value,
    };
    if (
      typeof v.id !== "string" ||
      !/^[a-z0-9_-]{1,64}$/i.test(v.id) ||
      typeof v.name !== "string" ||
      v.name.length > 80 ||
      !/^#[0-9a-f]{6}$/i.test(v.color) ||
      typeof v.enabled !== "boolean"
    )
      throw Error("Invalid light identity/color.");
    for (const axis of ["x", "y", "z"])
      finite(v[axis], "Light " + axis, -10000, 10000);
    finite(v.radius, "Light radius", 0.05, 100);
    finite(v.intensity, "Light brightness", 0, 4);
    finite(v.falloff, "Light falloff", 0.5, 4);
    finite(v.flicker, "Light flicker", 0, 0.3);
    if (
      v.eventId !== undefined &&
      (typeof v.eventId !== "string" || !/^[a-z0-9_-]{1,64}$/i.test(v.eventId))
    )
      throw Error("Invalid light event attachment.");
    return v;
  }
  /* @function localLighting.validate — Inputs: optional cell settings. Returns: independent lighting record; disabled by default preserves earlier cell appearance. Throws invalid capacities/parameters. Player/projectile emission is opt-in, and authored sources are limited to 128. */
  function validate(value = {}) {
    const v = {
      enabled: true,
      ambient: 0.4,
      budget: 8,
      steps: 0,
      lights: [],
      ...value,
    };
    if (
      typeof v.enabled !== "boolean" ||
      !Number.isInteger(v.budget) ||
      v.budget < 1 ||
      v.budget > MAX_LIGHTS ||
      !Number.isInteger(v.steps) ||
      v.steps < 0 ||
      v.steps > 32
    )
      throw Error("Invalid lighting mode/budget.");
    finite(v.ambient, "Ambient brightness", 0, 1);
    if (!Array.isArray(v.lights) || v.lights.length > 128)
      throw Error("At most 128 authored lights per cell.");
    const ids = new Set(),
      lights = [];
    for (const light of v.lights) {
      const checked = source(light);
      if (ids.has(checked.id)) throw Error("Duplicate light ID.");
      ids.add(checked.id);
      lights.push(checked);
    }
    return {
      ...v,
      lights,
      sun:sun163(v.sun),
      player: source(
        { enabled: true, radius: 6, intensity: 0.45, falloff:2, color:"#fff0dc", z: 1.2, ...v.player },
        "player-light",
      ),
      projectiles: source(
        {
          enabled: false,
          radius: 2,
          intensity: 1.2,
          color: "#ffbd66",
          z: 0,
          ...v.projectiles,
        },
        "projectile-light",
      ),
    };
  }
  /* @function localLighting.color — Inputs: validated hexadecimal color. Returns: normalized RGB components. No mutation or image pixel processing. */
  function color(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  /* @function localLighting.cache — Inputs: authoritative world. Returns: static blocker records and bounded static-sample cache. Rebuilds only for a new validated world identity. Shadow blockers currently cover room primitives; imported triangle shadows are a documented separate limitation. */
  function cache(world) {
    let entry = caches.get(world);
    if (entry) return entry;
    const blockers = [];
    for (const e of world.interior?.primitives || [])
      blockers.push({
        x: e.x,
        y: e.y,
        z: e.z,
        w: e.w,
        d: e.d,
        h: e.h,
        yaw: e.yaw || 0,
        ...(e.shape === "round"
          ? {
              shape: e.shape,
              radius: e.radius,
              innerRadius: e.innerRadius || 0,
              arcStart: (e.arcStart || 0) + (e.yaw || 0),
              arcSweep: e.arcSweep ?? Math.PI * 2,
            }
          : {}),
      });
    entry = { blockers, samples: new Map() };
    caches.set(world, entry);
    return entry;
  }
  /* @function localLighting.frame — Inputs: live game and elapsed scene seconds. Returns: bounded active lighting snapshot. Dynamic sources derive directly from current player/events/projectiles, so dead/despawned projectiles retain no light records. Source selection sorts by player distance and stable ID; diagnostics report dropped sources/blockers. */
  function frame(game, time = 0) {
    const world = game.sourceWorld,
      settings = world.lighting;
    if (!settings?.enabled) return null;
    const candidates = [],
      player = game.player;
    for (const light of settings.lights) {
      if (!light.enabled) continue;
      let x = light.x,
        y = light.y,
        z = light.z;
      if (light.eventId) {
        const host = game.sceneEvents?.find(
          /* @function localLighting.attachedHost — Inputs: runtime event. Returns: enabled attachment ID match. */ function (
            e,
          ) {
            return e.id === light.eventId && !e.dead;
          },
        );
        if (!host) continue;
        if (root.FrontierModelEvents && root.FrontierModelTransform) {
          const position = root.FrontierModelTransform.vector(
            root.FrontierModelEvents.matrix(host),
            [x, y, z],
          );
          [x, y, z] = position;
        } else {
          x += host.x;
          y += host.y;
          z += host.z || 0;
        }
      }
      candidates.push({
        ...light,
        x,
        y,
        z,
        dynamic: !!light.eventId || light.flicker > 0,
      });
    }
    if (settings.player.enabled)
      candidates.push({
        ...settings.player,
        x: player.x + settings.player.x,
        y: player.y + settings.player.y,
        z: (player.z || 0) + settings.player.z,
        dynamic: true,
      });
    for (const p of game.projectiles || []) {
      if (p.map !== undefined && p.map !== game.currentMapId) continue;
      const light = { ...settings.projectiles, ...p.light };
      if (!light.enabled) continue;
      const point = p.position || p;
      if (
        !Number.isFinite(point.x) ||
        !Number.isFinite(point.y) ||
        !Number.isFinite(point.z ?? 0)
      )
        continue;
      candidates.push({
        ...light,
        id: "projectile-" + p.id,
        x: point.x,
        y: point.y,
        z: point.z || 0,
        dynamic: true,
      });
    }
    // October 14: placed/dropped item lights share this active-cell source
    // budget. Picking up removes the host; inactive cells allocate no lights.
    let itemHosts = itemHosts1525.get(game);
    if (!itemHosts || itemHosts.drops !== game.hubDrops || itemHosts.events !== game.sceneEvents) {
      itemHosts = { drops:game.hubDrops, events:game.sceneEvents, hosts:[] };
      for (const collection of [game.hubDrops || [], game.sceneEvents || []])
        for (const host of collection) if (host.itemLight) itemHosts.hosts.push(host);
      itemHosts1525.set(game, itemHosts);
    }
    for (const host of itemHosts.hosts) {
      const light = host.itemLight;
      if (!light?.enabled || host.dead) continue;
      candidates.push({ ...light, id:"item-"+host.id,
        x:host.x+(light.x || 0), y:host.y+(light.y || 0),
        z:(host.z || 0)+(light.z || 0), dynamic:light.flicker>0 });
    }
    candidates.sort(
      /* @function localLighting.nearest — Inputs: two light records. Returns: squared player-distance ordering and stable ID tie-break; does not change authored arrays. */ function (
        a,
        b,
      ) {
        return (
          (a.x - player.x) ** 2 +
            (a.y - player.y) ** 2 +
            (a.z - (player.z || 0)) ** 2 -
            ((b.x - player.x) ** 2 +
              (b.y - player.y) ** 2 +
              (b.z - (player.z || 0)) ** 2) || a.id.localeCompare(b.id)
        );
      },
    );
    const lights = candidates.slice(0, settings.budget);
    for (const light of lights) {
      light.rgb = color(light.color);
      if (light.flicker)
        light.intensity *=
          1 -
          light.flicker *
            0.5 *
            (1 + Math.sin(time * 7 + light.x * 3 + light.y));
    }
    const entry = cache(world),
      blockers = entry.blockers.slice(0, MAX_BLOCKERS);
    return {
      ambient: settings.ambient,
      steps: settings.steps,
      lights,
      blockers,
      cache: entry.samples,
      droppedLights: Math.max(0, candidates.length - lights.length),
      droppedBlockers: Math.max(0, entry.blockers.length - blockers.length),
      shadowCoverage:
        entry.blockers.length <= MAX_BLOCKERS
          ? "room primitives"
          : "room primitive budget exceeded",
    };
  }
  /* @function localLighting.obstructed — Inputs: world sample point, light point and oriented blocker. Returns: segment crossing through solid volume, excluding endpoint contact. Uses slab intervals in blocker-local coordinates. No mutation; terrain and imported-mesh shadow casting are not inferred. */
  /* @function localLighting.roundObstructed — Inputs: sample XYZ, light record and round slab/ring/arc. Returns whether the open segment crosses its circular solid volume. Splits the segment at circle, height and radial arc boundaries; tests interval midpoints, preserving hollow centers. Uses smooth circular shadow boundaries, an explicit approximation of faceted visual edges. No mutation; bounded by eight cut points. */
  function roundObstructed(point, light, box) {
    const ax = point[0] - box.x,
      ay = point[1] - box.y,
      az = point[2] - box.z,
      dx = light.x - point[0],
      dy = light.y - point[1],
      dz = light.z - point[2];
    let enter = 0.001,
      leave = 0.999;
    if (Math.abs(dz) < 1e-9) {
      if (az <= 0.0001 || az >= box.h - 0.0001) return false;
    } else {
      const a = -az / dz,
        b = (box.h - az) / dz;
      enter = Math.max(enter, Math.min(a, b));
      leave = Math.min(leave, Math.max(a, b));
    }
    if (enter >= leave) return false;
    const cuts = [enter, leave],
      A = dx * dx + dy * dy,
      B = 2 * (ax * dx + ay * dy);
    if (A > 1e-12)
      for (const r of [box.radius, box.innerRadius]) {
        if (r <= 0) continue;
        const discriminant = B * B - 4 * A * (ax * ax + ay * ay - r * r);
        if (discriminant <= 0) continue;
        for (const t of [
          (-B - Math.sqrt(discriminant)) / (2 * A),
          (-B + Math.sqrt(discriminant)) / (2 * A),
        ])
          if (t > enter && t < leave) cuts.push(t);
      }
    if (box.arcSweep < Math.PI * 2 - 1e-8)
      for (const angle of [box.arcStart, box.arcStart + box.arcSweep]) {
        const c = Math.cos(angle),
          s = Math.sin(angle),
          den = c * dy - s * dx;
        if (Math.abs(den) > 1e-12) {
          const t = -(c * ay - s * ax) / den;
          if (t > enter && t < leave) cuts.push(t);
        }
      }
    cuts.sort(
      /* @function localLighting.orderCuts — Inputs: segment parameters. Returns ascending difference for interval ordering; does not change world/light records. */ function (
        a,
        b,
      ) {
        return a - b;
      },
    );
    for (let i = 1; i < cuts.length; i++) {
      const t = (cuts[i - 1] + cuts[i]) / 2,
        x = ax + dx * t,
        y = ay + dy * t,
        r = Math.hypot(x, y);
      if (
        r >= box.radius - 0.0001 ||
        (box.innerRadius > 0 && r <= box.innerRadius + 0.0001)
      )
        continue;
      let angle = Math.atan2(y, x) - box.arcStart;
      angle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      if (box.arcSweep >= Math.PI * 2 - 1e-8 || angle < box.arcSweep)
        return true;
    }
    return false;
  }
  /* @function localLighting.obstructedShape — Inputs: world sample, light and validated blocker. Returns segment/solid intersection; dispatches round shapes before the retained oriented-box slab path. No mutation or cached allocations outside round cut points. */
  function obstructed(point, light, box) {
    if (box.shape === "round") return roundObstructed(point, light, box);
    const c = Math.cos(box.yaw),
      s = Math.sin(box.yaw),
      px = point[0] - box.x,
      py = point[1] - box.y,
      lx = light.x - box.x,
      ly = light.y - box.y;
    const a = [c * px + s * py, -s * px + c * py, point[2] - box.z],
      b = [c * lx + s * ly, -s * lx + c * ly, light.z - box.z],
      min = [-box.w / 2, -box.d / 2, 0],
      max = [box.w / 2, box.d / 2, box.h];
    let enter = 0.001,
      exit = 0.999;
    for (let i = 0; i < 3; i++) {
      const d = b[i] - a[i];
      if (Math.abs(d) < 1e-9) {
        if (a[i] <= min[i] + 0.0001 || a[i] >= max[i] - 0.0001) return false;
        continue;
      }
      let lo = (min[i] - a[i]) / d,
        hi = (max[i] - a[i]) / d;
      if (lo > hi) [lo, hi] = [hi, lo];
      enter = Math.max(enter, lo);
      exit = Math.min(exit, hi);
      if (enter >= exit) return false;
    }
    return enter < exit;
  }
  /* @function localLighting.sample — Inputs: active snapshot and world XYZ; optional reusable RGB output. Returns: ambient plus unblocked radius contributions clamped to one. Static-only samples cache at millimetre coordinates with a 16,384-entry bound. Dynamic samples never accumulate persistent per-projectile entries. Quantized steps are optional; alpha is untouched. */
  function sample(snapshot, x, y, z, out = [1, 1, 1]) {
    if (!snapshot) {
      out[0] = out[1] = out[2] = 1;
      return out;
    }
    const staticOnly = snapshot.lights.every(
        /* @function localLighting.staticSource — Inputs: active light. Returns: whether its position/brightness is fixed for this world. */ function (
          e,
        ) {
          return !e.dynamic;
        },
      ),
      signature = snapshot.lights
        .map(
          /* @function localLighting.sourceKey — Inputs: light. Returns: stable source ID for static-cache membership. */ function (
            e,
          ) {
            return e.id;
          },
        )
        .join(","),
      key =
        signature +
        "/" +
        x.toFixed(3) +
        "," +
        y.toFixed(3) +
        "," +
        z.toFixed(3);
    if (staticOnly && snapshot.cache.has(key)) {
      const cached = snapshot.cache.get(key);
      out[0] = cached[0];
      out[1] = cached[1];
      out[2] = cached[2];
      return out;
    }
    out[0] = out[1] = out[2] = snapshot.ambient;
    const point = [x, y, z];
    for (const light of snapshot.lights) {
      const distance = Math.hypot(x - light.x, y - light.y, z - light.z);
      if (distance >= light.radius) continue;
      let blocked = false;
      for (const box of snapshot.blockers)
        if (obstructed(point, light, box)) {
          blocked = true;
          break;
        }
      if (blocked) continue;
      const amount =
        light.intensity * (1 - distance / light.radius) ** light.falloff;
      for (let i = 0; i < 3; i++) out[i] += light.rgb[i] * amount;
    }
    for (let i = 0; i < 3; i++) {
      out[i] = Math.min(1, out[i]);
      if (snapshot.steps > 1)
        out[i] =
          Math.round(out[i] * (snapshot.steps - 1)) / (snapshot.steps - 1);
    }
    if (staticOnly) {
      if (snapshot.cache.size >= 16384) snapshot.cache.clear();
      snapshot.cache.set(key, [...out]);
    }
    return out;
  }
  /* October 26: legacy appearance is the default image treatment; explicit lighting remains independent. No geometry, billboard, UI typography or normal-map data is altered. */
  /* @function localLighting.sun163 — Inputs: optional per-map sun settings. Returns bounded directional ground-shadow configuration; azimuth/elevation use degrees, opacity 0–0.6. Defaults enabled outdoors; render owner categorically excludes interiors. Invalid values throw before adoption. */
  function sun163(value={}){const v={enabled:true,azimuth:135,elevation:45,opacity:0.24,...value};if(typeof v.enabled!=="boolean")throw Error("Sun enabled must be Boolean.");finite(v.azimuth,"Sun azimuth",-36000,36000);finite(v.elevation,"Sun elevation",10,85);finite(v.opacity,"Sun shadow opacity",0,0.6);return v;}
  /* @function localLighting.spriteSunShadow163 — Inputs: active drawing adapter, live scene, projection camera, sprite-bearing entity and world-to-screen callback. Returns Boolean for a drawn alpha silhouette. Projects current artwork frame onto the local horizontal ground plane away from sun; reuses image/crop pools and restores all drawing state. Outdoors only, skips submerged/dead/missing frames and excessive offscreen shadows. This is a bounded ground-plane effect, not mesh/terrain shadow mapping or roof occlusion; it never changes locked actor billboarding. */
  function spriteSunShadow163(ctx,game,cam,entity,project){
    const world=game.sourceWorld,settings=world.lighting;
    if((world.interior&&!world.interior.outdoor) || !settings?.enabled || entity.dead || !(entity.kind==="player" || entity.spriteProfile))return false;
    const sun=sun163(settings.sun);if(!sun.enabled || !sun.opacity)return false;
    const sheet=root.FrontierSprites?.sheet(entity);if(!sheet?.image.complete || !sheet.image.naturalWidth)return false;
    const selected=root.FrontierDirections.select(entity,cam.yaw,sheet.direction,cam),frame=sheet.frames[selected.row*(sheet.columns||3)+selected.column];if(!frame)return false;
    const z=entity.z ?? root.FrontierTerrain.height(world,entity.x,entity.y),water=root.FrontierWater?.level(world,entity.x,entity.y);if(Number.isFinite(water)&&water>z+0.05)return false;
    const height=entity.height||1.65,metres=height/(sheet.referenceHeight||310),width=frame.w*metres,length=Math.min(8,frame.h*metres/Math.tan(sun.elevation*Math.PI/180)),angle=sun.azimuth*Math.PI/180;
    const left=-frame.anchorX*metres,sideX=Math.cos(cam.yaw),sideY=-Math.sin(cam.yaw),dx=-Math.sin(angle)*length,dy=-Math.cos(angle)*length;
    const bottom=project(cam,entity.x+sideX*left,entity.y+sideY*left,z+0.015),right=project(cam,entity.x+sideX*(left+width),entity.y+sideY*(left+width),z+0.015),top=project(cam,entity.x+sideX*left+dx,entity.y+sideY*left+dy,z+0.015);
    if(!bottom||!right||!top || Math.hypot(top.x-bottom.x,top.y-bottom.y)>2000)return false;
    const tint=ctx.assetLightTint,pools=ctx.assetPools,glow=ctx.assetGlow;ctx.save();
    try{ctx.matrix=[(right.x-bottom.x)/frame.w,(right.y-bottom.y)/frame.w,(bottom.x-top.x)/frame.h,(bottom.y-top.y)/frame.h,top.x,top.y];ctx.globalAlpha=sun.opacity;ctx.assetLightTint=[0,0,0];ctx.assetPools=null;ctx.assetGlow=false;ctx.fogDepth=bottom.depth;ctx.drawImage(sheet.image,frame.x,frame.y,frame.w,frame.h,0,0,frame.w,frame.h);}
    finally{ctx.restore();ctx.assetLightTint=tint;ctx.assetPools=pools;ctx.assetGlow=glow;}
    return true;
  }
  /* @function localLighting.appearance163 — Inputs: optional per-cell appearance settings. Returns validated independent legacy/neutral profile with bounded contrast/saturation and softness in CSS pixels. Defaults provide restrained late-1990s image treatment; invalid input throws before project adoption. This is image treatment, not a replacement material or shadow renderer. */
  function appearance163(value={}){
    const v={mode:"legacy",contrast:1.04,saturation:0.94,softness:0.15,...value};
    if(!["legacy","neutral"].includes(v.mode))throw Error("Choose legacy or neutral rendering.");
    finite(v.contrast,"Image contrast",0.5,1.5);finite(v.saturation,"Image saturation",0,2);finite(v.softness,"Image softness",0,1);
    return v;
  }
  /* @function localLighting.appearanceFilter163 — Inputs: validated or partial cell appearance. Returns CSS filter text for world canvas only; neutral bypasses treatment. Does not alter HUD/editor text, pixels stored in assets, collision or normal-map caches. */
  function appearanceFilter163(value){const v=appearance163(value);return v.mode==="neutral" ? "none" : "contrast("+v.contrast+") saturate("+v.saturation+") blur("+v.softness+"px)";}
  root.FrontierLocalLighting = {appearance163,appearanceFilter163,sun163,spriteSunShadow163,
    validate,
    source,
    frame,
    sample,
    obstructed,
    limits: { lights: MAX_LIGHTS, blockers: MAX_BLOCKERS },
  };
})(typeof window === "undefined" ? globalThis : window);
