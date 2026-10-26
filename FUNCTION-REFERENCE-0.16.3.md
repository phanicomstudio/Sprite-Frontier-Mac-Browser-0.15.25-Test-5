# Function reference addendum — 0.16.3

October 26, 2026. Prior full references are preserved. This addendum records new APIs; adjacent source comments remain authoritative. See ITERATION-0.16.3.md for migration, authoring, budgets and limits.

Changed existing owners: app.attemptTravel resolves named/automatic doors before existing clearance; hub-workbench.validateEvent retains arrival facing; authoringScene.update permits validated event spatial/height and prop elevation edits; world.validate adopts versioned atmosphere once; localLighting.validate supplies default darkness/player falloff/sun settings; skyPanorama.validate/draw persist and shade saturation/contrast; ballistics.sweep adds optional geometry-only receiver queries while default projectile behavior remains unchanged.

## app.authoringAnchor163

src/app.js:1561

@function app.authoringAnchor163 — Inputs: typed selected scene reference and copied source record. Returns world XYZ using the current runtime placement elevation for props/events, or authored absolute Z for structure. Reads only; follows actual terrain/model support instead of putting handles below raised objects.

## app.authoringProjection163

src/app.js:1562

@function app.authoringProjection163 — Inputs: world XYZ metres. Returns projected logical canvas point only while editing; uses actual active camera including fixed/isometric views. No mutation.

## app.callback.163

src/app.js:2721

@function app.callback.163 — Provides the callback for view add event listener. Inputs: event. Updates: drag; game drag ghost. Uses: terrain tools end; screen point; move object; $. Returns: without a result; without a result.

## authoringScene.project163

src/authoring-scene.js:129

@function authoringScene.project163 — Inputs: world-metre XYZ. Returns current logical viewport point or null; no authored mutation, caches or history. Host owns camera/projection and runtime-mode gating.

## authoringScene.transform163

src/authoring-scene.js:131

@function authoringScene.transform163 — Inputs: typed reference, move/rotate, axis 0/1/2 and finite delta (metres or radians). Returns single validated history commit. Camera-facing sprites keep their locked presentation; rotation applies only to actual structural/model geometry and door arrival orientation. Unsupported axes fail explicitly rather than silently losing edits.

## authoringScene.rotateDoor163

src/authoring-scene.js:145

@function authoringScene.rotateDoor163 — Inputs: none. Updates model rotation and authored walkable-side arrival facing in one transaction; failures roll back both.

## authoringScene.appearance163

src/authoring-scene.js:149

@function authoringScene.appearance163 — Inputs: optional per-map appearance draft. Returns copied effective defaults or an undoable validated commit. Authored map/local/normal lighting is untouched; runtime writes reject.

## authoringScene.commitAppearance163

src/authoring-scene.js:150

@function authoringScene.commitAppearance163 — Inputs: none. Writes only isolated appearance inside the owner's rollback/history boundary; no source assets are processed.

## authoringScene.fog163

src/authoring-scene.js:151

@function authoringScene.fog163 — Inputs: optional distance-fog draft. Returns validated effective settings, or one owner history commit; units are metres and colors #RRGGBB. Does not change sky grading or light sources.

## authoringScene.commitFog163

src/authoring-scene.js:152

@function authoringScene.commitFog163 — Inputs: none. Saves validated fog with migration marker so explicit disabled settings remain disabled after reload.

## authoringScene.anchor163

src/authoring-scene.js:153

@function authoringScene.anchor163 — Inputs: typed reference. Returns copied current world anchor or null for stale selection. Host supplies runtime-supported elevation without exposing mutable entities.

## authoringWorkspace.populateFog163

src/authoring-workspace.js:68

@function authoringWorkspace.populateFog163 — Inputs: validated fog. Updates only detached controls, leaving authored state unchanged until Apply.

## authoringWorkspace.plumPreset163

src/authoring-workspace.js:70

@function authoringWorkspace.plumPreset163 — Inputs: ignored click. Resets draft to enabled 16–48 metre dusty plum, with no commit.

## authoringWorkspace.applyFog163

src/authoring-workspace.js:71

@function authoringWorkspace.applyFog163 — Inputs: form submit. Saves validated fog as one Undo step; rejected ranges remain in draft with status.

## authoringWorkspace.applyAppearance163

src/authoring-workspace.js:77

@function authoringWorkspace.applyAppearance163 — Inputs: form submit. Validates and saves one map appearance history step; reports errors without discarding the draft or altering lighting.

## authoringWorkspace.handlePoint163

src/authoring-workspace.js:188

@function authoringWorkspace.handlePoint163 — Inputs: source record and kind. Returns metre XYZ for actual geometry anchor; legacy prop elevations convert feet at existing 0.3 m/foot convention. Does not mutate records.

## authoringWorkspace.drawHandles163

src/authoring-workspace.js:190

@function authoringWorkspace.drawHandles163 — Inputs: animation timestamp ignored. Returns nothing; projects at most four points for one selection while editing, clears handles during modal/playtest and schedules next display frame. Draws preview displacement only; source changes happen once on release.

## authoringWorkspace.beginHandle163

src/authoring-workspace.js:216

@function authoringWorkspace.beginHandle163 — Inputs: pointer press on an axis stroke. Captures selection and projection at drag start; no authored writes. Invalid/stale selections are ignored; consumes input so gameplay/free-drag owners do not move simultaneously.

## authoringWorkspace.previewHandle163

src/authoring-workspace.js:221

@function authoringWorkspace.previewHandle163 — Inputs: captured pointer motion. Updates a transient metre/radian delta and visible status; snapping uses captured axis scale, never writes scene during drag. Shift temporarily bypasses snapping.

## authoringWorkspace.commitHandle163

src/authoring-workspace.js:229

@function authoringWorkspace.commitHandle163 — Inputs: captured release. Commits finite nonzero delta once through shared validator/history, reports rejection without data loss and refreshes selection. Pointer release ends capture automatically.

## authoringWorkspace.cancelHandle163

src/authoring-workspace.js:234

@function authoringWorkspace.cancelHandle163 — Inputs: interrupted pointer gesture. Discards transient delta without history or source mutation.

## authoringWorkspace.escapeHandle163

src/authoring-workspace.js:235

@function authoringWorkspace.escapeHandle163 — Inputs: key event. Escape drops an in-progress transform without committing; other shortcuts keep their established owners.

## ballistics.sweep163

src/ballistics.js:17

@function ballistics.sweep163 — Inputs: game, world endpoints, radius metres, optional owner ID and geometryOnly Boolean. Returns earliest normalized contact or null without applying damage. October 26: receiver queries omit actors/nonspatial billboards and march terrain at 0.25 m; default projectile behavior and exact mesh sweeps remain unchanged.

## hubWorkbench.checkedArrivalYaw163

src/hub-workbench.js:51

@function hubWorkbench.checkedArrivalYaw163 — Inputs: facing degrees. Returns finite authored yaw, rejecting malformed or excessively large values before commit; no state changes.

## hubWorkbench.hasArrivalChoice163

src/hub-workbench.js:509

@function hubWorkbench.hasArrivalChoice163 — Inputs: picker option. Returns retained selector match without map mutation.

## hubWorkbench.destinationDoor163

src/hub-workbench.js:793

@function hubWorkbench.destinationDoor163 — Inputs: authored event. Returns whether selected door identity exists; no mutation.

## hubWorkbench.doorArrival163

src/hub-workbench.js:1517

@function hubWorkbench.doorArrival163 — Inputs: destination world, source cell ID and arrival selector (auto-door or door:eventID). Returns fresh world-metre position/yaw radians, or null if missing/ambiguous. Door local +Y is its walkable front; model Z rotation is degrees. Uses authored arrivalYaw when supplied; never guesses between several return doors or mutates maps. Runtime collision checks must accept the result before transfer.

## localLighting.sun163

src/local-lighting.js:434

@function localLighting.sun163 — Inputs: optional per-map sun settings. Returns bounded directional ground-shadow configuration; azimuth/elevation use degrees, opacity 0–0.6. Defaults enabled outdoors; render owner categorically excludes interiors. Invalid values throw before adoption.

## localLighting.spriteSunShadow163

src/local-lighting.js:436

@function localLighting.spriteSunShadow163 — Inputs: active drawing adapter, live scene, projection camera, sprite-bearing entity and world-to-screen callback. Returns Boolean for a drawn alpha silhouette. Projects current artwork frame onto the local horizontal ground plane away from sun; reuses image/crop pools and restores all drawing state. Outdoors only, skips submerged/dead/missing frames and excessive offscreen shadows. This is a bounded ground-plane effect, not mesh/terrain shadow mapping or roof occlusion; it never changes locked actor billboarding.

## localLighting.appearance163

src/local-lighting.js:453

@function localLighting.appearance163 — Inputs: optional per-cell appearance settings. Returns validated independent legacy/neutral profile with bounded contrast/saturation and softness in CSS pixels. Defaults provide restrained late-1990s image treatment; invalid input throws before project adoption. This is image treatment, not a replacement material or shadow renderer.

## localLighting.appearanceFilter163

src/local-lighting.js:460

@function localLighting.appearanceFilter163 — Inputs: validated or partial cell appearance. Returns CSS filter text for world canvas only; neutral bypasses treatment. Does not alter HUD/editor text, pixels stored in assets, collision or normal-map caches.

## skyPanorama.validate163

src/sky-panorama.js:45

@function skyPanorama.validate163 — Inputs: optional saved panorama settings. Returns normalized asset/orientation/wrap record plus finite saturation (default 1.2, range 0–2) and contrast (1.05, range 0.5–1.5). Invalid data throws before adoption; source pixels remain unmodified. October 26 extends the retained contract above.

## sunShadows.install163

src/sun-shadows.js:4

@function sunShadows.install163 — Inputs: browser namespace. Publishes bounded renderer; allocates resources only when an outdoor scene actually draws shadows.

## sunShadows.receiver163

src/sun-shadows.js:13

@function sunShadows.receiver163 — Inputs: live scene, world sprite-plane source point, normalized sun ray and caster ID. Returns nearest terrain/static-geometry hit with world coordinates/receiver key, or null. Rays are at most 32 m; shared sweep uses a numerical skin and does not mutate combat.

## sunShadows.receiverGrid163

src/sun-shadows.js:21

@function sunShadows.receiverGrid163 — Inputs: scene, caster, current sprite frame/sheet, camera and validated sun. Returns fixed-size grid of nearest receiving-surface hits. Forty-five full rays per rebuild; frame UVs remain on original artwork. No textures, entities or source maps change.

## sunShadows.createSlot163

src/sun-shadows.js:32

@function sunShadows.createSlot163 — Inputs: Pixi namespace and reusable depth texture. Returns pooled alpha-shadow mesh and mutable vertex buffers. Fixed capacity is 45 vertices/192 indices; resources persist across maps and frames instead of being recreated per caster.

## sunShadows.draw163

src/sun-shadows.js:41

@function sunShadows.draw163 — Inputs: active Pixi drawing adapter, live game, active camera, visible entity candidates and projection callback. Returns count of submitted outdoor shadow meshes. Rebuilds at most two 45-ray grids per frame, caches at most 8 nearest casters, updates GPU depth from existing CPU data without readback, and rejects triangles crossing disconnected receivers. Interiors and disabled sun skip all work. Terrain/static mesh/custom collision must match visible receivers; transparent/noncollision decoration receives none.

## sunShadows.nearest163

src/sun-shadows.js:52

@function sunShadows.nearest163 — Inputs: two eligible casters. Returns distance ordering so the bounded shadow budget prioritizes nearby gameplay actors; no source mutation.

## sunShadows.connected163

src/sun-shadows.js:72

@function sunShadows.connected163 — Inputs: grid vertex index. Returns whether projected receiver exists and agrees with the first receiver, avoiding stretched shadows across disconnected surfaces.
