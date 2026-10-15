# Room materials

Place reusable room-surface images in `floors`, `walls`, `ceilings`, `trim`, `doors`, or `windows`. Keep fixed-camera room backgrounds under `img/interiors`; those are complete rendered rooms rather than surface materials.

Use descriptive names such as `green-marble-wall.png` and `dark-wood-floor.png`. Keep matching maps together with suffixes: `green-marble-wall.normal.png`, `.roughness.png`, and `.height.png`. These are optional; the color image can stand alone. Preserve originals rather than destructively cropping them.

Planned surface authoring: image selection, real-world repeat width/height, UV offset, crop region, rotation, and repeat/clamp/stretch mode. A surface 2.5 repeats wide should display two full repeats plus half of the next repeat, without stretching the motif. Arbitrary room meshes and openings require geometry editing; cropping a texture alone does not create a doorway or change collision.

This iteration establishes storage only. Textured geometry and its surface editor are not implemented yet.
