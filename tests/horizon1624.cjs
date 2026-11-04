const assert=require('node:assert/strict');
require('../src/fog.js');
require('../src/horizon-fog.js');
require('../src/first-person.js');

const game={
  sourceWorld:{
    fog:FrontierFog.validate()
  },camera:{
    firstPerson:true
  }
},cam={
  x:0,y:0,z:1.55,yaw:0,pitch:0,cy:240
},actor={
  x:0,y:5,z:0
},p=FrontierHorizonFog.profile(game,cam);

assert.equal(p.horizon,240);
assert.equal(FrontierHorizonFog.opacity(p,240),1);
assert.equal(FrontierHorizonFog.opacity(p,480),1);
assert.equal(FrontierHorizonFog.opacity(p,0),0);
assert(FrontierHorizonFog.opacity(p,p.horizon-p.fade/2)>.49);

assert(FrontierHorizonFog.profile(game,{
  ...cam,pitch:.3
}).horizon>p.horizon);
assert.equal(FrontierHorizonFog.profile(game,{
  ...cam,orthographic:true
}),null);

const iso=FrontierHorizonFog.profile(game,{...cam,orthographic:true,outdoorIsometric:true});
assert.equal(iso.color,p.color);
assert.equal(FrontierHorizonFog.opacity(iso,0),1);
assert.equal(FrontierHorizonFog.opacity(iso,480),1);

game.sourceWorld.interior={
  mode:'geometry'
};
assert.equal(FrontierHorizonFog.profile(game,cam),null);
delete game.sourceWorld.interior;

game.fogOverride=FrontierFog.validate({
  enabled:false
});
assert.equal(FrontierHorizonFog.profile(game,cam),null);
delete game.fogOverride;

for(const pitch of [-.6,0,.6])assert.equal(FrontierFirstPerson.spriteScale(game,actor,{
  ...cam,pitch
},{
  scale:123
}),72);

game.camera.firstPerson=false;
assert.equal(FrontierFirstPerson.spriteScale(game,actor,cam,{
  scale:123
}),123);
game.camera.firstPerson=true;
assert.equal(FrontierFirstPerson.spriteScale(game,actor,{
  ...cam,orthographic:true
},{
  scale:123
}),123);

console.log('PASS pitched horizon opacity, untouched upper sky, disabled/interior/isometric exclusions and first-person-only scale stability');


