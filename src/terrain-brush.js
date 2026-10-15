/* Sparse additive height edits are bilinearly sampled by the shared terrain API.
 * One drag is one undo transaction; brush previews mutate only the active map.
 * Strength is integrated by distance travelled, independent of pointer event rate. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function terrain-brush.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier brush. */
(/* @function terrain-brush.installReviewed — Installs sparse additive height-brush authoring with shared bilinear sampling. One drag commits one Undo transaction and travelled distance controls strength independently of pointer-event frequency; previews target the active map. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function terrain-brush.paint.2 — Handles paint within terrain brush. Inputs: world; point; tool; radius; strength; target. Updates: world terrain edits; world water; snapshot at sx plus "," plus sy; water cells at k; sum. Uses: root frontier water validate; root frontier terrain base height; root frontier water invalidate. Returns: touched. */
  /* @function terrain-brush.reviewedpaint_2 — Applies one terrain/water brush stamp to active authored world. Inputs: world, point XY metres, tool, positive radius metres, integrated strength and target Z metres. Returns touched vertex/cell count (includes no-op same values). Mutates sparse height edits clamped±30 or painted water cells; smooth reads local neighbour snapshot so stamp order does not bias results. Raise/lower strength is metre delta, flatten/smooth strength capped blend0-1. Unknown nonwater tool follows target-height branch; UI validates tool/radius/strength. Invalidates water cache for water edits or increments terrain revision for heights; caller owns stroke Undo/persistence. Dependency errors propagate; no transaction rollback inside stamp. */ function paint(
    world,
    point,
    tool,
    radius,
    strength,
    target,
  ) {
    const cells = world.terrain.edits || (world.terrain.edits = {}),
      water = world.water || (world.water = root.FrontierWater.validate());
    // Smoothing snapshots only the brush neighborhood, never the whole map.
    const snapshot = tool === "smooth" ? {} : cells;
    if (tool === "smooth")
      for (
        let sy = Math.floor(point.y - radius) - 1;
        sy <= Math.ceil(point.y + radius) + 1;
        sy++
      )
        for (
          let sx = Math.floor(point.x - radius) - 1;
          sx <= Math.ceil(point.x + radius) + 1;
          sx++
        )
          snapshot[sx + "," + sy] = cells[sx + "," + sy] || 0;
    let touched = 0;
    for (
      let y = Math.max(0, Math.floor(point.y - radius));
      y <= Math.min(world.height - 1, Math.ceil(point.y + radius));
      y++
    )
      for (
        let x = Math.max(0, Math.floor(point.x - radius));
        x <= Math.min(world.width - 1, Math.ceil(point.x + radius));
        x++
      ) {
        const d = Math.hypot(x - point.x, y - point.y) / radius;
        if (d > 1) continue;
        const k = x + "," + y,
          weight = (1 - d) * (1 - d);
        // October 14: texture stamps affect sparse material cells, never height
        // or water. Their owner snapshots terrain for normal stroke Undo.
        if (tool === "texture" || tool === "eraseTexture") {
          const materials = world.terrain.materials || (world.terrain.materials = {});
          const existed = Object.hasOwn(materials, k);
          if (tool === "eraseTexture") {
            delete materials[k];
            if (existed) world.terrain.materialCount = Math.max(0, (world.terrain.materialCount || 0) - 1);
          }
          else if (/^ground-(moss|forest-litter|mossy-stone|earth)$/.test(target)) {
            materials[k] = target;
            if (!existed) world.terrain.materialCount = (world.terrain.materialCount || 0) + 1;
          }
          else throw Error("Choose a ground texture before painting.");
          touched++;
          continue;
        }
        if (tool === "water") {
          water.cells[k] = water.level;
          touched++;
          continue;
        }
        if (tool === "eraseWater") {
          delete water.cells[k];
          touched++;
          continue;
        }
        const current = cells[k] || 0,
          base = root.FrontierTerrain.baseHeight(world, x, y);
        let change =
          tool === "raise"
            ? strength
            : tool === "lower"
              ? -strength
              : target - base - current;
        if (tool === "smooth") {
          let sum = 0,
            n = 0;
          for (const [dx, dy] of [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
          ]) {
            sum +=
              root.FrontierTerrain.baseHeight(world, x + dx, y + dy) +
              (snapshot[x + dx + "," + (y + dy)] || 0);
            n++;
          }
          change = sum / n - base - current;
        }
        cells[k] = Math.max(
          -30,
          Math.min(
            30,
            current +
              change *
                weight *
                (tool === "raise" || tool === "lower"
                  ? 1
                  : Math.min(1, strength)),
          ),
        );
        touched++;
      }
    if (tool === "water" || tool === "eraseWater")
      root.FrontierWater.invalidate(world);
    else world.terrain.revision = (world.terrain.revision || 0) + 1;
    return touched;
  }
  root.FrontierBrush = {
    paint,
  };
})(typeof window === "undefined" ? globalThis : window);
