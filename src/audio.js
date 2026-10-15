/* MAINTAINER GUIDE
 * Shared Web Audio context and the original synth-footstep bridge. Audio resumes only after a user gesture. Context/gain ownership is shared with weapon and blood sounds; stop footsteps when replacing a playtest.
 * See docs/CODE-GUIDE.md for load order, ownership and extension recipes.
 */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.callback.1 — Provides the callback for a callback. Inputs: mf. Updates: mf plugins; mf create frontier audio. */
(/* @function audio.reviewed1 — Installs shared audio services and the footstep plugin registry. Inputs: existing MF engine namespace. Returns nothing; exposes registration and audio factory APIs. Requires MF/load order, does not unlock audio until a user gesture. */ function (
  MF,
) {
  const root = window;
  ("use strict");
  // Minimal plugin host. The actual supplied plugin is loaded unchanged.
  const registry = new Map();
  MF.plugins = {
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.register.2 — Handles register within audio. Inputs: plugin. Uses: registry set. */
    /* @function audio.reviewed2 — Registers a native audio extension. Inputs: plugin with stable id/defaults/hooks. Returns nothing; stores it by ID, replacing that ID if already registered. Caller supplies a valid plugin; does not start playback. */ register(
      plugin,
    ) {
      registry.set(plugin.id, plugin);
    },
  };
  // Own shared audio context and bridge synth footsteps into the native game services.
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.createAudio.3 — Own shared audio context and bridge synth footsteps into the native game services. Inputs: no explicit arguments; uses enclosing module state. Uses: root phanicom se set unlock. Returns: audio. */
  /* @function audio.reviewed3 — Creates isolated audio-controller ownership for a game session. Inputs: none. Returns controller with lazy shared Web Audio context, normalized master volume and footstep ownership. Installs the supplied sound-effect unlock callback; does not start audio or allocate a context until unlock. */ function createAudio() {
    let context,
      master,
      sfx,
      owner = null,
      volume = 0.7;
    const audio = {
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.unlock.4 — Handles unlock within audio. Inputs: no explicit arguments; uses enclosing module state. Updates: context; master; sfx; master gain value; sfx gain value. Uses: context create gain; sfx connect; master connect; audio music unlock. Returns: without a result. */
      /* @function audio.reviewed4 — Unlocks browser audio from an actual user gesture. Inputs: none. Returns a promise; lazily creates context/master/SFX gains, resumes suspended context and shares it with sound effects. Unlocks music too. Missing AudioContext is a silent no-op; context/resume errors reject. Reuses one context rather than creating one per sound. */ async unlock() {
        if (!context) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!AudioContext) return;
          context = new AudioContext();
          master = context.createGain();
          sfx = context.createGain();
          master.gain.value = volume;
          sfx.gain.value = 0.8;
          sfx.connect(master);
          master.connect(context.destination);
        }
        audio.music?.unlock();
        if (context.state === "suspended") await context.resume();
        root.PhanicomSE?.setContext(context, master);
      },
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.setVolume.5 — Handles set volume within audio. Inputs: value. Updates: master gain value. Uses: audio music set volume; root phanicom se set volume; root phanicom combat core set volume. */
      /* @function audio.reviewed5 — Changes normalized master volume. Inputs: value coercible to a number, clamped 0..1 (invalid values become zero). Returns nothing; retains preference before context exists and forwards it to master gain, music, sound effects and combat synth. Does not start playback. */ setVolume(
        value,
      ) {
        // October 9: retain normalized master volume before the context exists.
        volume = Math.max(0, Math.min(1, Number(value) || 0));
        value = volume;
        if (master) master.gain.value = value;
        audio.music?.setVolume(value);
        root.PhanicomSE?.setVolume(value);
        root.PhanicomCombatCore?.setVolume(value);
      },
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.playAt.6 — Handles play at within audio. Inputs: name; x; y; assignment pattern. Uses: root phanicom se play. Returns: chain. */
      /* @function audio.reviewed6 — Plays a named effect through the supplied sound bank. Inputs: name, compatibility x/y (currently unused) and optional normalized volume. Returns the sound service result or undefined if unavailable. Maps reload aliases; this bridge does not spatialize using coordinates. Bank/service handles missing sounds. */ playAt(
        name,
        x,
        y,
        options = {},
      ) {
        const names = {
          reloadClick: "Click 1",
          reloadMetal: "Click 2",
          monsterHit: "",
          monsterDeath: "",
        };
        return root.PhanicomSE?.play(names[name] || name, options.volume ?? 1);
      },
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.claimFootsteps.7 — Handles claim footsteps within audio. Inputs: id. Updates: owner. Returns: false; true. */
      /* @function audio.reviewed7 — Claims exclusive synthesized-footstep ownership. Inputs: session ID. Returns false if another truthy ID owns footsteps, otherwise records this owner and returns true. No audio is emitted; prevents stacked footsteps from simultaneous sessions. */ claimFootsteps(
        id,
      ) {
        if (owner && owner !== id) return false;
        owner = id;
        return true;
      } /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.releaseFootsteps.8 — Handles release footsteps within audio. Inputs: id. Updates: owner. */,
      /* @function audio.reviewed8 — Releases synthesized-footstep ownership. Inputs: session ID. Returns nothing; clears owner only on matching ID, leaving another session owner intact. No context shutdown or music changes. */ releaseFootsteps(
        id,
      ) {
        if (owner === id) owner = null;
      },
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.synthSweep.9 — Handles synth sweep within audio. Inputs: opts. Updates: osc type; osc onended. Uses: context create oscillator; context create gain; osc frequency set value at time; osc frequency exponential ramp to value at time. Returns: false; true. */
      /* @function audio.reviewed9 — Emits a short procedural oscillator sweep. Inputs: opts with positive start/end frequencies in Hz, duration/attack/sweep seconds, waveform and finite volume; caller validates compatible envelope times. Returns false without a running context, otherwise true after scheduling oscillator/gain nodes. Caps endpoint/gain to safe positive values, connects shared SFX and disconnects nodes on end. Web Audio invalid parameters can throw. */ synthSweep(
        opts,
      ) {
        if (!context || context.state !== "running") return false;
        const now = context.currentTime,
          duration = opts.duration ?? 0.15,
          attack = opts.attack ?? 0.01,
          osc = context.createOscillator(),
          gain = context.createGain();
        osc.type = opts.type || "triangle";
        osc.frequency.setValueAtTime(opts.startFrequency, now);
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(1, opts.endFrequency),
          now + (opts.sweepDuration ?? 0.1),
        );
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(
          Math.max(0.0001, Math.min(5, opts.volume)),
          now + attack,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          now +
            Math.min(
              duration - 0.0005,
              Math.max(attack + 0.0005, opts.sweepDuration ?? 0.1),
            ),
        );
        gain.gain.linearRampToValueAtTime(0, now + duration);
        osc.connect(gain);
        gain.connect(sfx);
        osc.start(now);
        osc.stop(now + duration);
        osc.onended =
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.onended.10 — Cleans up or advances audio state when playback finishes. Inputs: no explicit arguments; uses enclosing module state. Uses: osc disconnect; gain disconnect. */
          /* @function audio.reviewed10 — Releases ended procedural sound nodes. Inputs: ended event unused. Returns nothing; disconnects the captured oscillator and gain from shared audio routing. Does not destroy the shared audio context or affect other sounds. */ () => {
            osc.disconnect();
            gain.disconnect();
          };
        return true;
      },
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.start.11 — Handles start within audio. Inputs: game; log. Uses: registry get; plugin hooks start. Returns: a record containing update, stop. */
      /* @function audio.reviewed11 — Starts one footstep-extension session. Inputs: game/runtime and logging callback. Returns update(dt)/stop handles with copied plugin defaults and independent state. Requires registered phanicom.synth-footsteps plugin; missing/failed hooks propagate. Calls start once; owner must stop before replacing a playtest. */ start(
        game,
        log,
      ) {
        const plugin = registry.get("phanicom.synth-footsteps");
        const ctx = {
          game,
          runtime: game.runtime,
          config: {
            ...plugin.defaults,
          },
          state: {},
          log,
        };
        plugin.hooks.start(ctx);
        return {
          /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.update.12 — Advances this system using the current state and elapsed time. Inputs: dt. Uses: plugin hooks update. */
          /* @function audio.reviewed12 — Advances one footstep session. Inputs: elapsed dt in seconds. Returns nothing; forwards the isolated game/runtime/config/state context to the registered update hook. Hook owns emitted sound timing; errors propagate. */ update(
            dt,
          ) {
            plugin.hooks.update(ctx, dt);
          } /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.stop.13 — Handles stop within audio. Inputs: no explicit arguments; uses enclosing module state. Uses: plugin hooks stop. */,
          /* @function audio.reviewed13 — Stops the registered footstep session. Inputs: none. Returns nothing; invokes its stop hook to release session ownership/audio state. Does not stop the shared soundtrack; hook errors propagate. */ stop() {
            plugin.hooks.stop(ctx);
          },
        };
      },
    };
    root.PhanicomSE?.setUnlock(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function audio.callback.14 — Returns audio unlock using . Inputs: no explicit arguments; uses enclosing module state. Uses: audio unlock. Returns: audio unlock using . */
      /* @function audio.reviewed14 — Bridges a sound-effect gesture to shared audio unlock. Inputs: none. Returns the controller unlock promise, propagating failures. Does not create a second context or bypass gesture restrictions. */ () =>
        audio.unlock(),
    );
    return audio;
  }
  MF.createFrontierAudio = createAudio;
})(window.MF);
