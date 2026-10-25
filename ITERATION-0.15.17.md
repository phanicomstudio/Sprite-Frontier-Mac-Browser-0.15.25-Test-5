# Sprite Frontier 0.15.17 — current release behavior



October 9, 2026. This section supersedes the historical working checkpoints below;

they remain for design history and must not be read as current pending status.



- Per-model default/custom/unlimited visibility uses transformed bounds and stable

  distance coverage fading; rasterized model pixels use cell fog depth.

- Negative elevation offsets remain the single sink control, including during

  dragging; existing mesh movement, camera protection and Get Unstuck remain.

- Four new isolated hub acceptance cells, named arrivals, door-only transfer

  events, containers, shops, ownership metadata, static event-item drops and

  bounded pawn recovery. Protected cells and quest items resist cleanup.

- 3D black-space door presentation: supplied antique assembly, frame-only/door-only,

  up to two swinging/sliding leaves, local transforms/pivots, speeds and synchronized

  timing. Independent random/manual/silent open/close/creak sound controls.

- Large labeled controls, private drafts, existing undo/template mechanisms,

  compact playtest persistence and on-demand cell/resource diagnostics.

- Fresh 0.15.17 map storage prevents previous generated dimensions silently carrying

  over. Import older projects explicitly; bundled original test maps are preserved.



See HUB-DOOR-GUIDE.md for authoring, limitations and state ownership. The Mac

package is a complete browser folder, not a native macOS application. Source

comments and historical documentation are retained; the dated function reference

indexes current contracts without rewriting earlier explanations.



## Validation

74 source commands and 18 browser acceptance commands pass. Current function
coverage is 3,824. TEST-REPORT-0.15.17.md records exact scope and limitations;
complete distribution archives are built from this isolated source. Native
Windows process automation was unavailable; macOS hardware remains untested.

## Historical working notes (superseded)



# 0.15.17 working iteration — 2026-10-09



## Added user requirements — 2026-10-09



Door transitions now also require sliding panels (single or paired), a slow

camera approach, opening sound, camera passage into black shadowy space and a

closing effect/sound before destination reveal. Motion speed uses degrees/second

for hinged leaves and world units/second for sliding panels. Video reference:

https://www.youtube.com/watch?v=55jkvcFVbYQ (web retrieval failed; not yet visually

reviewed). Full sequence follows the user's description until video inspection.



Door transition composition also supports optional static frame and zero, one or

two moving leaves. Each leaf needs its own local hinge, transform, opening angle,

direction and swing speed (degrees/second). Support synchronized double doors,

door-only and frame-only scenes; persist shared asset references and settings.

This is pending implementation.



OpenMW is an architectural reference only: independently implement behavior;

do not copy/adapt its actual code. Add per-door/cell-transfer choice of existing

screen melt or a 3D door transition against black space, inspired by RE Remake

2002. Shared authored door assets, hinge animation, preview, transfer lifecycle,

failure fallback and persistence checks are required. See the dated entry in

`../NEXT-ITERATION-NOTES.md` for the complete banked contract. This feature is

pending implementation, not a completed part of this working build.



This directory is an isolated working copy, not a delivered release. Preserve

0.15.16 packages and their historical explanations. Complete Windows and Mac

browser distributions remain required before release.



## Current work



- Added bounds-aware model render candidates and per-instance default/custom/

  unlimited distance policy. This supersedes the origin-only 52-unit candidate

  cutoff for models; actor simulation scheduling remains unchanged.

- Added private-draft editor controls for the policy. Existing negative

  `heightOffset` already sinks terrain-following models and their collision/zones;

  the editor now explains this instead of adding a competing offset field.

- Targeted visibility tests and function-comment coverage pass (3,632 functions).

  Full regression/browser/package validation has not yet run.



## Remaining implementation



1. Fog-aware model rasterization and transition treatment; offset-aware dragging.

2. Cell settings, named arrival points, persistent state and diagnostics.

3. Live Door placement and template workflows, linked interiors/return doors.

4. Static dropped items, containers/shops, ownership, protected-cell cleanup and

   bounded pawn-shop recovery.

5. Complete integration tests, reference/guide updates and both full packages.



## OpenMW architectural references



Read on 2026-10-09, as conceptual references; no OpenMW code copied:



- https://gitlab.com/OpenMW/openmw

- https://raw.githubusercontent.com/OpenMW/openmw/master/apps/openmw/mwworld/cellstore.hpp

  exposes unloaded/preloaded/loaded cell states, mutable saved state, references

  moved between cells, and save/load operations. Our implementation should keep

  compact saved records independent from active runtime objects.

- https://raw.githubusercontent.com/OpenMW/openmw/master/apps/openmw/mwclass/door.cpp

  is a door-behavior reference for further study.

- https://raw.githubusercontent.com/OpenMW/openmw/master/LICENSE contains GPLv3

  terms. Direct code reuse requires an explicit license decision; independent

  implementation is the current approach.



## Working checkpoint — 2026-10-09, after OpenMW review



- Added per-pixel model fog blending using camera depth, so large geometry can

  blend with map fog instead of using the composite surface's zero fog depth.

  Syntax checked; visual/browser regression still required. Boundary fading is

  not complete yet.

- Added `src/hub-state.js`: bounded compact drops/storage/recovery, ownership,

  protected cells, quest-item protection, validation and fair budgeted cleanup.

  Cleanup uses unpaused simulation seconds. Full recovery storage leaves drops

  in their cell instead of deleting them. This store is NOT yet integrated with

  inventory UI, save import/export, runtime rendering or shops.

- Cell policy validation is wired into world validation when the module is

  loaded. New index load order includes hub-state before world validation.

- Isolated map-library storage namespace is now 0.15.17 to avoid old generated

  map dimensions being silently carried over. Explicit project import remains.

- Targeted checks passed: model visibility, hub state, model events, model

  transforms and function-comment coverage (3,645 functions). Full regressions

  and browser acceptance remain pending; do not package this as finished.

- Next: integrate runtime inventory/static drops and save state, add cell/door

  authoring and templates, then complete all acceptance and full distributions.

