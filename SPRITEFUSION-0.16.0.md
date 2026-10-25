# Local Sprite Fusion normal generation — 0.16.0

October 22, 2026. This supersedes automatic rounded-silhouette generation and the former automatic 512-pixel work-image resampling. Historical generator source and prior releases remain preserved. Manual height/flat/import correction tools retain their existing role; they are not the new automatic generator.

Open **Environment → Sprite normals**. Choose a registered sprite profile and **Load this sprite artwork**, or load artwork from disk. Registered profile frame dimensions are filled automatically; for arbitrary uniform sheets enter both frame dimensions. Leave both at zero for a single image. Choose strength, shading detail, smoothing in native pixels and silhouette volume, then **Generate Sprite Fusion normals**. Generation runs automatically when loading artwork.

The exact pinned upstream Rust generator runs locally in a disposable WebAssembly worker. There is no web-service call, account, API key, hosted iframe, upload, native generator installation or Rust requirement for end users. Embedded WASM/glue support browser `file://` packages as well as the Windows shell. Generation is outside the gameplay loop. Cancel or close stops the worker. A failed job leaves the previous complete result; it does not silently use the old generator.

The preview uses existing Sprite Frontier lighting. **Apply lighting to this sprite on current map** saves the PNG through the existing normal-binding bank in one authored-world Undo step. **Export normal PNG** writes a normal image for other uses. Applying a profile requires loading that profile's artwork first; arbitrary uploaded files can be previewed/exported without pretending to match another profile. Existing normal PNG imports and Remove remain available.

Output uses OpenGL normal channels expected by the engine. Alpha and native sheet dimensions are preserved. Uniform cells are processed independently, preventing neighboring animation/direction frames from influencing relief. The generator estimates geometry from silhouette and painted shading. A normal pass from the original 3D render is still preferable when exact surface orientation is required.

## Limits and compatibility

- Generator input: at most 4096 pixels per side, at most 4,194,304 pixels including upstream processing padding. Very large sheets fail with a message; no automatic shrinking or frame-coordinate rewriting occurs.
- Map normal bindings: at most 4096 pixels per side and 4,194,304 total pixels; 16 million encoded characters per PNG and 32 million per bank, still at most 64 profile records. These are encoded-string budgets, not file-size or memory guarantees.
- Runtime lighting retains its existing 64 MiB cache budget and pixel guards. Generation support does not imply unlimited concurrently lit sheets.
- Manual height Undo now retains generated/imported normals too, with an approximate 32 MiB history budget. Height editing replaces the generated field with the manually authored height-derived field; Undo restores the prior field. This is not a physical-height reconstruction from generated normals.
- Old normal bindings remain valid. New native-size bindings may exceed older engine validators. Windows 0.16.0 therefore uses an independent profile; export your project JSON from the previous release and import it here. Previous application profiles and releases remain untouched.

## License and provenance

Upstream: https://github.com/Hugo-Dz/spritefusion-sprite-normals

Pinned commit: `d14b06726cabab09c68a403ce2e684a52efbfe4c`.

Copyright (c) 2026 Hugo Duprez, MIT. The complete notice is retained at `vendor/spritefusion/LICENSE`. Original Rust source, tests, Cargo manifest/lockfile, upstream README, generated WASM/glue and dependency notices accompany the source release. `vendor/spritefusion/DEPENDENCIES.json` records package versions/licenses; build/test dependencies are included conservatively. No upstream demonstration artwork is imported into the game.

Commercial use is allowed by MIT. Games using generated normal maps need not become open source. The original sprite/model/texture rights remain the author's responsibility. Distributing the generator itself requires retaining its copyright and permission notice; both editor distributions do so.

## Reproducible build

The upstream README requires Rust **1.85 or newer**, the `wasm32-unknown-unknown` target and exactly **wasm-bindgen 0.2.126**. This release used Rust **1.99.1**, Cargo's locked dependency graph and wasm-bindgen **0.2.126**. The locally prepared compiler tools live outside the shipped application and did not modify system PATH.

From a checkout of the pinned source:

```text
cargo build --release --target wasm32-unknown-unknown --no-default-features --locked
wasm-bindgen target/wasm32-unknown-unknown/release/spritefusion_sprite_normals.wasm --target no-modules --out-dir pkg
cargo test --locked --no-default-features
```

The no-modules target supplies classic-worker glue; the generator implementation is unchanged. The vendored payload embeds exact generated glue and WASM bytes so a worker can initialize without a local-file fetch. Engine integration is maintained in `src/spritefusion-normal-generator.js` and `src/normal-workbench.js`; upstream code remains separately licensed vendor code.

Validation includes upstream image/media tests, actual worker alpha/frame-isolation/cancellation tests and full 1200×2400 Chiban-sheet generation, Apply, authored-world validation/JSON round trip, Undo and full-resolution runtime lighting preparation. GIF/APNG decoding exists upstream, but the integrated workbench currently accepts static decoded artwork/sheets through its existing image loader; it does not claim an animated-file import/timing workflow.
