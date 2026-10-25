// October 22: exact AST spans and bundled unchanged historical reference replace formatting-dependent line slicing.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
/* @function terrain-clip1523.load — Inputs: source path and test function name. Returns original private near-clip function through an isolated VM. Reads only the clip definition into the VM, preserving its actual arithmetic; no production changes. */
function load(path,name){const source=require('./source-function160.cjs')(path,'clipTerrain'),context={};vm.createContext(context);vm.runInContext('globalThis.'+name+' = '+source,context);return context[name];}
const previous=load('tests/fixtures/terrain-clip-reference1522.js','reference'),current=load('src/outdoor-assets.js','optimized');
for(let seed=0;seed<500;seed++){const cam={x:seed%7,y:seed%11,z:1.4,yaw:seed*.173,pitch:Math.sin(seed)*.6},poly=[];for(let i=0;i<3;i++)poly.push([((seed*17+i*11)%23)-4,((seed*7+i*13)%29)-3,((seed+i*3)%17)/4]);const sy=Math.sin(cam.yaw),cy=Math.cos(cam.yaw),sp=Math.sin(cam.pitch),cp=Math.cos(cam.pitch);
const cachedDepth=/* @function terrain-clip1523.basis — Inputs: XYZ point. Returns forward depth using once-computed camera basis with historical arithmetic order. Test fixture only; no cache/scene mutation. */ function(p){return ((p[0]-cam.x)*sy+(p[1]-cam.y)*cy)*cp+(p[2]-cam.z)*sp;};
assert.equal(JSON.stringify(current(cam,poly,cachedDepth)),JSON.stringify(previous(cam,poly)));}
console.log('PASS 500 exact near-plane clipping comparisons across camera yaw/pitch and crossing triangles');
