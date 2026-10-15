/* Private gameplay command draft; callers decide when to apply event changes. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function gameplay-dialogs.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier gameplay dialogs. */
(/* @function gameplay-dialogs.installReviewed — Installs private gameplay-command draft dialogs. The owning event editor decides when validated results commit; merely registering dialogs does not edit authored pages. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  const names = {
    skill: "Player skill",
    reputation: "Reputation",
    faction: "Faction membership",
    quest: "Quest state",
    inventory: "Inventory quantity",
  };
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function gameplay-dialogs.open.2 — Handles open within gameplay dialogs. Inputs: initial; accept. Updates: d id; d class name; d inner html; key max length; domain value. Uses: structured clone; document create element; d set attribute; select. */
  /* @function gameplay-dialogs.open.2Reviewed — Opens an independent gameplay-state command draft. Inputs: optional initial command and synchronous accept(validatedCommand). Returns nothing; clones input/default Speech command, builds labeled controls/help and focuses/selects the key. Cancellation/native dismissal removes UI without acceptance. Submission validates through runtime registry before invoking accept; callback failures display status but external changes are not rolled back. Clone/DOM failures propagate; host owns event commit, Undo and persistence. */ function open(
    initial,
    accept,
  ) {
    const original = structuredClone(
        initial || {
          type: "gameplayState",
          domain: "skill",
          key: "speech",
          operation: "set",
          value: 0,
        },
      ),
      d = document.createElement("dialog");
    d.id = "gameplayStateDialog";
    d.className = "mzDialog";
    d.setAttribute("aria-label", "Change gameplay state");
    d.innerHTML = "<h2>Change gameplay state</h2>";
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function gameplay-dialogs.field.3 — Handles field within gameplay dialogs. Inputs: label; node. Updates: wrap text content. Uses: document create element; node set attribute; wrap append; d append. Returns: node. */
  /* @function gameplay-dialogs.field.3Reviewed — Appends one labeled accessible control to the command dialog. Inputs: readable label and DOM node. Returns the same node after adding aria-label and wrapping it. Mutates UI only; DOM failures propagate. */ function field(
      label,
      node,
    ) {
      const wrap = document.createElement("label");
      wrap.textContent = label;
      node.setAttribute("aria-label", label);
      wrap.append(node);
      d.append(wrap);
      return node;
    }
    const select =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function gameplay-dialogs.select.4 — Handles select within gameplay dialogs. Inputs: label; entries. Uses: field; document create element; s append. Returns: s. */
  /* @function gameplay-dialogs.select.4Reviewed — Creates a labeled choice control from trusted entries. Inputs: label and ID/name pairs. Returns appended select with new Option nodes; no command mutation, selection validation or runtime execution. */ (
        label,
        entries,
      ) => {
        const s = field(label, document.createElement("select"));
        for (const [id, name] of entries) s.append(new Option(name, id));
        return s;
      };
    const domain = select("State category", Object.entries(names)),
      key = field("Key", document.createElement("input")),
      operation = select("Operation", [
        ["set", "Set"],
        ["add", "Add"],
        ["remove", "Remove"],
      ]),
      kind = select("Value type", [
        ["number", "Number"],
        ["string", "Text"],
        ["boolean", "Boolean"],
      ]),
      value = field("Value", document.createElement("input")),
      boolean = select("Boolean value", [
        ["true", "True / member"],
        ["false", "False / not a member"],
      ]);
    key.maxLength = 120;
    domain.value = original.domain;
    key.value = original.key;
    operation.value = original.operation;
    kind.value =
      typeof original.value === "undefined" ? "number" : typeof original.value;
    value.value = original.value ?? 0;
    boolean.value = String(original.value ?? false);
    const help = document.createElement("p");
    help.textContent =
      "Keys are shared across maps. Unset skills and reputation are zero. Numeric additions clamp at ±1,000,000. Inventory uses whole quantities, never drops below zero, and accepts negative Add values to consume items. Remove clears a key.";
    d.append(help);
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function gameplay-dialogs.refresh.5 — Handles refresh within gameplay dialogs. Inputs: no explicit arguments; uses enclosing module state. Updates: operation query selector using "[value=\"add\"]" disabled; operation value; kind value; kind parent element hidden; value parent element hidden. Uses: a list of "skill", "reputation", "inventory" includes; operation query selector; number is finite. */
  /* @function gameplay-dialogs.refresh.5Reviewed — Synchronizes allowed value controls with the chosen gameplay-state category. Inputs: none. Returns nothing; disables unsupported Add, forces numeric types for skill/reputation/inventory and boolean for faction, hides irrelevant controls for Remove, updates numeric step and resets nonnumeric numeric input to zero. Changes local controls only; final registry validation enforces actual data limits. */ function refresh() {
      const numeric = ["skill", "reputation", "inventory"].includes(
          domain.value,
        ),
        member = domain.value === "faction",
        removed = operation.value === "remove";
      operation.querySelector('[value="add"]').disabled = !numeric;
      if (!numeric && operation.value === "add") operation.value = "set";
      if (numeric) kind.value = "number";
      if (member) kind.value = "boolean";
      kind.parentElement.hidden = numeric || member || removed;
      value.parentElement.hidden = removed || kind.value === "boolean";
      boolean.parentElement.hidden = removed || kind.value !== "boolean";
      value.type = kind.value === "number" ? "number" : "text";
      value.step = domain.value === "inventory" ? "1" : "any";
      value.maxLength = 120;
      if (numeric && !Number.isFinite(+value.value)) value.value = 0;
    }
    domain.onchange = refresh;
    operation.onchange = refresh;
    kind.onchange = refresh;
    const status = document.createElement("p");
    status.role = "status";
    const footer = document.createElement("footer");
    for (const label of ["OK", "Cancel"]) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.onclick =
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function gameplay-dialogs.onclick.6 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: c value; status text content. Uses: d close; root frontier event runtime validate; accept. Returns: without a result. */
  /* @function gameplay-dialogs.onclick.6Reviewed — Handles OK or Cancel for this captured dialog button. Inputs: none. Returns nothing; Cancel closes without acceptance. OK builds a new command from draft/controls, omits value for Remove, converts chosen type, validates and invokes accept before closing. Validation/acceptance exceptions show status while dialog remains open. Does not undo external callback side effects or directly alter live gameplay collections. */ () => {
          if (label === "Cancel") {
            d.close();
            return;
          }
          try {
            const c = {
              ...original,
              type: "gameplayState",
              domain: domain.value,
              key: key.value,
              operation: operation.value,
            };
            if (c.operation === "remove") delete c.value;
            else
              c.value =
                kind.value === "boolean"
                  ? boolean.value === "true"
                  : kind.value === "number"
                    ? +value.value
                    : value.value;
            const checked = root.FrontierEventRuntime.validate(c);
            accept(checked);
            d.close();
          } catch (error) {
            status.textContent = error.message;
          }
        };
      footer.append(b);
    }
    d.append(status, footer);
    d.onclose =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function gameplay-dialogs.onclose.7 — Releases or restores dialog state after closing. Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using . */
  /* @function gameplay-dialogs.onclose.7Reviewed — Removes this gameplay-command modal after closing. Inputs: none, captured dialog. Returns DOM remove result; no acceptance or authored state mutation. */ () =>
        d.remove();
    document.body.append(d);
    refresh();
    d.showModal();
    key.focus();
    key.select();
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function gameplay-dialogs.summary.8 — Handles summary within gameplay dialogs. Inputs: c. Uses: string. Returns: names at c domain or c domain plus ": " plus c key plus " · " plus c operation plus c operation equals "remove" selects "" or " " plus string using c value. */
  /* @function gameplay-dialogs.summary.8Reviewed — Formats a concise command description for the event list. Inputs: gameplay-state command. Returns readable category, key, operation and value, omitting value for Remove and falling back to raw domain name. Does not validate/execute command or mutate state; caller handles text-safe display. */ function summary(
    c,
  ) {
    return (
      (names[c.domain] || c.domain) +
      ": " +
      c.key +
      " · " +
      c.operation +
      (c.operation === "remove" ? "" : " " + String(c.value))
    );
  }
  root.FrontierGameplayDialogs = { open, summary };
})(window);
