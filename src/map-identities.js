/* Stable numeric MZ map references coexist with engine string identities. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-identities.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier map identities. */
(/* @function map-identities.installReviewed — Installs stable numeric MZ map identity assignment alongside engine string IDs. Registration does not select a map, duplicate a cell or impose a rendering count cap. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function map-identities.assign.2 — Handles assign within map identities. Inputs: maps. Uses: number is integer; used has; error; used add. Returns: maps map using a callback. */
  /* @function map-identities.reviewedassign_2 — Assigns stable numeric MZ identities to a catalog copy. Inputs: map array with optional mzId. Returns shallow copied map records preserving existing IDs and filling missing smallest free values1-999999. Validates all supplied IDs for integer/range/uniqueness before assignment, rejects exhaustion. Does not mutate original records or deep-copy worlds. */ function assign(
    maps,
  ) {
    const used = new Set();
    for (const map of maps) {
      if (map.mzId === undefined) continue;
      if (
        !Number.isInteger(map.mzId) ||
        map.mzId < 1 ||
        map.mzId > 999999 ||
        used.has(map.mzId)
      )
        throw Error("Invalid or duplicate numeric map ID.");
      used.add(map.mzId);
    }
    let next = 1;
    return maps.map(
      /* Historical contract retained; October 14 reviewed explanation follows. @function map-identities.callback.3 — Provides the callback for maps map. Inputs: map. Uses: used has; error; used add. Returns: a record containing copied fields; a record containing copied fields, mzId. */
  /* @function map-identities.reviewedcallback_3 — Copies one map and fills missing numeric identity. Inputs: map and captured used/next allocator. Returns shallow record; existing mzId retained, otherwise smallest free ID allocated. Mutates local allocator only; exhaustion throws. World reference remains shared. */ (
        map,
      ) => {
        if (map.mzId !== undefined) return { ...map };
        while (used.has(next)) next++;
        if (next > 999999) throw Error("Numeric map IDs exhausted.");
        used.add(next);
        return { ...map, mzId: next++ };
      },
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function map-identities.resolve.4 — Handles resolve within map identities. Inputs: maps; id. Uses: maps find. Returns: maps find using a callback. */
  /* @function map-identities.reviewedresolve_4 — Finds map by exact numeric MZ identity. Inputs: catalog maps and id. Returns original matching map or undefined; no coercion/clone/mutation. Catalog must already have validated unique IDs. */ function resolve(
    maps,
    id,
  ) {
    return maps.find(
      /* Historical contract retained; October 14 reviewed explanation follows. @function map-identities.callback.5 — Returns map mz id equals id. Inputs: map. Returns: map mz id equals id. */
  /* @function map-identities.reviewedcallback_5 — Matches numeric identity exactly. Inputs: map and captured id. Returns map.mzId strict equality; no mutation. */ (
        map,
      ) => map.mzId === id,
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function map-identities.remapIncoming.6 — Handles remap incoming within map identities. Inputs: existing; incoming. Updates: c parameters at 1. Uses: existing map; assign using structured clone using incoming map; assign; structured clone. Returns: maps. */
  /* @function map-identities.reviewedremapIncoming_6 — Clones imported maps and reallocates numeric IDs away from host catalog. Inputs: validated existing/incoming arrays. Returns deep-cloned incoming records with new numeric IDs and direct MZ Transfer Player command201 references remapped within incoming set. Does not alter caller arrays; variable-based transfers are unchanged. Initial incoming IDs validate via assign; combined exhaustion requires outer project validation because this allocator does not itself bound the final next value. Clone/schema errors propagate. */ function remapIncoming(
    existing,
    incoming,
  ) {
    const used = new Set(
        existing.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function map-identities.callback.7 — Returns m mz id. Inputs: m. Returns: m mz id. */
  /* @function map-identities.reviewedcallback_7 — Reads existing numeric map ID for import reservation. Inputs: host map m. Returns mzId; no mutation. Expects validated assigned catalog. */ (
            m,
          ) => m.mzId,
        ),
      ),
      mapping = new Map();
    let next = 1; // Imports own their clones; remapping must not mutate the caller's project.
    const maps = assign(structuredClone(incoming)).map(
      /* Historical contract retained; October 14 reviewed explanation follows. @function map-identities.callback.8 — Provides the callback for assign using structured clone using incoming map. Inputs: m. Uses: used has; mapping set; used add. Returns: a record containing copied fields, mzId. */
  /* @function map-identities.reviewedcallback_8 — Allocates one imported numeric map identity. Inputs: cloned m and captured used/mapping/next state. Returns new shallow record with free ID, updates local old-to-new mapping. Worlds are already deep-cloned by caller; final numeric upper-bound validation belongs to outer adoption. */ (
        m,
      ) => {
        while (used.has(next)) next++;
        mapping.set(m.mzId, next);
        used.add(next);
        return { ...m, mzId: next++ };
      },
    );
    for (const m of maps)
      for (const e of m.world.events || [])
        for (const p of e.pages)
          for (const c of p.commands)
            if (
              c.type === "mz" &&
              c.code === 201 &&
              c.parameters[0] === 0 &&
              mapping.has(c.parameters[1])
            )
              c.parameters[1] = mapping.get(c.parameters[1]);
    return maps;
  }
  root.FrontierMapIdentities = { assign, resolve, remapIncoming };
})(typeof window === "undefined" ? globalThis : window);
