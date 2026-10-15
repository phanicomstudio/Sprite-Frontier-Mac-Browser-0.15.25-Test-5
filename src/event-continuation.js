/* Versioned interpreter continuation, used when a scene changes ownership.
 * Store the authored active page and cursor, not closures or renderer entities.
 * Revalidate/recompile before adoption; unsupported commands fail atomically.
 * Messages and forced routes need their own ownership contracts and cannot be
 * captured here. Only the main interpreter transfers between maps. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function event-continuation.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event continuation. */
(/* @function event-continuation.installReviewed — Installs versioned main-interpreter continuation serialization for cell transfer. It preserves authored page/cursor data rather than closures/render entities, and revalidates before adoption; messages/forced routes have separate ownership. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-continuation.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Updates: commands. Uses: number is integer; number is finite; array is array; error. Returns: a record containing originMap, source, commands, index, pageIndex, waiting, choices. */
  /* @function event-continuation.reviewedvalidate_2 — Revalidates/recompiles a portable main-interpreter continuation. Inputs: schema v1 saved value with one executing source page, cursor/page indices, waiting seconds and choice tuples. Returns detached validated source, compiled/preflighted commands, choice Map and cursor/timing data. Rejects invalid map IDs, wait outside 0-86400 seconds, more than 33 choice slots, invalid choice values, unsupported commands or cursor beyond command length. No live adoption; pageIndex is retained provenance and source contains only one page. Dependency/schema errors propagate. */ function validate(
    value,
  ) {
    if (
      value?.schema !== "sprite-frontier-continuation/1" ||
      !value.source ||
      !Number.isInteger(value.index) ||
      value.index < 0 ||
      !Number.isInteger(value.pageIndex) ||
      value.pageIndex < 0 ||
      !Number.isFinite(value.waiting) ||
      value.waiting < 0 ||
      value.waiting > 86400 ||
      !Array.isArray(value.choices) ||
      value.choices.length > 33
    )
      throw Error("Invalid event continuation.");
    if (
      value.originMap !== undefined &&
      (typeof value.originMap !== "string" ||
        !/^[a-z0-9_-]{1,64}$/i.test(value.originMap))
    )
      throw Error("Invalid continuation map identity.");
    const source = root.FrontierEvents.validate([value.source], new Set(), {
      width: Math.max(48, value.source.x + 1),
      height: Math.max(48, value.source.y + 1),
    })[0];
    if (source.pages.length !== 1)
      throw Error("Continuation must contain only its executing page.");
    const choices = new Map();
    for (const pair of value.choices) {
      if (
        !Array.isArray(pair) ||
        pair.length !== 2 ||
        !Number.isInteger(pair[0]) ||
        pair[0] < 0 ||
        pair[0] > 32 ||
        choices.has(pair[0]) ||
        !Number.isInteger(pair[1]) ||
        pair[1] < -2 ||
        pair[1] > 5
      )
        throw Error("Invalid continuation choice state.");
      choices.set(...pair);
    }
    let commands = root.FrontierMZCommands
      ? root.FrontierMZCommands.lower(source.pages[0].commands)
      : structuredClone(source.pages[0].commands);
    if (root.FrontierEventRuntime)
      commands = root.FrontierEventRuntime.preflight(commands);
    if (
      commands.some(
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-continuation.callback.3 — Returns c type equals "unsupported". Inputs: c. Returns: c type equals "unsupported". */
  /* @function event-continuation.reviewedcallback_3 — Detects an unsupported lowered continuation command. Inputs: c. Returns true for type unsupported. No mutation; any match prevents continuation adoption. */ (
          c,
        ) => c.type === "unsupported",
      ) ||
      value.index > commands.length
    )
      throw Error("Unsupported or incompatible continuation commands.");
    return {
      originMap: value.originMap,
      source,
      commands,
      index: value.index,
      pageIndex: value.pageIndex,
      waiting: value.waiting,
      choices,
    };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-continuation.capture.4 — Handles capture within event continuation. Inputs: execution; event; waiting; choices. Uses: error; structured clone; validate. Returns: value. */
  /* @function event-continuation.reviewedcapture_4 — Snapshots the main execution cursor across cell ownership changes. Inputs: live execution, source event, remaining wait seconds and choice Map. Returns portable schema v1 with only the executing page cloned and validated. Uses retained sourceEvent for already transferred executions; throws if execution/page absent or revalidation fails. No mutation of execution/source/choices; messages and forced routes are handled separately. */ function capture(
    execution,
    event,
    waiting,
    choices,
  ) {
    const origin = execution?.sourceEvent || event,
      page =
        execution?.sourceEvent?.pages[0] || event?.pages[execution?.pageIndex];
    if (!execution || !origin || !page)
      throw Error("No event execution to capture.");
    const source = {
      ...structuredClone(origin),
      pages: [structuredClone(page)],
    };
    const value = {
      schema: "sprite-frontier-continuation/1",
      source,
      ...(execution.originMap ? { originMap: execution.originMap } : {}),
      index: execution.index,
      pageIndex: execution.pageIndex,
      waiting,
      choices: [...choices],
    };
    validate(value);
    return value;
  }
  root.FrontierEventContinuation = { validate, capture };
})(typeof window === "undefined" ? globalThis : window);
