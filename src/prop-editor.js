/* October 12, 2026: surface placement shares the normal GLB library and event
 * schema. Furniture is a model event with independent collision; attached art
 * remains decorative and never punches a hole in its supporting wall. */
(/* @function propEditor.install — Inputs: browser namespace. Returns: nothing. Publishes the editor factory; the supplied asset catalog is loaded only on explicit author request. */ function (
  root,
) {
  "use strict";
  /* @function propEditor.withBytes - Inputs: catalog records from a metadata script (each with a "path" to its GLB). Returns a promise for the same records with a "data" Uint8Array attached, loading every GLB through FrontierAssets (files over http(s), the offline copy from disk). Already-loaded records are kept. Rejects with the first readable load error. Added October 15, 2026 (0.15.27), replacing base64 bytes embedded in the catalog scripts. */
  async function withBytes(records) {
    await Promise.all(
      records.map(
        /* @function propEditor.recordBytes - Inputs: one catalog record. Returns a promise that attaches its GLB bytes once. */ async function (record) {
          if (!record.data) record.data = await root.FrontierAssets.bytes(record.path);
        },
      ),
    );
    return records;
  }
  /* @function propEditor.retryable - Inputs: a catalog promise and a function that clears its cache slot. Returns a promise with the same result; on failure it clears the slot first so the author can retry (for example after a dropped connection). */
  function retryable(promise, clear) {
    return promise.catch(
      /* @function propEditor.retryClear - Inputs: load error. Clears the cached promise and rethrows the error unchanged. */ function (error) {
        clear();
        throw error;
      },
    );
  }
  let catalogPromise = null;
  /* @function propEditor.catalog — Inputs: none. Returns: promise resolving supplied asset metadata/encoded bytes. Loads one local data script; errors reject and allow a later retry. No imported asset is decoded until selected. */
  function catalog() {
    if (catalogPromise) return catalogPromise;
    // 0.15.27: metadata comes from the script, model bytes from the GLB files.
    if (root.FrontierSuppliedModels)
      return (catalogPromise = retryable(withBytes(root.FrontierSuppliedModels), /* @function propEditor.clearSupplied - Inputs: none. Clears the supplied catalog cache for a retry. */ function () { catalogPromise = null; }));
    catalogPromise = new Promise(
      /* @function propEditor.catalogLoad — Inputs: promise resolve/reject. Returns: nothing. Adds a trusted local script; listeners report success or failure and release the script node after loading. */ function (
        resolve,
        reject,
      ) {
        const script = document.createElement("script");
        script.src = "assets/models/supplied-catalog.js";
        script.onload =
          /* @function propEditor.catalogReady — Inputs: load event (unused). Returns: nothing. Resolves installed data or rejects a malformed catalog, then removes the loader element. */ function () {
            script.remove();
            if (root.FrontierSuppliedModels)
              resolve(retryable(withBytes(root.FrontierSuppliedModels), /* @function propEditor.clearSuppliedLoad - Inputs: none. Clears the supplied catalog cache for a retry. */ function () { catalogPromise = null; }));
            else {
              catalogPromise = null;
              reject(Error("Supplied catalog is missing."));
            }
          };
        script.onerror =
          /* @function propEditor.catalogFailure — Inputs: error event (unused). Returns: nothing. Releases failed loader and promise so an explicit retry is possible. */ function () {
            script.remove();
            catalogPromise = null;
            reject(Error("Supplied model catalog could not load."));
          };
        document.head.append(script);
      },
    );
    return catalogPromise;
  }
  let castlePromise = null;
  /* @function propEditor.castleCatalog — Inputs: none. Returns: promise for authored castle prefab records. Loads a separate local catalog only after author request; no model is decoded until chosen. Failure releases retry state and reports through the caller. No world mutation. */
  function castleCatalog() {
    if (castlePromise) return castlePromise;
    // 0.15.27: metadata comes from the script, model bytes from the GLB files.
    if (root.FrontierCastleModels)
      return (castlePromise = retryable(withBytes(root.FrontierCastleModels), /* @function propEditor.clearCastle - Inputs: none. Clears the castle catalog cache for a retry. */ function () { castlePromise = null; }));
    castlePromise = new Promise(
      /* @function propEditor.loadCastle — Inputs: promise completion handlers. Returns: nothing. Creates trusted catalog loader and removes it on completion/failure, leaving originals untouched. */ function (
        resolve,
        reject,
      ) {
        const script = document.createElement("script");
        script.src = "assets/models/castle-catalog.js";
        script.onload =
          /* @function propEditor.castleReady — Inputs: load event (unused). Returns: nothing. Resolves installed records; malformed data rejects and allows retry. */ function () {
            script.remove();
            if (root.FrontierCastleModels) resolve(retryable(withBytes(root.FrontierCastleModels), /* @function propEditor.clearCastleLoad - Inputs: none. Clears the castle catalog cache for a retry. */ function () { castlePromise = null; }));
            else {
              castlePromise = null;
              reject(Error("Castle catalog is missing."));
            }
          };
        script.onerror =
          /* @function propEditor.castleFailed — Inputs: error event (unused). Returns: nothing. Releases failed loader and permits retry without changing authored maps. */ function () {
            script.remove();
            castlePromise = null;
            reject(Error("Castle catalog could not load."));
          };
        document.head.append(script);
      },
    );
    return castlePromise;
  }
  /* @function propEditor.create — Inputs: owning application adapter. Returns: refresh/draw operations. Builds model placement controls and pointer listeners. All placements use validated history; pending ghosts never enter save data. */
  function create(api) {
    const panel = document.createElement("fieldset");
    panel.id = "propTools";
    panel.innerHTML =
      '<legend>Models and wall decorations</legend><button id="propSupplied">Show supplied furniture and building models</button><button id="propCastle">Show castle rooms, towers and roofs</button><label>Shared model<select id="propModel"></select></label><label>Placement<select id="propMode"><option value="floor">Rest on floor</option><option value="wall">Attach to wall</option><option value="free">Free placement</option></select></label><label>Uniform scale<input id="propScale" type="number" min="0.001" max="1000" step="0.1" value="1"></label><label>Additional yaw (degrees)<input id="propYaw" type="number" value="0" step="15"></label><label>Placement elevation offset (metres)<input id="propElevation" type="number" min="-100" max="100" step="0.1" value="0"></label><label>Surface stand-off (metres)<input id="propOffset" type="number" min="0" max="1" step="0.005" value="0.005"></label><label><input id="propCollision" type="checkbox" checked>Use model geometry collision</label><label><input id="propSnap" type="checkbox" checked>Snap compatible prefab connectors (Shift-click bypasses)</label><label>Prefab snap distance (metres)<input id="propSnapDistance" type="number" min="0" max="10" step="0.1" value="0.75"></label><button id="propBegin">Pick placement surface</button><button id="propConfirm" disabled>Place model preview</button><button id="propCancel">Cancel model preview</button><p id="propStatus" role="status">Import a model through the shared library, or show the supplied assets. Wall art can have collision disabled.</p>';
    document.getElementById("editor").prepend(panel);
    /* @function propEditor.control — Inputs: stable DOM ID. Returns: current control or null. Read-only lookup, no scene mutation. */
    function control(id) {
      return document.getElementById(id);
    }
    let armed = false,
      ghost = null,
      supplied = [],
      serial = 0,
      selectedModel = "",
      transformDrag = null,
      modelHandles = [];
    const overlay = document.createElement("canvas");
    overlay.id = "propOverlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:7";
    control("gameFrame").append(overlay);
    const transforms = document.createElement("details");
    transforms.id = "propTransformTools";
    transforms.innerHTML =
      '<summary>Edit placed models</summary><label><input id="propEditPlaced" type="checkbox">Select and transform placed models in scene</label><label>Placed model<select id="propPlacedSelection"><option value="">None</option></select></label><label>Transform tool<select id="propTransformMode"><option value="move">Move</option><option value="rotate">Turn about up axis</option><option value="resize">Resize local axis</option></select></label><label>Move axes<select id="propTransformSpace"><option value="world">World</option><option value="local">Local</option></select></label><label>Move snap (metres; 0 is free)<input id="propMoveSnap" type="number" min="0" max="100" step="0.1" value="0.1"></label><label>Turn snap (degrees; 0 is free)<input id="propTurnSnap" type="number" min="0" max="90" step="1" value="15"></label><button id="propDuplicatePlaced">Duplicate selected model</button><button id="propDeletePlaced">Delete selected model</button><p>Drag a colored handle. Each completed drag is one undo step. Turn uses 30 degrees per projected metre; resize adds one metre to the selected local dimension. Attached decoration keeps its host relationship.</p>';
    panel.append(transforms);
    const materialButton = document.createElement("button");
    materialButton.id = "propEditMaterials";
    materialButton.textContent = "Edit selected model materials";
    transforms.append(materialButton);
    materialButton.onclick =
      /* @function propEditor.editMaterials — Inputs: click event unused. Returns: nothing; opens typed slot drafts for the selected authored instance. Apply uses the existing rollback/Undo transaction and validates the spatial component; missing selection reports through prop status. Does not alter GLB bytes, model geometry or collision. */ () => {
        const event = selectedEvent();
        if (!event) {
          message("Select a placed model first.");
          return;
        }
        try {
          root.FrontierModelMaterialEditor.open(
            event,
            /* @function propEditor.adoptMaterials — Inputs: validated optional slot dictionary. Returns: owning transaction acceptance. Re-resolves selected authored identity, replaces only material metadata through spatial validation and restarts normal preview; rejected adoption leaves modal open. */ (
              value,
            ) =>
              api.mutate(
                /* @function propEditor.materialTransaction — Inputs: none. Returns: nothing; updates selected event materials only within the existing world-history boundary. Throws if the instance disappeared; other event fields and model-bank bytes remain unchanged. */ () => {
                  const current = selectedEvent();
                  if (!current) throw Error("Selected model no longer exists.");
                  current.spatial = root.FrontierModelEvents.validate({
                    ...current.spatial,
                    materials: value,
                  });
                },
              ),
          );
        } catch (error) {
          message(error.message);
        }
      };
    /* @function propEditor.selectedEvent — Inputs: none. Returns currently selected authored model event by stable ID, or undefined after deletion/map change. No scene mutation. */
    function selectedEvent() {
      return api.world().events.find(
        /* @function propEditor.selectedIdentity — Inputs: event. Returns stable selected model identity match. */ function (
          event,
        ) {
          return (
            event.id === selectedModel && event.spatial?.visual === "model"
          );
        },
      );
    }
    /* @function propEditor.refreshPlaced — Inputs: none. Returns nothing; rebuilds placed-model choices after history/map changes, preserving a surviving stable identity and discarding invalid selection. Does not decode assets. */
    function refreshPlaced() {
      if (!selectedEvent()) selectedModel = "";
      const select = control("propPlacedSelection");
      select.replaceChildren(new Option("None", ""));
      for (const event of api.world().events)
        if (event.spatial?.visual === "model")
          select.add(new Option(event.name || event.id, event.id));
      select.value = selectedModel;
    }
    control("propPlacedSelection").onchange =
      /* @function propEditor.choosePlaced — Inputs: unused change. Returns nothing; selects an authored identity for draw-only handles and cancels pending transform. No geometry/history changes. */ function () {
        selectedModel = control("propPlacedSelection").value;
        transformDrag = null;
      };
    control("propEditPlaced").onchange =
      /* @function propEditor.enableTransforms — Inputs: unused change. Returns nothing; releases placement reservation/preview before enabling scene selection, clears pending drags and existing room selection so competing gizmos cannot overlap. */ function () {
        cancel();
        transformDrag = null;
        if (control("roomSelection")) {
          control("roomSelection").value = "";
          control("roomSelection").dispatchEvent(new Event("change"));
        }
      };
    /* @function propEditor.eventTransform — Inputs: model event. Returns validated world pivot in metres and rotation in degrees, with terrain-relative saved elevation resolved. No event mutation. */
    function eventTransform(event) {
      return root.FrontierModelTransform.validate({
        position: [
          event.x,
          event.y,
          root.FrontierTerrain.height(api.world(), event.x, event.y) +
            (event.heightOffset ?? (event.elevation || 0) * 0.3),
        ],
        rotation: event.spatial.rotation,
        scale: event.spatial.scale,
      });
    }
    /* @function propEditor.saveTransform — Inputs: existing authored event and validated transform. Returns nothing; updates world pivot, terrain-relative elevation, rotation and scale, then rebases an existing room/model attachment to keep manual adjustments from being reverted by synchronization. Missing hosts retain metadata/last pose for repair. Called only inside shared undo transaction. */
    function saveTransform(event, transform) {
      event.x = transform.position[0];
      event.y = transform.position[1];
      event.heightOffset =
        transform.position[2] -
        root.FrontierTerrain.height(api.world(), event.x, event.y);
      event.elevation = 0;
      event.spatial.rotation = [...transform.rotation];
      event.spatial.scale = [...transform.scale];
      const attached = event.extensions?.placement;
      if (attached?.parentKind === "room") {
        const host = api.world().interior?.primitives.find(
          /* @function propEditor.rebaseRoomHost — Inputs: primitive. Returns saved attachment parent identity match. */ function (
            piece,
          ) {
            return piece.id === attached.parentId;
          },
        );
        if (host)
          event.extensions.placement = root.FrontierPropPlacement.attachRoom(
            host,
            transform,
          );
      } else if (attached?.parentKind === "model") {
        const host = api.world().events.find(
          /* @function propEditor.rebaseModelHost — Inputs: event. Returns saved attachment parent identity match. */ function (
            candidate,
          ) {
            return candidate.id === attached.parentId;
          },
        );
        if (host)
          event.extensions.placement = root.FrontierPropPlacement.attachModel(
            api.world(),
            host,
            transform,
          );
      }
    }
    control("propDuplicatePlaced").onclick =
      /* @function propEditor.duplicatePlaced — Inputs: unused click. Returns nothing; deep-copies selected event and all individual settings, assigns a fresh stable ID, offsets its pivot one world metre on X, and rebases attachments in one validated history transaction. Shared GLB remains referenced once. Missing selection reports feedback. */ function () {
        const event = selectedEvent();
        if (!event) {
          message("Select a placed model first.");
          return;
        }
        const copy = structuredClone(event),
          transform = eventTransform(copy);
        copy.id = "prop-" + Date.now() + "-" + ++serial;
        copy.name = (copy.name || "Model") + " copy";
        transform.position[0] += 1;
        const accepted = api.mutate(
          /* @function propEditor.commitDuplicate — Inputs: none. Returns nothing; appends detached event then applies/rebases its offset within rollback-capable transaction. */ function () {
            api.world().events.push(copy);
            saveTransform(copy, transform);
          },
        );
        if (accepted !== false) {
          selectedModel = copy.id;
          refreshPlaced();
        }
      };
    control("propDeletePlaced").onclick =
      /* @function propEditor.deletePlaced — Inputs: unused click. Returns nothing; removes only the selected model event in one undo transaction. Shared assets are retained; dependent decorations retain last placement for explicit host repair. Missing selection is a no-op. */ function () {
        const event = selectedEvent();
        if (!event) return;
        api.mutate(
          /* @function propEditor.commitDelete — Inputs: none. Returns nothing; removes matching event from current authored map without touching shared model library. */ function () {
            api.world().events = api.world().events.filter(
              /* @function propEditor.keepOtherEvents — Inputs: event candidate. Returns whether it is not the selected object being removed. */ function (
                candidate,
              ) {
                return candidate.id !== event.id;
              },
            );
          },
        );
        selectedModel = "";
        refreshPlaced();
      };
    /* @function propEditor.handleTransform — Inputs: captured drag and projected metre amount. Returns detached validated model transform preview. World/local move uses captured unit vector; turn is Z-up; resizing alters one local scale using actual decoded bounds extent. Invalid scale throws and leaves authored event untouched. */
    function handleTransform(drag, amount) {
      const result = structuredClone(drag.original);
      if (drag.mode === "move") {
        for (let axis = 0; axis < 3; axis++)
          result.position[axis] += drag.units[axis] * amount;
      } else if (drag.mode === "rotate") result.rotation[2] += amount * 30;
      else {
        const extent = drag.extent;
        if (extent < 0.000001)
          throw Error("Cannot resize a zero-width model dimension.");
        result.scale[drag.index] += amount / extent;
      }
      return root.FrontierModelTransform.validate(result);
    }
    control("view").addEventListener(
      "pointerdown",
      /* @function propEditor.beginTransform — Inputs: primary pointer event. Returns nothing; when explicit model edit mode is enabled, captures a visible handle or selects the real nearest model geometry. Reserves clicks before legacy authoring, never writes authored transform during drag. */ function (
        event,
      ) {
        if (
          !api.editing() ||
          armed ||
          !control("propEditPlaced").checked ||
          event.button !== 0
        )
          return;
        const rect = control("view").getBoundingClientRect(),
          game = api.game(),
          x = ((event.clientX - rect.left) * game.viewWidth) / rect.width,
          y = ((event.clientY - rect.top) * 480) / rect.height;
        const handle = modelHandles.find(
          /* @function propEditor.hitTransformHandle — Inputs: drawn handle. Returns endpoint proximity within 10 logical pixels. */ function (
            candidate,
          ) {
            return Math.hypot(candidate.end.x - x, candidate.end.y - y) < 10;
          },
        );
        event.preventDefault();
        event.stopImmediatePropagation();
        if (handle && selectedEvent()) {
          try {
            const original = eventTransform(selectedEvent()),
              model = root.FrontierModelLibrary.get(
                selectedEvent().spatial.modelId,
              ),
              mode = control("propTransformMode").value,
              snap = Number(
                control(mode === "rotate" ? "propTurnSnap" : "propMoveSnap")
                  .value,
              );
            if (
              !Number.isFinite(snap) ||
              snap < 0 ||
              snap > (mode === "rotate" ? 90 : 100)
            )
              throw Error("Invalid transform snap.");
            transformDrag = {
              id: selectedModel,
              original,
              preview: original,
              mode,
              index: handle.index,
              units: handle.units,
              vector: handle.vector,
              start: { x, y },
              amount: 0,
              snap: mode === "rotate" ? snap / 30 : snap,
              extent:
                model.scene.bounds.max[handle.index] -
                model.scene.bounds.min[handle.index],
            };
            control("view").setPointerCapture(event.pointerId);
          } catch (error) {
            message(error.message);
          }
        } else {
          const picked = root.FrontierModelTargeting.pick(
            game,
            x,
            y,
            game.sceneEvents || [],
            true,
          );
          selectedModel = picked?.eventId || picked?.id || "";
          refreshPlaced();
        }
      },
      true,
    );
    control("view").addEventListener(
      "pointermove",
      /* @function propEditor.previewTransform — Inputs: captured pointer motion. Returns nothing; projects displacement onto captured screen-axis vector, applies optional snap and updates draw-only transform. Invalid resizing reports feedback while retaining last valid preview. No per-frame world mutation. */ function (
        event,
      ) {
        if (!transformDrag) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const rect = control("view").getBoundingClientRect(),
          x = ((event.clientX - rect.left) * api.game().viewWidth) / rect.width,
          y = ((event.clientY - rect.top) * 480) / rect.height,
          v = transformDrag.vector;
        let amount =
          ((x - transformDrag.start.x) * v.x +
            (y - transformDrag.start.y) * v.y) /
          (v.x * v.x + v.y * v.y);
        if (transformDrag.snap)
          amount = Math.round(amount / transformDrag.snap) * transformDrag.snap;
        try {
          transformDrag.preview = handleTransform(transformDrag, amount);
          transformDrag.amount = amount;
        } catch (error) {
          message(error.message);
        }
      },
      true,
    );
    control("view").addEventListener(
      "pointerup",
      /* @function propEditor.commitTransform — Inputs: captured pointer release. Returns nothing; commits the last valid detached preview in exactly one shared undo transaction, preserving host attachment offsets. Releases capture before mutation/restart. Zero movement produces no history entry. */ function (
        event,
      ) {
        if (!transformDrag) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const drag = transformDrag;
        transformDrag = null;
        if (control("view").hasPointerCapture(event.pointerId))
          control("view").releasePointerCapture(event.pointerId);
        if (!drag.amount) return;
        api.mutate(
          /* @function propEditor.applyTransform — Inputs: none. Returns nothing; resolves captured stable identity in current authored map and updates it through normal save/attachment rebasing. Missing event rejects rather than editing another selection. */ function () {
            const target = api.world().events.find(
              /* @function propEditor.draggedIdentity — Inputs: event. Returns captured drag identity match. */ function (
                candidate,
              ) {
                return candidate.id === drag.id;
              },
            );
            if (!target) throw Error("Selected model no longer exists.");
            saveTransform(target, drag.preview);
          },
        );
      },
      true,
    );
    control("view").addEventListener(
      "pointercancel",
      /* @function propEditor.cancelTransform — Inputs: pointer cancellation. Returns nothing; discards uncommitted preview without changing authored transform/history. */ function () {
        transformDrag = null;
      },
      true,
    );
    control("propCastle").onclick =
      /* @function propEditor.showCastle — Inputs: click (unused). Returns: promise. Adds lazy prefab choices without importing every model; existing furniture choices are retained. Reports load failure without scene mutation. */ async function () {
        try {
          const records = await castleCatalog();
          const ids = new Set();
          for (const e of supplied) ids.add(e.id);
          for (const e of records) if (!ids.has(e.id)) supplied.push(e);
          refreshList();
          message(
            "Castle prefabs available. Floor-level pivots and dimensions are recorded in the kit guide.",
          );
        } catch (error) {
          message(error.message);
        }
      };
    /* @function propEditor.message — Inputs: user-facing plain text. Returns: nothing. Updates local status outside the render loop. */
    function message(text) {
      control("propStatus").textContent = text;
    }
    /* @function propEditor.refreshList — Inputs: none. Returns: nothing. Rebuilds shared/supplied choices without decoding assets; preserves selected ID where possible. Does not change the library or world. */
    function refreshList() {
      const chosen = control("propModel").value,
        existing = root.FrontierModelLibrary.list(),
        known = new Set();
      control("propModel").replaceChildren(new Option("Choose model", ""));
      for (const item of [...existing, ...supplied]) {
        if (known.has(item.id)) continue;
        known.add(item.id);
        control("propModel").append(new Option(item.name, item.id));
      }
      control("propModel").value = known.has(chosen) ? chosen : "";
    }
    control("propSupplied").onclick =
      /* @function propEditor.showSupplied — Inputs: click (unused). Returns: promise. Loads catalog metadata on request without decoding/importing every GLB. Reports file failure and leaves authored state intact. */ async function () {
        try {
          const records = await catalog();
          const ids = new Set();
          for (const e of supplied) ids.add(e.id);
          for (const e of records) if (!ids.has(e.id)) supplied.push(e);
          refreshList();
          message(
            "Supplied assets available. Only a chosen model is imported.",
          );
        } catch (error) {
          message(error.message);
        }
      };
    /* @function propEditor.asset — Inputs: selected model ID. Returns: decoded shared asset or null. Imports an unregistered supplied GLB once, using the ordinary library decoder and import event. Throws decoder errors before any scene mutation. */
    function asset(id) {
      const existing = root.FrontierModelLibrary.get(id);
      if (existing) return existing;
      const record = supplied.find(
        /* @function propEditor.findSupplied — Inputs: catalog item. Returns: whether its stable ID matches selection; no mutation. */ function (
          e,
        ) {
          return e.id === id;
        },
      );
      if (!record) return null;
      // 0.15.27: bytes were loaded from the GLB file when the catalog opened.
      const bytes = record.data.slice();
      root.FrontierModelLibrary.importBundle({
        id: record.id,
        name: record.name,
        entry: record.file,
        files: { [record.file]: bytes },
      });
      document.dispatchEvent(new Event("modelimport"));
      return root.FrontierModelLibrary.get(id);
    }
    control("propBegin").onclick =
      /* @function propEditor.begin — Inputs: click (unused). Returns: nothing. Validates selected asset, then reserves scene clicks for placement. Does not add events; cancellation releases this reservation. */ function () {
        try {
          const id = control("propModel").value;
          if (!asset(id)) throw Error("Choose or import a model first.");
          armed = true;
          ghost = null;
          api.game().authorPlacementActive = true;
          message(
            "Click a visible " +
              control("propMode").value +
              " surface. The outline is a preview until confirmed.",
          );
        } catch (error) {
          message(error.message);
        }
      };
    /* @function propEditor.nearestSurface — Inputs: camera ray. Returns: nearest room face point/unit normal/parent, or null. Uses actual cached geometry and flips normals toward the viewer so attached art faces the author. No world mutation or mesh recompilation. */
    function nearestSurface(ray) {
      return surface1525(ray, api.game());
    }
    control("view").addEventListener(
      "pointerdown",
      /* @function propEditor.pick — Inputs: pointer event. Returns: nothing. While armed in authoring, fits the selected shared model to the clicked room surface and stores a ghost. Consumes placement clicks before legacy tools; incompatible surfaces report an error without committing. */ function (
        event,
      ) {
        if (!armed || !api.editing() || event.button !== 0) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        try {
          const game = api.game(),
            rect = control("view").getBoundingClientRect(),
            x =
              ((event.clientX - rect.left) * (game.viewWidth || 640)) /
              rect.width,
            y = ((event.clientY - rect.top) * 480) / rect.height;
          const ray = root.FrontierModelTargeting.ray(game, x, y),
            surface = nearestSurface(ray);
          if (!surface)
            throw Error(
              "Click a visible room, model or outdoor terrain surface.",
            );
          const mode = control("propMode").value;
          if (mode === "floor" && surface.normal[2] < 0.99)
            throw Error("Select an upward floor or landing surface.");
          if (mode === "wall" && Math.abs(surface.normal[2]) > 0.01)
            throw Error("Select a vertical wall.");
          const scale = Number(control("propScale").value),
            yaw = Number(control("propYaw").value),
            model = asset(control("propModel").value);
          let transform = root.FrontierPropPlacement.fit(
            model.scene.bounds,
            surface.point,
            mode === "free" ? [0, 0, 1] : surface.normal,
            [scale, scale, scale],
            yaw,
            Number(control("propOffset").value),
          );
          // October 13, 2026: open tower/room modules have no upper floor to click.
          // A transient vertical proposal offset allows stacking in empty space;
          // connector snapping then aligns real metadata anchors. Negative values
          // also allow deliberate sinking. The saved model transform owns the result.
          const elevationOffset = Number(control("propElevation").value);
          if (
            !Number.isFinite(elevationOffset) ||
            Math.abs(elevationOffset) > 100
          )
            throw Error(
              "Placement elevation offset must be -100 to 100 metres.",
            );
          transform.position[2] += elevationOffset;
          let connection = null;
          const metadata = supplied.find(
            /* @function propEditor.sourcePrefab — Inputs: catalog record. Returns chosen prefab metadata or false; no mutation. */ function (
              record,
            ) {
              return (
                record.id === control("propModel").value && record.connectors
              );
            },
          );
          if (metadata && control("propSnap").checked && !event.shiftKey) {
            const candidates = [];
            for (const e of api.world().events || []) {
              const m = e.extensions?.prefab;
              if (!m || e.spatial?.visual !== "model") continue;
              candidates.push({
                id: e.id,
                metadata: m,
                transform: {
                  position: [
                    e.x,
                    e.y,
                    root.FrontierTerrain.height(api.world(), e.x, e.y) +
                      (e.heightOffset ?? (e.elevation || 0) * 0.3),
                  ],
                  rotation: e.spatial.rotation,
                  scale: e.spatial.scale,
                },
              });
            }
            const snapped = root.FrontierPrefabPlacement.snap(
              transform,
              metadata,
              candidates,
              Number(control("propSnapDistance").value),
            );
            transform = snapped.transform;
            connection = snapped.connection;
          }
          const parent = api.world().interior?.primitives.find(
            /* @function propEditor.surfaceParent — Inputs: primitive. Returns: hit parent ID match. No mutation. */ function (
              e,
            ) {
              return e.id === surface.parentId;
            },
          );
          ghost = {
            modelId: control("propModel").value,
            transform,
            connection,
            attachment:
              mode === "wall" && parent
                ? root.FrontierPropPlacement.attachRoom(parent, transform)
                : mode === "wall" && surface.parentKind === "model"
                  ? root.FrontierPropPlacement.attachModel(
                      api.world(),
                      api.world().events.find(
                        /* @function propEditor.modelAttachmentHost — Inputs: event. Returns hit model host by stable identity. No mutation. */ function (
                          candidate,
                        ) {
                          return candidate.id === surface.parentId;
                        },
                      ),
                      transform,
                    )
                  : null,
          };
          control("propConfirm").disabled = false;
          message(
            connection
              ? "Snapped " +
                  connection.source +
                  " to " +
                  connection.target +
                  " on " +
                  connection.targetId +
                  ". Confirm to place."
              : "Preview aligned. Confirm to place, or click another surface.",
          );
        } catch (error) {
          ghost = null;
          control("propConfirm").disabled = true;
          message(error.message);
        }
      },
      true,
    );
    control("propConfirm").onclick =
      /* @function propEditor.confirm — Inputs: click (unused). Returns: nothing. Commits one normal model event through history. Visual, mesh collision and attachment metadata remain independent; no whole-model interaction zone is created automatically. */ function () {
        modelHandles = [];
        if (control("propEditPlaced").checked && selectedEvent()) {
          const event = selectedEvent(),
            transform = transformDrag?.preview || eventTransform(event),
            model = root.FrontierModelLibrary.get(event.spatial.modelId),
            camera = root.FrontierRender.camera(game);
          if (model?.scene) {
            const matrix = root.FrontierModelTransform.matrix(transform),
              corners = [],
              bounds = model.scene.bounds;
            for (const z of [bounds.min[2], bounds.max[2]])
              for (const y of [bounds.min[1], bounds.max[1]])
                for (const x of [bounds.min[0], bounds.max[0]])
                  corners.push(
                    root.FrontierModelTransform.vector(matrix, [x, y, z]),
                  );
            ctx.strokeStyle = "#ffdc72";
            ctx.beginPath();
            for (let i = 0; i < 8; i++)
              for (const bit of [1, 2, 4])
                if (!(i & bit)) {
                  const a = root.FrontierRender.project(camera, ...corners[i]),
                    b = root.FrontierRender.project(
                      camera,
                      ...corners[i | bit],
                    );
                  if (a && b) {
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                  }
                }
            ctx.stroke();
            const center = root.FrontierModelTransform.vector(matrix, [
                (bounds.min[0] + bounds.max[0]) / 2,
                (bounds.min[1] + bounds.max[1]) / 2,
                (bounds.min[2] + bounds.max[2]) / 2,
              ]),
              start = root.FrontierRender.project(camera, ...center),
              mode = control("propTransformMode").value;
            if (start)
              for (let index = 0; index < 3; index++) {
                if (mode === "rotate" && index !== 2) continue;
                const units = [0, 0, 0];
                units[index] = 1;
                const local =
                    mode === "resize" ||
                    (mode === "move" &&
                      control("propTransformSpace").value === "local"),
                  direction = local
                    ? root.FrontierModelTransform.vector(
                        root.FrontierModelTransform.matrix({
                          rotation: transform.rotation,
                        }),
                        units,
                        0,
                      )
                    : units,
                  end = root.FrontierRender.project(
                    camera,
                    center[0] + direction[0],
                    center[1] + direction[1],
                    center[2] + direction[2],
                  );
                if (!end) continue;
                const vector = { x: end.x - start.x, y: end.y - start.y };
                if (Math.hypot(vector.x, vector.y) < 3) continue;
                ctx.strokeStyle = ctx.fillStyle = [
                  "#ff8080",
                  "#80ff90",
                  "#80bfff",
                ][index];
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
                ctx.fillRect(end.x - 5, end.y - 5, 10, 10);
                modelHandles.push({ index, end, vector, units: direction });
              }
          }
        }
        if (!ghost) return;
        const pending = structuredClone(ghost);
        const accepted = api.mutate(
          /* @function propEditor.commitEvent — Inputs: none. Returns: nothing. Creates an ordinary static event and positions its model pivot using terrain-relative heightOffset. Throws before transaction commit if model/transform validation fails. */ function () {
            const w = api.world(),
              position = pending.transform.position,
              event = root.FrontierEvents.create(
                "prop-" + Date.now() + "-" + ++serial,
                position[0],
                position[1],
              );
            event.name =
              root.FrontierModelLibrary.list().find(
                /* @function propEditor.modelName — Inputs: library entry. Returns: chosen ID match; no mutation. */ function (
                  e,
                ) {
                  return e.id === pending.modelId;
                },
              )?.name || "Placed model";
            event.pages[0].graphic = "none";
            event.pages[0].solid = false;
            event.heightOffset =
              position[2] - root.FrontierTerrain.height(w, event.x, event.y);
            event.spatial = root.FrontierModelEvents.validate({
              visual: "model",
              modelId: pending.modelId,
              collisionMode: control("propCollision").checked ? "mesh" : "none",
              rotation: pending.transform.rotation,
              scale: pending.transform.scale,
              interactionZones: [],
            });
            const prefab = supplied.find(
              /* @function propEditor.prefabMetadata — Inputs: catalog record. Returns: whether the chosen model has shared prefab connector metadata; no mutation. */ function (
                record,
              ) {
                return record.id === pending.modelId && record.connectors;
              },
            );
            if (prefab)
              event.extensions = {
                ...event.extensions,
                prefab: {
                  family: "castle-1524",
                  connectors: structuredClone(prefab.connectors),
                  dimensions: structuredClone(prefab.dimensions),
                },
              };
            if (pending.attachment)
              event.extensions = {
                ...event.extensions,
                placement: pending.attachment,
              };
            w.events.push(event);
          },
        );
        if (accepted === false) {
          ghost = pending;
          armed = true;
          api.game().authorPlacementActive = true;
          control("propConfirm").disabled = false;
          message(
            "Placement rejected. Check bounds and height, or pick another surface.",
          );
          return;
        }
        cancel();
        message(
          "Model placed. Select its event for individual transforms, zones or template authoring.",
        );
      };
    /* @function propEditor.cancel — Inputs: none. Returns: nothing. Releases scene-click reservation and ghost; neither event data nor undo history changes. */
    function cancel() {
      armed = false;
      ghost = null;
      api.game().authorPlacementActive = false;
      control("propConfirm").disabled = true;
    }
    control("propCancel").onclick = cancel;
    control("propModel").onchange =
      /* @function propEditor.changedModel — Inputs: select change (unused). Returns: nothing. Starts each newly chosen asset with geometry collision enabled and clears stale placement previews. Authors may explicitly disable collision for the new choice afterward; a previous painting override cannot silently make a castle non-solid. */ function () {
        cancel();
        control("propCollision").checked = true;
      };
    document.addEventListener("modelimport", refreshList);
    /* @function propEditor.refresh — Inputs: none. Returns: nothing. Rebuilds choices after world/history changes and releases stale placement reservations. */
    function refresh() {
      cancel();
      transformDrag = null;
      refreshList();
      refreshPlaced();
    }
    /* @function propEditor.draw — Inputs: none. Returns: nothing. Draws a wireframe ghost using the shared scene transform and logical camera projection. No mesh copies or per-frame texture reads; clears preview outside authoring. */
    function draw() {
      const game = api.game(),
        width = game.viewWidth || 640;
      if (overlay.width !== width || overlay.height !== 480) {
        overlay.width = width;
        overlay.height = 480;
      }
      const ctx = overlay.getContext("2d");
      ctx.clearRect(0, 0, width, 480);
      if (!api.editing()) {
        if (armed) cancel();
        return;
      }
      modelHandles = [];
      if (control("propEditPlaced").checked && selectedEvent()) {
        const event = selectedEvent(),
          transform = transformDrag?.preview || eventTransform(event),
          model = root.FrontierModelLibrary.get(event.spatial.modelId),
          camera = root.FrontierRender.camera(game);
        if (model?.scene) {
          const matrix = root.FrontierModelTransform.matrix(transform),
            corners = [],
            bounds = model.scene.bounds;
          for (const z of [bounds.min[2], bounds.max[2]])
            for (const y of [bounds.min[1], bounds.max[1]])
              for (const x of [bounds.min[0], bounds.max[0]])
                corners.push(
                  root.FrontierModelTransform.vector(matrix, [x, y, z]),
                );
          ctx.strokeStyle = "#ffdc72";
          ctx.beginPath();
          for (let i = 0; i < 8; i++)
            for (const bit of [1, 2, 4])
              if (!(i & bit)) {
                const a = root.FrontierRender.project(camera, ...corners[i]),
                  b = root.FrontierRender.project(camera, ...corners[i | bit]);
                if (a && b) {
                  ctx.moveTo(a.x, a.y);
                  ctx.lineTo(b.x, b.y);
                }
              }
          ctx.stroke();
          const center = root.FrontierModelTransform.vector(matrix, [
              (bounds.min[0] + bounds.max[0]) / 2,
              (bounds.min[1] + bounds.max[1]) / 2,
              (bounds.min[2] + bounds.max[2]) / 2,
            ]),
            start = root.FrontierRender.project(camera, ...center),
            mode = control("propTransformMode").value;
          if (start)
            for (let index = 0; index < 3; index++) {
              if (mode === "rotate" && index !== 2) continue;
              const units = [0, 0, 0];
              units[index] = 1;
              const local =
                  mode === "resize" ||
                  (mode === "move" &&
                    control("propTransformSpace").value === "local"),
                direction = local
                  ? root.FrontierModelTransform.vector(
                      root.FrontierModelTransform.matrix({
                        rotation: transform.rotation,
                      }),
                      units,
                      0,
                    )
                  : units,
                end = root.FrontierRender.project(
                  camera,
                  center[0] + direction[0],
                  center[1] + direction[1],
                  center[2] + direction[2],
                );
              if (!end) continue;
              const vector = { x: end.x - start.x, y: end.y - start.y };
              if (Math.hypot(vector.x, vector.y) < 3) continue;
              ctx.strokeStyle = ctx.fillStyle = [
                "#ff8080",
                "#80ff90",
                "#80bfff",
              ][index];
              ctx.beginPath();
              ctx.moveTo(start.x, start.y);
              ctx.lineTo(end.x, end.y);
              ctx.stroke();
              ctx.fillRect(end.x - 5, end.y - 5, 10, 10);
              modelHandles.push({ index, end, vector, units: direction });
            }
        }
      }
      if (!ghost) return;
      const model = root.FrontierModelLibrary.get(ghost.modelId),
        matrix = root.FrontierModelTransform.matrix(ghost.transform),
        camera = root.FrontierRender.camera(game);
      ctx.strokeStyle = "#72e6a2";
      ctx.lineWidth = 1;
      ctx.beginPath();
      root.FrontierModelScene.triangles(
        model,
        model.scene,
        matrix,
        /* @function propEditor.previewTriangle — Inputs: transformed triangle points. Returns: nothing. Projects visible triangle edges into the ghost overlay; points behind the near plane are skipped. */ function (
          points,
        ) {
          const q = points.map(
            /* @function propEditor.projectVertex — Inputs: world point. Returns: logical projected point or null. No mutation. */ function (
              p,
            ) {
              return root.FrontierRender.project(camera, ...p);
            },
          );
          if (!q.every(Boolean)) return;
          ctx.moveTo(q[0].x, q[0].y);
          ctx.lineTo(q[1].x, q[1].y);
          ctx.lineTo(q[2].x, q[2].y);
          ctx.closePath();
        },
      );
      ctx.stroke();
    }
    refreshList();
    refreshPlaced();
    return { refresh, draw };
  }
  /* @function propEditor.sharedSurface1525 � Inputs: normalized world ray and live game. Returns nearest rendered room/model/terrain surface with world point, viewer-facing normal and distance, or null. October 14 extracts the historical placement traversal for shared static item drops; no scene mutation, traversal occurs only on placement requests. Author cutaway applies only in authoring. Dependency failures propagate. */
    function surface1525(ray, game) {
      let nearest = null;
      for (const face of root.FrontierAuthorView?.faces(
        game,
        root.FrontierRender.camera(game),
        root.FrontierInterior.data(game.sourceWorld)?.faces || [],
      ) ||
        root.FrontierInterior.data(game.sourceWorld)?.faces ||
        []) {
        for (let i = 1; i < face.points.length - 1; i++) {
          const distance = root.FrontierModelScene.rayTriangle(
            ray.origin,
            ray.direction,
            [face.points[0], face.points[i], face.points[i + 1]],
          );
          if (
            distance === null ||
            distance < 0.01 ||
            (nearest && distance >= nearest.distance)
          )
            continue;
          const a = face.points[0],
            b = face.points[i],
            c = face.points[i + 1],
            u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]],
            v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
          const normal = [
              u[1] * v[2] - u[2] * v[1],
              u[2] * v[0] - u[0] * v[2],
              u[0] * v[1] - u[1] * v[0],
            ],
            length = Math.hypot(...normal);
          if (length < 1e-8) continue;
          const facing =
            normal[0] * ray.direction[0] +
              normal[1] * ray.direction[1] +
              normal[2] * ray.direction[2] >
            0
              ? -1
              : 1;
          for (let k = 0; k < 3; k++) normal[k] = (normal[k] / length) * facing;
          nearest = {
            distance,
            normal,
            parentId: face.id,
            point: ray.origin.map(
              /* @function propEditor.surfacePoint — Inputs: ray-origin component and axis. Returns: world intersection component. No mutation. */ function (
                value,
                k,
              ) {
                return value + ray.direction[k] * distance;
              },
            ),
          };
        }
      }
      // Imported surfaces are traversed only on placement clicks. Their real
      // triangle normals and shared transforms govern the fit, never bounds.
      for (const host of game.sourceWorld.events || []) {
        if (host.spatial?.visual !== "model") continue;
        const model = root.FrontierModelLibrary.get(host.spatial.modelId);
        if (!model?.scene) continue;
        const elevation =
          root.FrontierTerrain.height(game.sourceWorld, host.x, host.y) +
          (host.heightOffset ?? (host.elevation || 0) * 0.3);
        const matrix = root.FrontierModelEvents.matrix({
          ...host,
          z: elevation,
        });
        root.FrontierModelScene.triangles(
          model,
          model.scene,
          matrix,
          /* @function propEditor.importedSurface — Inputs: world-space triangle points. Returns: nothing. Retains closest real model hit and viewer-facing unit normal for placement. Runs on author clicks only; does not change model data or allocate a render cache. */ function (
            points,
          ) {
            const distance = root.FrontierModelScene.rayTriangle(
              ray.origin,
              ray.direction,
              points,
            );
            if (
              distance === null ||
              distance < 0.01 ||
              (nearest && distance >= nearest.distance)
            )
              return;
            const a = points[0],
              b = points[1],
              c = points[2],
              ux = b[0] - a[0],
              uy = b[1] - a[1],
              uz = b[2] - a[2],
              vx = c[0] - a[0],
              vy = c[1] - a[1],
              vz = c[2] - a[2],
              normal = [
                uy * vz - uz * vy,
                uz * vx - ux * vz,
                ux * vy - uy * vx,
              ],
              length = Math.hypot(...normal);
            if (length < 1e-8) return;
            const facing =
              normal[0] * ray.direction[0] +
                normal[1] * ray.direction[1] +
                normal[2] * ray.direction[2] >
              0
                ? -1
                : 1;
            for (let i = 0; i < 3; i++) normal[i] *= facing / length;
            const point = [];
            for (let i = 0; i < 3; i++)
              point.push(ray.origin[i] + ray.direction[i] * distance);
            nearest = {
              distance,
              normal,
              parentId: host.id,
              parentKind: "model",
              point,
            };
          },
        );
      }
      // Outdoor terrain is sampled with a bounded bracket and then bisected.
      // Interior holes do not fall back to an invisible terrain placement plane.
      if ((!game.sourceWorld.interior || game.sourceWorld.interior.outdoor) && ray.direction[2] < 0) {
        let previous = 0.01;
        for (
          let distance = 0.5;
          distance < Math.min(nearest?.distance || 100, 100);
          distance += 0.5
        ) {
          const x = ray.origin[0] + ray.direction[0] * distance,
            y = ray.origin[1] + ray.direction[1] * distance,
            z = ray.origin[2] + ray.direction[2] * distance;
          if (
            x < 0.5 ||
            y < 0.5 ||
            x > game.sourceWorld.width - 0.5 ||
            y > game.sourceWorld.height - 0.5
          ) {
            previous = distance;
            continue;
          }
          if (z > root.FrontierTerrain.height(game.sourceWorld, x, y)) {
            previous = distance;
            continue;
          }
          let low = previous,
            high = distance;
          for (let i = 0; i < 20; i++) {
            const middle = (low + high) / 2,
              mx = ray.origin[0] + ray.direction[0] * middle,
              my = ray.origin[1] + ray.direction[1] * middle,
              mz = ray.origin[2] + ray.direction[2] * middle;
            if (mz > root.FrontierTerrain.height(game.sourceWorld, mx, my))
              low = middle;
            else high = middle;
          }
          const point = [];
          for (let i = 0; i < 3; i++)
            point.push(ray.origin[i] + ray.direction[i] * high);
          nearest = {
            distance: high,
            normal: [0, 0, 1],
            parentId: null,
            parentKind: "terrain",
            point,
          };
          break;
        }
      }
      return nearest;
    }
  root.FrontierPropEditor = { create, surface: surface1525 };
})(window);
