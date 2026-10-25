/* Readable shared model library. Import is atomic at the decoder boundary;
 * previews reuse the exact world renderer and decoded asset cache. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-workbench.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model workbench. */
(/* @function model-workbench.installReviewed — Installs readable shared model import/library/preview authoring. Imports commit only after decoder validation and previews use the world renderer/cache rather than a second incompatible model pipeline. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  const el =
    /* @function model-workbench.el.2 — Handles el within model workbench. Inputs: tag; text. Updates: n text content. Uses: document create element. Returns: n. */ (
      tag,
      text,
    ) => {
      const n = document.createElement(tag);
      if (text) n.textContent = text;
      return n;
    };
  /* @function model-workbench.open.3 — Handles open within model workbench. Inputs: assignment pattern. Updates: d class name; d style css text; files type; files multiple; folder type. Uses: el; d set attribute; d append; files set attribute. */ function open(
    onSelect = /* @function model-workbench.onSelect.4 — Handles on select within model workbench. Inputs: no explicit arguments; uses enclosing module state. */ () => {},
  ) {
    const d = el("dialog");
    d.className = "mzDialog modelLibraryDialog";
    d.setAttribute("aria-label", "3D Model Library");
    d.style.cssText =
      "width:min(1000px,94vw);max-height:90vh;overflow:auto;font:18px Arial";
    d.append(
      el("h2", "3D Model Library"),
      el(
        "p",
        "Import a GLB, or select a glTF together with all its buffers and textures. Assets are shared by model ID.",
      ),
    );
    const files = el("input");
    files.type = "file";
    files.multiple = true;
    files.setAttribute("aria-label", "Model files");
    const folder = el("input");
    folder.type = "file";
    folder.multiple = true;
    folder.setAttribute("webkitdirectory", "");
    folder.setAttribute("aria-label", "Model folder");
    const id = el("input");
    id.placeholder = "house-a";
    id.setAttribute("aria-label", "Model ID");
    const name = el("input");
    name.placeholder = "House A";
    name.setAttribute("aria-label", "Model name");
    const importButton = el("button", "Import model files");
    importButton.type = "button";
    const list = el("select");
    list.size = 5;
    list.setAttribute("aria-label", "Available 3D models");
    const preview = el("canvas");
    preview.width = 640;
    preview.height = 480;
    preview.style.cssText =
      "width:min(640px,100%);height:auto;display:block;background:#101827";
    const info = el("p"),
      status = el("p");
    status.setAttribute("role", "status");
    const label =
      /* @function model-workbench.label.5 — Handles label within model workbench. Inputs: text; input. Updates: l style css text. Uses: el; l append; d append. */ (
        text,
        input,
      ) => {
        const l = el("label", text + " ");
        l.style.cssText = "display:block;margin:12px 0";
        l.append(input);
        d.append(l);
      };
    label("Model ID", id);
    label("Model name", name);
    label("Model files", files);
    label("Or select a model folder", folder);
    files.onchange =
      /* @function model-workbench.onchange.6 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: folder value. */ () => {
        folder.value = "";
      };
    folder.onchange =
      /* @function model-workbench.onchange.7 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: files value. */ () => {
        files.value = "";
      };
    d.append(importButton, list, info, preview, status);
    let previewRevision = 0;
    /* @function model-workbench.show.8 — Handles show within model workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: status text content; ctx terrain depth; info text content. Uses: frontier model library get; frontier model renderer prepare; bounds min map; bounds max map. Returns: without a result; without a result. */ async function show() {
      const serial = ++previewRevision,
        asset = FrontierModelLibrary.get(list.value);
      if (!asset?.scene) return;
      const state = FrontierModelRenderer.prepare(asset);
      await state.promise;
      if (serial !== previewRevision || !d.open) return;
      if (state.error) {
        status.textContent = state.error;
        return;
      }
      const bounds = asset.scene.bounds,
        center = bounds.min.map(
          /* @function model-workbench.callback.9 — Returns v plus bounds max at i divided by 2. Inputs: v; i. Returns: v plus bounds max at i divided by 2. */ (
            v,
            i,
          ) => (v + bounds.max[i]) / 2,
        ),
        extent = Math.max(
          ...bounds.max.map(
            /* @function model-workbench.callback.10 — Returns v minus bounds min at i. Inputs: v; i. Returns: v minus bounds min at i. */ (
              v,
              i,
            ) => v - bounds.min[i],
          ),
          0.1,
        ),
        distance = extent * 2.2,
        ctx = preview.getContext("2d");
      ctx.clearRect(0, 0, 640, 480);
      ctx.terrainDepth = null;
      const cam = {
        x: 0,
        y: -distance,
        z: center[2],
        yaw: 0,
        pitch: 0,
        cx: 320,
        cy: 240,
      };
      FrontierModelRenderer.draw(ctx, { viewWidth: 640 }, cam, [
        { modelId: list.value, x: -center[0], y: -center[1], z: 0 },
      ]);
      const item = FrontierModelLibrary.list().find(
        /* @function model-workbench.callback.11 — Returns m id equals list value. Inputs: m. Returns: m id equals list value. */ (
          m,
        ) => m.id === list.value,
      );
      info.textContent =
        item.name +
        " · " +
        item.triangles +
        " triangles · " +
        item.materials +
        " materials · " +
        item.images +
        " textures · " +
        (item.bytes / 1048576).toFixed(2) +
        " MiB source · " +
        (
          state.pixels.reduce(
            /* @function model-workbench.callback.12 — Returns n plus p data byte length. Inputs: n; p. Returns: n plus p data byte length. */ (
              n,
              p,
            ) => n + p.data.byteLength,
            0,
          ) / 1048576
        ).toFixed(2) +
        " MiB decoded textures";
    }
    /* @function model-workbench.refresh.13 — Handles refresh within model workbench. Inputs: selected. Updates: list value. Uses: list replace children; frontier model library list; list append; show. */ function refresh(
      selected,
    ) {
      list.replaceChildren();
      for (const item of FrontierModelLibrary.list())
        list.append(new Option(item.name + " [" + item.id + "]", item.id));
      if (selected) list.value = selected;
      show();
    }
    list.onchange = show;
    importButton.onclick =
      /* @function model-workbench.onclick.14 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: import button disabled; bundle at path; status text content. Uses: error; selected find; file array buffer; id value trim. */ async () => {
        importButton.disabled = true;
        try {
          const selected = [
            ...(folder.files.length ? folder.files : files.files),
          ];
          if (!selected.length) throw Error("Select model files first");
          const entry =
            selected.find(
              /* @function model-workbench.callback.15 — Returns /\.glb$/i test using f name. Inputs: f. Uses: /\.glb$/i test. Returns: /\.glb$/i test using f name. */ (
                f,
              ) => /\.glb$/i.test(f.name),
            ) ||
            selected.find(
              /* @function model-workbench.callback.16 — Returns /\.gltf$/i test using f name. Inputs: f. Uses: /\.gltf$/i test. Returns: /\.gltf$/i test using f name. */ (
                f,
              ) => /\.gltf$/i.test(f.name),
            );
          if (!entry) throw Error("Select a GLB or glTF entry file");
          const bundle = {};
          for (const file of selected) {
            const path = file.webkitRelativePath || file.name;
            if (bundle[path]) throw Error("Duplicate selected file path");
            bundle[path] = new Uint8Array(await file.arrayBuffer());
          }
          const modelId =
            id.value.trim() ||
            entry.name
              .replace(/\.[^.]+$/, "")
              .replace(/[^A-Za-z0-9_-]/g, "-")
              .slice(0, 60);
          if (FrontierModelLibrary.get(modelId))
            throw Error(
              "Model ID already exists. Use a new ID to preserve current references.",
            );
          const result = FrontierModelLibrary.importBundle({
            id: modelId,
            name: name.value.trim() || modelId,
            entry: entry.webkitRelativePath || entry.name,
            files: bundle,
          });
          status.textContent =
            "Imported " + result.id + ". Select it below to use it.";
          refresh(result.id);
          d.dispatchEvent(
            new CustomEvent("modelimport", {
              bubbles: true,
              detail: { id: result.id },
            }),
          );
        } catch (e) {
          status.textContent = e.message;
        } finally {
          importButton.disabled = false;
        }
      };
    const footer = el("footer"),
      choose = el("button", "Use selected model"),
      close = el("button", "Close");
    choose.onclick =
      /* @function model-workbench.onclick.17 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: on select; d close. Returns: without a result. */ () => {
        if (!list.value) return;
        onSelect(list.value);
        d.close();
      };
    close.onclick =
      /* @function model-workbench.onclick.18 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using . */ () =>
        d.close();
    footer.append(choose, close);
    d.append(footer);
    d.addEventListener(
      "close",
      /* @function model-workbench.callback.19 — Provides the callback for d add event listener. Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. */ () => {
        previewRevision++;
        d.remove();
      },
    );
    document.body.append(d);
    d.showModal();
    refresh();
  }
  root.FrontierModelWorkbench = { open };
})(window);
