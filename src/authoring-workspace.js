/* October 24, 2026 — 0.16.2 current behavior and units are described in ITERATION-0.16.2.md; earlier contracts below remain history. New camera/tactics helpers preserve existing owners and transactional validation. */
/* October 22, 2026: first migration slice of the UI Audit Setup design.
 * Actual legacy controls/handlers are portalled, never cloned. Full parity
 * access remains in Advanced tools; later structural milestones are documented
 * in EDITOR-REDESIGN-0.16.0.md rather than represented by inert buttons. */
(/* @function authoringWorkspace.install — Inputs: initialized editor document and typed scene service. Returns nothing; builds five workspaces, contextual inspection and optional large plan view. Runtime exports skip installation. No authored mutation during setup. */ function() {
  "use strict";
  if(window.FRONTIER_RUNTIME_ONLY || !window.FrontierScene) return;
  const scene=window.FrontierScene, assets=document.getElementById("workspaceAssets"), main=document.querySelector("main"), viewport=document.getElementById("viewport"), bar=document.getElementById("workspaceBar");
  if(!assets || !main || !viewport || !bar) return;
  document.body.classList.add("authoringWorkspace16");
  const inspector=document.createElement("section");inspector.id="sceneInspector";inspector.setAttribute("aria-label","Contextual inspector");
  const selectionPanel=document.createElement("section");selectionPanel.id="sceneInspectorSelection";
  const context=document.createElement("section");context.id="sceneToolContext";
  const legacy=document.createElement("details");legacy.id="authoringAdvanced";legacy.innerHTML='<summary>Advanced tools / compatibility panels</summary><p>Existing capabilities remain available during migration. Use the palette for everyday editing.</p>';
  // Preserve existing grouping/category ownership and every original listener.
  for(const node of Array.from(assets.children)) if(node.id!=="sceneHierarchy") legacy.append(node);
  const oldHeader=document.querySelector("body>header");if(oldHeader) legacy.append(oldHeader);
  const quick=document.getElementById("workspaceQuickActions");if(quick) legacy.append(quick);
  inspector.append(selectionPanel,context,legacy);main.append(inspector);
  const palette=document.createElement("section");palette.id="authoringPalette";assets.prepend(palette);
  const navigation=document.createElement("nav");navigation.id="authoringWorkspaces";navigation.setAttribute("aria-label","Authoring workspaces");
  const settingsButton=document.createElement("button");settingsButton.id="authoringProjectTools";settingsButton.type="button";settingsButton.textContent="Project / Tools";
  settingsButton.onclick=/* @function authoringWorkspace.showAdvanced — Inputs: click ignored. Returns nothing; toggles preserved advanced controls without changing world or gameplay state. */ function(){legacy.open=!legacy.open;if(legacy.open)legacy.scrollIntoView({block:"start"});};
  const statusButton169=document.createElement("button");statusButton169.id="featureStatus169";statusButton169.textContent="Feature status";statusButton169.type="button";statusButton169.onclick=/* @function authoringWorkspace.featureStatus169 — Inputs: click ignored. Displays honest availability and deliberate system boundaries, retaining all original advanced controls. */function(){restoreTool();window.FrontierAuthoringTools169.audit(context);};bar.append(statusButton169);
  const historyBar=document.createElement("div");historyBar.id="authoringHistory";
  for(const id of ["undo","redo"]) {const button=document.getElementById(id);if(button){button.hidden=false;historyBar.append(button);}}
  for(const id of ["undo","redo"])document.getElementById(id)?.addEventListener("click",/* @function authoringWorkspace.historyChanged — Inputs: ignored click. Returns nothing; refreshes shared inspection after the original history handler commits/restarts. No additional history entry or world mutation. */ function(){queueMicrotask(/* @function authoringWorkspace.inspectAfterHistory — Inputs: none. Returns nothing; resolves current world after original Undo/Redo handler. */ function(){scene.refresh();});});
  const currentCell=document.getElementById("activeMap")?.closest("label");if(currentCell){currentCell.id="authoringCurrentCell";bar.append(currentCell);}
  bar.append(historyBar,settingsButton,navigation);
  // October 26, 2026: fullscreen is an editor/playtest capability. Move the original control out of Advanced tools; retain its handler and pause/fullscreen ownership.
  const fullscreenButton166=document.getElementById("fullscreen");if(fullscreenButton166)bar.insertBefore(fullscreenButton166,settingsButton);
  const viewTools=document.createElement("div");viewTools.id="authoringViewTools";
  viewTools.innerHTML='<label>Editing view<select id="authoringView"><option value="scene">3D / current camera</option><option value="isometric">Isometric layout</option><option value="plan">Plan</option><option value="split">Plan + scene</option></select></label><span id="authoringViewStatus">Edit mode · world distances in metres</span>';
  const plan=document.createElement("section");plan.id="authoringPlan";plan.hidden=true;
  viewport.prepend(viewTools);viewport.append(plan);
  let active="Build", tool=null, returning=null, planNodes=[], view="scene", inspecting=false, lastSelectionSignature="";
  const destinations={
    World:[["Cells & project","mapName"],["Connections & arrivals","roomDestination"],["Cell settings / arrivals","cell-settings"],["New map","newMapToolbar"]],
    Build:[["Select","select"],["Isometric layout","isoLayout169"],["Draw room","layout"],["Wall","piece:wall"],["Floor","piece:floor"],["Ceiling","piece:ceiling"],["Stairs","piece:stairs"],["Block","piece:block"],["More building shapes","buildingTools"],["Prefab / model","propTools"],["Paint material","material"],["Raise ground","brush:raise"],["Lower ground","brush:lower"],["Flatten ground","brush:flatten"],["Smooth ground","brush:smooth"],["Paint ground","brush:texture"],["Terrain / water","terrainTools"],["Background room","roomPlan"]],
    Objects:[["Models & props","propTools"],["Model library","openModelLibrary"],["Place item","item"],["Local lights","localLightTools"]],
    Events:[["Weapon damage and sounds","weaponDamage169"],["Create / edit enemies","enemy"],["Event pages","openEventEditor"],["Place door / transfer","door"]],
    Environment:[["Shadow strength","shadows169"],["Isometric visibility","visibility169"],["Dithering","paletteDither168"],["Distance fog","distanceFog163"],["Rendering style","renderStyle163"],["Sky & distant scenery","skyTools"],["Map lighting","localLightTools"],["Sprite normals","openNormals"],["Camera / presentation","cellCamera"],["Fixed artwork alignment","roomCameraFields"],["Soundtrack","musicExploration"]],
  };
  /* @function authoringWorkspace.restoreTool — Inputs: none. Returns nothing; restores portalled original controls to their exact placeholders and returns the plan canvas before switching tool. Drafts and listeners are retained, not implicitly applied/discarded. */
  function restoreTool() {
    // October 29: one active viewport input owner. Keep numeric drafts, cancel only transient placement reservations when changing tasks.
    document.getElementById("buildingCancel")?.click();document.getElementById("propCancel")?.click();const inputOwner=document.getElementById("sceneTool");if(inputOwner)inputOwner.value="select";
    for(const button of palette.querySelectorAll("button"))button.setAttribute("aria-pressed","false");
    for(const [node,slot] of planNodes) {slot.replaceWith(node);} planNodes=[];
    if(returning) {returning.slot.replaceWith(returning.node);returning=null;}
    context.replaceChildren();plan.replaceChildren();tool=null;
  }
  /* @function authoringWorkspace.portalPlan — Inputs: existing plan node. Returns nothing; moves it into the large viewport plan with a return marker. Logical canvas pixels and existing pointer conversion stay unchanged. */
  function portalPlan(node) {if(!node)return;const slot=document.createComment("0.16 plan return");node.before(slot);planNodes.push([node,slot]);plan.append(node);}
  /* @function authoringWorkspace.setView — Inputs: scene/plan/split. Returns nothing; changes editor presentation only. It never changes runtime camera, collision, saved artwork or sprite tilt. Plan without an active plan tool provides instructions rather than pretending to be a new camera. */
  function setView(next,explicit=false) {
    if(next==="isometric"&&scene.cellKind169()==="fixed"){document.getElementById("authoringView").value=view;document.getElementById("authoringViewStatus").textContent="Fixed artwork keeps its own Background room alignment.";return;}
    if(next==="scene"&&view==="isometric"&&!explicit)next="isometric";
    if(next==="isometric"&&window.FrontierIsometric.editorView169?.mode!=="isometric")window.FrontierIsometric.editorView169=window.FrontierIsometric.validate({...scene.presentation(),mode:"isometric"});
    if(next==="scene"&&explicit&&scene.cellKind169()!=="fixed")window.FrontierIsometric.editorView169=window.FrontierIsometric.validate({...scene.presentation(),mode:"perspective"});else if(next!=="isometric"&&next!=="scene")window.FrontierIsometric.editorView169=null;
    view=next;document.getElementById("authoringView").value=next;viewport.dataset.authoringView=next;
    plan.hidden=!["plan","split"].includes(next);
    if(!plan.children.length&&["plan","split"].includes(next)) window.FrontierAuthoringTools169.plan(plan,scene);
  }
  /* @function authoringWorkspace.openField — Inputs: source fieldset/owned control ID. Returns success boolean; moves its existing owning fieldset into contextual tool settings, preserving values and handlers. Unsupported IDs fail visibly and retain full advanced access. No authored edits. */
  function openField(id) {
    const target=document.getElementById(id), node=target?.tagName==="FIELDSET" ? target : target?.closest("fieldset");
    if(!node) return false;
    const slot=document.createComment("0.16 tool return");node.before(slot);returning={node,slot};node.hidden=false;node.classList.remove("toolTabHidden");
    const heading=document.createElement("h2");heading.textContent="Tool settings";context.append(heading,node);tool=id;
    return true;
  }
  /* @function authoringWorkspace.activate — Inputs: tool ID. Returns nothing; opens a supported existing authoring tool or shows a specific unavailable message. Large room/layout plans share the live authored world and existing transaction callbacks. Does not fabricate Buildings/Storeys or integrated cut-out support ahead of their milestone. */
  function activate(id) {
    if(id==="distanceFog163"){
      restoreTool();tool=id;const form=document.createElement("form");form.innerHTML='<h3>Distance fog</h3><label><input name="enabled" type="checkbox">Enable distance fog</label><label>Start (metres)<input name="start" type="number" min="0" max="199" step="1"></label><label>End (metres)<input name="end" type="number" min="1" max="200" step="1"></label><label>Color<input name="color" type="color"></label><button type="button" id="dustyPlumPreset163">Dusty Plum preset</button><button>Apply distance fog</button><p>Dusty Plum blends distant geometry into #665263. Nearby geometry stays clear; sky saturation is controlled separately.</p><p role="status"></p>';
      /* @function authoringWorkspace.populateFog163 — Inputs: validated fog. Updates only detached controls, leaving authored state unchanged until Apply. */
      function populateFog163(value){form.elements.enabled.checked=value.enabled;for(const key of ["start","end","color"])form.elements[key].value=value[key];}
      populateFog163(scene.fog163());form.querySelector("#dustyPlumPreset163").onclick=/* @function authoringWorkspace.plumPreset163 — Inputs: ignored click. Resets draft to enabled 16–48 metre dusty plum, with no commit. */function(){populateFog163(FrontierFog.defaults);};
      form.onsubmit=/* @function authoringWorkspace.applyFog163 — Inputs: form submit. Saves validated fog as one Undo step; rejected ranges remain in draft with status. */function(event){event.preventDefault();try{scene.fog163({enabled:form.elements.enabled.checked,start:Number(form.elements.start.value),end:Number(form.elements.end.value),color:form.elements.color.value});form.querySelector('[role="status"]').textContent="Distance fog saved.";}catch(error){form.querySelector('[role="status"]').textContent=error.message;}};
      context.append(form);return;
    }
    if(id==="renderStyle163"){
      restoreTool();tool=id;const form=document.createElement("form");form.innerHTML='<h3>Rendering style</h3><label>Appearance<select name="mode"><option value="legacy">Legacy real-time (default)</option><option value="neutral">Neutral / untreated</option></select></label><label>Contrast<input name="contrast" type="number" step="0.01" min="0.5" max="1.5"></label><label>Saturation<input name="saturation" type="number" step="0.01" min="0" max="2"></label><label>Softness (screen pixels)<input name="softness" type="number" step="0.05" min="0" max="1"></label><p>Rich diffuse textures and existing normal-map lighting remain active. This restrained image treatment affects the world only; use Map lighting to stage colored lights. Authored lighting and readable editor/HUD fonts are preserved.</p><button>Apply rendering style</button><p role="status"></p>';
      const value=scene.appearance163();for(const key of ["mode","contrast","saturation","softness"])form.elements[key].value=value[key];
      form.onsubmit=/* @function authoringWorkspace.applyAppearance163 — Inputs: form submit. Validates and saves one map appearance history step; reports errors without discarding the draft or altering lighting. */function(event){event.preventDefault();try{scene.appearance163({mode:form.elements.mode.value,contrast:Number(form.elements.contrast.value),saturation:Number(form.elements.saturation.value),softness:Number(form.elements.softness.value)});form.querySelector('[role="status"]').textContent="Rendering style saved.";}catch(error){form.querySelector('[role="status"]').textContent=error.message;}};
      context.append(form);return;
    }
    if(id==="visibility169"){restoreTool();tool=id;const form=document.createElement("form");form.id="isoVisibility169";form.innerHTML='<h3>Isometric visibility</h3><label><input name="player" type="checkbox">Soft window around an obscured player</label><label><input name="enemies" type="checkbox">Red outlines for enemies behind geometry</label><label>Enemy reveal distance (metres)<input name="distance" type="number" min="0" max="40" step="0.5"></label><label>Player window radius (metres)<input name="radius" type="number" min="0.6" max="3" step="0.1"></label><p>Isometric gameplay only. Geometry depth, collision, cover and aim checks stay active. Terrain and fixed artwork are not cut away. At most twelve nearby enemy outlines are submitted.</p><button>Apply isometric visibility</button><p role="status"></p>';const value=scene.visibility169();for(const key of ["player","enemies"])form.elements[key].checked=value[key];for(const key of ["distance","radius"])form.elements[key].value=value[key];form.onsubmit=/* @function authoringWorkspace.visibilityCommit169 — Inputs: submit event. Validates and adopts only map reveal settings in one existing scene history step; invalid drafts stay visible. */function(event){event.preventDefault();try{scene.visibility169({player:form.elements.player.checked,enemies:form.elements.enemies.checked,distance:Number(form.elements.distance.value),radius:Number(form.elements.radius.value)});form.querySelector('[role="status"]').textContent="Isometric visibility saved.";}catch(error){form.querySelector('[role="status"]').textContent=error.message;}};context.append(form);return;}
    if(id==="isoLayout169"){
      if(scene.cellKind169()==="fixed"){document.getElementById("authoringViewStatus").textContent="This cell uses fixed artwork. Use Background room alignment rather than a 3D isometric camera.";return;}
      restoreTool();setView("isometric");tool=id;const form=document.createElement("form");form.id="isoLayout169";form.innerHTML='<h3>Isometric layout</h3><p>Place and adjust the same walls, stairs, prefabs and events in this view. Grid and existing handles keep their world-metre positions. Camera preview is editor-only until you apply it to the map. Fixed-background alignment remains a separate tool.</p><label>Rotation around map (degrees)<input name="yaw" type="number" step="1"></label><label>Camera tilt (degrees)<input name="tilt" type="number" min="15" max="75" step="1"></label><label>View size (pixels per metre)<input name="scale" type="number" min="12" max="100" step="1"></label><button>Use this camera for the map</button><p role="status"></p>';
      const current=window.FrontierIsometric.editorView169||window.FrontierIsometric.validate({...scene.presentation(),mode:"isometric"});form.elements.yaw.value=current.yaw*180/Math.PI;form.elements.tilt.value=current.tilt;form.elements.scale.value=current.scale;
      /* @function authoringWorkspace.isoDraft169 — Inputs: none. Returns validated isometric camera draft using degree UI and existing radian yaw; does not mutate world or actor positions. */
      function draft169(){return window.FrontierIsometric.validate({...scene.presentation(),mode:"isometric",yaw:Number(form.elements.yaw.value)*Math.PI/180,tilt:Number(form.elements.tilt.value),scale:Number(form.elements.scale.value)});}
      form.oninput=/* @function authoringWorkspace.isoPreview169 — Inputs: input event ignored. Applies only the transient authoring-camera override; invalid values leave the previous preview and report the reason. */function(){try{window.FrontierIsometric.editorView169=draft169();form.querySelector('[role="status"]').textContent="Editor preview only. Use this camera for the map to save it.";}catch(error){form.querySelector('[role="status"]').textContent=error.message;}};
      form.onsubmit=/* @function authoringWorkspace.isoCommit169 — Inputs: submit event. Saves the chosen camera via existing presentation/scene history, keeping collision, geometry, actor state and fixed artwork representation separate. */function(event){event.preventDefault();try{scene.presentation(draft169());form.querySelector('[role="status"]').textContent="Isometric map camera saved. Placement tools keep this editor view.";}catch(error){form.querySelector('[role="status"]').textContent=error.message;}};context.append(form);return;
    }
    if(id==="weaponDamage169"){restoreTool();tool=id;window.FrontierAuthoringTools169.weapons(context,scene.weapons169);window.FrontierAuthoringTools169.melee(context,scene.melee169);return;}
    if(id==="shadows169"){
      restoreTool();tool=id;const form=document.createElement("form");form.id="shadowSettings169";form.innerHTML='<h3>Shadow strength</h3><label>Outdoor sun shadows<input name="sun" type="range" min="0" max="4" step="0.05"></label><label>Isometric ground shadows<input name="contact" type="range" min="0" max="4" step="0.05"></label><output></output><div id="shadowPreview169" aria-label="Shadow strength preview" style="width:100%;height:70px;background-color:#b9b2a5"></div><p>Separate effects: sun shadows stay outdoors; ground blobs stay in isometric gameplay. Strength does not change map brightness. New maps inherit these strengths; imported maps retain their own settings. NPC/enemy Ground shadow can be disabled per event.</p><button>Apply to all current maps</button><p>Undo with World → Cells / project → Undo map operation.</p><p role="status"></p>';
      const value=scene.shadows169();for(const key of ["sun","contact"])form.elements[key].value=value[key];
      /* @function authoringWorkspace.shadowValues169 — Inputs: slider input ignored. Displays exact draft strengths; does not change authored/runtime state until Apply. */
      function values169(){form.querySelector("output").textContent="Sun: "+form.elements.sun.value+"× · Isometric: "+form.elements.contact.value+"×";form.querySelector("#shadowPreview169").style.backgroundImage="radial-gradient(ellipse at center,rgba(0,0,0,"+Math.min(.8,.16*Number(form.elements.contact.value))+") 0%,transparent 65%)";}
      form.oninput=values169;values169();form.onsubmit=/* @function authoringWorkspace.shadowCommit169 — Inputs: submit event. Applies both validated multipliers through the whole-project map history owner and reports rejection without losing draft values. */function(event){event.preventDefault();try{scene.shadows169({sun:Number(form.elements.sun.value),contact:Number(form.elements.contact.value)});form.querySelector('[role="status"]').textContent="Shadow strengths saved for every current map.";}catch(error){form.querySelector('[role="status"]').textContent=error.message;}};context.append(form);return;
    }
    if(id==="paletteDither168"){restoreTool();tool=id;window.FrontierPaletteDither.editor(context,scene.paletteDither168(),scene.paletteDither168);return;}
    if(id==="cellCamera") {restoreTool();tool=id;const form=document.createElement("form");form.innerHTML='<h3>Gameplay camera / presentation</h3><label>Cell camera<select name="mode"><option value="perspective">3D perspective</option><option value="isometric">Isometric / orthographic � Fallout style</option></select></label><label>View scale (pixels/metre)<input name="scale" type="number" min="12" max="100"></label><label>Camera angle (degrees)<input name="yaw" type="number"></label><label>Camera tilt (degrees)<input name="tilt" type="number" min="15" max="75" step="1"></label><label>Light cursor magnetism (0�0.35)<input name="magnetism" type="number" min="0" max="0.35" step="0.05"></label><p>Shots aim through 360 degrees toward the cursor with gentle attraction to nearby visible enemies. Only the displayed sprite snaps to its nearest available direction. Movement follows the fixed view. Fixed-artwork alignment remains available below.</p><button>Apply gameplay camera</button><p role="status"></p>';const p=scene.presentation();for(const k of ["mode","scale","magnetism","tilt"])form.elements[k].value=p[k];form.elements.yaw.value=p.yaw*180/Math.PI;form.onsubmit=/* @function authoringWorkspace.commitCamera162 � Inputs: form submit. Returns nothing; validates projection draft and commits one undoable cell edit. Errors retain draft and display a readable message; fixed artwork data is untouched. */function(event){event.preventDefault();try{const ok=scene.presentation({mode:form.elements.mode.value,scale:Number(form.elements.scale.value),yaw:Number(form.elements.yaw.value)*Math.PI/180,magnetism:Number(form.elements.magnetism.value),tilt:Number(form.elements.tilt.value)});form.querySelector('[role="status"]').textContent=ok?'Gameplay camera saved.':'Camera change rejected.';}catch(error){form.querySelector('[role="status"]').textContent=error.message;}};context.append(form);return;}
    restoreTool();const status=document.getElementById("authoringViewStatus");status.textContent="Edit mode · world distances in metres";
    // October 29, 2026: opening settings must also select the actual input owner.
    if(id==="terrainTools" || id.startsWith("brush:")){
      document.getElementById("buildingCancel")?.click();document.getElementById("propCancel")?.click();
      const control=document.getElementById("sceneTool");control.value="brush";control.dispatchEvent(new Event("change",{bubbles:true}));
      openField("terrainTools");if(id.startsWith("brush:"))document.getElementById("brushTool").value=id.slice(6);
      document.getElementById("brushTool").dispatchEvent(new Event("change"));setView("scene");status.textContent="Ground brush active: drag on the ground. Each drag is one Undo step.";return;
    }
    if(id.startsWith("piece:")){openField("buildingTools");document.getElementById("buildingType").closest("label").hidden=true;const piece=document.getElementById("buildingType");piece.value=id.slice(6);piece.dispatchEvent(new Event("change"));document.getElementById("buildingPlaceScene").click();setView("scene");status.textContent=piece.selectedOptions[0].textContent+" active: click ground or a floor to place. Escape cancels.";return;}
    if(id==="cell-settings") {for(const button of document.querySelectorAll("button")) if(button.textContent==="Cell settings / arrivals") {button.click();return;} status.textContent="Cell settings are unavailable.";return;}
    if(id==="select") {
      for(const controlId of ["sceneTool","roomTool"]) {const control=document.getElementById(controlId);if(control){control.value="select";control.dispatchEvent(new Event("change",{bubbles:true}));}}
      document.getElementById("buildingCancel")?.click();document.getElementById("propCancel")?.click();setView("scene");return;
    }
    if(id==="layout") {
      const node=document.getElementById("roomLayoutTools");
      if(node) {
        openField("roomLayoutTools");
        const stage=node.querySelector(".tileRoomStage");portalPlan(stage);setView("split");return;
      }
    }
    if(id==="roomPlan") {
      openField("roomPlan");portalPlan(document.getElementById("roomTool")?.closest("label"));portalPlan(document.getElementById("roomPlan"));portalPlan(document.getElementById("finishRoomFloor"));portalPlan(document.getElementById("cancelRoomDrawing"));setView("plan");return;
    }
    if(id==="material") {status.textContent="Select a structural surface in the scene or hierarchy, then edit Material in its inspector.";setView("scene");return;}
    if(id==="enemy") {window.FrontierEnemyTools?.open();return;}
    if(id==="door") {window.FrontierEventContext?.placeDoor();return;}
    if(id==="item") {window.FrontierEventContext?.placeItem();return;}
    if(id==="buildingTools")document.getElementById("buildingType").closest("label").hidden=false;
    const node=document.getElementById(id);
    if(node?.tagName==="BUTTON") {node.click();return;}
    if(!openField(id)) {legacy.open=true;status.textContent="This tool remains in Advanced tools during migration. Its existing controls are preserved.";}
  }
  /* @function authoringWorkspace.workspace — Inputs: one of five workspace names. Returns nothing; updates the creation palette, retains selection, restores prior controls, and keeps World map navigation scoped to World. No authoring/history mutation. */
  function workspace(name) {
    restoreTool();active=name;palette.replaceChildren();const title=document.createElement("h2");title.textContent=name;palette.append(title);
    for(const button of navigation.children) button.setAttribute("aria-pressed",String(button.textContent===name));
    const maps=document.getElementById("workspaceMaps");if(maps) maps.hidden=name!=="World";
    for(const [label,id] of destinations[name]) {const button=document.createElement("button");button.type="button";button.textContent=label;
      button.onclick=/* @function authoringWorkspace.paletteAction — Inputs: click ignored. Returns nothing; activates the selected concrete tool. Errors report in editor status; no silent fallback mutation. */ function(){try{activate(id);button.setAttribute("aria-pressed","true");}catch(error){document.getElementById("authoringViewStatus").textContent=error.message;}};palette.append(button);}
    setView("scene");
  }
  for(const name of Object.keys(destinations)) {const button=document.createElement("button");button.type="button";button.textContent=name;
    button.onclick=/* @function authoringWorkspace.navigation — Inputs: click ignored. Returns nothing; changes editor workspace only, preserving authored and gameplay data. */ function(){workspace(name);};navigation.append(button);}
  document.getElementById("authoringView").onchange=/* @function authoringWorkspace.viewChoice — Inputs: select change. Returns nothing; selects editor scene/plan/split display without creating a transaction. */ function(event){setView(event.target.value,true);};
  /* @function authoringWorkspace.inspect — Inputs: current typed selection. Returns nothing; builds a compact common-property inspector from isolated snapshots. Specialized geometry/model/event controls remain accessible. Does not commit keystrokes until Apply. */
  function inspect(refs) {
    if(inspecting)return;inspecting=true;
    const signature=JSON.stringify(refs.map(/* @function authoringWorkspace.selectionIdentity — Inputs: typed reference. Returns cell/kind/ID identity for inspector scroll retention. No writes. */ function(ref){return [ref.cellId,ref.kind,ref.id];})), savedScroll=inspector.scrollTop;
    try {
      selectionPanel.replaceChildren();const title=document.createElement("h2");title.textContent="Inspector";selectionPanel.append(title);
      const edits=scene.generatedEdits();
      if(edits.length) {
        const review=document.createElement("details"), summary=document.createElement("summary"), picker=document.createElement("select"), restore=document.createElement("button");
        summary.textContent="Generated edits / restore ("+edits.length+")";picker.id="generatedEditSelection";picker.setAttribute("aria-label","Generated edit to restore");
        for(const edit of edits)picker.append(new Option(edit.id+(edit.suppressed ? " — deleted or detached" : " — customized"),edit.id));
        restore.type="button";restore.textContent="Restore this generated part";restore.id="restoreGeneratedPart";
        restore.onclick=/* @function authoringWorkspace.restoreGenerated — Inputs: click ignored. Returns nothing; explicitly restores the selected generated origin, retaining independent pieces. Standard transaction handles rejection/Undo; refresh updates the review list. */ function(){scene.restoreGenerated(picker.value);scene.refresh();};
        const help=document.createElement("p");help.textContent="Restores original generated geometry/material for this part. Detached pieces remain independent; review overlap before restoring their origins.";
        review.append(summary,picker,help,restore);selectionPanel.append(review);
      }
      if(!refs.length) {const help=document.createElement("p");help.textContent="Select a surface, prop or event in the scene or hierarchy. Creation settings appear only for the active tool.";selectionPanel.append(help);return;}
      const summary=document.createElement("p");summary.textContent=refs.length===1 ? refs[0].name+" · "+refs[0].kind+(refs[0].generated ? " · generated / linked" : "") : refs.length+" selected";selectionPanel.append(summary);
      if(refs.length>1) {
        const guidance=document.createElement("p");guidance.textContent="Delete the selection together, or select one part to transform it.";selectionPanel.append(guidance);
        const control=document.getElementById("roomSelection");if(control?.value){control.value="";control.dispatchEvent(new CustomEvent("change",{bubbles:true,detail:{revealProperties:false}}));}
      }
      if(refs.length===1) {
        const ref=refs[0];
        // Follow typed selection back into the established viewport/gizmo owner,
        // including a newly detached part. This is selection only, not an edit.
        const control=document.getElementById(ref.group);
        if(control && control.value!==ref.id){control.value=ref.id;control.dispatchEvent(new CustomEvent("change",{bubbles:true,detail:{revealProperties:false}}));}
        const record=scene.snapshot(ref), form=document.createElement("form");form.id="scenePropertyForm";
        const keys=ref.kind==="primitive" ? (record.shape==="round" ? ["name","x","y","z","h","yaw","texture","color","tileSize"] : ["name","x","y","z","w","d","h","yaw","texture","color","tileSize"]) : ["name","x","y"];
        for(const key of keys) {const label=document.createElement("label");label.textContent=({name:"Name",x:"X (m)",y:"Y (m)",z:"Base elevation (m)",w:"Width (m)",d:"Depth (m)",h:"Height (m)",yaw:"Rotation (radians)",texture:"Material",color:"Base color",tileSize:"Texture repeat (m)"})[key];
          const input=document.createElement(key==="texture" ? "select" : "input");input.name=key;
          if(key==="texture") for(const option of document.getElementById("roomSurface").options) input.append(new Option(option.textContent,option.value));
          if(key==="texture" && record.texture && !Array.from(input.options).some(/* @function authoringWorkspace.hasTexture — Inputs: option. Returns saved texture equality; no mutation. */ function(option){return option.value===record.texture;})) input.append(new Option("Saved custom texture",record.texture));
          if(key!=="texture") {input.type=key==="name" ? "text" : key==="color" ? "color" : "number";if(!["name","color"].includes(key))input.step="any";}
          input.value=record[key]??(key==="tileSize" ? 2 : key==="yaw" ? 0 : "");label.append(input);form.append(label);
        }
        if(ref.kind==="event"){const label=document.createElement("label"),check=document.createElement("input");check.type="checkbox";check.name="groundShadow";check.checked=record.groundShadow!==false;label.append(check,"Ground shadow (isometric only)");form.append(label);const editEnemy=document.createElement("button");editEnemy.type="button";editEnemy.textContent=record.extensions?.enemy?"Edit enemy: health and behavior":"Make enemy / edit behavior";editEnemy.onclick=/* @function authoringWorkspace.enemy169 - Inputs: click ignored. Opens existing enemy configuration for selected event; no image selection is mistaken for enemy creation. */function(){window.FrontierEnemyTools?.open(ref.id);};form.append(editEnemy);}
        const apply=document.createElement("button");apply.type="submit";apply.textContent="Apply properties";form.append(apply);
        form.onsubmit=/* @function authoringWorkspace.applyProperties — Inputs: form submit. Returns nothing; copies only supported fields into one validated owner transaction. Failures retain the draft and show the rejection. No per-keystroke writes. */ function(event){event.preventDefault();const patch={};for(const input of form.querySelectorAll("input,select")) patch[input.name]=input.type==="checkbox"?input.checked:["name","texture","color"].includes(input.name) ? input.value : Number(input.value);try{if(scene.update(ref,patch)===false){document.getElementById("authoringViewStatus").textContent="Change rejected. Previous authored data retained; check the editor status.";}else scene.refresh();}catch(error){document.getElementById("authoringViewStatus").textContent=error.message;}};
        selectionPanel.append(form);window.FrontierAuthoringTools169?.materials(form.querySelector('[name="texture"]'));
        if(ref.generated) {const detach=document.createElement("button");detach.type="button";detach.id="detachGeneratedPart";detach.textContent="Make independent";
          detach.onclick=/* @function authoringWorkspace.detachGenerated — Inputs: click ignored. Returns nothing; preserves selected effective geometry as an independent part and suppresses its generated origin in the same transaction. */ function(){scene.detach(ref);scene.refresh();};selectionPanel.append(detach);}

      }
      const remove=document.createElement("button");remove.type="button";remove.textContent="Delete selected ("+refs.length+")";remove.id="inspectorDelete";
      remove.onclick=/* @function authoringWorkspace.deleteSelection — Inputs: click ignored. Returns nothing; delegates the current typed selection to one existing atomic deletion transaction, then updates the inspector. Assets remain intact. */ function(){scene.remove();scene.refresh();};selectionPanel.append(remove);
    } finally {inspector.scrollTop=signature===lastSelectionSignature ? savedScroll : 0;lastSelectionSignature=signature;inspecting=false;}
  }
  /* @function authoringWorkspace.historyAvailability — Inputs: selection notification ignored. Returns nothing; enables only available scene Undo/Redo actions. Original controls remain visible in authoring and the entire bar is hidden during playtest. No history mutation. */
  function historyAvailability() {const state=scene.history();for(const id of ["undo","redo"]){const button=document.getElementById(id);if(button){button.hidden=false;button.disabled=state[id]===0;button.title=state[id] ? "Scene "+id : "No scene "+id+" is available";}}}
  scene.subscribe(inspect);scene.subscribe(historyAvailability);historyAvailability();
  for(const id of ["roomSelection","selection","localLightSelection"]) document.getElementById(id)?.addEventListener("change",/* @function authoringWorkspace.legacySelection — Inputs: original owner selection change. Returns nothing; bridges explicit single selection to typed ownership. Hierarchy range selection uses its own synchronized set; stale targets are ignored. */ function(event){if(event.detail?.revealProperties===false)return;const found=scene.list().find(/* @function authoringWorkspace.matchLegacy — Inputs: normalized scene entry. Returns matching owner group/ID; no writes. */ function(ref){return ref.group===id && ref.id===event.target.value;});scene.select(found ? [found] : []);});
  document.getElementById("activeMap")?.addEventListener("change",/* @function authoringWorkspace.cellChanged — Inputs: ignored change. Returns nothing; clears typed selection and restores tool controls before a different map becomes active. Unsaved draft ownership remains with the source tool. */ function(){restoreTool();scene.select([]);setView("scene");});
  document.getElementById("editor")?.addEventListener("change",/* @function authoringWorkspace.authoredControlsChanged — Inputs: bubbled form change. Returns nothing; refreshes typed inspector after owner handlers. Does not create authoring history. */ function(){queueMicrotask(/* @function authoringWorkspace.refreshAfterOwner — Inputs: none. Returns nothing; revalidates typed selection once owner processing completes. */ function(){scene.refresh();});});
  if(window.FrontierTileRoomWindow) window.FrontierTileRoomWindow.open=/* @function authoringWorkspace.integratedRoomTool — Inputs: none. Returns nothing; canonical tile entry now routes into Build and its large integrated plan, without opening another room-editor window. Runtime has no service. */ function(){workspace("Build");activate("layout");};
  document.getElementById("openTileRoomBuilder")?.addEventListener("click",/* @function authoringWorkspace.tileLauncher — Inputs: click. Returns nothing; closes the prior standalone container and routes its existing controls into the integrated plan. No authored commit. */ function(){document.getElementById("tileRoomWindow")?.close();workspace("Build");activate("layout");});
  document.addEventListener("keydown",/* @function authoringWorkspace.shortcuts — Inputs: keyboard event in capture phase. Returns nothing; Delete and Ctrl/Cmd Z/Y route only in authoring without modal/text focus. Escape restores the selection tool. Prevents duplicate/gameplay handling of consumed shortcuts, with no hotkeys added for unsupported manipulation modes. */ function(event){
    if(!document.body.classList.contains("engineAuthoring") || document.querySelector("dialog[open]") || event.target.closest?.("input,textarea,select,[contenteditable=true]"))return;
    const key=event.key.toLowerCase();let handled=false;
    if(key==="delete" && !event.repeat && scene.selection().length){scene.remove();scene.refresh();handled=true;}
    if((event.ctrlKey || event.metaKey) && ["z","y"].includes(key)){const id=key==="y" || event.shiftKey ? "redo" : "undo";document.getElementById(id)?.click();scene.refresh();handled=true;}
    if(key==="escape"){activate("select");handled=true;}
    if(handled){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  // October 26: shared handles augment free drag; only pointer release commits.
  const handles163=document.createElementNS("http://www.w3.org/2000/svg","svg");
  handles163.id="sceneTransformHandles";handles163.style.cssText="position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:90;overflow:visible";
  document.body.append(handles163);
  const transformBar163=document.createElement("fieldset");transformBar163.innerHTML='<legend>Transform handles</legend><label>Tool<select id="sharedTransformMode"><option value="move">Move</option><option value="rotate">Rotate</option></select></label><label>Move snap (metres; 0 = free)<input id="sharedMoveSnap" type="number" min="0" step="0.1" value="0.5"></label><label>Rotation snap (degrees; 0 = free)<input id="sharedRotateSnap" type="number" min="0" step="1" value="15"></label><p>Drag X/Y/Z arrows to move along world axes. Rotate rings edit structural/model axes; sprites retain camera-facing presentation. Release to commit; Escape cancels. Original free drag remains available.</p><output id="sharedTransformStatus"></output>';
  inspector.insertBefore(transformBar163,selectionPanel);
  let handleDrag163=null,handleAxes163=[];
  /* @function authoringWorkspace.handlePoint163 — Inputs: source record and kind. Returns metre XYZ for actual geometry anchor; legacy prop elevations convert feet at existing 0.3 m/foot convention. Does not mutate records. */
  function handlePoint163(record,kind){return [record.x,record.y,kind==="primitive" ? record.z||0 : kind==="event" ? record.heightOffset||0 : kind==="object" ? (record.elevation||0)*0.3 : record.z||0];}
  /* @function authoringWorkspace.drawHandles163 — Inputs: animation timestamp ignored. Returns nothing; projects at most four points for one selection while editing, clears handles during modal/playtest and schedules next display frame. Draws preview displacement only; source changes happen once on release. */
  function drawHandles163(){
    handles163.replaceChildren();handleAxes163=[];
    const refs=scene.selection(),canvas=document.getElementById("view");
    transformBar163.hidden=!document.body.classList.contains("engineAuthoring")||refs.length!==1;
    if(!transformBar163.hidden && !document.querySelector("dialog[open]") && canvas){
      const ref=refs[0],record=scene.snapshot(ref),xyz=scene.anchor163(ref),box=canvas.getBoundingClientRect(),origin=scene.project163(...xyz);
      if(origin && box.width){
        const sx=box.width/canvas.width,sy=box.height/canvas.height,ox=box.left+origin.x*sx,oy=box.top+origin.y*sy,mode=document.getElementById("sharedTransformMode").value;
        for(let axis=0;axis<3;axis++){
          if(mode==="rotate" && !(ref.kind==="primitive" && axis===2 || ref.kind==="event" && record.spatial))continue;
          if(mode==="move" && axis===2 && !["primitive","event","object"].includes(ref.kind))continue;
          const point=xyz.slice();point[axis]+=1;const tip=scene.project163(...point);if(!tip)continue;
          const dx=(tip.x-origin.x)*sx,dy=(tip.y-origin.y)*sy,len=Math.hypot(dx,dy);if(len<2)continue;
          const ux=dx/len,uy=dy/len,color=["#ff6969","#78e58d","#78adff"][axis];
          handleAxes163[axis]={ux,uy,len};
          const line=document.createElementNS(handles163.namespaceURI,mode==="move"?"path":"circle");
          if(mode==="move")line.setAttribute("d",`M ${ox} ${oy} L ${ox+ux*80} ${oy+uy*80} M ${ox+ux*68-uy*7} ${oy+uy*68+ux*7} L ${ox+ux*80} ${oy+uy*80} L ${ox+ux*68+uy*7} ${oy+uy*68-ux*7}`);
          else {line.setAttribute("cx",ox);line.setAttribute("cy",oy);line.setAttribute("r",35+axis*13);line.setAttribute("fill","none");}
          line.setAttribute("stroke",color);line.setAttribute("stroke-width","5");line.style.pointerEvents="stroke";line.style.cursor="grab";line.dataset.axis=axis;handles163.append(line);
          const label=document.createElementNS(handles163.namespaceURI,"text");label.setAttribute("x",ox+ux*92);label.setAttribute("y",oy+uy*92);label.setAttribute("fill",color);label.setAttribute("font-size","16");label.textContent=["X","Y","Z"][axis];handles163.append(label);
        }
      }
    }
    requestAnimationFrame(drawHandles163);
  }
  handles163.addEventListener("pointerdown",/* @function authoringWorkspace.beginHandle163 — Inputs: pointer press on an axis stroke. Captures selection and projection at drag start; no authored writes. Invalid/stale selections are ignored; consumes input so gameplay/free-drag owners do not move simultaneously. */function(event){
    const axis=Number(event.target.dataset.axis),ref=scene.selection()[0];if(!ref||!handleAxes163[axis])return;
    handleDrag163={ref,axis,basis:handleAxes163[axis],x:event.clientX,y:event.clientY,delta:0,mode:document.getElementById("sharedTransformMode").value};
    handles163.setPointerCapture(event.pointerId);event.preventDefault();event.stopPropagation();
  });
  handles163.addEventListener("pointermove",/* @function authoringWorkspace.previewHandle163 — Inputs: captured pointer motion. Updates a transient metre/radian delta and visible status; snapping uses captured axis scale, never writes scene during drag. Shift temporarily bypasses snapping. */function(event){
    const drag=handleDrag163;if(!drag)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    let delta=drag.mode==="move" ? (dx*drag.basis.ux+dy*drag.basis.uy)/drag.basis.len : (dx-dy)*Math.PI/180;
    const snap=event.shiftKey?0:Number(document.getElementById(drag.mode==="move"?"sharedMoveSnap":"sharedRotateSnap").value)*(drag.mode==="move"?1:Math.PI/180);
    if(snap>0)delta=Math.round(delta/snap)*snap;drag.delta=delta;
    document.getElementById("sharedTransformStatus").textContent=["X","Y","Z"][drag.axis]+": "+(drag.mode==="move"?delta.toFixed(2)+" m":Math.round(delta*180/Math.PI)+" degrees")+" — release to apply";
    event.preventDefault();event.stopPropagation();
  });
  handles163.addEventListener("pointerup",/* @function authoringWorkspace.commitHandle163 — Inputs: captured release. Commits finite nonzero delta once through shared validator/history, reports rejection without data loss and refreshes selection. Pointer release ends capture automatically. */function(event){
    const drag=handleDrag163;handleDrag163=null;if(!drag)return;
    try{if(drag.delta)scene.transform163(drag.ref,drag.mode,drag.axis,drag.delta);scene.refresh();document.getElementById("sharedTransformStatus").textContent="Transform applied.";}catch(error){document.getElementById("sharedTransformStatus").textContent=error.message;}
    event.preventDefault();event.stopPropagation();
  });
  handles163.addEventListener("pointercancel",/* @function authoringWorkspace.cancelHandle163 — Inputs: interrupted pointer gesture. Discards transient delta without history or source mutation. */function(){handleDrag163=null;});
  document.addEventListener("keydown",/* @function authoringWorkspace.escapeHandle163 — Inputs: key event. Escape drops an in-progress transform without committing; other shortcuts keep their established owners. */function(event){if(event.key==="Escape")handleDrag163=null;},true);
  requestAnimationFrame(drawHandles163);
  window.FrontierAuthoringWorkspace={workspace,activate,inspect:/* @function authoringWorkspace.inspectCurrent — Inputs: none. Returns nothing; refreshes inspector from current typed selection. No authored edits. */ function(){inspect(scene.selection());}};
  window.FrontierAuthoringTools169.materials(document.getElementById("buildingMaterial"));
  workspace("Build");inspect(scene.selection());
})();
