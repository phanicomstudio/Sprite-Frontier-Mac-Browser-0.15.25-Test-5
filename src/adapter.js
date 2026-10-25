/* MAINTAINER GUIDE
 * Frontier compatibility host for the original isometric combat. Builds entity registries and the services expected by MF. Engine objects use world X/Y and elevation Z, not screen pixels. Extend makeFrontierGame when adding runtime state.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function adapter.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf screen to iso; mf hit test; mf update aim; mf make frontier game. */
(/* @function adapter.installReviewed — Installs Frontier compatibility services on the existing MF engine namespace: entity registry, screen-to-world aiming and game factory. Engine positions are world X/Y and Z elevation, not screen pixels. Inputs: existing MF engine namespace MF. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  MF,
) {
  "use strict";
  // Camera input becomes a world aim point before the original combat reads it.
  MF.screenToIso =
    /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.screenToIso.2 — Returns chain equals "fixed" selects frontier interior aim using game, mx, my or a record containing x, y. Inputs: game; mx; my. Uses: frontier interior aim. Returns: chain equals "fixed" selects frontier interior aim using game, mx, my or a record containing x, y. */
  /* @function adapter.reviewedscreenToIso_2 — Provides world aim for legacy combat API. Inputs: game and logical pointer mx/my pixels. Returns fixed-room inverse aim when fixed, otherwise world XY20 metres ahead at camera yaw radians (pointer ignored there). No mutation; camera/interior errors propagate. */ (
      game,
      mx,
      my,
    ) =>
      game.sourceWorld.interior?.mode === "fixed"
        ? FrontierInterior.aim(game, mx, my)
        : {
            x: game.player.x + Math.sin(game.camera.yaw) * 20,
            y: game.player.y + Math.cos(game.camera.yaw) * 20,
          };
  MF.hitTest =
    /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.hitTest.3 — Returns null. Inputs: no explicit arguments; uses enclosing module state. Returns: null. */
  /* @function adapter.reviewedhitTest_3 — Disables legacy isometric pointer hit-testing in Frontier host. Inputs: ignored legacy arguments. Returns null unconditionally; native rendered picking owns interaction. No side effects. */ () =>
      null;
  MF.updateAim =
    /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.updateAim.4 — Handles update aim within adapter. Inputs: game. Updates: game player facing x; game player facing y. Uses: frontier interior aim. Returns: without a result. */
  /* @function adapter.reviewedupdateAim_4 — Sets player facing from current aim. Inputs: game. Returns undefined; fixed room pointer uses normalized world displacement if length>0.01 metre, preserving old facing for nearzero; otherwise sin/cos camera yaw. No sprite tilt or shot execution; missing camera/interior services throw. */ (
      game,
    ) => {
      if (game.sourceWorld.interior?.mode === "fixed" && game.pointer) {
        const a = FrontierInterior.aim(game, game.pointer.x, game.pointer.y),
          dx = a.x - game.player.x,
          dy = a.y - game.player.y,
          len = Math.hypot(dx, dy);
        if (len > 0.01) {
          game.player.facingX = dx / len;
          game.player.facingY = dy / len;
        }
        return;
      }
      game.player.facingX = Math.sin(game.camera.yaw);
      game.player.facingY = Math.cos(game.camera.yaw);
    };
  MF.makeFrontierGame =
    /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.makeFrontierGame.5 — Handles make frontier game within adapter. Inputs: world; log. Updates: game source world; game local player id; game players; game runtime; game ui. Uses: world objects map; structured clone; entities map; registry set. Returns: game. */
  /* @function adapter.reviewedmakeFrontierGame_5 — Creates independent compatibility runtime from validated authored world. Inputs: world and log callback. Returns game with player/camera, frontier entities, registry/events/grid and legacy HUD hooks. Clones object records and weapon, sets terrain-derived Z, initial100HP/12loaded/120reserve and empty transient arrays. Retains sourceWorld reference; host owns further event/cell/catalog initialization. Shallow object nested metadata may remain shared, so runtime systems must not edit authored nested records. Required project/terrain services or clone errors propagate. */ (
      world,
      log,
    ) => {
      const entities = world.objects.map(
        /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.callback.6 — Returns a record containing copied fields, z, type, name, maxHp, hp, dead. Inputs: e. Uses: window frontier terrain height. Returns: a record containing copied fields, z, type, name, maxHp, hp, dead. */
  /* @function adapter.reviewedcallback_6 — Creates initial runtime scenery/monster record. Inputs: authored e and captured world. Returns shallow copy with terrain Z plus elevation*0.3 metre, legacy type/name and24HP living defaults. No source mutation; nested authored metadata retained by reference, terrain errors propagate. */ (
          e,
        ) => ({
          ...e,
          z:
            window.FrontierTerrain.height(world, e.x, e.y) +
            (e.elevation || 0) * 0.3,
          type: e.kind === "monster" ? "monster" : "prop",
          name: e.name || (e.kind === "monster" ? "Frontier sentinel" : e.kind),
          maxHp: 24,
          hp: 24,
          dead: false,
        }),
      );
      const player = {
        id: "player",
        type: "player",
        x: world.spawn.x,
        y: world.spawn.y,
        z:
          world.spawn.z ??
          window.FrontierTerrain.height(world, world.spawn.x, world.spawn.y),
        hp: 100,
        holstered: false,
        facingX: 0,
        facingY: 1,
        ammoLoaded: 12,
        ammoReserve: 120,
        weapon: structuredClone(window.FrontierProject.weapon),
      };
      const registry = new Map(
        entities.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.callback.7 — Returns a list of e id, e. Inputs: e. Returns: a list of e id, e. */
  /* @function adapter.reviewedcallback_7 — Indexes runtime entity by stable ID. Inputs: e. Returns ID/entity tuple for registry Map; retains live entity reference, no mutation. Validated unique IDs assumed. */ (
            e,
          ) => [e.id, e],
        ),
      );
      registry.set(player.id, player);
      const game = {
        player,
        camera: {
          yaw: 0,
          distance: 3.8,
          height: 0.6,
          pitch: -0.12,
          firstPerson: false,
        },
        currentMapId: "frontier",
        maps: {
          frontier: {
            size: {
              w: world.width ?? world.size ?? 48,
              h: world.height ?? world.size ?? 48,
            },
            entities,
          },
        },
        world: {
          factions: {},
          flags: {},
        },
        particles: [],
        bloodStains: [],
        bulletHoles: [],
        muzzleFlashes: [],
        projectiles: [],
        shotEffects: [],
        projectileSerial: 0,
        lootSerial: 0,
        events: [],
        elapsed: 0,
      };
      game.sourceWorld = world;
      game.localPlayerId = player.id;
      game.players = new Map([[player.id, player]]);
      game.runtime = {
        entities: registry,
        events: {
          /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.emit.8 — Handles emit within adapter. Inputs: type; payload. Uses: game events push; game events shift. */
  /* @function adapter.reviewedemit_8 — Retains bounded compatibility event history. Inputs: type/payload. Returns undefined; appends original payload reference and keeps newest100 events. Does not dispatch external messages or clone payload; consumers own later handling. */ emit(
            type,
            payload,
          ) {
            game.events.push({
              type,
              payload,
            });
            if (game.events.length > 100) game.events.shift();
          },
        },
        grid: {
          /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.getCollisionZones.9 — Handles get collision zones within adapter. Inputs: no explicit arguments; uses enclosing module state. Uses: a list of spread element, spread element map; entities filter; game scene events or a list of filter. Returns: a list of spread element, spread element map using a callback. */
  /* @function adapter.reviewedgetCollisionZones_9 — Builds legacy planar body collision zones from live runtime. Inputs: none. Returns new ID/XY bounds array for living scenery and solid/combat events; radius-based AABBs in world units, no Z/mesh surfaces. No entity mutation; native height-aware collision lives elsewhere. */ getCollisionZones() {
            return [
              ...entities.filter(
                /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.callback.10 — Returns the inverse of e dead. Inputs: e. Returns: the inverse of e dead. */
  /* @function adapter.reviewedcallback_10 — Keeps nondead runtime scenery zone candidate. Inputs: e. Returns !e.dead; no mutation. HP/solid filters are not applied to this scenery branch. */ (
                  e,
                ) => !e.dead,
              ),
              ...(game.sceneEvents || []).filter(
                /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.callback.11 — Returns the inverse of e dead and e solid or e combat. Inputs: e. Returns: the inverse of e dead and e solid or e combat. */
  /* @function adapter.reviewedcallback_11 — Keeps living solid/combat event zone candidate. Inputs: e. Returns nondead and solid/combat truthiness; no mutation. */ (
                  e,
                ) => !e.dead && (e.solid || e.combat),
              ),
            ].map(
              /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.callback.12 — Returns a record containing id, x1, y1, x2, y2. Inputs: e. Returns: a record containing id, x1, y1, x2, y2. */
  /* @function adapter.reviewedcallback_12 — Creates planar radius bounds for legacy entity. Inputs: e. Returns ID,x1/y1/x2/y2 world coordinates; no mutation. Assumes valid radius; not geometry-based model bounds. */ (
                e,
              ) => ({
                id: e.id,
                x1: e.x - e.radius,
                y1: e.y - e.radius,
                x2: e.x + e.radius,
                y2: e.y + e.radius,
              }),
            );
          },
          /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.getBlockingPolygons.13 — Handles get blocking polygons within adapter. Inputs: no explicit arguments; uses enclosing module state. Returns: a list of . */
  /* @function adapter.reviewedgetBlockingPolygons_13 — Supplies empty legacy polygon collection. Inputs: none. Returns fresh empty array; Frontier native collision services handle current geometry. No source mutation. */ getBlockingPolygons() {
            return [];
          },
        },
        /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.addEntity.14 — Handles add entity within adapter. Inputs: map; e. Uses: entities push; registry set. */
  /* @function adapter.reviewedaddEntity_14 — Adds one entity to current compatibility runtime. Inputs: map argument(currently ignored) and e. Returns undefined; pushes entity reference into frontier array and sets registry ID. No duplicate-ID validation; caller must validate, otherwise Map entry replaces while array appends. Does not update authored world. */ addEntity(
          map,
          e,
        ) {
          entities.push(e);
          registry.set(e.id, e);
        },
      };
      game.ui = {
        log,
        /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.updateWeaponHUD.15 — Handles update weapon hud within adapter. Inputs: no explicit arguments; uses enclosing module state. */
  /* @function adapter.reviewedupdateWeaponHUD_15 — Compatibility no-op for legacy weapon HUD refresh. Inputs: ignored legacy arguments. Returns undefined; current host frame/device HUD owns rendering. No side effects. */ updateWeaponHUD() {},
        /* Historical contract retained; October 14 reviewed explanation follows. @function adapter.updateHover.16 — Handles update hover within adapter. Inputs: no explicit arguments; uses enclosing module state. */
  /* @function adapter.reviewedupdateHover_16 — Compatibility no-op for legacy hover refresh. Inputs: ignored legacy arguments. Returns undefined; current rendered picking/inspection owns hover state. No side effects. */ updateHover() {},
      };
      return game;
    };
})(window.MF);
