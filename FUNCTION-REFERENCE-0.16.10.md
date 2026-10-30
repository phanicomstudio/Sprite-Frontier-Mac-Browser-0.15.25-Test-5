# 0.16.10 function addendum — October 29, 2026

Existing references and comments are retained. Every new function has an adjacent purpose/input/output/side-effect/failure contract in source.

- skillOMatic.lettering: uppercase text -> original reusable SVG fourteen-segment label, no external font or frame loop.
- skillOMatic.create: original coordinator API -> mounted A/B/C layers and red remote button; returns open/reset/target plus read-only opened/armed queries.
- skillOMatic.sync/scrollTo/thumbStart/thumbMove/thumbEnd/thumbKeys/wheel: CSS/native scroll -> clamped original-artwork thumb progress and accessible value. No authored/runtime gameplay mutation.
- skillOMatic.open/close/reset/arm/keys: user input -> transient chooser/target state using coordinator-owned pause/cursor. Source/session changes clear state without recapturing input. Real rules remain outside this prototype.
- skillOMatic.target: logical viewport point/button -> consumes armed skill clicks, calls original reach/inspection on a valid target, retains selection after rejection and cancels on right-click. No ammo, health, inventory or stat mutation.
- app.skillAllowed/skillPrepare/skillFinish/skillScan: bridge alive/edit/dialogue/transition gates, existing held-input reset, prior-mode restoration and existing nearest-target obstruction/range/inspection semantics. No second simulation or targeting picker.
- tests/browser/skill-o-matic1610 callbacks: original coordinator/source fixtures and actual browser input/GPU capture, with explicit failure and cleanup contracts. No mocked hit results or substituted runtime functions.
