/* Authored one-unit water cells share material settings. An opaque plane hides
 * submerged sprites. Texture loading is cached; no fluid simulation is performed.
 * The procedural placeholder and future image materials use the same draw path. */
(/* @function water.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier water. */ function(root){
  'use strict';
  const defaults={
    embeddedTexture:'',level:0,color:'#185b69',texture:'',scale:2,speed:0.6,warp:0.06,flowX:0.04,flowY:0,underwaterEnabled:true,underwaterStrength:0.008,underwaterSpeed:1,underwaterFrequency:4
  }
  ;
  // Validate authored material/cells and reject malformed or oversized assets.
  /* @function water.validate.2 — Validate authored material/cells and reject malformed or oversized assets. Inputs: assignment pattern. Uses: array is array; error; number is finite; /^#[0-9a-f]{6}$/i test. Returns: a record containing copied fields, copied fields, cells. */ function validate(value={
  }
  ){
    const v={
      ...defaults,...value
    }
    ,cells=v.cells||{
    }
    ;if(typeof cells!=='object'||Array.isArray(cells))throw Error('Water cells must be an object.');for(const k of ['level','scale','speed','warp','flowX','flowY','underwaterStrength','underwaterSpeed','underwaterFrequency'])if(!Number.isFinite(v[k]))throw Error('Invalid water material number.');if(typeof v.underwaterEnabled!=='boolean'||v.underwaterStrength<0||v.underwaterStrength>.05||Math.abs(v.underwaterSpeed)>5||v.underwaterFrequency<1||v.underwaterFrequency>20)throw Error('Invalid underwater effect.');if(Math.abs(v.level)>30||v.scale<.25||v.scale>16||Math.abs(v.speed)>5||v.warp<0||v.warp>.3||Math.abs(v.flowX)>2||Math.abs(v.flowY)>2||!/^#[0-9a-f]{6}$/i.test(v.color)||typeof v.texture!=='string'||(v.texture&&!/^[a-z0-9 _.-]+\.(png|jpg|webp)$/i.test(v.texture))||v.texture.includes('..'))throw Error('Invalid water material.');if(Object.keys(cells).length>50000)throw Error('Water exceeds 50,000 cells.');for(const [key,level] of Object.entries(cells))if(!/^\d+,\d+$/.test(key)||!Number.isFinite(level)||Math.abs(level)>30)throw Error('Invalid water cell.');if(typeof v.embeddedTexture!=='string'||v.embeddedTexture.length>14000000||(v.embeddedTexture&&!/^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(v.embeddedTexture)))throw Error('Invalid embedded water texture.');return {
      ...defaults,...v,cells:{
        ...cells
      }
    }
    ;
  }
  // Fast point lookup used for sprite waterline clipping.
  /* @function water.level.3 — Fast point lookup used for sprite waterline clipping. Inputs: world; x; y. Uses: surface index using world rim get; surface index. Returns: z does not equal undefined selects z or surface index using world rim get using key. */ function level(world,x,y){
    const key=Math.floor(x)+','+Math.floor(y),z=world.water?.cells?.[key];return z!==undefined?z:surfaceIndex(world).rim.get(key);
  }
  // Cached spatial buckets invalidate only after painting, not on animation frames.
  const regions=new WeakMap(),shorelines=new WeakMap();
  // Painted floor cells also wet their adjoining sloped banks. Only mixed
  // wet/dry neighbors qualify: this does not flood unpainted flat countryside.
  /* @function water.surfaceIndex.4 — wet/dry neighbors qualify: this does not flood unpainted flat countryside. Inputs: world. Updates: wet; index. Uses: regions get; object entries using cells map; object entries; key split using "," map. Returns: index; index. */ function surfaceIndex(world){
    const cells=world.water?.cells||{},revision=world.terrain?.revision||0;
    let index=regions.get(world);if(index&&index.cells===cells&&index.terrain===world.terrain&&index.revision===revision)return index;
    const rim=new Map(),candidates=new Map(),buckets=new Map(),width=world.width??world.size,height=world.height??world.size;
    // Flood the connected submerged basin, including fully wet unpainted tiles.
    // Terrain-clipped triangles define the shoreline; painted cells seed each pool.
    const queue=Object.entries(cells).map(/* @function water.callback.5 — Returns a record containing key, z. Inputs: array pattern. Returns: a record containing key, z. */ ([key,z])=>({key,z})),seen=new Map(Object.entries(cells));
    for(let q=0;q<queue.length&&queue.length<50000;q++){
      const {key,z}=queue[q],[x,y]=key.split(',').map(Number);
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        const nx=x+dx,ny=y+dy,k=nx+','+ny;if((!dx&&!dy)||nx<0||ny<0||nx>=width||ny>=height||cells[k]!==undefined||(seen.has(k)&&seen.get(k)>=z))continue;seen.set(k,z);
        let wet=false;for(let j=0;j<=4&&!wet;j++)for(let i=0;i<=4;i++)if(root.FrontierTerrain.height(world,nx+i/4,ny+j/4)<z){wet=true;break;}
        if(wet){rim.set(k,z);queue.push({key:k,z});}
      }
    }
    /* @function water.add.6 — Handles add within water. Inputs: key; z. Uses: key split using "," map; key split; buckets has; buckets set. */ function add(key,z){const [x,y]=key.split(',').map(Number),k=Math.floor(x/8)+','+Math.floor(y/8);if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push({x,y,z});}
    for(const [key,z]of Object.entries(cells))add(key,z);for(const [key,z]of rim)add(key,z);
    index={cells,terrain:world.terrain,revision,rim,buckets};regions.set(world,index);return index;
  }
  // Clip in world space before perspective division; UVs remain attached to
  // their world coordinates when a water triangle crosses the near plane.
  /* @function water.nearClip.7 — their world coordinates when a water triangle crosses the near plane. Inputs: cam; coords; z. Uses: depth; out push. Returns: out. */ function nearClip(cam,coords,z){
    const depth=/* @function water.depth.8 — Returns p at 0 minus cam x multiplied by math sin using cam yaw plus p at 1 minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus z minus cam z multiplied by math sin using cam pitch. Inputs: p. Returns: p at 0 minus cam x multiplied by math sin using cam yaw plus p at 1 minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus z minus cam z multiplied by math sin using cam pitch. */ p=>((p[0]-cam.x)*Math.sin(cam.yaw)+(p[1]-cam.y)*Math.cos(cam.yaw))*Math.cos(cam.pitch)+(z-cam.z)*Math.sin(cam.pitch),out=[];
    for(let i=0;i<coords.length;i++){const a=coords[i],b=coords[(i+1)%coords.length],da=depth(a),db=depth(b),inside=da>=.13;if(inside)out.push(a);if(inside!==(db>=.13)){const t=(.13-da)/(db-da);out.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]);}}return out;
  }
  // Quarter-unit triangulation follows the sampled height field, including islands.
  /* @function water.geometry.9 — Quarter-unit triangulation follows the sampled height field, including islands. Inputs: world; x; y; z. Updates: cache. Uses: shorelines get; shorelines set; cache tiles has; cache tiles get. Returns: cache tiles get using key; full. */ function geometry(world,x,y,z){
    let cache=shorelines.get(world);const revision=world.terrain?.revision||0;
    if(!cache||cache.terrain!==world.terrain||cache.revision!==revision){cache={terrain:world.terrain,revision,tiles:new Map()};shorelines.set(world,cache);}
    const key=x+','+y+','+z;if(cache.tiles.has(key))return cache.tiles.get(key);
    const triangles=[],n=4,samples=[];for(let j=0;j<=n;j++)for(let i=0;i<=n;i++)samples.push([x+i/n,y+j/n,root.FrontierTerrain.height(world,x+i/n,y+j/n)]);
    if(samples.every(/* @function water.callback.10 — Returns p at 2 is less than z. Inputs: p. Returns: p at 2 is less than z. */ p=>p[2]<z)){const a=[x,y],b=[x+1,y],c=[x+1,y+1],d=[x,y+1];const full=[[a,b,c],[a,c,d]];if(cache.tiles.size>=4096)cache.tiles.delete(cache.tiles.keys().next().value);cache.tiles.set(key,full);return full;}
    /* @function water.cut.11 — Handles cut within water. Inputs: poly. Uses: out push; triangles push; a list of out at 0, out at i, out at i plus 1 map. */ function cut(poly){const out=[];for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],inside=a[2]<z;if(inside)out.push(a);if(inside!==(b[2]<z)){const t=(z-a[2])/(b[2]-a[2]);out.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1]),z]);}}for(let i=1;i<out.length-1;i++)triangles.push([out[0],out[i],out[i+1]].map(/* @function water.callback.12 — Returns a list of p at 0, p at 1. Inputs: p. Returns: a list of p at 0, p at 1. */ p=>[p[0],p[1]]));}
    for(let j=0;j<n;j++)for(let i=0;i<n;i++){const sample=/* @function water.sample.13 — Returns samples at b multiplied by n plus 1 plus a. Inputs: a; b. Returns: samples at b multiplied by n plus 1 plus a. */ (a,b)=>samples[b*(n+1)+a],a=sample(i,j),b=sample(i+1,j),c=sample(i+1,j+1),d=sample(i,j+1);cut([a,b,c]);cut([a,c,d]);}
    if(cache.tiles.size>=4096)cache.tiles.delete(cache.tiles.keys().next().value);cache.tiles.set(key,triangles);return triangles;
  }
  /* @function water.submerged.14 — Handles submerged within water. Inputs: world; cam; subject. Uses: level; root frontier terrain height. Returns: cam z is less than z; true. */ function submerged(world,cam,subject){const z=level(world,cam.x,cam.y);if(z!==undefined&&root.FrontierTerrain.height(world,cam.x,cam.y)<z)return cam.z<z;
 // A low orbit camera outside the basin can look into it. Classify that view
 // consistently with sprite visibility, instead of leaving an effect-free gap.
 if(subject){const s=level(world,subject.x,subject.y);if(s!==undefined&&cam.z<s&&root.FrontierTerrain.height(world,subject.x,subject.y)<s){for(let i=1;i<=8;i++){const t=i/8,x=cam.x+(subject.x-cam.x)*t,y=cam.y+(subject.y-cam.y)*t,l=level(world,x,y);if(l!==undefined&&cam.z<l&&root.FrontierTerrain.height(world,x,y)<l)return true;}}}return false;}
  /* @function water.obscures.15 — Handles obscures within water. Inputs: world; cam; x; y; feet. Uses: level; root frontier terrain height. Returns: z does not equal undefined and root frontier terrain height using world, x, y is less than z and z is greater than feet and the inverse of cam underwater and cam z is at least z. */ function obscures(world,cam,x,y,feet){const z=level(world,x,y);return z!==undefined&&root.FrontierTerrain.height(world,x,y)<z&&z>feet&&!cam.underwater&&cam.z>=z;}
  // The basin is excavated from the lowest surrounding bank, rather than from
  // its center: hill slopes must not leave a raised water platform.
  /* @function water.poolHeights.16 — its center: hill slopes must not leave a raised water platform. Inputs: world; cx; cy. Updates: bank. Uses: root frontier terrain height. Returns: a record containing surface, bottom. */ function poolHeights(world,cx,cy){let bank=Infinity;for(let i=-4;i<=4;i++)for(const [x,y]of [[cx+i,cy-4],[cx+i,cy+4],[cx-4,cy+i],[cx+4,cy+i]])bank=Math.min(bank,root.FrontierTerrain.height(world,x,y));const surface=Math.max(-28,Math.min(28,bank-.3));return {surface,bottom:surface-.8};}
const images=new Map();/* @function water.image.17 — Handles image within water. Inputs: name. Updates: img src. Uses: images has; images delete; images keys using next; images keys. Returns: null; img complete and img natural width selects img or null. */ function image(name){
    if(!name)return null;if(!images.has(name)){
      if(images.size>=8)images.delete(images.keys().next().value);const img=new Image();img.src=name.startsWith('data:image/')?name:'img/water/'+encodeURIComponent(name);images.set(name,img);
    }
    const img=images.get(name);return img.complete&&img.naturalWidth?img:null;
  }
  // Iterate only the visible neighborhood. Terrain at cell centers defines shorelines.
  // Assemble only nearby surface tiles; retained GPU meshes supply UV animation.
  /* @function water.draw.18 — Assemble only nearby surface tiles; retained GPU meshes supply UV animation. Inputs: ctx; game; cam; project. Updates: ctx vector display; ctx fog depth; ctx global alpha; ctx fill style. Uses: surface index; visible push; buckets get; performance now. Returns: without a result; without a result. */ function draw(ctx,game,cam,project){
    const w=game.sourceWorld.water;if(!w?.cells)return;const {buckets}=surfaceIndex(game.sourceWorld);
    if(!buckets.size)return;const visible=[];for(let by=Math.floor((cam.y-35)/8);by<=Math.floor((cam.y+35)/8);by++)for(let bx=Math.floor((cam.x-35)/8);bx<=Math.floor((cam.x+35)/8);bx++)visible.push(...(buckets.get(bx+','+by)||[]));
    const t=(game.time||performance.now()/1000),texture=image(w.embeddedTexture||w.texture),bounds=game.sourceWorld;ctx.save();const beam=ctx.vectorDisplay;ctx.vectorDisplay=null;const material={...w,time:t,textureImage:texture};
    for(const {
      x,y,z
    }
    of visible){
      if(z===undefined)continue;for(const triangle of geometry(bounds,x,y,z)){const coords=nearClip(cam,triangle,z);if(coords.length<3)continue;const points=coords.map(/* @function water.callback.19 — Returns project using cam, spread element, z. Inputs: p. Uses: project. Returns: project using cam, spread element, z. */ p=>project(cam,...p,z));if(points.some(/* @function water.callback.20 — Returns the inverse of p. Inputs: p. Returns: the inverse of p. */ p=>!p)||points.every(/* @function water.callback.21 — Returns p depth is greater than 45. Inputs: p. Returns: p depth is greater than 45. */ p=>p.depth>45))continue;ctx.fogDepth=points[0].depth;ctx.globalAlpha=1;
      if(ctx.waterQuad){
        ctx.waterQuad(points,material,x,y,coords);
      }
      else{
        ctx.fillStyle=w.color;ctx.beginPath();points.forEach(/* @function water.callback.22 — Returns ctx at i selects "lineTo" or "moveTo" using p x, p y. Inputs: p; i. Uses: ctx at i selects "lineTo" or "moveTo". Returns: ctx at i selects "lineTo" or "moveTo" using p x, p y. */ (p,i)=>ctx[i?'lineTo':'moveTo'](p.x,p.y));ctx.closePath();ctx.fill();
      }
    }
    }
    ctx.vectorDisplay=beam;ctx.restore();
  }
  root.FrontierWater={
    defaults,validate,level,geometry,nearClip,surfaceIndex,poolHeights,submerged,obscures,draw,/* @function water.invalidate.23 — Handles invalidate within water. Inputs: world. Uses: regions delete; shorelines delete. */ invalidate(world){
      regions.delete(world);shorelines.delete(world);
    }
  }
  ;
}
)(typeof window==='undefined'?globalThis:window);

