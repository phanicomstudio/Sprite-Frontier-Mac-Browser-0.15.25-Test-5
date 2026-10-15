/* October 12, 2026: package-copy ownership and failure contracts. Real exported
 * engine gameplay is covered separately; this fixture does not certify closure. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict'),{build}=require('../tools/runtime-package.cjs');
const temporaryRoot=path.resolve(os.tmpdir()),fixture=fs.mkdtempSync(path.join(temporaryRoot,'frontier-package1524-')),source=path.join(fixture,'engine'),destination=path.join(fixture,'game');
try{
 for(const folder of ['src','img','audio','fonts'])fs.mkdirSync(path.join(source,folder),{recursive:true});
 fs.writeFileSync(path.join(source,'src/app.js'),'/* retained human explanation */\nwindow.fixture=true;');fs.writeFileSync(path.join(source,'src/editor.js'),'editor only');fs.writeFileSync(path.join(source,'style.css'),'body{background:black}');
 const pixels=Buffer.from([0,255,13,10,128]);fs.writeFileSync(path.join(source,'img/fixture.png'),pixels);
 const entry={html:'<link href="style.css" rel="stylesheet"><script src="src/app.js"></script>',scripts:['src/app.js'],omitted:['src/editor.js']};
 const manifest=build(source,entry,destination);assert(manifest.files.includes('style.css'));assert(!fs.existsSync(path.join(destination,'src/editor.js')));assert.deepEqual(fs.readFileSync(path.join(destination,'img/fixture.png')),pixels);assert(fs.readFileSync(path.join(destination,'src/app.js'),'utf8').includes('retained human explanation'));
 assert.throws(/* @function runtimePackageTest.existing — Inputs: none. Returns attempted repeated build; verifies existing package protection. */function(){build(source,entry,destination);},/already exists/);
 assert.throws(/* @function runtimePackageTest.escape — Inputs: none. Returns attempted unsafe resource build; verifies traversal rejection before creating a destination. */function(){build(source,{...entry,scripts:['../outside.js']},path.join(fixture,'unsafe'));},/Unsafe/);assert(!fs.existsSync(path.join(fixture,'unsafe')));
 assert.throws(/* @function runtimePackageTest.missing — Inputs: none. Returns missing-resource attempt; verifies failure before destination creation. */function(){build(source,{...entry,scripts:['src/missing.js']},path.join(fixture,'missing'));},/ENOENT/);assert(!fs.existsSync(path.join(fixture,'missing')));
 fs.mkdirSync(path.join(source,'custom'));fs.writeFileSync(path.join(source,'custom/wall.png'),pixels);
 const projectEntry={...entry,html:entry.html+'<script>window.FRONTIER_EXPORTED_PROJECT='+JSON.stringify({maps:[{world:{texture:'custom/wall.png'}}]})+';</script>'};
 const local=build(source,projectEntry,path.join(fixture,'local-assets'));assert(local.files.includes('custom/wall.png'));assert.deepEqual(fs.readFileSync(path.join(fixture,'local-assets/custom/wall.png')),pixels);
 assert.throws(/* @function runtimePackageTest.authoredMissing — Inputs: none. Returns attempted build with missing authored texture. Verifies offline closure rejects before creating a destination. */function(){build(source,{...entry,html:entry.html+'<script>window.FRONTIER_EXPORTED_PROJECT='+JSON.stringify({texture:'custom/missing.png'})+';</script>'},path.join(fixture,'missing-authored'));},/ENOENT/);assert(!fs.existsSync(path.join(fixture,'missing-authored')));
 console.log('PASS runtime package copies source comments/binary assets, omits editor sources and rejects overwrite/traversal/missing resources');
}finally{
 // Delete only the uniquely owned fixture immediately under the verified temp
 // root. Never recursively remove a package/source path supplied by a caller.
 assert.equal(path.dirname(path.resolve(fixture)),temporaryRoot);assert(path.basename(fixture).startsWith('frontier-package1524-'));fs.rmSync(fixture,{recursive:true});
}
