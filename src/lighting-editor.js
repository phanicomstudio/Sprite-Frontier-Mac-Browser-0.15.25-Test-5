/* October 24, 2026: map-wide settings are explicitly named Map lighting in Environment; original handlers, data and Undo remain authoritative. */
/* October 12, 2026: readable cell/source light controls. Settings use ordinary
 * project data and validated history; the influence overlay is author-only. */
(/* @function lightingEditor.install — Inputs: browser namespace. Returns: nothing. Publishes the UI factory without constructing renderer resources. */ function (
  root,
) {
  "use strict";
  /* @function lightingEditor.create — Inputs: application adapter. Returns: refresh/draw controller. Creates explicit light parameters, player/projectile emission choices and sampled diagnostics; commits use the existing undo transaction. */
  function create(api) {
    const panel = document.createElement("fieldset");
    panel.id = "localLightTools";
    panel.innerHTML =
      '<legend>Map lighting</legend><p>Settings apply to the active map and are saved with it. Enable map lighting, set ambient brightness, then Apply. Add colored local lights below.</p><label><input id="localLightingEnabled" type="checkbox">Enable lighting on this map</label><label>Ambient brightness<input id="localAmbient" type="number" min="0" max="1" step="0.05"></label><label>Active light budget<input id="localBudget" type="number" min="1" max="8" step="1"></label><label>Brightness steps (0 = smooth)<input id="localSteps" type="number" min="0" max="32" step="1"></label><label><input id="localPlayerLight" type="checkbox">Player light</label><label><input id="localProjectileLight" type="checkbox">Projectile lights</label><button id="localApplyCell">Apply map lighting</button><label>Selected light<select id="localLightSelection"></select></label><button id="localAddLight">Add light at author position</button><label>Name<input id="localLightName" maxlength="80"></label><label><input id="localSourceEnabled" type="checkbox">Source enabled</label><div id="localLightFields"></div><label>Color<input id="localColor" type="color"></label><label>Attach to event<select id="localAttachment"></select></label><button id="localApplySource">Apply selected light</button><button id="localDeleteSource">Delete selected light</button><p>Room primitives block these lights. Imported mesh and terrain shadow casting are not yet supported. HUD brightness is independent. Source coordinates are world positions, or offsets for an attached event.</p><p id="localLightDiagnostics" role="status"></p>';
    document.getElementById("editor").append(panel);
    /* @function lightingEditor.control — Inputs: DOM ID. Returns: current control or null. No scene mutation. */
    function control(id) {
      return document.getElementById(id);
    }
    for (const [key, label, min, max, step] of [
      ["x", "X — left/right", -10000, 10000, 0.1],
      ["y", "Y — forward/back", -10000, 10000, 0.1],
      ["z", "Z — up/down", -10000, 10000, 0.1],
      ["radius", "Radius (metres)", 0.05, 100, 0.1],
      ["intensity", "Brightness", 0, 4, 0.1],
      ["falloff", "Falloff", 0.5, 4, 0.1],
      ["flicker", "Gentle flicker", 0, 0.3, 0.01],
    ]) {
      const field = document.createElement("label");
      field.textContent = label;
      const input = document.createElement("input");
      input.type = "number";
      input.id = "local-" + key;
      input.min = min;
      input.max = max;
      input.step = step;
      field.append(input);
      control("localLightFields").append(field);
    }
    let selected = "",
      serial = 0,
      lastDiagnostics = 0;
    const overlay = document.createElement("canvas");
    overlay.id = "lightInfluenceOverlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:5";
    control("gameFrame").append(overlay);
    /* @function lightingEditor.settings — Inputs: none. Returns: existing validated cell lighting or a fresh disabled default record. Does not insert defaults into the world outside a transaction. */
    function settings() {
      return api.world().lighting || root.FrontierLocalLighting.validate();
    }
    /* @function lightingEditor.chosen — Inputs: none. Returns: selected ordinary/player/projectile source or undefined. Special sources use reserved dropdown values, independent of authored IDs. */
    function chosen() {
      const value = settings();
      return selected === "@player"
        ? value.player
        : selected === "@projectiles"
          ? value.projectiles
          : value.lights.find(
              /* @function lightingEditor.selectedSource — Inputs: light. Returns: stable ID match; no mutation. */ function (
                e,
              ) {
                return e.id === selected;
              },
            );
    }
    /* @function lightingEditor.fill — Inputs: none. Returns: nothing. Refreshes selected source fields without committing edits. Missing selections show neutral values; attachment choices reference existing events. */
    function fill() {
      const light = chosen();
      control("localLightName").value = light?.name || "";
      control("localSourceEnabled").checked = !!light?.enabled;
      control("localColor").value = light?.color || "#fff0cf";
      for (const key of [
        "x",
        "y",
        "z",
        "radius",
        "intensity",
        "falloff",
        "flicker",
      ])
        control("local-" + key).value = light?.[key] ?? 0;
      control("localAttachment").value = light?.eventId || "";
    }
    /* @function lightingEditor.refresh — Inputs: none. Returns: nothing. Rebuilds UI from authoritative validated data after map/history changes, retaining selection only when still available. Does not reset saved settings. */
    function refresh() {
      const value = settings();
      control("localLightingEnabled").checked = value.enabled;
      control("localAmbient").value = value.ambient;
      control("localBudget").value = value.budget;
      control("localSteps").value = value.steps;
      control("localPlayerLight").checked = value.player.enabled;
      control("localProjectileLight").checked = value.projectiles.enabled;
      control("localLightSelection").replaceChildren(
        new Option("None", ""),
        new Option("Player light parameters", "@player"),
        new Option("Projectile light parameters", "@projectiles"),
      );
      for (const light of value.lights)
        control("localLightSelection").append(new Option(light.name, light.id));
      control("localLightSelection").value = selected;
      control("localAttachment").replaceChildren(
        new Option("No attachment — world coordinates", ""),
      );
      for (const event of api.world().events)
        control("localAttachment").append(new Option(event.name, event.id));
      fill();
    }
    control("localLightSelection").onchange =
      /* @function lightingEditor.select — Inputs: change event (unused). Returns: nothing. Updates editor selection only; source data remains unchanged until Apply. */ function () {
        selected = this.value;
        fill();
      };
    control("localApplyCell").onclick =
      /* @function lightingEditor.applyCell — Inputs: click (unused). Returns: mutation result. Commits cell ambient, budgets and emission switches as one undo transaction. Invalid values reject through validation. */ function () {
        return api.mutate(
          /* @function lightingEditor.commitCell — Inputs: none. Returns: nothing. Revalidates complete cell settings, retaining source parameters and existing placed lights. */ function () {
            const value = settings();
            api.world().lighting = root.FrontierLocalLighting.validate({
              ...value,
              enabled: control("localLightingEnabled").checked,
              ambient: Number(control("localAmbient").value),
              budget: Number(control("localBudget").value),
              steps: Number(control("localSteps").value),
              player: {
                ...value.player,
                enabled: control("localPlayerLight").checked,
              },
              projectiles: {
                ...value.projectiles,
                enabled: control("localProjectileLight").checked,
              },
            });
          },
        );
      };
    control("localAddLight").onclick =
      /* @function lightingEditor.addSource — Inputs: click (unused). Returns: mutation result. Creates one warm radius source above current author position; lighting mode remains an explicit cell setting. */ function () {
        const id = "light-" + Date.now() + "-" + ++serial;
        selected = id;
        return api.mutate(
          /* @function lightingEditor.commitNewSource — Inputs: none. Returns: nothing. Appends a validated light record within existing source capacity and history. No independent runtime emitter is retained. */ function () {
            const value = settings(),
              p = api.game().player;
            api.world().lighting = root.FrontierLocalLighting.validate({
              ...value,
              lights: [
                ...value.lights,
                root.FrontierLocalLighting.source({
                  id,
                  name: "Warm light",
                  x: p.x,
                  y: p.y,
                  z: (p.z || 0) + 1.5,
                }),
              ],
            });
          },
        );
      };
    control("localApplySource").onclick =
      /* @function lightingEditor.applySource — Inputs: click (unused). Returns: mutation result or undefined without selection. Commits source parameters, including optional event attachment, through the owning transaction. */ function () {
        if (!chosen()) return;
        return api.mutate(
          /* @function lightingEditor.commitSource — Inputs: none. Returns: nothing. Replaces only selected source settings and preserves other lights; special player/projectile records share the validated parameter contract. */ function () {
            const value = settings(),
              fields = {};
            for (const key of [
              "x",
              "y",
              "z",
              "radius",
              "intensity",
              "falloff",
              "flicker",
            ])
              fields[key] = Number(control("local-" + key).value);
            const light = root.FrontierLocalLighting.source({
              ...chosen(),
              ...fields,
              name: control("localLightName").value,
              enabled: control("localSourceEnabled").checked,
              color: control("localColor").value,
              eventId: control("localAttachment").value || undefined,
            });
            if (selected === "@player") value.player = light;
            else if (selected === "@projectiles") value.projectiles = light;
            else
              value.lights = value.lights.map(
                /* @function lightingEditor.replaceSource — Inputs: current light. Returns: replacement only for the selected stable ID. */ function (
                  e,
                ) {
                  return e.id === selected ? light : e;
                },
              );
            api.world().lighting = root.FrontierLocalLighting.validate(value);
          },
        );
      };
    control("localDeleteSource").onclick =
      /* @function lightingEditor.deleteSource — Inputs: click (unused). Returns: mutation result or undefined for reserved sources. Removes one authored source; player/projectile emitters are disabled through their switches. */ function () {
        if (!selected || selected.startsWith("@")) return;
        const id = selected;
        selected = "";
        return api.mutate(
          /* @function lightingEditor.commitDelete — Inputs: none. Returns: nothing. Removes the selected stable light ID inside the existing history transaction. */ function () {
            const value = settings();
            api.world().lighting = root.FrontierLocalLighting.validate({
              ...value,
              lights: value.lights.filter(
                /* @function lightingEditor.keepOtherSource — Inputs: light. Returns: whether its ID differs from deletion target. */ function (
                  e,
                ) {
                  return e.id !== id;
                },
              ),
            });
          },
        );
      };
    /* @function lightingEditor.draw — Inputs: none. Returns: nothing. Draws selected radius in actual world coordinates while authoring and reports active budgets at 4 Hz. Does not alter collision, rendering quality or source data. */
    function draw() {
      const game = api.game(),
        width = game.viewWidth || 640;
      if (overlay.width !== width || overlay.height !== 480) {
        overlay.width = width;
        overlay.height = 480;
      }
      const ctx = overlay.getContext("2d");
      ctx.clearRect(0, 0, width, 480);
      if (!api.editing()) return;
      const light = chosen(),
        camera = root.FrontierRender.camera(game);
      if (light && !selected.startsWith("@") && !light.eventId) {
        ctx.strokeStyle = light.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        let begun = false;
        for (let i = 0; i <= 32; i++) {
          const angle = (i / 32) * Math.PI * 2,
            p = root.FrontierRender.project(
              camera,
              light.x + Math.cos(angle) * light.radius,
              light.y + Math.sin(angle) * light.radius,
              light.z,
            );
          if (!p) {
            begun = false;
            continue;
          }
          ctx[begun ? "lineTo" : "moveTo"](p.x, p.y);
          begun = true;
        }
        ctx.stroke();
      }
      if (performance.now() - lastDiagnostics > 250) {
        lastDiagnostics = performance.now();
        const frame = game.lightFrame;
        control("localLightDiagnostics").textContent = frame
          ? "Active " +
            frame.lights.length +
            "/" +
            settings().budget +
            " lights · " +
            frame.blockers.length +
            " room blockers · " +
            frame.droppedLights +
            " lights outside budget · " +
            frame.droppedBlockers +
            " blockers outside shadow budget"
          : "Radius lighting disabled.";
      }
    }
    refresh();
    return { refresh, draw };
  }
  root.FrontierLightingEditor = { create };
})(window);
