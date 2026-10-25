## Current iteration — 0.15.17, October 9, 2026

Use ITERATION-0.15.17.md and HUB-DOOR-GUIDE.md for current behavior. Older version
claims below are retained historical notes and are superseded by those guides.
Windows: extract the full archive and run Launch Sprite Frontier.cmd.
Mac: extract the full browser archive and open index.html in Chrome. Keep the
entire folder together. Choose Hub Test to try the new doors, shops and static
items; original test maps remain available.

Current iteration: 0.15.15 fixes real-building stairs and post-landing movement. See ITERATION-0.15.15.md for current behavior and verification.

0.15.15 update: player mesh support, stair clearance and swept vertical collision are integrated. See ITERATION-0.15.15.md for current verification and limitations.

0.15.15 adds shared per-asset static mesh collision acceleration, swept horizontal body tests, NPC body queries, a readable collision-mode selector and a mesh overlay. Appearance, physical collision and interaction zones remain separate. Vertical model surface support and animated collision are future work.

# Current iteration: 0.15.15

The engine now combines billboard sprites with static GLB/glTF model events. Visuals, collision boxes and named interaction zones are independent. Models decode once into a shared library; events store IDs and transforms. Zones reuse event pages and commands rather than introducing another scripting language. Source files live under assets/models/runtime/<id>/; original authoring sources remain separate.

The renderer currently uses a measured CPU rasterizer with shared terrain/model depth. Future GPU rendering, animation, PBR lighting and richer collision can replace components without changing authored event logic. See MODEL-AUTHORING.md and MODEL-PERFORMANCE.md.

# Current iteration: 0.15.10

Event sprites now use engine camera depth, matching scenery and the player. Both event editors remove MZ Above/Same/Below controls. Blocks movement and Through control collision independently. Legacy priority data remains importable but never overrides drawing order. This release uses its own map-library storage; previous iterations remain intact. See ITERATION-0.15.10.md for current verification.

# Sprite Frontier — 0.15.9 working iteration

Sprite Frontier combines 2D sprite artwork with continuous-coordinate terrain, perspective cameras and fixed-camera interiors. Our goal is readable, extensible authoring for Daggerfall/Fallout-style exploration, quests and combat. RPG Maker MZ supplies the event workflow reference; complete MZ parity is outside this iteration's scope.

**Release status:** unfinished candidate. Earlier releases remain intact. Complete Windows and Mac browser archives are assembled and verified; nine acceptance fixtures pass from the freshly extracted browser archive. Native Windows launch remains unverified because this workspace prevents the runtime sandbox from reading its installation folder. Browser evidence comes from Chrome on Windows; macOS has not been tested.

## Design and implemented foundation

Maps, event drafts and playtest state are separate. Stable IDs connect maps, event definitions and sprite profiles. Versioned schemas validate before adoption and retain extension namespaces. Conditions, command validation, parameter dialogs and runtime services have separate modules. Work and diagnostics have explicit budgets.

The engine supports sculpted textured terrain, pools, grounded/flying events, jumping, fixed-room and perspective cameras, directional sprites, projectiles, combat, fog, music and the device HUD. New Map adds a separate map; it preserves bundled test maps. Export all maps for backups. Storage is namespaced to this iteration.

Authoring starts with right-click Create Event Here or Edit/Duplicate/Delete. Familiar event pages contain conditions, appearance, movement, options, priority, triggers and ordered commands. Apply commits a draft; Cancel discards unapplied changes. Nested AND/OR/NOT conditions extend beyond MZ. Pages have no fixed twenty-page cap, but explicit data/execution budgets remain. Reusable templates and Replace Event support staged interactions.

Named skills, inventory, quests, factions and reputation connect conditions to runtime commands and saves. The Courier example demonstrates a skill-gated conversation, travel, a one-time container and persistent delivery reward. The Patrol Encounter demonstrates recruitment, allied hitscan combat, enemy pursuit/return and persistence. NPC/enemy Wander, Patrol and Sentinel profiles expose bounded detection and pursuit distances.

Sprite normals can be generated/imported, previewed, applied to a profile, removed and saved. Prepared lighting is cached; capable browsers perform pixel work in a worker. Optional Doom-inspired melt transitions capture the old scene once and reveal the new scene, with reduced-motion fallback.

## Evidence and limits

Source regressions cover conditions, pages, waits, isolation, saves, replacement, actor behavior, transitions and fixed-room diagonals. Browser runners cover Courier journeys, party combat/save/travel, event dialogs, right-click creation/export/import, normal workflow and melt transfers. A 420-case forest camera sweep retains ground clearance while allowing underwater viewpoints; all 141 trees match terrain root heights. Underwater terrain occlusion hides distant roots while retaining upper branches.

These checks do not prove every offered workflow or full platform acceptance. Combined context/history, 25-page editing and isolated playtest return now pass portable browser tests. Native Windows and macOS acceptance remain unverified; final delivery audit is pending. Automatic cross-map companion spawning, companion melee, general weapon/armor database, unused MZ-specific battle/vehicle commands and scripted route jumping are deferred. Physical jumping stays authoritative. Unsupported catalogue entries remain unavailable.

ASSET-INVENTORY.json and ASSET-OPTIMIZATION-GUIDE.md separate encoded size, potential decoded storage and actual runtime measurements. Full residency/GPU-upload profiling and atlas/streaming implementation remain future stages. GAMEPLAY-ACCEPTANCE.md tracks evidence; MZ-COMPATIBILITY.md tracks adaptations and deferrals. COLLEAGUE-HANDOFF.md and CODE-GUIDE.md explain extension boundaries.
