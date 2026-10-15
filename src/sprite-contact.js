/* October 12, 2026: contact-only visibility depth. The 0.15.17 image rectangle,
 * frame selection, tilt, proportions and anchoring are untouched. Near a solid,
 * visibility follows the actor's horizontal position rather than allowing the
 * camera-facing card's upper pixels to imply penetration into that solid. */
(/* @function spriteContact.install — Inputs: global namespace. Returns nothing; publishes depth selection without changing geometry or input. */ function (
  root,
) {
  "use strict";
  /* @function spriteContact.depth — Inputs: active game, rendered actor, perspective camera and historical card depth. Returns unchanged scalar outside contact, or a screen-row depth function near solid geometry. Coordinates are world metres and logical screen pixels. Does not move/rotate/resize sprites or suppress walls. Floor/stair support is excluded from primitive contact. Mesh queries preserve diagnostic ownership; projection degeneracy falls back to historical depth. */
  function depth(game, actor, cam, planeDepth) {
    if (!game || cam.orthographic || Math.abs(cam.pitch) < 0.001)
      return planeDepth;
    const sine = Math.sin(cam.pitch),
      cosine = Math.cos(cam.pitch),
      height = actor.height || 1.65,
      feet = actor.z || 0,
      radius = 0.13 + Math.abs(sine) * height + 0.35;
    let contact = false;
    for (const piece of game.sourceWorld.interior?.primitives || []) {
      if (
        ["floor", "stair"].includes(piece.moduleType) ||
        piece.z + piece.h <= feet + 0.015 ||
        piece.z >= feet + height
      )
        continue;
      if (root.FrontierRoomPhysics.overlap(piece, actor.x, actor.y, radius)) {
        contact = true;
        break;
      }
    }
    if (!contact && game.sceneEvents?.length && root.FrontierModelCollision) {
      const previous = game.modelCollisionDebug;
      try {
        contact = root.FrontierModelCollision.blocked(
          game,
          actor.x,
          actor.y,
          radius,
          actor,
        );
      } finally {
        game.modelCollisionDebug = previous;
      }
    }
    if (!contact) return planeDepth;
    const forward =
      (actor.x - cam.x) * Math.sin(cam.yaw) +
      (actor.y - cam.y) * Math.cos(cam.yaw);
    if (forward <= 0.13 || Math.abs(cosine) < 0.1) return planeDepth;
    return /* @function spriteContact.rowDepth — Inputs: logical screen sample Y. Returns positive camera-forward depth for the row at the actor's horizontal plane. This is visibility data only; the camera-facing picture remains identical. Invalid or behind-camera row intersections retain historical depth. */ function (
      y,
    ) {
      const denominator = cosine - (((cam.cy ?? 96) - y) / 360) * sine;
      return denominator > 0.05
        ? Math.max(0.13, forward / denominator)
        : planeDepth;
    };
  }
  root.FrontierSpriteContact = { depth };
})(typeof window === "undefined" ? globalThis : window);
