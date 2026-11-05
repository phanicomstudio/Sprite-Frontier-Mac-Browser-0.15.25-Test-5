  // October 29: zero-priced ordinary crafting items are valid; supersedes the positive-price-only limit in the retained October 13 contract.
/* October 13, 2026: optional project item catalog. Definitions are shared
 * metadata; inventories and dropped stacks remain independent compact records.
 * Original data/items.json and item-manifest.js remain the inherited baseline. */
(/* @function itemDefinitions.install — Inputs: browser/global root. Returns: nothing; installs catalog validation, session adoption and typed authoring. Baseline capture is lazy because item-manifest loads later. Does not change a project or decode model/image assets at script load. */ function (
  root,
) {
  "use strict";
  let baseline;
  /* @function itemDefinitions.validate — Inputs: optional array of definitions. Returns: detached validated array or undefined for shipped catalog inheritance. At most 2,000 stable IDs; finite JSON metadata is retained, with price in whole gold (1–1,000,000). Rejects duplicates, malformed names/visual IDs and oversized properties before adoption. Model existence is checked by project validation against its own bundle bank. */
  function validate(value) {
    if (value === undefined) return undefined;
    if (!Array.isArray(value) || value.length > 2000)
      throw Error("Item catalog supports at most 2,000 definitions.");
    const ids = new Set(),
      result = [];
    for (const item of value) {
      if (
        !item ||
        typeof item.id !== "string" ||
        !item.id.trim() ||
        item.id.length > 100 ||
        ids.has(item.id) ||
        typeof item.name !== "string" ||
        !item.name.trim() ||
        item.name.length > 120
      )
        throw Error("Items need unique IDs and readable names.");
      if (
        !Number.isSafeInteger(item.price) ||
        item.price < 0 ||
        item.price > 1000000
      )
        throw Error("Item price must be 0–1,000,000 whole gold.");
      for (const key of ["graphic", "spriteProfile", "modelId"])
        if (
          item[key] !== undefined &&
          (typeof item[key] !== "string" ||
            !item[key] ||
            item[key].length > 100)
        )
          throw Error("Invalid item visual: " + key);
      const checked = root.FrontierEventSchema.json(item);
      if(checked.inventoryImage!==undefined&&(typeof checked.inventoryImage!=='string'||checked.inventoryImage.length>750000||(checked.inventoryImage&&!/^img\/[^?#]*\.(png|webp|jpg|jpeg)$|^data:image\/png;base64,[A-Za-z0-9+/=]+$/i.test(checked.inventoryImage))||checked.inventoryImage.includes('..')))throw Error('Choose a local inventory image or bounded PNG data.');
      if (checked.properties?.worldHeight !== undefined && (!Number.isFinite(checked.properties.worldHeight) || checked.properties.worldHeight < 0.1 || checked.properties.worldHeight > 20))
        throw Error("Item world height must be 0.1–20 metres.");
      if (checked.properties?.pickupMethod !== undefined && !["interact", "touch"].includes(checked.properties.pickupMethod))
        throw Error("Pickup method must be Interact or Walk over.");
      if (checked.properties?.sprite) {
        const sprite = checked.properties.sprite;
        if (typeof sprite.src !== "string" || !sprite.src.startsWith("img/items/") || sprite.src.includes("..") || !/\.png$/i.test(sprite.src) || !Number.isInteger(sprite.width) || !Number.isInteger(sprite.height) || sprite.width < 1 || sprite.height < 1 || sprite.width > 8192 || sprite.height > 8192)
          throw Error("Invalid item sprite asset or dimensions.");
      }
      if (checked.properties?.light) checked.properties.light = root.FrontierLocalLighting.source(checked.properties.light, "item-light");
      if (checked.properties?.weaponProfile !== undefined && (checked.properties.weaponProfile!=="starter-melee"&&!root.PhanicomABS?.weapons.has(checked.properties.weaponProfile))) throw Error("Unknown item weapon profile.");
      if (checked.properties?.restoreHp !== undefined &&
          (!Number.isFinite(checked.properties.restoreHp) || checked.properties.restoreHp < 0 || checked.properties.restoreHp > 1000000))
        throw Error("Item health recovery must be between 0 and 1,000,000 HP.");
      if (JSON.stringify(checked.properties || {}).length > 8192)
        throw Error("Item properties exceed 8 KiB.");
      ids.add(item.id);
      result.push(checked);
    }
    return result;
  }
  /* @function itemDefinitions.defaults — Inputs: none. Returns: detached shipped definitions; captures the original catalog once before any project override. Missing manifest yields an empty catalog. No texture/model loading or inventory mutation. */
  function defaults() {
    baseline ??= structuredClone(root.FrontierItems || []);
    return structuredClone(baseline);
  }
  /* @function itemDefinitions.apply — Inputs: optional project catalog. Returns: nothing. Validates first, then replaces shared definition metadata with a detached copy; inherited settings restore shipped definitions. Compact inventories/ownership/drop positions are unchanged. Runs at session construction, never each frame. */
  function apply(value) {
    const checked = validate(value),
      shipped = defaults();
    root.FrontierItems = checked ?? shipped;
  }
  /* @function itemDefinitions.editor — Inputs: owning dialog and optional catalog. Returns: validated draft reader. Builds typed ID/name/price/graphic/model fields and extensible properties under Advanced. No saved data changes before owner Apply; inheritance retains draft text while disabling edits. Existing unedited extra definition fields are preserved. */
  function editor(parent, value) {
    const draft = validate(value) || defaults(),
      box = document.createElement("fieldset"),
      legend = document.createElement("legend");
    legend.textContent = "Item definitions";
    box.append(legend);
    const inherit = field(
        box,
        "Use shipped item definitions",
        "checkbox",
        value === undefined,
      ),
      rows = [];
    const help = document.createElement("p");
    help.textContent =
      "Stable item IDs connect inventories and shop stock. Changing an ID creates a different item; unknown saved IDs retain the generic fallback. Dropped items are static and use the selected model or sprite graphic.";
    box.append(help);
    /* @function itemDefinitions.addRow — Inputs: optional existing definition. Returns: nothing; appends an independent local draft row under the 2,000-definition bound. Model choices use already imported project assets without decoding textures. Remove affects only the draft; existing unknown inventory IDs remain runtime-safe. */
    function addRow(item = { id: "", name: "", price: 1, graphic: "chest" }) {
      if (rows.length >= 2000) return;
      const row = document.createElement("details"),
        caption = document.createElement("summary");
      caption.textContent = item.name || "New item";
      row.append(caption);
      row.open = !item.id;
      const id = field(row, "Item ID", "text", item.id),
        name = field(row, "Item name", "text", item.name),
        price = field(row, "Price (whole gold)", "number", item.price),
        graphic = field(
          row,
          "Sprite graphic ID",
          "text",
          item.graphic || "chest",
        ),
        profile = field(
          row,
          "Sprite profile (optional)",
          "text",
          item.spriteProfile || "",
        );
      price.min = "0";
      price.max = "1000000";
      price.step = "1";
      const model = field(row, "Dropped model (optional)", "select", "");
      model.append(new Option("Use sprite graphic", ""));
      for (const asset of root.FrontierModelLibrary?.list() || [])
        model.append(new Option(asset.name, asset.id));
      if (
        item.modelId &&
        !Array.from(model.options).some(
          /* @function itemDefinitions.modelOption — Inputs: existing option. Returns: whether it preserves this item's saved model ID. No asset mutation. */ (
            option,
          ) => option.value === item.modelId,
        )
      )
        model.append(new Option("Missing: " + item.modelId, item.modelId));
      model.value = item.modelId || "";
      const advanced = document.createElement("details"),
        summary = document.createElement("summary");
      summary.textContent = "Advanced item properties";
      advanced.append(summary);
      const properties = field(
        advanced,
        "Item properties (JSON)",
        "textarea",
        JSON.stringify(item.properties || {}, null, 2),
      );
      row.append(advanced);
      // October 14: common item behavior is typed rather than buried in JSON.
      const description = field(row, "Inventory description", "textarea", item.properties?.description || item.description || ""),
        recovery = field(row, "Health restored when used (0 = cannot use)", "number", item.properties?.restoreHp || 0);
      recovery.min = "0";
      recovery.max = "1000000";
      const worldHeight = field(row, "World sprite height (metres)", "number", item.properties?.worldHeight || 0.35),
        pickupMethod = field(row, "Initial pickup method: interact or touch", "text", item.properties?.pickupMethod || "interact"),
        itemLight = item.properties?.light || {},
        lightEnabled = field(row, "Emits world light when placed or dropped", "checkbox", !!itemLight.enabled),
        lightColor = field(row, "Light color", "color", itemLight.color || "#fff0cf"),
        lightRadius = field(row, "Light radius (metres)", "number", itemLight.radius || 4),
        lightIntensity = field(row, "Light brightness (0–4)", "number", itemLight.intensity ?? 1),
        lightZ = field(row, "Light height offset (metres)", "number", itemLight.z ?? 0.35);
      // October 14: pickup choice is a dropdown, not an undocumented text token.
      const methodSelect = document.createElement("select");
      methodSelect.setAttribute("aria-label", "Initial pickup method");
      methodSelect.append(new Option("Interact", "interact"), new Option("Walk over (Quake style)", "touch"));
      methodSelect.value = pickupMethod.value;
      pickupMethod.replaceWith(methodSelect);
      const lightHint = document.createElement("p");
      lightHint.textContent = "World item lights use this map's Local Lighting setting and its source budget. Inventory items emit no world light.";
      row.append(lightHint);
      const equipProfile=field(row,"Weapon equipped from this item (optional)","select","");
      equipProfile.append(new Option("Not a weapon",""));
      for(const [id,weapon] of root.PhanicomABS?.weapons||[])equipProfile.append(new Option(weapon.name||id,id));
      equipProfile.value=item.properties?.weaponProfile||"";
      const protectedItem = field(
        row,
        "Protect newly dropped items from cleanup",
        "checkbox",
        !!item.questProtected,
      );
      const record = {
        item,
        id,
        name,
        price,
        graphic,
        profile,
        model,
        properties,
        description,
        recovery,
        worldHeight, pickupMethod:methodSelect, lightEnabled, lightColor, lightRadius, lightIntensity, lightZ,
        protectedItem,
        equipProfile,
        row,
      };
      rows.push(record);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Remove item definition";
      remove.onclick =
        /* @function itemDefinitions.remove — Inputs: click event unused. Returns: nothing; removes one captured local definition row without changing inventories or saved catalog. */ () => {
          rows.splice(rows.indexOf(record), 1);
          row.remove();
        };
      row.append(remove);
      box.append(row);
      refresh();
    }
    for (const item of draft) addRow(item);
    const add = document.createElement("button");
    add.type = "button";
    add.textContent = "Add item definition";
    add.onclick =
      /* @function itemDefinitions.clickAdd — Inputs: click event unused. Returns: nothing; appends an empty local draft under the documented catalog bound. */ () =>
        addRow();
    box.append(add);
    const addArsenal=document.createElement("button");addArsenal.type="button";addArsenal.textContent="Add weapon and ammunition pickup presets";
    addArsenal.onclick=/* @function itemDefinitions.addArsenalPresets — Inputs: ignored click. Returns nothing; adds missing shipped weapon/ammunition definitions to this local catalog draft. Existing matching IDs and custom definitions are retained. Requires the existing inheritance checkbox to be unchecked; owner Apply validates/saves the draft. */function(){for(const item of defaults()){if(!item.properties?.weaponProfile&&!['ammo9','ammo-shells','ammo-nails','ammo-rockets','ammo-cells'].includes(item.id))continue;if(rows.some(/* @function itemDefinitions.existingPreset — Inputs: current local row. Returns ID equality to avoid duplicates; no effects. */function(row){return row.id.value.trim()===item.id;}))continue;addRow(item);}};
    box.append(addArsenal);
    parent.append(box);
    /* @function itemDefinitions.refresh — Inputs: checkbox change event unused. Returns: nothing; disables definition controls while inheriting without deleting the draft. No global or project effects. */
    function refresh() {
      for (const control of box.querySelectorAll(
        "input,textarea,select,button",
      ))
        if (control !== inherit) control.disabled = inherit.checked;
    }
    inherit.onchange = refresh;
    refresh();
    return /* @function itemDefinitions.read — Inputs: none. Returns: undefined for inherited catalog or detached validated draft definitions. Parses Advanced properties as data only and rejects missing selected model assets before project adoption. Errors remain in the owning dialog; no saved mutation. */ () => {
      if (inherit.checked) return undefined;
      const result = [];
      for (const row of rows) {
        const item = {
          ...row.item,
          id: row.id.value.trim(),
          name: row.name.value.trim(),
          price: Number(row.price.value),
          graphic: row.graphic.value.trim(),
          properties: JSON.parse(row.properties.value),
        };
        if(row.equipProfile.value)item.properties.weaponProfile=row.equipProfile.value;else delete item.properties.weaponProfile;
        item.properties.description = row.description.value;
        item.properties.restoreHp = Number(row.recovery.value);
        item.properties.worldHeight = Number(row.worldHeight.value);
        item.properties.pickupMethod = row.pickupMethod.value.trim();
        item.properties.light = root.FrontierLocalLighting.source({ enabled:row.lightEnabled.checked, color:row.lightColor.value, radius:Number(row.lightRadius.value), intensity:Number(row.lightIntensity.value), z:Number(row.lightZ.value) }, "item-light");
        if (row.protectedItem.checked) item.questProtected = true;
        else delete item.questProtected;
        delete item.spriteProfile;
        delete item.modelId;
        if (row.profile.value.trim())
          item.spriteProfile = row.profile.value.trim();
        if (row.model.value) {
          if (!root.FrontierModelLibrary.get(row.model.value))
            throw Error("Missing dropped model: " + row.model.value);
          item.modelId = row.model.value;
        }
        result.push(item);
      }
      return validate(result);
    };
  }
  /* @function itemDefinitions.field — Inputs: parent, accessible label, control type and initial value. Returns: attached labeled control. Prices use explicit whole-gold bounds at caller; textarea is reserved for extensible advanced properties. No persistence or asset work. */
  function field(parent, label, type, value) {
    const wrapper = document.createElement("label");
    wrapper.textContent = label;
    const control = document.createElement(
      type === "select" ? "select" : type === "textarea" ? "textarea" : "input",
    );
    if (!["select", "textarea"].includes(type)) control.type = type;
    control.setAttribute("aria-label", label);
    if (type === "checkbox") control.checked = value;
    else control.value = value;
    wrapper.append(control);
    parent.append(wrapper);
    return control;
  }
  /* @function itemDefinitions.merge — Inputs: existing optional catalog, incoming optional catalog and model-ID remapping Map from import. Returns: detached merged catalog, retaining inheritance if the incoming project has no override. Rejects differing definitions for the same stable item ID before project/model adoption rather than silently changing inventories in existing cells. No global mutation; callers display the conflict for explicit author repair. */
  function merge(existing, incoming, mapping) {
    if (incoming === undefined) return validate(existing);
    const current = validate(existing) || defaults(),
      added = validate(incoming),
      byId = new Map();
    for (const item of current) byId.set(item.id, item);
    for (const item of added) {
      if (item.modelId)
        item.modelId = mapping.get(item.modelId) || item.modelId;
      const old = byId.get(item.id);
      if (old && JSON.stringify(old) !== JSON.stringify(item))
        throw Error(
          "Conflicting item definition: " +
            item.id +
            ". Give the incoming item a distinct ID or match its definition before importing.",
        );
      if (!old) {
        byId.set(item.id, item);
        current.push(item);
      }
    }
    return validate(current);
  }
  root.FrontierItemDefinitions = { validate, defaults, apply, editor, merge };
})(typeof window === "undefined" ? globalThis : window);
