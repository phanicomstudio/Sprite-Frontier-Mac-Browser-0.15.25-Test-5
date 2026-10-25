# Rendering measurements — October 10, 2026

Headless Chrome on Windows. Values measure complete scene assembly and GPU submission on the CPU, not GPU completion, display FPS or native Mac performance. Short sampling windows are preliminary; sample counts are included. Browser heap estimates were privacy-rounded to 491 MB in this run and cannot establish precise memory growth. GPU memory is not exposed by this measurement.

The heavy fixture submits twelve extra instances of the same visible saloon asset, overlapping near the existing door. It measures shared geometry/depth cost; it does not represent twelve independently visible buildings. Source maps and model files remain unchanged.

| Scene | Scale | Filter | Samples | Median ms | p95 ms | Drawn models |
|---|---:|---|---:|---:|---:|---:|
| forest | 1 | crisp | 32 | 30.6 | 35.2 | 0 |
| forest | 1.5 | crisp | 28 | 34.7 | 41.7 | 0 |
| forest | 2 | crisp | 28 | 35.0 | 47.0 | 0 |
| forest | 1 | smooth | 30 | 33.3 | 35.6 | 0 |
| forest | 1.5 | smooth | 31 | 31.6 | 36.5 | 0 |
| forest | 2 | smooth | 30 | 31.9 | 34.7 | 0 |
| textured-interior | 1 | crisp | 60 | 16.8 | 21.9 | 1 |
| textured-interior | 1.5 | crisp | 27 | 35.9 | 37.9 | 1 |
| textured-interior | 2 | crisp | 13 | 68.0 | 83.6 | 1 |
| textured-interior | 1 | smooth | 39 | 26.0 | 31.1 | 1 |
| textured-interior | 1.5 | smooth | 14 | 64.0 | 77.8 | 1 |
| textured-interior | 2 | smooth | 6 | 131.3 | 142.2 | 1 |
| model-heavy | 1 | crisp | 44 | 23.0 | 29.9 | 13 |
| model-heavy | 1.5 | crisp | 17 | 49.6 | 66.4 | 13 |
| model-heavy | 2 | crisp | 11 | 73.8 | 87.7 | 13 |
| model-heavy | 1 | smooth | 33 | 29.8 | 39.4 | 13 |
| model-heavy | 1.5 | smooth | 15 | 62.1 | 65.1 | 13 |
| model-heavy | 2 | smooth | 7 | 106.9 | 132.6 | 13 |

Higher-density textured interiors substantially increase CPU raster work. Smooth sampling adds four-texel interpolation. Performance mode remains available; these measurements do not justify promising a particular frame rate. Further precise memory and visual acceptance checks remain pending.
## Superseding precise-memory run — October 10, 2026

The prior table is retained as history. The following run enabled Chrome precise memory reporting and supersedes its timing/memory observations. JS heap includes transient garbage and source artwork; it is not retained heap or GPU memory.

| Scene | Scale | Filter | Samples | Median ms | p95 ms | JS heap MB | Models |
|---|---:|---|---:|---:|---:|---:|---:|
| forest | 1 | crisp | 28 | 31.2 | 48.5 | 454.0 | 0 |
| forest | 1.5 | crisp | 32 | 30.9 | 33.2 | 561.3 | 0 |
| forest | 2 | crisp | 31 | 32.7 | 34.6 | 667.3 | 0 |
| forest | 1 | smooth | 33 | 29.7 | 35.9 | 447.9 | 0 |
| forest | 1.5 | smooth | 32 | 30.8 | 40.7 | 570.0 | 0 |
| forest | 2 | smooth | 26 | 38.4 | 47.6 | 648.7 | 0 |
| textured-interior | 1 | crisp | 40 | 24.1 | 35.4 | 420.6 | 1 |
| textured-interior | 1.5 | crisp | 24 | 37.9 | 44.5 | 404.1 | 1 |
| textured-interior | 2 | crisp | 12 | 68.7 | 83.8 | 405.6 | 1 |
| textured-interior | 1 | smooth | 36 | 25.7 | 41.3 | 405.0 | 1 |
| textured-interior | 1.5 | smooth | 11 | 77.2 | 91.4 | 426.6 | 1 |
| textured-interior | 2 | smooth | 7 | 112.5 | 124.4 | 409.1 | 1 |
| model-heavy | 1 | crisp | 34 | 31.3 | 36.0 | 438.6 | 13 |
| model-heavy | 1.5 | crisp | 23 | 40.2 | 44.9 | 416.1 | 13 |
| model-heavy | 2 | crisp | 10 | 74.2 | 115.0 | 421.5 | 13 |
| model-heavy | 1 | smooth | 29 | 30.7 | 43.1 | 423.7 | 13 |
| model-heavy | 1.5 | smooth | 9 | 89.7 | 97.4 | 441.0 | 13 |
| model-heavy | 2 | smooth | 4 | 134.5 | 136.3 | 453.2 | 13 |
