/* Team/target policy shared by companion and enemy combat controllers. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function party-combat.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier party combat. */
(/* @function party-combat.installReviewed — Installs shared team/target policy for companion and enemy combat. Registration does not choose an active target, inflict damage or alter an authored actor profile. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  const alive =
    /* Historical contract retained; October 14 reviewed explanation follows. @function party-combat.alive.2 — Returns e and the inverse of e dead and e hp is greater than 0. Inputs: e. Returns: e and the inverse of e dead and e hp is greater than 0. */
  /* @function party-combat.reviewedalive_2 — Tests combat life state. Inputs: nullable e. Returns truthy only present, not dead and hp>0. No mutation; missing HP is not treated as living. */ (
      e,
    ) => e && !e.dead && e.hp > 0;
  /* Historical contract retained; October 14 reviewed explanation follows. @function party-combat.allied.3 — Handles allied within party combat. Inputs: game; e. Uses: game party membership has; string. Returns: chain equals game player id or the inverse of the inverse of chain and chain. */
  /* @function party-combat.reviewedallied_3 — Tests player-team membership. Inputs: game and nullable actor e. Returns boolean for player ID or partyActorId contained as string in current partyMembership. No mutation; missing membership excludes companions, assumes game.player exists. */ function allied(
    game,
    e,
  ) {
    return (
      e?.id === game.player.id ||
      !!(e?.partyActorId && game.partyMembership?.has(String(e.partyActorId)))
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function party-combat.target.4 — Handles target within party combat. Inputs: game; actor. Uses: allied; a list of spread element filter using a callback sort; a list of spread element filter; game runtime entities values. Returns: a list of spread element filter using a callback sort using a callback at 0 or null. */
  /* @function party-combat.reviewedtarget_4 — Chooses nearest living opponent for actor. Inputs: game with runtime registry and actor. Returns original entity or null; allies target nonallied hostile/aggressive monsters, enemies target allied team. Sorts detached candidate list by XY metre distance then stable lexical ID. No line-of-sight/range check or damage here; combat controller owns those. Registry/identity errors propagate. */ function target(
    game,
    actor,
  ) {
    const friend = allied(game, actor);
    return (
      [...game.runtime.entities.values()]
        .filter(
          /* Historical contract retained; October 14 reviewed explanation follows. @function party-combat.callback.5 — Returns e id does not equal actor id and alive using e and friend selects e kind equals "monster" and the inverse of allied using game, e and e hostile does not equal false or e aggro or allied using game, e. Inputs: e. Uses: alive; allied. Returns: e id does not equal actor id and alive using e and friend selects e kind equals "monster" and the inverse of allied using game, e and e hostile does not equal false or e aggro or allied using game, e. */
  /* @function party-combat.reviewedcallback_5 — Filters valid opponent for actor team. Inputs: entity e and captured actor/game/friend flag. Returns boolean excluding self/dead and applying hostile-monster or player-team policy. No mutation. */ (
            e,
          ) =>
            e.id !== actor.id &&
            alive(e) &&
            (friend
              ? e.kind === "monster" &&
                !allied(game, e) &&
                (e.hostile !== false || e.aggro)
              : allied(game, e)),
        )
        .sort(
          /* Historical contract retained; October 14 reviewed explanation follows. @function party-combat.callback.6 — Returns math hypot using a x minus actor x, a y minus actor y minus math hypot using b x minus actor x, b y minus actor y or a id locale compare using b id. Inputs: a; b. Uses: a id locale compare. Returns: math hypot using a x minus actor x, a y minus actor y minus math hypot using b x minus actor x, b y minus actor y or a id locale compare using b id. */
  /* @function party-combat.reviewedcallback_6 — Orders candidate opponents by distance and stable ID. Inputs: a/b and captured actor. Returns XY distance difference or lexical ID tie-breaker; only detached list sorting changes. Elevation not included. */ (
            a,
            b,
          ) =>
            Math.hypot(a.x - actor.x, a.y - actor.y) -
              Math.hypot(b.x - actor.x, b.y - actor.y) ||
            a.id.localeCompare(b.id),
        )[0] || null
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function party-combat.canDamage.7 — Handles can damage within party combat. Inputs: game; source; victim. Uses: allied. Returns: true; chain equals true or the inverse of allied using game, source and allied using game, victim. */
  /* @function party-combat.reviewedcanDamage_7 — Applies player-team friendly-fire policy. Inputs: game, source and victim. Returns true for absent source/victim or explicit party.friendlyFire, otherwise false only when both allied. No damage/state mutation; source attribution validation is caller-owned. */ function canDamage(
    game,
    source,
    victim,
  ) {
    if (!source || !victim) return true;
    return (
      game.sourceWorld?.extensions?.party?.friendlyFire === true ||
      !(allied(game, source) && allied(game, victim))
    );
  }
  // Cooldowns belong to simulation time, not acquisition state. Returning and
  // idle actors recover too; the host invokes this once before event movement.
  /* Historical contract retained; October 14 reviewed explanation follows. @function party-combat.advanceCooldowns.8 — idle actors recover too; the host invokes this once before event movement. Inputs: actors; dt. Updates: e stun time; e attack time. Uses: number is finite. Returns: without a result. */
  /* @function party-combat.reviewedadvanceCooldowns_8 — Decrements living monster stun/attack recovery in simulation time. Inputs: iterable actors and dt seconds. Returns undefined; invalid/nonpositive time ignored, dead/nonmonster records skipped. Mutates cooldowns clamped at zero, regardless of acquisition/return phase so idle actors recover. Host must call once per simulation update; malformed actor records may throw. */ function advanceCooldowns(
    actors,
    dt,
  ) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    for (const e of actors) {
      if (e.kind !== "monster" || e.dead) continue;
      e.stunTime = Math.max(0, (e.stunTime || 0) - dt);
      e.attackTime = Math.max(0, (e.attackTime || 0) - dt);
    }
  }
  root.FrontierPartyCombat = {
    allied,
    target,
    alive,
    canDamage,
    advanceCooldowns,
  };
})(typeof window === "undefined" ? globalThis : window);
