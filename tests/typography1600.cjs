// October 15, 2026: switchable game font (src/typography.js). Uses a minimal
// fake document/storage: default, saved choice, unknown/malformed storage,
// rejection of unknown IDs, CSS property, change event and bound selects.
const fs = require("fs"),
  vm = require("vm"),
  path = require("path"),
  assert = require("node:assert/strict");
const source = fs.readFileSync(path.join(__dirname, "../src/typography.js"), "utf8");

/* @function typography1600.load — Inputs: initial stored value (or a function that throws, to simulate blocked storage). Returns { T, store, html, events, listeners, context } after running typography.js in a fresh VM with fake document, storage and events. */
function load(initial) {
  const store = new Map(typeof initial === "string" ? [["frontier.typography.1600", initial]] : []);
  const html = { style: { props: {}, /* @function typography1600.setProperty — Inputs: CSS property name and value. Records it for assertions. */ setProperty(k, v) { this.props[k] = v; } }, dataset: {} };
  const events = [],
    listeners = [];
  const context = {
    document: { documentElement: html },
    localStorage: {
      /* @function typography1600.getItem — Inputs: key. Returns stored value or null; throws when simulating blocked storage. */
      getItem(k) {
        if (typeof initial === "function") initial();
        return store.has(k) ? store.get(k) : null;
      },
      /* @function typography1600.setItem — Inputs: key and value. Stores the value. */
      setItem(k, v) {
        store.set(k, v);
      },
    },
    CustomEvent: class {
      /* @function typography1600.CustomEvent — Inputs: event type and init record. Builds a minimal event with type and detail. */
      constructor(type, init) {
        this.type = type;
        this.detail = init.detail;
      }
    },
    Option: class {
      /* @function typography1600.Option — Inputs: label and value. Builds a minimal option record. */
      constructor(text, value) {
        this.textContent = text;
        this.value = value;
      }
    },
    /* @function typography1600.dispatchEvent — Inputs: event. Records it and calls matching listeners. */
    dispatchEvent(event) {
      events.push(event);
      for (const [type, fn] of listeners) if (type === event.type) fn(event);
    },
    /* @function typography1600.addEventListener — Inputs: type and listener. Registers the listener. */
    addEventListener(type, fn) {
      listeners.push([type, fn]);
    },
  };
  context.globalThis = context;
  vm.runInNewContext(source, context);
  return { T: context.FrontierTypography, store, html, events, listeners, context };
}

/* @function typography1600.fakeSelect — Inputs: none. Returns a minimal select with replaceChildren/append/addEventListener and a fire() helper that simulates the player choosing a value. */
function fakeSelect() {
  const handlers = [];
  return {
    options: [],
    value: "",
    title: "",
    /* @function typography1600.replaceChildren — Inputs: none. Clears options. */
    replaceChildren() {
      this.options = [];
    },
    /* @function typography1600.append — Inputs: option. Adds it. */
    append(option) {
      this.options.push(option);
    },
    /* @function typography1600.selectListen — Inputs: type and handler. Registers a change handler. */
    addEventListener(type, fn) {
      if (type === "change") handlers.push(fn);
    },
    /* @function typography1600.fire — Inputs: chosen value. Sets it and runs change handlers like a real choice. */
    fire(value) {
      this.value = value;
      for (const fn of handlers) fn();
    },
  };
}

// Default: Checkbook, applied to <html> before anything draws.
let t = load();
assert.equal(t.T.current(), "phanicom");
assert.equal(t.html.style.props["--frontier-game-font"], "PhanicomCheckbook, monospace");
assert.equal(t.html.dataset.gameFont, "phanicom");
assert.deepEqual(Object.keys(t.T.fonts), ["phanicom", "system-sans", "system-serif", "system-mono"]);

// Saved choice is restored; unknown or blocked storage falls back.
assert.equal(load("system-serif").T.current(), "system-serif");
assert.equal(load("comic-sans").T.current(), "phanicom");
assert.equal(load(/* @function typography1600.blocked — Inputs: none. Throws like blocked browser storage. */ function () { throw Error("blocked"); }).T.current(), "phanicom");

// set(): applies, saves, announces; unknown IDs are rejected without change.
t.T.set("system-sans");
assert.equal(t.T.current(), "system-sans");
assert.match(t.T.family(), /^system-ui/);
assert.equal(t.html.style.props["--frontier-game-font"], t.T.family());
assert.equal(t.store.get("frontier.typography.1600"), "system-sans");
assert.equal(t.events.at(-1).type, "frontier-font-change");
assert.equal(t.events.at(-1).detail.id, "system-sans");
assert.throws(/* @function typography1600.badSet — Inputs: none. Attempts an unknown font. */ function () { t.T.set("wingdings"); }, /supported font/);
assert.equal(t.T.current(), "system-sans", "rejected choice changes nothing");

// bind(): fills choices, applies changes, and keeps several selects in step.
const pause = t.T.bind(fakeSelect()),
  editor = t.T.bind(fakeSelect());
assert.equal(pause.options.length, 4);
assert.equal(pause.value, "system-sans");
pause.fire("system-mono");
assert.equal(t.T.current(), "system-mono");
assert.equal(editor.value, "system-mono", "other select follows");
pause.fire("not-a-font");
assert.equal(pause.value, "system-mono", "invalid choice snaps back");
assert.match(pause.title, /supported font/);

console.log("PASS game font: default Checkbook, saved/unknown/blocked storage, set/apply/announce, rejection, bound selects stay in step.");
