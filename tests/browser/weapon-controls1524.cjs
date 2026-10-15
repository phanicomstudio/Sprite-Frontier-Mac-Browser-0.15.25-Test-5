const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
(/* @function weaponControls.run — Inputs: none. Returns: promise. Edits real native weapon parameter controls, verifies adopted damage/cadence and production export, then rejects an invalid projectile count. Uses isolated browser state and closes on all outcomes. */ async function () {
  const browser = await chromium.launch(launch);
  try {
    const page = await browser.newPage(),
      errors = [];
    page.on(
      "pageerror",
      /* @function weaponControls.error — Inputs: browser exception. Returns: array length; retains runtime failures for explicit acceptance. */ (
        error,
      ) => errors.push(error.message),
    );
    await page.goto(
      "file:///" + path.resolve("index.html").replaceAll("\\", "/"),
    );
    await page.waitForSelector("#startingGameplayValues", {
      state: "attached",
    });
    const originalDamage=await page.evaluate(/* @function weaponControls.originalDamage — Inputs: none. Returns: initial native profile damage for independent Undo comparison; read-only and compatible with an existing isolated native test project. */ ()=>PhanicomABS.weapons.get('handgun').damage);
    await page
      .locator("#startingGameplayValues")
      .evaluate(
        /* @function weaponControls.open — Inputs: bound project button. Returns: nothing; invokes production handler despite collapsed editor category. */ (
          button,
        ) => button.click(),
      );
    const dialog = page.locator("#gameplayDefaultsDialog");
    await dialog.waitFor({ state: "visible" });
    const checkbox = dialog.getByLabel("Override handgun", { exact: true });
    await checkbox.evaluate(
      /* @function weaponControls.expand — Inputs: profile checkbox. Returns: nothing; opens its nearest native profile disclosure without changing saved data. */ (
        element,
      ) => (element.closest("details").open = true),
    );
    await checkbox.check();
    const row = checkbox.locator("xpath=ancestor::details[1]");
    await row.getByLabel("Damage per hit", { exact: true }).fill("23");
    await row
      .getByLabel("Attack cooldown (seconds)", { exact: true })
      .fill("0.5");
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    if (await dialog.isVisible())
      assert.fail(await dialog.locator("[role=status]").innerText());
    const values = await page.evaluate(
      /* @function weaponControls.runtime — Inputs: none. Returns: adopted native Map damage/cadence. Read-only; session initialization owns all mutations. */ () => ({
        damage: PhanicomABS.weapons.get("handgun").damage,
        cooldown: PhanicomABS.weapons.get("handgun").cooldown,
      }),
    );
    assert.equal(values.damage, 23);
    assert.equal(values.cooldown, 30);
    const project = await page.locator("#exportProject").evaluate(
      /* @function weaponControls.export — Inputs: production export button. Returns: parsed ordinary export Blob. Temporarily retains object URL payload and restores its method in finally; no authored mutation. */ async (
        button,
      ) => {
        const original = URL.createObjectURL;
        let captured;
        URL.createObjectURL =
          /* @function weaponControls.blob — Inputs: export Blob. Returns: ordinary object URL while retaining portable payload only. */ (
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
    assert.equal(
      project.gameplayDefaults.extensions.weaponDefinitions.handgun
        .cooldownSeconds,
      0.5,
    );
    await page.locator('#undoGameplayDefaults').evaluate(/* @function weaponControls.undoValues — Inputs: production history button. Returns: nothing; invokes normal compact-history Undo despite collapsed editor category. No direct profile mutation. */ button=>button.click());
    assert.equal(await page.evaluate(/* @function weaponControls.undoneDamage — Inputs: none. Returns: native damage after actual Undo; read-only. */ ()=>PhanicomABS.weapons.get('handgun').damage),originalDamage);
    await page.locator('#redoGameplayDefaults').evaluate(/* @function weaponControls.redoValues — Inputs: production history button. Returns: nothing; invokes normal Redo. */ button=>button.click());
    assert.equal(await page.evaluate(/* @function weaponControls.redoneDamage — Inputs: none. Returns: native damage after actual Redo; read-only. */ ()=>PhanicomABS.weapons.get('handgun').damage),23);
    await page
      .locator("#startingGameplayValues")
      .evaluate(
        /* @function weaponControls.reopen — Inputs: bound button. Returns: nothing; reopens persisted draft through production handler. */ (
          button,
        ) => button.click(),
      );
    await dialog
      .getByLabel("Override handgun", { exact: true })
      .evaluate(
        /* @function weaponControls.expandAgain — Inputs: saved profile checkbox. Returns: nothing; opens nearest control disclosure. */ (
          element,
        ) => (element.closest("details").open = true),
      );
    await dialog
      .getByLabel("Override handgun", { exact: true })
      .locator("xpath=ancestor::details[1]")
      .getByLabel("Attacks per burst", { exact: true })
      .fill("33");
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    assert.equal(await dialog.isVisible(), true);
    assert.match(await dialog.locator("[role=status]").innerText(), /burst/i);
    assert.deepEqual(errors, []);
    console.log(
      "PASS native weapon controls, seconds conversion, project export and invalid burst rejection",
    );
  } finally {
    await browser.close();
  }
})();
