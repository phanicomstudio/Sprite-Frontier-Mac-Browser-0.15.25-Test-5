# Iteration 0.16.22 — first-person control corrections

November 1, 2026. Supersedes the 0.16.21 wheel-out restriction and distance-driven sway. Earlier release notes remain historical.

- Outward mouse wheel leaves first-person for a safe third-person distance. Inward wheel still enters from the settled near limit. First-person has no lens zoom; fixed/isometric maps remain separate.
- Sway is wider (up to seven reference pixels horizontally), exponentially smoothed and driven by a fixed 0.85 Hz cycle. Walking and running use the same cadence; speed only determines bounded motion amplitude. It settles smoothly at rest. Aim/camera remain stable.
- Native weapon parameters distinguish image-relative Flash horizontal/vertical position from physical first-person Projectile spawn forward/right/up, in metres relative to the camera eye. Defaults are 0.45 m forward, 0.08 m right and -0.15 m up. The shared actual projectile factory consumes these values, aims toward the camera target and retains body-to-muzzle collision checks, accuracy and mandatory lighting. Third-person/NPC muzzle calibration is unchanged.
- The pistol editor now shows the supplied default image path, allowing spawn/flash changes without first importing replacement artwork. Saved first-person assignments without the new fields acquire the defaults through validation.

Authoring: World → Cells & project → Starting gameplay values → Native weapon parameters → Pistol. Enable Override handgun, set character profile (Candy uses candy-armed), image/animation and muzzle/spawn values, then Apply. Applying starting values starts a fresh playtest. Flash coordinates range 0–1 within the artwork frame; physical offsets are metres and do not follow cosmetic sway.

Validation: real-browser inward/outward wheel and isometric restriction, actual projectile origin matches custom offsets, holster/character assignment round trips, identical walk/run sway phase and amplitude, 60/120 Hz consistency and resting decay. Existing lighting/normal/projectile suites and function-comment coverage remain required. Package receives native/offline acceptance and full manifest verification.
