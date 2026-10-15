/* A private page-behavior draft; Cancel never edits the event. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function behavior-dialog.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier behavior dialog. */
(/* @function behavior-dialog.installReviewed — Installs the authored page-behavior dialog service. Dialog edits belong to a private draft; Cancel must not mutate the authored event or runtime actor. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function behavior-dialog.open.2 — Handles open within behavior dialog. Inputs: value; accept. Updates: d id; d class name; d inner html; l text content; mode value. Uses: structured clone; frontier actor behavior defaults; document create element; mode append. */
  /* @function behavior-dialog.open.2Reviewed — Opens a modal editor for an independent page-behavior draft. Inputs: optional authored profile and synchronous acceptance callback. Returns nothing; clones the profile/defaults, creates accessible controls, appends the dialog and focuses mode selection. Cancel or native dismissal removes the dialog without acceptance. Only validated submission invokes accept; callback errors display in the dialog, and external callback mutations are not rolled back. Clone/DOM/showModal failures propagate. Coordinates are absolute horizontal world units; speeds are world units per second. */ function open(
    value,
    accept,
  ) {
    const v = structuredClone(value || FrontierActorBehavior.defaults()),
      d = document.createElement("dialog");
    d.id = "actorBehaviorDialog";
    d.className = "mzDialog";
    d.innerHTML =
      "<h2>Wander, patrol and sentinel</h2><p>This page behavior overrides Autonomous Movement. Waypoints use absolute map coordinates. Pursuit returns to the starting position after exceeding a chase or home limit. Obstacle avoidance stops at collisions; pathfinding is not provided.</p>";
    const fields = {};
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function behavior-dialog.field.3 — Handles field within behavior dialog. Inputs: key; label; assignment pattern. Updates: l text content; input type; input step; input checked; input value. Uses: document create element; l append; d append. */
  /* @function behavior-dialog.field.3Reviewed — Creates one labeled draft input and records it for submission. Inputs: profile key, readable label and input type, default number. Returns nothing; initializes checkbox state or numeric value from the private draft, uses a 0.1 numeric step and appends to the modal. Does not edit the event; DOM errors propagate. */ function field(
      key,
      label,
      type = "number",
    ) {
      const l = document.createElement("label");
      l.textContent = label;
      const input = document.createElement("input");
      input.type = type;
      input.step = ".1";
      if (type === "checkbox") input.checked = v[key];
      else input.value = v[key];
      l.append(input);
      d.append(l);
      fields[key] = input;
    }
    const l = document.createElement("label");
    l.textContent = "Idle behavior";
    const mode = document.createElement("select");
    for (const k of ["sentinel", "wander", "patrol"])
      mode.append(new Option(k[0].toUpperCase() + k.slice(1), k));
    mode.setAttribute("aria-label", "Idle behavior");
    mode.value = v.mode;
    l.append(mode);
    d.append(l);
    field("approach", "Approach player when detected", "checkbox");
    for (const [k, label] of [
      ["speed", "Speed (world units/second)"],
      ["detectRange", "Detection distance"],
      ["chaseRange", "Maximum target distance"],
      ["homeRange", "Maximum distance from home"],
      ["stopRange", "Stop near target"],
      ["wanderRadius", "Wander radius"],
    ])
      field(k, label);
    const pointsLabel = document.createElement("label");
    pointsLabel.textContent = "Patrol waypoints — one X, Y pair per line";
    const points = document.createElement("textarea");
    points.rows = 5;
    points.value = v.points
      .map(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function behavior-dialog.callback.4 — Returns p x plus ", " plus p y. Inputs: p. Returns: p x plus ", " plus p y. */
  /* @function behavior-dialog.callback.4Reviewed — Formats a patrol waypoint for the editable text area. Inputs: point with absolute map x/y world coordinates. Returns comma-separated X, Y text; joining supplies line boundaries. No data mutation or coordinate conversion. */ (
          p,
        ) => p.x + ", " + p.y,
      )
      .join("\n");
    pointsLabel.append(points);
    d.append(pointsLabel);
    const error = document.createElement("p");
    error.setAttribute("role", "status");
    d.append(error);
    const footer = document.createElement("footer");
    for (const [label, action] of [
      [
        "Cancel",
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function behavior-dialog.callback.5 — Returns d close using . Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using . */
  /* @function behavior-dialog.callback.5Reviewed — Cancels this behavior draft. Inputs: none, captured modal. Returns the native close result and triggers close cleanup; never invokes accept or updates the authored event. */ () =>
          d.close(),
      ],
      [
        "Use this behavior",
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function behavior-dialog.callback.6 — Provides the callback for the enclosing behavior dialog operation. Inputs: no explicit arguments; uses enclosing module state. Updates: next at k; error text content. Uses: points value trim; points value trim using split using /\n/ map; points value trim using split; object entries. */
  /* @function behavior-dialog.callback.6Reviewed — Submits the behavior controls through profile validation. Inputs: none, captured draft/controls and accept callback. Returns nothing; builds a new profile, parses waypoint rows and numeric/checkbox values, validates, invokes accept synchronously and closes on success. Parsing, validation or acceptance errors remain visible in the open dialog. Does not itself record Undo or undo external changes made by a throwing acceptance callback. */ () => {
          try {
            const next = {
              ...v,
              mode: mode.value,
              points: points.value.trim()
                ? points.value
                    .trim()
                    .split(/\n/)
                    .map(
                      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function behavior-dialog.callback.7 — Provides the callback for points value trim using split using /\n/ map. Inputs: line. Uses: line split; error; number. Returns: a record containing x, y. */
  /* @function behavior-dialog.callback.7Reviewed — Parses one patrol waypoint row. Inputs: text line containing exactly two comma-separated components. Returns numeric x/y in absolute map world units, including any invalid Number results for the subsequent validator to reject. Throws for wrong component count; does not mutate the draft. */ (
                        line,
                      ) => {
                        const parts = line.split(",");
                        if (parts.length !== 2)
                          throw Error("Each waypoint needs X, Y.");
                        return { x: Number(parts[0]), y: Number(parts[1]) };
                      },
                    )
                : [],
            };
            for (const [k, input] of Object.entries(fields))
              next[k] =
                input.type === "checkbox" ? input.checked : Number(input.value);
            accept(FrontierActorBehavior.validate(next));
            d.close();
          } catch (e) {
            error.textContent = e.message;
          }
        },
      ],
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.onclick = action;
      footer.append(button);
    }
    d.append(footer);
    d.addEventListener(
      "close",
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function behavior-dialog.callback.8 — Returns d remove using . Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using . */
  /* @function behavior-dialog.callback.8Reviewed — Removes the modal DOM after any close path. Inputs: none, captured dialog. Returns native remove result; does not invoke acceptance or modify the authored event. No retained UI element after normal cleanup. */ () =>
        d.remove(),
    );
    document.body.append(d);
    d.showModal();
    mode.focus();
  }
  root.FrontierBehaviorDialog = { open };
})(window);
