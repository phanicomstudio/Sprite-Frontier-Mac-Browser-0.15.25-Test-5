/* October 22, 2026: editor-side typed scene adapter. Legacy authored collections
 * remain authoritative in this migration stage. No gameplay actor, render cache
 * or runtime save is edited here. IDs include cell and collection ownership. */
(/* @function authoringScene.install — Inputs: browser/global namespace. Returns nothing; publishes a pure typed scene adapter and transient selection service. No DOM, world mutation or per-frame scanning at installation. */ function (root) {
  "use strict";
  const collections = [
    ["primitive", "interior", "primitives", "roomSelection"],
    ["blocker", "interior", "blockers", "roomSelection"],
    ["sprite", "interior", "sprites", "roomSelection"],
    ["entrance", "travel", "entrances", "roomSelection"],
    ["exit", "travel", "exits", "roomSelection"],
    ["object", "world", "objects", "selection"],
    ["event", "world", "events", "selection"],
    ["light", "lighting", "lights", "localLightSelection"],
  ];
  /* @function authoringScene.owner — Inputs: authored world and descriptor location. Returns existing collection owner or undefined; travel follows existing interior-before-outdoor ownership. No records are created or modified. */
  function owner(world, location) {
    if (location === "world") return world;
    if (location === "travel") return world.interior || world.travel;
    return world[location];
  }
  /* @function authoringScene.entries — Inputs: current authored world and cell ID. Returns fresh typed references with display metadata, never raw mutable records. Does not rewrite legacy IDs, infer storeys or flatten imported model meshes into wall parts. */
  function entries(world, cellId) {
    const result = [];
    for (const [kind, location, key, group] of collections) {
      for (const record of owner(world, location)?.[key] || []) {
        result.push({cellId, kind, id:record.id, name:record.name || record.id, group,
          generated:kind === "primitive" && (record.layoutGroup === "grid-layout" || !!record.constructionRoom),
          path:structuralPath(world,record,kind),
          role:record.moduleType || kind, model:kind === "event" && !!record.spatial?.model});
      }
    }
    return result;
  }
  /* @function authoringScene.structuralPath — Inputs: authored world and connected component. Returns readable actual Building/Storey/Room ownership path, preserving optional missing parents as ungrouped. No coordinate mutation or decorative inferred ownership. */
  function structuralPath(world,record,kind){const c=world.interior?.construction;if(!c)return [];const member=c.members?.find(/* @function authoringScene.membership — Inputs: typed structural ownership link. Returns exact collection/ID match; no spatial inference. */function(m){return m.kind===kind&&m.id===record.id;}),roomId=record.constructionRoom||member?.roomId;if(!roomId)return [];const room=c.rooms.find(/* @function authoringScene.pathRoom — Inputs: recipe. Returns actual component owner. */function(r){return r.id===roomId;}),building=c.buildings.find(/* @function authoringScene.pathBuilding — Inputs: building. Returns room organizational parent. */function(b){return b.id===room?.buildingId;}),storey=c.storeys.find(/* @function authoringScene.pathStorey — Inputs: storey. Returns room elevation-reference parent. */function(s){return s.id===room?.storeyId;});return [building?.name||'Ungrouped building',storey?.name||'No storey',room?.name||roomId];}
  /* @function authoringScene.resolve — Inputs: authored world, active cell ID and typed reference. Returns current source record or null for a stale/foreign/unsupported reference. Never resolves an ID across kinds or cells and never mutates source. */
  function resolve(world, cellId, ref) {
    if (!ref || ref.cellId !== cellId || typeof ref.id !== "string") return null;
    for (const [kind, location, key] of collections) {
      if (kind !== ref.kind) continue;
      for (const record of owner(world, location)?.[key] || []) if (record.id === ref.id) return record;
    }
    return null;
  }
  /* @function authoringScene.create — Inputs: owner API world/active/editing/mutate/removeMany plus optional notify. Returns a transient selection/inspection service. All writes use the existing validated world transaction; stale selections fail before mutation. */
  function create(api) {
    let selected = [], cell = api.active();
    const listeners = new Set();
    /* @function authoringScene.key — Inputs: typed reference. Returns a collision-free JSON identity including cell, kind and ID. No writes or unit conversion. */
    function key(ref) { return JSON.stringify([ref.cellId,ref.kind,ref.id]); }
    /* @function authoringScene.publish — Inputs: none. Returns nothing; synchronously sends copied selected references to registered editor observers. Observers must not mutate the authored world; exceptions propagate to the calling UI boundary. */
    function publish() { for (const listener of listeners) listener(selection()); }
    /* @function authoringScene.selection — Inputs: none. Returns copied live references, dropping stale/foreign IDs and clearing selection after cell change. No authored changes and no gameplay state writes. */
    function selection() {
      if (cell !== api.active()) { cell = api.active(); selected = []; }
      const fresh=[];
      for(const ref of selected) {const record=resolve(api.world(),cell,ref);if(record)fresh.push({...ref,name:record.name||record.id,role:record.moduleType||ref.kind,generated:ref.kind==="primitive" && (record.layoutGroup==="grid-layout"||!!record.constructionRoom)});}
      selected=fresh;
      return structuredClone(selected);
    }
    /* @function authoringScene.select — Inputs: typed reference array. Returns copied accepted selection; deduplicates exact identities and rejects stale/foreign targets. Notifies UI only, with no history entry. */
    function select(refs) {
      const seen = new Set(); cell = api.active(); selected = [];
      for (const ref of refs) if (resolve(api.world(),cell,ref) && !seen.has(key(ref))) { seen.add(key(ref)); selected.push({...ref}); }
      publish(); return selection();
    }
    /* @function authoringScene.snapshot — Inputs: typed reference. Returns isolated current source payload or null when stale. Inspector callers cannot mutate the authored world by editing the returned copy. */
    function snapshot(ref) { const record=resolve(api.world(),api.active(),ref); return record ? structuredClone(record) : null; }
    /* @function authoringScene.update — Inputs: typed reference and explicit property patch. Returns validated commit boolean. Primitive dimensions use metres and yaw radians; ordinary objects/events expose only name/world XY here, retaining specialized spatial/weapon/event editors. Throws unsupported property or stale target before writing. Existing owner handles rollback, history and preview restart. */
    function update(ref, patch) {
      if (!api.editing()) return false;
      if (!resolve(api.world(),api.active(),ref)) throw Error("The selected object no longer exists in this cell.");
      if(resolve(api.world(),api.active(),ref)?.shape==="round" && ("w" in patch || "d" in patch)) throw Error("Use the radius and arc controls for round geometry.");
      const allowed = ref.kind === "primitive" ? ["name","x","y","z","w","d","h","yaw","texture","tileSize","textureMapping","textureRotation","textureOffsetU","textureOffsetV","preserveAspect","color"] : ref.kind === "event" ? ["name","x","y","heightOffset","spatial","groundShadow"] : ref.kind === "object" ? ["name","x","y","elevation"] : ["name","x","y"];
      for (const property of Object.keys(patch)) if (!allowed.includes(property)) throw Error("Use the specialized inspector for " + property + ".");
      return api.mutate(/* @function authoringScene.commitPatch — Inputs: none. Returns nothing; resolves the live source again inside the owner transaction and applies only the validated property whitelist. World validation rejects invalid values atomically. */ function(){
        const record=resolve(api.world(),api.active(),ref);
        if (!record) throw Error("Selection changed before applying the edit.");
        Object.assign(record,structuredClone(patch));
        // Match the original material inspector: an empty catalog choice is
        // an untextured surface, not an invalid empty asset URL.
        if(patch.texture==="")delete record.texture;
      });
    }
    /* @function authoringScene.remove — Inputs: optional typed references, defaulting to current selection. Returns owner deletion result. Translates supported references to established scene targets and submits one atomic transaction; source assets remain untouched. */
    function remove(refs = selection()) {
      if (!api.editing()) return false;
      const targets=[];
      for(const ref of refs) if(resolve(api.world(),api.active(),ref)) for(const [kind,,,group] of collections) if(kind===ref.kind) targets.push({group,id:ref.id});
      const accepted=api.removeMany(targets); if(accepted) { selection(); publish(); } return accepted;
    }
    /* @function authoringScene.subscribe — Inputs: observer function. Returns nothing; registers the observer once. Editor service lives for the application lifetime; callers own observer lifetime. No authored changes. */
    function subscribe(listener) { listeners.add(listener); }
    /* @function authoringScene.refresh — Inputs: none. Returns nothing; revalidates selection after history/import/restart and publishes current editor state. No world mutation. */
    function refresh() { selection(); if(api.editing())publish(); }
    /* @function authoringScene.list — Inputs: none. Returns fresh normalized entries for the active cell; no direct mutable source references are exposed. */
    function list() { return entries(api.world(),api.active()); }
    /* @function authoringScene.generatedEdits — Inputs: none. Returns copied legacy grid override ledger records for explicit restore/review. No derived scene writes or inference of historical deletions. */
    function generatedEdits() { const room=api.world().interior;return structuredClone([...(room?.layout?.edits?.parts||[]),...(room?.construction?.rooms||[]).flatMap(/* @function authoringScene.connectedEdits — Inputs: connected room recipe. Returns persistent component overrides for same explicit review/restore UI. */function(r){return r.overrides||[];})]); }
    /* @function authoringScene.detach — Inputs: typed generated primitive reference. Returns commit boolean; preserves effective geometry/material/collision under a new independent identity, suppressing original through transaction capture. Selection follows the new independent part. Rejects stale or non-generated targets. */
    function detach(ref) {
      const connected=resolve(api.world(),api.active(),ref);
      if(api.editing()&&ref?.kind==='primitive'&&connected?.constructionRoom){if(connected.openingHost)throw Error('Detach or remove the opening through its host first.');let id;const accepted=api.mutate(/* @function authoringScene.detachConnected1611 — Inputs: none. Preserves effective part as ordinary independent geometry and lets construction capture suppress its former generated identity in the same Undo transaction. */function(){const part=resolve(api.world(),api.active(),ref);id='part-'+crypto.randomUUID();part.id=id;delete part.constructionRoom;delete part.constructionBuilding;delete part.constructionStorey;delete part.constructionBase;});if(accepted)select([{...ref,id}]);return accepted;}

      const record=resolve(api.world(),api.active(),ref);
      if(!api.editing() || ref?.kind!=="primitive" || record?.layoutGroup!=="grid-layout") return false;
      let id="independent-part",serial=1;const used=new Set();for(const entry of entries(api.world(),api.active()))used.add(entry.id);
      while(used.has(id))id="independent-part-"+serial++;
      const accepted=api.mutate(/* @function authoringScene.commitDetach — Inputs: none. Returns nothing; edits only current generated record inside standard Undo/validation. Capture records suppression for the former generated ID; no duplicated mesh is created. */ function(){
        const part=resolve(api.world(),api.active(),ref);if(!part)throw Error("Generated selection is stale.");
        part.detachedFrom=part.id;part.id=id;delete part.layoutGroup;delete part.layoutBase;delete part.layoutMaterial;
      });
      if(accepted)select([{...ref,id,generated:false}]);return accepted;
    }
    /* @function authoringScene.restoreGenerated — Inputs: generated origin ID. Returns owner commit boolean; removes that explicit override and regenerates only owned grid geometry. Independent/detached parts stay intact; restoring may deliberately recreate original structure, so UI identifies the target. Invalid topology/capacity rolls back atomically. */
    function restoreGenerated(id) {
      const parent=api.world().interior?.construction?.rooms.find(/* @function authoringScene.restoreParent1611 — Inputs: connected recipe. Returns parent owning the selected override identity. */function(room){return room.overrides.some(/* @function authoringScene.restoreEdit1611 — Inputs: component override. Returns exact selected identity. */function(edit){return edit.id===id;});});
      if(parent&&api.editing())return api.mutate(/* @function authoringScene.restoreConnected1611 — Inputs: none. Clears exactly one connected override inside original Undo transaction; no independent piece is deleted. */function(){const target=api.world().interior.construction.rooms.find(/* @function authoringScene.restoreCurrentParent1611 — Inputs: live recipe. Returns same stable parent. */function(room){return room.id===parent.id;});target.overrides=target.overrides.filter(/* @function authoringScene.keepConnectedEdit1611 — Inputs: component override. Retains all other authored edits. */function(edit){return edit.id!==id;});});

      if(!api.editing())return false;
      let found=false;for(const edit of api.world().interior?.layout?.edits?.parts || [])if(edit.id===id)found=true;
      if(!found)return false;
      return api.mutate(/* @function authoringScene.commitRestore — Inputs: none. Returns nothing; removes the chosen ledger record, excludes its cached output and rebuilds effective generated geometry from the current recipe. Other overrides and independent pieces remain. Errors propagate to transaction rollback. */ function(){
        const room=api.world().interior;if(!room?.layout)throw Error("No generated room exists.");
        const remaining=[];for(const edit of room.layout.edits?.parts || [])if(edit.id!==id)remaining.push(edit);
        if(remaining.length)room.layout.edits={version:1,parts:remaining};else delete room.layout.edits;
        const prior=[];for(const part of room.primitives)if(part.id!==id)prior.push(part);
        const compiled=root.FrontierRoomLayout.compile(room.layout,room.layout.materials||{},prior), independent=[];
        for(const part of room.primitives)if(part.layoutGroup!=="grid-layout")independent.push(part);
        room.primitives=independent.concat(compiled.primitives);
      });
    }
    /* @function authoringScene.history — Inputs: none. Returns current scene history lengths for UI availability. Does not expose snapshots, create history or combine map/template/default histories. */
    function history() { return api.history ? {...api.history()} : {undo:0,redo:0}; }
    /* @function authoringScene.presentation — Inputs: optional validated cell-camera draft. Returns copied current settings when reading, or transaction success when writing. Rejects playtest writes; changing projection preserves room geometry and event state and participates in normal Undo. */
    function presentation(value){if(value===undefined)return root.FrontierIsometric.validate(api.world().presentation);if(!api.editing())return false;const checked=root.FrontierIsometric.validate(value);return api.mutate(/* @function authoringScene.commitCamera — Inputs: none. Stores copied cell presentation inside existing validation/history boundary; rollback retains old camera on failure. */function(){api.world().presentation=checked;});}
    /* @function authoringScene.project163 — Inputs: world-metre XYZ. Returns current logical viewport point or null; no authored mutation, caches or history. Host owns camera/projection and runtime-mode gating. */
    function project163(x,y,z){return api.project ? api.project(x,y,z) : null;}
    /* @function authoringScene.transform163 — Inputs: typed reference, move/rotate, axis 0/1/2 and finite delta (metres or radians). Returns single validated history commit. Camera-facing sprites keep their locked presentation; rotation applies only to actual structural/model geometry and door arrival orientation. Unsupported axes fail explicitly rather than silently losing edits. */
    function transform163(ref,mode,axis,delta){
      if(!Number.isFinite(delta)||![0,1,2].includes(axis))throw Error("Invalid transform delta.");
      const value=snapshot(ref);if(!value)throw Error("Selection is stale.");
      if(mode==="move"){
        const key=axis===0?"x":axis===1?"y":ref.kind==="primitive"?"z":ref.kind==="event"?"heightOffset":ref.kind==="object"?"elevation":null;
        if(!key)throw Error("This element supports horizontal movement only.");
        return update(ref,{[key]:(value[key]||0)+(key==="elevation"?Math.round(delta/0.3):delta)});
      }
      if(mode!=="rotate")throw Error("Choose Move or Rotate.");
      if(ref.kind==="primitive" && axis===2)return update(ref,{yaw:(value.yaw||0)+delta});
      if(ref.kind!=="event" || !value.spatial)throw Error("Rotation is available for structural surfaces and spatial events; billboard props retain their camera-facing presentation.");
      const spatial=structuredClone(value.spatial);spatial.rotation=spatial.rotation||[0,0,0];spatial.rotation[axis]+=delta*180/Math.PI;
      if(value.extensions?.hub?.kind==="door" && axis===2){
        return api.mutate(/* @function authoringScene.rotateDoor163 — Inputs: none. Updates model rotation and authored walkable-side arrival facing in one transaction; failures roll back both. */function(){const door=resolve(api.world(),api.active(),ref);door.spatial=spatial;if(door.extensions.hub.arrivalYaw!==undefined)door.extensions.hub.arrivalYaw-=delta*180/Math.PI;});
      }
      return update(ref,{spatial});
    }
    /* @function authoringScene.appearance163 — Inputs: optional per-map appearance draft. Returns copied effective defaults or an undoable validated commit. Authored map/local/normal lighting is untouched; runtime writes reject. */
    function appearance163(value){if(value===undefined)return root.FrontierLocalLighting.appearance163(api.world().appearance);if(!api.editing())return false;const checked=root.FrontierLocalLighting.appearance163(value);return api.mutate(/* @function authoringScene.commitAppearance163 — Inputs: none. Writes only isolated appearance inside the owner's rollback/history boundary; no source assets are processed. */function(){api.world().appearance=checked;});}
    /* @function authoringScene.fog163 — Inputs: optional distance-fog draft. Returns validated effective settings, or one owner history commit; units are metres and colors #RRGGBB. Does not change sky grading or light sources. */
    function fog163(value){if(value===undefined)return root.FrontierFog.validate(api.world().fog);if(!api.editing())return false;const checked=root.FrontierFog.validate(value);return api.mutate(/* @function authoringScene.commitFog163 — Inputs: none. Saves validated fog with migration marker so explicit disabled settings remain disabled after reload. */function(){api.world().fog=checked;api.world().atmosphereVersion=1;});}
    /* @function authoringScene.anchor163 — Inputs: typed reference. Returns copied current world anchor or null for stale selection. Host supplies runtime-supported elevation without exposing mutable entities. */
    function anchor163(ref){const record=snapshot(ref);return record ? (api.anchor?api.anchor(ref,record):[record.x,record.y,record.z||0]) : null;}
    /* @function authoringScene.paletteDither168 — Inputs: optional original-plugin settings. Returns validated copied settings or one undoable map commit; play mode rejects edits. */
    function paletteDither168(value){if(value===undefined)return root.FrontierPaletteDither.validate(api.world().paletteDither);if(!api.editing())return false;const checked=root.FrontierPaletteDither.validate(value);return api.mutate(/* @function authoringScene.commitPalette168 — Inputs: none. Writes validated map effect only inside normal history/save transaction. */function(){api.world().paletteDither=checked;});}
    /* @function authoringScene.shadows169 — Inputs: optional shared strength draft. Returns current cell's effective pair or delegates one all-current-maps edit to the project owner. No runtime writes or competing shadow renderer. */
    function shadows169(value){return value===undefined?root.FrontierLocalLighting.shadows169(api.world().lighting?.shadows):api.shadows(value);}
    /* @function authoringScene.weapons169 — Inputs: optional native weapon overrides. Returns copied project settings or delegates a validated project edit; no duplicate registry or combat state is created. */
    function weapons169(value){return api.weapons(value);}
    /* @function authoringScene.visibility169 — Inputs: optional isometric reveal draft. Returns effective copied options or one validated map transaction; perspective, fixed artwork, collision and runtime targeting remain untouched. */
    function visibility169(value){if(value===undefined)return root.FrontierIsometricVisibility169.validate(api.world().visibility169);if(!api.editing())return false;const checked=root.FrontierIsometricVisibility169.validate(value);return api.mutate(/* @function authoringScene.commitVisibility169 — Inputs: none. Writes only map visibility options inside existing scene Undo/rollback boundary. */function(){api.world().visibility169=checked;});}
    /* @function authoringScene.cellKind169 — Inputs: none. Returns fixed/geometry/terrain representation for editor eligibility messages without conflating cell rendering with camera mode. */
    function cellKind169(){return api.world().interior?.mode||"terrain";}
    /* @function authoringScene.melee169 — Inputs: optional map-local melee draft. Returns copied validated melee rules or commits through ordinary scene history. Preserves the deliberate map-local Cerebral owner and all other proximity settings; no project firearm inheritance is invented. */
    function melee169(value){if(value===undefined)return structuredClone(root.FrontierCerebral.validate(api.world().cerebral).melee);if(!api.editing())return false;const checked=root.FrontierCerebral.validate({...api.world().cerebral,melee:value});return api.mutate(/* @function authoringScene.commitMelee169 — Inputs: none. Writes validated map-local rules inside existing scene rollback/history. */function(){api.world().cerebral=checked;});}
    /* @function authoringScene.bounds169 — Inputs: none. Returns current map XY extent in metres for the shared plan, without exposing mutable source data. */
    function bounds169(){const w=api.world();return {width:w.width??w.size,height:w.height??w.size};}
    /* @function authoringScene.moveMany169 — Inputs: typed selections and finite XY delta in metres. Returns one atomic scene-history commit, rejects stale targets or play mode. Keeps height/rotation/material/event ownership unchanged; generator overrides are captured by the existing owner. */
    function moveMany169(refs,dx,dy){if(!api.editing())return false;if(!Number.isFinite(dx)||!Number.isFinite(dy))throw Error("Invalid move.");for(const ref of refs)if(!resolve(api.world(),api.active(),ref))throw Error("Selection is stale.");return api.mutate(/* @function authoringScene.commitMoveMany169 — Inputs: none. Moves actual selected source records together in one validated transaction; rollback handles map bounds or collision validation. */function(){for(const ref of refs){const r=resolve(api.world(),api.active(),ref);r.x+=dx;r.y+=dy;}});}
    return {editEvent:api.editEvent,bounds169,moveMany169,melee169,cellKind169,visibility169,weapons169,shadows169,paletteDither168,selection,select,snapshot,update,remove,subscribe,refresh,list,detach,restoreGenerated,generatedEdits,history,presentation,project163,transform163,appearance163,fog163,anchor163};
  }
  root.FrontierAuthoringScene = {entries,resolve,create};
})(typeof window === "undefined" ? globalThis : window);
