/* October 26, 2026: receiver-conforming outdoor sprite sun silhouettes.
 * Own code; no Daggerfall assets or renderer code. Reuses swept geometry and
 * current sprite alpha; actor billboard tilt and frame presentation stay locked. */
(/* @function sunShadows.install163 — Inputs: browser namespace. Publishes bounded renderer; allocates resources only when an outdoor scene actually draws shadows. */function(root){
  "use strict";
  const states=new WeakMap(),COLS=4,ROWS=8,LIMIT=8;
  const vertex=`#version 300 es
  precision highp float;in vec2 aPosition;in vec2 aUV;in float aInverse;in float aFog;uniform vec2 uViewport;out vec2 vUV;out float vInverse;out float vFog;out vec2 vScreen;
  void main(){gl_Position=vec4(aPosition.x/uViewport.x*2.-1.,1.-aPosition.y/uViewport.y*2.,0.,1.);vUV=aUV;vInverse=aInverse;vFog=aFog;vScreen=aPosition/uViewport;}`;
  const fragment=`#version 300 es
  precision highp float;uniform sampler2D uImage;uniform sampler2D uDepth;uniform vec2 uViewport;uniform vec2 uDepthSize;uniform float uOpacity;uniform float uOrtho;in vec2 vUV;in float vInverse;in float vFog;in vec2 vScreen;out vec4 color;
  void main(){vec2 screen=vScreen;vec3 packed=texture(uDepth,screen).rgb;float inverse=(packed.r*65536.+packed.g*256.+packed.b)*255./16777215.*16.;if(inverse>vInverse+.002)discard;float alpha=texture(uImage,uOrtho>.5?vUV:vUV/max(vInverse,.000001)).a;color=vec4(0.,0.,0.,alpha*uOpacity*(1.-vFog));}`;
  /* @function sunShadows.receiver163 — Inputs: live scene, world sprite-plane source point, normalized sun ray and caster ID. Returns nearest terrain/static-geometry hit with world coordinates/receiver key, or null. Rays are at most 32 m; shared sweep uses a numerical skin and does not mutate combat. */
  function receiver163(game,from,direction,id){
    const end={x:from.x+direction.x*32,y:from.y+direction.y*32,z:from.z+direction.z*32};
    const hit=root.FrontierBallistics.sweep(game,from,end,0,id,true);
    if(!hit||hit.kind==="boundary")return null;
    const x=from.x+(end.x-from.x)*hit.t,y=from.y+(end.y-from.y)*hit.t;
    return {x,y,z:(hit.kind==="terrain"&&hit.t===0?root.FrontierTerrain.height(game.sourceWorld,x,y):from.z+(end.z-from.z)*hit.t)+.008,key:hit.kind+":"+hit.id};
  }
  /* @function sunShadows.receiverGrid163 — Inputs: scene, caster, current sprite frame/sheet, camera and validated sun. Returns fixed-size grid of nearest receiving-surface hits. Forty-five full rays per rebuild; frame UVs remain on original artwork. No textures, entities or source maps change. */
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
  /* @function sunShadows.createSlot163 — Inputs: Pixi namespace and reusable depth texture. Returns pooled alpha-shadow mesh and mutable vertex buffers. Fixed capacity is 45 vertices/192 indices; resources persist across maps and frames instead of being recreated per caster. */
  function createSlot163(P,depth){
    const count=(COLS+1)*(ROWS+1),positions=new Float32Array(count*2),uvs=new Float32Array(count*2),inverse=new Float32Array(count),fog=new Float32Array(count),indices=new Uint32Array(COLS*ROWS*6);
    const geometry=new P.MeshGeometry({positions,uvs,indices});
    const invBuffer=new P.Buffer({data:inverse,usage:P.BufferUsage.VERTEX|P.BufferUsage.COPY_DST}),fogBuffer=new P.Buffer({data:fog,usage:P.BufferUsage.VERTEX|P.BufferUsage.COPY_DST});
    geometry.addAttribute('aInverse',{buffer:invBuffer,format:'float32'});geometry.addAttribute('aFog',{buffer:fogBuffer,format:'float32'});
    const shader=P.Shader.from({gl:{vertex,fragment},resources:{uImage:P.Texture.WHITE.source,uDepth:depth,shadowUniforms:{uViewport:{value:new Float32Array(2),type:'vec2<f32>'},uDepthSize:{value:new Float32Array(2),type:'vec2<f32>'},uOpacity:{value:.24,type:'f32'},uOrtho:{value:0,type:'f32'}}}});
    return {mesh:new P.Mesh({geometry,shader}),geometry,shader,positions,uvs,inverse,fog,indices,invBuffer,fogBuffer};
  }
  /* @function sunShadows.draw163 — Inputs: active Pixi drawing adapter, live game, active camera, visible entity candidates and projection callback. Returns count of submitted outdoor shadow meshes. Rebuilds at most two 45-ray grids per frame, caches at most 8 nearest casters, updates GPU depth from existing CPU data without readback, and rejects triangles crossing disconnected receivers. Interiors and disabled sun skip all work. Terrain/static mesh/custom collision must match visible receivers; transparent/noncollision decoration receives none. */
  function draw163(ctx,game,cam,entities,project){
    const world=game.sourceWorld;if((world.interior&&!world.interior.outdoor)||!world.lighting?.enabled||!ctx.terrainDepth||!root.FrontierBallistics)return 0;
    const sun=root.FrontierLocalLighting.sun163(world.lighting.sun);if(!sun.enabled||!sun.opacity)return 0;
    const P=root.PIXI,d=ctx.terrainDepth;let state=states.get(ctx);
    if(!state){state={slots:[],cache:new Map()};states.set(ctx,state);}
    if(state.world!==world){state.cache.clear();state.world=world;}
    if(!state.depth||state.w!==d.w||state.h!==d.h){if(state.depth)state.depth.destroy();state.w=d.w;state.h=d.h;state.pixels=new Uint8Array(d.w*d.h*4);state.depth=new P.BufferImageSource({resource:state.pixels,width:d.w,height:d.h,format:'rgba8unorm',scaleMode:'nearest'});}
    for(let i=0;i<d.values.length;i++){const n=Math.min(16777215,Math.max(0,Math.round(d.values[i]/16*16777215))),j=i*4;state.pixels[j]=n>>16;state.pixels[j+1]=(n>>8)&255;state.pixels[j+2]=n&255;state.pixels[j+3]=255;}
    state.depth.update();
    const candidates=[];for(const e of entities)if(!e.dead&&(e.kind==='player'||e.spriteProfile)&&Math.hypot(e.x-game.player.x,e.y-game.player.y)<24)candidates.push(e);
    candidates.sort(/* @function sunShadows.nearest163 — Inputs: two eligible casters. Returns distance ordering so the bounded shadow budget prioritizes nearby gameplay actors; no source mutation. */function(a,b){return Math.hypot(a.x-game.player.x,a.y-game.player.y)-Math.hypot(b.x-game.player.x,b.y-game.player.y);});
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
          const valid=triangle.every(/* @function sunShadows.connected163 — Inputs: grid vertex index. Returns whether projected receiver exists and agrees with the first receiver, avoiding stretched shadows across disconnected surfaces. */function(index){return !!points[index]&&cached.grid[index]?.key===cached.grid[triangle[0]]?.key;});
          for(const index of triangle)slot.indices[at++]=valid?index:0;
        }
      }
      slot.geometry.getBuffer('aPosition').update();slot.geometry.getBuffer('aUV').update();slot.geometry.indexBuffer.update();slot.invBuffer.update();slot.fogBuffer.update();
      slot.shader.resources.uImage=image;slot.shader.resources.uDepth=state.depth;slot.shader.resources.shadowUniforms.uniforms.uViewport.set([game.viewWidth||640,480]);slot.shader.resources.shadowUniforms.uniforms.uDepthSize.set([d.w,d.h]);slot.shader.resources.shadowUniforms.uniforms.uOpacity=sun.opacity;slot.shader.resources.shadowUniforms.uniforms.uOrtho=cam.orthographic?1:0;
      ctx.flushStroke();ctx.app.stage.addChild(slot.mesh);used++;
    }
    for(const id of state.cache.keys())if(!retained.has(id))state.cache.delete(id);
    game.sunShadowDebug={casters:used,rebuilt,rays:rebuilt*(COLS+1)*(ROWS+1),receiverConforming:true,outdoors:true};return used;
  }
  root.FrontierSunShadows={receiver163,receiverGrid163,draw163};
})(window);
