# Source history and release storage

October 24, 2026. Current main is the delivered local 0.16.2 iteration, per user request. Rollback tags archive local versions 0.1, 0.8.0, 0.15.17, 0.16.0 and 0.16.2. The former GitHub main is preserved as archive/github-main-before-local-import-2026-10-24. Its campaign shell is historical, not silently claimed integrated with the local 0.16.2 editor.

Use GitHub Desktop to switch to an archived tag for inspection; create a branch from that tag before modifying it. Avoid force pushing main. Release packages belong in GitHub Releases, never outputs/ in Git. Keep local old versions until remote uploads/hash verification and explicit cleanup approval.

Routine delivery follows AGENTS.md: reviewed pull requests, full Windows/Mac packages at requested milestones.
