// October 15, 2026 (0.15.27): the game loads separate PNG/GLB files.
// Runs the same scenario twice: served over http (how Cloudflare and npm start
// run it) and opened from disk with generated offline bundles. Checks startup,
// built-in door models, every outdoor bank image, Candy sheets, the castle
// catalog through the real editor button (GLBs loaded from files), and that no
// request fails and no page error occurs. Over http it also checks that no
// offline bundle and no removed data script is requested.
const { chromium, launch, base } = require("./environment.cjs");
const playwright = require(process.env.FRONTIER_PLAYWRIGHT || "playwright");
const path = require("node:path");
const assert = require("node:assert/strict");

/* @function assetLoading1600.scenario — Inputs: launched browser, URL to open and mode label. Returns { requests } after running the checks; throws on the first failure. */
async function scenario(browser, url, mode) {
  const page = await browser.newPage({ viewport: { width: 1500, height: 950 } });
  const errors = [],
    failed = [],
    requests = [];
  page.on("pageerror", /* @function assetLoading1600.pageError — Inputs: exception. Records it. */ function (e) { errors.push(e.message); });
  page.on("requestfailed", /* @function assetLoading1600.requestFailed — Inputs: request. Records it. */ function (r) { failed.push(r.url()); });
  page.on("response", /* @function assetLoading1600.response — Inputs: response. Records the path and any error status. */ function (r) {
    requests.push(decodeURIComponent(new URL(r.url()).pathname));
    if (r.status() >= 400) failed.push(r.status() + " " + r.url());
  });
  await page.goto(url);
  await page.waitForSelector("#workspaceToggle", { timeout: 120000 });
  assert.equal(await page.evaluate(/* @function assetLoading1600.mode — Inputs: none. Returns the loader mode. */ function () { return FrontierAssets.mode; }), mode);
  assert.equal(await page.locator("#assetFailure").count(), 0, "no startup failure message");
  assert.deepEqual(
    await page.evaluate(/* @function assetLoading1600.doors — Inputs: none. Returns whether both built-in door models are in the library. */ function () {
      return ["builtin-antique-door", "builtin-saloon-door"].map(/* @function assetLoading1600.doorPresent — Inputs: model ID. Returns whether it is in the library. */ function (id) { return !!FrontierModelLibrary.get(id); });
    }),
    [true, true],
  );
  // Every outdoor bank image loads at its recorded size.
  await page.evaluate(/* @function assetLoading1600.requestOutdoor — Inputs: none. Starts loading every outdoor image. */ function () {
    FrontierOutdoorAssets.assets.forEach(/* @function assetLoading1600.requestOne — Inputs: outdoor asset record. Starts loading its image. */ function (a) { FrontierOutdoorAssets.image(a.id); });
  });
  await page.waitForFunction(/* @function assetLoading1600.outdoorLoaded — Inputs: none. Returns true once every outdoor image has decoded. */ function () {
    return FrontierOutdoorAssets.assets.every(/* @function assetLoading1600.decoded — Inputs: outdoor asset record. Returns whether its image decoded. */ function (a) { return FrontierOutdoorAssets.image(a.id).naturalWidth > 0; });
  }, null, { timeout: 60000 });
  const wrong = await page.evaluate(/* @function assetLoading1600.outdoorSizes — Inputs: none. Returns outdoor assets whose decoded size differs from the record. */ function () {
    return FrontierOutdoorAssets.assets.filter(/* @function assetLoading1600.sizeWrong — Inputs: outdoor asset record. Returns true when the decoded size differs from the record. */ function (a) {
      const i = FrontierOutdoorAssets.image(a.id);
      return i.naturalWidth !== a.width || i.naturalHeight !== a.height;
    }).map(/* @function assetLoading1600.assetId — Inputs: outdoor asset record. Returns its ID. */ function (a) { return a.id; });
  });
  assert.deepEqual(wrong, []);
  await page.waitForFunction(/* @function assetLoading1600.candy — Inputs: none. Returns true once both Candy sheets decoded. */ function () {
    return FrontierCandy.image.naturalWidth > 0 && FrontierCandyUnarmed.image.naturalWidth > 0;
  });
  // Castle catalog through the real editor control: GLBs come from files.
  await page.locator("#workspaceToggle").click();
  await page.locator(".editorTabs button", { hasText: /^Place$/ }).click();
  await page.locator("#propCastle").click();
  await page.waitForFunction(/* @function assetLoading1600.castleListed — Inputs: none. Returns true once castle prefabs are offered. */ function () {
    return /Castle prefabs available/.test(document.getElementById("propStatus").textContent);
  }, null, { timeout: 60000 });
  await page.locator("#propModel").selectOption("castle-castle-wall-4m");
  await page.locator("#propBegin").click();
  assert.ok(await page.evaluate(/* @function assetLoading1600.castleImported — Inputs: none. Returns whether the chosen castle model decoded into the library. */ function () {
    return !!FrontierModelLibrary.get("castle-castle-wall-4m");
  }), "castle wall imported from its GLB");
  assert.deepEqual(failed, [], "no failed requests");
  assert.deepEqual(errors, [], "no page errors");
  await page.screenshot({ path: "test-artifacts/asset-loading1600-" + mode + ".png" });
  await page.close();
  return { requests };
}

(/* @function assetLoading1600.run — Inputs: none. Runs the http scenario, builds offline bundles, runs the file scenario, and always closes browsers. */ async function () {
  const browser = await chromium.launch(launch);
  try {
    const { requests } = await scenario(browser, (await base()) + "index.html", "http");
    assert.ok(requests.includes("/assets/models/castle/Castle_Wall_4m.glb"), "castle GLB fetched as a file");
    assert.ok(requests.includes("/assets/models/runtime/saloon-doors/pair.glb"), "door GLB fetched as a file");
    assert.ok(!requests.some(/* @function assetLoading1600.noOffline — Inputs: path. Returns true for offline bundles or removed data scripts. */ function (p) {
      return /^\/offline\/|room-texture-data|item-image-data|candy-image-data|room-art\.js|door-asset\.js|saloon-door-data|assets\/skyboxes\//.test(p);
    }), "http mode requests no embedded copies");
  } finally {
    await browser.close();
  }
  require("../../tools/build-offline.cjs").build(path.resolve(__dirname, "../.."));
  const raw = await playwright.chromium.launch(launch);
  try {
    await scenario(raw, "file://" + path.resolve(__dirname, "../../index.html").replaceAll("\\", "/").replace(/^(?!\/)/, "/"), "file");
  } finally {
    await raw.close();
  }
  console.log("PASS asset loading: over http and from disk, startup doors, all outdoor images at recorded sizes, Candy sheets, castle GLB via editor, no failed requests or page errors; http requests no embedded copies.");
})().catch(/* @function assetLoading1600.fail — Inputs: error. Prints it and fails the run. */ function (error) {
  console.error(error);
  process.exitCode = 1;
});
