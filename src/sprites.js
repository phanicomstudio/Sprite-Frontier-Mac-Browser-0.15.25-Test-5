/* MAINTAINER GUIDE
 * Sprite profile resolution. Holstered Candy uses the four-direction unarmed sheet; armed Candy uses eight directions. NPCs resolve authored profile IDs. Image caches must support file:// as well as local HTTP.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(/* @function sprites.callback.1 — Provides the callback for a callback. Inputs: root. Updates: frontier candy id; frontier candy columns; frontier candy reference height; frontier candy unarmed columns; frontier candy unarmed reference height. */ function(root){
  const images=new Map();
  FrontierCandy.id='candy-armed';
  FrontierCandy.columns=3;
  FrontierCandy.referenceHeight=310;
  FrontierCandyUnarmed.columns=3;
  FrontierCandyUnarmed.referenceHeight=310;
// Choose unarmed/armed/player/NPC sheet metadata without changing movement or combat logic.
  /* @function sprites.sheet.2 — Choose unarmed/armed/player/NPC sheet metadata without changing movement or combat logic. Inputs: entity. Updates: image; image src. Uses: frontier muzzle profiles get; images get; images set. Returns: frontier candy unarmed; null. */ function sheet(entity){
    if(entity.id==='player'||entity.kind==='player'){
      if(entity.holstered)return FrontierCandyUnarmed;
    }
    const id=(!entity.holstered&&entity.weapon?.type==='melee'?entity.weapon.spriteProfile:'')||entity.spriteProfile||(entity.id==='player'||entity.kind==='player'?'candy-armed':'');
    if(!id)return null;
    if(id==='candy-armed'){
      const p=FrontierMuzzle.profiles.get(id);
      return {
        ...FrontierCandy,frames:p?.frames||FrontierCandy.frames,direction:p?.direction||FrontierCandy.direction
      }
      ;
    }
    const p=FrontierMuzzle.profiles.get(id);
    if(!p)return null;
    let image=images.get(p.sheetData||p.sheet);
    if(!image){
      image=new Image();
      image.src=p.sheetData||p.sheet;
      images.set(p.sheetData||p.sheet,image);
    }
    return {
      ...p,image,groundInset:root.FrontierTreeAnchors?.[id]||0
    }
    ;
  }
  root.FrontierSprites={
    sheet
  }
  ;
}
)(window);

