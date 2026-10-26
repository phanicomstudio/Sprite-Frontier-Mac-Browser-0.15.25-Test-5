/* 2026-10-09: isolated hub acceptance maps. Existing forest/vector/interior tests
 * remain unchanged. New cells demonstrate doors, trade and cleanup protection. */
(/* @function hub-fixtures.install — Inputs: root namespace. Publishes fixture builder; returns nothing and loads no assets. */ function (
  root,
) {
  "use strict";
  /* @function hub-fixtures.base — Inputs: stable seed. Returns empty 24x24 validated map with shared textured ground. Generated enemy/prop fixtures are cleared only in this new map. */
  function base(seed) {
    const w = root.FrontierWorld.generate(seed, 24, 24);
    w.objects = [];
    w.events = [];
    w.spawn = { x: 12, y: 12 };
    w.groundMaterial = "ground-moss";
    return w;
  }
  /* @function hub-fixtures.door — Inputs: ID, name, XY, destination map/arrival and optional style. Returns invisible self-targeted doorway event; no runtime mutation. Zone occupies a local 0.9x0.3x2.1 unit box. */
  function door(id, name, x, y, map, entrance, effect = "door") {
    /* October 9, 2026: visible closed transfer doors use shared mesh collision; zones remain independently targetable. */ const e =
      root.FrontierEvents.create(id, x, y);
    e.name = name;
    e.range = 2.5;
    e.pages[0].graphic = "none";
    e.pages[0].solid = false;
    e.extensions = {
      hub: root.FrontierHubWorkbench.validateEvent({
        kind: "door",
        map,
        entrance,
        transition: { effect },
      }),
    };
    e.spatial = root.FrontierModelEvents.validate({
      visual: "model",
      modelId: "builtin-antique-door",
      collisionMode: "mesh",
      interactionZones: [
        {
          id: "door-zone",
          name,
          size: [0.9, 0.3, 2.1],
          transform: { position: [0.45, 0, 1.05] },
          eventId: id,
          trigger: "interact",
        },
      ],
    });
    return e;
  }
  /* @function hub-fixtures.store — Inputs: ID/name/XY and store kind. Returns chest event with compact starting stock and public ownership. Inventories become per-instance saved records on first interaction. */
  function store(id, name, x, y, kind) {
    const e = root.FrontierEvents.create(id, x, y);
    e.name = name;
    e.range = 2.5;
    e.pages[0].graphic = "chest";
    e.pages[0].solid = false;
    e.extensions = {
      hub: root.FrontierHubWorkbench.validateEvent({
        kind,
        stock: [
          { itemId: "test-token", quantity: 10 },
          { itemId: "healing-herb", quantity: 3 },
        ],
      }),
    };
    return e;
  }
  /* @function hub-fixtures.create — Inputs: none. Returns four independent new map records: hub/shop/protected home/wilderness. Linking uses named arrivals and explicit door styles; no existing map/test fixture is overwritten. */
  function create() {
    if (!root.FrontierModelLibrary.get("builtin-antique-door")) {
      const bytes = Uint8Array.from(
        atob(root.FrontierAntiqueDoor),
        /* @function hub-fixtures.assetByte — Inputs: decoded character. Returns GLB byte, no effects. */ (
          c,
        ) => c.charCodeAt(0),
      );
      root.FrontierModelLibrary.importBundle({
        id: "builtin-antique-door",
        name: "Antique door and frame",
        entry: "assembly.glb",
        files: { "assembly.glb": bytes },
      });
    }
    if (!root.FrontierModelLibrary.get("builtin-saloon-door")) {
      const bytes = Uint8Array.from(
        atob(root.FrontierSaloonDoor),
        /* @function hub-fixtures.saloonByte — Inputs: decoded character. Returns one unsigned GLB byte; no effects. */ (
          c,
        ) => c.charCodeAt(0),
      );
      root.FrontierModelLibrary.importBundle({
        id: "builtin-saloon-door",
        name: "Saloon door pair",
        entry: "pair.glb",
        files: { "pair.glb": bytes },
      });
    }
    const saloon = base("saloon-1520");
    saloon.spawn = { x: 12, y: 12 };
    saloon.cell = root.FrontierHubState.settings({
      protected: true,
      arrivals: [{ id: "entry", name: "Inside doorway", x: 12, y: 12, yaw: 0 }],
    });
    saloon.interior = {
      ...root.FrontierInterior.defaults,
      mode: "geometry",
      floor: [
        [6, 6],
        [18, 6],
        [18, 18],
        [6, 18],
      ],
      blockers: [],
      sprites: [],
      entrances: [],
      exits: [],
      primitives: [
        {
          id: "saloon-floor",
          name: "Wood floor",
          x: 12,
          y: 12,
          w: 12,
          d: 12,
          z: -0.15,
          h: 0.15,
          color: "#ffffff",
          texture: "img/materials/floors/prop_wood_floor1.png",
          tileSize: 2,
        },
        {
          id: "saloon-ceiling",
          name: "Tin ceiling",
          x: 12,
          y: 12,
          w: 12,
          d: 12,
          z: 3,
          h: 0.15,
          color: "#ffffff",
          texture: "img/materials/ceilings/prop_tin_ceiling1.png",
          tileSize: 2,
        },
        {
          id: "saloon-west",
          name: "West wall",
          x: 6,
          y: 12,
          w: 0.2,
          d: 12,
          z: 0,
          h: 3,
          color: "#ffffff",
          texture: "img/materials/walls/prop_wood_panel_wall1.png",
          tileSize: 2,
        },
        {
          id: "saloon-east",
          name: "East wall",
          x: 18,
          y: 12,
          w: 0.2,
          d: 12,
          z: 0,
          h: 3,
          color: "#ffffff",
          texture: "img/materials/walls/prop_wood_panel_wall1.png",
          tileSize: 2,
        },
        {
          id: "saloon-north",
          name: "North wall",
          x: 12,
          y: 6,
          w: 12,
          d: 0.2,
          z: 0,
          h: 3,
          color: "#ffffff",
          texture: "img/materials/walls/prop_wood_panel_wall1.png",
          tileSize: 2,
        },
        {
          id: "saloon-south-left",
          name: "South wall left of door",
          x: 8.75,
          y: 18,
          w: 5.5,
          d: 0.2,
          z: 0,
          h: 3,
          color: "#ffffff",
          texture: "img/materials/walls/prop_wood_panel_wall1.png",
          tileSize: 2,
        },
        {
          id: "saloon-south-right",
          name: "South wall right of door",
          x: 15.25,
          y: 18,
          w: 5.5,
          d: 0.2,
          z: 0,
          h: 3,
          color: "#ffffff",
          texture: "img/materials/walls/prop_wood_panel_wall1.png",
          tileSize: 2,
        },
      ],
    };
    const hub = base("hub-1517"),
      shop = base("shop-1517"),
      home = base("home-1517"),
      wild = base("wild-1517");
    for (const w of [hub, shop, home, wild])
      w.cell = root.FrontierHubState.settings({
        cleanupSeconds: 120,
        arrivals: [{ id: "entry", name: "Door arrival", x: 12, y: 12, yaw: 0 }],
      });
    home.cell.protected = true;
    home.fog = { enabled: false, start: 12, end: 28, color: "#081323" };
    shop.fog = { enabled: true, start: 8, end: 18, color: "#10131b" };
    wild.fog = { enabled: true, start: 12, end: 28, color: "#24323a" };
    hub.events.push(
      door("hub-shop-door", "Shop door", 10, 14, "hub-shop", "entry"),
      door("hub-home-door", "Player room door", 12, 14, "hub-home", "entry"),
      door(
        "hub-wild-door",
        "Wilderness passage",
        14,
        14,
        "hub-wilderness",
        "entry",
        "melt",
      ),
      store("hub-pawn", "Pawn-shop recovery", 14, 12, "pawnshop"),
    );
    const starter = root.FrontierEvents.create("hub-starter", 10, 12);
    starter.name = "Test supplies";
    starter.pages[0].graphic = "chest";
    starter.pages[0].commands = [
      { type: "giveItem", item: "test-token", amount: 5 },
      { type: "mzGold", operation: 0, operand: 0, value: 100 },
      { type: "selfSwitch", key: "A", value: true },
    ];
    const used = root.FrontierEvents.page("Supplies taken");
    used.graphic = "openChest";
    used.condition = { type: "selfSwitch", key: "A" };
    starter.pages.push(used);
    hub.events.push(starter);
    shop.events.push(
      door("shop-exit", "Return to hub", 12, 14, "hub-test", "entry"),
      store("shop-merchant", "Merchant", 10, 12, "merchant"),
    );
    home.events.push(
      door("home-exit", "Return to hub", 12, 14, "hub-test", "entry"),
      store("home-container", "Player storage", 10, 12, "container"),
    );
    wild.events.push(
      door("wild-exit", "Return to hub", 12, 14, "hub-test", "entry", "melt"),
    );
    const saloonDoor = door(
      "hub-saloon-door",
      "Saloon doors",
      16,
      14,
      "hub-saloon",
      "entry",
    );
    saloonDoor.spatial.modelId = "builtin-saloon-door";
    saloonDoor.extensions.hub.transition = root.FrontierDoorTransition.validate(
      {
        effect: "door",
        frame: null,
        leaves: [
          { modelId: "builtin-saloon-door", node: 0, angle: -85, speed: 65 },
          { modelId: "builtin-saloon-door", node: 1, angle: 85, speed: 65 },
        ],
      },
    );
    hub.events.push(saloonDoor);
    const saloonExit = door(
      "saloon-return",
      "Return through saloon doors",
      12,
      17.5,
      "hub-test",
      "entry",
    );
    saloonExit.spatial.modelId = "builtin-saloon-door";
    saloonExit.extensions.hub.transition = JSON.parse(
      JSON.stringify(saloonDoor.extensions.hub.transition),
    );
    saloon.events.push(saloonExit);
    // October 26: fresh bundled hub examples demonstrate named paired doors.
    // Existing saved projects are not replaced; their manual arrivals stay available.
    const pairs163=[[hub,"hub-shop-door",shop,"shop-exit"],[hub,"hub-home-door",home,"home-exit"],[hub,"hub-wild-door",wild,"wild-exit"],[hub,"hub-saloon-door",saloon,"saloon-return"]];
    for(const [a,aid,b,bid] of pairs163){let left=null,right=null;for(const e of a.events)if(e.id===aid)left=e;for(const e of b.events)if(e.id===bid)right=e;if(!left||!right)continue;left.extensions.hub.entrance="door:"+bid;right.extensions.hub.entrance="door:"+aid;left.extensions.hub.arrivalYaw=0;right.extensions.hub.arrivalYaw=180;}
    const maps = [];
    for (const [id, name, world] of [
      ["hub-saloon", "Saloon Geometry Room", saloon],
      ["hub-test", "Hub Test", hub],
      ["hub-shop", "Hub Shop", shop],
      ["hub-home", "Protected Player Room", home],
      ["hub-wilderness", "Hub Wilderness", wild],
    ])
      maps.push({ id, name, world: root.FrontierWorld.validate(world) });
    return maps;
  }
  root.FrontierHubFixtures = { create };
})(typeof window === "undefined" ? globalThis : window);
