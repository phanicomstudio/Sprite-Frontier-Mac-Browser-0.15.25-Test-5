/* Definition history retains only entries, never complete project snapshots.
 * Failed adoption does not consume an undo/redo record. Histories are local to
 * this authoring session and are cleared when a project is restored. */
(/* @function template-history.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier template history. */ function(root){'use strict';
 /* @function template-history.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: assignment pattern. Uses: number is safe integer; error. Returns: a record containing push, undo, redo, clear, debug. */ function create({maxBytes=8*1024*1024,maxEntries=32}={}){
  if(!Number.isSafeInteger(maxBytes)||maxBytes<1||!Number.isSafeInteger(maxEntries)||maxEntries<1)throw Error('Invalid template history budget.');
  let undo=[],redo=[],bytes=0;
  const size=/* @function template-history.size.3 — Returns a new text encoder encode using json stringify using entry length. Inputs: entry. Uses: a new text encoder encode; json stringify. Returns: a new text encoder encode using json stringify using entry length. */ entry=>new TextEncoder().encode(JSON.stringify(entry)).length;
  /* @function template-history.trim.4 — Handles trim within template history. Inputs: no explicit arguments; uses enclosing module state. Updates: bytes. Uses: undo shift; redo shift. */ function trim(){while(undo.length+redo.length>maxEntries||bytes>maxBytes){const item=undo.length?undo.shift():redo.shift();bytes-=item.bytes;}}
  return {/* @function template-history.push.5 — Handles push within template history. Inputs: entry. Updates: bytes; redo. Uses: structured clone; size; undo push; trim. */ push(entry){for(const item of redo)bytes-=item.bytes;redo=[];const item={entry:structuredClone(entry),bytes:size(entry)};undo.push(item);bytes+=item.bytes;trim();},
   /* @function template-history.undo.6 — Handles undo within template history. Inputs: adopt. Uses: undo at; adopt; structured clone; undo pop. Returns: false; true. */ undo(adopt){const item=undo.at(-1);if(!item)return false;adopt(structuredClone(item.entry));undo.pop();redo.push(item);return true;},
   /* @function template-history.redo.7 — Handles redo within template history. Inputs: adopt. Uses: redo at; adopt; structured clone; redo pop. Returns: false; true. */ redo(adopt){const item=redo.at(-1);if(!item)return false;adopt(structuredClone(item.entry));redo.pop();undo.push(item);return true;},
   /* @function template-history.clear.8 — Handles clear within template history. Inputs: no explicit arguments; uses enclosing module state. Updates: undo; redo; bytes. */ clear(){undo=[];redo=[];bytes=0;},debug:/* @function template-history.debug.9 — Returns a record containing undo, redo, bytes, maxBytes, maxEntries. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing undo, redo, bytes, maxBytes, maxEntries. */ ()=>({undo:undo.length,redo:redo.length,bytes,maxBytes,maxEntries})};
 }
 root.FrontierTemplateHistory={create};
})(typeof window==='undefined'?globalThis:window);

