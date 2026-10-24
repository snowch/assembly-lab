# Independent technical and sceptic review

Reviewer: `visual_technical`, separate from the copy, component and layout authors.
Scope: four introductory Fundamentals lessons, their shared primitive view, local course CSS,
source associations and existing simulator/compiler records. Review date: 24 October 2026.

## Source verdict

No blocking semantic finding in the reviewed changes.

- `PrimitiveOperation` derives current registers from `viewAt(trace, position)`. Initial arithmetic
  previews use `flowAt(trace, position + 1)` for the instruction's actual old sources and destination
  name, but render `?` for the destination's pending value. The computed answer is not exposed.
- The caller remains waiting until `view.stop.kind` is `returned`; preparing a result does not
  resume the caller. The existing increment facts test independently checks the initial, written
  and returned states and that the return writes no ordinary register.
- The return path is dashed, points back towards the caller and says “Return to caller”. The
  register remains in place. The local status says the return left `w0` unchanged. This distinguishes
  returning control from moving or recalculating a result.
- The view retains complete numbered C beside assembly through the unchanged shared `ListingView`.
  Teaching associations remain on C line 3; original compiler references remain in closed optional
  details. The recorded compiler source and listing are unchanged.
- Operand order, the old value of a reused register, independently starting examples and the
  sequence's carried state all agree with the model. Fresh challenge inputs and hints are unchanged;
  the new visual does not display their answers.
- The first lesson still defines registers, instructions, operands and the simulator. The next
  defines caller, argument and listing. Immediate-number syntax is explained before stepping.
  The program counter remains introduced only with the two-instruction sequence.

## Sceptic decisions

Rejected: the return arrow necessarily claims a result-copy operation. It has a distinct dashed
control treatment, an explicit return label and a nearby statement that `w0` stays unchanged.
The displayed value has one register location throughout.

Rejected: fewer visible headings remove essential instruction. Ten semantic sections and accessible
headings remain; the substantive definitions and operation rules remain visible. This is a
presentation choice to be judged additionally by the independent learner review.

Rejected: the initial unknown destination contradicts the register's current value. It is explicitly
labelled “Write after running”; the initial registers remain separately labelled before execution.
The new unknown refers to a future write, not the existing contents.

## Shared-use check

Repository search finds production `primitive-operation` definitions only in `fundamentals.ts`.
They cover all four affected lessons, including both independent subtraction/reuse figures.
The removed local source-toggle controls do not occur in sibling interactives. Shared listing
rendering and its keyboard-focusable stepping region remain unchanged. Later lessons are outside
this local CSS scope.

## Executed checks

`npx vitest run content/lessons/meet-the-machine.facts.test.ts content/lessons/fundamentals.test.ts packages/views/src/primitive.test.tsx`
completed with 3 files and 47 tests passing. This checks recorded instructions and source references,
model states, corpus membership, canonical prose and component stepped/restored/reset behaviour.
No skipped or failed cases in this focused command. It is not a full-suite or hardware execution claim.

Final built-page verification is pending the coordinating agent's stable build and preview URL.

## Final built-page check

Stable production build at `http://localhost:4324/assembly-lab/`, checked with Chromium at
375, 768 and 1280 pixels in both actual rendered themes. The tiny-function view was exercised
through initial, addition, return and reset states in all six contexts. The caller remained
waiting after the addition, resumed only after the return, and `w0` retained its prepared result.
The solid initial argument arrow and dashed labelled control-return arrow have opposite heads;
on phones the same relationship turns vertical. Screenshots were independently viewed at
375 dark and 1280 light. No page errors or page-level horizontal overflow occurred.

The phone listing measured 302 pixels client width and 588 pixels scrollable width and scrolled
locally. The paired panes fit at tablet and desktop widths (639/639 and 927/927 respectively).
No Show C or Show instructions button remained. Complete source rows and checked C-line tags
remained present. The unknown arithmetic destination and later sequence teaching are source/
focused-test checks in this review; separate lesson readers cover their built presentations.

No semantic or control-direction correction was required by this final check. This does not
claim a full-suite run, hardware test, or review of later lessons.

## Sceptic assessment of independent learner reports

Read all four final lesson-reader reports. Their mechanism and prerequisite findings are
supported by the source/model review above. Each independently checked the six width/theme
contexts and the relevant initial, stepped, restored and reset states. No blocking finding
requires a correction.

Accepted as a low-severity observation: One addition's challenge introduction “Trace a new
addition without running it” closely repeats the figure caption “A new addition to trace
without running it.” The wording is redundant. It is not a missing explanation, concealed
activity, long prose walkthrough or extra heading break. One is the short transition into
practice; the other identifies the exercise in its figure caption. The duplicated instruction
is brief and preserves the important distinction between the worked simulator and the fresh
unexecuted trace. A future copy polish may retain it once; no correction is required for this
change's learner-density objective, and it does not block the reviewed build. This decision
acknowledges the duplication rather than treating the two sentences as different facts.

Rejected as a reason to add another diagram: subtraction's repeated source values in the
register chips and pending path serve different purposes, as that reader notes. One shows the
starting machine state; the other gives those values ordered operand roles. Removing either
would reduce the information the visual carries. The later paragraphs do not need a separate
static illustration because the preceding model-derived worked figures already supply it.

## Post-check vocabulary correction

The first full check rejected the ordinary-language phrase “Carry the first result” in the
sequence challenge introduction because `carry` is a reserved later-course term. The initial
reader/technical wording pass did not identify that vocabulary-gate conflict. The coordinating
record retains the failed command separately; the focused 47-test result above was not a
whole-course vocabulary-gate run.

Independently source-checked the separately drafted replacement:
“Trace the sequence with fresh inputs. Use the first result when running the second instruction.”
It matches the simulator's sequential data dependency, introduces no new mechanism, and preserves
the distinct fresh-input exercise. The source and canonical prose contain the same replacement;
the rejected phrase is absent from both. No vocabulary exemption or weakened assertion was added.
The later sequence reader will check this sentence in the rebuilt page; the restarted full check
will establish the gate result independently of this source judgement.
