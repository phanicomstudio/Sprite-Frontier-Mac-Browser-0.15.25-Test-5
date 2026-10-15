/* MAINTAINER GUIDE
 * Offline MZ-style audio/se playback using a bounded voice pool. Manifest filenames preserve spaces/case; URL encoding happens only at playback. Voice limit bounds repeated automatic-fire audio allocation.
 * See CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root phanicom se. Uses: root phanicom audio manifest or a list of map. */
(/* @function se-audio.installReviewed — Installs offline named sound-effect playback and bounded voice ownership. Manifest filenames preserve spaces/case and playback encodes URLs; repeated-fire sounds cannot allocate unbounded live voices. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  const files = new Map(
      (root.PhanicomAudioManifest || []).map(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.callback.2 — Returns a list of a name, a file. Inputs: a. Returns: a list of a name, a file. */
        /* @function seAudio.reviewed2 — Indexes a supplied sound manifest entry. Inputs: a with name/file strings. Returns name/file tuple for exact lookup, preserving spaces/case. No playback or filesystem lookup. */ (
          a,
        ) => [a.name, a.file],
      ),
    ),
    pool = [],
    limit = 24,
    frameNames = new Set();
  let volume = 0.7,
    context,
    output,
    previewToken = 0,
    unlock;
  // Resolve a manifest sound, reuse an available voice and apply global gain and pitch. Missing files return false.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.play.3 — Resolve a manifest sound, reuse an available voice and apply global gain and pitch. Missing files return false. Inputs: name; assignment pattern; assignment pattern; assignment pattern; report; assignment pattern. Updates: voice; voice busy; voice group; audio onended; audio onerror. Uses: files get; error; pool find; pool push. Returns: false; false. */
  /* @function seAudio.reviewed3 — Schedules one named effect through the bounded shared voice pool. Inputs: manifest name, normalized gain (default 1), pitch ratio (1), pan (-1..1, default center), optional error reporter and ownership group. Returns false for missing name/full 24-voice pool, otherwise true after starting asynchronous playback. Reuses MediaElement/WebAudio nodes, clamps gain/rate/pan and throws if requested stereo requires unavailable unlocked Web Audio. Token checks prevent stale completion changing a reused voice; asynchronous failures report rather than claiming decode success. */ function play(
    name,
    gain = 1,
    pitch = 1,
    pan = 0,
    report,
    group = "runtime",
  ) {
    const file = files.get(name);
    if (!file) return false;
    if (pan !== 0 && !context?.createStereoPanner)
      throw Error(
        "Stereo pan requires unlocked Web Audio. Click the playtest to enable audio.",
      );
    let voice = pool.find(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.callback.4 — Returns the inverse of v busy or v audio ended. Inputs: v. Returns: the inverse of v busy or v audio ended. */
      /* @function seAudio.reviewed4 — Finds a reusable sound voice. Inputs: pooled voice v. Returns true when not busy or media ended, allowing reuse without another Audio allocation. Read-only pool lookup. */ (
        v,
      ) => !v.busy || v.audio.ended,
    );
    if (!voice) {
      if (pool.length >= limit) return false;
      const audio = new Audio();
      voice = {
        audio,
        busy: false,
        token: 0,
      };
      pool.push(voice);
    }
    const audio = voice.audio,
      token = ++voice.token;
    voice.busy = true;
    voice.group = group;
    audio.onended =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.onended.5 — Cleans up or advances audio state when playback finishes. Inputs: no explicit arguments; uses enclosing module state. Updates: voice busy. */
      /* @function seAudio.reviewed5 — Releases completed sound ownership. Inputs: ended event unused. Returns nothing; clears busy only if captured token still matches this playback. Prevents an old completion releasing a newer reused voice. */ () => {
        if (voice.token === token) voice.busy = false;
      };
    audio.onerror =
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.onerror.6 — Handles onerror within se audio. Inputs: no explicit arguments; uses enclosing module state. Updates: voice busy. Uses: report. */
      /* @function seAudio.reviewed6 — Reports a media decode/resource failure. Inputs: media error event unused. Returns nothing; on matching token clears busy and invokes optional reporter with the named failure. Does not delete files or change another playback. */ () => {
        if (voice.token === token) {
          voice.busy = false;
          report?.("Audio resource could not be decoded: " + name);
        }
      };
    // Build the media-source/panner graph once per pooled voice. Existing combat
    // callers keep centered playback when reusing a previously panned voice.
    if (context && output && context.createStereoPanner) {
      if (!voice.source) {
        voice.source = context.createMediaElementSource(audio);
        voice.gain = context.createGain();
        voice.panner = context.createStereoPanner();
        voice.source.connect(voice.gain);
        voice.gain.connect(voice.panner);
        voice.panner.connect(output);
      }
      voice.gain.gain.value = Math.max(0, Math.min(1, gain));
      voice.panner.pan.value = Math.max(-1, Math.min(1, pan));
    }
    audio.src = "audio/se/" + encodeURIComponent(file);
    audio.volume = voice.source ? 1 : Math.max(0, Math.min(1, gain * volume));
    audio.playbackRate = Math.max(0.5, Math.min(1.5, pitch));
    audio.preservesPitch = false;
    audio.play().catch(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.callback.7 — Provides the callback for audio play using catch. Inputs: error. Updates: voice busy. Uses: report. */
      /* @function seAudio.reviewed7 — Reports rejected sound playback. Inputs: playback Error. Returns nothing; only matching token clears busy and calls optional reporter, retaining the explicit name/reason. Does not retry indefinitely or treat failed playback as audible success. */ (
        error,
      ) => {
        if (voice.token === token) {
          voice.busy = false;
          report?.(
            "Sound playback failed: " + name + " (" + error.message + ")",
          );
        }
      },
    );
    return true;
  }
  root.PhanicomSE = {
    play,
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.has.8 — Returns files has using name. Inputs: name. Uses: files has. Returns: files has using name. */
    has: /* @function seAudio.reviewed8 — Checks sound-name availability in the installed manifest. Inputs: exact name. Returns Boolean; membership does not prove the file decodes or exists at playback. No resource load. */ (
      name,
    ) =>
      files.has(
        name,
      ) /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.beginFrame.9 — Handles begin frame within se audio. Inputs: no explicit arguments; uses enclosing module state. Uses: frame names clear. */,
    /* @function seAudio.reviewed9 — Begins one sound-deduplication frame. Inputs: none. Returns nothing; clears runtime sound-name set so the same effect can play in a later frame. Does not stop active voices. */ beginFrame() {
      frameNames.clear();
    } /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.playEvent.10 — Handles play event within se audio. Inputs: sound; report; assignment pattern. Uses: number is integer; error; files has; frame names has. Returns: true; true. */,
    /* @function seAudio.reviewed10 — Executes validated MZ-style sound parameters. Inputs: name/whole volume 0..100/pitch 50..150/pan -100..100, optional reporter and group. Returns true for empty no-op, same-frame runtime duplicate or scheduled playback. Converts percentages to normalized gain/rate/pan; throws invalid/missing-name/voice-limit errors. Preview sounds are not runtime-deduplicated; asynchronous media errors report separately. */ playEvent(
      sound,
      report,
      group = "runtime",
    ) {
      if (
        !sound ||
        typeof sound.name !== "string" ||
        sound.name.length > 200 ||
        !Number.isInteger(sound.volume) ||
        sound.volume < 0 ||
        sound.volume > 100 ||
        !Number.isInteger(sound.pitch) ||
        sound.pitch < 50 ||
        sound.pitch > 150 ||
        !Number.isInteger(sound.pan) ||
        sound.pan < -100 ||
        sound.pan > 100
      )
        throw Error("Invalid sound effect parameters.");
      if (!sound.name) return true;
      if (!files.has(sound.name))
        throw Error("Missing sound effect: " + sound.name);
      if (group === "runtime" && frameNames.has(sound.name)) return true;
      if (
        !play(
          sound.name,
          sound.volume / 100,
          sound.pitch / 100,
          sound.pan / 100,
          report,
          group,
        )
      )
        throw Error("Sound effect voice limit reached (24).");
      if (group === "runtime") frameNames.add(sound.name);
      return true;
    } /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.setUnlock.11 — Handles set unlock within se audio. Inputs: fn. Updates: unlock. */,
    /* @function seAudio.reviewed11 — Registers the shared audio unlock operation. Inputs: unlock callback fn. Returns nothing; retains it for explicit editor previews. Does not unlock/start sound or create another audio context. */ setUnlock(
      fn,
    ) {
      unlock = fn;
    } /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.previewEvent.12 — Handles preview event within se audio. Inputs: sound; report. Uses: this stop; unlock; context resume; this play event. Returns: this play event using sound, report, "preview". */,
    /* @function seAudio.reviewed12 — Previews a sound from an editor gesture. Inputs: validated sound data and optional reporter. Returns a promise for playEvent result, or undefined when superseded by another preview/cancel. Stops prior preview group, awaits shared unlock/resume and checks preview token before playing. Errors propagate to the owning dialog; runtime voices remain separate. */ async previewEvent(
      sound,
      report,
    ) {
      const token = ++previewToken;
      this.stop("preview");
      await unlock?.();
      if (context?.state === "suspended") await context.resume();
      if (token === previewToken)
        return this.playEvent(sound, report, "preview");
    } /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.stopPreview.13 — Handles stop preview within se audio. Inputs: no explicit arguments; uses enclosing module state. Uses: this stop. */,
    /* @function seAudio.reviewed13 — Cancels editor preview ownership. Inputs: none. Returns nothing; increments token so pending async previews cannot start and stops preview-group voices. Does not stop gameplay sound/music. */ stopPreview() {
      previewToken++;
      this.stop("preview");
    } /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.stop.14 — Handles stop within se audio. Inputs: group. Updates: voice busy; voice audio current time. Uses: frame names clear; voice audio pause. */,
    /* @function seAudio.reviewed14 — Stops sound voices by group or all groups. Inputs: optional group (falsy means all). Returns nothing; invalidates matching voice tokens, clears busy, pauses media and rewinds seconds position to zero. Clears runtime frame-dedup when appropriate but keeps pooled graph resources reusable. Does not delete audio files. */ stop(
      group,
    ) {
      if (!group || group === "runtime") frameNames.clear();
      for (const voice of pool) {
        if (group && voice.group !== group) continue;
        voice.token++;
        voice.busy = false;
        voice.audio.pause();
        voice.audio.currentTime = 0;
      }
    } /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.setVolume.15 — Handles set volume within se audio. Inputs: v. Updates: volume. */,
    /* @function seAudio.reviewed15 — Stores fallback sound master volume. Inputs: normalized v from shared master controller. Returns nothing; future non-WebAudio plays multiply it with effect gain. Shared WebAudio master owns live graph volume; this does not rebuild voices or write map settings. */ setVolume(
      v,
    ) {
      volume = v;
    } /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.setContext.16 — Handles set context within se audio. Inputs: ctx; master. Updates: pool length; context; output. Uses: this stop; voice source disconnect; voice gain disconnect; voice panner disconnect. */,
    /* @function seAudio.reviewed16 — Adopts shared unlocked audio context/master output. Inputs: AudioContext ctx and master GainNode. Returns nothing; on context replacement stops voices, disconnects old graphs and clears pool before assignment. Shares context with combat synth. Caller owns context validity/lifetime; audio API errors propagate, no second context is created. */ setContext(
      ctx,
      master,
    ) {
      if (context && context !== ctx) {
        this.stop();
        for (const voice of pool) {
          voice.source?.disconnect();
          voice.gain?.disconnect();
          voice.panner?.disconnect();
        }
        pool.length = 0;
      }
      context = ctx;
      output = master;
      root.PhanicomCombatCore?.setAudioContext(ctx);
    },
    get context /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.context.17 — Handles context within se audio. Inputs: no explicit arguments; uses enclosing module state. Returns: context. *//* @function seAudio.reviewed17 — Reads adopted sound AudioContext. Inputs: none. Returns context reference or undefined before unlock. Read-only; caller must respect shared ownership rather than close it per effect. */ () /* @function seAudio.reviewed17 — Reads adopted sound AudioContext. Inputs: none. Returns context reference or undefined before unlock. Read-only; caller must respect shared ownership rather than close it per effect. */ {
      return context;
    },
    get voices /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.voices.18 — Handles voices within se audio. Inputs: no explicit arguments; uses enclosing module state. Returns: pool length. *//* @function seAudio.reviewed18 — Reads allocated sound-voice count. Inputs: none. Returns pool length, bounded by 24. Does not count soundtrack or expose decoded memory as a measured metric. */ () /* @function seAudio.reviewed18 — Reads allocated sound-voice count. Inputs: none. Returns pool length, bounded by 24. Does not count soundtrack or expose decoded memory as a measured metric. */ {
      return pool.length;
    } /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.debug.19 — Handles debug within se audio. Inputs: no explicit arguments; uses enclosing module state. Uses: pool filter using a callback map; pool filter. Returns: a record containing limit, voices, active. */,
    /* @function seAudio.reviewed19 — Reads concise sound diagnostics. Inputs: none. Returns limit, pooled voice count and newly built active group/rate/pan/gain records. Reads bounded pool only; no media decoding, source mutation or per-frame logging. */ debug() {
      return {
        limit,
        voices: pool.length,
        active: pool
          .filter(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.callback.20 — Returns v busy and the inverse of v audio ended. Inputs: v. Returns: v busy and the inverse of v audio ended. */
            /* @function seAudio.reviewed20 — Selects active diagnostic voices. Inputs: pooled voice v. Returns true for busy and not-ended media, without modifying ownership or playback. */ (
              v,
            ) => v.busy && !v.audio.ended,
          )
          .map(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function se-audio.callback.21 — Returns a record containing group, pitch, pan, volume. Inputs: v. Returns: a record containing group, pitch, pan, volume. */
            /* @function seAudio.reviewed21 — Builds one active sound diagnostic row. Inputs: pooled voice v. Returns group, rate multiplier, normalized pan and current effect gain/media volume. Does not expose waveform bytes or alter graph nodes. */ (
              v,
            ) => ({
              group: v.group,
              pitch: v.audio.playbackRate,
              pan: v.panner?.pan.value ?? 0,
              volume: v.gain?.gain.value ?? v.audio.volume,
            }),
          ),
      };
    },
  };
})(window);
