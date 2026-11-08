# Focus the register-arithmetic lesson

The user accepted removing the standalone “C arithmetic has type rules” section from Module 1’s “Arithmetic on register bits”. Keep the meaningful example and closing return-zero application. The detailed C limits/undefined-behaviour/compiler treatment already exists in Module 11. No boundary explorer is added to this lesson.

## Checked teaching facts

- The recorded trip functions and independent calls [3,5] are unchanged. They produce matching 32-bit words. The signed reading expresses a trip overrun; the unsigned reading is a large positive value after wrapping. Neither function checks the overrun. Model-derived diagrams, contribution table/sums, gates and persistence remain.
- Earlier Module 1 content teaches bit weights and two readings; the preceding four-bit lesson teaches retained result bits and subtraction. Outcome here: choose a returned-distance meaning and an appropriate check, not explain general C overflow rules.
- `COPY.arithmeticBits.boundsTitle/bounds` form the standalone section in `pacing-1-4.ts`. Remove those unused copy fields and their canonical JSON entries. Put retained `contract` prose with the closing practical question rather than leaving an empty section or replacement heading.
- `CALL_COMPARISON_STRINGS.signedRange` currently mentions signed overflow in the result card. Simplify to a case-local statement that this negative result is valid/fits int. `unsignedMeaning` must explain wrapping locally once the broad rules section disappears, while retaining that the large result does not express an overrun and may be legitimate elsewhere. Keep the no-type-tag/no-automatic-warning qualifications.
- The published lesson currently introduces overflow, undefined behaviour and wrap. Keep only wrap here. `COPY.addition.explanation` already defines signed overflow in the first Module 2 addition page: move that introduction metadata there. Module 8’s published products page already defines undefined behaviour in its motivation before division uses it: move that introduction metadata there. Do not invent term exemptions or silently move the detailed rules into earlier pages. The legacy source lesson metadata remains historical and its source-level checks remain valid.
- Module 11 already has a direct A64 boundary prediction plus recorded C compiler examples and safe-increment exercises. This task simplifies Module 1; preserve that existing later treatment.

## Prose and review brief

Follow docs/style.md: direct British English; no new jargon, extra ranges, quizzes or controls. Retain the closing question and its gated reasoning. No new numbers: all displayed results still come from the model. Synchronise exact canonical prose records; retain historical validation notes as history.

Evidence: compare lesson structure before/after; verify both calls and their bit/reading calculations, hidden/committed/run/reset/restored states, visible wrap explanation, and closing contract/question/answer ordering. Inspect the built lesson at phone/desktop in light/dark. Check vocabulary homes/term gate across published and source lessons, and canonical snapshots. Separate prose draft and independent learner/technical review follow. No novice study is claimed.
