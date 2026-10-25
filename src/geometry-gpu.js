/* October 13: OPAQUE room/model alpha cutouts now use this backend, with
 * alpha-aware CPU shared depth. The retained October 12 blanket hole-fallback
 * note below is superseded for those surfaces; MASK/BLEND limitations remain
 * explicitly owned by each integration path. */
// October 12, 2026 — current integration supersedes prototype-only notes retained below.
// Perspective opaque room color and isolated OPAQUE/MASK door cinematics use this backend;
// CPU depth still governs gameplay sprite/model occlusion. BLEND doors, room alpha holes,
// orthographic views and unsupported contexts retain CPU fallback. Texture sampling now
// honors glTF wrapS/wrapT and the selected Crisp/Smooth mode at full physical density.
/* October 12, 2026: experimental GPU geometry backend. Not selected by the live renderer until shared terrain/sprite depth interoperability is verified. Receives already-clipped logical screen triangles; native depth buffer resolves overlapping faces. No external engine code. */
(/* @function geometry-gpu.install1523 â€” Inputs: browser namespace. Installs experimental factory only; creates no GPU resources until requested. */ function (
  root,
) {
  "use strict";
  /* @function geometry-gpu.create1523 â€” Inputs: physical width/height pixels and logical viewport dimensions. Returns reusable canvas/draw/destroy API. Throws if WebGL2 or shader setup fails. Owns context, program, buffers and shared image textures until destroy; callers must not use after disposal. */
  function create(width, height, logicalWidth = 640, logicalHeight = 480) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) throw Error("WebGL2 geometry backend unavailable");
    /* @function geometry-gpu.compile1523 â€” Inputs: GL shader type and GLSL source. Returns compiled shader or throws compiler diagnostic after freeing failed object. Context-owned; no gameplay state. */
    function compile(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw Error(message);
      }
      return shader;
    }
    const vertex = compile(
        gl.VERTEX_SHADER,
        `#version 300 es
 precision highp float;in vec3 aPosition;in vec2 aUV;in vec3 aWorld;uniform vec2 uViewport;out vec2 vUV;out float vDepth;out vec3 vWorld;
 void main(){float d=aPosition.z;vec2 xy=vec2(aPosition.x/uViewport.x*2.-1.,1.-aPosition.y/uViewport.y*2.);float near=.13,far=10000.;gl_Position=vec4(xy*d,((far+near)/(far-near))*d-2.*far*near/(far-near),d);vUV=aUV;vDepth=d;vWorld=aWorld;}`,
      ),
      fragment = compile(
        gl.FRAGMENT_SHADER,
        `#version 300 es
 precision highp float;in vec2 vUV;in float vDepth;in vec3 vWorld;uniform sampler2D uImage;uniform sampler2D uOcclusionDepth;uniform float uOcclusionOn;uniform vec2 uOcclusionSize;uniform vec2 uPhysicalSize;uniform vec4 uFogColor;uniform vec2 uFogRange;uniform vec4 uFactor;uniform float uCutoff;uniform float uOpaque;out vec4 color;
 uniform int uLightCount;uniform int uBlockCount;uniform float uAmbient;uniform float uLightSteps;uniform vec4 uLights[8];uniform vec4 uLightColors[8];uniform vec4 uBlockXY[32];uniform vec4 uBlockZH[32];uniform vec4 uBlockRound[32];
 // Round shadow volumes use circular rings/arcs rather than their enclosing box.
 // Inputs: world ray endpoints, blocker center/base/height and outer/inner radii,
 // start/sweep radians. Result: open-segment solid crossing. Circular boundaries
 // intentionally approximate faceted mesh edges; CPU uses the same algorithm.
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
 void main(){
 // Shared prior-world inverse depth is uploaded without GPU readback. Allow a
 // conservative subcell gradient tolerance at structural contact boundaries.
 // Models depth-test against one another in this private context, so this input
 // excludes current models and cannot cause model self-masking.
 if(uOcclusionOn>.5){ivec2 cell=ivec2(clamp(floor(vec2(gl_FragCoord.x/uPhysicalSize.x,1.-gl_FragCoord.y/uPhysicalSize.y)*uOcclusionSize),vec2(0.),uOcclusionSize-vec2(1.)));float prior=texelFetch(uOcclusionDepth,cell,0).r,inverseDepth=1./vDepth,tolerance=max(.00001,fwidth(inverseDepth)*max(uPhysicalSize.x/uOcclusionSize.x,uPhysicalSize.y/uOcclusionSize.y)*.6);if(inverseDepth<prior-tolerance)discard;}
 color=texture(uImage,vUV)*uFactor;if(color.a<uCutoff)discard;if(uOpaque>0.5)color.a=1.;if(uLightCount>=0){vec3 shade=vec3(uAmbient);for(int i=0;i<8;i++){if(i>=uLightCount)break;float distance=length(vWorld-uLights[i].xyz);if(distance>=uLights[i].w)continue;bool shadow=false;for(int j=0;j<32;j++){if(j>=uBlockCount)break;if(blocked(vWorld,uLights[i].xyz,j)){shadow=true;break;}}if(!shadow)shade+=uLightColors[i].rgb*pow(1.-distance/uLights[i].w,uLightColors[i].w);}shade=min(shade,vec3(1.));if(uLightSteps>1.)shade=floor(shade*(uLightSteps-1.)+.5)/(uLightSteps-1.);color.rgb*=shade;}if(uFogColor.a>.5){float amount=clamp((vDepth-uFogRange.x)/max(.0001,uFogRange.y-uFogRange.x),0.,1.);color.rgb=mix(color.rgb,uFogColor.rgb,amount);}}`,
      ),
      program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw Error(gl.getProgramInfoLog(program));
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    gl.useProgram(program);
    const vao = gl.createVertexArray(),
      buffer = gl.createBuffer(),
      vertices = new Float32Array(24),
      textures = new Map();
    let textureBytes1523 = 0;
    const maxTextures1523 = 64,
      maxTextureBytes1523 = 256 * 1024 * 1024;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices.byteLength, gl.DYNAMIC_DRAW);
    const position = gl.getAttribLocation(program, "aPosition"),
      uv = gl.getAttribLocation(program, "aUV");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 32, 0);
    gl.enableVertexAttribArray(uv);
    gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 32, 12);
    const worldPosition = gl.getAttribLocation(program, "aWorld");
    gl.enableVertexAttribArray(worldPosition);
    gl.vertexAttribPointer(worldPosition, 3, gl.FLOAT, false, 32, 20);
    let warmFence = null;
    const viewport = gl.getUniformLocation(program, "uViewport"),
      factor = gl.getUniformLocation(program, "uFactor"),
      cutoff = gl.getUniformLocation(program, "uCutoff"),
      opaque = gl.getUniformLocation(program, "uOpaque");
    gl.uniform2f(viewport, logicalWidth, logicalHeight);
    gl.uniform1i(gl.getUniformLocation(program, "uImage"), 0);
    gl.uniform1i(gl.getUniformLocation(program, "uOcclusionDepth"), 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    // October 12, 2026: opaque gameplay model color has a separate context.
    // Keep prior-world occlusion upload bounded to one reused floating-point texture.
    const occlusionTexture = gl.createTexture(),
      occlusionUniforms = {
        enabled: gl.getUniformLocation(program, "uOcclusionOn"),
        size: gl.getUniformLocation(program, "uOcclusionSize"),
        physical: gl.getUniformLocation(program, "uPhysicalSize"),
        fogColor: gl.getUniformLocation(program, "uFogColor"),
        fogRange: gl.getUniformLocation(program, "uFogRange"),
      };
    let occlusionWidth = 0,
      occlusionHeight = 0;
    // October 12, 2026: uniform lookup belongs to context creation, not the render loop.
    const lightUniforms = {
      count: gl.getUniformLocation(program, "uLightCount"),
      blockCount: gl.getUniformLocation(program, "uBlockCount"),
      ambient: gl.getUniformLocation(program, "uAmbient"),
      steps: gl.getUniformLocation(program, "uLightSteps"),
      positions: [],
      colors: [],
      xy: [],
      zh: [],
      round: [],
    };
    for (let i = 0; i < 8; i++) {
      lightUniforms.positions.push(
        gl.getUniformLocation(program, "uLights[" + i + "]"),
      );
      lightUniforms.colors.push(
        gl.getUniformLocation(program, "uLightColors[" + i + "]"),
      );
    }
    for (let i = 0; i < 32; i++) {
      lightUniforms.xy.push(
        gl.getUniformLocation(program, "uBlockXY[" + i + "]"),
      );
      lightUniforms.zh.push(
        gl.getUniformLocation(program, "uBlockZH[" + i + "]"),
      );
      lightUniforms.round.push(
        gl.getUniformLocation(program, "uBlockRound[" + i + "]"),
      );
    }
    /* @function geometry-gpu.texture1523 â€” Inputs: shared decoded RGBA record and Smooth flag. Returns cached context texture; uploads image once and updates filtering without changing source pixels. Repeat wrapping matches initial room material contract; imported sampler modes require integration before live enablement. */
    function texture(image, smooth, sampler = {}) {
      let tex = textures.get(image);
      if (tex) {
        textures.delete(image);
        textures.set(image, tex);
      }
      if (!tex) {
        /* October 12: a private GPU context survives many cell/project changes. Bound retained uploads by LRU rather than keeping every obsolete decoded image forever. Eviction releases only GPU copies; requested source pixels remain full resolution and upload again if reused. A single image larger than the byte budget is retained alone, never silently downscaled. */ const bytes =
          image.width * image.height * 4;
        while (
          textures.size &&
          (textures.size >= maxTextures1523 ||
            textureBytes1523 + bytes > maxTextureBytes1523)
        ) {
          const retired = textures.keys().next().value;
          gl.deleteTexture(textures.get(retired));
          textures.delete(retired);
          textureBytes1523 -= retired.width * retired.height * 4;
        }
        textureBytes1523 += bytes;
        tex = gl.createTexture();
        textures.set(image, tex);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          image.width,
          image.height,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image.data,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      }
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S,
        sampler.wrapS || gl.REPEAT,
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T,
        sampler.wrapT || gl.REPEAT,
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        smooth ? gl.LINEAR : gl.NEAREST,
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MAG_FILTER,
        smooth ? gl.LINEAR : gl.NEAREST,
      );
      return tex;
    }
    /* @function geometry-gpu.draw1523 â€” Inputs: triangle records with three projected X/Y/depth/UV vertices, decoded image, factor and optional alpha cutoff; Smooth flag. Clears and submits at physical resolution, reusing one vertex buffer. Returns texture/triangle resource counts; no GPU readback. Caller must supply near-clipped positive depths. */
    /* @function geometryGpu.drawLighting1524 - Inputs: projected world/UV triangles, filtering choice and optional bounded lighting snapshot. Returns: resource counts. Interpolates actual world positions for radius illumination and room-volume blocking; cinematic draws without a snapshot retain their original colors. No GPU readback or source image mutation. */
    function draw(
      triangles,
      smooth = false,
      lighting = null,
      occlusion = null,
    ) {
      // Optional occlusion is a read-only snapshot of the CPU depth before model
      // submission. One upload replaces millions of CPU color/filter operations.
      gl.useProgram(program);
      gl.uniform1f(occlusionUniforms.enabled, occlusion ? 1 : 0);
      gl.uniform2f(occlusionUniforms.physical, width, height);
      if (occlusion) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, occlusionTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (occlusionWidth !== occlusion.w || occlusionHeight !== occlusion.h) {
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.R32F,
            occlusion.w,
            occlusion.h,
            0,
            gl.RED,
            gl.FLOAT,
            occlusion.values,
          );
          occlusionWidth = occlusion.w;
          occlusionHeight = occlusion.h;
        } else
          gl.texSubImage2D(
            gl.TEXTURE_2D,
            0,
            0,
            0,
            occlusion.w,
            occlusion.h,
            gl.RED,
            gl.FLOAT,
            occlusion.values,
          );
        gl.uniform2f(occlusionUniforms.size, occlusion.w, occlusion.h);
      }
      gl.activeTexture(gl.TEXTURE0);
      gl.useProgram(program);
      gl.uniform1i(lightUniforms.count, lighting ? lighting.lights.length : -1);
      gl.uniform1i(
        lightUniforms.blockCount,
        lighting ? lighting.blockers.length : 0,
      );
      gl.uniform1f(lightUniforms.ambient, lighting?.ambient ?? 1);
      gl.uniform1f(lightUniforms.steps, lighting?.steps || 0);
      if (lighting) {
        for (let i = 0; i < lighting.lights.length; i++) {
          const e = lighting.lights[i];
          gl.uniform4f(lightUniforms.positions[i], e.x, e.y, e.z, e.radius);
          gl.uniform4f(
            lightUniforms.colors[i],
            e.rgb[0] * e.intensity,
            e.rgb[1] * e.intensity,
            e.rgb[2] * e.intensity,
            e.falloff,
          );
        }
        for (let i = 0; i < lighting.blockers.length; i++) {
          const e = lighting.blockers[i];
          gl.uniform4f(lightUniforms.xy[i], e.x, e.y, e.w / 2, e.d / 2);
          gl.uniform4f(
            lightUniforms.zh[i],
            e.z,
            e.h,
            Math.cos(e.yaw),
            Math.sin(e.yaw),
          );
          gl.uniform4f(
            lightUniforms.round[i],
            e.radius || 0,
            e.innerRadius || 0,
            e.arcStart || 0,
            e.arcSweep ?? Math.PI * 2,
          );
        }
      }
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clearDepth(1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      for (const triangle of triangles) {
        const fog = triangle.fog;
        if (fog?.enabled) {
          const n = parseInt(fog.color.slice(1), 16);
          gl.uniform4f(
            occlusionUniforms.fogColor,
            ((n >> 16) & 255) / 255,
            ((n >> 8) & 255) / 255,
            (n & 255) / 255,
            1,
          );
          gl.uniform2f(occlusionUniforms.fogRange, fog.start, fog.end);
        } else gl.uniform4f(occlusionUniforms.fogColor, 0, 0, 0, 0);
        texture(triangle.image, smooth, triangle.sampler);
        gl.uniform4fv(factor, triangle.factor || [1, 1, 1, 1]);
        gl.uniform1f(cutoff, triangle.cutoff ?? 0.001);
        gl.uniform1f(opaque, triangle.opaque ? 1 : 0);
        for (let i = 0; i < 3; i++) {
          const v = triangle.vertices[i],
            o = i * 8;
          vertices[o] = v.x;
          vertices[o + 1] = v.y;
          vertices[o + 2] = v.depth;
          vertices[o + 3] = v.u;
          vertices[o + 4] = v.v;
          vertices[o + 5] = v.world?.[0] || 0;
          vertices[o + 6] = v.world?.[1] || 0;
          vertices[o + 7] = v.world?.[2] || 0;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      return { triangles: triangles.length, textures: textures.size };
    }
    /* @function geometry-gpu.destroy1523 â€” Inputs: none. Releases every owned image texture, buffer, VAO and program, then shrinks canvas. Returns nothing; idempotent GL deletion but callers must stop submission before disposal. */
    function destroy() {
      if (warmFence) {
        gl.deleteSync(warmFence);
        warmFence = null;
      }
      for (const tex of textures.values()) gl.deleteTexture(tex);
      textures.clear();
      textureBytes1523 = 0;
      gl.deleteTexture(occlusionTexture);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      canvas.width = canvas.height = 1;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
    /* @function geometry-gpu.diagnostics1523 — Inputs: none. Returns owned texture count and decoded pixel-byte estimate plus framebuffer dimensions. Diagnostic only; does not query GPU synchronization or allocate pixel buffers. Estimate excludes driver overhead, depth attachments and compressed source files. */
    // October 12, 2026: keep the historical source-image estimate separate from
    // the reused R32F prior-world depth allocation. Its four bytes per texel remain
    // owned after a draw without occlusion; toggling the effect does not release it.
    /* @function geometry-gpu.diagnostics1524 — Inputs: none. Returns source-image bytes, retained R32F occlusion bytes, their total and cache limits/dimensions. Read-only arithmetic; no GPU synchronization or allocation. Estimates exclude framebuffer/depth attachments and driver overhead. Image cache limits apply to source-image bytes, not the separate depth upload. */
    function diagnostics() {
      let textureBytes = 0;
      for (const image of textures.keys())
        textureBytes += image.width * image.height * 4;
      const occlusionBytes = occlusionWidth * occlusionHeight * 4;
      return {
        textures: textures.size,
        textureBytes,
        occlusionBytes,
        ownedTextureBytes: textureBytes + occlusionBytes,
        maxTextures: maxTextures1523,
        maxTextureBytes: maxTextureBytes1523,
        width: canvas.width,
        height: canvas.height,
      };
    }
    /* @function geometry-gpu.beginWarmup1523 — Inputs: none. Places a GPU completion fence after submitted setup/drawing and flushes queued commands without waiting. Replaces/deletes any previous fence. Used only while a transition cover is visible; no simulation effects. */
    function beginWarmup() {
      if (warmFence) gl.deleteSync(warmFence);
      warmFence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!warmFence) throw Error("GPU warmup fence unavailable");
      gl.flush();
    }
    /* @function geometry-gpu.warmupReady1523 — Inputs: none. Polls the owned fence with zero timeout; returns false while GPU work remains queued, true after cleanup when complete. Throws on failed/context-lost wait so transition cleanup can release input. Never blocks with finish or synchronous readback. */
    function warmupReady() {
      if (!warmFence) return true;
      const status = gl.clientWaitSync(warmFence, 0, 0);
      if (status === gl.TIMEOUT_EXPIRED) return false;
      gl.deleteSync(warmFence);
      warmFence = null;
      if (status === gl.WAIT_FAILED) throw Error("GPU warmup failed");
      return true;
    }
    return { canvas, gl, draw, destroy, diagnostics, beginWarmup, warmupReady };
  }
  root.FrontierGeometryGPU = { create };
})(window);
