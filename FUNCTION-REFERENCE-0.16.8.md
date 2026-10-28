# 0.16.8 maintained function addendum

**paletteDither.validate168 / makePalette168 / filter168**

Optional authored original settings -> validated detached settings, float palettes and one reused original-math GPU filter. Screen-space pixels; invalid values throw; old maps disabled.

**paletteDither.apply168 / inlineNode168 / captureHud168 / hudCompose168 / hudDisable168 / pauseMode168**

Existing draw adapter and original DOM -> retained pre-index UI texture and original interactive controls. Single-flight 10Hz snapshot, cached images/fonts, full-window opaque pause presentation; failure restores originals and records status.

**paletteDither.transition168 / composeMelt168 / captureRaw168**

Existing engine cinematic/melt canvases -> live GPU layers before final indexing, preserving timing, letterboxing and no-world-render cinematic ownership; raw melt capture prevents double indexing.

**paletteDither.command168 / validateCommand168 / execute168 / validateMZ168 / lowerMZ168**

Original three plugin commands or MZ357 -> validated native command and active-game override. Unknown plugins remain unsupported. Event editor/history and existing runtime save owners handle persistence.

**paletteDither.editor168 / fillEditor168 / choosePreset168 / commitEditor168 / commandDialog168**

Original controls, exact defaults/saved Quake preset and supplied swatches -> transactional map/event drafts; no source adoption until owner Apply; invalid drafts retain values.

**authoringScene.paletteDither168 / commitPalette168; app.captureRuntime168 / restoreRuntime168; save.validate**

Map drafts and optional runtime override -> existing author history, shared cell travel and validated playtest saves. Rendering styles remain authored separately and legacy data remains compatible.

**pixiRenderer.indexedEnd168 / render.draw / world.validate**

Original pooled scene -> optional final shader/HUD composition; map field validation and runtime export script dependency stay explicit. Projection, locked sprite presentation and gameplay remain unchanged.
**paletteDither.reticle168 / deferHud168**

The retained GPU cursor follows original screen geometry every frame. Cached glyph decoding preserves opacity and pause visibility; deferred HUD capture observes current-frame DOM updates without reading back the world each frame.
