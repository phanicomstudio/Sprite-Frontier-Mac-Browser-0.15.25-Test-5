# Function additions — 0.16.13

`paletteDither.composeWorld1613(adapter, world)` captures assembled world and world-only effects to a retained GPU texture, resizes for logical viewport/density changes, and presents it beneath HUD/melt. Errors propagate. No map mutation or CPU readback. See docs/DITHERING-0.16.13.md.
