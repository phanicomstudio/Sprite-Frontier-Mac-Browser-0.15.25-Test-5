/* October 12, 2026: searchable scene inventory. Existing authoritative selection
 * controls retain ownership of editing/history; this panel only routes selection.
 * Labels are inserted as text, never interpreted as markup. Runtime has no panel. */
(/* @function sceneHierarchy.install — Inputs: none; initialized document. Returns: nothing. Adds grouped scene inventory only to the editor palette. Missing controls or runtime-only mode leave gameplay unchanged. Owns DOM observers; no per-frame world scans. */ function () {
  "use strict";
  const host = document.getElementById("workspaceAssets");
  if (!host || window.FRONTIER_RUNTIME_ONLY) return;
  const panel = document.createElement("section");
  panel.id = "sceneHierarchy";
  const title = document.createElement("h2");
  title.textContent = "Scene";
  const label = document.createElement("label");
  label.textContent = "Find a placed object";
  const search = document.createElement("input");
  search.type = "search";
  search.id = "sceneSearch";
  search.placeholder = "Name or ID";
  label.append(search);
  const list = document.createElement("div");
  list.id = "sceneHierarchyList";
  const status = document.createElement("p");
  status.id = "sceneHierarchyStatus";
  status.setAttribute("role", "status");
  panel.append(title, label, list, status);
  host.prepend(panel);
  // October 14 Test 5: selection stays in the list; editing properties is an
  // explicit action. This supersedes automatic scrolling on a row highlight.
  const selectedKeys = new Set();
  let anchor = null, visible = [];
  const selectionBar = document.createElement("div");
  selectionBar.id = "sceneSelectionActions";
  const hint = document.createElement("p");
  hint.textContent = "Click to highlight. Shift-click selects a range; Ctrl/Cmd-click toggles individual entries.";
  const selectAll = document.createElement("button"), clear = document.createElement("button"), edit = document.createElement("button"), deleteMany = document.createElement("button");
  for (const button of [selectAll, clear, edit, deleteMany]) button.type = "button";
  selectAll.textContent = "Select all shown";
  clear.textContent = "Clear selection";
  edit.textContent = "Edit selected";
  selectionBar.append(selectAll, clear, edit, deleteMany);
  list.before(hint, selectionBar);
  const groups = [
    { id: "roomSelection", name: "Room surfaces and arrivals", tab: "Room" },
    { id: "selection", name: "Props and events", tab: "Place" },
    { id: "localLightSelection", name: "Lights", tab: null },
  ];
  /* Historical Test 3 contract, superseded by Test 5 choosePresentation below. @function sceneHierarchy.choose — Inputs: group descriptor, stable option ID and displayed name. Returns: nothing. Invokes the original selection change handler, opens its properties category/disclosure and focuses that control. Missing/deleted IDs are ignored. Does not directly mutate map data or create a history entry. */
  /* @function sceneHierarchy.choosePresentation — Inputs: group, stable ID, displayed name and reveal flag(default true). Returns nothing; rechecks ID and updates original selection controls. A false reveal fills values without category/focus/scroll changes; explicit Edit selected reveals the inspector. No authored changes. */
  function choose(group, id, name, reveal = true) {
    const control = document.getElementById(group.id);
    if (!control) return;
    let found = false;
    for (const option of control.options)
      if (option.value === id) {
        found = true;
        break;
      }
    if (!found) return;
    const tab =
      group.id === "selection" && name.includes("[event]")
        ? "Events"
        : group.tab;
    if (tab && reveal)
      for (const button of document.querySelectorAll(".editorTabs button"))
        if (button.textContent === tab) {
          button.click();
          break;
        }
    control.value = id;
    control.dispatchEvent(new CustomEvent("change", { bubbles: true, detail: { revealProperties: reveal } }));
    if (!reveal) return;
    if(window.FrontierAuthoringWorkspace) {window.FrontierAuthoringWorkspace.inspect();return;}
    const field = control.closest("fieldset");
    if (field) {
      field.classList.remove("toolTabHidden");
      field.hidden = false;
    }
    const disclosure = control.closest("details.workspaceGroup");
    if (disclosure) {
      disclosure.hidden = false;
      disclosure.open = true;
    }
    // October 14: selection must expose the actual editor fields rather than
    // only coloring a hierarchy row. Existing owner handlers fill these fields.
    const properties = group.id === "selection" ? document.getElementById("properties") : group.id === "roomSelection" ? document.getElementById("roomElementFields") : control;
    properties?.scrollIntoView({ block: "center", behavior: "smooth" });
    control.focus({ preventScroll: true });
    status.textContent = "Selected " + name + ". Properties are open.";
    render();
  }
  /* @function sceneHierarchy.render — Inputs: none. Returns: nothing. Rebuilds grouped inventory from current authoritative select options after edits/import/history or search input. Excludes empty and synthetic player/projectile entries. Search matches names and stable IDs; selection indication follows existing controls. Does not retain stale scene records or alter saved ordering. */
  function render() {
    const oldScroll = list.scrollTop;
    visible = [];
    const valid = new Set();
    for (const group of groups) for (const option of document.getElementById(group.id)?.options || []) valid.add(group.id + ":" + option.value);
    for (const key of selectedKeys) if (!valid.has(key)) selectedKeys.delete(key);
    const query = search.value.trim().toLocaleLowerCase(),
      fragment = document.createDocumentFragment();
    let total = 0,
      shown = 0;
    for (const group of groups) {
      const control = document.getElementById(group.id);
      if (!control) continue;
      const section = document.createElement("details");
      section.open = true;
      const summary = document.createElement("summary");
      summary.textContent = group.name;
      section.append(summary);
      let count = 0;
      for (const option of control.options) {
        if (!option.value || option.value.startsWith("@")) continue;
        total++;
        if (
          query &&
          !(option.textContent + " " + option.value)
            .toLocaleLowerCase()
            .includes(query)
        )
          continue;
        count++;
        shown++;
        const key = group.id + ":" + option.value;
        visible.push({ key, group, id: option.value, name: option.textContent });
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = option.textContent;
        button.title = option.value;
        button.setAttribute(
          "aria-pressed",
          String(selectedKeys.has(key)),
        );
        button.dataset.selectionId = option.value;
        button.onclick =
          /* @function sceneHierarchy.highlightRange — Inputs: click with Shift/Ctrl/Meta modifiers. Returns nothing; highlights a visible range from the last plain-click anchor or toggles a single entry. Plain clicks replace selection and fill the owning controls without moving the dock. Selection is transient and does not create history. */ function (event) {
            if (event.shiftKey && anchor && visible.some(/* @function sceneHierarchy.hasAnchor — Inputs: visible entry. Returns anchor key equality; no effects. */ function(entry){return entry.key === anchor;})) {
              const a = visible.findIndex(/* @function sceneHierarchy.anchorIndex — Inputs: visible entry. Returns anchor key equality; no effects. */ function(entry){return entry.key === anchor;});
              const b = visible.findIndex(/* @function sceneHierarchy.clickedIndex — Inputs: visible entry. Returns clicked key equality; no effects. */ function(entry){return entry.key === key;});
              if (!event.ctrlKey && !event.metaKey) selectedKeys.clear();
              for (let i = Math.min(a,b); i <= Math.max(a,b); i++) selectedKeys.add(visible[i].key);
            } else if (event.ctrlKey || event.metaKey) {
              if (selectedKeys.has(key)) selectedKeys.delete(key); else selectedKeys.add(key);
              anchor = key;
            } else {
              selectedKeys.clear(); selectedKeys.add(key); anchor = key;
            }
            choose(group, option.value, option.textContent, false);
            render();
          };
        const row = document.createElement("div");
        row.className = "sceneObjectRow";
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Delete";
        remove.setAttribute("aria-label", "Delete " + option.textContent);
        /* Historical Test 3 deletion selected/opened properties first. October 14 Test 5 supersedes that scrolling behavior with a single batch transaction. */
        remove.onclick = /* @function sceneHierarchy.deleteOneInPlace — Inputs: ignored click. Returns nothing; deletes only this row via the shared atomic action, preserving dock/list position and focus for repeated deletion. Other highlighted instances are not implicitly deleted by a row button. */ function () {
          deleteTargets([{group: group.id, id: option.value}], visible.findIndex(/* @function sceneHierarchy.deleteIndex — Inputs: visible entry. Returns stable key equality for focus restoration; no effects. */ function(entry){return entry.key === key;}));
        };
        row.append(button, remove);
        section.append(row);
      }
      if (count) fragment.append(section);
    }
    list.replaceChildren(fragment);
    list.scrollTop = oldScroll;
    deleteMany.textContent = "Delete selected (" + selectedKeys.size + ")";
    deleteMany.disabled = selectedKeys.size === 0;
    edit.disabled = selectedKeys.size !== 1;
    clear.disabled = selectedKeys.size === 0;
    status.textContent = shown + " of " + total + " placed entries";
    // October 22: the typed service is the shared selection authority. Compare
    // identities before publishing to avoid observer feedback during refresh.
    if(window.FrontierScene) {
      const refs=[]; for(const ref of window.FrontierScene.list()) if(selectedKeys.has(ref.group+":"+ref.id)) refs.push(ref);
      const current=window.FrontierScene.selection();
      let equal=current.length===refs.length;
      for(const ref of current) if(!selectedKeys.has(ref.group+":"+ref.id)) equal=false;
      if(!equal) window.FrontierScene.select(refs);
    }
  }
  /* @function sceneHierarchy.deleteTargets — Inputs: stable {group,id} target array and nearest visible row index for focus. Returns nothing; calls the application's single Undo transaction and restores both scroll regions after owner refresh/DOM observers. No property-reveal event is dispatched. Missing API or rejected mutations retain selection and report status; browser scroll clamping at list end is expected. */
  function deleteTargets(targets, focusIndex = 0) {
    const dockTop = host.scrollTop, listTop = list.scrollTop;
    if (!window.FrontierSceneActions?.removeMany(targets)) { status.textContent = "Nothing deleted. The selection may have changed; check the editor status."; return; }
    render();
    queueMicrotask(/* @function sceneHierarchy.restoreDeletionPosition — Inputs: none. Returns nothing; runs after owning control observers rebuild rows, restores scroll offsets and focuses the nearest remaining Delete button without scrolling. Search receives focus when no rows remain. No authored edits. */ function () {
      const rows = list.querySelectorAll(".sceneObjectRow");
      const next = rows[Math.min(Math.max(0,focusIndex), rows.length - 1)]?.lastElementChild;
      (next || search).focus({preventScroll:true});
      list.scrollTo({top:listTop, behavior:"instant"});
      host.scrollTo({top:dockTop, behavior:"instant"});
    });
  }
  selectAll.onclick = /* @function sceneHierarchy.selectShown — Inputs: ignored click. Returns nothing; replaces selection with all currently filtered visible entries. No authored changes. */ function () {
    selectedKeys.clear(); for (const entry of visible) selectedKeys.add(entry.key); anchor = visible[0]?.key || null; render();
  };
  clear.onclick = /* @function sceneHierarchy.clearHighlights — Inputs: ignored click. Returns nothing; clears transient highlighted selection and range anchor, retaining authored data and search. */ function () {
    selectedKeys.clear(); anchor = null; render();
  };
  edit.onclick = /* @function sceneHierarchy.editHighlight — Inputs: ignored click. Returns nothing; explicitly reveals properties for exactly one still-valid highlighted target. Other cases are disabled/no-op. */ function () {
    if (selectedKeys.size !== 1) return;
    const key = selectedKeys.values().next().value;
    for (const group of groups) for (const option of document.getElementById(group.id)?.options || [])
      if (group.id + ":" + option.value === key) { choose(group, option.value, option.textContent); return; }
  };
  deleteMany.onclick = /* @function sceneHierarchy.deleteHighlights — Inputs: ignored click. Returns nothing; resolves all selected stable IDs against live options (including selected entries hidden by search) and submits one atomic Undo transaction. Stale entries are ignored. */ function () {
    const targets = [];
    for (const group of groups) for (const option of document.getElementById(group.id)?.options || [])
      if (selectedKeys.has(group.id + ":" + option.value)) targets.push({group:group.id,id:option.value});
    deleteTargets(targets);
  };
  document.getElementById("activeMap")?.addEventListener("change", /* @function sceneHierarchy.mapSelectionReset — Inputs: ignored map-change event. Returns nothing; clears map-local highlights/range anchor so reused IDs on another map are never implicitly deleted. Owner observers refresh the list. */ function () { selectedKeys.clear(); anchor = null; render(); });
  search.oninput =
    /* @function sceneHierarchy.search — Inputs: input event (unused). Returns: nothing. Applies transient inventory filtering without changing world data or history. */ function () {
      render();
    };
  for (const group of groups) {
    const control = document.getElementById(group.id);
    if (!control) continue;
    new MutationObserver(render).observe(control, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    control.addEventListener("change", render);
  }
  window.FrontierScene?.subscribe(/* @function sceneHierarchy.followTypedSelection — Inputs: normalized live selection. Returns nothing; mirrors shared service highlights and redraws without changing authored data. Identity comparison in render prevents circular notifications. */ function(refs){selectedKeys.clear();for(const ref of refs)selectedKeys.add(ref.group+":"+ref.id);render();});
  render();
})();
