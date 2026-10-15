# Sprite Frontier maintenance rules

These are standing user requirements, recorded October 8, 2026.

- Preserve existing source comments, design rationale, documentation and prior iterations. Do not strip comments, replace documentation with generated summaries, or silently discard earlier explanations.
- When behavior changes, add a dated explanation of the new behavior and retain relevant history. Clearly mark superseded behavior so historical notes cannot be mistaken for current instructions.
- Every maintained function must have a meaningful, human-readable source comment. This includes existing functions, anonymous callbacks, event handlers, helpers, tests and new functions. Third-party/vendor libraries remain separate and retain their licenses.
- Explain purpose, arguments, return values, side effects, failure behavior and relevant units, coordinate spaces, assumptions and limits. Describe why non-obvious behavior exists. A function name alone or a generic placeholder is not adequate documentation.
- Document new code as it is written, including important internal steps and design decisions. Keep code, the function reference, authoring guides and architecture notes consistent.
- Maintain the function-comment coverage check in `tests/function-comments1516.cjs` (or its explicitly documented successor). Run it and the relevant behavior tests before delivering an iteration. Coverage proves comments exist; reviewers must also check that explanations are accurate and useful.
- Prefer clear names, readable formatting and concise plain-language explanations. Keep diagnostics focused and useful without adding expensive per-frame logging.
- Deliver complete new iterations and full Windows/Mac browser packages. Preserve previous releases; do not deliver patches or hotfix files.
- Treat these requirements as persistent. Do not weaken or remove them in future iterations without explicit user authorization.

## October 9, 2026 — locked sprite presentation

Keep 0.15.17 camera-facing sprite tilt, proportions and frame presentation. Do not substitute world-upright/cylindrical billboards or change this behavior without explicit user authorization. Fix clipping through matching depth, anchoring and collision, not by changing sprite presentation. Preserve the superseded 0.15.18 history.

## October 14, 2026 — authorized documentation cleanup

The user explicitly authorized deleting superseded documentation: old per-version iteration notes, older function references, test reports and generated test output. Git history keeps them (commit 7fca396). Guides now live in `docs/`. The rules above still apply to all current documentation and source comments; further removals need the same explicit authorization.

## October 15, 2026 — authorized delivery change

The user authorized delivering work as reviewed pull requests, building full Windows/Mac packages only at milestones the user requests. This supersedes "Deliver complete new iterations and full Windows/Mac browser packages" for routine changes. Every pull request still preserves history, documents new code and runs the comment-coverage and relevant behavior tests.
