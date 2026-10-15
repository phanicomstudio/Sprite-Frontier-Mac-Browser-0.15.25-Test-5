/* October 13, 2026: independent map-management acceptance. Existing authoring
 * fixtures remain intact; this test creates its own blank cell and project data. */
"use strict";
const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
(/* @function mapControls.run — Inputs: none. Returns promise; verifies real map controls, self-link copying and reversible membership changes in an isolated fixture. Closes its browser on every outcome and preserves all earlier tests. */ async function () {
  const browser = await chromium.launch(launch);
  try {
    const page = await browser.newPage(),
      errors = [];
    page.on(
      "pageerror",
      /* @function mapControls.error — Inputs: page exception. Returns array length; retains errors for explicit acceptance failure. */ function (
        error,
      ) {
        return errors.push(error.message);
      },
    );
    await page.addInitScript(
      /* @function mapControls.capture — Inputs: none. Installs a test-only factory wrapper that retains the production library without replacing its operations or return values. */ function () {
        let namespace;
        Object.defineProperty(window, "FrontierMaps", {
          get: /* @function mapControls.get — Inputs: none. Returns captured namespace. */ function () {
            return namespace;
          },
          set: /* @function mapControls.set — Inputs: production namespace. Wraps create only to retain the real instance. */ function (
            value,
          ) {
            const create = value.create;
            value.create =
              /* @function mapControls.create — Inputs: production application adapter. Returns original library and stores a test handle. */ function (
                api,
              ) {
                return (window.mapTestLibrary = create(api));
              };
            namespace = value;
          },
        });
      },
    );
    await page.goto(
      "file:///" + path.resolve("index.html").replaceAll("\\", "/"),
    );
    await page.waitForSelector("#workspaceToggle");
    await page.locator("#workspaceToggle").click();
    await page.getByRole("button", { name: "Map", exact: true }).click();
    const group = page
      .locator("details.workspaceGroup")
      .filter({ has: page.locator("#duplicateMap") });
    if ((await group.getAttribute("open")) === null)
      await group.locator(":scope > summary").click();
    await page.locator("#newMap").click();
    await page.locator("#newMapName").fill("Map management acceptance");
    await page.locator("#newMapTemplate").selectOption("interior");
    await page.locator("#confirmNewMap").click();
    const original = await page.evaluate(
      /* @function mapControls.original — Inputs: none. Returns active identity/count before duplicate. No authored mutation. */ function () {
        const p = mapTestLibrary.snapshot();
        return { id: p.active, count: p.maps.length };
      },
    );
    const largeLibrary = await page.evaluate(
      /* @function mapControls.largeLibrary — Inputs: none. Returns map count and final copy identity after validating and JSON round-tripping 128 independent cells, then duplicating beyond the former cap. Mutates only detached fixture records; no extra cells enter the live renderer. Throws on production validation failure. */ function () {
        const base = mapTestLibrary.snapshot();
        const world = base.maps.find(
          /* @function mapControls.largeSource — Inputs: map record. Returns whether it is the active fixture cell. */ function (map) { return map.id === base.active; }
        ).world;
        base.maps = [];
        for (let i = 0; i < 128; i++) base.maps.push({ id: "large-cell-" + i, name: "Large library cell " + i, world: structuredClone(world) });
        base.active = "large-cell-0";
        const restored = FrontierMaps.validate(JSON.parse(JSON.stringify(FrontierMaps.validate(base))));
        const copied = FrontierMaps.duplicate(restored, restored.active, "Beyond the old cap");
        return { count: copied.maps.length, active: copied.active };
      }
    );
    assert.equal(largeLibrary.count, 129);
    const pure = await page.evaluate(
      /* @function mapControls.selfLinks — Inputs: none. Returns copy/delete link evidence from portable fixture data. Uses production validators/helpers without adopting the altered fixture into the live project. */ function () {
        const p = mapTestLibrary.snapshot(),
          source = p.maps.find(
            /* @function mapControls.source — Inputs: map. Returns active identity match. */ function (
              m,
            ) {
              return m.id === p.active;
            },
          );
        const e = FrontierEvents.create(
          "self-transfer",
          source.world.spawn.x,
          source.world.spawn.y,
        );
        e.pages[0].commands = [
          {
            type: "transferMap",
            map: source.id,
            entrance: "spawn",
            effect: "immediate",
          },
          {
            type: "mz",
            code: 201,
            indent: 0,
            parameters: [0, source.mzId, 4, 4, 2, 0],
          },
        ];
        source.world.events.push(e);
        const before = JSON.stringify(p),
          copy = FrontierMaps.duplicate(p, source.id, "Self-link copy"),
          newMap = copy.maps.at(-1),
          commands = newMap.world.events.at(-1).pages[0].commands;
        let blocked = false;
        try {
          FrontierMaps.remove(
            {
              ...copy,
              maps: copy.maps.map(
                /* @function mapControls.incomingFixture — Inputs: map. Returns a private referring map only for direct-link rejection. Original maps remain unmodified. */ function (
                  m,
                ) {
                  if (m.id === source.id) {
                    const v = structuredClone(m);
                    v.world.events.at(-1).pages[0].commands[0].map = newMap.id;
                    return v;
                  }
                  return m;
                },
              ),
            },
            newMap.id,
          );
        } catch (error) {
          blocked = error.message.includes("Retarget links");
        }
        return {
          unchanged: before === JSON.stringify(p),
          stringTarget: commands[0].map,
          numericTarget: commands[1].parameters[1],
          id: newMap.id,
          mzId: newMap.mzId,
          blocked,
        };
      },
    );
    assert(pure.unchanged);
    assert.equal(pure.stringTarget, pure.id);
    assert.equal(pure.numericTarget, pure.mzId);
    assert(pure.blocked);
    await page.locator("#duplicateMap").click();
    const copied = await page.evaluate(
      /* @function mapControls.copied — Inputs: none. Returns active copied identity/count. */ function () {
        const p = mapTestLibrary.snapshot();
        return { id: p.active, count: p.maps.length };
      },
    );
    assert.notEqual(copied.id, original.id);
    assert.equal(copied.count, original.count + 1);
    await page.locator("#deleteMap").click();
    assert.equal(
      await page.evaluate(
        /* @function mapControls.deleted — Inputs: none. Returns project map count after reversible deletion. */ function () {
          return mapTestLibrary.snapshot().maps.length;
        },
      ),
      original.count,
    );
    await page.locator("#undoMapOperation").click();
    assert.equal(
      await page.evaluate(
        /* @function mapControls.restored — Inputs: none. Returns active restored identity. */ function () {
          return mapTestLibrary.active;
        },
      ),
      copied.id,
    );
    await page.locator("#mapName").fill("Renamed restored copy");
    await page.locator("#renameMap").click();
    await page.locator("#redoMapOperation").click();
    await page.locator("#undoMapOperation").click();
    assert.equal(
      await page.locator("#mapName").inputValue(),
      "Renamed restored copy",
    );
    // October 14 Test 5: a blocked action must explain itself beside the control.
    await page.evaluate(/* @function mapControls.singleMapFixture — Inputs: none. Adopts an isolated one-map fixture through the production library restore; no user files are touched. */ function(){const project=mapTestLibrary.snapshot();project.maps=project.maps.filter(/* @function mapControls.keepActiveFixture — Inputs: map. Returns active identity equality; no effects. */ function(map){return map.id===project.active;});mapTestLibrary.restore(project);});
    await page.locator("#deleteMap").click();
    assert.match(await page.locator("#mapOperationStatus").textContent(),/Keep at least one map.*No maps were changed/);
    assert(await page.locator("#mapOperationStatus").isVisible(),"Blocked map deletion explains itself beside the control");
    assert.deepEqual(errors, []);
    console.log(
      "PASS map duplicate/delete/Undo/Redo, preserved later edits, direct-link rejection and self-link rebasing",
    );
  } finally {
    await browser.close();
  }
})().catch(
  /* @function mapControls.failure — Inputs: error. Reports explicit failed acceptance and failed process status without retries. */ function (
    error,
  ) {
    console.error(error);
    process.exitCode = 1;
  },
);
