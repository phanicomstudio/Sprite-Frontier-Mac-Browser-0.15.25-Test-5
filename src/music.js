/* Soundtrack director: randomized non-repeating bags for exploration/combat.
 * Map exploration playlist overrides the global exploration playlist when
 * non-empty. Filenames live in audio/bgm/exploration or audio/bgm/combat, including extensions.
 * World state decides combat; music does not influence AI or event execution. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier music. */
(/* @function music.reviewed1 — Registers soundtrack validation and controller creation. Inputs: browser/global root. Returns nothing; installs FrontierMusic APIs and defaults. No Audio element or playback is created until create is called. */ function (
  root,
) {
  "use strict";
  const defaults = {
    exploration: [],
    combat: [],
    mapExploration: [],
    volume: 0.6,
  };
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.validate.2 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: assignment pattern. Updates: result at key. Uses: error; number is finite; array is array; list some. Returns: result. */
  /* @function music.reviewed2 — Normalizes authored soundtrack settings. Inputs: optional record with volume and three filename arrays. Returns detached de-duplicated trimmed lists and normalized 0..1 volume. Rejects malformed lists, over 100 tracks/category, unsafe/unsupported filenames and invalid volume. No playback or source mutation. */ function validate(
    value = defaults,
  ) {
    if (!value || typeof value !== "object")
      throw Error("Invalid music settings.");
    const result = { volume: value.volume ?? 0.6 };
    if (
      !Number.isFinite(result.volume) ||
      result.volume < 0 ||
      result.volume > 1
    )
      throw Error("Music volume must be 0–1.");
    for (const key of ["exploration", "combat", "mapExploration"]) {
      const list = value[key] ?? [];
      if (!Array.isArray(list) || list.length > 100)
        throw Error("At most 100 " + key + " tracks.");
      if (
        list.some(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.callback.3 — Returns typeof name does not equal "string" or name length is greater than 180 or the inverse of name trim using or name includes using ".." or /[\\/:]/ test using name or the inverse of /^.+\.(ogg|mp3|wav|m4a|webm)$/i test using name. Inputs: name. Uses: name trim; name includes; /[\\/:]/ test; /^.+\.(ogg|mp3|wav|m4a|webm)$/i test. Returns: typeof name does not equal "string" or name length is greater than 180 or the inverse of name trim using or name includes using ".." or /[\\/:]/ test using name or the inverse of /^.+\.(ogg|mp3|wav|m4a|webm)$/i test using name. */
          /* @function music.reviewed3 — Rejects unsafe soundtrack filenames. Inputs: name. Returns true for non-string, empty/over-180-character name, traversal/path punctuation or unsupported audio extension. The enclosing validator throws; no filesystem access. */ (
            name,
          ) =>
            typeof name !== "string" ||
            name.length > 180 ||
            !name.trim() ||
            name.includes("..") ||
            /[\\/:]/.test(name) ||
            !/^.+\.(ogg|mp3|wav|m4a|webm)$/i.test(name),
        )
      )
        throw Error(
          "Tracks must be filenames in audio/bgm, including extension.",
        );
      result[key] = [
        ...new Set(
          list.map(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.callback.4 — Returns name trim using . Inputs: name. Uses: name trim. Returns: name trim using . */
            /* @function music.reviewed4 — Normalizes one accepted track name. Inputs: validated filename string. Returns trimmed basename for de-duplication. Does not change audio files or resolve an absolute path. */ (
              name,
            ) => name.trim(),
          ),
        ),
      ];
    }
    return result;
  }
  // Bag shuffle plays every entry before refilling; avoid repeating the last
  // track at a bag boundary. Inject RNG for reproducible tests.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.playlist.5 — track at a bag boundary. Inject RNG for reproducible tests. Inputs: tracks; assignment pattern. Returns: a callback. */
  /* @function music.reviewed5 — Creates a shuffled non-repeating playlist selector. Inputs: track array and optional RNG returning values in [0,1). Returns next-track closure. Copies tracks when refilling its bag and avoids repeating the last track across bag boundaries when more than one exists. No playback or source mutation. */ function playlist(
    tracks,
    random = Math.random,
  ) {
    let bag = [],
      last;
    return (
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.callback.6 — Provides the callback for the enclosing music operation. Inputs: no explicit arguments; uses enclosing module state. Updates: bag; array pattern; last. Uses: random; bag at; bag pop. Returns: null; assignment. */
      /* @function music.reviewed6 — Selects the next filename from the captured shuffle bag. Inputs: none. Returns null for no tracks; otherwise refills/shuffles locally and returns/removes one name. Updates only bag/last state and uses caller RNG; no audio allocation. */ () => {
        if (!tracks.length) return null;
        if (!bag.length) {
          bag = [...tracks];
          for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
          }
          if (bag.length > 1 && bag.at(-1) === last)
            [bag[0], bag[bag.length - 1]] = [bag.at(-1), bag[0]];
        }
        return (last = bag.pop());
      }
    );
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.effective.7 — Handles effective within music. Inputs: settings; mode. Returns: mode equals "combat" selects settings combat or settings map exploration length selects settings map exploration or settings exploration. */
  /* @function music.reviewed7 — Chooses the current authored playlist. Inputs: validated settings and mode string. Returns combat list for combat; otherwise nonempty map exploration override or global exploration list. Returns the existing list without cloning/mutation or playback. */ function effective(
    settings,
    mode,
  ) {
    return mode === "combat"
      ? settings.combat
      : settings.mapExploration.length
        ? settings.mapExploration
        : settings.exploration;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.create.8 — Builds a new instance and its public operations from the supplied configuration. Inputs: assignment pattern. Updates: audio preload; audio onended; audio onerror. Returns: a record containing unlock, setVolume, update, stop, mode, track. */
  /* @function music.reviewed8 — Creates one soundtrack director with one reusable Audio element. Inputs: optional seconds clock (default wall time). Returns unlock/volume/update/stop and mode/track getters. Owns shuffle state, failure exclusions and combat/exploration envelopes; allocates no second concurrent decoded track. Playback awaits user unlock. */ function create(
    /* @function music.reviewed9 — Supplies the default soundtrack clock. Inputs: none. Returns wall-clock seconds from Date.now, used for transition envelopes. Does not use frames as time or mutate game state. */ clock /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.clock.9 — Returns date now using divided by 1000. Inputs: no explicit arguments; uses enclosing module state. Uses: date now. Returns: date now using divided by 1000. */ = /* @function music.reviewed9 — Supplies the default soundtrack clock. Inputs: none. Returns wall-clock seconds from Date.now, used for transition envelopes. Does not use frames as time or mutate game state. */ () =>
      Date.now() / 1000,
  ) {
    const audio = new Audio();
    audio.preload = "auto";
    let world,
      config,
      mode,
      signature = "",
      next,
      unlocked = false,
      volume = 0.7,
      blocked = false,
      failed = new Set();
    // Fade the outgoing combat track for three seconds, then start a fresh
    // exploration track and bring it in over two seconds. One audio element
    // avoids keeping two decoded music tracks alive. Aggro cancels this envelope.
    let transition = null,
      gain = 1;
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.applyVolume.10 — Handles apply volume within music. Inputs: no explicit arguments; uses enclosing module state. Updates: audio volume. */
    /* @function music.reviewed10 — Applies soundtrack gain. Inputs: none; captures master preference, authored track-volume multiplier and transition gain. Returns nothing; writes Audio.volume clamped 0..1. Does not start/stop playback or change authored settings. */ function applyVolume() {
      audio.volume = Math.max(
        0,
        Math.min(1, volume * (config?.volume ?? 0.6) * gain),
      );
    }
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.switchMode.11 — Handles switch mode within music. Inputs: value. Updates: mode; next. Uses: failed clear; audio pause; playlist; effective. */
    /* @function music.reviewed11 — Immediately changes the soundtrack category. Inputs: exploration/combat mode. Returns nothing; clears failed-track exclusions, pauses the old track, creates the effective shuffle selector and attempts next playback if unlocked. Uses existing Audio element; no AI/state mutation. */ function switchMode(
      value,
    ) {
      mode = value;
      failed.clear();
      audio.pause();
      next = playlist(effective(config, mode));
      playNext();
    }
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.fadeStep.12 — Handles fade step within music. Inputs: no explicit arguments; uses enclosing module state. Updates: gain; transition. Uses: clock; apply volume; switch mode. Returns: without a result. */
    /* @function music.reviewed12 — Advances the soundtrack transition envelope. Inputs: none; uses captured seconds clock. Returns nothing; fades outgoing combat over three seconds, switches to exploration, then fades in over two. Updates gain/transition only; new aggro cancels it through update. No per-frame source decoding allocation. */ function fadeStep() {
      if (!transition) return;
      const t = clock() - transition.start;
      if (transition.phase === "out") {
        gain = Math.max(0, transition.from * (1 - t / 3));
        applyVolume();
        if (t >= 3) {
          gain = 0;
          switchMode("exploration");
          transition = { phase: "in", start: clock() };
        }
      } else {
        gain = Math.min(1, t / 2);
        applyVolume();
        if (t >= 2) transition = null;
      }
    }
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.playNext.13 — Handles play next within music. Inputs: no explicit arguments; uses enclosing module state. Updates: track; audio src; audio current time. Uses: effective; next; failed has; audio pause. Returns: without a result; without a result. */
    /* @function music.reviewed13 — Attempts the next eligible soundtrack. Inputs: none. Returns nothing; requires a selector and user unlock. Tries at most effective playlist length, skips failed files, assigns fixed category URL and starts playback. Empty/exhausted playlist pauses; playback rejection marks gesture-blocked for retry rather than infinite looping. */ function playNext() {
      if (!next || !unlocked) return;
      let track;
      // Bound errors to the available track count, never an infinite retry loop.
      const tracks = effective(config, mode);
      for (let i = 0; i < tracks.length; i++) {
        const candidate = next();
        if (!failed.has(candidate)) {
          track = candidate;
          break;
        }
      }
      if (!track) {
        audio.pause();
        return;
      }
      audio.src = "audio/bgm/" + mode + "/" + encodeURIComponent(track);
      audio.currentTime = 0;
      applyVolume();
      audio
        .play()
        .then(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.callback.14 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: blocked. Returns: assignment. */
          /* @function music.reviewed14 — Records successful soundtrack playback. Inputs: resolved playback value unused. Returns false after clearing captured blocked flag. Does not change track selection or game combat state. */ () =>
            (blocked = false),
        )
        .catch(
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.callback.15 — Returns assignment. Inputs: no explicit arguments; uses enclosing module state. Updates: blocked. Returns: assignment. */
          /* @function music.reviewed15 — Records rejected soundtrack playback. Inputs: playback error unused. Returns true after setting blocked flag, allowing a later user unlock to retry. Does not suppress resource errors in external diagnostics or endlessly retry. */ () =>
            (blocked = true),
        );
    }
    audio.onended = playNext;
    audio.onerror =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.onerror.16 — Handles onerror within music. Inputs: no explicit arguments; uses enclosing module state. Uses: decode uricomponent; audio src split using "/" pop; audio src split; failed add. */
      /* @function music.reviewed16 — Excludes an undecodable/missing current soundtrack and tries another. Inputs: media error event unused. Returns nothing; extracts current basename, records it in bounded failed set, then invokes next selection. Exhausted playlists stop. No authored file deletion or repeated infinite retry. */ () => {
        const file = decodeURIComponent(audio.src.split("/").pop());
        failed.add(file);
        playNext();
      };
    return {
      // Called only from a user input gesture via the shared audio unlock path.
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.unlock.17 — Handles unlock within music. Inputs: no explicit arguments; uses enclosing module state. Updates: unlocked. Uses: play next. */
      /* @function music.reviewed17 — Enables soundtrack playback from the shared user gesture. Inputs: none. Returns nothing; marks unlocked and retries only if blocked or paused. Browser playback failures remain handled by playNext; cannot influence combat simulation. */ unlock() {
        unlocked = true;
        if (blocked || audio.paused) playNext();
      },
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.setVolume.18 — Handles set volume within music. Inputs: value. Updates: volume. Uses: apply volume. */
      /* @function music.reviewed18 — Sets the shared soundtrack master multiplier. Inputs: normalized volume from validated master controller. Returns nothing; stores it and applies combined gain when config exists. Audio.volume is clamped by applyVolume; no preference is written into authored map settings. */ setVolume(
        value,
      ) {
        volume = value;
        if (config) applyVolume();
      },
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.update.19 — Advances this system using the current state and elapsed time. Inputs: game. Updates: world; config; transition; gain. Uses: switch mode; clock; fade step. Returns: without a result. */
      /* @function music.reviewed19 — Updates soundtrack from active-cell/combat state. Inputs: current game with immutable sourceWorld music and inCombat. Returns nothing; reference changes rebuild playlist only at validated world/config boundaries. Combat switches immediately; leaving combat starts the three-second/two-second envelope. Does not stringify full playlists each frame, alter AI or mutate worlds. */ update(
        game,
      ) {
        const settings = game.sourceWorld.music || defaults,
          newMode = game.inCombat ? "combat" : "exploration";
        // Authored settings are immutable between validated world replacements.
        // Reference comparison avoids stringifying every playlist each frame.
        const changed = world !== game.sourceWorld || config !== settings;
        if (changed) {
          world = game.sourceWorld;
          config = settings;
          transition = null;
          gain = 1;
          switchMode(newMode);
          return;
        }
        if (newMode === "combat") {
          if (mode !== "combat" || transition) {
            transition = null;
            gain = 1;
            switchMode("combat");
          }
        } else if (mode === "combat" && !transition) {
          transition = { phase: "out", start: clock(), from: gain };
        }
        fadeStep();
      },
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.stop.20 — Handles stop within music. Inputs: no explicit arguments; uses enclosing module state. Updates: transition; gain; next; blocked; world. Uses: audio pause; audio remove attribute; audio load. */
      /* @function music.reviewed20 — Stops soundtrack ownership before session replacement. Inputs: none. Returns nothing; clears envelope/selector/failure retry state, pauses Audio, removes source and calls load to release track resources. Leaves the reusable controller available for future update/unlock. */ stop() {
        transition = null;
        gain = 1;
        next = null;
        blocked = false;
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        world = null;
        signature = "";
      },
      get mode /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.mode.21 — Handles mode within music. Inputs: no explicit arguments; uses enclosing module state. Returns: mode. *//* @function music.reviewed21 — Reads current director mode. Inputs: none. Returns exploration/combat mode or undefined before initialization. Read-only; does not query or alter gameplay state. */ () /* @function music.reviewed21 — Reads current director mode. Inputs: none. Returns exploration/combat mode or undefined before initialization. Read-only; does not query or alter gameplay state. */ {
        return mode;
      },
      get track /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function music.track.22 — Handles track within music. Inputs: no explicit arguments; uses enclosing module state. Returns: audio src. *//* @function music.reviewed22 — Reads the current Audio source URL. Inputs: none. Returns Audio.src (browser-resolved string, possibly empty before playback). Read-only and does not allocate another Audio element. */ () /* @function music.reviewed22 — Reads the current Audio source URL. Inputs: none. Returns Audio.src (browser-resolved string, possibly empty before playback). Read-only and does not allocate another Audio element. */ {
        return audio.src;
      },
    };
  }
  root.FrontierMusic = { defaults, validate, playlist, effective, create };
})(typeof window === "undefined" ? globalThis : window);
