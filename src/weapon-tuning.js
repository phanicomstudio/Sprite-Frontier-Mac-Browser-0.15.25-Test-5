/* Per-weapon angular deviation, stored with authored maps and project saves.
 * Values are Gaussian standard deviations in degrees, not a hard cone limit. */
/* October 13, 2026: the short generated descriptions below remain as history.
 * The adjacent contracts clarify the unchanged units and validation behavior. */
/* Historical: @function weapon-tuning.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier weapon tuning. */
(/* @function weaponTuning.install — Inputs: browser global root. Returns: nothing; installs FrontierWeaponTuning once at script load. No world mutation, asset loading or per-frame allocation occurs here. Requires a writable browser global. */ function (
  root,
) {
  "use strict";
  /* Historical: @function weapon-tuning.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: array is array; object keys; error; object entries. Returns: result. */
  /* @function weaponTuning.validate — Inputs: optional dictionary of weapon profile IDs to Gaussian angular deviations, in degrees. Returns: a detached dictionary with at most 64 own enumerable entries. Throws before adoption for non-object/array input, invalid IDs, nonfinite values or values outside 0–30 degrees. Does not mutate the supplied draft; safe own-property definition also handles names inherited by ordinary objects. */ function validate(
    value = {},
  ) {
    // Accept at most 64 profile overrides; values are Gaussian standard deviations
    // in degrees. Validation builds a detached result, never changing the draft.
    if (
      !value ||
      typeof value !== "object" ||
      Array.isArray(value) ||
      Object.keys(value).length > 64
    )
      throw Error("Invalid weapon spread settings.");
    const result = {};
    for (const [id, degrees] of Object.entries(value)) {
      if (
        !/^[a-z0-9_-]{1,64}$/i.test(id) ||
        !Number.isFinite(degrees) ||
        degrees < 0 ||
        degrees > 30
      )
        throw Error("Weapon spread must be between 0 and 30 degrees.");
      Object.defineProperty(result, id, {
        value: degrees,
        enumerable: true,
        writable: true,
        configurable: true,
      });
    }
    return result;
  }
  /* Historical: @function weapon-tuning.degrees.3 — Handles degrees within weapon tuning. Inputs: world; weapon. Returns: chain or the fallback weapon id equals "handgun" selects 0.5 or weapon spread radians or 0 multiplied by 180 divided by math pi. */
  /* @function weaponTuning.degrees — Inputs: optional authored world and a valid equipped weapon profile with id and optional spreadRadians. Returns: Gaussian deviation in degrees; an explicit map override, including zero, wins. Otherwise the handgun retains its historical 0.5-degree default; other profiles convert their radian default, or zero. Read-only and allocation-free; callers validate drafts and supply a weapon rather than null. */ function degrees(
    world,
    weapon,
  ) {
    return (
      world?.weaponSpreads?.[weapon.id] ??
      (weapon.id === "handgun"
        ? 0.5
        : ((weapon.spreadRadians || 0) * 180) / Math.PI)
    );
  }
  /* Historical: @function weapon-tuning.radians.4 — Returns degrees using world, weapon multiplied by math pi divided by 180. Inputs: world; weapon. Uses: degrees. Returns: degrees using world, weapon multiplied by math pi divided by 180. */
  root.FrontierWeaponTuning = {
    validate,
    degrees,
    radians:
      /* @function weaponTuning.radians — Inputs: optional world and equipped weapon, under degrees()'s contract. Returns: the selected Gaussian angular deviation converted to radians for native projectile aiming. Reads profile/map state without changing it; no random sampling occurs in this conversion. */ (
        world,
        weapon,
      ) => (degrees(world, weapon) * Math.PI) / 180,
  };
})(window);
