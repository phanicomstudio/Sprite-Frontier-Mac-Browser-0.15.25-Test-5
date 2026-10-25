/* October 10, 2026: native tool commands are authored as event drafts. */
(/* @function native-tool-dialogs.install — Inputs: browser namespace. Publishes command dialog factory; no UI created at installation. */ function (
  root,
) {
  /* @function native-tool-dialogs.open — Inputs: optional command and accepted-draft callback. Opens readable recipe/cipher fields, validates on OK and calls accept once. Cancel discards draft. Returns nothing. */
  function open(initial, accept) {
    const dialog = document.createElement("dialog");
    dialog.className = "mzDialog";
    dialog.innerHTML = "<h2>Native crafting / cipher</h2>";
    const values = initial || {
        type: "nativeCraft",
        output: "healing-herb",
        quantity: 1,
        ingredients: [{ item: "test-token", quantity: 2 }],
      },
      fields = {};
    /* @function native-tool-dialogs.field — Inputs: stable field key, label, value and optional input type. Appends labeled control and returns it. Controls affect only local draft until OK. */
    function field(key, label, value, type = "text") {
      const wrap = document.createElement("label"),
        input = document.createElement("input");
      wrap.textContent = label;
      input.type = type;
      input.value = value ?? "";
      input.setAttribute("aria-label", label);
      wrap.append(input);
      dialog.append(wrap);
      fields[key] = input;
      return input;
    }
    const label = document.createElement("label"),
      kind = document.createElement("select");
    label.textContent = "Interaction";
    kind.append(
      new Option("Combine ingredients", "nativeCraft"),
      new Option("Cipher puzzle", "nativeCipher"),
    );
    kind.value = values.type;
    label.append(kind);
    dialog.append(label);
    field("output", "Output item key", values.output || "");
    field("quantity", "Output quantity", values.quantity || 1, "number");
    for (let i = 0; i < 5; i++) {
      field(
        "item" + i,
        "Ingredient " + (i + 1) + " item key",
        values.ingredients?.[i]?.item || "",
      );
      field(
        "amount" + i,
        "Ingredient " + (i + 1) + " quantity",
        values.ingredients?.[i]?.quantity || 1,
        "number",
      );
    }
    field("symbols", "Cipher symbol count", values.symbols || 4, "number");
    field("seconds", "Time limit (seconds)", values.seconds || 60, "number");
    field("attempts", "Attempts", values.attempts || 3, "number");
    field("result", "Result variable", values.result || "cipher-result");
    const status = document.createElement("p");
    dialog.append(status);
    /* @function native-tool-dialogs.refresh — Inputs: none. Shows only controls belonging to selected interaction. Returns nothing; preserves both draft sets while switching. */
    function refresh() {
      for (const [key, input] of Object.entries(fields))
        input.parentElement.hidden =
          kind.value === "nativeCraft"
            ? ["symbols", "seconds", "attempts", "result"].includes(key)
            : !["symbols", "seconds", "attempts", "result"].includes(key);
    }
    kind.onchange = refresh;
    for (const name of ["OK", "Cancel"]) {
      const button = document.createElement("button");
      button.textContent = name;
      button.onclick =
        /* @function native-tool-dialogs.action — Inputs: click unused. OK constructs and validates command before accepting; errors keep draft open. Cancel closes without accepting. Returns nothing. */ function () {
          if (name === "Cancel") {
            dialog.close();
            return;
          }
          try {
            let value;
            if (kind.value === "nativeCraft") {
              const ingredients = [];
              for (let i = 0; i < 5; i++)
                if (fields["item" + i].value.trim())
                  ingredients.push({
                    item: fields["item" + i].value.trim(),
                    quantity: Number(fields["amount" + i].value),
                  });
              value = {
                type: "nativeCraft",
                output: fields.output.value.trim(),
                quantity: Number(fields.quantity.value),
                ingredients,
              };
            } else
              value = {
                type: "nativeCipher",
                symbols: Number(fields.symbols.value),
                seconds: Number(fields.seconds.value),
                attempts: Number(fields.attempts.value),
                result: fields.result.value.trim(),
              };
            accept(root.FrontierEventRuntime.validate(value));
            dialog.close();
          } catch (error) {
            status.textContent = error.message;
          }
        };
      dialog.append(button);
    }
    dialog.onclose =
      /* @function native-tool-dialogs.close — Inputs: close event unused. Releases local modal and draft fields. Returns nothing. */ function () {
        dialog.remove();
      };
    document.body.append(dialog);
    refresh();
    dialog.showModal();
  }
  root.FrontierNativeToolDialogs = { open };
})(window);
