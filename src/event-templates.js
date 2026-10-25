// October 14, 2026: the historical no-runtime-replacement-UI note below describes the original staged implementation. Current command/runtime lifecycle integration lives in event-runtime.js and events.js; this module remains the immutable definition service.
/* Reusable definitions are validated once and frozen. Instances share page data;
 * placement and identity remain instance-owned. No runtime replacement UI is
 * enabled until lifecycle cancellation and persistence are integrated. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function event-templates.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event templates. Uses: object freeze. */
(/* @function event-templates.installReviewed — Installs reusable event-definition validation and independent instance construction. Shared page data is validated/frozen; placement identity and instance overrides remain separately owned. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  const schema = "sprite-frontier-event-templates/1",
    maxBytes = 16 * 1024 * 1024,
    maxEntries = 2000;
  const validId =
    /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.validId.2 — Returns typeof id equals "string" and /^[A-Za-z0-9_-]{1,64}$/ test using id. Inputs: id. Uses: /^[A-Za-z0-9_-]{1,64}$/ test. Returns: typeof id equals "string" and /^[A-Za-z0-9_-]{1,64}$/ test using id. */
  /* @function eventTemplates.reviewedvalidId_2 — Checks stable event/template identity syntax. Inputs: id. Returns ASCII alphanumeric/underscore/hyphen string length1-64 predicate. No mutation. */ (
      id,
    ) => typeof id === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(id);
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.freeze.3 — Handles freeze within event templates. Inputs: value. Uses: object is frozen; object values; freeze; object freeze. Returns: value. */
  /* @function eventTemplates.reviewedfreeze_3 — Recursively freezes compiled portable definition tree. Inputs: value. Returns same reference; walks not-already-frozen object children then freezes. Mutates object frozen status, not fields. Validated acyclic data assumed; shallow-frozen parents are not traversed, cyclic unvalidated input could recurse. Errors propagate. */ function freeze(
    value,
  ) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      for (const child of Object.values(value)) freeze(child);
      Object.freeze(value);
    }
    return value;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.validate.4 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: bank. Uses: array is array; error; a new text encoder encode; json stringify. Returns: a record containing schema, entries, extensions. */
  /* @function eventTemplates.reviewedvalidate_4 — Validates portable reusable-definition bank. Inputs: bank. Returns detached supported schema/entries/extensions; requires at most2000 entries and16MiB UTF-8 serialized data. Entry events normalized at canonical(5,5) placement, unique IDs/version/name checked and extensions preserved. No caller mutation; validation/serialization errors propagate, not asset decoding. */ function validate(
    bank,
  ) {
    if (
      !bank ||
      bank.schema !== schema ||
      !Array.isArray(bank.entries) ||
      bank.entries.length > maxEntries
    )
      throw Error("Invalid event template bank.");
    // UTF-8 budget measures exported data, not the number of pages.
    if (new TextEncoder().encode(JSON.stringify(bank)).length > maxBytes)
      throw Error("Event template bank exceeds 16 MiB.");
    const ids = new Set(),
      entries = bank.entries.map(
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.callback.5 — Provides the callback for bank entries map. Inputs: entry. Updates: source x; source y. Uses: valid id; ids has; number is safe integer; error. Returns: a record containing id, name, version, event, extensions. */
  /* @function eventTemplates.reviewedcallback_5 — Validates one reusable event definition. Inputs: entry. Returns ID/name/version/validated event/extensions; name length<=80 (empty allowed here), version positive safe integer. Clones event and canonicalizes XY to5metres before core event validator, so placement does not travel with definition. No source mutation; missing validator or invalid schema throws. */ (
          entry,
        ) => {
          if (
            !entry ||
            !validId(entry.id) ||
            ids.has(entry.id) ||
            typeof entry.name !== "string" ||
            entry.name.length > 80 ||
            !Number.isSafeInteger(entry.version) ||
            entry.version < 1
          )
            throw Error(
              "Invalid or duplicate event template identity/version.",
            );
          ids.add(entry.id);
          if (!root.FrontierEvents)
            throw Error("Event validator is unavailable.");
          const source = structuredClone(entry.event);
          if (!source || typeof source !== "object")
            throw Error("Missing event template definition.");
          // Definitions have canonical coordinates; source placement does not travel
          // with a template when instantiated on another map.
          source.x = 5;
          source.y = 5;
          const event = root.FrontierEvents.validate([source])[0];
          const extensions = root.FrontierEventSchema.extensions(
            entry.extensions,
          );
          return {
            id: entry.id,
            name: entry.name,
            version: entry.version,
            event,
            extensions,
          };
        },
      );
    return {
      schema,
      entries,
      extensions: root.FrontierEventSchema.extensions(bank.extensions),
    };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.compile.6 — Handles compile within event templates. Inputs: bank. Uses: freeze; validate; checked entries map; object freeze. Returns: object freeze using a record containing snapshot, size, version, instantiate. */
  /* @function eventTemplates.reviewedcompile_6 — Builds immutable shared definition bank. Inputs: bank. Returns frozen snapshot/version/instantiate API plus size, using validated recursively frozen records and private ID Map. No source mutation; validation errors reject. Compiled page data can be shared safely when runtime does not edit definitions. */ function compile(
    bank,
  ) {
    const checked = freeze(validate(bank)),
      byId = new Map(
        checked.entries.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.callback.7 — Returns a list of entry id, entry. Inputs: entry. Returns: a list of entry id, entry. */
  /* @function eventTemplates.reviewedcallback_7 — Indexes compiled definition by ID. Inputs: entry. Returns ID/entry tuple retaining frozen reference; no mutation. */ (
            entry,
          ) => [entry.id, entry],
        ),
      );
    return Object.freeze({
      snapshot:
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.snapshot.8 — Captures this system’s current data for persistence or inspection. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using checked. */
  /* @function eventTemplates.reviewedsnapshot_8 — Exports detached compiled definition bank. Inputs: none. Returns structured clone; no live instance state or mutation, clone errors propagate. */ () =>
          structuredClone(checked),
      size: checked.entries.length,
      version:
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.version.9 — Returns chain. Inputs: id. Uses: by id get. Returns: chain. */
  /* @function eventTemplates.reviewedversion_9 — Reads compiled definition version. Inputs: id. Returns version or undefined missing. No mutation. */ (
          id,
        ) => byId.get(id)?.version,
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.instantiate.10 — Handles instantiate within event templates. Inputs: id; placement; version. Updates: engine event number; extensions at "sprite-frontier". Uses: by id get; error; valid id; number is finite. Returns: a record containing copied fields, id, x, y, extensions. */
  /* @function eventTemplates.reviewedinstantiate_10 — Constructs independent placement from frozen definition. Inputs: template id, placement with new valid ID/finite XY and optional positive eventNumber, optional expected version. Returns event with shared frozen pages/metadata but cloned extensions/spatial zones, new XY/ID and instance-owned eventNumber; self-targeted zones follow new ID. Rejects missing/version/placement errors. Does not check map bounds, create runtime controller or apply arbitrary overrides; owner validates placement. No definition mutation. */ instantiate(
        id,
        placement,
        version,
      ) {
        const entry = byId.get(id);
        if (!entry) throw Error("Unknown event template " + id);
        if (version !== undefined && version !== entry.version)
          throw Error("Event template version mismatch.");
        if (
          !placement ||
          !validId(placement.id) ||
          !Number.isFinite(placement.x) ||
          !Number.isFinite(placement.y)
        )
          throw Error("Invalid event instance placement.");
        if (
          placement.eventNumber !== undefined &&
          (!Number.isSafeInteger(placement.eventNumber) ||
            placement.eventNumber < 1)
        )
          throw Error("Invalid event instance number.");
        // Numeric event identity belongs to the existing engine namespace, where
        // MZ route targets resolve it. Never inherit a source definition's number.
        const extensions = structuredClone(entry.event.extensions),
          engine = { ...extensions["sprite-frontier"] };
        delete engine.eventNumber;
        if (placement.eventNumber !== undefined)
          engine.eventNumber = placement.eventNumber;
        if (Object.keys(engine).length) extensions["sprite-frontier"] = engine;
        else delete extensions["sprite-frontier"];
        // October 9: self-targeted reusable zones follow the new instance identity.
        const spatial = entry.event.spatial
          ? structuredClone(entry.event.spatial)
          : undefined;
        if (spatial)
          for (const zone of spatial.interactionZones)
            if (zone.eventId === entry.event.id) zone.eventId = placement.id;
        return {
          ...entry.event,
          ...(spatial ? { spatial } : {}),
          id: placement.id,
          x: placement.x,
          y: placement.y,
          extensions,
        };
      },
    });
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.references.11 — Handles references within event templates. Inputs: value; bank; events. Uses: array is array; error; validate using bank entries map; validate. Returns: a list of ; value map using a callback. */
  /* @function eventTemplates.reviewedreferences_11 — Validates saved replacement references against bank/current events. Inputs: optional value array, bank and events. Returns detached id/template/version/statePolicy rows, default[]. Requires at most2000 references, unique target IDs existing in events, known template exact version and reset/preserve. No adoption/mutation; full bank validates and errors propagate. */ function references(
    value,
    bank,
    events,
  ) {
    if (value === undefined) return [];
    if (!Array.isArray(value) || value.length > maxEntries)
      throw Error("Invalid replacement references.");
    const definitions = new Map(
        validate(bank).entries.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.callback.12 — Returns a list of e id, e version. Inputs: e. Returns: a list of e id, e version. */
  /* @function eventTemplates.reviewedcallback_12 — Indexes known template version. Inputs: e. Returns ID/version tuple; no mutation. */ (
            e,
          ) => [e.id, e.version],
        ),
      ),
      targets = new Set(
        events.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.callback.13 — Returns e id. Inputs: e. Returns: e id. */
  /* @function eventTemplates.reviewedcallback_13 — Collects authored target identity. Inputs: e. Returns e.id; no mutation. */ (
            e,
          ) => e.id,
        ),
      ),
      seen = new Set();
    return value.map(
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.callback.14 — Provides the callback for value map. Inputs: r. Uses: targets has; seen has; valid id; definitions get. Returns: a record containing id, template, version, statePolicy. */
  /* @function eventTemplates.reviewedcallback_14 — Checks one saved replacement reference. Inputs: r and captured target/definition/seen tables. Returns supported row; rejects missing/duplicate/version-mismatched or invalid policy. Mutates local seen only. */ (
        r,
      ) => {
        if (
          !r ||
          !targets.has(r.id) ||
          seen.has(r.id) ||
          !validId(r.template) ||
          definitions.get(r.template) !== r.version ||
          !["reset", "preserve"].includes(r.statePolicy)
        )
          throw Error(
            "Missing, duplicate or version-mismatched replacement reference.",
          );
        seen.add(r.id);
        return {
          id: r.id,
          template: r.template,
          version: r.version,
          statePolicy: r.statePolicy,
        };
      },
    );
  }
  // Import must preserve both banks; collisions receive deterministic fresh IDs.
  // The returned mapping lets future command references follow renamed entries.
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.merge.15 — The returned mapping lets future command references follow renamed entries. Inputs: existing; incoming; assignment pattern. Updates: id; entry id; command parameters at 1; key; extensions at key. Uses: validate; a entries map; ids has; original slice. Returns: a record containing bank, mapping. */
  /* @function eventTemplates.reviewedmerge_15 — Merges portable definition banks without source loss. Inputs: existing/incoming and optional old-to-new numeric map Map. Returns validated merged bank and template ID mapping. Clones/validates banks, deterministic _import_N renames colliding incoming IDs, remaps incoming Replace Event/direct numeric MZ transfers and nests bank metadata under unused import namespace. No caller-bank mutation; size/identity/validation failures reject before returned adoption. */ function merge(
    existing,
    incoming,
    mapNumbers = new Map(),
  ) {
    const a = validate(existing),
      b = validate(incoming),
      ids = new Set(
        a.entries.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.callback.16 — Returns e id. Inputs: e. Returns: e id. */
  /* @function eventTemplates.reviewedcallback_16 — Collects host definition ID for import reservation. Inputs: e. Returns e.id; no mutation. */ (
            e,
          ) => e.id,
        ),
      ),
      mapping = new Map();
    for (const entry of b.entries) {
      const original = entry.id;
      let id = original,
        n = 1;
      while (ids.has(id)) id = original.slice(0, 52) + "_import_" + n++;
      ids.add(id);
      mapping.set(original, id);
      entry.id = id;
      for (const page of entry.event.pages)
        for (const command of page.commands)
          if (
            command.type === "mz" &&
            command.code === 201 &&
            command.parameters[0] === 0 &&
            mapNumbers.has(command.parameters[1])
          )
            command.parameters[1] = mapNumbers.get(command.parameters[1]);
    }
    for (const entry of b.entries) remapReferences(entry.event, mapping);
    // Keep incoming bank extensions under an import namespace rather than
    // overwriting existing future metadata. Entry extensions stay on their entry.
    const extensions = structuredClone(a.extensions);
    if (Object.keys(b.extensions).length) {
      let key = "import",
        n = 1;
      while (Object.hasOwn(extensions, key)) key = "import" + n++;
      extensions[key] = b.extensions;
    }
    return {
      bank: validate({
        schema,
        entries: [...a.entries, ...b.entries],
        extensions,
      }),
      mapping,
    };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.remapReferences.17 — Handles remap references within event templates. Inputs: event; mapping. Updates: command template. Uses: mapping has; mapping get. */
  /* @function eventTemplates.reviewedremapReferences_17 — Rewrites imported event template command references in place. Inputs: mutable cloned event and mapping Map. Returns undefined; only replaceEvent.template entries present in mapping change. Does not rename event ID or map transfer refs. Caller must pass owned clone; malformed page/command shape throws. */ function remapReferences(
    event,
    mapping,
  ) {
    for (const page of event.pages)
      for (const command of page.commands)
        if (command.type === "replaceEvent" && mapping.has(command.template))
          command.template = mapping.get(command.template);
  }
  root.FrontierEventTemplates = {
    schema,
    limits: Object.freeze({ maxBytes, maxEntries }),
    empty:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-templates.empty.18 — Returns a record containing schema, entries. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing schema, entries. */
  /* @function eventTemplates.reviewedempty_18 — Creates new empty reusable-definition bank. Inputs: none. Returns schema/entries[] record, independent each call. No registry/runtime mutation. */ () => ({
        schema,
        entries: [],
      }),
    validate,
    compile,
    merge,
    references,
    remapReferences,
  };
})(typeof window === "undefined" ? globalThis : window);
