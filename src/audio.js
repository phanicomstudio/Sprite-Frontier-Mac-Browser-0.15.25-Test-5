/* MAINTAINER GUIDE
 * Shared Web Audio context and the original synth-footstep bridge. Audio resumes only after a user gesture. Context/gain ownership is shared with weapon and blood sounds; stop footsteps when replacing a playtest.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(/* @function audio.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf plugins; mf create frontier audio. */ function(MF){
  const root=window;
'use strict'  ;
// Minimal plugin host. The actual supplied plugin is loaded unchanged.
  const registry=new Map();
  MF.plugins={
    /* @function audio.register.2 — Handles register within audio. Inputs: plugin. Uses: registry set. */ register(plugin){
      registry.set(plugin.id,plugin);
    }
  }
  ;
// Own shared audio context and bridge synth footsteps into the native game services.
  /* @function audio.createAudio.3 — Own shared audio context and bridge synth footsteps into the native game services. Inputs: no explicit arguments; uses enclosing module state. Uses: root phanicom se set unlock. Returns: audio. */ function createAudio(){
    let context,master,sfx,owner=null;
    const audio={
      /* @function audio.unlock.4 — Handles unlock within audio. Inputs: no explicit arguments; uses enclosing module state. Updates: context; master; sfx; master gain value; sfx gain value. Uses: context create gain; sfx connect; master connect; audio music unlock. Returns: without a result. */ async unlock(){
        if(!context){
          const AudioContext=window.AudioContext||window.webkitAudioContext;
          if(!AudioContext)return;
          context=new AudioContext();
          master=context.createGain();
          sfx=context.createGain();
          master.gain.value=.7;
          sfx.gain.value=.8;
          sfx.connect(master);
          master.connect(context.destination);
        }
        audio.music?.unlock();
        if(context.state==='suspended')await context.resume();
        root.PhanicomSE?.setContext(context,master);
      }
      ,
      /* @function audio.setVolume.5 — Handles set volume within audio. Inputs: value. Updates: master gain value. Uses: audio music set volume; root phanicom se set volume; root phanicom combat core set volume. */ setVolume(value){
        if(master)master.gain.value=value;
        audio.music?.setVolume(value);
        root.PhanicomSE?.setVolume(value);
        root.PhanicomCombatCore?.setVolume(value);
      }
      ,
      /* @function audio.playAt.6 — Handles play at within audio. Inputs: name; x; y; assignment pattern. Uses: root phanicom se play. Returns: chain. */ playAt(name,x,y,options={
      }
      ){
        const names={
          reloadClick:'Click 1',reloadMetal:'Click 2',monsterHit:'',monsterDeath:''
        }
        ;
        return root.PhanicomSE?.play(names[name]||name,options.volume??1);
      }
      ,
      /* @function audio.claimFootsteps.7 — Handles claim footsteps within audio. Inputs: id. Updates: owner. Returns: false; true. */ claimFootsteps(id){
        if(owner&&owner!==id)return false;
        owner=id;
        return true;
      }
      ,/* @function audio.releaseFootsteps.8 — Handles release footsteps within audio. Inputs: id. Updates: owner. */ releaseFootsteps(id){
        if(owner===id)owner=null;
      }
      ,
      /* @function audio.synthSweep.9 — Handles synth sweep within audio. Inputs: opts. Updates: osc type; osc onended. Uses: context create oscillator; context create gain; osc frequency set value at time; osc frequency exponential ramp to value at time. Returns: false; true. */ synthSweep(opts){
        if(!context||context.state!=='running')return false;
        const now=context.currentTime,duration=opts.duration??.15,attack=opts.attack??.01,osc=context.createOscillator(),gain=context.createGain();
        osc.type=opts.type||'triangle';
        osc.frequency.setValueAtTime(opts.startFrequency,now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(1,opts.endFrequency),now+(opts.sweepDuration??.1));
        gain.gain.setValueAtTime(.0001,now);
        gain.gain.linearRampToValueAtTime(Math.max(.0001,Math.min(5,opts.volume)),now+attack);
        gain.gain.exponentialRampToValueAtTime(.01,now+Math.min(duration-.0005,Math.max(attack+.0005,opts.sweepDuration??.1)));
        gain.gain.linearRampToValueAtTime(0,now+duration);
        osc.connect(gain);
        gain.connect(sfx);
        osc.start(now);
        osc.stop(now+duration);
        osc.onended=/* @function audio.onended.10 — Cleans up or advances audio state when playback finishes. Inputs: no explicit arguments; uses enclosing module state. Uses: osc disconnect; gain disconnect. */ ()=>{
          osc.disconnect();
          gain.disconnect();
        }
        ;
        return true;
      }
      ,
      /* @function audio.start.11 — Handles start within audio. Inputs: game; log. Uses: registry get; plugin hooks start. Returns: a record containing update, stop. */ start(game,log){
        const plugin=registry.get('phanicom.synth-footsteps');
        const ctx={
          game,runtime:game.runtime,config:{
            ...plugin.defaults
          }
          ,state:{
          }
          ,log
        }
        ;
        plugin.hooks.start(ctx);
        return{
          /* @function audio.update.12 — Advances this system using the current state and elapsed time. Inputs: dt. Uses: plugin hooks update. */ update(dt){
            plugin.hooks.update(ctx,dt);
          }
          ,/* @function audio.stop.13 — Handles stop within audio. Inputs: no explicit arguments; uses enclosing module state. Uses: plugin hooks stop. */ stop(){
            plugin.hooks.stop(ctx);
          }
        }
        ;
      }
    }
    ;
    root.PhanicomSE?.setUnlock(/* @function audio.callback.14 — Returns audio unlock using . Inputs: no explicit arguments; uses enclosing module state. Uses: audio unlock. Returns: audio unlock using . */ ()=>audio.unlock());
    return audio;
  }
  MF.createFrontierAudio=createAudio;
}
)(window.MF);

