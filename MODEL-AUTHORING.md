## Current update — 0.15.18, October 9, 2026

Read ITERATION-0.15.18.md and CAMERA-SPRITE-PAUSE-GUIDE.md for current camera, sprite, door collision and pause behavior. Older version-specific statements below are retained history and superseded where the current guide differs.

# 3D models and event volumes

This iteration places static GLB/glTF 2.0 models alongside sprite events. A model's visual appearance, collision boxes and interaction zones are independent. A building is not automatically clickable.

## Import a model

Open the editor with F2, choose the Map tab, then 3D Model Library. Select a GLB, or a glTF with all buffers and textures. For nested textures, select its model folder. Give the asset a stable Model ID and readable name, then Import model files. The library shows a preview, triangles, materials, source bytes and decoded texture memory. Model IDs must be unique; use a new ID for a new asset revision.

The source architecture is:

- assets/models/runtime/<model-id>/ — optimized GLB/glTF, textures, metadata.json.
- assets/models/authoring/<model-id>/ — original authoring sources, excluded from play packages.

The generated benchmark-1500 folder contains both external-resource glTF and embedded GLB alternatives, plus metadata. It is a test fixture, not one of your hostile models. Import one alternative. Browser imports store a shared bundle in the project library; browser file permissions do not allow silently writing selected files into the source folder. Project export carries the imported resources so a colleague can reopen them without the original files.

## Place an event

Right-click the ground in authoring mode and choose Create event here. In the event editor's Image section, choose Model, collision and interaction zones. Select Sprite, 3D model or Invisible; for a model, select its shared ID. Set rotation in degrees and positive scale. Reset rotation and scale restores the defaults.

Sprite Frontier properties and playtest contains Map X/Y, Elevation offset and Height behavior. Follow terrain places the event on the sampled terrain; the offset is in world units. Place on terrain resets the offset to zero and selects grounded placement. Flying maintains its starting terrain altitude as the event moves. Model dimensions come from its imported geometry and scale; Visible height continues to describe sprite visuals.

Apply to event draft returns the spatial changes to the parent event editor. Apply/OK in that editor commits the event. Cancel discards changes since the last Apply. Close the volume preview with Done to keep changes in the draft; cancel the outer spatial/event dialog to discard them.

## Make a doorway interactive

Add named collision boxes for the building walls. Add an interaction zone named Door, positioned just outside the visible door surface. Keep the box shallow so the whole building does not respond. Choose Runs event and Interact. Its chosen event uses the existing pages and commands, including dialogue, conditions, unlock state and map transfer. Multiple zones may reference different logic events on the same map.

Select Edit with handles to move, rotate or resize a box in a model wireframe preview. Colored X/Y/Z handles edit local axes; numeric center, rotation and size fields remain available. Attached zones inherit the parent event's position, rotation and scale, including nonuniform scale.

The existing Blocks movement checkbox controls the legacy event footprint. For a building using explicit collision boxes, leave that checkbox off to avoid adding an extra footprint at the model origin. Collision boxes block independently of that checkbox.

## Invisible volumes

Create a separate event with Visual set to Invisible. Add a box and choose Enter volume or Exit volume. The transition runs its selected event logic once per crossing. Crossings queue while dialogue is busy; diagnostics expose pending and dropped transitions. Action Button, Player Touch and Event Touch logic pages can be invoked by zones. Select the intended trigger on the zone; avoid an Autorun/Parallel logic page if you want execution only through the zone.

Invisible volumes remain selectable by their boxes in authoring mode. Model bodies are selectable for editing, but only interaction zones target their logic during play.

## Targeting and debug

In cursor interaction mode, target the door zone within the selected logic event's interaction range. Camera direction, player reach, model geometry and terrain determine visibility. Equal hits resolve by host ID, then zone ID. Put a zone outside an opaque door/wall, not behind the mesh.

Authoring shows labeled collision and interaction outlines. On the Map tab, Show model collision and zones enables them in play: orange collision, teal interaction, white authored selection and pink currently targeted zone. The target's name and event ID appear in the debug view. Normal play defaults to no outlines.

## Save and share

Maps save locally. Export all maps downloads the complete project, including one resource bundle per model ID. Import adds maps without overwriting test maps. A conflicting model ID receives a new ID, and incoming event references follow it. Import and reload tests cover these relationships. Desktop/browser 0.15.11 storage is separate from previous iterations; import previous work explicitly.

## Current support and limits

Static triangle meshes, nested node transforms, base-color factors, UV0 textures and sampler wrapping are supported. Collision uses boxes, not triangle-mesh physics; actors do not stand on model roofs. Animation, skins, sparse accessors and required glTF extensions are rejected. PBR metal/roughness, normal-map lighting and full translucent-material composition are not implemented yet. The importer and renderer remain separate modules so those features can be added without changing event logic or asset IDs.

Keep a model bundle below 64 MiB; the decoded project resource bundle limit is 128 MiB, and the current JSON project import limit is 100 MB. Each component supports up to 128 boxes. See MODEL-PERFORMANCE.md for measured costs and reproduction instructions.

Geometry interiors: rendered room primitive faces also obstruct camera interaction rays and player reach rays. Editing room geometry replaces the room data and rebuilds its cached faces. Fixed artwork interiors have no inferred geometry hidden in the image.

For exact static collision, see MODEL-GEOMETRY-COLLISION.md. Choose Use actual model geometry (static) in the spatial draft. The authoring overlay shows real triangles; door interaction zones remain independent. Custom boxes remain available for previous projects.


## October 9, 2026 — 0.15.17 extension

See HUB-DOOR-GUIDE.md for the complete current authoring contract. New independent
modules are model-visibility, hub-state, hub-workbench, hub-fixtures, door-audio,
door-transition and offline item/door asset manifests. Existing templates and
undo boundaries own authored changes. Playtest hub records own stock/drop state;
map resources remain shared. Scene-transition owns transfer commit/resume and
cancels previews. Every new callback/function has its own source contract; the
current dated reference is FUNCTION-REFERENCE-0.15.17.md. Earlier explanations
above remain historical where behavior differs.
