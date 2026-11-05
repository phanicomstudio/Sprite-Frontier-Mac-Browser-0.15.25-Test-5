/* October 29, 2026: focused hybrid construction tools. Original scene transactions remain the only mutation/history owner. */
(/* @function constructionEditor.install — Inputs: browser namespace. Publishes authoring factory; exports omit this UI and retain the shared pure construction compiler. */function(root){

'use strict';

/* @function constructionEditor.create — Inputs: original world/game/editing/mutate API. Returns mount. All forms are detached until explicit Apply or completed viewport rectangle. Optional grouping never moves members implicitly. */
function create(api){
    let drag=null,drawOptions=null,preview=null;

 /* @function constructionEditor.read — Inputs: none. Returns detached current additive construction or an empty recipe preserving all legacy collections. */
 function read(){
      return structuredClone(api.world().interior?.construction||{
        version:1,buildings:[],storeys:[],rooms:[],boundaries:[],openings:[]
      });
    }

 /* @function constructionEditor.commit — Inputs: validated draft and optional event operation. Returns existing single transaction result. Creates an outdoor geometry container only when needed; existing fixed artwork, terrain and legacy primitives remain intact. */
 function commit(draft,events){
      if(!api.editing())throw Error('Return to the editor before building.');
      const checked=root.FrontierConstruction.validate(draft);
      return api.mutate(/* @function constructionEditor.apply — Inputs: none. Adopts only detached recipes/optional linked event inside original rollback boundary; compiler validates effective geometry afterward. */function(){
        const world=api.world();
        world.interior??=root.FrontierInterior.structureDraft(world);
        world.interior.construction=checked;
        if(events)events(world);
      });
    }

 /* @function constructionEditor.field — Inputs: parent, accessible label, control kind, value and optional choices. Returns detached safely labeled control. */
 function field(parent,label,type,value,options){
      const wrap=document.createElement('label'),input=document.createElement(type==='select'?'select':'input');
      wrap.textContent=label;
      if(type!=='select')input.type=type;
      for(const [id,name]of options||[])input.append(new Option(name,id));
      if(type==='checkbox')input.checked=!!value;
      else input.value=value??'';
      input.setAttribute('aria-label',label);
      wrap.append(input);
      parent.append(wrap);
      return input;
    }

 /* @function constructionEditor.button — Inputs: parent, readable label and documented action. Returns button; action failure retains draft and reports readable status, never auto retries mutation. */
 function button(parent,label,action){
      const b=document.createElement('button');
      b.type='button';
      b.textContent=label;
      b.onclick=/* @function constructionEditor.run — Inputs: ignored click. Executes explicit authoring action and displays failures inside active form. */function(){
        try{
          action();
        }
        catch(error){
          parent.querySelector('[role=status]').textContent=error.message;
        }
      };
      parent.append(b);
      return b;
    }

 /* @function constructionEditor.mount — Inputs: current contextual panel. Replaces it with building/storey/room, material and linked-opening tools. Existing selected components and shared gizmos keep their original scene owner. No project mutation on mounting. */
 function mount(parent){
      drawOptions=null;
      parent.replaceChildren();
      const draft=read(),status=document.createElement('p');
      status.setAttribute('role','status');
      parent.append(status);
      const heading=document.createElement('h3');
      heading.textContent='Rooms & buildings';
      parent.prepend(heading);
      const building=field(parent,'Building','select','',[['','Ungrouped'],...draft.buildings.map(/* @function constructionEditor.buildingChoice — Inputs: building. Returns actual structural parent choice. */function(row){
        return [row.id,row.name];
      })]),buildingName=field(parent,'Building name','text','');
      button(parent,'Add building',/* @function constructionEditor.addBuilding — Inputs: none. Adds optional organizational parent with no implicit geometry movement. */function(){
        const d=read();
        d.buildings.push({
          id:'building-'+crypto.randomUUID(),name:buildingName.value
        });
        if(commit(d))mount(parent);
      });

 const storey=field(parent,'Storey','select','',[['','No storey'],...draft.storeys.map(/* @function constructionEditor.storeyChoice — Inputs: storey. Returns actual elevation-reference parent. */function(row){
        return [row.id,row.name+' ('+row.elevation+' m)'];
      })]),storeyName=field(parent,'Storey name','text','Ground floor'),elevation=field(parent,'Storey elevation (metres)','number',0);
      button(parent,'Add storey',/* @function constructionEditor.addStorey — Inputs: none. Creates named optional building-linked elevation reference; existing room world coordinates remain unchanged. */function(){
        const d=read();
        d.storeys.push({
          id:'storey-'+crypto.randomUUID(),name:storeyName.value,elevation:Number(elevation.value),buildingId:building.value
        });
        if(commit(d))mount(parent);
      });

 const roomChoice=field(parent,'Room','select','',[['','New room'],...draft.rooms.map(/* @function constructionEditor.roomChoice — Inputs: recipe. Returns stable parent choice. */function(row){
        return [row.id,row.name];
      })]),name=field(parent,'Room name','text','Room'),x=field(parent,'Center X','number',api.game().player.x),y=field(parent,'Center Y','number',api.game().player.y),z=field(parent,'Floor elevation (metres)','number',0),width=field(parent,'Width (metres)','number',6),depth=field(parent,'Depth (metres)','number',6),height=field(parent,'Wall height (metres)','number',3),ceiling=field(parent,'Add ceiling','checkbox',true),materials={};
      for(const role of ['wall','floor','ceiling']){
        const select=field(parent,role[0].toUpperCase()+role.slice(1)+' material','select','',[['','Plain white']]);
        root.FrontierAuthoringTools169.materials(select);
        materials[role]=select;
      }

 roomChoice.onchange=/* @function constructionEditor.selectRoom — Inputs: change ignored. Populates recipe controls, retaining stable parent/override identities. This does not detach edited generated components. */function(){
        const room=draft.rooms.find(/* @function constructionEditor.roomMatch — Inputs: recipe. Returns currently selected stable room. */function(r){
          return r.id===roomChoice.value;
        });
        if(!room)return;
        for(const [control,key]of [[name,'name'],[x,'x'],[y,'y'],[z,'z'],[width,'width'],[depth,'depth'],[height,'height'],[building,'buildingId'],[storey,'storeyId']])control.value=room[key]??'';
        ceiling.checked=room.ceiling;
        for(const role of Object.keys(materials))materials[role].value=room.materials[role]?.texture||'';
      };

 /* @function constructionEditor.roomDraft — Inputs: optional dragged rectangle. Returns selected or new room preserving compatible overrides/group ownership; explicit coordinates are metres. Assigning a storey never changes elevation unless Align is pressed. */
 function roomDraft(rect){
        const prior=draft.rooms.find(/* @function constructionEditor.priorRoom — Inputs: recipe. Returns selected parent for persistent overrides. */function(r){
          return r.id===roomChoice.value;
        });
        const material={};
        for(const role of Object.keys(materials))material[role]={
          texture:materials[role].value||undefined,tileSize:2,...(role==='wall'?{
            textureMapping:'wallHeight'
          }:{})
        };
        return {
          ...prior,id:prior?.id||'room-'+crypto.randomUUID(),name:name.value,x:Number(x.value),y:Number(y.value),z:Number(z.value),width:Number(width.value),depth:Number(depth.value),height:Number(height.value),thickness:prior?.thickness||.2,ceiling:ceiling.checked,materials:material,overrides:prior?.overrides||[],buildingId:building.value,storeyId:storey.value,...rect
        };
      }

 /* @function constructionEditor.saveRoom — Inputs: optional drawn footprint. Commits one complete room recipe; incompatible shared walls/openings reject atomically with old geometry untouched. */
 function saveRoom(rect){
        const room=roomDraft(rect),d=read();
        d.rooms=d.rooms.filter(/* @function constructionEditor.otherRoom — Inputs: recipe. Retains all unrelated identities. */function(r){
          return r.id!==room.id;
        });
        d.rooms.push(room);
        if(commit(d)){
          drawOptions=null;
          mount(parent);
        }
      }

 button(parent,'Create / update room',/* @function constructionEditor.numericRoom — Inputs: none. Applies explicit source controls in one Undo step. */function(){
        saveRoom();
      });
      button(parent,'Draw rectangle in viewport',/* @function constructionEditor.armRectangle — Inputs: none. Arms one drag on the existing viewport; dimensions are world-space and no geometry is committed until pointer release. */function(){
        drawOptions={
          save:saveRoom,status
        };
        status.textContent='Drag two floor corners in the viewport. Escape cancels.';
      });
      button(parent,'Align floor to selected storey',/* @function constructionEditor.alignStorey — Inputs: none. Explicitly copies elevation reference into local floor draft; grouping alone never moves geometry. */function(){
        const level=draft.storeys.find(/* @function constructionEditor.level — Inputs: storey. Returns selected parent. */function(s){
          return s.id===storey.value;
        });
        if(!level)throw Error('Choose a storey.');
        z.value=level.elevation;
      });

 button(parent,'Rename selected building',/* @function constructionEditor.renameBuilding — Inputs: none. Renames only selected organizational parent; stable IDs/world coordinates are unchanged. */function(){
        const d=read(),b=d.buildings.find(/* @function constructionEditor.namedBuilding — Inputs: parent. Returns selected building identity. */function(b){
          return b.id===building.value;
        });
        if(!b)throw Error('Choose a building.');
        b.name=buildingName.value;
        if(commit(d))mount(parent);
      });

 button(parent,'Rename / edit selected storey',/* @function constructionEditor.renameStorey — Inputs: none. Updates selected elevation reference and name; existing room positions remain explicit and unchanged. */function(){
        const d=read(),s=d.storeys.find(/* @function constructionEditor.namedStorey — Inputs: parent. Returns selected storey identity. */function(s){
          return s.id===storey.value;
        });
        if(!s)throw Error('Choose a storey.');
        s.name=storeyName.value;
        s.elevation=Number(elevation.value);
        s.buildingId=building.value;
        if(commit(d))mount(parent);
      });

 button(parent,'Isolate selected storey geometry',/* @function constructionEditor.isolate — Inputs: none. Sets editor-only visual isolation; collision, project data and playtest/export retain every storey. No history entry. */function(){
        if(!storey.value)throw Error('Choose a storey.');
        root.FrontierAuthorView.state.storey=storey.value;
        status.textContent='Only this storey geometry is shown. Gameplay geometry is unchanged.';
      });

 button(parent,'Show all storeys',/* @function constructionEditor.showAll — Inputs: none. Clears transient editor geometry isolation without altering authored visibility or collision. */function(){
        root.FrontierAuthorView.state.storey='';
      });

button(parent,'Assign selection to selected room',/* @function constructionEditor.assignMembers — Inputs: none. Adds actual typed parent links for independent geometry, models, props, lights and events without changing world coordinates. Generated parts must be detached before reparenting. */function(){if(!roomChoice.value)throw Error('Choose a room.');const d=read();d.members??=[];const refs=root.FrontierScene.selection();if(!refs.length)throw Error('Select one or more objects.');for(const ref of refs){const part=root.FrontierScene.snapshot(ref);if(part?.constructionRoom)throw Error('Make generated parts independent before changing their room.');d.members=d.members.filter(/* @function constructionEditor.previousMembership — Inputs: typed link. Keeps all except explicit selected instance being reassigned. */function(m){return m.kind!==ref.kind||m.id!==ref.id;});d.members.push({kind:ref.kind,id:ref.id,roomId:roomChoice.value});}if(commit(d))mount(parent);});
button(parent,'Delete building group (keep rooms)',/* @function constructionEditor.deleteBuilding — Inputs: none. Removes organizational parent only and clears its child references; geometry/objects retain exact world coordinates and their own recipes. */function(){const d=read(),id=building.value;if(!id)throw Error('Choose a building.');d.buildings=d.buildings.filter(/* @function constructionEditor.keepBuilding — Inputs: building. Returns other organizational parents. */function(b){return b.id!==id;});for(const r of d.rooms)if(r.buildingId===id)r.buildingId='';for(const s of d.storeys)if(s.buildingId===id)s.buildingId='';if(commit(d))mount(parent);});
button(parent,'Delete storey group (keep rooms)',/* @function constructionEditor.deleteStorey — Inputs: none. Removes elevation-reference grouping only; explicit room Z and all geometry remain unchanged. */function(){const d=read(),id=storey.value;if(!id)throw Error('Choose a storey.');d.storeys=d.storeys.filter(/* @function constructionEditor.keepStorey — Inputs: storey. Returns other references. */function(s){return s.id!==id;});for(const r of d.rooms)if(r.storeyId===id)r.storeyId='';if(commit(d))mount(parent);});
 button(parent,'Delete selected room',/* @function constructionEditor.deleteRoom — Inputs: none. Explicitly deletes one recipe, its dependent boundaries/openings and linked doors in a single Undo transaction. Independent detached geometry remains authored. */function(){
        if(!roomChoice.value)throw Error('Choose a room.');
        const d=read(),id=roomChoice.value,doors=new Set();
        d.members=(d.members||[]).filter(/* @function constructionEditor.keepRoomMembership — Inputs: ownership link. Explicit room deletion leaves its independent objects ungrouped, not deleted. */function(m){return m.roomId!==id;});d.rooms=d.rooms.filter(/* @function constructionEditor.otherParent — Inputs: recipe. Returns all except selected parent. */function(r){
          return r.id!==id;
        });
        d.boundaries=d.boundaries.filter(/* @function constructionEditor.keepBoundary — Inputs: shared boundary. Retains only boundaries not owned by deleted room. */function(b){
          return !b.parts.some(/* @function constructionEditor.roomBoundary — Inputs: stable part ID. Returns exact deleted-room component prefix. */function(part){
            return part.startsWith(id+'-');
          });
        });
        d.openings=d.openings.filter(/* @function constructionEditor.keepOpening — Inputs: opening. Collects linked door of deleted parent and preserves other cuts. */function(o){
          if(o.host.startsWith(id+'-')){
            if(o.doorEventId)doors.add(o.doorEventId);
            return false;
          }
          return true;
        });
        if(commit(d,/* @function constructionEditor.removeRoomDoors — Inputs: source world inside original history. Removes only explicitly room-owned door events. */function(w){
          w.events=w.events.filter(/* @function constructionEditor.keepRoomEvent — Inputs: event. Returns events outside removed ownership set. */function(e){
            return !doors.has(e.id);
          });
        }))mount(parent);
      });

 button(parent,'Unlink selected shared wall',/* @function constructionEditor.unlinkBoundary — Inputs: none. Removes explicit join relationship from selected canonical wall; both original room recipes regenerate separate walls for intentional independent editing. Undo restores the shared relationship. */function(){
        const ref=root.FrontierScene.selection()[0],p=ref&&root.FrontierScene.snapshot(ref);
        if(!p?.sharedBoundary)throw Error('Select a shared wall.');
        const d=read();
        d.boundaries=d.boundaries.filter(/* @function constructionEditor.otherBoundary — Inputs: boundary. Returns all unrelated joins. */function(b){
          return b.id!==p.sharedBoundary;
        });
        if(commit(d))mount(parent);
      });

 const offset=field(parent,'Opening center offset along wall (metres)','number',0),openingWidth=field(parent,'Opening width (metres)','number',1),openingHeight=field(parent,'Opening height (metres)','number',2.1),behavior=field(parent,'Door behavior','select','opening',[['opening','Empty opening'],['local','Local hinged door'],['transfer','Transfer door']]);

 const openingChoice=field(parent,'Opening','select','',[['','Choose opening'],...draft.openings.map(/* @function constructionEditor.openingChoice — Inputs: attached opening. Returns its stable cut identity/host for explicit editing or removal. */function(o){
        return [o.id,o.id+' — '+o.host];
      })]),uncut=root.FrontierConstruction.compile({
        ...draft,rooms:draft.rooms.map(/* @function constructionEditor.uncutRoom — Inputs: canonical recipe. Returns temporary option-only source without overrides, allowing explicit retarget repair without consuming authored edits. */function(r){
          return {
            ...r,overrides:[]
          };
        }),openings:[]
      },[]).primitives,hostChoice=field(parent,'Opening host wall','select','',[['','Choose wall'],...uncut.filter(/* @function constructionEditor.hostWall — Inputs: uncut generated component. Returns straight wall candidates shared by actual generator. */function(p){
        return p.moduleType==='wall';
      }).map(/* @function constructionEditor.hostOption — Inputs: wall. Returns stable host identity/name. */function(p){
        return [p.id,p.name+' — '+p.id];
      })]);

 openingChoice.onchange=/* @function constructionEditor.chooseOpening — Inputs: picker change ignored. Loads one canonical cut, never its derived jamb geometry, into local dimensional/host controls. */function(){
        const o=draft.openings.find(/* @function constructionEditor.openingMatch — Inputs: cut. Returns explicit picker identity. */function(o){
          return o.id===openingChoice.value;
        });
        if(o){
          offset.value=o.offset;
          openingWidth.value=o.width;
          openingHeight.value=o.height;
          hostChoice.value=o.host;
        }
      };

 button(parent,'Apply opening dimensions / host',/* @function constructionEditor.editOpening — Inputs: none. Validates one explicit opening resize/retarget together with its linked door alignment and collision slabs in one original Undo transaction. Incompatible manual child edits remain recoverable rather than discarded. */function(){
        const d=read(),o=d.openings.find(/* @function constructionEditor.editedOpening — Inputs: cut. Returns explicit selected cut. */function(o){
          return o.id===openingChoice.value;
        });
        if(!o)throw Error('Choose an opening.');
        Object.assign(o,{
          host:hostChoice.value,offset:Number(offset.value),width:Number(openingWidth.value),height:Number(openingHeight.value)
        });
        if(commit(d))mount(parent);
      });

 const destination=field(parent,'Destination cell','select','',[['','Choose cell'],...api.maps().map(/* @function constructionEditor.destination — Inputs: map record. Returns stable destination choice; reciprocal arrival stays owned by existing transfer resolver. */function(map){
        return [map.id,map.name];
      })]),transition=field(parent,'Transition','select','door',[['door','Cinematic door'],['melt','Screen melt'],['fade','Fade'],['immediate','Immediate']]);

 button(parent,'Cut opening in selected wall',/* @function constructionEditor.cutOpening — Inputs: none. Creates attached opening on one selected connected generated wall and optionally an actual local event or existing transfer-door draft. Host mesh and collision are compiled from identical slabs. */function(){
        const refs=root.FrontierScene.selection(),part=refs.length===1?root.FrontierScene.snapshot(refs[0]):null;
        if(!part?.constructionRoom||part.moduleType!=='wall'||part.openingHost)throw Error('Select one generated wall of a connected room.');
        const d=read(),id='opening-'+crypto.randomUUID(),opening={
          id,host:part.id,offset:Number(offset.value),width:Number(openingWidth.value),height:Number(openingHeight.value)
        };
        let event;
        if(behavior.value==='local'||behavior.value==='transfer'){
          event=root.FrontierLocalDoors.create(part,opening);
          opening.doorEventId=event.id;
          if(behavior.value==='transfer'){
            if(!destination.value)throw Error('Choose a destination cell.');
            delete event.extensions.localDoor;
            event.pages=event.pages.slice(0,1);
            event.pages[0].commands=[];
            event.spatial.collisionMode='mesh';
            event.extensions.hub=root.FrontierHubWorkbench.validateEvent({
              kind:'door',map:destination.value,entrance:'auto-door',arrivalYaw:-(event.spatial.rotation[2]||0),transition:{
                effect:transition.value
              }
            });
            event.name='Transfer door';
          }
        }
        d.openings.push(opening);
        if(commit(d,/* @function constructionEditor.addDoorEvent — Inputs: source world inside transaction. Appends optional linked local event; compiler/event validation can roll back both. */function(world){
          if(event)world.events.push(event);
        }))mount(parent);
      });

 button(parent,'Remove selected opening and linked door',/* @function constructionEditor.removeOpening — Inputs: none. Removes selected opening fragment through its host relationship and deletes only its linked event in one Undo; complete wall is restored by compiler. */function(){
        const part=root.FrontierScene.snapshot(root.FrontierScene.selection()[0]),d=read(),opening=d.openings.find(/* @function constructionEditor.selectedOpening — Inputs: opening. Returns selected fragment host match. */function(o){
          return openingChoice.value?o.id===openingChoice.value:o.host===part?.openingHost;
        });
        if(!opening)throw Error('Select a doorway wall fragment.');
        d.openings=d.openings.filter(/* @function constructionEditor.otherOpening — Inputs: opening. Keeps unrelated attached cuts. */function(o){
          return o.id!==opening.id;
        });
        for(const room of d.rooms)room.overrides=room.overrides.filter(/* @function constructionEditor.removeCutEdits — Inputs: override. Explicit opening removal discards only its owned fragment overrides inside the same Undo snapshot. Other wall/room edits remain. */function(edit){
          return !edit.id.startsWith(opening.id+'_')&&(edit.id!==opening.host+'_tail'||d.openings.some(/* @function constructionEditor.remainingHostCut — Inputs: other cut. Returns continued host-tail ownership. */function(o){
            return o.host===opening.host;
          }));
        });
        commit(d,/* @function constructionEditor.deleteLinkedDoor — Inputs: source world. Removes exactly linked event; arbitrary events remain intact. */function(world){
          world.events=world.events.filter(/* @function constructionEditor.keepEvent — Inputs: event. Returns all except removed cut’s linked event. */function(e){
            return e.id!==opening.doorEventId;
          });
        });
        mount(parent);
      });

 button(parent,'Join two selected walls as one boundary',/* @function constructionEditor.join — Inputs: none. Explicitly joins exactly coincident generated wall components. Independent parallel/overlapping walls remain legal until this command; compiler rejects disagreement rather than duplicating invisible collision. */function(){
        const refs=root.FrontierScene.selection(),parts=refs.map(/* @function constructionEditor.selectedWall — Inputs: typed reference. Returns detached current part. */function(ref){
          return root.FrontierScene.snapshot(ref);
        });
        if(parts.length!==2||parts.some(/* @function constructionEditor.notWall — Inputs: selected record. Rejects independent/nonwall/opening fragments. */function(p){
          return !p?.constructionRoom||p.moduleType!=='wall'||p.openingHost;
        }))throw Error('Select two generated walls.');
        const d=read();
        d.boundaries.push({
          id:'boundary-'+crypto.randomUUID(),parts:parts.map(/* @function constructionEditor.wallIdentity — Inputs: selected wall. Returns stable original component identity. */function(p){
            return p.id;
          })
        });
        commit(d);
        mount(parent);
      });

 const repair=document.createElement('details'),summary=document.createElement('summary');
      summary.textContent='Manual edit recovery';
      repair.append(summary);
      const repairRoom=field(repair,'Edited room','select','',draft.rooms.map(/* @function constructionEditor.repairRoom — Inputs: room. Returns stable recipe choice. */function(r){
        return [r.id,r.name];
      }));
      button(repair,'Restore selected room generated parts',/* @function constructionEditor.restore — Inputs: none. Explicitly clears only selected parent’s manual override ledger in one Undo. Independent detached pieces remain for author overlap review. */function(){
        const d=read(),room=d.rooms.find(/* @function constructionEditor.restoreRoom — Inputs: room. Returns exact recovery parent. */function(r){
          return r.id===repairRoom.value;
        });
        if(!room)throw Error('Choose a room.');
        room.overrides=[];
        if(commit(d))mount(parent);
      });
      const repairStatus=document.createElement('p');
      repairStatus.setAttribute('role','status');
      repair.append(repairStatus);
      parent.append(repair);


    }

 const view=document.getElementById('view');

 /* @function constructionEditor.point — Inputs: native pointer. Returns existing active-camera ground intersection in world metres, or null outside geometry. Original ray/projection owners remain unchanged. */
 function point(event){
      const rect=view.getBoundingClientRect(),p=root.FrontierRender.groundPoint(api.game(),(event.clientX-rect.left)/rect.width*(api.game().viewWidth||640),(event.clientY-rect.top)/rect.height*480),snap=Number(document.getElementById('sharedMoveSnap')?.value??.5);
      if(p&&snap>0){
        p.x=Math.round(p.x/snap)*snap;
        p.y=Math.round(p.y/snap)*snap;
      }
      return p;
    }

 view.addEventListener('pointerdown',/* @function constructionEditor.beginDrag — Inputs: viewport pointer. Captures left drag only while room drawing is armed in Edit Mode; other tools/gameplay retain input. No history mutation until release. */function(event){
      if(!drawOptions||!api.editing()||event.button!==0)return;
      const p=point(event);
      if(!p)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      drag={
        start:p,pointer:event.pointerId
      };
      view.setPointerCapture(event.pointerId);
    },{
      capture:true
    });

 view.addEventListener('pointerup',/* @function constructionEditor.finishDrag — Inputs: captured release. Creates one >=2-metre rectangular footprint using actual floor corners, preserving height/material draft. Invalid footprint leaves old geometry intact and reports status. */function(event){
      if(!drag||event.pointerId!==drag.pointer)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const end=point(event),start=drag.start;
      drag=null;
      if(view.hasPointerCapture(event.pointerId))view.releasePointerCapture(event.pointerId);
      try{
        if(!end)throw Error('Release over a floor.');
        const width=Math.abs(end.x-start.x),depth=Math.abs(end.y-start.y);
        if(width<2||depth<2)throw Error('Draw a room at least 2 metres wide and deep.');
        drawOptions.save({
          x:(start.x+end.x)/2,y:(start.y+end.y)/2,width,depth
        });
      }
      catch(error){
        if(drawOptions)drawOptions.status.textContent=error.message;
      }
    },{
      capture:true
    });

 document.addEventListener('keydown',/* @function constructionEditor.cancelDraw — Inputs: keydown. Escape cancels only an armed room rectangle, releasing held capture without committing geometry. Runtime/menu input is unaffected when inactive. */function(event){
      if(event.key==='Escape'&&drawOptions){
        drawOptions.status.textContent='Room drawing cancelled.';
        drawOptions=null;
        drag=null;
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },{
      capture:true
    });

 /* @function constructionEditor.cancel — Inputs: none. Releases only this tool’s armed pointer capture and transient draft. Used on tool/cell/mode changes so an old footprint can never commit into a different map. No authored mutation or history. */
 function cancel(){
      if(drag&&view.hasPointerCapture(drag.pointer))view.releasePointerCapture(drag.pointer);
      drag=null;
      drawOptions=null;
    }

 return {
      mount,cancel
    };


  }

root.FrontierConstructionEditor={
    create
  };


})(window);
