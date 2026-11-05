/* MZ page-oriented event workbench. Authored state is owned by the app API;
 * every modal works on a cloned draft. Apply commits and keeps editing; OK
 * commits and closes; Cancel discards changes since the last Apply.
 * Command dialogs and the runtime registry are separate extension points. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-editor.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier mzeditor. */
(/* @function mz-editor.installReviewed — Installs page-oriented authored-event workbench services. Modals clone drafts; Apply commits while staying open, OK commits/closes and Cancel discards since last Apply. Runtime command handling remains separate. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  const clone =
      /* @function mz-editor.clone.2 — Returns structured clone using v. Inputs: v. Uses: structured clone. Returns: structured clone using v. */ (
        v,
      ) => structuredClone(v),
    el =
      /* @function mz-editor.el.3 — Handles el within mz editor. Inputs: tag; text. Updates: e text content. Uses: document create element. Returns: e. */ (
        tag,
        text,
      ) => {
        const e = document.createElement(tag);
        if (text !== undefined) e.textContent = text;
        return e;
      };
  const button =
    /* @function mz-editor.button.4 — Handles button within mz editor. Inputs: text; fn. Updates: b type; b onclick. Uses: el. Returns: b. */ (
      text,
      fn,
    ) => {
      const b = el("button", text);
      b.type = "button";
      b.onclick = fn;
      return b;
    };
  // Sprite order belongs to the renderer. Collision is an independent authored option.
  const blankPage =
    /* @function mz-editor.blankPage.5 — Returns a record containing name, graphic, trigger, solid, movement, priority, through, condition. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event schema page defaults. Returns: a record containing name, graphic, trigger, solid, movement, priority, through, condition. */ () => ({
      name: "",
      graphic: "none",
      trigger: "interact",
      solid: false,
      movement: "stationary",
      priority: "normal",
      through: false,
      condition: { type: "always", key: "" },
      conditions: [],
      commands: [],
      mz: FrontierEventSchema.pageDefaults(),
      extensions: {},
    });
  const groupRange =
    /* @function mz-editor.groupRange.6 — Returns frontier mzcommand editing group range using spread element. Inputs: rest element. Uses: frontier mzcommand editing group range. Returns: frontier mzcommand editing group range using spread element. */ (
      ...args
    ) => FrontierMZCommandEditing.groupRange(...args);
  /* @function mz-editor.create.7 — Builds a new instance and its public operations from the supplied configuration. Inputs: object pattern. Updates: d id; d class name; d inner html; row class name; enabled type. Uses: el; d set attribute; document body append; d query selector using ".mzImageMovement fieldset" append. Returns: a record containing begin, open, duplicate, pageIndex, isOpen. */ function create({
    api,
    choose,
    selected,
  }) {
    let draft = null,
      pageIndex = 0,
      pageClipboard = null,
      commandClipboard = [],
      selection = new Set(),
      anchor = 0,
      returnId = "",
      draftHistory = [],
      draftRedo = [];
    const d = el("dialog");
    d.id = "mzEventEditor";
    d.className = "mzDialog mzEventEditor";
    d.setAttribute("aria-label", "Event Editor");
    d.innerHTML =
      '<header><span id="mzEventTitle">Event Editor</span><button id="mzEventClose" aria-label="Close event editor">×</button></header><div class="mzEventHeader"><label>Name:<input id="mzEventName" maxlength="80"></label><label>Note:<input id="mzEventNote" maxlength="10000"></label><div id="mzPageActions"></div></div><nav id="mzPageTabs" aria-label="Event pages"></nav><div class="mzPageBody"><section class="mzPageSettings"><fieldset id="mzConditions"><legend>Conditions</legend></fieldset><div class="mzImageMovement"><fieldset><legend>Image</legend><button id="mzImage" class="mzChecker" aria-label="Select event image">(None)</button></fieldset><fieldset><legend>Autonomous Movement</legend><label>Type:<select id="mzMoveType"><option value="stationary">Fixed</option><option value="random">Random</option><option value="approach">Approach</option><option value="custom">Custom</option></select></label><button id="mzMoveRoute" disabled>Route…</button><label>Speed:<select id="mzMoveSpeed"></select></label><label>Frequency:<select id="mzMoveFrequency"></select></label></fieldset></div><div class="mzOptionsPriority"><fieldset id="mzOptions"><legend>Options</legend></fieldset><div><fieldset><legend>Trigger</legend><select id="mzTrigger"><option value="interact">Action Button</option><option value="playerTouch">Player Touch</option><option value="eventTouch">Event Touch</option><option value="autorun">Autorun</option><option value="parallel">Parallel</option></select></fieldset></div></div></section><fieldset class="mzContents"><legend>Contents</legend><div id="mzCommandList" tabindex="0" role="listbox" aria-label="Event commands" aria-multiselectable="true"></div></fieldset></div><details id="mzEngineSettings"><summary>Sprite Frontier properties and playtest</summary><div id="mzPlacement"></div><button id="mzPlaytest">Apply and playtest event</button></details><p id="mzEventStatus" class="mzStatus"></p><footer><button id="mzEventOK">OK</button><button id="mzEventCancel">Cancel</button><button id="mzEventApply">Apply</button></footer>';
    document.body.append(d);
    const enemyButton=button('Enemy settings / create enemy...', /* @function mzEditor.enemy167 — Inputs: click ignored. Applies current event draft through existing validation before opening its enemy settings; invalid drafts remain here. Existing pages are retained. */ function(){if(!apply())return;d.close();root.FrontierEnemyTools?.open(draft.id);});
    d.querySelector('.mzEventHeader').after(enemyButton);
    const shadowLabel169=document.createElement('label'),shadow169=document.createElement('input');shadow169.type='checkbox';shadow169.id='mzGroundShadow';shadow169.checked=draft?.groundShadow!==false;shadowLabel169.append(shadow169,'Ground shadow (isometric only)');enemyButton.after(shadowLabel169);
    shadow169.onchange=/* @function mzEditor.shadow169 — Inputs: checkbox change ignored. Records the per-event isometric contact setting in existing event draft history; Apply still owns world adoption. */function(){edit(/* @function mzEditor.shadowDraft169 — Inputs: none. Copies only current checkbox state into the isolated event draft. */function(){draft.groundShadow=shadow169.checked;});};
    const paletteButton=button('Palette dither command...',/* @function mzEditor.addPalette168 — Inputs: click ignored. Opens original plugin commands and appends validated record through existing event draft history. */function(){root.FrontierPaletteDither.commandDialog(null,/* @function mzEditor.acceptPalette168 — Inputs: validated command. Appends to active page inside edit transaction without changing authored scene until Apply. */function(command){edit(/* @function mzEditor.paletteDraft168 — Inputs: none. Adds command to current page; edit owns validation/Undo. */function(){draft.pages[pageIndex].commands.push(command);});});});enemyButton.after(paletteButton);
    d.querySelector(".mzImageMovement fieldset").append(
      button(
        "Model, collision and interaction zones…",
        /* @function mz-editor.callback.8 — Returns frontier model editor open using draft, api world using events, a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model editor open; api world. Returns: frontier model editor open using draft, api world using events, a callback. */ () =>
          FrontierModelEditor.open(
            draft,
            api.world().events,
            /* @function mz-editor.callback.9 — Returns edit using a callback. Inputs: checked. Uses: edit. Returns: edit using a callback. */ (
              checked,
            ) =>
              edit(
                /* @function mz-editor.callback.10 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: draft spatial. Returns: assignment. */ () =>
                  (draft.spatial = checked),
              ),
          ),
      ),
    );
    const $ =
        /* @function mz-editor.$.11 — Returns d query selector using "#" plus id. Inputs: id. Uses: d query selector. Returns: d query selector using "#" plus id. */ (
          id,
        ) => d.querySelector("#" + id),
      field =
        /* @function mz-editor.field.12 — Handles field within mz editor. Inputs: parent; text; input. Uses: el; label append; parent append. Returns: input. */ (
          parent,
          text,
          input,
        ) => {
          const label = el("label", text);
          label.append(input);
          parent.append(label);
          return input;
        };
    const speedNames = [
      "1: ×8 Slower",
      "2: ×4 Slower",
      "3: ×2 Slower",
      "4: Normal",
      "5: ×2 Faster",
      "6: ×4 Faster",
    ];
    speedNames.forEach(
      /* @function mz-editor.callback.13 — Returns $ using "mzMoveSpeed" append using a new option. Inputs: name; i. Uses: $ using "mzMoveSpeed" append; $. Returns: $ using "mzMoveSpeed" append using a new option. */ (
        name,
        i,
      ) => $("mzMoveSpeed").append(new Option(name, i + 1)),
    );
    ["1: Lowest", "2: Lower", "3: Normal", "4: Higher", "5: Highest"].forEach(
      /* @function mz-editor.callback.14 — Returns $ using "mzMoveFrequency" append using a new option. Inputs: name; i. Uses: $ using "mzMoveFrequency" append; $. Returns: $ using "mzMoveFrequency" append using a new option. */ (
        name,
        i,
      ) => $("mzMoveFrequency").append(new Option(name, i + 1)),
    );
    const slots = {};
    for (const [key, label, type] of [
      ["switch1", "Switch", "switch"],
      ["switch2", "Switch", "switch"],
      ["variable", "Variable", "variable"],
      ["selfSwitch", "Self Switch", "selfSwitch"],
      ["item", "Item", "item"],
      ["actor", "Actor", "actor"],
    ]) {
      const row = el("div");
      row.className = "mzConditionRow";
      const enabled = el("input");
      enabled.type = "checkbox";
      enabled.id = "mzCondition-" + key;
      const checkLabel = field(row, label, enabled);
      enabled.parentElement.prepend(enabled);
      const input = type === "selfSwitch" ? el("select") : el("input");
      input.id = "mzConditionValue-" + key;
      if (type === "selfSwitch")
        for (const v of ["A", "B", "C", "D"]) input.append(new Option(v, v));
      else input.type = "text";
      row.append(input);
      const value = el("input");
      value.type = "number";
      value.step = "1";
      value.id = "mzConditionThreshold-" + key;
      if (key === "variable") {
        const threshold = el("label", "≥");
        threshold.append(value);
        row.append(threshold);
      }
      slots[key] = { enabled, input, value, type };
      enabled.onchange =
        /* @function mz-editor.onchange.15 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: input disabled; value disabled. */ () => {
          input.disabled = !enabled.checked;
          value.disabled = !enabled.checked;
        };
      $("mzConditions").append(row);
    }
    const options = {};
    for (const [key, label] of [
      ["walkAnime", "Walking"],
      ["stepAnime", "Stepping"],
      ["directionFix", "Direction Fix"],
      ["through", "Through"],
      ["solid", "Blocks movement"],
    ]) {
      const input = el("input");
      input.type = "checkbox";
      input.id = "mzOption-" + key;
      const labelEl = field($("mzOptions"), label, input);
      input.parentElement.prepend(input);
      options[key] = input;
    }
    const placement = {};
    for (const [key, label, defaultValue] of [
      ["x", "Map X", 0],
      ["y", "Map Y", 0],
      ["height", "Visible height", 1.65],
      ["heightOffset", "Elevation offset", 0],
    ]) {
      const input = el("input");
      input.type = "number";
      input.step = ".01";
      input.value = defaultValue;
      input.id = "mzPlacement-" + key;
      placement[key] = field($("mzPlacement"), label, input);
    }
    placement.movementMode = el("select");
    placement.movementMode.append(
      new Option("Follow terrain", "grounded"),
      new Option("Flying: maintain starting altitude", "flying"),
    );
    field($("mzPlacement"), "Height behavior", placement.movementMode);
    $("mzPlacement").append(
      button(
        "Place on terrain (reset elevation)",
        /* @function mz-editor.callback.16 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: placement height offset value; placement movement mode value. */ () => {
          placement.heightOffset.value = 0;
          placement.movementMode.value = "grounded";
        },
      ),
    );
    placement.displayName = field(
      $("mzPlacement"),
      "In-game display name",
      el("input"),
    );
    placement.partyActorId = el("input");
    placement.partyActorId.id = "mzPartyActorLink";
    placement.partyActorId.type = "number";
    placement.partyActorId.min = 1;
    placement.partyActorId.max = 5000;
    placement.partyActorId.step = 1;
    field(
      $("mzPlacement"),
      "Companion actor ID (blank for none)",
      placement.partyActorId,
    );
    const saveDefinition = button(
      "Save reusable definition…",
      /* @function mz-editor.callback.17 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: collect; status; frontier template dialogs save. Returns: without a result. */ () => {
        collect();
        if (!api.saveTemplate) {
          status("Project template bank unavailable.");
          return;
        }
        FrontierTemplateDialogs.save(
          draft,
          api,
          /* @function mz-editor.callback.18 — Returns status using "Saved reusable definition: " plus entry name plus ". Event draft has not been Applied.". Inputs: entry. Uses: status. Returns: status using "Saved reusable definition: " plus entry name plus ". Event draft has not been Applied.". */ (
            entry,
          ) =>
            status(
              "Saved reusable definition: " +
                entry.name +
                ". Event draft has not been Applied.",
            ),
        );
      },
    );
    saveDefinition.id = "mzSaveDefinition";
    mzEngineSettings.append(saveDefinition);
    for (const [label, method] of [
      ["Undo definition save", "undoTemplate"],
      ["Redo definition save", "redoTemplate"],
    ]) {
      const b = button(
        label,
        /* @function mz-editor.callback.19 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: status; api at method. */ () => {
          try {
            status(
              api[method]?.()
                ? "Definition bank updated."
                : "No definition save to " +
                    (method === "undoTemplate" ? "undo." : "redo."),
            );
          } catch (error) {
            status(error.message);
          }
        },
      );
      mzEngineSettings.append(b);
    }
    const replaceDefinition = button(
      "Insert Replace Event…",
      /* @function mz-editor.callback.20 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: collect; frontier template dialogs replace; api world; api templates. */ () => {
        collect();
        const index = Math.min(
          ...selection,
          draft.pages[pageIndex].commands.length,
        );
        FrontierTemplateDialogs.replace(
          null,
          { events: api.world().events, templates: api.templates?.() },
          /* @function mz-editor.callback.21 — Returns edit using a callback. Inputs: command. Uses: edit. Returns: edit using a callback. */ (
            command,
          ) =>
            edit(
              /* @function mz-editor.callback.22 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: command indent. Uses: draft pages at page index commands splice. */ () => {
                command.indent =
                  draft.pages[pageIndex].commands[index]?.indent || 0;
                draft.pages[pageIndex].commands.splice(index, 0, command);
              },
            ),
        );
      },
    );
    replaceDefinition.id = "mzInsertReplaceEvent";
    mzEngineSettings.append(replaceDefinition);
    const budgetNotice = el("p");
    budgetNotice.id = "mzEventBudget";
    $("mzEngineSettings").append(budgetNotice);
    $("mzEngineSettings").append(
      button(
        "Insert screen breathing…",
        /* @function mz-editor.breathingInsert — Inputs: click ignored. Collects event draft then opens native breathing dialog. Accept inserts through event undo; cancel leaves draft unchanged. */ function () {
          collect();
          const index = Math.min(
            ...selection,
            draft.pages[pageIndex].commands.length,
          );
          FrontierBreathingDialog.open(
            null,
            /* @function mz-editor.breathingAccept — Inputs: validated command. Commits command at selected event row through undo. Returns nothing. */ function (
              command,
            ) {
              edit(
                /* @function mz-editor.breathingCommit — Inputs: none. Inserts command using selected row indentation. Returns nothing; mutation stays in event draft until Apply. */ function () {
                  command.indent =
                    draft.pages[pageIndex].commands[index]?.indent || 0;
                  draft.pages[pageIndex].commands.splice(index, 0, command);
                },
              );
            },
          );
        },
      ),
    );
    const gameplayCommand = button(
      "Insert gameplay state change…",
      /* @function mz-editor.callback.23 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: collect; frontier gameplay dialogs open. */ () => {
        collect();
        const index = Math.min(
          ...selection,
          draft.pages[pageIndex].commands.length,
        );
        FrontierGameplayDialogs.open(
          null,
          /* @function mz-editor.callback.24 — Returns edit using a callback. Inputs: command. Uses: edit. Returns: edit using a callback. */ (
            command,
          ) =>
            edit(
              /* @function mz-editor.callback.25 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: command indent. Uses: draft pages at page index commands splice. */ () => {
                command.indent =
                  draft.pages[pageIndex].commands[index]?.indent || 0;
                draft.pages[pageIndex].commands.splice(index, 0, command);
              },
            ),
        );
      },
    );
    const nativeCommand = button(
      "Insert crafting / cipher…",
      /* @function mz-editor.nativeInsert — Inputs: click unused. Opens a native tool draft and inserts accepted command at selected index through event undo. Returns nothing. */ function () {
        collect();
        const index = Math.min(
          ...selection,
          draft.pages[pageIndex].commands.length,
        );
        FrontierNativeToolDialogs.open(
          null,
          /* @function mz-editor.nativeAccept — Inputs: validated tool command. Inserts into event draft through undo; returns edit result. */ function (
            command,
          ) {
            edit(
              /* @function mz-editor.nativeCommit — Inputs: none. Inserts validated command at selected row with current indent. Returns nothing. */ function () {
                command.indent =
                  draft.pages[pageIndex].commands[index]?.indent || 0;
                draft.pages[pageIndex].commands.splice(index, 0, command);
              },
            );
          },
        );
      },
    );
    $("mzEngineSettings").append(nativeCommand);
    gameplayCommand.id = "mzInsertGameplayState";
    $("mzEngineSettings").append(gameplayCommand);
    const extraNotice = el("p");
    extraNotice.id = "mzExtraConditions";
    $("mzConditions").append(extraNotice);
    const advancedPage = button(
      "Extended page conditions…",
      /* @function mz-editor.callback.26 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: collect; frontier event schema extra page conditions; frontier condition editor open; extras map. */ () => {
        collect();
        const extras = FrontierEventSchema.extraPageConditions(
          draft.pages[pageIndex],
        );
        FrontierConditionEditor.open(
          { type: "all", children: extras.map(FrontierConditions.legacy) },
          /* @function mz-editor.callback.27 — Returns edit using a callback. Inputs: expression. Uses: edit. Returns: edit using a callback. */ (
            expression,
          ) =>
            edit(
              /* @function mz-editor.callback.28 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: p condition; p conditions. Uses: object entries using settings using p condition slots filter using a callback map; object entries using settings using p condition slots filter; object entries; settings. */ () => {
                const p = draft.pages[pageIndex],
                  conditions = Object.entries(settings(p).conditionSlots)
                    .filter(
                      /* @function mz-editor.callback.29 — Returns slot enabled. Inputs: array pattern. Returns: slot enabled. */ ([
                        ,
                        slot,
                      ]) => slot.enabled,
                    )
                    .map(
                      /* @function mz-editor.callback.30 — Returns a record containing type, key, copied fields. Inputs: array pattern. Uses: key starts with. Returns: a record containing type, key, copied fields. */ ([
                        key,
                        slot,
                      ]) => ({
                        type: key.startsWith("switch") ? "switch" : key,
                        key: slot.key,
                        ...(key === "variable"
                          ? { value: slot.value }
                          : key === "item"
                            ? { value: 1 }
                            : {}),
                      }),
                    );
                p.condition = conditions.shift() || { type: "always", key: "" };
                p.conditions = [
                  ...conditions,
                  ...(expression.type === "all" && !expression.children.length
                    ? []
                    : [{ type: "expression", expression }]),
                ];
              },
            ),
        );
      },
    );
    advancedPage.id = "mzAdvancedPageConditions";
    $("mzEngineSettings").append(advancedPage);

    const status =
      /* @function mz-editor.status.31 — Returns assignment. Inputs: text. Updates: $ using "mzEventStatus" text content. Uses: $. Returns: assignment. */ (
        text,
      ) => ($("mzEventStatus").textContent = text);
    /* @function mz-editor.settings.32 — Handles settings within mz editor. Inputs: p. Updates: p mz; p mz condition slots at key; p mz image profile. Uses: frontier event schema page defaults. Returns: p mz. */ function settings(
      p,
    ) {
      if (!p.mz) {
        p.mz = FrontierEventSchema.pageDefaults();
        for (const c of [p.condition, ...(p.conditions || [])]) {
          const key =
            c.type === "switch"
              ? p.mz.conditionSlots.switch1.enabled
                ? "switch2"
                : "switch1"
              : c.type;
          if (p.mz.conditionSlots[key])
            p.mz.conditionSlots[key] = {
              enabled: true,
              key: c.key,
              value: c.value ?? 1,
            };
        }
        if (p.graphic !== "none")
          p.mz.image.profile = draft.spriteProfile || p.graphic;
      }
      return p.mz;
    }
    $("mzMoveType").onchange =
      /* @function mz-editor.onchange.33 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "mzMoveRoute" disabled. Uses: $. */ () => {
        $("mzMoveRoute").disabled = $("mzMoveType").value !== "custom";
      };
    $("mzMoveRoute").onclick =
      /* @function mz-editor.onclick.34 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: collect; frontier mzroute dialog open; settings. */ () => {
        collect();
        FrontierMZRouteDialog.open(
          settings(draft.pages[pageIndex]).moveRoute,
          /* @function mz-editor.callback.35 — Returns edit using a callback. Inputs: value. Uses: edit. Returns: edit using a callback. */ (
            value,
          ) =>
            edit(
              /* @function mz-editor.callback.36 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: settings using draft pages at page index move route. Uses: settings. Returns: assignment. */ () =>
                (settings(draft.pages[pageIndex]).moveRoute = value),
            ),
        );
      };
    const behaviorControls = el("fieldset");
    behaviorControls.append(el("legend", "Page exploration behavior"));
    const behaviorSummary = el("p");
    behaviorControls.append(
      behaviorSummary,
      button(
        "Configure wander / patrol / sentinel…",
        /* @function mz-editor.callback.37 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: collect; frontier behavior dialog open. */ () => {
          collect();
          FrontierBehaviorDialog.open(
            draft.pages[pageIndex].behavior,
            /* @function mz-editor.callback.38 — Returns edit using a callback. Inputs: value. Uses: edit. Returns: edit using a callback. */ (
              value,
            ) =>
              edit(
                /* @function mz-editor.callback.39 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: draft pages at page index behavior. */ () => {
                  draft.pages[pageIndex].behavior = value;
                },
              ),
          );
        },
      ),
      button(
        "Use Autonomous Movement instead",
        /* @function mz-editor.callback.40 — Returns edit using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: edit. Returns: edit using a callback. */ () =>
          edit(
            /* @function mz-editor.callback.41 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. */ () => {
              delete draft.pages[pageIndex].behavior;
            },
          ),
      ),
    );
    $("mzEngineSettings").append(behaviorControls);
    /* @function mz-editor.collect.42 — Handles collect within mz editor. Inputs: no explicit arguments; uses enclosing module state. Updates: draft name; draft note; draft at key; draft movement mode; draft display name. Uses: $; string; settings; frontier event schema extra page conditions. Returns: without a result. */ function collect() {
      if (!draft) return;
      draft.name = $("mzEventName").value;
      draft.note = $("mzEventNote").value;
      for (const key of ["x", "y", "height", "heightOffset"])
        draft[key] = +placement[key].value;
      draft.movementMode = placement.movementMode.value;
      draft.displayName = placement.displayName.value;
      const actorId = placement.partyActorId.value;
      if (actorId) {
        draft.extensions.party = {
          ...draft.extensions.party,
          actorId: String(+actorId),
        };
      } else if (draft.extensions.party) delete draft.extensions.party.actorId;
      const p = draft.pages[pageIndex],
        m = settings(p);
      p.movement = $("mzMoveType").value;
      p.trigger = $("mzTrigger").value;
      p.through = options.through.checked;
      p.solid = options.solid.checked;
      m.moveSpeed = +$("mzMoveSpeed").value;
      m.moveFrequency = +$("mzMoveFrequency").value;
      for (const key of ["walkAnime", "stepAnime", "directionFix"])
        m[key] = options[key].checked;
      const extra = FrontierEventSchema.extraPageConditions(p),
        conditions = [];
      for (const [key, s] of Object.entries(slots)) {
        m.conditionSlots[key] = {
          enabled: s.enabled.checked,
          key: s.input.value,
          ...(key === "variable" ? { value: +s.value.value } : {}),
        };
        if (s.enabled.checked)
          conditions.push({
            type: s.type,
            key: s.input.value,
            ...(key === "variable"
              ? { value: +s.value.value }
              : key === "item"
                ? { value: 1 }
                : {}),
          });
      }
      p.condition = conditions.shift() || { type: "always", key: "" };
      p.conditions = [...conditions, ...extra];
    }
    /* @function mz-editor.edit.43 — Handles edit within mz editor. Inputs: action. Updates: draft; draft redo. Uses: collect; clone; action; frontier events validate. */ function edit(
      action,
    ) {
      collect();
      const before = clone(draft);
      try {
        action();
        draft = FrontierEvents.validate([draft], new Set(), api.world())[0];
        draftHistory.push(before);
        draftRedo = [];
        refresh();
        status("Unsaved event draft.");
      } catch (error) {
        draft = before;
        refresh();
        status(error.message);
      }
    }
    /* @function mz-editor.commandName.44 — Handles command name within mz editor. Inputs: c. Uses: frontier gameplay dialogs summary; frontier mzcommands metadata; c parameters at 0 join; c lines or a list of join. Returns: frontier gameplay dialogs summary using c; "". */ function commandName(
      c,
    ) {
      if (c.type === "screenBreathing")
        return (
          "Screen breathing: " +
          (c.enabled ? "On" : "Off") +
          " / intensity " +
          c.amplitude +
          " / " +
          c.frequency +
          " Hz"
        );
      if (c.type === "gameplayState") return FrontierGameplayDialogs.summary(c);
      if (c.type === "mz") {
        if (c.code === 0) return "";
        const name =
          FrontierMZCommands.metadata(c.code)?.name ||
          {
            411: "Else",
            412: "End",
            413: "Repeat Above",
            402: "When",
            403: "When Cancel",
            404: "End",
          }[c.code] ||
          "Command " + c.code;
        return (
          name +
          (c.code === 102
            ? ": " + c.parameters[0].join(", ")
            : c.code === 402
              ? ": " + c.parameters[1]
              : c.code === 101
                ? ": " + (c.lines || []).join(" / ")
                : c.code === 230
                  ? ": " + c.parameters[0] + " frames"
                  : c.code === 121
                    ? ": " +
                      c.parameters[0] +
                      "–" +
                      c.parameters[1] +
                      " = " +
                      (c.parameters[2] === 0 ? "ON" : "OFF")
                    : c.code === 108
                      ? ": " + (c.lines || []).join(" / ")
                      : "")
        );
      }
      return c.type + (c.text ? ": " + c.text : "");
    }
    /* @function mz-editor.refresh.45 — Handles refresh within mz editor. Inputs: no explicit arguments; uses enclosing module state. Updates: behavior summary text content; budget notice text content; extra notice text content; extra notice hidden; $ using "mzEventTitle" text content. Uses: settings; frontier events diagnostics; frontier event schema extra page conditions; $. Returns: without a result. */ function refresh() {
      if (!draft) return;
      shadow169.checked=draft.groundShadow!==false;
      const p = draft.pages[pageIndex],
        m = settings(p);
      behaviorSummary.textContent = p.behavior
        ? "Active: " +
          p.behavior.mode +
          (p.behavior.approach ? " with player approach" : "")
        : "Uses Autonomous Movement settings.";
      const budget = FrontierEvents.diagnostics(draft);
      budgetNotice.textContent =
        budget.pages +
        " pages · " +
        budget.commands +
        " commands · " +
        budget.serializedBytes +
        " / " +
        budget.byteBudget +
        " bytes. Page count has no fixed cap; static conditions use the dependency cache.";
      const extraCount = FrontierEventSchema.extraPageConditions(p).length;
      extraNotice.textContent = extraCount
        ? extraCount +
          " additional condition(s) are preserved and required. Edit them under Sprite Frontier properties."
        : "";
      extraNotice.hidden = !extraCount;
      $("mzEventTitle").textContent =
        "ID:" +
        String(draft.extensions?.["sprite-frontier"]?.eventNumber || draft.id) +
        " - Event Editor";
      $("mzEventName").value = draft.name;
      $("mzEventNote").value = draft.note || "";
      for (const k of ["x", "y", "height", "heightOffset"])
        placement[k].value = draft[k] ?? (k === "height" ? 1.65 : 0);
      placement.movementMode.value = draft.movementMode || "grounded";
      placement.displayName.value = draft.displayName ?? draft.name;
      placement.partyActorId.value = draft.extensions?.party?.actorId || "";
      $("mzMoveType").value = p.movement;
      $("mzMoveRoute").disabled = p.movement !== "custom";
      $("mzMoveSpeed").value = m.moveSpeed;
      $("mzMoveFrequency").value = m.moveFrequency;
      $("mzTrigger").value = p.trigger;
      for (const [key, s] of Object.entries(slots)) {
        const c = m.conditionSlots[key] || {};
        s.enabled.checked = !!c.enabled;
        s.input.value = c.key || "1";
        s.value.value = c.value ?? 0;
        s.input.disabled = !c.enabled;
        s.value.disabled = !c.enabled;
      }
      for (const key of ["walkAnime", "stepAnime", "directionFix"])
        options[key].checked = m[key];
      options.through.checked = p.through;
      options.solid.checked = !!p.solid;
      $("mzImage").textContent = m.image.profile || "(None)";
      $("mzPageTabs").replaceChildren(
        ...draft.pages.map(
          /* @function mz-editor.callback.46 — Provides the callback for draft pages map. Inputs: p; i. Uses: button; string; b set attribute. Returns: b. */ (
            p,
            i,
          ) => {
            const b = button(
              String(i + 1),
              /* @function mz-editor.callback.47 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: page index. Uses: collect; selection clear; refresh. */ () => {
                collect();
                pageIndex = i;
                selection.clear();
                refresh();
              },
            );
            b.setAttribute("aria-selected", i === pageIndex ? "true" : "false");
            return b;
          },
        ),
      );
      $("mzPageActions").querySelector('[data-action="delete"]').disabled =
        draft.pages.length === 1;
      $("mzPageActions").querySelector('[data-action="paste"]').disabled =
        !pageClipboard;
      drawCommands();
    }
    /* @function mz-editor.drawCommands.48 — Handles draw commands within mz editor. Inputs: no explicit arguments; uses enclosing module state. Updates: row class name; row dataset index; row style padding left; row text content; row onclick. Uses: $; list replace children; el; row set attribute. */ function drawCommands() {
      const list = $("mzCommandList"),
        commands = draft.pages[pageIndex].commands;
      list.replaceChildren();
      for (let i = 0; i <= commands.length; i++) {
        const c = commands[i],
          row = el("div");
        row.className = "mzCommandRow";
        row.setAttribute("role", "option");
        row.setAttribute("aria-selected", selection.has(i) ? "true" : "false");
        row.dataset.index = i;
        row.style.paddingLeft = 8 + (c?.indent || 0) * 18 + "px";
        row.textContent = "◆ " + (c ? commandName(c) : "");
        row.onclick =
          /* @function mz-editor.onclick.49 — Responds to a button or clickable control. Inputs: event. Updates: selection; anchor. Uses: array from; selection has; selection delete; selection add. */ (
            event,
          ) => {
            if (event.shiftKey) {
              selection = new Set(
                Array.from(
                  { length: Math.abs(i - anchor) + 1 },
                  /* @function mz-editor.callback.50 — Returns math min using i, anchor plus n. Inputs: ; n. Returns: math min using i, anchor plus n. */ (
                    _,
                    n,
                  ) => Math.min(i, anchor) + n,
                ),
              );
            } else if (event.ctrlKey || event.metaKey) {
              if (selection.has(i)) selection.delete(i);
              else selection.add(i);
              anchor = i;
            } else {
              selection = new Set([i]);
              anchor = i;
            }
            drawCommands();
            list.focus();
          };
        row.ondblclick =
          /* @function mz-editor.ondblclick.51 — Handles ondblclick within mz editor. Inputs: no explicit arguments; uses enclosing module state. Updates: selection; anchor. Uses: edit command; chooser. */ () => {
            selection = new Set([i]);
            anchor = i;
            if (c) editCommand();
            else chooser(i);
          };
        row.oncontextmenu =
          /* @function mz-editor.oncontextmenu.52 — Handles oncontextmenu within mz editor. Inputs: event. Updates: selection. Uses: event prevent default; selection has; draw commands; context menu. */ (
            event,
          ) => {
            event.preventDefault();
            if (!selection.has(i)) selection = new Set([i]);
            drawCommands();
            contextMenu(event.clientX, event.clientY);
          };
        list.append(row);
      }
    }
    /* @function mz-editor.range.53 — Handles range within mz editor. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element filter; group range. Returns: indices length selects group range using commands, math min using spread element, math max using spread element or a list of commands length, commands length minus 1. */ function range() {
      const commands = draft.pages[pageIndex].commands,
        indices = [...selection].filter(
          /* @function mz-editor.callback.54 — Returns i is less than commands length. Inputs: i. Returns: i is less than commands length. */ (
            i,
          ) => i < commands.length,
        );
      return indices.length
        ? groupRange(commands, Math.min(...indices), Math.max(...indices))
        : [commands.length, commands.length - 1];
    }
    /* @function mz-editor.copy.55 — Handles copy within mz editor. Inputs: assignment pattern. Updates: command clipboard. Uses: range; clone; draft pages at page index commands slice; edit. */ function copy(
      cut = false,
    ) {
      const [a, b] = range();
      commandClipboard = clone(draft.pages[pageIndex].commands.slice(a, b + 1));
      if (cut && b >= a)
        edit(
          /* @function mz-editor.callback.56 — Returns draft pages at page index commands splice using a, b minus a plus 1. Inputs: no explicit arguments; uses enclosing module state. Uses: draft pages at page index commands splice. Returns: draft pages at page index commands splice using a, b minus a plus 1. */ () =>
            draft.pages[pageIndex].commands.splice(a, b - a + 1),
        );
    }
    /* @function mz-editor.paste.57 — Handles paste within mz editor. Inputs: no explicit arguments; uses enclosing module state. Uses: edit. Returns: without a result. */ function paste() {
      if (!commandClipboard.length) return;
      const index = Math.min(
        ...selection,
        draft.pages[pageIndex].commands.length,
      );
      edit(
        /* @function mz-editor.callback.58 — Returns draft pages at page index commands splice using index, 0, spread element. Inputs: no explicit arguments; uses enclosing module state. Uses: draft pages at page index commands splice; frontier mzcommand editing rebase. Returns: draft pages at page index commands splice using index, 0, spread element. */ () =>
          draft.pages[pageIndex].commands.splice(
            index,
            0,
            ...FrontierMZCommandEditing.rebase(
              commandClipboard,
              draft.pages[pageIndex].commands[index]?.indent || 0,
            ),
          ),
      );
    }
    /* @function mz-editor.remove.59 — Handles remove within mz editor. Inputs: no explicit arguments; uses enclosing module state. Uses: range; edit. */ function remove() {
      const [a, b] = range();
      if (b >= a)
        edit(
          /* @function mz-editor.callback.60 — Returns draft pages at page index commands splice using a, b minus a plus 1. Inputs: no explicit arguments; uses enclosing module state. Uses: draft pages at page index commands splice. Returns: draft pages at page index commands splice using a, b minus a plus 1. */ () =>
            draft.pages[pageIndex].commands.splice(a, b - a + 1),
        );
    }
    /* @function mz-editor.editCommand.61 — Handles edit command within mz editor. Inputs: no explicit arguments; uses enclosing module state. Updates: initial create else. Uses: frontier gameplay dialogs open; frontier template dialogs replace; api world; api templates. Returns: without a result; without a result. */ function editCommand() {
      const index = Math.min(...selection),
        c = draft.pages[pageIndex].commands[index];
      if(['SetDitherScale','SetDitherStrength','SetPaletteMode'].includes(c?.type)){root.FrontierPaletteDither.commandDialog(c,/* @function mzEditor.replacePalette168 — Inputs: validated original command. Replaces selected command through event draft history. */function(command){edit(/* @function mzEditor.paletteReplace168 — Inputs: none. Updates selected page command; edit owns validation/Undo. */function(){draft.pages[pageIndex].commands[index]=command;});});return;}
      if (c?.type === "screenBreathing") {
        FrontierBreathingDialog.open(
          c,
          /* @function mz-editor.breathingEditAccept — Inputs: validated replacement command. Replaces draft row through undo; returns nothing. */ function (
            command,
          ) {
            edit(
              /* @function mz-editor.breathingEditCommit — Inputs: none. Replaces selected draft command; no runtime changes until event executes. */ function () {
                draft.pages[pageIndex].commands[index] = command;
              },
            );
          },
        );
        return;
      }
      if (c?.type === "nativeCraft" || c?.type === "nativeCipher") {
        FrontierNativeToolDialogs.open(
          c,
          /* @function mz-editor.nativeEditAccept — Inputs: validated command. Replaces selected draft command through undo. Returns nothing. */ function (
            command,
          ) {
            edit(
              /* @function mz-editor.nativeEditCommit — Inputs: none. Replaces selected command in event draft; returns nothing. */ function () {
                draft.pages[pageIndex].commands[index] = command;
              },
            );
          },
        );
        return;
      }
      if (c?.type === "gameplayState") {
        FrontierGameplayDialogs.open(
          c,
          /* @function mz-editor.callback.62 — Returns edit using a callback. Inputs: command. Uses: edit. Returns: edit using a callback. */ (
            command,
          ) =>
            edit(
              /* @function mz-editor.callback.63 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: draft pages at page index commands at index. Returns: assignment. */ () =>
                (draft.pages[pageIndex].commands[index] = command),
            ),
        );
        return;
      }
      if (c?.type === "replaceEvent") {
        FrontierTemplateDialogs.replace(
          c,
          { events: api.world().events, templates: api.templates?.() },
          /* @function mz-editor.callback.64 — Returns edit using a callback. Inputs: command. Uses: edit. Returns: edit using a callback. */ (
            command,
          ) =>
            edit(
              /* @function mz-editor.callback.65 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: draft pages at page index commands at index. Returns: assignment. */ () =>
                (draft.pages[pageIndex].commands[index] = command),
            ),
        );
        return;
      }
      if (!c || c.type !== "mz" || !FrontierMZDialogs.has(c.code)) {
        status("Dedicated editing dialog is pending for this command.");
        return;
      }
      const initial = clone(c);
      if (c.code === 111)
        initial.createElse =
          FrontierMZCommandEditing.bounds(
            draft.pages[pageIndex].commands,
            index,
          ).otherwise >= 0;
      FrontierMZDialogs.open(
        c.code,
        initial,
        /* @function mz-editor.callback.66 — Returns edit using a callback. Inputs: value. Uses: edit. Returns: edit using a callback. */ (
          value,
        ) =>
          edit(
            /* @function mz-editor.callback.67 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: draft pages at page index commands at index. Uses: frontier mzcommand editing replace branch; frontier mzcommand editing replace choices. */ () => {
              if (c.code === 111)
                FrontierMZCommandEditing.replaceBranch(
                  draft.pages[pageIndex].commands,
                  index,
                  value,
                );
              else if (c.code === 102)
                FrontierMZCommandEditing.replaceChoices(
                  draft.pages[pageIndex].commands,
                  index,
                  value,
                );
              else draft.pages[pageIndex].commands[index] = value;
            },
          ),
        { maps: api.maps?.() || [] },
      );
    }
    /* @function mz-editor.contextMenu.68 — Handles context menu within mz editor. Inputs: x; y. Updates: menu id; menu class name; menu style left; menu style top. Uses: document query selector using "#mzCommandContext" remove; document query selector; el; menu set attribute. */ function contextMenu(
      x,
      y,
    ) {
      document.querySelector("#mzCommandContext")?.remove();
      const menu = el("div");
      menu.id = "mzCommandContext";
      menu.className = "mzCommandContext";
      menu.setAttribute("role", "menu");
      for (const [name, fn] of [
        [
          "New",
          /* @function mz-editor.callback.69 — Returns chooser using math min using spread element. Inputs: no explicit arguments; uses enclosing module state. Uses: chooser. Returns: chooser using math min using spread element. */ () =>
            chooser(Math.min(...selection)),
        ],
        ["Edit", editCommand],
        [
          "Cut",
          /* @function mz-editor.callback.70 — Returns copy using true. Inputs: no explicit arguments; uses enclosing module state. Uses: copy. Returns: copy using true. */ () =>
            copy(true),
        ],
        [
          "Copy",
          /* @function mz-editor.callback.71 — Returns copy using . Inputs: no explicit arguments; uses enclosing module state. Uses: copy. Returns: copy using . */ () =>
            copy(),
        ],
        ["Paste", paste],
        ["Delete", remove],
        [
          "Select All",
          /* @function mz-editor.callback.72 — Provides the callback for the enclosing mz editor operation. Inputs: no explicit arguments; uses enclosing module state. Updates: selection. Uses: draft pages at page index commands map; draw commands. */ () => {
            selection = new Set(
              draft.pages[pageIndex].commands.map(
                /* @function mz-editor.callback.73 — Returns i. Inputs: ; i. Returns: i. */ (
                  _,
                  i,
                ) => i,
              ),
            );
            drawCommands();
          },
        ],
        [
          "Copy as Text",
          /* @function mz-editor.callback.74 — Returns chain. Inputs: no explicit arguments; uses enclosing module state. Uses: navigator clipboard write text using a list of spread element map using a callback join using "\n" catch; navigator clipboard write text; a list of spread element map using a callback join; a list of spread element map. Returns: chain. */ () =>
            navigator.clipboard
              ?.writeText(
                [...selection]
                  .map(
                    /* @function mz-editor.callback.75 — Returns command name using draft pages at page index commands at i or a record containing . Inputs: i. Uses: command name. Returns: command name using draft pages at page index commands at i or a record containing . */ (
                      i,
                    ) => commandName(draft.pages[pageIndex].commands[i] || {}),
                  )
                  .join("\n"),
              )
              .catch(
                /* @function mz-editor.callback.76 — Returns status using "Clipboard is unavailable.". Inputs: no explicit arguments; uses enclosing module state. Uses: status. Returns: status using "Clipboard is unavailable.". */ () =>
                  status("Clipboard is unavailable."),
              ),
        ],
      ]) {
        const b = button(
          name,
          /* @function mz-editor.callback.77 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: menu remove; fn. */ () => {
            menu.remove();
            fn();
          },
        );
        b.setAttribute("role", "menuitem");
        menu.append(b);
      }
      menu.style.left = Math.min(x, innerWidth - 180) + "px";
      menu.style.top = Math.min(y, innerHeight - 300) + "px";
      d.append(menu);
      menu.querySelector("button").focus();
      const close =
        /* @function mz-editor.close.78 — Handles close within mz editor. Inputs: event. Uses: menu contains; menu remove; document remove event listener. */ (
          event,
        ) => {
          if (!menu.contains(event.target)) {
            menu.remove();
            document.removeEventListener("pointerdown", close);
          }
        };
      setTimeout(
        /* @function mz-editor.callback.79 — Returns document add event listener using "pointerdown", close. Inputs: no explicit arguments; uses enclosing module state. Uses: document add event listener. Returns: document add event listener using "pointerdown", close. */ () =>
          document.addEventListener("pointerdown", close),
        0,
      );
    }
    /* @function mz-editor.chooser.80 — Handles chooser within mz editor. Inputs: index. Updates: modal class name; columns class name. Uses: collect; el; modal set attribute; modal append. */ function chooser(
      index,
    ) {
      collect();
      const modal = el("dialog");
      modal.className = "mzDialog mzCommandChooser";
      modal.setAttribute("aria-label", "Event Commands");
      const title = el("header", "Event Commands"),
        tabs = el("nav"),
        columns = el("section");
      columns.className = "mzChooserColumns";
      modal.append(title, tabs, columns);
      for (let i = 1; i <= 3; i++)
        tabs.append(
          button(
            String(i),
            /* @function mz-editor.callback.81 — Returns show using i. Inputs: no explicit arguments; uses enclosing module state. Uses: show. Returns: show using i. */ () =>
              show(i),
          ),
        );
      const footer = el("footer");
      footer.append(
        button(
          "Cancel",
          /* @function mz-editor.callback.82 — Returns modal close using . Inputs: no explicit arguments; uses enclosing module state. Uses: modal close. Returns: modal close using . */ () =>
            modal.close(),
        ),
      );
      modal.append(footer);
      /* @function mz-editor.show.83 — Handles show within mz editor. Inputs: tab. Updates: b disabled; b title. Uses: columns replace children; el; frontier mzcatalog filter; section append. */ function show(
        tab,
      ) {
        columns.replaceChildren(el("div"), el("div"));
        for (const g of FrontierMZCatalog.filter(
          /* @function mz-editor.callback.84 — Returns g tab equals tab. Inputs: g. Returns: g tab equals tab. */ (
            g,
          ) => g.tab === tab,
        )) {
          const section = el("fieldset");
          section.append(el("legend", g.label));
          for (const c of g.commands) {
            const immediate = FrontierMZCommands.get(c.code)?.immediate;
            const b = button(
              c.name + (immediate ? "" : "…"),
              /* @function mz-editor.callback.85 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: modal close; accept; frontier mzdialogs open; api maps. */ () => {
                modal.close();
                const accept =
                  /* @function mz-editor.accept.86 — Returns edit using a callback. Inputs: command. Uses: edit. Returns: edit using a callback. */ (
                    command,
                  ) =>
                    edit(
                      /* @function mz-editor.callback.87 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: command indent. Uses: p commands splice; frontier mzcommand editing insert branch; frontier mzcommand editing insert choices. */ () => {
                        const p = draft.pages[pageIndex],
                          indent = p.commands[index]?.indent || 0;
                        command.indent = indent;
                        p.commands.splice(
                          index,
                          0,
                          ...(c.code === 111
                            ? FrontierMZCommandEditing.insertBranch(command)
                            : c.code === 102
                              ? FrontierMZCommandEditing.insertChoices(command)
                              : c.code === 112
                                ? [
                                    command,
                                    {
                                      type: "mz",
                                      code: 0,
                                      indent: indent + 1,
                                      parameters: [],
                                    },
                                    {
                                      type: "mz",
                                      code: 413,
                                      indent,
                                      parameters: [],
                                    },
                                  ]
                                : [command]),
                        );
                      },
                    );
                if (immediate)
                  accept({
                    type: "mz",
                    code: c.code,
                    indent: 0,
                    parameters: [],
                  });
                else
                  FrontierMZDialogs.open(c.code, null, accept, {
                    maps: api.maps?.() || [],
                  });
              },
            );
            b.disabled = !immediate && !FrontierMZDialogs.has(c.code);
            b.title = b.disabled
              ? "Pending dedicated dialog and runtime implementation"
              : FrontierMZCommands.get(c.code)?.status ||
                "Dedicated dialog available";
            section.append(b);
          }
          columns.children[g.column].append(section);
        }
        for (const [i, b] of [...tabs.children].entries())
          b.setAttribute("aria-selected", String(i + 1 === tab));
      }
      modal.addEventListener(
        "close",
        /* @function mz-editor.callback.88 — Returns modal remove using . Inputs: no explicit arguments; uses enclosing module state. Uses: modal remove. Returns: modal remove using . */ () =>
          modal.remove(),
      );
      document.body.append(modal);
      show(1);
      modal.showModal();
      columns.querySelector("button:not(:disabled)")?.focus();
    }
    /* @function mz-editor.selectImage.89 — Handles select image within mz editor. Inputs: no explicit arguments; uses enclosing module state. Updates: modal class name; list size; list value; preview width; preview height. Uses: el; modal set attribute; modal append; frontier events graphics filter. */ function selectImage() {
      const modal = el("dialog");
      modal.className = "mzDialog mzImageSelector";
      modal.setAttribute("aria-label", "Select an Image");
      modal.append(el("h2", "Select an Image"));
      const list = el("select");
      list.size = 12;
      for (const id of [
        "",
        ...FrontierEvents.graphics.filter(
          /* @function mz-editor.callback.90 — Returns g does not equal "none". Inputs: g. Returns: g does not equal "none". */ (
            g,
          ) => g !== "none",
        ),
        ...FrontierMuzzle.profiles.keys(),
      ])
        list.append(new Option(id || "(None)", id));
      list.value = settings(draft.pages[pageIndex]).image.profile;
      modal.append(list);
      const preview = el("canvas");
      preview.width = 180;
      preview.height = 230;
      modal.append(preview);
      /* @function mz-editor.show.91 — Handles show within mz editor. Inputs: no explicit arguments; uses enclosing module state. Uses: preview get context; ctx clear rect; frontier sprites sheet; ctx draw image. */ function show() {
        const ctx = preview.getContext("2d");
        ctx.clearRect(0, 0, 180, 230);
        const sheet = FrontierSprites.sheet({
            id: "event-preview",
            spriteProfile: list.value,
          }),
          f = sheet?.frames[0];
        if (sheet?.image.complete && f) {
          const scale = Math.min(170 / f.w, 220 / f.h);
          ctx.drawImage(
            sheet.image,
            f.x,
            f.y,
            f.w,
            f.h,
            (180 - f.w * scale) / 2,
            230 - f.h * scale,
            f.w * scale,
            f.h * scale,
          );
        }
      }
      list.onchange = show;
      const footer = el("footer");
      footer.append(
        button(
          "OK",
          /* @function mz-editor.callback.92 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Uses: edit; modal close. */ () => {
            edit(
              /* @function mz-editor.callback.93 — Provides the callback for edit. Inputs: no explicit arguments; uses enclosing module state. Updates: settings using p image profile; p graphic. Uses: settings; frontier events graphics includes. */ () => {
                const p = draft.pages[pageIndex];
                settings(p).image.profile = list.value;
                p.graphic = FrontierEvents.graphics.includes(list.value)
                  ? list.value
                  : list.value
                    ? "npc"
                    : "none";
              },
            );
            modal.close();
          },
        ),
        button(
          "Cancel",
          /* @function mz-editor.callback.94 — Returns modal close using . Inputs: no explicit arguments; uses enclosing module state. Uses: modal close. Returns: modal close using . */ () =>
            modal.close(),
        ),
      );
      modal.append(footer);
      modal.addEventListener(
        "close",
        /* @function mz-editor.callback.95 — Returns modal remove using . Inputs: no explicit arguments; uses enclosing module state. Uses: modal remove. Returns: modal remove using . */ () =>
          modal.remove(),
      );
      document.body.append(modal);
      modal.showModal();
      show();
    }
    for (const [name, action, fn] of [
      [
        "New Event Page",
        "new",
        /* @function mz-editor.callback.96 — Provides the callback for the enclosing mz editor operation. Inputs: no explicit arguments; uses enclosing module state. Uses: draft pages splice; blank page. */ () => {
          draft.pages.splice(pageIndex + 1, 0, blankPage());
          pageIndex++;
        },
      ],
      [
        "Copy Event Page",
        "copy",
        /* @function mz-editor.callback.97 — Provides the callback for the enclosing mz editor operation. Inputs: no explicit arguments; uses enclosing module state. Updates: page clipboard. Uses: clone. */ () => {
          pageClipboard = clone(draft.pages[pageIndex]);
        },
      ],
      [
        "Paste Event Page",
        "paste",
        /* @function mz-editor.callback.98 — Provides the callback for the enclosing mz editor operation. Inputs: no explicit arguments; uses enclosing module state. Uses: draft pages splice; clone. */ () => {
          if (pageClipboard) {
            draft.pages.splice(pageIndex + 1, 0, clone(pageClipboard));
            pageIndex++;
          }
        },
      ],
      [
        "Delete Event Page",
        "delete",
        /* @function mz-editor.callback.99 — Provides the callback for the enclosing mz editor operation. Inputs: no explicit arguments; uses enclosing module state. Updates: page index. Uses: draft pages splice. */ () => {
          if (draft.pages.length > 1) {
            draft.pages.splice(pageIndex, 1);
            pageIndex = Math.min(pageIndex, draft.pages.length - 1);
          }
        },
      ],
      [
        "Clear Event Page",
        "clear",
        /* @function mz-editor.callback.100 — Provides the callback for the enclosing mz editor operation. Inputs: no explicit arguments; uses enclosing module state. Updates: draft pages at page index. Uses: blank page. */ () => {
          draft.pages[pageIndex] = blankPage();
        },
      ],
    ]) {
      const b = button(
        name,
        /* @function mz-editor.callback.101 — Returns edit using fn. Inputs: no explicit arguments; uses enclosing module state. Uses: edit. Returns: edit using fn. */ () =>
          edit(fn),
      );
      b.dataset.action = action;
      $("mzPageActions").append(b);
    }
    /* @function mz-editor.begin.102 — Handles begin within mz editor. Inputs: event; assignment pattern. Updates: draft; draft extensions at "sprite-frontier"; draft name; draft note; draft display name. Uses: frontier event schema migrate; api world using events map; api world; string using number pad start. Returns: without a result. */ function begin(
      event,
      isNew = false,
    ) {
      if (!event?.pages) return;
      draft = FrontierEventSchema.migrate(event);
      if (isNew) {
        const number =
          1 +
          Math.max(
            0,
            ...api
              .world()
              .events.map(
                /* @function mz-editor.callback.103 — Returns chain or 0. Inputs: e. Returns: chain or 0. */ (
                  e,
                ) => e.extensions?.["sprite-frontier"]?.eventNumber || 0,
              ),
          );
        draft.extensions["sprite-frontier"] = {
          ...draft.extensions["sprite-frontier"],
          eventNumber: number,
        };
        if (event.name === "New event") {
          draft.name = "EV" + String(number).padStart(3, "0");
          draft.note = "";
          draft.displayName = "";
          draft.pages = [blankPage()];
        }
      }
      pageIndex = 0;
      draftHistory = [];
      draftRedo = [];
      selection.clear();
      choose(draft.id);
      refresh();
      status(
        "Unsaved draft. Apply saves this event; Cancel discards edits since the last Apply. Unavailable commands are disabled.",
      );
      if (!d.open) d.showModal();
      $("mzEventName").focus();
      $("mzEventName").select();
    }
    /* @function mz-editor.apply.104 — Handles apply within mz editor. Inputs: assignment pattern; assignment pattern. Updates: world events at i; draft; draft history; draft redo; return id. Uses: collect; clone; api world; world events find index. */ function apply(
      close = false,
      play = false,
    ) {
      collect();
      try {
        const world = clone(api.world()),
          i = world.events.findIndex(
            /* @function mz-editor.callback.105 — Returns e id equals draft id. Inputs: e. Returns: e id equals draft id. */ (
              e,
            ) => e.id === draft.id,
          );
        if (i < 0) world.events.push(draft);
        else world.events[i] = draft;
        const checked = FrontierWorld.validate(world).events.find(
          /* @function mz-editor.callback.106 — Returns e id equals draft id. Inputs: e. Returns: e id equals draft id. */ (
            e,
          ) => e.id === draft.id,
        );
        const accepted = api.mutate(
          /* @function mz-editor.callback.107 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: list at index. Uses: api world; list find index; list push; clone. */ () => {
            const list = api.world().events,
              index = list.findIndex(
                /* @function mz-editor.callback.108 — Returns e id equals checked id. Inputs: e. Returns: e id equals checked id. */ (
                  e,
                ) => e.id === checked.id,
              );
            if (index < 0) list.push(clone(checked));
            else list[index] = clone(checked);
          },
          /* @function mz-editor.callback.109 — Returns choose using checked id. Inputs: no explicit arguments; uses enclosing module state. Uses: choose. Returns: choose using checked id. */ () =>
            choose(checked.id),
        );
        if(accepted===false){status("Event change rejected; correct placement before opening enemy settings.");return false;}
        draft = clone(checked);
        draftHistory = [];
        draftRedo = [];
        refresh();
        status(
          "Applied. Cancel will discard only edits made after this Apply.",
        );
        if (close || play) d.close();
        if (play) {
          returnId = checked.id;
          api.testEvent(returnId);
          returnButton.hidden = false;
        }
        return true;
      } catch (e) {
        status(e.message);return false;
      }
    }
    $("mzEventOK").onclick =
      /* @function mz-editor.onclick.110 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: apply. Returns: apply using true. */ () =>
        apply(true);
    $("mzEventApply").onclick =
      /* @function mz-editor.onclick.111 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: apply. Returns: apply using . */ () =>
        apply();
    $("mzEventCancel").onclick =
      /* @function mz-editor.onclick.112 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using . */ () =>
        d.close();
    $("mzEventClose").onclick =
      /* @function mz-editor.onclick.113 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using . */ () =>
        d.close();
    $("mzPlaytest").onclick =
      /* @function mz-editor.onclick.114 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: apply. Returns: apply using false, true. */ () =>
        apply(false, true);
    $("mzImage").onclick = selectImage;
    d.addEventListener(
      "close",
      /* @function mz-editor.callback.115 — Provides the callback for d add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: draft. Uses: document query selector using "#mzCommandContext" remove; document query selector. */ () => {
        draft = null;
        document.querySelector("#mzCommandContext")?.remove();
      },
    );
    const returnButton = button(
      "Return to event editor",
      /* @function mz-editor.callback.116 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: return button hidden. Uses: api return editor; begin; api world using events find; api world. */ () => {
        api.returnEditor();
        returnButton.hidden = true;
        begin(
          api
            .world()
            .events.find(
              /* @function mz-editor.callback.117 — Returns e id equals return id. Inputs: e. Returns: e id equals return id. */ (
                e,
              ) => e.id === returnId,
            ),
        );
      },
    );
    returnButton.id = "mzReturnFromPlaytest";
    returnButton.hidden = true;
    document.body.append(returnButton);
    // October 14: command creation is visible instead of requiring right-click/Insert.
    const addCommand = document.createElement("button");
    addCommand.type = "button";
    addCommand.id = "mzAddCommand";
    addCommand.textContent = "Add Command…";
    /* @function mzEditor.visibleAddCommand — Inputs: click ignored. Returns nothing; opens the existing validated command chooser at current selected row or end. Changes only modal drafts until event Apply; chooser errors propagate. */
    addCommand.onclick = /* @function mzEditor.addCommandHandler — Inputs: ignored click. Returns nothing; opens existing chooser at selected row/end. Draft edits commit only on event Apply; errors propagate. */ function () {
      chooser(Math.min(...selection, draft.pages[pageIndex].commands.length));
    };
    $("mzCommandList").before(addCommand);
    $("mzCommandList").addEventListener(
      "keydown",
      /* @function mz-editor.callback.118 — Provides the callback for $ using "mzCommandList" add event listener. Inputs: event. Updates: selection; draft; page index; anchor; handled. Uses: event key to lower case; chooser; edit command; remove. */ (
        event,
      ) => {
        const key = event.key.toLowerCase(),
          cmd = event.ctrlKey || event.metaKey;
        let handled = true;
        if (key === "insert")
          chooser(
            Math.min(...selection, draft.pages[pageIndex].commands.length),
          );
        else if (key === "enter") {
          const index = Math.min(
            ...selection,
            draft.pages[pageIndex].commands.length,
          );
          if (index < draft.pages[pageIndex].commands.length) editCommand();
          else chooser(index);
        } else if (key === "delete") remove();
        else if (cmd && key === "c") copy();
        else if (cmd && key === "x") copy(true);
        else if (cmd && key === "v") paste();
        else if (cmd && key === "a") {
          selection = new Set(
            draft.pages[pageIndex].commands.map(
              /* @function mz-editor.callback.119 — Returns i. Inputs: ; i. Returns: i. */ (
                _,
                i,
              ) => i,
            ),
          );
          drawCommands();
        } else if (cmd && (key === "z" || key === "y")) {
          const redo = key === "y" || event.shiftKey,
            source = redo ? draftRedo : draftHistory,
            dest = redo ? draftHistory : draftRedo;
          if (source.length) {
            dest.push(clone(draft));
            draft = source.pop();
            pageIndex = Math.min(pageIndex, draft.pages.length - 1);
            selection.clear();
            refresh();
          }
        } else if (key === "arrowdown" || key === "arrowup") {
          const n = Math.max(
            0,
            Math.min(
              draft.pages[pageIndex].commands.length,
              anchor + (key === "arrowdown" ? 1 : -1),
            ),
          );
          selection = event.shiftKey
            ? new Set([...selection, n])
            : new Set([n]);
          anchor = n;
          drawCommands();
        } else handled = false;
        if (handled) {
          event.preventDefault();
          event.stopPropagation();
        }
      },
    );
    return {
      begin,
      open: /* @function mz-editor.open.120 — Returns begin using selected using . Inputs: no explicit arguments; uses enclosing module state. Uses: begin; selected. Returns: begin using selected using . */ () =>
        begin(selected()),
      /* @function mz-editor.duplicate.121 — Handles duplicate within mz editor. Inputs: id. Updates: copy id; copy name. Uses: api world using events find; api world; clone; crypto random uuid. */ duplicate(
        id,
      ) {
        const e = api
          .world()
          .events.find(
            /* @function mz-editor.callback.122 — Returns e id equals id. Inputs: e. Returns: e id equals id. */ (
              e,
            ) => e.id === id,
          );
        if (e) {
          const copy = clone(e);
          copy.id = "event-" + crypto.randomUUID();
          copy.name += " copy";
          begin(copy, true);
        }
      },
      get pageIndex /* @function mz-editor.pageIndex.123 — Handles page index within mz editor. Inputs: no explicit arguments; uses enclosing module state. Returns: page index. */() {
        return pageIndex;
      },
      get isOpen /* @function mz-editor.isOpen.124 — Handles is open within mz editor. Inputs: no explicit arguments; uses enclosing module state. Returns: d open. */() {
        return d.open;
      },
    };
  }
  root.FrontierMZEditor = { create, blankPage, groupRange };
})(window);
