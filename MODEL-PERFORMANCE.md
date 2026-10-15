# Model performance measurements

Generated benchmark-1500 fixture: 1,500 triangles, 806 vertices, one 256 × 256 RGBA base-color texture (256 KiB decoded). Source and metadata are in assets/models/runtime/benchmark-1500/. This fixture is synthetic; user hostile models have not been imported.

Initial Windows Chrome headless measurement: 11 ms decode plus texture preparation; 2.30 ms median and 2.70 ms p95 model-render time across 30 measured samples after 10 warm-up samples. Logical viewport 640 × 480, CPU rasterizer with 2 × 2 raster samples. One visible model, isolated rendering: these numbers are not whole-game frame times or Mac measurements.

Reproduce with tests/browser/model-performance.cjs. Machine/browser load changes results. Raw results are written to test-artifacts/model-performance.json. Before release, measure multiple visible instances and the combined terrain/interior/sprite workload. Debug counters expose instances, culled instances, triangles, raster pixels and elapsed model-render milliseconds.

Resources decode once per library revision. Instances reference shared geometry and textures. Conservative transformed bounds reject models entirely behind or outside the viewport. A near-plane crossing remains visible to avoid false culling.

After adding bounds culling, another run measured 3.30 ms median and 4.30 ms p95, with 33.3 ms initial decode/preparation. The variation demonstrates why isolated measurements cannot promise a particular frame rate.

Release acceptance run: 2.90 ms median and 3.70 ms p95 isolated model rendering across 30 measured samples. The recorded loadMilliseconds value is 48.6 ms for importing and preparing BOTH the external glTF and embedded GLB variants, not one model. Both decode to 1,500 triangles and 256 KiB texture memory.

The forest/interior acceptance test renders two instances sharing one decoded asset (3,000 triangles submitted). Raw world snapshots are preserved in verification/model-worlds.json alongside the isolated benchmark. These snapshot timings are not sustained whole-game frame-rate measurements. The browser acceptance log includes walking enter/exit triggers and all three pointer-handle tools.

Initial 0.15.13 collision benchmark: a shared 1,500-triangle BVH built in 9 ms. Eight instance queries measured 2.2 ms median and 3.0 ms p95 over 100 samples after warmup. This synthetic sweep exercises one nearby asset and seven separated instances; it is not whole-game timing or a guarantee for densely overlapping buildings. Raw current measurements are in test-artifacts/model-mesh-performance.json. Debug overlays add rendering cost and are hidden during normal play.
