/* Event schema versioning and extension boundary. Legacy version 1 migrates
 * explicitly; newer unknown versions are rejected rather than silently damaged.
 * Unknown extension payloads round-trip; executing unknown commands is an error. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function event-schema.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event schema. */
(/* @function event-schema.installReviewed — Installs event schema migration/extension validation. Version-one migration is explicit, future unknown versions reject, and unknown extension data can round-trip without becoming executable commands. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  const VERSION = 2,
    migrations = new Map([
      [
        1,
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.callback.2 — Returns a record containing copied fields, schemaVersion, extensions. Inputs: event. Uses: structured clone. Returns: a record containing copied fields, schemaVersion, extensions. */
  /* @function eventSchema.reviewedcallback_2 — Migrates version1 event to version2 annotations. Inputs: event. Returns cloned event with schemaVersion2 and extensions default{}, retaining supplied extension reference from this already-cloned migration input. No original event mutation; clone errors propagate. */ (
          event,
        ) => ({
          ...structuredClone(event),
          schemaVersion: 2,
          extensions: event.extensions || {},
        }),
      ],
    ]);
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.json.3 — Handles json within event schema. Inputs: value. Uses: check; json stringify; error; structured clone. Returns: structured clone using value. */
  /* @function eventSchema.reviewedjson_3 — Checks bounded extension payload and returns structured copy. Inputs: value expected JSON-derived. Returns structuredClone after finite-value/cycle/complexity walk and JSON serialized-length check<=1million characters (not actual UTF-8 bytes). Rejects undefined/functions/nonfinite numbers/cycles/depth>24/nodes>20000. Does not explicitly reject nonplain prototypes or sparse arrays, so callers must supply JSON-derived records for faithful portability. No input mutation; stringify/getter/clone failures propagate. */ function json(
    value,
  ) {
    const seen = new Set();
    let count = 0;
    /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.check.4 — Handles check within event schema. Inputs: v; depth. Uses: error; number is finite; seen has; seen add. Returns: without a result; without a result. */
  /* @function eventSchema.reviewedcheck_4 — Walks extension payload complexity and active recursion path. Inputs: v and depth. Returns undefined; accepts null/string/boolean/finite number or recursively enumerable object values, increments node count and tracks active objects to reject cycles. Shared acyclic references allowed. Does not check object prototype/keys; source getters may run and throw. No data mutation. */ function check(
      v,
      depth,
    ) {
      if (++count > 20000 || depth > 24)
        throw Error("Extension payload is too complex.");
      if (v === null || typeof v === "string" || typeof v === "boolean") return;
      if (typeof v === "number" && Number.isFinite(v)) return;
      if (typeof v !== "object" || seen.has(v))
        throw Error("Extensions must contain finite JSON data.");
      seen.add(v);
      for (const x of Object.values(v)) check(x, depth + 1);
      seen.delete(v);
    }
    check(value, 0);
    if (JSON.stringify(value).length > 1000000)
      throw Error("Extension payload exceeds 1 MB.");
    return structuredClone(value);
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.extensions.5 — Handles extensions within event schema. Inputs: value. Uses: array is array; error; /^[1-9][0-9]*$/ test; string. Returns: a record containing ; json using value. */
  /* @function eventSchema.reviewedextensions_5 — Validates extension namespace for event/page/command. Inputs: optional value. Returns{} when absent or detached checked object; rejects array/null/nonobject and party actor ID outside positive integer1-5000, optionally validates hub payload when service installed. Unknown extension namespaces preserved, not executed. No source mutation; generic payload/hub validation errors propagate. */ function extensions(
    value,
  ) {
    if (value === undefined) return {};
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw Error("Extensions must be a namespace object.");
    if (
      value.party?.actorId !== undefined &&
      !/^[1-9][0-9]*$/.test(String(value.party.actorId))
    )
      throw Error("Companion actor ID must be a positive integer.");
    if (value.party?.actorId !== undefined && +value.party.actorId > 5000)
      throw Error("Companion actor ID exceeds 5000.");
    const checked = json(value);
    if (checked.hub && root.FrontierHubWorkbench)
      checked.hub = root.FrontierHubWorkbench.validateEvent(checked.hub);
    return checked;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.migrate.6 — Handles migrate within event schema. Inputs: event. Updates: e; version. Uses: structured clone; number is integer; error; migrations get. Returns: e. */
  /* @function eventSchema.reviewedmigrate_6 — Copies/migrates authored event schema. Inputs: event. Returns clone at supported version2; absent version treated1, invalid/future version rejected and missing migration throws. No original mutation. Registered migrations must advance schemaVersion; caller registry is fixed here. */ function migrate(
    event,
  ) {
    let e = structuredClone(event),
      version = e.schemaVersion ?? 1;
    if (!Number.isInteger(version) || version < 1 || version > VERSION)
      throw Error("Unsupported event schema version " + version);
    while (version < VERSION) {
      const migration = migrations.get(version);
      if (!migration) throw Error("Missing event migration " + version);
      e = migration(e);
      version = e.schemaVersion;
    }
    return e;
  }
  const pageDefaults =
    /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.pageDefaults.7 — Returns a record containing moveSpeed, moveFrequency, walkAnime, stepAnime, directionFix, moveRoute, image, conditionSlots. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing moveSpeed, moveFrequency, walkAnime, stepAnime, directionFix, moveRoute, image, conditionSlots. */
  /* @function eventSchema.reviewedpageDefaults_7 — Creates independent MZ-style page metadata defaults. Inputs: none. Returns nested movement/image/condition-slot/route record; each call detached. Speed/frequency3, facing direction2, pattern1, all condition slots disabled. Does not initialize live controllers or load sprite. */ () => ({
      moveSpeed: 3,
      moveFrequency: 3,
      walkAnime: true,
      stepAnime: false,
      directionFix: false,
      moveRoute: {
        repeat: true,
        skippable: false,
        wait: false,
        list: [{ code: 0, parameters: [] }],
      },
      image: { profile: "", direction: 2, pattern: 1 },
      conditionSlots: {
        switch1: { enabled: false, key: "1" },
        switch2: { enabled: false, key: "1" },
        variable: { enabled: false, key: "1", value: 0 },
        selfSwitch: { enabled: false, key: "A" },
        item: { enabled: false, key: "item-1", value: 1 },
        actor: { enabled: false, key: "1" },
      },
    });
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.pageSettings.8 — Handles page settings within event schema. Inputs: value. Updates: v move route. Uses: page defaults; json; number is integer; error. Returns: v. */
  /* @function eventSchema.reviewedpageSettings_8 — Normalizes MZ-compatible page appearance/motion data. Inputs: optional value. Returns default-merged detached record; speed1-6/frequency1-5 integers, animation flags booleans, image profile<=100, cardinal direction and pattern0-2; route validates when service installed. Does not validate conditionSlots here; condition editor/schema integration owns them. Invalid fields throw before adoption. */ function pageSettings(
    value,
  ) {
    const v = { ...pageDefaults(), ...json(value || {}) };
    if (
      !Number.isInteger(v.moveSpeed) ||
      v.moveSpeed < 1 ||
      v.moveSpeed > 6 ||
      !Number.isInteger(v.moveFrequency) ||
      v.moveFrequency < 1 ||
      v.moveFrequency > 5
    )
      throw Error("Invalid movement speed/frequency.");
    for (const k of ["walkAnime", "stepAnime", "directionFix"])
      if (typeof v[k] !== "boolean")
        throw Error("Invalid page animation option.");
    if (
      typeof v.image?.profile !== "string" ||
      v.image.profile.length > 100 ||
      ![2, 4, 6, 8].includes(v.image.direction) ||
      ![0, 1, 2].includes(v.image.pattern)
    )
      throw Error("Invalid event image.");
    if (root.FrontierMZRoutes)
      v.moveRoute = root.FrontierMZRoutes.validate(v.moveRoute);
    return v;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.annotations.9 — Handles annotations within event schema. Inputs: checked; source. Updates: e note; e display name; e pages. Uses: migrate; extensions; error; e pages map. Returns: e. */
  /* @function eventSchema.reviewedannotations_9 — Adds migrated extension/appearance metadata to already checked event. Inputs: checked event core and raw source. Returns new event/pages/commands at version2, retaining validated note<=10000/displayName<=80 plus page behavior/MZ settings and extensions. Expects aligned source/core page and command indices. No input writes; migration/dependency/shape errors propagate and no event execution occurs. */ function annotations(
    checked,
    source,
  ) {
    const incoming = migrate(source);
    const e = {
      ...checked,
      schemaVersion: VERSION,
      extensions: extensions(incoming.extensions),
    };
    if (incoming.note !== undefined) {
      if (typeof incoming.note !== "string" || incoming.note.length > 10000)
        throw Error("Event note exceeds 10000 characters.");
      e.note = incoming.note;
    }
    if (incoming.displayName !== undefined) {
      if (
        typeof incoming.displayName !== "string" ||
        incoming.displayName.length > 80
      )
        throw Error("Invalid event display name.");
      e.displayName = incoming.displayName;
    }
    e.pages = e.pages.map(
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.callback.10 — Returns a record containing copied fields, copied fields, copied fields, extensions, commands. Inputs: p; i. Uses: root frontier actor behavior validate; page settings; extensions; p commands map. Returns: a record containing copied fields, copied fields, copied fields, extensions, commands. */
  /* @function eventSchema.reviewedcallback_10 — Builds one annotated checked page. Inputs: p/index i with migrated incoming. Returns copied core page plus validated optional behavior/MZ settings, page extensions and command metadata. No source mutation; validators may throw. */ (
        p,
        i,
      ) => ({
        ...p,
        ...(incoming.pages[i].behavior
          ? {
              behavior: root.FrontierActorBehavior.validate(
                incoming.pages[i].behavior,
              ),
            }
          : {}),
        ...(incoming.pages[i].mz
          ? { mz: pageSettings(incoming.pages[i].mz) }
          : {}),
        extensions: extensions(incoming.pages[i].extensions),
        commands: p.commands.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.callback.11 — Returns a record containing copied fields, extensions. Inputs: c; j. Uses: extensions. Returns: a record containing copied fields, extensions. */
  /* @function eventSchema.reviewedcallback_11 — Preserves one command extension record. Inputs: checked c/index j with captured page index/incoming. Returns copied command with validated detached extensions. No command execution; aligned arrays required. */ (
            c,
            j,
          ) => ({
            ...c,
            extensions: extensions(incoming.pages[i].commands[j].extensions),
          }),
        ),
      }),
    );
    return e;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.extraPageConditions.12 — Handles extra page conditions within event schema. Inputs: page. Uses: object entries using chain or a record containing filter using a callback map; object entries using chain or a record containing filter; object entries; a list of page condition, spread element filter using a callback map. Returns: a list of page condition, spread element filter using a callback map using a callback. */
  /* @function eventSchema.reviewedextraPageConditions_12 — Separates advanced conditions from enabled MZ condition-slot representation. Inputs: validated page. Returns detached conditions excluding always and one match per represented slot. Matches type/key and variable/item threshold, consuming only local represented list. No page mutation; clone/shape errors propagate. */ function extraPageConditions(
    page,
  ) {
    const represented = Object.entries(page.mz?.conditionSlots || {})
      .filter(
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.callback.13 — Returns s enabled. Inputs: array pattern. Returns: s enabled. */
  /* @function eventSchema.reviewedcallback_13 — Selects enabled condition slot. Inputs: key/slot tuple. Returns slot.enabled truthiness; no mutation. */ ([
          ,
          s,
        ]) => s.enabled,
      )
      .map(
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.callback.14 — Returns a record containing type, key, copied fields. Inputs: array pattern. Uses: key starts with. Returns: a record containing type, key, copied fields. */
  /* @function eventSchema.reviewedcallback_14 — Converts enabled slot to comparison record. Inputs: key/slot tuple. Returns type/key and variable threshold or item count1; switch1/2 normalize switch type. No source mutation. */ ([
          key,
          s,
        ]) => ({
          type: key.startsWith("switch") ? "switch" : key,
          key: s.key,
          ...(key === "variable"
            ? { value: s.value }
            : key === "item"
              ? { value: 1 }
              : {}),
        }),
      );
    return [page.condition, ...(page.conditions || [])]
      .filter(
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.callback.15 — Provides the callback for a list of page condition, spread element filter. Inputs: c. Uses: represented find index; represented splice. Returns: false; true. */
  /* @function eventSchema.reviewedcallback_15 — Keeps condition not represented by a slot. Inputs: c and captured local represented list. Returns false always/missing/matched, true advanced/unmatched; consumes one local match to preserve duplicate semantics. No page mutation. */ (
          c,
        ) => {
          if (!c || c.type === "always") return false;
          const i = represented.findIndex(
            /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.callback.16 — Returns s type equals c type and s key equals c key and s type does not equal "variable" and s type does not equal "item" or s value equals c value. Inputs: s. Returns: s type equals c type and s key equals c key and s type does not equal "variable" and s type does not equal "item" or s value equals c value. */
  /* @function eventSchema.reviewedcallback_16 — Matches represented slot to authored condition. Inputs: s and captured c. Returns exact type/key plus variable/item value equality. No mutation. */ (
              s,
            ) =>
              s.type === c.type &&
              s.key === c.key &&
              ((s.type !== "variable" && s.type !== "item") ||
                s.value === c.value),
          );
          if (i < 0) return true;
          represented.splice(i, 1);
          return false;
        },
      )
      .map(
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-schema.callback.17 — Returns structured clone using c. Inputs: c. Uses: structured clone. Returns: structured clone using c. */
  /* @function eventSchema.reviewedcallback_17 — Detaches retained advanced condition. Inputs: c. Returns structuredClone; no source mutation, clone errors propagate. */ (
          c,
        ) => structuredClone(c),
      );
  }
  root.FrontierEventSchema = {
    extraPageConditions,
    version: VERSION,
    migrate,
    annotations,
    json,
    extensions,
    pageDefaults,
    pageSettings,
  };
})(typeof window === "undefined" ? globalThis : window);
