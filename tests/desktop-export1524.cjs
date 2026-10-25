/* October 13: fixed resource ownership before a native export dialog. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),boundary=require('../tools/desktop-export.cjs');
const original=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),scope={window:{FrontierMaps:{/* @function desktopExportTest.project — Inputs: project data. Returns unchanged fixture data to isolate descriptor ownership. Production browser startup tests exercise the real project validator separately. */validate(project){return project;}}}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src/runtime-export.js'),'utf8'),scope);
const entry=scope.window.FrontierRuntimeExport.entry(original,{maps:[]});
assert.equal(boundary.validate(original,entry),entry);
const altered=structuredClone(entry);altered.scripts.push('src/editor.js');assert.throws(/* @function desktopExportTest.extraScript — Inputs: none. Returns validation attempt; verifies an editor script cannot be admitted via a forged inventory. No files created. */function(){return boundary.validate(original,altered);},/inventory/);
const external=structuredClone(entry);external.html=external.html.replace('src/runtime-export.js','https://example.invalid/source.js');assert.throws(/* @function desktopExportTest.externalScript — Inputs: none. Returns validation attempt for an unexpected external path. Native chooser must not open on failure. */function(){return boundary.validate(original,external);},/inventory/);
const css=structuredClone(entry);css.html=css.html.replace('</head>','<link href="private.css"></head>');assert.throws(/* @function desktopExportTest.extraStyles — Inputs: none. Returns validation attempt for an extra source resource; no arbitrary source file can be requested. */function(){return boundary.validate(original,css);},/stylesheet/);
const noBootstrap=structuredClone(entry);noBootstrap.html=noBootstrap.html.replace('window.FRONTIER_RUNTIME_ONLY=true;','');assert.throws(/* @function desktopExportTest.missingRuntime — Inputs: none. Returns descriptor check with missing gameplay-only guard. No filesystem mutations. */function(){return boundary.validate(original,noBootstrap);},/runtime project/);
console.log('PASS native export exact source inventory, omitted editors, fixed styles and runtime bootstrap');
