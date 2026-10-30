/* October 29, 2026: common item inventory and combat equipment bridge.
 * Quantities stay in the existing event inventory Map, stack ownership stays
 * in the hub detail store, and ammunition magazines retain their combat owner. */
(/* @function inventory.install — Inputs: browser/global namespace. Installs catalog-backed equipment/crafting helpers without creating a second inventory or changing authored starting values. */ function(root){

  'use strict';

  /* @function inventory.definition — Inputs: stable item ID. Returns the actual shared definition or a readable legacy unknown-ID fallback; no mutation or invented effect. */
  function definition(id){
    return (root.FrontierItems||[]).find(/* @function inventory.matchDefinition — Inputs: catalog item. Returns exact stable-ID match. */function(item){
      return item.id===id;
    })||{
      id,name:id,price:0,properties:{}
    };
  }

  /* @function inventory.ensure — Inputs: actual live game and current hub detail store. Binds the existing store and once represents historically implicit starter pistol/melee as real owned catalog items for legacy/fresh sessions. The additive saved version prevents dropped starter gear being re-granted on reload. Never touches authored defaults or grants ammunition. Returns whether migration completed; full catalogs/inventories retain state and defer safely. */
  function ensure(game,store){
    game.inventoryStore=store;
    const inv=game.eventSession?.state.inventory;
    if(!inv||store.gearVersion>=1)return true;
    const add=[];
    for(const profile of ['handgun','starter-melee']){
      const options=(root.FrontierItems||[]).filter(/* @function inventory.startingProfile — Inputs: item definition. Selects the actual existing starter combat profile. */function(item){
        return item.properties?.weaponProfile===profile;
      });
      if(options.some(/* @function inventory.hasStarter — Inputs: matching definition. Returns actual positive ownership, never infers from display name. */function(item){
        return (inv.get(item.id)||0)>0;
      }))continue;
      if(options[0])add.push(options[0].id);
    }
    if(inv.size+add.filter(/* @function inventory.newSlot — Inputs: starter ID. Returns whether it needs a new sparse inventory key. */function(id){
      return !inv.has(id);
    }).length>2000)return false;
    for(const id of add)inv.set(id,1);
    store.gearVersion=1;
    return true;
  }

  /* @function inventory.ownsProfile — Inputs: live game and combat profile ID. Returns actual catalog-item ownership after migration, or legacy true before the existing session is bound. Supports distinct item definitions pointing to the same profile. */
  function ownsProfile(game,profile){
    if(!game.inventoryStore?.gearVersion||game.authoring)return true;
    const inv=game.eventSession?.state.inventory;
    return (root.FrontierItems||[]).some(/* @function inventory.ownedProfileItem — Inputs: shared definition. Returns whether it references the profile and is actually carried. */function(item){
      return item.properties?.weaponProfile===profile&&(inv?.get(item.id)||0)>0;
    });
  }

  /* @function inventory.equip — Inputs: live game and actual item ID. Returns original combat weapon clone after checking ownership/profile. Moves a dropped pistol's stored magazine into an empty combat slot once, retaining other stacks and shared ammo pools. Throws before unsupported/unowned equipment is selected. */
  function equip(game,id){
    const inv=game.eventSession.state.inventory,item=definition(id),profile=item.properties?.weaponProfile;
    if((inv.get(id)||0)<1||!profile||!root.PhanicomABS.weapons.has(profile))throw Error('This carried item cannot be equipped.');
    const stack=game.inventoryStore?.carried.find(/* @function inventory.storedMagazine — Inputs: carried stack. Returns an actual stored magazine for this item, not a fabricated initial load. */function(s){
      return s.itemId===id&&Number.isInteger(s.properties?.weaponMagazine)&&s.properties.weaponMagazine>0;
    });
    const result=root.PhanicomABS.equip(game,profile);
    if(stack&&!(game.player.ammoLoaded>0)){
      game.player.magazines||={};
      game.player.magazines[profile]=Math.min(stack.properties.weaponMagazine,root.PhanicomABS.weapons.get(profile).magazineSize);
      stack.properties.weaponMagazine-=game.player.magazines[profile];
      game.player.ammoLoaded=game.player.magazines[profile];
    }
    game.player.holstered=false;
    return result;
  }

  /* @function inventory.unload — Inputs: live game and optional magazine profile. Returns transferred round count. Direct-pool guns/melee are untouched; pistol rounds become reserve items using the existing ammo mirror. Validates total capacity before changing a magazine. */
  function unload(game,profile=game.player.weapon.id){
    const weapon=root.PhanicomABS.weapons.get(profile);
    if(!weapon||root.FrontierArsenal.pool(weapon)!=='ammo9')return 0;
    const p=game.player,inv=game.eventSession.state.inventory,active=p.weapon.id===profile,rounds=active?p.ammoLoaded:(p.magazines?.[profile]||0),reserve=active?p.ammoReserve:(inv.get('ammo9')||0);
    if(!rounds)return 0;
    if(reserve+rounds>1000000||(!inv.has('ammo9')&&inv.size>=2000))throw Error('No room for unloaded ammunition.');
    inv.set('ammo9',reserve+rounds);
    p.magazines||={};
    p.magazines[profile]=0;
    if(active){
      p.ammoLoaded=0;
      p.ammoReserve=reserve+rounds;
    }
    return rounds;
  }

  /* @function inventory.use — Inputs: live game, hub detail store and carried item ID. Returns restored HP after validated supported healing, consuming exactly one actual stack through the shared owner. Unsupported/full-health/dead use rejects with no item consumption. */
  function use(game,store,id){
    const item=definition(id),healing=item.properties?.restoreHp,p=game.player,max=(Number.isFinite(p.maxHp)?p.maxHp:100);
    if(!Number.isFinite(healing)||healing<=0)throw Error('No use action is defined for this item.');
    if(p.hp<=0||p.hp>=max)throw Error('Health is already full or the player is incapacitated.');
    const restored=Math.min(healing,max-p.hp);
    root.FrontierHubState.consume(store,game.eventSession.state.inventory,id,{
      owner:{
        kind:'player'
      },properties:item.properties||{},questProtected:!!item.questProtected
    });
    p.hp+=restored;
    return restored;
  }

  /* @function inventory.craft — Inputs: live game, original hub store, canonical recipe and optional batches. Returns actual output after a single atomic stock/equipment transaction. Last-copy ingredient weapons unload magazines into a detached ammo draft first; failure leaves player, quantities and ownership untouched. */
  function craft(game,store,recipe,batches=1){
    const inv=game.eventSession.state.inventory,draftInv=new Map(inv),draftStore={
      ...store,carried:structuredClone(store.carried)
    },player={
      ...game.player,magazines:{
        ...game.player.magazines
      }
    },draftGame={
      ...game,player,eventSession:{
        state:{
          inventory:draftInv
        }
      }
    };
    for(const row of recipe.ingredients)if(row.consume&&(inv.get(row.itemId)||0)===row.quantity*batches){
      const profile=definition(row.itemId).properties?.weaponProfile;
      if(profile)unload(draftGame,profile);
    }
    const result=root.FrontierCrafting.execute(recipe,draftInv,draftStore,root.FrontierItems,batches);
    if(root.FrontierArsenal.pool(player.weapon)==='ammo9')player.ammoReserve=draftInv.get('ammo9')||0;
    inv.clear();
    for(const entry of draftInv)inv.set(...entry);
    store.carried=draftStore.carried;
    for(const key of ['ammoLoaded','ammoReserve','magazines'])game.player[key]=player[key];
    if(!ownsProfile(game,game.player.weapon.id))game.player.holstered=true;
    return result;
  }

  /* @function inventory.rows — Inputs: live game. Returns detached display rows for positive real quantities and unloaded reserve; magazine contents are annotated, not duplicated into craftable stock. Unknown legacy IDs remain selectable for descriptions/drop. */
  function rows(game){
    const inv=game.eventSession.state.inventory,result=[];
    for(const [id,count]of inv){
      if(count<=0)continue;
      const item=definition(id);
      result.push({
        id,count,name:item.name,description:item.properties?.description||item.description||'No description authored.',image:item.inventoryImage||'',weaponProfile:item.properties?.weaponProfile||'',canUse:(item.properties?.restoreHp||0)>0,equipped:item.properties?.weaponProfile===game.player.weapon.id&&!game.player.holstered
      });
    }
    result.sort(/* @function inventory.sortRows — Inputs: display-row pair. Returns readable name/ID ordering without changing inventory identity or quantity. */function(a,b){
      return a.name.localeCompare(b.name)||a.id.localeCompare(b.id);
    });
    return result;
  }

  const originalEquip=root.PhanicomABS.equip,originalUpdate=root.PhanicomABS.update;

  root.PhanicomABS.equip=/* @function inventory.guardEquip — Inputs: actual combat game and existing profile. Returns original equip result when owned/authoring/initializing; otherwise retains the current weapon holstered. Prevents keyboard or old UI from re-equipping a dropped last copy without rewriting ballistic behavior. */function(game,id){
    if(!ownsProfile(game,id)){
      game.player.holstered=true;
      game.ui?.log?.('That weapon is not in your inventory.');
      return game.player.weapon;
    }
    return originalEquip(game,id);
  };

  root.PhanicomABS.update=/* @function inventory.guardCombat — Inputs: original game/update arguments. Returns original update result while ensuring a no-longer-owned weapon remains holstered before firing. Enemy simulation and all projectile/collision owners remain unchanged. */function(game,...args){
    if(!ownsProfile(game,game.player.weapon.id))game.player.holstered=true;
    return originalUpdate(game,...args);
  };

  /* @function inventory.syncAmmo — Inputs: live game after an item-owner transaction. Refreshes pistol reserve from its actual inventory pool, or delegates direct-pool magazine display to the existing arsenal. Never changes loaded pistol rounds or grants stock. Must run after stock commits, not during combat's outgoing-ammo write. */
  function syncAmmo(game){
    if(root.FrontierArsenal.pool(game.player.weapon)==='ammo9')game.player.ammoReserve=game.eventSession.state.inventory.get('ammo9')||0;
    else root.FrontierArsenal.prepare(game);
  }

  root.FrontierInventory={
    definition,ensure,ownsProfile,equip,unload,use,craft,rows,syncAmmo
  };


})(typeof window==='undefined'?globalThis:window);
