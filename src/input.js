/* MAINTAINER GUIDE
 * Pure input-state helpers: gamepad deadzones/edge detection and relative/absolute mouse deltas. Browser focus and pointer-lock ownership are coordinated by app.js. Reset baselines when switching modes to avoid camera snapping.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
(function (root) {
'use strict'  ;
// Apply a radial deadzone and normalize controller magnitude so diagonal input stays bounded.
  function stick(x = 0, y = 0, deadzone = .18) {
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
  function gamepadReader() {
    let previous = new Set(), identity = null;
    return {
      poll(pads, enabled = true) {
        const pad = Array.from(pads || []).find(p => p?.connected && p.mapping === 'standard');
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
        const pressed = new Set(pad.buttons.map((b, i) => b.pressed || b.value > .5 ? i : -1).filter(i => i >= 0));
        const bindings = {
          0: 'interact', 1:'jump', 2: 'reload', 3: 'holster', 4: 'camera', 7: 'fire', 9: 'pause'
        }
        ;
        const actions = enabled ? Array.from(pressed).filter(i => !previous.has(i) && bindings[i]).map(i => bindings[i]) : [];
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
  function mouseLook() {
    let previous = null;
    return {
      reset() {
        previous = null;
      }
      ,
      motion(event, locked, enabled) {
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
