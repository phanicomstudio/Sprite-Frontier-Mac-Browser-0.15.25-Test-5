/* October 14, 2026: release regression reference is preserved inside SOURCE-HISTORY so this test is self-contained in full Windows/browser packages. Previous external sibling path: ../../phanicom-sprite-frontier-0.15.23/src/terrain-occlusion.js. Reference bytes are unchanged. */
/* October 13, 2026: exact mask equivalence with bounded contact-depth sampling.
 * Uses preserved previous source rather than a reimplementation of its result. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
/* @function terrainMaskTest.load — Inputs: source path. Returns isolated production mask API. Does not mutate maintained code or gameplay globals. */
function load(file){const scope={window:null};scope.window=scope;vm.runInNewContext(fs.readFileSync(file,'utf8'),scope);return scope.FrontierTerrainOcclusion;}
const current=load(path.join(__dirname,'../src/terrain-occlusion.js')),previous=load(path.join(__dirname,'../SOURCE-HISTORY/regression-references/0.15.23/terrain-occlusion.js'));
let checks=0;
for(let seed=0;seed<150;seed++)for(const step of [1,4/3,2]){
 const values=new Float32Array(64*48);for(let i=0;i<values.length;i++)values[i]=((i*17+seed*31)%97)/150;
 const a={w:64,h:48,step,values},b={w:64,h:48,step,values},rect={x:(seed%10)-5,y:(seed%13)-6,width:50,height:45},support={cam:{pitch:(seed%11-5)/10,z:2,cy:20},z:0};
 let calls=0;
 /* @function terrainMaskTest.depth — Inputs: screen Y. Returns deterministic positive contact-like depth; counts evaluations to verify bounded work. Pure value depends only on Y and fixture seed. */
 function depth(y){calls++;return 2.5+(seed%7)/10+y*.003;}
 const expected=previous.mask(a,rect,depth,support);calls=0;const actual=current.mask(b,rect,depth,support);assert.equal(JSON.stringify(actual),JSON.stringify(expected));assert(calls<=b.h+1,'Contact depth evaluated at most once per visible raster row');
 const retained=b.maskRowInverse;current.mask(b,rect,depth,support);assert.equal(b.maskRowInverse,retained,'Same-size masks reuse owned row storage');checks++;
}
console.log('PASS',checks,'exact contact-mask comparisons across densities/pitches/edges with bounded reused row sampling');
