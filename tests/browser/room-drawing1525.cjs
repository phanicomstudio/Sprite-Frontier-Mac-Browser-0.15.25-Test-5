const {chromium,launch}=require('./environment.cjs');const path=require('node:path');const assert=require('node:assert/strict');

(/* @function navigation.run — Inputs: none. Exercises actual editor ascent and release plus playtest mode; always closes browser. */ async function(){const b=await chromium.launch(launch);try{const p=await b.newPage();await p.addInitScript(/* @function navigation.capture — Inputs: none. Captures production adapter without changing behavior. */function(){let v;Object.defineProperty(window,'FrontierRoomEditor',{get:/* @function navigation.get — Inputs: none. Returns original namespace; no effects. */function(){return v;},set:/* @function navigation.set — Inputs: namespace; wraps factory only to retain adapter. */function(n){const c=n.create;n.create=/* @function navigation.create — Inputs: adapter. Returns original controller and retains test reference. */function(a){window.navigationApi=a;return c(a);};v=n;}});});await p.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));await p.waitForSelector('#workspaceToggle');await p.locator('#workspaceToggle').click();
await p.locator('#activeMap').selectOption({label:'Saloon Geometry Room'});
await p.evaluate(/* @function regression.wallEntry — Inputs: none. Places runtime editor body and authored spawn inside the saloon west wall through the real mutation adapter, reproducing an invalid user-authored starting point. */ function(){navigationApi.mutate(/* @function regression.placeSpawn — Inputs: none. Changes fixture spawn only within production Undo transaction. */ function(){navigationApi.world().spawn={x:6,y:12};});Object.assign(navigationApi.game().player,{x:6,y:12,z:0,grounded:false});});
await p.locator('#workspaceToggle').click();
assert(await p.locator('body.enginePlaytest').count(), 'Invalid wall entry should resolve to nearby clear floor');
const start=await p.evaluate(/* @function regression.start — Inputs: none. Returns runtime position and collision state without changing the player. */ function(){const g=navigationApi.game();return {x:g.player.x,y:g.player.y,z:g.player.z,blocked:FrontierInterior.blocked(g.sourceWorld,g.player.x,g.player.y,.13,g.player.z)};});
assert(!start.blocked && Math.abs(start.x-6)<1, 'Repair stays close to editor position and outside wall');
await p.keyboard.down('w');await p.waitForTimeout(500);await p.keyboard.up('w');
const end=await p.evaluate(/* @function regression.end — Inputs: none. Returns runtime position after real keyboard input. */ function(){const p=navigationApi.game().player;return {x:p.x,y:p.y};});
assert(Math.hypot(end.x-start.x,end.y-start.y)>.5, 'Actual playtest keyboard movement works in repaired saloon');
await p.keyboard.press('F2');
await p.locator('#newMapToolbar').click();await p.locator('#newMapTemplate').selectOption('flat');await p.locator('#confirmNewMap').click();
await p.getByRole('button',{name:'Build Structures',exact:true}).click();
const canvas=p.locator('#layoutPlan');await canvas.scrollIntoViewIfNeeded();
const bounds=await canvas.boundingBox(),dock=await p.locator('#tileRoomWindow').boundingBox();assert(bounds.width>500 && bounds.x+bounds.width<=dock.x+dock.width+1,'Drawing canvas is large and fits its separate window');
/* @function regression.logicalClick — Inputs: logical 420x280 plan pixel coordinates. Returns click promise on scaled production canvas; does not bypass pointer handlers. */
async function logicalClick(x,y){await canvas.scrollIntoViewIfNeeded();const b=await canvas.boundingBox();await p.mouse.click(b.x+x*b.width/420,b.y+y*b.height/280);}
await logicalClick(410,140);assert.match(await p.locator('#layoutStatus').textContent(),/bounds/);
await logicalClick(75,160);assert.match(await p.locator('#layoutStatus').textContent(),/draft floor tiles/,'Out-of-bounds stroke must not poison later painting');
const image=await canvas.evaluate(/* @function regression.gridPixels — Inputs: canvas element. Returns data URL snapshot for comparing the visible grid while a dimensional field is invalid. */ function(c){return c.toDataURL();});
await p.locator('#tileRoomWindow details summary').click();await p.locator('#layout-tile').fill('0');await p.locator('#layout-tile').press('Tab');await p.waitForTimeout(100);
assert.equal(await canvas.evaluate(/* @function regression.retainedGrid — Inputs: canvas element. Returns current pixels; no mutation. */ function(c){return c.toDataURL();}),image,'Invalid dimensions retain visible grid instead of clearing it grey');
await p.locator('#layout-tile').fill('2');await p.locator('#layout-tile').press('Tab');
await p.locator('#layoutTool').selectOption('erase');await logicalClick(75,160);assert.match(await p.locator('#layoutStatus').textContent(),/^0 draft/,'Erase remains usable after rejected stroke');
await p.locator('#layoutTool').selectOption('paint');await logicalClick(75,160);await p.locator('#layoutApply').click();assert.match(await p.locator('#layoutStatus').textContent(),/Layout applied/);
console.log('PASS saloon wall/spawn handoff, real WASD, bounded canvas, rejected edge stroke, retained grid and continued paint/erase/apply');
}finally{await b.close();}})().catch(/* @function regression.failure — Inputs: test error. Reports focused regression failure and sets process failure status. */function(e){console.error(e);process.exitCode=1;});
