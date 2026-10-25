/* MAINTAINER GUIDE
 * Camera-relative locomotion using original Frontier speed and collision feel. Tuning lives in project-data.js. Inputs normalize diagonals; axis substeps slide against obstacles and prevent tunneling.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function(MF){
'use strict'  ;
// Frontier 0.20.7d movement rules, with camera-relative input replacing the
// isometric inverse projection. Collision and animation use actual movement.
  const tuning=Object.freeze({
    ...window.FrontierProject.movement
  }
  );
// Combine keyboard/analog axes, normalize diagonals, rotate by yaw and substep collision. Animate only when position actually changes.
  function movePlayer(game,keys,dt,blocked,analog={
    forward:0,strafe:0
  }
  ){
    const p=game.player,bx=p.x,by=p.y;
    let f=Number(keys.has('w'))-Number(keys.has('s'))+(analog.forward||0),s=Number(keys.has('d'))-Number(keys.has('a'))+(analog.strafe||0),len=Math.hypot(f,s);
    if(len){
      f/=Math.max(1,len);
      s/=Math.max(1,len);
      const rules=window.FrontierParameters,speed=(rules?rules.get(game.sourceWorld,'playerSpeed'):tuning.playerSpeed)*(keys.has('shift')?(rules?rules.get(game.sourceWorld,'sprintMultiplier'):tuning.sprintMultiplier):1),yaw=game.camera.yaw,dx=(Math.sin(yaw)*f+Math.cos(yaw)*s)*speed*dt,dy=(Math.cos(yaw)*f-Math.sin(yaw)*s)*speed*dt,steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/tuning.maxAxisStep));
      for(let i=0;
      i<steps;
      i++){
        if(!blocked(p.x+dx/steps,p.y,tuning.playerCollisionRadius))p.x+=dx/steps;
        if(!blocked(p.x,p.y+dy/steps,tuning.playerCollisionRadius))p.y+=dy/steps;
      }
    }
    p.vx=p.x-bx;
    p.vy=p.y-by;
    game.moving=Math.hypot(p.vx,p.vy)>.00001;
    if(game.moving){
      p.walkTime=(p.walkTime||0)+dt;
      if(p.holstered||!p.weapon){
        const m=Math.hypot(p.vx,p.vy);
        p.facingX=p.vx/m;
        p.facingY=p.vy/m;
        p.movementFacing={
          x:p.facingX,y:p.facingY
        }
        ;
      }
    }
    else p.walkTime=0;
  }
  MF.frontierMovement={
    tuning,movePlayer
  }
  ;
}
)(window.MF);
