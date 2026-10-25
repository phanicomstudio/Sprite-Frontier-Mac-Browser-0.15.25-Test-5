# Sprite Frontier 0.14.1

Extract the complete Windows ZIP and run **Launch Sprite Frontier.cmd**.

## Maps

Choose **Active map** in the top toolbar to play or edit a map. **F2 → Map → Map library** creates and names maps using the width/height fields above. Choose blank flat, blank hills or vector demo. Objects, events, terrain, water and display settings are independent per map. Switching starts a fresh playtest; authored changes are kept. The library saves locally and restores on reopening. **Export all maps** creates a portable project backup; importing adds maps without replacing existing ones. Single-map export/import remains available.

## Corrections

- Cerebral proximity drain now runs in ordinary gameplay as well as dialogue. The test anomaly at X31/Y24 in the default map drains 5 points every 3 seconds within 5 tiles; 100→90 changes the portrait background after six seconds. The rock is purple in full-color rendering, and inspection explains its effect and current Cerebral.
- The demo and editor test pools sit 0.3 units below the lowest surrounding bank, with their floor 0.8 units below the water. Water extends onto adjoining wet slopes and stops at the terrain intersection. It does not flood unpainted flat surroundings.
- Ground grid edges preserve one-unit terrain bends in sculpted areas, instead of smoothing over banks when grid spacing is larger. Near-camera water triangles clip at the near plane while retaining their texture coordinates.
- Weapon icons and text fit inside the round glass. Ammo remains readable when holstered. Long weapon names and immersion text can scroll within their screen insets. HUD text scales with chassis size.

Swimming and physical fluid simulation remain deferred. Map-to-map transfer events connecting the library are a later step.

Validation: normal-play timed Cerebral/background test; bank height, wet slope, cache/revision and near-plane tests; map creation/switching/local restore; weapon HUD at window sizes and fullscreen; existing authoring, combat and rendering regressions. Browser WebGL checked; no separate native launch performed this iteration.
