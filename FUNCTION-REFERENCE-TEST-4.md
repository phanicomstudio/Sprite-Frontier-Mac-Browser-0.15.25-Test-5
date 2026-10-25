# October 14, 2026 Test 4 function-reference supplement

Earlier references and design history remain intact.

- `FrontierPlayerRecovery.enterPlaytest(game)`: once-per-mode-switch full-body clearance and bounded placement recovery. Keeps valid runtime position; searches nearby rings, authored tile centres and spawn ordered by XY distance; samples support below candidate feet. Returns success; never edits authored data. Failed placement leaves editing available.
- `app.mode()`: now focuses the game view after a switch, checks playtest placement and returns to editing if no clear candidate is available. Existing reset, capture and history behavior is retained.
- `app.restart(keepPosition, resetCamera, preserveHub)`: preserves full XYZ for keepPosition instead of screening XY through a ground-plane NPC query. Playtest entry owns its separate clearance decision.
- `layoutEditor.stamp(point, mode)` and doorway press handling: validate additions against bounds/capacity before changing local draft arrays. Rejected initial strokes clear gesture state so release cannot mask the error. Authored data still changes only on Apply.
- `layoutEditor.draw()`: validates controls before clearing pixels; keeps previous grid on invalid input and reports correction text. Uses existing dirty redraw rather than continuous geometry compilation.
- Workspace CSS: constrains fieldset/canvas intrinsic sizing to the left dock; existing CSS-to-logical pointer transforms remain authoritative.
