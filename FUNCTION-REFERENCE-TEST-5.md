# October 14, 2026 — function-reference supplement

Retains all earlier references/history.

- `app.removeSceneSelection(targets)` / `FrontierSceneActions.removeMany`: accepts stable group/ID pairs, resolves current authored collections and uses one standard mutate transaction. Rejects empty/stale/runtime/nonediting requests. Removes instances, not shared files.
- Scene `choose(..., reveal)`: false updates the owning control without category/focus/scroll changes; explicit Edit selected uses true. Highlight state is a transient Set, independent of saved world data. Shift uses the last anchor and visible filtered ordering; Ctrl/Cmd toggles IDs.
- Scene `deleteTargets`: submits one owner transaction and restores dock/list offsets after owning-control DOM observers. Focus moves to a nearby remaining Delete button without scrolling. Row deletion and batch deletion share this path.
- Workspace surface-selection presentation respects the `revealProperties:false` event detail, preventing indirect automatic inspector scrolling.
- Layout `openWindow`: opens the existing retained controls in a large modal and resets pane scroll positions, without committing a draft. Close retains the draft. Mode F2 closes the modal; simulation/input gates prevent behind-window motion.
- `importRoleTexture`: validates image MIME/8MB limit, reads/decode-checks embedded bytes, updates one draft option and thumbnail; errors report locally. Saved role textures restore through refresh.
- `compileDraft`: uses the original compiler (preserving geometry deltas) and optionally replaces role texture overrides only when the visible checkbox is checked. Other compiler callers retain original defaults.
- `roomLayout.validate`: validates optional wall/floor/ceiling material records and portable texture URLs; previous layouts remain compatible.
- Apply textures callback classifies generated module roles or legacy structural names, updates texture settings in one Undo transaction and preserves unrelated primitives/dimensions.
- Map management: original deletion validation remains; adjacent map-operation status now exposes rejection reasons and successful deletion. Optional example-map controls are grouped, not removed.
