# 0.16.9 validation report

October 29, 2026. Tests ran against this branch using Node and isolated Chrome/WebGL, with actual controls/transactions. No existing checks were weakened. This report records the correction slice; FEATURE-STATUS-0.16.9.md retains outstanding architecture gaps.

- 65/65 core/comment/export gates passed.
- Seven browser gates passed: iteration169, features169, palette168, combat167, iteration164, iteration166, indexed reciprocal-door returns.
- 15/15 additional model/hub gates passed, including model mesh collision, support/landing, transforms, camera, visibility and door/hub state.
- Function-comment coverage passed for all maintained functions (coverage confirms presence; adjacent explanations were reviewed for new code).
- Real pointer input verified terrain brush/Undo, piece placement, asynchronous original texture import, event health/hostility/shadow settings, and shared-plan movement/Undo.
- All 16 project weapon profiles adopted configured damage, player clone refreshed, rocket blast changed independently. Separate melee adopted damage through its own map owner.
- A generated 0.2-second WAV actually decoded/played in the original media pool; embedded bytes and damage survived reload; clearing restored original sound fields.
- Isometric camera preview yaw75/tilt40 did not change authored tilt30 until Apply; normal perspective authoring override remained independent.
- Real GPU occlusion fixture: enemy outline ON produced 988 strong red pixels versus 0 OFF; geometry cutaway modified 7550 pixels. Range0 excluded the enemy; perspective gate disabled the pass; two retained actor slots used against cap13.
- Original palette shader GPU comparisons remained exact for the existing five cases / 40,960 compared RGBA channels. This is measured on the tested renderer, not a cross-driver universal guarantee.
- Existing jump-contact test retained grounded/ascent/landing behavior, actual pixel changes, isometric zoom framing and bounded receiver work. Timings are workstation samples, not universal FPS promises.

Native executable launch and ZIP manifest integrity are separate delivery gates. Their evidence is retained outside the package in work/native169.json and work/release169-integrity.json; no diagnostic profile or debugging port is shipped.
