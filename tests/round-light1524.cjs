/* October 12, 2026: circular shadow-volume acceptance. Smooth circular shadow
 * boundaries approximate faceted surfaces; hollow centers must never be sealed. */
const assert=require('node:assert/strict');require('../src/local-lighting.js');
const lighting=FrontierLocalLighting;
const wall={shape:'round',x:10,y:10,z:0,h:3,radius:4,innerRadius:3.8,arcStart:0,arcSweep:Math.PI*2};
assert.equal(lighting.obstructed([10,10,1],{x:12,y:10,z:1},wall),false,'Same hollow interior receives light');
assert.equal(lighting.obstructed([10,10,1],{x:15,y:10,z:1},wall),true,'Tower wall blocks exterior light');
assert.equal(lighting.obstructed([15,10,1],{x:15,y:12,z:1},wall),false,'Uncrossed outer space stays clear');
assert.equal(lighting.obstructed([10,10,4],{x:15,y:10,z:4},wall),false,'Ray above wall is clear');
assert.equal(lighting.obstructed([10,10,1],{x:10,y:5,z:1},{...wall,arcSweep:Math.PI}),false,'Open arc allows illumination');
assert.equal(lighting.obstructed([10,10,1],{x:10,y:15,z:1},{...wall,arcSweep:Math.PI}),true,'Closed arc blocks illumination');
assert.equal(lighting.obstructed([10,10,1],{x:10,y:10,z:4},{...wall,z:3,h:.2,innerRadius:0}),true,'Disk ceiling blocks vertical center ray');
assert.equal(lighting.obstructed([15,10,1],{x:15,y:10,z:4},{...wall,z:3,h:.2,innerRadius:0}),false,'Ceiling bounding square cannot shadow outside disk');
const world={interior:{primitives:[wall]},lighting:lighting.validate({enabled:true,ambient:.1,lights:[{id:'torch',x:10,y:10,z:1,radius:10}]})};
const frame=lighting.frame({sourceWorld:world,player:{x:10,y:10,z:0}},0);
assert.equal(frame.blockers.length,1,'A round wall consumes one shadow-budget entry');
assert(lighting.sample(frame,12,10,1)[0]>.1);
assert.equal(lighting.sample(frame,15,10,1)[0],.1);
console.log('PASS hollow round lighting, arc openings, circular ceiling and bounded blocker ownership');
