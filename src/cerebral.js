/* Blood/Cerebral authoring and proximity effects. One world unit is one tile for
 * these rules, independent of the visible grid spacing. No per-frame asset loads. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function cerebral.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier cerebral. */
(/* @function cerebral.installReviewed — Installs Blood/Cerebral authoring and proximity-effect services. These rules use one world unit per tile independent of visible grid spacing; initialization does not load assets each frame. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  const defaults = {
    max: 100,
    thresholds: [90, 70, 30],
    amount: 5,
    interval: 3,
    radius: 5,
    transition: 0.75,
    melee: {
      name: "Melee weapon",
      damage: 12,
      range: 1.5,
      arc: 90,
      cooldown: 0.6,
      spriteProfile: "",
    },
  };
  /* Historical contract retained; October 14 reviewed explanation follows. @function cerebral.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Uses: number is finite; error; array is array; r thresholds some. Returns: a record containing max, thresholds, amount, interval, radius, transition, melee. */
  /* @function cerebral.reviewedvalidate_2 — Normalizes authored Cerebral/proximity/melee rules. Inputs: optional partial v. Returns detached supported fields and nested melee record. Checks maximum1-10000, amount0-1000, interval0.1-60 seconds, radius0.1-128 metres, transition0-3 seconds and3 strictly descending percentage thresholds0-100. Melee damage1-1000, range0.1-8 metres, arc1-180 degrees, cooldown0.1-10 seconds plus bounded name/profile. Throws invalid values, unknown fields omitted, no source mutation. */ function validate(
    v = {},
  ) {
    const r = { ...defaults, ...v, melee: { ...defaults.melee, ...v.melee } };
    for (const [k, min, max] of [
      ["max", 1, 10000],
      ["amount", 0, 1000],
      ["interval", 0.1, 60],
      ["radius", 0.1, 128],
      ["transition", 0, 3],
    ])
      if (!Number.isFinite(r[k]) || r[k] < min || r[k] > max)
        throw Error("Invalid Cerebral " + k);
    if (
      !Array.isArray(r.thresholds) ||
      r.thresholds.length !== 3 ||
      r.thresholds.some(
        /* Historical contract retained; October 14 reviewed explanation follows. @function cerebral.callback.3 — Returns the inverse of number is finite using n or n is less than 0 or n is greater than 100. Inputs: n. Uses: number is finite. Returns: the inverse of number is finite using n or n is less than 0 or n is greater than 100. */
  /* @function cerebral.reviewedcallback_3 — Detects invalid Cerebral threshold percentage. Inputs: n. Returns true nonfinite/outside0-100; no mutation. */ (
          n,
        ) => !Number.isFinite(n) || n < 0 || n > 100,
      ) ||
      r.thresholds.some(
        /* Historical contract retained; October 14 reviewed explanation follows. @function cerebral.callback.4 — Returns i and n is at least r thresholds at i minus 1. Inputs: n; i. Returns: i and n is at least r thresholds at i minus 1. */
  /* @function cerebral.reviewedcallback_4 — Detects non-descending Cerebral thresholds. Inputs: n/index i with captured array. Returns truthy when later value>=previous, first index0 falsey. No mutation. */ (
          n,
          i,
        ) => i && n >= r.thresholds[i - 1],
      )
    )
      throw Error("Cerebral thresholds must descend.");
    const m = r.melee;
    if (
      typeof m.name !== "string" ||
      !m.name.trim() ||
      m.name.length > 80 ||
      typeof m.spriteProfile !== "string" ||
      m.spriteProfile.length > 100
    )
      throw Error("Invalid melee name/sprite profile");
    for (const [k, min, max] of [
      ["damage", 1, 1000],
      ["range", 0.1, 8],
      ["arc", 1, 180],
      ["cooldown", 0.1, 10],
    ])
      if (!Number.isFinite(m[k]) || m[k] < min || m[k] > max)
        throw Error("Invalid melee " + k);
    return {
      max: r.max,
      thresholds: [...r.thresholds],
      amount: r.amount,
      interval: r.interval,
      radius: r.radius,
      transition: r.transition,
      melee: {
        name: m.name,
        damage: m.damage,
        range: m.range,
        arc: m.arc,
        cooldown: m.cooldown,
        spriteProfile: m.spriteProfile,
      },
    };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function cerebral.band.5 — Handles band within cerebral. Inputs: value; max; thresholds. Returns: pct is at most thresholds at 2 selects 3 or pct is at most thresholds at 1 selects 2 or pct is at most thresholds at 0 selects 1 or 0. */
  /* @function cerebral.reviewedband_5 — Classifies current Cerebral percentage for portrait/effects. Inputs: value/max units and3 descending percentage thresholds. Returns band0-3 after percentage clamp0-100, equality enters lower band. No mutation; validated positive max/thresholds assumed. */ function band(
    value,
    max,
    thresholds,
  ) {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    return pct <= thresholds[2]
      ? 3
      : pct <= thresholds[1]
        ? 2
        : pct <= thresholds[0]
          ? 1
          : 0;
  }
  // Nearby scenery uses the existing spatial index. Leaving range clears the timer;
  // re-entering starts a full interval, avoiding invisible distant damage.
  /* Historical contract retained; October 14 reviewed explanation follows. @function cerebral.update.6 — re-entering starts a full interval, avoiding invisible distant damage. Inputs: game; dt. Updates: p cerebral; game cerebral timers; elapsed. Uses: root frontier activity query; active add; game cerebral timers get; game cerebral timers set. Returns: without a result. */
  /* @function cerebral.reviewedupdate_6 — Applies nearby Cerebral drain on simulation clock. Inputs: game and dt seconds. Returns undefined; initializes player value/default and per-source timer Map, no drain dead player. Queries spatial index then exact XY radius, retains timers for active cerebralSource IDs, applies one amount when interval reached and keeps remainder modulo interval. Large dt does not apply multiple catch-up losses. Leaving range deletes timer so re-entry starts full interval. Mutates live player/timers only; no line-of-sight/Z/dead-source filter here. Validated dt/rules/index assumed, service errors propagate. */ function update(
    game,
    dt,
  ) {
    const rules = game.sourceWorld.cerebral || defaults,
      p = game.player;
    p.cerebral ??= rules.max;
    if (p.hp <= 0) return;
    game.cerebralTimers ||= new Map();
    const nearby = root.FrontierActivity.query(
        game,
        p.x - rules.radius,
        p.y - rules.radius,
        p.x + rules.radius,
        p.y + rules.radius,
        true,
      ),
      active = new Set();
    for (const e of nearby) {
      if (!e.cerebralSource || Math.hypot(e.x - p.x, e.y - p.y) > rules.radius)
        continue;
      active.add(e.id);
      let elapsed = (game.cerebralTimers.get(e.id) || 0) + dt;
      if (elapsed >= rules.interval) {
        p.cerebral = Math.max(0, p.cerebral - rules.amount);
        elapsed %= rules.interval;
      }
      game.cerebralTimers.set(e.id, elapsed);
    }
    for (const id of game.cerebralTimers.keys())
      if (!active.has(id)) game.cerebralTimers.delete(id);
  }
  // Starter melee uses the same ported hit/arc/cooldown logic as other profiles.
  /* Historical contract retained; October 14 reviewed explanation follows. @function cerebral.configure.7 — Starter melee uses the same ported hit/arc/cooldown logic as other profiles. Inputs: game. Updates: game player cerebral. Uses: root phanicom abs weapons get; root phanicom abs weapons set; structured clone. */
  /* @function cerebral.reviewedconfigure_7 — Registers authored starter-melee profile and resets fresh player Cerebral. Inputs: game. Returns undefined; clones global handgun baseline, overwrites starter-melee entry with authored damage/range/arc(degrees to radians)/cooldown(seconds to60Hz frames), disables ammunition/audio and sets player value to rules.max. This affects shared weapon registry; owner invokes during fresh session setup, not save restoration. Missing baseline/registry/clone failures propagate; authored world unchanged. */ function configure(
    game,
  ) {
    const rules = game.sourceWorld.cerebral || defaults,
      m = rules.melee,
      base = root.PhanicomABS.weapons.get("handgun");
    root.PhanicomABS.weapons.set("starter-melee", {
      ...structuredClone(base),
      id: "starter-melee",
      profileId: "starter-melee",
      name: m.name,
      profileName: m.name,
      type: "melee",
      family: "melee",
      damageType: "melee",
      damage: m.damage,
      range: m.range,
      arcRadians: (m.arc * Math.PI) / 180,
      maxTargets: 1,
      cooldown: m.cooldown * 60,
      fireMode: "semi",
      ammoCost: 0,
      magazineSize: 12,
      sound: "",
      audioProfile: "none",
      spriteProfile: m.spriteProfile,
    });
    game.player.cerebral = rules.max;
  }
  root.FrontierCerebral = { defaults, validate, band, update, configure };
})(typeof window === "undefined" ? globalThis : window);
