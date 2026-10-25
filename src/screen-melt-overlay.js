/* Capture only when a transfer starts. Two bounded canvases are released at
 * completion; normal rendering never pays for framebuffer preservation. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function screen-melt-overlay.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier screen melt overlay. */
(/* @function screen-melt-overlay.installReviewed — Installs transfer-only screen-melt capture/compositing ownership. Two bounded canvases live only for an active transition and release at completion; ordinary rendering avoids framebuffer-preservation work. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  /* @function screen-melt-overlay.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: object pattern. Returns: a record containing begin, update, end, debug. */ function create({
    host,
    source,
    capture,
    makeCanvas = /* @function screen-melt-overlay.makeCanvas.3 — Returns document create element using "canvas". Inputs: no explicit arguments; uses enclosing module state. Uses: document create element. Returns: document create element using "canvas". */ () =>
      document.createElement("canvas"),
  }) {
    let old = null,
      overlay = null,
      model = null;
    /* @function screen-melt-overlay.end.4 — Handles end within screen melt overlay. Inputs: no explicit arguments; uses enclosing module state. Updates: canvas width; canvas height; old; overlay; model. Uses: overlay remove. */ function end() {
      overlay?.remove();
      for (const canvas of [old, overlay])
        if (canvas) {
          canvas.width = 1;
          canvas.height = 1;
        }
      old = overlay = model = null;
    }
    /* @function screen-melt-overlay.draw.5 — Draws this system’s current state into the supplied rendering context. Inputs: no explicit arguments; uses enclosing module state. Uses: overlay get context; ctx clear rect; model strips; ctx draw image. */ function draw() {
      const ctx = overlay.getContext("2d");
      ctx.clearRect(0, 0, overlay.width, overlay.height);
      for (const strip of model.strips()) {
        const remaining = overlay.height - strip.y;
        if (remaining > 0)
          ctx.drawImage(
            old,
            strip.x,
            0,
            strip.width,
            remaining,
            strip.x,
            strip.y,
            strip.width,
            remaining,
          );
      }
    }
    /* @function screen-melt-overlay.begin.6 — Handles begin within screen melt overlay. Inputs: no explicit arguments; uses enclosing module state. Updates: model; old; overlay; canvas width; canvas height. Uses: error; root frontier screen melt create; make canvas; capture. */ function begin() {
      if (model) throw Error("A screen melt is already active.");
      try {
        model = root.FrontierScreenMelt.create(source.width, source.height);
        old = makeCanvas();
        overlay = makeCanvas();
        for (const canvas of [old, overlay]) {
          canvas.width = source.width;
          canvas.height = source.height;
        }
        capture(old);
        overlay.setAttribute("aria-hidden", "true");
        Object.assign(overlay.style, {
          position: "absolute",
          inset: "0",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: "3",
        });
        host.append(overlay);
        draw();
      } catch (error) {
        end();
        throw error;
      }
    }
    return {
      begin,
      /* @function screen-melt-overlay.update.7 — Advances this system using the current state and elapsed time. Inputs: dt. Uses: error; model advance; draw. Returns: done. */ update(
        dt,
      ) {
        if (!model) throw Error("Screen melt has no captured frame.");
        const done = model.advance(dt);
        draw();
        return done;
      },
      end,
      debug:
        /* @function screen-melt-overlay.debug.8 — Returns a record containing active, canvasBytes, model. Inputs: no explicit arguments; uses enclosing module state. Uses: model debug. Returns: a record containing active, canvasBytes, model. */ () => ({
          active: !!model,
          canvasBytes: model ? source.width * source.height * 8 : 0,
          model: model?.debug() || null,
        }),
    };
  }
  root.FrontierScreenMeltOverlay = { create };
})(typeof window === "undefined" ? globalThis : window);
