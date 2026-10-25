# Sprite Frontier 0.15.26 — projectile arsenal

October 22, 2026. This record supersedes older instant-hit/penetration descriptions for the active gun pipeline. Earlier source, comments and release records remain historical references.

## Current behavior and deliberate differences

Every gun shot travels as a finite projectile in world XYZ metres, Z up, with seconds for time. Sweeps test the whole travelled segment against room geometry, rotated boxes, model collision meshes/custom boxes, solid actors/events/doors, terrain and map boundaries. Model collision mode None and nonsolid triggers intentionally do not block shots. Collision uses the complete geometry, independent of editor cutaways. A small conservative projectile envelope can contact corners early. Impacts are terminal: penetration and ricochet settings are retired for this pipeline. Grenades explode on contact or their fuse rather than bouncing. Explosives also detonate at maximum range/lifetime. Lightning is a finite projectile rather than a beam. Accuracy remains authored per weapon/map; zero spread retains every shotgun pellet. Locked 0.15.17 sprite presentation is unchanged.

Reference mechanics use a deliberate world scale of 0.04 metres per reference unit: bullets/nails/rockets 40 m/s; grenades 28 m/s with 8 m/s upward launch and 32 m/s² gravity. Grenade fuse is 2.5 seconds. Explosions have a 9.6 m radius, distance falloff, solid-geometry occlusion and half self-damage, with collision-checked player blast impulse. Generic existing effects use no Quake artwork.

| Existing weapon type | Shots / ammo cost | Damage per shot | Ammo |
|---|---:|---:|---|
| Pistol | 1 / 1 | 4 | 9mm, existing magazine/reload |
| Shotgun | 6 / 1 | 4 | Shells |
| Double shotgun | 14 / 2 | 4 | Shells |
| Needle Gun | 1 / 1 | 9 | Nails |
| Heavy Machine Gun | 1 / 2 | 18 | Nails |
| Grenade launcher | 1 / 1 | 120 | Rockets |
| Rocket Launcher | 1 / 1 | 110 direct, 120 splash baseline | Rockets |
| Beam Weapon | 1 / 1 | 30 | Cells |

Double shotgun and Heavy Machine Gun fall back to the weaker one-round discharge when only one round remains. Other existing archetypes remain available and use finite travel. Pool-fed weapons consume inventory directly; reload does not manufacture ammunition. Pistol retains its magazine/reserve behavior. Saved inventory is restored before equipment so switching/travel does not overwrite ammo pools.

## Pickups and authoring

Place Item offers eight weapon pickups and five ammunition records. Choose quantity and Touch or Interact as before. Inventory Equip equips an owned weapon item. Dropping the last item for the active weapon falls back to pistol; dropping still produces a static interact item. Existing custom item catalogs can add missing presets using Item Definitions → Add weapon and ammunition pickup presets, then Apply; inheritance must be disabled to edit a custom catalog. Matching custom IDs are preserved.

Weapon Definitions retains speed/range, accuracy/spread and firing controls and adds gravity (m/s²), upward launch (m/s), blast radius (m) and blast damage (HP). Penetration is displayed as retired, with no active traversal effect. First-person, third-person and fixed/isometric launch paths share the same world collision integration. Camera/sprite presentation has not been replaced.

## Gibbing and blood identity

NPC lethal hits with strictly more than 40 HP excess damage produce the existing project sprite fragments. Exactly 40 HP excess remains an ordinary death. Existing explicit NPC gib flags and configurable player death mode/metric/threshold are retained. Living actors cannot gib. Cream and synth are aliases for ONE cream blood identity, not separate types. Normal hits and death bursts resolve the victim's identity through PhanicomBlood: red particles/stains for regular blood, cream particles/stains and cream physics for cream/synth. Bloodless actors emit no blood particles or stains. Fragment images come from the actor's existing sprite frame; no Quake gib mesh or texture is imported. Particles/fragments remain bounded by existing caps and lifetimes.

## Provenance and obligations

This iteration independently implements mechanics within Sprite Frontier; it does not copy Quake/OpenMW source or data. The official Quake source release distinguishes GPL source from separately copyrighted game data: https://github.com/id-Software/Quake/blob/master/readme.txt . Copying GPL implementation would require a separate license/distribution compatibility assessment and applicable source/license obligations; that direct port was deliberately avoided here. Existing project/vendor notices remain in place. This is a provenance record, not legal certification of all preexisting project artwork.

The OpenMW-Quake reference's development/build-gameplay-assets.py imports gib1/gib2/gib3 from development/quake-assets/converted-static into meshes/quake and textures/quake. They are identified there as Quake chunks, so they are not treated as original project-created gib artwork and are excluded.

## Verification and limits

Production browser checks cover thin/rotated walls, ceilings, initial overlaps, high-speed terminal contact, real decoded mesh doorway openings, grenade gravity, finite discharges in four camera configurations, actual touch pickups and inventory equipment, shared pool/fallback costs, restoration, splash occlusion and self-impulse. Blood host checks cover the overdamage boundary, living guard, cream/synth alias, red/cream particle classes and matching stains, and bloodless actors. Camera launch checks exercise production paths; they are not a complete manual aiming playthrough of every custom map. The user retains high/smooth performance acceptance. Windows/Mac-browser packages contain the same source; macOS host acceptance is not performed on this Windows machine.

The maintained-function coverage check and focused weapon/item/sprite regressions must pass. Coverage proves comments are present, not that all inherited explanations have undergone a fresh manual audit.

## History

Based on complete 0.15.25 Test 5 source/assets. Prior releases and archived SOURCE-HISTORY/PERFORMANCE-EVIDENCE remain in the previous source folder and existing full .25 release archives; those bulky historical evidence folders are not duplicated into this release. Existing historical documents in this folder remain unchanged below their dated additions. The desktop deliberately reuses the .25 user-data profile to preserve local projects. Room editor redesign remains banked for later consultation.
