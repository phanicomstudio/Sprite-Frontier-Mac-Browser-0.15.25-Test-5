/* October 10, 2026: native crafting and cipher state logic. These records use
 * stable item keys and result variables; they do not depend on MZ databases. */
(/* @function native-tools.install — Inputs: engine namespace. Publishes pure recipe and cipher contracts, then registers runtime commands. No UI or timers created at installation. */ function (
  root,
) {
  "use strict";
  /* @function native-tools.recipe — Inputs: recipe command. Returns compact validated recipe. Requires 1–5 distinct ingredients and positive whole quantities; rejects malformed item keys. No inventory mutation. */
  function recipe(value) {
    if (
      typeof value.output !== "string" ||
      !value.output ||
      value.output.length > 120 ||
      !Number.isInteger(value.quantity) ||
      value.quantity < 1 ||
      value.quantity > 999
    )
      throw Error("Choose an output item and quantity 1–999");
    if (
      !Array.isArray(value.ingredients) ||
      value.ingredients.length < 1 ||
      value.ingredients.length > 5
    )
      throw Error("Recipes need 1–5 ingredients");
    const ids = new Set(),
      ingredients = [];
    for (const ingredient of value.ingredients) {
      if (
        typeof ingredient.item !== "string" ||
        !ingredient.item ||
        ingredient.item.length > 120 ||
        ids.has(ingredient.item) ||
        !Number.isInteger(ingredient.quantity) ||
        ingredient.quantity < 1 ||
        ingredient.quantity > 999
      )
        throw Error("Ingredient keys must be unique with quantities 1–999");
      ids.add(ingredient.item);
      ingredients.push({
        item: ingredient.item,
        quantity: ingredient.quantity,
      });
    }
    return { output: value.output, quantity: value.quantity, ingredients };
  }
  /* @function native-tools.craft — Inputs: inventory Map and validated recipe. Returns success flag. Checks all quantities and capacity before consuming anything, then adds output atomically. Failed attempts leave the inventory untouched. */
  function craft(inventory, value) {
    const checked = recipe(value);
    for (const ingredient of checked.ingredients)
      if ((inventory.get(ingredient.item) || 0) < ingredient.quantity)
        return false;
    if (!inventory.has(checked.output) && inventory.size >= 2000) return false;
    for (const ingredient of checked.ingredients) {
      const left = inventory.get(ingredient.item) - ingredient.quantity;
      if (left) inventory.set(ingredient.item, left);
      else inventory.delete(ingredient.item);
    }
    inventory.set(
      checked.output,
      Math.min(
        1000000,
        (inventory.get(checked.output) || 0) + checked.quantity,
      ),
    );
    return true;
  }
  /* @function native-tools.cipher — Inputs: optional cipher settings. Returns validated symbol count, timer seconds, attempts and result key. Result codes: 0 cancel, 1 success, 2 attempts exhausted, 3 timeout. No mutation. */
  function cipher(value = {}) {
    const result = {
      symbols: value.symbols ?? 4,
      seconds: value.seconds ?? 60,
      attempts: value.attempts ?? 3,
      result: value.result ?? "cipher-result",
    };
    if (
      !Number.isInteger(result.symbols) ||
      result.symbols < 2 ||
      result.symbols > 12 ||
      !Number.isFinite(result.seconds) ||
      result.seconds < 5 ||
      result.seconds > 600 ||
      !Number.isInteger(result.attempts) ||
      result.attempts < 1 ||
      result.attempts > 20 ||
      typeof result.result !== "string" ||
      !result.result ||
      result.result.length > 120
    )
      throw Error(
        "Cipher needs 2–12 symbols, 5–600 seconds, 1–20 attempts and a result variable",
      );
    return result;
  }
  root.FrontierNativeTools = { recipe, craft, cipher };
  root.FrontierEventRuntime.register("nativeCraft", {
    validate: recipe,
    execute:
      /* @function native-tools.executeCraft — Inputs: recipe command and event state. Opens a native recipe interaction, preserving event continuation through a short wait. Returns interpreter wait directive; UI owns pause until completion. */ function (
        command,
        { state },
      ) {
        root.FrontierNativeToolUI.crafting(state, command);
        return { wait: 0.1 };
      },
  });
  root.FrontierEventRuntime.register("nativeCipher", {
    validate: cipher,
    execute:
      /* @function native-tools.executeCipher — Inputs: cipher command and event state. Opens native timed puzzle and returns a short wait directive. Result variable is written before UI unpauses, so following branches see final result. */ function (
        command,
        { state },
      ) {
        root.FrontierNativeToolUI.puzzle(state, command);
        return { wait: 0.1 };
      },
  });
})(typeof window === "undefined" ? globalThis : window);
