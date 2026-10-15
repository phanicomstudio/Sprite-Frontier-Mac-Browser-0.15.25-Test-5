# Sprite Frontier 0.15.12

Complete iteration retaining the 0.15.11 model library, independent collision/interaction volumes and shared assets. Interaction rays now include the cached rendered faces of geometry interiors. Camera visibility and player reach use the same obstruction checks. Fixed artwork rooms retain their existing artwork and authored-volume behavior.

A live browser regression independently verifies camera obstruction, clear camera view with obstructed player reach, and restored targeting after wall removal. An overlap regression verifies deterministic host/zone tie-breaking under reversed entity order. Full source/browser verification and new complete Windows/Mac browser packaging are in progress.

Model guides retain supported static rendering scope and documented unsupported features. Prior complete packages remain unchanged. Native Windows verification is constrained by workspace ACLs; actual macOS testing remains unverified.

Verification: all 66 source regression commands and 13 complete browser commands passed. Complete package integrity and extracted-release acceptance are recorded separately after building.
