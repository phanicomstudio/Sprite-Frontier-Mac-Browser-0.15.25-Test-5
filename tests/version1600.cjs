// October 15, 2026: one engine version. src/version.js, package.json and the
// newest CHANGELOG heading must agree, and the badge must read the shared value.
const fs = require("fs"),
  vm = require("vm"),
  path = require("path"),
  assert = require("node:assert/strict");
const base = path.join(__dirname, "..");
const context = {};
vm.runInNewContext(fs.readFileSync(path.join(base, "src/version.js"), "utf8"), Object.assign(context, { globalThis: context }));
const version = context.FrontierVersion;
assert.match(version, /^\d+\.\d+\.\d+$/, "version is major.minor.patch");
assert.equal(JSON.parse(fs.readFileSync(path.join(base, "package.json"), "utf8")).version, version, "package.json matches src/version.js");
const changelog = fs.readFileSync(path.join(base, "CHANGELOG.md"), "utf8");
assert.match(changelog.split("\n## ")[1] || "", new RegExp("^" + version.replaceAll(".", "\\.") + "\\b"), "newest CHANGELOG entry is this version");
const app = fs.readFileSync(path.join(base, "src/app.js"), "latin1");
assert.ok(app.includes("FrontierVersion") && !/prototype 0\.\d+\.\d+"/.test(app), "badge uses FrontierVersion, not a hard-coded number");
const html = fs.readFileSync(path.join(base, "index.html"), "utf8");
assert.ok(html.indexOf('src="src/version.js"') < html.indexOf('src="src/app.js"'), "version.js loads before app.js");
console.log("PASS version " + version + ": src/version.js, package.json, CHANGELOG and badge agree.");
