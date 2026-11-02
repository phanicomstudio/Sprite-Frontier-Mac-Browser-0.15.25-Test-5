# Sprite Frontier 0.16.13 — visible world with UI dithering

October 30, 2026. Fixes the reproducible black world when Apply To UI is enabled. The earlier wrapper reparented live pooled world meshes before submission. HUD and melt composition now submit the world with its existing ancestry and world-only effects into a reusable screen-sized GPU render texture, then composite that finished image with overlays before the unchanged original palette shader. This supersedes live-world reparenting in the 0.16.8 compositor.

The texture follows logical viewport size and framebuffer density, resizing only when necessary. There is one additional GPU world submission while composition is active; no per-frame CPU pixel readback. Original plugin gamma, palette, defaults, commands and shader math remain unchanged. Existing project/profile 0.16.11 is retained. Earlier releases are preserved.
