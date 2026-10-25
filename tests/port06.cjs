/* Regression coverage for import boundaries and native plugin interfaces.
 * Uses a VM instead of browser input: no windows, pointer lock or audio output. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),scope={console,structuredClone,Math,Map,Set};scope.window=scope;scope.globalThis=scope;vm.createContext(scope);
function load(name){vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),scope,{filename:name});}
for(const name of ['src/project-data.js','src/parser.js','src/events.js','src/parameters.js','src/music.js','src/aggro.js','src/terrain.js','src/sky.js','src/world.js','src/muzzle-data.js','src/directions.js','src/muzzle.js'])load(name);
const M=scope.FrontierMuzzle,P=scope.FrontierParser;
assert(M.profiles.has('candy-armed'));
for(const mutate of [d=>d.profiles[0].columns=0,d=>d.profiles[0].referenceHeight=0,d=>d.profiles[0].frames.pop(),d=>d.profiles[0].direction.rows=[99],d=>d.profiles[0].direction.frameSeconds=0,d=>d.profiles[0].muzzles['0:0'].x=Infinity]){const copy=structuredClone(M.export());mutate(copy);assert.throws(()=>M.validate(copy));}
const topics=P.compile([{aliases:['ammo'],answer:'Short'},{aliases:['reserve ammo'],answer:'Specific'},{aliases:['secret'],answer:'Unlocked',switch:'heard'}]);
assert.equal(P.ask('tell me about RESERVE AMMO!',topics),'Specific');assert.equal(P.ask('ammo',topics),'Short');assert.equal(P.ask('ammonia',topics).startsWith("I don't"),true);assert.equal(P.ask('secret',topics,{switches:new Map([['heard',true]])}),'Unlocked');assert.throws(()=>P.compile([{aliases:[{}],answer:'Bad'}]));
scope.PhanicomABS={weapons:new Map([['handgun',{}]])};scope.PhanicomBlood={resolve:type=>{if(!['cream','regular','none'].includes(type))throw Error('Invalid identity');}};load('src/save.js');
const save={schema:'phanicom-playtest/1',world:scope.FrontierWorld.generate('save'),player:{x:24,y:24,hp:95,ammoLoaded:4,ammoReserve:80,weapon:'handgun',deathMode:'damage'},blood:{hidden:false,actors:{player:'cream'}},switches:[['quest',true]],variables:[['progress',2]],selfSwitches:[['box:A',true]],inventory:[['key',1]]};
assert.equal(scope.FrontierSave.validate(save).player.weapon,'handgun');
for(const mutate of [s=>s.player.weapon='missing',s=>s.player.x=-1,s=>s.player.ammoLoaded=1.5,s=>s.switches=[['q','true']],s=>s.blood.actors.player='invalid']){const copy=structuredClone(save);mutate(copy);assert.throws(()=>scope.FrontierSave.validate(copy));}
load('src/plugin-settings.js');load('js/plugins/Phanicom_BloodSystem.Core.js');
const regular=new scope.PhanicomBloodCore.BloodParticle(0,0);regular.velocityX=2;regular.velocityY=-1;regular.update();assert.equal(regular.x,2);assert.equal(regular.y,-1);assert.equal(regular.velocityX,1.96);assert.equal(regular.velocityY,-.9);
const cream=new scope.PhanicomBloodCore.SynthBloodParticle(0,0);cream.update();assert.equal(cream.life,1);assert(cream.glowing);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'data/audio-manifest.json')));for(const audio of manifest)assert(fs.existsSync(path.join(root,'audio/se',audio.file)),'Missing sound '+audio.file);
console.log('PASS: muzzle layout bounds, parser phrases/switches, atomic save validation, source blood equations, all supplied audio manifest files.');
const rules=scope.FrontierParameters;
assert.throws(()=>rules.validate({zoomMin:6,zoomMax:3}));assert.throws(()=>rules.validate({jumpHeight:100}));
const authored=scope.FrontierWorld.validate({...scope.FrontierWorld.generate('rules'),parameters:{jumpHeight:2,gravity:10,playerSpeed:4},music:{exploration:['Forest.ogg','Road.ogg'],combat:['Danger.ogg'],mapExploration:['Temple.ogg'],volume:.5}});
assert.equal(authored.parameters.jumpHeight,2);const jumper={hp:100,grounded:true};scope.FrontierTerrain.jump(jumper,authored);assert(Math.abs(jumper.verticalVelocity-Math.sqrt(40))<1e-10);
assert.equal(scope.FrontierWorld.validate(JSON.parse(JSON.stringify(authored))).music.mapExploration[0],'Temple.ogg');
const music=scope.FrontierMusic;
assert.throws(()=>music.validate({exploration:['../evil.ogg']}));assert.equal(music.effective(authored.music,'exploration')[0],'Temple.ogg');assert.equal(music.effective(authored.music,'combat')[0],'Danger.ogg');
const next=music.playlist(['A.ogg','B.ogg','C.ogg'],()=>.2),sequence=Array.from({length:12},next);for(let i=0;i<12;i+=3)assert.equal(new Set(sequence.slice(i,i+3)).size,3);for(let i=1;i<12;i++)assert.notEqual(sequence[i],sequence[i-1]);
// Audio stub verifies transitions/end-of-track progression without real output.
const voices=[];scope.Audio=class{constructor(){voices.push(this);this.paused=true;}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}removeAttribute(){this.src='';}load(){}};
const director=music.create(),musicGame={sourceWorld:authored,player:{x:24,y:24,hp:100},maps:{frontier:{entities:[]}},sceneEvents:[]};
scope.FrontierAggro.update(musicGame,.016);director.update(musicGame);director.unlock();assert(voices[0].src.includes('/exploration/'));assert(voices[0].src.endsWith('Temple.ogg'));
musicGame.maps.frontier.entities.push({kind:'monster',x:25,y:24,hp:100,dead:false});scope.FrontierAggro.update(musicGame,.016);director.update(musicGame);assert.equal(director.mode,'combat');assert(voices[0].src.includes('/combat/'));assert.equal(voices[0].currentTime,0);assert(voices[0].src.endsWith('Danger.ogg'));
musicGame.maps.frontier.entities[0].dead=true;scope.FrontierAggro.update(musicGame,.016);director.update(musicGame);assert.equal(director.mode,'exploration');director.stop();assert.equal(voices[0].src,'');
console.log('PASS: editable rules bounds/round-trip/jump apex conversion; shuffled soundtrack bags, map override, combat/exploration transitions and stop.');
load('src/render.js');
// Every armed row/frame must project to the calibrated pixel at varied pitch
// and zoom; this tests the inverse transform rather than its implementation text.
for(const pitch of [-1.04,-.7,0,.6,1.04])for(const distance of [1.6,3.8,7])for(let sector=0;sector<8;sector++)for(let column=0;column<3;column++){
 const actor={id:'player',x:24,y:24,z:2,height:1.65,facingX:Math.sin(sector*Math.PI/4),facingY:Math.cos(sector*Math.PI/4),vx:1,vy:0,walkTime:[.42,.0,.14][column]+.00001};
 const game={player:actor,sourceWorld:{parameters:rules.validate({zoomMin:1.6,aimMin:-60,aimMax:60})},camera:{yaw:0,pitch,distance,height:.6,firstPerson:false}};
 const cam=scope.FrontierRender.camera(game),feet=scope.FrontierRender.project(cam,24,24,2),selected=M.frame(actor,game),m=selected.profile.muzzles[selected.row+':'+selected.column],f=selected.frame,scale=1.65/selected.profile.referenceHeight*feet.scale;
 const origin=M.point(actor,game),projected=scope.FrontierRender.project(cam,origin.x,origin.y,origin.z);
 assert(Math.abs(projected.x-(feet.x+(m.x-f.x-f.anchorX)*scale))<1e-7);
 assert(Math.abs(projected.y-(feet.y+(m.y-f.y-f.h)*scale))<1e-7);
 assert(Number.isFinite(projected.y));
}
console.log('PASS: all armed muzzle rows/frames stay at authored projected pixels across wider aim limits and zoom.');
