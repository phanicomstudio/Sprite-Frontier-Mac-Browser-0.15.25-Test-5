/* MAINTAINER GUIDE
 * Validated per-sheet/per-direction/per-animation-frame muzzle authoring. Stored X/Y coordinates are full-sheet pixels; projection converts them into world positions. Projectile and flash have separate points plus yaw/pitch offsets in degrees.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function(root){
'use strict'  ;
  const profiles=new Map();
// Validate imported/authored data and return a sanitized clone. Extend schema and matching tests when adding fields.
  function validate(data){
    if(data?.schema!=='phanicom-muzzles/1'||!Array.isArray(data.profiles)||data.profiles.length>100)throw Error('Invalid muzzle profile file.');
    const ids=new Set();
    for(const p of data.profiles){
      if(typeof p.id!=='string'||!p.id||p.id.length>100||ids.has(p.id))throw Error('Invalid or duplicate sprite profile ID.');
      ids.add(p.id);
      for(const [key,max] of [['rows',16],['columns',12],['frameWidth',8192],['frameHeight',8192]])if(!Number.isInteger(p[key])||p[key]<1||p[key]>max)throw Error('Invalid sprite '+key+'.');
      if(!Number.isFinite(p.referenceHeight)||p.referenceHeight<=0||p.referenceHeight>8192)throw Error('Invalid reference height.');
      if(!Array.isArray(p.frames)||p.frames.length!==p.rows*p.columns||!Array.isArray(p.direction?.rows)||!p.direction.rows.length||p.direction.rows.some(r=>!Number.isInteger(r)||r<0||r>=p.rows))throw Error('Invalid sprite frame or direction layout.');
      const d=p.direction;
      if(!Array.isArray(d.walkSequence)||!d.walkSequence.length||[d.idleColumn,...d.walkSequence].some(c=>!Number.isInteger(c)||c<0||c>=p.columns)||!Number.isFinite(d.frameSeconds)||d.frameSeconds<=0)throw Error('Invalid animation layout.');
      for(const f of p.frames)if(!f||['x','y','w','h','anchorX'].some(k=>!Number.isFinite(f[k]))||f.x<0||f.y<0||f.w<=0||f.h<=0||f.x+f.w>p.columns*p.frameWidth||f.y+f.h>p.rows*p.frameHeight)throw Error('Invalid sprite crop.');
      if(p.sheetData!==undefined&&(typeof p.sheetData!=='string'||!/^data:image\/(png|webp|jpeg);base64,/.test(p.sheetData)||p.sheetData.length>20000000))throw Error('Invalid embedded image.');
      if(!p.muzzles||typeof p.muzzles!=='object'||Array.isArray(p.muzzles))throw Error('Invalid muzzle points.');
      for(const m of [...Object.values(p.muzzles),...(p.defaultMuzzle?[p.defaultMuzzle]:[])]){
        if(!m||!Number.isFinite(m.x)||!Number.isFinite(m.y))throw Error('Muzzle requires X/Y coordinates.');
        for(const key of ['x','y','flashX','flashY','yawOffset','pitchOffset'])if(m[key]!==undefined&&(!Number.isFinite(m[key])||Math.abs(m[key])>(key.endsWith('Offset')?180:131072)))throw Error('Invalid calibration number.');
      }
    }
    return structuredClone(data);
  }
// Validate then install muzzle profiles keyed by ID. Existing unrelated profiles remain available.
  function load(data){
    for(const p of validate(data).profiles)profiles.set(p.id,p);
  }
// Resolve the actor profile ID; default the player to the armed Candy calibration.
  function spec(entity){
    return profiles.get(entity.spriteProfile||(entity.id==='player'||entity.kind==='player'?'candy-armed':''));
  }
// Select the same directional animation frame used for drawing so muzzle points stay synchronized.
  function frame(entity,game){
    const p=spec(entity);
    if(!p)return null;
    const selected=FrontierDirections.select(entity,game.camera.yaw,p.direction);
    return {
      profile:p,...selected,frame:p.frames[selected.row*p.columns+selected.column]
    }
    ;
  }
// Convert authored full-sheet pixels into billboard-local offsets, then invert projection into world XYZ.
  function point(entity,game,flash=false){
    const selection=frame(entity,game);
    if(!selection)return null;
    const {
      profile:p,row,column,frame:f
    }
    =selection,m=p.muzzles[row+':'+column]||p.muzzles[row+':*']||p.defaultMuzzle;
    if(!m)return null;
    const x=(flash?m.flashX:m.x)??m.x,y=(flash?m.flashY:m.y)??m.y;
    const localX=x-column*p.frameWidth-(f.x-column*p.frameWidth)-f.anchorX;
    const localY=f.y+f.h-row*p.frameHeight-(y-row*p.frameHeight);
    const cam=FrontierRender.camera(game),feet=FrontierRender.project(cam,entity.x,entity.y,entity.z||0);
    if(!feet)return null;
    const size=(entity.height||1.65)/p.referenceHeight,side=localX*size,up=localY*size;
// Invert the same billboard projection used to draw the sprite. Both the
// flash and projectile start remain attached to the authored pixel at any zoom.
    return {
      x:entity.x+Math.cos(cam.yaw)*side-Math.sin(cam.yaw)*Math.sin(cam.pitch)*up,y:entity.y-Math.sin(cam.yaw)*side-Math.cos(cam.yaw)*Math.sin(cam.pitch)*up,z:(entity.z||0)+Math.cos(cam.pitch)*up,yawOffset:(m.yawOffset||0)*Math.PI/180,pitchOffset:(m.pitchOffset||0)*Math.PI/180
    }
    ;
  }
  root.FrontierMuzzle={
    load,validate,profiles,spec,frame,point,export(){
      return {
        schema:'phanicom-muzzles/1',profiles:[...profiles.values()]
      }
      ;
    }
  }
  ;
  if(root.FrontierMuzzleData)load(root.FrontierMuzzleData);
}
)(window);
