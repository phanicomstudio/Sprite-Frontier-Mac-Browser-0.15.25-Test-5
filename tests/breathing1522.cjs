const assert=require('node:assert/strict');require('../src/screen-breathing.js');const B=globalThis.FrontierBreathing;
/* @function breathing1522.advance — Inputs: independent controller, seconds and simulation rate. Returns final snapshot after equal elapsed time. Exercises temporal behavior at different frame rates without renderer dependence. */
function advance(controller,seconds,hz){for(let i=0;i<seconds*hz;i++)controller.update(1/hz);return controller.snapshot();}
const low=B.create({enabled:true,fadeIn:1}),high=B.create({enabled:true,fadeIn:1}),a=advance(low,2,30),b=advance(high,2,120);assert(Math.abs(a.phase-b.phase)<1e-10);assert.equal(a.strength,1);assert.equal(b.strength,1);const paused=low.snapshot();low.update(5,true);assert.deepEqual(low.snapshot(),paused);low.configure({enabled:false,fadeOut:.5});advance(low,1,60);assert.equal(low.snapshot().strength,0);
for(const point of [[0,0],[1,0],[0,1],[1,1],[.5,0],[0,.5]])assert.deepEqual(B.sample(...point,4/3,a),{x:point[0],y:point[1]});
for(let x=.05;x<1;x+=.1)for(let y=.05;y<1;y+=.1){const state={...a,amplitude:.05,phase:Math.PI/2},display=B.project(x,y,16/9,state),scene=B.sample(display.x,display.y,16/9,state);assert(Math.abs(scene.x-x)<1e-8);assert(Math.abs(scene.y-y)<1e-8);assert(display.x>=0&&display.x<=1&&display.y>=0&&display.y<=1);}
assert.throws(/* @function breathing1522.invalid — Inputs: none. Attempts out-of-range intensity and must throw before runtime mutation. */ function(){B.validate({amplitude:.5});});low.clear();assert.equal(low.snapshot().strength,0);console.log('PASS breathing fade endpoints, frame-rate independence, pause, stationary edges and inverse pointer projection');

const reused={};const reuseController=B.create({enabled:true,fadeIn:0});assert.equal(reuseController.update(.1,false,reused),reused);assert.equal(reuseController.update(.1,false,reused),reused);

// October 12: user Options ownership survives map replacement without resetting animation phase.
const source={sourceWorld:{nativeEffects:{breathing:{enabled:false}}}},destination={sourceWorld:{nativeEffects:{breathing:{enabled:false}}}};
B.setOptions(source,{enabled:true,amplitude:.025,frequency:.7,fadeIn:0});
const beforeTransfer={...B.tick(source,1,false)};
const afterTransfer={...B.tick(destination,0,true)};
assert.equal(afterTransfer.enabled,true);assert.equal(afterTransfer.strength,1);assert.equal(afterTransfer.phase,beforeTransfer.phase);assert.equal(afterTransfer.amplitude,.025);
assert.equal(B.controller(source),B.controller(destination));assert.equal(destination.sourceWorld.nativeEffects.breathing.enabled,false);
B.set(destination,{enabled:false,fadeOut:0});assert.equal(B.tick(destination,0,true).strength,0);
console.log('PASS Options breathing survives cell replacement with phase/fade state and authored defaults preserved; native event override remains effective');
