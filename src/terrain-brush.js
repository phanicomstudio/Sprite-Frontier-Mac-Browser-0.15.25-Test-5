/* Sparse additive height edits are bilinearly sampled by the shared terrain API.
 * One drag is one undo transaction; brush previews mutate only the active map.
 * Strength is integrated by distance travelled, independent of pointer event rate. */
(/* @function terrain-brush.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier brush. */ function(root){
  'use strict';
  /* @function terrain-brush.paint.2 — Handles paint within terrain brush. Inputs: world; point; tool; radius; strength; target. Updates: world terrain edits; world water; snapshot at sx plus "," plus sy; water cells at k; sum. Uses: root frontier water validate; root frontier terrain base height; root frontier water invalidate. Returns: touched. */ function paint(world,point,tool,radius,strength,target){
    const cells=world.terrain.edits||(world.terrain.edits={
    }
    ),water=world.water||(world.water=root.FrontierWater.validate());
    // Smoothing snapshots only the brush neighborhood, never the whole map.
    const snapshot=tool==='smooth'?{}:cells;
    if(tool==='smooth')for(let sy=Math.floor(point.y-radius)-1;sy<=Math.ceil(point.y+radius)+1;sy++)for(let sx=Math.floor(point.x-radius)-1;sx<=Math.ceil(point.x+radius)+1;sx++)snapshot[sx+','+sy]=cells[sx+','+sy]||0;let touched=0;
    for(let y=Math.max(0,Math.floor(point.y-radius));y<=Math.min(world.height-1,Math.ceil(point.y+radius));y++)for(let x=Math.max(0,Math.floor(point.x-radius));x<=Math.min(world.width-1,Math.ceil(point.x+radius));x++){
      const d=Math.hypot(x-point.x,y-point.y)/radius;if(d>1)continue;const k=x+','+y,weight=(1-d)*(1-d);if(tool==='water'){
        water.cells[k]=water.level;touched++;continue;
      }
      if(tool==='eraseWater'){
        delete water.cells[k];touched++;continue;
      }
      const current=cells[k]||0,base=root.FrontierTerrain.baseHeight(world,x,y);let change=tool==='raise'?strength:tool==='lower'?-strength:target-base-current;
      if(tool==='smooth'){
        let sum=0,n=0;for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]]){
          sum+=root.FrontierTerrain.baseHeight(world,x+dx,y+dy)+(snapshot[(x+dx)+','+(y+dy)]||0);n++;
        }
        change=sum/n-base-current;
      }
      cells[k]=Math.max(-30,Math.min(30,current+change*weight*(tool==='raise'||tool==='lower'?1:Math.min(1,strength))));touched++;
    }
    if(tool==='water'||tool==='eraseWater')root.FrontierWater.invalidate(world);else world.terrain.revision=(world.terrain.revision||0)+1;return touched;
  }
  root.FrontierBrush={
    paint
  }
  ;
}
)(typeof window==='undefined'?globalThis:window);

