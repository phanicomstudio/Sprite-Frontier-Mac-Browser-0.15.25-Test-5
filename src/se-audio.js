/* MAINTAINER GUIDE
 * Offline MZ-style audio/se playback using a bounded voice pool. Manifest filenames preserve spaces/case; URL encoding happens only at playback. Voice limit bounds repeated automatic-fire audio allocation.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(/* @function se-audio.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root phanicom se. Uses: root phanicom audio manifest or a list of map. */ function(root){
  const files=new Map((root.PhanicomAudioManifest||[]).map(/* @function se-audio.callback.2 — Returns a list of a name, a file. Inputs: a. Returns: a list of a name, a file. */ a=>[a.name,a.file])),pool=[],limit=24,frameNames=new Set();
  let volume=.7,context,output,previewToken=0,unlock;
// Resolve a manifest sound, reuse an available voice and apply global gain and pitch. Missing files return false.
  /* @function se-audio.play.3 — Resolve a manifest sound, reuse an available voice and apply global gain and pitch. Missing files return false. Inputs: name; assignment pattern; assignment pattern; assignment pattern; report; assignment pattern. Updates: voice; voice busy; voice group; audio onended; audio onerror. Uses: files get; error; pool find; pool push. Returns: false; false. */ function play(name,gain=1,pitch=1,pan=0,report,group='runtime'){
    const file=files.get(name);
    if(!file)return false;
    if(pan!==0&&!context?.createStereoPanner)throw Error('Stereo pan requires unlocked Web Audio. Click the playtest to enable audio.');
    let voice=pool.find(/* @function se-audio.callback.4 — Returns the inverse of v busy or v audio ended. Inputs: v. Returns: the inverse of v busy or v audio ended. */ v=>!v.busy||v.audio.ended);
    if(!voice){
      if(pool.length>=limit)return false;
      const audio=new Audio();
      voice={
        audio,busy:false,token:0
      }
      ;
      pool.push(voice);
    }
    const audio=voice.audio,token=++voice.token;voice.busy=true;voice.group=group;
    audio.onended=/* @function se-audio.onended.5 — Cleans up or advances audio state when playback finishes. Inputs: no explicit arguments; uses enclosing module state. Updates: voice busy. */ ()=>{if(voice.token===token)voice.busy=false;};
    audio.onerror=/* @function se-audio.onerror.6 — Handles onerror within se audio. Inputs: no explicit arguments; uses enclosing module state. Updates: voice busy. Uses: report. */ ()=>{if(voice.token===token){voice.busy=false;report?.('Audio resource could not be decoded: '+name);}};
    // Build the media-source/panner graph once per pooled voice. Existing combat
    // callers keep centered playback when reusing a previously panned voice.
    if(context&&output&&context.createStereoPanner){if(!voice.source){voice.source=context.createMediaElementSource(audio);voice.gain=context.createGain();voice.panner=context.createStereoPanner();voice.source.connect(voice.gain);voice.gain.connect(voice.panner);voice.panner.connect(output);}voice.gain.gain.value=Math.max(0,Math.min(1,gain));voice.panner.pan.value=Math.max(-1,Math.min(1,pan));}
    audio.src='audio/se/'+encodeURIComponent(file);
    audio.volume=voice.source?1:Math.max(0,Math.min(1,gain*volume));
    audio.playbackRate=Math.max(.5,Math.min(1.5,pitch));
    audio.preservesPitch=false;
    audio.play().catch(/* @function se-audio.callback.7 — Provides the callback for audio play using catch. Inputs: error. Updates: voice busy. Uses: report. */ error=>{if(voice.token===token){voice.busy=false;report?.('Sound playback failed: '+name+' ('+error.message+')');}});
    return true;
  }
  root.PhanicomSE={
    play,has:/* @function se-audio.has.8 — Returns files has using name. Inputs: name. Uses: files has. Returns: files has using name. */ name=>files.has(name),/* @function se-audio.beginFrame.9 — Handles begin frame within se audio. Inputs: no explicit arguments; uses enclosing module state. Uses: frame names clear. */ beginFrame(){frameNames.clear();},/* @function se-audio.playEvent.10 — Handles play event within se audio. Inputs: sound; report; assignment pattern. Uses: number is integer; error; files has; frame names has. Returns: true; true. */ playEvent(sound,report,group='runtime'){
      if(!sound||typeof sound.name!=='string'||sound.name.length>200||!Number.isInteger(sound.volume)||sound.volume<0||sound.volume>100||!Number.isInteger(sound.pitch)||sound.pitch<50||sound.pitch>150||!Number.isInteger(sound.pan)||sound.pan< -100||sound.pan>100)throw Error('Invalid sound effect parameters.');
      if(!sound.name)return true;
      if(!files.has(sound.name))throw Error('Missing sound effect: '+sound.name);
      if(group==='runtime'&&frameNames.has(sound.name))return true;
      if(!play(sound.name,sound.volume/100,sound.pitch/100,sound.pan/100,report,group))throw Error('Sound effect voice limit reached (24).');
      if(group==='runtime')frameNames.add(sound.name);return true;
    },/* @function se-audio.setUnlock.11 — Handles set unlock within se audio. Inputs: fn. Updates: unlock. */ setUnlock(fn){unlock=fn;},/* @function se-audio.previewEvent.12 — Handles preview event within se audio. Inputs: sound; report. Uses: this stop; unlock; context resume; this play event. Returns: this play event using sound, report, "preview". */ async previewEvent(sound,report){const token=++previewToken;this.stop('preview');await unlock?.();if(context?.state==='suspended')await context.resume();if(token===previewToken)return this.playEvent(sound,report,'preview');},/* @function se-audio.stopPreview.13 — Handles stop preview within se audio. Inputs: no explicit arguments; uses enclosing module state. Uses: this stop. */ stopPreview(){previewToken++;this.stop('preview');},/* @function se-audio.stop.14 — Handles stop within se audio. Inputs: group. Updates: voice busy; voice audio current time. Uses: frame names clear; voice audio pause. */ stop(group){if(!group||group==='runtime')frameNames.clear();for(const voice of pool){if(group&&voice.group!==group)continue;voice.token++;voice.busy=false;voice.audio.pause();voice.audio.currentTime=0;}},/* @function se-audio.setVolume.15 — Handles set volume within se audio. Inputs: v. Updates: volume. */ setVolume(v){
      volume=v;
    }
    ,/* @function se-audio.setContext.16 — Handles set context within se audio. Inputs: ctx; master. Updates: pool length; context; output. Uses: this stop; voice source disconnect; voice gain disconnect; voice panner disconnect. */ setContext(ctx,master){
      if(context&&context!==ctx){this.stop();for(const voice of pool){voice.source?.disconnect();voice.gain?.disconnect();voice.panner?.disconnect();}pool.length=0;}
      context=ctx;
      output=master;
      root.PhanicomCombatCore?.setAudioContext(ctx);
    }
    ,get context/* @function se-audio.context.17 — Handles context within se audio. Inputs: no explicit arguments; uses enclosing module state. Returns: context. */ (){
      return context;
    }
    ,get voices/* @function se-audio.voices.18 — Handles voices within se audio. Inputs: no explicit arguments; uses enclosing module state. Returns: pool length. */ (){
      return pool.length;
    }
    ,/* @function se-audio.debug.19 — Handles debug within se audio. Inputs: no explicit arguments; uses enclosing module state. Uses: pool filter using a callback map; pool filter. Returns: a record containing limit, voices, active. */ debug(){return {limit,voices:pool.length,active:pool.filter(/* @function se-audio.callback.20 — Returns v busy and the inverse of v audio ended. Inputs: v. Returns: v busy and the inverse of v audio ended. */ v=>v.busy&&!v.audio.ended).map(/* @function se-audio.callback.21 — Returns a record containing group, pitch, pan, volume. Inputs: v. Returns: a record containing group, pitch, pan, volume. */ v=>({group:v.group,pitch:v.audio.playbackRate,pan:v.panner?.pan.value??0,volume:v.gain?.gain.value??v.audio.volume}))};}
  }
  ;
}
)(window);

