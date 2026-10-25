# October 10, 2026 — iteration 0.15.20

Previous releases and documentation are retained. The 0.15.17 camera-facing sprite presentation remains locked. No cylindrical billboard substitution is permitted.

## Authoring

Select Hub Test and use the Saloon doors to enter Saloon Geometry Room. Only the supplied pair GLB is included; unused separate leaves are omitted. The room has four perimeter walls (the door wall has an opening), a wood floor and a tin ceiling. F2 opens authoring; Room controls provide grid snapping, surface selection and world-unit texture tiling. Apply edits before playtesting. Templates, transfers, collision and cell state continue to use the existing engine.

Native effects / map notes opens the effects editor. Apply commits a draft; Cancel discards it. Color pooling has palette, strength and speed controls. With pooling enabled, map notes <ColorPoolPlayer> and <ColorPoolFollowers> opt characters in; an event note <ColorPool> opts that event in. <NativeEffect: rain> and the other supported emitter names attach effects to events. Map emitters have position, radius and rate controls, with a bounded shared particle budget. Rain tests overhead room/model geometry before spawning. Liquid presets modify already authored water surfaces.

Event contents have Insert crafting / cipher. Crafting checks all ingredients and capacity before changing inventory. Cipher writes 0 for cancellation, 1 for success, 2 for exhausted attempts and 3 for timeout to its selected variable. Branch on that variable afterward.

Door transfers hide the hand and reject gameplay/menu input until the complete cinematic and fade end. There is no user transition skip. The old internal skip API remains for historical compatibility and unit tests, not player access.

## Current limits and next work

These are initial native adaptations, not complete replicas of every reference plugin parameter. The cipher is a sequence-matching challenge; rotated/mirrored glyph puzzles remain future work. Effects use simple particles and procedural marks; sheet rain, splash/bubble detail, richer liquid simulation and the full wild/environment variant catalog still need implementation. Breathing currently provides configurable squeeze amplitude and frequency. Combat retains the existing extensible weapon profiles and message-HUD kill feed; specialized explosive and beam behavior requires further audit before claiming full reference parity. The effects editor does not yet expose every combat parameter or provide a separate preview pane.

## Rendering and assets

Interior geometry owns its floor; outdoor terrain is omitted inside rooms. Room and model raster uploads use separate reusable surfaces because deferred GPU draws otherwise let a later model erase the room image. They still share inverse depth for occlusion. Only five room textures are resized to a maximum 2048-pixel edge. Sprite assets are unchanged. Offline image mirrors allow safe pixel sampling on file URLs; this duplicates compressed data and is a future packaging optimization target.

Prefer shared GLB instances and reusable materials. Keep source art separately; runtime textures should be sized to their maximum visible use. Measure decoded texture memory rather than assuming PNG file size equals GPU memory. Atlas repeated small sprites with padding, retain alpha where needed, and investigate compressed GPU textures only with supported browser/desktop loaders and a measured visual comparison. Avoid giant atlases that force unrelated assets into memory together.

## Validation

Required source suites and the function-comment check passed (3,970 maintained functions at this checkpoint). Browser acceptance covers saloon fixture, textures, bounded emitter authoring, crafting and cipher cancellation. Visually inspected the enclosed room after correcting deferred upload reuse. Native Windows and macOS hardware testing remain user-side checks.
