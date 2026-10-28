# Sprite Frontier 0.16.8 - original palette dithering port

October 28, 2026. Source iteration based on 0.16.7. The user supplied PhanicomPaletteDither.js v2 and approved the attached WebP swatches for the additional Fallout 2 option. Existing source, original plugin comments and prior iterations remain intact.

## Authoring workflow

Open Environment > Indexed palette / dithering. Enable indexed output, choose a palette/preset, adjust controls, then Apply palette settings. This is a per-map appearance setting with ordinary Undo, local persistence, project export and runtime export. Existing maps default to disabled; enabling starts with the original plugin's declared defaults. Editor controls remain readable and outside the game filter.

Presets:
- Original plugin defaults: Fallout-Inspired Warm, 8x8 Bayer, strength 0.82, scale 1, gamma 2.20, warmth 0.08, saturation 0.92, contrast 1.06, shadow protection 0.065, pair quality 5, Apply To UI true.
- Your saved Quake settings: Quake256, 8x8 Bayer, strength 1.00, scale 3, gamma 2.30, warmth 0.02, saturation 0.90, contrast 1.00, shadow protection 0.012, pair quality 5, Apply To UI true. These were read from the adjacent supplied game's plugin configuration, not inferred from the plugin defaults. That original entry was disabled; the preset enables the new optional effect deliberately.

All original controls are retained:

| Control | Original choices/range |
| --- | --- |
| Palette Mode | Quake 256; Fallout-Inspired Warm; additional Fallout 2 supplied swatches |
| Dither Matrix | 4x4 Bayer / 8x8 Bayer |
| Dither Strength | 0-1 |
| Dither Scale | 1-8 logical screen pixels |
| Gamma | 1-3 |
| Warmth | -0.5 to 0.5 |
| Saturation | 0-2 |
| Contrast | 0.5-2 |
| Shadow Protection | 0-0.5 |
| Pair Quality | 0.5-12 |
| Apply To UI | true / false |

Palette selection does not automatically neutralize grading controls: the original plugin applies gamma, warmth, saturation and contrast even in Quake mode. Dither Strength 0 still performs palette indexing, exactly as the supplied plugin does. The existing CSS appearance grade/blur is temporarily bypassed and nearest display sampling used while indexing is active, so a later presentation filter cannot invent colors outside the selected palette. Authored appearance and local smoothing preferences are retained and resume when indexing is disabled.

## Palettes and provenance

The original 256 Quake hex entries and FalloutWarm transformation arithmetic are unchanged. FalloutWarm is the original warmer derivative of Quake, not the actual Fallout 2 palette.

The approved 254x134 WebP has 21 columns by 11 rows: 231 visible swatches. The new option is explicitly labeled Fallout 2 - supplied swatches (231). Each swatch is the median RGB of its central 3x3 pixels, sampled row-major. No extra colors were fabricated to make 256, and a lossy reference image is not represented as an exact game-file palette. The shader's original paletteSize bound supports this additional size directly.

Original plugin, original WebP, sample coordinates/colors and source image SHA256 are retained in docs/reference/palette-dither/. The port retains the Phanicom / OpenAI attribution. Existing embedded gameplay font assets and their notices are unchanged; no new external software or game artwork was downloaded.

## Fidelity and GPU behavior

The original fragment algorithm is retained verbatim apart from required Pixi 5-to-8 input/output/sampler binding names. It still uses the original 256-entry vec3 float uniform array, original highp per-pixel gamma operations, weighted nearest/second-nearest search, original two-color source-RGB axis calculation, pair-quality rejection, shadow protection, Bayer thresholds and alpha output. There is no approximate lookup cube, alternative dithering algorithm, CPU image quantizer or Photoshop-style replacement.

Automated source comparison asserts that only the documented binding syntax differs. Both original palettes match the supplied plugin's Float32 arrays exactly. Direct GPU comparison renders the unmodified supplied plugin shader and the production port over the same deterministic 64x32 opaque input: five settings combinations, both matrices, original presets and range extremes plus approved swatches; all 40,960 compared RGBA channel values match. This establishes fidelity for the tested input/settings, not a claim of cross-vendor floating-point identity for every possible color/driver.

One reused GPU filter performs the indexing pass after existing world effects. Filter density follows the renderer and the pattern remains screen-space. Disabled maps do not allocate/use this filter. Original transparent/zero-shadow edge behavior is deliberately not redesigned.

## Apply To UI, menus and transitions

World-only mode retains the live HTML HUD unchanged above the filtered world. Apply To UI captures the existing DOM layout with original embedded images/fonts into one transparent retained HUD texture, then composites it with the world BEFORE palette indexing. Original controls remain the input/accessibility owners; editor chrome and native browser controls are not filtered.

HUD texture captures are asynchronous, single-flight and capped at 10Hz; the GPU world and final filter continue at the normal render rate. This bounds HTML/canvas serialization cost but means rapidly changing HTML HUD content can trail by up to a capture interval. The original crosshair is captured as a tiny cached glyph and positioned on the GPU every frame, so mouse-aim feedback does not wait for HUD snapshots. Original images are cached; the world framebuffer is not read back every frame. Capture failures retain original visible controls and expose a diagnostic instead of hiding the HUD. The full-window opaque pause menu uses the same original layout and click targets, temporarily presenting its indexed capture across the window; exact inline canvas styles are restored on Resume/disable. Input tests exercise the real Resume and Save controls.

Door cinematics use the existing animated door canvas as a live retained GPU layer, keeping the existing no-world-rasterization ownership and 4:3 letterboxing. The melt canvas is likewise uploaded live, after world effects and before HUD/indexing. Its old-world capture is unindexed and world-only to prevent double gamma/palette processing or duplicated HUD. No transition timing, destination placement, world simulation or sprite presentation changes are introduced.

## Event commands and persistence

The Event Editor's Palette dither command button provides the three original commands: SetDitherScale, SetDitherStrength and SetPaletteMode. They can be edited through the same dialog and participate in normal event draft Apply/Undo. Original numeric MZ Plugin Command (357) records for PhanicomPaletteDither lower to these handlers; unrelated plugins remain explicitly unsupported rather than executing arbitrary code.

Commands update a validated runtime override, not authored map data. The override travels with shared runtime state and is saved/restored through the existing per-cell journey/load validator. Old saves without it retain authored map settings. Documented parameter ranges are enforced; unsupported malformed inputs are rejected before adoption. A public FrontierPaletteDither.command(game,name,args) uses the same owner for integrations.

## Validation and delivery

See RELEASE-VALIDATION-0.16.8.json for executed checks. Coverage includes source/palette equality, GPU output, real original controls and presets, HUD on/off, full-window pause/Resume, original command editing/execution, original MZ command lowering, real Save serialization/load and page restart, Undo, and live door/melt/fade/immediate transfers with the effect enabled. Core gameplay, export boundary and maintained-function comment checks remain required.

This is a reviewed source PR stacked on 0.16.7; previous PRs/releases remain recoverable. No native package is generated for this routine source iteration. The renderer requires the existing supported WebGL/Pixi backend; indexing is a visual output pass, not an 8-bit indexed PNG export format.
