/* November 1, 2026: actual GPU pixels prove light-direction response, rather than only checking that a normal file exists. */
const {
  chromium,launch
}
=require('./environment.cjs'),assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');

(/* @function liveNormalsTest.run1618 — Inputs: none. Exercises original Pixi sprite/terrain and geometry shaders with opposing lights, actual normal samples and unchanged albedo. Keeps all readbacks in tests, closes browser on failure. */async function(){

  const browser=await chromium.launch({
    ...launch,args:['--allow-file-access-from-files']
  });
  try{

    const page=await browser.newPage(),errors=[];
    page.on('pageerror',/* @function liveNormalsTest.error1618 — Inputs: browser exception. Records actual shader/runtime failures for a final hard assertion. */function(e){
      errors.push(e.message);
    });
    await require('./host-observer1611.cjs')(page);
    await page.goto('file:///'+path.resolve('index.html').replaceAll('\\','/'));
    await page.waitForFunction(/* @function liveNormalsTest.ready1618 — Inputs: none. Waits for actual GPU adapter, no replacement renderer. */function(){
      return !!FrontierPixi.current();
    });

    const result=await page.evaluate(/* @function liveNormalsTest.pixels1618 — Inputs: none. Builds isolated real GPU materials with constant white albedo and known tangent normals. Returns synchronous pixels, source hashes and ownership identity; game/project state is not saved or altered. */async function(){

      const ctx=FrontierPixi.current(),albedo=new Image(),normal=new Image(),c=document.createElement('canvas');
      c.width=c.height=4;
      let paint=c.getContext('2d');
      paint.fillStyle='#ffffff';
      paint.fillRect(0,0,4,4);
      albedo.src=c.toDataURL();
      await albedo.decode();
      paint.fillStyle='rgb(230,128,203)';
      paint.fillRect(0,0,4,4);
      normal.src=c.toDataURL();
      await normal.decode();
      albedo.frontierNormalImage=normal;

      const base={
        ambient:.1,steps:0,blockers:[],cache:new Map()
      },right={
        x:3,y:-2,z:1,radius:10,rgb:[1,1,1],intensity:1,falloff:1
      },left={
        ...right,x:-3
      };

      /* @function liveNormalsTest.sprite1618 — Inputs: physical lamp. Returns actual pixel from the original drawImage owner using the live mesh and unchanged quad/mask pipeline. GPU readback is test-only. */
      function sprite(light){
        ctx.begin();
        ctx.breathing=null;
        ctx.underwater=null;
        ctx.fog=null;
        ctx.assetPools=null;
        ctx.fogDepth=0;
        ctx.localLightFrame={
          ...base,lights:[light]
        };
        ctx.liveNormalSurface={
          center:[0,0,1],right:[1,0,0],up:[0,0,1],facing:[0,-1,0],size:[2,2]
        };
        ctx.drawImage(albedo,0,0,4,4,0,0,64,64);
        ctx.liveNormalSurface=null;
        ctx.end();
        const gl=ctx.app.renderer.gl,p=new Uint8Array(4),r=ctx.app.renderer.resolution;
        gl.readPixels(32*r,gl.drawingBufferHeight-32*r,1,1,gl.RGBA,gl.UNSIGNED_BYTE,p);
        return Array.from(p);
      }

      const game=testHost1611.roomApi.game(),oldWorld=game.sourceWorld,oldProjectiles=game.projectiles;
      let projectileRight,projectileLeft;

      try{
        game.sourceWorld={
          ...oldWorld,lighting:FrontierLocalLighting.validate({
            ...oldWorld.lighting,enabled:true,ambient:.1,lights:[],player:{
              enabled:false
            },sun:{
              enabled:false
            },projectiles:{
              enabled:true
            }
          })
        };
        const projectile=MF.createProjectile(game,game.player,{
          ...game.player.weapon,light:{
            enabled:true,radius:4,intensity:1,falloff:1,color:'#ffffff'
          }
        },{
          x:0,y:1,z:0
        });
        game.projectiles=[projectile];
        projectile.position={
          x:.6,y:-.8,z:1
        };
        const a=FrontierLocalLighting.frame(game,game.elapsed).lights.find(/* @function liveNormalsTest.realEmitter1618 — Inputs: live light record. Selects the production projectile emitter, never a synthetic replacement shader input. */function(l){
          return l.id.startsWith('projectile-');
        });
        projectileRight=sprite(a);
        projectile.position={
          x:-.6,y:-.8,z:1
        };
        const b=FrontierLocalLighting.frame(game,game.elapsed).lights.find(/* @function liveNormalsTest.movedEmitter1618 — Inputs: live light. Reads moved real projectile emission through the same owner as playtesting. */function(l){
          return l.id.startsWith('projectile-');
        });
        projectileLeft=sprite(b);
      }finally{
        game.sourceWorld=oldWorld;
        game.projectiles=oldProjectiles;
      }

      const spriteRight=sprite(right),mesh=ctx.liveNormalMeshes[0],spriteLeft=sprite(left),spriteReuse=mesh===ctx.liveNormalMeshes[0];

      const raw={
        width:4,height:4,data:new Uint8Array(64).fill(255)
      },nraw={
        width:4,height:4,data:new Uint8Array(64)
      };
      for(let i=0;i<64;i+=4)nraw.data.set([230,128,203,255],i);
      raw.normal=nraw;

      const backend=FrontierGeometryGPU.create(64,64,64,64),tri={
        image:raw,opaque:true,vertices:[{
          x:0,y:0,depth:2,u:0,v:0,world:[0,0,0]
        },{
          x:64,y:0,depth:2,u:1,v:0,world:[2,0,0]
        },{
          x:0,y:64,depth:2,u:0,v:1,world:[0,-2,0]
        }]
      };

      /* @function liveNormalsTest.geometry1618 — Inputs: lamp and orthographic flag. Returns actual world shader pixel; affine/perspective support share one normal-mapped material and depth owner. */
      function geometry(light,ortho){
        backend.draw([tri],false,{
          ...base,lights:[light]
        },null,ortho);
        const gl=backend.canvas.getContext('webgl2'),program=gl.getParameter(gl.CURRENT_PROGRAM),p=new Uint8Array(4);
        gl.readPixels(12,51,1,1,gl.RGBA,gl.UNSIGNED_BYTE,p);
        return Array.from(p);
      }

      const geometryRight=geometry({
        ...right,y:0,z:2
      },false),geometryLeft=geometry({
        ...left,y:0,z:2
      },false),orthoRight=geometry({
        ...right,y:0,z:2
      },true),orthoLeft=geometry({
        ...left,y:0,z:2
      },true);
      backend.destroy();

      const material={
        textureImage:albedo,scale:1,color:'#ffffff'
      },cell={
        p:[{
          x:0,y:0,depth:2
        },{
          x:64,y:0,depth:2
        },{
          x:0,y:64,depth:2
        }],coords:[[0,0],[1,0],[0,1]],world:[[0,0,0],[2,0,0],[0,-2,0]]
      };

      /* @function liveNormalsTest.terrain1618 — Inputs: moving lamp. Returns pixel from the retained batched world terrain shader, with true interpolated XYZ and shared automatic normal image. */
      function terrain(light){
        ctx.begin();
        ctx.breathing=null;
        ctx.underwater=null;
        ctx.fog=null;
        ctx.localLightFrame={
          ...base,lights:[light]
        };
        ctx.terrainBatch1523([cell],material);
        ctx.end();
        const gl=ctx.app.renderer.gl,p=new Uint8Array(4),r=ctx.app.renderer.resolution;
        gl.readPixels(12*r,gl.drawingBufferHeight-13*r,1,1,gl.RGBA,gl.UNSIGNED_BYTE,p);
        return Array.from(p);
      }

      const terrainRight=terrain({
        ...right,y:0,z:2
      }),terrainLeft=terrain({
        ...left,y:0,z:2
      });

      /* @function liveNormalsTest.water1618 — Inputs: physical light. Exercises original animated water UV/mesh ownership with a real normal texture, returning a covered fragment for direction comparison. */
      function water(light){
        ctx.begin();
        ctx.breathing=null;
        ctx.underwater=null;
        ctx.fog=null;
        ctx.localLightFrame={
          ...base,lights:[light]
        };
        ctx.waterQuad(cell.p,{
          textureImage:albedo,color:'#ffffff',scale:2,time:0,speed:0,warp:0,flowX:0,flowY:0
        },0,0,[[0,0],[2,0],[0,-2]]);
        ctx.end();
        const gl=ctx.app.renderer.gl,p=new Uint8Array(4),r=ctx.app.renderer.resolution;
        gl.readPixels(12*r,gl.drawingBufferHeight-13*r,1,1,gl.RGBA,gl.UNSIGNED_BYTE,p);
        return Array.from(p);
      }

      const waterRight=water({
        ...right,y:0,z:2
      }),waterLeft=water({
        ...left,y:0,z:2
      });

      const original=await FrontierAutomaticNormals.read('img/characters/Candy_Armed_8R_3C.png');
      FrontierAutomaticNormals.image(original,'candy-armed');
      await FrontierAutomaticNormals.settle();
      const unchanged=FrontierAutomaticNormals.image(original,'candy-armed')===original,actualNormal=original.frontierNormalImage?.naturalWidth;

      return {
        waterRight,waterLeft,projectileRight,projectileLeft,spriteRight,spriteLeft,spriteReuse,geometryRight,geometryLeft,orthoRight,orthoLeft,terrainRight,terrainLeft,unchanged,actualNormal,status:FrontierAutomaticNormals.debug()
      };

    });

    for(const [a,b]of [['spriteRight','spriteLeft'],['geometryRight','geometryLeft'],['orthoRight','orthoLeft'],['terrainRight','terrainLeft'],['waterRight','waterLeft'],['projectileRight','projectileLeft']]){
      assert(result[a][0]>result[b][0]+25,a+' must respond to light direction '+JSON.stringify(result));
      assert.equal(result[a][3],result[b][3],'Lighting preserves alpha');
    }

    assert(result.spriteReuse&&result.unchanged&&result.actualNormal>0);
    assert.deepEqual(errors,[]);
    fs.writeFileSync('test-artifacts/live-normals1618.json',JSON.stringify(result,null,2));
    console.log('PASS real sprite, terrain and perspective/orthographic world normal-map direction response, original albedo, alpha and mesh reuse');

  }finally{
    await browser.close();
  }

})().catch(/* @function liveNormalsTest.failed1618 — Inputs: error. Reports failed acceptance without claiming completion. */function(e){
  console.error(e);
  process.exitCode=1;
});


