(function(root){
  'use strict';
  function vector(ctx,kind,px,py,w,h){ctx.save();ctx.translate(px-w/2,py-h);ctx.scale(w/48,h/80);const x=ctx;
    // Temporary vector silhouettes; final image assets replace this one factory.
    x.strokeStyle=kind==='monster'?'#ff4059':'#288cff';x.lineWidth=1.5;
    const line=points=>{x.beginPath();points.forEach((p,i)=>i?x.lineTo(...p):x.moveTo(...p));x.stroke();};
    if(kind==='tree'){line([[24,3],[9,25],[16,25],[3,48],[17,48],[17,77],[30,77],[30,48],[45,48],[32,25],[39,25],[24,3]]);line([[24,14],[24,48],[17,48]]);}
    else if(kind==='rock'){line([[3,76],[8,50],[24,41],[39,49],[46,76],[3,76]]);line([[8,50],[25,58],[39,49]]);line([[25,58],[30,76]]);}
    else if(kind==='ruin'){line([[5,77],[5,18],[14,9],[34,9],[43,18],[43,77],[33,77],[33,28],[28,22],[20,22],[15,28],[15,77],[5,77]]);line([[5,18],[15,28]]);line([[43,18],[33,28]]);for(let y=40;y<76;y+=13){line([[5,y],[15,y]]);line([[33,y],[43,y]]);}}
    else{line([[18,7],[30,7],[33,13],[30,23],[18,23],[15,13],[18,7]]);line([[18,26],[8,33],[6,52],[12,55],[16,38],[17,53],[13,77],[22,77],[24,57],[27,77],[36,77],[31,53],[32,38],[38,53],[44,50],[40,32],[30,26],[18,26]]);line([[17,53],[31,53]]);line([[20,16],[28,16]]);line([[40,42],[45,22]]);}
    ctx.restore();
  }

  function candy(ctx,e,p,cam){const sheet=root.FrontierCandy;if(!sheet?.image.complete||!sheet.image.naturalWidth)return false;const {row,column:col}=FrontierDirections.select(e,cam.yaw,sheet.direction),f=sheet.frames[row*3+col],scale=1.65*p.scale/310;ctx.drawImage(sheet.image,f.x,f.y,f.w,f.h,p.x-f.anchorX*scale,p.y-f.h*scale,f.w*scale,f.h*scale);return true;}
  function camera(game){const p=game.player,c=game.camera,d=c.firstPerson?0:c.distance;return{x:p.x-Math.sin(c.yaw)*d*Math.cos(c.pitch),y:p.y-Math.cos(c.yaw)*d*Math.cos(c.pitch),z:c.firstPerson?1.55:1.35+c.height-Math.sin(c.pitch)*d,yaw:c.yaw,pitch:c.pitch};}
  function depth(cam,x,y,z=0){return ((x-cam.x)*Math.sin(cam.yaw)+(y-cam.y)*Math.cos(cam.yaw))*Math.cos(cam.pitch)+(z-cam.z)*Math.sin(cam.pitch);}
  function project(cam,x,y,z=0){const dx=x-cam.x,dy=y-cam.y,forward=dx*Math.sin(cam.yaw)+dy*Math.cos(cam.yaw),d=depth(cam,x,y,z),side=dx*Math.cos(cam.yaw)-dy*Math.sin(cam.yaw),up=(z-cam.z)*Math.cos(cam.pitch)-forward*Math.sin(cam.pitch);if(d<.12)return null;return{x:320+side*360/d,y:200-up*360/d,scale:360/d,depth:d};}
  function draw(canvas,game){const ctx=canvas.getContext('2d'),cam=camera(game);ctx.imageSmoothingEnabled=false;const sin=Math.sin(cam.yaw),cos=Math.cos(cam.yaw);
    // Vector study: clear the textured placeholder and draw a world-space grid.
    ctx.fillStyle='#000';ctx.fillRect(0,0,640,400);
    ctx.strokeStyle='#11396a';ctx.lineWidth=1;
    function segment(ax,ay,bx,by){let a=project(cam,ax,ay),b=project(cam,bx,by);if(!a&&!b)return;if(!a||!b){const dx=bx-ax,dy=by-ay,da=depth(cam,ax,ay),db=depth(cam,bx,by),t=(.13-da)/(db-da);if(!a)a=project(cam,ax+dx*t,ay+dy*t);else b=project(cam,ax+dx*t,ay+dy*t);}if(a&&b){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}
    for(let i=0;i<=48;i+=2){segment(i,0,i,48);segment(0,i,48,i);}ctx.strokeStyle='#662432';segment(0,0,48,0);segment(48,0,48,48);segment(48,48,0,48);segment(0,48,0,0);
    const entities=game.maps.frontier.entities.map(e=>({...e,renderX:e.x,renderY:e.y}));if(!game.camera.firstPerson)entities.push({...game.player,kind:'player',height:1.65});
    const queue=entities.map(e=>({e,p:project(cam,e.x,e.y)})).filter(q=>q.p&&q.p.depth<45).sort((a,b)=>b.p.depth-a.p.depth);
    for(const {e,p} of queue){if(p.x< -250||p.x>890)continue;const h=Math.min(1800,(e.height||1.65)*p.scale),w=h*.6;ctx.globalAlpha=Math.max(.18,1-p.depth/55);ctx.save();if(e.kind==='player'&&candy(ctx,e,p,cam)){ctx.restore();ctx.globalAlpha=1;continue;}if(e.dead){ctx.translate(p.x,p.y);ctx.rotate(Math.PI/2);vector(ctx,e.kind,0,0,w*.6,h*.7);}else{const walk=e.kind==='player'&&game.moving?Math.sin(game.elapsed*15)*2:0;vector(ctx,e.kind,p.x,p.y+walk,w,h);if(e.kind==='monster'&&p.depth<12){ctx.strokeStyle='#ff4059';ctx.strokeRect(p.x-15,p.y-h-7,30,3);ctx.fillStyle='#ff4059';ctx.fillRect(p.x-15,p.y-h-7,30*e.hp/e.maxHp,3);}}ctx.restore();ctx.globalAlpha=1;}
    for(const s of game.shotEffects){const a=project(cam,s.from.x,s.from.y,.95),b=project(cam,s.to.x,s.to.y,.95);if(a&&b){ctx.strokeStyle=s.color;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}
    for(const s of game.particles){const p=project(cam,s.x,s.y,s.z/40);if(p){ctx.fillStyle=s.color;const size=Math.max(1,Math.min(7,s.size*p.scale/80));ctx.fillRect(p.x,p.y,size,size);}}
    if(game.muzzleFlashes.length){ctx.fillStyle='#ffe5a1';ctx.fillRect(319,202,4,4);}if(game.player.hp<=0){ctx.fillStyle='#0c131bcc';ctx.fillRect(0,0,640,400);ctx.fillStyle='#e0c691';ctx.font='22px Georgia';ctx.textAlign='center';ctx.fillText('The frontier claims another wanderer.',320,185);ctx.font='12px monospace';ctx.fillText('Generate a world to begin again.',320,217);ctx.textAlign='left';}
  }
  function map(canvas,world,game,editing){const c=canvas.getContext('2d'),s=canvas.width/world.size;c.fillStyle='#000';c.fillRect(0,0,240,240);c.fillStyle='#123356';c.fillRect(23*s,0,2*s,240);c.fillRect(0,23*s,240,2*s);for(const e of (editing?world.objects:game.maps.frontier.entities)){c.fillStyle=e.kind==='monster'?(e.dead?'#622332':'#ff4059'):'#288cff';c.fillRect(e.x*s-2,e.y*s-2,4,4);}const p=game.player;c.fillStyle='#b5d9ff';c.beginPath();c.arc(p.x*s,p.y*s,3,0,Math.PI*2);c.fill();c.strokeStyle='#b5d9ff';c.beginPath();c.moveTo(p.x*s,p.y*s);c.lineTo((p.x+Math.sin(game.camera.yaw)*2)*s,(p.y+Math.cos(game.camera.yaw)*2)*s);c.stroke();}
  root.FrontierRender={draw,map,camera,project};
})(window);
