# Comparison and count wording: checked facts

The user requests fixing the comparison/count wording, merging, verifying live, and clarifying the call action: two typed C functions have matching machine instructions but a single shared bit display.

- `ListingCompare.tsx` compares assembled instructions and calls `traceOf` independently for each recording with the same arguments. It combines identical returned w0 bits into one view; it does not show a step-by-step execution. Preserve both calls, the model-based equality check, mismatch rendering, saved/reset states and prediction gates.
- Current Module 1 arithmetic lesson uses independently compiled `trip_remaining` / `trip_remaining_u`, arguments [3, 5]. Their parameter and return types differ; the assembled instruction sequences match. Do not call the C functions identical or suggest sub and ret are the same instruction.
- `VIEW_STRINGS.compare.allSame` currently says `All ${n} instructions are the same.` It is shared by two comparison views; remove the misleading count.
- `BRANCH_STRINGS.count.ran(n)` and `MODULE0_STRINGS.args.caption(count)` use plural nouns unconditionally. Support one and multiple instructions/arguments without changing the computed counts.
- Platform challenge feedback uses `All {total} tests passed` and `{passed} of {total} tests passed`. The course has single-case exercises. `apps/course/src/runtime-strings.ts` already overrides the shared runtime's strings through its supported `Strings` interface. Use that interface for grammatical count-neutral course feedback; leave the pinned platform unchanged.
- Source files for the interaction copy: `packages/views/src/strings.call-comparison.ts`, `content/lessons/pacing-1-4.copy.ts`; find their canonical prose records and sync exact current text. Historical validation notes stay historical.

Outcome: the reader can distinguish matching instruction sequences, two independent simulated calls, one shared result-bit display, and the two C readings. Existing prerequisites suffice; no new model, teaching activity or controls needed. Read docs/style.md and maintain British English, direct language and existing prediction/result gates. Canonical prose records must match updated text. Independent learner and technical review and built-site verification follow drafting.
