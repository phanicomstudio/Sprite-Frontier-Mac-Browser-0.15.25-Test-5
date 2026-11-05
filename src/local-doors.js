/* October 29, 2026: local hinged doors use ordinary event self switches and the shared antique-door mesh. They never invoke a cell transition or replace authored geometry during play. */
(/* @function localDoors.install — Inputs: browser namespace. Publishes event creation and bounded active-cell animation. Saves own only the original event switch; mesh caches/fractions are transient. */function(root){

'use strict';
  const leafBounds=new WeakMap();

/* @function localDoors.create — Inputs: effective wall and validated opening. Returns a real two-page event with closed/open self-switch actions and a shared model/interaction zone. Coordinates are Z-up metres; scale fits the requested aperture. Does not insert the event or modify its wall. */
function create(wall,opening){
    const alongX=wall.w>=wall.d,yaw=(wall.yaw||0)+(alongX?0:Math.PI/2),center={
      x:wall.x+Math.cos(yaw)*opening.offset,y:wall.y+Math.sin(yaw)*opening.offset
    },id='door-'+crypto.randomUUID(),e=root.FrontierEvents.create(id,center.x-Math.cos(yaw)*opening.width/2,center.y-Math.sin(yaw)*opening.width/2);
    e.name='Local door';
    e.range=2.5;
    e.heightOffset=wall.z;
    e.extensions={
      localDoor:{
        version:1,openingId:opening.id,speed:130
      }
    };
    e.pages[0].graphic='none';
    e.pages[0].solid=false;
    e.pages[0].commands=[{
      type:'selfSwitch',key:'A',value:true
    }];
    const open=root.FrontierEvents.page('Open');
    open.graphic='none';
    open.solid=false;
    open.condition={
      type:'selfSwitch',key:'A'
    };
    open.commands=[{
      type:'selfSwitch',key:'A',value:false
    }];
    e.pages.push(open);
    e.spatial=root.FrontierModelEvents.validate({
      visual:'model',modelId:'builtin-antique-door',collisionMode:'custom',rotation:[0,0,yaw*180/Math.PI],scale:[opening.width/.9,1,opening.height/2.1],collisionBoxes:[],interactionZones:[{
        id:'door-zone',name:'Open / close door',size:[.9,.6,2.1],transform:{
          position:[.45,0,1.05]
        },eventId:id,trigger:'interact'
      }]
    });
    return e;
  }

/* @function localDoors.bounds — Inputs: original immutable model asset and leaf instance. Returns cached local-model-space AABB from real leaf triangles; one traversal per shared asset. No texture readback or geometry mutation. */
function bounds(asset,leaf){
    let box=leafBounds.get(asset);
    if(box)return box;
    const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
    for(const primitive of asset.meshes[leaf.mesh])for(let i=0;i<primitive.positions.length;i+=3){
      const p=root.FrontierModelTransform.vector(leaf.matrix,primitive.positions.subarray(i,i+3));
      for(let k=0;k<3;k++){
        min[k]=Math.min(min[k],p[k]);
        max[k]=Math.max(max[k],p[k]);
      }
    }
    box={
      size:min.map(/* @function localDoors.leafSize — Inputs: axis minimum/index. Returns actual dimension with nonzero thin-leaf minimum. */function(v,k){
        return Math.max(.03,max[k]-v);
      }),center:min.map(/* @function localDoors.leafCenter — Inputs: axis minimum/index. Returns AABB center in engine model space. */function(v,k){
        return (v+max[k])/2;
      })
    };
    leafBounds.set(asset,box);
    return box;
  }

/* @function localDoors.update — Inputs: actual game and unpaused seconds. Animates only local-door event entities, sharing original mesh bytes. Visual leaf and collision box use the same hinge delta; closing pauses when the player's body would intersect, avoiding crushing/teleporting. State switches remain original save/cell persistence owner. */
function update(game,dt){
    for(const e of game.sceneEvents||[]){
      if(!e.localDoor)continue;
      const asset=root.FrontierModelLibrary.get(e.modelId),leaf=asset?.scene.instances.find(/* @function localDoors.leafNode — Inputs: compiled model instance. Returns supplied antique hinged leaf node. */function(i){
        return i.node===1;
      });
      if(!leaf)continue;
      const T=root.FrontierModelTransform,target=e.localDoorOpen?1:0,prior=e.localDoorFraction??target,fraction=Math.max(0,Math.min(1,prior+Math.sign(target-prior)*Math.min(Math.abs(target-prior),(dt||0)*(e.localDoor.speed||130)/85))),pivot=[leaf.matrix[12],leaf.matrix[13],leaf.matrix[14]],angle=-85*fraction,delta=T.multiply(T.matrix({
        position:pivot
      }),T.multiply(root.FrontierDoorTransition.axisRotation([0,0,1],angle),T.matrix({
        position:pivot.map(/* @function localDoors.inverseHinge — Inputs: pivot axis. Returns inverse translation. */function(n){
          return -n;
        })
      }))),box=bounds(asset,leaf),collision={
        id:'local-door-leaf',size:box.size,transform:{
          position:T.vector(delta,box.center),rotation:[0,0,angle],scale:[1,1,1]
        }
      },parent=root.FrontierModelEvents.matrix(e),p=game.player,r=p.radius||.13;
      let occupied=false;
      if(fraction<prior)for(const dx of [-r,0,r])for(const dy of [-r,0,r])for(const dz of [.1,1,1.6])if(T.contains([p.x+dx,p.y+dy,(p.z||0)+dz],collision,parent))occupied=true;
      if(occupied)continue;
      e.localDoorFraction=fraction;
      e.spatial={
        ...e.spatial,collisionBoxes:[collision]
      };
      e.transitionSource=asset;
      e.transitionAsset={
        ...asset,scene:{
          ...asset.scene,instances:asset.scene.instances.map(/* @function localDoors.hingeInstance — Inputs: immutable compiled instance. Returns leaf-only transformed copy, leaving frame and source shared bytes unchanged. */function(i){
            return i.node===1?{
              ...i,matrix:T.multiply(delta,i.matrix)
            }:i;
          })
        }
      };
    }
  }

root.FrontierLocalDoors={
    create,update
  };


})(window);
