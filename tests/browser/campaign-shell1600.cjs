// October 15, 2026: campaign shell acceptance through real editor controls.
// Fresh isolated browser storage; the bundled example campaign is used. Covers
// three-pane layout bounds, opening maps from the tree, adding and renaming an
// area, Move to via the menu, drag and drop, campaign Undo/Redo, inline map
// rename, duplicate into the same area, deleting an area without losing maps,
// filtering, and persistence of areas across a reload. Fails on any page error.
const { chromium, launch } = require("./environment.cjs");
const path = require("node:path");
const assert = require("node:assert/strict");

const url = "file:///" + path.resolve("index.html").replaceAll("\\", "/");

/* @function campaignShell1600.areas — Inputs: Playwright page. Returns [{name, maps:[map names]}] read from the rendered tree, in display order, so assertions check what the author actually sees. */
async function areas(page) {
  return page.evaluate(
    /* @function campaignShell1600.readTree — Inputs: none (runs in the page). Returns area names with their visible map names. Read-only. */ function () {
      const out = [];
      for (const area of document.querySelectorAll("#campaignTree .campaignArea")) {
        const maps = [];
        for (const name of area.querySelectorAll(".campaignMapName")) maps.push(name.textContent);
        out.push({ name: area.querySelector(".campaignAreaName").textContent, maps });
      }
      return out;
    },
  );
}

/* @function campaignShell1600.area — Inputs: Playwright page and area name. Returns the visible map names in that area, or throws when the area is missing. */
async function area(page, name) {
  const found = (await areas(page)).find(
    /* @function campaignShell1600.areaMatch — Inputs: area summary. Returns true for the requested name. */ function (a) {
      return a.name === name;
    },
  );
  assert.ok(found, "area " + name + " is shown");
  return found.maps;
}

/* @function campaignShell1600.mapMenu — Inputs: page, map name and menu entry label. Returns after choosing that entry from the map's ⋯ menu, which is how an author reaches map actions. */
async function mapMenu(page, mapName, entry) {
  await page.getByRole("button", { name: "Actions for " + mapName, exact: true }).click();
  await page.getByRole("menuitem", { name: entry, exact: true }).click();
  await page.waitForTimeout(150);
}

/* @function campaignShell1600.areaMenu — Inputs: page, area name and menu entry label. Returns after choosing that entry from the area's ⋯ menu. */
async function areaMenu(page, areaName, entry) {
  await page.getByRole("button", { name: "Actions for " + areaName, exact: true }).click();
  await page.getByRole("menuitem", { name: entry, exact: true }).click();
  await page.waitForTimeout(150);
}

(/* @function campaignShell1600.run — Inputs: none. Runs the scenario in a fresh browser context and always closes the browser; sets a failing exit code on any assertion or page error. */ async function () {
  const browser = await chromium.launch(launch);
  try {
    const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", /* @function campaignShell1600.pageError — Inputs: browser exception. Records it for the final assertion; does not suppress it. */ function (error) {
      pageErrors.push(error.message);
    });
    await page.goto(url);
    await page.waitForSelector("#workspaceToggle");
    await page.locator("#workspaceToggle").click();
    await page.waitForSelector("#campaignTree .campaignArea");

    // Layout: three non-overlapping panes in authoring mode.
    const boxes = await page.evaluate(/* @function campaignShell1600.layout — Inputs: none. Returns bounding boxes of the three panes. */ function () {
      const box = /* @function campaignShell1600.box — Inputs: element ID. Returns its left/right edges and width. */ function (id) {
        const r = document.getElementById(id).getBoundingClientRect();
        return { left: r.left, right: r.right, width: r.width };
      };
      return { tree: box("campaignPane"), view: box("viewport"), inspector: box("workspaceAssets") };
    });
    assert.ok(boxes.tree.width >= 200 && boxes.view.width >= 400 && boxes.inspector.width >= 280, "all panes usable: " + JSON.stringify(boxes));
    assert.ok(boxes.tree.right <= boxes.view.left + 1 && boxes.view.right <= boxes.inspector.left + 1, "panes do not overlap");
    assert.ok(await page.locator("#campaignPane #sceneHierarchy").count(), "scene list lives under In this map");

    // Bundled example campaign.
    assert.deepEqual((await areas(page)).map(/* @function campaignShell1600.areaName — Inputs: area. Returns its name. */ function (a) { return a.name; }), ["Vector Frontier", "Hub town", "Asset tests"]);
    assert.deepEqual(await area(page, "Vector Frontier"), ["Vector demo", "Room Test", "Geometry Ruin"]);
    assert.equal(await page.locator(".campaignMap.campaignActive .campaignMapName").textContent(), "Vector demo");

    // Opening a map from the tree uses the real map switch.
    await page.locator(".campaignMap", { hasText: "Hub Test" }).click();
    await page.waitForFunction(/* @function campaignShell1600.opened — Inputs: none. Returns true once the Active map picker shows the hub. */ function () {
      return document.getElementById("activeMap").value === "hub-test";
    });
    await page.waitForTimeout(200);
    assert.equal(await page.locator(".campaignMap.campaignActive .campaignMapName").textContent(), "Hub Test");

    // + Area adds after the current map's area and starts an inline rename.
    await page.locator("#campaignAddArea").click();
    const rename = page.locator("#campaignTree input.campaignRename");
    await rename.fill("Dustwater");
    await rename.press("Enter");
    await page.waitForTimeout(150);
    assert.deepEqual((await areas(page)).map(/* @function campaignShell1600.areaName2 — Inputs: area. Returns its name. */ function (a) { return a.name; }), ["Vector Frontier", "Hub town", "Dustwater", "Asset tests"]);

    // Move to via menu, then campaign Undo/Redo.
    await mapMenu(page, "Hub Shop", "Move to Dustwater");
    assert.deepEqual(await area(page, "Dustwater"), ["Hub Shop"]);
    await page.locator("#campaignUndo").click();
    await page.waitForTimeout(150);
    assert.deepEqual(await area(page, "Dustwater"), [], "Undo returns the map");
    assert.ok((await area(page, "Hub town")).includes("Hub Shop"));
    await page.locator("#campaignRedo").click();
    await page.waitForTimeout(150);
    assert.deepEqual(await area(page, "Dustwater"), ["Hub Shop"], "Redo moves it again");

    // Drag a map row onto another area.
    await page.locator(".campaignMap", { hasText: "Room Test" }).dragTo(page.locator(".campaignArea", { has: page.locator(".campaignAreaName", { hasText: /^Dustwater$/ }) }).locator("summary"));
    await page.waitForTimeout(200);
    assert.deepEqual(await area(page, "Dustwater"), ["Hub Shop", "Room Test"], "drag and drop moves to the end of the area");
    assert.deepEqual(await area(page, "Vector Frontier"), ["Vector demo", "Geometry Ruin"]);

    // Inline map rename keeps the ID (the picker option value stays).
    await page.locator(".campaignMap", { hasText: "Geometry Ruin" }).dblclick();
    await rename.fill("Sunken ruin");
    await rename.press("Enter");
    await page.waitForTimeout(200);
    assert.equal(await page.locator('#activeMap option[value="ruin-test"]').textContent(), "Sunken ruin");

    // Duplicate joins the same area and becomes the open map.
    await mapMenu(page, "Sunken ruin", "Duplicate");
    await page.waitForTimeout(300);
    assert.deepEqual(await area(page, "Vector Frontier"), ["Vector demo", "Sunken ruin", "Sunken ruin copy"]);
    assert.equal(await page.locator(".campaignMap.campaignActive .campaignMapName").textContent(), "Sunken ruin copy");

    // Deleting an area moves its maps; no map is deleted.
    const mapCount = await page.locator("#activeMap option").count();
    await areaMenu(page, "Dustwater", "Delete area…");
    await page.locator("#campaignMoveTarget").selectOption({ label: "Hub town" });
    await page.locator("#campaignDeleteArea").getByRole("button", { name: "Delete area" }).click();
    await page.waitForTimeout(200);
    assert.ok(!(await areas(page)).some(/* @function campaignShell1600.noDustwater — Inputs: area. Returns true if it is the deleted area. */ function (a) { return a.name === "Dustwater"; }));
    assert.deepEqual((await area(page, "Hub town")).slice(-2), ["Hub Shop", "Room Test"]);
    assert.equal(await page.locator("#activeMap option").count(), mapCount, "no maps were deleted");

    // Filter shows only matching maps.
    await page.locator("#campaignFilter").fill("sunken");
    await page.waitForTimeout(150);
    assert.deepEqual(await areas(page), [{ name: "Vector Frontier", maps: ["Sunken ruin", "Sunken ruin copy"] }]);
    await page.locator("#campaignFilter").fill("");

    // Areas persist with the project (debounced IndexedDB save).
    await page.waitForTimeout(1500);
    await page.reload();
    await page.waitForSelector("#workspaceToggle");
    await page.locator("#workspaceToggle").click();
    await page.waitForSelector("#campaignTree .campaignArea");
    await page.waitForTimeout(300);
    assert.deepEqual(await area(page, "Vector Frontier"), ["Vector demo", "Sunken ruin", "Sunken ruin copy"], "areas survive a reload");
    assert.deepEqual((await area(page, "Hub town")).slice(-2), ["Hub Shop", "Room Test"]);

    assert.deepEqual(pageErrors, []);
    await page.screenshot({ path: "test-artifacts/campaign-shell1600.png" });
    console.log("PASS campaign shell: three-pane layout, open from tree, add/rename area, menu move with Undo/Redo, drag and drop, inline map rename, duplicate into area, delete area keeps maps, filter, reload persistence, no page errors.");
  } finally {
    await browser.close();
  }
})().catch(/* @function campaignShell1600.fail — Inputs: error. Prints it and sets a failing exit code. */ function (error) {
  console.error(error);
  process.exitCode = 1;
});
