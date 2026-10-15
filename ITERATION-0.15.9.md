# Iteration 0.15.9 — candidate status

This iteration adds a readable event workflow inspired by MZ, with working exploration/quest/combat services. It does not target full MZ command parity. Earlier releases remain intact. Complete Windows and Mac browser distributions are still pending build and acceptance.

## Changes

- Right-click creation/edit/duplicate/delete, draft Apply/Cancel, pages, command dialogs, nested conditions and history.
- Versioned named skill/inventory/quest/faction/reputation state and authoring commands; Courier example demonstrates a skill check, one-time container, travel and persistent reward.
- NPC/enemy Wander/Patrol/Sentinel with bounded approach/chase/return, collision and saved homes. Patrol Encounter demonstrates recruitment and allied hitscan combat across save/travel.
- Optional bounded screen-melt transition with cross-map continuation and reduced-motion fallback.
- Sprite normal generation/import/preview/profile Apply/Remove, project persistence, cached lighting, worker preparation and asynchronous fallback.
- Separate New Map creation, fresh iteration storage, preserved bundled fixtures, fixed-camera diagonals and underwater terrain occlusion.
- Asset inventory tool, measured budgets, optimization roadmap and portable browser acceptance fixtures.

## Verification checkpoint

The cached source suite passes after normal extension and source-replacement changes. Seven portable browser fixtures pass on Windows Chrome: event interaction, context/history, Courier journey, camera sweep, melt cross-map, party travel and normal worker/persistence. tests/browser/README.md documents actual pointer input versus diagnostic hooks. The 420-case camera sweep allows underwater viewpoints and maintains terrain clearance; all141 forest trees match their ground elevation.

Normal CPU fallback also passed live preparation/reuse/removal. Current worker measurements and potential asset storage are in NORMAL-PERFORMANCE.json and ASSET-INVENTORY.json. They are not total live GPU-memory or cross-platform performance guarantees.

## Remaining delivery work and limitations

Native Windows host and final packaged/browser acceptance remain pending. macOS has not been tested; the planned Mac deliverable is a complete browser folder, not a native app. General weapon/armor database, companion melee/automatic cross-map spawning, unused MZ-specific systems and route Jump are deferred. See GAMEPLAY-DATA-EXTENSIONS.md, MZ-COMPATIBILITY.md and GAMEPLAY-ACCEPTANCE.md for boundaries.

Historical implementation checkpoints are retained in ITERATION-0.15.9-HISTORY.md; their pending-feature descriptions are superseded by this note and the acceptance table.
