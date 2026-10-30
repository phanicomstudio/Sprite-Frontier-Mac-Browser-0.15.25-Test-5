
  // October 30, 2026: use the active Pixi projection for screen and filter targets; direct clip-space positions invert/resize custom meshes during filtering.
/* October 26, 2026: receiver-conforming outdoor sprite sun silhouettes.
 * Own code; no Daggerfall assets or renderer code. Reuses swept geometry and
 * current sprite alpha; actor billboard tilt and frame presentation stay locked. */
(/* @function sunShadows.install163 â€” Inputs: browser namespace. Publishes bounded renderer; allocates resources only when an outdoor scene actually draws shadows. */function(root){
  "use strict";
  const states=new WeakMap(),COLS=4,ROWS=8,LIMIT=8;
  const vertex=`#version 300 es
  precision highp float;in vec2 aPosition;in vec2 aUV;in float aInverse;in float aFog;uniform vec2 uViewport;uniform mat3 uProjectionMatrix;uniform mat3 uWorldTransformMatrix;uniform mat3 uTransformMatrix;out vec2 vUV;out float vInverse;out float vFog;out vec2 vScreen;
  void main(){gl_Position=vec4((uProjectionMatrix*uWorldTransformMatrix*uTransformMatrix*vec3(aPosition,1.)).xy,0.,1.);vUV=aUV;vInverse=aInverse;vFog=aFog;vScreen=aPosition/uViewport;}`;
  const fragment=`#version 300 es
  precision highp float;uniform sampler2D uImage;uniform sampler2D uDepth;uniform vec2 uViewport;uniform vec2 uDepthSize;uniform float uOpacity;uniform float uOrtho;in vec2 vUV;in float vInverse;in float vFog;in vec2 vScreen;out vec4 color;
  void main(){vec2 screen=vScreen;vec3 packed=texture(uDepth,screen).rgb;float inverse=(packed.r*65536.+packed.g*256.+packed.b)*255./16777215.*16.;if(inverse>vInverse+(uOrtho>.5?.002*vInverse*vInverse:.002))discard;float alpha=texture(uImage,uOrtho>.5?vUV:vUV/max(vInverse,.000001)).a;color=vec4(0.,0.,0.,alpha*uOpacity*(1.-vFog));}`;
  /* @function sunShadows.receiver163 â€” Inputs: live scene, world sprite-plane source point, normalized sun ray and caster ID. Returns nearest terrain/static-geometry hit with world coordinates/receiver key, or null. Rays are at most 32 m; shared sweep uses a numerical skin and does not mutate combat. */
  function receiver163(game,from,direction,id){
    const end={x:from.x+direction.x*32,y:from.y+direction.y*32,z:from.z+direction.z*32};
    const hit=root.FrontierBallistics.sweep(game,from,end,0,id,true);
    if(!hit||hit.kind==="boundary")return null;
    const x=from.x+(end.x-from.x)*hit.t,y=from.y+(end.y-from.y)*hit.t;
    return {x,y,z:(hit.kind==="terrain"&&hit.t===0?root.FrontierTerrain.height(game.sourceWorld,x,y):from.z+(end.z-from.z)*hit.t)+.008,key:hit.kind+":"+hit.id};
  }
  /* @function sunShadows.receiverGrid163 â€” Inputs: scene, caster, current sprite frame/sheet, camera and validated sun. Returns fixed-size grid of nearest receiving-surface hits. Forty-five full rays per rebuild; frame UVs remain on original artwork. No textures, entities or source maps change. */
  function receiverGrid163(game,e,frame,sheet,cam,sun){
    const metres=(e.height||1.65)/(sheet.referenceHeight||310),az=sun.azimuth*Math.PI/180,el=sun.elevation*Math.PI/180;
    const direction={x:-Math.sin(az)*Math.cos(el),y:-Math.cos(az)*Math.cos(el),z:-Math.sin(el)},result=[];
    for(let row=0;row<=ROWS;row++)for(let col=0;col<=COLS;col++){
      const side=(col/COLS*frame.w-frame.anchorX)*metres;
      const from={x:e.x+Math.cos(cam.yaw)*side,y:e.y-Math.sin(cam.yaw)*side,z:(e.z||0)+Math.max(.012,((1-row/ROWS)*frame.h-(sheet.groundInset||0))*metres)};
      result.push(receiver163(game,from,direction,e.id));
    }
    return result;
  }
  /* @function sunShadows.createSlot163 â€” Inputs: Pixi namespace and reusable depth texture. Returns pooled alpha-shadow mesh and mutable vertex buffers. Fixed capacity is 45 vertices/192 indices; resources persist across maps and frames instead of being recreated per caster. */
  function createSlot163(P,depth){
    const count=(COLS+1)*(ROWS+1),positions=new Float32Array(count*2),uvs=new Float32Array(count*2),inverse=new Float32Array(count),fog=new Float32Array(count),indices=new Uint32Array(COLS*ROWS*6);
    const geometry=new P.MeshGeometry({positions,uvs,indices});
    const invBuffer=new P.Buffer({data:inverse,usage:P.BufferUsage.VERTEX|P.BufferUsage.COPY_DST}),fogBuffer=new P.Buffer({data:fog,usage:P.BufferUsage.VERTEX|P.BufferUsage.COPY_DST});
    geometry.addAttribute('aInverse',{buffer:invBuffer,format:'float32'});geometry.addAttribute('aFog',{buffer:fogBuffer,format:'float32'});
    const shader=P.Shader.from({gl:{vertex,fragment},resources:{uImage:P.Texture.WHITE.source,uDepth:depth,shadowUniforms:{uViewport:{value:new Float32Array(2),type:'vec2<f32>'},uDepthSize:{value:new Float32Array(2),type:'vec2<f32>'},uOpacity:{value:.24,type:'f32'},uOrtho:{value:0,type:'f32'}}}});
    return {mesh:new P.Mesh({geometry,shader}),geometry,shader,positions,uvs,inverse,fog,indices,invBuffer,fogBuffer};
  }
  /* @function sunShadows.draw163 â€” Inputs: active Pixi drawing adapter, live game, active camera, visible entity candidates and projection callback. Returns count of submitted outdoor shadow meshes. Rebuilds at most two 45-ray grids per frame, caches at most 8 nearest casters, updates GPU depth from existing CPU data without readback, and rejects triangles crossing disconnected receivers. Interiors and disabled sun skip all work. Terrain/static mesh/custom collision must match visible receivers; transparent/noncollision decoration receives none. */
  function draw163(ctx,game,cam,entities,project){
    const world=game.sourceWorld;if((world.interior&&!world.interior.outdoor)||!world.lighting?.enabled||!ctx.terrainDepth||!root.FrontierBallistics)return 0;
    const sun=root.FrontierLocalLighting.sun163(world.lighting.sun);if(!sun.enabled||!sun.opacity||!root.FrontierLocalLighting.shadows169(world.lighting.shadows).sun)return 0;
    const P=root.PIXI,d=ctx.terrainDepth;let state=states.get(ctx);
    if(!state){state={slots:[],cache:new Map()};states.set(ctx,state);}
    if(state.world!==world){state.cache.clear();state.world=world;}
    if(!state.depth||state.w!==d.w||state.h!==d.h){if(state.depth)state.depth.destroy();state.w=d.w;state.h=d.h;state.pixels=new Uint8Array(d.w*d.h*4);state.depth=new P.BufferImageSource({resource:state.pixels,width:d.w,height:d.h,format:'rgba8unorm',scaleMode:'nearest'});}
    for(let i=0;i<d.values.length;i++){const n=Math.min(16777215,Math.max(0,Math.round(d.values[i]/16*16777215))),j=i*4;state.pixels[j]=n>>16;state.pixels[j+1]=(n>>8)&255;state.pixels[j+2]=n&255;state.pixels[j+3]=255;}
    state.depth.update();state.depthFrame=game.elapsed;
    const candidates=[];for(const e of entities)if(!e.dead&&(e.kind==='player'||e.spriteProfile)&&Math.hypot(e.x-game.player.x,e.y-game.player.y)<24)candidates.push(e);
    candidates.sort(/* @function sunShadows.nearest163 â€” Inputs: two eligible casters. Returns distance ordering so the bounded shadow budget prioritizes nearby gameplay actors; no source mutation. */function(a,b){return Math.hypot(a.x-game.player.x,a.y-game.player.y)-Math.hypot(b.x-game.player.x,b.y-game.player.y);});
    let used=0,rebuilt=0;const retained=new Set();
    for(const e of candidates.slice(0,LIMIT)){
      const sheet=root.FrontierSprites?.sheet(e);if(!sheet?.image.complete||!sheet.image.naturalWidth)continue;
      const water=root.FrontierWater?.level(world,e.x,e.y);if(Number.isFinite(water)&&water>(e.z||0)+.05)continue;
      const selected=root.FrontierDirections.select(e,cam.yaw,sheet.direction,cam),frame=sheet.frames[selected.row*(sheet.columns||3)+selected.column];if(!frame)continue;
      const key=[e.x,e.y,e.z,frame.w,frame.h,frame.anchorX,cam.yaw,sun.azimuth,sun.elevation].join(':');let cached=state.cache.get(e.id);
      if(!cached||cached.key!==key||(game.elapsed||0)-cached.time>.2){if(rebuilt>=2)continue;cached={key,time:game.elapsed||0,grid:receiverGrid163(game,e,frame,sheet,cam,sun)};state.cache.set(e.id,cached);rebuilt++;}
      retained.add(e.id);const slot=state.slots[used]||(state.slots[used]=createSlot163(P,state.depth));let image=ctx.sources.get(sheet.image);
      if(!image){image=new P.ImageSource({resource:sheet.image,scaleMode:'linear'});ctx.sources.set(sheet.image,image);ctx.crops.set(sheet.image,new Map());}
      const points=[];
      for(let row=0;row<=ROWS;row++)for(let col=0;col<=COLS;col++){
        const index=row*(COLS+1)+col,hit=cached.grid[index],p=hit&&project(cam,hit.x,hit.y,hit.z);points[index]=p;
        const q=p?1/Math.max(.13,p.depth):0,textureQ=cam.orthographic?1:q;slot.positions[index*2]=p?.x||0;slot.positions[index*2+1]=p?.y||0;slot.inverse[index]=q;
        slot.uvs[index*2]=(frame.x+col/COLS*frame.w)/sheet.image.naturalWidth*textureQ;slot.uvs[index*2+1]=(frame.y+row/ROWS*frame.h)/sheet.image.naturalHeight*textureQ;
        slot.fog[index]=p?root.FrontierFog.amount(root.FrontierFog.settings(game),cam.orthographic?Math.hypot(cached.grid[index].x-game.player.x,cached.grid[index].y-game.player.y):p.depth):1;
      }
      let at=0;for(let row=0;row<ROWS;row++)for(let col=0;col<COLS;col++){
        const a=row*(COLS+1)+col,b=a+1,c=a+COLS+1,f=c+1;
        for(const triangle of [[a,b,c],[b,f,c]]){
          const valid=triangle.every(/* @function sunShadows.connected163 â€” Inputs: grid vertex index. Returns whether projected receiver exists and agrees with the first receiver, avoiding stretched shadows across disconnected surfaces. */function(index){return !!points[index]&&cached.grid[index]?.key===cached.grid[triangle[0]]?.key;});
          for(const index of triangle)slot.indices[at++]=valid?index:0;
        }
      }
      slot.geometry.getBuffer('aPosition').update();slot.geometry.getBuffer('aUV').update();slot.geometry.indexBuffer.update();slot.invBuffer.update();slot.fogBuffer.update();
      slot.shader.resources.uImage=image;slot.shader.resources.uDepth=state.depth;slot.shader.resources.shadowUniforms.uniforms.uViewport.set([game.viewWidth||640,480]);slot.shader.resources.shadowUniforms.uniforms.uDepthSize.set([d.w,d.h]);slot.shader.resources.shadowUniforms.uniforms.uOpacity=Math.min(.9,sun.opacity*root.FrontierLocalLighting.shadows169(world.lighting.shadows).sun);slot.shader.resources.shadowUniforms.uniforms.uOrtho=cam.orthographic?1:0;
      ctx.flushStroke();(ctx.drawStage||ctx.app.stage).addChild(slot.mesh);used++;
    }
    for(const id of state.cache.keys())if(!retained.has(id))state.cache.delete(id);
    game.sunShadowDebug={casters:used,rebuilt,rays:rebuilt*(COLS+1)*(ROWS+1),receiverConforming:true,outdoors:true};return used;
  }

  // October 26, 2026: contact blobs are independent of sun lighting. They remain on receivers while actors jump, without changing billboard presentation.
  const contacts166=new WeakMap();
  const contactFragment166=`#version 300 es
  precision highp float;uniform sampler2D uDepth;uniform float uOpacity;uniform float uSoftness;in vec2 vUV;in float vInverse;in float vFog;in vec2 vScreen;out vec4 color;
  void main(){vec3 packed=texture(uDepth,vScreen).rgb;float inverse=(packed.r*65536.+packed.g*256.+packed.b)*255./16777215.*16.;if(inverse>vInverse+.002*vInverse*vInverse)discard;float radius=length(vUV*2.-1.);float alpha=1.-smoothstep(.3*(1.-uSoftness),1.,radius);color=vec4(0.,0.,0.,alpha*uOpacity*(1.-vFog));}`;
  /* @function contactShadow.profile166 — Inputs: height above receiving floor in metres. Returns radius/opacity/softness, gently shrinking and softening over the first two metres. Landing restores the original contact size/density; no time integration, sun direction or actor mutation. */
  function contactProfile166(height){if(!Number.isFinite(height))throw Error("Contact shadow height must be finite.");const t=Math.max(0,Math.min(1,height/2));return {radius:.3*(1-.2*t),opacity:.16*(1-.5*t),softness:t};}
  /* @function contactShadow.slot166 — Inputs: Pixi namespace and shared packed receiver-depth source. Returns one reusable 9-vertex/24-index GPU blob slot with analytic soft radial alpha. No image assets, per-frame texture creation or CPU bitmap painting. */
  function contactSlot166(P,depth){
    const positions=new Float32Array(18),uvs=new Float32Array(18),inverse=new Float32Array(9),fog=new Float32Array(9),indices=new Uint32Array(24),geometry=new P.MeshGeometry({positions,uvs,indices});
    const invBuffer=new P.Buffer({data:inverse,usage:P.BufferUsage.VERTEX|P.BufferUsage.COPY_DST}),fogBuffer=new P.Buffer({data:fog,usage:P.BufferUsage.VERTEX|P.BufferUsage.COPY_DST});
    geometry.addAttribute('aInverse',{buffer:invBuffer,format:'float32'});geometry.addAttribute('aFog',{buffer:fogBuffer,format:'float32'});
    const shader=P.Shader.from({gl:{vertex,fragment:contactFragment166},resources:{uDepth:depth,shadowUniforms:{uViewport:{value:new Float32Array(2),type:'vec2<f32>'},uOpacity:{value:.16,type:'f32'},uSoftness:{value:0,type:'f32'}}}});
    return {mesh:new P.Mesh({geometry,shader}),geometry,shader,positions,uvs,inverse,fog,indices,invBuffer,fogBuffer};
  }
  /* @function contactShadow.grid166 — Inputs: live scene and actor. Returns 3x3 downward geometry receivers under a 0.6 m square, or null vertices over void. Uses nine existing geometry-only sweeps, independent of combat, following terrain/floors/models rather than actor elevation. */
  function contactGrid166(game,e){const grid=[];for(let row=0;row<3;row++)for(let col=0;col<3;col++)grid.push(receiver163(game,{x:e.x+(col-1)*.3,y:e.y+(row-1)*.3,z:(e.z||0)+.04},{x:0,y:0,z:-1},e.id));return grid;}
  /* @function contactShadow.draw166 — Inputs: existing adapter, active game/camera, actors and authoritative projection. Returns submitted contact-blob count in isometric gameplay. Pools at most eight meshes, rebuilds at most one nine-ray receiver grid per frame, and ages caches at 0.12 s; terrain heights update cheaply between grid queries. Reuses sun depth upload when available, otherwise uploads existing CPU depth without GPU readback. Disconnecting receiver triangles are suppressed; invisible/dead/submerged actors skip. No light is required indoors, no authored data changes and no shadow follows the jumping sprite vertically. */
  function contactDraw166(ctx,game,cam,entities,project){
    if(!cam.outdoorIsometric||game.authoring||!ctx.terrainDepth||!root.FrontierBallistics||!root.FrontierLocalLighting.shadows169(game.sourceWorld.lighting?.shadows).contact)return 0;
    const P=root.PIXI,d=ctx.terrainDepth;let state=contacts166.get(ctx);if(!state){state={slots:[],cache:new Map()};contacts166.set(ctx,state);}if(state.world!==game.sourceWorld){state.world=game.sourceWorld;state.cache.clear();}
    const sun=states.get(ctx);let depth=sun?.world===game.sourceWorld&&sun.depthFrame===game.elapsed?sun.depth:null;
    if(!depth){if(!state.depth||state.w!==d.w||state.h!==d.h){state.depth?.destroy();state.w=d.w;state.h=d.h;state.pixels=new Uint8Array(d.w*d.h*4);state.depth=new P.BufferImageSource({resource:state.pixels,width:d.w,height:d.h,format:'rgba8unorm',scaleMode:'nearest'});}for(let i=0;i<d.values.length;i++){const n=Math.min(16777215,Math.max(0,Math.round(d.values[i]/16*16777215))),j=i*4;state.pixels[j]=n>>16;state.pixels[j+1]=(n>>8)&255;state.pixels[j+2]=n&255;state.pixels[j+3]=255;}state.depth.update();depth=state.depth;}
    const candidates=[];for(const e of entities)if(e.groundShadow!==false&&!e.dead&&!e.hidden&&!e.transparent&&['player','monster','npc'].includes(e.kind)&&Math.hypot(e.x-game.player.x,e.y-game.player.y)<20)candidates.push(e);
    candidates.sort(/* @function contactShadow.nearest166 — Inputs: eligible actor pair. Returns player-distance ordering for the fixed budget; no actor mutation. */function(a,b){return Math.hypot(a.x-game.player.x,a.y-game.player.y)-Math.hypot(b.x-game.player.x,b.y-game.player.y);});
    let used=0,rebuilt=0;const retained=new Set(),details=[];
    for(const e of candidates.slice(0,8)){
      const water=root.FrontierWater?.level(game.sourceWorld,e.x,e.y);if(Number.isFinite(water)&&water>(e.z||0)+.05)continue;
      let cached=state.cache.get(e.id);const stale=!cached||((game.elapsed||0)-cached.time>.12&&(Math.hypot(e.x-cached.x,e.y-cached.y)>.025||Math.abs((e.z||0)-cached.z)>.025||(game.elapsed||0)-cached.time>.3));
      if(stale&&rebuilt<1){cached={x:e.x,y:e.y,z:e.z||0,time:game.elapsed||0,grid:contactGrid166(game,e)};state.cache.set(e.id,cached);rebuilt++;}if(!cached?.grid[4])continue;retained.add(e.id);
      const receiver=cached.grid[4],floor=receiver.key.startsWith('terrain:')?root.FrontierTerrain.height(game.sourceWorld,e.x,e.y):receiver.z-.008,height=Math.max(0,(e.z||0)-floor),profile=contactProfile166(height),slot=state.slots[used]||(state.slots[used]=contactSlot166(P,depth)),points=[];
      for(let i=0;i<9;i++){const hit=cached.grid[i],ratio=profile.radius/.3,x=e.x+((hit?.x??cached.x)-cached.x)*ratio,y=e.y+((hit?.y??cached.y)-cached.y)*ratio,z=hit?.key.startsWith('terrain:')?root.FrontierTerrain.height(game.sourceWorld,x,y)+.008:hit?.z,p=hit&&project(cam,x,y,z);points.push(p);slot.positions[i*2]=p?.x||0;slot.positions[i*2+1]=p?.y||0;slot.inverse[i]=p?1/Math.max(.13,p.depth):0;slot.uvs[i*2]=(i%3)/2;slot.uvs[i*2+1]=Math.floor(i/3)/2;slot.fog[i]=p?root.FrontierFog.amount(root.FrontierFog.settings(game),Math.hypot(x-game.player.x,y-game.player.y)):1;}
      let at=0;for(let row=0;row<2;row++)for(let col=0;col<2;col++){const a=row*3+col;for(const triangle of [[a,a+1,a+3],[a+1,a+4,a+3]]){const valid=triangle.every(/* @function contactShadow.connected166 — Inputs: vertex index. Returns whether receiver/projection exists on the same connected surface as its triangle peers, avoiding stretched blobs across void. */function(i){return !!points[i]&&cached.grid[i]?.key===cached.grid[triangle[0]]?.key;});for(const i of triangle)slot.indices[at++]=valid?i:0;}}
      slot.geometry.getBuffer('aPosition').update();slot.geometry.getBuffer('aUV').update();slot.geometry.indexBuffer.update();slot.invBuffer.update();slot.fogBuffer.update();slot.shader.resources.uDepth=depth;const uniforms=slot.shader.resources.shadowUniforms.uniforms;uniforms.uViewport.set([game.viewWidth||640,480]);uniforms.uOpacity=Math.min(.8,profile.opacity*root.FrontierLocalLighting.shadows169(game.sourceWorld.lighting?.shadows).contact);uniforms.uSoftness=profile.softness;ctx.flushStroke();(ctx.drawStage||ctx.app.stage).addChild(slot.mesh);used++;details.push({id:e.id,height,floor,radius:profile.radius,opacity:uniforms.uOpacity});
    }
    for(const id of state.cache.keys())if(!retained.has(id))state.cache.delete(id);game.contactShadowDebug={casters:used,rebuilt,rays:rebuilt*9,details};return used;
  }
  root.FrontierContactShadows={profile166:contactProfile166,grid166:contactGrid166,draw166:contactDraw166};

  root.FrontierSunShadows={receiver163,receiverGrid163,draw163};
})(window);
