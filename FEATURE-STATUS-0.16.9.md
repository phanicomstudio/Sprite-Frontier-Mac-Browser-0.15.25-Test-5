# 0.16.9 feature audit — October 29, 2026

This reconciles the current correction requests with source and live acceptance checks. It supersedes older wording only where explicitly described. Earlier design decisions and release notes remain history; nothing is silently removed.

| Area | Current implementation / verification |
| --- | --- |
| Terrain | Direct activation, visible brush ring, real pointer painting, one-drag Undo; indoor incompatibility explained. |
| Building pieces | Direct click placement through original validated generator, move/rotate/resize, material gallery and original async import; actual placement/material/Undo tested. |
| Prefabs | Existing model library, placement, connector snapping, collision and material slots retained; default click-to-commit with optional original preview. Imported meshes remain whole models. |
| Scene list | Existing large scene list, filtering, Shift-range/Ctrl-toggle, multi-delete and retained scroll remain available. |
| Shared plan | Actual common scene selection, group XY move, snap, delete and shared history. Pointer move/Undo tested. Specialized floor/artwork tools remain distinct. |
| Isometric composition | Actual transient yaw/tilt/scale camera, explicit map Apply, same placement tools. Preview/commit and perspective override tested. |
| Enemies | Event archetypes, HP/hostility, patrol/engagement/pursuit, cadence/pauses, aggression/cover, respawn/death/remains and sprite/muzzle controls; new health defaults and temporary two-view metadata verified. Missing art is optional, not replaced with invented death assets. |
| Weapon tuning | Every native projectile profile and separate actual melee owner exposed. Per-pellet/direct/blast damage, imported sounds, fallback and persistence tested. Explicit enemy overrides remain intentional. |
| Isometric occlusion | Actual geometry alpha cutaway and through-geometry enemy red contour verified in real GPU output, range and camera gates tested. Cosmetic only. |
| Shadows | Separate sun/iso-contact owners and opacity controls; NPC/event option; no perspective blobs. Existing receiver/caster caps are performance decisions, not incomplete toggles. |
| Dithering | Simplified section plus every original advanced parameter, exact source/GPU comparison and supplied palette provenance retained. |
| Doors/arrivals | Existing reciprocal/remembered-side transfer resolution, five-foot default and safe camera framing retained for all transition effects; return tests cover presentations. |
| Lighting/fog/sky | Existing map lighting, separate outdoor sun, player light, Dusty Plum geometry fog and independent sky appearance remain available. |
| Runtime/export | Editor-only helper excluded, runtime visibility helper included, audio bytes in typed project/map data. Native distribution verification is separate from source ZIP download. |

## Actual remaining architecture gaps

The audit also found earlier proposed systems which are **not delivered by this correction release**. They cannot truthfully be marked complete because their names appeared in the design chat:

1. Optional Building/Storey structural ownership, isolation, shared authoritative adjoining walls and hierarchy.
2. A single attached Opening + local Door + optional transfer assembly that cuts arbitrary host walls and moves/resizes with the host. Existing doorway building pieces and cell-transfer events remain separate tools.
3. Full contextual migration of every model/UV/event setting. Advanced settings are accessible and functional; their owners have not all been moved into the common inspector.
4. Ambiguous generator topology repair/remapping. Compatible component edits persist; incompatible edits reject rather than losing overrides. A full recoverable conflict-resolution interface is not present.
5. Complete event-item/combat weapon inventory unification and weapon dropping. The two existing owners remain separate. Do not expose a non-working drop command as supported.
6. Arbitrary RPG Maker/third-party plugin execution. Only registered supported commands run; the UI shows live command support. This compatibility boundary is deliberate, not permission to execute untrusted code.

These remaining items require further implementation and acceptance; the user's request to finish them remains outstanding. No claim that the entire editor roadmap is complete is made here. This document identifies gaps rather than treating disclosure as a fix.

## Deliberate splits retained

Contact blobs / outdoor sun; map darkness / shadow opacity; source asset / instance material; room structure / loaded cell / camera presentation; fixed artwork alignment / live geometry; authored world / temporary playtest; scene / project map / event draft / gameplay-default histories; explicit per-enemy damage / shared project damage; map melee / project native firearms. Consolidating controls does not silently combine these contracts.
