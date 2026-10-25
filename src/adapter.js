/* MAINTAINER GUIDE
 * Frontier compatibility host for the original isometric combat. Builds entity registries and the services expected by MF. Engine objects use world X/Y and elevation Z, not screen pixels. Extend makeFrontierGame when adding runtime state.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function(MF){
'use strict'  ;
// Camera input becomes a world aim point before the original combat reads it.
  MF.screenToIso=(game)=>({
    x:game.player.x+Math.sin(game.camera.yaw)*20,y:game.player.y+Math.cos(game.camera.yaw)*20
  }
  );
  MF.hitTest=()=>null;
  MF.updateAim=game=>{
    game.player.facingX=Math.sin(game.camera.yaw);
    game.player.facingY=Math.cos(game.camera.yaw);
  }
  ;
  MF.makeFrontierGame=(world,log)=>{
    const entities=world.objects.map(e=>({
      ...e,z:window.FrontierTerrain.height(world,e.x,e.y)+(e.elevation||0)*.3,type:e.kind==='monster'?'monster':'prop',name:e.kind==='monster'?'Frontier sentinel':e.kind,maxHp:24,hp:24,dead:false
    }
    ));
    const player={
      id:'player',type:'player',x:world.spawn.x,y:world.spawn.y,hp:100,holstered:false,facingX:0,facingY:1,ammoLoaded:12,ammoReserve:120,weapon:structuredClone(window.FrontierProject.weapon)
    }
    ;
    const registry=new Map(entities.map(e=>[e.id,e]));
    registry.set(player.id,player);
    const game={
      player,camera:{
        yaw:0,distance:3.8,height:.6,pitch:-.12,firstPerson:false
      }
      ,currentMapId:'frontier',maps:{
        frontier:{
          size:{
            w:48,h:48
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
        emit(type,payload){
          game.events.push({
            type,payload
          }
          );
          if(game.events.length>100)game.events.shift();
        }
      }
      ,grid:{
        getCollisionZones(){
          return [...entities.filter(e=>!e.dead),...(game.sceneEvents||[]).filter(e=>e.solid)].map(e=>({
            id:e.id,x1:e.x-e.radius,y1:e.y-e.radius,x2:e.x+e.radius,y2:e.y+e.radius
          }
          ));
        }
        ,getBlockingPolygons(){
          return[];
        }
      }
      ,addEntity(map,e){
        entities.push(e);
        registry.set(e.id,e);
      }
    }
    ;
    game.ui={
      log,updateWeaponHUD(){
      }
      ,updateHover(){
      }
    }
    ;
    return game;
  }
  ;
}
)(window.MF);
