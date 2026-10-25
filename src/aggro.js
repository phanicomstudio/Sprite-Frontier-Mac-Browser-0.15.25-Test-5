/* Explicit aggression owns encounter/music state. Enemy awareness is separate
 * from attack range: passive NPCs never trigger combat merely by being nearby.
 * Damage can provoke an enemy; configurable leash/calm timing ends pursuit. */
(/* @function aggro.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier aggro. */ function(root){
 'use strict';
 /* @function aggro.enemies.2 — Handles enemies within aggro. Inputs: game. Uses: a list of spread element, spread element filter. Returns: a list of spread element, spread element filter using a callback. */ function enemies(game){return [...game.maps.frontier.entities,...(game.sceneEvents||[])].filter(/* @function aggro.callback.3 — Returns e kind equals "monster". Inputs: e. Returns: e kind equals "monster". */ e=>e.kind==='monster');}
 /* @function aggro.update.4 — Advances this system using the current state and elapsed time. Inputs: game; dt. Updates: e aggro; e aggro timer; active; game in combat. Uses: rule; root frontier activity actors; enemies; root frontier party combat target. */ function update(game,dt){
  let active=false;
  const rule=/* @function aggro.rule.5 — Returns root frontier parameters get using game source world, name. Inputs: name. Uses: root frontier parameters get. Returns: root frontier parameters get using game source world, name. */ name=>root.FrontierParameters.get(game.sourceWorld,name),calm=rule('aggroCalm');
  for(const e of root.FrontierActivity?root.FrontierActivity.actors(game):enemies(game)){
   const target=root.FrontierPartyCombat?root.FrontierPartyCombat.target(game,e):game.player;
   if(e.dead||e.hp<=0||!target||target.hp<=0){e.aggro=false;e.aggroTimer=0;continue;}
   // Authored behavior owns acquisition/leash/return as well as locomotion.
   // Combat still owns attacks, but cannot independently restart a return.
   if(e.behaviorOwned){e.aggro=e.behaviorPhase==='chase';e.aggroTimer=0;if(e.aggro)active=true;continue;}
   const distance=Math.hypot(e.x-target.x,e.y-target.y),detect=e.aggroRange??e.combat?.aggroRange??rule('aggroRange'),leash=e.leashRange??rule('aggroLeash');
   if(e.hostile!==false&&distance<detect){e.aggro=true;e.aggroTimer=calm;}
   else if(e.aggro){e.aggroTimer=Math.max(0,(e.aggroTimer??calm)-dt);if(distance>leash||e.aggroTimer<=0)e.aggro=false;}
   if(e.aggro)active=true;
  }
  game.inCombat=game.combatOverride==='combat'?game.player.hp>0:game.combatOverride==='exploration'?false:active;
 }
 /* @function aggro.provoke.6 — Handles provoke within aggro. Inputs: game; id. Updates: e aggro; e aggro timer. Uses: game runtime entities get. */ function provoke(game,id){const e=game.runtime.entities.get(id);if(e?.kind==='monster'&&!e.dead&&e.hp>0){e.aggro=true;e.aggroTimer=3;}}
 root.FrontierAggro={update,provoke,enemies};
})(typeof window==='undefined'?globalThis:window);

