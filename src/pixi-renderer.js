/* MAINTAINER GUIDE
 * Pooled Pixi graphics, sprites and text behind a Canvas-like drawing interface. Simulation remains renderer-independent. Pools and texture caches avoid creating GPU objects each frame; begin resets state, end submits one frame.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function(root){
'use strict'  ;
  const P=root.PIXI;
  let app=null,adapter=null,started=false,failed=false;
// Convert CSS color into Pixi numeric color plus alpha; multiply with drawing-context opacity.
  const colors=new Map();
  // Bound the palette cache: dynamic mod colors cannot grow it indefinitely.
  function color(value){
    if(colors.has(value))return colors.get(value);
    const c=new P.Color(value);
    const parsed={color:c.toNumber(),alpha:c.alpha};
    if(colors.size>=128)colors.delete(colors.keys().next().value);
    colors.set(value,parsed);
    return parsed;
  }
  class DrawContext{
    // Own application resources and reusable object/texture pools for the adapter lifetime.
    constructor(application){
      this.app=application;
      this.graphics=[];
      this.sprites=[];
      this.texts=[];
      this.sources=new WeakMap();
      this.crops=new WeakMap();
    }
    // Reset per-frame state and reuse pooled display objects; removing children does not destroy cached GPU resources.
    begin(){
      this.app.stage.removeChildren();
      this.gi=this.si=this.ti=0;
      this.graphic=null;
      this.pendingStroke=null;
      this.stack=[];
      this.matrix=[1,0,0,1,0,0];
      this.globalAlpha=1;
      this.fillStyle='#fff';
      this.strokeStyle='#fff';
      this.lineWidth=1;
      this.font='12px PhanicomCheckbook';
      this.textAlign='left';
    }
    // Transform a local point through the current affine matrix.
    point(x,y){
      const m=this.matrix;
      return[m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]];
    }
    // Reuse the next Graphics object; start a new draw group after a sprite or text to preserve painter order.
    gfx(){
      if(!this.graphic){
        const g=this.graphics[this.gi]||(this.graphics[this.gi]=new P.Graphics());
        this.gi++;
        g.clear();
        this.app.stage.addChild(g);
        this.graphic=g;
      }
      return this.graphic;
    }
    // Push independent drawing state so nested transforms/styles cannot leak to later objects.
    save(){
      this.stack.push({
        matrix:[...this.matrix],globalAlpha:this.globalAlpha,fillStyle:this.fillStyle,strokeStyle:this.strokeStyle,lineWidth:this.lineWidth,font:this.font,textAlign:this.textAlign
      }
      );
    }
    // Restore the most recent drawing state; callers must balance save/restore.
    restore(){
      Object.assign(this,this.stack.pop());
    }
    // Compose local translation into the current affine transform.
    translate(x,y){
      const q=this.point(x,y);
      this.matrix[4]=q[0];
      this.matrix[5]=q[1];
    }
    // Scale matrix basis vectors without changing translation.
    scale(x,y){
      this.matrix[0]*=x;
      this.matrix[1]*=x;
      this.matrix[2]*=y;
      this.matrix[3]*=y;
    }
    // Rotate matrix basis vectors while retaining accumulated scale/translation.
    rotate(angle){
      const [a,b,c,d]=this.matrix,cs=Math.cos(angle),sn=Math.sin(angle);
      Object.assign(this.matrix,{
        0:a*cs+c*sn,1:b*cs+d*sn,2:c*cs-a*sn,3:d*cs-b*sn
      }
      );
    }
    // Start a fresh transformed path command buffer.
    beginPath(){
      this.path=[];
    }
    // Append a transformed path start.
    moveTo(x,y){
      this.path.push(['moveTo',...this.point(x,y)]);
    }
    // Append a transformed line endpoint.
    lineTo(x,y){
      this.path.push(['lineTo',...this.point(x,y)]);
    }
    // Transform both control points and endpoint for curved vector paths.
    bezierCurveTo(a,b,c,d,x,y){
      this.path.push(['bezierCurveTo',...this.point(a,b),...this.point(c,d),...this.point(x,y)]);
    }
    // Close the buffered vector contour.
    closePath(){
      this.path.push(['closePath']);
    }
    // Replay path commands into pooled Pixi Graphics and apply color/opacity/width.
    // Flush only at a style/order boundary. Separate moveTo contours preserve
    // the original paths while avoiding repeated Pixi style normalization.
    flushStroke(){
      if(!this.pendingStroke)return;
      this.graphic.stroke(this.pendingStroke);
      this.pendingStroke=null;
    }
    stroke(){
      const c=color(this.strokeStyle),alpha=c.alpha*this.globalAlpha;
      const width=this.lineWidth*Math.sqrt(Math.abs(this.matrix[0]*this.matrix[3]-this.matrix[1]*this.matrix[2]));
      const previous=this.pendingStroke;
      if(previous&&(previous.color!==c.color||previous.alpha!==alpha||previous.width!==width))this.flushStroke();
      const g=this.gfx();
      for(const [method,...args] of this.path)g[method](...args);
      if(!this.pendingStroke)this.pendingStroke={color:c.color,alpha,width};
    }
    // Build a transformed rectangle path reusable by fill and stroke.
    rectPath(x,y,w,h){
      this.beginPath();
      this.moveTo(x,y);
      this.lineTo(x+w,y);
      this.lineTo(x+w,y+h);
      this.lineTo(x,y+h);
      this.closePath();
    }
    // Construct and stroke a rectangle with the current style.
    strokeRect(x,y,w,h){
      this.rectPath(x,y,w,h);
      this.stroke();
    }
    // Fill a transformed rectangle using current color and opacity.
    fillRect(x,y,w,h){
      this.flushStroke();
      this.rectPath(x,y,w,h);
      const g=this.gfx();
      for(const [method,...args] of this.path)g[method](...args);
      const c=color(this.fillStyle);
      g.fill({
        color:c.color,alpha:c.alpha*this.globalAlpha
      }
      );
    }
    // Cache image sources and crop textures; reuse a sprite and apply its affine transform/opacity.
    drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh){
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
      const m=this.matrix,q=this.point(dx,dy);
      sprite.setFromMatrix(new P.Matrix(m[0]*dw/sw,m[1]*dw/sw,m[2]*dh/sh,m[3]*dh/sh,q[0],q[1]));
      this.app.stage.addChild(sprite);
      this.graphic=null;
    }
    // Reuse a Pixi Text object and set shared Checkbook font, position, anchor and opacity.
    fillText(value,x,y){
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
      text.style.fill=this.fillStyle;
      text.alpha=this.globalAlpha;
      text.anchor.set(this.textAlign==='center'?.5:this.textAlign==='right'?1:0,1);
      const q=this.point(x,y);
      text.position.set(...q);
      this.app.stage.addChild(text);
      this.graphic=null;
    }
    // Submit the assembled stage once; Pixi owns GPU work.
    end(){
      this.flushStroke();
      this.app.renderer.render({
        container:this.app.stage
      }
      );
    }
  }
  async function init(canvas){
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
  function context(canvas){
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
    context,end(){
      adapter?.end();
    }
    ,backend:'Starting PixiJS',get app(){
      return app;
    }
  }
  ;
}
)(window);
