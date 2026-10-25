const assert=require('node:assert/strict');for(const f of ['model-transform','model-scene','model-mesh-collision','model-events','model-collision','terrain'])require('../src/'+f+'.js');
const T=FrontierModelTransform,vertices=[],indices=[];
/* @function model-walkable1514.quad.1 — Handles quad within model walkable1514. Inputs: a; b; c; d. Uses: vertices push; indices push. */ function quad(a,b,c,d){const i=vertices.length/3;vertices.push(...a,...b,...c,...d);indices.push(i,i+1,i+2,i,i+2,i+3);}
// Three actual stair treads, risers and roof/platform. Engine-space fixture
// exercises real terrain/mesh integration, not a replacement height function.
for(let i=0;i<3;i++){const y=1+i*.5,z=(i+1)*.2;quad([-1,y,z],[1,y,z],[1,y+.5,z],[-1,y+.5,z]);quad([-1,y,i*.2],[1,y,i*.2],[1,y,z],[-1,y,z]);}
quad([-1,2.5,.6],[1,2.5,.6],[1,4,.6],[-1,4,.6]);
const asset={meshes:[[{positions:new Float32Array(vertices),indices:new Uint32Array(indices)}]],scene:{instances:[{mesh:0,matrix:T.identity()}]}};
globalThis.FrontierModelLibrary={get:/* @function model-walkable1514.get.2 — Returns asset. Inputs: no explicit arguments; uses enclosing module state. Returns: asset. */ ()=>asset};const host={id:'stairs',x:5,y:5,z:0,modelId:'stairs',spatial:FrontierModelEvents.validate({visual:'model',modelId:'stairs',collisionMode:'mesh'})},p={x:5,y:5.5,z:0,hp:100,height:1.65,grounded:true},world={width:30,height:30,terrain:{mode:'flat'},spawn:{x:5,y:5}},game={player:p,sourceWorld:world,sceneEvents:[host],maps:{frontier:{entities:[]}}};
for(let i=0;i<40;i++){const y=p.y+.07;if(!FrontierTerrain.blocked(game,p.x,y)){if(game.playerStep)Object.assign(p,game.playerStep);else p.y=y;}FrontierTerrain.ground(p,world,1/60,[],game);}
assert(p.y>8,'Walk up all stairs');assert(Math.abs(p.z-.6)<1e-5,'Platform supports feet');
assert(FrontierTerrain.jump(p,world));for(let i=0;i<120;i++)FrontierTerrain.ground(p,world,1/60,[],game);assert(p.grounded);assert(Math.abs(p.z-.6)<1e-5,'Jump lands back on roof');
p.y=10;FrontierTerrain.ground(p,world,1/60,[],game);assert.equal(p.grounded,false,'Walking off roof begins fall');for(let i=0;i<120;i++)FrontierTerrain.ground(p,world,1/60,[],game);assert.equal(p.z,0);
p.y=8;p.z=4;p.grounded=false;p.verticalVelocity=-30;FrontierTerrain.ground(p,world,.2,[],game);assert(Math.abs(p.z-.6)<.0002,'Fast falling cannot tunnel through roof');
quad([-1,2.5,2.5],[1,2.5,2.5],[1,4,2.5],[-1,4,2.5]);const ceiling={meshes:[[{positions:new Float32Array(vertices),indices:new Uint32Array(indices)}]],scene:asset.scene};FrontierModelLibrary.get=/* @function model-walkable1514.get.3 — Returns ceiling. Inputs: no explicit arguments; uses enclosing module state. Returns: ceiling. */ ()=>ceiling;
p.z=.6;p.grounded=true;p.verticalVelocity=0;FrontierTerrain.jump(p,world);FrontierTerrain.ground(p,world,.15,[],game);assert(p.z<=.85001,'Head stops at ceiling');assert.equal(p.verticalVelocity,0);
const matrix=T.matrix({position:[10,10,1],rotation:[0,0,90],scale:[2,3,2]}),point=T.vector(matrix,[0,3,.6]);assert(Math.abs(FrontierModelMeshCollision.support(asset,matrix,point[0],point[1],0,4)-2.2)<1e-5,'Transformed roofs keep exact support elevation');
console.log('PASS stairs, platform standing, roof jump/landing, edge fall, swept fast landing, ceiling and transformed support');
quad([-1,.5,1.75],[1,.5,1.75],[1,2,1.75],[-1,2,1.75]);const lowCeiling={meshes:[[{positions:new Float32Array(vertices),indices:new Uint32Array(indices)}]],scene:asset.scene};FrontierModelLibrary.get=/* @function model-walkable1514.get.4 — Returns low ceiling. Inputs: no explicit arguments; uses enclosing module state. Returns: low ceiling. */ ()=>lowCeiling;Object.assign(p,{x:5,y:5.8,z:0,grounded:true,verticalVelocity:0});assert(FrontierTerrain.blocked(game,5,5.95),'Low ceiling prevents stair step');assert.equal(p.z,0,'Rejected step leaves elevation untouched');
const ramp={meshes:[[{positions:new Float32Array([-1,0,0,1,0,0,1,2,1,-1,2,1]),indices:new Uint32Array([0,1,2,0,2,3])}]],scene:asset.scene};assert.equal(FrontierModelMeshCollision.support(ramp,T.identity(),0,1,-1,2),.5,'Walkable slope support');const steep=T.matrix({scale:[1,1,4]});assert.equal(FrontierModelMeshCollision.support(ramp,steep,0,1,-1,4),null,'Steep surface rejected as support');console.log('PASS low stair headroom and walkable/steep slope boundaries');


