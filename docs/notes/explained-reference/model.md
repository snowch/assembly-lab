# Computed example model and native coverage

Copyright © 2026 Christopher Snow

## Engineering implementation

`buildReferenceExample` supplies a fresh callable context for each displayed instruction: saves the return address in reserved x28, runs the example's preparation, executes its single focus instruction, then runs any continuation and returns. Each local `.L` label is namespaced when combined into the native corpus. Examples that use x28, fail to assemble, do not return, contain more than one displayed instruction or execute that instruction more than once fail explicitly.

`computeReferenceExample` locates the focus in the actual trace. `stateAfter` uses an inclusive instruction index, so the displayed before state is reconstructed at `focusIndex - 1`, and the after state at `focusIndex`. Register readings retain bigint precision and support unsigned decimal, signed decimal and hexadecimal. Flags and the next PC come from that exact step. Memory values are reconstructed from the program's initial bytes and only stores up to the relevant moment, excluding cleanup or later continuation writes. Address watches show the assembled symbol's full address separately from its memory contents. The model exposes symbolic labels and byte counts so learner-facing labels can be drafted in the UI copy file.

Computed results are cached by the immutable example object. The model does not read a lesson artifact, expected answer, reference solution or grading case.

## Generated native evidence

Regenerate with:

```
node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/real-tools/generate-explained-reference.ts
```

The generator writes every exact prepared example to `scripts/real-tools/corpus/explained-reference-examples.s`, one native call per example in the matching JSON, and every distinct rejected operand example to `scripts/real-tools/lines/explained-reference-mistakes.s`. Native calls start with clear N/Z/C/V flags, matching the browser model. The corpus compares all watched memory regions in addition to every instruction's registers, flags and PC. The coverage test regenerates these artifacts in memory and compares them byte for byte, so changing a displayed program or watched memory requires updating its native evidence.

Final authored data contains 83 mnemonic entries, 176 form groups and 275 independently prepared executable examples. Every original catalog syntax spelling remains covered. The rejected-operand fixture contains 176 distinct one-instruction counterexamples. These are parser diagnostics, not simulated execution errors.

## Verification and original attempts

- Initial focused model tests: 6 passed. They pin before/after moment selection, precise signed/full-width readings, zero-register behaviour, memory at the focus despite later writes, PC/target observations, label namespacing, reserved-register protection and explicit invalid-example failure.
- Initial combined model/coverage command: 183 passed, 1 failed. The generated memory-watch specification had become stale while the memory drafting session changed watch sizes from 4 to 8 bytes. This was an expected coverage guard finding, not a failed arithmetic result. Regenerated only after the family authors confirmed their final inputs and programs were stable. The original failing command remains a failure.
- First native corpus before the final added shift scenarios: 259 calls, 1,988 instruction states, zero differences. This does not cover the later 16 shift variants.
- Final model and coverage command: 2 files, 184 tests passed. It checks all browser mnemonic entries, every original syntax spelling, non-empty named forms/rules/examples, actual execution, expected parser error keys and exact native-artifact synchronisation.
- Final GNU/QEMU command: `AL_TOOLS=/workspace/native-tools node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/real-tools/check.mjs --corpus --only explained-reference-examples` passed: 1 program, 275 calls, 2,143 instruction states compared, zero differences. Log: `/tmp/explained-reference-final-native.log`.
- Final grammar comparison command: `AL_TOOLS=/workspace/native-tools node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/real-tools/check.mjs --lines --only explained-reference-mistakes` passed. This runner's lines mode checked all 15 files, 39,675 lines, including the new rejected examples; 184 were outside the browser subset, zero acceptance disagreements. Log: `/tmp/explained-reference-final-lines.log`.

These checks establish the observed program and diagnostic behaviour. They do not establish learning effectiveness, every arbitrary operand combination or all production processor behaviours. Independent content and browser reviews remain separate requirements.

Final integrated TypeScript check passed (exit 0).
