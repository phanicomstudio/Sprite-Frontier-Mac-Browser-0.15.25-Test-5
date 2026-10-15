/* October 12, 2026: deterministic runtime entry generation. Asset collection
 * and archive writing are separate responsibilities. This first boundary omits
 * workbenches already proven unnecessary by actual coordinator startup tests.
 * Remaining shared authoring modules must be separated before release export. */
(/* @function runtimeExport.install — Inputs: browser global. Returns nothing; publishes entry generation without DOM changes, downloads or asset decoding. */ function (
  root,
) {
  "use strict";
  const excluded = [
    "editor",
    "editor-workbench",
    "event-context",
    "room-editor",
    "building-editor",
    "building-assemblies",
    "prop-editor",
    "lighting-editor",
    "sky-editor",
    "layout-editor",
    "normal-workbench",
    "editor-tools",
    "effects-editor",
    "model-workbench",
    "model-editor",
    "model-gizmo",
    "model-material-editor",
    "mz-editor",
    // October 15, 2026: the campaign tree is authoring-only.
    "campaign-shell",
  ];
  /* @function runtimeExport.entry — Inputs: original engine HTML and portable authored project. Returns generated HTML plus omitted source paths. Validates through the production project validator before emitting bootstrap. Script data escapes HTML-sensitive characters so map names cannot close the bootstrap element. Rejects malformed markup/projects; does not write files, modify input data or claim asset closure. */
  function entry(html, project) {
    if (typeof html !== "string" || !/<head(?:\s[^>]*)?>/i.test(html))
      throw Error("Runtime export needs the engine HTML document.");
    const checked = root.FrontierMaps.validate(project),
      omitted = [];
    // The editor's hidden muzzle-calibration iframe otherwise loads at startup
    // even though runtime has no action to open it. Keep shared bootstrap markup
    // temporarily, but do not fetch an authoring page in the exported game.
    html = html.replace('src="muzzle-editor.html"', 'src="about:blank"');
    for (const name of excluded) {
      const source = "src/" + name + ".js",
        tag = '<script src="' + source + '"></script>';
      if (!html.includes(tag))
        throw Error("Runtime export source tag missing: " + source);
      html = html.replace(tag, "");
      omitted.push(source);
    }
    const encoded = JSON.stringify(checked)
      .replaceAll("<", "\\u003c")
      .replaceAll(">", "\\u003e")
      .replaceAll("&", "\\u0026")
      .replaceAll("\u2028", "\\u2028")
      .replaceAll("\u2029", "\\u2029");
    const bootstrap =
      "<script>/* Authored export: runtime owns map selection and gameplay saves. */window.FRONTIER_RUNTIME_ONLY=true;window.FRONTIER_EXPORTED_PROJECT=" +
      encoded +
      ";</script>";
    html = html.replace(
      /<head(?:\s[^>]*)?>/i,
      /* @function runtimeExport.bootstrap — Inputs: matched opening head tag. Returns that tag followed by encoded runtime configuration before all engine scripts. Pure string replacement; authored text is data, never evaluated as source. */ function (
        tag,
      ) {
        return tag + bootstrap;
      },
    );
    // Package construction starts with exact remaining script references. Do not
    // pretend this includes dynamically chosen textures, audio or CSS resources;
    // those must be resolved by the separate asset collector before delivery.
    const scripts = [];
    for (const match of html.matchAll(
      /<script\s+src="([^"]+)"\s*><\/script>/g,
    )) {
      const source = match[1];
      if (
        source.includes("..") ||
        source.startsWith("/") ||
        source.includes(":") ||
        source.includes("\\")
      )
        throw Error(
          "Runtime script must use a project-relative path: " + source,
        );
      if (!scripts.includes(source)) scripts.push(source);
    }
    return { html, omitted, scripts };
  }
  root.FrontierRuntimeExport = { entry };
})(window);
