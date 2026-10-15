/* MAINTAINER GUIDE
 * Pure input-state helpers: gamepad deadzones/edge detection and relative/absolute mouse deltas. Browser focus and pointer-lock ownership are coordinated by app.js. Reset baselines when switching modes to avoid camera snapping.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function input.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier input. */
(/* @function input.installReviewed — Installs pure input-state helpers for deadzones, gamepad edges and pointer deltas. App coordination owns focus/pointer lock; mode switches reset baselines to avoid camera jumps. Inputs: browser/global namespace root. Returns nothing; publishes API and initializes private tables/cache ownership. Dependency/registration errors propagate. Calls to exported operations own later simulation, rendering or authoring work. */ function (
  root,
) {
  "use strict";
  // Apply a radial deadzone and normalize controller magnitude so diagonal input stays bounded.
  /* Historical contract retained; October 14 reviewed explanation follows. @function input.stick.2 — Apply a radial deadzone and normalize controller magnitude so diagonal input stays bounded. Inputs: assignment pattern; assignment pattern; assignment pattern. Updates: x; y. Uses: number is finite. Returns: a record containing x, y; a record containing x, y. */
  /* @function input.reviewedstick_2 — Applies radial controller deadzone with bounded magnitude. Inputs: x/y axis values(default0) and deadzone(default0.18), expected0<=deadzone<1. Returns normalized x/y record with magnitude0 inside deadzone, otherwise remapped0-1 preserving angle. Nonfinite axes become0; deadzone itself is not validated here. No input/device mutation. */ function stick(
    x = 0,
    y = 0,
    deadzone = 0.18,
  ) {
    x = Number.isFinite(x) ? x : 0;
    y = Number.isFinite(y) ? y : 0;
    const length = Math.hypot(x, y);
    if (length <= deadzone)
      return {
        x: 0,
        y: 0,
      };
    const magnitude = Math.min(1, (length - deadzone) / (1 - deadzone));
    return {
      x: (x / length) * magnitude,
      y: (y / length) * magnitude,
    };
  }
  // Remember prior button states to emit one-shot actions while keeping continuous move/look/fire values.
  /* Historical contract retained; October 14 reviewed explanation follows. @function input.gamepadReader.3 — Remember prior button states to emit one-shot actions while keeping continuous move/look/fire values. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing poll. */
  /* @function input.reviewedgamepadReader_3 — Creates independent controller edge-detection reader. Inputs: none. Returns poll API retaining previous button Set and controller identity. No browser polling/listeners are installed automatically; app owns device enumeration and enable policy. */ function gamepadReader() {
    let previous = new Set(),
      identity = null;
    return {
      /* Historical contract retained; October 14 reviewed explanation follows. @function input.poll.4 — Handles poll within keyboard, mouse and controller input. Inputs: pads; assignment pattern. Updates: identity; previous. Uses: array from using pads or a list of find; array from; previous clear; pad buttons map using a callback filter. Returns: a record containing connected, actions, move, look, sprint; a record containing connected, name, actions, move, look, fireHeld, sprint. */
  /* @function input.reviewedpoll_4 — Samples first connected standard-mapped controller. Inputs: pads iterable and enabled flag(defaulttrue). Returns connection/name, one-shot actions, deadzoned move/look and held fire/sprint; disconnected result omits name/fireHeld and returns zero actions/axes. Updates private identity/button baseline even when disabled, preventing held input firing a fresh edge on resume. Controller swap clears baseline; physical device is not changed. Axes dimensionless, app converts look to radians/time. Malformed pad records may throw; no input-lock ownership. */ poll(
        pads,
        enabled = true,
      ) {
        const pad = Array.from(pads || []).find(
          /* Historical contract retained; October 14 reviewed explanation follows. @function input.callback.5 — Returns chain and p mapping equals "standard". Inputs: p. Returns: chain and p mapping equals "standard". */
  /* @function input.reviewedcallback_5 — Selects supported controller candidate. Inputs: nullable pad p. Returns true only connected and mapping standard. No mutation; unsupported mappings ignored. */ (
            p,
          ) => p?.connected && p.mapping === "standard",
        );
        if (!pad) {
          previous.clear();
          identity = null;
          return {
            connected: false,
            actions: [],
            move: {
              forward: 0,
              strafe: 0,
            },
            look: {
              x: 0,
              y: 0,
            },
            sprint: false,
          };
        }
        const id = pad.index + ":" + pad.id;
        if (id !== identity) {
          previous.clear();
          identity = id;
        }
        const pressed = new Set(
          pad.buttons
            .map(
              /* Historical contract retained; October 14 reviewed explanation follows. @function input.callback.6 — Returns b pressed or b value is greater than 0.5 selects i or - 1. Inputs: b; i. Returns: b pressed or b value is greater than 0.5 selects i or - 1. */
  /* @function input.reviewedcallback_6 — Recognizes a pressed controller button. Inputs: button b/index i. Returns index for pressed flag or analog value>0.5, otherwise-1. No mutation; expects valid GamepadButton records. */ (
                b,
                i,
              ) => (b.pressed || b.value > 0.5 ? i : -1),
            )
            .filter(
              /* Historical contract retained; October 14 reviewed explanation follows. @function input.callback.7 — Returns i is at least 0. Inputs: i. Returns: i is at least 0. */
  /* @function input.reviewedcallback_7 — Removes unpressed button sentinel. Inputs: index i. Returns i>=0; no mutation. */ (
                i,
              ) => i >= 0,
            ),
        );
        const bindings = {
          0: "interact",
          1: "jump",
          2: "reload",
          3: "holster",
          4: "camera",
          7: "fire",
          9: "pause",
        };
        const actions = enabled
          ? Array.from(pressed)
              .filter(
                /* Historical contract retained; October 14 reviewed explanation follows. @function input.callback.8 — Returns the inverse of previous has using i and bindings at i. Inputs: i. Uses: previous has. Returns: the inverse of previous has using i and bindings at i. */
  /* @function input.reviewedcallback_8 — Selects a newly pressed bound button. Inputs: index i with captured previous Set/bindings. Returns truthy action name only absent previously and bound. No mutation; continuous holds excluded. */ (
                  i,
                ) => !previous.has(i) && bindings[i],
              )
              .map(
                /* Historical contract retained; October 14 reviewed explanation follows. @function input.callback.9 — Returns bindings at i. Inputs: i. Returns: bindings at i. */
  /* @function input.reviewedcallback_9 — Converts controller index to action name. Inputs: i. Returns captured binding string; previous filter ensures known action. No mutation. */ (
                  i,
                ) => bindings[i],
              )
          : [];
        previous = pressed;
        const move = enabled
            ? stick(pad.axes[0], pad.axes[1])
            : {
                x: 0,
                y: 0,
              },
          look = enabled
            ? stick(pad.axes[2], pad.axes[3])
            : {
                x: 0,
                y: 0,
              };
        return {
          connected: true,
          name: pad.id,
          actions,
          move: {
            forward: -move.y,
            strafe: move.x,
          },
          look,
          fireHeld: enabled && pressed.has(7),
          sprint: enabled && pressed.has(10),
        };
      },
    };
  }
  // Track a motion baseline for unlocked look and relative deltas for captured look. Reset on mode/focus changes.
  /* Historical contract retained; October 14 reviewed explanation follows. @function input.mouseLook.10 — Track a motion baseline for unlocked look and relative deltas for captured look. Reset on mode/focus changes. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing reset, motion. */
  /* @function input.reviewedmouseLook_10 — Creates independent mouse-motion baseline tracker. Inputs: none. Returns reset/motion API with no DOM listeners or pointer-lock calls. App owns focus/mode changes and must reset tracker to avoid camera jumps. */ function mouseLook() {
    let previous = null;
    return {
      /* Historical contract retained; October 14 reviewed explanation follows. @function input.reset.11 — Handles reset within keyboard, mouse and controller input. Inputs: no explicit arguments; uses enclosing module state. Updates: previous. */
  /* @function input.reviewedreset_11 — Clears unlocked mouse baseline. Inputs: none. Returns undefined; sets private previous null so next unlocked motion yields zero. No camera/DOM/device mutation. */ reset() {
        previous = null;
      },
      /* Historical contract retained; October 14 reviewed explanation follows. @function input.motion.12 — Handles motion within keyboard, mouse and controller input. Inputs: event; locked; enabled. Updates: previous. Returns: a record containing x, y; a record containing x, y. */
  /* @function input.reviewedmotion_12 — Produces relative look delta from mouse event. Inputs: event, locked and enabled booleans. Returns x/y pixels: zero and resets baseline when disabled; captured movementX/Y when locked; unlocked client-coordinate difference after first zero-baseline sample. Updates private baseline only, does not rotate camera or request capture. Expects valid DOM mouse coordinates; absent relative values default0, no finite validation here. */ motion(
        event,
        locked,
        enabled,
      ) {
        if (!enabled) {
          previous = null;
          return {
            x: 0,
            y: 0,
          };
        }
        if (locked) {
          previous = null;
          return {
            x: event.movementX || 0,
            y: event.movementY || 0,
          };
        }
        const delta = previous
          ? {
              x: event.clientX - previous.x,
              y: event.clientY - previous.y,
            }
          : {
              x: 0,
              y: 0,
            };
        previous = {
          x: event.clientX,
          y: event.clientY,
        };
        return delta;
      },
    };
  }
  root.FrontierInput = {
    stick,
    gamepadReader,
    mouseLook,
  };
})(typeof window === "undefined" ? globalThis : window);
