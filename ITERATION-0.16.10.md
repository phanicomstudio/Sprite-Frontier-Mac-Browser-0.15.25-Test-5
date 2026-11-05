# Sprite Frontier 0.16.10 — Skill-O-Matic interaction prototype

October 29, 2026. Based on 0.16.9. This small functional test was explicitly requested while the user continues designing inventory. Previously banked culling/fog/LOD, full inventory, Item/Recipe Editors and crafting are not implemented by this prototype.

## Try it

1. Start a playtest. Press **P** to use the remote, then click its **red SKILLS button**. **K** opens the same device directly.
2. **Drag the right-hand slider**, wheel over the skill strip, or focus the slider and use arrows/Page Up/Page Down/Home/End. Original B art scrolls underneath fixed A; C fits the original groove and both endpoints stay synchronized.
3. Click **TEST SCAN**, then click a nearby prop or event. Its description appears on the existing CRT. A valid target must satisfy the same reach/obstruction rules as inspection. The message confirms which target received the scan.
4. Invalid targets keep the skill selected. **Escape or right-click** cancels targeting. Close/Escape leaves the chooser. F2 or a session/cell replacement clears temporary state.

Only one placeholder skill is enabled. Other rows are empty test slots to exercise scrolling; they are not extra skills. Selecting/scrolling does not fire the equipped weapon or run the target's normal interaction. TEST SCAN changes no health, items, XP, prices, skill statistics or progression. Probability/cost/AP rules and the real skill list are not fabricated; this does not claim full Fallout/Sonora rules parity.

## Presentation and ownership

All three original transparent PNGs are preserved byte for byte. The supplied final reference determines the dark rows, faint inactive segments, red-orange LCD lettering and fitted slider. Original vector fourteen-segment glyphs render the test label; there is no external font or new license dependency. Chooser instructions use readable system text. Layer positions scale together, B is clipped inside A, and text/hit areas scroll together.

The chooser pauses the existing simulation and clears held input. After selection the existing HUD cursor mode resumes simulation so world targeting uses the same first-person/third-person/isometric/fixed-world machinery. Cancel restores prior input ownership. Authored maps, game skill-state maps, event commands, sprite projection and save schema are unchanged. No extra frame/timer loop is installed. Runtime export includes the widget/script and all three images; original indexed-HUD capture includes the SVG/image layers.

## Item data preserved for upcoming work

The 24 starter materials, 22 matched descriptions, source IDs, two unresolved names, original Zimmerit plugin and original Items.json are retained as reference/draft data. They are not silently adopted as runtime catalogs/recipes. Existing Item/Recipe/Inventory work and the isometric visibility/fog/LOD correction remain banked; see NEXT-ITERATION-NOTES.md and CRAFTING-DESIGN.md.

## Verification

The browser test exercises the real remote button, original image dimensions, primary-pointer thumb dragging to both ends, wheel input without camera zoom, keyboard access, paused movement, valid/invalid target feedback, unchanged real loaded-ammo count, Escape/editor reset and actual target picking in isometric, perspective, first-person and fixed artwork fixtures. Indexed HUD capture with original artwork/SVG is checked independently; errors fail the gate. Run npm run test:skills with the documented browser environment. Core, export, original-palette and prior authoring/combat/door/shadow regression gates remain required. Native package launch/ZIP integrity are separate gates before delivery.
