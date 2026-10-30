# 0.16.12 validation

October 29, 2026. All 62 core regression scripts pass. Function-comment coverage passes. The real Chrome fullscreen test verifies editor document-root fullscreen, visible toolbar, Escape from a focused control, explicit exit button, re-entry and preserved editor mode.

The packaged Windows executable was tested in an isolated diagnostic profile: editor Escape and explicit exit pass. Actual Windows F11 input was sent using the computer-use skill, confirming HTML fullscreen release and native fullscreen enter/exit. Opt-in main-process diagnostics recorded one HTML release and the two native toggles. Browser-driver F11 injection does not reach Electron main-process before-input-event; those initial test-driver timeouts are not reported as native failures or passes.

No authored data/schema changes; the compatible 0.16.11 desktop profile remains in use. Diagnostic profile/logs are removed from the full ZIP before delivery. Prior release folders remain preserved.
