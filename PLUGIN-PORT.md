# Supplied plugin adaptation — 0.6

Sources: Phanicom_ActiveCombat v0.9.0 and Phanicom_BloodSystem v1.0.1 supplied from Dark West Interactive. Unmodified sources live in reference/. Core modules retain selected original parsers, spread equations, audio envelopes and particle equations; native hosts translate these to the Frontier world and renderer.

This is a native adaptation, **not yet complete behavior/visual parity with every feature of the MZ plugins**. No original MZ map engine or battler runtime is loaded. The table records the practical boundaries so future work does not lose track of missing features.

| Capability | Current result |
|---|---|
| Fifteen configured weapon profiles | Imported, selectable and parsed with source note/profile defaults. Two source items provide explicit handgun/heavy-MG tuning. |
| Semi/auto/burst firing | Native timing, queued burst cancellation, cooldown and dry-fire gating. |
| Projectile/hitscan/shotgun/melee | Native swept world collision, source spread/pellet pattern, melee cone, penetration bookkeeping. |
| Weapon family names | Profiles retained; rocket/grenade/satchel/cluster/beam/cryo family-specific explosions, deployment, beam visuals and status effects are **not fully implemented**. They currently exercise generic source-defined attacks. |
| Ammo and equipment | Demo uses shared magazine/reserve and explicit profile selection. Full MZ item/equip-switch inventory coupling remains to be adapted. |
| Projectile origin / flash / angle | Per sheet, row and frame authoring; player and spriteProfile NPC origins use the same projection as drawing. First person uses fallback origin when actor feet are not projectable. |
| Enemy combat notes | Event editor accepts source combat notes; native chase/attack host reads parsed values. Full source AI/cover logic is not reproduced. |
| Pixel masks and cover | World collision is geometric and height-aware. Full source alpha-mask coverage/occlusion is not reproduced; sprite pixels do not dictate movement collision. |
| Ricochet | Frontier addition: 20% scenery chance, one reflected/randomized bounce. No actor/terrain bounce. |
| Source procedural sounds | Extracted sound profiles share native audio context and volume. |
| Supplied SE files | 124 files copied from accessible adjacent audio/se folder; se.zip path was absent. Manifest preserves filenames. Missing stock Laser1/2 references use supplied Beam Weapon / Beam Weapon 2 aliases. |
| Blood identity | Regular, cream/synth alias, none, hex, actor overrides, passive visibility, save restoration. |
| Blood sprays | Original regular/synth update equations at 60Hz, native perspective pixels/glow and bounded counts. Visual scale differs from MZ screen/tile space. |
| Passive drips | Three 4px-equivalent local drops, 5–24 frame intervals, 4px/frame fall, opacity −3/frame, lifetime 60. Follow actor; hidden/map-suppressed drops clear. |
| Damage, stains and gibs | Native damage bursts, bounded persistent stains and 4×4 sprite fragments. These are native visual adaptations, not exact source decal/gib artwork. |
| Death modes | Normal/sprite/gib/damage selection API, source threshold metric and delayed overlay. Dedicated death-sheet/image overrides remain incomplete. |
| Blood APIs | Actor/player/follower identity, sprayActor/Event/Character/At, local pixel helper, hide/show/reset/clear. Followers require a runtime follower list; no follower gameplay system exists yet. |
| Plugin commands | Native APIs exist; complete MZ PluginManager command compatibility/import is future work. |
| Save/load | Player combat and blood identities + event state supported. Transient effects clear; enemy combat progress is not yet serialized. |

Porting the remaining features should preserve their original data names where practical, add representative source-vs-native tests and supply dedicated artwork when visual parity depends on it. Do not treat a copied parser or a weapon profile label as proof that its full effect is implemented.
