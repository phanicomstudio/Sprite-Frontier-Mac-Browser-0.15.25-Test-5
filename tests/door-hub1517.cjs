// Independently exercise timelines, transfer ownership, persistence and item details.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
require('../src/model-transform.js');require('../src/door-transition.js');require('../src/hub-state.js');require('../src/scene-transition.js');
const D=FrontierDoorTransition,H=FrontierHubState;
const config=D.validate({approach:1,passage:1,leaves:[{motion:'hinged',angle:-90,speed:90},{motion:'sliding',distance:2,speed:1,axis:[-1,0,0]}],synchronized:false});
assert.equal(D.timeline(config,.5).phase,'approach');assert.equal(D.timeline(config,1.5).fractions[0],.5);assert.equal(D.timeline(config,1.5).fractions[1],.25);assert.equal(D.timeline(config,3.1).phase,'passage');assert.equal(D.timeline(config,6.3).phase,'done');assert.equal(D.validate({frame:null,leaves:[]}).leaves.length,0);
assert.throws(/* @function door-hub1517.badComposition â€” Inputs: none. Attempts invalid third leaf; expected validation error prevents resource allocation. */ ()=>D.validate({leaves:[{},{},{}]}));
let commits=0,completions=0,ended=0,time=0;
const t=FrontierSceneTransition.create({commit:/* @function door-hub1517.commit â€” Inputs: job unused. Counts commits; no real map mutation. */ ()=>commits++,complete:/* @function door-hub1517.complete â€” Inputs: job unused. Counts resumed continuations. */ ()=>completions++,opacity:/* @function door-hub1517.opacity â€” Inputs: opacity/color ignored. Stub has no effects. */ ()=>{},door:{begin:/* @function door-hub1517.begin â€” Inputs: config ignored. Resets synthetic presentation clock. */ ()=>{time=0;},update:/* @function door-hub1517.update â€” Inputs: seconds. Returns true when synthetic sequence reaches 1s. */ dt=>(time+=dt)>=1,end:/* @function door-hub1517.end â€” Inputs: none. Counts presentation cleanup. */ ()=>ended++}});
t.reserve({map:'home',fade:0,effect:'door'});t.update(.5);assert.equal(commits,0);t.update(.5);assert.equal(commits,1);t.update(.4);assert.equal(completions,1);t.update(10);assert.equal(commits,1);assert.equal(ended,1);
const s=H.empty(),inventory=new Map();H.carry(s,inventory,{itemId:'cup',quantity:2,properties:{condition:17},owner:{kind:'npc',id:'shop'},questProtected:true});const stack=H.consume(s,inventory,'cup');assert.equal(stack.properties.condition,17);assert.equal(stack.owner.id,'shop');assert(stack.questProtected);assert.equal(inventory.get('cup'),1);H.drop(s,'home',stack,{x:2,y:2,z:3});assert.deepEqual(H.validate(JSON.parse(JSON.stringify(s))),s);
const window={};vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../src/audio-manifest.js'),'utf8'),{window});vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../src/door-audio.js'),'utf8'),{window});
assert.equal(window.FrontierDoorAudio.select('open',{mode:'random'},/* @function door-hub1517.randomOpen â€” Inputs: none. Returns deterministic lower bound for open pool selection. */ ()=>0),'Door Open 01');assert.equal(window.FrontierDoorAudio.select('close',{mode:'random'},/* @function door-hub1517.randomClose â€” Inputs: none. Returns deterministic upper bound below one for close selection. */ ()=>.99),'Door Close 02');assert.equal(window.FrontierDoorAudio.select('open',{mode:'none'}),null);assert.equal(window.FrontierDoorAudio.select('close',{mode:'manual',name:'missing'}),null);
console.log('PASS hinged/sliding/paired timelines, zero-leaf frames, one transfer commit/resume, carried ownership/properties/quest protection, audio roles and persistence');

// October 9: a second validation must preserve automatic pivots, not silently
// convert them into origin hinges. Skip must not duplicate already committed travel.
assert.deepEqual(D.validate(D.validate()),D.validate());
const priorCommits=commits;t.reserve({map:'home',fade:0,effect:'door'});assert(t.skip());assert(!t.skip());assert.equal(commits,priorCommits+1);
t.reserve({map:'home',fade:0,effect:'door'});t.update(1);const afterCommit=commits;t.skip();assert.equal(commits,afterCommit);
console.log('PASS normalized door pivot roundtrip and skip before/after single commit');
