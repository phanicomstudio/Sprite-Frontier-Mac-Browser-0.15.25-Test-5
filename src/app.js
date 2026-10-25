/* MAINTAINER GUIDE
 * Application coordinator: creates playtests, routes input, drives simulation and binds editor/HUD controls. Change gameplay rules in their modules; keep this file responsible for orchestration. Authored world and runtime game are separate objects: editor mutations restart a temporary playtest.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function () {
'use strict'  ;
  const elements=new Map(),$ = id => {
    if(!elements.has(id))elements.set(id,document.getElementById(id));
    return elements.get(id);
  }
  , view = $('view'), keys = new Set(), audio = MF.createFrontierAudio(),music=FrontierMusic.create();
  audio.music=music;
  let world, game, session, footsteps, editor, editing = false, history = [], serial = 0, last = 0, drag = null, mousePaused = false, captureAttempted = false, playPaused = false, hudMode=false;
  const originalHolster=MF.toggleHolster;
  MF.toggleHolster=(game,ui)=>{
    const facing={
      x:game.player.facingX,y:game.player.facingY
    }
    ;
    originalHolster(game,ui);
    if(game.player.holstered){
      game.player.facingX=facing.x;
      game.player.facingY=facing.y;
      game.player.movementFacing=facing;
    }
  }
  ;
  const mouse = FrontierInput.mouseLook(), padReader = FrontierInput.gamepadReader();
  view.tabIndex = 0;
  let noticeTimer;
  const log = text => {
    $('message').textContent = text;
    $('descriptionScreen').textContent=text;
    clearTimeout(noticeTimer);
    noticeTimer=setTimeout(()=>{
      if($('descriptionScreen').textContent===text)$('descriptionScreen').textContent='Point at an object to inspect it.';
    }
    ,6000);
  }
  ;
// Clone the ammo prefab so separately placed boxes never share pages or command arrays.
  function ammo(id,x,y){
    return {
      ...structuredClone(FrontierEventData.ammoTemplate),id,x,y
    }
    ;
  }
// Build the preset demonstration world and add authored conversation topics and terrain/sky defaults.
  function generated(seed){
    const result=FrontierWorld.generate(seed);
    result.parameters=FrontierParameters.validate();result.music=FrontierMusic.validate();
    result.events=structuredClone(FrontierEventData.initialEvents);
    const guide=result.events.find(e=>e.name.includes('guide'));
    if(guide)guide.topics=[{
      aliases:['ammo','ammunition','supplies'],answer:'Supply boxes near the starting point hold ammunition. Holster your weapon, point at a box, and left-click to collect it.'
    }
    ,{
      aliases:['frontier','world'],answer:'These hills are the Vector Frontier. Explore freely and use the editor to create your own encounters.'
    }
    ,{
      aliases:['weapons','gun','combat'],answer:'You can test the weapon profiles in the combat controls. Space draws or holsters your weapon.'
    }
    ];
    const example=FrontierEvents.create('conversation-demo',25,28);example.name='Conversation test NPC';example.pages[0].commands=[{type:'message',text:'Will you help explore the frontier?',dialogue:true},{type:'choices',key:'answer',options:['Not now','Yes']},{type:'branch',condition:{type:'variable',key:'answer',value:2}},{type:'selfSwitch',key:'A',value:true},{type:'message',text:'Thank you. Talk to me again!',dialogue:true},{type:'else'},{type:'message',text:'Come back whenever you are ready.',dialogue:true},{type:'end'}];const helped=FrontierEvents.page('Help accepted');helped.condition={type:'selfSwitch',key:'A'};helped.commands=[{type:'message',text:'We are ready to explore together.',dialogue:true}];example.pages.push(helped);result.events.push(example);
    result.terrain=structuredClone(FrontierProject.demo.terrain);
    result.sky=structuredClone(FrontierProject.demo.sky);
    return result;
  }
// Route event messages into the inspection CRT without interrupting pickups; retain modal fallback for layouts without that screen.
  function dialogue(message) {
    if(!message){$('dialogue').hidden=true;return false;}
    if(message&&!message.dialogue&&$('descriptionScreen')){
      $('dialogue').hidden=true;
      $('descriptionScreen').textContent=message.name+'\n'+message.text;
      $('descriptionScreen').scrollTop=0;
      return true;
    }
    $('dialogue').hidden = !message;
    if (message) {
      mousePaused=true;
      mouse.reset();
      $('dialogueName').textContent = message.name;
      $('dialogueText').textContent = message.text;
      const choices=$('dialogueChoices');choices.replaceChildren();
      $('nextMessage').hidden=!!message.options;
      for(const [i,label]of (message.options||[]).entries()){const button=document.createElement('button');button.textContent=label;button.onclick=()=>session.choose(i);choices.append(button);}
      keys.clear();
      drag = null;
      if (document.pointerLockElement) document.exitPointerLock();
    }
  }
// Lock camera look and release the pointer for live device interaction; movement
// and simulation continue. Returning preserves the existing camera orientation.
  function toggleHUD(){
    if(editing||session.busy)return;
    hudMode=!hudMode;
    $('gameFrame').classList.toggle('hudCursor',hudMode);
    $('inventoryPanel').hidden=true;
    keys.clear();
    drag=null;
    mouse.reset();
    if(hudMode){releaseLook(false);game.pointer={x:view.width/2,y:96};}
    else captureLook();
  }
  $('hudSkin').onchange=()=>FrontierDeviceHUD.skin($('hudSkin').value);
  let inventoryResume=false;
// Remember whether gameplay owned mouse look before the inventory opened, then restore that mode on close.
  function inventoryToggle(){
    if(editing||session.busy)return;
    const opening=$('inventoryPanel').hidden;
    $('inventoryPanel').hidden=!opening;
    if(opening)inventoryResume=!mousePaused&&!hudMode;
    playPaused=opening;
    keys.clear();
    drag=null;
    mouse.reset();
    mousePaused=true;
    if(opening&&document.pointerLockElement)document.exitPointerLock();
    if(!opening&&inventoryResume&&!hudMode)captureLook();
  }
  $('inventoryButton').onclick=inventoryToggle;
  $('remoteInventory').onclick=inventoryToggle;
  $('remoteResume').onclick=()=>{
    if(!$('inventoryPanel').hidden)inventoryToggle();
    if(hudMode)toggleHUD();
    else captureLook();
  }
  ;
  $('inventoryClose').onclick=inventoryToggle;
// Render inventory values from runtime state; ammo is displayed from combat reserve/loaded counts.
  function inventoryRender(){
    const list=$('inventoryItems');
    list.replaceChildren();
    const items=[['9mm ammunition',game.player.ammoReserve+' reserve / '+game.player.ammoLoaded+' loaded'],...[...session.state.inventory].filter(([id])=>id!=='ammo9')];
    for(const [name,amount] of items){
      const li=document.createElement('li');
      li.textContent=name+' — '+amount;
      list.append(li);
    }
  }
// Stop old footsteps and create a fresh runtime copy. Authored world stays intact; switches, pickups and combat reset unless explicitly restored.
  function restart(keepPosition = false) {
    footsteps?.stop();music.stop();
    dialogue(null);
    $('inventoryPanel').hidden=true;
    playPaused=false;
    const position = keepPosition && game ? {
      x: game.player.x, y: game.player.y
    }
    : null, camera = game?.camera;
    game = MF.makeFrontierGame(world, log);
    game.audio = audio;
    game.input = {
      keys
    }
    ;
    if (camera) game.camera = camera;
    session = FrontierEvents.createSession(world.events || [], {
      message: dialogue, log, canStand: (x, y,id) => !blocked(x, y, .13,game.runtime.entities.get(id)),
      item: (id, amount) => {
        if (id === 'ammo9') game.player.ammoReserve += amount;
      }
    }
    );
    game.eventSession = session;
    game.sourceWorld=world;
    PhanicomABS.equip(game,'handgun');
    PhanicomBlood.attach(game);
    preview();
    if (position && (editing || !blocked(position.x, position.y))) Object.assign(game.player, position);
    FrontierTerrain.ground(game.player,world,0);
    if (editing) game.player.holstered = true;
    $('terrainMode').value=world.terrain?.mode||'flat';
    $('terrainAmplitude').value=world.terrain?.amplitude||0;
    $('skyEnabled').checked=world.sky?.enabled!==false;
    parametersRefresh();
    footsteps = audio.start(game, log);
    keys.clear();
    editor?.refresh();
    preview();
  }
// Resolve event pages into scene entities and cache the result by page/position signature. Preserve damage state for existing IDs when a page changes.
  function preview() {
    if (!game) return;
    game.authoring = editing;
    game.selectedId = editor?.selectedId || '';
    const events=editing?world.events||[]:session.events;
    const pages=events.map(event=>editing?(event.id===editor?.selectedId?editor.pageIndex:0):session.activePage(event));
    const signature=events.map((event,i)=>event.id+':'+pages[i]+':'+event.x+':'+event.y+':'+(event.elevation||0)).join('|');
    if(game.sceneSignature===signature)return;
    game.sceneSignature=signature;
    game.sceneEvents=events.map((event,i)=>{
      const index=pages[i];
      if(index<0)return null;
      const page=event.pages[index],combat=event.combatNote?PhanicomABS.parseEvent({
        note:event.combatNote
      }
      ):null;
      const old=game.runtime.entities.get(event.id);
      const entity={
        id:event.id,eventId:event.id,name:event.name,x:event.x,y:event.y,elevation:event.elevation||0,z:FrontierTerrain.height(world,event.x,event.y)+(event.elevation||0)*.3,isAmmo:event.pages.some(p=>p.commands.some(c=>c.type==='giveItem'&&c.item==='ammo9')),kind:combat?'monster':page.graphic,type:combat?'monster':'prop',radius:combat?.hitRadius||.28,height:['chest','openChest'].includes(page.graphic)?1.05:1.65,range:event.range,solid:page.solid&&!page.through&&(page.priority||'normal')==='normal',priority:page.priority||'normal',spriteProfile:event.spriteProfile||undefined,combat,maxHp:combat?.maxHp||24,hp:old?.hp??combat?.maxHp??24,dead:old?.dead||false,facingX:old?.facingX||0,facingY:old?.facingY||1
      }
      ;
      game.runtime.entities.set(event.id,entity);
      return entity;
    }
    ).filter(Boolean);
  }
// Snapshot authored data, apply an edit, validate, then record undo and restart. On rejection restore the snapshot instead of keeping a partial edit.
  function mutate(action, callback) {
    const before = structuredClone(world);
    try {
      action();
      world = FrontierWorld.validate(world);
      history.push(before);redoHistory=[];
      if (history.length > 30) history.shift();
      restart(true);
      callback?.();
      log('Authored change applied.');
    }
    catch (error) {
      world = before;
      editor.refresh();
      log('Change rejected: ' + error.message);
    }
  }
// Reject overlapping props and route movement through validated undoable mutation.
  function moveObject(id, x, y) {
    const e = [...world.objects, ...(world.events || [])].find(e => e.id === id);
    if (!e) return;
    if (!e.pages && world.objects.some(o => o.id !== id && Math.hypot(o.x - x, o.y - y) < o.radius + e.radius)) {
      log('Placement overlaps another object.');
      return;
    }
    mutate(() => {
      e.x = x;
      e.y = y;
    }
    );
  }
// Remove the selected authored object/event, reset selection, and rebuild preview.
  function remove(id) {
    mutate(() => {
      world.objects = world.objects.filter(e => e.id !== id);
      world.events = (world.events || []).filter(e => e.id !== id);
    }
    );
    editor.choose('');
    preview();
  }
// Switch editor/playtest state, release capture and restart from authored data. F2 is the editor shortcut; Tab remains the HUD menu.
  function mode() {
    editing = !editing;
    mousePaused=editing;
    captureAttempted=false;
    playPaused=false;
    mouse.reset();
    if (document.pointerLockElement) document.exitPointerLock();
    keys.clear();
    drag = null;
    $('editor').hidden = !editing;
    $('mode').textContent = editing ? 'IN-LEVEL AUTHORING' : 'PLAYTEST';
    $('panelTitle').textContent = editing ? 'Edit where you play' : 'A world of sprites';
    $('intro').textContent = editing ? 'WASD explores the level. Right-drag looks around. Left-click selects or places; drag objects to move them. Double-click events to edit pages.' : 'Move the mouse to look. Click once to capture; Escape releases. Space holsters your weapon; left-click interacts and right-click inspects nearby objects.';
    $('edit').textContent = editing ? 'Playtest [F2]' : 'Open editor [F2]';
    restart(true);
    log(editing ? 'Authoring: combat and event execution paused.' : 'Fresh playtest: authored data preserved; temporary switches and pickups reset.');
  }
// Test world bounds and solid footprints for NPC/editor movement. Player step/jump collision is handled by terrain.js.
  function blocked(x, y, radius = .13, ignore = null) {
    return x < .5 || y < .5 || x > 47.5 || y > 47.5 || game.maps.frontier.entities.some(e => e !== ignore && !e.dead && Math.abs(e.x - x) < e.radius + radius && Math.abs(e.y - y) < e.radius + radius) || (game.sceneEvents || []).some(e => e!==ignore&&e.solid && Math.abs(e.x - x) < e.radius + radius && Math.abs(e.y - y) < e.radius + radius);
  }
// Move one axis at a time to slide along blocking footprints.
  function move(e, dx, dy, radius, ignore) {
    if (!blocked(e.x + dx, e.y, radius, ignore)) e.x += dx;
    if (!blocked(e.x, e.y + dy, radius, ignore)) e.y += dy;
  }
// Gate firing against editor, menu, event execution and death before calling the combat host.
  function shoot() {
    if (!editing && !playPaused && !session.busy && game.player.hp > 0) MF.fireShot(game, view.width/2, 96, game.ui);
  }
// Convert CSS/browser coordinates into logical canvas pixels; do not mix client pixels with projected points.
  function screenPoint(event) {
    const b = view.getBoundingClientRect();
    return {
      x: (event.clientX - b.left) / b.width * view.width, y: (event.clientY - b.top) / b.height * 480
    }
    ;
  }
// One foot is 0.3 world units; reach remains independent of rendering.
  const WORLD_FOOT=.3;
// Require a holstered weapon, nearby projected target and clear reach ray. World foot conversion is presentation only.
  function nearbyTarget(point){
    if(editing||session.busy||!game.player.holstered||game.player.hp<=0)return null;
    const cursor=point||(hudMode?game.pointer:null)||{x:view.width/2,y:96};
    const target=FrontierRender.pick(game,cursor.x,cursor.y),event=session.events.find(e=>e.id===target?.id);
    if(!target||target.dead)return null;
    const distance=Math.hypot(target.x-game.player.x,target.y-game.player.y,(target.z||0)-(game.player.z||0));
    if(distance>(event?.range??FrontierParameters.get(world,'interactionFeet')*WORLD_FOOT))return null;
    const obstruction=MF.frontierSpatial.sweep(game,{
      x:game.player.x,y:game.player.y,z:(game.player.z||0)+.9
    }
    ,{
      x:target.x,y:target.y,z:(target.z||0)+Math.min(.5,target.height/2)
    }
    ,.01,game.player.id);
    if(obstruction&&obstruction.id!==target.id)return null;
    return{
      target,event,distance
    }
    ;
  }
// Start the reachable event interact trigger; pickups are authored giveItem/self-switch commands.
  function interact(point){
    const hit=nearbyTarget(point);
    if(!hit){
      log('No reachable object here.');
      return;
    }
    if(!hit.event||!session.start(hit.event,'interact'))log('This object has no pickup or interaction.');
  }
// Display authored inspection text in the HUD, with sensible fallback descriptions.
  function inspect(point){
    const hit=nearbyTarget(point);
    if(!hit){
      log('No reachable object to inspect.');
      return;
    }
    const name=hit.event?.name||hit.target.name||hit.target.kind;
    const text=hit.event?.inspection||(hit.target.isAmmo?(hit.target.kind==='openChest'?'An empty ammunition box.':'A box containing 24 rounds of 9mm ammunition.'):'No further information has been recorded.');
    log(name+': '+text);
  }
// Intersect a screen ray with terrain and delegate placement at the resulting world coordinates.
  function place(point) {
    const p = FrontierRender.groundPoint(game, point.x, point.y);
    if (p) placeAt(p.x, p.y);
    else log('Point at the ground inside the level.');
  }
// Select, erase or instantiate an authored prop/event/ammo prefab within level bounds.
  function placeAt(x, y) {
    if (x < 1 || y < 1 || x > 47 || y > 47) {
      log('Place inside the level bounds.');
      return;
    }
    const tool = $('sceneTool').value;
    if (tool === 'select') {
      const nearest = [...world.objects, ...(world.events || [])].map(e => ({
        e, d: Math.hypot(e.x - x, e.y - y)
      }
      )).sort((a, b) => a.d - b.d)[0];
      editor.choose(nearest?.d < 1.5 ? nearest.e.id : '');
      preview();
      return;
    }
    const id = 'authored-' + Date.now() + '-' + ++serial;
    if (tool === 'event' || tool === 'ammo') {
      mutate(() => {
        world.events ||= [];
        world.events.push(tool === 'ammo' ? ammo(id, x, y) : FrontierEvents.create(id, x, y));
      }
      );
      editor.choose(id);
    }
    else {
      const kind = $('kind').value;
      if (kind === 'erase') {
        const near = world.objects.find(e => Math.hypot(e.x - x, e.y - y) < 1.5);
        if (near) remove(near.id);
        return;
      }
      const e = FrontierWorld.entity(kind, x, y, id);
      if (world.objects.some(o => Math.hypot(o.x - x, o.y - y) < o.radius + e.radius)) {
        log('Placement overlaps another object.');
        return;
      }
      mutate(() => world.objects.push(e));
      editor.choose(id);
    }
    preview();
  }
  let eventTestOrigin=null,redoHistory=[];
  world = generated('PHANICOM');
  editor = FrontierEditor.create({
    world: () => world, mutate, move: moveObject, remove, preview,
    runtime:()=>session.debug(),testEvent(id){eventTestOrigin={camera:{...game.camera},x:game.player.x,y:game.player.y};const camera={...game.camera};if(editing)mode();Object.assign(game.camera,camera);const event=session.events.find(e=>e.id===id);if(event)session.start(event,event.pages[session.activePage(event)]?.trigger||'interact');},
    returnEditor(){if(!editing)mode();if(eventTestOrigin){Object.assign(game.camera,eventTestOrigin.camera);game.player.x=eventTestOrigin.x;game.player.y=eventTestOrigin.y;eventTestOrigin=null;}}
  }
  );
  $('edit').onclick = mode;
  view.addEventListener('dblclick',event=>{if(editing){editor.choose(FrontierRender.pick(game,screenPoint(event).x,screenPoint(event).y)?.id||'');editor.openEvent?.();}});
  $('generate').onclick = () => {
    if (editing && !confirm('Replace the authored world? Export first to keep edits.')) return;
    world = generated($('seed').value || 'PHANICOM');
    history = [];
    editor.choose('');
    restart();
    log('Generated world: ' + world.seed);
  }
  ;
  $('aspect').onchange=()=>{
    const wide=$('aspect').value==='16:9';
    view.width=wide?854:640;
    game.viewWidth=view.width;
    document.documentElement.style.setProperty('--display-ratio',wide?'1.7777777778':'1.3333333333');
  }
  ;
  $('fullscreen').onclick = async () => {
    try{
      if(document.fullscreenElement)await document.exitFullscreen();
      else await $('viewport').requestFullscreen();
    }
    catch{
      log('Fullscreen is unavailable in this browser.');
    }
  }
  ;
  document.addEventListener('fullscreenchange',()=>{
    $('fullscreen').textContent=document.fullscreenElement?'Exit fullscreen':'Fullscreen';
  }
  );
  $('camera').onclick = () => {
    game.camera.firstPerson = !game.camera.firstPerson;
    $('camera').textContent = game.camera.firstPerson ? 'Third person [V]' : 'First person [V]';
  }
  ;
  $('terrainMode').onchange=()=>mutate(()=>{
    world.terrain={
      ...world.terrain,mode:$('terrainMode').value
    }
    ;
  }
  );
  $('terrainAmplitude').onchange=()=>mutate(()=>{
    world.terrain={
      ...world.terrain,amplitude:Number($('terrainAmplitude').value)
    }
    ;
  }
  );
  $('skyEnabled').onchange=()=>mutate(()=>{
    world.sky={
      ...world.sky,enabled:$('skyEnabled').checked
    }
    ;
  }
  );
  $('cameraHeight').oninput = () => game.camera.height = Number($('cameraHeight').value);
  $('undo').onclick = () => {
    if (history.length) {
      redoHistory.push(structuredClone(world));world = history.pop();
      restart(true);
      log('Authored change undone.');
    }
  }
  ;
  const redoButton=document.createElement('button');redoButton.id='redo';redoButton.textContent='Redo change';$('undo').after(redoButton);redoButton.onclick=()=>{if(redoHistory.length){history.push(structuredClone(world));world=redoHistory.pop();restart(true);log('Authored change redone.');}};
  $('sceneTool').onchange = () => log('Scene tool: ' + $('sceneTool').selectedOptions[0].textContent);
  $('map').onclick = event => {
    if (!editing) return;
    const b = $('map').getBoundingClientRect();
    placeAt((event.clientX - b.left) / b.width * 48, (event.clientY - b.top) / b.height * 48);
  }
  ;
  $('export').onclick = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(world, null, 2)], {
      type: 'application/json'
    }
    )), a = document.createElement('a');
    a.href = url;
    a.download = 'frontier-world.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    log('Authored world exported, including event pages.');
  }
  ;
  $('import').onchange = async event => {
    try {
      const f = event.target.files[0];
      if (!f) return;
      if (f.size > 1000000) throw Error('World file exceeds 1 MB.');
      const next = FrontierWorld.validate(JSON.parse(await f.text()));
      world = next;
      $('seed').value = world.seed;
      history = [];
      editor.choose('');
      restart();
      log('World and events imported.');
    }
    catch (error) {
      log('Import rejected: ' + error.message);
    }
    finally {
      event.target.value = '';
    }
  }
  ;
  $('nextMessage').onclick = () => {
    session.next();
    mousePaused=false;
    captureAttempted=false;
    mouse.reset();
  }
  ;
  $('volume').oninput = () => audio.setVolume(Number($('volume').value));
  document.addEventListener('pointerdown', () => audio.unlock().catch(() => {
  }
  ), {
    once: true
  }
  );
  // Keyboard routing: prevent form typing from becoming movement, keep one-shot actions separate from held keys.
  document.addEventListener('keydown', () => audio.unlock().catch(() => {
  }
  ), {
    once: true
  }
  );
// Clear motion baselines/held input and relinquish pointer lock. Optional pause stops gameplay while a menu is open.
  function releaseLook(pause=false){
    mousePaused=true;
    captureAttempted=false;
    playPaused=pause;
    mouse.reset();
    keys.clear();
    drag=null;
    if(document.pointerLockElement)document.exitPointerLock();
  }
// Acquire look only in gameplay. Preserve yaw/pitch and reset mouse deltas so restoring capture cannot snap the view.
  function captureLook(){
    if(hudMode||editing||session.busy||!$('inventoryPanel').hidden)return;
    mousePaused=false;
    playPaused=false;
    captureAttempted=true;
    mouse.reset();
    view.focus({
      preventScroll:true
    }
    );
    audio.unlock().catch(()=>{
    }
    );
    try{
      const request=view.requestPointerLock?.();
      request?.catch(()=>{
        log('Mouse look active over the view; pointer capture unavailable here.');
      }
      );
    }
    catch{
      log('Mouse look active over the view; pointer capture unavailable here.');
    }
  }
// Apply mouse sensitivity and bounded pitch. Keep limits consistent with gamepad input and framing tests.
  function rotate(dx,dy){
    game.camera.yaw+=dx*FrontierParameters.get(world,'mouseYaw');
    game.camera.pitch=clampPitch(game.camera.pitch-dy*FrontierParameters.get(world,'mousePitch'));
  }
  $('mouseLook').onclick=captureLook;
  const form = event => /INPUT|SELECT|TEXTAREA|BUTTON/.test(event.target.tagName);
  document.addEventListener('keydown',event=>{
    if(form(event)&&!['p','P','F2'].includes(event.key)&&!(event.key.toLowerCase()==='i'&&!$('inventoryPanel').hidden))return;
    const key=event.key.toLowerCase();
    if([' ','arrowleft','arrowright'].includes(key))event.preventDefault();
    if(!event.repeat){
      if(key==='escape')releaseLook();
      if(key==='p')toggleHUD();
      if(key==='f2'){
        event.preventDefault();
        mode();
      }
      if(key==='i')inventoryToggle();
      if(key==='v')$('camera').click();
      if(key===' '&&!editing&&!session.busy)MF.toggleHolster(game,game.ui);
      if(key==='r'&&!editing&&!session.busy)MF.reload(game,game.ui);
      if(key==='f')shoot();
      if(key==='e'&&!editing&&!playPaused&&!session.busy)FrontierTerrain.jump(game.player,world);
      if(key==='enter'&&session.message)$('nextMessage').click();
    }
    keys.add(key);
  }
  );
  document.addEventListener('keyup',event=>keys.delete(event.key.toLowerCase()));
  window.addEventListener('blur',()=>releaseLook());
  view.addEventListener('contextmenu',event=>event.preventDefault());
  view.addEventListener('pointerenter',()=>mouse.reset());
  view.addEventListener('pointerleave',()=>{
    if(document.pointerLockElement!==view)mouse.reset();
  }
  );
  // The first gameplay click captures look without firing. Editor gestures select/place/drag independently of gameplay capture.
  view.addEventListener('pointerdown',event=>{
    view.focus({
      preventScroll:true
    }
    );
    if(session.busy&&!editing)return;
    const activateOnly=!hudMode&&!editing&&event.button===0&&(mousePaused||!captureAttempted);
    drag={
      x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,moved:false,button:event.button,activateOnly,moveId:editing&&event.button===0&&$('sceneTool').value==='select'?(FrontierRender.pick(game,screenPoint(event).x,screenPoint(event).y)?.id||null):null
    }
    ;
    if(activateOnly)captureLook();
    if(editing){if(drag.moveId)editor.choose(drag.moveId);view.setPointerCapture(event.pointerId);}
  }
  );
  // Captured gameplay uses relative deltas; authoring uses right-drag and a projected ground ghost.
  view.addEventListener('pointermove',event=>{
    if(hudMode&&!editing){game.pointer=screenPoint(event);return;}
    if(!editing){
      const delta=mouse.motion(event,document.pointerLockElement===view,!mousePaused&&!playPaused&&!session.busy);
      rotate(delta.x,delta.y);
      return;
    }
    if(!drag)return;
    if(Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)>4)drag.moved=true;
    if(drag.moveId){
      const point=screenPoint(event),p=FrontierRender.groundPoint(game,point.x,point.y);
      game.dragGhost=p?{
        ...p,id:drag.moveId
      }
      :null;
    }
    else if(drag.button===2)rotate((event.clientX-drag.x)*2,(event.clientY-drag.y)*2);
    drag.x=event.clientX;
    drag.y=event.clientY;
  }
  );
  // Commit the completed gesture once; canceled input/activation-only clicks cannot fire or pick up.
  view.addEventListener('pointerup',event=>{
    if(!drag)return;
    const point=screenPoint(event);
    if(editing&&drag.moved&&drag.moveId&&game.dragGhost)moveObject(drag.moveId,game.dragGhost.x,game.dragGhost.y);
    else if(editing&&!drag.moved&&drag.button===0){
      if($('sceneTool').value==='select'){
        editor.choose(FrontierRender.pick(game,point.x,point.y)?.id||'');
        preview();
      }
      else place(point);
    }
    else if(!editing&&!drag.activateOnly&&!playPaused){
      if(drag.button===0){
        if(game.player.holstered)interact(hudMode?point:null);
        else shoot();
      }
      if(drag.button===2)inspect(hudMode?point:null);
    }
    game.dragGhost=null;
    drag=null;
  }
  );
  view.addEventListener('pointercancel',()=>{
    drag=null;
    game.dragGhost=null;
  }
  );
  // Capture changes clear baseline/held keys. Window blur and Escape deliberately leave the mouse released.
  document.addEventListener('pointerlockchange',()=>{
    drag=null;
    keys.clear();
    mouse.reset();
    if(document.pointerLockElement===view){
      mousePaused=false;
      captureAttempted=true;
    }
    else if(!editing&&!session.busy){
      mousePaused=true;
      captureAttempted=false;
    }
  }
  );
  document.addEventListener('pointerlockerror',()=>{
    if(!editing&&!session.busy){
      mousePaused=false;
      log('Mouse look active over the view; click capture is unavailable in this browser.');
    }
  }
  );
  view.addEventListener('wheel',event=>{
    event.preventDefault();
    if(hudMode)return;
    game.camera.distance=Math.max(FrontierParameters.get(world,'zoomMin'),Math.min(FrontierParameters.get(world,'zoomMax'),game.camera.distance+event.deltaY*.005));
  }
  ,{
    passive:false
  }
  );
  // Ordered simulation: poll input → pause gate → locomotion/ground → events → combat/effects → NPC attacks. dt is seconds and capped by frame().
  function update(dt) {
    game.elapsed += dt;
    const field=/INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName||'');
    let pads=[];
    try{
      pads=navigator.getGamepads?.()||[];
    }
    catch{
    }
    const pad=padReader.poll(pads,!editing&&!field&&document.hasFocus());
    $('controllerStatus').textContent=pad.connected?'Controller connected · standard layout':'Controller: connect and press a button.';
    for(const action of pad.actions){
      if(action==='pause'){
        playPaused=!playPaused;
        releaseLook(playPaused);
      }
      else if(action==='interact'){
        if(session.message)$('nextMessage').click();
        else if(!playPaused)interact({
          x:view.width/2,y:96
        }
        );
      }
      else if(!playPaused&&!session.busy){
        if(action==='fire')shoot();
        if(action==='reload')MF.reload(game,game.ui);
        if(action==='holster')MF.toggleHolster(game,game.ui);
        if(action==='camera')$('camera').click();
        if(action==='jump')FrontierTerrain.jump(game.player);
      }
    }
    if(playPaused)return;
    if(!session.busy&&!editing&&!hudMode){
      game.camera.yaw+=pad.look.x*2.2*dt;
      game.camera.pitch=clampPitch(game.camera.pitch-pad.look.y*1.5*dt);
    }
    const movementKeys=new Set(keys);
    if(pad.sprint)movementKeys.add('shift');
    if (document.activeElement && /INPUT|SELECT|TEXTAREA|BUTTON/.test(document.activeElement.tagName)) {
      keys.clear();
      movementKeys.clear();
    }
    if (!editing && session.busy) {
      game.player.vx = game.player.vy = game.player.walkTime = 0;
      session.update(dt, game.player);
      preview();
      return;
    }
    if (!editing && game.player.hp <= 0) {
      FrontierAggro.update(game,dt);
      PhanicomBlood.update(game,dt);
      return;
    }
    if (!hudMode&&keys.has('arrowleft')) game.camera.yaw -= dt * 1.8;
    if (!hudMode&&keys.has('arrowright')) game.camera.yaw += dt * 1.8;
    MF.frontierMovement.movePlayer(game, movementKeys, dt, editing ? (x, y) => x < .5 || y < .5 || x > 47.5 || y > 47.5 : (x,y,r)=>FrontierTerrain.blocked(game,x,y,r),pad.move);
    FrontierTerrain.ground(game.player,world,dt,editing?[]:[...game.maps.frontier.entities,...(game.sceneEvents||[]).filter(e=>e.solid)]);
    if (movementKeys.has('shift')) keys.add('ShiftLeft');
    else keys.delete('ShiftLeft');
    footsteps.update(dt);
    if (editing) return;
    if (!game.player.holstered) MF.updateAim(game);
    session.update(dt, game.player);
    FrontierTerrain.ground(game.player,world,0,[...game.maps.frontier.entities,...(game.sceneEvents||[]).filter(e=>e.solid)]);
    preview();
    if (session.busy) return;
    FrontierAggro.update(game,dt);
    PhanicomABS.update(game,dt,keys.has('f')||pad.fireHeld||drag?.button===0&&!drag.activateOnly);
    MF.updateProjectiles(game, dt, game.ui);
    PhanicomBlood.update(game,dt);
    for (const e of [...game.maps.frontier.entities,...game.sceneEvents.filter(e=>e.combat)]) {
      if (e.kind !== 'monster' || e.dead || !e.aggro) continue;
      e.stunTime = Math.max(0, (e.stunTime || 0) - dt);
      e.attackTime = Math.max(0, (e.attackTime || 0) - dt);
      const dx = game.player.x - e.x, dy = game.player.y - e.y, distance = Math.hypot(dx, dy);
      if (distance > .85 && !e.stunTime) move(e, dx / distance * dt * .9, dy / distance * dt * .9, e.radius, e);
      e.z=FrontierTerrain.height(world,e.x,e.y)+(e.elevation||0)*.3;
      if(e.combat&&distance<e.combat.range&&!e.attackTime&&!e.stunTime){
        e.facingX=dx/Math.max(.01,distance);
        e.facingY=dy/Math.max(.01,distance);
        const cfg=e.combat,w={
          ...cfg,id:e.id+'-weapon',profileId:cfg.profileId,type:cfg.attack,magazineSize:0,firingModel:cfg.attack==='hitscan'?'hitscan':'projectile',projectile:{
            speed:cfg.speed,radius:cfg.radius,range:cfg.range,lifetime:cfg.range/cfg.speed,tracerColor:cfg.tracerColor,tracerLife:cfg.tracerLife
          }
        }
        ;
        PhanicomABS.pattern(game,e,w,{
          x:e.facingX,y:e.facingY
        }
        ,game.ui);
        PhanicomCombatCore.playGoldenEyeProfile(cfg.audioProfile,cfg.audioVolume);
        e.attackTime=cfg.fireRate/60;
      }
      if (!e.combat&&distance < 1.05 && !e.attackTime && !e.stunTime) {
        MF.resolveProjectileImpact(game, {
          id: 'sentinel-strike', ownerId: e.id, weaponId: 'sentinel-melee', damage: 5, damageType: 'melee', position: {
            x: game.player.x, y: game.player.y
          }
        }
        , {
          id: game.player.id, kind: 'target'
        }
        , game.ui);
        e.attackTime = 1.2;
        log('Sentinel strikes for 5 damage.');
      }
    }
    for (const key of ['shotEffects', 'muzzleFlashes', 'particles']) {
      game[key] = game[key].filter(e => (e.life -= dt) > 0);
      if (key === 'particles') for (const e of game[key]) {
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        e.z = Math.max(0, e.z + e.vz * dt * 20);
        e.vz -= dt * 9;
      }
    }
  }
// Select the same directional animation frame used for drawing so muzzle points stay synchronized.
  // Browser animation clock. Draw world/HUD every visible frame; slower DOM labels update at 10Hz. Never reset camera to open/close a menu.
  function frame(time) {
    const dt = Math.min(.05, (time - last) / 1000 || 0);
    last = time;
    if(document.visibilityState==='hidden'){
      requestAnimationFrame(frame);
      return;
    }
    update(dt);
    if(!editing)music.update(game);
    FrontierDeviceHUD.update(game);
    FrontierRender.draw(view, game);
    FrontierRender.map($('map'), world, game, editing);
    if(time-(game.uiTime||0)<100){
      requestAnimationFrame(frame);
      return;
    }
    game.uiTime=time;
    if(!$('inventoryPanel').hidden)inventoryRender();
    const nearby=nearbyTarget();
    $('targetLabel').textContent=nearby?(nearby.event?.name||nearby.target.name||nearby.target.kind)+' · '+(nearby.distance/WORLD_FOOT).toFixed(1)+' ft · Left: interact / Right: inspect':'';
    $('hud').textContent = `VITALITY ${game.player.hp} / 100\n${game.player.holstered ? 'HOLSTERED' : '9MM'}  ${game.player.ammoLoaded} / ${game.player.ammoReserve}   ·   ${editing ? 'AUTHORING · WASD / RIGHT-DRAG' : playPaused ? 'PAUSED · START / CLICK TO RESUME' : hudMode ? 'POINT AND CLICK · P TO RETURN' : mousePaused ? 'MOUSE RELEASED · CLICK TO RESUME' : 'MOUSE LOOK · ESC TO RELEASE'}`;
    $('badge').lastElementChild.textContent = (game.camera.firstPerson ? 'First person' : 'Third person') + ' · prototype 0.6';
    $('counts').textContent = world.objects.length + ' objects · ' + (world.events || []).length + ' events · seed ' + world.seed;
    requestAnimationFrame(frame);
  }
  let menuResume=false,askEvent;
// Remember previous look ownership and freeze simulation before exposing cursor controls.
  function openMenu(id){
    menuResume=!mousePaused&&!hudMode;
    releaseLook(true);
    $(id).hidden=false;
  }
// Restore the previous gameplay/HUD mode without changing camera orientation.
  function closeMenu(id){
    $(id).hidden=true;
    if(menuResume&&!hudMode)captureLook();
    else playPaused=false;
  }
  $('weaponProfile').replaceChildren(...[...PhanicomABS.weapons].map(([id,w])=>new Option(w.name,id)));
  $('weaponProfile').value='handgun';
  // Profile selector is a demo equipment surface. A future item/equipment editor can call the same equip API.
  $('weaponProfile').onchange=()=>{
    PhanicomABS.equip(game,$('weaponProfile').value);
    view.focus();
    log('Equipped '+game.player.weapon.name);
  }
  ;
  $('bloodType').onchange=()=>PhanicomBlood.setPlayerType($('bloodType').value);
  $('testBlood').onclick=()=>PhanicomBlood.sprayCharacter(game.player,{
    count:24
  }
  );
  $('openMuzzle').onclick=()=>{
    openMenu('muzzlePanel');
    $('muzzleFrame').contentWindow.postMessage({
      type:'phanicom-muzzle-open',data:FrontierMuzzle.export()
    }
    ,'*');
  }
  ;
  $('muzzleClose').onclick=()=>closeMenu('muzzlePanel');
// Validate profiles before replacing them and persist a convenience copy locally. Export JSON for portable saves.
  function applyMuzzles(data){
    FrontierMuzzle.load(data);
    try{
      localStorage.setItem('phanicom-muzzles',JSON.stringify(FrontierMuzzle.export()));
    }
    catch{
    }
    log('Muzzle calibration applied.');
  }
  window.addEventListener('message',event=>{
    if(event.source===$('muzzleFrame').contentWindow&&event.data?.type==='phanicom-muzzles'){
      try{
        applyMuzzles(event.data.data);
      }
      catch(e){
        log(e.message);
      }
    }
  }
  );
  $('muzzleImport').onchange=async()=>{
    try{
      applyMuzzles(JSON.parse(await $('muzzleImport').files[0].text()));
    }
    catch(e){
      log(e.message);
    }
  }
  ;
  // Prefer the pointed NPC; fall back to a nearby authored topic speaker within its reach. Cursor menu freezes camera/simulation.
  $('remoteAsk').onclick=()=>{
    const hit=nearbyTarget();
    askEvent=hit?.event;
    if(!askEvent?.topics?.length){
      askEvent=session.events.filter(e=>e.topics?.length&&Math.hypot(e.x-game.player.x,e.y-game.player.y)<=e.range).sort((a,b)=>Math.hypot(a.x-game.player.x,a.y-game.player.y)-Math.hypot(b.x-game.player.x,b.y-game.player.y))[0];
    }
    if(!askEvent){
      log('Move near a character with conversation topics.');
      return;
    }
    openMenu('askPanel');
    $('askInput').focus();
  }
  ;
  $('askClose').onclick=()=>closeMenu('askPanel');
  $('askForm').onsubmit=event=>{
    event.preventDefault();
    log(askEvent.name+': '+FrontierParser.ask($('askInput').value,FrontierParser.compile(askEvent.topics),session.state));
  }
  ;
// Create a temporary JSON download URL and revoke it after the browser starts the download.
  function download(data,name){
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{
      type:'application/json'
    }
    ));
    a.download=name;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  // Save persistent scalars/Map entries only; live weapon objects and effects are reconstructed, never serialized wholesale.
  $('saveCombat').onclick=()=>download({
    schema:'phanicom-playtest/1',world,player:{
      x:game.player.x,y:game.player.y,...PhanicomABS.exportState(game)
    }
    ,blood:PhanicomBlood.exportState(),switches:[...session.state.switches],variables:[...session.state.variables],selfSwitches:[...session.state.selfSwitches],inventory:[...session.state.inventory]
  }
  ,'playtest-save.json');
// Validate the entire save before replacing the running world. Weapon IDs
// are serialized strings; equip reconstructs the object after scalar restore.
  $('loadCombat').onchange=async()=>{
    try{
      const file=$('loadCombat').files[0];
      if(!file)return;
      if(file.size>2000000)throw Error('Playtest save exceeds 2 MB.');
      const save=FrontierSave.validate(JSON.parse(await file.text()));
      world=save.world;
      restart();
      const {
        weapon,deathMode,...scalars
      }
      =save.player;
      Object.assign(game.player,scalars);
      PhanicomABS.equip(game,weapon);
      game.deathMode=deathMode;
      PhanicomBlood.restoreState(save.blood);
      for(const key of ['switches','variables','selfSwitches','inventory'])session.state[key]=new Map(save[key]);
      game.sceneSignature=null;
      preview();
      FrontierTerrain.ground(game.player,world,0);
      $('weaponProfile').value=weapon;
      log('Playtest restored.');
    }
    catch(e){
      log(e.message);
    }
    finally{
      $('loadCombat').value='';
    }
  }
  ;
  try{
    const saved=localStorage.getItem('phanicom-muzzles');
    if(saved)FrontierMuzzle.load(JSON.parse(saved));
  }
  catch{
  }
  // Project rules are authored separately from event pages. Applying uses the
  // same validated/undoable mutation path as other editor changes.
  function clampPitch(value){return Math.max(FrontierParameters.get(world,'aimMin')*Math.PI/180,Math.min(FrontierParameters.get(world,'aimMax')*Math.PI/180,value));}
  for(const [key,field]of Object.entries(FrontierParameters.fields)){
    const label=document.createElement('label'),input=document.createElement('input');label.textContent=field.label;input.id='parameter-'+key;input.type='number';input.min=field.min;input.max=field.max;input.step=field.step;label.append(input);$('globalParameters').append(label);
  }
  function parametersRefresh(){
    for(const key of Object.keys(FrontierParameters.fields))$('parameter-'+key).value=FrontierParameters.get(world,key);
    const settings=world.music||FrontierMusic.defaults;$('musicExploration').value=settings.exploration.join('\n');$('musicCombat').value=settings.combat.join('\n');$('musicMap').value=settings.mapExploration.join('\n');$('musicVolume').value=settings.volume;FrontierMusicPicker.refresh();
  }
  $('applyParameters').onclick=()=>mutate(()=>{world.parameters=FrontierParameters.validate(Object.fromEntries(Object.keys(FrontierParameters.fields).map(key=>[key,Number($('parameter-'+key).value)])));game.camera.pitch=clampPitch(game.camera.pitch);});
  $('resetParameters').onclick=()=>mutate(()=>{world.parameters=FrontierParameters.validate();});
  $('applyMusic').onclick=()=>mutate(()=>{world.assetCatalog=FrontierMusicPicker.catalog();const lines=id=>$(id).value.split(/\n/).map(s=>s.trim()).filter(Boolean);world.music=FrontierMusic.validate({exploration:lines('musicExploration'),combat:lines('musicCombat'),mapExploration:lines('musicMap'),volume:Number($('musicVolume').value)});});
  restart();
  requestAnimationFrame(frame);
}
)();
