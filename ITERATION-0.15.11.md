# Sprite Frontier 0.15.11

This complete iteration adds static GLB/glTF models alongside sprite events. Each event references a shared model ID. Visible geometry, collision boxes and named interaction volumes are independent.

## Implemented
- Dedicated assets/models/runtime/<model-id>/ and assets/models/authoring/<model-id>/ architecture, with runtime resources and metadata kept together. Original authoring files are excluded from play packages.
- 3D Model Library import, texture preview, statistics and shared selection. External glTF and embedded GLB resources are supported.
- Sprite/model/invisible event appearance; terrain placement and elevation; parent rotation and nonuniform scale; independent box transforms.
- Draft editor with numeric controls and visible local move, resize and rotation handles. Apply commits the draft; Cancel discards it.
- Named attached zones inherit parent transforms and reference separate event logic. Invisible volumes support interaction and queued enter/exit triggers.
- Distance-limited camera targeting, model/terrain occlusion and deterministic overlap selection. Model bodies are not automatically gameplay interaction targets.
- Independent transformed collision boxes; shared per-pixel model/terrain/interior depth; authoring outlines and optional target/collision debug view.
- Shared resources survive project saving/reload and export/import. Conflicting incoming model IDs are remapped without changing existing events. Storage is isolated for this release.

## Verification
66 source regression commands passed. Browser checks cover actual event creation, model import/preview, draft controls and pointer handles, gameplay door dialogue, invisible-volume walking transitions, forest/interior placement, shared textured instances, camera picking, depth ordering, resource save/reload, conflicting project import and actual export download. A generated 1,500-triangle fixture exercises both GLB and glTF; it is not a supplied hostile model.

See verification/ for preserved logs and performance measurements, MODEL-AUTHORING.md for the workflow, and MODEL-PERFORMANCE.md for measurement scope.

## Supported scope and limitations
The renderer is a CPU baseline supporting static geometry and base-color materials/textures. Animation, skins, sparse accessors, required glTF extensions, full PBR lighting and correct translucent-material composition are unsupported. Box collision does not implement rooftop standing or triangle-mesh physics. Handles operate in the wireframe volume editor. See the authoring guide for detailed limits.

Windows Chrome browser verification is recorded. Native Windows launch and actual macOS testing for this iteration remain unverified; package integrity is verified separately after building.
