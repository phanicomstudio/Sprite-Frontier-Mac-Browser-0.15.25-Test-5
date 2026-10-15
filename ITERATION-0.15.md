# Sprite Frontier 0.15

Extract the complete Windows ZIP and run **Launch Sprite Frontier.cmd**. Keep all files together. The previous 0.14.1 distribution is unchanged.

## Try the new rooms

Choose **Room Test** in Active map for the supplied empty room, with a fixed orthographic camera. Choose **Geometry Ruin** for a free-camera room made from simple boxes. **Vector demo** retains the terrain, water, Cerebral anomaly, music, weapons and Vectrex options.

In the Vector demo, the gates two tiles left/right and three tiles south of the starting point lead to Geometry Ruin/Room Test. Approach a gate to travel. The hub guide nearby explains the relic test. Collect the ruin relic, return and speak to the guide: the chest and dialogue remember your progress. Blood, Cerebral, weapons and inventory carry between connected maps. J, or the remote's Cartridge button in cursor mode, opens the journal.

Choosing a map directly starts a fresh test. Use authored gates to test persistent travel. Save playtest exports the map project, visited-map state and journal; Load playtest restores them. Export all maps backs up authored maps rather than the current combat session.

## Author an interior

Press F2 and select **Room**. Room style chooses fixed artwork, free-camera geometry or outdoor terrain. Import room artwork, then align its floor axes under Camera alignment. The supplied Room Test is calibrated already. Collision coordinates remain world tiles; changing alignment changes their image placement.

Use Draw floor outline to click corners, then Finish floor outline. Drag solid footprints for walls or furniture. Select/drag adjusts corners and objects; Apply selected element edits their dimensions. Place player spawn, named entrances and map exits. For each exit choose a destination map and arrival entrance. Undo/Redo apply to room edits as well as existing authoring tools. The green outline is walkable; red footprints are solid.

Furniture PNGs can be placed separately, with feet anchors, display dimensions and a circular collision radius. Static boxes supply floors/walls and obstacles in free-camera rooms. Fixed camera is independent of P interaction mode. Its perspective does not change when toggling P.

## Normal-map workbench

Open the normal workbench from the Room tab. Import artwork, generate a rounded silhouette approximation, then raise/recess/smooth height with the brush. Preview height, normals or lighting; move the preview light. Undo restores recent brush edits. Export the normal PNG or height PNG; height PNGs can be imported again. Import the exported normal into the selected furniture element, or the room background when no furniture is selected. Set the room light direction, ambient and strength to match the baked main light.

The tool preserves the original color artwork. Working height/normal images are limited to 512 pixels on the longest side to bound editing cost and memory. Generated normals are an approximation requiring hand correction, especially for a complete room image. Existing baked shadows remain in the color image. Scene lighting currently supports one directional light plus ambient through normal maps; colored local lights, dynamic shadows and day/night are future work.

## Corrections

- Very brief movement starts a visible walk sequence while releasing movement stops physical travel immediately. Tested equipped and holstered in all eight movement directions.
- Underwater rendering uses a shared camera classification for body visibility and screen distortion, including cameras just beneath the surface and orbit cameras outside a basin looking toward a submerged player. Tested eight sprite facings with each weapon state.
- Cerebral backgrounds crossfade without fading Candy's portrait, chassis or lens. F2 → Database exposes transition duration; zero switches instantly. Rapid changes retarget the current blend.
- Holstered state now survives a playtest save/load.

## Performance and limits

Collision edges, box faces, images and normal filters are cached. Room previews redraw only when visible and changed; normal editing runs on demand and pauses simulation. Built-in room artwork is referenced once rather than copied into each map snapshot. Rendering retains sprite/graphics pools and existing outdoor culling.

Headless Chrome draw-submission measurements: 512×256 map with 8,028 objects and 1,296 water cells: 8.7 ms median, 13.2 ms p95, about 60 MB JavaScript heap. Previous recorded run: 10.4 ms median, 15.5 ms p95, about 81 MB. Fixed room with 128 normal-lit furniture sprites plus lit background: 1.0 ms median, 2.1 ms p95. Geometry room with 128 boxes/640 faces: 3.5 ms median, 6.0 ms p95. These are submission timings on the test machine, not GPU completion times or a native frame-rate guarantee.

Rooms use painter ordering, not per-pixel depth maps. Furniture with intersecting shapes may require split foreground layers. Collision footprints are axis-aligned rectangles or circles; raised platforms, stairs and ramps are not yet walkable elevation geometry. Box interiors are a foundation, not a high-poly model importer. Swimming and real fluid simulation remain deferred. Native Windows launch was not retested in this iteration; browser/WebGL behavior and package integrity were verified.
