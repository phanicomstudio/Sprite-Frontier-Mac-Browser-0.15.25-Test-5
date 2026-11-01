# Sprite Frontier 0.16.18 — live normal-map lighting

November 1, 2026. This corrects 0.16.17's fixed-relief shortcut. Its source, explanation and generated artifacts remain preserved, but its lit WebP artwork is no longer selected for rendering. Original albedo stays unchanged. The actual Sprite Fusion OpenGL normal PNG is sampled with live map/player/projectile lights and outdoor sun direction.

## Drawing contract

Characters, props, pickups and enemies use a pooled single-pass material on the exact existing 0.15.17 pitched camera-facing rectangle. Tangent X is image-right, Y is image-up and Z faces the camera; the basis follows camera yaw/pitch in first-person, third-person and isometric modes. Albedo and normal atlas frames use identical normalized coordinates, with half-normal-texel inset to prevent adjacent-frame bleed. Alpha, existing depth masks, frame selection, sprite proportions, muzzle authoring, color effects and fog retain their original owners.

Terrain and animated water reuse their mesh submission and sample a separate repeat-wrapped normal texture. Building surfaces and opaque models use the existing geometry GPU path, extended to affine orthographic projection without changing the CPU occlusion grid. Fragment derivatives derive tangent bases from the actual world position and mapped UVs, so texture rotation/repeat and sloping geometry agree. Derivatives are evaluated before divergent light/shadow branches. GLTF authored normal assignments and normal scale take priority; the existing UV channel is used. Unsupported extra UV sets remain outside the existing importer contract. Transparent/coverage model fallbacks sample directional normals in their retained CPU raster path.

Room furniture uses the same live billboard material. Fixed/prerendered artwork receives light on its calibrated image plane: a normal image cannot recover the hidden 3D depth of a painted room. Walkable geometry and collision remain independent. UI, portraits, skies and procedural/emissive effects are excluded.

Ambient darkness and up to eight selected lights retain their radius, color, falloff and budgets. Outdoor normal response shares the authored sun direction with a restrained 0.35 diffuse contribution; interiors receive no sun. This does not add a second shadow system. Perspective terrain-conforming sun silhouettes and isometric contact blobs remain deliberately separate. Sprite light blocking keeps the existing room-volume center approximation; geometry shaders retain their existing per-fragment room-volume blockers. This does not introduce mesh/terrain shadow mapping.

## Preparation and performance

All 116 packaged normal PNGs are reused. Future supported imports use the pinned local WASM generator, one queued job and persistent source/recipe/layout reuse. Generation now produces only the bounded normal map, never a native-size baked-lighting copy. Original artwork stays native-size. Normal detail remains at most a 512-pixel side; sources over 8192 pixels/side, over 16 megapixels or with nonuniform declared frames keep original artwork and report the limit.

The automatic sprite cache conservatively reserves one MiB per source and retains its existing 128/256 MiB device-dependent bound; custom sprite normals have a separate 64 MiB bound with cold eviction. Material normals follow their existing albedo owners and geometry texture-upload LRU. Cold eviction releases shared normal GPU sources. Readiness includes material preparation; sprites use original art while a normal is pending. No generation, full-image readback or fixed shading runs per frame. Normal mapping has real GPU cost and is not claimed to be free.

Paired warmed wilderness checks observed one normal world submission/frame, zero repeated normal preparation and bounded cache use across first/third/isometric cameras. Initial live draw medians were approximately 8–10 ms versus 5–6 ms without defaults on this workstation; these are draw-only measurements, not whole-game FPS or universal hardware guarantees. Detailed current measurements live in the release evidence.

## Authoring and validation

No new enable switch is required. Enable map lighting, reduce ambient brightness if necessary, and move a colored local light or fire a lit projectile near a surface to see directional detail. Environment → Sprite normals reports preparation and permits custom overrides. Manual preview direction is a workbench test lamp; the game uses live world lights. Custom strength controls normal detail, and removing the binding restores defaults without changing albedo.

Acceptance includes actual GPU pixels for opposing lights on sprites, terrain, water and perspective/orthographic geometry, plus a real projectile-factory emitter; exact unchanged albedo/alpha; native frame dimensions; queued imports, cache reuse/reload, source replacement, custom priority/removal; model channels; manual generator Apply/Undo; checkbox persistence; lighting/fog; modern reciprocal doors; runtime export; function comments; Windows executable and archive integrity. Tests for static 0.16.17 relief are retained historically; automatic-normals1618 and live-normals1618 are their current behavioral successors.

Final warmed run after normal wrapping/frame-boundary fixes: defaults off third/first/isometric medians 5.2/5.1/5.5 ms; live defaults on 5.8/6.1/5.6 ms, p95 7.4/7.9/7.8 ms. Automatic cache reservation was 27,262,976 bytes with no budget fallbacks. Results vary with cache/driver/workload; initial slower measurements above are retained rather than implying a universal bound. The live-material presence assertion confirms these timings did not silently bypass the new sprite shader.
