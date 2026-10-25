# 0.15.22 validation — October 10, 2026

Required gameplay, model and hub source suites passed. Function-comment coverage and current reference index contain 4167 maintained functions. Existing release history remains preserved.

Browser checks passed in installed Chrome on Windows:
- Real framebuffer density changes, 1280×960 classic and 1708×960 widescreen; preference restoration after reload.
- Fullscreen entry/exit and pause controls, selected hand, volume, save/load, options scrolling and preview close.
- High-density radial shader activation; validated temporary event commands keep authored defaults unchanged; frozen controller state does not advance.
- High-density door model rendering, pointer door entry, named arrival/return, item/cell state and project roundtrip.
- Geometry camera guard over 40 pitch/orbit positions, door body blocking and room/model target occlusion.
- Locked camera-facing sprite scene/lighting and existing projection/aim/depth behavior suites.
- Eighteen quality/scene combinations, including thirteen shared model instances, with measured CPU submission timing and precise browser JS heap. Raw measurements are in validation/rendering-matrix1522.json; interpretation and earlier run history are in PERFORMANCE-1522.md.

Breathing pure tests cover equal timing at 30/120 Hz, pause freeze, exact fade endpoints, zero-strength disable, stationary screen edges, inverse coordinate mapping and reusable snapshot records.

Platform limits: no native macOS execution was available. Chrome browser acceptance is not a native Windows Electron launch test. Complete package hashes and extracted-browser verification are performed separately. CPU timings are not GPU completion timings or display FPS; browser JS heap is not GPU texture memory or retained heap. No universal frame-rate claim is made.


## Final release status — October 10, 2026

Supersedes the development/pending status above: 0.15.22 is the complete resolution, filtering and native breathing iteration. Required source suites, comment coverage, high-density browser lifecycle/door/occlusion/guard tests and the eighteen-case precise-memory performance matrix passed. The browser archive was extracted and its real rendering-controls/preview/lifecycle test passed; both distribution manifests were hash-verified. Original assets and prior source block comments were compared with 0.15.21 and remain intact. Earlier release manifests were also verified unchanged.

Complete Windows and Mac browser archives contain source, assets, function reference, guides and validation evidence. Native macOS execution was unavailable. Windows browser checks passed; the packaged runtime version probe exited successfully without diagnostic output, which does not prove native graphical acceptance. Manual native Windows/Mac acceptance remains explicitly unverified, rather than being represented as tested. Performance and GPU-memory limitations are documented in PERFORMANCE-1522.md and VALIDATION-1522.md.
