/* MAINTAINER GUIDE
 * Offline MZ-style audio/se playback using a bounded voice pool. Manifest filenames preserve spaces/case; URL encoding happens only at playback. Voice limit bounds repeated automatic-fire audio allocation.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function(root){
  const files=new Map((root.PhanicomAudioManifest||[]).map(a=>[a.name,a.file])),pool=[],limit=24;
  let volume=.7,context,output;
// Resolve a manifest sound, reuse an available voice and apply global gain and pitch. Missing files return false.
  function play(name,gain=1,pitch=1){
    const file=files.get(name);
    if(!file)return false;
    let voice=pool.find(v=>v.audio.paused||v.audio.ended);
    if(!voice){
      if(pool.length>=limit)return false;
      const audio=new Audio();
      voice={
        audio
      }
      ;
      pool.push(voice);
    }
    const audio=voice.audio;
    audio.src='audio/se/'+encodeURIComponent(file);
    audio.volume=Math.max(0,Math.min(1,gain*volume));
    audio.playbackRate=Math.max(.5,Math.min(1.5,pitch));
    audio.preservesPitch=false;
    audio.play().catch(()=>{
    }
    );
    return true;
  }
  root.PhanicomSE={
    play,has:name=>files.has(name),setVolume(v){
      volume=v;
    }
    ,setContext(ctx,master){
      context=ctx;
      output=master;
      root.PhanicomCombatCore?.setAudioContext(ctx);
    }
    ,get context(){
      return context;
    }
    ,get voices(){
      return pool.length;
    }
  }
  ;
}
)(window);
