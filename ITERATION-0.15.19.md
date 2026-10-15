# 0.15.19 — locked sprite presentation and pause artwork

October 9, 2026. Supersedes 0.15.18 cylindrical/upright sprite projection. The 0.15.17 camera-facing rectangle, frame scale and tilt are mandatory. Future iterations must not change this presentation without explicit user authorization. AGENTS.md records this requirement.

Clipping correction: color and visibility now use the same constant-depth camera-facing plane. The prior upright-plane depth formula was incompatible with that presentation. The documented ground inset below the physical feet is excluded from the visibility rectangle. Nearest surface height is reconstructed from the existing depth buffer. Surfaces at or below actor foot elevation do not cut the billboard body; surfaces above that height still occlude. A 0.015 world-unit tolerance covers raster rounding. Nearer walls still hide the sprite. Camera and door collision from 0.15.18 remain.

Pause covers the screen with black backing and the supplied artwork, scaled without distortion. Resume, Save, Load and Options labels use the checkbook font on the four metal plates with invisible click boundaries. Options includes master volume, chosen hand cursor, Get Unstuck and Exit Fullscreen.

Fullscreen Escape: browsers may reserve Escape. Keyboard Lock is requested when available; otherwise exiting browser fullscreen also opens pause. This fallback cannot force a browser to remain fullscreen. Resume closes pause; Exit Fullscreen is available explicitly in Options.

Historical 0.15.18 source, guides and packages remain preserved. Their upright-sprite notes are superseded by this document. Fixed-camera rooms and water behavior remain separate as before.
