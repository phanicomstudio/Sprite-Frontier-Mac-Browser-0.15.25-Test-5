# Handoff checkpoint — 0.15.16

Implementation and automated verification for this iteration are finished. Use the full 0.15.16 Windows or Mac browser package. Do not apply files into an older release.

The reproduced stair-rail landing lock is covered by tests/model-landing1516.cjs. Downward ground-following now uses a full-body sweep. Building camera clearance lives in ModelCollision.camera; sprite occlusion is row-aware. Pause controls include Get Unstuck. Every maintained function is indexed in FUNCTION-REFERENCE.md.

Next user check: extract the Windows package, run Launch Sprite Frontier.cmd, load your building and repeat the stair/rail landing and steep look-down tests. Press Escape for Get Unstuck if a new contact case occurs. Native 0.15.15 was confirmed by the user; 0.15.16 native and macOS are not claimed as tested here.

Future interior cells can reuse real interior model surfaces with separate dressing and interaction zones. See RELEASE-AUDIT.md for evidence and limits. No further code changes are pending for this delivered iteration; new feedback should become another complete iteration.


## October 9, 2026 — 0.15.17

Current hub/door/item/model visibility changes are documented in HUB-DOOR-GUIDE.md
and ITERATION-0.15.17.md. 74 source checks and 18 browser acceptance commands pass;
3,824 function comments are indexed. Native Electron automation could not launch;
Mac is a complete browser edition. See TEST-REPORT-0.15.17.md for scope/limits.
