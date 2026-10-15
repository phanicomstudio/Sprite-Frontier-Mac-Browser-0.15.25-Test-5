/* October 12, 2026: decode the authored GLBs with the production engine and
 * query actual triangle collision. Blank center/door openings cannot be inferred
 * merely from bounds or Blender's manifold check. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
for(const file of ['model-transform','model-container','model-scene','model-library','model-mesh-collision'])require('../src/'+file+'.js');
const root=path.join(__dirname,'../assets/models/castle'),manifest=JSON.parse(fs.readFileSync(path.join(root,'MANIFEST.json'),'utf8'));
for(const entry of manifest){
  const bytes=new Uint8Array(fs.readFileSync(path.join(root,entry.file))),id=entry.name.toLowerCase();
  FrontierModelLibrary.importBundle({id,name:entry.name,entry:entry.file,files:{[entry.file]:bytes}});
  const asset=FrontierModelLibrary.get(id),matrix=FrontierModelTransform.identity();
  assert(asset.scene.instances.length>0);
  assert(asset.images.length>0,'Supplied texture is embedded without external dependencies');
  if(entry.name.startsWith('Square_Room')){
    assert.equal(FrontierModelMeshCollision.support(asset,matrix,0,0,-.1,.1),0,'Room floor supports center at authored elevation');
    const hit=FrontierModelMeshCollision.query(asset,matrix,[0,-6,.85],[0,0,.85],[.13,.13,.8]);
    assert.equal(hit,null,'Door opening permits player body passage');
    assert.notEqual(FrontierModelMeshCollision.query(asset,matrix,[1.5,-6,.85],[1.5,0,.85],[.13,.13,.8]),null,'Adjacent jamb blocks passage');
  }
  if(entry.name.startsWith('Tower_Section')){
    assert.equal(FrontierModelMeshCollision.support(asset,matrix,0,0,-.1,4),null,'Hollow open-ended tower center has no invisible cap');
    assert.equal(FrontierModelMeshCollision.query(asset,matrix,[0,-6,.85],[0,0,.85],[.13,.13,.8]),null,'Tower entrance is open');
    assert.notEqual(FrontierModelMeshCollision.query(asset,matrix,[6,0,.85],[0,0,.85],[.13,.13,.8]),null,'Tower side is physically solid');
  }
  if(entry.name==='Castle_Wall_4m')assert.equal(FrontierModelMeshCollision.support(asset,matrix,0,0,2.9,3.1),3,'Castle walkway supports walking');
  assert(entry.triangles<400,'Starter geometry stays modest');
}
console.log('PASS nine castle GLBs decode, embedded materials, open doors/hollow towers and walkable wall geometry');
