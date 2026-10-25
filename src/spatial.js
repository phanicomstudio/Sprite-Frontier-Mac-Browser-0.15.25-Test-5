/* MAINTAINER GUIDE
 * Native height-aware projectile sweeps and ricochets. Replaces the legacy 2D projectile functions after they load. Segment/AABB hits and terrain intersections choose the earliest collision, independent of display pixels.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function(MF){
  const root=window;
'use strict'  ;
  const originalCreate=MF.createProjectile;
// Intersect a swept segment with an expanded AABB using slab intervals. Return earliest normalized time or null.
  function boxHit(a,b,box,radius){
    let enter=0,leave=1;
    for(const axis of ['x','y','z']){
      const min=box.min[axis]-radius,max=box.max[axis]+radius,d=b[axis]-a[axis];
      if(Math.abs(d)<1e-9){
        if(a[axis]<min||a[axis]>max)return null;
      }
      else{
        let lo=(min-a[axis])/d,hi=(max-a[axis])/d;
        if(lo>hi)[lo,hi]=[hi,lo];
        enter=Math.max(enter,lo);
        leave=Math.min(leave,hi);
        if(enter>leave)return null;
      }
    }
    return enter;
  }
  const between=(a,b,t)=>({
    x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t
  }
  );
// Choose the nearest body/scenery/terrain collision; ignore the shooter and already penetrated entities.
  function sweep(game,a,b,radius,ownerId,ignoreIds){
    let result=null;
    const take=(t,id,kind)=>{
      if(t!==null&&t>=0&&t<=1&&(!result||t<result.t))result={
        t,id,kind
      }
      ;
    }
    ;
    const entities=[...game.maps.frontier.entities,...(game.sceneEvents||[]).filter(e=>e.solid)];
    if(ownerId!==game.player.id)entities.push({
      ...game.player,radius:MF.CONFIG.playerCollisionRadius,height:1.65
    }
    );
    const minX=Math.min(a.x,b.x)-radius,maxX=Math.max(a.x,b.x)+radius,minY=Math.min(a.y,b.y)-radius,maxY=Math.max(a.y,b.y)+radius;
    for(const e of entities){
      if(e.x+e.radius<minX||e.x-e.radius>maxX||e.y+e.radius<minY||e.y-e.radius>maxY)continue;
      if(e.id===ownerId||ignoreIds?.has(e.id)||e.dead||e.hidden||e.alive===false)continue;
      const z=e.z||0;
      if(Math.max(a.z,b.z)+radius<z||Math.min(a.z,b.z)-radius>z+e.height)continue;
      take(boxHit(a,b,{
        min:{
          x:e.x-e.radius,y:e.y-e.radius,z
        }
        ,max:{
          x:e.x+e.radius,y:e.y+e.radius,z:z+e.height
        }
      }
      ,radius),e.id,'body');
    }
    const distance=Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z),steps=Math.max(1,Math.ceil(distance/.08));
    const floor=t=>{
      const p=between(a,b,t);
      return p.z-FrontierTerrain.height(game.sourceWorld,p.x,p.y)-radius;
    }
    ;
    if(game.sourceWorld.terrain?.mode==='flat'){
      if(a.z<=radius)take(0,null,'terrain');
      else if(b.z<=radius)take((a.z-radius)/(a.z-b.z),null,'terrain');
    }
    else if(floor(0)<=0)take(0,null,'terrain');
    else for(let i=1;
    i<=steps;
    i++){
      const t=i/steps;
      if(result&&t>result.t+1/steps)break;
      if(floor(t)<=0){
        let lo=(i-1)/steps,hi=t;
        for(let n=0;
        n<14;
        n++){
          const mid=(lo+hi)/2;
          if(floor(mid)>0)lo=mid;
          else hi=mid;
        }
        take(hi,null,'terrain');
        break;
      }
    }
    for(const axis of ['x','y']){
      const delta=b[axis]-a[axis];
      if(a[axis]<radius||a[axis]>48-radius)take(0,null,'boundary');
      if(delta>0&&b[axis]>48-radius)take((48-radius-a[axis])/delta,null,'boundary');
      if(delta<0&&b[axis]<radius)take((radius-a[axis])/delta,null,'boundary');
    }
    return result;
  }
  MF.createProjectile=function(game,owner,weapon,direction){
    const shot=originalCreate(game,owner,weapon,direction),cam=FrontierRender.camera(game),pitch=cam.pitch+Math.atan(((cam.cy??96)-96)/360),muzzle=root.FrontierMuzzle?.point(owner,game)||{
      x:owner.x,y:owner.y,z:(owner.z||0)+.95
    }
    ;
    const far={
      x:cam.x+Math.sin(game.camera.yaw)*Math.cos(pitch)*60,y:cam.y+Math.cos(game.camera.yaw)*Math.cos(pitch)*60,z:cam.z+Math.sin(pitch)*60
    }
    ,aimStart=between(cam,far,Math.max(0,Math.min(.99,(((muzzle.x-cam.x)*Math.sin(game.camera.yaw)+(muzzle.y-cam.y)*Math.cos(game.camera.yaw))+.75)/(60*Math.cos(pitch))))),hit=sweep(game,aimStart,far,0,owner.id),target=between(aimStart,far,hit?.t??1);
    if(owner.id!==game.player.id){
      target.x=muzzle.x+direction.x*60;
      target.y=muzzle.y+direction.y*60;
      target.z=(game.player.z||0)+1;
    }
    const length=Math.hypot(target.x-muzzle.x,target.y-muzzle.y,target.z-muzzle.z)||1,horizontal=Math.hypot(target.x-muzzle.x,target.y-muzzle.y)/length;
// Preserve the original continuous angular spread; artwork never quantizes shots.
    const baseYaw=Math.atan2(target.x-muzzle.x,target.y-muzzle.y),spread=owner.id===game.player.id?Math.atan2(direction.x,direction.y)-game.camera.yaw:0,angle=baseYaw+spread+(muzzle.yawOffset||0),elevation=Math.asin((target.z-muzzle.z)/length)+(muzzle.pitchOffset||0);
    shot.direction={
      x:Math.sin(angle)*Math.cos(elevation),y:Math.cos(angle)*Math.cos(elevation),z:Math.sin(elevation)
    }
    ;
    shot.position={
      ...muzzle
    }
    ;
    shot.previousPosition={
      ...muzzle
    }
    ;
    shot.velocity={
      x:shot.direction.x*shot.speed,y:shot.direction.y*shot.speed,z:shot.direction.z*shot.speed
    }
    ;
    return shot;
  }
  ;
// Reflect against the impacted scenery face, add bounded random variation, and move outside the surface before continuing.
  function bounce(game,p,hit){
    if(hit.kind!=='body'||(p.ricochets||0)>=1)return false;
    const e=[...game.maps.frontier.entities,...(game.sceneEvents||[])].find(e=>e.id===hit.id);
    if(!e||['monster','npc','player'].includes(e.kind)||Math.random()> (e.ricochetChance??root.FrontierParameters?.get(game.sourceWorld,'ricochetChance')??.2))return false;
    const pos=p.position,r=p.radius,z=e.z||0;
    const faces=[{
      d:Math.abs(pos.x-(e.x-e.radius-r)),n:{
        x:-1,y:0,z:0
      }
    }
    ,{
      d:Math.abs(pos.x-(e.x+e.radius+r)),n:{
        x:1,y:0,z:0
      }
    }
    ,{
      d:Math.abs(pos.y-(e.y-e.radius-r)),n:{
        x:0,y:-1,z:0
      }
    }
    ,{
      d:Math.abs(pos.y-(e.y+e.radius+r)),n:{
        x:0,y:1,z:0
      }
    }
    ,{
      d:Math.abs(pos.z-(z-r)),n:{
        x:0,y:0,z:-1
      }
    }
    ,{
      d:Math.abs(pos.z-(z+e.height+r)),n:{
        x:0,y:0,z:1
      }
    }
    ];
    const n=faces.sort((a,b)=>a.d-b.d)[0].n,d=p.direction,dot=d.x*n.x+d.y*n.y+(d.z||0)*n.z;
    let v={
      x:d.x-2*dot*n.x+(Math.random()-.5)*.8,y:d.y-2*dot*n.y+(Math.random()-.5)*.8,z:(d.z||0)-2*dot*n.z+(Math.random()-.5)*.8
    }
    ;
    const outward=v.x*n.x+v.y*n.y+v.z*n.z;
    if(outward<.15){
      v.x+=(.15-outward)*n.x;
      v.y+=(.15-outward)*n.y;
      v.z+=(.15-outward)*n.z;
    }
    const length=Math.hypot(v.x,v.y,v.z);
    p.direction={
      x:v.x/length,y:v.y/length,z:v.z/length
    }
    ;
    p.velocity={
      x:p.direction.x*p.speed,y:p.direction.y*p.speed,z:p.direction.z*p.speed
    }
    ;
    p.position={
      x:pos.x+n.x*.025,y:pos.y+n.y*.025,z:pos.z+n.z*.025
    }
    ;
    p.previousPosition={
      ...p.position
    }
    ;
    p.ricochets=(p.ricochets||0)+1;
    return true;
  }
// Move a projectile within remaining range/lifetime, resolve its first hit, and handle penetration or one scenery ricochet.
  function advance(game,p,dt,ui,instant=false){
    const remaining=Math.max(0,p.maxRange-p.distanceTravelled),distance=instant?remaining:Math.min(remaining,p.speed*Math.min(dt,Math.max(0,p.lifetime-p.age))),a={
      ...p.position
    }
    ,b={
      x:a.x+p.direction.x*distance,y:a.y+p.direction.y*distance,z:a.z+(p.direction.z||0)*distance
    }
    ,hit=sweep(game,a,b,p.radius,p.ownerId,p.hitIds);
    p.previousPosition=a;
    p.position=between(a,b,hit?.t??1);
    p.distanceTravelled+=distance*(hit?.t??1);
    p.age+=dt;
    game.shotEffects.push({
      map:p.map,from:a,to:{
        ...p.position
      }
      ,z:p.position.z,color:p.visual.color,life:p.visual.life,maxLife:p.visual.life
    }
    );
    if(game.shotEffects.length>256)game.shotEffects.shift();
    if(hit){
      if(p.penetration>0&&hit.id&&!p.hitIds?.has(hit.id)){
        MF.resolveProjectileImpact(game,p,hit,ui);
        p.hitIds??=new Set();
        p.hitIds.add(hit.id);
        p.penetration--;
        const entity=game.runtime.entities.get(hit.id),exit=entity?boxHit({
          ...p.position,x:p.position.x+p.direction.x*.01,y:p.position.y+p.direction.y*.01,z:p.position.z+p.direction.z*.01
        }
        ,b,{
          min:{
            x:entity.x-entity.radius,y:entity.y-entity.radius,z:entity.z||0
          }
          ,max:{
            x:entity.x+entity.radius,y:entity.y+entity.radius,z:(entity.z||0)+entity.height
          }
        }
        ,p.radius):null;
        p.ignoreId=hit.id;
        p.position=between(p.position,b,Math.min(1,.03/Math.max(.03,distance)));
        return true;
      }
      if(bounce(game,p,hit))return true;
      MF.resolveProjectileImpact(game,p,hit,ui);
      return false;
    }
    if(instant||p.age>=p.lifetime||p.distanceTravelled>=p.maxRange){
      MF.resolveProjectileImpact(game,p,{
        id:null,kind:'expiry'
      }
      ,ui);
      return false;
    }
    return true;
  }
  MF.updateProjectiles=(game,dt,ui)=>{
    game.projectiles=game.projectiles.filter(p=>p.map===game.currentMapId&&advance(game,p,dt,ui));
  }
  ;
  MF.resolveHitscan=(game,p,ui)=>{
    for(let i=0;
    i<16&&advance(game,p,0,ui,true);
    i++);
  }
  ;
  MF.frontierSpatial={
    boxHit,sweep,bounce
  }
  ;
}
)(window.MF);
