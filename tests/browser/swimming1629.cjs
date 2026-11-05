const {chromium,launch}=require('./environment.cjs');
const observe=require('./host-observer1611.cjs'),assert=require('node:assert/strict'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({...launch,args:['--allow-file-access-from-files']});
 try{
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',e=>{errors.push(e.message);console.error(e.stack)});
  await observe(page);
  await page.goto('file:///'+path.resolve(process.env.FRONTIER_TEST_INDEX||'index.html').replaceAll('\\','/'));
  await page.locator('#workspaceToggle').click();
  await page.locator('#activeMap').selectOption('swimming-lake',{timeout:4000});
  const result=await page.evaluate(()=>{
   const g=testHost1611.roomApi.game(),p=g.player,move=MF.frontierMovement;
   g.authoring=false;g.editorFlight=false;
   const world=g.sourceWorld;
   const initial=FrontierRender.camera(g).outdoorIsometric;
   Object.assign(p,{x:32,y:32,z:-2.5});
   const active=move.swim(g,new Set(['e']),1/60,{});
   const perspective=!FrontierRender.camera(g).orthographic;
   for(let i=0;i<120;i++)move.swim(g,new Set(['e']),1/60,{});
   const surfaced=p.z> -1;
   Object.assign(p,{x:47,y:32,z:-.5});g.camera.yaw=Math.PI/2;g.camera.pitch=0;
   let dry=false;
   for(let i=0;i<240;i++){if(!move.swim(g,new Set(["w","e"]),1/60,{})){dry=p.x>=48;break;}}
   return {initial,active,perspective,surfaced,dry,restored:FrontierRender.camera(g).outdoorIsometric,water:Object.keys(world.water.cells).length};
  });
  assert(result.initial&&result.active&&result.perspective&&result.surfaced&&result.dry&&result.restored&&result.water>1000,JSON.stringify(result));
  for(const id of ['outdoor-assets-test','isometric-wilderness','demo','swimming-lake']){
   await page.locator('#activeMap').selectOption(id);
   const map=await page.evaluate(()=>({id:document.getElementById("activeMap").value,seed:testHost1611.roomApi.game().sourceWorld.seed}));
   assert.equal(map.id,id);
   assert.equal(map.seed==='swimming-lake',id==='swimming-lake');
  }
  await page.keyboard.press('F2');
  await page.evaluate(()=>{
   const g=testHost1611.roomApi.game();
   Object.assign(g.player,{x:32,y:32,z:-2});
  });
  await page.waitForFunction(()=>!!testHost1611.roomApi.game().swimming);
  await page.keyboard.press('v');
  await page.waitForFunction(()=>FrontierRender.camera(testHost1611.roomApi.game()).cy===240&&testHost1611.roomApi.game().camera.firstPerson);
  await page.waitForTimeout(250);
  assert.equal(await page.evaluate(()=>testHost1611.roomApi.game().camera.firstPerson),true);
  await page.keyboard.press('v');
  await page.waitForFunction(()=>!testHost1611.roomApi.game().camera.firstPerson);
  assert.deepEqual(errors,[]);
  console.log(result);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
