/* MAINTAINER GUIDE
 * Original Frontier damage, reload, holster and loot rules. ActiveCombat replaces firing and wraps impact handling; other inherited rules still execute. Use adapter services instead of introducing renderer dependencies.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/*
 * DIRECT CLASSIC-SCRIPT SOURCE // v0.20.2d
 * -------------------------------------
 * This file is loaded directly by index.html. There are no ES modules and no
 * build step. Public names are attached to window.MF; private helpers stay
 * inside this IIFE so different files cannot accidentally collide.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function combat.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf resolve projectile impact; mf toggle holster; mf reload; mf fire shot. */
(/* @function combat.installReviewed — Installs preserved Frontier combat/reload/holster/loot entry points. ActiveCombat later replaces firing/impact integration while inherited remaining rules still execute through adapter services; this initializer does not perform attacks. Inputs: existing MF engine namespace MF. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  MF,
) {
  "use strict";
  // Dependencies supplied by earlier <script> tags.
  const screenToIso = MF.screenToIso;
  const hitTest = MF.hitTest;
  /* Combat owns ammunition, feedback and impact consequences. Projectile motion
   * and physical contact belong to projectiles.js. Both firing models call the
   * same impact policy; item JSON supplies damage, spread and ballistic tuning.
   * Breakable targets retain prototype debris/loot and protected NPC behavior.
   */
  /** SPACE key: toggle equipped pistol between holstered and drawn. */
  /* @function combat.toggleHolster.2 — SPACE key: toggle equipped pistol between holstered and drawn. Inputs: game; ui. Updates: game player holstered; game player facing x; game player facing y. Uses: ui log; mf update aim; game audio play at; ui update weapon hud. Returns: without a result. */ function toggleHolster(
    game,
    ui,
  ) {
    if (!game.player.weapon) {
      ui.log("You are unarmed.");
      return;
    }
    game.player.holstered = !game.player.holstered;
    if (game.player.holstered) {
      const f = game.player.movementFacing || {
        x: 1,
        y: 0,
      };
      game.player.facingX = f.x;
      game.player.facingY = f.y;
    } else MF.updateAim(game);
    game.audio?.playAt("reloadClick", game.player.x, game.player.y, {
      volume: 0.62,
      maxDistance: 3,
    });
    ui.updateWeaponHUD();
    ui.log(
      game.player.weapon.name +
        (game.player.holstered ? " holstered." : " drawn."),
    );
    ui.updateHover();
  }
  /** R key: move reserve rounds into the current magazine up to magazineSize. */
  /* @function combat.reload.3 — R key: move reserve rounds into the current magazine up to magazineSize. Inputs: game; ui. Updates: p ammo loaded; p ammo reserve. Uses: ui log; game audio play at; set timeout; ui update weapon hud. Returns: without a result; without a result. */ function reload(
    game,
    ui,
  ) {
    const p = game.player;
    if (!p.weapon) {
      ui.log("Nothing to reload.");
      return;
    }
    if (p.holstered) {
      ui.log("Draw the weapon first [SPACE].");
      return;
    }
    const magSize = p.weapon.magazineSize || 6;
    if (p.ammoLoaded >= magSize) {
      ui.log("Magazine is already full.");
      return;
    }
    if (p.ammoReserve <= 0) {
      ui.log("No reserve ammunition.");
      return;
    }
    const take = Math.min(magSize - p.ammoLoaded, p.ammoReserve);
    p.ammoLoaded += take;
    p.ammoReserve -= take;
    // Prototype reload Foley: two project-local mechanical samples layered with a tiny
    // delay. The audio system supplies procedural fallbacks if they are offline.
    game.audio?.playAt("reloadMetal", p.x, p.y, {
      volume: 0.9,
      maxDistance: 4,
    });
    setTimeout(
      /* @function combat.callback.4 — Returns chain. Inputs: no explicit arguments; uses enclosing module state. Uses: game audio play at. Returns: chain. */ () =>
        game.audio?.playAt("reloadClick", p.x, p.y, {
          volume: 0.95,
          maxDistance: 4,
        }),
      115,
    );
    ui.updateWeaponHUD();
    ui.log(
      `Reloaded ${take} round${take === 1 ? "" : "s"}. ${p.ammoLoaded}/${magSize} loaded.`,
    );
  }
  /** Gaussian random number used for natural-looking shot scatter. */
  /* @function combat.randomNormal.5 — Gaussian random number used for natural-looking shot scatter. Inputs: no explicit arguments; uses enclosing module state. Updates: u; v. Returns: math sqrt using - 2 multiplied by math log using u multiplied by math cos using 2 multiplied by math pi multiplied by v. */ function randomNormal() {
    let u = 0,
      v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  /** Persist a small ground impact mark, capped so the array cannot grow forever. */
  /* @function combat.addGroundHole.6 — Persist a small ground impact mark, capped so the array cannot grow forever. Inputs: game; x; y. Uses: game bullet holes push; game bullet holes shift. */ function addGroundHole(
    game,
    x,
    y,
  ) {
    game.bulletHoles.push({
      map: game.currentMapId,
      surface: "ground",
      x,
      y,
    });
    if (game.bulletHoles.length > 160) game.bulletHoles.shift();
  }
  /**
   * Emit directional blood particles. `forceX/forceY` is normally the bullet
   * direction from shooter -> target, so the spray reads as impact rather than a
   * symmetric fireworks burst.
   */
  /* @function combat.spawnBloodBurst.7 — Emit directional blood particles. `forceX/forceY` is normally the bullet direction from shooter -> target, so the spray reads as impact rather than a symmetric fireworks burst. Inputs: game; e; force x; force y; assignment pattern; assignment pattern. Uses: game particles push. */ function spawnBloodBurst(
    game,
    e,
    forceX,
    forceY,
    count = 24,
    violent = false,
  ) {
    const fm = Math.hypot(forceX, forceY) || 1;
    const dx = forceX / fm;
    const dy = forceY / fm;
    for (let i = 0; i < count; i++) {
      const side = (Math.random() - 0.5) * (violent ? 2.5 : 1.7);
      const speed =
        (violent ? 0.9 : 0.5) + Math.random() * (violent ? 2.8 : 1.7);
      game.particles.push({
        map: game.currentMapId,
        kind: "blood",
        x: e.x + (Math.random() - 0.5) * 0.12,
        y: e.y + (Math.random() - 0.5) * 0.12,
        z: 24 + Math.random() * 32,
        vx: dx * speed + -dy * side,
        vy: dy * speed + dx * side,
        vz: 1.4 + Math.random() * (violent ? 4.4 : 3.0),
        color:
          Math.random() < 0.18
            ? "#a01818"
            : Math.random() < 0.5
              ? "#7d0b0c"
              : "#560708",
        life: 0.75 + Math.random() * (violent ? 1.35 : 0.9),
        size: 2 + Math.random() * (violent ? 5 : 3.5),
      });
    }
  }
  /** Put a larger pooled stain under a killed target immediately. */
  /* @function combat.addDeathPool.8 — Put a larger pooled stain under a killed target immediately. Inputs: game; e; dir x; dir y. Uses: game blood stains push; game blood stains shift. */ function addDeathPool(
    game,
    e,
    dirX,
    dirY,
  ) {
    game.bloodStains.push({
      map: game.currentMapId,
      x: e.x + dirX * 0.1,
      y: e.y + dirY * 0.1,
      size: 17 + Math.random() * 10,
      stretch: 0.52 + Math.random() * 0.28,
      rotation: Math.atan2(dirY, dirX) + (Math.random() - 0.5) * 0.8,
      alpha: 0.62,
      color: "#560708",
    });
    if (game.bloodStains.length > 180) game.bloodStains.shift();
  }
  /**
   * Attacking one faction member flips the lightweight world faction record.
   * This is intentionally not a full reputation system yet; it is enough to
   * prove shared hostility without hard-coding specific actor ids into AI.
   */
  /* @function combat.provokeFaction.9 — Attacking one faction member flips the lightweight world faction record. This is intentionally not a full reputation system yet; it is enough to prove shared hostility without hard-coding specific actor ids into AI. Inputs: game; e; ui. Updates: game world factions; game world factions at e faction; f reputation; f status; f hostile. Uses: game runtime events emit; ui log. Returns: without a result; without a result. */ function provokeFaction(
    game,
    e,
    ui,
  ) {
    if (!e?.faction) return;
    game.world.factions ||= {};
    const f = (game.world.factions[e.faction] ||= {
      reputation: 0,
      status: "neutral",
    });
    if (f.status === "hostile") return;
    f.reputation = -100;
    f.status = "hostile";
    f.hostile = true;
    game.runtime?.events.emit("faction.changed", {
      faction: e.faction,
      reputation: f.reputation,
      status: f.status,
      sourceId: "player",
    });
    ui.log(`${e.faction} reputation: HOSTILE.`);
  }
  /** Record authored kill-groups so content can react after a whole local group dies. */
  /* @function combat.updateKillGroup.10 — Record authored kill-groups so content can react after a whole local group dies. Inputs: game; e. Updates: game world kill groups; game world kill groups at group; state killed at e id; state cleared; game world flags. Uses: object values; object keys; game runtime events emit. Returns: without a result; without a result. */ function updateKillGroup(
    game,
    e,
  ) {
    const group = e.killGroup;
    if (!group) return;
    game.world.killGroups ||= {};
    const state = (game.world.killGroups[group] ||= {
      killed: {},
      cleared: false,
    });
    state.killed[e.id] = true;
    if (state.cleared) return;
    let total = 0;
    for (const map of Object.values(game.runtime?.content?.maps || {})) {
      for (const inst of map.actors || []) {
        if (inst.overrides?.killGroup === group) total++;
      }
    }
    if (total > 0 && Object.keys(state.killed).length >= total) {
      state.cleared = true;
      if (e.clearFlag) {
        game.world.flags ||= {};
        game.world.flags[e.clearFlag] = true;
        game.runtime?.events.emit("world.flagChanged", {
          flag: e.clearFlag,
          value: true,
        });
      }
      game.runtime?.events.emit("actor.killGroupCleared", {
        group,
        total,
      });
    }
  }
  /** Apply one 9mm hit and begin knock-down physics at 0 HP. */
  /* @function combat.hitMonster.11 — Apply one 9mm hit and begin knock-down physics at 0 HP. Inputs: game; e; ui; damage; shot. Updates: e hp; e hit vx; e hit vy; e stun time; e dead. Uses: game runtime entities get; number; game runtime events emit; spawn blood burst. Returns: without a result. */ function hitMonster(
    game,
    e,
    ui,
    damage,
    shot,
  ) {
    const owner = game.runtime?.entities.get(shot?.ownerId) || game.player;
    const dx = e.x - owner.x,
      dy = e.y - owner.y,
      d = Math.hypot(dx, dy) || 1;
    const dirX = shot?.direction?.x ?? dx / d,
      dirY = shot?.direction?.y ?? dy / d;
    const dealt = Math.max(1, Number(damage) || 1);
    e.hp = Math.max(0, (e.hp ?? 1) - dealt);
    game.runtime?.events.emit("actor.damaged", {
      actorId: e.id,
      amount: dealt,
      hp: e.hp,
      sourceId: shot?.ownerId || "player",
      weaponId: shot?.weaponId,
      damageType: shot?.damageType || "ballistic",
    });
    e.hitVx = (e.hitVx || 0) + dirX * 1.15 + (Math.random() - 0.5) * 0.22;
    e.hitVy = (e.hitVy || 0) + dirY * 1.15 + (Math.random() - 0.5) * 0.22;
    e.stunTime = 0.16;
    if (e.hp > 0) {
      spawnBloodBurst(game, e, dirX, dirY, 24, false);
      game.audio?.playAt("monsterHit", e.x, e.y, {
        volume: 0.95,
        maxDistance: 9,
        rate: 0.94 + Math.random() * 0.1,
      });
      ui.log(
        `${e.name} takes ${dealt} damage and staggers. ${e.hp}/${e.maxHp || e.hp} HP.`,
      );
      return;
    }
    e.dead = true;
    e.fallTime = 0;
    e.walkTime = 0;
    e.vx = e.vy = 0;
    e.deathVx =
      dirX * (2.1 + Math.random() * 1.3) + (Math.random() - 0.5) * 0.45;
    e.deathVy =
      dirY * (2.1 + Math.random() * 1.3) + (Math.random() - 0.5) * 0.45;
    e.deathRotation =
      (Math.random() < 0.5 ? -1 : 1) * (0.95 + Math.random() * 0.55);
    e.corpseAngle = (Math.random() - 0.5) * 0.48;
    spawnBloodBurst(game, e, dirX, dirY, 58, true);
    addDeathPool(game, e, dirX, dirY);
    game.audio?.playAt("monsterDeath", e.x, e.y, {
      volume: 1,
      maxDistance: 10,
      rate: 0.92 + Math.random() * 0.1,
    });
    updateKillGroup(game, e);
    game.runtime?.events.emit("actor.killed", {
      actorId: e.id,
      sourceId: shot?.ownerId || "player",
      weaponId: shot?.weaponId,
      faction: e.faction || null,
      killGroup: e.killGroup || null,
    });
    ui.log(`${e.name} folds into the dust.`);
  }
  /** Destroy a bottle and emit pixel-glass debris. */
  /* @function combat.breakBottle.12 — Destroy a bottle and emit pixel-glass debris. Inputs: game; e; ui. Updates: e alive. Uses: game runtime events emit; game particles push; ui log. */ function breakBottle(
    game,
    e,
    ui,
  ) {
    e.alive = false;
    game.runtime?.events.emit("prop.destroyed", {
      propId: e.id,
      mapId: game.currentMapId,
    });
    for (let i = 0; i < 16; i++) {
      game.particles.push({
        map: game.currentMapId,
        x: e.x + (Math.random() - 0.5) * 0.08,
        y: e.y + (Math.random() - 0.5) * 0.08,
        z: (e.z || 35) + Math.random() * 8,
        vx: (Math.random() - 0.5) * 1.9,
        vy: (Math.random() - 0.5) * 1.9,
        vz: 1.8 + Math.random() * 2.8,
        color: i % 3 ? "#6fa48c" : "#d0c58a",
        life: 0.7 + Math.random() * 0.7,
        size: 2 + Math.random() * 3,
      });
    }
    ui.log(`${e.name} shatters into pixel glass.`);
  }
  /**
   * === EDIT HERE: CRATE LOOT TABLE ===
   * Current probabilities: 42% ammo / 34% scrip / 24% junk.
   */
  /* @function combat.dropRandomLoot.13 — === EDIT HERE: CRATE LOOT TABLE === Current probabilities: 42% ammo / 34% scrip / 24% junk. Inputs: game; e. Updates: item id; amount; name; color. Uses: game runtime add entity. */ function dropRandomLoot(
    game,
    e,
  ) {
    const roll = Math.random();
    let itemId, amount, name, color;
    if (roll < 0.42) {
      itemId = "ammo9";
      amount = Math.random() < 0.55 ? 3 : 6;
      name = `${amount} loose 9mm rounds`;
      color = "#c3a86a";
    } else if (roll < 0.76) {
      itemId = "metroScrip";
      amount = 4 + Math.floor(Math.random() * 14);
      name = `${amount} metro scrip`;
      color = "#8d9f77";
    } else {
      itemId = "scrapJunk";
      amount = 1;
      name = "Machine junk";
      color = "#8a8173";
    }
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.18 + Math.random() * 0.22;
    const lx = e.x + Math.cos(angle) * radius;
    const ly = e.y + Math.sin(angle) * radius;
    game.runtime.addEntity(game.currentMapId, {
      id: `loot-${++game.lootSerial}`,
      entityKind: "prop",
      definitionId: "runtime_loot",
      type: "loot",
      itemId,
      amount,
      x: lx,
      y: ly,
      z: 0,
      name,
      interact: "pickup",
      color,
      tags: ["pickup", "runtime"],
      state: {},
      position: {
        map: game.currentMapId,
        x: lx,
        y: ly,
        z: 0,
      },
    });
  }
  /** Destroy a pushable box, emit material-colored debris, then spawn one loot drop. */
  /* @function combat.breakPhysicsBox.14 — Destroy a pushable box, emit material-colored debris, then spawn one loot drop. Inputs: game; e; ui. Updates: e alive. Uses: game runtime events emit; game particles push; drop random loot; game audio play at. */ function breakPhysicsBox(
    game,
    e,
    ui,
  ) {
    e.alive = false;
    game.runtime?.events.emit("prop.destroyed", {
      propId: e.id,
      mapId: game.currentMapId,
    });
    const metal = e.material === "metal";
    const colors = metal
      ? ["#837b6b", "#5f5b52", "#b08d56"]
      : ["#7a5134", "#4f3325", "#9b6b43"];
    for (let i = 0; i < 24; i++) {
      game.particles.push({
        map: game.currentMapId,
        x: e.x + (Math.random() - 0.5) * 0.25,
        y: e.y + (Math.random() - 0.5) * 0.25,
        z: 8 + Math.random() * (e.height || 34),
        vx: (Math.random() - 0.5) * 2.7,
        vy: (Math.random() - 0.5) * 2.7,
        vz: 1.5 + Math.random() * 3.8,
        color: colors[i % colors.length],
        life: 1.0 + Math.random() * 1.2,
        size: 3 + Math.random() * 5,
      });
    }
    dropRandomLoot(game, e);
    game.audio?.playAt("crateBreak", e.x, e.y, {
      volume: 0.92,
      maxDistance: 9,
      rate: 0.94 + Math.random() * 0.12,
    });
    ui.log(`${e.name} bursts apart. Something tumbles into the dust.`);
  }
  /** Shared impact policy for every firing model. Ownership and direction come
   * from the shot, not the player's current position/weapon. NPCs retain the
   * prototype's protected status but still physically stop a projectile.
   */
  /* @function combat.resolveProjectileImpact.15 — Shared impact policy for every firing model. Ownership and direction come from the shot, not the player's current position/weapon. NPCs retain the prototype's protected status but still physically stop a projectile. Inputs: game; shot; hit; ui. Updates: target hp. Uses: game runtime entities get; provoke faction; hit monster; break bottle. */ function resolveProjectileImpact(
    game,
    shot,
    hit,
    ui,
  ) {
    const target = game.runtime.entities.get(hit.id);
    if (target?.type === "monster" && !target.dead) {
      provokeFaction(game, target, ui);
      hitMonster(game, target, ui, shot.damage, shot);
    } else if (target?.type === "bottle" && target.alive !== false)
      breakBottle(game, target, ui);
    else if (target?.type === "physicsBox" && target.alive !== false)
      breakPhysicsBox(game, target, ui);
    else if (target?.type === "player") {
      target.hp = Math.max(0, target.hp - shot.damage);
      game.runtime.events.emit("actor.damaged", {
        actorId: target.id,
        sourceId: shot.ownerId,
        weaponId: shot.weaponId,
        damageType: shot.damageType,
        amount: shot.damage,
        hp: target.hp,
      });
    } else addGroundHole(game, shot.position.x, shot.position.y);
    game.runtime.events.emit("projectile.impact", {
      projectileId: shot.id,
      ownerId: shot.ownerId,
      weaponId: shot.weaponId,
      targetId: hit.id,
      kind: hit.kind,
      position: {
        ...shot.position,
      },
    });
  }
  /** Mouse picking supplies a body's ground center when pointing at its sprite.
   * Otherwise invert the isometric projection. Random angular spread changes the
   * physical trajectory; damage always waits for a swept contact. No hit roll.
   */
  /* @function combat.fireShot.16 — Mouse picking supplies a body's ground center when pointing at its sprite. Otherwise invert the isometric projection. Random angular spread changes the physical trajectory; damage always waits for a swept contact. No hit roll. Inputs: game; mx; my; ui. Updates: dx; dy; p facing x; p facing y. Uses: game audio play at; ui log; hit test; screen to iso. Returns: false; true. */ function fireShot(
    game,
    mx,
    my,
    ui,
  ) {
    const p = game.player;
    if (!p.weapon || p.holstered) return false;
    if (!game.debug?.infiniteAmmo && p.ammoLoaded <= 0) {
      game.audio?.playAt("reloadClick", p.x, p.y, {
        volume: 0.75,
        maxDistance: 3,
      });
      ui.log("CLICK. Empty magazine — press R to reload.");
      return true;
    }
    const target = hitTest(game, mx, my);
    const aimed = target
      ? {
          x: target.x,
          y: target.y,
        }
      : screenToIso(game, mx, my);
    let dx = aimed.x - p.x,
      dy = aimed.y - p.y;
    if (Math.hypot(dx, dy) < 0.001) {
      dx = p.facingX;
      dy = p.facingY;
    }
    const angle =
      Math.atan2(dy, dx) + randomNormal() * (p.weapon.spreadRadians ?? 0.012);
    const direction = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    p.facingX = direction.x;
    p.facingY = direction.y;
    if (!game.debug?.infiniteAmmo) p.ammoLoaded--;
    game.audio?.playAt("pistolShot", p.x, p.y, {
      volume: 1,
      maxDistance: 10,
    });
    ui.updateWeaponHUD();
    if (target?.type === "monster") provokeFaction(game, target, ui);
    const shot = MF.createProjectile(game, p, p.weapon, direction);
    game.muzzleFlashes.push({
      map: game.currentMapId,
      x: p.x + direction.x * 0.2,
      y: p.y + direction.y * 0.2,
      z: shot.visual.z,
      facingX: direction.x,
      facingY: direction.y,
      life: 0.085,
      maxLife: 0.085,
    });
    if (p.weapon.firingModel === "hitscan") MF.resolveHitscan(game, shot, ui);
    else game.projectiles.push(shot);
    return true;
  }
  MF.resolveProjectileImpact = resolveProjectileImpact;
  MF.toggleHolster = toggleHolster;
  MF.reload = reload;
  MF.fireShot = fireShot;
})((window.MF = window.MF || {}));
