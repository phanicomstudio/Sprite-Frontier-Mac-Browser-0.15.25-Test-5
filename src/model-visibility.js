/* 2026-10-09: model visibility is independent from actor simulation scheduling.
 * Large landmarks are selected using transformed bounds, not their origin.
 * Distance overrides never disable the renderer's offscreen/near-plane checks. */
(/* @function model-visibility.install — Publishes visibility helpers without loading assets or changing game state. Inputs: root, browser/global namespace. Returns: nothing; installs FrontierModelVisibility. */ function (
  root,
) {
  "use strict";
  /* @function model-visibility.validate — Normalizes a saved per-instance draw policy. Inputs: value, optional policy record. Returns: a fresh mode/distance record. Throws for unsupported modes or distances outside 1–10000 world units; does not mutate input. */
  function validate(value = {}) {
    const mode = value.mode || "default",
      distance = value.distance ?? 52;
    if (
      !["default", "custom", "unlimited"].includes(mode) ||
      !Number.isFinite(distance) ||
      distance < 1 ||
      distance > 10000
    )
      throw Error("Model draw distance must be 1–10000 world units.");
    return { mode, distance };
  }
  /* @function model-visibility.distance — Measures horizontal distance from camera to conservative world-space bounds. Inputs: entity, decoded asset, camera. Returns: nonnegative world units. Full rotation/scale is applied to eight corners; unloaded assets fall back to their origin. No state changes; conservative bounds can retain a model slightly longer. */
  function distance(entity, asset, cam) {
    if (!asset?.scene?.bounds)
      return Math.hypot(entity.x - cam.x, entity.y - cam.y);
    const m = root.FrontierModelEvents.matrix(entity),
      b = asset.scene.bounds;
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    for (const x of [b.min[0], b.max[0]])
      for (const y of [b.min[1], b.max[1]])
        for (const z of [b.min[2], b.max[2]]) {
          const p = root.FrontierModelTransform.vector(m, [x, y, z]);
          minX = Math.min(minX, p[0]);
          maxX = Math.max(maxX, p[0]);
          minY = Math.min(minY, p[1]);
          maxY = Math.max(maxY, p[1]);
        }
    return Math.hypot(
      Math.max(minX - cam.x, 0, cam.x - maxX),
      Math.max(minY - cam.y, 0, cam.y - maxY),
    );
  }
  /* @function model-visibility.candidates — Adds distant model instances missed by the legacy origin-based spatial query. Inputs: game, camera, nearby entity array. Returns: a new deduplicated candidate array; stores aggregate visibility diagnostics on game. Does not wake actors or alter collision. Scans model references only; decoded geometry remains shared. */
  function candidates(game, cam, nearby) {
    const result = [],
      seen = new Set();
    let tested = 0,
      culled = 0;
    for (const e of nearby)
      if (!e.modelId) {
        result.push(e);
        seen.add(e);
      }
    // October 9: preserve model blockers supplied by the spatial query as well as
    // adding large landmarks outside it; dropping nearby blockers breaks occlusion.
    for (const group of [
      nearby,
      game.maps.frontier.entities,
      game.sceneEvents || [],
    ])
      for (const e of group) {
        if (!e.modelId || seen.has(e)) continue;
        seen.add(e);
        tested++;
        const policy = e.spatial?.drawDistance || {
            mode: "default",
            distance: 52,
          },
          limit =
            policy.mode === "unlimited"
              ? Infinity
              : policy.mode === "custom"
                ? policy.distance
                : game.sourceWorld?.modelDrawDistance || 52;
        const d = distance(e, root.FrontierModelLibrary.get(e.modelId), cam);
        e.modelCoverage = Number.isFinite(limit)
          ? Math.max(0, Math.min(1, (limit - d) / Math.min(8, limit * 0.2)))
          : 1;
        if (d <= limit) result.push(e);
        else culled++;
      }
    game.modelVisibilityDebug = {
      tested,
      distanceCulled: culled,
      defaultDistance: game.sourceWorld?.modelDrawDistance || 52,
    };
    return result;
  }
  root.FrontierModelVisibility = { validate, distance, candidates };
})(typeof window === "undefined" ? globalThis : window);
