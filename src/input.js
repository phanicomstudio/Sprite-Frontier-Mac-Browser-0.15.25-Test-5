/* MAINTAINER GUIDE
 * Pure input-state helpers: gamepad deadzones/edge detection and relative/absolute mouse deltas. Browser focus and pointer-lock ownership are coordinated by app.js. Reset baselines when switching modes to avoid camera snapping.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(/* @function input.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier input. */ function (root) {
'use strict'  ;
// Apply a radial deadzone and normalize controller magnitude so diagonal input stays bounded.
  /* @function input.stick.2 — Apply a radial deadzone and normalize controller magnitude so diagonal input stays bounded. Inputs: assignment pattern; assignment pattern; assignment pattern. Updates: x; y. Uses: number is finite. Returns: a record containing x, y; a record containing x, y. */ function stick(x = 0, y = 0, deadzone = .18) {
    x = Number.isFinite(x) ? x : 0;
    y = Number.isFinite(y) ? y : 0;
    const length = Math.hypot(x, y);
    if (length <= deadzone) return {
      x: 0, y: 0
    }
    ;
    const magnitude = Math.min(1, (length - deadzone) / (1 - deadzone));
    return {
      x: x / length * magnitude, y: y / length * magnitude
    }
    ;
  }
// Remember prior button states to emit one-shot actions while keeping continuous move/look/fire values.
  /* @function input.gamepadReader.3 — Remember prior button states to emit one-shot actions while keeping continuous move/look/fire values. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing poll. */ function gamepadReader() {
    let previous = new Set(), identity = null;
    return {
      /* @function input.poll.4 — Handles poll within keyboard, mouse and controller input. Inputs: pads; assignment pattern. Updates: identity; previous. Uses: array from using pads or a list of find; array from; previous clear; pad buttons map using a callback filter. Returns: a record containing connected, actions, move, look, sprint; a record containing connected, name, actions, move, look, fireHeld, sprint. */ poll(pads, enabled = true) {
        const pad = Array.from(pads || []).find(/* @function input.callback.5 — Returns chain and p mapping equals "standard". Inputs: p. Returns: chain and p mapping equals "standard". */ p => p?.connected && p.mapping === 'standard');
        if (!pad) {
          previous.clear();
          identity = null;
          return {
            connected: false, actions: [], move: {
              forward: 0, strafe: 0
            }
            , look: {
              x: 0, y: 0
            }
            , sprint: false
          }
          ;
        }
        const id = pad.index + ':' + pad.id;
        if (id !== identity) {
          previous.clear();
          identity = id;
        }
        const pressed = new Set(pad.buttons.map(/* @function input.callback.6 — Returns b pressed or b value is greater than 0.5 selects i or - 1. Inputs: b; i. Returns: b pressed or b value is greater than 0.5 selects i or - 1. */ (b, i) => b.pressed || b.value > .5 ? i : -1).filter(/* @function input.callback.7 — Returns i is at least 0. Inputs: i. Returns: i is at least 0. */ i => i >= 0));
        const bindings = {
          0: 'interact', 1:'jump', 2: 'reload', 3: 'holster', 4: 'camera', 7: 'fire', 9: 'pause'
        }
        ;
        const actions = enabled ? Array.from(pressed).filter(/* @function input.callback.8 — Returns the inverse of previous has using i and bindings at i. Inputs: i. Uses: previous has. Returns: the inverse of previous has using i and bindings at i. */ i => !previous.has(i) && bindings[i]).map(/* @function input.callback.9 — Returns bindings at i. Inputs: i. Returns: bindings at i. */ i => bindings[i]) : [];
        previous = pressed;
        const move = enabled ? stick(pad.axes[0], pad.axes[1]) : {
          x: 0, y: 0
        }
        , look = enabled ? stick(pad.axes[2], pad.axes[3]) : {
          x: 0, y: 0
        }
        ;
        return {
          connected: true, name: pad.id, actions, move: {
            forward: -move.y, strafe: move.x
          }
          , look, fireHeld:enabled&&pressed.has(7),sprint: enabled && pressed.has(10)
        }
        ;
      }
    }
    ;
  }
// Track a motion baseline for unlocked look and relative deltas for captured look. Reset on mode/focus changes.
  /* @function input.mouseLook.10 — Track a motion baseline for unlocked look and relative deltas for captured look. Reset on mode/focus changes. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing reset, motion. */ function mouseLook() {
    let previous = null;
    return {
      /* @function input.reset.11 — Handles reset within keyboard, mouse and controller input. Inputs: no explicit arguments; uses enclosing module state. Updates: previous. */ reset() {
        previous = null;
      }
      ,
      /* @function input.motion.12 — Handles motion within keyboard, mouse and controller input. Inputs: event; locked; enabled. Updates: previous. Returns: a record containing x, y; a record containing x, y. */ motion(event, locked, enabled) {
        if (!enabled) {
          previous = null;
          return {
            x: 0, y: 0
          }
          ;
        }
        if (locked) {
          previous = null;
          return {
            x: event.movementX || 0, y: event.movementY || 0
          }
          ;
        }
        const delta = previous ? {
          x: event.clientX - previous.x, y: event.clientY - previous.y
        }
        : {
          x: 0, y: 0
        }
        ;
        previous = {
          x: event.clientX, y: event.clientY
        }
        ;
        return delta;
      }
    }
    ;
  }
  root.FrontierInput = {
    stick, gamepadReader, mouseLook
  }
  ;
}
)(typeof window === 'undefined' ? globalThis : window);

