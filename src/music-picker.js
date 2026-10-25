/* Cached asset catalog and playlist authoring. Refresh lists only on authored
 * changes; catalog browsing never loads or decodes audio files. Existing hidden
 * text controls remain a serialization adapter, not the authoring interface. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music-picker.callback.1 — Provides the callback for a callback. Inputs: root. Updates: original closest using "label" hidden; group class name; group inner html; group query selector using "h4" text content; group query selector using ".addTrack" onclick. Uses: $; original closest; document create element; group query selector. */
(/* @function music-picker.installReviewed — Installs cached music catalog and typed playlist authoring. Catalog browsing lists names without decoding tracks; refreshed authored controls serialize through retained hidden fields. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  const $ =
    /* Historical contract retained; October 14 reviewed explanation follows. @function music-picker.$.2 — Returns document get element by id using id. Inputs: id. Uses: document get element by id. Returns: document get element by id using id. */
  /* @function musicPicker.reviewedlookup_2 — Finds installed music draft control. Inputs: id. Returns DOM element or null; no mutation. Bootstrap requires known controls. */ (
      id,
    ) => document.getElementById(id);
  let catalog = { exploration: [], combat: [] };
  const entries = [
    ["musicExploration", "exploration", "Global exploration"],
    ["musicCombat", "combat", "Global combat"],
    ["musicMap", "exploration", "Map exploration override"],
  ];
  for (const [id, category, label] of entries) {
    const original = $(id);
    original.closest("label").hidden = true;
    const group = document.createElement("section");
    group.className = "playlistPicker";
    group.innerHTML =
      '<h4></h4><select class="available" aria-label="Available tracks"></select><button class="addTrack">Add track</button><select class="playlist" size="4" aria-label="Selected playlist"></select><button class="removeTrack">Remove selected track</button><p class="assetWarning"></p>';
    group.querySelector("h4").textContent = label;
    original.closest("label").after(group);
    const available = group.querySelector(".available"),
      playlist = group.querySelector(".playlist");
    group.querySelector(".addTrack").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function music-picker.onclick.3 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: original value. Uses: original value split using "\n" filter; original value split; names includes; names push. Returns: without a result. */
  /* @function musicPicker.reviewedonclick_3 — Adds selected catalog track to draft playlist. Inputs: ignored click. Returns undefined; no-op empty, deduplicates name in hidden newline field and refreshes typed list. Does not play/decode/commit authored music until owner Apply. */ () => {
        if (!available.value) return;
        const names = original.value.split("\n").filter(Boolean);
        if (!names.includes(available.value)) names.push(available.value);
        original.value = names.join("\n");
        refresh();
      };
    group.querySelector(".removeTrack").onclick =
      /* Historical contract retained; October 14 reviewed explanation follows. @function music-picker.onclick.4 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: original value. Uses: original value split using "\n" filter using a callback join; original value split using "\n" filter; original value split; refresh. */
  /* @function musicPicker.reviewedonclick_4 — Removes selected draft playlist track. Inputs: ignored click. Returns undefined; filters hidden newline field and refreshes. No playback/source mutation; empty selection also removes blank lines. */ () => {
        original.value = original.value
          .split("\n")
          .filter(
            /* Historical contract retained; October 14 reviewed explanation follows. @function music-picker.callback.5 — Returns n and n does not equal playlist value. Inputs: n. Returns: n and n does not equal playlist value. */
  /* @function musicPicker.reviewedcallback_5 — Retains nonempty draft names other than selected track. Inputs: n and captured playlist selection. Returns truthy predicate; no mutation. */ (
              n,
            ) => n && n !== playlist.value,
          )
          .join("\n");
        refresh();
      };
    original.picker = { group, category, available, playlist };
  }
  const button = document.createElement("button");
  button.id = "refreshMusicCatalog";
  button.textContent = "Refresh audio folders";
  $("applyMusic").before(button);
  const status = document.createElement("p");
  status.id = "musicCatalogStatus";
  button.after(status);
  /* Historical contract retained; October 14 reviewed explanation follows. @function music-picker.refresh.6 — Handles refresh within music picker. Inputs: no explicit arguments; uses enclosing module state. Updates: p group query selector using ".assetWarning" text content. Uses: $; input value split using "\n" filter; input value split; p available replace children. */
  /* @function musicPicker.reviewedrefresh_6 — Refreshes typed playlist/catalog controls from hidden drafts. Inputs: none. Returns undefined; replaces available/selected options and reports missing names or empty list. Does not change hidden fields, decode audio or commit project. Catalog names are manifest membership, not playback success. */ function refresh() {
    for (const [id] of entries) {
      const input = $(id),
        p = input.picker,
        names = input.value.split("\n").filter(Boolean),
        known = catalog[p.category] || [];
      p.available.replaceChildren(
        new Option(known.length ? "Choose track" : "No tracks in folder", ""),
        ...known.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function music-picker.callback.7 — Returns a new option. Inputs: n. Returns: a new option. */
  /* @function musicPicker.reviewedcallback_7 — Builds catalog track option. Inputs: n filename. Returns Option(name,name); no audio load or source mutation. */ (
            n,
          ) => new Option(n, n),
        ),
      );
      p.playlist.replaceChildren(
        ...names.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function music-picker.callback.8 — Returns a new option. Inputs: n. Returns: a new option. */
  /* @function musicPicker.reviewedcallback_8 — Builds selected draft track option. Inputs: n filename. Returns Option(name,name); no playback/mutation. */ (
            n,
          ) => new Option(n, n),
        ),
      );
      const missing = names.filter(
        /* Historical contract retained; October 14 reviewed explanation follows. @function music-picker.callback.9 — Returns the inverse of known includes using n. Inputs: n. Uses: known includes. Returns: the inverse of known includes using n. */
  /* @function musicPicker.reviewedcallback_9 — Detects track absent from selected catalog category. Inputs: n and captured known array. Returns !includes(n); no mutation or filesystem probe. */ (
          n,
        ) => !known.includes(n),
      );
      p.group.querySelector(".assetWarning").textContent = missing.length
        ? "Missing from catalog: " + missing.join(", ")
        : names.length
          ? ""
          : "Playlist empty.";
    }
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function music-picker.scan.10 — Handles scan within music picker. Inputs: no explicit arguments; uses enclosing module state. Updates: button disabled; catalog; status text content. Uses: root frontier desktop music catalog; refresh. */
  /* @function musicPicker.reviewedscan_10 — Refreshes audio-name catalog without decoding media. Inputs: none. Returns promise; disables refresh button, uses native desktop folder service when present or bundled browser manifest otherwise, updates status/lists. Catches scan errors visibly and re-enables button in finally. Does not change authored playlist; concurrent programmatic calls are not serialized here. */ async function scan() {
    button.disabled = true;
    try {
      catalog = root.FrontierDesktop
        ? await root.FrontierDesktop.musicCatalog()
        : root.FrontierMusicCatalog || catalog;
      status.textContent = root.FrontierDesktop
        ? "Audio folders refreshed."
        : "Browser uses the saved asset catalog; desktop refresh discovers new files.";
      refresh();
    } catch (e) {
      status.textContent = "Could not read audio catalog: " + e.message;
    } finally {
      button.disabled = false;
    }
  }
  button.onclick = scan;
  root.FrontierMusicPicker = {
    refresh,
    scan,
    catalog:
      /* Historical contract retained; October 14 reviewed explanation follows. @function music-picker.catalog.11 — Returns structured clone using catalog. Inputs: no explicit arguments; uses enclosing module state. Uses: structured clone. Returns: structured clone using catalog. */
  /* @function musicPicker.reviewedcatalog_11 — Returns isolated current audio-name manifest. Inputs: none. Returns structured clone; no scan/decoding/mutation, unsupported manifest types may throw. */ () =>
        structuredClone(catalog),
    /* Historical contract retained; October 14 reviewed explanation follows. @function music-picker.useManifest.12 — Handles use manifest within music picker. Inputs: value. Updates: catalog. Uses: structured clone; refresh. */
  /* @function musicPicker.revieweduseManifest_12 — Installs project-export audio catalog for authoring display. Inputs: optional portable value. Returns undefined; clones truthy manifest then refreshes, falsey retains prior. No schema validation here; owner validates, clone/DOM errors propagate. Does not commit music selections. */ useManifest(
      value,
    ) {
      if (value) catalog = structuredClone(value);
      refresh();
    },
  };
  scan();
})(window);
