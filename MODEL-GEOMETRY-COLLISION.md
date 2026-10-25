# Walkable model geometry — 0.15.15

Select a model in the event's Model, collision and interaction zones dialog, choose Collision → Use actual model geometry (static), then apply the spatial draft and event. No manually assembled boxes are required.

Player collision now uses triangles horizontally and vertically. Stair treads within project step height can be climbed with adequate headroom. Box tops and roofs support standing, jumping and landing. Walking past a supported edge begins falling; hitting a ceiling stops upward motion. Genuine doorways stay open.

Support accepts slopes up to 60 degrees and ignores triangle winding. Transparent pixels do not create physical holes. Animated/deforming collision, rigid bodies, moving platforms and automatic mesh simplification remain unsupported. NPC horizontal collision remains supported; NPC vertical navigation has not gained player stair/jump physics.

None and Custom boxes modes remain available. Door interaction zones remain independent of model collision. Invisible events continue to work. Geometry collision never makes the entire building clickable.

Authoring mode shows orange translucent collision triangles and teal interaction boxes. Normal play hides outlines; use Show model collision and zones in the Map tab for debugging.

One local triangle BVH is shared per decoded asset. World queries include position, rotation and nonuniform scale. Continuous body sweeps prevent wall and vertical tunneling. Exact footprint clipping locates support; stair elevation is committed only after clearance and other blockers pass. modelCollisionDebug reports wall hits and query work; modelSupportDebug reports support height and BVH counters.

Tests cover actual imported glTF stairs climbed with WASD, roof jumping/landing with E, edge falling, fast swept landing, ceilings, transformed support and existing doorway/wall behavior. See WALKABLE-GEOMETRY-PROGRESS.md for remaining release gates.

Default automatic step height: 0.6 world units. Change project parameters when geometry scale calls for a different climb limit. Short forward step placement handles bevels before stair treads; contact recovery permits moving away from existing overlap.

## October 12, 2026 - 0.15.24 default supersedes older setup instructions

The older instructions above describe manually selecting geometry collision.
For new unconfigured 3D models, geometry collision is now automatic in the schema,
placement palette and event draft UI. Native room modules use their actual solid
volume automatically. Explicit non-solid/custom collision choices are preserved.
Interaction zones remain independent; collision does not make a whole mesh a
clickable event. Previous releases and their behavior are unchanged.
