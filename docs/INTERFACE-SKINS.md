# Interface skins

0.15.28, October 15, 2026. How the in-game interface is framed, how to choose a skin, and how to make a skin pack.

## The four devices

The interface always has the same four parts in the same places. A skin only changes how they look.

| Device | What it holds | Where |
| --- | --- | --- |
| Controls | Journal, Inventory, Resume (and Ask, when an NPC is near) | Bottom left |
| Portrait | The character portrait, with Blood and Cerebral | Bottom centre |
| Status | Weapon and ammunition above, the inspected object below | Bottom right |
| Pause | The pause menu and Options | Full screen |

## Choosing a skin

- **Players:** Pause → Options → **Interface**. **Campaign default** follows the campaign. **Minimal** uses no images. Any installed pack is listed by name. The choice is remembered in that browser.
- **Campaigns:** in the editor, the **Interface** list under the campaign name sets the campaign's skin. It is saved in the project and used by exported games. New campaigns use Phanicom devices.

## Minimal

Minimal is built in. It frames each device with a quiet glass panel, a single hairline border and warm off-white text, and uses one signal orange only for state, such as the weapon. It needs no images and works with any text font, including the system fonts in Options → Text font.

Minimal is also the fallback. A pack that leaves out a device gets the minimal frame for that device, and a pack that fails to load leaves everything minimal, with a warning in the console.

The styles are in `skins/minimal.css`.

## Making a skin pack

A pack is a folder in `skins/` holding a `skin.js` and its images.

```
skins/
  index.js                list of packs shown to players
  minimal.css             the built-in minimal frames
  phanicom-devices/       the original device art, as a pack
    skin.js
    remote.png, status-tv.png, portrait-chassis.png, portrait-lens.png, pause-menu.png
```

1. Create `skins/<id>/`. The ID uses lowercase letters, digits and dashes.
2. Put the images there as PNG, JPEG or WebP files.
3. Write `skins/<id>/skin.js`:

```js
FrontierSkins.register({
  schema: "sprite-frontier-skin/1",
  id: "brass",
  name: "Brass instruments",
  controls: {
    image: "panel.png",
    hotspots: {
      journal: [60, 71.8, 11, 3.2],
      inventory: [76, 78.4, 10, 3.1],
      resume: [14.5, 31.7, 10, 4],
    },
  },
  portrait: { frames: ["bezel.png", "glass.png"] },
  status: {
    image: "gauges.png",
    screens: { equipment: [32, 11, 30, 18], inspection: [32, 50, 30, 18] },
  },
  pause: {
    image: "pause.jpg",
    menu: [26, 60, 48, 30.4],
    settings: [12, 8, 76, 84],
  },
});
```

4. Add `{ id: "brass", name: "Brass instruments" }` to `skins/index.js`.

### Fields

Every rectangle is `[x, y, width, height]` in percent of its image, measured from the top-left corner.

| Field | Meaning |
| --- | --- |
| `controls.image` | Art behind the control buttons |
| `controls.hotspots` | Where `journal`, `inventory`, `resume` and optionally `ask` sit on that art. Buttons are invisible on framed art; the art shows them. |
| `portrait.frames` | 1–4 images drawn over the portrait, in order, at 766 × 681 pixels. The portrait's screen area is x 85–597, y 86–525; leave it transparent. |
| `status.image`, `status.screens` | Art for the status device, and where the `equipment` and `inspection` text screens sit on it |
| `pause.image`, `pause.menu`, `pause.settings` | Full-screen pause art (shown at 4:3), where the four menu actions sit, and where the Options panel scrolls |

Every device section is optional. Leave one out and that device uses the minimal frame.

Where the devices sit on screen (corners, sizes in fixed-camera rooms) is part of the layout, not the skin, so every pack lines up with the rest of the interface.

### Checking a pack

`npm run test:skins` validates the shipped packs and runs the interface in a browser. A pack with a mistake is rejected with a message naming the field, for example `controls.journal must lie on its image (percent of width and height)` or `status.image must be an image file inside the skin folder.`

## For developers

| File | Owns |
| --- | --- |
| `src/ui-skins.js` | `FrontierSkins`: manifest validation, pack loading, player choice and campaign default, applying images and geometry, marking devices `skinFramed` or `skinPlain`, and the `frontier-skin-change` event |
| `skins/minimal.css` | Minimal frames, and the minimal pause and Options panels |
| `src/device-hud.js` | Draws the portrait, then the active skin's frame layers, and repaints on `frontier-skin-change` |
| `style.css` | Device layout. Pause art and regions read `--skin-pause-*` custom properties set by the skin. |
| `src/map-library.js` | Saves `project.uiSkin` and passes it to `FrontierSkins.setCampaignDefault` |

Tests: `tests/ui-skins1600.cjs` and `tests/browser/ui-skins1600.cjs`.
