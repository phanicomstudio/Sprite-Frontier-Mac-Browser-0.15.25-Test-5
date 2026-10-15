# Long-term source maintenance policy

Standing user requirement, October 8, 2026: preserve all comments and documentation, explain every function, and document every new function and important new code path. The project must remain understandable to a human maintainer years later.

The accompanying AGENTS.md carries these instructions into future development and colleague handoffs. Preserve it in every complete iteration.

## Preservation

Keep existing explanations and design rationale. Add dated revisions rather than replacing documentation with a shorter summary. When behavior changes, label the former behavior as historical and explain the current behavior clearly. Do not leave obsolete instructions presented as current. Previous release folders and archives remain intact.

Generated manifests, benchmark results and coverage inventories are derived artifacts. They may be regenerated, but must not erase handwritten explanations or become a substitute for them.

## Function comments

Every maintained function and callback needs an explanatory source comment: purpose, inputs, result, state changes, failure behavior and applicable assumptions. Record units and coordinate spaces where relevant. Explain non-obvious choices, ownership of caches, persistence and performance constraints. Document new code at the time it is implemented.

FUNCTION-REFERENCE.md and FUNCTION-REFERENCE.json provide a searchable index. Current coverage includes 3,624 maintained functions in source and Windows packages, or 3,605 in the browser package, which excludes native-only functions. Vendor code and binary/image data are identified separately.

## Verification and handoff

Run the function-comment coverage check and relevant behavior tests. Confirm descriptions against the implementation: a coverage count proves presence, not semantic accuracy. Review new or changed functions for useful explanations rather than generic labels. Update authoring and architecture guidance with the same change. Include test evidence and known limitations in the release report.

Keep diagnostics understandable and bounded. Avoid logging every frame or recording unnecessary user data. Preserve performance measurements and the reasoning behind optimizations.
