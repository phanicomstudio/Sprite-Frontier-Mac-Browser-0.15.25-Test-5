const assert=require('node:assert/strict');require('../src/hub-state.js');const H=FrontierHubState,s=H.empty(),policies={hub:H.settings({cleanupSeconds:1}),home:H.settings({protected:true,cleanupSeconds:1})};
const d=H.drop(s,'hub',{itemId:'cup',quantity:2},{x:2,y:3,z:1}),home=H.drop(s,'home',{itemId:'book',quantity:1},{x:2,y:2,z:0});
assert.equal(H.tick(s,2,policies),1);assert.equal(s.recovery[0].quantity,2);assert.equal(H.cell(s,'hub').drops.length,0);assert.equal(H.cell(s,'home').drops[0].id,home.id);assert.equal(H.pickup(s,'hub',d.id),null);
s.recoveryLimit=1;H.drop(s,'hub',{itemId:'unique',quantity:1,properties:{condition:17}},{x:3,y:3,z:0});H.tick(s,2,policies);assert.equal(H.cell(s,'hub').drops.length,1);s.recovery.pop();H.tick(s,0,policies);assert.equal(s.recovery[0].properties.condition,17);
H.drop(s,'hub',{itemId:'quest',quantity:1,questProtected:true},{x:3,y:3,z:0});H.tick(s,60,policies);assert.equal(H.cell(s,'hub').drops.length,1);
assert.deepEqual(H.validate(JSON.parse(JSON.stringify(s))),s);assert.equal(H.owner({kind:'npc',id:'merchant'}).id,'merchant');
assert.throws(/* @function hub-state1517.badOwner — Tests rejection before ownership state is adopted. Inputs: none. Returns: validation result if unexpectedly accepted; assert captures expected error. */ ()=>H.owner({kind:'npc'}));
const fair=H.empty();for(let i=0;i<100;i++)H.drop(fair,'hub',{itemId:'quest',quantity:1,questProtected:true},{x:1,y:1,z:0});H.drop(fair,'hub',{itemId:'last',quantity:1},{x:1,y:1,z:0});for(let i=0;i<110;i++)H.tick(fair,i===0?2:0,policies,1);assert.equal(fair.recovery.length,1);
console.log('PASS static drops, protected cells, bounded recovery, unique properties, quest protection, fair cleanup and saved-state roundtrip');

// October 13, 2026: more than 32 visited cells must retain their own storage.
const largeCells = H.empty();
for (let i = 0; i < 256; i++) H.cell(largeCells, 'visited-' + i).storage.chest = [{ itemId: 'cup', quantity: 1, owner: {kind: 'public'}, properties: {}, questProtected: false }];
const restoredCells = H.validate(JSON.parse(JSON.stringify(largeCells)));
assert.equal(Object.keys(restoredCells.cells).length, 256);
assert.equal(H.cell(restoredCells, 'visited-255').storage.chest[0].quantity, 1);
console.log('PASS 256 visited cells preserve independent storage through Save/Load');

let policyReads = 0;
H.tick(restoredCells, 1, /* @function hubLarge.policy — Inputs: stable cell ID unused. Returns protected policy and increments lookup count, proving cleanup does not request every dormant cell. */ function (id) { policyReads++; return policies.home; }, 8);
assert.equal(policyReads, 8);
H.cell(restoredCells, 'added-after-cleanup');
assert.equal(Object.keys(restoredCells.cells).length, 257);
console.log('PASS large-cell cleanup resolves only its eight budgeted records');

H.drop(restoredCells, 'added-after-cleanup', {itemId: 'late-drop', quantity: 1}, {x: 0, y: 0, z: 0});
for (let i = 0; i < 258; i++) H.tick(restoredCells, i === 0 ? 2 : 0, /* @function hubLarge.eligible — Inputs: stable cell ID unused. Returns ordinary cleanup policy for this fairness fixture. No state mutation. */ function (id) { return policies.hub; }, 1);
assert.equal(restoredCells.recovery[0].itemId, 'late-drop');
console.log('PASS newly visited cells join bounded cleanup without starvation');

assert.equal(H.settings({arrivals:[{id:'upper', name:'Upper storey', x:2, y:3, z:6, yaw:0}]}).arrivals[0].z,6);
assert.throws(/* @function hubLarge.badArrivalElevation — Inputs: none. Returns settings validation attempt; rejects invalid explicit Z before adoption. */function(){return H.settings({arrivals:[{id:'bad',name:'Invalid',x:2,y:3,z:Infinity,yaw:0}]});}, /arrival/);
