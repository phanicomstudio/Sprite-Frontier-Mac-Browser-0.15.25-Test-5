/* MAINTAINER GUIDE
 * Validated per-sheet/per-direction/per-animation-frame muzzle authoring. Stored X/Y coordinates are full-sheet pixels; projection converts them into world positions. Projectile and flash have separate points plus yaw/pitch offsets in degrees.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function muzzle.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier muzzle. Uses: load. */
(/* @function muzzle.installReviewed — Installs validated per-sheet/direction/frame muzzle authoring and projection services. Stored points are full-sheet pixels; projectile/flash locations and degree yaw/pitch offsets remain independent of camera-facing sprite presentation. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  const profiles = new Map();
  // Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields.
  /* @function muzzle.validate.2 — Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields. Inputs: data. Uses: array is array; error; ids has; ids add. Returns: structured clone using data. */ function validate(
    data,
  ) {
    if (
      data?.schema !== "phanicom-muzzles/1" ||
      !Array.isArray(data.profiles) ||
      data.profiles.length > 100
    )
      throw Error("Invalid muzzle profile file.");
    const ids = new Set();
    for (const p of data.profiles) {
      if (
        typeof p.id !== "string" ||
        !p.id ||
        p.id.length > 100 ||
        ids.has(p.id)
      )
        throw Error("Invalid or duplicate sprite profile ID.");
      ids.add(p.id);
      for (const [key, max] of [
        ["rows", 16],
        ["columns", 12],
        ["frameWidth", 8192],
        ["frameHeight", 8192],
      ])
        if (!Number.isInteger(p[key]) || p[key] < 1 || p[key] > max)
          throw Error("Invalid sprite " + key + ".");
      if (
        !Number.isFinite(p.referenceHeight) ||
        p.referenceHeight <= 0 ||
        p.referenceHeight > 8192
      )
        throw Error("Invalid reference height.");
      if (
        !Array.isArray(p.frames) ||
        p.frames.length !== p.rows * p.columns ||
        !Array.isArray(p.direction?.rows) ||
        !p.direction.rows.length ||
        p.direction.rows.some(
          /* @function muzzle.callback.3 — Returns the inverse of number is integer using r or r is less than 0 or r is at least p rows. Inputs: r. Uses: number is integer. Returns: the inverse of number is integer using r or r is less than 0 or r is at least p rows. */ (
            r,
          ) => !Number.isInteger(r) || r < 0 || r >= p.rows,
        )
      )
        throw Error("Invalid sprite frame or direction layout.");
      if (p.aimMode !== undefined && !["cursor", "barrel"].includes(p.aimMode))
        throw Error("Invalid aiming mode.");
      const d = p.direction;
      if (
        !Array.isArray(d.walkSequence) ||
        !d.walkSequence.length ||
        [d.idleColumn, ...d.walkSequence].some(
          /* @function muzzle.callback.4 — Returns the inverse of number is integer using c or c is less than 0 or c is at least p columns. Inputs: c. Uses: number is integer. Returns: the inverse of number is integer using c or c is less than 0 or c is at least p columns. */ (
            c,
          ) => !Number.isInteger(c) || c < 0 || c >= p.columns,
        ) ||
        !Number.isFinite(d.frameSeconds) ||
        d.frameSeconds <= 0
      )
        throw Error("Invalid animation layout.");
      for (const f of p.frames)
        if (
          !f ||
          ["x", "y", "w", "h", "anchorX"].some(
            /* @function muzzle.callback.5 — Returns the inverse of number is finite using f at k. Inputs: k. Uses: number is finite. Returns: the inverse of number is finite using f at k. */ (
              k,
            ) => !Number.isFinite(f[k]),
          ) ||
          f.x < 0 ||
          f.y < 0 ||
          f.w <= 0 ||
          f.h <= 0 ||
          f.x + f.w > p.columns * p.frameWidth ||
          f.y + f.h > p.rows * p.frameHeight
        )
          throw Error("Invalid sprite crop.");
      if (
        p.sheetData !== undefined &&
        (typeof p.sheetData !== "string" ||
          !/^data:image\/(png|webp|jpeg);base64,/.test(p.sheetData) ||
          p.sheetData.length > 20000000)
      )
        throw Error("Invalid embedded image.");
      if (
        !p.muzzles ||
        typeof p.muzzles !== "object" ||
        Array.isArray(p.muzzles)
      )
        throw Error("Invalid muzzle points.");
      for (const m of [
        ...Object.values(p.muzzles),
        ...(p.defaultMuzzle ? [p.defaultMuzzle] : []),
      ]) {
        if (!m || !Number.isFinite(m.x) || !Number.isFinite(m.y))
          throw Error("Muzzle requires X/Y coordinates.");
        if ((m.barrelX === undefined) !== (m.barrelY === undefined))
          throw Error("Barrel guide requires both coordinates.");
        if (
          m.barrelDepth !== undefined &&
          (!Number.isFinite(m.barrelDepth) ||
            m.barrelDepth < 0 ||
            m.barrelDepth > 4096)
        )
          throw Error("Invalid barrel depth.");
        if (
          m.barrelX !== undefined &&
          Math.hypot(m.barrelX - m.x, m.barrelY - m.y) < 1
        )
          throw Error(
            "Place the barrel guide at least one pixel beyond the muzzle.",
          );
        for (const key of [
          "x",
          "y",
          "flashX",
          "flashY",
          "barrelX",
          "barrelY",
          "yawOffset",
          "pitchOffset",
        ])
          if (
            m[key] !== undefined &&
            (!Number.isFinite(m[key]) ||
              Math.abs(m[key]) > (key.endsWith("Offset") ? 180 : 131072))
          )
            throw Error("Invalid calibration number.");
      }
    }
    return structuredClone(data);
  }
  // Validate then install muzzle profiles keyed by ID. Existing unrelated profiles remain available.
  /* @function muzzle.load.6 — Validate then install muzzle profiles keyed by ID. Existing unrelated profiles remain available. Inputs: data. Uses: validate; profiles set. */ function load(
    data,
  ) {
    for (const p of validate(data).profiles) profiles.set(p.id, p);
  }
  // Resolve the actor profile ID; default the player to the armed Candy calibration.
  /* @function muzzle.spec.7 — Resolve the actor profile ID; default the player to the armed Candy calibration. Inputs: entity. Uses: profiles get. Returns: profiles get using entity sprite profile or entity id equals "player" or entity kind equals "player" selects "candy-armed" or "". */ function spec(
    entity,
  ) {
    return profiles.get(
      entity.spriteProfile ||
        (entity.id === "player" || entity.kind === "player"
          ? "candy-armed"
          : ""),
    );
  }
  // Select the same directional animation frame used for drawing so muzzle points stay synchronized.
  /* @function muzzle.frame.8 — Select the same directional animation frame used for drawing so muzzle points stay synchronized. Inputs: entity; game. Uses: spec; root frontier render camera; frontier directions select. Returns: null; a record containing profile, copied fields, frame. */ function frame(
    entity,
    game,
  ) {
    const p = spec(entity);
    if (!p) return null;
    const camera = root.FrontierRender?.camera(game);
    const selected = FrontierDirections.select(
      entity,
      camera?.yaw ?? game.camera.yaw,
      p.direction,
      camera,
    );
    return {
      profile: p,
      ...selected,
      frame: p.frames[selected.row * p.columns + selected.column],
    };
  }
  // Convert authored full-sheet pixels into billboard-local offsets, then invert projection into world XYZ.
  /* @function muzzle.point.9 — Convert authored full-sheet pixels into billboard-local offsets, then invert projection into world XYZ. Inputs: entity; game; assignment pattern. Uses: frame; frontier render camera; frontier render project. Returns: null; null. */ function point(
    entity,
    game,
    flash = false,
  ) {
    const selection = frame(entity, game);
    if (!selection) return null;
    const { profile: p, row, column, frame: f } = selection,
      m =
        p.muzzles[row + ":" + column] ||
        p.muzzles[row + ":*"] ||
        p.defaultMuzzle;
    if (!m) return null;
    const x = (flash ? m.flashX : m.x) ?? m.x,
      y = (flash ? m.flashY : m.y) ?? m.y;
    const localX =
      x - column * p.frameWidth - (f.x - column * p.frameWidth) - f.anchorX;
    const localY = f.y + f.h - row * p.frameHeight - (y - row * p.frameHeight);
    const cam = FrontierRender.camera(game),
      feet = FrontierRender.project(cam, entity.x, entity.y, entity.z || 0);
    if (!feet) return null;
    const size = (entity.height || 1.65) / p.referenceHeight,
      side = localX * size,
      up = localY * size;
    if (cam.orthographic) {
      const c = cam.room.camera,
        det = c.axisXX * c.axisYY - c.axisXY * c.axisYX,
        s = side * c.heightScale;
      return {
        x: entity.x + (s * c.axisYY) / det,
        y: entity.y - (s * c.axisXY) / det,
        z: (entity.z || 0) + up,
        yawOffset: ((m.yawOffset || 0) * Math.PI) / 180,
        pitchOffset: ((m.pitchOffset || 0) * Math.PI) / 180,
      };
    }
    // Invert the same billboard projection used to draw the sprite. Both the
    // flash and projectile start remain attached to the authored pixel at any zoom.
    return {
      x:
        entity.x +
        Math.cos(cam.yaw) * side -
        Math.sin(cam.yaw) * Math.sin(cam.pitch) * up,
      y:
        entity.y -
        Math.sin(cam.yaw) * side -
        Math.cos(cam.yaw) * Math.sin(cam.pitch) * up,
      z: (entity.z || 0) + Math.cos(cam.pitch) * up,
      yawOffset: ((m.yawOffset || 0) * Math.PI) / 180,
      pitchOffset: ((m.pitchOffset || 0) * Math.PI) / 180,
    };
  }
  // A sheet line supplies screen-plane direction; depth supplies the missing third axis.
  // Resolve only when firing/reticle updating, never mutate the sheet while drawing.
  /* @function muzzle.barrel.10 — Resolve only when firing/reticle updating, never mutate the sheet while drawing. Inputs: entity; game. Uses: spec; frame; frontier render camera. Returns: null; null. */ function barrel(
    entity,
    game,
  ) {
    if (
      spec(entity)?.aimMode !== "barrel" ||
      game.sourceWorld?.interior?.mode === "fixed" ||
      game.camera.firstPerson ||
      entity.holstered
    )
      return null;
    const s = frame(entity, game),
      cam = FrontierRender.camera(game);
    if (!s || cam.orthographic) return null;
    const p = s.profile,
      m =
        p.muzzles[s.row + ":" + s.column] ||
        p.muzzles[s.row + ":*"] ||
        p.defaultMuzzle;
    if (!m || m.barrelX === undefined || m.barrelY === undefined) return null;
    const side = m.barrelX - m.x,
      up = m.y - m.barrelY,
      forward = m.barrelDepth ?? 100,
      yaw = cam.yaw,
      pitch = cam.pitch,
      x =
        Math.cos(yaw) * side +
        Math.sin(yaw) * (Math.cos(pitch) * forward - Math.sin(pitch) * up),
      y =
        -Math.sin(yaw) * side +
        Math.cos(yaw) * (Math.cos(pitch) * forward - Math.sin(pitch) * up),
      z = Math.sin(pitch) * forward + Math.cos(pitch) * up,
      length = Math.hypot(x, y, z);
    if (length < 1e-6) return null;
    const angle = Math.atan2(x, y) + ((m.yawOffset || 0) * Math.PI) / 180,
      elevation =
        Math.asin(z / length) + ((m.pitchOffset || 0) * Math.PI) / 180;
    return {
      x: Math.sin(angle) * Math.cos(elevation),
      y: Math.cos(angle) * Math.cos(elevation),
      z: Math.sin(elevation),
    };
  }
  // October 14, 2026: fixed-map launch adapter shares this existing module so offline game exports require no new loader/module inventory.
/* @function fixedLaunch.angleDelta — Inputs: target/base yaw radians. Returns shortest signed circular difference in [-pi,pi]; no mutation. Finite inputs are required by caller. */
function angleDelta(target, base) {
  return Math.atan2(Math.sin(target - base), Math.cos(target - base));
}
/* @function fixedLaunch.calculate — Inputs: engine services, actor, game, world-space cursor hit, options and precomputed ordinary third-person launch. Returns that exact existing launch for non-fixed maps; fixed maps return a detached Z-up launch descriptor. Reads the currently displayed frame and calibrated muzzle, never rotates actor or changes sprite presentation. Throws invalid configuration, missing calibration or singular camera before spawning anything. No collision, damage, projectile ownership, persistence or network side effects; integration must pass descriptor through existing projectile collision/lifetime pipeline. */
function fixedCameraLaunch(engine, actor, game, target, options = {}, ordinaryLaunch) {
  if (game.sourceWorld?.interior?.mode !== 'fixed') return ordinaryLaunch;
  const speed = options.speed ?? 25;
  const blend = options.blend ?? 0.15;
  const maxDegrees = options.maxDegrees ?? 5;
  if (!Number.isFinite(speed) || speed <= 0 || !Number.isFinite(blend) || blend < 0 || blend > 1 || !Number.isFinite(maxDegrees) || maxDegrees < 0 || maxDegrees > 5)
    throw Error('Invalid fixed-camera speed or launch assistance.');
  if (!target || ![target.x, target.y, target.z].every(
    /* @function fixedLaunch.finiteTarget — Inputs: coordinate in metres. Returns whether finite; no mutation. */
    function (value) { return Number.isFinite(value); })) throw Error('Cursor target must be world XYZ metres.');
  const camera = engine.FrontierRender.camera(game);
  const selected = engine.FrontierMuzzle.frame(actor, game);
  const muzzle = engine.FrontierMuzzle.point(actor, game);
  const rows = selected?.profile?.direction?.rows;
  const sector = rows?.indexOf(selected.row) ?? -1;
  const c = camera?.orthographic && camera.room?.camera;
  if (!c || !muzzle || sector < 0 || !rows.length) throw Error('Fixed firing requires a calibrated muzzle and directional sheet.');
  const determinant = c.axisXX * c.axisYY - c.axisXY * c.axisYX;
  if (!Number.isFinite(determinant) || Math.abs(determinant) < 1e-9) throw Error('Fixed camera axes are singular.');
  // Invert the SAME affine axes used by FrontierDirections.select. Do not
  // quantize world yaw to 30 degrees: fixed-room screen wedges are affine.
  const visualAngle = sector * Math.PI * 2 / rows.length;
  const screenX = Math.sin(visualAngle), screenY = -Math.cos(visualAngle);
  const facingX = (screenX * c.axisYY - screenY * c.axisYX) / determinant;
  const facingY = (screenY * c.axisXX - screenX * c.axisXY) / determinant;
  const baseYaw = Math.atan2(facingX, facingY) + (muzzle.yawOffset || 0);
  const dx = target.x - muzzle.x, dy = target.y - muzzle.y, dz = target.z - muzzle.z;
  const horizontal = Math.hypot(dx, dy);
  const desiredYaw = horizontal > 1e-9 ? Math.atan2(dx, dy) : baseYaw;
  const limit = maxDegrees * Math.PI / 180;
  const correction = Math.max(-limit, Math.min(limit, angleDelta(desiredYaw, baseYaw) * blend));
  const yaw = baseYaw + correction;
  // Full 3D normalization keeps speed constant for slopes and vertical shots.
  // Assistance affects horizontal launch yaw only; no subsequent homing exists.
  const pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2,
    Math.atan2(dz, horizontal) + (muzzle.pitchOffset || 0)));
  const direction = { x: Math.sin(yaw) * Math.cos(pitch), y: Math.cos(yaw) * Math.cos(pitch), z: Math.sin(pitch) };
  return {
    worldPosition: { x: muzzle.x, y: muzzle.y, z: muzzle.z },
    direction,
    velocity: { x: direction.x * speed, y: direction.y * speed, z: direction.z * speed },
    renderFrameUsed: { row: selected.row, column: selected.column },
    correctionDegrees: correction * 180 / Math.PI,
  };
}

  root.FrontierFixedLaunch = { calculate: fixedCameraLaunch, angleDelta };
  root.FrontierMuzzle = {
    load,
    validate,
    profiles,
    spec,
    frame,
    point,
    barrel,
    /* @function muzzle.export.11 — Handles export within muzzle. Inputs: no explicit arguments; uses enclosing module state. Uses: profiles values. Returns: a record containing schema, profiles. */ export() {
      return {
        schema: "phanicom-muzzles/1",
        profiles: [...profiles.values()],
      };
    },
  };
  if (root.FrontierMuzzleData) load(root.FrontierMuzzleData);
})(window);
