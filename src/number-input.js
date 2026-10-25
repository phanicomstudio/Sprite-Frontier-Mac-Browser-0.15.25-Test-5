/* MZ number input: per-digit wrap, first-digit focus, no cancellation.
 * Numeric state is independent of DOM presentation and interpreter ownership. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function number-input.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier number input. */
(/* @function number-input.installReviewed — Installs numeric state and dialog support for MZ number input. Per-digit wrapping/first-digit focus are separate from interpreter ownership; this command deliberately has no cancel outcome. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function number-input.initial.2 — Handles initial within number input. Inputs: value; digits. Uses: number is integer; error; number. Returns: math floor using math max using 0, math min using 10 raised to digits minus 1, number using value or 0. */
  /* @function number-input.initial.2Reviewed — Normalizes a starting integer for per-digit number input. Inputs: initial value and digit count. Returns floored Number-converted value clamped to 0 through 10^digits minus one; falsy/non-numeric conversion uses zero. Rejects noninteger digit counts outside 1–8. No state mutation. */ function initial(
    value,
    digits,
  ) {
    if (!Number.isInteger(digits) || digits < 1 || digits > 8)
      throw Error("Input Number needs 1–8 digits.");
    return Math.floor(
      Math.max(0, Math.min(10 ** digits - 1, Number(value) || 0)),
    );
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function number-input.change.3 — Handles change within number input. Inputs: value; digits; index; up. Updates: value. Uses: initial; number is integer; error. Returns: value minus old multiplied by place plus old plus up selects 1 or 9 % 10 multiplied by place. */
  /* @function number-input.change.3Reviewed — Changes one decimal digit independently with wrap and no carry. Inputs: current value, 1–8 digits, zero-based index from the left and truthy increase/falsy decrease flag. Returns normalized number with selected digit wrapped 0–9. Rejects invalid digit count/index; does not mutate caller state. */ function change(
    value,
    digits,
    index,
    up,
  ) {
    value = initial(value, digits);
    if (!Number.isInteger(index) || index < 0 || index >= digits)
      throw Error("Invalid digit index.");
    const place = 10 ** (digits - 1 - index),
      old = Math.floor(value / place) % 10;
    return value - old * place + ((old + (up ? 1 : 9)) % 10) * place;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function number-input.mount.4 — Handles mount within number input. Inputs: container; message; accept. Updates: box class name; row class name; b type; b onclick; b text content. Uses: initial; document create element; box set attribute; b set attribute. Returns: a record containing value, key. */
  /* @function number-input.mount.4Reviewed — Mounts an accessible number-input widget into the supplied container. Inputs: DOM container, message value/digits and synchronous accept(number) callback. Returns value reader and key handler; builds digit/buttons, initializes normalized value and focuses the leftmost digit. Local edits do not write interpreter variables; accept owns confirmation and cleanup. No cancellation option is offered. DOM/accept failures propagate, and this module does not remove its widget. */ function mount(
    container,
    message,
    accept,
  ) {
    let value = initial(message.value, message.digits),
      selected = 0;
    const box = document.createElement("div");
    box.className = "mzNumberInput";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Input Number");
    const row = document.createElement("div");
    row.className = "mzNumberDigits";
    const digits = [];
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function number-input.refresh.5 — Handles refresh within number input. Inputs: assignment pattern. Uses: string using value pad start; string; digits for each; digits at selected focus. */
  /* @function number-input.refresh.5Reviewed — Refreshes digit labels and selected accessibility state. Inputs: optional focus boolean. Returns nothing; formats zero-padded current number, updates all digit buttons and optionally focuses selected digit. Does not confirm or change value; requires the mounted digits. */ function refresh(
      focus = false,
    ) {
      const text = String(value).padStart(message.digits, "0");
      digits.forEach(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function number-input.callback.6 — Provides the callback for digits for each. Inputs: b; i. Updates: b text content. Uses: b set attribute; string. */
  /* @function number-input.callback.6Reviewed — Updates one digit button from the current formatted number. Inputs: button and zero-based digit index. Returns nothing; replaces text and aria-pressed for the selected digit, without changing numeric state. */ (
          b,
          i,
        ) => {
          b.textContent = text[i];
          b.setAttribute("aria-pressed", String(i === selected));
        },
      );
      if (focus) digits[selected].focus();
    }
    for (let i = 0; i < message.digits; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Digit " + (i + 1));
      b.onclick =
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function number-input.onclick.7 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: selected. Uses: refresh. */
  /* @function number-input.onclick.7Reviewed — Selects this clicked digit and focuses it. Inputs: none, captured digit index. Returns nothing; changes local selection and refreshes. Does not change value or invoke accept. */ () => {
          selected = i;
          refresh(true);
        };
      digits.push(b);
      row.append(b);
    }
    box.append(row);
    const controls = document.createElement("div");
    for (const [label, fn] of [
      [
        "Increase digit",
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function number-input.callback.8 — Provides the callback for the enclosing number input operation. Inputs: no explicit arguments; uses enclosing module state. Updates: value. Uses: change; refresh. */
  /* @function number-input.callback.8Reviewed — Increases the selected digit with 9-to-0 wrap. Inputs: none. Returns nothing; updates local value through change and refreshes focus. No carry, interpreter mutation or acceptance. */ () => {
          value = change(value, message.digits, selected, true);
          refresh(true);
        },
      ],
      [
        "Decrease digit",
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function number-input.callback.9 — Provides the callback for the enclosing number input operation. Inputs: no explicit arguments; uses enclosing module state. Updates: value. Uses: change; refresh. */
  /* @function number-input.callback.9Reviewed — Decreases the selected digit with 0-to-9 wrap. Inputs: none. Returns nothing; updates local value through change and refreshes focus. No borrow, interpreter mutation or acceptance. */ () => {
          value = change(value, message.digits, selected, false);
          refresh(true);
        },
      ],
      [
        "OK",
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function number-input.callback.10 — Returns accept using value. Inputs: no explicit arguments; uses enclosing module state. Uses: accept. Returns: accept using value. */
  /* @function number-input.callback.10Reviewed — Confirms the currently edited number. Inputs: none. Returns accept callback result; external callback owns variable assignment/dialog cleanup and may throw. This callback does not enforce one-shot submission itself. */ () =>
          accept(value),
      ],
    ]) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.onclick = fn;
      controls.append(b);
    }
    box.append(controls);
    container.append(box);
    refresh(true);
    return {
      value:
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function number-input.value.11 — Returns value. Inputs: no explicit arguments; uses enclosing module state. Returns: value. */
  /* @function number-input.value.11Reviewed — Reads the widget current number. Inputs: none. Returns local integer value, without mutation or confirmation. */ () =>
          value,
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function number-input.key.12 — Handles key within number input. Inputs: key. Updates: selected; value. Uses: a list of "arrowleft", "arrowright", "arrowup", "arrowdown" includes; change; accept; refresh. Returns: false; true. */
  /* @function number-input.key.12Reviewed — Handles normalized lowercase number-input keys. Inputs: key string. Returns false for unrelated keys or true for arrows, Enter and Escape. Left/right wrap digit selection; up/down wrap the chosen digit; Enter invokes accept and returns; Escape is consumed without cancellation. Refreshes digit focus for other accepted keys. Mutates local state only; callback/DOM failures propagate. */ key(
        key,
      ) {
        if (
          ![
            "arrowleft",
            "arrowright",
            "arrowup",
            "arrowdown",
            "enter",
            "escape",
          ].includes(key)
        )
          return false;
        if (key === "arrowleft" || key === "arrowright")
          selected =
            (selected + (key === "arrowright" ? 1 : -1) + message.digits) %
            message.digits;
        else if (key === "arrowup" || key === "arrowdown")
          value = change(value, message.digits, selected, key === "arrowup");
        else if (key === "enter") {
          accept(value);
          return true;
        }
        refresh(true);
        return true;
      },
    };
  }
  root.FrontierNumberInput = { initial, change, mount };
})(typeof window === "undefined" ? globalThis : window);
