const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path");
(/* @function catalogCombat.run — Inputs: none. Returns: promise. Authors weapon/HUD settings through production controls, imports a detached combat room, fires the actual F-key attack and verifies a native kill plus the established HUD message. No synthetic impact/HP changes; isolated browser closes on every outcome. */ async function () {
  const browser = await chromium.launch(launch);
  try {
    const page = await browser.newPage(),
      errors = [];
    page.on(
      "pageerror",
      /* @function catalogCombat.error — Inputs: browser exception. Returns: array length; retains failures rather than suppressing them. */ (
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
        /* @function catalogCombat.open — Inputs: project settings button. Returns: nothing; invokes bound production handler. */ (
          button,
        ) => button.click(),
      );
    const dialog = page.locator("#gameplayDefaultsDialog");
    await dialog.waitFor({ state: "visible" });
    await dialog
      .getByLabel("Override handgun", { exact: true })
      .evaluate(
        /* @function catalogCombat.expand — Inputs: profile checkbox. Returns: nothing; opens its nearest draft disclosure. */ (
          element,
        ) => (element.closest("details").open = true),
      );
    await dialog.getByLabel("Override handgun", { exact: true }).check();
    await dialog
      .getByLabel("Override handgun", { exact: true })
      .locator("xpath=ancestor::details[1]")
      .getByLabel("Damage per hit", { exact: true })
      .fill("40");
    const weaponRow = dialog
      .getByLabel("Override handgun", { exact: true })
      .locator("xpath=ancestor::details[1]");
    await weaponRow
      .getByLabel("Projectile light mode", { exact: true })
      .selectOption("custom");
    await weaponRow
      .getByLabel("Projectile light color", { exact: true })
      .fill("#22aa88");
    await weaponRow
      .getByLabel("Projectile light radius (metres)", { exact: true })
      .fill("3");
    await dialog
      .getByLabel("Use shipped kill-feed settings", { exact: true })
      .uncheck();
    await dialog.getByLabel("Kill feed enabled", { exact: true }).check();
    await dialog
      .getByLabel("General kill-feed messages", { exact: true })
      .fill("TEST {killer} defeated {victim} with {weapon}");
    while (
      await dialog
        .getByRole("button", { name: "Remove weapon rule", exact: true })
        .count()
    )
      await dialog
        .getByRole("button", { name: "Remove weapon rule", exact: true })
        .first()
        .click();
    await dialog.getByRole("button", { name: "Apply", exact: true }).click();
    if (await dialog.isVisible())
      assert.fail(await dialog.locator("[role=status]").innerText());
    await page.evaluate(
      /* @function catalogCombat.observe — Inputs: none. Returns: nothing; observes normal draws to retain the actual game without changing output or simulation. */ () => {
        const draw = FrontierRender.draw;
        FrontierRender.draw =
          /* @function catalogCombat.draw — Inputs: renderer arguments. Returns: original result; retains active game for read-only assertions/test camera setup. */ function (
            ...args
          ) {
            window.catalogCombatGame = args[1];
            const result = draw.apply(this, args);
            for (const light of args[1].lightFrame?.lights || [])
              if (light.color === "#22aa88")
                window.catalogCombatSawCustomLight = true;
            return result;
          };
      },
    );
    await page.waitForFunction(
      /* @function catalogCombat.ready — Inputs: none. Returns: whether a real draw supplied the game. Read-only. */ () =>
        !!window.catalogCombatGame,
    );
    const world = await page.evaluate(
      /* @function catalogCombat.fixture — Inputs: none. Returns: validated authored room with one ordinary monster and deterministic map spread. Removes unrelated demo events/objects; no runtime HP or impact injection. */ () => {
        const shell = FrontierBuildingKit.shell({
          x: 20,
          y: 20,
          width: 30,
          depth: 30,
          height: 6,
          ceiling: false,
        });
        return FrontierWorld.validate({
          ...catalogCombatGame.sourceWorld,
          seed: "CATALOG-COMBAT-1524",
          objects: [FrontierWorld.entity("monster", 20, 18, "catalog-target")],
          events: [],
          spawn: { x: 20, y: 12, z: 0 },
          weaponSpreads: { handgun: 0 },
          lighting: FrontierLocalLighting.validate({
            enabled: true,
            ambient: 0.3,
            budget: 8,
            projectiles: { enabled: false },
          }),
          sky: { enabled: false, layers: [] },
          interior: {
            ...structuredClone(FrontierInterior.defaults),
            mode: "geometry",
            floor: shell.floor,
            primitives: shell.primitives,
            blockers: [],
            sprites: [],
            entrances: [],
            exits: [],
          },
        });
      },
    );
    await page
      .locator("#import")
      .setInputFiles({
        name: "catalog-combat.json",
        mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify(world)),
      });
    await page.waitForFunction(
      /* @function catalogCombat.imported — Inputs: none. Returns: whether production coordinator adopted the fixture. */ () =>
        catalogCombatGame.sourceWorld.seed === "CATALOG-COMBAT-1524",
    );
    await page.evaluate(
      /* @function catalogCombat.camera — Inputs: none. Returns: nothing; sets first-person test aim toward the real target and draws the equipped native weapon. Does not change damage, enemy HP, projectile state or kill-feed parameters. */ () => {
        Object.assign(catalogCombatGame.camera, {
          yaw: 0,
          pitch: -0.08,
          firstPerson: true,
        });
        catalogCombatGame.player.holstered = false;
      },
    );
    await page.locator("#view").focus();
    await page.keyboard.press("f");
    await page.waitForFunction(
      /* @function catalogCombat.killed — Inputs: none. Returns: actual target death after normal projectile simulation. No synthetic damage or despawn. */ () =>
        catalogCombatGame.runtime.entities.get("catalog-target")?.dead,
      {},
      { timeout: 10000 },
    );
    assert.equal(
      await page.evaluate(
        /* @function catalogCombat.emission - Inputs: none. Returns whether normal renderer observed this weapon's custom light while the cell-wide projectile default was disabled. Read-only; no injected light records. */ () =>
          !!window.catalogCombatSawCustomLight,
      ),
      true,
    );
    await page.waitForFunction(
      /* @function catalogCombat.lightExpired - Inputs: none. Returns whether normal projectile impact removed emission. No manual despawn. */ () =>
        catalogCombatGame.projectiles.length === 0 &&
        (catalogCombatGame.lightFrame?.lights.length || 0) === 0,
    );
    const message = await page.locator("#message").textContent();
    assert.match(message, /TEST Candy defeated .* with /);
    assert.equal(
      await page.evaluate(
        /* @function catalogCombat.damage — Inputs: none. Returns: equipped cloned native damage, read-only. */ () =>
          catalogCombatGame.player.weapon.damage,
      ),
      40,
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS authored weapon damage, actual keyboard projectile kill and customized message-device kill feed",
    );
  } finally {
    await browser.close();
  }
})();
