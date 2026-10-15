const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
/* October 13, 2026: the inherited props-fixture explanation below is retained history and superseded for this specialized test. */
(/* @function propsTest.run — Inputs: none. Returns: promise. Authors actual supplied bed/painting onto real room geometry through pointer events, verifies independent collision/attachment and project round-trip validation. Closes browser on every outcome. */ /* @function effect_controls1524.run — Inputs: none. Returns a promise. Verifies native effect parameter controls, emitter enabled persistence, breathing and map/event color-pooling note rules through the actual editor. Uses an isolated fixture and closes the browser on success or failure; no earlier tests or release data are overwritten. */ async function () {
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
        name: "Native effects / map notes",
        exact: true,
        includeHidden: true,
      })
      .evaluate(
        /* @function effectsControls.open — Inputs: production launcher. Opens its draft without changing authored data. */ function (
          b,
        ) {
          b.click();
        },
      );
    const dialog = page
      .locator("dialog")
      .filter({
        has: page.getByRole("heading", { name: "Native effects", exact: true }),
      });
    await dialog.locator('[data-field="notes"]').fill("<ColorPoolPlayer>");
    await dialog.locator("[data-color]").check();
    await dialog.locator("[data-palette]").selectOption("wizards");
    await dialog.locator("[data-strength]").fill("0.5");
    await dialog.locator("[data-breathing]").check();
    await dialog.locator("[data-amplitude]").fill("0.015");
    await dialog.locator("[data-frequency]").fill("0.5");
    await dialog.locator("[data-add]").click();
    await dialog.locator("[data-emitter-enabled]").last().uncheck();
    await dialog.locator('[data-value="rate"]').last().fill("12");
    await dialog.locator("[data-apply]").click();
    const proof = await page.evaluate(
      /* @function effectsControls.saved — Inputs: none. Returns validated authored settings plus actor opt-in results; no runtime cache mutation. */ function () {
        const p = FrontierMaps.validate(
            JSON.parse(JSON.stringify(testLibrary.snapshot())),
          ),
          w = p.maps.find(
            /* @function effectsControls.active — Inputs: map. Returns active identity match. */ function (
              m,
            ) {
              return m.id === testLibrary.active;
            },
          ).world;
        return {
          settings: w.nativeEffects,
          player: FrontierNativeEffects.optIn(w.nativeEffects, "player"),
          follower: FrontierNativeEffects.optIn(w.nativeEffects, "follower"),
          event: FrontierNativeEffects.optIn(
            w.nativeEffects,
            "event",
            "<ColorPool>",
          ),
        };
      },
    );
    assert.equal(proof.settings.emitters.at(-1).enabled, false);
    assert.equal(proof.settings.emitters.at(-1).rate, 12);
    assert.equal(proof.settings.breathing.amplitude, 0.015);
    assert.equal(proof.player, true);
    assert.equal(proof.follower, false);
    assert.equal(proof.event, true);
    await page
      .getByRole("button", {
        name: "Native effects / map notes",
        exact: true,
        includeHidden: true,
      })
      .evaluate(
        /* @function effectsControls.reopen — Inputs: real launcher. Opens saved settings to test preservation on reapply. */ function (
          b,
        ) {
          b.click();
        },
      );
    assert.equal(
      await dialog.locator("[data-emitter-enabled]").last().isChecked(),
      false,
    );
    await dialog.locator("[data-apply]").click();
    assert.equal(
      await page.evaluate(
        /* @function effectsControls.retained — Inputs: none. Returns saved enabled flag after untouched draft Apply. */ function () {
          return testGame.sourceWorld.nativeEffects.emitters.at(-1).enabled;
        },
      ),
      false,
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS native effect typed controls, disabled emitter preservation, breathing settings and map/event opt-in persistence",
    );
  } finally {
    await browser.close();
  }
})().catch(
  /* @function effectsControls.failure — Inputs: error. Reports acceptance failure and nonzero exit without retries. */ function (
    error,
  ) {
    console.error(error);
    process.exitCode = 1;
  },
);
