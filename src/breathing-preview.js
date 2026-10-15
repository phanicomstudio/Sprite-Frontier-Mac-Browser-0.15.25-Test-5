/* October 10, 2026: isolated radial preview uses a captured world image.
 * It owns a small reusable pixel buffer and stops its animation on close.
 * Gameplay phase, map configuration, menus and HUD never move with it. */
(/* @function breathing-preview.install — Inputs: browser namespace. Publishes preview dialog service; creates no resources until opened. */ function (
  root,
) {
  "use strict";
  root.FrontierBreathingPreview = {
    /* @function breathing-preview.open — Inputs: validated breathing settings and source world canvas. Opens a 320x240 captured-world preview. Returns dialog; errors from unavailable image capture propagate to caller. Does not save or alter game runtime. */
    open(settings, source) {
      const dialog = document.createElement("dialog");
      dialog.style.cssText = "font:20px Arial;max-width:90vw";
      dialog.innerHTML =
        '<h2>Screen breathing preview</h2><p>Captured world view. Gameplay remains paused. Close to return to options.</p><canvas width="320" height="240" style="width:min(640px,75vw);height:auto"></canvas><p data-status></p><button>Close preview</button>';
      document.body.append(dialog);
      const canvas = dialog.querySelector("canvas"),
        ctx = canvas.getContext("2d"),
        capture = document.createElement("canvas");
      capture.width = 320;
      capture.height = 240;
      root.FrontierPixi.capture(capture);
      const input = capture.getContext("2d").getImageData(0, 0, 320, 240),
        output = ctx.createImageData(320, 240),
        runtime = root.FrontierBreathing.create(settings);
      const sampled = { x: 0, y: 0 };
      let handle = 0,
        last = performance.now(),
        closed = false;
      /* @function breathing-preview.frame — Inputs: animation timestamp in milliseconds. Clamps the initial animation timestamp delta because a scheduled frame timestamp can precede setup completion. Advances isolated second-based effect, samples captured pixels using the shared inverse mapping, and reuses image buffers. Stops when dialog closes; no gameplay side effects. Returns nothing. */
      function frame(now) {
        if (closed) return;
        const state = runtime.update(
          Math.max(0, Math.min(0.1, (now - last) / 1000)),
        );
        last = now;
        for (let y = 0; y < 240; y++)
          for (let x = 0; x < 320; x++) {
            const point = root.FrontierBreathing.sample(
                (x + 0.5) / 320,
                (y + 0.5) / 240,
                320 / 240,
                state,
                sampled,
              ),
              sx = Math.max(0, Math.min(319, Math.floor(point.x * 320))),
              sy = Math.max(0, Math.min(239, Math.floor(point.y * 240))),
              from = (sy * 320 + sx) * 4,
              to = (y * 320 + x) * 4;
            for (let channel = 0; channel < 4; channel++)
              output.data[to + channel] = input.data[from + channel];
          }
        ctx.putImageData(output, 0, 0);
        handle = requestAnimationFrame(frame);
      }
      /* @function breathing-preview.close — Inputs: close event ignored. Cancels pending frame and releases DOM/capture buffers. Idempotent; no runtime settings are committed. Returns nothing. */
      function close() {
        if (closed) return;
        closed = true;
        cancelAnimationFrame(handle);
        runtime.clear();
        dialog.remove();
        capture.width = capture.height = 1;
        canvas.width = canvas.height = 1;
      }
      dialog.addEventListener("close", close);
      dialog.querySelector("button").onclick =
        /* @function breathing-preview.button — Inputs: click ignored. Closes dialog through its normal lifecycle. Returns nothing. */ function () {
          dialog.close();
        };
      dialog.showModal();
      handle = requestAnimationFrame(frame);
      return dialog;
    },
  };
})(window);
