# Opening: first arithmetic applications

23 October 2026. Separate Codex drafting/implementation session from the managing session's checked fact brief; no model/effort substitution requested. Independent review belongs to the managing implementation record.

## Checked brief

The source of arithmetic and register effects is `packages/machine/src/run.ts`, exposed by `traceOf`, `viewAt`, `wValue` and `flowAt`. `add`/`sub` read their source state before the destination write. The first operand names the destination, the next two supply inputs, and a register may be read then overwritten. A register not written retains its value. `w` instructions select 32 bits. Later instructions read the state left by earlier instructions. AAPCS argument/result conventions and return are taught before the full function, not prerequisites for the primitive activity.

Five course-written arithmetic prefixes are in `meet-the-machine.primitives.ts` and the real-tool corpus `module0-primitives.s/.json`. The view inspects only the arithmetic prefix; a trailing `ret` belongs to the model/tool execution wrapper. Each activity explicitly stops after the displayed instructions. No C or compiler attribution is invented for these assembly-only examples.

## Draft and implementation

The opening now asks about one operation. Its motivation defines register/instruction/operand and mounts a single stage-at-a-time activity: worked distinct-destination addition; different-destination/value prediction; read-before-write prediction; subtraction prediction; two-instruction sequence. Each prediction permits one committed answer, then shows the model result, including incorrect answers. Later stages/results are absent until reached. Reset returns to the worked example. Committed stage/step/prediction persists through the platform lesson store.

All values, read/write relationships, current marker positions and result explanations derive from the simulator trace. The compact flow labels each input and destination; the reuse explanation identifies the old value before write. Normal decimal values are sufficient for this activity. The complete C-derived listing then appears with locally taught argument/result and return conventions, followed by the existing `predict-total` gate and whole-function walkthrough. Its redundant first-step operand diagram and repeated next-register question are removed from this synthesis view; current/next status, write outlines and optional bits remain. Existing challenge/prediction ids, reference solutions and missing-return experiment are preserved.

Copy was drafted from the checked brief in this separate session, edited against both style closing passes, and synchronised to `docs/notes/module-0/prose.md`. The ordinary phrase “carry out” was corrected to “perform” because the course's term gate reserves carry for flags.

## Verification

- Focused Vitest: `primitive.test.tsx`, `meet-the-machine.prose.test.ts`, `meet-the-machine.facts.test.ts`: 46 tests passed, including hidden results, wrong prediction feedback, restored committed state, source-before-write, subtraction, sequence marker/state and reset.
- Initial focused run: 1 failure from test harness using nonexistent `store.write`; corrected to `setSlot` within `act`. Subsequent focused runs passed. No product fault was masked by that change.
- Every new arithmetic prefix/call is pinned to the real-tool corpus by the facts test.
- Attempted differential command `scripts/real-tools/check.mjs --corpus --only module0-primitives` stopped with exit 2 because `aarch64-linux-gnu-as` was unavailable in this session's PATH. Managing session must rerun after tool setup; no QEMU agreement claimed here.
- Educational spec now exercises the stage sequence, independent prediction, wrong-feedback/reload, reset, both themes and later whole-function synthesis. Built execution and independent browser checks are pending the managing session's final build. No standalone app rebuild was run by this agent.

## Independent source-review follow-up

A source reviewer found that wrong-answer feedback asked learners to compare their prediction with the result after the input had disappeared. The activity now displays the exact committed prediction under the existing separately drafted “Your prediction” label. The result and prediction both persist after reload. The persistence unit test now unmounts the component, creates a new LessonStore from the same storage, and mounts a new component; it no longer merely rerenders the existing instance. The browser reload test also asserts the submitted wrong value remains visible.
