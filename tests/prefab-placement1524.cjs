/* October 12, 2026: physical anchor acceptance for authored prefab assemblies.
 * Match actual world coordinates after translation, rotation and scale; metadata
 * must survive ordinary JSON persistence. No model bounds substitute for anchors. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('../src/model-transform.js');require('../src/prefab-placement.js');
const kit=JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/models/castle/MANIFEST.json'),'utf8'));
/* @function prefabTest.metadata — Inputs: prefab manifest name. Returns shared dimensions/connectors for pure tests; fails if the fixture is missing. Reads only, no model decoding. */
function metadata(name){const item=kit.find(/* @function prefabTest.find — Inputs: manifest entry. Returns exact name match without mutation. */ function(e){return e.name===name;});assert(item);return {family:'castle-1524',connectors:item.connectors,dimensions:item.dimensions};}
const P=FrontierPrefabPlacement,room=metadata('Square_Room_6m'),target={id:'room-a',metadata:room,transform:{position:[10,10,0],rotation:[0,0,0],scale:[1,1,1]}};
let source={position:[10.1,10,2.8],rotation:[0,0,0],scale:[1,1,1]},before=JSON.stringify(source);
let result=P.snap(source,room,[target]);assert.equal(result.connection.source,'bottom');assert.deepEqual(result.transform.position,[10,10,3]);assert.equal(JSON.stringify(source),before,'Proposal is never mutated');
const roof=P.snap({position:[10,10,3.1],rotation:[0,0,0],scale:[1,1,1]},metadata('Castle_Gable_Roof_6m'),[target]);assert.equal(roof.transform.position[2],3,'Matching roof mounts on room top');
assert.equal(P.snap(source,metadata('Square_Room_4m'),[target]).connection,null,'Different footprints cannot falsely stack');
const wall=metadata('Castle_Wall_4m');result=P.snap({position:[14.2,10,0],rotation:[0,0,0],scale:[1,1,1]},wall,[{...target,metadata:wall}]);assert.deepEqual(result.transform.position,[14,10,0]);
result=P.snap({position:[10,3.6,0],rotation:[0,0,180],scale:[1,1,1]},room,[target]);assert.equal(result.connection.source,'door');assert.equal(result.connection.target,'door');
const restored=JSON.parse(JSON.stringify(target));result=P.snap(source,room,[restored]);assert.equal(result.transform.position[2],3,'Persisted connector metadata remains usable');
const scaled={...target,transform:{position:[10,10,0],rotation:[0,0,90],scale:[2,2,2]}};
result=P.snap({position:[10,10,6.2],rotation:[0,0,90],scale:[2,2,2]},room,[scaled]);assert.deepEqual(result.transform.position,[10,10,6],'Scaled story anchors match actual height');
assert.equal(P.snap(source,room,[scaled]).connection,null,'Different physical scales cannot falsely match');
console.log('PASS prefab stack/roof/wall/door anchors, dimensions, rotation, scale and persistence');
