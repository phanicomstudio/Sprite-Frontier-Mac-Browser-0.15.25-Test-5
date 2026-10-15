# October 10, 2026 — editor hand cursor

The selected hand now remains visible above native modal editor dialogs, including nested dialogs and scrolled cell settings. Browsers place modal dialogs in a top layer that ordinary z-index cannot surpass. The existing single preloaded hand moves into the last open dialog while it is open, then returns to the fullscreen-capable viewport. It remains fixed in client coordinates and ignores pointer input. Cutscene hiding and all sprite presentation remain unchanged.

Previous releases and comments are preserved. ITERATION-0.15.20.md describes the additions and remaining work from that release; this iteration fixes cursor hosting only. Full Windows and Mac browser packages are supplied. Native platform testing remains outstanding.

Door cinematics now frame the midpoint of the selected closed mesh parts, using engine Z-up assembly coordinates. This fixes the paired saloon door offset caused by a camera X position hard-coded for the antique door. The center is computed once before animation and remains stable while leaves swing.

Whole-game resolution and independent texture filtering controls are requested next. They are not implemented in this cursor/door release; the current logical view remains 480 pixels high, with reduced-resolution solid rasterization. A resolution change must preserve projection, aiming, sprite presentation, depth masks and cursor coordinates across all maps.
