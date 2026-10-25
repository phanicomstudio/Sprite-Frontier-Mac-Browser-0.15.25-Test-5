"use strict";
require('../src/local-lighting.js');
const assert = require("node:assert/strict");
const retained = new Map([
  [
    "handgun",
    {
      id: "handgun",
      name: "Handgun",
      speed: 20,
      range: 10,
      radius: 0.1,
      damage: 5,
      cooldown: 12,
      projectile: { speed: 20, range: 10, radius: 0.1, lifetime: 0.5 },
    },
  ],
]);
globalThis.PhanicomABS = { weapons: retained };
require("../src/weapon-definitions.js");
const service = FrontierWeaponDefinitions,
  override = {
    handgun: {
      damage: 12,
      cooldownSeconds: 0.5,
      range: 30,
      speed: 10,
      radius: 0.2,
      arcDegrees: 90,
    },
  };
service.apply(JSON.parse(JSON.stringify(override)));
assert.equal(PhanicomABS.weapons, retained);
const weapon = retained.get("handgun");
assert.equal(weapon.cooldown, 30);
assert.equal(weapon.arcRadians, Math.PI / 2);
assert.equal(weapon.projectile.lifetime, 3);
assert.equal(weapon.projectileLifetime, 3);
assert.equal(weapon.maxRange, 30);
assert.equal(weapon.projectileRadius, 0.2);
const before = JSON.stringify([...retained]);
for (const invalid of [
  { handgun: { damage: Infinity } },
  { handgun: { pellets: 65 } },
  { handgun: { cooldownSeconds: 0 } },
  { handgun: { madeUp: 2 } },
  { unknown: { damage: 1 } },
])
  assert.throws(
    /* @function weaponDefinitionsTest.reject — Inputs: none; captures invalid override. Returns: adoption only on erroneous acceptance, otherwise propagates expected rejection. Current native profile Map must retain its previous values on failure. */ () =>
      service.apply(invalid),
  );
assert.equal(JSON.stringify([...retained]), before);
service.apply(undefined);
assert.equal(retained.get("handgun").damage, 5);
assert.equal(retained.get("handgun").cooldown, 12);
service.apply({handgun:{light:{enabled:true,color:'#ff3300',radius:3,intensity:2,falloff:1,flicker:0.1}}});
assert.equal(retained.get('handgun').light.radius,3);assert.equal(retained.get('handgun').light.color,'#ff3300');
service.apply({handgun:{light:{enabled:false}}});assert.equal(retained.get('handgun').light.enabled,false);
assert.throws(/* @function weaponDefinitionsTest.lightBounds — Inputs: none. Returns: apply result only on erroneous acceptance; validates finite bounded projectile radius before host mutation. */ ()=>service.apply({handgun:{light:{enabled:true,radius:101}}}));
service.apply(undefined);assert.equal(retained.get('handgun').light,undefined);
console.log(
  "PASS native weapon units, coherent ballistic aliases, retained Map identity, atomic rejection and baseline reset",
);
