## Current iteration — 0.15.17, October 9, 2026

Use ITERATION-0.15.17.md and HUB-DOOR-GUIDE.md for current behavior. Older version
claims below are retained historical notes and are superseded by those guides.
Windows: extract the full archive and run Launch Sprite Frontier.cmd.
Mac: extract the full browser archive and open index.html in Chrome. Keep the
entire folder together. Choose Hub Test to try the new doors, shops and static
items; original test maps remain available.

# Authoring tools

Extract the entire Windows ZIP, then launch Sprite Frontier. New launches start in the outdoor Vector demo. Active map chooses what you play or edit. F2 opens the editor; switching maps starts a fresh playtest. Export all maps under Map to keep a portable backup.

## Room shape and scale

Choose Room Test, then F2 → Room. Import your room artwork and choose Fixed camera + artwork. Use Character height in room image to match a person in your render, then Apply room character scale. Camera alignment sets floor axes and image origin independently. Wheel zoom is available during play; fixed rooms do not orbit.

Draw floor outline: click corners, then Finish floor outline. Drag solid footprints for walls/furniture. Select/drag moves floor corners or objects. Place player spawn sets the start for that map. Place entrance creates a named destination with facing. Main Undo reverses applied changes. The floor outline defines walkability; the artwork alone does not generate collisions.

For an outside exit, put its center beyond the floor edge and give its radius enough overlap with that edge to create an opening. Choose the destination map and entrance before placing it. Edit radius and name under Selected room element, then Apply selected element. The player walks across the edge into the trigger; disconnected exterior circles do not open the boundary. Keep arrival points clear of exit triggers to avoid immediately returning.

For 3D tests, choose Free camera + geometry and drag 3D boxes. Select a box to edit its dimensions, base height and color. This is simple primitive geometry; ramps and elevated walkable floors are not yet supported.

## Furniture and normal maps

Import Furniture image, choose Place furniture sprite and click its feet. Select it to tune width, height and collision radius. Normal map for selected sprite / room assigns a PNG to the selected sprite; with no sprite selected it assigns the room background.

Open the normal-map workbench from Room. Load artwork, generate a silhouette-based height starting point, then raise/lower/smooth the height field. Preview normal, height or lit artwork. Drag the preview light to inspect the result. Export normal.png and height.png; import the normal into Room and set Room light direction/strength/ambient. Processing is capped at 512 pixels per side and runs on edits. Normal maps describe lighting direction, not collision or depth sorting. Exported normals are approximate and benefit from manual height painting. Keep baked lighting modest when preparing future artwork intended for adjustable lighting.

## Dialogue and reusable events

F2 → Place → Event places an event. F2 → Events selects existing events and opens their pages. Save page applies appearance, conditions and interaction behavior. Contents authors messages, choices, branches, items, journal entries and switches. Test this event starts a fresh test; Return to event editor restores authoring.

Choices write a 1-based answer to their variable. Branch numeric conditions use “at least.” Select the matching End to insert commands inside a branch; Append at end puts them after it. Copy/delete a branch includes its matching block. A higher-numbered matching page takes precedence. Self switch A can activate a completed-conversation page and prevent repeated rewards.

Save template keeps an authored event for reuse on this computer; Place template creates an independent copy. Export all maps remains the portable backup. The included examples/Dialogue-room.json can be imported under Map → Import world JSON to try a conversation with a reward and second page. Import world JSON replaces the current map; export your work first.

## Muzzle and barrel tool

Open Aim / barrel calibration beside Armed crosshair. Choose the sprite profile, direction/row and animation frame. Projectile origin places the barrel tip; Muzzle flash places its separate effect. Barrel direction guide places a point beyond the tip, aligned with the artwork. Pink joins muzzle and guide.

Keep Existing crosshair aiming to retain current behavior. Use calibrated barrel guide enables that profile in perspective third person. Forward depth controls how much travel goes into the screen relative to the guide’s sideways/upward displacement: larger values make a more forward shot; zero follows the image plane. A 2D image cannot determine this value automatically. Start around 100 and test. Adjust yaw/pitch for fine corrections; the reticle follows the calibrated collision ray before spread.

Copy points to this row’s frames copies the local positions across columns. Check each frame afterward if the weapon moves during animation. Undo calibration edit and Clear this frame guide help revise work. Apply to game installs changes; Return to game lets you fire them. Export calibration JSON keeps a portable copy, including uploaded sheets. Import loads it again. Missing guides fall back to existing aiming; fixed rooms keep cursor firing while their redesign is deferred.
