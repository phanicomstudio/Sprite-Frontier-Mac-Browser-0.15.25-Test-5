/* October 14, 2026: the retained introduction below predates enabled MZ 201 integration. This module still only resolves destinations; the current scene transition/continuation services own loading and adoption. */
/* MZ 201 destination contract, independent from scene loading and dialogs.
 * Resolve variable operands at execution time, never during authoring. Resolving
 * is read-only: the caller must finish validation before reserving a transition.
 * Coordinates remain continuous in Sprite Frontier; native integer records also
 * round-trip. Map lookup uses persistent numeric IDs rather than library order.
 * Scene fade/wait/continuation ownership must be implemented before enabling 201. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function transfer-player.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier transfer player. */
(/* @function transfer-player.installReviewed — Installs read-only MZ map-destination resolution. Variable operands resolve at execution time and stable numeric IDs determine cells, independent of library order. Continuous coordinates round-trip; scene loading/effects own transition reservation and adoption. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  const integer =
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function transfer-player.integer.2 — Returns number is integer using v and v is at least min and v is at most max. Inputs: v; min; max. Uses: number is integer. Returns: number is integer using v and v is at least min and v is at most max. */
  /* @function transfer-player.integer.2Reviewed — Checks an integer operand against inclusive limits. Inputs: value, minimum and maximum. Returns a boolean, rejecting fractional/non-numeric values without coercion; no mutation or exception for ordinary invalid operands. */ (
      v,
      min,
      max,
    ) => Number.isInteger(v) && v >= min && v <= max;
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function transfer-player.validate.3 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: parameters. Uses: structured clone; array is array; integer; a list of 0, 2, 4, 6 includes. Returns: p. */
  /* @function transfer-player.validate.3Reviewed — Validates the six-operand MZ Transfer Player command without resolving variables. Inputs: [mode, map/map-variable, x/x-variable, y/y-variable, direction, fade]. Returns a structured clone. Mode 0 accepts map IDs 1–999999 and finite continuous coordinates 0–999999; mode 1 requires variable IDs 1–5000. Direction is keep/2/4/6/8 and fade 0–2. Throws on cloning/schema errors; destination bounds and collision are checked later. No live state mutation. */ function validate(
    parameters,
  ) {
    const p = structuredClone(parameters);
    if (
      !Array.isArray(p) ||
      p.length !== 6 ||
      !integer(p[0], 0, 1) ||
      !integer(p[1], 1, p[0] === 1 ? 5000 : 999999) ||
      ![0, 2, 4, 6, 8].includes(p[4]) ||
      !integer(p[5], 0, 2)
    )
      throw Error("Invalid Transfer Player parameters.");
    if (p[0] === 1) {
      if (!integer(p[2], 1, 5000) || !integer(p[3], 1, 5000))
        throw Error("Transfer coordinates require variable IDs.");
    } else if (
      ![p[2], p[3]].every(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function transfer-player.callback.4 — Returns number is finite using v and v is at least 0 and v is at most 999999. Inputs: v. Uses: number is finite. Returns: number is finite using v and v is at least 0 and v is at most 999999. */
  /* @function transfer-player.callback.4Reviewed — Checks one direct transfer coordinate before destination resolution. Inputs: candidate coordinate in horizontal world units. Returns whether finite and within inclusive 0–999999; fractions are supported. This broad schema range does not imply the coordinate fits a particular cell. No mutation. */ (
          v,
        ) => Number.isFinite(v) && v >= 0 && v <= 999999,
      )
    )
      throw Error("Invalid transfer coordinates.");
    return p;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function transfer-player.resolve.5 — Handles resolve within transfer player. Inputs: parameters; object pattern. Uses: validate; read; integer; error. Returns: a record containing map, mapNumber, entry, direction, fade. */
  /* @function transfer-player.resolve.5Reviewed — Resolves and validates a transfer destination at execution time. Inputs: validated command operands plus variable Map, player facing, map collection or read-only resolveMap callback, and optional canStand(world,x,y). Returns stable map ID/number, horizontal entry coordinates and yaw in radians, direction and fade code. Rejects missing maps, invalid variable results, out-of-playable-bounds coordinates or blocked entry; service errors propagate. Uses direct library lookup when available to avoid serializing all cells. Does not reserve a transition, load the scene or move the player; caller owns adoption/continuation. */ function resolve(
    parameters,
    { variables, player, maps, resolveMap, canStand },
  ) {
    const p = validate(parameters),
      read =
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function transfer-player.read.6 — Returns chain or the fallback 0. Inputs: id. Uses: variables get; string. Returns: chain or the fallback 0. */
  /* @function transfer-player.read.6Reviewed — Reads a transfer variable operand at execution time. Inputs: numeric variable ID. Returns the value under its string key or numeric zero when absent/nullish. Does not coerce stored data or change the Map; enclosing resolver validates each result. */ (
          id,
        ) => variables?.get(String(id)) ?? 0,
      mapNumber = p[0] === 0 ? p[1] : read(p[1]),
      x = p[0] === 0 ? p[2] : read(p[2]),
      y = p[0] === 0 ? p[3] : read(p[3]);
    if (!integer(mapNumber, 1, 999999))
      throw Error("Transfer map variable does not contain a valid map ID.");
    /* October 12, 2026: runtime lookup may use the map library directly. Persistence snapshots embed every model bundle and clone every map; resolving a single read-only destination must not serialize the project. Existing callers supplying maps retain their contract. */ const map =
      resolveMap
        ? resolveMap(mapNumber)
        : root.FrontierMapIdentities.resolve(maps, mapNumber);
    if (!map)
      throw Error("Transfer destination map " + mapNumber + " is missing.");
    const width = map.world.width ?? map.world.size,
      height = map.world.height ?? map.world.size;
    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y) ||
      x < 1 ||
      y < 1 ||
      x > width - 1 ||
      y > height - 1
    )
      throw Error("Transfer destination is outside the map playable bounds.");
    if (canStand && !canStand(map.world, x, y))
      throw Error("Transfer destination is blocked.");
    const yaw =
      p[4] === 0
        ? Math.atan2(player?.facingX ?? 0, player?.facingY ?? 1)
        : { 2: 0, 4: -Math.PI / 2, 6: Math.PI / 2, 8: Math.PI }[p[4]];
    return {
      map: map.id,
      mapNumber,
      entry: { x, y, yaw },
      direction: p[4],
      fade: p[5],
    };
  }
  root.FrontierTransferPlayer = { validate, resolve };
})(typeof window === "undefined" ? globalThis : window);
