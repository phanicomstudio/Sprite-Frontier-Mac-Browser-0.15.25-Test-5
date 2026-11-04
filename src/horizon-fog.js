/* November 4, 2026: the outdoor backdrop fills the gap behind finite terrain. Perspective retains an upward sky fade, while outdoor isometric uses a uniform fog backdrop without a horizon. */
/* November 1, 2026: continuous distant atmosphere refines the old geometry-only fog rule. Only the horizon/lower background is fog-filled; upper sky, foreground geometry, HUD and weapon presentation retain their owners. */
(/* @function horizonFog.install1624 â€” Inputs: browser namespace. Registers one lazy reusable background mesh per renderer; no textures, timers, readbacks or active simulation are created on load. */function(root){

  'use strict';
  const states=new WeakMap();

  const vertex=`#version 300 es
 precision highp float;in vec2 aPosition;uniform vec4 uView;uniform mat3 uProjectionMatrix;uniform mat3 uWorldTransformMatrix;uniform mat3 uTransformMatrix;out float vY;
 void main(){vec2 p=aPosition*uView.xy;vY=p.y;gl_Position=vec4((uProjectionMatrix*uWorldTransformMatrix*uTransformMatrix*vec3(p,1.)).xy,0.,1.);}`;

  const fragment=`#version 300 es
 precision highp float;in float vY;uniform vec4 uView;uniform vec3 uColor;out vec4 color;
 void main(){float alpha=1.-smoothstep(0.,uView.w,uView.z-vY);

 color=vec4(uColor*alpha,alpha);}`;

  /* @function horizonFog.profile1624 â€” Inputs: active game and actual camera. Returns camera-pitched horizon Y, upward fade extent and effective fog color, a solid color for outdoor isometric, or null indoors or with fog disabled. Logical screen height is 480. The backdrop covers the void below the horizon and does not alter authored fog. */
  function profile(game,cam){

    const world=game.sourceWorld,fog=root.FrontierFog.settings(game);

    if(!fog.enabled||(cam.orthographic&&!cam.outdoorIsometric)||(world.interior&&!world.interior.outdoor))return null;

    if(cam.outdoorIsometric)return {color:fog.color,solid:true};
    const pitch=cam.pitch||0,cos=Math.cos(pitch);

    if(Math.abs(cos)<.01)return null;

    return {
      horizon:(cam.cy??96)+360*Math.tan(pitch),fade:Math.max(48,Math.min(160,360*12/fog.end))/Math.max(.35,cos*cos),color:fog.color
    };

  }

  /* @function horizonFog.opacity1624 â€” Inputs: profile and logical pixel Y. Returns smooth 0â€“1 background opacity for CPU tests/canvas parity. No geometry, colors or runtime state are mutated. */
  function opacity(p,y){

    if(p.solid||y>=p.horizon)return 1;
    const t=Math.max(0,Math.min(1,(p.horizon-y)/p.fade));
    return 1-t*t*(3-2*t);
  }

  /* @function horizonFog.draw1624 â€” Inputs: existing drawing adapter, game and camera. Returns whether a horizon layer was drawn. One pooled four-vertex Pixi mesh in the existing world submission; uniforms only change per frame. Canvas fallback uses bounded four-pixel bands. Draw before world geometry so near assets remain unwashed and their existing distance fog supplies the matching silhouette color. */
  function draw(ctx,game,cam){

    const p=profile(game,cam);
    if(!p)return false;

    const width=game.viewWidth||640,P=root.PIXI;

    // Outdoor isometric has no sky horizon. Clear uncovered pixels to the fog color behind terrain.
    if(p.solid){
      ctx.fillStyle=p.color;
      ctx.fillRect(0,0,width,480);
      return true;
    }

    if(!ctx.app||!P){
      if(!ctx.createLinearGradient)return false;
      ctx.save();
      ctx.fillStyle=p.color;
      for(let y=0;y<480;y+=4){
        ctx.globalAlpha=opacity(p,y+2);
        ctx.fillRect(0,y,width,4);
      }
      ctx.restore();
      return true;
    }

    let state=states.get(ctx);

    if(!state){
      const geometry=new P.MeshGeometry({
        positions:new Float32Array([0,0,1,0,1,1,0,1]),uvs:new Float32Array([0,0,1,0,1,1,0,1]),indices:new Uint32Array([0,1,2,0,2,3])
      }),shader=P.Shader.from({
        gl:{
          vertex,fragment
        },resources:{
          horizonUniforms:{
            uView:{
              value:new Float32Array(4),type:'vec4<f32>'
            },uColor:{
              value:new Float32Array(3),type:'vec3<f32>'

            }
          }
        }
      });
      state={
        mesh:new P.Mesh({
          geometry,shader
        }),shader
      };
      states.set(ctx,state);
    }

    const uniforms=state.shader.resources.horizonUniforms.uniforms;
    uniforms.uView.set([width,480,p.horizon,p.fade]);

    for(let i=0;i<3;i++)uniforms.uColor[i]=parseInt(p.color.slice(1+i*2,3+i*2),16)/255;

    ctx.flushStroke();
    ctx.graphic=null;
    (ctx.drawStage||ctx.app.stage).addChild(state.mesh);
    game.horizonFogDebug={
      ...p,meshes:1
    };
    return true;

  }

  root.FrontierHorizonFog={
    profile,opacity,draw
  };

})(typeof window==='undefined'?globalThis:window);


