/*
 * PHANICOM SYNTH FOOTSTEPS
 * ========================
 * Version: 1.0.1
 * Author: Phanicom
 * A Phanicom Cohos Cooperation.
 *
 * Native Metropolis Frontier / Phanicom JS Isometric Engine plugin.
 *
 * CHANGE LOG
 * ----------
 * v1.0.1
 * - Added Output Boost parameter.
 * - Output Boost amplifies only this plugin's synthesized footsteps.
 * - Master and SFX buses continue to apply normally.
 * - Default boost is 2.0.
 * - Maximum intended boost is 5.0.
 *
 * v1.0.0
 * - Initial native Phanicom JS Isometric Engine conversion.
 * - Recreated synthesized walking/sprinting sounds from the original
 *   RPG Maker MZ implementation.
 * - Added native AudioSystem footstep ownership.
 *
 * PURPOSE
 * -------
 * Produces procedural movement sounds from actual successful player movement.
 *
 * Walking and sprinting use separate frequency sweeps. While this plugin is
 * active it owns player footstep presentation, preventing the engine's normal
 * step0/step1/step2 sounds from playing underneath the synthesized sound.
 *
 * This plugin does NOT create its own AudioContext.
 *
 * It uses the engine AudioSystem and therefore continues to respect the
 * engine's Master and SFX volume controls.
 *
 * REQUIRED AUDIO SYSTEM FUNCTIONS
 * -------------------------------
 * synthSweep()
 * claimFootsteps()
 * releaseFootsteps()
 *
 * INSTALLATION
 * ------------
 * File:
 *
 *   plugins/phanicom-synth-footsteps.js
 *
 * index.html must load this file after:
 *
 *   src/runtime/plugins.js
 *
 * and before:
 *
 *   src/runtime/runtime.js
 */

(function (MF) {
  'use strict';

  const PLUGIN_ID = 'phanicom.synth-footsteps';

  /**
   * Locate the engine AudioSystem exposed to the active plugin session.
   *
   * The normal location is ctx.game.audio. The runtime location is retained
   * as a compatibility fallback in case engine service ownership changes.
   */
  function getAudioSystem(ctx) {
    if (
      ctx &&
      ctx.game &&
      ctx.game.audio
    ) {
      return ctx.game.audio;
    }

    if (
      ctx &&
      ctx.runtime &&
      ctx.runtime.audio
    ) {
      return ctx.runtime.audio;
    }

    return null;
  }

  /**
   * Determine whether the player is currently using the engine sprint input.
   *
   * Sprinting is read from input state rather than inferred from velocity.
   * This preserves the intended walk/sprint sound distinction even when
   * collision or another system alters actual displacement.
   */
  function isPlayerSprinting(game) {
    const keys =
      game &&
      game.input &&
      game.input.keys;

    if (
      !keys ||
      typeof keys.has !== 'function'
    ) {
      return false;
    }

    return keys.has('ShiftLeft');
  }

  /**
   * Return actual successful player displacement during this update.
   *
   * player.vx/player.vy are written after movement/collision resolution, so
   * attempting to walk into a solid obstacle does not produce false steps.
   */
  function movementDistance(game) {
    if (
      !game ||
      !game.player
    ) {
      return 0;
    }

    const vx =
      Number(game.player.vx) || 0;

    const vy =
      Number(game.player.vy) || 0;

    return Math.hypot(vx, vy);
  }

  /**
   * Convert a configuration value to a finite number with a fallback.
   */
  function finiteNumber(value, fallback) {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  MF.plugins.register({
    apiVersion: 1,

    id: PLUGIN_ID,

    name: 'Phanicom Synth Footsteps',

    version: '1.0.1',

    author: 'Phanicom',

    description:
      'Procedural walking and sprinting sounds with independent output gain. ' +
      'Replaces normal core footstep presentation while enabled.',

    /*
     * Installation alone does not modify a module.
     * Enable the plugin explicitly in Module Editor > PLUGINS.
     */
    enabledByDefault: false,

    defaults: {
      /*
       * Base oscillator volume.
       *
       * 0.30 reproduces the original RPG Maker plugin setting.
       */
      volume: 0.30,

      /*
       * Independent amplification applied after the base volume.
       *
       * Effective local synth gain:
       *
       *   volume × outputBoost
       *
       * Default:
       *   0.30 × 2.0 = 0.60
       *
       * Example:
       *   0.50 × 3.0 = 1.50
       *
       * The normal engine SFX and Master buses are still applied afterward.
       */
      outputBoost: 2.0,

      /*
       * Minimum real-time interval between sounds.
       */
      minimumInterval: 150,

      /*
       * Actual world movement accumulated before another step may occur.
       */
      stepDistance: 0.42,

      /*
       * Original walking frequency sweep.
       */
      walkStartFrequency: 100,
      walkEndFrequency: 30,

      /*
       * Original sprinting frequency sweep.
       */
      sprintStartFrequency: 120,
      sprintEndFrequency: 40,

      /*
       * Original oscillator waveform.
       */
      oscillatorType: 'triangle',

      /*
       * Original envelope/timing.
       */
      sweepDuration: 0.10,
      attack: 0.01,
      duration: 0.15
    },

    /*
     * Module Editor parameter definitions.
     *
     * These settings are stored as module plugin overrides by the native
     * Phanicom plugin architecture.
     */
    parameters: {
      volume: {
        type: 'number',
        label: 'Sound Volume',
        description:
          'Base synthesized footstep volume. Original value: 0.30.'
      },

      outputBoost: {
        type: 'number',
        label: 'Output Boost',
        description:
          'Additional gain for synthesized footsteps only. ' +
          '1.0 = no boost, 2.0 = double gain, 3.0 = triple gain. ' +
          'Recommended range: 1.0 to 5.0.'
      },

      minimumInterval: {
        type: 'integer',
        label: 'Minimum Interval (ms)',
        description:
          'Minimum real-time delay between synthesized movement sounds.'
      },

      stepDistance: {
        type: 'number',
        label: 'Step Distance',
        description:
          'Successful movement distance accumulated before another sound.'
      },

      walkStartFrequency: {
        type: 'number',
        label: 'Walk Start Frequency',
        description:
          'Starting oscillator frequency in Hz while walking.'
      },

      walkEndFrequency: {
        type: 'number',
        label: 'Walk End Frequency',
        description:
          'Ending oscillator frequency in Hz while walking.'
      },

      sprintStartFrequency: {
        type: 'number',
        label: 'Sprint Start Frequency',
        description:
          'Starting oscillator frequency in Hz while sprinting.'
      },

      sprintEndFrequency: {
        type: 'number',
        label: 'Sprint End Frequency',
        description:
          'Ending oscillator frequency in Hz while sprinting.'
      },

      oscillatorType: {
        type: 'select',
        label: 'Oscillator Type',
        description:
          'WebAudio oscillator waveform used for movement sounds.',

        options: [
          'triangle',
          'sine',
          'square',
          'sawtooth'
        ]
      },

      sweepDuration: {
        type: 'number',
        label: 'Sweep Duration',
        description:
          'Frequency sweep duration in seconds.'
      },

      attack: {
        type: 'number',
        label: 'Attack',
        description:
          'Volume attack time in seconds.'
      },

      duration: {
        type: 'number',
        label: 'Sound Duration',
        description:
          'Total duration of each synthesized movement sound in seconds.'
      }
    },

    hooks: {
      /**
       * SESSION START
       *
       * Locate the AudioSystem and claim footstep presentation from the core
       * engine. The core AudioSystem continues updating listener position but
       * suppresses its normal sample-based footsteps.
       */
      start(ctx) {
        const audio =
          getAudioSystem(ctx);

        ctx.state.distance = 0;
        ctx.state.lastSoundTime = 0;

        ctx.state.audio =
          audio;

        ctx.state.ownsFootsteps =
          false;

        ctx.state.warnedMissingAudio =
          false;

        if (
          !audio ||
          typeof audio.claimFootsteps !== 'function' ||
          typeof audio.synthSweep !== 'function'
        ) {
          ctx.log(
            'Phanicom Synth Footsteps could not find the required ' +
            'AudioSystem extension.'
          );

          ctx.state.warnedMissingAudio =
            true;

          return;
        }

        const claimed =
          audio.claimFootsteps(
            PLUGIN_ID
          );

        ctx.state.ownsFootsteps =
          claimed === true;

        if (!claimed) {
          ctx.log(
            'Phanicom Synth Footsteps could not claim footstep ownership. ' +
            'Another plugin may already own player footsteps.'
          );
        }
      },

      /**
       * SESSION UPDATE
       *
       * Runs after core movement resolution, allowing player.vx/player.vy to
       * describe successful movement rather than requested input.
       */
      update(ctx, dt) {
        const game =
          ctx.game;

        if (
          !game ||
          !game.player
        ) {
          return;
        }

        /*
         * Recover the AudioSystem if it was unavailable during start().
         */
        if (!ctx.state.audio) {
          ctx.state.audio =
            getAudioSystem(ctx);
        }

        const audio =
          ctx.state.audio;

        if (
          !audio ||
          typeof audio.synthSweep !== 'function'
        ) {
          if (
            !ctx.state.warnedMissingAudio
          ) {
            ctx.log(
              'Phanicom Synth Footsteps cannot play because the required ' +
              'AudioSystem extension is unavailable.'
            );

            ctx.state.warnedMissingAudio =
              true;
          }

          return;
        }

        /*
         * If audio appeared after session startup, claim footsteps now.
         */
        if (
          !ctx.state.ownsFootsteps &&
          typeof audio.claimFootsteps === 'function'
        ) {
          ctx.state.ownsFootsteps =
            audio.claimFootsteps(
              PLUGIN_ID
            ) === true;
        }

        /*
         * Suppress movement audio while interfaces that suspend ordinary
         * player interaction are open.
         */
        if (
          game.dialogOpen ||
          game.inventoryOpen
        ) {
          ctx.state.distance =
            Math.min(
              ctx.state.distance || 0,
              0.18
            );

          return;
        }

        const moved =
          movementDistance(game);

        /*
         * No successful movement this update.
         */
        if (moved < 0.00001) {
          ctx.state.distance =
            Math.min(
              ctx.state.distance || 0,
              0.18
            );

          return;
        }

        /*
         * Accumulate actual world displacement.
         */
        ctx.state.distance =
          (ctx.state.distance || 0) +
          moved;

        const configuredDistance =
          finiteNumber(
            ctx.config.stepDistance,
            0.42
          );

        const requiredDistance =
          configuredDistance > 0
            ? configuredDistance
            : 0.42;

        if (
          ctx.state.distance <
          requiredDistance
        ) {
          return;
        }

        /*
         * Keep excess movement rather than throwing it away. This maintains a
         * stable cadence when a frame crosses the threshold.
         */
        ctx.state.distance %=
          requiredDistance;

        /*
         * Preserve the original minimum-time safeguard independently from
         * distance cadence.
         */
        const now =
          performance.now();

        const configuredInterval =
          finiteNumber(
            ctx.config.minimumInterval,
            150
          );

        const minimumInterval =
          Math.max(
            0,
            configuredInterval
          );

        if (
          now -
          (ctx.state.lastSoundTime || 0) <
          minimumInterval
        ) {
          return;
        }

        ctx.state.lastSoundTime =
          now;

        const sprinting =
          isPlayerSprinting(game);

        const startFrequency =
          sprinting
            ? finiteNumber(
                ctx.config.sprintStartFrequency,
                120
              )
            : finiteNumber(
                ctx.config.walkStartFrequency,
                100
              );

        const endFrequency =
          sprinting
            ? finiteNumber(
                ctx.config.sprintEndFrequency,
                40
              )
            : finiteNumber(
                ctx.config.walkEndFrequency,
                30
              );

        /*
         * VOLUME + OUTPUT BOOST
         * ---------------------
         *
         * Base volume controls the sound normally.
         *
         * Output Boost supplies additional gain specifically for this plugin.
         * It does NOT modify the engine's global SFX or Master bus settings.
         */
        const baseVolume =
          Math.max(
            0,
            finiteNumber(
              ctx.config.volume,
              0.30
            )
          );

        const outputBoost =
          Math.max(
            0,
            Math.min(
              5,
              finiteNumber(
                ctx.config.outputBoost,
                2.0
              )
            )
          );

        const effectiveVolume =
          baseVolume *
          outputBoost;

        /*
         * Generate the actual movement sound through the engine's existing
         * AudioSystem and WebAudio graph.
         */
        audio.synthSweep({
          type:
            ctx.config.oscillatorType,

          startFrequency:
            startFrequency,

          endFrequency:
            endFrequency,

          sweepDuration:
            finiteNumber(
              ctx.config.sweepDuration,
              0.10
            ),

          attack:
            finiteNumber(
              ctx.config.attack,
              0.01
            ),

          duration:
            finiteNumber(
              ctx.config.duration,
              0.15
            ),

          /*
           * This value may intentionally exceed 1.0. The updated audio.js
           * permits synthSweep() gain up to 5.0.
           */
          volume:
            effectiveVolume,

          bus:'sfx',

          pan:0,

          rate:1
        });
      },

      /**
       * SESSION STOP
       *
       * Release ownership so the engine's normal footsteps automatically
       * return when this plugin is disabled.
       */
      stop(ctx) {
        const audio =
          ctx.state.audio ||
          getAudioSystem(ctx);

        if (
          audio &&
          typeof audio.releaseFootsteps === 'function'
        ) {
          audio.releaseFootsteps(
            PLUGIN_ID
          );
        }

        ctx.state.distance = 0;
        ctx.state.lastSoundTime = 0;
        ctx.state.audio = null;
        ctx.state.ownsFootsteps = false;
      }
    }
  });

})(window.MF = window.MF || {});