/* MAINTAINER GUIDE
 * Native Phanicom_BloodSystem runtime integration. This host adapts supplied behavior into world XYZ; source-specific engine hooks are listed in PLUGIN-PORT.md.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* 3D world host for Phanicom_BloodSystem 1.0.1; particle equations in Core. */
(/* @function Phanicom_BloodSystem.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root phanicom blood. Uses: number. */ function(root){
'use strict'  ;
  const cfg=root.PhanicomBloodCore.cfg,settings=root.PhanicomPluginSettings.blood,combat=root.PhanicomPluginSettings.combat;
  const maxParticles=512,maxDecals=Math.min(500,Number(combat.MaxBloodDecals||80)),maxFragments=Math.min(200,Number(combat.MaxGibFragments||48));
  let current;
// Attach the blood API to a runtime and initialize transient particles/decals/fragments and timers.
  /* @function Phanicom_BloodSystem.attach.2 — Attach the blood API to a runtime and initialize transient particles/decals/fragments and timers. Inputs: game. Updates: current; game blood state; game blood fx; game blood decals; game gib fragments. */ function attach(game){
    current=game;
    game.bloodState??={
      actors:{
      }
      ,hidden:false
    }
    ;
    game.bloodFX=[];
    game.bloodDecals=[];
    game.gibFragments=[];
    game.bloodAccumulator=0;
    game.dripTimers=new Map();
    game.passiveDrips=[];
  }
// Resolve actor override, authored blood identity or default; normalize cream/synth and hex colors.
  /* @function Phanicom_BloodSystem.identity.3 — Resolve actor override, authored blood identity or default; normalize cream/synth and hex colors. Inputs: subject. Uses: /<CreamBleed>/i test; a list of "regular", "cream", "none" includes; /^#[\da-f]{3}([\da-f]{3})?$/i test; a list of spread element map using a callback join. Returns: "cream"; "regular". */ function identity(subject){
    const type=typeof subject==='object'?(current?.bloodState.actors[subject.id]||subject.blood||(/<CreamBleed>/i.test(subject.note||'')?'cream':'regular')):subject||'regular';
    if(type==='synth')return 'cream';
    if(type==='default')return 'regular';
    if(['regular','cream','none'].includes(type))return type;
    if(/^#[\da-f]{3}([\da-f]{3})?$/i.test(type))return type.length===4?'#'+[...type.slice(1)].map(/* @function Phanicom_BloodSystem.callback.4 — Returns c plus c. Inputs: c. Returns: c plus c. */ c=>c+c).join(''):type;
    throw Error('Invalid blood identity.');
  }
// Translate a blood identity into particle color, count, duration and enabled/profile flags.
  /* @function Phanicom_BloodSystem.resolve.5 — Translate a blood identity into particle color, count, duration and enabled/profile flags. Inputs: subject. Uses: identity; type starts with; number. Returns: a record containing type, enabled, profile, color, dripColor, particleCount, duration. */ function resolve(subject){
    const type=identity(subject),cream=type==='cream';
    return {
      type,enabled:type!=='none',profile:cream?'cream':'regular',color:cream?cfg.creamColor:type.startsWith('#')?type:cfg.regularColor,dripColor:cream?cfg.creamColor:type.startsWith('#')?type:settings.dripColor||'#FF0000',particleCount:Number(cream?settings.creamCount:settings.regularCount),duration:cream?cfg.creamDuration:cfg.regularDuration
    }
    ;
  }
// Emit bounded original-equation particles at world coordinates, freezing a local billboard basis for their motion.
  /* @function Phanicom_BloodSystem.sprayAt.6 — Emit bounded original-equation particles at world coordinates, freezing a local billboard basis for their motion. Inputs: x; y; assignment pattern. Updates: p origin; p right; p depth; p layer. Uses: resolve; number; frontier terrain height; game blood fx push. Returns: 0; 0. */ function sprayAt(x,y,options={
  }
  ){
    const game=options.game||current;
    if(!game)return 0;
    const blood=resolve(options.blood||'regular');
    if(!blood.enabled)return 0;
    const count=Math.max(0,Math.min(Number(options.count??blood.particleCount),maxParticles-game.bloodFX.length));
    const Particle=options.profile==='cream'||blood.profile==='cream'?PhanicomBloodCore.SynthBloodParticle:PhanicomBloodCore.BloodParticle;
    for(let i=0;
    i<count;
    i++){
      const p=Particle===PhanicomBloodCore.SynthBloodParticle?new Particle(0,0,options.color||blood.color,options.spraySize??cfg.spraySize,options.duration??blood.duration):new Particle(0,0,options.color||blood.color,options.duration??blood.duration);
      p.origin={
        x,y,z:options.z??FrontierTerrain.height(game.sourceWorld,x,y)+1.1
      }
      ;
      p.right={
        x:Math.cos(game.camera.yaw),y:-Math.sin(game.camera.yaw)
      }
      ;
      p.depth=(Math.random()-.5)*.003;
      p.layer=blood.profile;
      game.bloodFX.push(p);
    }
    return count;
  }
// Use actual impact position and victim identity to trigger a configured blood burst.
  /* @function Phanicom_BloodSystem.damage.7 — Use actual impact position and victim identity to trigger a configured blood burst. Inputs: game; actor; shot. Updates: current. Uses: resolve; spray at; number. Returns: without a result. */ function damage(game,actor,shot){
    current=game;
    if(settings.autoSpray==='false')return;
    const blood=resolve(actor);
    sprayAt(shot.position?.x??actor.x,shot.position?.y??actor.y,{
      game,blood:actor,count:Number(blood.profile==='cream'?settings.creamDamageCount:settings.damageCount),z:shot.position?.z??(actor.z||0)+1.1
    }
    );
  }
// Split the active sprite frame into bounded gib pieces with independent world motion.
  /* @function Phanicom_BloodSystem.fragments.8 — Split the active sprite frame into bounded gib pieces with independent world motion. Inputs: game; actor. Uses: frontier sprites sheet; frontier directions select; game gib fragments push. Returns: 0; count. */ function fragments(game,actor){
    const sheet=FrontierSprites.sheet(actor),selected=sheet&&FrontierDirections.select(actor,game.camera.yaw,sheet.direction);
    if(!selected||!sheet.image.complete)return 0;
    const f=sheet.frames[selected.row*sheet.columns+selected.column],right={
      x:Math.cos(game.camera.yaw),y:-Math.sin(game.camera.yaw)
    }
    ;
    let count=0;
    for(let y=0;
    y<4;
    y++)for(let x=0;
    x<4&&game.gibFragments.length<maxFragments;
    x++){
      const sx=f.x+Math.floor(x*f.w/4),sy=f.y+Math.floor(y*f.h/4),w=Math.floor((x+1)*f.w/4)-Math.floor(x*f.w/4),h=Math.floor((y+1)*f.h/4)-Math.floor(y*f.h/4),scale=1.65/sheet.referenceHeight,side=(sx-f.x+w/2-f.anchorX)*scale;
      game.gibFragments.push({
        image:sheet.image,sx,sy,w,h,x:actor.x+right.x*side,y:actor.y+right.y*side,z:(actor.z||0)+(f.y+f.h-sy-h/2)*scale,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,vz:1+Math.random()*3,scale,life:3,rotation:0,spin:(Math.random()-.5)*6
      }
      );
      count++;
    }
    return count;
  }
// Apply configured gib threshold/death mode, blood burst, persistent stain and player death delay.
  /* @function Phanicom_BloodSystem.death.9 — Apply configured gib threshold/death mode, blood burst, persistent stain and player death delay. Inputs: game; actor; shot; before. Updates: current; actor gibbed; game death until; actor death mode. Uses: resolve; number; fragments; spray at. */ function death(game,actor,shot,before){
    current=game;
    const blood=resolve(actor),mode=game.deathMode||combat.PlayerDeathMode||'damage';
    const metric=combat.PlayerGibMetric==='overkill'?Math.max(0,shot.damage-before):shot.damage;
    const wants=actor.id===game.player.id?(mode==='gib'||mode==='damage'&&metric>=Number(combat.PlayerGibThreshold||25)):actor.combat?.gib===true;
    if(wants)actor.gibbed=fragments(game,actor)>0;
    if(blood.enabled){
      sprayAt(actor.x,actor.y,{
        game,blood:actor,count:Number(combat.GibBloodBurst||18),z:(actor.z||0)+.8
      }
      );
      if(combat.PersistentBlood!=='false'&&maxDecals){
        game.bloodDecals.push({
          x:actor.x,y:actor.y,z:FrontierTerrain.height(game.sourceWorld,actor.x,actor.y)+.015,color:blood.color,size:.2+Math.random()*.2
        }
        );
        if(game.bloodDecals.length>maxDecals)game.bloodDecals.shift();
      }
    }
    if(actor.id===game.player.id){
      game.deathUntil=game.elapsed+Number(combat.PlayerDeathDelay||3);
      actor.deathMode=mode;
    }
  }
  let dripAudio;
  // Fixed-rate particle integration preserves source equations; transient arrays compact in place instead of allocating filters.
 /* @function Phanicom_BloodSystem.update.10 — Fixed-rate particle integration preserves source equations; transient arrays compact in place instead of allocating filters. Inputs: game; dt. Updates: current; game blood accumulator; game blood fx at update; game blood fx length; game passive drips length. Uses: p update; p is dead; /<NoBleedEffect>/i test; root frontier world activity settings. */ function update(game,dt){
    current=game;
    game.bloodAccumulator+=Math.min(.05,dt);
    while(game.bloodAccumulator>=1/60){
      game.bloodAccumulator-=1/60;
      let n=0;
      for(const p of game.bloodFX){
        p.update();
        if(!p.isDead())game.bloodFX[n++]=p;
      }
      game.bloodFX.length=n;
// Passive drops preserve the original source cadence and local motion:
// three 4px squares every 5..24 frames, falling 4px/frame for 60 frames.
// They follow their actor; sprays remain independent of passive visibility.
      const passiveAllowed=!game.bloodState.hidden&&!/<NoBleedEffect>/i.test(game.sourceWorld.note||'');
      const reach=root.FrontierWorld?.activitySettings(game.sourceWorld.activity).activeDistance||24;
      const actors=[game.player,...(root.FrontierActivity?root.FrontierActivity.query(game,game.player.x-reach,game.player.y-reach,game.player.x+reach,game.player.y+reach):[...game.maps.frontier.entities,...(game.sceneEvents||[])])];
      const eligible=new Map(actors.filter(/* @function Phanicom_BloodSystem.callback.11 — Returns the inverse of a dead and a hp is greater than 0 and a hp is at most number using settings hp threshold or 10 and resolve using a enabled. Inputs: a. Uses: number; resolve. Returns: the inverse of a dead and a hp is greater than 0 and a hp is at most number using settings hp threshold or 10 and resolve using a enabled. */ a=>!a.dead&&a.hp>0&&a.hp<=Number(settings.hpThreshold||10)&&resolve(a).enabled).map(/* @function Phanicom_BloodSystem.callback.12 — Returns a list of a id, a. Inputs: a. Returns: a list of a id, a. */ a=>[a.id,a]));
      if(!passiveAllowed)game.passiveDrips.length=0;
      else for(const actor of eligible.values()){
        const blood=resolve(actor),key=actor.id+':'+blood.type;
        let timer=game.dripTimers.get(key);
        if(timer===undefined)timer=5+Math.floor(Math.random()*20);
        if(--timer<=0){
          for(let i=0;
          i<3&&game.passiveDrips.length<256;
          i++)game.passiveDrips.push({
            actorId:actor.id,type:blood.type,x:-15+Math.random()*20,y:-93,life:60,opacity:255,color:blood.dripColor
          }
          );
          timer=5+Math.floor(Math.random()*20);
          if(Math.hypot(actor.x-game.player.x,actor.y-game.player.y)<=(root.FrontierParameters?.get(game.sourceWorld,'dripSoundRange')??3)&&settings.dripSound!=='false'&&(blood.type!=='cream'||settings.creamDripSound==='true')&&root.PhanicomSE.context){
            dripAudio??=new PhanicomBloodCore.ABSArcadeAudio();
            dripAudio.ctx=root.PhanicomSE.context;
            dripAudio.playSquelchyDrip();
          }
        }
        game.dripTimers.set(key,timer);
      }
      let drips=0;
      for(const d of game.passiveDrips){
        const a=eligible.get(d.actorId);
        if(!a||resolve(a).type!==d.type)continue;
        d.y+=4;
        d.life--;
        d.opacity-=3;
        if(d.life>0&&d.opacity>0)game.passiveDrips[drips++]=d;
      }
      game.passiveDrips.length=drips;
    }
    let n=0;
    for(const f of game.gibFragments){
      f.life-=dt;
      if(f.life<=0)continue;
      f.x+=f.vx*dt;
      f.y+=f.vy*dt;
      f.z=Math.max(FrontierTerrain.height(game.sourceWorld,f.x,f.y),f.z+f.vz*dt);
      f.vz-=9*dt;
      f.rotation+=f.spin*dt;
      game.gibFragments[n++]=f;
    }
    game.gibFragments.length=n;
  }
  // Project world effects into the active renderer. Passive drops follow their actor; sprays keep their spawn basis. Restore alpha afterward.
 /* @function Phanicom_BloodSystem.draw.13 — Project world effects into the active renderer. Passive drops follow their actor; sprays keep their spawn basis. Restore alpha afterward. Inputs: ctx; game; cam; project. Updates: ctx fill style; ctx global alpha. Uses: project; ctx fill rect; game runtime entities get; ctx save. */ function draw(ctx,game,cam,project){
    for(const d of game.bloodDecals||[]){
      const q=project(cam,d.x,d.y,d.z);
      if(q){
        ctx.fillStyle=d.color;
        ctx.fillRect(q.x-d.size*q.scale/2,q.y,d.size*q.scale,d.size*q.scale*.3);
      }
    }
// Native drops use the actor reference scale rather than absolute screen pixels.
    for(const d of game.passiveDrips||[]){
      const a=game.runtime.entities.get(d.actorId);
      if(!a)continue;
      const q=project(cam,a.x,a.y,a.z||0);
      if(q){
        const scale=(a.height||1.65)/310*q.scale;
        ctx.fillStyle=d.color;
        ctx.globalAlpha=d.opacity/255;
        ctx.fillRect(q.x+d.x*scale,q.y+d.y*scale,4*scale,4*scale);
      }
    }
    for(const p of game.bloodFX||[]){
      const q=project(cam,p.origin.x+p.right.x*p.x/190,p.origin.y+p.right.y*p.x/190+p.depth*p.life,p.origin.z-p.y/190);
      if(!q)continue;
      const size=Math.max(1,p.size*q.scale/190);
      ctx.globalAlpha=p.opacity;
      ctx.fillStyle=p.color;
      ctx.fillRect(q.x-size/2,q.y-size/2,size,size);
      if(p.glowing&&p.opacity>.2){
        const glow=(p.size+2*Math.sqrt(p.sprayMultiplier)+Math.sin(p.pulsePhase)*Math.sqrt(p.sprayMultiplier))*q.scale/190;
        ctx.globalAlpha=p.opacity*.3;
        ctx.fillRect(q.x-glow/2,q.y-glow/2,glow,glow);
      }
    }
    for(const f of game.gibFragments||[]){
      const q=project(cam,f.x,f.y,f.z);
      if(!q)continue;
      ctx.save();
      ctx.globalAlpha=Math.min(1,f.life);
      ctx.translate(q.x,q.y);
      ctx.rotate(f.rotation);
      ctx.drawImage(f.image,f.sx,f.sy,f.w,f.h,-f.w*f.scale*q.scale/2,-f.h*f.scale*q.scale/2,f.w*f.scale*q.scale,f.h*f.scale*q.scale);
      ctx.restore();
    }
    ctx.globalAlpha=1;
  }
  // Public host API. Identity persistence is distinct from transient sprays/drips; callers use IDs in the runtime registry.
 const API=root.PhanicomBlood={
    attach,resolve,sprayAt,damage,death,update,draw,/* @function Phanicom_BloodSystem.setActorType.14 — Handles set actor type within phanicom blood system. Inputs: id; type. Updates: current blood state actors at id. Uses: identity. */ setActorType(id,type){
      const normalized=identity(type);
      if(type==='default')delete current.bloodState.actors[id];
      else current.bloodState.actors[id]=normalized;
    }
    ,/* @function Phanicom_BloodSystem.setPlayerType.15 — Handles set player type within phanicom blood system. Inputs: type. Uses: api set actor type. */ setPlayerType(type){
      API.setActorType(current.player.id,type);
    }
    ,/* @function Phanicom_BloodSystem.setFollowerType.16 — Handles set follower type within phanicom blood system. Inputs: index; type. Uses: api set actor type. Returns: false; true. */ setFollowerType(index,type){
      const id=current.followers?.[index-1]?.id;
      if(!id)return false;
      API.setActorType(id,type);
      return true;
    }
    ,/* @function Phanicom_BloodSystem.getActorType.17 — Handles get actor type within phanicom blood system. Inputs: id. Uses: current runtime entities get; identity. Returns: actor selects identity using actor or null. */ getActorType(id){
      const actor=current.runtime.entities.get(id);
      return actor?identity(actor):null;
    }
    ,/* @function Phanicom_BloodSystem.resetBloodTypes.18 — Handles reset blood types within phanicom blood system. Inputs: no explicit arguments; uses enclosing module state. Updates: current blood state actors; current passive drips length. Uses: current drip timers clear. */ resetBloodTypes(){
      current.bloodState.actors={
      }
      ;
      current.passiveDrips.length=0;
      current.dripTimers.clear();
    }
    ,/* @function Phanicom_BloodSystem.hideBleeding.19 — Handles hide bleeding within phanicom blood system. Inputs: no explicit arguments; uses enclosing module state. Updates: current blood state hidden; current passive drips length. */ hideBleeding(){
      current.bloodState.hidden=true;
      current.passiveDrips.length=0;
    }
    ,/* @function Phanicom_BloodSystem.showBleeding.20 — Handles show bleeding within phanicom blood system. Inputs: no explicit arguments; uses enclosing module state. Updates: current blood state hidden. */ showBleeding(){
      current.bloodState.hidden=false;
    }
    ,/* @function Phanicom_BloodSystem.isBleedingVisible.21 — Handles is bleeding visible within phanicom blood system. Inputs: no explicit arguments; uses enclosing module state. Returns: the inverse of current blood state hidden. */ isBleedingVisible(){
      return !current.bloodState.hidden;
    }
    ,/* @function Phanicom_BloodSystem.clearSprays.22 — Handles clear sprays within phanicom blood system. Inputs: no explicit arguments; uses enclosing module state. Updates: current blood fx length. */ clearSprays(){
      current.bloodFX.length=0;
    }
    ,/* @function Phanicom_BloodSystem.sprayActor.23 — Handles spray actor within phanicom blood system. Inputs: id; assignment pattern. Uses: api spray event. Returns: api spray event using id, options. */ sprayActor(id,options={
    }
    ){
      return API.sprayEvent(id,options);
    }
    ,
// Pixel helper is explicitly billboard-local, because a perspective world has
// no unique MZ screen-pixel-to-world mapping. Actor-relative spray is preferred.
    /* @function Phanicom_BloodSystem.sprayPixels.24 — Handles spray pixels within phanicom blood system. Inputs: x; y; assignment pattern. Uses: spray at. Returns: spray at using current player x plus x divided by 190, current player y, a record containing z, copied fields. */ sprayPixels(x,y,options={
    }
    ){
      return sprayAt(current.player.x+x/190,current.player.y,{
        z:(current.player.z||0)-y/190,...options
      }
      );
    }
    ,/* @function Phanicom_BloodSystem.sprayCharacter.25 — Handles spray character within phanicom blood system. Inputs: actor; assignment pattern. Uses: spray at. Returns: spray at using actor x, actor y, a record containing blood, z, copied fields. */ sprayCharacter(actor,options={
    }
    ){
      return sprayAt(actor.x,actor.y,{
        blood:actor,z:(actor.z||0)+1,...options
      }
      );
    }
    ,/* @function Phanicom_BloodSystem.sprayEvent.26 — Handles spray event within phanicom blood system. Inputs: id; assignment pattern. Uses: current runtime entities get; api spray character. Returns: actor selects api spray character using actor, options or 0. */ sprayEvent(id,options={
    }
    ){
      const actor=current.runtime.entities.get(id);
      return actor?API.sprayCharacter(actor,options):0;
    }
    ,/* @function Phanicom_BloodSystem.exportState.27 — Handles export state within phanicom blood system. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using current blood state. */ exportState(){
      return structuredClone(current.bloodState);
    }
    ,/* @function Phanicom_BloodSystem.restoreState.28 — Handles restore state within phanicom blood system. Inputs: state. Updates: current blood state; current passive drips length. Uses: error; object values; identity; structured clone. */ restoreState(state){
      if(!state||typeof state.hidden!=='boolean'||typeof state.actors!=='object')throw Error('Invalid blood save.');
      for(const type of Object.values(state.actors))identity(type);
      current.bloodState=structuredClone(state);
      API.clearSprays();
      current.passiveDrips.length=0;
      current.dripTimers.clear();
    }
  }
  ;
}
)(window);
