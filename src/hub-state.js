/* October 13, 2026: supersedes the 32-cell persistence cap. Visited cell records are compact saved state, not active render scenes. Each cell retains item/storage limits; cleanup retains its fixed record budget. The number of saved cells alone no longer rejects travel or Save/Load. */
/* 2026-10-09: compact cell persistence owns static drops and storage records.
 * These are gameplay records, never hidden render entities or independent timers.
 * Cleanup time is unpaused game time in seconds, shared across visited cells. */
(/* @function hub-state.install — Exposes pure validation and mutable gameplay operations. Inputs: root namespace. Returns: nothing; installs FrontierHubState. No allocations of model/sprite resources. */ function (
  root,
) {
  "use strict";
  const limit = 2000,
    cursors = new WeakMap();
  /* @function hub-state.settings — Validates cell cleanup and ownership-independent arrival settings. Inputs: optional settings record. Returns: normalized clone. Throws on invalid times/arrival values; world coordinates use X/Y horizontal and Z up. October 13, 2026: optional arrival Z is -100–100 metres; omitted Z retains automatic floor selection, while invalid explicit elevation rejects adoption. */
  function settings(value = {}) {
    const v = {
      protected: false,
      safe: false,
      cleanupSeconds: 3600,
      arrivals: [],
      ...value,
    };
    if (
      typeof v.protected !== "boolean" ||
      typeof v.safe !== "boolean" ||
      !Number.isFinite(v.cleanupSeconds) ||
      v.cleanupSeconds < 1 ||
      v.cleanupSeconds > 31536000 ||
      !Array.isArray(v.arrivals) ||
      v.arrivals.length > 100
    )
      throw Error("Invalid cell cleanup settings.");
    const ids = new Set();
    for (const a of v.arrivals) {
      if (
        typeof a.id !== "string" ||
        !a.id ||
        ids.has(a.id) ||
        typeof a.name !== "string" ||
        a.name.length > 80 ||
        ![a.x, a.y, a.yaw ?? 0].every(Number.isFinite) ||
        (a.z !== undefined &&
          (!Number.isFinite(a.z) || a.z < -100 || a.z > 100))
      )
        throw Error("Invalid cell arrival point.");
      ids.add(a.id);
    }
    if (v.light !== undefined && root.FrontierSpriteLighting)
      v.light = root.FrontierSpriteLighting.validate(v.light);
    return structuredClone(v);
  }
  /* @function hub-state.owner — Normalizes public/player/NPC ownership. Inputs: optional owner record. Returns: fresh record. Throws for invalid kind or missing NPC ID; does not implement theft consequences. */
  function owner(value = { kind: "public" }) {
    if (
      !["public", "player", "npc"].includes(value.kind) ||
      (value.kind === "npc" &&
        (typeof value.id !== "string" || !value.id || value.id.length > 100))
    )
      throw Error("Invalid item owner.");
    return {
      kind: value.kind,
      ...(value.kind === "npc" ? { id: value.id } : {}),
    };
  }
  /* @function hub-state.item — Checks a compact item stack without decoding its shared assets. Inputs: stack record. Returns: sanitized clone with ownership. Throws for bad IDs/count/properties or oversized data. Properties remain extensible plain JSON. */
  function item(v) {
    if (
      !v ||
      typeof v.itemId !== "string" ||
      !v.itemId ||
      v.itemId.length > 100 ||
      !Number.isSafeInteger(v.quantity) ||
      v.quantity < 1 ||
      v.quantity > 1000000
    )
      throw Error("Invalid item stack.");
    const properties = JSON.parse(
      JSON.stringify(
        v.properties || {},
        /* @function hub-state.propertyJSON — Inputs: JSON key and property value. Returns serializable value, throws nonfinite or function/symbol/undefined data so import never silently loses item properties. */ (
          key,
          value,
        ) => {
          if (
            (typeof value === "number" && !Number.isFinite(value)) ||
            ["undefined", "function", "symbol", "bigint"].includes(typeof value)
          )
            throw Error("Item properties must be finite JSON.");
          return value;
        },
      ),
    );
    if (JSON.stringify(properties).length > 8192)
      throw Error("Item properties exceed 8 KiB.");
    return {
      itemId: v.itemId,
      quantity: v.quantity,
      owner: owner(v.owner),
      properties,
      questProtected: !!v.questProtected,
    };
  }
  /* @function hub-state.empty — Creates fresh session-owned persistence. Inputs: none. Returns: a JSON-compatible empty store; no shared mutable arrays. */
  function empty() {
    return {
      schema: "sprite-frontier-hubs/1",
      clock: 0,
      cells: {},
      carried: [],
      recovery: [],
      recoveryLimit: 500,
      nextId: 1,
    };
  }
  /* @function hub-state.validate — Reconstructs bounded saved cell state before adoption. Inputs: optional serialized store. Returns: a fresh normalized store. Throws on malformed/oversized records; never changes live state. */
  function validate(value) {
    if (value === undefined) return empty();
    if (
      value.schema !== "sprite-frontier-hubs/1" ||
      !Number.isFinite(value.clock) ||
      value.clock < 0 ||
      !Number.isSafeInteger(value.nextId) ||
      value.nextId < 1 ||
      !Number.isInteger(value.recoveryLimit) ||
      value.recoveryLimit < 1 ||
      value.recoveryLimit > 2000 ||
      !value.cells ||
      typeof value.cells !== "object" ||
      Array.isArray(value.cells) ||
      !Array.isArray(value.recovery) ||
      value.recovery.length > value.recoveryLimit
    )
      throw Error("Invalid hub state.");
    const out = empty();
    out.clock = value.clock;
    out.nextId = value.nextId;
    out.recoveryLimit = value.recoveryLimit;
    const ids = new Set();
    for (const [id, c] of Object.entries(value.cells)) {
      if (
        !/^[A-Za-z0-9_-]{1,64}$/.test(id) ||
        ["__proto__", "constructor", "prototype"].includes(id) ||
        !Array.isArray(c.drops) ||
        c.drops.length > limit ||
        !c.storage ||
        typeof c.storage !== "object" ||
        Array.isArray(c.storage) ||
        Object.keys(c.storage).length > limit
      )
        throw Error("Invalid saved cell.");
      const target = { drops: [], storage: {} };
      for (const d of c.drops) {
        if (
          typeof d.id !== "string" ||
          ids.has(d.id) ||
          ![d.x, d.y, d.z, d.created].every(Number.isFinite) ||
          d.created < 0 ||
          d.created > out.clock
        )
          throw Error("Invalid static drop.");
        ids.add(d.id);
        const numeric = /^drop-(\d+)$/.exec(d.id);
        if (numeric && Number(numeric[1]) >= out.nextId)
          throw Error("Saved next drop ID would collide.");
        target.drops.push({
          ...item(d),
          id: d.id,
          x: d.x,
          y: d.y,
          z: d.z,
          created: d.created,
        });
      }
      for (const [key, stacks] of Object.entries(c.storage)) {
        if (
          !/^[A-Za-z0-9_-]{1,100}$/.test(key) ||
          ["__proto__", "constructor", "prototype"].includes(key) ||
          !Array.isArray(stacks) ||
          stacks.length > limit
        )
          throw Error("Invalid storage.");
        target.storage[key] = stacks.map(
          /* @function hub-state.validateStack — Validates each saved storage stack. Inputs: stack. Returns: normalized item; throws on invalid data, with no live effects. */ (
            s,
          ) => item(s),
        );
      }
      out.cells[id] = target;
    }
    if (
      !Array.isArray(value.carried || []) ||
      (value.carried || []).length > 2000
    )
      throw Error("Invalid carried item details.");
    for (const stack of value.carried || []) out.carried.push(item(stack));
    for (const r of value.recovery) out.recovery.push(item(r));
    return out;
  }
  /* @function hub-state.cell — Gets or initializes one compact cell record. Inputs: store and stable cell ID. Returns: mutable cell data; throws before inserting an invalid ID. The historical 32-cell cap is superseded October 13, 2026; per-cell item budgets still apply. Does not load world resources. */
  function cell(store, id) {
    if (
      !/^[A-Za-z0-9_-]{1,64}$/.test(id) ||
      ["__proto__", "constructor", "prototype"].includes(id)
    )
      throw Error("Invalid cell ID.");
    if (!Object.hasOwn(store.cells, id)) {
      store.cells[id] = { drops: [], storage: {} };
      const cursor = cursors.get(store);
      if (cursor) cursor.ids.push(id);
    }
    return store.cells[id];
  }
  /* @function hub-state.drop — Commits a static stack at an already collision-checked location. Inputs: store, cell ID, stack, world-space point. Returns: new drop record; throws before mutation for invalid placement/capacity. Inventory subtraction is owned by the caller after successful commit. */
  function drop(store, id, stack, point) {
    const checked = item(stack);
    if (![point.x, point.y, point.z].every(Number.isFinite))
      throw Error("Invalid drop position.");
    const c = cell(store, id);
    if (c.drops.length >= limit)
      throw Error("Cell dropped-item capacity reached.");
    const d = {
      ...checked,
      id: "drop-" + store.nextId++,
      x: point.x,
      y: point.y,
      z: point.z,
      created: store.clock,
    };
    c.drops.push(d);
    return d;
  }
  /* @function hub-state.pickup — Removes one drop by stable instance ID. Inputs: store, cell ID, drop ID. Returns: removed stack or null if unavailable. Caller owns inventory credit; removal and credit must be synchronous to avoid duplicate pickups. */
  function pickup(store, id, dropId) {
    const c = cell(store, id),
      index = c.drops.findIndex(
        /* @function hub-state.findDrop — Locates the requested drop. Inputs: record. Returns: ID equality; no side effects. */ (
          d,
        ) => d.id === dropId,
      );
    return index < 0 ? null : c.drops.splice(index, 1)[0];
  }
  /* @function hub-state.tick — Advances shared unpaused time and processes a bounded number of expired drops. Inputs: store, elapsed seconds, cell-policy map or read-only resolver(id), maximum records (default 64). Returns: transfer count. Quest/protected/full-recovery records stay in their cell; no valuable item is silently deleted. No per-drop timers or hidden runtime objects remain after transfer. October 13, 2026: cell membership is cached for this store and extended by cell(); callers must use that service to add records, rather than mutate store.cells directly. The resolver runs only for budgeted records, avoiding whole-project snapshots. */
  function tick(store, dt, policies, budget = 64) {
    if (
      !Number.isFinite(dt) ||
      dt < 0 ||
      dt > 60 ||
      !Number.isInteger(budget) ||
      budget < 1 ||
      budget > 2000
    )
      throw Error("Invalid cleanup time step/budget.");
    store.clock += dt;
    // October 13: enumerate visited cells once per store, append through cell().
    // Cleanup avoids allocating the full visited-cell list every tick.
    let cursor = cursors.get(store);
    if (!cursor) {
      cursor = { cell: 0, indices: {}, ids: Object.keys(store.cells) };
      cursors.set(store, cursor);
    }
    const ids = cursor.ids;
    if (!ids.length) return 0;
    let moved = 0;
    // Rotate both cells and record indices: protected or fresh records cannot
    // indefinitely starve old eligible records later in a large collection.
    for (let n = 0; n < budget; n++) {
      const id = ids[cursor.cell++ % ids.length],
        c = store.cells[id],
        policy = typeof policies === "function" ? policies(id) : policies[id];
      if (!c.drops.length || !policy || policy.protected) continue;
      const index = (cursor.indices[id] || 0) % c.drops.length,
        d = c.drops[index];
      if (
        !d.questProtected &&
        store.clock - d.created >= policy.cleanupSeconds &&
        store.recovery.length < store.recoveryLimit
      ) {
        store.recovery.push(item(d));
        c.drops.splice(index, 1);
        moved++;
        cursor.indices[id] = index;
      } else cursor.indices[id] = index + 1;
    }
    return moved;
  }
  /* @function hub-state.carry — Inputs: store, event inventory Map and stack. Returns nothing. Validates count/detail capacities before atomically crediting inventory; preserves per-stack properties/ownership/quest protection. No artwork retained. */
  function carry(store, inventory, stack) {
    const checked = item(stack),
      count = inventory.get(checked.itemId) || 0;
    if (
      store.carried.length >= 2000 ||
      count + checked.quantity > 1000000 ||
      (!inventory.has(checked.itemId) && inventory.size >= 2000)
    )
      throw Error("Inventory detail capacity reached.");
    store.carried.push(checked);
    inventory.set(checked.itemId, count + checked.quantity);
  }
  /* @function hub-state.consume — Inputs: store, event inventory Map, item ID and fallback metadata. Returns one-unit stack, or throws insufficient count. Removes matching per-stack detail when available; legacy event-given items use shared fallback. No new runtime resource allocation. */
  function consume(store, inventory, id, fallback = {}) {
    const count = inventory.get(id) || 0;
    if (count < 1) throw Error("No item available.");
    const index = store.carried.findIndex(
        /* @function hub-state.findCarried — Inputs: carried stack. Returns requested ID match, no mutation. */ (
          s,
        ) => s.itemId === id,
      ),
      record =
        index < 0
          ? item({ itemId: id, quantity: 1, ...fallback })
          : { ...structuredClone(store.carried[index]), quantity: 1 };
    if (index >= 0) {
      store.carried[index].quantity--;
      if (!store.carried[index].quantity) store.carried.splice(index, 1);
    }
    inventory.set(id, count - 1);
    return record;
  }
  root.FrontierHubState = {
    settings,
    owner,
    item,
    empty,
    validate,
    cell,
    drop,
    pickup,
    tick,
    carry,
    consume,
  };
})(typeof window === "undefined" ? globalThis : window);
