/* Definition history retains only entries, never complete project snapshots.
 * Failed adoption does not consume an undo/redo record. Histories are local to
 * this authoring session and are cleared when a project is restored. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function template-history.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier template history. */
(/* @function template-history.installReviewed — Installs compact reusable-definition Undo/Redo history. Records retain entries rather than complete projects, failed adoption preserves history availability, and project restore clears session-local records. Inputs: browser/global namespace root. Returns nothing; publishes API/defaults and initializes private ownership tables. Dependency/registration errors propagate. Later exported operations own simulation/rendering/authoring work; this does not start a second active game. */ function (
  root,
) {
  "use strict";
  /* Historical contract retained; October 14 reviewed explanation follows. @function template-history.create.2 — Builds a new instance and its public operations from the supplied configuration. Inputs: assignment pattern. Uses: number is safe integer; error. Returns: a record containing push, undo, redo, clear, debug. */
  /* @function template-history.reviewedcreate_2 — Creates isolated bounded definition-history stacks. Inputs: optional maxBytes UTF-8 serialized budget (default8MiB) and maxEntries combined record cap(default32), both positive safe integers. Returns push/undo/redo/clear/debug API. Allocates private stacks only; rejects invalid budgets before allocation. Records must be JSON-serializable and structured-cloneable, with synchronous adoption callbacks. */ function create({
    maxBytes = 8 * 1024 * 1024,
    maxEntries = 32,
  } = {}) {
    if (
      !Number.isSafeInteger(maxBytes) ||
      maxBytes < 1 ||
      !Number.isSafeInteger(maxEntries) ||
      maxEntries < 1
    )
      throw Error("Invalid template history budget.");
    let undo = [],
      redo = [],
      bytes = 0;
    const size =
      /* Historical contract retained; October 14 reviewed explanation follows. @function template-history.size.3 — Returns a new text encoder encode using json stringify using entry length. Inputs: entry. Uses: a new text encoder encode; json stringify. Returns: a new text encoder encode using json stringify using entry length. */
  /* @function template-history.reviewedsize_3 — Estimates record storage using portable serialization. Inputs: entry. Returns UTF-8 JSON byte length, not actual JS heap usage. No mutation; circular/nonserializable entries throw during JSON encoding. */ (
        entry,
      ) => new TextEncoder().encode(JSON.stringify(entry)).length;
    /* Historical contract retained; October 14 reviewed explanation follows. @function template-history.trim.4 — Handles trim within template history. Inputs: no explicit arguments; uses enclosing module state. Updates: bytes. Uses: undo shift; redo shift. */
  /* @function template-history.reviewedtrim_4 — Enforces combined record/serialized-byte budgets. Inputs: none; captures stacks/budgets. Returns undefined; discards oldest undo records first, then redo, decrementing byte count. Assumes pushed items have valid byte metadata; oversize single entry may be immediately dropped. */ function trim() {
      while (undo.length + redo.length > maxEntries || bytes > maxBytes) {
        const item = undo.length ? undo.shift() : redo.shift();
        bytes -= item.bytes;
      }
    }
    return {
      /* Historical contract retained; October 14 reviewed explanation follows. @function template-history.push.5 — Handles push within template history. Inputs: entry. Updates: bytes; redo. Uses: structured clone; size; undo push; trim. */
  /* @function template-history.reviewedpush_5 — Records a new detached definition change and invalidates redo. Inputs: portable entry. Returns undefined; clears redo and subtracts its bytes, clones/sizes entry, appends undo and trims budgets. No project mutation. Clone/serialization errors propagate; redo is already cleared before those errors, so callers validate records first. */ push(
        entry,
      ) {
        for (const item of redo) bytes -= item.bytes;
        redo = [];
        const item = { entry: structuredClone(entry), bytes: size(entry) };
        undo.push(item);
        bytes += item.bytes;
        trim();
      },
      /* Historical contract retained; October 14 reviewed explanation follows. @function template-history.undo.6 — Handles undo within template history. Inputs: adopt. Uses: undo at; adopt; structured clone; undo pop. Returns: false; true. */
  /* @function template-history.reviewedundo_6 — Applies last undo record before moving history cursor. Inputs: synchronous adopt callback. Returns false if empty, true after successful adoption; supplies detached clone then moves record to redo. Callback/clone exception leaves stacks unchanged, but external callback side effects are caller-owned and not rolled back here. Async callbacks are unsupported. */ undo(
        adopt,
      ) {
        const item = undo.at(-1);
        if (!item) return false;
        adopt(structuredClone(item.entry));
        undo.pop();
        redo.push(item);
        return true;
      },
      /* Historical contract retained; October 14 reviewed explanation follows. @function template-history.redo.7 — Handles redo within template history. Inputs: adopt. Uses: redo at; adopt; structured clone; redo pop. Returns: false; true. */
  /* @function template-history.reviewedredo_7 — Reapplies last redo record before moving it back to undo. Inputs: synchronous adopt callback. Returns false if empty, otherwise true after successful callback on detached clone. Failure retains history cursor; external mutation/rollback belongs to owner. No async settlement handling. */ redo(
        adopt,
      ) {
        const item = redo.at(-1);
        if (!item) return false;
        adopt(structuredClone(item.entry));
        redo.pop();
        undo.push(item);
        return true;
      },
      /* Historical contract retained; October 14 reviewed explanation follows. @function template-history.clear.8 — Handles clear within template history. Inputs: no explicit arguments; uses enclosing module state. Updates: undo; redo; bytes. */
  /* @function template-history.reviewedclear_8 — Clears this session history and serialized-byte accounting. Inputs: none. Returns undefined; replaces both stacks and resets bytes zero. Does not modify authored project or persisted data. */ clear() {
        undo = [];
        redo = [];
        bytes = 0;
      },
      debug:
        /* Historical contract retained; October 14 reviewed explanation follows. @function template-history.debug.9 — Returns a record containing undo, redo, bytes, maxBytes, maxEntries. Inputs: no explicit arguments; uses enclosing module state. Returns: a record containing undo, redo, bytes, maxBytes, maxEntries. */
  /* @function template-history.revieweddebug_9 — Reports bounded-history availability and accounting. Inputs: none. Returns fresh undo/redo counts, serialized bytes and configured budgets. No retained record contents or mutation; byte figure is not full memory usage. */ () => ({
          undo: undo.length,
          redo: redo.length,
          bytes,
          maxBytes,
          maxEntries,
        }),
    };
  }
  root.FrontierTemplateHistory = { create };
})(typeof window === "undefined" ? globalThis : window);
