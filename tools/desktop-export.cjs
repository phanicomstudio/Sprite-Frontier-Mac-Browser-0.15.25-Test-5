/* October 13: the slot material dialog is authoring-only. This exact native
 * inventory now matches the eighteenth omission in runtime-export.js; the
 * strict comparison remains enforced before showing a destination chooser. */
/* October 13, 2026: native export descriptor boundary. The renderer provides
 * authored data/HTML; only the native chooser supplies a destination folder.
 * Asset closure remains owned by runtime-package.cjs, not this validator. */
'use strict';
const excluded=['editor','editor-workbench','event-context','room-editor','building-editor','building-assemblies','prop-editor','lighting-editor','sky-editor','layout-editor','normal-workbench','editor-tools','effects-editor','model-workbench','model-editor','model-gizmo','model-material-editor','mz-editor'];
/* @function desktopExport.sources — Inputs: engine HTML. Returns ordered external script paths matching production entry generation. Pure parsing, no filesystem or execution; unexpected markup is rejected by validate. */
function sources(html){return [...html.matchAll(/<script\s+src="([^"]+)"\s*><\/script>/g)].map(/* @function desktopExport.sourcePath — Inputs: script match. Returns captured relative path only. */function(match){return match[1];});}
/* @function desktopExport.validate — Inputs: installed editor HTML and renderer-generated entry descriptor. Returns the descriptor after verifying exact retained/omitted script ownership and runtime bootstrap. Rejects oversized/malformed entries or altered script inventories before opening any chooser. Does not execute authored text or accept destination paths. HTML limit is 134,217,728 JavaScript characters, allowing embedded model bundles. */
function validate(original,entry){
 if(!entry||typeof entry.html!=='string'||entry.html.length>128*1024*1024||!Array.isArray(entry.scripts)||!Array.isArray(entry.omitted))throw Error('Invalid game export descriptor.');
 const omitted=excluded.map(/* @function desktopExport.omittedPath — Inputs: known editor module name. Returns its installed relative path; list is maintained with runtime-export.js. */function(name){return 'src/'+name+'.js';});
 const expected=sources(original).filter(/* @function desktopExport.retainedPath — Inputs: installed script path. Returns whether gameplay export retains it. No caller-selected paths are admitted. */function(script){return !omitted.includes(script);});
 if(JSON.stringify(entry.omitted)!==JSON.stringify(omitted)||JSON.stringify(entry.scripts)!==JSON.stringify([...new Set(expected)])||JSON.stringify(sources(entry.html))!==JSON.stringify(expected))throw Error('Game export script inventory does not match this engine.');
 if(!entry.html.includes('window.FRONTIER_RUNTIME_ONLY=true;window.FRONTIER_EXPORTED_PROJECT='))throw Error('Game export is missing its runtime project.');
 const css=/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g;
 if(JSON.stringify([...original.matchAll(css)].map(/* @function desktopExport.originalStyle — Inputs: installed stylesheet match. Returns fixed relative path for ownership comparison. */function(match){return match[1];}))!==JSON.stringify([...entry.html.matchAll(css)].map(/* @function desktopExport.exportStyle — Inputs: generated stylesheet match. Returns relative path; unexpected resources cause rejection. */function(match){return match[1];})))throw Error('Game export stylesheet inventory changed.');
 return entry;
}
module.exports={validate};
