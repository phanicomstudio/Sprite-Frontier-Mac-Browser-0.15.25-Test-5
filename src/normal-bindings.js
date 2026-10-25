/* One normal PNG per sprite profile per map. Exported maps own their bindings;
 * runtime instances only reference the profile. Limits bound import/storage. */
/* Historical contract retained; October 14, 2026 reviewed explanation follows. @function normal-bindings.callback.1 — Provides the callback for a callback. Inputs: root. Updates: root frontier normal bindings. */
(/* @function normal-bindings.installReviewed — Installs bounded per-map normal-map bindings keyed by sprite profile. Exported maps own PNG references while runtime instances share profiles; registration does not process image pixels. Inputs: browser/global namespace root. Returns nothing; publishes module API and initializes private ownership tables. Dependency/registration errors propagate. Exported operations own later authoring, simulation or rendering work; this does not create a second active game. */ function (
  root,
) {
  "use strict";
  // Preserve future properties only as bounded, finite JSON: reject silent JSON loss.
  /* Historical contract retained; October 14 reviewed explanation follows. @function normal-bindings.extensions.2 — Preserve future properties only as bounded, finite JSON: reject silent JSON loss. Inputs: value. Uses: copy; array is array; error; json stringify. Returns: out. */
  /* @function normalBindings.reviewedextensions_2 — Copies bounded portable normal-binding extension metadata. Inputs: value plain object. Returns detached finite JSON tree; rejects nonobject/array root, more than2048 nodes, depth above12, unsafe keys, nonportable types and serialized length above4096 JavaScript characters. Historical 4KB message is approximate, not UTF-8 byte measurement. No source mutation; getters/encoding errors propagate. */ function extensions(
    value,
  ) {
    let nodes = 0;
    /* Historical contract retained; October 14 reviewed explanation follows. @function normal-bindings.copy.3 — Handles copy within normal bindings. Inputs: v; depth. Updates: out at key. Uses: error; number is finite; array is array; v map. Returns: v; v. */
  /* @function normalBindings.reviewedcopy_3 — Recursively validates/copies one metadata node. Inputs: v and nesting depth. Returns primitive/new array/plain object; increments captured node count and rejects nonfinite numbers, unsupported prototypes/types, unsafe keys or structural budget. No source writes; object getters may execute during enumeration and their errors propagate. */ function copy(
      v,
      depth,
    ) {
      if (++nodes > 2048 || depth > 12)
        throw Error("Normal extensions exceed nesting/node budget.");
      if (v === null || typeof v === "boolean" || typeof v === "string")
        return v;
      if (typeof v === "number" && Number.isFinite(v)) return v;
      if (Array.isArray(v))
        return v.map(
          /* Historical contract retained; October 14 reviewed explanation follows. @function normal-bindings.callback.4 — Returns copy using x, depth plus 1. Inputs: x. Uses: copy. Returns: copy using x, depth plus 1. */
  /* @function normalBindings.reviewedcallback_4 — Copies one extension array element at next depth. Inputs: x and captured depth. Returns recursive copied value; no source mutation. Validation errors propagate to reject entire extension. */ (
            x,
          ) => copy(x, depth + 1),
        );
      if (
        v &&
        typeof v === "object" &&
        Object.getPrototypeOf(v) === Object.prototype
      ) {
        const out = {};
        for (const [key, x] of Object.entries(v)) {
          if (["__proto__", "constructor", "prototype"].includes(key))
            throw Error("Unsafe normal extension key.");
          out[key] = copy(x, depth + 1);
        }
        return out;
      }
      throw Error("Normal extensions must contain finite JSON values.");
    }
    const out = copy(value, 0);
    if (!out || Array.isArray(out) || typeof out !== "object")
      throw Error("Normal extensions must be an object.");
    if (JSON.stringify(out).length > 4096)
      throw Error("Normal extensions exceed 4 KB.");
    return out;
  }
  /* Historical contract retained; October 14 reviewed explanation follows. @function normal-bindings.validate.5 — Checks incoming values and constructs the supported data shape; rejects invalid data where the body throws. Inputs: value. Uses: array is array; error; value entries map. Returns: a record containing schema, entries; a record containing schema, entries. */
  /* @function normalBindings.reviewedvalidate_5 — Validates per-map sprite normal bank. Inputs: optional value. Returns schema sprite-normals/1 and detached entries, default empty when undefined. Requires at most64 unique profile bindings with bounded base64 PNG headers/dimensions and validated lighting/extensions. No decode/rendering or map adoption; schema/dependency errors propagate. */ function validate(
    value,
  ) {
    if (value === undefined) return { schema: "sprite-normals/1", entries: [] };
    if (
      value?.schema !== "sprite-normals/1" ||
      !Array.isArray(value.entries) ||
      value.entries.length > 64
    )
      throw Error("Invalid sprite normal bank (maximum 64 bindings).");
    const ids = new Set();
    let bytes = 0;
    const entries = value.entries.map(
      /* Historical contract retained; October 14 reviewed explanation follows. @function normal-bindings.callback.6 — Provides the callback for value entries map. Inputs: e. Updates: bytes. Uses: ids has; error; ids add; /^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/ test. Returns: a record containing profile, png, width, height, light, copied fields. */
  /* October 22, 2026: supersedes the historical 512px/2M-character limit. Native Sprite Fusion output permits 4096px sides, 4,194,304 total pixels, 16M encoded characters per binding and 32M per bank. Header checks still require full decode by the renderer. */
  /* @function normalBindings.reviewedcallback_6 — Validates/copies one normal binding. Inputs: e and captured IDs/size count. Returns profile/png/width/height/light and optional copied extensions; rejects duplicate/empty profile or length above100, URL above2million characters, aggregate above16million, invalid PNG signature/IHDR and mismatched dimensions outside1-512 pixels. Budgets measure encoded-string length, not decoded bytes or heap. Header check does not prove full PNG decoding; renderer owns decode. No input mutation. */ (
        e,
      ) => {
        if (
          typeof e.profile !== "string" ||
          !e.profile ||
          e.profile.length > 100 ||
          ids.has(e.profile)
        )
          throw Error("Invalid or duplicate normal sprite profile.");
        ids.add(e.profile);
        if (
          typeof e.png !== "string" ||
          e.png.length > 16000000 ||
          !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(e.png)
        )
          throw Error("Normal binding PNG exceeds 16 million encoded characters.");
        bytes += e.png.length;
        if (bytes > 32000000) throw Error("Normal bank exceeds 32 million encoded characters.");
        const raw = atob(e.png.slice(22));
        if (
          raw.length < 24 ||
          raw.slice(0, 8) !== "\x89PNG\r\n\x1a\n" ||
          raw.slice(12, 16) !== "IHDR"
        )
          throw Error("Invalid normal PNG header.");
        const word =
          /* Historical contract retained; October 14 reviewed explanation follows. @function normal-bindings.word.7 — Returns raw char code at using o multiplied by 16777216 plus raw char code at using o plus 1 << 16 plus raw char code at using o plus 2 << 8 plus raw char code at using o plus 3. Inputs: o. Uses: raw char code at. Returns: raw char code at using o multiplied by 16777216 plus raw char code at using o plus 1 << 16 plus raw char code at using o plus 2 << 8 plus raw char code at using o plus 3. */
  /* @function normalBindings.reviewedword_7 — Reads a PNG big-endian32-bit dimension. Inputs: byte offset o into captured decoded binary string. Returns unsigned-range numeric word using multiplication for high byte. No mutation; prior header length check ensures offsets16/20 available. */ (
            o,
          ) =>
            raw.charCodeAt(o) * 16777216 +
            (raw.charCodeAt(o + 1) << 16) +
            (raw.charCodeAt(o + 2) << 8) +
            raw.charCodeAt(o + 3);
        if (
          !Number.isInteger(e.width) ||
          !Number.isInteger(e.height) ||
          e.width < 1 ||
          e.height < 1 ||
          e.width > 4096 ||
          e.height > 4096 ||
          e.width * e.height > 4194304 ||
          word(16) !== e.width ||
          word(20) !== e.height
        )
          throw Error(
            "Normal PNG must match dimensions up to 4096 per side and 4,194,304 total pixels.",
          );
        const extra =
          e.extensions === undefined ? undefined : extensions(e.extensions);
        return {
          profile: e.profile,
          png: e.png,
          width: e.width,
          height: e.height,
          light: root.FrontierSpriteLighting.validate(e.light),
          ...(extra === undefined ? {} : { extensions: extra }),
        };
      },
    );
    return { schema: value.schema, entries };
  }
  root.FrontierNormalBindings = { validate };
})(typeof window === "undefined" ? globalThis : window);
