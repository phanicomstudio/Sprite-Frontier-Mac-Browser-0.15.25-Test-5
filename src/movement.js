/* October 14: editorFlight uses free-camera yaw navigation even while authoring fixed artwork cells; ordinary playtest retains fixed-room affine movement. */
/* MAINTAINER GUIDE
 * Camera-relative locomotion using original Frontier speed and collision feel. Tuning lives in project-data.js. Inputs normalize diagonals; axis substeps slide against obstacles and prevent tunneling.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function movement.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf frontier movement. Uses: object freeze. */
(/* @function movement.installReviewed — Installs camera-relative locomotion using original speed/collision feel. Diagonal input normalization and axis substeps prevent tunneling while sliding against obstacles; project tuning remains separate. Inputs: existing MF engine namespace MF. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  MF,
) {
  "use strict";
  // Frontier 0.20.7d movement rules, with camera-relative input replacing the
  // isometric inverse projection. Collision and animation use actual movement.
  const tuning = Object.freeze({
    ...window.FrontierProject.movement,
  });
  // Combine keyboard/analog axes, normalize diagonals, rotate by yaw and substep collision. Animate only when position actually changes.
  /* Historical contract retained; October 14 reviewed explanation follows. @function movement.movePlayer.2 — Combine keyboard/analog axes, normalize diagonals, rotate by yaw and substep collision. Animate only when position actually changes. Inputs: game; keys; dt; blocked; assignment pattern. Updates: f; s; dx; dy; p x. Uses: number; keys has; rules get; blocked. */
  /* @function movement.reviewedmovePlayer_2 — Advances player horizontal movement and movement-owned animation. Inputs: live game, lower-case key Set, elapsed dt seconds, blocked(x,y,radius) collision callback and optional normalized analog forward/strafe axes. Returns undefined; rotates combined input by camera yaw radians (or fixed-room inverse image axes), caps input length at one and axis-substeps by tuning.maxAxisStep metres. Each unblocked axis adopts proposed game.playerStep when provided, including stair/support elevation, then clears proposal. Mutates player position, per-update displacement vx/vy (not metres per second), facing and walk timers/game.moving. Firing holds facing; no actual displacement means no walk animation. Requires valid finite dt, nonsingular fixed camera and collision callback; errors propagate. Sprite rendering/tilt are not changed here. */ function movePlayer(
    game,
    keys,
    dt,
    blocked,
    analog = {
      forward: 0,
      strafe: 0,
    },
  ) {
    const p = game.player,
      bx = p.x,
      by = p.y,
      wasMoving = !!game.moving;
    let f =
        Number(keys.has("w")) - Number(keys.has("s")) + (analog.forward || 0),
      s = Number(keys.has("d")) - Number(keys.has("a")) + (analog.strafe || 0),
      len = Math.hypot(f, s);
    if (len) {
      f /= Math.max(1, len);
      s /= Math.max(1, len);
      const rules = window.FrontierParameters,
        speed =
          (rules
            ? rules.get(game.sourceWorld, "playerSpeed")
            : tuning.playerSpeed) *
          (keys.has("shift")
            ? rules
              ? rules.get(game.sourceWorld, "sprintMultiplier")
              : tuning.sprintMultiplier
            : 1),
        yaw = game.sourceWorld.presentation?.mode === "isometric" && !game.editorFlight ? game.sourceWorld.presentation.yaw : game.camera.yaw;
      let dx = (Math.sin(yaw) * f + Math.cos(yaw) * s) * speed * dt,
        dy = (Math.cos(yaw) * f - Math.sin(yaw) * s) * speed * dt;
      const room = game.sourceWorld?.interior;
      // October 14: fixed artwork navigation follows the restored image axes
      // in both authoring and playtest. Geometry cells remain free-camera.
      if (room?.mode === "fixed") {
        const c = room.camera,
          det = c.axisXX * c.axisYY - c.axisXY * c.axisYX,
          unit =
            (Math.hypot(c.axisXX, c.axisXY) + Math.hypot(c.axisYX, c.axisYY)) /
            2,
          px = s * unit * speed * dt,
          py = -f * unit * speed * dt;
        dx = (px * c.axisYY - py * c.axisYX) / det;
        dy = (py * c.axisXX - px * c.axisXY) / det;
      }
      const steps = Math.max(
        1,
        Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / tuning.maxAxisStep),
      );
      for (let i = 0; i < steps; i++) {
        if (!blocked(p.x + dx / steps, p.y, tuning.playerCollisionRadius)) {
          if (game.playerStep) Object.assign(p, game.playerStep);
          else p.x += dx / steps;
          game.playerStep = null;
        }
        if (!blocked(p.x, p.y + dy / steps, tuning.playerCollisionRadius)) {
          if (game.playerStep) Object.assign(p, game.playerStep);
          else p.y += dy / steps;
          game.playerStep = null;
        }
      }
    }
    p.vx = p.x - bx;
    p.vy = p.y - by;
    game.moving = Math.hypot(p.vx, p.vy) > 0.00001;
    if (game.moving) {
      if (!wasMoving) p.walkTime = 0.14;
      else p.walkTime = (p.walkTime || 0) + dt;
      p.walkHold = 0.1;
      if ((p.firingUntil || 0) <= (game.elapsed || 0)) {
        const m = Math.hypot(p.vx, p.vy);
        p.facingX = p.vx / m;
        p.facingY = p.vy / m;
        p.movementFacing = {
          x: p.facingX,
          y: p.facingY,
        };
      }
    } else {
      p.walkHold = Math.max(0, (p.walkHold || 0) - dt);
      if (!p.walkHold) p.walkTime = 0;
    }
  }
  // Water locomotion owns velocity while immersed, in metres and seconds.
  // The ordinary movement controller resumes as soon as the player can wade.
  function swim(game, keys, dt, pad) {
    const p=game.player, world=game.sourceWorld, camera=game.camera;
    const surface=window.FrontierWater.level(world,p.x,p.y);
    const floor=window.FrontierTerrain.height(world,p.x,p.y);
    let state=game.swimming;
    if (!Number.isFinite(surface) || surface-floor<(state?.world === world ? .65 : .95) ||
        world.interior?.mode==="fixed" || (world.flight?.mode||"ground")!=="ground") {
      if(state?.world===world) Object.assign(camera,state.camera);
      game.swimming=null;
      return false;
    }
    if (state?.world!==world) {
      if(surface-p.z<.85)return false;
      state=game.swimming={world,camera:{firstPerson:camera.firstPerson,yaw:camera.yaw,pitch:camera.pitch,distance:camera.distance},
        x:0,y:0,z:0,air:12,damageClock:0};
      if(world.presentation?.mode==="isometric"){
        camera.yaw=world.presentation.yaw;
        camera.pitch=-.25;
        camera.distance=7;
        camera.firstPerson=false;
        state.zoomRemaining=1;
      }
    }
    if(state.zoomRemaining>0 && !camera.firstPerson){
      camera.distance+=(4.5-camera.distance)*(1-Math.exp(-dt*4));
      state.zoomRemaining-=dt;
    }
    const forward=Number(keys.has("w")||keys.has("arrowup"))-Number(keys.has("s")||keys.has("arrowdown"))+(pad.move?.forward||0);
    const side=Number(keys.has("d"))-Number(keys.has("a"))+(pad.move?.strafe||0);
    const rise=Number(keys.has("e")||!!pad.jump)-Number(keys.has("q"));
    const yaw=camera.yaw, pitch=camera.pitch, sy=Math.sin(yaw),cy=Math.cos(yaw);
    const f=forward*Math.cos(pitch);
    let x=f*sy+side*cy,y=f*cy-side*sy,z=forward*Math.sin(pitch)+rise;
    const magnitude=Math.hypot(x,y,z);
    const speed=window.FrontierParameters.get(world,"playerSpeed")*.7;
    if(magnitude>1){x/=magnitude;y/=magnitude;z/=magnitude;}
    if(!magnitude)z=-.22;
    const blend=1-Math.exp(-dt*5);
    state.x+=(x*speed-state.x)*blend;
    state.y+=(y*speed-state.y)*blend;
    state.z+=(z*speed-state.z)*blend;
    const oldX=p.x,oldY=p.y;
    const steps=Math.max(1,Math.ceil(Math.hypot(state.x,state.y)*dt/.12));
    for(let i=0;i<steps;i++){
      const nx=p.x+state.x*dt/steps,ny=p.y+state.y*dt/steps;
      const bank=window.FrontierTerrain.height(world,nx,ny);
      // Upward input can step onto a reachable bank near the surface.
      const ledge=bank>p.z+.2 && bank<=surface+.65 && p.z>=surface-.65 && (rise>0||forward>0);
      const feet=p.z;
      if(ledge)p.z=bank;
      if(bank<=p.z+.2 && !window.FrontierTerrain.blocked(game,nx,ny)){
        p.x=nx;p.y=ny;
      } else p.z=feet;
    }
    game.playerStep=null;
    p.grounded=false;
    p.verticalVelocity=0;
    const bottom=window.FrontierTerrain.height(world,p.x,p.y);
    const target=Math.max(bottom,Math.min(surface-.35,p.z+state.z*dt));
    const mesh=window.FrontierModelCollision.vertical(game,p,target);
    p.z=window.FrontierRoomPhysics.vertical(world,p,mesh);
    p.vx=p.x-oldX;p.vy=p.y-oldY;
    game.moving=Math.hypot(p.vx,p.vy)>.001;
    if(game.moving){
      p.walkTime=(p.walkTime||0)+dt;
      const length=Math.hypot(p.vx,p.vy);
      p.facingX=p.vx/length;p.facingY=p.vy/length;
    }
    if(p.z+(p.height||1.65)*.9<surface){
      state.air=Math.max(0,state.air-dt);
      if(!state.air){
        state.damageClock+=dt;
        if(state.damageClock>=1){p.hp=Math.max(0,p.hp-5);state.damageClock-=1;}
      }
    } else {state.air=12;state.damageClock=0;}
    return true;
  }

  MF.frontierMovement = {
    swim,
    tuning,
    movePlayer,
  };
})(window.MF);
