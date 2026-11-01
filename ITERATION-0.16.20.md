# Sprite Frontier 0.16.20 — mirrored antique door

November 1, 2026. Replaces the shared antique door with the exact Antique_Door_Assembly_Mirrored.glb accompanying the supplied Antique_Door_and_Frame_Mirrored.blend. The runtime GLB and offline JavaScript payload match SHA-256 90e3f8a67f0d15c42418732e8298800ec4862164e740deffdc3c43fbf57b8428. The source Blender project and companion preview/export files remain untouched in the supplying folder.

Frame node 0, hinged leaf node 1, node transforms and the original hinge pivot match the previous asset. Front/back UVs agree at 36 corresponding physical vertex positions. Redundant 3D handle geometry is removed as authored in the replacement; the clean texture supplies the handle. The frame remains 96 triangles and the door is 12, 108 total. Door ID, event placement, opening/arrival rules, transition timing, local collision and animation settings are unchanged.

Known old clean built-in payloads embedded in saved libraries upgrade at import/restore. Only the built-in ID plus matching byte count and dual whole-file fingerprints trigger replacement. Other IDs and modified/custom payloads stay intact. This is asset identity matching, not a security checksum; exact SHA-256 provenance is separately checked. The previous GLB is retained as a migration fixture, all documentation history remains, and earlier releases are untouched.

Validation: exact source/offline mirror hash, independent node/UV/triangle checks, old-library migration and custom-ID preservation; current local-door collision and cinematic/melt/fade round trips; model, core and function-comment checks. Mandatory projectile lights and live normal-map lighting remain included from 0.16.19/0.16.18.
