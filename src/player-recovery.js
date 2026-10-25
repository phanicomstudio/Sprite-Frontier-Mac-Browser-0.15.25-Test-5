/* Temporary playtest escape hatch. History is runtime-only, bounded and reset
 * with each game. Recovery never changes authored maps, inventory or events. */
(/* @function player-recovery.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier player recovery. */ function(root){'use strict';
 const histories=new WeakMap();
 // Check a proposed body position against map bounds, room walls, event/model
 // collision and legacy solids. Returns false for occupied or airborne points.
 /* @function player-recovery.checkSafe.2 — collision and legacy solids. Returns false for occupied or airborne points. Inputs: game; point. Uses: root frontier interior blocked; root frontier model collision blocked; solids some. Returns: false; false. */ function checkSafe(game,point){const p=game.player,w=game.sourceWorld;if(!point.grounded||point.x<.5||point.y<.5||point.x>(w.width??w.size)-.5||point.y>(w.height??w.size)-.5)return false;
  if(root.FrontierInterior?.blocked(w,point.x,point.y,.13,point.z))return false;
  if(root.FrontierModelCollision?.blocked(game,point.x,point.y,.13,{...p,...point}))return false;
  const solids=[...(game.maps?.frontier?.entities||[]),...(game.sceneEvents||[])];
  return !solids.some(/* @function player-recovery.callback.3 — Returns e does not equal p and the inverse of e dead and e solid does not equal false and e radius and math abs using e x minus point x is less than e radius plus 0.13 and math abs using e y minus point y is less than e radius plus 0.13 and point z is less than e z or 0 plus e height minus 0.001. Inputs: e. Returns: e does not equal p and the inverse of e dead and e solid does not equal false and e radius and math abs using e x minus point x is less than e radius plus 0.13 and math abs using e y minus point y is less than e radius plus 0.13 and point z is less than e z or 0 plus e height minus 0.001. */ e=>e!==p&&!e.dead&&e.solid!==false&&e.radius&&Math.abs(e.x-point.x)<e.radius+.13&&Math.abs(e.y-point.y)<e.radius+.13&&point.z<(e.z||0)+e.height-.001);
 }
 // Run a safety probe without replacing the last gameplay collision trace.
 /* @function player-recovery.safe.4 — Run a safety probe without replacing the last gameplay collision trace. Inputs: game; point. Updates: game model collision debug. Uses: check safe. Returns: check safe using game, point. */ function safe(game,point){const before=game.modelCollisionDebug;try{return checkSafe(game,point);}finally{game.modelCollisionDebug=before;}}
 // Remember up to 30 distinct, stationary-height safe locations. The half-unit
 // spacing avoids choosing another point on the same troublesome contact.
 /* @function player-recovery.remember.5 — spacing avoids choosing another point on the same troublesome contact. Inputs: game. Updates: list. Uses: safe; histories get; histories set; list at. Returns: without a result; without a result. */ function remember(game){const p=game.player,point={x:p.x,y:p.y,z:p.z||0,grounded:p.grounded!==false};if(!safe(game,point))return;let list=histories.get(game);if(!list)histories.set(game,list=[]);if(list.length&&Math.hypot(point.x-list.at(-1).x,point.y-list.at(-1).y)<.5)return;list.push(point);if(list.length>30)list.shift();}
 // Restore a clear recent position at least one unit away. If none survives
 // changed geometry, search the spawn neighborhood for a clear supported spot.
 // Returns success/failure and records the outcome for diagnostics.
 /* @function player-recovery.recover.6 — Returns success/failure and records the outcome for diagnostics. Inputs: game. Updates: z; game recovery debug; game player step; game moving. Uses: histories get; list slice using reverse using filter; list slice using reverse; list slice. Returns: false; true. */ function recover(game){const p=game.player,w=game.sourceWorld,list=histories.get(game)||[],candidates=list.slice().reverse().filter(/* @function player-recovery.callback.7 — Returns math hypot using q x minus p x, q y minus p y is at least 1. Inputs: q. Returns: math hypot using q x minus p x, q y minus p y is at least 1. */ q=>Math.hypot(q.x-p.x,q.y-p.y)>=1);const spawn=w.spawn;
  if(spawn)for(const distance of [0,.5,1,2,3,4])for(let i=0;i<(distance?16:1);i++){const angle=i*Math.PI/8,x=spawn.x+Math.cos(angle)*distance,y=spawn.y+Math.sin(angle)*distance;let z=root.FrontierTerrain.height(w,x,y);const top=root.FrontierModelCollision?.support(game,x,y,z,z+30);if(top!==null&&top!==undefined)z=Math.max(z,top);candidates.push({x,y,z,grounded:true});}
  const point=candidates.find(/* @function player-recovery.callback.8 — Returns safe using game, q. Inputs: q. Uses: safe. Returns: safe using game, q. */ q=>safe(game,q));if(!point){game.recoveryDebug={success:false,reason:'No clear supported recovery position'};return false;}
  Object.assign(p,point,{vx:0,vy:0,verticalVelocity:0,groundZ:point.z,walkTime:0,walkHold:0});game.playerStep=null;game.moving=false;game.recoveryDebug={success:true,position:{...point}};return true;
 }
 root.FrontierPlayerRecovery={safe,remember,recover};
})(typeof window==='undefined'?globalThis:window);
