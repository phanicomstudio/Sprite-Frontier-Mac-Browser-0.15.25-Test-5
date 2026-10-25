/* Door audio foundation, 2026-10-09. Transition playback must select once per
 * phase, rather than once per animation frame. Creak is an optional extra cue. */
(/* @function doorAudio.install — Inputs: root browser global. Exposes a small selector; returns nothing, allocates no audio voices and performs no playback. */ function(root){
  const pools={open:['Door Open 01','Door Open 02'],close:['Door Close 01','Door Close 02'],creak:['Door Creak 01']};
  /* @function doorAudio.select — Inputs: phase open/close/creak; setting with mode random/manual/none and optional name; random unit-interval generator. Returns a manifest name or null for silence/invalid input. Has no side effects beyond consuming one random value. Call once at a phase boundary; manual names must exist in the manifest. */
  function select(phase,setting={mode:'random'},random=Math.random){
    const pool=pools[phase];
    if(!pool||setting.mode==='none')return null;
    if(setting.mode==='manual')return (root.PhanicomAudioManifest||[]).some(/* @function doorAudio.manualExists — Inputs: manifest entry. Returns whether its name matches the requested manual sound; no side effects. */ entry=>entry.name===setting.name)?setting.name:null;
    if(setting.mode!=='random')return null;
    const value=random();
    return Number.isFinite(value)?pool[Math.min(pool.length-1,Math.max(0,Math.floor(value*pool.length)))]:null;
  }
  root.FrontierDoorAudio={select,pools};
})(window);
