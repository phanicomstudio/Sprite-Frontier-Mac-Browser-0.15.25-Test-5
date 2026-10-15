# Sprite Frontier 0.15.24 delivery validation

October 14, 2026. This report supersedes pending-package statements in the retained chronological notes. Previous releases and candidate archives remain preserved.

## Verification

The complete second Windows candidate passed all 85 declared baseline/current-iteration checks. The Mac browser candidate passed all 84 applicable checks; the desktop bridge syntax comparison is Windows-only and passed in the Windows package. Every distributed file matched its SHA-256 manifest. Two regression tests were made self-contained by preserving exact historical reference source inside SOURCE-HISTORY; their original assertions remain intact.

An isolated native Windows copy was verified byte-for-byte against the packaged application. Native workspace acceptance passed blank interior creation, shell preview/commit, Undo/Redo, clean playtest and runtime authoring guard. Native guards passed 40 camera-volume cases (23 retractions), repeated pause/Resume, focused Escape, cursor selection, master volume, Save/Load, closed-door body sweep, actual fullscreen retention on Escape, literal-art click boundaries and Exit Fullscreen. An earlier desktop automation observation unexpectedly returned to authoring; this did not recur in the controlled native acceptance, and its cause is not claimed as identified.

The preserved Windows acceptance record also covers layout/stair assemblies, props and model-host placement, castle room/tower/roof stacking, cell/door/effect/stock/item/weapon controls, reusable templates, kill-feed combat, sky rendering, material CPU/GPU pixels and save/reload. The actual Windows export chooser produced a 435-file game excluding 18 authoring modules. Its native startup, gameplay menus, inventory and material Save/Load passed independently. All named evidence is retained under PERFORMANCE-EVIDENCE/0.15.24 and the chronological VALIDATION-1524.md.

## Measured performance

Three densities (640×480, 960×720, 1280×960 for a 640×480 logical view) and Crisp/Smooth filtering were tested. These are observed Windows frame throughput and CPU submission measurements, not GPU elapsed time or a guarantee for arbitrary authored scenes.

| Highest density, Smooth | FPS | CPU p95 | Frame interval p95 |
| --- | ---: | ---: | ---: |
| Furnished, unlit | 90.0 | 11.7 ms | 13.2 ms |
| Furnished, one light | 83.6 | 11.1 ms | 22.2 ms |
| Furnished, eight transient light emissions | 71.2 | 12.5 ms | 22.4 ms |
| Actual shotgun projectile simulation | 90.2 | 11.3 ms | 12.5 ms |
| Weather/effects forest stress | 51.0 | see raw evidence | 26.7 ms |
| Weather/effects textured interior | 68.3 | see raw evidence | 22.3 ms |

Furnished emission positioning is a rendering stress fixture; the separate shotgun test uses normal projectile simulation and lifetimes, reaching 16 projectiles with eight selected lights. Twenty-four cold/warm door transfers across six presets and four normal-tempo highest/Smooth transfers passed one commit/completion and retained breathing. Different fixture runs are not controlled comparisons. Earlier slower results remain visible in the evidence history.

## Supported boundaries and remaining limitations

- Locked 0.15.17 camera-facing sprite tilt/proportions/frame presentation is preserved; collision/depth/clearance changed instead.
- Active-cell rendering is separated from inactive-cell storage. Large project import/serialization and memory costs still exist; numeric MZ map IDs remain 1–999999.
- Local lighting is bounded and simple. Documented primitive/round blocker behavior does not claim arbitrary imported-mesh or terrain shadowing. Transient lifetimes and selection budgets prevent unlimited active lights.
- Imported-model attachment hosts support upright independent hosts; tilted/nested attachment chains remain explicitly unsupported. Decorative windows use the model/decal placement workflow. Spiral stairs remain future work.
- MASK/BLEND and distance-coverage CPU fallback paths remain performance limits. Effects-heavy forest throughput can fall below 60 FPS; GPU elapsed time and driver texture memory were not measured. Diagnostics distinguish estimates from actual memory.
- The Mac package is browser-based. Native macOS execution was unavailable and is not claimed as tested.
- All 5,672 maintained functions pass source-comment presence coverage. Reviewed explanations, prior comments and source history are preserved. At the user's explicit request, the exhaustive manual accuracy audit was stopped; 371 flagged generic-purpose contracts remained at that checkpoint. Full semantic review is not claimed. New-code documentation/preservation requirements remain in force.

## Authoring and launch

Windows: extract the complete archive and run Sprite Frontier.exe or Launch Sprite Frontier.cmd. Use Return to editor / Playtest to switch workspace. Start with AUTHORING-GUIDE-0.15.24.md and EDITOR-CONTROLS-0.15.24.md. The feature-to-control audit is EDITOR-CONTROL-AUDIT-1524.md, with historical checkpoints retained.

Mac browser: extract the complete archive and open index.html in a compatible modern browser. Where browser local-file restrictions require serving, use the documented local server. Exported games are created through the editor's game export action and contain gameplay HUD/menus rather than authoring UI.
