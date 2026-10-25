/* Serializable extension state shared across map travel, separate from scenery actors. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function event-state.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event state. */
(/* @function event-state.installReviewed — Installs portable extension-state services shared across map travel. Persistent gameplay state is separated from scenery actor objects and renderer lifetimes. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  // Sparse named values: absent skills/reputation are zero; absent factions are false.
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-state.entries.2 — Sparse named values: absent skills/reputation are zero; absent factions are false. Inputs: value; name; assignment pattern. Uses: array is array; error; keys has; number is finite. Returns: rows map using a callback. */
  /* @function eventState.reviewedentries_2 — Validates sparse named saved values. Inputs: optional array value, diagnostic name and boolean flag. Returns detached key/value tuples, defaulting absent value to an empty list. Allows at most 2000 unique nonempty keys up to 120 characters; numeric values must be finite and magnitude at most 1,000,000, or boolean values when requested. Throws before adoption on malformed rows; no state mutation. */ function entries(
    value,
    name,
    boolean = false,
  ) {
    const rows = value ?? [];
    if (!Array.isArray(rows) || rows.length > 2000)
      throw Error("Invalid saved " + name);
    const keys = new Set();
    for (const e of rows) {
      if (
        !Array.isArray(e) ||
        e.length !== 2 ||
        typeof e[0] !== "string" ||
        !e[0] ||
        e[0].length > 120 ||
        keys.has(e[0]) ||
        (boolean
          ? typeof e[1] !== "boolean"
          : !Number.isFinite(e[1]) || Math.abs(e[1]) > 1000000)
      )
        throw Error("Invalid saved " + name + " entry");
      keys.add(e[0]);
    }
    return rows.map(
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-state.callback.3 — Returns a list of spread element. Inputs: e. Returns: a list of spread element. */
  /* @function eventState.reviewedcallback_3 — Copies a previously validated sparse pair. Inputs: two-element row e. Returns a new tuple so saved rows cannot alias the caller array. Values are validated primitives; no deep-copy requirement or mutation. */ (
        e,
      ) => [...e],
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-state.validate.4 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: array is array; actors some; error; keys has. Returns: a record containing skills, reputation, factions, gold, partyActors, quests, timer. */
  /* @function eventState.reviewedvalidate_4 — Checks portable gameplay extension state before adoption. Inputs: optional saved record. Returns detached skills/reputation/factions, gold, party actor IDs, JSON-normalized quest tuples and timer. Rejects duplicate/oversize IDs, party above 5000, quests above 2000, gold outside integer 0-99,999,999 and timer outside finite 0-5999 seconds. Missing fields receive defaults; quest contents are portable JSON rather than a quest-specific schema. No live state mutation; validation/JSON errors propagate. */ function validate(
    value = {},
  ) {
    const actors = value.partyActors ?? [],
      quests = value.quests ?? [];
    if (
      !Array.isArray(actors) ||
      actors.length > 5000 ||
      actors.some(
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-state.callback.5 — Returns typeof id does not equal "string" or the inverse of id or id length is greater than 120. Inputs: id. Returns: typeof id does not equal "string" or the inverse of id or id length is greater than 120. */
  /* @function eventState.reviewedcallback_5 — Detects an invalid saved party actor identifier. Inputs: id. Returns true unless nonempty string length at most 120. No mutation; duplicate membership is checked separately by validate. */ (
          id,
        ) => typeof id !== "string" || !id || id.length > 120,
      ) ||
      new Set(actors).size !== actors.length
    )
      throw Error("Invalid saved party membership.");
    if (!Array.isArray(quests) || quests.length > 2000)
      throw Error("Invalid saved quest state.");
    const keys = new Set();
    for (const entry of quests) {
      if (
        !Array.isArray(entry) ||
        entry.length !== 2 ||
        typeof entry[0] !== "string" ||
        !entry[0] ||
        entry[0].length > 120 ||
        keys.has(entry[0])
      )
        throw Error("Invalid saved quest entry.");
      keys.add(entry[0]);
    }
    const timer = value.timer ?? { running: false, remaining: 0 };
    if (
      typeof timer.running !== "boolean" ||
      !Number.isFinite(timer.remaining) ||
      timer.remaining < 0 ||
      timer.remaining > 5999
    )
      throw Error("Invalid saved timer.");
    const gold = value.gold ?? 0;
    if (!Number.isInteger(gold) || gold < 0 || gold > 99999999)
      throw Error("Invalid saved gold.");
    return {
      skills: entries(value.skills, "skills"),
      reputation: entries(value.reputation, "reputation"),
      factions: entries(value.factions, "factions", true),
      gold,
      partyActors: [...actors],
      quests: root.FrontierEventSchema.json(quests),
      timer: { running: timer.running, remaining: timer.remaining },
    };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-state.capture.6 — Handles capture within event state. Inputs: state. Uses: validate. Returns: validate using a record containing skills, reputation, factions, partyActors, quests, timer, gold. */
  /* @function eventState.reviewedcapture_6 — Creates a validated portable snapshot of extension gameplay state. Inputs: live state containing Maps for skills/reputation/factions/quests, Set actors, gold and timer. Returns detached plain arrays/records through validate. Does not alter session; malformed collections or validation failures throw rather than exporting invalid state. */ function capture(
    state,
  ) {
    return validate({
      skills: [...(state.skills ?? [])],
      reputation: [...(state.reputation ?? [])],
      factions: [...(state.factions ?? [])],
      partyActors: [...state.actors],
      quests: [...state.quests],
      timer: state.timer,
      gold: state.gold,
    });
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-state.restore.7 — Applies saved state to this system. Inputs: state; value. Updates: state skills; state reputation; state factions; state gold; state actors. Uses: validate. */
  /* @function eventState.reviewedrestore_7 — Adopts a fully validated extension snapshot. Inputs: mutable live state and saved value. Returns undefined; after validation creates new Maps/Sets and timer record and updates gold. Validation errors leave live fields untouched. Does not restore actors physical positions or rendering resources; those belong to separate cell/session restoration. */ function restore(
    state,
    value,
  ) {
    const checked = validate(value);
    state.skills = new Map(checked.skills);
    state.reputation = new Map(checked.reputation);
    state.factions = new Map(checked.factions);
    state.gold = checked.gold;
    state.actors = new Set(checked.partyActors);
    state.quests = new Map(checked.quests);
    state.timer = { ...checked.timer };
  }
  root.FrontierEventState = { validate, capture, restore };
})(typeof window === "undefined" ? globalThis : window);
