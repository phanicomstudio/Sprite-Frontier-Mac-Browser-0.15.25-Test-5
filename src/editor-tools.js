/* Focused authoring tabs and brush transactions. Existing form IDs remain intact
 * so event and combat tools retain their behavior. Only the active category shows.
 * Brush interpolation fills gaps between pointer events and avoids repeated stamps.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier editor tools. */
(/* @function editor-tools.installReviewed — Installs focused authoring categories and brush-transaction helpers. Existing form identity/listeners stay intact; interpolation fills pointer gaps without repeated same-position stamps. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: api. Updates: box id; box inner html; ground text content; ground picker id; ground picker onchange. Uses: $ using "sceneTool" closest; $; document create element; ground picker append. Returns: a record containing begin, move, end, refresh, select, active. */
  /* @function editor-tools.create.2Reviewed — Builds authoring categories and terrain/water/flight/type controls around the existing editor form. Inputs: host API providing world access, validated mutate/Undo, refresh and selection. Returns brush begin/move/end, refresh/select and active operations. Creates DOM/listeners, relocates existing controls without replacing their identity and initializes Place selection. Requires the established form IDs/services; setup failures propagate. Does not create another game session; host owns persistence, validation and transaction rollback. */ function create(
    api,
  ) {
    const $ =
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.$.3 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id. */
  /* @function editor-tools.$.3Reviewed — Looks up an established editor control. Inputs: DOM ID string. Returns matching element or null. No mutation; callers requiring a control assume the editor form was mounted. */ (
          id,
        ) => document.getElementById(id),
      host = $("sceneTool").closest("div");
    const box = document.createElement("fieldset");
    box.id = "terrainTools";
    box.innerHTML =
      '<legend>Terrain brush</legend><label>Brush<select id="brushTool"><option value="texture">Paint ground texture</option><option value="eraseTexture">Erase painted texture</option><option value="raise">Raise terrain</option><option value="lower">Lower</option><option value="flatten">Flatten</option><option value="smooth">Smooth</option><option value="water">Paint water</option><option value="eraseWater">Erase water</option></select></label><label>Size (world units)<input id="brushRadius" type="number" min="1" max="12" value="3"></label><label>Strength<input id="brushStrength" type="number" min="0.05" max="2" step="0.05" value="0.3"></label><label>Flatten height<input id="brushHeight" type="number" min="-30" max="30" step="0.1" value="0"></label><p>Left-drag the surface to paint. Right-drag looks around. One stroke is one undo step.</p>';
    const ground = document.createElement("label");
    ground.textContent = "Default ground texture (whole map)";
    const groundPicker = document.createElement("select");
    groundPicker.id = "groundMaterial";
    groundPicker.append(
      new Option("Vector ground", ""),
      ...FrontierOutdoorAssets.assets
        .filter(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.4 — Returns a category equals "ground". Inputs: a. Returns: a category equals "ground". */
  /* @function editor-tools.callback.4Reviewed — Selects ground-category entries for the terrain texture picker. Inputs: outdoor asset record. Returns whether category is ground, without mutation or loading image pixels. */ (
            a,
          ) => a.category === "ground",
        )
        .map(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.5 — Returns a new option. Inputs: a. Returns: a new option. */
  /* @function editor-tools.callback.5Reviewed — Creates a ground texture option from asset metadata. Inputs: asset name and stable ID. Returns new Option using name as text and ID as value; does not change the asset or select it. */ (
            a,
          ) => new Option(a.name, a.id),
        ),
    );
    ground.append(groundPicker);
    box.append(ground);
    // October 14: painting uses a separate picker; choosing brush texture must
    // not silently texture the entire previously vector-style map.
    const paintLabel = document.createElement("label");
    paintLabel.textContent = "Texture to paint with brush";
    const paintPicker = groundPicker.cloneNode(true);
    paintPicker.id = "paintMaterial";
    paintPicker.value = "ground-moss";
    paintLabel.append(paintPicker);
    box.append(paintLabel);
    groundPicker.onchange =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.onchange.6 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */
  /* @function editor-tools.onchange.6Reviewed — Applies the ground picker through the host validated Undo transaction. Inputs: none, captured control/API. Returns mutate result; the callback changes only current world ground material. Host owns validation, rollback, refresh and persistence; errors follow that API. */ () =>
        api.mutate(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.7 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: w ground material. Uses: api world. */
  /* @function editor-tools.callback.7Reviewed — Changes current terrain material inside a host transaction. Inputs: none. Returns nothing; sets selected asset ID or deletes groundMaterial for Vector ground. Does not copy image files or directly save the project. */ () => {
            const w = api.world();
            if (groundPicker.value) w.groundMaterial = groundPicker.value;
            else delete w.groundMaterial;
          },
        );
    $("sceneTool").append(new Option("Terrain / water brush", "brush"));
    $("sceneTool").closest("label").after(box);
    const water = document.createElement("fieldset");
    water.id = "waterMaterial";
    water.innerHTML =
      '<legend>Water material</legend><label>Surface height for new paint<input id="waterLevel" type="number" min="-30" max="30" step="0.1"></label><label>Texture<select id="waterTexture"><option value="">Animated placeholder</option></select><input id="waterImport" type="file" accept="image/png,image/jpeg,image/webp"></label><label>Color<input id="waterColor" type="color"></label><details><summary>Animation settings</summary>' +
      [
        ["scale", "Texture scale", 0.25, 16],
        ["speed", "Warp speed", -5, 5],
        ["warp", "Warp strength", 0, 0.3],
        ["flowX", "Flow X", -2, 2],
        ["flowY", "Flow Y", -2, 2],
      ]
        .map(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.8 — Returns "<label>" plus label plus "<input id=\"water-" plus k plus "\" type=\"number\" min=\"" plus min plus "\" max=\"" plus max plus "\" step=\"0.01\"></label>". Inputs: array pattern. Returns: "<label>" plus label plus "<input id=\"water-" plus k plus "\" type=\"number\" min=\"" plus min plus "\" max=\"" plus max plus "\" step=\"0.01\"></label>". */
  /* @function editor-tools.callback.8Reviewed — Builds one water animation numeric control from fixed trusted metadata. Inputs: key, label and inclusive UI min/max. Returns HTML label/input markup with a 0.01 step. Does not validate submitted values or mutate water; validators enforce limits later. */ ([
            k,
            label,
            min,
            max,
          ]) =>
            "<label>" +
            label +
            '<input id="water-' +
            k +
            '" type="number" min="' +
            min +
            '" max="' +
            max +
            '" step="0.01"></label>',
        )
        .join("") +
      '</details><details><summary>Underwater camera effect</summary><label><input id="underwaterEnabled" type="checkbox">Enable distortion (no tint)</label>' +
      [
        ["underwaterStrength", "Distortion strength", 0, 0.05],
        ["underwaterSpeed", "Distortion speed", -5, 5],
        ["underwaterFrequency", "Wave count", 1, 20],
      ]
        .map(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.9 — Returns "<label>" plus label plus "<input id=\"water-" plus k plus "\" type=\"number\" min=\"" plus min plus "\" max=\"" plus max plus "\" step=\"0.001\"></label>". Inputs: array pattern. Returns: "<label>" plus label plus "<input id=\"water-" plus k plus "\" type=\"number\" min=\"" plus min plus "\" max=\"" plus max plus "\" step=\"0.001\"></label>". */
  /* @function editor-tools.callback.9Reviewed — Builds one underwater distortion numeric control from trusted metadata. Inputs: key, label and UI min/max. Returns label/input markup with a 0.001 step; validation occurs on Apply. No water mutation or rendering effect by itself. */ ([
            k,
            label,
            min,
            max,
          ]) =>
            "<label>" +
            label +
            '<input id="water-' +
            k +
            '" type="number" min="' +
            min +
            '" max="' +
            max +
            '" step="0.001"></label>',
        )
        .join("") +
      '</details><button id="applyWater">Apply water material</button><button id="testPool">Create wading test pool</button><p>Above-water views hide submerged bodies; underwater views reveal them. Shorelines follow terrain. Place assets in img/water. Swimming is deferred.</p>';
    box.after(water);
    const flight = document.createElement("fieldset");
    flight.id = "flightSettings";
    flight.innerHTML =
      '<legend>Player movement ability</legend><label>Mode<select id="flightMode"><option value="ground">Ground</option><option value="hover">Hover above terrain</option><option value="flight">Free flight</option></select></label>' +
      [
        ["height", "Hover clearance"],
        ["ascent", "Ascent speed"],
        ["descent", "Descent speed"],
        ["acceleration", "Hover response"],
        ["min", "Minimum altitude"],
        ["max", "Maximum altitude"],
      ]
        .map(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.10 — Returns "<label>" plus label plus "<input id=\"flight-" plus k plus "\" type=\"number\" step=\"0.1\"></label>". Inputs: array pattern. Returns: "<label>" plus label plus "<input id=\"flight-" plus k plus "\" type=\"number\" step=\"0.1\"></label>". */
  /* @function editor-tools.callback.10Reviewed — Builds one movement ability numeric control. Inputs: trusted profile key and readable label. Returns label/input HTML with a 0.1 step; does not apply movement or validate the authored profile. */ ([
            k,
            label,
          ]) =>
            "<label>" +
            label +
            '<input id="flight-' +
            k +
            '" type="number" step="0.1"></label>',
        )
        .join("") +
      '<button id="applyFlight">Apply ability</button><p>Free flight: E ascends, Q descends. Other actors can reuse the same movement profile API.</p>';
    water.after(flight);
    $("applyWater").onclick =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.onclick.11 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */
  /* @function editor-tools.onclick.11Reviewed — Submits water material controls through the host Undo transaction. Inputs: none. Returns mutate result; the nested callback validates before replacing world.water. Host controls failure rollback and persistence. */ () =>
        api.mutate(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.12 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: w water. Uses: api world; frontier water validate; $; number. */
  /* @function editor-tools.callback.12Reviewed — Builds and validates replacement water settings from editor controls. Inputs: none, current world water and captured DOM. Returns nothing; replaces world.water only after validation. Preserves embedded texture only when the selected filename matches current water texture; reads level in world units and other material/effect parameters in their profile units. Invalid data throws to the host transaction. */ () => {
            const w = api.world();
            w.water = FrontierWater.validate({
              ...w.water,
              underwaterEnabled: $("underwaterEnabled").checked,
              level: Number($("waterLevel").value),
              color: $("waterColor").value,
              texture: $("waterTexture").value,
              embeddedTexture:
                api.world().water?.texture === $("waterTexture").value
                  ? api.world().water?.embeddedTexture || ""
                  : "",
              ...Object.fromEntries(
                [
                  "scale",
                  "speed",
                  "warp",
                  "flowX",
                  "flowY",
                  "underwaterStrength",
                  "underwaterSpeed",
                  "underwaterFrequency",
                ].map(
                  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.13 — Returns a list of k, number using $ using "water-" plus k value. Inputs: k. Uses: number; $. Returns: a list of k, number using $ using "water-" plus k value. */
  /* @function editor-tools.callback.13Reviewed — Reads one water numeric setting for Object.fromEntries. Inputs: profile key. Returns key and Number-converted control value; no world mutation. Nonfinite/invalid values are rejected by water validation. */ (
                    k,
                  ) => [k, Number($("water-" + k).value)],
                ),
              ),
            });
          },
        );
    $("testPool").onclick =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.onclick.14 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */
  /* @function editor-tools.onclick.14Reviewed — Creates the wading test pool through one host Undo transaction. Inputs: none. Returns mutate result; the callback edits terrain and painted water together. Host owns validation, rollback and saving. */ () =>
        api.mutate(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.15 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: w terrain edits; w water; w terrain edits at x plus "," plus y; w water cells at x plus "," plus y; w terrain revision. Uses: api world; frontier water pool heights; frontier water validate; frontier terrain base height. */
  /* @function editor-tools.callback.15Reviewed — Authors a small pool near the current spawn. Inputs: none, world accessed through the host. Returns nothing; computes bounded center/pool heights, stores terrain offsets relative to base height and water-cell surface heights in world units, increments terrain revision and invalidates water cache. Initializes missing edit/water records. Assumes supported terrain and spawn bounds; helper failures propagate to the transaction. */ () => {
            const w = api.world(),
              cx = Math.max(4, Math.min(w.width - 5, w.spawn.x - 6)),
              cy = Math.max(4, Math.min(w.height - 5, w.spawn.y + 4)),
              pool = FrontierWater.poolHeights(w, cx, cy),
              bottom = pool.bottom;
            w.terrain.edits ||= {};
            w.water ||= FrontierWater.validate();
            for (let y = Math.floor(cy - 3); y <= Math.ceil(cy + 3); y++)
              for (let x = Math.floor(cx - 3); x <= Math.ceil(cx + 3); x++) {
                w.terrain.edits[x + "," + y] =
                  bottom - FrontierTerrain.baseHeight(w, x, y);
                if (x < cx + 3 && y < cy + 3)
                  w.water.cells[x + "," + y] = pool.surface;
              }
            w.terrain.revision = (w.terrain.revision || 0) + 1;
            FrontierWater.invalidate(w);
          },
        );
    $("applyFlight").onclick =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.onclick.16 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */
  /* @function editor-tools.onclick.16Reviewed — Applies the authored player movement ability through host Undo. Inputs: none. Returns mutate result; validation/replacement occurs inside the callback. Does not directly move the player or save outside the host transaction. */ () =>
        api.mutate(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.17 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: api world using flight. Uses: api world; frontier flight validate; $; object from entries. */
  /* @function editor-tools.callback.17Reviewed — Validates and replaces current world flight profile from controls. Inputs: none. Returns nothing; mode plus Number-converted numeric fields pass through FrontierFlight.validate before assignment. Invalid combinations throw; host handles transaction failure and persistence. */ () => {
            api.world().flight = FrontierFlight.validate({
              mode: $("flightMode").value,
              ...Object.fromEntries(
                [
                  "height",
                  "ascent",
                  "descent",
                  "acceleration",
                  "min",
                  "max",
                ].map(
                  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.18 — Returns a list of k, number using $ using "flight-" plus k value. Inputs: k. Uses: number; $. Returns: a list of k, number using $ using "flight-" plus k value. */
  /* @function editor-tools.callback.18Reviewed — Reads one flight profile numeric control. Inputs: profile key. Returns key/value pair after Number conversion, without world mutation; flight validation determines supported ranges and units. */ (
                    k,
                  ) => [k, Number($("flight-" + k).value)],
                ),
              ),
            });
          },
        );
    // Imported previews do not silently pretend to copy files. The map stores filename;
    // desktop/browser exports can resolve that filename from the water asset folder.
    $("waterImport").onchange =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.onchange.19 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: reader onload. Uses: $; reader read as data url. Returns: without a result. */
  /* @function editor-tools.onchange.19Reviewed — Starts reading a user-selected water image into an embedded data URL. Inputs: none, file control selection. Returns nothing; silently ignores absent files or files above 10,000,000 bytes, installs a load callback and starts FileReader. No explicit read-error handler here; host mutation starts only after load. Unlike the retained older note, current code embeds bytes as well as the filename. */ () => {
        const f = $("waterImport").files[0];
        if (!f || f.size > 10000000) return;
        const reader = new FileReader();
        reader.onload =
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.onload.20 — Processes a resource after it finishes loading. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */
  /* @function editor-tools.onload.20Reviewed — Commits the loaded water image through the host Undo transaction. Inputs: none, captured FileReader result and chosen file. Returns mutate result; does not itself validate or install image pixels. Host owns failure handling/persistence. */ () =>
            api.mutate(
              /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.21 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: api world using water. Uses: api world; frontier water validate. */
  /* @function editor-tools.callback.21Reviewed — Validates water settings with the imported filename and embedded image data URL. Inputs: none, captured read result and existing water profile. Returns nothing; replaces world.water after validation. Validation errors propagate before assignment; no filesystem copy occurs. */ () => {
                api.world().water = FrontierWater.validate({
                  ...api.world().water,
                  texture: f.name,
                  embeddedTexture: reader.result,
                });
              },
            );
        reader.readAsDataURL(f);
      };
    // Rebuild editor inputs from authored data after undo/import/restart.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.refresh.22 — Rebuild editor inputs from authored data after undo/import/restart. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "groundMaterial" value; $ using "libraryType" value; $ using "underwaterEnabled" checked; $ using "waterLevel" value; $ using "waterColor" value. Uses: $; api world; $ using "libraryType" replace children; a list of a record containing id, name, kind, a record containing id, name, kind, a record containing id, name, kind, a record containing id, name, kind map. */
  /* @function editor-tools.refresh.22Reviewed — Rebuilds editor values from current authored world after Undo/import/restart. Inputs: none. Returns nothing; refreshes ground, type/event option lists, water settings and flight settings, retaining the old type selection when still present and adding unknown water filenames to the picker. Does not author new world data. Required controls/services must exist; missing form data/errors propagate. */ function refresh() {
      if ($("groundMaterial"))
        $("groundMaterial").value = api.world().groundMaterial || "";
      const library = api.world().prefabs || [];
      if ($("libraryType")) {
        const old = $("libraryType").value;
        $("libraryType").replaceChildren(
          ...[
            {
              id: "builtin-tree",
              name: "Pine tree",
              kind: "tree",
            },
            {
              id: "builtin-rock",
              name: "Rock",
              kind: "rock",
            },
            {
              id: "builtin-monster",
              name: "Sentinel",
              kind: "monster",
            },
            {
              id: "builtin-ruin",
              name: "Ruined arch",
              kind: "ruin",
            },
            ...library,
          ].map(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.23 — Returns a new option. Inputs: t. Returns: a new option. */
  /* @function editor-tools.callback.23Reviewed — Creates a reusable type picker option. Inputs: built-in or authored type with name/ID. Returns a new Option; no prefab mutation or placement. */ (
              t,
            ) => new Option(t.name, t.id),
          ),
        );
        if (
          Array.from($("libraryType").options).some(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.24 — Returns o value equals old. Inputs: o. Returns: o value equals old. */
  /* @function editor-tools.callback.24Reviewed — Checks whether the previous reusable-type choice survives option rebuilding. Inputs: option element. Returns exact value match with captured old selection; no mutation. */ (
              o,
            ) => o.value === old,
          )
        )
          $("libraryType").value = old;
      }
      if ($("mapEvents")) {
        $("mapEvents").replaceChildren(
          new Option("Choose placed event", ""),
          ...(api.world().events || []).map(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.25 — Returns a new option. Inputs: e. Returns: a new option. */
  /* @function editor-tools.callback.25Reviewed — Labels an authored event for the placed-event picker. Inputs: event name and stable ID. Returns a new Option combining readable name and ID, without changing the event. */ (
              e,
            ) => new Option(e.name + " · " + e.id, e.id),
          ),
        );
      }
      const w = api.world().water || FrontierWater.validate();
      $("underwaterEnabled").checked = w.underwaterEnabled;
      $("waterLevel").value = w.level;
      $("waterColor").value = w.color;
      if (
        w.texture &&
        !Array.from($("waterTexture").options).some(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.26 — Returns o value equals w texture. Inputs: o. Returns: o value equals w texture. */
  /* @function editor-tools.callback.26Reviewed — Checks whether a water texture filename already has a picker option. Inputs: option. Returns value equality with current authored water texture; no mutation or image decoding. */ (
            o,
          ) => o.value === w.texture,
        )
      )
        $("waterTexture").add(new Option(w.texture, w.texture));
      $("waterTexture").value = w.texture;
      for (const k of [
        "scale",
        "speed",
        "warp",
        "flowX",
        "flowY",
        "underwaterStrength",
        "underwaterSpeed",
        "underwaterFrequency",
      ])
        $("water-" + k).value = w[k];
      const f = api.world().flight || FrontierFlight.defaults;
      $("flightMode").value = f.mode;
      for (const k of [
        "height",
        "ascent",
        "descent",
        "acceleration",
        "min",
        "max",
      ])
        $("flight-" + k).value = f[k];
    }
    let stroke = null;
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.stamp.27 — Handles stamp within editor tools. Inputs: p; assignment pattern. Uses: number; $; frontier brush paint; api world. */
  /* @function editor-tools.stamp.27Reviewed — Applies one terrain/water brush stamp to the current world preview. Inputs: horizontal world point and strength multiplier, default one. Returns nothing; clamps UI radius to 1–12 world units and strength to 0.05–2, then delegates brush kind/height and scaled strength to FrontierBrush.paint. Invalid/empty numeric controls use documented defaults; brush failures propagate. This preview mutation becomes Undoable only through end. */ function stamp(
      p,
      factor = 1,
    ) {
      const radius = Math.max(
          1,
          Math.min(12, Number($("brushRadius").value) || 3),
        ),
        strength = Math.max(
          0.05,
          Math.min(2, Number($("brushStrength").value) || 0.3),
        );
      FrontierBrush.paint(
        api.world(),
        p,
        $("brushTool").value,
        radius,
        strength * factor,
        $("brushTool").value === "texture" ? $("paintMaterial").value : Number($("brushHeight").value) || 0,
      );
    }
    // Snapshot a brush stroke before any preview mutation.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.begin.28 — Snapshot a brush stroke before any preview mutation. Inputs: p. Updates: stroke. Uses: structured clone; api world; stamp. Returns: false; true. */
  /* @function editor-tools.begin.28Reviewed — Starts a brush preview after capturing terrain/water for rollback. Inputs: horizontal world point or null. Returns false for no point, otherwise true after initial stamp. Stores structured clones and last point; clone/stamp failures propagate. Does not commit Undo yet; caller should finish/cancel a previous stroke before beginning another. */ function begin(
      p,
    ) {
      if (!p) return false;
      stroke = {
        before: {
          terrain: structuredClone(api.world().terrain),
          water: structuredClone(api.world().water),
        },
        last: p,
      };
      stamp(p);
      return true;
    }
    // Distance-based interpolated stamps avoid gaps on fast mouse drags.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.move.29 — Distance-based interpolated stamps avoid gaps on fast mouse drags. Inputs: p. Updates: stroke last. Uses: stamp. Returns: without a result; without a result. */
  /* @function editor-tools.move.29Reviewed — Interpolates brush preview stamps between pointer samples. Inputs: horizontal world point. Returns nothing; absent stroke/point or travel below 0.35 world units is a no-op. Uses floor(distance/0.35) samples with strength factor 0.35, caps work at 100 stamps and advances last point. Very long pointer jumps can leave an unpainted tail under this cap; no separate Undo entries. Brush errors propagate. */ function move(
      p,
    ) {
      if (!stroke || !p) return;
      const a = stroke.last,
        d = Math.hypot(p.x - a.x, p.y - a.y),
        n = Math.floor(d / 0.35);
      if (!n) return;
      for (let i = 1; i <= Math.min(n, 100); i++)
        stamp(
          {
            x: a.x + ((p.x - a.x) * i) / n,
            y: a.y + ((p.y - a.y) * i) / n,
          },
          0.35,
        );
      stroke.last = p;
    }
    // Roll preview back first, then commit via the shared validated undo path.
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.end.30 — Roll preview back first, then commit via the shared validated undo path. Inputs: assignment pattern. Updates: stroke. Uses: api world; structured clone; object assign; api mutate. Returns: false; true. */
  /* @function editor-tools.end.30Reviewed — Finishes or cancels the current brush transaction. Inputs: cancel boolean, default false. Returns false when no stroke, otherwise true on normal completion. Captures preview, clears stroke ownership, restores pre-stroke terrain/water, then commits the preview via host mutate for one Undo step or refreshes on cancellation. Clone/host failures propagate; host handles commit rollback. Does not independently invalidate all render caches. */ function end(
      cancel = false,
    ) {
      if (!stroke) return false;
      const w = api.world(),
        after = {
          terrain: structuredClone(w.terrain),
          water: structuredClone(w.water),
        },
        before = stroke.before;
      stroke = null;
      Object.assign(w, before);
      if (!cancel)
        api.mutate(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.31 — Returns object assign using api world using , after. Inputs: no explicit arguments; uses enclosing module state. Uses: object assign; api world. Returns: object assign using api world using , after. */
  /* @function editor-tools.callback.31Reviewed — Installs the completed terrain/water preview inside host mutate. Inputs: none, captured after snapshot. Returns current world from Object.assign; replaces its terrain/water references. Host validates, records Undo and persists; this callback does not perform those operations itself. */ () =>
            Object.assign(api.world(), after),
        );
      else api.refresh();
      return true;
    }
    // Group by purpose without duplicating existing controls. Advanced fields remain
    // inside their established sections; navigation is local to authoring, not game HUD.
    const library = document.createElement("fieldset");
    library.innerHTML =
      '<legend>Reusable types</legend><label>Name<input id="typeName" maxlength="80" value="New type"></label><label>Base<select id="typeBase"><option value="tree">Tree</option><option value="rock">Rock</option><option value="monster">Enemy / creature</option><option value="ruin">Scenery</option><option value="npc">NPC event</option><option value="selected">Selected event with its pages</option></select></label><label>Sprite profile<select id="typeSprite"><option value="">Vector outline</option></select></label><button id="createType">Create / replace named type</button><p>One entry per type. Placed copies belong to this map and can have their own event pages.</p>';
    host.append(library);
    for (const id of FrontierMuzzle.profiles.keys())
      $("typeSprite").add(new Option(id, id));
    const place = document.createElement("fieldset");
    place.innerHTML =
      '<legend>Place type</legend><select id="libraryType"></select><button id="useType">Place selected type</button>';
    $("sceneTool").closest("label").after(place);
    $("kind").closest("label").hidden = true;
    const oldPlace = Array.from($("sceneTool").options).find(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.32 — Returns o value equals "place". Inputs: o. Returns: o value equals "place". */
  /* @function editor-tools.callback.32Reviewed — Finds the legacy placement choice before renaming it to the reusable library tool. Inputs: scene-tool option. Returns whether value is place; no mutation in this predicate. */ (
        o,
      ) => o.value === "place",
    );
    if (oldPlace) {
      oldPlace.value = "library";
      oldPlace.textContent = "Place type";
    }
    $("useType").onclick =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.onclick.33 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "sceneTool" value. Uses: $. */
  /* @function editor-tools.onclick.33Reviewed — Chooses the reusable-type placement tool. Inputs: none. Returns nothing; sets sceneTool to library without placing an instance or changing world data. */ () => {
        $("sceneTool").value = "library";
      };
    $("createType").onclick =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.onclick.34 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */
  /* @function editor-tools.onclick.34Reviewed — Creates or replaces a named reusable type through host Undo. Inputs: none. Returns mutate result; nested callback validates required name/selection and builds prefab data. Host owns rollback, refresh and persistence. */ () =>
        api.mutate(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.35 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: event id; event name; event x; event y; event sprite profile. Uses: api world; $ using "typeName" value trim; $; error. */
  /* @function editor-tools.callback.35Reviewed — Builds a map-local reusable prefab from chosen base or selected event. Inputs: none, current controls/world. Returns nothing; rejects empty name or missing selected event, reuses matching-name ID or generates a timestamp ID, clones selected pages or creates NPC pages, resets prefab position to 1,1 and optionally assigns sprite profile. Replaces same-name prefab entries without updating existing placed copies. This older map-local prefab bank is distinct from project event templates; host transaction owns saving and Undo. */ () => {
            const w = api.world(),
              name = $("typeName").value.trim();
            if (!name) throw Error("Name the type first.");
            const base = $("typeBase").value,
              selected = (w.events || []).find(
                /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.36 — Returns e id equals $ using "selection" value. Inputs: e. Uses: $. Returns: e id equals $ using "selection" value. */
  /* @function editor-tools.callback.36Reviewed — Finds the selected event as prefab source. Inputs: candidate event. Returns equality with selection control ID, without mutation; enclosing callback rejects missing selected source. */ (
                  e,
                ) => e.id === $("selection").value,
              );
            if (base === "selected" && !selected)
              throw Error("Select a placed event first.");
            const existing = (w.prefabs || []).find(
                /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.37 — Returns t name equals name. Inputs: t. Returns: t name equals name. */
  /* @function editor-tools.callback.37Reviewed — Finds an existing prefab with the submitted name for stable ID reuse. Inputs: type record. Returns exact name equality; no mutation or case normalization. */ (
                  t,
                ) => t.name === name,
              ),
              id = existing?.id || "type-" + Date.now(),
              event =
                base === "selected"
                  ? structuredClone(selected)
                  : base === "npc"
                    ? FrontierEvents.create(id, 1, 1)
                    : null;
            if (event) {
              event.id = id;
              event.name = name;
              event.x = event.y = 1;
            }
            if (event && $("typeSprite").value)
              event.spriteProfile = $("typeSprite").value;
            const entry = {
              id,
              name,
              kind: event ? "monster" : base,
              ...($("typeSprite").value
                ? { spriteProfile: $("typeSprite").value }
                : {}),
              ...(event
                ? {
                    event,
                  }
                : {}),
            };
            w.prefabs = (w.prefabs || []).filter(
              /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.38 — Returns t name does not equal name. Inputs: t. Returns: t name does not equal name. */
  /* @function editor-tools.callback.38Reviewed — Retains prefabs whose names differ from the replacement name. Inputs: type record. Returns boolean; enclosing filter constructs a new list before appending replacement. No mutation of placed instances. */ (
                t,
              ) => t.name !== name,
            );
            w.prefabs.push(entry);
          },
        );
    const events = document.createElement("fieldset");
    events.innerHTML =
      '<legend>Placed events on this map</legend><select id="mapEvents"></select><button id="editMapEvent">Open event pages</button>';
    $("editMapEvent");
    host.append(events);
    $("editMapEvent").onclick =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.onclick.39 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: $; api choose; $ using "openEventEditor" click. */
  /* @function editor-tools.onclick.39Reviewed — Opens pages for the chosen placed event. Inputs: none. Returns nothing; nonempty picker ID invokes host selection then established event-editor button. Empty choice is a no-op; host/UI failures propagate. Does not directly edit pages. */ () => {
        const id = $("mapEvents").value;
        if (id) {
          api.choose(id);
          $("openEventEditor").click();
        }
      };
    const style = document.createElement("fieldset");
    style.innerHTML =
      '<legend>Selected asset style</legend><select id="assetTreatment"><option value="map">Use map settings</option><option value="original">Original artwork</option><option value="phosphor">Phosphor artwork</option><option value="outline">Outline artwork</option></select><button id="applyAssetStyle">Apply to selected object/event</button>';
    host.append(style);
    $("applyAssetStyle").onclick =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.onclick.40 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback. */
  /* @function editor-tools.onclick.40Reviewed — Applies selected asset treatment through host Undo. Inputs: none. Returns mutate result; callback changes the selected object/event only. Host validates and persists. */ () =>
        api.mutate(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.41 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e vector treatment. Uses: a list of spread element, spread element find; api world; error; $. */
  /* @function editor-tools.callback.41Reviewed — Updates the selected object/event artwork treatment inside a transaction. Inputs: none. Returns nothing; finds selected ID across current objects and events, throws if missing, then assigns picker value to vectorTreatment. Host performs validation/rollback/save; no source image mutation. */ () => {
            const e = [...api.world().objects, ...api.world().events].find(
              /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.42 — Returns e id equals $ using "selection" value. Inputs: e. Uses: $. Returns: e id equals $ using "selection" value. */
  /* @function editor-tools.callback.42Reviewed — Matches an object/event to the selected control ID. Inputs: entity. Returns exact ID equality, without mutation. */ (
                e,
              ) => e.id === $("selection").value,
            );
            if (!e) throw Error("Select an object/event first.");
            e.vectorTreatment = $("assetTreatment").value;
          },
        );
    // Saves belong to the live session. Entering authoring starts a fresh session,
    // so keep these controls outside the editor tabs and their hidden host.
    const saveLabel = document.getElementById("saveCombat")?.closest("label");
    if (saveLabel) {
      const saves = document.createElement("fieldset");
      saves.id = "playtestSaveControls";
      const legend = document.createElement("legend");
      legend.textContent = "Playtest progress";
      saves.append(legend, saveLabel);
      host.parentElement.insertBefore(saves, host);
    }
    // Keep playtest controls available in Database, with general help collapsed.
    const combat = Array.from(document.querySelectorAll("fieldset")).find(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.callback.43 — Returns chain equals "Combat testing". Inputs: el. Uses: el query selector. Returns: chain equals "Combat testing". */
  /* @function editor-tools.callback.43Reviewed — Locates existing combat-testing controls by legend text for relocation. Inputs: fieldset element. Returns whether its legend text is Combat testing; no mutation and tolerates absent legend. */ (
        el,
      ) => el.querySelector("legend")?.textContent === "Combat testing",
    );
    if (combat) host.append(combat);
    const nav = document.createElement("nav");
    nav.className = "editorTabs";
    const sections = {
      Map: [],
      Room: [],
      Terrain: [],
      Place: [],
      Events: [],
      Database: [],
      Vectrex: [],
    };
    for (const el of Array.from(host.children)) {
      if (["undo", "redo"].includes(el.id)) continue;
      const title = el.querySelector("legend")?.textContent || "";
      let tab = "Place";
      if (el.id === "export" || el.querySelector("#import")) tab = "Map";
      // October 14: stable layout identity survives human-readable renaming;
      // category routing must not depend solely on display wording.
      else if (el.id === "roomLayoutTools" || /Interior|Room |Map connections|Normal-map/.test(title))
        tab = "Room";
      else if (/Vectrex|Vector beam/.test(title)) tab = "Vectrex";
      else if (/Terrain brush|Water material|Landscape/.test(title))
        tab = "Terrain";
      else if (
        /Blood \/ Cerebral|movement ability|Global parameters|Reusable types|Selected asset style|Combat testing/.test(
          title,
        )
      )
        tab = "Database";
      else if (
        /Sky and distant scenery|Map library|bounds|activity|Soundtrack|distance fog|Vector beam|click feedback/.test(
          title,
        )
      )
        tab = "Map";
      else if (el.id === "eventInspector" || /Placed events/.test(title))
        tab = "Events";
      sections[tab].push(el);
    }
    let selected = "Place";
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.select.44 — Handles select within editor tools. Inputs: tab. Updates: selected; $ using "sceneTool" value. Uses: end; object entries; el class list toggle; btn set attribute. */
  /* @function editor-tools.select.44Reviewed — Switches the active authoring category. Inputs: category name from the established section keys. Returns nothing; cancels any brush preview, hides other sections except nodes relocated into workspaceAssets, updates navigation pressed states and selects brush for Terrain or exits brush for other categories. Does not change authored data except rollback of a pending preview. Host cancellation errors propagate; palette availability is preserved when inspector category changes. */ function select(
      tab,
    ) {
      // October 13: palette nodes relocated by engine-workspace stay available
      // while the right inspector switches categories. Their old category
      // references must not hide stair/group commands during Room selection.
      selected = tab;
      if (stroke) end(true);
      for (const [name, items] of Object.entries(sections))
        for (const el of items)
          el.classList.toggle(
            "toolTabHidden",
            name !== tab && !el.closest("#workspaceAssets"),
          );
      for (const btn of nav.children)
        btn.setAttribute("aria-pressed", String(btn.textContent === tab));
      if (tab === "Terrain") $("sceneTool").value = "brush";
      else if ($("sceneTool").value === "brush")
        $("sceneTool").value = "select";
    }
    for (const tab of Object.keys(sections)) {
      const btn = document.createElement("button");
      btn.textContent = tab;
      btn.onclick =
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.onclick.45 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: select. Returns: select using tab. */
  /* @function editor-tools.onclick.45Reviewed — Selects the category captured by this navigation button. Inputs: none. Returns select result; changes authoring UI and may cancel a brush preview, without committing a new authored edit. */ () =>
          select(tab);
      nav.append(btn);
    }
    const actions = document.createElement("div");
    actions.className = "editorActions";
    $("undo").textContent = "Undo change";
    actions.append($("undo"), $("redo"));
    host.prepend(actions);
    host.prepend(nav);
    select("Place");
    refresh();
    return {
      begin,
      move,
      end,
      refresh,
      select,
      active:
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-tools.active.46 — Returns $ using "sceneTool" value equals "brush". Inputs: no explicit arguments; uses enclosing module state. Uses: $. Returns: $ using "sceneTool" value equals "brush". */
  /* @function editor-tools.active.46Reviewed — Reports whether scene input should route to terrain painting. Inputs: none. Returns whether sceneTool value is brush; does not inspect active category, mutate the world or start a stroke. Requires mounted control. */ () =>
          $("sceneTool").value === "brush",
    };
  }
  root.FrontierEditorTools = {
    create,
  };
})(window);
