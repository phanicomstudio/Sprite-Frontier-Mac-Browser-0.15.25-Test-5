# Windows 0.10

Extract the **Windows ZIP**, then run **Launch Sprite Frontier.cmd** or
**Sprite Frontier.exe**. `index.html` is the browser entry point; it does not
launch the desktop window. This package includes the Electron runtime.

Press **P** for live cursor mode. Hover a reachable object. Holster with **Space**
and left-click to interact/collect; right-click inspects, including while armed.
Actions now execute on button press, not release. Pointer capture keeps gestures
reliable across movement and HUD boundaries; pointer-lock exit no longer clears
an active P-mode gesture. Device controls remain independent of world actions.

The editor (**F2**) adds **Map distance fog**: enable, start distance, fully fogged
distance, and #RRGGBB color. Apply previews the change and supports undo/redo and
world export/import. The preset demo starts with fog enabled. Distances are world
units; one displayed foot equals 0.3 units. Fog changes world drawing, not the HUD.

Successful pickup/event activation and inspection play a click cue. **Successful
click feedback** selects any bundled sound effect, volume 0–1, or Disabled.
Preview and Apply are separate controls. Settings survive world export/import.
Misses and failed interactions do not play the success cue.

Maintainers: fog.js validates map atmosphere and owns runtime overrides;
`FrontierFog.setRuntime(game, overrides)` and `clearRuntime(game)` support future
weather/day/night without mutating authored defaults. render.js assigns camera
depth; pixi-renderer.js uses quantized cached palette blends for vectors and
bounded reusable color filters for texture sprites. This is the native WebGL
fog path, not a lighting/normal-map implementation. Camera-depth object fog is
an approximation across large billboard surfaces; terrain edges use midpoint
depth. No new shadow or lighting system is included.

Lighting requirements are separately preserved in FUTURE-LIGHTING-REQUIREMENTS.md.
