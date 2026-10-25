/* Prepare once per bank revision/profile, asynchronously outside draw traversal.
 * Full-sheet preparation preserves animation crop coordinates. A 64 MB retained
 * pixel budget and 8-million-pixel per-sheet bound prevent unbounded caches. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function normal-render-cache.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier normal render cache. */
(/* @function normal-render-cache.installReviewed — Installs asynchronous normal-shading preparation and revision/profile caches. Full-sheet coordinates preserve animation crops; retained pixels are bounded to 64 MB and individual sheets to eight million pixels. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  let bank = null,
    version = 0,
    bytes = 0,
    prepared = 0,
    lastPreparation = null;
  const cache = new Map(),
    trace = [];
  /* Historical contract retained; October 14 reviewed explanation follows. @function normal-render-cache.record.2 — Handles record within normal render cache. Inputs: profile; message. Uses: trace push; trace shift. */
  /* @function normalRenderCache.reviewedrecord_2 — Adds bounded preparation diagnostic. Inputs: profile string and message. Returns undefined; appends trace row and retains newest16. No per-frame console logging or authored mutation. */ function record(
    profile,
    message,
  ) {
    trace.push({ profile, message });
    if (trace.length > 16) trace.shift();
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function normal-render-cache.clear.3 — Handles clear within normal render cache. Inputs: next. Updates: item canvas width; item canvas height; bytes; bank. Uses: cache values; item cancel abort; root frontier pixi release image; cache clear. */
  /* @function normalRenderCache.reviewedclear_3 — Cancels/reclaims all prepared normal-sheet ownership for bank change. Inputs: next bank identity. Returns undefined; increments version, aborts jobs, releases known GPU images, shrinks retained canvases to1x1, clears cache/reserved bytes and stores next. Lifetime prepared count/trace remain. Resource-release exceptions propagate; this helper has no finally rollback. */ function clear(
    next,
  ) {
    version++;
    for (const item of cache.values()) {
      item.cancel?.abort();
      if (item.canvas) {
        root.FrontierPixi?.releaseImage(item.canvas);
        item.canvas.width = item.canvas.height = 1;
      }
    }
    cache.clear();
    bytes = 0;
    bank = next;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function normal-render-cache.image.4 — Handles image within normal render cache. Inputs: source; profile; next. Updates: item canvas width; item canvas height; bytes; item reserved; item. Uses: clear; next entries find; cache get; item cancel abort. Returns: source; item canvas or source. */
  /* @function normalRenderCache.reviewedimage_4 — Returns prepared normal-shaded sprite sheet or starts asynchronous preparation. Inputs: loaded source Image/canvas, profile ID and validated bank next. Returns source immediately while pending/missing/overbudget/failed, otherwise cached full-sheet canvas. Bank identity change clears ownership; source replacement cancels/releases prior item. Reserves width*height*4 bytes, bounds sides8192/pixels8million/retained64MiB; transient decode/canvas/driver memory not fully covered by this accounting. One failed same-source item does not retry until source/bank changes. Synchronous setup errors propagate; async failures are recorded and reclaim reservation. */ function image(
    source,
    profile,
    next,
  ) {
    if (bank !== next) clear(next);
    const binding = next?.entries.find(
      /* Historical contract retained; October 14 reviewed explanation follows. @function normal-render-cache.callback.5 — Returns e profile equals profile. Inputs: e. Returns: e profile equals profile. */
  /* @function normalRenderCache.reviewedcallback_5 — Finds profile-specific normal binding. Inputs: e and captured profile. Returns identity match; no mutation. Bank validated upstream. */ (
        e,
      ) => e.profile === profile,
    );
    if (!binding) return source;
    let item = cache.get(profile);
    if (item?.source === source) return item.canvas || source; // Replacing a source within the same bank must cancel its job and release its reservation.
    if (item) {
      item.cancel.abort();
      if (item.canvas) {
        root.FrontierPixi?.releaseImage(item.canvas);
        item.canvas.width = item.canvas.height = 1;
      }
      bytes -= item.reserved || 0;
      item.reserved = 0;
    }
    const w = source.naturalWidth || source.width,
      h = source.naturalHeight || source.height,
      size = w * h * 4;
    item = { source, canvas: null, cancel: new AbortController() };
    cache.set(profile, item);
    if (
      !w ||
      !h ||
      w > 8192 ||
      h > 8192 ||
      w * h > 8000000 ||
      bytes + size > 64 * 1024 * 1024
    ) {
      record(profile, "Sprite lighting preparation exceeds the pixel budget.");
      return source;
    }
    bytes += size;
    item.reserved = size;
    const ownVersion = version,
      isCurrent =
        /* Historical contract retained; October 14 reviewed explanation follows. @function normal-render-cache.isCurrent.6 — Returns own version equals version and cache get using profile equals item and the inverse of item cancel signal aborted. Inputs: no explicit arguments; uses enclosing module state. Uses: cache get. Returns: own version equals version and cache get using profile equals item and the inverse of item cancel signal aborted. */
  /* @function normalRenderCache.reviewedisCurrent_6 — Tests async preparation ownership. Inputs: none. Returns true only matching version/cache item and nonaborted signal. No mutation; stale results must be discarded. */ () =>
          ownVersion === version &&
          cache.get(profile) === item &&
          !item.cancel.signal.aborted;
    (/* Historical contract retained; October 14 reviewed explanation follows. @function normal-render-cache.callback.7 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Updates: offthread canvas width; offthread canvas height; item canvas; last preparation; normal src. Uses: performance now; root frontier normal worker prepare; is current; record. Returns: without a result; without a result. */
  /* @function normalRenderCache.reviewedcallback_7 — Prepares one full sprite sheet asynchronously. Inputs: none; captures source/binding/reservation/version. Returns promise settling without gameplay result. Prefers worker; otherwise decodes normal and processes at most8 rows per yielded task, preserving source crop coordinates/alpha through lighting service. Accepts only current results, records timing/batches and lifetime count. Current errors release reservation/log diagnostic; stale jobs never adopt. Finally shrinks temporary canvases; retained result stays owned by cache. No authored image mutation; resource/process exceptions are caught here. */ async () => {
      let c = null,
        q = null;
      const started = performance.now();
      let batches = 0,
        maxBatchMs = 0;
      try {
        const offthread = await root.FrontierNormalWorker?.prepare(
          source,
          binding,
          item.cancel.signal,
        );
        if (offthread) {
          if (!isCurrent()) {
            offthread.canvas.width = offthread.canvas.height = 1;
            return;
          }
          item.canvas = offthread.canvas;
          prepared++;
          lastPreparation = { profile, pixels: w * h, ...offthread.metrics };
          record(profile, "Lighting prepared off-thread.");
          return;
        }
        const normal = new Image();
        normal.src = binding.png;
        await normal.decode();
        if (!isCurrent()) return;
        c = document.createElement("canvas");
        q = document.createElement("canvas");
        c.width = q.width = w;
        c.height = q.height = h;
        const art = c.getContext("2d", { willReadFrequently: true }),
          n = q.getContext("2d", { willReadFrequently: true });
        art.drawImage(source, 0, 0, w, h);
        n.drawImage(normal, 0, 0, w, h); // At most 8 rows per task; keep transient pixel arrays small and let input/render run between batches.
        for (let y = 0; y < h; y += 8) {
          if (!isCurrent()) return;
          const batchStart = performance.now(),
            rows = Math.min(8, h - y),
            result = root.FrontierSpriteLighting.prepare(
              art.getImageData(0, y, w, rows),
              n.getImageData(0, y, w, rows),
              binding.light,
            );
          art.putImageData(new ImageData(result.data, w, rows), 0, y);
          batches++;
          maxBatchMs = Math.max(maxBatchMs, performance.now() - batchStart);
          await new Promise(
            /* Historical contract retained; October 14 reviewed explanation follows. @function normal-render-cache.callback.8 — Returns set timeout using resolve, 0. Inputs: resolve. Uses: set timeout. Returns: set timeout using resolve, 0. */
  /* @function normalRenderCache.reviewedcallback_8 — Yields between fallback shading batches. Inputs: promise resolve. Returns timer handle from setTimeout(resolve,0); schedules completion on later task, no source mutation. Timing is scheduler delay rather than guaranteed zero elapsed. */ (
              resolve,
            ) => setTimeout(resolve, 0),
          );
        }
        if (isCurrent()) {
          item.canvas = c;
          c = null;
          prepared++;
          lastPreparation = {
            profile,
            pixels: w * h,
            batches,
            ms: performance.now() - started,
            maxBatchMs,
          };
          record(profile, "Lighting prepared.");
        }
      } catch (error) {
        if (isCurrent()) {
          bytes -= item.reserved || 0;
          item.reserved = 0;
          record(profile, error.message);
        }
      } finally {
        for (const canvas of [c, q])
          if (canvas) canvas.width = canvas.height = 1;
      }
    })();
    return source;
  }
  root.FrontierNormalRenderCache = {
    image,
    clear:
      /* Historical contract retained; October 14 reviewed explanation follows. @function normal-render-cache.clear.9 — Returns clear using null. Inputs: no explicit arguments; uses enclosing module state. Uses: clear. Returns: clear using null. */
  /* @function normalRenderCache.reviewedclear_9 — Clears public normal cache. Inputs: none. Returns internal clear result(undefined); aborts/releases prepared sheets and resets bank identity, preserving lifetime diagnostics. Release errors propagate. */ () =>
        clear(null),
    debug:
      /* Historical contract retained; October 14 reviewed explanation follows. @function normal-render-cache.debug.10 — Returns a record containing bytes, profiles, prepared, lastPreparation, trace. Inputs: no explicit arguments; uses enclosing module state. Uses: trace map. Returns: a record containing bytes, profiles, prepared, lastPreparation, trace. */
  /* @function normalRenderCache.revieweddebug_10 — Reports preparation ownership and bounded history. Inputs: none. Returns current reserved bytes/profile count, lifetime prepared count, copied last metrics and detached trace rows. Byte count is RGBA reservation, not total CPU/GPU memory. No mutation or forcing preparation. */ () => ({
        bytes,
        profiles: cache.size,
        prepared,
        lastPreparation: lastPreparation ? { ...lastPreparation } : null,
        trace: trace.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function normal-render-cache.callback.11 — Returns a record containing copied fields. Inputs: e. Returns: a record containing copied fields. */
  /* @function normalRenderCache.reviewedcallback_11 — Detaches one diagnostic trace row. Inputs: e. Returns shallow profile/message record copy; no mutation. */ (
            e,
          ) => ({ ...e }),
        ),
      }),
  };
})(window);
