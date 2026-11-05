/* November 1, 2026: real tangent-space normal lighting. Albedo is never baked or altered. Normal textures are shared, frame-aligned and sampled in the existing world draw. UI/sky calls have no physical surface descriptor and cannot acquire this shader. */
(/* @function liveNormals.install1618 — Inputs: browser namespace. Publishes shader helpers and a pooled billboard material owner. No GPU allocations until a real surface is drawn; original sprite projection, masks and shadow owners stay authoritative. */function(root){

  'use strict';

  const authoredCache=new WeakMap(),normalSources=new WeakMap(),authoredEntries=new Map();
  let authoredBytes=0;
  const authoredLimit=64*1024*1024;

  const tangentGLSL=`
  uniform sampler2D uNormal;uniform float uNormalOn;uniform float uNormalStrength;uniform vec4 uSun;
  vec3 mappedNormal(vec3 p,vec2 uv){
    vec3 dx=dFdx(p),dy=dFdy(p);vec2 ux=dFdx(uv),uy=dFdy(uv);
    vec3 base=normalize(cross(dx,dy));
    // Derivative normal faces the viewer; correct world floors through the supplied orientation.
    float det=ux.x*uy.y-ux.y*uy.x;
    if(abs(det)<.00000001)return base;
    vec3 t=normalize((dx*uy.y-dy*ux.y)/det),b=normalize((-dx*uy.x+dy*ux.x)/det);
    vec3 n=texture(uNormal,uv).rgb*2.-1.;n.xy*=uNormalStrength;
    return normalize(t*n.x-b*n.y+base*n.z);
  }
  `;

  /* @function liveNormals.authored1618 — Inputs: original sprite Image and validated normal binding. Starts one decode per binding identity, retaining the original albedo and the existing profile frame layout. Failure leaves automatic/original art intact; no generation or updates occur per frame. */
  function authored(source,binding){

    let entry=authoredCache.get(source);
    if(entry?.binding===binding){
      entry.last=performance.now();
      return;
    }

    if(entry?.normal){
      authoredBytes-=entry.bytes;
      authoredEntries.delete(source);
      releaseNormal(entry.normal);
      if(source.frontierNormalImage===entry.normal)delete source.frontierNormalImage;
      delete source.frontierNormalStrength;
    }

    if(!binding){
      if(entry?.normal===source.frontierNormalImage){
        delete source.frontierNormalImage;
        delete source.frontierNormalStrength;
      }
      authoredCache.delete(source);
      return;
    }

    entry={
      binding,last:performance.now()
    };
    authoredCache.set(source,entry);

    root.FrontierAutomaticNormals.read(binding.png).then(/* @function liveNormals.authoredReady1618 — Inputs: decoded normal Image. Publishes only if binding still owns this source; avoids a stale asynchronous Apply after Undo. No source pixels changed. */function(normal){
      if(authoredCache.get(source)===entry){

        const size=normal.naturalWidth*normal.naturalHeight*4;

        for(const [key,item]of authoredEntries){
          if(authoredBytes+size<=authoredLimit)break;
          if(item.last+2000>performance.now())continue;
          releaseNormal(item.normal);
          if(key.frontierNormalImage===item.normal){delete key.frontierNormalImage;delete key.frontierNormalStrength;}
          authoredCache.delete(key);
          authoredEntries.delete(key);
          authoredBytes-=item.bytes;
        }

        if(authoredBytes+size>authoredLimit){
          source.frontierNormalError='Custom normal cache is full; original/automatic material retained.';
          return;
        }

        entry.bytes=size;
        authoredBytes+=size;
        authoredEntries.set(source,entry);
        entry.normal=normal;
        delete source.frontierNormalError;
        source.frontierNormalImage=normal;
        source.frontierNormalStrength=binding.light?.strength??1;
      }
    },/* @function liveNormals.authoredFailure1618 — Inputs: decode error. Keeps original pixels and exposes a bounded diagnostic on source for the workbench. */function(error){
      source.frontierNormalError=error.message;
    });

  }

  /* @function liveNormals.normalSource1618 — Inputs: Pixi namespace and decoded normal Image. Returns shared linear-filtered GPU source; identity reuse prevents per-frame uploads. Original albedo is not owned here. */
  function normalSource(P,image,repeat=false){
    let owner=normalSources.get(image);
    if(!owner){
      owner={
      };
      normalSources.set(image,owner);
    }
    const key=repeat?'repeat':'clamp';
    if(!owner[key])owner[key]=new P.ImageSource({
      resource:image,scaleMode:'linear',addressMode:repeat?'repeat':'clamp-to-edge'
    });
    return owner[key];
  }

  /* @function liveNormals.uniforms1618 — Inputs: none. Returns independent typed uniform storage for one pooled sprite mesh, bounded by eight active lights. Reused after creation; no source image data is retained. */
  function uniforms(){
    return {
      uSun:{
        value:new Float32Array(4),type:'vec4<f32>'
      },uCenter:{
        value:new Float32Array(3),type:'vec3<f32>'
      },uRight:{
        value:new Float32Array(3),type:'vec3<f32>'
      },uUp:{
        value:new Float32Array(3),type:'vec3<f32>'
      },uFacing:{
        value:new Float32Array(3),type:'vec3<f32>'
      },uNormalPixel:{
        value:new Float32Array(2),type:'vec2<f32>'
      },uSize:{
        value:new Float32Array(2),type:'vec2<f32>'
      },uFrame:{
        value:new Float32Array(4),type:'vec4<f32>'
      },uAmbient:{
        value:1,type:'f32'
      },uCount:{
        value:0,type:'i32'
      },uLights:{
        value:new Float32Array(32),type:'vec4<f32>',size:8
      },uColors:{
        value:new Float32Array(32),type:'vec4<f32>',size:8
      },uOpacity:{
        value:1,type:'f32'
      },uStrength:{
        value:1,type:'f32'
      }
    };
  }

  const vertex=`#version 300 es
  precision highp float;in vec2 aPosition;in vec2 aUV;uniform mat3 uProjectionMatrix;uniform mat3 uWorldTransformMatrix;uniform mat3 uTransformMatrix;out vec2 vUV;
  void main(){gl_Position=vec4((uProjectionMatrix*uWorldTransformMatrix*uTransformMatrix*vec3(aPosition,1.)).xy,0.,1.);vUV=aUV;}`;

  const fragment=`#version 300 es
  precision highp float;in vec2 vUV;out vec4 color;uniform sampler2D uImage;uniform sampler2D uNormal;uniform vec4 uSun;uniform vec3 uCenter,uRight,uUp,uFacing;uniform vec2 uSize,uNormalPixel;uniform vec4 uFrame;uniform float uAmbient,uOpacity,uStrength;uniform int uCount;uniform vec4 uLights[8],uColors[8];
  void main(){vec2 f=(vUV-uFrame.xy)/uFrame.zw;vec3 point=uCenter+uRight*((f.x-.5)*uSize.x)+uUp*((.5-f.y)*uSize.y);
  vec2 normalUV=clamp(vUV,uFrame.xy+uNormalPixel*.5,uFrame.xy+uFrame.zw-uNormalPixel*.5);vec3 n=texture(uNormal,normalUV).rgb*2.-1.;n.xy*=uStrength;n=normalize(uRight*n.x+uUp*n.y+uFacing*n.z);vec3 shade=vec3(uAmbient+uSun.w*max(0.,dot(n,uSun.xyz)));
  for(int i=0;i<8;i++){if(i>=uCount)break;vec3 delta=uLights[i].xyz-point;float d=length(delta);if(d>=uLights[i].w)continue;float diffuse=max(0.,dot(n,delta/max(.0001,d)));shade+=uColors[i].rgb*pow(1.-d/uLights[i].w,uColors[i].w)*diffuse;}
  vec4 c=texture(uImage,vUV);color=vec4(c.rgb*min(shade,vec3(1.)),c.a)*uOpacity;}`;

  /* @function liveNormals.mesh1618 — Inputs: Pixi adapter, pool index, albedo/normal sources and crop pixels. Returns a reused four-vertex mesh. Frame UVs map both textures identically despite bounded normal resolution. It changes only the material, not the locked camera-facing rectangle or painter/mask ownership. */
  function mesh(ctx,index,image,texture,sx,sy,sw,sh){

    const P=root.PIXI;
    ctx.liveNormalMeshes||=[];
    let mesh=ctx.liveNormalMeshes[index];

    if(!mesh){
      const geometry=new P.MeshGeometry({
        positions:new Float32Array(8),uvs:new Float32Array(8),indices:new Uint16Array([0,1,2,0,2,3])
      });
      const shader=P.Shader.from({
        gl:{
          vertex,fragment
        },resources:{
          uImage:texture.source,uNormal:normalSource(P,image.frontierNormalImage),liveUniforms:uniforms()
        }
      });
      mesh=new P.Mesh({
        geometry,shader
      });
      ctx.liveNormalMeshes[index]=mesh;
    }

    const pos=mesh.geometry.getBuffer('aPosition'),uv=mesh.geometry.getBuffer('aUV');
    pos.data.set([0,0,sw,0,sw,sh,0,sh]);
    const w=image.naturalWidth||image.width,h=image.naturalHeight||image.height;
    uv.data.set([sx/w,sy/h,(sx+sw)/w,sy/h,(sx+sw)/w,(sy+sh)/h,sx/w,(sy+sh)/h]);
    pos.update();
    uv.update();

    mesh.shader.resources.uImage=texture.source;
    mesh.shader.resources.uNormal=normalSource(P,image.frontierNormalImage);

    const u=mesh.shader.resources.liveUniforms.uniforms,s=ctx.liveNormalSurface,frame=ctx.localLightFrame;
    u.uCenter.set(s.center);
    u.uRight.set(s.right);
    u.uUp.set(s.up);
    u.uFacing.set(s.facing);
    u.uNormalPixel.set([1/image.frontierNormalImage.naturalWidth,1/image.frontierNormalImage.naturalHeight]);
    u.uSize.set(s.size);
    u.uFrame.set([sx/w,sy/h,sw/w,sh/h]);
    u.uSun.set([...(frame?.sun?.direction||[0,0,1]),frame?.sun?.intensity||0]);
    u.uAmbient=frame?.ambient??1;
    u.uCount=0;
    u.uOpacity=ctx.globalAlpha;
    u.uStrength=image.frontierNormalStrength??1;

    if(frame)for(const light of frame.lights){
      // Only the passive owner light is excluded; projectile and shared-profile actors remain lit.
      if(s.ownerId && light.excludedOwnerId===s.ownerId)continue;

      // Blockers use the same established room-volume test at the actor center; surface detail stays per fragment.
      let blocked=false;
      for(const box of frame.blockers)if(root.FrontierLocalLighting.obstructed(s.center,light,box)){
        blocked=true;
        break;
      }
      if(blocked)continue;

      const at=u.uCount++*4;
      u.uLights.set([light.x,light.y,light.z,light.radius],at);
      u.uColors.set([light.rgb[0]*light.intensity,light.rgb[1]*light.intensity,light.rgb[2]*light.intensity,light.falloff],at);

    }

    return mesh;

  }

  /* @function liveNormals.releaseNormal1618 — Inputs: cold normal image. Releases only its shared GPU copy during automatic-cache eviction; albedo ownership and active sprite meshes are untouched. A later draw may recreate the texture. */
  function releaseNormal(image){
    const owner=normalSources.get(image);
    if(owner){
      for(const source of Object.values(owner))source.destroy();
      normalSources.delete(image);
    }
  }

  /* @function liveNormals.basis1618 — Inputs: world/UV triangle and camera. Returns normalized tangent/up/view-facing geometric basis, or null for degenerate UVs. Used only by the retained CPU MASK/BLEND fallback; opaque geometry uses shader derivatives. */
  function basis(vertices,cam){

    const a=vertices[0],b=vertices[1],c=vertices[2],p=b.point.map(/* @function liveNormals.edgeB1618 — Inputs: coordinate and axis. Returns world edge component, no mutation. */function(v,i){
      return v-a.point[i];
    }),q=c.point.map(/* @function liveNormals.edgeC1618 — Inputs: coordinate and axis. Returns second world edge component, no mutation. */function(v,i){
      return v-a.point[i];
    });

    const u=b.uv[0]-a.uv[0],v=b.uv[1]-a.uv[1],x=c.uv[0]-a.uv[0],y=c.uv[1]-a.uv[1],d=u*y-x*v;
    if(Math.abs(d)<1e-10)return null;

    const t=[(p[0]*y-q[0]*v)/d,(p[1]*y-q[1]*v)/d,(p[2]*y-q[2]*v)/d],up=[(p[0]*x-q[0]*u)/d,(p[1]*x-q[1]*u)/d,(p[2]*x-q[2]*u)/d],n=[p[1]*q[2]-p[2]*q[1],p[2]*q[0]-p[0]*q[2],p[0]*q[1]-p[1]*q[0]];

    const facing=n[0]*(cam.x-a.point[0])+n[1]*(cam.y-a.point[1])+n[2]*(cam.z-a.point[2]);
    if(facing<0)for(let i=0;i<3;i++)n[i]*=-1;

    for(const axis of [t,up,n]){
      const len=Math.hypot(...axis)||1;
      for(let i=0;i<3;i++)axis[i]/=len;
    }
    return [t,up,n];

  }

  /* @function liveNormals.sample1618 — Inputs: light snapshot, world XYZ, decoded tangent normal and basis. Writes RGB to caller scratch. Uses real radius, color, falloff and blockers, with no static sample cache that could retain old light directions. CPU transparent fallback only; no image allocation per pixel. */
  function sample(frame,point,normal,basis,out){

    const n=[0,0,0];
    for(let i=0;i<3;i++)n[i]=basis[0][i]*normal[0]+basis[1][i]*normal[1]+basis[2][i]*normal[2];
    const length=Math.hypot(...n)||1;
    for(let i=0;i<3;i++){
      n[i]/=length;
      out[i]=frame.ambient;
    }

    if(frame.sun){
      const amount=frame.sun.intensity*Math.max(0,n[0]*frame.sun.direction[0]+n[1]*frame.sun.direction[1]+n[2]*frame.sun.direction[2]);
      for(let i=0;i<3;i++)out[i]+=amount;
    }

    for(const light of frame.lights){
      const dx=light.x-point[0],dy=light.y-point[1],dz=light.z-point[2],d=Math.hypot(dx,dy,dz);
      if(d>=light.radius)continue;
      let blocked=false;
      for(const box of frame.blockers)if(root.FrontierLocalLighting.obstructed(point,light,box)){
        blocked=true;
        break;
      }
      if(blocked)continue;
      const diffuse=Math.max(0,(n[0]*dx+n[1]*dy+n[2]*dz)/Math.max(.0001,d)),amount=light.intensity*(1-d/light.radius)**light.falloff*diffuse;
      for(let i=0;i<3;i++)out[i]+=light.rgb[i]*amount;
    }

    for(let i=0;i<3;i++){
      out[i]=Math.min(1,out[i]);
      if(frame.steps>1)out[i]=Math.round(out[i]*(frame.steps-1))/(frame.steps-1);
    }
    return out;

  }

  root.FrontierLiveNormals={
    authored,normalSource,tangentGLSL,mesh,releaseNormal,basis,sample
  };

})(window);


