(function(root){
  'use strict';
  // Row order is asset metadata; any evenly spaced 4/8/N-direction sheet works.
  function select(entity,cameraYaw,spec){const angle=Math.atan2(entity.facingX??0,entity.facingY??1)-cameraYaw,sector=((Math.round(angle/(Math.PI*2/spec.rows.length))%spec.rows.length)+spec.rows.length)%spec.rows.length,walking=Math.hypot(entity.vx||0,entity.vy||0)>.00001,col=walking?spec.walkSequence[Math.floor((entity.walkTime||0)/spec.frameSeconds)%spec.walkSequence.length]:spec.idleColumn;return{row:spec.rows[sector],column:col};}
  root.FrontierDirections={select};
})(typeof window==='undefined'?globalThis:window);
