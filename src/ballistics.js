/* October 28, 2026 - 0.16.7: see ITERATION-0.16.7.md for current combat/authoring behavior; older comments below are retained historical contracts where explicitly superseded. */
/* October 26: receiver-only terrain marching uses 0.25 m steps on the metre-grid heightfield, followed by the same contact bisection. Projectile marching remains 0.05 m; mesh triangles remain exact swept queries in both modes. */
/* October 26: optional geometryOnly sweep is reserved for sun-shadow receivers. Default projectile queries are unchanged; receiver queries omit actor bodies and nonspatial billboard props. */
/* October 22, 2026 — independent finite-projectile implementation.
 * No Quake/OpenMW source or assets are copied. Coordinates are world metres,
 * Z up, time seconds. Supersedes spatial.advance penetration/ricochet policy.
 * Geometry always uses complete collision surfaces, never editor cutaways. */
(/* @function ballistics.install — Inputs: browser namespace. Returns nothing; replaces projectile integration with shared swept collision and publishes pure sweep helpers. Does not create a game or load assets. Existing damage/party rules remain owned by the combat adapter. */ function(root) {
  "use strict";
  const MF=root.MF, spatial=MF.frontierSpatial, originalCreate=MF.createProjectile;
  /* @function ballistics.point — Inputs: world endpoints and normalized interpolation factor. Returns new XYZ metres without mutating inputs. */
  function point(a,b,t){return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t};}
  /* @function ballistics.localPoint — Inputs: world point and authored upright oriented box. Returns box-local XYZ metres; yaw is radians and box Z is its base. No mutation. */
  function localPoint(p,e){const c=Math.cos(e.yaw||0),s=Math.sin(e.yaw||0),x=p.x-e.x,y=p.y-e.y;return {x:c*x+s*y,y:-s*x+c*y,z:p.z-(e.z??-30)};}
  /* @function ballistics.box — Inputs: endpoints, authored box and projectile radius metres. Returns earliest normalized contact or null. Tests the actual rotated volume; projectiles are conservatively expanded by radius, including starting overlap. Missing blocker elevation spans -30..100 metres. No scene edits. */
  function box(a,b,e,r){return spatial.boxHit(localPoint(a,e),localPoint(b,e),{min:{x:-e.w/2,y:-e.d/2,z:0},max:{x:e.w/2,y:e.d/2,z:e.h??130}},r);}
  /* @function ballistics.sweep — Inputs: live game, world endpoints, radius metres and optional shooter ID. Returns earliest contact {t,id,kind} or null across full room volumes, model mesh/custom boxes, live bodies, terrain and map bounds. Uses the existing shared model BVH; no asset decoding or camera/cutaway filtering. Explicitly nonsolid trigger/item graphics are ignored. Zero-radius triangle queries use a 0.1mm numerical skin; tiny conservative corner contacts may precede a spherical contact. */
  /* @function ballistics.sweep163 — Inputs: game, world endpoints, radius metres, optional owner ID and geometryOnly Boolean. Returns earliest normalized contact or null without applying damage. October 26: receiver queries omit actors/nonspatial billboards and march terrain at 0.25 m; default projectile behavior and exact mesh sweeps remain unchanged. */
  function sweep(game,a,b,r=0.015,ownerId=null,geometryOnly=false){
    let best=null;
    /* @function ballistics.take — Inputs: normalized candidate time/null, instance ID and contact kind. Returns nothing; retains earliest segment contact including exact endpoints. Equal-distance geometry wins over later body enumeration. No damage or scene mutation. */
    function take(t,id,kind){if(t!==null&&Number.isFinite(t)&&t>=0&&t<=1&&(!best||t<best.t))best={t,id,kind};}
    const world=game.sourceWorld,start=[a.x,a.y,a.z],end=[b.x,b.y,b.z],skin=Math.max(.0001,r),half=[skin,skin,skin];
    for(const e of world.interior?.blockers||[])take(box(a,b,e,r),e.id,'room');
    for(const e of world.interior?.primitives||[]){
      if(e.shape!=='round'){take(box(a,b,e,r),e.id,'room');continue;}
      if(root.FrontierRoomPhysics.overlap(e,a.x,a.y,r)&&a.z+r>=e.z&&a.z-r<=e.z+e.h)take(0,e.id,'room');
      for(const face of root.FrontierRoundGeometry.primitiveFaces(e))for(let i=1;i<face.length-1;i++)take(root.FrontierModelMeshCollision.sweepTriangle([face[0],face[i],face[i+1]],start,end,half),e.id,'room');
    }
    const seen=new Set();
    for(const e of [...(game.maps?.frontier?.entities||[]),...(game.sceneEvents||[]),game.player]){
      if(!e||seen.has(e.id)||e.id===ownerId||e.hidden||e.alive===false || (geometryOnly && (!e.spatial || e.combat || e===game.player)))continue;seen.add(e.id);
      if(e.spatial){
        if(e.spatial.collisionMode==='none')continue;
        const matrix=root.FrontierModelEvents.matrix(e);
        if(e.spatial.collisionMode==='mesh'){
          const asset=root.FrontierModelLibrary.get(e.modelId||e.spatial.modelId);
          if(asset?.scene)take(root.FrontierModelMeshCollision.query(asset,matrix,start,end,half),e.id,'model');
        }else for(const volume of e.spatial.collisionBoxes||[]){
          const corners=root.FrontierModelTransform.corners(volume,matrix);
          // Sweep every face, and classify an initial enclosed point as contact.
          if(root.FrontierModelCollision.intersects(corners,start,half))take(0,e.id,'model');
          for(const f of [[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]]){
            take(root.FrontierModelMeshCollision.sweepTriangle([corners[f[0]],corners[f[1]],corners[f[2]]],start,end,half),e.id,'model');
            take(root.FrontierModelMeshCollision.sweepTriangle([corners[f[0]],corners[f[2]],corners[f[3]]],start,end,half),e.id,'model');
          }
        }
        continue;
      }
      // October 28: static sprite cover uses opaque pixels on the displayed plane, independent of movement boxes.
      if(!geometryOnly&&!e.combat&&e!==game.player&&!e.behaviorOwned&&!e.through&&root.FrontierSprites?.cover167){const t=root.FrontierSprites.cover167(game,e,a,b);if(t!==undefined){take(t,e.id,'sprite');continue;}}
      if(e.solid===false&&!e.combat&&e!==game.player)continue;
      const radius=e.radius??.13,z=e.z||0,height=e.height??1.65;
      take(spatial.boxHit(a,b,{min:{x:e.x-radius,y:e.y-radius,z},max:{x:e.x+radius,y:e.y+radius,z:z+height}},r),e.id,'body');
    }
    /* @function ballistics.clearance — Inputs: normalized segment time. Returns metres between projectile bottom and sampled terrain. Reads only authored height data; terrain validation errors propagate. */
    function clearance(t){const p=point(a,b,t);return p.z-root.FrontierTerrain.height(world,p.x,p.y)-r;}
    const terrainActive=!world.interior||world.interior.outdoor||world.interior.mode==='fixed';
    if(!terrainActive){} // Room floor primitives, including basements, own support.
    else if(clearance(0)<=0)take(0,null,'terrain');
    else if(world.terrain?.mode==='flat'&&!Object.keys(world.terrain?.edits||{}).length){if(clearance(1)<=0)take(clearance(0)/(clearance(0)-clearance(1)),null,'terrain');}
    else {const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z)/(geometryOnly?.25:.05)));for(let i=1;i<=steps;i++){if(best&&(i-1)/steps>best.t)break;if(clearance(i/steps)>0)continue;let lo=(i-1)/steps,hi=i/steps;for(let n=0;n<14;n++){const mid=(lo+hi)/2;if(clearance(mid)>0)lo=mid;else hi=mid;}take(hi,null,'terrain');break;}}
    for(const axis of ['x','y']){const limit=axis==='x'?(world.width??world.size):(world.height??world.size),d=b[axis]-a[axis];if(a[axis]<r||a[axis]>limit-r)take(0,null,'boundary');if(d>0&&b[axis]>limit-r)take((limit-r-a[axis])/d,null,'boundary');if(d<0&&b[axis]<r)take((r-a[axis])/d,null,'boundary');}
    return best;
  }
  MF.createProjectile=/* @function ballistics.create — Inputs: live game, shooter, weapon and spread direction. Returns original camera-calibrated shot with copied gravity/explosion policy and immutable launch velocity. Adds no projectile to the active list; pattern owns insertion. New vertical angular spread uses the same authored accuracy deviation; shooter movement never retargets a live shot. */ function(game,owner,weapon,direction){
    const p=originalCreate(game,owner,weapon,direction);
    const sigma=root.FrontierWeaponTuning?.radians(game.sourceWorld,weapon)||0;
    if(sigma>0){const u=Math.max(1e-12,Math.random()),pitch=Math.asin(Math.max(-1,Math.min(1,p.direction.z)))+Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*Math.random())*sigma,yaw=Math.atan2(p.direction.x,p.direction.y);p.direction={x:Math.sin(yaw)*Math.cos(pitch),y:Math.cos(yaw)*Math.cos(pitch),z:Math.sin(pitch)};}
    p.velocity={x:p.direction.x*p.speed,y:p.direction.y*p.speed,z:p.direction.z*p.speed};
    if(weapon.launchLift)p.velocity.z+=weapon.launchLift;
    p.gravity=weapon.gravity||0;p.blastRadius=weapon.blastRadius||0;p.blastDamage=weapon.blastDamage??p.damage;p.penetration=0;
    // Cover the gun's short offset as well as later travel: a barrel placed
    // beyond a thin wall cannot spawn a shot on its far side.
    const anchor={x:owner.x,y:owner.y,z:(owner.z||0)+Math.min(1.1,(owner.height||1.65)*.65)};
    const contact=sweep(game,anchor,p.position,p.radius,owner.id);
    if(contact){p.position=point(anchor,p.position,contact.t);p.previousPosition={...p.position};p.launchContact=contact;}
    if(game.muzzleFlashes && (!owner.lastFlash167 || game.elapsed-owner.lastFlash167.time>.001 || owner.lastFlash167.time!==game.elapsed)){owner.lastFlash167={time:game.elapsed};game.muzzleFlashes.push({map:game.currentMapId,x:p.position.x,y:p.position.y,z:p.position.z,life:.085,maxLife:.085,color:'#ffe5a1',calibrated:true});if(game.muzzleFlashes.length>64)game.muzzleFlashes.shift();}
    return p;
  };
  /* @function ballistics.explosion — Inputs: live game, terminal shot, contact record and existing combat UI. Returns nothing; applies direct damage once and bounded reference-style radial falloff with full-world obstruction checks, then emits bounded generic particles. Direct target is excluded from splash to avoid duplicate damage. Existing combat adapter owns friendly-fire/death/event rules. Expiry detonates explosive shots; ordinary expiry is not a blast. */
  function explosion(game,p,hit,ui){
    MF.resolveProjectileImpact(game,p,hit,ui);
    if(!p.blastRadius)return;
    const seen=new Set();
    for(const e of [game.player,...(game.maps?.frontier?.entities||[]),...(game.sceneEvents||[])]){
      if(!e||seen.has(e.id)||e.id===hit.id||e.hidden||e.dead||!Number.isFinite(e.hp))continue;seen.add(e.id);
      const center={x:e.x,y:e.y,z:(e.z||0)+(e.height||1.65)*.5},distance=Math.hypot(center.x-p.position.x,center.y-p.position.y,center.z-p.position.z);
      if(distance>=p.blastRadius)continue;
      // Back off from the impacted surface into incoming free space. Starting
      // a line-of-sight ray inside the wall would suppress every nearby hit.
      const origin={x:p.position.x-p.direction.x*(p.radius+.002),y:p.position.y-p.direction.y*(p.radius+.002),z:p.position.z-p.direction.z*(p.radius+.002)};
      const obstacle=sweep(game,origin,center,0.0001,p.ownerId);
      if(obstacle&&obstacle.id!==e.id)continue;
      const damage=p.blastDamage*(1-(2/3)*distance/p.blastRadius)*(e.id===p.ownerId ? .5 : 1);
      if(e===game.player){const length=Math.max(.001,distance),speed=Math.min(20,damage*.32);game.blastImpulse={x:(center.x-p.position.x)/length*speed,y:(center.y-p.position.y)/length*speed};e.verticalVelocity=(e.verticalVelocity||0)+(center.z-p.position.z)/length*speed;e.grounded=false;}
      MF.resolveProjectileImpact(game,{...p,id:p.id+'-splash-'+e.id,damage,allowSelfDamage:e.id===p.ownerId},{id:e.id,kind:'blast'},ui);
    }
    for(let i=0;i<18;i++){if(game.particles.length>=512)break;const a=Math.random()*Math.PI*2,speed=1+Math.random()*3;game.particles.push({x:p.position.x,y:p.position.y,z:p.position.z,vx:Math.sin(a)*speed,vy:Math.cos(a)*speed,vz:.02+Math.random()*.08,life:.3,maxLife:.3,color:i%2?'#ffbf55':'#b65b36',map:p.map});}
    game.runtime.events.emit('projectile.explosion',{projectileId:p.id,position:{...p.position},radius:p.blastRadius});
  }
  /* @function ballistics.advance — Inputs: active game, mutable projectile, nonnegative dt seconds and combat UI. Returns whether shot survives. Sweeps the entire straight segment, or 1/120s gravity substeps with a 0.5s safety cap (runtime frames cap at .05s). Earliest contact is terminal; no penetration, ricochet or camera-relative movement. Range/lifetime expiry resolves once. Mutates only this shot/effects plus existing impact side effects. Blast knockback has a separate collision-checked, damped player channel; it never changes base movement settings. */
  function advance(game,p,dt,ui){
    if(p.terminal)return false;
    if(p.launchContact){p.terminal=true;explosion(game,p,p.launchContact,ui);return false;}
    let left=Math.min(Math.max(0,dt),p.gravity ? .5 : 10);
    while(left>1e-10){
      const step=Math.min(left,p.gravity?1/120:left,Math.max(0,p.lifetime-p.age));
      if(step<=1e-10)break;
      const a={...p.position},v=p.velocity||{x:p.direction.x*p.speed,y:p.direction.y*p.speed,z:p.direction.z*p.speed};
      const b={x:a.x+v.x*step,y:a.y+v.y*step,z:a.z+v.z*step-.5*(p.gravity||0)*step*step};
      const distance=Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z),fraction=Math.min(1,Math.max(0,p.maxRange-p.distanceTravelled)/Math.max(1e-12,distance)),end=point(a,b,fraction),hit=sweep(game,a,end,p.radius,p.ownerId);
      p.previousPosition=a;p.position=point(a,end,hit?.t??1);p.distanceTravelled+=distance*fraction*(hit?.t??1);p.age+=step;p.velocity={x:v.x,y:v.y,z:v.z-(p.gravity||0)*step};left-=step;
      const speed=Math.hypot(p.velocity.x,p.velocity.y,p.velocity.z)||1;p.direction={x:p.velocity.x/speed,y:p.velocity.y/speed,z:p.velocity.z/speed};
      game.shotEffects.push({map:p.map,from:a,to:{...p.position},z:p.position.z,color:p.visual.color,life:p.visual.life,maxLife:p.visual.life});if(game.shotEffects.length>256)game.shotEffects.shift();
      if(hit){p.terminal=true;explosion(game,p,hit,ui);return false;}
      if(fraction<1||p.age>=p.lifetime-1e-9||p.distanceTravelled>=p.maxRange-1e-9)break;
    }
    if(p.age>=p.lifetime-1e-9||p.distanceTravelled>=p.maxRange-1e-9){p.terminal=true;explosion(game,p,{id:null,kind:'expiry'},ui);return false;}
    return true;
  }
  MF.updateProjectiles=/* @function ballistics.update — Inputs: active game, elapsed seconds, combat UI. Returns nothing; replaces active-cell shots with surviving swept projectiles. Cell-local projectiles never transfer between maps; impact particles have a separate bounded lifetime. */ function(game,dt,ui){
    const impulse=game.blastImpulse;
    if(impulse&&dt>0){const p=game.player;const stepState=game.playerStep;for(const axis of ['x','y']){const distance=impulse[axis]*dt,count=Math.max(1,Math.ceil(Math.abs(distance)/.05));for(let i=0;i<count;i++){const next=p[axis]+distance/count;if(!root.FrontierTerrain.blocked(game,axis==='x'?next:p.x,axis==='y'?next:p.y,p.radius||.13))p[axis]=next;else {impulse[axis]=0;break;}}}game.playerStep=stepState;const decay=Math.exp(-5*dt);impulse.x*=decay;impulse.y*=decay;if(Math.hypot(impulse.x,impulse.y)<.01)game.blastImpulse=null;}
    game.projectiles=game.projectiles.filter(/* @function ballistics.keepShot — Inputs: current projectile. Returns active-cell survival after shared integration; may resolve one terminal impact. */function(p){return p.map===game.currentMapId&&advance(game,p,dt,ui);});};
  MF.resolveHitscan=/* @function ballistics.retireHitscan — Inputs: game, a created projectile and unused UI. Returns nothing; compatibility callers enqueue finite-speed travel instead of resolving an instant hit. Duplicate insertion is ignored. */function(game,p,ui){if(!game.projectiles.includes(p))game.projectiles.push(p);};
  root.FrontierBallistics={sweep,advance,box};
})(window);
