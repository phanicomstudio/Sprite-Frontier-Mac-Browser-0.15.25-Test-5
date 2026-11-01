# Windows 0.16.15

Extract the complete ZIP, then open Launch Sprite Frontier.cmd. This cumulative release includes 0.16.14 rendering fixes and the projectile-light setting correction. It retains the compatible 0.16.11 desktop profile; prior releases and user projects remain untouched.

Environment → Map lighting → Projectile lights now saves the toggle immediately. Other numeric/source adjustments retain Apply map lighting / Apply selected light. Enable lighting on the map as usual; per-weapon custom/off light overrides remain authoritative.

Environment → Sprite normals uses the bundled local Sprite Fusion generator. Load a registered sprite, generate/preview, then Apply lighting to this sprite on current map. No Rust installation or internet connection is required for generation. See SPRITEFUSION-0.16.0.md for limits, build provenance and retained licensing.
