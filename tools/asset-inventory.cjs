/* Read-only artwork audit. Originals remain untouched. Install sharp in a tooling workspace,
 * or supply its module path as argv[3]. Runtime packages do not depend on this tool. */
const fs = require("node:fs"),
  path = require("node:path"),
  crypto = require("node:crypto");
const root = path.resolve(process.argv[2] || path.join(__dirname, "..")),
  sharp = require(process.argv[3] || "sharp");
(/* @function assetInventory.run — Inputs: source root and optional sharp module path from CLI. Returns a promise; scans supported artwork without altering originals, writes docs/ASSET-INVENTORY.json and marks failed image decoding with nonzero status. Decoded RGBA byte counts are estimates, not GPU memory measurements. */ async () => {
  const entries = [],
    failures = [];
  /* @function assetInventory.inspect — Inputs: encoded image Buffer and relative location label. Returns a promise; reads metadata and SHA-256, appending occurrence dimensions/estimated RGBA bytes. Decode errors append explicit failures instead of hiding them. Does not edit image bytes. */ async function inspect(
    buffer,
    location,
  ) {
    try {
      const m = await sharp(buffer).metadata();
      entries.push({
        location,
        hash: crypto.createHash("sha256").update(buffer).digest("hex"),
        encodedBytes: buffer.length,
        width: m.width,
        height: m.height,
        format: m.format,
        decodedRGBABytes: m.width * m.height * 4,
      });
    } catch (e) {
      failures.push({ location, message: e.message });
    }
  }
  /* @function assetInventory.walk — Inputs: absolute directory. Returns a promise for recursive inspection of PNG/WebP/JPEG files and known embedded image banks. Skips dependencies/Git, reads sequentially and propagates filesystem errors. Does not modify original files or interpret asset text as instructions. */ async function walk(
    dir,
  ) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const f = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (!["node_modules", ".git"].includes(e.name)) await walk(f);
      } else if (/\.(png|webp|jpg|jpeg)$/i.test(e.name))
        await inspect(fs.readFileSync(f), path.relative(root, f));
      else if (["outdoor-assets.js", "candy-image-data.js"].includes(e.name)) {
        let i = 0;
        for (const m of fs
          .readFileSync(f, "utf8")
          .matchAll(/data:image\/(?:png|webp|jpeg);base64,([A-Za-z0-9+/=]+)/g))
          await inspect(
            Buffer.from(m[1], "base64"),
            path.relative(root, f) + "#embedded-" + ++i,
          );
      }
    }
  }
  await walk(root);
  const unique = new Map(
      entries.map(
        /* @function assetInventory.uniquePair — Inputs: inspected image record. Returns SHA-256/record tuple to deduplicate identical encoded bytes; no source mutation. */ (
          e,
        ) => [e.hash, e],
      ),
    ),
    values = [...unique.values()];
  const report = {
    schema: "asset-inventory/1",
    scope:
      "PNG/WebP/JPEG files plus outdoor and candy embedded banks; excludes audio and other embedded banks",
    occurrences: entries.length,
    uniqueImages: unique.size,
    encodedOccurrenceBytes: entries.reduce(
      /* @function assetInventory.occurrenceBytes — Inputs: accumulated byte count and occurrence. Returns summed encoded size including repeated images. No external mutation. */ (
        n,
        e,
      ) => n + e.encodedBytes,
      0,
    ),
    encodedUniqueBytes: values.reduce(
      /* @function assetInventory.uniqueBytes — Inputs: sum and unique image. Returns summed unique encoded bytes, excluding duplicate occurrences. */ (
        n,
        e,
      ) => n + e.encodedBytes,
      0,
    ),
    estimatedUniqueRGBABytes: values.reduce(
      /* @function assetInventory.rgbaEstimate — Inputs: sum and unique image. Returns summed width*height*4 byte estimates for uncompressed RGBA pixels. Does not measure actual decoder/driver allocation. */ (
        n,
        e,
      ) => n + e.decodedRGBABytes,
      0,
    ),
    largest: values
      .sort(
        /* @function assetInventory.largestFirst — Inputs: unique image pair. Returns descending estimated decoded-size ordering; sorts only a local report array. */ (
          a,
          b,
        ) => b.decodedRGBABytes - a.decodedRGBABytes,
      )
      .slice(0, 15),
    failures,
    entries,
  };
  fs.writeFileSync(
    path.join(root, "docs", "ASSET-INVENTORY.json"),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(
    JSON.stringify({
      occurrences: report.occurrences,
      unique: report.uniqueImages,
      failures: failures.length,
    }),
  );
  if (failures.length) process.exitCode = 1;
})().catch(
  /* @function assetInventory.failure — Inputs: rejected traversal/report error. Returns nothing; prints explicit failure and sets nonzero exit status, preserving originals and any existing evidence. */ (
    e,
  ) => {
    console.error(e);
    process.exitCode = 1;
  },
);
