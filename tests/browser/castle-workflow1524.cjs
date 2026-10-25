const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
/* October 13, 2026: the inherited props-fixture explanation below is retained history and superseded for this specialized test. */
(/* @function propsTest.run — Inputs: none. Returns: promise. Authors actual supplied bed/painting onto real room geometry through pointer events, verifies independent collision/attachment and project round-trip validation. Closes browser on every outcome. */ /* @function castle_workflow1524.run — Inputs: none. Returns a promise. Verifies actual square/tower prefab placement and vertical connector stacking, matching roof, hollow centre, portable validation and Undo. Uses an isolated fixture and closes the browser on success or failure; no earlier tests or release data are overwritten. */ async function () {
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
    page.on(
      "console",
      /* @function castleWorkflow.console — Inputs: browser console record. Prints targeted fixture diagnostics; no app changes. */ function (
        m,
      ) {
        if (
          process.env.FRONTIER_DEBUG_TARGETS === "1" &&
          m.text().startsWith("ray hit")
        )
          console.log(m.text());
      },
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
    await page.locator("#buildingType").selectOption("floor");
    await page.locator("#building-width").fill("12");
    await page.locator("#building-depth").fill("12");
    await page.locator("#building-x").fill("9");
    await page.locator("#building-y").fill("9");
    await page.locator("#buildingPreview").click();
    await page.locator("#buildingConfirm").click();
    await page.locator("#propCastle").click();
    await page.waitForFunction(
      /* @function castleWorkflow.catalog — Inputs: none. Returns whether lazy castle room choice exists; no decoding. */ function () {
        return [...document.getElementById("propModel").options].some(
          /* @function castleWorkflow.option — Inputs: option. Returns exact room ID match. */ function (
            o,
          ) {
            return o.value === "castle-square-room-6m";
          },
        );
      },
    );
    /* @function castleWorkflow.place — Inputs: model ID and world-space surface target XYZ metres. Returns promise after real preview/commit clicks. Moves only author inspection camera; placement, snapping, IDs and history remain owned by production controls. Throws when projection/preview is unavailable. */
    async function place(modelId, point, elevation = 0) {
      await page.locator("#propModel").selectOption(modelId);
      await page.locator("#propMode").selectOption("floor");
      await page.locator("#propOffset").fill("0");
      await page.locator("#propElevation").fill(String(elevation));
      await page.locator("#propBegin").click();
      const click = await page.evaluate(
        /* @function castleWorkflow.project — Inputs: target XYZ metres. Returns CSS pointer coordinates from actual camera projection, after setting a downward author inspection view. Does not change authored transforms. */ function (
          p,
        ) {
          Object.assign(testGame.player, { x: p[0], y: p[1] - 3, z: p[2] + 4 });
          Object.assign(testGame.camera, {
            firstPerson: true,
            yaw: 0,
            pitch: -0.95,
          });
          const cam = FrontierRender.camera(testGame),
            q = FrontierRender.project(cam, ...p),
            r = document.getElementById("view").getBoundingClientRect();
          const ray = FrontierModelTargeting.ray(testGame, q.x, q.y);
          const hit = FrontierModelTargeting.roomGeometry(
            testGame,
            ray.origin,
            ray.direction,
          );
          console.log(
            "ray hit",
            JSON.stringify({
              q,
              ray,
              hit,
              r: { x: r.x, y: r.y, width: r.width, height: r.height },
            }),
          );
          if (!q) throw Error("Target is behind camera");
          return {
            x: r.left + (q.x * r.width) / testGame.viewWidth,
            y: r.top + (q.y * r.height) / 480,
          };
        },
        point,
      );
      if (process.env.FRONTIER_DEBUG_TARGETS === "1")
        console.log(
          "placement",
          modelId,
          click,
          await page.evaluate(
            /* @function castleWorkflow.inspect — Inputs: none. Returns author camera and room mode for failed targeting diagnostics; no mutation. */ function () {
              return {
                camera: FrontierRender.camera(testGame),
                mode: testGame.sourceWorld.interior.mode,
                primitives: testGame.sourceWorld.interior.primitives,
                faces: FrontierInterior.data(testGame.sourceWorld).faces.slice(
                  -2,
                ),
              };
            },
          ),
        );
      await page.mouse.click(click.x, click.y);
      assert(
        await page.locator("#propConfirm").isEnabled(),
        await page.locator("#propStatus").textContent(),
      );
      await page.locator("#propConfirm").click();
    }
    await place("castle-square-room-6m", [9, 9, 0]);
    const base = await page.evaluate(
      /* @function castleWorkflow.base — Inputs: none. Returns copy of first authored prefab event. */ function () {
        return structuredClone(testGame.sourceWorld.events[0]);
      },
    );
    await place(
      "castle-square-room-6m",
      [base.x, base.y, base.heightOffset || 0],
      3,
    );
    const stacked = await page.evaluate(
      /* @function castleWorkflow.stack — Inputs: none. Returns copied authored events with connector metadata for independent assertions. */ function () {
        return structuredClone(testGame.sourceWorld.events);
      },
    );
    assert.equal(stacked.length, 2);
    assert.equal(stacked[1].x, stacked[0].x);
    assert.equal(stacked[1].y, stacked[0].y);
    assert(
      Math.abs(stacked[1].heightOffset - stacked[0].heightOffset - 3) < 0.00001,
    );
    assert(
      stacked.every(
        /* @function castleWorkflow.geometry — Inputs: prefab event. Returns whether geometry collision and persistent connectors are present. */ function (
          e,
        ) {
          return (
            e.spatial.collisionMode === "mesh" && e.extensions.prefab.connectors
          );
        },
      ),
    );
    await page
      .getByRole("button", { name: "Undo change", exact: true })
      .click();
    assert.equal(
      await page.evaluate(
        /* @function castleWorkflow.undo — Inputs: none. Returns current authored event count. */ function () {
          return testGame.sourceWorld.events.length;
        },
      ),
      1,
    );
    await page
      .getByRole("button", { name: "Undo change", exact: true })
      .click();
    await place("castle-tower-section-6m", [9, 9, 0]);
    const tower = await page.evaluate(
      /* @function castleWorkflow.tower — Inputs: none. Returns copied first tower placement for connector targeting. */ function () {
        return structuredClone(testGame.sourceWorld.events[0]);
      },
    );
    await place("castle-tower-section-6m", [tower.x, tower.y, 0], 3);
    await place("castle-tower-roof-6m", [tower.x, tower.y, 0], 6);
    const towerProof = await page.evaluate(
      /* @function castleWorkflow.roundProof — Inputs: none. Returns saved story elevations and validated project connector records; queries actual tower triangles to ensure its center stays hollow. No rendering substitutions or authored-data changes. */ function () {
        const events = testGame.sourceWorld.events,
          first = events[0],
          model = FrontierModelLibrary.get(first.spatial.modelId),
          z =
            FrontierTerrain.height(testGame.sourceWorld, first.x, first.y) +
            (first.heightOffset || 0),
          matrix = FrontierModelEvents.matrix({ ...first, z });
        const hit = FrontierModelMeshCollision.query(
          model,
          matrix,
          [first.x, first.y, z + 0.5],
          [first.x, first.y, z + 2],
          [0.13, 0.13, 0.4],
        );
        const restored = FrontierMaps.validate(
          JSON.parse(JSON.stringify(testLibrary.snapshot())),
        );
        return {
          elevations: events.map(
            /* @function castleWorkflow.elevation — Inputs: authored event. Returns saved metre height offset; no mutation. */ function (
              e,
            ) {
              return e.heightOffset || 0;
            },
          ),
          hollow: hit === null,
          restored: restored.maps.find(
            /* @function castleWorkflow.map — Inputs: validated map. Returns active identity match. */ function (
              m,
            ) {
              return m.id === testLibrary.active;
            },
          ).world.events.length,
        };
      },
    );
    assert.equal(towerProof.restored, 3);
    assert(towerProof.hollow);
    assert(
      Math.abs(towerProof.elevations[1] - towerProof.elevations[0] - 3) <
        0.00001,
    );
    assert(
      Math.abs(towerProof.elevations[2] - towerProof.elevations[0] - 6) <
        0.00001,
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS actual square-room and hollow-tower stacking, matching tower roof, geometry defaults, validated save and Undo",
    );
  } finally {
    await browser.close();
  }
})().catch(
  /* @function castleWorkflow.failure — Inputs: error. Reports explicit failed acceptance and exit status without retries. */ function (
    error,
  ) {
    console.error(error);
    process.exitCode = 1;
  },
);
