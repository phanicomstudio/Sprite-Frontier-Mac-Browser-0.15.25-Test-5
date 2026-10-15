/* October 13, 2026: image panoramas retain the supplied source pixels. Optional
 * dual-sample wrapping makes the material continuous at both horizontal seams;
 * this is renderer sampling, not a claim that the original image is seamless.
 * Sky is unlit, has no physical collision/depth and follows camera rotation. */
(/* @function skyPanorama.install — Inputs: browser namespace. Returns nothing; publishes lazy loading and a bounded per-renderer GPU panorama service. Original PNG assets are never rewritten. */ function (
  root,
) {
  "use strict";
  const catalog = [1, 2, 3, 4].map(
    /* @function skyPanorama.catalogRecord — Inputs: supplied sky number. Returns fixed trusted asset identity/name/path. No loading or mutation. */ function (
      number,
    ) {
      return {
        id: "sky-" + number,
        name: "Supplied sky " + number,
        url: "img/skyboxes/SkyBox_" + number + ".png",
      };
    },
  );
  const images = new Map(),
    states = new WeakMap();
  const vertex = `#version 300 es
  precision highp float;in vec2 aPosition;out vec2 vScreen;
  void main(){vScreen=aPosition;gl_Position=vec4(aPosition.x*2.-1.,1.-aPosition.y*2.,0.,1.);}`;
  const fragment = `#version 300 es
  precision highp float;in vec2 vScreen;out vec4 color;uniform sampler2D uImage;
  uniform vec4 uCamera;uniform vec4 uView;uniform float uBlend;
  void main(){
    float side=(vScreen.x*uView.x-uView.z)/360.;
    float up=(uView.w-vScreen.y*480.)/360.;
    float forward=cos(uCamera.y)-up*sin(uCamera.y);
    vec3 direction=normalize(vec3(forward*sin(uCamera.x)+side*cos(uCamera.x),forward*cos(uCamera.x)-side*sin(uCamera.x),sin(uCamera.y)+up*cos(uCamera.y)));
    float u=fract(atan(direction.x,direction.y)/6.28318530718+uCamera.z);
    float v=clamp(.5-asin(clamp(direction.z,-1.,1.))/3.14159265359,0.,1.);
    vec4 first=texture(uImage,vec2(u,v));
    // sin² is zero with zero derivative where the first image wraps, and one
    // where the half-turn sample wraps. Neither discontinuity survives blending.
    float weight=pow(sin(u*3.14159265359),2.);
    color=mix(first,mix(texture(uImage,vec2(fract(u+.5),v)),first,weight),uBlend);
  }`;
  /* @function skyPanorama.validate — Inputs: optional saved panorama record. Returns sanitized record or undefined. Accepts only fixed catalog IDs, finite orientation degrees -36000–36000 and explicit wrapBlend boolean. Throws malformed input before map commit; no asset loading. */
  function validate(value) {
    if (value === undefined) return undefined;
    if (
      !value ||
      !catalog.some(
        /* @function skyPanorama.knownAsset — Inputs: catalog row. Returns saved identity match without decoding. */ function (
          entry,
        ) {
          return entry.id === value.asset;
        },
      ) ||
      !Number.isFinite(value.orientation) ||
      Math.abs(value.orientation) > 36000 ||
      typeof value.wrapBlend !== "boolean"
    )
      throw Error("Invalid image sky panorama.");
    return {
      asset: value.asset,
      orientation: value.orientation,
      wrapBlend: value.wrapBlend,
    };
  }
  /* @function skyPanorama.image — Inputs: trusted catalog identity. Returns ready HTML image or null during loading/failure. Loads each of four assets once, rejects images over 4096 per side and reports failure once. No pixel readback or per-frame image allocation. */
  function image(id) {
    const entry = catalog.find(
      /* @function skyPanorama.lookupImage — Inputs: catalog record. Returns requested identity match. */ function (
        candidate,
      ) {
        return candidate.id === id;
      },
    );
    if (!entry) return null;
    if (!images.has(id)) {
      const record = { image: new Image(), ready: false, failed: false };
      images.set(id, record);
      record.image.onload =
        /* @function skyPanorama.loaded — Inputs: unused image load. Returns nothing; validates dimensions and marks shared resource ready. Invalid sizes fail visibly and retain the procedural background. */ function () {
          if (
            record.image.naturalWidth > 4096 ||
            record.image.naturalHeight > 4096
          ) {
            record.failed = true;
            console.warn("Sky panorama exceeds 4096 pixels:", entry.url);
          } else record.ready = true;
        };
      record.image.onerror =
        /* @function skyPanorama.failed — Inputs: unused load error. Returns nothing; marks resource failure once, retaining procedural fallback without retry storms. */ function () {
          record.failed = true;
          console.warn("Sky panorama unavailable:", entry.url);
        };
      // Local file images are opaque origins in browser packages. Historical
      // 0.15.25 approach: a lazy assets/skyboxes/<id>.js data script.
      // October 15, 2026 (0.15.27): load the PNG file itself over http(s);
      // from disk, FrontierAssets supplies its offline copy (skyboxes bundle).
      root.FrontierAssets.imageURL(entry.url).then(
        /* @function skyPanorama.sourceReady — Inputs: image URL or data URI. Returns nothing; starts loading the panorama into the owned image. */ function (url) {
          record.image.src = url;
        },
        /* @function skyPanorama.sourceFailed — Inputs: load error. Returns nothing; records one failure (no retry storm) and keeps the procedural sky. */ function (error) {
          record.failed = true;
          console.warn("Sky panorama unavailable:", entry.url, error.message);
        },
      );
    }
    const record = images.get(id);
    return record.ready ? record.image : null;
  }
  /* @function skyPanorama.draw — Inputs: active Pixi canvas adapter, game, camera and validated panorama. Returns true after submitting one fullscreen mesh, false while unavailable/unsupported. Updates bounded uniforms only; density/filter changes use existing Pixi viewport. Texture cache holds at most four original images per renderer. No depth, camera, sprite, lighting or simulation mutation. */
  function draw(ctx, game, camera, settings) {
    const source = image(settings.asset),
      P = root.PIXI;
    if (!source || !ctx.app || !P) return false;
    let state = states.get(ctx);
    if (!state) {
      const geometry = new P.MeshGeometry({
        positions: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
        uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
        indices: new Uint32Array([0, 1, 2, 0, 2, 3]),
      });
      const shader = P.Shader.from({
        gl: { vertex, fragment },
        resources: {
          uImage: new P.ImageSource({ resource: source, scaleMode: "linear" }),
          skyUniforms: {
            uCamera: { value: new Float32Array(4), type: "vec4<f32>" },
            uView: { value: new Float32Array(4), type: "vec4<f32>" },
            uBlend: { value: 1, type: "f32" },
          },
        },
      });
      state = {
        mesh: new P.Mesh({ geometry, shader }),
        shader,
        textures: new Map([[source, shader.resources.uImage]]),
      };
      states.set(ctx, state);
    }
    let texture = state.textures.get(source);
    if (!texture) {
      texture = new P.ImageSource({ resource: source, scaleMode: "linear" });
      state.textures.set(source, texture);
    }
    texture.scaleMode = root.FrontierDisplay?.smooth() ? "linear" : "nearest";
    state.shader.resources.uImage = texture;
    const uniforms = state.shader.resources.skyUniforms.uniforms;
    uniforms.uCamera.set([
      camera.yaw,
      camera.pitch,
      settings.orientation / 360,
      0,
    ]);
    uniforms.uView.set([
      game.viewWidth || 640,
      480,
      camera.cx || (game.viewWidth || 640) / 2,
      camera.cy ?? 96,
    ]);
    uniforms.uBlend = settings.wrapBlend ? 1 : 0;
    ctx.flushStroke();
    ctx.graphic = null;
    ctx.app.stage.addChild(state.mesh);
    return true;
  }
  /* @function skyPanorama.memoryBytes — Inputs: none. Returns decoded source RGBA estimate for ready banked images. Excludes GPU copies; no readback/allocation. At most four images are retained. */
  function memoryBytes() {
    let bytes = 0;
    for (const record of images.values())
      if (record.ready)
        bytes += record.image.naturalWidth * record.image.naturalHeight * 4;
    return bytes;
  }
  /* @function skyPanorama.status — Inputs: catalog identity. Returns ready/failed flags without starting loads or allocating pixels. Transition preparation owns initial request; failures permit explicit procedural fallback. */
  function status(id) {
    const record = images.get(id);
    return { ready: !!record?.ready, failed: !!record?.failed };
  }
  /* @function skyPanorama.diagnostics — Inputs: optional active canvas adapter. Returns decoded source-image count and RGBA bytes plus this adapter's sky texture RGBA estimate and mesh count. Does not serialize maps/read GPU pixels/load images; excludes mipmaps, driver overhead and encoded JS strings explicitly. */
  function diagnostics(ctx) {
    let decoded = 0,
      gpuBytes = 0;
    for (const record of images.values()) if (record.ready) decoded++;
    const state = ctx && states.get(ctx);
    if (state)
      for (const image of state.textures.keys())
        gpuBytes += image.naturalWidth * image.naturalHeight * 4;
    return {
      decoded,
      sourceBytes: memoryBytes(),
      gpuBytes,
      meshes: state ? 1 : 0,
    };
  }
  root.FrontierSkyPanorama = {
    catalog,
    validate,
    draw,
    image,
    memoryBytes,
    status,
    diagnostics,
  };
})(window);
