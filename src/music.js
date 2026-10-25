/* Soundtrack director: randomized non-repeating bags for exploration/combat.
 * Map exploration playlist overrides the global exploration playlist when
 * non-empty. Filenames live in audio/bgm/exploration or audio/bgm/combat, including extensions.
 * World state decides combat; music does not influence AI or event execution. */
(function(root){
  'use strict';
  const defaults={exploration:[],combat:[],mapExploration:[],volume:.6};
  function validate(value=defaults){
    if(!value||typeof value!=='object')throw Error('Invalid music settings.');
    const result={volume:value.volume??.6};if(!Number.isFinite(result.volume)||result.volume<0||result.volume>1)throw Error('Music volume must be 0–1.');
    for(const key of ['exploration','combat','mapExploration']){
      const list=value[key]??[];if(!Array.isArray(list)||list.length>100)throw Error('At most 100 '+key+' tracks.');
      if(list.some(name=>typeof name!=='string'||name.length>180||!name.trim()||name.includes('..')||/[\\/:]/.test(name)||!/^.+\.(ogg|mp3|wav|m4a|webm)$/i.test(name)))throw Error('Tracks must be filenames in audio/bgm, including extension.');
      result[key]=[...new Set(list.map(name=>name.trim()))];
    }return result;
  }
  // Bag shuffle plays every entry before refilling; avoid repeating the last
  // track at a bag boundary. Inject RNG for reproducible tests.
  function playlist(tracks,random=Math.random){
    let bag=[],last;
    return()=>{if(!tracks.length)return null;if(!bag.length){bag=[...tracks];for(let i=bag.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];}if(bag.length>1&&bag.at(-1)===last)[bag[0],bag[bag.length-1]]=[bag.at(-1),bag[0]];}
      return last=bag.pop();};
  }
  function effective(settings,mode){return mode==='combat'?settings.combat:settings.mapExploration.length?settings.mapExploration:settings.exploration;}
  function create(){
    const audio=new Audio();audio.preload='auto';let world,config,mode,signature='',next,unlocked=false,volume=.7,blocked=false,failed=new Set();
    function playNext(){
      if(!next||!unlocked)return;let track;
      // Bound errors to the available track count, never an infinite retry loop.
      const tracks=effective(config,mode);for(let i=0;i<tracks.length;i++){const candidate=next();if(!failed.has(candidate)){track=candidate;break;}}
      if(!track){audio.pause();return;}
      audio.src='audio/bgm/'+mode+'/'+encodeURIComponent(track);audio.currentTime=0;audio.volume=volume*config.volume;
      audio.play().then(()=>blocked=false).catch(()=>blocked=true);
    }
    audio.onended=playNext;audio.onerror=()=>{const file=decodeURIComponent(audio.src.split('/').pop());failed.add(file);playNext();};
    return {
      // Called only from a user input gesture via the shared audio unlock path.
      unlock(){unlocked=true;if(blocked||audio.paused)playNext();},
      setVolume(value){volume=value;if(config)audio.volume=volume*config.volume;},
      update(game){
        const settings=game.sourceWorld.music||defaults,newMode=game.inCombat?'combat':'exploration';
        // Authored settings are immutable between validated world replacements.
        // Reference comparison avoids stringifying every playlist each frame.
        if(world===game.sourceWorld&&config===settings&&mode===newMode)return;
        world=game.sourceWorld;config=settings;mode=newMode;failed.clear();audio.pause();next=playlist(effective(config,mode));playNext();
      },
      stop(){next=null;blocked=false;audio.pause();audio.removeAttribute('src');audio.load();world=null;signature='';},
      get mode(){return mode;},get track(){return audio.src;}
    };
  }
  root.FrontierMusic={defaults,validate,playlist,effective,create};
})(typeof window==='undefined'?globalThis:window);
