const assert=require('node:assert/strict');require('../src/hub-state.js');const H=FrontierHubState,s=H.empty(),policies={hub:H.settings({cleanupSeconds:1}),home:H.settings({protected:true,cleanupSeconds:1})};
const d=H.drop(s,'hub',{itemId:'cup',quantity:2},{x:2,y:3,z:1}),home=H.drop(s,'home',{itemId:'book',quantity:1},{x:2,y:2,z:0});
assert.equal(H.tick(s,2,policies),1);assert.equal(s.recovery[0].quantity,2);assert.equal(H.cell(s,'hub').drops.length,0);assert.equal(H.cell(s,'home').drops[0].id,home.id);assert.equal(H.pickup(s,'hub',d.id),null);
s.recoveryLimit=1;H.drop(s,'hub',{itemId:'unique',quantity:1,properties:{condition:17}},{x:3,y:3,z:0});H.tick(s,2,policies);assert.equal(H.cell(s,'hub').drops.length,1);s.recovery.pop();H.tick(s,0,policies);assert.equal(s.recovery[0].properties.condition,17);
H.drop(s,'hub',{itemId:'quest',quantity:1,questProtected:true},{x:3,y:3,z:0});H.tick(s,60,policies);assert.equal(H.cell(s,'hub').drops.length,1);
assert.deepEqual(H.validate(JSON.parse(JSON.stringify(s))),s);assert.equal(H.owner({kind:'npc',id:'merchant'}).id,'merchant');
assert.throws(/* @function hub-state1517.badOwner — Tests rejection before ownership state is adopted. Inputs: none. Returns: validation result if unexpectedly accepted; assert captures expected error. */ ()=>H.owner({kind:'npc'}));
const fair=H.empty();for(let i=0;i<100;i++)H.drop(fair,'hub',{itemId:'quest',quantity:1,questProtected:true},{x:1,y:1,z:0});H.drop(fair,'hub',{itemId:'last',quantity:1},{x:1,y:1,z:0});for(let i=0;i<110;i++)H.tick(fair,i===0?2:0,policies,1);assert.equal(fair.recovery.length,1);
console.log('PASS static drops, protected cells, bounded recovery, unique properties, quest protection, fair cleanup and saved-state roundtrip');
