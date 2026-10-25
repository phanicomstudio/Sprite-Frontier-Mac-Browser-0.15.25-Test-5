/* Blob workers support portable file:// packages. Transfer artwork bitmaps,
 * perform pixel reads/shading off-thread, then return a prepared bitmap. The
 * same pure lighting implementation is serialized, avoiding divergent rules. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function normal-worker.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier normal worker. */
(/* @function normal-worker.installReviewed — Installs portable Blob-worker normal-shading preparation. Bitmap work can run off-thread using the shared pure implementation; initializing the service does not start per-frame workers or change source sprites. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function normal-worker.prepare.2 — Handles prepare within normal worker. Inputs: source; binding; signal. Updates: worker; bitmap; canvas width; canvas height. Uses: root frontier sprite lighting validate to string; root frontier sprite lighting prepare to string; url create object url; create image bitmap. Returns: null; a record containing canvas, metrics. */
  /* @function normal-worker.prepare.2Reviewed — Prepares sprite normal lighting off the main thread when browser worker APIs exist. Inputs: source image, binding with PNG data URL and light profile, optional AbortSignal. Returns null when unsupported, otherwise promise of prepared canvas and worker timing metrics in milliseconds. Transfers a source bitmap to a generated worker, decodes/resizes normal image there and processes 32-row batches using shared lighting functions. Rejects abort, bitmap/decode/worker errors; finally removes abort listener, closes source bitmap, terminates worker and revokes script URL. Does not alter source/binding or install the returned image into rendering; caller owns canvas/cache lifetime and fallback. Cancellation is checked after source decode and listened for during worker processing. */ async function prepare(
    source,
    binding,
    signal,
  ) {
    if (
      typeof Worker === "undefined" ||
      typeof OffscreenCanvas === "undefined" ||
      typeof createImageBitmap === "undefined"
    )
      return null;
    const code = `const validate=${root.FrontierSpriteLighting.validate.toString()};const prepare=${root.FrontierSpriteLighting.prepare.toString()};onmessage=async({data:d})=>{let art,normal,normalBitmap;try{const start=performance.now();art=new OffscreenCanvas(d.width,d.height);normal=new OffscreenCanvas(d.width,d.height);const a=art.getContext('2d',{willReadFrequently:true}),n=normal.getContext('2d',{willReadFrequently:true});a.drawImage(d.art,0,0);d.art.close();normalBitmap=await createImageBitmap(await (await fetch(d.png)).blob());n.drawImage(normalBitmap,0,0,d.width,d.height);normalBitmap.close();let maxBatchMs=0,batches=0;for(let y=0;y<d.height;y+=32){const began=performance.now(),rows=Math.min(32,d.height-y),out=prepare(a.getImageData(0,y,d.width,rows),n.getImageData(0,y,d.width,rows),d.light);a.putImageData(new ImageData(out.data,d.width,rows),0,y);batches++;maxBatchMs=Math.max(maxBatchMs,performance.now()-began);}const bitmap=art.transferToImageBitmap();postMessage({bitmap,metrics:{backend:'worker',ms:performance.now()-start,batches,maxBatchMs}},[bitmap]);}catch(error){postMessage({error:error.message});}finally{d.art.close();normalBitmap?.close();if(art)art.width=art.height=1;if(normal)normal.width=normal.height=1;}};`;
    const url = URL.createObjectURL(
      new Blob([code], { type: "text/javascript" }),
    );
    let worker, bitmap, abort;
    try {
      worker = new Worker(url);
      bitmap = await createImageBitmap(source);
      if (signal?.aborted)
        throw new DOMException("Normal preparation cancelled.", "AbortError");
      const result = await new Promise(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function normal-worker.callback.3 — Provides the callback for the enclosing normal worker operation. Inputs: resolve; reject. Updates: abort; worker onmessage; worker onerror. Uses: signal add event listener; worker post message. */
  /* @function normal-worker.callback.3Reviewed — Starts worker processing and wires one preparation promise. Inputs: resolve/reject settlement callbacks. Returns nothing; registers optional abort listener, message/error handlers and transfers the bitmap with dimensions, normal PNG and light settings. Worker/transfer failures reject through Promise executor; enclosing finally owns termination/listener cleanup. Does not mutate authored bindings. */ (
          resolve,
          reject,
        ) => {
          abort =
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function normal-worker.abort.4 — Returns reject using a new domexception. Inputs: no explicit arguments; uses enclosing module state. Uses: reject. Returns: reject using a new domexception. */
  /* @function normal-worker.abort.4Reviewed — Rejects pending normal preparation on signal cancellation. Inputs: none. Returns rejection result with AbortError DOMException; enclosing finally terminates worker and releases resources. Does not directly change cached rendering or retry. */ () =>
              reject(
                new DOMException("Normal preparation cancelled.", "AbortError"),
              );
          signal?.addEventListener("abort", abort, { once: true });
          worker.onmessage =
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function normal-worker.onmessage.5 — Returns e data error selects reject using error using e data error or resolve using e data. Inputs: e. Uses: reject; error; resolve. Returns: e data error selects reject using error using e data error or resolve using e data. */
  /* @function normal-worker.onmessage.5Reviewed — Settles normal preparation from worker response. Inputs: message event with data error or bitmap/metrics. Returns reject result for reported error or resolve result for success. Main function draws/closes successful bitmap; handler does not install render cache or validate arbitrary messages beyond the expected worker protocol. */ (
              e,
            ) => (e.data.error ? reject(Error(e.data.error)) : resolve(e.data));
          worker.onerror =
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function normal-worker.onerror.6 — Returns reject using error using e message or "Normal worker failed.". Inputs: e. Uses: reject; error. Returns: reject using error using e message or "Normal worker failed.". */
  /* @function normal-worker.onerror.6Reviewed — Rejects preparation on worker execution failure. Inputs: worker error event. Returns rejection result using event message or fallback text. Does not retry; enclosing finally releases worker resources. */ (
              e,
            ) => reject(Error(e.message || "Normal worker failed."));
          worker.postMessage(
            {
              art: bitmap,
              width: bitmap.width,
              height: bitmap.height,
              png: binding.png,
              light: binding.light,
            },
            [bitmap],
          );
        },
      );
      const canvas = document.createElement("canvas");
      canvas.width = result.bitmap.width;
      canvas.height = result.bitmap.height;
      canvas.getContext("2d").drawImage(result.bitmap, 0, 0);
      result.bitmap.close();
      return { canvas, metrics: result.metrics };
    } finally {
      if (abort) signal?.removeEventListener("abort", abort);
      bitmap?.close();
      worker?.terminate();
      URL.revokeObjectURL(url);
    }
  }
  root.FrontierNormalWorker = { prepare };
})(window);
