/* October 13, 2026: starting gameplay state initializes fresh sessions; saved/travel state restores progress. Project item/weapon/HUD extensions instead apply at each session construction. Older short descriptions below are retained as historical and superseded by adjacent contracts. */
/* Project defaults are authored data. They initialize fresh sessions only;
 * travel/save restoration replaces them with the player's current shared state. */
/* Historical generated explanation: @function gameplay-defaults.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier gameplay defaults. */
(/* @function gameplayDefaults.callback.1 - Inputs: browser/global root. Returns: nothing; publishes the starting-value validator and modal editor. No project adoption or storage occurs at script load. Dependencies are resolved when validation/editor methods are called. */ function (
  root,
) {
  "use strict";
  /* Historical generated explanation: @function gameplay-defaults.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Uses: error; root frontier event state validate; number is finite; root frontier event schema json. Returns: a record containing schema, copied fields, extensions. */
  /* @function gameplayDefaults.validate.2 - Inputs: optional portable starting-values record. Returns: detached canonical schema/state/extensions. Rejects unsupported schema, invalid state and unbounded quest values before adoption; delegates known item/weapon/HUD namespaces to their validators while retaining other finite JSON extensions. Gold/skills/counts use their gameplay-state units, not world coordinates. */ function validate(
    value,
  ) {
    const v = value ?? { schema: "sprite-frontier-gameplay-defaults/1" };
    if (v.schema !== "sprite-frontier-gameplay-defaults/1")
      throw Error("Unsupported gameplay defaults schema.");
    const state = root.FrontierEventState.validate(v);
    for (const [, q] of state.quests)
      if (
        !(
          typeof q === "boolean" ||
          (typeof q === "string" && q.length <= 120) ||
          (typeof q === "number" &&
            Number.isFinite(q) &&
            Math.abs(q) <= 1000000)
        )
      )
        throw Error(
          "Starting quest state must be bounded text, boolean or number.",
        );
    const extensions = root.FrontierEventSchema.json(v.extensions || {});
    if (extensions.hudKillFeed !== undefined)
      extensions.hudKillFeed = root.FrontierKillFeedSettings.validate(
        extensions.hudKillFeed,
      );
    if (extensions.itemDefinitions !== undefined)
      extensions.itemDefinitions = root.FrontierItemDefinitions.validate(
        extensions.itemDefinitions,
      );
    if (extensions.weaponDefinitions !== undefined)
      extensions.weaponDefinitions = root.FrontierWeaponDefinitions.validate(
        extensions.weaponDefinitions,
      );
    return { schema: v.schema, ...state, extensions };
  }
  /* Historical generated explanation: @function gameplay-defaults.open.3 — Handles open within gameplay defaults. Inputs: initial; accept. Updates: d id; d class name; d inner html; section dataset collection; legend text content. Uses: validate; document create element; d set attribute; input. */
  /* @function gameplayDefaults.open.3 - Inputs: saved starting values and an accept(validatedDraft) callback. Returns: nothing; opens an independent modal draft containing state and project catalog/HUD controls. Apply validates all fields before invoking the owner; Cancel/close discard draft DOM. Validation or owner errors keep the modal open with feedback. Requires browser DOM and initialized native catalogs; the owner decides restart/persistence. */ function open(
    initial,
    accept,
  ) {
    const draft = validate(initial),
      d = document.createElement("dialog");
    d.id = "gameplayDefaultsDialog";
    d.className = "mzDialog";
    d.setAttribute("aria-label", "Starting gameplay values");
    d.innerHTML =
      "<h2>Starting gameplay values</h2><p>Used for fresh playtests and new games. Saved games and map travel retain changed values. Apply starts a fresh playtest.</p>";
    const fields = [];
    const readKillFeed = root.FrontierKillFeedSettings.editor(
      d,
      draft.extensions.hudKillFeed,
    );
    const readItems = root.FrontierItemDefinitions.editor(
      d,
      draft.extensions.itemDefinitions,
    );
    const readWeapons = root.FrontierWeaponDefinitions.editor(
      d,
      draft.extensions.weaponDefinitions,
    );
    const input =
      /* Historical generated explanation: @function gameplay-defaults.input.4 — Handles input within gameplay defaults. Inputs: parent; label; type; value. Updates: l text content; i type; i value; i step. Uses: document create element; i set attribute; l append; parent append. Returns: i. */
      /* @function gameplayDefaults.input.4 - Inputs: parent element, accessible label, HTML type and initial scalar value. Returns: attached labeled input; numeric fields accept decimal entry for later authoritative validation. No gameplay/project mutation; browser DOM failures propagate. */ (
        parent,
        label,
        type,
        value,
      ) => {
        const l = document.createElement("label");
        l.textContent = label;
        const i = document.createElement("input");
        i.type = type;
        i.value = value;
        i.setAttribute("aria-label", label);
        if (type === "number") i.step = "any";
        l.append(i);
        parent.append(l);
        return i;
      };
    const gold = input(d, "Starting gold", "number", draft.gold),
      party = input(
        d,
        "Party actor IDs (comma separated)",
        "text",
        draft.partyActors.join(", "),
      );
    for (const [collection, name] of [
      ["skills", "Player skills"],
      ["reputation", "Reputation"],
      ["factions", "Faction membership"],
      ["quests", "Quest state"],
    ]) {
      const section = document.createElement("fieldset");
      section.dataset.collection = collection;
      const legend = document.createElement("legend");
      legend.textContent = name;
      section.append(legend);
      const rows = [];
      /* Historical generated explanation: @function gameplay-defaults.row.5 — Handles row within gameplay defaults. Inputs: assignment pattern; assignment pattern. Updates: container class name; key input max length; kind value; member value; kind onchange. Uses: document create element; input; kind set attribute; kind append. */
      /* @function gameplayDefaults.row.5 - Inputs: optional collection key and typed value. Returns: nothing; appends one local skill/reputation/faction/quest draft with legal value-type choices. Keys are limited to 120 characters; default factions are true, quests not-started, other values zero. Removal and type switching affect only this draft until Apply. */ function row(
        key = "",
        value = collection === "factions"
          ? true
          : collection === "quests"
            ? "not-started"
            : 0,
      ) {
        const container = document.createElement("div");
        container.className = "gameplayDefaultRow";
        const keyInput = input(container, "Key", "text", key);
        keyInput.maxLength = 120;
        const kind = document.createElement("select");
        kind.setAttribute("aria-label", "Value type");
        for (const t of collection === "factions"
          ? ["boolean"]
          : collection === "quests"
            ? ["string", "number", "boolean"]
            : ["number"])
          kind.append(
            new Option(
              t === "string" ? "Text" : t === "number" ? "Number" : "Boolean",
              t,
            ),
          );
        kind.value = typeof value;
        container.append(kind);
        const val = input(
            container,
            "Value",
            typeof value === "number" ? "number" : "text",
            value,
          ),
          member = document.createElement("select");
        member.setAttribute("aria-label", "Boolean value");
        member.append(
          new Option("True / member", "true"),
          new Option("False / not a member", "false"),
        );
        member.value = String(value);
        container.append(
          member,
        ); /* Historical generated explanation: @function gameplay-defaults.refresh.6 — Handles refresh within gameplay defaults. Inputs: no explicit arguments; uses enclosing module state. Updates: val parent element hidden; member hidden; val type. */
        /* @function gameplayDefaults.refresh.6 - Inputs: select-change event (unused). Returns: nothing; switches this row between Boolean selection and text/number entry without changing the saved collection. Values remain locally retained; authoritative validation runs on Apply. */ function refresh() {
          val.parentElement.hidden = kind.value === "boolean";
          member.hidden = kind.value !== "boolean";
          val.type = kind.value === "number" ? "number" : "text";
        }
        kind.onchange = refresh;
        const record = { keyInput, kind, val, member },
          remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Remove";
        remove.onclick =
          /* Historical generated explanation: @function gameplay-defaults.onclick.7 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: rows splice; rows index of; container remove. */
          /* @function gameplayDefaults.onclick.7 - Inputs: click event (unused). Returns: nothing; removes the captured row from the local array and DOM. Does not delete an existing saved skill/faction/quest unless the owner later accepts the resulting draft. */ () => {
            rows.splice(rows.indexOf(record), 1);
            container.remove();
          };
        container.append(remove);
        rows.push(record);
        section.append(container);
        refresh();
      }
      for (const [key, value] of draft[collection]) row(key, value);
      const add = document.createElement("button");
      add.type = "button";
      add.textContent = "Add " + name.toLowerCase();
      add.onclick =
        /* Historical generated explanation: @function gameplay-defaults.onclick.8 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: status text content. Uses: row. Returns: without a result. */
        /* @function gameplayDefaults.onclick.8 - Inputs: click event (unused). Returns: nothing; adds the collection-specific default row, or reports the 2,000-row authoring bound. No saved mutation or per-frame work. */ () => {
          if (rows.length >= 2000) {
            status.textContent = "At most 2,000 entries per collection.";
            return;
          }
          row();
        };
      section.append(add);
      d.append(section);
      fields.push({ collection, rows });
    }
    const status = document.createElement("p");
    status.role = "status";
    const footer = document.createElement("footer");
    for (const label of ["Apply", "Cancel"]) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.onclick =
        /* Historical generated explanation: @function gameplay-defaults.onclick.9 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: result at collection; status text content. Uses: d close; party value split using "," map using a callback filter; party value split using "," map; party value split. Returns: without a result. */
        /* @function gameplayDefaults.onclick.9 - Inputs: click event (unused); captures Apply or Cancel action. Returns: nothing. Cancel closes without adoption. Apply reads typed state, independent catalog/HUD drafts and retained unknown extensions, validates the full record, invokes accept once and then closes. Any thrown error is displayed and keeps the draft editable; acceptance/persistence side effects belong to the owner callback. */ () => {
          if (label === "Cancel") {
            d.close();
            return;
          }
          try {
            const result = {
              ...draft,
              gold: +gold.value,
              partyActors: party.value
                .split(",")
                .map(
                  /* Historical generated explanation: @function gameplay-defaults.callback.10 — Returns s trim using . Inputs: s. Uses: s trim. Returns: s trim using . */
                  /* @function gameplayDefaults.callback.10 - Inputs: comma-separated actor-ID token. Returns: trimmed token for party selection; following filter drops blanks, and gameplay-state validation rejects invalid identities. No state mutation. */ (
                    s,
                  ) => s.trim(),
                )
                .filter(Boolean),
            };
            for (const { collection, rows } of fields)
              result[collection] = rows.map(
                /* Historical generated explanation: @function gameplay-defaults.callback.11 — Returns a list of r key input value, r kind value equals "boolean" selects r member value equals "true" or r kind value equals "number" selects + r val value or r val value. Inputs: r. Returns: a list of r key input value, r kind value equals "boolean" selects r member value equals "true" or r kind value equals "number" selects + r val value or r val value. */
                /* @function gameplayDefaults.callback.11 - Inputs: one local collection row. Returns: key/value pair, interpreting Boolean select literally, numeric entries as numbers and text verbatim. This constructs portable data only; subsequent full validation rejects duplicates/out-of-range values. */ (
                  r,
                ) => [
                  r.keyInput.value,
                  r.kind.value === "boolean"
                    ? r.member.value === "true"
                    : r.kind.value === "number"
                      ? +r.val.value
                      : r.val.value,
                ],
              );
            const killFeed = readKillFeed();
            result.extensions = { ...draft.extensions };
            if (killFeed === undefined) delete result.extensions.hudKillFeed;
            else result.extensions.hudKillFeed = killFeed;
            const items = readItems();
            if (items === undefined) delete result.extensions.itemDefinitions;
            else result.extensions.itemDefinitions = items;
            const weapons = readWeapons();
            if (weapons === undefined)
              delete result.extensions.weaponDefinitions;
            else result.extensions.weaponDefinitions = weapons;
            accept(validate(result));
            d.close();
          } catch (error) {
            status.textContent = error.message;
          }
        };
      footer.append(b);
    }
    d.append(status, footer);
    d.onclose =
      /* Historical generated explanation: @function gameplay-defaults.onclose.12 — Releases or restores dialog state after closing. Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using . */
      /* @function gameplayDefaults.onclose.12 - Inputs: dialog close event (unused). Returns: DOM removal result (undefined). Releases the modal after Apply/Cancel/Escape; does not itself save, restart or alter project state. */ () =>
        d.remove();
    document.body.append(d);
    d.showModal();
    gold.focus();
  }
  root.FrontierGameplayDefaults = { validate, open };
})(typeof window === "undefined" ? globalThis : window);
