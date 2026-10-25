/* October 12, 2026: interim standalone browser package construction.
 * Retains core image/audio/font banks conservatively until asset pruning is
 * verified. Does not copy tests, editor-only scripts, releases or user profiles.
 * This builder is not the final Windows/Mac release certification. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
/* @function runtimePackage.build — Inputs: source engine directory, generated entry descriptor and fresh destination directory. Returns manifest of copied relative files. Copies retained scripts, root styles and core runtime image/audio/font banks, preserving binary bytes and comments. Rejects existing destinations, missing files, symlinks and paths outside the source. Errors leave an explicitly incomplete new folder for inspection; never deletes or overwrites previous packages. */
function build(source,entry,destination){
 source=path.resolve(source);destination=path.resolve(destination);
 if(fs.existsSync(destination))throw Error('Runtime destination already exists. Choose a new folder.');
 if(destination===source||destination.startsWith(source+path.sep))throw Error('Runtime destination must be outside the engine source.');
 if(typeof entry?.html!=='string'||!Array.isArray(entry.scripts)||!Array.isArray(entry.omitted))throw Error('A generated runtime entry descriptor is required.');
 const files=new Set();
 /* @function runtimePackage.collect — Inputs: source-relative resource path. Returns nothing; recursively records regular files. Rejects path traversal, missing resources and symlinks before package creation. Directory traversal uses native paths; manifest uses portable forward slashes. Does not read source file contents or alter assets. */
 function collect(relative){
  if(typeof relative!=='string'||relative.includes('\\')||relative.includes(':')||relative.split('/').includes('..'))throw Error('Unsafe runtime resource path: '+relative);
  const absolute=path.resolve(source,relative);if(!absolute.startsWith(source+path.sep))throw Error('Resource escapes source: '+relative);
  const info=fs.lstatSync(absolute);if(info.isSymbolicLink())throw Error('Runtime resources must not be symlinks: '+relative);
  if(info.isDirectory()){for(const name of fs.readdirSync(absolute))collect(relative+'/'+name);}else if(info.isFile())files.add(relative);else throw Error('Unsupported resource: '+relative);
 }
 for(const script of entry.scripts){if(entry.omitted.includes(script))throw Error('Omitted authoring source was included: '+script);collect(script);}
 for(const match of entry.html.matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g))collect(match[1]);
 for(const bank of ['img','audio','fonts'])collect(bank);
 // October 13: origin-clean lazy sky bytes are runtime resources, not editor catalogs.
 if(entry.scripts.includes('src/sky-panorama.js'))collect('assets/skyboxes');
 // October 13, 2026: authored local textures/sounds outside the built-in banks
 // must accompany the game. Read the already escaped project JSON as data;
 // never evaluate its bootstrap script or resolve paths outside this engine.
 const marker='window.FRONTIER_EXPORTED_PROJECT=',begin=entry.html.indexOf(marker);
 if(begin>=0){const end=entry.html.indexOf(';</script>',begin);if(end<0)throw Error('Runtime project bootstrap is incomplete.');const project=JSON.parse(entry.html.slice(begin+marker.length,end));const pending=[project];let visited=0;
  while(pending.length){const value=pending.pop();if(++visited>1000000)throw Error('Runtime resource inventory is too large.');if(!value||typeof value!=='object')continue;
   for(const [key,item]of Object.entries(value)){if(key==='models')continue; // GLB bundle bytes already live in portable project JSON.
    if(item&&typeof item==='object'){pending.push(item);continue;}
    if(!/(texture|image|icon|portrait|sprite|sound|audio|font|file|url|path|normalMap)$/i.test(key)||typeof item!=='string'||item.length>4096||item.startsWith('data:'))continue;
    const resource=item.split(/[?#]/)[0];if(!/\.(png|jpe?g|webp|gif|wav|mp3|ogg|woff2?|ttf)$/i.test(resource))continue;
    if(/^[a-z][a-z0-9+.-]*:/i.test(resource)||resource.startsWith('//'))throw Error('Offline game resource must be local or embedded: '+resource);
    collect(resource);
   }
  }
 }
 fs.mkdirSync(destination,{recursive:true});
 for(const relative of files){const target=path.join(destination,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(source,relative),target,fs.constants.COPYFILE_EXCL);}
 fs.writeFileSync(path.join(destination,'index.html'),entry.html,{flag:'wx'});
 const manifest={schema:'sprite-frontier-runtime-package/1',at:new Date().toISOString(),scope:'Interim browser runtime; core banks retained conservatively, authored local image/audio/font paths collected; core banks retained conservatively',files:['index.html',...files].sort(),omitted:entry.omitted};
 fs.writeFileSync(path.join(destination,'RUNTIME-MANIFEST.json'),JSON.stringify(manifest,null,2),{flag:'wx'});return manifest;
}
module.exports={build};
if(require.main===module){const [source,descriptor,destination]=process.argv.slice(2);if(!source||!descriptor||!destination)throw Error('Usage: runtime-package.cjs source generated-entry.json new-destination');const result=build(source,JSON.parse(fs.readFileSync(descriptor,'utf8')),destination);console.log('Built interim runtime package:',result.files.length,'files');}
