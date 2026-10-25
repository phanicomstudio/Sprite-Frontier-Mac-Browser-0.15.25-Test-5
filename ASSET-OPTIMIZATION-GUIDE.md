# Asset guide and optimization roadmap

Status: working iteration 0.15.9. The dimensions below are proposed starting budgets. Current inventory and runtime measurements are recorded separately below. Preserve source artwork; build smaller runtime copies reproducibly. Do not resize the originals in place.

## Create maps without replacing tests

Use **New map…** in the main toolbar. Enter a distinct name and choose blank flat, blank hills, or generated vector. The width, height and seed come from the toolbar. Creation adds a new unique map ID and selects it; the previous map stays in the library. **New generated map…** also creates a separate map. Blank templates have no events or enemies. Select previous maps using Active map. Export all maps for a portable backup: local browser storage alone is not a backup. Existing maps remain editable; this is not a read-only fixture system. Map creation changes the map library and is not part of placement undo.

## What to prepare

| Asset | Runtime starting size | Delivery format | Packing |
|---|---|---|---|
| Seamless ground | 512×512; try 256 for distant terrain; 1024 only after comparison | WebP lossy quality 80–90, or PNG where compression damages details | Separate repeatable images; do not place repeat textures in ordinary sprite atlases |
| Trees / large scenery | 512–1024 pixels tall; distant copy 128–256 | PNG or lossless WebP with alpha | Trim transparent space; group by biome and loading lifetime |
| Character animation | 128–256 pixels tall per frame; 512 only for sustained close-ups | PNG / lossless WebP | One or several sheets per character and animation group |
| HUD / interface | About 1–2× maximum displayed pixel size | PNG / lossless WebP | Separate UI from world assets |
| Opaque backgrounds | Match maximum useful viewport size; often 1024–2048 wide | WebP quality 80–90; JPEG fallback | Per room or area |

These dimensions refer to individual frames, not an entire animation sheet. Keep aspect ratio; do not stretch a tall tree into a square. Size from its actual screen footprint at the closest intended camera distance. Compare reductions in playtest, including foliage silhouettes and underwater views. Our current renderer has Pixi and Canvas paths: keep ordinary image compatibility until a GPU-specific loader is implemented.

PNG is the safe authoring interchange format. Keep layered source files separately. Lossless WebP is a useful runtime candidate for transparent art; lossy WebP should be approved visually. JPEG has no alpha and is unsuitable for cutout trees. AVIF is a later benchmark candidate, not a default that adds decode cost without evidence. KTX2/Basis requires renderer/loader work and a compatible fallback; changing a filename is insufficient.

## Atlas rules

Start with 1024×1024 or 2048×2048 atlas pages. Use 4096 only when measured benefits justify its loading and memory cost. Do not combine the entire game into one sheet. Group forest scenery, a character's animation, room scenery and HUD separately so maps can unload their own assets.

Use 2–4 pixels of duplicated edge padding for ordinary filtered sprites. Mipmapped atlases need padding designed for the deepest mip used; alternatively use texture arrays or separate textures. Store frame rectangles, original dimensions, trim offsets and foot pivots in a manifest. Disable rotated packing until the renderer explicitly supports it. Preserve animation timing, facing order and a consistent foot anchor when trimming frames; otherwise sprites can jitter or float.

Atlases can improve batching in the GPU path, but do not inherently reduce Canvas draw count. Measure draw calls and frame time. Never include unrelated unused sheets just to fill an atlas. Repeat textures need correct wrap and mip behavior, not adjacent sprite padding. A decal cutout with transparent gaps is not a seamless ground tile: first produce opaque seamless material, then test a 3×3 repeat.

## File size versus memory

An uncompressed RGBA image costs approximately width × height × 4 bytes: 1024² is 4 MiB, 2048² is 16 MiB, 4096² is 64 MiB. A full mip chain adds about one third. CPU decoded images, GPU copies and temporary canvases can coexist, so these are not total application memory figures. Halving both dimensions quarters pixel memory. PNG-to-WebP can reduce disk size while leaving decoded dimensions and memory unchanged.

Use external assets plus a manifest and content hashes. Avoid duplicating the same art in files, embedded base64 banks, screenshots and release folders inside a delivered package. Retain embedded compatibility until references and offline loading have been migrated and tested. Share source assets once through version control/LFS or a versioned asset store; each delivered iteration must still contain everything it needs to run.

## Lessons to adapt

Daggerfall Unity's documented texture workflow uses archive-specific billboard atlases and terrain texture arrays. That is evidence from the modern Unity implementation, not proof of the original DOS renderer's internals. Adapt reusable materials, shared billboard resources and bounded-area loading to our outdoor maps. See [Daggerfall Workshop texture documentation](https://www.dfworkshop.net/projects/daggerfall-unity/modding/textures/).

The official Remedy level tutorial describes portals dividing geometry into rooms for visibility optimization and says the same approach was used in Max Payne 1. Adapt room/portal visibility for interiors, with conservative fallbacks for openings and transparent geometry; use baked lighting where appropriate. Outdoor forests need spatial cells and view culling instead of treating every tree as a room. See [official Remedy tutorial, reproduced on ModDB](https://www.moddb.com/games/max-payne-2/tutorials/official-remedy-tutorial-1-creating-your-first-level). This is a Max Payne 2 tutorial referencing Max Payne 1, not an exact specification of every Max Payne 1 optimization.

Format references: [MDN image formats](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types), [WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices). Proposed sizes above are project recommendations, not sizes prescribed by those games.

## Roadmap and acceptance checks

1. **Measure first.** Inventory unique assets, dimensions, encoded bytes, estimated decoded bytes, duplicates, largest sheets and usage by map. Record cold load time, peak memory, frame time percentiles and draw calls in forest, fixed room, combat with companions, underwater and camera extremes on Windows and Mac browsers.
2. **Build runtime variants.** Add a repeatable conversion tool and manifest. Generate size variants, alpha trims and approved WebP copies without modifying originals. Compare visual quality and memory before accepting changes.
3. **Pack by use.** Add atlas rectangle/trim/pivot support across both rendering paths, with round-trip asset metadata and stable IDs. Validate all animation directions, foot placement, alpha edges and near/far views. Atlas support is planned, not complete.
4. **Load by map and region.** Load common UI/player resources once, map-specific packs on demand, and nearby outdoor cells with a bounded cache. Keep game/event state separate from resource residency. Verify travel and project reload without missing textures or state loss.
5. **Reduce invisible work.** Add conservative frustum/distance culling, scenery detail variants and interior portal visibility. Measure transparent overdraw. Distant companion/enemy simulation must retain correct combat and quest behavior; never silently discard party members.
6. **Consider GPU compression.** Benchmark KTX2/Basis only after loaders, mipmaps and fallbacks exist. Verify Safari/macOS plus Windows, texture uploads and memory rather than judging archive size alone.
7. **Release complete iterations.** Run representative regressions, publish asset manifest and performance comparison, include Windows and Mac browser packages plus colleague instructions. No patches or partial asset dependencies.

Do not promise a performance gain before measurement. Set final memory/load/frame budgets after baseline tests on the colleague's Mac and the Windows test machine.

## Measured 0.15.9 checkpoint

ASSET-INVENTORY.json hashes PNG/WebP/JPEG files and images embedded in the outdoor and candy banks. It covers 158 occurrences and 111 distinct image payloads. Encoded occurrences total 351.0 MiB; unique encoded payloads total 273.4 MiB. Estimated unique decoded RGBA storage is 1266.8 MiB. This estimate excludes audio, other embedded banks, GPU copies, mipmaps and transient buffers. It is not a measurement of simultaneous residency. Hash duplicates may be intentional offline mirrors; remove them only after reference and offline tests.

Several interface pictures are 4096×3072: each is 48 MiB of RGBA before extra copies. Build 1024/2048 display variants first and compare text readability at maximum HUD size; preserve originals outside runtime packs. A 2048×1536 copy is 12 MiB. Do not automatically downsize authored animation sheets: preserve frame rectangles or regenerate their manifests.

The armed normal-lit sheet is 1200×4800 and retains 23,040,000 bytes in its prepared canvas. The normal cache explicitly caps retained prepared pixels at 64 MiB and an individual sheet at 8 million pixels. Worker preparation measured about 173 ms off-thread; GPU upload and bitmap adoption still require profiling. Older CPU fallback measurements were about 4 seconds, with a 41.5 ms worst batch.

A headless Chrome forest underwater sample measured roughly 22.3 ms median / 33.4 ms p95 frame intervals. This is a regression baseline on this machine, not a Windows/macOS performance guarantee. Next priorities: smaller HUD variants, per-map residency instrumentation, cold-load/peak-memory measurement, then biome packing and conservative visibility reduction. Keep terrain depth occlusion and underwater views in every comparison.

Reproduce the inventory with Node: `node tools/asset-inventory.cjs <iteration-folder> [path-to-sharp-module]`. The tool uses the Sharp image library, reports decode failures and hashes payloads without modifying artwork. Install tooling dependencies outside delivered game assets. Its JSON is a scoped inventory, not a residency profiler.


## October 9, 2026 — hub asset roadmap

Continue using shared GLB/glTF assets, not embedded geometry per event. Static
models near 1,500 triangles remain a useful starting budget; actual visible pixel
area and texture residency matter as much as triangles. Keep authoring masters
outside the release. The supplied door ships only its 176-triangle assembly.
Keep OGG sound effects in audio/se and item sprite profiles under img/items.
Start small props at 128–256 px, ordinary sprites/normal maps at 256–512 px and
large landmarks at 512–1024 px, then compare actual on-screen quality. These are
starting budgets, not automatic conversion limits. Preserve alpha with PNG for
source sprites; JPEG can serve opaque model textures. This CPU renderer does not
yet decode GPU-compressed KTX2/BC formats; do not convert runtime assets to an
unsupported format. Atlas only compatible shared filter/material groups, with
edge extrusion/padding and mip-safe borders when mipmaps are introduced. Separate
source sheets from release/runtime records. The existing inline outdoor payload
is deliberately retained in this iteration; external shared streaming/LOD remains
future optimization. No Daggerfall/Max Payne/OpenMW source is incorporated.

Next measurements: loaded versus visible assets per hub; prepared texture memory;
landmark distance policies; cell unload residency; then offline resize/atlas
pipeline and streaming with regression tests. Never erase asset provenance.
