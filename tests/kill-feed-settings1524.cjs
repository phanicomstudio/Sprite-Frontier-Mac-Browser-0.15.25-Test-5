"use strict";
/* October 13, 2026: checks portable HUD overrides and the retained native host
 * parameter reference, including restoring exact shipped behavior. */
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm");
const params = {
  KillFeedEnabled: "true",
  KillFeedMessages: '["{killer} fragged {victim}"]',
  KillFeedWeaponRules: "[]",
};
const root = { PhanicomPluginSettings: { combat: params } };
vm.runInNewContext(
  fs.readFileSync(path.join(__dirname, "../src/kill-feed-settings.js"), "utf8"),
  { window: root },
);
const settings = root.FrontierKillFeedSettings;
const override = {
  enabled: false,
  messages: ["{killer} defeats {victim}"],
  weaponRules: [{ weaponId: "shotgun", messages: ["{weapon}: {victim}"] }],
};
const checked = settings.validate(override);
checked.messages.push("Second");
assert.equal(override.messages.length, 1);
settings.apply(JSON.parse(JSON.stringify(override)));
assert.equal(root.PhanicomPluginSettings.combat, params);
assert.equal(params.KillFeedEnabled, "false");
assert.equal(JSON.parse(params.KillFeedMessages)[0], override.messages[0]);
assert.equal(
  JSON.parse(JSON.parse(params.KillFeedWeaponRules)[0].Messages)[0],
  override.weaponRules[0].messages[0],
);
const snapshot = JSON.stringify(params);
for (const invalid of [
  { ...override, messages: [] },
  { ...override, enabled: "false" },
  { ...override, messages: [" "] },
  {
    ...override,
    weaponRules: [...override.weaponRules, ...override.weaponRules],
  },
])
  assert.throws(
    /* @function killFeedSettingsTest.reject — Inputs: none; captures malformed draft. Returns: apply result only on erroneous acceptance, otherwise propagates validation failure. Asserts runtime parameters remain unchanged after rejected adoption. */ () =>
      settings.apply(invalid),
  );
assert.equal(JSON.stringify(params), snapshot);
settings.apply(undefined);
assert.equal(params.KillFeedEnabled, "true");
assert.equal(params.KillFeedMessages, '["{killer} fragged {victim}"]');
assert.equal(params.KillFeedWeaponRules, "[]");
console.log(
  "PASS portable kill-feed overrides, retained host reference, atomic validation and exact inherited reset",
);
