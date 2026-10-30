# Shared view tests and published challenge ownership

Scope: `packages/views/src/*.test.ts(x)`, excluding the separately owned Module 3 test pair and pacing component regressions. No components, model source, configuration or canonical lesson records were edited in this pass.

`AssemblyEditor.addressing.test.tsx` and `AssemblyEditor.calls.test.tsx` previously selected all challenges from canonical whole-lesson exports. They now select the published `LESSONS`, grouping split units through `pacingOrigins`, and pass each challenge's actual owning lesson to the editor. An explicit challenge-ID inventory retains all four addressing and all four calling/recursion exercises. The touch-editor reconstruction, reference comparison, grader and editor-mode round-trip assertions remain intact.

Other direct content imports in this scope are executable listing/example records used to test figures and model behaviour. They remain canonical records; they do not select page or challenge ownership.

## Original full-suite result

The root command `npm test` is recorded in `/tmp/pacing-unit-all.log`: exit status 1, 7 failed and 159 passed test files; 33 failed and 2943 passed tests (2976 total), 353.70 seconds. Its view failures are confined to the separately owned Module 3 test pair. This original failure remains recorded independently of later reruns.

## Additional scoped verification

The assigned views command, started before these two editor files were changed, is recorded in `/tmp/pacing-shared-tests-original.log`:

```sh
npm test -- packages/views/src --exclude '**/module3.test.tsx' --exclude '**/module3.rework.test.tsx' --exclude '**/RegisterReader.pacing.test.tsx' --exclude '**/Products.pacing.test.tsx'
```

Result: exit status 0; 64 files passed, all 653 tests passed; 187.71 seconds. Because the suite schedules files while running, this command is a scoped verification run, not an immutable pre-edit baseline.

The focused post-edit command is recorded separately in `/tmp/pacing-shared-editor-rerun.log`:

```sh
npm test -- packages/views/src/AssemblyEditor.addressing.test.tsx packages/views/src/AssemblyEditor.calls.test.tsx
```

Focused result: exit status 0; 2 files passed, all 10 tests passed; 61.18 seconds. No build or browser review was run in this test-only pass.
