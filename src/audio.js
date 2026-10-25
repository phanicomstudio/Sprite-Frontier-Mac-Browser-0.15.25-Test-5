/* MAINTAINER GUIDE
 * Shared Web Audio context and the original synth-footstep bridge. Audio resumes only after a user gesture. Context/gain ownership is shared with weapon and blood sounds; stop footsteps when replacing a playtest.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function(MF){
  const root=window;
'use strict'  ;
// Minimal plugin host. The actual supplied plugin is loaded unchanged.
  const registry=new Map();
  MF.plugins={
    register(plugin){
      registry.set(plugin.id,plugin);
    }
  }
  ;
// Own shared audio context and bridge synth footsteps into the native game services.
  function createAudio(){
    let context,master,sfx,owner=null;
    const audio={
      async unlock(){
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
      setVolume(value){
        if(master)master.gain.value=value;
        audio.music?.setVolume(value);
        root.PhanicomSE?.setVolume(value);
        root.PhanicomCombatCore?.setVolume(value);
      }
      ,
      playAt(name,x,y,options={
      }
      ){
        const names={
          reloadClick:'Click 1',reloadMetal:'Click 2',monsterHit:'',monsterDeath:''
        }
        ;
        return root.PhanicomSE?.play(names[name]||name,options.volume??1);
      }
      ,
      claimFootsteps(id){
        if(owner&&owner!==id)return false;
        owner=id;
        return true;
      }
      ,releaseFootsteps(id){
        if(owner===id)owner=null;
      }
      ,
      synthSweep(opts){
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
        osc.onended=()=>{
          osc.disconnect();
          gain.disconnect();
        }
        ;
        return true;
      }
      ,
      start(game,log){
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
          update(dt){
            plugin.hooks.update(ctx,dt);
          }
          ,stop(){
            plugin.hooks.stop(ctx);
          }
        }
        ;
      }
    }
    ;
    return audio;
  }
  MF.createFrontierAudio=createAudio;
}
)(window.MF);
