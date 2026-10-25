// Validate large landmarks and instance policies independently from rendering/AI.
const assert=require('node:assert/strict');require('../src/model-transform.js');require('../src/model-events.js');require('../src/model-visibility.js');
const V=FrontierModelVisibility,asset={scene:{bounds:{min:[-60,-5,0],max:[60,5,20]}}};
globalThis.FrontierModelLibrary={/* @function model-visibility1517.get — Supplies a shared decoded bounds fixture. Inputs: model ID, ignored. Returns: fixture asset; no resource allocation or game changes. */ get(){return asset;}};
const entity={modelId:'landmark',x:100,y:0,z:-4,spatial:FrontierModelEvents.validate({visual:'model',modelId:'landmark'})},game={maps:{frontier:{entities:[entity]}},sceneEvents:[],sourceWorld:{}},cam={x:0,y:0};
assert.equal(V.distance(entity,asset,cam),40);assert.deepEqual(V.candidates(game,cam,[]),[entity]);
entity.spatial.drawDistance={mode:'custom',distance:30};assert.equal(V.candidates(game,cam,[entity]).length,0);
entity.spatial.drawDistance={mode:'unlimited',distance:52};assert.deepEqual(V.candidates(game,{x:-5000,y:0},[]),[entity]);
assert.equal(V.candidates(game,cam,[entity]).length,1);
assert.deepEqual(FrontierModelEvents.validate(JSON.parse(JSON.stringify(entity.spatial))),entity.spatial);
assert.throws(/* @function model-visibility1517.invalid — Exercises validation failure for a negative draw distance. Inputs: none. Returns: validation result if unexpectedly accepted; expected throw is captured by assert. */ ()=>V.validate({mode:'custom',distance:-1}));
assert.equal(FrontierModelEvents.matrix(entity)[14],-4);
console.log('PASS bounds-aware landmarks, custom/unlimited draw policies, deduplication, persistence and negative model placement');
