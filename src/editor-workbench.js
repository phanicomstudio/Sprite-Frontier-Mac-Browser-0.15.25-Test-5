/* Dedicated event workbench. Reuses validated editor forms; it never mutates
 * runtime events. Clipboard/template changes go through the undo transaction.
 * Debug snapshots are sampled only while visible, outside the gameplay loop. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor-workbench.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier workbench. */
(/* @function editor-workbench.installReviewed — Installs the authored-event workbench, clipboard/template transactions and visible-only diagnostics. It reuses validated forms and does not modify active combat event copies. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: object pattern. Updates: dialog id; dialog inner html; advanced inner html; $ using "eventPage" closest using "label" hidden; options inner html. Uses: document create element; document body append; $; $ using "eventProperties" append. Returns: a record containing open, resetSelection, advanceSelection, selectedIndex. */
  /* @function editorWorkbench.reviewedcreate_2 — Builds authored-event modal workbench once. Inputs: api owner and selected/refresh/choose/page/setPage callbacks. Returns open and command-selection operations. Creates dialog/return button, moves existing inspector/command controls, installs listeners/MutationObserver and loads legacy local template list. Clipboard/placement edits call owner mutation/Undo; runtime test ownership is host-controlled. Requires existing DOM/services; setup errors propagate, no teardown/duplicate-install guard. */ function create({
    api,
    selected,
    refresh,
    choose,
    page,
    setPage,
  }) {
    const $ =
        /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.$.3 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id. */
  /* @function editorWorkbench.reviewedlookup_3 — Finds installed workbench control by DOM ID. Inputs: id. Returns element or null; no mutation, callers assume required controls exist. */ (
          id,
        ) => document.getElementById(id),
      dialog = document.createElement("dialog");
    dialog.id = "eventWorkbench";
    dialog.innerHTML =
      '<header><h2>Event editor</h2><button id="closeEventWindow">Close</button></header><nav id="eventTabs" aria-label="Event pages"></nav><div class="eventToolbar"><button id="clipboardPage">Copy page to clipboard</button><button id="pastePage">Paste page</button><button id="clearCommandSelection">Append at end</button><button id="copyCommand">Copy command</button><button id="pasteCommand">Paste command before selection</button><button id="testEvent">Test this event</button><button id="saveEventTemplate">Save template</button><select id="eventTemplates"><option value="">Choose template</option></select><button id="placeEventTemplate">Place template</button></div><p id="eventEditorStatus" role="status">Changes apply when you press their Apply/Save/Add button. Close does not apply unfinished fields.</p><div class="eventColumns"><section id="eventProperties"></section><section id="eventCommands"><h3>Contents</h3></section></div><details><summary>Event debugger</summary><pre id="eventDebugger"></pre></details>';
    document.body.append(dialog);
    const inspector = $("eventInspector");
    $("eventProperties").append(inspector);
    // Keep page conditions/appearance above advanced plugin/topic data, as in
    // MZ's page-oriented inspector. Advanced text remains an optional escape hatch.
    const advanced = document.createElement("details");
    advanced.innerHTML = "<summary>Advanced NPC topics and combat</summary>";
    for (const id of ["eventTopics", "eventSprite", "eventCombat"])
      advanced.append($(id).closest("label"));
    inspector.append(advanced);
    $("eventPage").closest("label").hidden = true;
    const options = document.createElement("fieldset");
    options.innerHTML =
      '<legend>Movement and priority</legend><label>Autonomous movement<select id="pageMovement"><option value="stationary">Stationary</option><option value="random">Random walk</option><option value="approach">Approach player</option></select></label><label><input id="pageThrough" type="checkbox"> Through (ignore blocking)</label>';
    $("pageSolid").closest("label").after(options);
    for (const id of [
      "commandList",
      "commandType",
      "commandFields",
      "addCommand",
    ]) {
      const el = $(id);
      $("eventCommands").append(
        id === "commandType" ? el.closest("label") : el,
      );
    }
    const returnButton = document.createElement("button");
    returnButton.id = "returnEventTest";
    returnButton.textContent = "Return to event editor";
    returnButton.hidden = true;
    document.body.append(returnButton);
    let pageClipboard = null,
      commandClipboard = null,
      commandSelection = -1,
      timer = null;
    /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.tabs.4 — Handles tabs within editor workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: b text content; b onclick. Uses: selected; $ using "eventTabs" replace children; $; chain or a list of entries. */
  /* @function editorWorkbench.reviewedtabs_4 — Rebuilds page tab controls from selected authored event. Inputs: none. Returns undefined; replaces tab buttons, displays1-based numbers/name and current pressed state. No authored mutation; missing selection yields empty list. */ function tabs() {
      const e = selected();
      $("eventTabs").replaceChildren();
      for (const [i, p] of (e?.pages || []).entries()) {
        const b = document.createElement("button");
        b.textContent = i + 1 + " · " + p.name;
        b.setAttribute("aria-pressed", String(i === page()));
        b.onclick =
          /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.onclick.5 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: set page; tabs. */
  /* @function editorWorkbench.reviewedonclick_5 — Selects clicked authored page. Inputs: unused click; captures index i. Returns undefined; calls owner setPage then rebuilds tabs. Does not execute commands; owner/DOM errors propagate. */ () => {
            setPage(i);
            tabs();
          };
        $("eventTabs").append(b);
      }
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.debug.6 — Handles debug within editor workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "eventDebugger" text content. Uses: $; api runtime; json stringify. Returns: without a result. */
  /* @function editorWorkbench.revieweddebug_6 — Samples runtime diagnostic only when modal/debug details open. Inputs: none. Returns undefined; reads api.runtime and writes formatted JSON text. No runtime mutation; JSON/owner errors propagate. Closed panels do no snapshot work. */ function debug() {
      if (!dialog.open || !$("eventDebugger").parentElement.open) return;
      const d = api.runtime();
      $("eventDebugger").textContent = JSON.stringify(d, null, 2);
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.open.7 — Handles open within editor workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: inspector hidden; timer. Uses: selected; refresh; tabs; dialog show modal. Returns: without a result. */
  /* @function editorWorkbench.reviewedopen_7 — Opens workbench for selected event. Inputs: none. Returns undefined; no-op absent pages, refreshes controls/tabs, shows modal, samples debug and starts250-millisecond diagnostic interval. Replaces prior interval. Does not commit unfinished drafts; modal/owner errors propagate. */ function open() {
      if (!selected()?.pages) return;
      refresh();
      inspector.hidden = false;
      tabs();
      if (!dialog.open) dialog.showModal();
      debug();
      clearInterval(timer);
      timer = setInterval(debug, 250);
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.close.8 — Handles close within editor workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: timer. Uses: dialog close; clear interval. */
  /* @function editorWorkbench.reviewedclose_8 — Closes workbench and stops diagnostic interval. Inputs: none. Returns undefined; dialog close then timer clear/null. Unfinished fields not applied; no authored mutation. */ function close() {
      dialog.close();
      clearInterval(timer);
      timer = null;
    }
    $("openEventEditor").onclick = open;
    $("closeEventWindow").onclick = close;
    dialog.addEventListener(
      "close",
      /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.callback.9 — Provides the callback for dialog add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: timer. Uses: clear interval. */
  /* @function editorWorkbench.reviewedcallback_9 — Stops diagnostics when dialog closes by any path. Inputs: ignored close event. Returns undefined; clears timer/null only, no source mutation. */ () => {
        clearInterval(timer);
        timer = null;
      },
    );
    new MutationObserver(tabs).observe($("eventPage"), { childList: true });
    $("commandList").addEventListener(
      "click",
      /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.callback.10 — Provides the callback for $ using "commandList" add event listener. Inputs: event. Updates: command selection. Uses: event target closest; a list of spread element index of; $; row class list toggle. Returns: without a result. */
  /* @function editorWorkbench.reviewedcallback_10 — Selects command row for clipboard/insertion. Inputs: click event. Returns undefined; no-op outside list item, stores child index and toggles selection class. Selection is UI-local; does not modify commands. */ (
        event,
      ) => {
        const li = event.target.closest("li");
        if (!li) return;
        commandSelection = [...$("commandList").children].indexOf(li);
        for (const row of $("commandList").children)
          row.classList.toggle("commandSelected", row === li);
      },
    );
    $("clipboardPage").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.onclick.11 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: page clipboard. Uses: structured clone; selected; page. */
  /* @function editorWorkbench.reviewedonclick_11 — Copies current authored page into session clipboard. Inputs: ignored click. Returns undefined; structured-clones selected page, no system clipboard or runtime state. Clone failures propagate; absent page leaves undefined clipboard. */ () => {
        pageClipboard = structuredClone(selected()?.pages[page()]);
      };
    $("pastePage").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.onclick.12 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "eventEditorStatus" text content. Uses: selected; structured clone; candidate pages splice; page. Returns: without a result; without a result. */
  /* @function editorWorkbench.reviewedonclick_12 — Requests validated page paste after current page. Inputs: ignored click. Returns undefined; no-op missing clipboard/event, validates cloned candidate first and reports rejection in status, then commits through api.mutate. Owner handles Undo/refresh; original clipboard detached. */ () => {
        const e = selected();
        if (!pageClipboard || !e?.pages) return;
        const candidate = structuredClone(e);
        candidate.pages.splice(page() + 1, 0, structuredClone(pageClipboard));
        try {
          FrontierEvents.validate([candidate]);
        } catch (error) {
          $("eventEditorStatus").textContent = error.message;
          return;
        }
        api.mutate(
          /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.callback.13 — Returns e pages splice using page using plus 1, 0, structured clone using page clipboard. Inputs: no explicit arguments; uses enclosing module state. Uses: e pages splice; page; structured clone. Returns: e pages splice using page using plus 1, 0, structured clone using page clipboard. */
  /* @function editorWorkbench.reviewedcallback_13 — Inserts detached copied page inside owner transaction. Inputs: none. Returns splice removed-items array(empty); mutates selected authored pages at current page+1. Outer preflight validated candidate; owner handles Undo/rollback. */ () =>
            e.pages.splice(page() + 1, 0, structuredClone(pageClipboard)),
          /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.callback.14 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Uses: set page; page; tabs. */
  /* @function editorWorkbench.reviewedcallback_14 — Selects pasted page after successful owner mutation. Inputs: none. Returns undefined; increments current page selection and refreshes tabs. No event data mutation. */ () => {
            setPage(page() + 1);
            tabs();
          },
        );
      };
    /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.resetSelection.15 — Handles reset selection within editor workbench. Inputs: no explicit arguments; uses enclosing module state. Updates: command selection. Uses: $; row class list remove. */
  /* @function editorWorkbench.reviewedresetSelection_15 — Clears command insertion selection. Inputs: ignored click when listener. Returns undefined; sets index-1 (append) and removes row highlights. No clipboard/source mutation. */ function resetSelection() {
      commandSelection = -1;
      for (const row of $("commandList").children)
        row.classList.remove("commandSelected");
    }
    $("clearCommandSelection").onclick = resetSelection;
    $("copyCommand").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.onclick.16 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "eventEditorStatus" text content; command clipboard. Uses: selected; page; a list of "else", "end" includes; $. Returns: without a result; without a result. */
  /* @function editorWorkbench.reviewedonclick_16 — Copies one command or complete branch block locally. Inputs: ignored click. Returns undefined; missing selection no-op, Else/End standalone rejected with status. Branch scan includes nested commands through matching End; cloned slice becomes clipboard. Assumes validated balanced commands; does not copy runtime execution cursor. */ () => {
        const commands = selected()?.pages[page()]?.commands,
          c = commands?.[commandSelection];
        if (!c) return;
        if (["else", "end"].includes(c.type)) {
          $("eventEditorStatus").textContent =
            "Copy the conditional branch to include its Else/End markers.";
          return;
        }
        let end = commandSelection;
        if (c.type === "branch") {
          let depth = 0;
          for (; end < commands.length; end++) {
            if (commands[end].type === "branch") depth++;
            if (commands[end].type === "end" && !--depth) break;
          }
        }
        commandClipboard = structuredClone(
          commands.slice(commandSelection, end + 1),
        );
      };
    $("pasteCommand").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.onclick.17 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: selected; page; api mutate. Returns: without a result. */
  /* @function editorWorkbench.reviewedonclick_17 — Requests clipboard command paste. Inputs: ignored click. Returns undefined; no-op absent clipboard/page, otherwise owner mutation inserts before selected index or appends. Validation/Undo belongs to owner; no direct preflight here. */ () => {
        const p = selected()?.pages[page()];
        if (!commandClipboard || !p) return;
        api.mutate(
          /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.callback.18 — Returns p commands splice using command selection is less than 0 selects p commands length or command selection, 0, spread element. Inputs: no explicit arguments; uses enclosing module state. Uses: p commands splice; structured clone. Returns: p commands splice using command selection is less than 0 selects p commands length or command selection, 0, spread element. */
  /* @function editorWorkbench.reviewedcallback_18 — Inserts detached command clipboard in owner transaction. Inputs: none. Returns empty splice result; mutates page.commands with cloned records at selected/appended position. Owner validates structure/rollback. */ () =>
            p.commands.splice(
              commandSelection < 0 ? p.commands.length : commandSelection,
              0,
              ...structuredClone(commandClipboard),
            ),
          refresh,
        );
      };
    $("testEvent").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.onclick.19 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: return button hidden. Uses: selected; close; api test event. */
  /* @function editorWorkbench.reviewedonclick_19 — Starts isolated test of chosen event. Inputs: ignored click. Returns undefined; captures event ID, closes modal, shows return button and asks api.testEvent. Host owns snapshot/runtime isolation; failure after UI change propagates. */ () => {
        const id = selected().id;
        close();
        returnButton.hidden = false;
        api.testEvent(id);
      };
    returnButton.onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.onclick.20 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: return button hidden; $ using "eventDebugger" text content. Uses: api runtime; api return editor; open; $. */
  /* @function editorWorkbench.reviewedonclick_20 — Returns event test to authoring and displays last diagnostics. Inputs: ignored click. Returns undefined; hides return button, samples runtime, asks host returnEditor, opens modal and writes last snapshot. No direct world restore here; host errors propagate. */ () => {
        returnButton.hidden = true;
        const last = api.runtime();
        api.returnEditor();
        open();
        $("eventDebugger").textContent =
          "Last playtest:\n" + JSON.stringify(last, null, 2);
      };
    // Templates contain authored data only, never playtest switches or damage.
    let templates = [];
    try {
      templates = JSON.parse(
        localStorage.getItem("frontier-event-templates-0.15.21") || "[]",
      );
      if (!Array.isArray(templates)) templates = [];
    } catch {}
    /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.templateList.21 — Handles template list within editor workbench. Inputs: no explicit arguments; uses enclosing module state. Uses: $ using "eventTemplates" replace children; $; templates map. */
  /* @function editorWorkbench.reviewedtemplateList_21 — Refreshes legacy local event-template dropdown. Inputs: none. Returns undefined; builds options from session templates using array indices, not project template-bank IDs. No source mutation; invalid stored entries/DOM may throw. */ function templateList() {
      $("eventTemplates").replaceChildren(
        new Option("Choose template", ""),
        ...templates.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.callback.22 — Returns a new option. Inputs: e; i. Uses: string. Returns: a new option. */
  /* @function editorWorkbench.reviewedcallback_22 — Creates legacy template choice option. Inputs: event e/index i. Returns Option(name,String(i)); no authored mutation. */ (
            e,
            i,
          ) => new Option(e.name, String(i)),
        ),
      );
    }
    $("saveEventTemplate").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.onclick.23 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "eventEditorStatus" text content; templates at prior. Uses: selected; templates find index; $; structured clone. Returns: without a result; without a result. */
  /* @function editorWorkbench.reviewedonclick_23 — Saves selected authored event to legacy local clipboard-template list. Inputs: ignored click. Returns undefined; replaces same-name entry or appends up to50, cloning authored event. Attempts localStorage and reports persistent/session-only outcome, then refreshes options. Not the project versioned template bank and not Undo transaction itself; retains session entry on storage failure. */ () => {
        const e = selected();
        if (!e?.pages) return;
        const prior = templates.findIndex(
          /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.callback.24 — Returns t name equals e name. Inputs: t. Returns: t name equals e name. */
  /* @function editorWorkbench.reviewedcallback_24 — Finds same-name legacy template for replacement. Inputs: t and captured e. Returns name equality; no mutation. */ (
            t,
          ) => t.name === e.name,
        );
        if (prior < 0 && templates.length >= 50) {
          $("eventEditorStatus").textContent =
            "Template library is full (50). Export your maps to keep authored events.";
          return;
        }
        if (prior >= 0) templates[prior] = structuredClone(e);
        else templates.push(structuredClone(e));
        try {
          localStorage.setItem(
            "frontier-event-templates-0.15.21",
            JSON.stringify(templates),
          );
          $("eventEditorStatus").textContent =
            "Template saved on this computer. Export maps for a portable backup.";
        } catch {
          $("eventEditorStatus").textContent =
            "Template ready for this session. Local saving unavailable; export maps to keep your events.";
        }
        templateList();
      };
    $("placeEventTemplate").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.onclick.25 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: e id; e x. Uses: $; structured clone; number; crypto random uuid. Returns: without a result; without a result. */
  /* @function editorWorkbench.reviewedonclick_25 — Places legacy local template copy through owner transaction. Inputs: ignored click. Returns undefined; clones selected template, assigns UUID, shifts X one metre clamped to map inset, retains Y/other authored values, then requests validated mutation and selection/open callback. Missing selection no-op; clone/owner errors propagate. */ () => {
        if ($("eventTemplates").value === "") return;
        const e = structuredClone(templates[Number($("eventTemplates").value)]);
        if (!e) return;
        e.id = "template-" + crypto.randomUUID();
        e.x = Math.max(
          1,
          Math.min((api.world().width ?? api.world().size) - 1, e.x + 1),
        );
        api.mutate(
          /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.callback.26 — Returns api world using events push using e. Inputs: no explicit arguments; uses enclosing module state. Uses: api world using events push; api world. Returns: api world using events push using e. */
  /* @function editorWorkbench.reviewedcallback_26 — Appends template event inside owner mutation. Inputs: none; captures detached e. Returns new event count; mutates authored event array only. Owner handles validation/Undo/rollback. */ () =>
            api.world().events.push(e),
          /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.callback.27 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Uses: choose; open. */
  /* @function editorWorkbench.reviewedcallback_27 — Selects/opens successfully placed template copy. Inputs: none. Returns undefined; calls choose(e.id) then open. No direct source mutation. */ () => {
            choose(e.id);
            open();
          },
        );
      };
    templateList();
    return {
      open,
      resetSelection,
      /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.advanceSelection.28 — Handles advance selection within editor workbench. Inputs: count. Updates: command selection. Uses: a list of spread element entries; $; row class list toggle. */
  /* @function editorWorkbench.reviewedadvanceSelection_28 — Moves command-selection index after list edit. Inputs: count integer offset from owner. Returns undefined; adjusts only nonnegative selected index and updates row highlights. Does not clamp index or modify commands; owner supplies correct shift. */ advanceSelection(
        count,
      ) {
        if (commandSelection >= 0) commandSelection += count;
        for (const [i, row] of [...$("commandList").children].entries())
          row.classList.toggle("commandSelected", i === commandSelection);
      },
      selectedIndex:
        /* Historical contract retained; October 14 reviewed explanation follows. @function editor-workbench.selectedIndex.29 — Returns command selection. Inputs: no explicit arguments; uses enclosing module state. Returns: command selection. */
  /* @function editorWorkbench.reviewedselectedIndex_29 — Reads local command insertion selection. Inputs: none. Returns integer index or-1 for append. No mutation or runtime cursor access. */ () =>
          commandSelection,
    };
  }
  root.FrontierWorkbench = { create };
})(window);
