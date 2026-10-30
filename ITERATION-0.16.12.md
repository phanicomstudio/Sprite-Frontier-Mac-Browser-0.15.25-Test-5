# Sprite Frontier 0.16.12 — fullscreen recovery

October 29, 2026. Complete cumulative release based on 0.16.11. Supersedes its viewport-only editor fullscreen and locked-Escape behavior: the editor now enters fullscreen with its whole workspace, retaining the toolbar. Escape exits editor fullscreen even when a control has focus. An explicit Exit fullscreen button stays inside either fullscreen target above normal editor/HUD layers. F11 exits HTML fullscreen before toggling native window fullscreen. Playtest retains its existing deliberate Escape/pause behavior and viewport presentation; the explicit exit control is also available there.

No map, inventory, combat or schema changes. This compatible correction deliberately retains the 0.16.11 desktop profile and existing local project. Prior full releases are preserved.

Validation: actual Chrome fullscreen entry/exit, visible editor toolbar, focused-control Escape, explicit exit/re-entry; function-comment coverage and core behavior regression suite. Packaged Windows acceptance also exercises F11 recovery. Extract the complete Windows ZIP, then run Launch Sprite Frontier.cmd.
