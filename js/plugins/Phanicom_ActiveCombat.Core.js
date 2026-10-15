/* MAINTAINER GUIDE
 * Selected original Phanicom_ActiveCombat equations/parsers. MZ engine services are replaced by the native host. The unchanged original is in reference/.
 * See docs/CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Pure parsers, weapon spread and procedural audio carried from Phanicom_ActiveCombat v0.9.0. Native host adapter supplies world, input and rendering. */
(/* @function Phanicom_ActiveCombat.Core.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root phanicom combat core. Uses: number; parse struct array using params weapon profiles map using compile weapon profile filter; parse struct array using params weapon profiles map; parse struct array. */ function(root){
"use strict"  ;
  const params=root.PhanicomPluginSettings.combat,EPS=1e-8,DEG=Math.PI/180;
  const CFG={
    goldenEyeAudio:params.GoldenEyeAudio!=="false",goldenEyeStandardVolume:Number(params.GoldenEyeStandardVolume||8),goldenEyeOutputGain:Number(params.GoldenEyeOutputGain||6),defaultEmptySound:params.DefaultEmptySound||"Out of ammo",defaultEnemyHp:Number(params.DefaultEnemyHP||30),defaultHitRadius:Number(params.DefaultHitRadius||.34),combatantAlphaThreshold:Number(params.CombatantAlphaThreshold||32),defaultDeathSwitch:params.DefaultDeathSelfSwitch||"A",defaultBloodColor:params.DefaultBloodColor||"#7d0b0c",defaultBloodDroplets:Number(params.DefaultBloodDroplets||8),defaultGibThreshold:Number(params.DefaultGibThreshold||25),gibBloodBurst:Number(params.GibBloodBurst||18),gibBleedChance:Number(params.GibBleedChance||.35),gibBleedFrames:Number(params.GibBleedFrames||12)
  }
  ;
  const GoldenEyeAudio={
    ctx:null
  }
  ;
  const log=/* @function Phanicom_ActiveCombat.Core.log.2 — Records a human-readable runtime message. Inputs: no explicit arguments; uses enclosing module state. */ ()=>{
  }
  ;
  const $gameParty={
    leader:/* @function Phanicom_ActiveCombat.Core.leader.3 — Returns a record containing actorId. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing actorId. */ ()=>({
      actorId:/* @function Phanicom_ActiveCombat.Core.actorId.4 — Returns 1. Inputs: no explicit arguments; uses enclosing module state. Returns: 1. */ ()=>1
    }
    )
  }
  ;
  const currentActorMuzzleProfile=/* @function Phanicom_ActiveCombat.Core.currentActorMuzzleProfile.5 — Returns null. Inputs: no explicit arguments; uses enclosing module state. Returns: null. */ ()=>null,actorWeaponCalibration=/* @function Phanicom_ActiveCombat.Core.actorWeaponCalibration.6 — Returns null. Inputs: no explicit arguments; uses enclosing module state. Returns: null. */ ()=>null,playerFiringCalibration=/* @function Phanicom_ActiveCombat.Core.playerFiringCalibration.7 — Returns null. Inputs: no explicit arguments; uses enclosing module state. Returns: null. */ ()=>null,enemyFiringCalibration=/* @function Phanicom_ActiveCombat.Core.enemyFiringCalibration.8 — Returns null. Inputs: no explicit arguments; uses enclosing module state. Returns: null. */ ()=>null;
  /* @function Phanicom_ActiveCombat.Core.clamp.9 — Handles clamp within phanicom active combat.core. Inputs: v; lo; hi. Returns: math max using lo, math min using hi, v. */ function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }
// Read key/value text without evaluating it; quotes permit names containing spaces.
  /* @function Phanicom_ActiveCombat.Core.parseAttributePairs.10 — Read key/value text without evaluating it; quotes permit names containing spaces. Inputs: text. Updates: m; out at m at 1. Uses: re exec; string; m at 2 replace. Returns: out. */ function parseAttributePairs(text) {
    const out = {
    }
    ;
    const re = /([A-Za-z][\w]*)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g;
    let m;
    while ((m = re.exec(String(text || "")))) {
      out[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    }
    return out;
  }
// Read old multiline note tags so existing weapon authoring remains compatible.
  /* @function Phanicom_ActiveCombat.Core.parseLegacyKeyValueBlock.11 — Read old multiline note tags so existing weapon authoring remains compatible. Inputs: text; tag name. Updates: out at line slice using 0, eq trim using . Uses: string using text or "" match; string; m at 1 split; raw trim. Returns: null; out. */ function parseLegacyKeyValueBlock(text, tagName) {
    const re = new RegExp(`<${tagName}\\s*>([\\s\\S]*?)<\\/${tagName}\\s*>`, "i");
    const m = String(text || "").match(re);
    if (!m) return null;
    const out = {
    }
    ;
    for (const raw of m[1].split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#") || line.startsWith("//")) continue;
      const eq = line.indexOf("=");
      if (eq <= 0) continue;
      out[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return out;
  }
// Read modern note-tag options and fall back to legacy block syntax.
  /* @function Phanicom_ActiveCombat.Core.parseTagOptions.12 — Read modern note-tag options and fall back to legacy block syntax. Inputs: note; tag name. Updates: m; found. Uses: string; re exec; object assign; parse attribute pairs. Returns: found selects merged or null. */ function parseTagOptions(note, tagName) {
/*
         * v0.4.7: Merge EVERY matching inline tag on the object/event.
         *
         * Previous revisions used String.match() without the global flag, so
         * only the FIRST <PhanicomABS: ...> tag was ever parsed. That meant an
         * event using one tag for attack settings and a second tag for blood /
         * gib settings silently lost everything in the second tag.
         *
         * We now scan all occurrences in note order and merge their key/value
         * pairs. Later tags override earlier values when the same key appears.
         * A bare <PhanicomABS> still counts as a valid marker and contributes
         * no options of its own.
         */
    const text = String(note || "");
    const re = new RegExp(`<${tagName}(?:\s*:?\s*([^>]*))?>`, "gi");
    const merged = {
    }
    ;
    let found = false;
    let m;
    while ((m = re.exec(text))) {
      found = true;
      Object.assign(merged, parseAttributePairs(m[1] || ""));
    }
    return found ? merged : null;
  }
// Extract weapon tag options from the supplied MZ note format.
  /* @function Phanicom_ActiveCombat.Core.parseWeaponNote.13 — Extract weapon tag options from the supplied MZ note format. Inputs: text. Uses: string; note match; parse attribute pairs; object keys. Returns: attrs; parse legacy key value block using note, "PhanicomABSWeapon". */ function parseWeaponNote(text) {
    const note = String(text || "");
    const single = note.match(/<PhanicomABSWeapon\s*:?\s+([^>]+)>/i);
    if (single) {
      const attrs = parseAttributePairs(single[1]);
      if (Object.keys(attrs).length > 0) return attrs;
    }
    return parseLegacyKeyValueBlock(note, "PhanicomABSWeapon");
  }
// Read a finite numeric option or use its configured fallback.
  /* @function Phanicom_ActiveCombat.Core.num.14 — Read a finite numeric option or use its configured fallback. Inputs: obj; key; fallback. Uses: number; number is finite. Returns: number is finite using n selects n or fallback. */ function num(obj, key, fallback) {
    const n = Number(obj?.[key]);
    return Number.isFinite(n) ? n : fallback;
  }
// Read a numeric option and truncate to an integer.
  /* @function Phanicom_ActiveCombat.Core.int.15 — Read a numeric option and truncate to an integer. Inputs: obj; key; fallback. Uses: num. Returns: math trunc using num using obj, key, fallback. */ function int(obj, key, fallback) {
    return Math.trunc(num(obj, key, fallback));
  }
// Read a textual option or default.
  /* @function Phanicom_ActiveCombat.Core.str.16 — Read a textual option or default. Inputs: obj; key; fallback. Uses: string. Returns: value equals undefined or value equals null or value equals "" selects fallback or string using value. */ function str(obj, key, fallback) {
    const value = obj?.[key];
    return value === undefined || value === null || value === "" ? fallback : String(value);
  }
// Parse a muzzle pixel offset pair from authored note text.
  /* @function Phanicom_ActiveCombat.Core.parseOffsetPair.17 — Parse a muzzle pixel offset pair from authored note text. Inputs: text. Uses: string using text or "" trim using match; string using text or "" trim; string; number. Returns: m selects a record containing x, y or null. */ function parseOffsetPair(text) {
    const m = String(text || "").trim().match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
    return m ? {
      x: Number(m[1]), y: Number(m[2])
    }
    : null;
  }
// Parse per-direction muzzle offsets using original MZ direction IDs.
  /* @function Phanicom_ActiveCombat.Core.parseMuzzleSpec.18 — Parse per-direction muzzle offsets using original MZ direction IDs. Inputs: text. Updates: by direction at number using m at 1. Uses: string using text or "" trim; string; parse offset pair; raw split. Returns: a record containing shared, byDirection; object keys using by direction length selects a record containing shared, byDirection or a record containing shared, byDirection. */ function parseMuzzleSpec(text) {
    const raw = String(text || "").trim();
    const shared = parseOffsetPair(raw);
    if (shared) return {
      shared, byDirection: null
    }
    ;
    const byDirection = {
    }
    ;
    for (const part of raw.split("|")) {
      const m = part.match(/^\s*([12346789])\s*:\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
      if (m) byDirection[Number(m[1])] = {
        x: Number(m[2]), y: Number(m[3])
      }
      ;
    }
    return Object.keys(byDirection).length ? {
      shared: {
        x: 0, y: 0
      }
      , byDirection
    }
    : {
      shared: {
        x: 0, y: 0
      }
      , byDirection: null
    }
    ;
  }
// Look up a directional muzzle entry with the original fallback rules.
  /* @function Phanicom_ActiveCombat.Core.muzzleForDirection.19 — Look up a directional muzzle entry with the original fallback rules. Inputs: spec; dir. Uses: number. Returns: a record containing x, y; chain or spec shared or a record containing x, y. */ function muzzleForDirection(spec, dir) {
    if (!spec) return {
      x: 0, y: 0
    }
    ;
    return spec.byDirection?.[Number(dir)] || spec.shared || {
      x: 0, y: 0
    }
    ;
  }
// Decode MZ plugin struct arrays, whose entries may themselves be JSON strings.
  /* @function Phanicom_ActiveCombat.Core.parseStructArray.20 — Decode MZ plugin struct arrays, whose entries may themselves be JSON strings. Inputs: raw. Uses: json parse; array is array; outer map using a callback filter; outer map. Returns: a list of ; a list of . */ function parseStructArray(raw) {
    if (!raw) return [];
    try {
      const outer = JSON.parse(raw);
      if (!Array.isArray(outer)) return [];
      return outer.map(/* @function Phanicom_ActiveCombat.Core.callback.21 — Provides the callback for outer map. Inputs: entry. Uses: json parse; string. Returns: entry; json parse using string using entry or "{}". */ entry => {
        if (entry && typeof entry === "object") return entry;
        try {
          return JSON.parse(String(entry || "{}"));
        }
        catch (_) {
          return null;
        }
      }
      ).filter(Boolean);
    }
    catch (_) {
      return [];
    }
  }
// Canonicalize profile names for ID/display-name lookup.
  /* @function Phanicom_ActiveCombat.Core.profileKey.22 — Canonicalize profile names for ID/display-name lookup. Inputs: value. Uses: string using value or "" trim using to lower case using replace using /[^a-z0-9]+/g, "_" replace; string using value or "" trim using to lower case using replace; string using value or "" trim using to lower case; string using value or "" trim. Returns: string using value or "" trim using to lower case using replace using /[^a-z0-9]+/g, "_" replace using /^_+|_+$/g, "". */ function profileKey(value) {
    return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  }
// Build directional muzzle metadata from a weapon profile.
  /* @function Phanicom_ActiveCombat.Core.profileMuzzleSpec.23 — Build directional muzzle metadata from a weapon profile. Inputs: raw. Updates: by direction at dir. Uses: number; number is finite. Returns: a record containing shared, byDirection. */ function profileMuzzleSpec(raw) {
    const byDirection = {
    }
    ;
    for (const dir of [2,4,6,8,1,3,9,7]) {
      const x = Number(raw?.[`Muzzle${dir}X`]);
      const y = Number(raw?.[`Muzzle${dir}Y`]);
      byDirection[dir] = {
        x: Number.isFinite(x) ? x : 0,
        y: Number.isFinite(y) ? y : 0,
      }
      ;
    }
    return {
      shared: {
        x: 0, y: 0
      }
      , byDirection
    }
    ;
  }
// Build per-direction aim vectors from profile fields.
  /* @function Phanicom_ActiveCombat.Core.profileAimSpec.24 — Build per-direction aim vectors from profile fields. Inputs: raw. Updates: by direction at dir. Uses: number; number is finite; normalize. Returns: a record containing byDirection. */ function profileAimSpec(raw) {
    const byDirection = {
    }
    ;
    for (const dir of [2,4,6,8,1,3,9,7]) {
      const x = Number(raw?.[`Aim${dir}X`]);
      const y = Number(raw?.[`Aim${dir}Y`]);
      if (Number.isFinite(x) && Number.isFinite(y) && Math.hypot(x, y) > EPS) {
        byDirection[dir] = normalize(x, y);
      }
    }
    return {
      byDirection
    }
    ;
  }
// Resolve the profile aim vector for an MZ direction.
  /* @function Phanicom_ActiveCombat.Core.aimVectorForDirection.25 — Resolve the profile aim vector for an MZ direction. Inputs: aim spec; dir. Uses: number; normalize; direction vector. Returns: v and math hypot using v x, v y is greater than eps selects normalize using v x, v y or direction vector using dir. */ function aimVectorForDirection(aimSpec, dir) {
    const v = aimSpec?.byDirection?.[Number(dir)];
    return v && Math.hypot(v.x, v.y) > EPS ? normalize(v.x, v.y) : directionVector(dir);
  }
// Convert authored barrel angle degrees into a normalized source 2D direction.
  /* @function Phanicom_ActiveCombat.Core.angleDegreesToVector.26 — Convert authored barrel angle degrees into a normalized source 2D direction. Inputs: degrees. Uses: number; normalize. Returns: normalize using math cos using rad, math sin using rad. */ function angleDegreesToVector(degrees) {
    const rad = Number(degrees || 0) * DEG;
    return normalize(Math.cos(rad), Math.sin(rad));
  }
// Convert directional angle fields into vectors for legacy compatibility.
  /* @function Phanicom_ActiveCombat.Core.profileAngleAimSpec.27 — Convert directional angle fields into vectors for legacy compatibility. Inputs: raw. Updates: by direction at dir. Uses: number; number is finite; angle degrees to vector. Returns: a record containing byDirection. */ function profileAngleAimSpec(raw) {
    const byDirection = {
    }
    ;
    for (const dir of [2,4,6,8,1,3,9,7]) {
      const key = `AimAngle${dir}`;
      const value = Number(raw?.[key]);
      if (Number.isFinite(value)) byDirection[dir] = angleDegreesToVector(value);
    }
    return {
      byDirection
    }
    ;
  }
// Convert supplied plugin profile fields into runtime weapon defaults.
  /* @function Phanicom_ActiveCombat.Core.compileWeaponProfile.28 — Convert supplied plugin profile fields into runtime weapon defaults. Inputs: raw. Uses: profile key; string; string using chain or "projectile" trim using to lower case; string using chain or "projectile" trim. Returns: null; a record containing id, displayName, family, runtimeType, fireMode, audioProfile, sound, tracerColor. */ function compileWeaponProfile(raw) {
    const id = profileKey(raw?.ProfileId || raw?.DisplayName);
    if (!id) return null;
    return {
      id,
      displayName: String(raw?.DisplayName || raw?.ProfileId || id),
      family: String(raw?.Family || "projectile").trim().toLowerCase(),
      runtimeType: String(raw?.RuntimeType || "projectile").trim().toLowerCase(),
      fireMode: String(raw?.FireMode || "semi").trim().toLowerCase(),
      audioProfile: String(raw?.AudioProfile || "standard").trim().toLowerCase(),
      sound: String(raw?.DefaultSE || "").trim(),
      tracerColor: String(raw?.TracerColor || "#ffcf70").trim(),
      muzzleForward: Math.max(0, Number(raw?.MuzzleForward ?? 0.20) || 0),
      muzzleSpec: profileMuzzleSpec(raw),
    }
    ;
  }
// Convert authored enemy profile fields into validated runtime combat options.
  /* @function Phanicom_ActiveCombat.Core.compileEnemyCombatProfile.29 — Convert authored enemy profile fields into validated runtime combat options. Inputs: raw. Uses: profile key; string using chain or "none" trim using to lower case; string using chain or "none" trim; string. Returns: null; a record containing id, displayName, characterSheet, calibrationId, maxHp, attack, damage, range. */ function compileEnemyCombatProfile(raw) {
    const id = profileKey(raw?.ProfileId || raw?.DisplayName);
    if (!id) return null;
    const attack = String(raw?.Attack || "none").trim().toLowerCase();
    return {
      id,
      displayName: String(raw?.DisplayName || raw?.ProfileId || id),
      characterSheet: String(raw?.CharacterSheet || ""),
      calibrationId: profileKey(raw?.CalibrationId || ""),
      maxHp: Math.max(1, Number(raw?.Hp || 60)),
      attack: ["projectile","hitscan","shotgun","melee"].includes(attack) ? attack : "none",
      damage: Math.max(0, Number(raw?.Damage || 8)),
      range: Math.max(0.1, Number(raw?.Range || (attack === "melee" ? 1.2 : 18))),
      fireRate: Math.max(1, Number(raw?.FireRate || 60) | 0),
      speed: Math.max(0.01, Number(raw?.Speed || 38)),
      radius: Math.max(0.001, Number(raw?.Radius || 0.015)),
      spreadDegrees: Math.max(0, Number(raw?.Spread ?? (attack === "shotgun" ? 18 : 1.5))),
      pellets: Math.max(1, Number(raw?.Pellets || (attack === "shotgun" ? 8 : 1)) | 0),
      tracerColor: String(raw?.TracerColor || "#ff8a5b"),
      tracerLife: Math.max(0, Number(raw?.TracerLife || 0.08)),
      muzzleForward: Math.max(0, Number(raw?.MuzzleForward || 0.20)),
      muzzleSpec: profileMuzzleSpec(raw),
      aimSpec: profileAngleAimSpec(raw),
      audioProfile: String(raw?.AudioProfile || (attack === "shotgun" ? "shotgun" : (["projectile","hitscan"].includes(attack) ? "standard" : "none"))).toLowerCase(),
      audioVolume: clamp(Number(raw?.AudioVolume ?? 1.0), 0, 4),
      bloodColor: String(raw?.BloodColor || CFG.defaultBloodColor),
      bloodAmount: Math.max(0, Math.min(64, Number(raw?.BloodAmount ?? CFG.defaultBloodDroplets) | 0)),
      gib: /^(true|1|yes|on)$/i.test(String(raw?.Gib || "false")),
      gibThreshold: Math.max(0, Number(raw?.GibThreshold ?? CFG.defaultGibThreshold)),
    }
    ;
  }
// Normalize a 2D vector safely; coordinate conventions remain those of the supplied plugin.
  /* @function Phanicom_ActiveCombat.Core.normalize.30 — Normalize a 2D vector safely; coordinate conventions remain those of the supplied plugin. Inputs: x; y. Uses: hypot. Returns: a record containing x, y. */ function normalize(x, y) {
    const len = hypot(x, y);
    return {
      x: x / len, y: y / len
    }
    ;
  }
// Translate MZ keypad direction IDs into unit world vectors.
  /* @function Phanicom_ActiveCombat.Core.directionVector.31 — Translate MZ keypad direction IDs into unit world vectors. Inputs: dir. Uses: number; normalize. Returns: normalize using - 1, 1; a record containing x, y. */ function directionVector(dir) {
    switch (Number(dir)) {
      case 1: return normalize(-1, 1);
      case 2: return {
        x: 0, y: 1
      }
      ;
      case 3: return normalize(1, 1);
      case 4: return {
        x: -1, y: 0
      }
      ;
      case 6: return {
        x: 1, y: 0
      }
      ;
      case 7: return normalize(-1, -1);
      case 8: return {
        x: 0, y: -1
      }
      ;
      case 9: return normalize(1, -1);
      default: return {
        x: 0, y: 1
      }
      ;
    }
  }
// Generate Gaussian random deviation for the original weapon spread model.
  /* @function Phanicom_ActiveCombat.Core.gaussian.32 — Generate Gaussian random deviation for the original weapon spread model. Inputs: no explicit arguments; uses enclosing module state. Updates: u; v. Returns: math sqrt using - 2 multiplied by math log using u multiplied by math cos using 2 multiplied by math pi multiplied by v. */ function gaussian() {
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
// Rotate an aim vector by sampled angular spread; preserve the source distribution.
  /* @function Phanicom_ActiveCombat.Core.applySpread.33 — Rotate an aim vector by sampled angular spread; preserve the source distribution. Inputs: direction; spread radians. Uses: gaussian. Returns: a record containing copied fields; a record containing x, y. */ function applySpread(direction, spreadRadians) {
    if (!(spreadRadians > 0)) return {
      ...direction
    }
    ;
    const angle = Math.atan2(direction.y, direction.x) + gaussian() * spreadRadians;
    return {
      x: Math.cos(angle), y: Math.sin(angle)
    }
    ;
  }
// Create the original cone of pellet directions. Native host limits count to protect frame budgets.
  /* @function Phanicom_ActiveCombat.Core.shotgunDirections.34 — Create the original cone of pellet directions. Native host limits count to protect frame budgets. Inputs: base direction; pellets; cone radians. Uses: clamp; result push. Returns: a list of a record containing copied fields; result. */ function shotgunDirections(baseDirection, pellets, coneRadians) {
    const count = Math.max(1, Math.trunc(pellets || 1));
    const base = Math.atan2(baseDirection.y, baseDirection.x);
    const half = Math.max(0, coneRadians || 0) * 0.5;
    if (count === 1 || half <= EPS) return [{
      ...baseDirection
    }
    ];
    const result = [];
    for (let i = 0;
    i < count;
    i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const even = -half + t * half * 2;
      const spacing = (half * 2) / Math.max(1, count - 1);
      const jitter = (Math.random() - 0.5) * spacing * 0.45;
      const angle = base + clamp(even + jitter, -half, half);
      result.push({
        x: Math.cos(angle), y: Math.sin(angle)
      }
      );
    }
    return result;
  }
// Resolve explicit profile ID, name or source item association.
  /* @function Phanicom_ActiveCombat.Core.weaponProfileFor.35 — Resolve explicit profile ID, name or source item association. Inputs: raw; assignment pattern. Uses: str; weapon profiles get; profile key. Returns: weapon profiles get using profile key using requested or null; weapon profiles get using profile key using item name or null. */ function weaponProfileFor(raw, item = null) {
// v0.6.3: an explicit profile= always wins. If it is omitted, try the
// RPG Maker Item name so the seeded profile library works immediately
// with existing Items named "Handgun", "Shotgun", etc. This keeps the
// Plugin Manager profile array as the practical source of weapon-type
// muzzle data without forcing every existing Item note to be rewritten.
    const requested = str(raw, "profile", str(raw, "weaponProfile", ""));
    if (requested) return WEAPON_PROFILES.get(profileKey(requested)) || null;
    if (item?.name) return WEAPON_PROFILES.get(profileKey(item.name)) || null;
    return null;
  }
// Merge authored weapon note options with the original profile/default rules. Tune supplied item notes before changing parser defaults.
  /* @function Phanicom_ActiveCombat.Core.parseWeaponItem.36 — Merge authored weapon note options with the original profile/default rules. Tune supplied item notes before changing parser defaults. Inputs: item. Uses: parse weapon note; weapon profile for; str using raw, "type", chain or "projectile" to lower case; str. Returns: null; null. */ function parseWeaponItem(item) {
    if (!item || !item.note) return null;
    const raw = parseWeaponNote(item.note);
    if (!raw) return null;
    const profile = weaponProfileFor(raw, item);
// Direct Item-note values always override profile defaults. Profiles are
// convenience/default data, never a hidden second source of authority.
    const type = str(raw, "type", profile?.runtimeType || "projectile").toLowerCase();
    const family = str(raw, "family", profile?.family || type).toLowerCase();
    const equipSwitch = int(raw, "equipSwitch", 0);
    if (equipSwitch <= 0) return null;
    const defaultCooldown = type === "melee" ? 24 : (type === "shotgun" ? 35 : 12);
// v0.6.3 muzzle precedence:
//   1) muzzleOverride=  -> deliberate per-Item exception
//   2) resolved profile -> Plugin Manager weapon-profile values
//   3) legacy muzzle=    -> older Items that do not use a profile
//   4) 0,0 fallback
    //
// This is intentionally different from v0.6.1/0.6.2. Once an Item is
// attached to a profile (explicitly or by Item name), editing that
// profile must visibly move the PLAYER muzzle as the editor implies.
    const hasMuzzleOverride = raw.muzzleOverride !== undefined && raw.muzzleOverride !== null && String(raw.muzzleOverride).trim() !== "";
    const hasLegacyMuzzle = raw.muzzle !== undefined && raw.muzzle !== null && String(raw.muzzle).trim() !== "";
    const actorMuzzleProfile = currentActorMuzzleProfile();
    const actorId = $gameParty?.leader?.()?.actorId?.() || 0;
    const explicitCalibrationId = str(raw, "calibration", "");
    const actorWeaponCal = actorWeaponCalibration(actorId, profile?.id || "");
    const firingCalibration = playerFiringCalibration(actorId, profile?.id || "", explicitCalibrationId);
    const muzzleSpec = hasMuzzleOverride
    ? parseMuzzleSpec(String(raw.muzzleOverride))
    : (actorWeaponCal?.muzzleSpec
    || firingCalibration?.muzzleSpec
    || actorMuzzleProfile?.muzzleSpec
    || profile?.muzzleSpec
    || (hasLegacyMuzzle ? parseMuzzleSpec(String(raw.muzzle)) : parseMuzzleSpec("0,0")));
    const requestedMode = str(raw, "fireMode", profile?.fireMode || "semi").toLowerCase();
    const fireMode = ["semi", "burst", "auto"].includes(requestedMode) ? requestedMode : "semi";
    const defaultAudio = profile?.audioProfile || (type === "shotgun" ? "shotgun" : (["projectile", "hitscan"].includes(type) ? "standard" : "none"));
    return {
      itemId: item.id,
      name: item.name || `Item ${item.id}`,
      equipSwitch,
      profileId: profile?.id || "",
      profileName: profile?.displayName || "",
      calibrationId: actorWeaponCal
      ? `actor:${actorId}:${profile?.id || ""}`
      : (firingCalibration?.id || profileKey(explicitCalibrationId)),
      aimSpec: actorWeaponCal?.aimSpec || firingCalibration?.aimSpec || null,
      family,
      type,
      damage: Math.max(0, num(raw, "damage", 10)),
      speed: Math.max(0.01, num(raw, "speed", 45)),
      range: Math.max(0.01, num(raw, "range", type === "melee" ? 1.25 : 35)),
      radius: Math.max(0.001, num(raw, "radius", 0.015)),
      cooldown: Math.max(1, int(raw, "cooldown", defaultCooldown)),
      spreadRadians: Math.max(0, num(raw, "spread", type === "shotgun" ? 14 : 0)) * DEG,
      pellets: Math.max(1, int(raw, "pellets", type === "shotgun" ? 8 : 1)),
      tracerColor: str(raw, "tracerColor", profile?.tracerColor || "#ffcf70"),
      tracerLife: Math.max(0, num(raw, "tracerLife", 0.08)),
      muzzleForward: Math.max(0, num(raw, "muzzleForward", num(raw, "muzzleOffset", profile?.muzzleForward ?? 0.20))),
      muzzleSpec,
      penetration: Math.max(0, num(raw, "penetration", 0)),
// v0.6.0: Item-based ammunition. `ammoPerShot` is the documented
// name; legacy `ammoCost` remains accepted as an alias.
      ammoItem: Math.max(0, int(raw, "ammoItem", 0)),
      ammoCost: Math.max(0, int(raw, "ammoPerShot", int(raw, "ammoCost", 1))),
      emptySound: str(raw, "emptySound", CFG.defaultEmptySound),
      fireMode,
      fireRate: Math.max(1, int(raw, "fireRate", int(raw, "cooldown", defaultCooldown))),
      burstCount: Math.max(1, int(raw, "burstCount", 3)),
      burstDelay: Math.max(1, int(raw, "burstDelay", 4)),
      arcRadians: clamp(num(raw, "arc", 75), 1, 360) * DEG,
      maxTargets: Math.max(1, int(raw, "maxTargets", 1)),
      sound: str(raw, "sound", profile?.sound || ""),
      volume: clamp(int(raw, "volume", 90), 0, 100),
      pitch: clamp(int(raw, "pitch", 100), 50, 150),
      audioProfile: str(raw, "audio", defaultAudio).toLowerCase(),
      audioVolume: clamp(num(raw, "audioVolume", 1.0), 0, 4),
    }
    ;
  }
// Parse event combat note tags into enemy attack, timing, hitbox and death options.
  /* @function Phanicom_ActiveCombat.Core.parseCombatEvent.37 — Parse event combat note tags into enemy attack, timing, hitbox and death options. Inputs: event data. Updates: local aim spec by direction at dir; has local aim angle. Uses: parse tag options; str; enemy combat profiles get; profile key. Returns: null; a record containing profileId, profileName, calibrationId, aimSpec, maxHp, hitRadius, alpha, deathSwitch. */ function parseCombatEvent(eventData) {
    const opts = parseTagOptions(eventData?.note || "", "PhanicomABS");
    if (opts === null) return null;
    const requestedProfile = str(opts, "profile", "");
    const profile = requestedProfile
    ? ENEMY_COMBAT_PROFILES.get(profileKey(requestedProfile)) || null
    : null;
    const explicitCalibrationId = str(opts, "calibration", profile?.calibrationId || "");
    const firingCalibration = enemyFiringCalibration(profile?.id || requestedProfile, explicitCalibrationId);
    const deathRaw = str(opts, "deathSwitch", CFG.defaultDeathSwitch);
    const deathSwitch = /^(A|B|C|D)$/i.test(deathRaw) ? deathRaw.toUpperCase() : "None";
    const attack = str(opts, "attack", profile?.attack || "none").toLowerCase();
    const hasEnemyMuzzle = opts.enemyMuzzle !== undefined && opts.enemyMuzzle !== null && String(opts.enemyMuzzle).trim() !== "";
    const hasLegacyMuzzle = opts.muzzle !== undefined && opts.muzzle !== null && String(opts.muzzle).trim() !== "";
    const muzzleSpec = hasEnemyMuzzle
    ? parseMuzzleSpec(String(opts.enemyMuzzle))
    : (hasLegacyMuzzle
    ? parseMuzzleSpec(String(opts.muzzle))
    : (firingCalibration?.muzzleSpec
    || profile?.muzzleSpec
    || parseMuzzleSpec("0,0")));
    const localAimSpec = {
      byDirection: {
      }
    }
    ;
    let hasLocalAimAngle = false;
    for (const dir of [2,4,6,8,1,3,9,7]) {
      const key = `aimAngle${dir}`;
      if (opts[key] !== undefined) {
        const value = Number(opts[key]);
        if (Number.isFinite(value)) {
          localAimSpec.byDirection[dir] = angleDegreesToVector(value);
          hasLocalAimAngle = true;
        }
      }
    }
    const resolvedAimSpec = hasLocalAimAngle
    ? localAimSpec
    : (profile?.aimSpec || firingCalibration?.aimSpec || null);
    return {
      profileId: profile?.id || profileKey(requestedProfile),
      profileName: profile?.displayName || "",
      calibrationId: profile?.id || firingCalibration?.id || profileKey(explicitCalibrationId),
      aimSpec: resolvedAimSpec,
      maxHp: Math.max(1, num(opts, "hp", profile?.maxHp ?? CFG.defaultEnemyHp)),
      hitRadius: Math.max(0.05, num(opts, "hitRadius", CFG.defaultHitRadius)),
      alpha: clamp(int(opts, "alpha", CFG.combatantAlphaThreshold), 1, 255),
      deathSwitch,
      attack: ["projectile", "hitscan", "shotgun", "melee"].includes(attack) ? attack : "none",
      damage: Math.max(0, num(opts, "damage", profile?.damage ?? 8)),
      range: Math.max(0.1, num(opts, "range", profile?.range ?? (attack === "melee" ? 1.2 : 18))),
      fireRate: Math.max(1, int(opts, "fireRate", profile?.fireRate ?? 60)),
      speed: Math.max(0.01, num(opts, "speed", profile?.speed ?? 38)),
      radius: Math.max(0.001, num(opts, "radius", profile?.radius ?? 0.015)),
      spreadRadians: Math.max(0, num(opts, "spread", profile?.spreadDegrees ?? (attack === "shotgun" ? 18 : 1.5))) * DEG,
      pellets: Math.max(1, int(opts, "pellets", profile?.pellets ?? (attack === "shotgun" ? 8 : 1))),
      tracerColor: str(opts, "tracerColor", profile?.tracerColor || "#ff8a5b"),
      tracerLife: Math.max(0, num(opts, "tracerLife", profile?.tracerLife ?? 0.08)),
      muzzleForward: Math.max(0, num(opts, "muzzleForward", profile?.muzzleForward ?? 0.20)),
      muzzleSpec,
      penetration: Math.max(0, num(opts, "penetration", 0)),
      audioProfile: str(opts, "audio", profile?.audioProfile || (attack === "shotgun" ? "shotgun" : (["projectile", "hitscan"].includes(attack) ? "standard" : "none"))).toLowerCase(),
      audioVolume: clamp(num(opts, "audioVolume", profile?.audioVolume ?? 1.0), 0, 4),
      killWeapon: str(opts, "killWeapon", ""),
      killWeaponName: str(opts, "killWeaponName", ""),
      bloodColor: str(opts, "blood", profile?.bloodColor || CFG.defaultBloodColor),
      bloodAmount: Math.max(0, Math.min(64, int(opts, "bloodAmount", profile?.bloodAmount ?? CFG.defaultBloodDroplets))),
      gib: opts.gib !== undefined
      ? /^(true|1|yes|on)$/i.test(str(opts, "gib", "false"))
      : !!profile?.gib,
      gibThreshold: Math.max(0, num(opts, "gibThreshold", profile?.gibThreshold ?? CFG.defaultGibThreshold)),
      gibBloodBurst: Math.max(0, Math.min(128, int(opts, "gibBloodBurst", CFG.gibBloodBurst))),
      gibBleedChance: clamp(num(opts, "gibBleedChance", CFG.gibBleedChance), 0, 1),
      gibBleedFrames: Math.max(0, Math.min(120, int(opts, "gibBleedFrames", CFG.gibBleedFrames))),
    }
    ;
  }
// Get or create the procedural weapon audio context; the native host supplies its shared context.
  /* @function Phanicom_ActiveCombat.Core.goldenEyeContext.38 — Get or create the procedural weapon audio context; the native host supplies its shared context. Inputs: no explicit arguments; uses enclosing module state. Updates: golden eye audio ctx. Uses: log. Returns: golden eye audio ctx; null. */ function goldenEyeContext() {
    if (GoldenEyeAudio.ctx) return GoldenEyeAudio.ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      GoldenEyeAudio.ctx = new AC();
      return GoldenEyeAudio.ctx;
    }
    catch (e) {
      log("GoldenEye audio unavailable", e);
      return null;
    }
  }
// Resume suspended procedural audio after a permitted user gesture.
  /* @function Phanicom_ActiveCombat.Core.goldenEyeResume.39 — Resume suspended procedural audio after a permitted user gesture. Inputs: ctx. Uses: ctx resume using catch; ctx resume. */ function goldenEyeResume(ctx) {
    if (ctx && ctx.state === "suspended" && typeof ctx.resume === "function") {
      ctx.resume().catch(/* @function Phanicom_ActiveCombat.Core.callback.40 — Provides the callback for ctx resume using catch. Inputs: no explicit arguments; uses enclosing module state. */ () => {
      }
      );
    }
  }
// Build the source waveshaper curve used by procedural weapon sounds.
  /* @function Phanicom_ActiveCombat.Core.goldenEyeDistortionCurve.41 — Build the source waveshaper curve used by procedural weapon sounds. Inputs: amount. Updates: curve at i. Uses: number. Returns: curve. */ function goldenEyeDistortionCurve(amount) {
    const samples = 256;
    const curve = new Float32Array(samples);
    const k = Math.max(0, Number(amount) || 0);
    for (let i = 0;
    i < samples;
    i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
    }
    return curve;
  }
  // Keep at most 32 idle processing graphs per audio context. Active voices
  // never share a graph: overlapping shots retain their independent envelopes.
  // Sources cannot restart. Compressors retain attack/release history, so they
  // also remain per voice; gains/filter/shaper alone are reusable.
  const idleSoundGraphs=new WeakMap();
  /* @function Phanicom_ActiveCombat.Core.acquireSoundGraph.42 — Handles acquire sound graph within phanicom active combat.core. Inputs: ctx. Updates: idle. Uses: idle sound graphs get; idle sound graphs set; idle pop; ctx create gain. Returns: a record containing graph, idle. */ function acquireSoundGraph(ctx){
    let idle=idleSoundGraphs.get(ctx);
    if(!idle){idle=[];idleSoundGraphs.set(ctx,idle);}
    const graph=idle.pop()||{
      gain:ctx.createGain(),subGain:ctx.createGain(),outputGain:ctx.createGain(),
      filter:ctx.createBiquadFilter(),shaper:ctx.createWaveShaper()
    };
    return {graph,idle};
  }
// Generate the supplied oscillator/noise/filter weapon envelope; preserve its timing when adjusting gain.
  /* @function Phanicom_ActiveCombat.Core.playGoldenEyeWomp.43 — Generate the supplied oscillator/noise/filter weapon envelope; preserve its timing when adjusting gain. Inputs: assignment pattern. Updates: osc type; sub type; filter type; shaper curve; shaper oversample. Uses: golden eye context; golden eye resume; clamp; ctx create oscillator. Returns: without a result; without a result. */ function playGoldenEyeWomp(options = {
  }
  ) {
    if (!CFG.goldenEyeAudio) return;
    const ctx = goldenEyeContext();
    if (!ctx) return;
    goldenEyeResume(ctx);
    const now = ctx.currentTime;
    const duration = clamp(options.duration ?? 0.16, 0.04, 1.2);
    const volumeScale = clamp(options.volumeScale ?? 1.0, 0, 4);
    const volume = clamp((options.volume ?? 0.16) * CFG.goldenEyeStandardVolume * volumeScale, 0.0001, 24.0);
    const startFreq = clamp(options.startFreq ?? 180, 20, 1600);
    const endFreq = clamp(options.endFreq ?? 70, 20, 1600);
    const filterStart = clamp(options.filterStart ?? 900, 80, 6000);
    const filterEnd = clamp(options.filterEnd ?? 260, 60, 6000);
    const attack = clamp(options.attack ?? 0.006, 0.001, duration * 0.35);
    const releaseStart = clamp(options.releaseStart ?? duration * 0.22, attack, duration);
    const osc = ctx.createOscillator();
    const sub = ctx.createOscillator();
    const {graph,idle}=acquireSoundGraph(ctx);
    const {gain,subGain,outputGain,filter,shaper}=graph;
    const compressor=ctx.createDynamicsCompressor();
    // Cancel automation from this graph's previous completed voice before
    // authoring the new envelope. Oscillators remain newly created per shot.
    for(const param of [gain.gain,subGain.gain,outputGain.gain,filter.frequency,filter.Q,
      compressor.threshold,compressor.knee,compressor.ratio,compressor.attack,compressor.release])param.cancelScheduledValues(now);
    osc.type = options.wave || "sine";
    sub.type = "sine";
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    sub.frequency.setValueAtTime(Math.max(20, startFreq * 0.5), now);
    sub.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq * 0.5), now + duration);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(filterStart, now);
    filter.frequency.exponentialRampToValueAtTime(filterEnd, now + duration);
    filter.Q.setValueAtTime(options.q ?? 1.3, now);
    shaper.curve = goldenEyeDistortionCurve(options.drive ?? 0.7);
    shaper.oversample = "2x";
    compressor.threshold.setValueAtTime(-12, now);
    compressor.knee.setValueAtTime(18, now);
    compressor.ratio.setValueAtTime(2.5, now);
    compressor.attack.setValueAtTime(0.003, now);
    compressor.release.setValueAtTime(0.09, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + attack);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * 0.45), now + releaseStart);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * (options.subMix ?? 0.32)), now + attack);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    outputGain.gain.setValueAtTime(CFG.goldenEyeOutputGain, now);
    osc.connect(shaper);
    shaper.connect(filter);
    filter.connect(gain);
    sub.connect(subGain);
    subGain.connect(gain);
    gain.connect(compressor);
    compressor.connect(outputGain);
    outputGain.connect(ctx.destination);
    // A stopped source can leave its filter/compressor graph connected until
    // browser GC. Repeated automatic fire must release that native graph on a
    // bounded schedule. Wait for both sources and a generous compressor tail;
    // none of the original frequencies, gains or envelope times change.
    let endedSources=0;
    const releaseGraph=/* @function Phanicom_ActiveCombat.Core.releaseGraph.44 — Handles release graph within phanicom active combat.core. Inputs: no explicit arguments; uses enclosing module state. Uses: set timeout. Returns: without a result. */ ()=>{
      if(++endedSources!==2)return;
      setTimeout(/* @function Phanicom_ActiveCombat.Core.callback.45 — Provides the callback for set timeout. Inputs: no explicit arguments; uses enclosing module state. Updates: osc onended; sub onended. Uses: node disconnect; idle push. */ ()=>{
        for(const node of [osc,sub,gain,subGain,outputGain,filter,compressor,shaper])node.disconnect();
        osc.onended=sub.onended=null;
        if(ctx.state!=='closed'&&idle.length<32)idle.push(graph);
      },600);
    };
    osc.onended=sub.onended=releaseGraph;
    osc.start(now);
    sub.start(now);
    osc.stop(now + duration + 0.03);
    sub.stop(now + duration + 0.03);
  }
// Select the supplied procedural sound recipe by profile name.
  /* @function Phanicom_ActiveCombat.Core.playGoldenEyeProfile.46 — Select the supplied procedural sound recipe by profile name. Inputs: profile; assignment pattern. Uses: string using profile or "standard" to lower case; string; play golden eye womp; set timeout. Returns: without a result; without a result. */ function playGoldenEyeProfile(profile, volumeScale = 1.0) {
    const p = String(profile || "standard").toLowerCase();
    if (!CFG.goldenEyeAudio || p === "none" || p === "off") return;
    if (p === "shotgun") {
      playGoldenEyeWomp({
        duration: 0.20, startFreq: 155, endFreq: 48, filterStart: 680, filterEnd: 160, volume: 0.46, volumeScale, wave: "triangle", drive: 0.55, subMix: 0.42
      }
      );
      setTimeout(/* @function Phanicom_ActiveCombat.Core.callback.47 — Returns play golden eye womp using a record containing duration, startFreq, endFreq, filterStart, filterEnd, volume, volumeScale, wave. Inputs: no explicit arguments; uses enclosing module state. Uses: play golden eye womp. Returns: play golden eye womp using a record containing duration, startFreq, endFreq, filterStart, filterEnd, volume, volumeScale, wave. */ () => playGoldenEyeWomp({
        duration: 0.12, startFreq: 120, endFreq: 44, filterStart: 520, filterEnd: 140, volume: 0.30, volumeScale, wave: "sine", drive: 0.35, subMix: 0.30
      }
      ), 28);
      return;
    }
    if (p === "large") {
      playGoldenEyeWomp({
        duration: 0.28, startFreq: 115, endFreq: 36, filterStart: 520, filterEnd: 120, volume: 0.34, volumeScale, wave: "sine", drive: 0.50, subMix: 0.55
      }
      );
      return;
    }
    if (p === "plasma") {
      playGoldenEyeWomp({
        duration: 0.20, startFreq: 265, endFreq: 88, filterStart: 1120, filterEnd: 260, volume: 0.30, volumeScale, wave: "sine", drive: 0.38, subMix: 0.28
      }
      );
      return;
    }
    if (p === "cryo") {
      playGoldenEyeWomp({
        duration: 0.24, startFreq: 520, endFreq: 260, filterStart: 1500, filterEnd: 520, volume: 0.20, volumeScale, wave: "sine", drive: 0.18, subMix: 0.08
      }
      );
      return;
    }
    if (p === "grape") {
      playGoldenEyeWomp({
        duration: 0.22, startFreq: 135, endFreq: 42, filterStart: 560, filterEnd: 130, volume: 0.46, volumeScale, wave: "triangle", drive: 0.42, subMix: 0.45
      }
      );
      return;
    }
// Standard handgun / rifle projectile family.
    playGoldenEyeWomp({
      duration: 0.13, startFreq: 210, endFreq: 72, filterStart: 820, filterEnd: 220, volume: 0.34, volumeScale, wave: "triangle", drive: 0.45, subMix: 0.24
    }
    );
  }
  const profiles=parseStructArray(params.WeaponProfiles).map(compileWeaponProfile).filter(Boolean),WEAPON_PROFILES=new Map(),ENEMY_COMBAT_PROFILES=new Map();
  for(const p of profiles){
    WEAPON_PROFILES.set(profileKey(p.id),p);
    WEAPON_PROFILES.set(profileKey(p.displayName),p);
  }
  for(const p of parseStructArray(params.EnemyCombatProfiles).map(compileEnemyCombatProfile).filter(Boolean))ENEMY_COMBAT_PROFILES.set(p.id,p);
  root.PhanicomCombatCore={
    profiles,CFG,parseWeaponItem,parseCombatEvent,parseWeaponNote,parseStructArray,shotgunDirections,applySpread,playGoldenEyeProfile,/* @function Phanicom_ActiveCombat.Core.setAudioContext.48 — Handles set audio context within phanicom active combat.core. Inputs: ctx. Updates: golden eye audio ctx. */ setAudioContext(ctx){
      GoldenEyeAudio.ctx=ctx;
    }
    ,/* @function Phanicom_ActiveCombat.Core.setVolume.49 — Handles set volume within phanicom active combat.core. Inputs: value. Updates: cfg golden eye output gain. Uses: number. */ setVolume(value){
      CFG.goldenEyeOutputGain=Number(params.GoldenEyeOutputGain||6)*value;
    }
  }
  ;
}
)(window);
