const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
/* October 13, 2026: the inherited props-fixture explanation below is retained history and superseded for this specialized test. */
(/* @function propsTest.run — Inputs: none. Returns: promise. Authors actual supplied bed/painting onto real room geometry through pointer events, verifies independent collision/attachment and project round-trip validation. Closes browser on every outcome. */ /* @function cell_controls1524.run — Inputs: none. Returns a promise. Verifies typed arrival XYZ/facing, fog and sprite-normal drafts, portable persistence, Undo and invalid Apply feedback. Uses an isolated fixture and closes the browser on success or failure; no earlier tests or release data are overwritten. */ async function () {
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
    await page
      .getByRole("button", {
        name: "Cell settings / arrivals",
        exact: true,
        includeHidden: true,
      })
      .evaluate(
        /* @function cellControls.open — Inputs: real launcher. Returns nothing; invokes retained production handler behind workspace disclosure. */ function (
          b,
        ) {
          b.click();
        },
      );
    const dialog = page.getByRole("dialog", {
      name: "Cell settings and arrivals",
    });
    await dialog
      .getByRole("button", {
        name: "Add arrival at player position",
        exact: true,
      })
      .click();
    await dialog
      .getByLabel("Arrival ID", { exact: true })
      .last()
      .fill("north-entry");
    await dialog
      .getByLabel("Arrival name", { exact: true })
      .last()
      .fill("North doorway");
    await dialog
      .getByLabel("Arrival X (metres)", { exact: true })
      .last()
      .fill("12");
    await dialog
      .getByLabel("Arrival Y (metres)", { exact: true })
      .last()
      .fill("14");
    await dialog
      .getByLabel("Arrival facing (degrees)", { exact: true })
      .last()
      .fill("90");
    await dialog.getByLabel("Arrival Z (metres, blank = automatic)", {exact:true}).last().fill("3");
    await dialog.getByRole("button", {name:"Add arrival at player position",exact:true}).click();
    await dialog.getByLabel("Arrival ID", {exact:true}).last().fill("automatic-entry");
    await dialog.getByLabel("Arrival Z (metres, blank = automatic)", {exact:true}).last().fill("");
    await dialog.getByLabel("Enable cell fog", { exact: true }).check();
    await dialog.getByLabel("Fog start (metres)", { exact: true }).fill("8");
    await dialog.getByLabel("Fog end (metres)", { exact: true }).fill("30");
    await dialog.getByLabel("Fog color", { exact: true }).fill("#224466");
    await dialog
      .getByLabel("Sprite normal ambient (0–1)", { exact: true })
      .fill("0.4");
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    const saved = await page.evaluate(
      /* @function cellControls.saved — Inputs: none. Returns independently validated project map draft, proving typed settings persist through ordinary serialization. No mutation. */ function () {
        const p = FrontierMaps.validate(
          JSON.parse(JSON.stringify(testLibrary.snapshot())),
        );
        return p.maps.find(
          /* @function cellControls.active — Inputs: map. Returns active identity match. */ function (
            m,
          ) {
            return m.id === testLibrary.active;
          },
        ).world;
      },
    );
    assert.deepEqual(saved.fog, {
      enabled: true,
      start: 8,
      end: 30,
      color: "#224466",
    });
    assert.equal(saved.cell.light.ambient, 0.4);
    const arrival = saved.cell.arrivals.find(
      /* @function cellControls.arrival — Inputs: arrival. Returns stable ID match. */ function (
        a,
      ) {
        return a.id === "north-entry";
      },
    );
    assert.equal(arrival.x, 12);
    assert.equal(arrival.y, 14);
    assert.equal(arrival.z, 3);
    const automatic = saved.cell.arrivals.find(/* @function cellControls.autoArrival — Inputs: saved arrival. Returns automatic fixture ID match without mutation. */function(value){return value.id === "automatic-entry";});
    assert(automatic);
    assert.equal(automatic.z, undefined, "Blank Z preserves automatic floor selection");

    assert(Math.abs(arrival.yaw - Math.PI / 2) < 1e-10);
    await page
      .getByRole("button", { name: "Undo change", exact: true })
      .click();
    assert.equal(
      await page.evaluate(
        /* @function cellControls.undone — Inputs: none. Returns whether Undo removed newly authored arrival. */ function () {
          return testGame.sourceWorld.cell.arrivals.some(
            /* @function cellControls.findUndo — Inputs: arrival. Returns new ID match. */ function (
              a,
            ) {
              return a.id === "north-entry";
            },
          );
        },
      ),
      false,
    );
    await page
      .getByRole("button", {
        name: "Cell settings / arrivals",
        exact: true,
        includeHidden: true,
      })
      .evaluate(
        /* @function cellControls.reopen — Inputs: launcher. Opens a new independent production draft. */ function (
          b,
        ) {
          b.click();
        },
      );
    await dialog.getByLabel("Fog start (metres)", { exact: true }).fill("40");
    await dialog.getByLabel("Fog end (metres)", { exact: true }).fill("20");
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    assert(await dialog.isVisible());
    assert((await dialog.textContent()).includes("Fog needs"));
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    assert.deepEqual(errors, []);
    console.log(
      "PASS typed arrivals/fog/normal-light authoring, radians persistence, Undo and invalid draft rejection",
    );
  } finally {
    await browser.close();
  }
})().catch(
  /* @function cellControls.failure — Inputs: error. Reports acceptance failure and failed exit status; no hidden retries. */ function (
    error,
  ) {
    console.error(error);
    process.exitCode = 1;
  },
);
