const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
(/* @function killFeedControls.run — Inputs: none. Returns: promise. Uses real Starting gameplay controls to adopt a HUD override, inspect portable production export, reject an invalid draft and restore inherited settings. The isolated browser closes on every outcome; no user project is touched. */ async function () {
  const browser = await chromium.launch(launch);
  try {
    const page = await browser.newPage(),
      errors = [];
    page.on(
      "pageerror",
      /* @function killFeedControls.captureError — Inputs: browser error. Returns: array length; retains exceptions for explicit acceptance failure without suppressing them. */ (
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
        /* @function killFeedControls.open — Inputs: bound project control. Returns: nothing; clicks its production handler regardless of collapsed workspace presentation. No direct project mutation. */ (
          button,
        ) => button.click(),
      );
    const dialog = page.locator("#gameplayDefaultsDialog");
    await dialog.waitFor({ state: "visible" });
    await dialog
      .getByLabel("Use shipped kill-feed settings", { exact: true })
      .uncheck();
    await dialog.getByLabel("Kill feed enabled", { exact: true }).uncheck();
    await dialog
      .getByLabel("General kill-feed messages", { exact: true })
      .fill("{killer} defeated {victim}\n{weapon} victory");
    // Replace shipped draft rules through their controls, avoiding duplicate IDs.
    while (
      await dialog
        .getByRole("button", { name: "Remove weapon rule", exact: true })
        .count()
    )
      await dialog
        .getByRole("button", { name: "Remove weapon rule", exact: true })
        .first()
        .click();
    await dialog
      .getByRole("button", { name: "Add kill-feed weapon rule", exact: true })
      .click();
    await dialog
      .getByLabel("Weapon profile ID", { exact: true })
      .last()
      .fill("shotgun");
    await dialog
      .getByLabel("Weapon-specific messages", { exact: true })
      .last()
      .fill("Shotgun: {victim}");
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    if (await dialog.isVisible())
      assert.fail(await dialog.locator("[role=status]").innerText());
    await dialog.waitFor({ state: "detached" });
    const project = await page.locator("#exportProject").evaluate(
      /* @function killFeedControls.export — Inputs: production export control. Returns: parsed portable Blob. Temporarily observes object URL creation, retaining the ordinary URL result, then restores the method in finally. Does not change authored data. */ async (
        button,
      ) => {
        const original = URL.createObjectURL;
        let captured;
        URL.createObjectURL =
          /* @function killFeedControls.blob — Inputs: production Blob. Returns: ordinary object URL while retaining the Blob for portable-data inspection. */ (
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
    const settings = project.gameplayDefaults.extensions.hudKillFeed;
    assert.equal(settings.enabled, false);
    assert.equal(settings.messages.length, 2);
    assert.equal(settings.weaponRules.at(-1).weaponId, "shotgun");
    assert.equal(
      await page.evaluate(
        /* @function killFeedControls.runtimeEnabled — Inputs: none. Returns: native host's retained parameter value after fresh session creation. Read-only. */ () =>
          PhanicomPluginSettings.combat.KillFeedEnabled,
      ),
      "false",
    );
    await page
      .locator("#startingGameplayValues")
      .evaluate(
        /* @function killFeedControls.reopen — Inputs: bound control. Returns: nothing; reopens saved draft through production click handler. */ (
          button,
        ) => button.click(),
      );
    await dialog
      .getByLabel("General kill-feed messages", { exact: true })
      .fill(" ");
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    assert.equal(await dialog.isVisible(), true);
    assert.match(await dialog.locator("[role=status]").innerText(), /messages/);
    await dialog
      .getByLabel("Use shipped kill-feed settings", { exact: true })
      .check();
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    await dialog.waitFor({ state: "detached" });
    assert.deepEqual(errors, []);
    console.log(
      "PASS typed kill-feed controls, portable override, runtime adoption, invalid draft and inherited reset",
    );
  } finally {
    await browser.close();
  }
})();
