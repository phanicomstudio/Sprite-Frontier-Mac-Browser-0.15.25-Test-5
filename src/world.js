/* MAINTAINER GUIDE
 * Seeded world generation and import validation. This prototype deliberately accepts 48x48 worlds. Add map-size support consistently here, in terrain, movement bounds, editor placement and save validation.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function(root){
'use strict'  ;
  const kinds=['tree','rock','monster','ruin'];
// Hash the seed and return a deterministic random stream. Keep generator order stable if old seeds must reproduce worlds.
  function rng(seed){
    let s=2166136261;
    for(const c of String(seed))s=Math.imul(s^c.charCodeAt(0),16777619);
    return()=>{
      s+=0x6D2B79F5;
      let t=Math.imul(s^s>>>15,s|1);
      t^=t+Math.imul(t^t>>>7,t|61);
      return((t^t>>>14)>>>0)/4294967296;
    }
    ;
  }
// Instantiate a prop using canonical project definitions; imported values cannot override tuned collision dimensions.
  function entity(kind,x,y,id){
    const d=root.FrontierProject.definitions[kind];
    return {
      id,kind,x,y,radius:d.radius,height:d.height
    }
    ;
  }
// Scatter seeded props with clearance around spawn, then create a ring of demonstration enemies.
  function generate(seed){
    const random=rng(seed),world={
      schemaVersion:'sprite-frontier/1',seed:String(seed),size:48,spawn:{
        x:24,y:24
      }
      ,objects:[]
    }
    ;
    for(let i=0;
    i<230;
    i++){
      const x=2+random()*44,y=2+random()*44;
      if(Math.hypot(x-24,y-24)<4)continue;
      const r=random(),kind=r<.68?'tree':r<.93?'rock':'ruin';
      if(world.objects.some(e=>Math.hypot(e.x-x,e.y-y)<e.radius+1))continue;
      world.objects.push(entity(kind,x,y,'prop-'+i));
    }
    for(let i=0;
    i<9;
    i++){
      const a=i*Math.PI*2/9,x=24+Math.sin(a)*9,y=24+Math.cos(a)*9;
      world.objects=world.objects.filter(e=>Math.hypot(e.x-x,e.y-y)>1.5);
      world.objects.push(entity('monster',x,y,'sentinel-'+i));
    }
    return world;
  }
// Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields.
  function validate(w){
    if(!w||w.schemaVersion!=='sprite-frontier/1'||typeof w.seed!=='string'||w.seed.length>100||w.size!==48||!Array.isArray(w.objects)||w.objects.length>1500)throw Error('Expected a Sprite Frontier v1 world (48 × 48, at most 1500 objects).');
    const ids=new Set();
    const inside=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=1&&p.y>=1&&p.x<=47&&p.y<=47;
    if(!inside(w.spawn))throw Error('Spawn is outside the world.');
    const result={
      schemaVersion:w.schemaVersion,seed:w.seed,size:48,spawn:{
        x:w.spawn.x,y:w.spawn.y
      }
      ,objects:w.objects.map(e=>{
        if(!e||typeof e.id!=='string'||!e.id||e.id.length>100||ids.has(e.id)||!kinds.includes(e.kind)||!inside(e))throw Error('Invalid object, position or duplicate ID.');
        ids.add(e.id);
        const elevation=e.elevation??0;
        if(!Number.isInteger(elevation)||Math.abs(elevation)>100)throw Error('Elevation must be an integer from -100 to 100 feet.');
        return {...entity(e.kind,e.x,e.y,e.id),elevation};
      }
      )
    }
    ;
    if(result.objects.some(e=>(e.elevation||0)*.3<1.65&&(e.elevation||0)*.3+e.height>0&&Math.hypot(e.x-result.spawn.x,e.y-result.spawn.y)<e.radius+.3))throw Error('An object blocks the player spawn.');
    result.events=root.FrontierEvents.validate(w.events===undefined?[]:w.events,new Set(["player",...result.objects.map(e=>e.id)]));
    if(result.events.some(e=>(e.elevation||0)*.3<1.65&&(e.elevation||0)*.3+1.65>0&&e.pages.some(p=>p.solid&&!p.through&&p.priority==='normal')&&Math.hypot(e.x-result.spawn.x,e.y-result.spawn.y)<.55))throw Error("A solid event blocks the player spawn.");
    result.terrain=root.FrontierTerrain.validate(w.terrain);
    result.sky=root.FrontierSky.validate(w.sky);
    if(root.FrontierParameters)result.parameters=root.FrontierParameters.validate(w.parameters);
    if(root.FrontierMusic)result.music=root.FrontierMusic.validate(w.music);
    if(w.assetCatalog){result.assetCatalog={};for(const category of ['exploration','combat']){const names=w.assetCatalog[category];if(!Array.isArray(names)||names.length>500||names.some(n=>typeof n!=='string'||n.includes('..')||/[\\/:]/.test(n)||!/^.+\.(ogg|mp3|wav|m4a|webm)$/i.test(n)))throw Error('Invalid asset catalog.');result.assetCatalog[category]=[...new Set(names)];}}
    return result;
  }
  root.FrontierWorld={
    rng,entity,generate,validate
  }
  ;
}
)(typeof window==='undefined'?globalThis:window);
