/* October 12, 2026: shader color/depth contract. Pixel readback is confined to
 * tiny validation fixtures, never production or performance measurements. */
const {chromium,launch}=require('./environment.cjs'),assert=require('node:assert/strict'),path=require('node:path');
(/* @function gpuWorldTest.run — Inputs: none. Returns promise. Opens actual engine shader and checks prior-world occlusion, per-depth fog and Crisp/Smooth sampling with deterministic tiny triangles. Always closes browser; failures are explicit. */ async function(){
 const browser=await chromium.launch(launch);
 try{
  const page=await browser.newPage();await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));await page.waitForFunction(/* @function gpuWorldTest.ready — Inputs: none. Returns whether actual GPU factory is installed; read-only. */ function(){return !!window.FrontierGeometryGPU;});
  const evidence=await page.evaluate(/* @function gpuWorldTest.pixels — Inputs: none. Returns named pixel evidence from actual WebGL2 shader. Uses one isolated 8x8 context, releases it in finally; no source texture/game state mutation. */ function(){
   const gpu=FrontierGeometryGPU.create(8,8,8,8),image={width:1,height:1,data:new Uint8Array([255,255,255,255])},vertices=[];
   for(const [x,y]of [[0,0],[8,0],[0,8]])vertices.push({x,y,depth:10,u:.5,v:.5,world:[0,0,0]});
   /* @function gpuWorldTest.sample — Inputs: triangle, Smooth flag and optional prior-depth record. Returns RGBA at an interior pixel after actual shader draw. Readback is test-only; synchronizes this tiny context outside all benchmark scopes. */
   function sample(triangle,smooth=false,prior=null){gpu.draw([triangle],smooth,null,prior);const pixel=new Uint8Array(4);gpu.gl.readPixels(2,5,1,1,gpu.gl.RGBA,gpu.gl.UNSIGNED_BYTE,pixel);return Array.from(pixel);}
   try{
    const triangle={image,vertices,opaque:true},values=new Float32Array(64),e={};
    e.clear=sample(triangle);values.fill(.2);e.behind=sample(triangle,false,{w:8,h:8,values});values.fill(.05);e.front=sample(triangle,false,{w:8,h:8,values});
    e.fog=sample({...triangle,fog:{enabled:true,start:0,end:20,color:'#0000ff'}});
    const pattern={width:2,height:2,data:new Uint8Array([255,0,0,255,0,255,0,255,0,0,255,255,255,255,255,255])};
    e.crisp=sample({...triangle,image:pattern});e.smooth=sample({...triangle,image:pattern},true);e.memory=gpu.diagnostics();e.glError=gpu.gl.getError();return e;
   }finally{gpu.destroy();}
  });
  assert.deepEqual(evidence.clear,[255,255,255,255]);assert.equal(evidence.behind[3],0,'Prior wall depth hides model color');assert.deepEqual(evidence.front,evidence.clear,'Nearer model remains visible');
  assert(Math.abs(evidence.fog[0]-128)<=1&&Math.abs(evidence.fog[1]-128)<=1&&evidence.fog[2]===255,'Fog uses camera-depth blend after lighting');
  assert.deepEqual(evidence.crisp,[255,255,255,255]);for(let i=0;i<3;i++)assert(Math.abs(evidence.smooth[i]-128)<=1,'Smooth retains actual bilinear source sampling');assert.equal(evidence.glError,0);
  assert.equal(evidence.memory.occlusionBytes,8*8*4,'Reused R32F depth upload remains counted after non-occluded draws');assert.equal(evidence.memory.ownedTextureBytes,evidence.memory.textureBytes+256,'Owned texture estimate includes both source images and prior-world depth');
  console.log('PASS GPU prior-world occlusion, visible-front model, depth fog, Crisp/Smooth filtering and retained depth memory');
 }finally{await browser.close();}
})().catch(/* @function gpuWorldTest.failure — Inputs: rejected error. Returns nothing; reports failed color/depth verification and unsuccessful exit. */ function(error){console.error(error);process.exitCode=1;});
