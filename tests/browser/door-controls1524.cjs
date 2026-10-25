const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
/* October 13, 2026: the inherited props-fixture explanation below is retained history and superseded for this specialized test. */
(/* @function propsTest.run — Inputs: none. Returns: promise. Authors actual supplied bed/painting onto real room geometry through pointer events, verifies independent collision/attachment and project round-trip validation. Closes browser on every outcome. */ /* @function door_controls1524.run — Inputs: none. Returns a promise. Verifies typed interaction-zone and paired sliding-door controls, transition hold and validated event/project persistence. Uses an isolated fixture and closes the browser on success or failure; no earlier tests or release data are overwritten. */ async function () {
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
      /* @function doorControls.open — Inputs: none. Opens actual production door authoring draft at fixture point. Does not commit until ordinary event Save. */ function () {
        testHub.doorSettings({ x: 9, y: 9 });
      },
    );
    const d = page.getByRole("dialog", {
      name: "Door / invisible transfer zone",
    });
    await d.getByLabel("Door name", { exact: true }).fill("Typed paired door");
    await d
      .getByLabel("Clickable zone size (metres) X", { exact: true })
      .fill("1.8");
    await d
      .getByLabel("Clickable zone size (metres) Y", { exact: true })
      .fill("0.4");
    await d
      .getByLabel("Clickable zone size (metres) Z", { exact: true })
      .fill("2.2");
    await d.getByLabel("Zone rotation (degrees) Z", { exact: true }).fill("45");
    await d
      .getByLabel("Black-space hold (seconds)", { exact: true })
      .fill("0.6");
    await d
      .getByRole("button", { name: "Edit moving door leaves...", exact: true })
      .click();
    const leaves = page.getByRole("dialog", { name: "Moving door leaves" });
    await leaves
      .getByLabel("Number of moving leaves", { exact: true })
      .selectOption("2");
    for (let index = 1; index <= 2; index++) {
      await leaves
        .getByLabel("Leaf " + index + " motion", { exact: true })
        .selectOption("sliding");
      await leaves
        .getByLabel(
          "Leaf " +
            index +
            " speed (degrees/sec for swing; units/sec for slide)",
          { exact: true },
        )
        .fill("1");
    }
    await leaves.getByLabel("Leaf 2 axis X", { exact: true }).fill("-1");
    await leaves.getByRole("button", { name: "Apply", exact: true }).click();
    await d.getByRole("button", { name: "Apply", exact: true }).click();
    await page.locator("#mzEventOK").click();
    const event = await page.evaluate(
      /* @function doorControls.saved — Inputs: none. Returns validated portable authored door event after real event Save. */ function () {
        const p = FrontierMaps.validate(
          JSON.parse(JSON.stringify(testLibrary.snapshot())),
        );
        return p.maps
          .find(
            /* @function doorControls.map — Inputs: map. Returns active identity match. */ function (
              m,
            ) {
              return m.id === testLibrary.active;
            },
          )
          .world.events.find(
            /* @function doorControls.event — Inputs: event. Returns authored name match. */ function (
              e,
            ) {
              return e.name === "Typed paired door";
            },
          );
      },
    );
    assert(event);
    assert.deepEqual(event.spatial.interactionZones[0].size, [1.8, 0.4, 2.2]);
    assert.deepEqual(event.spatial.rotation, [0, 0, 45]);
    assert.equal(event.extensions.hub.transition.hold, 0.6);
    assert.equal(event.extensions.hub.transition.leaves.length, 2);
    assert.equal(event.extensions.hub.transition.leaves[1].axis[0], -1);
    assert.deepEqual(errors, []);
    console.log(
      "PASS typed door zone/timing and paired sliding composition through real event Save and project validation",
    );
  } finally {
    await browser.close();
  }
})().catch(
  /* @function doorControls.failure — Inputs: error. Reports explicit failed acceptance and process status without retries. */ function (
    error,
  ) {
    console.error(error);
    process.exitCode = 1;
  },
);
