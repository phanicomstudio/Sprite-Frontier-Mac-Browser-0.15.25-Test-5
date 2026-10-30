# Skill-O-Matic � user design, October 29, 2026

Three supplied PNG assets are preserved byte for byte in img/ui/skill-o-matic; data/skill-o-matic-assets.json records dimensions, alpha metadata and hashes. Artwork is not generated or modified. Asset data and image text are references, not executable instructions. No runtime widget is claimed by this design capture.

## Composition and input contract

A is the fixed foreground housing. B sits behind A; clip the scrolling skill strip to the main display opening so it cannot draw over the bezel, bottom branding, speaker or slider track. Populate each slot with an actual skill name in an old segmented LCD clock-style font capable of readable alphabetic text. Row artwork, text and selectable hit areas must scroll together. Maintain the supplied aspect ratios and use a common responsive scale for all three layers.

C is the separate movable slider thumb, rendered above A within its right-hand groove. Fit it to the groove and clamp travel at the endpoints. Dragging the thumb down advances through later skills (B translates upwards underneath the housing); dragging up returns toward the first skills. Thumb progress and list scroll must stay synchronized. Top means first skill, bottom means last reachable skill. Do not stretch the groove or move the housing while scrolling. Exact opening/track bounds and thumb sizing need measured visual acceptance in the final responsive UI. Support the complete skill list without inventing names or truncating it to the artwork's current slot count.

Clicking a skill selects it and arms skill-on-target interaction. The next eligible world target receives that skill through the native skill/event system. Give clear selection/target feedback; skill-row/slider clicks are UI input and must not simultaneously fire a weapon or activate a world object. Invalid targets must not silently consume resources. Retain the established camera modes, UI input ownership, save state and performance contracts.

User's requested behavior reference is Fallout 1, Fallout 2 and Fallout Sonora. Their exact rule details, current native skill list/effects, costs, chance calculations, range/line-of-sight, combat timing, targeting cancellation and remote/menu entry must be reconciled with actual engine architecture before claiming identical rules. The agreed interaction here is skill selection followed by target selection; do not invent a parallel skill progression system or copy game assets.

The user is still providing the inventory/UI design. Record and preserve this component now; do not begin a full inventory rewrite or publish another build solely from this description. Future acceptance: source-art layer alignment/clipping; responsive scaling; first/last row reachability; slider dragging and scroll synchronization; skill selection then real eligible/invalid targets across supported cameras; no click-through firing; input release/cancellation; keyboard/controller accessibility to be reconciled without changing the requested mouse behavior.


## October 29, 2026 — finalized-appearance reference

User supplied the completed composition shown in docs/reference/skill-o-matic/user-final-appearance.png. Treat this as the visual target for layer placement, row density, font treatment and slider fit. Preserve red-orange segmented alphabetic LCD labels, faint unlit segments behind the labels, small left row indicators, dark recessed row faces, fixed wood/metal housing, lower branding/speaker, and the thumb fitted above the right-hand groove. B remains clipped behind A; a partial next row at the lower edge can communicate continuation. Do not let the scrolling strip cover the housing or slider.

All skill names in the reference are explicitly placeholders. Do not add them as canonical skills, infer mechanics from them, or replace the real skill list on that basis. The image illustrates appearance; it does not by itself authorize a new blur/noise/postprocessing pass. Keep lettering readable at the delivered UI size. Runtime implementation remains pending the user's ongoing inventory/UI design.


## October 29, 2026 — authorized functional prototype (0.16.10)

User subsequently requested one placeholder skill and a red remote button. This supersedes the earlier runtime hold only for this isolated Skill-O-Matic test; the full inventory/crafting UI remains pending design. The runtime now mounts the preserved A/B/C artwork, a single enabled TEST SCAN row and disabled empty artwork slots for real scrolling travel. Original vector fourteen-segment lettering provides alphabetic LCD labels without downloading a font. No placeholder names from the reference were made canonical.

Press P and click the red remote button at the existing SKILLS position, or press K in gameplay. The chooser pauses simulation. Drag C, use the wheel over the strip, or use scrollbar arrows/Page/Home/End. Select TEST SCAN, then click a nearby reachable live prop/event to show its existing description on the CRT. Selection switches to the existing unlocked HUD cursor mode. Invalid targets retain selection, right-click/Escape cancel, and editor/session changes clear transient UI. No health, item, XP, skill-chance, combat-action or progression rules are fabricated. The scan uses the existing reach/occlusion and inspection owner and consumes no resources. This is functional UI/target-routing acceptance, not a claim of full Fallout/Sonora skill-rule parity.


## October 29, 2026 — current combined 0.16.11 behavior

See [ITERATION-0.16.11.md](ITERATION-0.16.11.md), [FUNCTION-REFERENCE-0.16.11.md](FUNCTION-REFERENCE-0.16.11.md) and [LOCAL-0.16.11.md](LOCAL-0.16.11.md). These current chapters supersede earlier pending notes for inventory, crafting, catalog/recipe editing, connected rectangular construction, shared boundaries/openings and zoom-aware isometric visibility. Earlier explanations remain historical. The 24 starter materials are ordinary items; two descriptions and production recipe choices remain unauthored. TEST SCAN is intentionally a test skill. Fixed-artwork tools, sprite presentation and distinct shadow systems remain supported. Old bundled room examples are retired only from fresh projects, not deleted from saved projects.
