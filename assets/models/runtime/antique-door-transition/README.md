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
