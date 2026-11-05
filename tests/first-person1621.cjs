const assert=require('node:assert/strict');
require('../src/first-person.js');
require('../src/local-lighting.js');

const retained=new Map([['handgun',{
  id:'handgun',type:'projectile',cooldown:15
}]]);
globalThis.PhanicomABS={
  weapons:retained
};
require('../src/weapon-definitions.js');

const binding={
  'candy-armed':{
    src:'img/weapons/first-person/candy/pistol/armed-test.png',columns:1,rows:1,fps:8,scale:1,muzzleX:.547,muzzleY:.483,spawnForward:.45,spawnRight:.08,spawnUp:-.15
  }
};

FrontierWeaponDefinitions.apply({
  handgun:{
    firstPerson:binding
  }
});

const weapon=PhanicomABS.weapons.get('handgun');
assert.deepEqual(weapon.firstPerson,binding);
binding['candy-armed'].scale=2;
assert.equal(weapon.firstPerson['candy-armed'].scale,1);

assert(FrontierFirstPerson.assignment({
  weapon,holstered:false,spriteProfile:'candy-armed'
}));
assert.equal(FrontierFirstPerson.assignment({
  weapon,holstered:true
}),null);
assert.equal(FrontierFirstPerson.assignment({
  weapon,holstered:false,spriteProfile:'other-character'
}),null);

for(const value of [{
  'candy-armed':{
    src:'https://example.com/image.png'
  }
},{
  'candy-armed':{
    src:'img/../escape.png'
  }
},{
  'candy-armed':{
    src:'img/a.png',columns:0
  }
},{
  constructor:{
    src:'img/a.png'
  }
}])assert.throws(/* @function firstPerson1621.reject — Inputs: none. Exercises actual validation against malformed/external presentation assets; no data adoption on failure. */function(){
  FrontierFirstPerson.validate(value);
});

assert.deepEqual(FrontierFirstPerson.validate(JSON.parse(JSON.stringify(weapon.firstPerson))),weapon.firstPerson);

console.log('PASS character/weapon first-person assignment round trip, detached validation, safe image sources and holster fallback');


