/* MAINTAINER GUIDE
 * In-level editor forms. The injected API owns mutation, validation, undo and restart. This module edits authored event data, never the active combat copy. Add a command in fields, addCommand, summary and events.js together.
 * See docs/CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function editor.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier editor. */
(/* @function editor.installReviewed — Installs in-level authored-event forms. The injected owner API controls validation, Undo and playtest restart; this module is not the runtime combat-event owner. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  const $ =
    /* @function editor.$.2 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id. */ (
      id,
    ) => document.getElementById(id);
  // Construct isolated editor/event state through the caller services.
  /* @function editor.create.3 — Construct isolated editor/event state through the caller services. Inputs: api. Updates: api; $ using "selection" onchange; $ using "eventPage" onchange; $ using "applyPosition" onclick; $ using "deleteSelected" onclick. Uses: $; fields; frontier workbench create; $ using "eventWorkbench" add event listener. Returns: a record containing openEvent, beginEvent, duplicateEvent, deleteEvent, choose, refresh, selected, selectedId. */ function create(
    api,
  ) {
    const authoredApi = api;
    let draftWorld = null,
      draftId = "",
      draftValid = true;
    api = {
      ...api,
      world:
        /* @function editor.world.4 — Returns draft world or authored api world using . Inputs: no explicit arguments; uses enclosing module state. Uses: authored api world. Returns: draft world or authored api world using . */ () =>
          draftWorld || authoredApi.world(),
      preview:
        /* @function editor.preview.5 — Handles preview within editor. Inputs: no explicit arguments; uses enclosing module state. Uses: authored api preview. */ () => {
          if (!draftWorld) authoredApi.preview();
        },
      /* @function editor.mutate.6 — Handles mutate within editor. Inputs: action; callback. Updates: draft world; draft valid; $ using "eventEditorStatus" text content. Uses: authored api mutate; structured clone; action; frontier world validate. Returns: authored api mutate using action, callback. */ mutate(
        action,
        callback,
      ) {
        if (!draftWorld) return authoredApi.mutate(action, callback);
        const before = structuredClone(draftWorld);
        try {
          action();
          draftWorld = FrontierWorld.validate(draftWorld);
          draftValid = true;
          callback?.();
          $("eventEditorStatus").textContent =
            "Draft updated. Apply commits the complete event; Cancel discards it.";
        } catch (error) {
          draftWorld = before;
          draftValid = false;
          refresh();
          $("eventEditorStatus").textContent =
            "Draft rejected: " + error.message;
        }
      },
    };
    let selectedId = "",
      pageIndex = 0,
      commandIndex = null;
    const selected =
      /* @function editor.selected.7 — Returns a list of spread element, spread element find using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element, spread element find; api world. Returns: a list of spread element, spread element find using a callback. */ () =>
        [...api.world().objects, ...(api.world().events || [])].find(
          /* @function editor.callback.8 — Returns e id equals selected id. Inputs: e. Returns: e id equals selected id. */ (
            e,
          ) => e.id === selectedId,
        );
    // Exit command-edit mode and rebuild input fields with defaults.
    /* @function editor.resetCommand.9 — Exit command-edit mode and rebuild input fields with defaults. Inputs: no explicit arguments; uses enclosing module state. Updates: command index; $ using "addCommand" text content. Uses: $; fields. */ function resetCommand() {
      commandIndex = null;
      $("addCommand").textContent = "Add command";
      fields();
    }
    // Change selection and reset page/command editing to avoid applying controls to the wrong event.
    /* @function editor.choose.10 — Change selection and reset page/command editing to avoid applying controls to the wrong event. Inputs: id. Updates: selected id; page index. Uses: workbench reset selection; reset command; refresh; api preview. */ function choose(
      id,
    ) {
      selectedId = id;
      workbench.resetSelection();
      pageIndex = 0;
      resetCommand();
      refresh();
      api.preview();
    }
    // Rebuild forms from authored data; use textContent for user text and keep selection/page indices in range.
    /* @function editor.refresh.11 — Rebuild forms from authored data; use textContent for user text and keep selection/page indices in range. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "selection" value; $ using "objectX" value; $ using "objectY" value; $ using "objectElevation" value; $ using "openEventEditor" disabled. Uses: api world; $ using "selection" replace children; $; all map. Returns: without a result. */ function refresh() {
      const world = api.world(),
        all = [...world.objects, ...(world.events || [])];
      $("selection").replaceChildren(
        new Option("None", ""),
        ...all.map(
          /* @function editor.callback.12 — Returns a new option. Inputs: e. Returns: a new option. */ (
            e,
          ) =>
            new Option(
              (e.name || e.id) + (e.pages ? " [event]" : " [" + e.kind + "]"),
              e.id,
            ),
        ),
      );
      $("selection").value = selectedId;
      const event = selected();
      $("objectX").value = event?.x.toFixed(2) || "";
      $("objectY").value = event?.y.toFixed(2) || "";
      $("objectElevation").value = event?.elevation || 0;
      $("openEventEditor").disabled = !event?.pages;
      $("eventInspector").hidden = !event?.pages;
      if (!event?.pages) return;
      pageIndex = Math.min(pageIndex, event.pages.length - 1);
      $("eventPage").replaceChildren(
        ...event.pages.map(
          /* @function editor.callback.13 — Returns a new option. Inputs: p; i. Uses: string. Returns: a new option. */ (
            p,
            i,
          ) => new Option(i + 1 + " · " + p.name, String(i)),
        ),
      );
      $("eventPage").value = String(pageIndex);
      const page = event.pages[pageIndex];
      $("eventTopics").value = JSON.stringify(event.topics || [], null, 2);
      $("eventSprite").value = event.spriteProfile || "";
      $("eventCombat").value = event.combatNote || "";
      $("eventName").value = event.name;
      if ($("draftEventX")) {
        $("draftEventX").value = event.x;
        $("draftEventY").value = event.y;
        $("draftHeight").value = event.height ?? 1.65;
        $("draftOffset").value =
          event.heightOffset ?? (event.elevation || 0) * 0.3;
        $("draftFlight").value = event.movementMode || "grounded";
      }
      $("eventRange").value = +(event.range / 0.3).toFixed(2);
      $("eventActivity").value = event.activity || "distance";
      $("inspectionText").value = event.inspection || "";
      $("pageName").value = page.name;
      $("pageCondition").value = page.condition.type;
      $("conditionValue").value = page.condition.value ?? 1;
      $("additionalConditions").value = (page.conditions || [])
        .map(
          /* @function editor.callback.14 — Returns a list of c type, c key, spread element join using ":". Inputs: c. Uses: a list of c type, c key, spread element join. Returns: a list of c type, c key, spread element join using ":". */ (
            c,
          ) =>
            [c.type, c.key, ...(c.value === undefined ? [] : [c.value])].join(
              ":",
            ),
        )
        .join("\n");
      $("conditionKey").value = page.condition.key || "A";
      $("pageGraphic").value = page.graphic;
      $("pageTrigger").value = page.trigger;
      $("pageSolid").checked = page.solid;
      if ($("pageMovement")) {
        $("pageMovement").value = page.movement || "stationary";
        $("pageThrough").checked = !!page.through;
      }
      const list = $("commandList");
      list.replaceChildren();
      let depth = 0;
      page.commands.forEach(
        /* @function editor.callback.15 — Provides the callback for page commands for each. Inputs: command; i. Updates: depth; li style margin left; text text content; edit text content; edit onclick. Uses: document create element; summary; li append; a list of "branch", "else", "end" includes. */ (
          command,
          i,
        ) => {
          const li = document.createElement("li"),
            text = document.createElement("span");
          if (command.type === "end" || command.type === "else")
            depth = Math.max(0, depth - 1);
          li.style.marginLeft = depth * 16 + "px";
          if (command.type === "branch" || command.type === "else") depth++;
          text.textContent = summary(command);
          li.append(text);
          const edit = document.createElement("button");
          edit.textContent = "Edit";
          edit.onclick =
            /* @function editor.onclick.16 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: command index; $ using "commandType" value; $ using "addCommand" text content; $ using id value; $ using "cmdDialogue" checked. Uses: $; fields; command options join; string. */ () => {
              commandIndex = i;
              $("commandType").value = command.type;
              fields();
              $("addCommand").textContent = "Update command";
              const values = {
                cmdMap: command.map,
                cmdEntrance: command.entrance,
                cmdOptions: command.options?.join("\n"),
                cmdConditionType: command.condition?.type,
                cmdOperation: command.operation,
                cmdNumber: command.condition?.value ?? command.value,
                cmdText: command.text,
                cmdKey: command.condition?.key ?? command.key,
                cmdValue: String(command.value),
                cmdItem: command.item,
                cmdAmount: command.amount,
                cmdSeconds: command.seconds,
                cmdX: command.x,
                cmdY: command.y,
              };
              for (const [id, value] of Object.entries(values))
                if ($(id) && value !== undefined) {
                  $(id).value = value;
                  if (id === "cmdMap") $(id).onchange?.();
                }
              if ($("cmdDialogue"))
                $("cmdDialogue").checked = !!command.dialogue;
            };
          li.append(edit);
          for (const [label, action] of [
            [
              "↑",
              /* @function editor.callback.17 — Provides the callback for the enclosing editor operation. Inputs: no explicit arguments; uses enclosing module state. Updates: array pattern. */ () => {
                if (i > 0)
                  [page.commands[i - 1], page.commands[i]] = [
                    page.commands[i],
                    page.commands[i - 1],
                  ];
              },
            ],
            [
              "↓",
              /* @function editor.callback.18 — Provides the callback for the enclosing editor operation. Inputs: no explicit arguments; uses enclosing module state. Updates: array pattern. */ () => {
                if (i < page.commands.length - 1)
                  [page.commands[i + 1], page.commands[i]] = [
                    page.commands[i],
                    page.commands[i + 1],
                  ];
              },
            ],
            [
              "Delete",
              /* @function editor.callback.19 — Provides the callback for the enclosing editor operation. Inputs: no explicit arguments; uses enclosing module state. Uses: page commands splice; error. */ () => {
                if (command.type === "branch") {
                  let depth = 0,
                    end = i;
                  for (; end < page.commands.length; end++) {
                    if (page.commands[end].type === "branch") depth++;
                    if (page.commands[end].type === "end" && !--depth) break;
                  }
                  page.commands.splice(i, end - i + 1);
                } else if (command.type === "end")
                  throw Error(
                    "Delete the matching conditional branch to remove its End.",
                  );
                else page.commands.splice(i, 1);
              },
            ],
          ]) {
            const button = document.createElement("button");
            button.textContent = label;
            if (
              ["branch", "else", "end"].includes(command.type) &&
              label !== "Delete"
            ) {
              button.disabled = true;
              button.title =
                "Copy/paste the whole branch to relocate it; structural markers stay paired.";
            }
            button.onclick =
              /* @function editor.onclick.20 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api mutate. Returns: api mutate using a callback, a callback. */ () =>
                api.mutate(
                  /* @function editor.callback.21 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Uses: action. */ () => {
                    action();
                  },
                  /* @function editor.callback.22 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Uses: reset command; refresh. */ () => {
                    resetCommand();
                    refresh();
                  },
                );
            li.append(button);
          }
          list.append(li);
        },
      );
    }
    // Produce a readable command label for the editor list. Add a branch when introducing a command type.
    /* @function editor.summary.23 — Produce a readable command label for the editor list. Add a branch when introducing a command type. Inputs: c. Uses: c options join. Returns: "Travel to " plus c map plus " / " plus c entrance; "Show choices: " plus c options join using " / " plus " → " plus c key. */ function summary(
      c,
    ) {
      if (c.type === "transferMap")
        return "Travel to " + c.map + " / " + c.entrance;
      if (c.type === "choices")
        return "Show choices: " + c.options.join(" / ") + " → " + c.key;
      if (c.type === "branch")
        return (
          "If " +
          c.condition.type +
          " " +
          c.condition.key +
          " " +
          (c.condition.value ?? "ON")
        );
      if (c.type === "else" || c.type === "end")
        return c.type === "else" ? "Else" : "End branch";
      if (c.type === "variable")
        return "Variable " + c.key + " " + c.operation + " " + c.value;
      if (c.type === "journal") return "Journal " + c.key + ": " + c.text;
      if (c.type === "message") return "Show message: " + c.text;
      if (c.type === "selfSwitch" || c.type === "switch")
        return (
          (c.type === "selfSwitch" ? "Self switch " : "Global switch ") +
          c.key +
          " → " +
          (c.value ? "ON" : "OFF")
        );
      if (c.type === "giveItem") return "Give " + c.amount + " × " + c.item;
      if (c.type === "wait") return "Wait " + c.seconds + " seconds";
      return "Transfer to " + c.x + ", " + c.y;
    }
    // Create the controls needed by the selected command type; these values are converted and validated on apply.
    /* @function editor.fields.24 — Create the controls needed by the selected command type; these values are converted and validated on apply. Inputs: no explicit arguments; uses enclosing module state. Updates: map select id; map select value; entrance id; map select onchange; label inner html. Uses: $; holder replace children; input; api maps. */ function fields() {
      const type = $("commandType").value,
        holder = $("commandFields");
      holder.replaceChildren();
      // Build a labeled form control for the current command, keeping IDs aligned with addCommand.
      /* @function editor.input.25 — Build a labeled form control for the current command, keeping IDs aligned with addCommand. Inputs: id; label; value; assignment pattern. Updates: l text content; e id; e type; e value. Uses: document create element; l append; holder append. */ function input(
        id,
        label,
        value,
        kind = "text",
      ) {
        const l = document.createElement("label"),
          e = document.createElement(
            kind === "textarea" ? "textarea" : "input",
          );
        l.textContent = label;
        e.id = id;
        if (kind !== "textarea") e.type = kind;
        e.value = value;
        l.append(e);
        holder.append(l);
      }
      if (type === "transferMap") {
        input("cmdMap", "Destination map", "room-test");
        input("cmdEntrance", "Arrival entrance", "entry");
        const maps = api.maps?.() || [];
        if (maps.length) {
          const mapSelect = document.createElement("select");
          mapSelect.id = "cmdMap";
          for (const m of maps) mapSelect.append(new Option(m.name, m.id));
          mapSelect.value = maps.some(
            /* @function editor.callback.26 — Returns m id equals "room-test". Inputs: m. Returns: m id equals "room-test". */ (
              m,
            ) => m.id === "room-test",
          )
            ? "room-test"
            : maps[0].id;
          $("cmdMap").replaceWith(mapSelect);
          const entrance = document.createElement("select");
          entrance.id = "cmdEntrance";
          $("cmdEntrance").replaceWith(entrance);
          const update =
            /* @function editor.update.27 — Advances this system using the current state and elapsed time. Inputs: no explicit arguments; uses enclosing module state. Updates: entrance value. Uses: maps find; entrance replace children; chain or chain or a list of map; a list of spread element some. */ () => {
              const m = maps.find(
                /* @function editor.callback.28 — Returns m id equals map select value. Inputs: m. Returns: m id equals map select value. */ (
                  m,
                ) => m.id === mapSelect.value,
              );
              entrance.replaceChildren(
                new Option("Map spawn", "spawn"),
                ...(
                  m?.world.interior?.entrances ||
                  m?.world.travel?.entrances ||
                  []
                ).map(
                  /* @function editor.callback.29 — Returns a new option. Inputs: e. Returns: a new option. */ (
                    e,
                  ) => new Option(e.name || e.id, e.id),
                ),
              );
              if (
                [...entrance.options].some(
                  /* @function editor.callback.30 — Returns o value equals "entry". Inputs: o. Returns: o value equals "entry". */ (
                    o,
                  ) => o.value === "entry",
                )
              )
                entrance.value = "entry";
            };
          mapSelect.onchange = update;
          update();
        }
      }

      if (type === "variable") {
        input("cmdKey", "Variable name", "progress");
        input("cmdOperation", "Operation (set or add)", "set");
        input("cmdNumber", "Value", 1, "number");
      }
      if (type === "journal") {
        input("cmdKey", "Journal entry key", "quest");
        input("cmdText", "Journal text", "", "textarea");
      }
      if (type === "message") {
        input("cmdText", "Dialogue text", "Hello, wanderer.", "textarea");
        const label = document.createElement("label");
        label.innerHTML =
          '<input id="cmdDialogue" type="checkbox" checked> Conversation (wait for Continue)';
        holder.append(label);
      }
      if (type === "choices") {
        input("cmdKey", "Result variable (1-based choice index)", "answer");
        input("cmdOptions", "Choices, one per line", "Yes\nNo", "textarea");
      }
      if (type === "branch") {
        input("cmdConditionType", "Condition", "variable");
        const old = $("cmdConditionType"),
          select = document.createElement("select");
        select.id = old.id;
        for (const k of ["switch", "selfSwitch", "variable", "item"])
          select.append(new Option(k, k));
        select.value = "variable";
        old.replaceWith(select);
        input("cmdKey", "Condition key", "answer");
        input("cmdNumber", "Minimum value", 2, "number");
      }
      if (type === "selfSwitch" || type === "switch") {
        input("cmdKey", "Switch key", type === "selfSwitch" ? "A" : "opened");
        const l = document.createElement("label"),
          s = document.createElement("select");
        l.textContent = "Value";
        s.id = "cmdValue";
        s.append(new Option("ON", "true"), new Option("OFF", "false"));
        l.append(s);
        holder.append(l);
      }
      if (type === "giveItem") {
        input("cmdItem", "Item ID (ammo9 adds reserve rounds)", "ammo9");
        input("cmdAmount", "Amount", "12", "number");
      }
      if (type === "wait") input("cmdSeconds", "Seconds", "1", "number");
      if (type === "transfer") {
        input("cmdX", "Destination X", "24", "number");
        input("cmdY", "Destination Y", "24", "number");
      }
    }
    $("selection").onchange =
      /* @function editor.onchange.31 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: choose; $. Returns: choose using $ using "selection" value. */ () =>
        choose($("selection").value);
    $("eventPage").onchange =
      /* @function editor.onchange.32 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: page index. Uses: number; $; workbench reset selection; reset command. */ () => {
        pageIndex = Number($("eventPage").value);
        workbench.resetSelection();
        resetCommand();
        refresh();
        api.preview();
      };
    $("applyPosition").onclick =
      /* @function editor.onclick.33 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: selected; number; $; api mutate. */ () => {
        const e = selected();
        if (e) {
          const x = Number($("objectX").value),
            y = Number($("objectY").value),
            elevation = Number($("objectElevation").value);
          api.mutate(
            /* @function editor.callback.34 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e x; e y; e elevation. */ () => {
              e.x = x;
              e.y = y;
              e.elevation = elevation;
            },
            refresh,
          );
        }
      };
    $("deleteSelected").onclick =
      /* @function editor.onclick.35 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: selected; api remove. */ () => {
        if (selected()) api.remove(selectedId);
      };
    // Serialize page controls back into authored data through the application's validation/undo transaction.
    $("savePage").onclick =
      /* @function editor.onclick.36 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: selected; api mutate. Returns: without a result. */ () => {
        const e = selected();
        if (!e?.pages) return;
        api.mutate(
          /* @function editor.callback.37 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e x; e y; e height; e height offset; e movement mode. Uses: $; number; json parse; frontier parser compile. */ () => {
            if ($("draftEventX")) {
              e.x = Number($("draftEventX").value);
              e.y = Number($("draftEventY").value);
              e.height = Number($("draftHeight").value);
              e.heightOffset = Number($("draftOffset").value);
              e.movementMode = $("draftFlight").value;
            }
            e.topics = JSON.parse($("eventTopics").value || "[]");
            FrontierParser.compile(e.topics);
            e.spriteProfile = $("eventSprite").value;
            e.combatNote = $("eventCombat").value;
            e.name = $("eventName").value;
            e.range = Math.max(
              0.5,
              Math.min(5, Number($("eventRange").value) * 0.3),
            );
            e.activity = $("eventActivity").value;
            e.inspection = $("inspectionText").value;
            const p = e.pages[pageIndex];
            p.name = $("pageName").value;
            p.graphic = $("pageGraphic").value;
            p.trigger = $("pageTrigger").value;
            p.solid = $("pageSolid").checked;
            p.movement = $("pageMovement").value;
            p.through = $("pageThrough").checked;
            p.condition = {
              type: $("pageCondition").value,
              key:
                $("pageCondition").value === "always"
                  ? ""
                  : $("conditionKey").value,
              ...(["variable", "item"].includes($("pageCondition").value)
                ? {
                    value: Number($("conditionValue").value),
                  }
                : {}),
            };
            p.conditions = $("additionalConditions")
              .value.split(/\n/)
              .filter(
                /* @function editor.callback.38 — Returns s trim using . Inputs: s. Uses: s trim. Returns: s trim using . */ (
                  s,
                ) => s.trim(),
              )
              .map(
                /* @function editor.callback.39 — Provides the callback for $ using "additionalConditions" value split using /\n/ filter using a callback map. Inputs: s. Uses: s trim using split; s trim; a list of "variable", "item" includes; number. Returns: a record containing type, key, copied fields. */ (
                  s,
                ) => {
                  const [type, key, value] = s.trim().split(":");
                  return {
                    type,
                    key,
                    ...(["variable", "item"].includes(type)
                      ? {
                          value: Number(value),
                        }
                      : {}),
                  };
                },
              );
          },
          refresh,
        );
      };
    // Deep-copy page commands/conditions; a shallow copy would make edits affect both pages.
    $("copyPage").onclick =
      /* @function editor.onclick.40 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "eventEditorStatus" text content. Uses: selected; structured clone; candidate pages splice; frontier events validate. Returns: without a result; without a result. */ () => {
        const e = selected();
        if (!e?.pages) return;
        // Page count has no fixed cap; preflight the shared serialized-data budgets.
        const candidate = structuredClone(e);
        candidate.pages.splice(
          pageIndex + 1,
          0,
          structuredClone(candidate.pages[pageIndex]),
        );
        try {
          FrontierEvents.validate([candidate]);
        } catch (error) {
          $("eventEditorStatus").textContent = error.message;
          return;
        }
        api.mutate(
          /* @function editor.callback.41 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: p name. Uses: structured clone; e pages splice. */ () => {
            const p = structuredClone(e.pages[pageIndex]);
            p.name += " copy";
            e.pages.splice(pageIndex + 1, 0, p);
            pageIndex++;
          },
          refresh,
        );
      };
    $("addPage").onclick =
      /* @function editor.onclick.42 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: selected; api mutate. Returns: without a result. */ () => {
        const e = selected();
        if (!e?.pages) return;
        api.mutate(
          /* @function editor.callback.43 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: page index. Uses: e pages push; frontier events page. */ () => {
            e.pages.push(FrontierEvents.page("Page " + (e.pages.length + 1)));
            pageIndex = e.pages.length - 1;
          },
          refresh,
        );
      };
    $("removePage").onclick =
      /* @function editor.onclick.44 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: selected; api mutate. Returns: without a result. */ () => {
        const e = selected();
        if (!e?.pages || e.pages.length < 2) return;
        api.mutate(
          /* @function editor.callback.45 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: page index. Uses: e pages splice. */ () => {
            e.pages.splice(pageIndex, 1);
            pageIndex = Math.min(pageIndex, e.pages.length - 1);
          },
          refresh,
        );
      };
    $("commandType").onchange = resetCommand;
    // Build a whitelisted command from typed fields; validation in events.js rejects unsupported values.
    $("addCommand").onclick =
      /* @function editor.onclick.46 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: command map; command entrance; command key; command operation; command value. Uses: selected; $; number; $ using "cmdOptions" value split using /\n/ map using a callback filter. Returns: without a result. */ () => {
        const e = selected();
        if (!e?.pages) return;
        const type = $("commandType").value,
          inserting = commandIndex === null;
        let command = {
          type,
        };
        if (type === "transferMap") {
          command.map = $("cmdMap").value;
          command.entrance = $("cmdEntrance").value;
        }
        if (type === "variable") {
          command.key = $("cmdKey").value;
          command.operation = $("cmdOperation").value;
          command.value = Number($("cmdNumber").value);
        }
        if (type === "journal") {
          command.key = $("cmdKey").value;
          command.text = $("cmdText").value;
        }
        if (type === "message") {
          command.text = $("cmdText").value;
          command.dialogue = $("cmdDialogue").checked;
        }
        if (type === "choices") {
          command.key = $("cmdKey").value;
          command.options = $("cmdOptions")
            .value.split(/\n/)
            .map(
              /* @function editor.callback.47 — Returns s trim using . Inputs: s. Uses: s trim. Returns: s trim using . */ (
                s,
              ) => s.trim(),
            )
            .filter(Boolean);
        }
        if (type === "branch") {
          command.condition = {
            type: $("cmdConditionType").value,
            key: $("cmdKey").value,
            ...(["variable", "item"].includes($("cmdConditionType").value)
              ? { value: Number($("cmdNumber").value) }
              : {}),
          };
        }
        if (type === "selfSwitch" || type === "switch") {
          command.key = $("cmdKey").value;
          command.value = $("cmdValue").value === "true";
        }
        if (type === "giveItem") {
          command.item = $("cmdItem").value;
          command.amount = Number($("cmdAmount").value);
        }
        if (type === "wait") command.seconds = Number($("cmdSeconds").value);
        if (type === "transfer") {
          command.x = Number($("cmdX").value);
          command.y = Number($("cmdY").value);
        }
        api.mutate(
          /* @function editor.callback.48 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e pages at page index commands at command index. Uses: workbench selected index; e pages at page index commands splice. */ () => {
            if (commandIndex === null) {
              const i = workbench.selectedIndex();
              e.pages[pageIndex].commands.splice(
                i < 0 ? e.pages[pageIndex].commands.length : i,
                0,
                command,
                ...(type === "branch" ? [{ type: "end" }] : []),
              );
            } else e.pages[pageIndex].commands[commandIndex] = command;
          },
          /* @function editor.callback.49 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Uses: reset command; refresh; workbench advance selection. */ () => {
            resetCommand();
            refresh();
            if (inserting)
              workbench.advanceSelection(type === "branch" ? 2 : 1);
          },
        );
      };
    fields();
    const workbench = FrontierWorkbench.create({
      api,
      selected,
      refresh,
      choose,
      page: /* @function editor.page.50 — Returns page index. Inputs: no explicit arguments; uses enclosing module state. Returns: page index. */ () =>
        pageIndex,
      setPage:
        /* @function editor.setPage.51 — Handles set page within editor. Inputs: i. Updates: page index. Uses: workbench reset selection; reset command; refresh; api preview. */ (
          i,
        ) => {
          workbench.resetSelection();
          pageIndex = i;
          resetCommand();
          refresh();
          api.preview();
        },
    });
    /* @function editor.discardDraft.52 — Handles discard draft within editor. Inputs: no explicit arguments; uses enclosing module state. Updates: draft world; draft id. Uses: refresh. */ function discardDraft() {
      draftWorld = null;
      draftId = "";
      refresh();
    }
    /* @function editor.beginDraft.53 — Handles begin draft within editor. Inputs: event; assignment pattern. Updates: draft world; draft id; draft valid; draft world events at index; $ using "eventEditorStatus" text content. Uses: structured clone; authored api world; draft world events find index; draft world events push. Returns: without a result. */ function beginDraft(
      event,
      isNew = false,
    ) {
      if (!event?.pages) return;
      draftWorld = structuredClone(authoredApi.world());
      draftId = event.id;
      draftValid = true;
      const index = draftWorld.events.findIndex(
        /* @function editor.callback.54 — Returns e id equals event id. Inputs: e. Returns: e id equals event id. */ (
          e,
        ) => e.id === event.id,
      );
      if (index < 0) draftWorld.events.push(structuredClone(event));
      else draftWorld.events[index] = structuredClone(event);
      choose(event.id);
      workbench.open();
      $("eventEditorStatus").textContent =
        "Unsaved event draft. Apply saves all changes; Cancel discards them.";
    }
    /* @function editor.applyDraft.55 — Handles apply draft within editor. Inputs: assignment pattern. Updates: draft valid; draft world; draft id; $ using "eventEditorStatus" text content. Uses: $ using "addCommand" onclick; $; $ using "savePage" onclick; structured clone. Returns: without a result; without a result. */ function applyDraft(
      play = false,
    ) {
      if (!draftWorld) return;
      draftValid = true;
      if (commandIndex !== null) {
        $("addCommand").onclick();
        if (!draftValid) return;
      }
      $("savePage").onclick();
      if (!draftValid) return;
      const incoming = structuredClone(selected());
      try {
        const checked = FrontierWorld.validate(draftWorld).events.find(
          /* @function editor.callback.56 — Returns e id equals incoming id. Inputs: e. Returns: e id equals incoming id. */ (
            e,
          ) => e.id === incoming.id,
        );
        for (const page of checked.pages)
          for (const command of page.commands)
            if (command.type === "transferMap") {
              const dest = api
                .maps?.()
                .find(
                  /* @function editor.callback.57 — Returns m id equals command map. Inputs: m. Returns: m id equals command map. */ (
                    m,
                  ) => m.id === command.map,
                );
              if (
                !dest ||
                (command.entrance !== "spawn" &&
                  !(
                    dest.world.interior?.entrances ||
                    dest.world.travel?.entrances ||
                    []
                  ).some(
                    /* @function editor.callback.58 — Returns e id equals command entrance. Inputs: e. Returns: e id equals command entrance. */ (
                      e,
                    ) => e.id === command.entrance,
                  ))
              )
                throw Error("Choose an existing map and arrival entrance.");
            }
        const id = checked.id;
        draftWorld = null;
        draftId = "";
        $("eventWorkbench").close();
        authoredApi.mutate(
          /* @function editor.callback.59 — Provides the callback for authored api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: list at index. Uses: authored api world; list find index; list push. */ () => {
            const list = authoredApi.world().events,
              index = list.findIndex(
                /* @function editor.callback.60 — Returns e id equals id. Inputs: e. Returns: e id equals id. */ (
                  e,
                ) => e.id === id,
              );
            if (index < 0) list.push(checked);
            else list[index] = checked;
          },
          /* @function editor.callback.61 — Returns choose using id. Inputs: no explicit arguments; uses enclosing module state. Uses: choose. Returns: choose using id. */ () =>
            choose(id),
        );
        if (play) $("testEvent").click();
      } catch (error) {
        $("eventEditorStatus").textContent = error.message;
      }
    }
    $("openEventEditor").onclick =
      /* @function editor.onclick.62 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: begin draft; selected. Returns: begin draft using selected using . */ () =>
        beginDraft(selected());
    $("eventWorkbench").addEventListener("close", discardDraft);
    $("closeEventWindow").textContent = "Cancel";
    const footer = document.createElement("footer");
    footer.className = "eventDraftFooter";
    footer.innerHTML =
      '<button id="applyEventDraft">Apply event</button><button id="applyPlayEventDraft">Apply and playtest</button><button id="cancelEventDraft">Cancel</button>';
    $("eventWorkbench").append(footer);
    $("applyEventDraft").onclick =
      /* @function editor.onclick.63 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: apply draft. Returns: apply draft using . */ () =>
        applyDraft();
    $("applyPlayEventDraft").onclick =
      /* @function editor.onclick.64 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: apply draft. Returns: apply draft using true. */ () =>
        applyDraft(true);
    $("cancelEventDraft").onclick =
      /* @function editor.onclick.65 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: $ using "eventWorkbench" close; $. Returns: $ using "eventWorkbench" close using . */ () =>
        $("eventWorkbench").close();
    const placement = document.createElement("fieldset");
    placement.innerHTML =
      '<legend>Placement and height</legend><label>Map X<input id="draftEventX" type="number" step="0.01"></label><label>Map Y<input id="draftEventY" type="number" step="0.01"></label><label>Visible height (world units)<input id="draftHeight" type="number" min="0.1" max="20" step="0.05"></label><label>Elevation offset (world units)<input id="draftOffset" type="number" min="-30" max="30" step="0.05"></label><label>Height behavior<select id="draftFlight"><option value="grounded">Follow ground height</option><option value="flying">Flying: maintain starting altitude</option></select></label><p>Flying altitude starts at the placed terrain height plus the offset. Through controls collision during movement.</p>';
    $("eventProperties").prepend(placement);
    const preset = document.createElement("label");
    preset.textContent = "Event starting point";
    const presets = document.createElement("select");
    presets.id = "eventPreset";
    presets.append(
      new Option("Choose a starting point", ""),
      ...[
        "NPC dialogue",
        "Pickup",
        "Scenery",
        "Door",
        "Map transition",
        "Enemy",
        "Quest interaction",
        "Scripted sequence",
      ].map(
        /* @function editor.callback.66 — Returns a new option. Inputs: name. Returns: a new option. */ (
          name,
        ) => new Option(name, name),
      ),
    );
    preset.append(presets);
    placement.before(preset);
    presets.onchange =
      /* @function editor.onchange.67 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: presets value. Uses: api mutate. Returns: without a result. */ () => {
        const kind = presets.value;
        if (!kind || !draftWorld) return;
        api.mutate(
          /* @function editor.callback.68 — Provides the callback for api mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e combat note; e pages; p commands; p movement; p priority. Uses: selected; frontier events page; e pages push. */ () => {
            const e = selected();
            e.combatNote = "";
            e.pages = [FrontierEvents.page("Page 1")];
            const p = e.pages[0];
            p.commands = [];
            p.movement = "stationary";
            p.priority = "normal";
            p.through = false;
            if (kind === "NPC dialogue")
              p.commands = [
                { type: "message", text: "Hello, wanderer.", dialogue: true },
              ];
            if (kind === "Pickup") {
              p.graphic = "chest";
              p.commands = [
                { type: "giveItem", item: "ammo9", amount: 12 },
                { type: "selfSwitch", key: "A", value: true },
              ];
              const done = FrontierEvents.page("Collected");
              done.graphic = "openChest";
              done.condition = { type: "selfSwitch", key: "A" };
              done.commands = [];
              e.pages.push(done);
            }
            if (kind === "Scenery") {
              p.graphic = "marker";
              p.solid = true;
            }
            if (kind === "Door") {
              p.graphic = "marker";
              p.solid = true;
              p.commands = [{ type: "selfSwitch", key: "A", value: true }];
              const open = FrontierEvents.page("Open");
              open.graphic = "marker";
              open.condition = { type: "selfSwitch", key: "A" };
              open.solid = false;
              open.through = true;
              open.commands = [];
              e.pages.push(open);
            }
            if (kind === "Map transition")
              p.commands = [
                { type: "transferMap", map: "room-test", entrance: "entry" },
              ];
            if (kind === "Enemy") {
              p.solid = true;
              p.movement = "approach";
              e.combatNote =
                "<PhanicomABS: hp=24 attack=melee damage=6 range=1.2>";
            }
            if (kind === "Quest interaction")
              p.commands = [
                {
                  type: "journal",
                  key: "new-quest",
                  text: "A new quest begins.",
                },
                { type: "switch", key: "quest_started", value: true },
              ];
            if (kind === "Scripted sequence") {
              p.trigger = "playerTouch";
              p.commands = [
                {
                  type: "message",
                  text: "The sequence begins.",
                  dialogue: true,
                },
                { type: "wait", seconds: 0.5 },
                { type: "selfSwitch", key: "A", value: true },
              ];
              const done = FrontierEvents.page("Finished");
              done.condition = { type: "selfSwitch", key: "A" };
              done.commands = [];
              e.pages.push(done);
            }
            pageIndex = 0;
          },
          refresh,
        );
        presets.value = "";
      };
    const commandSelector = $("commandType");
    const choices = [...commandSelector.options].map(
      /* @function editor.callback.69 — Returns a record containing value, text. Inputs: o. Returns: a record containing value, text. */ (
        o,
      ) => ({ value: o.value, text: o.textContent }),
    );
    choices.push({ value: "transferMap", text: "Travel to another map" });
    commandSelector.replaceChildren();
    for (const [label, types] of [
      ["Dialogue", ["message", "choices"]],
      [
        "State and quests",
        ["selfSwitch", "switch", "variable", "giveItem", "journal"],
      ],
      ["Flow", ["branch", "else", "end", "wait"]],
      ["Movement", ["transfer", "transferMap"]],
    ]) {
      const group = document.createElement("optgroup");
      group.label = label;
      for (const c of choices.filter(
        /* @function editor.callback.70 — Returns types includes using c value. Inputs: c. Uses: types includes. Returns: types includes using c value. */ (
          c,
        ) => types.includes(c.value),
      ))
        group.append(new Option(c.text, c.value));
      commandSelector.append(group);
    }
    commandSelector.value = "message";
    fields();
    $("eventProperties").addEventListener(
      "change",
      /* @function editor.callback.71 — Provides the callback for $ using "eventProperties" add event listener. Inputs: event. Uses: event target matches; $ using "savePage" onclick; $. */ (
        event,
      ) => {
        if (
          draftWorld &&
          event.target.matches("input,select,textarea") &&
          event.target.id !== "eventPreset"
        )
          $("savePage").onclick();
      },
    );
    const oldReturn = $("returnEventTest").onclick;
    $("returnEventTest").onclick =
      /* @function editor.onclick.72 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: old return; begin draft; selected. */ () => {
        oldReturn();
        beginDraft(selected());
      };
    const profiles = document.createElement("datalist");
    profiles.id = "eventSpriteOptions";
    for (const id of [
      "candy-armed",
      "candy-unarmed",
      ...FrontierMuzzle.profiles.keys(),
    ]) {
      const o = document.createElement("option");
      o.value = id;
      profiles.append(o);
    }
    $("eventSprite").setAttribute("list", profiles.id);
    $("eventProperties").append(profiles);
    $("savePage").textContent = "Update page draft";
    $("testEvent").hidden = true;
    $("placeEventTemplate").hidden = true;
    const note = document.createElement("p");
    note.textContent =
      "Supported: dialogue, choices, switches, variables, inventory, journal, waits, transfers, page conditions, movement and combat notes. Custom routes, animation timelines and arbitrary scripts are not supported.";
    $("eventCommands").append(note);
    const mzEditor = FrontierMZEditor.create({
      api: authoredApi,
      choose,
      selected,
    });
    $("openEventEditor").onclick =
      /* @function editor.onclick.73 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mz editor open. Returns: mz editor open using . */ () =>
        mzEditor.open();
    return {
      openEvent:
        /* @function editor.openEvent.74 — Returns mz editor open using . Inputs: no explicit arguments; uses enclosing module state. Uses: mz editor open. Returns: mz editor open using . */ () =>
          mzEditor.open(),
      beginEvent:
        /* @function editor.beginEvent.75 — Returns mz editor begin using event, is new. Inputs: event; is new. Uses: mz editor begin. Returns: mz editor begin using event, is new. */ (
          event,
          isNew,
        ) => mzEditor.begin(event, isNew),
      duplicateEvent:
        /* @function editor.duplicateEvent.76 — Returns mz editor duplicate using id. Inputs: id. Uses: mz editor duplicate. Returns: mz editor duplicate using id. */ (
          id,
        ) => mzEditor.duplicate(id),
      deleteEvent:
        /* @function editor.deleteEvent.77 — Returns authored api remove using id. Inputs: id. Uses: authored api remove. Returns: authored api remove using id. */ (
          id,
        ) => authoredApi.remove(id),
      choose,
      refresh,
      selected,
      get selectedId /* @function editor.selectedId.78 — Handles selected id within editor. Inputs: no explicit arguments; uses enclosing module state. Returns: selected id. */() {
        return selectedId;
      },
      get pageIndex /* @function editor.pageIndex.79 — Handles page index within editor. Inputs: no explicit arguments; uses enclosing module state. Returns: mz editor page index. */() {
        return mzEditor.pageIndex;
      },
    };
  }
  root.FrontierEditor = {
    create,
  };
})(window);
