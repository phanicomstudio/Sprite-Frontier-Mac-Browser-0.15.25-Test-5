/* MAINTAINER GUIDE
 * Frontier compatibility host for the original isometric combat. Builds entity registries and the services expected by MF. Engine objects use world X/Y and elevation Z, not screen pixels. Extend makeFrontierGame when adding runtime state.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(/* @function adapter.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf screen to iso; mf hit test; mf update aim; mf make frontier game. */ function(MF){
'use strict'  ;
// Camera input becomes a world aim point before the original combat reads it.
  MF.screenToIso=/* @function adapter.screenToIso.2 — Returns chain equals "fixed" selects frontier interior aim using game, mx, my or a record containing x, y. Inputs: game; mx; my. Uses: frontier interior aim. Returns: chain equals "fixed" selects frontier interior aim using game, mx, my or a record containing x, y. */ (game,mx,my)=>game.sourceWorld.interior?.mode==='fixed'?FrontierInterior.aim(game,mx,my):({x:game.player.x+Math.sin(game.camera.yaw)*20,y:game.player.y+Math.cos(game.camera.yaw)*20});
  MF.hitTest=/* @function adapter.hitTest.3 — Returns null. Inputs: no explicit arguments; uses enclosing module state. Returns: null. */ ()=>null;
  MF.updateAim=/* @function adapter.updateAim.4 — Handles update aim within adapter. Inputs: game. Updates: game player facing x; game player facing y. Uses: frontier interior aim. Returns: without a result. */ game=>{
    if(game.sourceWorld.interior?.mode==='fixed'&&game.pointer){const a=FrontierInterior.aim(game,game.pointer.x,game.pointer.y),dx=a.x-game.player.x,dy=a.y-game.player.y,len=Math.hypot(dx,dy);if(len>.01){game.player.facingX=dx/len;game.player.facingY=dy/len;}return;}
    game.player.facingX=Math.sin(game.camera.yaw);
    game.player.facingY=Math.cos(game.camera.yaw);
  }
  ;
  MF.makeFrontierGame=/* @function adapter.makeFrontierGame.5 — Handles make frontier game within adapter. Inputs: world; log. Updates: game source world; game local player id; game players; game runtime; game ui. Uses: world objects map; structured clone; entities map; registry set. Returns: game. */ (world,log)=>{
    const entities=world.objects.map(/* @function adapter.callback.6 — Returns a record containing copied fields, z, type, name, maxHp, hp, dead. Inputs: e. Uses: window frontier terrain height. Returns: a record containing copied fields, z, type, name, maxHp, hp, dead. */ e=>({
      ...e,z:window.FrontierTerrain.height(world,e.x,e.y)+(e.elevation||0)*.3,type:e.kind==='monster'?'monster':'prop',name:e.name||(e.kind==='monster'?'Frontier sentinel':e.kind),maxHp:24,hp:24,dead:false
    }
    ));
    const player={
      id:'player',type:'player',x:world.spawn.x,y:world.spawn.y,hp:100,holstered:false,facingX:0,facingY:1,ammoLoaded:12,ammoReserve:120,weapon:structuredClone(window.FrontierProject.weapon)
    }
    ;
    const registry=new Map(entities.map(/* @function adapter.callback.7 — Returns a list of e id, e. Inputs: e. Returns: a list of e id, e. */ e=>[e.id,e]));
    registry.set(player.id,player);
    const game={
      player,camera:{
        yaw:0,distance:3.8,height:.6,pitch:-.12,firstPerson:false
      }
      ,currentMapId:'frontier',maps:{
        frontier:{
          size:{
            w:world.width??world.size??48,h:world.height??world.size??48
          }
          ,entities
        }
      }
      ,world:{
        factions:{
        }
        ,flags:{
        }
      }
      ,particles:[],bloodStains:[],bulletHoles:[],muzzleFlashes:[],projectiles:[],shotEffects:[],projectileSerial:0,lootSerial:0,events:[],elapsed:0
    }
    ;
    game.sourceWorld=world;
    game.localPlayerId=player.id;
    game.players=new Map([[player.id,player]]);
    game.runtime={
      entities:registry,events:{
        /* @function adapter.emit.8 — Handles emit within adapter. Inputs: type; payload. Uses: game events push; game events shift. */ emit(type,payload){
          game.events.push({
            type,payload
          }
          );
          if(game.events.length>100)game.events.shift();
        }
      }
      ,grid:{
        /* @function adapter.getCollisionZones.9 — Handles get collision zones within adapter. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element, spread element map; entities filter; game scene events or a list of filter. Returns: a list of spread element, spread element map using a callback. */ getCollisionZones(){
          return [...entities.filter(/* @function adapter.callback.10 — Returns the inverse of e dead. Inputs: e. Returns: the inverse of e dead. */ e=>!e.dead),...(game.sceneEvents||[]).filter(/* @function adapter.callback.11 — Returns the inverse of e dead and e solid or e combat. Inputs: e. Returns: the inverse of e dead and e solid or e combat. */ e=>!e.dead&&(e.solid||e.combat))].map(/* @function adapter.callback.12 — Returns a record containing id, x1, y1, x2, y2. Inputs: e. Returns: a record containing id, x1, y1, x2, y2. */ e=>({
            id:e.id,x1:e.x-e.radius,y1:e.y-e.radius,x2:e.x+e.radius,y2:e.y+e.radius
          }
          ));
        }
        ,/* @function adapter.getBlockingPolygons.13 — Handles get blocking polygons within adapter. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of . */ getBlockingPolygons(){
          return[];
        }
      }
      ,/* @function adapter.addEntity.14 — Handles add entity within adapter. Inputs: map; e. Uses: entities push; registry set. */ addEntity(map,e){
        entities.push(e);
        registry.set(e.id,e);
      }
    }
    ;
    game.ui={
      log,/* @function adapter.updateWeaponHUD.15 — Handles update weapon hud within adapter. Inputs: no explicit arguments; uses enclosing module state. */ updateWeaponHUD(){
      }
      ,/* @function adapter.updateHover.16 — Handles update hover within adapter. Inputs: no explicit arguments; uses enclosing module state. */ updateHover(){
      }
    }
    ;
    return game;
  }
  ;
}
)(window.MF);

