const path=require('node:path'),assert=require('node:assert/strict'),fs=require('node:fs'),{
  chromium,launch
}
=require('./environment.cjs'),observe=require('./host-observer1611.cjs');

(/* @function automaticNormalsTest.run1617 — Inputs: none. Exercises production default sprite relief, original-alpha/native-frame preservation, authored priority, shared world texture loading, exact local generation, persistent reuse and zero warm preparation work. Uses isolated browser/project storage; source artwork is never changed. */async function(){
  const browser=await chromium.launch({
    ...launch,args:['--allow-file-access-from-files']
  });
  try{
    const page=await browser.newPage({
      viewport:{
        width:1600,height:1000
      }
    }),errors=[];
    page.on('pageerror',/* @function automaticNormalsTest.error1617 — Inputs: browser exception. Retains real failures for the final assertion. */function(error){
      errors.push(error.message);
    });
    await observe(page);
    await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));
    await page.locator('#workspaceToggle').waitFor();
    await page.waitForFunction(/* @function automaticNormalsTest.ready1617 — Inputs: none. Waits for real registered player artwork and full manifest. */function(){
      return FrontierCandy.image.complete&&FrontierCandy.image.naturalWidth>0&&FrontierAutomaticNormals.debug().packaged>=116;
    });

    const result=await page.evaluate(/* @function automaticNormalsTest.verify1617 — Inputs: none. Uses actual source/prepared images and real workbench binding/cache; compares complete alpha planes and samples changed RGB. Imported synthetic art is new test-only artwork, not a replacement generator. */async function(){
      const auto=FrontierAutomaticNormals,source=FrontierCandy.image;
      auto.image(source,'candy-armed');
      await auto.settle();
      const lit=auto.image(source,'candy-armed');
      const original=new OffscreenCanvas(source.naturalWidth,source.naturalHeight),prepared=new OffscreenCanvas(lit.naturalWidth,lit.naturalHeight);
      const a=original.getContext('2d',{
        willReadFrequently:true
      }),b=prepared.getContext('2d',{
        willReadFrequently:true
      });
      a.drawImage(source,0,0);
      b.drawImage(lit,0,0);
      const x=a.getImageData(0,0,original.width,original.height),y=b.getImageData(0,0,prepared.width,prepared.height);
      let alpha=0,changed=0;
      for(let i=0;i<x.data.length;i+=4){
        if(x.data[i+3]!==y.data[i+3])alpha++;
        if(x.data[i+3]&&Math.abs(x.data[i]-y.data[i])+Math.abs(x.data[i+1]-y.data[i+1])+Math.abs(x.data[i+2]-y.data[i+2])>2)changed++;
      }

      const customSource=FrontierCandyUnarmed.image;
      await customSource.decode();
      const normal=new OffscreenCanvas(customSource.naturalWidth,customSource.naturalHeight),n=normal.getContext('2d');
      n.fillStyle='rgb(128,128,255)';
      n.fillRect(0,0,normal.width,normal.height);
      const png=await new Promise(/* @function automaticNormalsTest.normalData1617 — Inputs: completion callback. Encodes a test-authored flat normal to exercise existing per-map custom priority. */function(resolve){
        normal.convertToBlob({
          type:'image/png'
        }).then(/* @function automaticNormalsTest.normalBlob1617 — Inputs: PNG Blob. Converts it using FileReader, preserving production binding format. */function(blob){
          const reader=new FileReader();
          reader.onload=/* @function automaticNormalsTest.normalRead1617 — Inputs: read event ignored. Resolves local test normal URI. */function(){
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        });
      });
      const bank=FrontierNormalBindings.validate({
        schema:'sprite-normals/1',entries:[{
          profile:'candy-unarmed',png,width:customSource.naturalWidth,height:customSource.naturalHeight,light:{
            ambient:1,strength:0,x:0,y:0,z:1
          }
        }]
      });
      testHost1611.roomApi.mutate(/* @function automaticNormalsTest.applyCustom1617 — Inputs: none. Applies validated custom normals through the existing authored-world owner, preserving its real bank identity and playtest lifecycle. */function(){
        testHost1611.roomApi.world().spriteNormals=bank;
      });
      testHost1611.roomApi.game().player.holstered=true;
      const bound=auto.debug();

      const c=new OffscreenCanvas(32,32),ctx=c.getContext('2d');
      ctx.fillStyle='#888';
      ctx.fillRect(4,4,24,24);
      ctx.fillStyle='#ccc';
      ctx.fillRect(10,10,12,12);
      const bitmap=await createImageBitmap(c);
      const generated=await auto.generate(bitmap,{
      },'test-new-import-1617');
      const first=auto.debug(),again=await auto.generate(bitmap,{
      },'test-new-import-1617'),second=auto.debug();
      bitmap.close();
      const originalGenerator=FrontierSpriteFusion.generate;
      let active=0,maxActive=0;
      FrontierSpriteFusion.generate=/* @function automaticNormalsTest.countWorkers1617 — Inputs: real generator arguments. Counts simultaneously active pinned-WASM calls while delegating unchanged; restored in finally. */async function(...args){
        active++;
        maxActive=Math.max(maxActive,active);
        try{
          return await originalGenerator.apply(this,args);
        }finally{
          active--;
        }
      };
      let invalid=false;
      try{
        const fixture=await createImageBitmap(c);
        try{
          await Promise.all([auto.generate(fixture,{
          },'serial-A1617'),auto.generate(fixture,{
          },'serial-B1617')]);
          try{
            await auto.generate(fixture,{
              columns:3,rows:1
            },'uneven1617');
          }catch{
            invalid=true;
          }
        }finally{
          fixture.close();
        }
      }finally{
        FrontierSpriteFusion.generate=originalGenerator;
      }
      const modelCanvas=new OffscreenCanvas(16,16),modelContext=modelCanvas.getContext('2d');
      modelContext.fillStyle='#888';
      modelContext.fillRect(0,0,16,16);
      modelContext.fillStyle='#ddd';
      modelContext.fillRect(4,4,8,8);
      const originalModel=modelContext.getImageData(0,0,16,16).data,modelBytes=new Uint8Array(await (await modelCanvas.convertToBlob({
        type:'image/png'
      })).arrayBuffer()),model={
        json:{
          textures:[{
            source:0
          }],materials:[{
            pbrMetallicRoughness:{
              baseColorTexture:{
                index:0
              }
            }
          }]
        },images:[{
          bytes:modelBytes,mime:'image/png'
        }]
      };
      const modelState=FrontierModelRenderer.prepare(model);
      await modelState.promise;
      let modelChanges=0,modelAlpha=0;
      for(let i=0;i<originalModel.length;i++)if(modelState.pixels[0].data[i]!==originalModel[i]){
        if(i%4===3)modelAlpha++;
        else modelChanges++;
      }
      const authoredModel={
        json:{
          textures:[{
            source:0
          },{
            source:1
          }],materials:[{
            pbrMetallicRoughness:{
              baseColorTexture:{
                index:0
              }
            },normalTexture:{
              index:1
            }
          }]
        },images:[{
          bytes:modelBytes,mime:'image/png'
        },{
          bytes:modelBytes,mime:'image/png'
        }]
      },authoredState=FrontierModelRenderer.prepare(authoredModel);
      await authoredState.promise;
      let authoredDifferences=0;
      for(let i=0;i<originalModel.length;i++)if(authoredState.pixels[0].data[i]!==originalModel[i]||authoredState.pixels[1].data[i]!==originalModel[i])authoredDifferences++;
      const worldPath='img/materials/walls/prop_wood_panel_wall1.png';
      const replacementCanvas=new OffscreenCanvas(16,16),replacementContext=replacementCanvas.getContext('2d');
      replacementContext.fillStyle='#00cc00';
      replacementContext.fillRect(0,0,16,16);
      const replacementBlob=await replacementCanvas.convertToBlob({
        type:'image/png'
      }),replacementUrl=URL.createObjectURL(replacementBlob);
      let replaced;
      try{
        const image=await auto.load(worldPath,replacementUrl);
        auto.image(image,worldPath);
        await auto.settle();
        const prepared=auto.image(image,worldPath),probe=new OffscreenCanvas(16,16),p=probe.getContext('2d');
        p.drawImage(prepared,0,0,16,16);
        replaced={
          width:prepared.naturalWidth,height:prepared.naturalHeight,pixel:Array.from(p.getImageData(8,8,1,1).data)
        };
      }finally{
        URL.revokeObjectURL(replacementUrl);
      }
      FrontierRoomSurfaces.get(worldPath);
      return {
        width:lit.naturalWidth,height:lit.naturalHeight,sourceWidth:source.naturalWidth,sourceHeight:source.naturalHeight,alphaDifferences:alpha,changedPixels:changed,customBank:!!bank.entries.length,bound,beforeDisk:first.diskHits||0,afterDisk:second.diskHits||0,repeatEqual:generated.normal===again.normal&&generated.lit===again.lit,generatedWidth:generated.width,maxActive,invalid,modelChanges,modelAlpha,authoredDifferences,replaced,worldPath,worldUri:auto.url(worldPath),ui:auto.url('img/ui/Phanicom Remote Fixed.png'),sky:auto.url('img/skyboxes/example.png'),cache:auto.debug()
      };
    });
    assert.equal(result.alphaDifferences,0,JSON.stringify(result));
    assert.equal(result.width,result.sourceWidth);
    assert.equal(result.height,result.sourceHeight);
    assert(result.changedPixels>100);
    assert.equal(result.generatedWidth,32);
    assert.equal(result.maxActive,1);
    assert(result.invalid);
    assert(result.modelChanges>0);
    assert.equal(result.modelAlpha,0);
    assert.equal(result.authoredDifferences,0);
    assert.equal(result.replaced.width,16);
    assert.equal(result.replaced.height,16);
    assert(result.replaced.pixel[1]>150&&result.replaced.pixel[0]<10,'Replacing a known path must not reuse its old prepared art');
    assert(result.repeatEqual);
    assert.equal(result.afterDisk,result.beforeDisk+1);
    assert(result.worldUri.startsWith('assets/automatic-normals/'));
    assert.equal(result.ui,'img/ui/Phanicom Remote Fixed.png');
    assert.equal(result.sky,'img/skyboxes/example.png');
    await page.waitForFunction(/* @function automaticNormalsTest.worldReady1617 — Inputs: none. Waits for actual shared-material decoding under the new default. */function(){
      return FrontierRoomSurfaces.status('img/materials/walls/prop_wood_panel_wall1.png').ready;
    },{
    },{
      timeout:60000
    });
    await page.waitForFunction(/* @function automaticNormalsTest.customReady1617 — Inputs: none. Requires the existing custom-normal worker, not just a binding record. */function(){
      return FrontierNormalRenderCache.debug().prepared>0;
    },{
    },{
      timeout:60000
    });
    const custom=await page.evaluate(/* @function automaticNormalsTest.customPixels1617 — Inputs: none. Reads an actual prepared custom-normal pixel and its original counterpart; full-strength ambient and zero relief must preserve the original rather than double-shading automatic art. */function(){
      const s=FrontierCandy.image,d=FrontierNormalRenderCache.debug();
      const source=FrontierCandyUnarmed.image,lit=FrontierNormalRenderCache.image(source,'candy-unarmed',testHost1611.roomApi.game().sourceWorld.spriteNormals),a=new OffscreenCanvas(source.naturalWidth,source.naturalHeight),b=new OffscreenCanvas(source.naturalWidth,source.naturalHeight);
      a.getContext('2d').drawImage(source,0,0);
      b.getContext('2d').drawImage(lit,0,0);
      const x=a.getContext('2d').getImageData(0,0,a.width,a.height).data,y=b.getContext('2d').getImageData(0,0,b.width,b.height).data;
      let differences=0;
      for(let i=0;i<x.length;i++)if(x[i]!==y[i])differences++;
      return {
        d,differences,auto:FrontierAutomaticNormals.debug()
      };
    });
    assert.equal(custom.d.lastPreparation.profile,'candy-unarmed');
    assert.equal(custom.differences,0,'Custom normals must shade the original, not automatic relief');
    await page.reload();
    await page.locator('#workspaceToggle').waitFor();
    const reloaded=await page.evaluate(/* @function automaticNormalsTest.reloadCache1617 — Inputs: none. Recreates the same isolated import in a fresh service lifetime and requires an actual persistent cache hit with no new WASM generation. */async function(){
      const canvas=new OffscreenCanvas(32,32),ctx=canvas.getContext('2d');
      ctx.fillStyle='#888';
      ctx.fillRect(4,4,24,24);
      ctx.fillStyle='#ccc';
      ctx.fillRect(10,10,12,12);
      const bitmap=await createImageBitmap(canvas);
      try{
        await FrontierAutomaticNormals.generate(bitmap,{
        },'test-new-import-1617');
        return FrontierAutomaticNormals.debug();
      }finally{
        bitmap.close();
      }
    });
    assert.equal(reloaded.generated,0);
    assert(reloaded.diskHits>=1);
    assert.deepEqual(errors,[]);
    fs.writeFileSync('test-artifacts/automatic-normals1617.json',JSON.stringify({
      result,custom,reloaded,errors
    },null,2));
    await page.screenshot({
      path:'test-artifacts/automatic-normals1617.png'
    });
    console.log('PASS automatic native-size relief/alpha, local imports, persistent reuse, material loading, custom priority and UI/sky exclusions');
  }finally{
    await browser.close();
  }
})().catch(/* @function automaticNormalsTest.failure1617 — Inputs: test failure. Reports nonzero status after browser cleanup without weakening production guards. */function(error){
  console.error(error);
  process.exitCode=1;
});


