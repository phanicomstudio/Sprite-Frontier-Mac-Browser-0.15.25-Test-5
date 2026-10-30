/* October 29, 2026: zoom-aware affine visibility and cosmetic LOD. Simulation, collision and locked camera-facing sprite presentation remain independent. */
(/* @function viewVisibility.install — Inputs: browser namespace. Publishes shared render bounds/fog/cosmetic scheduling; creates no active timers and never changes authored camera/fog settings. */function(root){

'use strict';
  const schedules=new WeakMap();

/* @function viewVisibility.bounds — Inputs: live game, actual camera and optional extra anchor-height margin in metres. Returns conservative XY viewport bounds for outdoor isometric cameras, otherwise the historical 52-metre origin neighborhood. Inverts every screen corner at low/high terrain-plus-sprite heights, so yaw, tilt, zoom, wide views and large sprites do not disappear at arbitrary depth. Terrain edits are scanned only when their identity/revision changes. */
function bounds(game,cam,margin=24){
    if(!cam.outdoorIsometric)return {
      minX:cam.x-52,minY:cam.y-52,maxX:cam.x+52,maxY:cam.y+52
    };
    const c=cam.room.camera,w=game.viewWidth||640,det=c.axisXX*c.axisYY-c.axisYX*c.axisXY;
    let extent=Math.max(8,Math.abs(game.sourceWorld.terrain?.amplitude||0)*2),low=(game.player.z||0)-extent,high=(game.player.z||0)+extent+margin;
    const cache=terrainRange(game.sourceWorld);
    low=Math.min(low,cache.min-margin);
    high=Math.max(high,cache.max+margin);
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    for(const z of [low,high])for(const sx of [-16,w+16])for(const sy of [-16,496]){
      const x=sx-c.screenX,y=sy-c.screenY+z*c.heightScale,wx=c.originX+(x*c.axisYY-y*c.axisYX)/det,wy=c.originY+(y*c.axisXX-x*c.axisXY)/det;
      minX=Math.min(minX,wx);
      minY=Math.min(minY,wy);
      maxX=Math.max(maxX,wx);
      maxY=Math.max(maxY,wy);
    }
    return {
      minX,minY,maxX,maxY
    };
  }

const terrainRanges=new WeakMap();

/* @function viewVisibility.terrainRange — Inputs: authored world. Returns cached conservative additive terrain-edit range in metres. Recomputes only on edited-data identity/revision, not every draw; malformed values are ignored by this read-only guard, world validation remains authoritative. */
function terrainRange(world){
    const t=world.terrain||{},prior=terrainRanges.get(world);
    if(prior?.edits===t.edits&&prior.revision===t.revision)return prior;
    let min=0,max=0;
    for(const value of Object.values(t.edits||{})){
      const z=typeof value==='number'?value:value?.height;
      if(Number.isFinite(z)){
        min=Math.min(min,z);
        max=Math.max(max,z);
      }
    }
    const next={
      edits:t.edits,revision:t.revision,min,max
    };
    terrainRanges.set(world,next);
    return next;
  }

/* @function viewVisibility.fog — Inputs: game and actual camera. Returns authored/runtime fog unchanged for perspective/fixed artwork, or copied range offset by the isometric player's forward depth. All geometry/sprites retain raw camera depth, matching CPU/GPU and terrain interpolation. The sky stays at zero depth and receives no fog; source settings are never overwritten. */
function fog(game,cam){
    const original=root.FrontierFog.settings(game);
    if(!cam.outdoorIsometric)return original;
    const offset=root.FrontierRender.depth(cam,game.player.x,game.player.y,game.player.z||0);
    return {
      ...original,start:original.start*.02+offset,end:original.end*.02+offset
    };
  }

/* @function viewVisibility.detail — Inputs: actual game/entity/projected anchor/camera and original selected animation frame. Returns cosmetic cached frame/light slot. Only small distant isometric sprites throttle animation/light sampling (5Hz below24px, 2Hz below12px), with 20% exit hysteresis. Nearby combat, deaths, player, directional row changes and all perspective sprites update fully. Actor AI, damage, collision and event updates are never throttled here. */
function detail(game,e,p,cam,frame){
    const pixels=(e.height||1.65)*p.scale,distance=Math.hypot(e.x-game.player.x,e.y-game.player.y),prior=schedule(game,e),full=!cam.outdoorIsometric||e.id==='player'||e.dead||distance<12;
    let tier=full?0:prior?.tier||0;
    if(!full){
      if(tier===2&&pixels<14.4)tier=2;
      else if(pixels<12)tier=2;
      else if(tier>=1&&pixels<28.8)tier=1;
      else tier=pixels<24?1:0;
    }
    const now=game.elapsed||0,interval=tier===2?.5:tier===1?.2:0;
    if(!prior||prior.tier!==tier||!interval||now>=prior.until||prior.frame.row!==frame.row){
      const next={
        tier,frame,until:now+interval,light:null
      };
      let cache=schedules.get(game);
      if(!cache){
        cache=new Map();
        schedules.set(game,cache);
      }
      if(cache.size>=24000)cache.clear();
      cache.set(e.id,next);
      return next;
    }
    return prior;
  }

/* @function viewVisibility.schedule — Inputs: current game and stable entity. Returns its transient cosmetic cache across original runtime entity rebuilds. Each game owns at most 24,000 entries and a cell/session replacement releases the WeakMap key; no persistent actor state is modified. */
function schedule(game,e){
    return schedules.get(game)?.get(e.id);
  }

root.FrontierViewVisibility={
    bounds,fog,detail
  };


})(window);
