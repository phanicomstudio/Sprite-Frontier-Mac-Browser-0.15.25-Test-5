/* October 10, 2026: radial squeeze/pull derived from the supplied behavior
 * reference. Configuration is JSON data; phase and fade strength are runtime.
 * A tapered screen edge remains stationary, preventing exposed empty borders. */
(/* @function screen-breathing.install — Inputs: engine namespace. Publishes pure validation, radial mapping and runtime factory. No DOM, GPU resources or timers are created. */ function (
  root,
) {
  "use strict";
  /* @function screen-breathing.validate — Inputs: optional settings. Returns copied enabled/intensity/frequency/radius/fade settings. Seconds and Hz replace reference frame-based timing. Throws malformed or out-of-range numeric values without mutation. */
  function validate(value = {}) {
    const result = {
      enabled: value.enabled === true,
      amplitude: value.amplitude ?? 0.01,
      frequency: value.frequency ?? 0.3,
      radius: value.radius ?? 1,
      fadeIn: value.fadeIn ?? 0.5,
      fadeOut: value.fadeOut ?? 0.5,
    };
    for (const [name, min, max] of [
      ["amplitude", 0, 0.05],
      ["frequency", 0.01, 2],
      ["radius", 0.1, 2],
      ["fadeIn", 0, 10],
      ["fadeOut", 0, 10],
    ])
      if (
        !Number.isFinite(result[name]) ||
        result[name] < min ||
        result[name] > max
      )
        throw Error(
          "Breathing " + name + " must be between " + min + " and " + max,
        );
    return result;
  }
  /* @function screen-breathing.smooth — Inputs: scalar. Returns cubic smoothstep clamped to 0–1; no state changes. Shared by the CPU pointer mapping and shader contract. */
  function smooth(value) {
    const x = Math.max(0, Math.min(1, value));
    return x * x * (3 - 2 * x);
  }
  /* @function screen-breathing.sample — Inputs: normalized displayed UV, aspect ratio, runtime snapshot and optional reusable result record. Returns underlying scene UV for that displayed pixel. Stationary outer edges prevent missing borders; amplitude stays within five percent. Used for inverse pointer targeting and mirrors the shader formula. */
  function sample(x, y, aspect, state, result = {}) {
    const distance = Math.hypot((x - 0.5) * aspect, y - 0.5),
      radial = 1 - smooth(distance / state.radius),
      edge = smooth(Math.min(x, y, 1 - x, 1 - y) / 0.08),
      scale =
        1 +
        state.amplitude *
          Math.sin(state.phase) *
          state.strength *
          radial *
          edge;
    result.x = 0.5 + (x - 0.5) / scale;
    result.y = 0.5 + (y - 0.5) / scale;
    return result;
  }
  /* @function screen-breathing.project — Inputs: normalized scene UV, aspect and runtime snapshot. Returns displayed UV by bounded fixed-point inversion of sample. Twelve iterations suffice for the limited five-percent warp; no unbounded solver or scene mutation. */
  function project(x, y, aspect, state) {
    let u = x,
      v = y;
    for (let i = 0; i < 12; i++) {
      const mapped = sample(u, v, aspect, state);
      u += x - mapped.x;
      v += y - mapped.y;
    }
    return { x: u, y: v };
  }
  /* @function screen-breathing.create — Inputs: initial map settings. Returns independent runtime controller. Configure starts a fade from current strength, update advances phase/fade by seconds, snapshot exposes transient values, and clear restores exact identity. Nothing is serialized automatically. */
  function create(value = {}) {
    let config = validate(value),
      phase = 0,
      strength = 0,
      from = 0,
      target = config.enabled ? 1 : 0,
      elapsed = 0,
      duration = config.fadeIn;
    return {
      /* @function screen-breathing.configure — Inputs: replacement settings. Validates and begins fade from current strength, including changes during a previous fade. Returns nothing. Phase continuity avoids visible jumps when adjusting frequency. */
      configure(value) {
        config = validate(value);
        from = strength;
        target = config.enabled ? 1 : 0;
        elapsed = 0;
        duration = target ? config.fadeIn : config.fadeOut;
        if (!duration) strength = target;
      },
      /* @function screen-breathing.update — Inputs: finite nonnegative seconds, frozen flag and optional reusable snapshot record. Advances phase and smooth fade only when unfrozen. Throws invalid time; exact fade endpoint avoids residual warp after disabling. Returns runtime snapshot. */
      update(dt, frozen = false, result) {
        if (!Number.isFinite(dt) || dt < 0)
          throw Error("Breathing delta must be nonnegative seconds");
        if (!frozen) {
          phase = (phase + dt * config.frequency * Math.PI * 2) % (Math.PI * 2);
          elapsed += dt;
          strength =
            duration && elapsed < duration
              ? from + (target - from) * smooth(elapsed / duration)
              : target;
        }
        return this.snapshot(result);
      },
      /* @function screen-breathing.snapshot — Inputs: optional reusable result record. Returns effective shader/mapping parameters plus phase and strength. No source-map mutation; caller may inspect diagnostics safely. */
      snapshot(result = {}) {
        Object.assign(result, config);
        result.phase = phase;
        result.strength = strength;
        return result;
      },
      /* @function screen-breathing.clear — Inputs: none. Restores exact disabled identity and zero phase immediately, for disposed previews/cell resets. Returns nothing. */
      clear() {
        strength = from = target = phase = elapsed = 0;
      },
    };
  }
  let gameProvider = null,
    optionsController = null;
  /* @function screen-breathing.controller � Inputs: game object. Returns game-local transient controller, refreshing map defaults when the source cell/settings object changes. Runtime overrides never modify the authored map. */
  function controller(game) {
    /* October 12, 2026: Options is a session-wide user choice, not a cell default. Reuse its controller across replacement game objects so phase, fades and enabled state survive door transfers. Without an Options choice, historical cell-default ownership remains unchanged. Native event commands still configure the effective controller explicitly. */ if (
      optionsController
    ) {
      game.breathingController = optionsController;
      return optionsController;
    }
    const config = game.sourceWorld?.nativeEffects?.breathing;
    if (!game.breathingController || game.breathingMap !== game.sourceWorld) {
      game.breathingController = create(config);
      game.breathingMap = game.sourceWorld;
      game.breathingDefaults = config;
    } else if (game.breathingDefaults !== config) {
      game.breathingController.configure(config);
      game.breathingDefaults = config;
    }
    return game.breathingController;
  }
  root.FrontierBreathing = {
    validate,
    sample,
    project,
    create,
    controller,
    /* @function screen-breathing.setOptions1523 — Inputs: active game and user Options configuration. Validates first, then adopts its current controller as session-wide and configures it without resetting phase. Returns effective snapshot. Persists across cell changes/new game runtime objects for this application session; never edits authored map defaults. Native event commands may explicitly change effective runtime state. */
    setOptions(game, value) {
      const checked = validate(value);
      optionsController = controller(game);
      optionsController.configure(checked);
      return optionsController.snapshot();
    },
    /* @function screen-breathing.bind � Inputs: game getter callback. Stores the application runtime boundary for event commands. No calls or mutation until command execution. */
    bind(provider) {
      gameProvider = provider;
    },
    /* @function screen-breathing.set � Inputs: game and validated settings. Applies a temporary override to that playtest controller; does not serialize into map defaults. Returns effective snapshot. */
    set(game, value) {
      const current = controller(game);
      current.configure(value);
      return current.snapshot();
    },
    /* @function screen-breathing.tick � Inputs: game, seconds, frozen flag. Advances only the owning playtest and publishes shader/targeting snapshot. Returns snapshot; source map stays untouched. */
    tick(game, dt, frozen) {
      return (game.breathingSnapshot = controller(game).update(
        dt,
        frozen,
        game.breathingSnapshot,
      ));
    },
  };
  if (root.FrontierEventRuntime)
    root.FrontierEventRuntime.register("screenBreathing", {
      validate,
      /* @function screen-breathing.event � Inputs: normalized breathing command. Applies temporary settings to the bound playtest. Throws when engine service is unavailable; does not block event continuation. */
      execute(command) {
        const game = gameProvider?.();
        if (!game) throw Error("Breathing runtime is unavailable");
        root.FrontierBreathing.set(game, command);
      },
    });
})(typeof window === "undefined" ? globalThis : window);
