# Verification — 0.6.0

Date: 2026-10-04. Tests ran in this Windows workspace. Background browser acceptance disables pointer capture. Electron was not launched.

## Passed automated coverage

- Seeded generation/import, baseline damage/obstruction/kill/reload/holster.
- Movement/sprint/diagonal/blocked animation, direction mapping and synth lifecycle.
- Page precedence/AND conditions, variables, one-time ammo, touch/wait/transfer and round-trip/isolation.
- Input/controller synthetic edges, jump/step/rock clearance, terrain/sky persistence.
- Full-body framing, reticle alignment, terrain shots, rear-scenery guard and bounded ricochet.
- Muzzle layout bounds, local topic parser, atomic save validation, source blood equations and all audio manifest files.
- Global rule limits/persistence and jump-height conversion.
- Shuffle-bag music coverage/no boundary repeats, map override, combat/exploration transitions and stop with silent audio stubs.
- Chrome local-file Pixi/Candy, sheet switching, calibrated shot/flash, shotgun, calibration Apply, editor copy/save, save weapon reconstruction, blood and aspect switching; no page errors.

preview-06.png is accepted game/HUD evidence. RENDER-PERFORMANCE-06.json in the outputs directory records an initial narrow CPU render submission comparison before final rule/music additions: warm paths roughly 3.4ms in 0.5.2 vs 3.3ms in initial 0.6. This is not a final GPU/FPS benchmark.

Physical controller, CRT overscan, actual fullscreen activation, subjective audio fidelity and desktop startup require hardware/user testing. No soundtrack files were supplied, so real BGM audition is pending. Full plugin parity is explicitly not claimed: see PLUGIN-PORT.md.

Historical browser tests encode old controls/modals; browser06.cjs is current acceptance.
