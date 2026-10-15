/* MAINTAINER GUIDE
 * Application coordinator: creates playtests, routes input, drives simulation and binds editor/HUD controls. Change gameplay rules in their modules; keep this file responsible for orchestration. Authored world and runtime game are separate objects: editor mutations restart a temporary playtest.
 * See docs/CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function app.callback.1 — Provides the callback for a callback. Inputs: no explicit arguments; uses enclosing module state. Updates: audio music; pause panel id; pause panel hidden; pause panel inner html; $ using "pauseResume" onclick. Uses: $; mf create frontier audio; frontier music create; document create element. */
/* October 15, 2026 (0.15.27): starts through FrontierAssets.whenReady, after the
 * startup assets (door models) have loaded; see src/asset-source.js. Callbacks run
 * in script order, so app.js still runs before the workspace, scene list and
 * campaign shell. */
FrontierAssets.whenReady(/* @function app.bootstrapReviewed — Boots the single application coordinator. Inputs: none; requires the installed DOM, MF/native modules and fixed script load order. Returns nothing. Creates reusable audio/HUD/editor/runtime services, binds input/menu controls, starts the initial playtest and one animation-frame loop, then loads validated saved editor data. Runtime-only exports start at their authored active cell and avoid editor storage. Synchronous dependency/DOM errors propagate; owned asynchronous loaders report their own failures. Authored world and temporary game stay separate. */ function () {
  "use strict";
  const elements = new Map(),
    $ =
      /* @function app.$.2 — Handles $ within application input, simulation and editor coordination. Inputs: id. Uses: elements has; elements set; document get element by id; elements get. Returns: elements get using id. */ (
        id,
      ) => {
        if (!elements.has(id)) elements.set(id, document.getElementById(id));
        return elements.get(id);
      },
    view = $("view"),
    keys = new Set(),
    audio = MF.createFrontierAudio(),
    music = FrontierMusic.create();
  audio.music = music;
  // October 12: retain the gameplay cursor preference node before runtime chrome
  // is removed; pause options dispatch its existing cursor-service listener.
  const handPreference = $("cursorHand");
  let world,
    game,
    session,
    footsteps,
    editor,
    editing = false,
    history = [],
    serial = 0,
    last = 0,
    drag = null,
    mousePaused = false,
    captureAttempted = false,
    playPaused = false,
    hudMode = false;
  // Pause controls stay outside the canvas so they remain readable and usable
  // even when geometry hides the player. Escape and controller Start pause.
  const pausePanel = document.createElement("section");
  pausePanel.id = "pauseControls";
  pausePanel.hidden = true;
  pausePanel.setAttribute("aria-label", "Pause controls");
  Object.assign(pausePanel.style, {
    position: "absolute",
    top: "22%",
    left: "25%",
    width: "50%",
    padding: "24px",
    background: "#151b25",
    border: "2px solid #9abce4",
    zIndex: "110",
    font: "20px Arial",
  });
  // October 9, 2026: supplied mechanical panel remains an unmodified background; controls use readable native text.
  pausePanel.style.cssText +=
    ';top:3%;left:20%;width:60%;height:90%;padding:0;border:0;background:transparent';
  // October 15, 2026 (0.15.28): the pause art comes from the interface skin
  // (#pauseArtwork, --skin-pause-image); this panel itself has no background.
  pausePanel.innerHTML =
    '<div id="pauseArtwork"><div id="pauseActions"><div id="pauseMain" style="display:grid;gap:8px"><button id="pauseResume">Resume</button><button id="pauseSave">Save</button><button id="pauseLoad">Load</button><button id="pauseOptions">Options</button></div><div id="pauseSettings" hidden style="position:absolute;left:-15%;bottom:0;width:130%;background:#151b25f5;padding:16px;font:20px Arial"><label>Master Volume <output id="pauseVolumeValue">70%</output><input id="pauseVolume" type="range" min="0" max="1" step="0.01" value="0.7" style="width:100%"></label><label>Hand cursor<select id="pauseHand"><option value="Ang">Ang hand</option><option value="Fem">Fem hand</option><option value="Glove">Glove hand</option></select></label><button id="getUnstuck">Get Unstuck</button><button id="pauseExitFullscreen">Exit Fullscreen</button><button id="pauseBack">Back</button><p id="recoveryStatus" role="status"></p></div></div></div>';
  $("gameFrame").append(pausePanel);
  /* October 10, 2026: quality preferences belong to the local display, not map data. Labels report physical output dimensions; logical camera framing remains independent. */
  $("pauseSettings").insertAdjacentHTML(
    "afterbegin",
    '<label>Rendering resolution<select id="renderScale"><option value="1">Performance — 1×</option><option value="1.5">Sharper — 1.5×</option><option value="2">High — 2×</option></select><output id="renderDimensions"></output></label><label>Texture filtering<select id="renderFiltering"><option value="crisp">Crisp</option><option value="smooth">Smooth</option></select></label>',
  );
  // October 15, 2026: game text font choice. The same preference is offered in
  // the editor's Project and view settings; both selects stay in step.
  $("pauseSettings").insertAdjacentHTML(
    "afterbegin",
    '<label>Text font<select id="pauseFont"></select></label>',
  );
  FrontierTypography.bind($("pauseFont"));
  // October 15, 2026 (0.15.28): interface skin. "Campaign default" follows the
  // campaign's choice (editor: Campaign interface); Minimal uses no images.
  $("pauseSettings").insertAdjacentHTML(
    "afterbegin",
    '<label>Interface<select id="pauseSkin"></select></label>',
  );
  FrontierSkins.bind($("pauseSkin"));
  if (!window.FRONTIER_RUNTIME_ONLY) {
    const editorFont = document.createElement("label");
    editorFont.textContent = "Game text font";
    const editorFontSelect = document.createElement("select");
    editorFontSelect.id = "editorGameFont";
    editorFont.append(FrontierTypography.bind(editorFontSelect));
    document.querySelector("header .tools")?.append(editorFont);
  }
  /* @function app.displayControls1522 — Inputs: none. Synchronizes local resolution/filter controls and physical dimension label. No simulation changes; called after initialization and quality/aspect changes. */
  function displayControls() {
    const display = FrontierDisplay.get();
    $("renderScale").value = String(display.scale);
    $("renderFiltering").value = display.filtering;
    $("renderDimensions").textContent =
      display.pixelWidth + " × " + display.pixelHeight + " pixels";
    view.style.imageRendering =
      display.filtering === "smooth" ? "auto" : "pixelated";
  }
  /* @function app.applyDisplay1522 — Inputs: change event ignored. Validates current dropdowns and saves local preferences, then refreshes labels. Rendering buffers resize on the next frame; map and gameplay state remain unchanged. */
  function applyDisplay() {
    FrontierDisplay.set({
      scale: Number($("renderScale").value),
      filtering: $("renderFiltering").value,
    });
    displayControls();
  }
  $("renderScale").onchange = applyDisplay;
  $("renderFiltering").onchange = applyDisplay;
  displayControls();

  /* October 10, 2026: pause controls change only this playtest's breathing runtime. Map defaults remain in the Native Effects authoring dialog. */
  $("pauseSettings").insertAdjacentHTML(
    "beforeend",
    '<fieldset><legend>Screen breathing</legend><label><input id="breathEnabled" type="checkbox">Enabled</label><label>Intensity<input id="breathAmplitude" type="number" min="0" max="0.05" step="0.001"></label><label>Cycles per second<input id="breathFrequency" type="number" min="0.01" max="2" step="0.01"></label><label>Radius<input id="breathRadius" type="number" min="0.1" max="2" step="0.1"></label><label>Fade in (seconds)<input id="breathFadeIn" type="number" min="0" max="10" step="0.1"></label><label>Fade out (seconds)<input id="breathFadeOut" type="number" min="0" max="10" step="0.1"></label><p>Subtle radial squeeze of the world view. Gameplay stays paused here; changes take effect when you resume. Map defaults are edited in Native Effects.</p><button id="breathApply">Apply breathing</button><button id="breathPreview">Live preview</button></fieldset>',
  );
  $("pauseSettings").style.maxHeight = "84%";
  $("pauseSettings").style.overflowY = "auto";
  /* @function app.syncBreathing1522 — Inputs: none. Copies the current runtime settings, or map defaults before first frame, into readable pause controls. Returns nothing; does not advance phase or save authored data. */
  function syncBreathing() {
    const value =
      game.breathingSnapshot ||
      FrontierBreathing.validate(world.nativeEffects?.breathing);
    $("breathEnabled").checked = value.enabled;
    for (const [suffix, key] of [
      ["Amplitude", "amplitude"],
      ["Frequency", "frequency"],
      ["Radius", "radius"],
      ["FadeIn", "fadeIn"],
      ["FadeOut", "fadeOut"],
    ])
      $("breath" + suffix).value = value[key];
  }
  $("breathPreview").onclick =
    /* @function app.previewBreathing1522 — Inputs: click ignored. Validates current pause draft and opens an isolated captured-world preview. Invalid values appear in options status. Does not modify gameplay or authored defaults. */ function () {
      try {
        const value = { enabled: $("breathEnabled").checked };
        for (const [suffix, key] of [
          ["Amplitude", "amplitude"],
          ["Frequency", "frequency"],
          ["Radius", "radius"],
          ["FadeIn", "fadeIn"],
          ["FadeOut", "fadeOut"],
        ])
          value[key] = Number($("breath" + suffix).value);
        FrontierBreathingPreview.open(FrontierBreathing.validate(value), view);
      } catch (error) {
        $("recoveryStatus").textContent = error.message;
      }
    };
  $("breathApply").onclick =
    /* @function app.applyBreathing1522 — Inputs: button click ignored. Validates bounded settings and configures the active runtime without mutating map defaults. Returns nothing. Invalid input is reported in the existing options status and leaves the previous effect intact. */ function () {
      try {
        const value = { enabled: $("breathEnabled").checked };
        for (const [suffix, key] of [
          ["Amplitude", "amplitude"],
          ["Frequency", "frequency"],
          ["Radius", "radius"],
          ["FadeIn", "fadeIn"],
          ["FadeOut", "fadeOut"],
        ])
          value[key] = Number($("breath" + suffix).value);
        FrontierBreathing.setOptions(game, value);
        $("recoveryStatus").textContent =
          "Breathing configured for this session, including room transitions. Resume to continue its animation.";
      } catch (error) {
        $("recoveryStatus").textContent = error.message;
      }
    };
  $("pauseOptions").onclick =
    /* @function app.pauseOptions — Inputs: none. Shows options without unpausing and synchronizes existing volume/cursor controls; returns nothing. */ () => {
      syncBreathing();
      $("pauseMain").hidden = true;
      $("pauseSettings").hidden = false;
      $("pauseHand").value = handPreference.value;
      $("pauseVolume").value = $("volume").value;
      $("pauseVolumeValue").value =
        Math.round(Number($("volume").value) * 100) + "%";
    };

  $("pauseExitFullscreen").onclick =
    /* @function app.pauseExitFullscreen — Inputs: none. Leaves browser fullscreen on explicit click, keeps pause open and reports failures in the options status; returns an asynchronous completion. */ async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else $("recoveryStatus").textContent = "Already in windowed mode.";
      } catch {
        $("recoveryStatus").textContent = "Could not exit fullscreen.";
      }
    };
  $("pauseBack").onclick =
    /* @function app.pauseBack — Inputs: none. Restores pause actions while keeping gameplay frozen; returns nothing. */ () => {
      $("pauseSettings").hidden = true;
      $("pauseMain").hidden = false;
    };

  $("pauseSave").onclick =
    /* @function app.pauseSave — Inputs: none. Delegates to validated full playtest export; pause remains active and browser download owns file selection. */ () => {
      $("saveCombat").click();
    };

  $("pauseLoad").onclick =
    /* @function app.pauseLoad — Inputs: none. Opens the existing playtest file picker; cancellation retains current state. */ () => {
      $("loadCombat").value = "";
      $("loadCombat").click();
    };

  $("pauseVolume").oninput =
    /* @function app.pauseVolume — Inputs: none. Copies normalized 0..1 master gain to the shared control and updates percent; audio failure follows existing bridge. */ () => {
      $("volume").value = $("pauseVolume").value;
      $("volume").dispatchEvent(new Event("input"));
      $("pauseVolumeValue").value =
        Math.round(Number($("pauseVolume").value) * 100) + "%";
    };

  $("pauseHand").onchange =
    /* @function app.pauseHand — Inputs: none. Selects an existing preloaded hand and invokes its preference persistence; no asset duplication. */ () => {
      handPreference.value = $("pauseHand").value;
      handPreference.dispatchEvent(new Event("change"));
    };
  for (const control of pausePanel.querySelectorAll(
    "h2,button,label,select,output,p",
  )) {
    control.style.setProperty(
      "font-family",
      // October 15, 2026: follows the switchable game font (src/typography.js).
      "var(--frontier-game-font, PhanicomCheckbook, monospace)",
      "important",
    );
    control.style.setProperty(
      "font-size",
      control.tagName === "H2" ? "26px" : "20px",
      "important",
    );
  }
  $("pauseResume").onclick =
    /* @function app.onclick.3 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: capture look. Returns: capture look using . */ () =>
      resumePause();
  $("getUnstuck").onclick =
    /* @function app.onclick.4 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "recoveryStatus" text content. Uses: keys clear; mouse reset; frontier player recovery recover; $. */ () => {
      keys.clear();
      mouse.reset();
      const ok = FrontierPlayerRecovery.recover(game);
      $("recoveryStatus").textContent = ok
        ? "Moved to a safe position. Press Resume."
        : "No clear recovery position found. Enter the editor to reposition.";
      log(
        ok
          ? "Get Unstuck: restored a safe position."
          : "Get Unstuck: no clear position found.",
      );
    };
  // Fades own the simulation pause and interpreter adoption; no event payloads in traces.
  /* October 12: transfer cover must sit above the door canvas (z-index 200) during cold readiness and destination fade. */ const fadeLayer =
    document.createElement("div");
  fadeLayer.id = "mapTransferFade";
  Object.assign(fadeLayer.style, {
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    zIndex: "210",
    opacity: "0",
  });
  $("gameFrame").append(fadeLayer);
  const screenLayer = document.createElement("div");
  screenLayer.id = "eventScreenFade";
  Object.assign(screenLayer.style, {
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    zIndex: "1",
    background: "black",
    opacity: "0",
  });
  $("gameFrame").append(screenLayer);
  const screenFade = FrontierScreenFade.create(
    /* @function app.callback.5 — Provides the callback for frontier screen fade create. Inputs: amount. Updates: screen layer style opacity. */ (
      amount,
    ) => {
      screenLayer.style.opacity = amount;
    },
  );
  const flashLayer = document.createElement("div");
  flashLayer.id = "eventScreenFlash";
  Object.assign(flashLayer.style, {
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    zIndex: "2",
    opacity: "0",
  });
  $("gameFrame").append(flashLayer);
  const screenFlash = FrontierScreenFlash.create(
    /* @function app.callback.6 — Provides the callback for frontier screen flash create. Inputs: rgb; alpha. Updates: flash layer style background; flash layer style opacity. Uses: rgb join. */ (
      rgb,
      alpha,
    ) => {
      flashLayer.style.background = "rgb(" + rgb.join(",") + ")";
      flashLayer.style.opacity = alpha;
    },
  );
  const screenShake = FrontierScreenShake.create(
    /* @function app.callback.7 — Provides the callback for frontier screen shake create. Inputs: offset. Updates: view style transform. */ (
      offset,
    ) => {
      view.style.transform = offset
        ? "translateX(" + (offset / FrontierDisplay.get().width) * 100 + "%)"
        : "";
    },
  );
  const screenTone = FrontierScreenTone.create(
    /* @function app.callback.8 — Returns frontier pixi set tone using value. Inputs: value. Uses: frontier pixi set tone. Returns: frontier pixi set tone using value. */ (
      value,
    ) => FrontierPixi.setTone(value),
  );
  const meltOverlay = FrontierScreenMeltOverlay.create({
    host: $("gameFrame"),
    source: view,
    capture:
      /* @function app.capture.9 — Returns frontier pixi capture using canvas. Inputs: canvas. Uses: frontier pixi capture. Returns: frontier pixi capture using canvas. */ (
        canvas,
      ) => FrontierPixi.capture(canvas),
  });
  const transitionEffect =
    /* @function app.transitionEffect.10 — Returns world transition effect equals "melt" and the inverse of match media using "(prefers-reduced-motion: reduce)" matches selects "melt" or "fade". Inputs: no explicit arguments; uses enclosing module state. Uses: match media. Returns: world transition effect equals "melt" and the inverse of match media using "(prefers-reduced-motion: reduce)" matches selects "melt" or "fade". */ /* @function app.transitionEffect1517 — Inputs: none. Returns cell-selected door/melt/fade/immediate mode, with reduced-motion preference forcing fade. No mutation; October 9 supersedes fade/melt-only selection above. */ () =>
      matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "fade"
        : world.transitionEffect || "fade";
  const doorPresentation = FrontierDoorTransition.create({
    host: $("gameFrame"),
    play: /* @function app.doorSound — Inputs: name and gain 0–1. Returns bounded SE playback result; missing files are silent. */ (
      name,
      gain,
    ) => PhanicomSE.play(name, gain),
    report:
      /* @function app.doorError — Inputs: message. Displays resource failure without per-frame logging; returns nothing. */ (
        message,
      ) => log(message),
  });
  // October 10, 2026: the capture guard below supersedes the old Escape skip path.
  document.addEventListener(
    "keydown",
    /* @function app.cutsceneKeyboardGuard — Inputs: DOM key event. During a door/cell cinematic, cancels all shortcuts before target handlers, clears held movement/fire and returns nothing. The timeline continues normally; transitions cannot be skipped. */ function (
      event,
    ) {
      if (sceneTransition.busy) {
        event.preventDefault();
        event.stopImmediatePropagation();
        keys.clear();
        mouse.reset();
      }
    },
    true,
  );
  const sceneTransition = FrontierSceneTransition.create({
    preparationReady:
      /* @function app.destinationPrepared1523 — Inputs: reserved job. Returns whether shared destination room pixel decoding is complete or explicitly failed, preserving color fallback for failures. Does not clone/switch maps or start new loads. Ensures heavy room image onload work completes under readiness cover before door animation begins. */ /* @function app.destinationPrepared1524 — Inputs: reserved cell-transfer job. Returns whether destination room textures and optional enabled image sky have decoded or explicitly failed. October 13 extends the retained room-only contract above. Reads bounded shared status without allocating or switching maps; failed resources retain fallback. */ function (
        job,
      ) {
        const destination = mapLibrary?.get(job.map)?.world;
        if (!destination) return true;
        if (!FrontierModelMaterials.ready(destination)) return false;
        const sky = destination.sky;
        if (sky?.enabled && sky.panorama) {
          const status = window.FrontierSkyPanorama.status(sky.panorama.asset);
          if (!status.ready && !status.failed) return false;
        }
        for (const face of FrontierInterior.data(destination)?.faces || []) {
          const state = FrontierRoomSurfaces.status(face.texture);
          if (!state.ready && !state.failed) return false;
        }
        return true;
      },
    prepare:
      /* @function app.prepareDestination1523 — Inputs: validated reserved transfer job. Starts shared destination room image and event-model texture preparation before cinematic playback. Does not switch maps, create gameplay entities or clone project bundles. Cache services own asynchronous errors and prevent duplicate decoding; missing assets retain existing fallback behavior. */ /* @function app.prepareDestination1524 — Inputs: reserved cell-transfer job. Returns nothing; starts shared room, event-model and enabled panorama decoding under the transition readiness cover. October 13 extends the retained room/model contract above. Does not switch maps or duplicate requests; lazy sky bytes stay origin-clean in offline exports. */ function (
        job,
      ) {
        const destination = mapLibrary?.get(job.map)?.world;
        if (!destination) return;
        FrontierModelMaterials.prepare(destination);
        const sky = destination.sky;
        if (sky?.enabled && sky.panorama)
          window.FrontierSkyPanorama.image(sky.panorama.asset);
        for (const face of FrontierInterior.data(destination)?.faces || [])
          FrontierRoomSurfaces.get(face.texture);
        for (const event of destination.events || []) {
          const modelId = event.spatial?.modelId;
          if (!modelId) continue;
          const asset = FrontierModelLibrary.get(modelId);
          if (asset) FrontierModelRenderer.prepare(asset);
        }
      },
    door: doorPresentation,
    melt: meltOverlay,
    ready:
      /* @function app.destinationReady1517 — Inputs: transition job unused. Returns whether destination model textures are ready (or have explicitly failed). Starts each shared prepare once, and holds black during asynchronous decode. */ () => {
        for (const entity of game.sceneEvents || []) {
          if (!entity.modelId) continue;
          const asset = FrontierModelLibrary.get(entity.modelId);
          if (!asset) continue;
          const prepared = FrontierModelRenderer.prepare(asset);
          if (!prepared.ready && !prepared.error) return false;
        }
        return true;
      },
    opacity:
      /* @function app.opacity.11 — Handles opacity within application input, simulation and editor coordination. Inputs: amount; color. Updates: fade layer style background; fade layer style opacity. */ (
        amount,
        color,
      ) => {
        fadeLayer.style.background = color;
        fadeLayer.style.opacity = amount;
      },
    commit:
      /* @function app.commit.12 — Handles commit within application input, simulation and editor coordination. Inputs: t. Updates: travel cooldown. Uses: object assign; frontier terrain ground; journey set; capture runtime. Returns: without a result. */ (
        t,
      ) => {
        if (t.map === activeRuntimeMap) {
          Object.assign(game.player, {
            x: t.entry.x,
            y: t.entry.y,
            z: t.entry.z ?? FrontierTerrain.height(world, t.entry.x, t.entry.y),
            facingX: Math.sin(t.entry.yaw),
            facingY: Math.cos(t.entry.yaw),
            vx: 0,
            vy: 0,
          });
          FrontierTerrain.ground(game.player, world, 0, [], game);
          travelCooldown = 1.5;
          return;
        }
        journey.set(activeRuntimeMap, captureRuntime());
        const shared = captureRuntime();
        mapLibrary.switchTo(t.map, { travel: true, entry: t.entry, shared });
      },
    complete:
      /* @function app.complete.13 — Handles complete within application input, simulation and editor coordination. Inputs: t. Uses: session restore continuation. */ (
        t,
      ) => {
        if (t.continuation) session.restoreContinuation(t.continuation);
      },
  });
  /* @function app.reserveEventTransfer.14 — Handles reserve event transfer within application input, simulation and editor coordination. Inputs: parameters; continuation. Updates: continuation origin map. Uses: frontier transfer player resolve; map library snapshot; scene transition reserve; transition effect. Returns: true. */ function reserveEventTransfer(
    parameters,
    continuation,
  ) {
    if (sceneTransition.busy || pendingTravel) return false;
    continuation.originMap ??= activeRuntimeMap;
    const target = FrontierTransferPlayer.resolve(parameters, {
      variables: session.state.variables,
      player: game.player,
      resolveMap:
        /* @function app.transferMapLookup1523 — Inputs: persistent numeric map identity. Returns the library record read-only, with the live world substituted for same-map transfers. No cloning of model bundles or unrelated maps; missing IDs return undefined. */ (
          number,
        ) => {
          const record = mapLibrary.getByNumber(number);
          return record?.id === activeRuntimeMap
            ? { ...record, world }
            : record;
        },
      canStand:
        /* @function app.canStand.15 — Returns the inverse of frontier interior blocked using destination, x, y and the inverse of destination objects some using a callback and the inverse of destination events some using a callback. Inputs: destination; x; y. Uses: frontier interior blocked; destination objects some; destination events some. Returns: the inverse of frontier interior blocked using destination, x, y and the inverse of destination objects some using a callback and the inverse of destination events some using a callback. */ (
          destination,
          x,
          y,
        ) =>
          !FrontierInterior.blocked(destination, x, y) &&
          !destination.objects.some(
            /* @function app.callback.16 — Returns math hypot using e x minus x, e y minus y is less than e radius plus 0.13. Inputs: e. Returns: math hypot using e x minus x, e y minus y is less than e radius plus 0.13. */ (
              e,
            ) => Math.hypot(e.x - x, e.y - y) < e.radius + 0.13,
          ) &&
          !destination.events.some(
            /* @function app.callback.17 — Provides the callback for destination events some. Inputs: e. Uses: frontier events active page. Returns: chain and the inverse of p through and p priority equals "normal" and math hypot using e x minus x, e y minus y is less than 0.55. */ (
              e,
            ) => {
              const p = e.pages[FrontierEvents.activePage(e, session.state)];
              return (
                p?.solid &&
                !p.through &&
                p.priority === "normal" &&
                Math.hypot(e.x - x, e.y - y) < 0.55
              );
            },
          ),
    });
    sceneTransition.reserve({
      ...target,
      effect: target.fade === 2 ? "immediate" : transitionEffect(),
      door: world.doorTransition,
      continuation,
    });
    keys.clear();
    return true;
  }
  let mapLibrary = null,
    roomEditor = null,
    activeRuntimeMap = "demo",
    travelCooldown = 0,
    pendingTravel = null;
  const exitTouched = new Set();
  const journey = new Map(),
    journal = new Map();
  let hubState = FrontierHubState.empty(),
    hubWorkbench;
  /* @function app.captureRuntime.18 — Handles capture runtime within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier event state capture; screen fade capture; screen flash capture; screen shake capture. Returns: a record containing copied fields, screenFade, screenFlash, screenShake, screenTone, behaviors, replacements, player. */ function captureRuntime() {
    return {
      ...FrontierEventState.capture(session.state),
      screenFade: screenFade.capture(),
      screenFlash: screenFlash.capture(),
      screenShake: screenShake.capture(),
      screenTone: screenTone.capture(),
      behaviors: session.captureBehaviors(),
      replacements: session.replacementReferences(),
      player: {
        hp: game.player.hp,
        cerebral: game.player.cerebral,
        holstered: game.player.holstered,
        weapon: game.player.weapon.id,
        ammoLoaded: game.player.ammoLoaded,
        ammoReserve: game.player.ammoReserve,
        magazines: {
          ...game.player.magazines,
          [game.player.weapon.id]: game.player.ammoLoaded,
        },
      },
      switches: [...session.state.switches],
      variables: [...session.state.variables],
      inventory: [...session.state.inventory],
      selfSwitches: [...session.state.selfSwitches],
      events: session.events.map(
        /* @function app.callback.19 — Returns a record containing id, x, y. Inputs: e. Returns: a record containing id, x, y. */ (
          e,
        ) => ({ id: e.id, x: e.x, y: e.y }),
      ),
      actors: [...game.runtime.entities.values()]
        .filter(
          /* @function app.callback.20 — Returns e id does not equal "player". Inputs: e. Returns: e id does not equal "player". */ (
            e,
          ) => e.id !== "player",
        )
        .map(
          /* @function app.callback.21 — Returns a record containing id, x, y, hp, dead, gibbed. Inputs: e. Returns: a record containing id, x, y, hp, dead, gibbed. */ (
            e,
          ) => ({
            id: e.id,
            x: e.x,
            y: e.y,
            hp: e.hp ?? 24,
            dead: !!e.dead,
            gibbed: !!e.gibbed,
          }),
        ),
    };
  }
  /* @function app.restoreRuntime.22 — Handles restore runtime within application input, simulation and editor coordination. Inputs: state; shared. Updates: session state self switches; event x; event y; game scene signature; session state at k. Uses: screen tone restore; screen shake restore; screen flash restore; screen fade restore. */ function restoreRuntime(
    state,
    shared,
  ) {
    if (shared?.screenTone || state?.screenTone)
      screenTone.restore(shared?.screenTone || state.screenTone);
    if (shared?.screenShake || state?.screenShake)
      screenShake.restore(shared?.screenShake || state.screenShake);
    if (shared?.screenFlash || state?.screenFlash)
      screenFlash.restore(shared?.screenFlash || state.screenFlash);
    if (shared?.screenFade || state?.screenFade)
      screenFade.restore(shared?.screenFade || state.screenFade);
    if (state) {
      for (const r of state.replacements || [])
        session.replaceEvent(r.id, mapLibrary.templateBank(), r.template, {
          version: r.version,
          statePolicy: r.statePolicy,
        });
      session.state.selfSwitches = new Map(state.selfSwitches);
      for (const e of state.events) {
        const event = session.events.find(
          /* @function app.callback.23 — Returns v id equals e id. Inputs: v. Returns: v id equals e id. */ (
            v,
          ) => v.id === e.id,
        );
        if (event) {
          event.x = e.x;
          event.y = e.y;
        }
      }
      session.restoreBehaviors(state.behaviors);
      game.sceneSignature = null;
      preview();
      for (const e of state.actors) {
        const actor = game.runtime.entities.get(e.id);
        if (actor) Object.assign(actor, e);
      }
    }
    if (shared) {
      FrontierEventState.restore(session.state, shared);
      for (const k of ["switches", "variables", "inventory"])
        session.state[k] = new Map(shared[k]);
      const { weapon, ...p } = shared.player;
      Object.assign(game.player, p);
      PhanicomABS.equip(game, weapon);
      game.player.ammoLoaded = p.ammoLoaded;
      game.player.holstered = p.holstered;
    }
    game.sceneSignature = null;
    preview();
  }
  /* @function app.attemptTravel.24 — Handles attempt travel within application input, simulation and editor coordination. Inputs: exit. Updates: travel cooldown; pending travel. Uses: map library get; dest world interior entrances find; dest world travel entrances find; log. Returns: without a result; without a result. */ function attemptTravel(
    exit,
  ) {
    /* October 12, 2026: first reservation owns the activation; overlapping events cannot queue a second transfer behind a cinematic. */ if (
      sceneTransition.busy ||
      pendingTravel
    )
      return;
    const dest = mapLibrary.get(exit.map),
      entry =
        exit.entrance === "spawn" && dest
          ? { ...dest.world.spawn, yaw: 0 }
          : dest?.world.cell?.arrivals?.find(
              /* @function app.cellArrival — Inputs: arrival. Returns matching named doorway; no effects. */ (
                a,
              ) => a.id === exit.entrance,
            ) ||
            dest?.world.interior?.entrances?.find(
              /* @function app.callback.25 — Returns e id equals exit entrance. Inputs: e. Returns: e id equals exit entrance. */ (
                e,
              ) => e.id === exit.entrance,
            ) ||
            dest?.world.travel?.entrances?.find(
              /* @function app.callback.26 — Returns e id equals exit entrance. Inputs: e. Returns: e id equals exit entrance. */ (
                e,
              ) => e.id === exit.entrance,
            );
    if (!dest || !entry) {
      log("Map exit needs an existing destination entrance.");
      travelCooldown = 2;
      return;
    }
    if (
      FrontierInterior.blocked(
        dest.world,
        entry.x,
        entry.y,
        0.13,
        entry.z ?? FrontierTerrain.height(dest.world, entry.x, entry.y),
      ) ||
      dest.world.events.some(
        /* @function app.callback.27 — Provides the callback for dest world events some. Inputs: e. Uses: frontier events active page. Returns: chain and the inverse of page through and page priority does not equal "below" and page priority does not equal "above" and math hypot using e x minus entry x, e y minus entry y is less than 0.55. */ (
          e,
        ) => {
          const page = e.pages[FrontierEvents.activePage(e, session.state)];
          return (
            page?.solid &&
            !page.through &&
            page.priority !== "below" &&
            page.priority !== "above" &&
            Math.hypot(e.x - entry.x, e.y - entry.y) < 0.55
          );
        },
      ) ||
      dest.world.objects.some(
        /* @function app.callback.28 — Returns math hypot using e x minus entry x, e y minus entry y is less than e radius plus 0.13. Inputs: e. Returns: math hypot using e x minus entry x, e y minus entry y is less than e radius plus 0.13. */ (
          e,
        ) => Math.hypot(e.x - entry.x, e.y - entry.y) < e.radius + 0.13,
      )
    ) {
      log("Arrival entrance is blocked. Move it in the Room editor.");
      travelCooldown = 2;
      return;
    }
    pendingTravel = {
      map: exit.map,
      entry,
      effect: exit.transition?.effect,
      door: exit.transition,
    };
  }
  /* @function app.journalEntry.29 — Handles journal entry within application input, simulation and editor coordination. Inputs: key; text. Uses: journal set; journal render. */ function journalEntry(
    key,
    text,
  ) {
    journal.set(key, text);
    journalRender();
  }
  /* @function app.journalRender.30 — Handles journal render within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Updates: li text content. Uses: $; list replace children; journal values; document create element. Returns: without a result. */ function journalRender() {
    const list = $("journalEntries");
    if (!list) return;
    list.replaceChildren();
    for (const text of journal.values()) {
      const li = document.createElement("li");
      li.textContent = text;
      list.append(li);
    }
  }
  const originalHolster = MF.toggleHolster;
  MF.toggleHolster =
    /* @function app.toggleHolster.31 — Handles toggle holster within application input, simulation and editor coordination. Inputs: game; ui. Updates: game player facing x; game player facing y; game player movement facing. Uses: original holster. */ (
      game,
      ui,
    ) => {
      const facing = {
        x: game.player.facingX,
        y: game.player.facingY,
      };
      originalHolster(game, ui);
      {
        game.player.facingX = facing.x;
        game.player.facingY = facing.y;
        game.player.movementFacing = facing;
      }
    };
  const mouse = FrontierInput.mouseLook(),
    padReader = FrontierInput.gamepadReader();
  view.tabIndex = 0;
  let noticeTimer;
  const log =
    /* @function app.log.32 — Records a human-readable runtime message. Inputs: text. Updates: $ using "message" text content; $ using "descriptionScreen" text content; notice timer. Uses: $; clear timeout; set timeout. */ (
      text,
    ) => {
      $("message").textContent = text;
      $("descriptionScreen").textContent = text;
      clearTimeout(noticeTimer);
      noticeTimer = setTimeout(
        /* @function app.callback.33 — Provides the callback for set timeout. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "descriptionScreen" text content. Uses: $. */ () => {
          if ($("descriptionScreen").textContent === text)
            $("descriptionScreen").textContent =
              "Point at an object to inspect it.";
        },
        6000,
      );
    };
  // Clone the ammo prefab so separately placed boxes never share pages or command arrays.
  /* @function app.ammo.34 — Clone the ammo prefab so separately placed boxes never share pages or command arrays. Inputs: id; x; y. Uses: structured clone. Returns: a record containing copied fields, id, x, y. */ function ammo(
    id,
    x,
    y,
  ) {
    return {
      ...structuredClone(FrontierEventData.ammoTemplate),
      id,
      x,
      y,
    };
  }
  // Build the preset demonstration world and add authored conversation topics and terrain/sky defaults.
  /* @function app.generated.35 — Build the preset demonstration world and add authored conversation topics and terrain/sky defaults. Inputs: seed; assignment pattern; assignment pattern. Updates: result parameters; result music; result asset catalog; result cerebral; source name. Uses: frontier world generate; frontier parameters validate; frontier music validate; structured clone. Returns: result. */ function generated(
    seed,
    width = 48,
    height = 48,
  ) {
    const result = FrontierWorld.generate(seed, width, height);
    result.parameters = FrontierParameters.validate();
    result.music = FrontierMusic.validate({
      ...FrontierMusic.defaults,
      exploration: FrontierMusicCatalog.exploration,
      combat: FrontierMusicCatalog.combat,
    });
    result.assetCatalog = structuredClone(FrontierMusicCatalog);
    result.cerebral = FrontierCerebral.validate();
    const source = FrontierWorld.entity(
      "rock",
      width / 2 + 7,
      height / 2,
      "cerebral-test",
    );
    source.name = "Cerebral anomaly";
    source.cerebralSource = true;
    result.objects = result.objects.filter(
      /* @function app.callback.36 — Returns math hypot using e x minus source x, e y minus source y is greater than 2. Inputs: e. Returns: math hypot using e x minus source x, e y minus source y is greater than 2. */ (
        e,
      ) => Math.hypot(e.x - source.x, e.y - source.y) > 2,
    );
    result.objects.push(source);
    result.events = structuredClone(FrontierEventData.initialEvents);
    const guide = result.events.find(
      /* @function app.callback.37 — Returns e name includes using "guide". Inputs: e. Uses: e name includes. Returns: e name includes using "guide". */ (
        e,
      ) => e.name.includes("guide"),
    );
    if (guide)
      guide.topics = [
        {
          aliases: ["ammo", "ammunition", "supplies"],
          answer:
            "Supply boxes near the starting point hold ammunition. Press P, point at a box, and left-click to collect it.",
        },
        {
          aliases: ["frontier", "world"],
          answer:
            "These hills are the Vector Frontier. Explore freely and use the editor to create your own encounters.",
        },
        {
          aliases: ["weapons", "gun", "combat"],
          answer:
            "You can test the weapon profiles in the combat controls. Space draws or holsters your weapon.",
        },
      ];
    const example = FrontierEvents.create("conversation-demo", 25, 28);
    example.name = "Conversation test NPC";
    example.pages[0].commands = [
      {
        type: "message",
        text: "Will you help explore the frontier?",
        dialogue: true,
      },
      { type: "choices", key: "answer", options: ["Not now", "Yes"] },
      {
        type: "branch",
        condition: { type: "variable", key: "answer", value: 2 },
      },
      { type: "selfSwitch", key: "A", value: true },
      { type: "message", text: "Thank you. Talk to me again!", dialogue: true },
      { type: "else" },
      {
        type: "message",
        text: "Come back whenever you are ready.",
        dialogue: true,
      },
      { type: "end" },
    ];
    const helped = FrontierEvents.page("Help accepted");
    helped.condition = { type: "selfSwitch", key: "A" };
    helped.commands = [
      {
        type: "message",
        text: "We are ready to explore together.",
        dialogue: true,
      },
    ];
    example.pages.push(helped);
    result.events.push(example);
    for (const event of result.events) {
      event.x += width / 2 - 24;
      event.y += height / 2 - 24;
      for (const page of event.pages)
        for (const command of page.commands)
          if (command.type === "transfer") {
            command.x += width / 2 - 24;
            command.y += height / 2 - 24;
          }
    }
    result.terrain = FrontierTerrain.validate({
      ...FrontierProject.demo.terrain,
      mode: $("terrainMode").value,
      amplitude: Number($("terrainAmplitude").value),
    });
    // The first demo includes an editable shallow basin beside spawn; no fluid simulation.
    result.water = FrontierWater.validate();
    result.terrain.edits ||= {};
    const cx = Math.floor(result.spawn.x - 6),
      cy = Math.floor(result.spawn.y + 4),
      pool = FrontierWater.poolHeights(result, cx, cy),
      bottom = pool.bottom;
    for (let y = cy - 3; y <= cy + 3; y++)
      for (let x = cx - 3; x <= cx + 3; x++) {
        result.terrain.edits[x + "," + y] =
          bottom - FrontierTerrain.baseHeight(result, x, y);
        if (x < cx + 3 && y < cy + 3)
          result.water.cells[x + "," + y] = pool.surface;
      }
    result.objects = result.objects.filter(
      /* @function app.callback.38 — Returns math abs using e x minus cx is greater than 4 or math abs using e y minus cy is greater than 4. Inputs: e. Returns: math abs using e x minus cx is greater than 4 or math abs using e y minus cy is greater than 4. */ (
        e,
      ) => Math.abs(e.x - cx) > 4 || Math.abs(e.y - cy) > 4,
    );
    result.terrain.revision = (result.terrain.revision || 0) + 1;
    result.sky = structuredClone(FrontierProject.demo.sky);
    result.fog = FrontierFog.validate({ enabled: true });
    return result;
  }
  // Route event messages into the inspection CRT without interrupting pickups; retain modal fallback for layouts without that screen.
  let numberInputController = null;
  /* @function app.dialogue.39 — Handles dialogue within application input, simulation and editor coordination. Inputs: message. Updates: number input controller; $ using "dialogue" hidden; $ using "descriptionScreen" text content; $ using "descriptionScreen" scroll top; mouse paused. Uses: $; mouse reset; string; choices replace children. Returns: false; true. */ function dialogue(
    message,
  ) {
    numberInputController = null;
    if (!message) {
      $("dialogue").hidden = true;
      return false;
    }
    if (message && !message.dialogue && $("descriptionScreen")) {
      $("dialogue").hidden = true;
      $("descriptionScreen").textContent = message.name + "\n" + message.text;
      $("descriptionScreen").scrollTop = 0;
      return true;
    }
    $("dialogue").hidden = !message;
    if (message) {
      mousePaused = true;
      mouse.reset();
      // Text and following choices have separate presentation settings in MZ.
      const presentation = message.textPresentation;
      $("dialogue").dataset.position = String(presentation?.position ?? 2);
      $("dialogue").dataset.background = String(presentation?.background ?? 0);
      $("dialogueName").textContent = message.name;
      $("dialogueName").hidden = !message.name;
      $("dialogueText").textContent = message.text;
      const choices = $("dialogueChoices");
      choices.replaceChildren();
      choices.style.textAlign = "";
      choices.dataset.background = "0";
      choices.dataset.position = String(
        message.choicePrompt ? message.position : 0,
      );
      $("nextMessage").hidden = !!message.options || !!message.numberInput;
      for (const [i, label] of (message.options || []).entries()) {
        const button = document.createElement("button");
        button.textContent = label;
        button.onclick =
          /* @function app.onclick.40 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: session choose. Returns: session choose using i. */ () =>
            session.choose(i);
        choices.append(button);
      }
      if (message.numberInput)
        numberInputController = FrontierNumberInput.mount(
          choices,
          message,
          /* @function app.callback.41 — Returns session input number using value. Inputs: value. Uses: session input number. Returns: session input number using value. */ (
            value,
          ) => session.inputNumber(value),
        );
      if (message.choicePrompt) {
        choices.style.textAlign = ["left", "center", "right"][message.position];
        choices.dataset.background = message.background;
        choices.tabIndex = -1;
        const preferred = choices.children[message.defaultType];
        (preferred || choices).focus();
      }
      keys.clear();
      drag = null;
      if (document.pointerLockElement) document.exitPointerLock();
    }
  }
  // Lock camera look and release the pointer for live device interaction; movement
  // and simulation continue. Returning preserves the existing camera orientation.
  /* @function app.toggleHUD.42 — and simulation continue. Returning preserves the existing camera orientation. Inputs: no explicit arguments; uses enclosing module state. Updates: hud mode; $ using "inventoryPanel" hidden; drag; game pointer. Uses: $ using "gameFrame" class list toggle; $; keys clear; mouse reset. Returns: without a result. */ function toggleHUD() {
    if (editing || session.busy) return;
    hudMode = !hudMode;
    $("gameFrame").classList.toggle("hudCursor", hudMode);
    $("inventoryPanel").hidden = true;
    keys.clear();
    drag = null;
    mouse.reset();
    if (hudMode) {
      releaseLook(false);
      game.pointer = { x: FrontierDisplay.get().width / 2, y: 96 };
    } else captureLook();
  }
  $("hudSkin").onchange =
    /* @function app.onchange.43 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier device hud skin; $. Returns: frontier device hud skin using $ using "hudSkin" value. */ () =>
      FrontierDeviceHUD.skin($("hudSkin").value);
  let inventoryResume = false;
  // Remember whether gameplay owned mouse look before the inventory opened, then restore that mode on close.
  /* @function app.inventoryToggle.44 — Remember whether gameplay owned mouse look before the inventory opened, then restore that mode on close. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "inventoryPanel" hidden; inventory resume; play paused; drag; mouse paused. Uses: $; keys clear; mouse reset; document exit pointer lock. Returns: without a result. */ function inventoryToggle() {
    if (editing || session.busy) return;
    const opening = $("inventoryPanel").hidden;
    $("inventoryPanel").hidden = !opening;
    if (opening) inventoryResume = !mousePaused && !hudMode;
    playPaused = opening;
    keys.clear();
    drag = null;
    mouse.reset();
    mousePaused = true;
    if (opening && document.pointerLockElement) document.exitPointerLock();
    if (!opening && inventoryResume && !hudMode) captureLook();
  }
  $("inventoryButton").onclick = inventoryToggle;
  $("remoteInventory").onclick =
    /* @function app.onclick.45 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: inventory toggle; click feedback. */ () => {
      inventoryToggle();
      clickFeedback();
    };
  $("remoteResume").onclick =
    /* @function app.onclick.46 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: click feedback; $; inventory toggle; toggle hud. */ () => {
      clickFeedback();
      if (!$("inventoryPanel").hidden) inventoryToggle();
      if (hudMode) toggleHUD();
      else captureLook();
    };
  $("inventoryClose").onclick = inventoryToggle;
  /* @function app.journalToggle.47 — Handles journal toggle within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "journalPanel" hidden; play paused. Uses: $; keys clear; release look; journal render. Returns: without a result. */ function journalToggle() {
    if (editing || session.busy) return;
    const opening = $("journalPanel").hidden;
    $("journalPanel").hidden = !opening;
    playPaused = opening;
    keys.clear();
    releaseLook(false);
    journalRender();
  }
  $("journalButton").onclick = journalToggle;
  $("journalClose").onclick = journalToggle;
  document.addEventListener(
    "keydown",
    /* @function app.callback.48 — Provides the callback for document add event listener. Inputs: e. Uses: e key to lower case; /INPUT|TEXTAREA|SELECT/ test; e prevent default; journal toggle. */ (
      e,
    ) => {
      if (
        e.key.toLowerCase() === "j" &&
        !e.repeat &&
        !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)
      ) {
        e.preventDefault();
        journalToggle();
      }
    },
  );
  // October 14: retain DOM focus/selection between frames; rebuild only on live state changes.
  let inventorySignature1525 = "", inventoryGame1525 = null;
  // Render inventory values from runtime state; ammo is displayed from combat reserve/loaded counts.
  /* @function app.inventoryRender.49 — Render inventory values from runtime state; ammo is displayed from combat reserve/loaded counts. Inputs: no explicit arguments; uses enclosing module state. Updates: li text content. Uses: $; list replace children; a list of spread element filter; document create element. */ function inventoryRender() {
    const list = $("inventoryItems");
    const signature = JSON.stringify([...session.state.inventory]) + ":" + game.player.ammoReserve + ":" + game.player.ammoLoaded + ":" + game.player.hp + ":" + game.player.holstered + ":" + (game.itemDropPreview?.itemId || "");
    if (inventoryGame1525 === game && inventorySignature1525 === signature) return;
    inventoryGame1525 = game;
    inventorySignature1525 = signature;
    list.replaceChildren();
    // October 9: event-item rows now live in the hub workbench, with Drop buttons.
    // Superseded October 9: the duplicated item-list filter is no longer called.
    /* @function app.callback.50 � Returns id does not equal "ammo9". Inputs: array pattern. Returns: id does not equal "ammo9". */
    const items = [
      ["Pistol", "1 to equip"],
      [world.cerebral.melee.name, "2 to equip"],
      [
        "9mm ammunition",
        game.player.ammoReserve +
          " reserve / " +
          game.player.ammoLoaded +
          " loaded",
      ],
    ];
    for (const [name, amount] of items) {
      const li = document.createElement("li");
      li.textContent = name + " — " + amount;
      if (name !== "9mm ammunition") {
        const equip = document.createElement("button");
        equip.textContent = "Equip";
        equip.onclick = /* @function app.inventoryEquip1525 — Inputs: click ignored. Returns nothing; equips the existing handgun/melee profile through the gameplay owner and invalidates menu state. */ function () {
          PhanicomABS.equip(game, name === "Pistol" ? "handgun" : "starter-melee");
          game.player.holstered = false;
          inventorySignature1525 = "";
        };
        li.append(equip);
      }
      list.append(li);
    }
    hubWorkbench?.inventory(list);
  }
  // Stop old footsteps and create a fresh runtime copy. Authored world stays intact; switches, pickups and combat reset unless explicitly restored.
  /* @function app.restart.51 — Stop old footsteps and create a fresh runtime copy. Authored world stays intact; switches, pickups and combat reset unless explicitly restored. Inputs: assignment pattern; assignment pattern. Updates: $ using "seed" value; $ using "mapWidth" value; $ using "mapHeight" value; $ using "inventoryPanel" hidden; $ using "journalPanel" hidden. Uses: $; map library remember; footsteps stop; music stop. */ function restart(
    keepPosition = false,
    resetCamera = false,
    preserveHub = false,
  ) {
    // October 9: authoring/fresh playtests reset temporary drops; real cell
    // transfers explicitly preserve compact session state, as save import does.
    if (!preserveHub) hubState = FrontierHubState.empty();
    $("seed").value = world.seed;
    $("mapWidth").value = world.width ?? world.size;
    $("mapHeight").value = world.height ?? world.size;
    mapLibrary?.remember();
    footsteps?.stop();
    music.stop();
    dialogue(null);
    screenFade.reset();
    screenFlash.reset();
    screenShake.reset();
    screenTone.reset();
    $("inventoryPanel").hidden = true;
    $("journalPanel").hidden = true;
    playPaused = false;
    const position =
        keepPosition && game
          ? {
              x: game.player.x,
              y: game.player.y,
              z: game.player.z,
              grounded: game.player.grounded,
              facingX: game.player.facingX,
              facingY: game.player.facingY,
            }
          : null,
      camera = resetCamera ? null : game?.camera;
    // October 13: initialize shared item metadata before constructing runtime drops.
    FrontierItemDefinitions.apply(
      mapLibrary?.gameplayDefaults?.extensions?.itemDefinitions,
    );
    // October 13: adopt native profile overrides before cloning an equipped weapon.
    FrontierWeaponDefinitions.apply(
      mapLibrary?.gameplayDefaults?.extensions?.weaponDefinitions,
    );
    game = MF.makeFrontierGame(world, log);
    // October 14: initialize editor camera state before the first render.
    game.editorFlight = editing;
    game.audio = audio;
    game.input = {
      keys,
    };
    if (camera) game.camera = camera;
    session = FrontierEvents.createSession(world.events || [], {
      journal: journalEntry,
      bounds:
        /* @function app.bounds.52 — Calculates or applies the enclosing limits for this module’s data. Inputs: no explicit arguments; uses enclosing module state. Uses: frontier world dimensions. Returns: frontier world dimensions using world. */ () =>
          FrontierWorld.dimensions(world),
      motionDelta:
        /* @function app.motionDelta.53 — Returns frontier activity motion delta using game, event, page. Inputs: event; page; dt. Uses: frontier activity motion delta. Returns: frontier activity motion delta using game, event, page. */ (
          event,
          page,
          dt,
        ) => FrontierActivity.motionDelta(game, event, page, dt),
      message: dialogue,
      log,
      behaviorCanMove:
        /* @function app.behaviorCanMove.54 — Handles behavior can move within application input, simulation and editor coordination. Inputs: event. Uses: game runtime entities get. Returns: the inverse of chain and the inverse of chain is greater than 0. */ (
          event,
        ) => {
          const actor = game?.runtime.entities.get(event.id);
          return !actor?.dead && !(actor?.stunTime > 0);
        },
      behaviorTarget:
        /* @function app.behaviorTarget.55 — Handles behavior target within application input, simulation and editor coordination. Inputs: event; page; player. Uses: game runtime entities get; frontier party combat target. Returns: chain equals "monster" selects frontier party combat target using game, actor or player. */ (
          event,
          page,
          player,
        ) => {
          const actor = game?.runtime.entities.get(event.id);
          return actor?.kind === "monster"
            ? FrontierPartyCombat.target(game, actor)
            : player;
        },
      playSE:
        /* @function app.playSE.56 — Returns phanicom se play event using sound, log. Inputs: sound. Uses: phanicom se play event. Returns: phanicom se play event using sound, log. */ (
          sound,
        ) => PhanicomSE.playEvent(sound, log),
      stopSE:
        /* @function app.stopSE.57 — Returns phanicom se stop using . Inputs: no explicit arguments; uses enclosing module state. Uses: phanicom se stop. Returns: phanicom se stop using . */ () =>
          PhanicomSE.stop(),
      templateBank:
        /* @function app.templateBank.58 — Returns map library template bank using . Inputs: no explicit arguments; uses enclosing module state. Uses: map library template bank. Returns: map library template bank using . */ () =>
          mapLibrary.templateBank(),
      resolveEntity:
        /* @function app.resolveEntity.59 — Returns chain. Inputs: id. Uses: game runtime entities get. Returns: chain. */ (
          id,
        ) => game?.runtime.entities.get(id),
      screenFade:
        /* @function app.screenFade.60 — Returns screen fade start using out. Inputs: out. Uses: screen fade start. Returns: screen fade start using out. */ (
          out,
        ) => screenFade.start(out),
      screenFlash:
        /* @function app.screenFlash.61 — Returns screen flash start using color, frames. Inputs: color; frames. Uses: screen flash start. Returns: screen flash start using color, frames. */ (
          color,
          frames,
        ) => screenFlash.start(color, frames),
      screenShake:
        /* @function app.screenShake.62 — Returns screen shake start using power, speed, frames. Inputs: power; speed; frames. Uses: screen shake start. Returns: screen shake start using power, speed, frames. */ (
          power,
          speed,
          frames,
        ) => screenShake.start(power, speed, frames),
      screenTone:
        /* @function app.screenTone.63 — Handles screen tone within application input, simulation and editor coordination. Inputs: tone; frames. Uses: frontier pixi tone supported; error; screen tone start. */ (
          tone,
          frames,
        ) => {
          if (!FrontierPixi.toneSupported())
            throw Error("Tint Screen requires the Pixi GPU renderer.");
          screenTone.start(tone, frames);
        },
      currentMap:
        /* @function app.currentMap.64 — Returns active runtime map. Inputs: no explicit arguments; uses enclosing module state. Returns: active runtime map. */ () =>
          activeRuntimeMap,
      selfSwitchMap:
        /* @function app.selfSwitchMap.65 — Returns map equals active runtime map selects session state self switches or a new map. Inputs: map. Uses: journey get. Returns: map equals active runtime map selects session state self switches or a new map. */ (
          map,
        ) =>
          map === activeRuntimeMap
            ? session.state.selfSwitches
            : new Map(journey.get(map)?.selfSwitches || []),
      setSelfSwitch:
        /* @function app.setSelfSwitch.66 — Handles set self switch within application input, simulation and editor coordination. Inputs: map; key; value. Updates: saved self switches. Uses: session state self switches set; journey get; error; switches set. */ (
          map,
          key,
          value,
        ) => {
          if (map === activeRuntimeMap)
            session.state.selfSwitches.set(key, value);
          else {
            const saved = journey.get(map);
            if (!saved) throw Error("Missing origin map state.");
            const switches = new Map(saved.selfSwitches);
            switches.set(key, value);
            saved.selfSwitches = [...switches];
          }
        },
      transitionPending:
        /* @function app.transitionPending1523 — Inputs: none. Returns whether a queued exit or active cinematic owns transfer, so the interpreter stops automatic activation in the reservation frame. No mutation. */ () =>
          sceneTransition.busy || !!pendingTravel,
      transferPlayer: reserveEventTransfer,
      transferMap:
        /* @function app.transferMap.67 — Returns attempt travel using a record containing map, entrance. Inputs: map; entrance. Uses: attempt travel. Returns: attempt travel using a record containing map, entrance. */ (
          map,
          entrance,
        ) => attemptTravel({ map, entrance }),
      canStand:
        /* @function app.canStand.68 — Returns the inverse of blocked using x, y, 0.13. Inputs: x; y; id. Uses: blocked; game runtime entities get. Returns: the inverse of blocked using x, y, 0.13. */ (
          x,
          y,
          id,
        ) => !blocked(x, y, 0.13, game.runtime.entities.get(id)),
      item: /* @function app.item.69 — Handles item within application input, simulation and editor coordination. Inputs: id; amount. Updates: game player ammo reserve. */ (
        id,
        amount,
        originEventId,
      ) => {
        if (id === "ammo9") game.player.ammoReserve += amount;
        // October 14: preserve pickup instance size without granting quantity twice.
        const origin = world.events.find(/* @function app.pickupOrigin1525 — Inputs: authored event. Returns origin event-ID match; no mutation. */ function (event) { return event.id === originEventId; });
        if (origin?.extensions?.itemPickup) {
          const definition = FrontierItems.find(/* @function app.pickupDefinition1525 — Inputs: item definition. Returns stable ID match; no effects. */ function (item) { return item.id === id; });
          FrontierHubState.carry(hubState, new Map(), { itemId:id, quantity:amount,
            properties:{ ...definition?.properties, worldHeight:origin.height || definition?.properties?.worldHeight || 0.35, pickupMethod:"interact" } });
        }
      },
    });
    FrontierEventState.restore(
      session.state,
      mapLibrary?.gameplayDefaults || {},
    );
    // October 13: project HUD settings mutate the retained combat parameter reference.
    // Apply on session construction, including travel and exported save restoration.
    FrontierKillFeedSettings.apply(
      mapLibrary?.gameplayDefaults?.extensions?.hudKillFeed,
    );
    game.eventSession = session;
    game.sourceWorld = world;
    terrainTools?.refresh();
    FrontierCerebral.configure(game);
    PhanicomABS.equip(game, "handgun");
    if (world.interior?.mode === "fixed") {
      game.camera.yaw = world.interior.camera.yaw;
      game.camera.firstPerson = false;
      mousePaused = false;
      captureAttempted = document.pointerLockElement === view;
      const cam = FrontierInterior.camera(game),
        p = FrontierInterior.project(cam, game.player.x, game.player.y + 2, 1);
      game.pointer = { x: p.x, y: p.y };
    }
    $("gameFrame").classList.toggle("interiorView", !!world.interior);
    roomEditor?.refresh();
    PhanicomBlood.attach(game);
    preview();
    // October 14 Test 4: mode handoff must check the preserved full XYZ body,
    // not reject it with the old ground-plane NPC check and reset to spawn.
    if (position) Object.assign(game.player, position);
    if (
      (world.flight?.mode || "ground") === "ground" ||
      !Number.isFinite(game.player.z)
    )
      FrontierTerrain.ground(game.player, world, 0, [], game);
    if (editing) game.player.holstered = true;
    $("mapWidth").value = world.width ?? world.size;
    $("mapHeight").value = world.height ?? world.size;
    $("gridSpacing").value = world.gridSpacing ?? 2;
    const activity = FrontierWorld.activitySettings(world.activity);
    for (const name of Object.keys(activity))
      $("activity-" + name).value = activity[name];
    $("objectX").max = (world.width ?? world.size) - 1;
    $("objectY").max = (world.height ?? world.size) - 1;
    $("terrainMode").value = world.terrain?.mode || "flat";
    $("terrainAmplitude").value = world.terrain?.amplitude || 0;
    $("skyEnabled").checked = world.sky?.enabled !== false;
    parametersRefresh();
    footsteps = audio.start(game, log);
    keys.clear();
    editor?.refresh();
    preview();
  }
  // Resolve event pages into scene entities and cache the result by page/position signature. Preserve damage state for existing IDs when a page changes.
  /* @function app.preview.70 — Resolve event pages into scene entities and cache the result by page/position signature. Preserve damage state for existing IDs when a page changes. Inputs: no explicit arguments; uses enclosing module state. Updates: game party membership; game authoring; game selected id; game scene signature; game scene events. Uses: events map; events map using a callback join; events map using a callback filter. Returns: without a result; without a result. */ function preview() {
    if (!game) return;
    game.partyMembership = session.state.actors;
    game.authoring = editing;
    game.selectedId = editor?.selectedId || "";
    const events = editing ? world.events || [] : session.events;
    const pages = events.map(
      /* @function app.callback.71 — Returns editing selects event id equals chain selects math min using editor page index, event pages length minus 1 or 0 or session active page using event. Inputs: event. Uses: session active page. Returns: editing selects event id equals chain selects math min using editor page index, event pages length minus 1 or 0 or session active page using event. */ (
        event,
      ) =>
        editing
          ? event.id === editor?.selectedId
            ? Math.min(editor.pageIndex, event.pages.length - 1)
            : 0
          : session.activePage(event),
    );
    const signature =
      session.replacementRevision +
      "|" +
      events
        .map(
          /* @function app.callback.72 — Returns event id plus ":" plus pages at i plus ":" plus event x plus ":" plus event y plus ":" plus event elevation or 0 plus ":" plus the inverse of the inverse of event transparent plus ":" plus event opacity or the fallback 255 plus ":" plus event mz or chain selects event walk time or 0 or "". Inputs: event; i. Returns: event id plus ":" plus pages at i plus ":" plus event x plus ":" plus event y plus ":" plus event elevation or 0 plus ":" plus the inverse of the inverse of event transparent plus ":" plus event opacity or the fallback 255 plus ":" plus event mz or chain selects event walk time or 0 or "". */ (
            event,
            i,
          ) =>
            event.id +
            ":" +
            pages[i] +
            ":" +
            event.x +
            ":" +
            event.y +
            ":" +
            (event.elevation || 0) +
            ":" +
            !!event.transparent +
            ":" +
            (event.opacity ?? 255) +
            ":" +
            (event.mz || event.pages[pages[i]]?.mz ? event.walkTime || 0 : ""),
        )
        .join("|");
    if (game.sceneSignature === signature) return;
    game.sceneSignature = signature;
    game.sceneEvents = events
      .map(
        /* @function app.callback.73 — Provides the callback for events map. Inputs: event; i. Uses: phanicom abs parse event; game runtime entities get; frontier terrain height; world events find. Returns: null; entity. */ (
          event,
          i,
        ) => {
          const index = pages[i];
          if (index < 0) return null;
          // October 14: collected item pages retain saved self-switch state
          // but remove their render/picking entity until a fresh test.
          if (event.extensions?.itemPickup && event.pages[index].graphic === "none") return null;
          const page = event.pages[index],
            combat = event.combatNote
              ? PhanicomABS.parseEvent({
                  note: event.combatNote,
                })
              : null;
          const previous = game.runtime.entities.get(event.id),
            old =
              previous?.definitionRevision === (event.definitionRevision || 0)
                ? previous
                : null;
          const entity = {
            ...old,
            behaviorOwned: !!page.behavior,
            behaviorPhase: event.behaviorPhase,
            definitionRevision: event.definitionRevision || 0,
            id: event.id,
            eventId: event.id,
            transparent: !!event.transparent,
            opacity: event.opacity ?? 255,
            partyActorId: event.extensions?.party?.actorId,
            name: event.displayName ?? event.name,
            x: event.x,
            y: event.y,
            elevation: event.elevation || 0,
            heightOffset: event.heightOffset,
            z:
              FrontierTerrain.height(
                world,
                event.movementMode === "flying"
                  ? (world.events.find(
                      /* @function app.callback.74 — Returns e id equals event id. Inputs: e. Returns: e id equals event id. */ (
                        e,
                      ) => e.id === event.id,
                    )?.x ?? event.x)
                  : event.x,
                event.movementMode === "flying"
                  ? (world.events.find(
                      /* @function app.callback.75 — Returns e id equals event id. Inputs: e. Returns: e id equals event id. */ (
                        e,
                      ) => e.id === event.id,
                    )?.y ?? event.y)
                  : event.y,
              ) + (event.heightOffset ?? (event.elevation || 0) * 0.3),
            isAmmo: event.pages.some(
              /* @function app.callback.76 — Returns p commands some using a callback. Inputs: p. Uses: p commands some. Returns: p commands some using a callback. */ (
                p,
              ) =>
                p.commands.some(
                  /* @function app.callback.77 — Returns c type equals "giveItem" and c item equals "ammo9". Inputs: c. Returns: c type equals "giveItem" and c item equals "ammo9". */ (
                    c,
                  ) => c.type === "giveItem" && c.item === "ammo9",
                ),
            ),
            itemLight: event.extensions?.itemPickup ? FrontierItems.find(/* @function app.placedItemLight1525 — Inputs: item definition. Returns current pickup ID match; no mutation. */ function (item) { return item.id === event.extensions.itemPickup.item; })?.properties?.light : undefined,
            kind: combat ? "monster" : page.graphic,
            type: combat ? "monster" : "prop",
            radius: combat?.hitRadius || 0.28,
            height:
              event.height ??
              (["chest", "openChest"].includes(page.graphic) ? 1.05 : 1.65),
            range: event.range,
            solid: page.solid && !page.through,
            priority: page.priority || "normal",
            spriteProfile:
              page.mz?.image.profile &&
              !FrontierEvents.graphics.includes(page.mz.image.profile)
                ? page.mz.image.profile
                : event.spriteProfile || undefined,
            vectorTreatment: event.vectorTreatment || "map",
            combat,
            maxHp: combat?.maxHp || 24,
            hp: old?.hp ?? combat?.maxHp ?? 24,
            dead: old?.dead || false,
            facingX: event.facingX ?? old?.facingX ?? 0,
            facingY: event.facingY ?? old?.facingY ?? 1,
            walkTime: event.walkTime || 0,
            walkHold: event.walkHold || 0,
            walkAnime: page.mz?.walkAnime,
            stepAnime: page.mz?.stepAnime,
          };
          Object.assign(
            entity,
            window.FrontierModelEvents?.entityFields(event.spatial) || {},
          );
          game.runtime.entities.set(event.id, entity);
          return entity;
        },
      )
      .filter(Boolean);
  }
  // Snapshot authored data, apply an edit, validate, then record undo and restart. On rejection restore the snapshot instead of keeping a partial edit.
  let terrainTools;
  /* @function app.mutate.78 — Handles mutate within application input, simulation and editor coordination. Inputs: action; callback. Updates: world; redo history; $ using "eventEditorStatus" text content; history. Uses: structured clone; history slice; redo history slice; action. */
  /* @function app.mutateContract1524 - Inputs: synchronous authored-world action and optional success callback. Returns: true on a validated commit, false after rejection/rollback. Clones the prior world/history, synchronizes attached decorations, rebuilds runtime preview, and reports status. New preview controllers use the boolean to retain rejected ghosts; older callers may ignore it. All dimensional validation occurs before history is accepted. */ function mutate(
    action,
    callback,
  ) {
    // October 12, 2026: packaged gameplay cannot commit authored-world changes.
    // Reject before invoking the action, cloning history or restarting a scene.
    if (window.FRONTIER_RUNTIME_ONLY) {
      log("Authoring is unavailable in this game.");
      return false;
    }
    const before = structuredClone(world),
      priorHistory = history.slice(),
      priorRedo = redoHistory.slice();
    try {
      action();
      // October 12, 2026: update parent-relative wall decorations at the edit boundary before validating the resulting cell.
      window.FrontierRoomLayout?.synchronize(world);
      window.FrontierPropPlacement?.synchronize(world);
      world = FrontierWorld.validate(world);
      history.push(before);
      redoHistory = [];
      if (history.length > 30) history.shift();
      // Keep undo snapshots within a modest memory budget on large sculpted maps.
      const bytes = JSON.stringify(before).length * 2;
      const cap = Math.max(
        1,
        Math.min(30, Math.floor((32 * 1024 * 1024) / Math.max(1, bytes))),
      );
      while (history.length > cap) history.shift();
      restart(true);
      callback?.();
      log("Authored change applied.");
      if ($("eventWorkbench")?.open)
        $("eventEditorStatus").textContent = "Change applied.";
      return true;
    } catch (error) {
      world = before;
      history = priorHistory;
      redoHistory = priorRedo;
      editor.refresh();
      restart(true);
      log("Change rejected: " + error.message);
      if ($("eventWorkbench")?.open)
        $("eventEditorStatus").textContent =
          "Change rejected: " + error.message;
      return false;
    }
  }
  // Reject overlapping props and route movement through validated undoable mutation.
  /* @function app.moveObject.79 — Reject overlapping props and route movement through validated undoable mutation. Inputs: id; x; y. Uses: a list of spread element, spread element find; world objects some; log; mutate. Returns: without a result; without a result. */ function moveObject(
    id,
    x,
    y,
  ) {
    const e = [...world.objects, ...(world.events || [])].find(
      /* @function app.callback.80 — Returns e id equals id. Inputs: e. Returns: e id equals id. */ (
        e,
      ) => e.id === id,
    );
    if (!e) return;
    if (
      !e.pages &&
      world.objects.some(
        /* @function app.callback.81 — Returns o id does not equal id and math hypot using o x minus x, o y minus y is less than o radius plus e radius. Inputs: o. Returns: o id does not equal id and math hypot using o x minus x, o y minus y is less than o radius plus e radius. */ (
          o,
        ) => o.id !== id && Math.hypot(o.x - x, o.y - y) < o.radius + e.radius,
      )
    ) {
      log("Placement overlaps another object.");
      return;
    }
    mutate(
      /* @function app.callback.82 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e x; e y. */ () => {
        e.x = x;
        e.y = y;
      },
    );
  }
  // Remove the selected authored object/event, reset selection, and rebuild preview.
  /* @function app.remove.83 — Remove the selected authored object/event, reset selection, and rebuild preview. Inputs: id. Uses: mutate; editor choose; preview. */ function remove(
    id,
  ) {
    mutate(
      /* @function app.callback.84 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world objects; world events. Uses: world objects filter; world events or a list of filter. */ () => {
        world.objects = world.objects.filter(
          /* @function app.callback.85 — Returns e id does not equal id. Inputs: e. Returns: e id does not equal id. */ (
            e,
          ) => e.id !== id,
        );
        world.events = (world.events || []).filter(
          /* @function app.callback.86 — Returns e id does not equal id. Inputs: e. Returns: e id does not equal id. */ (
            e,
          ) => e.id !== id,
        );
      },
    );
    editor.choose("");
    preview();
  }
  // October 14, 2026 Test 5: scene multiselection deletes through ONE owner
  // transaction, rather than replaying single-item handlers with separate Undo.
  /* @function app.removeSceneSelection — Inputs: array of {group,id} scene targets. Returns true for a validated deletion, false for runtime/nonediting/empty/stale targets or rejected mutation. Resolves IDs against current authored collections, removes placed instances only and creates one Undo entry. Room arrivals use interior or outdoor travel ownership; lights retain their existing validated settings. Never deletes shared image/model files or reserved runtime sources. */
  function removeSceneSelection(targets) {
    if (window.FRONTIER_RUNTIME_ONLY || !editing || !Array.isArray(targets)) return false;
    const sets = new Map();
    for (const target of targets) {
      if (!target || !["roomSelection", "selection", "localLightSelection"].includes(target.group) || typeof target.id !== "string" || !target.id || target.id.startsWith("@")) continue;
      if (!sets.has(target.group)) sets.set(target.group, new Set());
      sets.get(target.group).add(target.id);
    }
    const collections = [];
    /* @function app.collectSceneDeletion — Inputs: owning record, array key, target group. Returns nothing; records only currently existing IDs and their owning array, without editing data. Missing collections and stale IDs are ignored before history begins. */
    function collect(owner, key, group) {
      const ids = sets.get(group);
      if (!owner || !Array.isArray(owner[key]) || !ids) return;
      let found = false;
      for (const entry of owner[key]) if (ids.has(entry.id)) { found = true; break; }
      if (found) collections.push({owner, key, ids});
    }
    collect(world, "objects", "selection");
    collect(world, "events", "selection");
    for (const key of ["blockers", "sprites", "primitives"]) collect(world.interior, key, "roomSelection");
    for (const key of ["entrances", "exits"]) collect(world.interior || world.travel, key, "roomSelection");
    collect(world.lighting, "lights", "localLightSelection");
    if (!collections.length) return false;
    return mutate(/* @function app.commitSceneDeletion — Inputs: none. Removes resolved instance IDs inside the standard atomic validation/Undo boundary. Rollback/restart remain owned by mutate; shared assets and unrelated records are retained. */ function () {
      for (const {owner, key, ids} of collections)
        owner[key] = owner[key].filter(/* @function app.retainSceneInstance — Inputs: current authored entry. Returns whether its stable ID is outside this collection's deletion set; no mutation. */ function(entry) { return !ids.has(entry.id); });
    });
  }
  window.FrontierSceneActions = { removeMany: removeSceneSelection };
  // Switch editor/playtest state, release capture and restart from authored data. F2 is the editor shortcut; Tab remains the HUD menu.
  /* @function app.mode.87 — Switch editor/playtest state, release capture and restart from authored data. F2 is the editor shortcut; Tab remains the HUD menu. Inputs: no explicit arguments; uses enclosing module state. Updates: editing; mouse paused; capture attempted; play paused; drag. Uses: mouse reset; document exit pointer lock; keys clear; $. */ function mode() {
    if (window.FRONTIER_RUNTIME_ONLY) return;
    // Test 5: F2 leaves the modal before changing modes; no hidden modal can
    // trap playtest input. Unapplied drafting still follows the mode reset.
    const tileRoomWindow = document.getElementById("tileRoomWindow");
    if (tileRoomWindow?.open) tileRoomWindow.close();
    editing = !editing;
    mousePaused = editing;
    captureAttempted = false;
    playPaused = false;
    mouse.reset();
    if (document.pointerLockElement) document.exitPointerLock();
    keys.clear();
    drag = null;
    $("editor").hidden = !editing;
    $("mode").textContent = editing ? "IN-LEVEL AUTHORING" : "PLAYTEST";
    $("panelTitle").textContent = editing
      ? "Edit where you play"
      : "A world of sprites";
    $("intro").textContent = editing
      ? "WASD explores the level. Right-drag looks around. Left-click selects or places; drag objects to move them. Right-click ground to create events, or events to edit, duplicate or delete. Right-drag looks around."
      : "Move the mouse to look. Click once to capture; Escape releases. Space holsters your weapon. P locks the camera for cursor targeting; left-click collects, right-click inspects.";
    $("edit").textContent = editing ? "Playtest [F2]" : "Open editor [F2]";
    game.editorFlight = editing;
    restart(true);
    // October 14 Test 4: editor noclip and an authored spawn may overlap a wall
    // or erased floor. Keep clear positions; move only invalid bodies to nearby
    // supported space. A failed search returns to editing rather than trapping.
    if (!editing && !FrontierPlayerRecovery.enterPlaytest(game)) {
      editing = true;
      $("editor").hidden = false;
      game.editorFlight = true;
      mousePaused = true;
      game.player.holstered = true;
      $("mode").textContent = "IN-LEVEL AUTHORING";
      $("panelTitle").textContent = "Edit where you play";
      $("edit").textContent = "Playtest [F2]";
      log("Playtest needs a clear floor position. Move inside the room or place a valid spawn, then try again.");
      view.focus({ preventScroll: true });
      return;
    }
    // Both mode directions must release focus from hidden inspector controls.
    view.focus({ preventScroll: true });
    // October 14: explicit Playtest/F2 is a user gesture; request real pointer capture after reset rather than leaving unconfined look active. P-mode retains its deliberate cursor behavior.
    if (!editing) captureLook();
    log(
      editing
        ? "Authoring: combat and event execution paused."
        : "Fresh playtest: authored data preserved; temporary switches and pickups reset.",
    );
  }
  // Test world bounds and solid footprints for NPC/editor movement. Player step/jump collision is handled by terrain.js.
  /* @function app.blocked.88 — Test world bounds and solid footprints for NPC/editor movement. Player step/jump collision is handled by terrain.js. Inputs: x; y; assignment pattern; assignment pattern. Uses: frontier model collision blocked; frontier interior blocked; frontier activity query using game, x minus 2, y minus 2 some; frontier activity query. Returns: frontier model collision blocked using game, x, y or frontier interior blocked using world, x, y or x is less than 0.5 or y is less than 0.5 or x is greater than world width or the fallback world size minus 0.5 or y is greater than world height or the fallback world size minus 0.5 or frontier activity query using game, x minus 2, y minus 2 some using a callback or game scene events or a list of some using a callback. */ function blocked(
    x,
    y,
    radius = 0.13,
    ignore = null,
  ) {
    return (
      FrontierModelCollision.blocked(
        game,
        x,
        y,
        radius,
        ignore || game.player,
      ) ||
      FrontierInterior.blocked(world, x, y, radius, ignore?.z || 0) ||
      x < 0.5 ||
      y < 0.5 ||
      x > (world.width ?? world.size) - 0.5 ||
      y > (world.height ?? world.size) - 0.5 ||
      FrontierActivity.query(game, x - 2, y - 2, x + 2, y + 2, true).some(
        /* @function app.callback.89 — Returns e does not equal ignore and the inverse of e dead and math abs using e x minus x is less than e radius plus radius and math abs using e y minus y is less than e radius plus radius. Inputs: e. Returns: e does not equal ignore and the inverse of e dead and math abs using e x minus x is less than e radius plus radius and math abs using e y minus y is less than e radius plus radius. */ (
          e,
        ) =>
          e !== ignore &&
          !e.dead &&
          Math.abs(e.x - x) < e.radius + radius &&
          Math.abs(e.y - y) < e.radius + radius,
      ) ||
      (game.sceneEvents || []).some(
        /* @function app.callback.90 — Returns e does not equal ignore and e solid and math abs using e x minus x is less than e radius plus radius and math abs using e y minus y is less than e radius plus radius. Inputs: e. Returns: e does not equal ignore and e solid and math abs using e x minus x is less than e radius plus radius and math abs using e y minus y is less than e radius plus radius. */ (
          e,
        ) =>
          e !== ignore &&
          e.solid &&
          Math.abs(e.x - x) < e.radius + radius &&
          Math.abs(e.y - y) < e.radius + radius,
      )
    );
  }
  // Move one axis at a time to slide along blocking footprints.
  /* @function app.move.91 — Move one axis at a time to slide along blocking footprints. Inputs: e; dx; dy; radius; ignore. Updates: e x; e y. Uses: blocked. */ function move(
    e,
    dx,
    dy,
    radius,
    ignore,
  ) {
    if (!blocked(e.x + dx, e.y, radius, ignore)) e.x += dx;
    if (!blocked(e.x, e.y + dy, radius, ignore)) e.y += dy;
  }
  // Gate firing against editor, menu, event execution and death before calling the combat host.
  /* @function app.shoot.92 — Gate firing against editor, menu, event execution and death before calling the combat host. Inputs: no explicit arguments; uses enclosing module state. Updates: game room aim point. Uses: mf fire shot. */ function shoot() {
    if (!editing && !playPaused && !session.busy && !world.cell?.safe && game.player.hp > 0) {
      const point =
        world.interior?.mode === "fixed"
          ? game.pointer || { x: FrontierDisplay.get().width / 2, y: 240 }
          : { x: FrontierDisplay.get().width / 2, y: 96 };
      game.roomAimPoint = point;
      MF.fireShot(game, point.x, point.y, game.ui);
    }
  }
  // Convert CSS/browser coordinates into logical canvas pixels; do not mix client pixels with projected points.
  /* @function app.screenPoint.93 — Convert CSS/browser coordinates into logical canvas pixels; do not mix client pixels with projected points. Inputs: event. Uses: view get bounding client rect. Returns: a record containing x, y. */ function screenPoint(
    event,
  ) {
    /* October 10, 2026: displayed cursor coordinates must sample the radial world filter before picking. HUD and hand stay in browser coordinates; physical framebuffer density never enters this mapping. */
    const b = view.getBoundingClientRect(),
      width = FrontierDisplay.get().width;
    const x = (event.clientX - b.left) / b.width,
      y = (event.clientY - b.top) / b.height;
    const mapped = game.breathingSnapshot
      ? FrontierBreathing.sample(x, y, width / 480, game.breathingSnapshot)
      : { x, y };
    return { x: mapped.x * width, y: mapped.y * 480 };
  }
  // One foot is 0.3 world units; reach remains independent of rendering.
  FrontierBreathing.bind(
    /* @function app.breathingGame1522 — Inputs: none. Returns active playtest for native breathing event execution. Does not alter map configuration. */ function () {
      return game;
    },
  );
  const WORLD_FOOT = 0.3;
  // Require P mode, a nearby projected target and a clear reach ray. World foot conversion is presentation only.
  /* @function app.nearbyTarget.94 — Require P mode, a nearby projected target and a clear reach ray. World foot conversion is presentation only. Inputs: point. Uses: frontier render pick; session events find; frontier parameters get; mf frontier spatial sweep. Returns: null; null. */ function nearbyTarget(
    point,
  ) {
    if (
      editing ||
      !hudMode ||
      playPaused ||
      session.busy ||
      game.player.hp <= 0
    )
      return null;
    const cursor = point ||
      (hudMode ? game.pointer : null) || {
        x: FrontierDisplay.get().width / 2,
        y: 96,
      };
    const target = FrontierRender.pick(game, cursor.x, cursor.y),
      event = session.events.find(
        /* @function app.callback.95 — Returns e id equals chain. Inputs: e. Returns: e id equals chain. */ (
          e,
        ) => e.id === target?.id,
      );
    if (!target || target.dead) return null;
    const distance = Math.hypot(
      target.x - game.player.x,
      target.y - game.player.y,
      (target.z || 0) - (game.player.z || 0),
    );
    if (
      distance >
      (event?.range ??
        FrontierParameters.get(world, "interactionFeet") * WORLD_FOOT)
    )
      return null;
    const obstruction = MF.frontierSpatial.sweep(
      game,
      {
        x: game.player.x,
        y: game.player.y,
        z: (game.player.z || 0) + 0.9,
      },
      {
        x: target.x,
        y: target.y,
        z: (target.z || 0) + Math.min(0.5, target.height / 2),
      },
      0.01,
      game.player.id,
    );
    if (
      obstruction &&
      obstruction.id !== target.id &&
      obstruction.id !== target.modelHostId
    )
      return null;
    return {
      target,
      event,
      distance,
    };
  }
  // Start the reachable event interact trigger; pickups are authored giveItem/self-switch commands.
  /* @function app.clickFeedback.96 — Start the reachable event interact trigger; pickups are authored giveItem/self-switch commands. Inputs: no explicit arguments; uses enclosing module state. Uses: phanicom se play. */ function clickFeedback() {
    const settings = world.clickFeedback || { sound: "Click 1", volume: 0.5 };
    if (settings.sound) PhanicomSE.play(settings.sound, settings.volume);
  }
  /* @function app.interact.97 — Handles interact within application input, simulation and editor coordination. Inputs: point. Uses: nearby target; log; session start; click feedback. Returns: without a result; without a result. */ function interact(
    point,
  ) {
    if (!hudMode) return;
    const hit = nearbyTarget(point);
    if (!hit) {
      log("No reachable object here.");
      return;
    }
    if (hubWorkbench?.interact(hit)) {
      clickFeedback();
      return;
    }
    if (!hit.event || !session.start(hit.event, "interact"))
      log("This object has no pickup or interaction.");
    else clickFeedback();
  }
  // Display authored inspection text in the HUD, with sensible fallback descriptions.
  /* @function app.inspect.98 — Display authored inspection text in the HUD, with sensible fallback descriptions. Inputs: point. Uses: nearby target; log; click feedback. Returns: without a result; without a result. */ function inspect(
    point,
  ) {
    if (!hudMode) return;
    const hit = nearbyTarget(point);
    if (!hit) {
      log("No reachable object to inspect.");
      return;
    }
    const name = hit.event?.name || hit.target.name || hit.target.kind;
    const text =
      hit.event?.inspection ||
      (hit.target.cerebralSource
        ? "Cerebral anomaly. Within " +
          world.cerebral.radius +
          " tiles, drains " +
          world.cerebral.amount +
          " Cerebral every " +
          world.cerebral.interval +
          " seconds. Current Cerebral: " +
          Math.round(game.player.cerebral) +
          " / " +
          world.cerebral.max +
          "."
        : hit.target.isAmmo
          ? hit.target.kind === "openChest"
            ? "An empty ammunition box."
            : "A box containing 24 rounds of 9mm ammunition."
          : "No further information has been recorded.");
    log(name + ": " + text);
    clickFeedback();
  }
  // Intersect a screen ray with terrain and delegate placement at the resulting world coordinates.
  /* @function app.place.99 — Intersect a screen ray with terrain and delegate placement at the resulting world coordinates. Inputs: point. Uses: frontier render ground point; place at; log. */ function place(
    point,
  ) {
    const p = FrontierRender.groundPoint(game, point.x, point.y);
    if (p) placeAt(p.x, p.y);
    else log("Point at the ground inside the level.");
  }
  // Select, erase or instantiate an authored prop/event/ammo prefab within level bounds.
  /* @function app.placeAt.100 — Select, erase or instantiate an authored prop/event/ammo prefab within level bounds. Inputs: x; y. Uses: log; $; a list of spread element, spread element map using a callback sort; a list of spread element, spread element map. Returns: without a result; without a result. */ function placeAt(
    x,
    y,
  ) {
    if (
      x < 1 ||
      y < 1 ||
      x > (world.width ?? world.size) - 1 ||
      y > (world.height ?? world.size) - 1
    ) {
      log("Place inside the level bounds.");
      return;
    }
    const tool = $("sceneTool").value;
    if (tool === "select") {
      const nearest = [...world.objects, ...(world.events || [])]
        .map(
          /* @function app.callback.101 — Returns a record containing e, d. Inputs: e. Returns: a record containing e, d. */ (
            e,
          ) => ({
            e,
            d: Math.hypot(e.x - x, e.y - y),
          }),
        )
        .sort(
          /* @function app.callback.102 — Returns a d minus b d. Inputs: a; b. Returns: a d minus b d. */ (
            a,
            b,
          ) => a.d - b.d,
        )[0];
      editor.choose(nearest?.d < 1.5 ? nearest.e.id : "");
      preview();
      return;
    }
    const id = "authored-" + Date.now() + "-" + ++serial;
    if (tool === "library") {
      const selected = $("libraryType").value;
      const type = selected.startsWith("builtin-")
        ? { kind: selected.slice(8) }
        : world.prefabs?.find(
            /* @function app.callback.103 — Returns t id equals selected. Inputs: t. Returns: t id equals selected. */ (
              t,
            ) => t.id === selected,
          );
      if (!type) return;
      if (type.event) {
        editor.beginEvent({ ...structuredClone(type.event), id, x, y }, true);
        return;
      }
      mutate(
        /* @function app.callback.104 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Uses: world events push; structured clone; world objects push; frontier world entity. */ () => {
          if (type.event) {
            world.events.push({ ...structuredClone(type.event), id, x, y });
          } else
            world.objects.push({
              ...FrontierWorld.entity(type.kind, x, y, id),
              typeId: type.id || selected,
              name: type.name || type.kind,
              ...(type.spriteProfile
                ? { spriteProfile: type.spriteProfile }
                : {}),
            });
        },
      );
      editor.choose(id);
      preview();
      return;
    }
    if (tool === "event" || tool === "ammo") {
      editor.beginEvent(
        tool === "ammo" ? ammo(id, x, y) : FrontierEvents.create(id, x, y),
        true,
      );
      return;
    } else {
      const kind = $("kind").value;
      if (kind === "erase") {
        const near = world.objects.find(
          /* @function app.callback.105 — Returns math hypot using e x minus x, e y minus y is less than 1.5. Inputs: e. Returns: math hypot using e x minus x, e y minus y is less than 1.5. */ (
            e,
          ) => Math.hypot(e.x - x, e.y - y) < 1.5,
        );
        if (near) remove(near.id);
        return;
      }
      const e = FrontierWorld.entity(kind, x, y, id);
      if (
        world.objects.some(
          /* @function app.callback.106 — Returns math hypot using o x minus x, o y minus y is less than o radius plus e radius. Inputs: o. Returns: math hypot using o x minus x, o y minus y is less than o radius plus e radius. */ (
            o,
          ) => Math.hypot(o.x - x, o.y - y) < o.radius + e.radius,
        )
      ) {
        log("Placement overlaps another object.");
        return;
      }
      mutate(
        /* @function app.callback.107 — Returns world objects push using e. Inputs: no explicit arguments; uses enclosing module state. Uses: world objects push. Returns: world objects push using e. */ () =>
          world.objects.push(e),
      );
      editor.choose(id);
    }
    preview();
  }
  let eventTestOrigin = null,
    redoHistory = [];
  world = generated("PHANICOM");
  if (!window.FRONTIER_RUNTIME_ONLY)
    editor = FrontierEditor.create({
      world:
        /* @function app.world.108 — Returns world. Inputs: no explicit arguments; uses enclosing module state. Returns: world. */ () =>
          world,
      templates:
        /* @function app.templates.109 — Returns chain. Inputs: no explicit arguments; uses enclosing module state. Uses: map library snapshot. Returns: chain. */ () =>
          mapLibrary?.snapshot().templates,
      saveTemplate:
        /* @function app.saveTemplate.110 — Returns map library save template using name, event. Inputs: name; event. Uses: map library save template. Returns: map library save template using name, event. */ (
          name,
          event,
        ) => mapLibrary.saveTemplate(name, event),
      undoTemplate:
        /* @function app.undoTemplate.111 — Returns map library undo template using . Inputs: no explicit arguments; uses enclosing module state. Uses: map library undo template. Returns: map library undo template using . */ () =>
          mapLibrary.undoTemplate(),
      redoTemplate:
        /* @function app.redoTemplate.112 — Returns map library redo template using . Inputs: no explicit arguments; uses enclosing module state. Uses: map library redo template. Returns: map library redo template using . */ () =>
          mapLibrary.redoTemplate(),
      maps: /* @function app.maps.113 — Returns chain or a list of . Inputs: no explicit arguments; uses enclosing module state. Uses: map library snapshot. Returns: chain or a list of . */ () =>
        mapLibrary?.snapshot().maps || [],
      mutate,
      move: moveObject,
      remove,
      preview,
      runtime:
        /* @function app.runtime.114 — Returns session debug using . Inputs: no explicit arguments; uses enclosing module state. Uses: session debug. Returns: session debug using . */ () =>
          session.debug(),
      /* @function app.testEvent.115 — Handles test event within application input, simulation and editor coordination. Inputs: id. Updates: event test origin. Uses: mode; object assign; session events find; session start. */ testEvent(
        id,
      ) {
        eventTestOrigin = {
          camera: { ...game.camera },
          x: game.player.x,
          y: game.player.y,
        };
        const camera = { ...game.camera };
        if (editing) mode();
        Object.assign(game.camera, camera);
        const event = session.events.find(
          /* @function app.callback.116 — Returns e id equals id. Inputs: e. Returns: e id equals id. */ (
            e,
          ) => e.id === id,
        );
        if (event)
          session.start(
            event,
            event.pages[session.activePage(event)]?.trigger || "interact",
          );
      },
      /* @function app.returnEditor.117 — Handles return editor within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Updates: game player x; game player y; event test origin. Uses: mode; object assign. */ returnEditor() {
        if (!editing) mode();
        if (eventTestOrigin) {
          Object.assign(game.camera, eventTestOrigin.camera);
          game.player.x = eventTestOrigin.x;
          game.player.y = eventTestOrigin.y;
          eventTestOrigin = null;
        }
      },
    });
  $("edit").onclick = mode;
  view.addEventListener(
    "dblclick",
    /* @function app.callback.118 — Provides the callback for view add event listener. Inputs: event. Uses: editor choose; frontier render pick; screen point; editor open event. */ (
      event,
    ) => {
      if (editing) {
        editor.choose(
          FrontierRender.pick(game, screenPoint(event).x, screenPoint(event).y)
            ?.id || "",
        );
        editor.openEvent?.();
      }
    },
  );
  $("generate").onclick =
    /* @function app.onclick.119 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: world; history. Uses: confirm; generated; $; number. Returns: without a result; without a result. */ () => {
      if (
        editing &&
        !confirm("Replace the authored world? Export first to keep edits.")
      )
        return;
      try {
        const next = generated(
          $("seed").value || "PHANICOM",
          Number($("mapWidth").value),
          Number($("mapHeight").value),
        );
        world = FrontierWorld.validate(
          mapLibrary?.active === "outdoor-assets-test"
            ? FrontierOutdoorAssets.world(next)
            : next,
        );
      } catch (error) {
        log("Generation rejected: " + error.message);
        return;
      }
      history = [];
      editor.choose("");
      restart(false, true);
      log("Generated world: " + world.seed);
    };
  $("aspect").onchange =
    /* @function app.onchange.120 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: view width; game view width. Uses: $; document document element style set property. */ () => {
      const wide = $("aspect").value === "16:9";
      FrontierDisplay.aspect(wide);
      displayControls();
      game.viewWidth = FrontierDisplay.get().width;
      document.documentElement.style.setProperty(
        "--display-ratio",
        wide ? "1.7777777778" : "1.3333333333",
      );
    };
  $("fullscreen").onclick =
    /* @function app.onclick.121 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: document exit fullscreen; $ using "viewport" request fullscreen; $; log. */ async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else {
          await $("viewport").requestFullscreen();
          try {
            await navigator.keyboard?.lock(["Escape"]);
          } catch {
            /* Browser may reserve Escape; fullscreenchange below pauses after exit. */
          }
        }
      } catch {
        log("Fullscreen is unavailable in this browser.");
      }
    };
  document.addEventListener(
    "fullscreenchange",
    /* @function app.callback.122 — Provides the callback for document add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "fullscreen" text content. Uses: $. */ () => {
      $("fullscreen").textContent = document.fullscreenElement
        ? "Exit fullscreen"
        : "Fullscreen";
      if (!document.fullscreenElement && !editing) releaseLook(true);
    },
  );
  $("camera").onclick =
    /* @function app.onclick.123 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: game camera first person; $ using "camera" text content. Uses: log; $. Returns: without a result. */ () => {
      if (world.interior?.mode === "fixed") {
        log(
          "This room uses its authored fixed camera. P mode remains available.",
        );
        return;
      }
      game.camera.firstPerson = !game.camera.firstPerson;
      $("camera").textContent = game.camera.firstPerson
        ? "Third person [V]"
        : "First person [V]";
    };
  $("terrainMode").onchange =
    /* @function app.onchange.124 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.125 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world terrain. Uses: $. */ () => {
          world.terrain = {
            ...world.terrain,
            mode: $("terrainMode").value,
          };
        },
      );
  $("terrainAmplitude").onchange =
    /* @function app.onchange.126 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.127 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world terrain. Uses: number; $. */ () => {
          world.terrain = {
            ...world.terrain,
            amplitude: Number($("terrainAmplitude").value),
          };
        },
      );
  $("skyEnabled").onchange =
    /* @function app.onchange.128 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.129 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world sky. Uses: $. */ () => {
          world.sky = {
            ...world.sky,
            enabled: $("skyEnabled").checked,
          };
        },
      );
  $("cameraHeight").oninput =
    /* @function app.oninput.130 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Updates: game camera height. Uses: number; $. Returns: assignment. */ () =>
      (game.camera.height = Number($("cameraHeight").value));
  $("undo").onclick =
    /* @function app.onclick.131 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: world. Uses: redo history push; structured clone; history pop; restart. */ () => {
      if (history.length) {
        redoHistory.push(structuredClone(world));
        world = history.pop();
        restart(true);
        log("Authored change undone.");
      }
    };
  const redoButton = document.createElement("button");
  redoButton.id = "redo";
  redoButton.textContent = "Redo change";
  $("undo").after(redoButton);
  redoButton.onclick =
    /* @function app.onclick.132 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: world. Uses: history push; structured clone; redo history pop; restart. */ () => {
      if (redoHistory.length) {
        history.push(structuredClone(world));
        world = redoHistory.pop();
        restart(true);
        log("Authored change redone.");
      }
    };
  $("sceneTool").onchange =
    /* @function app.onchange.133 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: log; $. Returns: log using "Scene tool: " plus $ using "sceneTool" selected options at 0 text content. */ () =>
      log("Scene tool: " + $("sceneTool").selectedOptions[0].textContent);
  $("map").onclick =
    /* @function app.onclick.134 — Responds to a button or clickable control. Inputs: event. Uses: $ using "map" get bounding client rect; $; place at. Returns: without a result. */ (
      event,
    ) => {
      if (!editing) return;
      const b = $("map").getBoundingClientRect();
      placeAt(
        ((event.clientX - b.left) / b.width) * (world.width ?? world.size),
        ((event.clientY - b.top) / b.height) * (world.height ?? world.size),
      );
    };
  $("export").onclick =
    /* @function app.onclick.135 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: a href; a download. Uses: url create object url; json stringify; document create element; a click. */ () => {
      const url = URL.createObjectURL(
          new Blob([JSON.stringify(world, null, 2)], {
            type: "application/json",
          }),
        ),
        a = document.createElement("a");
      a.href = url;
      a.download = "frontier-world.json";
      a.click();
      setTimeout(
        /* @function app.callback.136 — Returns url revoke object url using url. Inputs: no explicit arguments; uses enclosing module state. Uses: url revoke object url. Returns: url revoke object url using url. */ () =>
          URL.revokeObjectURL(url),
        1000,
      );
      log("Authored world exported, including event pages.");
    };
  $("import").onchange =
    /* @function app.onchange.137 — Applies a changed control value to its owning system. Inputs: event. Updates: world; $ using "seed" value; history; event target value. Uses: error; frontier world validate; json parse; f text. Returns: without a result. */ async (
      event,
    ) => {
      try {
        const f = event.target.files[0];
        if (!f) return;
        if (f.size > 20000000) throw Error("World file exceeds 20 MB.");
        const next = FrontierWorld.validate(JSON.parse(await f.text()));
        world = next;
        $("seed").value = world.seed;
        history = [];
        editor.choose("");
        restart();
        log("World and events imported.");
      } catch (error) {
        log("Import rejected: " + error.message);
      } finally {
        event.target.value = "";
      }
    };
  $("dialogueChoices").oncontextmenu =
    /* @function app.oncontextmenu.138 — Handles oncontextmenu within application input, simulation and editor coordination. Inputs: event. Uses: event prevent default; session cancel choice. */ (
      event,
    ) => {
      if (session.message?.choicePrompt) {
        event.preventDefault();
        session.cancelChoice();
      }
    };
  $("nextMessage").onclick =
    /* @function app.onclick.139 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: mouse paused; capture attempted. Uses: session next; mouse reset. */ () => {
      session.next();
      mousePaused = false;
      captureAttempted = false;
      mouse.reset();
    };
  $("volume").oninput =
    /* @function app.oninput.140 — Responds while an author edits a control value. Inputs: no explicit arguments; uses enclosing module state. Uses: audio set volume; number; $. Returns: audio set volume using number using $ using "volume" value. */ () =>
      audio.setVolume(Number($("volume").value));
  document.addEventListener(
    "pointerdown",
    /* @function app.callback.141 — Returns audio unlock using catch using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: audio unlock using catch; audio unlock. Returns: audio unlock using catch using a callback. */ () =>
      audio
        .unlock()
        .catch(
          /* @function app.callback.142 — Provides the callback for audio unlock using catch. Inputs: no explicit arguments; uses enclosing module state. */ () => {},
        ),
    {
      once: true,
    },
  );
  // Keyboard routing: prevent form typing from becoming movement, keep one-shot actions separate from held keys.
  document.addEventListener(
    "keydown",
    /* @function app.callback.143 — Returns audio unlock using catch using a callback. Inputs: no explicit arguments; uses enclosing module state. Uses: audio unlock using catch; audio unlock. Returns: audio unlock using catch using a callback. */ () =>
      audio
        .unlock()
        .catch(
          /* @function app.callback.144 — Provides the callback for audio unlock using catch. Inputs: no explicit arguments; uses enclosing module state. */ () => {},
        ),
    {
      once: true,
    },
  );
  // Clear motion baselines/held input and relinquish pointer lock. Optional pause stops gameplay while a menu is open.
  /* @function app.releaseLook.145 — Clear motion baselines/held input and relinquish pointer lock. Optional pause stops gameplay while a menu is open. Inputs: assignment pattern. Updates: mouse paused; capture attempted; play paused; drag. Uses: mouse reset; keys clear; document exit pointer lock. */ function releaseLook(
    pause = false,
  ) {
    mousePaused = true;
    captureAttempted = false;
    playPaused = pause;
    mouse.reset();
    keys.clear();
    drag = null;
    if (document.pointerLockElement) document.exitPointerLock();
  }
  // October 9, 2026: pause dismissal is independent of HUD mode and pointer-lock availability.
  /* @function app.resumePause — Inputs: none. Clears simulation pause and held input, hides pause immediately; restores look only when gameplay owns it. Returns nothing; no camera changes. Busy dialogue retains released look. */
  function resumePause() {
    playPaused = false;
    pausePanel.hidden = true;
    keys.clear();
    mouse.reset();
    view.focus({ preventScroll: true });
    if (!hudMode && !editing && !session.busy && $("inventoryPanel").hidden)
      captureLook();
  }
  // Acquire look only in gameplay. Preserve yaw/pitch and reset mouse deltas so restoring capture cannot snap the view.
  /* @function app.captureLook.146 — Acquire look only in gameplay. Preserve yaw/pitch and reset mouse deltas so restoring capture cannot snap the view. Inputs: no explicit arguments; uses enclosing module state. Updates: mouse paused; play paused; capture attempted; game pointer. Uses: $; mouse reset; view focus; audio unlock using catch. Returns: without a result. */ function captureLook() {
    if (hudMode || editing || session.busy || !$("inventoryPanel").hidden)
      return;
    mousePaused = false;
    playPaused = false;
    captureAttempted = true;
    if (world.interior?.mode === "fixed")
      game.pointer ||= {
        x: FrontierDisplay.get().width / 2,
        y: FrontierDisplay.get().height / 2,
      };
    mouse.reset();
    view.focus({
      preventScroll: true,
    });
    audio
      .unlock()
      .catch(
        /* @function app.callback.147 — Provides the callback for audio unlock using catch. Inputs: no explicit arguments; uses enclosing module state. */ () => {},
      );
    try {
      const request = view.requestPointerLock?.();
      request?.catch(
        /* @function app.callback.148 — Provides the callback for request catch. Inputs: no explicit arguments; uses enclosing module state. Uses: log. */ () => {
          log(
            "Mouse look active over the view; pointer capture unavailable here.",
          );
        },
      );
    } catch {
      log("Mouse look active over the view; pointer capture unavailable here.");
    }
  }
  // Apply mouse sensitivity and bounded pitch. Keep limits consistent with gamepad input and framing tests.
  /* @function app.rotate.149 — Apply mouse sensitivity and bounded pitch. Keep limits consistent with gamepad input and framing tests. Inputs: dx; dy. Updates: game camera yaw; game camera pitch. Uses: frontier parameters get; clamp pitch. Returns: without a result. */ function rotate(
    dx,
    dy,
  ) {
    if (world.interior?.mode === "fixed") return;
    game.camera.yaw += dx * FrontierParameters.get(world, "mouseYaw");
    game.camera.pitch = clampPitch(
      game.camera.pitch - dy * FrontierParameters.get(world, "mousePitch"),
    );
  }
  $("mouseLook").onclick = captureLook;
  // October 10, 2026: transition presentation owns input, including external HUD controls.
  document.addEventListener(
    "click",
    /* @function app.cutsceneClickGuard — Inputs: click event. Cancels all authoring/HUD clicks during map presentation; no world mutation. */ (
      event,
    ) => {
      if (sceneTransition.busy) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true,
  );
  document.addEventListener(
    "wheel",
    /* @function app.cutsceneWheelGuard — Inputs: wheel event. Stops zoom and scroll during cinematic transfer; no effects otherwise. */ (
      event,
    ) => {
      if (sceneTransition.busy) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    { capture: true, passive: false },
  );
  const form =
    /* @function app.form.150 — Returns /INPUT|SELECT|TEXTAREA|BUTTON/ test using event target tag name. Inputs: event. Uses: /INPUT|SELECT|TEXTAREA|BUTTON/ test. Returns: /INPUT|SELECT|TEXTAREA|BUTTON/ test using event target tag name. */ (
      event,
    ) => /INPUT|SELECT|TEXTAREA|BUTTON/.test(event.target.tagName);
  document.addEventListener(
    "keydown",
    /* @function app.callback.151 — Provides the callback for document add event listener. Inputs: event. Updates: $ using "weaponProfile" value. Uses: number input controller key; event key to lower case; event prevent default; event stop propagation. Returns: without a result; without a result. */ (
      event,
    ) => {
      // Test 5: text/tool keys in the tile dialog never trigger gameplay/HUD
      // shortcuts. Escape keeps native dialog behavior; F2 explicitly exits it.
      if (document.getElementById("tileRoomWindow")?.open && event.key !== "F2") return;
      if (
        numberInputController &&
        !editing &&
        numberInputController.key(event.key.toLowerCase())
      ) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (session.message?.choicePrompt && !editing) {
        const k = event.key.toLowerCase(),
          choices = $("dialogueChoices"),
          buttons = [...choices.querySelectorAll("button")];
        if (["arrowup", "arrowdown", "enter", "escape"].includes(k)) {
          event.preventDefault();
          event.stopPropagation();
          if (k === "escape") session.cancelChoice();
          else if (k === "enter") {
            const i = buttons.indexOf(document.activeElement);
            if (i >= 0) session.choose(i);
          } else {
            const current = buttons.indexOf(document.activeElement),
              i =
                current < 0
                  ? k === "arrowdown"
                    ? 0
                    : buttons.length - 1
                  : (current + (k === "arrowdown" ? 1 : -1) + buttons.length) %
                    buttons.length;
            buttons[i]?.focus();
          }
          return;
        }
      }
      if (event.key === "Escape" && playPaused && !event.repeat) {
        event.preventDefault();
        resumePause();
        return;
      }
      if (
        form(event) &&
        !["p", "P", "F2"].includes(event.key) &&
        !(event.key.toLowerCase() === "i" && !$("inventoryPanel").hidden)
      )
        return;
      const key = event.key.toLowerCase();
      // October 9: skip before Escape's ordinary pause handling, otherwise a paused
      // simulation could leave the transition frozen with its overlay showing.
      if (sceneTransition.busy) {
        event.preventDefault();
        keys.clear();
        mouse.reset();
        return;
      } // October 10: cutscenes accept no gameplay shortcuts or skip.
      if ([" ", "arrowleft", "arrowright"].includes(key))
        event.preventDefault();
      if (!event.repeat) {
        if (key === "escape") {
          if (session.message?.choicePrompt) {
            event.preventDefault();
            session.cancelChoice();
            return;
          }
          releaseLook(!editing);
        }
        if (key === "p") toggleHUD();
        if (key === "f2") {
          event.preventDefault();
          mode();
        }
        if (key === "i") inventoryToggle();
        if (key === "t" && !editing && !session.busy) $("remoteAsk").onclick();
        if (!editing && !session.busy && (key === "1" || key === "2")) {
          PhanicomABS.equip(game, key === "1" ? "handgun" : "starter-melee");
          $("weaponProfile").value = game.player.weapon.id;
        }
        if (key === "v") $("camera").click();
        if (key === " " && !editing && !session.busy)
          MF.toggleHolster(game, game.ui);
        if (key === "r" && !editing && !session.busy) MF.reload(game, game.ui);
        if (key === "f") shoot();
        if (
          key === "e" &&
          (world.flight?.mode || "ground") === "ground" &&
          !editing &&
          !playPaused &&
          !session.busy
        )
          FrontierTerrain.jump(game.player, world);
        if (key === "enter" && session.message) $("nextMessage").click();
      }
      keys.add(key);
    },
  );
  document.addEventListener(
    "keyup",
    /* @function app.callback.152 — Returns keys delete using event key to lower case using . Inputs: event. Uses: keys delete; event key to lower case. Returns: keys delete using event key to lower case using . */ (
      event,
    ) => keys.delete(event.key.toLowerCase()),
  );
  window.addEventListener(
    "blur",
    /* @function app.callback.153 — Returns release look using . Inputs: no explicit arguments; uses enclosing module state. Uses: release look. Returns: release look using . */ () =>
      releaseLook(),
  );
  hubWorkbench = FrontierHubWorkbench.create({
    world:
      /* @function app.hubWorld — Inputs: none. Returns live authored world, no effects. */ () =>
        world,
    game: /* @function app.hubGame — Inputs: none. Returns live runtime; no effects. */ () =>
      game,
    session:
      /* @function app.hubSession — Inputs: none. Returns event session; no effects. */ () =>
        session,
    state:
      /* @function app.hubState — Inputs: none. Returns session-owned compact store; no effects. */ () =>
        hubState,
    map: /* @function app.hubMap — Inputs: none. Returns stable active cell ID; no effects. */ () =>
      activeRuntimeMap,
    cellPolicy:
      /* @function app.hubCellPolicy — Inputs: stable cell ID. Returns validated cleanup settings from its authored map, or undefined if removed. Reads only that cell; avoids copying the entire map/model library during periodic cleanup. Errors propagate for invalid authored policy. */ (
        id,
      ) => {
        const record = mapLibrary.get(id);
        return record
          ? FrontierHubState.settings(record.world.cell)
          : undefined;
      },
    maps: /* @function app.hubMaps — Inputs: none. Returns copied project snapshot; authoring synchronization is owned by map library. */ () =>
      mapLibrary.snapshot(),
    editor:
      /* @function app.hubEditor — Inputs: none. Returns existing undo/draft event editor. */ () =>
        editor,
    templates:
      /* @function app.hubTemplates — Inputs: none. Returns copied reusable bank. */ () =>
        mapLibrary.templateBank().snapshot(),
    templateBank:
      /* @function app.hubTemplateBank — Inputs: none. Returns compiled immutable bank. */ () =>
        mapLibrary.templateBank(),
    mutate,
    log,
    travel: attemptTravel,
    pause:
      /* @function app.hubPause — Inputs: pause flag. Releases look and gates simulation while storage is open; returning leaves mouse released. */ (
        pause,
      ) => releaseLook(pause),
    preview:
      /* @function app.hubPreview — Inputs: door configuration. Runs isolated presentation without transfer. */ (
        config,
      ) => doorPresentation.preview(config),
  });
  // October 12: hub storage/drop logic remains shared gameplay; its cell-edit
  // buttons and context authoring bindings are installed only in the editor.
  if (!window.FRONTIER_RUNTIME_ONLY) {
    const hubTools = document.createElement("div");
    hubTools.className = "hubActions";
    for (const [label, action] of [
      ["Cell settings / arrivals", hubWorkbench.cellSettings],
      ["Cell diagnostics", hubWorkbench.diagnostics],
    ]) {
      const b = document.createElement("button");
      b.textContent = label;
      b.onclick =
        /* @function app.hubToolAction — Inputs: click unused. Opens on-demand authoring/diagnostic UI; errors shown once. */ () => {
          try {
            action();
          } catch (error) {
            log(error.message);
          }
        };
      hubTools.append(b);
    }
    $("edit").parentElement.append(hubTools);
    FrontierEventContext.install({
      hub: hubWorkbench,
      view,
      world:
        /* @function app.world.154 — Returns world. Inputs: no explicit arguments; uses enclosing module state. Returns: world. */ () =>
          world,
      editor:
        /* @function app.editor.155 — Returns editor. Inputs: no explicit arguments; uses enclosing module state. Returns: editor. */ () =>
          editor,
      editing:
        /* @function app.editing.156 — Returns editing. Inputs: no explicit arguments; uses enclosing module state. Returns: editing. */ () =>
          editing,
    });
  }
  view.addEventListener(
    "contextmenu",
    /* @function app.callback.157 — Returns event prevent default using . Inputs: event. Uses: event prevent default. Returns: event prevent default using . */ (
      event,
    ) => event.preventDefault(),
  );
  view.addEventListener(
    "pointerenter",
    /* @function app.callback.158 — Returns mouse reset using . Inputs: no explicit arguments; uses enclosing module state. Uses: mouse reset. Returns: mouse reset using . */ () =>
      mouse.reset(),
  );
  view.addEventListener(
    "pointerleave",
    /* @function app.callback.159 — Provides the callback for view add event listener. Inputs: no explicit arguments; uses enclosing module state. Uses: mouse reset. */ () => {
      if (document.pointerLockElement !== view) mouse.reset();
    },
  );
  // The first gameplay click captures look without firing. Editor gestures select/place/drag independently of gameplay capture.
  // Middle-click is not a game action. Suppress Chromium's native autoscroll
  // before it captures input; discard held movement/drag state defensively.
  const suppressMiddle =
    /* @function app.suppressMiddle.160 — Handles suppress middle within application input, simulation and editor coordination. Inputs: event. Updates: drag. Uses: event prevent default; event stop immediate propagation; keys clear; mouse reset. Returns: without a result. */ (
      event,
    ) => {
      if (event.button !== 1) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      keys.clear();
      drag = null;
      mouse.reset();
    };
  for (const type of ["pointerdown", "mousedown", "auxclick"])
    $("viewport").addEventListener(type, suppressMiddle, {
      capture: true,
      passive: false,
    });
  view.addEventListener(
    "pointerdown",
    /* @function app.callback.161 — Provides the callback for view add event listener. Inputs: event. Updates: game pointer; drag; drag brush; drag point handled. Uses: screen point; view focus; $; frontier render pick. Returns: without a result; without a result. */ (
      event,
    ) => {
      if (
        world.interior?.mode === "fixed" &&
        !editing &&
        document.pointerLockElement !== view
      )
        game.pointer = screenPoint(event);
      view.focus({
        preventScroll: true,
      });
      if (session.busy && !editing) return;
      const activateOnly =
        !hudMode &&
        !editing &&
        event.button === 0 &&
        (mousePaused || !captureAttempted);
      drag = {
        x: event.clientX,
        y: event.clientY,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
        button: event.button,
        activateOnly,
        moveId:
          editing && event.button === 0 && $("sceneTool").value === "select"
            ? FrontierRender.pick(
                game,
                screenPoint(event).x,
                screenPoint(event).y,
              )?.id || null
            : null,
      };
      if (activateOnly) captureLook();
      if (editing && event.button === 0 && terrainTools.active()) {
        const p = screenPoint(event);
        if (terrainTools.begin(FrontierRender.groundPoint(game, p.x, p.y))) {
          drag.brush = true;
          view.setPointerCapture(event.pointerId);
          return;
        }
      }
      if (editing) {
        if (drag.moveId) editor.choose(drag.moveId);
        view.setPointerCapture(event.pointerId);
      }
      // Point-mode actions execute on press, while the hover target is stable.
      // Capture retains button delivery even when a device or the pointer moves.
      if (hudMode && !editing && !playPaused) {
        game.pointer = screenPoint(event);
        drag.pointHandled = true;
        view.setPointerCapture(event.pointerId);
        if (event.button === 0) interact(game.pointer);
        if (event.button === 2) inspect(game.pointer);
      }
    },
  );
  // Captured gameplay uses relative deltas; authoring uses right-drag and a projected ground ghost.
  view.addEventListener(
    "pointermove",
    /* @function app.callback.162 — Provides the callback for view add event listener. Inputs: event. Updates: game pointer; game brush ghost; drag moved; game drag ghost; drag x. Uses: view get bounding client rect; screen point; mouse motion; rotate. Returns: without a result; without a result. */ (
      event,
    ) => {
      if (world.interior?.mode === "fixed" && !editing) {
        if (document.pointerLockElement === view) {
          const bounds = view.getBoundingClientRect(),
            point = game.pointer || {
              x: FrontierDisplay.get().width / 2,
              y: FrontierDisplay.get().height / 2,
            };
          game.pointer = {
            x: Math.max(
              0,
              Math.min(
                FrontierDisplay.get().width,
                point.x +
                  (event.movementX * FrontierDisplay.get().width) /
                    bounds.width,
              ),
            ),
            y: Math.max(
              0,
              Math.min(
                FrontierDisplay.get().height,
                point.y +
                  (event.movementY * FrontierDisplay.get().height) /
                    bounds.height,
              ),
            ),
          };
        } else game.pointer = screenPoint(event);
        return;
      }
      if (hudMode && !editing) {
        game.pointer = screenPoint(event);
        return;
      }
      if (!editing) {
        const delta = mouse.motion(
          event,
          document.pointerLockElement === view,
          !mousePaused && !playPaused && !session.busy,
        );
        rotate(delta.x, delta.y);
        return;
      }
      if (terrainTools.active()) {
        const point = screenPoint(event);
        const ground = FrontierRender.groundPoint(game, point.x, point.y);
        game.brushGhost = ground
          ? { ...ground, radius: Number($("brushRadius").value) || 3 }
          : null;
      } else game.brushGhost = null;
      if (!drag) return;
      if (drag.brush) {
        const p = screenPoint(event);
        terrainTools.move(FrontierRender.groundPoint(game, p.x, p.y));
        return;
      }
      if (
        Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 4
      ) {
        drag.moved = true;
        FrontierEventContext.close();
      }
      if (drag.moveId) {
        const point = screenPoint(event),
          p = FrontierRender.groundPoint(game, point.x, point.y);
        game.dragGhost = p
          ? {
              ...p,
              id: drag.moveId,
            }
          : null;
      } else if (drag.button === 2)
        rotate((event.clientX - drag.x) * 2, (event.clientY - drag.y) * 2);
      drag.x = event.clientX;
      drag.y = event.clientY;
    },
  );
  // Commit the completed gesture once; canceled input/activation-only clicks cannot fire or pick up.
  view.addEventListener(
    "pointerup",
    /* @function app.callback.163 — Provides the callback for view add event listener. Inputs: event. Updates: drag; game drag ghost. Uses: terrain tools end; screen point; move object; $. Returns: without a result; without a result. */ (
      event,
    ) => {
      if (!drag) return;
      if (drag.brush) {
        terrainTools.end();
        drag = null;
        return;
      }
      const point = screenPoint(event);
      if (editing && drag.moved && drag.moveId && game.dragGhost)
        moveObject(drag.moveId, game.dragGhost.x, game.dragGhost.y);
      else if (editing && !drag.moved && drag.button === 0) {
        if ($("sceneTool").value === "select") {
          editor.choose(FrontierRender.pick(game, point.x, point.y)?.id || "");
          preview();
        } else place(point);
      } else if (
        !editing &&
        !drag.pointHandled &&
        !drag.activateOnly &&
        !playPaused
      ) {
        if (drag.button === 0) {
          if (hudMode) interact(point);
          else if (!game.player.holstered) shoot();
        }
        if (hudMode && drag.button === 2) inspect(point);
      }
      if (editing && !drag.moved && drag.button === 2) {
        const ground = FrontierRender.groundPoint(game, point.x, point.y),
          picked = FrontierRender.pick(game, point.x, point.y, true);
        FrontierEventContext.open({
          clientX: event.clientX,
          clientY: event.clientY,
          point: ground,
          eventId: world.events.some(
            /* @function app.callback.164 — Returns e id equals chain. Inputs: e. Returns: e id equals chain. */ (
              e,
            ) => e.id === picked?.id,
          )
            ? picked.id
            : null,
        });
      }
      game.dragGhost = null;
      drag = null;
    },
  );
  view.addEventListener(
    "pointercancel",
    /* @function app.callback.165 — Provides the callback for view add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: drag; game drag ghost. Uses: terrain tools end. */ () => {
      terrainTools?.end(true);
      drag = null;
      game.dragGhost = null;
    },
  );
  // Capture changes clear baseline/held keys. Window blur and Escape deliberately leave the mouse released.
  document.addEventListener(
    "pointerlockchange",
    /* @function app.callback.166 — Provides the callback for document add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: drag; mouse paused; capture attempted. Uses: keys clear; mouse reset. */ () => {
      if (!hudMode) drag = null;
      keys.clear();
      mouse.reset();
      if (document.pointerLockElement === view) {
        mousePaused = false;
        captureAttempted = true;
      } else if (!editing && !session.busy) {
        mousePaused = true;
        captureAttempted = false;
      }
    },
  );
  document.addEventListener(
    "pointerlockerror",
    /* @function app.callback.167 — Provides the callback for document add event listener. Inputs: no explicit arguments; uses enclosing module state. Updates: mouse paused. Uses: log. */ () => {
      if (!editing && !session.busy) {
        mousePaused = false;
        log(
          "Mouse look active over the view; click capture is unavailable in this browser.",
        );
      }
    },
  );
  // October 14, 2026: transient zoom targets belong to one camera; they are not saved project settings.
  let zoomIntent = null;
  view.addEventListener(
    "wheel",
    /* October 14 current zoom contract: wheel units normalize to pixels, accumulate bounded transient targets, and ease during simulation; pause/cutscenes ignore wheel. Existing direct-step description is historical. */
    /* @function app.callback.168 — Provides the callback for view add event listener. Inputs: event. Updates: game camera room zoom; game camera distance. Uses: event prevent default; frontier parameters get. Returns: without a result; without a result. */ (
      event,
    ) => {
      event.preventDefault();
      if (playPaused || sceneTransition.busy) return;
      const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? view.clientHeight : 1);
      const prior = zoomIntent?.camera === game.camera ? zoomIntent : null;
      if (world.interior?.mode === "fixed") {
        const target = Math.max(
          1,
          Math.min(
            3,
            (prior?.roomZoom ?? game.camera.roomZoom ?? 1) * Math.exp(-pixels * 0.0007),
          ),
        );
        zoomIntent = { camera: game.camera, roomZoom: target };
        return;
      }
      if (hudMode) return;
      const target = Math.max(
        FrontierParameters.get(world, "zoomMin"),
        Math.min(
          FrontierParameters.get(world, "zoomMax"),
          (prior?.distance ?? game.camera.distance) + pixels * 0.002,
        ),
      );
      zoomIntent = { camera: game.camera, distance: target };
    },
    {
      passive: false,
    },
  );
  // Ordered simulation: poll input → pause gate → locomotion/ground → events → combat/effects → NPC attacks. dt is seconds and capped by frame().
  /* @function app.update.169 — Ordered simulation: poll input → pause gate → locomotion/ground → events → combat/effects → NPC attacks. dt is seconds and capped by frame(). Inputs: dt. Updates: pending travel; travel cooldown; game elapsed; pads; $ using "controllerStatus" text content. Uses: screen fade update; screen flash update; screen shake update; screen tone update. Returns: without a result; without a result. */ function update(
    dt,
  ) {
    if (sceneTransition.busy) {
      keys.clear();
      mouse.reset();
    } // Clear held actions throughout transitions; update still advances.
    screenFade.update(dt);
    screenFlash.update(dt);
    screenShake.update(dt);
    screenTone.update(dt);
    try {
      if (sceneTransition.update(dt)) return;
    } catch (error) {
      log("Map transition failed: " + error.message);
      return;
    }
    /* October 14: frame-rate-independent easing retains the locked sprite presentation and existing collision camera path. Settling drops transient target; camera replacement cancels stale intent. */
    if (zoomIntent && !playPaused) {
      if (zoomIntent.camera !== game.camera) zoomIntent = null;
      else {
        const key = zoomIntent.roomZoom !== undefined ? "roomZoom" : "distance";
        const current = game.camera[key] ?? 1;
        const target = zoomIntent[key];
        game.camera[key] = current + (target - current) * (1 - Math.exp(-12 * dt));
        if (Math.abs(target - game.camera[key]) < 0.0001) {
          game.camera[key] = target;
          zoomIntent = null;
        }
      }
    }
    if (pendingTravel) {
      const t = pendingTravel;
      pendingTravel = null;
      sceneTransition.reserve({
        ...t,
        fade: 0,
        effect: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "fade"
          : t.effect && t.effect !== "default"
            ? t.effect
            : transitionEffect(),
        door: t.door || world.doorTransition,
      });
      keys.clear();
      return;
    }
    travelCooldown = Math.max(0, travelCooldown - dt);
    if (document.getElementById("normalWorkbench")?.open) return;
    // Test 5: the separate tile window owns keyboard/pointer authoring input.
    // Keep its draw loop active while preventing camera/player drift behind it.
    if (document.getElementById("tileRoomWindow")?.open) { keys.clear(); return; }
    game.elapsed += dt;
    const field = /INPUT|SELECT|TEXTAREA/.test(
      document.activeElement?.tagName || "",
    );
    let pads = [];
    try {
      pads = navigator.getGamepads?.() || [];
    } catch {}
    const pad = padReader.poll(pads, !editing && !field && document.hasFocus());
    $("controllerStatus").textContent = pad.connected
      ? "Controller connected · standard layout"
      : "Controller: connect and press a button.";
    for (const action of pad.actions) {
      if (action === "pause") {
        playPaused = !playPaused;
        releaseLook(playPaused);
      } else if (action === "interact") {
        if (session.message) $("nextMessage").click();
        else if (!playPaused)
          interact({
            x: FrontierDisplay.get().width / 2,
            y: 96,
          });
      } else if (!playPaused && !session.busy) {
        if (action === "fire") shoot();
        if (action === "reload") MF.reload(game, game.ui);
        if (action === "holster") MF.toggleHolster(game, game.ui);
        if (action === "camera") $("camera").click();
        if (action === "jump") FrontierTerrain.jump(game.player, world);
      }
    }
    if (playPaused) return;
    if (!editing) hubWorkbench?.tick(dt);
    if (!session.busy && !editing && !hudMode) {
      if (world.interior?.mode !== "fixed")
        game.camera.yaw += pad.look.x * 2.2 * dt;
      if (world.interior?.mode !== "fixed")
        game.camera.pitch = clampPitch(
          game.camera.pitch - pad.look.y * 1.5 * dt,
        );
    }
    const movementKeys = new Set(keys);
    if (pad.sprint) movementKeys.add("shift");
    if (
      document.activeElement &&
      /INPUT|SELECT|TEXTAREA|BUTTON/.test(document.activeElement.tagName)
    ) {
      keys.clear();
      movementKeys.clear();
    }
    if (!editing && session.busy) {
      game.player.vx = game.player.vy = game.player.walkTime = 0;
      FrontierCerebral.update(game, dt);
      FrontierPartyCombat.advanceCooldowns(FrontierActivity.actors(game), dt);
      session.update(dt, game.player);
      FrontierModelVolumes.update(game, session);
      if ((world.flight?.mode || "ground") === "ground")
        FrontierTerrain.ground(
          game.player,
          world,
          0,
          FrontierActivity.query(
            game,
            game.player.x - 2,
            game.player.y - 2,
            game.player.x + 2,
            game.player.y + 2,
            true,
          ),
          editing ? null : game,
        );
      preview();
      return;
    }
    if (!editing && game.player.hp <= 0) {
      FrontierAggro.update(game, dt);
      PhanicomBlood.update(game, dt);
      return;
    }
    if (world.interior?.mode !== "fixed" && !hudMode && keys.has("arrowleft"))
      game.camera.yaw -= dt * 1.8;
    if (world.interior?.mode !== "fixed" && !hudMode && keys.has("arrowright"))
      game.camera.yaw += dt * 1.8;
    // October 14: editor navigation is noclip; it never authors a player flight profile.
    game.editorFlight = editing;
    if (editing) {
      const speed = FrontierParameters.get(world, "playerSpeed") * (movementKeys.has("shift") ? 2 : 1);
      // October 14: absent controller jump is undefined; boolean normalization
      // prevents NaN altitude on release and ceiling recovery on Playtest.
      const up = Number(!!(movementKeys.has("e") || movementKeys.has(" ") || pad.jump));
      const down = Number(movementKeys.has("q"));
      game.player.z = (game.player.z || 0) + (up - down) * speed * dt;
      // October 14: clear the actual terrain velocity, not an unused vz field.
      game.player.verticalVelocity = 0;
      game.playerStep = null;
      game.player.grounded = false;
    }
    if (!session.playerRouteActive)
      MF.frontierMovement.movePlayer(
        game,
        movementKeys,
        dt,
        editing
          ? /* @function app.callback.170 — Returns x is less than 0.5 or y is less than 0.5 or x is greater than world width or the fallback world size minus 0.5 or y is greater than world height or the fallback world size minus 0.5. Inputs: x; y. Returns: x is less than 0.5 or y is less than 0.5 or x is greater than world width or the fallback world size minus 0.5 or y is greater than world height or the fallback world size minus 0.5. */ /* @function app.editorNoclip — Inputs: proposed XY ignored. Returns false so authoring navigation passes geometry and map-edge bounds; no authored mutation. Playtest uses its existing collision branch. */ (x, y) => false
          : /* @function app.callback.171 — Returns frontier terrain blocked using game, x, y. Inputs: x; y; r. Uses: frontier terrain blocked. Returns: frontier terrain blocked using game, x, y. */ (
              x,
              y,
              r,
            ) => FrontierTerrain.blocked(game, x, y, r),
        pad.move,
      );
    if (
      !editing && !FrontierFlight.update(
        game.player,
        world,
        dt,
        (movementKeys.has("e") ? 1 : 0) - (movementKeys.has("q") ? 1 : 0),
      )
    )
      FrontierTerrain.ground(
        game.player,
        world,
        dt,
        editing
          ? []
          : FrontierActivity.query(
              game,
              game.player.x - 2,
              game.player.y - 2,
              game.player.x + 2,
              game.player.y + 2,
              true,
            ),
        editing ? null : game,
      );
    if (movementKeys.has("shift")) keys.add("ShiftLeft");
    else keys.delete("ShiftLeft");
    footsteps.update(dt);
    if (editing) return;
    if (!session.busy) {
      for (const exit of world.interior?.exits || world.travel?.exits || []) {
        const inside =
          Math.hypot(exit.x - game.player.x, exit.y - game.player.y) <
            exit.radius &&
          (!world.interior ||
            FrontierInterior.inside(world.interior.floor, exit.x, exit.y) ||
            !FrontierInterior.inside(
              world.interior.floor,
              game.player.x,
              game.player.y,
            ));
        if (!inside) exitTouched.delete(exit.id);
        else if (!exitTouched.has(exit.id) && !travelCooldown) {
          exitTouched.add(exit.id);
          attemptTravel(exit);
          if (pendingTravel) return;
        }
      }
    }
    // Movement controls facing; only the firing path aligns the armed sprite to aim.
    FrontierCerebral.update(game, dt);
    FrontierPartyCombat.advanceCooldowns(FrontierActivity.actors(game), dt);
    session.update(dt, game.player);
    FrontierModelVolumes.update(game, session);
    if ((world.flight?.mode || "ground") === "ground")
      FrontierTerrain.ground(
        game.player,
        world,
        0,
        FrontierActivity.query(
          game,
          game.player.x - 2,
          game.player.y - 2,
          game.player.x + 2,
          game.player.y + 2,
          true,
        ),
        editing ? null : game,
      );
    preview();
    if (session.busy) return;
    FrontierAggro.update(game, dt);
    PhanicomABS.update(
      game,
      dt,
      keys.has("f") ||
        pad.fireHeld ||
        (!hudMode && drag?.button === 0 && !drag.activateOnly),
    );
    MF.updateProjectiles(game, dt, game.ui);
    PhanicomBlood.update(game, dt);
    for (const e of FrontierActivity.actors(game)) {
      if (world.cell?.safe || e.kind !== "monster" || e.dead || !e.aggro) continue;
      const target = FrontierPartyCombat.target(game, e);
      if (!target) continue;
      const dx = target.x - e.x,
        dy = target.y - e.y,
        distance = Math.hypot(dx, dy);
      if (!e.behaviorOwned && distance > 0.85 && !e.stunTime)
        move(
          e,
          (dx / distance) * dt * 0.9,
          (dy / distance) * dt * 0.9,
          e.radius,
          e,
        );
      if (!e.eventId)
        e.z =
          FrontierTerrain.height(world, e.x, e.y) + (e.elevation || 0) * 0.3;
      if (
        e.combat &&
        distance < e.combat.range &&
        !e.attackTime &&
        !e.stunTime
      ) {
        e.facingX = dx / Math.max(0.01, distance);
        e.facingY = dy / Math.max(0.01, distance);
        const cfg = e.combat,
          w = {
            ...cfg,
            id: e.id + "-weapon",
            profileId: cfg.profileId,
            type: cfg.attack,
            magazineSize: 0,
            firingModel: cfg.attack === "hitscan" ? "hitscan" : "projectile",
            projectile: {
              speed: cfg.speed,
              radius: cfg.radius,
              range: cfg.range,
              lifetime: cfg.range / cfg.speed,
              tracerColor: cfg.tracerColor,
              tracerLife: cfg.tracerLife,
            },
          };
        PhanicomABS.pattern(
          game,
          e,
          w,
          {
            x: e.facingX,
            y: e.facingY,
          },
          game.ui,
        );
        PhanicomCombatCore.playGoldenEyeProfile(
          cfg.audioProfile,
          cfg.audioVolume,
        );
        e.attackTime = cfg.fireRate / 60;
      }
      if (!e.combat && distance < 1.05 && !e.attackTime && !e.stunTime) {
        MF.resolveProjectileImpact(
          game,
          {
            id: "sentinel-strike",
            ownerId: e.id,
            weaponId: "sentinel-melee",
            damage: 5,
            damageType: "melee",
            position: {
              x: target.x,
              y: target.y,
            },
          },
          {
            id: target.id,
            kind: "target",
          },
          game.ui,
        );
        e.attackTime = 1.2;
        log("Sentinel strikes for 5 damage.");
      }
    }
    for (const key of ["shotEffects", "muzzleFlashes", "particles"]) {
      game[key] = game[key].filter(
        /* @function app.callback.172 — Returns assignment is greater than 0. Inputs: e. Updates: e life. Returns: assignment is greater than 0. */ (
          e,
        ) => (e.life -= dt) > 0,
      );
      if (key === "particles")
        for (const e of game[key]) {
          e.x += e.vx * dt;
          e.y += e.vy * dt;
          e.z = Math.max(0, e.z + e.vz * dt * 20);
          e.vz -= dt * 9;
        }
    }
  }
  // Select the same directional animation frame used for drawing so muzzle points stay synchronized.
  // Browser animation clock. Draw world/HUD every visible frame; slower DOM labels update at 10Hz. Never reset camera to open/close a menu.
  /* October 13, 2026 — frame ownership contract: time is the animation clock in milliseconds; dt is capped simulation seconds. Updates and draws only the currently adopted game/world, not the authored map library. Inactive worlds keep records only. Periodic hub cleanup resolves bounded cell policies without full-project snapshots. Paused/editor/cinematic paths gate simulation and effects; drawing is skipped when an opaque door presentation owns the view. Exceptions in draw remain visible for diagnostics rather than silently substituting a scene. This does not promise constant-cost project Save/Load, which intentionally serializes state. */
  /* @function app.frame.173 — Browser animation clock. Draw world/HUD every visible frame; slower DOM labels update at 10Hz. Never reset camera to open/close a menu. Inputs: time. Updates: last; pause panel hidden; game next minimap; reticle style left; reticle style top. Uses: phanicom se begin frame; request animation frame; update; music update. Returns: without a result; without a result. */ function frame(
    time,
  ) {
    PhanicomSE.beginFrame();
    const dt = Math.min(0.05, (time - last) / 1000 || 0);
    last = time;
    if (document.visibilityState === "hidden") {
      requestAnimationFrame(frame);
      return;
    }
    update(dt);
    if (!editing) music.update(game);
    FrontierDeviceHUD.update(game);
    roomEditor?.draw();
    if (!editing && !playPaused) FrontierPlayerRecovery.remember(game);
    pausePanel.hidden =
      !playPaused ||
      editing ||
      !$("inventoryPanel").hidden ||
      !$("journalPanel").hidden;
    FrontierBreathing.tick(
      game,
      dt,
      playPaused || editing || sceneTransition.busy,
    );
    /* October 12, 2026: opaque door presentation retains the last world image beneath its canvas, avoiding hidden rasterization/uploads. Fade-in and melt still draw the destination normally. */
    if (!sceneTransition.ownsWorldView) {
      /* October 12: native effects append inside draw before GPU submission, using this frame's paused/cinematic-aware delta. */ game.effectDelta =
        playPaused || editing || sceneTransition.busy ? 0 : dt;
      FrontierRender.draw(view, game);
    }
    // October 10: optional screen breathing uses a separate CSS scale so camera/sprite geometry and shake translation remain unchanged.
    /* Superseded October 10, 2026: reference radial breathing is now a scene filter; CSS stretching is removed to keep HUD and pointer space stable. */ view.style.scale =
      "";
    if (!game.nextMinimap || game.elapsed >= game.nextMinimap) {
      FrontierRender.map($("map"), world, game, editing);
      game.nextMinimap = game.elapsed + 0.15;
    }
    FrontierInspection.update(hudMode);
    const reticle = $("crosshair"),
      fixed = world.interior?.mode === "fixed";
    /* October 10, 2026: the DOM aiming marker stays sharp but follows the warped world point. Its forward transform is the inverse of screenPoint's click sampling. */
    if (fixed && game.pointer) {
      const width = FrontierDisplay.get().width,
        point = game.breathingSnapshot
          ? FrontierBreathing.project(
              game.pointer.x / width,
              game.pointer.y / 480,
              width / 480,
              game.breathingSnapshot,
            )
          : { x: game.pointer.x / width, y: game.pointer.y / 480 };
      reticle.style.left = point.x * 100 + "%";
      reticle.style.top = point.y * 100 + "%";
    }
    if (time - (game.uiTime || 0) < 100) {
      requestAnimationFrame(frame);
      return;
    }
    game.uiTime = time;
    if (!$("inventoryPanel").hidden) inventoryRender();
    FrontierCursor.update(
      hudMode,
      game.player.holstered || !game.player.weapon,
      editing,
      playPaused ||
        session.busy ||
        !$("inventoryPanel").hidden ||
        !$("muzzlePanel").hidden,
      sceneTransition.busy,
    );
    if (document.activeElement !== weaponSpread) {
      weaponSpread.value = FrontierWeaponTuning.degrees(
        world,
        game.player.weapon,
      );
      weaponSpread.disabled = game.player.weapon.type === "melee";
    }
    $("gameFrame").classList.toggle(
      "roomAiming",
      world.interior?.mode === "fixed" &&
        !hudMode &&
        !editing &&
        !game.player.holstered,
    );
    if (!fixed) {
      reticle.style.left = "";
      reticle.style.top = "";
    }
    const barrel = FrontierMuzzle.barrel(game.player, game),
      origin = barrel && FrontierMuzzle.point(game.player, game);
    if (origin && !fixed) {
      const target = {
          x: origin.x + barrel.x * 60,
          y: origin.y + barrel.y * 60,
          z: origin.z + barrel.z * 60,
        },
        hit = MF.frontierSpatial.sweep(game, origin, target, 0, game.player.id),
        t = hit?.t ?? 1,
        p = FrontierRender.project(
          FrontierRender.camera(game),
          origin.x + (target.x - origin.x) * t,
          origin.y + (target.y - origin.y) * t,
          origin.z + (target.z - origin.z) * t,
        );
      if (p) {
        const width = FrontierDisplay.get().width,
          point = game.breathingSnapshot
            ? FrontierBreathing.project(
                p.x / width,
                p.y / 480,
                width / 480,
                game.breathingSnapshot,
              )
            : { x: p.x / width, y: p.y / 480 };
        reticle.style.left = point.x * 100 + "%";
        reticle.style.top = point.y * 100 + "%";
      }
    }
    const nearby = nearbyTarget();
    $("targetLabel").textContent = nearby
      ? nearby.event?.name || nearby.target.name || nearby.target.kind
      : "";
    $("hud").textContent =
      `BLOOD ${game.player.hp} / 100\n${game.player.holstered ? "HOLSTERED" : "9MM"}  ${game.player.ammoLoaded} / ${game.player.ammoReserve}   ·   ${editing ? "AUTHORING · WASD / RIGHT-DRAG" : playPaused ? "PAUSED · START / CLICK TO RESUME" : hudMode ? "POINT AND CLICK · P TO RETURN" : mousePaused ? "MOUSE RELEASED · CLICK TO RESUME" : "MOUSE LOOK · ESC TO RELEASE"}`;
    $("badge").lastElementChild.textContent =
      (world.interior?.mode === "fixed" ? "Fixed interior · " : "") +
      (game.camera.firstPerson ? "First person" : "Third person") +
      " · prototype " + window.FrontierVersion;
    if (world.interior)
      $("intro").textContent =
        world.interior.mode === "fixed"
          ? "Fixed-camera room. WASD moves; aim with the mouse and click to fire. P enables interaction. F2 → Room edits floor boundaries, blockers, furniture and map exits."
          : "Free-camera geometry room. WASD moves; mouse look and P mode remain available. F2 → Room builds boxes and edits collisions.";
    $("counts").textContent =
      world.objects.length +
      " objects · " +
      (world.events || []).length +
      " events · seed " +
      world.seed;
    requestAnimationFrame(frame);
  }
  let menuResume = false,
    askEvent;
  // Remember previous look ownership and freeze simulation before exposing cursor controls.
  /* @function app.openMenu.174 — Remember previous look ownership and freeze simulation before exposing cursor controls. Inputs: id. Updates: menu resume; $ using id hidden. Uses: release look; $. */ function openMenu(
    id,
  ) {
    menuResume = !mousePaused && !hudMode;
    releaseLook(true);
    $(id).hidden = false;
  }
  // Restore the previous gameplay/HUD mode without changing camera orientation.
  /* @function app.closeMenu.175 — Restore the previous gameplay/HUD mode without changing camera orientation. Inputs: id. Updates: $ using id hidden; play paused. Uses: $; capture look. */ function closeMenu(
    id,
  ) {
    $(id).hidden = true;
    if (menuResume && !hudMode) captureLook();
    else playPaused = false;
  }
  $("weaponProfile").replaceChildren(
    ...[...PhanicomABS.weapons].map(
      /* @function app.callback.176 — Returns a new option. Inputs: array pattern. Returns: a new option. */ ([
        id,
        w,
      ]) => new Option(w.name, id),
    ),
  );
  const spreadLabel = document.createElement("label");
  spreadLabel.textContent = "Weapon spread (degrees)";
  const weaponSpread = document.createElement("input");
  weaponSpread.id = "weaponSpread";
  weaponSpread.type = "number";
  weaponSpread.min = "0";
  weaponSpread.max = "30";
  weaponSpread.step = "0.1";
  weaponSpread.title =
    "Random angular deviation. Zero is perfectly accurate. Saved per weapon in this map.";
  spreadLabel.append(weaponSpread);
  $("weaponProfile").parentElement.after(spreadLabel);
  weaponSpread.onchange =
    /* @function app.onchange.177 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: world weapon spreads; weapon spread value. Uses: number; frontier weapon tuning validate; map library remember; log. */ () => {
      try {
        const value = Number(weaponSpread.value),
          id = game.player.weapon.id;
        world.weaponSpreads = FrontierWeaponTuning.validate({
          ...world.weaponSpreads,
          [id]: value,
        });
        mapLibrary?.remember();
        log("Weapon spread updated.");
      } catch (e) {
        log(e.message);
        weaponSpread.value = FrontierWeaponTuning.degrees(
          world,
          game.player.weapon,
        );
      }
    };
  $("weaponProfile").value = "handgun";
  $("skin")?.setAttribute("disabled", "");
  // Profile selector is a demo equipment surface. A future item/equipment editor can call the same equip API.
  $("weaponProfile").onchange =
    /* @function app.onchange.178 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: phanicom abs equip; $; view focus; log. */ () => {
      PhanicomABS.equip(game, $("weaponProfile").value);
      view.focus();
      log("Equipped " + game.player.weapon.name);
    };
  $("bloodType").onchange =
    /* @function app.onchange.179 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: phanicom blood set player type; $. Returns: phanicom blood set player type using $ using "bloodType" value. */ () =>
      PhanicomBlood.setPlayerType($("bloodType").value);
  $("testBlood").onclick =
    /* @function app.onclick.180 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: phanicom blood spray character. Returns: phanicom blood spray character using game player, a record containing count. */ () =>
      PhanicomBlood.sprayCharacter(game.player, {
        count: 24,
      });
  $("aimCalibration").onclick =
    /* @function app.onclick.181 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: $ using "openMuzzle" click; $. Returns: $ using "openMuzzle" click using . */ () =>
      $("openMuzzle").click();
  $("openMuzzle").onclick =
    /* @function app.onclick.182 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: open menu; $ using "muzzleFrame" content window post message; $; frontier muzzle export. */ () => {
      openMenu("muzzlePanel");
      $("muzzleFrame").contentWindow.postMessage(
        {
          type: "phanicom-muzzle-open",
          data: FrontierMuzzle.export(),
        },
        "*",
      );
    };
  $("muzzleClose").onclick =
    /* @function app.onclick.183 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: close menu. Returns: close menu using "muzzlePanel". */ () =>
      closeMenu("muzzlePanel");
  // Validate profiles before replacing them and persist a convenience copy locally. Export JSON for portable saves.
  /* @function app.applyMuzzles.184 — Validate profiles before replacing them and persist a convenience copy locally. Export JSON for portable saves. Inputs: data. Uses: frontier muzzle load; local storage set item; json stringify; frontier muzzle export. */ function applyMuzzles(
    data,
  ) {
    FrontierMuzzle.load(data);
    try {
      localStorage.setItem(
        "phanicom-muzzles-0.15.22",
        JSON.stringify(FrontierMuzzle.export()),
      );
    } catch {}
    log("Muzzle calibration applied.");
  }
  window.addEventListener(
    "message",
    /* @function app.callback.185 — Provides the callback for window add event listener. Inputs: event. Uses: $; apply muzzles; log. */ (
      event,
    ) => {
      if (
        event.source === $("muzzleFrame").contentWindow &&
        event.data?.type === "phanicom-muzzles"
      ) {
        try {
          applyMuzzles(event.data.data);
        } catch (e) {
          log(e.message);
        }
      }
    },
  );
  $("muzzleImport").onchange =
    /* @function app.onchange.186 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: apply muzzles; json parse; $ using "muzzleImport" files at 0 text; $. */ async () => {
      try {
        applyMuzzles(JSON.parse(await $("muzzleImport").files[0].text()));
      } catch (e) {
        log(e.message);
      }
    };
  // Prefer the pointed NPC; fall back to a nearby authored topic speaker within its reach. Cursor menu freezes camera/simulation.
  $("remoteAsk").hidden = true; // Ask remains available through NPC dialogue; no mismatched remote label.
  $("remoteAsk").onclick =
    /* @function app.onclick.187 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: ask event. Uses: nearby target; session events filter using a callback sort; session events filter; log. Returns: without a result. */ () => {
      const hit = nearbyTarget();
      askEvent = hit?.event;
      if (!askEvent?.topics?.length) {
        askEvent = session.events
          .filter(
            /* @function app.callback.188 — Returns chain and math hypot using e x minus game player x, e y minus game player y is at most e range. Inputs: e. Returns: chain and math hypot using e x minus game player x, e y minus game player y is at most e range. */ (
              e,
            ) =>
              e.topics?.length &&
              Math.hypot(e.x - game.player.x, e.y - game.player.y) <= e.range,
          )
          .sort(
            /* @function app.callback.189 — Returns math hypot using a x minus game player x, a y minus game player y minus math hypot using b x minus game player x, b y minus game player y. Inputs: a; b. Returns: math hypot using a x minus game player x, a y minus game player y minus math hypot using b x minus game player x, b y minus game player y. */ (
              a,
              b,
            ) =>
              Math.hypot(a.x - game.player.x, a.y - game.player.y) -
              Math.hypot(b.x - game.player.x, b.y - game.player.y),
          )[0];
      }
      if (!askEvent) {
        log("Move near a character with conversation topics.");
        return;
      }
      openMenu("askPanel");
      $("askInput").focus();
    };
  $("askClose").onclick =
    /* @function app.onclick.190 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: close menu. Returns: close menu using "askPanel". */ () =>
      closeMenu("askPanel");
  $("askForm").onsubmit =
    /* @function app.onsubmit.191 — Handles onsubmit within application input, simulation and editor coordination. Inputs: event. Uses: event prevent default; log; frontier parser ask; $. */ (
      event,
    ) => {
      event.preventDefault();
      log(
        askEvent.name +
          ": " +
          FrontierParser.ask(
            $("askInput").value,
            FrontierParser.compile(askEvent.topics),
            session.state,
          ),
      );
    };
  // Create a temporary JSON download URL and revoke it after the browser starts the download.
  /* @function app.download.192 — Create a temporary JSON download URL and revoke it after the browser starts the download. Inputs: data; name. Updates: a href; a download. Uses: document create element; url create object url; json stringify; a click. */ function download(
    data,
    name,
  ) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      }),
    );
    a.download = name;
    a.click();
    setTimeout(
      /* @function app.callback.193 — Returns url revoke object url using a href. Inputs: no explicit arguments; uses enclosing module state. Uses: url revoke object url. Returns: url revoke object url using a href. */ () =>
        URL.revokeObjectURL(a.href),
      1000,
    );
  }
  // Save persistent scalars/Map entries only; live weapon objects and effects are reconstructed, never serialized wholesale.
  $("saveCombat").onclick =
    /* @function app.onclick.194 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: journey set; capture runtime; download; map library snapshot. */ () => {
      journey.set(activeRuntimeMap, captureRuntime());
      download(
        {
          schema: "phanicom-playtest/1",
          hubs: hubState,
          world,
          project: mapLibrary.snapshot(),
          journey: [...journey],
          journal: [...journal],
          player: {
            x: game.player.x,
            y: game.player.y,
            z: game.player.z ?? 0,
            holstered: game.player.holstered,
            cerebral: game.player.cerebral,
            magazines: {
              ...game.player.magazines,
              [game.player.weapon.id]: game.player.ammoLoaded,
            },
            ...PhanicomABS.exportState(game),
          },
          ...FrontierEventState.capture(session.state),
          blood: PhanicomBlood.exportState(),
          switches: [...session.state.switches],
          variables: [...session.state.variables],
          selfSwitches: [...session.state.selfSwitches],
          inventory: [...session.state.inventory],
        },
        "playtest-save.json",
      );
    };
  // Validate the entire save before replacing the running world. Weapon IDs
  // are serialized strings; equip reconstructs the object after scalar restore.
  $("loadCombat").onchange =
    /* @function app.onchange.195 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Updates: world; active runtime map; game player holstered; game death mode; session state at key. Uses: $; error; frontier save validate; json parse. Returns: without a result. */ async () => {
      try {
        const loadFromPause = !pausePanel.hidden;
        const file = $("loadCombat").files[0];
        if (!file) return;
        if (file.size > 20000000) throw Error("Playtest save exceeds 20 MB.");
        const save = FrontierSave.validate(JSON.parse(await file.text()));
        // Backend constraints are checked before any authored/runtime adoption.
        if (
          !FrontierPixi.toneSupported() &&
          (save.journey || []).some(
            /* @function app.callback.196 — Returns state screen tone and state screen tone value some using a callback or state screen tone elapsed is less than state screen tone duration and state screen tone target some using a callback. Inputs: array pattern. Uses: state screen tone value some; state screen tone target some. Returns: state screen tone and state screen tone value some using a callback or state screen tone elapsed is less than state screen tone duration and state screen tone target some using a callback. */ ([
              ,
              state,
            ]) =>
              state.screenTone &&
              (state.screenTone.value.some(
                /* @function app.callback.197 — Returns v does not equal 0. Inputs: v. Returns: v does not equal 0. */ (
                  v,
                ) => v !== 0,
              ) ||
                (state.screenTone.elapsed < state.screenTone.duration &&
                  state.screenTone.target.some(
                    /* @function app.callback.198 — Returns v does not equal 0. Inputs: v. Returns: v does not equal 0. */ (
                      v,
                    ) => v !== 0,
                  ))),
          )
        )
          throw Error(
            "This saved Tint Screen requires the Pixi GPU renderer. The current playtest was retained.",
          );
        if (save.project) mapLibrary.restore(save.project);
        world = save.world;
        restart();
        activeRuntimeMap = mapLibrary.active;
        hubState = FrontierHubState.validate(save.hubs);
        journey.clear();
        for (const [id, state] of save.journey || []) journey.set(id, state);
        journal.clear();
        for (const [id, text] of save.journal || []) journal.set(id, text);
        journalRender();
        if (journey.has(activeRuntimeMap))
          restoreRuntime(journey.get(activeRuntimeMap), null);
        const { weapon, deathMode, ...scalars } = save.player;
        Object.assign(game.player, scalars);
        PhanicomABS.equip(game, weapon);
        game.player.holstered = save.player.holstered;
        game.deathMode = deathMode;
        PhanicomBlood.restoreState(save.blood);
        for (const key of [
          "switches",
          "variables",
          "selfSwitches",
          "inventory",
        ])
          session.state[key] = new Map(save[key]);
        FrontierEventState.restore(session.state, save);
        game.sceneSignature = null;
        preview();
        FrontierTerrain.ground(game.player, world, 0, [], game);
        $("weaponProfile").value = weapon;
        // October 9: a pause-menu load stays paused until explicitly resumed.
        if (loadFromPause) releaseLook(true);
        log("Playtest restored.");
      } catch (e) {
        log(e.message);
      } finally {
        $("loadCombat").value = "";
      }
    };
  try {
    const saved = localStorage.getItem("phanicom-muzzles-0.15.22");
    if (saved) FrontierMuzzle.load(JSON.parse(saved));
  } catch {}
  // Project rules are authored separately from event pages. Applying uses the
  // same validated/undoable mutation path as other editor changes.
  /* @function app.clampPitch.199 — same validated/undoable mutation path as other editor changes. Inputs: value. Uses: frontier parameters get. Returns: math max using frontier parameters get using world, "aimMin" multiplied by math pi divided by 180, math min using frontier parameters get using world, "aimMax" multiplied by math pi divided by 180, value. */ function clampPitch(
    value,
  ) {
    return Math.max(
      (FrontierParameters.get(world, "aimMin") * Math.PI) / 180,
      Math.min(
        (FrontierParameters.get(world, "aimMax") * Math.PI) / 180,
        value,
      ),
    );
  }
  for (const [key, field] of Object.entries(FrontierParameters.fields)) {
    const label = document.createElement("label"),
      input = document.createElement("input");
    label.textContent = field.label;
    input.id = "parameter-" + key;
    input.type = "number";
    input.min = field.min;
    input.max = field.max;
    input.step = field.step;
    label.append(input);
    $("globalParameters").append(label);
  }
  /* @function app.cerebralRefresh.200 — Handles cerebral refresh within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "cerebral-" plus k value; $ using "cerebral-threshold" plus i value; $ using "melee-" plus k value. Uses: $. */ function cerebralRefresh() {
    const r = world.cerebral || FrontierCerebral.defaults;
    for (const k of ["max", "amount", "interval", "radius", "transition"])
      $("cerebral-" + k).value = r[k];
    for (let i = 0; i < 3; i++)
      $("cerebral-threshold" + i).value = r.thresholds[i];
    for (const k of [
      "name",
      "damage",
      "range",
      "arc",
      "cooldown",
      "spriteProfile",
    ])
      $("melee-" + k).value = r.melee[k];
  }
  /* @function app.parametersRefresh.201 — Handles parameters refresh within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Updates: $ using "vectorPreset" value; $ using "vectorSprites" value; $ using "vectorTextures" value; $ using "vectorEnabled" checked; $ using "vectorMono" checked. Uses: cerebral refresh; $; object keys; frontier parameters get. */ function parametersRefresh() {
    cerebralRefresh();
    const v = { ...FrontierVector.defaults, ...world.vectorDisplay };
    $("vectorPreset").value = !v.enabled
      ? "unaltered"
      : v.monochrome
        ? "mono"
        : "color";
    $("vectorSprites").value = v.sprites;
    $("vectorTextures").value = v.textures;
    $("vectorEnabled").checked = v.enabled;
    $("vectorMono").checked = v.monochrome;
    $("vectorColor").value = v.color;
    $("vectorGlow").value = v.glow;
    $("vectorRadius").value = v.radius;
    $("vectorBreaks").value = v.breaks;
    $("vectorGap").value = v.gap;
    const fog = world.fog || FrontierFog.defaults;
    $("fogEnabled").checked = fog.enabled;
    $("fogStart").value = fog.start;
    $("fogEnd").value = fog.end;
    $("fogColor").value = fog.color;
    const click = world.clickFeedback || { sound: "Click 1", volume: 0.5 };
    $("clickSound").value = click.sound;
    $("clickVolume").value = click.volume;
    for (const key of Object.keys(FrontierParameters.fields))
      $("parameter-" + key).value = FrontierParameters.get(world, key);
    const settings = world.music || FrontierMusic.defaults;
    $("musicExploration").value = settings.exploration.join("\n");
    $("musicCombat").value = settings.combat.join("\n");
    $("musicMap").value = settings.mapExploration.join("\n");
    $("musicVolume").value = settings.volume;
    if (!window.FRONTIER_RUNTIME_ONLY) FrontierMusicPicker.refresh();
  }
  $("applyCerebral").onclick =
    /* @function app.onclick.202 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.203 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world cerebral. Uses: frontier cerebral validate; number; $; a list of 0, 1, 2 map. */ () => {
          world.cerebral = FrontierCerebral.validate({
            max: Number($("cerebral-max").value),
            amount: Number($("cerebral-amount").value),
            interval: Number($("cerebral-interval").value),
            radius: Number($("cerebral-radius").value),
            transition: Number($("cerebral-transition").value),
            thresholds: [0, 1, 2].map(
              /* @function app.callback.204 — Returns number using $ using "cerebral-threshold" plus i value. Inputs: i. Uses: number; $. Returns: number using $ using "cerebral-threshold" plus i value. */ (
                i,
              ) => Number($("cerebral-threshold" + i).value),
            ),
            melee: Object.fromEntries(
              [
                "name",
                "damage",
                "range",
                "arc",
                "cooldown",
                "spriteProfile",
              ].map(
                /* @function app.callback.205 — Returns a list of k, a list of "name", "spriteProfile" includes using k selects $ using "melee-" plus k value or number using $ using "melee-" plus k value. Inputs: k. Uses: a list of "name", "spriteProfile" includes; $; number. Returns: a list of k, a list of "name", "spriteProfile" includes using k selects $ using "melee-" plus k value or number using $ using "melee-" plus k value. */ (
                  k,
                ) => [
                  k,
                  ["name", "spriteProfile"].includes(k)
                    ? $("melee-" + k).value
                    : Number($("melee-" + k).value),
                ],
              ),
            ),
          });
        },
      );
  $("testCerebral").onclick =
    /* @function app.onclick.206 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: game player cerebral. */ () => {
      game.player.cerebral = Math.max(0, game.player.cerebral - 5);
    };
  $("resetCerebral").onclick =
    /* @function app.onclick.207 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Updates: game player cerebral. */ () => {
      game.player.cerebral = world.cerebral.max;
    };
  $("toggleCerebralSource").onclick =
    /* @function app.onclick.208 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.209 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: e cerebral source. Uses: world objects find; error. */ () => {
          const e = world.objects.find(
            /* @function app.callback.210 — Returns e id equals $ using "selection" value. Inputs: e. Uses: $. Returns: e id equals $ using "selection" value. */ (
              e,
            ) => e.id === $("selection").value,
          );
          if (!e) throw Error("Select a scenery object first");
          e.cerebralSource = !e.cerebralSource;
        },
      );
  mapLibrary = (
    window.FRONTIER_RUNTIME_ONLY ? FrontierRuntimeMaps : FrontierMaps
  ).create({
    deferSaving:
      /* @function app.deferProjectSave1523 — Inputs: none. Returns whether cell presentation owns the frame; automatic project snapshots wait until cinematic completion. Explicit save/export controls remain governed by input guards. No mutation. */ () =>
        sceneTransition.busy,
    world:
      /* @function app.world.211 — Returns world. Inputs: no explicit arguments; uses enclosing module state. Returns: world. */ () =>
        world,
    log,
    download,
    generate:
      /* @function app.generate.212 — Returns generated using $ using "seed" value or "PHANICOM", number using $ using "mapWidth" value, number using $ using "mapHeight" value. Inputs: no explicit arguments; uses enclosing module state. Uses: generated; $; number. Returns: generated using $ using "seed" value or "PHANICOM", number using $ using "mapWidth" value, number using $ using "mapHeight" value. */ () =>
        generated(
          $("seed").value || "PHANICOM",
          Number($("mapWidth").value),
          Number($("mapHeight").value),
        ),
    replace:
      /* @function app.replace.213 — Handles replace within application input, simulation and editor coordination. Inputs: next; options. Updates: drag; world; $ using "seed" value; $ using "mapWidth" value; $ using "mapHeight" value. Uses: terrain tools end; keys clear; mouse reset; $. */ (
        next,
        options,
      ) => {
        terrainTools?.end(true);
        keys.clear();
        mouse.reset();
        drag = null;
        world = next;
        $("seed").value = world.seed;
        $("mapWidth").value = world.width ?? world.size;
        $("mapHeight").value = world.height ?? world.size;
        history = [];
        redoHistory = [];
        editor?.choose("");
        restart(false, true, !!options?.travel);
        activeRuntimeMap = mapLibrary?.active || "demo";
        if (options?.travel) {
          restoreRuntime(journey.get(activeRuntimeMap), options.shared);
          Object.assign(game.player, {
            x: options.entry.x,
            y: options.entry.y,
            z:
              options.entry.z ??
              FrontierTerrain.height(world, options.entry.x, options.entry.y),
            facingX: Math.sin(options.entry.yaw),
            facingY: Math.cos(options.entry.yaw),
            vx: 0,
            vy: 0,
            walkTime: 0,
            walkHold: 0,
          });
          FrontierTerrain.ground(game.player, world, 0, [], game);
          exitTouched.clear();
          for (const e of world.interior?.exits || world.travel?.exits || [])
            if (Math.hypot(e.x - game.player.x, e.y - game.player.y) < e.radius)
              exitTouched.add(e.id);
          travelCooldown = 1.5;
          log("Entered " + mapLibrary.get(activeRuntimeMap).name);
        } else {
          exitTouched.clear();
          journey.clear();
          journal.clear();
          journalRender();
          travelCooldown = 1;
        }
      },
  });
  // October 15, 2026: the campaign tree (src/campaign-shell.js) reads and edits
  // campaign areas through this controller. Authoring builds only; exported
  // runtime games never show the tree.
  if (!window.FRONTIER_RUNTIME_ONLY) window.FrontierMapLibrary = mapLibrary;
  if (!window.FRONTIER_RUNTIME_ONLY)
    FrontierEffectsEditor.create({
      world:
        /* @function app.effectsWorld — Inputs: none. Returns current authoring map; no mutation. */ () =>
          world,
      mutate,
      log,
    });
  FrontierNativeToolUI.configure({ pause: releaseLook, log });
  if (!window.FRONTIER_RUNTIME_ONLY)
    roomEditor = FrontierRoomEditor.create({
      world:
        /* @function app.world.214 — Returns world. Inputs: no explicit arguments; uses enclosing module state. Returns: world. */ () =>
          world,
      game: /* @function app.game.215 — Returns game. Inputs: no explicit arguments; uses enclosing module state. Returns: game. */ () =>
        game,
      mutate,
      log,
      maps: /* @function app.maps.216 — Returns map library snapshot using maps. Inputs: no explicit arguments; uses enclosing module state. Uses: map library snapshot. Returns: map library snapshot using maps. */ () =>
        mapLibrary.snapshot().maps,
      active:
        /* @function app.active.217 — Returns map library active. Inputs: no explicit arguments; uses enclosing module state. Returns: map library active. */ () =>
          mapLibrary.active,
      editing:
        /* @function app.editing.218 — Returns editing. Inputs: no explicit arguments; uses enclosing module state. Returns: editing. */ () =>
          editing,
    });
  if (!window.FRONTIER_RUNTIME_ONLY)
    FrontierNormalWorkbench.create({
      world:
        /* @function app.world.219 — Returns world. Inputs: no explicit arguments; uses enclosing module state. Returns: world. */ () =>
          world,
      mutate,
      log,
    });
  if (!window.FRONTIER_RUNTIME_ONLY)
    terrainTools = FrontierEditorTools.create({
      world:
        /* @function app.world.220 — Returns world. Inputs: no explicit arguments; uses enclosing module state. Returns: world. */ () =>
          world,
      mutate,
      choose:
        /* @function app.choose.221 — Returns editor choose using id. Inputs: id. Uses: editor choose. Returns: editor choose using id. */ (
          id,
        ) => editor.choose(id),
      refresh:
        /* @function app.refresh.222 — Handles refresh within application input, simulation and editor coordination. Inputs: no explicit arguments; uses enclosing module state. Uses: restart. */ () => {
          restart(true);
        },
    });
  $("applyParameters").onclick =
    /* @function app.onclick.223 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.224 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world parameters; game camera pitch. Uses: frontier parameters validate; object from entries; object keys using frontier parameters fields map; object keys. */ () => {
          world.parameters = FrontierParameters.validate(
            Object.fromEntries(
              Object.keys(FrontierParameters.fields).map(
                /* @function app.callback.225 — Returns a list of key, number using $ using "parameter-" plus key value. Inputs: key. Uses: number; $. Returns: a list of key, number using $ using "parameter-" plus key value. */ (
                  key,
                ) => [key, Number($("parameter-" + key).value)],
              ),
            ),
          );
          game.camera.pitch = clampPitch(game.camera.pitch);
        },
      );
  $("resetParameters").onclick =
    /* @function app.onclick.226 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.227 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world parameters. Uses: frontier parameters validate. */ () => {
          world.parameters = FrontierParameters.validate();
        },
      );
  $("applyMapSize").onclick =
    /* @function app.onclick.228 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.229 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world width; world height; world size; world grid spacing. Uses: number; $. */ () => {
          world.width = Number($("mapWidth").value);
          world.height = Number($("mapHeight").value);
          world.size = world.width;
          world.gridSpacing = Number($("gridSpacing").value);
        },
      );
  $("applyActivity").onclick =
    /* @function app.onclick.230 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.231 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world activity. Uses: frontier world activity settings; object from entries; a list of "activeDistance", "reducedDistance", "reducedInterval", "hysteresis" map. */ () => {
          world.activity = FrontierWorld.activitySettings(
            Object.fromEntries(
              [
                "activeDistance",
                "reducedDistance",
                "reducedInterval",
                "hysteresis",
              ].map(
                /* @function app.callback.232 — Returns a list of name, number using $ using "activity-" plus name value. Inputs: name. Uses: number; $. Returns: a list of name, number using $ using "activity-" plus name value. */ (
                  name,
                ) => [name, Number($("activity-" + name).value)],
              ),
            ),
          );
        },
      );
  $("applyVector").onclick =
    /* @function app.onclick.233 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.234 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world vector display. Uses: frontier vector validate; $; number. */ () => {
          world.vectorDisplay = FrontierVector.validate({
            sprites: $("vectorSprites").value,
            textures: $("vectorTextures").value,
            enabled: $("vectorEnabled").checked,
            monochrome: $("vectorMono").checked,
            color: $("vectorColor").value,
            glow: Number($("vectorGlow").value),
            radius: Number($("vectorRadius").value),
            breaks: Number($("vectorBreaks").value),
            gap: Number($("vectorGap").value),
          });
        },
      );
  // Artwork selectors commit immediately through the same undoable path as Apply.
  for (const id of [
    "vectorSprites",
    "vectorTextures",
    "vectorEnabled",
    "vectorMono",
    "vectorColor",
    "vectorGlow",
    "vectorRadius",
    "vectorBreaks",
    "vectorGap",
  ])
    $(id).onchange =
      /* @function app.onchange.235 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: $ using "applyVector" onclick; $. Returns: $ using "applyVector" onclick using . */ () =>
        $("applyVector").onclick();
  $("vectorPreset").onchange =
    /* @function app.onchange.236 — Applies a changed control value to its owning system. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.237 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world vector display. Uses: frontier vector validate; $. */ () => {
          world.vectorDisplay = FrontierVector.validate({
            ...world.vectorDisplay,
            enabled: $("vectorPreset").value !== "unaltered",
            monochrome: $("vectorPreset").value !== "color",
          });
        },
      );
  $("presetVector").onclick =
    /* @function app.onclick.238 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.239 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world vector display. Uses: frontier vector validate. */ () => {
          world.vectorDisplay = FrontierVector.validate({ enabled: true });
        },
      );
  $("applyFog").onclick =
    /* @function app.onclick.240 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.241 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world fog. Uses: frontier fog validate; $; number. */ () => {
          world.fog = FrontierFog.validate({
            enabled: $("fogEnabled").checked,
            start: Number($("fogStart").value),
            end: Number($("fogEnd").value),
            color: $("fogColor").value,
          });
        },
      );
  for (const name of [
    "",
    ...PhanicomAudioManifest.map(
      /* @function app.callback.242 — Returns e name. Inputs: e. Returns: e name. */ (
        e,
      ) => e.name,
    ).sort(),
  ]) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name || "Disabled";
    $("clickSound").append(option);
  }
  $("previewClickSound").onclick =
    /* @function app.onclick.243 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: audio unlock using then; audio unlock. */ () => {
      audio.unlock().then(
        /* @function app.callback.244 — Provides the callback for audio unlock using then. Inputs: no explicit arguments; uses enclosing module state. Uses: $; phanicom se play; number. */ () => {
          if ($("clickSound").value)
            PhanicomSE.play(
              $("clickSound").value,
              Number($("clickVolume").value),
            );
        },
      );
    };
  $("applyClickSound").onclick =
    /* @function app.onclick.245 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.246 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world click feedback. Uses: $; number. */ () => {
          world.clickFeedback = {
            sound: $("clickSound").value,
            volume: Number($("clickVolume").value),
          };
        },
      );
  $("applyMusic").onclick =
    /* @function app.onclick.247 — Responds to a button or clickable control. Inputs: no explicit arguments; uses enclosing module state. Uses: mutate. Returns: mutate using a callback. */ () =>
      mutate(
        /* @function app.callback.248 — Provides the callback for mutate. Inputs: no explicit arguments; uses enclosing module state. Updates: world asset catalog; world music. Uses: frontier music picker catalog; frontier music validate; lines; number. */ () => {
          world.assetCatalog = FrontierMusicPicker.catalog();
          const lines =
            /* @function app.lines.249 — Returns $ using id value split using /\n/ map using a callback filter using boolean. Inputs: id. Uses: $ using id value split using /\n/ map using a callback filter; $ using id value split using /\n/ map; $ using id value split; $. Returns: $ using id value split using /\n/ map using a callback filter using boolean. */ (
              id,
            ) =>
              $(id)
                .value.split(/\n/)
                .map(
                  /* @function app.callback.250 — Returns s trim using . Inputs: s. Uses: s trim. Returns: s trim using . */ (
                    s,
                  ) => s.trim(),
                )
                .filter(Boolean);
          world.music = FrontierMusic.validate({
            exploration: lines("musicExploration"),
            combat: lines("musicCombat"),
            mapExploration: lines("musicMap"),
            volume: Number($("musicVolume").value),
          });
        },
      );
  // October 12, 2026: exports start on their authored active cell. Editor startup
  // retains the historical demo selection; runtime never consults editor storage.
  // October 14 clarification: that describes the initial placeholder only.
  // The subsequently loaded editor project preserves its validated active map
  // (October 13 map-library repair); runtime startup never loads editor storage.
  world = structuredClone(
    mapLibrary.get(window.FRONTIER_RUNTIME_ONLY ? mapLibrary.active : "demo")
      .world,
  );
  restart();
  mapLibrary.load();
  requestAnimationFrame(frame);
});
