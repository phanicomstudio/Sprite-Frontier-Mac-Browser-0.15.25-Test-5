/* Explicit aggression owns encounter/music state. Enemy awareness is separate
 * from attack range: passive NPCs never trigger combat merely by being nearby.
 * Damage can provoke an enemy; configurable leash/calm timing ends pursuit. */
(function(root){
 'use strict';
 function enemies(game){return [...game.maps.frontier.entities,...(game.sceneEvents||[])].filter(e=>e.kind==='monster');}
 function update(game,dt){
  let active=false;
  const rule=name=>root.FrontierParameters.get(game.sourceWorld,name),calm=rule('aggroCalm');
  for(const e of enemies(game)){
   if(e.dead||e.hp<=0||game.player.hp<=0){e.aggro=false;e.aggroTimer=0;continue;}
   const distance=Math.hypot(e.x-game.player.x,e.y-game.player.y),detect=e.aggroRange??e.combat?.aggroRange??rule('aggroRange'),leash=e.leashRange??rule('aggroLeash');
   if(e.hostile!==false&&distance<detect){e.aggro=true;e.aggroTimer=calm;}
   else if(e.aggro){e.aggroTimer=Math.max(0,(e.aggroTimer??calm)-dt);if(distance>leash||e.aggroTimer<=0)e.aggro=false;}
   if(e.aggro)active=true;
  }
  game.inCombat=game.combatOverride==='combat'?game.player.hp>0:game.combatOverride==='exploration'?false:active;
 }
 function provoke(game,id){const e=game.runtime.entities.get(id);if(e?.kind==='monster'&&!e.dead&&e.hp>0){e.aggro=true;e.aggroTimer=3;}}
 root.FrontierAggro={update,provoke,enemies};
})(typeof window==='undefined'?globalThis:window);
