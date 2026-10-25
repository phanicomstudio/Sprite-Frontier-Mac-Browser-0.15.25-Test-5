/* MAINTAINER GUIDE
 * Height-field ground, step-up support and jump clearance. Terrain samples are world elevations. Grounded support can be terrain or an object top; horizontal collision compares feet elevation to obstacle height.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(/* @function terrain.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier terrain. */ function (root) {
'use strict'  ;
// Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields.
  /* @function terrain.validate.2 — Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields. Inputs: value. Uses: a list of "flat", "hills", "random" includes; number is finite; error; validate edits. Returns: a record containing mode, amplitude, frequency; a record containing mode, amplitude, frequency, edits, revision. */ function validate(value) {
    if (value === undefined) return {
      mode: 'flat', amplitude: 0, frequency: .12
    }
    ;
    if (!value || !['flat', 'hills', 'random'].includes(value.mode) || !Number.isFinite(value.amplitude) || value.amplitude < 0 || value.amplitude > 6 || !Number.isFinite(value.frequency) || value.frequency < .03 || value.frequency > .4) throw Error('Invalid terrain settings.');
    return {
      mode: value.mode, amplitude: value.amplitude, frequency: value.frequency, edits: validateEdits(value.edits), revision:value.revision||0
    }
    ;
  }
// Sample deterministic terrain elevation. Callers use the same function for rendering, collision and object placement.
  const phases=new WeakMap();
  /* @function terrain.baseHeight.3 — Calculates deterministic terrain elevation before authored edits. Inputs: world; x; y. Updates: hash; phase; blend. Uses: phases get; c char code at; phases set; hill. Returns: 0; t amplitude multiplied by math sin using x multiplied by t frequency plus phase multiplied by math cos using y multiplied by t frequency minus phase multiplied by 0.65 plus math sin using x plus y multiplied by t frequency multiplied by 0.53 plus phase multiplied by 0.35. */ function baseHeight(world, x, y) {
    const t = world.terrain;
    if (!t || t.mode === 'flat') return 0;
    if(t.mode==='random'){let phase=phases.get(world);if(phase===undefined){let hash=0;for(const c of world.seed)hash=(hash*31+c.charCodeAt(0))|0;phase=(hash>>>0)/4294967296*Math.PI*2;phases.set(world,phase);}return t.amplitude*(Math.sin(x*t.frequency+phase)*Math.cos(y*t.frequency-phase)*.65+Math.sin((x+y)*t.frequency*.53+phase)*.35);}
    const distance = Math.hypot(x - world.spawn.x, y - world.spawn.y);
    let blend = Math.max(0, Math.min(1, (distance - 4) / 5));
    blend = blend * blend * (3 - 2 * blend);
    const hill = /* @function terrain.hill.4 — Returns math exp using - x minus cx raised to 2 plus y minus cy raised to 2 divided by radius raised to 2. Inputs: cx; cy; radius. Returns: math exp using - x minus cx raised to 2 plus y minus cy raised to 2 divided by radius raised to 2. */ (cx, cy, radius) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / radius ** 2);
    return blend * t.amplitude * (.45 * Math.sin((x - world.spawn.x) * t.frequency) * Math.cos((y - world.spawn.y) * t.frequency) + 1.25 * hill(world.spawn.x+9, world.spawn.y+8, 6) + .9 * hill(world.spawn.x-11, world.spawn.y+11, 5) - .45 * hill(world.spawn.x+10, world.spawn.y-10, 5));
  }
// Edits are limited and validated independently from terrain generation settings.
  /* @function terrain.validateEdits.5 — Edits are limited and validated independently from terrain generation settings. Inputs: assignment pattern. Updates: out at k. Uses: array is array; error; object keys; object entries. Returns: out. */ function validateEdits(edits={}){if(!edits||typeof edits!=='object'||Array.isArray(edits))throw Error('Terrain edits must be an object.');if(Object.keys(edits).length>50000)throw Error('Terrain exceeds 50,000 edited vertices.');const out={};for(const [k,v]of Object.entries(edits)){if(!/^\d+,\d+$/.test(k)||!Number.isFinite(v)||Math.abs(v)>30)throw Error('Invalid terrain edit.');out[k]=v;}return out;}
  /* @function terrain.height.6 — Samples the world’s terrain elevation, including authored edits. Inputs: world; x; y. Uses: base height; at. Returns: base height using world, x, y; base height using world, x, y plus at using 0, 0 multiplied by 1 minus fx plus at using 1, 0 multiplied by fx multiplied by 1 minus fy plus at using 0, 1 multiplied by 1 minus fx plus at using 1, 1 multiplied by fx multiplied by fy. */ function height(world,x,y){const edits=world.terrain?.edits;if(!edits)return baseHeight(world,x,y);const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;const at=/* @function terrain.at.7 — Returns edits at ix plus dx plus "," plus iy plus dy or 0. Inputs: dx; dy. Returns: edits at ix plus dx plus "," plus iy plus dy or 0. */ (dx,dy)=>edits[(ix+dx)+','+(iy+dy)]||0;return baseHeight(world,x,y)+(at(0,0)*(1-fx)+at(1,0)*fx)*(1-fy)+(at(0,1)*(1-fx)+at(1,1)*fx)*fy;}
// Start a jump only when alive and grounded; vertical velocity and gravity determine clearance.
  /* @function terrain.jump.8 — Start a jump only when alive and grounded; vertical velocity and gravity determine clearance. Inputs: player; world. Updates: player grounded; player vertical velocity. Uses: root frontier parameters get. Returns: true; false. */ function jump(player,world) {
    if (player.grounded !== false && player.hp > 0) {
      player.grounded = false;
      player.verticalVelocity = root.FrontierParameters?Math.sqrt(2*root.FrontierParameters.get(world,'gravity')*root.FrontierParameters.get(world,'jumpHeight')):4.8;
      return true;
    }
    return false;
  }
// Integrate vertical movement, choose support height, and clamp landing to terrain or reachable object tops.
  /* @function terrain.ground.9 — Integrate vertical movement, choose support height, and clamp landing to terrain or reachable object tops. Inputs: player; world; dt; assignment pattern; assignment pattern. Updates: floor; player ground z; player grounded; player vertical velocity; player z. Uses: height; root frontier parameters get; root frontier model collision support; root frontier model collision vertical. Returns: without a result. */ function ground(player, world, dt, solids = [], game = null) {
    let floor = height(world, player.x, player.y);
    const feet=player.z??floor,step=root.FrontierParameters?.get(world,'stepHeight')??.3;
    for(const e of solids){
      if(e.dead||e.kind==='monster'||e.solid===false)continue;
      if(Math.abs(player.x-e.x)>=e.radius+.13||Math.abs(player.y-e.y)>=e.radius+.13)continue;
      const top=(e.z||0)+e.height;
      if(top<=feet+.001||(player.grounded!==false&&top-feet<=step))floor=Math.max(floor,top);
    }
    if(game){const mesh=root.FrontierModelCollision?.support(game,player.x,player.y,-10000,feet+(player.grounded!==false?step:.001));if(mesh!==null&&mesh!==undefined)floor=Math.max(floor,mesh);}
    player.groundZ = floor;
    if(player.grounded!==false&&feet-floor>step){
      player.grounded=false;
      player.verticalVelocity=0;
    }
    if (player.grounded !== false) {
      // Ground following must also sweep down: a steep bevel or railing can
      // support the body above the walkable floor. An unconditional snap would
      // put the body inside that triangle and block every subsequent input.
      player.z = game && floor < feet ? root.FrontierModelCollision.vertical(game,player,floor) : floor;
      player.groundZ = player.z;
      player.verticalVelocity = 0;
      player.grounded = true;
      return;
    }
    player.verticalVelocity = (player.verticalVelocity || 0) - (root.FrontierParameters?.get(world,'gravity')??12) * dt;
    const next=(player.z||0)+player.verticalVelocity*dt;
    player.z=game?root.FrontierModelCollision.vertical(game,player,next):next;
    if(Math.abs(player.z-next)>1e-6){if(player.verticalVelocity<0){player.grounded=true;player.groundZ=player.z;}player.verticalVelocity=0;}
    if (player.z <= floor) {
      player.z = floor;
      player.verticalVelocity = 0;
      player.grounded = true;
    }
  }
// Test world bounds and solid footprints for NPC/editor movement. Player step/jump collision is handled by terrain.js.
  /* @function terrain.blocked.10 — Test world bounds and solid footprints for NPC/editor movement. Player step/jump collision is handled by terrain.js. Inputs: game; x; y; assignment pattern. Updates: game player step; step z; x; y. Uses: root frontier model collision blocked; root frontier model collision step; root frontier interior blocked; height. Returns: true; true. */ function blocked(game,x,y,radius=.13){
    game.playerStep=null;let stepZ=null;
    if(root.FrontierModelCollision?.blocked(game,x,y,radius)){stepZ=root.FrontierModelCollision.step(game,x,y,radius);if(stepZ===null)return true;}
    if(stepZ){x=stepZ.x;y=stepZ.y;}
    if(x<.5||y<.5||x>(game.sourceWorld.width??game.sourceWorld.size)-.5||y>(game.sourceWorld.height??game.sourceWorld.size)-.5)return true;
    if(root.FrontierInterior?.blocked(game.sourceWorld,x,y,radius,game.player.z||0))return true;

      const p=game.player,feet=p.z??height(game.sourceWorld,p.x,p.y),step=root.FrontierParameters?.get(game.sourceWorld,'stepHeight')??.3;
    const occupied = (root.FrontierActivity?root.FrontierActivity.query(game,x-2,y-2,x+2,y+2,true):[...game.maps.frontier.entities,...(game.sceneEvents||[]).filter(/* @function terrain.callback.11 — Returns e solid. Inputs: e. Returns: e solid. */ e=>e.solid)]).some(/* @function terrain.callback.12 — Provides the callback for root frontier activity selects root frontier activity query using game, x minus 2, y minus 2 or a list of spread element, spread element some. Inputs: e. Returns: false; false. */ e=>{
      if(e.dead||Math.abs(e.x-x)>=e.radius+radius||Math.abs(e.y-y)>=e.radius+radius)return false;
      const top=(e.z||0)+e.height;
      if(feet>=top-.001)return false;
      return !(p.grounded!==false&&e.kind!=='monster'&&top-feet<=.3);
    }
    );
    if(!occupied&&stepZ!==null)game.playerStep=stepZ;
    return occupied;
  }
  root.FrontierTerrain = {
    validate, height, baseHeight, jump, ground, blocked
  }
  ;
}
)(typeof window === 'undefined' ? globalThis : window);




