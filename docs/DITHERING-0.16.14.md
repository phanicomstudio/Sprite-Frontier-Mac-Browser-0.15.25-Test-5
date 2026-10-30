# Sprite Frontier 0.16.14 — stable filtered rendering

October 30, 2026. Supersedes the 0.16.13 render-to-texture workaround. Terrain, sky, sun/contact shadows and isometric actor reveal now use Pixi projection/world/local transforms instead of direct screen clip coordinates. This preserves orientation and pixel placement when rendering into the filter framebuffer, including after palette preset switches and at non-power-of-two viewport sizes. Existing world geometry, UVs, lighting, depth/collision and camera-facing sprite presentation remain unchanged.

The renderer retains a world container and attaches it before assembling pooled geometry. World effects apply to that container; HUD and melt append to the root before the unchanged palette shader. Finished geometry is neither reparented nor copied to an extra texture. There is one normal renderer submission per frame and no added CPU framebuffer readback. Existing DOM HUD capture remains bounded to 10 Hz.

Original plugin shader math, palettes and authored values remain unchanged. Existing desktop project profile is retained. The 0.16.13 release and its validation notes remain historical; its brightness checks were insufficient to detect inversion or rendering cost. This release adds exact asymmetric quadrant orientation tests and a submission-count regression.
