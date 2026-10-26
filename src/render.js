// October 22, 2026: canvas labels use the registered gameplay face, or readable authoring face; prior release literals are superseded.
/* October 14, 2026: transient editorFlight bypasses camera geometry clearance only in authoring; playtest retains normal camera collision and locked sprite presentation. */
/* MAINTAINER GUIDE
 * Perspective projection and depth-sorted billboard drawing. Crosshair is a fixed logical screen point. World placement and aim share camera/project functions; changing projection must update muzzle inversion and ray construction too.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function render.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier render. */
(/* @function render.installReviewed — Installs perspective projection, aiming/depth and camera-facing sprite drawing services. Logical crosshair/projection units remain independent of physical framebuffer density. Preserve locked 0.15.17 tilt/proportions/frame behavior; clipping is handled through depth/collision/anchoring. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  // Draw temporary vector silhouettes in local coordinates. Replace art without coupling visual shape to world collision.
  /* @function render.vector.2 — Draw temporary vector silhouettes in local coordinates. Replace art without coupling visual shape to world collision. Inputs: ctx; kind; px; py; w; h. Updates: x stroke style; x line width; y. Uses: ctx save; ctx translate; ctx scale; line. */ function vector(
    ctx,
    kind,
    px,
    py,
    w,
    h,
  ) {
    ctx.save();
    ctx.translate(px - w / 2, py - h);
    ctx.scale(w / 48, h / 80);
    const x = ctx;
    // Temporary vector silhouettes; final image assets replace this one factory.
    x.strokeStyle =
      kind === "monster"
        ? "#ff4059"
        : kind === "anomaly"
          ? "#cc73ff"
          : "#288cff";
    x.lineWidth = 1.5;
    const line =
      /* @function render.line.3 — Handles line within world projection and drawing. Inputs: points. Uses: x begin path; points for each; x stroke. */ (
        points,
      ) => {
        x.beginPath();
        points.forEach(
          /* @function render.callback.4 — Returns i selects x line to using spread element or x move to using spread element. Inputs: p; i. Uses: x line to; x move to. Returns: i selects x line to using spread element or x move to using spread element. */ (
            p,
            i,
          ) => (i ? x.lineTo(...p) : x.moveTo(...p)),
        );
        x.stroke();
      };
    if (kind === "chest" || kind === "openChest") {
      line([
        [5, 49],
        [43, 49],
        [43, 77],
        [5, 77],
        [5, 49],
      ]);
      line([
        [5, 49],
        [12, 38],
        [38, 38],
        [43, 49],
      ]);
      line([
        [21, 49],
        [21, 60],
        [27, 60],
        [27, 49],
      ]);
      if (kind === "openChest")
        line([
          [12, 38],
          [9, 16],
          [37, 16],
          [38, 38],
        ]);
      else
        line([
          [12, 38],
          [38, 38],
        ]);
    } else if (kind === "marker") {
      line([
        [24, 77],
        [3, 58],
        [24, 39],
        [45, 58],
        [24, 77],
      ]);
      line([
        [24, 52],
        [24, 65],
      ]);
    } else if (kind === "tree") {
      line([
        [24, 3],
        [9, 25],
        [16, 25],
        [3, 48],
        [17, 48],
        [17, 77],
        [30, 77],
        [30, 48],
        [45, 48],
        [32, 25],
        [39, 25],
        [24, 3],
      ]);
      line([
        [24, 14],
        [24, 48],
        [17, 48],
      ]);
    } else if (kind === "rock" || kind === "anomaly") {
      line([
        [3, 76],
        [8, 50],
        [24, 41],
        [39, 49],
        [46, 76],
        [3, 76],
      ]);
      line([
        [8, 50],
        [25, 58],
        [39, 49],
      ]);
      line([
        [25, 58],
        [30, 76],
      ]);
    } else if (kind === "ruin") {
      line([
        [5, 77],
        [5, 18],
        [14, 9],
        [34, 9],
        [43, 18],
        [43, 77],
        [33, 77],
        [33, 28],
        [28, 22],
        [20, 22],
        [15, 28],
        [15, 77],
        [5, 77],
      ]);
      line([
        [5, 18],
        [15, 28],
      ]);
      line([
        [43, 18],
        [33, 28],
      ]);
      for (let y = 40; y < 76; y += 13) {
        line([
          [5, y],
          [15, y],
        ]);
        line([
          [33, y],
          [43, y],
        ]);
      }
    } else {
      line([
        [18, 7],
        [30, 7],
        [33, 13],
        [30, 23],
        [18, 23],
        [15, 13],
        [18, 7],
      ]);
      line([
        [18, 26],
        [8, 33],
        [6, 52],
        [12, 55],
        [16, 38],
        [17, 53],
        [13, 77],
        [22, 77],
        [24, 57],
        [27, 77],
        [36, 77],
        [31, 53],
        [32, 38],
        [38, 53],
        [44, 50],
        [40, 32],
        [30, 26],
        [18, 26],
      ]);
      line([
        [17, 53],
        [31, 53],
      ]);
      line([
        [20, 16],
        [28, 16],
      ]);
      line([
        [40, 42],
        [45, 22],
      ]);
    }
    ctx.restore();
  }
  // Resolve a sprite sheet/frame and scale from reference pixel height; anchor the frame at the projected feet.
  /* @function render.candy.5 — Resolve a sprite sheet/frame and scale from reference pixel height; anchor the frame at the projected feet. Inputs: ctx; e; p; cam. Updates: ctx asset glow. Uses: frontier sprites sheet; frontier directions select; root frontier water level; root frontier water obscures. Returns: false; true. */ function candy(
    ctx,
    e,
    p,
    cam,
  ) {
    const sheet = root.FrontierSprites
      ? FrontierSprites.sheet(e)
      : root.FrontierCandy;
    if (!sheet?.image.complete || !sheet.image.naturalWidth) return false;
    const { row, column: col } = FrontierDirections.select(
        e,
        cam.yaw,
        sheet.direction,
        cam,
      ),
      f = sheet.frames[row * (sheet.columns || 3) + col],
      scale = ((e.height || 1.65) * p.scale) / (sheet.referenceHeight || 310);
    const level = root.FrontierWater?.level(ctx.world, e.x, e.y),
      waterline = root.FrontierWater?.obscures(
        ctx.world,
        cam,
        e.x,
        e.y,
        e.z || 0,
      )
        ? project(cam, e.x, e.y, level)
        : null;
    // October 9, 2026 — 0.15.19: the 0.15.17 camera-facing rectangle is locked.
    // The experimental cylindrical billboard from 0.15.18 is superseded; its
    // implementation remains in that preserved release. Never change tilt without
    // explicit user approval. Visual depth is the constant camera-facing plane.
    const fullHeight = f.h * scale,
      top = p.y - fullHeight + (sheet.groundInset || 0) * scale,
      visible = waterline
        ? Math.max(0, Math.min(fullHeight, waterline.y - top))
        : fullHeight;
    if (visible > 0) {
      const lit =
        root.FrontierNormalRenderCache?.image(
          sheet.image,
          sheet.id || e.spriteProfile,
          ctx.world?.spriteNormals,
        ) || sheet.image;
      const image =
        root.FrontierAssetStyle?.image(
          lit,
          ctx.vectorDisplay,
          e.vectorTreatment === "map" || !e.vectorTreatment
            ? ctx.vectorDisplay?.sprites
            : e.vectorTreatment,
        ) || lit;
      const mapPools = ctx.assetPools,
        role =
          e.id === "player" ? "player" : e.partyActorId ? "follower" : "event";
      ctx.assetPools = root.FrontierNativeEffects?.optIn(
        ctx.world.nativeEffects,
        role,
        e.note ||
          ctx.world.events?.find(
            /* @function render.eventColorNote — Inputs: authored event. Returns matching runtime ID; no mutation. */ function (
              event,
            ) {
              return event.id === e.id;
            },
          )?.note ||
          "",
      )
        ? mapPools
        : null;
      ctx.assetGlow =
        (e.vectorTreatment === "map" || !e.vectorTreatment
          ? ctx.vectorDisplay?.sprites
          : e.vectorTreatment) !== "original";
      // A camera-facing plane has constant forward depth, unlike the discarded
      // upright-plane mask. Mixing those planes incorrectly hid feet and heads.
      // October 12: contact visibility may use physical actor row depths; the locked image rectangle above remains unchanged.
      const spriteDepth =
        root.FrontierSpriteContact?.depth(ctx.game, e, cam, p.depth) ?? p.depth;
      const imageRect = {
          x: p.x - f.anchorX * scale,
          y: top,
          width: f.w * scale,
          height: Math.min(
            visible,
            fullHeight - (sheet.groundInset || 0) * scale,
          ),
        },
        clip =
          root.FrontierTerrainOcclusion?.mask(
            ctx.terrainDepth,
            imageRect,
            spriteDepth,
            cam.orthographic ? null : { cam, z: e.z || 0 },
          ) || imageRect;
      if (ctx.setImageClip) ctx.setImageClip(clip);
      else if (waterline || ctx.terrainDepth) {
        ctx.save();
        ctx.beginPath();
        for (const r of clip.regions || [clip])
          ctx.rect(r.x, r.y, r.width, r.height);
        ctx.clip();
      }
      ctx.assetLightTint =
        root.FrontierLocalLighting?.sample(
          ctx.localLightFrame,
          e.x,
          e.y,
          (e.z || 0) + (e.height || 1.65) * 0.5,
        ) || null;
      ctx.drawImage(
        image,
        f.x,
        f.y,
        f.w,
        f.h,
        p.x - f.anchorX * scale,
        top,
        f.w * scale,
        fullHeight,
      );
      ctx.assetLightTint = null;
      ctx.assetGlow = false;
      ctx.assetPools = mapPools;
      if (ctx.setImageClip) ctx.setImageClip(null);
      else if (waterline || ctx.terrainDepth) ctx.restore();
    }
    return true;
  }
  // Build the camera position and pitch-aware framing from player elevation, zoom and view width.
  /* @function render.camera.7 — Build the camera position and pitch-aware framing from player elevation, zoom and view width. Inputs: game. Updates: floor; result z. Uses: root frontier interior camera; rules get; frontier terrain height; root frontier model collision camera. Returns: fixed; a record containing x, y, z, cx, yaw, pitch. */ function camera(
    game,
  ) {
    // October 14: retain calibrated PNG projection in authoring; bypassing
    // this camera hid the artwork and misaligned the selection overlays.
    const iso = root.FrontierIsometric?.camera(game);
    if (iso) return iso;
    const fixed = root.FrontierInterior?.camera(game);
    if (fixed) return fixed;
    const p = game.player,
      c = game.camera,
      cx = (game.viewWidth || 640) / 2;
    if (c.firstPerson) {
      const first = {
        x: p.x,
        y: p.y,
        z: (p.z || 0) + 1.55,
        cx,
        yaw: c.yaw,
        pitch: c.pitch,
      };
      return game.editorFlight ? first : root.FrontierModelCollision?.camera(game, first) || first;
    }
    // Define framing in camera coordinates, avoiding pitch-dependent divisions.
    // Depth stays fixed at every look angle: no runaway zoom or singularity.
    const rules = root.FrontierParameters,
      d = Math.max(
        rules?.get(game.sourceWorld, "zoomMin") ?? 2.3,
        Math.min(rules?.get(game.sourceWorld, "zoomMax") ?? 7, c.distance),
      ),
      pitch = Math.max(
        ((rules?.get(game.sourceWorld, "aimMin") ?? (-0.7 * 180) / Math.PI) *
          Math.PI) /
          180,
        Math.min(
          ((rules?.get(game.sourceWorld, "aimMax") ?? (0.6 * 180) / Math.PI) *
            Math.PI) /
            180,
          c.pitch,
        ),
      );
    const spriteHeight = (1.65 * 360) / d,
      feet = Math.min(420, 114 + spriteHeight);
    const up = (-(feet - 96) * d) / 360,
      neutral = -0.12;
    const orbit = neutral + (pitch - neutral) * 0.75;
    const back = d * Math.cos(orbit) - up * Math.sin(orbit),
      lift = -d * Math.sin(orbit) - up * Math.cos(orbit);
    const playerDepth = back * Math.cos(pitch) - lift * Math.sin(pitch);
    const playerUp = -lift * Math.cos(pitch) - back * Math.sin(pitch);
    const framedFeet = Math.min(420, 114 + (1.65 * 360) / playerDepth);
    const cy = framedFeet + (playerUp * 360) / playerDepth;
    const result = {
      x: p.x - Math.sin(c.yaw) * back,
      y: p.y - Math.cos(c.yaw) * back,
      z: (p.z || 0) + lift,
      cx,
      cy,
      yaw: c.yaw,
      pitch,
    };
    // Solid terrain constrains textured-map cameras; water remains traversable.
    if (game.sourceWorld?.groundMaterial) {
      let floor = FrontierTerrain.height(game.sourceWorld, result.x, result.y);
      for (const [dx, dy] of [
        [0.12, 0],
        [-0.12, 0],
        [0, 0.12],
        [0, -0.12],
      ])
        floor = Math.max(
          floor,
          FrontierTerrain.height(
            game.sourceWorld,
            result.x + dx,
            result.y + dy,
          ),
        );
      result.z = Math.max(result.z, floor + 0.18);
    }
    return game.editorFlight ? result : root.FrontierModelCollision?.camera(game, result) || result;
  }
  // Compute forward distance in the tilted camera basis; used for clipping and sorting.
  /* @function render.depth.8 — Compute forward distance in the tilted camera basis; used for clipping and sorting. Inputs: cam; x; y; assignment pattern. Returns: x minus cam x multiplied by math sin using cam yaw plus y minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus z minus cam z multiplied by math sin using cam pitch. */ function depth(
    cam,
    x,
    y,
    z = 0,
  ) {
    return (
      ((x - cam.x) * Math.sin(cam.yaw) + (y - cam.y) * Math.cos(cam.yaw)) *
        Math.cos(cam.pitch) +
      (z - cam.z) * Math.sin(cam.pitch)
    );
  }
  // Project world XYZ into logical screen coordinates and scale; reject geometry behind the near plane.
  /* @function render.project.9 — Project world XYZ into logical screen coordinates and scale; reject geometry behind the near plane. Inputs: cam; x; y; assignment pattern. Uses: root frontier interior project; depth. Returns: root frontier interior project using cam, x, y; null. */ function project(
    cam,
    x,
    y,
    z = 0,
  ) {
    if (cam.orthographic) return root.FrontierInterior.project(cam, x, y, z);
    const dx = x - cam.x,
      dy = y - cam.y,
      forward = dx * Math.sin(cam.yaw) + dy * Math.cos(cam.yaw),
      d = depth(cam, x, y, z),
      side = dx * Math.cos(cam.yaw) - dy * Math.sin(cam.yaw),
      up = (z - cam.z) * Math.cos(cam.pitch) - forward * Math.sin(cam.pitch);
    if (d < 0.12) return null;
    return {
      x: (cam.cx || 320) + (side * 360) / d,
      y: (cam.cy ?? 96) - (up * 360) / d,
      scale: 360 / d,
      depth: d,
    };
  }
  const grids = new WeakMap(),
    editBounds = new WeakMap();
  // Painter-order scene: sky → terrain grid → sorted sprites/props → editor overlays → travel/effects → death overlay.
  /* @function render.draw.10 — Painter-order scene: sky → terrain grid → sorted sprites/props → editor overlays → travel/effects → death overlay. Inputs: canvas; game. Updates: game view width; cam underwater; ctx terrain depth; ctx world; ctx underwater. Uses: root frontier pixi context; canvas get context; camera; root frontier water submerged. Returns: without a result. */ function draw(
    canvas,
    game,
  ) {
    game.viewWidth = root.FrontierDisplay?.get().width || canvas.width;
    const ctx = root.FrontierPixi
      ? root.FrontierPixi.context(canvas)
      : canvas.getContext("2d");
    if (!ctx) return;
    const cam = camera(game);
    cam.underwater = root.FrontierWater?.submerged(
      game.sourceWorld,
      cam,
      game.player,
    );
    ctx.terrainDepth = null;
    ctx.breathing = game.breathingSnapshot;
    ctx.assetPools = game.sourceWorld.nativeEffects?.color;
    ctx.effectTime = game.elapsed || 0;
    game.lightFrame =
      root.FrontierLocalLighting?.frame(game, game.elapsed || 0) || null;
    ctx.localLightFrame = game.lightFrame;
    ctx.game = game;
    ctx.world = game.sourceWorld;
    ctx.underwater = cam.underwater
      ? { ...game.sourceWorld.water, time: game.time ?? game.elapsed ?? 0 }
      : null;
    ctx.vectorDisplay =
      game.sourceWorld.vectorDisplay || root.FrontierVector?.defaults;
    ctx.fog = root.FrontierFog?.settings(game);
    ctx.fogDepth = 0;
    ctx.imageSmoothingEnabled = false;
    const sin = Math.sin(cam.yaw),
      cos = Math.cos(cam.yaw);
    // Vector study: clear the textured placeholder and draw a world-space grid.
    ctx.fillStyle = ctx.fog?.enabled ? ctx.fog.color : "#000";
    ctx.fillRect(0, 0, game.viewWidth, 480);
    if (cam.orthographic && !cam.outdoorIsometric) FrontierInterior.background(ctx, game, cam);
    else if ((!game.sourceWorld.interior || game.sourceWorld.interior.outdoor) || game.sourceWorld.sky?.panorama)
      FrontierSky.draw(ctx, game, cam, project);
    /* October 10, 2026: interior geometry owns its floor depth. Outdoor terrain would hide coplanar room floors and must stay outside cells. */
    if ((!game.sourceWorld.interior || game.sourceWorld.interior.outdoor))
      root.FrontierOutdoorAssets?.draw(ctx, game, cam, project);
    ctx.strokeStyle = "#11396a";
    ctx.lineWidth = 1;
    const bounds = FrontierWorld.dimensions(game.sourceWorld),
      step = game.sourceWorld.gridSpacing || 2;
    // Render a bounded neighborhood, not every grid line of a 512-unit map.
    const x0 = Math.max(0, Math.floor((cam.x - 48) / step) * step),
      x1 = Math.min(bounds.width, Math.ceil((cam.x + 48) / step) * step),
      y0 = Math.max(0, Math.floor((cam.y - 48) / step) * step),
      y1 = Math.min(bounds.height, Math.ceil((cam.y + 48) / step) * step);
    let heights = grids.get(game.sourceWorld);
    if (!heights) {
      heights = new Map();
      grids.set(game.sourceWorld, heights);
    }
    if (
      heights.size > 16000 ||
      heights.revision !== (game.sourceWorld.terrain?.revision || 0)
    ) {
      heights.clear();
      heights.revision = game.sourceWorld.terrain?.revision || 0;
    }
    /* @function render.groundHeight.11 — Handles ground height within world projection and drawing. Inputs: x; y. Uses: heights has; heights set; frontier terrain height; heights get. Returns: heights get using key. */ function groundHeight(
      x,
      y,
    ) {
      const key = x + ":" + y;
      if (!heights.has(key))
        heights.set(key, FrontierTerrain.height(game.sourceWorld, x, y));
      return heights.get(key);
    }
    let edited = editBounds.get(game.sourceWorld);
    if (
      !edited ||
      edited.terrain !== game.sourceWorld.terrain ||
      edited.revision !== (game.sourceWorld.terrain?.revision || 0)
    ) {
      edited = {
        terrain: game.sourceWorld.terrain,
        revision: game.sourceWorld.terrain?.revision || 0,
        x0: Infinity,
        y0: Infinity,
        x1: -Infinity,
        y1: -Infinity,
      };
      for (const key of Object.keys(game.sourceWorld.terrain?.edits || {})) {
        const [x, y] = key.split(",").map(Number);
        edited.x0 = Math.min(edited.x0, x - 1);
        edited.y0 = Math.min(edited.y0, y - 1);
        edited.x1 = Math.max(edited.x1, x + 1);
        edited.y1 = Math.max(edited.y1, y + 1);
      }
      editBounds.set(game.sourceWorld, edited);
    }
    // Clip a terrain grid edge at the near plane before projecting to avoid inverted giant lines.
    /* @function render.straightSegment.12 — Clip a terrain grid edge at the near plane before projecting to avoid inverted giant lines. Inputs: ax; ay; bx; by. Updates: a; b; ctx fog depth. Uses: ground height; project; depth; ctx begin path. Returns: without a result. */ function straightSegment(
      ax,
      ay,
      bx,
      by,
    ) {
      const az = groundHeight(ax, ay),
        bz = groundHeight(bx, by);
      let a = project(cam, ax, ay, az),
        b = project(cam, bx, by, bz);
      if (!a && !b) return;
      if (!a || !b) {
        const da = depth(cam, ax, ay, az),
          db = depth(cam, bx, by, bz),
          t = (0.13 - da) / (db - da),
          q = project(
            cam,
            ax + (bx - ax) * t,
            ay + (by - ay) * t,
            az + (bz - az) * t,
          );
        if (!a) a = q;
        else b = q;
      }
      if (a && b) {
        ctx.fogDepth = (a.depth + b.depth) / 2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    // Sparse terrain interpolation changes at one-unit vertices. Preserve those
    // bends even when the visible grid spacing is two or more units.
    /* @function render.segment.13 — bends even when the visible grid spacing is two or more units. Inputs: ax; ay; bx; by. Uses: straight segment. Returns: without a result. */ function segment(
      ax,
      ay,
      bx,
      by,
    ) {
      const affected =
        Math.max(ax, bx) >= edited.x0 &&
        Math.min(ax, bx) <= edited.x1 &&
        Math.max(ay, by) >= edited.y0 &&
        Math.min(ay, by) <= edited.y1;
      if (!affected) {
        straightSegment(ax, ay, bx, by);
        return;
      }
      const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay)));
      for (let i = 0; i < n; i++)
        straightSegment(
          ax + ((bx - ax) * i) / n,
          ay + ((by - ay) * i) / n,
          ax + ((bx - ax) * (i + 1)) / n,
          ay + ((by - ay) * (i + 1)) / n,
        );
    }
    if (
      (!game.sourceWorld.interior || game.sourceWorld.interior.outdoor) &&
      (!game.sourceWorld.groundMaterial || game.authoring)
    )
      for (let x = x0; x <= x1; x += step)
        for (let y = y0; y < y1; y += step)
          segment(x, y, x, Math.min(y + step, y1));
    if (
      (!game.sourceWorld.interior || game.sourceWorld.interior.outdoor) &&
      (!game.sourceWorld.groundMaterial || game.authoring)
    )
      for (let y = y0; y <= y1; y += step)
        for (let x = x0; x < x1; x += step)
          segment(x, y, Math.min(x + step, x1), y);
    // Authoring ghost is a draw-only copy: dragging cannot change saved data
    // until the undoable pointer-up transaction commits.
    let entities = root.FrontierActivity
      ? root.FrontierActivity.query(
          game,
          cam.x - 52,
          cam.y - 52,
          cam.x + 52,
          cam.y + 52,
        )
      : [...game.maps.frontier.entities, ...(game.sceneEvents || [])];
    // 2026-10-09: retain bounds-visible landmarks beyond the origin query without waking actors.
    if (root.FrontierModelVisibility)
      entities = root.FrontierModelVisibility.candidates(game, cam, entities);
    entities = entities.concat(game.hubDrops || []);
    // October 14: item placement preview is draw-only, never a pickup or light.
    if (game.itemDropPreview) entities.push(game.itemDropPreview);
    if (game.authoring && game.dragGhost)
      entities = entities.map(
        /* @function render.callback.14 — Returns game drag ghost id equals e id selects a record containing copied fields, x, y, z or e. Inputs: e. Uses: frontier terrain height. Returns: game drag ghost id equals e id selects a record containing copied fields, x, y, z or e. */ (
          e,
        ) =>
          game.dragGhost.id === e.id
            ? {
                ...e,
                x: game.dragGhost.x,
                y: game.dragGhost.y,
                z:
                  FrontierTerrain.height(
                    game.sourceWorld,
                    game.dragGhost.x,
                    game.dragGhost.y,
                  ) +
                  (e.spatial?.heightOffset ??
                    e.heightOffset ??
                    (e.elevation || 0) * 0.3),
              }
            : e,
      );
    if (game.sourceWorld.interior) {
      const r = game.sourceWorld.interior;
      for (const e of r.sprites)
        entities.push({ ...e, kind: "furniture", z: 0 });
      if (r.mode === "geometry")
        for (const e of root.FrontierAuthorView?.faces(
          game,
          cam,
          FrontierInterior.data(game.sourceWorld).faces,
        ) || FrontierInterior.data(game.sourceWorld).faces)
          entities.push({
            ...e,
            kind: "roomFace",
            priority: e.points.every(
              /* @function render.callback.15 — Returns p at 2 equals e points at 0 at 2. Inputs: p. Returns: p at 2 equals e points at 0 at 2. */ (
                p,
              ) => p[2] === e.points[0][2],
            )
              ? "below"
              : "normal",
          });
    }
    if (!game.camera.firstPerson || cam.orthographic)
      entities.push({
        ...game.player,
        kind: "player",
        height: 1.65,
      });
    // Sort far to near for billboard occlusion. Player opacity stays 1; this is not a depth-buffer renderer.
    root.FrontierWater?.draw(ctx, game, cam, project);
    // October 26: outdoor sprite silhouettes sit on the ground pass before models/actors, independent of billboard tilt. Interiors never receive sunlight shadows.
    // Superseded within this iteration: ground-plane prototype retained as a documented helper, not the active render path.
    root.FrontierModelRenderer?.geometry(
      ctx,
      game,
      cam,
      entities.filter(
        /* @function render.callback.16 — Returns e kind equals "roomFace". Inputs: e. Returns: e kind equals "roomFace". */ (
          e,
        ) => e.kind === "roomFace",
      ),
    );
    root.FrontierModelRenderer?.draw(ctx, game, cam, entities);
    root.FrontierSunShadows?.draw163(ctx,game,cam,entities,project);
    // Only horizontal room geometry belongs to the structural background pass.
    // Legacy MZ event priority never overrides world-space camera depth.
    const layer =
      /* @function render.layer.17 — Returns e kind equals "roomFace" and e points every using a callback selects - 1 or 0. Inputs: e. Uses: e points every. Returns: e kind equals "roomFace" and e points every using a callback selects - 1 or 0. */ (
        e,
      ) =>
        e.kind === "roomFace" &&
        e.points.every(
          /* @function render.callback.18 — Returns p at 2 equals e points at 0 at 2. Inputs: p. Returns: p at 2 equals e points at 0 at 2. */ (
            p,
          ) => p[2] === e.points[0][2],
        )
          ? -1
          : 0;
    const queue = entities
      .map(
        /* @function render.callback.19 — Returns a record containing e, p. Inputs: e. Uses: project. Returns: a record containing e, p. */ (
          e,
        ) => ({
          e,
          p: project(cam, e.x, e.y, e.z || 0),
        }),
      )
      .filter(
        /* @function render.callback.20 — Returns q p and q p depth is less than 45 and the inverse of q e transparent and the inverse of q e model id and q e kind does not equal "roomFace" and q e kind does not equal "none" or game authoring. Inputs: q. Returns: q p and q p depth is less than 45 and the inverse of q e transparent and the inverse of q e model id and q e kind does not equal "roomFace" and q e kind does not equal "none" or game authoring. */ (
          q,
        ) =>
          q.p &&
          q.p.depth < 45 &&
          !q.e.transparent &&
          !q.e.modelId &&
          q.e.kind !== "roomFace" &&
          (q.e.kind !== "none" || game.authoring),
      )
      .sort(
        /* @function render.callback.21 — Returns layer using a e minus layer using b e or b p depth minus a p depth. Inputs: a; b. Uses: layer. Returns: layer using a e minus layer using b e or b p depth minus a p depth. */ (
          a,
          b,
        ) => layer(a.e) - layer(b.e) || b.p.depth - a.p.depth,
      );
    for (const { e, p } of queue) {
      if (p.x < -250 || p.x > (game.viewWidth || 640) + 250) continue;
      ctx.fogDepth = cam.outdoorIsometric ? Math.max(0,p.depth-depth(cam,game.player.x,game.player.y,game.player.z||0)) : p.depth;
      const h = Math.min(1800, (e.height || 1.65) * p.scale),
        w = h * 0.6;
      ctx.globalAlpha =
        ((e.kind === "player" ? 1 : Math.max(0.18, 1 - (cam.outdoorIsometric ? Math.hypot(e.x-game.player.x,e.y-game.player.y) : p.depth) / 55)) *
          (e.opacity ?? 255)) /
        255;
      ctx.save();
      const waterLevel = root.FrontierWater?.level(game.sourceWorld, e.x, e.y);
      if (
        root.FrontierWater?.obscures(
          game.sourceWorld,
          cam,
          e.x,
          e.y,
          e.z || 0,
        ) &&
        !(e.kind === "player" || e.spriteProfile)
      ) {
        const waterline = project(cam, e.x, e.y, waterLevel);
        if (waterline) {
          if (ctx.setImageClip) {
            ctx.flushStroke();
            ctx.graphic = null;
            ctx.clipBottom = waterline.y;
          } else {
            ctx.beginPath();
            ctx.rect(0, 0, canvas.width, Math.max(0, waterline.y));
            ctx.clip();
          }
        }
      }
      if (e.kind === "roomFace") {
        let vertices = e.points;
        if (!cam.orthographic)
          vertices = FrontierInterior.nearClip(cam, vertices);
        const points = vertices.map(
          /* @function render.callback.22 — Returns array is array using v selects project using cam, spread element or project using cam, v x, v y. Inputs: v. Uses: array is array; project. Returns: array is array using v selects project using cam, spread element or project using cam, v x, v y. */ (
            v,
          ) =>
            Array.isArray(v) ? project(cam, ...v) : project(cam, v.x, v.y, v.z),
        );
        if (points.length >= 3 && points.every(Boolean)) {
          ctx.beginPath();
          points.forEach(
            /* @function render.callback.23 — Returns ctx at i selects "lineTo" or "moveTo" using p x, p y. Inputs: p; i. Uses: ctx at i selects "lineTo" or "moveTo". Returns: ctx at i selects "lineTo" or "moveTo" using p x, p y. */ (
              p,
              i,
            ) => ctx[i ? "lineTo" : "moveTo"](p.x, p.y),
          );
          ctx.closePath();
          ctx.fillStyle = e.color;
          ctx.fill();
          ctx.strokeStyle = e.color;
          ctx.stroke();
        }
        ctx.restore();
        ctx.globalAlpha = 1;
        continue;
      }
      // Flat vector props use the same camera-depth mask as billboard images.
      if (ctx.terrainDepth && !e.spriteProfile && e.kind !== "player") {
        /* October 12, 2026: vector silhouettes occupy bounded local coordinates (48x80), including rotated corpses and health bars. Mask only a conservative screen square around that content; scanning the complete viewport per small prop was unrelated work. Furniture keeps the full viewport because its projected world corners use independent extents. */ const radius =
            h + w + 24,
          rect =
            e.kind === "furniture"
              ? { x: 0, y: 0, width: game.viewWidth || 640, height: 480 }
              : {
                  x: p.x - radius,
                  y: p.y - radius,
                  width: radius * 2,
                  height: radius * 2,
                },
          mask = FrontierTerrainOcclusion.mask(ctx.terrainDepth, rect, p.depth);
        if (ctx.setGraphicClip) ctx.setGraphicClip(mask);
        else {
          ctx.beginPath();
          for (const r of mask.regions || [mask])
            ctx.rect(r.x, r.y, r.width, r.height);
          ctx.clip();
        }
      }
      if (e.kind === "furniture") {
        FrontierInterior.furniture(ctx, e, p);
        ctx.restore();
        ctx.globalAlpha = 1;
        continue;
      }
      if (e.gibbed) {
        ctx.restore();
        ctx.globalAlpha = 1;
        continue;
      }
      if ((e.kind === "player" || e.spriteProfile) && candy(ctx, e, p, cam)) {
        ctx.restore();
        ctx.globalAlpha = 1;
        continue;
      }
      if (e.dead) {
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.PI / 2);
        vector(ctx, e.kind, 0, 0, w * 0.6, h * 0.7);
      } else {
        const walk =
          e.kind === "player" && game.moving
            ? Math.sin(game.elapsed * 15) * 2
            : 0;
        vector(
          ctx,
          e.cerebralSource ? "anomaly" : e.kind,
          p.x,
          p.y + walk,
          w,
          h,
        );
        if (e.kind === "monster" && p.depth < 12) {
          ctx.strokeStyle = "#ff4059";
          ctx.strokeRect(p.x - 15, p.y - h - 7, 30, 3);
          ctx.fillStyle = "#ff4059";
          ctx.fillRect(p.x - 15, p.y - h - 7, (30 * e.hp) / e.maxHp, 3);
        }
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }
    if (!game.authoring) {
      for (const e of game.sceneEvents || []) {
        const p = project(cam, e.x, e.y, e.z || 0);
        if (e.isAmmo && p && p.depth < 14) {
          ctx.fogDepth = cam.outdoorIsometric ? Math.max(0,p.depth-depth(cam,game.player.x,game.player.y,game.player.z||0)) : p.depth;
          ctx.fillStyle = "#8fbdff";
          ctx.font = "11px " + (root.FrontierFonts?.family() || "monospace");
          ctx.fillText(
            e.kind === "openChest" ? "EMPTY AMMO" : "AMMO · 24",
            p.x - 25,
            p.y - e.height * p.scale - 5,
          );
        }
      }
    }
    ctx.fogDepth = 0;
    if (game.sourceWorld.travel || game.sourceWorld.interior) {
      for (const e of game.sourceWorld.interior?.exits ||
        game.sourceWorld.travel.exits) {
        const p = project(
          cam,
          e.x,
          e.y,
          FrontierTerrain.height(game.sourceWorld, e.x, e.y),
        );
        if (p) {
          ctx.fogDepth = cam.outdoorIsometric ? Math.max(0,p.depth-depth(cam,game.player.x,game.player.y,game.player.z||0)) : p.depth;
          if (cam.orthographic) {
            const outside = !FrontierInterior.inside(
                game.sourceWorld.interior.floor,
                e.x,
                e.y,
              ),
              points = Array.from(
                { length: 24 },
                /* @function render.callback.24 — Returns a record containing x, y. Inputs: ; i. Returns: a record containing x, y. */ (
                  _,
                  i,
                ) => ({
                  x: e.x + Math.cos((i * Math.PI) / 12) * e.radius,
                  y: e.y + Math.sin((i * Math.PI) / 12) * e.radius,
                }),
              )
                .filter(
                  /* @function render.callback.25 — Returns the inverse of outside or the inverse of frontier interior inside using game source world interior floor, q x, q y. Inputs: q. Uses: frontier interior inside. Returns: the inverse of outside or the inverse of frontier interior inside using game source world interior floor, q x, q y. */ (
                    q,
                  ) =>
                    !outside ||
                    !FrontierInterior.inside(
                      game.sourceWorld.interior.floor,
                      q.x,
                      q.y,
                    ),
                )
                .map(
                  /* @function render.callback.26 — Returns project using cam, q x, q y. Inputs: q. Uses: project. Returns: project using cam, q x, q y. */ (
                    q,
                  ) => project(cam, q.x, q.y, 0),
                );
            ctx.beginPath();
            points.forEach(
              /* @function render.callback.27 — Returns ctx at i selects "lineTo" or "moveTo" using q x, q y. Inputs: q; i. Uses: ctx at i selects "lineTo" or "moveTo". Returns: ctx at i selects "lineTo" or "moveTo" using q x, q y. */ (
                q,
                i,
              ) => ctx[i ? "lineTo" : "moveTo"](q.x, q.y),
            );
            ctx.closePath();
            ctx.fillStyle = "#274c39";
            ctx.globalAlpha = 0.65;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.strokeStyle = "#d6e897";
            ctx.stroke();
            ctx.fillStyle = "#e3efb3";
            ctx.font = "9px " + (root.FrontierFonts?.family() || "monospace");
            ctx.fillText(e.name, p.x - 35, p.y + 4);
          } else {
            ctx.strokeStyle = "#ffd273";
            ctx.strokeRect(p.x - 12, p.y - 40, 24, 40);
            ctx.fillStyle = "#ffd273";
            ctx.font = "9px " + (root.FrontierFonts?.family() || "monospace");
            ctx.fillText(e.name, p.x - 45, p.y - 44);
          }
        }
      }
    }
    if (game.authoring) {
      root.FrontierInterior?.outline(ctx, game.sourceWorld, cam, project);
      for (const e of game.sceneEvents || []) {
        const p = project(cam, e.x, e.y);
        if (!p || p.depth > 35) continue;
        ctx.fillStyle = "#9fceff";
        // October 14: labels use screen pixels and an opaque backing rather
        // than tiny text lost against wireframes. Geometry remains unchanged.
        ctx.font = "bold 16px " + (root.FrontierFonts?.family() || "monospace");
        const label = String(e.name || e.id),
          // The shared render recorder does not expose measureText. A fixed
          // monospace advance keeps native and recorded rendering consistent.
          labelWidth = label.length * 10,
          labelX = p.x - labelWidth / 2,
          labelY = p.y - e.height * p.scale - 12;
        ctx.fillStyle = "#080d16";
        ctx.fillRect(labelX - 5, labelY - 18, labelWidth + 10, 24);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(label, labelX, labelY);
      }
      const selected = entities.find(
        /* @function render.callback.28 — Returns e id equals game selected id. Inputs: e. Returns: e id equals game selected id. */ (
          e,
        ) => e.id === game.selectedId,
      );
      if (selected) {
        const p = project(cam, selected.x, selected.y, selected.z || 0);
        if (p) {
          const h = selected.height * p.scale;
          ctx.strokeStyle = "#ff4059";
          ctx.lineWidth = 1;
          ctx.strokeRect(p.x - h * 0.3 - 3, p.y - h - 3, h * 0.6 + 6, h + 6);
          ctx.font = "10px " + (root.FrontierFonts?.family() || "monospace");
          ctx.fillStyle = "#ff7085";
          ctx.fillText(
            selected.x.toFixed(2) + ", " + selected.y.toFixed(2),
            p.x + 8,
            p.y - 3,
          );
        }
        const radius = selected.range || selected.radius || 0.3;
        ctx.strokeStyle = "#662d52";
        ctx.beginPath();
        let began = false;
        for (let i = 0; i <= 48; i++) {
          const a = (i * Math.PI * 2) / 48,
            q = project(
              cam,
              selected.x + Math.cos(a) * radius,
              selected.y + Math.sin(a) * radius,
              FrontierTerrain.height(
                game.sourceWorld,
                selected.x + Math.cos(a) * radius,
                selected.y + Math.sin(a) * radius,
              ) + 0.02,
            );
          if (q) {
            if (!began) {
              ctx.moveTo(q.x, q.y);
              began = true;
            } else ctx.lineTo(q.x, q.y);
          } else began = false;
        }
        ctx.stroke();
      }
      if (game.dragGhost) {
        const p = project(
          cam,
          game.dragGhost.x,
          game.dragGhost.y,
          FrontierTerrain.height(
            game.sourceWorld,
            game.dragGhost.x,
            game.dragGhost.y,
          ),
        );
        if (p) {
          ctx.strokeStyle = "#ff4059";
          ctx.beginPath();
          ctx.moveTo(p.x - 8, p.y);
          ctx.lineTo(p.x + 8, p.y);
          ctx.moveTo(p.x, p.y - 8);
          ctx.lineTo(p.x, p.y + 8);
          ctx.stroke();
        }
      }
    }
    root.FrontierModelDebug?.draw(ctx, game, cam, entities);
    for (const s of game.shotEffects) {
      const a = project(cam, s.from.x, s.from.y, s.from.z ?? 0.95),
        b = project(cam, s.to.x, s.to.y, s.to.z ?? 0.95);
      if (a && b) {
        ctx.fogDepth = (a.depth + b.depth) / 2;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    for (const s of game.particles) {
      const p = project(
        cam,
        s.x,
        s.y,
        s.z / 40 + FrontierTerrain.height(game.sourceWorld, s.x, s.y),
      );
      if (p) {
        ctx.fogDepth = cam.outdoorIsometric ? Math.max(0,p.depth-depth(cam,game.player.x,game.player.y,game.player.z||0)) : p.depth;
        ctx.fillStyle = s.color;
        const size = Math.max(1, Math.min(7, (s.size * p.scale) / 80));
        ctx.fillRect(p.x, p.y, size, size);
      }
    }
    for (const flash of game.muzzleFlashes) {
      const p = project(cam, flash.x, flash.y, flash.z);
      if (p) {
        ctx.fogDepth = cam.outdoorIsometric ? Math.max(0,p.depth-depth(cam,game.player.x,game.player.y,game.player.z||0)) : p.depth;
        ctx.fillStyle = flash.color || "#ffe5a1";
        const s = Math.max(2, p.scale * 0.045);
        ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      }
    }
    if (game.authoring && game.brushGhost) {
      const b = game.brushGhost;
      ctx.save();
      ctx.vectorDisplay = null;
      ctx.strokeStyle = "#e8eab0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      let begun = false;
      for (let i = 0; i <= 32; i++) {
        const a = (i / 32) * Math.PI * 2,
          x = b.x + Math.cos(a) * b.radius,
          y = b.y + Math.sin(a) * b.radius,
          q = project(
            cam,
            x,
            y,
            FrontierTerrain.height(game.sourceWorld, x, y) + 0.03,
          );
        if (q) {
          ctx[begun ? "lineTo" : "moveTo"](q.x, q.y);
          begun = true;
        }
      }
      ctx.stroke();
      ctx.restore();
      ctx.vectorDisplay =
        game.sourceWorld.vectorDisplay || root.FrontierVector.defaults;
    }
    root.PhanicomBlood?.draw(
      ctx,
      game,
      cam,
      /* @function render.callback.29 — Provides the callback for root phanicom blood draw. Inputs: rest element. Updates: ctx fog depth. Uses: project. Returns: p. */ (
        ...args
      ) => {
        const p = project(...args);
        ctx.fogDepth = p?.depth || 0;
        return p;
      },
    );
    ctx.fogDepth = 0;
    if (game.player.hp <= 0 && game.elapsed >= (game.deathUntil || 0)) {
      ctx.fillStyle = "#0c131bcc";
      ctx.fillRect(0, 0, game.viewWidth, 480);
      ctx.fillStyle = "#e0c691";
      ctx.font = "22px " + (root.FrontierFonts?.family() || "monospace");
      ctx.textAlign = "center";
      ctx.fillText(
        "The frontier claims another wanderer.",
        canvas.width / 2,
        185,
      );
      ctx.font = "12px " + (root.FrontierFonts?.family() || "monospace");
      ctx.fillText("Generate a world to begin again.", canvas.width / 2, 217);
      ctx.textAlign = "left";
    }
    /* October 12, 2026: append native particles before the one GPU submission. The former application call appended after submission and the next begin cleared those objects before they could be displayed. effectDelta is the owning frame's simulation seconds; explicit standalone draws default to zero advancement. */
    root.FrontierNativeEffects?.draw(canvas, game, game.effectDelta ?? 0);
    root.FrontierPixi?.end();
  }
  // Draw the overview map independently of the perspective renderer; its coordinates are world X/Y.
  /* @function render.map.30 — Draw the overview map independently of the perspective renderer; its coordinates are world X/Y. Inputs: canvas; world; game; editing. Updates: c fill style; c stroke style. Uses: canvas get context; c fill rect; c begin path; c arc. */ function map(
    canvas,
    world,
    game,
    editing,
  ) {
    const c = canvas.getContext("2d"),
      sx = canvas.width / (world.width ?? world.size),
      sy = canvas.height / (world.height ?? world.size);
    c.fillStyle = "#000";
    c.fillRect(0, 0, 240, 240);
    c.fillStyle = "#123356";
    c.fillRect((world.spawn.x - 1) * sx, 0, 2 * sx, 240);
    c.fillRect(0, (world.spawn.y - 1) * sy, 240, 2 * sy);
    for (const e of [
      ...(editing ? world.objects : game.maps.frontier.entities),
      ...(game.sceneEvents || []),
    ]) {
      c.fillStyle =
        e.kind === "monster" ? (e.dead ? "#622332" : "#ff4059") : "#288cff";
      c.fillRect(e.x * sx - 2, e.y * sy - 2, 4, 4);
    }
    const p = game.player;
    c.fillStyle = "#b5d9ff";
    c.beginPath();
    c.arc(p.x * sx, p.y * sy, 3, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = "#b5d9ff";
    c.beginPath();
    c.moveTo(p.x * sx, p.y * sy);
    c.lineTo(
      (p.x + Math.sin(game.camera.yaw) * 2) * sx,
      (p.y + Math.cos(game.camera.yaw) * 2) * sy,
    );
    c.stroke();
  }
  // Raymarch and refine the terrain intersection for editor placement, preserving raised terrain.
  /* @function render.groundPoint.31 — Raymarch and refine the terrain intersection for editor placement, preserving raised terrain. Inputs: game; sx; sy. Updates: t; lo; hi; previous. Uses: camera; frontier interior ground point; at; frontier terrain height. Returns: frontier interior ground point using cam, sx, sy; a record containing x, y. */ function groundPoint(
    game,
    sx,
    sy,
  ) {
    const cam = camera(game);
    if (cam.orthographic) return FrontierInterior.groundPoint(cam, sx, sy);
    const side = (sx - (cam.cx || 320)) / 360,
      up = ((cam.cy ?? 96) - sy) / 360,
      forward = Math.cos(cam.pitch) - up * Math.sin(cam.pitch),
      z = Math.sin(cam.pitch) + up * Math.cos(cam.pitch),
      ray = {
        x: forward * Math.sin(cam.yaw) + side * Math.cos(cam.yaw),
        y: forward * Math.cos(cam.yaw) - side * Math.sin(cam.yaw),
        z,
      };
    let previous = 0;
    const at =
      /* @function render.at.32 — Returns a record containing x, y, z. Inputs: t. Returns: a record containing x, y, z. */ (
        t,
      ) => ({
        x: cam.x + ray.x * t,
        y: cam.y + ray.y * t,
        z: cam.z + ray.z * t,
      });
    for (let t = 0.15; t <= 80; t += 0.15) {
      const p = at(t);
      if (p.z <= FrontierTerrain.height(game.sourceWorld, p.x, p.y)) {
        let lo = previous,
          hi = t;
        for (let i = 0; i < 16; i++) {
          const mid = (lo + hi) / 2,
            q = at(mid);
          if (q.z > FrontierTerrain.height(game.sourceWorld, q.x, q.y))
            lo = mid;
          else hi = mid;
        }
        const q = at(hi);
        return {
          x: q.x,
          y: q.y,
        };
      }
      previous = t;
    }
    return null;
  }
  // Choose the nearest projected entity containing the pointer, using one pass instead of sorting all candidates.
  /* @function render.pick.33 — Choose the nearest projected entity containing the pointer, using one pass instead of sorting all candidates. Inputs: game; sx; sy; assignment pattern. Updates: nearest; best; game model target debug. Uses: camera; root frontier activity query; root frontier model targeting pick; project. Returns: nearest. */ function pick(
    game,
    sx,
    sy,
    eventsOnly = false,
  ) {
    const cam = camera(game);
    let nearest = null,
      best = 45;
    let candidates = eventsOnly
      ? game.sceneEvents || []
      : root.FrontierActivity
        ? root.FrontierActivity.query(
            game,
            cam.x - 52,
            cam.y - 52,
            cam.x + 52,
            cam.y + 52,
          )
        : [...game.maps.frontier.entities, ...(game.sceneEvents || [])];
    if (!eventsOnly) {
      if (root.FrontierModelVisibility)
        candidates = root.FrontierModelVisibility.candidates(
          game,
          cam,
          candidates,
        );
      candidates = candidates.concat(game.hubDrops || []);
    }
    const zone = root.FrontierModelTargeting?.pick(
      game,
      sx,
      sy,
      candidates,
      !!game.authoring,
    );
    if (zone) {
      nearest = zone;
      best = zone.zoneDepth ?? 45;
    }
    for (const e of candidates) {
      if (
        e.modelId ||
        (!game.authoring &&
          e.spatial &&
          (e.spatial.visual === "none" || e.spatial.interactionZones.length))
      )
        continue;
      if (e.dead) continue;
      const p = project(cam, e.x, e.y, e.z || 0);
      // October 9: sprite targeting follows the same projected vertical body as its artwork.
      const top = null; // Locked camera-facing hit bounds match the restored rectangle.
      const topY = top?.y ?? (p ? p.y - e.height * p.scale : 0),
        halfWidth =
          e.height * Math.max(p?.scale || 0, top?.scale || 0) * 0.3 + 5;
      if (
        p &&
        p.depth < best &&
        Math.abs(sx - p.x) < halfWidth &&
        sy >= topY - 5 &&
        sy <= p.y + 5
      ) {
        best = p.depth;
        nearest = e;
      }
    }
    game.modelTargetDebug = nearest?.zoneHit
      ? {
          hostId: nearest.modelHostId,
          zoneId: nearest.zoneId,
          eventId: nearest.eventId,
          name: nearest.name,
        }
      : null;
    return nearest;
  }
  root.FrontierRender = {
    draw,
    map,
    camera,
    project,
    depth,
    groundPoint,
    pick,
  };
})(window);
