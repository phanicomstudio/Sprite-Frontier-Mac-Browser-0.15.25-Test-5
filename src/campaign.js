/* October 15, 2026: campaign structure for full-campaign authoring.
 *
 * A project is one campaign. The campaign groups maps into named Areas
 * (a town and its interiors, a dungeon and its levels), in the spirit of the
 * Neverwinter Nights Aurora toolset and the Metropolis Frontier Level → Map
 * tree. Areas are authoring organisation only: they never change map IDs,
 * door/transfer targets, cell loading or runtime cost.
 *
 * Stored shape, inside the existing project record:
 *   project.campaign = { areas: [ { id, name, maps: [mapId, ...] }, ... ] }
 * The campaign title is the existing project.title field, so there is one name.
 *
 * Invariants kept by reconcile(): at least one area exists; every project map
 * belongs to exactly one area; area maps only reference existing maps; area IDs
 * are unique. Every function here is pure: it returns new records and never
 * mutates its arguments, so callers can keep the previous value for Undo.
 * Older projects without a campaign are migrated from their map folder names.
 */
(/* @function campaign.install — Inputs: browser or Node VM global root. Returns nothing; publishes the FrontierCampaign service. Pure data helpers only: no DOM, storage or world access, so runtime exports and source tests can load it safely. */ function (root) {
  "use strict";

  const ID = /^[a-z0-9_-]{1,64}$/i;
  const MAX_AREAS = 256;
  const DEFAULT_AREA = "Main area";

  /* @function campaign.cleanName — Inputs: candidate display name and the fallback used when it is blank. Returns a trimmed name of at most 80 characters. Non-string input yields the fallback; never throws, so damaged imports degrade to readable labels instead of failing. */
  function cleanName(value, fallback) {
    const name = typeof value === "string" ? value.trim().slice(0, 80) : "";
    return name || fallback;
  }

  /* @function campaign.requireName — Inputs: author-entered name. Returns the trimmed name. Throws a readable error for blank or over-80-character names, used by interactive operations where silently changing the text would surprise the author. */
  function requireName(value) {
    if (typeof value !== "string" || !value.trim())
      throw Error("Enter a name.");
    if (value.trim().length > 80)
      throw Error("Names are limited to 80 characters.");
    return value.trim();
  }

  /* @function campaign.slug — Inputs: display name and a Set of IDs already in use. Returns a new unique area ID made from lowercase letters, digits and dashes, falling back to "area". Appends -2, -3 … on collision. Does not add the result to the set. */
  function slug(name, used) {
    const base =
      String(name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 56) || "area";
    let id = base,
      n = 2;
    while (used.has(id)) id = base + "-" + n++;
    return id;
  }

  /* @function campaign.idsOf — Inputs: array of records with an id field (maps or areas). Returns their IDs in order. Non-arrays yield an empty list. Read-only. */
  function idsOf(list) {
    const out = [];
    for (const item of Array.isArray(list) ? list : []) out.push(item.id);
    return out;
  }

  /* @function campaign.byId — Inputs: array of records with id fields and the ID to find. Returns the first matching record (the same object, not a copy) or undefined. Read-only. */
  function byId(list, id) {
    for (const item of list) if (item.id === id) return item;
    return undefined;
  }

  /* @function campaign.without — Inputs: array of strings and one value. Returns a new array with every occurrence of that value removed; the input array is unchanged. */
  function without(list, value) {
    const out = [];
    for (const item of list) if (item !== value) out.push(item);
    return out;
  }

  /* @function campaign.derive — Inputs: project map records (id plus optional folder). Returns a new campaign whose areas come from existing map folder names, in first-seen order; maps without a folder go to "Main area". Used once to migrate projects saved before campaigns existed. The folder field itself is left untouched and still shows as a sub-group. */
  function derive(maps) {
    const areas = [],
      byName = new Map(),
      used = new Set();
    for (const map of Array.isArray(maps) ? maps : []) {
      const name = cleanName(map.folder, DEFAULT_AREA);
      if (!byName.has(name)) {
        const area = { id: slug(name, used), name, maps: [] };
        used.add(area.id);
        byName.set(name, area);
        areas.push(area);
      }
      byName.get(name).maps.push(map.id);
    }
    if (!areas.length) areas.push({ id: "main-area", name: DEFAULT_AREA, maps: [] });
    return { areas };
  }

  /* @function campaign.reconcile — Inputs: stored campaign (may be missing or damaged), project maps, and optional preferred area ID for maps not yet placed. Returns a normalized campaign meeting every invariant in the header: unknown/duplicate map references and malformed areas are dropped, unplaced maps join the preferred area (else the first). A missing campaign is derived from map folders. Never throws, so it is safe on every refresh and import; interactive operations validate their own input first. */
  function reconcile(value, maps, preferredArea) {
    const ids = idsOf(maps);
    if (!value || !Array.isArray(value.areas)) return derive(maps);
    const known = new Set(ids),
      placed = new Set(),
      used = new Set(),
      areas = [];
    for (const raw of value.areas.slice(0, MAX_AREAS)) {
      if (!raw || typeof raw !== "object") continue;
      const name = cleanName(raw.name, "Untitled area");
      const id =
        typeof raw.id === "string" && ID.test(raw.id) && !used.has(raw.id)
          ? raw.id
          : slug(name, used);
      used.add(id);
      const members = [];
      for (const mapId of Array.isArray(raw.maps) ? raw.maps : [])
        if (known.has(mapId) && !placed.has(mapId)) {
          placed.add(mapId);
          members.push(mapId);
        }
      areas.push({ id, name, maps: members });
    }
    if (!areas.length) areas.push({ id: "main-area", name: DEFAULT_AREA, maps: [] });
    const target = byId(areas, preferredArea) || areas[0];
    for (const id of ids) if (!placed.has(id)) target.maps.push(id);
    return { areas };
  }

  /* @function campaign.clone — Inputs: campaign. Returns a deep copy so operations can change it without touching the caller's record. Campaign data is small plain JSON, so structuredClone is sufficient. */
  function clone(campaign) {
    return structuredClone(campaign);
  }

  /* @function campaign.findArea — Inputs: campaign and area ID. Returns the matching area record from that campaign object, or throws "That area no longer exists." Callers pass a clone when they intend to modify the result. */
  function findArea(campaign, id) {
    const area = byId(campaign.areas, id);
    if (!area) throw Error("That area no longer exists.");
    return area;
  }

  /* @function campaign.areaOf — Inputs: campaign and map ID. Returns the area containing the map, or null when it is not placed (for example a map created since the last reconcile). Read-only. */
  function areaOf(campaign, mapId) {
    for (const area of campaign?.areas || []) if (area.maps.includes(mapId)) return area;
    return null;
  }

  /* @function campaign.addArea — Inputs: campaign, author-entered name, optional index to insert at (defaults to the end). Returns { campaign, id } with a new empty area and its generated ID. Throws for blank/long names or when the 256-area limit is reached. */
  function addArea(campaign, name, index) {
    const next = clone(campaign);
    if (next.areas.length >= MAX_AREAS)
      throw Error("A campaign can have at most " + MAX_AREAS + " areas.");
    const label = requireName(name);
    const id = slug(label, new Set(idsOf(next.areas)));
    const at =
      Number.isInteger(index) && index >= 0 && index <= next.areas.length
        ? index
        : next.areas.length;
    next.areas.splice(at, 0, { id, name: label, maps: [] });
    return { campaign: next, id };
  }

  /* @function campaign.renameArea — Inputs: campaign, area ID, new name. Returns a new campaign with only that area's display name changed; its ID stays stable so links and saved tree state survive. Throws for unknown areas or invalid names. */
  function renameArea(campaign, id, name) {
    const next = clone(campaign);
    findArea(next, id).name = requireName(name);
    return next;
  }

  /* @function campaign.removeArea — Inputs: campaign, area ID to remove, ID of the area that receives its maps. Returns a new campaign without the area; its maps are appended to the target in their existing order, so no map is ever deleted by this operation. Throws when removing the last area, when target equals the removed area, or for unknown IDs. */
  function removeArea(campaign, id, targetId) {
    const next = clone(campaign);
    if (next.areas.length <= 1)
      throw Error("A campaign needs at least one area.");
    if (id === targetId)
      throw Error("Choose a different area to receive these maps.");
    const removed = findArea(next, id),
      target = findArea(next, targetId);
    target.maps.push(...removed.maps);
    next.areas.splice(next.areas.indexOf(removed), 1);
    return next;
  }

  /* @function campaign.moveArea — Inputs: campaign, area ID, signed step (-1 up, +1 down). Returns a new campaign with the area moved, clamped at the ends (moving the first area up is a no-op copy). Throws for unknown IDs or non-integer steps. */
  function moveArea(campaign, id, step) {
    if (!Number.isInteger(step)) throw Error("Move step must be a whole number.");
    const next = clone(campaign);
    const from = next.areas.indexOf(findArea(next, id));
    const to = Math.max(0, Math.min(next.areas.length - 1, from + step));
    const [area] = next.areas.splice(from, 1);
    next.areas.splice(to, 0, area);
    return next;
  }

  /* @function campaign.moveMap — Inputs: campaign, map ID, destination area ID, optional index within that area (defaults to the end; clamped). Returns a new campaign with the map in exactly one place. Moving within the same area reorders it. Throws when the map is not in the campaign or the area is unknown. Map IDs, names and worlds are untouched. */
  function moveMap(campaign, mapId, areaId, index) {
    const next = clone(campaign);
    const source = areaOf(next, mapId);
    if (!source) throw Error("That map is not part of this campaign.");
    const target = findArea(next, areaId);
    source.maps = without(source.maps, mapId);
    const at =
      Number.isInteger(index) && index >= 0
        ? Math.min(index, target.maps.length)
        : target.maps.length;
    target.maps.splice(at, 0, mapId);
    return next;
  }

  /* @function campaign.validate — Inputs: candidate campaign and project maps. Returns the reconciled campaign when the candidate already satisfies every invariant. Throws a readable error when reconciliation would have to repair it (duplicate area IDs, unknown or repeated maps, missing areas). Used by tests and by operations that must not silently repair author data. */
  function validate(value, maps) {
    if (!value || !Array.isArray(value.areas) || !value.areas.length)
      throw Error("A campaign needs at least one area.");
    const fixed = reconcile(value, maps);
    const given = [];
    for (const a of value.areas) {
      if (!a || typeof a !== "object")
        throw Error("Campaign areas must list each map exactly once and use unique IDs.");
      given.push({ id: a.id, name: a.name, maps: a.maps });
    }
    if (JSON.stringify(fixed) !== JSON.stringify({ areas: given }))
      throw Error("Campaign areas must list each map exactly once and use unique IDs.");
    return fixed;
  }

  root.FrontierCampaign = Object.freeze({
    DEFAULT_AREA,
    MAX_AREAS,
    derive,
    reconcile,
    validate,
    areaOf,
    addArea,
    renameArea,
    removeArea,
    moveArea,
    moveMap,
  });
})(globalThis);
