/* October 13, 2026: per-map sky authoring uses typed fields rather than JSON.
 * Changing controls is a draft; Apply is one validated undoable transaction. */
(/* @function skyEditor.install — Inputs: browser namespace. Returns nothing; publishes editor-only sky controls. No runtime or asset loading at installation. */ function (
  root,
) {
  "use strict";
  /* @function skyEditor.create — Inputs: owning editor adapter. Returns refresh operation. Builds per-map panorama/orientation and bounded cloud/mountain layer controls, including explicit wrap-blend explanation. Apply validates before committing; errors use the existing visible editor log. */
  function create(api) {
    const panel = document.createElement("fieldset");
    panel.id = "skyTools";
    panel.innerHTML =
      '<legend>Sky and distant scenery</legend><label><input id="skyEnabled" type="checkbox">Enable sky</label><label>Image panorama<select id="skyPanoramaAsset"><option value="">Procedural sky only</option></select></label><img id="skyPanoramaPreview" alt="Chosen sky preview" hidden style="max-width:100%;max-height:140px;object-fit:contain"><label>Sky orientation (degrees)<input id="skyOrientation" type="number" min="-36000" max="36000" step="15" value="0"></label><label>Sky saturation<input id="skySaturation" type="number" min="0" max="2" step="0.05" value="1.2"></label><label>Sky contrast<input id="skyContrast" type="number" min="0.5" max="1.5" step="0.05" value="1.05"></label><label><input id="skyWrapBlend" type="checkbox" checked>Blend horizontal wrap seams</label><p>Wrap blending combines two samples of the original sky to hide seams. Source images remain unchanged. Sky is unlit and has no collision. Optional cloud and mountain layers draw over it.</p><div id="skyLayerRows"></div><button id="skyAddCloud">Add cloud layer</button><button id="skyAddMountain">Add mountain layer</button><button id="skyApply">Apply sky settings</button><button id="skyReset">Reset sky draft to defaults</button><p id="skyStatus" role="status"></p>';
    document.getElementById("editor").append(panel);
    /* @function skyEditor.control — Inputs: stable control ID. Returns current element or null. Read-only lookup. */
    function control(id) {
      return document.getElementById(id);
    }
    for (const entry of root.FrontierSkyPanorama.catalog)
      control("skyPanoramaAsset").add(new Option(entry.name, entry.id));
    let layerDraft = [];
    /* @function skyEditor.preview — Inputs: none. Returns nothing; updates only the authoring thumbnail from fixed trusted catalog paths. Does not change saved map settings or start renderer work. */
    function preview() {
      const entry = root.FrontierSkyPanorama.catalog.find(
        /* @function skyEditor.previewAsset — Inputs: catalog record. Returns current draft asset identity match. */ function (
          candidate,
        ) {
          return candidate.id === control("skyPanoramaAsset").value;
        },
      );
      const image = control("skyPanoramaPreview");
      image.hidden = !entry;
      if (entry) image.src = entry.url;
    }
    control("skyPanoramaAsset").onchange = preview;
    /* @function skyEditor.layerRows — Inputs: none. Returns nothing; rebuilds typed draft layer fields with documented units/ranges. Removal affects only draft until Apply. Maximum twelve rows follows the runtime schema. No image decoding or saved mutation. */
    function layerRows() {
      const rows = control("skyLayerRows");
      rows.replaceChildren();
      for (const layer of layerDraft) {
        const group = document.createElement("fieldset"),
          title = document.createElement("legend");
        title.textContent =
          layer.kind === "cloud" ? "Cloud layer" : "Mountain ridge";
        group.append(title);
        for (const field of [
          { key: "color", label: "Layer color", type: "color" },
          {
            key: "distance",
            label: "Layer distance (metres)",
            min: 60,
            max: 500,
            step: 1,
          },
          {
            key: "height",
            label: "Height above ground (metres)",
            min: 1,
            max: 150,
            step: 1,
          },
          {
            key: "parallax",
            label: "Camera parallax (0–1)",
            min: 0,
            max: 1,
            step: 0.01,
          },
          {
            key: "speed",
            label: "Cloud angular speed (radians/second)",
            min: -0.1,
            max: 0.1,
            step: 0.001,
          },
        ]) {
          const label = document.createElement("label"),
            input = document.createElement("input");
          label.textContent = field.label;
          input.type = field.type || "number";
          input.value = layer[field.key];
          input.dataset.skyKey = field.key;
          input.dataset.skyId = layer.id;
          if (!field.type) {
            input.min = field.min;
            input.max = field.max;
            input.step = field.step;
          }
          if (field.key === "speed" && layer.kind !== "cloud")
            input.disabled = true;
          label.append(input);
          group.append(label);
        }
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Remove layer";
        remove.onclick =
          /* @function skyEditor.removeLayer — Inputs: unused click. Returns nothing; removes this row from detached draft and rebuilds controls. Saved map/history changes only on Apply. */ function () {
            readRows();
            layerDraft = layerDraft.filter(
              /* @function skyEditor.keepLayer — Inputs: layer record. Returns whether its stable ID differs from removed draft layer. */ function (
                candidate,
              ) {
                return candidate.id !== layer.id;
              },
            );
            layerRows();
          };
        group.append(remove);
        rows.append(group);
      }
    }
    /* @function skyEditor.readRows — Inputs: none. Returns nothing; copies current typed row values into detached draft, preserving layer IDs/kinds. Validation is deferred to Apply and rejects nonfinite/out-of-range numbers. No saved mutation. */
    function readRows() {
      for (const input of control("skyLayerRows").querySelectorAll("input")) {
        const layer = layerDraft.find(
          /* @function skyEditor.inputLayer — Inputs: draft record. Returns stable input ownership match. */ function (
            candidate,
          ) {
            return candidate.id === input.dataset.skyId;
          },
        );
        if (layer)
          layer[input.dataset.skyKey] =
            input.dataset.skyKey === "color"
              ? input.value
              : Number(input.value);
      }
    }
    /* @function skyEditor.addLayer — Inputs: supported cloud/ridge kind. Returns nothing; appends a sensible bounded draft row and rebuilds fields after retaining prior draft edits. Twelve-row limit gives visible feedback. */
    function addLayer(kind) {
      readRows();
      if (layerDraft.length >= 12) {
        control("skyStatus").textContent =
          "A map supports up to twelve distant layers.";
        return;
      }
      layerDraft.push({
        id: "sky-layer-" + Date.now() + "-" + layerDraft.length,
        kind,
        color: "#497cc1",
        distance: 170,
        height: kind === "cloud" ? 34 : 12,
        parallax: 0.06,
        speed: kind === "cloud" ? 0.012 : 0,
      });
      layerRows();
    }
    control("skyAddCloud").onclick =
      /* @function skyEditor.addCloud — Inputs: unused click. Returns nothing; appends an uncommitted cloud draft. */ function () {
        addLayer("cloud");
      };
    control("skyAddMountain").onclick =
      /* @function skyEditor.addMountain — Inputs: unused click. Returns nothing; appends an uncommitted mountain draft. */ function () {
        addLayer("ridge");
      };
    /* @function skyEditor.populate — Inputs: validated sky settings. Returns nothing; replaces detached draft/forms after map switch/history/reset. Thumbnail and layer fields reflect saved ownership; no world mutation. */
    function populate(sky) {
      control("skyEnabled").checked = sky.enabled;
      control("skyPanoramaAsset").value = sky.panorama?.asset || "";
      control("skyOrientation").value = sky.panorama?.orientation || 0;
      control("skyWrapBlend").checked = sky.panorama?.wrapBlend ?? true;
      control("skySaturation").value=sky.panorama?.saturation ?? 1.2;
      control("skyContrast").value=sky.panorama?.contrast ?? 1.05;
      layerDraft = structuredClone(sky.layers);
      layerRows();
      preview();
    }
    control("skyReset").onclick =
      /* @function skyEditor.resetDraft — Inputs: unused click. Returns nothing; restores historical procedural defaults in controls only. User must Apply to commit; saved panorama remains unchanged until then. */ function () {
        populate(root.FrontierSky.validate());
        control("skyStatus").textContent =
          "Default draft ready. Apply to save.";
      };
    control("skyApply").onclick =
      /* @function skyEditor.apply — Inputs: unused click. Returns nothing; validates complete per-map sky draft before one history transaction. Errors retain draft and report visibly. Resource bytes remain fixed banked assets; map stores identity/orientation/wrap and layer parameters only. */ function () {
        try {
          readRows();
          const draft = {
            enabled: control("skyEnabled").checked,
            layers: layerDraft,
          };
          if (control("skyPanoramaAsset").value)
            draft.panorama = {
              asset: control("skyPanoramaAsset").value,
              orientation: Number(control("skyOrientation").value),
              wrapBlend: control("skyWrapBlend").checked,
              saturation:Number(control("skySaturation").value),contrast:Number(control("skyContrast").value),
            };
          const value = root.FrontierSky.validate(draft),
            accepted = api.mutate(
              /* @function skyEditor.commit — Inputs: none. Returns nothing; assigns already validated sky to the current authored map within shared undo/rollback. */ function () {
                api.world().sky = value;
              },
            );
          if (accepted !== false)
            control("skyStatus").textContent =
              "Sky settings saved for this map.";
        } catch (error) {
          control("skyStatus").textContent = error.message;
          api.log(error.message);
        }
      };
    /* @function skyEditor.refresh — Inputs: none. Returns nothing; rebuilds draft from current authored map after history/import/map switch. Discards uncommitted form edits consistently with other inspectors. */
    function refresh() {
      populate(root.FrontierSky.validate(api.world().sky));
    }
    refresh();
    return { refresh };
  }
  root.FrontierSkyEditor = { create };
})(window);
