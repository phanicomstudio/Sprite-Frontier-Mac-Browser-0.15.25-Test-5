/* Explicit aggression owns encounter/music state. Enemy awareness is separate
 * from attack range: passive NPCs never trigger combat merely by being nearby.
 * Damage can provoke an enemy; configurable leash/calm timing ends pursuit. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function aggro.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier aggro. */
(/* @function aggro.installReviewed — Installs explicit aggression/encounter-state evaluation. Enemy awareness, damage provocation and leash/calm timing are separate from weapon attack range; registration does not engage combat. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function aggro.enemies.2 — Handles enemies within aggro. Inputs: game. Uses: a list of spread element, spread element filter. Returns: a list of spread element, spread element filter using a callback. */
  /* @function aggro.reviewedenemies_2 — Collects monsters from current frontier entities and scene events. Inputs: game. Returns a new array retaining original actor references, including dead actors for update to clear. Does not mutate or select followers/props; malformed game entities throw. */ function enemies(
    game,
  ) {
    return [...game.maps.frontier.entities, ...(game.sceneEvents || [])].filter(
      /* Historical contract retained; October 14 reviewed explanation follows. @function aggro.callback.3 — Returns e kind equals "monster". Inputs: e. Returns: e kind equals "monster". */
  /* @function aggro.reviewedcallback_3 — Recognizes a monster record. Inputs: candidate e. Returns true only for kind monster. No mutation; callers provide non-null entity records. */ (
        e,
      ) => e.kind === "monster",
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function aggro.update.4 — Advances this system using the current state and elapsed time. Inputs: game; dt. Updates: e aggro; e aggro timer; active; game in combat. Uses: rule; root frontier activity actors; enemies; root frontier party combat target. */
  /* @function aggro.reviewedupdate_4 — Updates enemy aggression and shared encounter state. Inputs: game and elapsed dt seconds. Returns nothing; clears dead/untargetable actors, follows behavior-owned chase phases, acquires hostile targets within XY metre detection range and releases pursuit after leash or calm timeout. Mutates aggro/timer and game.inCombat, respecting explicit exploration/combat overrides. Uses live party targeting and activity candidates when installed; expects valid rules/game records and propagates dependency errors. */ function update(
    game,
    dt,
  ) {
    let active = false;
    const rule =
        /* Historical contract retained; October 14 reviewed explanation follows. @function aggro.rule.5 — Returns root frontier parameters get using game source world, name. Inputs: name. Uses: root frontier parameters get. Returns: root frontier parameters get using game source world, name. */
  /* @function aggro.reviewedrule_5 — Reads a normalized aggression parameter from the active authored cell. Inputs: parameter name and captured game. Returns FrontierParameters.get result; no mutation. Missing parameter service propagates an error. */ (
          name,
        ) => root.FrontierParameters.get(game.sourceWorld, name),
      calm = rule("aggroCalm");
    for (const e of root.FrontierActivity
      ? root.FrontierActivity.actors(game)
      : enemies(game)) {
      const target = root.FrontierPartyCombat
        ? root.FrontierPartyCombat.target(game, e)
        : game.player;
      if (e.dead || e.hp <= 0 || !target || target.hp <= 0) {
        e.aggro = false;
        e.aggroTimer = 0;
        continue;
      }
      // Authored behavior owns acquisition/leash/return as well as locomotion.
      // Combat still owns attacks, but cannot independently restart a return.
      if (e.behaviorOwned) {
        e.aggro = e.behaviorPhase === "chase";
        e.aggroTimer = 0;
        if (e.aggro) active = true;
        continue;
      }
      const distance = Math.hypot(e.x - target.x, e.y - target.y),
        detect = e.aggroRange ?? e.combat?.aggroRange ?? rule("aggroRange"),
        leash = e.leashRange ?? rule("aggroLeash");
      if (e.hostile !== false && distance < detect) {
        e.aggro = true;
        e.aggroTimer = calm;
      } else if (e.aggro) {
        e.aggroTimer = Math.max(0, (e.aggroTimer ?? calm) - dt);
        if (distance > leash || e.aggroTimer <= 0) e.aggro = false;
      }
      if (e.aggro) active = true;
    }
    game.inCombat =
      game.combatOverride === "combat"
        ? game.player.hp > 0
        : game.combatOverride === "exploration"
          ? false
          : active;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function aggro.provoke.6 — Handles provoke within aggro. Inputs: game; id. Updates: e aggro; e aggro timer. Uses: game runtime entities get. */
  /* @function aggro.reviewedprovoke_6 — Starts short damage-provoked aggression for an existing living monster. Inputs: game and runtime entity ID. Returns nothing; sets aggro true and timer to three seconds. Missing IDs, dead actors and non-monsters are ignored. Does not set game.inCombat until update; malformed registry throws. */ function provoke(
    game,
    id,
  ) {
    const e = game.runtime.entities.get(id);
    if (e?.kind === "monster" && !e.dead && e.hp > 0) {
      e.aggro = true;
      e.aggroTimer = 3;
    }
  }
  root.FrontierAggro = { update, provoke, enemies };
})(typeof window === "undefined" ? globalThis : window);
