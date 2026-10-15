// October 15, 2026 (0.15.28): interface skins through real controls.
// Default Phanicom devices (art loaded from the pack folder, hotspots placed
// from the manifest), switching to Minimal from Pause → Options, persistence
// across reload, the campaign's interface from the campaign pane saved in the
// project, and no failed requests or page errors.
const { chromium, launch } = require("./environment.cjs");
const path = require("node:path");
const assert = require("node:assert/strict");
const url = "file:///" + path.resolve("index.html").replaceAll("\\", "/");

/* @function uiSkinsBrowser.state — Inputs: Playwright page. Returns the visible interface state: skin attribute, device classes, frame image sizes, journal button geometry and pause background. */
async function state(page) {
  return page.evaluate(/* @function uiSkinsBrowser.read — Inputs: none (in page). Returns the interface state record. */ function () {
    const remote = document.querySelector(".remoteDevice"),
      img = remote.querySelector(":scope > img"),
      status = document.querySelector(".combinedDevice > img"),
      journal = document.getElementById("journalButton").getBoundingClientRect();
    return {
      skin: document.documentElement.dataset.skin,
      remoteFramed: remote.classList.contains("skinFramed"),
      statusPlain: document.querySelector(".combinedDevice").classList.contains("skinPlain"),
      remoteImage: img.hidden ? 0 : img.naturalWidth,
      statusImage: status.hidden ? 0 : status.naturalWidth,
      journalLeft: document.getElementById("journalButton").style.left,
      journalVisible: journal.width > 20 && journal.height > 10,
      journalLabel: getComputedStyle(document.getElementById("journalButton"), "::before").content,
      pauseImage: getComputedStyle(document.getElementById("pauseArtwork")).backgroundImage,
      portraitFrames: FrontierSkins.portraitFrames().length,
    };
  });
}

(/* @function uiSkinsBrowser.run — Inputs: none. Runs the scenario; always closes the browser; fails on any assertion, failed request or page error. */ async function () {
  const browser = await chromium.launch(launch);
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [],
      failed = [];
    page.on("pageerror", /* @function uiSkinsBrowser.pageError — Inputs: exception. Records it. */ function (e) { errors.push(e.message); });
    page.on("response", /* @function uiSkinsBrowser.response — Inputs: response. Records error statuses. */ function (r) { if (r.status() >= 400) failed.push(r.status() + " " + r.url()); });
    await page.goto(url);
    await page.waitForSelector("#workspaceToggle");
    await page.waitForFunction(/* @function uiSkinsBrowser.artReady — Inputs: none. Returns true once the remote art decoded. */ function () {
      return document.querySelector(".remoteDevice > img").naturalWidth > 0;
    });
    let s = await state(page);
    assert.equal(s.skin, "phanicom-devices");
    assert.ok(s.remoteFramed && !s.statusPlain);
    assert.equal(s.remoteImage, 830, "remote art from skins/phanicom-devices");
    assert.equal(s.statusImage, 863);
    assert.equal(s.journalLeft, "60%", "hotspot placed from the manifest");
    assert.match(s.pauseImage, /skins\/phanicom-devices\/pause-menu\.png/);
    assert.equal(s.portraitFrames, 2);

    // Pause → Options → Interface: Minimal.
    await page.locator("#view").focus();
    await page.keyboard.press("Escape");
    await page.locator("#pauseOptions").click();
    await page.locator("#pauseSkin").selectOption("minimal");
    s = await state(page);
    assert.equal(s.skin, "minimal");
    assert.ok(!s.remoteFramed && s.statusPlain);
    assert.equal(s.remoteImage, 0, "no frame image");
    assert.equal(s.journalLeft, "", "manifest geometry cleared");
    assert.equal(s.pauseImage, "none");
    assert.equal(s.portraitFrames, 0);
    await page.locator("#pauseBack").click();
    await page.locator("#pauseResume").click();
    s = await state(page);
    assert.ok(s.journalVisible, "minimal controls are visible buttons");
    assert.equal(s.journalLabel, '"Journal"');
    await page.screenshot({ path: "test-artifacts/ui-skins1600-minimal.png" });

    // The choice persists for this browser.
    await page.reload();
    await page.waitForSelector("#workspaceToggle");
    assert.equal((await state(page)).skin, "minimal");

    // Campaign interface from the campaign pane: saved in the project, and
    // shown once the player follows the campaign default again.
    await page.locator("#workspaceToggle").click();
    await page.locator("#campaignSkin").selectOption("minimal");
    assert.equal(await page.evaluate(/* @function uiSkinsBrowser.projectSkin — Inputs: none. Returns the project's interface skin. */ function () { return FrontierMapLibrary.snapshot().uiSkin; }), "minimal");
    await page.evaluate(/* @function uiSkinsBrowser.followCampaign — Inputs: none. Sets the player choice back to the campaign default. */ function () { FrontierSkins.choose("campaign"); });
    assert.equal((await state(page)).skin, "minimal", "campaign skin shown");
    await page.locator("#campaignSkin").selectOption("phanicom-devices");
    await page.waitForFunction(/* @function uiSkinsBrowser.backToPack — Inputs: none. Returns true once the Phanicom pack is shown again. */ function () { return document.documentElement.dataset.skin === "phanicom-devices"; });
    assert.equal((await state(page)).journalLeft, "60%");

    assert.deepEqual(failed, []);
    assert.deepEqual(errors, []);
    console.log("PASS interface skins: Phanicom pack art and hotspots from its folder, Minimal from Pause Options, persistence, campaign interface saved and applied, no failed requests or page errors.");
  } finally {
    await browser.close();
  }
})().catch(/* @function uiSkinsBrowser.fail — Inputs: error. Prints it and fails the run. */ function (error) {
  console.error(error);
  process.exitCode = 1;
});
