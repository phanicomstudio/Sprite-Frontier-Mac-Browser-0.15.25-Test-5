/* October 29: derived opening slabs now have their own stable component bases/overrides; direct material/transform/delete edits persist too. Supersedes the initial host-only fragment editing limit retained below. */
/* October 29, 2026: additive hybrid-room recipes. Existing grid rooms, imported models and fixed artwork stay in their original owners. New rooms compile deterministic ordinary primitives for the same runtime collision/render pipeline. */
(/* @function construction.install — Inputs: browser namespace. Publishes pure validation/compilation and boundary capture. No automatic conversion of legacy projects or changed sprite presentation. */function(root){

'use strict';
  const transforms=['x','y','z','w','d','h','yaw'],properties=['name','texture','tileSize','textureMapping','textureRotation','textureOffsetU','textureOffsetV','preserveAspect','color'];

/* @function construction.validate — Inputs: optional portable construction recipe. Returns detached normalized optional Buildings/Storeys/rooms/shared boundaries/openings. Stable identities are map-local, dimensions metres, yaw radians. Rejects dangling parents, duplicate IDs, malformed overrides and capacities before geometry adoption. */
function validate(value){
    if(value===undefined)return undefined;
    const v=structuredClone(value),ids=new Set();
    if(v.version!==1)throw Error('Unsupported construction schema.');
    for(const key of ['buildings','storeys','rooms','boundaries','openings']){
      v[key]??=[];
      if(!Array.isArray(v[key])||v[key].length>256)throw Error('Construction supports at most 256 '+key+'.');
      for(const row of v[key]){
        if(!row||typeof row.id!=='string'||!/^[a-z0-9_-]{1,48}$/i.test(row.id)||ids.has(row.id))throw Error('Construction needs unique stable IDs.');
        ids.add(row.id);
      }
    }

 const buildings=new Set(v.buildings.map(/* @function construction.buildingId — Inputs: building. Returns stable identity for parent validation. */function(row){
      return row.id;
    })),storeys=new Set(v.storeys.map(/* @function construction.storeyId — Inputs: storey. Returns stable identity. */function(row){
      return row.id;
    }));
    for(const row of [...v.buildings,...v.storeys,...v.rooms])if(typeof row.name!=='string'||!row.name.trim()||row.name.length>80)throw Error('Name each building, storey and room.');
    for(const row of v.storeys){
      if(row.buildingId&&!buildings.has(row.buildingId))throw Error('Storey building no longer exists.');
      if(!Number.isFinite(row.elevation)||row.elevation< -29||row.elevation>79)throw Error('Storey elevation must be -29–79 metres.');
    }

 for(const room of v.rooms){
      if(room.buildingId&&!buildings.has(room.buildingId)||room.storeyId&&!storeys.has(room.storeyId))throw Error('Room parent no longer exists.');
      for(const [key,min,max]of [['x',1,511],['y',1,511],['z',-29,79],['width',2,80],['depth',2,80],['height',1.8,20],['thickness',.05,.5]])if(!Number.isFinite(room[key])||room[key]<min||room[key]>max)throw Error('Invalid room '+key+'.');
      if(typeof room.ceiling!=='boolean')throw Error('Choose whether to generate a ceiling.');
      room.materials??={};
      room.overrides??=[];
      if(!Array.isArray(room.overrides)||room.overrides.length>256)throw Error('Too many manual room edits.');
      const edits=new Set();
      for(const edit of room.overrides){
        if(!edit||typeof edit.id!=='string'||edits.has(edit.id)||typeof edit.suppressed!=='boolean')throw Error('Invalid room component edit.');
        edits.add(edit.id);
        edit.delta??={};
        edit.properties??={};
        edit.unset??=[];
        for(const [key,value]of Object.entries(edit.delta))if(!transforms.includes(key)||!Number.isFinite(value))throw Error('Invalid component transform.');
        for(const [key,value]of Object.entries(edit.properties))if(!properties.includes(key)||!['string','number','boolean'].includes(typeof value)||typeof value==='number'&&!Number.isFinite(value))throw Error('Invalid component material/property.');
        for(const key of edit.unset)if(!properties.includes(key))throw Error('Invalid removed property.');
      }
    }

 v.members??=[];if(!Array.isArray(v.members)||v.members.length>24000)throw Error('Too many structural members.');const memberIds=new Set(),roomIds=new Set(v.rooms.map(/* @function construction.memberRoomId — Inputs: recipe. Returns actual parent identity for membership validation. */function(r){return r.id;}));for(const member of v.members){const key=member.kind+':'+member.id;if(!['primitive','object','event','sprite','light','blocker'].includes(member.kind)||typeof member.id!=='string'||!member.id||member.id.length>100||!roomIds.has(member.roomId)||memberIds.has(key))throw Error('Invalid structural member or room.');memberIds.add(key);}
for(const boundary of v.boundaries)if(!Array.isArray(boundary.parts)||boundary.parts.length!==2||boundary.parts[0]===boundary.parts[1])throw Error('A shared boundary needs two distinct wall identities.');
    for(const opening of v.openings){
      if(typeof opening.host!=='string'||!Number.isFinite(opening.offset)||!Number.isFinite(opening.width)||opening.width<.3||opening.width>20||!Number.isFinite(opening.height)||opening.height<.3||opening.height>20)throw Error('Invalid wall opening.');
      if(opening.doorEventId!==undefined&&typeof opening.doorEventId!=='string')throw Error('Invalid opening door reference.');
    }
    return v;
  }

/* @function construction.compile — Inputs: validated construction recipe and existing primitive list. Returns deterministic effective pieces plus recoverable conflict records. Preserves independent/legacy primitives; generated cache is rebuilt from recipes and overrides, never treated as a second authority. Shared walls are emitted once only when both physical boundaries agree; mismatches reject before commit rather than silently losing doors/materials. */
function compile(value,existing=[]){
    const v=validate(value);
    if(!v)return {
      primitives:existing,conflicts:[]
    };
    const generated=new Map(),conflicts=[],pending=[];
    for(const room of v.rooms){
      const shell=root.FrontierBuildingKit.shell({
        id:room.id,x:room.x,y:room.y,z:room.z,width:room.width,depth:room.depth,height:room.height,thickness:room.thickness,ceiling:room.ceiling,floorMaterial:room.materials.floor,wallMaterial:room.materials.wall,ceilingMaterial:room.materials.ceiling
      });
      const edits=new Map(room.overrides.map(/* @function construction.editKey — Inputs: override. Returns stable key/value pair. */function(edit){
        return [edit.id,edit];
      }));
      for(const piece of shell.primitives){
        piece.constructionRoom=room.id;
        piece.constructionBuilding=room.buildingId||'';
        piece.constructionStorey=room.storeyId||'';
        piece.constructionBase=structuredClone(piece);
        const edit=edits.get(piece.id);
        if(edit){
          edits.delete(piece.id);
          if(edit.suppressed)continue;
          for(const key of transforms)piece[key]=(piece[key]||0)+(edit.delta[key]||0);
          Object.assign(piece,edit.properties);
          for(const key of edit.unset)delete piece[key];
        }
        generated.set(piece.id,piece);
      }
      for(const edit of edits.values())pending.push({
        roomId:room.id,edit
      });
    }

 for(const boundary of v.boundaries){
      const [a,b]=boundary.parts.map(/* @function construction.boundaryPart — Inputs: stable wall identity. Returns effective wall before shared deduplication. */function(id){
        return generated.get(id);
      });
      if(!a||!b||a.moduleType!=='wall'||b.moduleType!=='wall')throw Error('Shared boundary '+boundary.id+' lost a wall. Restore or unlink it before resizing.');
      for(const key of transforms)if(Math.abs((a[key]||0)-(b[key]||0))>.001)throw Error('Shared boundary '+boundary.id+' no longer aligns. Unlink it or align both rooms.');
      a.sharedBoundary=boundary.id;
      a.sharedRooms=[a.constructionRoom,b.constructionRoom];
      generated.delete(b.id);
    }

 const byHost=new Map();
    for(const opening of v.openings){
      if(!byHost.has(opening.host))byHost.set(opening.host,[]);
      byHost.get(opening.host).push(opening);
    }
    for(const [id,openings]of byHost){
      const host=generated.get(id);
      if(!host||host.moduleType!=='wall')throw Error('Opening host is missing: '+id+'. Remove or retarget the opening first.');
      if(host.shape==='round')throw Error('Openings currently require a straight wall.');
      const alongX=host.w>=host.d,length=alongX?host.w:host.d;
      openings.sort(/* @function construction.sortOpenings — Inputs: opening pair. Returns ascending local wall center order for overlap validation. */function(a,b){
        return a.offset-b.offset;
      });
      let edge=-length/2;
      generated.delete(id);

 /* @function construction.wallSlice — Inputs: stable suffix, local start/end, base/height. Adds one effective host-derived solid slab with identical material. Mesh and collision both consume this same geometry; zero spans emit nothing. */
 function slice(suffix,start,end,z,h){
        if(end-start<.001||h<.001)return;
        const local=(start+end)/2,yaw=host.yaw||0,dx=alongX?local:0,dy=alongX?0:local,piece={
          ...host,id:suffix==='tail'?id+'_tail':suffix,x:host.x+Math.cos(yaw)*dx-Math.sin(yaw)*dy,y:host.y+Math.sin(yaw)*dx+Math.cos(yaw)*dy,w:alongX?end-start:host.w,d:alongX?host.d:end-start,z,h,openingHost:id
        };
        delete piece.constructionBase;
        piece.constructionBase=structuredClone(piece);
        generated.set(piece.id,piece);
      }

 for(let i=0;i<openings.length;i++){
        const o=openings[i],start=o.offset-o.width/2,end=o.offset+o.width/2;
        if(start<edge-.001||end>length/2+.001||o.height>host.h)throw Error('Opening '+o.id+' overlaps another opening or extends beyond its wall.');
        slice(o.id+'_side',edge,start,host.z,host.h);
        slice(o.id+'_lintel',start,end,host.z+o.height,host.h-o.height);
        edge=end;
      }
      slice('tail',edge,length/2,host.z,host.h);
    }

 for(const {
      roomId,edit
    }
    of pending){
      const piece=generated.get(edit.id);
      if(!piece){
        if(edit.suppressed)continue;
        conflicts.push({
          roomId,partId:edit.id,message:'Manual edit has no generated target; restore, detach or retarget before changing the room.'
        });
        continue;
      }
      if(edit.suppressed){
        generated.delete(edit.id);
        continue;
      }
      for(const key of transforms)piece[key]=(piece[key]||0)+(edit.delta[key]||0);
      Object.assign(piece,edit.properties);
      for(const key of edit.unset)delete piece[key];
    }

 if(conflicts.length)throw Error(conflicts[0].message+' ('+conflicts[0].partId+')');
    const independent=existing.filter(/* @function construction.independent — Inputs: existing primitive. Keeps original legacy/manual geometry; only explicit construction-owned derived pieces are replaced. */function(piece){
      return !piece.constructionRoom;
    });
    const primitives=independent.concat([...generated.values()]);
    if(primitives.length>256)throw Error('Room geometry exceeds 256 pieces.');
    return {
      primitives,conflicts
    };
  }

/* @function construction.capture — Inputs: before/current authored worlds at a single original transaction boundary. Records direct generated-component edits, deletion and explicit detachment as persistent overrides only when its recipe stayed unchanged. Derived opening fragments retain direct overrides; host-opening dimensions remain controlled by the opening inspector. No topology guessing or per-frame work. */
function capture(before,world){
    const old=before.interior?.construction,current=world.interior?.construction;
    if(!old||!current)return;
    for(const room of current.rooms){
      const previous=old.rooms.find(/* @function construction.previousRoom — Inputs: previous recipe. Returns same stable parent. */function(r){
        return r.id===room.id;
      });
      if(!previous||JSON.stringify(previous)!==JSON.stringify(room))continue;
      const edits=new Map((room.overrides||[]).map(/* @function construction.existingEdit — Inputs: override. Returns keyed retained intention. */function(edit){
        return [edit.id,edit];
      }));
      for(const prior of before.interior.primitives){
        if(prior.constructionRoom!==room.id)continue;
        if(!prior.constructionBase)continue;
        const part=world.interior.primitives.find(/* @function construction.currentPart — Inputs: effective primitive. Returns exact stable component. */function(p){
          return p.id===prior.id;
        });
        if(part&&JSON.stringify(part)===JSON.stringify(prior))continue;
        const edit={
          id:prior.id,suppressed:!part||!part.constructionRoom,delta:{},properties:{},unset:[]
        };
        if(!edit.suppressed){
          for(const key of transforms){
            const d=(part[key]||0)-(prior.constructionBase[key]||0);
            if(d)edit.delta[key]=d;
          }
          for(const key of properties)if(part[key]!==prior.constructionBase[key]){
            if(part[key]===undefined)edit.unset.push(key);
            else edit.properties[key]=part[key];
          }
        }
        edits.set(edit.id,edit);
      }
      room.overrides=[...edits.values()];
    }
  }

/* @function construction.synchronize — Inputs: authored world with optional connected rooms. Returns original unchanged world or a detached copy whose linked door transforms follow their effective host wall/opening. No runtime mutation; all host/door changes are validated before adoption. Removed linked events leave an empty opening, not a dangling reference. */
function synchronize(world){
    if(!world.interior?.construction)return world;
    const next=structuredClone(world),recipe=validate(next.interior.construction),uncut={
      ...recipe,openings:[],rooms:recipe.rooms.map(/* @function construction.uncutSource — Inputs: canonical parent. Returns host-only override view for door alignment; derived fragment edits stay in the authoritative full recipe. */function(room){
        const ids=new Set(['floor','ceiling','north','south','east','west'].map(/* @function construction.hostPartId — Inputs: standard generated role. Returns canonical original host identity. */function(role){
          return room.id+'-'+role;
        }));
        return {
          ...room,overrides:room.overrides.filter(/* @function construction.hostOverride — Inputs: authored override. Returns original host-affecting edits only for this temporary uncut query. */function(edit){
            return ids.has(edit.id);
          })
        };
      })
    },parts=compile(uncut,next.interior.primitives).primitives;
    for(const opening of recipe.openings){
      if(!opening.doorEventId)continue;
      const event=next.events.find(/* @function construction.linkedEvent — Inputs: authored event. Returns attached door identity. */function(e){
        return e.id===opening.doorEventId;
      });
      if(!event){
        delete opening.doorEventId;
        continue;
      }
      const host=parts.find(/* @function construction.linkedHost — Inputs: effective uncut primitive. Returns authoritative opening host. */function(p){
        return p.id===opening.host;
      });
      if(!host)throw Error('Linked door host is missing: '+opening.host);recipe.members=recipe.members.filter(/* @function construction.doorOwnership — Inputs: typed member. Removes stale organizational assignment for a host-attached door; its actual host owns this relationship. */function(m){return m.kind!=='event'||m.id!==event.id;});recipe.members.push({kind:'event',id:event.id,roomId:host.constructionRoom});
      const yaw=(host.yaw||0)+(host.w>=host.d?0:Math.PI/2),local=opening.offset-opening.width/2;
      event.x=host.x+Math.cos(yaw)*local;
      event.y=host.y+Math.sin(yaw)*local;
      event.heightOffset=host.z-(root.FrontierTerrain?.height(next,event.x,event.y)||0);
      if(event.spatial){
        event.spatial.rotation=[0,0,yaw*180/Math.PI];
        event.spatial.scale=[opening.width/.9,1,opening.height/2.1];
      }
    }
    recipe.members=recipe.members.filter(/* @function construction.liveMember — Inputs: typed ownership link. Retains only authored members still present after explicit deletion; no object is moved or recreated. */function(member){const list=member.kind==='event'?next.events:member.kind==='object'?next.objects:member.kind==='light'?next.lighting?.lights:next.interior[{primitive:'primitives',sprite:'sprites',blocker:'blockers'}[member.kind]];return list?.some(/* @function construction.memberExists — Inputs: source record. Returns stable membership identity. */function(record){return record.id===member.id;});});next.interior.construction=recipe;
    return next;
  }

root.FrontierConstruction={
    validate,compile,capture,synchronize
  };


})(typeof window==='undefined'?globalThis:window);
