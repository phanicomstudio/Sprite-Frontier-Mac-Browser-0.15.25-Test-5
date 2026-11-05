# Sprite Frontier 0.16.15 — persistent projectile-light switch

October 31, 2026. The map Projectile lights checkbox previously changed a form draft only. Starting a playtest refreshed the form from authored data and discarded that uncommitted toggle. It now immediately commits its Boolean through the existing world validation, Undo and local project-save owner. The label states that it saves immediately. Numeric lighting/source fields retain their explicit Apply workflow.

The toggle changes only the active map projectile default. It preserves saved ambient/player lights, placed sources, sun and contact-shadow settings, source color/radius/intensity/falloff, normal bindings and per-weapon custom/off overrides. Map lighting must still be enabled; deliberately disabled maps and per-weapon light overrides are not silently changed. No new per-frame work or light-budget expansion is introduced. Compatible desktop profile and all prior rendering fixes remain intact.

## Lighting regression gate

Run `npm run test:lighting` after changes to lighting, renderer, authored-world replacement, playtest startup or lighting controls. It covers actual UI toggling without Apply, fresh playtest, disable/Undo, save/reload, real projectile-factory emitters across camera modes, bounded sources and explicit per-weapon opt-out; terrain GPU lighting pixels; source/normal binding/cache behavior; integrated local Sprite Fusion generation; and function-comment coverage. These tests reduce regression risk; they cannot guarantee every future change.

The integrated Sprite Fusion generator is already available in Environment → Sprite normals. Load a registered sprite or local artwork, generate/preview normals, then Apply lighting to this sprite on current map. The pinned upstream Rust implementation runs locally as embedded WASM, offline, with no user Rust installation. Full native-sheet generation, Apply, world roundtrip, Undo and runtime normal-worker preparation were reverified on the 1200×2400 Chiban sheet. Static sheets are supported; this is not a new animated-file importer. See SPRITEFUSION-0.16.0.md and vendor/spritefusion/PROVENANCE.json for preserved build/source/license details.
