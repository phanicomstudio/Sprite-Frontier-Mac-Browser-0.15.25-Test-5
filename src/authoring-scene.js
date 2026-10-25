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
          generated:kind === "primitive" && record.layoutGroup === "grid-layout",
          role:record.moduleType || kind, model:kind === "event" && !!record.spatial?.model});
      }
    }
    return result;
  }
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
      for(const ref of selected) {const record=resolve(api.world(),cell,ref);if(record)fresh.push({...ref,name:record.name||record.id,role:record.moduleType||ref.kind,generated:ref.kind==="primitive" && record.layoutGroup==="grid-layout"});}
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
      const allowed = ref.kind === "primitive" ? ["name","x","y","z","w","d","h","yaw","texture","tileSize","textureMapping","textureRotation","textureOffsetU","textureOffsetV","preserveAspect","color"] : ["name","x","y"];
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
    function generatedEdits() { return structuredClone(api.world().interior?.layout?.edits?.parts || []); }
    /* @function authoringScene.detach — Inputs: typed generated primitive reference. Returns commit boolean; preserves effective geometry/material/collision under a new independent identity, suppressing original through transaction capture. Selection follows the new independent part. Rejects stale or non-generated targets. */
    function detach(ref) {
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
    return {selection,select,snapshot,update,remove,subscribe,refresh,list,detach,restoreGenerated,generatedEdits,history};
  }
  root.FrontierAuthoringScene = {entries,resolve,create};
})(typeof window === "undefined" ? globalThis : window);
