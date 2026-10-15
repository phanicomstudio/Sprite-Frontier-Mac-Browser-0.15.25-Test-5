# 0.15.4 — development candidate

Added Supplied Assets Forest Test: 64×64 outdoor map, 141 supplied trees, clear spawn and shallow pool with 45 water cells. No enemies or bookcase. Original ground sheet is split into four separately banked decals. Four opaque ground tiles were created with built-in image generation and added to Terrain → Ground texture. Generation prompts are stored with the ground assets.

Fixed-room setup now permits initial capture; transitions retain capture. Captured fixed-room mouse movement controls a bounded logical aim point without camera orbit. Active gameplay hides the OS cursor over the game frame. Per-weapon map overrides tune random spread; default handgun deviation is 0.5 degrees.

Verification: all existing source suites pass. Windows Chrome forest smoke test and visual inspection pass. Cursor/spread regression passes transitions, Escape/P mode, bounded aim, editor tuning and data roundtrip. Native 0.15.4 and Mac testing remain pending. 0.15.3 is still the verified native baseline.

PROJECT-OVERVIEW.md and COLLEAGUE-HANDOFF.md cover goals, architecture, tools, limitations and tandem Git development. Textured room surface assembly and arbitrary-angle snapping remain future work.
