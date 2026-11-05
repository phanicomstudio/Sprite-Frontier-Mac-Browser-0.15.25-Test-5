# Antique door transition test resource — 2026-10-09

Selected runtime resource: `assembly.glb`, copied unchanged from the supplied
`Antique_Door_Assembly.glb` (293,664 bytes).

SHA-256: F40379188A383452D78B82921071C6B4E6C5C7FF431E43111607D14255C1D8BE

Verified GLB contents: frame node 0, door-leaf node 1, 176 total triangles
(96 frame + 80 door), two materials and one embedded JPEG. Independent nodes
allow the frame to stay still while the leaf rotates. Reuse one decoded asset;
do not bundle separate door/frame copies with duplicate embedded images.

Supplied authoring facts: left hinge viewed from decorated front; door node
translation is [0.007200002670288086, 0, 0] in glTF Y-up coordinates. The authored
preview rotates -65 degrees about glTF local Y (engine local Z after conversion).
Keep the node pivot/assembly alignment; do not recenter the leaf at its bounds.
Opening approximately 0.90 m wide by 2.14 m high; leaf 0.886 by 2.117 by 0.055 m.
Reverse/edges use plain wood; embedded reference photo retains its watermark.
No collision mesh or gameplay script is included.

Not included in this test folder: Blender backup, separate door GLB, separate
frame GLB, or another photo copy. Originals remain in the supplying workspace.
Future independent asset imports remain supported by the planned composition
contract; this test uses node selection within a single shared assembly.

Transition presentation and sound integration are pending, not implemented by
copying this asset. No supplied door sound files have been selected yet.


October 12, 2026 — clean texture replacement for iteration 0.15.23.
Selected Antique_Door_Assembly_Clean.glb from the supplied Antique_Door_Clean_Pack.zip, distributed as assembly.glb and mirrored in src/door-asset.js for offline loading. SHA-256: 7aa9bb5965b24cf8dc554f1dc872a6ec01c41c7a5b6b535b1e6d2a02dfad2aa1. Frame node 0 and hinge leaf node 1 retain identical geometry and transforms (96 and 80 triangles). The embedded texture is sufficient; Blender sources, preview images, separate leaf/frame duplicates and texture-edit instructions are omitted from runtime distribution. Prior releases and the supplied pack remain intact.


November 1, 2026 — current mirrored replacement (0.16.20)

Supersedes the historical resources above. `assembly.glb` is the exact supplied `Antique_Door_Assembly_Mirrored.glb` accompanying `Antique_Door_and_Frame_Mirrored.blend`, exported in the supplied Antique_Door_Mirrored folder. SHA-256: 90e3f8a67f0d15c42418732e8298800ec4862164e740deffdc3c43fbf57b8428; 1,728,984 bytes. Frame node 0 remains 96 triangles; leaf node 1 is now 12 triangles, with the same [0.007200002670288086,0,0] glTF hinge translation. The redundant 3D handle geometry is removed; the clean texture supplies the handle on both sides. Total 108 triangles.

Front/back UV correspondence is validated at matching physical positions, allowing the rear view to appear properly mirrored. Built-in ID, dimensions, node IDs and pivot remain compatible with existing local doors and cinematic transitions. The offline JavaScript mirror contains identical GLB bytes. Old built-in clean payloads in saved libraries upgrade on import/restore using byte count plus dual whole-file fingerprints; custom IDs and modified payloads are preserved. Previous clean GLB is retained in tests/fixtures for migration acceptance and prior releases remain intact.
