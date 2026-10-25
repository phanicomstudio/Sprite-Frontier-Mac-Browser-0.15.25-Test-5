/* October 13, 2026: emitter Enabled is now an explicit draft control. Previously Apply rebuilt emitter records without this supported flag and could turn a disabled emitter on. Numeric ranges mirror the native validator; only data-value inputs become numeric properties. */
/* October 10, 2026: the map breathing editor now retains radius and second-based fades alongside intensity/frequency. Applying validates the complete configuration; cancel leaves map defaults untouched. */
/* October 10, 2026: native effects authoring uses the existing validated undo
 * transaction. Closing the draft never changes the project or playtest. */
(/* @function effects-editor.install — Inputs: engine namespace. Publishes editor factory; does not create controls until requested. Returns nothing. */ function (
  root,
) {
  "use strict";
  /* @function effects-editor.create — Inputs: adapter with world, mutate and log operations. Appends a readable editor launcher and returns its open function. Draft Apply uses map validation/undo; Cancel discards every field. */
  function create(api) {
    const launch = document.createElement("button");
    launch.textContent = "Native effects / map notes";
    document.getElementById("editor").append(launch);
    launch.onclick = open;
    /* @function effects-editor.open — Inputs: none. Opens a fresh independent settings draft, one emitter row per definition. Returns nothing. Existing live particles are never serialized or edited directly. */
    function open() {
      const dialog = document.createElement("dialog");
      dialog.style.cssText =
        "font:20px sans-serif;width:min(900px,90vw);max-height:90vh;overflow:auto";
      dialog.innerHTML =
        '<h2>Native effects</h2><p>World positions and repeat distances use engine units. Particle budget is shared by this cell.</p><label>Map notes<textarea data-field="notes" rows="3"></textarea></label><p>Use &lt;ColorPoolPlayer&gt; and &lt;ColorPoolFollowers&gt; for actor opt-in. Events use &lt;ColorPool&gt; in their own notes.</p><label>Particle budget<input data-field="budget" type="number" min="0" max="1024"></label><fieldset><legend>Animated color pools</legend><label><input data-color type="checkbox">Enable map color pools</label><label>Palette<select data-palette><option value="original">Original</option><option value="wizards">Wizards inspired</option></select></label><label>Strength<input data-strength type="number" min="0" max="1" step="0.05"></label><label>Motion speed<input data-speed type="number" min="0" max="3" step="0.05"></label></fieldset><fieldset><legend>Screen breathing</legend><label><input data-breathing type="checkbox">Enable subtle breathing</label><label>Amplitude<input data-amplitude type="number" min="0" max="0.05" step="0.001"></label><label>Frequency (Hz)<input data-frequency type="number" min="0.01" max="2" step="0.01"></label><label>Radius<input data-radius type="number" min="0.1" max="2" step="0.1"></label><label>Fade in (seconds)<input data-fade-in type="number" min="0" max="10" step="0.1"></label><label>Fade out (seconds)<input data-fade-out type="number" min="0" max="10" step="0.1"></label><p>Intensity changes the radial squeeze; frequency sets cycles per second. Fades ease the effect in and out. These settings are saved as map defaults.</p></fieldset><label>Liquid appearance<select data-liquid><option value="">Keep current liquid</option><option value="water">Water</option><option value="mud">Mud</option><option value="acid">Acid</option></select></label><p>Liquid appearance uses existing authored water cells and their collision/underwater rules.</p><div data-rows></div><button data-add>Add world emitter</button><p data-status></p><button data-apply>Apply</button> <button data-cancel>Cancel</button>';
      document.body.append(dialog);
      const draft = root.FrontierNativeEffects.validate(
          api.world().nativeEffects,
        ),
        notes = dialog.querySelector('[data-field="notes"]'),
        budget = dialog.querySelector('[data-field="budget"]'),
        rows = dialog.querySelector("[data-rows]");
      dialog.querySelector("[data-breathing]").checked =
        draft.breathing.enabled;
      dialog.querySelector("[data-amplitude]").value =
        draft.breathing.amplitude;
      dialog.querySelector("[data-frequency]").value =
        draft.breathing.frequency;
      dialog.querySelector("[data-radius]").value = draft.breathing.radius;
      dialog.querySelector("[data-fade-in]").value = draft.breathing.fadeIn;
      dialog.querySelector("[data-fade-out]").value = draft.breathing.fadeOut;
      notes.value = draft.notes;
      budget.value = draft.budget;
      dialog.querySelector("[data-color]").checked = draft.color.enabled;
      dialog.querySelector("[data-palette]").value = draft.color.palette;
      dialog.querySelector("[data-strength]").value = draft.color.strength;
      dialog.querySelector("[data-speed]").value = draft.color.speed;
      /* @function effects-editor.row — Inputs: emitter record. Appends editable kind, position, area and rate fields to the draft dialog. Returns nothing. Changes become persistent only through Apply; removes selected row without touching the source. */
      function row(emitter) {
        const box = document.createElement("fieldset");
        box.innerHTML =
          '<legend>World emitter</legend><label><input data-emitter-enabled type="checkbox">Enabled</label><label>Effect<select data-kind></select></label>';
        box.querySelector("[data-emitter-enabled]").checked =
          emitter.enabled !== false;
        const select = box.querySelector("select");
        for (const kind of root.FrontierNativeEffects.kinds)
          select.append(new Option(kind, kind));
        select.value = emitter.kind;
        for (const name of ["x", "y", "z", "radius", "rate"]) {
          const label = document.createElement("label");
          label.textContent = {
            x: "Position X",
            y: "Position Y",
            z: "Height Z",
            radius: "Area radius",
            rate: "Particles per second",
          }[name];
          const input = document.createElement("input");
          input.type = "number";
          input.step = ".1";
          input.dataset.value = name;
          input.value = emitter[name];
          input.min = { x: 0, y: 0, z: -100, radius: 0.1, rate: 0 }[name];
          input.max = { x: 512, y: 512, z: 100, radius: 100, rate: 200 }[name];
          label.append(input);
          box.append(label);
        }
        const remove = document.createElement("button");
        remove.textContent = "Remove emitter";
        remove.onclick =
          /* @function effects-editor.remove — Inputs: button click unused. Removes only this draft row. Returns nothing; source settings remain unchanged. */ function () {
            box.remove();
          };
        box.append(remove);
        rows.append(box);
      }
      for (const emitter of draft.emitters) row(emitter);
      dialog.querySelector("[data-add]").onclick =
        /* @function effects-editor.add — Inputs: button click unused. Adds a rain draft at the map spawn with height 5 and bounded default rate. Returns nothing. */ function () {
          const spawn = api.world().spawn;
          row({
            kind: "rain",
            x: spawn.x,
            y: spawn.y,
            z: 5,
            radius: 5,
            rate: 20,
          });
        };
      dialog.querySelector("[data-cancel]").onclick =
        /* @function effects-editor.cancel — Inputs: click unused. Closes and removes draft dialog; makes no changes. Returns nothing. */ function () {
          dialog.close();
          dialog.remove();
        };
      dialog.querySelector("[data-apply]").onclick =
        /* @function effects-editor.apply — Inputs: click unused. Validates all rows, commits once through undo and removes the dialog. On error keeps draft open with a readable message. Returns nothing. */ function () {
          try {
            const emitters = [];
            for (const box of rows.children) {
              const emitter = {
                kind: box.querySelector("select").value,
                enabled: box.querySelector("[data-emitter-enabled]").checked,
              };
              for (const input of box.querySelectorAll("input[data-value]"))
                emitter[input.dataset.value] = Number(input.value);
              emitters.push(emitter);
            }
            const value = root.FrontierNativeEffects.validate({
              ...draft,
              notes: notes.value,
              budget: Number(budget.value),
              emitters,
              breathing: {
                enabled: dialog.querySelector("[data-breathing]").checked,
                amplitude: Number(
                  dialog.querySelector("[data-amplitude]").value,
                ),
                frequency: Number(
                  dialog.querySelector("[data-frequency]").value,
                ),
                radius: Number(dialog.querySelector("[data-radius]").value),
                fadeIn: Number(dialog.querySelector("[data-fade-in]").value),
                fadeOut: Number(dialog.querySelector("[data-fade-out]").value),
              },
              color: {
                enabled: dialog.querySelector("[data-color]").checked,
                palette: dialog.querySelector("[data-palette]").value,
                strength: Number(dialog.querySelector("[data-strength]").value),
                speed: Number(dialog.querySelector("[data-speed]").value),
              },
            });
            api.mutate(
              /* @function effects-editor.commit — Inputs: none. Replaces current map settings with the validated draft through the existing undo transaction. Returns nothing. */ function () {
                api.world().nativeEffects = value;
                const kind = dialog.querySelector("[data-liquid]").value;
                if (kind) {
                  const colors = {
                    water: "#185b69",
                    mud: "#615042",
                    acid: "#7f9940",
                  };
                  api.world().water = {
                    ...api.world().water,
                    color: colors[kind],
                    texture: "",
                    embeddedTexture: "",
                    speed: kind === "mud" ? 0.15 : 0.6,
                    warp: kind === "mud" ? 0.02 : 0.06,
                  };
                }
              },
            );
            dialog.close();
            dialog.remove();
          } catch (error) {
            dialog.querySelector("[data-status]").textContent = error.message;
          }
        };
      dialog.showModal();
    }
    return { open };
  }
  root.FrontierEffectsEditor = { create };
})(window);
