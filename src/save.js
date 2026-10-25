/* MAINTAINER GUIDE
 * Pure playtest-save validation. Whitelists scalar player data and checks map entry arrays before the application replaces live state. Equip reconstructs weapon objects from saved IDs.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Playtest file boundary. Keep validation pure so bad imports cannot partly
 * reset the world. Extend both this whitelist and app.js when adding saved state.
 * Transient projectiles, particles and in-progress event commands are not saved. */
(function(root){
'use strict'  ;
// Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields.
  function validate(save){
    if(save?.schema!=='phanicom-playtest/1')throw Error('Invalid playtest save.');
    const world=root.FrontierWorld.validate(save.world),p=save.player;
    if(!p||!root.PhanicomABS.weapons.has(p.weapon))throw Error('Unknown saved weapon.');
    for(const [key,min,max] of [['x',.5,47.5],['y',.5,47.5],['hp',0,100],['ammoLoaded',0,999],['ammoReserve',0,1000000]]){
      if(!Number.isFinite(p[key])||p[key]<min||p[key]>max)throw Error('Invalid player '+key+'.');
    }
    if(!Number.isInteger(p.ammoLoaded)||!Number.isInteger(p.ammoReserve))throw Error('Ammunition must be whole rounds.');
    if(!['normal','sprite','gib','damage'].includes(p.deathMode))throw Error('Invalid death mode.');
    const blood=save.blood;
    if(!blood||typeof blood.hidden!=='boolean'||!blood.actors||Array.isArray(blood.actors)||typeof blood.actors!=='object')throw Error('Invalid blood state.');
    for(const type of Object.values(blood.actors))root.PhanicomBlood.resolve(type);
    const result={
      schema:save.schema,world,player:{
        x:p.x,y:p.y,hp:p.hp,ammoLoaded:p.ammoLoaded,ammoReserve:p.ammoReserve,weapon:p.weapon,deathMode:p.deathMode
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
    return result;
  }
  root.FrontierSave={
    validate
  }
  ;
}
)(typeof window==='undefined'?globalThis:window);
