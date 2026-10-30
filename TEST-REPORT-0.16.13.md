# Validation — 0.16.13

October 30, 2026. Passed: full core test script; original shader/default/palette validation; original-plugin GPU pixel comparisons; maintained function-comment coverage (7,095 functions); reported wilderness visibility with Apply To UI on/off/on; pause/resume. Production framebuffer sampling found 29,195 lit pixels out of 55,296 in each tested world region with either UI setting.

Packaged Windows Electron acceptance passed using an isolated diagnostic profile: version 0.16.13, retained GPU snapshot active, 25,996 lit world pixels in the sampled region, no HUD capture error. Test profile and diagnostic settings were removed from the distribution after application shutdown.

The fix adds one GPU render-to-texture pass while HUD/melt composition is active. No benchmark claim is made. Original palette shader and authored settings are unchanged.
