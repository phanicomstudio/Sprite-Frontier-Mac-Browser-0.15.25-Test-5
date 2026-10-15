# 0.12 — Terrain, water, movement and vector authoring

## Quick test
1. Open the editor with F2 and choose Terrain.
2. Click Create wading test pool. A six-unit pool appears six units left and four units ahead of the map spawn. Its floor is one unit lower, with water 0.8 units above the bottom.
3. Return to playtest and walk into the pool. Candy's submerged body is hidden, not tinted. Walk on the bottom; E still jumps in ground mode.
4. For your own terrain, choose Raise, Lower, Flatten or Smooth and left-drag the surface. The ring shows brush size. Right-drag looks around. Undo/redo treats a drag as one change.
5. Paint Water or Erase Water with the same brush. Surface height applies to new painted cells; separate painted pools can have different levels.

## Clean editor
Map contains atmosphere, vector appearance, soundtrack and activity settings. Terrain contains generation, sculpting and water. Place contains unique reusable types and selected instances. Events lists the placed events on this map and opens their page workbench. Database contains reusable type authoring, sprite appearance overrides, movement ability, rules and combat testing. Existing event pages, conditions, commands and muzzle tooling remain available.

Create a type in Database, then use Place type. A named type replaces its prior definition rather than creating duplicate entries. NPC types can start from a blank event or copy the selected event with its pages. Props retain canonical collision sizes; selected sprite profiles and names survive placement/export. This is an initial map-carried type library, not a multi-project database manager. Editing a definition affects future placements, not existing instances.

## Water materials
An opaque flat plane uses a repeating procedural texture. UV warping and flow animate the surface; no fluid simulation or moving wave geometry is used. Material controls include texture, scale, color, warp speed/strength and flow X/Y. Water currently shares one material per map, with independent painted surface levels.

Import PNG/JPEG/WebP through the water control to embed a texture in map JSON, so it survives export. File-backed materials can use filenames under img/water; the selector retains imported/referenced names. img/ground and img/sky folders establish the same asset convention for later materials; ground/sky texture rendering is still future work. World/playtest imports allow up to 20 MB. Individual embedded textures are limited to 10 MB before encoding.

Water hides submerged raster sprites using reusable screen-space masks rather than generating a new cropped texture every frame. Vector entities use equivalent clipping. Shared surface meshes and spatial buckets limit work to nearby water. Shores currently use one-unit painted cells; smoothing/polygon shorelines and underwater camera effects are future refinements.

## Vector appearance
Vectrex > Vectrex appearance offers Unaltered, Vectrex monochrome and Full-color vector. Glow and line gaps remain adjustable. Sprites and textures independently choose Original, Phosphor or Outline artwork. Selected props/events can override sprite treatment in Database. Phosphor preserves artwork and can recolor it; outline conversion extracts silhouettes once and caches them. Authored vector sprites will produce better interior detail than automatic silhouettes. Raster sprite glow shares the existing half-resolution halo layer. Texture treatment is supported by water and the shared image-preparation API; it does not add ground/sky textures yet. The HUD is unaffected.

## Floating/flying foundation
Database > Player movement ability chooses Ground, terrain-relative Hover, or absolute-altitude Free flight. E ascends and Q descends in free flight. Clearance, ascent/descent speed, response/acceleration and altitude bounds are editable. The FrontierFlight.update(actor, world, dt, axis, profile) API is reusable by future balloons, creatures and vehicles. This release exposes the player test profile; NPC/vehicle flight authoring and collision behavior are later integration work. It does not implement swimming.

## Maintenance and performance
Terrain stores sparse additive vertex edits and bilinearly samples them in the shared height function used by movement, aiming and rendering. Sculpting visits only the brush neighborhood, and smoothing snapshots only nearby vertices. Generation supports flat, preset hills and seeded random undulation. The bounded visible terrain-height cache invalidates after a terrain revision. Water cell indexes invalidate after painting, not animation. Undo is limited to 30 snapshots with an approximate 32 MiB budget. Raster conversions are cached outside repeated drawing work. See CODE-GUIDE.md and source comments for ownership.
