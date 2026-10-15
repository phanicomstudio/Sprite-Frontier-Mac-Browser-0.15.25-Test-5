/* Small authored quest fixture, reusable by example maps and acceptance tests.
 * Plain event data uses the same editor/schema/runtime as user-authored events. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function quest-example.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier quest example. */
(/* @function quest-example.installReviewed — Publishes a small reusable authored quest fixture using the normal event schema/editor/runtime. Registration does not secretly grant quest progress or bypass interpreter execution. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  const quest = "courier-letter",
    item = "sealed-letter";
  const change =
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function quest-example.change.2 — Returns a record containing type, domain, key, operation, copied fields. Inputs: domain; key; operation; value. Returns: a record containing type, domain, key, operation, copied fields. */
  /* @function quest-example.change.2Reviewed — Creates a gameplay-state command for the courier fixture. Inputs: state domain, key, operation and optional value. Returns fresh command data; remove omits value while other operations preserve it. Does not execute the command or change quest/session state. */ (
      domain,
      key,
      operation,
      value,
    ) => ({
      type: "gameplayState",
      domain,
      key,
      operation,
      ...(operation === "remove" ? {} : { value }),
    });
  const text =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function quest-example.text.3 — Returns a record containing type, text, dialogue. Inputs: text. Returns: a record containing type, text, dialogue. */
  /* @function quest-example.text.3Reviewed — Creates a dialogue message command for the courier fixture. Inputs: message string. Returns fresh message record with dialogue=true. Does not display text or pause the interpreter until normal runtime execution. */ (
        text,
      ) => ({ type: "message", text, dialogue: true }),
    branch =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function quest-example.branch.4 — Returns a record containing type, condition. Inputs: expression. Returns: a record containing type, condition. */
  /* @function quest-example.branch.4Reviewed — Wraps a condition expression in an authored branch command. Inputs: supported expression data. Returns fresh command wrapper referencing that expression; does not clone or evaluate it. Fixture validation checks the assembled events later. */ (
        expression,
      ) => ({ type: "branch", condition: { type: "expression", expression } });
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function quest-example.events.5 — Handles events within quest example. Inputs: no explicit arguments; uses enclosing module state. Updates: npc name; npc pages at 0 commands; accepted condition; accepted commands; completed condition. Uses: root frontier events create; text; branch; change. Returns: root frontier events validate using a list of npc, chest. */
  /* @function quest-example.events.5Reviewed — Builds and validates fresh courier NPC/container events. Inputs: none. Returns two authored events at horizontal world coordinates 5,5 and 8,5. Pages express acceptance with Speech 35, letter collection/self-switch, reward/reputation and completed state through normal commands. Creates data only, granting no progress/items; schema errors propagate. Caller supplies normal interpreter/session execution. */ function events() {
    const npc = root.FrontierEvents.create("courier-contact", 5, 5);
    npc.name = "Courier contact";
    npc.pages[0].commands = [
      text("Will you retrieve a sealed letter for the town?"),
      {
        type: "choices",
        key: "courier-answer",
        options: ["Not now", "Accept the task"],
      },
      branch({
        type: "compare",
        operator: "eq",
        left: { kind: "variable", key: "courier-answer" },
        right: { kind: "constant", value: 2 },
      }),
      branch({ type: "skill", key: "speech", operator: "ge", value: 35 }),
      change("quest", quest, "set", "accepted"),
      text("You have my trust. Retrieve the sealed letter and return."),
      { type: "else" },
      text("You need Speech 35 before I can trust you with this task."),
      { type: "end" },
      { type: "else" },
      text("Come back when you are ready."),
      { type: "end" },
    ];
    const accepted = root.FrontierEvents.page("Letter requested");
    accepted.condition = {
      type: "expression",
      expression: { type: "quest", key: quest, value: "accepted" },
    };
    accepted.commands = [
      branch({ type: "item", key: item, count: 1 }),
      change("inventory", item, "add", -1),
      change("inventory", "courier-reward", "add", 1),
      change("reputation", "town", "add", 5),
      change("quest", quest, "set", "completed"),
      text(
        "Letter received. Take your reward; the town will remember your help.",
      ),
      { type: "else" },
      text("Bring me the sealed letter to finish the task."),
      { type: "end" },
    ];
    const completed = root.FrontierEvents.page("Task completed");
    completed.condition = {
      type: "expression",
      expression: { type: "quest", key: quest, value: "completed" },
    };
    completed.commands = [
      text("Thank you again. Your reward has already been paid."),
    ];
    npc.pages.push(accepted, completed);
    const chest = root.FrontierEvents.create("courier-container", 8, 5);
    chest.name = "Sealed letter container";
    chest.pages[0].graphic = "chest";
    chest.pages[0].commands = [
      text("Only an appointed courier may collect this letter."),
    ];
    const collect = root.FrontierEvents.page("Letter available");
    collect.graphic = "chest";
    collect.condition = {
      type: "expression",
      expression: { type: "quest", key: quest, value: "accepted" },
    };
    collect.commands = [
      change("inventory", item, "add", 1),
      { type: "selfSwitch", key: "A", value: true },
      text("You collected the sealed letter."),
    ];
    const empty = root.FrontierEvents.page("Container empty");
    empty.graphic = "openChest";
    empty.condition = { type: "selfSwitch", key: "A" };
    empty.commands = [text("The container is empty.")];
    chest.pages.push(collect, empty);
    return root.FrontierEvents.validate([npc, chest]);
  }
  // Allocate identities before building transfer commands; no bundled map is mutated.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function quest-example.maps.6 — Allocate identities before building transfer commands; no bundled map is mutated. Inputs: base; identities. Updates: home events; authored at 1 x; store events; trainer name; trainer pages at 0 commands. Uses: array is array; error; events; blank. Returns: a list of a record containing copied fields, name, world, a record containing copied fields, name, world. */
  /* @function quest-example.maps.6Reviewed — Builds a two-cell courier example using preallocated stable map identities. Inputs: base world and exactly two identity records for hub/archive. Returns named identity records with independently cloned/validated worlds, reciprocal MZ 201 transfers and optional Speech-40 practice commands. Throws for wrong identity count or clone/schema failures. Does not mutate base/maps or start gameplay; inherited base settings remain unless explicitly reset by blank. */ function maps(
    base,
    identities,
  ) {
    if (!Array.isArray(identities) || identities.length !== 2)
      throw Error("Courier example requires two map identities.");
    const [hub, archive] = identities,
      authored = events();
    const blank =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function quest-example.blank.7 — Handles blank within quest example. Inputs: no explicit arguments; uses enclosing module state. Updates: w seed; w spawn; w objects; w events; w terrain. Uses: structured clone; root frontier water validate. Returns: w. */
  /* @function quest-example.blank.7Reviewed — Clones the base world for an empty courier example cell. Inputs: none, captured base. Returns independent world with fixed spawn 5,7/yaw zero, flat terrain, empty objects/events and default water; removes travel, interior and ground material. Other base settings are retained. Does not change the original; clone/water validation failures propagate. */ () => {
        const w = structuredClone(base);
        delete w.travel;
        delete w.interior;
        delete w.groundMaterial;
        w.seed = "courier-example";
        w.spawn = { x: 5, y: 7, yaw: 0 };
        w.objects = [];
        w.events = [];
        w.terrain = {
          mode: "flat",
          amplitude: 0,
          frequency: 0.12,
          edits: {},
          revision: 0,
        };
        w.water = root.FrontierWater.validate();
        return w;
      };
    const home = blank(),
      store = blank();
    home.events = [authored[0]];
    authored[1].x = 5;
    store.events = [authored[1]];
    const trainer = root.FrontierEvents.create("courier-speech-practice", 3, 5);
    trainer.name = "Optional Speech practice";
    trainer.pages[0].commands = [
      text(
        "For this example, set your current Speech to 40? Starting project values stay unchanged.",
      ),
      {
        type: "choices",
        key: "speech-practice-answer",
        options: ["Leave it unchanged", "Practice Speech"],
      },
      branch({
        type: "compare",
        operator: "eq",
        left: { kind: "variable", key: "speech-practice-answer" },
        right: { kind: "constant", value: 2 },
      }),
      change("skill", "speech", "set", 40),
      text("Current Speech is now 40."),
      { type: "end" },
    ];
    home.events.push(trainer);
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function quest-example.gate.8 — Handles gate within quest example. Inputs: name; target. Updates: e name; e pages at 0 commands. Uses: root frontier events create. Returns: e. */
  /* @function quest-example.gate.8Reviewed — Creates one courier transfer event at horizontal world position 8,7. Inputs: display name and destination stable numeric map ID. Returns new event with MZ 201 direct entry 5,7, keep-facing direction and fade code zero. Does not resolve/load a destination or mutate either cell; surrounding world validation checks authored data. */ function gate(
      name,
      target,
    ) {
      const e = root.FrontierEvents.create("courier-travel", 8, 7);
      e.name = name;
      e.pages[0].commands = [
        {
          type: "mz",
          code: 201,
          indent: 0,
          parameters: [0, target, 5, 7, 0, 0],
        },
      ];
      return e;
    }
    home.events.push(gate("Travel to letter archive", archive.mzId));
    store.events.push(gate("Return to courier town", hub.mzId));
    return [
      {
        ...hub,
        name: "Courier quest — town",
        world: root.FrontierWorld.validate(home),
      },
      {
        ...archive,
        name: "Courier quest — archive",
        world: root.FrontierWorld.validate(store),
      },
    ];
  }
  root.FrontierQuestExample = { events, maps, quest, item };
})(typeof window === "undefined" ? globalThis : window);
