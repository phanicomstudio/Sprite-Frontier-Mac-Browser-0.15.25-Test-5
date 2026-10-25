/* MAINTAINER GUIDE
 * Pure playtest-save validation. Whitelists scalar player data and checks map entry arrays before the application replaces live state. Equip reconstructs weapon objects from saved IDs.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Playtest file boundary. Keep validation pure so bad imports cannot partly
 * reset the world. Extend both this whitelist and app.js when adding saved state.
 * Transient projectiles, particles and in-progress event commands are not saved. */
(/* @function save.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier save. */ function(root){
'use strict'  ;
// Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields.
  /* @function save.validate.2 — Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields. Inputs: save. Updates: magazines at id; result at key; result project; result journey; result journal. Uses: error; root frontier world validate; root phanicom abs weapons has; number is finite. Returns: result. */ function validate(save){
    if(save?.schema!=='phanicom-playtest/1')throw Error('Invalid playtest save.');
    const world=root.FrontierWorld.validate(save.world),p=save.player;
    if(!p||!root.PhanicomABS.weapons.has(p.weapon))throw Error('Unknown saved weapon.');
    for(const [key,min,max] of [['x',.5,(world.width??world.size)-.5],['y',.5,(world.height??world.size)-.5],['hp',0,100],['ammoLoaded',0,999],['ammoReserve',0,1000000]]){
      if(!Number.isFinite(p[key])||p[key]<min||p[key]>max)throw Error('Invalid player '+key+'.');
    }
    if(!Number.isInteger(p.ammoLoaded)||!Number.isInteger(p.ammoReserve))throw Error('Ammunition must be whole rounds.');
    if(!['normal','sprite','gib','damage'].includes(p.deathMode))throw Error('Invalid death mode.');
    if(p.z!==undefined&&(!Number.isFinite(p.z)||p.z< -30||p.z>100))throw Error('Invalid saved altitude.');
    if(p.holstered!==undefined&&typeof p.holstered!=='boolean')throw Error('Invalid holster state.');
    const cerebral=p.cerebral??world.cerebral?.max??100;if(!Number.isFinite(cerebral)||cerebral<0||cerebral>(world.cerebral?.max??100))throw Error('Invalid saved Cerebral');
    const magazines={};for(const [id,rounds]of Object.entries(p.magazines||{})){if(!root.PhanicomABS.weapons.has(id)||!Number.isInteger(rounds)||rounds<0||rounds>999)throw Error('Invalid saved magazine');magazines[id]=rounds;}
    const blood=save.blood;
    if(!blood||typeof blood.hidden!=='boolean'||!blood.actors||Array.isArray(blood.actors)||typeof blood.actors!=='object')throw Error('Invalid blood state.');
    for(const type of Object.values(blood.actors))root.PhanicomBlood.resolve(type);
    const result={
      schema:save.schema,world,...(root.FrontierEventState?root.FrontierEventState.validate(save):{}),player:{
        x:p.x,y:p.y,holstered:p.holstered??false,...(p.z===undefined?{}:{z:p.z}),hp:p.hp,cerebral,magazines,ammoLoaded:p.ammoLoaded,ammoReserve:p.ammoReserve,weapon:p.weapon,deathMode:p.deathMode
      }
      ,blood:structuredClone(blood)
    }
    ;
// Maps are JSON entry arrays. Never accept arbitrary properties into player
// objects; this also prevents imported data from replacing engine methods.
    for(const key of ['switches','variables','selfSwitches','inventory']){
      const entries=save[key]||[];
      if(!Array.isArray(entries)||entries.length>2000)throw Error('Invalid '+key+'.');
      for(const entry of entries){
        if(!Array.isArray(entry)||entry.length!==2||typeof entry[0]!=='string'||entry[0].length>160)throw Error('Invalid '+key+' entry.');
        if(['switches','selfSwitches'].includes(key)?typeof entry[1]!=='boolean':!Number.isFinite(entry[1]))throw Error('Invalid '+key+' value.');
      }
      result[key]=structuredClone(entries);
    }
    if(save.project!==undefined){result.project=root.FrontierMaps.validate(save.project);if(!Array.isArray(save.journey)||save.journey.length>32||!Array.isArray(save.journal)||save.journal.length>1000)throw Error('Invalid journey or journal.');const seen=new Set();result.journey=save.journey.map(/* @function save.callback.3 — Provides the callback for save journey map. Inputs: entry. Uses: array is array; seen has; error; seen add. Returns: a list of entry at 0, a record containing copied fields, copied fields, replacements, copied fields, copied fields, copied fields, copied fields, player. */ entry=>{if(!Array.isArray(entry)||entry.length!==2||seen.has(entry[0]))throw Error('Invalid map state.');seen.add(entry[0]);const m=result.project.maps.find(/* @function save.callback.4 — Returns m id equals entry at 0. Inputs: m. Returns: m id equals entry at 0. */ m=>m.id===entry[0]);if(!m)throw Error('Saved map missing from project.');const v=entry[1];if(!v||!Array.isArray(v.actors)||v.actors.length>21000||!Array.isArray(v.events)||v.events.length>1000||typeof v.player?.holstered!=='boolean')throw Error('Invalid saved actors.');const core=validate({schema:'phanicom-playtest/1',world:m.world,player:{...v.player,x:m.world.spawn.x,y:m.world.spawn.y,deathMode:'normal'},blood:save.blood,switches:v.switches,variables:v.variables,selfSwitches:v.selfSwitches,inventory:v.inventory,partyActors:v.partyActors,quests:v.quests,skills:v.skills,reputation:v.reputation,factions:v.factions,timer:v.timer,gold:v.gold});for(const a of [...v.actors,...v.events])if(typeof a.id!=='string'||a.id.length>100||!Number.isFinite(a.x)||!Number.isFinite(a.y)||a.x<.5||a.y<.5||a.x>m.world.width-.5||a.y>m.world.height-.5)throw Error('Invalid saved actor position.');for(const a of v.actors)if(!Number.isFinite(a.hp)||a.hp<0||typeof a.dead!=='boolean'||typeof a.gibbed!=='boolean')throw Error('Invalid saved actor health.');const replacements=root.FrontierEventTemplates.references(v.replacements,result.project.templates,m.world.events);const effective=m.world.events.map(/* @function save.callback.5 — Provides the callback for m world events map. Inputs: event. Uses: replacements find; result project templates entries find. Returns: reference selects a record containing copied fields, pages or event. */ event=>{const reference=replacements.find(/* @function save.callback.6 — Returns r id equals event id. Inputs: r. Returns: r id equals event id. */ r=>r.id===event.id);return reference?{...event,pages:result.project.templates.entries.find(/* @function save.callback.7 — Returns t id equals reference template. Inputs: t. Returns: t id equals reference template. */ t=>t.id===reference.template).event.pages}:event;});const behaviors=v.behaviors===undefined?undefined:root.FrontierActorBehavior.bindings(v.behaviors,effective,m.world);return [entry[0],{...(root.FrontierEventState?root.FrontierEventState.validate(core):{}),...(behaviors===undefined?{}:{behaviors}),replacements,...(v.screenFade===undefined?{}:{screenFade:root.FrontierScreenFade.validate(v.screenFade)}),...(v.screenFlash===undefined?{}:{screenFlash:root.FrontierScreenFlash.validate(v.screenFlash)}),...(v.screenShake===undefined?{}:{screenShake:root.FrontierScreenShake.validate(v.screenShake)}),...(v.screenTone===undefined?{}:{screenTone:root.FrontierScreenTone.validate(v.screenTone)}),player:{...core.player,holstered:v.player.holstered},switches:core.switches,variables:core.variables,inventory:core.inventory,selfSwitches:core.selfSwitches,actors:v.actors.map(/* @function save.callback.8 — Returns a record containing id, x, y, hp, dead, gibbed. Inputs: a. Returns: a record containing id, x, y, hp, dead, gibbed. */ a=>({id:a.id,x:a.x,y:a.y,hp:a.hp,dead:a.dead,gibbed:a.gibbed})),events:v.events.map(/* @function save.callback.9 — Returns a record containing id, x, y. Inputs: a. Returns: a record containing id, x, y. */ a=>({id:a.id,x:a.x,y:a.y}))}];});result.journal=save.journal.map(/* @function save.callback.10 — Provides the callback for save journal map. Inputs: e. Uses: array is array; error. Returns: a list of spread element. */ e=>{if(!Array.isArray(e)||e.length!==2||typeof e[0]!=='string'||e[0].length>60||typeof e[1]!=='string'||e[1].length>2000)throw Error('Invalid journal text.');return [...e];});}
    if(root.FrontierHubState)result.hubs=root.FrontierHubState.validate(save.hubs);
    return result;
  }
  root.FrontierSave={
    validate
  }
  ;
}
)(typeof window==='undefined'?globalThis:window);


