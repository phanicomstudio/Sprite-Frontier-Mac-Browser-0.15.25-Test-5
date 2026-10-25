/* MAINTAINER GUIDE
 * Perspective projection and depth-sorted billboard drawing. Crosshair is a fixed logical screen point. World placement and aim share camera/project functions; changing projection must update muzzle inversion and ray construction too.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function(root){
'use strict'  ;
// Draw temporary vector silhouettes in local coordinates. Replace art without coupling visual shape to world collision.
  function vector(ctx,kind,px,py,w,h){
    ctx.save();
    ctx.translate(px-w/2,py-h);
    ctx.scale(w/48,h/80);
    const x=ctx;
// Temporary vector silhouettes; final image assets replace this one factory.
    x.strokeStyle=kind==='monster'?'#ff4059':'#288cff';
    x.lineWidth=1.5;
    const line=points=>{
      x.beginPath();
      points.forEach((p,i)=>i?x.lineTo(...p):x.moveTo(...p));
      x.stroke();
    }
    ;
    if(kind==='chest'||kind==='openChest'){
      line([[5,49],[43,49],[43,77],[5,77],[5,49]]);
      line([[5,49],[12,38],[38,38],[43,49]]);
      line([[21,49],[21,60],[27,60],[27,49]]);
      if(kind==='openChest')line([[12,38],[9,16],[37,16],[38,38]]);
      else line([[12,38],[38,38]]);
    }
    else if(kind==='marker'){
      line([[24,77],[3,58],[24,39],[45,58],[24,77]]);
      line([[24,52],[24,65]]);
    }
    else if(kind==='tree'){
      line([[24,3],[9,25],[16,25],[3,48],[17,48],[17,77],[30,77],[30,48],[45,48],[32,25],[39,25],[24,3]]);
      line([[24,14],[24,48],[17,48]]);
    }
    else if(kind==='rock'){
      line([[3,76],[8,50],[24,41],[39,49],[46,76],[3,76]]);
      line([[8,50],[25,58],[39,49]]);
      line([[25,58],[30,76]]);
    }
    else if(kind==='ruin'){
      line([[5,77],[5,18],[14,9],[34,9],[43,18],[43,77],[33,77],[33,28],[28,22],[20,22],[15,28],[15,77],[5,77]]);
      line([[5,18],[15,28]]);
      line([[43,18],[33,28]]);
      for(let y=40;
      y<76;
      y+=13){
        line([[5,y],[15,y]]);
        line([[33,y],[43,y]]);
      }
    }
    else{
      line([[18,7],[30,7],[33,13],[30,23],[18,23],[15,13],[18,7]]);
      line([[18,26],[8,33],[6,52],[12,55],[16,38],[17,53],[13,77],[22,77],[24,57],[27,77],[36,77],[31,53],[32,38],[38,53],[44,50],[40,32],[30,26],[18,26]]);
      line([[17,53],[31,53]]);
      line([[20,16],[28,16]]);
      line([[40,42],[45,22]]);
    }
    ctx.restore();
  }
// Resolve a sprite sheet/frame and scale from reference pixel height; anchor the frame at the projected feet.
  function candy(ctx,e,p,cam){
    const sheet=root.FrontierSprites?FrontierSprites.sheet(e):root.FrontierCandy;
    if(!sheet?.image.complete||!sheet.image.naturalWidth)return false;
    const {
      row,column:col
    }
    =FrontierDirections.select(e,cam.yaw,sheet.direction),f=sheet.frames[row*(sheet.columns||3)+col],scale=(e.height||1.65)*p.scale/(sheet.referenceHeight||310);
    ctx.drawImage(sheet.image,f.x,f.y,f.w,f.h,p.x-f.anchorX*scale,p.y-f.h*scale,f.w*scale,f.h*scale);
    return true;
  }
// Build the camera position and pitch-aware framing from player elevation, zoom and view width.
  function camera(game){
    const p=game.player,c=game.camera,cx=(game.viewWidth||640)/2;
    if(c.firstPerson)return{
      x:p.x,y:p.y,z:(p.z||0)+1.55,cx,yaw:c.yaw,pitch:c.pitch
    }
    ;
// Define framing in camera coordinates, avoiding pitch-dependent divisions.
// Depth stays fixed at every look angle: no runaway zoom or singularity.
    const rules=root.FrontierParameters,d=Math.max(rules?.get(game.sourceWorld,'zoomMin')??2.3,Math.min(rules?.get(game.sourceWorld,'zoomMax')??7,c.distance)),pitch=Math.max((rules?.get(game.sourceWorld,'aimMin')??(-.7*180/Math.PI))*Math.PI/180,Math.min((rules?.get(game.sourceWorld,'aimMax')??(.6*180/Math.PI))*Math.PI/180,c.pitch));
    const spriteHeight=1.65*360/d,feet=Math.min(420,114+spriteHeight);
    const up=-(feet-96)*d/360,neutral=-.12;
    const orbit=neutral+(pitch-neutral)*.75;
    const back=d*Math.cos(orbit)-up*Math.sin(orbit),lift=-d*Math.sin(orbit)-up*Math.cos(orbit);
    const playerDepth=back*Math.cos(pitch)-lift*Math.sin(pitch);
    const playerUp=-lift*Math.cos(pitch)-back*Math.sin(pitch);
    const framedFeet=Math.min(420,114+1.65*360/playerDepth);
    const cy=framedFeet+playerUp*360/playerDepth;
    return{
      x:p.x-Math.sin(c.yaw)*back,y:p.y-Math.cos(c.yaw)*back,z:(p.z||0)+lift,cx,cy,yaw:c.yaw,pitch
    }
    ;
  }
// Compute forward distance in the tilted camera basis; used for clipping and sorting.
  function depth(cam,x,y,z=0){
    return ((x-cam.x)*Math.sin(cam.yaw)+(y-cam.y)*Math.cos(cam.yaw))*Math.cos(cam.pitch)+(z-cam.z)*Math.sin(cam.pitch);
  }
// Project world XYZ into logical screen coordinates and scale; reject geometry behind the near plane.
  function project(cam,x,y,z=0){
    const dx=x-cam.x,dy=y-cam.y,forward=dx*Math.sin(cam.yaw)+dy*Math.cos(cam.yaw),d=depth(cam,x,y,z),side=dx*Math.cos(cam.yaw)-dy*Math.sin(cam.yaw),up=(z-cam.z)*Math.cos(cam.pitch)-forward*Math.sin(cam.pitch);
    if(d<.12)return null;
    return{
      x:(cam.cx||320)+side*360/d,y:(cam.cy??96)-up*360/d,scale:360/d,depth:d
    }
    ;
  }
  const grids=new WeakMap();
  // Painter-order scene: sky → terrain grid → sorted sprites/props → editor overlays → travel/effects → death overlay.
  function draw(canvas,game){
    game.viewWidth=canvas.width;
    const ctx=root.FrontierPixi?root.FrontierPixi.context(canvas):canvas.getContext('2d');
    if(!ctx)return;
    const cam=camera(game);
    ctx.imageSmoothingEnabled=false;
    const sin=Math.sin(cam.yaw),cos=Math.cos(cam.yaw);
// Vector study: clear the textured placeholder and draw a world-space grid.
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,canvas.width,480);
    FrontierSky.draw(ctx,game,cam,project);
    ctx.strokeStyle='#11396a';
    ctx.lineWidth=1;
    let heights=grids.get(game.sourceWorld);
    if(!heights){
      heights=new Map();
      for(let x=0;
      x<=48;
      x+=2)for(let y=0;
      y<=48;
      y+=2)heights.set(x+':'+y,FrontierTerrain.height(game.sourceWorld,x,y));
      grids.set(game.sourceWorld,heights);
    }
// Clip a terrain grid edge at the near plane before projecting to avoid inverted giant lines.
    function segment(ax,ay,bx,by){
      const az=heights.get(ax+':'+ay),bz=heights.get(bx+':'+by);
      let a=project(cam,ax,ay,az),b=project(cam,bx,by,bz);
      if(!a&&!b)return;
      if(!a||!b){
        const da=depth(cam,ax,ay,az),db=depth(cam,bx,by,bz),t=(.13-da)/(db-da),q=project(cam,ax+(bx-ax)*t,ay+(by-ay)*t,az+(bz-az)*t);
        if(!a)a=q;
        else b=q;
      }
      if(a&&b){
        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.stroke();
      }
    }
    for(let i=0;
    i<=48;
    i+=2)for(let j=0;
    j<48;
    j+=2){
      segment(i,j,i,j+2);
      segment(j,i,j+2,i);
    }
    // Authoring ghost is a draw-only copy: dragging cannot change saved data
    // until the undoable pointer-up transaction commits.
    let entities=[...game.maps.frontier.entities,...(game.sceneEvents||[])];
    if(game.authoring&&game.dragGhost)entities=entities.map(e=>game.dragGhost.id===e.id?{...e,x:game.dragGhost.x,y:game.dragGhost.y,z:FrontierTerrain.height(game.sourceWorld,game.dragGhost.x,game.dragGhost.y)+(e.elevation||0)*.3}:e);
    if(!game.camera.firstPerson)entities.push({
      ...game.player,kind:'player',height:1.65
    }
    );
    // Sort far to near for billboard occlusion. Player opacity stays 1; this is not a depth-buffer renderer.
    const layer=e=>e.priority==='below'?-1:e.priority==='above'?1:0;
    const queue=entities.map(e=>({
      e,p:project(cam,e.x,e.y,e.z||0)
    }
    )).filter(q=>q.p&&q.p.depth<45).sort((a,b)=>layer(a.e)-layer(b.e)||b.p.depth-a.p.depth);
    for(const {
      e,p
    }
    of queue){
      if(p.x< -250||p.x>(game.viewWidth||640)+250)continue;
      const h=Math.min(1800,(e.height||1.65)*p.scale),w=h*.6;
      ctx.globalAlpha=e.kind==='player'?1:Math.max(.18,1-p.depth/55);
      ctx.save();
      if(e.gibbed){
        ctx.restore();
        ctx.globalAlpha=1;
        continue;
      }
      if((e.kind==='player'||e.spriteProfile)&&candy(ctx,e,p,cam)){
        ctx.restore();
        ctx.globalAlpha=1;
        continue;
      }
      if(e.dead){
        ctx.translate(p.x,p.y);
        ctx.rotate(Math.PI/2);
        vector(ctx,e.kind,0,0,w*.6,h*.7);
      }
      else{
        const walk=e.kind==='player'&&game.moving?Math.sin(game.elapsed*15)*2:0;
        vector(ctx,e.kind,p.x,p.y+walk,w,h);
        if(e.kind==='monster'&&p.depth<12){
          ctx.strokeStyle='#ff4059';
          ctx.strokeRect(p.x-15,p.y-h-7,30,3);
          ctx.fillStyle='#ff4059';
          ctx.fillRect(p.x-15,p.y-h-7,30*e.hp/e.maxHp,3);
        }
      }
      ctx.restore();
      ctx.globalAlpha=1;
    }
    if(!game.authoring){
      for(const e of game.sceneEvents||[]){
        const p=project(cam,e.x,e.y,e.z||0);
        if(e.isAmmo&&p&&p.depth<14){
          ctx.fillStyle='#8fbdff';
          ctx.font='11px monospace';
          ctx.fillText(e.kind==='openChest'?'EMPTY AMMO':'AMMO · 24',p.x-25,p.y-e.height*p.scale-5);
        }
      }
    }
    if(game.authoring){
      for(const e of game.sceneEvents||[]){
        const p=project(cam,e.x,e.y);
        if(!p||p.depth>35)continue;
        ctx.fillStyle='#9fceff';
        ctx.font='10px monospace';
        ctx.fillText(e.name,p.x-20,p.y-e.height*p.scale-10);
      }
      const selected=entities.find(e=>e.id===game.selectedId);
      if(selected){
        const p=project(cam,selected.x,selected.y,selected.z||0);
        if(p){
          const h=selected.height*p.scale;
          ctx.strokeStyle='#ff4059';
          ctx.lineWidth=1;
          ctx.strokeRect(p.x-h*.3-3,p.y-h-3,h*.6+6,h+6);
          ctx.font='10px monospace';
          ctx.fillStyle='#ff7085';
          ctx.fillText(selected.x.toFixed(2)+', '+selected.y.toFixed(2),p.x+8,p.y-3);
        }
        const radius=selected.range||selected.radius||.3;
        ctx.strokeStyle='#662d52';
        ctx.beginPath();
        let began=false;
        for(let i=0;
        i<=48;
        i++){
          const a=i*Math.PI*2/48,q=project(cam,selected.x+Math.cos(a)*radius,selected.y+Math.sin(a)*radius,FrontierTerrain.height(game.sourceWorld,selected.x+Math.cos(a)*radius,selected.y+Math.sin(a)*radius)+.02);
          if(q){
            if(!began){
              ctx.moveTo(q.x,q.y);
              began=true;
            }
            else ctx.lineTo(q.x,q.y);
          }
          else began=false;
        }
        ctx.stroke();
      }
      if(game.dragGhost){
        const p=project(cam,game.dragGhost.x,game.dragGhost.y,FrontierTerrain.height(game.sourceWorld,game.dragGhost.x,game.dragGhost.y));
        if(p){
          ctx.strokeStyle='#ff4059';
          ctx.beginPath();
          ctx.moveTo(p.x-8,p.y);
          ctx.lineTo(p.x+8,p.y);
          ctx.moveTo(p.x,p.y-8);
          ctx.lineTo(p.x,p.y+8);
          ctx.stroke();
        }
      }
    }
    for(const s of game.shotEffects){
      const a=project(cam,s.from.x,s.from.y,s.from.z??.95),b=project(cam,s.to.x,s.to.y,s.to.z??.95);
      if(a&&b){
        ctx.strokeStyle=s.color;
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.stroke();
      }
    }
    for(const s of game.particles){
      const p=project(cam,s.x,s.y,s.z/40+FrontierTerrain.height(game.sourceWorld,s.x,s.y));
      if(p){
        ctx.fillStyle=s.color;
        const size=Math.max(1,Math.min(7,s.size*p.scale/80));
        ctx.fillRect(p.x,p.y,size,size);
      }
    }
    for(const flash of game.muzzleFlashes){
      const p=project(cam,flash.x,flash.y,flash.z);
      if(p){
        ctx.fillStyle=flash.color||'#ffe5a1';
        const s=Math.max(2,p.scale*.045);
        ctx.fillRect(p.x-s/2,p.y-s/2,s,s);
      }
    }
    root.PhanicomBlood?.draw(ctx,game,cam,project);
    if(game.player.hp<=0&&game.elapsed>=(game.deathUntil||0)){
      ctx.fillStyle='#0c131bcc';
      ctx.fillRect(0,0,canvas.width,480);
      ctx.fillStyle='#e0c691';
      ctx.font='22px Georgia';
      ctx.textAlign='center';
      ctx.fillText('The frontier claims another wanderer.',canvas.width/2,185);
      ctx.font='12px monospace';
      ctx.fillText('Generate a world to begin again.',canvas.width/2,217);
      ctx.textAlign='left';
    }
    root.FrontierPixi?.end();
  }
// Draw the overview map independently of the perspective renderer; its coordinates are world X/Y.
  function map(canvas,world,game,editing){
    const c=canvas.getContext('2d'),s=canvas.width/world.size;
    c.fillStyle='#000';
    c.fillRect(0,0,240,240);
    c.fillStyle='#123356';
    c.fillRect(23*s,0,2*s,240);
    c.fillRect(0,23*s,240,2*s);
    for(const e of [...(editing?world.objects:game.maps.frontier.entities),...(game.sceneEvents||[])]){
      c.fillStyle=e.kind==='monster'?(e.dead?'#622332':'#ff4059'):'#288cff';
      c.fillRect(e.x*s-2,e.y*s-2,4,4);
    }
    const p=game.player;
    c.fillStyle='#b5d9ff';
    c.beginPath();
    c.arc(p.x*s,p.y*s,3,0,Math.PI*2);
    c.fill();
    c.strokeStyle='#b5d9ff';
    c.beginPath();
    c.moveTo(p.x*s,p.y*s);
    c.lineTo((p.x+Math.sin(game.camera.yaw)*2)*s,(p.y+Math.cos(game.camera.yaw)*2)*s);
    c.stroke();
  }
// Raymarch and refine the terrain intersection for editor placement, preserving raised terrain.
  function groundPoint(game,sx,sy){
    const cam=camera(game),side=(sx-(cam.cx||320))/360,up=((cam.cy??96)-sy)/360,forward=Math.cos(cam.pitch)-up*Math.sin(cam.pitch),z=Math.sin(cam.pitch)+up*Math.cos(cam.pitch),ray={
      x:forward*Math.sin(cam.yaw)+side*Math.cos(cam.yaw),y:forward*Math.cos(cam.yaw)-side*Math.sin(cam.yaw),z
    }
    ;
    let previous=0;
    const at=t=>({
      x:cam.x+ray.x*t,y:cam.y+ray.y*t,z:cam.z+ray.z*t
    }
    );
    for(let t=.15;
    t<=80;
    t+=.15){
      const p=at(t);
      if(p.z<=FrontierTerrain.height(game.sourceWorld,p.x,p.y)){
        let lo=previous,hi=t;
        for(let i=0;
        i<16;
        i++){
          const mid=(lo+hi)/2,q=at(mid);
          if(q.z>FrontierTerrain.height(game.sourceWorld,q.x,q.y))lo=mid;
          else hi=mid;
        }
        const q=at(hi);
        return{
          x:q.x,y:q.y
        }
        ;
      }
      previous=t;
    }
    return null;
  }
// Choose the nearest projected entity containing the pointer, using one pass instead of sorting all candidates.
  function pick(game,sx,sy,eventsOnly=false){
    const cam=camera(game);
    let nearest=null,best=45;
    for(const e of eventsOnly?game.sceneEvents||[]:[...game.maps.frontier.entities,...(game.sceneEvents||[])]){
      if(e.dead)continue;
      const p=project(cam,e.x,e.y,e.z||0);
      if(p&&p.depth<best&&Math.abs(sx-p.x)<e.height*p.scale*.3+5&&sy>=p.y-e.height*p.scale-5&&sy<=p.y+5){
        best=p.depth;
        nearest=e;
      }
    }
    return nearest;
  }
  root.FrontierRender={
    draw,map,camera,project,groundPoint,pick
  }
  ;
}
)(window);
