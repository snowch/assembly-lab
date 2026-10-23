# Counting up: independent learner/checker review

Copyright © 2026 Christopher Snow

23 October 2026. Bounded independent review of the final production preview at `http://127.0.0.1:4322/assembly-lab/#/lesson/counting-up`. No application edit, build, external compiler request or challenge solution submission.

## Verdict

**The accepted medium finding about unnecessary bit-level state in the first loop-count prediction and walkthrough is resolved in the checked states.** “Registers before the run” now shows three decimal values and “Show the bits”. After commitment, the stepper also defaults to decimal registers. The changing counter, brightness, endpoint, four flags, instruction count and branch status remain available. Opening the bits preserves the numeric values and execution state. This implements the proposed reduction in competing representations; it does not establish a universal overload threshold or measured improvement in novice performance.

No new confirmed blocker or prerequisite finding in this bounded pass. Retain the decimal default and optional inspection. Keep the instruction-count objective and the local distinction between iterations and instructions.

## Evidence and states

Four fresh Chromium contexts: 375×900 and 1280×900, light and dark. Actual html theme and body background were checked: light `rgb(243, 246, 245)`, dark `rgb(16, 22, 21)`. Initial and final document overflow measurements were zero in all four contexts; no page errors occurred.

In each context inspected the initial prediction, opened and closed its bits, selected an option without commitment, committed an incorrect prediction, and stepped six instructions through the first taken backward branch. Selection alone left the stepper locked and exposed no outcome. Initial prediction text contained inputs and choices rather than a worked result. The separate run chart was initially locked. The first execution state correctly began at zero instructions with the starting inputs.

At the backward branch the local status reads “bne .L3 was taken. Next: lsr w0, w0, 1 at .L3.” The current tick, unchanged endpoint, brightness, flags and count remain together below the controls. Opened the stepper bits at that state, used Back to return to the comparison, then Reset. Back reduced the instruction count and restored the preceding instruction/next marker. Reset restored the input values, zero count and initial flags; the learner's open bit-inspection preference remained open. Hiding the bits returned to the same initial decimal state. No stale backward-branch status remained.

Viewed representative phone dark decimal and desktop light bit-inspection screenshots. The phone paired listing remains horizontally contained: its initially visible C pane does not place both panes on screen simultaneously, while the branch sentence provides the next operation locally. This is an existing interaction, not a new overflow finding.

Evidence: `/tmp/check09.cjs`, `/tmp/check09-results.json`, `/tmp/check09-{width}-{theme}-initial.txt` and screenshots ending `initial.png`, `inputbits.png`, `backward.png`, `backwardbits.png`. The first harness used the mistaken control name “Show bits”, then was stopped and corrected to the actual “Show the bits”; the completed harness covered all four contexts. This was a harness error, not a product finding.

## Prerequisites and source checks

Read AGENTS.md/CLAUDE.md, the front-page entry requirements, all ten rendered sections and the lesson prose, captions, objectives, model-versus-reality note, challenge definitions and recorded loop programs. Checked the relevant earlier branches, compare-and-choose and shifts prose, and the prediction, stepper, trace, branch-status and loop-figure implementations.

The entry panel already assumes small C functions with `for`/`while`, unsigned arguments and return, plus binary/decimal conversion. Earlier lessons teach register arguments/results, register reuse, unsigned interpretation, shifts, addition, compare/flags, equality and unsigned conditions, labels, branch spellings and counting executed instructions including return. Branches explicitly defines taken/not taken and states that labels do not execute. Here “loop”, “body” and “iteration” are defined locally before prediction; the `for` order, `tick++` and compound shift assignment are explained. No confirmed missing external prerequisite arose from these checks.

`CountPrediction` obtains the count from `traceOf(...).result.steps.length` only through the committed prediction measurement. Its optional bits show the call's input values. `StepperFigure` obtains state from the assembled program's simulator trace; branch status reads the recorded branch outcome and next program counter. Decimal and bit views use the same state. Flags and count are independent of the bit toggle. The loop chart is gated by the committed prediction. The model-versus-reality note correctly limits counts to this listing and distinguishes a trace limit from proof of termination.

## Limits

The initial changed-branch prediction and both construction tasks were read, not solved. Its initial input presentation still uses full bit rows; the accepted first-prediction/walkthrough change does not constitute a course-wide decimal conversion. No independent new severity is assigned to that later state in this bounded review.

Did not run to final return, submit assembly or numeric challenge answers, open the final hint ladder/solutions, test every endpoint or all keyboard paths, test persistence/restoration, or call GCC. Later experiment outcomes and challenge grading were source-reviewed only. The evidence supports the stated representative states, not an exhaustive accessibility, learning-outcome or whole-course verdict. No full-suite result is claimed.
