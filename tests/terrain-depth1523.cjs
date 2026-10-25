const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
/* @function terrain-depth1523.load — Inputs: depth module path. Returns isolated original API without touching gameplay. Uses real source so triangle coverage comparison includes historical edge tolerance. */
function load(path){const context={window:null};context.window=context;vm.createContext(context);vm.runInContext(fs.readFileSync(path,'utf8'),context);return context.FrontierTerrainOcclusion;}
const old=load('../phanicom-sprite-frontier-0.15.22/src/terrain-occlusion.js'),current=load('src/terrain-occlusion.js');
for(let seed=0;seed<800;seed++){const points=[];for(let i=0;i<3;i++)points.push({x:((seed*17+i*37)%131)-30,y:((seed*31+i*19)%127)-35,depth:.13+((seed+i*7)%23)/3});for(const step of [1,4/3,2]){const a={w:64,h:48,step,values:new Float32Array(64*48)},b={w:64,h:48,step,values:new Float32Array(64*48)};old.triangle(a,points);current.triangle(b,points);assert.deepEqual(b.values,a.values);}}
console.log('PASS 2400 exact terrain depth comparisons across densities, clipped bounds and conservative edge tolerance');
