const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),scope={console};scope.globalThis=scope;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/local-lighting.js'),'utf8'),scope);
const lighting=scope.FrontierLocalLighting;
assert.equal(lighting.validate().enabled,false,'Prior cells preserve their original appearance');
const world={lighting:lighting.validate({enabled:true,ambient:.1,lights:[{id:'torch',x:2,y:2,z:1,radius:4,color:'#ffffff',intensity:1}]})},game={sourceWorld:world,player:{x:2,y:2,z:0},projectiles:[],currentMapId:'a'};
let frame=lighting.frame(game,0);assert.equal(lighting.sample(frame,2,2,1)[0],1);assert.equal(lighting.sample(frame,7,2,1)[0],.1,'Outside radius receives only ambient');
assert(lighting.sample(frame,3,2,1)[0]>.1);assert(frame.cache.size>0,'Static contributions cache without touching image pixels');
const blockedWorld={...world,interior:{primitives:[{x:3,y:2,z:0,w:.2,d:5,h:3}]}};
frame=lighting.frame({...game,sourceWorld:blockedWorld},0);assert.equal(lighting.sample(frame,4,2,1)[0],.1,'Thin wall blocks a source on the opposite side');
assert(lighting.sample(frame,2.8,2,1)[0]>.1,'Same-side surface remains illuminated');
const ceilingWorld={...world,interior:{primitives:[{x:2,y:2,z:2,w:5,d:5,h:.2}]}};
frame=lighting.frame({...game,sourceWorld:ceilingWorld},0);assert.equal(lighting.sample(frame,2,2,3)[0],.1,'Ceiling prevents light leaking to stacked upper floor');
const projectileWorld={lighting:lighting.validate({enabled:true,ambient:.1,projectiles:{enabled:true},budget:2})};
const projectileGame={...game,sourceWorld:projectileWorld,projectiles:[{id:'1',map:'a',x:2,y:2,z:1},{id:'2',map:'a',x:3,y:2,z:1},{id:'3',map:'a',x:4,y:2,z:1},{id:'foreign',map:'b',x:2,y:2,z:1}]};
frame=lighting.frame(projectileGame,0);assert.equal(frame.lights.length,2);assert.equal(frame.droppedLights,1);assert.equal(frame.cache.size,0);
projectileGame.projectiles=[];assert.equal(lighting.frame(projectileGame,1).lights.length,0,'Despawn leaves no retained projectile lights');
projectileGame.projectiles=[{id:'native-position',map:'a',position:{x:2,y:2,z:1}}];assert.equal(lighting.frame(projectileGame,1).lights[0].x,2,'Native spatial projectile position feeds emission');
projectileGame.projectiles[0].light={enabled:false};assert.equal(lighting.frame(projectileGame,1).lights.length,0,'Weapon opt-out overrides global projectile emission');
const restored=lighting.validate(JSON.parse(JSON.stringify(world.lighting)));assert.equal(restored.lights[0].radius,4);assert.throws(/* @function lightingTest.invalidBudget — Inputs: none. Returns: validator result or throws for an unsupported active budget. */ function(){return lighting.validate({budget:9});});
console.log('PASS radius falloff, ambient, thin-wall/ceiling blocking, static caching, projectile budget/despawn/cell isolation and persistence');

// October 14: dropped item emission uses active host ownership and the same budget.
const itemGame={...game,sourceWorld:{lighting:lighting.validate({enabled:true,ambient:0,lights:[]})},hubDrops:[{id:'lamp',x:2,y:2,z:0,itemLight:lighting.source({id:'lamp',z:.4,color:'#ffffff',radius:3})}]};
assert(lighting.sample(lighting.frame(itemGame,0),2,2,.4)[0]>0.9);
itemGame.hubDrops=[];assert.equal(lighting.sample(lighting.frame(itemGame,0),2,2,.4)[0],0,'Picking up removes its source');
console.log('PASS dropped item light placement and pickup removal');
