# Sprite Frontier 0.15.25 (Test 5)

Sprite Frontier is a browser game engine and editor that combines 2D sprite characters with 3D terrain, perspective and fixed-camera views, and static 3D models. It targets Daggerfall/Fallout-style exploration, quests and combat. The event and quest system follows RPG Maker MZ's workflow; full MZ parity is not a goal.

This is a user test build, not a certified release. Current changes are in [docs/TEST-BUILD-0.15.25-TEST-5.md](docs/TEST-BUILD-0.15.25-TEST-5.md).

## Play

- **Mac or any browser:** open `index.html` in Chrome. Keep the whole folder together; the game loads its assets from the neighbouring folders.
- **Local server (optional):** run `npm start` and open http://127.0.0.1:8765. The server only listens on this computer.
- **Windows desktop:** use the separate Windows package and its `Launch Sprite Frontier.cmd`. This browser edition does not include the desktop launcher, so `npm run desktop` does not work here.

### Controls

| Key | Action |
| --- | --- |
| Click the view | Capture mouse look (Escape releases it) |
| W A S D | Move |
| E | Jump |
| V | Change camera |
| P | Point-and-click mode |
| F2 | Open or close the editor |

In the editor, E or Space rises, Q descends and Shift speeds up flight. Playtest starts from the editor's current position.

Choose **Hub Test** or **Supplied Assets Forest Test** under Active map to try doors, shops, items and textured terrain. Bundled test maps stay available alongside your own.

## Build

- **New map / New project:** new maps and blank projects never overwrite the bundled test maps.
- **Events:** in the editor, right-click the ground and choose **Create event here**. Pages hold conditions, appearance, movement, triggers and ordered commands. Apply commits; Cancel discards.
- **Rooms and structures:** **Build Structures** opens the Tile Room Editor with wall, floor and ceiling texture pickers.
- **Scene list:** click to select, Shift-click for a range, Ctrl/Cmd-click to toggle. **Delete selected** removes them in one undoable step.
- **Save your work:** use **Save Project (JSON)** or **Export all maps**. Browser storage alone is not a backup.

## Project layout

| Folder | Contents |
| --- | --- |
| `src/` | Engine and editor source (about 160 modules, loaded in order by `index.html`) |
| `js/plugins/`, `plugins/` | Combat, blood and footstep plugins |
| `assets/`, `img/`, `audio/`, `fonts/` | 3D models, textures, sprites, music and sound |
| `data/`, `project/`, `examples/` | Bundled project data, settings and examples |
| `reference/` | RPG Maker MZ command catalogue and original plugin sources |
| `tests/` | Source tests (Node) and `tests/browser/` acceptance tests (Playwright) |
| `tools/` | Asset inventory and packaging scripts |
| `vendor/` | PixiJS 8 and its licence |
| `docs/` | Guides, references and validation records |

`src/app.js` connects input, editing, simulation and rendering. Gameplay rules belong in their own services rather than in `app.js`. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/CODE-GUIDE.md](docs/CODE-GUIDE.md).

## Test

```bash
npm test                         # core source tests
npm run test:models              # 3D models and collision
npm run test:hub                 # hub, doors and model visibility
npm run test:audit               # rendering and performance contracts
node tests/function-comments1516.cjs   # every function has a comment
```

The browser tests in `tests/browser/` need Playwright and Chromium; see [tests/browser/README.md](tests/browser/README.md). macOS has not yet been formally tested.

## Documentation

| Topic | Document |
| --- | --- |
| Current test build | [TEST-BUILD-0.15.25-TEST-5.md](docs/TEST-BUILD-0.15.25-TEST-5.md), [TEST-BUILD-0.15.25-TEST-2.md](docs/TEST-BUILD-0.15.25-TEST-2.md), [ITERATION-0.15.25.md](docs/ITERATION-0.15.25.md) |
| Authoring | [AUTHORING-GUIDE-0.15.24.md](docs/AUTHORING-GUIDE-0.15.24.md), [EDITOR-CONTROLS-0.15.24.md](docs/EDITOR-CONTROLS-0.15.24.md), [EVENT-AUTHORING.md](docs/EVENT-AUTHORING.md), [BUILDING-AUTHORING-1524.md](docs/BUILDING-AUTHORING-1524.md), [MODEL-AUTHORING.md](docs/MODEL-AUTHORING.md), [HUB-DOOR-GUIDE.md](docs/HUB-DOOR-GUIDE.md) |
| Code | [ARCHITECTURE.md](docs/ARCHITECTURE.md), [CODE-GUIDE.md](docs/CODE-GUIDE.md), [COLLEAGUE-HANDOFF.md](docs/COLLEAGUE-HANDOFF.md), [FUNCTION-REFERENCE-0.15.24.md](docs/FUNCTION-REFERENCE-0.15.24.md) plus the Test 4 and Test 5 supplements |
| Rendering and performance | [RENDERING-1522.md](docs/RENDERING-1522.md), [PERFORMANCE-REPORT-1523.md](docs/PERFORMANCE-REPORT-1523.md), [ASSET-OPTIMIZATION-GUIDE.md](docs/ASSET-OPTIMIZATION-GUIDE.md) |
| Validation | [RELEASE-VALIDATION-0.15.24.md](docs/RELEASE-VALIDATION-0.15.24.md), [VALIDATION-1524.md](docs/VALIDATION-1524.md), [CONTROL-CHECKS-TEST-5.md](docs/CONTROL-CHECKS-TEST-5.md) |
| RPG Maker MZ support | [MZ-COMPATIBILITY.md](docs/MZ-COMPATIBILITY.md), [MZ-COMMAND-COVERAGE.csv](docs/MZ-COMMAND-COVERAGE.csv) |
| Playtest observations | [NEXT-CHANGE-LOG.md](docs/NEXT-CHANGE-LOG.md) |
| Version history | [CHANGELOG.md](CHANGELOG.md) |

Rules for changing the code, including the locked 0.15.17 sprite presentation, are in [AGENTS.md](AGENTS.md).

### Removed history

On October 14, 2026, per-version iteration notes, older function references, old test reports and test-output screenshots were removed to keep the repository manageable. Some guides still mention those files by name. They remain in git history: run `git show 7fca396:ITERATION-0.15.17.md`, for example, or browse that commit on GitHub.
