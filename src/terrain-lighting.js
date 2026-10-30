
  // October 30, 2026: use the active Pixi projection for screen and filter targets; direct clip-space positions invert/resize custom meshes during filtering.
/* October 29: terrain now receives the same depth-range fog as sprites/models, after local illumination. Range is renderer-relative in isometric views and never applies to sky. */
/* October 13, 2026: batched outdoor radius illumination. Historical screen
 * positions, affine UV mapping and CPU shared depth remain unchanged. World
 * positions alone interpolate perspective-correctly for physical light radius.
 * Uses the bounded room-volume blocker approximation already used by models;
 * imported meshes/terrain do not cast shadows in this version. */
(/* @function terrainLighting.install — Inputs: global namespace. Returns nothing; publishes the batched lighting service. Allocates GPU resources only on an actual lit terrain draw. */ function (
  root,
) {
  "use strict";
  const vertex = `#version 300 es
 precision highp float;in vec2 aPosition;in vec2 aUV;in vec4 aLightWorld;uniform vec2 uViewport;uniform mat3 uProjectionMatrix;uniform mat3 uWorldTransformMatrix;uniform mat3 uTransformMatrix;out vec2 vUV;out vec4 vLightWorld;
 // UVs retain historical affine interpolation. XYZ/depth and inverse depth
 // reconstruct the actual world location independently of texture mapping.
 void main(){gl_Position=vec4((uProjectionMatrix*uWorldTransformMatrix*uTransformMatrix*vec3(aPosition,1.)).xy,0.,1.);vUV=aUV;vLightWorld=aLightWorld;}`;
  const fragment = `#version 300 es
 precision highp float;in vec2 vUV;in vec4 vLightWorld;uniform sampler2D uImage;uniform vec3 uTint;uniform vec4 uFogColor;uniform vec2 uFogRange;uniform int uLightCount;uniform int uBlockCount;uniform float uAmbient;uniform float uLightSteps;uniform vec4 uLights[8];uniform vec4 uLightColors[8];uniform vec4 uBlockXY[32];uniform vec4 uBlockZH[32];uniform vec4 uBlockRound[32];out vec4 color;
 // Open-segment room-volume shadow tests mirror geometry-gpu.js. Circular
 // rings/arcs approximate faceted boundaries; no texture or pixel readback.
  bool roundBlocked(vec3 a,vec3 b,vec4 xy,vec4 zh,vec4 shape){
  vec3 p=a-vec3(xy.xy,zh.x),d=b-a;float enter=.001,leave=.999;
  if(abs(d.z)<.000000001){if(p.z<=.0001||p.z>=zh.y-.0001)return false;}else{float t0=-p.z/d.z,t1=(zh.y-p.z)/d.z;enter=max(enter,min(t0,t1));leave=min(leave,max(t0,t1));}
  if(enter>=leave)return false;
  float cuts[8];cuts[0]=enter;cuts[1]=leave;int count=2;float A=dot(d.xy,d.xy),B=2.*dot(p.xy,d.xy);
  if(A>.000000000001)for(int i=0;i<2;i++){float r=i==0?shape.x:shape.y;if(r<=0.)continue;float delta=B*B-4.*A*(dot(p.xy,p.xy)-r*r);if(delta<=0.)continue;for(int j=0;j<2;j++){float t=(-B+(j==0?-1.:1.)*sqrt(delta))/(2.*A);if(t>enter&&t<leave){cuts[count]=t;count++;}}}
  if(shape.w<6.2831852)for(int i=0;i<2;i++){float angle=shape.z+float(i)*shape.w;vec2 n=vec2(-sin(angle),cos(angle));float den=dot(n,d.xy);if(abs(den)>.000000000001){float t=-dot(n,p.xy)/den;if(t>enter&&t<leave){cuts[count]=t;count++;}}}
  for(int i=1;i<8;i++){if(i>=count)break;float value=cuts[i];int at=i;for(int j=0;j<8;j++){if(at<=0||cuts[at-1]<=value)break;cuts[at]=cuts[at-1];at--;}cuts[at]=value;}
  for(int i=1;i<8;i++){if(i>=count)break;vec2 q=p.xy+d.xy*((cuts[i-1]+cuts[i])*.5);float r=length(q);if(r>=shape.x-.0001||shape.y>0.&&r<=shape.y+.0001)continue;float angle=mod(atan(q.y,q.x)-shape.z,6.28318530718);if(shape.w>=6.2831852||angle<shape.w)return true;}
  return false;
 }
 bool blocked(vec3 a,vec3 b,int index){vec4 xy=uBlockXY[index],zh=uBlockZH[index];if(uBlockRound[index].x>0.)return roundBlocked(a,b,xy,zh,uBlockRound[index]);vec2 da=a.xy-xy.xy,db=b.xy-xy.xy;vec3 p=vec3(zh.z*da.x+zh.w*da.y,-zh.w*da.x+zh.z*da.y,a.z-zh.x),q=vec3(zh.z*db.x+zh.w*db.y,-zh.w*db.x+zh.z*db.y,b.z-zh.x);vec3 lo=vec3(-xy.z,-xy.w,0.),hi=vec3(xy.z,xy.w,zh.y),d=q-p;float enter=.001,leave=.999;for(int k=0;k<3;k++){if(abs(d[k])<.000000001){if(p[k]<=lo[k]+.0001||p[k]>=hi[k]-.0001)return false;}else{float t0=(lo[k]-p[k])/d[k],t1=(hi[k]-p[k])/d[k];enter=max(enter,min(t0,t1));leave=min(leave,max(t0,t1));if(enter>=leave)return false;}}return enter<leave;}

 void main(){vec3 point=vLightWorld.xyz/max(.0000001,vLightWorld.w),shade=vec3(uAmbient);for(int i=0;i<8;i++){if(i>=uLightCount)break;float distance=length(point-uLights[i].xyz);if(distance>=uLights[i].w)continue;bool shadow=false;for(int j=0;j<32;j++){if(j>=uBlockCount)break;if(blocked(point,uLights[i].xyz,j)){shadow=true;break;}}if(!shadow)shade+=uLightColors[i].rgb*pow(1.-distance/uLights[i].w,uLightColors[i].w);}shade=min(shade,vec3(1.));if(uLightSteps>1.)shade=floor(shade*(uLightSteps-1.)+.5)/(uLightSteps-1.);color=texture(uImage,vUV);color.rgb*=uTint*shade;float fog=uFogColor.a*clamp((1./max(.0000001,vLightWorld.w)-uFogRange.x)/max(.0001,uFogRange.y-uFogRange.x),0.,1.);color.rgb=mix(color.rgb,uFogColor.rgb,fog);}`;
  /* @function terrainLighting.prepare — Inputs: Pixi namespace, reused terrain batch, shared texture, sorted near-clipped cells, bounded light snapshot, logical viewport width and historical tint. Returns a shared-geometry lit mesh with updated uniform/buffer data. World coordinates are metres, depths positive camera-forward metres. Creates one shader/attribute buffer at batch capacity, never one mesh per tile. Does not modify geometry positions, UVs, depth grids or source textures. Throws GPU/schema errors rather than silently dropping lighting. */
  function prepare(P, batch, texture, cells, snapshot, width, tint, fog) {
    let state = batch.lightState;
    if (!state) {
      const world = new Float32Array(batch.capacity * 4),
        buffer = new P.Buffer({
          data: world,
          usage: P.BufferUsage.VERTEX | P.BufferUsage.COPY_DST,
        });
      batch.mesh.geometry.addAttribute("aLightWorld", {
        buffer,
        format: "float32x4",
      });
      const uniforms = {
        uViewport: { value: new Float32Array([width, 480]), type: "vec2<f32>" },
        uTint: { value: new Float32Array(3), type: "vec3<f32>" },
        uFogColor: { value: new Float32Array(4), type: "vec4<f32>" },
        uFogRange: { value: new Float32Array([0,1]), type: "vec2<f32>" },
        uLightCount: { value: 0, type: "i32" },
        uBlockCount: { value: 0, type: "i32" },
        uAmbient: { value: 1, type: "f32" },
        uLightSteps: { value: 0, type: "f32" },
      };
      for (const [name, size] of [
        ["uLights", 8],
        ["uLightColors", 8],
        ["uBlockXY", 32],
        ["uBlockZH", 32],
        ["uBlockRound", 32],
      ])
        uniforms[name] = {
          value: new Float32Array(size * 4),
          type: "vec4<f32>",
          size,
        };
      const shader = P.Shader.from({
          gl: { vertex, fragment },
          resources: { uImage: texture.source, terrainUniforms: uniforms },
        }),
        mesh = new P.Mesh({ geometry: batch.mesh.geometry, shader });
      state = { world, buffer, shader, mesh };
      batch.lightState = state;
    }
    const uniforms = state.shader.resources.terrainUniforms.uniforms;
    const fogColor=parseInt((fog?.color||'#000000').slice(1),16);uniforms.uFogColor.set([((fogColor>>16)&255)/255,((fogColor>>8)&255)/255,(fogColor&255)/255,fog?.enabled?1:0]);uniforms.uFogRange.set([fog?.start||0,fog?.end||1]);
    uniforms.uViewport[0] = width;
    uniforms.uTint[0] = ((tint >> 16) & 255) / 255;
    uniforms.uTint[1] = ((tint >> 8) & 255) / 255;
    uniforms.uTint[2] = (tint & 255) / 255;
    uniforms.uLightCount = snapshot.lights.length;
    uniforms.uBlockCount = snapshot.blockers.length;
    uniforms.uAmbient = snapshot.ambient;
    uniforms.uLightSteps = snapshot.steps || 0;
    for (let i = 0; i < snapshot.lights.length; i++) {
      const light = snapshot.lights[i],
        at = i * 4;
      uniforms.uLights.set([light.x, light.y, light.z, light.radius], at);
      uniforms.uLightColors.set(
        [
          light.rgb[0] * light.intensity,
          light.rgb[1] * light.intensity,
          light.rgb[2] * light.intensity,
          light.falloff,
        ],
        at,
      );
    }
    for (let i = 0; i < snapshot.blockers.length; i++) {
      const block = snapshot.blockers[i],
        at = i * 4;
      uniforms.uBlockXY.set([block.x, block.y, block.w / 2, block.d / 2], at);
      uniforms.uBlockZH.set(
        [block.z, block.h, Math.cos(block.yaw), Math.sin(block.yaw)],
        at,
      );
      uniforms.uBlockRound.set(
        [
          block.radius || 0,
          block.innerRadius || 0,
          block.arcStart || 0,
          block.arcSweep ?? Math.PI * 2,
        ],
        at,
      );
    }
    let index = 0;
    for (const cell of cells)
      for (let i = 0; i < 3; i++) {
        const point = cell.world[i],
          inverse = 1 / cell.p[i].depth,
          at = index++ * 4;
        state.world[at] = point[0] * inverse;
        state.world[at + 1] = point[1] * inverse;
        state.world[at + 2] = point[2] * inverse;
        state.world[at + 3] = inverse;
      }
    state.buffer.data = state.world.subarray(0, index * 4);
    state.buffer.update();
    state.shader.resources.uImage = texture.source;
    state.mesh.alpha = 1;
    return state.mesh;
  }
  /* @function terrainLighting.retire — Inputs: terrain batch being replaced. Returns nothing; destroys only the lighting mesh/shader. Its shared geometry and attribute buffer are released once by the existing batch owner. No source-image ownership or GL readback. Safe for batches that never used lighting. */
  function retire(batch) {
    if (!batch?.lightState) return;
    batch.lightState.mesh.destroy();
    batch.lightState.shader.destroy();
    batch.lightState = null;
  }
  root.FrontierTerrainLighting = { prepare, retire };
})(typeof window === "undefined" ? globalThis : window);
