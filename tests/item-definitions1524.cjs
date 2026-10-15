"use strict";
/* Tests project metadata adoption independently of inventory ownership/state. */
const assert = require("node:assert/strict");
require("../src/event-schema.js");
globalThis.FrontierItems = [
  { id: "baseline", name: "Original item", price: 5, graphic: "chest" },
];
require("../src/item-definitions.js");
const service = FrontierItemDefinitions;
const draft = [
  {
    id: "book",
    name: "Castle book",
    price: 12,
    graphic: "chest",
    properties: { category: "books" },
    future: { retain: true },
  },
];
const checked = service.validate(draft);
checked[0].name = "Changed";
assert.equal(draft[0].name, "Castle book");
service.apply(JSON.parse(JSON.stringify(draft)));
assert.equal(FrontierItems[0].future.retain, true);
assert.equal(FrontierItems[0].name, "Castle book");
const before = JSON.stringify(FrontierItems);
for (const invalid of [
  [...draft, ...draft],
  [{ ...draft[0], price: 0 }],
  [{ ...draft[0], price: 1.5 }],
  [{ ...draft[0], properties: { bad: Infinity } }],
  [{ ...draft[0], name: " " }],
])
  assert.throws(
    /* @function itemDefinitionsTest.reject — Inputs: none; captures malformed catalog. Returns: apply result only if incorrectly accepted, otherwise expected error. Verifies adoption rejects invalid metadata atomically without replacing the current shared catalog. */ () =>
      service.apply(invalid),
  );
assert.equal(JSON.stringify(FrontierItems), before);
service.apply(undefined);
assert.equal(FrontierItems[0].name, "Original item");
assert.equal(service.validate([]).length, 0);
const incoming = [
  { id: "painting", name: "Painting", price: 25, modelId: "source-model" },
];
const merged = service.merge(
  undefined,
  incoming,
  new Map([["source-model", "merged-model"]]),
);
assert.equal(merged.length, 2);
assert.equal(merged[1].modelId, "merged-model");
assert.equal(incoming[0].modelId, "source-model");
assert.throws(
  /* @function itemDefinitionsTest.conflict — Inputs: none. Returns: merge only on erroneous acceptance; expected conflict protects existing cells from silently replacing metadata for a stable inventory ID. Both input catalogs remain untouched. */ () =>
    service.merge(
      undefined,
      [{ id: "baseline", name: "Different", price: 5, graphic: "chest" }],
      new Map(),
    ),
);
assert.equal(service.merge(undefined, undefined, new Map()), undefined);
console.log(
  "PASS detached portable item metadata, retained extension fields, price/ID/property bounds and inherited reset",
);
