/* Point-and-click cursor preferences. Original PNG pixels are displayed without
 * resizing; (0,0) stays anchored to the pointer for both pointing and held states.
 * Preload the six tiny assets once, never fetch on pointer movement. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function cursor.callback.1 — Provides the callback for a callback. Inputs: root. Updates: image id; image alt; image hidden; select value; cross checked. Uses: document get element by id; document create element; document get element by id using "viewport" append; pairs set. */
(/* @function cursor.installReviewed — Installs selected-hand cursor preferences and shared pointing/held image ownership. Original PNG size and pointer-origin anchor are preserved; asset preloading occurs once rather than on pointer movement. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  const frame = document.getElementById("gameFrame"),
    select = document.getElementById("cursorHand"),
    cross = document.getElementById("armedCrosshair"),
    reticle = document.getElementById("crosshair");
  const image = document.createElement("img");
  image.id = "handCursor";
  image.alt = "";
  image.hidden = true; // Fullscreen only paints descendants of its selected element. Keep the
  // overlay inside the viewport, outside the transformed game-frame layer.
  document.getElementById("viewport").append(image);
  const pairs = new Map();
  for (const set of ["Ang", "Fem", "Glove"])
    pairs.set(
      set,
      ["A", "B"].map(
        /* Historical contract retained; October 14 reviewed explanation follows. @function cursor.callback.2 — Provides the callback for a list of "A", "B" map. Inputs: state. Updates: img src. Uses: encode uricomponent. Returns: img. */
  /* @function cursor.reviewedcallback_2 — Preloads one original-size hand PNG. Inputs: pointing/held suffix state A/B and captured set Ang/Fem/Glove. Returns Image with encoded catalog path; asynchronous loading starts once during module setup. No pointer-time fetch; decode failure leaves image unavailable without throwing synchronously. */ (
          state,
        ) => {
          const img = new Image();
          img.src =
            "img/cursors/point-and-click/" +
            encodeURIComponent(set + " Hand " + state + ".png");
          return img;
        },
      ),
    );
  try {
    select.value = pairs.has(
      localStorage.getItem("frontier.cursorHand.0.15.22"),
    )
      ? localStorage.getItem("frontier.cursorHand.0.15.22")
      : "Ang";
    cross.checked =
      localStorage.getItem("frontier.armedCrosshair.0.15.22") !== "false";
  } catch {}
  let enabled = false,
    inside = false,
    buttons = 0;
  /* @function cursor.dialogHost1521 — Inputs: none. Returns nothing. Moves the one preloaded hand into the last open native dialog, or back into the viewport after closing. Native modal dialogs occupy the browser top layer, above every ordinary z-index; hosting the pointer within that layer keeps it visible without intercepting clicks. Fixed positioning uses client pixels. Reparenting happens only on host changes, supports nested dialogs and fullscreen, and leaves asset loading unchanged. */
  function dialogHost() {
    const dialogs = document.querySelectorAll("dialog[open]"),
      host = dialogs.length
        ? dialogs[dialogs.length - 1]
        : document.getElementById("viewport");
    if (image.parentElement !== host) host.append(image);
  }

  /* Historical contract retained; October 14 reviewed explanation follows. @function cursor.refresh.3 — Handles refresh within cursor. Inputs: no explicit arguments; uses enclosing module state. Updates: image src; image hidden. Uses: pairs get; frame class list toggle. */
  /* @function cursor.reviewedrefresh_3 — Synchronizes hand artwork, modal host and cursor CSS state. Inputs: none; captures enabled/inside/buttons/select. Returns undefined; moves overlay to topmost open dialog, sets pointing/held image URL, hides outside eligible region and toggles body/frame cursor classes. Does not acquire/release pointer lock; owner input controller does that. Invalid selection or missing DOM throws; valid catalog is assumed. */ function refresh() {
    dialogHost();
    image.src = pairs.get(select.value)[buttons ? 1 : 0].src;
    image.hidden = !enabled || !inside;
    document.body.classList.toggle(
      "menuHandCursorActive",
      enabled &&
        !!document.querySelector(
          "dialog[open],#pauseControls:not([hidden]),[role=dialog]:not([hidden])",
        ),
    );
    frame.classList.toggle("handCursorActive", enabled);
  }
  select.onchange =
    /* Historical contract retained; October 14 reviewed explanation follows. @function cursor.onchange.4 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: local storage set item; refresh. */
  /* @function cursor.reviewedonchange_4 — Persists selected hand and updates overlay. Inputs: unused selector change event. Returns undefined; tries localStorage preference (denial ignored) then refreshes. Does not edit map/project data; refresh errors propagate. */ () => {
      try {
        localStorage.setItem("frontier.cursorHand.0.15.22", select.value);
      } catch {}
      refresh();
    };
  cross.onchange =
    /* Historical contract retained; October 14 reviewed explanation follows. @function cursor.onchange.5 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: local storage set item; string. */
  /* @function cursor.reviewedonchange_5 — Persists armed crosshair preference. Inputs: unused checkbox change event. Returns undefined; stores boolean string in localStorage, ignores storage denial. Actual reticle visibility updates in update; no immediate renderer mutation. */ () => {
      try {
        localStorage.setItem(
          "frontier.armedCrosshair.0.15.22",
          String(cross.checked),
        );
      } catch {}
    };
  // October 9: menu dialogs can live outside the game frame; follow their pointer too.
  document.addEventListener(
    "pointermove",
    /* @function cursor.menuMove — Inputs: pointer event in client pixels. Moves preloaded hand over open menu/dialog controls; toggles visibility on entry/exit, no asset loads. */ (
      e,
    ) => {
      const target = e.target.closest?.(
        "#gameFrame,dialog[open],[role=dialog]:not([hidden])",
      );
      const next = !!target;
      if (next !== inside) {
        inside = next;
        refresh();
      }
      image.style.left = e.clientX + "px";
      image.style.top = e.clientY + "px";
    },
  );
  frame.addEventListener(
    "pointermove",
    /* Historical contract retained; October 14 reviewed explanation follows. @function cursor.callback.6 — Provides the callback for frame add event listener. Inputs: e. Updates: inside; image style left; image style top. */
  /* @function cursor.reviewedcallback_6 — Tracks pointer within gameplay frame. Inputs: pointer e.clientX/clientY CSS viewport pixels. Returns undefined; sets inside and fixed-position overlay coordinates. No asset load or lock change; document listener/entry handles visibility refresh. */ (
      e,
    ) => {
      inside = true;
      image.style.left = e.clientX + "px";
      image.style.top = e.clientY + "px";
    },
  );
  frame.addEventListener(
    "pointerenter",
    /* Historical contract retained; October 14 reviewed explanation follows. @function cursor.callback.7 — Provides the callback for frame add event listener. Inputs: e. Updates: inside; image style left; image style top. Uses: refresh. */
  /* @function cursor.reviewedcallback_7 — Shows eligible cursor after entering gameplay frame. Inputs: pointer event CSS client pixels. Returns undefined; sets inside/position then refreshes. Eligibility still owner-controlled; DOM errors propagate. */ (
      e,
    ) => {
      inside = true;
      image.style.left = e.clientX + "px";
      image.style.top = e.clientY + "px";
      refresh();
    },
  );
  frame.addEventListener(
    "pointerleave",
    /* Historical contract retained; October 14 reviewed explanation follows. @function cursor.callback.8 — Provides the callback for frame add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: inside. Uses: refresh. */
  /* @function cursor.reviewedcallback_8 — Hides frame cursor on pointer leave. Inputs: unused leave event. Returns undefined; sets inside false and refreshes; document menu listener may subsequently re-enable region visibility. Does not release capture. */ () => {
      inside = false;
      refresh();
    },
  );
  document.addEventListener(
    "pointerdown",
    /* Historical contract retained; October 14 reviewed explanation follows. @function cursor.callback.9 — Provides the callback for document add event listener. Inputs: e. Updates: buttons. Uses: refresh. */
  /* @function cursor.reviewedcallback_9 — Shows held hand state on any document pointer press. Inputs: e.buttons bitmask. Returns undefined; stores current buttons and refreshes; capture-phase listener does not prevent event or intercept click. */ (
      e,
    ) => {
      buttons = e.buttons;
      refresh();
    },
    true,
  );
  document.addEventListener(
    "pointerup",
    /* Historical contract retained; October 14 reviewed explanation follows. @function cursor.callback.10 — Provides the callback for document add event listener. Inputs: e. Updates: buttons. Uses: refresh. */
  /* @function cursor.reviewedcallback_10 — Updates pointing/held state on document release. Inputs: e.buttons bitmask. Returns undefined; stores remaining buttons then refreshes. No click interception or gameplay input action. */ (
      e,
    ) => {
      buttons = e.buttons;
      refresh();
    },
    true,
  );
  /* Historical contract retained; October 14 reviewed explanation follows. @function cursor.reset.11 — Handles reset within cursor. Inputs: no explicit arguments; uses enclosing module state. Updates: buttons. Uses: refresh. */
  /* @function cursor.reviewedreset_11 — Clears stale held-hand state on cancellation/blur. Inputs: ignored event when registered as listener. Returns undefined; sets buttons zero then refreshes. Does not change eligibility/selected preference or pointer lock. */ function reset() {
    buttons = 0;
    refresh();
  }
  document.addEventListener(
    "fullscreenchange",
    /* Historical contract retained; October 14 reviewed explanation follows. @function cursor.callback.12 — Provides the callback for document add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: inside. Uses: frame matches; refresh. */
  /* @function cursor.reviewedcallback_12 — Rechecks cursor region after fullscreen state change. Inputs: ignored fullscreenchange event. Returns undefined; sets inside from frame hover and refreshes modal host/visibility. Does not request or exit fullscreen itself. */ () => {
      inside = frame.matches(":hover");
      refresh();
    },
  );
  document.addEventListener("pointercancel", reset);
  window.addEventListener("blur", reset);
  root.FrontierCursor = {
    /* Historical contract retained; October 14 reviewed explanation follows. @function cursor.update.13 — Advances this system using the current state and elapsed time. Inputs: point mode; unarmed; editing; assignment pattern. Updates: enabled; buttons; reticle hidden. Uses: frame class list toggle; refresh. */
  /* @function cursor.reviewedupdate_13 — Applies owner-provided gameplay/menu/cutscene cursor policy. Inputs: pointMode, unarmed, editing, menuOpen and cutscene booleans. Returns undefined; hides hand during cutscene, enables for point-mode gameplay/menus/open native dialogs, resets held state when eligibility changes and refreshes host every call. Armed reticle hidden for cutscene/unarmed/disabled preference/point mode/editing. Toggles cursor CSS but pointer-lock acquisition/release is input-owner responsibility; no preference writes or map changes. Assumes installed controls, DOM errors propagate. */ update(
      pointMode,
      unarmed,
      editing,
      menuOpen = false,
      cutscene = false,
    ) {
      frame.classList.toggle("gameCursorActive", !editing && !menuOpen);
      const next =
        !cutscene &&
        ((pointMode && !editing) ||
          menuOpen ||
          !!document.querySelector("dialog[open]"));
      if (enabled !== next) {
        enabled = next;
        buttons = 0;
      }
      /* October 10, 2026: refresh dialog hosting even when cursor eligibility stays true between nested menus. */ refresh();
      reticle.hidden =
        cutscene || unarmed || !cross.checked || pointMode || editing;
    },
  };
})(window);
