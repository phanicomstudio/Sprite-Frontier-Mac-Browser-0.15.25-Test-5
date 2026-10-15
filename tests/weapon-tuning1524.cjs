/* October 13, 2026: protects authored spread units and historical defaults while
 * improving source contracts. This checks public behavior, not comment wording. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/weapon-tuning.js'), 'utf8'), {window: root});
const tuning = root.FrontierWeaponTuning;
const handgun = {id: 'handgun', spreadRadians: 1};
assert.equal(tuning.degrees(undefined, handgun), 0.5);
assert.equal(tuning.degrees({weaponSpreads: {handgun: 0}}, handgun), 0);
assert.ok(Math.abs(tuning.degrees(undefined, {id: 'rifle', spreadRadians: Math.PI / 6}) - 30) < 1e-12);
assert.equal(tuning.degrees(undefined, {id: 'rifle'}), 0);
assert.equal(tuning.radians({weaponSpreads: {handgun: 30}}, handgun), Math.PI / 6);
const draft = {handgun: 2};
const accepted = tuning.validate(draft);
accepted.handgun = 3;
assert.equal(draft.handgun, 2);
const special = tuning.validate(JSON.parse('{"__proto__":4}'));
assert.equal(Object.hasOwn(special, '__proto__'), true);
assert.equal(special.__proto__, 4);
for (const invalid of [null, [], {handgun: Infinity}, {handgun: -1}, {handgun: 31}, {'bad id': 1}]) {
  assert.throws(/* @function weaponTuningTest.rejectDraft — Inputs: none; captures an invalid authoring draft. Returns: validator result if incorrectly accepted, otherwise propagates the expected validation error to assert. No draft or global mutation. */ () => tuning.validate(invalid));
}
const tooMany = {};
for (let index = 0; index < 65; index++) tooMany['weapon_' + index] = 1;
assert.throws(/* @function weaponTuningTest.rejectCapacity — Inputs: none. Returns: validation result only on erroneous acceptance; expected throw protects the 64-override bound independently of map-library capacity. No mutation. */ () => tuning.validate(tooMany));
console.log('PASS weapon spread units, zero override, historical defaults, isolated drafts and validation bounds');
