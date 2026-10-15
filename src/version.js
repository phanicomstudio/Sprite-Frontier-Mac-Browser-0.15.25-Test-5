/* October 15, 2026: the single engine version number. Each fix or feature
 * release increments the last part (0.15.26, 0.15.27, ...). package.json
 * "version" must match; tests/version1600.cjs enforces that. The version is
 * shown in the game badge and recorded in CHANGELOG.md. */
(/* @function version.install — Inputs: browser or Node global root. Returns nothing; publishes the frozen FrontierVersion string. No side effects beyond that one global. */ function (root) {
  "use strict";
  root.FrontierVersion = "0.15.26";
})(globalThis);
