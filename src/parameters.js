/* Editable project rules. World JSON stores a validated full snapshot; older
 * worlds inherit defaults. Keep this schema, editor fields and consuming modules
 * synchronized. Units are world units, seconds and radians unless labeled. */
(function(root){
  'use strict';
  const fields={
    dripSoundRange:{label:'Bleeding sound reach (world units; 3 tile-equivalents default)',value:3,min:0,max:30,step:.5},
    aggroRange:{label:'Enemy awareness radius (units)',value:8,min:0,max:48,step:.5},
    aggroLeash:{label:'Enemy pursuit leash (units)',value:12,min:0,max:60,step:.5},
    aggroCalm:{label:'Enemy calm delay (seconds)',value:3,min:0,max:30,step:.5},
    playerSpeed:{label:'Walk speed (units/second)',value:3.2,min:.1,max:20,step:.1},
    sprintMultiplier:{label:'Sprint multiplier',value:2,min:1,max:5,step:.1},
    jumpHeight:{label:'Jump apex height (units)',value:.96,min:.05,max:8,step:.05},
    gravity:{label:'Gravity (units/second²)',value:12,min:1,max:40,step:.5},
    stepHeight:{label:'Automatic step height (units)',value:.3,min:0,max:1.5,step:.05},
    aimMin:{label:'Aim down limit (degrees)',value:-.7*180/Math.PI,min:-60,max:0,step:1},
    aimMax:{label:'Aim up limit (degrees)',value:.6*180/Math.PI,min:0,max:60,step:1},
    mouseYaw:{label:'Mouse yaw sensitivity',value:.004,min:.0005,max:.02,step:.0005},
    mousePitch:{label:'Mouse pitch sensitivity',value:.003,min:.0005,max:.02,step:.0005},
    zoomMin:{label:'Closest camera distance',value:2.3,min:1.6,max:6,step:.1},
    zoomMax:{label:'Farthest camera distance',value:7,min:2,max:20,step:.5},
    interactionFeet:{label:'Default interaction reach (feet)',value:6,min:1,max:30,step:.5},
    ricochetChance:{label:'Scenery ricochet probability (0–1)',value:.2,min:0,max:1,step:.05}
  };
  const defaults=Object.fromEntries(Object.entries(fields).map(([key,f])=>[key,f.value]));
  // Sanitize the complete parameter snapshot before any rule changes become live.
  function validate(value={}){
    if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid global parameters.');
    const result={};for(const [key,f]of Object.entries(fields)){const v=value[key]??f.value;if(!Number.isFinite(v)||v<f.min||v>f.max)throw Error('Invalid '+f.label+'.');result[key]=v;}
    if(result.zoomMin>=result.zoomMax)throw Error('Closest zoom must be less than farthest zoom.');
    if(result.aimMin>=result.aimMax)throw Error('Aim down limit must be below aim up limit.');
    return result;
  }
  // Return an authored setting without allocating a merged object per frame.
  function get(world,key){return world?.parameters?.[key]??defaults[key];}
  root.FrontierParameters={fields,defaults,validate,get};
})(typeof window==='undefined'?globalThis:window);
