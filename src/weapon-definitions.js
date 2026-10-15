/* October 13, 2026: project overrides for shipped native weapon profiles.
 * Profile identity/family remains stable; timing is authored in seconds then
 * converted to the inherited host's 60-Hz cadence units at session boundaries. */
(/* @function weaponDefinitions.install — Inputs: browser/global root. Returns: nothing; installs project validation, boundary adoption and typed controls. No per-frame work or combat mutation occurs on script load. */ function (
  root,
) {
  "use strict";
  let baseline;
  const numbers = {
    damage: [0, 100000],
    magazineSize: [1, 100000, true],
    ammoCost: [0, 100000, true],
    range: [0.01, 1000],
    speed: [0.01, 1000],
    radius: [0, 10],
    cooldownSeconds: [0.001, 60],
    fireRateSeconds: [0.001, 60],
    burstDelaySeconds: [0.001, 60],
    burstCount: [1, 32, true],
    pellets: [1, 64, true],
    penetration: [0, 64, true],
    maxTargets: [1, 64, true],
    arcDegrees: [0, 360],
    audioVolume: [0, 4],
    volume: [0, 100],
    pitch: [50, 150],
  };
  const labels = {
    damage: "Damage per hit",
    magazineSize: "Magazine capacity (rounds)",
    ammoCost: "Ammo per attack",
    range: "Range (metres)",
    speed: "Projectile speed (metres/second)",
    radius: "Projectile radius (metres)",
    cooldownSeconds: "Attack cooldown (seconds)",
    fireRateSeconds: "Automatic cadence (seconds)",
    burstDelaySeconds: "Burst interval (seconds)",
    burstCount: "Attacks per burst",
    pellets: "Shotgun pellets per attack",
    penetration: "Penetration count",
    maxTargets: "Melee maximum targets",
    arcDegrees: "Melee arc (degrees)",
    audioVolume: "Procedural sound gain (0–4, 1 = normal)",
    volume: "Supplied sound volume (0–100)",
    pitch: "Supplied sound pitch (50–150)",
  };
  /* @function weaponDefinitions.validate — Inputs: optional dictionary of profile overrides. Returns: detached normalized overrides or undefined for inheritance. Up to 64 profiles; accepts only native-consumed keys with explicit finite/integer bounds, stable profile IDs and semi/auto/burst modes. Unknown fields reject instead of pretending to take effect. No runtime mutation. */
  function validate(value) {
    if (value === undefined) return undefined;
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value) ||
      Object.keys(value).length > 64
    )
      throw Error("Weapon settings must be a profile dictionary (up to 64).");
    const result = {};
    for (const [id, fields] of Object.entries(value)) {
      if (
        !/^[a-z0-9_-]{1,64}$/i.test(id) ||
        !fields ||
        typeof fields !== "object" ||
        Array.isArray(fields)
      )
        throw Error("Invalid weapon profile override.");
      const checked = {};
      for (const [key, v] of Object.entries(fields)) {
        if (numbers[key]) {
          const [min, max, integer] = numbers[key];
          if (
            !Number.isFinite(v) ||
            v < min ||
            v > max ||
            (integer && !Number.isSafeInteger(v))
          )
            throw Error(
              (labels[key] || key) + " is outside its allowed range.",
            );
          checked[key] = v;
        } else if (key === "light") {
          if (!v || typeof v !== "object" || Array.isArray(v))
            throw Error("Projectile light requires a settings record.");
          for (const field of Object.keys(v))
            if (
              ![
                "enabled",
                "color",
                "radius",
                "intensity",
                "falloff",
                "flicker",
              ].includes(field)
            )
              throw Error("Unsupported projectile light field: " + field);
          const light = root.FrontierLocalLighting.source(
            v,
            "weapon-projectile-light",
          );
          checked.light = {
            enabled: light.enabled,
            color: light.color,
            radius: light.radius,
            intensity: light.intensity,
            falloff: light.falloff,
            flicker: light.flicker,
          };
        } else if (key === "fireMode") {
          if (!["semi", "auto", "burst"].includes(v))
            throw Error("Invalid firing mode.");
          checked[key] = v;
        } else if (
          ["name", "sound", "emptySound", "audioProfile"].includes(key)
        ) {
          if (
            typeof v !== "string" ||
            v.length > 120 ||
            (key === "name" && !v.trim())
          )
            throw Error("Invalid weapon " + key);
          checked[key] = v;
        } else throw Error("Unsupported weapon field: " + key);
      }
      Object.defineProperty(result, id, {
        value: checked,
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
    return result;
  }
  /* @function weaponDefinitions.defaults — Inputs: none. Returns: detached shipped weapon Map. Captures the native host's original presets lazily before adoption; unavailable host throws. Deep cloning occurs only at session/editor boundaries, never each render frame. */
  function defaults() {
    if (!root.PhanicomABS?.weapons)
      throw Error("Native weapons are not initialized.");
    baseline ??= structuredClone(root.PhanicomABS.weapons);
    return structuredClone(baseline);
  }
  /* @function weaponDefinitions.apply — Inputs: optional project overrides. Returns: nothing. Validates and constructs every candidate before replacing entries in the same Map retained by the combat host. Converts seconds/degrees and synchronizes inherited ballistic aliases, including range/speed lifetime. Rejects unknown profile IDs atomically; currently equipped clones are refreshed by session construction after this call. */
  function apply(value) {
    const checked = validate(value) || {},
      weapons = defaults();
    for (const [id, fields] of Object.entries(checked)) {
      const weapon = weapons.get(id);
      if (!weapon) throw Error("Unknown native weapon profile: " + id);
      for (const [key, v] of Object.entries(fields)) {
        if (key === "cooldownSeconds") weapon.cooldown = v * 60;
        else if (key === "fireRateSeconds") weapon.fireRate = v * 60;
        else if (key === "burstDelaySeconds") weapon.burstDelay = v * 60;
        else if (key === "arcDegrees") weapon.arcRadians = (v * Math.PI) / 180;
        else weapon[key] = v;
      }
      if (
        fields.speed !== undefined ||
        fields.range !== undefined ||
        fields.radius !== undefined
      ) {
        weapon.projectile = {
          ...weapon.projectile,
          speed: weapon.speed,
          radius: weapon.radius,
          range: weapon.range,
          lifetime: weapon.range / weapon.speed,
        };
        weapon.projectileSpeed = weapon.speed;
        weapon.projectileRadius = weapon.radius;
        weapon.maxRange = weapon.range;
        weapon.projectileLifetime = weapon.range / weapon.speed;
      }
    }
    const retained = root.PhanicomABS.weapons;
    retained.clear();
    for (const [id, weapon] of weapons) retained.set(id, weapon);
  }
  /* @function weaponDefinitions.editor — Inputs: owning dialog and optional overrides. Returns: validated draft reader. Each shipped profile has an opt-in override, explicit units and native defaults. Disabled profile fields inherit shipped behavior; no runtime mutation before Apply. Existing angular spread remains a separate per-map control. */
  function editor(parent, value) {
    const draft = validate(value) || {},
      shipped = defaults(),
      box = document.createElement("fieldset"),
      legend = document.createElement("legend");
    legend.textContent = "Native weapon parameters";
    box.append(legend);
    const help = document.createElement("p");
    help.textContent =
      "Enable an override only for profiles you want to change. Apply starts a fresh playtest. Spread remains the per-map Weapon spread control. Projectile counts and light budgets remain bounded by the engine.";
    box.append(help);
    const rows = [];
    for (const [id, weapon] of shipped) {
      const row = document.createElement("details"),
        summary = document.createElement("summary");
      summary.textContent = (weapon.name || id) + " [" + id + "]";
      row.append(summary);
      const enabled = field(
          row,
          "Override " + id,
          "checkbox",
          Object.hasOwn(draft, id),
        ),
        fields = {};
      fields.name = field(
        row,
        "Weapon name",
        "text",
        draft[id]?.name ?? weapon.name ?? id,
      );
      fields.fireMode = field(row, "Firing mode", "select", "");
      for (const mode of ["semi", "auto", "burst"])
        fields.fireMode.append(new Option(mode, mode));
      fields.fireMode.value = draft[id]?.fireMode ?? weapon.fireMode ?? "semi";
      for (const [key, bounds] of Object.entries(numbers)) {
        if (
          (["pellets"].includes(key) && weapon.type !== "shotgun") ||
          (["maxTargets", "arcDegrees"].includes(key) &&
            weapon.type !== "melee") ||
          (["speed", "radius"].includes(key) && weapon.type === "melee")
        )
          continue;
        let initial = weapon[key];
        if (key === "cooldownSeconds") initial = weapon.cooldown / 60;
        if (key === "fireRateSeconds") initial = weapon.fireRate / 60;
        if (key === "burstDelaySeconds") initial = weapon.burstDelay / 60;
        if (key === "arcDegrees")
          initial = ((weapon.arcRadians || 0) * 180) / Math.PI;
        const control = field(
          row,
          labels[key],
          "number",
          draft[id]?.[key] ?? initial ?? bounds[0],
        );
        control.min = String(bounds[0]);
        control.max = String(bounds[1]);
        control.step = bounds[2] ? "1" : "any";
        fields[key] = control;
      }
      for (const key of ["sound", "emptySound", "audioProfile"])
        fields[key] = field(
          row,
          key === "sound"
            ? "Supplied firing sound ID"
            : key === "emptySound"
              ? "Empty-weapon sound ID"
              : "Procedural sound profile",
          "text",
          draft[id]?.[key] ?? weapon[key] ?? "",
        );
      const lightMode = field(row, "Projectile light mode", "select", "");
      for (const [label, key] of [
        ["Inherit cell/projectile settings", "inherit"],
        ["Disable for this weapon", "off"],
        ["Custom projectile light", "custom"],
      ])
        lightMode.append(new Option(label, key));
      const light = draft[id]?.light ?? weapon.light;
      lightMode.value = light
        ? light.enabled === false
          ? "off"
          : "custom"
        : "inherit";
      const lightFields = {
        color: field(
          row,
          "Projectile light color",
          "color",
          light?.color || "#ffbd66",
        ),
      };
      for (const [key, label, min, max, initial] of [
        ["radius", "Projectile light radius (metres)", 0.05, 100, 2],
        ["intensity", "Projectile light brightness (0–4)", 0, 4, 1.2],
        ["falloff", "Projectile light falloff", 0.5, 4, 2],
        ["flicker", "Projectile light flicker (0–0.3)", 0, 0.3, 0],
      ]) {
        const control = field(row, label, "number", light?.[key] ?? initial);
        control.min = String(min);
        control.max = String(max);
        control.step = "any";
        lightFields[key] = control;
      }
      /* @function weaponDefinitions.refreshRow — Inputs: checkbox/select change event unused. Returns: nothing; enables profile fields only for selected overrides and custom emission fields only for custom light mode. Retains local text and never touches equipped weapons. */
      function refresh() {
        for (const control of Object.values(fields))
          control.disabled = !enabled.checked;
        lightMode.disabled = !enabled.checked;
        for (const control of Object.values(lightFields))
          control.disabled = !enabled.checked || lightMode.value !== "custom";
      }
      enabled.onchange = refresh;
      lightMode.onchange = refresh;
      refresh();
      rows.push({ id, enabled, fields, lightMode, lightFields });
      box.append(row);
    }
    parent.append(box);
    return /* @function weaponDefinitions.read — Inputs: none. Returns: detached validated overrides or undefined if all profiles inherit. Converts numeric controls to numbers and rejects malformed drafts through validate. No project/runtime mutation; owning dialog handles errors and adoption. */ () => {
      const result = {};
      for (const row of rows)
        if (row.enabled.checked) {
          const values = {};
          for (const [key, control] of Object.entries(row.fields))
            values[key] = numbers[key] ? Number(control.value) : control.value;
          if (row.lightMode.value === "off") values.light = { enabled: false };
          if (row.lightMode.value === "custom") {
            values.light = { enabled: true };
            for (const [key, control] of Object.entries(row.lightFields))
              values.light[key] =
                key === "color" ? control.value : Number(control.value);
          }
          Object.defineProperty(result, row.id, {
            value: values,
            enumerable: true,
          });
        }
      return Object.keys(result).length ? validate(result) : undefined;
    };
  }
  /* @function weaponDefinitions.field — Inputs: parent, accessible label, HTML control type and initial value. Returns: attached control. Checkbox state and explicit numeric units are owned by caller; no persistent state or resource loading. */
  function field(parent, label, type, value) {
    const wrapper = document.createElement("label");
    wrapper.textContent = label;
    const control = document.createElement(
      type === "select" ? "select" : "input",
    );
    if (type !== "select") control.type = type;
    control.setAttribute("aria-label", label);
    if (type === "checkbox") control.checked = value;
    else control.value = value;
    wrapper.append(control);
    parent.append(wrapper);
    return control;
  }
  root.FrontierWeaponDefinitions = { validate, defaults, apply, editor };
})(typeof window === "undefined" ? globalThis : window);
