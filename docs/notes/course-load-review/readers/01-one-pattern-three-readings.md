# Same bits, two readings

- Module 1, first lesson; course position 1 after Module 0 (zero-based inventory position). Route: `one-pattern-three-readings`.
- Review scope: all ten sections, the lesson data/prose/labels and recorded programs, `StepperFigure`, `RegisterReader`, `ListingCompare`, `BitToggles`, `AnswerEditor`, and the challenge runner. No production changes.
- Overall: no high-severity overload found. The first task deliberately reuses a familiar subtraction, and the lesson develops one central relationship: a pattern stays fixed while its reading changes. The most credible avoidable cost is moving between the experiment and the first construction. The investigation has a staging opportunity, rather than evidence that its content must become separate lessons.

## Learner baseline and novelty

Entry knowledge, checked in `apps/course/src/strings.ts:33`: small C functions with `int`, `unsigned` and `return`, basic arithmetic, and binary-to-decimal conversion in both directions. Assembly experience is explicitly unnecessary. Earlier knowledge is only “Meet the machine”, read from `/tmp/course-load-review/lessons.json`: registers, arguments in `w0` onward, result in `w0`, operand order, `add`, `sub`, immediate numbers, `ret`, stepping/reset, the C/instruction relationship, 32-bit `w` views, and optional bit displays. GCC and the `-O1` setting have already been introduced. Reading a full two-instruction function is therefore familiar work, not a new mechanism.

New mechanisms: hexadecimal groups/digits and `0x`; signed versus unsigned readings; the negative contribution of the top bit in the signed reading; 32-bit arithmetic discarding a bit beyond the width; equivalence of the particular signed/unsigned subtraction listings; setting/clearing bits and entering their hexadecimal representation. The reader must combine hexadecimal decoding with signed weighting by the closing exercise. No confirmed essential prerequisite gap found: binary weighting is an explicit entry requirement, and hexadecimal and signed weighting are taught locally. The opening labels “Register numbers shown in unsigned decimal” and “Signed reading (C int)” precede their prose definitions, but the paired concrete result and immediately following motivation explain them; I do not treat those labels as a separate new-mechanism burden.

## Confirmed local finding

### Low — experiment-to-construction switching is unusually expensive on a phone

Exact direction: “The figure in \"Reading the bits\" shows both readings of any bits you change there.” (`content/lessons/one-pattern-three-readings.prose.ts:35`). The construction asks: “Set `w0`'s bits so that its signed reading is −1, then give the unsigned reading of the same bits.” (`:40`; no answer recorded here).

Reproduction: at 375px, reach “Make −1” in a fresh context. Its own bit buttons/hexadecimal input and unsigned answer box occupy most of the viewport. The preceding experiment has independent state and is outside this viewport. If following the offered experimental support, the learner changes the earlier register, reads its result, then scrolls back and reproduces the chosen pattern in a second register before entering the number. The experiment neither shares the construction's bits nor travels beside it (`RegisterReader.tsx` local `useState`; `AnswerEditor.tsx` challenge field state). This is confirmed navigation and state-transfer work, not a claim that the mathematics is unsolvable. It is smaller on desktop, where both controls still remain separate figures.

Competing tasks: retain the top-bit rule, decide a pattern, remember/transcribe that pattern and its decimal reading, and distinguish two independent `w0` controls. The challenge's lack of a live numerical answer is appropriate; it should not reveal its own solution.

Smallest direction: preserve independent grading, but make the optional scratch experiment reachable next to the construction, or allow carrying the learner's own experimental pattern into the editable challenge. Avoid automatically showing the challenge's signed/unsigned answer. This is a local convenience improvement, not grounds to split the lesson.

Evidence: `/tmp/course-load-review/one-pattern-three-readings-375-light-reader.png`, `…-375-light-challenge.png`, and corresponding dark/1280 screenshots. The failed blank attempt and first hint were exercised; neither makes the preceding experiment local.

## Design recommendation, not a confirmed overload finding

The “Reading the bits” section introduces hexadecimal grouping, the prefix, bit numbering/top bit, signed weighting, agreement when the top bit is clear, and set/clear vocabulary before its first manipulation (`one-pattern-three-readings.prose.ts:23–32`). The exact instruction is “Set or clear any bit, or press \"Clear bits\" to start from zero.” That open exploration follows a full worked 32-bit pattern.

Consider a brief, directed rehearsal of one four-bit group before asking the learner to inspect the top bit's signed contribution. This would separate notation decoding from the new reading rule without changing the lesson's central example or adding another opcode lesson. Severity if adopted: medium teaching-sequence opportunity; there is insufficient evidence to call it a blocked reasonable attempt. Binary weighting is already known, digits are explicitly mapped under the bits, and the existing reader makes the top-bit difference visible. Counting paragraphs, terms or controls alone would overstate this finding.

## Treatments worth keeping

- The first action is simply “Press Next”, running a familiar wrong-way subtraction with only two argument registers. Inputs and temporal state are labelled. After execution, “Read … → wrote …” preserves source values even though the destination is overwritten. This removes mental bookkeeping.
- “Adding 12” is a legitimate prediction before the width rule is fully explained. A wrong guess commits successfully, exposes explanatory feedback, and unlocks the matching stepper. It is a small diagnostic experiment, not a prerequisite failure. No solution is available in that stepper before commitment.
- The reader groups four bits per hexadecimal digit and keeps the two results beside a “Top bit (bit 31)” / “Other 31 bits” decomposition. At 375px the bits wrap by byte while digits stay attached to their groups; the result table remains readable in both themes. Full arithmetic is behind “Show calculation”, so dozens of terms are not part of the default task.
- Clearing the experiment and toggling its top bit immediately recomputes the same views. This supports isolating one mechanism without learning another editor.
- Compiler comparison initially exposes the two C functions but gates the instruction comparison. After commitment, rows are explicitly marked “Same”, with optional “How the instructions relate to C”. The comparison practises a familiar instruction while testing one new idea about types.
- The closing task transfers the taught reading rule to other patterns. A worked example with different inputs does not spoil that transfer. Reflection and its answer disclosure are clearly separate.

## Browser coverage and limits

Fresh Playwright browser contexts for each combination: 375×900 and 1280×900, light and dark. Verified actual computed body colours: light `rgb(243, 246, 245)` background / `rgb(16, 26, 24)` text; dark `rgb(16, 22, 21)` / `rgb(232, 238, 237)`. Initial document width matched each viewport (no page-level horizontal overflow observed).

In all four combinations exercised: fresh lesson; initial opener and one subtraction step; an incorrect committed addition prediction; two steps in the unlocked addition run; reader initial state; opened “Show calculation”; “Clear bits” and top-bit toggle; an incorrect compiler prediction and revealed comparison; initial construction, blank failed test run and first hint. Screenshots were captured for these states with prefix `/tmp/course-load-review/one-pattern-three-readings-`; logs and scripts use that prefix too. Visually inspected phone light/dark reader, phone light subtraction/construction/comparison, desktop light reader and desktop dark subtraction, with the other combinations captured and state text checked.

Read all ten sections in source and the complete rendered initial page. Closing exercise grading, successful construction, later hints/answer disclosures, completion/restoration across visits, the optional C association disclosure, keyboard navigation and a full end-of-run/reset sequence were source-only or untested. No external compiler calls, rebuilds, challenge solutions or app edits were made. Findings concern learning load and interface switching, not an accuracy or accessibility certification.
