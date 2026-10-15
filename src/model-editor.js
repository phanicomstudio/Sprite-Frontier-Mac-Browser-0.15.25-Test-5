/* Independent spatial draft dialog. Closing or Cancel never modifies the
 * event. Apply validates then passes a clone to the owning event draft. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model editor. */
(/* @function model-editor.installReviewed — Installs independent authored spatial-model draft dialogs. Apply validates/clones into the owning event draft; closing or Cancel does not change live/authored events. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  const el =
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.el.2 — Handles el within model editor. Inputs: tag; text. Updates: e text content. Uses: document create element. Returns: e. */
  /* @function model-editor.el.2Reviewed — Creates a DOM element with optional safe text content. Inputs: tag and optional text. Returns new unattached element; no project mutation. DOM failures propagate. */ (
      tag,
      text,
    ) => {
      const e = document.createElement(tag);
      if (text) e.textContent = text;
      return e;
    };
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.button.3 — Handles button within model editor. Inputs: text; fn. Updates: b type; b onclick. Uses: el. Returns: b. */
  /* @function model-editor.button.3Reviewed — Creates a non-submit action button. Inputs: readable text and click callback. Returns unattached button wired to callback; does not invoke it or edit authored data. */ function button(
    text,
    fn,
  ) {
    const b = el("button", text);
    b.type = "button";
    b.onclick = fn;
    return b;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.open.4 — Handles open within model editor. Inputs: event; events; accept. Updates: d class name; d style css text. Uses: structured clone; el; d set attribute; d append. */
  /* @function model-editor.open.4Reviewed — Opens a private spatial event draft. Inputs: event, available target events and synchronous accept(validatedSpatial). Returns nothing; clones spatial data/defaults and creates model, transform, collision, interaction and draw-distance controls. Apply validates then delegates draft adoption; Cancel/close never accepts. Host owns final event Apply, Undo and persistence. Local coordinates are engine Z-up world units, rotations degrees and scales dimensionless. Clone/DOM failures propagate; acceptance errors remain visible without external rollback. */ function open(
    event,
    events,
    accept,
  ) {
    const value = structuredClone(
        event.spatial || {
          visual: "sprite",
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          collisionBoxes: [],
          interactionZones: [],
        },
      ),
      d = el("dialog");
    d.className = "mzDialog modelEventDialog";
    d.setAttribute("aria-label", "Model and event zones");
    d.style.cssText =
      "width:min(1100px,92vw);max-height:90vh;overflow:auto;font:18px Arial";
    d.append(
      el("h2", "Model, collision and interaction zones"),
      el(
        "p",
        "Zones use local coordinates and follow this event’s rotation and scale. Each interaction zone runs a separately selected event.",
      ),
    );
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.field.5 — Handles field within model editor. Inputs: parent; name; input. Updates: l style css text. Uses: input set attribute; el; l append; parent append. Returns: input. */
  /* @function model-editor.field.5Reviewed — Appends a labeled accessible input. Inputs: parent, name and node. Returns same node after wrapping/appending; mutates only modal DOM. Errors propagate. */ function field(
      parent,
      name,
      input,
    ) {
      input.setAttribute("aria-label", name);
      const l = el("label", name + " ");
      l.style.cssText =
        "display:inline-flex;gap:8px;margin:8px;align-items:center";
      l.append(input);
      parent.append(l);
      return input;
    }
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.select.6 — Handles select within model editor. Inputs: parent; name; items; current; change. Updates: s value; s onchange. Uses: el; s append; field. Returns: field using parent, name, s. */
  /* @function model-editor.select.6Reviewed — Creates a labeled select from trusted ID/label pairs. Inputs: parent, name, items, initial choice and change callback. Returns appended select with value-change handler. Does not validate/apply authored data itself; callback errors propagate. */ function select(
      parent,
      name,
      items,
      current,
      change,
    ) {
      const s = el("select");
      for (const [id, label] of items) s.append(new Option(label, id));
      s.value = current;
      s.onchange =
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.onchange.7 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: change. Returns: change using s value. */
  /* @function model-editor.onchange.7Reviewed — Forwards current choice to the captured private-draft setter. Inputs: none. Returns setter result; no live event mutation by this wrapper. Callback failures propagate. */ () =>
          change(s.value);
      return field(parent, name, s);
    }
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.vector.8 — Transforms a point or direction using the provided matrix. Inputs: parent; name; values. Updates: n type; n step; n value; n style width; n oninput. Uses: el; row append; field; parent append. */
  /* @function model-editor.vector.8Reviewed — Builds three numeric X/Y/Z controls for a private draft array; this is UI authoring, not matrix transformation. Inputs: parent, label and mutable three-component values. Returns nothing; edits supplied draft components with 0.1 input step. Units follow label: local centers/sizes world units, rotation degrees, scale dimensionless. No validation until Apply; DOM errors propagate. */ function vector(
      parent,
      name,
      values,
    ) {
      const row = el("fieldset");
      row.append(el("legend", name));
      for (let axis = 0; axis < 3; axis++) {
        const n = el("input");
        n.type = "number";
        n.step = ".1";
        n.value = values[axis];
        n.style.width = "100px";
        n.oninput =
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.oninput.9 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: values at axis. Uses: number. Returns: assignment. */
  /* @function model-editor.oninput.9Reviewed — Stores one numeric transform component in the private draft. Inputs: none, captured axis/control. Returns assigned Number value, potentially invalid for later validation. No live scene mutation. */ () =>
            (values[axis] = Number(n.value));
        field(row, ["X", "Y", "Z"][axis], n);
      }
      parent.append(row);
    }
    let collisionTouched = false;
    select(
      d,
      "Visual",
      [
        ["sprite", "Sprite"],
        ["model", "3D model"],
        ["none", "Invisible"],
      ],
      value.visual,
      /* @function model-editor.callback.10 — Returns assignment. Inputs: v. Updates: value visual. Returns: assignment. */ /* @function modelEditor.chooseVisual1524 - Inputs: chosen visual kind. Returns: nothing. Supersedes the earlier assignment-only contract: unconfigured model choices select mesh collision automatically, while a collision choice explicitly made in this draft remains intact. Updates private controls and box visibility; the live event changes only on Apply. */ (
        v,
      ) => {
        value.visual = v;
        if (!collisionTouched) {
          value.collisionMode = v === "model" ? "mesh" : "custom";
          collisionControl.value = value.collisionMode;
          for (const section of d.querySelectorAll("[data-collision-boxes]"))
            section.hidden = value.collisionMode !== "custom";
        }
      },
    );
    const models = FrontierModelLibrary.list();
    select(
      d,
      "Shared model",
      [
        ["", "Choose model"],
        ...models.map(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.11 — Returns a list of m id, m name plus " (" plus m triangles plus " tris)". Inputs: m. Returns: a list of m id, m name plus " (" plus m triangles plus " tris)". */
  /* @function model-editor.callback.11Reviewed — Labels one shared model for selection. Inputs: library model ID/name/triangle count. Returns ID/text pair; no decoding, loading or asset mutation. */ (
            m,
          ) => [m.id, m.name + " (" + m.triangles + " tris)"],
        ),
      ],
      value.modelId || "",
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.12 — Returns assignment. Inputs: v. Updates: value model id. Returns: assignment. */
  /* @function model-editor.callback.12Reviewed — Sets selected shared model ID in the private spatial draft. Inputs: picker value. Returns assigned ID; validation on Apply rejects unsupported data. No live event change. */ (
        v,
      ) => (value.modelId = v),
    );
    d.append(
      button(
        "Open 3D Model Library…",
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.13 — Returns frontier model workbench open using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model workbench open. Returns: frontier model workbench open using a callback. */
  /* @function model-editor.callback.13Reviewed — Opens shared model-library workbench for this draft. Inputs: none. Returns workbench open result; nested acceptance updates/reopens the draft. Asset-library changes belong to workbench ownership, distinct from event Apply. */ () =>
          FrontierModelWorkbench.open(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.14 — Provides the callback for frontier model workbench open. Inputs: id. Updates: value visual; value model id. Uses: d close; open. */
  /* @function model-editor.callback.14Reviewed — Adopts workbench-selected model into the private event draft and rebuilds the dialog. Inputs: model ID. Returns nothing; chooses model visual/ID, defaults to mesh collision unless explicitly touched, closes old modal and reopens from draft. Does not call event accept; DOM/open errors propagate. */ (
              id,
            ) => {
              value.visual = "model";
              value.modelId = id;
              if (!collisionTouched) value.collisionMode = "mesh";
              d.close();
              open({ ...event, spatial: value }, events, accept);
            },
          ),
      ),
    );
    const collisionControl = select(
      d,
      "Collision",
      [
        ["none", "None"],
        ["mesh", "Use actual model geometry (static)"],
        ["custom", "Custom boxes"],
      ],
      value.collisionMode || (value.visual === "model" ? "mesh" : "custom"),
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.15 — Provides the callback for select. Inputs: v. Updates: value collision mode; section hidden. Uses: d query selector all. */
  /* @function model-editor.callback.15Reviewed — Stores explicit collision mode in private draft. Inputs: none/mesh/custom picker value. Returns nothing; marks collision touched and hides custom boxes unless custom selected. Preserves explicit choice when visual changes; does not change live collision until Apply. */ (
        v,
      ) => {
        collisionTouched = true;
        value.collisionMode = v;
        for (const section of d.querySelectorAll("[data-collision-boxes]"))
          section.hidden = v !== "custom";
      },
    );
    d.append(
      el(
        "p",
        "Exact geometry preserves model openings. Collision outlines are visible in authoring mode and through the collision debug view. Interaction zones remain separate.",
      ),
    );
    vector(d, "Rotation (degrees)", value.rotation);
    vector(d, "Scale", value.scale);
    d.append(
      button(
        "Reset rotation and scale",
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.16 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: value rotation; value scale. Uses: d close; open. */
  /* @function model-editor.callback.16Reviewed — Resets private model rotation/scale to identity and rebuilds controls. Inputs: none. Returns nothing; sets degrees to zero and scale to one, closes/reopens draft. No event acceptance or project persistence. */ () => {
          value.rotation = [0, 0, 0];
          value.scale = [1, 1, 1];
          d.close();
          open({ ...event, spatial: value }, events, accept);
        },
      ),
    );
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.boxes.17 — Handles boxes within model editor. Inputs: key; title; zones. Updates: section dataset collision boxes; section hidden. Uses: el; section append; button; d append. */
  /* @function model-editor.boxes.17Reviewed — Builds editable collision-box or interaction-zone section. Inputs: draft array key, title and zones boolean. Returns nothing; appends section/list/add controls and renders current draft. Custom collision sections hide for mesh/none; interaction remains independent. Helper callbacks own local edits; validation occurs on Apply. */ function boxes(
      key,
      title,
      zones,
    ) {
      const section = el("section");
      if (!zones) {
        section.dataset.collisionBoxes = "true";
        section.hidden =
          (value.collisionMode ||
            (value.visual === "model" ? "mesh" : "custom")) !== "custom";
      }
      section.append(el("h3", title));
      const list = el("div");
      section.append(list);
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.render.18 — Builds or refreshes the visible representation of this system. Inputs: no explicit arguments; uses enclosing module state. Updates: name value; name oninput; box event id; box transform; box transform position. Uses: list replace children; el; f append; field. */
  /* @function model-editor.render.18Reviewed — Rebuilds box/zone controls from private draft. Inputs: none. Returns nothing; recreates name/local transform/size controls and supplies missing draft transform defaults, zone event target defaults and trigger choices. Coordinates follow event rotation/scale; centers/sizes world units, local rotation degrees. Does not update live event; DOM/default-shape errors propagate. */ function render() {
        list.replaceChildren();
        for (const box of value[key]) {
          const f = el("fieldset");
          f.append(el("legend", box.name || box.id));
          const name = el("input");
          name.value = box.name || box.id;
          name.oninput =
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.oninput.19 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: box name. Returns: assignment. */
  /* @function model-editor.oninput.19Reviewed — Stores edited box name in private draft. Inputs: none, captured box/input. Returns assigned text; no validation or live scene mutation. */ () =>
              (box.name = name.value);
          field(f, "Name", name);
          if (zones) {
            select(
              f,
              "Runs event",
              [
                ...events.filter(
                  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.20 — Returns e id does not equal event id. Inputs: e. Returns: e id does not equal event id. */
  /* @function model-editor.callback.20Reviewed — Filters current event out before appending it once to zone target choices. Inputs: candidate event. Returns ID inequality with source event; no mutation. */ (
                    e,
                  ) => e.id !== event.id,
                ),
                event,
              ].map(
                /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.21 — Returns a list of e id, e name. Inputs: e. Returns: a list of e id, e name. */
  /* @function model-editor.callback.21Reviewed — Builds an interaction target option from event metadata. Inputs: event. Returns ID/name pair without changing event data. */ (
                  e,
                ) => [e.id, e.name],
              ),
              box.eventId || event.id,
              /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.22 — Returns assignment. Inputs: v. Updates: box event id. Returns: assignment. */
  /* @function model-editor.callback.22Reviewed — Assigns zone target event ID in private draft. Inputs: selected ID. Returns assignment; final spatial validation/host binding checks own acceptance. No command execution. */ (
                v,
              ) => (box.eventId = v),
            );
            box.eventId ??= event.id;
            select(
              f,
              "Trigger",
              [
                ["interact", "Interact"],
                ["enter", "Enter volume"],
                ["exit", "Exit volume"],
              ],
              box.trigger || "interact",
              /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.23 — Returns assignment. Inputs: v. Updates: box trigger. Returns: assignment. */
  /* @function model-editor.callback.23Reviewed — Assigns zone trigger kind in private draft. Inputs: interact/enter/exit choice. Returns assignment; does not trigger zone or mutate live state. */ (
                v,
              ) => (box.trigger = v),
            );
          }
          box.transform ??= {};
          box.transform.position ??= [0, 0, 1];
          box.transform.rotation ??= [0, 0, 0];
          box.transform.scale ??= [1, 1, 1];
          vector(f, "Local center", box.transform.position);
          vector(f, "Local rotation (degrees)", box.transform.rotation);
          vector(f, "Box size", box.size);
          f.append(
            button(
              "Edit with handles…",
              /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.24 — Returns frontier model gizmo open using box, value, render. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model gizmo open. Returns: frontier model gizmo open using box, value, render. */
  /* @function model-editor.callback.24Reviewed — Opens handle editing for the captured private box and spatial draft. Inputs: none. Returns gizmo open result; completion rerenders controls. Gizmo owns draft validation/mutation; live event waits for Apply. */ () =>
                FrontierModelGizmo.open(box, value, render),
            ),
          );
          f.append(
            button(
              "Delete box",
              /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.25 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: value at key splice; value at key index of; render. */
  /* @function model-editor.callback.25Reviewed — Deletes captured box from private draft and refreshes controls. Inputs: none. Returns nothing; splices its current index and rerenders. Assumes box remains in array while handler is active; no live collision change or independent Undo. */ () => {
                value[key].splice(value[key].indexOf(box), 1);
                render();
              },
            ),
          );
          list.append(f);
        }
      }
      section.append(
        button(
          "Add " + (zones ? "interaction zone" : "collision box"),
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.26 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: crypto random uuid; value at key push; render. */
  /* @function model-editor.callback.26Reviewed — Adds a fresh default box/zone to private draft. Inputs: none. Returns nothing; generates UUID and appends size 1 by 0.3 by 2 world units, local center 0,0,1 and identity transform. Zones target this event with interact/enabled defaults. Rerenders; crypto/DOM errors propagate. No live event change. */ () => {
            const id = (zones ? "zone-" : "collision-") + crypto.randomUUID();
            value[key].push({
              id,
              name: zones ? "Door zone" : "Collision box",
              size: [1, 0.3, 2],
              transform: {
                position: [0, 0, 1],
                rotation: [0, 0, 0],
                scale: [1, 1, 1],
              },
              ...(zones
                ? { eventId: event.id, trigger: "interact", enabled: true }
                : {}),
            });
            render();
          },
        ),
      );
      d.append(section);
      render();
    }
    // 2026-10-09: draw policy is instance data; it never changes AI scheduling.
    value.drawDistance ??= { mode: "default", distance: 52 };
    select(
      d,
      "Model draw distance",
      [
        ["default", "Use map default"],
        ["custom", "Custom distance"],
        ["unlimited", "Unlimited distance"],
      ],
      value.drawDistance.mode,
      /* @function model-editor.drawMode — Stores a visibility mode in the private draft. Inputs: mode string. Returns: nothing. No live event changes; Apply validates the draft. */ (
        mode,
      ) => {
        value.drawDistance.mode = mode;
        distanceInput.disabled = mode !== "custom";
      },
    );
    const distanceInput = el("input");
    distanceInput.type = "number";
    distanceInput.min = 1;
    distanceInput.max = 10000;
    distanceInput.step = 1;
    distanceInput.value = value.drawDistance.distance;
    distanceInput.disabled = value.drawDistance.mode !== "custom";
    distanceInput.oninput =
      /* @function model-editor.drawDistance — Updates a private distance value in world units. Inputs: DOM input event, ignored. Returns: nothing. Invalid numbers are rejected on Apply; no simulation or collision changes. */ () => {
        value.drawDistance.distance = Number(distanceInput.value);
      };
    field(d, "Custom draw distance (world units)", distanceInput);
    d.append(
      el(
        "p",
        "Large models use their nearest bounds for distance visibility. Unlimited retains offscreen culling. To sink this model, use a negative Elevation offset in the event placement controls; collision and zones follow it.",
      ),
    );
    boxes("collisionBoxes", "Collision boxes", false);
    boxes("interactionZones", "Interaction zones", true);
    const status = el("p"),
      footer = el("footer");
    footer.append(
      button(
        "Apply to event draft",
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.27 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: status text content. Uses: frontier model events validate; accept; d close. */
  /* @function model-editor.callback.27Reviewed — Validates spatial draft and invokes host acceptance. Inputs: none. Returns nothing; passes checked data to synchronous accept and closes on success. Validation/acceptance errors show status and retain dialog; external callback changes are not rolled back here. Host owns eventual event Apply/Undo/save. */ () => {
          try {
            const checked = FrontierModelEvents.validate(value);
            accept(checked);
            d.close();
          } catch (e) {
            status.textContent = e.message;
          }
        },
      ),
      button(
        "Cancel",
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.28 — Returns d close using . Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using . */
  /* @function model-editor.callback.28Reviewed — Cancels this spatial draft without acceptance. Inputs: none. Returns close result; close listener removes modal. Does not revert separate workbench asset-library changes. */ () =>
          d.close(),
      ),
    );
    d.append(status, footer);
    d.addEventListener(
      "close",
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function model-editor.callback.29 — Returns d remove using . Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using . */
  /* @function model-editor.callback.29Reviewed — Removes closed spatial modal from DOM. Inputs: none. Returns remove result; no event acceptance or authored-data mutation. */ () =>
        d.remove(),
    );
    document.body.append(d);
    d.showModal();
  }
  root.FrontierModelEditor = { open };
})(window);
