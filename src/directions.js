/* MAINTAINER GUIDE
 * Asset-independent directional animation. Row order comes from sheet metadata; four and eight direction sheets share this selector. Angles use atan2(X,Y), because +Y is forward at yaw zero.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(/* @function directions.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier directions. */ function(root){
'use strict'  ;
// Row order is asset metadata; any evenly spaced 4/8/N-direction sheet works.
// Quantize facing relative to camera into a metadata row, then choose idle or walking animation column.
  /* @function directions.select.2 — Quantize facing relative to camera into a metadata row, then choose idle or walking animation column. Inputs: entity; camera yaw; spec; camera. Returns: a record containing row, column. */ function select(entity,cameraYaw,spec,camera){
    const fx=entity.facingX??0,fy=entity.facingY??1,c=camera?.orthographic&&camera.room?.camera;
    // The fixed room is an affine projection, not an outdoor yaw camera.
    // Quantize its actual screen direction so aiming and locomotion share rows.
    const angle=c?Math.atan2(c.axisXX*fx+c.axisYX*fy,-(c.axisXY*fx+c.axisYY*fy)):Math.atan2(fx,fy)-cameraYaw,sector=((Math.round(angle/(Math.PI*2/spec.rows.length))%spec.rows.length)+spec.rows.length)%spec.rows.length,walking=entity.stepAnime||entity.walkAnime!==false&&((entity.walkHold||0)>0||Math.hypot(entity.vx||0,entity.vy||0)>.00001),col=walking?spec.walkSequence[Math.floor((entity.walkTime||0)/spec.frameSeconds)%spec.walkSequence.length]:spec.idleColumn;
    return{
      row:spec.rows[sector],column:col
    }
    ;
  }
  root.FrontierDirections={
    select
  }
  ;
}
)(typeof window==='undefined'?globalThis:window);

