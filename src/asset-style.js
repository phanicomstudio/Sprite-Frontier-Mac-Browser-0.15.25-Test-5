/* Optional raster-to-phosphor/outline preparation happens once per image/style,
 * never per frame. Authored vector art is preferable; edge conversion is a preview
 * treatment. Four cached variants per source limit recoloring memory growth. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function asset-style.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier asset style. */
(/* @function asset-style.installReviewed — Installs cached raster outline/phosphor styling for optional vector presentation. Variants are bounded to four per source and preparation belongs to image/style changes, not every rendered frame. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  const cache = new WeakMap();
  /* Historical contract retained; October 14 reviewed explanation follows. @function asset-style.image.2 — Handles image within asset style. Inputs: source; settings; treatment. Updates: variants; c width; c height; edge; pixels data at i plus 3. Uses: cache get; cache set; variants has; variants get. Returns: source; variants get using key. */
  /* @function assetStyle.imageReviewed — Prepares an optional cached outline or monochrome canvas. Inputs: loaded image/canvas source, validated enabled/monochrome/hex-color settings and treatment string. Returns original source when disabled/original/absent; otherwise a same-size canvas, with outline interior alpha removed and optional RGB recoloring. Pixel coordinates are source pixels. Retains at most four variants per source in a WeakMap and evicts oldest insertion; does not alter source. Expects immutable source content, readable origin-clean pixels and available 2D context; tainted/unloaded images or canvas failures throw to caller. */ function image(
    source,
    settings,
    treatment,
  ) {
    if (!settings?.enabled || treatment === "original" || !treatment)
      return source;
    const key = treatment + "|" + settings.monochrome + "|" + settings.color;
    let variants = cache.get(source);
    if (!variants) {
      variants = new Map();
      cache.set(source, variants);
    }
    if (variants.has(key)) return variants.get(key);
    const c = document.createElement("canvas");
    c.width = source.naturalWidth || source.width;
    c.height = source.naturalHeight || source.height;
    const ctx = c.getContext("2d", {
      willReadFrequently: true,
    });
    ctx.drawImage(source, 0, 0);
    const pixels = ctx.getImageData(0, 0, c.width, c.height),
      original = new Uint8ClampedArray(pixels.data),
      rgb = parseInt(settings.color.slice(1), 16);
    for (let y = 0; y < c.height; y++)
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        if (!original[i + 3]) continue;
        if (treatment === "outline") {
          let edge = false;
          for (const [dx, dy] of [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
          ]) {
            const nx = x + dx,
              ny = y + dy,
              j = (ny * c.width + nx) * 4;
            if (
              nx < 0 ||
              ny < 0 ||
              nx >= c.width ||
              ny >= c.height ||
              original[j + 3] < 32
            ) {
              edge = true;
              break;
            }
          }
          if (!edge) {
            pixels.data[i + 3] = 0;
            continue;
          }
        }
        if (settings.monochrome) {
          pixels.data[i] = (rgb >> 16) & 255;
          pixels.data[i + 1] = (rgb >> 8) & 255;
          pixels.data[i + 2] = rgb & 255;
        }
      }
    ctx.putImageData(pixels, 0, 0);
    if (variants.size >= 4) variants.delete(variants.keys().next().value);
    variants.set(key, c);
    return c;
  }
  root.FrontierAssetStyle = {
    image,
  };
})(window);
