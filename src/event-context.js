/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function event-context.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event context. */
(/* @function event-context.bootstrapReviewed — Installs authored-event context-menu services. Inputs: browser root namespace. Returns nothing; publishes install/open/close API while owner callbacks retain mutation/validation/Undo. Menu construction/listeners begin on install; ordinary runtime exports omit this module. Dependency/DOM errors propagate and registration does not create an event or second simulation. */ function (
  root,
) {
  "use strict";
  let api, menu;
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-context.close.2 — Handles close within event context. Inputs: no explicit arguments; uses enclosing module state. Updates: menu hidden. */
  /* @function event-context.reviewedclose_2 — Hides the installed editor event context menu. Inputs: none. Returns undefined; changes menu.hidden when menu exists, otherwise no-op. Does not discard event drafts or change selection. */ function close() {
    if (menu) menu.hidden = true;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-context.install.3 — Handles install within event context. Inputs: value. Updates: api; menu; menu id; menu hidden. Uses: document create element; menu set attribute; document body append; document add event listener. */
  /* @function event-context.reviewedinstall_3 — Installs the event-menu host once during editor bootstrap. Inputs: owner API with editing/world/editor/view and optional hub services. Returns undefined; stores API, appends hidden role menu and adds document pointer/key listeners. No teardown or duplicate-install guard; call once to avoid duplicate menus/listeners. DOM errors propagate; no event data mutation. */ function install(
    value,
  ) {
    api = value;
    menu = document.createElement("div");
    menu.id = "eventContextMenu";
    menu.setAttribute("role", "menu");
    menu.hidden = true;
    document.body.append(menu);
    document.addEventListener(
      "pointerdown",
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-context.callback.4 — Provides the callback for document add event listener. Inputs: e. Uses: menu contains; close. */
  /* @function event-context.reviewedcallback_4 — Dismisses event menu on pointer presses outside menu and view. Inputs: DOM pointer event e. Returns undefined; may hide menu. Clicks in view remain available for placement/context handling; expects installed API/menu. */ (
        e,
      ) => {
        if (!menu.contains(e.target) && e.target !== api.view) close();
      },
    );
    document.addEventListener(
      "keydown",
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-context.callback.5 — Provides the callback for document add event listener. Inputs: e. Uses: close. */
  /* @function event-context.reviewedcallback_5 — Dismisses the event context menu with Escape. Inputs: DOM key event e. Returns undefined; hides menu only for Escape, does not prevent default or manage pause/fullscreen. */ (
        e,
      ) => {
        if (e.key === "Escape") close();
      },
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-context.open.6 — Handles open within event context. Inputs: object pattern. Updates: menu style left; menu style top; menu hidden. Uses: api editing; menu replace children; api world using events find; api world. Returns: without a result. */
  /* @function event-context.reviewedopen_6 — Builds and shows the clicked-event editor menu. Inputs: clientX/clientY in CSS viewport pixels, optional world-XY point in metres and eventId. Returns undefined; no-ops outside editing, replaces menu buttons, clamps position to viewport and focuses first enabled action. Uses owner callbacks for drafts/Undo rather than committing directly; invalid DOM/owner APIs throw. Create-event action is disabled outside inset map bounds. */ function open({
    clientX,
    clientY,
    point,
    eventId,
  }) {
    if (!api?.editing()) return;
    menu.replaceChildren();
    /* Historical contract retained; October 14 reviewed explanation follows. @function event-context.action.7 — Handles action within event context. Inputs: label; fn; assignment pattern. Updates: button text content; button disabled; button onclick. Uses: document create element; button set attribute; menu append. */
  /* @function event-context.reviewedaction_7 — Adds one semantic menu action to the currently opened context menu. Inputs: visible label, callback fn and disabled flag. Returns undefined; creates/appends button and click listener. Does not execute fn until click; DOM errors propagate. */ function action(
      label,
      fn,
      disabled = false,
    ) {
      const button = document.createElement("button");
      button.textContent = label;
      button.setAttribute("role", "menuitem");
      button.disabled = disabled;
      button.onclick =
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-context.onclick.8 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: close; fn. */
  /* @function event-context.reviewedonclick_8 — Runs a selected menu action after dismissing menu. Inputs: none; captures owner callback fn. Returns undefined; closes menu then calls fn, whose draft/mutation/error semantics remain owner-managed. A failing action leaves menu closed. */ () => {
          close();
          fn();
        };
      menu.append(button);
    }
    const e = api
      .world()
      .events.find(
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-context.callback.9 — Returns e id equals event id. Inputs: e. Returns: e id equals event id. */
  /* @function event-context.reviewedcallback_9 — Matches the clicked authored event. Inputs: e and captured eventId. Returns ID equality; no mutation. First matching event is used by open. */ (
          e,
        ) => e.id === eventId,
      );
    if (e) {
      if (api.hub) {
        action(
          "Configure door / transfer",
          /* @function event-context.configureDoor — Inputs: none. Opens existing event's private door draft; no commit until Apply. */ () =>
            api.hub.doorSettings({ x: e.x, y: e.y }, e),
        );
        action(
          "Configure container / merchant",
          /* @function event-context.configureStorage — Inputs: none. Opens existing event's storage draft; preserves pages. */ () =>
            api.hub.storageSettings({ x: e.x, y: e.y }, e),
        );
      }
      action(
        "Edit event",
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-context.callback.10 — Provides the callback for action. Inputs: no explicit arguments; uses enclosing module state. Uses: api editor using choose; api editor; api editor using open event. */
  /* @function event-context.reviewedcallback_10 — Opens the chosen authored event in its editor. Inputs: none; captures e and owner API. Returns undefined; sets event selection then opens draft dialog. Does not commit fields; owner errors propagate. */ () => {
          api.editor().choose(e.id);
          api.editor().openEvent();
        },
      );
      action(
        "Duplicate event",
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-context.callback.11 — Returns api editor using duplicate event using e id. Inputs: no explicit arguments; uses enclosing module state. Uses: api editor using duplicate event; api editor. Returns: api editor using duplicate event using e id. */
  /* @function event-context.reviewedcallback_11 — Requests detached duplication of selected event. Inputs: none; captures e.id. Returns owner duplicateEvent result; owner controls new ID, validation and Undo. Errors propagate; menu already closed. */ () =>
          api.editor().duplicateEvent(e.id),
      );
      action(
        "Delete event",
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-context.callback.12 — Returns api editor using delete event using e id. Inputs: no explicit arguments; uses enclosing module state. Uses: api editor using delete event; api editor. Returns: api editor using delete event using e id. */
  /* @function event-context.reviewedcallback_12 — Requests removal of selected authored event. Inputs: none; captures e.id. Returns owner deleteEvent result; owner records Undo and refresh. Errors propagate; menu already closed. */ () =>
          api.editor().deleteEvent(e.id),
      );
    }
    action(
      "Create event here",
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-context.callback.13 — Provides the callback for action. Inputs: no explicit arguments; uses enclosing module state. Updates: event elevation; event height; event height offset; event movement mode. Uses: frontier events create; crypto random uuid; api editor using begin event; api editor. */
  /* @function event-context.reviewedcallback_13 — Begins a new grounded event draft at the clicked point. Inputs: none; captures validated point/world owner. Returns undefined; allocates UUID and event with zero elevation/offset, 1.65-metre height and grounded mode, then opens beginEvent as new. Does not commit until editor Apply; disabled action prevents invalid point invocation and creation/owner errors propagate. */ () => {
        const event = FrontierEvents.create(
          "event-" + crypto.randomUUID(),
          point.x,
          point.y,
        );
        event.elevation = 0;
        event.height = 1.65;
        event.heightOffset = 0;
        event.movementMode = "grounded";
        api.editor().beginEvent(event, true);
      },
      !point ||
        point.x < 1 ||
        point.y < 1 ||
        point.x > (api.world().width ?? api.world().size) - 1 ||
        point.y > (api.world().height ?? api.world().size) - 1,
    );
    if (api.hub && point) {
      action(
        "Create Door here",
        /* @function event-context.newDoor — Inputs: none. Opens invisible doorway authoring at clicked terrain XY. */ () =>
          api.hub.doorSettings(point),
      );
      action(
        "Create container / merchant here",
        /* @function event-context.newStorage — Inputs: none. Opens storage definition at terrain point. */ () =>
          api.hub.storageSettings(point),
      );
      action(
        "Place reusable template here",
        /* @function event-context.newTemplate — Inputs: none. Opens bank picker for independent event instance. */ () =>
          api.hub.placeTemplate(point),
      );
    }
    menu.style.left = Math.max(0, Math.min(clientX, innerWidth - 230)) + "px";
    menu.style.top = Math.max(0, Math.min(clientY, innerHeight - 180)) + "px";
    menu.hidden = false;
    menu.querySelector("button:not(:disabled)")?.focus();
  }
  /* @function eventContext.visibleDoor — Inputs: none. Returns nothing; opens validated door draft at current cell spawn, with editable placement coordinates. Requires installed editing host; does nothing in playtest/runtime. No authored mutation until ordinary event Apply. */
  function placeDoor() {
    if (!api?.editing() || !api.hub) return;
    const point = api.world().spawn;
    api.hub.doorSettings({ x: point.x, y: point.y });
  }
  /* @function eventContext.placeItem1525 — Inputs: none. Returns nothing; opens item placement at editor location only when authoring and the owning hub are available. No immediate map mutation. */
  function placeItem1525() {
    if (api?.editing() && api.hub) api.hub.placeItem();
  }
  root.FrontierEventContext = { install, open, close, placeDoor, placeItem: placeItem1525 };
})(window);
