# Module 10 implementation

The two lessons use the browser's actual C parser, AST evaluator, code generator, assembler and
A64 simulator. `from-c-to-instructions` follows a trip charge through expressions and locals;
`compile-a-loop` follows a repeated charge through the loop condition, body and update. Each
lesson has one assembly exercise and one C exercise.

The C editor's text and statement modes write the same stored source. Statement controls can
build functions, declarations, assignments, returns, conditionals and loops. The compiler reports
unsupported syntax with source positions. Compilation and execution are separate controls.
Execution first checks the C operations for the selected inputs; an invalid C operation never
produces a machine trace. A successful run compares the evaluator's result with the simulator.
Source highlights use the code generator's line map. Register displays include the registers
that appear in the generated program, including locals and temporary values added by an edit.

Compiler Explorer comparison is optional. Only its button sends a request. The disclosure,
privacy link, attribution and source-preserving client-state link appear before that button.
Successful responses are cached by source with fixed compiler and flags. Editing clears the
visible old result, and late responses are discarded if the source has changed. A failed remote
request leaves the local editor, compiler and exercises available.

The original lesson structures, prose, labels and interface strings were written by separate
implementation and drafting agents. This completion pass added the canonical review copy,
lesson and browser tests, corrected the `Prose` prop, made register selection follow generated
code, and added JSON import attributes required by the Node test runner. It does not count as
independent review of those changes.

## Evidence and checks

- `compiler/*.course.json` retains the source, generated listing and source map. The corresponding
  Compiler Explorer request and response records retain the actual GCC output and options.
- `scripts/real-tools/corpus/module10-*` covers all initial, deliberately broken and reference
  programs used by these lessons. The compiler's evidence tests cover the wider supported subset.
- `module-10.test.tsx` checks section order, mounted exercises, prediction gates, reference and
  starter verdicts, invalid C rejection, rendering, stated numerical results and corpus links.
- `module-10.prose.test.ts` checks the retained prose in both directions. Recreate the review copy
  with `node --experimental-strip-types scripts/module10-prose.mjs` after a wording change.
- `tests/educational/module-10.spec.ts` checks the built pages at desktop and phone widths,
  light and dark themes, gates, stored edits, source highlighting, stepped register values,
  invalid-run diagnostics, exercise regrading, remote comparison and statement-only construction.

Independent technical and learner review results are recorded separately. Full-course checks
and the real-tool differential must pass before publication.

Completion-pass validation: 35 lesson/facts/prose checks and 13 compiler-interface unit checks
passed. The focused browser run passed 28 cases with two desktop skips for phone-only statement
construction. It verified both complete C exercises without typing source. The first browser
pass found undersized disclosure and link targets and ambiguous select names; those controls
were corrected and the second pass passed. A subsequent unit regression confirms that a C
function named `w999` is not treated as a register, while a fifth local's w4 remains visible.
That last register-selection refinement must be included in the final rebuilt course check.

Independent review corrections:

- Preserve the simulator's stop reason when C evaluation succeeds but the instruction budget
  is exhausted. Limits and faults use the existing machine diagnostic; a returned-value
  disagreement remains a distinct failure. The 800-iteration regression reaches the machine's
  10,000-instruction limit after successful C evaluation.
- Ordinary wrong C return values omit a generic detail paragraph so the platform displays
  the failed test's inputs, actual return and expected return. A rendered-card test checks all
  three fields.
- Show the next instruction, its containing label and its mapped C line beside the step
  controls. The panel reads the actual trace and source map. On a phone, the learner can follow
  a backward branch without scrolling to the distant full listing.
- Selecting a supported statement loads its operands and operation into the statement controls.
  A preview shows the replacement. Complex lines that the controls cannot represent remain
  unchanged, with a separate drafting pass supplying the fallback explanation. Replacing a
  supported line preserves every other source line. Text and statement modes still share one
  stored source.

The focused review-fix unit run passed all 49 cases, including source selection, budget feedback,
rendered failed cards and canonical prose. Independent reviewers verify these fixes separately.
