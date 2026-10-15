/* October 9, 2026: independently authored door presentation. Geometry is shared,
 * while animated instance matrices are private. Never modifies world collision.
 * The caller owns transfer commit; this service owns presentation and SE cues. */
(/* @function door-transition.install — Inputs: root namespace. Installs validation, timeline and presentation factories. Returns nothing; creates no canvases until requested. */ function (
  root,
) {
  "use strict";
  const modes = ["default", "door", "melt", "fade", "immediate"];
  /* @function door-transition.number — Inputs: value, fallback and allowed numeric range. Returns finite value or fallback; throws outside range. Units belong to the requesting field. No mutation. */
  function number(value, fallback, min, max) {
    const n = value ?? fallback;
    if (!Number.isFinite(n) || n < min || n > max)
      throw Error("Door setting outside allowed range.");
    return n;
  }
  /* @function door-transition.vector — Inputs: optional three-component vector and fallback. Returns copied finite vector; throws for malformed values. World/local units depend on field. */
  function vector(v, fallback) {
    const out = v ?? fallback;
    if (!Array.isArray(out) || out.length !== 3 || !out.every(Number.isFinite))
      throw Error("Door vector needs three finite values.");
    return [...out];
  }
  /* @function door-transition.sound — Inputs: optional sound choice. Returns normalized random/manual/none choice with gain 0–1. Throws invalid mode/name; missing resources produce silence at playback. */
  function sound(v = { mode: "random" }) {
    if (
      !["random", "manual", "none"].includes(v.mode) ||
      (v.mode === "manual" &&
        (typeof v.name !== "string" || v.name.length > 160))
    )
      throw Error("Invalid door sound choice.");
    return {
      mode: v.mode,
      name: v.name || "",
      gain: number(v.gain, 0.7, 0, 1),
    };
  }
  /* @function door-transition.validate — Inputs: optional door composition. Returns JSON-safe normalized copy; rejects invalid timing/assets/nodes or more than two moving leaves. Hinges use engine Z-up degrees/sec; slides use local world units/sec. */
  function validate(value = {}) {
    const v = { ...value };
    if (!modes.includes(v.effect ?? "door"))
      throw Error("Invalid door transition style.");
    const frame =
      v.frame === null
        ? null
        : {
            modelId: v.frame?.modelId || "builtin-antique-door",
            node: v.frame?.node ?? 0,
          };
    const leaves = v.leaves ?? [
      {
        modelId: "builtin-antique-door",
        node: 1,
        motion: "hinged",
        angle: -85,
        speed: 65,
      },
    ];
    if (!Array.isArray(leaves) || leaves.length > 2)
      throw Error("Door scene supports zero, one or two moving leaves.");
    const checked = [];
    for (const leaf of leaves) {
      if (!["hinged", "sliding"].includes(leaf.motion ?? "hinged"))
        throw Error("Choose hinged or sliding motion.");
      const modelId = leaf.modelId || "builtin-antique-door",
        node = leaf.node ?? 1;
      if (
        typeof modelId !== "string" ||
        modelId.length > 60 ||
        !Number.isInteger(node) ||
        node < 0 ||
        node > 10000
      )
        throw Error("Invalid door mesh selection.");
      checked.push({
        modelId,
        node,
        motion: leaf.motion ?? "hinged",
        angle: number(leaf.angle, -85, -175, 175),
        speed: number(leaf.speed, 65, 0.01, 1000),
        distance: number(leaf.distance, 1, 0, 30),
        axis: vector(leaf.axis, [1, 0, 0]),
        hingeAxis: vector(leaf.hingeAxis, [0, 0, 1]),
        pivot: leaf.pivot == null ? null : vector(leaf.pivot, [0, 0, 0]),
        position: vector(leaf.position, [0, 0, 0]),
        rotation: vector(leaf.rotation, [0, 0, 0]),
        scale: vector(leaf.scale, [1, 1, 1]),
      });
    }
    for (const leaf of checked) {
      if (
        Math.hypot(...leaf.hingeAxis) < 0.0001 ||
        Math.hypot(...leaf.axis) < 0.0001 ||
        leaf.scale.some(
          /* @function door-transition.singularScale — Inputs: local scale component. Returns whether zero/near-zero would collapse geometry; no effects. */ (
            n,
          ) => Math.abs(n) < 0.0001,
        )
      )
        throw Error("Door axes and scale must be nonzero.");
      const length = Math.hypot(...leaf.axis);
      leaf.axis = leaf.axis.map(
        /* @function door-transition.normalizedSlide — Inputs: direction component. Returns unit-vector component so distance is in actual world units. */ (
          n,
        ) => n / length,
      );
    }
    if (typeof (v.synchronized ?? true) !== "boolean")
      throw Error("Invalid door synchronization.");
    if (
      frame &&
      (typeof frame.modelId !== "string" ||
        !Number.isInteger(frame.node) ||
        frame.node < 0)
    )
      throw Error("Invalid static frame.");
    return {
      effect: v.effect ?? "door",
      frame,
      leaves: checked,
      synchronized: v.synchronized ?? true,
      approach: number(v.approach, 1.3, 0, 10),
      approachDistance: number(v.approachDistance, 1.2, 0, 20),
      passage: number(v.passage, 1, 0.05, 10),
      hold: number(v.hold, 0.25, 0, 10),
      open: sound(v.open),
      close: sound(v.close),
      creak: sound(v.creak ?? { mode: "none" }),
    };
  }
  /* @function door-transition.axisRotation — Inputs: nonzero local hinge axis and degrees. Returns a column-major rotation matrix using normalized axis. No mutation; used only for visual transition meshes, not world collision. */
  function axisRotation(axis, degrees) {
    const length = Math.hypot(...axis),
      x = axis[0] / length,
      y = axis[1] / length,
      z = axis[2] / length,
      a = (degrees * Math.PI) / 180,
      c = Math.cos(a),
      s = Math.sin(a),
      t = 1 - c;
    return [
      t * x * x + c,
      t * x * y + s * z,
      t * x * z - s * y,
      0,
      t * x * y - s * z,
      t * y * y + c,
      t * y * z + s * x,
      0,
      t * x * z + s * y,
      t * y * z - s * x,
      t * z * z + c,
      0,
      0,
      0,
      0,
      1,
    ];
  }
  /* @function door-transition.duration — Inputs: normalized leaf. Returns motion time in seconds; hinged degrees/s or sliding units/s. No state changes. */
  function duration(leaf) {
    return (
      (leaf.motion === "hinged" ? Math.abs(leaf.angle) : leaf.distance) /
      leaf.speed
    );
  }
  /* @function door-transition.timeline — Inputs: validated configuration, elapsed seconds. Returns phase, progress and each leaf's opening fraction. Does not mutate config. Unequal leaves finish before passage; synchronized leaves share the longest duration. */
  function timeline(config, time) {
    let opening = 0.01;
    for (const leaf of config.leaves)
      opening = Math.max(opening, duration(leaf));
    const a = config.approach,
      b = a + opening,
      c = b + config.passage,
      d = c + config.hold,
      e = d + opening;
    let phase, progress;
    if (time < a) {
      phase = "approach";
      progress = a ? time / a : 1;
    } else if (time < b) {
      phase = "open";
      progress = (time - a) / opening;
    } else if (time < c) {
      phase = "passage";
      progress = (time - b) / config.passage;
    } else if (time < d) {
      phase = "black";
      progress = 1;
    } else if (time < e) {
      phase = "close";
      progress = (time - d) / opening;
    } else {
      phase = "done";
      progress = 1;
    }
    const fractions = [];
    for (const leaf of config.leaves) {
      const local = config.synchronized
        ? opening
        : Math.max(0.01, duration(leaf));
      fractions.push(
        phase === "approach"
          ? 0
          : phase === "open"
            ? Math.min(1, (time - a) / local)
            : phase === "close"
              ? 1 - Math.min(1, (time - d) / local)
              : 1,
      );
    }
    return { phase, progress, fractions, total: e };
  }
  /* @function door-transition.create — Inputs: canvas host, sound playback and diagnostic callbacks. Returns begin/update/end/preview operations. Uses a reusable 640x480 canvas; geometry and textures decode once. Errors are reported and propagate for transfer fallback. */
  function create({ host, play, report }) {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    canvas.className = "doorTransitionCanvas";
    canvas.hidden = true;
    host.append(canvas);
    const ctx = canvas.getContext("2d"),
      privateAssets = new Map();
    let config,
      time = 0,
      lastPhase = "",
      previewing = false,
      raf = 0,
      center = [0.45, 0, 1.1],
      resourcesWarmed = false;
    /* @function door-transition.asset — Inputs: shared asset ID. Returns decoded asset or throws unavailable ID. Built-in GLB decodes once outside the project library, so it is not duplicated in every project save. */
    function asset(id) {
      if (root.FrontierModelLibrary.get(id))
        return root.FrontierModelLibrary.get(id);
      if (id !== "builtin-antique-door") {
        const found = root.FrontierModelLibrary.get(id);
        if (!found) throw Error("Door model is not loaded: " + id);
        return found;
      }
      if (!privateAssets.has(id)) {
        const bytes = Uint8Array.from(
          atob(root.FrontierAntiqueDoor),
          /* @function door-transition.byte — Inputs: base64-decoded character. Returns its byte code; no effects. */ (
            c,
          ) => c.charCodeAt(0),
        );
        const decoded = root.FrontierModelLibrary.decodeStatic({
          entry: "assembly.glb",
          files: { "assembly.glb": bytes },
        });
        decoded.scene = root.FrontierModelScene.compile(decoded);
        privateAssets.set(id, decoded);
      }
      return privateAssets.get(id);
    }
    /* @function door-transition.begin — Inputs: optional configuration. Validates and prepares all resources before starting; returns nothing. Throws unavailable node/assets. Clears stale phase cues and reveals black-backed canvas. */
    function begin(value) {
      end();
      config = validate(value);
      for (const part of [
        ...(config.frame ? [config.frame] : []),
        ...config.leaves,
      ]) {
        const model = asset(part.modelId);
        if (
          !model.scene.instances.some(
            /* @function door-transition.nodeExists — Inputs: mesh instance. Returns whether requested node matches; no mutation. */ (
              n,
            ) => n.node === part.node,
          )
        )
          throw Error("Door mesh node is missing.");
        root.FrontierModelRenderer.prepare(model);
      }
      /* October 10, 2026: derive framing from selected closed parts, not the antique door's offset hinge. Keep this center fixed while leaves animate so the camera never chases their moving bounds. */ const lo =
          [Infinity, Infinity, Infinity],
        hi = [-Infinity, -Infinity, -Infinity],
        T = root.FrontierModelTransform;
      for (const part of [
        ...(config.frame ? [config.frame] : []),
        ...config.leaves,
      ]) {
        const model = asset(part.modelId),
          instance = model.scene.instances.find(
            /* @function door-transition.centerNode — Inputs: compiled mesh instance. Returns whether it belongs to the selected closed part. No mutation. */ (
              n,
            ) => n.node === part.node,
          ),
          matrix = T.multiply(
            T.matrix({
              position: part.position || [0, 0, 0],
              rotation: part.rotation || [0, 0, 0],
              scale: part.scale || [1, 1, 1],
            }),
            instance.matrix,
          );
        for (const primitive of model.meshes[instance.mesh])
          for (let i = 0; i < primitive.positions.length; i += 3) {
            const point = T.vector(
              matrix,
              primitive.positions.subarray(i, i + 3),
            );
            for (let axis = 0; axis < 3; axis++) {
              lo[axis] = Math.min(lo[axis], point[axis]);
              hi[axis] = Math.max(hi[axis], point[axis]);
            }
          }
      }
      center = Number.isFinite(lo[0])
        ? lo.map(
            /* @function door-transition.centerAxis — Inputs: closed-part minimum and axis. Returns midpoint in engine Z-up assembly units. No mutation or per-frame geometry scan. */ (
              value,
              axis,
            ) => (value + hi[axis]) / 2,
          )
        : [0.45, 0, 1.1];
      time = 0;
      lastPhase = "";
      resourcesWarmed = false;
      canvas.hidden = false;
    }
    /* @function door-transition.cue — Inputs: phase key. Chooses one sound per boundary and sends it to bounded engine playback. Missing/none cues are silent; no audio objects allocated here. */
    function cue(key) {
      const choice = config[key],
        name = root.FrontierDoorAudio.select(key, choice);
      if (name) play(name, choice.gain);
    }
    /* @function door-transition.draw — Inputs: timeline state. Renders selected frame/leaves against black space with private local animation matrices. Returns nothing. Camera advances toward then through doorway; closing happens behind a black cover. */
    function draw(state) {
      /* October 10, 2026: the cutscene receives the same physical render density while its camera stays in logical coordinates. Resizing resets Canvas state, so restore the transform explicitly. */ const density =
        root.FrontierDisplay?.get().scale || 1;
      if (canvas.width !== 640 * density || canvas.height !== 480 * density) {
        canvas.width = 640 * density;
        canvas.height = 480 * density;
      }
      ctx.setTransform(density, 0, 0, density, 0, 0);
      ctx.imageSmoothingEnabled =
        root.FrontierDisplay?.get().filtering === "smooth";
      ctx.clearRect(0, 0, 640, 480);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 640, 480);
      ctx.doorGPU = true;
      ctx.terrainDepth = null;
      root.FrontierTerrainOcclusion.begin(ctx, 640, 480);
      if (["black", "close", "done"].includes(state.phase)) return;
      const parts = [
        ...(config.frame ? [{ ...config.frame, fraction: 0 }] : []),
      ];
      for (let i = 0; i < config.leaves.length; i++)
        parts.push({ ...config.leaves[i], fraction: state.fractions[i] });
      const entities = [];
      for (const part of parts) {
        const original = asset(part.modelId),
          instance = original.scene.instances.find(
            /* @function door-transition.meshInstance — Inputs: shared instance. Returns requested node match; no effects. */ (
              n,
            ) => n.node === part.node,
          ),
          T = root.FrontierModelTransform,
          pivot = part.pivot ?? [
            instance.matrix[12],
            instance.matrix[13],
            instance.matrix[14],
          ];
        let delta = T.identity();
        if (part.motion === "hinged") {
          delta = T.multiply(
            T.matrix({ position: pivot }),
            T.multiply(
              axisRotation(part.hingeAxis, part.angle * part.fraction),
              T.matrix({
                position: pivot.map(
                  /* @function door-transition.inversePivot — Inputs: pivot component. Returns negative local component; no effects. */ (
                    n,
                  ) => -n,
                ),
              }),
            ),
          );
        } else if (part.motion === "sliding") {
          delta = T.matrix({
            position: part.axis.map(
              /* @function door-transition.slideComponent — Inputs: local direction component. Returns scaled slide distance in world units; no effects. */ (
                n,
              ) => n * part.distance * part.fraction,
            ),
          });
        }
        const animated = {
          ...instance,
          matrix: T.multiply(
            T.matrix({
              position: part.position || [0, 0, 0],
              rotation: part.rotation || [0, 0, 0],
              scale: part.scale || [1, 1, 1],
            }),
            T.multiply(delta, instance.matrix),
          ),
        };
        entities.push({
          modelId: part.modelId,
          transitionSource: original,
          transitionAsset: {
            ...original,
            scene: { ...original.scene, instances: [animated] },
          },
          x: 0,
          y: 0,
          z: 0,
        });
      }
      const approach = state.phase === "approach" ? state.progress : 1,
        passage = state.phase === "passage" ? state.progress : 0,
        cam = {
          x: center[0],
          y:
            center[1] -
            (2.4 + config.approachDistance * (1 - approach)) * (1 - passage) +
            0.5 * passage,
          z: center[2],
          yaw: 0,
          pitch: 0,
          cx: 320,
          cy: 240,
        };
      root.FrontierModelRenderer.draw(
        ctx,
        { viewWidth: 640, sourceWorld: { fog: { enabled: false } } },
        cam,
        entities,
      );
      if (passage > 0.7) {
        ctx.fillStyle =
          "rgba(0,0,0," + Math.min(1, (passage - 0.7) / 0.3) + ")";
        ctx.fillRect(0, 0, 640, 480);
      }
    }
    /* @function door-transition.ready1523 — Inputs: none. Returns false while selected shared texture decoding is pending. Once ready, renders the closed door under the transition loading cover to initialize shaders/uploads before animation time advances. Throws explicit decode failure; owns no map commit. Repeated calls reuse warm resources. */
    function ready() {
      if (resourcesWarmed) return root.FrontierModelRenderer.previewReady(ctx);
      for (const part of [
        ...(config.frame ? [config.frame] : []),
        ...config.leaves,
      ]) {
        const prepared = root.FrontierModelRenderer.prepare(
          asset(part.modelId),
        );
        if (prepared.error)
          throw Error("Door texture preparation failed: " + prepared.error);
        if (!prepared.ready) return false;
      }
      draw(timeline(config, 0));
      resourcesWarmed = true;
      return root.FrontierModelRenderer.previewReady(ctx);
    }
    /* @function door-transition.update — Inputs: elapsed seconds. Advances presentation once, emits opening/closing cues at boundaries, returns true when complete. Rendering failures propagate; caller must end and fall back. */
    function update(dt) {
      if (!Number.isFinite(dt) || dt < 0)
        throw Error("Invalid door time step.");
      time += dt;
      const state = timeline(config, time);
      if (state.phase !== lastPhase) {
        if (state.phase === "open") {
          cue("open");
          cue("creak");
        }
        if (state.phase === "close") cue("close");
        lastPhase = state.phase;
      }
      draw(state);
      return state.phase === "done";
    }
    /* @function door-transition.end — Inputs: none. Stops preview frame scheduling, hides canvas and clears preview ownership; returns nothing. Does not commit any map. */
    function end() {
      cancelAnimationFrame(raf);
      canvas.hidden = true;
      previewing = false;
    }
    /* @function door-transition.preview — Inputs: configuration. Runs presentation without changing maps; returns nothing. Errors report and close; scheduling is canceled by end. */
    function preview(value) {
      end();
      begin(value);
      previewing = true;
      let last = performance.now();
      /* @function door-transition.previewFrame — Inputs: browser timestamp milliseconds. Advances bounded seconds; returns nothing. Stops on completion/failure, without changing gameplay. */ function frame(
        now,
      ) {
        if (!previewing) return;
        try {
          const done = update(Math.max(0, Math.min(0.05, (now - last) / 1000)));
          last = now;
          if (done) {
            end();
            return;
          }
          raf = requestAnimationFrame(frame);
        } catch (error) {
          report(error.message);
          end();
        }
      }
      raf = requestAnimationFrame(frame);
    }
    return { begin, update, end, preview, ready, canvas, report };
  }
  root.FrontierDoorTransition = {
    validate,
    timeline,
    duration,
    axisRotation,
    create,
  };
})(typeof window === "undefined" ? globalThis : window);
