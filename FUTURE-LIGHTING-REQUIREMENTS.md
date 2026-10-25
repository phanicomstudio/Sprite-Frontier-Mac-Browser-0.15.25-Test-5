# Future iteration: normal-mapped sprite lighting

Lighting is a separate future renderer project, outside the P-mode/fog update.
Normal maps are mandatory when implementing lighting. Target the dimensional
sprite lighting and atmosphere of Brigador / Brigador Killers.

Use matching color and normal sprite sheets for every direction and animation,
with identical layout, silhouettes, anchors and muzzle calibration. Reserve
material channels for depth/height and emissive effects. Validate normal-space
transforms across our rotating/pitched camera, which differs from Brigador's
fixed-view projection.

Support ambient and directional map illumination plus colored local lights for
projectiles, muzzle flashes, lamps and explosions. Map fog and future day/night
systems must share runtime atmosphere controls while preserving authored defaults.

Prototype a shared lighting pass or deferred buffers, bounded nearby-light
budgets, reusable atlases/buffers and influence culling. Benchmark real scenes
with normal-mapped sprites and terrain before choosing quality tiers. Avoid a
full-screen filter for every individual light or sprite.

Reference: https://store.steampowered.com/news/app/274500/view/3662024223190614902
The developer describes diffuse sprites plus per-pixel Z-depth and deferred
dynamic lighting; that is not evidence of a normal-map-only implementation.

Status: requirements preserved for a future iteration; not implemented in 0.10.
