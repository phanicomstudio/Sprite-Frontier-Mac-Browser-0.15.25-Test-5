/* October 10, 2026: native breathing commands are authored as validated drafts. */
(/* @function breathing-dialog.install — Inputs: browser namespace. Publishes dialog service without creating UI until requested. */ function (
  root,
) {
  "use strict";
  root.FrontierBreathingDialog = {
    /* @function breathing-dialog.open — Inputs: optional existing command and acceptance callback. Returns modal dialog; validates before accepting. Cancel leaves event draft unchanged. All numeric units are seconds, Hz or normalized intensity/radius. */
    open(initial, accept) {
      const value = root.FrontierBreathing.validate(initial || {}),
        dialog = document.createElement("dialog");
      dialog.className = "mzDialog";
      dialog.innerHTML =
        '<h2>Screen breathing</h2><p>Changes this playtest effect without modifying map defaults. Gameplay pause and door cinematics freeze its animation.</p><label><input data-enabled type="checkbox">Enabled</label><p data-status></p><button data-ok>OK</button><button data-cancel>Cancel</button>';
      const fields = {};
      dialog.querySelector("[data-enabled]").checked = value.enabled;
      for (const [key, label, min, max, step] of [
        ["amplitude", "Intensity", 0, 0.05, 0.001],
        ["frequency", "Cycles per second", 0.01, 2, 0.01],
        ["radius", "Radius", 0.1, 2, 0.1],
        ["fadeIn", "Fade in (seconds)", 0, 10, 0.1],
        ["fadeOut", "Fade out (seconds)", 0, 10, 0.1],
      ]) {
        const row = document.createElement("label"),
          input = document.createElement("input");
        row.textContent = label;
        input.type = "number";
        input.min = min;
        input.max = max;
        input.step = step;
        input.value = value[key];
        fields[key] = input;
        row.append(input);
        dialog.insertBefore(row, dialog.querySelector("[data-status]"));
      }
      dialog.querySelector("[data-ok]").onclick =
        /* @function breathing-dialog.accept — Inputs: click ignored. Builds validated native command and invokes acceptance once, preserving existing indentation. On validation failure retains dialog and explains error. Returns nothing. */ function () {
          try {
            const draft = {
              enabled: dialog.querySelector("[data-enabled]").checked,
            };
            for (const [key, input] of Object.entries(fields))
              draft[key] = Number(input.value);
            accept({
              type: "screenBreathing",
              indent: initial?.indent || 0,
              ...root.FrontierBreathing.validate(draft),
            });
            dialog.close();
          } catch (error) {
            dialog.querySelector("[data-status]").textContent = error.message;
          }
        };
      dialog.querySelector("[data-cancel]").onclick =
        /* @function breathing-dialog.cancel — Inputs: click ignored. Closes without accepting draft; returns nothing. */ function () {
          dialog.close();
        };
      dialog.onclose =
        /* @function breathing-dialog.close — Inputs: close event ignored. Removes owned DOM fields; returns nothing. */ function () {
          dialog.remove();
        };
      document.body.append(dialog);
      dialog.showModal();
      return dialog;
    },
  };
})(window);
