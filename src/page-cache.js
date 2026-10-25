/* Session-local page selection cache. Authored page definitions are immutable
 * during playtest; call invalidate after deliberate runtime definition changes.
 * Timer/spatial/unknown expressions bypass caching. Collection replacement and
 * set/add/delete/clear mutations invalidate state snapshots, including restores.
 * Weak keys let ended sessions/events release cache entries without a global list. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function page-cache.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier page cache. */
(/* @function page-cache.installReviewed — Installs session-local page-selection cache/invalidation services. Immutable authored pages permit cached matching, while timers/spatial/unknown conditions bypass it and tracked collection changes invalidate snapshots. Weak ownership releases ended sessions. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  const observed = new WeakMap(),
    collections = [
      "switches",
      "selfSwitches",
      "variables",
      "inventory",
      "actors",
      "quests",
      "skills",
      "reputation",
      "factions",
    ];
  // A fixed mutation ring avoids retaining every historical key. If a reader falls
  // behind the ring, it rescans conservatively rather than using incomplete history.
  const historySize = 256;
  /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.observe.2 — Handles observe within page cache. Inputs: value. Updates: record. Uses: observed get; observed set; object define property. Returns: null; record. */
  /* @function pageCache.reviewedobserve_2 — Registers mutation tracking on a session collection once. Inputs: Map/Set-like object value. Returns revision/ring record or null for absent/nonobject. WeakMap owns observer; wraps available set/add/delete/clear methods with configurable instance properties and retains256 recent changed keys. Mutates collection methods, not entries. Assumes extensible standard Map/Set semantics; defineProperty or collection errors propagate and setup can be partial on failure. */ function observe(
    value,
  ) {
    if (!value || typeof value !== "object") return null;
    let record = observed.get(value);
    if (record) return record;
    record = { revision: 0, changes: new Array(historySize) };
    observed.set(value, record);
    for (const name of ["set", "add", "delete", "clear"]) {
      if (typeof value[name] !== "function") continue;
      const original = value[name];
      Object.defineProperty(value, name, {
        configurable: true,
        writable: true,
        value:
          /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.value.3 — Handles value within page cache. Inputs: rest element. Updates: record changes at record revision % history size. Uses: this has; object is; this get; original apply. Returns: result. */
  /* @function pageCache.reviewedvalue_3 — Wraps one collection mutator and records actual change. Inputs: original method arguments through rest args and correct collection this. Returns original method result. Compares prior membership/value, calls original first, increments revision and records key(or null for clear) only on change. Original error creates no revision; mutating nested entry objects bypasses this wrapper and requires explicit invalidation. */ function (
            ...args
          ) {
            const changed =
              name === "clear"
                ? this.size > 0
                : name === "delete"
                  ? this.has(args[0])
                  : name === "add"
                    ? !this.has(args[0])
                    : !this.has(args[0]) ||
                      !Object.is(this.get(args[0]), args[1]);
            const result = original.apply(this, args);
            if (changed) {
              record.revision++;
              record.changes[record.revision % historySize] =
                name === "clear" ? null : args[0];
            }
            return result;
          },
      });
    }
    return record;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.stableExpression.4 — Handles stable expression within page cache. Inputs: e. Uses: e children every; stable expression; a list of "compare", "switch", "selfSwitch", "item" includes. Returns: false; e children every using stable expression. */
  /* @function pageCache.reviewedstableExpression_4 — Classifies dependency-supported expression trees for caching. Inputs: expression e. Returns true for recursively supported boolean groups/not and compare/switch/selfSwitch/item/actor/quest/gold/skill/reputation/faction leaves; false absent/unknown. No mutation; timer/spatial/future kinds deliberately dynamic until dependencies defined. */ function stableExpression(
    e,
  ) {
    if (!e) return false;
    if (e.type === "all" || e.type === "any")
      return e.children.every(stableExpression);
    if (e.type === "not") return stableExpression(e.child);
    return [
      "compare",
      "switch",
      "selfSwitch",
      "item",
      "actor",
      "quest",
      "gold",
      "skill",
      "reputation",
      "faction",
    ].includes(e.type);
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.stablePage.5 — Handles stable page within page cache. Inputs: page. Uses: a list of page condition, spread element every. Returns: a list of page condition, spread element every using a callback. */
  /* @function pageCache.reviewedstablePage_5 — Checks whether all page conditions support cache invalidation. Inputs: validated page. Returns boolean across primary/additional conditions, recursively checking expression trees. No mutation; unknown/direct unsupported condition types bypass caching. */ function stablePage(
    page,
  ) {
    return [page.condition, ...(page.conditions || [])].every(
      /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.callback.6 — Returns c type equals "expression" selects stable expression using c expression or a list of "always", "switch", "selfSwitch", "variable" includes using c type. Inputs: c. Uses: stable expression; a list of "always", "switch", "selfSwitch", "variable" includes. Returns: c type equals "expression" selects stable expression using c expression or a list of "always", "switch", "selfSwitch", "variable" includes using c type. */
  /* @function pageCache.reviewedcallback_6 — Classifies one page condition for stable caching. Inputs: c. Returns expression stability or membership in supported simple condition set. No mutation; expects validated condition record. */ (
        c,
      ) =>
        c.type === "expression"
          ? stableExpression(c.expression)
          : [
              "always",
              "switch",
              "selfSwitch",
              "variable",
              "item",
              "actor",
            ].includes(c.type),
    );
  }
  // Compile only the state keys actually read by conditions. New expression types
  // remain dynamic until their dependencies are explicitly supported here.
  /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.dependencies.7 — remain dynamic until their dependencies are explicitly supported here. Inputs: event. Uses: object from entries; collections map; expression; add. Returns: a record containing keys, gold. */
  /* @function pageCache.revieweddependencies_7 — Collects exact state keys read by event page conditions. Inputs: validated stable event. Returns per-collection key Sets and gold dependency flag. Self-switch keys prefix event.id; compare variable operands included. No source/state mutation; local Sets populated. Must extend together with stableExpression when adding cacheable kinds. */ function dependencies(
    event,
  ) {
    const keys = Object.fromEntries(
      collections.map(
        /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.callback.8 — Returns a list of k, a new set. Inputs: k. Returns: a list of k, a new set. */
  /* @function pageCache.reviewedcallback_8 — Creates one empty collection dependency Set. Inputs: collection name k. Returns key/Set tuple for local record construction. No state mutation. */ (
          k,
        ) => [k, new Set()],
      ),
    );
    let gold = false;
    const add =
      /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.add.9 — Returns chain. Inputs: type; key. Uses: keys at a record containing switch, selfSwitch, variable, item, actor, quest, skill, reputation at type add. Returns: chain. */
  /* @function pageCache.reviewedadd_9 — Records one condition dependency key. Inputs: supported type/key and captured event/local Sets. Returns Set.add result or undefined for untracked type; self-switch key uses eventId:key. Mutates only local dependency Sets, not gameplay. */ (
        type,
        key,
      ) =>
        keys[
          {
            switch: "switches",
            selfSwitch: "selfSwitches",
            variable: "variables",
            item: "inventory",
            actor: "actors",
            quest: "quests",
            skill: "skills",
            reputation: "reputation",
            faction: "factions",
          }[type]
        ]?.add(type === "selfSwitch" ? event.id + ":" + key : key);
    /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.expression.10 — Handles expression within page cache. Inputs: e. Updates: gold. Uses: e children for each; expression; add. */
  /* @function pageCache.reviewedexpression_10 — Traverses stable expression for dependency compilation. Inputs: e. Returns undefined; recursively visits groups/not, captures variable operands or gold flag and adds other leaf keys. No authored mutation; validated shape assumed. */ function expression(
      e,
    ) {
      if (e.type === "all" || e.type === "any") e.children.forEach(expression);
      else if (e.type === "not") expression(e.child);
      else if (e.type === "compare") {
        for (const operand of [e.left, e.right])
          if (operand.kind === "variable") add("variable", operand.key);
      } else if (e.type === "gold") gold = true;
      else add(e.type, e.key);
    }
    for (const page of event.pages)
      for (const c of [page.condition, ...(page.conditions || [])])
        if (c.type === "expression") expression(c.expression);
        else if (c.type !== "always") add(c.type, c.key);
    return { keys, gold };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.affected.11 — Handles affected within page cache. Inputs: record; previous; keys. Uses: keys has. Returns: false; true. */
  /* @function pageCache.reviewedaffected_11 — Tests whether relevant collection keys changed since cache revision. Inputs: observer record, previous revision and dependency key Set. Returns false for empty/nochange, true if history exceeded256 or any clear/relevant key occurred, otherwise false. No mutation; ring overflow forces conservative rescan rather than stale result. */ function affected(
    record,
    previous,
    keys,
  ) {
    if (!keys.size || record.revision === previous) return false;
    if (record.revision - previous > historySize) return true;
    for (let revision = previous + 1; revision <= record.revision; revision++) {
      const key = record.changes[revision % historySize];
      if (key === null || keys.has(key)) return true;
    }
    return false;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.create.12 — Builds a new instance and its public operations from the supplied configuration. Inputs: state. Returns: a record containing selection, stats, invalidate. */
  /* @function pageCache.reviewedcreate_12 — Creates session-owned event page selector cache. Inputs: mutable session state with observed collections/gold. Returns selection/stats/invalidate API. Private event WeakMap retains compiled dependencies/results; collection tracking starts lazily on selection. Stats record is live diagnostic reference; no scan performed at construction. */ function create(
    state,
  ) {
    let entries = new WeakMap();
    const stats = { hits: 0, misses: 0, dynamic: 0, invalidations: 0 };
    /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.selection.13 — Handles selection within page cache. Inputs: event; scan. Updates: entry; entry dependencies; entry refs; entry versions; entry gold. Uses: entries get; event pages every; dependencies; entries set. Returns: scan using ; entry result. */
  /* @function pageCache.reviewedselection_13 — Returns cached or freshly scanned page selection. Inputs: event and synchronous scan callback. Returns scan result, caching only stable page definitions. Recompiles when page-array identity changes; checks collection identities/revisions/relevant keys and gold, updates hit/miss/dynamic counters. Observes collection mutators lazily; authored in-place page or nested-state changes require invalidate. scan exceptions propagate before result adoption; callback must be side-effect-free for cache correctness. */ function selection(
      event,
      scan,
    ) {
      let entry = entries.get(event);
      if (!entry || entry.pages !== event.pages) {
        entry = {
          pages: event.pages,
          stable: event.pages.every(stablePage),
          refs: null,
        };
        if (entry.stable) entry.dependencies = dependencies(event);
        entries.set(event, entry);
      }
      if (!entry.stable) {
        stats.dynamic++;
        return scan();
      }
      const refs = collections.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.callback.14 — Returns state at key. Inputs: key. Returns: state at key. */
  /* @function pageCache.reviewedcallback_14 — Reads one current session collection reference. Inputs: key and captured state. Returns state[key]; no mutation. */ (
            key,
          ) => state[key],
        ),
        records = refs.map(observe),
        versions = records.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.callback.15 — Returns chain or the fallback 0. Inputs: record. Returns: chain or the fallback 0. */
  /* @function pageCache.reviewedcallback_15 — Reads tracked collection revision. Inputs: nullable observer record. Returns revision or0 when unavailable. No mutation. */ (
            record,
          ) => record?.revision ?? 0,
        ),
        gold = state.gold ?? 0;
      if (
        entry.refs &&
        (!entry.dependencies.gold || Object.is(entry.gold, gold)) &&
        refs.every(
          /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.callback.16 — Provides the callback for refs every. Inputs: value; i. Uses: affected. Returns: the inverse of keys size or value equals entry refs at i and records at i and the inverse of affected using records at i, entry versions at i, keys. */
  /* @function pageCache.reviewedcallback_16 — Tests one collection against cached dependency snapshot. Inputs: value/index i and captured entry/records. Returns true when no relevant keys or same collection with complete unaffected change history. No mutation; replaced/missing observed collection invalidates relevant cache. */ (
            value,
            i,
          ) => {
            const keys = entry.dependencies.keys[collections[i]];
            return (
              !keys.size ||
              (value === entry.refs[i] &&
                records[i] &&
                !affected(records[i], entry.versions[i], keys))
            );
          },
        )
      ) {
        entry.refs = refs;
        entry.versions = versions;
        entry.gold = gold;
        stats.hits++;
        return entry.result;
      }
      stats.misses++;
      const result = scan();
      entry.refs = refs;
      entry.versions = versions;
      entry.gold = gold;
      entry.result = result;
      return result;
    }
    return {
      selection,
      stats,
      /* Historical contract retained; October 14 reviewed explanation follows. @function page-cache.invalidate.17 — Handles invalidate within page cache. Inputs: event. Updates: entries. Uses: entries delete. */
  /* @function pageCache.reviewedinvalidate_17 — Invalidates page results after deliberate untracked edits. Inputs: optional event. Returns undefined; increments diagnostic count and deletes one event entry or replaces all entry WeakMap. Does not clear collection observers or mutate gameplay/page data. */ invalidate(
        event,
      ) {
        stats.invalidations++;
        if (event) entries.delete(event);
        else entries = new WeakMap();
      },
    };
  }
  root.FrontierPageCache = { create };
})(typeof window === "undefined" ? globalThis : window);
