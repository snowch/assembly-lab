# Second clarity review: Constants and widths

Reviewed 18 October 2026 against the built preview at `http://127.0.0.1:4253/assembly-lab/#/lesson/constants-and-widths`. Review only; no learner-facing text changed.

## Result

No new lesson-specific clarity findings. The instruction-width explanation gives the reason that some constants need more than one instruction. The sufficient rule is explicitly qualified, and the following assembler figure lets the learner check cases outside it. The `movk` example and division-with-remainder explanation connect the register picture to the calculation. The later distinction between `w` and `x` names identifies both the shared register and the effect of writing its lower half.

I formed this assessment from the current prose and prerequisite lessons before consulting the earlier report. This is a clean result for the lesson's own explanations, with the existing shared-note issue below still outstanding.

## Reconciliation with the first review

- **E02-1 remains rejected as a substantive finding.** The first build hint at `content/lessons/constants-and-widths.prose.ts:53` says, “One `mov` holds a number whose bits fall in one 16-bit half.” The earlier motivation explicitly says, “A single `mov` can load a constant whose set bits all fall in one 16-bit half. Some other patterns load too, so this is not the complete rule.” The prediction and caption repeat the set-bit criterion before this hint. Adding the omitted word would be harmless precision, but this reading did not reveal a new misunderstanding requiring that issue to be reopened. See [earlier reader](../english-review/02-constants-and-widths.md) and [earlier rejected findings](../english-review/README.md#findings-not-retained).
- **Existing shared L4 remains present; count it once across the course.** At `packages/views/src/strings.ts:11`, the simulator note says, “An instruction can read or change registers, flags or memory.” Its use of “flags” precedes the first explanation of flags in Module 2. Neither of the preceding lessons defines the term. Severity remains **low**: the learner can follow this lesson's register examples, but the general note includes an unexplained part of the processor. Direction: give a minimal identification where it first appears or use already introduced vocabulary. This is the existing [L4](../english-review/README.md), not a new finding.

## Prerequisites and assumed knowledge

Read `CLAUDE.md`, both closing passes in `docs/style.md`, and the [review brief](brief.md). Checked the front-page prerequisite strings and both preceding lessons in full. Module 0 defines instructions, assembly, listing, register, operands, memory and the simulator, and explains GCC and `-O1`. The previous lesson supplies hexadecimal, `0x`, bit weights, signed and unsigned readings, and “set” and “clear”.

This lesson explains its additional C syntax (`void`, `long`, and the unsigned suffix), assembling, constant, upper and lower halves, remainder, optional `#`, `movk`, the effect of `lsl 16` here, and the relationship between `w` and `x` names. No additional unexplained prerequisite was found beyond shared L4. Understanding the full shift-instruction family is unnecessary for the specifically explained `movk` syntax.

## Text and interaction coverage

Read the complete prose, labels and lesson configuration, including all ten sections, objectives, captions, prediction choices and explanations, both challenge tasks, all ten hints, field labels, the construction success note, optional notes, reflection answer and model-versus-reality note. Also read the relevant shared strings in `packages/views/src/strings.ts`, `strings.module1.ts`, the lesson runtime strings and the assembler messages; checked the grader's displayed feedback paths.

Used Playwright with fresh pages at **1280 × 900** and **375 × 900**, each in light and dark themes. In every configuration:

- Opened the closed notes and read the rendered text.
- Submitted both predictions, including an incorrect width prediction, to reveal the gated figures.
- Tried empty, invalid, refused and accepted input in the constant tester.
- Ran the construction challenge's unassemblable starting program and the answer challenge with empty fields.
- Revealed all five hints for each challenge.
- Submitted incorrect whole-number answers to the answer challenge, then completed both challenges and read their success states.
- Revealed the learner-solution figure and advanced each available stepper through its final instruction.
- Inspected the construction figure screenshot in all four configurations; the phone layout stacks the labelled upper and lower halves, preserving their meaning.

This was not an exhaustive test of arbitrary assembly diagnostics or every input, nor a full regression test run. No separate claim is made about every editor mode.

## Evidence

Temporary browser evidence, outside the repository:

- `/tmp/clarity2-02.mjs`: browser interaction script for this preview.
- `/tmp/clarity2-02-{1280,375}-{light,dark}-wrong.txt`: rendered wrong-answer state and hints.
- `/tmp/clarity2-02-{1280,375}-{light,dark}-revealed.txt` and matching `.png`: completed page states.
- `/tmp/clarity2-02-{1280,375}-{light,dark}-figure.png`: inspected construction figures.
- `/tmp/clarity2-02-{1280,375}-{light,dark}-tester-{empty,hello,1000000,65536}.txt`: the four tester response types.

These evidence files contain ordinary revealed lesson content. Challenge answers are deliberately omitted from this report.
