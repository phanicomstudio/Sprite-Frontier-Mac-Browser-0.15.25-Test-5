/* October 22, 2026 — own-asset finite-projectile arsenal. Reference behavior
 * matches our OpenMW project where practical, not a Quake source-code port.
 * Original profiles remain; the added super-shotgun is a separate preset. */
(/* @function arsenal.install — Inputs: initialized browser host. Returns nothing; configures existing weapon archetypes, adds one missing variant and connects distinct inventory ammo pools. No Quake assets/code are loaded. Presets become the baseline before project overrides are adopted. */function(root){
  "use strict";
  const abs=root.PhanicomABS,MF=root.MF;
  const presets=[
    ['handgun','Pistol','ammo9',1,1,.25,40,4,0,0],
    ['shotgun','Shotgun','ammo-shells',6,1,.5,40,4,0,0],
    ['super_shotgun','Double shotgun','ammo-shells',14,2,.7,40,4,0,0],
    ['needle_gun','Needle Gun','ammo-nails',1,1,.1,40,9,0,0],
    ['heavy_machine_gun','Heavy Machine Gun','ammo-nails',1,2,.1,40,18,0,0],
    ['grenade','Grenade launcher','ammo-rockets',1,1,.6,28,120,32,9.6],
    ['rocket_launcher','Rocket Launcher','ammo-rockets',1,1,.8,40,110,0,9.6],
    ['beam_weapon','Beam Weapon','ammo-cells',1,1,.1,40,30,0,0]
  ];
  for(const [id,name,ammoPool,pellets,ammoCost,seconds,speed,damage,gravity,blastRadius]of presets){
    const inherited=abs.weapons.get(id)||abs.weapons.get('shotgun');
    const w={...structuredClone(inherited),id,profileId:id,name,ammoPool,pellets,ammoCost,speed,damage,gravity,blastRadius,blastDamage:damage,penetration:0,firingModel:'projectile',projectileSpeed:speed,projectileRadius:.015,maxRange:80,projectileLifetime:80/speed};
    w.type=pellets>1?'shotgun':'projectile';w.fireMode=['needle_gun','heavy_machine_gun','beam_weapon'].includes(id)?'auto':'semi';w.cooldown=w.fireRate=seconds*60;w.range=id==='beam_weapon'?24:id==='rocket_launcher'?200:240;w.radius=.015;
    if(id==='handgun')w.magazineSize=12;else w.magazineSize=999;
    w.projectile={...w.projectile,speed,radius:w.radius,range:w.range,lifetime:id==='grenade'?2.5:w.range/speed};w.maxRange=w.range;w.projectileLifetime=w.projectile.lifetime;if(blastRadius)w.blastDamage=120;if(gravity)w.launchLift=8;
    if(id==='super_shotgun')w.spreadRadians=.1;
    abs.weapons.set(id,w);
  }
  // No firearm retains hitscan, ricochet or penetration. Existing projectile
  // tuning, typed overrides and original weapon art/audio remain available.
  for(const w of abs.weapons.values())if(w.type!=='melee'){w.firingModel='projectile';w.penetration=0;}
  const originalEquip=abs.equip,originalReload=MF.reload;
  /* @function arsenal.inventory — Inputs: live game. Returns its authoritative event inventory Map or null before session attachment. Does not create duplicate persistent ammo banks. */
  function inventory(game){return game.eventSession?.state.inventory||null;}
  /* @function arsenal.pool — Inputs: equipped weapon. Returns distinct ammo item ID, defaulting to legacy pistol ammunition for unmapped archetypes. Melee returns null. No mutation. */
  function pool(w){return w?.type==='melee'?null:(w?.ammoPool||'ammo9');}
  /* @function arsenal.prepare — Inputs: live game before firing/pickup/menu rendering. Returns nothing; exposes pool quantities as loaded rounds for Quake-style guns. Legacy pistol keeps its magazine/reserve representation. Pool quantities are capped by the existing inventory/save bound, not fabricated when equipping. */
  function prepare(game){const state=inventory(game),id=pool(game.player.weapon);if(state&&id&&id!=='ammo9'){game.player.ammoLoaded=state.get(id)||0;game.player.ammoReserve=0;}}
  /* @function arsenal.commitAmmo — Inputs: live game after shot/reload. Returns nothing; writes consumed pool quantity to the authoritative inventory, or mirrors pistol reserve for later weapon switches. Loaded pistol rounds remain in existing per-weapon magazine state. */
  function commitAmmo(game){const state=inventory(game),id=pool(game.player.weapon);if(!state||!id)return;const amount=id==='ammo9'?game.player.ammoReserve:game.player.ammoLoaded;if(amount>0)state.set(id,amount);else state.delete(id);}
  abs.equip=/* @function arsenal.equip — Inputs: game and valid existing weapon profile ID. Returns equipped clone through original handler. Saves the old ammo representation, restores pistol reserve or the selected shared pool, and avoids free ammo from magazine switching. Authoring profile selection remains available; inventory UI offers only owned weapon pickups. Invalid IDs throw through original handler. */function(game,id){
    const previous=pool(game.player.weapon);if(previous==='ammo9')commitAmmo(game);else prepare(game);
    const result=originalEquip(game,id),state=inventory(game),next=pool(result);
    if(next==='ammo9'&&previous&&previous!=='ammo9')game.player.ammoReserve=state?.get('ammo9')||0;
    prepare(game);return result;
  };
  MF.reload=/* @function arsenal.reload — Inputs: live game and existing combat UI. Returns original reload result for magazine weapons, or nothing for direct-pool weapons. Explains pool behavior instead of performing a fake reload; preserves legacy sounds/timing for pistol. No ammo duplication. */function(game,ui){const id=pool(game.player.weapon);if(id&&id!=='ammo9'){prepare(game);ui.log('This weapon feeds directly from its ammunition pool.');return;}const result=originalReload(game,ui);commitAmmo(game);return result;};
  /* @function arsenal.cost — Inputs: live game and weapon. Returns normal ammo cost or one-round fallback for double shotgun/super nail archetype when only one round remains. Does not consume ammunition. */
  function cost(game,w){return ['super_shotgun','heavy_machine_gun'].includes(w.id)&&game.player.ammoLoaded===1?1:(w.ammoCost??1);}
  /* @function arsenal.dischargeWeapon — Inputs: game after cost subtraction and immutable equipped weapon. Returns original weapon or a temporary reduced single-shell/single-nail configuration. Uses the fallback decision recorded before ammunition subtraction; it does not infer fallback from a potentially stale displayed round count. No modification of equipped presets or future shots. */
  function dischargeWeapon(game,w){if(['super_shotgun','heavy_machine_gun'].includes(w.id)&&game.lastArsenalFallback)return {...w,pellets:w.id==='super_shotgun'?6:1,damage:w.id==='super_shotgun'?w.damage:w.damage*.5};return w;}
  /* @function arsenal.recordCost — Inputs: game and weapon. Returns cost while recording it for this immediate discharge's fallback. Persistent weapon balance and ammo are untouched. */
  function recordCost(game,w){const value=cost(game,w);game.lastArsenalFallback=value<(w.ammoCost??1);return game.lastArsenalCost=value;}
  /* @function arsenal.restore — Inputs: live game, saved profile ID and validated player scalars after inventory restoration. Returns equipped clone. Bypasses ordinary switching's outgoing-ammo write so imported pool counts cannot overwrite the pistol reserve. Restores saved magazine/current-round state without granting ammunition. Invalid profile errors propagate before saved scalars are assigned. */
  function restore(game,id,state){game.player.previousWeapon=null;const weapon=originalEquip(game,id);Object.assign(game.player,state);game.player.previousWeapon=id;prepare(game);if(pool(weapon)==='ammo9')commitAmmo(game);return weapon;}
  root.FrontierArsenal={prepare,commitAmmo,pool,cost:recordCost,dischargeWeapon,restore,presets};
})(window);
