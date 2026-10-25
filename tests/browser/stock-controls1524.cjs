const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
/* October 13, 2026: the inherited props-fixture explanation below is retained history and superseded for this specialized test. */
(/* @function propsTest.run — Inputs: none. Returns: promise. Authors actual supplied bed/painting onto real room geometry through pointer events, verifies independent collision/attachment and project round-trip validation. Closes browser on every outcome. */ /* @function stock_controls1524.run — Inputs: none. Returns a promise. Verifies typed merchant stock, per-stack ownership, quest protection and custom properties; invalid quantities leave the event draft open. Uses an isolated fixture and closes the browser on success or failure; no earlier tests or release data are overwritten. */ async function () {
  const browser = await chromium.launch(launch);
  try {
    const page = await browser.newPage(),
      errors = [];
    page.on(
      "pageerror",
      /* @function propsTest.error — Inputs: browser exception. Returns: array length. Retains errors for explicit failure. */ function (
        error,
      ) {
        return errors.push(error.message);
      },
    );
    await page.addInitScript(
      /* @function propsTest.capture — Inputs: none. Returns: nothing. Test-only namespace wrappers retain actual renderer and project library without altering production return values. */ function () {
        let render, maps, geometry, models;
        window.propsCapturingRoom = false;
        Object.defineProperty(window, "FrontierGeometryGPU", {
          get: /* @function propsTest.getGeometry — Inputs: none. Returns: captured GPU factory. */ function () {
            return geometry;
          },
          set: /* @function propsTest.setGeometry — Inputs: GPU namespace. Returns: nothing. Wraps factory to retain the actual private room surface for test-only pixel evidence. */ function (
            value,
          ) {
            const original = value.create;
            value.create =
              /* @function propsTest.createGeometry — Inputs: physical/logical dimensions. Returns: unchanged actual GPU backend; retains it for occasional test readback outside performance measurements. */ function (
                ...args
              ) {
                const backend = original(...args);
                if (window.propsCapturingRoom) window.testGeometry = backend;
                return backend;
              };
            geometry = value;
          },
        });
        Object.defineProperty(window, "FrontierModelRenderer", {
          get: /* @function propsTest.getModelRenderer — Inputs: none. Returns captured production model renderer namespace. */ function () {
            return models;
          },
          set: /* @function propsTest.captureRoomRenderer — Inputs: renderer namespace. Returns nothing; wraps room drawing solely to distinguish its private GPU surface from model surfaces in pixel assertions. Production arguments/results/exceptions remain unchanged. */ function (
            value,
          ) {
            const drawRoom = value.geometry;
            value.geometry =
              /* @function propsTest.drawRoom — Inputs: original room renderer arguments. Returns production result; marks only the synchronous room-backend construction scope and clears the marker on errors. No gameplay or rendering substitution. */ function (
                ...args
              ) {
                window.propsCapturingRoom = true;
                try {
                  return drawRoom(...args);
                } finally {
                  window.propsCapturingRoom = false;
                }
              };
            models = value;
          },
        });
        Object.defineProperty(window, "FrontierRender", {
          get: /* @function propsTest.getRender — Inputs: none. Returns: captured renderer. No mutation. */ function () {
            return render;
          },
          set: /* @function propsTest.setRender — Inputs: renderer namespace. Returns: nothing. Wraps actual drawing to retain current runtime game. */ function (
            value,
          ) {
            const original = value.draw;
            value.draw =
              /* @function propsTest.draw — Inputs: canvas/game. Returns: production draw result. Stores current game for read-only assertions and explicit test camera setup. */ function (
                canvas,
                game,
              ) {
                window.testGame = game;
                return original(canvas, game);
              };
            render = value;
          },
        });
        Object.defineProperty(window, "FrontierMaps", {
          get: /* @function propsTest.getMaps — Inputs: none. Returns: captured map namespace. */ function () {
            return maps;
          },
          set: /* @function propsTest.setMaps — Inputs: map namespace. Returns: nothing. Wraps factory to retain the actual library instance for project evidence. */ function (
            value,
          ) {
            const original = value.create;
            value.create =
              /* @function propsTest.createLibrary — Inputs: application adapter. Returns: actual map library; retains it for test evidence. */ function (
                api,
              ) {
                return (window.testLibrary = original(api));
              };
            maps = value;
          },
        });
      },
    );
    await page.addInitScript(
      /* @function doorControls.capture — Inputs: none. Installs test-only factory wrapper that retains the actual workbench without altering its production return value. */ function () {
        let value;
        Object.defineProperty(window, "FrontierHubWorkbench", {
          get: /* @function doorControls.get — Inputs: none. Returns captured namespace. */ function () {
            return value;
          },
          set: /* @function doorControls.set — Inputs: real namespace. Wraps create to retain controller; no source rewrite or gameplay substitution. */ function (
            v,
          ) {
            const original = v.create;
            v.create =
              /* @function doorControls.create — Inputs: production adapter. Returns original controller and stores test handle only. */ function (
                api,
              ) {
                return (window.testHub = original(api));
              };
            value = v;
          },
        });
      },
    );
    await page.goto(
      "file:///" + path.resolve("index.html").replaceAll("\\", "/"),
    );
    await page.waitForSelector("#workspaceToggle");
    await page.locator("#workspaceToggle").click();
    await page.locator("#newMap").evaluate(
      /* @function propsTest.newMap — Inputs: map creation button. Returns: nothing. Invokes real map dialog handler behind collapsed project category. */ function (
        button,
      ) {
        button.click();
      },
    );
    await page.locator("#newMapName").fill("Prop placement acceptance");
    await page.locator("#newMapTemplate").selectOption("interior");
    await page.locator("#confirmNewMap").click();
    await page.evaluate(
      /* @function stockControls.open — Inputs: none. Opens production storage draft at fixture point; event Save still owns persistence. */ function () {
        testHub.storageSettings({ x: 9, y: 9 });
      },
    );
    const d = page.getByRole("dialog", { name: "Container / merchant" });
    await d.getByLabel("Name", { exact: true }).fill("Typed merchant");
    await d.getByLabel("Behavior", { exact: true }).selectOption("merchant");
    await d.getByLabel("Stock item ID", { exact: true }).fill("healing-herb");
    await d
      .getByLabel("Stock quantity (whole items)", { exact: true })
      .fill("7");
    await d.getByLabel("Stack ownership", { exact: true }).selectOption("npc");
    await d
      .getByLabel("Stack NPC owner ID", { exact: true })
      .fill("vendor-one");
    await d
      .getByLabel("Protect stack from dropped-item cleanup", { exact: true })
      .check();
    await d
      .locator("details")
      .getByText("Advanced custom item properties", { exact: true })
      .click();
    await d
      .getByLabel("Stack custom properties", { exact: true })
      .fill('{"condition":41}');
    await d.getByRole("button", { name: "Apply", exact: true }).click();
    await page.locator("#mzEventOK").click();
    const stock = await page.evaluate(
      /* @function stockControls.saved — Inputs: none. Returns stock from independently validated portable project. */ function () {
        const p = FrontierMaps.validate(
          JSON.parse(JSON.stringify(testLibrary.snapshot())),
        );
        return p.maps
          .find(
            /* @function stockControls.map — Inputs: map. Returns active identity match. */ function (
              m,
            ) {
              return m.id === testLibrary.active;
            },
          )
          .world.events.find(
            /* @function stockControls.event — Inputs: event. Returns authored merchant match. */ function (
              e,
            ) {
              return e.name === "Typed merchant";
            },
          ).extensions.hub.stock;
      },
    );
    assert.equal(stock[0].itemId, "healing-herb");
    assert.equal(stock[0].quantity, 7);
    assert.deepEqual(stock[0].owner, { kind: "npc", id: "vendor-one" });
    assert.equal(stock[0].questProtected, true);
    assert.equal(stock[0].properties.condition, 41);
    await page.evaluate(
      /* @function stockControls.reopen — Inputs: none. Opens the actual saved merchant without resetting stock properties. */ function () {
        testHub.storageSettings(
          { x: 9, y: 9 },
          testGame.sourceWorld.events.find(
            /* @function stockControls.savedEvent — Inputs: event. Returns name match. */ function (
              e,
            ) {
              return e.name === "Typed merchant";
            },
          ),
        );
      },
    );
    assert.equal(
      await d
        .getByLabel("Stock quantity (whole items)", { exact: true })
        .inputValue(),
      "7",
    );
    await d
      .getByLabel("Stock quantity (whole items)", { exact: true })
      .fill("0.5");
    await d.getByRole("button", { name: "Apply", exact: true }).click();
    assert(await d.isVisible());
    assert((await d.textContent()).includes("Invalid item stack"));
    await d.getByRole("button", { name: "Cancel", exact: true }).click();
    assert.deepEqual(errors, []);
    console.log(
      "PASS typed merchant stock, independent ownership/protection/custom properties and invalid quantity rejection",
    );
  } finally {
    await browser.close();
  }
})().catch(
  /* @function stockControls.failure — Inputs: error. Reports failed acceptance and nonzero exit status without retries. */ function (
    error,
  ) {
    console.error(error);
    process.exitCode = 1;
  },
);
