/* Map atmosphere, separate from future normal-mapped lighting. Authored values
 * survive world export; runtime overrides let weather/day-night systems animate
 * fog without rewriting the map. Distances use existing world units. */
(/* @function fog.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier fog. Uses: object freeze. */ function(root){
  'use strict';
  const defaults=Object.freeze({enabled:false,start:12,end:28,color:'#081323'});
  /* @function fog.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: number is finite; /^#[0-9a-f]{6}$/i test; error; f color to lower case. Returns: a record containing enabled, start, end, color. */ function validate(value={}){
    const f={...defaults,...value};
    if(typeof f.enabled!=='boolean'||!Number.isFinite(f.start)||!Number.isFinite(f.end)||f.start<0||f.end<=f.start||f.end>200||!/^#[0-9a-f]{6}$/i.test(f.color))throw Error('Fog needs start ≥ 0, end > start (maximum 200 world units), and a #RRGGBB color.');
    return {enabled:f.enabled,start:f.start,end:f.end,color:f.color.toLowerCase()};
  }
  /* @function fog.settings.3 — Handles settings within fog. Inputs: game. Returns: game fog override or game source world fog or defaults. */ function settings(game){return game.fogOverride||game.sourceWorld?.fog||defaults;}
  // Quantized opacity gives a bounded reusable GPU/palette cache (17 levels).
  /* @function fog.amount.4 — Quantized opacity gives a bounded reusable GPU/palette cache (17 levels). Inputs: f; depth. Returns: f enabled selects math round using math max using 0, math min using 1, depth minus f start divided by f end minus f start multiplied by 16 divided by 16 or 0. */ function amount(f,depth){return f.enabled?Math.round(Math.max(0,Math.min(1,(depth-f.start)/(f.end-f.start)))*16)/16:0;}
  /* @function fog.setRuntime.5 — Handles set runtime within fog. Inputs: game; value. Updates: game fog override. Uses: validate; settings. */ function setRuntime(game,value){game.fogOverride=validate({...settings(game),...value});}
  root.FrontierFog={defaults,validate,settings,amount,setRuntime,/* @function fog.clearRuntime.6 — Handles clear runtime within fog. Inputs: game. Updates: game fog override. */ clearRuntime(game){game.fogOverride=null;}};
})(typeof window==='undefined'?globalThis:window);

