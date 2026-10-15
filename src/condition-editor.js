/* Advanced expression authoring is separate from the baseline MZ dialog.
 * A private JSON draft is committed once after the shared validator accepts it.
 * Extension presenters register independently of validation/evaluation. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function condition-editor.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier condition editor. */
(/* @function condition-editor.installReviewed — Installs advanced condition-expression authoring and extension presenters. Shared validation/evaluation own execution; the private JSON draft commits only on accepted Apply. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  const presenters = new Map(),
    labels = {
      all: "All (AND)",
      any: "Any (OR)",
      not: "Not",
      compare: "Compare values",
      switch: "Switch",
      selfSwitch: "Self switch",
      item: "Item quantity",
      actor: "Actor in party",
      quest: "Quest state",
      distance: "Distance",
      timer: "Timer",
      gold: "Gold",
      skill: "Player skill",
      reputation: "Faction / settlement reputation",
      faction: "Faction membership",
    };
  /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.register.2 — Handles register within condition editor. Inputs: type; presenter; create. Updates: labels at type. Uses: presenters has; root frontier conditions types using includes; root frontier conditions types; error. */
  /* @function conditionEditor.reviewedregister_2 — Registers UI presenter for already registered condition kind. Inputs: type, render presenter and optional default factory create. Returns undefined; rejects duplicate/unregistered type or invalid callbacks, stores presenter and exposes new label when factory supplied. No evaluator registration or gameplay mutation. */ function register(
    type,
    presenter,
    create,
  ) {
    if (
      presenters.has(type) ||
      typeof presenter !== "function" ||
      (create !== undefined && typeof create !== "function") ||
      !root.FrontierConditions.types().includes(type)
    )
      throw Error("Invalid condition presenter.");
    presenters.set(type, { render: presenter, create });
    if (create) labels[type] = type;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.defaults.3 — Handles defaults within condition editor. Inputs: type. Uses: presenters get using type create; presenters get. Returns: a record containing all, any, not, compare, switch, selfSwitch, item, actor at type or chain. */
  /* @function conditionEditor.revieweddefaults_3 — Creates new draft expression by kind. Inputs: type. Returns independent builtin default or extension factory result, undefined absent factory. No validation here; open/mutate/OK validate. Factory errors propagate; no source mutation. */ function defaults(
    type,
  ) {
    return (
      {
        all: { type, children: [] },
        any: { type, children: [] },
        not: { type, child: { type: "switch", key: "1", value: true } },
        compare: {
          type,
          operator: "eq",
          left: { kind: "variable", key: "1" },
          right: { kind: "constant", value: 0 },
        },
        switch: { type, key: "1", value: true },
        selfSwitch: { type, key: "A", value: true },
        item: { type, key: "item-1", count: 1 },
        actor: { type, key: "1", value: true },
        quest: { type, key: "quest-1", value: true },
        distance: { type, target: "player", radius: 2 },
        timer: { type, seconds: 0, operator: "ge" },
        gold: { type, amount: 0, operator: "ge" },
        skill: { type, key: "speech", operator: "ge", value: 35 },
        reputation: { type, key: "town", operator: "ge", value: 0 },
        faction: { type, key: "guards", value: true },
      }[type] || presenters.get(type)?.create?.()
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.open.4 — Handles open within condition editor. Inputs: initial; accept. Updates: d id; d class name; title text content; status role; d onclose. Uses: root frontier conditions validate; defaults; document create element; d append. */
  /* @function conditionEditor.reviewedopen_4 — Opens modal for independent validated expression draft. Inputs: initial expression and synchronous accept callback. Returns undefined; validates/clones before DOM construction, installs recursive controls and OK/Cancel/close handlers, renders/focuses. Only successful OK invokes accept; Cancel/Escape discards private draft. Validation/setup errors propagate; no direct authored/runtime mutation. */ function open(
    initial,
    accept,
  ) {
    let draft = root.FrontierConditions.validate(initial || defaults("all"));
    const d = document.createElement("dialog");
    d.id = "advancedConditionEditor";
    d.className = "mzDialog";
    const title = document.createElement("h2");
    title.textContent = "Advanced Condition";
    const tree = document.createElement("section"),
      status = document.createElement("p"),
      footer = document.createElement("footer");
    status.role = "status";
    d.append(title, tree, status, footer);
    const button =
      /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.button.5 — Handles button within condition editor. Inputs: parent; text; fn. Updates: b type; b text content; b onclick. Uses: document create element; parent append. Returns: b. */
  /* @function conditionEditor.reviewedbutton_5 — Adds labelled button with owner callback. Inputs: parent,text,fn. Returns appended DOM button; no callback execution until click or source mutation. DOM failures propagate. */ (
        parent,
        text,
        fn,
      ) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = text;
        b.onclick = fn;
        parent.append(b);
        return b;
      };
    /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.select.6 — Handles select within condition editor. Inputs: parent; label; options; value; change. Updates: l text content; s value; s onchange. Uses: document create element; s set attribute; s append; string. Returns: s. */
  /* @function conditionEditor.reviewedselect_6 — Adds labelled draft selector. Inputs: parent,label,key/text options,value,change callback. Returns select with string value; listener passes selected string. No validation/source adoption itself; callback errors propagate. */ function select(
      parent,
      label,
      options,
      value,
      change,
    ) {
      const l = document.createElement("label");
      l.textContent = label;
      const s = document.createElement("select");
      s.setAttribute("aria-label", label);
      for (const [key, text] of options) s.append(new Option(text, key));
      s.value = String(value);
      s.onchange =
        /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.onchange.7 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: change. Returns: change using s value. */
  /* @function conditionEditor.reviewedonchange_7 — Forwards draft selector string. Inputs: ignored change event. Returns change(s.value) result; callback owns draft update. No source commit. */ () =>
          change(s.value);
      l.append(s);
      parent.append(l);
      return s;
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.input.8 — Handles input within condition editor. Inputs: parent; label; value; change; assignment pattern. Updates: l text content; i type; i value; i step; i oninput. Uses: document create element; i set attribute; l append; parent append. Returns: i. */
  /* @function conditionEditor.reviewedinput_8 — Adds labelled text/numeric draft input. Inputs: parent,label,value,change,numeric flag. Returns input with step any; listener passes numeric coercion or string. No range enforcement; OK/shared validator owns acceptance. */ function input(
      parent,
      label,
      value,
      change,
      numeric = false,
    ) {
      const l = document.createElement("label");
      l.textContent = label;
      const i = document.createElement("input");
      i.setAttribute("aria-label", label);
      i.type = numeric ? "number" : "text";
      i.value = value;
      i.step = "any";
      i.oninput =
        /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.oninput.9 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Uses: change. Returns: change using numeric selects + i value or i value. */
  /* @function conditionEditor.reviewedoninput_9 — Forwards current draft field. Inputs: ignored input event. Returns change result with Number-like unary+ for numeric or text string. Empty numeric becomes0; invalid number may beNaN and rejected later. No source commit. */ () =>
          change(numeric ? +i.value : i.value);
      l.append(i);
      parent.append(l);
      return i;
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.mutate.10 — Handles mutate within condition editor. Inputs: fn. Updates: status text content; draft. Uses: structured clone; fn; root frontier conditions validate; render. */
  /* @function conditionEditor.reviewedmutate_10 — Applies structural draft edit with validation/rollback. Inputs: fn callback. Returns undefined; snapshots draft, invokes fn, validates and rerenders on success; catches errors, replaces draft with before snapshot and displays message. Does not rerender after failure, so DOM references may point at old objects until next render. No owner commit; snapshot clone failure before try propagates. */ function mutate(
      fn,
    ) {
      const before = structuredClone(draft);
      try {
        fn();
        root.FrontierConditions.validate(draft);
        status.textContent = "";
        render();
      } catch (e) {
        draft = before;
        status.textContent = e.message;
      }
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.scalar.11 — Handles scalar within condition editor. Inputs: parent; label; object; key. Uses: document create element; wrap append; object assign; parent append. */
  /* @function conditionEditor.reviewedscalar_11 — Builds primitive expected-value controls. Inputs: parent,label,draft object,key. Returns undefined; shows type and appropriate value field, edits only private draft, type switch resets value and rerenders. No validation until structural/OK boundary; DOM errors propagate. */ function scalar(
      parent,
      label,
      object,
      key,
    ) {
      const wrap = document.createElement("fieldset");
      wrap.append(
        Object.assign(document.createElement("legend"), { textContent: label }),
      );
      parent.append(wrap);
      const kind = typeof object[key];
      select(
        wrap,
        "Value type",
        [
          ["number", "Number"],
          ["string", "Text"],
          ["boolean", "Boolean"],
        ],
        kind,
        /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.12 — Provides the callback for select. Inputs: type. Updates: object at key. Uses: render. */
  /* @function conditionEditor.reviewedcallback_12 — Changes primitive draft value type. Inputs: selected type string. Returns undefined; writes0/true/empty string into object[key], rerenders. No authored mutation; validated selectable types assumed. */ (
          type,
        ) => {
          object[key] = type === "number" ? 0 : type === "boolean" ? true : "";
          render();
        },
      );
      if (kind === "boolean")
        select(
          wrap,
          "Value",
          [
            [true, "True"],
            [false, "False"],
          ],
          object[key],
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.13 — Returns assignment. Inputs: v. Updates: object at key. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_13 — Stores boolean draft value. Inputs: selected v string. Returns assigned boolean(v==true string); private object[key] only. */ (
            v,
          ) => (object[key] = v === "true"),
        );
      else
        input(
          wrap,
          "Value",
          object[key],
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.14 — Returns assignment. Inputs: v. Updates: object at key. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_14 — Stores primitive draft field value. Inputs: v number/string. Returns assigned object[key]; no source commit or validation. */ (
            v,
          ) => (object[key] = v),
          kind === "number",
        );
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.operand.15 — Handles operand within condition editor. Inputs: parent; label; object; key. Uses: document create element; box append; object assign; parent append. */
  /* @function conditionEditor.reviewedoperand_15 — Builds comparison operand controls. Inputs: parent,label,draft object,key. Returns undefined; chooses constant/variable, then scalar or variable-ID editor. Only private draft changes, shared validator owns bounds. */ function operand(
      parent,
      label,
      object,
      key,
    ) {
      const v = object[key],
        box = document.createElement("fieldset");
      box.append(
        Object.assign(document.createElement("legend"), { textContent: label }),
      );
      parent.append(box);
      select(
        box,
        "Operand",
        [
          ["constant", "Constant"],
          ["variable", "Variable"],
        ],
        v.kind,
        /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.16 — Provides the callback for select. Inputs: kind. Updates: object at key. Uses: render. */
  /* @function conditionEditor.reviewedcallback_16 — Replaces draft operand kind. Inputs: kind string. Returns undefined; assigns variable key1 or constant0 and rerenders. No source adoption. */ (
          kind,
        ) => {
          object[key] =
            kind === "variable" ? { kind, key: "1" } : { kind, value: 0 };
          render();
        },
      );
      if (v.kind === "variable")
        input(
          box,
          "Variable key",
          v.key,
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.17 — Returns assignment. Inputs: x. Updates: v key. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_17 — Stores draft variable key. Inputs: x string. Returns assigned v.key; validated at OK, no source commit. */ (
            x,
          ) => (v.key = x),
        );
      else scalar(box, "Constant", v, "value");
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.node.18 — Handles node within condition editor. Inputs: parent; e; replace; path. Updates: box dataset condition path; note text content; box query selector using "select" disabled. Uses: document create element; parent append; select; object entries. */
  /* @function conditionEditor.reviewednode_18 — Recursively renders one condition draft node. Inputs: parent,e,replace callback and UI path string. Returns undefined; creates kind selector and group/not/compare/state/spatial/timer/gold controls, structural operations use mutate. Registered extension presenter receives helper functions; unknown presenter leaves extension preserved/read-only. No evaluation/owner commit; assumes bounded validated tree, DOM/presenter errors propagate. */ function node(
      parent,
      e,
      replace,
      path,
    ) {
      const box = document.createElement("fieldset");
      box.dataset.conditionPath = path;
      parent.append(box);
      select(
        box,
        "Condition type",
        [
          ...Object.entries(labels),
          ...(!labels[e.type] ? [[e.type, e.type]] : []),
        ],
        e.type,
        /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.19 — Returns mutate using a callback. Inputs: type. Uses: mutate. Returns: mutate using a callback. */
  /* @function conditionEditor.reviewedcallback_19 — Requests validated structural kind replacement. Inputs: type. Returns mutate result(undefined); private draft only, failure displayed. */ (
          type,
        ) =>
          mutate(
            /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.20 — Returns replace using a record containing copied fields, copied fields. Inputs: no explicit arguments; uses enclosing module state. Uses: replace; defaults; structured clone. Returns: replace using a record containing copied fields, copied fields. */
  /* @function conditionEditor.reviewedcallback_20 — Replaces current draft node with chosen defaults preserving extension data. Inputs: none. Returns replace result; clones old extensions if truthy. Outer mutate validates/rolls back, no source adoption. */ () =>
              replace({
                ...defaults(type),
                ...(e.extensions
                  ? { extensions: structuredClone(e.extensions) }
                  : {}),
              }),
          ),
      );
      if (e.type === "all" || e.type === "any") {
        const note = document.createElement("p");
        note.textContent =
          e.type === "all"
            ? "Every child must pass. An empty group passes."
            : "At least one child must pass. An empty group fails.";
        box.append(note);
        e.children.forEach(
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.21 — Provides the callback for e children for each. Inputs: child; i. Uses: document create element; box append; node; button. */
  /* @function conditionEditor.reviewedcallback_21 — Builds child-node controls and reorder/remove actions. Inputs: child,index i. Returns undefined; appends recursive row using UI path, no source commit. */ (
            child,
            i,
          ) => {
            const row = document.createElement("section");
            box.append(row);
            node(
              row,
              child,
              /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.22 — Returns assignment. Inputs: v. Updates: e children at i. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_22 — Replaces child within private group draft. Inputs: v. Returns assigned e.children[i]; outer structural mutation validates. */ (
                v,
              ) => (e.children[i] = v),
              path + "." + i,
            );
            button(
              row,
              "Remove condition",
              /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.23 — Returns mutate using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */
  /* @function conditionEditor.reviewedcallback_23 — Requests draft child removal. Inputs: ignored click. Returns mutate result; no authored change. */ () =>
                mutate(
                  /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.24 — Returns e children splice using i, 1. Inputs: no explicit arguments; uses enclosing module state. Uses: e children splice. Returns: e children splice using i, 1. */
  /* @function conditionEditor.reviewedcallback_24 — Removes one private group child. Inputs: none. Returns splice removed-array; outer mutate validates/rolls back. */ () =>
                    e.children.splice(i, 1),
                ),
            );
            if (i)
              button(
                row,
                "Move up",
                /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.25 — Returns mutate using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */
  /* @function conditionEditor.reviewedcallback_25 — Requests draft child move-up. Inputs: ignored click. Returns mutate result; no source adoption. */ () =>
                  mutate(
                    /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.26 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: array pattern. */
  /* @function conditionEditor.reviewedcallback_26 — Swaps adjacent private group children. Inputs: none. Returns undefined; local e.children indicesi-1/i swapped inside validated mutate. No authored change. */ () => {
                      [e.children[i - 1], e.children[i]] = [
                        e.children[i],
                        e.children[i - 1],
                      ];
                    },
                  ),
              );
          },
        );
        button(
          box,
          "Add condition",
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.27 — Returns mutate using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */
  /* @function conditionEditor.reviewedcallback_27 — Requests default child addition. Inputs: ignored click. Returns mutate result; bounds checked by expression validator. */ () =>
            mutate(
              /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.28 — Returns e children push using defaults using "switch". Inputs: no explicit arguments; uses enclosing module state. Uses: e children push; defaults. Returns: e children push using defaults using "switch". */
  /* @function conditionEditor.reviewedcallback_28 — Appends default switch child to private group. Inputs: none. Returns array length; outer mutate validates complexity. */ () =>
                e.children.push(defaults("switch")),
            ),
        );
      } else if (e.type === "not")
        node(
          box,
          e.child,
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.29 — Returns assignment. Inputs: v. Updates: e child. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_29 — Replaces private NOT child. Inputs: v. Returns assigned e.child; outer mutation validates, no source adoption. */ (
            v,
          ) => (e.child = v),
          path + ".not",
        );
      else if (e.type === "compare") {
        operand(box, "Left", e, "left");
        select(
          box,
          "Comparison",
          [
            ["eq", "="],
            ["ne", "≠"],
            ["lt", "<"],
            ["le", "≤"],
            ["gt", ">"],
            ["ge", "≥"],
          ],
          e.operator,
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.30 — Returns assignment. Inputs: v. Updates: e operator. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_30 — Stores draft generic comparison operator. Inputs: v selected enum string. Returns assigned e.operator; validated at OK. */ (
            v,
          ) => (e.operator = v),
        );
        operand(box, "Right", e, "right");
      } else if (
        ["switch", "selfSwitch", "actor", "quest", "item"].includes(e.type)
      ) {
        if (e.type === "selfSwitch")
          select(
            box,
            "Self switch",
            ["A", "B", "C", "D"].map(
              /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.31 — Returns a list of v, v. Inputs: v. Returns: a list of v, v. */
  /* @function conditionEditor.reviewedcallback_31 — Creates self-switch option tuple. Inputs: v A-D. Returns value/label pair; no mutation. */ (
                v,
              ) => [v, v],
            ),
            e.key,
            /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.32 — Returns assignment. Inputs: v. Updates: e key. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_32 — Stores self-switch draft key. Inputs: v A-D string. Returns assigned e.key; no authored change. */ (
              v,
            ) => (e.key = v),
          );
        else
          input(
            box,
            "Key",
            e.key,
            /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.33 — Returns assignment. Inputs: v. Updates: e key. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_33 — Stores named state draft key. Inputs: v string. Returns assigned e.key; bounds checked on OK. */ (
              v,
            ) => (e.key = v),
          );
        if (e.type === "item")
          input(
            box,
            "Minimum quantity",
            e.count,
            /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.34 — Returns assignment. Inputs: v. Updates: e count. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_34 — Stores item quantity draft. Inputs: v numeric. Returns assigned e.count; finite/nonnegative requirement checked on OK. */ (
              v,
            ) => (e.count = v),
            true,
          );
        else if (e.type === "quest") scalar(box, "Expected state", e, "value");
        else
          select(
            box,
            "Required state",
            [
              [true, "ON / present"],
              [false, "OFF / absent"],
            ],
            e.value,
            /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.35 — Returns assignment. Inputs: v. Updates: e value. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_35 — Stores state presence requirement. Inputs: v selected string. Returns assigned boolean e.value; no owner commit. */ (
              v,
            ) => (e.value = v === "true"),
          );
      } else if (e.type === "skill" || e.type === "reputation") {
        input(
          box,
          e.type === "skill" ? "Skill key" : "Faction / settlement key",
          e.key,
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.36 — Returns assignment. Inputs: v. Updates: e key. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_36 — Stores skill/reputation draft ID. Inputs: v string. Returns assigned e.key; validation on OK. */ (
            v,
          ) => (e.key = v),
        );
        select(
          box,
          "Comparison",
          [
            ["eq", "="],
            ["ne", "≠"],
            ["lt", "<"],
            ["le", "≤"],
            ["gt", ">"],
            ["ge", "≥"],
          ],
          e.operator,
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.37 — Returns assignment. Inputs: v. Updates: e operator. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_37 — Stores skill/reputation comparison operator. Inputs: v enum string. Returns assigned e.operator; no state evaluation. */ (
            v,
          ) => (e.operator = v),
        );
        input(
          box,
          "Required value",
          e.value,
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.38 — Returns assignment. Inputs: v. Updates: e value. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_38 — Stores skill/reputation threshold draft. Inputs: v numeric. Returns assigned e.value; magnitude bounds checked on OK. */ (
            v,
          ) => (e.value = v),
          true,
        );
        const note = document.createElement("p");
        note.textContent =
          "An unset value is zero. This check is deterministic; it does not roll randomly.";
        box.append(note);
      } else if (e.type === "faction") {
        input(
          box,
          "Faction key",
          e.key,
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.39 — Returns assignment. Inputs: v. Updates: e key. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_39 — Stores faction draft key. Inputs: v string. Returns assigned e.key; validation on OK. */ (
            v,
          ) => (e.key = v),
        );
        select(
          box,
          "Membership",
          [
            [true, "Member"],
            [false, "Not a member"],
          ],
          e.value,
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.40 — Returns assignment. Inputs: v. Updates: e value. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_40 — Stores faction-membership requirement. Inputs: v selected string. Returns assigned boolean e.value; no gameplay membership mutation. */ (
            v,
          ) => (e.value = v === "true"),
        );
      } else if (e.type === "distance") {
        input(
          box,
          "Target entity ID",
          e.target,
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.41 — Returns assignment. Inputs: v. Updates: e target. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_41 — Stores distance target draft ID. Inputs: v string. Returns assigned e.target; no entity lookup until execution. */ (
            v,
          ) => (e.target = v),
        );
        input(
          box,
          "Maximum distance",
          e.radius,
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.42 — Returns assignment. Inputs: v. Updates: e radius. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_42 — Stores spatial radius draft. Inputs: v metres. Returns assigned e.radius; nonnegative finite validation on OK. */ (
            v,
          ) => (e.radius = v),
          true,
        );
      } else if (e.type === "timer" || e.type === "gold") {
        const key = e.type === "timer" ? "seconds" : "amount";
        input(
          box,
          e.type === "timer" ? "Seconds remaining" : "Amount",
          e[key],
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.43 — Returns assignment. Inputs: v. Updates: e at key. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_43 — Stores timer/gold threshold draft. Inputs: v numeric with captured key seconds/amount. Returns assigned e[key]; respective integer/range validation on OK. */ (
            v,
          ) => (e[key] = v),
          true,
        );
        select(
          box,
          "Comparison",
          e.type === "timer"
            ? [
                ["ge", "≥"],
                ["le", "≤"],
              ]
            : [
                ["ge", "≥"],
                ["le", "≤"],
                ["lt", "<"],
              ],
          e.operator,
          /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.44 — Returns assignment. Inputs: v. Updates: e operator. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_44 — Stores timer/gold comparison draft. Inputs: v selected enum. Returns assigned e.operator; no timer/gold mutation. */ (
            v,
          ) => (e.operator = v),
        );
      } else if (presenters.has(e.type))
        presenters.get(e.type).render(box, e, { input, select, render });
      else {
        box.querySelector("select").disabled = true;
        const note = document.createElement("p");
        note.textContent =
          "Extension condition " +
          e.type +
          " is preserved. Register a dedicated presenter to edit its fields.";
        box.append(note);
      }
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.render.45 — Builds or refreshes the visible representation of this system. Inputs: no explicit arguments; uses enclosing module state. Uses: tree replace children; node. */
  /* @function conditionEditor.reviewedrender_45 — Rebuilds private expression tree controls. Inputs: none. Returns undefined; replaces DOM children and recursively renders draft with root replacement callback. No source commit; DOM/presenter errors propagate. */ function render() {
      tree.replaceChildren();
      node(
        tree,
        draft,
        /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.46 — Returns assignment. Inputs: v. Updates: draft. Returns: assignment. */
  /* @function conditionEditor.reviewedcallback_46 — Replaces private root expression. Inputs: v. Returns assigned draft; no owner adoption until OK. */ (
          v,
        ) => (draft = v),
        "root",
      );
    }
    button(
      footer,
      "OK",
      /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.47 — Provides the callback for button. Inputs: no explicit arguments; uses enclosing module state. Updates: status text content. Uses: accept; root frontier conditions validate; d close. */
  /* @function conditionEditor.reviewedcallback_47 — Validates/commits expression on OK. Inputs: ignored click. Returns undefined; passes detached validated draft to synchronous accept then closes. Catches validation/accept/close errors and displays status while preserving dialog. Owner callback handles authored Undo/persistence; async acceptance unsupported. */ () => {
        try {
          accept(root.FrontierConditions.validate(draft));
          d.close();
        } catch (e) {
          status.textContent = e.message;
        }
      },
    );
    button(
      footer,
      "Cancel",
      /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.callback.48 — Returns d close using . Inputs: no explicit arguments; uses enclosing module state. Uses: d close. Returns: d close using . */
  /* @function conditionEditor.reviewedcallback_48 — Cancels expression authoring. Inputs: ignored click. Returns dialog.close result; does not call accept, private draft discarded on removal. */ () =>
        d.close(),
    );
    d.onclose =
      /* Historical contract retained; October 14 reviewed explanation follows. @function condition-editor.onclose.49 — Releases or restores dialog state after closing. Inputs: no explicit arguments; uses enclosing module state. Uses: d remove. Returns: d remove using . */
  /* @function conditionEditor.reviewedonclose_49 — Removes closed expression modal. Inputs: ignored close event. Returns remove result(undefined); Cancel/Escape do not commit, successful OK already adopted through owner. */ () =>
        d.remove();
    document.body.append(d);
    render();
    d.showModal();
    tree.querySelector("select")?.focus();
  }
  root.FrontierConditionEditor = { register, open, defaults };
})(window);
