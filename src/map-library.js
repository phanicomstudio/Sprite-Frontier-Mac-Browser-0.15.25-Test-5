/* October 24, 2026 — 0.16.2 current behavior and units are described in ITERATION-0.16.2.md; earlier contracts below remain history. New camera/tactics helpers preserve existing owners and transactional validation. */
/* October 13, 2026: supersedes the former 32-map project cap. Map count is not a rendering budget: inactive worlds remain authored/state records, while the active cell supplies the scene. Validation still enforces each world, identity, and referenced asset; numeric compatibility IDs retain their documented range. Large projects remain subject to storage and import byte limits. */
/* Authored maps are independent from their temporary playtests. IndexedDB keeps

 * the library locally; project JSON provides a portable backup including maps. */

/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier maps. */
(/* @function mapLibrary.reviewed1 — Registers authored project/library services. Inputs: browser global root. Returns nothing; installs FrontierMaps APIs. Editor construction and IndexedDB work occur only through create/storage, not when this script loads. Runtime uses separate active-cell ownership. */ function (
  root,
) {
  "use strict";

  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Uses: array is array; error; frontier map identities assign; value maps map. Returns: a record containing schema, active, maps, models, gameplayDefaults, templates. */
  /* @function mapLibrary.reviewed2 — Validates a portable complete map project before adoption. Inputs: schema/maps/active/models/defaults/templates record. Returns detached normalized project with stable map identities and validated worlds. Rejects empty/duplicate IDs, missing active map/model/template/item assets, invalid UV slots and malformed configuration. Reuses staged GLB decoding; no project adoption, disk writes or source mutation. There is no map-count rendering cap. */ function validate(
    value,
  ) {
    if (
      value?.schema !== "sprite-frontier-maps/1" ||
      !Array.isArray(value.maps) ||
      !value.maps.length
    )
      throw Error("Project must contain at least one map.");
    const ids = new Set();
    const maps = FrontierMapIdentities.assign(
      value.maps.map(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.callback.3 — Provides the callback for value maps map. Inputs: m. Uses: /^[a-z0-9_-]{1,64}$/i test; ids has; m name trim; error. Returns: a record containing id, name, copied fields, world. */
        /* @function mapLibrary.reviewed3 — Validates one authored map record. Inputs: m with ID/name/optional MZ ID/world. Returns detached normalized map, trimming names and validating its world. Captured ID set rejects duplicates; invalid names/IDs throw. Does not adopt a map or mutate original world. */ (
          m,
        ) => {
          if (
            typeof m.id !== "string" ||
            !/^[a-z0-9_-]{1,64}$/i.test(m.id) ||
            ids.has(m.id) ||
            typeof m.name !== "string" ||
            !m.name.trim() ||
            m.name.length > 80
          )
            throw Error("Invalid map name or ID.");
          ids.add(m.id);
          // October 14: slash-separated map folders organize authoring only.
          // They never change transfer IDs, cell loading or runtime costs.
          if (m.folder !== undefined && (typeof m.folder !== "string" || m.folder.length > 160))
            throw Error("Map folder must be a name/path up to 160 characters.");
          return {
            id: m.id,
            name: m.name.trim(),
            ...(m.folder ? { folder: m.folder } : {}),
            ...(m.mzId === undefined ? {} : { mzId: m.mzId }),
            world: FrontierWorld.validate(m.world),
          };
        },
      ),
    );
    const models = structuredClone(value.models || []);
    const stagedModels = FrontierModelLibrary.validateBundles(models),
      decodedModels = new Map(
        stagedModels.map(
          /* @function mapLibrary.materialAssets — Inputs: already validated staged bundle/decoded pair. Returns: stable model-ID and decoded asset tuple for read-only material-slot checking. Reuses validation decoding rather than parsing models twice. */ (
            record,
          ) => [record.bundle.id, record.decoded],
        ),
      );
    const modelIds = new Set(
      models.map(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.callback.4 — Returns m id. Inputs: m. Returns: m id. */
        /* @function mapLibrary.reviewed4 — Collects one validated asset identity. Inputs: model bundle m. Returns stable model ID for a local membership set. No asset decode, source mutation or rendering. */ (
          m,
        ) => m.id,
      ),
    );
    for (const map of maps)
      for (const event of map.world.events)
        if (event.spatial?.visual === "model" && event.spatial.materials)
          root.FrontierModelMaterials.checkSlots(
            event.spatial.materials,
            decodedModels.get(event.spatial.modelId),
          );
    for (const map of maps)
      for (const event of map.world.events)
        if (
          event.spatial?.visual === "model" &&
          !modelIds.has(event.spatial.modelId)
        )
          throw Error("Missing model asset: " + event.spatial.modelId);
    // October 13: catalog model references belong to this portable project bank.
    for (const item of value.gameplayDefaults?.extensions?.itemDefinitions ||
      [])
      if (item.modelId && !modelIds.has(item.modelId))
        throw Error("Missing item model: " + item.modelId);
    const templates = FrontierEventTemplates.validate(
      value.templates || FrontierEventTemplates.empty(),
    );
    // October 13: unused reusable definitions must be portable too. Validate
    // their model references and slot mappings before accepting the project.
    for (const entry of templates.entries) {
      const spatial = entry.event.spatial;
      if (spatial?.visual !== "model") continue;
      if (!modelIds.has(spatial.modelId))
        throw Error("Missing template model: " + spatial.modelId);
      root.FrontierModelMaterials.checkSlots(
        spatial.materials,
        decodedModels.get(spatial.modelId),
      );
    }
    if (!ids.has(value.active)) throw Error("Missing active map.");
    return {
      schema: value.schema,
      title: typeof value.title === "string" ? value.title.slice(0,80) : "Sprite Frontier project",
      projectMode: value.projectMode === "blank" ? "blank" : "examples",
      active: value.active,
      maps,
      models,
      gameplayDefaults: FrontierGameplayDefaults.validate(
        value.gameplayDefaults,
      ),
      templates,
    };
  }

  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.database.5 — Handles database within map library. Inputs: no explicit arguments; uses enclosing module state. Returns: a new promise. */
  /* @function mapLibrary.reviewed5 — Opens the authored-project IndexedDB store. Inputs: none. Returns a promise for the open database, creating version-one projects store on first use. Rejects IndexedDB open errors. Retains the established database name so existing local project records remain compatible; callers must close the connection. */ function database() {
    return new Promise(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.callback.6 — Provides the callback for the enclosing map library operation. Inputs: resolve; reject. Updates: r onupgradeneeded; r onsuccess; r onerror. Uses: indexed db open. */
      /* @function mapLibrary.reviewed6 — Starts the IndexedDB open request. Inputs: Promise resolve/reject callbacks. Returns nothing; wires upgrade/success/error completion once. Does not read or write a project yet, and forwards browser storage failures. */ (
        resolve,
        reject,
      ) => {
        const r = indexedDB.open("sprite-frontier-map-library-0.15.21", 1);
        r.onupgradeneeded =
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.onupgradeneeded.7 — Returns r result create object store using "projects". Inputs: no explicit arguments; uses enclosing module state. Uses: r result create object store. Returns: r result create object store using "projects". */
          /* @function mapLibrary.reviewed7 — Creates the initial projects store during database upgrade. Inputs: upgrade event unused. Returns the created object store. Changes only the local IndexedDB schema; normal later opens do not recreate or delete saved projects. */ () =>
            r.result.createObjectStore("projects");
        r.onsuccess =
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.onsuccess.8 — Returns resolve using r result. Inputs: no explicit arguments; uses enclosing module state. Uses: resolve. Returns: resolve using r result. */
          /* @function mapLibrary.reviewed8 — Completes successful database opening. Inputs: success event unused. Returns Promise settlement result (undefined), resolving the enclosing open with the live database connection. Caller owns closing it. */ () =>
            resolve(r.result);
        r.onerror =
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.onerror.9 — Returns reject using r error. Inputs: no explicit arguments; uses enclosing module state. Uses: reject. Returns: reject using r error. */
          /* @function mapLibrary.reviewed9 — Rejects a failed database open. Inputs: error event unused. Returns Promise settlement result (undefined), forwarding request.error instead of pretending persistence is available. */ () =>
            reject(r.error);
      },
    );
  }

  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.storage.10 — Handles storage within map library. Inputs: value. Uses: database; db close. Returns: await. */
  /* @function mapLibrary.reviewed10 — Reads or saves the local authored project. Inputs: optional truthy project value; omitted value reads current. Returns a promise for the transaction result/key, resolving only after transaction completion. Writes fixed projects/current when supplied, rejects transaction errors/abort, and always closes the opened database. Does not render or alter previous release folders. */ async function storage(
    value,
    projectKey = "current",
  ) {
    const db = await database();
    try {
      return await new Promise(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.callback.11 — Provides the callback for the enclosing map library operation. Inputs: resolve; reject. Updates: r onsuccess; tx oncomplete; tx onerror; tx onabort. Uses: db transaction; tx object store; store put; store get. */
        /* @function mapLibrary.reviewed11 — Runs the local project transaction. Inputs: Promise resolve/reject callbacks, with open database and optional value captured. Returns nothing; installs success/commit/error/abort handlers and uses readwrite only for a save. Completion waits for committed transaction, not merely request success. */ (
          resolve,
          reject,
        ) => {
          const tx = db.transaction(
              "projects",
              value ? "readwrite" : "readonly",
            ),
            store = tx.objectStore("projects"),
            r = value ? store.put(value, projectKey) : store.get(projectKey);
          let result;
          r.onsuccess =
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.onsuccess.12 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: result. Returns: assignment. */
            /* @function mapLibrary.reviewed12 — Retains the request result until transaction commit. Inputs: success event unused. Returns the assigned result (project record for read, key for write); changes only this transaction closure, not active gameplay. */ () =>
              (result = r.result);
          tx.oncomplete =
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.oncomplete.13 — Returns resolve using result. Inputs: no explicit arguments; uses enclosing module state. Uses: resolve. Returns: resolve using result. */
            /* @function mapLibrary.reviewed13 — Resolves a committed local-project transaction. Inputs: completion event unused. Returns Promise settlement result (undefined), forwarding the retained request result. Cannot claim saved state before commit. */ () =>
              resolve(result);
          tx.onerror =
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.onerror.14 — Returns reject using tx error. Inputs: no explicit arguments; uses enclosing module state. Uses: reject. Returns: reject using tx error. */
            /* @function mapLibrary.reviewed14 — Rejects a failed project transaction. Inputs: error event unused. Returns Promise settlement result (undefined), forwarding transaction.error; active authored project remains owned by the caller. */ () =>
              reject(tx.error);
          tx.onabort =
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function map-library.onabort.15 — Returns reject using tx error. Inputs: no explicit arguments; uses enclosing module state. Uses: reject. Returns: reject using tx error. */
            /* @function mapLibrary.reviewed15 — Rejects an aborted project transaction. Inputs: abort event unused. Returns Promise settlement result (undefined), forwarding transaction.error rather than showing successful persistence. */ () =>
              reject(tx.error);
        },
      );
    } finally {
      db.close();
    }
  }

  /* @function map-library.create.16 — Builds a new instance and its public operations from the supplied configuration. Inputs: api. Updates: room interior exits; ruin interior exits; demo travel; demo objects; guide name. Uses: frontier gameplay defaults validate; frontier event templates empty; structured clone; api world. Returns: a record containing remember, switchTo, snapshot, gameplayDefaults, saveTemplate, undoTemplate, redoTemplate, templateHistoryDebug. */ /* @function mapLibrary.references1524 — Inputs: authored world and target map record. Returns whether a direct engine map ID or literal MZ transfer references that target. Traverses JSON objects only, never scripts/notes as executable code. Dynamic variable/script destinations cannot be inferred. No mutation; the owning operation rejects direct dangling links. */
  function references1524(world, target) {
    const pending = [world];
    while (pending.length) {
      const value = pending.pop();
      if (!value || typeof value !== "object") continue;
      if (
        value.type === "mz" &&
        value.code === 201 &&
        value.parameters?.[0] === 0 &&
        value.parameters[1] === target.mzId
      )
        return true;
      for (const [key, item] of Object.entries(value)) {
        if (["map", "mapId", "targetMap"].includes(key) && item === target.id)
          return true;
        if (item && typeof item === "object") pending.push(item);
      }
    }
    return false;
  }
  /* @function mapLibrary.duplicate1524 — Inputs: portable project, source ID and new name. Returns validated independent project with a fresh active map/string and numeric identity. Clones authored world only; live playtest/hub storage is not copied. Direct self-links and literal numeric self-transfers target the copy; external links retain destinations. Throws invalid name/capacity/source before caller adopts anything. */
  function duplicate1524(value, id, name) {
    const next = validate(value),
      source = next.maps.find(
        /* @function mapLibrary.duplicateSource1524 — Inputs: map. Returns source identity match. */ function (
          m,
        ) {
          return m.id === id;
        },
      );
    if (!source) throw Error("Map no longer exists.");
    if (typeof name !== "string" || !name.trim() || name.trim().length > 80)
      throw Error("Copy name must contain 1–80 characters.");
    const copy = {
      id: "map-" + crypto.randomUUID(),
      name: name.trim(),
      world: structuredClone(source.world),
    };
    next.maps = root.FrontierMapIdentities.assign([...next.maps, copy]);
    const assigned = next.maps.at(-1),
      pending = [assigned.world];
    while (pending.length) {
      const record = pending.pop();
      if (!record || typeof record !== "object") continue;
      if (
        record.type === "mz" &&
        record.code === 201 &&
        record.parameters?.[0] === 0 &&
        record.parameters[1] === source.mzId
      )
        record.parameters[1] = assigned.mzId;
      for (const [key, item] of Object.entries(record)) {
        if (["map", "mapId", "targetMap"].includes(key) && item === source.id)
          record[key] = assigned.id;
        else if (item && typeof item === "object") pending.push(item);
      }
    }
    next.active = assigned.id;
    return validate(next);
  }
  /* @function mapLibrary.remove1524 — Inputs: portable project and map ID. Returns validated project excluding that cell, choosing a remaining active cell if needed. Rejects last-map deletion and direct incoming links, listing referring map names. Source project and compact gameplay saves are untouched. */
  function remove1524(value, id) {
    const next = validate(value),
      target = next.maps.find(
        /* @function mapLibrary.removeTarget1524 — Inputs: map. Returns requested identity match. */ function (
          m,
        ) {
          return m.id === id;
        },
      );
    if (!target) throw Error("Map no longer exists.");
    if (next.maps.length <= 1)
      throw Error("Keep at least one map in the project.");
    const incoming = next.maps.filter(
      /* @function mapLibrary.incoming1524 — Inputs: other map. Returns whether it directly refers to the removed cell; self-links do not prevent removal. */ function (
        m,
      ) {
        return m.id !== id && references1524(m.world, target);
      },
    );
    if (incoming.length)
      throw Error(
        "Retarget links from " +
          incoming
            .map(
              /* @function mapLibrary.incomingName1524 — Inputs: referring map. Returns readable name. */ function (
                m,
              ) {
                return m.name;
              },
            )
            .join(", ") +
          " before deleting this map.",
      );
    next.maps = next.maps.filter(
      /* @function mapLibrary.keepMap1524 — Inputs: map. Returns whether it remains in project. */ function (
        m,
      ) {
        return m.id !== id;
      },
    );
    if (next.active === id) next.active = next.maps[0].id;
    return validate(next);
  }
  /* @function mapLibrary.createManagement1524 — Inputs: existing application adapter. Returns editor library/controller with independent map-operation history alongside established world-edit history. Initializes existing test maps and persistence unchanged; new copy/delete operations validate complete candidates before adoption. */
  function create(api) {
    let controller1525;
    let project = {
        schema: "sprite-frontier-maps/1",
        active: "demo",
        gameplayDefaults: FrontierGameplayDefaults.validate(),
        templates: FrontierEventTemplates.empty(),
        maps: [
          {
            id: "demo",
            name: "Vector demo",
            world: structuredClone(api.world()),
          },
        ],
      },
      ready = false,
      revision = 0,
      timer,
      templateSource = null,
      templateCache = null;
    const templateHistory = FrontierTemplateHistory.create();
    // October 13: starting-value edits have compact independent history; no
    // map or embedded model bundles are copied into these undo records.
    const gameplayHistory = FrontierTemplateHistory.create();

    FrontierOutdoorAssets.install();
    project.maps.push({
      id: "outdoor-assets-test",
      name: "Supplied Assets Forest Test",
      world: FrontierOutdoorAssets.world(api.world()),
    });

    const room = FrontierInterior.testWorld(api.world()),
      ruin = FrontierInterior.testWorld(api.world(), true);
    room.interior.exits = [
      {
        id: "room-exit",
        name: "Return to hub",
        x: 9,
        y: 3.2,
        radius: 1.3,
        map: "demo",
        entrance: "room-gate",
      },
    ];
    ruin.interior.exits = [
      {
        id: "ruin-exit",
        name: "Return to hub",
        x: 9,
        y: 4.8,
        radius: 0.6,
        map: "demo",
        entrance: "ruin-gate",
      },
    ];

    project.maps.push(
      { id: "room-test", name: "Room Test", world: room },
      { id: "ruin-test", name: "Geometry Ruin", world: ruin },
    );

    const demo = project.maps[0].world,
      s = demo.spawn;
    demo.travel = {
      entrances: [
        {
          id: "room-gate",
          name: "Room gate arrival",
          x: s.x + 2,
          y: s.y - 1,
          yaw: 0,
        },
        {
          id: "ruin-gate",
          name: "Ruin gate arrival",
          x: s.x - 2,
          y: s.y - 1,
          yaw: 0,
        },
      ],
      exits: [
        {
          id: "enter-room",
          name: "Enter Room Test",
          x: s.x + 2,
          y: s.y - 3,
          radius: 0.7,
          map: "room-test",
          entrance: "entry",
        },
        {
          id: "enter-ruin",
          name: "Enter Geometry Ruin",
          x: s.x - 2,
          y: s.y - 3,
          radius: 0.7,
          map: "ruin-test",
          entrance: "entry",
        },
      ],
    };
    demo.objects = demo.objects.filter(
      /* @function map-library.callback.17 — Returns the inverse of demo travel exits some using a callback. Inputs: e. Uses: demo travel exits some. Returns: the inverse of demo travel exits some using a callback. */ (
        e,
      ) =>
        !demo.travel.exits.some(
          /* @function map-library.callback.18 — Returns math hypot using e x minus g x, e y minus g y is less than 2. Inputs: g. Returns: math hypot using e x minus g x, e y minus g y is less than 2. */ (
            g,
          ) => Math.hypot(e.x - g.x, e.y - g.y) < 2,
        ),
    );

    const guide = FrontierEvents.create("hub-guide", s.x, s.y + 2);
    guide.name = "Hub guide";
    guide.pages[0].commands = [
      {
        type: "journal",
        key: "ruin-relic",
        text: "Explore the Geometry Ruin. Its gate is two tiles left and three tiles south of the hub starting point.",
      },
      {
        type: "message",
        text: "The left gate leads to a small ruin; the right gate enters Room Test. Bring back the relic.",
        dialogue: true,
      },
    ];
    const done = FrontierEvents.page("Relic recovered");
    done.condition = { type: "item", key: "ruin-relic", value: 1 };
    done.commands = [
      {
        type: "journal",
        key: "ruin-relic",
        text: "Recovered the relic and returned to the hub guide.",
      },
      {
        type: "message",
        text: "You found the relic. The hub remembers your discovery.",
        dialogue: true,
      },
    ];
    guide.pages.push(done);
    demo.events.push(guide);

    const relic = FrontierEvents.create("ruin-relic", 9, 12);
    relic.name = "Ruin relic";
    relic.pages[0].graphic = "chest";
    relic.pages[0].commands = [
      { type: "giveItem", item: "ruin-relic", amount: 1 },
      { type: "selfSwitch", key: "A", value: true },
      {
        type: "journal",
        key: "ruin-relic",
        text: "Relic recovered. Return through the entrance and speak to the hub guide.",
      },
    ];
    const empty = FrontierEvents.page("Empty relic chest");
    empty.graphic = "openChest";
    empty.condition = { type: "selfSwitch", key: "A" };
    empty.commands = [
      { type: "message", text: "The relic has already been collected." },
    ];
    relic.pages.push(empty);
    ruin.events.push(relic);

    if (root.FrontierHubFixtures)
      project.maps.push(...root.FrontierHubFixtures.create());
    const wilderness = project.maps.find(/* @function mapLibrary.wilderness162 — Inputs: bundled map. Returns textured wilderness identity match; no mutation. */ function(m){return m.id === "outdoor-assets-test";});
    if(wilderness){const iso=structuredClone(wilderness);iso.id="isometric-wilderness";iso.name="Isometric Textured Wilderness";iso.world.presentation=FrontierIsometric.validate({mode:"isometric"});
      const pistol=FrontierEnemies.preset("handgun");pistol.hostile=true;pistol.coverChance=25;pistol.patrol=[[30,30],[34,30]];iso.world.events.push(FrontierEnemies.event("iso-pistol-test","Pistol patrol - attacks on sight",30,30,pistol,"enemy-chiban"));
      const cover=FrontierEvents.create("iso-cover",32,29);cover.x=32;cover.y=29;cover.name="Static cover event";cover.height=2;cover.pages[0].graphic="chest";cover.pages[0].solid=true;iso.world.events.push(cover);project.maps.push(iso);}

    const label = document.createElement("label");
    label.textContent = "Active map";
    const picker = document.createElement("select");
    picker.id = "activeMap";
    label.append(picker);
    document.querySelector("header .tools").prepend(label);

    const box = document.createElement("fieldset");
    box.innerHTML =
      '<legend>Map library</legend><label>Map name<input id="mapName" maxlength="80" value="Vector demo"></label><button id="renameMap">Rename current map</button><label>New map template<select id="mapTemplate"><option value="isometric">Isometric / orthographic — Fallout style</option><option value="interior">Blank 3D interior</option><option value="flat">Blank flat map</option><option value="hills">Blank hills map</option><option value="demo">Vector demo</option></select></label><button id="newMap">Create new map</button><button id="exportProject">Export all maps</button><label>Import map project<input id="importProject" type="file" accept="application/json,.json"></label><p>Choose the active map above to play or edit it. Changes are saved locally; switching starts a fresh playtest. Export all maps for a portable backup.</p><p id="mapSaveStatus" role="status"></p>';
    document.getElementById("editor").prepend(box);

    const folderLabel = document.createElement("label");
    folderLabel.textContent = "Map folder (Outside/Inside creates a nested path)";
    const folderInput = document.createElement("input");
    folderInput.id = "mapFolder";
    folderInput.maxLength = 160;
    folderInput.placeholder = "Test maps or My world/Outside/Inside";
    folderLabel.append(folderInput);
    const assignFolder = document.createElement("button");
    assignFolder.id = "assignMapFolder";
    assignFolder.textContent = "Create / assign folder";
    assignFolder.onclick = /* @function mapLibrary.assignFolder1525 — Inputs: click ignored. Returns nothing; assigns a trimmed authoring-only folder path to the active map, refreshes grouped navigation and schedules existing local persistence. IDs and gameplay data are unchanged. Blank removes grouping; overlong paths report status without mutation. */ function () {
      const folder = folderInput.value.trim();
      if (folder.length > 160) { status("Folder path is limited to 160 characters."); return; }
      const record = project.maps.find(
        /* @function mapLibrary.folderRecord1525 — Inputs: map record. Returns active-ID match, without mutation. */
        function (entry) { return entry.id === project.active; });
      record.folder = folder;
      remember();
      refresh();
      status(folder ? "Map grouped under " + folder : "Map is ungrouped.");
    };
    box.append(folderLabel, assignFolder);

    const transitionLabel = document.createElement("label");
    transitionLabel.textContent = "Leaving this map: transition";
    const transitionPicker = document.createElement("select");
    transitionPicker.id = "mapTransitionEffect";
    transitionPicker.append(
      new Option("Fade", "fade"),
      new Option("Screen melt", "melt"),
    );
    transitionLabel.append(transitionPicker);
    box.append(transitionLabel);
    transitionPicker.onchange =
      /* @function map-library.onchange.19 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: api world using transition effect. Uses: api world; remember. */ () => {
        api.world().transitionEffect = transitionPicker.value;
        remember();
      };
    const transitionHelp = document.createElement("p");
    transitionHelp.textContent =
      "Applies to exits and event transfers. No-fade commands stay immediate. Reduced-motion preference uses a fade.";
    box.append(transitionHelp);

    const defaultsButton = document.createElement("button");
    defaultsButton.id = "startingGameplayValues";
    defaultsButton.textContent = "Starting gameplay values…";
    box.append(defaultsButton);
    const defaultsUndo = document.createElement("button"),
      defaultsRedo = document.createElement("button");
    defaultsUndo.id = "undoGameplayDefaults";
    defaultsUndo.textContent = "Undo starting values";
    defaultsRedo.id = "redoGameplayDefaults";
    defaultsRedo.textContent = "Redo starting values";
    box.append(defaultsUndo, defaultsRedo);
    /* @function mapLibrary.refreshGameplayHistory — Inputs: none. Returns: nothing; mirrors compact history availability into buttons. No project or runtime mutation. */
    function refreshGameplayHistory() {
      const state = gameplayHistory.debug();
      defaultsUndo.disabled = !state.undo;
      defaultsRedo.disabled = !state.redo;
    }
    /* @function mapLibrary.adoptGameplayDefaults — Inputs: portable starting-values draft. Returns: nothing. Validates before project adoption, starts the owner's fresh playtest, schedules local persistence and reports behavior. An owner failure restores the prior project record and propagates; history is pushed only after success. World/model source and earlier releases are not altered. */
    function adoptGameplayDefaults(value) {
      const checked = FrontierGameplayDefaults.validate(value),
        prior = project.gameplayDefaults;
      project.gameplayDefaults = checked;
      try {
        api.replace(structuredClone(api.world()));
        remember();
      } catch (error) {
        project.gameplayDefaults = prior;
        throw error;
      }
      api.log("Starting gameplay values saved. Fresh playtest started.");
    }
    defaultsUndo.onclick =
      /* @function mapLibrary.undoGameplayDefaults — Inputs: click event unused. Returns: nothing; adopts the last successful starting-value record's before state, then updates controls. Failed adoption keeps history available and reports the error. Separate world/template history is untouched. */ () => {
        try {
          gameplayHistory.undo(
            /* @function mapLibrary.beforeGameplayDefaults — Inputs: history record with detached before/after data. Returns: adoption result; validation errors propagate so history is not consumed. */ (
              record,
            ) => adoptGameplayDefaults(record.before),
          );
          refreshGameplayHistory();
        } catch (error) {
          api.log(error.message);
        }
      };
    defaultsRedo.onclick =
      /* @function mapLibrary.redoGameplayDefaults — Inputs: click event unused. Returns: nothing; reapplies the detached after state and updates controls. Rejected adoption retains redo; errors report through existing status log. */ () => {
        try {
          gameplayHistory.redo(
            /* @function mapLibrary.afterGameplayDefaults — Inputs: compact history record. Returns: adoption result; full project/model bank is never restored by this operation. */ (
              record,
            ) => adoptGameplayDefaults(record.after),
          );
          refreshGameplayHistory();
        } catch (error) {
          api.log(error.message);
        }
      };
    refreshGameplayHistory();
    defaultsButton.onclick =
      /* @function map-library.onclick.20 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier gameplay defaults open. Returns: frontier gameplay defaults open using project gameplay defaults, a callback. */ () =>
        FrontierGameplayDefaults.open(
          project.gameplayDefaults,
          /* @function map-library.callback.21 — Provides the callback for frontier gameplay defaults open. Inputs: value. Updates: project gameplay defaults. Uses: remember; api replace; structured clone; api world. */ (
            value,
          ) => {
            const before = structuredClone(project.gameplayDefaults);
            adoptGameplayDefaults(value);
            gameplayHistory.push({ before, after: project.gameplayDefaults });
            refreshGameplayHistory();
          },
        );

    const $ =
        /* @function map-library.$.22 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id. */ (
          id,
        ) => document.getElementById(id),
      status =
        /* @function map-library.status.23 — Returns assignment. Inputs: text. Updates: $ using "mapSaveStatus" text content. Uses: $. Returns: assignment. */ (
          text,
        ) => ($("mapSaveStatus").textContent = text);

    /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.refresh.24 — Handles refresh within map library. Inputs: no explicit arguments; uses enclosing module state. Updates: transition picker value; picker value; $ using "mapName" value. Uses: project maps find; picker replace children; project maps map; $. */
  /* @function mapLibrary.reviewedrefresh_24 — Refreshes active-map authoring selectors from project. Inputs: none. Returns undefined; ensures door/immediate transition choices exist, sets active transition/map/name draft and replaces map options. Does not commit source edits; assumes validated active map exists and installed controls, otherwise throws. */ function refresh() {
      if (!transitionPicker.querySelector("option[value=door]")) {
        transitionPicker.append(
          new Option("3D door", "door"),
          new Option("Immediate", "immediate"),
        );
      }

      transitionPicker.value =
        project.maps.find(
          /* @function map-library.callback.25 — Returns m id equals project active. Inputs: m. Returns: m id equals project active. */ (
            m,
          ) => m.id === project.active,
        ).world.transitionEffect || "fade";
      picker.replaceChildren(
        ...project.maps.map(
          /* @function map-library.callback.26 — Returns a new option. Inputs: m. Returns: a new option. */ (
            m,
          ) => new Option(m.name, m.id),
        ),
      );
      // October 14: show named folder groups while retaining original option
      // labels and values, so saved transfers and normal selection still work.
      const folders = new Map();
      for (const record of project.maps) {
        const folder = record.folder || "Ungrouped maps";
        if (!folders.has(folder)) {
          const group = document.createElement("optgroup");
          group.label = folder;
          picker.append(group);
          folders.set(folder, group);
        }
        const option = picker.querySelector('option[value="' + record.id + '"]');
        folders.get(folder).append(option);
      }
      picker.value = project.active;
      folderInput.value = project.maps.find(
        /* @function mapLibrary.selectedFolder1525 — Inputs: map record. Returns active-ID match; read-only. */
        function (entry) { return entry.id === project.active; }).folder || "";
      $("mapName").value = project.maps.find(
        /* @function map-library.callback.27 — Returns m id equals project active. Inputs: m. Returns: m id equals project active. */ (
          m,
        ) => m.id === project.active,
      ).name;
    }

    /* @function map-library.snapshot.28 — Captures this system’s current data for persistence or inspection. Inputs: no explicit arguments; uses enclosing module state. Updates: project models; project maps; project maps find using a callback world. Uses: frontier model library export bundles; frontier map identities assign; project maps find; structured clone. Returns: structured clone using project. */ /* October 12, 2026: synchronizing the active authored world is separate from making an export snapshot. remember() and switchTo() discarded whole-project clones, duplicating every model bundle and unrelated cell at transfer boundaries. Persistence/export still receive a complete isolated snapshot. */
    /* @function map-library.syncActive1523 — Inputs: none. Updates project model references, stable map IDs and a private clone of the active authored world. Returns nothing; preserves inactive cells. Does not clone the entire project or its encoded model bundles. Missing active records throw as before. */
    function syncActive1523() {
      project.models = FrontierModelLibrary.exportBundles();
      project.maps = FrontierMapIdentities.assign(project.maps);
      project.maps.find(
        /* @function map-library.callback.29 — Returns m id equals project active. Inputs: m. Returns: m id equals project active. */ (
          m,
        ) => m.id === project.active,
      ).world = structuredClone(api.world());
    }
    /* @function map-library.snapshot1523 — Inputs: none. Synchronizes active authored data then returns a fully isolated project clone for persistence/export. Includes all cells and shared model bundles. Allocates intentionally at explicit snapshot boundaries; changes to returned data cannot mutate the library. */ function snapshot() {
      syncActive1523();
      return structuredClone(project);
    }
    /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.remember.30 — Retains a bounded list of sufficiently separated safe player positions. Inputs: no explicit arguments; uses enclosing module state. Updates: timer. Uses: snapshot; clear timeout; status; set timeout. Returns: without a result. */
  /* @function mapLibrary.reviewedremember_30 — Synchronizes active authored cell and schedules local project persistence. Inputs: none. Returns undefined; updates model references/stable map IDs/active-cell clone, increments revision, then when ready replaces debounce timer with save after500 milliseconds and marks status Saving. Does not retain player recovery positions; that historical contract was incorrect. Whole-project serialization happens later in save, not every call. Errors during sync/DOM access propagate. */ function remember() {
      syncActive1523();
      revision++;
      if (!ready) return;
      clearTimeout(timer);
      status("Saving maps…");
      timer = setTimeout(
        /* @function map-library.callback.31 — Returns save using . Inputs: no explicit arguments; uses enclosing module state. Uses: save. Returns: save using . */ () =>
          save(),
        500,
      );
    }

    /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.save.32 — Handles save within map library. Inputs: no explicit arguments; uses enclosing module state. Uses: storage; snapshot; status. */
  /* @function mapLibrary.reviewedsave_32 — Persists a complete isolated project snapshot. Inputs: none. Returns promise; defers during owned cinematic using100-millisecond retry, otherwise snapshots then awaits IndexedDB storage. Displays success only if revision unchanged; catches storage/snapshot errors and shows export-backup advice. Does not overwrite earlier exported releases. Repeated edits are debounced by remember; outstanding save status is revision-aware. */ async function save() {
      /* October 12: automatic project snapshot/storage may allocate large serialized bundles. Keep it outside the owned cinematic rather than interrupting door presentation; revision remains pending and save retries after transition. */ if (
        api.deferSaving?.()
      ) {
        clearTimeout(timer);
        timer = setTimeout(
          /* @function map-library.deferredSave1523 — Inputs: none. Retries pending automatic save after 100 ms without cloning project during a cinematic. Returns save promise; save owns diagnostics/errors. */ () =>
            save(),
          100,
        );
        return;
      }
      const version = revision;
      try {
        await storage(snapshot());
        if (version === revision) status("Maps saved on this computer.");
      } catch {
        status("Local saving unavailable. Export all maps to keep your work.");
      }
    }

    /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.switchTo.33 — Handles switch to within map library. Inputs: id; options. Updates: project active. Uses: project maps some; snapshot; refresh; api replace. Returns: without a result. */
  /* @function mapLibrary.reviewedswitchTo_33 — Changes active authored cell and asks host to install fresh gameplay state. Inputs: stable map id and optional host replacement options. Returns undefined; unknown IDs no-op. Synchronizes old active source, sets project.active, refreshes selectors, clones destination world into api.replace, then schedules save/logs. Does not clone whole project at travel boundary. Host errors propagate; this helper itself has no rollback for changed active ID, so travel owner must manage failure ownership. */ function switchTo(
      id,
      options,
    ) {
      if (
        !project.maps.some(
          /* @function map-library.callback.34 — Returns m id equals id. Inputs: m. Returns: m id equals id. */ (
            m,
          ) => m.id === id,
        )
      )
        return;
      syncActive1523();
      project.active = id;
      refresh();
      api.replace(
        structuredClone(
          project.maps.find(
            /* @function map-library.callback.35 — Returns m id equals id. Inputs: m. Returns: m id equals id. */ (
              m,
            ) => m.id === id,
          ).world,
        ),
        options,
      );
      remember();
      api.log(
        "Active map: " +
          project.maps.find(
            /* @function map-library.callback.36 — Returns m id equals id. Inputs: m. Returns: m id equals id. */ (
              m,
            ) => m.id === id,
          ).name,
      );
    }

    picker.onchange =
      /* @function map-library.onchange.37 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: switch to. Returns: switch to using picker value. */ () =>
        switchTo(picker.value);

    $("renameMap").onclick =
      /* @function map-library.onclick.38 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: project maps find using a callback name. Uses: $ using "mapName" value trim; $; api log; project maps find. Returns: without a result. */ () => {
        const name = $("mapName").value.trim();
        if (!name) {
          api.log("Enter a map name.");
          return;
        }
        project.maps.find(
          /* @function map-library.callback.39 — Returns m id equals project active. Inputs: m. Returns: m id equals project active. */ (
            m,
          ) => m.id === project.active,
        ).name = name;
        refresh();
        remember();
      };

    /* @function map-library.createMap.40 — Handles create map within map library. Inputs: name; template. Updates: world objects; world events; world terrain; world water. Uses: error; name trim; a list of "flat", "hills", "demo" includes; api generate. Returns: id. */ function createMap(
      name,
      template,
    ) {
      if (typeof name !== "string" || !name.trim() || name.trim().length > 80)
        throw Error("Enter a map name of 1–80 characters.");
      if (!["flat", "hills", "demo", "interior", "isometric"].includes(template))
        throw Error("Unknown map template.");
      const world = api.generate();
      // October 29: newly authored cells inherit current shared shadow strengths; imported projects retain their own authored values.
      world.lighting=root.FrontierLocalLighting.validate(world.lighting);world.lighting.shadows=root.FrontierLocalLighting.shadows169(api.world().lighting?.shadows);
      if (template !== "demo") {
        delete world.travel;
        world.objects = [];
        world.events = [];
        world.terrain = {
          mode: ["interior","isometric"].includes(template) ? "flat" : template,
          amplitude: ["flat","interior","isometric"].includes(template) ? 0 : 2.8,
          frequency: 0.12,
          edits: {},
          revision: 0,
        };
        world.water = FrontierWater.validate();
      } // October 12, 2026: a blank interior is an empty geometry cell, not a room shell.
      if (template === "isometric") world.presentation = FrontierIsometric.validate({mode:"isometric"});
      if (template === "interior") {
        const width = world.width ?? world.size,
          height = world.height ?? world.size;
        world.interior = {
          ...structuredClone(FrontierInterior.defaults),
          mode: "geometry",
          floor: [
            [1, 1],
            [width - 1, 1],
            [width - 1, height - 1],
            [1, height - 1],
          ],
          primitives: [],
          blockers: [],
          sprites: [],
          entrances: [
            {
              id: "entry",
              name: "Main entrance",
              x: world.spawn.x,
              y: world.spawn.y,
              yaw: 0,
            },
          ],
          exits: [],
        };
        world.sky = { ...world.sky, enabled: false };
      }
      const validated = FrontierWorld.validate(world),
        id = "map-" + crypto.randomUUID();
      const current = snapshot();
      commitManagement1524(
        validate({
          ...current,
          active: id,
          maps: [...current.maps, { id, name: name.trim(), folder: folderInput.value.trim(), world: validated }],
        }),
        { maps: project.maps.slice(), active: project.active },
      );
      return id;
    }

    // October 13, 2026: map membership has a separate one-operation Undo/Redo.
    // Store membership records, not another full model bank; ordinary world edits
    // to surviving maps are preserved when restoring membership. New map actions
    // replace this bounded history. It is separate from surface/event Undo.
    let mapHistory1524 = null,
      mapHistoryUndone1524 = false;
    const duplicateButton = document.createElement("button"),
      deleteButton = document.createElement("button"),
      mapUndoButton = document.createElement("button"),
      mapRedoButton = document.createElement("button");
    duplicateButton.id = "duplicateMap";
    duplicateButton.textContent = "Duplicate current map";
    deleteButton.id = "deleteMap";
    deleteButton.textContent = "Delete current map";
    mapUndoButton.id = "undoMapOperation";
    mapUndoButton.textContent = "Undo map operation";
    mapRedoButton.id = "redoMapOperation";
    mapRedoButton.textContent = "Redo map operation";
    mapUndoButton.disabled = mapRedoButton.disabled = true;
    box.append(duplicateButton, deleteButton, mapUndoButton, mapRedoButton);
    const historyNote = document.createElement("p");
    historyNote.textContent =
      "Map operations have one separate Undo/Redo step. Direct incoming doors/transfers must be retargeted before deleting a cell. Copies contain authored data, not playtest inventory.";
    historyNote.id = "mapOperationStatus";
    historyNote.setAttribute("role", "status");
    box.append(historyNote);
    /* @function mapLibrary.adoptManagement1524 — Inputs: validated candidate project. Returns nothing. Installs map membership, replaces current author/playtest from an isolated authored clone, refreshes controls and schedules existing local persistence. No user files are removed; prior releases remain untouched. */
    function adoptManagement1524(candidate) {
      project = candidate;
      refresh();
      api.replace(
        structuredClone(
          project.maps.find(
            /* @function mapLibrary.managementActive1524 — Inputs: map. Returns active identity match. */ function (
              m,
            ) {
              return m.id === project.active;
            },
          ).world,
        ),
      );
      remember();
    }
    /* @function mapLibrary.commitManagement1524 — Inputs: validated candidate and before-membership snapshot. Returns nothing. Records one bounded map-operation history and adopts the candidate. Undo/Redo control state is transient editor preference, not authored data. */
    function commitManagement1524(candidate, before) {
      mapHistory1524 = {
        before,
        after: { maps: candidate.maps.slice(), active: candidate.active },
      };
      mapHistoryUndone1524 = false;
      mapUndoButton.disabled = false;
      mapRedoButton.disabled = true;
      adoptManagement1524(candidate);
    }
    duplicateButton.onclick =
      /* @function mapLibrary.clickDuplicate1524 — Inputs: click unused. Returns nothing. Copies current authored map with fresh identities and rebased self-links, makes it active, and records map Undo. Invalid capacity/data leaves project unchanged and displays the failure. */ function () {
        try {
          const current = snapshot(),
            source = current.maps.find(
              /* @function mapLibrary.copyCurrent1524 — Inputs: map. Returns active match. */ function (
                m,
              ) {
                return m.id === current.active;
              },
            );
          commitManagement1524(
            duplicate1524(
              current,
              current.active,
              source.name.slice(0, 75) + " copy",
            ),
            { maps: project.maps.slice(), active: project.active },
          );
          api.log("Map copied; rename it or adjust its independent settings.");
        } catch (error) {
          // October 14 Test 5: rejection must be visible beside the clicked
          // controls, not only in a distant save-status line or hidden game HUD.
          historyNote.textContent = error.message + (error.message.includes("Keep at least one map") ? " Create a replacement with New map first." : "") + " No maps were changed.";
          historyNote.setAttribute("role", "alert");
          status(error.message);
          api.log(error.message);
        }
      };
    deleteButton.onclick =
      /* @function mapLibrary.clickDelete1524 — Inputs: click unused. Returns nothing. Removes only an unreferenced authored map from the project, retaining it in the one-operation Undo record. Rejects last map/direct links; no filesystem deletion or runtime-save cleanup occurs. */ function () {
        try {
          const current = snapshot();
          commitManagement1524(remove1524(current, current.active), {
            maps: project.maps.slice(),
            active: project.active,
          });
          historyNote.textContent = "Map removed. Undo map operation restores it.";
          status(historyNote.textContent);
          api.log(historyNote.textContent);
        } catch (error) {
          // October 14 Test 5: rejection must be visible beside the clicked
          // controls, not only in a distant save-status line or hidden game HUD.
          historyNote.textContent = error.message + (error.message.includes("Keep at least one map") ? " Create a replacement with New map first." : "") + " No maps were changed.";
          historyNote.setAttribute("role", "alert");
          status(error.message);
          api.log(error.message);
        }
      };
    /* @function mapLibrary.restoreMembership1524 — Inputs: desired before/after membership record. Returns nothing. Keeps newest authored content for surviving IDs and restores archived records only for missing IDs. Rechecks direct incoming links before removing a cell; validates identities and all data before adoption. Does not undo unrelated world/property edits. */
    function restoreMembership1524(target) {
      const current = snapshot();
      // October 29: shadow-strength edits share project-operation history but restore only their own fields, preserving later geometry, membership and event edits.
      if(mapHistory1524.property169==="shadows"){const candidate=structuredClone(current);for(const map of candidate.maps){const prior=target.maps.find(/* @function mapLibrary.shadowHistoryTarget169 — Inputs: archived map. Returns stable-ID match, never matching by array position. */function(item){return item.id===map.id;});if(!prior)continue;map.world.lighting=root.FrontierLocalLighting.validate(map.world.lighting);if(prior.world.lighting?.shadows===undefined)delete map.world.lighting.shadows;else map.world.lighting.shadows=structuredClone(prior.world.lighting.shadows);}adoptManagement1524(validate(candidate));return;}
      for (const membership of [mapHistory1524.before, mapHistory1524.after])
        for (let index = 0; index < membership.maps.length; index++) {
          const latest = current.maps.find(
            /* @function mapLibrary.archiveLatest1524 — Inputs: current map. Returns stable identity match for retained map-history record, preserving edits made after a prior restore. */ function (
              m,
            ) {
              return m.id === membership.maps[index].id;
            },
          );
          if (latest) membership.maps[index] = latest;
        }
      const ids = new Set(
        target.maps.map(
          /* @function mapLibrary.targetMembership1524 — Inputs: retained map. Returns stable string ID. */ function (
            m,
          ) {
            return m.id;
          },
        ),
      );
      for (const removed of current.maps)
        if (!ids.has(removed.id))
          for (const other of current.maps)
            if (ids.has(other.id) && references1524(other.world, removed))
              throw Error(
                "Retarget links from " +
                  other.name +
                  " before removing " +
                  removed.name +
                  ".",
              );
      const maps = target.maps.map(
        /* @function mapLibrary.restoreRecord1524 — Inputs: target membership map. Returns current content for a surviving map, otherwise its retained authored record. */ function (
          m,
        ) {
          return (
            current.maps.find(
              /* @function mapLibrary.survivingRecord1524 — Inputs: current map. Returns stable-ID match. */ function (
                v,
              ) {
                return v.id === m.id;
              },
            ) || m
          );
        },
      );
      adoptManagement1524(
        validate({ ...current, maps, active: target.active }),
      );
    }

    mapUndoButton.onclick =
      /* @function mapLibrary.undoManagement1524 — Inputs: click unused. Returns nothing. Restores the preceding map membership and enables Redo only on successful validation. Failures leave history/state untouched and show readable feedback. */ function () {
        if (!mapHistory1524 || mapHistoryUndone1524) return;
        try {
          restoreMembership1524(mapHistory1524.before);
          mapHistoryUndone1524 = true;
          mapUndoButton.disabled = true;
          mapRedoButton.disabled = false;
        } catch (error) {
          status(error.message);
          api.log(error.message);
        }
      };
    mapRedoButton.onclick =
      /* @function mapLibrary.redoManagement1524 — Inputs: click unused. Returns nothing. Reapplies the stored membership after Undo, preserving surviving map content. Link/identity failures keep the prior project and history available. */ function () {
        if (!mapHistory1524 || !mapHistoryUndone1524) return;
        try {
          restoreMembership1524(mapHistory1524.after);
          mapHistoryUndone1524 = false;
          mapUndoButton.disabled = false;
          mapRedoButton.disabled = true;
        } catch (error) {
          status(error.message);
          api.log(error.message);
        }
      };
    const encounterButton = document.createElement("button");
    encounterButton.id = "addPatrolEncounter";
    encounterButton.textContent = "Add patrol and party encounter map";
    // October 14 Test 5: optional authored examples are preserved separately
    // from everyday map operations; they are not required project setup steps.
    const optionalExamples = document.createElement("details");
    optionalExamples.id = "optionalExampleMaps";
    const examplesSummary = document.createElement("summary");
    examplesSummary.textContent = "Optional examples and test maps";
    optionalExamples.append(examplesSummary, encounterButton);
    box.append(optionalExamples);
    encounterButton.onclick =
      /* @function map-library.onclick.41 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: project. Uses: error; snapshot; crypto random uuid; validate. */ () => {
        try {
          const current = snapshot(),
            id = "map-" + crypto.randomUUID(),
            candidate = validate({
              ...current,
              maps: [
                ...current.maps,
                {
                  id,
                  name: "Patrol and party encounter",
                  world: FrontierEncounterExample.world(api.generate()),
                },
              ],
            });
          commitManagement1524(candidate, {
            maps: project.maps.slice(),
            active: project.active,
          });
          api.log(
            "Encounter added. Speak to Recruit combat companion at (3, 7).",
          );
        } catch (error) {
          api.log(error.message);
        }
      };

    const exampleButton = document.createElement("button");
    exampleButton.id = "addCourierExample";
    exampleButton.textContent = "Add courier quest example (2 maps)";
    optionalExamples.append(exampleButton);

    exampleButton.onclick =
      /* @function map-library.onclick.42 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: project. Uses: error; snapshot; frontier map identities assign using a list of spread element, a record containing id, a record containing id slice; frontier map identities assign. */ () => {
        try {
          const current = snapshot(),
            identities = FrontierMapIdentities.assign([
              ...current.maps,
              { id: "map-" + crypto.randomUUID() },
              { id: "map-" + crypto.randomUUID() },
            ]).slice(-2);

          const added = FrontierQuestExample.maps(api.generate(), identities);

          // Validate the complete prospective project before adopting either new map.

          const candidate = validate({
            ...current,
            maps: [...current.maps, ...added],
          });
          project = candidate;
          switchTo(added[0].id);
          api.log(
            "Courier town and archive added. Speak to the contact; optional Speech practice is nearby.",
          );
        } catch (error) {
          api.log(error.message);
        }
      };

    const newButton = document.createElement("button");
    newButton.id = "newMapToolbar";
    newButton.textContent = "New map…";
    label.after(newButton);

    const dialog = document.createElement("dialog");
    dialog.id = "newMapDialog";
    dialog.innerHTML =
      '<form method="dialog"><h2>Create a separate map</h2><p>Your current map and test maps are kept. Width, height and seed use the toolbar values.</p><label>Name<input id="newMapName" maxlength="80" value="New map" required></label><label>Template<select id="newMapTemplate"><option value="isometric">Isometric / orthographic — Fallout style</option><option value="interior">Blank 3D interior</option><option value="flat">Blank flat map — no events or enemies</option><option value="hills">Blank hills map — no events or enemies</option><option value="demo">Generated vector map</option></select></label><p id="newMapError" role="status"></p><button value="cancel">Cancel</button><button id="confirmNewMap" value="create">Create map</button></form>';
    document.body.append(dialog);

    /* @function map-library.openNewMap.43 — Handles open new map within map library. Inputs: assignment pattern. Updates: $ using "newMapName" value; $ using "newMapTemplate" value; $ using "newMapError" text content. Uses: $; dialog show modal; $ using "newMapName" focus; $ using "newMapName" select. */ function openNewMap(
      template = "flat",
      asProject = false,
    ) {
      newProjectRequested1525 = asProject;
      dialog.querySelector("h2").textContent = asProject ? "Create a blank project" : "Create a separate map";
      dialog.querySelector("p").textContent = asProject ? "Current maps are archived locally before switching. The new project starts with one blank map and shared available assets." : "Existing maps are kept. Create a new map in the current project.";
      $("newMapName").value = "New map";
      $("newMapTemplate").value = template;
      $("newMapError").textContent = "";
      dialog.showModal();
      $("newMapName").focus();
      $("newMapName").select();
    }

    newButton.onclick =
      /* @function map-library.onclick.44 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: open new map. Returns: open new map using . */ () =>
        openNewMap();
    $("newMap").onclick =
      /* @function map-library.onclick.45 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: open new map; $. Returns: open new map using $ using "mapTemplate" value. */ () =>
        openNewMap($("mapTemplate").value);

    $("confirmNewMap").onclick =
      /* @function map-library.onclick.46 — Responds to a button or clickable control. Inputs: event. Updates: $ using "newMapError" text content. Uses: event prevent default; create map; $; dialog close. */ async (
        event,
      ) => {
        event.preventDefault();
        try {
          if (newProjectRequested1525) {
            const previous = snapshot();
            await storage(previous, "archive-" + Date.now() + "-" + crypto.randomUUID());
            const id = createMap($("newMapName").value, $("newMapTemplate").value);
            const created = project.maps.find(/* @function mapLibrary.newProjectMap1525 — Inputs: map. Returns newly created stable-ID match. */ function (map) { return map.id === id; });
            created.folder = "Outside";
            const blank = validate({ ...project, title:$("newMapName").value.trim(), projectMode:"blank", maps:[created], active:id, templates:FrontierEventTemplates.empty(), gameplayDefaults:undefined });
            controller1525.restore(blank);
            status("Blank project created. Prior maps retained in local project backups.");
          } else createMap($("newMapName").value, $("newMapTemplate").value);
          dialog.close();
        } catch (error) {
          $("newMapError").textContent = error.message;
        }
      };

    // October 14: separate projects from adding maps to the current library.
    let newProjectRequested1525 = false;
    const newProjectButton = document.createElement("button");
    newProjectButton.id = "newProjectToolbar";
    newProjectButton.textContent = "New Project";
    newProjectButton.onclick = /* @function mapLibrary.newProjectDialog1525 — Inputs: click ignored. Returns nothing; opens the shared blank-map form in project mode. No data changes before Create. */ function () { openNewMap("flat", true); };
    box.append(newProjectButton);
    const openProjectButton = document.createElement("button");
    openProjectButton.id = "openProjectToolbar";
    openProjectButton.textContent = "Open Project";
    openProjectButton.onclick = /* @function mapLibrary.openProject1525 — Inputs: click ignored. Returns Promise; lists lightweight local archive keys without loading every project/asset bank. Open validates the chosen snapshot and archives the current project before restore. Storage failure leaves current data intact and is reported; connections close in finally. */ async function () {
      const db = await database();
      try {
        const keys = await new Promise(/* @function mapLibrary.projectKeys1525 — Inputs: promise callbacks. Returns nothing; reads archive key names from IndexedDB, propagating read errors. No world mutation. */ function (resolve, reject) {
          const request = db.transaction("projects", "readonly").objectStore("projects").getAllKeys();
          request.onsuccess = /* @function mapLibrary.projectKeysReady1525 — Inputs: event ignored. Returns settlement of key list. */ function () { resolve(request.result); };
          request.onerror = /* @function mapLibrary.projectKeysFailed1525 — Inputs: event ignored. Returns rejection with the storage error. */ function () { reject(request.error); };
        });
        const d = document.createElement("dialog"), choice = document.createElement("select"), notice = document.createElement("p"), open = document.createElement("button"), cancel = document.createElement("button");
        d.className = "hubDialog";
        const heading = document.createElement("h2"); heading.textContent = "Open a saved project";
        for (const key of keys) if (typeof key === "string" && key.startsWith("archive-"))
          choice.append(new Option("Project saved " + new Date(Number(key.split("-")[1])).toLocaleString(), key));
        notice.textContent = choice.options.length ? "Current project is preserved before switching. Use Save Project for a portable JSON copy." : "No previous projects yet. New Project automatically preserves this one here.";
        open.textContent = "Open selected project"; open.disabled = !choice.options.length;
        cancel.textContent = "Cancel";
        cancel.onclick = /* @function mapLibrary.cancelProjectOpen1525 — Inputs: click ignored. Returns nothing; closes and releases this temporary dialog without edits. */ function () { d.close(); d.remove(); };
        open.onclick = /* @function mapLibrary.restoreSelectedProject1525 — Inputs: click ignored. Returns Promise; validates selected archive, writes current backup, then restores through existing project owner. Invalid/failed reads do not adopt partial data; reports error in dialog. */ async function () {
          open.disabled = true;
          try {
            const checked = validate(await storage(undefined, choice.value)), previous = snapshot();
            await storage(previous, "archive-" + Date.now() + "-" + crypto.randomUUID());
            try { controller1525.restore(checked); } catch (error) { controller1525.restore(previous); throw error; }
            d.close(); d.remove();
          } catch (error) { notice.textContent = error.message; open.disabled = false; }
        };
        d.append(heading, choice, notice, open, cancel); document.body.append(d); d.showModal();
      } catch (error) { status(error.message); } finally { db.close(); }
    };
    box.append(openProjectButton);
    const generateButton = $("generate");
    generateButton.textContent = "New generated map…";
    generateButton.onclick =
      /* @function map-library.onclick.47 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: open new map. Returns: open new map using "demo". */ () =>
        openNewMap("demo");

    document.addEventListener(
      "modelimport",
      /* @function map-library.callback.48 — Returns remember using . Inputs: no explicit arguments; uses enclosing module state. Uses: remember. Returns: remember using . */ () =>
        remember(),
    );
    const modelButton = document.createElement("button");
    modelButton.textContent = "3D Model Library…";
    modelButton.id = "openModelLibrary";
    modelButton.onclick =
      /* @function map-library.onclick.49 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier model workbench open. Returns: frontier model workbench open using . */ () =>
        FrontierModelWorkbench.open();
    box.append(modelButton);
    const debugButton = document.createElement("button");
    debugButton.textContent = "Show model collision and zones";
    debugButton.setAttribute("aria-pressed", "false");
    debugButton.onclick =
      /* @function map-library.onclick.50 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: state enabled; debug button text content. Uses: debug button set attribute; string. */ () => {
        const state = FrontierModelDebug.state;
        state.enabled = !state.enabled;
        debugButton.setAttribute("aria-pressed", String(state.enabled));
        debugButton.textContent = state.enabled
          ? "Hide model collision and zones"
          : "Show model collision and zones";
      };
    box.append(debugButton);

    // October 13: native Export Game is distinct from the portable project backup.
    const exportGameButton = document.createElement("button");
    exportGameButton.id = "exportGame";
    exportGameButton.textContent = "Export playable game folder";
    exportGameButton.disabled = !root.FrontierDesktop?.exportGame;
    exportGameButton.title = exportGameButton.disabled
      ? "Folder export is available in the Windows editor. Export all maps retains a portable authoring backup."
      : "Choose a parent folder; a fresh gameplay-only folder will be created.";
    box.append(exportGameButton);
    exportGameButton.onclick =
      /* @function mapLibrary.exportGame — Inputs: button click (unused). Returns promise. Validates a project snapshot and builds its runtime entry using the installed engine document, then asks the native export service to choose a destination. Disables duplicate clicks; reports cancellation and incomplete-copy errors without changing project state or replacing prior exports. */ async function () {
        exportGameButton.disabled = true;
        status("Preparing playable game export...");
        try {
          const html = await root.FrontierDesktop.engineDocument(),
            entry = root.FrontierRuntimeExport.entry(html, snapshot()),
            result = await root.FrontierDesktop.exportGame(entry);
          if (result.cancelled)
            status("Game export cancelled. Project is unchanged.");
          else if (result.ok)
            status(
              "Game folder created: " +
                result.directory +
                " (" +
                result.files +
                " files). Open index.html to play.",
            );
          else
            status(
              "Game export failed: " +
                result.error +
                (result.incompleteDirectory
                  ? " Incomplete folder: " + result.incompleteDirectory
                  : ""),
            );
        } catch (error) {
          status("Game export failed: " + error.message);
        } finally {
          exportGameButton.disabled = !root.FrontierDesktop?.exportGame;
        }
      };
    $("exportProject").onclick =
      /* @function map-library.onclick.51 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: api download; snapshot. Returns: api download using snapshot using , "sprite-frontier-maps.json". */ () =>
        api.download(snapshot(), "sprite-frontier-maps.json");

    $("importProject").onchange =
      /* @function map-library.onchange.52 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: incoming maps; m id; e map; command map; e spatial model id. Uses: $; error; validate; json parse. Returns: without a result. */ async () => {
        try {
          const file = $("importProject").files[0];
          if (!file) return;
          if (file.size > 100000000) throw Error("Map project exceeds 100 MB.");
          const incoming = validate(JSON.parse(await file.text()));
          const existing = snapshot();
          const oldNumbers = incoming.maps.map(
            /* @function map-library.callback.53 — Returns m mz id. Inputs: m. Returns: m mz id. */ (
              m,
            ) => m.mzId,
          );
          incoming.maps = FrontierMapIdentities.remapIncoming(
            existing.maps,
            incoming.maps,
          );
          const mergedTemplates = FrontierEventTemplates.merge(
            existing.templates,
            incoming.templates,
            new Map(
              oldNumbers.map(
                /* @function map-library.callback.54 — Returns a list of id, incoming maps at i mz id. Inputs: id; i. Returns: a list of id, incoming maps at i mz id. */ (
                  id,
                  i,
                ) => [id, incoming.maps[i].mzId],
              ),
            ),
          );
          const idMap = new Map(
            incoming.maps.map(
              /* @function map-library.callback.55 — Returns a list of m id, "map-" plus crypto random uuid using . Inputs: m. Uses: crypto random uuid. Returns: a list of m id, "map-" plus crypto random uuid using . */ (
                m,
              ) => [m.id, "map-" + crypto.randomUUID()],
            ),
          );
          for (const m of incoming.maps) {
            m.id = idMap.get(m.id);
            for (const e of m.world.interior?.exits ||
              m.world.travel?.exits ||
              [])
              if (idMap.has(e.map)) e.map = idMap.get(e.map);
            for (const event of m.world.events)
              FrontierEventTemplates.remapReferences(
                event,
                mergedTemplates.mapping,
              );
            for (const event of m.world.events)
              for (const page of event.pages)
                for (const command of page.commands)
                  if (command.type === "transferMap" && idMap.has(command.map))
                    command.map = idMap.get(command.map);
          }
          const assetMerge = FrontierModelLibrary.merge(incoming.models);
          for (const m of incoming.maps)
            for (const e of m.world.events)
              if (e.spatial?.modelId)
                e.spatial.modelId =
                  assetMerge.mapping.get(e.spatial.modelId) ||
                  e.spatial.modelId;
          for (const entry of mergedTemplates.bank.entries)
            if (
              !existing.templates.entries.some(
                /* @function map-library.callback.56 — Returns old id equals entry id. Inputs: old. Returns: old id equals entry id. */ (
                  old,
                ) => old.id === entry.id,
              ) &&
              entry.event.spatial?.modelId
            )
              entry.event.spatial.modelId =
                assetMerge.mapping.get(entry.event.spatial.modelId) ||
                entry.event.spatial.modelId;
          // October 13: imported cells must retain their item definitions, with
          // model references remapped to the merged bank. Conflicting stable
          // IDs reject before adoption rather than silently changing host items.
          const mergedItems = root.FrontierItemDefinitions.merge(
            existing.gameplayDefaults.extensions.itemDefinitions,
            incoming.gameplayDefaults.extensions.itemDefinitions,
            assetMerge.mapping,
          );
          FrontierModelLibrary.restore(assetMerge.models);
          if (mergedItems !== undefined)
            project.gameplayDefaults.extensions.itemDefinitions = mergedItems;
          project.models = assetMerge.models;
          project.templates = mergedTemplates.bank;
          project.maps.push(...incoming.maps);
          // October 13: imported catalog entries establish a new starting-values
          // baseline. Pre-import Undo must not remove definitions used by new maps.
          gameplayHistory.clear();
          refreshGameplayHistory();
          mapHistory1524 = null;
          mapHistoryUndone1524 = false;
          mapUndoButton.disabled = mapRedoButton.disabled = true;
          switchTo(idMap.get(incoming.active));
          api.log("Imported maps added to this library.");
        } catch (e) {
          api.log(e.message);
        } finally {
          $("importProject").value = "";
        }
      };

    project.maps = FrontierMapIdentities.assign(project.maps);
    refresh();
    return controller1525 = {
      remember,
      switchTo,
      snapshot,
      /* @function mapLibrary.shadowSettings169 — Inputs: validated strength pair. Returns nothing after one project map-operation transaction applying to every current cell; existing lights and per-event contact choices remain intact. Full-project validation precedes adoption, and existing map-operation Undo restores all worlds. */
      shadowSettings169(value){const checked=root.FrontierLocalLighting.shadows169(value),current=snapshot(),candidate=structuredClone(current);for(const map of candidate.maps){map.world.lighting=root.FrontierLocalLighting.validate(map.world.lighting);map.world.lighting.shadows=checked;}commitManagement1524(validate(candidate),{maps:current.maps.slice(),active:current.active});mapHistory1524.property169="shadows";},
      /* @function mapLibrary.weaponDamage169 — Inputs: complete validated native weapon override dictionary. Returns nothing after existing project-default adoption/history. Non-damage overrides are retained by the caller draft, and equipped clones refresh through normal session construction. Rejection preserves the old project. */
      weaponDamage169(value){const before=structuredClone(project.gameplayDefaults),next=structuredClone(before);next.extensions.weaponDefinitions=root.FrontierWeaponDefinitions.validate(value);adoptGameplayDefaults(next);gameplayHistory.push({before,after:project.gameplayDefaults});refreshGameplayHistory();},
      get gameplayDefaults /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.gameplayDefaults.57 — Handles gameplay defaults within map library. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using project gameplay defaults. */
  /* @function mapLibrary.reviewedgameplayDefaults_57 — Returns an isolated starting-gameplay-value draft. Inputs: none. Returns structured clone of project defaults so dialog edits cannot mutate project before Apply. No writes; uncloneable unsupported data would throw, although schema requires portable values. */() {
        return structuredClone(project.gameplayDefaults);
      },
      /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.saveTemplate.58 — Handles save template within map library. Inputs: name; event. Updates: project templates. Uses: name trim; error; crypto random uuid; structured clone. Returns: structured clone using checked entries at using - 1. */
  /* @function mapLibrary.reviewedsaveTemplate_58 — Saves one validated reusable event definition. Inputs: trimmed name1-80 characters and event. Returns detached saved entry; assigns UUID/version1, clones event, validates whole bank before adoption, pushes entry-only history and schedules persistence. Invalid name/bank rejects before bank replacement. Later persistence scheduling errors propagate after adoption; existing event placements are not replaced. */ saveTemplate(
        name,
        event,
      ) {
        if (typeof name !== "string" || !name.trim() || name.trim().length > 80)
          throw Error("Enter a definition name of 1–80 characters.");
        const entry = {
          id: "template-" + crypto.randomUUID(),
          name: name.trim(),
          version: 1,
          event: structuredClone(event),
        };
        const checked = FrontierEventTemplates.validate({
          ...project.templates,
          entries: [...project.templates.entries, entry],
        });
        project.templates = checked;
        templateHistory.push(checked.entries.at(-1));
        remember();
        return structuredClone(checked.entries.at(-1));
      },
      /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.undoTemplate.59 — Handles undo template within map library. Inputs: no explicit arguments; uses enclosing module state. Uses: template history undo. Returns: template history undo using a callback. */
  /* @function mapLibrary.reviewedundoTemplate_59 — Undoes one template-definition save through bounded template history. Inputs: none. Returns history undo result; callback verifies no authored Replace Event references before removal. Rejection leaves history available; source/project changes only through callback and persistence scheduling. */ undoTemplate() {
        return templateHistory.undo(
          /* @function map-library.callback.60 — Provides the callback for template history undo. Inputs: entry. Updates: project templates. Uses: snapshot; project maps some; project templates entries some; error. */ (
            entry,
          ) => {
            snapshot();
            const uses =
              /* @function map-library.uses.61 — Returns event pages some using a callback. Inputs: event. Uses: event pages some. Returns: event pages some using a callback. */ (
                event,
              ) =>
                event.pages.some(
                  /* @function map-library.callback.62 — Returns p commands some using a callback. Inputs: p. Uses: p commands some. Returns: p commands some using a callback. */ (
                    p,
                  ) =>
                    p.commands.some(
                      /* @function map-library.callback.63 — Returns c type equals "replaceEvent" and c template equals entry id. Inputs: c. Returns: c type equals "replaceEvent" and c template equals entry id. */ (
                        c,
                      ) => c.type === "replaceEvent" && c.template === entry.id,
                    ),
                );
            if (
              project.maps.some(
                /* @function map-library.callback.64 — Returns m world events some using uses. Inputs: m. Uses: m world events some. Returns: m world events some using uses. */ (
                  m,
                ) => m.world.events.some(uses),
              ) ||
              project.templates.entries.some(
                /* @function map-library.callback.65 — Returns e id does not equal entry id and uses using e event. Inputs: e. Uses: uses. Returns: e id does not equal entry id and uses using e event. */ (
                  e,
                ) => e.id !== entry.id && uses(e.event),
              )
            )
              throw Error(
                "This definition is used by an event. Remove its Replace Event commands before undoing the definition save.",
              );
            project.templates = {
              ...project.templates,
              entries: project.templates.entries.filter(
                /* @function map-library.callback.66 — Returns e id does not equal entry id. Inputs: e. Returns: e id does not equal entry id. */ (
                  e,
                ) => e.id !== entry.id,
              ),
            };
            remember();
          },
        );
      },
      /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.redoTemplate.67 — Handles redo template within map library. Inputs: no explicit arguments; uses enclosing module state. Uses: template history redo. Returns: template history redo using a callback. */
  /* @function mapLibrary.reviewedredoTemplate_67 — Reapplies one saved reusable definition through template history. Inputs: none. Returns history redo result; validates rebuilt bank and schedules save in callback. Errors propagate and history service owns consumption; no placed event clone is created by this action. */ redoTemplate() {
        return templateHistory.redo(
          /* @function map-library.callback.68 — Provides the callback for template history redo. Inputs: entry. Updates: project templates. Uses: frontier event templates validate; remember. */ (
            entry,
          ) => {
            project.templates = FrontierEventTemplates.validate({
              ...project.templates,
              entries: [...project.templates.entries, entry],
            });
            remember();
          },
        );
      },
      templateHistoryDebug:
        /* @function map-library.templateHistoryDebug.69 — Returns template history debug using . Inputs: no explicit arguments; uses enclosing module state. Uses: template history debug. Returns: template history debug using . */ () =>
          templateHistory.debug(),
      /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.templateBank.70 — Handles template bank within map library. Inputs: no explicit arguments; uses enclosing module state. Updates: template cache; template source. Uses: frontier event templates compile. Returns: template cache. */
  /* @function mapLibrary.reviewedtemplateBank_70 — Returns compiled reusable definitions for runtime/editor placement. Inputs: none. Returns cached compiled bank, rebuilding only when project.templates identity changes. Mutates private cache/source references only; assumes bank changes replace object rather than editing in place. Compilation failures propagate. */ templateBank() {
        if (templateSource !== project.templates) {
          templateCache = FrontierEventTemplates.compile(project.templates);
          templateSource = project.templates;
        }
        return templateCache;
      },
      get active /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.active.71 — Handles active within map library. Inputs: no explicit arguments; uses enclosing module state. Returns: project active. */
  /* @function mapLibrary.reviewedactive_71 — Reads current stable authored map ID. Inputs: none. Returns project.active string; no cloning or mutation. This is catalog ownership, not proof that a host scene replacement succeeded. */() {
        return project.active;
      },
      /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.getByNumber.72 — Handles get by number within map library. Inputs: number. Uses: frontier map identities resolve. Returns: frontier map identities resolve using project maps, number. */
  /* @function mapLibrary.reviewedgetByNumber_72 — Resolves legacy numeric map identity against current project catalog. Inputs: numeric identity. Returns map-identity service result, typically matching record or undefined. No mutation; invalid identity handling belongs to FrontierMapIdentities.resolve. */ getByNumber(
        number,
      ) {
        return FrontierMapIdentities.resolve(project.maps, number);
      },
      /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.get.73 — Handles get within map library. Inputs: id. Uses: project maps find. Returns: project maps find using a callback. */
  /* @function mapLibrary.reviewedget_73 — Finds a project catalog map by stable string ID. Inputs: id. Returns original map record or undefined. No mutation or clone; callers must treat returned authored reference according to library ownership and commit through editor. */ get(
        id,
      ) {
        return project.maps.find(
          /* @function map-library.callback.74 — Returns m id equals id. Inputs: m. Returns: m id equals id. */ (
            m,
          ) => m.id === id,
        );
      },
      /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.restore.75 — Applies saved state to this system. Inputs: value. Updates: project. Uses: validate; frontier model library restore; template history clear; refresh. */
  /* @function mapLibrary.reviewedrestore_75 — Restores a complete validated authoring project. Inputs: portable project value. Returns undefined; validates first, restores model bank, adopts checked project, clears template/starting-value histories, refreshes controls, clones active world into host and schedules persistence. Validation rejects before adoption; later host errors propagate after project/bank adoption, so caller must own transaction recovery. Does not merge projects; import handler is separate. */ restore(
        value,
      ) {
        const checked = validate(value);
        FrontierModelLibrary.restore(checked.models);
        project = checked;
        templateHistory.clear();
        gameplayHistory.clear();
        refreshGameplayHistory();
        refresh();
        api.replace(
          structuredClone(
            project.maps.find(
              /* @function map-library.callback.76 — Returns m id equals project active. Inputs: m. Returns: m id equals project active. */ (
                m,
              ) => m.id === project.active,
            ).world,
          ),
        );
        remember();
      },
      /* Historical contract retained; October 14 reviewed explanation follows. @function map-library.load.77 — Handles load within map library. Inputs: no explicit arguments; uses enclosing module state. Updates: project; project active; forest world; r camera height scale; e y. Uses: storage; validate; frontier model library restore; project maps some. Returns: without a result. */
  /* @function mapLibrary.reviewedload_77 — Loads local authoring project during bootstrap without overriding newer user edits. Inputs: none. Returns promise; reads IndexedDB, adopts validated saved project/models only if revision still matches initial, preserving its active ID. Adds missing bundled example cells and narrowly migrates known historical forest/room/demo fixtures, retaining recovered forest contents as separate map. Refreshes host and reports failures without deleting stored project. Startup readiness/save scheduling is handled after load; arbitrary host failure after adoption is not rolled back here. */ async load() {
        const initial = revision;
        try {
          const saved = await storage();
          if (saved && revision === initial) {
            const original = project;
            const checked = validate(saved);
            FrontierModelLibrary.restore(checked.models);
            project = checked;
            gameplayHistory.clear();
            refreshGameplayHistory();
            // October 14: genuinely blank projects never inherit bundled test
            // cells on the next launch. Fixture migrations remain for examples.
            if (project.projectMode === "blank") {
              refresh();
              const active = project.maps.find(/* @function mapLibrary.blankProjectActive1525 — Inputs: map record. Returns saved active identity match; no mutation. */ function (map) { return map.id === project.active; });
              api.replace(structuredClone(active.world));
              ready = true;
              await save();
              return;
            }
            /* October 13, 2026: the validated saved active cell is authoritative.
             * Supersedes the old unconditional demo-map startup reset, archived
             * byte-for-byte in SOURCE-HISTORY/2026-10-13/map-library-before-active-restore.source-bytes.
             * Reopening an editor project must not discard the user's selection.
             * Fresh projects still start on demo through their initial defaults. */
            for (const m of original.maps)
              if (
                m.id !== "demo" &&
                !project.maps.some(
                  /* @function map-library.callback.79 — Returns e id equals m id. Inputs: e. Returns: e id equals m id. */ (
                    e,
                  ) => e.id === m.id,
                )
              )
                project.maps.push(m);
            const forest = project.maps.find(
              /* @function map-library.callback.80 — Returns m id equals "outdoor-assets-test". Inputs: m. Returns: m id equals "outdoor-assets-test". */ (
                m,
              ) => m.id === "outdoor-assets-test",
            );

            // Older Generate world replaced this bundled forest with the vector template.

            // Preserve those contents before recovering the supplied forest, including saves.

            if (
              forest &&
              !forest.world.groundMaterial &&
              !forest.world.objects.some(
                /* @function map-library.callback.81 — Returns chain. Inputs: e. Uses: e sprite profile starts with. Returns: chain. */ (
                  e,
                ) => e.spriteProfile?.startsWith("bank-"),
              )
            ) {
              project.maps.push({
                id: "forest-backup-" + crypto.randomUUID(),
                name: "Forest contents before recovery",
                world: structuredClone(forest.world),
              });

              forest.world = structuredClone(
                original.maps.find(
                  /* @function map-library.callback.82 — Returns m id equals "outdoor-assets-test". Inputs: m. Returns: m id equals "outdoor-assets-test". */ (
                    m,
                  ) => m.id === "outdoor-assets-test",
                ).world,
              );
              api.log(
                "Forest test recovered. Previous contents are retained as a separate map.",
              );
            }

            const oldRoom = project.maps.find(
              /* @function map-library.callback.83 — Returns m id equals "room-test". Inputs: m. Returns: m id equals "room-test". */ (
                m,
              ) => m.id === "room-test",
            );
            if (
              oldRoom?.world.interior?.image === "img/interiors/Room_Test_A.png"
            ) {
              const r = oldRoom.world.interior;
              if (r.camera.heightScale === 75) r.camera.heightScale = 150;
              const e = r.exits.find(
                /* @function map-library.callback.84 — Returns e id equals "room-exit". Inputs: e. Returns: e id equals "room-exit". */ (
                  e,
                ) => e.id === "room-exit",
              );
              if (
                e &&
                e.x === 9 &&
                ((e.y === 4.8 && e.radius === 0.6) ||
                  (e.y === 5.5 && e.radius === 1.5))
              ) {
                e.y = 3.2;
                e.radius = 1.3;
              }
              const a = r.entrances.find(
                /* @function map-library.callback.85 — Returns e id equals "entry". Inputs: e. Returns: e id equals "entry". */ (
                  e,
                ) => e.id === "entry",
              );
              if (a && a.x === 9 && a.y === 6) a.y = 7.5;
            }
            const oldDemo = project.maps.find(
              /* @function map-library.callback.86 — Returns m id equals "demo". Inputs: m. Returns: m id equals "demo". */ (
                m,
              ) => m.id === "demo",
            );
            if (
              oldDemo &&
              !oldDemo.world.travel &&
              project.maps.some(
                /* @function map-library.callback.87 — Returns m id equals "room-test". Inputs: m. Returns: m id equals "room-test". */ (
                  m,
                ) => m.id === "room-test",
              ) &&
              project.maps.some(
                /* @function map-library.callback.88 — Returns m id equals "ruin-test". Inputs: m. Returns: m id equals "ruin-test". */ (
                  m,
                ) => m.id === "ruin-test",
              )
            ) {
              oldDemo.world.travel = original.maps[0].world.travel;
              oldDemo.world.objects = oldDemo.world.objects.filter(
                /* @function map-library.callback.89 — Returns the inverse of old demo world travel exits some using a callback. Inputs: e. Uses: old demo world travel exits some. Returns: the inverse of old demo world travel exits some using a callback. */ (
                  e,
                ) =>
                  !oldDemo.world.travel.exits.some(
                    /* @function map-library.callback.90 — Returns math hypot using e x minus g x, e y minus g y is less than 2. Inputs: g. Returns: math hypot using e x minus g x, e y minus g y is less than 2. */ (
                      g,
                    ) => Math.hypot(e.x - g.x, e.y - g.y) < 2,
                  ),
              );
              if (
                !oldDemo.world.events.some(
                  /* @function map-library.callback.91 — Returns e id equals "hub-guide". Inputs: e. Returns: e id equals "hub-guide". */ (
                    e,
                  ) => e.id === "hub-guide",
                )
              )
                oldDemo.world.events.push(guide);
            }
            refresh();
            api.replace(
              structuredClone(
                project.maps.find(
                  /* @function map-library.callback.92 — Returns m id equals project active. Inputs: m. Returns: m id equals project active. */ (
                    m,
                  ) => m.id === project.active,
                ).world,
              ),
            );
          }
        } catch (error) {
          status(
            "Local project could not be restored: " +
              error.message +
              ". Stored project retained; export current maps before making changes.",
          );
          api.log("Local project restore failed: " + error.message);
          ready = true;
          return;
        }
        ready = true;
        await save();
      },
    };
  }

  root.FrontierMaps = {
    validate,
    create,
    duplicate: duplicate1524,
    remove: remove1524,
    references: references1524,
  };
})(window);
