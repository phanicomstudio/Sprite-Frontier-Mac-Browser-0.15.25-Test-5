# Native Windows measurements — October 12, 2026

Use a separate complete Windows copy and an isolated diagnostic profile. Keep
the ordinary release free of diagnostics.json, diagnostic profiles and logs.
In the test copy only, diagnostics.json beside the executable may contain
`{"enabled":true,"port":9443}`. Launch that copy on the Windows desktop; its
existing desktop.cjs restricts the listener to 127.0.0.1 and selects an isolated
profile beside the executable. Do not point this harness at another browser.

Install Playwright as documented in ../browser/README.md, or set
FRONTIER_PLAYWRIGHT to its module location. Set FRONTIER_NATIVE_CDP if using a
different explicit loopback port. From the application source directory run:

```
node tests/native/measure1523.cjs sustained-matrix1523
node tests/native/measure1523.cjs door-cycles1523
node tests/native/measure1523.cjs imported-stress1523
node tests/native/measure1523.cjs effects-matrix1523
node tests/native/measure1523.cjs gpu-profile1523
```

Run one fixture at a time. FRONTIER_MATRIX_MS=15000 and
FRONTIER_MATRIX_SWEEP=1 select the sustained moving-camera run.
FRONTIER_DOOR_MATRIX=1 makes the 24-transfer fixture cover all six quality modes;
otherwise it uses highest Smooth throughout. Approach/passage are deliberately
shortened in that stress fixture; test normal authored doors separately. It
does not skip transitions or rewrite authored door configurations. Breathing
uses explicit runtime test settings, independent of saved user preferences.

The adapter reuses existing assertions, installs bounded test instrumentation
before reloading the existing packaged Electron page, and disconnects afterward.
Results go to test-artifacts/native-*.json. Frame intervals are actual renderer
intervals; CPU submission and asynchronous per-context GPU timings are distinct.
JavaScript heap is an estimate, not total process RAM or GPU texture allocation.
Record desktop background activity, hardware and runtime versions with results;
native measurements do not promise universal performance or macOS acceptance.

After testing, close the diagnostic copy. Retain logs as audit evidence, never
include its debug configuration/profile in a distributed package.
