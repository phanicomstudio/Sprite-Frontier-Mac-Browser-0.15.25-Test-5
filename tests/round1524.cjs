/* October 12, 2026: native round geometry acceptance. Hollow shells must not
 * block their centers; physics and rendering consume identical faceted surfaces. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const scope={console};scope.globalThis=scope;scope.window=scope;
for(const file of ['round-geometry','room-physics','building-kit','interiors','room-surfaces','model-transform','model-scene','model-mesh-collision','model-events','model-collision'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/'+file+'.js'),'utf8'),scope);
const geometry=scope.FrontierRoundGeometry,physics=scope.FrontierRoomPhysics;
const wall={id:'tower',name:'Tower wall',shape:'round',x:10,y:10,z:0,w:8,d:8,h:3,radius:4,innerRadius:3.8,segments:32,color:'#ffffff'};
const floor={...wall,id:'floor',name:'Floor',innerRadius:0,z:-.2,h:.2,moduleType:'floor'};
const ceiling={...floor,id:'ceiling',name:'Ceiling',z:3,moduleType:'ceiling'};
const world={interior:{primitives:[wall,floor,ceiling],blockers:[]}};
assert.equal(physics.blocked(world,10,10,0),false,'Hollow center must remain clear');
assert.equal(physics.blocked(world,13.9,10,0),true,'Actual ring wall blocks body');
assert.equal(physics.blocked(world,14.3,10,0),false,'Outside enclosing rectangle is not a wall');
assert.equal(physics.support(world,10,10,-1,1),0,'Round floor supports body at center');
assert.equal(physics.support(world,14.4,10,-1,1),null,'Floor bounding square cannot support outside disk');
assert.equal(physics.vertical(world,{x:10,y:10,z:0,height:1.65},2),1.35,'Round ceiling blocks jumping');
assert.equal(physics.vertical(world,{x:10,y:10,z:2,height:1.65},-.5),0,'Round floor catches falling actor');
const arc={...wall,arcSweep:Math.PI};
assert.equal(physics.blocked({interior:{primitives:[arc]}},10,6.1,0),false,'Open arc half remains passable');
assert.equal(physics.blocked({interior:{primitives:[arc]}},10,13.9,0),true,'Existing half still blocks');
assert.equal(geometry.primitiveFaces(arc).length,130,'Partial ring includes both end caps');
const room=scope.FrontierInterior.validate({mode:'geometry',primitives:world.interior.primitives},{width:24,height:24});
assert.equal(scope.FrontierInterior.data({interior:room}).faces.length,320,'Renderer uses all real ring/disk surfaces');
assert.equal(JSON.parse(JSON.stringify(room)).primitives[0].innerRadius,3.8,'Round shape persists');
const shell=scope.FrontierBuildingKit.roundShell({x:10,y:10,radius:4,segments:32});
assert.equal(shell.floor.length,32);
assert.equal(shell.primitives.length,3);
assert.equal(physics.blocked({interior:shell},10,10,0),false);
assert.equal(physics.blocked({interior:shell},14.1,10,0),true);
const validatedShell=scope.FrontierInterior.validate({mode:'geometry',...shell},{width:24,height:24});
const game={player:{x:10,y:10,z:0,height:1.65},sourceWorld:{interior:validatedShell},sceneEvents:[]};
for(const requested of [{x:16,y:10,z:1},{x:10,y:16,z:1},{x:10,y:10,z:-2},{x:10,y:10,z:6}]){
  const actual=scope.FrontierModelCollision.camera(game,{...requested});
  assert.equal(game.modelCameraDebug.obstructed,true,'Camera must collide with round wall/floor/ceiling');
  assert(actual.x<14&&actual.y<14&&actual.z>0&&actual.z<3,'Camera remains in hollow interior');
}
assert.equal(scope.FrontierModelCollision.camera(game,{x:11,y:10,z:1}).x,11,'Clear interior camera path stays free');
const polygons=geometry.primitiveFaces(wall);
let previousU=0;
for(let i=0;i<32;i++){
  const points=polygons[i*4],face={points,tileSize:2,roundMapping:geometry.mapping(wall,points)};
  const left=scope.FrontierRoomSurfaces.uv(face,points[0]),right=scope.FrontierRoomSurfaces.uv(face,points[1]);
  assert(Math.abs(left[0]-previousU)<1e-8,'Curved repeat UV stays continuous across every segment');
  assert(right[0]>left[0]);previousU=right[0];
  const fitted=scope.FrontierRoomSurfaces.uv({...face,textureMapping:'fit'},points[1]);
  assert(Math.abs(fitted[0]-(i+1)/32)<1e-8,'Fit covers the complete circumference once');
}
assert(Math.abs(previousU-Math.PI*4)<1e-8,'Seam finishes at full circumference in repeat units');
assert.throws(/* @function roundTest.invalidSegments — Inputs: none. Returns: invalid generation attempt; expected to throw for excessive segment count without allocating surfaces or changing world. */ function(){geometry.faces({x:0,y:0,radius:4,height:3,segments:1000});});
console.log('PASS round surfaces, hollow contact, support, ceiling, arc, validation and persistence');
