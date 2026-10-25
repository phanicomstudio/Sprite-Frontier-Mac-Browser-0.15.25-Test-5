const assert=require('node:assert/strict');
require('../src/scene-transition.js');
/* @function transition-performance1523.run — Inputs: none. Verifies opaque door ownership suppresses only hidden-world presentation, while committing/resuming once and retaining live fade-in/melt. Throws on regression; no browser or project mutation. */
(/* @function transition-performance1523.invocation — Inputs: none. Executes transition ownership assertions synchronously; throws on mismatch and creates no persistent engine state. */ function run(){let commits=0,completions=0,doorDone=false;
const transition=FrontierSceneTransition.create({
 commit:/* @function transition-performance1523.commit — Inputs: job unused. Counts authoritative commits; returns nothing. */ function(){commits++;},
 complete:/* @function transition-performance1523.complete — Inputs: job unused. Counts continuation completions; returns nothing. */ function(){completions++;},
 opacity:/* @function transition-performance1523.opacity — Inputs: amount/color unused. Test overlay sink; no effects. */ function(){},
 door:{begin:/* @function transition-performance1523.begin — Inputs: config unused. Test preparation sink; no effects. */ function(){},end:/* @function transition-performance1523.end — Inputs: none. Test presentation cleanup sink. */ function(){},update:/* @function transition-performance1523.update — Inputs: dt unused. Returns externally controlled cinematic completion. */ function(){return doorDone;}}
});
assert.equal(transition.ownsWorldView,false);
transition.reserve({map:'room',fade:0,effect:'door'});
assert.equal(transition.ownsWorldView,true);
assert.throws(/* @function transition-performance1523.concurrent — Inputs: none. Attempts a second reservation to verify rejection without extra commits. */ function(){transition.reserve({map:'other',fade:0});},/pending/);
transition.update(.016);assert.equal(commits,0);
doorDone=true;transition.update(.016);assert.equal(commits,1);assert.equal(transition.ownsWorldView,false);
transition.update(.5);assert.equal(completions,1);assert.equal(transition.busy,false);
transition.update(.5);assert.equal(commits,1);assert.equal(completions,1);
transition.reserve({map:'outside',fade:0,effect:'fade'});assert.equal(transition.ownsWorldView,false);
console.log('PASS door-only hidden-world ownership, live fade-in and single commit/resume');
})();
require('../src/events.js');
const F=FrontierEvents,doorEvent=F.create('transfer-source',5,5),overlap=F.create('overlapping-door',5,5);
doorEvent.pages[0].commands=[{type:'transferMap',map:'destination',entrance:'spawn'}];overlap.pages[0].trigger='playerTouch';overlap.pages[0].commands=[{type:'transferMap',map:'other',entrance:'spawn'}];
let pending=false,reservations=0;
const transferSession=F.createSession(F.validate([doorEvent,overlap]),{
 canStand:/* @function transition-performance1523.stand — Inputs: coordinates unused. Returns true for the isolated overlap fixture; no effects. */ function(){return true;},
 log:/* @function transition-performance1523.log — Inputs: text unused. Isolated diagnostic sink; no effects. */ function(){},
 transferMap:/* @function transition-performance1523.reserve — Inputs: map/entrance unused. Reserves the first transfer and records call count, simulating application ownership. */ function(){pending=true;reservations++;},
 transitionPending:/* @function transition-performance1523.pending — Inputs: none. Returns transfer ownership for same-frame automatic-event guard. */ function(){return pending;}
});
assert(transferSession.start(transferSession.events[0],'interact'));
transferSession.update(.016,{x:5,y:5,z:0,groundZ:0});
assert.equal(reservations,1);assert.equal(transferSession.busy,false,'Overlapping touch must not acquire cleared interpreter after transfer');
console.log('PASS transfer stops same-frame overlapping automatic activation');
const prepareOrder=[];let preparationFails=false;
const preparedTransition=FrontierSceneTransition.create({
 prepare:/* @function transition-performance1523.prepare — Inputs: reserved job unused. Records preparation before playback; throws controlled failure before ownership to verify clean rejection. */ function(){if(preparationFails)throw Error('Preparation fixture failed');prepareOrder.push('prepare');},
 commit:/* @function transition-performance1523.preparedCommit — Inputs: job unused. Records one actual commit in lifecycle order. */ function(){prepareOrder.push('commit');},
 complete:/* @function transition-performance1523.preparedComplete — Inputs: job unused. Records completion after commit. */ function(){prepareOrder.push('complete');},
 opacity:/* @function transition-performance1523.preparedOpacity — Inputs: overlay values unused. Fixture sink; no effects. */ function(){},
 door:{begin:/* @function transition-performance1523.preparedBegin — Inputs: config unused. Records cinematic start after preparation. */ function(){prepareOrder.push('begin');},end:/* @function transition-performance1523.preparedEnd — Inputs: none. Records cinematic resource release. */ function(){prepareOrder.push('end');},update:/* @function transition-performance1523.preparedUpdate — Inputs: dt unused. Completes short deterministic cinematic for ordering test. */ function(){return true;}}
});
preparedTransition.reserve({map:'room',fade:0,effect:'door'});assert.deepEqual(prepareOrder,['prepare','begin']);
assert.throws(/* @function transition-performance1523.preparedDuplicate — Inputs: none. Attempts concurrent transfer; must fail before a second preparation. */ function(){preparedTransition.reserve({map:'room',fade:0,effect:'door'});},/pending/);assert.equal(prepareOrder.length,2);
preparedTransition.update(.016);preparedTransition.update(.5);assert.deepEqual(prepareOrder,['prepare','begin','commit','end','complete']);
preparationFails=true;assert.throws(/* @function transition-performance1523.preparationFailure — Inputs: none. Reserves failing preparation; verifies exception without pending ownership or extra commit. */ function(){preparedTransition.reserve({map:'other',fade:0,effect:'door'});},/Preparation/);assert.equal(preparedTransition.busy,false);assert.equal(prepareOrder.length,5);
console.log('PASS destination preparation precedes playback once; concurrent and failed preparation leave no extra commit or stuck ownership');
let destinationDecoded=false,readyDoorUpdates=0,readyCommits=0;
const readiness=FrontierSceneTransition.create({
 preparationReady:/* @function transition-performance1523.destinationDecoded — Inputs: job unused. Returns controllable destination pixel readiness. */ function(){return destinationDecoded;},
 commit:/* @function transition-performance1523.readyCommit — Inputs: job unused. Counts actual commit after resources and animation complete. */ function(){readyCommits++;},
 complete:/* @function transition-performance1523.readyComplete — Inputs: job unused. Fixture continuation sink; no mutation. */ function(){},
 opacity:/* @function transition-performance1523.readyOpacity — Inputs: overlay values unused. Fixture cover sink. */ function(){},
 door:{begin:/* @function transition-performance1523.readyBegin — Inputs: config unused. Fixture begin sink. */ function(){},end:/* @function transition-performance1523.readyEnd — Inputs: none. Fixture cleanup sink. */ function(){},ready:/* @function transition-performance1523.doorReady — Inputs: none. Returns prepared private door resources. */ function(){return true;},update:/* @function transition-performance1523.readyUpdate — Inputs: dt unused. Counts animation updates and completes one short fixture animation. */ function(){readyDoorUpdates++;return true;}}
});
readiness.reserve({map:'room',fade:0,effect:'door'});readiness.update(.5);assert.equal(readiness.debug().phase,'door-preparing');assert.equal(readyDoorUpdates,0);assert.equal(readyCommits,0);
destinationDecoded=true;readiness.update(.016);assert.equal(readiness.debug().phase,'door');assert.equal(readyDoorUpdates,0);readiness.update(.016);assert.equal(readyCommits,1);readiness.update(.5);assert.equal(readiness.busy,false);
destinationDecoded=false;readiness.reserve({map:'other',fade:0,effect:'door'});assert.throws(/* @function transition-performance1523.readyTimeout — Inputs: none. Advances failed destination readiness beyond timeout; must clean ownership without commit. */ function(){readiness.update(11);},/timed out/);assert.equal(readiness.busy,false);assert.equal(readyCommits,1);
console.log('PASS destination decode gates animation, preparation time never advances door, timeout releases ownership without commit');
