/* Bounded, event-driven normal authoring. No pixel processing in the game loop.
 * Height is editable data; silhouette generation is only a starting approximation. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function normal-workbench.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier normal workbench. */
(/* @function normal-workbench.installReviewed — Installs event-driven normal-map authoring. Editable height data and approximate silhouette generation are distinct; expensive pixel processing stays outside the gameplay frame loop. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  /* @function normal-workbench.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: api. Updates: box inner html; panel id; panel inner html; panel style font; $ using "normalSource" onchange. Uses: document create element; document get element by id using "editor" append; document get element by id; document body append. */ function create(
    api,
  ) {
    const box = document.createElement("fieldset");
    box.innerHTML =
      '<legend>Normal-map workbench</legend><button id="openNormals">Open sprite lighting workbench</button><p>Generate local Sprite Fusion normals, preview lighting, and retain manual height correction tools. Export PNG alongside your artwork; import it on a selected furniture sprite or room.</p>';
    document.getElementById("editor").append(box);
    const panel = document.createElement("dialog");
    panel.id = "normalWorkbench";
    panel.innerHTML = `<h3>Sprite lighting workbench</h3><p>Sprite Fusion runs locally. It estimates relief from silhouette and painted shading; use your original render normal pass when physically exact normals are needed. Native pixels and sheet frames are preserved. Up to 4,194,304 pixels including processing padding.</p><label>Sprite profile<select id="normalProfile"></select></label><button id="normalLoadProfile">Load this sprite artwork</button><button id="normalApply">Apply lighting to this sprite on current map</button><button id="normalRemove">Remove this sprite lighting from current map</button><label>Artwork<input id="normalSource" type="file" accept="image/png,image/webp,image/jpeg"></label><label>View<select id="normalView"><option value="lit">Lighting preview</option><option value="normal">Normal map</option><option value="height">Height</option></select></label><canvas id="normalCanvas" width="512" height="320"></canvas><label>Brush<select id="normalBrush"><option value="raise">Raise</option><option value="lower">Recess</option><option value="smooth">Smooth</option><option value="light">Move preview light</option></select></label><label>Brush size<input id="normalSize" type="range" min="2" max="70" value="20"></label><label>Shape strength<input id="normalStrength" type="range" min="0" max="12" step="0.1" value="4"></label><button id="normalGenerate">Generate Sprite Fusion normals</button><button id="normalFlat">Flat surface</button><button id="normalUndo">Undo stroke</button><button id="normalExport">Export normal PNG</button><button id="heightExport">Export height PNG</button><label>Import normal PNG<input id="normalImport" type="file" accept="image/png"></label><p id="normalStatus" role="status"></p><label>Import height PNG<input id="heightImport" type="file" accept="image/png"></label><button id="closeNormals">Return to editor</button>`;
    document.body.append(panel);
    const $ =
        /* @function normal-workbench.$.3 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id. */ (
          id,
        ) => document.getElementById(id),
      canvas = $("normalCanvas"),
      ctx = canvas.getContext("2d");
    let source = null,
      height = null,
      normals = null,
      importedNormals = null,
      undo = [],
      painting = false,
      queued = false,
      light = [-0.5, 0.5, 1],
      loadedProfile = null, generationJob = null, normalReady = false;
    panel.style.font = "18px Arial, sans-serif";
    // October 22: upstream generation settings are distinct from the retained
    // manual-height gradient strength. Zero frame sizes mean one whole image.
    const generationSettings=document.createElement("fieldset");
    generationSettings.id="spriteFusionSettings";
    generationSettings.innerHTML='<legend>Sprite Fusion generation</legend><p>OpenGL normals for Sprite Frontier. Registered sprite profiles fill frame dimensions automatically.</p><label>Normal strength<input id="fusionStrength" type="number" min="0" max="8" step="0.1" value="1.5"></label><label>Shading detail<input id="fusionDetail" type="number" min="0" max="8" step="0.1" value="6"></label><label>Detail smoothing (pixels)<input id="fusionSmoothing" type="number" min="0.6" max="8" step="0.1" value="0.6"></label><label>Silhouette volume<input id="fusionVolume" type="number" min="0" max="8" step="0.05" value="1.15"></label><label>Frame width (pixels; 0 = whole image)<input id="fusionFrameWidth" type="number" min="0" max="4096" step="1" value="0"></label><label>Frame height (pixels; 0 = whole image)<input id="fusionFrameHeight" type="number" min="0" max="4096" step="1" value="0"></label>';
    $("normalGenerate").before(generationSettings);
    const cancelGeneration=document.createElement("button");
    cancelGeneration.id="fusionCancel";cancelGeneration.type="button";cancelGeneration.textContent="Cancel generation";cancelGeneration.hidden=true;
    $("normalGenerate").after(cancelGeneration);
    cancelGeneration.onclick=/* @function normalWorkbench.cancelFusion — Inputs: ignored click. Returns nothing; cancels active worker, retaining previous complete map. Owner finally restores controls. */ function(){generationJob?.abort();};
    /* @function normalWorkbench.generationBusy — Inputs: active flag. Returns nothing; prevents competing edits while a worker owns current source, with close/cancel still available. Restores controls after settlement; no authored mutation. */
    function generationBusy(active) {
      for(const node of panel.querySelectorAll("input,select,button")) if(!["fusionCancel","closeNormals"].includes(node.id)) node.disabled=active;
      cancelGeneration.hidden=!active;
    }
    /* @function normalWorkbench.generateFusion — Inputs: none; reads current RGBA and settings. Returns Promise; runs exact pinned WASM off-thread, decodes and adopts only a complete current result, preserving source alpha and frame coordinates. Failure/cancellation retains prior complete normals; never silently invokes legacy silhouette generation. */
    async function generate() {
      if(!source || generationJob) return;
      const controller=new AbortController(); generationJob=controller; generationBusy(true);
      $("normalStatus").textContent="Generating Sprite Fusion normals locally…";
      try {
        const options={strength:Number($("fusionStrength").value),detail:Number($("fusionDetail").value),smoothing:Number($("fusionSmoothing").value),volume:Number($("fusionVolume").value)};
        const fw=Number($("fusionFrameWidth").value),fh=Number($("fusionFrameHeight").value);
        if(fw || fh) { if(!Number.isInteger(fw)||!Number.isInteger(fh)||fw<1||fh<1) throw Error("Supply both positive integer frame dimensions, or leave both at zero."); options.frame_width=fw;options.frame_height=fh; }
        const result=await root.FrontierSpriteFusion.generate(source,options,controller.signal);
        const image=await createImageBitmap(new Blob([result.normal],{type:"image/png"}));
        try {
          if(controller.signal.aborted) throw new DOMException("Generation cancelled.","AbortError");
          if(image.width!==source.width || image.height!==source.height) throw Error("Generated normal dimensions do not match the artwork.");
          const temporary=document.createElement("canvas");temporary.width=image.width;temporary.height=image.height;
          const q=temporary.getContext("2d");q.drawImage(image,0,0);const candidate=q.getImageData(0,0,image.width,image.height);
          for(let i=3;i<candidate.data.length;i+=4) candidate.data[i]=source.data[i];
          remember(); importedNormals=candidate; normalReady=true; rebuild();
          $("normalStatus").textContent="Sprite Fusion normals ready: "+image.width+" × "+image.height+" native pixels. "+(fw ? "Frames isolated at "+fw+" × "+fh+". " : "")+"Preview, Apply or Export.";
        } finally { image.close(); }
      } catch(error) { $("normalStatus").textContent=error.name==="AbortError" ? "Generation cancelled; previous complete normals retained." : error.message; }
      finally { generationJob=null; generationBusy(false); }
    }
    /* @function normal-workbench.rebuild.4 — Handles rebuild within normal workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: normals; normals data at o plus c; out data at o plus c; out data at o plus 3; normals data at o plus 3. Uses: ctx create image data; number; $; light map. Returns: without a result. */ function rebuild() {
      if (!source) return;
      // October 22: view changes must not invent flat normals after a failed job.
      if (!normalReady) { ctx.putImageData(source,0,0); return; }
      // October 22: generated/imported normals are already authoritative. Avoid
      // allocating a height-gradient closure for every native sheet pixel just
      // to overwrite that field afterwards. Manual Height view retains its path.
      if(importedNormals && $("normalView").value!=="height") {
        normals=importedNormals;
        if($("normalView").value==="normal") ctx.putImageData(normals,0,0);
        else { const lit=FrontierSpriteLighting.prepare(source,normals,{ambient:0.28,strength:0.9,x:light[0],y:light[1],z:light[2]});ctx.putImageData(new ImageData(lit.data,source.width,source.height),0,0); }
        return;
      }
      const w = canvas.width,
        h = canvas.height,
        n = source.data,
        out = ctx.createImageData(w, h),
        strength = Number($("normalStrength").value);
      normals = ctx.createImageData(w, h);
      let lm = Math.hypot(...light);
      const l = light.map(
        /* @function normal-workbench.callback.5 — Returns v divided by lm. Inputs: v. Returns: v divided by lm. */ (
          v,
        ) => v / lm,
      );
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          const i = y * w + x,
            o = i * 4,
            at =
              /* @function normal-workbench.at.6 — Returns height at math max using 0, math min using h minus 1, b multiplied by w plus math max using 0, math min using w minus 1, a. Inputs: a; b. Returns: height at math max using 0, math min using h minus 1, b multiplied by w plus math max using 0, math min using w minus 1, a. */ (
                a,
                b,
              ) =>
                height[
                  Math.max(0, Math.min(h - 1, b)) * w +
                    Math.max(0, Math.min(w - 1, a))
                ],
            nx = -(at(x + 1, y) - at(x - 1, y)) * strength,
            ny = (at(x, y + 1) - at(x, y - 1)) * strength,
            m = Math.hypot(nx, ny, 1),
            v = [nx / m, ny / m, 1 / m],
            shade =
              0.28 + 0.9 * Math.max(0, v[0] * l[0] + v[1] * l[1] + v[2] * l[2]);
          for (let c = 0; c < 3; c++) {
            normals.data[o + c] = Math.round((v[c] * 0.5 + 0.5) * 255);
            out.data[o + c] =
              $("normalView").value === "normal"
                ? normals.data[o + c]
                : $("normalView").value === "height"
                  ? height[i] * 255
                  : Math.min(255, n[o + c] * shade);
          }
          out.data[o + 3] = normals.data[o + 3] = n[o + 3];
        }
      if (importedNormals) {
        normals = importedNormals;
        for (let i = 0; i < out.data.length; i += 4)
          if ($("normalView").value === "normal") {
            out.data[i] = normals.data[i];
            out.data[i + 1] = normals.data[i + 1];
            out.data[i + 2] = normals.data[i + 2];
          }
      }
      if ($("normalView").value === "lit")
        out.data.set(
          FrontierSpriteLighting.prepare(source, normals, {
            ambient: 0.28,
            strength: 0.9,
            x: light[0],
            y: light[1],
            z: light[2],
          }).data,
        );
      ctx.putImageData(out, 0, 0);
    }
    /* @function normal-workbench.schedule.7 — Handles schedule within normal workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: queued. Uses: request animation frame. */ function schedule() {
      if (!queued) {
        queued = true;
        requestAnimationFrame(
          /* @function normal-workbench.callback.8 — Provides the callback for request animation frame. Inputs: no explicit arguments; uses enclosing module state. Updates: queued. Uses: rebuild. */ () => {
            queued = false;
            rebuild();
          },
        );
      }
    }
    /* @function normal-workbench.remember.9 — Retains a bounded list of sufficiently separated safe player positions. Inputs: no explicit arguments; uses enclosing module state. Uses: undo push; height slice; undo shift. */ function remember() {
      if (height) {
        // October 22: retain generated/imported normals as well as manual
        // height, with an approximate 32 MiB history budget for native sheets.
        undo.push({ready:normalReady,height:height.slice(),normal:importedNormals ? new ImageData(new Uint8ClampedArray(importedNormals.data),importedNormals.width,importedNormals.height) : null});
        const bytes=height.byteLength+(importedNormals?.data.byteLength||0);
        while(undo.length>Math.max(1,Math.min(12,Math.floor(32*1024*1024/Math.max(1,bytes))))) undo.shift();
      }
    }
    /* @function normal-workbench.generate.10 — Handles generate within normal workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: imported normals; d at i; height at i. Uses: remember; rebuild. Returns: without a result. */ function generateLegacySilhouette() {
      // Superseded October 22, 2026. Historical implementation retained for
      // review; no current UI action or artwork load calls this generator.
      if (!source) return;
      importedNormals = null;
      remember();
      const w = canvas.width,
        h = canvas.height,
        d = new Float32Array(w * h),
        n = source.data;
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          d[i] =
            n[i * 4 + 3] < 32 ||
            x === 0 ||
            y === 0 ||
            x === w - 1 ||
            y === h - 1
              ? 0
              : 1e6;
        }
      for (let y = 1; y < h; y++)
        for (let x = 1; x < w; x++) {
          const i = y * w + x;
          d[i] = Math.min(
            d[i],
            d[i - 1] + 1,
            d[i - w] + 1,
            d[i - w - 1] + 1.414,
          );
        }
      for (let y = h - 2; y >= 0; y--)
        for (let x = w - 2; x >= 0; x--) {
          const i = y * w + x;
          d[i] = Math.min(
            d[i],
            d[i + 1] + 1,
            d[i + w] + 1,
            d[i + w + 1] + 1.414,
          );
        }
      const radius = Math.max(8, Math.min(w, h) * 0.12);
      for (let i = 0; i < d.length; i++)
        height[i] = Math.sqrt(Math.min(1, d[i] / radius));
      rebuild();
    }
    /* @function normal-workbench.load.11 — Handles load within normal workbench. Inputs: file. Uses: error; url create object url; url revoke object url. Returns: await. */ async function load(
      file,
    ) {
      if (!file || file.size > 8000000)
        throw Error("Choose an image under 8 MB.");
      const url = URL.createObjectURL(file);
      try {
        return await new Promise(
          /* @function normal-workbench.callback.12 — Provides the callback for the enclosing normal workbench operation. Inputs: resolve; reject. Updates: im onload; im onerror; im src. */ (
            resolve,
            reject,
          ) => {
            const im = new Image();
            im.onload =
              /* @function normal-workbench.onload.13 — Processes a resource after it finishes loading. Inputs: no explicit arguments; uses enclosing module state. Uses: resolve. Returns: resolve using im. */ () =>
                resolve(im);
            im.onerror =
              /* @function normal-workbench.onerror.14 — Returns reject using error using "Cannot decode image". Inputs: no explicit arguments; uses enclosing module state. Uses: reject; error. Returns: reject using error using "Cannot decode image". */ () =>
                reject(Error("Cannot decode image"));
            im.src = url;
          },
        );
      } finally {
        URL.revokeObjectURL(url);
      }
    }
    $("normalSource").onchange =
      /* @function normal-workbench.onchange.15 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: loaded profile; canvas width; canvas height; source; height. Uses: load; $; ctx clear rect; ctx draw image. */ async () => {
        loadedProfile = null, generationJob = null, normalReady = false;
        try {
          const im = await load($("normalSource").files[0]);
          if(im.width>4096 || im.height>4096 || im.width*im.height>4194304) throw Error("Artwork exceeds the native-pixel generation budget.");
          const s = 1;
          canvas.width = Math.max(1, Math.round(im.width * s));
          canvas.height = Math.max(1, Math.round(im.height * s));
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
          source = ctx.getImageData(0, 0, canvas.width, canvas.height);
          height = new Float32Array(canvas.width * canvas.height);
          undo = []; importedNormals=null; loadedProfile=null; normalReady=false;
          $("fusionFrameWidth").value=0;$("fusionFrameHeight").value=0;
          await generate();
        } catch (e) {
          alert(e.message);
        }
      };
    $("normalImport").onchange =
      /* @function normal-workbench.onchange.16 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: c width; c height; i; candidate data at i; imported normals. Uses: error; load; $; document create element. */ async () => {
        try {
          if (!source) throw Error("Load artwork first.");
          const im = await load($("normalImport").files[0]);
          if (im.width !== canvas.width || im.height !== canvas.height)
            throw Error(
              "Normal dimensions must match the working artwork: " +
                canvas.width +
                " × " +
                canvas.height +
                ".",
            );
          const c = document.createElement("canvas");
          c.width = im.width;
          c.height = im.height;
          const q = c.getContext("2d");
          q.drawImage(im, 0, 0);
          const candidate = q.getImageData(0, 0, c.width, c.height);
          FrontierSpriteLighting.prepare(source, candidate);
          for (let i = 3; i < candidate.data.length; i += 4)
            candidate.data[i] = source.data[i];
          importedNormals = candidate;
          normalReady=true;
          rebuild();
          $("normalStatus").textContent =
            "Imported normal map ready for preview and export. Height editing regenerates normals.";
        } catch (e) {
          $("normalStatus").textContent = e.message;
        } finally {
          $("normalImport").value = "";
        }
      };
    $("heightImport").onchange =
      /* @function normal-workbench.onchange.17 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: c width; c height; imported normals; height at i. Uses: error; load; $; document create element. */ async () => {
        try {
          if (!source) throw Error("Load artwork first.");
          const im = await load($("heightImport").files[0]),
            c = document.createElement("canvas");
          c.width = canvas.width;
          c.height = canvas.height;
          const q = c.getContext("2d");
          q.drawImage(im, 0, 0, c.width, c.height);
          const p = q.getImageData(0, 0, c.width, c.height).data;
          remember();
          importedNormals = null;
          for (let i = 0; i < height.length; i++) height[i] = p[i * 4] / 255;
          normalReady=true;
          rebuild();
        } catch (e) {
          alert(e.message);
        }
      };
    /* @function normal-workbench.paint.18 — Handles paint within normal workbench. Inputs: ev. Updates: light; imported normals; height at k. Uses: canvas get bounding client rect; $; schedule; number. Returns: without a result; without a result. */ function paint(
      ev,
    ) {
      if (!height || generationJob) return;
      const b = canvas.getBoundingClientRect(),
        x = ((ev.clientX - b.left) * canvas.width) / b.width,
        y = ((ev.clientY - b.top) * canvas.height) / b.height;
      if ($("normalBrush").value === "light") {
        light = [
          (x / canvas.width - 0.5) * 2,
          (0.5 - y / canvas.height) * 2,
          1,
        ];
        schedule();
        return;
      }
      importedNormals = null; normalReady=true;
      const r = Number($("normalSize").value),
        w = canvas.width,
        h = canvas.height;
      for (let j = Math.max(0, Math.floor(y - r)); j < Math.min(h, y + r); j++)
        for (
          let i = Math.max(0, Math.floor(x - r));
          i < Math.min(w, x + r);
          i++
        ) {
          const weight = Math.max(0, 1 - Math.hypot(i - x, j - y) / r),
            k = j * w + i;
          if (!source.data[k * 4 + 3]) continue;
          if ($("normalBrush").value === "smooth") {
            const sum =
              height[k] +
              height[Math.max(0, k - 1)] +
              height[Math.min(height.length - 1, k + 1)] +
              height[Math.max(0, k - w)] +
              height[Math.min(height.length - 1, k + w)];
            height[k] += (sum / 5 - height[k]) * weight * 0.4;
          } else
            height[k] = Math.max(
              0,
              Math.min(
                1,
                height[k] +
                  weight *
                    ($("normalBrush").value === "raise" ? 0.035 : -0.035),
              ),
            );
        }
      schedule();
    }
    canvas.onpointerdown =
      /* @function normal-workbench.onpointerdown.19 — Begins the pointer-driven interaction. Inputs: e. Updates: painting. Uses: remember; canvas set pointer capture; paint. Returns: without a result. */ (
        e,
      ) => {
        if (!source) return;
        remember();
        painting = true;
        canvas.setPointerCapture(e.pointerId);
        paint(e);
      };
    canvas.onpointermove =
      /* @function normal-workbench.onpointermove.20 — Updates the active pointer-driven interaction. Inputs: e. Uses: paint. */ (
        e,
      ) => {
        if (painting) paint(e);
      };
    canvas.onpointerup = canvas.onpointercancel =
      /* @function normal-workbench.onpointercancel.21 — Cancels the active pointer-driven interaction. Inputs: no explicit arguments; uses enclosing module state. Updates: painting. Returns: assignment. */ () =>
        (painting = false);
    $("normalGenerate").onclick = generate;
    $("normalFlat").onclick =
      /* @function normal-workbench.onclick.22 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: imported normals. Uses: remember; height fill; rebuild. */ () => {
        if (height) {
          remember();
          importedNormals = null;
          height.fill(0.5);normalReady=true;
          rebuild();
        }
      };
    $("normalUndo").onclick =
      /* @function normal-workbench.onclick.23 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: imported normals; height. Uses: undo pop; rebuild. */ () => {
        if (undo.length) {
          const previous=undo.pop();
          importedNormals = previous.normal;
          height = previous.height;normalReady=previous.ready;
          rebuild();
        }
      };
    for (const id of ["normalStrength", "normalView"]) $(id).oninput = schedule;
    /* @function normal-workbench.download.24 — Handles download within normal workbench. Inputs: kind. Updates: c width; c height; p data at i multiplied by 4; p data at i multiplied by 4 plus 1; p data at i multiplied by 4 plus 2. Uses: rebuild; document create element; c get context; q put image data. Returns: without a result. */ function download(
      kind,
    ) {
      if (!normals) return;
      rebuild();
      const c = document.createElement("canvas");
      c.width = canvas.width;
      c.height = canvas.height;
      const q = c.getContext("2d");
      if (kind === "normal") q.putImageData(normals, 0, 0);
      else {
        const p = q.createImageData(c.width, c.height);
        for (let i = 0; i < height.length; i++) {
          p.data[i * 4] =
            p.data[i * 4 + 1] =
            p.data[i * 4 + 2] =
              height[i] * 255;
          p.data[i * 4 + 3] = source.data[i * 4 + 3];
        }
        q.putImageData(p, 0, 0);
      }
      c.toBlob(
        /* @function normal-workbench.callback.25 — Provides the callback for c to blob. Inputs: blob. Updates: a href; a download. Uses: url create object url; document create element; a click; set timeout. */ (
          blob,
        ) => {
          const u = URL.createObjectURL(blob),
            a = document.createElement("a");
          a.href = u;
          a.download = kind + ".png";
          a.click();
          setTimeout(
            /* @function normal-workbench.callback.26 — Returns url revoke object url using u. Inputs: no explicit arguments; uses enclosing module state. Uses: url revoke object url. Returns: url revoke object url using u. */ () =>
              URL.revokeObjectURL(u),
            1000,
          );
        },
      );
    }
    $("normalLoadProfile").onclick =
      /* @function normal-workbench.onclick.27 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: canvas width; canvas height; source; height; undo. Uses: $; frontier sprites sheet; error; im decode. */ async () => {
        try {
          const id = $("normalProfile").value,
            sheet = FrontierSprites.sheet({ spriteProfile: id });
          if (!sheet) throw Error("Choose an available sprite profile.");
          const im = sheet.image;
          if (!im.complete) await im.decode();
          if (!im.naturalWidth) throw Error("Sprite artwork is unavailable.");
          if(im.naturalWidth>4096 || im.naturalHeight>4096 || im.naturalWidth*im.naturalHeight>4194304) throw Error("This sheet exceeds the native-pixel generation budget. Use a smaller source sheet; no automatic resampling is applied.");
          const scale = 1;
          canvas.width = Math.max(1, Math.round(im.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(im.naturalHeight * scale));
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
          source = ctx.getImageData(0, 0, canvas.width, canvas.height);
          height = new Float32Array(canvas.width * canvas.height);
          undo = [];
          loadedProfile = id; importedNormals=null; normalReady=false;
          const profile=FrontierMuzzle.profiles.get(id);
          $("fusionFrameWidth").value=profile?.frameWidth || 0;
          $("fusionFrameHeight").value=profile?.frameHeight || 0;
          await generate();
          // Generation owns success/error status; do not overwrite failures
          // with a generic loaded message after the worker settles.
        } catch (e) {
          $("normalStatus").textContent = e.message;
        }
      };
    $("normalApply").onclick =
      /* @function normal-workbench.onclick.28 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: c width; c height; $ using "normalStatus" text content. Uses: $; error; rebuild; document create element. */ () => {
        try {
          if (!api || !source || loadedProfile !== $("normalProfile").value)
            throw Error("Load this sprite artwork before applying.");
          if(!normalReady || generationJob) throw Error("Generate or import a complete normal map before applying.");
          rebuild();
          const c = document.createElement("canvas");
          c.width = canvas.width;
          c.height = canvas.height;
          c.getContext("2d").putImageData(normals, 0, 0);
          const bank = FrontierNormalBindings.validate(
              api.world().spriteNormals,
            ),
            prior = bank.entries.find(
              /* @function normal-workbench.callback.29 — Returns e profile equals loaded profile. Inputs: e. Returns: e profile equals loaded profile. */ (
                e,
              ) => e.profile === loadedProfile,
            ),
            entry = {
              profile: loadedProfile,
              png: c.toDataURL("image/png"),
              width: c.width,
              height: c.height,
              light: {
                ambient: 0.28,
                strength: 0.9,
                x: light[0],
                y: light[1],
                z: light[2],
              },
              ...(prior?.extensions === undefined
                ? {}
                : { extensions: prior.extensions }),
            };
          const next = FrontierNormalBindings.validate({
            ...bank,
            entries: [
              ...bank.entries.filter(
                /* @function normal-workbench.callback.30 — Returns e profile does not equal loaded profile. Inputs: e. Returns: e profile does not equal loaded profile. */ (
                  e,
                ) => e.profile !== loadedProfile,
              ),
              entry,
            ],
          });
          api.mutate(
            /* @function normal-workbench.callback.31 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: api world using sprite normals. Uses: api world. */ () => {
              api.world().spriteNormals = next;
            },
            /* @function normal-workbench.callback.32 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "normalStatus" text content. Uses: $. */ () => {
              $("normalStatus").textContent =
                "Applied to " + loadedProfile + " on this map.";
            },
          );
        } catch (e) {
          $("normalStatus").textContent = e.message;
        }
      };
    $("normalRemove").onclick =
      /* @function normal-workbench.onclick.33 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "normalStatus" text content. Uses: error; $; frontier normal bindings validate; api world. */ () => {
        try {
          if (!api) throw Error("Map authoring is unavailable.");
          const id = $("normalProfile").value,
            bank = FrontierNormalBindings.validate(api.world().spriteNormals);
          api.mutate(
            /* @function normal-workbench.callback.34 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: api world using sprite normals. Uses: api world; bank entries filter. */ () => {
              api.world().spriteNormals = {
                ...bank,
                entries: bank.entries.filter(
                  /* @function normal-workbench.callback.35 — Returns e profile does not equal id. Inputs: e. Returns: e profile does not equal id. */ (
                    e,
                  ) => e.profile !== id,
                ),
              };
            },
            /* @function normal-workbench.callback.36 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "normalStatus" text content. Uses: $. */ () => {
              $("normalStatus").textContent =
                "Removed lighting for " + id + ".";
            },
          );
        } catch (e) {
          $("normalStatus").textContent = e.message;
        }
      };
    $("normalExport").onclick =
      /* @function normal-workbench.onclick.37 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: download. Returns: download using "normal". */ () =>
        download("normal");
    $("heightExport").onclick =
      /* @function normal-workbench.onclick.38 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: download. Returns: download using "height". */ () =>
        download("height");
    $("openNormals").onclick =
      /* @function normal-workbench.onclick.39 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: $; picker replace children; a list of spread element map; frontier muzzle profiles keys. */ () => {
        const picker = $("normalProfile");
        picker.replaceChildren(
          ...[...FrontierMuzzle.profiles.keys()].map(
            /* @function normal-workbench.callback.40 — Returns a new option. Inputs: id. Returns: a new option. */ (
              id,
            ) => new Option(id, id),
          ),
        );
        panel.showModal();
      };
    panel.addEventListener("cancel", /* @function normalWorkbench.cancelOnEscape — Inputs: dialog cancel event ignored. Returns nothing; aborts generation before the native dialog closes. No authored changes. */ function(){generationJob?.abort();});
    $("closeNormals").onclick =
      /* @function normal-workbench.onclick.41 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: panel close. Returns: panel close using . */ () =>
        { generationJob?.abort(); panel.close(); }
  }
  root.FrontierNormalWorkbench = { create };
})(window);
