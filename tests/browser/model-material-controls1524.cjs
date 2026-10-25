const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
(/* @function modelMaterialControls.run — Inputs: none. Returns: promise. Imports a normal model event, edits slot fields through production UI, checks portable metadata and CPU/real-GPU rendered tint, and verifies Undo. Source GLB bytes/geometry are unchanged; browser is isolated and closes on every outcome. */ async function () {
  const browser = await chromium.launch(launch);
  try {
    const page = await browser.newPage(),
      errors = [];
    page.on(
      "pageerror",
      /* @function modelMaterialControls.error — Inputs: browser exception. Returns: array length; retains failures without suppression. */ (
        error,
      ) => errors.push(error.message),
    );
    await page.goto(
      "file:///" + path.resolve("index.html").replaceAll("\\", "/"),
    );
    await page.waitForSelector("#propEditMaterials", { state: "attached" });
    await page.evaluate(
      /* @function modelMaterialControls.observe — Inputs: none. Returns: nothing; wraps normal drawing to retain active game for fixture/read-only evidence. Does not change rendering. */ () => {
        const draw = FrontierRender.draw;
        FrontierRender.draw =
          /* @function modelMaterialControls.draw — Inputs: renderer arguments. Returns: original draw result, retaining actual game only. */ function (
            ...args
          ) {
            window.materialControlGame = args[1];
            return draw.apply(this, args);
          };
      },
    );
    await page.waitForFunction(
      /* @function modelMaterialControls.ready — Inputs: none. Returns: actual draw availability. */ () =>
        !!window.materialControlGame,
    );
    const fixture = await page.evaluate(
      /* @function modelMaterialControls.fixture — Inputs: none. Returns: production-validated room/event using an already installed material-bearing model. No source asset mutation; selects a real existing UV slot. */ () => {
        let asset, modelId;
        for (const entry of FrontierModelLibrary.list()) {
          const candidate = FrontierModelLibrary.get(entry.id);
          if (
            candidate?.json.materials?.length &&
            candidate.meshes.some(
              /* @function modelMaterialControls.uvMesh — Inputs: primitive list. Returns: whether slot zero has real source UVs. Read-only asset inspection. */ (
                primitives,
              ) =>
                primitives.some(
                  /* @function modelMaterialControls.uvPrimitive — Inputs: primitive. Returns: textured slot-zero compatibility without source mutation. */ (
                    primitive,
                  ) => primitive.material === 0 && !!primitive.uv,
                ),
            )
          ) {
            asset = candidate;
            modelId = entry.id;
            break;
          }
        }
        if (!asset) throw Error("No material-bearing fixture model.");
        const event = FrontierEvents.create("material-instance", 8, 8);
        event.name = "Material instance";
        event.spatial = FrontierModelEvents.validate({
          visual: "model",
          modelId,
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        });
        return FrontierWorld.validate({
          ...materialControlGame.sourceWorld,
          seed: "MATERIAL-CONTROLS-1524",
          objects: [],
          events: [event],
        });
      },
    );
    await page.locator("#import").setInputFiles({
      name: "material-room.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(fixture)),
    });
    await page.waitForFunction(
      /* @function modelMaterialControls.imported — Inputs: none. Returns: actual coordinator adoption, read-only. */ () =>
        materialControlGame.sourceWorld.seed === "MATERIAL-CONTROLS-1524",
    );
    if (await page.locator("#editor").isHidden())
      await page.locator("#workspaceToggle").click();
    await page.locator("#propTransformTools > summary").click();
    await page
      .locator("#propPlacedSelection")
      .selectOption("material-instance");
    await page
      .locator("#propEditMaterials")
      .evaluate(
        /* @function modelMaterialControls.open — Inputs: selected-material button. Returns: nothing; opens its production modal handler regardless of editor grouping. */ (
          button,
        ) => button.click(),
      );
    const dialog = page.locator("#modelMaterialDialog");
    await dialog.waitFor({ state: "visible" });
    const row = dialog
      .getByLabel("Override slot 0", { exact: true })
      .locator("xpath=ancestor::details[1]");
    await row.getByLabel("Override slot 0", { exact: true }).check();
    await row.getByLabel("Override tint", { exact: true }).check();
    await row.getByLabel("Slot tint", { exact: true }).fill("#00ff00");
    await row.getByLabel("Horizontal repeats", { exact: true }).fill("2");
    await row
      .getByLabel("Texture rotation (degrees)", { exact: true })
      .fill("90");
    const white = await page.evaluate(
      /* @function modelMaterialControls.whiteFixture — Inputs: none. Returns: a tiny generated white PNG fixture URI for sampler acceptance; no user image is edited or read. */ () => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 2;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 2, 2);
        return canvas.toDataURL("image/png");
      },
    );
    await row
      .getByLabel("Import slot image (PNG/JPEG/WebP)", { exact: true })
      .setInputFiles({
        name: "white-fixture.png",
        mimeType: "image/png",
        buffer: Buffer.from(white.split(",")[1], "base64"),
      });
    await page.waitForFunction(
      /* @function modelMaterialControls.imageReady — Inputs: none. Returns: whether asynchronous import cleared the slot picker and selected its draft; no mutation. */ () =>
        document.querySelector("#modelMaterialDialog input[type=file]")
          .value === "",
    );
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    if (await dialog.isVisible())
      assert.fail(await dialog.locator("[role=status]").innerText());
    const saved = await page.locator("#exportProject").evaluate(
      /* @function modelMaterialControls.export — Inputs: ordinary project export button. Returns: parsed production Blob, temporarily observing object URL creation then restoring it in finally. No authored mutation. */ async (
        button,
      ) => {
        const original = URL.createObjectURL;
        let captured;
        URL.createObjectURL =
          /* @function modelMaterialControls.blob — Inputs: production export Blob. Returns: ordinary object URL while retaining data for inspection. */ (
            blob,
          ) => {
            captured = blob;
            return original.call(URL, blob);
          };
        try {
          button.click();
          return JSON.parse(await captured.text());
        } finally {
          URL.createObjectURL = original;
        }
      },
    );
    const event = saved.maps.find(
      /* @function modelMaterialControls.active — Inputs: map record. Returns: active identity match, read-only. */ (
        map,
      ) => map.id === saved.active,
    ).world.events[0];
    assert.equal(event.spatial.materials[0].repeatU, 2);
    assert.equal(event.spatial.materials[0].color, "#00ff00");
    assert(event.spatial.materials[0].texture.startsWith("data:image/png;"));
    await page.waitForFunction(
      /* @function modelMaterialControls.decoded — Inputs: none. Returns: actual shared replacement image readiness, starting its normal lazy load if needed. */ () => {
        const texture =
          materialControlGame.sourceWorld.events[0].spatial.materials[0]
            .texture;
        return !!FrontierRoomSurfaces.get(texture);
      },
    );
    const pixels = await page.evaluate(
      /* @function modelMaterialControls.renderPixels — Inputs: none. Returns: green-pixel counts from actual CPU and isolated door GPU renderer paths using the same model override. Prepares existing assets and samples completed rendering only; no fake color or GPU output. Source geometry/collision remain unchanged. */ async () => {
        const event = materialControlGame.sourceWorld.events[0],
          entity = {
            id: event.id,
            x: 0,
            y: 0,
            z: 0,
            ...FrontierModelEvents.entityFields(event.spatial),
          },
          asset = FrontierModelLibrary.get(entity.modelId);
        await FrontierModelRenderer.prepare(asset).promise;
        const bounds = asset.scene.bounds,
          center = bounds.min.map(
            /* @function modelMaterialControls.center — Inputs: bound coordinate/index. Returns: source-space midpoint, no mutation. */ (
              v,
              i,
            ) => (v + bounds.max[i]) / 2,
          ),
          extent = Math.max(
            ...bounds.max.map(
              /* @function modelMaterialControls.extent — Inputs: maximum coordinate/index. Returns: axis extent in model metres. */ (
                v,
                i,
              ) => v - bounds.min[i],
            ),
            0.1,
          ),
          camera = {
            x: center[0],
            y: bounds.min[1] - extent * 2,
            z: center[2],
            yaw: 0,
            pitch: 0,
            cx: 320,
            cy: 240,
          },
          result = {};
        for (const gpu of [false, true]) {
          const canvas = document.createElement("canvas");
          canvas.width = 640;
          canvas.height = 480;
          const ctx = canvas.getContext("2d");
          ctx.doorGPU = gpu;
          ctx.terrainDepth = {
            w: 320,
            h: 240,
            values: new Float32Array(320 * 240),
          };
          FrontierModelRenderer.draw(ctx, { viewWidth: 640 }, camera, [entity]);
          if (gpu && !FrontierModelRenderer.gpuDiagnostics(ctx).preview)
            throw Error("GPU override acceptance cannot use CPU fallback.");
          const data = ctx.getImageData(0, 0, 640, 480).data;
          let green = 0;
          for (let i = 0; i < data.length; i += 4)
            if (
              data[i] < 5 &&
              data[i + 1] > 200 &&
              data[i + 2] < 5 &&
              data[i + 3] > 200
            )
              green++;
          result[gpu ? "gpu" : "cpu"] = green;
        }
        return result;
      },
    );
    assert(pixels.cpu > 100, "CPU material tint must be rendered");
    assert(pixels.gpu > 100, "GPU material tint must be rendered");
    await page
      .locator("#undo")
      .evaluate(
        /* @function modelMaterialControls.undo - Inputs: actual Undo button. Returns: nothing; reverts the slot metadata transaction through normal history. */ (
          button,
        ) => button.click(),
      );
    await page.waitForFunction(
      /* @function modelMaterialControls.undoFrame - Inputs: none. Returns whether a subsequent normal renderer frame exposes the restored authored slot state. Native GPU scheduling may retain the previous observed game until the next draw; this waits for actual state rather than weakening Undo acceptance. */ () =>
        materialControlGame.sourceWorld.events[0].spatial.materials ===
        undefined,
    );
    assert.equal(
      await page.evaluate(
        /* @function modelMaterialControls.undone - Inputs: none. Returns whether normal Undo restored original slot inheritance on the current authored instance. Read-only. */ () =>
          materialControlGame.sourceWorld.events[0].spatial.materials ===
          undefined,
      ),
      true,
    );
    // October 13: exercise the real portable merge and local-storage reload after
    // Undo acceptance. Restore the exported override through the ordinary importer.
    await page.locator("#importProject").setInputFiles({
      name: "material-roundtrip.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(saved)),
    });
    await page.waitForFunction(
      /* @function modelMaterialControls.importComplete — Inputs: none. Returns whether production project merging completed; no state mutation. */ () =>
        document.getElementById("message").textContent ===
        "Imported maps added to this library.",
    );
    await page.waitForFunction(
      /* @function modelMaterialControls.persisted — Inputs: none. Returns actual local-save completion, so reload cannot race the asynchronous store. */ () =>
        document.getElementById("mapSaveStatus").textContent ===
        "Maps saved on this computer.",
    );
    await page.reload();
    await page.waitForFunction(
      /* @function modelMaterialControls.reloadComplete — Inputs: none. Returns whether the reloaded active map shows the authored fixture seed. Normal startup owns all adoption. */ () =>
        document.getElementById("seed").value === "MATERIAL-CONTROLS-1524",
    );
    const reloaded = await page.locator("#exportProject").evaluate(
      /* @function modelMaterialControls.reloadExport — Inputs: bound export button. Returns parsed normal export Blob after persisted startup. Temporarily observes object URL creation; restores the function on every outcome. */ async (
        button,
      ) => {
        const original = URL.createObjectURL;
        let blob;
        URL.createObjectURL =
          /* @function modelMaterialControls.reloadBlob — Inputs: exported Blob. Returns normal object URL while retaining bytes for read-only acceptance. */ (
            value,
          ) => {
            blob = value;
            return original.call(URL, value);
          };
        try {
          button.click();
          return JSON.parse(await blob.text());
        } finally {
          URL.createObjectURL = original;
        }
      },
    );
    const restored = reloaded.maps.find(
      /* @function modelMaterialControls.reloadActive — Inputs: map. Returns active identity match; no mutation. */ (
        map,
      ) => map.id === reloaded.active,
    ).world.events[0];
    assert.deepEqual(restored.spatial.materials, event.spatial.materials);
    assert.deepEqual(errors, []);
    console.log(
      "PASS model slot controls, embedded texture, portable UV/tint metadata, CPU/GPU rendered override and import/local reload",
      JSON.stringify(pixels),
    );
  } finally {
    await browser.close();
  }
})();
