/* October 12, 2026: organize existing authoring controls without replacing their
 * handlers or source data. This is the workspace presentation layer; gameplay
 * and editor transactions remain owned by app.js and the existing workbenches.
 * Runtime exports must set FRONTIER_RUNTIME_ONLY before app.js executes. */
(/* @function engineWorkspace.initialize — Inputs: none; reads the initialized document. Returns: nothing. Moves existing controls into collapsible groups without cloning IDs or handlers. Missing required elements leave the old layout intact. */ function () {
  "use strict";
  // October 12, 2026: shared startup has bound gameplay preferences to their
  // existing nodes. Runtime keeps those private references but removes editor
  // chrome from the live document. The gameplay load input must stay attached
  // so browser file selection continues to work from the pause menu.
  if (window.FRONTIER_RUNTIME_ONLY) {
    const load = document.getElementById("loadCombat");
    if (load) {
      load.hidden = true;
      document.getElementById("gameFrame").append(load);
    }
    document.querySelector("body > header")?.remove();
    document.querySelector("main > aside")?.remove();
    document.querySelector("body > footer")?.remove();
    document.body.classList.add("engineRuntime", "enginePlaytest");
    return;
  }
  const editor = document.getElementById("editor");
  const header = document.querySelector("body > header");
  const tools = header?.querySelector(".tools");
  if (!editor || !header || !tools) return;
  const bar = document.createElement("nav");
  bar.id = "workspaceBar";
  bar.setAttribute("aria-label", "Sprite Frontier workspace");
  const title = document.createElement("strong");
  title.textContent = "Sprite Frontier";
  const toggle = document.createElement("button");
  toggle.id = "workspaceToggle";
  /* @function engineWorkspace.toggle — Inputs: click event (unused). Returns: nothing. Invokes the existing editor/playtest action, preserving its reset and undo behavior. Runtime-only builds cannot enter authoring. */
  toggle.onclick =
    /* @function engineWorkspace.clickToggle  -  Inputs: none. Returns: nothing. Delegates to the existing editor mode handler unless runtime-only. */ function () {
      if (!window.FRONTIER_RUNTIME_ONLY)
        document.getElementById("edit").click();
    };
  bar.append(title, toggle);
  // October 14, 2026: review-only usability work; core entry points are visible.
  const actions = document.createElement("span");
  actions.id = "workspaceQuickActions";
  const actionStatus = document.createElement("span");
  actionStatus.setAttribute("role", "status");
  /* @function engineWorkspace.revealTool — Inputs: fieldset ID and matching category. Returns nothing; selects existing category, opens its disclosure ancestors and scrolls the original controls into view. Missing controls report readable status; no authored edits. */
  function revealTool(id, category) {
    for (const node of document.querySelectorAll(".editorTabs button"))
      if (node.textContent === category) node.click();
    const target = document.getElementById(id);
    if (!target) { actionStatus.textContent = "This tool is unavailable in the current view."; return; }
    for (let node = target; node; node = node.parentElement)
      if (node.tagName === "DETAILS") node.open = true;
    target.scrollIntoView({ block: "center", behavior: "smooth" });
    actionStatus.textContent = "";
  }
  for (const [label, id, category] of [
    ["Build Structures", "roomLayoutTools", "Room"],
    ["Sculpt Terrain", "terrainTools", "Terrain"],
    ["Muzzle / Aim", "aimCalibration", "Map"],
    ["Place Object", "propTools", "Place"],
    ["Place Door", "door", "Events"],
    ["Place Item", "item", "Events"],
    ["Events", "openEventEditor", "Events"],
    ["Items", "startingGameplayValues", "Map"],
    ["Fullscreen", "fullscreen", "Map"],
  ]) {
    const action = document.createElement("button");
    action.type = "button";
    action.textContent = label;
    action.dataset.authoringOnly = String(label !== "Fullscreen");
    /* @function engineWorkspace.quickAction — Inputs: click ignored. Returns nothing; exposes existing authoring tool. Items opens the validated starting-data dialog and expands its item definitions; other actions reveal their original controls. No project edits until owning tool Apply. */
    action.onclick = /* @function engineWorkspace.quickActionHandler — Inputs: ignored click. Returns nothing; opens existing tool controls without applying authored edits. Missing controls are left unchanged. */ function () {
      if (label === "Build Structures") {
        window.FrontierTileRoomWindow?.open();
      } else if (label === "Place Door") {
        window.FrontierEventContext?.placeDoor();
      } else if (label === "Place Item") {
        window.FrontierEventContext?.placeItem();
      } else if (label === "Items") {
        document.getElementById(id)?.click();
        const legend = Array.from(document.querySelectorAll("dialog legend")).find(
          /* @function engineWorkspace.itemLegend — Inputs: legend element. Returns exact item-definition heading match; no mutation. */
          function (node) { return node.textContent === "Item definitions"; });
        if (legend) legend.parentElement.scrollIntoView({ block: "start" });
      } else if (label === "Fullscreen" || label === "Muzzle / Aim") document.getElementById(id)?.click();
      else revealTool(id, category);
    };
    actions.append(action);
  }
  // October 14: history stays visible beside editing actions, outside settings.
  for (const id of ["undo", "redo"]) {
    const original = document.getElementById(id);
    if (original) { original.dataset.authoringOnly = "true"; actions.append(original); }
  }
  bar.append(actions, actionStatus);

  // October 14, 2026: map navigation belongs in visible authoring chrome.
  // Move original nodes; their existing handlers and selected values survive.
  const mapNavigation = document.createElement("nav");
  mapNavigation.id = "workspaceMaps";
  mapNavigation.setAttribute("aria-label", "Open or create a map");
  for (const id of ["newProjectToolbar", "openProjectToolbar", "exportProject", "activeMap", "newMapToolbar", "mapFolder", "assignMapFolder"]) {
    const original = document.getElementById(id);
    if (original) mapNavigation.append(["activeMap", "mapFolder"].includes(id) ? original.closest("label") || original : original);
  }
  const saveProject = document.getElementById("exportProject");
  if (saveProject) saveProject.textContent = "Save Project (JSON)";
  bar.append(mapNavigation);

  header.before(bar);
  const settings = document.createElement("details");
  settings.id = "workspaceSettings";
  const summary = document.createElement("summary");
  summary.textContent = "Project and view settings";
  settings.append(summary, tools);
  header.append(settings);
  const assets = document.createElement("section");
  assets.id = "workspaceAssets";
  assets.setAttribute("aria-label", "Building and asset palette");
  const assetTitle = document.createElement("h2");
  assetTitle.textContent = "Build and place";
  assets.append(assetTitle);
  document.querySelector("main").prepend(assets);
  const building = document.getElementById("buildingTools");
  if (building) assets.append(building);
  const props = document.getElementById("propTools");
  if (props) assets.append(props);
  const library = document.getElementById("openModelLibrary");
  if (library) assets.append(library);
  const sections = [];
  // Group the actual nodes: listeners, field values and workbench references
  // survive this move. Newly added fieldsets are picked up by the observer.
  /* @function engineWorkspace.groupTools — Inputs: none. Returns: nothing. Wraps ungrouped editor fieldsets in accessible disclosure controls. Already grouped sections are retained; legends supply human-readable group names. */
  function groupTools() {
    for (const field of Array.from(editor.children)) {
      if (field.tagName !== "FIELDSET") continue;
      const group = document.createElement("details");
      group.className = "workspaceGroup";
      const caption = document.createElement("summary");
      caption.textContent =
        field.querySelector("legend")?.textContent || "Authoring tools";
      group.open = sections.length === 0;
      field.before(group);
      group.append(caption, field);
      sections.push(group);
      /* @function engineWorkspace.syncCategory — Inputs: none. Returns: nothing. Mirrors the existing category filter onto the disclosure wrapper; prevents empty captions for tools hidden by the authoritative tab controller. */
      function syncCategory() {
        group.hidden =
          field.classList.contains("toolTabHidden") || field.hidden;
      }
      new MutationObserver(syncCategory).observe(field, {
        attributes: true,
        attributeFilter: ["class", "hidden"],
      });
      syncCategory();
    }
  }
  /* @function engineWorkspace.refresh — Inputs: none. Returns: nothing. Synchronizes presentation with the authoritative editor hidden state; never changes the world or game pause state. Runtime-only presentation removes authoring navigation. */
  function refresh() {
    const runtime = !!window.FRONTIER_RUNTIME_ONLY;
    const authoring = !runtime && !editor.hidden;
    document.body.classList.toggle("engineAuthoring", authoring);
    document.body.classList.toggle("enginePlaytest", !authoring);
    document.body.classList.toggle("engineRuntime", runtime);
    toggle.textContent = authoring ? "Playtest [F2]" : "Return to editor [F2]";
    toggle.hidden = runtime;
    actions.hidden = runtime;
    for (const action of actions.children) action.hidden = !authoring && action.dataset.authoringOnly === "true";
    actionStatus.hidden = !authoring;
    groupTools();
  }
  new MutationObserver(refresh).observe(editor, {
    attributes: true,
    attributeFilter: ["hidden"],
    childList: true,
  });
  /* @function engineWorkspace.showSurfaceInspector — Inputs: selection change ignored. Returns nothing; opens Room category and numeric surface fields for nonempty wall/floor/ceiling selection. Uses original controls without authored mutation; missing controls no-op. */
  /* @function engineWorkspace.surfaceSelectionPresentation — Inputs: selection change event with optional revealProperties flag. Returns nothing; silently updates hierarchy selection when reveal is false, otherwise opens the original surface inspector. No authored mutation. */
  function showSurfaceInspector(event) {
    if (event?.detail?.revealProperties === false) return;
    const selected = document.getElementById("roomSelection");
    if (selected?.value) revealTool("roomElementFields", "Room");
  }
  document.getElementById("roomSelection")?.addEventListener("change", showSurfaceInspector);
  // October 14, 2026: supersedes the three-column workspace. Keep original
  // inspector nodes/listeners together on the left; the game owns the right.
  const inspector = document.querySelector("main > aside");
  if (inspector) assets.prepend(inspector);
  refresh();
})();
