## October 22, 2026 — current iteration 0.16.0

See EDITOR-REDESIGN-0.16.0.md for the implemented foundation, migration limits and remaining milestones, and SPRITEFUSION-0.16.0.md for local native-resolution generation, licensing and build provenance. Earlier explanations below remain historical; this dated entry supersedes conflicting UI, generation and normal-budget descriptions.

# Sprite normals

Open the normal workbench in authoring mode. Choose a registered sprite profile and Load this sprite artwork. Generate rounded silhouette normals or import a matching normal PNG. Paint/import height to refine the draft; height edits regenerate normals and replace imported normals. Preview lighting, height or RGB normals, then Apply to the current map. Remove deletes the selected profile binding. Apply/Remove support undo and project export/import. Loading a profile currently generates a fresh draft; it does not reopen its saved binding for editing.

Working images are capped at512 pixels per side. Imported normals must match the working artwork. RGB normals use +Y upward; artwork owns alpha. Generated silhouette normals are an approximation, not recovered physical geometry. External unrelated artwork cannot be applied without loading the intended registered profile.

Runtime prepares a full-size lit sheet once, preserving animation crop coordinates and showing original artwork while preparation is pending. A64MiB retained cache and8million-pixel sheet limit bound preparation. Worker/OffscreenCanvas support moves shading off-thread; otherwise8-row CPU tasks yield between batches. Revision/source changes cancel obsolete work and release prepared GPU resources. Bindings are capped at64 per map and bounded PNG/finite JSON extension sizes.

Verified: import/preview pixels, dimension rejection, profile Apply/Remove, live preparation/reuse/cleanup, Undo, project export/import, worker/reference pixel-alpha parity, cancellation, same-bank source replacement, and CPU fallback. Portable normal-worker browser fixture needs Playwright and Sharp; see tests/browser/README.md.

The1200×4800 armed sheet retains23,040,000 prepared bytes. Worker processing measured about173ms; older CPU fallback measured about4seconds with a41.5ms worst task. Bitmap adoption/GPU upload and multi-direction visual crop comparison need further profiling. These are Windows Chrome measurements; macOS is untested. NORMAL-PERFORMANCE.json contains raw diagnostics. SPRITE-NORMALS-HISTORY.md retains earlier checkpoints.
