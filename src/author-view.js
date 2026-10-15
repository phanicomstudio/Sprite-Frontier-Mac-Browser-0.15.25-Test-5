/* October 12, 2026: editor cutaway changes only visible room faces. Collision,
 * picking data, saved cells and actual playtest/exported games retain all walls
 * and ceilings. This makes interiors usable when the free author camera is
 * outside a newly built shell. */
(/* @function authorView.install — Inputs: browser/global namespace. Returns: nothing. Installs transient view state and a pure face filter. */ function (
  root,
) {
  "use strict";
  const state = { cutaway: true };
  /* @function authorView.faces — Inputs: game, camera and authoritative cached room faces. Returns: original list outside editor/cutaway mode, otherwise a filtered list hiding upper slabs and near-side perimeter walls. Does not remove geometry or change collision. Free-standing interior props remain visible. */
  function faces(game, camera, list) {
    const room = game.sourceWorld?.interior;
    if (!game.authoring || !state.cutaway || room?.mode !== "geometry")
      return list;
    let x0 = Infinity,
      x1 = -Infinity,
      y0 = Infinity,
      y1 = -Infinity;
    for (const p of room.floor) {
      x0 = Math.min(x0, p[0]);
      x1 = Math.max(x1, p[0]);
      y0 = Math.min(y0, p[1]);
      y1 = Math.max(y1, p[1]);
    }
    const cx = (x0 + x1) / 2,
      cy = (y0 + y1) / 2,
      hidden = new Set();
    for (const e of room.primitives) {
      if (e.h <= 0.3 && e.z > (game.player.z || 0) + 1.7) {
        hidden.add(e.id);
        continue;
      }
      const nearBoundary = e.w <= 0.5 || e.d <= 0.5;
      const perimeter =
        Math.abs(e.x - x0) < 0.6 ||
        Math.abs(e.x - x1) < 0.6 ||
        Math.abs(e.y - y0) < 0.6 ||
        Math.abs(e.y - y1) < 0.6;
      if (
        nearBoundary &&
        perimeter &&
        (e.x - cx) * (camera.x - cx) + (e.y - cy) * (camera.y - cy) > 0
      )
        hidden.add(e.id);
    }
    return list.filter(
      /* @function authorView.visibleFace — Inputs: cached face. Returns: whether its parent remains in the transient cutaway view. No mutation. */ function (
        face,
      ) {
        return !hidden.has(face.id);
      },
    );
  }
  root.FrontierAuthorView = { state, faces };
})(typeof window === "undefined" ? globalThis : window);
