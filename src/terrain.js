/* MAINTAINER GUIDE
 * Height-field ground, step-up support and jump clearance. Terrain samples are world elevations. Grounded support can be terrain or an object top; horizontal collision compares feet elevation to obstacle height.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function (root) {
'use strict'  ;
// Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields.
  function validate(value) {
    if (value === undefined) return {
      mode: 'flat', amplitude: 0, frequency: .12
    }
    ;
    if (!value || !['flat', 'hills'].includes(value.mode) || !Number.isFinite(value.amplitude) || value.amplitude < 0 || value.amplitude > 6 || !Number.isFinite(value.frequency) || value.frequency < .03 || value.frequency > .4) throw Error('Invalid terrain settings.');
    return {
      mode: value.mode, amplitude: value.amplitude, frequency: value.frequency
    }
    ;
  }
// Sample deterministic terrain elevation. Callers use the same function for rendering, collision and object placement.
  function height(world, x, y) {
    const t = world.terrain;
    if (!t || t.mode === 'flat') return 0;
    const distance = Math.hypot(x - world.spawn.x, y - world.spawn.y);
    let blend = Math.max(0, Math.min(1, (distance - 4) / 5));
    blend = blend * blend * (3 - 2 * blend);
    const hill = (cx, cy, radius) => Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / radius ** 2);
    return blend * t.amplitude * (.45 * Math.sin((x - 24) * t.frequency) * Math.cos((y - 24) * t.frequency) + 1.25 * hill(33, 32, 6) + .9 * hill(13, 35, 5) - .45 * hill(34, 14, 5));
  }
// Start a jump only when alive and grounded; vertical velocity and gravity determine clearance.
  function jump(player,world) {
    if (player.grounded !== false && player.hp > 0) {
      player.grounded = false;
      player.verticalVelocity = root.FrontierParameters?Math.sqrt(2*root.FrontierParameters.get(world,'gravity')*root.FrontierParameters.get(world,'jumpHeight')):4.8;
      return true;
    }
    return false;
  }
// Integrate vertical movement, choose support height, and clamp landing to terrain or reachable object tops.
  function ground(player, world, dt, solids = []) {
    let floor = height(world, player.x, player.y);
    const feet=player.z??floor,step=root.FrontierParameters?.get(world,'stepHeight')??.3;
    for(const e of solids){
      if(e.dead||e.kind==='monster'||e.solid===false)continue;
      if(Math.abs(player.x-e.x)>=e.radius+.13||Math.abs(player.y-e.y)>=e.radius+.13)continue;
      const top=(e.z||0)+e.height;
      if(top<=feet+.001||(player.grounded!==false&&top-feet<=step))floor=Math.max(floor,top);
    }
    player.groundZ = floor;
    if(player.grounded!==false&&feet-floor>step){
      player.grounded=false;
      player.verticalVelocity=0;
    }
    if (player.grounded !== false) {
      player.z = floor;
      player.verticalVelocity = 0;
      player.grounded = true;
      return;
    }
    player.verticalVelocity = (player.verticalVelocity || 0) - (root.FrontierParameters?.get(world,'gravity')??12) * dt;
    player.z = (player.z || 0) + player.verticalVelocity * dt;
    if (player.z <= floor) {
      player.z = floor;
      player.verticalVelocity = 0;
      player.grounded = true;
    }
  }
// Test world bounds and solid footprints for NPC/editor movement. Player step/jump collision is handled by terrain.js.
  function blocked(game,x,y,radius=.13){
    if(x<.5||y<.5||x>47.5||y>47.5)return true;
    const p=game.player,feet=p.z??height(game.sourceWorld,p.x,p.y),step=root.FrontierParameters?.get(game.sourceWorld,'stepHeight')??.3;
    return [...game.maps.frontier.entities,...(game.sceneEvents||[]).filter(e=>e.solid)].some(e=>{
      if(e.dead||Math.abs(e.x-x)>=e.radius+radius||Math.abs(e.y-y)>=e.radius+radius)return false;
      const top=(e.z||0)+e.height;
      if(feet>=top-.001)return false;
      return !(p.grounded!==false&&e.kind!=='monster'&&top-feet<=.3);
    }
    );
  }
  root.FrontierTerrain = {
    validate, height, jump, ground, blocked
  }
  ;
}
)(typeof window === 'undefined' ? globalThis : window);
