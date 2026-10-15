"use strict";
const { chromium, launch } = require("./environment.cjs"),
  assert = require("node:assert/strict"),
  path = require("node:path"),
  fs = require("node:fs");
(/* @function spriteDoorTest.run — Inputs: none. Returns promise; imports an actual clean-door mesh with a front player/back NPC, walks into the door, checks collision/camera and actual sprite visibility at three pitches, and preserves historical image rectangles. Saves screenshots for visual review; browser always closes. */ async function () {
  const raised = process.env.FRONTIER_CONTACT_RAISED === "1";
  const browser = await chromium.launch(launch);
  try {
    const page = await browser.newPage(),
      errors = [];
    page.on(
      "pageerror",
      /* @function spriteDoorTest.error — Inputs: browser exception. Returns array length; retains rendering failures. */ function (
        error,
      ) {
        return errors.push(error.message);
      },
    );
    await page.goto(
      "file:///" + path.resolve("index.html").replaceAll("\\", "/"),
    );
    await page.evaluate(
      /* @function spriteDoorTest.observe — Inputs: none. Returns nothing; wraps production renderer/contact/mask operations to record exact actor-owned rectangles and visibility. Algorithms and returned values remain unchanged. */ function () {
        const draw = FrontierRender.draw;
        FrontierRender.draw =
          /* @function spriteDoorTest.draw — Inputs: canvas/live game. Returns original output; captures game and resets per-frame observational masks. */ function (
            canvas,
            game,
          ) {
            window.doorContactGame = game;
            window.doorContactMasks = [];
            return draw(canvas, game);
          };
        const depth = FrontierSpriteContact.depth;
        FrontierSpriteContact.depth =
          /* @function spriteDoorTest.actorDepth — Inputs: original contact-depth arguments. Returns unchanged value and retains only current actor identity for the immediately following mask call. */ function (
            game,
            actor,
            cam,
            scalar,
          ) {
            window.doorContactActor = actor.id;
            return depth(game, actor, cam, scalar);
          };
        const mask = FrontierTerrainOcclusion.mask;
        FrontierTerrainOcclusion.mask =
          /* @function spriteDoorTest.mask — Inputs: production mask arguments. Returns unchanged mask; records actor identity, rectangle and regions only for supported character cards. No frame timing evidence is collected here. */ function (
            ...args
          ) {
            const value = mask(...args);
            if (args[3])
              doorContactMasks.push({
                id: doorContactActor,
                rect: args[1],
                regions: value.regions || [],
              });
            return value;
          };
      },
    );
    await page.waitForFunction(
      /* @function spriteDoorTest.ready — Inputs: none. Returns whether actual drawing exposed game state and the shipped clean door decoded. */ function () {
        return (
          window.doorContactGame &&
          FrontierModelLibrary.get("builtin-antique-door")?.scene
        );
      },
    );
    const fixture = await page.evaluate(
      /* @function spriteDoorTest.fixture — Inputs: raised-floor/corner fixture flag. Returns production-validated room with shipped clean door and two physical-side actors. Actual coordinator import reconstructs runtime; no model/collision substitutions. */ function (raised) {
        const room = FrontierBuildingKit.shell({
            x: 10,
            y: 10,
            width: 12,
            depth: 12,
            height: raised ? 6 : 4,
            ceiling: false,
          }),
          door = FrontierEvents.create("contact-door", 10, 10),
          npc = FrontierEvents.create("behind-door", 10.45, 10.3);
        door.pages[0].graphic = "none";
        door.pages[0].solid = false;
        door.spatial = FrontierModelEvents.validate({
          visual: "model",
          modelId: "builtin-antique-door",
        });
        npc.spriteProfile = "candy-armed";
        npc.height = 1.65;
        npc.pages[0].solid = false;
        // October 13: preserve the door/actors, add actual raised support and
        // perpendicular corner geometry instead of changing sprite presentation.
        if (raised) {
          door.heightOffset = 2;
          npc.heightOffset = 2;
          room.primitives.push(FrontierBuildingKit.box("raised-support", "Raised floor", 10, 10, 0, 12, 12, 2, {color:"#555555"}));
          room.primitives.push(FrontierBuildingKit.box("corner-wall", "Perpendicular corner", 10.1, 9.5, 2, .1, 3, 3, {color:"#987654"}));
        }
        return FrontierWorld.validate({
          ...doorContactGame.sourceWorld,
          objects: [],
          events: [door, npc],
          groundMaterial: undefined,
          lighting: FrontierLocalLighting.validate({ enabled: false }),
          sky: { enabled: false, layers: [] },
          spawn: { x: 10.45, y: 9.7, z: raised ? 2 : 0 },
          interior: {
            ...structuredClone(FrontierInterior.defaults),
            mode: "geometry",
            floor: room.floor,
            primitives: room.primitives,
            blockers: [],
            sprites: [],
            entrances: [],
            exits: [],
          },
        });
      },
      raised,
    );
    await page
      .locator("#import")
      .setInputFiles({
        name: "door-contact.json",
        mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify(fixture)),
      });
    await page.waitForFunction(
      /* @function spriteDoorTest.imported — Inputs: none. Returns actual new runtime fixture ownership. Does not change actor positions. */ function () {
        return (
          doorContactGame.sourceWorld.spawn.x === 10.45 &&
          doorContactGame.sourceWorld.events[0]?.id === "contact-door"
        );
      },
    );
    await page.evaluate(
      /* @function spriteDoorTest.inspect — Inputs: none. Returns nothing; aims normal gameplay camera toward closed door at historical distance. No collision bypass. */ function () {
        Object.assign(doorContactGame.camera, {
          yaw: 0,
          pitch: -0.6,
          distance: 4,
          firstPerson: false,
        });
      },
    );
    await page.locator("#view").focus();
    await page.keyboard.down("w");
    await page.waitForTimeout(900);
    await page.keyboard.up("w");
    const position = await page.evaluate(
      /* @function spriteDoorTest.stopped — Inputs: none. Returns actual player coordinates after trusted walking into closed geometry. No fixture teleport or event trigger. */ function () {
        return {
          x: doorContactGame.player.x,
          y: doorContactGame.player.y,
          z: doorContactGame.player.z,
        };
      },
    );
    assert(
      position.y >= 9.7 && position.y < 9.82,
      "Closed clean door blocks walking before leaf plane",
    );
    if (raised) assert(Math.abs(position.z - 2) < .02, "Player stands on actual raised support");
    const observations = [];
    for (const pitch of [-0.6, 0, 0.6]) {
      await page.evaluate(
        /* @function spriteDoorTest.pitch — Inputs: radians. Returns nothing; changes diagnostic viewing pitch only. Collision/presentation remain production behavior. */ function (
          pitch,
        ) {
          doorContactGame.camera.pitch = pitch;
        },
        pitch,
      );
      await page.waitForTimeout(150);
      const evidence = await page.evaluate(
        /* @function spriteDoorTest.visibility — Inputs: none. Returns actual character masks, camera and exact current-versus-scalar image rectangles. Temporary depth-service bypass tests presentation only and restores on every outcome. */ function () {
          const g = doorContactGame,
            canvas = document.getElementById("view");
          FrontierRender.draw(canvas, g);
          const masks = structuredClone(doorContactMasks),
            current = masks.map(
              /* @function spriteDoorTest.currentRect — Inputs: observed actor mask. Returns identity/rectangle without interpreting visibility. */ function (
                item,
              ) {
                return { id: item.id, rect: item.rect };
              },
            ),
            depth = FrontierSpriteContact.depth;
          try {
            FrontierSpriteContact.depth =
              /* @function spriteDoorTest.scalarPresentation — Inputs: game/actor/camera and historical depth scalar. Returns scalar while retaining actor identity solely for same-frame rectangle comparison. Does not alter image/framing/geometry. */ function (
                game,
                actor,
                cam,
                scalar,
              ) {
                window.doorContactActor = actor.id;
                return scalar;
              };
            FrontierRender.draw(canvas, g);
            const historical = doorContactMasks.map(
              /* @function spriteDoorTest.historicalRect — Inputs: mask evidence. Returns original identity/rectangle. */ function (
                item,
              ) {
                return { id: item.id, rect: item.rect };
              },
            );
            return {
              masks,
              current,
              historical,
              camera: FrontierRender.camera(g),
              bodyBlocked: FrontierModelCollision.blocked(
                g,
                g.player.x,
                g.player.y,
                0.13,
                g.player,
              ),
            };
          } finally {
            FrontierSpriteContact.depth = depth;
            FrontierRender.draw(canvas, g);
          }
        },
      );
      assert.deepEqual(
        evidence.current,
        evidence.historical,
        "Locked 0.15.17 image rectangles remain identical",
      );
      assert.equal(
        evidence.bodyBlocked,
        false,
        "Stopped player is outside closed geometry",
      );
      const player = evidence.masks.find(
          /* @function spriteDoorTest.playerMask — Inputs: recorded mask. Returns player identity match. */ function (
            item,
          ) {
            return item.id === "player";
          },
        ),
        npc = evidence.masks.find(
          /* @function spriteDoorTest.npcMask — Inputs: recorded mask. Returns actual behind-door event identity match. */ function (
            item,
          ) {
            return item.id === "behind-door";
          },
        );
      assert(player && npc, "Both actual sprites reached depth masking");
      /* @function spriteDoorTest.contains — Inputs: actor mask and normalized body height. Returns whether its central texture point survives production visibility regions. Samples core body, not transparent frame borders; no rendering changes. */
      function contains(mask, fraction) {
        const x = mask.rect.x + mask.rect.width / 2,
          y = mask.rect.y + mask.rect.height * fraction;
        return mask.regions.some(
          /* @function spriteDoorTest.visibleRegion — Inputs: region rectangle. Returns whether it contains this sampled body point. */ function (
            region,
          ) {
            return (
              x >= region.x &&
              x <= region.x + region.width &&
              y >= region.y &&
              y <= region.y + region.height
            );
          },
        );
      }
      assert(
        contains(player, 0.5),
        "Front player torso must remain visible at " + pitch,
      );
      assert(
        contains(player, 0.95),
        "Front feet must remain visible at " + pitch,
      );
      assert(
        !contains(npc, 0.5),
        "Closed door must occlude behind-door torso at " + pitch,
      );
      observations.push({ pitch, position, ...evidence });
      await page
        .locator("#view")
        .screenshot({
          path: "test-artifacts/sprite-door1524-" + (raised ? "raised-" : "") + pitch + ".png",
        });
    }
    const cameraChecks = await page.evaluate(
      /* @function spriteDoorTest.cameraOrbit � Inputs: none. Returns physical camera clearance checks around the actual closed door after trusted approach. Uses the real mesh query on the final camera volume, plus primitive vertical/horizontal clearance and unresolved-separation diagnostics; includes initial near-wall overlap cases. Does not bypass collision or alter authored geometry. */ function () {
        const game = doorContactGame,
          door = game.sceneEvents.find(
            /* @function spriteDoorTest.cameraDoor � Inputs: runtime entity. Returns actual contact-door identity match. */ function (
              entity,
            ) {
              return entity.id === "contact-door";
            },
          ),
          asset = FrontierModelLibrary.get(door.modelId),
          matrix = FrontierModelEvents.matrix(door),
          violations = [];
        let count = 0;
        for (const yaw of [0, 0.8, 1.6, 2.4, Math.PI, 4, 4.8, 5.6])
          for (const pitch of [-0.6, 0, 0.6]) {
            Object.assign(game.camera, { yaw, pitch, distance: 4 });
            const camera = FrontierRender.camera(game),
              point = [camera.x, camera.y, camera.z],
              radius = game.modelCameraDebug.clearance,
              hit = FrontierModelMeshCollision.query(
                asset,
                matrix,
                point,
                point,
                [radius, radius, radius],
              );
            count++;
            if (hit !== null) violations.push({ yaw, pitch, camera, radius });
            if (game.modelCameraDebug.separationUnresolved) violations.push({yaw, pitch, unresolved: true});
            for (const piece of game.sourceWorld.interior.primitives) {
              const verticallyInside = camera.z + radius > piece.z + .001 && camera.z - radius < piece.z + piece.h - .001;
              if (verticallyInside && FrontierRoomPhysics.overlap(piece, camera.x, camera.y, radius - .001)) violations.push({yaw, pitch, primitive: piece.id, camera, radius});
            }

          }
        return { count, violations };
      },
    );
    assert.deepEqual(
      cameraChecks.violations,
      [],
      "Final camera clearance volume must stay outside the closed door, even when its starting eye volume overlaps",
    );
    assert.deepEqual(errors, []);
    fs.writeFileSync(
      "test-artifacts/sprite-door1524.json".replace(".json", raised ? "-raised.json" : ".json"),
      JSON.stringify(
        {
          scope:
            "Actual closed clean-door walking, character core visibility and exact presentation invariance; screenshots still require visual review",
          raisedFloorAndCorner: raised,
          observations,
          cameraChecks,
        },
        null,
        2,
      ),
    );
    console.log(
      "PASS actual clean door collision, front torso/feet visibility, behind-door torso occlusion and locked presentation at three pitches",
    );
  } finally {
    await browser.close();
  }
})().catch(
  /* @function spriteDoorTest.failure — Inputs: rejected error. Returns nothing; reports unsuccessful acceptance and nonzero exit. */ function (
    error,
  ) {
    console.error(error);
    process.exitCode = 1;
  },
);
