/* October 12, 2026: building palette and direct surface editing. All commits
 * pass through the application's existing validated undo transaction. Ghosts
 * live only in this controller, never in exported cell data. */
(/* @function buildingEditor.install — Inputs: browser namespace. Returns: nothing. Installs the editor factory; no DOM changes until create receives the owning application adapter. */ function (
  root,
) {
  "use strict";
  /* @function buildingEditor.create — Inputs: adapter exposing world/game/editing/mutate/log. Returns: refresh/draw controller. Creates accessible authoring fields and a noninteractive overlay; listens only while editing. Failed generation is reported without changing the cell. */
  function create(api) {
    const kit = root.FrontierBuildingKit,
      assembly = root.FrontierBuildingAssemblies,
      host = document.getElementById("editor");
    const panel = document.createElement("fieldset");
    panel.id = "buildingTools";
    panel.innerHTML =
      '<legend>Build rooms and modules</legend><p>X: left/right. Y: forward/back. Z: up/down. Dimensions use world metres.</p><label>Piece<select id="buildingType"><option value="wall">Wall</option><option value="floor">Floor</option><option value="ceiling">Ceiling</option><option value="doorway">Doorway</option><option value="stairs">Straight stairs</option><option value="block">Block / landing</option><option value="shell">Enclosed room shell</option><option value="roundShell">Round tower room</option><option value="roundWall">Curved wall section</option><option value="roundFloor">Round floor</option><option value="roundCeiling">Round ceiling</option></select></label><div id="buildingDimensions"></div><label>Material<select id="buildingMaterial"><option value="">Plain white</option><option value="img/materials/walls/Tex_Castle_1.png">Castle stone</option><option value="img/materials/walls/Tex_Castle_2.png">Castle stone 2</option><option value="img/materials/roofs/Tex_Castle_roof_1.png">Castle roof tiles</option><option value="img/materials/walls/prop_wood_panel_wall1.png">Wood panel</option><option value="img/materials/floors/prop_wood_floor1.png">Wood floor</option><option value="img/materials/ceilings/prop_tin_ceiling1.png">Tin ceiling</option></select></label><label><input id="buildingConnect" type="checkbox" checked>Snap nearby connectors</label><button id="buildingPreview">Preview placement</button><button id="buildingConfirm" disabled>Place preview</button><button id="buildingCancel">Cancel preview</button><p id="buildingStatus" role="status">Choose a piece, adjust dimensions, then preview. Click a visible room surface to select it.</p><label>Highlight axis<select id="buildingAxis"><option value="x">X — left/right</option><option value="y">Y — forward/back</option><option value="z">Z — up/down</option></select></label><button id="buildingDuplicate">Duplicate selected surface</button><button id="buildingRotate">Rotate selected surface 90°</button><p>Drag the selected colored axis handle in the scene. Numeric fields remain under Interior authoring. Every confirmed change is one undo step.</p>';
    const scenePlace=document.createElement("button");scenePlace.id="buildingPlaceScene";scenePlace.type="button";scenePlace.textContent="Place in scene";panel.prepend(scenePlace);
    host.prepend(panel);
    // Assembly and axis-space choices belong to the editor, not map gameplay.
    const transformOptions = document.createElement("div");
    transformOptions.innerHTML =
      '<label>Handle tool<select id="buildingManipulation"><option value="move">Move</option><option value="rotate">Turn about up axis</option><option value="resize">Resize local dimensions</option></select></label><label>Rotation snap (degrees; 0 = free)<input id="buildingAngleSnap" type="number" min="0" max="90" step="1" value="15"></label><label><input id="buildingWholeAssembly" type="checkbox" checked>Move, rotate and duplicate the whole stair assembly</label><label>Handle space<select id="buildingSpace"><option value="world">World axes</option><option value="local">Selected piece local axes</option></select></label><p>Hold Shift while clicking Preview to bypass connector snapping. Numeric surface fields edit the individual part.</p>';
    panel.append(transformOptions);

    const viewTools = document.createElement("div");
    viewTools.innerHTML =
      '<button id="buildingEnterView">Enter room view</button><label><input id="buildingCutaway" type="checkbox" checked>Cutaway near walls and ceiling (editor only)</label>';
    panel.prepend(viewTools);
    document.getElementById("buildingCutaway").onchange =
      /* @function buildingEditor.cutaway - Inputs: control change. Returns: nothing. Changes only transient author visibility; saved geometry and playtest collision are unaffected. */ function () {
        root.FrontierAuthorView.state.cutaway = this.checked;
      };
    document.getElementById("buildingEnterView").onclick =
      /* @function buildingEditor.enterView - Inputs: click (unused). Returns: nothing. Places only the author camera/player at the current cell's authored spawn and selects first-person inspection. Does not change saved spawn, history or sprite presentation. */ function () {
        const game = api.game();
        Object.assign(game.player, {
          x: api.world().spawn.x,
          y: api.world().spawn.y,
          z:
            api.world().spawn.z ??
            root.FrontierTerrain.height(
              api.world(),
              api.world().spawn.x,
              api.world().spawn.y,
            ),
        });
        game.camera.firstPerson = true;
        game.camera.yaw = 0;
        game.camera.pitch = -0.2;
      };
    /* @function buildingEditor.element — Inputs: unique DOM ID. Returns: current control or null. Reads only; caller uses IDs created by this factory or the established room editor. */
    function element(id) {
      return document.getElementById(id);
    }
    for (const [key, label, value, min, max, step] of [
      ["x", "Center X", 9, 1, 200, 0.1],
      ["y", "Center Y", 9, 1, 200, 0.1],
      ["z", "Base elevation Z", 0, -29, 79, 0.1],
      ["width", "Width", 2, 0.5, 80, 0.1],
      ["depth", "Depth / stair run", 2, 0.05, 80, 0.1],
      ["height", "Height / stair rise", 3, 0.02, 20, 0.1],
      ["thickness", "Wall / slab thickness", 0.2, 0.05, 1, 0.05],
      ["steps", "Stair step count", 12, 1, 64, 1],
      ["turns", "Quarter turns", 0, 0, 3, 1],
      ["repeat", "Texture repeat size", 2, 0.05, 100, 0.1],
      ["radius", "Round clear radius", 4, 1, 40, 0.1],
      ["segments", "Round segments (8–64)", 32, 8, 64, 1],
      ["arc", "Curved wall arc (degrees)", 90, 1, 360, 1],
    ]) {
      const field = document.createElement("label");
      field.textContent = label;
      const input = document.createElement("input");
      input.id = "building-" + key;
      input.type = "number";
      input.value = value;
      input.min = min;
      input.max = max;
      input.step = step;
      field.append(input);
      element("buildingDimensions").append(field);
    }
    const precise169=document.createElement("details"),preciseTitle169=document.createElement("summary");preciseTitle169.textContent="Precise position and advanced options";precise169.append(preciseTitle169);for(const key of ["x","y","z","turns","repeat","thickness","radius","segments","arc"])precise169.append(element("building-"+key).closest("label"));for(const control of [transformOptions,element("buildingAxis").closest("label"),element("buildingDuplicate"),element("buildingRotate"),element("buildingConnect").closest("label"),element("buildingPreview"),element("buildingConfirm")])precise169.append(control);panel.append(precise169);
    const overlay = document.createElement("canvas");
    overlay.id = "buildingOverlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:6";
    element("gameFrame").append(overlay);
    let placing169=false;
    let ghost = null,
      selected = "",
      handles = [],
      drag = null,
      serial = 0,
      activeMap = null;
    element("sceneTool").append(new Option("Place building piece","building"));
    scenePlace.onclick=/* @function buildingEditor.arm169 - Inputs: click ignored. Arms scene placement without changing world data. Original dimensions/material draft and snapping remain authoritative; fixed artwork is rejected when previewing. */function(){placing169=true;element("sceneTool").value="building";status("Click ground or a floor to place this piece. Escape cancels. One click is one Undo step.");};
    element("buildingType").addEventListener("change",/* @function buildingEditor.fields169 - Inputs: type change ignored. Shows relevant dimensions only; hidden advanced values remain intact. No authoring mutation. */function(){const type=element("buildingType").value;for(const key of ["depth","height","steps","radius","segments","arc","thickness"]){const relevant=key==="steps"?type==="stairs":key==="radius"||key==="segments"?type.startsWith("round"):key==="arc"?type==="roundWall":key==="depth"?!["wall","doorway"].includes(type):key==="height"?!["floor","ceiling","roundFloor","roundCeiling"].includes(type):true;element("building-"+key).closest("label").hidden=!relevant;}});
    element("buildingManipulation").onchange =
      /* @function buildingEditor.handleMode — Inputs: tool selection change. Returns nothing; cancels uncommitted drag and makes coordinate-space constraints visible. Turning is up-axis yaw; resizing uses local dimensions. No authored edits. */ function () {
        drag = null;
        const mode = element("buildingManipulation").value;
        element("buildingSpace").disabled = mode !== "move";
        if (mode === "resize") element("buildingSpace").value = "local";
        if (mode === "rotate") {
          element("buildingSpace").value = "world";
          element("buildingAxis").value = "z";
        }
        status(
          mode === "rotate"
            ? "Drag the blue Turn handle (30 degrees per projected metre); rotation snap is in degrees."
            : mode === "resize"
              ? "Drag local width/depth/height handles. Scaling anchors the lowest base; textures keep their repeat settings."
              : "Drag world/local axes; movement snap is in metres.",
        );
      };
    /* @function buildingEditor.applyHandle — Inputs: mutable primitive list and captured drag record. Returns nothing; applies one move/yaw/resize operation to selected identity. Used on detached previews and inside the validated commit transaction. Resize factor derives from original local span, not current mouse-frame geometry. The projected one-metre Turn handle maps that screen distance to 30 degrees about world up; generated pieces remain vertical. */
    function applyHandle(primitives, pending) {
      if (pending.mode === "move")
        assembly.translate(
          primitives,
          pending.original.id,
          pending.units.map(
            /* @function buildingEditor.handleMovement — Inputs: captured unit component. Returns world movement metres for the preview/commit. */ function (
              unit,
            ) {
              return unit * pending.amount;
            },
          ),
          pending.whole,
        );
      else if (pending.mode === "rotate")
        assembly.rotate(
          primitives,
          pending.original.id,
          (pending.amount * Math.PI) / 6,
          pending.whole,
        );
      else
        assembly.resize(
          primitives,
          pending.original.id,
          pending.axis,
          1 + pending.amount / pending.span[pending.axis],
          pending.whole,
        );
    }
    element("roomSelection").addEventListener(
      "change",
      /* @function buildingEditor.followRoomSelection — Inputs: selection change (unused). Returns: nothing. Synchronizes scene outline/gizmos with numeric-property and hierarchy selections; ignores arrivals/sprites and cancels an uncommitted axis drag. No map mutation. */ function () {
        const id = element("roomSelection").value;
        selected = "";
        for (const e of api.world().interior?.primitives || [])
          if (e.id === id) {
            selected = id;
            break;
          }
        drag = null;
      },
    );
    /* @function buildingEditor.selectedParts — Inputs: optional captured assembly flag. Returns fresh live selected parts from the current world. No stale references survive undo/reload. Checkbox affects gizmo, rotation and duplication only; numeric individual fields remain explicit. */
    function selectedParts(whole = element("buildingWholeAssembly").checked) {
      return assembly.members(
        api.world().interior?.primitives || [],
        selected,
        whole,
      );
    }
    /* @function buildingEditor.selection — Inputs: none. Returns: selected primitive from current authoritative cell or undefined if removed/switched. No stale object reference survives an undo or map change. */
    function selection() {
      return api.world().interior?.primitives.find(
        /* @function buildingEditor.findSelected — Inputs: primitive. Returns: whether its stable ID matches selection. No mutation. */ function (
          e,
        ) {
          return e.id === selected;
        },
      );
    }
    /* @function buildingEditor.status — Inputs: plain user-facing message. Returns: nothing. Updates only this panel's live status, never per-frame logs. */
    function status(message) {
      element("buildingStatus").textContent = message;
    }
    /* @function buildingEditor.options — Inputs: none. Returns: numeric form values with chosen material and unique preview prefix. Invalid values are checked by generation and world validation before commit. No world mutation. */
    function options() {
      const o = {};
      for (const key of [
        "x",
        "y",
        "z",
        "width",
        "depth",
        "height",
        "thickness",
        "steps",
        "turns",
        "repeat",
        "radius",
        "segments",
        "arc",
      ])
        o[key] = Number(element("building-" + key).value);
      o.id = "building-" + Date.now() + "-" + ++serial;
      o.material = {
        texture: element("buildingMaterial").value || undefined,
        tileSize: o.repeat,
      };
      return o;
    }
    /* @function buildingEditor.generate — Inputs: piece kind and validated dimensional options. Returns: independent primitive records and optional floor outline. Doorway dimensions leave an open volume; stairs use native step columns. Throws impossible openings before creating a ghost. */
    function generate(type, o) {
      if (type === "roundShell")
        return kit.roundShell({
          ...o,
          floorMaterial: o.material,
          wallMaterial: o.material,
          ceilingMaterial: o.material,
        });
      if (["roundWall", "roundFloor", "roundCeiling"].includes(type)) {
        const wall = type === "roundWall",
          base = type === "roundFloor" ? o.z - o.thickness : o.z;
        const piece = kit.round(
          o.id,
          wall
            ? "Curved wall"
            : type === "roundFloor"
              ? "Round floor"
              : "Round ceiling",
          o.x,
          o.y,
          base,
          o.radius + (wall ? o.thickness : 0),
          wall ? o.radius : 0,
          wall ? o.height : o.thickness,
          o.segments,
          o.material,
          wall
            ? {
                arcStart: (o.turns * Math.PI) / 2,
                arcSweep: (o.arc * Math.PI) / 180,
              }
            : {},
        );
        /* October 13: standalone round slabs need explicit support roles just like rectangular slabs; otherwise a painted layout treats a visible added floor as unwalkable. */ piece.moduleType =
          wall ? "wall" : type === "roundFloor" ? "floor" : "ceiling";
        return { primitives: [piece] };
      }
      if (type === "shell")
        return kit.shell({
          ...o,
          floorMaterial: o.material,
          wallMaterial: o.material,
          ceilingMaterial: o.material,
        });
      if (type === "stairs")
        return {
          primitives: kit.stairs({ ...o, run: o.depth, rise: o.height }),
        };
      const w = o.width,
        d = type === "wall" || type === "doorway" ? o.thickness : o.depth;
      const h = type === "floor" || type === "ceiling" ? o.thickness : o.height;
      if (
        ![w, d, h].every(
          /* @function buildingEditor.positiveDimensions — Inputs: dimension. Returns: finite positive validity; no mutation. */ function (
            n,
          ) {
            return Number.isFinite(n) && n > 0;
          },
        )
      )
        throw Error("Dimensions must be positive finite numbers.");
      const base = type === "floor" ? o.z - h : o.z;
      if (type === "doorway") {
        const opening = Math.min(0.9, w - 0.4),
          openingHeight = 2.1;
        if (w < 1.3 || h <= openingHeight)
          throw Error("Doorways need width ≥1.3 and height above 2.1 metres.");
        const side = (w - opening) / 2;
        return {
          primitives: [
            kit.box(
              o.id + "-left",
              "Doorway left",
              o.x - (opening + side) / 2,
              o.y,
              base,
              side,
              d,
              openingHeight,
              o.material,
            ),
            kit.box(
              o.id + "-right",
              "Doorway right",
              o.x + (opening + side) / 2,
              o.y,
              base,
              side,
              d,
              openingHeight,
              o.material,
            ),
            kit.box(
              o.id + "-top",
              "Doorway lintel",
              o.x,
              o.y,
              base + openingHeight,
              w,
              d,
              h - openingHeight,
              o.material,
            ),
          ],
        };
      }
      // October 12: standalone floor/landing pieces must contribute to the
      // same walkable union as painted floors and stairs in a grid-authored cell.
      const primitive = kit.box(
        o.id,
        type[0].toUpperCase() + type.slice(1),
        o.x,
        o.y,
        base,
        w,
        d,
        h,
        o.material,
      );
      primitive.moduleType = type;
      return { primitives: [primitive] };
    }
    element("buildingPreview").onclick =
      /* @function buildingEditor.preview — Inputs: click event; Shift temporarily disables snapping. Returns nothing. Generates a nonpersistent ghost; optional whole-module snapping uses exposed face connectors. Reports invalid forms without replacing the previous world. */ function (
        event,
      ) {
        try {
          if (api.world().interior?.mode === "fixed")
            throw Error("Choose a 3D room or outdoor map; this map uses PNG artwork.");
          ghost = generate(element("buildingType").value, options());
          if (element("buildingConnect").checked && !event?.shiftKey) {
            const snapped = assembly.snap(
              kit,
              ghost.primitives,
              api.world().interior?.primitives || [],
            );
            ghost.primitives = snapped.primitives;
            ghost.connection = snapped.connection;
            if (ghost.floor && snapped.connection)
              ghost.floor = ghost.floor.map(
                /* @function buildingEditor.snappedFloor — Inputs: coarse floor-outline vertex. Returns translated XY matching snapped shell geometry; actual support remains physical primitives. */ function (
                  point,
                ) {
                  return [
                    point[0] + snapped.connection.dx,
                    point[1] + snapped.connection.dy,
                  ];
                },
              );
          }
          element("buildingConfirm").disabled = false;
          status(
            ghost.connection
              ? "Snapped to " +
                  ghost.connection.target +
                  " · " +
                  ghost.connection.destination +
                  ". Confirm to place."
              : "Preview only. Confirm to place or cancel.",
          );
        } catch (error) {
          ghost = null;
          element("buildingConfirm").disabled = true;
          status(error.message);
        }
      };
    element("buildingConfirm").onclick =
      /* @function buildingEditor.confirm — Inputs: click (unused). Returns: nothing. Commits all preview pieces as one validated undo operation; a shell replaces only the floor outline and appends its pieces. Failed transactions retain the preview for correction. */ function () {
        if (!ghost) return;
        const pending = structuredClone(ghost);
        const accepted = api.mutate(
          /* @function buildingEditor.commitPieces — Inputs: none. Returns: nothing. Appends generated geometry to the current interior inside the owning validation/history transaction. Throws capacity errors before mutation. */ function () {
            // October 14: outdoor maps adopt geometry within the transaction,
            // retaining terrain and sky. Undo removes a newly added container.
            const room = api.world().interior || (api.world().interior = root.FrontierInterior.structureDraft(api.world()));
            if (
              !room ||
              room.primitives.length + pending.primitives.length > 256
            )
              throw Error("Room capacity is 256 primitives.");
            room.primitives.push(...pending.primitives);
            if (pending.floor && !room.outdoor) room.floor = pending.floor;
          },
        );
        if (accepted === false) {
          ghost = pending;
          element("buildingConfirm").disabled = false;
          status(
            "Placement rejected. Check dimensions and map bounds, then preview again.",
          );
          return;
        }
        ghost = null;
        element("buildingConfirm").disabled = true;
        status("Placement committed. Undo restores the previous room.");
      };
    element("buildingCancel").onclick =
      /* @function buildingEditor.cancel — Inputs: click (unused). Returns: nothing. Clears only uncommitted preview and releases its records. Authored geometry is unchanged. */ function () {
        placing169=false;ghost = null;
        element("buildingConfirm").disabled = true;
        if(element("sceneTool").value==="building")element("sceneTool").value="select";
        status("Placement cancelled.");
      };
    element("buildingDuplicate").onclick =
      /* @function buildingEditor.duplicate — Inputs: click (unused). Returns: nothing. Creates shifted detached ghost copies of the selected piece or assembly for explicit confirmation, leaving the source unchanged. */ function () {
        const e = selection();
        if (!e) {
          status("Click a room surface first.");
          return;
        }
        ghost = {
          primitives: assembly.duplicate(
            api.world().interior.primitives,
            e.id,
            "building-copy-" + Date.now() + "-" + ++serial,
            element("buildingWholeAssembly").checked,
          ),
        };
        element("buildingConfirm").disabled = false;
        status("Duplicate preview. Confirm to place or cancel.");
      };
    element("buildingRotate").onclick =
      /* @function buildingEditor.rotate — Inputs: click (unused). Returns: nothing. Rotates the selected piece or explicit stair assembly around its XY bounds center in one history transaction. Imported arbitrary rotation is handled by model controls. */ function () {
        if (!selection()) {
          status("Select a room surface first.");
          return;
        }
        api.mutate(
          /* @function buildingEditor.commitRotation — Inputs: none. Returns: nothing. Reacquires selected piece after history changes and changes actual face/collision orientation; validation enforces map bounds. */ function () {
            assembly.rotate(
              api.world().interior.primitives,
              selected,
              Math.PI / 2,
              element("buildingWholeAssembly").checked,
            );
          },
        );
      };
    /* @function buildingEditor.pointer — Inputs: DOM pointer event. Returns: coordinates in the renderer's logical 640/480 or configured aspect space. Handles CSS resizing and high-resolution backing buffers without changing projection. */
    function pointer(event) {
      const game = api.game(),
        rect = element("view").getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) * game.viewWidth) / rect.width,
        y:
          ((event.clientY - rect.top) * (game.viewHeight || 480)) / rect.height,
      };
    }
    element("view").addEventListener(
      "pointerdown",
      /* @function buildingEditor.pickSurface — Inputs: pointer event. Returns: nothing. While authoring, selects nearest actual room face or begins constrained axis drag; captures handled events before legacy ground-placement tools. Empty space retains existing tool behavior. */ function (
        event,
      ) {
        // October 29: direct placement commits through the existing preview/confirm owners.
        if(api.editing()&&placing169&&element("sceneTool").value==="building"&&event.button===0&&!document.querySelector("dialog[open]")){
          const p=pointer(event),point=root.FrontierRender.groundPoint(api.game(),p.x,p.y);
          if(!point){status("Point at editable ground or a floor to place this piece.");return;}
          element("building-x").value=point.x;element("building-y").value=point.y;element("building-z").value=point.z??root.FrontierTerrain.height(api.world(),point.x,point.y);
          element("buildingPreview").onclick(event);if(ghost)element("buildingConfirm").click();event.preventDefault();event.stopImmediatePropagation();return;
        }
        // October 13: explicit placed-model editing owns scene clicks, preventing
        // this earlier capture listener from selecting a room wall behind a prop.
        if (
          !api.editing() ||
          element("propEditPlaced")?.checked ||
          api.game().authorPlacementActive ||
          event.button !== 0 ||
          element("sceneTool").value !== "select" ||
          document.querySelector("dialog[open]")
        )
          return;
        const p = pointer(event);
        for (const h of handles)
          if (Math.hypot(p.x - h.end.x, p.y - h.end.y) < 13) {
            try {
              const parts = structuredClone(selectedParts()),
                mode = element("buildingManipulation").value,
                box =
                  mode === "resize"
                    ? assembly.localBounds(parts, selection().yaw || 0)
                    : assembly.bounds(parts),
                snap =
                  mode === "rotate"
                    ? Number(element("buildingAngleSnap").value)
                    : Number(element("roomSnap").value);
              if (
                !Number.isFinite(snap) ||
                snap < 0 ||
                snap > (mode === "rotate" ? 90 : 100)
              )
                throw Error(
                  mode === "rotate"
                    ? "Rotation snap must be 0–90 degrees."
                    : "Movement/resize snap must be 0–100 metres.",
                );
              drag = {
                gridStep: mode === "rotate" ? snap / 30 : snap,
                axis: h.axis,
                mode,
                units: h.units,
                whole: element("buildingWholeAssembly").checked,
                start: p,
                original: structuredClone(selection()),
                parts,
                previews: structuredClone(parts),
                span: { x: box.w, y: box.d, z: box.h },
                vector: h.vector,
                amount: 0,
              };
              element("buildingAxis").value = h.axis;
            } catch (error) {
              status(error.message);
              event.preventDefault();
              event.stopImmediatePropagation();
              return;
            }
            element("view").setPointerCapture(event.pointerId);
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
          }
        const ray = root.FrontierModelTargeting.ray(api.game(), p.x, p.y);
        const hit = root.FrontierModelTargeting.roomGeometry(
          api.game(),
          ray.origin,
          ray.direction,
        );
        if (!hit) return;
        selected = hit.faceId;
        element("roomSelection").value = selected;
        element("roomSelection").dispatchEvent(new Event("change"));
        status(
          "Selected " +
            selection()?.name +
            ". Drag an axis handle or edit numeric fields.",
        );
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      true,
    );
    element("view").addEventListener(
      "pointermove",
      /* @function buildingEditor.dragAxis — Inputs: pointer event. Returns: nothing. Projects cursor displacement onto the captured world/local axis, storing only detached validated preview geometry. Grid quantization is optional and uses roomSnap metres. Does not allocate history per pointer movement. */ function (
        event,
      ) {
        if (!drag) return;
        const p = pointer(event),
          v = drag.vector,
          length = v.x * v.x + v.y * v.y;
        const raw =
          length > 1e-6
            ? ((p.x - drag.start.x) * v.x + (p.y - drag.start.y) * v.y) / length
            : 0;
        const grid = drag.gridStep,
          amount = grid > 0 ? Math.round(raw / grid) * grid : raw;
        try {
          const pending = { ...drag, amount },
            previews = structuredClone(drag.parts);
          applyHandle(previews, pending);
          drag.amount = amount;
          drag.previews = previews;
        } catch (error) {
          status(error.message);
        }
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      true,
    );
    element("view").addEventListener(
      "pointerup",
      /* @function buildingEditor.finishDrag — Inputs: pointer event. Returns: nothing. Commits one move/turn/resize transform through validated history after releasing the transient drag. Captured tool/group choices determine geometry changes; texture mapping is independent. */ function (
        event,
      ) {
        if (!drag) return;
        const pending = drag;
        drag = null;
        api.mutate(
          /* @function buildingEditor.commitAxis — Inputs: none. Returns: nothing. Applies the captured transform to selected live assembly parts inside history; invalid bounds roll back through the app adapter. */ function () {
            if (selection())
              applyHandle(
                api.world().interior.primitives,
                pending,
              ); /* Superseded movement-only callback; applyHandle now owns all three modes. */
            /* @function buildingEditor.dragDelta — Inputs: world-axis unit component. Returns captured drag distance in metres; group/space remain owned by pointer-down. */
          },
        );
        event.preventDefault();
        event.stopImmediatePropagation();
      },
      true,
    );
    element("view").addEventListener(
      "pointercancel",
      /* @function buildingEditor.cancelDrag — Inputs: pointer cancel event. Returns: nothing. Discards uncommitted drag; does not modify the room or history. */ function () {
        drag = null;
      },
      true,
    );
    /* @function buildingEditor.refresh — Inputs: none. Returns: nothing. Drops map-dependent transient state after any validated scene replacement. Keeps selection only if its ID survives. */
    function refresh() {
      const map = api.active?.();
      if (map !== activeMap) {
        activeMap = map;
        element("building-x").value = api.world().spawn.x;
        element("building-y").value = api.world().spawn.y;
      }
      if (!selection()) selected = "";
      ghost = null;
      drag = null;
      element("buildingConfirm").disabled = true;
    }
    /* @function buildingEditor.drawBox — Inputs: 2D overlay context, primitive, renderer camera and stroke color. Returns: nothing. Projects twelve box edges for selection/ghost evidence; skips edges behind the near plane. Pure drawing, no world mutation. */
    function drawBox(ctx, e, camera, color) {
      // Round previews use the same polygon edges as drawing/collision, including
      // hollow inner walls. Bounding-box connector snapping is intentionally not
      // applied to arcs: those connectors would promise an incorrect curved join.
      if (e.shape === "round") {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const polygon of root.FrontierRoundGeometry.primitiveFaces(e))
          for (let i = 0; i < polygon.length; i++) {
            const a = root.FrontierRender.project(camera, ...polygon[i]),
              b = root.FrontierRender.project(
                camera,
                ...polygon[(i + 1) % polygon.length],
              );
            if (a && b) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
            }
          }
        ctx.stroke();
        return;
      }
      const points = [];
      for (const z of [e.z, e.z + e.h])
        for (const y of [e.y - e.d / 2, e.y + e.d / 2])
          for (const x of [e.x - e.w / 2, e.x + e.w / 2]) {
            const c = Math.cos(e.yaw || 0),
              s = Math.sin(e.yaw || 0),
              dx = x - e.x,
              dy = y - e.y;
            points.push(
              root.FrontierRender.project(
                camera,
                e.x + c * dx - s * dy,
                e.y + s * dx + c * dy,
                z,
              ),
            );
          }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 8; i++)
        for (const bit of [1, 2, 4])
          if (!(i & bit)) {
            const a = points[i],
              b = points[i | bit];
            if (a && b) {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
            }
          }
      ctx.stroke();
    }
    /* @function buildingEditor.draw — Inputs: none. Returns: nothing. Draws only authoring selection/ghost outlines and constrained axis handles after the world. Uses logical projection, so resolution/filter settings leave the interaction coordinates consistent. Clears overlay during playtest. */
    function draw() {
      const game = api.game();
      if (
        overlay.width !== game.viewWidth ||
        overlay.height !== (game.viewHeight || 480)
      ) {
        overlay.width = game.viewWidth;
        overlay.height = game.viewHeight || 480;
      }
      const ctx = overlay.getContext("2d");
      ctx.clearRect(0, 0, overlay.width, overlay.height);
      handles = [];
      if (!api.editing() || element("propEditPlaced")?.checked) return;
      if(element("sceneTool").value==="brush"&&game.pointer){if(api.world().interior&&!api.world().interior.outdoor)return;const centre=root.FrontierRender.groundPoint(game,game.pointer.x,game.pointer.y);if(centre){const radius=Math.max(1,Math.min(12,Number(element("brushRadius").value)||3)),cam=root.FrontierRender.camera(game);ctx.beginPath();for(let i=0;i<=32;i++){const angle=i*Math.PI/16,x=centre.x+Math.cos(angle)*radius,y=centre.y+Math.sin(angle)*radius,z=root.FrontierTerrain.height(api.world(),x,y)+.025,p=root.FrontierRender.project(cam,x,y,z);if(p){if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}}ctx.strokeStyle="#9df6b0";ctx.lineWidth=2;ctx.stroke();}return;}
      const camera = root.FrontierRender.camera(game),
        e = selection();
      if (ghost)
        for (const piece of ghost.primitives)
          drawBox(ctx, piece, camera, "#72e6a2");
      if (!e) return;
      const previews = drag
        ? drag.previews
        : selectedParts(); /* October 13: validated previews cover all modes. The following original source explanations are superseded, retained for history. */
      /* @function buildingEditor.previewDelta — Inputs: captured axis component. Returns draw-only movement; authored positions are unchanged until pointer-up. */
      /* @function buildingEditor.previewMember — Inputs: selected part. Returns translated draw-only clone with unchanged dimensions/materials. */
      for (const display of previews) drawBox(ctx, display, camera, "#ffdc72");
      const box = assembly.bounds(previews),
        center = [box.x, box.y, box.z + box.h / 2],
        start = root.FrontierRender.project(camera, ...center);
      if (!start) return;
      for (let i = 0; i < 3; i++) {
        const mode = drag?.mode || element("buildingManipulation").value;
        if (mode === "rotate" && i !== 2) continue;
        const units = assembly.axis(
            e,
            "xyz"[i],
            mode === "resize" || element("buildingSpace").value === "local",
          ),
          endPoint = center.map(
            /* @function buildingEditor.handleEndpoint — Inputs: pivot component and axis index. Returns a point one metre along the world/local handle direction. */ function (
              value,
              index,
            ) {
              return value + units[index];
            },
          );
        const end = root.FrontierRender.project(camera, ...endPoint);
        if (!end) continue;
        const vector = { x: end.x - start.x, y: end.y - start.y };
        if (Math.hypot(vector.x, vector.y) < 3) continue;
        ctx.globalAlpha = element("buildingAxis").value === "xyz"[i] ? 1 : 0.55;
        ctx.strokeStyle = ctx.fillStyle = ["#ff8080", "#80ff90", "#80bfff"][i];
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.fillRect(end.x - 5, end.y - 5, 10, 10);
        ctx.font = "14px monospace";
        ctx.fillText(mode === "rotate" ? "Turn" : "XYZ"[i], end.x + 8, end.y);
        ctx.globalAlpha = 1;
        handles.push({ axis: "xyz"[i], end, vector, units });
      }
    }
    /* @function buildingEditor.previewLayout — Inputs: generated layout record or null. Returns: nothing. Shares the existing ghost overlay with the layout draft; only the layout controller may commit these pieces. Does not alter world or history. */
    function previewLayout(value) {
      ghost = value ? structuredClone(value) : null;
      element("buildingConfirm").disabled = true;
    }
    document.addEventListener("keydown",/* @function buildingEditor.escape169 - Inputs: keyboard event. Cancels only transient scene placement on Escape, preserving committed pieces/history. No gameplay handling is intercepted. */function(event){if(event.key==="Escape"&&placing169)element("buildingCancel").click();});
    return { refresh, draw, previewLayout };
  }
  root.FrontierBuildingEditor = { create };
})(window);
