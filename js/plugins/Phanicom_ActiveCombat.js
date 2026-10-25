/* MAINTAINER GUIDE
 * Native Phanicom_ActiveCombat runtime integration. This host adapts supplied behavior into world XYZ; source-specific engine hooks are listed in PLUGIN-PORT.md.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Native Frontier host for the supplied ActiveCombat parsers and mechanics. */
(function(root){
'use strict'  ;
  const MF=root.MF,core=root.PhanicomCombatCore,params=root.PhanicomPluginSettings.combat;
  const weapons=new Map();
  for(const profile of core.profiles){
    const item=root.PhanicomPluginSettings.items.find(i=>i.name===profile.displayName)||{
      id:0,name:profile.displayName,note:'<PhanicomABSWeapon: equipSwitch=1 profile='+profile.id+'>'
    }
    ;
    const cfg=core.parseWeaponItem(item);
    weapons.set(profile.id,{
      ...cfg,id:profile.id,profileId:profile.id,magazineSize:12,projectile:{
        speed:cfg.speed,radius:cfg.radius,range:cfg.range,lifetime:cfg.range/cfg.speed,tracerColor:cfg.tracerColor,tracerLife:cfg.tracerLife
      }
      ,firingModel:cfg.type==='hitscan'?'hitscan':'projectile',projectileSpeed:cfg.speed,projectileRadius:cfg.radius,maxRange:cfg.range,projectileLifetime:cfg.range/cfg.speed,tracer:{
        color:cfg.tracerColor,life:cfg.tracerLife
      }
      ,damageType:cfg.family
    }
    );
  }
// Clone a parsed weapon profile into player state; clamp loaded rounds and cancel queued bursts.
  function equip(game,id){
    const weapon=weapons.get(id);
    if(!weapon)throw Error('Unknown weapon profile.');
    game.player.weapon=structuredClone(weapon);
    game.player.ammoLoaded=Math.min(game.player.ammoLoaded,weapon.magazineSize);
    game.combatCooldown=0;
    game.burst=null;
    return weapon;
  }
// Emit melee, shotgun or single-projectile patterns from calibrated origins, with bounded projectile/flash counts.
  function pattern(game,owner,weapon,base,ui){
    if(weapon.type==='melee'){
      let count=0;
      for(const e of owner.id===game.player.id?[...game.maps.frontier.entities,...(game.sceneEvents||[])]:[game.player]){
        if(e.id===owner.id||e.dead||e.hp<=0||owner.id===game.player.id&&e.type!=='monster')continue;
        const dx=e.x-owner.x,dy=e.y-owner.y,dist=Math.hypot(dx,dy);
        if(dist<=weapon.range&&(dx*base.x+dy*base.y)/Math.max(.001,dist)>=Math.cos(weapon.arcRadians/2)){
          MF.resolveProjectileImpact(game,{
            ownerId:owner.id,weaponId:weapon.id,damage:weapon.damage,damageType:'melee',direction:base,position:{
              x:e.x,y:e.y,z:(e.z||0)+.8
            }
          }
          ,{
            id:e.id,kind:'body'
          }
          ,ui);
          if(++count>=weapon.maxTargets)break;
        }
      }
      return;
    }
    const directions=weapon.type==='shotgun'?core.shotgunDirections(base,Math.min(64,weapon.pellets),weapon.spreadRadians):[core.applySpread(base,weapon.spreadRadians)];
    let first;
    for(const direction of directions){
      if(game.projectiles.length>=256)break;
      const p=MF.createProjectile(game,owner,weapon,direction);
      p.penetration=weapon.penetration;
      p.hitIds=new Set();
      p.profileId=weapon.profileId;
      first??=p;
      if(weapon.firingModel==='hitscan')MF.resolveHitscan(game,p,ui);
      else game.projectiles.push(p);
    }
    if(first){
      const point=FrontierMuzzle.point(owner,game,true)||first.position;
      game.muzzleFlashes.push({
        ...point,color:weapon.tracerColor,life:.085,maxLife:.085,map:game.currentMapId
      }
      );
      if(game.muzzleFlashes.length>32)game.muzzleFlashes.shift();
    }
  }
// Prefer an available explicit SE; otherwise use the original procedural weapon sound profile.
  function sound(game,weapon,owner){
// The source project refers to Laser1/2 but did not supply those stock MZ
// files. Use explicit supplied beam sounds instead of silently dropping audio.
    const aliases={
      Laser1:'Beam Weapon',Laser2:'Beam Weapon 2'
    }
    ,name=root.PhanicomSE.has(weapon.sound)?weapon.sound:aliases[weapon.sound];
    if(name&&root.PhanicomSE.has(name))root.PhanicomSE.play(name,(weapon.volume??90)/100,(weapon.pitch??100)/100);
    else core.playGoldenEyeProfile(weapon.audioProfile,weapon.audioVolume);
  }
// Enforce holster/alive/cooldown/ammunition rules, emit one attack and set its firing cadence.
  function shot(game,ui,burst=false){
    const p=game.player,w=p.weapon;
    if(!w||p.holstered||p.hp<=0||(!burst&&(game.combatCooldown||0)>0))return false;
    const cost=w.ammoCost??1;
    if(!game.debug?.infiniteAmmo&&p.ammoLoaded<cost){
      root.PhanicomSE.play(w.emptySound||'Out of ammo');
      game.combatCooldown=Number(params.DryFireCooldown||10)/60;
      game.burst=null;
      ui.log('Empty magazine — reload.');
      return false;
    }
    if(!game.debug?.infiniteAmmo)p.ammoLoaded-=cost;
    pattern(game,p,w,{
      x:Math.sin(game.camera.yaw),y:Math.cos(game.camera.yaw)
    }
    ,ui);
    sound(game,w,p);
    game.combatCooldown=(w.fireMode==='auto'?w.fireRate:w.cooldown)/60;
    return true;
  }
  MF.fireShot=(game,x,y,ui)=>{
    if(game.burst)return false;
    const ok=shot(game,ui);
    if(ok&&game.player.weapon.fireMode==='burst'){
      const w=game.player.weapon;
      game.burst={
        weapon:w.id,left:Math.min(32,w.burstCount)-1,timer:w.burstDelay/60
      }
      ;
    }
    return ok;
  }
  ;
  // Countdown cooldown/burst in seconds; automatic fire reads held input while semi fire is edge-triggered by app.js.
 function update(game,dt,held){
    game.combatCooldown=Math.max(0,(game.combatCooldown||0)-dt);
    const b=game.burst;
    if(b){
      if(game.player.holstered||game.player.weapon.id!==b.weapon){
        game.burst=null;
        return;
      }
      b.timer-=dt;
      if(b.timer<=0){
        if(shot(game,game.ui,true)&&--b.left>0)b.timer+=game.player.weapon.burstDelay/60;
        else game.burst=null;
      }
    }
    else if(held&&game.player.weapon?.fireMode==='auto')shot(game,game.ui);
  }
  const originalImpact=MF.resolveProjectileImpact;
  // Preserve inherited damage handling, then replace only its blood visuals and apply native death/self-switch/kill-feed side effects.
 MF.resolveProjectileImpact=(game,p,hit,ui)=>{
    const target=game.runtime.entities.get(hit.id),before=target?.hp;
    const particles=game.particles.length;
    originalImpact(game,p,hit,ui);
    if(target&&before>target.hp){
      root.FrontierAggro?.provoke(game,target.id);
      game.particles.length=particles;
      root.PhanicomBlood.damage(game,target,p);
      if(target.hp<=0){
        root.PhanicomBlood.death(game,target,p,before);
        const names=JSON.parse(params.KillFeedMessages||'["{killer} fragged {victim}"]');
        let messages=names;
        for(const raw of JSON.parse(params.KillFeedWeaponRules||'[]')){
          const r=typeof raw==='string'?JSON.parse(raw):raw;
          if(r.WeaponKey===p.profileId)messages=JSON.parse(r.Messages);
        }
        const line=String(messages[Math.floor(Math.random()*messages.length)]||'{killer} defeated {victim}').replaceAll('{killer}',p.ownerId===game.player.id?'Candy':'Sentinel').replaceAll('{victim}',target.name||target.id).replaceAll('{weapon}',weapons.get(p.profileId)?.name||p.weaponId);
        if(params.KillFeedEnabled!=='false')ui.log(line);
        if(target.eventId)game.eventSession?.state.selfSwitches.set(target.eventId+':'+(target.gibbed?'B':'A'),true);
      }
    }
  }
  ;
  root.PhanicomABS={
    weapons,equip,update,pattern,parseWeapon:core.parseWeaponItem,parseEvent:core.parseCombatEvent,
    setPlayerDeathMode(game,mode){
      if(!['normal','sprite','gib','damage'].includes(mode))throw Error('Invalid death mode.');
      game.deathMode=mode;
    }
    ,
    exportState(game){
      return {
        weapon:game.player.weapon.id,ammoLoaded:game.player.ammoLoaded,ammoReserve:game.player.ammoReserve,hp:game.player.hp,deathMode:game.deathMode||params.PlayerDeathMode
      }
      ;
    }
  }
  ;
}
)(window);
