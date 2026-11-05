/* MAINTAINER GUIDE
 * Native Phanicom_ActiveCombat runtime integration. This host adapts supplied behavior into world XYZ; source-specific engine hooks are listed in PLUGIN-PORT.md.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Native Frontier host for the supplied ActiveCombat parsers and mechanics. */
(/* @function Phanicom_ActiveCombat.callback.1 — Provides the callback for a callback. Inputs: root. Updates: mf fire shot; mf resolve projectile impact; root phanicom abs. Uses: root phanicom plugin settings items find; core parse weapon item; weapons set. */ function(root){
'use strict'  ;
  const MF=root.MF,core=root.PhanicomCombatCore,params=root.PhanicomPluginSettings.combat;
  const weapons=new Map();
  for(const profile of core.profiles){
    const item=root.PhanicomPluginSettings.items.find(/* @function Phanicom_ActiveCombat.callback.2 — Returns i name equals profile display name. Inputs: i. Returns: i name equals profile display name. */ i=>i.name===profile.displayName)||{
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
  /* @function Phanicom_ActiveCombat.equip.3 — Clone a parsed weapon profile into player state; clamp loaded rounds and cancel queued bursts. Inputs: game; id. Updates: game player weapon; game player magazines; game player magazines at game player previous weapon; game player ammo loaded; game player previous weapon. Uses: weapons get; error; structured clone. Returns: weapon. */ function equip(game,id){
    const weapon=weapons.get(id);
    if(!weapon)throw Error('Unknown weapon profile.');
    game.player.weapon=structuredClone(weapon);
    // Preserve each weapon magazine while switching pistol/melee profiles.
    game.player.magazines||={};if(game.player.previousWeapon)game.player.magazines[game.player.previousWeapon]=game.player.ammoLoaded;
    game.player.ammoLoaded=game.player.magazines[id]??Math.min(game.player.ammoLoaded,weapon.magazineSize);game.player.previousWeapon=id;
    game.combatCooldown=0;
    game.burst=null;
    return weapon;
  }
// Emit melee, shotgun or single-projectile patterns from calibrated origins, with bounded projectile/flash counts.
  /* @function Phanicom_ActiveCombat.pattern.4 — Emit melee, shotgun or single-projectile patterns from calibrated origins, with bounded projectile/flash counts. Inputs: game; owner; weapon; base; ui. Updates: p penetration; p hit ids; p profile id; first. Uses: root frontier activity query; mf resolve projectile impact; root frontier weapon tuning radians; core shotgun directions. Returns: without a result. */ function pattern(game,owner,weapon,base,ui){
    // October 22: NPC-authored profiles inherit projectile motion/impact
    // policies without replacing their explicitly authored damage/cadence.
    if(owner.id!==game.player.id){const preset=root.PhanicomABS?.weapons.get(weapon.profileId);if(preset)weapon={...weapon,gravity:weapon.gravity??preset.gravity,launchLift:weapon.launchLift??preset.launchLift,blastRadius:weapon.blastRadius??preset.blastRadius,blastDamage:weapon.blastDamage??weapon.damage};}
    if(weapon.type==='melee'){
      let count=0;
      for(const e of owner.id===game.player.id?root.FrontierActivity.query(game,owner.x-weapon.range,owner.y-weapon.range,owner.x+weapon.range,owner.y+weapon.range,true):[game.player]){
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
    // October 22: event enemies own finite ammunition and share the actual arsenal.
    if(owner.enemyConfig){weapon=root.FrontierEnemies.fire(game,owner,weapon);if(!weapon)return;}
    if(owner.id===game.player.id)weapon=root.FrontierArsenal?.dischargeWeapon(game,weapon)||weapon;
    const spread=root.FrontierWeaponTuning.radians(game.sourceWorld,weapon);
    const directions=weapon.type==='shotgun'?core.shotgunDirections(base,Math.min(64,weapon.pellets),spread):[core.applySpread(base,spread)];
    let first;
    for(const direction of directions){
      if(game.projectiles.length>=256)break;
      const p=MF.createProjectile(game,owner,weapon,direction);
      p.penetration=weapon.penetration;
      p.hitIds=new Set();
      p.profileId=weapon.profileId;
      first??=p;
      // October 22, 2026: every discharge has finite travel; old hitscan and
      // penetration settings are historical and cannot bypass physical impact.
      p.penetration=0; game.projectiles.push(p);
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
  /* @function Phanicom_ActiveCombat.sound.5 — Prefer an available explicit SE; otherwise use the original procedural weapon sound profile. Inputs: game; weapon; owner. Uses: root phanicom se has; root phanicom se play; core play golden eye profile. */ function sound(game,weapon,owner){
    // October 29: imported per-profile firing sounds use the same voice pool for players and enemies. Blank slots follow the untouched manifest/procedural path below.
    if(weapon.soundAsset&&root.PhanicomSE.weaponAsset169(weapon.id||weapon.profileId,weapon.soundAsset,(weapon.volume??90)/100,(weapon.pitch??100)/100,/* @function activeCombat.soundFallback169 — Inputs: media failure text ignored. Replays only the original default path once after asynchronous decode/play failure; does not retry custom bytes or change weapon state. */function(){sound(game,{...weapon,soundAsset:undefined},owner);}))return;
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
  /* @function Phanicom_ActiveCombat.shot.6 — Enforce holster/alive/cooldown/ammunition rules, emit one attack and set its firing cadence. Inputs: game; ui; assignment pattern. Updates: game combat cooldown; game burst; p firing until; p ammo loaded. Uses: root phanicom se play; number; ui log; mf update aim. Returns: false; false. */ function shot(game,ui,burst=false){
    const p=game.player,w=p.weapon;
    if(!w||p.holstered||p.hp<=0||(!burst&&(game.combatCooldown||0)>0))return false;
    root.FrontierArsenal?.prepare(game);
    const cost=root.FrontierArsenal?.cost(game,w)??w.ammoCost??1;
    if(!game.debug?.infiniteAmmo&&p.ammoLoaded<cost){
      root.PhanicomSE.play(w.emptySound||'Out of ammo');
      game.combatCooldown=Number(params.DryFireCooldown||10)/60;
      game.burst=null;
      ui.log('Empty magazine — reload.');
      return false;
    }
    // Align before muzzle calibration is read, including auto and burst shots.
    MF.updateAim(game);p.firingUntil=(game.elapsed||0)+.12;
    if(!game.debug?.infiniteAmmo)p.ammoLoaded-=cost;
    root.FrontierArsenal?.commitAmmo(game);
    pattern(game,p,w,{
      x:p.facingX,y:p.facingY
    }
    ,ui);
    sound(game,w,p);
    game.combatCooldown=(w.fireMode==='auto'?w.fireRate:w.cooldown)/60;
    return true;
  }
  MF.fireShot=/* @function Phanicom_ActiveCombat.fireShot.7 — Handles fire shot within phanicom active combat. Inputs: game; x; y; ui. Updates: game burst. Uses: shot. Returns: false; ok. */ (game,x,y,ui)=>{
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
 /* @function Phanicom_ActiveCombat.update.8 — Countdown cooldown/burst in seconds; automatic fire reads held input while semi fire is edge-triggered by app.js. Inputs: game; dt; held. Updates: game combat cooldown; game burst; b timer. Uses: shot. Returns: without a result. */ function update(game,dt,held){
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
 MF.resolveProjectileImpact=/* @function Phanicom_ActiveCombat.resolveProjectileImpact.9 — Handles resolve projectile impact within phanicom active combat. Inputs: game; p; hit; ui. Updates: game particles length; messages. Uses: game runtime entities get; root frontier party combat can damage; game runtime events emit; original impact. Returns: without a result. */ (game,p,hit,ui)=>{
    const target=game.runtime.entities.get(hit.id),before=target?.hp;
    if(!p.allowSelfDamage&&root.FrontierPartyCombat&&!root.FrontierPartyCombat.canDamage(game,game.runtime.entities.get(p.ownerId),target)){
      game.runtime.events.emit('projectile.impact',{projectileId:p.id,ownerId:p.ownerId,targetId:hit.id,kind:hit.kind,position:{...p.position},damageSuppressed:'party'});return;
    }
    const enemySwitches=target?.enemyConfig?root.FrontierEnemies.beforeImpact(game,target):null;
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
        if(target.enemyConfig)root.FrontierEnemies.defeated(game,target,enemySwitches);
      }
    }
  }
  ;
  root.PhanicomABS={
    playWeaponSound169:sound,weapons,equip,update,pattern,parseWeapon:core.parseWeaponItem,parseEvent:core.parseCombatEvent,
    /* @function Phanicom_ActiveCombat.setPlayerDeathMode.10 — Handles set player death mode within phanicom active combat. Inputs: game; mode. Updates: game death mode. Uses: a list of "normal", "sprite", "gib", "damage" includes; error. */ setPlayerDeathMode(game,mode){
      if(!['normal','sprite','gib','damage'].includes(mode))throw Error('Invalid death mode.');
      game.deathMode=mode;
    }
    ,
    /* @function Phanicom_ActiveCombat.exportState.11 — Handles export state within phanicom active combat. Inputs: game. Returns: a record containing weapon, ammoLoaded, ammoReserve, hp, deathMode. */ exportState(game){
      return {
        weapon:game.player.weapon.id,ammoLoaded:game.player.ammoLoaded,ammoReserve:game.player.ammoReserve,hp:game.player.hp,deathMode:game.deathMode||params.PlayerDeathMode
      }
      ;
    }
  }
  ;
}
)(window);
