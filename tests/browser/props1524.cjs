const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
(/* @function propsTest.run — Inputs: none. Returns: promise. Authors actual supplied bed/painting onto real room geometry through pointer events, verifies independent collision/attachment and project round-trip validation. Closes browser on every outcome. */ async function () {
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
    await page.locator("#buildingType").selectOption("shell");
    await page.locator("#building-width").fill("6");
    await page.locator("#building-depth").fill("6");
    await page.locator("#buildingPreview").click();
    await page.locator("#buildingConfirm").click();
    await page.locator("#propSupplied").click();
    await page.waitForFunction(
      /* @function propsTest.catalogReady — Inputs: none. Returns: whether the supplied bed choice exists. No asset decoding or scene changes. */ function () {
        return Array.from(document.getElementById("propModel").options).some(
          /* @function propsTest.bedChoice — Inputs: option. Returns: supplied bed ID match. */ function (
            o,
          ) {
            return o.value === "supplied-antique-box-bed-v3";
          },
        );
      },
    );
    await page
      .locator("#propModel")
      .selectOption("supplied-antique-box-bed-v3");
    await page.locator("#propBegin").click();
    const floorPoint = await page.evaluate(
      /* @function propsTest.floorTarget — Inputs: none. Returns: CSS point hitting the actual floor. Sets a real first-person author camera inside the room, then finds an unoccluded floor ray away from HUD controls. Throws if no actual visible floor exists. */ function () {
        testGame.camera.firstPerson = true;
        testGame.camera.pitch = -0.5;
        testGame.camera.yaw = 0;
        const rect = document.getElementById("view").getBoundingClientRect();
        for (let y = 200; y < 390; y += 15)
          for (let x = 390; x < 500; x += 15) {
            const ray = FrontierModelTargeting.ray(testGame, x, y),
              hit = FrontierModelTargeting.roomGeometry(
                testGame,
                ray.origin,
                ray.direction,
              );
            if (hit?.faceId.endsWith("-floor"))
              return {
                x: rect.left + (x * rect.width) / testGame.viewWidth,
                y: rect.top + (y * rect.height) / 480,
              };
          }
        throw Error("No visible floor target");
      },
    );
    await page.mouse.click(floorPoint.x, floorPoint.y);
    assert(await page.locator("#propConfirm").isEnabled());
    await page.locator("#propConfirm").click();
    assert.equal(
      await page.evaluate(
        /* @function propsTest.bedPlaced — Inputs: none. Returns: authoritative placed model ID from project snapshot. */ function () {
          return testLibrary.snapshot().maps.find(
            /* @function propsTest.activeBedMap — Inputs: map. Returns: active ID match. */ function (
              m,
            ) {
              return m.id === testLibrary.active;
            },
          ).world.events[0].spatial.modelId;
        },
      ),
      "supplied-antique-box-bed-v3",
    );
    await page.locator("#propModel").selectOption("supplied-painting-one");
    await page.locator("#propMode").selectOption("wall");
    await page.locator("#propCollision").uncheck();
    await page.locator("#propScale").fill("0.2");
    await page.locator("#propBegin").click();
    const modelWallPoint = await page.evaluate(
      /* @function propsTest.modelWallTarget — Inputs: none. Returns an actual CSS ray hit on the upright bed model's vertical geometry before any room wall. Reads production triangles and transforms, changes inspection camera only, and throws if no visible surface exists. Never injects attachment metadata. */ function () {
        const host = testGame.sourceWorld.events[0],
          model = FrontierModelLibrary.get(host.spatial.modelId),
          triangles = [];
        const z =
          FrontierTerrain.height(testGame.sourceWorld, host.x, host.y) +
          (host.heightOffset || 0);
        FrontierModelScene.triangles(
          model,
          model.scene,
          FrontierModelEvents.matrix({ ...host, z }),
          /* @function propsTest.captureHostTriangle — Inputs: world triangle. Returns array length; retains this fixture's real geometry for read-only pointer targeting. */ function (
            points,
          ) {
            return triangles.push(points);
          },
        );
        testGame.camera.yaw = Math.atan2(
          host.x - testGame.player.x,
          host.y - testGame.player.y,
        );
        testGame.camera.pitch = -0.45;
        const rect = document.getElementById("view").getBoundingClientRect();
        for (let y = 180; y < 350; y += 8)
          for (let x = 240; x < 480; x += 8) {
            const ray = FrontierModelTargeting.ray(testGame, x, y),
              room = FrontierModelTargeting.roomGeometry(
                testGame,
                ray.origin,
                ray.direction,
              );
            let nearest = Infinity,
              vertical = false;
            for (const points of triangles) {
              const distance = FrontierModelScene.rayTriangle(
                ray.origin,
                ray.direction,
                points,
              );
              if (distance === null || distance < 0.01 || distance >= nearest)
                continue;
              nearest = distance;
              const a = points[0],
                b = points[1],
                c = points[2],
                u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]],
                v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]],
                nx = u[1] * v[2] - u[2] * v[1],
                ny = u[2] * v[0] - u[0] * v[2],
                nz = u[0] * v[1] - u[1] * v[0];
              vertical = Math.abs(nz) / Math.hypot(nx, ny, nz) < 0.01;
            }
            if (vertical && (!room || nearest < room.distance))
              return {
                x: rect.left + (x * rect.width) / testGame.viewWidth,
                y: rect.top + (y * rect.height) / 480,
              };
          }
        throw Error("No visible vertical imported-model surface");
      },
    );
    await page.mouse.click(modelWallPoint.x, modelWallPoint.y);
    assert(await page.locator("#propConfirm").isEnabled());
    await page.locator("#propConfirm").click();
    assert.equal(
      await page.evaluate(
        /* @function propsTest.modelParentSaved — Inputs: none. Returns actual committed attachment ownership from project snapshot. */ function () {
          return testGame.sourceWorld.events[1].extensions?.placement
            ?.parentKind;
        },
      ),
      "model",
    );
    await page.locator("#propScale").fill("1");
    await page.locator("#propModel").selectOption("supplied-painting-bosch");
    await page.locator("#propMode").selectOption("wall");
    await page.locator("#propCollision").uncheck();
    await page.locator("#propBegin").click();
    const wallPoint = await page.evaluate(
      /* @function propsTest.wallTarget — Inputs: none. Returns: CSS point hitting a visible room wall away from placed furniture. Sets real author camera yaw/pitch; throws if wall targeting is unavailable. */ function () {
        testGame.camera.pitch = 0;
        testGame.camera.yaw = Math.PI / 2;
        const rect = document.getElementById("view").getBoundingClientRect();
        for (let y = 70; y < 230; y += 15)
          for (let x = 150; x < 500; x += 15) {
            const ray = FrontierModelTargeting.ray(testGame, x, y),
              hit = FrontierModelTargeting.roomGeometry(
                testGame,
                ray.origin,
                ray.direction,
              );
            if (hit?.faceId.endsWith("-east"))
              return {
                x: rect.left + (x * rect.width) / testGame.viewWidth,
                y: rect.top + (y * rect.height) / 480,
              };
          }
        throw Error("No visible wall target");
      },
    );
    await page.mouse.click(wallPoint.x, wallPoint.y);
    assert(await page.locator("#propConfirm").isEnabled());
    await page.locator("#propConfirm").click();
    const evidence = await page.evaluate(
      /* @function propsTest.roundTrip — Inputs: none. Returns: actual project validation evidence for two models and persisted wall attachment. JSON round-trip mirrors portable export encoding, then uses the production validator. */ function () {
        const restored = FrontierMaps.validate(
            JSON.parse(JSON.stringify(testLibrary.snapshot())),
          ),
          map = restored.maps.find(
            /* @function propsTest.activePaintMap — Inputs: map. Returns: active ID match. */ function (
              m,
            ) {
              return m.id === restored.active;
            },
          ),
          painting = map.world.events.find(
            /* @function propsTest.painting — Inputs: event. Returns: supplied painting model match. */ function (
              e,
            ) {
              return e.spatial?.modelId === "supplied-painting-bosch";
            },
          );
        return {
          count: map.world.events.length,
          collision: painting?.spatial.collisionMode,
          parent: painting?.extensions.placement?.parentId,
          models: restored.models.length,
        };
      },
    );
    await page.waitForFunction(/* @function propsTest.cutoutGpuReady — Inputs: none. Returns actual supplied painting texture decode plus GPU model backend readiness. Fails if one transparent OPAQUE painting demotes the whole furnished scene to CPU; no forced backend override. */ function(){return FrontierModelRenderer.prepare(FrontierModelLibrary.get('supplied-painting-one')).ready&&testGame.modelDebug?.backend==='GPU opaque color / CPU shared depth';});
    assert.equal(evidence.count, 3);
    assert.equal(evidence.collision, "none");
    assert(evidence.parent.endsWith("-east"));
    assert(evidence.models >= 2);
    assert.deepEqual(errors, []);
    await page.locator("#propTransformTools summary").click();
    await page.locator("#propEditPlaced").check();
    const placedBed = await page.evaluate(
      /* @function propsTest.bedBeforeTransforms — Inputs: none. Returns detached original authored bed for transform/undo comparison. */ function () {
        return structuredClone(testGame.sourceWorld.events[0]);
      },
    );
    await page.locator("#propPlacedSelection").selectOption(placedBed.id);
    await page.evaluate(
      /* @function propsTest.transformInspectionCamera — Inputs: none. Returns nothing; aims existing author camera at selected bed so actual gizmo endpoints are onscreen. Does not alter geometry or actor placement. */ function () {
        const host = testGame.sourceWorld.events[0];
        testGame.camera.yaw = Math.atan2(
          host.x - testGame.player.x,
          host.y - testGame.player.y,
        );
        testGame.camera.pitch = -0.35;
        testGame.camera.firstPerson = false;
        testGame.camera.distance = 5;
      },
    );
    await page.locator("#propPlacedSelection").selectOption("");
    const scenePick=await page.evaluate(/* @function propsTest.visibleModelPick — Inputs: bed identity. Returns CSS coordinates whose production nearest-geometry pick resolves to that model. Read-only scene query; does not set selection or change geometry. Throws if no visible model pixel is available. */ function(id){const rect=document.getElementById('view').getBoundingClientRect();for(let y=60;y<340;y+=8)for(let x=100;x<540;x+=8){const hit=FrontierModelTargeting.pick(testGame,x,y,testGame.sceneEvents||[],true);if((hit?.eventId||hit?.id)===id)return {x:rect.left+x*rect.width/testGame.viewWidth,y:rect.top+y*rect.height/480};}throw Error('No selectable model surface');},placedBed.id);
    await page.mouse.click(scenePick.x,scenePick.y);assert.equal(await page.locator("#propPlacedSelection").inputValue(),placedBed.id,'Actual scene click selects model ahead of room geometry');
    /* @function propsTest.dragModelHandle — Inputs: local/world axis index. Returns promise; derives actual rendered one-metre handle from production bounds/transform/camera and drags its screen vector. No direct geometry edits. */
    async function dragModelHandle(index) {
      // October 13: selecting a long property panel can scroll the native page.
      // Bring the actual scene back into view before deriving pointer coordinates.
      await page.locator('#view').scrollIntoViewIfNeeded();
      await page.waitForTimeout(80);
      const handle = await page.evaluate(
        /* @function propsTest.modelHandlePoint — Inputs: axis index. Returns CSS endpoint/vector for selected model's current real gizmo. Read-only production math. */ function (
          index,
        ) {
          const event = testGame.sourceWorld.events.find(
              /* @function propsTest.handleModelIdentity — Inputs: event. Returns selected authored model identity match. */ function (
                candidate,
              ) {
                return (
                  candidate.id ===
                  document.getElementById("propPlacedSelection").value
                );
              },
            ),
            asset = FrontierModelLibrary.get(event.spatial.modelId),
            bounds = asset.scene.bounds,
            transform = {
              position: [
                event.x,
                event.y,
                FrontierTerrain.height(testGame.sourceWorld, event.x, event.y) +
                  (event.heightOffset || 0),
              ],
              rotation: event.spatial.rotation,
              scale: event.spatial.scale,
            },
            matrix = FrontierModelTransform.matrix(transform),
            center = FrontierModelTransform.vector(matrix, [
              (bounds.min[0] + bounds.max[0]) / 2,
              (bounds.min[1] + bounds.max[1]) / 2,
              (bounds.min[2] + bounds.max[2]) / 2,
            ]),
            mode = document.getElementById("propTransformMode").value,
            unit = [0, 0, 0];
          unit[index] = 1;
          const local =
              mode === "resize" ||
              (mode === "move" &&
                document.getElementById("propTransformSpace").value ===
                  "local"),
            direction = local
              ? FrontierModelTransform.vector(
                  FrontierModelTransform.matrix({
                    rotation: transform.rotation,
                  }),
                  unit,
                  0,
                )
              : unit,
            cam = FrontierRender.camera(testGame),
            a = FrontierRender.project(cam, ...center),
            b = FrontierRender.project(
              cam,
              center[0] + direction[0],
              center[1] + direction[1],
              center[2] + direction[2],
            ),
            rect = document.getElementById("view").getBoundingClientRect();
          if (!a || !b) throw Error("Model gizmo outside camera");
          return {
            x: rect.left + (b.x * rect.width) / testGame.viewWidth,
            y: rect.top + (b.y * rect.height) / 480,
            dx: ((b.x - a.x) * rect.width) / testGame.viewWidth,
            dy: ((b.y - a.y) * rect.height) / 480,
          };
        },
        index,
      );
      await page.mouse.move(handle.x, handle.y);
      await page.mouse.down();
      await page.mouse.move(handle.x + handle.dx, handle.y + handle.dy, {
        steps: 5,
      });
      await page.mouse.up();
    }
    await dragModelHandle(2);
    assert(
      Math.abs(
        (await page.evaluate(
          /* @function propsTest.movedBedHeight — Inputs: none. Returns actual authored bed elevation after pointer drag. */ function () {
            return testGame.sourceWorld.events[0].heightOffset;
          },
        )) -
          placedBed.heightOffset -
          1,
      ) < 0.001,
    );
    await page
      .getByRole("button", { name: "Undo change", exact: true })
      .click();
    await page.locator("#propTransformMode").selectOption("rotate");
    await dragModelHandle(2);
    assert(
      Math.abs(
        (await page.evaluate(
          /* @function propsTest.turnedBedYaw — Inputs: none. Returns authored yaw after actual turn-handle drag. */ function () {
            return testGame.sourceWorld.events[0].spatial.rotation[2];
          },
        )) -
          placedBed.spatial.rotation[2] -
          30,
      ) < 0.001,
    );
    await page
      .getByRole("button", { name: "Undo change", exact: true })
      .click();
    await page.locator("#propTransformMode").selectOption("resize");
    await dragModelHandle(0);
    assert(
      await page.evaluate(
        /* @function propsTest.resizedBed — Inputs: original scale. Returns whether actual local-X resize increased only selected authored scale component. */ function (
          scale,
        ) {
          const now = testGame.sourceWorld.events[0].spatial.scale;
          return (
            now[0] > scale[0] && now[1] === scale[1] && now[2] === scale[2]
          );
        },
        placedBed.spatial.scale,
      ),
    );
    await page
      .getByRole("button", { name: "Undo change", exact: true })
      .click();
    await page.locator("#propDuplicatePlaced").click();
    assert.equal(await page.locator("#propPlacedSelection option").count(), 5);
    await page
      .getByRole("button", { name: "Undo change", exact: true })
      .click();
    await page.locator("#propPlacedSelection").selectOption(placedBed.id);
    await page.locator("#propDeletePlaced").click();
    assert.equal(await page.locator("#propPlacedSelection option").count(), 3);
    await page
      .getByRole("button", { name: "Undo change", exact: true })
      .click();
    await page.locator("#propEditPlaced").uncheck();
    await page.evaluate(
      /* @function propsTest.restoreLightingInspection — Inputs: none. Returns nothing; restores historical lighting test camera after transform workflows. No authored geometry edits. */ function () {
        testGame.camera.firstPerson = true;
        testGame.camera.pitch = 0;
        testGame.camera.yaw = Math.PI / 2;
      },
    );
    await page.evaluate(
      /* @function propsTest.openDefaultDraft — Inputs: none. Returns: nothing. Opens a fresh event's actual model draft UI and retains only its accepted spatial result. Does not insert a test event into the cell. */ function () {
        const event = FrontierEvents.create("default-collision-test", 20, 20);
        FrontierModelEditor.open(
          event,
          [event],
          /* @function propsTest.acceptDefaultDraft — Inputs: validated spatial draft. Returns: nothing. Retains accepted result for schema/UI default evidence. */ function (
            value,
          ) {
            window.defaultCollisionDraft = value;
          },
        );
      },
    );
    await page.getByLabel("Visual", { exact: true }).selectOption("model");
    await page
      .getByLabel("Shared model", { exact: true })
      .selectOption("supplied-antique-box-bed-v3");
    assert.equal(
      await page.getByLabel("Collision", { exact: true }).inputValue(),
      "mesh",
    );
    await page
      .getByRole("button", { name: "Apply to event draft", exact: true })
      .click();
    assert.equal(
      await page.evaluate(
        /* @function propsTest.defaultCollisionAccepted — Inputs: none. Returns: accepted collision mode from real draft UI. No mutation. */ function () {
          return defaultCollisionDraft.collisionMode;
        },
      ),
      "mesh",
    );
    await page.waitForTimeout(100);
    const unlit = await page.evaluate(
      /* @function propsTest.unlitPixels — Inputs: none. Returns: mean RGB over opaque actual GPU room pixels. Test-only readback verifies shading output rather than source settings. */ function () {
        const canvas = document.createElement("canvas");
        canvas.width = testGeometry.canvas.width;
        canvas.height = testGeometry.canvas.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(testGeometry.canvas, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let sum = 0,
          count = 0;
        for (let i = 0; i < data.length; i += 4)
          if (data[i + 3] > 0) {
            sum += data[i] + data[i + 1] + data[i + 2];
            count += 3;
          }
        return sum / count;
      },
    );
    await page.locator("#localLightTools").evaluate(
      /* @function propsTest.openLighting — Inputs: lighting fieldset. Returns: nothing. Opens actual disclosure containing light parameters. */ function (
        fieldset,
      ) {
        fieldset.parentElement.open = true;
      },
    );
    await page.locator("#localLightingEnabled").check();
    await page.locator("#localAmbient").fill("0.1");
    await page.locator("#localApplyCell").click();
    await page.waitForFunction(
      /* @function propsTest.darkFrameReady — Inputs: none. Returns: whether actual radius lighting and GPU room backend are active. A failed shader/fallback cannot satisfy this evidence. */ function () {
        return (
          testGame.lightFrame?.ambient === 0.1 &&
          testGame.roomBackend === "GPU color / CPU shared depth"
        );
      },
    );
    await page.waitForTimeout(100);
    const dark = await page.evaluate(
      /* @function propsTest.darkPixels — Inputs: none. Returns: mean actual GPU room RGB under ambient-only lighting. Readback is test-only and excluded from performance checks. */ function () {
        const canvas = document.createElement("canvas");
        canvas.width = testGeometry.canvas.width;
        canvas.height = testGeometry.canvas.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(testGeometry.canvas, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let sum = 0,
          count = 0;
        for (let i = 0; i < data.length; i += 4)
          if (data[i + 3] > 0) {
            sum += data[i] + data[i + 1] + data[i + 2];
            count += 3;
          }
        return sum / count;
      },
    );
    assert(
      dark < unlit * 0.2,
      "GPU room pixels actually darken with ambient lighting: " +
        dark +
        " versus " +
        unlit,
    );
    await page.locator("#localAddLight").click();
    await page.waitForFunction(
      /* @function propsTest.sourceFrameReady — Inputs: none. Returns: whether actual placed source reached the renderer. */ function () {
        return testGame.lightFrame?.lights.length === 1;
      },
    );
    await page.waitForTimeout(100);
    const illuminated = await page.evaluate(
      /* @function propsTest.illuminatedPixels — Inputs: none. Returns: mean actual GPU RGB with placed radius source. Test-only readback checks world-space illumination increases brightness. */ function () {
        const canvas = document.createElement("canvas");
        canvas.width = testGeometry.canvas.width;
        canvas.height = testGeometry.canvas.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(testGeometry.canvas, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let sum = 0,
          count = 0;
        for (let i = 0; i < data.length; i += 4)
          if (data[i + 3] > 0) {
            sum += data[i] + data[i + 1] + data[i + 2];
            count += 3;
          }
        return sum / count;
      },
    );
    assert(illuminated > dark, "Placed light changes actual GPU room output");
    assert.deepEqual(errors, []);
    const roundGpu = await page.evaluate(
      /* @function propsTest.roundGpuPixels — Inputs: none. Returns inside/outside lighting pixels from an isolated actual GPU context. A tiny test triangle carries a fixed world sample to exercise round shader blocking precisely. Readback is validation-only, never a performance measurement; owned context is disposed in finally. */ function () {
        const gpu = FrontierGeometryGPU.create(8, 8, 8, 8),
          image = {
            width: 1,
            height: 1,
            data: new Uint8Array([255, 255, 255, 255]),
          };
        const vertices = [];
        for (const [x, y] of [
          [0, 0],
          [8, 0],
          [0, 8],
        ])
          vertices.push({ x, y, depth: 10, u: 0, v: 0, world: [10, 10, 1] });
        const triangle = { image, opaque: true, vertices };
        const blocker = {
            shape: "round",
            x: 10,
            y: 10,
            z: 0,
            w: 8,
            d: 8,
            h: 3,
            yaw: 0,
            radius: 4,
            innerRadius: 3.8,
            arcStart: 0,
            arcSweep: Math.PI * 2,
          },
          values = [];
        try {
          for (const x of [12, 15]) {
            gpu.draw([triangle], true, {
              ambient: 0.1,
              steps: 0,
              lights: [
                {
                  x,
                  y: 10,
                  z: 1,
                  radius: 10,
                  rgb: [1, 1, 1],
                  intensity: 1,
                  falloff: 2,
                },
              ],
              blockers: [blocker],
            });
            const pixel = new Uint8Array(4);
            gpu.gl.readPixels(
              2,
              5,
              1,
              1,
              gpu.gl.RGBA,
              gpu.gl.UNSIGNED_BYTE,
              pixel,
            );
            values.push(Array.from(pixel));
          }
          return values;
        } finally {
          gpu.destroy();
        }
      },
    );
    assert(
      roundGpu[0][0] > 150 && roundGpu[0][3] === 255,
      "GPU light reaches hollow center from inside",
    );
    assert(
      roundGpu[1][0] < 30 && roundGpu[1][3] === 255,
      "GPU round wall blocks exterior light",
    );
    await page.locator("#propCastle").click();
    await page.waitForFunction(
      /* @function propsTest.castleChoicesReady — Inputs: none. Returns whether the actual asynchronous catalog handler populated the roof option. Polls real DOM completion rather than guessing a load delay. */ function () {
        return (
          document.querySelectorAll('#propModel option[value^="castle-"]')
            .length === 9
        );
      },
    );
    assert.equal(
      await page.locator('#propModel option[value^="castle-"]').count(),
      9,
      "Lazy castle catalog exposes all nine authored models",
    );
    await page
      .locator("#propModel")
      .selectOption("castle-castle-gable-roof-6m");
    assert.equal(
      await page.locator("#propCollision").isChecked(),
      true,
      "New structural choice restores geometry default after painting override",
    );
    await page.locator("#propBegin").click();
    assert(
      await page.evaluate(
        /* @function propsTest.castleDecoded — Inputs: none. Returns whether production library decoded only the selected roof asset; no fixture injection. */ function () {
          return !!FrontierModelLibrary.get("castle-castle-gable-roof-6m")
            ?.scene;
        },
      ),
    );
    assert.equal(
      await page.evaluate(
        /* @function propsTest.castleNotDecoded — Inputs: none. Returns whether unselected tower remains undecoded; proves catalog load does not import all runtime assets. */ function () {
          return !!FrontierModelLibrary.get("castle-tower-section-6m");
        },
      ),
      false,
    );
    await page.locator("#propCancel").click();
    await page.screenshot({ path: "test-artifacts/props1524.png" });
    console.log(
      "PASS actual supplied bed/floor placement, painting/wall attachment, independent collision and validated project round-trip",
    );
  } finally {
    await browser.close();
  }
})().catch(
  /* @function propsTest.failure — Inputs: rejected error. Returns: nothing. Reports failure with unsuccessful exit status; no acceptance is skipped. */ function (
    error,
  ) {
    console.error(error);
    process.exitCode = 1;
  },
);
