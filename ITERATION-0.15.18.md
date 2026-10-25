# Complete iteration 0.15.18

October 9, 2026. Includes the complete source, assets, tests and retained historical documentation.

- Perspective sprites use matching world projection and depth, with one pooled GPU mesh per sprite.
- Camera obstruction includes geometry-room floors/walls and the model/box solids, with near-plane clearance.
- Visible transfer doors use mesh collision; invisible interaction zones remain separate.
- Resume/Escape works in HUD cursor mode and with focused pause buttons.
- Pause provides Resume, Save, Load and Options over the supplied Menu 1B artwork.
- Options provides Master Volume, Hand Cursor and Get Unstuck; menus use the selected hand.

Read CAMERA-SPRITE-PAUSE-GUIDE.md for controls, rationale and limits. HUB-DOOR-GUIDE.md remains the guide to the other hub systems; its older pause/door collision statements are superseded by the current guide. Prior iterations are preserved.

Windows: extract the entire Windows archive to a new folder, then run Launch Sprite Frontier.cmd. Mac browser: extract the entire browser archive and open index.html in Chrome; keep its files together. Both are full distributions, not update files.
