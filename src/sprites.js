/* MAINTAINER GUIDE
 * Sprite profile resolution. Holstered Candy uses the four-direction unarmed sheet; armed Candy uses eight directions. NPCs resolve authored profile IDs. Image caches must support file:// as well as local HTTP.
 * See docs/CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function sprites.callback.1 — Provides the callback for a callback. Inputs: root. Updates: frontier candy id; frontier candy columns; frontier candy reference height; frontier candy unarmed columns; frontier candy unarmed reference height. */
(/* @function sprites.installReviewed — Installs sprite-profile resolution and shared image caches. Holstered Candy uses four directions, armed Candy eight, and NPCs use authored profile IDs; file:// and local HTTP packages share the same cache contract. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  const images = new Map();
  FrontierCandy.id = "candy-armed";
  FrontierCandy.columns = 3;
  FrontierCandy.referenceHeight = 310;
  FrontierCandyUnarmed.columns = 3;
  FrontierCandyUnarmed.referenceHeight = 310;
  // Choose unarmed/armed/player/NPC sheet metadata without changing movement or combat logic.
  /* @function sprites.sheet.2 — Choose unarmed/armed/player/NPC sheet metadata without changing movement or combat logic. Inputs: entity. Updates: image; image src. Uses: frontier muzzle profiles get; images get; images set. Returns: frontier candy unarmed; null. */ function sheet(
    entity,
  ) {
    if (entity.id === "player" || entity.kind === "player") {
      if (entity.holstered) return FrontierCandyUnarmed;
    }
    const id =
      (!entity.holstered && entity.weapon?.type === "melee"
        ? entity.weapon.spriteProfile
        : "") ||
      entity.spriteProfile ||
      (entity.id === "player" || entity.kind === "player" ? "candy-armed" : "");
    if (!id) return null;
    // October 14: static item PNGs use one frame and the existing camera-facing
    // depth/anchor path. They do not masquerade as weapon muzzle profiles.
    if (id.startsWith("item-asset:")) {
      const itemId = id.slice(11);
      const item = root.FrontierItems?.find(
        /* @function sprites.itemDefinition1525 — Inputs: item definition. Returns stable item-ID match; no mutation. */
        function (entry) { return entry.id === itemId; });
      const asset = item?.properties?.sprite;
      if (!asset) return null;
      let image = images.get(asset.src);
      if (!image) { image = new Image(); image.src = root.FrontierItemImageData?.[asset.src] || asset.src; images.set(asset.src, image); }
      return { id, image, columns: 1, referenceHeight: asset.height,
        frames: [{ x:0, y:0, w:asset.width, h:asset.height, anchorX:asset.width/2 }],
        direction: { rows:[0], idleColumn:0, walkSequence:[0], frameSeconds:1 } };
    }
    if (id === "candy-armed") {
      const p = FrontierMuzzle.profiles.get(id);
      return {
        ...FrontierCandy,
        frames: p?.frames || FrontierCandy.frames,
        direction: p?.direction || FrontierCandy.direction,
      };
    }
    const p = FrontierMuzzle.profiles.get(id);
    if (!p) return null;
    let image = images.get(p.sheetData || p.sheet);
    if (!image) {
      image = new Image();
      image.src = p.sheetData || p.sheet;
      images.set(p.sheetData || p.sheet, image);
    }
    return {
      ...p,
      image,
      groundInset: root.FrontierTreeAnchors?.[id] || 0,
    };
  }
  root.FrontierSprites = {
    sheet,
  };
})(window);
