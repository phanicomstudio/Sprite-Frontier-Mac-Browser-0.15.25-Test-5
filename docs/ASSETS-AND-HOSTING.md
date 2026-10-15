# Assets and hosting

0.15.27, October 15, 2026. How images and 3D models are stored and loaded, how to run the game locally, and how to put it on Cloudflare.

## One file per asset

Every image is a PNG and every 3D model is a GLB, stored once in the folders below. Code refers to them by path; nothing is copied into JavaScript or JSON.

| Folder | Contents |
| --- | --- |
| `img/` | Sprites, characters, items, textures, skyboxes, interface art |
| `assets/models/castle/`, `assets/models/supplied/` | Placeable 3D models (the editor's castle and supplied catalogues) |
| `assets/models/runtime/` | Built-in models the game needs, such as the door transitions |
| `audio/`, `fonts/` | Sound, music and the Checkbook font |

The model catalogues (`assets/models/castle-catalog.js`, `supplied-catalog.js`) and the outdoor bank (`src/outdoor-assets.js`) hold only names, sizes and paths. To change a model or picture, replace its file.

Until 0.15.25 most of these files also existed as base64 copies inside JavaScript (about 215 MB of text across 14 files, one of them 96 MB). Every copy was checked byte for byte against its file before removal; git history keeps them.

## Running the game

| How | Command | Notes |
| --- | --- | --- |
| Local server (normal) | `npm start`, then open http://127.0.0.1:8765 | Needs Node.js. Same behaviour as the hosted game. |
| Cloudflare or any static host | see below | Upload the folder; no build step. |
| Open `index.html` from disk | `npm run build:offline` first | Browsers block reading local files, so this needs the generated `offline/` bundles. |

`npm run build:offline` writes `offline/core.js`, `characters.js`, `skyboxes.js`, `models-castle.js` and `models-supplied.js`. They are byte-identical copies of the files listed in `tools/offline-manifest.json`, are not committed (`.gitignore`), and are only loaded when the page address starts with `file:`. Rebuild them after changing any of those files, and before making a double-click package. If they are missing, the game shows a message saying so instead of starting half-loaded.

## How loading works

`src/asset-source.js` (`FrontierAssets`) decides where bytes come from:

- **Over http(s):** images use their path; models are fetched. The two built-in door models are fetched before the game starts, because the first project is built synchronously.
- **From disk:** the same calls return data from `offline/` bundles. `core` loads at startup; the others load the first time they are needed.

Startup code (`src/app.js` and the editor shell) runs through `FrontierAssets.whenReady`, in script order, once those startup models are available.

To add an asset that code reads pixels or bytes from, put the file in the right folder and refer to it by path through `FrontierAssets.url()` (images) or `FrontierAssets.bytes()` (models). If it must also work from disk, add it to `tools/offline-manifest.json`.

## File-size budget

`npm run check:assets` lists every file Cloudflare would upload and fails if any exceeds Cloudflare's 25 MiB per-file limit or the 20,000-file limit. It also lists files over 8 MiB for review. Current result: 531 files, 332 MB, none over the limit. These four are flagged for review because they slow the first load:

| File | Size |
| --- | --- |
| `img/pictures/Menu 1A.png` | 13.8 MB |
| `img/pictures/Menu 1B.png` | 13.0 MB |
| `img/ui/pause-menu.png` | 13.0 MB |
| `img/materials/floors/prop_tile_floor1.png` | 8.2 MB |

`tests/offline-assets1600.cjs` also fails if any source script grows past 2 MB or contains a large embedded base64 block, so copies cannot creep back in.

## Deploying to Cloudflare

The folder is ready to serve as [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/) with no Worker script.

- `wrangler.jsonc` names the project and serves this folder.
- `.assetsignore` keeps docs, tests, tools, `offline/`, Markdown and Node files out of the upload.

```bash
npm run check:assets      # confirm sizes
npx wrangler dev          # try it locally
npx wrangler deploy       # publish (asks you to sign in to Cloudflare once)
```

Projects authors save in the browser belong to the site address they were made on. To move work between `npm start`, a from-disk copy and the hosted site, use **Save Project (JSON)** and open it on the other one.
