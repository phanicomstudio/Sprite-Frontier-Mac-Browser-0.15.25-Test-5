# Iteration 0.11 — map scale and interaction

- P-mode interaction/inspection is weapon independent. Real cursor clicks retain range and obstruction checks; pickup clicks do not fire.
- Hover names contain name and distance only.
- Inspection text fits the CRT viewport. A 3-second reading pause precedes gentle scrolling; hovering and wheel input suspend automatic scrolling. Camera/page wheel input is isolated.
- Rectangular maps accept integer width/height 16–512, with independent visual grid spacing 1–16. Legacy square size remains compatible. Existing content is never silently deleted by resizing.
- Generation uses spatial clearance buckets, bounded to 10000 scatter attempts; imports allow 20000 props and 2000 events. Source/import limits are 16 MiB. These are validation caps, not a promise that all combinations run at a fixed frame rate.
- Collision and projectile broad-phase queries use 8-unit spatial cells for static scenery and live dynamic positions. Terrain drawing only visits a camera neighborhood with bounded cached heights. Minimap updates at most about seven times per second.
- Moving ambient events use full/reduced/dormant bands with hysteresis. State is preserved, with no despawn/recreation. Always active and autorun/parallel pages continue globally. Aggro/pursuit remains independent of visibility and cannot be suppressed inside configured awareness range. Nearby blood emission skips distant actors.
- Global event condition/interpreter checks remain bounded but still visit authored events; dynamic actor broad-phase lists are scanned. This is conservative initial culling, not a fully streamed world. Future work can replace these scans with incremental event invalidation and dynamic spatial indexing after profiling actual content.

## Verification

All eight CPU regression suites pass. Real browser input checks armed P-mode pickup/inspection, editable click feedback, fog, rectangular generation and CRT scrolling. A 512×256 map with 7994 props produced 774 nearby rendering candidates, rather than submitting all props. Observed browser frame intervals: median 11.1 ms, 95th percentile 13 ms; generation/control transition around 191 ms on this computer. These measurements include display scheduling and are not pure GPU/CPU timings or a guarantee for other machines.

The Windows distribution includes its own Electron runtime and launcher. Normal-mapped lighting remains reserved for the separate future lighting iteration.
