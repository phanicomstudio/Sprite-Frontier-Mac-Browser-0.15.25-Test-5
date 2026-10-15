/* Tests run against this iteration, independently of the original workstation. */
/* October 15, 2026 (0.15.27): the game now loads its PNG and GLB files over
 * http(s), so browser tests serve this folder on a free localhost port (via
 * serve.cjs) and transparently rewrite page.goto("file:///…/index.html") to the
 * served address. Test files keep their existing file URLs unchanged.
 * Set FRONTIER_TEST_FILE=1 to test the from-disk mode instead; that needs the
 * offline bundles (npm run build:offline). URLs outside this folder (for
 * example an exported game package) are never rewritten. */
const path = require("node:path"),
  fs = require("node:fs"),
  { fileURLToPath } = require("node:url");
const root = path.resolve(__dirname, "../..");
process.chdir(root);
fs.mkdirSync("test-artifacts", { recursive: true });
const playwright = require(process.env.FRONTIER_PLAYWRIGHT || "playwright");
const fileMode = process.env.FRONTIER_TEST_FILE === "1";
let served = null;

/* @function browserEnvironment.base — Inputs: none. Returns a promise for the local server's base URL, starting serve.cjs on a free port the first time. The server is unref'd so it never keeps a finished test process alive. */
function base() {
  if (!served)
    served = require(path.join(root, "serve.cjs"))
      .start(0)
      .then(/* @function browserEnvironment.started — Inputs: started server record. Returns its base URL after unref(). */ function (record) {
        record.server.unref();
        return record.url;
      });
  return served;
}

/* @function browserEnvironment.map — Inputs: URL passed to page.goto. Returns the URL to actually open: a file URL inside this folder becomes the same path on the local server (keeping query and hash); anything else, or file mode, is returned unchanged. Handles both file:///C:/… style and file:///home/… style URLs. */
async function map(url) {
  if (fileMode || typeof url !== "string" || !url.startsWith("file:")) return url;
  let local;
  try {
    local = fileURLToPath(url.replace(/^file:\/\/\/(?=\/)/, "file://"));
  } catch {
    return url;
  }
  const relative = path.relative(root, local);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return url;
  const suffix = url.match(/[?#].*$/)?.[0] || "";
  return (await base()) + relative.split(path.sep).map(encodeURIComponent).join("/") + suffix;
}

/* @function browserEnvironment.patchPage — Inputs: Playwright page. Returns the same page with goto() routed through map(). Idempotent, so pages reported by several hooks are patched once. */
function patchPage(page) {
  if (page.__frontierPatched) return page;
  const goto = page.goto.bind(page);
  page.goto = /* @function browserEnvironment.goto — Inputs: URL and Playwright options. Returns page.goto's result for the mapped URL. */ async function (url, options) {
    return goto(await map(url), options);
  };
  page.__frontierPatched = true;
  return page;
}

/* @function browserEnvironment.patchContext — Inputs: Playwright browser context. Returns the context with newPage() and any later-opened pages patched. */
function patchContext(context) {
  const newPage = context.newPage.bind(context);
  context.newPage = /* @function browserEnvironment.contextNewPage — Inputs: newPage arguments. Returns a patched page. */ async function (...args) {
    return patchPage(await newPage(...args));
  };
  context.on("page", patchPage);
  return context;
}

/* @function browserEnvironment.patchBrowser — Inputs: Playwright browser. Returns it with newPage() and newContext() producing patched pages. */
function patchBrowser(browser) {
  const newPage = browser.newPage.bind(browser),
    newContext = browser.newContext.bind(browser);
  browser.newPage = /* @function browserEnvironment.browserNewPage — Inputs: newPage arguments. Returns a patched page. */ async function (...args) {
    return patchPage(await newPage(...args));
  };
  browser.newContext = /* @function browserEnvironment.browserNewContext — Inputs: newContext arguments. Returns a patched context. */ async function (...args) {
    return patchContext(await newContext(...args));
  };
  return browser;
}

const chromium = Object.create(playwright.chromium);
chromium.launch = /* @function browserEnvironment.launch — Inputs: Playwright launch options. Returns a launched, patched browser. */ async function (...args) {
  return patchBrowser(await playwright.chromium.launch(...args));
};

module.exports = {
  chromium,
  launch: { headless: true, ...(process.env.FRONTIER_CHROME ? { executablePath: process.env.FRONTIER_CHROME } : {}) },
  base,
  map,
};
