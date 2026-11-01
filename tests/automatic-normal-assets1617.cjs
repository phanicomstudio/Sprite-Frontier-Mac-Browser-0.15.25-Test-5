/* November 1, 2026: content and resource closure for baked automatic normals. */
'use strict';

const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),vm=require('node:vm');

const root=path.resolve(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/automatic-normals/manifest.json'),'utf8')),scope={
  window:{
  }
};

vm.runInNewContext(fs.readFileSync(path.join(root,'src/automatic-normal-manifest.js'),'utf8'),scope);
assert.deepEqual(JSON.parse(JSON.stringify(scope.window.FrontierAutomaticNormalManifest)),manifest);

const sources=[];

/* @function normalAssets.scan1617 — Inputs: one fixed world/sprite bank directory. Collects regular supported image paths without following symlinks. Returns nothing; original artwork is read only. */
function scan(directory){
  if(!fs.existsSync(directory))return;
  for(const entry of fs.readdirSync(directory,{
    withFileTypes:true
  })){
    const file=path.join(directory,entry.name);
    if(entry.isDirectory())scan(file);
    else if(entry.isFile()&&/\.(png|webp|jpe?g)$/i.test(entry.name))sources.push(path.relative(root,file).replaceAll('\\','/'));
  }
}

for(const folder of ['characters','ground','interiors','items','materials','water','weapons'])scan(path.join(root,'img',folder));

assert.equal(manifest.schema,'automatic-normals/1');
assert.equal(manifest.recipe,'relief2');
assert.deepEqual(Object.keys(manifest.entries).sort(),sources.sort());
let preparedBytes=0;

for(const [source,record]of Object.entries(manifest.entries)){
  assert.equal(record.source,source);
  assert.equal(record.sha256,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,source))).digest('hex'),'Source replacement needs a new offline bake: '+source);
  assert(!/^img\/(ui|hud|sky|skyboxes|portraits|cursors)\//.test(source));
  for(const file of [record.normal,record.lit]){
    assert(file.startsWith('assets/automatic-normals/'));
    assert(!file.includes('..'));
    assert(fs.statSync(path.join(root,file)).isFile());
  }
  const normal=fs.readFileSync(path.join(root,record.normal)),lit=fs.readFileSync(path.join(root,record.lit));
  assert.equal(normal.subarray(1,4).toString(),'PNG');
  assert.equal(normal.readUInt32BE(16),record.normalWidth);
  assert.equal(normal.readUInt32BE(20),record.normalHeight);
  assert(record.normalWidth<=512&&record.normalHeight<=512);
  assert.equal(lit.subarray(0,4).toString(),'RIFF');
  assert.equal(lit.subarray(8,12).toString(),'WEBP');
  assert.equal(record.compression,'webp-lossless-rgba-verified');
  assert(record.width>0&&record.height>0);
  assert(record.width%record.columns===0&&record.height%record.rows===0);
  preparedBytes+=normal.length+lit.length;
}

console.log('PASS all '+sources.length+' source hashes, baked-normal detail/frame bounds, lossless relief resources, exclusions and manifest equality ('+preparedBytes+' bytes)');


