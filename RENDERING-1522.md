# Rendering and breathing — October 10, 2026

This document describes the 0.15.22 implementation under development. Release validation and packaging are not yet complete.

## Resolution and filtering
Pause → Options contains Performance (1×), Sharper (1.5×) and High (2×). A 4:3 view renders at 640×480, 960×720 or 1280×960. The wider view uses 854 logical pixels across; the options display reports its rounded physical dimensions. Aspect selection remains independent.

Logical projection and pointer coordinates retain a 480-unit vertical reference. This is a coordinate system, not a cap on rendering resolution. Pixi framebuffer density and model/terrain depth raster density scale together. Assets are unchanged. Quality preferences are stored locally under frontier.display.0.15.22, outside project data.

Crisp uses nearest-neighbor world textures; Smooth uses linear GPU sampling and bilinear CPU model/interior texture sampling. Normal-map lighting retains linear sampling; DOM text, menu artwork and the selected hand cursor are outside the world filter. Resolution cannot invent detail absent from the source artwork.

## Screen breathing
Pause → Options adjusts temporary playtest breathing. Native Effects authoring saves map defaults. Insert screen breathing in the event editor creates a native command, with its own validated dialog and undoable draft insertion/editing.

Intensity is normalized 0–0.05; cycle speed is 0.01–2 Hz; radius is 0.1–2; fade durations are 0–10 seconds. The isolated live preview captures the current world and animates that image without advancing gameplay or saving settings. Closing cancels its animation and releases its buffers.

The world-only radial GPU pass shares its coordinate transform with inverse mouse sampling and forward aiming-marker projection. A tapered stationary border prevents exposed edges. Phase and fade strength belong to the playtest controller, separate from map defaults. Pause, editor mode and door cinematics freeze the controller. Disabling reaches exactly zero strength after its fade.

## Locked presentation and resource lifecycle
The 0.15.17 camera-facing sprite tilt, proportions, anchoring and frame presentation remain mandatory. Breathing is a final image transform and does not substitute upright billboards or alter sprite geometry.

Model raster surfaces release their prior GPU upload texture and shrink old backing canvases when density changes. Preview pixels and coordinate sampling records are reused. Native emitters append to the existing frame adapter rather than starting a second frame that erases the scene.

## Verification status
The required gameplay, models and hub regression scripts passed on October 10. Breathing timing/inverse mapping tests and the real-browser high-density saloon/emitter/preview/runtime-command checks passed. Function comment coverage currently counts 4050 functions. These checks do not establish the remaining multi-scene performance matrix, complete fullscreen/aspect/save/reload audit or platform package acceptance. Those remain required before delivery.


## October 10, 2026 — rendering iteration update

Current rendering architecture and authoring instructions are in RENDERING-1522.md. PERFORMANCE-1522.md retains preliminary runs and the superseding precise-memory matrix. FUNCTION-REFERENCE-0.15.22.md/.json index maintained source contracts. Historical notes above remain intact; their resolution/breathing pending statements are superseded by the implemented controls, native command dialog and isolated live preview.

High-density browser acceptance now covers aspect/fullscreen/preference reload, door cinematic dimensions and cell/project state roundtrip, camera clearance at 40 pitch/orbit combinations, door body blocking, room/model occlusion and pause/menu interactions. Packaging verification and native platform testing status are recorded separately at delivery.


## Final release status — October 10, 2026

Supersedes the development/pending status above: 0.15.22 is the complete resolution, filtering and native breathing iteration. Required source suites, comment coverage, high-density browser lifecycle/door/occlusion/guard tests and the eighteen-case precise-memory performance matrix passed. The browser archive was extracted and its real rendering-controls/preview/lifecycle test passed; both distribution manifests were hash-verified. Original assets and prior source block comments were compared with 0.15.21 and remain intact. Earlier release manifests were also verified unchanged.

Complete Windows and Mac browser archives contain source, assets, function reference, guides and validation evidence. Native macOS execution was unavailable. Windows browser checks passed; the packaged runtime version probe exited successfully without diagnostic output, which does not prove native graphical acceptance. Manual native Windows/Mac acceptance remains explicitly unverified, rather than being represented as tested. Performance and GPU-memory limitations are documented in PERFORMANCE-1522.md and VALIDATION-1522.md.
