const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
(/* @function itemControls.run — Inputs: none. Returns: promise. Edits real project item controls, exports portable metadata, verifies session adoption and invalid-price feedback. Browser context is isolated and always closed; no existing release or user project is changed. */ async function () {
  const browser = await chromium.launch(launch);
  try {
    const page = await browser.newPage(),
      errors = [];
    page.on(
      "pageerror",
      /* @function itemControls.error — Inputs: browser exception. Returns: array length; retains errors for explicit acceptance failure. */ (
        error,
      ) => errors.push(error.message),
    );
    await page.goto(
      "file:///" + path.resolve("index.html").replaceAll("\\", "/"),
    );
    await page.waitForSelector("#startingGameplayValues", {
      state: "attached",
    });
    await page
      .locator("#startingGameplayValues")
      .evaluate(
        /* @function itemControls.open — Inputs: production bound control. Returns: nothing; invokes ordinary handler despite collapsed workspace category. No direct catalog mutation. */ (
          button,
        ) => button.click(),
      );
    const dialog = page.locator("#gameplayDefaultsDialog");
    await dialog.waitFor({ state: "visible" });
    await dialog
      .getByLabel("Use shipped item definitions", { exact: true })
      .uncheck();
    await dialog
      .getByRole("button", { name: "Add item definition", exact: true })
      .click();
    await dialog
      .getByLabel("Item ID", { exact: true })
      .last()
      .fill("castle-book");
    await dialog
      .getByLabel("Item name", { exact: true })
      .last()
      .fill("Castle book");
    await dialog
      .getByLabel("Price (whole gold)", { exact: true })
      .last()
      .fill("42");
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    if (await dialog.isVisible())
      assert.fail(await dialog.locator("[role=status]").innerText());
    const project = await page.locator("#exportProject").evaluate(
      /* @function itemControls.export — Inputs: ordinary export control. Returns: parsed production Blob while temporarily retaining its object URL payload. Restores the URL function in finally; no project mutation. */ async (
        button,
      ) => {
        const original = URL.createObjectURL;
        let captured;
        URL.createObjectURL =
          /* @function itemControls.capture — Inputs: production Blob. Returns: ordinary object URL while retaining portable data for inspection only. */ (
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
    const item = project.gameplayDefaults.extensions.itemDefinitions.at(-1);
    assert.equal(item.id, "castle-book");
    assert.equal(item.price, 42);
    assert.equal(
      await page.evaluate(
        /* @function itemControls.runtime — Inputs: none. Returns: active shared catalog's final item name, read-only. */ () =>
          FrontierItems.at(-1).name,
      ),
      "Castle book",
    );
    await page
      .locator("#startingGameplayValues")
      .evaluate(
        /* @function itemControls.reopen — Inputs: bound control. Returns: nothing; opens saved project draft through the existing handler. */ (
          button,
        ) => button.click(),
      );
    await dialog
      .getByLabel("Item ID", { exact: true })
      .last()
      .evaluate(
        /* @function itemControls.expand — Inputs: selected draft ID control. Returns: nothing; opens its nearest existing definition disclosure. No data mutation. */ (
          element,
        ) => (element.closest("details").open = true),
      );
    await dialog
      .getByLabel("Price (whole gold)", { exact: true })
      .last()
      .fill("0");
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    assert.equal(await dialog.isVisible(), true);
    assert.match(await dialog.locator("[role=status]").innerText(), /price/);
    await dialog
      .getByLabel("Use shipped item definitions", { exact: true })
      .check();
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    assert.deepEqual(errors, []);
    console.log(
      "PASS typed item definitions, production export, session catalog, rejected price and inherited reset",
    );
  } finally {
    await browser.close();
  }
})();
