"use strict";
const { chromium, launch } = require("./environment.cjs"),
  path = require("node:path"),
  assert = require("node:assert/strict");
(/* @function skyTest.run — Inputs: none. Returns promise; authors image sky through real controls, validates portable settings and actual bundled GPU panorama pixels/rotation/seam continuity. Tiny readback is isolated from performance tests; closes browser on all outcomes. */ async function () {
  const browser = await chromium.launch(launch);
  try {
    const page = await browser.newPage(),
      errors = [];
    page.on(
      "pageerror",
      /* @function skyTest.pageError — Inputs: browser exception. Returns array length; retains shader/startup failures for explicit acceptance. */ function (
        error,
      ) {
        return errors.push(error.message);
      },
    );
    await page.addInitScript(
      /* @function skyTest.capture — Inputs: none. Returns nothing; wraps actual renderer namespace to retain live game for read-only authoring/pixel evidence. Production draw result remains unchanged. */ function () {
        let renderer;
        Object.defineProperty(window, "FrontierRender", {
          get: /* @function skyTest.getRenderer — Inputs: none. Returns captured namespace. */ function () {
            return renderer;
          },
          set: /* @function skyTest.setRenderer — Inputs: production namespace. Returns nothing; records live game through unchanged drawing. */ function (
            value,
          ) {
            const original = value.draw;
            value.draw =
              /* @function skyTest.draw — Inputs: original draw arguments. Returns actual result and retains live game for fixture assertions. */ function (
                canvas,
                game,
              ) {
                window.skyTestGame = game;
                return original(canvas, game);
              };
            renderer = value;
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
      /* @function skyTest.newMap — Inputs: actual creation button. Returns nothing; invokes its existing dialog handler without constructing test maps directly. */ function (
        button,
      ) {
        button.click();
      },
    );
    await page.locator("#newMapName").fill("Sky authoring acceptance");
    await page.locator("#newMapTemplate").selectOption("interior");
    await page.locator("#confirmNewMap").click();
    await page.getByRole("button", { name: "Map", exact: true }).click();
    await page.locator("#skyTools").evaluate(
      /* @function skyTest.openSky — Inputs: real fieldset. Returns nothing; opens its actual disclosure after category selection. */ function (
        field,
      ) {
        field.parentElement.open = true;
      },
    );
    await page.locator("#skyPanoramaAsset").selectOption("sky-4");
    await page.locator("#skyOrientation").fill("45");
    await page.locator("#skyWrapBlend").check();
    while (
      await page
        .locator("#skyTools")
        .getByRole("button", { name: "Remove layer", exact: true })
        .count()
    )
      await page
        .locator("#skyTools")
        .getByRole("button", { name: "Remove layer", exact: true })
        .first()
        .click();
    await page.locator("#skyApply").click();
    await page.waitForFunction(
      /* @function skyTest.readySky — Inputs: none. Returns whether authored panorama reached runtime and its shared source image decoded. Does not alter settings or fake readiness. */ function () {
        return (
          skyTestGame.sourceWorld.sky?.panorama?.asset === "sky-4" &&
          !!FrontierSkyPanorama.image("sky-4")
        );
      },
    );
    await page.waitForFunction(
      /* @function skyTest.readyAllBankedSkies � Inputs: none. Returns whether all four real lazy image decodes completed; requests each once through production service. Errors remain explicit failures. */ function () {
        return FrontierSkyPanorama.catalog.every(
          /* @function skyTest.bankImageReady � Inputs: catalog row. Returns whether its actual image is ready. */ function (
            entry,
          ) {
            return !!FrontierSkyPanorama.image(entry.id);
          },
        );
      },
    );
    const result = await page.evaluate(
      /* @function skyTest.gpuEvidence — Inputs: none. Returns validated saved settings and real GPU pixels from several camera rotations. Uses production panorama draw on existing adapter; fixture stage is restored by next normal frame. No shader replacement or source editing. */ function () {
        const game = skyTestGame,
          sky = FrontierSky.validate(
            JSON.parse(JSON.stringify(game.sourceWorld.sky)),
          ),
          ctx = FrontierPixi.current();
        /* @function skyTest.pixel — Inputs: yaw radians and orientation degrees. Returns centre pixel from actual fullscreen panorama mesh after synchronous fixture submit. Tiny GL readback belongs only to validation; no authored mutation. */
        function pixel(yaw, orientation, asset = sky.panorama.asset) {
          ctx.begin();
          ctx.breathing = null;
          ctx.underwater = null;
          const cam = {
            yaw,
            pitch: 0,
            cx: (game.viewWidth || 640) / 2,
            cy: 240,
          };
          const drawn = FrontierSkyPanorama.draw(ctx, game, cam, {
            ...sky.panorama,
            orientation,
            asset,
          });
          if (!drawn) throw Error("Panorama GPU draw unavailable");
          ctx.end();
          const gl = ctx.app.renderer.gl,
            bytes = new Uint8Array(4);
          gl.readPixels(
            Math.floor(gl.drawingBufferWidth / 2),
            Math.floor(gl.drawingBufferHeight / 2),
            1,
            1,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            bytes,
          );
          return Array.from(bytes);
        }
        return {
          sky,
          first: pixel(0.2, 0),
          turned: pixel(1.8, 0),
          seamLeft: pixel(-0.000001, 0),
          seamRight: pixel(0.000001, 0),
          fullTurn: pixel(Math.PI * 2 + 0.2, 0),
          memory: FrontierSkyPanorama.memoryBytes(),
          bank: FrontierSkyPanorama.catalog.map(
            /* @function skyTest.bankPixels � Inputs: sky record. Returns actual seam-side pixels for this source through the same reused renderer mesh. */ function (
              entry,
            ) {
              return {
                id: entry.id,
                left: pixel(-0.000001, 0, entry.id),
                right: pixel(0.000001, 0, entry.id),
              };
            },
          ),
          diagnostics: FrontierSkyPanorama.diagnostics(ctx),
        };
      },
    );
    assert.equal(result.sky.panorama.orientation, 45);
    assert.equal(result.sky.layers.length, 0);
    assert.equal(result.first[3], 255);
    assert(
      result.first.slice(0, 3).some(
        /* @function skyTest.visibleColor — Inputs: RGB component. Returns whether image contributes visible nonblack color. */ function (
          value,
        ) {
          return value > 20;
        },
      ),
    );
    assert.notDeepEqual(
      result.first,
      result.turned,
      "Camera rotation samples distinct sky directions",
    );
    for (let channel = 0; channel < 4; channel++) {
      assert(
        Math.abs(result.seamLeft[channel] - result.seamRight[channel]) <= 2,
        "Wrapped material is continuous at seam",
      );
      assert(
        Math.abs(result.first[channel] - result.fullTurn[channel]) <= 1,
        "Full camera turn returns same sky",
      );
    }
    for (const image of result.bank)
      for (let channel = 0; channel < 4; channel++)
        assert(
          Math.abs(image.left[channel] - image.right[channel]) <= 2,
          image.id + " wrap continuity",
        );
    assert.equal(result.diagnostics.decoded, 4);
    assert.equal(result.diagnostics.meshes, 1);
    assert.equal(result.diagnostics.gpuBytes, result.memory);
    assert(result.memory > 0 && result.memory <= 4 * 4096 * 4096 * 4);
    assert.deepEqual(errors, []);
    await page.screenshot({ path: "test-artifacts/sky1524.png" });
    console.log(
      "PASS actual per-map sky authoring, portable settings, panorama GPU colors, rotation and blended wrap continuity",
    );
  } finally {
    await browser.close();
  }
})().catch(
  /* @function skyTest.failure — Inputs: rejected test error. Returns nothing; reports unsuccessful acceptance and nonzero exit. */ function (
    error,
  ) {
    console.error(error);
    process.exitCode = 1;
  },
);
