/* October 22, 2026: AST extraction avoids tests depending on one-line source
 * formatting. This helper reads original function bodies, never substitutes
 * behavior or edits production source. Uses Node's existing bundled parser. */
const fs=require('node:fs'),vm=require('node:vm'),parser={};vm.runInNewContext(process.binding('natives')['internal/deps/acorn/acorn/dist/acorn'],{exports:parser,module:{exports:parser}});
/* @function sourceFunction.extract — Inputs: source path and declaration name. Returns exact original function source including its body. Throws missing declaration, parse or read errors. Traversal is read-only; caller owns VM evaluation and fixtures. */
function extract(path,name){const source=fs.readFileSync(path,'utf8'),tree=parser.parse(source,{ecmaVersion:'latest'});let result=null;
 /* @function sourceFunction.visit — Inputs: AST node. Returns nothing; retains the exact matching declaration span and recursively visits structural child fields. Does not execute source or trust comments as instructions. */
 function visit(node){if(!node||typeof node!=='object')return;if(node.type==='FunctionDeclaration'&&node.id?.name===name)result=source.slice(node.start,node.end);for(const [key,value]of Object.entries(node)){if(['start','end'].includes(key))continue;if(Array.isArray(value)){for(const child of value)visit(child);}else if(value&&typeof value==='object')visit(value);}}
 visit(tree);if(!result)throw Error('Missing function '+name+' in '+path);return result;
}
module.exports=extract;
