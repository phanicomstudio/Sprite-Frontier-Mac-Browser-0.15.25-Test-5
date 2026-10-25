/* October 12, 2026: paint/erase/rectangle floor layouts with native 3D preview.
 * Draft tiles never modify the world until Apply. Existing independently placed
 * modules are retained; generated IDs own only their grid-layout group. */
(/* @function layoutEditor.install — Inputs: browser namespace. Returns: nothing. Publishes the layout factory; no authoring state exists outside its owning cell adapter. */ function (
  root,
) {
  "use strict";
  /* @function layoutEditor.create — Inputs: application adapter plus optional transient building-preview operation. Returns: refresh/draw controller. Creates grid drafting and material controls; all confirmed geometry passes through the validated undo transaction. */
  function create(api) {
    const panel = document.createElement("fieldset");
    panel.id = "roomLayoutTools";
    panel.innerHTML =
      '<legend>Tile Structure Builder</legend><p>Paint floors; walls follow the perimeter. Green tiles are a draft until Apply. Erase creates real gaps, not invisible walkable ground.</p><label>Layout tool<select id="layoutTool"><option value="paint">Paint floor</option><option value="erase">Erase floor</option><option value="rectangle">Drag floor rectangle</option><option value="door">Toggle doorway at nearest outer edge</option></select></label><div id="layoutFields"></div><label><input id="layoutCeiling" type="checkbox" checked>Add ceiling</label><div id="layoutMaterials"></div><canvas id="layoutPlan" width="420" height="280" aria-label="Paintable room floor grid"></canvas><button id="layoutApply">Apply room layout</button><button id="layoutCancel">Discard layout draft</button><p id="layoutStatus" role="status">Paint tiles on a 3D room or outdoor map, then Apply to build.</p>';
    document.getElementById("editor").append(panel);
    // October 14 Test 5: the tile builder owns a large separate dialog. Original
    // IDs/handlers are retained; the dock keeps a launcher, not a second editor.
    const tileWindow = document.createElement("dialog");
    tileWindow.id = "tileRoomWindow";
    tileWindow.setAttribute("aria-labelledby", "tileRoomTitle");
    const heading = document.createElement("header");
    heading.innerHTML = '<h2 id="tileRoomTitle">Tile Room Editor</h2><button id="tileRoomClose" type="button">Close editor</button>';
    const settings = document.createElement("section"), stage = document.createElement("section");
    settings.className = "tileRoomSettings"; stage.className = "tileRoomStage";
    const dimensions = document.createElement("details");
    dimensions.innerHTML = '<summary>Grid dimensions and room height</summary>';
    dimensions.append(document.getElementById("layoutFields"));
    settings.append(document.getElementById("layoutMaterials"), dimensions, document.getElementById("layoutCeiling").closest("label"));
    stage.append(document.getElementById("layoutTool").closest("label"), document.getElementById("layoutPlan"));
    const replaceLabel = document.createElement("label");
    replaceLabel.innerHTML = '<input id="layoutReplaceMaterials" type="checkbox" checked>Apply chosen textures to existing layout surfaces';
    settings.append(replaceLabel);
    const applyTextures = document.createElement("button");
    applyTextures.id = "layoutApplyTextures"; applyTextures.type = "button";
    applyTextures.textContent = "Apply textures to all room surfaces";
    settings.append(applyTextures);
    stage.append(document.getElementById("layoutApply"), document.getElementById("layoutCancel"), document.getElementById("layoutStatus"));
    panel.append(settings, stage);
    const launcher = document.createElement("button");
    launcher.id = "openTileRoomBuilder"; launcher.type = "button"; launcher.textContent = "Open Tile Room Editor";
    panel.before(launcher);
    tileWindow.append(heading, panel); document.body.append(tileWindow);
    /* @function layoutEditor.openWindow — Inputs: none. Returns nothing; opens the existing tile editor as a modal authoring window, preserving its unsaved draft. Runtime/playtest cannot open it. No authored data changes. */
    function openWindow() { if (api.editing() && !root.FRONTIER_RUNTIME_ONLY && !tileWindow.open) { tileWindow.showModal(); tileWindow.scrollTop = 0; settings.scrollTop = 0; stage.scrollTop = 0; dirty = true; } }
    launcher.onclick = openWindow;
    root.FrontierTileRoomWindow = {open:openWindow};
    document.getElementById("tileRoomClose").onclick = /* @function layoutEditor.closeWindow — Inputs: ignored click. Returns nothing; closes the tile editor while retaining draft settings. Apply/Discard remain explicit. */ function () { tileWindow.close(); };

    /* @function layoutEditor.control — Inputs: control ID. Returns: DOM element or null. No scene mutation. */
    function control(id) {
      return document.getElementById(id);
    }
    for (const [key, label, value, min, max, step] of [
      ["originX", "Grid origin X", 2, 1, 511, 0.1],
      ["originY", "Grid origin Y", 2, 1, 511, 0.1],
      ["tile", "Tile size (metres)", 2, 0.5, 8, 0.5],
      ["z", "Floor elevation Z", 0, -29, 79, 0.1],
      ["height", "Room height", 3, 1.8, 20, 0.1],
      ["thickness", "Wall/slab thickness", 0.2, 0.05, 0.5, 0.05],
    ]) {
      const labelElement = document.createElement("label");
      labelElement.textContent = label;
      const input = document.createElement("input");
      input.id = "layout-" + key;
      input.type = "number";
      input.value = value;
      input.min = min;
      input.max = max;
      input.step = step;
      labelElement.append(input);
      control("layoutFields").append(labelElement);
    }
    for (const role of ["wall", "floor", "ceiling"]) {
      const label = document.createElement("label");
      label.textContent = role[0].toUpperCase() + role.slice(1) + " texture";
      const select = document.createElement("select");
      select.id = "layout-material-" + role;
      for (const option of control("roomSurface").options)
        select.append(new Option(option.textContent, option.value));
      select.value =
        role === "wall"
          ? "img/materials/walls/Tex_Castle_2.png"
          : role === "floor"
            ? "img/materials/floors/prop_wood_floor1.png"
            : "img/materials/ceilings/prop_tin_ceiling1.png";
      label.append(select);
      const thumbnail = document.createElement("img");
      thumbnail.id = "layout-preview-" + role; thumbnail.alt = role + " texture preview";
      const upload = document.createElement("input"); upload.type = "file"; upload.accept = "image/png,image/jpeg,image/webp";
      upload.id = "layout-upload-" + role;
      const uploadLabel = document.createElement("label"); uploadLabel.textContent = "Load your own " + role + " texture"; uploadLabel.append(upload);
      upload.onchange = /* @function layoutEditor.importRoleTexture — Inputs: file input change. Returns Promise; reads one PNG/JPEG/WebP up to 8MB, decodes it before adding an embedded data URL option for this role. Updates only the draft/thumbnail until Apply; failures leave the previous choice and display an error. Embedded bytes survive portable project saves. */ async function () {
        const file = upload.files?.[0]; if (!file) return;
        try {
          if (!["image/png","image/jpeg","image/webp"].includes(file.type) || file.size > 8*1024*1024) throw Error("Choose a PNG, JPEG or WebP texture up to 8 MB.");
          const data = await new Promise(/* @function layoutEditor.readRoleFile — Inputs: promise callbacks. Returns nothing; resolves embedded FileReader data or rejects a read failure. No filesystem writes. */ function(resolve,reject) {
            const reader = new FileReader();
            reader.onload = /* @function layoutEditor.textureRead — Inputs: ignored read event. Returns nothing; resolves data URL bytes. */ function(){resolve(reader.result);};
            reader.onerror = /* @function layoutEditor.textureReadError — Inputs: ignored read event. Returns nothing; rejects file failure. */ function(){reject(Error("Texture could not be read."));};
            reader.readAsDataURL(file);
          });
          const image = new Image(); image.src = data; await image.decode();
          if (!image.naturalWidth || !image.naturalHeight) throw Error("Texture has no image pixels.");
          select.append(new Option(file.name, data)); select.value = data;
          updateThumbnail(role); preview();
        } catch (error) { message(error.message); }
        finally { upload.value = ""; }
      };
      const card = document.createElement("section"); card.className = "tileTextureCard";
      card.append(label, thumbnail, uploadLabel);
      control("layoutMaterials").append(card);
    }
    const canvas = control("layoutPlan"),
      ctx = canvas.getContext("2d");
    let draft = null,
      drag = null,
      dirty = true;
    /* @function layoutEditor.message — Inputs: plain text. Returns: nothing. Updates draft status; no per-frame logging. */
    function message(text) {
      control("layoutStatus").textContent = text;
    }
    /* @function layoutEditor.read — Inputs: none. Returns: validated copy of current draft and dimensional controls. Throws invalid dimensions/capacity before preview or commit. Does not change authored world. */
    function read() {
      const value = {
        ...(draft || {}),
        ceiling: control("layoutCeiling").checked,
      };
      for (const key of [
        "originX",
        "originY",
        "tile",
        "z",
        "height",
        "thickness",
      ])
        value[key] = Number(control("layout-" + key).value);
      const w = api.world();
      return root.FrontierRoomLayout.validate(value, {
        width: w.width ?? w.size,
        height: w.height ?? w.size,
      });
    }
    /* @function layoutEditor.updateThumbnail — Inputs: surface role wall/floor/ceiling. Returns nothing; updates its image using embedded/offline catalog data. Plain-color selections hide the preview. No authored changes. */
    function updateThumbnail(role) {
      const value = control("layout-material-"+role).value, image = control("layout-preview-"+role);
      image.hidden = !value; if (value) image.src = root.FrontierRoomTextureData?.[value] || value;
    }
    /* @function layoutEditor.compileDraft — Inputs: validated layout and existing primitives. Returns generated layout with optional explicit role-texture replacement; manual geometry deltas are retained by the original compiler. Only when the visible replacement checkbox is checked are prior per-piece texture overrides replaced. No authored mutation. */
    function compileDraft(value, existing) {
      const chosen = materials(), result = root.FrontierRoomLayout.compile(value, chosen, existing);
      if (control("layoutReplaceMaterials").checked) for (const piece of result.primitives) {
        const material = chosen[piece.moduleType];
        if (material) { piece.texture = material.texture; piece.tileSize = material.tileSize; piece.preserveAspect = true; piece.layoutMaterial = {...piece.layoutMaterial,...material}; }
      }
      return result;
    }
    /* @function layoutEditor.materials — Inputs: none. Returns: three shared material descriptors with repeat/aspect defaults. Does not copy images or alter geometry dimensions. */
    function materials() {
      const value = {};
      for (const role of ["wall", "floor", "ceiling"])
        value[role] = {
          texture: control("layout-material-" + role).value || undefined,
          tileSize: Number(control("layout-tile").value),
          preserveAspect: true,
        };
      return value;
    }
    /* @function layoutEditor.preview — Inputs: none. Returns: nothing. Compiles the draft to a transient 3D outline and reports capacity/geometry errors. The active world, collision and undo history remain untouched. */
    function preview() {
      dirty = true;
      try {
        const value = read(),
          compiled = compileDraft(value, api.world().interior?.primitives || []);
        api.preview?.(compiled);
        message(
          value.cells.length +
            " draft floor tiles · " +
            compiled.primitives.length +
            " generated pieces. Apply to commit.",
        );
      } catch (error) {
        api.preview?.(null);
        message(error.message);
      }
    }
    /* @function layoutEditor.refresh — Inputs: none. Returns: nothing. Replaces unsaved draft from current cell after map/history changes; controls reflect persisted layout values. Independent model/primitive state remains untouched. */
    function refresh() {
      draft = structuredClone(
        api.world().interior?.layout || {
          originX: 2,
          originY: 2,
          tile: 2,
          z: 0,
          height: 3,
          thickness: 0.2,
          ceiling: true,
          cells: [],
          doors: [],
        },
      );
      for (const key of [
        "originX",
        "originY",
        "tile",
        "z",
        "height",
        "thickness",
      ])
        control("layout-" + key).value = draft[key];
      control("layoutCeiling").checked = draft.ceiling;
      for (const role of ["wall","floor","ceiling"]) {
        const saved = draft.materials?.[role]?.texture ?? api.world().interior?.primitives.find(
          /* @function layoutEditor.savedRoleMaterial — Inputs: primitive. Returns matching generated surface role; no mutation. */ function(piece){return piece.layoutGroup === "grid-layout" && piece.moduleType === role;})?.texture;
        const select = control("layout-material-"+role);
        const texture = saved ?? (role === "wall" ? "img/materials/walls/Tex_Castle_2.png" : role === "floor" ? "img/materials/floors/prop_wood_floor1.png" : "img/materials/ceilings/prop_tin_ceiling1.png");
        if (!Array.from(select.options).some(/* @function layoutEditor.knownSavedTexture — Inputs: option. Returns value equality for the saved embedded/catalog texture; no mutation. */ function(option){return option.value === texture;})) select.append(new Option("Saved custom " + role + " texture",texture));
        select.value = texture; updateThumbnail(role);
      }
      drag = null;
      dirty = true;
    }
    /* @function layoutEditor.point — Inputs: pointer event. Returns: integer grid tile plus fractional position, calculated from world-scaled top-down view. Throws invalid form settings before altering draft. */
    function point(event) {
      const value = read(),
        w = api.world(),
        rect = canvas.getBoundingClientRect(),
        x = ((event.clientX - rect.left) * 420) / rect.width,
        y = ((event.clientY - rect.top) * 280) / rect.height,
        scale = Math.min(400 / (w.width ?? w.size), 260 / (w.height ?? w.size)),
        wx = (x - 10) / scale,
        wy = (280 - y - 10) / scale,
        gx = (wx - value.originX) / value.tile,
        gy = (wy - value.originY) / value.tile;
      return {
        x: Math.floor(gx),
        y: Math.floor(gy),
        fx: gx - Math.floor(gx),
        fy: gy - Math.floor(gy),
      };
    }
    /* @function layoutEditor.stamp — Inputs: grid tile and paint/erase mode. Returns: nothing. Updates only the draft set, deduplicates painted tiles and removes invalid doorway markers after erasure. Invalid negative cells are ignored; validation reports map overflow. */
    function stamp(p, mode) {
      if (p.x < 0 || p.y < 0) return;
      const index = draft.cells.findIndex(
        /* @function layoutEditor.findTile — Inputs: tile pair. Returns: exact draft coordinate match. */ function (
          c,
        ) {
          return c[0] === p.x && c[1] === p.y;
        },
      );
      if (mode === "erase") {
        if (index >= 0) draft.cells.splice(index, 1);
        draft.doors = draft.doors.filter(
          /* @function layoutEditor.keepDoorOwner — Inputs: doorway. Returns: whether its owner tile was not erased. */ function (
            d,
          ) {
            return d.x !== p.x || d.y !== p.y;
          },
        );
      } else if (index < 0) {
        // October 14: validate BEFORE changing the draft. Previously painting
        // past the map poisoned read(), so subsequent erase/draw also failed.
        const candidate = { ...read(), cells: [...draft.cells, [p.x, p.y]] };
        const w = api.world();
        root.FrontierRoomLayout.validate(candidate, { width: w.width ?? w.size, height: w.height ?? w.size });
        draft.cells.push([p.x, p.y]);
      }
    }
    canvas.onpointerdown =
      /* @function layoutEditor.beginStroke — Inputs: pointer event. Returns: nothing. Starts one draft stroke or toggles an outer doorway edge; captures the pointer for rectangle/paint continuity. No history entry until Apply. */ function (
        event,
      ) {
        if (event.button !== 0 || !api.editing()) return;
        try {
          const p = point(event),
            mode = control("layoutTool").value;
          if (mode === "door") {
            if (
              !draft.cells.some(
                /* @function layoutEditor.doorOwner — Inputs: tile. Returns: clicked owner match. */ function (
                  c,
                ) {
                  return c[0] === p.x && c[1] === p.y;
                },
              )
            )
              throw Error("Place a floor tile before adding a doorway.");
            const edges = [
              ["west", p.fx, -1, 0],
              ["east", 1 - p.fx, 1, 0],
              ["south", p.fy, 0, -1],
              ["north", 1 - p.fy, 0, 1],
            ];
            edges.sort(
              /* @function layoutEditor.nearestEdge — Inputs: two edge distances. Returns: closest edge ordering. */ function (
                a,
                b,
              ) {
                return a[1] - b[1];
              },
            );
            const [side, , dx, dy] = edges[0];
            if (
              draft.cells.some(
                /* @function layoutEditor.adjacentDoorTile — Inputs: tile. Returns: whether this edge is internal to the painted floor union. */ function (
                  c,
                ) {
                  return c[0] === p.x + dx && c[1] === p.y + dy;
                },
              )
            )
              throw Error(
                "Choose an outer edge; internal floor joins already remain open.",
              );
            const index = draft.doors.findIndex(
              /* @function layoutEditor.existingDoor — Inputs: doorway. Returns: selected tile/side match. */ function (
                d,
              ) {
                return d.x === p.x && d.y === p.y && d.side === side;
              },
            );
            if (index >= 0) draft.doors.splice(index, 1);
            else {
              const value = read(), w = api.world();
              root.FrontierRoomLayout.validate({ ...value, doors: [...draft.doors, { x: p.x, y: p.y, side }] }, { width: w.width ?? w.size, height: w.height ?? w.size });
              draft.doors.push({ x: p.x, y: p.y, side });
            }
            preview();
            return;
          }
          drag = { mode, start: p, last: p };
          if (mode !== "rectangle") stamp(p, mode);
          canvas.setPointerCapture(event.pointerId);
          preview();
        } catch (error) {
          // Rejected press must not leave a gesture whose release hides the error.
          drag = null;
          dirty = true;
          message(error.message);
        }
      };
    canvas.onpointermove =
      /* @function layoutEditor.moveStroke — Inputs: pointer event. Returns: nothing. Interpolates draft paint/erase cells to avoid gaps on fast strokes; rectangles wait for release. Compiles preview on pointer changes, never every animation frame. */ function (
        event,
      ) {
        if (!drag) return;
        try {
          const p = point(event);
          if (drag.mode !== "rectangle") {
            const a = drag.last,
              count = Math.max(Math.abs(p.x - a.x), Math.abs(p.y - a.y), 1);
            for (let i = 1; i <= Math.min(count, 128); i++)
              stamp(
                {
                  x: Math.round(a.x + ((p.x - a.x) * i) / count),
                  y: Math.round(a.y + ((p.y - a.y) * i) / count),
                },
                drag.mode,
              );
          }
          drag.last = p;
          preview();
        } catch (error) {
          message(error.message);
        }
      };
    canvas.onpointerup =
      /* @function layoutEditor.finishStroke — Inputs: pointer event. Returns: nothing. Fills an inclusive draft rectangle when selected and releases stroke state. Capacity is validated before commit. */ function (
        event,
      ) {
        if (!drag) return;
        try {
          const p = point(event);
          if (drag.mode === "rectangle") {
            const a = drag.start;
            if ((Math.abs(p.x - a.x) + 1) * (Math.abs(p.y - a.y) + 1) > 128)
              throw Error("Rectangle exceeds 128 tiles.");
            for (let x = Math.min(a.x, p.x); x <= Math.max(a.x, p.x); x++)
              for (let y = Math.min(a.y, p.y); y <= Math.max(a.y, p.y); y++)
                stamp({ x, y }, "paint");
          }
          drag = null;
          preview();
        } catch (error) {
          drag = null;
          message(error.message);
        }
      };
    canvas.onpointercancel =
      /* @function layoutEditor.cancelStroke — Inputs: cancel event (unused). Returns: nothing. Ends pointer capture state; draft can still be discarded without changing the world. */ function () {
        drag = null;
      };
    control("layoutApply").onclick =
      /* @function layoutEditor.apply — Inputs: click (unused). Returns: nothing. Compiles and commits the layout once through history, retaining independent modules and manual edits of matching generated IDs. Invalid cells or capacity leave authored data intact. */ function () {
        try {
          const value = read(),
            room = root.FrontierInterior.structureDraft(api.world());
          if (room?.mode !== "geometry")
            throw Error("This map uses PNG artwork. Choose a 3D room or outdoor map to build structures.");
          value.materials = materials();
          const generated = compileDraft(value, room.primitives);
          const accepted = api.mutate(
            /* @function layoutEditor.commit — Inputs: none. Returns: nothing. Replaces only owned grid-layout primitives and persists draft metadata; normal validation/history handles errors atomically. */ function () {
              // October 14: create outdoor geometry only inside this Undo
              // transaction; preview and invalid Apply never change the map.
              const r = api.world().interior || (api.world().interior = room);
              r.primitives = r.primitives
                .filter(
                  /* @function layoutEditor.keepIndependent — Inputs: primitive. Returns: whether it is independent of the generated grid. */ function (
                    e,
                  ) {
                    return e.layoutGroup !== "grid-layout";
                  },
                )
                .concat(generated.primitives);
              r.layout = value;
              if (generated.floor && !r.outdoor) r.floor = generated.floor;
              /* October 12: horizontal support alone cannot retain arrival Z when a floor is raised. Synchronize every entrance independently, even when the spawn was already supported. October 14: outdoor structures do not rewrite map spawns. */ if (!r.outdoor) root.FrontierRoomLayout.synchronizeArrivals(
                api.world(),
                value,
                generated.primitives,
              );
            },
          );
          if (accepted !== false) {
            api.preview?.(null);
            message(
              "Layout applied. Direct 3D edits and Undo remain available.",
            );
          }
        } catch (error) {
          message(error.message);
        }
      };
    control("layoutCancel").onclick =
      /* @function layoutEditor.discard — Inputs: click (unused). Returns: nothing. Restores draft from authored cell and clears the transient 3D preview. */ function () {
        refresh();
        api.preview?.(null);
        message("Draft discarded. Authored room unchanged.");
      };
    for (const key of [
      "originX",
      "originY",
      "tile",
      "z",
      "height",
      "thickness",
    ])
      control("layout-" + key).onchange = preview;
    control("layoutCeiling").onchange = preview;
    for (const role of ["wall", "floor", "ceiling"])
      control("layout-material-" + role).onchange = /* @function layoutEditor.roleChanged — Inputs: ignored change. Returns nothing; refreshes role thumbnail and draft preview. No authored edit before Apply. */ function(){updateThumbnail(role);preview();};
    control("layoutReplaceMaterials").onchange = preview;
    control("layoutApplyTextures").onclick = /* @function layoutEditor.textureAllRoomSurfaces — Inputs: ignored click. Returns nothing; applies the three chosen role textures to generated or named wall/floor/ceiling primitives in one Undo transaction. Unclassified furniture/boxes are retained. Geometry and collision dimensions do not change; reports when no surfaces match. */ function () {
      const selected = materials(); let count = 0;
      const accepted = api.mutate(/* @function layoutEditor.commitAllTextures — Inputs: none. Returns nothing; classifies authored structural surfaces by module type then legacy surface names, writes texture settings and records layout role materials. Throws if no surfaces match so no empty Undo is committed. */ function () {
        const room = api.world().interior;
        for (const piece of room?.primitives || []) {
          let role = ["wall","floor","ceiling"].includes(piece.moduleType) ? piece.moduleType : null;
          if (!role) { const name = (piece.name || "").toLowerCase(); role = name.includes("ceiling") ? "ceiling" : name.includes("floor") ? "floor" : name.includes("wall") ? "wall" : null; }
          if (!role) continue;
          const material = selected[role]; Object.assign(piece,material); piece.texture = material.texture;
          if (piece.layoutGroup === "grid-layout") piece.layoutMaterial = {...piece.layoutMaterial,...material};
          count++;
        }
        if (!count) throw Error("Build or apply a room first; no wall, floor or ceiling surfaces were found.");
        if (room.layout) room.layout.materials = selected;
      });
      message(accepted === false ? "No textures applied. Build a room first or check the editor status." : "Textures applied to " + count + " room surfaces. Undo restores the previous textures.");
    };
    /* @function layoutEditor.draw — Inputs: none. Returns: nothing. Draws the draft grid and doorway markers while authoring, only when changed. Uses world positions so layout and 3D scene share units. Does not rebuild generated geometry per frame. */
    function draw() {
      if (!api.editing() || !dirty) return;
      dirty = false;
      const w = api.world(),
        scale = Math.min(400 / (w.width ?? w.size), 260 / (w.height ?? w.size));
      let value;
      try {
        value = read();
      } catch (error) {
        // Keep the last usable grid visible while a dimensional input is invalid.
        message(error.message + " Correct the field to continue; the draft is retained.");
        return;
      }
      ctx.clearRect(0, 0, 420, 280);
      ctx.fillStyle = "#101827";
      ctx.fillRect(0, 0, 420, 280);
      ctx.strokeStyle = "#29415d";
      ctx.lineWidth = 1;
      for (let x = value.originX; x < (w.width ?? w.size); x += value.tile) {
        ctx.beginPath();
        ctx.moveTo(10 + x * scale, 10);
        ctx.lineTo(10 + x * scale, 270);
        ctx.stroke();
      }
      for (let y = value.originY; y < (w.height ?? w.size); y += value.tile) {
        ctx.beginPath();
        ctx.moveTo(10, 270 - y * scale);
        ctx.lineTo(410, 270 - y * scale);
        ctx.stroke();
      }
      ctx.fillStyle = "#348866";
      for (const [x, y] of value.cells)
        ctx.fillRect(
          10 + (value.originX + x * value.tile) * scale,
          270 - (value.originY + (y + 1) * value.tile) * scale,
          value.tile * scale,
          value.tile * scale,
        );
      ctx.strokeStyle = "#ffd273";
      ctx.lineWidth = 3;
      for (const d of value.doors) {
        const x = 10 + (value.originX + (d.x + 0.5) * value.tile) * scale,
          y = 270 - (value.originY + (d.y + 0.5) * value.tile) * scale,
          h = (value.tile * scale) / 2;
        ctx.beginPath();
        if (d.side === "north" || d.side === "south") {
          const py = y + (d.side === "north" ? -h : h);
          ctx.moveTo(x - h * 0.4, py);
          ctx.lineTo(x + h * 0.4, py);
        } else {
          const px = x + (d.side === "west" ? -h : h);
          ctx.moveTo(px, y - h * 0.4);
          ctx.lineTo(px, y + h * 0.4);
        }
        ctx.stroke();
      }
    }
    refresh();
    return { refresh, draw };
  }
  root.FrontierLayoutEditor = { create };
})(window);
