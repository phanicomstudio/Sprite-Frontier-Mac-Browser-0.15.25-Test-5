# Function reference — 0.16.11

October 29, 2026. Detailed arguments, returns, side effects, limits and failure behavior remain adjacent to every maintained function. This index supplements prior references without replacing them.

| Source | Responsibility |
| --- | --- |
| src/inventory.js | Existing inventory ownership, equipment guards, magazine preservation, atomic crafting and ammo synchronization |
| src/inventory-screen.js, inventory-skins.js | Original-art TV, eight rows, native-pixel transparent physical controls and responsive layout |
| src/crafting.js, crafting-menu.js | Canonical exact recipes, retained components, detached transactions, remote menu |
| src/catalog-editor.js | Detached item/recipe drafts and validated project adoption |
| src/construction.js | Stable room components, overrides, openings, shared boundaries and typed ownership |
| src/construction-editor.js | Room/building/storey actions through original mutation/history boundary |
| src/local-doors.js | Existing-event local door assembly, animated leaf and synchronized collision |
| src/door-test-fixtures.js | Three fresh-project focused test cells |
| src/placement-surface.js | Existing model/room/terrain placement ray traversal available in runtime exports |
| src/view-visibility.js | Inverse viewport query bounds, encoded isometric fog ranges and cosmetic stable-ID LOD |
| src/author-view.js, authoring-scene.js, authoring-workspace.js, scene-hierarchy.js | Optional real structural hierarchy and shared contextual controls; editor-only visibility |
| src/hub-workbench.js, hub-state.js, app.js | Original transaction/save/pause owners with integrated inventory and crafting |
| src/render.js, interiors.js, outdoor-assets.js, terrain-lighting.js, model-renderer.js, terrain-occlusion.js, isometric-visibility169.js, sun-shadows.js | Consistent affine isometric depth, fog, occlusion and preserved shadow-system split |

New tests: construction1611.cjs, crafting1611.cjs, visibility1611.cjs and browser/{inventory,catalog,transactions,authoring,doors,visibility}1611.cjs. Browser host-observer1611.cjs retains original factory adapters solely for isolated test fixtures; it does not replace runtime behavior.
