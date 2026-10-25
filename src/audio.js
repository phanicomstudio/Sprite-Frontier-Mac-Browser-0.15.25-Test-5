(function(MF){
  'use strict';
  // Minimal plugin host. The actual supplied plugin is loaded unchanged.
  const registry=new Map();MF.plugins={register(plugin){registry.set(plugin.id,plugin);}};
  function createAudio(){let context,master,sfx,owner=null;const audio={
    async unlock(){if(!context){const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return;context=new AudioContext();master=context.createGain();sfx=context.createGain();master.gain.value=.7;sfx.gain.value=.8;sfx.connect(master);master.connect(context.destination);}if(context.state==='suspended')await context.resume();},
    setVolume(value){if(master)master.gain.value=value;},
    playAt(){ /* Combat samples are deferred; synth footsteps are the initial sound. */ },
    claimFootsteps(id){if(owner&&owner!==id)return false;owner=id;return true;},releaseFootsteps(id){if(owner===id)owner=null;},
    synthSweep(opts){if(!context||context.state!=='running')return false;const now=context.currentTime,duration=opts.duration??.15,attack=opts.attack??.01,osc=context.createOscillator(),gain=context.createGain();osc.type=opts.type||'triangle';osc.frequency.setValueAtTime(opts.startFrequency,now);osc.frequency.exponentialRampToValueAtTime(Math.max(1,opts.endFrequency),now+(opts.sweepDuration??.1));gain.gain.setValueAtTime(.0001,now);gain.gain.linearRampToValueAtTime(Math.max(.0001,Math.min(5,opts.volume)),now+attack);gain.gain.exponentialRampToValueAtTime(.01,now+Math.min(duration-.0005,Math.max(attack+.0005,opts.sweepDuration??.1)));gain.gain.linearRampToValueAtTime(0,now+duration);osc.connect(gain);gain.connect(sfx);osc.start(now);osc.stop(now+duration);osc.onended=()=>{osc.disconnect();gain.disconnect();};return true;},
    start(game,log){const plugin=registry.get('phanicom.synth-footsteps');const ctx={game,runtime:game.runtime,config:{...plugin.defaults},state:{},log};plugin.hooks.start(ctx);return{update(dt){plugin.hooks.update(ctx,dt);},stop(){plugin.hooks.stop(ctx);}};}
  };return audio;}
  MF.createFrontierAudio=createAudio;
})(window.MF);
