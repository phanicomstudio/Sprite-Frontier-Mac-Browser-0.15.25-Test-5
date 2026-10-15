# Version 0.9 — live cursor interaction

Press **P** to lock the current camera and use a live point-and-click cursor.
Movement, enemies, combat and the world continue running. Hover a nearby object
to see its name and reach in the inspection device. With the weapon holstered,
left-click picks up/interacts; right-click inspects. World pickup/inspection no
longer runs in normal mouse-look mode. Device controls consume their own clicks.

The toolbar offers Ang, Fem and Glove hands. Original PNG dimensions are kept;
the upper-left pixel (0,0) is the hotspot. A is the pointing image; B remains
visible while either mouse button is held. Release, lost focus or leaving P mode
clears the held state. Images live in `img/cursors/point-and-click/`. Preferences
are saved locally. The cursor uses a pointer-transparent image overlay to avoid
native cursor size limits without resizing the supplied artwork.

The unarmed crosshair is hidden. **Armed crosshair** controls visibility when
equipped without changing aim. Armed locomotion now selects directional frames.
Each successful shot turns the player toward camera aim before reading muzzle
calibration, holding that firing facing briefly (0.12 seconds); subsequent
movement input restores movement-facing frames. Auto/burst firing shares this path.

When combat ends, music fades out over three seconds and a fresh random
exploration track fades in over two seconds. Map exploration overrides still
apply. Renewed aggression cancels the transition and starts fresh combat music.
One music voice avoids keeping two decoded tracks alive. Supply your own music
in `audio/bgm/exploration/` and `audio/bgm/combat/`, refresh the editor catalog,
choose playlists, and apply. No tracks are fabricated for the demo.

Maintainer locations: cursor.js owns cursor preferences and held feedback;
app.js owns pointer/world interaction routing; movement.js owns movement facing;
Phanicom_ActiveCombat.js aligns facing before projectile/muzzle generation;
music.js owns the timed volume envelope. No folder scans or asset loading occur
inside pointer movement. The event editor and prior tools remain available.
