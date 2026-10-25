/* Structural editing is independent from command dialogs and runtime lowering. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier mzcommand editing. */
(/* @function mz-command-editing.installReviewed — Installs structural command-list editing helpers independently of parameter dialogs and runtime lowering. Branch/group integrity belongs to these authored-data operations, not live interpreter mutation. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  const marker =
    /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.marker.2 — Returns a record containing type, code, indent, parameters. Inputs: code; indent. Returns: a record containing type, code, indent, parameters. */
  /* @function mz-command-editing.marker.2Reviewed — Creates an empty MZ structural command marker. Inputs: numeric command code and nesting indent. Returns fresh type/code/indent/empty-parameters record; no validation or authored-list mutation. */ (
      code,
      indent,
    ) => ({ type: "mz", code, indent, parameters: [] });
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.bounds.3 — Calculates or applies the enclosing limits for this module’s data. Inputs: commands; index. Updates: otherwise. Uses: error. Returns: a record containing end, otherwise. */
  /* @function mz-command-editing.bounds.3Reviewed — Finds matching End and optional Else for a conditional branch. Inputs: command array and opener index. Returns end index and otherwise index (-1 if absent), tracking nested MZ 111/412 pairs while ignoring other command types. Throws if opener is not code 111 or no End exists. Does not mutate commands; assumes structurally valid nesting beyond these checks. */ function bounds(
    commands,
    index,
  ) {
    if (commands[index]?.code !== 111)
      throw Error("Expected Conditional Branch.");
    let depth = 0,
      otherwise = -1;
    for (let i = index + 1; i < commands.length; i++) {
      const c = commands[i];
      if (c.type !== "mz") continue;
      if (c.code === 111) depth++;
      else if (c.code === 412) {
        if (depth === 0) return { end: i, otherwise };
        depth--;
      } else if (c.code === 411 && depth === 0) otherwise = i;
    }
    throw Error("Conditional Branch has no End.");
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.insertBranch.4 — Handles insert branch within mz command editing. Inputs: command. Uses: structured clone; marker. Returns: a list of c, marker using 0, indent plus 1, spread element, marker using 412, indent. */
  /* @function mz-command-editing.insertBranch.4Reviewed — Constructs an insertable conditional branch block. Inputs: authored opener with optional createElse flag. Returns cloned opener, empty body marker, optional Else/body and End at matching indentation. Removes the authoring-only flag from clone; input remains unchanged. Clone errors propagate; caller validates opener parameters and commits insertion. */ function insertBranch(
    command,
  ) {
    const c = structuredClone(command),
      withElse = !!c.createElse;
    delete c.createElse;
    const indent = c.indent || 0;
    return [
      c,
      marker(0, indent + 1),
      ...(withElse ? [marker(411, indent), marker(0, indent + 1)] : []),
      marker(412, indent),
    ];
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.replaceBranch.5 — Handles replace branch within mz command editing. Inputs: commands; index; command. Updates: c indent; commands at index. Uses: bounds; structured clone; commands splice; marker. Returns: commands. */
  /* @function mz-command-editing.replaceBranch.5Reviewed — Replaces a conditional opener while retaining or removing its bodies. Inputs: mutable command list, opener index and new opener/createElse flag. Returns the same list after preserving original indent, replacing opener and adding missing Else or deleting the entire old Else section when disabled. Bounds/clone errors occur before first write; later mutation errors are not locally rolled back. Host owns Undo and list validation. */ function replaceBranch(
    commands,
    index,
    command,
  ) {
    const { end, otherwise } = bounds(commands, index),
      c = structuredClone(command),
      withElse = !!c.createElse;
    delete c.createElse;
    c.indent = commands[index].indent;
    commands[index] = c;
    if (withElse && otherwise < 0)
      commands.splice(end, 0, marker(411, c.indent), marker(0, c.indent + 1));
    else if (!withElse && otherwise >= 0)
      commands.splice(otherwise, end - otherwise);
    return commands;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.groupRange.6 — Handles group range within mz command editing. Inputs: commands; start; assignment pattern. Updates: changed; start; end. Uses: commands for each; a list of b start, b end, spread element some. Returns: a list of start, end. */
  /* @function mz-command-editing.groupRange.6Reviewed — Expands a selected command range to include complete structural blocks when their opener/closer/section markers are selected. Inputs: command list and inclusive start/end indices, default single row. Returns expanded pair; scans conditional, loop, choices and battle blocks, including named branch/end equivalents, then expands until stable. Does not mutate list or repair malformed/unclosed blocks. Selecting only a body row need not select its entire enclosing block. */ function groupRange(
    commands,
    start,
    end = start,
  ) {
    const openers = new Map([
        [111, 412],
        [112, 413],
        [102, 404],
        [301, 604],
      ]),
      sections = new Set([411, 402, 403, 601, 602, 603]),
      stack = [],
      ranges = [];
    commands.forEach(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.callback.7 — Provides the callback for commands for each. Inputs: c; i. Uses: openers has; stack push; openers get; sections has. */
  /* @function mz-command-editing.callback.7Reviewed — Collects completed structural block ranges from one command row. Inputs: command and array index. Returns nothing; updates local nesting stack/sections/ranges using MZ codes or named branch/end. Unmatched markers are ignored by this scanner; no command mutation or schema validation. */ (
        c,
        i,
      ) => {
        const code =
          c.type === "mz"
            ? c.code
            : c.type === "branch"
              ? 111
              : c.type === "end"
                ? 412
                : 0;
        if (openers.has(code))
          stack.push({ start: i, endCode: openers.get(code), sections: [] });
        else if (sections.has(code) && stack.length)
          stack.at(-1).sections.push(i);
        else if (stack.at(-1)?.endCode === code) {
          const block = stack.pop();
          ranges.push({ ...block, end: i });
        }
      },
    );
    let changed = true;
    while (changed) {
      changed = false;
      for (const b of ranges)
        if (
          [b.start, b.end, ...b.sections].some(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.callback.8 — Returns start is at most i and i is at most end. Inputs: i. Returns: start is at most i and i is at most end. */
  /* @function mz-command-editing.callback.8Reviewed — Tests whether a block boundary/section index lies inside the current selection. Inputs: marker row index. Returns inclusive start <= index <= end; enclosing expansion uses this to keep selected structures whole. No mutation. */ (
              i,
            ) => start <= i && i <= end,
          ) &&
          (b.start < start || b.end > end)
        ) {
          start = Math.min(start, b.start);
          end = Math.max(end, b.end);
          changed = true;
        }
    }
    return [start, end];
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.rebase.9 — Handles rebase within mz command editing. Inputs: commands; indent. Uses: number is integer; error; commands filter; mz map. Returns: commands map using a callback. */
  /* @function mz-command-editing.rebase.9Reviewed — Clones commands for paste at a new indentation. Inputs: command array and target indent 0–32. Returns cloned list with MZ indent offsets preserved relative to the lowest source MZ indent; non-MZ records are copied unchanged. Throws for invalid target, nesting above 32 or clone failure, without changing source list. Assumes source command indentation was already validated. */ function rebase(
    commands,
    indent,
  ) {
    if (!Number.isInteger(indent) || indent < 0 || indent > 32)
      throw Error("Invalid paste indentation.");
    const mz = commands.filter(
        /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.callback.10 — Returns c type equals "mz". Inputs: c. Returns: c type equals "mz". */
  /* @function mz-command-editing.callback.10Reviewed — Selects MZ commands when determining paste baseline indentation. Inputs: command record. Returns whether type is mz, without mutation. */ (
          c,
        ) => c.type === "mz",
      ),
      base = mz.length
        ? Math.min(
            ...mz.map(
              /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.callback.11 — Returns c indent or 0. Inputs: c. Returns: c indent or 0. */
  /* @function mz-command-editing.callback.11Reviewed — Reads an MZ command source indentation for paste rebasing. Inputs: command. Returns indent or zero for falsy/missing value; no mutation. Caller assumes validated source data. */ (
                c,
              ) => c.indent || 0,
            ),
          )
        : 0;
    return commands.map(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.callback.12 — Provides the callback for commands map. Inputs: command. Updates: c indent. Uses: structured clone; error. Returns: c. */
  /* @function mz-command-editing.callback.12Reviewed — Copies one pasted command and rebases its MZ indentation. Inputs: source command. Returns structured clone, adjusted relative to captured baseline/target. Throws if resulting indentation exceeds 32 or clone fails; original command stays unchanged. */ (
        command,
      ) => {
        const c = structuredClone(command);
        if (c.type === "mz") {
          c.indent = (c.indent || 0) - base + indent;
          if (c.indent > 32) throw Error("Pasted block exceeds nesting limit.");
        }
        return c;
      },
    );
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.choiceBounds.13 — Handles choice bounds within mz command editing. Inputs: commands; index. Uses: error; a list of 402, 403 includes; sections push. Returns: a record containing end, sections. */
  /* @function mz-command-editing.choiceBounds.13Reviewed — Finds top-level choice sections and matching End for Show Choices. Inputs: command list and code-102 opener index. Returns end index plus ordered choice/cancel section indices, ignoring nested choice sections while tracking 102/404 depth. Throws for wrong opener or missing End; no mutation or general structure repair. */ function choiceBounds(
    commands,
    index,
  ) {
    if (commands[index]?.code !== 102) throw Error("Expected Show Choices.");
    let depth = 0;
    const sections = [];
    for (let i = index + 1; i < commands.length; i++) {
      const c = commands[i];
      if (c.type !== "mz") continue;
      if (c.code === 102) depth++;
      else if (c.code === 404) {
        if (!depth) return { end: i, sections };
        depth--;
      } else if (!depth && [402, 403].includes(c.code)) sections.push(i);
    }
    throw Error("Show Choices has no End.");
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.insertChoices.14 — Handles insert choices within mz command editing. Inputs: command; assignment pattern. Uses: structured clone; c parameters at 0 for each; rows push; marker. Returns: rows. */
  /* @function mz-command-editing.insertChoices.14Reviewed — Builds an insertable Show Choices block. Inputs: authored opener and optional Map of bodies keyed by zero-based choice index or -2 for cancel branch. Returns cloned opener, choice markers/bodies, optional cancel marker/body and End at opener indent. Missing bodies get empty markers; supplied body records are spread by reference, so callers needing isolation must clone them. Input opener unchanged; clone/invalid-shape failures propagate. */ function insertChoices(
    command,
    bodies = new Map(),
  ) {
    const c = structuredClone(command),
      indent = c.indent || 0,
      rows = [c];
    c.parameters[0].forEach(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.callback.15 — Returns rows push using a record containing type, code, indent, parameters, spread element. Inputs: label; i. Uses: rows push; bodies get; marker. Returns: rows push using a record containing type, code, indent, parameters, spread element. */
  /* @function mz-command-editing.callback.15Reviewed — Appends one choice section to the newly built block. Inputs: choice label and zero-based index. Returns new rows length from push; adds 402 marker and captured body or empty default at indent+1. Does not mutate opener or supplied body records. */ (
        label,
        i,
      ) =>
        rows.push(
          { type: "mz", code: 402, indent, parameters: [i, label] },
          ...(bodies.get(i) || [marker(0, indent + 1)]),
        ),
    );
    if (c.parameters[1] === -2)
      rows.push(
        marker(403, indent),
        ...(bodies.get(-2) || [marker(0, indent + 1)]),
      );
    rows.push(marker(404, indent));
    return rows;
  }
  /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.replaceChoices.16 — Handles replace choices within mz command editing. Inputs: commands; index; command. Updates: command. Uses: choice bounds; sections for each; insert choices; sections map using a callback find. Returns: commands. */
  /* @function mz-command-editing.replaceChoices.16Reviewed — Rebuilds a Show Choices block while preserving bodies by numeric choice index and cancel key. Inputs: mutable commands, opener index and replacement opener. Returns same list after one final splice; new labels do not re-key bodies by text. Clones old bodies and preserves existing section/end metadata while updating section parameters. Bounds/clone/build failures precede final list mutation; host owns Undo and validation. Removed choices lose their bodies in the replacement list. */ function replaceChoices(
    commands,
    index,
    command,
  ) {
    const { end, sections } = choiceBounds(commands, index),
      bodies = new Map();
    sections.forEach(
      /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.callback.17 — Provides the callback for sections for each. Inputs: start; i. Uses: bodies set; structured clone; commands slice. */
  /* @function mz-command-editing.callback.17Reviewed — Copies one old choice/cancel body for rebuilding. Inputs: section start index and section ordinal. Returns nothing; stores structured-cloned rows through the next top-level section/end under choice index or cancel key -2. Does not modify original commands; clone failures propagate before splice. */ (
        start,
        i,
      ) => {
        const c = commands[start];
        bodies.set(
          c.code === 403 ? -2 : c.parameters[0],
          structuredClone(commands.slice(start + 1, sections[i + 1] ?? end)),
        );
      },
    );
    command = { ...command, indent: commands[index].indent };
    const rebuilt = insertChoices(command, bodies);
    for (const row of rebuilt) {
      if (
        row.indent === command.indent &&
        (row.code === 402 || row.code === 403)
      ) {
        const old = sections
          .map(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.callback.18 — Returns commands at i. Inputs: i. Returns: commands at i. */
  /* @function mz-command-editing.callback.18Reviewed — Reads an old top-level choice marker for metadata preservation. Inputs: row index. Returns original command reference, without mutation; replacement later clones selected metadata. */ (
              i,
            ) => commands[i],
          )
          .find(
            /* Historical contract retained; October 14, 2026 reviewed explanation follows. @function mz-command-editing.callback.19 — Returns c code equals row code and row code equals 403 or c parameters at 0 equals row parameters at 0. Inputs: c. Returns: c code equals row code and row code equals 403 or c parameters at 0 equals row parameters at 0. */
  /* @function mz-command-editing.callback.19Reviewed — Matches old section metadata to a rebuilt choice/cancel marker. Inputs: old command. Returns same marker code and matching numeric choice index, or any same-code cancel marker. No mutation; label changes retain index-based identity. */ (
              c,
            ) =>
              c.code === row.code &&
              (row.code === 403 || c.parameters[0] === row.parameters[0]),
          );
        if (old)
          Object.assign(row, {
            ...structuredClone(old),
            parameters: row.parameters,
          });
      } else if (row.code === 404 && row.indent === command.indent)
        Object.assign(row, {
          ...structuredClone(commands[end]),
          indent: command.indent,
        });
    }
    commands.splice(index, end - index + 1, ...rebuilt);
    return commands;
  }
  root.FrontierMZCommandEditing = {
    bounds,
    insertBranch,
    replaceBranch,
    groupRange,
    rebase,
    choiceBounds,
    insertChoices,
    replaceChoices,
  };
})(typeof window === "undefined" ? globalThis : window);
