/* October 13, 2026: typed per-instance slot authoring, separate from runtime.
 * Original GLB materials/UVs remain intact; Apply uses the existing world-edit
 * transaction so Undo, templates and portable project saves keep overrides. */
(/* @function modelMaterialEditor.install — Inputs: browser global root. Returns: nothing; registers modal authoring without creating UI or loading assets at script evaluation. Runtime exports omit this file. */ function (
  root,
) {
  "use strict";
  /* @function modelMaterialEditor.open — Inputs: selected authored model event and accept(overrides) transaction callback. Returns: nothing; opens independent typed slot drafts with shared texture choices/import and original thumbnails. Rejects unavailable models before UI. Cancel abandons drafts; successful owner acceptance closes, while errors remain visible. Slot UV availability is checked without changing geometry/collision. */
  function open(event, accept) {
    const asset = root.FrontierModelLibrary.get(event.spatial?.modelId);
    if (!asset?.scene) throw Error("Select an available 3D model.");
    const draft =
        root.FrontierModelMaterials.validate(event.spatial.materials) || {},
      dialog = document.createElement("dialog");
    dialog.id = "modelMaterialDialog";
    dialog.className = "mzDialog";
    dialog.setAttribute("aria-label", "Model material slots");
    const title = document.createElement("h2");
    title.textContent = "Materials: " + (event.name || event.id);
    dialog.append(title);
    const help = document.createElement("p");
    help.textContent =
      "Overrides belong to this placed instance. Original UVs and geometry remain unchanged. Repeats use original UV coordinates, independent of model dimensions. Clear an override to restore the source slot.";
    dialog.append(help);
    const rows = [],
      urls = [],
      status = document.createElement("p");
    status.role = "status";
    for (let slot = 0; slot < (asset.json.materials || []).length; slot++) {
      const source = asset.json.materials[slot],
        saved = draft[slot] || {},
        row = document.createElement("details"),
        summary = document.createElement("summary");
      summary.textContent =
        "Slot " + slot + " — " + (source.name || "Unnamed material");
      row.append(summary);
      row.open = slot === 0;
      const enabled = field(
          row,
          "Override slot " + slot,
          "checkbox",
          Object.hasOwn(draft, slot),
        ),
        texture = field(row, "Assigned image", "select", "");
      texture.append(new Option("Original GLB texture", ""));
      for (const option of document.getElementById("roomSurface")?.options ||
        [])
        if (option.value)
          texture.append(new Option(option.textContent, option.value));
      if (
        saved.texture &&
        !Array.from(texture.options).some(
          /* @function modelMaterialEditor.savedImage — Inputs: image option. Returns: saved URI match without image decoding or source mutation. */ (
            option,
          ) => option.value === saved.texture,
        )
      )
        texture.append(new Option("Saved assigned image", saved.texture));
      texture.value = saved.texture || "";
      const preview = document.createElement("img");
      preview.alt = "Slot " + slot + " texture preview";
      preview.style.cssText =
        "max-width:180px;max-height:120px;object-fit:contain";
      row.append(preview);
      const originalIndex =
          asset.json.textures?.[
            source.pbrMetallicRoughness?.baseColorTexture?.index
          ]?.source,
        original = asset.images[originalIndex];
      let originalURL = "";
      if (original) {
        originalURL = URL.createObjectURL(
          new Blob([original.bytes], { type: original.mime }),
        );
        urls.push(originalURL);
      }
      /* @function modelMaterialEditor.preview — Inputs: image selection event unused. Returns: nothing; displays assigned/shared image or original source thumbnail. No texture pixels are rewritten; URLs are released on modal close. */
      function showPreview() {
        const uri = texture.value
          ? root.FrontierRoomTextureData?.[texture.value] || texture.value
          : originalURL;
        preview.hidden = !uri;
        if (uri) preview.src = uri;
        else preview.removeAttribute("src");
      }
      texture.onchange = showPreview;
      showPreview();
      const importFile = field(
        row,
        "Import slot image (PNG/JPEG/WebP)",
        "file",
        "",
      );
      importFile.accept = "image/png,image/jpeg,image/webp";
      importFile.onchange =
        /* @function modelMaterialEditor.importImage — Inputs: unused file change. Returns: promise; validates actual image dimensions/type under 8 MB/4096-side bounds, embeds bytes in the local draft and updates its preview. Rejects through modal status; never adopts project data until Apply. Bitmap is closed and picker cleared on all outcomes. */ async () => {
          let bitmap;
          try {
            const file = importFile.files[0];
            if (!file) return;
            if (
              file.size > 8000000 ||
              !["image/png", "image/jpeg", "image/webp"].includes(file.type)
            )
              throw Error("Choose PNG/JPEG/WebP under 8 MB.");
            bitmap = await createImageBitmap(file);
            if (bitmap.width > 4096 || bitmap.height > 4096)
              throw Error("Slot image exceeds 4096 pixels per side.");
            const uri = await dataURL(file);
            texture.append(new Option(file.name, uri));
            texture.value = uri;
            showPreview();
            status.textContent = "Image ready; Apply to save this instance.";
          } catch (error) {
            status.textContent = error.message;
          } finally {
            bitmap?.close();
            importFile.value = "";
          }
        };
      const tintEnabled = field(
          row,
          "Override tint",
          "checkbox",
          saved.color !== undefined,
        ),
        tint = field(row, "Slot tint", "color", saved.color || "#ffffff"),
        fields = {};
      for (const [key, label, min, max, initial] of [
        ["repeatU", "Horizontal repeats", 0.001, 1000, 1],
        ["repeatV", "Vertical repeats", 0.001, 1000, 1],
        ["offsetU", "Horizontal UV offset", -10000, 10000, 0],
        ["offsetV", "Vertical UV offset", -10000, 10000, 0],
        ["rotation", "Texture rotation (degrees)", -10000, 10000, 0],
      ]) {
        const control = field(row, label, "number", saved[key] ?? initial);
        control.min = String(min);
        control.max = String(max);
        control.step = "any";
        fields[key] = control;
      }
      const aspect = field(
        row,
        "Preserve image aspect",
        "checkbox",
        saved.preserveAspect || false,
      );
      // October 13: every primitive using a slot must supply UVs; a mixed slot
      // cannot accept texture mapping merely because one mesh has coordinates.
      let hasUV = true,
        slotUsed = false;
      for (const primitives of asset.meshes)
        for (const primitive of primitives)
          if (primitive.material === slot) {
            slotUsed = true;
            if (!primitive.uv) hasUV = false;
          }
      hasUV = hasUV && slotUsed;
      if (!hasUV) {
        const warning = document.createElement("p");
        warning.textContent =
          "This slot includes geometry without texture coordinates. Tint is available; texture assignment/mapping requires UVs authored in the source model.";
        row.append(warning);
      }
      /* @function modelMaterialEditor.refresh — Inputs: checkbox event unused. Returns: nothing; enables only chosen override fields and disables texture mapping without UVs. Retains draft text and leaves saved data unchanged. */
      function refresh() {
        texture.disabled =
          importFile.disabled =
          aspect.disabled =
            !enabled.checked || !hasUV;
        for (const control of Object.values(fields))
          control.disabled = !enabled.checked || !hasUV;
        tintEnabled.disabled = !enabled.checked;
        tint.disabled = !enabled.checked || !tintEnabled.checked;
      }
      enabled.onchange = tintEnabled.onchange = refresh;
      refresh();
      rows.push({
        slot,
        enabled,
        texture,
        tintEnabled,
        tint,
        fields,
        aspect,
        hasUV,
      });
      dialog.append(row);
    }
    if (!rows.length) {
      const warning = document.createElement("p");
      warning.textContent =
        "This GLB has no authored material slots. Add materials and UVs in the source model before assigning instance textures.";
      dialog.append(warning);
    }
    const footer = document.createElement("footer");
    for (const action of ["Apply", "Cancel"]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = action;
      button.onclick =
        /* @function modelMaterialEditor.action — Inputs: click event unused; captures Apply/Cancel. Returns: nothing. Apply constructs detached slot overrides, validates, invokes the owner transaction once and closes only on accepted adoption. Invalid drafts/owner errors display feedback. Cancel changes no data. */ () => {
          if (action === "Cancel") {
            dialog.close();
            return;
          }
          try {
            const result = {};
            for (const row of rows)
              if (row.enabled.checked) {
                const record = {};
                if (row.hasUV) {
                  if (row.texture.value) record.texture = row.texture.value;
                  for (const [key, control] of Object.entries(row.fields))
                    record[key] = Number(control.value);
                  record.preserveAspect = row.aspect.checked;
                }
                if (row.tintEnabled.checked) record.color = row.tint.value;
                result[row.slot] = record;
              }
            const value = root.FrontierModelMaterials.validate(result);
            if (accept(Object.keys(value).length ? value : undefined) !== false)
              dialog.close();
          } catch (error) {
            status.textContent = error.message;
          }
        };
      footer.append(button);
    }
    dialog.append(status, footer);
    dialog.onclose =
      /* @function modelMaterialEditor.close — Inputs: close event unused. Returns: nothing; revokes original thumbnail object URLs and removes this modal. Does not evict shared decoded runtime textures or change project state. */ () => {
        for (const url of urls) URL.revokeObjectURL(url);
        dialog.remove();
      };
    document.body.append(dialog);
    dialog.showModal();
  }
  /* @function modelMaterialEditor.dataURL — Inputs: validated local image File. Returns: promise resolving embedded data URI, rejecting reader failure. Reads exact bytes without image editing or network transmission. Caller owns dimension/type validation and adoption. */
  function dataURL(file) {
    return new Promise(
      /* @function modelMaterialEditor.read — Inputs: promise resolve/reject callbacks. Returns: nothing; starts one FileReader and exposes completion/failure. */ (
        resolve,
        reject,
      ) => {
        const reader = new FileReader();
        reader.onload =
          /* @function modelMaterialEditor.loaded — Inputs: reader event unused. Returns: nothing; resolves its exact data URI. */ () =>
            resolve(reader.result);
        reader.onerror =
          /* @function modelMaterialEditor.failed — Inputs: reader event unused. Returns: nothing; rejects supplied error or readable fallback. */ () =>
            reject(reader.error || Error("Image read failed."));
        reader.readAsDataURL(file);
      },
    );
  }
  /* @function modelMaterialEditor.field — Inputs: parent, accessible label, control type and initial value. Returns: attached labeled control. Type-specific bounds/choices are supplied by the owning slot; no saved mutation. */
  function field(parent, label, type, value) {
    const wrapper = document.createElement("label");
    wrapper.textContent = label;
    const control = document.createElement(
      type === "select" ? "select" : "input",
    );
    if (type !== "select") control.type = type;
    control.setAttribute("aria-label", label);
    if (type === "checkbox") control.checked = value;
    else if (type !== "file") control.value = value;
    wrapper.append(control);
    parent.append(wrapper);
    return control;
  }
  root.FrontierModelMaterialEditor = { open };
})(window);
