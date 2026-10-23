# Reader 09: Counting up, and the branch backwards

Module 5; course order 9 (zero based). Snapshot f1fdf35. Reviewed independently against the course-load brief; no application changes.

## Prerequisites and novelty

The learner has completed meet-the-machine through branches, in registry order. Earlier lessons teach incoming arguments in `w0`, `w1` and so on, return in `w0`, register reuse, unsigned readings and wrap, logical right shift, addition, compare/flags, unsigned and equality conditions, labels, branch syntax, taken/not-taken paths and counting executed instructions rather than listing lines. In particular, branches already asks learners to predict instruction counts and inspect paths. This is not the first instruction-count exercise.

New mechanisms are repetition by a backward branch, the loop/body/iteration vocabulary, the C `for` sequence, zero-iteration entry protection, and the relationship between a changing counter and eventual equality. `brightness >>= 1` is expanded locally; `tick++` and the `for` sequence are explained before the prediction. I found no confirmed unexplained prerequisite that independently blocks this lesson.

The first attempt asks for an executed-instruction count for a small fixed call. It combines a new backward path with familiar compare, shift, increment and conditional-branch operations. Distinguishing iterations from instructions is the learning objective, not gratuitous extra arithmetic. The equality-versus-order argument is deferred until after practical examples. No high-severity novelty finding.

## Confirmed finding

**Medium: unnecessary bit-level state enlarges the first loop-tracing task, particularly on phone.** Reproduce in a fresh context at 375 × 900, either actual theme: open “Count the instructions in a loop”. The question “How many instructions run before the function returns?” follows the paired whole-function listing and “Registers before the run”, with three complete 32-bit rows for `w0`, `w1`, `w2`. The initial prediction container measures about 1,079px high; the register subsection alone is about 248px. At 1280 the same subsection is about 172px. On phone the paired listing correctly remains in a contained horizontal scroller; initially only its C side is visible. Revealing the instruction side leaves the count question below the listing and input block. The learner must track the backward path and counter, move between the instruction listing and choices vertically, and manage the C/instruction horizontal position. The bit rows add a representation that the count question does not require.

This persists after checking: the ordinary stepper shows three full bit rows plus all four flags below the count/status. At the first taken backward branch, the useful local sentence is “bne .L3 was taken. Next: lsr w0, w0, 1 at .L3.” That sentence substantially mitigates the need to revisit the hidden instruction pane, but the bit grids still consume attention and vertical space. Evidence: `counting-up-375-light-assembly.png`, `counting-up-375-light-backwards.png`, dark counterparts, desktop counterparts; implementation `packages/views/src/interactives/CountPrediction.tsx` (`RegisterRow` for every input) and lesson stepper props in `content/lessons/counting-up.ts` (three registers, `flags: true`, no decimal mode).

Smallest direction: retain visible decimal input/current values and branch status; make the three registers’ bit patterns optional for this lesson’s prediction and walkthrough. Keep the relevant flags available for compare/branch inspection. Do not split the loop into separate opcode lessons or remove the instruction-count objective. This is a judgement about avoidable tracking cost, not measured learner failure; the measured sizes establish the interface condition, not a universal overload threshold.

## Sequence recommendations, not additional confirmed faults

A brief worked account of one backward jump before asking for the complete count could help a learner who cannot mentally replay a loop yet. However, the preceding branches lesson already practises path/count prediction, this lesson explains the C repetition first, and a checked prediction immediately opens the stepper. There is insufficient evidence to call prediction-before-walkthrough a sequencing defect here.

The initial register-to-variable map is explicit in the later investigation (“brightness arrives in w0, start in w1 and end in w2. w1 then holds the changing value of tick”). Moving or echoing this map beside the first prediction would reduce recall, but the incoming-register convention was already taught. This is an optional local aid, not a prerequisite gap.

## Keep

- The dimming operation is a previously learned shift, so repeated control flow receives the novelty budget. The motivation explains test, body, increment and the empty interval before asking for a count.
- “Its bar counts executions of the dimming operation. The stepper counts every instruction, including the tests and branches.” This explicitly separates two useful measures. The run selector and history reduce the need to hold repeated brightness values mentally.
- Equal and descending intervals are available immediately after the initial prediction. Selecting the descending call displays an initial history and an explicit no-iterations message, rather than suggesting an empty run has no instructions.
- Prediction gates work: initial stepper and run chart are locked; checking unlocks feedback and execution. The changed-branch experiment has its own independent gate. Initial compiler/answer details are optional. I found no answer disclosure before the associated meaningful attempt.
- The changed-condition experiment changes one branch while preserving the context. Construction and final result/count tasks appropriately synthesise earlier mechanisms; their number of cases is not evidence of overload.
- The explanation distinguishes why entry needs unsigned ordering while the bottom can use equality, including the largest unsigned endpoint. It develops the loop invariant only after following and constructing the run.

## Coverage and limits

Read all ten sections, model-versus-reality note, objectives, captions, challenge tasks/hint sequence/test structure and recorded original/changed programs. Read relevant CountPrediction, PredictionBox, StepperFigure and LoopFigure implementation. Used parsed earlier-lesson data to check prerequisites, especially compare-and-choose and branches.

Browser: four fresh contexts, 375 and 1280 × 900, each light and dark. Verified actual computed body colours (light background rgb(243,246,245), dark rgb(16,22,21)), not merely requested preference; document widths matched viewport widths. Inspected initial page/all sections, locked gates, a checked incorrect initial prediction, six Next actions through the first taken backward branch, Reset, descending-endpoint run selection, initial construction Run tests and first hint, checked incorrect changed-branch prediction and resulting history, “Which compiler?” and reflection “Answer” disclosures. A second fresh four-context pass measured prediction regions and inspected the phone’s horizontally revealed instruction pane. Screenshots/scripts/logs are `/tmp/course-load-review/counting-up-*`.

Did not submit a completed construction or final numeric challenge, reveal final hints/solutions, step the original run to return, or exercise persistence/restoration, alternate correct prediction choices or external GCC. Final challenge grouping and remaining hints/test coverage are source-only. No external compiler calls, rebuilds or production edits. Screenshots of feedback are review evidence only; this note deliberately omits challenge answers.
