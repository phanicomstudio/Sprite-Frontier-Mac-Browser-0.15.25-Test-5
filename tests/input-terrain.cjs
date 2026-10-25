// Regression/history harness: assertions document expected behavior. Older browser harnesses use historical controls; browser06.cjs is current acceptance.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),c=vm.createContext({Math,structuredClone,console,setTimeout});c.window=c;c.globalThis=c;c.MF={CONFIG:{playerCollisionRadius:.13}};
for(const file of ['project-data.js','events.js','terrain.js','sky.js','world.js','input.js','movement.js','legacy/geometry.js','adapter.js','legacy/projectiles.js','legacy/combat.js','render.js','spatial.js'])vm.runInContext(fs.readFileSync(path.join(root,'src',file),'utf8'),c,{filename:file});
const I=c.FrontierInput,T=c.FrontierTerrain,MF=c.MF;
assert.equal(I.stick(.05,.05).x,0);assert(Math.abs(I.stick(1,1).x-Math.SQRT1_2)<1e-10);
const buttons=Array.from({length:16},()=>({pressed:false,value:0})),pad={id:'test',index:0,connected:true,mapping:'standard',axes:[0,-1,1,0],buttons};
const reader=I.gamepadReader();buttons[7].pressed=true;let frame=reader.poll([pad]);assert.equal(frame.move.forward,1);assert.equal(frame.look.x,1);assert(frame.actions.includes('fire'));assert.equal(reader.poll([pad]).actions.length,0);reader.poll([pad],false);assert.equal(reader.poll([pad],true).actions.length,0);buttons[7].pressed=false;reader.poll([pad]);buttons[7].pressed=true;assert(reader.poll([pad]).actions.includes('fire'));assert(!reader.poll([]).connected);assert.equal(reader.poll([]).move.forward,0);
const mouse=I.mouseLook();assert.equal(mouse.motion({clientX:10,clientY:10},false,true).x,0);assert.equal(mouse.motion({clientX:20,clientY:30},false,true).x,10);assert.equal(mouse.motion({clientX:100,clientY:100},false,false).x,0);assert.equal(mouse.motion({clientX:120,clientY:120},false,true).x,0);assert.equal(mouse.motion({movementX:7,movementY:-3},true,true).y,-3);
const world={schemaVersion:'sprite-frontier/1',seed:'terrain',size:48,spawn:{x:24,y:24},objects:[],events:[],terrain:{mode:'hills',amplitude:2.8,frequency:.12},sky:structuredClone(c.FrontierSky.defaults)};
assert.equal(T.height(world,24,24),0);assert(T.height(world,33,32)>2);assert.equal(T.height(world,33,32),T.height(structuredClone(world),33,32));assert.equal(JSON.stringify(c.FrontierWorld.validate(JSON.parse(JSON.stringify(world)))),JSON.stringify(c.FrontierWorld.validate(world)));
assert.throws(()=>c.FrontierWorld.validate({...world,terrain:{mode:'hills',amplitude:100,frequency:.12}}));assert.throws(()=>c.FrontierSky.validate({enabled:true,layers:[{...c.FrontierSky.defaults.layers[0],speed:Infinity}]}));
const player={x:24,y:24,hp:100};T.ground(player,world,0);assert(T.jump(player));assert(!T.jump(player));let high=0;for(let i=0;i<90;i++){T.ground(player,world,1/60);high=Math.max(high,player.z);}assert(high>.7);assert.equal(player.z,0);assert(player.grounded);player.x=33;player.y=32;T.ground(player,world,.01);assert.equal(player.z,T.height(world,33,32));
const game=MF.makeFrontierGame(world,()=>{});MF.frontierMovement.movePlayer(game,new Set(),1,()=>false,{forward:.5,strafe:0});assert(Math.abs(game.player.y-24-1.6)<1e-8);
const blocker=c.FrontierWorld.entity('rock',24,26,'rock');const flat={...world,terrain:{mode:'flat',amplitude:0,frequency:.12},objects:[blocker]},g=MF.makeFrontierGame(flat,()=>{});
assert.equal(MF.frontierSpatial.sweep(g,{x:24,y:24,z:3},{x:24,y:28,z:3},.01,'player'),null,'shots above a low rock pass over it');assert.equal(MF.frontierSpatial.sweep(g,{x:24,y:24,z:.5},{x:24,y:28,z:.5},.01,'player').id,'rock');
const hillHit=MF.frontierSpatial.sweep(game,{x:24,y:24,z:1},{x:33,y:32,z:1},.01,'player');assert.equal(hillHit.kind,'terrain');assert(hillHit.t<1);
const enemy=c.FrontierWorld.entity('monster',24,28,'enemy'),combat=MF.makeFrontierGame({...flat,objects:[enemy]},()=>{});combat.camera.pitch=-.12;combat.player.weapon.spreadRadians=0;MF.fireShot(combat,320,200,combat.ui);assert(Number.isFinite(combat.projectiles[0].position.z));MF.updateProjectiles(combat,1,combat.ui);assert.equal(combat.runtime.entities.get('enemy').hp,16);
console.log('PASS: continuous mouse state, controller deadzones/edges/disconnect, analog speed, terrain/sky round-trip, grounded jump, height-aware shots and terrain obstruction.');

for(const distance of [1.6,2,2.8,3.8,7])for(const pitch of [-.7,-.12,.6])for(const height of [0,.6,2])for(const yaw of [0,1.8])for(const z of [0,3]){
 const framed={player:{x:24,y:24,z},camera:{distance,pitch,height,yaw,firstPerson:false}};
 const cam=c.FrontierRender.camera(framed),feet=c.FrontierRender.project(cam,24,24,z);
 assert(Math.abs(feet.depth-Math.max(2,Math.min(7,distance)))<1,'look angle keeps zoom bounded');
 assert(Math.hypot(cam.x-24,cam.y-24,cam.z-z)<10,'camera cannot run away');
 for(const cropHeight of [301,310,315]){
  const spriteHeight=1.65*feet.scale*cropHeight/310,top=feet.y-spriteHeight;
  assert(top>105,'head stays below fixed crosshair');
  assert(top>105&&feet.y<425,'full body stays inside safe viewport');
 }
}
console.log('PASS: full-body framing below crosshair across zoom, pitch, height and terrain.');



function obstacleRun(height,jumping){
 const rock={id:'step-rock',kind:'rock',x:24,y:25,radius:.3,height,z:0};
 const scene={...flat,objects:[rock]},g=MF.makeFrontierGame(scene,()=>{});T.ground(g.player,scene,0);
 if(jumping)T.jump(g.player);
 let stood=false;
 for(let i=0;i<100;i++){
  MF.frontierMovement.movePlayer(g,new Set(['w']),1/120,(x,y,r)=>T.blocked(g,x,y,r));
  T.ground(g.player,scene,1/120,g.maps.frontier.entities);
  if(g.player.grounded&&Math.abs(g.player.z-height)<.001)stood=true;
 }
 return {g,stood};
}
assert(obstacleRun(.2,false).g.player.y>25.5,'small objects step over automatically');
assert(obstacleRun(.85,false).g.player.y<24.6,'rock still blocks grounded movement');
const jumped=obstacleRun(.85,true);assert(jumped.g.player.y>25.5,'jump clears normal rock');
assert(jumped.stood,'descending jump lands on rock top');
assert(obstacleRun(3,true).g.player.y<24.6,'jump cannot bypass tall object');
console.log('PASS: automatic small steps, jumping/landing on rocks, tall-object blocking.');

for(const pitch of [-.7,0,.6]){
 const g={player:{x:24,y:24,z:0},camera:{distance:3.8,pitch,yaw:0,firstPerson:false}};
 const cam=c.FrontierRender.camera(g),aim=cam.pitch+Math.atan(((cam.cy??96)-96)/360);
 const target=c.FrontierRender.project(cam,cam.x,cam.y+Math.cos(aim)*20,cam.z+Math.sin(aim)*20);
 assert(Math.abs(target.y-96)<1e-8,'projectile aim matches fixed crosshair after stabilized framing');
}
console.log('PASS: stabilized projection and fixed-crosshair aim alignment.');

const rearTree=c.FrontierWorld.entity('tree',24,23,'rear-tree');
function aim(objects){const g=MF.makeFrontierGame({...flat,objects},()=>{});g.camera.pitch=-.12;g.camera.distance=3.8;g.player.weapon.spreadRadians=0;MF.fireShot(g,320,96,g.ui);return g.projectiles[0].direction;}
const clearAim=aim([]),blockedCameraAim=aim([rearTree]);
assert(Math.abs(clearAim.z-blockedCameraAim.z)<1e-10,'tree behind shooter cannot redirect aiming');
assert(Math.abs(clearAim.y-blockedCameraAim.y)<1e-10);
const ricochetRock={id:'bounce-rock',kind:'rock',x:24,y:26,z:0,radius:.4,height:1,ricochetChance:1};
const bounceGame={maps:{frontier:{entities:[ricochetRock]}},sceneEvents:[]};
const projectile={position:{x:24,y:25.59,z:.5},direction:{x:0,y:1,z:0},radius:.01,speed:20};
assert(MF.frontierSpatial.bounce(bounceGame,projectile,{kind:'body',id:'bounce-rock'}));
assert(projectile.direction.y<0,'bounce exits the struck surface');
assert(Math.abs(Math.hypot(projectile.direction.x,projectile.direction.y,projectile.direction.z)-1)<1e-10);
assert(!MF.frontierSpatial.bounce(bounceGame,projectile,{kind:'body',id:'bounce-rock'}),'one-bounce limit');
assert(!MF.frontierSpatial.bounce(bounceGame,{...projectile,ricochets:0},{kind:'terrain'}));
ricochetRock.ricochetChance=0;assert(!MF.frontierSpatial.bounce(bounceGame,{...projectile,ricochets:0},{kind:'body',id:'bounce-rock'}));
console.log('PASS: rear scenery cannot redirect aim; randomized scenery bounce exits surface, preserves unit direction, respects chance and bounce limit.');
