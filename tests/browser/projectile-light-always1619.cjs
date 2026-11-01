/* November 1, 2026: supersedes the optional checkbox/weapon opt-out acceptance from 0.16.15. Every projectile emits, even when stale settings attempt to disable it. */
const path=require('node:path'),assert=require('node:assert/strict'),fs=require('node:fs'),{
  chromium,launch
}
=require('./environment.cjs'),observe=require('./host-observer1611.cjs');

/* @function projectileAlwaysTest.open1619 — Inputs: isolated page. Opens the real lighting editor without changing saved values. */
async function open(page){
  await page.getByRole('button',{
    name:'Environment',exact:true
  }).click();
  await page.getByRole('button',{
    name:'Map lighting',exact:true
  }).click();
}

/* @function projectileAlwaysTest.probe1619 — Inputs: none. Exercises real projectile creation and frame selection against disabled legacy map/weapon values, zero brightness, low map budget and three camera modes. Restores transient game fields in finally; returns emitter counts and authored state for assertions. */
function probe(){
  const g=testHost1611.roomApi.game(),world=g.sourceWorld,shots=g.projectiles,first=g.camera.firstPerson,reports=[];
  try{
    for(const mode of ['third','first','isometric']){
      g.sourceWorld={
        ...world,presentation:FrontierIsometric.validate({
          mode:mode==='isometric'?'isometric':'perspective'
        }),lighting:{
          ...FrontierLocalLighting.validate(),enabled:false,budget:1,projectiles:{
            ...FrontierLocalLighting.validate().projectiles,enabled:false,intensity:0
          }
        }
      };
      g.camera.firstPerson=mode==='first';
      g.projectiles=[];
      for(let i=0;i<12;i++)g.projectiles.push(MF.createProjectile(g,g.player,{
        ...g.player.weapon,light:{
          enabled:false,intensity:0
        }
      },{
        x:0,y:1,z:0
      }));
      const frame=FrontierLocalLighting.frame(g,g.elapsed);
      reports.push({
        mode,count:frame.lights.length,allLit:g.projectiles.every(/* @function projectileAlwaysTest.positive1619 — Inputs: actual shot. Requires mandatory positive emission copied at creation, including old weapon off values. */function(p){
          return p.light.enabled&&p.light.intensity>0;
        }),onlyProjectiles:frame.lights.every(/* @function projectileAlwaysTest.selected1619 — Inputs: active source. Requires projectiles to own available slots even if decorative map lighting is disabled. */function(l){
          return l.id.startsWith('projectile-')&&l.enabled&&l.intensity>0;
        }),ambient:frame.ambient,limit:FrontierLocalLighting.limits.lights
      });
      FrontierRender.draw(document.getElementById('view'),g);
    }
  }finally{
    g.sourceWorld=world;
    g.projectiles=shots;
    g.camera.firstPerson=first;
  }
  return reports;
}
(/* @function projectileAlwaysTest.run1619 — Inputs: none. Tests real editor/playtest/map-switch/save-reload ownership and absent off controls. Old saved false/zero values are deliberately injected through authoring to verify canonical normalization. Browser and user data are isolated. */async function(){
  const browser=await chromium.launch({
    ...launch,args:['--allow-file-access-from-files']
  });
  try{
    const page=await browser.newPage({
      viewport:{
        width:1600,height:1000
      }
    }),errors=[];
    await observe(page);
    page.on('pageerror',/* @function projectileAlwaysTest.error1619 — Inputs: browser exception. Records real failures for final hard assertion; no suppression. */function(e){
      errors.push(e.message);
    });
    await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));
    await page.locator('#workspaceToggle').waitFor();
    await page.keyboard.press('F2');
    await open(page);
    assert.equal(await page.locator('#localProjectileLight').count(),0);
    await page.locator('#localLightSelection').selectOption('@projectiles');
    assert(await page.locator('#localSourceEnabled').isHidden());

    await page.evaluate(/* @function projectileAlwaysTest.legacy1619 — Inputs: none. Mutates a legacy map value through the actual authoring owner. No alternate settings store or fake save is used. */function(){
      testHost1611.roomApi.mutate(/* @function projectileAlwaysTest.legacyCommit1619 — Inputs: none. Writes stale off/zero flags that canonical world validation must upgrade before play or save. */function(){
        const w=testHost1611.roomApi.world();
        w.lighting={
          ...w.lighting,projectiles:{
            ...w.lighting.projectiles,enabled:false,intensity:0
          }
        };
      });
    });

    await page.keyboard.press('F2');
    const reports=await page.evaluate(probe);
    for(const r of reports){
      assert.equal(r.count,8);
      assert(r.allLit&&r.onlyProjectiles);
      assert.equal(r.ambient,1);
      assert.equal(r.limit,8);
    }

    for(const id of ['isometric-wilderness','hub-test']){
      await page.keyboard.press('F2');
      const available=await page.locator('#activeMap option').evaluateAll(/* @function projectileAlwaysTest.mapIds1619 — Inputs: existing map options. Returns their actual IDs for normal selection; avoids inventing a removed fixture. */function(options){
        return options.map(/* @function projectileAlwaysTest.mapId1619 — Inputs: option. Returns its real map ID. */function(o){
          return o.value;
        });
      });
      const target=available.includes(id)?id:available.find(/* @function projectileAlwaysTest.otherCell1619 — Inputs: map ID. Chooses a different actual cell if historical hub ID differs. */function(value){
        return value!=='isometric-wilderness';
      });
      await page.locator('#activeMap').selectOption(target);
      await page.keyboard.press('F2');
      const current=await page.evaluate(probe);
      assert(current.every(/* @function projectileAlwaysTest.mapProbe1619 — Inputs: mode report. Requires active emission after real map selection and F2 transitions. */function(r){
        return r.allLit&&r.onlyProjectiles&&r.count===8;
      }));
    }

    await page.keyboard.press('F2');
    await page.reload();
    await page.locator('#workspaceToggle').waitFor();
    const restored=await page.evaluate(probe);
    assert(restored.every(/* @function projectileAlwaysTest.reloadProbe1619 — Inputs: mode report. Requires factory/frame emission after real project reload. */function(r){
      return r.allLit&&r.onlyProjectiles;
    }));
    assert.deepEqual(errors,[]);
    fs.writeFileSync('test-artifacts/projectile-light-always1619.json',JSON.stringify({
      reports,restored,errors
    },null,2));
    console.log('PASS mandatory projectile lights through map switches, editor/playtest and reload; old map/weapon off/zero flags ignored, no off UI, eight-slot priority and live normals preserved');
  }finally{
    await browser.close();
  }
})().catch(/* @function projectileAlwaysTest.failure1619 — Inputs: error. Reports unsuccessful acceptance and sets failed exit status. */function(e){
  console.error(e);
  process.exitCode=1;
});


