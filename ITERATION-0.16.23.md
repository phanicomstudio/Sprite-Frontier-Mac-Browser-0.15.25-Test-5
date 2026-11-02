# Iteration 0.16.23 — centered first-person aiming and return-facing

November 1, 2026. Supersedes first-person use of the old raised third-person crosshair/projection, retained in prior source/history.

First-person now projects its forward optical axis to logical viewport center (half the active width, 240 of 480 vertical pixels). Its DOM crosshair uses 50%/50%; third-person's raised marker and fixed/isometric pointer aim remain separate. The actual projectile camera ray uses first-person pitch directly, avoiding the old third-person crosshair compensation. Camera-relative muzzle offsets, physical swept collision, accuracy/spread, assistance, lighting, sway and world-sprite presentation remain owned by their established systems.

When leaving first-person through wheel-out or the existing camera button/V route, player facing and movementFacing align to camera yaw. Camera/world position stay unchanged. The player therefore shows their back after returning to third person instead of restoring stale pre-entry front-facing direction. Isometric/fixed cameras are excluded from this alignment helper.

Validation: actual production browser projection and projectile factory at 640/853 logical widths, zero-spread convergence at viewport center, production DOM marker, and actual wheel/button exit handlers with initially reversed actor facing. Existing first-person/lighting/projectile and comment-coverage suites remain required. Full Windows package receives offline executable and ZIP integrity checks.
