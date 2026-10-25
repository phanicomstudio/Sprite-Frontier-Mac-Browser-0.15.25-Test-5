/* MAINTAINER GUIDE
 * Independent horizon/parallax layers. Distance and parallax control perceived depth; cloud speed is driven by elapsed simulation time. Replace vector drawing with images while retaining layer metadata.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function sky.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier sky. */
(/* @function sky.installReviewed — Installs independent per-map horizon/parallax data and drawing services. Layer distance/parallax controls perceived depth and cloud motion uses elapsed simulation seconds; it does not render inactive cells. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  const defaults = {
    enabled: true,
    layers: [
      {
        id: "distant-ridge",
        kind: "ridge",
        color: "#17406c",
        distance: 160,
        height: 12,
        parallax: 0.08,
        speed: 0,
      },
      {
        id: "near-ridge",
        kind: "ridge",
        color: "#225ea0",
        distance: 100,
        height: 7,
        parallax: 0.3,
        speed: 0,
      },
      {
        id: "high-clouds",
        kind: "cloud",
        color: "#25528b",
        distance: 220,
        height: 65,
        parallax: 0.02,
        speed: 0.012,
      },
      {
        id: "low-clouds",
        kind: "cloud",
        color: "#497cc1",
        distance: 170,
        height: 34,
        parallax: 0.06,
        speed: 0.022,
      },
    ],
  };
  // Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields.
  /* @function sky.validate.2 — Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields. Inputs: value. Uses: structured clone; array is array; error; value layers map. Returns: structured clone using defaults; a record containing enabled, layers. */ function validate(
    value,
  ) {
    if (value === undefined) return structuredClone(defaults);
    if (
      !value ||
      typeof value.enabled !== "boolean" ||
      !Array.isArray(value.layers) ||
      value.layers.length > 12
    )
      throw Error("Invalid sky layers.");
    const ids = new Set();
    return {
      enabled: value.enabled,
      ...(value.panorama === undefined
        ? {}
        : { panorama: root.FrontierSkyPanorama.validate(value.panorama) }),
      layers: value.layers.map(
        /* @function sky.callback.3 — Provides the callback for value layers map. Inputs: l. Uses: ids has; a list of "ridge", "cloud" includes; /^#[0-9a-f]{6}$/i test; number is finite. Returns: a record containing id, kind, color, distance, height, parallax, speed. */ (
          l,
        ) => {
          if (
            !l ||
            typeof l.id !== "string" ||
            l.id.length > 80 ||
            ids.has(l.id) ||
            !["ridge", "cloud"].includes(l.kind) ||
            !/^#[0-9a-f]{6}$/i.test(l.color) ||
            !Number.isFinite(l.distance) ||
            l.distance < 60 ||
            l.distance > 500 ||
            !Number.isFinite(l.height) ||
            l.height < 1 ||
            l.height > 150 ||
            !Number.isFinite(l.parallax) ||
            l.parallax < 0 ||
            l.parallax > 1 ||
            !Number.isFinite(l.speed) ||
            Math.abs(l.speed) > 0.1
          )
            throw Error("Invalid sky layer.");
          ids.add(l.id);
          return {
            id: l.id,
            kind: l.kind,
            color: l.color,
            distance: l.distance,
            height: l.height,
            parallax: l.parallax,
            speed: l.speed,
          };
        },
      ),
    };
  }
  /* @function sky.draw.4 — Draws this system’s current state into the supplied rendering context. Inputs: ctx; game; cam; project. Updates: ctx fog depth; ctx stroke style; ctx line width; previous. Uses: ctx save; project; ctx begin path; ctx move to. Returns: without a result. */ function draw(
    ctx,
    game,
    cam,
    project,
  ) {
    const sky = game.sourceWorld.sky;
    if (!sky?.enabled) return;
    // Sky distances position parallax artwork, not fog occluders. Preserve terrain fog depth.
    ctx.save();
    ctx.fogDepth = 0;
    // October 13: the optional image is a backdrop; procedural layers remain
    // independent overlays and retain the earlier fallback while it loads.
    if (sky.panorama)
      root.FrontierSkyPanorama?.draw(ctx, game, cam, sky.panorama);
    const time = game.elapsed;
    for (const layer of sky.layers) {
      ctx.strokeStyle = layer.color;
      ctx.lineWidth = 1;
      const cx = 24 + (cam.x - 24) * (1 - layer.parallax),
        cy = 24 + (cam.y - 24) * (1 - layer.parallax);
      if (layer.kind === "ridge") {
        let previous = null;
        for (let i = 0; i <= 180; i++) {
          const angle = (i * Math.PI * 2) / 180,
            x = cx + Math.sin(angle) * layer.distance,
            y = cy + Math.cos(angle) * layer.distance,
            z =
              layer.height *
              (0.6 + 0.25 * Math.sin(angle * 7) + 0.15 * Math.cos(angle * 13)),
            p = project(cam, x, y, z);
          if (p && previous && Math.abs(p.x - previous.x) < 1500) {
            ctx.fogDepth = 0;
            ctx.beginPath();
            ctx.moveTo(previous.x, previous.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
          previous = p;
        }
      } else {
        for (let i = 0; i < 18; i++) {
          const angle = (i * Math.PI * 2) / 18 + time * layer.speed,
            x = cx + Math.sin(angle) * layer.distance,
            y = cy + Math.cos(angle) * layer.distance,
            z = layer.height + Math.sin(i * 1.8) * 8,
            p = project(cam, x, y, z);
          if (
            !p ||
            p.x < -150 ||
            p.x > (game.viewWidth || 640) + 150 ||
            p.y < -90 ||
            p.y > 350
          )
            continue;
          const w = Math.min(180, p.scale * (15 + 6 * Math.sin(i + 2))),
            h = w * 0.2;
          ctx.beginPath();
          ctx.moveTo(p.x - w / 2, p.y);
          ctx.bezierCurveTo(
            p.x - w * 0.6,
            p.y - h,
            p.x - w * 0.2,
            p.y - h * 1.5,
            p.x - w * 0.05,
            p.y - h,
          );
          ctx.bezierCurveTo(
            p.x + w * 0.05,
            p.y - h * 2.5,
            p.x + w * 0.35,
            p.y - h * 2,
            p.x + w * 0.3,
            p.y - h * 0.6,
          );
          ctx.bezierCurveTo(
            p.x + w * 0.7,
            p.y - h,
            p.x + w * 0.65,
            p.y + h * 0.1,
            p.x + w * 0.35,
            p.y,
          );
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }
  root.FrontierSky = {
    defaults,
    validate,
    draw,
  };
})(typeof window === "undefined" ? globalThis : window);
