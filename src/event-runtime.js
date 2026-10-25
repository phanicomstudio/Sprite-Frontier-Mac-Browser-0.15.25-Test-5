/* Runtime handler registration is independent from MZ lowering and dialogs.
 * Existing interpreter control-flow operations remain reserved. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function event-runtime.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier event runtime. Uses: "message choices choicePrompt numberInput branch else end forceRoute eraseEvent controlTimer exitEvent repeat breakLoop jumpLabel label loop selfSwitch switch journal variable partyMember mzVariables giveItem wait transferMap transfer transferPlayer choiceSection choiceCancel choiceEnd unsupported" split; register. */
(/* @function event-runtime.installReviewed — Installs extensible runtime command-handler registration. MZ lowering/dialogs remain separate; reserved interpreter control-flow operations cannot be replaced through this registry. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  const builtins = new Set(
      "message choices choicePrompt numberInput branch else end forceRoute eraseEvent controlTimer exitEvent repeat breakLoop jumpLabel label loop selfSwitch switch journal variable partyMember mzVariables giveItem wait transferMap transfer transferPlayer choiceSection choiceCancel choiceEnd unsupported".split(
        " ",
      ),
    ),
    handlers = new Map();
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.register.2 — Handles register within event runtime. Inputs: type; definition. Uses: /^[A-Za-z][A-Za-z0-9:_-]{0,99}$/ test; builtins has; handlers has; error. */
      /* @function eventRuntime.reviewedregister_2 — Registers a custom command definition without replacing interpreter control flow. Inputs: unique ASCII command type (1-100 characters) and definition with validate/execute functions. Returns nothing; stores a shallow frozen copy in private handlers. Throws before mutation for reserved/duplicate/invalid types or missing functions. Nested definition data remain caller-owned. */ function register(
    type,
    definition,
  ) {
    if (
      typeof type !== "string" ||
      !/^[A-Za-z][A-Za-z0-9:_-]{0,99}$/.test(type) ||
      builtins.has(type) ||
      handlers.has(type) ||
      typeof definition?.validate !== "function" ||
      typeof definition?.execute !== "function"
    )
      throw Error(
        "Runtime command requires a unique type, validator and executor.",
      );
    handlers.set(type, Object.freeze({ ...definition }));
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.validate.3 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: command. Uses: handlers get; error; root frontier event schema json; definition validate. Returns: c. */
      /* @function eventRuntime.reviewedvalidate_3 — Creates a portable validated copy of a registered command. Inputs: command record with type. Returns detached JSON-normalized c after the handler validator accepts it. Does not execute gameplay or change the registry; unknown type, nonportable JSON or handler validation throws. */ function validate(
    command,
  ) {
    const definition = handlers.get(command.type);
    if (!definition) throw Error("Unknown runtime command " + command.type);
    const c = root.FrontierEventSchema.json(command);
    definition.validate(c);
    return c;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.preflight.4 — Handles preflight within event runtime. Inputs: commands. Uses: commands map. Returns: commands map using a callback. */
      /* @function eventRuntime.reviewedpreflight_4 — Checks custom commands before interpreter execution. Inputs: command array. Returns a new array of validated detached custom records, unchanged reserved builtin records and explicit unsupported records for unknown types. No gameplay mutation; invalid custom records throw. Builtin shape validation belongs to the interpreter/schema. */ function preflight(
    commands,
  ) {
    return commands.map(
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.callback.5 — Provides the callback for commands map. Inputs: command. Uses: handlers has; validate; builtins has. Returns: validate using command; command. */
      /* @function eventRuntime.reviewedcallback_5 — Classifies one preflight command. Inputs: command from the captured list. Returns validated registered record, original builtin record or an unsupported diagnostic record. No execution; validation failures propagate to stop adoption before effects. */ (
        command,
      ) => {
        if (handlers.has(command.type)) return validate(command);
        if (builtins.has(command.type)) return command;
        return {
          type: "unsupported",
          code: command.type,
          name: "Unregistered runtime command " + command.type,
        };
      },
    );
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.execute.6 — Handles execute within event runtime. Inputs: command; context. Uses: handlers get; error; d execute; array is array. Returns: result. */
      /* @function eventRuntime.reviewedexecute_6 — Dispatches a registered command to its executor. Inputs: validated command and live execution context. Returns executor directive or undefined; accepts only non-array object directives. Handler may mutate gameplay or call services; missing handler and invalid returned directives throw. This dispatch does not roll back an executor that already ran. */ function execute(
    command,
    context,
  ) {
    const d = handlers.get(command.type);
    if (!d) throw Error("Unregistered runtime command " + command.type);
    const result = d.execute(command, context);
    if (
      result !== undefined &&
      (!result || typeof result !== "object" || Array.isArray(result))
    )
      throw Error("Invalid runtime command directive.");
    return result;
  }
  register("mzGold", {
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.validate.7 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: a list of 0, 1 includes; number is integer; error. */
      /* @function eventRuntime.reviewedvalidate_7 — Validates MZ Change Gold operands. Inputs: c with operation/operand flags and integer value. Returns undefined on acceptance; throws for flags outside 0/1, negative/direct values above 99,999,999 or variable IDs outside 1-5000. No gameplay mutation. */ (
        c,
      ) => {
        if (
          ![0, 1].includes(c.operation) ||
          ![0, 1].includes(c.operand) ||
          !Number.isInteger(c.value) ||
          c.value < 0 ||
          (c.operand === 1 && (c.value < 1 || c.value > 5000)) ||
          (c.operand === 0 && c.value > 99999999)
        )
          throw Error("Invalid Change Gold operation.");
      },
    execute:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.execute.8 — Handles execute within event runtime. Inputs: c; object pattern. Updates: state gold. Uses: state variables get; string. */
      /* @function eventRuntime.reviewedexecute_8 — Changes session gold using a direct value or current variable. Inputs: validated c and context state. Returns undefined; adds/subtracts and clamps state.gold to 0-99,999,999, treating absent variables as zero. Expects Map variables and validated state; failures propagate. */ (
        c,
        { state },
      ) => {
        const value =
          c.operand === 0 ? c.value : state.variables.get(String(c.value)) || 0;
        state.gold = Math.max(
          0,
          Math.min(
            99999999,
            (state.gold || 0) + (c.operation === 0 ? value : -value),
          ),
        );
      },
  });
  register("mzItems", {
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.validate.9 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: number is integer; a list of 0, 1 includes; error. */
      /* @function eventRuntime.reviewedvalidate_9 — Validates MZ Change Items identity and operands. Inputs: c with itemId 1-5000, operation/operand flags and integer amount or variable ID. Returns undefined; throws on invalid flags/bounds (direct amount 0-99,999,999 or variable 1-5000). No inventory mutation. */ (
        c,
      ) => {
        if (
          !Number.isInteger(c.itemId) ||
          c.itemId < 1 ||
          c.itemId > 5000 ||
          ![0, 1].includes(c.operation) ||
          ![0, 1].includes(c.operand) ||
          !Number.isInteger(c.value) ||
          c.value < (c.operand === 1 ? 1 : 0) ||
          c.value > (c.operand === 1 ? 5000 : 99999999)
        )
          throw Error("Invalid Change Items operation.");
      },
    execute:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.execute.10 — Handles execute within event runtime. Inputs: c; object pattern. Uses: state variables get; string; state inventory get; state inventory set. */
      /* @function eventRuntime.reviewedexecute_10 — Changes one session item stack. Inputs: validated c and context state with inventory/variables Maps. Returns undefined; resolves direct/current-variable amount, adds/subtracts and clamps stack to 0-99. Deletes zero-count keys rather than retaining empty entries. Missing variable means zero; malformed state throws. */ (
        c,
        { state },
      ) => {
        const key = "item-" + c.itemId,
          value =
            c.operand === 0
              ? c.value
              : state.variables.get(String(c.value)) || 0,
          count = Math.max(
            0,
            Math.min(
              99,
              (state.inventory.get(key) || 0) +
                (c.operation === 0 ? value : -value),
            ),
          );
        if (count) state.inventory.set(key, count);
        else state.inventory.delete(key);
      },
  });
  register("playSE", {
    requiresService: "playSE",
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.validate.11 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: number is integer; error. */
      /* @function eventRuntime.reviewedvalidate_11 — Validates sound effect command settings without decoding audio. Inputs: c.sound with name up to 200 characters, integer volume 0-100 percent, pitch 50-150 percent and pan -100 to 100. Returns undefined; throws on missing/invalid fields. Sound existence/playback remains the service responsibility. */ (
        c,
      ) => {
        const s = c.sound;
        if (
          !s ||
          typeof s.name !== "string" ||
          s.name.length > 200 ||
          !Number.isInteger(s.volume) ||
          s.volume < 0 ||
          s.volume > 100 ||
          !Number.isInteger(s.pitch) ||
          s.pitch < 50 ||
          s.pitch > 150 ||
          !Number.isInteger(s.pan) ||
          s.pan < -100 ||
          s.pan > 100
        )
          throw Error("Invalid Play SE.");
      },
    execute:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.execute.12 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services play se. */
      /* @function eventRuntime.reviewedexecute_12 — Requests effect playback through the host service. Inputs: validated c.sound and context services. Returns undefined; calls services.playSE with the authored settings. No interpreter wait; missing service/playback exceptions propagate, while asynchronous audio handling is service-owned. */ (
        c,
        { services },
      ) => {
        services.playSE(c.sound);
      },
  });
  register("stopSE", {
    requiresService: "stopSE",
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.validate.13 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: no explicit arguments; uses enclosing module state. */
      /* @function eventRuntime.reviewedvalidate_13 — Accepts Stop SE, which has no command-specific parameters. Inputs: none; envelope portability was checked by registry validate. Returns undefined and has no mutation or further validation. */ () => {},
    execute:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.execute.14 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services stop se. */
      /* @function eventRuntime.reviewedexecute_14 — Stops effect playback through the host. Inputs: unused validated c and context services. Returns undefined; invokes services.stopSE. Missing service or synchronous stop error propagates; registry does not own audio voices. */ (
        c,
        { services },
      ) => {
        services.stopSE();
      },
  });
  register("screenTone", {
    requiresService: "screenTone",
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.validate.15 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: array is array; c tone some; number is integer; error. */
      /* @function eventRuntime.reviewedvalidate_15 — Validates screen tone and optional wait. Inputs: c with four integer channels, frame count 0-999 and boolean wait. Returns undefined; RGB offsets must be -255 to 255 and gray amount 0-255. Throws on invalid shape/ranges; no screen mutation. Frames use the authored 60-Hz convention. */ (
        c,
      ) => {
        if (
          !Array.isArray(c.tone) ||
          c.tone.length !== 4 ||
          c.tone.some(
            /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.callback.16 — Returns the inverse of number is integer using v or v is less than i equals 3 selects 0 or - 255 or v is greater than 255. Inputs: v; i. Uses: number is integer. Returns: the inverse of number is integer using v or v is less than i equals 3 selects 0 or - 255 or v is greater than 255. */
      /* @function eventRuntime.reviewedcallback_16 — Detects an invalid tone component. Inputs: component v and index i. Returns true for nonintegers or out-of-range RGB offsets/gray amount. No mutation; array indices 0-2 are RGB and 3 is gray. */ (
              v,
              i,
            ) => !Number.isInteger(v) || v < (i === 3 ? 0 : -255) || v > 255,
          ) ||
          !Number.isInteger(c.frames) ||
          c.frames < 0 ||
          c.frames > 999 ||
          typeof c.wait !== "boolean"
        )
          throw Error("Invalid screen tone.");
      },
    execute:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.execute.17 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services screen tone. Returns: c wait and c frames selects a record containing wait or undefined. */
      /* @function eventRuntime.reviewedexecute_17 — Starts host screen-tone tween. Inputs: validated c and services. Returns a wait directive in seconds (frames/60) only when requested and nonzero, otherwise undefined. Calls screenTone with channel array and authored frames; service errors propagate. */ (
        c,
        { services },
      ) => {
        services.screenTone(c.tone, c.frames);
        return c.wait && c.frames ? { wait: c.frames / 60 } : undefined;
      },
  });
  register("screenShake", {
    requiresService: "screenShake",
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.validate.18 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: number is integer; error. */
      /* @function eventRuntime.reviewedvalidate_18 — Validates screen shake parameters. Inputs: c with integer power/speed 1-9, frames 1-999 and boolean wait. Returns undefined; throws on invalid shape/ranges. No shake starts here; frames are authored 60-Hz units, power/speed are renderer settings. */ (
        c,
      ) => {
        if (
          !Number.isInteger(c.power) ||
          c.power < 1 ||
          c.power > 9 ||
          !Number.isInteger(c.speed) ||
          c.speed < 1 ||
          c.speed > 9 ||
          !Number.isInteger(c.frames) ||
          c.frames < 1 ||
          c.frames > 999 ||
          typeof c.wait !== "boolean"
        )
          throw Error("Invalid screen shake.");
      },
    execute:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.execute.19 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services screen shake. Returns: c wait selects a record containing wait or undefined. */
      /* @function eventRuntime.reviewedexecute_19 — Starts host screen shake. Inputs: validated c and services. Returns frames/60 seconds wait when c.wait, otherwise undefined. Calls screenShake(power,speed,frames); host owns waveform and cleanup, synchronous errors propagate. */ (
        c,
        { services },
      ) => {
        services.screenShake(c.power, c.speed, c.frames);
        return c.wait ? { wait: c.frames / 60 } : undefined;
      },
  });
  register("screenFlash", {
    requiresService: "screenFlash",
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.validate.20 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: array is array; c color some; number is integer; error. */
      /* @function eventRuntime.reviewedvalidate_20 — Validates screen flash color/duration. Inputs: c with four integer RGBA values 0-255, frames 1-999 and boolean wait. Returns undefined or throws before rendering. Frames are authored 60-Hz units; no state mutation. */ (
        c,
      ) => {
        if (
          !Array.isArray(c.color) ||
          c.color.length !== 4 ||
          c.color.some(
            /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.callback.21 — Returns the inverse of number is integer using v or v is less than 0 or v is greater than 255. Inputs: v. Uses: number is integer. Returns: the inverse of number is integer using v or v is less than 0 or v is greater than 255. */
      /* @function eventRuntime.reviewedcallback_21 — Detects invalid flash channel bytes. Inputs: v. Returns true for a noninteger or value outside 0-255. No mutation; used for all four RGBA channels. */ (
              v,
            ) => !Number.isInteger(v) || v < 0 || v > 255,
          ) ||
          !Number.isInteger(c.frames) ||
          c.frames < 1 ||
          c.frames > 999 ||
          typeof c.wait !== "boolean"
        )
          throw Error("Invalid screen flash.");
      },
    execute:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.execute.22 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services screen flash. Returns: c wait selects a record containing wait or undefined. */
      /* @function eventRuntime.reviewedexecute_22 — Starts host screen flash. Inputs: validated c and services. Returns wait seconds frames/60 if requested, otherwise undefined. Calls screenFlash(color,frames); host owns fade/release and errors propagate. */ (
        c,
        { services },
      ) => {
        services.screenFlash(c.color, c.frames);
        return c.wait ? { wait: c.frames / 60 } : undefined;
      },
  });
  register("screenFade", {
    requiresService: "screenFade",
    blocksMessage: true,
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.validate.23 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: error. */
      /* @function eventRuntime.reviewedvalidate_23 — Validates screen fade direction. Inputs: c.out. Returns undefined if boolean, otherwise throws. No screen change; true means fade out and false fade in. */ (
        c,
      ) => {
        if (typeof c.out !== "boolean") throw Error("Invalid screen fade.");
      },
    execute:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.execute.24 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services screen fade. Returns: a record containing wait. */
      /* @function eventRuntime.reviewedexecute_24 — Starts a host fade and blocks interpreter advancement for its fixed duration. Inputs: validated c and services. Returns wait directive of 0.4 seconds after screenFade(c.out). Service must implement matching timing; missing service/errors propagate. */ (
        c,
        { services },
      ) => {
        services.screenFade(c.out);
        return { wait: 0.4 };
      },
  });
  register("playerTransparency", {
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.validate.25 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: error. */
      /* @function eventRuntime.reviewedvalidate_25 — Validates player transparency toggle. Inputs: c.value. Returns undefined only for a boolean, otherwise throws. Does not modify actor/render state. */ (
        c,
      ) => {
        if (typeof c.value !== "boolean")
          throw Error("Invalid player transparency.");
      },
    execute:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.execute.26 — Handles execute within event runtime. Inputs: c; object pattern. Updates: player transparent. */
      /* @function eventRuntime.reviewedexecute_26 — Sets runtime player transparency. Inputs: validated c and context player. Returns undefined; writes player.transparent only, leaving authored source unchanged. Invalid context throws; renderer/interpreter use this flag thereafter. */ (
        c,
        { player },
      ) => {
        player.transparent = c.value;
      },
  });
  register("replaceEvent", {
    requiresService: "templateBank",
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.validate.27 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: c. Uses: /^[A-Za-z0-9_-]{1,64}$/ test; number is safe integer; a list of "reset", "preserve" includes; error. */
      /* @function eventRuntime.reviewedvalidate_27 — Validates live event replacement references. Inputs: c.target/template ASCII IDs 1-64 characters, positive safe integer version and reset/preserve statePolicy. Returns undefined; throws on invalid fields. Bank membership/version compatibility are checked at execution by replacement service. */ (
        c,
      ) => {
        if (
          typeof c.target !== "string" ||
          !/^[A-Za-z0-9_-]{1,64}$/.test(c.target) ||
          typeof c.template !== "string" ||
          !/^[A-Za-z0-9_-]{1,64}$/.test(c.template) ||
          !Number.isSafeInteger(c.version) ||
          c.version < 1 ||
          !["reset", "preserve"].includes(c.statePolicy)
        )
          throw Error("Invalid Replace Event command.");
      },
    execute:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.execute.28 — Handles execute within event runtime. Inputs: c; object pattern. Uses: services current map; error; replace event; services template bank. */
      /* @function eventRuntime.reviewedexecute_28 — Replaces an event using a configured template bank. Inputs: validated c and context services/interpreter/replaceEvent. Returns undefined; resolves this to origin event ID and requests version/statePolicy replacement. Throws before replacement when origin map differs from current map; service owns atomic validation/cancellation and propagates errors. */ (
        c,
        { services, interpreter, replaceEvent },
      ) => {
        if (
          interpreter.originMap &&
          services.currentMap &&
          interpreter.originMap !== services.currentMap()
        )
          throw Error("Replace Event cannot target events on a departed map.");
        replaceEvent(
          c.target === "this" ? interpreter.eventId : c.target,
          services.templateBank(),
          c.template,
          { version: c.version, statePolicy: c.statePolicy },
        );
      },
  });
  root.FrontierEventRuntime = {
    register,
    validate,
    preflight,
    execute,
    has: /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.has.29 — Returns handlers has using type. Inputs: type. Uses: handlers has. Returns: handlers has using type. */
      /* @function eventRuntime.reviewedhas_29 — Tests custom-handler registration. Inputs: command type. Returns Map membership boolean; reserved builtins are not in this registry. No mutation or command execution. */ (
      type,
    ) => handlers.has(type),
    get: /* Historical contract retained; October 14 reviewed explanation follows. @function event-runtime.get.30 — Returns handlers get using type. Inputs: type. Uses: handlers get. Returns: handlers get using type. */
      /* @function eventRuntime.reviewedget_30 — Retrieves the shallow frozen registered handler definition. Inputs: command type. Returns definition or undefined for missing types. No mutation; returned nested records/functions remain original references. */ (
      type,
    ) => handlers.get(type),
  };
})(typeof window === "undefined" ? globalThis : window);
