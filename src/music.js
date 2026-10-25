/* Soundtrack director: randomized non-repeating bags for exploration/combat.
 * Map exploration playlist overrides the global exploration playlist when
 * non-empty. Filenames live in audio/bgm/exploration or audio/bgm/combat, including extensions.
 * World state decides combat; music does not influence AI or event execution. */
(/* @function music.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier music. */ function(root){
  'use strict';
  const defaults={exploration:[],combat:[],mapExploration:[],volume:.6};
  /* @function music.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Updates: result at key. Uses: error; number is finite; array is array; list some. Returns: result. */ function validate(value=defaults){
    if(!value||typeof value!=='object')throw Error('Invalid music settings.');
    const result={volume:value.volume??.6};if(!Number.isFinite(result.volume)||result.volume<0||result.volume>1)throw Error('Music volume must be 0–1.');
    for(const key of ['exploration','combat','mapExploration']){
      const list=value[key]??[];if(!Array.isArray(list)||list.length>100)throw Error('At most 100 '+key+' tracks.');
      if(list.some(/* @function music.callback.3 — Returns typeof name does not equal "string" or name length is greater than 180 or the inverse of name trim using or name includes using ".." or /[\\/:]/ test using name or the inverse of /^.+\.(ogg|mp3|wav|m4a|webm)$/i test using name. Inputs: name. Uses: name trim; name includes; /[\\/:]/ test; /^.+\.(ogg|mp3|wav|m4a|webm)$/i test. Returns: typeof name does not equal "string" or name length is greater than 180 or the inverse of name trim using or name includes using ".." or /[\\/:]/ test using name or the inverse of /^.+\.(ogg|mp3|wav|m4a|webm)$/i test using name. */ name=>typeof name!=='string'||name.length>180||!name.trim()||name.includes('..')||/[\\/:]/.test(name)||!/^.+\.(ogg|mp3|wav|m4a|webm)$/i.test(name)))throw Error('Tracks must be filenames in audio/bgm, including extension.');
      result[key]=[...new Set(list.map(/* @function music.callback.4 — Returns name trim using . Inputs: name. Uses: name trim. Returns: name trim using . */ name=>name.trim()))];
    }return result;
  }
  // Bag shuffle plays every entry before refilling; avoid repeating the last
  // track at a bag boundary. Inject RNG for reproducible tests.
  /* @function music.playlist.5 — track at a bag boundary. Inject RNG for reproducible tests. Inputs: tracks; assignment pattern. Returns: a callback. */ function playlist(tracks,random=Math.random){
    let bag=[],last;
    return/* @function music.callback.6 — Provides the callback for the enclosing music operation. Inputs: no explicit arguments; uses enclosing module state. Updates: bag; array pattern; last. Uses: random; bag at; bag pop. Returns: null; assignment. */ ()=>{if(!tracks.length)return null;if(!bag.length){bag=[...tracks];for(let i=bag.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];}if(bag.length>1&&bag.at(-1)===last)[bag[0],bag[bag.length-1]]=[bag.at(-1),bag[0]];}
      return last=bag.pop();};
  }
  /* @function music.effective.7 — Handles effective within music. Inputs: settings; mode. Returns: mode equals "combat" selects settings combat or settings map exploration length selects settings map exploration or settings exploration. */ function effective(settings,mode){return mode==='combat'?settings.combat:settings.mapExploration.length?settings.mapExploration:settings.exploration;}
  /* @function music.create.8 — Builds a new instance and its public operations from the supplied configuration. Inputs: assignment pattern. Updates: audio preload; audio onended; audio onerror. Returns: a record containing unlock, setVolume, update, stop, mode, track. */ function create(clock=/* @function music.clock.9 — Returns date now using divided by 1000. Inputs: no explicit arguments; uses enclosing module state. Uses: date now. Returns: date now using divided by 1000. */ ()=>Date.now()/1000){
    const audio=new Audio();audio.preload='auto';let world,config,mode,signature='',next,unlocked=false,volume=.7,blocked=false,failed=new Set();
    // Fade the outgoing combat track for three seconds, then start a fresh
    // exploration track and bring it in over two seconds. One audio element
    // avoids keeping two decoded music tracks alive. Aggro cancels this envelope.
    let transition=null,gain=1;
    /* @function music.applyVolume.10 — Handles apply volume within music. Inputs: no explicit arguments; uses enclosing module state. Updates: audio volume. */ function applyVolume(){audio.volume=Math.max(0,Math.min(1,volume*(config?.volume??.6)*gain));}
    /* @function music.switchMode.11 — Handles switch mode within music. Inputs: value. Updates: mode; next. Uses: failed clear; audio pause; playlist; effective. */ function switchMode(value){mode=value;failed.clear();audio.pause();next=playlist(effective(config,mode));playNext();}
    /* @function music.fadeStep.12 — Handles fade step within music. Inputs: no explicit arguments; uses enclosing module state. Updates: gain; transition. Uses: clock; apply volume; switch mode. Returns: without a result. */ function fadeStep(){
      if(!transition)return;
      const t=clock()-transition.start;
      if(transition.phase==='out'){
        gain=Math.max(0,transition.from*(1-t/3));applyVolume();
        if(t>=3){gain=0;switchMode('exploration');transition={phase:'in',start:clock()};}
      }else{gain=Math.min(1,t/2);applyVolume();if(t>=2)transition=null;}
    }
    /* @function music.playNext.13 — Handles play next within music. Inputs: no explicit arguments; uses enclosing module state. Updates: track; audio src; audio current time. Uses: effective; next; failed has; audio pause. Returns: without a result; without a result. */ function playNext(){
      if(!next||!unlocked)return;let track;
      // Bound errors to the available track count, never an infinite retry loop.
      const tracks=effective(config,mode);for(let i=0;i<tracks.length;i++){const candidate=next();if(!failed.has(candidate)){track=candidate;break;}}
      if(!track){audio.pause();return;}
      audio.src='audio/bgm/'+mode+'/'+encodeURIComponent(track);audio.currentTime=0;applyVolume();
      audio.play().then(/* @function music.callback.14 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: blocked. Returns: assignment. */ ()=>blocked=false).catch(/* @function music.callback.15 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: blocked. Returns: assignment. */ ()=>blocked=true);
    }
    audio.onended=playNext;audio.onerror=/* @function music.onerror.16 — Handles onerror within music. Inputs: no explicit arguments; uses enclosing module state. Uses: decode uricomponent; audio src split using "/" pop; audio src split; failed add. */ ()=>{const file=decodeURIComponent(audio.src.split('/').pop());failed.add(file);playNext();};
    return {
      // Called only from a user input gesture via the shared audio unlock path.
      /* @function music.unlock.17 — Handles unlock within music. Inputs: no explicit arguments; uses enclosing module state. Updates: unlocked. Uses: play next. */ unlock(){unlocked=true;if(blocked||audio.paused)playNext();},
      /* @function music.setVolume.18 — Handles set volume within music. Inputs: value. Updates: volume. Uses: apply volume. */ setVolume(value){volume=value;if(config)applyVolume();},
      /* @function music.update.19 — Advances this system using the current state and elapsed time. Inputs: game. Updates: world; config; transition; gain. Uses: switch mode; clock; fade step. Returns: without a result. */ update(game){
        const settings=game.sourceWorld.music||defaults,newMode=game.inCombat?'combat':'exploration';
        // Authored settings are immutable between validated world replacements.
        // Reference comparison avoids stringifying every playlist each frame.
        const changed=world!==game.sourceWorld||config!==settings;
        if(changed){world=game.sourceWorld;config=settings;transition=null;gain=1;switchMode(newMode);return;}
        if(newMode==='combat'){
          if(mode!=='combat'||transition){transition=null;gain=1;switchMode('combat');}
        }else if(mode==='combat'&&!transition){transition={phase:'out',start:clock(),from:gain};}
        fadeStep();
      },
      /* @function music.stop.20 — Handles stop within music. Inputs: no explicit arguments; uses enclosing module state. Updates: transition; gain; next; blocked; world. Uses: audio pause; audio remove attribute; audio load. */ stop(){transition=null;gain=1;next=null;blocked=false;audio.pause();audio.removeAttribute('src');audio.load();world=null;signature='';},
      get mode/* @function music.mode.21 — Handles mode within music. Inputs: no explicit arguments; uses enclosing module state. Returns: mode. */ (){return mode;},get track/* @function music.track.22 — Handles track within music. Inputs: no explicit arguments; uses enclosing module state. Returns: audio src. */ (){return audio.src;}
    };
  }
  root.FrontierMusic={defaults,validate,playlist,effective,create};
})(typeof window==='undefined'?globalThis:window);

