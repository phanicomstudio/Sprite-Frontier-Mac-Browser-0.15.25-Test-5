/* Editable encounter data, separate from bundled maps and shared defaults. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function encounter-example.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier encounter example. */
(/* @function encounter-example.installReviewed — Publishes editable encounter example data independently of bundled maps/shared gameplay defaults. Registration does not start a combat encounter or modify a playtest. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function encounter-example.world.2 — Handles world within encounter example. Inputs: base. Updates: w seed; w spawn; w objects; w terrain; w water. Uses: structured clone; frontier water validate; frontier events create; frontier actor behavior validate. Returns: frontier world validate using w. */
  /* @function encounter-example.world.2Reviewed — Inputs: base world to clone. Returns validated editable flat encounter world with spawn 5,7, no static objects, default water and fresh recruit/actor-7 companion/patrol events using normal event/behavior validation. Removes travel, interior and ground material while retaining other inherited base settings. Coordinates/ranges are horizontal world units and behavior speeds world units per second. Creates authored test definitions only; does not recruit, attack or mutate the supplied world. Clone/schema errors propagate. */ function world(
    base,
  ) {
    const w = structuredClone(base);
    delete w.travel;
    delete w.interior;
    delete w.groundMaterial;
    w.seed = "patrol-party-example";
    w.spawn = { x: 5, y: 7, yaw: 0 };
    w.objects = [];
    w.terrain = {
      mode: "flat",
      amplitude: 0,
      frequency: 0.12,
      edits: {},
      revision: 0,
    };
    w.water = FrontierWater.validate();
    const recruit = FrontierEvents.create("recruit-companion", 3, 7);
    recruit.name = "Recruit combat companion";
    recruit.pages[0].commands = [
      { type: "mz", code: 129, indent: 0, parameters: [7, 0, false] },
      {
        type: "message",
        text: "Companion 7 has joined. They will engage the patrol ahead. This encounter uses test combat definitions.",
        dialogue: true,
      },
    ];
    const ally = FrontierEvents.create("encounter-companion", 6, 7);
    ally.name = "Combat companion";
    ally.extensions = { party: { actorId: "7" } };
    ally.combatNote =
      "<PhanicomABS: attack=hitscan damage=3 range=4 fireRate=40 hp=100>";
    ally.pages[0].condition = { type: "actor", key: "7" };
    ally.pages[0].commands = [];
    ally.pages[0].behavior = FrontierActorBehavior.validate({
      mode: "sentinel",
      approach: true,
      detectRange: 8,
      chaseRange: 12,
      homeRange: 12,
      stopRange: 2,
      speed: 1.2,
    });
    const enemy = FrontierEvents.create("encounter-patrol", 12, 7);
    enemy.name = "Patrol opponent";
    enemy.combatNote =
      "<PhanicomABS: attack=hitscan damage=1 range=3 fireRate=60 hp=30>";
    enemy.pages[0].commands = [];
    enemy.pages[0].behavior = FrontierActorBehavior.validate({
      mode: "patrol",
      points: [
        { x: 12, y: 7 },
        { x: 12, y: 10 },
      ],
      approach: true,
      detectRange: 4,
      chaseRange: 6,
      homeRange: 6,
      stopRange: 1,
      speed: 0.9,
    });
    w.events = FrontierEvents.validate([recruit, ally, enemy], new Set(), w);
    return FrontierWorld.validate(w);
  }
  root.FrontierEncounterExample = { world };
})(window);
