# Sprite Frontier 0.16.3 — door authoring and atmosphere

October 26, 2026. Source iteration on a review branch; prior releases and main are preserved. The user additionally requested complete local Windows and Mac/browser packages. Their ZIPs and expanded folders are delivered separately from Git.

## Doors

New doors default to Automatic reciprocal door. This resolves only when exactly one door on the destination map leads back to the source cell. With multiple doors, choose the destination door by name. Arrival is 0.3048 metres in front of its walkable side, facing away, with the existing blocked-arrival check and transfer cooldown. A missing or ambiguous pair rejects transfer visibly. Local +Y is the unrotated model's front; game yaw uses X=sin(yaw), Y=cos(yaw). Walkable-side facing is independently authorable in degrees (0 +Y, 90 +X). Rotating a door updates explicit arrival-facing metadata together with its model rotation in one transaction.

Fresh bundled hub/saloon/shop/home/wilderness examples use named pairs. The saloon test verifies both real transfers: outside (16, 14.3048), facing +Y; inside (12, 17.1952), facing -Y. Existing saved projects and explicitly chosen coordinate arrivals are retained. To adopt an old door, select its named destination or Automatic reciprocal door in the door settings; no map content is silently replaced.

## Shared handles

Select an element in the scene/hierarchy. Transform handles appear in the inspector and viewport. Drag a colored X/Y/Z arrow for constrained movement, or choose Rotate for supported structural/model axes. Move snapping defaults to 0.5 metres; rotation snapping to 15 degrees. Shift bypasses snapping; Escape cancels. Pointer release is one validated Undo step; existing free drag remains available. Numeric source properties remain available.

The current handle draft shows displacement numerically while dragging and applies geometry on release. Props retain their existing integer-foot elevation convention (0.3 m/foot). Camera-facing sprite artwork is never tilted or rotated into a different billboard representation; billboard-only props do not gain meaningless rotation rings. Spatial events/models rotate through their existing degree-based component; structural yaw remains radians. Specialized geometry editors remain available for unsupported shape operations.

## Default atmosphere and rendering

The user explicitly requested darkness and player-light falloff on every map. Older maps are adopted once into atmosphereVersion=1: lighting is enabled, previously unlit maps receive 0.4 ambient plus a restrained warm player light (radius 6 metres, intensity 0.45, falloff 2). Existing authored light sources remain. Subsequent explicit disabling/adjustments persist through validation, save and export. This is an intentional change from the earlier disabled-by-default policy, not a claim that saved visual appearance stays identical.

Distance fog defaults to Dusty Plum #665263 over 16–48 metres. This color is the rounded RGB equivalent of 0.40/0.32/0.39 in the other project's painted-sky haze. The conversations were consulted and the value checked against the actual compatibility shader; no shader code or game art was imported. Legacy default blue fog adopts plum; authored custom fog colors remain. Environment → Distance fog offers an explicit preset, range/color controls and Undo.

Environment → Rendering style provides default Legacy real-time or Neutral image treatment. Legacy uses restrained contrast 1.04, saturation 0.94 and 0.15 CSS-pixel softness on the world canvas, preserving editor/HUD text. Existing diffuse textures and Sprite Fusion normal-map lighting remain; this adds no modern PBR requirement. It is a practical baseline, not an automatic recreation of reference artwork, cinematic material shading or offline renders.

Environment → Sky & distant scenery now offers independent sky saturation (default 1.2) and contrast (1.05), saved per map. Source sky images, panorama orientation and wrap sampling remain intact.

## Outdoor sprite sun shadows

Sun silhouettes use the currently selected sprite-frame alpha and a deformable receiver mesh. Each grid vertex traces along the authored sunlight direction to terrain, room construction or static model/custom collision geometry, using the shared swept collision service. Receiver-only terrain marching uses 0.25 m samples followed by contact bisection; projectile marching remains 0.05 m, and mesh sweeps remain shared exact geometry queries. Perspective and orthographic UV interpolation are handled separately.

A reusable GPU mesh samples the sprite alpha; the existing CPU depth buffer is uploaded without GPU readback to suppress shadows behind foreground geometry. Disconnected receiver triangles are omitted instead of stretching across different objects. Outdoor construction containers are supported; actual interiors never receive sun shadows. Local player/source lights continue to work indoors.

Performance is bounded to 8 nearby casters within 24 metres, at most 2 grid rebuilds/90 receiver rays per frame, 45 vertices per caster, fixed mesh buffers and shared image resources. Geometry results are cached; sprite image sources are shared with the existing renderer instead of duplicated for shadows. Default sun direction is 135 degrees, elevation 45 degrees and opacity 0.24; Map lighting controls these and the outdoor-shadow toggle.

Limits: this is coarse, budgeted sprite-to-receiver projection, not full scene shadow mapping. Small gaps can occur at receiver boundaries; transparent or collision-disabled decoration does not receive shadows. Rays stop at 32 metres. Only nearby budgeted sprites cast these silhouettes, and there is no automatic time-of-day system. Static world meshes/terrain do not cast complete sunlight shadows of their own. Local-radius shadow blockers retain their existing room-primitive scope. Locked 0.15.17 sprite tilt, proportions, frame selection and muzzle calibration are preserved.

## Validation

Focused source and real-browser tests cover named/ambiguous door pairing, exact one-foot positions and away-facing transfers both ways, shared X-handle movement and single Undo, appearance form/Undo, default darkness/falloff, receiver heights on flat ground/raised terrain/step geometry and a triangle-mesh receiver, live outdoor GPU shadow pass and bounded rays. Independent runtime-package startup checks clean gameplay DOM, source closure, F2 guard, pause/options and inventory. Sky GPU authoring tests cover panorama colors, rotation and wrap continuity. Projectile, lighting, fixed movement, workspace, normal-generator and comment-coverage regressions are checked separately.

Measured synchronous CPU draw medians in the headless browser scene varied by run; shadow overhead was about 1.5–3.8 ms. This is relative CPU evidence, not a desktop GPU/60 FPS guarantee. The additional Windows native acceptance passed against the staged executable (Electron 44.5.1), with an isolated muted diagnostic profile and no page errors. Its CPU draw medians were 11.4 ms without sun silhouettes and 13.2 ms with them. Diagnostics were removed from distributions and retained as workspace evidence. The browser package is checked separately; macOS hardware testing was not available.

## Additional local-build request

The Windows app uses its own Sprite-Frontier-0.16.3 profile. Prior profiles/releases are not modified; export a project from the older version and use Open Project in the new version to bring maps across. Source and packages retain original comments, assets, notices and earlier guides. The Windows export descriptor gate was corrected to match the current authoring-only modules and Sprite Fusion payload omission, with exact inventory/style/sender guards retained. Tests reject forged extra scripts, external resources, changed styles and missing runtime bootstrap. This fix is also committed to the same Git review.
