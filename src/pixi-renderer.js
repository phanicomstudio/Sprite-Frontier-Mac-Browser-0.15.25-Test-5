/* MAINTAINER GUIDE
 * Pooled Pixi graphics, sprites and text behind a Canvas-like drawing interface. Simulation remains renderer-independent. Pools and texture caches avoid creating GPU objects each frame; begin resets state, end submits one frame.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(/* @function pixi-renderer.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier pixi. */ function(root){
'use strict'  ;
  const P=root.PIXI;
  let app=null,adapter=null,started=false,failed=false;const screenTone=new Float32Array(4);
// Convert CSS color into Pixi numeric color plus alpha; multiply with drawing-context opacity.
  const colors=new Map();
  // Bound the palette cache: dynamic mod colors cannot grow it indefinitely.
  /* @function pixi-renderer.color.2 — Bound the palette cache: dynamic mod colors cannot grow it indefinitely. Inputs: value. Uses: colors has; colors get; c to number; colors delete. Returns: colors get using value; parsed. */ function color(value){
    if(colors.has(value))return colors.get(value);
    const c=new P.Color(value);
    const parsed={color:c.toNumber(),alpha:c.alpha};
    if(colors.size>=128)colors.delete(colors.keys().next().value);
    colors.set(value,parsed);
    return parsed;
  }
  class DrawContext{
    // Own application resources and reusable object/texture pools for the adapter lifetime.
    /* @function pixi-renderer.constructor.3 — function Object() { [native code] } Inputs: application. Updates: this app; this graphics; this sprites; this texts; this sources. Uses: this beam layer add child. */ constructor(application){
      this.app=application;
      this.graphics=[];
      this.sprites=[];
      this.texts=[];
      this.sources=new WeakMap();this.normalFilters=new WeakMap();
      this.crops=new WeakMap();
      // One reusable glow surface and blur filter, shared by every world vector.
      this.graphicMasks=[];this.imageMasks=[];this.beamSprites=[];this.beamLayer=new P.Container();this.bi=0;this.waterMeshes=[];this.waterTextures=new WeakMap();this.waterPattern=null;
      this.beam=new P.Graphics();this.beamFilter=new P.BlurFilter({strength:5,quality:2,resolution:0.5});this.beamLayer.addChild(this.beam);this.beamLayer.filters=[this.beamFilter];
      this.fogFilters=[];this.fogPalette=new Map();this.fogColor='';
    }
    // Reset per-frame state and reuse pooled display objects; removing children does not destroy cached GPU resources.
    /* @function pixi-renderer.begin.4 — Handles begin within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this gi; this si; this ti; this graphic; this pending stroke. Uses: this app stage remove children; this beam layer remove children; this beam layer add child; this beam clear. */ begin(){
      this.app.stage.removeChildren();
      this.gi=this.si=this.ti=0;
      this.graphic=null;
      this.pendingStroke=null;
      this.assetNormal=null;this.assetLight=null;this.wi=this.bi=0;this.imageClip=null;this.graphicClip=null;this.clipBottom=null;this.assetGlow=false;this.beamLayer.removeChildren();this.beamLayer.addChild(this.beam);this.beam.clear();this.beamAdded=false;this.vectorDisplay=null;
      this.stack=[];
      this.matrix=[1,0,0,1,0,0];
      this.globalAlpha=1;
      this.fillStyle='#fff';
      this.strokeStyle='#fff';
      this.lineWidth=1;
      this.font='12px PhanicomCheckbook';
      this.textAlign='left';
      this.fog=null;this.fogDepth=0;
    }
    // Transform a local point through the current affine matrix.
    /* @function pixi-renderer.point.5 — Handles point within pixi renderer. Inputs: x; y. Returns: a list of m at 0 multiplied by x plus m at 2 multiplied by y plus m at 4, m at 1 multiplied by x plus m at 3 multiplied by y plus m at 5. */ point(x,y){
      const m=this.matrix;
      return[m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]];
    }
    // Reuse the next Graphics object; start a new draw group after a sprite or text to preserve painter order.
    /* @function pixi-renderer.gfx.6 — Handles gfx within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this graphics at this gi; g mask; this graphic masks at this gi minus 1; this graphic. Uses: g clear; mask clear; mask rect; mask fill. Returns: this graphic. */ gfx(){
      if(!this.graphic){
        const g=this.graphics[this.gi]||(this.graphics[this.gi]=new P.Graphics());
        this.gi++;
        g.clear();
        g.mask=null;if(this.graphicClip||this.clipBottom!==null){const mask=this.graphicMasks[this.gi-1]||(this.graphicMasks[this.gi-1]=new P.Graphics());mask.clear();if(this.graphicClip){for(const r of this.graphicClip.regions||[this.graphicClip])mask.rect(r.x,r.y,r.width,r.height);}else mask.rect(0,0,this.app.renderer.width,Math.max(0,this.clipBottom));mask.fill(0xffffff);this.app.stage.addChild(mask);g.mask=mask;}
        this.app.stage.addChild(g);
        this.graphic=g;
      }
      return this.graphic;
    }
    // Push independent drawing state so nested transforms/styles cannot leak to later objects.
    /* @function pixi-renderer.save.7 — Handles save within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: this stack push. */ save(){
      this.stack.push({
        matrix:[...this.matrix],globalAlpha:this.globalAlpha,fillStyle:this.fillStyle,strokeStyle:this.strokeStyle,lineWidth:this.lineWidth,font:this.font,textAlign:this.textAlign,fogDepth:this.fogDepth,graphicClip:this.graphicClip,clipBottom:this.clipBottom
      }
      );
    }
    // Restore the most recent drawing state; callers must balance save/restore.
    /* @function pixi-renderer.restore.8 — Applies saved state to this system. Inputs: no explicit arguments; uses enclosing module state. Updates: this graphic. Uses: this stack pop; this flush stroke; object assign. */ restore(){
      const state=this.stack.pop();if(state.clipBottom!==this.clipBottom||state.graphicClip!==this.graphicClip){this.flushStroke();this.graphic=null;}Object.assign(this,state);
    }
    // Compose local translation into the current affine transform.
    /* @function pixi-renderer.translate.9 — Handles translate within pixi renderer. Inputs: x; y. Updates: this matrix at 4; this matrix at 5. Uses: this point. */ translate(x,y){
      const q=this.point(x,y);
      this.matrix[4]=q[0];
      this.matrix[5]=q[1];
    }
    // Scale matrix basis vectors without changing translation.
    /* @function pixi-renderer.scale.10 — Handles scale within pixi renderer. Inputs: x; y. Updates: this matrix at 0; this matrix at 1; this matrix at 2; this matrix at 3. */ scale(x,y){
      this.matrix[0]*=x;
      this.matrix[1]*=x;
      this.matrix[2]*=y;
      this.matrix[3]*=y;
    }
    // Rotate matrix basis vectors while retaining accumulated scale/translation.
    /* @function pixi-renderer.rotate.11 — Handles rotate within pixi renderer. Inputs: angle. Uses: object assign. */ rotate(angle){
      const [a,b,c,d]=this.matrix,cs=Math.cos(angle),sn=Math.sin(angle);
      Object.assign(this.matrix,{
        0:a*cs+c*sn,1:b*cs+d*sn,2:c*cs-a*sn,3:d*cs-b*sn
      }
      );
    }
    // Start a fresh transformed path command buffer.
    /* @function pixi-renderer.beginPath.12 — Handles begin path within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this path. */ beginPath(){
      this.path=[];
    }
    // Append a transformed path start.
    /* @function pixi-renderer.moveTo.13 — Handles move to within pixi renderer. Inputs: x; y. Uses: this path push; this point. */ moveTo(x,y){
      this.path.push(['moveTo',...this.point(x,y)]);
    }
    // Append a transformed line endpoint.
    /* @function pixi-renderer.lineTo.14 — Handles line to within pixi renderer. Inputs: x; y. Uses: this path push; this point. */ lineTo(x,y){
      this.path.push(['lineTo',...this.point(x,y)]);
    }
    // Transform both control points and endpoint for curved vector paths.
    /* @function pixi-renderer.bezierCurveTo.15 — Handles bezier curve to within pixi renderer. Inputs: a; b; c; d; x; y. Uses: this path push; this point. */ bezierCurveTo(a,b,c,d,x,y){
      this.path.push(['bezierCurveTo',...this.point(a,b),...this.point(c,d),...this.point(x,y)]);
    }
    // Close the buffered vector contour.
    /* @function pixi-renderer.closePath.16 — Handles close path within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: this path push. */ closePath(){
      this.path.push(['closePath']);
    }
    // Replay path commands into pooled Pixi Graphics and apply color/opacity/width.
    // Flush only at a style/order boundary. Separate moveTo contours preserve
    // the original paths while avoiding repeated Pixi style normalization.
    /* @function pixi-renderer.flushStroke.17 — Handles flush stroke within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this pending stroke. Uses: this graphic stroke. Returns: without a result. */ flushStroke(){
      if(!this.pendingStroke)return;
      this.graphic.stroke(this.pendingStroke);
      this.pendingStroke=null;
    }
    // Palette blends vector/text colors. Sprite filters preserve texture alpha
    // while blending RGB toward fog; at most sixteen cached filters are reused.
    /* @function pixi-renderer.fogAmount.18 — Handles fog amount within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: root frontier fog amount. Returns: chain or 0. */ fogAmount(){return root.FrontierFog?.amount(this.fog||root.FrontierFog.defaults,this.fogDepth)||0;}
    /* @function pixi-renderer.fogRGB.19 — Handles fog rgb within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: color. Returns: color using this fog color color. */ fogRGB(){return color(this.fog.color).color;}
    /* @function pixi-renderer.painted.20 — Handles painted within pixi renderer. Inputs: value. Updates: rgb. Uses: color; this fog amount; this fog palette has; this fog palette get. Returns: original; this fog palette get using key. */ painted(value){
      const original=color(value),a=this.fogAmount();if(!a)return original;
      const key=value+'|'+this.fog.color+'|'+a;
      if(this.fogPalette.has(key))return this.fogPalette.get(key);
      const target=this.fogRGB(),source=original.color;let rgb=0;
      for(const shift of [16,8,0])rgb|=Math.round(((source>>shift)&255)*(1-a)+((target>>shift)&255)*a)<<shift;
      const result={color:rgb,alpha:original.alpha};
      if(this.fogPalette.size>=512)this.fogPalette.clear();this.fogPalette.set(key,result);return result;
    }
    /* @function pixi-renderer.spriteFog.21 — Handles sprite fog within pixi renderer. Inputs: a. Updates: this fog color; f matrix; this fog filters at index. Uses: this fog rgb. Returns: null; this fog filters at index. */ spriteFog(a){
      if(!a)return null;
      if(this.fogColor!==this.fog.color){
        this.fogColor=this.fog.color;
        // Recolor existing GPU filters instead of rebuilding them when a future
        // day/night system interpolates fog color every frame.
        const rgb=this.fogRGB();
        for(let i=1;i<this.fogFilters.length;i++){const f=this.fogFilters[i]?.[0];if(!f)continue;const t=i/16,k=1-t;
          f.matrix=[k,0,0,0,((rgb>>16)&255)/255*t,0,k,0,0,((rgb>>8)&255)/255*t,0,0,k,0,(rgb&255)/255*t,0,0,0,1,0];}
      }
      const index=Math.round(a*16);if(this.fogFilters[index])return this.fogFilters[index];
      const f=new P.ColorMatrixFilter(),rgb=this.fogRGB(),k=1-a;
      f.matrix=[k,0,0,0,((rgb>>16)&255)/255*a,0,k,0,0,((rgb>>8)&255)/255*a,0,0,k,0,(rgb&255)/255*a,0,0,0,1,0];
      return this.fogFilters[index]=[f];
    }
    /* @function pixi-renderer.stroke.22 — Handles stroke within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this graphic; this beam added; this beam filter strength; this beam layer alpha; this pending stroke. Uses: this flush stroke; this app stage add child; this painted; root frontier vector paths. */ stroke(){
      const v=this.vectorDisplay,active=v?.enabled;
      // Add the halo after the background and before all scene sprites/cores.
      if(active&&!this.beamAdded){this.flushStroke();this.graphic=null;this.app.stage.addChild(this.beamLayer);this.beamAdded=true;this.beamFilter.strength=v.radius;this.beamLayer.alpha=v.glow;}
      const c=this.painted(active&&v.monochrome?v.color:this.strokeStyle),alpha=c.alpha*this.globalAlpha;
      const path=root.FrontierVector?.paths(this.path,v||{enabled:false})||this.path;
      const authoredWidth=this.lineWidth*Math.sqrt(Math.abs(this.matrix[0]*this.matrix[3]-this.matrix[1]*this.matrix[2]));
      const width=active?Math.min(1.5,Math.max(0.7,authoredWidth)):authoredWidth;
      const previous=this.pendingStroke;
      if(previous&&(previous.color!==c.color||previous.alpha!==alpha||previous.width!==width))this.flushStroke();
      const g=this.gfx();
      for(const [method,...args] of path)g[method](...args);
      if(active&&v.glow){for(const [method,...args] of path)this.beam[method](...args);this.beam.stroke({color:c.color,alpha,width:Math.max(1,width)+2});}
      if(!this.pendingStroke)this.pendingStroke={color:c.color,alpha,width};
    }
    // Pooled water tiles share one source texture. UV motion gives inexpensive
    // Quake-style distortion; geometry remains a flat plane. Meshes batch in Pixi.
    /* @function pixi-renderer.waterQuad.23 — Handles water quad within pixi renderer. Inputs: points; material; x; y; assignment pattern. Updates: this graphic; c width; c height; pixels data at o; pixels data at o plus 1. Uses: this flush stroke; document create element; c get context; q create image data. */ waterQuad(points,material,x,y,coords=[[x,y],[x+1,y],[x+1,y+1],[x,y+1]]){
      this.flushStroke();this.graphic=null;
      if(!this.waterPattern){const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d'),pixels=q.createImageData(64,64);for(let j=0;j<64;j++)for(let i=0;i<64;i++){const n=.5+.25*Math.sin(i*.196+j*.098)+.2*Math.cos(j*.294-i*.098),o=(j*64+i)*4;pixels.data[o]=Math.round(110+n*100);pixels.data[o+1]=Math.round(110+n*100);pixels.data[o+2]=Math.round(110+n*100);pixels.data[o+3]=255;}q.putImageData(pixels,0,0);this.waterPattern=c;}
      const original=material.textureImage||this.waterPattern;const image=root.FrontierAssetStyle?.image(original,this.world.vectorDisplay,this.world.vectorDisplay?.textures)||original;let texture=this.waterTextures.get(image);if(!texture){texture=new P.Texture({source:new P.ImageSource({resource:image,addressMode:'repeat',scaleMode:'linear'})});this.waterTextures.set(image,texture);}
      let mesh=this.waterMeshes[this.wi];if(!mesh){mesh=new P.Mesh({geometry:new P.MeshGeometry({positions:new Float32Array(8),uvs:new Float32Array(8),indices:new Uint16Array([0,1,2])}),texture});this.waterMeshes[this.wi]=mesh;}this.wi++;mesh.texture=texture;mesh.tint=this.painted(material.color).color;
      const positions=mesh.geometry.getBuffer('aPosition'),uvs=mesh.geometry.getBuffer('aUV');
      mesh.waterTriangleIndices||=new Uint16Array([0,1,2]);mesh.waterQuadIndices||=new Uint16Array([0,1,2,0,2,3]);const indices=points.length===4?mesh.waterQuadIndices:mesh.waterTriangleIndices;if(mesh.geometry.indexBuffer.data!==indices){mesh.geometry.indexBuffer.data=indices;mesh.geometry.indexBuffer.update();}
      for(let i=0;i<points.length;i++){positions.data[i*2]=points[i].x;positions.data[i*2+1]=points[i].y;const [u,v]=coords[i],t=material.time*material.speed;uvs.data[i*2]=u/material.scale+Math.sin(v*1.7+t)*material.warp+material.time*material.flowX;uvs.data[i*2+1]=v/material.scale+Math.sin(u*1.3+t)*material.warp+material.time*material.flowY;}positions.update();uvs.update();mesh.alpha=1;this.app.stage.addChild(mesh);
    }
    // Fill arbitrary primitive faces through the pooled graphics path.
    /* @function pixi-renderer.fill.24 — Handles fill within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: this flush stroke; this gfx; g at method; this painted. */ fill(){this.flushStroke();const g=this.gfx();for(const [method,...args]of this.path)g[method](...args);const c=this.painted(this.fillStyle);g.fill({color:c.color,alpha:c.alpha*this.globalAlpha});}
    // Build a transformed rectangle path reusable by fill and stroke.
    /* @function pixi-renderer.rectPath.25 — Handles rect path within pixi renderer. Inputs: x; y; w; h. Uses: this begin path; this move to; this line to; this close path. */ rectPath(x,y,w,h){
      this.beginPath();
      this.moveTo(x,y);
      this.lineTo(x+w,y);
      this.lineTo(x+w,y+h);
      this.lineTo(x,y+h);
      this.closePath();
    }
    // Construct and stroke a rectangle with the current style.
    /* @function pixi-renderer.strokeRect.26 — Handles stroke rect within pixi renderer. Inputs: x; y; w; h. Uses: this rect path; this stroke. */ strokeRect(x,y,w,h){
      this.rectPath(x,y,w,h);
      this.stroke();
    }
    // Fill a transformed rectangle using current color and opacity.
    /* @function pixi-renderer.fillRect.27 — Handles fill rect within pixi renderer. Inputs: x; y; w; h. Uses: this flush stroke; this rect path; this gfx; g at method. */ fillRect(x,y,w,h){
      this.flushStroke();
      this.rectPath(x,y,w,h);
      const g=this.gfx();
      for(const [method,...args] of this.path)g[method](...args);
      const c=this.painted(this.fillStyle);
      g.fill({
        color:c.color,alpha:c.alpha*this.globalAlpha
      }
      );
    }
    // Cache image sources and crop textures; reuse a sprite and apply its affine transform/opacity.
    /* @function pixi-renderer.setGraphicClip.28 — Handles set graphic clip within pixi renderer. Inputs: rect. Updates: this graphic; this graphic clip. Uses: this flush stroke. */ setGraphicClip(rect){this.flushStroke();this.graphic=null;this.graphicClip=rect;}
    /* @function pixi-renderer.setImageClip.29 — Handles set image clip within pixi renderer. Inputs: rect. Updates: this image clip. */ setImageClip(rect){this.imageClip=rect;}
    /* @function pixi-renderer.drawImage.30 — Handles draw image within pixi renderer. Inputs: image; sx; sy; sw; sh; dx; dy; dw; dh. Updates: source; texture; this sprites at this si; sprite texture; sprite alpha. Uses: this flush stroke; this sources get; this sources set; this crops set. */ drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh){
      this.flushStroke();
      let source=this.sources.get(image);
      if(!source){
        source=new P.ImageSource({
          resource:image,scaleMode:'nearest'
        }
        );
        this.sources.set(image,source);
        this.crops.set(image,new Map());
      }
      const key=[sx,sy,sw,sh].join(','),cache=this.crops.get(image);
      let texture=cache.get(key);
      if(!texture){
        texture=new P.Texture({
          source,frame:new P.Rectangle(sx,sy,sw,sh)
        }
        );
        cache.set(key,texture);
      }
      const sprite=this.sprites[this.si]||(this.sprites[this.si]=new P.Sprite(texture));
      this.si++;
      sprite.texture=texture;
      sprite.alpha=this.globalAlpha;
      sprite.filters=this.spriteFog(this.fogAmount());
      const normal=this.assetNormal,l=this.assetLight;if(normal?.complete&&normal.naturalWidth&&l){let filter=this.normalFilters.get(normal);if(!filter){const normalSource=new P.ImageSource({resource:normal,scaleMode:'linear'});filter=new P.Filter({glProgram:P.GlProgram.from({vertex:P.defaultFilterVert,fragment:'precision highp float;in vec2 vTextureCoord;out vec4 finalColor;uniform sampler2D uTexture;uniform sampler2D uNormal;uniform vec4 uInputSize;uniform vec4 uOutputFrame;uniform vec3 uLight;uniform float uAmbient;uniform float uPower;void main(){vec4 c=texture(uTexture,vTextureCoord);vec2 uv=clamp(vTextureCoord*uInputSize.xy/uOutputFrame.zw,vec2(0.0),vec2(1.0));vec3 n=normalize(texture(uNormal,uv).rgb*2.0-1.0);float shade=uAmbient+uPower*max(0.0,dot(n,normalize(uLight)));finalColor=vec4(c.rgb*shade,c.a);}' }),resources:{uNormal:normalSource,normalUniforms:{uLight:{value:new Float32Array([l.x,l.y,l.z]),type:'vec3<f32>'},uAmbient:{value:l.ambient,type:'f32'},uPower:{value:l.strength,type:'f32'}}}});filter.padding=0;this.normalFilters.set(normal,filter);}const u=filter.resources.normalUniforms.uniforms;u.uLight[0]=l.x;u.uLight[1]=l.y;u.uLight[2]=l.z;u.uAmbient=l.ambient;u.uPower=l.strength;sprite.filters=[...(sprite.filters||[]),filter];}
      const m=this.matrix,q=this.point(dx,dy);
      const imageMatrix=new P.Matrix(m[0]*dw/sw,m[1]*dw/sw,m[2]*dh/sh,m[3]*dh/sh,q[0],q[1]);
      sprite.setFromMatrix(imageMatrix);
      sprite.mask=null;
      if(this.imageClip){const mask=this.imageMasks[this.si-1]||(this.imageMasks[this.si-1]=new P.Graphics());const c=this.imageClip;mask.clear();for(const r of c.regions||[c])mask.rect(r.x,r.y,r.width,r.height);mask.fill(0xffffff);this.app.stage.addChild(mask);sprite.mask=mask;}
      // Raster glow joins the same half-resolution layer as vector line halos.
      if(this.vectorDisplay?.enabled&&(this.vectorDisplay.sprites!=='original'||this.assetGlow)&&this.beamAdded){const glow=this.beamSprites[this.bi]||(this.beamSprites[this.bi]=new P.Sprite(texture));this.bi++;glow.texture=texture;glow.setFromMatrix(imageMatrix);glow.alpha=this.globalAlpha;glow.mask=sprite.mask;this.beamLayer.addChild(glow);}
      this.app.stage.addChild(sprite);
      this.graphic=null;
    }
    // Reuse a Pixi Text object and set shared Checkbook font, position, anchor and opacity.
    /* @function pixi-renderer.fillText.31 — Handles fill text within pixi renderer. Inputs: value; x; y. Updates: this texts at this ti; text text; text style font size; text style font family; text style fill. Uses: this flush stroke; string; number; this font match. */ fillText(value,x,y){
      this.flushStroke();
      const text=this.texts[this.ti]||(this.texts[this.ti]=new P.Text({
        text:'',style:{
          fontFamily:'PhanicomCheckbook',fontSize:12
        }
      }
      ));
      this.ti++;
      text.text=String(value);
      text.style.fontSize=Number(this.font.match(/([\d.]+)px/)?.[1]||12);
      text.style.fontFamily='PhanicomCheckbook';
      text.style.fill=this.painted(this.fillStyle).color;
      text.alpha=this.globalAlpha;
      text.anchor.set(this.textAlign==='center'?.5:this.textAlign==='right'?1:0,1);
      const q=this.point(x,y);
      text.position.set(...q);
      this.app.stage.addChild(text);
      this.graphic=null;
    }
    // Submit the assembled stage once; Pixi owns GPU work.
    /* @function pixi-renderer.end.32 — Handles end within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Updates: this app stage filters; this underwater filter; u u time; u u strength; u u frequency. Uses: this flush stroke; p gl program from; screen tone some; this app renderer render. */ end(){
      this.flushStroke();
      const w=this.underwater;this.app.stage.filters=null;
      if(w?.underwaterEnabled&&w.underwaterStrength>0){
        if(!this.underwaterFilter)this.underwaterFilter=new P.Filter({glProgram:P.GlProgram.from({vertex:P.defaultFilterVert,fragment:`in vec2 vTextureCoord;out vec4 finalColor;uniform sampler2D uTexture;uniform vec4 uInputClamp;uniform float uTime;uniform float uStrength;uniform float uFrequency;void main(){vec2 uv=vTextureCoord;uv.x+=sin(uv.y*6.283185*uFrequency+uTime)*uStrength;uv.y+=sin(uv.x*6.283185*uFrequency-uTime)*uStrength*0.35;finalColor=texture(uTexture,clamp(uv,uInputClamp.xy,uInputClamp.zw));}`}),resources:{waterUniforms:{uTime:{value:0,type:'f32'},uStrength:{value:0,type:'f32'},uFrequency:{value:4,type:'f32'}}}});
        const u=this.underwaterFilter.resources.waterUniforms.uniforms;u.uTime=w.time*w.underwaterSpeed;u.uStrength=w.underwaterStrength;u.uFrequency=w.underwaterFrequency;this.app.stage.filterArea=new P.Rectangle(0,0,this.app.renderer.width,this.app.renderer.height);this.app.stage.filters=[this.underwaterFilter];
      }
      // Desaturating HSL at fixed lightness equals mixing RGB with (max+min)/2.
      // Reuse one GPU filter and append after underwater distortion; DOM UI is outside it.
      if(screenTone.some(/* @function pixi-renderer.callback.33 — Returns v does not equal 0. Inputs: v. Returns: v does not equal 0. */ v=>v!==0)){
        if(!this.toneFilter)this.toneFilter=new P.Filter({glProgram:P.GlProgram.from({vertex:P.defaultFilterVert,fragment:'precision highp float;in vec2 vTextureCoord;out vec4 finalColor;uniform sampler2D uTexture;uniform vec4 uTone;void main(){vec4 c=texture(uTexture,vTextureCoord);float hi=max(c.r,max(c.g,c.b));float lo=min(c.r,min(c.g,c.b));vec3 rgb=mix(c.rgb,vec3((hi+lo)*0.5),uTone.a/255.0);rgb=clamp(rgb+uTone.rgb*c.a/255.0,vec3(0.0),vec3(1.0));finalColor=vec4(rgb,c.a);}' }),resources:{toneUniforms:{uTone:{value:screenTone,type:'vec4<f32>'}}}});
        this.app.stage.filterArea=new P.Rectangle(0,0,this.app.renderer.width,this.app.renderer.height);this.app.stage.filters=[...(this.app.stage.filters||[]),this.toneFilter];
      }
      this.app.renderer.render({
        container:this.app.stage
      }
      );
    }
  }
  /* @function pixi-renderer.init.34 — Handles init within pixi renderer. Inputs: canvas. Updates: app; adapter; root frontier pixi backend; failed. Uses: document fonts load; app init; app stop. */ async function init(canvas){
    try{
      await document.fonts.load('12px PhanicomCheckbook');
      app=new P.Application();
      await app.init({
        canvas,width:canvas.width,height:canvas.height,autoStart:false,preference:'webgl',background:'#000',antialias:false,resolution:1
      }
      );
      app.stop();
      adapter=new DrawContext(app);
      root.FrontierPixi.backend='PixiJS '+P.VERSION+' / WebGL';
    }
    catch(error){
      failed=true;
      root.FrontierPixi.backend='Canvas fallback';
      console.warn('Pixi initialization unavailable',error);
    }
  }
// Initialize Pixi once, return null while starting, then reuse a drawing adapter and resize as needed.
  /* @function pixi-renderer.context.35 — Initialize Pixi once, return null while starting, then reuse a drawing adapter and resize as needed. Inputs: canvas. Updates: started. Uses: init; canvas get context; app renderer resize; adapter begin. Returns: canvas get context using "2d"; null. */ function context(canvas){
    if(!started){
      started=true;
      init(canvas);
    }
    if(failed)return canvas.getContext('2d');
    if(!adapter)return null;
    if(app.renderer.width!==canvas.width||app.renderer.height!==canvas.height)app.renderer.resize(canvas.width,canvas.height);
    adapter.begin();
    return adapter;
  }
  root.FrontierPixi={
    /* @function pixi-renderer.releaseImage.36 — Handles release image within pixi renderer. Inputs: image. Uses: adapter sources get; adapter crops get using image values; adapter crops get; texture destroy. Returns: without a result. */ releaseImage(image){if(!adapter)return;const source=adapter.sources.get(image);for(const texture of adapter.crops.get(image)?.values()||[])texture.destroy(false);source?.destroy();adapter.sources.delete(image);adapter.crops.delete(image);},
    // Refresh the GPU buffer immediately before copying; do not retain every frame.
    /* @function pixi-renderer.capture.37 — Handles capture within pixi renderer. Inputs: target. Uses: app renderer render; target get context using "2d" draw image; target get context; document get element by id. */ capture(target){if(app&&adapter&&!failed)app.renderer.render({container:app.stage});target.getContext('2d').drawImage(document.getElementById('view'),0,0,target.width,target.height);},
    toneSupported:/* @function pixi-renderer.toneSupported.38 — Returns the inverse of failed. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of failed. */ ()=>!failed,/* @function pixi-renderer.setTone.39 — Handles set tone within pixi renderer. Inputs: value. Uses: screen tone set. */ setTone(value){screenTone.set(value);},
    context,/* @function pixi-renderer.end.40 — Handles end within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Uses: adapter end. */ end(){
      adapter?.end();
    }
    ,backend:'Starting PixiJS',get app/* @function pixi-renderer.app.41 — Handles app within pixi renderer. Inputs: no explicit arguments; uses enclosing module state. Returns: app. */ (){
      return app;
    }
  }
  ;
}
)(window);

