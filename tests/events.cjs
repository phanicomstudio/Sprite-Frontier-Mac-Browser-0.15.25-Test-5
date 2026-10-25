// Regression/history harness: assertions document expected behavior. Older browser harnesses use historical controls; browser06.cjs is current acceptance.
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict'), path = require('node:path');
const root = path.join(__dirname, '..'), context = vm.createContext({ structuredClone }); context.globalThis = context;
vm.runInContext(fs.readFileSync(path.join(root, 'src/events.js'), 'utf8'), context);
const E = context.FrontierEvents;
const box = E.create('box', 24, 25); box.pages[0].graphic = 'chest';
box.pages[0].commands = [{ type: 'giveItem', item: 'ammo9', amount: 24 }, { type: 'selfSwitch', key: 'A', value: true }, { type: 'message', text: 'Collected.' }];
box.pages.push({ ...E.page('Empty'), graphic: 'openChest', condition: { type: 'selfSwitch', key: 'A' }, commands: [{ type: 'message', text: 'Empty.' }] });
const original = JSON.stringify(box), player = { x: 24, y: 24 }; let given = 0, message;
const services = { message: /* @function events.message.1 — Returns assignment. Inputs: value. Updates: message. Returns: assignment. */ value => message = value, /* @function events.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state. */ log() {}, item: /* @function events.item.3 — Returns assignment. Inputs: id; amount. Updates: given. Returns: assignment. */ (id, amount) => given += amount, canStand: /* @function events.canStand.4 — Returns true. Inputs: no explicit arguments; uses enclosing module state. Returns: true. */ () => true };
const s = E.createSession(E.validate([box]), services);
assert.equal(s.activePage(s.events[0]), 0); assert(s.start(s.events[0], 'interact')); s.update(.01, player);
assert.equal(given, 24); assert.equal(message.text, 'Collected.'); assert.equal(s.activePage(s.events[0]), 1);
assert(!s.start(s.events[0], 'interact')); s.next(); s.update(.01, player); assert(!s.busy);
assert(s.start(s.events[0], 'interact')); s.update(.01, player); assert.equal(message.text, 'Empty.'); assert.equal(given, 24);
assert.equal(JSON.stringify(box), original, 'playtest cannot mutate authored pages');
const fresh = E.createSession([box], services); assert.equal(fresh.activePage(fresh.events[0]), 0);
const touch = E.create('touch', 24, 24); touch.pages[0].trigger = 'playerTouch'; touch.pages[0].commands = [{ type: 'giveItem', item: 'key', amount: 1 }];
let touches = 0; const t = E.createSession([touch], { ...services, item: /* @function events.item.5 — Returns update. Inputs: no explicit arguments; uses enclosing module state. Returns: update. */ () => touches++ });
t.update(.01, player); t.update(.01, player); t.update(.01, player); assert.equal(touches, 1);
player.x = 26; t.update(.01, player); player.x = 24; t.update(.01, player); t.update(.01, player); assert.equal(touches, 2);
const transfer = E.create('gate', 24, 25); transfer.pages[0].commands = [{ type: 'wait', seconds: .2 }, { type: 'transfer', x: 30, y: 31 }];
const gate = E.createSession([transfer], services); gate.start(gate.events[0], 'interact'); gate.update(.01, player); assert.equal(player.x, 24); gate.update(.1, player); assert.equal(player.x, 24); gate.update(.11, player); assert.equal(player.x, 30); assert.equal(player.y, 31);
const closed = E.createSession([transfer], { ...services, canStand: /* @function events.canStand.6 — Returns false. Inputs: no explicit arguments; uses enclosing module state. Returns: false. */ () => false }); player.x = 24; closed.start(closed.events[0], 'interact'); closed.update(.01, player); closed.update(.3, player); assert.equal(player.x, 24);
for (const change of [/* @function events.callback.7 — Returns assignment. Inputs: e. Updates: e id. Returns: assignment. */ e => e.id = 'invalid id', /* @function events.callback.8 — Returns assignment. Inputs: e. Updates: e pages at 0 commands. Returns: assignment. */ e => e.pages[0].commands = [{ type: 'executeJS', text: 'bad' }], /* @function events.callback.9 — Returns assignment. Inputs: e. Updates: e pages at 0 condition. Returns: assignment. */ e => e.pages[0].condition = { type: 'selfSwitch', key: 'Z' }, /* @function events.callback.10 — Returns assignment. Inputs: e. Updates: e pages at 0 commands. Returns: assignment. */ e => e.pages[0].commands = [{ type: 'transfer', x: 100, y: 10 }]]) { const e = structuredClone(box); change(e); assert.throws(/* @function events.callback.11 — Returns e validate using a list of e. Inputs: no explicit arguments; uses enclosing module state. Uses: e validate. Returns: e validate using a list of e. */ () => E.validate([e])); }
assert.throws(/* @function events.callback.12 — Returns e validate using a list of box, a new set. Inputs: no explicit arguments; uses enclosing module state. Uses: e validate. Returns: e validate using a list of box, a new set. */ () => E.validate([box], new Set(['box'])));
assert.equal(JSON.stringify(E.validate(JSON.parse(JSON.stringify([box])))), JSON.stringify(E.validate([box])));
console.log('PASS: event page precedence, one-time ammo, isolated playtests, touch entry, waits/transfers, validation and JSON round-trip.');
