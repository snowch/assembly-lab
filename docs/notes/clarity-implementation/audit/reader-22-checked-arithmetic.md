# Independent learner review: 22 checked-arithmetic

Reviewed the current built lesson at http://localhost:4290/assembly-lab/#/lesson/checked-arithmetic. Read CLAUDE.md, docs/style.md, docs/authoring.md, the front-page prerequisites, the complete target prose/labels/structure (including all hints, options, explanations and model note), relevant shared prediction/listing strings, and prerequisite material identified below. No prior review notes read. Repository unchanged.

## Coverage

Chromium, widths 375 and 1280, light and dark, fresh context in each configuration. Captured whole pages and inspected the prediction/feedback screenshots in all four configurations. Committed the first narrowing prediction and used its revealed stepper once in each. Opened the first construction hint. Checked page overflow: scroll width equalled viewport width in all four. Initial and committed page text saved under /tmp/course22-*.txt; screenshots /tmp/course22-{375,1280}-{light,dark}.png and corresponding -interaction.png. Reviewed source for later explanations, options and hints; did not solve challenges or exhaust every stepper/input.

Prerequisite review was targeted to the lesson's dependencies, rather than a second browser review of all earlier chapters: complete immediately preceding c-and-overflow prose; loading-widths; relevant meet-the-machine, one-pattern-three-readings, compare-and-choose, memory-and-addresses prose; searches of the remaining earlier prose to locate defined vocabulary.

## Findings

### 22-A — Low: input-state register remains visually unlabelled after the prediction has run

Exact visible text/state: the prediction continues to display `w0` and `200` above the question, after its feedback begins “The simulator ran the program.” The question is “What bit pattern does this recorded function return in `w0`?” The feedback identifies a different final bit pattern. These are intentionally different moments, but the initial-register diagram has no visible moment label.

Location: packages/views/src/interactives/RunPrediction.tsx:125 (group has only an aria-label, followed by the unchanged input RegisterRow at line130); packages/views/src/strings.arith.ts:111 defines that accessible label as “Registers before the run”. Lesson mounting: content/lessons/checked-arithmetic.ts:74.

Setup: fresh visit; select any prediction option; press Check your prediction. Observed at both widths/themes. See /tmp/course22-1280-light-interaction.png and /tmp/course22-375-light-interaction.png. The setup sentence before the figure does correctly identify the input; the issue arises after commit when the static input graphic and final feedback are presented together.

Learner effect: the learner must infer that the bit diagram is still the function-entry state while the text describes the completed state. It can look as if the register did not change despite the recorded result. This is the same execution-moment distinction that prompted the recent Module0 clarification.

Direction: visibly label the retained input diagram's execution moment, using the meaning already supplied to assistive technology. Preserve it as input rather than changing its pedagogical role.

### 22-B — Low: prediction cards still carry the stepping badge

Exact visible text: “STEPPED” above “Predict the returned bits after narrowing the gradient.” A second “STEPPED” appears above “Predict the overflow report from the wrong flag.” Both cards ask the learner to choose and check a prediction; actual stepping follows in a separate gated figure.

Locations: content/lessons/checked-arithmetic.ts:74 and :154; both prediction interactive records have timeModel steps and no prediction role. Compare the explicit role on the already clarified Module0 prediction at content/lessons/meet-the-machine.ts:117. Shared visible badge string: packages/views/src/strings.ts:13.

State/setup: fresh visit, before either prediction is committed, all four viewport/theme configurations. Captured initial full-page screenshots/text. The opened compiler-reference disclosure in later -badge screenshots is unrelated and is not evidence of opening the outer badge's model note.

Learner effect: the figure label describes an implementation capability instead of the learner's immediate activity, and makes the prediction resemble the separate stepper. It retains the guidance-placement inconsistency raised by the user.

Direction: apply the existing prediction role to these two prediction cards, keeping stepping guidance with their actual steppers. Consolidate with the same shared pattern elsewhere rather than treating this as a lesson-specific redesign.

## Assumed knowledge

No additional unsupported knowledge found in this scoped reading. Evidence before this lesson:

- Module0 defines instructions/registers and explains GCC and -O1.
- one-pattern-three-readings defines signed/unsigned readings and hexadecimal.
- memory-and-addresses.prose.ts:8 defines pointers, and :17 defines little-endian order.
- loading-widths.prose.ts:14 defines sign extension; :47 explains cast syntax; :50 explains implementation-defined signed conversion and what a signal means; :52 explains unsigned conversion wrapping.
- subtracting-and-the-tick-counter.prose.ts:83 defines modulo as a remainder.
- Immediately preceding c-and-overflow.prose.ts:9 explains -std=c23 and the cited draft; :11 explains INT_MAX, the header/include mechanism and undefined behaviour.
- The target itself explains integer promotion, mixed conversion, printf/format strings, _Bool/boolean reports, and sanitizer at first use.

The two predictions themselves specify their relevant moment through “return”, and the surrounding text supplies their inputs. I found no need to rewrite those questions merely to add “after” again. The final task distinguishes the memory destination from the returned status and explicitly requires the store before w0 is replaced.
