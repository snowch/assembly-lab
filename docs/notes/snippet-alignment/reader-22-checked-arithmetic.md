# Reader 22: Conversions and checked arithmetic

Copyright © 2026 Christopher Snow

18 October 2026. Independent learner review of the immutable preview at
`http://127.0.0.1:4267/assembly-lab/#/lesson/checked-arithmetic`.
Read `CLAUDE.md`, `docs/style.md` and this workstream's brief. Scope: the C/instruction
alignment changes, with knowledge limited to Before you start and lessons 00–21.

## Result

No material new finding in the displayed C/instruction pairs. No change requested.
The following observations are checked behaviour, not proposed findings:

- The introductory comparison retains both complete four-line C functions, labels,
  instruction order and the marked differing instructions. Its caption remains
  “Compare the recorded signed-byte and unsigned-byte conversions.” At phone width
  each C operation stays with its instructions; the two functions stack vertically.
- In the promoted-input stepper, `sxtb w0, w0` is paired with C line 1,
  `int promoted_gradient(signed char gradient)`. After stepping it, that parameter
  line is highlighted. The subsequent addition and return highlight line 3,
  `return gradient + 1;`. This connects the width conversion to the parameter
  without presenting the function's closing brace as the arithmetic operation.
- The optional “Compiler's C line references” retains the promoted-input raw
  references 2, 4, 4. Its explanation says: “These are the compiler's original line
  references. They may point to a brace instead of the C operation an instruction
  carries out.” The distinction from the teaching association is visible.
- Narrowing and mixed-comparison return instructions remain attached to their
  return expressions, with “Returns to the code that called this function.”
  The C highlight follows the instruction just run; the triangle identifies the
  next instruction. Back and Reset restore the earlier states.
- The wrong-overflow example remains assembly-only. It acquires neither an invented
  C column nor compiler references.
- All displayed mapped functions use an inline complete source layout. There is no
  separate “Complete C source” disclosure because their full source is already
  present, and no instruction in these displayed examples maps to multiple C
  statements. A multiple-source explanatory note is therefore not exercised here.

The checked-add C block appears under “Return a checked-add result and its status”,
but this preview does not mount the recorded `CHECKED_TRIP` C/instruction pair.
The lesson data imports its assembly-only exercise reference, not that recorded
pair; the recorded pair remains in `c-boundaries.listings.ts` and its tests.
Consequently this report does **not** claim browser verification of checked-add
return mapping. This is a coverage limitation, not a new request to reveal a
challenge solution. No challenge solution is included in this report.

## Previous finding, kept separate

The prior clarity report's low-severity L18 is unchanged and is not counted again:
“GCC normally allows recovery after many reports; `-fno-sanitize-recover=undefined`
makes a detected problem terminate the run.” Its direction remains to explain
whether recovery continues execution and whether it repairs the operation.
This concern is unrelated to snippet alignment.

## Assumed knowledge

No new untaught dependency found in the changed snippet presentation. Basic C
functions, arguments and return statements come from the starting panel. Widths,
casts and sign extension were taught earlier: `loading-widths.prose.ts` says
“`sxtb w0, w0` takes the low byte and sign-extends it to 32 bits.” Its cast explanation
says “A C **cast** requests a conversion”. Boolean results and comparison conditions
come from `compare-and-choose`; compiler settings and C23 are explained in lesson
21. This lesson defines integer promotion, `_Bool`, checked arithmetic and the
separate stored-result/returned-report roles locally. L18 above remains the prior
exception concerning sanitizer vocabulary.

## Actual browser checks and evidence

Used installed Playwright and Chromium, not a simulated DOM, at **375 × 900** and
**1280 × 900**, each in light and dark themes. In each of those four combinations:

- Started with a fresh browser context and confirmed no runnable stepper before
  prediction submission. Selected an offered option and pressed “Check your
  prediction” for each prediction. No storage seed or gate bypass was used.
- Advanced `step-narrow-gradient`, `step-promoted-gradient`, `step-mixed-limit` and
  `step-wrong-overflow` through every instruction to their disabled-Next end state.
  Used Back and Reset on each. Opened the compiler-reference disclosure on each
  mapped stepper, then closed it.
- Captured initial, first-instruction and final screenshots and recorded source
  highlights and geometry. With the listing at the viewport top, the maximum
  listing height was 495 px on the phone and 394.79 px on desktop. The corresponding
  maximum Next-button bottom was below 556 px and 455 px respectively. The current
  pair and control therefore fit together in the 900 px viewport. No requirement
  was imposed that every duplicated source row remain visible.
- Document width equalled viewport width in all four cases; no page exception was
  emitted. This was a focused review, not a full test suite or arbitrary editor
  exercise.

Screenshots actually opened for visual inspection:

- `/tmp/reader22/375-light-comparison.png`
- `/tmp/reader22/1280-light-comparison.png`
- `/tmp/reader22/375-light-step-promoted-gradient-1.png`
- `/tmp/reader22/375-dark-step-promoted-gradient-1.png`
- `/tmp/reader22/1280-dark-step-promoted-gradient-1.png`
- `/tmp/reader22/375-dark-compiler-records.png`
- `/tmp/reader22/375-light-step-wrong-overflow-1.png`
- `/tmp/reader22/1280-light-step-mixed-limit-3.png`

Additional screenshots cover the same stepper states in all four configurations.
Evidence directory: `/tmp/reader22/`. Geometry and highlight observations:
`/tmp/reader22/checks.json`. Browser driver: `/tmp/reader22-matrix.cjs`.
The comparison's visual difference marking was inspected in the screenshots;
the JSON's empty `comparisonMarks` field used a nonmatching selector and is not
used as evidence about that marking.
