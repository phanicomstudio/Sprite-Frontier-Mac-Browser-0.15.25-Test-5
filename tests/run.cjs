const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..'),context=vm.createContext({console,Math,structuredClone,setTimeout});context.window=context;context.globalThis=context;context.MF={CONFIG:{playerCollisionRadius:.26}};
for(const file of ['project-data.js','movement.js','directions.js','world.js','legacy/geometry.js','adapter.js','legacy/projectiles.js','legacy/combat.js'])vm.runInContext(fs.readFileSync(path.join(root,'src',file),'utf8'),context,{filename:file});
const {FrontierWorld:W,MF}=context;
assert.equal(JSON.stringify(W.generate('test')),JSON.stringify(W.generate('test')));assert.notEqual(JSON.stringify(W.generate('test')),JSON.stringify(W.generate('other')));W.validate(W.generate('test'));
for(const change of [w=>w.objects.push({...w.objects[0]}),w=>w.spawn.x=NaN,w=>w.objects[0].kind='script',w=>w.objects[0].x=100,w=>w.objects[0].x=w.spawn.x,w=>w.size=100000]){const w=W.generate('test');change(w);if(w.objects[0].x===w.spawn.x)w.objects[0].y=w.spawn.y;assert.throws(()=>W.validate(w));}
function game(objects){return MF.makeFrontierGame({spawn:{x:24,y:24},objects},()=>{});}
const target=W.entity('monster',24,28,'enemy'),wall=W.entity('rock',24,26,'wall');let g=game([target]);MF.fireShot(g,320,200,g.ui);MF.updateProjectiles(g,1,g.ui);assert.equal(g.runtime.entities.get('enemy').hp,16);assert.equal(g.player.ammoLoaded,11);assert(g.events.some(e=>e.type==='actor.damaged'));
g=game([target,wall]);MF.fireShot(g,320,200,g.ui);MF.updateProjectiles(g,1,g.ui);assert.equal(g.runtime.entities.get('enemy').hp,24,'nearer solid blocks a shot even at long dt');assert.equal(g.projectiles.length,0);
g=game([target]);for(let i=0;i<3;i++){MF.fireShot(g,320,200,g.ui);MF.updateProjectiles(g,1,g.ui);}assert.equal(g.runtime.entities.get('enemy').dead,true);assert(g.events.some(e=>e.type==='actor.killed'));assert(g.particles.length>0);
g=game([]);g.player.ammoLoaded=3;g.player.ammoReserve=4;MF.reload(g,g.ui);assert.equal(g.player.ammoLoaded,7);assert.equal(g.player.ammoReserve,0);MF.toggleHolster(g,g.ui);const n=g.player.ammoLoaded;MF.fireShot(g,320,200,g.ui);assert.equal(g.player.ammoLoaded,n);
const before=fs.readFileSync(path.join(root,'src/legacy/combat.js'));assert(before.length>10000);console.log('PASS: seeded generation, input validation, damage, obstruction, kill events, reload and holster.');

assert.equal(JSON.stringify(context.FrontierProject),JSON.stringify(JSON.parse(fs.readFileSync(path.join(root,'project/settings.json')))));
for(const [pressed,distance] of [[['w'],3.2],[['w','d'],3.2],[['w','shift'],6.4],[['w','s'],0]]){const g=game([]);MF.frontierMovement.movePlayer(g,new Set(pressed),1,()=>false);assert(Math.abs(Math.hypot(g.player.x-24,g.player.y-24)-distance)<1e-8);}
let blockedGame=game([]);MF.frontierMovement.movePlayer(blockedGame,new Set(['w']),1,()=>true);assert.equal(blockedGame.player.walkTime,0);assert.equal(blockedGame.player.vx,0);assert.equal(blockedGame.player.vy,0);
const spec={rows:[3,6,2,5,0,4,1,7],walkSequence:[1,2,1,0],frameSeconds:.14,idleColumn:1};assert.equal(context.FrontierDirections.select({facingX:0,facingY:1},0,spec).row,3);assert.equal(context.FrontierDirections.select({facingX:0,facingY:1},Math.PI,spec).row,0);
console.log('PASS: project data mirror, walk/sprint/diagonal speed, blocked animation, camera-relative sprite directions.');

let plugin,clock=1000,sweeps=[];
context.performance={now:()=>clock};MF.plugins={register(p){plugin=p;}};
vm.runInContext(fs.readFileSync(path.join(root,'plugins/phanicom-synth-footsteps.js'),'utf8'),context);
const audio={claimFootsteps:()=>true,releaseFootsteps(){},synthSweep:o=>sweeps.push(o)};
const pg=game([]);pg.audio=audio;pg.input={keys:new Set()};const pc={game:pg,state:{},config:{...plugin.defaults},log(){}};plugin.hooks.start(pc);
pg.player.vx=.43;pg.player.vy=0;plugin.hooks.update(pc,.1);assert.equal(sweeps[0].startFrequency,100);assert.equal(sweeps[0].endFrequency,30);assert.equal(sweeps[0].volume,.6);
clock+=200;pg.input.keys.add('ShiftLeft');plugin.hooks.update(pc,.1);assert.equal(sweeps[1].startFrequency,120);assert.equal(sweeps[1].endFrequency,40);
clock+=200;pg.player.vx=0;plugin.hooks.update(pc,.1);assert.equal(sweeps.length,2);plugin.hooks.stop(pc);assert.equal(pc.state.ownsFootsteps,false);
console.log('PASS: original synth plugin walk/sprint sweeps, output boost, blocked-movement silence and lifecycle.');
