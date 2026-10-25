/* MAINTAINER GUIDE
 * MZ-inspired page conditions and a bounded command interpreter. Highest matching page wins; all conditions on it must pass. Each playtest clones authored events. Add commands to validation and execution together.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function events.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier events. Uses: object freeze. */
(/* @function events.installReviewed — Installs MZ-inspired page matching and the bounded command interpreter. Highest matching page wins only when all conditions pass; each playtest owns cloned authored events and independent execution state. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  const graphics = ["none", "npc", "chest", "openChest", "marker"];
  const triggers = [
    "interact",
    "playerTouch",
    "eventTouch",
    "autorun",
    "parallel",
  ];
  // Host import bounds, not inferred MZ editor limits. Execution remains budgeted.
  const limits = Object.freeze({
    events: 2000,
    eventBytes: 2 * 1024 * 1024,
    commands: 10000,
  });
  // UTF-8 size without allocating an encoded byte buffer; also works in isolated test runtimes.
  /* @function events.serializedBytes.2 — UTF-8 size without allocating an encoded byte buffer; also works in isolated test runtimes. Inputs: value. Updates: bytes. Uses: json stringify; c code point at. Returns: bytes. */ function serializedBytes(
    value,
  ) {
    let bytes = 0;
    for (const c of JSON.stringify(value)) {
      const n = c.codePointAt(0);
      bytes += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;
    }
    return bytes;
  }
  const validName =
    /* @function events.validName.3 — Returns typeof value equals "string" and /^[A-Za-z0-9_-]{1,60}$/ test using value. Inputs: value. Uses: /^[A-Za-z0-9_-]{1,60}$/ test. Returns: typeof value equals "string" and /^[A-Za-z0-9_-]{1,60}$/ test using value. */ (
      value,
    ) => typeof value === "string" && /^[A-Za-z0-9_-]{1,60}$/.test(value);
  const point =
    /* @function events.point.4 — Returns value and number is finite using value x and number is finite using value y and value x is at least 1 and value y is at least 1 and value x is at most bounds width minus 1 and value y is at most bounds height minus 1. Inputs: value; assignment pattern. Uses: number is finite. Returns: value and number is finite using value x and number is finite using value y and value x is at least 1 and value y is at least 1 and value x is at most bounds width minus 1 and value y is at most bounds height minus 1. */ (
      value,
      bounds = { width: 48, height: 48 },
    ) =>
      value &&
      Number.isFinite(value.x) &&
      Number.isFinite(value.y) &&
      value.x >= 1 &&
      value.y >= 1 &&
      value.x <= bounds.width - 1 &&
      value.y <= bounds.height - 1;
  // Construct a new page with explicit defaults, including one demonstration message.
  /* @function events.page.5 — Construct a new page with explicit defaults, including one demonstration message. Inputs: assignment pattern. Returns: a record containing name, graphic, trigger, solid, condition, commands. */ function page(
    name = "Page 1",
  ) {
    return {
      name,
      graphic: "npc",
      trigger: "interact",
      solid: false,
      condition: {
        type: "always",
        key: "",
      },
      commands: [
        {
          type: "message",
          text: "Hello, wanderer.",
        },
      ],
    };
  }
  // Construct isolated editor/event state through the caller services.
  /* @function events.create.6 — Construct isolated editor/event state through the caller services. Inputs: id; x; y. Uses: page. Returns: a record containing id, name, x, y, range, inspection, pages. */ function create(
    id,
    x,
    y,
  ) {
    return {
      id,
      name: "New event",
      x,
      y,
      range: 1.8,
      inspection: "",
      pages: [page()],
    };
  }
  // Sanitize one page condition; variable/item conditions are numeric thresholds and self-switches are A through D.
  /* @function events.checkCondition.7 — Sanitize one page condition; variable/item conditions are numeric thresholds and self-switches are A through D. Inputs: c. Uses: error; root frontier conditions validate; a list of "always", "selfSwitch", "switch", "variable" includes; a list of "A", "B", "C", "D" includes. Returns: a record containing type, expression; a record containing type, key, copied fields. */ function checkCondition(
    c,
  ) {
    if (c?.type === "expression") {
      if (!root.FrontierConditions)
        throw Error("Condition expression evaluator is unavailable.");
      return {
        type: "expression",
        expression: root.FrontierConditions.validate(c.expression),
      };
    }
    if (
      !c ||
      !["always", "selfSwitch", "switch", "variable", "item", "actor"].includes(
        c.type,
      )
    )
      throw Error("Invalid page condition.");
    if (c.type === "selfSwitch" && !["A", "B", "C", "D"].includes(c.key))
      throw Error("Self switch must be A–D.");
    if (
      ["switch", "variable", "item", "actor"].includes(c.type) &&
      !validName(c.key)
    )
      throw Error("Invalid condition key.");
    if (["variable", "item"].includes(c.type) && !Number.isFinite(c.value))
      throw Error("Condition requires a number.");
    return {
      type: c.type,
      key: c.type === "always" ? "" : c.key,
      ...(["variable", "item"].includes(c.type)
        ? {
            value: c.value,
          }
        : {}),
    };
  }
  // Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields.
  /* @function events.validate.8 — Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields. Inputs: events; assignment pattern; assignment pattern. Uses: array is array; error; events map; result map. Returns: root frontier event schema selects result map using a callback or result. */ function validate(
    events,
    reserved = new Set(),
    bounds = { width: 48, height: 48 },
  ) {
    if (!Array.isArray(events) || events.length > limits.events)
      throw Error("At most " + limits.events + " events are supported.");
    const ids = new Set(reserved);
    const result = events.map(
      /* @function events.callback.9 — Provides the callback for events map. Inputs: event. Uses: valid name; ids has; point; number is finite. Returns: a record containing copied fields, activity, vectorTreatment, copied fields, copied fields, copied fields, copied fields, copied fields. */ (
        event,
      ) => {
        if (
          !event ||
          !validName(event.id) ||
          ids.has(event.id) ||
          !point(event, bounds) ||
          typeof event.name !== "string" ||
          event.name.length > 80 ||
          !Number.isFinite(event.range) ||
          event.range < 0.5 ||
          event.range > 5 ||
          !Array.isArray(event.pages) ||
          !event.pages.length
        )
        {
          // October 14: retain rejection semantics, but identify the field the author must correct.
          const reason = !event ? "missing event" : !validName(event.id) ? "ID must use 1–60 letters, numbers, underscores or hyphens" : ids.has(event.id) ? "duplicate ID: " + event.id : !point(event, bounds) ? "placement X/Y must be inside this map (1 to width/height minus 1)" : typeof event.name !== "string" || event.name.length > 80 ? "name must be text, at most 80 characters" : !Number.isFinite(event.range) || event.range < 0.5 || event.range > 5 ? "interaction range must be 0.5–5 metres" : "at least one event page is required";
          throw Error("Invalid event identity, position, range or pages: " + reason + ".");
        }
        // Page count has no fixed cap; actual serialized data is the import budget.
        const bytes = serializedBytes(event);
        if (bytes > limits.eventBytes)
          throw Error(
            "Event exceeds " +
              limits.eventBytes +
              " bytes. Split large content into reusable events.",
          );
        ids.add(event.id);
        if (
          event.height !== undefined &&
          (!Number.isFinite(event.height) ||
            event.height < 0.1 ||
            event.height > 20)
        )
          throw Error("Event height must be 0.1–20.");
        if (
          event.heightOffset !== undefined &&
          (!Number.isFinite(event.heightOffset) ||
            Math.abs(event.heightOffset) > 30)
        )
          throw Error("Elevation offset must be -30–30.");
        if (
          event.movementMode !== undefined &&
          !["grounded", "flying"].includes(event.movementMode)
        )
          throw Error("Invalid event height behavior.");
        if (
          event.activity !== undefined &&
          !["distance", "always"].includes(event.activity)
        )
          throw Error("Invalid event activity policy.");
        if (event.topics !== undefined)
          root.FrontierParser?.compile(event.topics);
        if (
          event.vectorTreatment !== undefined &&
          !["map", "original", "phosphor", "outline"].includes(
            event.vectorTreatment,
          )
        )
          throw Error("Invalid event vector treatment.");
        if (
          event.spriteProfile !== undefined &&
          (typeof event.spriteProfile !== "string" ||
            event.spriteProfile.length > 100)
        )
          throw Error("Invalid sprite profile.");
        if (
          event.combatNote !== undefined &&
          (typeof event.combatNote !== "string" ||
            event.combatNote.length > 2000)
        )
          throw Error("Invalid combat note.");
        if (
          event.inspection !== undefined &&
          (typeof event.inspection !== "string" ||
            event.inspection.length > 2000)
        )
          throw Error("Invalid inspection text.");
        if (event.extensions?.enemy) root.FrontierEnemies?.validate(event.extensions.enemy);
        return {
          ...(event.spatial === undefined
            ? {}
            : { spatial: root.FrontierModelEvents.validate(event.spatial) }),
          activity: event.activity || "distance",
          vectorTreatment: event.vectorTreatment || "map",
          ...(event.topics
            ? {
                topics: structuredClone(event.topics),
              }
            : {}),
          ...(event.spriteProfile
            ? {
                spriteProfile: event.spriteProfile,
              }
            : {}),
          ...(event.combatNote
            ? {
                combatNote: event.combatNote,
              }
            : {}),
          ...(event.height === undefined ? {} : { height: event.height }),
          ...(event.heightOffset === undefined
            ? {}
            : { heightOffset: event.heightOffset }),
          ...(event.movementMode ? { movementMode: event.movementMode } : {}),
          id: event.id,
          name: event.name,
          x: event.x,
          y: event.y,
          elevation:
            Number.isInteger(event.elevation ?? 0) &&
            Math.abs(event.elevation ?? 0) <= 100
              ? (event.elevation ?? 0)
              : (/* @function events.callback.10 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: error. */ () => {
                  throw Error("Invalid event elevation.");
                })(),
          range: event.range,
          ...(event.inspection === undefined
            ? {}
            : {
                inspection: event.inspection,
              }),
          pages: event.pages.map(
            /* @function events.callback.11 — Provides the callback for event pages map. Inputs: p. Updates: stack at stack length minus 1. Uses: graphics includes; triggers includes; a list of "always", "selfSwitch", "switch", "variable" includes; array is array. Returns: a record containing name, graphic, trigger, solid, movement, priority, through, condition. */ (
              p,
            ) => {
              if (
                !p ||
                typeof p.name !== "string" ||
                p.name.length > 80 ||
                !graphics.includes(p.graphic) ||
                !triggers.includes(p.trigger) ||
                typeof p.solid !== "boolean" ||
                !p.condition ||
                ![
                  "always",
                  "selfSwitch",
                  "switch",
                  "variable",
                  "item",
                  "actor",
                  "expression",
                ].includes(p.condition.type) ||
                !Array.isArray(p.commands) ||
                p.commands.length > limits.commands
              )
                throw Error("Invalid event page.");
              const condition = checkCondition(p.condition);
              if (p.behavior?.points) {
                const width = bounds.width ?? bounds.size ?? 48,
                  height = bounds.height ?? bounds.size ?? 48;
                for (const waypoint of p.behavior.points)
                  if (waypoint.x > width - 1 || waypoint.y > height - 1)
                    throw Error(
                      "Patrol waypoint falls outside map bounds for event " +
                        event.id +
                        ".",
                    );
              }
              if (
                p.movement !== undefined &&
                !["stationary", "random", "approach", "custom"].includes(
                  p.movement,
                )
              )
                throw Error("Unknown event movement.");
              if (
                p.priority !== undefined &&
                !["below", "normal", "above"].includes(p.priority)
              )
                throw Error("Unknown event priority.");
              if (
                p.conditions !== undefined &&
                (!Array.isArray(p.conditions) || p.conditions.length > 8)
              )
                throw Error("At most eight additional conditions.");
              const conditions = p.conditions?.map(checkCondition);
              if (
                condition.type === "selfSwitch" &&
                !["A", "B", "C", "D"].includes(condition.key)
              )
                throw Error("Self switch must be A–D.");
              if (condition.type === "switch" && !validName(condition.key))
                throw Error("Invalid switch name.");
              const commands = p.commands.map(
                /* @function events.callback.12 — Provides the callback for p commands map. Inputs: command. Uses: error; root frontier mzcommands validate; valid name; a list of "set", "add" includes. Returns: root frontier mzcommands validate using command; a record containing type, key, operation, value. */ (
                  command,
                ) => {
                  if (!command) throw Error("Invalid event command.");
                  switch (command.type) {
                    case "mz":
                      if (!root.FrontierMZCommands)
                        throw Error("MZ command registry is unavailable.");
                      return root.FrontierMZCommands.validate(command);
                    case "variable":
                      if (
                        !validName(command.key) ||
                        !["set", "add"].includes(command.operation) ||
                        !Number.isFinite(command.value)
                      )
                        throw Error("Invalid variable command.");
                      return {
                        type: command.type,
                        key: command.key,
                        operation: command.operation,
                        value: command.value,
                      };
                    case "message":
                      if (
                        typeof command.text !== "string" ||
                        command.text.length > 1500
                      )
                        throw Error("Message must be at most 1500 characters.");
                      return {
                        type: "message",
                        text: command.text,
                        ...(command.dialogue ? { dialogue: true } : {}),
                      };
                    case "selfSwitch":
                      if (
                        !["A", "B", "C", "D"].includes(command.key) ||
                        typeof command.value !== "boolean"
                      )
                        throw Error("Invalid self-switch command.");
                      return {
                        type: command.type,
                        key: command.key,
                        value: command.value,
                      };
                    case "switch":
                      if (
                        !validName(command.key) ||
                        typeof command.value !== "boolean"
                      )
                        throw Error("Invalid switch command.");
                      return {
                        type: command.type,
                        key: command.key,
                        value: command.value,
                      };
                    case "giveItem":
                      if (
                        !validName(command.item) ||
                        !Number.isInteger(command.amount) ||
                        command.amount < 1 ||
                        command.amount > 999
                      )
                        throw Error("Invalid item command.");
                      return {
                        type: command.type,
                        item: command.item,
                        amount: command.amount,
                      };
                    case "wait":
                      if (
                        !Number.isFinite(command.seconds) ||
                        command.seconds < 0 ||
                        command.seconds > 30
                      )
                        throw Error("Wait must be 0–30 seconds.");
                      return {
                        type: command.type,
                        seconds: command.seconds,
                      };
                    case "journal":
                      if (
                        !validName(command.key) ||
                        typeof command.text !== "string" ||
                        command.text.length > 2000
                      )
                        throw Error("Invalid journal entry.");
                      return {
                        type: "journal",
                        key: command.key,
                        text: command.text,
                      };
                    case "transferPlayer":
                      return {
                        type: "transferPlayer",
                        parameters: root.FrontierTransferPlayer.validate(
                          command.parameters,
                        ),
                      };
                    case "transferMap":
                      if (
                        !validName(command.map) ||
                        !validName(command.entrance)
                      )
                        throw Error(
                          "Map travel needs valid map and entrance IDs.",
                        );
                      return {
                        type: "transferMap",
                        map: command.map,
                        entrance: command.entrance,
                      };
                    case "transfer":
                      if (!point(command, bounds))
                        throw Error("Transfer is outside the level.");
                      return {
                        type: command.type,
                        x: command.x,
                        y: command.y,
                      };
                    case "choices":
                      if (
                        !validName(command.key) ||
                        !Array.isArray(command.options) ||
                        command.options.length < 2 ||
                        command.options.length > 8 ||
                        command.options.some(
                          /* @function events.callback.13 — Returns typeof s does not equal "string" or the inverse of s trim using or s length is greater than 120. Inputs: s. Uses: s trim. Returns: typeof s does not equal "string" or the inverse of s trim using or s length is greater than 120. */ (
                            s,
                          ) =>
                            typeof s !== "string" ||
                            !s.trim() ||
                            s.length > 120,
                        )
                      )
                        throw Error(
                          "Choices need 2–8 labels and a result variable.",
                        );
                      return {
                        type: "choices",
                        key: command.key,
                        options: [...command.options],
                      };
                    case "branch":
                      return {
                        type: "branch",
                        condition: checkCondition(command.condition),
                      };
                    case "else":
                    case "end":
                      return { type: command.type };
                    default:
                      if (root.FrontierEventRuntime?.has(command.type))
                        return root.FrontierEventRuntime.validate(command);
                      throw Error("Unknown event command.");
                  }
                },
              );
              root.FrontierMZCommands?.validateStructure(commands);
              // Flat branch markers match the familiar indented MZ command list.
              const stack = [];
              for (const c of commands) {
                if (c.type === "branch") {
                  if (stack.length >= 8)
                    throw Error("At most eight nested branches.");
                  stack.push(false);
                }
                if (c.type === "else") {
                  if (!stack.length || stack.at(-1))
                    throw Error("Unmatched or duplicate Else.");
                  stack[stack.length - 1] = true;
                }
                if (c.type === "end") {
                  if (!stack.length) throw Error("Unmatched End.");
                  stack.pop();
                }
              }
              if (stack.length) throw Error("Every branch needs an End.");
              return {
                name: p.name,
                graphic: p.graphic,
                trigger: p.trigger,
                solid: p.solid,
                movement: p.movement || "stationary",
                priority: p.priority || "normal",
                through: !!p.through,
                condition,
                ...(conditions
                  ? {
                      conditions,
                    }
                  : {}),
                commands,
              };
            },
          ),
        };
      },
    );
    return root.FrontierEventSchema
      ? result.map(
          /* @function events.callback.14 — Returns root frontier event schema annotations using e, events at i. Inputs: e; i. Uses: root frontier event schema annotations. Returns: root frontier event schema annotations using e, events at i. */ (
            e,
            i,
          ) => root.FrontierEventSchema.annotations(e, events[i]),
        )
      : result;
  }
  // Walk pages backwards and select the highest page whose primary and additional conditions all match.
  // Diagnostic sizing is explicit/on demand; do not serialize event data each frame.
  /* @function events.diagnostics.15 — Diagnostic sizing is explicit/on demand; do not serialize event data each frame. Inputs: event. Uses: event pages reduce; serialized bytes. Returns: a record containing id, pages, commands, serializedBytes, byteBudget. */ function diagnostics(
    event,
  ) {
    return {
      id: event.id,
      pages: event.pages.length,
      commands: event.pages.reduce(
        /* @function events.callback.16 — Returns n plus p commands length. Inputs: n; p. Returns: n plus p commands length. */ (
          n,
          p,
        ) => n + p.commands.length,
        0,
      ),
      serializedBytes: serializedBytes(event),
      byteBudget: limits.eventBytes,
    };
  }
  /* @function events.activePage.17 — Handles active page within events. Inputs: event; state. Uses: state erased events has; state page cache selection; scan pages. Returns: - 1; state page cache selects state page cache selection using event, a callback or scan pages using event, state. */ function activePage(
    event,
    state,
  ) {
    if (state.erasedEvents?.has(event.id)) return -1;
    return state.pageCache
      ? state.pageCache.selection(
          event,
          /* @function events.callback.18 — Returns scan pages using event, state. Inputs: no explicit arguments; uses enclosing module state. Uses: scan pages. Returns: scan pages using event, state. */ () =>
            scanPages(event, state),
        )
      : scanPages(event, state);
  }
  // Separate uncached scan allows correctness fixtures and dynamic-condition fallback.
  /* @function events.scanPages.19 — Separate uncached scan allows correctness fixtures and dynamic-condition fallback. Inputs: event; state. Updates: state page checks. Uses: a list of event pages at i condition, spread element every. Returns: i; - 1. */ function scanPages(
    event,
    state,
  ) {
    for (let i = event.pages.length - 1; i >= 0; i--) {
      if (state.diagnosticsEnabled)
        state.pageChecks = (state.pageChecks || 0) + 1;
      const matches =
        /* @function events.matches.20 — Returns c type equals "expression" selects root frontier conditions evaluate using c expression, a record containing state, eventId, subject, resolveEntity or c type equals "always" or c type equals "selfSwitch" and state self switches get using event id plus ":" plus c key equals true or c type equals "switch" and state switches get using c key equals true or c type equals "variable" and chain or 0 is at least c value or c type equals "item" and state inventory get using c key or 0 is at least c value or c type equals "actor" and the inverse of the inverse of chain. Inputs: c. Uses: root frontier conditions evaluate; state self switches get; state switches get; state variables get. Returns: c type equals "expression" selects root frontier conditions evaluate using c expression, a record containing state, eventId, subject, resolveEntity or c type equals "always" or c type equals "selfSwitch" and state self switches get using event id plus ":" plus c key equals true or c type equals "switch" and state switches get using c key equals true or c type equals "variable" and chain or 0 is at least c value or c type equals "item" and state inventory get using c key or 0 is at least c value or c type equals "actor" and the inverse of the inverse of chain. */ (
          c,
        ) =>
          c.type === "expression"
            ? root.FrontierConditions.evaluate(c.expression, {
                state,
                eventId: event.id,
                subject: event,
                resolveEntity:
                  /* @function events.resolveEntity.21 — Returns chain. Inputs: id. Uses: state entities get. Returns: chain. */ (
                    id,
                  ) => state.entities?.get(id),
              })
            : c.type === "always" ||
              (c.type === "selfSwitch" &&
                state.selfSwitches.get(event.id + ":" + c.key) === true) ||
              (c.type === "switch" && state.switches.get(c.key) === true) ||
              (c.type === "variable" &&
                (state.variables?.get(c.key) || 0) >= c.value) ||
              (c.type === "item" &&
                (state.inventory.get(c.key) || 0) >= c.value) ||
              (c.type === "actor" && !!state.actors?.has(c.key));
      if (
        [event.pages[i].condition, ...(event.pages[i].conditions || [])].every(
          matches,
        )
      )
        return i;
    }
    return -1;
  }
  // Clone authored events and own temporary switches, inventory, variable values and interpreter state.
  /* @function events.createSession.22 — Clone authored events and own temporary switches, inventory, variable values and interpreter state. Inputs: authored events; services. Updates: state entities; state page cache. Uses: structured clone; root frontier page cache create; fresh context. Returns: a record containing captureContinuation, restoreContinuation, captureBehaviors, restoreBehaviors, replaceEvent, replacementRevision, replacementReferences, replacementDebug. */ function createSession(
    authoredEvents,
    services,
  ) {
    const events = structuredClone(authoredEvents);
    const state = {
      selfSwitches: new Map(),
      switches: new Map(),
      inventory: new Map(),
      variables: new Map(),
      actors: new Set(),
      quests: new Map(),
      skills: new Map(),
      reputation: new Map(),
      factions: new Map(),
      erasedEvents: new Set(),
      gold: 0,
      diagnosticsEnabled: !!services.debug,
      pageChecks: 0,
    };
    // Resolve current runtime positions lazily; no per-frame entity-map copy.
    state.entities = {
      get: /* @function events.get.23 — Returns id equals "player" selects state player or chain or events find using a callback or chain. Inputs: id. Uses: services resolve entity; events find. Returns: id equals "player" selects state player or chain or events find using a callback or chain. */ (
        id,
      ) =>
        id === "player"
          ? state.player || services.resolveEntity?.(id)
          : events.find(
              /* @function events.callback.24 — Returns e id equals id. Inputs: e. Returns: e id equals id. */ (
                e,
              ) => e.id === id,
            ) || services.resolveEntity?.(id),
    };
    if (root.FrontierPageCache)
      state.pageCache = root.FrontierPageCache.create(state);
    const touched = new Set();
    const wander = new Map(),
      forcedRoutes = new Map();
    let choiceBranches = new Map(),
      routeWait = null;
    const freshContext =
      /* @function events.freshContext.25 — Returns a record containing execution, message, waiting, routeWait, choiceBranches, pageIndex. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing execution, message, waiting, routeWait, choiceBranches, pageIndex. */ () => ({
        execution: null,
        message: null,
        waiting: 0,
        routeWait: null,
        choiceBranches: new Map(),
        pageIndex: -1,
      });
    const mainContext = freshContext(),
      parallelContexts = new Map();
    let currentContext = mainContext,
      messageOwner = null,
      frameBudget = 4096,
      parallelCursor = 0;
    /* @function events.saveContext.26 — Handles save context within events. Inputs: no explicit arguments; uses enclosing module state. Uses: object assign. */ function saveContext() {
      Object.assign(currentContext, {
        execution,
        message,
        waiting,
        routeWait,
        choiceBranches,
      });
    }
    /* @function events.loadContext.27 — Handles load context within events. Inputs: context. Updates: current context; object pattern. Uses: save context. */ function loadContext(
      context,
    ) {
      saveContext();
      currentContext = context;
      ({ execution, message, waiting, routeWait, choiceBranches } = context);
    }
    /* @function events.publishMessage.28 — Handles publish message within events. Inputs: value. Updates: message; current context message; message owner. Uses: services message. Returns: services message using value. */ function publishMessage(
      value,
    ) {
      // October 22: event-owned font applies to native and legacy text/choices alike.
      if (value && execution) { const owner=events.find(/* @function events.messageFontOwner — Inputs: event definition. Returns current interpreter owner without mutation. */function(e){return e.id===execution.eventId;}); if (owner?.extensions?.textFont) value={...value,font:owner.extensions.textFont}; }
      message = value;
      currentContext.message = value;
      messageOwner = value ? currentContext : null;
      return services.message(value);
    }
    /* @function events.respond.29 — Handles respond within events. Inputs: fn. Uses: load context; fn. Returns: fn using . */ function respond(
      fn,
    ) {
      const previous = currentContext;
      loadContext(messageOwner || mainContext);
      try {
        return fn();
      } finally {
        loadContext(previous);
      }
    }
    let execution = null,
      message = null,
      waiting = 0,
      automaticCursor = 0;
    const replacementReferences = new Map(),
      replacementTrace = [],
      activationFrame = new WeakMap();
    let replacementRevision = 0,
      frameNumber = 0;
    // Prepare before cancelling anything. Definitions come from a compiled,
    // validated template bank; this boundary additionally validates map placement.
    /* @function events.replaceEvent.30 — validated template bank; this boundary additionally validates map placement. Inputs: id; bank; template; assignment pattern. Updates: message owner; context route wait; object pattern; events at index; next definition revision. Uses: events find index; error; a list of "reset", "preserve" includes; bank instantiate. Returns: next. */ function replaceEvent(
      id,
      bank,
      template,
      options = {},
    ) {
      const index = events.findIndex(
        /* @function events.callback.31 — Returns e id equals id. Inputs: e. Returns: e id equals id. */ (
          e,
        ) => e.id === id,
      );
      if (index < 0) throw Error("Replacement target is missing.");
      const old = events[index],
        policy = options.statePolicy ?? "reset";
      if (!["reset", "preserve"].includes(policy))
        throw Error("Invalid replacement state policy.");
      if (
        !bank ||
        typeof bank.instantiate !== "function" ||
        typeof bank.version !== "function"
      )
        throw Error("Compiled event template bank is required.");
      const next = bank.instantiate(
        template,
        {
          id,
          x: old.x,
          y: old.y,
          eventNumber: old.extensions?.["sprite-frontier"]?.eventNumber,
        },
        options.version,
      );
      if (!point(next, services.bounds?.() || { width: 48, height: 48 }))
        throw Error("Replacement placement is outside the map.");
      // Save aliases first, then cancel all execution owned by the old identity.
      // A forced-route wait in an unrelated interpreter becomes completed.
      saveContext();
      const contexts = [mainContext, ...parallelContexts.values()];
      for (const context of contexts) {
        if (context.execution?.eventId === id) {
          if (messageOwner === context) {
            messageOwner = null;
            services.message(null);
          }
          Object.assign(context, freshContext());
        } else if (context.routeWait === old) context.routeWait = null;
      }
      ({ execution, message, waiting, routeWait, choiceBranches } =
        currentContext);
      parallelContexts.delete(id);
      forcedRoutes.delete(old);
      wander.delete(id);
      for (const key of touched)
        if (key.startsWith(id + ":")) touched.delete(key);
      if (policy === "reset")
        for (const key of state.selfSwitches.keys())
          if (key.startsWith(id + ":")) state.selfSwitches.delete(key);
      state.erasedEvents.delete(id);
      state.pageCache?.invalidate(old);
      events[index] = next;
      replacementRevision++;
      next.definitionRevision = replacementRevision;
      activationFrame.set(next, frameNumber + 1);
      const reference = {
        id,
        template,
        version: bank.version(template),
        statePolicy: policy,
      };
      replacementReferences.set(id, reference);
      replacementTrace.push({ ...reference, revision: replacementRevision });
      if (replacementTrace.length > 16) replacementTrace.shift();
      return next;
    }
    // Skip to the matching Else/End while respecting nested branches.
    /* @function events.skipBranch.32 — Skip to the matching Else/End while respecting nested branches. Inputs: allow else. Returns: without a result; without a result. */ function skipBranch(
      allowElse,
    ) {
      let depth = 0;
      while (execution.index < execution.commands.length) {
        const c = execution.commands[execution.index++];
        if (c.type === "branch") depth++;
        else if (c.type === "end") {
          if (!depth) return;
          depth--;
        } else if (c.type === "else" && !depth && allowElse) return;
      }
    }
    // Start an eligible event only when no other event is running and the selected page trigger matches.
    /* @function events.start.33 — Start an eligible event only when no other event is running and the selected page trigger matches. Inputs: event; trigger. Updates: commands; waiting; route wait; execution. Uses: events includes; activation frame get; active page; root frontier mzcommands lower. Returns: false; false. */ function start(
      event,
      trigger,
    ) {
      if (
        !events.includes(event) ||
        (activationFrame.get(event) || 0) > frameNumber
      )
        return false;
      if (execution) return false;
      const index = activePage(event, state);
      if (index < 0 || event.pages[index].trigger !== trigger) return false;
      let commands = root.FrontierMZCommands
        ? root.FrontierMZCommands.lower(event.pages[index].commands, {
            state,
            eventId: event.id,
          })
        : structuredClone(event.pages[index].commands);
      if (root.FrontierEventRuntime)
        commands = root.FrontierEventRuntime.preflight(commands);
      if (
        commands.some(
          /* @function events.callback.34 — Returns c type equals "transferPlayer". Inputs: c. Returns: c type equals "transferPlayer". */ (
            c,
          ) => c.type === "transferPlayer",
        ) &&
        (trigger === "parallel" ||
          typeof services.transferPlayer !== "function")
      ) {
        services.log(
          "Transfer Player requires a main interpreter and a scene transfer service. Event stopped before changes.",
        );
        return false;
      }
      const missing = commands.find(
        /* @function events.callback.35 — Provides the callback for commands find. Inputs: c. Uses: root frontier event runtime get. Returns: key and typeof services at key does not equal "function". */ (
          c,
        ) => {
          const key = root.FrontierEventRuntime?.get(c.type)?.requiresService;
          return key && typeof services[key] !== "function";
        },
      );
      if (missing) {
        services.log(
          "Missing runtime service for " +
            missing.type +
            ". Event stopped before changes.",
        );
        return false;
      }
      if (
        commands.some(
          /* @function events.callback.36 — Returns c type equals "forceRoute" and c route list some using a callback. Inputs: c. Uses: c route list some. Returns: c type equals "forceRoute" and c route list some using a callback. */ (
            c,
          ) =>
            c.type === "forceRoute" &&
            c.route.list.some(
              /* @function events.callback.37 — Returns r code equals 44. Inputs: r. Returns: r code equals 44. */ (
                r,
              ) => r.code === 44,
            ),
        ) &&
        typeof services.playSE !== "function"
      ) {
        services.log(
          "Movement-route Play SE service unavailable. Event stopped before changes.",
        );
        return false;
      }
      // Validate all referenced definitions before the first command has effects.
      // Execution checks again because runtime targets can be replaced meanwhile.
      try {
        for (const c of commands)
          if (c.type === "replaceEvent") {
            if (services.templateBank().version(c.template) !== c.version)
              throw Error(
                "Missing or version-mismatched event template " + c.template,
              );
            if (
              c.target !== "this" &&
              !events.some(
                /* @function events.callback.38 — Returns e id equals c target. Inputs: e. Returns: e id equals c target. */ (
                  e,
                ) => e.id === c.target,
              )
            )
              throw Error("Replacement target is missing.");
          }
      } catch (error) {
        services.log(error.message + ". Event stopped before changes.");
        return false;
      }
      const unsupported = commands.find(
        /* @function events.callback.39 — Returns c type equals "unsupported". Inputs: c. Returns: c type equals "unsupported". */ (
          c,
        ) => c.type === "unsupported",
      );
      if (unsupported) {
        services.log(
          "Unsupported event command " +
            unsupported.code +
            ": " +
            unsupported.name +
            ". Event execution stopped before making changes.",
        );
        return false;
      }
      choiceBranches.clear();
      waiting = 0;
      routeWait = null;
      execution = {
        eventId: event.id,
        name: event.displayName ?? event.name,
        pageIndex: index,
        trigger,
        commands,
        index: 0,
      };
      saveContext();
      return true;
    }
    /* @function events.runInterpreter.40 — Handles run interpreter within events. Inputs: dt; player. Updates: route wait; waiting; execution; message; current context message. Uses: forced routes has; a list of "message", "choices", "choicePrompt", "numberInput" includes; root frontier event runtime get; root frontier event runtime has. Returns: without a result; without a result. */ function runInterpreter(
      dt,
      player,
    ) {
      if (routeWait) {
        if (forcedRoutes.has(routeWait)) return;
        routeWait = null;
      }
      if (execution) {
        if (message) return;
        waiting = Math.max(0, waiting - dt);
        if (waiting > 0) return;
        for (
          let budget = 0;
          execution && budget < 64 && frameBudget > 0;
          budget++
        ) {
          frameBudget--;
          const command = execution.commands[execution.index++];
          if (
            command &&
            ([
              "message",
              "choices",
              "choicePrompt",
              "numberInput",
              "transferPlayer",
            ].includes(command.type) ||
              root.FrontierEventRuntime?.get(command.type)?.blocksMessage) &&
            messageOwner &&
            messageOwner !== currentContext
          ) {
            execution.index--;
            return;
          }
          if (!command) {
            execution = null;
            break;
          }
          if (root.FrontierEventRuntime?.has(command.type)) {
            try {
              const directive = root.FrontierEventRuntime.execute(command, {
                state,
                player,
                event: events.find(
                  /* @function events.callback.41 — Returns e id equals execution event id. Inputs: e. Returns: e id equals execution event id. */ (
                    e,
                  ) => e.id === execution.eventId,
                ),
                services,
                replaceEvent,
                interpreter: {
                  eventId: execution.eventId,
                  pageIndex: execution.pageIndex,
                  originMap: execution.originMap,
                },
              });
              if (directive?.stop) {
                execution = null;
                break;
              }
              if (directive?.wait !== undefined) {
                if (!Number.isFinite(directive.wait) || directive.wait < 0)
                  throw Error("Invalid runtime wait.");
                waiting = directive.wait;
                if (waiting) return;
              }
              if (directive?.message) {
                publishMessage(directive.message);
                return;
              }
            } catch (error) {
              services.log(
                "Runtime command " +
                  command.type +
                  " stopped: " +
                  error.message,
              );
              execution = null;
              break;
            }
            continue;
          }
          if (command.type === "message") {
            message = {
              name:
                command.speaker === undefined
                  ? execution.name
                  : command.speaker,
              text: command.text,
              dialogue: command.dialogue,
              textPresentation:
                command.position === undefined
                  ? null
                  : {
                      position: command.position,
                      background: command.background,
                      faceName: command.faceName,
                      faceIndex: command.faceIndex,
                    },
            };
            const following = execution.commands[execution.index];
            if (following?.type === "choicePrompt") {
              execution.index++;
              Object.assign(message, following, {
                dialogue: true,
                choicePrompt: true,
              });
            } else if (following?.type === "numberInput") {
              execution.index++;
              Object.assign(message, following, {
                dialogue: true,
                numberInput: true,
                value: root.FrontierNumberInput.initial(
                  state.variables.get(following.variable),
                  following.digits,
                ),
              });
            }
            if (publishMessage(message) === true) {
              message = null;
              currentContext.message = null;
              messageOwner = null;
              continue;
            }
            return;
          }
          if (command.type === "numberInput") {
            message = {
              ...command,
              name: execution.name,
              text: "",
              dialogue: true,
              numberInput: true,
              value: root.FrontierNumberInput.initial(
                state.variables.get(command.variable),
                command.digits,
              ),
            };
            publishMessage(message);
            return;
          }
          if (command.type === "choicePrompt") {
            message = {
              ...command,
              name: execution.name,
              text: "",
              dialogue: true,
              choicePrompt: true,
            };
            publishMessage(message);
            return;
          }
          if (
            command.type === "choiceSection" ||
            command.type === "choiceCancel"
          ) {
            const selected = choiceBranches.get(command.indent),
              matches =
                command.type === "choiceSection"
                  ? selected === command.choice
                  : selected === -2;
            if (!matches)
              while (execution.index < execution.commands.length) {
                const next = execution.commands[execution.index];
                if (
                  next.indent === command.indent &&
                  ["choiceSection", "choiceCancel", "choiceEnd"].includes(
                    next.type,
                  )
                )
                  break;
                execution.index++;
              }
          }
          if (command.type === "choiceEnd")
            choiceBranches.delete(command.indent);
          if (command.type === "choices") {
            message = {
              name: execution.name,
              text: "Choose:",
              options: command.options,
              key: command.key,
              dialogue: true,
            };
            publishMessage(message);
            return;
          }
          if (command.type === "branch") {
            const subject =
              !execution.originMap ||
              !services.currentMap ||
              execution.originMap === services.currentMap()
                ? events.find(
                    /* @function events.callback.42 — Returns e id equals execution event id. Inputs: e. Returns: e id equals execution event id. */ (
                      e,
                    ) => e.id === execution.eventId,
                  )
                : null;
            const test = {
              ...subject,
              id: execution.eventId,
              pages: [{ condition: command.condition }],
            };
            const branchState =
              execution.originMap && services.selfSwitchMap
                ? {
                    ...state,
                    selfSwitches: services.selfSwitchMap(execution.originMap),
                    pageCache: null,
                  }
                : state;
            if (activePage(test, branchState) < 0) skipBranch(true);
          }
          if (command.type === "else") skipBranch(false);
          if (command.type === "forceRoute") {
            const offMap =
              execution.originMap &&
              services.currentMap &&
              execution.originMap !== services.currentMap();
            const entity =
              command.target < 0
                ? player
                : offMap
                  ? null
                  : command.target === 0
                    ? events.find(
                        /* @function events.callback.43 — Returns e id equals execution event id. Inputs: e. Returns: e id equals execution event id. */ (
                          e,
                        ) => e.id === execution.eventId,
                      )
                    : events.find(
                        /* @function events.callback.44 — Returns + chain equals command target. Inputs: e. Returns: + chain equals command target. */ (
                          e,
                        ) =>
                          +e.extensions?.["sprite-frontier"]?.eventNumber ===
                          command.target,
                      );
            if (entity) {
              const current =
                  entity === player
                    ? null
                    : entity.pages[activePage(entity, state)],
                mz = current?.mz
                  ? structuredClone(current.mz)
                  : root.FrontierEventSchema.pageDefaults();
              if (entity === player) mz.moveSpeed = 4;
              mz.moveRoute = structuredClone(command.route);
              forcedRoutes.set(entity, {
                page: { movement: "custom", through: !!current?.through, mz },
                controllers: new Map(),
              });
              if (command.route.wait) {
                routeWait = entity;
                return;
              }
            }
          }
          if (
            command.type === "eraseEvent" &&
            (!execution.originMap ||
              !services.currentMap ||
              execution.originMap === services.currentMap())
          )
            state.erasedEvents.add(execution.eventId);
          if (command.type === "controlTimer")
            state.timer = {
              running: command.start,
              remaining: command.start
                ? command.seconds
                : state.timer?.remaining || 0,
            };
          if (command.type === "exitEvent") {
            execution = null;
            break;
          }
          if (command.type === "repeat") {
            let depth = 0;
            for (let i = execution.index - 2; i >= 0; i--) {
              const c = execution.commands[i];
              if (c.type === "repeat") depth++;
              else if (c.type === "loop") {
                if (depth === 0) {
                  execution.index = i + 1;
                  break;
                }
                depth--;
              }
            }
          }
          if (command.type === "breakLoop") {
            let depth = 0;
            while (execution.index < execution.commands.length) {
              const c = execution.commands[execution.index++];
              if (c.type === "loop") depth++;
              else if (c.type === "repeat") {
                if (depth === 0) break;
                depth--;
              }
            }
          }
          if (command.type === "jumpLabel") {
            const target = execution.commands.findIndex(
              /* @function events.callback.45 — Returns c type equals "label" and c name equals command name. Inputs: c. Returns: c type equals "label" and c name equals command name. */ (
                c,
              ) => c.type === "label" && c.name === command.name,
            );
            if (target >= 0) execution.index = target + 1;
          }
          if (command.type === "selfSwitch") {
            const key = execution.eventId + ":" + command.key;
            if (execution.originMap && services.setSelfSwitch)
              services.setSelfSwitch(execution.originMap, key, command.value);
            else state.selfSwitches.set(key, command.value);
          }
          if (command.type === "switch")
            state.switches.set(command.key, command.value);
          if (command.type === "journal")
            services.journal?.(command.key, command.text);
          if (command.type === "variable")
            state.variables.set(
              command.key,
              command.operation === "add"
                ? (state.variables.get(command.key) || 0) + command.value
                : command.value,
            );
          if (command.type === "partyMember") {
            if (command.add) state.actors.add(command.id);
            else state.actors.delete(command.id);
          }
          if (command.type === "mzVariables") {
            const p = command.parameters,
              base = p[3] === 1 ? state.variables.get(String(p[4])) || 0 : p[4];
            for (let id = p[0]; id <= p[1]; id++) {
              const value =
                  base +
                  (p[3] === 2
                    ? Math.floor(Math.random() * (p[5] - p[4] + 1))
                    : 0),
                key = String(id),
                old = state.variables.get(key) || 0;
              const result = [
                /* @function events.callback.46 — Returns value. Inputs: no explicit arguments; uses enclosing module state. Returns: value. */ () =>
                  value,
                /* @function events.callback.47 — Returns old plus value. Inputs: no explicit arguments; uses enclosing module state. Returns: old plus value. */ () =>
                  old + value,
                /* @function events.callback.48 — Returns old minus value. Inputs: no explicit arguments; uses enclosing module state. Returns: old minus value. */ () =>
                  old - value,
                /* @function events.callback.49 — Returns old multiplied by value. Inputs: no explicit arguments; uses enclosing module state. Returns: old multiplied by value. */ () =>
                  old * value,
                /* @function events.callback.50 — Returns old divided by value. Inputs: no explicit arguments; uses enclosing module state. Returns: old divided by value. */ () =>
                  old / value,
                /* @function events.callback.51 — Returns old % value. Inputs: no explicit arguments; uses enclosing module state. Returns: old % value. */ () =>
                  old % value,
              ][p[2]]();
              state.variables.set(key, Math.floor(result));
            }
          }
          if (command.type === "giveItem") {
            state.inventory.set(
              command.item,
              (state.inventory.get(command.item) || 0) + command.amount,
            );
            // October 14: optional origin preserves placed-item instance data;
            // existing two-argument item services remain compatible.
            services.item?.(command.item, command.amount, execution.eventId);
            services.log(
              "Received " + command.amount + " × " + command.item + ".",
            );
          }
          if (command.type === "wait") {
            waiting = command.seconds;
            if (waiting) return;
          }
          if (command.type === "transferPlayer") {
            try {
              const continuation = root.FrontierEventContinuation.capture(
                execution,
                events.find(
                  /* @function events.callback.52 — Returns e id equals execution event id. Inputs: e. Returns: e id equals execution event id. */ (
                    e,
                  ) => e.id === execution.eventId,
                ),
                waiting,
                choiceBranches,
              );
              if (!services.transferPlayer(command.parameters, continuation))
                throw Error("Transfer reservation was rejected.");
            } catch (error) {
              services.log("Transfer Player stopped: " + error.message);
            }
            execution = null;
            return;
          }
          if (command.type === "transferMap") {
            services.transferMap?.(command.map, command.entrance);
            execution = null;
            return;
          }
          if (command.type === "transfer") {
            if (services.canStand(command.x, command.y)) {
              player.x = command.x;
              player.y = command.y;
              player.vx = player.vy = player.walkTime = 0;
            } else services.log("Event transfer destination is blocked.");
          }
        }
      }
    }
    /* @function events.update.53 — Advances this system using the current state and elapsed time. Inputs: dt; player. Updates: state player; frame budget; state timer remaining; direction; direction time. Uses: active page; forced routes has; services motion delta; services behavior can move. */ function update(
      dt,
      player,
    ) {
      frameNumber++;
      state.player = player;
      frameBudget = 4096;
      if (state.timer?.running)
        state.timer.remaining = Math.max(0, state.timer.remaining - dt);
      // Only moving pages need motion work. Positions belong to the isolated
      // session; authoring positions remain unchanged after a playtest.
      for (const event of events) {
        const p = event.pages[activePage(event, state)];
        if (!p) continue;
        if (forcedRoutes.has(event)) continue;
        if (p.behavior && root.FrontierActorBehavior) {
          const elapsed = services.motionDelta
            ? services.motionDelta(event, p, dt)
            : dt;
          if (services.behaviorCanMove?.(event) !== false)
            root.FrontierActorBehavior.update(
              event,
              p,
              elapsed,
              services.behaviorTarget
                ? services.behaviorTarget(event, p, player)
                : player,
              services,
              wander,
            );
          continue;
        }
        if (p.mz && root.FrontierEventMotion) {
          const elapsed = services.motionDelta
            ? services.motionDelta(event, p, dt)
            : dt;
          root.FrontierEventMotion.update(
            event,
            p,
            elapsed,
            player,
            {
              ...services,
              routeSwitch:
                /* @function events.routeSwitch.54 — Returns state switches set using key, value. Inputs: key; value. Uses: state switches set. Returns: state switches set using key, value. */ (
                  key,
                  value,
                ) => state.switches.set(key, value),
            },
            wander,
          );
          continue;
        }
        if (!p.movement || p.movement === "stationary") continue;
        const elapsed = services.motionDelta
          ? services.motionDelta(event, p, dt)
          : dt;
        if (!elapsed) continue;
        const bounds = services.bounds?.() || { width: 48, height: 48 };
        let direction;
        if (p.movement === "approach")
          direction = { x: player.x - event.x, y: player.y - event.y };
        else {
          direction = wander.get(event.id);
          if (!direction || direction.time <= 0) {
            const a = Math.random() * Math.PI * 2;
            direction = { x: Math.cos(a), y: Math.sin(a), time: 2 };
            wander.set(event.id, direction);
          }
          direction.time -= elapsed;
        }
        const length = Math.hypot(direction.x, direction.y);
        if (length < 0.5 && p.movement === "approach") continue;
        const x = event.x + (direction.x / (length || 1)) * 0.5 * elapsed,
          y = event.y + (direction.y / (length || 1)) * 0.5 * elapsed;
        if (
          x >= 1 &&
          y >= 1 &&
          x <= bounds.width - 1 &&
          y <= bounds.height - 1 &&
          (p.through || services.canStand(x, y, event.id))
        ) {
          event.x = x;
          event.y = y;
        }
      }
      for (const [entity, forced] of forcedRoutes) {
        root.FrontierEventMotion.update(
          entity,
          forced.page,
          dt,
          player,
          {
            ...services,
            routeSwitch:
              /* @function events.routeSwitch.55 — Returns state switches set using key, value. Inputs: key; value. Uses: state switches set. Returns: state switches set using key, value. */ (
                key,
                value,
              ) => state.switches.set(key, value),
          },
          forced.controllers,
        );
        if (
          forced.controllers.get(entity.id)?.custom?.done ||
          forced.controllers.get(entity.id)?.routeError
        )
          forcedRoutes.delete(entity);
      }
      loadContext(mainContext);
      runInterpreter(dt, player);
      saveContext();
      /* October 12, 2026: a transfer command clears execution, but its cinematic now owns the frame. Do not interpret that cleared slot as permission to restart an autorun/touch event or queue another exit before the next application pause gate. */
      if (services.transitionPending?.()) return;
      const candidates = events.filter(
        /* @function events.callback.56 — Returns activation frame get using event or 0 is at most frame number and chain equals "parallel". Inputs: event. Uses: activation frame get; active page. Returns: activation frame get using event or 0 is at most frame number and chain equals "parallel". */ (
          event,
        ) =>
          (activationFrame.get(event) || 0) <= frameNumber &&
          event.pages[activePage(event, state)]?.trigger === "parallel",
      );
      for (const [id, context] of parallelContexts) {
        const event = events.find(
          /* @function events.callback.57 — Returns e id equals id. Inputs: e. Returns: e id equals id. */ (
            e,
          ) => e.id === id,
        );
        if (
          !event ||
          event.pages[activePage(event, state)]?.trigger !== "parallel"
        )
          parallelContexts.delete(id);
      }
      let nextParallelCursor = 0;
      for (let n = 0; n < candidates.length && frameBudget > 0; n++) {
        const event = candidates[(parallelCursor + n) % candidates.length];
        if (
          !events.includes(event) ||
          (activationFrame.get(event) || 0) > frameNumber
        )
          continue;
        const pageIndex = activePage(event, state);
        let context = parallelContexts.get(event.id);
        if (!context || context.pageIndex !== pageIndex) {
          context = freshContext();
          context.pageIndex = pageIndex;
          parallelContexts.set(event.id, context);
        }
        loadContext(context);
        if (!execution && !context.unsupported) {
          if (!start(event, "parallel")) context.unsupported = true;
        }
        runInterpreter(dt, player);
        saveContext();
        if (frameBudget === 0)
          nextParallelCursor = (parallelCursor + n + 1) % candidates.length;
      }
      parallelCursor = nextParallelCursor;
      loadContext(mainContext);
      // Autorun retains the main interpreter; parallel pages own separate contexts.
      if (!execution)
        for (let n = 0; n < events.length; n++) {
          const i = (automaticCursor + n) % events.length,
            event = events[i],
            index = activePage(event, state),
            trigger = event.pages[index]?.trigger;
          if (trigger === "autorun") {
            start(event, trigger);
            automaticCursor = (i + 1) % events.length;
            break;
          }
        }
      for (const event of events) {
        const pageIndex = activePage(event, state),
          trigger = event.pages[pageIndex]?.trigger;
        // One bounded interpreter, one automatic start per update; commands
        // cannot create an unbounded synchronous autorun/parallel loop.
        const inside =
          Math.hypot(event.x - player.x, event.y - player.y) <= 0.65 &&
          Math.abs((player.z || 0) - (player.groundZ || 0)) < 0.65;
        const key = event.id + ":" + pageIndex;
        for (const old of touched)
          if (old.startsWith(event.id + ":") && (old !== key || !inside))
            touched.delete(old);
        const touchTrigger =
          trigger === "playerTouch" || trigger === "eventTouch";
        if (
          inside &&
          touchTrigger &&
          !touched.has(key) &&
          !execution &&
          start(event, trigger)
        )
          touched.add(key);
      }
    }
    return {
      // Transfer adoption is atomic and cannot displace an active destination event.
      /* @function events.captureContinuation.58 — Handles capture continuation within events. Inputs: no explicit arguments; uses enclosing module state. Uses: error; root frontier event continuation capture; events find. Returns: root frontier event continuation capture using execution, events find using a callback, waiting. */ captureContinuation() {
        if (currentContext !== mainContext || message || routeWait)
          throw Error(
            "Continuation requires a main event without active message or route.",
          );
        return root.FrontierEventContinuation.capture(
          execution,
          events.find(
            /* @function events.callback.59 — Returns e id equals chain. Inputs: e. Returns: e id equals chain. */ (
              e,
            ) => e.id === execution?.eventId,
          ),
          waiting,
          choiceBranches,
        );
      },
      /* @function events.restoreContinuation.60 — Handles restore continuation within events. Inputs: value. Updates: execution; waiting; choice branches. Uses: error; root frontier event continuation validate; save context. */ restoreContinuation(
        value,
      ) {
        if (currentContext !== mainContext || execution || message)
          throw Error("Destination interpreter is busy.");
        const checked = root.FrontierEventContinuation.validate(value);
        execution = {
          originMap: checked.originMap,
          sourceEvent: checked.source,
          eventId: checked.source.id,
          name: checked.source.displayName ?? checked.source.name,
          pageIndex: checked.pageIndex,
          trigger: checked.source.pages[0].trigger,
          commands: checked.commands,
          index: checked.index,
        };
        waiting = checked.waiting;
        choiceBranches = checked.choices;
        saveContext();
      },
      captureBehaviors:
        /* @function events.captureBehaviors.61 — Returns chain or a list of . Inputs: no explicit arguments; uses enclosing module state. Uses: root frontier actor behavior capture. Returns: chain or a list of . */ () =>
          root.FrontierActorBehavior?.capture(events, wander) || [],
      restoreBehaviors:
        /* @function events.restoreBehaviors.62 — Returns chain. Inputs: value. Uses: root frontier actor behavior restore; services bounds. Returns: chain. */ (
          value,
        ) =>
          root.FrontierActorBehavior?.restore(
            value,
            events,
            wander,
            services.bounds?.(),
          ),
      replaceEvent,
      get replacementRevision /* @function events.replacementRevision.63 — Handles replacement revision within events. Inputs: no explicit arguments; uses enclosing module state. Returns: replacement revision. */() {
        return replacementRevision;
      },
      replacementReferences:
        /* @function events.replacementReferences.64 — Returns structured clone using a list of spread element. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone; replacement references values. Returns: structured clone using a list of spread element. */ () =>
          structuredClone([...replacementReferences.values()]),
      replacementDebug:
        /* @function events.replacementDebug.65 — Returns structured clone using replacement trace. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using replacement trace. */ () =>
          structuredClone(replacementTrace),
      invalidatePages:
        /* @function events.invalidatePages.66 — Returns chain. Inputs: event. Uses: state page cache invalidate. Returns: chain. */ (
          event,
        ) => state.pageCache?.invalidate(event),
      events,
      state,
      activePage:
        /* @function events.activePage.67 — Returns active page using event, state. Inputs: event. Uses: active page. Returns: active page using event, state. */ (
          event,
        ) => activePage(event, state),
      start,
      update,
      parallelDebug:
        /* @function events.parallelDebug.68 — Returns a list of spread element map using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element map. Returns: a list of spread element map using a callback. */ () =>
          [...parallelContexts].map(
            /* @function events.callback.69 — Returns a record containing id, page, command, waiting, message. Inputs: array pattern. Returns: a record containing id, page, command, waiting, message. */ ([
              id,
              c,
            ]) => ({
              id,
              page: c.pageIndex + 1,
              command: c.execution?.index,
              waiting: c.waiting,
              message: c.message?.text,
            }),
          ),
      get playerRouteActive /* @function events.playerRouteActive.70 — Handles player route active within events. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element some; forced routes keys. Returns: a list of spread element some using a callback. */() {
        return [...forcedRoutes.keys()].some(
          /* @function events.callback.71 — Returns the inverse of events includes using e. Inputs: e. Uses: events includes. Returns: the inverse of events includes using e. */ (
            e,
          ) => !events.includes(e),
        );
      },
      /* @function events.choose.72 — Handles choose within events. Inputs: index. Uses: respond. Returns: respond using a callback. */ choose(
        index,
      ) {
        return respond(
          /* @function events.callback.73 — Provides the callback for respond. Inputs: no explicit arguments; uses enclosing module state. Uses: number is integer; choice branches set; state variables set; publish message. Returns: without a result. */ () => {
            if (
              !message?.options ||
              !Number.isInteger(index) ||
              index < 0 ||
              index >= message.options.length
            )
              return;
            if (message.choicePrompt) choiceBranches.set(message.indent, index);
            else state.variables.set(message.key, index + 1);
            publishMessage(null);
          },
        );
      },
      /* @function events.inputNumber.74 — Handles input number within events. Inputs: value. Uses: respond. Returns: respond using a callback. */ inputNumber(
        value,
      ) {
        return respond(
          /* @function events.callback.75 — Provides the callback for respond. Inputs: no explicit arguments; uses enclosing module state. Uses: number is integer; state variables set; publish message. Returns: false; true. */ () => {
            if (
              !message?.numberInput ||
              !Number.isInteger(value) ||
              value < 0 ||
              value >= 10 ** message.digits
            )
              return false;
            state.variables.set(message.variable, value);
            publishMessage(null);
            return true;
          },
        );
      },
      /* @function events.cancelChoice.76 — Handles cancel choice within events. Inputs: no explicit arguments; uses enclosing module state. Uses: respond. Returns: respond using a callback. */ cancelChoice() {
        return respond(
          /* @function events.callback.77 — Provides the callback for respond. Inputs: no explicit arguments; uses enclosing module state. Uses: choice branches set; publish message. Returns: false; true. */ () => {
            if (!message?.choicePrompt || message.cancelType === -1)
              return false;
            choiceBranches.set(message.indent, message.cancelType);
            publishMessage(null);
            return true;
          },
        );
      },
      /* @function events.debug.78 — Handles debug within events. Inputs: no explicit arguments; uses enclosing module state. Uses: events map; a list of spread element map. Returns: a record containing pageCache, pageChecks, diagnosticsEnabled, eventBudgets, execution, waiting, message, parallel. */ debug() {
        return {
          pageCache: state.pageCache ? { ...state.pageCache.stats } : null,
          pageChecks: state.pageChecks,
          diagnosticsEnabled: state.diagnosticsEnabled,
          eventBudgets: events.map(diagnostics),
          execution: execution
            ? {
                eventId: execution.eventId,
                page: execution.pageIndex + 1,
                command: execution.index,
                trigger: execution.trigger,
              }
            : null,
          waiting,
          message: messageOwner?.message?.text,
          parallel: [...parallelContexts].map(
            /* @function events.callback.79 — Returns a record containing id, page, command, waiting. Inputs: array pattern. Returns: a record containing id, page, command, waiting. */ ([
              id,
              c,
            ]) => ({
              id,
              page: c.pageIndex + 1,
              command: c.execution?.index,
              waiting: c.waiting,
            }),
          ),
          switches: [...state.switches],
          variables: [...state.variables],
          selfSwitches: [...state.selfSwitches],
          pages: events.map(
            /* @function events.callback.80 — Returns a record containing id, name, activePage, conditions. Inputs: e. Uses: active page; e pages map. Returns: a record containing id, name, activePage, conditions. */ (
              e,
            ) => ({
              id: e.id,
              name: e.name,
              activePage: activePage(e, state) + 1,
              conditions: e.pages.map(
                /* @function events.callback.81 — Returns a record containing page, passes, conditions. Inputs: p; i. Uses: active page. Returns: a record containing page, passes, conditions. */ (
                  p,
                  i,
                ) => ({
                  page: i + 1,
                  passes: activePage({ id: e.id, pages: [p] }, state) >= 0,
                  conditions: [p.condition, ...(p.conditions || [])],
                }),
              ),
            }),
          ),
        };
      },
      /* @function events.next.82 — Handles next within events. Inputs: no explicit arguments; uses enclosing module state. Uses: respond. Returns: respond using a callback. */ next() {
        return respond(
          /* @function events.callback.83 — Provides the callback for respond. Inputs: no explicit arguments; uses enclosing module state. Uses: publish message. Returns: without a result. */ () => {
            if (message?.options || message?.numberInput) return;
            publishMessage(null);
          },
        );
      },
      get busy /* @function events.busy.84 — Handles busy within events. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of the inverse of chain or the inverse of the inverse of main context execution and main context execution trigger does not equal "parallel". */() {
        return (
          !!messageOwner?.message ||
          (!!mainContext.execution &&
            mainContext.execution.trigger !== "parallel")
        );
      },
      get message /* @function events.message.85 — Handles message within events. Inputs: no explicit arguments; uses enclosing module state. Returns: chain or null. */() {
        return messageOwner?.message || null;
      },
    };
  }
  root.FrontierEvents = {
    create,
    page,
    validate,
    activePage,
    createSession,
    graphics,
    limits,
    diagnostics,
  };
})(typeof window === "undefined" ? globalThis : window);
