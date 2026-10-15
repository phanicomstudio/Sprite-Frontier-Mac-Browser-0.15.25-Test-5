/* October 15, 2026: switchable game text font.
 *
 * Players and authors can choose the font used for game text: menus, HUD,
 * dialogue, device screens and in-world labels. The default keeps the
 * Phanicom Checkbook look; the other choices use fonts already installed on the
 * computer, so nothing extra is downloaded.
 *
 * How it applies:
 *   - CSS reads the --frontier-game-font custom property on <html>
 *     (style.css falls back to Checkbook when the property is absent).
 *   - The Pixi renderer asks family() when it draws text, so in-world labels
 *     switch on the next frame.
 *   - A "frontier-font-change" window event lets other code react.
 * The choice is a local per-browser preference, like resolution; it is not
 * saved in projects. The editor's own panels always use the system font.
 */
(/* @function typography.install — Inputs: browser global root. Returns nothing; publishes FrontierTypography and applies the saved (or default) font to the document immediately, before the page draws, so there is no flash of the wrong font. Storage failures fall back to the default. */ function (root) {
  "use strict";
  const KEY = "frontier.typography.1600";
  const FONTS = Object.freeze({
    phanicom: { label: "Phanicom Checkbook", family: "PhanicomCheckbook, monospace" },
    "system-sans": {
      label: "System sans-serif",
      family: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    "system-serif": { label: "System serif", family: 'Charter, "Iowan Old Style", Georgia, "Times New Roman", serif' },
    "system-mono": { label: "System monospace", family: 'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace' },
  });
  let current = "phanicom";

  /* @function typography.read — Inputs: none. Returns the saved font ID when it names a known font, otherwise "phanicom". Unavailable or malformed storage yields the default and never throws. */
  function read() {
    try {
      const saved = root.localStorage?.getItem(KEY);
      return saved && Object.hasOwn(FONTS, saved) ? saved : "phanicom";
    } catch {
      return "phanicom";
    }
  }

  /* @function typography.apply — Inputs: known font ID. Returns nothing; sets the CSS custom property and a data-game-font attribute on <html> (for any style that needs to adjust per font). Does not save or announce the change. */
  function apply(id) {
    const html = root.document?.documentElement;
    if (!html) return;
    html.style.setProperty("--frontier-game-font", FONTS[id].family);
    html.dataset.gameFont = id;
  }

  /* @function typography.set — Inputs: font ID chosen by the player. Returns nothing. Applies it, saves it for this browser and dispatches "frontier-font-change" with { id, family }. Throws "Choose a supported font." for unknown IDs, changing nothing. Storage failure keeps the font for this session only. */
  function set(id) {
    if (!Object.hasOwn(FONTS, id)) throw Error("Choose a supported font.");
    current = id;
    apply(id);
    try {
      root.localStorage?.setItem(KEY, id);
    } catch {
      /* Session-only preference when storage is unavailable. */
    }
    root.dispatchEvent?.(new CustomEvent("frontier-font-change", { detail: { id, family: FONTS[id].family } }));
  }

  /* @function typography.bind — Inputs: a <select> element. Returns the same element after filling it with the font choices, selecting the current one, and making it change the font. Several selects (pause Options, editor settings) can be bound; each follows changes made in the others. Invalid choices report through the select's title rather than throwing. */
  function bind(select) {
    select.replaceChildren();
    for (const [id, font] of Object.entries(FONTS)) select.append(new Option(font.label, id));
    select.value = current;
    select.addEventListener("change", /* @function typography.bindChange — Inputs: change event ignored. Returns nothing; applies the chosen font. */ function () {
      try {
        set(select.value);
        select.title = "";
      } catch (error) {
        select.title = error.message;
        select.value = current;
      }
    });
    root.addEventListener?.("frontier-font-change", /* @function typography.bindFollow — Inputs: font-change event. Returns nothing; keeps this select showing the current font. */ function (event) {
      select.value = event.detail.id;
    });
    return select;
  }

  current = read();
  apply(current);
  root.FrontierTypography = Object.freeze({
    fonts: FONTS,
    set,
    bind,
    /* @function typography.current — Inputs: none. Returns the current font ID. Read-only. */
    current() {
      return current;
    },
    /* @function typography.family — Inputs: none. Returns the CSS font-family list for the current font, for canvas and Pixi text. Read-only and allocation-free, so it is safe to call while drawing each frame. */
    family() {
      return FONTS[current].family;
    },
  });
})(globalThis);
