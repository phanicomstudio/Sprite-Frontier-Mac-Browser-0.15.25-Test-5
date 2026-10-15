/* October 12, 2026: contact visibility mathematics and selection contracts.
 * Image rectangle/tilt remains owned by unchanged renderer presentation. */
'use strict';
const assert=require('node:assert/strict');require('../src/room-physics.js');require('../src/sprite-contact.js');
const actor={x:0,y:0,z:0,height:1.65},camera={x:0,y:-4,z:3,yaw:0,pitch:-.6,cy:96},sin=Math.sin(camera.pitch),cos=Math.cos(camera.pitch),plane=4*cos-3*sin;
const floor={moduleType:'floor',x:0,y:0,z:-.2,h:.2,w:8,d:8},wall={moduleType:'wall',x:0,y:.3,z:0,h:3,w:5,d:.1};
const game={sourceWorld:{interior:{primitives:[floor,wall]}},sceneEvents:[]},contact=FrontierSpriteContact.depth(game,actor,camera,plane);
assert.equal(typeof contact,'function');
const footY=camera.cy-360*(-4*sin-3*cos)/plane;assert(Math.abs(contact(footY)-plane)<1e-9,'Foot row preserves camera-forward anchoring depth');
const headDepth=4*cos+(1.65-3)*sin,headY=camera.cy-360*(-4*sin+(1.65-3)*cos)/headDepth;assert(Math.abs(contact(headY)-headDepth)<1e-9,'Contact visibility follows physical head depth while picture remains camera-facing');
const behind={...actor,y:.6},behindDepth=FrontierSpriteContact.depth(game,behind,camera,plane),row=100,denominator=cos-(camera.cy-row)/360*sin;assert(behindDepth(row)>4.3/denominator,'Wall in front of an actor remains nearer; contact does not make walls transparent');
assert.equal(FrontierSpriteContact.depth({...game,sourceWorld:{interior:{primitives:[floor]}}},actor,camera,plane),plane,'Floor support alone preserves historical scalar depth');
assert.equal(FrontierSpriteContact.depth(game,actor,{...camera,orthographic:true},plane),plane);assert.equal(FrontierSpriteContact.depth(game,actor,{...camera,pitch:0},plane),plane);
assert.equal(FrontierSpriteContact.depth(game,{...actor,y:-4},camera,plane),plane,'Near/behind-camera degenerate plane falls back safely');
const prior={owner:'movement'};game.modelCollisionDebug=prior;game.sourceWorld.interior.primitives=[floor];game.sceneEvents=[{id:'model'}];
globalThis.FrontierModelCollision={/* @function spriteContactTest.meshProbe — Inputs: active game. Returns contact while deliberately updating collision diagnostics, proving ownership restoration. Does not stand in for mesh correctness tests. */blocked(value){value.modelCollisionDebug={owner:'probe'};return true;}};
assert.equal(typeof FrontierSpriteContact.depth(game,actor,camera,plane),'function');assert.equal(game.modelCollisionDebug,prior);delete globalThis.FrontierModelCollision;
console.log('PASS contact foot/head depths, real-wall occlusion ordering, support/orthographic/level fallbacks and preserved diagnostics');
