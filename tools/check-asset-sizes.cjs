#!/usr/bin/env node
/* October 15, 2026 (0.15.27): file-size budget for the deployable game.
 *
 * Checks every file Cloudflare would upload (this folder minus .assetsignore)
 * against Cloudflare Workers static-asset limits: 25 MiB per file and 20,000
 * files per deployment on the free plan. Also flags files over the 8 MiB
 * review threshold, which load slowly on first visit and are worth shrinking.
 *
 * Usage: node tools/check-asset-sizes.cjs [folder]     (npm run check:assets)
 * Exit code 1 when a hard limit is exceeded; review items only print.
 */
"use strict";
const fs = require("node:fs"),
  path = require("node:path");

const MIB = 1048576;
const LIMITS = Object.freeze({ fileBytes: 25 * MIB, files: 20000, reviewBytes: 8 * MIB });

/* @function checkAssetSizes.patterns - Inputs: text of a .gitignore-style file. Returns a list of { regex, directoryOnly } rules. Supports comments, blank lines, "*" (not crossing "/"), "**", a trailing "/" for folders, and a leading "/" to anchor at the root; unanchored names match at any depth. Negation ("!") is not used by .assetsignore here and is rejected so it is not silently ignored. */
function patterns(text) {
  const rules = [];
  for (let line of text.split(/\r?\n/)) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("!")) throw Error("Negated .assetsignore rules are not supported by this checker: " + line);
    const directoryOnly = line.endsWith("/");
    if (directoryOnly) line = line.slice(0, -1);
    const anchored = line.startsWith("/") || line.includes("/");
    line = line.replace(/^\//, "");
    const body = line
      .split("**")
      .map(/* @function checkAssetSizes.segment - Inputs: pattern text between "**" markers. Returns its regex source with "*" matching within one path segment. */ function (part) {
        return part.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]*");
      })
      .join(".*");
    rules.push({ regex: new RegExp((anchored ? "^" : "(^|/)") + body + "($|/)"), directoryOnly });
  }
  return rules;
}

/* @function checkAssetSizes.ignored - Inputs: rules from patterns(), a forward-slash path relative to the folder, and whether it is a directory. Returns true when any rule excludes it. A directory-only rule matches the directory itself and so everything below it. */
function ignored(rules, relative, isDirectory) {
  for (const rule of rules) if ((!rule.directoryOnly || isDirectory) && rule.regex.test(relative)) return true;
  return false;
}

/* @function checkAssetSizes.inventory - Inputs: folder path. Returns [{ path, bytes }] for every regular file that would be deployed, skipping ignored paths and never following symbolic links. */
function inventory(folder) {
  folder = path.resolve(folder);
  const ignoreFile = path.join(folder, ".assetsignore");
  const rules = fs.existsSync(ignoreFile) ? patterns(fs.readFileSync(ignoreFile, "utf8")) : [];
  const files = [];
  /* @function checkAssetSizes.walk - Inputs: path relative to the folder ("" for the folder itself). Returns nothing; appends deployable files below it. */
  function walk(relative) {
    for (const entry of fs.readdirSync(path.join(folder, relative), { withFileTypes: true })) {
      const child = relative ? relative + "/" + entry.name : entry.name;
      if (entry.isSymbolicLink() || ignored(rules, child, entry.isDirectory())) continue;
      if (entry.isDirectory()) walk(child);
      else if (entry.isFile()) files.push({ path: child, bytes: fs.statSync(path.join(folder, child)).size });
    }
  }
  walk("");
  return files;
}

/* @function checkAssetSizes.check - Inputs: folder path. Returns { files, totalBytes, tooLarge, review, tooMany } where tooLarge lists files over 25 MiB, review lists files over 8 MiB (largest first) and tooMany is true above 20,000 files. Pure report; prints nothing. */
function check(folder) {
  const files = inventory(folder);
  const bySize = files.slice().sort(/* @function checkAssetSizes.largestFirst - Inputs: two file records. Returns their order, largest first. */ function (a, b) {
    return b.bytes - a.bytes;
  });
  let totalBytes = 0;
  for (const file of files) totalBytes += file.bytes;
  return {
    files: files.length,
    totalBytes,
    tooLarge: bySize.filter(/* @function checkAssetSizes.overLimit - Inputs: file record. Returns true above 25 MiB. */ function (f) { return f.bytes > LIMITS.fileBytes; }),
    review: bySize.filter(/* @function checkAssetSizes.overReview - Inputs: file record. Returns true between 8 and 25 MiB. */ function (f) { return f.bytes > LIMITS.reviewBytes && f.bytes <= LIMITS.fileBytes; }),
    tooMany: files.length > LIMITS.files,
  };
}

module.exports = { LIMITS, patterns, ignored, inventory, check };

if (require.main === module) {
  const report = check(process.argv[2] || path.join(__dirname, ".."));
  const mb = /* @function checkAssetSizes.mb - Inputs: byte count. Returns it as megabytes with one decimal. */ function (bytes) {
    return (bytes / MIB).toFixed(1) + " MB";
  };
  console.log("Deployable: " + report.files + " files, " + mb(report.totalBytes) + " (limits: 25 MiB per file, " + LIMITS.files + " files).");
  for (const f of report.review) console.log("  review  " + mb(f.bytes).padStart(9) + "  " + f.path);
  for (const f of report.tooLarge) console.log("  TOO BIG " + mb(f.bytes).padStart(9) + "  " + f.path);
  if (report.tooMany) console.log("  TOO MANY FILES for one deployment.");
  if (report.tooLarge.length || report.tooMany) process.exitCode = 1;
  else console.log("PASS every deployable file is within Cloudflare limits.");
}
