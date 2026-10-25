// October 13, 2026: supersedes literal export-assignment matching; tolerate maintained source formatting without changing sampler/raster assertions.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
/* @function sampler1523.run â€” Inputs: none. Compares allocation-free production sampling against preserved 0.15.22 math over wrap modes, out-of-range UVs, both filters and missing images. Uses a test-only VM export; production API remains unchanged. Throws on differing RGBA. */
(/* @function sampler1523.invoke â€” Inputs: none. Runs deterministic source-equivalence assertions and prints one success line; no project or asset changes. */ function(){
const context={FrontierDisplay:{smooth:/* @function sampler1523.smooth â€” Inputs: none. Returns current test filtering mode from enclosing context; no mutation. */ function(){return context.mode;}}};context.globalThis=context;context.window=context;vm.createContext(context);
let source=fs.readFileSync('src/model-renderer.js','utf8');source=source.replace(/root\.FrontierModelRenderer\s*=\s*/, 'root.sampleReference=sample;root.sampleFast=sampleInto1523;root.FrontierModelRenderer=');vm.runInContext(source,context);
const image={width:3,height:2,data:Uint8Array.from([1,24,87,255,250,40,60,128,13,220,90,255,9,8,7,255,21,45,67,0,89,101,123,255])},factor=[.8,.5,.3,1],output=new Float64Array(4);
for(const smooth of [false,true])for(const wrapS of [undefined,33071,33648,10497])for(const wrapT of [undefined,33071,33648,10497])for(let i=0;i<300;i++){
context.mode=smooth;const sampler={wrapS,wrapT},asset={json:{textures:[{source:0,sampler:0}],samplers:[sampler]}},u=(i*17%101)/19-2,v=(i*31%97)/23-2;
const expected=context.sampleReference(asset,{pixels:[image]},{texture:0,factor},u,v);context.sampleFast(image,sampler,factor,u,v,smooth,output);
for(let c=0;c<4;c++)assert(Math.abs(expected[c]-output[c])<1e-10);
}
context.sampleFast(null,{},factor,0,0,true,output);for(let c=0;c<4;c++)assert.equal(output[c],factor[c]*255);
console.log('PASS 9600 sampler comparisons: Crisp/Smooth, repeat/mirror/clamp seams, alpha and missing textures');
})();
