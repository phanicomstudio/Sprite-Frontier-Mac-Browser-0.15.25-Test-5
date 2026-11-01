# Mirrored door maintenance — November 1, 2026

`modelLibrary.upgradeAntiqueDoor1620(id,files,entry)` runs only at model import/restore. It compares the known built-in clean resource's byte count and two independent rolling fingerprints, then substitutes the current offline GLB in a detached resource table. It does not move map instances, change node/pivot references, alter caller data or replace custom IDs/content. Import byte totals and atomic restore limits include the new resource size.

`tests/antique-door1620.cjs` verifies the exact supplied GLB checksum and offline mirror, unchanged frame/leaf node transforms, 108 triangles and physical front/back UV correspondence. It also checks saved built-in migration and preservation of a custom-ID copy. Historical model-library contracts remain alongside the dated source explanation; current asset provenance is in assets/models/runtime/antique-door-transition/README.md.
