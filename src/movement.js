/* MAINTAINER GUIDE
 * Camera-relative locomotion using original Frontier speed and collision feel. Tuning lives in project-data.js. Inputs normalize diagonals; axis substeps slide against obstacles and prevent tunneling.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(/* @function movement.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf frontier movement. Uses: object freeze. */ function(MF){
'use strict'  ;
// Frontier 0.20.7d movement rules, with camera-relative input replacing the
// isometric inverse projection. Collision and animation use actual movement.
  const tuning=Object.freeze({
    ...window.FrontierProject.movement
  }
  );
// Combine keyboard/analog axes, normalize diagonals, rotate by yaw and substep collision. Animate only when position actually changes.
  /* @function movement.movePlayer.2 — Combine keyboard/analog axes, normalize diagonals, rotate by yaw and substep collision. Animate only when position actually changes. Inputs: game; keys; dt; blocked; assignment pattern. Updates: f; s; dx; dy; p x. Uses: number; keys has; rules get; blocked. */ function movePlayer(game,keys,dt,blocked,analog={
    forward:0,strafe:0
  }
  ){
    const p=game.player,bx=p.x,by=p.y,wasMoving=!!game.moving;
    let f=Number(keys.has('w'))-Number(keys.has('s'))+(analog.forward||0),s=Number(keys.has('d'))-Number(keys.has('a'))+(analog.strafe||0),len=Math.hypot(f,s);
    if(len){
      f/=Math.max(1,len);
      s/=Math.max(1,len);
      const rules=window.FrontierParameters,speed=(rules?rules.get(game.sourceWorld,'playerSpeed'):tuning.playerSpeed)*(keys.has('shift')?(rules?rules.get(game.sourceWorld,'sprintMultiplier'):tuning.sprintMultiplier):1),yaw=game.camera.yaw;let dx=(Math.sin(yaw)*f+Math.cos(yaw)*s)*speed*dt,dy=(Math.cos(yaw)*f-Math.sin(yaw)*s)*speed*dt;const room=game.sourceWorld?.interior;if(room?.mode==='fixed'){const c=room.camera,det=c.axisXX*c.axisYY-c.axisXY*c.axisYX,unit=(Math.hypot(c.axisXX,c.axisXY)+Math.hypot(c.axisYX,c.axisYY))/2,px=s*unit*speed*dt,py=-f*unit*speed*dt;dx=(px*c.axisYY-py*c.axisYX)/det;dy=(py*c.axisXX-px*c.axisXY)/det;}const steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/tuning.maxAxisStep));
      for(let i=0;
      i<steps;
      i++){
        if(!blocked(p.x+dx/steps,p.y,tuning.playerCollisionRadius)){if(game.playerStep)Object.assign(p,game.playerStep);else p.x+=dx/steps;game.playerStep=null;}
        if(!blocked(p.x,p.y+dy/steps,tuning.playerCollisionRadius)){if(game.playerStep)Object.assign(p,game.playerStep);else p.y+=dy/steps;game.playerStep=null;}
      }
    }
    p.vx=p.x-bx;
    p.vy=p.y-by;
    game.moving=Math.hypot(p.vx,p.vy)>.00001;
    if(game.moving){
      if(!wasMoving)p.walkTime=.14;
      else p.walkTime=(p.walkTime||0)+dt;
      p.walkHold=.1;
      if((p.firingUntil||0)<=(game.elapsed||0)){
        const m=Math.hypot(p.vx,p.vy);
        p.facingX=p.vx/m;
        p.facingY=p.vy/m;
        p.movementFacing={
          x:p.facingX,y:p.facingY
        }
        ;
      }
    }
    else {p.walkHold=Math.max(0,(p.walkHold||0)-dt);if(!p.walkHold)p.walkTime=0;}
  }
  MF.frontierMovement={
    tuning,movePlayer
  }
  ;
}
)(window.MF);


