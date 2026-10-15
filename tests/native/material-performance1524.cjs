/* October 13, 2026: actual imported, locally reloaded material override in the
 * desktop-launched final fixture. No synthetic frames, GPU finish or readback. */
"use strict";
const { chromium } = require(process.env.FRONTIER_PLAYWRIGHT || "playwright"),
  assert = require("node:assert/strict"),
  fs = require("node:fs");
(/* @function materialPerformance.run — Inputs: loopback endpoint environment. Returns a promise; measures the persisted override across all six supported quality presets and writes raw native observations. Refuses any other window. Always restores drawing and display; timing is CPU submission and frame intervals, not GPU elapsed time. */ async function () {
  const browser = await chromium.connectOverCDP(
      process.env.FRONTIER_NATIVE_CDP || "http://127.0.0.1:9548",
    ),
    page = browser.contexts()[0].pages()[0];
  assert(
    page.url().includes("native-editor1524-final/resources/app/index.html"),
  );
  try {
    await page.evaluate(
      /* @function materialPerformance.observe — Inputs: none. Returns nothing; observes ordinary production drawing and records bounded frame timings. Does not change source pixels, model transforms or simulation. */ function () {
        window.materialPerf = {
          draw: FrontierRender.draw,
          display: FrontierDisplay.get(),
          times: [],
          intervals: [],
          last: 0,
        };
        FrontierRender.draw =
          /* @function materialPerformance.draw — Inputs: renderer arguments. Returns original draw result and retains actual game and timing only; no allocation of models/textures. */ function (
            ...args
          ) {
            const s = materialPerf,
              t = performance.now();
            s.game = args[1];
            if (s.last && s.intervals.length < 10000)
              s.intervals.push(t - s.last);
            s.last = t;
            const result = s.draw.apply(this, args);
            if (s.times.length < 10000) s.times.push(performance.now() - t);
            return result;
          };
      },
    );
    await page.waitForFunction(
      /* @function materialPerformance.fixture — Inputs: none. Returns whether normal frames expose the expected persisted override and decoded texture. No injected scene or fake readiness. */ function () {
        const event = materialPerf.game?.sourceWorld.events.find(
          /* @function materialPerformance.event — Inputs: event. Returns material fixture identity match, read-only. */ (
            e,
          ) => e.id === "material-instance",
        );
        return (
          event?.spatial.materials?.[0]?.color === "#00ff00" &&
          !!FrontierRoomSurfaces.get(event.spatial.materials[0].texture)
        );
      },
    );
    await page.evaluate(
      /* @function materialPerformance.frameModel � Inputs: none. Returns nothing; positions the isolated test camera in front of the real authored model. Saves the original player/camera and restores them after measurement. Does not move the model or change source collision/materials. */ function () {
        const s = materialPerf,
          g = s.game,
          event = g.sourceWorld.events.find(
            /* @function materialPerformance.targetModel � Inputs: event. Returns fixture identity match. */ (
              e,
            ) => e.id === "material-instance",
          );
        s.player = { x: g.player.x, y: g.player.y, z: g.player.z };
        s.camera = { ...g.camera };
        g.player.x = event.x;
        g.player.y = event.y - 4;
        g.player.z = event.spatial.transform?.position?.[2] || 0;
        g.camera.firstPerson = true;
        g.camera.yaw = 0;
        g.camera.pitch = 0;
      },
    );
    if (await page.locator("body.engineAuthoring").count())
      await page.locator("#workspaceToggle").click();
    const observations = [];
    for (const filtering of ["crisp", "smooth"])
      for (const scale of [1, 1.5, 2]) {
        await page.evaluate(
          /* @function materialPerformance.preset — Inputs: display preference. Returns nothing; applies the supported preset and clears local timing after the previous sample. Changes only isolated diagnostic preferences. */ function (
            value,
          ) {
            FrontierDisplay.set(value);
            materialPerf.times = [];
            materialPerf.intervals = [];
            materialPerf.last = 0;
          },
          { filtering, scale },
        );
        await page.waitForTimeout(5000);
        const result = await page.evaluate(
          /* @function materialPerformance.measure — Inputs: none. Returns frame throughput and CPU/frame p95 after excluding five startup frames. Read-only; no GPU synchronization. */ function () {
            const s = materialPerf,
              frames = s.intervals.slice(5),
              cpu = s.times.slice(5),
              total = frames.reduce(
                /* @function materialPerformance.sum — Inputs: accumulated milliseconds and interval. Returns total sample duration, no outside mutation. */ (
                  a,
                  b,
                ) => a + b,
                0,
              );
            frames.sort(
              /* @function materialPerformance.frames — Inputs: interval pair. Returns numeric ordering for quantiles. */ (
                a,
                b,
              ) => a - b,
            );
            cpu.sort(
              /* @function materialPerformance.cpu — Inputs: submission pair. Returns numeric ordering for quantiles. */ (
                a,
                b,
              ) => a - b,
            );
            return {
              frames: frames.length,
              fps: (1000 * frames.length) / total,
              cpuP95Ms: cpu[Math.floor(cpu.length * 0.95)],
              frameP95Ms: frames[Math.floor(frames.length * 0.95)],
              modelBackend: s.game.modelDebug?.backend,
              visibleModels: s.game.modelDebug?.instances || 0,
            };
          },
        );
        assert(result.frames > 10);
        assert(
          result.visibleModels >= 1,
          "Override model must actually reach the visible renderer",
        );
        observations.push({ filtering, scale, ...result });
        console.log(filtering, scale, result.fps.toFixed(1) + " FPS");
      }
    fs.writeFileSync(
      "test-artifacts/native-material-performance-visible-final1524.json",
      JSON.stringify(
        {
          at: new Date().toISOString(),
          platform: "Desktop-launched Windows Electron",
          scope:
            "Persisted model texture/tint/UV override; six presets, 5 seconds each. CPU/frame measurements, not GPU elapsed time.",
          observations,
        },
        null,
        2,
      ),
    );
  } finally {
    await page.evaluate(
      /* @function materialPerformance.restore — Inputs: none. Returns nothing; restores original draw/display even after a failed sample, removing timing instrumentation. Does not modify authored records. */ function () {
        if (window.materialPerf) {
          if (materialPerf.player)
            Object.assign(materialPerf.game.player, materialPerf.player);
          if (materialPerf.camera)
            Object.assign(materialPerf.game.camera, materialPerf.camera);
          FrontierRender.draw = materialPerf.draw;
          FrontierDisplay.set({
            scale: materialPerf.display.scale,
            filtering: materialPerf.display.filtering,
          });
          delete window.materialPerf;
        }
      },
    );
    await browser.close();
  }
})().catch(
  /* @function materialPerformance.failure — Inputs: failed acceptance. Returns nothing; reports explicit error and marks nonzero process status. */ (
    error,
  ) => {
    console.error(error);
    process.exitCode = 1;
  },
);
