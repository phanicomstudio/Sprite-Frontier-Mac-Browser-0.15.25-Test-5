# Forest loading recovery — 0.15.6

Generate world previously used the vector demo template for every selected map. On the forest test this overwrote the forest contents but retained its library name. Generation now uses the forest template when Supplied Assets Forest Test is active. Map switches also update the seed and size fields.

On loading a saved library, an affected bundled forest without ground material or supplied sprites is recovered from the forest template. Its previous contents are copied to Forest contents before recovery. Recovery needs one free library slot (the project limit is 32 maps); intact forests and other authored maps are preserved.

Browser regression reproduced the original failure, verified regeneration with 141 trees and no enemies, then injected an affected saved forest and verified recovery plus backup after reload. Native Windows acceptance has not been repeated.

The small patch applies to the complete Windows 0.15.5 installation. Close the game, extract the patch ZIP, and copy its resources folder into the existing Sprite-Frontier-Windows-0.15.5 folder, merging folders and replacing the supplied files. Relaunch using the existing launcher. The badge should show prototype 0.15.6. Choose Supplied Assets Forest Test. Do not launch directly from inside either ZIP.

This iteration uses a separate local map-library and barrel-calibration namespace. Previous iteration data remains stored but is not automatically loaded. Map selection and generation reset the camera and synchronize seed/width/height fields from the actual map. Manual project import remains available for authored work.
