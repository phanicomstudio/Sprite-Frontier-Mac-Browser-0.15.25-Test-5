# Projectile update 0.5.2

Crosshair targeting skips camera-side scenery behind the shooter. Muzzle projectile collision still checks nearby obstructions. Scenery impacts have a 20% chance to bounce, randomized around the reflected surface direction; maximum one bounce. Actors and terrain do not ricochet in this iteration. Projectile speed, damage and remaining range are preserved. No impact material editor controls yet.

Regression checks cover rear-tree aim, outgoing bounce direction, unit vector, zero chance and one-bounce limit. Existing gameplay and local-file movement checks pass.
