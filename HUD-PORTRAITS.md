# HUD portrait setup

The TV portrait is independent of the gameplay directional sprite sheet. Its temporary atlas is assets/ui/candy-hud-portraits.png, with a single neutral head-and-shoulders frame derived from the supplied Candy artwork.

Edit project/hud-portrait.json and keep src/hud-portrait-data.js synchronized for offline use. Each named frame defines x, y, width and height in the dedicated atlas. Health bands select healthy, hurt, critical and dead states; damage temporarily overrides the health frame for 0.6 seconds. Idle frames can cycle with a configurable interval. All current states deliberately fall back to neutral artwork until a dedicated expression sheet is supplied. Portrait state is driven by player health, not gameplay facing or walk animation.

The supplied device shells overlay opaque screen backing regions. Live content fits inside those regions; Classic and Navigator skins have separate screen bounds. Artwork remains unchanged.
