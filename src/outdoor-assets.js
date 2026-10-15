/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function outdoor-assets.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier outdoor assets. */
(/* @function outdoor-assets.installReviewed — Publishes the supplied outdoor artwork bank and shared asset access services. Embedded original artwork remains project data; instances refer to shared assets rather than copying encoded image data into every actor. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  const assets = [
    {
      "id": "bank-blood-flower-a",
      "name": "Blood Flower A",
      "category": "plants",
      "image": "img/materials/plants/Blood Flower A.png",
      "width": 170,
      "height": 336,
      "hasAlpha": true,
      "sha256":
        "abc4f5b83200e0338102de1cd452d5cbc9608aab1d292a9588d07642a19cb6eb",
    },
    {
      "id": "bank-blood-flower-b",
      "name": "Blood Flower B",
      "category": "plants",
      "image": "img/materials/plants/Blood Flower B.png",
      "width": 177,
      "height": 279,
      "hasAlpha": true,
      "sha256":
        "00cf403eecd2debb5b3e32af7f5e8e630146a0bfb39cdeede52428abea9ab6a0",
    },
    {
      "id": "bank-creosote-1-copy-2",
      "name": "Creosote 1 copy 2",
      "category": "shrubs",
      "image": "img/materials/shrubs/$$Creosote 1 copy 2.png",
      "width": 754,
      "height": 512,
      "hasAlpha": true,
      "sha256":
        "db31d97404e0f2d67a034396af0f3e14926df5c95266a18c22880a0972d791d5",
    },
    {
      "id": "bank-furniture-1",
      "name": "Furniture 1",
      "category": "rugs",
      "image": "img/materials/rugs/$$Furniture 1.png",
      "width": 508,
      "height": 725,
      "hasAlpha": true,
      "sha256":
        "a7acfc1b7fb28a9d2fb34ae4bf89464691d9fd5f39a71ed4a6b04ef869dc4875",
    },
    {
      "id": "bank-furniture-2",
      "name": "Furniture 2",
      "category": "furniture",
      "image": "img/materials/furniture/$$Furniture 2.png",
      "width": 448,
      "height": 690,
      "hasAlpha": true,
      "sha256":
        "56d553cac7d5b251a595aee51e6420416f8de8bdbbc8e9b77664209eb01ddf9b",
    },
    {
      "id": "bank-palegranite",
      "name": "Palegranite",
      "category": "plants",
      "image": "img/materials/plants/$$Palegranite.png",
      "width": 281,
      "height": 280,
      "hasAlpha": true,
      "sha256":
        "75620b812310c7a78845b34221bc4658c88b02c62fce662e34be61f47dd5afcd",
    },
    {
      "id": "bank-palegranite-2",
      "name": "Palegranite 2",
      "category": "plants",
      "image": "img/materials/plants/$$Palegranite 2.png",
      "width": 128,
      "height": 230,
      "hasAlpha": true,
      "sha256":
        "15660d114623c15da980e0520439b04afdeced54dd48bd64ffa737b8da22d19c",
    },
    {
      "id": "bank-para-plant-8-sodom-apple",
      "name": "Para Plant 8 Sodom Apple",
      "category": "plants",
      "image": "img/materials/plants/$$Para Plant 8 Sodom Apple.png",
      "width": 294,
      "height": 269,
      "hasAlpha": true,
      "sha256":
        "c5a23535adaff42aa4ba8dfeab917333889fb17750cff063536e37fd0ce1c2f5",
    },
    {
      "id": "bank-poppie-1",
      "name": "Poppie 1",
      "category": "plants",
      "image": "img/materials/plants/$$Poppie 1.png",
      "width": 230,
      "height": 274,
      "hasAlpha": true,
      "sha256":
        "3824241ddca0aa909c900276f7cf9bb411b99b6395e853c0d388ae0648a267cd",
    },
    {
      "id": "bank-poppie-2",
      "name": "Poppie 2",
      "category": "plants",
      "image": "img/materials/plants/$$Poppie 2.png",
      "width": 205,
      "height": 284,
      "hasAlpha": true,
      "sha256":
        "42ca954a36b2f9cadae53beb0eaaa6cde0ca2a006a8d6d547af7614a0fa3124f",
    },
    {
      "id": "bank-poppie-3",
      "name": "Poppie 3",
      "category": "plants",
      "image": "img/materials/plants/$$Poppie 3.png",
      "width": 162,
      "height": 167,
      "hasAlpha": true,
      "sha256":
        "4076d3ae4d0f6dc6a0a7545fe7f222b8ca54b065e1daa7cf37258ed04a7eaf06",
    },
    {
      "id": "bank-puff-star",
      "name": "Puff Star",
      "category": "plants",
      "image": "img/materials/plants/$$Puff Star.png",
      "width": 340,
      "height": 278,
      "hasAlpha": true,
      "sha256":
        "a2d740f3c7d6bb1a28487dd8b8e93e5910a2cd481d8b06360e1ec8c585a36fcb",
    },
    {
      "id": "bank-red-cage-1",
      "name": "Red Cage 1",
      "category": "plants",
      "image": "img/materials/plants/$$Red Cage 1.png",
      "width": 266,
      "height": 388,
      "hasAlpha": true,
      "sha256":
        "11a1f6ef2be53dfe40e44bbe404c962a18e03ddc8409b86bcdeb177992fc6391",
    },
    {
      "id": "bank-para-plant-2",
      "name": "Para Plant 2",
      "category": "trees",
      "image": "img/materials/trees/$$Para Plant 2.png",
      "width": 1351,
      "height": 2696,
      "hasAlpha": true,
      "sha256":
        "587294fcac0f75c6fd7136bccdd7093ee4d57eb3989e38ff595aacf4135c4829",
    },
    {
      "id": "bank-thorny-bush",
      "name": "Thorny Bush",
      "category": "shrubs",
      "image": "img/materials/shrubs/$$Thorny Bush.png",
      "width": 1957,
      "height": 2517,
      "hasAlpha": true,
      "sha256":
        "046f82fb993d10cea9276fe6f0d7d6720fe0cbe57ff557a19ec4b3619f91ec3d",
    },
    {
      "id": "bank-thorny-bush-double",
      "name": "Thorny Bush Double",
      "category": "shrubs",
      "image": "img/materials/shrubs/$$Thorny Bush Double.png",
      "width": 1278,
      "height": 1643,
      "hasAlpha": true,
      "sha256":
        "7c02806604a260514b69303a10623e2cc677ed5452e3817e9692f0c7bdd153c4",
    },
    {
      "id": "bank-joshua-tree-1",
      "name": "Joshua Tree 1",
      "category": "trees",
      "image": "img/materials/trees/$$Joshua Tree 1.png",
      "width": 1055,
      "height": 1752,
      "hasAlpha": true,
      "sha256":
        "b27ce2da80d477bc9b7b9e13cba894d3c7d2a3bb3c531d8b244001dcf868b902",
    },
    {
      "id": "bank-joshua-tree-2",
      "name": "Joshua Tree 2",
      "category": "trees",
      "image": "img/materials/trees/$$Joshua Tree 2.png",
      "width": 1039,
      "height": 1782,
      "hasAlpha": true,
      "sha256":
        "b4a985f116777734d7757a1855bdd76ce6e090f239e7083c27a381eca718bd4b",
    },
    {
      "id": "bank-joshua-tree-3",
      "name": "Joshua Tree 3",
      "category": "trees",
      "image": "img/materials/trees/$$Joshua Tree 3.png",
      "width": 849,
      "height": 1405,
      "hasAlpha": true,
      "sha256":
        "0913b98e7e34300019582ca483c48ea7f83eab48a9c77b2e9148826c8dfa1ebe",
    },
    {
      "id": "bank-joshua-tree-4",
      "name": "Joshua Tree 4",
      "category": "trees",
      "image": "img/materials/trees/$$Joshua Tree 4.png",
      "width": 1291,
      "height": 1844,
      "hasAlpha": true,
      "sha256":
        "826ddb0c89003d9f808bd9437a7e13b9af3c68b517e2b091de76d4671b043f9e",
    },
    {
      "id": "bank-joshua-tree-5",
      "name": "Joshua Tree 5",
      "category": "trees",
      "image": "img/materials/trees/$$Joshua Tree 5.png",
      "width": 1441,
      "height": 1709,
      "hasAlpha": true,
      "sha256":
        "e9c7d15e88f25861bb1f27575e156515aaf00856140ce25c6b530a4378ffcc51",
    },
    {
      "id": "bank-joshua-tree-6",
      "name": "Joshua Tree 6",
      "category": "trees",
      "image": "img/materials/trees/$$Joshua Tree 6.png",
      "width": 1309,
      "height": 1519,
      "hasAlpha": true,
      "sha256":
        "5272ef0330664e20cfbc9c9d11b1b66eeb91097c3f15c520dc3af4a7a86f2808",
    },
    {
      "id": "bank-joshua-tree-7",
      "name": "Joshua Tree 7",
      "category": "trees",
      "image": "img/materials/trees/$$Joshua Tree 7.png",
      "width": 1210,
      "height": 1895,
      "hasAlpha": true,
      "sha256":
        "98a151982290946acb24f1b11305bc1a76218e581e3257a5a2207123fafe407c",
    },
    {
      "id": "bank-joshua-tree-8",
      "name": "Joshua Tree 8",
      "category": "trees",
      "image": "img/materials/trees/$$Joshua Tree 8.png",
      "width": 1358,
      "height": 1497,
      "hasAlpha": true,
      "sha256":
        "43c2b836206464c41d9c547a060c776798e80b03dccb19c5011f7c6b97b72081",
    },
    {
      "id": "bank-morel-tree-1",
      "name": "Morel Tree 1",
      "category": "trees",
      "image": "img/materials/trees/$$Morel Tree 1.png",
      "width": 1463,
      "height": 2109,
      "hasAlpha": true,
      "sha256":
        "ba381883dc25851333125dd0793886491f866a2a70eb1afe8f7071bc9e1cc382",
    },
    {
      "id": "bank-morel-tree-2",
      "name": "Morel Tree 2",
      "category": "trees",
      "image": "img/materials/trees/$$Morel Tree 2.png",
      "width": 1464,
      "height": 1953,
      "hasAlpha": true,
      "sha256":
        "bc0799ef46ebc03ca0c118cf4c9f5974757666232211e6da648b878fb7dc745c",
    },
    {
      "id": "bank-morel-tree-3",
      "name": "Morel Tree 3",
      "category": "trees",
      "image": "img/materials/trees/$$Morel Tree 3.png",
      "width": 1795,
      "height": 1766,
      "hasAlpha": true,
      "sha256":
        "82bdbfb9bfdeab5405e94c9e763e7bf0880d2af0abfd3ee98065573a5c51cf53",
    },
    {
      "id": "bank-morel-tree-4",
      "name": "Morel Tree 4",
      "category": "trees",
      "image": "img/materials/trees/$$Morel Tree 4.png",
      "width": 1892,
      "height": 1848,
      "hasAlpha": true,
      "sha256":
        "12a60fd86967b5103494beb8962b4e5f40f1a6310b5132b53251734699ef07fd",
    },
    {
      "id": "bank-morel-tree-5",
      "name": "Morel Tree 5",
      "category": "trees",
      "image": "img/materials/trees/$$Morel Tree 5.png",
      "width": 1862,
      "height": 1796,
      "hasAlpha": true,
      "sha256":
        "f4c351ac430fa77685f9b1b78d011001a68574f2ece6c55ee1483db0a758cd6e",
    },
    {
      "id": "bank-thorny-tree-a",
      "name": "Thorny Tree A",
      "category": "trees",
      "image": "img/materials/trees/$$Thorny Tree A.png",
      "width": 925,
      "height": 1259,
      "hasAlpha": true,
      "sha256":
        "cab1797094eb3d5e2c398e7c8a797805211b11f53d7a36e9e4898137eff992f3",
    },
    {
      "id": "bank-thorny-tree-b",
      "name": "Thorny Tree B",
      "category": "trees",
      "image": "img/materials/trees/$$Thorny Tree B.png",
      "width": 971,
      "height": 1257,
      "hasAlpha": true,
      "sha256":
        "7dc6250b3cdfce9b443fcc1bbfb7d96ef5ef26b5642c8029c6bb5b7d714d031c",
    },
    {
      "id": "bank-thorny-tree-c",
      "name": "Thorny Tree C",
      "category": "trees",
      "image": "img/materials/trees/$$Thorny Tree C.png",
      "width": 998,
      "height": 1297,
      "hasAlpha": true,
      "sha256":
        "8793570c15c9633cb096ce06a50431c55563b0a57ffacfec25243a4115848795",
    },
    {
      "id": "bank-thorny-tree-d",
      "name": "Thorny Tree D",
      "category": "trees",
      "image": "img/materials/trees/$$Thorny Tree D.png",
      "width": 1231,
      "height": 1264,
      "hasAlpha": true,
      "sha256":
        "c728b917d28214b4399bec5d779a3ebffc60a3d5ca46f42200523fb23fa16f10",
    },
    {
      "id": "bank-thorny-tree-double",
      "name": "Thorny Tree Double",
      "category": "trees",
      "image": "img/materials/trees/$$Thorny Tree Double.png",
      "width": 984,
      "height": 1273,
      "hasAlpha": true,
      "sha256":
        "ff1f9cca583c6b80d8da19f927a0ee19db08212eabd7047b76a40b23ebe0ec40",
    },
    {
      "id": "bank-thorny-tree-a-double",
      "name": "Thorny Tree A Double",
      "category": "trees",
      "image": "img/materials/trees/$$Thorny Tree A Double.png",
      "width": 1010,
      "height": 1376,
      "hasAlpha": true,
      "sha256":
        "5e849fdd567f5e6b1cf9e1ee60ccd6c167adc3eafa2ba22a245dc2d661f6265d",
    },
    {
      "id": "bank-twisted-tree-a",
      "name": "Twisted Tree A",
      "category": "trees",
      "image": "img/materials/trees/$$Twisted Tree A.png",
      "width": 1449,
      "height": 2087,
      "hasAlpha": true,
      "sha256":
        "508ae3797ffd4db34a5e941e5bc926a1bc93b14c34065e171c27858901c93c54",
    },
    {
      "id": "bank-twisted-tree-c",
      "name": "Twisted Tree C",
      "category": "trees",
      "image": "img/materials/trees/$$Twisted Tree C.png",
      "width": 1958,
      "height": 2569,
      "hasAlpha": true,
      "sha256":
        "d9608ad23636e97d8462082c555f7cb6e242b2573bc15c75e581d550505c4645",
    },
    {
      "id": "bank-twisted-tree-d",
      "name": "Twisted Tree D",
      "category": "trees",
      "image": "img/materials/trees/$$Twisted Tree D.png",
      "width": 2125,
      "height": 2795,
      "hasAlpha": true,
      "sha256":
        "c824003b7539f11d80ffc7f7e82e9a5d2c45c8d3e3cd0976ab68cf672aa85959",
    },
    {
      "id": "ground-moss",
      "name": "Seamless moss",
      "category": "ground",
      "image": "img/materials/ground/seamless-moss.png",
      "width": 1254,
      "height": 1254,
      "hasAlpha": false,
      "sourceRect": { "left": 0, "top": 0, "width": 384, "height": 384 },
      "decalImage": "img/materials/ground/mythos-moss.png",
      "generated": true,
    },
    {
      "id": "ground-forest-litter",
      "name": "Seamless forest-litter",
      "category": "ground",
      "image": "img/materials/ground/seamless-forest-litter.png",
      "width": 1254,
      "height": 1254,
      "hasAlpha": false,
      "sourceRect": { "left": 384, "top": 0, "width": 384, "height": 384 },
      "decalImage": "img/materials/ground/mythos-forest-litter.png",
      "generated": true,
    },
    {
      "id": "ground-mossy-stone",
      "name": "Seamless mossy-stone",
      "category": "ground",
      "image": "img/materials/ground/seamless-mossy-stone.png",
      "width": 1254,
      "height": 1254,
      "hasAlpha": false,
      "sourceRect": { "left": 0, "top": 384, "width": 384, "height": 384 },
      "decalImage": "img/materials/ground/mythos-mossy-stone.png",
      "generated": true,
    },
    {
      "id": "ground-earth",
      "name": "Seamless earth",
      "category": "ground",
      "image": "img/materials/ground/seamless-earth.png",
      "width": 1254,
      "height": 1254,
      "hasAlpha": false,
      "sourceRect": { "left": 384, "top": 384, "width": 384, "height": 384 },
      "decalImage": "img/materials/ground/mythos-earth.png",
      "generated": true,
    },
  ];
  const images = new Map();
  /* @function outdoor-assets.image.2 — Handles image within outdoor assets. Inputs: id. Updates: im src. Uses: assets find; images has; images set; images get. Returns: null; images get using id. */ function image(
    id,
  ) {
    const a = assets.find(
      /* @function outdoor-assets.callback.3 — Returns a id equals id. Inputs: a. Returns: a id equals id. */ (
        a,
      ) => a.id === id,
    );
    if (!a) return null;
    if (!images.has(id)) {
      const im = new Image();
      // October 15, 2026 (0.15.27): the PNG file itself; FrontierAssets supplies
      // the offline copy when the game is opened from disk.
      im.src = root.FrontierAssets.url(a.image);
      images.set(id, im);
    }
    return images.get(id);
  }
  /* @function outdoor-assets.install.4 — Handles install within outdoor assets. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier sprites sheet; frontier muzzle load; assets filter using a callback map; assets filter. */ function install() {
    for (const a of assets)
      if (a.category !== "ground" && a.category !== "rugs")
        FrontierSprites.sheet({ spriteProfile: a.id });
    FrontierMuzzle.load({
      schema: "phanicom-muzzles/1",
      profiles: assets
        .filter(
          /* @function outdoor-assets.callback.5 — Returns a category does not equal "ground" and a category does not equal "rugs". Inputs: a. Returns: a category does not equal "ground" and a category does not equal "rugs". */ (
            a,
          ) => a.category !== "ground" && a.category !== "rugs",
        )
        .map(
          /* @function outdoor-assets.callback.6 — Returns a record containing id, sheet, sheetData, rows, columns, frameWidth, frameHeight, referenceHeight. Inputs: a. Returns: a record containing id, sheet, sheetData, rows, columns, frameWidth, frameHeight, referenceHeight. */ (
            a,
          ) => ({
            id: a.id,
            // 0.15.27: no embedded sheetData; FrontierSprites resolves the
            // sheet path through FrontierAssets (offline copy in file mode).
            sheet: a.image,
            rows: 1,
            columns: 1,
            frameWidth: a.width,
            frameHeight: a.height,
            referenceHeight: a.height,
            frames: [
              { x: 0, y: 0, w: a.width, h: a.height, anchorX: a.width / 2 },
            ],
            direction: {
              rows: [0],
              idleColumn: 0,
              walkSequence: [0],
              frameSeconds: 1,
            },
            muzzles: {},
          }),
        ),
    });
  }
  /* @function outdoor-assets.world.7 — Handles world within outdoor assets. Inputs: base. Updates: w seed; w size; w width; w height; w spawn. Uses: structured clone; assets filter; frontier sprites sheet; frontier world rng. Returns: frontier world validate using w. */ function world(
    base,
  ) {
    const w = structuredClone(base);
    delete w.interior;
    delete w.travel;
    w.seed = "supplied-assets-forest";
    w.size = w.width = w.height = 64;
    w.spawn = { x: 32, y: 32 };
    w.objects = [];
    w.events = [];
    w.terrain = {
      mode: "flat",
      amplitude: 0,
      frequency: 0.12,
      edits: {},
      revision: 1,
    };
    w.groundMaterial = "ground-moss";
    w.vectorDisplay = { ...w.vectorDisplay, enabled: false };
    const entries = assets.filter(
      /* @function outdoor-assets.callback.8 — Returns a category equals "trees". Inputs: a. Returns: a category equals "trees". */ (
        a,
      ) => a.category === "trees",
    );
    for (const a of entries) FrontierSprites.sheet({ spriteProfile: a.id });
    const random = FrontierWorld.rng(w.seed);
    for (let i = 0; i < 180; i++) {
      const x = 3 + random() * 58,
        y = 3 + random() * 58;
      if (
        Math.hypot(x - 32, y - 32) < 5 ||
        Math.hypot(x - 24, y - 39) < 6 ||
        w.objects.some(
          /* @function outdoor-assets.callback.9 — Returns math hypot using e x minus x, e y minus y is less than 1.5. Inputs: e. Returns: math hypot using e x minus x, e y minus y is less than 1.5. */ (
            e,
          ) => Math.hypot(e.x - x, e.y - y) < 1.5,
        )
      )
        continue;
      const a = entries[i % entries.length];
      w.objects.push({
        ...FrontierWorld.entity("tree", x, y, "forest-tree-" + i),
        spriteProfile: a.id,
        name: a.name,
        vectorTreatment: "original",
      });
    }
    w.prefabs = entries.map(
      /* @function outdoor-assets.callback.10 — Returns a record containing id, name, kind, spriteProfile. Inputs: a. Returns: a record containing id, name, kind, spriteProfile. */ (
        a,
      ) => ({ id: a.id, name: a.name, kind: "tree", spriteProfile: a.id }),
    );
    w.water = FrontierWater.validate({ color: "#275756", cells: {} });
    for (let y = 34; y <= 44; y++)
      for (let x = 19; x <= 29; x++) {
        const d = Math.hypot((x - 24) / 5, (y - 39) / 5);
        if (d < 1) w.terrain.edits[x + "," + y] = -1.5 * (1 - d * d);
        if (d < 0.8) w.water.cells[x + "," + y] = -0.2;
      }
    return FrontierWorld.validate(w);
  } // Clip terrain triangles before projection instead of dropping whole near tiles.
  /* @function outdoor-assets.clipTerrain.11 — Clip terrain triangles before projection instead of dropping whole near tiles. Inputs: cam; poly. Uses: depth; out push; a map. Returns: out. */ function clipTerrain(
    cam,
    poly,
    depthOverride,
  ) {
    const depth =
        depthOverride ||
        (/* @function outdoor-assets.depth.12 — Returns p at 0 minus cam x multiplied by math sin using cam yaw plus p at 1 minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus p at 2 minus cam z multiplied by math sin using cam pitch. Inputs: p. Returns: p at 0 minus cam x multiplied by math sin using cam yaw plus p at 1 minus cam y multiplied by math cos using cam yaw multiplied by math cos using cam pitch plus p at 2 minus cam z multiplied by math sin using cam pitch. */ (
          p,
        ) =>
          ((p[0] - cam.x) * Math.sin(cam.yaw) +
            (p[1] - cam.y) * Math.cos(cam.yaw)) *
            Math.cos(cam.pitch) +
          (p[2] - cam.z) * Math.sin(cam.pitch)),
      out = [];
    /* October 12: shared cached depths make trivial near-plane classification cheap. Fully front triangles retain original vertices; crossing polygons still use the historical interpolation below. */ let insideCount = 0;
    for (const point of poly) if (depth(point) >= 0.13) insideCount++;
    if (insideCount === poly.length) return poly;
    if (!insideCount) return out;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i],
        b = poly[(i + 1) % poly.length],
        da = depth(a),
        db = depth(b),
        inside = da >= 0.13;
      if (inside) out.push(a);
      if (inside !== db >= 0.13) {
        const t = (0.13 - da) / (db - da);
        out.push(
          a.map(
            /* @function outdoor-assets.callback.13 — Returns v plus t multiplied by b at k minus v. Inputs: v; k. Returns: v plus t multiplied by b at k minus v. */ (
              v,
              k,
            ) => v + t * (b[k] - v),
          ),
        );
      }
    }
    return out;
  }
  /* October 13, 2026: elevation caches now retain at most 65,536 samples per live world. Large maps may recompute evicted samples; exact elevation and authored terrain remain unchanged. This supersedes the earlier map-grid-only bound, which could retain excessive data on large worlds. Tile geometry retains its separate 8,192-entry bound. */
  const terrainSamples1523 = new WeakMap();
  /* @function outdoor-assets.cachedHeight1523 — Inputs: source world and quarter-grid coordinates used by the unchanged terrain tessellation. Returns exact terrain elevation from a world-local cache. Invalidates when generation settings, spawn, seed, edit revision or edits identity changes. No geometry simplification; callers editing terrain in place must increment terrain revision, as authoring does. Weak ownership releases unloaded worlds; entries cover at most the rendered map grid. */
  function cachedHeight1523(world, x, y) {
    const t = world.terrain || {},
      key = [
        world.seed,
        world.width ?? world.size,
        world.height ?? world.size,
        world.spawn.x,
        world.spawn.y,
        t.mode,
        t.amplitude,
        t.frequency,
        t.revision || 0,
      ].join("|");
    let record = terrainSamples1523.get(world);
    if (!record || record.key !== key || record.edits !== t.edits) {
      record = { key, edits: t.edits, samples: new Map(), tiles: new Map() };
      terrainSamples1523.set(world, record);
    }
    const position = x + "," + y;
    if (record.samples.has(position)) return record.samples.get(position);
    const value = FrontierTerrain.height(world, x, y);
    if (record.samples.size >= 65536)
      record.samples.delete(record.samples.keys().next().value);
    record.samples.set(position, value);
    return value;
  }
  /* October 12, 2026: generated terrain elevations and authored quarter-grid samples do not change with camera movement. Cache their exact values rather than repeating trigonometric hill evaluation for all duplicated triangle corners every frame. Tessellation, clipping, UVs, sorting and depth remain unchanged. */
  /* @function outdoor-assets.heightSampler1523 — Inputs: world. Returns a per-frame exact elevation lookup with cache invalidation performed once, avoiding repeated settings signatures for every sample. The returned closure references only the source world and its bounded sample map; use synchronously during this draw. */
  function heightSampler1523(world) {
    cachedHeight1523(world, 0, 0);
    const record = terrainSamples1523.get(world);
    return /* @function outdoor-assets.heightLookup1523 — Inputs: quarter-grid X/Y world coordinates. Returns cached or newly evaluated exact elevation. Updates only the world-owned sample map; preserves authored data. */ function (
      x,
      y,
    ) {
      const key = x * 4 + y * 4 * ((world.width ?? world.size) + 1) * 4;
      if (record.samples.has(key)) return record.samples.get(key);
      const value = FrontierTerrain.height(world, x, y);
      if (record.samples.size >= 65536)
        record.samples.delete(record.samples.keys().next().value);
      record.samples.set(key, value);
      return value;
    };
  }
  /* @function outdoor-assets.terrainTile1523 — Inputs: world, integer tile X/Y and current height sampler. Returns cached exact tessellated triangles and their elevation bounds. Reuses shared grid vertices; keeps historical 1x1/4x4 subdivision criterion. Cache is revision-owned and capped at 8192 tiles; old entries evict without changing output. */
  function terrainTile1523(world, x, y, height) {
    const record = terrainSamples1523.get(world),
      key = x + y * (world.width ?? world.size);
    if (record.tiles.has(key)) return record.tiles.get(key);
    const z = [
        height(x, y),
        height(x + 1, y),
        height(x + 1, y + 1),
        height(x, y + 1),
      ],
      n = Math.max(...z) - Math.min(...z) > 0.001 ? 4 : 1,
      grid = [],
      triangles = [];
    let low = Infinity,
      high = -Infinity;
    for (let j = 0; j <= n; j++)
      for (let i = 0; i <= n; i++) {
        const u = x + i / n,
          v = y + j / n,
          h = height(u, v);
        grid.push([u, v, h]);
        low = Math.min(low, h);
        high = Math.max(high, h);
      }
    for (let j = 0; j < n; j++)
      for (let i = 0; i < n; i++) {
        const a = grid[j * (n + 1) + i],
          b = grid[j * (n + 1) + i + 1],
          c = grid[(j + 1) * (n + 1) + i + 1],
          d = grid[(j + 1) * (n + 1) + i];
        triangles.push([a, b, c], [a, c, d]);
      }
    const tile = { triangles, low, high };
    if (record.tiles.size >= 8192)
      record.tiles.delete(record.tiles.keys().next().value);
    record.tiles.set(key, tile);
    return tile;
  }
  /* @function outdoor-assets.terrainTileVisible1523 — Inputs: exact tile elevation bounds, integer X/Y, camera, projection service and logical width. Returns conservative frustum visibility from all eight AABB corners. Any near-plane crossing remains visible; all-behind/offscreen boxes can skip unchanged triangles safely. No geometry mutation or detail reduction. */
  function terrainTileVisible1523(tile, x, y, cam, project, width) {
    if (project.bounds)
      return project.bounds(x, y, tile.low, x + 1, y + 1, tile.high, width);
    const points = [];
    let behind = 0;
    for (const u of [x, x + 1])
      for (const v of [y, y + 1])
        for (const z of [tile.low, tile.high]) {
          const p = project(cam, u, v, z);
          if (!p) behind++;
          else points.push(p);
        }
    if (behind === 8) return false;
    if (behind) return true;
    let left = true,
      right = true,
      above = true,
      below = true;
    for (const p of points) {
      left = left && p.x < 0;
      right = right && p.x > width;
      above = above && p.y < 0;
      below = below && p.y > 480;
    }
    return !(left || right || above || below);
  }
  /* Superseded terrain construction callback retained as historical contract; cached builder above returns the same exact grid vertices. */
  /* @function outdoor-assets.callback.15 — Returns a list of u, v, frontier terrain height using world, u, v. Inputs: array pattern. Uses: frontier terrain height. Returns: a list of u, v, frontier terrain height using world, u, v. */
  /* @function outdoor-assets.draw.14 — Draws this system’s current state into the supplied rendering context. Inputs: ctx; game; cam; project. Uses: image; frontier terrain occlusion begin; frontier world dimensions; frontier terrain height. Returns: without a result. */ // October 13: a context owns one reusable terrain-view packet. Only identical
  // perspective camera/world/revision inputs reuse geometry; lights remain dynamic.
  const terrainViews1524 = new WeakMap();
  /* @function outdoorAssets.viewKey1524 — Inputs: active world, perspective camera and logical width. Returns a small deterministic camera/terrain key. Actual world/projector identity is checked separately. Authoring revisions and dimensions invalidate the packet; orthographic draws never reuse it. No source geometry mutation. */
  function viewKey1524(world, cam, width) {
    return [
      cam.x,
      cam.y,
      cam.z,
      cam.yaw,
      cam.pitch,
      cam.cx,
      cam.cy,
      width,
      world.seed,
      world.width,
      world.height,
      world.size,
      world.spawn.x,
      world.spawn.y,
      world.terrain?.mode,
      world.terrain?.amplitude,
      world.terrain?.frequency,
      world.terrain?.revision || 0,
    ].join("/");
  }
  /* @function outdoorAssets.drawCached1524 — Inputs: renderer context, game, camera and original projection service. Returns nothing. Reuses exact sorted triangles for an unchanged static terrain/camera; still clears and resubmits shared depth every frame for sprite/model interoperability. Mutable lighting and textures are evaluated every draw. Changed views rebuild through historical clipping/projection and release obsolete packet references. */
  function draw(ctx, game, cam, project) {
    const projector = project,
      key = cam.orthographic
        ? null
        : viewKey1524(game.sourceWorld, cam, game.viewWidth || 640);
    project = root.FrontierCameraBasis?.create(cam, project) || project;
    const world = game.sourceWorld,
      height1523 = heightSampler1523(world),
      im = image(world.groundMaterial);
    if (!ctx.waterQuad || (!world.groundMaterial && !world.terrain?.materialCount)) return;
    if (world.groundMaterial && (!im?.complete || !im.naturalWidth)) return;
    const terrainDepth = FrontierTerrainOcclusion.begin(
      ctx,
      game.viewWidth || 640,
      480,
    );
    /* October 12: camera basis is constant during one terrain draw. Each shared grid vertex receives one depth/projection calculation per frame; clipping output still uses the original projection service. */ const depthCache =
        new WeakMap(),
      projectionCache = new WeakMap(),
      sy = Math.sin(cam.yaw),
      cy = Math.cos(cam.yaw),
      sp = Math.sin(cam.pitch),
      cp = Math.cos(cam.pitch);
    /* @function outdoor-assets.depthPoint1523 — Inputs: shared world XYZ vertex. Returns exact forward camera depth, memoized for this frame. No source geometry changes; preserves historical operation order and near-plane threshold. */ function depthPoint1523(
      point,
    ) {
      if (depthCache.has(point)) return depthCache.get(point);
      const depth =
        ((point[0] - cam.x) * sy + (point[1] - cam.y) * cy) * cp +
        (point[2] - cam.z) * sp;
      depthCache.set(point, depth);
      return depth;
    }
    /* @function outdoor-assets.projectPoint1523 — Inputs: shared world XYZ vertex. Returns original projection or null, reused for adjacent triangles during this frame. Cache does not outlive camera state. */ function projectPoint1523(
      point,
    ) {
      if (projectionCache.has(point)) return projectionCache.get(point);
      const value = project(cam, ...point);
      projectionCache.set(point, value);
      return value;
    }
    const bounds = FrontierWorld.dimensions(world),
      cached = terrainViews1524.get(ctx),
      reused =
        key !== null &&
        cached?.world === world &&
        cached.projector === projector &&
        cached.key === key &&
        cached.edits === world.terrain?.edits,
      cells = reused ? cached.cells : [],
      material = {
        textureImage: im,
        color: "#ffffff",
        scale: 4,
        time: 0,
        speed: 0,
        warp: 0,
        flowX: 0,
        flowY: 0,
      };
    if (!reused) {
      for (
        let x = Math.max(0, Math.floor(cam.x - 48));
        x < Math.min(bounds.width, cam.x + 48);
        x++
      )
        for (
          let y = Math.max(0, Math.floor(cam.y - 48));
          y < Math.min(bounds.height, cam.y + 48);
          y++
        ) {
          const tile = terrainTile1523(world, x, y, height1523);
          if (
            !terrainTileVisible1523(
              tile,
              x,
              y,
              cam,
              project,
              game.viewWidth || 640,
            )
          )
            continue;
          for (const triangle of tile.triangles) {
            const poly = clipTerrain(cam, triangle, depthPoint1523);
            if (poly.length < 3) continue;
            for (let k = 1; k < poly.length - 1; k++) {
              const vertices = [poly[0], poly[k], poly[k + 1]],
                p = vertices.map(
                  /* @function outdoor-assets.callback.16 — Returns project using cam, spread element. Inputs: v. Uses: project. Returns: project using cam, spread element. */ (
                    v,
                  ) => projectPoint1523(v),
                );
              if (
                p.some(
                  /* @function outdoor-assets.callback.17 — Returns the inverse of v. Inputs: v. Returns: the inverse of v. */ (
                    v,
                  ) => !v,
                ) ||
                p.every(
                  /* @function outdoor-assets.callback.18 — Returns v x is less than 0. Inputs: v. Returns: v x is less than 0. */ (
                    v,
                  ) => v.x < 0,
                ) ||
                p.every(
                  /* @function outdoor-assets.callback.19 — Returns v x is greater than game view width. Inputs: v. Returns: v x is greater than game view width. */ (
                    v,
                  ) => v.x > game.viewWidth,
                ) ||
                p.every(
                  /* @function outdoor-assets.callback.20 — Returns v y is less than 0. Inputs: v. Returns: v y is less than 0. */ (
                    v,
                  ) => v.y < 0,
                ) ||
                p.every(
                  /* @function outdoor-assets.callback.21 — Returns v y is greater than 480. Inputs: v. Returns: v y is greater than 480. */ (
                    v,
                  ) => v.y > 480,
                )
              )
                continue;
              cells.push({
                p,
                world: vertices,
                coords:
                  /* October 13: XYZ vertices already supply identical UV X/Y; eliminate three XY copies per triangle. The superseded callback explanation is retained below. */ /* @function outdoor-assets.callback.22 — Returns v slice using 0, 2. Inputs: v. Uses: v slice. Returns: v slice using 0, 2. */ vertices,
                depth:
                  p.reduce(
                    /* @function outdoor-assets.callback.23 — Returns s plus v depth. Inputs: s; v. Returns: s plus v depth. */ (
                      s,
                      v,
                    ) => s + v.depth,
                    0,
                  ) / 3,
                x,
                y,
              });
            }
          }
        }
      cells.sort(
        /* @function outdoor-assets.callback.24 — Returns b depth minus a depth. Inputs: a; b. Returns: b depth minus a depth. */ (
          a,
          b,
        ) => b.depth - a.depth,
      );
      if (key !== null)
        terrainViews1524.set(ctx, {
          world,
          projector,
          key,
          edits: world.terrain?.edits,
          cells,
        });
      else terrainViews1524.delete(ctx);
    }
    // October 14: cache material groups alongside unchanged projected geometry.
    // Painted vector maps draw only painted cells; empty cells keep vector style.
    // At most four texture batches replace a per-triangle GPU submission.
    const packet = terrainViews1524.get(ctx);
    let groups = reused ? packet?.materialGroups : null;
    if (!groups) {
      groups = new Map();
      for (const cell of cells) {
        const id = world.terrain?.materials?.[cell.x + "," + cell.y] || world.groundMaterial;
        if (!id) continue;
        if (!groups.has(id)) groups.set(id, []);
        groups.get(id).push(cell);
      }
      if (packet) packet.materialGroups = groups;
    }
    for (const [id, group] of groups) {
      const texture = image(id);
      if (!texture?.complete || !texture.naturalWidth) continue;
      const surface = { ...material, textureImage: texture };
      for (const cell of group) {
        FrontierTerrainOcclusion.triangle(terrainDepth, cell.p);
        if (!ctx.terrainBatch1523) ctx.waterQuad(cell.p, surface, cell.x, cell.y, cell.coords);
      }
      if (ctx.terrainBatch1523) ctx.terrainBatch1523(group, surface);
    }
  }
  root.FrontierOutdoorAssets = { assets, image, install, world, draw };
})(window);
