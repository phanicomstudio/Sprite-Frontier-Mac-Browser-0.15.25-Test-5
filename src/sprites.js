/* October 28, 2026 - 0.16.7: see ITERATION-0.16.7.md for current combat/authoring behavior; older comments below are retained historical contracts where explicitly superseded. */
/* MAINTAINER GUIDE
 * Sprite profile resolution. Holstered Candy uses the four-direction unarmed sheet; armed Candy uses eight directions. NPCs resolve authored profile IDs. Image caches must support file:// as well as local HTTP.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function sprites.callback.1 — Provides the callback for a callback. Inputs: root. Updates: frontier candy id; frontier candy columns; frontier candy reference height; frontier candy unarmed columns; frontier candy unarmed reference height. */
(/* @function sprites.installReviewed — Installs sprite-profile resolution and shared image caches. Holstered Candy uses four directions, armed Candy eight, and NPCs use authored profile IDs; file:// and local HTTP packages share the same cache contract. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  const images = new Map();
  FrontierCandy.id = "candy-armed";
  FrontierCandy.columns = 3;
  FrontierCandy.referenceHeight = 310;
  FrontierCandyUnarmed.columns = 3;
  FrontierCandyUnarmed.referenceHeight = 310;
  // Choose unarmed/armed/player/NPC sheet metadata without changing movement or combat logic.
  /* @function sprites.sheet.2 — Choose unarmed/armed/player/NPC sheet metadata without changing movement or combat logic. Inputs: entity. Updates: image; image src. Uses: frontier muzzle profiles get; images get; images set. Returns: frontier candy unarmed; null. */ function sheet(
    entity,
  ) {
    if (entity.id === "player" || entity.kind === "player") {
      if (entity.holstered) return FrontierCandyUnarmed;
    }
    // October 28: optional death sequence/remains use existing profile artwork; no new billboard owner.
    const death=entity.dead&&entity.enemyConfig,age=entity.deathAge||0;
    const id = (death ? (age<(death.deathSeconds||.6)&&death.deathSprite ? death.deathSprite : death.remainsSprite) : '') ||
      (!entity.holstered && entity.weapon?.type === "melee"
        ? entity.weapon.spriteProfile
        : "") ||
      entity.spriteProfile ||
      (entity.id === "player" || entity.kind === "player" ? "candy-armed" : "");
    if (!id) return null;
    // October 14: static item PNGs use one frame and the existing camera-facing
    // depth/anchor path. They do not masquerade as weapon muzzle profiles.
    if (id.startsWith("item-asset:")) {
      const itemId = id.slice(11);
      const item = root.FrontierItems?.find(
        /* @function sprites.itemDefinition1525 — Inputs: item definition. Returns stable item-ID match; no mutation. */
        function (entry) { return entry.id === itemId; });
      const asset = item?.properties?.sprite;
      if (!asset) return null;
      let image = images.get(asset.src);
      if (!image) { image = new Image(); image.src = root.FrontierItemImageData?.[asset.src] || asset.src; images.set(asset.src, image); }
      return { id, image, columns: 1, referenceHeight: asset.height,
        frames: [{ x:0, y:0, w:asset.width, h:asset.height, anchorX:asset.width/2 }],
        direction: { rows:[0], idleColumn:0, walkSequence:[0], frameSeconds:1 } };
    }
    if (id === "candy-armed") {
      const p = FrontierMuzzle.profiles.get(id);
      return {
        ...FrontierCandy,
        frames: p?.frames || FrontierCandy.frames,
        direction: p?.direction || FrontierCandy.direction,
      };
    }
    const p = FrontierMuzzle.profiles.get(id);
    if (!p) return null;
    let image = images.get(p.sheetData || p.sheet);
    if (!image) {
      image = new Image();
      image.src = p.sheetData || p.sheet;
      images.set(p.sheetData || p.sheet, image);
    }
    return {
      ...p,
      image,
      groundInset: root.FrontierTreeAnchors?.[id] || 0,
    };
  }
  const alpha167=new Map();let alphaBytes167=0;
  /* @function sprites.mask167 — Inputs: decoded original sprite image. Returns cached alpha pixels or null when unavailable/unreadable. Bounded to 32 MiB total; no per-frame decoding, no source edits. Cross-origin failures retain configured legacy body collision; nonsolid sprites cannot provide pixel cover until readable. */
  function mask167(image){if(alpha167.has(image))return alpha167.get(image);if(!image.complete||!image.naturalWidth)return null;const bytes=image.naturalWidth*image.naturalHeight;if(bytes>33554432)return null;try{const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);const rgba=ctx.getImageData(0,0,canvas.width,canvas.height).data,alpha=new Uint8Array(bytes);for(let i=0;i<bytes;i++)alpha[i]=rgba[i*4+3];const data={data:alpha,width:canvas.width,height:canvas.height};while(alphaBytes167+bytes>33554432&&alpha167.size){const key=alpha167.keys().next().value;alphaBytes167-=alpha167.get(key)?.data.length||0;alpha167.delete(key);}alpha167.set(image,data);alphaBytes167+=bytes;return data;}catch(error){alpha167.set(image,null);return null;}}
  /* @function sprites.cover167 — Inputs: game, static actor and world segment endpoints in metres. Returns normalized earliest opaque-pixel intersection, null for transparent/no contact, undefined if no readable sprite (caller retains legacy fallback). Uses the actual selected frame and locked camera-facing depth plane, including pitch/affine projection and ground inset. Radius does not expand opaque pixels. Coplanar rays march at half-pixel spacing, capped 4096 samples; no collision box authoring is required. Only projectile/cover queries call this; movement remains unchanged. */
  function cover167(game,e,a,b){const sh=sheet(e);if(!sh)return undefined;const vx=b.x-a.x,vy=b.y-a.y,vz=b.z-a.z,len=vx*vx+vy*vy+vz*vz,t=len?Math.max(0,Math.min(1,((e.x-a.x)*vx+(e.y-a.y)*vy+((e.z||0)-a.z)*vz)/len)):0;let bound=0;for(const frame of sh.frames)bound=Math.max(bound,frame.w,frame.h);bound=bound*(e.height||1.65)/(sh.referenceHeight||310)+.1;if(Math.hypot(a.x+vx*t-e.x,a.y+vy*t-e.y,a.z+vz*t-(e.z||0))>bound)return null;const pixels=mask167(sh.image);if(!pixels)return undefined;const cam=root.FrontierRender.camera(game),center=root.FrontierRender.project(cam,e.x,e.y,e.z||0);if(!center)return null;const selected=root.FrontierDirections.select(e,cam.yaw,sh.direction,cam),f=sh.frames[selected.row*(sh.columns||3)+selected.column];if(!f)return undefined;const metres=(e.height||1.65)/(sh.referenceHeight||310),scale=metres*center.scale,top=center.y-(f.h-(sh.groundInset||0))*scale,left=center.x-f.anchorX*scale;
    /* @function sprites.depth167 — Inputs: world point. Returns signed forward depth relative to camera in metres for perspective or affine; avoids near-plane clipping during intersection. */
    function depth(p){return cam.orthographic ? root.FrontierRender.project(cam,p.x,p.y,p.z)?.depth : (p.x-cam.x)*Math.sin(cam.yaw)*Math.cos(cam.pitch)+(p.y-cam.y)*Math.cos(cam.yaw)*Math.cos(cam.pitch)+(p.z-cam.z)*Math.sin(cam.pitch);}
    /* @function sprites.opaque167 — Inputs: normalized segment fraction. Returns alpha-test match at original frame pixel, threshold 128/255 matching cutout intent; outside cropped frame and transparent margins pass. No image/camera mutation. */
    function opaque(t){const p=root.FrontierRender.project(cam,a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,a.z+(b.z-a.z)*t);if(!p)return false;const x=Math.floor((p.x-left)/scale),y=Math.floor((p.y-top)/scale);return x>=0&&x<f.w&&y>=0&&y<f.h-(sh.groundInset||0)&&pixels.data[(f.y+y)*pixels.width+f.x+x]>=128;}
    const da=depth(a),db=depth(b),dc=center.depth,delta=db-da;if(!Number.isFinite(da)||!Number.isFinite(db))return null;
    if(Math.abs(delta)>1e-9){const t=(dc-da)/delta;return t>=0&&t<=1&&opaque(t)?t:null;}
    if(Math.abs(da-dc)>.0001)return null;const pa=root.FrontierRender.project(cam,a.x,a.y,a.z),pb=root.FrontierRender.project(cam,b.x,b.y,b.z);if(!pa||!pb)return null;const steps=Math.min(4096,Math.max(1,Math.ceil(Math.hypot(pb.x-pa.x,pb.y-pa.y)/Math.max(.01,scale)*2)));for(let i=0;i<=steps;i++)if(opaque(i/steps))return i/steps;return null;
  }
  root.FrontierSprites = {
    sheet,cover167,mask167,
  };
})(window);
