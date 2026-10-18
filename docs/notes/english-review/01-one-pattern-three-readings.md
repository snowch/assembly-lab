# English review: Same bits, two readings

Reviewed 18 October 2026. Scope: Module 1 lesson 1 (`one-pattern-three-readings`), source and the existing built site at `http://localhost:4220/assembly-lab/#/lesson/one-pattern-three-readings`. Review only; no course changes. Read `CLAUDE.md` and `docs/style.md`. Severity: low means a local comprehension obstacle that does not prevent completing the lesson.

## Finding

1. **Low — an unexplained term in the shared simulator note.** Exact text: “An instruction can read or change registers, flags or memory.” (`packages/views/src/strings.ts:11`, within `modelNote`). The learner has definitions for registers and memory, but not processor flags. The front-page introduction mentions flags without defining them; Module 0's lesson prose does not explain them either. A learner can therefore understand the stepping rule but cannot tell what one of the named things is. Direction: keep this note within the vocabulary already taught, or provide the needed plain-English meaning before using the term. This is shared interface copy, not a defect in the lesson's explanation of signed readings.

## Prerequisite audit

The front-page “Before you start” panel (`apps/course/src/strings.ts`, `prereqs`) supplies small C functions with `int`, `unsigned`, arguments and `return`, plus binary/decimal conversion and basic arithmetic. That is sufficient for the C and number work here. No pointers, library functions, or later C features are required.

Read the sole earlier lesson, `meet-the-machine.prose.ts`, and its lesson structure/labels. Module 0 introduces GCC and a listing in `question`; registers and argument order in `prediction`; 32-bit `w` names, simulator and operands in `investigation`; the reversed `fuel_used` subtraction in `construction`; memory in `failureExperiment`; return behaviour in `investigationEnd` and `explanation`; and `-O1` in `compilerNote` and `generalisation`. These are available prerequisites, not missing explanations here. The immediate-number convention is introduced by Module 0's `#50` explanation; the new `add` is also explicitly described as adding 12.

This lesson explains hexadecimal digits and `0x`, the top bit, unsigned/signed readings and set/clear before the exercises need them. The bit-number labels make the top bit's index explicit. No unexplained prerequisite affecting the signed-reading mechanism was found. The shared note's “flags” is the exception above.

## Clean coverage

Read every string in `one-pattern-three-readings.prose.ts` and `.labels.ts`, the lesson structure, both challenge definitions and grader paths, applicable `packages/views/src/strings.ts` and `strings.module1.ts` copy, and runtime challenge/hint labels. Coverage includes all ten sections and objectives; captions; prediction questions and choices; both prediction explanations; both tasks and field labels; all five hints for each challenge; construction success note; blocked, invalid and wrong-answer feedback; the closed compiler note and reflection answer; calculation disclosure; bit-control and hexadecimal-entry labels; the simulator note and model-versus-reality paragraph.

The hexadecimal explanation has adjacent small examples. The signed-reading rule names the changed contribution and explains why the other bits agree. The cross-reference in construction identifies “Reading the bits”, so its “there” has a usable destination. The reflection refers back to readings already taught. No further material ambiguity, vague referent, missing explanatory step, idiom or unnatural wording was found. No length-only or cosmetic findings were raised. Challenge answers are deliberately omitted from this review.

## Browser evidence

Used Playwright against the existing build, without rebuilding or running the test suite. Opened the lesson at **1280 × 900** and **375 × 900**, with both **light** and **dark** preferred colour schemes. Visually inspected the four full-page captures; opened all native closed notes, including calculation and reflection. The lesson remained readable in each layout, with document width equal to viewport width in all four cases.

Evidence in the review workspace:

- `/tmp/english01-1280-light.png`
- `/tmp/english01-1280-dark.png`
- `/tmp/english01-375-light.png`
- `/tmp/english01-375-dark.png`

In the browser, submitted wrong predictions to reveal the model feedback and unlock the follow-on stepper. In all four viewport/theme combinations, submitted empty challenge work, submitted incorrect numeric work, exposed all five hints in both challenges, and triggered invalid hexadecimal-entry feedback. Feedback/hint captures are `/tmp/english01-feedback-{1280,375}-{light,dark}.png`; rendered text is saved alongside them as `.txt`. Initial and interacted full-page text are `/tmp/english01-body.txt` and `/tmp/english01-interacted.txt`. Success-note wording was read in source rather than reproducing a solved challenge in this report.
