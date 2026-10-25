/* Reusable vertical movement rules. hover follows ground clearance; flight uses
 * absolute altitude. Q descends and E ascends in flight; normal E remains jump.
 * Any actor can call update with its own authored profile and input axis. */
(/* @function flight.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier flight. */ function(root){
  'use strict';const defaults={
    mode:'ground',height:2,ascent:2,descent:2,acceleration:4,min:0,max:30
  }
  ;
  // Authoring ranges keep velocities and altitude finite.
  /* @function flight.validate.2 — Authoring ranges keep velocities and altitude finite. Inputs: assignment pattern. Uses: a list of "ground", "hover", "flight" includes; object keys using defaults filter using a callback some; object keys using defaults filter; object keys. Returns: v. */ function validate(value={
  }
  ){
    const v={
      ...defaults,...value
    }
    ;if(!['ground','hover','flight'].includes(v.mode)||Object.keys(defaults).filter(/* @function flight.callback.3 — Returns k does not equal "mode". Inputs: k. Returns: k does not equal "mode". */ k=>k!=='mode').some(/* @function flight.callback.4 — Returns the inverse of number is finite using v at k. Inputs: k. Uses: number is finite. Returns: the inverse of number is finite using v at k. */ k=>!Number.isFinite(v[k]))||v.height<0||v.height>30||v.ascent<=0||v.ascent>20||v.descent<=0||v.descent>20||v.acceleration<=0||v.acceleration>50||v.min< -30||v.max>100||v.max<=v.min)throw Error('Invalid flight profile.');return v;
  }
  // Return false for ground physics; otherwise own the actor vertical position.
  /* @function flight.update.5 — Return false for ground physics; otherwise own the actor vertical position. Inputs: actor; world; dt; assignment pattern; assignment pattern. Updates: actor flight velocity; actor z; actor grounded; actor vertical velocity; actor ground z. Uses: root frontier terrain height. Returns: false; true. */ function update(actor,world,dt,axis=0,profile=world.flight||defaults){
    if(profile.mode==='ground')return false;const floor=root.FrontierTerrain.height(world,actor.x,actor.y);const speed=axis*(axis<0?profile.descent:profile.ascent);actor.flightVelocity=(actor.flightVelocity||0)+Math.max(-profile.acceleration*dt,Math.min(profile.acceleration*dt,speed-(actor.flightVelocity||0)));const target=profile.mode==='hover'?Math.max(floor,Math.min(profile.max,Math.max(profile.min,floor+profile.height))):Math.max(floor,Math.min(profile.max,Math.max(profile.min,(actor.z??floor)+actor.flightVelocity*dt)));actor.z=profile.mode==='hover'?(actor.z??floor)+(target-(actor.z??floor))*Math.min(1,profile.acceleration*dt):target;actor.grounded=false;actor.verticalVelocity=0;actor.groundZ=floor;return true;
  }
  root.FrontierFlight={
    defaults,validate,update
  }
  ;
}
)(typeof window==='undefined'?globalThis:window);

