// October 22, 2026: exercise the production blood host with deterministic sprite geometry.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const combat={PlayerDeathMode:'damage',PlayerGibMetric:'overkill',PlayerGibThreshold:40};
const root={PhanicomBloodCore:{cfg:{regularColor:'#CC0000',creamColor:'#F5F5DC',regularDuration:30,creamDuration:35,spraySize:1}},PhanicomPluginSettings:{blood:{},combat}};
/* @function gibBlood.Particle — Inputs: local x/y, resolved color. Stores the color for host assertions; no drawing or random physics is substituted for blood identity resolution. */
class Particle{/* @function gibBlood.constructor — Inputs: local x/y and resolved color. Retains color for assertions; no external state changes. */constructor(x,y,color){this.color=color;}}
root.PhanicomBloodCore.BloodParticle=Particle;
/* @function gibBlood.Synth — Inputs: inherited particle arguments. Distinct constructor identifies the cream physics branch. */
class Synth extends Particle{}
root.PhanicomBloodCore.SynthBloodParticle=Synth;
const context={window:root,PhanicomBloodCore:root.PhanicomBloodCore,FrontierTerrain:{/* @function gibBlood.height — Inputs: unused world and coordinates. Returns flat ground in metres for this identity-only fixture. */height(){return 0;}},FrontierSprites:{/* @function gibBlood.sheet — Inputs: actor. Returns a project-owned fake complete sprite frame, allowing real fragment subdivision without external assets. */sheet(){return {image:{complete:true},direction:0,columns:1,referenceHeight:16,frames:[{x:0,y:0,w:16,h:16,anchorX:8}]};}},FrontierDirections:{/* @function gibBlood.direction — Inputs: actor/camera metadata. Returns the sole fixture frame. */select(){return {row:0,column:0};}}};
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../js/plugins/Phanicom_BloodSystem.js'),'utf8'),context);
for(const blood of ['regular','cream','synth','none']){
 const game={player:{id:'player'},sourceWorld:{},camera:{yaw:0},elapsed:0};root.PhanicomBlood.attach(game);
 const actor={id:'victim',x:0,y:0,z:0,hp:0,blood};
 root.PhanicomBlood.death(game,actor,{damage:50},10);assert(!actor.gibbed,'40 excess HP stays ordinary');
 game.bloodFX=[];game.bloodDecals=[];
 root.PhanicomBlood.death(game,actor,{damage:51},10);assert(actor.gibbed,'41 excess HP gibs');assert.equal(game.gibFragments.length,16);
 if(blood==='none'){assert.equal(game.bloodFX.length,0);assert.equal(game.bloodDecals.length,0);}else{
 const cream=blood!=='regular';assert(game.bloodFX.length>0);for(const particle of game.bloodFX){assert.equal(particle.color,cream?'#F5F5DC':'#CC0000');assert.equal(particle instanceof Synth,cream);assert.equal(particle.layer,cream?'cream':'regular');}assert.equal(game.bloodDecals[0].color,cream?'#F5F5DC':'#CC0000');
 }
 const living={...actor,id:'living',hp:10,gibbed:false};root.PhanicomBlood.death(game,living,{damage:200},100);assert(!living.gibbed);
}
console.log('PASS overdamage threshold, living guard, red/cream/synth particles and stains, bloodless fragments');
