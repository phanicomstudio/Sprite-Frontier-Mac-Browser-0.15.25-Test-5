# Mandatory projectile lighting — November 1, 2026

- `localLighting.projectile(value,id)`: validates a detached source with mandatory true enablement, positive brightness and existing bounded color/radius/falloff/flicker.
- `localLighting.validate`: canonical map/save normalization; general map enablement stays independent, while projectile false/zero values are upgraded.
- `spatial.createProjectile`: every real projectile receives mandatory source settings at creation, retaining per-shot ownership and existing ballistics.
- `weaponDefinitions.validate/read`: old weapon opt-outs migrate; the authoring mode has inherit/custom positive parameters and no off option.
- `lightingEditor.fill/applyCell`: no projectile checkbox; hides generic enabled control for the reserved projectile source and retains positive parameter editing. Retired switch source/comments are explicitly historical.
- `localLighting.frame`: stale-runtime defense, emission on otherwise disabled maps, projectile-first selection using the existing eight shader slots; ordinary decorative budgets and map ambient remain separate.
- `tests/browser/projectile-light-always1619.cjs`: current successor to optional-toggle 0.16.15 behavior, using actual editor/map/playtest/reload and shot factories in three camera modes.

See ITERATION-0.16.19.md for deliberate rendering limits and compatibility behavior. Existing function comments, source history and earlier release notes remain preserved.
