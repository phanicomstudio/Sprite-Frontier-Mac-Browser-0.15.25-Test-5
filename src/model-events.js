/* October 13, 2026: adjacent contracts supersede retained generated descriptions; instance materials extend appearance only, with collision/interaction still independent. */
/* Visuals, collision and interaction are independent event components. Zones
 * reference existing event IDs, so each uses the same page/command interpreter
 * instead of creating a second event language. All transforms are model-local. */
/* Historical generated explanation: @function model-events.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier model events. */
(/* @function modelEvents.callback.1 - Inputs: browser/global namespace. Returns: nothing; installs spatial validation and runtime transform/zone helpers. No asset decoding, scene creation or persistent mutation at script load. */ function (
  root,
) {
  "use strict";
  /* Historical generated explanation: @function model-events.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Uses: a list of "sprite", "model", "none" includes; error; /^[A-Za-z0-9_-]{1,60}$/ test; a list of "none", "custom", "mesh" includes. Returns: undefined; a record containing visual, collisionMode, copied fields, rotation, scale, collisionBoxes, interactionZones. */
  /* @function modelEvents.validate.2 - Inputs: optional authored spatial component. Returns: detached normalized visual, transform, material override, collision and zone settings; undefined preserves legacy sprites. Rejects unsupported modes/IDs/transforms and duplicate volume IDs before adoption. Unconfigured model collision defaults to mesh; explicit none/custom remains independent. Rotations are local degrees, scale dimensionless, volumes local metres. Asset/slot existence is checked by project validation, not this shape validator. */ function validate(
    value,
  ) {
    if (value === undefined) return undefined;
    if (!value || !["sprite", "model", "none"].includes(value.visual))
      throw Error("Invalid event visual type");
    if (
      value.visual === "model" &&
      (typeof value.modelId !== "string" ||
        !/^[A-Za-z0-9_-]{1,60}$/.test(value.modelId))
    )
      throw Error("Choose a model ID");
    /* October 12, 2026: unconfigured solid models use their actual geometry by default. Explicit none/custom choices remain independent overrides. */ const collisionMode =
      value.collisionMode || (value.visual === "model" ? "mesh" : "custom");
    if (
      !["none", "custom", "mesh"].includes(collisionMode) ||
      (collisionMode === "mesh" && value.visual !== "model")
    )
      throw Error("Exact geometry collision requires a 3D model");
    const transform = FrontierModelTransform.validate({
        rotation: value.rotation,
        scale: value.scale,
      }),
      ids =
        new Set(); /* Historical generated explanation: @function model-events.boxes.3 — Handles boxes within event model transforms and spatial settings. Inputs: values; zones. Uses: array is array; error; values or a list of map. Returns: values or a list of map using a callback. */
    /* @function modelEvents.boxes.3 - Inputs: optional volume array and Boolean zone flag. Returns: detached validated local boxes, at most 128 per component. Shares the outer ID set across collision and zone arrays so identities cannot collide. Zone records additionally require a stable target event ID and supported trigger; invalid data throws without changing source arrays. */ function boxes(
      values,
      zones,
    ) {
      if (!Array.isArray(values || []) || (values || []).length > 128)
        throw Error("At most 128 boxes per component");
      return (values || []).map(
        /* Historical generated explanation: @function model-events.callback.4 — Provides the callback for values or a list of map. Inputs: v. Uses: frontier model transform box; ids has; error; ids add. Returns: box; a record containing copied fields, eventId, trigger, enabled. */
        /* @function modelEvents.callback.4 - Inputs: one authored local box/zone record. Returns: validated geometry plus zone event/trigger/enabled metadata when applicable. Throws duplicate identity or unsupported event/trigger; records IDs only in the temporary validation set. No persistent mutation. */ (
          v,
        ) => {
          const box = FrontierModelTransform.box(v);
          if (ids.has(box.id)) throw Error("Duplicate collision/zone ID");
          ids.add(box.id);
          if (!zones) return box;
          if (
            typeof v.eventId !== "string" ||
            !/^[A-Za-z0-9_-]{1,60}$/.test(v.eventId) ||
            !["interact", "enter", "exit"].includes(v.trigger || "interact")
          )
            throw Error("Invalid zone event or trigger");
          return {
            ...box,
            eventId: v.eventId,
            trigger: v.trigger || "interact",
            enabled: v.enabled !== false,
          };
        },
      );
    }
    /* October 13: instance material slots are portable authored metadata; source model bytes and collision remain independent. */ return {
      visual: value.visual,
      ...(value.materials === undefined
        ? {}
        : { materials: root.FrontierModelMaterials.validate(value.materials) }),
      drawDistance: root.FrontierModelVisibility
        ? root.FrontierModelVisibility.validate(value.drawDistance)
        : value.drawDistance,
      collisionMode,
      ...(value.visual === "model" ? { modelId: value.modelId } : {}),
      rotation: transform.rotation,
      scale: transform.scale,
      collisionBoxes: boxes(value.collisionBoxes, false),
      interactionZones: boxes(value.interactionZones, true),
    };
  }
  /* Historical generated explanation: @function model-events.entityFields.5 — Handles entity fields within event model transforms and spatial settings. Inputs: component. Uses: a list of "mesh", "none" includes. Returns: a record containing ; a record containing modelId, modelTransform, spatial, copied fields, copied fields. */
  /* @function modelEvents.entityFields.5 - Inputs: optional validated spatial component. Returns: fields for a runtime entity, retaining spatial/material metadata and model rotation/scale references. Mesh/none disable legacy coarse solid collision so native geometry/explicit absence remains authoritative; invisible visuals remove sprite presentation. Does not itself move an entity or load assets. */ function entityFields(
    component,
  ) {
    if (!component) return {};
    return {
      modelId: component.visual === "model" ? component.modelId : undefined,
      modelTransform: { rotation: component.rotation, scale: component.scale },
      spatial: component,
      ...(["mesh", "none"].includes(component.collisionMode)
        ? { solid: false }
        : {}),
      ...(component.visual === "none"
        ? { kind: "none", spriteProfile: undefined }
        : {}),
    };
  }
  /* Historical generated explanation: @function model-events.matrix.6 — Handles matrix within event model transforms and spatial settings. Inputs: entity. Uses: frontier model transform matrix. Returns: frontier model transform matrix using a record containing position, rotation, scale. */
  /* @function modelEvents.matrix.6 - Inputs: runtime entity with world XYZ and optional local rotation/scale. Returns: column-major local-to-world matrix using metre positions, degree rotations and dimensionless scales. No mutation; malformed transform data propagates validation errors. */ function matrix(
    entity,
  ) {
    return FrontierModelTransform.matrix({
      position: [entity.x, entity.y, entity.z || 0],
      rotation: entity.spatial?.rotation,
      scale: entity.spatial?.scale,
    });
  }
  /* Historical generated explanation: @function model-events.contains.7 — Handles contains within event model transforms and spatial settings. Inputs: entity; point; assignment pattern. Uses: chain or a list of filter. Returns: chain or a list of filter using a callback. */
  /* @function modelEvents.contains.7 - Inputs: entity, world-space XYZ point and optional component array name (interactionZones by default). Returns: enabled volumes containing the point after local-to-world transform. Missing components yield an empty list. Read-only; caller owns enter/exit state and event execution. */ function contains(
    entity,
    point,
    component = "interactionZones",
  ) {
    return (entity.spatial?.[component] || []).filter(
      /* Historical generated explanation: @function model-events.callback.8 — Returns b enabled does not equal false and frontier model transform contains using point, b, matrix using entity. Inputs: b. Uses: frontier model transform contains; matrix. Returns: b enabled does not equal false and frontier model transform contains using point, b, matrix using entity. */
      /* @function modelEvents.callback.8 - Inputs: validated local volume. Returns: true only when enabled and the transformed volume contains the captured world point. Does not activate events or change overlap history. */ (
        b,
      ) =>
        b.enabled !== false &&
        FrontierModelTransform.contains(point, b, matrix(entity)),
    );
  }
  /* Historical generated explanation: @function model-events.rayZones.9 — Handles ray zones within event model transforms and spatial settings. Inputs: entity; origin; direction; max distance. Uses: matrix; frontier model transform ray box; hits push; hits sort. Returns: hits sort using a callback. */
  /* @function modelEvents.rayZones.9 - Inputs: entity, world ray origin/direction and maximum world distance in metres. Returns: enabled interact-zone hits sorted nearest first with deterministic zone-ID ties. Native inverse-transform math preserves distance under nonuniform scale. No collision, event execution or source mutation; callers use the returned event ID. */ function rayZones(
    entity,
    origin,
    direction,
    maxDistance,
  ) {
    const m = matrix(entity),
      hits = [];
    for (const box of entity.spatial?.interactionZones || []) {
      if (!box.enabled || box.trigger !== "interact") continue;
      const distance = FrontierModelTransform.rayBox(
        origin,
        direction,
        box,
        m,
        maxDistance,
      );
      if (distance !== null)
        hits.push({ entity, zone: box, distance, eventId: box.eventId });
    }
    return hits.sort(
      /* Historical generated explanation: @function model-events.callback.10 — Returns a distance minus b distance or a zone id locale compare using b zone id. Inputs: a; b. Uses: a zone id locale compare. Returns: a distance minus b distance or a zone id locale compare using b zone id. */
      /* @function modelEvents.callback.10 - Inputs: two zone-hit records. Returns: ascending world-distance ordering, then stable zone-ID lexical tie break. Sorting changes only the newly built hit array. */ (
        a,
        b,
      ) => a.distance - b.distance || a.zone.id.localeCompare(b.zone.id),
    );
  }
  root.FrontierModelEvents = {
    validate,
    entityFields,
    matrix,
    contains,
    rayZones,
  };
})(typeof window === "undefined" ? globalThis : window);
