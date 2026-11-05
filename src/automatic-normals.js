/* November 1, 2026 — 0.16.18 supersedes fixed relief: live consumers retain original albedo and use the real generated normal texture. Historical relief generation/cache records remain readable, but lit artwork is no longer displayed. */
/* November 1, 2026: automatic, cached normal relief for world art only.
* Uses the existing normal-lighting contract: static surface relief is prepared
* once; live radius lights, darkness, fog and the separate shadow systems still
* act on that artwork through their original owners. This is not a new dynamic
* tangent-space point-light shader. Original artwork and authored normals win.
* Packaged art is baked offline. New art uses one bounded preparation queue.
*/
(/* @function automaticNormals.install1617 — Inputs: browser namespace. Installs lazy world/sprite relief ownership without loading images, creating workers or scanning UI. Returns nothing; manifest bytes are build-time data. */function(root) {

  'use strict';

  const cache=new Map(), sources=new WeakMap(), blocked=new WeakMap(), queue=[];

  // Prefer a larger hot set on desktop-class RAM, while keeping a firm cap on
  // lower-memory/unknown devices. This is sampled once, never in a draw loop.
  const LIMIT=(typeof navigator!=='undefined'&&navigator.deviceMemory>=8?256:128)*1024*1024;

  const light={
    ambient:.4,strength:.6,x:0,y:0,z:1
  };

  let bytes=0, running=false, enabled=root.FRONTIER_AUTOMATIC_NORMALS_ENABLED!==false,generationTail=Promise.resolve(),generationPending=0,database;

  const stats={
    loads:0,generated:0,hits:0,failures:0,budgetFallbacks:0
  };

  const issues=[];

  /* @function automaticNormals.issue1617 — Inputs: asset label and failure reason. Records the latest sixteen preparation issues for the workbench, truncating labels to avoid retaining source data URIs in diagnostics. No per-frame console output or authored mutation. */
  function issue(asset,message){
    const label=String(asset);
    issues.push({
      asset:label.startsWith('data:')?'Imported inline image':label.slice(0,128),message:String(message).slice(0,240)
    });
    if(issues.length>16)issues.shift();
  }

  /* @function automaticNormals.database1617 — Inputs: none. Opens a separate regenerable cache, never the authored project database. Returns database/null asynchronously; denied/private storage falls back to session-only preparation. Stores at most sixteen entries of eight MiB encoded PNG data each. */
  async function db() {

    if(database!==undefined)return database;

    database=await new Promise(/* @function automaticNormals.openCache1617 — Inputs: settlement callback. Opens a versioned normal cache and creates only its own asset store/index. Storage errors resolve null so original art and projects stay usable. */function(resolve) {

      const request=indexedDB.open('SpriteFrontierAutomaticNormals1617',1);

      request.onupgradeneeded=/* @function automaticNormals.upgrade1617 — Inputs: version event ignored. Creates the regenerable asset store with LRU timestamp index; does not touch project stores. */function(){
        const store=request.result.createObjectStore('assets',{
          keyPath:'key'
        });
        store.createIndex('at','at');
      };

      request.onsuccess=/* @function automaticNormals.opened1617 — Inputs: success event ignored. Resolves the cache connection. */function(){
        resolve(request.result);
      };

      request.onerror=/* @function automaticNormals.unavailable1617 — Inputs: storage failure ignored. Resolves null and retains nonpersistent behavior. */function(){
        resolve(null);
      };

      request.onblocked=/* @function automaticNormals.blocked1617 — Inputs: blocked event ignored. Resolves null; no approval, project deletion or forced connection closure. */function(){
        resolve(null);
      };

    });
    return database;

  }

  /* @function automaticNormals.cached1617 — Inputs: content digest key and optional completed normal/relief record. Reads or writes a regenerable cache entry; returns stored data/null. Cache writes are bounded to eight MiB encoded data and sixteen entries, evicting oldest only within this cache. Transaction failures never propagate into project loading. */
  async function cached(key,data) {

    try {

      const store=await db();
      if(!store)return null;

      if(data&&data.normal.length+data.lit.length>8*1024*1024)return null;

      return await new Promise(/* @function automaticNormals.cacheTransaction1617 — Inputs: completion callback. Owns one cache transaction; only its completion resolves successful writes. No per-frame reads occur. */function(resolve) {

        const transaction=store.transaction('assets',data?'readwrite':'readonly'),assets=transaction.objectStore('assets');
        let result=null;

        if(data){
          assets.put({
            key,data,at:Date.now()
          });
          const count=assets.count();
          count.onsuccess=/* @function automaticNormals.boundDisk1617 — Inputs: count event ignored. Removes excess oldest records from this regenerable store; original textures/projects remain intact. */function(){
            let excess=count.result-16;
            if(excess<=0)return;
            const cursor=assets.index('at').openCursor();
            cursor.onsuccess=/* @function automaticNormals.evictDisk1617 — Inputs: cursor event ignored. Deletes at most the counted excess entries, preserving the newly written and recent cache data. */function(){
              const row=cursor.result;
              if(row&&excess-->0){
                row.delete();
                row.continue();
              }
            };
          };
        }
        else {
          const request=assets.get(key);
          request.onsuccess=/* @function automaticNormals.readDisk1617 — Inputs: lookup event ignored. Retains the completed cache record until transaction completion. */function(){
            result=request.result?.data||null;
          };
        }

        transaction.oncomplete=/* @function automaticNormals.cacheComplete1617 — Inputs: completion event ignored. Resolves read data or written data only after commit. */function(){
          resolve(data||result);
        };

        transaction.onerror=transaction.onabort=/* @function automaticNormals.cacheFailed1617 — Inputs: transaction error ignored. Resolves cache miss; source art remains available. */function(){
          resolve(null);
        };

      });

    } catch {
      return null;
    }

  }

  /* @function automaticNormals.path1617 — Inputs: source image, optional profile ID or explicit material path. Returns the original authored path when registered, otherwise the original image URI. Never reads pixels, changes frames or walks scene objects. */
  function sourcePath(source,profile) {

    if(profile==='candy-unarmed')return 'img/characters/$Candy 1.png';

    if(profile==='candy-armed')return 'img/characters/Candy_Armed_8R_3C.png';

    if(profile?.startsWith('item-asset:')) {
      const id=profile.slice(11),item=root.FrontierItems?.find(/* @function automaticNormals.itemPath1617 — Inputs: item definition. Resolves the existing item ID to its authored sprite path once, allowing packaged pickups to share pre-baked relief without processing UI icons. */function(value){return value.id===id;});
      if(item?.properties?.sprite?.src)return item.properties.sprite.src;
    }
    const registered=root.FrontierMuzzle?.profiles.get(profile);

    let value=registered?.sheet||profile||source.currentSrc||source.src||'';

    if(!value.startsWith('img/')&&!value.startsWith('data:')) {

      const uri=source.currentSrc||source.src||value;

      const marker=uri.indexOf('/img/');

      value=marker>=0?decodeURIComponent(uri.slice(marker+1)):uri;

    }

    return value;

  }

  /* @function automaticNormals.url1617 — Inputs: original world material URL. Returns its pre-baked native-size relief URL when available and enabled; otherwise the original URL. UI/sky callers never use this service. Does not fetch or allocate pixels. */
  /* @function automaticNormals.liveUrl1618 — Inputs: original URL. Returns it unchanged; fixed lit URLs are no longer chosen. Real normal lookup remains content-verified under load/image. */
  function url(path) {

    return path; // November 1: only real normal textures are paired; fixed lit artwork is historical.

  }

  /* @function automaticNormals.reserve1617 — Inputs: requested decoded RGBA bytes. Returns whether the bounded additional sprite-relief cache can retain it. Evicts only cold entries unused for two seconds, releasing their GPU copies. Active artwork is never shrunk; budget pressure keeps original art as a safe fallback. */
  function reserve(size) {

    if(size>LIMIT)return false;

    for(const [key,item] of cache) {

      if(bytes+size<=LIMIT)break;

      if(item.last+2000>performance.now()||item.pending)continue;

      if(item.image){root.FrontierPixi?.releaseImage(item.image);root.FrontierLiveNormals?.releaseNormal(item.image);}
      if(item.source.frontierNormalImage===item.image)delete item.source.frontierNormalImage;

      bytes-=item.bytes||0;
      cache.delete(key);

    }

    return bytes+size<=LIMIT;

  }

  /* @function automaticNormals.read1617 — Inputs: local or same-origin image URI. Returns a decoded Image. File packages load bytes through XHR into an origin-clean Blob, preserving WebGL/canvas access; failures reject and callers retain original art. Revokes temporary Blob URLs after decode. */
  async function read(uri) {

    const image=new Image();
    let owned;

    try {

      if(uri.startsWith('data:')) {
        // Keep prepared images backed by a Blob rather than a large retained data-URI string.
        const blob=await (await fetch(uri)).blob();owned=URL.createObjectURL(blob);image.src=owned;
      } else if(location.protocol==='file:'&&!uri.startsWith('blob:')) {

        const blob=await new Promise(/* @function automaticNormals.file1617 — Inputs: promise settlement callbacks. Reads one packaged image as bytes, accepting file status 0 and HTTP success only. No arbitrary filesystem bridge or remote upload. */function(resolve,reject) {

          const request=new XMLHttpRequest();
          request.open('GET',uri);
          request.responseType='blob';

          request.onload=/* @function automaticNormals.fileLoaded1617 — Inputs: load event ignored. Resolves a successful nonempty file Blob, otherwise rejects without retry loops. */function(){
            if((request.status===0||request.status===200)&&request.response?.size)resolve(request.response);
            else reject(Error('Normal artwork unavailable'));
          };

          request.onerror=/* @function automaticNormals.fileFailed1617 — Inputs: network event ignored. Rejects the single image load; original art remains usable. */function(){
            reject(Error('Normal artwork could not be read'));
          };
          request.send();

        });

        owned=URL.createObjectURL(blob);
        image.src=owned;

      } else image.src=uri;

      await image.decode();
      if(!uri.startsWith('blob:'))image.frontierAutomaticSourceUri=uri;
      return image;

    } finally {
      if(owned)URL.revokeObjectURL(owned);
    }

  }

  /* @function automaticNormals.sourceBlob1617 — Inputs: authored source URI. Returns original encoded image bytes for content verification without decoding a second full-size image. Supports portable file/data/same-origin assets; errors reject rather than reuse stale relief after an artwork replacement. */
  async function sourceBlob(uri) {

    if(location.protocol!=='file:'||uri.startsWith('data:')||uri.startsWith('blob:'))return await (await fetch(uri)).blob();

    return await new Promise(/* @function automaticNormals.sourceRequest1617 — Inputs: promise settlement callbacks. Reads only the requested source asset as a Blob for its digest; no project writes or external uploads. */function(resolve,reject){
      const request=new XMLHttpRequest();
      request.open('GET',uri);
      request.responseType='blob';
      request.onload=/* @function automaticNormals.sourceLoaded1617 — Inputs: load event ignored. Accepts a nonempty local-file/HTTP-success response only. */function(){
        if((request.status===0||request.status===200)&&request.response?.size)resolve(request.response);
        else reject(Error('Source artwork is unavailable'));
      };
      request.onerror=/* @function automaticNormals.sourceFailed1617 — Inputs: read failure ignored. Rejects the source verification; original-art fallback is owned by load. */function(){
        reject(Error('Source artwork could not be verified'));
      };
      request.send();
    });

  }

  /* @function automaticNormals.load1617 — Inputs: material path and optional embedded original URI. Returns a decoded origin-clean image, using packaged relief only after verifying original source bytes. Replaced files/imports cannot silently display old cached art. Unmatched/new art stays original for the caller's one-time preparation. No full-size source decode is needed on a packaged cache hit. */
  /* @function automaticNormals.liveLoad1618 — Inputs: source path and optional embedded URI. Returns original decoded albedo plus a separate verified normal image when packaged; future art prepares asynchronously through its existing owner. Never substitutes the historical lit WebP. */
  async function load(path,uri=path) {

    const record=enabled&&root.FrontierAutomaticNormalManifest?.entries[path];

    if(!record){const image=await read(uri);image.frontierAutomaticSourceUri=uri;return image;}

    try {

      const original=await sourceBlob(uri),digest=await crypto.subtle.digest('SHA-256',await original.arrayBuffer());

      const hash=Array.from(new Uint8Array(digest),/* @function automaticNormals.sourceHash1617 — Inputs: digest byte. Returns fixed-width hex for original-art identity. */function(byte){
        return byte.toString(16).padStart(2,'0');
      }).join('');

      if(hash===record.sha256){
        const owned=URL.createObjectURL(original);
        let image;try{image=await read(owned);}finally{URL.revokeObjectURL(owned);}
        image.frontierAutomaticSourceHash=hash;
        image.frontierNormalImage=await read(record.normal);
        image.frontierAutomaticPrepared=false;
        return image;
      }

      const owned=URL.createObjectURL(original);
      try{
        const image=await read(owned);
        image.frontierAutomaticSourceHash=hash;
        image.frontierAutomaticSourceUri=uri;
        return image;
      }finally{
        URL.revokeObjectURL(owned);
      }

    } catch(error){
      issue(path,error.message);
      return await read(uri);
    }

  }

  /* @function automaticNormals.dataUrl1617 — Inputs: generated PNG Blob. Returns a data URL for portable cache/export, asynchronously through FileReader. Rejects read failures; never modifies project data or sends artwork externally. */
  function dataUrl(blob) {

    return new Promise(/* @function automaticNormals.reader1617 — Inputs: resolve/reject. Registers one local Blob conversion and lets browser perform encoding outside the draw traversal. */function(resolve,reject) {

      const reader=new FileReader();
      reader.onload=/* @function automaticNormals.encoded1617 — Inputs: load event ignored. Resolves the completed local data URI. */function(){
        resolve(reader.result);
      };
      reader.onerror=/* @function automaticNormals.encodingFailed1617 — Inputs: read event ignored. Rejects the current preparation without replacing original art. */function(){
        reject(reader.error);
      };
      reader.readAsDataURL(blob);

    });

  }

  /* @function automaticNormals.generate1617 — Inputs: decoded origin-clean source and uniform sheet layout. Returns normal and native-size relief PNG data URLs. Generates at a maximum 512-pixel side for bounded detail cost; uniform cells stay isolated. Opaque materials use wrapped neighbours, avoiding seams. Transparent normal padding is flattened before scaling; original alpha comes from the existing shading worker. One queue owns this work, never a per-frame loop. Errors propagate to fallback status. */
  async function generateNow(source,layout={
  },signal) {

    const width=source.naturalWidth||source.width,height=source.naturalHeight||source.height;

    if(!width||!height||width>8192||height>8192||width*height>16777216)throw Error('Automatic normals exceed the 16-megapixel source budget');

    const columns=layout.columns||1,rows=layout.rows||1,scale=Math.min(1,512/width,512/height);

    const fw=Math.max(1,Math.floor(width*scale/columns)),fh=Math.max(1,Math.floor(height*scale/rows)),w=fw*columns,h=fh*rows;

    const canvas=new OffscreenCanvas(w,h),ctx=canvas.getContext('2d',{
      willReadFrequently:true
    });
    ctx.drawImage(source,0,0,w,h);

    const art=ctx.getImageData(0,0,w,h);
    let alpha=false;

    for(let i=3;i<art.data.length;i+=4)if(art.data[i]<255){
      alpha=true;
      break;
    }

    let input=art;
    const wrapped=!alpha&&columns===1&&rows===1;

    if(wrapped){
      const repeat=new OffscreenCanvas(w*3,h*3),r=repeat.getContext('2d');
      for(let y=0;y<3;y++)for(let x=0;x<3;x++)r.drawImage(canvas,x*w,y*h);
      input=r.getImageData(0,0,w*3,h*3);
    }

    const options={
      strength:1.5,detail:6,smoothing:.6,volume:alpha?1.15:0
    };

    if(columns>1||rows>1){
      options.frame_width=fw;
      options.frame_height=fh;
    }

    const result=await root.FrontierSpriteFusion.generate(input,options,signal),normal=await createImageBitmap(new Blob([result.normal],{
      type:'image/png'
    }));

    ctx.clearRect(0,0,w,h);
    if(wrapped)ctx.drawImage(normal,w,h,w,h,0,0,w,h);
    else ctx.drawImage(normal,0,0);
    normal.close();

    const corrected=ctx.getImageData(0,0,w,h);

    for(let i=0;i<corrected.data.length;i+=4){
      if(!corrected.data[i+3]){
        corrected.data[i]=128;
        corrected.data[i+1]=128;
        corrected.data[i+2]=255;
      }else corrected.data[i+2]=Math.max(129,corrected.data[i+2]);
      corrected.data[i+3]=255;
    }

    ctx.putImageData(corrected,0,0);
    const png=await dataUrl(await canvas.convertToBlob({
      type:'image/png'
    }));

    // November 1, 2026: supersedes native-size shaded copies. Only bounded real normal data is generated; old cache records may still contain historical lit PNGs.
    return {normal:png,lit:'',width,height,columns,rows};

  }

  /* @function automaticNormals.generateQueued1617 — Inputs: decoded source and uniform layout. Returns a promise for the existing bounded generator, serializing sprites and model/material imports through one worker pipeline. A failed job does not poison later requests. No draw-loop polling or parallel WASM jobs are created. */
  function generate(source,layout={
  },identity=source.frontierAutomaticSourceHash||source.frontierAutomaticSourceUri||source.currentSrc||source.src||'') {

    const width=source.naturalWidth||source.width,height=source.naturalHeight||source.height,columns=layout.columns||1,rows=layout.rows||1;

    if(!Number.isInteger(columns)||!Number.isInteger(rows)||columns<1||rows<1||columns>64||rows>64||width%columns||height%rows||layout.frameWidth&&layout.frameWidth*columns!==width||layout.frameHeight&&layout.frameHeight*rows!==height)return Promise.reject(Error('Automatic normals need uniform sheet cells matching the image; use a custom normal map for this layout.'));

    if(width>8192||height>8192||width*height>16777216)return Promise.reject(Error('Automatic normals exceed 8192 pixels per side or 16 megapixels.'));

    generationPending++;

    const job=generationTail.then(/* @function automaticNormals.startGeneration1617 — Inputs: none. Starts the next asset only after preceding work settles. Uses a recipe/source/layout digest for persistent reuse, preventing stale artwork reuse. Source remains original. */async function(){

      const keyBytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('relief2|'+identity+'|'+JSON.stringify(layout.columns||1)+'|'+JSON.stringify(layout.rows||1)));

      const key=Array.from(new Uint8Array(keyBytes),/* @function automaticNormals.digestByte1617 — Inputs: one digest byte. Returns its fixed-width hex representation; no mutation. */function(byte){
        return byte.toString(16).padStart(2,'0');
      }).join('');

      const hit=identity?await cached(key):null;
      if(hit){
        stats.diskHits=(stats.diskHits||0)+1;
        return hit;
      }

      const cancel=new AbortController(),timeout=setTimeout(/* @function automaticNormals.timeout1617 — Inputs: none. Aborts both generator and shading workers if one asset exceeds ninety seconds; later queue items remain available. */function(){
        cancel.abort();
      },90000);

      try{
        const data=await generateNow(source,layout,cancel.signal);
        stats.generated=Math.min(1000000,stats.generated+1);
        if(identity)await cached(key,data);
        return data;
      }
      finally{
        clearTimeout(timeout);
      }

    });

    generationTail=job.catch(/* @function automaticNormals.continue1617 — Inputs: prior generation error. Settles the sequencing tail only; the original job still rejects to its caller for fallback reporting. */function(){
    });

    return job.finally(/* @function automaticNormals.finishGeneration1617 — Inputs: none. Releases one pending-work count on success or failure; does not change authored data. */function(){
      generationPending--;
    });

  }

  /* @function automaticNormals.drain1617 — Inputs: none. Runs one queued asset preparation at a time, outside renderer traversal. Packaged assets only decode pre-baked images; imported art uses exact local Sprite Fusion then the existing normal worker. Failure/budget limits retain original art. Releases reservations on failure; bounded diagnostics contain no per-frame logging. */
  async function drain() {

    if(running)return;
    running=true;

    try {

      while(queue.length) {

        const item=queue.shift();

        try {

          let record=root.FrontierAutomaticNormalManifest?.entries[item.path];

          if(record&&item.source.frontierAutomaticSourceHash&&item.source.frontierAutomaticSourceHash!==record.sha256)record=null;

          const sourceUri=item.source.frontierAutomaticSourceUri||item.source.currentSrc||item.source.src||'';
          let sourceHash=item.source.frontierAutomaticSourceHash||'';

          if(!sourceHash&&sourceUri) {

            const raw=await (await sourceBlob(sourceUri)).arrayBuffer(),digest=await crypto.subtle.digest('SHA-256',raw);

            const hash=Array.from(new Uint8Array(digest),/* @function automaticNormals.verifySource1617 — Inputs: digest byte. Returns fixed-width hex to ensure a custom sheet payload never reuses another artwork's packaged relief. */function(byte){
              return byte.toString(16).padStart(2,'0');
            }).join('');

            sourceHash=hash;

          }

          if(record&&sourceHash!==record.sha256)record=null;
          if(record)item.image=await read(record.normal);

          else {

            const data=await generate(item.source,item.layout,sourceHash||sourceUri);

            item.image=await read(data.normal);

          }

          if(!item.image.naturalWidth||!item.image.naturalHeight)throw Error('Automatic normal texture did not decode');
          item.source.frontierNormalImage=item.image;

          // Live albedo remains owned by its existing sprite cache.

          stats.loads++;

        } catch(error) {
          item.image=null;
          item.error=error.message;
          bytes-=item.bytes;
          item.bytes=0;
          stats.failures++;
          issue(item.path,error.message);
        }
        finally {
          item.pending=false;
          item.resolve?.();
        }

      }

    } finally {
      running=false;
    }

  }

  /* @function automaticNormals.image1617 — Inputs: original decoded sprite/material Image and optional profile/path. Returns same-size cached relief Image or original while pending, unsupported or over budget. Custom normal callers check their authored binding first. Lazy one-time registration is constant-time thereafter; no image reads, generation, geometry edits or new draw passes occur in this function. */
  /* @function automaticNormals.liveImage1618 — Inputs: original image and profile/path. Returns that exact albedo, starting one bounded normal-map job when absent; publishes a separate normal atlas. No pixel shading, projection, alpha or frame changes. Normal detail budget reserves one MiB per queued source and cold eviction releases the normal GPU copy. Supersedes the historical relief-return contract above. */
  function image(source,profile) {

    if(!enabled||!source?.naturalWidth||(source.frontierNormalImage&&!sources.has(source)))return source;

    if((blocked.get(source)||0)>performance.now())return source;

    let item=sources.get(source);

    if(item&&cache.get(source)!==item){
      sources.delete(source);
      item=null;
    }

    if(!item) {

      const path=sourcePath(source,profile),size=512*512*4;

      item=cache.get(source);

      if(!item) {

        if(!reserve(size)){
          stats.budgetFallbacks=Math.min(1000000,stats.budgetFallbacks+1);
          if(!blocked.has(source))issue(path,'Normal relief cache is full; original artwork retained.');
          blocked.set(source,performance.now()+1000);
          return source;
        }

        const layout=root.FrontierMuzzle?.profiles.get(profile)||(profile==='candy-unarmed'?{
          columns:3,rows:4
        }
        :{
        });

        item={
          path,source,layout,last:performance.now(),bytes:size,pending:true
        };

        bytes+=size;
        cache.set(source,item);
        queue.push(item);

        item.promise=new Promise(/* @function automaticNormals.completion1617 — Inputs: completion callback. Stores the asset's one settlement signal for loading/export readiness. No gameplay state is captured. */function(resolve){
          item.resolve=resolve;
        });

        queueMicrotask(/* @function automaticNormals.defer1617 — Inputs: none. Starts queued preparation after current rendering traversal; work is serialized by drain. */function(){
          void drain();
        });

      }

      sources.set(source,item);

    }

    if(item.image&&!source.frontierNormalImage)source.frontierNormalImage=item.image;
    item.last=performance.now();
    stats.hits=Math.min(1000000,stats.hits+1);
    return source;

  }

  /* @function automaticNormals.pixels1617 — Inputs: original decoded world-material pixel record, optional path and encoded-source SHA-256. Returns promise of same-size normal-relief pixels for asset loading. Retains original pixels on generation failure. No per-pixel work is added to CPU/GPU draw loops; geometry, UVs, alpha and live lighting remain owned by their existing renderers. */
  async function historicalReliefPixels1617(original,path='',encodedSourceHash='') {

    if(!enabled)return original;
    const packaged=encodedSourceHash&&Object.values(root.FrontierAutomaticNormalManifest?.entries||{}).find(/* @function automaticNormals.modelBake1617 — Inputs: packaged record. Finds identical embedded model-image bytes and native dimensions, allowing shared material bakes instead of another worker run. */function(record){return record.sha256===encodedSourceHash&&record.width===original.width&&record.height===original.height;});
    if(packaged) {
      try{const image=await read(packaged.lit),canvas=new OffscreenCanvas(original.width,original.height),ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);return {width:original.width,height:original.height,data:ctx.getImageData(0,0,original.width,original.height).data};}
      catch(error){issue(path||'Packaged model material',error.message);return original;}
    }


    const canvas=new OffscreenCanvas(original.width,original.height);
    canvas.getContext('2d').putImageData(new ImageData(original.data,original.width,original.height),0,0);

    const bitmap=await createImageBitmap(canvas);

    try {

      const digest=await crypto.subtle.digest('SHA-256',original.data);

      const identity=original.width+'x'+original.height+':'+Array.from(new Uint8Array(digest),/* @function automaticNormals.pixelDigest1617 — Inputs: one source digest byte. Returns fixed-width hex for content-addressed model/material cache ownership. */function(byte){
        return byte.toString(16).padStart(2,'0');
      }).join('');

      const data=await generate(bitmap,{
      },identity),lit=await read(data.lit);

      const out=new OffscreenCanvas(original.width,original.height),ctx=out.getContext('2d',{
        willReadFrequently:true
      });
      ctx.drawImage(lit,0,0);

      return {
        width:original.width,height:original.height,data:ctx.getImageData(0,0,original.width,original.height).data
      };

    } catch(error){
      stats.failures++;
      issue(path||'Imported model material',error.message);
      return original;
    } finally {
      bitmap.close();
    }

  }

  /* @function automaticNormals.pixels1618 — Inputs: original native RGBA record, source label, optional encoded SHA and decoded normal. Returns original albedo with a separate bounded normal RGBA record. Reads/generates only while loading, never in drawing. Source hashes select packaged normals; failures preserve original artwork and report an issue. */
  async function pixels(original,path='',encodedSourceHash='',normalImage=null){
    if(!enabled)return original;
    try{
      const record=root.FrontierAutomaticNormalManifest?.entries[path]||Object.values(root.FrontierAutomaticNormalManifest?.entries||{}).find(/* @function automaticNormals.match1618 — Inputs: manifest entry. Returns exact encoded source/native-dimension agreement; no mutation. */function(e){return encodedSourceHash&&e.sha256===encodedSourceHash&&e.width===original.width&&e.height===original.height;});
      if(!normalImage&&record&&encodedSourceHash===record.sha256)normalImage=await read(record.normal);
      if(!normalImage){
        const c=new OffscreenCanvas(original.width,original.height);c.getContext('2d').putImageData(new ImageData(original.data,original.width,original.height),0,0);
        const bitmap=await createImageBitmap(c);
        try{const digest=await crypto.subtle.digest('SHA-256',original.data);const data=await generate(bitmap,{},Array.from(new Uint8Array(digest)).join(','));normalImage=await read(data.normal);}finally{bitmap.close();}
      }
      const c=new OffscreenCanvas(normalImage.naturalWidth,normalImage.naturalHeight),ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(normalImage,0,0);
      return {...original,normal:{width:c.width,height:c.height,data:ctx.getImageData(0,0,c.width,c.height).data}};
    }catch(error){issue(path,error.message);return original;}
  }

  /* @function automaticNormals.set1617 — Inputs: Boolean transient diagnostic enable state. Enables defaults or returns originals without changing authored normal bindings, image files, lighting or camera presentation. Existing prepared images remain cached for comparison. */
  function set(value){
    enabled=!!value;
  }

  /* @function automaticNormals.debug1617 — Inputs: none. Returns bounded cache/status snapshot in RGBA bytes. Does not start jobs or inspect source pixels. */
  function debug(){
    return {
      ...stats,enabled,bytes,limit:LIMIT,entries:cache.size,pending:queue.length+(running?1:0),generationPending,packaged:Object.keys(root.FrontierAutomaticNormalManifest?.entries||{
      }).length,issues:issues.slice()
    };
  }

  /* @function automaticNormals.settle1617 — Inputs: none. Waits for currently registered preparation jobs, supporting exports and loading tests. Does not invent asset requests or pause/change gameplay itself. */
  async function settle(){
    for(const item of cache.values())if(item.pending)await item.promise;
  }

  root.FrontierAutomaticNormals={
    image,url,pixels,generate,read,load,set,debug,settle
  };

})(window);


