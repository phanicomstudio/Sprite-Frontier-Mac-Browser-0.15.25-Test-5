/* Room overlays run only while visible. Pointer gestures commit once through
 * the shared validation/undo path; they never mutate the playtest mid-drag. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function room-editor.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier room editor. */
(/* @function room-editor.installReviewed — Installs visible-only room overlays and authored pointer transactions. A gesture commits once through shared validation/Undo after preview; it does not mutate the playtest midway through a drag. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: api. Updates: box inner html; connections inner html; label text content; i id; i type. Uses: document get element by id; document create element; host append; $. Returns: a record containing refresh, draw. */
  /* @function roomEditor.reviewedcreate_2 — Builds the interior authoring panel and gesture controller once. Inputs: editor owner api providing current world/maps, editing state, validated mutation/Undo and logging. Returns refresh/draw operations. Appends controls and canvas, registers listeners and retains only local draft/selection state; mutations run through api.mutate. Requires existing editor DOM and interior/terrain services; setup errors propagate. Canvas logical size is 420 by 237 pixels, geometry uses world metres. */ function create(
    api,
  ) {
    const host = document.getElementById("editor"),
      box = document.createElement("fieldset");
    box.innerHTML = `<legend>Interior authoring</legend><p>Room Test is available in Active map. Fixed artwork and free-camera geometry use the same collision tools.</p><label>Room style<select id="roomMode"><option value="outdoor">Outdoor / existing terrain</option><option value="fixed">Fixed camera + artwork</option><option value="geometry">Free camera + geometry</option></select></label><button id="applyRoomMode">Apply room style</button><label>Room artwork<input id="roomImage" type="file" accept="image/png,image/jpeg,image/webp"></label><label>Character height in room image (pixels)<input id="roomCharacterPixels" type="range" min="40" max="500" step="1"><output id="roomScaleReadout"></output></label><button id="applyRoomScale">Apply room character scale</button><p>Match the height ruler to a person in your render. This scales characters and furniture height without moving the floor outline or exits.</p><details><summary>Camera alignment</summary><p>Align the floor axes to your render. Changes do not alter collision coordinates.</p><div id="roomCameraFields"></div><button id="applyRoomCamera">Apply camera alignment</button></details><label>Draw tool<select id="roomTool"><option value="select">Select / drag point or object</option><option value="floor">Draw floor outline</option><option value="blocker">Drag solid footprint / wall</option><option value="spawn">Place player spawn</option><option value="entrance">Place entrance</option><option value="exit">Place map exit</option><option value="primitive">Drag 3D box / floor panel</option><option value="sprite">Place furniture sprite</option></select></label><canvas id="roomPlan" width="420" height="237" aria-label="Room collision and entrance editor"></canvas><button id="finishRoomFloor">Finish floor outline</button><button id="cancelRoomDrawing">Cancel drawing</button><p>Floor: click corners, then Finish. Footprints and boxes: drag. Exterior exits: place the center beyond the floor and overlap its edge with the radius to make a walk-through opening. Select: drag floor corners or placed objects. Green is walkable; red is solid. Undo uses the main editor Undo button.</p><label>Selected room element<select id="roomSelection"></select></label><label>Name<input id="roomElementName" maxlength="80"></label><div id="roomElementFields"></div><label>Furniture image<input id="roomSpriteImage" type="file" accept="image/png,image/webp"></label><label>Normal map for selected sprite / room<input id="roomNormalImage" type="file" accept="image/png"></label><details><summary>Room light</summary><label>Ambient brightness<input id="roomAmbient" type="number" min="0" max="1" step="0.05" value="0.35"></label><label>Main light strength<input id="roomLightStrength" type="number" min="0" max="2" step="0.05" value="0.8"></label><label>Light direction X<input id="roomLightX" type="number" min="-1" max="1" step="0.1" value="-0.5"></label><label>Light direction Y<input id="roomLightY" type="number" min="-1" max="1" step="0.1" value="0.5"></label><label>Light direction Z<input id="roomLightZ" type="number" min="0.1" max="1" step="0.1" value="1"></label><button id="applyRoomLight">Apply room light</button></details><button id="applyRoomElement">Apply selected element</button><button id="deleteRoomElement">Delete selected element</button></fieldset>`;
    host.append(box);
    const surfaces = document.createElement("div");
    surfaces.innerHTML =
      '<label>Snap grid (world units; 0 disables)<input id="roomSnap" type="number" min="0" max="4" step="0.1" value="0.5"></label><label>Surface texture<select id="roomSurface"><option value="">Plain color</option><option value="img/materials/walls/Tex_Castle_2.png">Castle stone 2</option><option value="img/materials/roofs/Tex_Castle_roof_1.png">Castle roof tiles</option><option value="img/materials/walls/prop_wood_panel_wall1.png">Wood wall</option><option value="img/materials/walls/prop_wall_1.png">Wall 1</option><option value="img/materials/floors/prop_wood_floor1.png">Wood floor</option><option value="img/materials/floors/prop_tile_floor1.png">Tile floor</option><option value="img/materials/ceilings/prop_tin_ceiling1.png">Tin ceiling</option></select></label><label>Texture repeat size (world units)<input id="roomTileSize" type="number" min="0.05" max="100" step="0.1" value="2"></label>';
    box.append(surfaces);
    // October 12, 2026: material controls change mapping, not wall dimensions.
    const materialControls = document.createElement("div");
    materialControls.innerHTML =
      '<label>Mapping<select id="roomTextureMapping"><option value="auto">Automatic material mapping</option><option value="repeat">Repeat seamless texture</option><option value="fit">Fit one image per face</option><option value="wallHeight">Fit floor to ceiling; repeat horizontally</option></select></label><label><input id="roomTextureAspect" type="checkbox">Preserve image proportions when repeating</label><label>Texture rotation (degrees)<input id="roomTextureRotation" type="number" value="0" step="15"></label><label>Horizontal offset (repeats)<input id="roomTextureOffsetU" type="number" value="0" step="0.1"></label><label>Vertical offset (repeats)<input id="roomTextureOffsetV" type="number" value="0" step="0.1"></label>';
    surfaces.append(materialControls);
    // October 13: visual material selection supplements the existing saved
    // surface selector. Selecting a thumbnail only changes the authoring draft;
    // Apply selected element remains the explicit undoable commit boundary.
    const texturePalette = document.createElement("details");
    texturePalette.id = "roomTexturePalette";
    const textureHeading = document.createElement("summary");
    textureHeading.textContent = "Texture thumbnails";
    texturePalette.append(textureHeading);
    const textureHelp = document.createElement("p");
    textureHelp.textContent =
      "Choose a texture, then Apply selected element. Repeat, fit, offsets and rotation remain independent of wall dimensions.";
    texturePalette.append(textureHelp);
    const textureGrid = document.createElement("div");
    textureGrid.style.cssText =
      "display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px";
    texturePalette.append(textureGrid);
    for (const option of document.getElementById("roomSurface").options) {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", "Choose surface " + option.textContent);
      button.style.cssText =
        "display:flex;flex-direction:column;align-items:center;gap:5px;white-space:normal";
      if (option.value) {
        const thumbnail = document.createElement("img");
        thumbnail.src =
          root.FrontierRoomTextureData?.[option.value] || option.value;
        thumbnail.alt = "";
        thumbnail.loading = "lazy";
        thumbnail.style.cssText = "width:88px;height:66px;object-fit:contain";
        button.append(thumbnail);
      }
      const title = document.createElement("span");
      title.textContent = option.textContent;
      button.append(title);
      button.onclick =
        /* @function roomEditor.chooseMaterialThumbnail — Inputs: unused click. Returns nothing; copies this known catalog URL into the room draft selector without changing authored geometry or history. Existing Apply selected element validates/commits the draft. Image failure affects the preview only. */ function () {
          $("roomSurface").value = option.value;
        };
      textureGrid.append(button);
    }
    const textureImport = document.createElement("label");
    textureImport.textContent =
      "Import surface texture (PNG/JPEG/WebP; under 8 MB, up to 4096 pixels per side)";
    const textureFile = document.createElement("input");
    textureFile.id = "roomTextureImport";
    textureFile.type = "file";
    textureFile.accept = "image/png,image/jpeg,image/webp";
    textureImport.append(textureFile);
    texturePalette.append(textureImport);
    const texturePreview = document.createElement("img");
    texturePreview.id = "roomTexturePreview";
    texturePreview.alt = "Selected imported surface texture";
    texturePreview.hidden = true;
    texturePreview.style.cssText =
      "max-width:180px;max-height:120px;object-fit:contain";
    texturePalette.append(texturePreview);
    textureFile.onchange =
      /* @function roomEditor.importSurfaceTexture — Inputs: unused file change. Returns promise; decodes one PNG/JPEG/WebP under existing 8 MB/4096-side limits, then selects its embedded data URL as a draft. Apply stores bytes in the selected primitive for portable project reload/export. Rejects unsupported media/decoding through visible editor log, clears picker after either outcome, and never changes geometry or history itself. */ async function () {
        try {
          const file = textureFile.files[0];
          if (!file) return;
          if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
            throw Error("Choose a PNG, JPEG or WebP texture.");
          const image = await readImage(file);
          ensureSurfaceOption(image.src, file.name);
          document.dispatchEvent(new CustomEvent("surfaceTextureImported169",{detail:{url:image.src,name:file.name}}));
          document.getElementById("roomSurface").value = image.src;
          texturePreview.src = image.src;
          texturePreview.hidden = false;
          api.log("Texture ready. Apply selected element to save it.");
        } catch (error) {
          api.log(error.message);
        } finally {
          textureFile.value = "";
        }
      };
    /* @function roomEditor.ensureSurfaceOption — Inputs: validated saved URL/data URL and optional display name. Returns nothing; adds a missing imported/saved choice to the draft selector on reload, without duplicating existing options or altering project data. Embedded material bytes remain owned by the primitive, not a transient external file path. */
    function ensureSurfaceOption(url, name = "Imported surface texture") {
      if (!url) return;
      const select = document.getElementById("roomSurface");
      for (const option of select.options) if (option.value === url) return;
      select.add(new Option(name, url));
    }
    surfaces.append(texturePalette);
    const connections = document.createElement("fieldset");
    connections.innerHTML =
      '<legend>Map connections</legend><label>Exit destination<select id="roomDestination"></select></label><label>Arrival entrance<select id="roomArrival"></select></label><p>Select a map exit above, choose its destination and entrance, then Apply selected element. Doors and gates trigger travel when approached. Map travel retains inventory, Blood, Cerebral and event changes.</p>';
    host.append(connections);
    const $ =
        /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.$.3 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id. */
  /* @function roomEditor.reviewedlookup_3 — Looks up one installed room control by DOM ID. Inputs: id. Returns element or null; no mutation. Callers assume create installed the control and may throw when absent. */ (
          id,
        ) => document.getElementById(id),
      canvas = $("roomPlan"),
      ctx = canvas.getContext("2d");
    let selected = "",
      draft = [],
      drag = null,
      sprite = "",
      serial = 0,
      dirty = true;
    const keys = [
      "originX",
      "originY",
      "screenX",
      "screenY",
      "axisXX",
      "axisXY",
      "axisYX",
      "axisYY",
      "heightScale",
      "yaw",
    ];
    for (const k of keys) {
      const label = document.createElement("label");
      label.textContent = {
        originX: "Floor origin X",
        originY: "Floor origin Y",
        screenX: "Origin image pixel X",
        screenY: "Origin image pixel Y",
        axisXX: "X axis horizontal pixels/tile",
        axisXY: "X axis vertical pixels/tile",
        axisYX: "Y axis horizontal pixels/tile",
        axisYY: "Y axis vertical pixels/tile",
        heightScale: "Height pixels/unit",
        yaw: "Camera yaw (radians)",
      }[k];
      const i = document.createElement("input");
      i.id = "roomCam-" + k;
      i.type = "number";
      i.step = ".01";
      label.append(i);
      $("roomCameraFields").append(label);
    }
    const fields = [
      "x",
      "y",
      "w",
      "d",
      "z",
      "h",
      "height",
      "width",
      "radius",
      "yaw",
      "innerRadius",
      "segments",
      "arcStart",
      "arcSweep",
    ];
    for (const k of fields) {
      const l = document.createElement("label");
      l.textContent =
        {
          w: "Footprint width",
          d: "Footprint depth",
          h: "Box height",
          z: "Base height",
          height: "Sprite height",
          width: "Sprite width",
          radius: "Radius (metres)",
          innerRadius: "Round inner radius (0 = solid disk)",
          segments: "Round segments (whole number, 8–128)",
          arcStart: "Arc start (degrees)",
          arcSweep: "Arc sweep (degrees)",
          yaw: "Rotation / facing around Z (radians)",
        }[k] || k.toUpperCase();
      const i = document.createElement("input");
      i.type = "number";
      i.step = ".1";
      i.id = "roomField-" + k;
      l.append(i);
      $("roomElementFields").append(l);
    }
    const color = document.createElement("label");
    color.textContent = "Box color";
    color.innerHTML +=
      '<input id="roomElementColor" type="color" value="#6b6556">';
    $("roomElementFields").append(color);
    /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.room.4 — Handles room within room editor. Inputs: no explicit arguments; uses enclosing module state. Uses: api world. Returns: api world using interior. */
  /* @function roomEditor.reviewedroom_4 — Reads the current authored interior. Inputs: none; captures editor API. Returns interior reference or undefined for outdoor cells. No mutation or cloning; callers must commit edits through api.mutate. */ function room() {
      return api.world().interior;
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.travel.5 — Handles travel within room editor. Inputs: no explicit arguments; uses enclosing module state. Uses: room; api world. Returns: room using or api world using travel or a record containing entrances, exits. */
  /* @function roomEditor.reviewedtravel_5 — Locates entrance/exit ownership for the active cell. Inputs: none. Returns interior when present, otherwise outdoor travel record or temporary empty lists. No mutation; callers needing persistent outdoor lists must initialize world.travel first. */ function travel() {
      return room() || api.world().travel || { entrances: [], exits: [] };
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.entries.6 — Handles entries within room editor. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of "blockers", "sprites", "primitives", "entrances" flat map. Returns: a list of "blockers", "sprites", "primitives", "entrances" flat map using a callback. */
  /* @function roomEditor.reviewedentries_6 — Lists selectable authored room/travel elements. Inputs: none. Returns new wrappers with collection key and original element reference for blockers/sprites/primitives/entrances/exits. Missing collections yield no entries. No mutation; references are used inside owner transactions. */ function entries() {
      return [
        "blockers",
        "sprites",
        "primitives",
        "entrances",
        "exits",
      ].flatMap(
        /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.7 — Returns chain or a list of . Inputs: k. Uses: k equals "entrances" or k equals "exits" selects travel using or room using at k map; travel; room. Returns: chain or a list of . */
  /* @function roomEditor.reviewedcallback_7 — Enumerates one selectable room collection. Inputs: collection name k. Returns wrapper array from interior or travel, or empty list when absent. No mutation; entrance/exit ownership follows travel helper. */ (
          k,
        ) =>
          (k === "entrances" || k === "exits" ? travel() : room())?.[k]?.map(
            /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.8 — Returns a record containing key, e. Inputs: e. Returns: a record containing key, e. */
  /* @function roomEditor.reviewedcallback_8 — Associates element with its owning room collection. Inputs: authored element e and captured k. Returns wrapper key/e, retaining live element reference. No mutation. */ (
              e,
            ) => ({ key: k, e }),
          ) || [],
      );
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.chosen.9 — Handles chosen within room editor. Inputs: no explicit arguments; uses enclosing module state. Uses: entries using find; entries. Returns: entries using find using a callback. */
  /* @function roomEditor.reviewedchosen_9 — Resolves local room selection against current authored records. Inputs: none. Returns first collection wrapper matching selected ID or undefined if removed/empty. No mutation; stale selection is harmless until Apply requests a record. */ function chosen() {
      return entries().find(
        /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.10 — Returns v e id equals selected. Inputs: v. Returns: v e id equals selected. */
  /* @function roomEditor.reviewedcallback_10 — Matches a selectable wrapper to local selected ID. Inputs: wrapper v. Returns ID equality; no mutation. */ (
          v,
        ) => v.e.id === selected,
      );
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.fillSelection.11 — Handles fill selection within room editor. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "roomElementName" value; i closest using "label" hidden; i value; $ using "roomElementColor" closest using "label" hidden; $ using "roomElementColor" value. Uses: chosen; $; i closest; $ using "roomElementColor" closest. */
  /* @function roomEditor.reviewedfillSelection_11 — Loads selected authored values into property drafts. Inputs: none. Returns undefined; updates field visibility/values, texture choices and exit destination/arrival UI without modifying source. Converts round arc radians to displayed degrees; ordinary yaw remains radians, size/position metres and texture offsets repeats. Missing selection clears/hides fields; required DOM/service errors propagate. */ function fillSelection() {
      const v = chosen();
      $("roomElementName").value = v?.e.name || "";
      for (const k of fields) {
        const i = $("roomField-" + k);
        const round = v?.e.shape === "round";
        i.closest("label").hidden =
          !v ||
          (v.e[k] === undefined &&
            !(["arcStart", "arcSweep"].includes(k) && round)) ||
          (round && ["w", "d"].includes(k));
        const value = v?.e[k] ?? (k === "arcSweep" ? Math.PI * 2 : 0);
        i.value = ["arcStart", "arcSweep"].includes(k)
          ? (value * 180) / Math.PI
          : value;
      }
      $("roomElementColor").closest("label").hidden = v?.key !== "primitives";
      if (v?.key === "primitives") {
        $("roomElementColor").value = v.e.color;
        ensureSurfaceOption(v.e.texture);
        $("roomSurface").value = v.e.texture || "";
        $("roomTileSize").value = v.e.tileSize || 2;
        $("roomTextureMapping").value = v.e.textureMapping || "auto";
        $("roomTextureAspect").checked = !!v.e.preserveAspect;
        $("roomTextureRotation").value = v.e.textureRotation || 0;
        $("roomTextureOffsetU").value = v.e.textureOffsetU || 0;
        $("roomTextureOffsetV").value = v.e.textureOffsetV || 0;
      }
      if (v?.key === "exits") {
        $("roomDestination").value = v.e.map;
        arrival(v.e.entrance);
      }
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.arrival.12 — Handles arrival within room editor. Inputs: id. Updates: $ using "roomArrival" value. Uses: api maps using find; api maps; $ using "roomArrival" replace children; $. */
  /* @function roomEditor.reviewedarrival_12 — Refreshes destination entrance choices. Inputs: optional selected entrance ID. Returns undefined; looks up chosen destination and replaces options from its interior/travel entrances, then selects id when supplied. Missing map yields empty choices; does not change authored exits until Apply. */ function arrival(
      id,
    ) {
      const w = api
          .maps()
          .find(
            /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.13 — Returns m id equals $ using "roomDestination" value. Inputs: m. Uses: $. Returns: m id equals $ using "roomDestination" value. */
  /* @function roomEditor.reviewedcallback_13 — Finds current destination map record. Inputs: m and captured destination selector. Returns ID equality; no mutation. */ (
              m,
            ) => m.id === $("roomDestination").value,
          )?.world,
        es = w?.interior?.entrances || w?.travel?.entrances || [];
      $("roomArrival").replaceChildren(
        ...es.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.14 — Returns a new option. Inputs: e. Returns: a new option. */
  /* @function roomEditor.reviewedcallback_14 — Builds one arrival entrance option. Inputs: entrance e. Returns DOM Option with visible name and stable ID value. No authored mutation; DOM construction errors propagate. */ (
            e,
          ) => new Option(e.name, e.id),
        ),
      );
      if (id) $("roomArrival").value = id;
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.refresh.15 — Handles refresh within room editor. Inputs: no explicit arguments; uses enclosing module state. Updates: dirty; $ using "roomCharacterPixels" value; $ using "roomScaleReadout" text content; $ using id value; $ using "roomMode" value. Uses: room; $; $ using "roomSelection" replace children; entries using map. */
  /* @function roomEditor.reviewedrefresh_15 — Refreshes room panel from current authoring state. Inputs: none. Returns undefined; marks overlay dirty, repopulates camera/light/selection/destination controls, then arrival/selected-property drafts. Uses default values for outdoor cells. Reads world and does not commit mutations; may replace unsaved field drafts when owner refreshes. */ function refresh() {
      dirty = true;
      const r = room();
      $("roomCharacterPixels").value = Math.round(
        (r?.camera.heightScale || 150) * 1.65,
      );
      $("roomScaleReadout").textContent =
        $("roomCharacterPixels").value + " px";
      for (const [key, id] of [
        ["ambient", "roomAmbient"],
        ["strength", "roomLightStrength"],
        ["x", "roomLightX"],
        ["y", "roomLightY"],
        ["z", "roomLightZ"],
      ])
        $(id).value =
          r?.light?.[key] ??
          { ambient: 0.35, strength: 0.8, x: -0.5, y: 0.5, z: 1 }[key];
      $("roomMode").value = r?.mode || "outdoor";
      for (const k of keys)
        $("roomCam-" + k).value =
          r?.camera[k] ?? FrontierInterior.defaults.camera[k];
      $("roomSelection").replaceChildren(
        new Option("None", ""),
        ...entries().map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.16 — Returns a new option. Inputs: object pattern. Returns: a new option. */
  /* @function roomEditor.reviewedcallback_16 — Builds a room-element selector option. Inputs: wrapper containing e. Returns DOM Option with name/ID; no source mutation. */ ({
            e,
          }) => new Option(e.name, e.id),
        ),
      );
      $("roomSelection").value = selected;
      $("roomDestination").replaceChildren(
        ...api
          .maps()
          .map(
            /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.17 — Returns a new option. Inputs: m. Returns: a new option. */
  /* @function roomEditor.reviewedcallback_17 — Builds a destination-map option. Inputs: catalog m. Returns DOM Option with name/stable ID. No catalog mutation. */ (
              m,
            ) => new Option(m.name, m.id),
          ),
      );
      arrival();
      fillSelection();
    }
    $("roomSelection").onchange =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onchange.18 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: selected; dirty. Uses: $; fill selection. */
  /* @function roomEditor.reviewedonchange_18 — Changes local room-element selection. Inputs: unused DOM change event. Returns undefined; stores selector ID, loads property drafts and marks canvas dirty. No source/history mutation; required controls assumed installed. */ () => {
        selected = $("roomSelection").value;
        fillSelection();
        dirty = true;
      };
    $("roomDestination").onchange =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onchange.19 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: arrival. Returns: arrival using . */
  /* @function roomEditor.reviewedonchange_19 — Refreshes entrance drafts after destination-map selection. Inputs: unused DOM change. Returns arrival result (undefined); no authored exit update until Apply. Missing destination yields empty entrance list. */ () =>
        arrival();
    $("applyRoomMode").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onclick.20 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */
  /* @function roomEditor.reviewedonclick_20 — Requests room-style change through editor transaction. Inputs: unused click. Returns api.mutate result; passes the style callback to shared validation/Undo/refresh/error owner. No separate direct mutation. */ () =>
        api.mutate(
          /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.21 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: w interior; w interior mode; w terrain; w water. Uses: api world; $; structured clone; frontier terrain validate. Returns: without a result. */
  /* @function roomEditor.reviewedcallback_21 — Applies chosen room style inside editor mutation. Inputs: none; captures selector/API. Returns undefined; outdoor deletes interior, otherwise initializes default interior if absent, sets mode and resets terrain to flat and water defaults. Existing interior layout retained on fixed/geometry switch. Shared owner validates/rolls back; services may throw. */ () => {
            const w = api.world(),
              mode = $("roomMode").value;
            if (mode === "outdoor") {
              delete w.interior;
              return;
            }
            w.interior ||= structuredClone(FrontierInterior.defaults);
            w.interior.mode = mode;
            w.terrain = FrontierTerrain.validate({
              mode: "flat",
              amplitude: 0,
              frequency: 0.12,
            });
            w.water = FrontierWater.validate();
          },
        );
    $("roomCharacterPixels").oninput =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.oninput.22 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "roomScaleReadout" text content; dirty. Uses: $. */
  /* @function roomEditor.reviewedoninput_22 — Previews character ruler without changing saved scale. Inputs: unused slider input. Returns undefined; updates pixel readout and canvas dirty flag only. Apply scale is explicit commit. */ () => {
        $("roomScaleReadout").textContent =
          $("roomCharacterPixels").value + " px";
        dirty = true;
      };
    $("applyRoomScale").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onclick.23 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */
  /* @function roomEditor.reviewedonclick_23 — Requests fixed-artwork character-scale transaction. Inputs: unused click. Returns api.mutate result; owner handles validation/Undo/errors. Does not modify camera outside callback. */ () =>
        api.mutate(
          /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.24 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: room using camera height scale. Uses: room; error; number; $. */
  /* @function roomEditor.reviewedcallback_24 — Applies fixed-artwork height calibration. Inputs: none; captures pixel ruler. Returns undefined; requires fixed interior or throws, sets camera.heightScale to ruler pixels divided by 1.65-metre reference character. Does not move floor/exits; owner validation owns bounds. */ () => {
            if (room()?.mode !== "fixed")
              throw Error("Choose a fixed artwork room first.");
            room().camera.heightScale =
              Number($("roomCharacterPixels").value) / 1.65;
          },
        );
    $("applyRoomCamera").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onclick.25 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */
  /* @function roomEditor.reviewedonclick_25 — Requests camera-alignment transaction. Inputs: unused click. Returns api.mutate result; delegates validation/Undo/errors. No immediate field commit outside transaction. */ () =>
        api.mutate(
          /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.26 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: room using camera. Uses: room; error; object from entries; keys map. */
  /* @function roomEditor.reviewedcallback_26 — Replaces authored room camera with numeric draft values. Inputs: none. Returns undefined; throws without interior and reads floor-origin metres, image pixel origins, axis pixels per unit, height pixels per unit and yaw radians. Replaces camera record; shared owner validates and can reject/rollback. */ () => {
            if (!room()) throw Error("Choose an interior room style first.");
            room().camera = Object.fromEntries(
              keys.map(
                /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.27 — Returns a list of k, number using $ using "roomCam-" plus k value. Inputs: k. Uses: number; $. Returns: a list of k, number using $ using "roomCam-" plus k value. */
  /* @function roomEditor.reviewedcallback_27 — Reads one camera draft field for record construction. Inputs: key k. Returns key/Number(value) pair; no source mutation. Empty values convert to zero and invalid numbers are rejected by outer authoring validation. */ (
                  k,
                ) => [k, Number($("roomCam-" + k).value)],
              ),
            );
          },
        );
    /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.readImage.28 — Handles read image within room editor. Inputs: file. Uses: error. Returns: await. */
  /* @function roomEditor.reviewedreadImage_28 — Reads and decodes a local image into portable embedded bytes. Inputs: File at most 8,000,000 bytes. Returns promise for data URL and decoded pixel width/height, each at most 4096. Does not modify authored data; rejects absent/oversize file, reader failure, decode error or dimensions above limit. MIME restrictions belong to picker-specific caller; no source file writes. */ async function readImage(
      file,
    ) {
      if (!file || file.size > 8000000)
        throw Error("Choose an image smaller than 8 MB.");
      return await new Promise(
        /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.29 — Provides the callback for the enclosing room editor operation. Inputs: resolve; reject. Updates: r onload; r onerror. Uses: r read as data url. */
  /* @function roomEditor.reviewedcallback_29 — Starts FileReader/image decode promise. Inputs: resolve/reject callbacks and captured File. Returns undefined; registers read/decode listeners and begins data-URL read. Reader failure rejects; no project mutation or external writes. */ (
          resolve,
          reject,
        ) => {
          const r = new FileReader();
          r.onload =
            /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onload.30 — Processes a resource after it finishes loading. Inputs: no explicit arguments; uses enclosing module state. Updates: im onload; im onerror; im src. */
  /* @function roomEditor.reviewedonload_30 — Starts image decode after file read. Inputs: unused load event. Returns undefined; assigns embedded result to new Image and installs completion/error handlers. No project mutation; decode failure rejects outer promise. */ () => {
              const im = new Image();
              im.onload =
                /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onload.31 — Processes a resource after it finishes loading. Inputs: no explicit arguments; uses enclosing module state. Uses: resolve; reject; error. Returns: im width is at most 4096 and im height is at most 4096 selects resolve using a record containing src, width, height or reject using error using "Image must be at most 4096 pixels per side.". */
  /* @function roomEditor.reviewedonload_31 — Accepts decoded image within side limits. Inputs: unused load event. Returns promise-settlement result (undefined); resolves data URL/pixel dimensions or rejects if either side exceeds 4096. No source mutation. */ () =>
                  im.width <= 4096 && im.height <= 4096
                    ? resolve({
                        src: r.result,
                        width: im.width,
                        height: im.height,
                      })
                    : reject(
                        Error("Image must be at most 4096 pixels per side."),
                      );
              im.onerror =
                /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onerror.32 — Returns reject using error using "Cannot decode image.". Inputs: no explicit arguments; uses enclosing module state. Uses: reject; error. Returns: reject using error using "Cannot decode image.". */
  /* @function roomEditor.reviewedonerror_32 — Reports image decoder failure. Inputs: unused decode event. Returns reject result (undefined); rejects outer promise with readable Cannot decode image error. No project mutation. */ () =>
                  reject(Error("Cannot decode image."));
              im.src = r.result;
            };
          r.onerror = reject;
          r.readAsDataURL(file);
        },
      );
    }
    $("roomImage").onchange =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onchange.33 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "roomImage" value. Uses: read image; $; api mutate; api log. */
  /* @function roomEditor.reviewedonchange_33 — Imports room artwork into a validated transaction. Inputs: unused file change. Returns promise; decodes selected file, commits embedded bytes/dimensions through owner, logs errors and clears picker in finally. No source file changes; missing/invalid image rejected visibly. */ async () => {
        try {
          const im = await readImage($("roomImage").files[0]);
          api.mutate(
            /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.34 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: room using image; room using image width; room using image height. Uses: room; error. */
  /* @function roomEditor.reviewedcallback_34 — Stores decoded artwork in current interior. Inputs: none; captures im. Returns undefined; throws without interior, then writes image data URL and width/height pixels inside owner transaction. Does not infer floor/camera alignment; shared validation/Undo owns adoption. */ () => {
              if (!room()) throw Error("Choose an interior room style first.");
              room().image = im.src;
              room().imageWidth = im.width;
              room().imageHeight = im.height;
            },
          );
        } catch (e) {
          api.log(e.message);
        } finally {
          $("roomImage").value = "";
        }
      };
    $("roomNormalImage").onchange =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onchange.35 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "roomNormalImage" value. Uses: read image; $; api mutate; api log. */
  /* @function roomEditor.reviewedonchange_35 — Imports a normal image for current sprite or room. Inputs: unused file change. Returns promise; uses bounded image decode and owner transaction, logs failures and clears picker. Picker requests PNG but decoder itself accepts decodable bytes; no project update outside callback. */ async () => {
        try {
          const im = await readImage($("roomNormalImage").files[0]);
          api.mutate(
            /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.36 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: v e normal; room using normal. Uses: room; error; chosen. */
  /* @function roomEditor.reviewedcallback_36 — Stores decoded normal-map bytes on selected furniture or whole room. Inputs: none; captures im. Returns undefined; requires interior, targets selected sprite when available otherwise room.normal. Owner validates compatibility/persistence and handles Undo/rollback. */ () => {
              if (!room()) throw Error("Select an interior first.");
              const v = chosen();
              if (v?.key === "sprites") v.e.normal = im.src;
              else room().normal = im.src;
            },
          );
        } catch (e) {
          api.log(e.message);
        } finally {
          $("roomNormalImage").value = "";
        }
      };
    $("applyRoomLight").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onclick.37 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */
  /* @function roomEditor.reviewedonclick_37 — Requests room normal-light settings transaction. Inputs: unused click. Returns api.mutate result; owner validates/records Undo. This is directional normal-map light, separate from local radius-light editor. */ () =>
        api.mutate(
          /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.38 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: room using light. Uses: room; error; number; $. */
  /* @function roomEditor.reviewedcallback_38 — Stores directional normal-light draft in interior. Inputs: none. Returns undefined; throws without interior and replaces light with numeric ambient/strength and direction XYZ. Ambient/strength dimensionless and direction components unitless; shared validation enforces ranges. */ () => {
            if (!room()) throw Error("Select an interior first.");
            room().light = {
              ambient: Number($("roomAmbient").value),
              strength: Number($("roomLightStrength").value),
              x: Number($("roomLightX").value),
              y: Number($("roomLightY").value),
              z: Number($("roomLightZ").value),
            };
          },
        );
    $("roomSpriteImage").onchange =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onchange.39 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: sprite; $ using "roomSpriteImage" value. Uses: read image; $; api log. */
  /* @function roomEditor.reviewedonchange_39 — Loads a furniture sprite placement draft. Inputs: unused file change. Returns promise; decodes bounded image to local sprite data URL, logs readiness/error and clears picker. No authored item exists until placement release. */ async () => {
        try {
          sprite = (await readImage($("roomSpriteImage").files[0])).src;
          api.log(
            "Furniture image ready. Choose Place furniture sprite and click its feet.",
          );
        } catch (e) {
          api.log(e.message);
        } finally {
          $("roomSpriteImage").value = "";
        }
      };
    $("applyRoomElement").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onclick.40 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */
  /* @function roomEditor.reviewedonclick_40 — Requests selected room-element edit transaction. Inputs: unused click. Returns api.mutate result; validation/Undo/rollback remain owner-managed. Reads controls within callback rather than committing each input. */ () =>
        api.mutate(
          /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.41 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: v e name; v e at k; v e color; v e map; v e entrance. Uses: chosen; error; $ using "roomElementName" value trim; $. */
  /* @function roomEditor.reviewedcallback_41 — Applies selected property drafts inside shared transaction. Inputs: none. Returns undefined; requires selection, updates name and supported numeric fields, converts round arc degrees to radians and diameter from radius. Primitives receive texture/color/repeat/offset/rotation settings; exits receive map/arrival and require entrance. Position/dimensions metres, yaw radians, texture rotation degrees, offsets repeats. Owner validates/rolls back invalid draft values. */ () => {
            const v = chosen();
            if (!v) throw Error("Select a room element.");
            v.e.name = $("roomElementName").value.trim() || v.e.name;
            for (const k of fields)
              if (
                v.e[k] !== undefined ||
                (v.e.shape === "round" && ["arcStart", "arcSweep"].includes(k))
              ) {
                if (v.e.shape === "round" && ["w", "d"].includes(k)) continue;
                const value = Number($("roomField-" + k).value);
                v.e[k] = ["arcStart", "arcSweep"].includes(k)
                  ? (value * Math.PI) / 180
                  : value;
              }
            if (v.e.shape === "round") {
              v.e.w = v.e.d = v.e.radius * 2;
            }
            if (v.key === "primitives") {
              v.e.color = $("roomElementColor").value;
              v.e.texture = $("roomSurface").value || undefined;
              v.e.tileSize = Number($("roomTileSize").value);
              v.e.textureMapping = $("roomTextureMapping").value;
              v.e.preserveAspect = $("roomTextureAspect").checked;
              v.e.textureRotation = Number($("roomTextureRotation").value);
              v.e.textureOffsetU = Number($("roomTextureOffsetU").value);
              v.e.textureOffsetV = Number($("roomTextureOffsetV").value);
            }
            if (v.key === "exits") {
              v.e.map = $("roomDestination").value;
              v.e.entrance = $("roomArrival").value;
              if (!v.e.entrance) throw Error("Destination needs an entrance.");
            }
          },
        );
    $("deleteRoomElement").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onclick.42 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: chosen; api mutate. */
  /* @function roomEditor.reviewedonclick_42 — Requests selected room-element deletion when available. Inputs: unused click. Returns undefined; no-op without selection, otherwise calls owner mutation. Owner owns Undo and validation; does not delete asset files. */ () => {
        const v = chosen();
        if (v)
          api.mutate(
            /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.43 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: r at v key; selected. Uses: travel; room; r at v key filter. */
  /* @function roomEditor.reviewedcallback_43 — Removes selected element from its owning collection. Inputs: none; captures wrapper v. Returns undefined; filters interior/travel array and clears local selection. Runs inside owner transaction with validation/Undo; referenced asset bytes are not separately removed. */ () => {
              const r =
                v.key === "entrances" || v.key === "exits" ? travel() : room();
              r[v.key] = r[v.key].filter(
                /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.44 — Returns e id does not equal selected. Inputs: e. Returns: e id does not equal selected. */
  /* @function roomEditor.reviewedcallback_44 — Retains every element except selected ID. Inputs: authored e. Returns inequality boolean; no mutation. Used to construct replacement collection during deletion. */ (
                  e,
                ) => e.id !== selected,
              );
              selected = "";
            },
          );
      };
    /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.transform.45 — Handles transform within room editor. Inputs: no explicit arguments; uses enclosing module state. Updates: cam fit; cam ox; cam oy. Uses: api world; room; frontier interior camera. Returns: a record containing to, from, cam; a record containing to, from. */
  /* @function roomEditor.reviewedtransform_45 — Creates world-ground to plan-canvas projection pair. Inputs: none; reads current cell/interior. Returns to/from and fixed camera when needed. Fixed artwork uses fitted 420x237 image projection at Z zero; outdoor/geometry plan uses linear XY mapping with screen Y inverted. No source mutation; invalid dimensions/required camera services propagate errors. */ function transform() {
      const w = api.world(),
        r = room();
      if (r?.mode === "fixed") {
        const g = { sourceWorld: w, viewWidth: 420 },
          cam = FrontierInterior.camera(g);
        cam.fit = Math.min(420 / r.imageWidth, 237 / r.imageHeight);
        cam.ox = (420 - r.imageWidth * cam.fit) / 2;
        cam.oy = (237 - r.imageHeight * cam.fit) / 2;
        return {
          to: /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.to.46 — Returns frontier interior project using cam, p at 0, p at 1. Inputs: p. Uses: frontier interior project. Returns: frontier interior project using cam, p at 0, p at 1. */
  /* @function roomEditor.reviewedto_46 — Projects a fixed-artwork floor point into plan logical pixels. Inputs: world XY tuple p in metres. Returns interior projected point using captured fitted camera at Z zero. No mutation; dependency errors propagate. */ (
            p,
          ) => FrontierInterior.project(cam, p[0], p[1], 0),
          from: /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.from.47 — Returns frontier interior ground point using cam, x, y. Inputs: x; y. Uses: frontier interior ground point. Returns: frontier interior ground point using cam, x, y. */
  /* @function roomEditor.reviewedfrom_47 — Inverts fixed-artwork plan coordinates onto ground. Inputs: logical pixel x/y. Returns world XY via captured camera groundPoint; no mutation. Assumes invertible validated alignment. */ (
            x,
            y,
          ) => FrontierInterior.groundPoint(cam, x, y),
          cam,
        };
      }
      return {
        to: /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.to.48 — Returns a record containing x, y. Inputs: p. Returns: a record containing x, y. */
  /* @function roomEditor.reviewedto_48 — Maps plan-world XY into 420x237 logical pixels. Inputs: p metres. Returns x/y with vertical axis inverted; no mutation. Assumes positive validated cell width/height. */ (
          p,
        ) => ({ x: (p[0] / w.width) * 420, y: 237 - (p[1] / w.height) * 237 }),
        from: /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.from.49 — Returns a record containing x, y. Inputs: x; y. Returns: a record containing x, y. */
  /* @function roomEditor.reviewedfrom_49 — Inverts linear room plan projection. Inputs: logical pixel x/y. Returns world XY metres using cell width/height and inverted screen Y. No mutation; assumes positive validated dimensions. */ (
          x,
          y,
        ) => ({ x: (x / 420) * w.width, y: ((237 - y) / 237) * w.height }),
      };
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.point.50 — Handles point within room editor. Inputs: ev. Uses: canvas get bounding client rect; transform using from; transform; api world. Returns: a record containing x, y. */
  /* @function roomEditor.reviewedpoint_50 — Converts pointer position to bounded snapped plan location. Inputs: DOM pointer ev.clientX/clientY CSS pixels. Returns world XY metres after canvas scaling/projection, snap rounding and one-metre cell inset clamp. Grid zero still uses 0.1-metre precision. No authored mutation; degenerate canvas/alignment is not validated here. */ function point(
      ev,
    ) {
      const b = canvas.getBoundingClientRect(),
        p = transform().from(
          ((ev.clientX - b.left) * 420) / b.width,
          ((ev.clientY - b.top) * 237) / b.height,
        ),
        w = api.world();
      const grid = Math.max(0, Number($("roomSnap").value) || 0),
        step = grid || 0.1;
      return {
        x: Math.max(1, Math.min(w.width - 1, Math.round(p.x / step) * step)),
        y: Math.max(1, Math.min(w.height - 1, Math.round(p.y / step) * step)),
      };
    }
    canvas.onpointerdown =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onpointerdown.51 — Begins the pointer-driven interaction. Inputs: ev. Updates: dirty; best; target; drag; selected. Uses: point; $; draft push; transform. Returns: without a result; without a result. */
  /* @function roomEditor.reviewedonpointerdown_51 — Begins a left-button room-plan gesture. Inputs: pointer event ev. Returns undefined; floor tool appends draft corner, selection picks closest corner/element within 12 logical pixels, other tools start placement drag. Captures pointer and marks overlay dirty; only local selection/draft change until release. Non-left buttons ignored; DOM/projection errors propagate. */ (
        ev,
      ) => {
        if (ev.button !== 0) return;
        const p = point(ev),
          tool = $("roomTool").value;
        if (tool === "floor") {
          draft.push([p.x, p.y]);
          dirty = true;
          return;
        }
        if (tool === "select") {
          const t = transform();
          let best = 12,
            target = null;
          const b = canvas.getBoundingClientRect(),
            sx = ((ev.clientX - b.left) * 420) / b.width,
            sy = ((ev.clientY - b.top) * 237) / b.height;
          for (const [i, a] of (room()?.floor || []).entries()) {
            const q = t.to(a),
              d = Math.hypot(q.x - sx, q.y - sy);
            if (d < best) {
              best = d;
              target = { floor: i };
            }
          }
          for (const v of entries()) {
            const q = t.to([v.e.x, v.e.y]),
              d = Math.hypot(q.x - sx, q.y - sy);
            if (d < best) {
              best = d;
              target = { id: v.e.id };
            }
          }
          if (target) {
            drag = { ...target, start: p, last: p };
            if (target.id) {
              selected = target.id;
              fillSelection();
            }
          }
        } else drag = { tool, start: p, last: p };
        canvas.setPointerCapture(ev.pointerId);
        dirty = true;
      };
    canvas.onpointermove =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onpointermove.52 — Updates the active pointer-driven interaction. Inputs: ev. Updates: drag last; dirty. Uses: point. */
  /* @function roomEditor.reviewedonpointermove_52 — Updates room-plan gesture preview. Inputs: pointer ev. Returns undefined; when drag exists stores latest bounded snapped world point and marks overlay dirty. No authored mutation or history entry; invalid projection errors propagate. */ (
        ev,
      ) => {
        if (drag) {
          drag.last = point(ev);
          dirty = true;
        }
      };
    canvas.onpointerup =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onpointerup.53 — Handles onpointerup within room editor. Inputs: no explicit arguments; uses enclosing module state. Updates: drag. Uses: api mutate. Returns: without a result. */
  /* @function roomEditor.reviewedonpointerup_53 — Completes one room-plan drag transaction. Inputs: none. Returns undefined, no-op if no drag. Clears local drag before calling api.mutate with last point/gesture; owner validates, snapshots Undo and handles errors. Does not replay an interrupted gesture. */ () => {
        if (!drag) return;
        const d = drag;
        drag = null;
        const p = d.last;
        api.mutate(
          /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.54 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: room using floor at d floor; e x; e y; w spawn; w travel. Uses: api world; room; entries using find; entries. Returns: without a result; without a result. */
  /* @function roomEditor.reviewedcallback_54 — Applies a completed plan gesture within the owner mutation boundary. Inputs: none; captures d/p. Returns undefined; moves floor corner/element or spawn, or creates blocker/box/furniture/entrance/exit with unique local ID. Geometry uses world metres; box min width/depth 0.2 and height 2.5, furniture defaults 1.6x1.8/radius0.4. Rejects missing interior/image/destination entrance; owner owns validation/rollback/Undo. Source changes are never applied per pointer move. */ () => {
            const w = api.world();
            if (d.floor !== undefined) {
              room().floor[d.floor] = [p.x, p.y];
              return;
            }
            if (d.id) {
              const e = entries().find(
                /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.55 — Returns v e id equals d id. Inputs: v. Returns: v e id equals d id. */
  /* @function roomEditor.reviewedcallback_55 — Finds the authored element targeted by the completed drag. Inputs: wrapper v and captured d.id. Returns ID equality; no mutation. Missing element is ignored by enclosing transaction. */ (
                  v,
                ) => v.e.id === d.id,
              )?.e;
              if (e) {
                e.x = p.x;
                e.y = p.y;
              }
              return;
            }
            if (d.tool === "spawn") {
              w.spawn = { x: p.x, y: p.y };
              return;
            }
            const id = "room-" + Date.now() + "-" + ++serial,
              name = {
                blocker: "Solid footprint",
                primitive: "3D box",
                entrance: "Entrance",
                exit: "Map exit",
                sprite: "Furniture",
              }[d.tool],
              e = { id, name, x: p.x, y: p.y };
            if (["blocker", "primitive", "sprite"].includes(d.tool) && !room())
              throw Error("Choose an interior room style first.");
            if (d.tool === "blocker" || d.tool === "primitive") {
              Object.assign(e, {
                x: (d.start.x + p.x) / 2,
                y: (d.start.y + p.y) / 2,
                w: Math.max(0.2, Math.abs(p.x - d.start.x)),
                d: Math.max(0.2, Math.abs(p.y - d.start.y)),
              });
              if (d.tool === "primitive")
                Object.assign(e, {
                  z: 0,
                  h: 2.5,
                  color: "#ffffff",
                  texture: $("roomSurface").value || undefined,
                  tileSize: Number($("roomTileSize").value) || 2,
                });
              room()[d.tool === "primitive" ? "primitives" : "blockers"].push(
                e,
              );
            }
            if (d.tool === "sprite") {
              if (!sprite) throw Error("Import furniture image first.");
              Object.assign(e, {
                image: sprite,
                width: 1.6,
                height: 1.8,
                radius: 0.4,
              });
              room().sprites.push(e);
            }
            if (d.tool === "entrance" || d.tool === "exit") {
              w.travel ||= { entrances: [], exits: [] };
              if (d.tool === "entrance") {
                e.yaw = 0;
                travel().entrances.push(e);
              } else {
                Object.assign(e, {
                  radius: 0.6,
                  map: $("roomDestination").value,
                  entrance: $("roomArrival").value,
                });
                if (!e.entrance)
                  throw Error("Choose a destination entrance first.");
                travel().exits.push(e);
              }
            }
            selected = id;
          },
        );
      };
    canvas.onpointercancel =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onpointercancel.56 — Cancels the active pointer-driven interaction. Inputs: no explicit arguments; uses enclosing module state. Updates: drag; dirty. */
  /* @function roomEditor.reviewedonpointercancel_56 — Cancels local drag preview. Inputs: none. Returns undefined; clears drag and marks overlay dirty without authored mutation/history. Floor corner draft remains until explicit Cancel drawing. */ () => {
        drag = null;
        dirty = true;
      };
    $("finishRoomFloor").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onclick.57 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: draft; dirty. Uses: api log; api mutate. Returns: without a result. */
  /* @function roomEditor.reviewedonclick_57 — Finishes floor-outline draft. Inputs: unused click. Returns undefined; logs/no-ops below three corners, otherwise requests mutation then clears local draft and marks canvas dirty. Shared owner reports rejection; rejected outline draft is still cleared by this handler. */ () => {
        if (draft.length < 3) {
          api.log("Place at least three floor corners.");
          return;
        }
        api.mutate(
          /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.58 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: room using floor. Uses: room; error; draft map. */
  /* @function roomEditor.reviewedcallback_58 — Stores detached floor polygon in current interior. Inputs: none; captures draft XY metre tuples. Returns undefined; requires interior or throws and replaces floor array with copied corners. Owner validates polygon and records Undo/rollback. */ () => {
            if (!room()) throw Error("Choose an interior room style first.");
            room().floor = draft.map(
              /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.callback.59 — Returns a list of spread element. Inputs: p. Returns: a list of spread element. */
  /* @function roomEditor.reviewedcallback_59 — Detaches one floor corner tuple. Inputs: p. Returns new XY array retaining numeric metre values; no mutation or geometry validation. */ (
                p,
              ) => [...p],
            );
          },
        );
        draft = [];
        dirty = true;
      };
    $("cancelRoomDrawing").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.onclick.60 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: draft; drag; dirty. */
  /* @function roomEditor.reviewedonclick_60 — Cancels room drawing previews. Inputs: unused click. Returns undefined; clears local floor draft/drag and marks canvas dirty. Does not alter authored geometry or Undo history. */ () => {
        draft = [];
        drag = null;
        dirty = true;
      };
    /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.draw.61 — Draws this system’s current state into the supplied rendering context. Inputs: no explicit arguments; uses enclosing module state. Updates: dirty; ctx fill style; ctx font; ctx stroke style; ctx line width. Uses: api editing; box class list contains; transform; room. Returns: without a result; without a result. */
  /* @function roomEditor.revieweddraw_61 — Redraws dirty visible room-plan overlay only. Inputs: none. Returns undefined; no-op outside editing/hidden tab/clean state, waits for fixed artwork load, then clears/draws image, floor/draft/element/spawn/drag marks. Coordinates are 420x237 logical pixels transformed from world XY. Changes canvas styles and dirty flag only; missing services/canvas errors propagate. */ function draw() {
      if (!api.editing() || box.classList.contains("toolTabHidden")) return;
      const t = transform(),
        r = room();
      const im = r?.mode === "fixed" ? FrontierInterior.image(r.image) : null;
      if (im && !im.complete) {
        dirty = true;
        return;
      }
      if (!dirty) return;
      dirty = false;
      ctx.clearRect(0, 0, 420, 237);
      ctx.fillStyle = "#151c23";
      ctx.fillRect(0, 0, 420, 237);
      if (im?.naturalWidth)
        ctx.drawImage(
          im,
          t.cam.ox,
          t.cam.oy,
          r.imageWidth * t.cam.fit,
          r.imageHeight * t.cam.fit,
        );
      /* Historical contract retained; October 14 reviewed explanation follows. @function room-editor.line.62 — Handles line within room editor. Inputs: points; color; assignment pattern. Updates: ctx stroke style; ctx line width; ctx fill style. Uses: ctx begin path; points entries; t to; ctx at i selects "lineTo" or "moveTo". */
  /* @function roomEditor.reviewedline_62 — Draws one outline and its corner handles on room plan. Inputs: iterable XY metre points, canvas color and closed flag (default true). Returns undefined; uses captured projection/context to draw 1.5-pixel line and four-pixel square handles. Does not modify points; invalid projection/context errors propagate. */ function line(
        points,
        color,
        closed = true,
      ) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (const [i, a] of points.entries()) {
          const p = t.to(a);
          ctx[i ? "lineTo" : "moveTo"](p.x, p.y);
          ctx.fillStyle = color;
          ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        }
        if (closed) ctx.closePath();
        ctx.stroke();
      }
      if (r) line(r.floor, "#72e6a2");
      if (draft.length) line(draft, "#ffee72", false);
      for (const { e, key } of entries()) {
        if (e.w)
          line(
            [
              [e.x - e.w / 2, e.y - e.d / 2],
              [e.x + e.w / 2, e.y - e.d / 2],
              [e.x + e.w / 2, e.y + e.d / 2],
              [e.x - e.w / 2, e.y + e.d / 2],
            ],
            selected === e.id ? "#fff" : "#ff8070",
          );
        const p = t.to([e.x, e.y]);
        ctx.fillStyle =
          selected === e.id ? "#fff" : key === "exits" ? "#ffd273" : "#8abaff";
        ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
        ctx.font = "9px sans-serif";
        ctx.fillText(e.name, p.x + 4, p.y);
      }
      const p = t.to([api.world().spawn.x, api.world().spawn.y]);
      ctx.fillStyle = "#fff";
      ctx.fillText("Spawn", p.x, p.y);
      if (t.cam) {
        const h = Number($("roomCharacterPixels").value) * t.cam.fit;
        ctx.strokeStyle = "#ffee72";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x + 10, p.y);
        ctx.lineTo(p.x + 10, p.y - h);
        ctx.moveTo(p.x + 4, p.y);
        ctx.lineTo(p.x + 16, p.y);
        ctx.moveTo(p.x + 4, p.y - h);
        ctx.lineTo(p.x + 16, p.y - h);
        ctx.stroke();
        ctx.fillStyle = "#ffee72";
        ctx.fillText("Character height", p.x + 18, p.y - h / 2);
      }
      if (drag) {
        const p = t.to([drag.last.x, drag.last.y]);
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(p.x - 4, p.y - 4, 8, 8);
      }
    }
    const skies = root.FrontierSkyEditor?.create(api),
      building = root.FrontierBuildingEditor?.create(api),
      props = root.FrontierPropEditor?.create(api),
      lights = root.FrontierLightingEditor?.create(api),
      layout = root.FrontierLayoutEditor?.create({
        ...api,
        preview: building?.previewLayout,
      });
    return {
      refresh:
        /* @function roomEditor.refreshBuilding1524 - Inputs: none. Returns: nothing. Refreshes legacy numeric/plan controls and drops stale building ghosts after cell changes. */ function () {
          refresh();
          skies?.refresh();
          building?.refresh();
          props?.refresh();
          lights?.refresh();
          layout?.refresh();
        },
      draw: /* @function roomEditor.drawBuilding1524 - Inputs: none. Returns: nothing. Draws the legacy plan and separate logical-coordinate surface handles; no gameplay mutation. */ function () {
        draw();
        building?.draw();
        props?.draw();
        lights?.draw();
        layout?.draw();
      },
    };
  }
  root.FrontierRoomEditor = { create };
})(window);
