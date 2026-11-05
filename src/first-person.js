/* November 1, 2026 — 0.16.22: fixed-time smoothed sway supersedes distance-driven phase, so running does not accelerate the cycle. First-person launch offsets now feed the actual shared projectile factory; flash coordinates remain image-relative. */
/* November 1, 2026: first-person artwork is a presentation layer; simulation aim, collision, third-person billboards and camera lens remain authoritative. */
(/* @function firstPerson.install1621 â€” Inputs: browser namespace. Registers a bounded image cache and character-linked presentation helpers; loads no images until a matching armed view is used. */ function(root){

  'use strict';

  const images=new Map(),states=new WeakMap();
  let imageBytes=0;

  const candy={
    character:'candy-armed',src:'img/weapons/first-person/candy/pistol/armed-test.png',columns:1,rows:1,fps:8,scale:1,muzzleX:.547,muzzleY:.483
  };

  /* @function firstPerson.validate1621 â€” Inputs: optional weapon presentation map keyed by character sprite profile. Returns detached bounded definitions. PNG data or packaged relative paths only; invalid dimensions, timing and anchors reject at authoring boundaries. */
  function validate(value){

    if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length>32)throw Error('First-person assignments require up to 32 character profiles.');

    const result={
    };
    let total=0;

    for(const [character,entry] of Object.entries(value)){

      if(!/^[\w-]{1,64}$/.test(character)||['__proto__','constructor','prototype'].includes(character)||!entry||typeof entry.src!=='string'||entry.src.length>12000000||!(/^(?:img|assets)\/[\w./ -]+\.(?:png|webp)$/i.test(entry.src)||/^data:image\/(?:png|webp);base64,[A-Za-z0-9+/]+=*$/.test(entry.src))||entry.src.includes('..'))throw Error('Choose a packaged image or imported PNG/WebP for each character.');

      total+=entry.src.length;
      if(total>24000000)throw Error('First-person images exceed 24 MB encoded per weapon.');

      const checked={
        src:entry.src
      };

      for(const [key,min,max,fallback] of [['columns',1,32,1],['rows',1,32,1],['fps',1,60,8],['scale',.25,2,1],['muzzleX',0,1,.547],['muzzleY',0,1,.483],['spawnForward',.05,2,.45],['spawnRight',-1,1,.08],['spawnUp',-1,1,-.15]]){

        const number=entry[key]??fallback;

        if(!Number.isFinite(number)||number<min||number>max||(['columns','rows'].includes(key)&&!Number.isInteger(number)))throw Error('Invalid first-person '+key);

        checked[key]=number;

      }

      result[character]=checked;

    }

    return result;

  }

  /* @function firstPerson.assignment1621 â€” Inputs: active player. Returns matching weapon/character presentation or Candy pistol default; null for unrelated characters/weapons or holstered actors. No authored mutation. */
  function assignment(player){

    if(player.holstered||!player.weapon)return null;

    const character=player.spriteProfile||'candy-armed';

    return player.weapon.firstPerson?.[character]||((character==='candy-armed'&&(player.weapon.profileId||player.weapon.id)==='handgun')?candy:null);

  }

  /* @function firstPerson.spriteScale1624 — Inputs: active game, sprite actor, camera and projected feet. Returns logical pixels/metre. First-person only uses horizontal camera-forward distance to prevent looking up/down from changing scale through feet-height depth. The image remains camera-facing with unchanged proportions/anchoring; third-person/isometric return the original scale exactly. No physical position, aim, collision or frame metadata changes. */
  function spriteScale(game,actor,cam,p){
    if(!game?.camera.firstPerson||game.authoring||cam.orthographic)return p.scale;
    const forward=(actor.x-cam.x)*Math.sin(cam.yaw)+(actor.y-cam.y)*Math.cos(cam.yaw);
    return forward>.13?360/forward:p.scale;
  }

  /* @function firstPerson.alignFacing1623 — Inputs: active game. Returns whether perspective player facing was aligned to camera yaw. Updates actor and movement facing together when leaving first-person, so stale pre-entry front-facing art cannot return. Fixed/isometric presentation is excluded; world position, camera, sprite tilt and weapon accuracy are untouched. */
  function alignFacing(game){
    if((game.sourceWorld.presentation?.mode==='isometric'&&game.swimming?.world!==game.sourceWorld)||game.sourceWorld.interior?.mode==='fixed')return false;
    const x=Math.sin(game.camera.yaw),y=Math.cos(game.camera.yaw);
    game.player.facingX=x;game.player.facingY=y;game.player.movementFacing={x,y};return true;
  }

  /* @function firstPerson.motion1622 — Inputs: transient state, elapsed seconds and travelled metres. Returns smooth pixel offsets. A fixed 0.85 Hz cadence is independent of run speed; speed controls only a bounded amplitude. Teleports contribute no motion, and exponential filters settle gently at rest without per-frame allocations outside the return record. */
  function motion(state,dt,distance){
    const moving=dt>0&&distance<1?Math.min(1,distance/dt/.7):0;
    state.amplitude+=(moving-state.amplitude)*(1-Math.exp(-dt*7));
    if(state.amplitude>.001)state.phase+=dt*Math.PI*2*.85;
    const blend=1-Math.exp(-dt*12);
    state.swayX=(state.swayX||0)+(Math.sin(state.phase)*7*state.amplitude-(state.swayX||0))*blend;
    state.swayY=(state.swayY||0)+(Math.cos(state.phase*2)*2*state.amplitude-(state.swayY||0))*blend;
    return {x:state.swayX,y:state.swayY};
  }

  /* @function firstPerson.muzzle1622 — Inputs: actor, live game and authoritative camera. Returns camera-relative world XYZ in metres for an assigned armed player, otherwise null. Forward follows pitch/yaw, right/up follow the orthonormal camera basis. Visual sway never changes aim or spawn. Existing ballistics sweeps from the body to this origin, preventing launch through nearby geometry. */
  function muzzle(actor,game,cam){
    if(actor!==game.player||!game.camera.firstPerson||cam.orthographic||game.sourceWorld.interior?.mode==='fixed')return null;
    const d=assignment(actor);if(!d)return null;
    const yaw=cam.yaw,pitch=cam.pitch||0,sy=Math.sin(yaw),cy=Math.cos(yaw),sp=Math.sin(pitch),cp=Math.cos(pitch);
    const forward=d.spawnForward??.45,right=d.spawnRight??.08,up=d.spawnUp??-.15;
    return {x:cam.x+sy*cp*forward+cy*right-sy*sp*up,y:cam.y+cy*cp*forward-sy*right-cy*sp*up,z:cam.z+sp*forward+cp*up};
  }

  /* @function firstPerson.draw1621 â€” Inputs: existing drawing adapter, live game and camera. Draws armed artwork fitted without stretching to 4:3/widescreen. Movement-derived sway and shot recovery are presentation-only; bounded cache and frame-time easing allocate no recurring images. Returns whether artwork was submitted. Decode failure leaves world usable. */
  function draw(ctx,game,cam){

    if(!game.camera.firstPerson||cam.orthographic||game.authoring||game.sourceWorld.interior?.mode==='fixed')return false;

    const definition=assignment(game.player);
    if(!definition)return false;

    let image=images.get(definition.src);

    if(!image){
      if(images.size>=32)return false;
      image=new Image();
      image.onload=/* @function firstPerson.decoded1621 — Inputs: completed image event unused. Accepts at most 64 MiB decoded viewmodel RGBA in total and the existing 16-megapixel/8192-side source limit; over-budget art is released and falls back without crashing gameplay. No per-frame image copies. */function(){
        const bytes=image.naturalWidth*image.naturalHeight*4;
        if(image.naturalWidth>8192||image.naturalHeight>8192||bytes>67108864||imageBytes+bytes>67108864){image.frontierRejected=true;image.src='';return;}
        imageBytes+=bytes;
      };
      image.src=definition.src;
      images.set(definition.src,image);
    }

    if(image.frontierRejected||!image.complete||!image.naturalWidth||image.naturalWidth%definition.columns||image.naturalHeight%definition.rows)return false;

    let state=states.get(game);
    if(!state){
      state={
        time:game.elapsed||0,x:game.player.x,y:game.player.y,phase:0,amplitude:0,shot:-1
      };
      states.set(game,state);
    }

    const now=game.elapsed||0,dt=Math.max(0,Math.min(.05,now-state.time)),distance=Math.hypot(game.player.x-state.x,game.player.y-state.y);

    // Supersedes distance-driven phase: running must not accelerate the sway cycle.
    const sway=motion(state,dt,distance);

    if(game.player.lastFlash167?.time!==undefined)state.shot=game.player.lastFlash167.time;

    const recovery=Math.max(.09,Math.min(.22,(game.player.weapon.cooldown||15)/60*.5));

    const recoil=Math.max(0,1-(now-state.shot)/recovery),width=game.viewWidth||640,height=480;

    const fw=image.naturalWidth/definition.columns,fh=image.naturalHeight/definition.rows,s=Math.min(width/fw,height/fh)*definition.scale;

    const x=(width-fw*s)/2+sway.x,y=height-fh*s+sway.y+recoil*5;

    const age=now-state.shot,frame=age>=0&&age<definition.columns*definition.rows/definition.fps?Math.floor(age*definition.fps):0;

    ctx.save();
    ctx.fogDepth=0;

    // Use the same cached normal owner and world lights as actors; passive owner exclusion is identity-based.
    root.FrontierAutomaticNormals?.image(image,'first-person:'+definition.src);

    const yaw=cam.yaw,pitch=cam.pitch||0,sy=Math.sin(yaw),cy=Math.cos(yaw),sp=Math.sin(pitch),cp=Math.cos(pitch),p=game.player;

    const center=[p.x+sy*.5,p.y+cy*.5,(p.z||0)+1.2];

    ctx.assetLightTint=root.FrontierLocalLighting?.sample(ctx.localLightFrame,...center,undefined,p.id||'player');

    ctx.liveNormalSurface={
      ownerId:p.id||'player',center,right:[cy,-sy,0],up:[-sy*sp,-cy*sp,cp],facing:[-sy*cp,-cy*cp,-sp],size:[1,.5625]
    };

    ctx.drawImage(image,(frame%definition.columns)*fw,Math.floor(frame/definition.columns)*fh,fw,fh,x,y,fw*s,fh*s);

    ctx.liveNormalSurface=null;
    ctx.assetLightTint=null;

    if(now-state.shot<.065){

      const mx=x+fw*s*definition.muzzleX,my=y+fh*s*definition.muzzleY,r=7*(1-(now-state.shot)/.065);

      ctx.fillStyle='#ffe5a1';
      ctx.beginPath();
      ctx.moveTo(mx-r,my);
      ctx.lineTo(mx,my-r);
      ctx.lineTo(mx+r,my);
      ctx.lineTo(mx,my+r);
      ctx.closePath();
      ctx.fill();

    }

    ctx.restore();
    state.time=now;
    state.x=game.player.x;
    state.y=game.player.y;

    game.firstPersonDebug={
      src:definition.src,sway:state.amplitude,recoil,frame
    };
    return true;

  }

  root.FrontierFirstPerson={
    validate,assignment,spriteScale,alignFacing,motion,muzzle,draw
  };

})(typeof window==='undefined'?globalThis:window);


