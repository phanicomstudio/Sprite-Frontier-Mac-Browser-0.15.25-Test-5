/* October 15, 2026: campaign shell — the left pane of the authoring workspace.
 *
 * Layout (Aurora toolset / Metropolis Frontier Module Editor style):
 *   left   Campaign tree: Campaign → Areas → Maps, plus "In this map" (the
 *          existing scene list of placed objects, moved here unchanged)
 *   centre the game view, unchanged
 *   right  Inspector and palette (#workspaceAssets: properties, build tools)
 *
 * This file is presentation and routing only. Campaign data rules live in
 * src/campaign.js; persistence, map switching, map creation, duplication and
 * deletion stay with the map library and its existing buttons, so their
 * validation, guards and Undo behave exactly as before. Opening a map uses the
 * Active map picker's own change handler.
 *
 * Campaign tree edits (areas, map order, names) have their own bounded
 * Undo/Redo here (50 steps); world edits keep the toolbar Undo, and map
 * create/duplicate/delete keep "Undo map operation".
 *
 * Runtime-only exports never load this file (see runtime-export.js).
 */
(/* @function campaignShell.install — Inputs: none; uses the initialized document and window.FrontierMapLibrary published by app.js. Returns nothing. Builds the campaign pane once. Runtime-only builds, or a missing library/viewport, leave the existing layout untouched. */ function () {
  "use strict";
  const library = window.FrontierMapLibrary;
  const C = window.FrontierCampaign;
  const viewport = document.getElementById("viewport");
  if (window.FRONTIER_RUNTIME_ONLY || !library?.campaignView || !C || !viewport) return;

  const HISTORY_LIMIT = 50;
  const undoStack = [],
    redoStack = [];
  let filterText = "",
    renderQueued = false,
    openMenu = null,
    dragMapId = null;

  /* @function campaignShell.el — Inputs: tag name, optional property record (className, textContent, id, type, title and aria-/data- attributes) and optional child nodes. Returns the new element. Text is always assigned as textContent, never parsed as HTML, so author names cannot inject markup. */
  function el(tag, props, children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props || {})) {
      if (value === undefined || value === null) continue;
      if (key.startsWith("aria-") || key.startsWith("data-")) node.setAttribute(key, value);
      else node[key] = value;
    }
    for (const child of children || []) if (child) node.append(child);
    return node;
  }

  // ---- Pane skeleton -------------------------------------------------------
  const pane = el("section", { id: "campaignPane", "aria-label": "Campaign" });
  const titleButton = el("button", { type: "button", id: "campaignTitle", title: "Rename campaign" });
  const status = el("p", { id: "campaignStatus", role: "status" });
  const addAreaButton = el("button", { type: "button", id: "campaignAddArea", textContent: "+ Area", title: "Add an area" });
  const addMapButton = el("button", { type: "button", id: "campaignAddMap", textContent: "+ Map", title: "Create a map in the current area" });
  const undoButton = el("button", { type: "button", id: "campaignUndo", textContent: "Undo", title: "Undo campaign tree change", disabled: true });
  const redoButton = el("button", { type: "button", id: "campaignRedo", textContent: "Redo", title: "Redo campaign tree change", disabled: true });
  const filter = el("input", { type: "search", id: "campaignFilter", placeholder: "Find a map", "aria-label": "Find a map" });
  const tree = el("div", { id: "campaignTree", role: "tree", "aria-label": "Areas and maps" });
  const sceneHeading = el("h2", { id: "campaignSceneHeading", textContent: "In this map" });
  pane.append(
    el("div", { className: "campaignHeader" }, [el("span", { className: "campaignKicker", textContent: "Campaign" }), titleButton]),
    el("div", { className: "campaignActions" }, [addAreaButton, addMapButton, undoButton, redoButton]),
    filter,
    tree,
    status,
    sceneHeading,
  );
  viewport.before(pane);
  // The scene list keeps its own listeners and selection ownership; it is
  // moved, not copied, so every existing behavior and test hook still works.
  const scene = document.getElementById("sceneHierarchy");
  if (scene) pane.append(scene);
  document.body.classList.add("campaignShell");

  // ---- Small helpers -------------------------------------------------------
  /* @function campaignShell.say — Inputs: message text and optional isError flag. Returns nothing; shows the message in the pane's status line, announced to screen readers, as an alert when it is an error. Empty text clears it. */
  function say(text, isError) {
    status.textContent = text || "";
    status.setAttribute("role", isError ? "alert" : "status");
    status.classList.toggle("campaignError", !!isError);
  }

  /* @function campaignShell.attempt — Inputs: function performing one campaign action. Returns the function's result, or undefined when it throws. Errors become a readable status message instead of an uncaught exception, so a rejected rename or move never breaks the editor. */
  function attempt(action) {
    try {
      return action();
    } catch (error) {
      say(error.message, true);
      return undefined;
    }
  }

  /* @function campaignShell.storageKey — Inputs: none. Returns the localStorage key for remembering which areas are expanded in this campaign. Keyed by campaign title, because projects have no other stable identity in the browser. */
  function storageKey() {
    return "sprite-frontier.campaign-tree.1600:" + library.campaignView().title;
  }

  /* @function campaignShell.loadClosedAreas — Inputs: none. Returns a Set of area IDs the author last left collapsed. Storage can be unavailable (private windows, blocked site data) or malformed; both yield an empty set so every area starts expanded. */
  function loadClosedAreas() {
    try {
      const raw = JSON.parse(localStorage.getItem(storageKey()) || "[]");
      return new Set(Array.isArray(raw) ? raw : []);
    } catch {
      return new Set();
    }
  }

  /* @function campaignShell.saveClosedAreas — Inputs: Set of collapsed area IDs. Returns nothing; stores them as a per-viewer convenience. Storage failures are ignored because tree expansion is not authored data. */
  function saveClosedAreas(closed) {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(Array.from(closed)));
    } catch {
      /* Expansion state is optional; nothing to recover. */
    }
  }

  // ---- Campaign edits with Undo -------------------------------------------
  /* @function campaignShell.commit — Inputs: candidate campaign from a FrontierCampaign operation and a short past-tense description for the status line. Returns true when adopted. Pushes the previous campaign onto Undo (bounded to 50), clears Redo, and hands the candidate to the map library, which validates and saves it. A rejected candidate leaves history and data unchanged and reports why. */
  function commit(candidate, message) {
    const previous = library.campaignView().campaign;
    const ok = attempt(
      /* @function campaignShell.commitApply — Inputs: none. Returns true after the library adopts the candidate; throws its validation error otherwise. */ function () {
        library.updateCampaign(candidate);
        return true;
      },
    );
    if (!ok) return false;
    undoStack.push(previous);
    if (undoStack.length > HISTORY_LIMIT) undoStack.shift();
    redoStack.length = 0;
    say(message);
    queueRender();
    return true;
  }

  /* @function campaignShell.travel — Inputs: source and destination history stacks and a label ("Undid"/"Redid"). Returns nothing. Moves one campaign between stacks and adopts it. Because maps may have been created or deleted since that step was recorded, the stored campaign is reconciled against current maps first: deleted maps drop out and new maps stay in their current area. */
  function travel(from, to, label) {
    const target = from.pop();
    if (!target) return;
    const view = library.campaignView();
    const adjusted = C.reconcile(target, view.maps);
    for (const map of view.maps)
      if (!C.areaOf(target, map.id)) {
        const current = C.areaOf(view.campaign, map.id);
        if (current && adjusted.areas.some(
          /* @function campaignShell.areaStillThere — Inputs: area. Returns true when it matches the map's current area ID; read-only. */ function (a) { return a.id === current.id; }))
          Object.assign(adjusted, C.moveMap(adjusted, map.id, current.id));
      }
    const ok = attempt(
      /* @function campaignShell.travelApply — Inputs: none. Returns true after adoption; throws the library's readable error otherwise. */ function () {
        library.updateCampaign(adjusted);
        return true;
      },
    );
    if (!ok) {
      from.push(target);
      return;
    }
    to.push(view.campaign);
    say(label + " campaign change.");
    queueRender();
  }

  undoButton.onclick = /* @function campaignShell.undo — Inputs: click ignored. Returns nothing; restores the previous campaign tree layout. World edits and map operations have their own Undo. */ function () {
    travel(undoStack, redoStack, "Undid");
  };
  redoButton.onclick = /* @function campaignShell.redo — Inputs: click ignored. Returns nothing; reapplies the campaign layout most recently undone. */ function () {
    travel(redoStack, undoStack, "Redid");
  };

  // ---- Map actions routed to the existing library controls ----------------
  /* @function campaignShell.openMap — Inputs: stable map ID. Returns nothing. Switches the edited map through the Active map picker's own change handler, so travel guards, selection resets and saving behave exactly as when the picker is used. No-op when that map is already open. */
  function openMap(id) {
    const picker = document.getElementById("activeMap");
    if (!picker || picker.value === id) return;
    picker.value = id;
    picker.dispatchEvent(new Event("change"));
    say("");
  }

  /* @function campaignShell.newMapIn — Inputs: area ID. Returns nothing. Tells the library to place the next new map in that area, then opens the existing New map dialog; the map appears in the tree once that dialog creates it. Cancelling the dialog creates nothing. */
  function newMapIn(areaId) {
    library.preferArea(areaId);
    document.getElementById("newMapToolbar")?.click();
  }

  /* @function campaignShell.runOnMap — Inputs: map ID and the ID of an existing map-library button that acts on the open map (duplicateMap, deleteMap). Returns nothing. Opens the map first if needed, then clicks the original button so its link checks, messages and one-step map Undo apply unchanged. */
  function runOnMap(id, buttonId) {
    openMap(id);
    const button = document.getElementById(buttonId);
    if (!button) {
      say("That action is not available in this view.", true);
      return;
    }
    button.click();
    const note = document.getElementById("mapOperationStatus")?.textContent;
    if (note) say(note, /No maps were changed/.test(note));
  }

  // ---- Inline rename -------------------------------------------------------
  /* @function campaignShell.inlineRename — Inputs: element to replace while editing, current text, and a save callback receiving the new text. Returns nothing. Shows a text field in place: Enter or leaving the field saves, Escape cancels. Unchanged text saves nothing. The callback's errors are reported by attempt(). */
  function inlineRename(target, current, save) {
    const input = el("input", { type: "text", value: current, maxLength: 80, className: "campaignRename", "aria-label": "New name" });
    let done = false;
    /* @function campaignShell.finishRename — Inputs: whether to keep the typed text. Returns nothing; restores the label and, when keeping changed text, calls the save callback. Guarded so blur after Enter does not save twice. */
    function finish(keep) {
      if (done) return;
      done = true;
      input.replaceWith(target);
      const value = input.value.trim();
      if (keep && value && value !== current) attempt(
        /* @function campaignShell.renameApply — Inputs: none. Returns the save callback result; errors surface as status. */ function () { return save(value); });
      else queueRender();
    }
    input.onkeydown = /* @function campaignShell.renameKeys — Inputs: keyboard event. Returns nothing; Enter saves, Escape cancels; other keys type normally and do not reach game controls. */ function (event) {
      event.stopPropagation();
      if (event.key === "Enter") finish(true);
      else if (event.key === "Escape") finish(false);
    };
    input.onblur = /* @function campaignShell.renameBlur — Inputs: blur event ignored. Returns nothing; leaving the field keeps the typed name. */ function () {
      finish(true);
    };
    target.replaceWith(input);
    input.focus();
    input.select();
  }

  // ---- Popup menus ---------------------------------------------------------
  /* @function campaignShell.closeMenu — Inputs: none. Returns nothing; removes the open action menu, if any, and returns focus to the button that opened it. */
  function closeMenu() {
    if (!openMenu) return;
    const { menu, opener } = openMenu;
    openMenu = null;
    menu.remove();
    opener.setAttribute("aria-expanded", "false");
    opener.focus();
  }

  /* @function campaignShell.showMenu — Inputs: the "⋯" button that was pressed and a list of [label, action, options] entries; options may set disabled or danger. Returns nothing. Opens a small menu beside the button. Arrow keys move between items, Escape or clicking elsewhere closes it, and choosing an item closes it before running the action. */
  function showMenu(opener, items) {
    closeMenu();
    const menu = el("div", { className: "campaignMenu", role: "menu" });
    for (const [label, action, options] of items) {
      const item = el("button", { type: "button", role: "menuitem", textContent: label, disabled: !!options?.disabled });
      if (options?.danger) item.classList.add("campaignDanger");
      item.onclick = /* @function campaignShell.menuChoose — Inputs: click ignored. Returns nothing; closes the menu, then runs this entry's action. */ function () {
        closeMenu();
        action();
      };
      menu.append(item);
    }
    menu.onkeydown = /* @function campaignShell.menuKeys — Inputs: keyboard event. Returns nothing; ArrowUp/ArrowDown move focus through enabled items, Escape closes. Keys never reach game controls while the menu is open. */ function (event) {
      event.stopPropagation();
      const enabled = Array.from(menu.querySelectorAll("button:not(:disabled)"));
      const index = enabled.indexOf(document.activeElement);
      if (event.key === "Escape") closeMenu();
      else if (event.key === "ArrowDown") enabled[(index + 1) % enabled.length]?.focus();
      else if (event.key === "ArrowUp") enabled[(index - 1 + enabled.length) % enabled.length]?.focus();
      else return;
      event.preventDefault();
    };
    pane.append(menu);
    const box = opener.getBoundingClientRect(),
      host = pane.getBoundingClientRect();
    menu.style.top = box.bottom - host.top + pane.scrollTop + 2 + "px";
    menu.style.left = Math.max(4, Math.min(box.right - host.left - menu.offsetWidth, host.width - menu.offsetWidth - 4)) + "px";
    opener.setAttribute("aria-expanded", "true");
    openMenu = { menu, opener };
    menu.querySelector("button:not(:disabled)")?.focus();
  }

  document.addEventListener("pointerdown", /* @function campaignShell.outsideClick — Inputs: pointer event. Returns nothing; closes the open menu when the press lands outside it. */ function (event) {
    if (openMenu && !openMenu.menu.contains(event.target) && event.target !== openMenu.opener) closeMenu();
  });

  // ---- Delete-area dialog --------------------------------------------------
  /* @function campaignShell.confirmDeleteArea — Inputs: area record to delete and the full campaign. Returns nothing. Opens a dialog that asks which area receives this area's maps. Deleting an area never deletes maps. Cancel changes nothing. */
  function confirmDeleteArea(area, campaign) {
    const others = campaign.areas.filter(
      /* @function campaignShell.otherArea — Inputs: area. Returns true for every area except the one being deleted. */ function (a) { return a.id !== area.id; });
    const select = el("select", { id: "campaignMoveTarget" });
    for (const other of others) select.append(new Option(other.name, other.id));
    const dialog = el("dialog", { id: "campaignDeleteArea", className: "campaignDialog" }, [
      el("h2", { textContent: "Delete area “" + area.name + "”" }),
      el("p", { textContent: area.maps.length
        ? "Its " + area.maps.length + (area.maps.length === 1 ? " map moves" : " maps move") + " to the area you choose. No maps are deleted."
        : "This area is empty." }),
      area.maps.length ? el("label", { textContent: "Move maps to" }, [select]) : null,
      el("div", { className: "campaignDialogButtons" }, [
        el("button", { type: "button", value: "cancel", textContent: "Cancel" }),
        el("button", { type: "button", value: "delete", textContent: "Delete area", className: "campaignDanger" }),
      ]),
    ]);
    dialog.onclick = /* @function campaignShell.deleteAreaChoice — Inputs: click event inside the dialog. Returns nothing; Delete area moves the maps and removes the area through commit() (so it can be undone), Cancel just closes. */ function (event) {
      const choice = event.target.value;
      if (choice !== "cancel" && choice !== "delete") return;
      dialog.close();
      dialog.remove();
      if (choice === "delete")
        attempt(
          /* @function campaignShell.deleteAreaApply — Inputs: none. Returns commit result; errors surface as status. */ function () {
            return commit(C.removeArea(library.campaignView().campaign, area.id, select.value || others[0].id), "Deleted area " + area.name + ".");
          },
        );
    };
    dialog.onkeydown = /* @function campaignShell.dialogKeys — Inputs: keyboard event. Returns nothing; keeps typing inside the dialog from reaching game controls. Escape is handled natively by the dialog. */ function (event) {
      event.stopPropagation();
    };
    dialog.addEventListener("close", /* @function campaignShell.deleteAreaClosed — Inputs: close event ignored. Returns nothing; removes a dialog dismissed with Escape. */ function () {
      dialog.remove();
    });
    document.body.append(dialog);
    dialog.showModal();
  }

  // ---- Drag and drop -------------------------------------------------------
  /* @function campaignShell.dropTarget — Inputs: element under the pointer during a drag. Returns { areaId, index } describing where a dropped map would go: before the hovered map row, or at the end of the hovered area. Returns null outside the tree. */
  function dropTarget(node) {
    const row = node.closest?.("[data-map-id]");
    const area = node.closest?.("[data-area-id]");
    if (!area) return null;
    const areaId = area.dataset.areaId;
    if (row) {
      const rows = Array.from(area.querySelectorAll("[data-map-id]"));
      return { areaId, index: rows.indexOf(row), row };
    }
    return { areaId, index: Infinity, row: null };
  }

  tree.addEventListener("dragover", /* @function campaignShell.dragOver — Inputs: dragover event. Returns nothing; allows dropping a dragged map on an area or map row and shows where it will land. Ignores drags that did not start on a map row. */ function (event) {
    if (!dragMapId) return;
    const target = dropTarget(event.target);
    for (const marked of tree.querySelectorAll(".campaignDropBefore, .campaignDropInto")) marked.classList.remove("campaignDropBefore", "campaignDropInto");
    if (!target) return;
    event.preventDefault();
    if (target.row) target.row.classList.add("campaignDropBefore");
    else tree.querySelector('[data-area-id="' + CSS.escape(target.areaId) + '"]')?.classList.add("campaignDropInto");
  });
  tree.addEventListener("drop", /* @function campaignShell.drop — Inputs: drop event. Returns nothing; moves the dragged map to the indicated area/position through commit(), so the move can be undone. Dropping a map onto itself changes nothing. */ function (event) {
    if (!dragMapId) return;
    event.preventDefault();
    const target = dropTarget(event.target);
    const id = dragMapId;
    dragMapId = null;
    if (!target) return queueRender();
    const campaign = library.campaignView().campaign;
    const source = C.areaOf(campaign, id);
    let index = target.index === Infinity ? undefined : target.index;
    // Removing the map first shifts later rows in the same area up by one.
    if (source?.id === target.areaId && index !== undefined && source.maps.indexOf(id) < index) index -= 1;
    if (source?.id === target.areaId && source.maps.indexOf(id) === index) return queueRender();
    const destination = campaign.areas.find(
      /* @function campaignShell.dropArea — Inputs: area. Returns true for the drop target; read-only. */ function (a) { return a.id === target.areaId; });
    commit(C.moveMap(campaign, id, target.areaId, index), "Moved map to " + (destination?.name || "area") + ".");
  });
  tree.addEventListener("dragend", /* @function campaignShell.dragEnd — Inputs: dragend event ignored. Returns nothing; clears drag state and drop markers when a drag is cancelled. */ function () {
    dragMapId = null;
    queueRender();
  });

  // ---- Rendering -----------------------------------------------------------
  /* @function campaignShell.mapRow — Inputs: map summary {id,name,folder}, its area, the full view and the area list. Returns one tree row: the map name (click opens it, drag moves it) and a "⋯" menu with Open, Rename, Move to area, Duplicate and Delete. A folder name different from the area is shown as a small sub-label so older folder organisation stays visible. */
  function mapRow(map, area, view) {
    const active = map.id === view.active;
    const open = el("button", {
      type: "button",
      className: "campaignMap" + (active ? " campaignActive" : ""),
      role: "treeitem",
      "aria-current": active ? "page" : null,
      title: active ? "Open now" : "Open " + map.name,
      draggable: true,
    }, [el("span", { className: "campaignMapName", textContent: map.name }),
      map.folder && map.folder !== area.name ? el("span", { className: "campaignFolder", textContent: map.folder }) : null]);
    open.onclick = /* @function campaignShell.mapClick — Inputs: click ignored. Returns nothing; opens this map for editing. */ function () {
      openMap(map.id);
    };
    open.ondblclick = /* @function campaignShell.mapDoubleClick — Inputs: double-click ignored. Returns nothing; starts renaming this map in place. */ function () {
      renameMap();
    };
    open.ondragstart = /* @function campaignShell.mapDragStart — Inputs: dragstart event. Returns nothing; records which map is being moved. The transfer carries plain text so the browser accepts the drag. */ function (event) {
      dragMapId = map.id;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", map.name);
    };
    const nameNode = open.firstChild;
    /* @function campaignShell.renameMap — Inputs: none. Returns nothing; edits this map's name in place. The map ID, and so every door and transfer pointing at it, never changes. */
    function renameMap() {
      inlineRename(nameNode, map.name, /* @function campaignShell.renameMapSave — Inputs: new name. Returns nothing; renames the map through the library and reports success. */ function (name) {
        library.renameMap(map.id, name);
        say("Renamed map to " + name + ".");
      });
    }
    const more = el("button", { type: "button", className: "campaignMore", textContent: "⋯", title: "Map actions", "aria-label": "Actions for " + map.name, "aria-haspopup": "menu", "aria-expanded": "false" });
    more.onclick = /* @function campaignShell.mapMenu — Inputs: click ignored. Returns nothing; opens the map's action menu, including one Move to entry per other area. */ function () {
      const entries = [
        ["Open", /* @function campaignShell.menuOpenMap — Inputs: none. Returns nothing; opens the map. */ function () { openMap(map.id); }, { disabled: active }],
        ["Rename", renameMap],
      ];
      for (const other of view.campaign.areas)
        if (other.id !== area.id)
          entries.push(["Move to " + other.name, /* @function campaignShell.menuMoveMap — Inputs: none. Returns nothing; moves the map to the end of that area, undoably. */ function () {
            commit(C.moveMap(library.campaignView().campaign, map.id, other.id), "Moved " + map.name + " to " + other.name + ".");
          }]);
      entries.push(
        ["Duplicate", /* @function campaignShell.menuDuplicate — Inputs: none. Returns nothing; copies the map with the existing Duplicate current map action (the copy joins this area). */ function () {
          library.preferArea(area.id);
          runOnMap(map.id, "duplicateMap");
        }],
        ["Delete map…", /* @function campaignShell.menuDelete — Inputs: none. Returns nothing; deletes the map with the existing Delete current map action, which refuses the last map or maps other maps link to, and offers Undo map operation. */ function () {
          runOnMap(map.id, "deleteMap");
        }, { danger: true }],
      );
      showMenu(more, entries);
    };
    const row = el("div", { className: "campaignMapRow", "data-map-id": map.id }, [open, more]);
    return row;
  }

  /* @function campaignShell.areaNode — Inputs: area record, index in the campaign, the view, the set of collapsed area IDs and the lowercase filter text. Returns a collapsible area with its maps, or null when a filter hides every map in it. Its "⋯" menu offers New map here, Rename, Move up/down and Delete area. */
  function areaNode(area, index, view, closed, needle) {
    const byId = new Map(view.maps.map(/* @function campaignShell.mapEntry — Inputs: map summary. Returns [id, summary] for lookup. */ function (m) { return [m.id, m]; }));
    const maps = [];
    for (const id of area.maps) {
      const map = byId.get(id);
      if (map && (!needle || map.name.toLowerCase().includes(needle) || area.name.toLowerCase().includes(needle))) maps.push(map);
    }
    if (needle && !maps.length) return null;
    const details = el("details", { className: "campaignArea", "data-area-id": area.id, open: needle ? true : !closed.has(area.id) });
    const name = el("span", { className: "campaignAreaName", textContent: area.name });
    const count = el("span", { className: "campaignCount", textContent: String(area.maps.length) });
    const summary = el("summary", { role: "treeitem", title: area.name }, [name, count]);
    details.ontoggle = /* @function campaignShell.areaToggle — Inputs: toggle event ignored. Returns nothing; remembers which areas are collapsed, except while a search temporarily opens them. */ function () {
      if (filterText) return;
      if (details.open) closed.delete(area.id);
      else closed.add(area.id);
      saveClosedAreas(closed);
    };
    /* @function campaignShell.renameArea — Inputs: none. Returns nothing; edits the area name in place, undoably. The area ID stays the same. */
    function renameArea() {
      inlineRename(name, area.name, /* @function campaignShell.renameAreaSave — Inputs: new name. Returns commit result for the renamed campaign. */ function (value) {
        return commit(C.renameArea(library.campaignView().campaign, area.id, value), "Renamed area to " + value + ".");
      });
    }
    const more = el("button", { type: "button", className: "campaignMore", textContent: "⋯", title: "Area actions", "aria-label": "Actions for " + area.name, "aria-haspopup": "menu", "aria-expanded": "false" });
    more.onclick = /* @function campaignShell.areaMenu — Inputs: click event. Returns nothing; opens the area's action menu without toggling the area open or closed. */ function (event) {
      event.preventDefault();
      event.stopPropagation();
      const last = view.campaign.areas.length - 1;
      showMenu(more, [
        ["New map here…", /* @function campaignShell.menuNewMap — Inputs: none. Returns nothing; creates a map in this area. */ function () { newMapIn(area.id); }],
        ["Rename", renameArea],
        ["Move up", /* @function campaignShell.menuAreaUp — Inputs: none. Returns nothing; moves the area one place up, undoably. */ function () {
          commit(C.moveArea(library.campaignView().campaign, area.id, -1), "Moved " + area.name + " up.");
        }, { disabled: index === 0 }],
        ["Move down", /* @function campaignShell.menuAreaDown — Inputs: none. Returns nothing; moves the area one place down, undoably. */ function () {
          commit(C.moveArea(library.campaignView().campaign, area.id, 1), "Moved " + area.name + " down.");
        }, { disabled: index === last }],
        ["Delete area…", /* @function campaignShell.menuAreaDelete — Inputs: none. Returns nothing; asks where this area's maps should go, then deletes the area. */ function () {
          confirmDeleteArea(area, library.campaignView().campaign);
        }, { disabled: last === 0, danger: true }],
      ]);
    };
    summary.append(more);
    summary.ondblclick = /* @function campaignShell.areaDoubleClick — Inputs: double-click event. Returns nothing; renames the area instead of toggling it. */ function (event) {
      event.preventDefault();
      renameArea();
    };
    details.append(summary);
    const list = el("div", { className: "campaignMaps", role: "group" });
    for (const map of maps) list.append(mapRow(map, area, view));
    if (!area.maps.length) list.append(el("p", { className: "campaignEmpty", textContent: "No maps yet. Drag a map here or use ⋯ → New map here." }));
    details.append(list);
    return details;
  }

  /* @function campaignShell.render — Inputs: none. Returns nothing. Redraws the title, tree and Undo/Redo state from a fresh library view. Skipped while an inline rename is open. Keeps the tree's scroll position, and refocuses the open map's row when focus was inside the tree, so redraws do not throw the author's place away. */
  function render() {
    renderQueued = false;
    // A redraw would discard an open inline rename (and the author's typing).
    // The rename schedules its own redraw when it finishes.
    if (pane.querySelector(".campaignRename")) return;
    const view = library.campaignView();
    const scroll = tree.scrollTop;
    const hadFocus = tree.contains(document.activeElement);
    titleButton.textContent = view.title;
    undoButton.disabled = !undoStack.length;
    redoButton.disabled = !redoStack.length;
    const closed = loadClosedAreas();
    const needle = filterText.trim().toLowerCase();
    const nodes = [];
    view.campaign.areas.forEach(/* @function campaignShell.renderArea — Inputs: area and index. Returns nothing; adds its node unless the filter hides it. */ function (area, index) {
      const node = areaNode(area, index, view, closed, needle);
      if (node) nodes.push(node);
    });
    if (!nodes.length) nodes.push(el("p", { className: "campaignEmpty", textContent: "No maps match “" + filterText.trim() + "”." }));
    tree.replaceChildren(...nodes);
    tree.scrollTop = scroll;
    if (hadFocus) tree.querySelector(".campaignActive")?.focus();
  }

  /* @function campaignShell.queueRender — Inputs: none. Returns nothing; schedules one redraw on the next animation frame, collapsing bursts of library refreshes into a single update. Skipped while an inline rename is open so typing is not interrupted; that rename redraws when it finishes. */
  function queueRender() {
    if (renderQueued || pane.querySelector(".campaignRename")) return;
    renderQueued = true;
    requestAnimationFrame(render);
  }

  // ---- Header controls -----------------------------------------------------
  titleButton.onclick = /* @function campaignShell.renameCampaign — Inputs: click ignored. Returns nothing; edits the campaign title in place. The title is the project title used for saving and exports. */ function () {
    inlineRename(titleButton, library.campaignView().title, /* @function campaignShell.renameCampaignSave — Inputs: new title. Returns nothing; stores it through the library. */ function (value) {
      library.renameCampaign(value);
      say("Renamed campaign to " + value + ".");
    });
  };
  addAreaButton.onclick = /* @function campaignShell.addArea — Inputs: click ignored. Returns nothing; adds "New area" (numbered when taken) after the current map's area, then starts renaming it so the author can type the real name straight away. */ function () {
    const view = library.campaignView();
    const current = C.areaOf(view.campaign, view.active);
    const at = current ? view.campaign.areas.indexOf(view.campaign.areas.find(
      /* @function campaignShell.currentArea — Inputs: area. Returns true for the open map's area. */ function (a) { return a.id === current.id; })) + 1 : undefined;
    const taken = new Set(view.campaign.areas.map(/* @function campaignShell.areaName — Inputs: area. Returns its name for the uniqueness check. */ function (a) { return a.name; }));
    let label = "New area",
      n = 2;
    while (taken.has(label)) label = "New area " + n++;
    const result = attempt(/* @function campaignShell.addAreaBuild — Inputs: none. Returns the new campaign and area ID. */ function () { return C.addArea(view.campaign, label, at); });
    if (!result || !commit(result.campaign, "Added " + label + ".")) return;
    render();
    const node = tree.querySelector('[data-area-id="' + CSS.escape(result.id) + '"] .campaignAreaName');
    if (node) node.closest("summary").dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
  };
  addMapButton.onclick = /* @function campaignShell.addMap — Inputs: click ignored. Returns nothing; creates a map in the open map's area using the existing New map dialog. */ function () {
    const view = library.campaignView();
    newMapIn(C.areaOf(view.campaign, view.active)?.id || view.campaign.areas[0].id);
  };
  filter.oninput = /* @function campaignShell.filterInput — Inputs: input event ignored. Returns nothing; shows only maps (or areas) whose names contain the typed text. */ function () {
    filterText = filter.value;
    queueRender();
  };
  filter.onkeydown = /* @function campaignShell.filterKeys — Inputs: keyboard event. Returns nothing; keeps typing in the search box from moving the camera or player. */ function (event) {
    event.stopPropagation();
  };

  window.addEventListener("frontier-campaign-change", queueRender);
  render();
})();
