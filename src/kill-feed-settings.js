/* October 13, 2026: project-owned settings for the established message-device
 * kill feed. No separate overlay, per-frame work or transition input is added.
 * Missing settings preserve shipped behavior; existing saves remain compatible. */
(/* @function killFeedSettings.install — Inputs: browser global root. Returns: nothing; installs validation, runtime application and a typed draft editor. Captures shipped combat parameters lazily after the combat host has loaded. Does not start playback or change a project on script load. */ function (
  root,
) {
  "use strict";
  let baseline;
  /* @function killFeedSettings.validate — Inputs: optional project settings with enabled, messages and weaponRules. Returns: detached canonical settings, or undefined for inherited shipped behavior. Rejects malformed rows, duplicate rule keys, empty message pools and oversized text before adoption. Message placeholders are literal {killer}, {victim}, {weapon}; no script is evaluated. */
  function validate(value) {
    if (value === undefined) return undefined;
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value) ||
      typeof value.enabled !== "boolean"
    )
      throw Error("Kill feed requires an Enabled value.");
    const messages = pool(value.messages);
    if (!Array.isArray(value.weaponRules) || value.weaponRules.length > 64)
      throw Error("Kill feed supports at most 64 weapon rules.");
    const ids = new Set(),
      weaponRules = [];
    for (const rule of value.weaponRules) {
      if (
        !rule ||
        typeof rule.weaponId !== "string" ||
        !/^[a-z0-9_-]{1,64}$/i.test(rule.weaponId) ||
        ids.has(rule.weaponId)
      )
        throw Error("Each kill-feed weapon rule needs a unique profile ID.");
      ids.add(rule.weaponId);
      weaponRules.push({
        weaponId: rule.weaponId,
        messages: pool(rule.messages),
      });
    }
    return { enabled: value.enabled, messages, weaponRules };
  }
  /* @function killFeedSettings.pool — Inputs: array of message templates. Returns: a copied nonempty pool, up to 64 strings of 240 characters each. Throws for invalid or whitespace-only templates; retains authored whitespace and placeholders verbatim. No mutation. */
  function pool(value) {
    if (!Array.isArray(value) || !value.length || value.length > 64)
      throw Error("Use 1–64 kill-feed messages per pool.");
    const result = [];
    for (const message of value) {
      if (
        typeof message !== "string" ||
        !message.trim() ||
        message.length > 240
      )
        throw Error(
          "Kill-feed messages must be nonempty and at most 240 characters.",
        );
      result.push(message);
    }
    return result;
  }
  /* @function killFeedSettings.defaults — Inputs: none. Returns: detached shipped settings parsed from the existing combat parameter object. Lazy capture avoids script-load ordering assumptions; absent combat settings throw. Preserves the original raw parameter values for exact reset through apply(undefined). */
  function defaults() {
    const params = root.PhanicomPluginSettings?.combat;
    if (!params) throw Error("Combat settings are not initialized.");
    baseline ??= {
      enabled: params.KillFeedEnabled,
      messages: params.KillFeedMessages,
      rules: params.KillFeedWeaponRules,
    };
    const weaponRules = [];
    for (const entry of JSON.parse(baseline.rules || "[]")) {
      const row = typeof entry === "string" ? JSON.parse(entry) : entry;
      weaponRules.push({
        weaponId: row.WeaponKey,
        messages: JSON.parse(row.Messages),
      });
    }
    return validate({
      enabled: baseline.enabled !== "false",
      messages: JSON.parse(
        baseline.messages || '["{killer} fragged {victim}"]',
      ),
      weaponRules,
    });
  }
  /* @function killFeedSettings.apply — Inputs: optional validated project override. Returns: nothing. Mutates the existing combat parameter object in place because the native host retains its reference. Undefined restores exact captured shipped values; invalid overrides throw before any mutation. Does not create HUD elements or alter player progress. */
  function apply(value) {
    const checked = validate(value);
    defaults();
    const params = root.PhanicomPluginSettings.combat;
    if (!checked) {
      params.KillFeedEnabled = baseline.enabled;
      params.KillFeedMessages = baseline.messages;
      params.KillFeedWeaponRules = baseline.rules;
      return;
    }
    const rules = [];
    for (const rule of checked.weaponRules)
      rules.push({
        WeaponKey: rule.weaponId,
        Messages: JSON.stringify(rule.messages),
      });
    params.KillFeedEnabled = String(checked.enabled);
    params.KillFeedMessages = JSON.stringify(checked.messages);
    params.KillFeedWeaponRules = JSON.stringify(rules);
  }
  /* @function killFeedSettings.editor — Inputs: parent dialog element and optional override. Returns: a draft reader; it validates on Apply and returns undefined when shipped defaults are selected. Adds labeled text pools and typed profile rules, with no project/global mutation while editing. One message per line; blank lines are ignored. */
  function editor(parent, value) {
    const draft = validate(value) || defaults(),
      box = document.createElement("fieldset"),
      legend = document.createElement("legend");
    legend.textContent = "HUD kill feed";
    box.append(legend);
    const inherit = field(
        box,
        "Use shipped kill-feed settings",
        "checkbox",
        value === undefined,
      ),
      enabled = field(box, "Kill feed enabled", "checkbox", draft.enabled);
    const help = document.createElement("p");
    help.textContent =
      "Messages use the existing HUD message device. One message per line; placeholders: {killer}, {victim}, {weapon}. Weapon rules replace the general pool for that profile.";
    box.append(help);
    const messages = field(
        box,
        "General kill-feed messages",
        "textarea",
        draft.messages.join("\n"),
      ),
      rows = [];
    /* @function killFeedSettings.addRule — Inputs: optional weapon rule. Returns: nothing; appends an independent editable draft row, capped at 64. Remove only affects this draft. Profile IDs match equipped native weapon profiles; unknown imported IDs remain editable for later profile configuration. */
    function addRule(
      rule = {
        weaponId: "",
        messages: ["{killer} defeated {victim} with {weapon}"],
      },
    ) {
      if (rows.length >= 64) return;
      const row = document.createElement("fieldset"),
        id = field(row, "Weapon profile ID", "text", rule.weaponId),
        text = field(
          row,
          "Weapon-specific messages",
          "textarea",
          rule.messages.join("\n"),
        ),
        record = { row, id, text };
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Remove weapon rule";
      remove.onclick =
        /* @function killFeedSettings.removeRule — Inputs: click event (unused). Returns: nothing; removes the captured row from local draft state and DOM. Saved settings remain unchanged until the owner applies. */ () => {
          rows.splice(rows.indexOf(record), 1);
          row.remove();
        };
      row.append(remove);
      rows.push(record);
      box.append(row);
      refresh();
    }
    for (const rule of draft.weaponRules) addRule(rule);
    const add = document.createElement("button");
    add.type = "button";
    add.textContent = "Add kill-feed weapon rule";
    add.onclick =
      /* @function killFeedSettings.clickAdd — Inputs: click event (unused). Returns: nothing; adds a local default rule under the documented 64-row bound. No persistent mutation. */ () =>
        addRule();
    box.append(add);
    parent.append(box);
    /* @function killFeedSettings.refresh — Inputs: checkbox change event (unused). Returns: nothing. Disables override controls while shipped behavior is selected; retains the local draft so toggling inheritance does not discard text. No runtime or project mutation. */
    function refresh() {
      for (const control of box.querySelectorAll("input,textarea,button"))
        if (control !== inherit) control.disabled = inherit.checked;
    }
    inherit.onchange = refresh;
    refresh();
    return /* @function killFeedSettings.readDraft — Inputs: none. Returns: undefined for inherited settings or a validated detached override. Throws on malformed text/rules for the owning dialog to display; no global mutation. */ () => {
      if (inherit.checked) return undefined;
      const rules = [];
      for (const row of rows)
        rules.push({
          weaponId: row.id.value.trim(),
          messages: lines(row.text.value),
        });
      return validate({
        enabled: enabled.checked,
        messages: lines(messages.value),
        weaponRules: rules,
      });
    };
  }
  /* @function killFeedSettings.lines — Inputs: multiline control text. Returns: nonblank lines preserving their other whitespace; CRLF and LF are accepted. Validation and length bounds belong to pool(). No mutation. */
  function lines(text) {
    const result = [];
    for (const line of text.split(/\r?\n/)) if (line.trim()) result.push(line);
    return result;
  }
  /* @function killFeedSettings.field — Inputs: parent, accessible label, control type and initial value. Returns: created control attached within a label. Checkboxes use checked state; textarea/text controls preserve literal templates. No persistence effects. */
  function field(parent, label, type, value) {
    const wrapper = document.createElement("label");
    wrapper.textContent = label;
    const control = document.createElement(
      type === "textarea" ? "textarea" : "input",
    );
    if (type !== "textarea") control.type = type;
    else {
      control.rows = 4;
      control.maxLength = 15424;
    }
    control.setAttribute("aria-label", label);
    if (type === "checkbox") control.checked = value;
    else control.value = value;
    wrapper.append(control);
    parent.append(wrapper);
    return control;
  }
  root.FrontierKillFeedSettings = { validate, defaults, apply, editor };
})(typeof window === "undefined" ? globalThis : window);
