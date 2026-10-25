// October 22, 2026: locate declarations across formatting; retain all cache/invalidation assertions.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:null};context.window=context;vm.createContext(context);vm.runInContext(fs.readFileSync('src/terrain.js','utf8'),context);
const source=fs.readFileSync('src/outdoor-assets.js','utf8'),start=source.search(/const terrainSamples1523\s*=/),end=source.indexOf('function draw(',start);assert(start>0&&end>start);vm.runInContext(source.slice(start,end),context);
const world={seed:'cache',spawn:{x:8,y:8},width:20,height:20,terrain:{mode:'hills',amplitude:2,frequency:.12,revision:0,edits:{}}};
let sampler=context.heightSampler1523(world);const original=context.FrontierTerrain.height(world,10.25,11.5);assert.equal(sampler(10.25,11.5),original);assert.equal(sampler(10.25,11.5),original);
world.terrain.edits['10,11']=4;world.terrain.revision++;sampler=context.heightSampler1523(world);assert.equal(sampler(10.25,11.5),context.FrontierTerrain.height(world,10.25,11.5));assert.notEqual(sampler(10.25,11.5),original);
world.terrain.amplitude=4;sampler=context.heightSampler1523(world);assert.equal(sampler(10.25,11.5),context.FrontierTerrain.height(world,10.25,11.5));
world.terrain.edits={};sampler=context.heightSampler1523(world);assert.equal(sampler(10.25,11.5),context.FrontierTerrain.height(world,10.25,11.5));
world.spawn.x=2;sampler=context.heightSampler1523(world);assert.equal(sampler(10.25,11.5),context.FrontierTerrain.height(world,10.25,11.5));
console.log('PASS exact terrain sample reuse and invalidation after brush revision, amplitude, edits identity and spawn changes');
// Cached triangles preserve the original grid and shared-vertex elevations exactly.
sampler=context.heightSampler1523(world);const tile=context.terrainTile1523(world,10,11,sampler);assert.equal(context.terrainTile1523(world,10,11,sampler),tile);
let cornerLow=Infinity,cornerHigh=-Infinity;for(const [x,y]of [[10,11],[11,11],[11,12],[10,12]]){const z=context.FrontierTerrain.height(world,x,y);cornerLow=Math.min(cornerLow,z);cornerHigh=Math.max(cornerHigh,z);}
const subdivisions=cornerHigh-cornerLow>.001?4:1;assert.equal(tile.triangles.length,subdivisions*subdivisions*2);
for(const triangle of tile.triangles)for(const point of triangle){assert.equal(point[2],context.FrontierTerrain.height(world,point[0],point[1]));assert(point[2]>=tile.low&&point[2]<=tile.high);}
world.terrain.revision++;sampler=context.heightSampler1523(world);assert.notEqual(context.terrainTile1523(world,10,11,sampler),tile);
const offscreen=/* @function terrain-cache1523.offscreen — Inputs: camera and world X/Y/elevation unused. Returns a projected corner entirely left of viewport for conservative rejection assertion. */ function(){return {x:-20,y:100};};
assert.equal(context.terrainTileVisible1523(tile,10,11,{},offscreen,640),false);
let corners=0;const crossing=/* @function terrain-cache1523.crossing — Inputs: camera/coordinates unused. Returns one near-plane-rejected corner then visible projected corners. Counts calls to verify conservative crossing retention. */ function(){return corners++===0?null:{x:100,y:100};};
assert.equal(context.terrainTileVisible1523(tile,10,11,{},crossing,640),true);
console.log('PASS cached terrain tessellation, exact vertices, revision replacement and conservative near-plane visibility');

// October 13, 2026: large-world traversal must not retain an unbounded elevation map.
const largeWorld={seed:'bounded-cache',spawn:{x:0,y:0},width:100000,height:100000,terrain:{mode:'flat',revision:0}};
context.largeWorld=largeWorld;const largeSampler=context.heightSampler1523(largeWorld);
for(let index=0;index<70000;index++)assert.equal(largeSampler(index/4,0),context.FrontierTerrain.height(largeWorld,index/4,0));
assert.equal(vm.runInContext('terrainSamples1523.get(largeWorld).samples.size',context),65536);
assert.equal(largeSampler(0,0),context.FrontierTerrain.height(largeWorld,0,0));
assert.equal(vm.runInContext('terrainSamples1523.get(largeWorld).samples.size',context),65536);
console.log('PASS 70,000-sample traversal remains bounded and evicted elevations recompute exactly');
