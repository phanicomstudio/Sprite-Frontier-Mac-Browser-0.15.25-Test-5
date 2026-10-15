/* October 10, 2026: native animated soft color fields. Each pooled draw sprite
 * owns one reusable GPU filter; alpha, frame geometry and sprite tilt are kept. */
(/* @function color-pools.install — Inputs: browser namespace. Publishes filter adapter with no allocation until an opted-in drawable is encountered. Returns nothing. */ function (
  root,
) {
  /* @function color-pools.filter — Inputs: Pixi namespace, pooled drawable, validated color settings and simulation seconds. Returns reusable filter or null when disabled. Updates only uniform values; preserves original texture alpha and allocates no per-frame textures. */
  function filter(P, sprite, settings, time) {
    if (!settings?.enabled) return null;
    let effect = sprite.frontierColorPools;
    if (!effect) {
      effect = new P.Filter({
        glProgram: P.GlProgram.from({
          vertex: P.defaultFilterVert,
          fragment:
            "precision highp float;in vec2 vTextureCoord;out vec4 finalColor;uniform sampler2D uTexture;uniform vec4 uInputSize;uniform vec4 uOutputFrame;uniform float uTime;uniform float uStrength;uniform float uSpeed;uniform float uPalette;void main(){vec4 c=texture(uTexture,vTextureCoord);vec2 uv=vTextureCoord*uInputSize.xy/uOutputFrame.zw;float t=uTime*uSpeed;vec2 a=vec2(0.4+0.3*sin(t),0.45+0.3*cos(t*0.7));vec2 b=vec2(0.6+0.25*cos(t*0.8),0.5+0.3*sin(t*0.9));vec2 d=vec2(0.5+0.3*sin(t*0.6+2.0),0.4+0.3*cos(t+1.0));float wa=1.0-smoothstep(0.1,0.65,length(uv-a));float wb=1.0-smoothstep(0.1,0.6,length(uv-b));float wd=1.0-smoothstep(0.1,0.7,length(uv-d));vec3 ca=mix(vec3(0.9,0.5,0.65),vec3(0.85,0.22,0.1),uPalette);vec3 cb=mix(vec3(0.45,0.85,0.6),vec3(0.58,0.66,0.2),uPalette);vec3 cd=mix(vec3(0.4,0.65,1.0),vec3(0.22,0.3,0.64),uPalette);float weight=max(0.001,wa+wb+wd);vec3 color=(ca*wa+cb*wb+cd*wd)/weight;vec3 rgb=mix(c.rgb,c.rgb*color*1.5,clamp(weight*uStrength,0.0,1.0));finalColor=vec4(rgb,c.a);}",
        }),
        resources: {
          poolUniforms: {
            uTime: { value: time, type: "f32" },
            uStrength: { value: settings.strength, type: "f32" },
            uSpeed: { value: settings.speed, type: "f32" },
            uPalette: {
              value: settings.palette === "wizards" ? 1 : 0,
              type: "f32",
            },
          },
        },
      });
      effect.padding = 0;
      sprite.frontierColorPools = effect;
    }
    const u = effect.resources.poolUniforms.uniforms;
    u.uTime = time;
    u.uStrength = settings.strength;
    u.uSpeed = settings.speed;
    u.uPalette = settings.palette === "wizards" ? 1 : 0;
    return effect;
  }
  root.FrontierColorPools = { filter };
})(window);
