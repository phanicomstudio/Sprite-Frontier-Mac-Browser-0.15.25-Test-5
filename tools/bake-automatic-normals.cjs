/* November 1, 2026: offline default-normal bake. Original artwork is never overwritten.
* Requires Playwright/Chrome for the pinned browser WASM implementation; outputs are
* shared normal PNGs and native-size normal-relief PNGs, not runtime GPU passes. */
'use strict';

const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{
  pathToFileURL
}
=require('node:url');

const {
  chromium
}
=require(process.env.FRONTIER_PLAYWRIGHT||'playwright');

const base=path.resolve(__dirname,'..'),output=path.join(base,'assets/automatic-normals');

/* @function automaticBake.scan1617 — Inputs: eligible world/sprite directory. Returns sorted image paths recursively, excluding UI/skies by the caller's fixed roots. Does not follow symlinks or change artwork. */
function scan(dir){
  const result=[];
  if(!fs.existsSync(dir))return result;
  for(const e of fs.readdirSync(dir,{
    withFileTypes:true
  })){
    const p=path.join(dir,e.name);
    if(e.isDirectory())result.push(...scan(p));
    else if(e.isFile()&&/\.(png|webp|jpe?g)$/i.test(e.name))result.push(p);
  }
  return result.sort();
}
(/* @function automaticBake.run1617 — Inputs: none. Bakes eligible packaged files sequentially using exact local Sprite Fusion and existing normal-lighting preparation. Content hashes make unchanged outputs reusable. Manifest publication occurs only after every file succeeds; errors retain original assets and close browser. */
async function(){
  fs.mkdirSync(output,{
    recursive:true
  });
  const browser=await chromium.launch({
    headless:true,...(process.env.FRONTIER_CHROME?{
      executablePath:process.env.FRONTIER_CHROME
    }
    :{
    }),args:['--allow-file-access-from-files']
  });
  try{
    const page=await browser.newPage();
    await page.goto(pathToFileURL(path.join(base,'tools/normal-bake-host.html')).href);
    const entries={
    };
    for(const folder of ['characters','ground','interiors','items','materials','water','weapons'])for(const file of scan(path.join(base,'img',folder))){
      const relative=path.relative(base,file).replaceAll('\\','/'),hash=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),id=hash.slice(0,24)+'-relief2',normal='assets/automatic-normals/'+id+'.normal.png',lit='assets/automatic-normals/'+id+'.lit.png',metadata=path.join(output,id+'.json');
      let record;
      const previous=fs.existsSync(metadata)?JSON.parse(fs.readFileSync(metadata,'utf8')):null;
      if(previous&&previous.sha256===hash&&fs.existsSync(path.join(base,previous.lit))&&fs.existsSync(path.join(base,previous.normal)))record=previous;
      else{
        const result=await page.evaluate(/* @function automaticBake.process1617 — Inputs: local URL, source dimensions inferred by decoder, and uniform character-sheet layout. Returns PNG byte arrays and metadata. Generates at bounded detail resolution, wraps seamless surfaces before generation, isolates sheet cells, then prepares native-size relief through the existing worker. No game state is changed; source alpha and crop coordinates remain exact. */async function(job){
          const source=new Image();
          source.src=job.url;
          await source.decode();
          const columns=job.columns,rows=job.rows,fw=Math.max(1,Math.floor(Math.min(512/source.width,512/source.height,1)*source.width/columns)),fh=Math.max(1,Math.floor(Math.min(512/source.width,512/source.height,1)*source.height/rows)),w=fw*columns,h=fh*rows,c=new OffscreenCanvas(w,h),ctx=c.getContext('2d',{
            willReadFrequently:true
          });
          ctx.drawImage(source,0,0,w,h);
          const pixels=ctx.getImageData(0,0,w,h);
          let transparent=false;
          for(let i=3;i<pixels.data.length;i+=4)if(pixels.data[i]<255){
            transparent=true;
            break;
          }
          let input=pixels,wrap=!transparent&&columns===1&&rows===1;
          if(wrap){
            const repeat=new OffscreenCanvas(w*3,h*3),r=repeat.getContext('2d');
            for(let y=0;y<3;y++)for(let x=0;x<3;x++)r.drawImage(c,x*w,y*h);
            input=r.getImageData(0,0,w*3,h*3);
          }
          const options={
            strength:1.5,detail:6,smoothing:.6,volume:transparent?1.15:0
          };
          if(columns>1||rows>1){
            options.frame_width=fw;
            options.frame_height=fh;
          }
          const generated=await FrontierSpriteFusion.generate(input,options),bitmap=await createImageBitmap(new Blob([generated.normal],{
            type:'image/png'
          }));
          ctx.clearRect(0,0,w,h);
          if(wrap)ctx.drawImage(bitmap,w,h,w,h,0,0,w,h);
          else ctx.drawImage(bitmap,0,0);
          bitmap.close();
          const corrected=ctx.getImageData(0,0,w,h);
          for(let i=0;i<corrected.data.length;i+=4){
            if(corrected.data[i+3]===0){
              corrected.data[i]=128;
              corrected.data[i+1]=128;
              corrected.data[i+2]=255;
            }else corrected.data[i+2]=Math.max(129,corrected.data[i+2]);
            corrected.data[i+3]=255;
          }
          ctx.putImageData(corrected,0,0);
          const normalBlob=await c.convertToBlob({
            type:'image/png'
          }),normalBytes=new Uint8Array(await normalBlob.arrayBuffer());
          let binary='';
          for(const byte of normalBytes)binary+=String.fromCharCode(byte);
          const png='data:image/png;base64,'+btoa(binary),light={
            ambient:.4,strength:.6,x:0,y:0,z:1
          },prepared=await FrontierNormalWorker.prepare(source,{
            png,light
          });
          if(!prepared)throw Error('Offline bake requires normal preparation worker');
          const native=new OffscreenCanvas(source.width,source.height);
          native.getContext('2d').drawImage(prepared.canvas,0,0);
          prepared.canvas.width=prepared.canvas.height=1;
          const litBytes=new Uint8Array(await (await native.convertToBlob({
            type:'image/png'
          })).arrayBuffer());
          return {
            normal:Array.from(normalBytes),lit:Array.from(litBytes),width:source.width,height:source.height,normalWidth:w,normalHeight:h,columns,rows,light,options,wrap
          };
        },{
          url:pathToFileURL(file).href,columns:folder==='characters'?3:1,rows:folder==='characters'?(path.basename(file)==='Candy_Armed_8R_3C.png'?8:4):1
        });
        fs.writeFileSync(path.join(base,normal),Buffer.from(result.normal));
        fs.writeFileSync(path.join(base,lit),Buffer.from(result.lit));
        const {
          normal:unused,lit:unusedLit,...info
        }
        =result;
        record={
          source:relative,sha256:hash,normal,lit,...info
        };
        fs.writeFileSync(metadata,JSON.stringify(record,null,2));
      }
      entries[relative]=record;
      console.log('BAKED '+relative);
    }
    const manifest={
      schema:'automatic-normals/1',generator:'spritefusion-d14b06726cabab09c68a403ce2e684a52efbfe4c',recipe:'relief2',entries
    };
    fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2));
    fs.writeFileSync(path.join(base,'src/automatic-normal-manifest.js'),'/* Generated offline normal/relief index. Original files and pinned upstream provenance remain authoritative. */\nwindow.FrontierAutomaticNormalManifest='+JSON.stringify(manifest)+';\n');
    console.log('COMPLETE '+Object.keys(entries).length+' world/sprite defaults');
  }finally{
    await browser.close();
  }
})().catch(/* @function automaticBake.fail1617 — Inputs: decode/generation/write failure. Reports failure and sets nonzero exit; no partial manifest is adopted. */function(error){
  console.error(error);
  process.exitCode=1;
});


