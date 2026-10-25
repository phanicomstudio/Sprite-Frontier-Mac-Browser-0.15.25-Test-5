## Current iteration — 0.15.17, October 9, 2026

Use ITERATION-0.15.17.md and HUB-DOOR-GUIDE.md for current behavior. Older version
claims below are retained historical notes and are superseded by those guides.
Windows: extract the full archive and run Launch Sprite Frontier.cmd.
Mac: extract the full browser archive and open index.html in Chrome. Keep the
entire folder together. Choose Hub Test to try the new doors, shops and static
items; original test maps remain available.

Current iteration: 0.15.15 fixes real-building stairs and post-landing movement. See ITERATION-0.15.15.md for current behavior and verification.

Complete 0.15.15 iteration candidate: walkable static model geometry, stairs, roofs, jumping/landing and ceiling collision. 68 source checks and 15 browser checks pass; see ITERATION-0.15.15.md for remaining release gates.

# Sprite Frontier 0.15.15

Complete new iteration with static 3D models, shared model resources and independent collision/interaction volumes. MODEL-AUTHORING.md explains importing and placing models and making door-only interactions. MODEL-PERFORMANCE.md records measured costs and limitations. Earlier iterations and bundled test maps are preserved; this release uses independent saved-state storage.

# Existing engine features

Complete iteration candidate for exploration, quests and combat with a readable event editor. Read PROJECT-OVERVIEW.md for design/status and ITERATION-0.15.15.md for current changes and verification.

## Play

Browser: open index.html in Chrome with the entire folder kept together. Optional Node development server: npm start. Windows distribution: extract the complete archive and run Launch Sprite Frontier.cmd. The Mac edition is a browser folder, not a native macOS app.

Select Supplied Assets Forest Test in Active map for textured terrain, trees and a pool with no enemies. Click the view to capture look; Escape releases it. WASD moves, E jumps, V changes camera and P enters point-and-click mode. F2 opens authoring.

## Author

New map adds a separate map and preserves bundled test maps. In authoring mode right-click ground and choose Create Event Here. Configure pages/appearance/behavior/commands, then Apply or OK. Cancel discards unapplied changes. Map tab can add the Courier or Patrol Encounter example as separate maps. Export all maps for backups and colleague exchange; local browser storage alone is not a backup.

Sprite normals: open the normal workbench, choose/load a profile, generate or import normals, preview and Apply. Map transition can use fade or melt. See EVENT-AUTHORING.md, SPRITE-NORMALS.md, SCREEN-MELT.md, COURIER-EXAMPLE.md and PARTY-ENCOUNTER.md.

## Verify and extend

COLLEAGUE-HANDOFF.md explains workflow and module contracts. CODE-GUIDE.md, GAMEPLAY-DATA-EXTENSIONS.md and MZ-COMPATIBILITY.md record extension boundaries and deferrals. ASSET-OPTIMIZATION-GUIDE.md covers dimensions/formats/packing/memory and the staged optimization roadmap.

Source regression commands are in package.json. Portable browser fixtures and dependency instructions are in tests/browser/README.md. Browser checks passed on Windows Chrome. macOS remains untested. Native automated launch currently encounters a workspace ACL error before rendering; complete archives have passed integrity checks; native Windows 0.15.9 startup was confirmed by the user; native Windows 0.15.10 and macOS execution remain unverified. This is not a full MZ-parity claim. Previous iterations remain intact.
