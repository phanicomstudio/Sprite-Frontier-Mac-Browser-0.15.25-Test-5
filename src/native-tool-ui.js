/* October 10, 2026: readable native recipe and glyph interactions. Timers and
 * dialogs are released on close; completion writes state before resuming. */
(/* @function native-tool-ui.install — Inputs: browser namespace. Installs native UI service with configurable pause/log adapter. Returns nothing; no dialog until invoked. */ function (
  root,
) {
  "use strict";
  let api = null;
  /* @function native-tool-ui.configure — Inputs: pause/log adapter. Stores application services; returns nothing. Call once after app initialization. */
  function configure(value) {
    api = value;
  }
  /* @function native-tool-ui.shell — Inputs: title. Returns open large-font modal and pauses world input. Text uses textContent to avoid interpreting authored names as HTML. Throws if application services are unavailable. */
  function shell(title) {
    if (!api) throw Error("Native tool UI is not initialized");
    api.pause(true);
    const dialog = document.createElement("dialog");
    dialog.style.cssText =
      "font:24px sans-serif;min-width:360px;max-width:90vw";
    const heading = document.createElement("h2");
    heading.textContent = title;
    dialog.append(heading);
    document.body.append(dialog);
    dialog.showModal();
    return dialog;
  }
  /* @function native-tool-ui.button — Inputs: parent, label and handler. Appends a keyboard-accessible large action control and returns it; no handler execution during construction. */
  function button(parent, label, handler) {
    const node = document.createElement("button");
    node.textContent = label;
    node.onclick = handler;
    node.style.font = "inherit";
    parent.append(node);
    return node;
  }
  /* @function native-tool-ui.crafting — Inputs: event state and recipe command. Opens one reusable recipe with inventory counts. Craft checks transaction safety; Cancel consumes nothing. Returns nothing; closes pause reliably. */
  function crafting(state, value) {
    const recipe = root.FrontierNativeTools.recipe(value),
      dialog = shell("Combine ingredients"),
      list = document.createElement("ul"),
      status = document.createElement("p");
    for (const ingredient of recipe.ingredients) {
      const row = document.createElement("li");
      row.textContent =
        ingredient.item +
        " × " +
        ingredient.quantity +
        " (have " +
        (state.inventory.get(ingredient.item) || 0) +
        ")";
      list.append(row);
    }
    dialog.append(list, status);
    status.textContent = "Produces " + recipe.output + " × " + recipe.quantity;
    /* @function native-tool-ui.finishCraft — Inputs: none. Closes modal, releases node and unpauses. Returns nothing; does not edit inventory. */
    function finish() {
      dialog.close();
      dialog.remove();
      api.pause(false);
    }
    button(
      dialog,
      "Combine",
      /* @function native-tool-ui.combine — Inputs: click unused. Attempts atomic consumption/output and logs success or readable missing-ingredient status. Returns nothing. */ function () {
        if (root.FrontierNativeTools.craft(state.inventory, recipe)) {
          api.log("Created " + recipe.output + " × " + recipe.quantity);
          finish();
        } else
          status.textContent = "Missing ingredients or inventory capacity.";
      },
    );
    button(dialog, "Cancel", finish);
    dialog.oncancel =
      /* @function native-tool-ui.cancelCraft — Inputs: native cancel event. Prevents default close and uses the same cleanup path. Returns nothing. */ function (
        event,
      ) {
        event.preventDefault();
        finish();
      };
  }
  /* @function native-tool-ui.puzzle — Inputs: event state and cipher configuration. Opens a timed glyph sequence matching puzzle. Wrong sequences consume attempts; cancellation, timeout and success write distinct result codes before resuming the event. Returns nothing. */
  function puzzle(state, value) {
    const config = root.FrontierNativeTools.cipher(value),
      glyphs = ["△", "◇", "○", "□", "✕", "⊕", "⊥", "⌁"],
      target = [],
      dialog = shell("Cipher"),
      status = document.createElement("p"),
      display = document.createElement("p"),
      entry = document.createElement("p");
    let choices = [],
      attempts = config.attempts,
      finished = false;
    const deadline = performance.now() + config.seconds * 1000;
    for (let i = 0; i < config.symbols; i++)
      target.push(Math.floor(Math.random() * glyphs.length));
    display.textContent =
      "Match: " +
      target
        .map(
          /* @function native-tool-ui.targetGlyph — Inputs: glyph index. Returns display symbol with no mutation. */ function (
            index,
          ) {
            return glyphs[index];
          },
        )
        .join(" ");
    dialog.append(status, display, entry);
    /* @function native-tool-ui.finishPuzzle — Inputs: result code. Writes the event result, cancels the interval and removes modal once. Returns nothing; duplicate closing paths are harmless. */
    function finish(result) {
      if (finished) return;
      finished = true;
      clearInterval(timer);
      state.variables.set(config.result, result);
      dialog.close();
      dialog.remove();
      api.pause(false);
    }
    for (let index = 0; index < glyphs.length; index++)
      button(
        dialog,
        glyphs[index],
        /* @function native-tool-ui.chooseGlyph — Inputs: click unused. Adds glyph and checks completed sequence. Wrong answers consume one attempt, successful answers close. Returns nothing. */ function () {
          choices.push(index);
          entry.textContent = choices
            .map(
              /* @function native-tool-ui.enteredGlyph — Inputs: chosen index. Returns visible glyph; no effects. */ function (
                i,
              ) {
                return glyphs[i];
              },
            )
            .join(" ");
          if (choices.length === target.length) {
            if (
              choices.every(
                /* @function native-tool-ui.matches — Inputs: chosen value/index. Returns exact target match for this position. */ function (
                  n,
                  i,
                ) {
                  return n === target[i];
                },
              )
            )
              finish(1);
            else {
              attempts--;
              choices = [];
              entry.textContent = "Sequence did not match.";
              if (attempts === 0) finish(2);
            }
          }
        },
      );
    button(
      dialog,
      "Cancel",
      /* @function native-tool-ui.cancelPuzzle — Inputs: click unused. Ends with cancel code and cleans timer. Returns nothing. */ function () {
        finish(0);
      },
    );
    dialog.oncancel =
      /* @function native-tool-ui.escapePuzzle — Inputs: native cancel event. Cancels using shared result/cleanup path. Returns nothing. */ function (
        event,
      ) {
        event.preventDefault();
        finish(0);
      };
    const timer = setInterval(
      /* @function native-tool-ui.puzzleClock — Inputs: none. Updates remaining real seconds at 4 Hz and ends on timeout. Returns nothing; interval is cleared by every finish path. */ function () {
        const left = Math.max(
          0,
          Math.ceil((deadline - performance.now()) / 1000),
        );
        status.textContent = left + " seconds · " + attempts + " attempts";
        if (left === 0) finish(3);
      },
      250,
    );
  }
  root.FrontierNativeToolUI = { configure, crafting, puzzle };
})(window);
