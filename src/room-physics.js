/* October 12, 2026: room primitives have complete vertical volume. Previous
 * footprint-only behavior could block stair ascent and ignore ceiling height.
 * The authored boxes remain the single source for drawing and body support. */
(/* @function roomPhysics.install — Inputs: browser/global namespace. Returns: nothing. Installs pure room-volume queries; does not cache mutable authoring data. */ function (
  root,
) {
  "use strict";
  /* @function roomPhysics.overlap — Inputs: box, floor-plane X/Y and body radius in metres. Returns: whether the body footprint overlaps its interior. A small tolerance permits touching faces without classifying contact as penetration. No mutation. */
  function overlap(e, x, y, radius) {
    // Round disks/rings use their actual faceted footprint; a tower is never a solid box.
    if (e.shape === "round")
      return root.FrontierRoundGeometry.overlap(e, x, y, radius);
    const dx = x - e.x,
      dy = y - e.y,
      c = Math.cos(e.yaw || 0),
      s = Math.sin(e.yaw || 0),
      ac = Math.abs(c),
      as = Math.abs(s);
    // Four separating axes give the exact 2D OBB/AABB footprint test. Merely
    // expanding local extents would falsely block outside rotated wall corners.
    if (
      Math.abs(dx) >= (e.w / 2) * ac + (e.d / 2) * as + radius - 1e-6 ||
      Math.abs(dy) >= (e.w / 2) * as + (e.d / 2) * ac + radius - 1e-6
    )
      return false;
    return (
      Math.abs(c * dx + s * dy) < e.w / 2 + radius * (ac + as) - 1e-6 &&
      Math.abs(-s * dx + c * dy) < e.d / 2 + radius * (ac + as) - 1e-6
    );
  }
  /* @function roomPhysics.support — Inputs: world, X/Y, inclusive low/high elevation and radius. Returns: highest reachable primitive top or null. Only actual top surfaces support the body; ceilings above high are excluded. No mutation, bounded by validated room primitive capacity. */
  function support(world, x, y, low, high, radius = 0.13) {
    let best = null;
    for (const e of world.interior?.primitives || []) {
      const top = e.z + e.h;
      if (top < low - 1e-6 || top > high + 1e-6 || !overlap(e, x, y, radius))
        continue;
      if (best === null || top > best) best = top;
    }
    return best;
  }
  /* @function roomPhysics.blocked — Inputs: world, proposed X/Y, feet Z, body radius/height. Returns: true on vertical-volume overlap with any primitive or independent blocker. Independent blockers default to tall walls; authored z/h are respected. No mutation; supported top contact is passable. */
  function blocked(world, x, y, z, radius = 0.13, height = 1.65) {
    for (const e of [
      ...(world.interior?.primitives || []),
      ...(world.interior?.blockers || []),
    ]) {
      const base = e.z ?? -30,
        top = e.z === undefined ? 100 : base + (e.h ?? 100);
      if (
        overlap(e, x, y, radius) &&
        z < top - 1e-5 &&
        z + height > base + 1e-5
      )
        return true;
    }
    return false;
  }
  /* @function roomPhysics.vertical — Inputs: world, actor with current feet elevation, requested end elevation and radius. Returns: end clamped to the nearest crossed top (falling) or underside (rising). Starting overlaps are left to recovery rather than creating an immovable zero sweep. No actor mutation. */
  function vertical(world, actor, end, radius = 0.13) {
    const start = actor.z || 0,
      height = actor.height || 1.65;
    let result = end;
    for (const e of world.interior?.primitives || []) {
      if (!overlap(e, actor.x, actor.y, radius)) continue;
      const top = e.z + e.h;
      if (end < start && start >= top - 1e-5 && end < top)
        result = Math.max(result, top);
      if (end > start && start + height <= e.z + 1e-5 && end + height > e.z)
        result = Math.min(result, e.z - height);
    }
    return result;
  }
  /* @function roomPhysics.step — Inputs: world, grounded actor, proposed X/Y, maximum rise and radius. Returns: reachable top height or null. Checks destination body clearance and upward headroom, rejecting ceilings and tall walls. No mutation; caller commits height only if all other blockers pass. */
  function step(world, actor, x, y, maximum = 0.3, radius = 0.13) {
    if (actor.grounded === false) return null;
    const z = actor.z || 0,
      top = support(world, x, y, z + 1e-5, z + maximum, radius);
    if (top === null || blocked(world, x, y, top, radius, actor.height || 1.65))
      return null;
    if (vertical(world, actor, top, radius) < top - 1e-5) return null;
    return top;
  }
  /* @function roomPhysics.walkable — Inputs: grid-authored world, floor-plane X/Y and body radius. Returns: whether all four body-footprint corners lie on the union of actual floor/stair modules. Adjacent tiles share walkability without invisible seam margins; erased cells are not terrain shortcuts. Does not mutate scene data. */
  function walkable(world, x, y, radius = 0.13) {
    const pieces = world.interior?.primitives || [];
    for (const dx of [-radius, radius])
      for (const dy of [-radius, radius]) {
        let supported = false;
        for (const e of pieces) {
          if (!["floor", "stair"].includes(e.moduleType)) continue;
          const c = Math.cos(e.yaw || 0),
            s = Math.sin(e.yaw || 0),
            px = x + dx - e.x,
            py = y + dy - e.y;
          if (
            Math.abs(c * px + s * py) <= e.w / 2 + 1e-6 &&
            Math.abs(-s * px + c * py) <= e.d / 2 + 1e-6
          ) {
            supported = true;
            break;
          }
        }
        if (!supported) return false;
      }
    return true;
  }
  root.FrontierRoomPhysics = {
    overlap,
    support,
    blocked,
    vertical,
    step,
    walkable,
  };
})(typeof window === "undefined" ? globalThis : window);
