const assert=require('node:assert/strict');require('../src/first-person.js');
/* @function firstPerson1622.sequence — Inputs: speed in metres/second and frame rate. Returns measured sway over two seconds using the real presentation helper; no renderer replacement. */
function sequence(speed,hz){const state={phase:0,amplitude:0};let max=0,delta=0,prior=0;for(let i=0;i<hz*2;i++){const value=FrontierFirstPerson.motion(state,1/hz,speed/hz);max=Math.max(max,Math.abs(value.x));delta=Math.max(delta,Math.abs(value.x-prior));prior=value.x;}return {state,max,delta};}
const walk=sequence(1.2,60),run=sequence(6,60),high=sequence(1.2,120);
assert.equal(walk.state.phase,run.state.phase);assert.equal(walk.max,run.max);assert(walk.max>5&&walk.delta<.8,JSON.stringify(walk));assert(Math.abs(walk.state.swayX-high.state.swayX)<.3);
for(let i=0;i<180;i++)FrontierFirstPerson.motion(walk.state,1/60,0);assert(Math.abs(walk.state.swayX)<.01);
const player={id:'player',spriteProfile:'candy-armed',holstered:false,weapon:{id:'handgun'}},game={player,camera:{firstPerson:true},sourceWorld:{}},cam={x:10,y:20,z:1.55,yaw:Math.PI/2,pitch:0};
const muzzle=FrontierFirstPerson.muzzle(player,game,cam);assert(Math.abs(muzzle.x-10.45)<1e-10);assert(Math.abs(muzzle.y-19.92)<1e-10);assert(Math.abs(muzzle.z-1.4)<1e-10);
assert.equal(FrontierFirstPerson.muzzle(player,game,{...cam,orthographic:true}),null);assert.equal(FrontierFirstPerson.muzzle({...player},game,cam),null);
console.log('PASS wider smooth sway with identical walking/running cadence, frame-rate stability, resting decay and camera-relative first-person launch origin');
