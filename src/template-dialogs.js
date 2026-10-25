/* Engine-specific dialogs stay outside the three native MZ command tabs.
 * Saving a definition is an explicit project-bank action; it does not Apply the
 * event draft. Replace Event returns a draft command to the event editor. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function template-dialogs.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier template dialogs. */
(/* @function template-dialogs.installReviewed — Installs engine-specific reusable-definition dialogs outside native MZ command tabs. Saving a definition changes the project bank without applying the open event draft; replacement commands remain editor-owned drafts. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function template-dialogs.dialog.2 — Handles dialog within template dialogs. Inputs: title. Updates: d class name; d id; h text content. Uses: document create element; d set attribute; d append; document body append. Returns: d. */
  /* @function template-dialogs.dialog.2Reviewed — Creates an appended reusable-definition modal shell. Inputs: readable title. Returns dialog element with heading/accessibility label and close cleanup; does not show it yet. Mutates DOM only, not project data; DOM failures propagate. Caller populates controls before buttons opens it. */ function dialog(
    title,
  ) {
    const d = document.createElement("dialog");
    d.className = "mzDialog";
    d.id = "eventTemplateDialog";
    d.setAttribute("aria-label", title);
    const h = document.createElement("h2");
    h.textContent = title;
    d.append(h);
    document.body.append(d);
    d.addEventListener(
      "close",
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function template-dialogs.callback.3 — Returns d remove using . Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using . */
  /* @function template-dialogs.callback.3Reviewed — Removes the definition dialog after any close path. Inputs: none, captured dialog. Returns native remove result; does not save a template or accept a command. */ () =>
        d.remove(),
    );
    return d;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function template-dialogs.field.4 — Handles field within template dialogs. Inputs: d; label; input. Updates: l text content. Uses: document create element; input set attribute; l append; d append. Returns: input. */
  /* @function template-dialogs.field.4Reviewed — Adds one labeled accessible control to a definition modal. Inputs: dialog, label and input node. Returns same input after wrapping/appending it and setting aria-label. No authored data mutation; DOM errors propagate. */ function field(
    d,
    label,
    input,
  ) {
    const l = document.createElement("label");
    l.textContent = label;
    input.setAttribute("aria-label", label);
    l.append(input);
    d.append(l);
    return input;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function template-dialogs.buttons.5 — Handles buttons within template dialogs. Inputs: d; accept. Updates: b type; b text content; b onclick. Uses: document create element; notice set attribute; footer append; d append. */
  /* @function template-dialogs.buttons.5Reviewed — Adds OK/Cancel controls and opens the populated modal. Inputs: dialog and synchronous acceptance callback. Returns nothing; creates status text, handlers and showModal. Cancel never invokes acceptance; OK invokes it and closes only on normal return. DOM/showModal errors propagate; callback errors are handled by the click handler. */ function buttons(
    d,
    accept,
  ) {
    const notice = document.createElement("p");
    notice.setAttribute("role", "status");
    const footer = document.createElement("footer");
    for (const name of ["OK", "Cancel"]) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = name;
      b.onclick =
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function template-dialogs.onclick.6 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: notice text content. Uses: d close; accept. Returns: without a result. */
  /* @function template-dialogs.onclick.6Reviewed — Handles the captured OK or Cancel button. Inputs: none. Returns nothing; Cancel closes immediately. OK calls accept synchronously and closes, or displays thrown error.message while remaining open. Does not roll back external callback changes and does not await asynchronous callbacks; callers use synchronous acceptance. */ () => {
          if (name === "Cancel") {
            d.close();
            return;
          }
          try {
            accept();
            d.close();
          } catch (error) {
            notice.textContent = error.message;
          }
        };
      footer.append(b);
    }
    d.append(notice, footer);
    d.showModal();
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function template-dialogs.save.7 — Handles save within template dialogs. Inputs: event; api; done. Updates: name max length; name value; note text content. Uses: dialog; field; document create element; d append. */
  /* @function template-dialogs.save.7Reviewed — Opens Save reusable event definition for the supplied event draft. Inputs: event, project-bank API with saveTemplate(name,event), and optional done(result). Returns nothing; initializes editable name and opens modal. Only confirmed acceptance saves a new definition; does not Apply the open event draft. Host API owns validation, bank mutation, Undo/persistence and failure behavior; DOM failures propagate. */ function save(
    event,
    api,
    done,
  ) {
    const d = dialog("Save reusable event definition"),
      name = field(d, "Definition name", document.createElement("input"));
    name.maxLength = 80;
    name.value = event.name;
    const note = document.createElement("p");
    note.textContent =
      "Saves a new independent definition in the project. This does not Apply the event draft. Existing definitions are retained.";
    d.append(note);
    buttons(
      d,
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function template-dialogs.callback.8 — Provides the callback for buttons. Inputs: no explicit arguments; uses enclosing module state. Uses: api save template; done. */
  /* @function template-dialogs.callback.8Reviewed — Saves the confirmed independent reusable definition through the host API. Inputs: none, captured name/event/API. Returns nothing; calls saveTemplate then optional done with its result. Exceptions reach modal status; a later done failure does not undo an already saved definition. Does not Apply event draft. */ () => {
        const result = api.saveTemplate(name.value, event);
        done?.(result);
      },
    );
    name.focus();
    name.select();
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function template-dialogs.replace.9 — Handles replace within template dialogs. Inputs: initial; context; done. Updates: target value; templates value; policy value; note text content. Uses: dialog; field; document create element; target append. */
  /* @function template-dialogs.replace.9Reviewed — Opens a private Replace Event command editor. Inputs: optional existing command, context event list/template bank and required synchronous done(command). Returns nothing; populates target, versioned template and reset/preserve self-switch controls. Confirmation builds validated draft command; no event replacement happens here. Runtime later owns identity/position retention and command/movement cancellation. DOM/setup errors propagate. */ function replace(
    initial,
    context,
    done,
  ) {
    const d = dialog("Replace Event"),
      target = field(d, "Target event", document.createElement("select"));
    target.append(new Option("This Event", "this"));
    for (const e of context.events || [])
      target.append(new Option(e.name + " (" + e.id + ")", e.id));
    target.value = initial?.target || "this";
    const templates = field(
        d,
        "Reusable definition",
        document.createElement("select"),
      ),
      entries = context.templates?.entries || [];
    for (const e of entries)
      templates.append(new Option(e.name + " — version " + e.version, e.id));
    templates.value = initial?.template || entries[0]?.id || "";
    const policy = field(
      d,
      "Self-switch state",
      document.createElement("select"),
    );
    policy.append(
      new Option("Reset", "reset"),
      new Option("Preserve", "preserve"),
    );
    policy.value = initial?.statePolicy || "reset";
    const note = document.createElement("p");
    note.textContent =
      "Retains event identity and current position. Cancels its old commands and movement. New behavior starts next frame. Save a reusable definition first if the list is empty.";
    d.append(note);
    buttons(
      d,
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function template-dialogs.callback.10 — Provides the callback for buttons. Inputs: no explicit arguments; uses enclosing module state. Uses: entries find; error; structured clone; root frontier event runtime validate. */
  /* @function template-dialogs.callback.10Reviewed — Builds the confirmed replacement command from selected definition. Inputs: none, captured controls/entries/initial/done. Returns nothing; rejects missing definition, clones existing command metadata, sets selected target/template/version/state policy, validates through runtime registry and calls done. Does not replace live event or mutate template bank; errors display in modal, without rollback of external done effects. */ () => {
        const entry = entries.find(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function template-dialogs.callback.11 — Returns e id equals templates value. Inputs: e. Returns: e id equals templates value. */
  /* @function template-dialogs.callback.11Reviewed — Finds the selected reusable definition by stable ID. Inputs: bank entry. Returns exact equality with template picker value, without mutation; missing match is rejected by enclosing acceptance. */ (
            e,
          ) => e.id === templates.value,
        );
        if (!entry) throw Error("Choose an existing reusable definition.");
        const command = {
          ...structuredClone(initial || {}),
          type: "replaceEvent",
          target: target.value,
          template: entry.id,
          version: entry.version,
          statePolicy: policy.value,
        };
        root.FrontierEventRuntime.validate(command);
        done(command);
      },
    );
  }
  root.FrontierTemplateDialogs = { save, replace };
})(window);
