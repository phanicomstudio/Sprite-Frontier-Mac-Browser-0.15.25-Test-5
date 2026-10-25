/* Overlay diagnostics deliberately bypass scene depth so hidden collision
 * shapes remain inspectable. Never enabled in normal play by default. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-debug.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model debug. Uses: edges push. */
(/* @function model-debug.installReviewed — Installs optional model/collision diagnostic overlay drawing. Overlays deliberately bypass scene depth so hidden volumes can be inspected; ordinary play does not enable them by default. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  const edges = [];
  for (let i = 0; i < 8; i++)
    for (const bit of [1, 2, 4]) if (!(i & bit)) edges.push([i, i | bit]);
  const state = { enabled: false };
  /* Historical contract retained; October 14 reviewed explanation follows. @function model-debug.draw.2 — Draws this system’s current state into the supplied rendering context. Inputs: ctx; game; cam; entities. Updates: ctx fog depth; ctx global alpha; ctx line width; ctx font; ctx stroke style. Uses: ctx save; frontier model events matrix; frontier model library get; frontier model scene triangles. Returns: without a result. */
  /* @function model-debug.revieweddraw_2 — Draws optional authored/model collision overlay. Inputs: rendering ctx, game, camera and entities. Returns undefined; no-op unless authoring or debug enabled. Renders mesh triangles for mesh mode, custom collision boxes and interaction zones, highlights selection/target and draws labels in logical pixels, deliberately without scene-depth masking. Mutates render styles/state only; saves/restores on normal completion, no finally restoration on thrown services. Never changes collision geometry or sprite presentation. */ function draw(
    ctx,
    game,
    cam,
    entities,
  ) {
    if (!game.authoring && !state.enabled) return;
    ctx.save();
    ctx.fogDepth = 0;
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    ctx.font = "14px Arial";
    for (const host of entities) {
      if (!host.spatial || host.dead) continue;
      const parent = FrontierModelEvents.matrix(host);
      if (host.spatial.collisionMode === "mesh") {
        const asset = FrontierModelLibrary.get(host.modelId);
        if (asset?.scene) {
          ctx.strokeStyle = "#ffb35c";
          ctx.fillStyle = "#ffb35c";
          ctx.lineWidth = 0.75;
          ctx.globalAlpha = 0.2;
          FrontierModelScene.triangles(
            asset,
            asset.scene,
            parent,
            /* Historical contract retained; October 14 reviewed explanation follows. @function model-debug.callback.3 — Provides the callback for frontier model scene triangles. Inputs: points. Uses: points map; p some; ctx begin path; ctx move to. Returns: without a result. */
  /* @function model-debug.reviewedcallback_3 — Draws projected debug mesh triangle. Inputs: world XYZ triangle points. Returns undefined; skips any missing projected vertex, otherwise fills/strokes current path. No geometry mutation; rendering errors propagate. */ (
              points,
            ) => {
              const p = points.map(
                /* Historical contract retained; October 14 reviewed explanation follows. @function model-debug.callback.4 — Returns frontier render project using cam, spread element. Inputs: v. Uses: frontier render project. Returns: frontier render project using cam, spread element. */
  /* @function model-debug.reviewedcallback_4 — Projects debug mesh vertex. Inputs: XYZ v and captured camera. Returns logical screen point or null; no mutation. */ (
                  v,
                ) => FrontierRender.project(cam, ...v),
              );
              if (
                p.some(
                  /* Historical contract retained; October 14 reviewed explanation follows. @function model-debug.callback.5 — Returns the inverse of v. Inputs: v. Returns: the inverse of v. */
  /* @function model-debug.reviewedcallback_5 — Detects missing triangle projection. Inputs: v. Returns !v; no mutation. */ (
                    v,
                  ) => !v,
                )
              )
                return;
              ctx.beginPath();
              ctx.moveTo(p[0].x, p[0].y);
              ctx.lineTo(p[1].x, p[1].y);
              ctx.lineTo(p[2].x, p[2].y);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            },
          );
          ctx.globalAlpha = 1;
        }
      }
      for (const [key, color] of [
        ["collisionBoxes", "#ffb35c"],
        ["interactionZones", "#60f2df"],
      ])
        for (const box of key === "collisionBoxes" &&
        host.spatial.collisionMode &&
        host.spatial.collisionMode !== "custom"
          ? []
          : host.spatial[key] || []) {
          const points = FrontierModelTransform.corners(box, parent).map(
            /* Historical contract retained; October 14 reviewed explanation follows. @function model-debug.callback.6 — Returns frontier render project using cam, spread element. Inputs: p. Uses: frontier render project. Returns: frontier render project using cam, spread element. */
  /* @function model-debug.reviewedcallback_6 — Projects transformed debug-box corner. Inputs: XYZ p and captured camera. Returns screen point or null; no mutation. */ (
              p,
            ) => FrontierRender.project(cam, ...p),
          );
          const targeted =
            game.modelTargetDebug?.hostId === host.id &&
            game.modelTargetDebug.zoneId === box.id;
          ctx.strokeStyle = targeted
            ? "#ff5f8f"
            : host.id === game.selectedId
              ? "#ffffff"
              : color;
          ctx.lineWidth = targeted ? 3 : 1;
          ctx.beginPath();
          for (const [a, b] of edges)
            if (points[a] && points[b]) {
              ctx.moveTo(points[a].x, points[a].y);
              ctx.lineTo(points[b].x, points[b].y);
            }
          ctx.stroke();
          const center = FrontierModelTransform.vector(
              FrontierModelTransform.multiply(
                parent,
                FrontierModelTransform.matrix(box.transform),
              ),
              [0, 0, 0],
            ),
            p = FrontierRender.project(cam, ...center);
          if (p) {
            ctx.fillStyle = color;
            ctx.fillText(box.name || box.id, p.x + 5, p.y - 5);
          }
        }
    }
    if (state.enabled) {
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        game.modelTargetDebug
          ? "Target: " +
              game.modelTargetDebug.name +
              " → " +
              game.modelTargetDebug.eventId
          : "No interaction zone targeted",
        16,
        460,
      );
    }
    ctx.restore();
  }
  root.FrontierModelDebug = { state, draw };
})(typeof window === "undefined" ? globalThis : window);
