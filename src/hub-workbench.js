/* 2026-10-09: cell authoring and static inventory placement. This adapter keeps



 * compact persistence separate from active render entities and event pages.



 * All authoring edits pass through the application's existing undo boundary. */

(/* @function hub-workbench.install — Inputs: browser/global namespace. Publishes pure validation and UI/runtime factory. Returns nothing; no world is loaded at module evaluation. */ function (
  root,
) {
  "use strict";

  /* @function hub-workbench.validateEvent — Inputs: hub event extension. Returns normalized door/container/merchant/pawnshop settings; throws malformed fields before import/adoption. World placement is owned by the event, zone transforms remain local. */

  function validateEvent(v) {
    if (!v || !["door", "container", "merchant", "pawnshop"].includes(v.kind))
      throw Error("Invalid hub event type.");
    const owner = root.FrontierHubState.owner(v.owner),
      stock = (v.stock || []).map(
        /* @function hub-workbench.stockStack — Inputs: stock stack. Returns validated compact item; throws invalid quantities/ownership. */ (
          s,
        ) => root.FrontierHubState.item(s),
      );
    if (stock.length > 2000) throw Error("Storage capacity exceeded.");
    if (
      v.kind === "door" &&
      (typeof v.map !== "string" ||
        !v.map ||
        typeof v.entrance !== "string" ||
        !v.entrance)
    )
      throw Error("Door needs a destination cell and arrival.");
    return {
      kind: v.kind,
      owner,
      stock,
      ...(v.kind === "door"
        ? {
            map: v.map,
            entrance: v.entrance,
            transition: root.FrontierDoorTransition.validate(v.transition),
          }
        : {}),
    };
  }

  /* @function hub-workbench.dialog — Inputs: title and optional dismiss handler. Returns modal element with status/footer. Close removes it and restores pause through caller. All fields are large plain-language controls. */

  function dialog(title, dismiss) {
    const d = document.createElement("dialog");
    d.className = "hubDialog";
    d.setAttribute("aria-label", title);
    const h = document.createElement("h2");
    h.textContent = title;
    d.append(h);
    d.notice = document.createElement("p");
    d.notice.setAttribute("role", "status");
    d.footer = document.createElement("footer");
    d.addEventListener(
      "close",
      /* @function hub-workbench.closeDialog — Inputs: close event unused. Removes UI and calls optional dismissal; no persistent data changed. */ () => {
        d.remove();
        dismiss?.();
      },
    );
    document.body.append(d);
    return d;
  }

  /* @function hub-workbench.field — Inputs: parent, label, type, initial value and optional choices. Returns input/select/textarea and appends accessible label. Does not modify authored state. */

  function field(d, label, type, value, choices) {
    const l = document.createElement("label");
    l.textContent = label;
    const input = document.createElement(
      type === "select" ? "select" : type === "json" ? "textarea" : "input",
    );
    if (type === "select") {
      for (const [name, id] of choices) input.append(new Option(name, id));
    } else if (type !== "json") input.type = type;
    input.value =
      type === "json" ? JSON.stringify(value, null, 2) : (value ?? "");
    if (type === "checkbox") input.checked = !!value;
    input.setAttribute("aria-label", label);
    l.append(input);
    d.append(l);
    return input;
  }

  /* @function hub-workbench.button — Inputs: parent, readable label and operation. Returns button. On error displays message in owning dialog; never commits a partial operation itself. */

  function button(parent, label, operation) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.onclick =
      /* @function hub-workbench.buttonAction — Inputs: click unused. Calls operation; catches and displays failures. Returns nothing, no automated retries. */ () => {
        try {
          operation();
        } catch (error) {
          const d = b.closest("dialog");
          if (d?.notice) d.notice.textContent = error.message;
          else {
            const panel = b.closest("#inventoryPanel");
            if (panel) {
              let notice = panel.querySelector("[data-inventory-notice]");
              if (!notice) { notice = document.createElement("p"); notice.dataset.inventoryNotice = "true"; notice.setAttribute("role", "status"); panel.prepend(notice); }
              notice.textContent = error.message;
            } else console.error(error);
          }
        }
      };
    parent.append(b);
    return b;
  }

  /* @function hub-workbench.finish — Inputs: modal and apply callback. Appends Apply/Cancel, opens modal. Apply closes only after successful operation; Cancel leaves drafts untouched. */

  function finish(d, apply) {
    button(
      d.footer,
      "Apply",
      /* @function hub-workbench.applyDialog — Inputs: none. Validates/commits via supplied operation then closes. Throws preserve draft for correction. */ () => {
        apply();
        d.close();
      },
    );
    button(
      d.footer,
      "Cancel",
      /* @function hub-workbench.cancelDialog — Inputs: none. Closes without applying draft; no persistent side effects. */ () =>
        d.close(),
    );
    d.append(d.notice, d.footer);
    d.showModal();
  }

  /* @function hub-workbench.create — Inputs: application adapter providing getters, mutation, editor, travel, pause, sound preview. Returns authoring/runtime operations; mutable session stores remain owned by application. No independent timers are created. */

  function create(api) {
    let lastStore = null,
      nextCleanup = 0,
      cleanupElapsed = 0,
      dropSignature = "",
      cachedDrops = [],
      cachedItemDefinitions = null;

    /* @function hub-workbench.catalog — Inputs: item ID. Returns shared small definition or readable fallback. No image/model decode; unknown engine items remain droppable as a generic chest. */

    function catalog(id) {
      return (
        root.FrontierItems?.find(
          /* @function hub-workbench.findItem — Inputs: catalog entry. Returns matching stable ID; no effects. */ (
            i,
          ) => i.id === id,
        ) || { id, name: id, graphic: "chest", price: 1 }
      );
    }

    /* @function hub-workbench.current — Inputs: none. Returns session store and current cell state. Historical note: initialization was bounded by a 32-cell limit. Superseded October 13, 2026: cells are compact persistent records without that count cap; per-cell stack budgets remain. */

    function current() {
      const store = api.state();
      return { store, cell: root.FrontierHubState.cell(store, api.map()) };
    }

    /* @function hub-workbench.cellSettings — Inputs: none. Opens a private cell policy draft including named arrivals, atmosphere and default transition. Apply uses undoable world mutation; Cancel changes nothing. */

    /* October 13, 2026: typed arrival, fog and normal-light drafts supersede routine JSON textareas. The old JSON draft explanation above is historical; exact prior source is archived. Apply remains one validated undo transaction. */
    /* @function hubWorkbench.arrivalFields1524 — Inputs: dialog and saved named arrivals. Returns add/read draft methods. October 13 adds optional Z in metres; blank omits it for automatic support selection, preserving old arrivals. Creates independent typed rows; yaw is displayed in degrees and persisted in radians. Removal changes only draft DOM. Caps rows at 100 and leaves final schema validation to Apply; no world mutation. */
    function arrivalFields1524(d, values) {
      const host = document.createElement("fieldset");
      host.innerHTML =
        "<legend>Named arrival points</legend><p>X/Y/Z use world metres; facing uses degrees. Leave Z blank for automatic floor selection. IDs link doors to these arrival points.</p>";
      d.append(host);
      const rows = [];
      /* @function hubWorkbench.addArrivalRow1524 — Inputs: arrival record. Returns nothing; appends independent ID/name/position/facing controls. Throws at the 100-arrival limit without changing authored data. */
      function add(value) {
        if (rows.length >= 100) throw Error("At most 100 arrival points.");
        const box = document.createElement("fieldset"),
          r = { box };
        box.innerHTML = "<legend>Arrival</legend>";
        for (const key of ["id", "name", "x", "y", "z", "yaw"]) {
          r[key] = field(
            box,
            {
              id: "Arrival ID",
              name: "Arrival name",
              x: "Arrival X (metres)",
              y: "Arrival Y (metres)",
              z: "Arrival Z (metres, blank = automatic)",
              yaw: "Arrival facing (degrees)",
            }[key],
            ["id", "name"].includes(key) ? "text" : "number",
            key === "yaw" ? ((value.yaw || 0) * 180) / Math.PI : value[key],
          );
          if (["x", "y", "z", "yaw"].includes(key)) r[key].step = "0.1";
          if (key === "z") {
            r[key].min = "-100";
            r[key].max = "100";
          }
        }
        button(
          box,
          "Remove arrival",
          /* @function hubWorkbench.removeArrival1524 — Inputs: none. Returns nothing; removes only the selected draft row, releasing its references. Apply/Cancel still own persistence. */ function () {
            rows.splice(rows.indexOf(r), 1);
            box.remove();
          },
        );
        host.append(box);
        rows.push(r);
      }
      for (const value of values) add(value);
      return {
        add,
        /* @function hubWorkbench.readArrivals1524 — Inputs: none. Returns fresh records from current draft controls, converting yaw degrees to radians. Invalid values are rejected by authoritative cell validation before commit. */ read() {
          return rows.map(
            /* @function hubWorkbench.arrivalRecord1524 — Inputs: draft row. Returns plain record without DOM references; no mutation. */ function (
              r,
            ) {
              return {
                id: r.id.value.trim(),
                name: r.name.value,
                x: Number(r.x.value),
                y: Number(r.y.value),
                ...(r.z.value.trim() === "" ? {} : { z: Number(r.z.value) }),
                yaw: (Number(r.yaw.value) * Math.PI) / 180,
              };
            },
          );
        },
      };
    }
    /* @function hubWorkbench.atmosphereFields1524 — Inputs: dialog, saved fog and optional sprite-normal light. Returns typed draft readers using production validators. Distances are metres, brightness dimensionless, normal direction components -1 to 1. Controls do not modify the cell until Apply; disabled fog retains authored distances. */
    function atmosphereFields1524(d, fogValue, lightValue) {
      const f = root.FrontierFog.validate(fogValue),
        l = root.FrontierSpriteLighting.validate(lightValue),
        box = document.createElement("fieldset");
      box.innerHTML =
        "<legend>Fog and sprite normal-map lighting</legend><p>Normal direction is in sprite texture space; this is separate from world radius lights.</p>";
      d.append(box);
      const enabled = field(box, "Enable cell fog", "checkbox", f.enabled),
        start = field(box, "Fog start (metres)", "number", f.start),
        end = field(box, "Fog end (metres)", "number", f.end),
        color = field(box, "Fog color", "color", f.color),
        normal = {};
      start.min = "0";
      end.max = "200";
      start.step = end.step = "0.1";
      for (const key of ["ambient", "strength", "x", "y", "z"]) {
        normal[key] = field(
          box,
          {
            ambient: "Sprite normal ambient (0–1)",
            strength: "Sprite normal strength (0–2)",
            x: "Normal light X (-1–1)",
            y: "Normal light Y (-1–1)",
            z: "Normal light Z (-1–1)",
          }[key],
          "number",
          l[key],
        );
        normal[key].step = "0.05";
        normal[key].min = ["ambient", "strength"].includes(key) ? "0" : "-1";
        normal[key].max = key === "strength" ? "2" : "1";
      }
      return {
        /* @function hubWorkbench.readFog1524 — Inputs: none. Returns validated fog draft; throws malformed range/color, leaving dialog and world unchanged. */ read() {
          return root.FrontierFog.validate({
            enabled: enabled.checked,
            start: Number(start.value),
            end: Number(end.value),
            color: color.value,
          });
        },
        /* @function hubWorkbench.readNormalLight1524 — Inputs: none. Returns validated dimensionless normal-light draft; zero directions and out-of-range values reject Apply. */ light() {
          const value = {};
          for (const key of ["ambient", "strength", "x", "y", "z"])
            value[key] = Number(normal[key].value);
          return root.FrontierSpriteLighting.validate(value);
        },
      };
    }
    /* @function hubWorkbench.cellSettingsTyped1524 — Inputs: none; current authored cell via adapter. Returns nothing. Opens independent typed arrival/fog/normal-light/policy drafts; Apply validates all fields then commits one undoable mutation. Cancel preserves world settings. Distances are metres, displayed facing degrees becomes saved radians. Failed Apply leaves draft open with feedback. */
    function cellSettings() {
      const world = api.world(),
        d = dialog("Cell settings and arrivals"),
        v = root.FrontierHubState.settings(world.cell),
        safeField = field(d, "Safe area (disable ordinary combat)", "checkbox", v.safe),
        protectedField = field(
          d,
          "Keep dropped items permanently (home / inn)",
          "checkbox",
          v.protected,
        ),
        cleanup = field(
          d,
          "Recover abandoned items after game seconds",
          "number",
          v.cleanupSeconds,
        ),
        arrivals = arrivalFields1524(d, v.arrivals),
        effect = field(
          d,
          "Default cell transition",
          "select",
          world.transitionEffect || "fade",
          [
            ["Fade", "fade"],
            ["Screen melt", "melt"],
            ["3D door", "door"],
            ["Immediate", "immediate"],
          ],
        ),
        fog = atmosphereFields1524(d, world.fog, v.light);

      button(
        d,
        "Add arrival at player position",
        /* @function hub-workbench.addArrival — Inputs: none. Adds a named point to the private arrival draft at player XYZ/yaw. Historical JSON drafting is superseded by typed rows. Does not alter world until Apply. */ () => {
          const p = api.game().player;
          arrivals.add({
            id: "arrival-" + Date.now().toString(36),
            name: "Doorway",
            x: p.x,
            y: p.y,
            z: p.z || 0,
            yaw: api.game().camera.yaw || 0,
          });
        },
      );

      finish(
        d,
        /* @function hub-workbench.applyCell — Inputs: none. Validates policy, fog and light before undoable mutation. Returns nothing. Each cell carries its own settings through export/import. */ () => {
          const policy = root.FrontierHubState.settings({
              protected: protectedField.checked,
              safe: safeField.checked,
              cleanupSeconds: Number(cleanup.value),
              arrivals: arrivals.read(),
              light: fog.light(),
            }),
            atmosphere = fog.read();
          api.mutate(
            /* @function hub-workbench.commitCell — Inputs: none. Assigns prevalidated cell settings, fog and transition mode to current authored world; caller records undo. */ () => {
              api.world().cell = policy;
              if (api.world().spriteNormals)
                for (const binding of api.world().spriteNormals.entries)
                  binding.light = { ...policy.light };
              api.world().fog = atmosphere;
              api.world().transitionEffect = effect.value;
            },
          );
        },
      );
    }

    /* @function hub-workbench.doorSettings — Inputs: placement point and optional existing event. Opens destination, zone and transition draft. Selecting Apply creates/updates an invisible event through the existing event draft, requiring its final Apply as usual. */

    /* @function hubWorkbench.vectorFields1524 — Inputs: dialog parent, descriptive prefix, initial three-component vector and optional minimum. Returns typed draft reader; appends XYZ number controls with 0.1 steps. Units belong to prefix. Reading is nonmutating; final component schema rejects invalid numbers/ranges before commit. */
    function vectorFields1524(parent, label, values, minimum) {
      const group = document.createElement("fieldset"),
        legend = document.createElement("legend");
      legend.textContent = label;
      group.append(legend);
      parent.append(group);
      const inputs = [];
      for (let axis = 0; axis < 3; axis++) {
        const input = field(
          group,
          label + " " + ["X", "Y", "Z"][axis],
          "number",
          values[axis],
        );
        input.step = "0.1";
        if (minimum !== undefined) input.min = String(minimum);
        inputs.push(input);
      }
      return {
        /* @function hubWorkbench.readVector1524 — Inputs: none. Returns fresh XYZ numeric values from independent draft fields; no source or DOM mutation. */ read() {
          return inputs.map(
            /* @function hubWorkbench.vectorComponent1524 — Inputs: number input. Returns numeric component for authoritative validation. */ function (
              input,
            ) {
              return Number(input.value);
            },
          );
        },
      };
    }
    /* @function hubWorkbench.doorSettingsTyped1524 — Inputs: world placement point and optional existing event. Returns nothing. Opens independent door/zone draft with typed dimensions, rotations and timing plus composition subdialogs; raw JSON is retained only in Advanced. Apply validates before opening the ordinary event editor, preserving its final undo/save boundary. */
    function doorSettings(point, existing) {
      const draft = existing
          ? structuredClone(existing)
          : root.FrontierEvents.create(
              "event-" + crypto.randomUUID(),
              point.x,
              point.y,
            ),
        hub = draft.extensions?.hub || {
          kind: "door",
          map: api.map(),
          entrance: "spawn",
        },
        config = root.FrontierDoorTransition.validate(hub.transition),
        d = dialog("Door / invisible transfer zone"),
        name = field(d, "Door name", "text", existing?.name || "Door"),
        placementX = field(d, "Placement X (metres)", "number", draft.x),
        placementY = field(d, "Placement Y (metres)", "number", draft.y),
        maps = api.maps().maps,
        map = field(
          d,
          "Destination map",
          "select",
          hub.map,
          maps.map(
            /* @function hub-workbench.mapOption — Inputs: map. Returns name/ID option pair; no effects. */ (
              m,
            ) => [m.name, m.id],
          ),
        ),
        arrival = field(
          d,
          "Arrival position and facing",
          "select",
          hub.entrance,
          [["Default map spawn", "spawn"]],
        ),
        mode = field(d, "Transition style", "select", config.effect, [
          ["Use cell default", "default"],
          ["3D door", "door"],
          ["Screen melt", "melt"],
          ["Fade", "fade"],
          ["Immediate", "immediate"],
        ]),
        approach = field(
          d,
          "Camera approach seconds",
          "number",
          config.approach,
        ),
        passage = field(d, "Camera passage seconds", "number", config.passage),
        distance = field(
          d,
          "Camera approach distance (world units)",
          "number",
          config.approachDistance,
        ),
        leaves = field(
          d,
          "Moving leaves — model/node, hinged or sliding, speed, angle/distance, local transform",
          "json",
          config.leaves,
        ),
        frame = field(
          d,
          "Static frame — model/node, or null for door only",
          "json",
          config.frame,
        ),
        sync = field(
          d,
          "Synchronize paired leaves",
          "checkbox",
          config.synchronized,
        ),
        size = vectorFields1524(
          d,
          "Clickable zone size (metres)",
          draft.spatial?.interactionZones?.[0]?.size || [0.9, 0.3, 2.1],
          0.01,
        ),
        rotation = vectorFields1524(
          d,
          "Zone rotation (degrees)",
          draft.spatial?.rotation || [0, 0, 0],
        ),
        offset = field(
          d,
          "Elevation offset (negative sinks into ground)",
          "number",
          draft.heightOffset || 0,
        );

      /* @function hubWorkbench.arrivalChoices1525 — Inputs: optional retained arrival ID. Returns nothing; rebuilds the destination picker from authored map arrivals and entrance records, displaying XYZ metres and facing degrees. No map edits; missing saved IDs remain visible for correction and authoritative Apply rejects them. */
      function arrivalChoices1525(retain = "spawn") {
        const destination = maps.find(
          /* @function hubWorkbench.destinationChoice1525 — Inputs: map record. Returns selected stable map-ID match; no effects. */
          function (entry) { return entry.id === map.value; });
        arrival.replaceChildren(new Option("Default map spawn", "spawn"));
        const points = [...(destination?.world.cell?.arrivals || []),
          ...(destination?.world.interior?.entrances || []),
          ...(destination?.world.travel?.entrances || [])];
        const seen = new Set(["spawn"]);
        for (const point of points) {
          if (seen.has(point.id)) continue;
          seen.add(point.id);
          arrival.append(new Option((point.name || point.id) + " — X " + point.x + ", Y " + point.y + ", Z " + (point.z ?? "auto") + ", facing " + Math.round((point.yaw || 0) * 180 / Math.PI) + "°", point.id));
        }
        if (!seen.has(retain)) arrival.append(new Option("Missing arrival: " + retain, retain));
        arrival.value = retain;
      }
      map.onchange = /* @function hubWorkbench.changedDestination1525 — Inputs: change ignored. Returns nothing; selects the new map's default spawn and updates available arrival choices. No mutation. */ function () { arrivalChoices1525(); };
      arrivalChoices1525(hub.entrance || "spawn");
      const arrivalHelp = document.createElement("p");
      arrivalHelp.textContent = "To create or move an arrival: open the destination map, then Cell settings / arrivals. Set its X/Y/Z and facing there; select its name here.";
      arrival.parentElement.after(arrivalHelp);

      // October 13: retain exact composition JSON for unusual assemblies, but
      // routine authoring uses the leaf/frame subdialogs and typed zone fields.
      const advancedComposition = document.createElement("details");
      advancedComposition.innerHTML =
        "<summary>Advanced door composition JSON</summary>";
      advancedComposition.append(leaves.parentElement, frame.parentElement);
      d.append(advancedComposition);
      const hold = field(
        d,
        "Black-space hold (seconds)",
        "number",
        config.hold,
      );
      hold.min = "0";
      hold.max = "10";
      hold.step = "0.1";
      // October 9: ordinary door authoring uses labeled controls; advanced JSON remains

      // available for precise local pivots and unusual assemblies.

      button(
        d,
        "Edit moving door leaves...",
        /* @function hub-workbench.openLeaves — Inputs: click unused. Opens a private numeric composition editor; applying changes only the parent draft until final event Apply. */ () => {
          const child = dialog("Moving door leaves"),
            initial = root.FrontierDoorTransition.validate({
              leaves: JSON.parse(leaves.value),
            }).leaves,
            count = field(
              child,
              "Number of moving leaves",
              "select",
              String(initial.length),
              [
                ["Frame only", "0"],
                ["Single door", "1"],
                ["Paired doors", "2"],
              ],
            ),
            records = [];

          for (let i = 0; i < 2; i++) {
            const c =
                initial[i] || root.FrontierDoorTransition.validate().leaves[0],
              group = document.createElement("fieldset"),
              legend = document.createElement("legend");
            legend.textContent = "Door leaf " + (i + 1);
            group.append(legend);
            child.append(group);
            const record = {
              model: field(
                group,
                "Leaf " + (i + 1) + " model",
                "select",
                c.modelId,
                root.FrontierModelLibrary.list().map(
                  /* @function hub-workbench.leafModel — Inputs: shared model. Returns name/ID option; no loading or mutation. */ (
                    m,
                  ) => [m.name, m.id],
                ),
              ),
              node: field(
                group,
                "Leaf " + (i + 1) + " mesh node",
                "number",
                c.node,
              ),
              motion: field(
                group,
                "Leaf " + (i + 1) + " motion",
                "select",
                c.motion,
                [
                  ["Swing on hinge", "hinged"],
                  ["Slide", "sliding"],
                ],
              ),
              angle: field(
                group,
                "Leaf " + (i + 1) + " opening angle (signed degrees)",
                "number",
                c.angle,
              ),
              speed: field(
                group,
                "Leaf " +
                  (i + 1) +
                  " speed (degrees/sec for swing; units/sec for slide)",
                "number",
                c.speed,
              ),
              distance: field(
                group,
                "Leaf " + (i + 1) + " sliding distance (world units)",
                "number",
                c.distance,
              ),
              position: [],
              rotation: [],
              scale: [],
              axis: [],
              hingeAxis: [],
              pivot: c.pivot,
            };

            for (const key of [
              "position",
              "rotation",
              "scale",
              "axis",
              "hingeAxis",
            ])
              for (let axis = 0; axis < 3; axis++)
                record[key].push(
                  field(
                    group,
                    "Leaf " + (i + 1) + " " + key + " " + ["X", "Y", "Z"][axis],
                    "number",
                    c[key][axis],
                  ),
                );
            records.push(record);
          }

          finish(
            child,
            /* @function hub-workbench.applyLeaves — Inputs: none. Reads at most two leaf controls into validated local-space draft. Throws invalid values without modifying original event. */ () => {
              const result = [];
              for (let i = 0; i < Number(count.value); i++) {
                const r = records[i],
                  v = {
                    modelId: r.model.value,
                    node: Number(r.node.value),
                    motion: r.motion.value,
                    angle: Number(r.angle.value),
                    speed: Number(r.speed.value),
                    distance: Number(r.distance.value),
                    pivot: r.pivot,
                  };
                for (const key of [
                  "position",
                  "rotation",
                  "scale",
                  "axis",
                  "hingeAxis",
                ])
                  v[key] = r[key].map(
                    /* @function hub-workbench.leafNumber — Inputs: numeric control. Returns number for validation; no effects. */ (
                      input,
                    ) => Number(input.value),
                  );
                result.push(v);
              }
              leaves.value = JSON.stringify(
                root.FrontierDoorTransition.validate({ leaves: result }).leaves,
                null,
                2,
              );
            },
          );
        },
      );

      button(
        d,
        "Edit static frame...",
        /* @function hub-workbench.openFrame — Inputs: none. Opens frame-only/door-only selection without touching source geometry. Returns nothing. */ () => {
          const child = dialog("Static door frame"),
            c = JSON.parse(frame.value),
            enabled = field(child, "Show frame", "checkbox", !!c),
            model = field(
              child,
              "Frame model",
              "select",
              c?.modelId || "builtin-antique-door",
              root.FrontierModelLibrary.list().map(
                /* @function hub-workbench.frameModel — Inputs: shared asset. Returns option pair without decode. */ (
                  m,
                ) => [m.name, m.id],
              ),
            ),
            node = field(child, "Frame mesh node", "number", c?.node ?? 0);
          finish(
            child,
            /* @function hub-workbench.applyFrame — Inputs: none. Validates frame selection and replaces only parent draft; final event Apply persists. */ () => {
              frame.value = JSON.stringify(
                root.FrontierDoorTransition.validate({
                  frame: enabled.checked
                    ? { modelId: model.value, node: Number(node.value) }
                    : null,
                }).frame,
                null,
                2,
              );
            },
          );
        },
      );

      const choices = [
          ["Random appropriate sound", "random"],
          ["Choose sound manually", "manual"],
          ["Silent", "none"],
        ],
        sounds = {};
      for (const phase of ["open", "close", "creak"]) {
        const c = config[phase];
        sounds[phase] = {
          mode: field(d, phase + " sound selection", "select", c.mode, choices),
          name: field(
            d,
            phase + " manual sound",
            "select",
            c.name || "Door Open 01",
            (root.PhanicomAudioManifest || []).map(
              /* @function hub-workbench.soundOption — Inputs: manifest entry. Returns readable name pair; no decode/effects. */ (
                s,
              ) => [s.name, s.name],
            ),
          ),
          gain: field(d, phase + " sound volume 0–1", "number", c.gain),
        };
      }

      /* @function hub-workbench.readDoor — Inputs: none. Returns validated private transition configuration; throws malformed draft before preview or mutation. */

      function read() {
        const result = {
          ...config,
          effect: mode.value,
          approach: Number(approach.value),
          passage: Number(passage.value),
          approachDistance: Number(distance.value),
          hold: Number(hold.value),
          leaves: JSON.parse(leaves.value),
          frame: JSON.parse(frame.value),
          synchronized: sync.checked,
        };
        for (const phase of ["open", "close", "creak"])
          result[phase] = {
            mode: sounds[phase].mode.value,
            name: sounds[phase].name.value,
            gain: Number(sounds[phase].gain.value),
          };
        return root.FrontierDoorTransition.validate(result);
      }

      button(
        d,
        "Preview door and sounds",
        /* @function hub-workbench.previewDoor — Inputs: none. Validates private settings and plays presentation only; no map/state change. */ () => {
          api.preview(read());
        },
      );
      button(
        d,
        "Use antique hinged door preset",
        /* @function hub-workbench.hingedPreset — Inputs: none. Replaces private frame/leaves draft with supplied 176-triangle composition. */ () => {
          const preset = root.FrontierDoorTransition.validate();
          leaves.value = JSON.stringify(preset.leaves, null, 2);
          frame.value = JSON.stringify(preset.frame, null, 2);
        },
      );

      finish(
        d,
        /* @function hub-workbench.applyDoor — Inputs: none. Validates destination/zone and opens event draft with extension metadata. Existing event pages remain intact. Never makes the building mesh itself clickable. */ () => {
          const dest = maps.find(
            /* @function hub-workbench.destination — Inputs: map record. Returns selected ID match; no effects. */ (
              m,
            ) => m.id === map.value,
          );
          if (
            !dest ||
            (arrival.value !== "spawn" &&
              !dest.world.cell?.arrivals?.some(
                /* @function hub-workbench.arrivalExists — Inputs: arrival. Returns selected ID match; no effects. */ (
                  a,
                ) => a.id === arrival.value,
              ) &&
              !dest.world.interior?.entrances?.some(
                /* @function hub-workbench.roomArrival — Inputs: entrance. Returns selected ID match; no effects. */ (
                  a,
                ) => a.id === arrival.value,
              ) &&
              !dest.world.travel?.entrances?.some(
                /* @function hub-workbench.travelArrival — Inputs: entrance. Returns selected ID match; no effects. */ (
                  a,
                ) => a.id === arrival.value,
              ))
          )
            throw Error(
              "Destination arrival does not exist. Add it in that cell first.",
            );
          draft.name = name.value;
          draft.heightOffset = Number(offset.value);
          draft.extensions = {
            ...draft.extensions,
            hub: validateEvent({
              kind: "door",
              map: map.value,
              entrance: arrival.value,
              transition: read(),
            }),
          };
          // October 14: placement is editable before event validation; reject invalid coordinates explicitly rather than silently relocating the door.
          draft.x = Number(placementX.value);
          draft.y = Number(placementY.value);
          draft.pages[0].graphic = "none";
          draft.pages[0].solid = false;
          /* October 9, 2026: editing a visible door retains its model/scale and gives the closed mesh collision. New invisible transfers remain non-solid. */ draft.spatial =
            root.FrontierModelEvents.validate({
              ...draft.spatial,
              visual: draft.spatial?.visual === "model" ? "model" : "none",
              collisionMode:
                draft.spatial?.visual === "model" ? "mesh" : "none",
              rotation: rotation.read(),
              interactionZones: [
                {
                  id: "door-zone",
                  name: draft.name,
                  size: size.read(),
                  transform: draft.spatial?.interactionZones?.[0]
                    ?.transform || {
                    position: [0, 0, size.read()[2] / 2],
                  },
                  eventId: draft.id,
                  trigger: "interact",
                },
              ],
            }); // October 9: named presets bypass MZ's blank New event path; normalize

          // page defaults before showing its controls so stationary is selected.

          api.editor().beginEvent(
            root.FrontierEvents.validate([draft], new Set(), {
              width: api.world().width ?? api.world().size,
              height: api.world().height ?? api.world().size,
            })[0],
            !existing,
          );
        },
      );
    }

    /* @function hub-workbench.storageSettings — Inputs: location and optional event. Opens reusable container/merchant/pawnshop definition; stock and ownership are validated before existing event draft opens. Runtime stock persists independently per stable event ID. */

    /* @function hubWorkbench.stockFields1524 — Inputs: dialog and saved compact stock records. Returns a typed draft reader. Item IDs/count/ownership/quest protection are routine fields; extensible custom properties retain an Advanced JSON editor. Removing/adding rows changes no authored data. At most 2,000 rows; Apply validates all item records before event Save. */
    function stockFields1524(d, values) {
      const host = document.createElement("fieldset");
      host.innerHTML =
        "<legend>Starting inventory</legend><p>Use item IDs from the project item database. Each stack keeps independent ownership and custom properties.</p>";
      d.append(host);
      const rows = [];
      /* @function hubWorkbench.addStockRow1524 — Inputs: compact item. Returns nothing; validates and copies it into independent draft controls. No shared property objects or runtime storage are changed; invalid records throw before adding a row. */
      function add(value) {
        if (rows.length >= 2000) throw Error("At most 2,000 stock stacks.");
        const item = root.FrontierHubState.item(value),
          box = document.createElement("fieldset");
        box.innerHTML = "<legend>Item stack</legend>";
        const r = {
          box,
          id: field(box, "Stock item ID", "text", item.itemId),
          quantity: field(
            box,
            "Stock quantity (whole items)",
            "number",
            item.quantity,
          ),
          owner: field(box, "Stack ownership", "select", item.owner.kind, [
            ["Public", "public"],
            ["Player-owned", "player"],
            ["NPC-owned", "npc"],
          ]),
          ownerId: field(
            box,
            "Stack NPC owner ID",
            "text",
            item.owner.id || "",
          ),
          quest: field(
            box,
            "Protect stack from dropped-item cleanup",
            "checkbox",
            item.questProtected,
          ),
        };
        r.quantity.min = "1";
        r.quantity.max = "1000000";
        r.quantity.step = "1";
        const advanced = document.createElement("details");
        advanced.innerHTML =
          "<summary>Advanced custom item properties</summary>";
        r.properties = field(
          advanced,
          "Stack custom properties",
          "json",
          item.properties,
        );
        box.append(advanced);
        button(
          box,
          "Remove stock stack",
          /* @function hubWorkbench.removeStockRow1524 — Inputs: none. Returns nothing; releases only this private draft row. Final Apply/Cancel preserve the existing transaction boundary. */ function () {
            rows.splice(rows.indexOf(r), 1);
            box.remove();
          },
        );
        host.append(box);
        rows.push(r);
      }
      for (const value of values) add(value);
      button(
        d,
        "Add stock stack",
        /* @function hubWorkbench.addStock1524 — Inputs: none. Adds an independently validated single-item draft; ID remains editable before Apply. The owning button displays row-limit failures without mutating the world. */ function () {
          add({ itemId: "test-token", quantity: 1 });
        },
      );
      return {
        /* @function hubWorkbench.readStock1524 — Inputs: none. Returns newly validated compact item records from draft controls. Invalid ID/count/NPC ownership/properties reject Apply with no authored mutation. */ read() {
          return rows.map(
            /* @function hubWorkbench.stockRecord1524 — Inputs: draft row. Returns sanitized item with independently copied custom properties. JSON parsing is confined to Advanced custom data. */ function (
              r,
            ) {
              return root.FrontierHubState.item({
                itemId: r.id.value.trim(),
                quantity: Number(r.quantity.value),
                owner: { kind: r.owner.value, id: r.ownerId.value },
                questProtected: r.quest.checked,
                properties: JSON.parse(r.properties.value),
              });
            },
          );
        },
      };
    }
    /* @function hubWorkbench.storageSettingsTyped1524 — Inputs: placement XY and optional existing event. Returns nothing. Opens container/merchant/pawn-shop drafts with typed stock and ownership. Apply validates before entering the ordinary event editor; event Save owns the undoable persistent commit. Runtime merchant/storage contents are not overwritten by opening a draft. */
    function storageSettings(point, existing) {
      const draft = existing
          ? structuredClone(existing)
          : root.FrontierEvents.create(
              "event-" + crypto.randomUUID(),
              point.x,
              point.y,
            ),
        hub = draft.extensions?.hub || {
          kind: "container",
          owner: { kind: "public" },
          stock: [{ itemId: "test-token", quantity: 3 }],
        },
        d = dialog("Container / merchant"),
        name = field(d, "Name", "text", existing?.name || "Container"),
        kind = field(d, "Behavior", "select", hub.kind, [
          ["Container", "container"],
          ["Merchant", "merchant"],
          ["Pawn-shop recovery", "pawnshop"],
        ]),
        owner = field(d, "Ownership", "select", hub.owner?.kind || "public", [
          ["Public", "public"],
          ["Player-owned", "player"],
          ["NPC-owned", "npc"],
        ]),
        ownerId = field(d, "NPC owner ID", "text", hub.owner?.id || ""),
        stock = stockFields1524(d, hub.stock || []);
      finish(
        d,
        /* @function hub-workbench.applyStorage — Inputs: none. Validates private settings and opens an event draft; stock is copied only when first used in gameplay. */ () => {
          draft.name = name.value;
          draft.extensions = {
            ...draft.extensions,
            hub: validateEvent({
              kind: kind.value,
              owner: { kind: owner.value, id: ownerId.value },
              stock: stock.read(),
            }),
          };
          draft.pages[0].graphic = "chest";
          draft.pages[0].solid = false; // October 9: named presets bypass MZ's blank New event path; normalize

          // page defaults before showing its controls so stationary is selected.

          api.editor().beginEvent(
            root.FrontierEvents.validate([draft], new Set(), {
              width: api.world().width ?? api.world().size,
              height: api.world().height ?? api.world().size,
            })[0],
            !existing,
          );
        },
      );
    }

    /* @function hubWorkbench.placeItem1525 — Inputs: optional world XY point; defaults to editor player location. Returns nothing. Opens a typed item placement draft with quantity, height in metres and interaction/touch pickup. Apply creates a normal two-page event in one validated Undo transaction; collected self-switch hides the original. Invalid input leaves the map untouched. Dropping later remains Interact regardless of this initial trigger. */
    function placeItem(point = api.game().player) {
      const d = dialog("Place inventory item"),
        items = root.FrontierItems || [],
        item = field(d, "Item", "select", items[0]?.id, items.map(
          /* @function hubWorkbench.placedItemChoice1525 — Inputs: item definition. Returns readable name/ID pair; no effects. */
          function (entry) { return [entry.name, entry.id]; })),
        x = field(d, "Position X (metres)", "number", point.x),
        y = field(d, "Position Y (metres)", "number", point.y),
        size = field(d, "Sprite height (metres)", "number", 0.35),
        quantity = field(d, "Quantity", "number", 1),
        pickup = field(d, "Initial pickup method", "select", "interact", [["Interact", "interact"], ["Walk over (Quake style)", "touch"]]);
      item.onchange = /* @function hubWorkbench.itemPlacementDefaults1525 — Inputs: change ignored. Returns nothing; loads the selected item's authored size and initial pickup method into the placement draft only. */ function () {
        const definition = catalog(item.value);
        size.value = definition.properties?.worldHeight || 0.35;
        pickup.value = definition.properties?.pickupMethod || "interact";
      };
      finish(d, /* @function hubWorkbench.commitPlacedItem1525 — Inputs: Apply ignored. Returns nothing; validates count and creates pickup/collected pages, then uses host Undo mutation. Items with supplied PNGs use single-frame profiles; no behavior is inferred from their names. */ function () {
        const definition = catalog(item.value), count = Number(quantity.value);
        if (!Number.isSafeInteger(count) || count < 1 || count > 1000000) throw Error("Quantity must be a whole number from 1 to 1,000,000.");
        const event = root.FrontierEvents.create("item-" + crypto.randomUUID(), Number(x.value), Number(y.value));
        event.name = definition.name;
        event.height = Number(size.value);
        event.range = 1.8;
        event.spriteProfile = definition.properties?.sprite ? "item-asset:" + definition.id : definition.spriteProfile;
        event.extensions = { itemPickup: { item: definition.id, quantity: count } };
        event.pages[0].graphic = "chest";
        event.pages[0].solid = false;
        event.pages[0].trigger = pickup.value === "touch" ? "playerTouch" : "interact";
        event.pages[0].commands = [{ type:"giveItem", item:definition.id, amount:count }, { type:"selfSwitch", key:"A", value:true }];
        const empty = root.FrontierEvents.page("Collected");
        empty.graphic = "none";
        empty.solid = false;
        empty.condition = { type:"selfSwitch", key:"A" };
        empty.commands = [];
        event.pages.push(empty);
        if (api.mutate(/* @function hubWorkbench.appendPlacedItem1525 — Inputs: none. Returns nothing; appends the new event inside the host's validated Undo transaction. */ function () { api.world().events.push(event); }) === false)
          throw Error("Placement rejected. Check position and size.");
      });
    }

    /* @function hub-workbench.placeTemplate — Inputs: terrain point. Offers saved definitions and opens an independent instance draft at point. Keeps source definitions and test maps unchanged. */

    function placeTemplate(point) {
      const entries = api.templates().entries,
        d = dialog("Place reusable template"),
        choice = field(
          d,
          "Template",
          "select",
          entries[0]?.id,
          entries.map(
            /* @function hub-workbench.templateOption — Inputs: definition. Returns readable label and ID; no effects. */ (
              e,
            ) => [e.name, e.id],
          ),
        );
      finish(
        d,
        /* @function hub-workbench.applyTemplate — Inputs: none. Instantiates selected definition with a new identity at terrain XY and opens draft. Throws empty/missing template selection. */ () => {
          if (!choice.value)
            throw Error("Save a reusable definition from an event first.");
          api.editor().beginEvent(
            api.templateBank().instantiate(choice.value, {
              id: "event-" + crypto.randomUUID(),
              x: point.x,
              y: point.y,
            }),
            true,
          );
        },
      );
    }

    /* @function hubWorkbench.dropPoint1525 — Inputs: item ID. Returns valid XYZ static placement or throws readable error before inventory changes. First person raycasts the actual crosshair through shared room/model/terrain surfaces, requires upward support within 3 metres and full item headroom. Other views retain feet placement. Metres, Z up; no physics or authored mutation. */
    function dropPoint1525(id) {
      const game = api.game(), p = game.player;
      if (!game.camera.firstPerson) return { x:p.x, y:p.y, z:p.z || 0 };
      const ray = root.FrontierModelTargeting.ray(game, (game.viewWidth || 640)/2, 96),
        surface = root.FrontierPropEditor.surface(ray, game);
      if (!surface || surface.distance > 3 || surface.normal[2] < 0.5)
        throw Error("Aim at an upward floor, table or shelf within 3 metres.");
      const [x,y,z] = surface.point, height = carriedProperties1525(id).worldHeight || 0.35;
      if (!Number.isFinite(x+y+z) || root.FrontierRoomPhysics.blocked(api.world(), x, y, z+0.005, 0.08, height))
        throw Error("There is not enough space to place this item here.");
      return { x,y,z:z+0.005 };
    }
    /* @function hubWorkbench.carriedProperties1525 — Inputs: carried item ID. Returns existing instance properties or catalog fallback, read-only. First matching compact stack is the same one consumed by static dropping, preserving its size and light. No cloning/allocation during ordinary frames. */
    function carriedProperties1525(id) {
      const carried = api.state().carried.find(
        /* @function hubWorkbench.carriedPropertyMatch1525 — Inputs: carried stack. Returns matching stable item-ID. */
        function (stack) { return stack.itemId === id; });
      return carried?.properties || catalog(id).properties || {};
    }

    /* @function hubWorkbench.previewDrop1525 — Inputs: carried item ID. Returns nothing; creates a transient draw-only item ghost at the validated crosshair surface. Inventory quantity, lights and persistent drops stay unchanged until Confirm. Errors leave the previous preview intact. */
    function previewDrop1525(id) {
      const point = dropPoint1525(id), definition = catalog(id);
      api.game().itemDropPreview = { id:"item-placement-preview", itemId:id, ...point,
        name:"Placement preview", kind:definition.graphic || "chest", solid:false,
        height:carriedProperties1525(id).worldHeight || 0.35, radius:0.08,
        spriteProfile:definition.properties?.sprite ? "item-asset:"+id : definition.spriteProfile };
    }

    /* @function hub-workbench.dropItem — Inputs: ID and quantity default one. Returns new placed stack, or throws before inventory change. October 14: first person uses validated crosshair surface placement; other views retain static feet placement. No rigid-body simulation or throwing. */

    function dropItem(id, quantity = 1) {
      if (quantity !== 1)
        throw Error("Static placement currently drops one item at a time.");
      const inventory = api.session().state.inventory,
        count = inventory.get(id) || 0;
      if (count < quantity) throw Error("No item available to drop.");
      const point = dropPoint1525(id),
        definition = catalog(id),
        store = api.state(),
        cell = root.FrontierHubState.cell(store, api.map());
      if (cell.drops.length >= 2000) throw Error("Cell drop capacity reached.");
      const stack = root.FrontierHubState.consume(store, inventory, id, {
          owner: { kind: "player" },
          properties: definition.properties || {},
          questProtected: definition.questProtected,
        }),
        record = root.FrontierHubState.drop(store, api.map(), stack, point);
      // October 22: dropping the last copy releases an equipped pickup weapon;
      // a second owned definition for the same profile keeps it available.
      if(definition.properties?.weaponProfile===api.game().player.weapon.id&&!root.FrontierItems.some(/* @function hubWorkbench.otherOwnedWeapon — Inputs: catalog definition. Returns whether another remaining owned stack equips this same profile. Reads authoritative quantities after consume. */function(item){return item.properties?.weaponProfile===definition.properties.weaponProfile&&(inventory.get(item.id)||0)>0;}))root.PhanicomABS.equip(api.game(),'handgun');
      dropSignature = "";
      api.game().itemDropPreview = null;
      // Publish the confirmed static item immediately, even while inventory
      // pauses simulation. Zero time cannot advance cleanup or light timers.
      tick(0);
      api.log("Placed " + definition.name + ".");
      return record;
    }

    /* @function hub-workbench.inventory — Inputs: inventory list. Appends clearly labeled drop-one buttons for event items. Built-in weapons/ammo retain combat ownership until item unification; no unsupported weapon dropping button is shown. */

    // October 14: selection is menu state, independent of saved quantities.
    let selectedInventoryItem1525 = "";
    /* @function hubWorkbench.inventorySelectable1525 — Inputs: inventory list element. Returns nothing; creates keyboard-focusable stack selections, descriptions, Drop and supported authored HP-use actions from live session quantities. Selection persists within this workbench; unsupported item effects are not invented. Caller rebuilds only when inventory or actor state changes. */
    function inventory(list) {
      for (const [id, count] of api.session().state.inventory) {
        if (count < 1 || id === "ammo9") continue;
        const row = document.createElement("li");
        const definition = catalog(id);
        const choose = button(row, definition.name + " × " + count,
          /* @function hubWorkbench.selectInventory1525 — Inputs: click ignored. Returns nothing; selects an actual inventory stack and reveals its description/actions. Does not use or remove the item. Native buttons retain keyboard activation and focus. */ function () {
            selectedInventoryItem1525 = id;
            for (const other of list.querySelectorAll("[data-item-details]")) other.hidden = other.dataset.itemDetails !== id;
            for (const option of list.querySelectorAll("[data-inventory-item]")) option.setAttribute("aria-pressed", String(option.dataset.inventoryItem === id));
          });
        choose.dataset.inventoryItem = id;
        choose.setAttribute("aria-pressed", String(id === selectedInventoryItem1525));
        const details = document.createElement("div");
        details.dataset.itemDetails = id;
        details.hidden = id !== selectedInventoryItem1525;
        const description = document.createElement("p");
        description.textContent = definition.properties?.description || definition.description || "No description authored for this item.";
        details.append(description);
        button(
          details,
          "Drop one",
          /* @function hub-workbench.inventoryDrop — Inputs: click unused. Commits one static drop; outer button catches failure. */ () =>
            api.game().camera.firstPerson ? previewDrop1525(id) : dropItem(id),
        );
        if (api.game().itemDropPreview?.itemId === id) {
          button(details, "Confirm placement", /* @function hubWorkbench.confirmDrop1525 — Inputs: click ignored. Returns committed stack through revalidated current crosshair surface. Failure retains inventory and preview for correction. */ function () { return dropItem(id); });
          button(details, "Cancel placement", /* @function hubWorkbench.cancelDrop1525 — Inputs: click ignored. Returns nothing; discards transient ghost without changing carried or world items. */ function () { api.game().itemDropPreview = null; });
        }
        const weaponProfile=definition.properties?.weaponProfile;
        if (weaponProfile && root.PhanicomABS.weapons.has(weaponProfile)) button(details,"Equip",/* @function hubWorkbench.equipPickup1526 — Inputs: ignored click. Returns nothing; equips an owned catalog weapon using shared ammo pools and retains the weapon item for later switching/dropping. Empty inventory or unknown profile cannot equip. */function(){if((api.session().state.inventory.get(id)||0)<1)return;root.PhanicomABS.equip(api.game(),weaponProfile);api.game().player.holstered=false;api.log("Equipped "+definition.name);});
        const healing = definition.properties?.restoreHp;
        if (Number.isFinite(healing) && healing > 0) button(details, "Use",
          /* @function hubWorkbench.useHealingItem1525 — Inputs: click ignored. Returns nothing; restores authored positive HP up to maximum and consumes exactly one carried item after confirming recovery is possible. Full health/dead players retain the item and receive feedback. Item quantity and actor health use existing save ownership. */ function () {
            const player = api.game().player, state = api.session().state.inventory,
              maximum = Number.isFinite(player.maxHp) ? player.maxHp : 100;
            // The legacy player has a 100-HP baseline without a maxHp field;
            // NPC maxHp metadata cannot be substituted into player healing.
            if (player.hp <= 0 || player.hp >= maximum) { api.log("This item cannot restore health right now."); return; }
            const quantity = state.get(id) || 0;
            if (!quantity) return;
            player.hp = Math.min(maximum, player.hp + healing);
            if (quantity === 1) state.delete(id); else state.set(id, quantity - 1);
            api.log("Used " + definition.name + ".");
          });
        row.append(details);
        list.append(row);
      }
    }

    /* @function hub-workbench.tick — Inputs: unpaused elapsed seconds. Processes budgeted cleanup once per second and refreshes active-cell render references only on change. No cleanup during authoring/pause; no distant runtime entities retained. */

    function tick(dt) {
      const { store, cell } = current();
      if (store !== lastStore) {
        lastStore = store;
        dropSignature = "";
        cleanupElapsed = 0;
        nextCleanup = 0;
      }
      nextCleanup -= dt;
      cleanupElapsed += dt;
      if (nextCleanup <= 0) {
        // October 13: resolve only budgeted saved-cell policies. A periodic
        // full project snapshot copied inactive worlds and embedded models.
        root.FrontierHubState.tick(
          store,
          Math.min(60, cleanupElapsed),
          api.cellPolicy,
        );
        cleanupElapsed = 0;
        nextCleanup = 1;
      }
      const signature =
        api.map() +
        ":" +
        cell.drops.length +
        ":" +
        store.nextId +
        ":" +
        cell.drops[0]?.id;
      // October 13: session/catalog adoption can change item names or visuals
      // without changing compact drop IDs. Reference comparison adds no frame
      // allocation and rebuilds only active drop entities when definitions change.
      if (
        signature !== dropSignature ||
        cachedItemDefinitions !== root.FrontierItems
      ) {
        cachedDrops = cell.drops.map(
          /* @function hub-workbench.dropEntity — Inputs: compact drop. Returns active render/pick reference using shared item graphic/model. Never allocates textures or creates collision/timers. */ (
            d,
          ) => {
            const def = catalog(d.itemId);
            return {
              id: d.id,
              dropId: d.id,
              x: d.x,
              y: d.y,
              z: d.z,
              name: def.name,
              itemLight: d.properties?.light || def.properties?.light,
              kind: def.graphic || "chest",
              height: d.properties?.worldHeight || def.properties?.worldHeight || 0.35,
              radius: 0.12,
              solid: false,
              range: 1.8,
              spriteProfile: def.properties?.sprite ? "item-asset:" + def.id : def.spriteProfile,
              modelId: def.modelId,
              spatial: def.modelId
                ? {
                    visual: "model",
                    rotation: [0, 0, 0],
                    scale: [0.2, 0.2, 0.2],
                    drawDistance: { mode: "default", distance: 52 },
                    collisionBoxes: [],
                    interactionZones: [],
                  }
                : undefined,
              modelTransform: def.modelId
                ? { scale: [0.2, 0.2, 0.2] }
                : undefined,
            };
          },
        );
        dropSignature = signature;
        cachedItemDefinitions = root.FrontierItems;
      }
      api.game().hubDrops = cachedDrops;
    }

    /* @function hub-workbench.storageDialog — Inputs: event and validated hub metadata. Opens paused stock/trade panel with prices. Container takes/deposits, merchant buys/sells and pawn shop recovers compact stacks. Mutations remain synchronous; full inventory/recovery never discards records silently. */

    function storageDialog(event, hub) {
      api.pause(true);
      const { store, cell } = current();
      if (!Object.hasOwn(cell.storage, event.id))
        cell.storage[event.id] = structuredClone(hub.stock);
      const stacks =
          hub.kind === "pawnshop" ? store.recovery : cell.storage[event.id],
        d = dialog(
          event.name,
          /* @function hub-workbench.resumeStorage — Inputs: none. Releases menu pause; no stock changes. */ () =>
            api.pause(false),
        );
      const ownership = document.createElement("p");
      ownership.textContent =
        "Ownership: " +
        hub.owner.kind +
        (hub.owner.id ? " — " + hub.owner.id : "") +
        ". Theft consequences are not implemented.";
      d.append(ownership);
      const list = document.createElement("div");
      d.append(list);

      /* @function hub-workbench.refreshStorage — Inputs: none. Rebuilds panel after committed operation. Shows quantities, prices and current gold; returns nothing. No per-frame rebuild. */

      function refresh() {
        list.replaceChildren();
        const state = api.session().state,
          info = document.createElement("p");
        info.textContent = "Gold: " + (state.gold || 0);
        list.append(info);
        for (let i = 0; i < stacks.length; i++) {
          const stack = stacks[i],
            def = catalog(stack.itemId),
            row = document.createElement("p"),
            price = hub.kind === "container" ? 0 : def.price || 1;
          row.textContent =
            def.name + " × " + stack.quantity + " — " + price + " gold";
          button(
            row,
            hub.kind === "container"
              ? "Take one"
              : hub.kind === "pawnshop"
                ? "Recover one"
                : "Buy one",
            /* @function hub-workbench.takeStock — Inputs: none. Debits price and transfers one stack unit to event inventory; depleted stock removed. Throws before mutation for insufficient funds. */ () => {
              if ((state.gold || 0) < price) throw Error("Not enough gold.");
              root.FrontierHubState.carry(store, state.inventory, {
                ...stack,
                quantity: 1,
                ...(hub.kind === "merchant"
                  ? { owner: { kind: "player" } }
                  : {}),
              });
              state.gold = (state.gold || 0) - price;
              stack.quantity--;
              if (!stack.quantity) stacks.splice(i, 1);
              refresh();
            },
          );
          list.append(row);
        }
        if (hub.kind !== "pawnshop")
          for (const [id, count] of state.inventory) {
            if (count < 1 || id === "ammo9") continue;
            const def = catalog(id),
              row = document.createElement("p");
            row.textContent = def.name + " (carried " + count + ")";
            button(
              row,
              hub.kind === "container" ? "Store one" : "Sell one",
              /* @function hub-workbench.depositStock — Inputs: none. Transfers one carried item to this container/shop after capacity check. Merchant credits catalog sale value; properties extensibility remains in stock records. */ () => {
                if (stacks.length >= 2000) throw Error("Storage is full.");
                stacks.push(
                  root.FrontierHubState.consume(store, state.inventory, id, {
                    owner: { kind: "player" },
                    properties: def.properties || {},
                  }),
                );
                if (hub.kind === "merchant")
                  state.gold =
                    (state.gold || 0) +
                    Math.max(1, Math.floor((def.price || 1) / 2));
                refresh();
              },
            );
            list.append(row);
          }
      }

      refresh();
      button(
        d.footer,
        "Close",
        /* @function hub-workbench.closeStorage — Inputs: none. Closes panel and resumes through close handler; no implicit transaction. */ () =>
          d.close(),
      );
      d.append(d.notice, d.footer);
      d.showModal();
    }

    /* @function hub-workbench.interact — Inputs: reachable engine hit. Returns true if this service handled drop/door/storage; otherwise false so event commands run normally. Door travel validates arrival through existing transfer owner. */

    function interact(hit) {
      if (hit.target?.dropId) {
        const store = api.state(),
          cell = root.FrontierHubState.cell(store, api.map()),
          stack = cell.drops.find(
            /* @function hub-workbench.pickupRecord — Inputs: compact drop. Returns ID match; no mutation. */ (
              d,
            ) => d.id === hit.target.dropId,
          );
        if (stack) {
          const inv = api.session().state.inventory;
          root.FrontierHubState.carry(store, inv, stack);
          root.FrontierHubState.pickup(store, api.map(), hit.target.dropId);
          dropSignature = "";
          api.log("Picked up " + catalog(stack.itemId).name + ".");
        }
        return true;
      }
      const raw = hit.event?.extensions?.hub;
      if (!raw) return false;
      const hub = validateEvent(raw);
      if (hub.kind === "door") {
        api.travel(hub);
        return true;
      }
      storageDialog(hit.event, hub);
      return true;
    }

    /* @function hub-workbench.diagnostics — Inputs: none. Opens on-demand counts and encoded/decoded texture estimates. Lists visited cells without loading assets; no expensive per-frame serialization. */

    function diagnostics() {
      const d = dialog("Cell diagnostics"),
        store = api.state(),
        game = api.game(),
        rows = document.createElement("pre");
      let text =
        "Active cell: " +
        api.map() +
        "\nLoaded objects: " +
        (game.maps.frontier.entities.length + (game.sceneEvents?.length || 0)) +
        "\nActive static drops: " +
        current().cell.drops.length +
        "\nPawn-shop records: " +
        store.recovery.length +
        " / " +
        store.recoveryLimit +
        "\nUnpaused cleanup clock: " +
        Math.floor(store.clock) +
        " seconds\n";
      let bytes = 0;
      for (const model of root.FrontierModelLibrary.list())
        bytes += model.bytes;
      text +=
        "Shared model encoded resources: " +
        (bytes / 1048576).toFixed(2) +
        " MiB\nDecoded model texture estimate: " +
        (root.FrontierModelRenderer.memoryBytes() / 1048576).toFixed(2) +
        " MiB (CPU RGBA; excludes GPU copies and sprite textures)\n";
      for (const [id, c] of Object.entries(store.cells))
        text +=
          id +
          ": " +
          c.drops.length +
          " drops, " +
          Object.keys(c.storage).length +
          " stores\n";
      const effects = root.FrontierNativeEffects?.diagnostics(api.world());
      if (effects)
        text +=
          "Native effect particles: " +
          effects.particles +
          " / " +
          effects.budget +
          "\nRoom material decoded pixels: " +
          ((root.FrontierRoomSurfaces?.memoryBytes() || 0) / 1048576).toFixed(
            2,
          ) +
          " MiB\n";
      const sky = root.FrontierSkyPanorama?.diagnostics(
        root.FrontierPixi?.current(),
      );
      if (sky)
        text +=
          "Sky decoded images: " +
          sky.decoded +
          " / 4; source RGBA: " +
          (sky.sourceBytes / 1048576).toFixed(2) +
          " MiB; active renderer GPU RGBA estimate: " +
          (sky.gpuBytes / 1048576).toFixed(2) +
          " MiB (excludes encoded strings/driver overhead)\n";
      const camera = game.modelCameraDebug;
      if (camera)
        text +=
          "Camera clearance: " +
          camera.clearance.toFixed(3) +
          " metres; correction steps: " +
          (camera.separationIterations || 0) +
          "; unresolved: " +
          !!camera.separationUnresolved +
          "; prior-safe fallback: " +
          !!camera.usedPriorSafe +
          "\n";
      rows.textContent = text;
      d.append(rows);
      button(
        d.footer,
        "Close",
        /* @function hub-workbench.closeDiagnostics — Inputs: none. Removes diagnostics without changing state. */ () =>
          d.close(),
      );
      d.append(d.footer);
      d.showModal();
    }

    return {
      cellSettings,
      doorSettings,
      storageSettings,
      placeTemplate,
      placeItem,
      dropItem,
      inventory,
      tick,
      interact,
      diagnostics,
    };
  }

  root.FrontierHubWorkbench = { validateEvent, create };
})(typeof window === "undefined" ? globalThis : window);
