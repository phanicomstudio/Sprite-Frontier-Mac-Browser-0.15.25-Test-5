# 0.16.9 maintained function addendum

October 29, 2026. Full adjacent source comments remain authoritative for exact arguments, mutation and failure details. Prior references remain intact.

- **authoringTools.materials/imported/importDraft**: native material select + original asynchronous file importer -> retained material draft. Prevents legacy change bubbling from detaching its owner before decode. No new source texture processing.
- **authoringTools.weapons/soundFields/melee**: detached settings + original validators -> typed per-project firearm and separate map-local melee edits. Bounded audio import/decode/preview/default restore; existing history and playback owners retained.
- **authoringTools.plan/planDraw/planStart/planFinish**: scene snapshots and CSS-adjusted pointer coordinates -> shared selection and one snapped world-XY group move per release. One observer per scene; detached plans do no refresh work.
- **authoringTools.audit**: audited status plus live command registry -> honest capabilities/gaps. No implementation is inferred from a control label.
- **authoringScene.moveMany/bounds/melee/shadows/weapons/visibility**: guarded typed editor adapter -> existing scene/project history owners; finite units validated before writes. Never edits gameplay-only state.
- **authoringWorkspace.activate/restoreTool/setView**: direct actions -> one active input owner, retained original settings, transient composition camera and shared/specialized plan presentation. No implicit draft commit.
- **buildingEditor placement and propEditor surface selection**: actual world ground hit -> original generator/preview/confirm transaction. Invalid placements reject atomically; optional preview retains prior behavior.
- **enemy direction selection/upgradeProfiles**: supplied two-view metadata and optional saved profiles -> matching actual frames with conservative stock migration. Row-zero custom calibrations and locked tilt retained.
- **enemy configure/fire**: shared inherited damage or explicit enemy override -> existing cadence/projectile owner. New presets inherit; legacy authored numeric damage remains explicit.
- **localLighting.shadows / sunShadows/contact draw / event validation**: bounded strength and optional actor checkbox -> separate existing sun/iso-contact passes; no perspective contact submission, no changed receiver budget.
- **isometric.validate/camera**: saved yaw radians, tilt degrees, scale or editor-only override -> existing affine renderer camera. Gameplay writes require explicit Apply; fixed artwork stays separate.
- **isometricVisibility.validate/begin/weight/cutout/slot/draw**: terrain-before-geometry depth plus existing actor frames -> pooled isometric gameplay-only vignette and occluded enemy contour. Geometry/collision depth unchanged, 12 enemy cap, no production GPU readback.
- **weaponDefinitions.validateSound/editor read / SE register-preview-play / ActiveCombat sound**: validated bounded embedded audio -> original pooled playback with original default fallback. Advanced edits retain sound data. Legacy numeric melee controls preserve imported sound.
- **mapLibrary.shadowSettings/restore and weaponDamage**: validated authored fields -> existing distinct transaction histories. Shadow Undo restores only strengths, preserving unrelated subsequent scene changes.
- **paletteDither editor**: original complete parameter set -> simple/advanced presentation only; shader and commands unchanged.

New acceptance functions in tests/iteration169.cjs and tests/browser/{iteration169,features169}.cjs document their fixtures, actual owner calls, bounds and failure gates immediately beside each callback. Coverage checks presence; semantic review still matters.
