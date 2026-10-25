/* Extensible condition expressions. UI and interpreter share this evaluator.
 * An extension registers validation and evaluation together. Data stays JSON.
 * MZ's checkbox conditions lower to an AND group; richer groups use the same AST. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function event-conditions.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier conditions. Uses: register. */
(/* @function event-conditions.installReviewed — Installs shared JSON condition validation/evaluation and extension registration. UI and interpreter use the same expression AST; ordinary MZ conditions become an AND group. Inputs: browser/global namespace root. Returns nothing; exposes the module API and initializes its private registration/cache state. Dependency or registration errors propagate. Does not create a second active simulation; exported operations own later session/UI work. */ function (
  root,
) {
  "use strict";
  const definitions = new Map(),
    comparisons = new Set(["eq", "ne", "lt", "le", "gt", "ge"]);
  const key =
    /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.key.2 — Returns typeof v equals "string" and v length is greater than 0 and v length is at most 120. Inputs: v. Returns: typeof v equals "string" and v length is greater than 0 and v length is at most 120. */
  /* @function eventConditions.reviewedkey_2 — Tests nonempty condition identifier. Inputs: v. Returns string length1-120 predicate; no ASCII-only restriction/mutation. */ (
      v,
    ) => typeof v === "string" && v.length > 0 && v.length <= 120;
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.register.3 — Handles register within event conditions. Inputs: type; definition. Uses: key; definitions has; error; definitions set. */
  /* @function eventConditions.reviewedregister_3 — Registers condition kind once. Inputs: type and definition with validate/evaluate callbacks. Returns undefined; rejects invalid/duplicate ID or missing callbacks, stores shallow frozen definition in private registry. No evaluation; malformed null definition may throw TypeError. Nested definition values retained. */ function register(
    type,
    definition,
  ) {
    if (
      !key(type) ||
      definitions.has(type) ||
      typeof definition.validate !== "function" ||
      typeof definition.evaluate !== "function"
    )
      throw Error("Condition requires a unique type, validator and evaluator.");
    definitions.set(type, Object.freeze({ ...definition }));
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.value.4 — Handles value within event conditions. Inputs: v. Uses: a list of "constant", "variable" includes; error; key; number is finite. Returns: a record containing kind, key; a record containing kind, value. */
  /* @function eventConditions.reviewedvalue_4 — Normalizes comparison operand. Inputs: v. Returns variable kind/key or constant kind/value record; permits boolean/string/finite number constants, rejects absent/unknown kind/invalid key/value. No source mutation. */ function value(
    v,
  ) {
    if (!v || !["constant", "variable"].includes(v.kind))
      throw Error("Invalid comparison operand.");
    if (v.kind === "variable") {
      if (!key(v.key)) throw Error("Invalid variable key.");
      return { kind: v.kind, key: v.key };
    }
    if (
      typeof v.value !== "boolean" &&
      typeof v.value !== "string" &&
      !(typeof v.value === "number" && Number.isFinite(v.value))
    )
      throw Error("Invalid constant operand.");
    return { kind: v.kind, value: v.value };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.read.5 — Handles read within event conditions. Inputs: v; state. Uses: state variables get. Returns: v kind equals "variable" selects chain or the fallback 0 or v value. */
  /* @function eventConditions.reviewedread_5 — Reads comparison operand from session. Inputs: validated v and state. Returns Map variable value(default0) or constant. No mutation; optional missing variables supported. */ function read(
    v,
    state,
  ) {
    return v.kind === "variable" ? (state.variables?.get(v.key) ?? 0) : v.value;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.validate.6 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: expression; assignment pattern; assignment pattern. Uses: error; definitions has; definitions get using expression type validate; definitions get. Returns: a record containing copied fields, copied fields, type. */
  /* @function eventConditions.reviewedvalidate_6 — Validates/copies condition expression with bounded recursion. Inputs: expression, depth(default0) and shared budget(default256 nodes). Returns cloned original fields merged with kind-validator output and original type. Decrements local budget, rejects depth>16, exhausted nodes or unregistered type; extension validator receives recursive check. No gameplay mutation; clone/validator errors propagate, unknown extra fields remain. */ function validate(
    expression,
    depth = 0,
    budget = { remaining: 256 },
  ) {
    if (--budget.remaining < 0 || depth > 16)
      throw Error("Condition expression is too complex.");
    if (!expression || !definitions.has(expression.type))
      throw Error("Unsupported condition: " + (expression?.type || "missing"));
    const data = definitions
      .get(expression.type)
      .validate(
        expression,
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.callback.7 — Returns validate using e, depth plus 1, budget. Inputs: e. Uses: validate. Returns: validate using e, depth plus 1, budget. */
  /* @function eventConditions.reviewedcallback_7 — Validates one child with shared expression budget. Inputs: e. Returns validated child at depth+1; mutates only remaining budget. Errors reject enclosing expression. */ (
          e,
        ) => validate(e, depth + 1, budget),
      );
    return { ...structuredClone(expression), ...data, type: expression.type };
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.evaluate.8 — Handles evaluate within event conditions. Inputs: expression; context. Uses: definitions get; error; d evaluate. Returns: the inverse of the inverse of d evaluate using expression, context, a callback. */
  /* @function eventConditions.reviewedevaluate_8 — Evaluates registered validated condition against live context. Inputs: expression/context. Returns boolean coerced from kind evaluator result; recursive child callback shares context. Unknown type throws; no built-in mutation but extension evaluator owns any side effects. Assumes validated bounded tree; no runtime recursion guard here. */ function evaluate(
    expression,
    context,
  ) {
    const d = definitions.get(expression.type);
    if (!d)
      throw Error("Cannot execute unsupported condition " + expression.type);
    return !!d.evaluate(
      expression,
      context,
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.callback.9 — Returns evaluate using e, context. Inputs: e. Uses: evaluate. Returns: evaluate using e, context. */
  /* @function eventConditions.reviewedcallback_9 — Evaluates child condition in same context. Inputs: e. Returns boolean evaluator result; no built-in mutation, extension errors propagate. */ (
        e,
      ) => evaluate(e, context),
    );
  }
  register("all", {
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.validate.10 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e; check. Uses: array is array; error; e children map. Returns: a record containing children. */
  /* @function eventConditions.reviewedvalidate_10 — Validates AND group. Inputs: e and child check callback. Returns validated children array; requires array, rejects via recursive checks. No source mutation; empty group allowed. */ (
        e,
        check,
      ) => {
        if (!Array.isArray(e.children)) throw Error("AND needs conditions.");
        return { children: e.children.map(check) };
      },
    evaluate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.evaluate.11 — Returns e children every using test. Inputs: e; c; test. Uses: e children every. Returns: e children every using test. */
  /* @function eventConditions.reviewedevaluate_11 — Evaluates AND group with short-circuit. Inputs: e, unused context c and recursive test. Returns every child true; empty group true. No built-in mutation; test failures propagate. */ (
        e,
        c,
        test,
      ) => e.children.every(test),
  });
  register("any", {
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.validate.12 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e; check. Uses: array is array; error; e children map. Returns: a record containing children. */
  /* @function eventConditions.reviewedvalidate_12 — Validates OR group. Inputs: e/check. Returns checked child array or throws if nonarray/invalid child. No source mutation; empty group allowed. */ (
        e,
        check,
      ) => {
        if (!Array.isArray(e.children)) throw Error("OR needs conditions.");
        return { children: e.children.map(check) };
      },
    evaluate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.evaluate.13 — Returns e children some using test. Inputs: e; c; test. Uses: e children some. Returns: e children some using test. */
  /* @function eventConditions.reviewedevaluate_13 — Evaluates OR with short-circuit. Inputs: e, unused c and test. Returns some child true, empty false. No built-in mutation; test errors propagate. */ (
        e,
        c,
        test,
      ) => e.children.some(test),
  });
  register("not", {
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.validate.14 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e; check. Uses: check. Returns: a record containing child. */
  /* @function eventConditions.reviewedvalidate_14 — Validates negated child. Inputs: e/check. Returns checked child record; missing/invalid child throws. No mutation. */ (
        e,
        check,
      ) => ({ child: check(e.child) }),
    evaluate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.evaluate.15 — Returns the inverse of test using e child. Inputs: e; c; test. Uses: test. Returns: the inverse of test using e child. */
  /* @function eventConditions.reviewedevaluate_15 — Evaluates NOT. Inputs: e, unused c and test. Returns inverse child boolean; no built-in mutation, test errors propagate. */ (
        e,
        c,
        test,
      ) => !test(e.child),
  });
  register("compare", {
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.validate.16 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: comparisons has; error; value. Returns: a record containing left, right, operator. */
  /* @function eventConditions.reviewedvalidate_16 — Validates two-operand comparison. Inputs: e. Returns normalized left/right/operator for eq/ne/lt/le/gt/ge, throws unknown operator or invalid operands. No mutation. */ (
        e,
      ) => {
        if (!comparisons.has(e.operator)) throw Error("Unknown comparison.");
        return {
          left: value(e.left),
          right: value(e.right),
          operator: e.operator,
        };
      },
    evaluate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.evaluate.17 — Handles evaluate within event conditions. Inputs: e; c. Uses: read; a record containing eq, ne, lt, le, gt, ge at e operator. Returns: a record containing eq, ne, lt, le, gt, ge at e operator using . */
  /* @function eventConditions.reviewedevaluate_17 — Evaluates generic comparison from session operands. Inputs: e/context c.state. Returns strict equality/inequality or JavaScript ordered comparison selected by validated operator; ordered mixed-type coercion follows JS. No state mutation, invalid operator would throw. */ (
        e,
        c,
      ) => {
        const a = read(e.left, c.state),
          b = read(e.right, c.state);
        return {
          eq: /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.eq.18 — Returns a equals b. Inputs: no explicit arguments; uses enclosing module state. Returns: a equals b. */
  /* @function eventConditions.reviewedeq_18 — Applies strict equality to captured operands. Inputs: none. Returns comparison boolean for a/b; no state mutation. Ordered operators follow JavaScript coercion; operands validated by enclosing comparison. */ () =>
            a === b,
          ne: /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.ne.19 — Returns a does not equal b. Inputs: no explicit arguments; uses enclosing module state. Returns: a does not equal b. */
  /* @function eventConditions.reviewedne_19 — Applies strict inequality to captured operands. Inputs: none. Returns comparison boolean for a/b; no state mutation. Ordered operators follow JavaScript coercion; operands validated by enclosing comparison. */ () =>
            a !== b,
          lt: /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.lt.20 — Returns a is less than b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is less than b. */
  /* @function eventConditions.reviewedlt_20 — Applies less than to captured operands. Inputs: none. Returns comparison boolean for a/b; no state mutation. Ordered operators follow JavaScript coercion; operands validated by enclosing comparison. */ () =>
            a < b,
          le: /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.le.21 — Returns a is at most b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is at most b. */
  /* @function eventConditions.reviewedle_21 — Applies less than or equal to captured operands. Inputs: none. Returns comparison boolean for a/b; no state mutation. Ordered operators follow JavaScript coercion; operands validated by enclosing comparison. */ () =>
            a <= b,
          gt: /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.gt.22 — Returns a is greater than b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is greater than b. */
  /* @function eventConditions.reviewedgt_22 — Applies greater than to captured operands. Inputs: none. Returns comparison boolean for a/b; no state mutation. Ordered operators follow JavaScript coercion; operands validated by enclosing comparison. */ () =>
            a > b,
          ge: /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.ge.23 — Returns a is at least b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is at least b. */
  /* @function eventConditions.reviewedge_23 — Applies greater than or equal to captured operands. Inputs: none. Returns comparison boolean for a/b; no state mutation. Ordered operators follow JavaScript coercion; operands validated by enclosing comparison. */ () =>
            a >= b,
        }[e.operator]();
      },
  });
  for (const type of ["switch", "selfSwitch", "item", "actor", "quest"])
    register(type, {
      validate:
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.validate.24 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: key; error; a list of "A", "B", "C", "D" includes; number is finite. Returns: a record containing key, copied fields. */
  /* @function eventConditions.reviewedvalidate_24 — Validates named switch/self-switch/item/actor/quest leaf. Inputs: e and captured type. Returns key plus count for item or value defaulttrue. Self-switch key A-D, item count finite nonnegative; other value types not narrowed here. No mutation; invalid key/count throws. */ (
          e,
        ) => {
          if (!key(e.key)) throw Error("Invalid " + type + " key.");
          if (type === "selfSwitch" && !["A", "B", "C", "D"].includes(e.key))
            throw Error("Self switch must be A–D.");
          if (type === "item" && (!Number.isFinite(e.count) || e.count < 0))
            throw Error("Invalid item count.");
          return {
            key: e.key,
            ...(type === "item"
              ? { count: e.count }
              : { value: e.value ?? true }),
          };
        },
      evaluate:
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.evaluate.25 — Handles evaluate within event conditions. Inputs: e; c. Uses: c state switches get; c state self switches get; c state inventory get; c state actors has. Returns: chain or the fallback false equals e value; chain or the fallback false equals e value. */
  /* @function eventConditions.reviewedevaluate_25 — Evaluates named state leaf. Inputs: e/c with state/eventId. Returns switch/selfSwitch equality(defaultfalse), item quantity>=count(default0), actor membership equality or quest value equality. Self-switch key eventId:key. No state mutation; optional missing collections yield defaults. */ (
          e,
          c,
        ) => {
          if (type === "switch")
            return (c.state.switches?.get(e.key) ?? false) === e.value;
          if (type === "selfSwitch")
            return (
              (c.state.selfSwitches?.get((c.eventId || "") + ":" + e.key) ??
                false) === e.value
            );
          if (type === "item")
            return (c.state.inventory?.get(e.key) || 0) >= e.count;
          if (type === "actor") return !!c.state.actors?.has(e.key) === e.value;
          return c.state.quests?.get(e.key) === e.value;
        },
    });
  // Numeric checks deliberately avoid random rolls: repeated page queries must be stable.
  for (const type of ["skill", "reputation"])
    register(type, {
      validate:
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.validate.26 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: key; comparisons has; number is finite; error. Returns: a record containing key, operator, value. */
  /* @function eventConditions.reviewedvalidate_26 — Validates deterministic skill/reputation threshold. Inputs: e and captured type. Returns key/operator/finite value magnitude<=1million; invalid values/operators throw. No random roll or mutation. */ (
          e,
        ) => {
          if (
            !key(e.key) ||
            !comparisons.has(e.operator) ||
            !Number.isFinite(e.value) ||
            Math.abs(e.value) > 1000000
          )
            throw Error("Invalid " + type + " condition.");
          return { key: e.key, operator: e.operator, value: e.value };
        },
      evaluate:
        /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.evaluate.27 — Handles evaluate within event conditions. Inputs: e; c. Uses: c state at type equals "skill" selects "skills" or "reputation" get; a record containing eq, ne, lt, le, gt, ge at e operator. Returns: a record containing eq, ne, lt, le, gt, ge at e operator using . */
  /* @function eventConditions.reviewedevaluate_27 — Compares live skill/reputation with authored threshold. Inputs: e/c.state and captured type. Returns validated comparison boolean, missing value0. No mutation/randomness; invalid operator would throw. */ (
          e,
          c,
        ) => {
          const a =
              c.state[type === "skill" ? "skills" : "reputation"]?.get(e.key) ??
              0,
            b = e.value;
          return {
            eq: /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.eq.28 — Returns a equals b. Inputs: no explicit arguments; uses enclosing module state. Returns: a equals b. */
  /* @function eventConditions.reviewedeq_28 — Applies strict equality to captured operands. Inputs: none. Returns comparison boolean for a/b; no state mutation. Ordered operators follow JavaScript coercion; operands validated by enclosing comparison. */ () =>
              a === b,
            ne: /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.ne.29 — Returns a does not equal b. Inputs: no explicit arguments; uses enclosing module state. Returns: a does not equal b. */
  /* @function eventConditions.reviewedne_29 — Applies strict inequality to captured operands. Inputs: none. Returns comparison boolean for a/b; no state mutation. Ordered operators follow JavaScript coercion; operands validated by enclosing comparison. */ () =>
              a !== b,
            lt: /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.lt.30 — Returns a is less than b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is less than b. */
  /* @function eventConditions.reviewedlt_30 — Applies less than to captured operands. Inputs: none. Returns comparison boolean for a/b; no state mutation. Ordered operators follow JavaScript coercion; operands validated by enclosing comparison. */ () =>
              a < b,
            le: /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.le.31 — Returns a is at most b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is at most b. */
  /* @function eventConditions.reviewedle_31 — Applies less than or equal to captured operands. Inputs: none. Returns comparison boolean for a/b; no state mutation. Ordered operators follow JavaScript coercion; operands validated by enclosing comparison. */ () =>
              a <= b,
            gt: /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.gt.32 — Returns a is greater than b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is greater than b. */
  /* @function eventConditions.reviewedgt_32 — Applies greater than to captured operands. Inputs: none. Returns comparison boolean for a/b; no state mutation. Ordered operators follow JavaScript coercion; operands validated by enclosing comparison. */ () =>
              a > b,
            ge: /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.ge.33 — Returns a is at least b. Inputs: no explicit arguments; uses enclosing module state. Returns: a is at least b. */
  /* @function eventConditions.reviewedge_33 — Applies greater than or equal to captured operands. Inputs: none. Returns comparison boolean for a/b; no state mutation. Ordered operators follow JavaScript coercion; operands validated by enclosing comparison. */ () =>
              a >= b,
          }[e.operator]();
        },
    });
  register("faction", {
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.validate.34 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: key; error. Returns: a record containing key, value. */
  /* @function eventConditions.reviewedvalidate_34 — Validates faction membership condition. Inputs: e. Returns key/boolean value or throws. No mutation. */ (
        e,
      ) => {
        if (!key(e.key) || typeof e.value !== "boolean")
          throw Error("Invalid faction condition.");
        return { key: e.key, value: e.value };
      },
    evaluate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.evaluate.35 — Returns chain or the fallback false equals e value. Inputs: e; c. Uses: c state factions get. Returns: chain or the fallback false equals e value. */
  /* @function eventConditions.reviewedevaluate_35 — Tests faction membership equality. Inputs: e/c.state. Returns stored boolean(defaultfalse) equality; no mutation. */ (
        e,
        c,
      ) => (c.state.factions?.get(e.key) ?? false) === e.value,
  });
  register("distance", {
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.validate.36 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: key; number is finite; error. Returns: a record containing target, radius. */
  /* @function eventConditions.reviewedvalidate_36 — Validates spatial distance condition. Inputs: e. Returns target ID and finite nonnegative radius metres, no upper bound here; invalid fields throw. No mutation. */ (
        e,
      ) => {
        if (!key(e.target) || !Number.isFinite(e.radius) || e.radius < 0)
          throw Error("Invalid distance condition.");
        return { target: e.target, radius: e.radius };
      },
    evaluate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.evaluate.37 — Handles evaluate within event conditions. Inputs: e; c. Uses: c resolve entity. Returns: the inverse of the inverse of a and the inverse of the inverse of b and math hypot using a x minus b x, a y minus b y is at most e radius. */
  /* @function eventConditions.reviewedevaluate_37 — Tests subject-to-target XY distance. Inputs: e and c.subject/resolveEntity. Returns false absent endpoints, otherwise Euclidean XY<=radius metres; elevation ignored. No state mutation; resolver errors propagate and cache treats spatial conditions dynamic. */ (
        e,
        c,
      ) => {
        const a = c.subject,
          b = c.resolveEntity?.(e.target);
        return !!a && !!b && Math.hypot(a.x - b.x, a.y - b.y) <= e.radius;
      },
  });
  register("timer", {
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.validate.38 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: number is integer; a list of "ge", "le" includes; error. Returns: a record containing seconds, operator. */
  /* @function eventConditions.reviewedvalidate_38 — Validates timer threshold. Inputs: e. Returns integer nonnegative seconds and ge/le operator, no upper bound here. Throws invalid fields; no mutation. */ (
        e,
      ) => {
        if (
          !Number.isInteger(e.seconds) ||
          e.seconds < 0 ||
          !["ge", "le"].includes(e.operator)
        )
          throw Error("Invalid timer condition.");
        return { seconds: e.seconds, operator: e.operator };
      },
    evaluate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.evaluate.39 — Returns the inverse of the inverse of chain and e operator equals "ge" selects c state timer remaining is at least e seconds or c state timer remaining is at most e seconds. Inputs: e; c. Returns: the inverse of the inverse of chain and e operator equals "ge" selects c state timer remaining is at least e seconds or c state timer remaining is at most e seconds. */
  /* @function eventConditions.reviewedevaluate_39 — Tests running session timer. Inputs: e/c.state.timer. Returns false stopped/missing, otherwise remaining seconds>=or<=threshold. No mutation; current time must bypass page cache. */ (
        e,
        c,
      ) =>
        !!c.state.timer?.running &&
        (e.operator === "ge"
          ? c.state.timer.remaining >= e.seconds
          : c.state.timer.remaining <= e.seconds),
  });
  register("gold", {
    validate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.validate.40 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: e. Uses: number is integer; a list of "ge", "le", "lt" includes; error. Returns: a record containing amount, operator. */
  /* @function eventConditions.reviewedvalidate_40 — Validates gold threshold. Inputs: e. Returns integer amount0-99,999,999 and ge/le/lt operator, otherwise throws. No mutation. */ (
        e,
      ) => {
        if (
          !Number.isInteger(e.amount) ||
          e.amount < 0 ||
          e.amount > 99999999 ||
          !["ge", "le", "lt"].includes(e.operator)
        )
          throw Error("Invalid gold condition.");
        return { amount: e.amount, operator: e.operator };
      },
    evaluate:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.evaluate.41 — Handles evaluate within event conditions. Inputs: e; c. Returns: e operator equals "ge" selects gold is at least e amount or e operator equals "le" selects gold is at most e amount or gold is less than e amount. */
  /* @function eventConditions.reviewedevaluate_41 — Tests session gold against threshold. Inputs: e/c.state. Returns selected comparison, missing gold0. No mutation, validated operator assumed. */ (
        e,
        c,
      ) => {
        const gold = c.state.gold ?? 0;
        return e.operator === "ge"
          ? gold >= e.amount
          : e.operator === "le"
            ? gold <= e.amount
            : gold < e.amount;
      },
  });
  /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.legacy.42 — Handles legacy within event conditions. Inputs: c. Uses: validate. Returns: validate using c expression; a record containing type, children. */
  /* @function eventConditions.reviewedlegacy_42 — Lowers legacy page condition into expression shape. Inputs: c. Returns validated existing expression, empty AND for always, variable>=constant, item quantity condition or named true-value leaf. Does not validate every lowered leaf itself; outer validation owns supported types/bounds. No mutation. */ function legacy(
    c,
  ) {
    if (c.type === "expression") return validate(c.expression);
    if (c.type === "always") return { type: "all", children: [] };
    if (c.type === "variable")
      return {
        type: "compare",
        operator: "ge",
        left: { kind: "variable", key: c.key },
        right: { kind: "constant", value: c.value },
      };
    if (c.type === "item") return { type: "item", key: c.key, count: c.value };
    return { type: c.type, key: c.key, value: true };
  }
  root.FrontierConditions = {
    register,
    validate,
    evaluate,
    legacy,
    types:
      /* Historical contract retained; October 14 reviewed explanation follows. @function event-conditions.types.43 — Returns a list of spread element. Inputs: no explicit arguments; uses enclosing module state. Uses: definitions keys. Returns: a list of spread element. */
  /* @function eventConditions.reviewedtypes_43 — Lists registered condition IDs. Inputs: none. Returns new array in registration order; no mutation or execution. */ () => [
        ...definitions.keys(),
      ],
  };
})(typeof window === "undefined" ? globalThis : window);
