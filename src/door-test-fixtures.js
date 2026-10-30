/* October 29, 2026: compact door acceptance cells replace redundant legacy room examples in fresh projects. Existing saved maps are never removed by this fixture builder. */
(/* @function doorTests.install — Inputs: browser namespace. Publishes deterministic fixture creation; no source/save changes at module installation. */function(root){

'use strict';

/* @function doorTests.create — Inputs: existing authored baseline. Returns three validated connected cells: 3D shared-wall/local hinge hall, 3D receiving room and isometric receiving courtyard. Includes explicit reciprocal cinematic/melt/fade pairs and actual wall cuts. Uses only existing project assets and runtime event state. */
function create(base){

 /* @function doorTests.cell — Inputs: stable cell ID/name and optional isometric flag. Returns detached cleared map retaining project style/material settings; floor physics use ordinary generated geometry. */
 function cell(id,name,iso=false){
      const w=structuredClone(base);
      w.width=32;
      w.height=32;
      delete w.size;
      w.objects=[];
      w.events=[];
      w.spawn={
        x:12,y:10,z:0
      };
      delete w.travel;
      w.terrain={
        mode:'flat',amplitude:0,frequency:.1
      };
      w.interior=root.FrontierInterior.structureDraft({
        ...w,interior:undefined
      });
      w.interior.outdoor=iso;
      if(!iso)delete w.interior.outdoor;
      w.interior.floor=[[2,2],[30,2],[30,30],[2,30]];
      w.interior.construction={
        version:1,buildings:[],storeys:[],rooms:[],boundaries:[],openings:[]
      };
      w.presentation=root.FrontierIsometric.validate({
        mode:iso?'isometric':'perspective'
      });
      return {
        id,name,world:w
      };
    }

 /* @function doorTests.room — Inputs: target map, stable room ID, center X/Y and clear width/depth. Appends one deterministic recipe with ordinary wall/floor/ceiling materials; no manual duplicate primitives. */
 function room(map,id,x,y,width,depth){
      map.world.interior.construction.rooms.push({
        id,name:id,x,y,z:0,width,depth,height:3,thickness:.2,ceiling:true,materials:{
          wall:{
            texture:'img/materials/walls/Tex_Castle_2.png',tileSize:2
          },floor:{
            texture:'img/materials/floors/prop_wood_floor1.png',tileSize:2
          },ceiling:{
            texture:'img/materials/ceilings/prop_tin_ceiling1.png',tileSize:2
          }
        },overrides:[]
      });
    }

 const hall=cell('door-test-hall','Door Test Hall — local + transfers'),roomCell=cell('door-test-room','Door Test Room — cinematic + fade'),courtyard=cell('door-test-iso','Door Test Courtyard — isometric melt',true);
    room(hall,'hall-left',8,10,8,10);
    room(hall,'hall-right',16.2,10,8,10);
    room(roomCell,'receiving-room',12,12,12,12);
    room(courtyard,'courtyard-room',12,12,12,12);
    hall.world.spawn={
      x:8,y:10,z:0
    };
    hall.world.interior.construction.boundaries.push({
      id:'hall-shared',parts:['hall-left-east','hall-right-west']
    });

 /* @function doorTests.door — Inputs: cell, stable event/opening IDs, host wall, local offset and optional destination/effect. Adds one actual opening plus fitted event. Local uses ordinary self-switch; transfer uses existing reciprocal arrival resolver and presentation. */
 function door(map,id,host,offset,destination,target,effect){
      const c=map.world.interior.construction,wall=root.FrontierConstruction.compile(c).primitives.find(/* @function doorTests.host — Inputs: part. Returns exact uncut host identity. */function(p){
        return p.id===host;
      });
      if(!wall)throw Error('Door fixture host is missing.');
      const opening={
        id:'opening-'+id,host,offset,width:1,height:2.1
      },e=root.FrontierLocalDoors.create(wall,opening);
      e.id=id;
      e.name=destination?effect+' door':'Local hinged door';
      for(const zone of e.spatial.interactionZones)zone.eventId=id;
      e.heightOffset=wall.z-root.FrontierTerrain.height(map.world,e.x,e.y);
      if(destination){
        delete e.extensions.localDoor;
        e.pages=e.pages.slice(0,1);
        e.pages[0].commands=[];
        e.spatial.collisionMode='mesh';
        e.extensions.hub=root.FrontierHubWorkbench.validateEvent({
          kind:'door',map:destination,entrance:'door:'+target,arrivalYaw:0,transition:{
            effect
          }
        });
      }
      opening.doorEventId=id;
      c.openings.push(opening);
      map.world.events.push(e);
    }

 door(hall,'local-hall','hall-left-east',0);
    door(hall,'cinematic-out','hall-left-south',2,roomCell.id,'cinematic-back','door');

 // A host with an earlier cut is recovered from its immutable generator, not a derived jamb.
 const retained=hall.world.interior.construction.openings;
    hall.world.interior.construction.openings=[];
    door(hall,'melt-out','hall-left-south',-2,courtyard.id,'melt-back','melt');
    hall.world.interior.construction.openings.push(...retained);

 door(hall,'fade-out','hall-right-south',0,roomCell.id,'fade-back','fade');
    door(roomCell,'cinematic-back','receiving-room-south',-2,hall.id,'cinematic-out','door');
    const receivingCuts=roomCell.world.interior.construction.openings;
    roomCell.world.interior.construction.openings=[];
    door(roomCell,'fade-back','receiving-room-south',2,hall.id,'fade-out','fade');
    roomCell.world.interior.construction.openings.push(...receivingCuts);
    door(courtyard,'melt-back','courtyard-room-south',0,hall.id,'melt-out','melt');

 return [hall,roomCell,courtyard].map(/* @function doorTests.validateCell — Inputs: complete fixture record. Returns actual validated world, detecting collision/ID/reference errors before adding examples. */function(map){
      return {
        ...map,world:root.FrontierWorld.validate(map.world)
      };
    });


  }

root.FrontierDoorTests={
    create
  };


})(window);
