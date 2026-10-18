# Division and remainders: independent reader and technical review

Copyright © 2026 Christopher Snow

Reviewed 18 October 2026 by a separate agent using the inherited model and effort. The reviewer did not draft or implement this lesson. Scope: this lesson, the front-page prerequisites, and lessons through Products and widths. Instructions: CLAUDE.md, docs/authoring.md and both closing passes in docs/style.md.

The browser review used the stable production preview at `http://localhost:4200/assembly-lab/#/lesson/division-and-remainders`. No production files or build were changed during review. Browser artifacts are under `/tmp/reader-division/`.

## Findings

### D1 — P2: undefined behaviour needs its meaning before this lesson

Quote: “Otherwise both `/` and `%` have undefined behaviour.”

The term is central to the distinction this page teaches. Earlier Shifts says some operations are “undefined”, and Products and widths says a signed multiplication “has undefined behaviour”, but neither reviewed page explains what that permits. The explicit definition appears later in C and overflow: “the language places no requirements on what the program does in that case.” A learner could otherwise interpret this as an unspecified numerical answer or a guaranteed error.

Direction: introduce the meaning at the first earlier use and ensure the reader reaches it before this distinction. The managing session accepted this finding and reports adding the definition to the preceding products lesson and canonical prose. That change was not in this browser snapshot and still needs built-page verification.

### D2 — P2: the consumption grader does not check the stated divisor-width requirement

Quote: “For a 64-bit division, also ensure the divisor is a 64-bit unsigned value: writing `w1` clears the upper half of `x1`.”

The exercise promises only a value in `w1`. All seven cases in `division-and-remainders.ts` supply `given: { w0, w1, reading: "unsigned" }`, so the simulator starts the containing `x1` with a zero high half. In the browser, a candidate that omitted divisor zero-extension still received “All 7 tests passed”. A separate simulator call with the same specified low 32-bit inputs and a nonzero high half in `x1` produced a different result. Thus the grader accepts an assumption the prose explicitly tells the learner to avoid.

Direction: add at least one test that preserves the promised low 32-bit divisor while supplying nonzero upper bits in its containing register. Keep the task's input contract, and verify that both the intended solution and an alternative correct solution pass while the omitted-extension candidate fails. This does not require a new learner-facing concept: the relationship between `w1` and `x1` is already taught.

### D3 — P3: the diagram explanation uses abstract words instead of naming the visual mechanism

Quote: “For the negative example, the drawing groups the magnitude into whole groups and a remaining part. The signed values below it show the direction of the calculation.”

“Magnitude” has not been defined in earlier lesson prose. “Direction of the calculation” has no explicit referent: the diagram is a horizontal strip with signed values, not an arrow or number line. The strip itself fits and its values agree with the model, but this description makes the learner infer how the count of whole groups relates to a signed quotient.

Direction: explain what the group count, widths and signs represent in ordinary language. If retaining “magnitude”, define it where used. Do not add an unconditional numerical prediction answer.

### D4 — P3: avoid unexplained timing jargon in the model note

Quote: “The course does not model instruction latency or claim that one sequence is faster.”

No earlier learner prose defines “instruction latency”. The next clause already makes the practical limitation understandable.

Direction: use ordinary timing language or give the term's meaning at this first occurrence.

## Prerequisite audit

Confirmed earlier teaching: GCC and `-O1` in Meet the machine; closing-brace source attribution in that same lesson; signed and unsigned readings and hexadecimal in Module 1; `w`/`x` overlap and clearing the upper half in Constants and widths; signed division rounding towards zero in Shifts; branches in Module 4; target widths and little-endian memory in Module 6; multiplication, widening, `msub`, `movk` and shifts by this point. The page defines dividend, divisor, quotient and remainder before asking the learner to use them. No later call/stack knowledge is required. The gaps found are D1, D3 and D4.

## Browser checks

Read the rendered lesson and inspected screenshots at 1280×800 and 375×812, each in light and dark themes. The diagram and editors fit without document horizontal scrolling; no page errors occurred. All eight dependent figures started locked. Checking deliberately wrong predictions unlocked their explanations and dependent figures, as the course's prediction contract requires. No outcome appeared before committing a prediction.

Both starting programs failed tests. Both completed implementations passed all seven cases in each viewport/theme combination. Opened all five hints for each exercise. Switched between text and tap editors and opened operand controls. A separate browser pass stepped all seven steppers to completion (21 instruction advances). The screenshots show legible light/dark contrast and usable phone controls. The reviewed grouping diagram's widths and signed values match the helper's simulator-derived data.

Artifacts: `browser-results.json`, four `*-text.txt` files, and `*-top.png`, `*-diagram.png`, `*-write-remainder.png`, `*-write-consumption.png`. These diagnostic artifacts may include revealed exercise material; the review itself does not reproduce solutions.

## Technical checks

- Read C23 draft N3096, 6.5.5 paragraphs 6–7, from `/tmp/course-n3096.txt`: divisor zero, discarded fractional part, the quotient/remainder relation, and an unrepresentable quotient all match the page's claims.
- Checked raw GCC source/response files, including source-line metadata. Closing-brace tags are genuine compiler attribution, not an off-by-one error: the displayed source removes the copyright line and the tags subtract exactly one.
- Ran `products.facts.test.ts`: 58 tests passed. These check source correspondence, arithmetic facts, edges, unchanged flags and corpus inclusion.
- Independently ran the Module 8 corpus through GNU as and QEMU using `/tmp/course-tools`: 14 programs, 57 calls, 232 instruction states, zero differences. Output: `qemu.log`. An earlier attempted `--only module8` selected zero programs; it is not counted as validation.
- Confirmed the divide-by-zero and unrepresentable signed quotient demonstrations have no C source panel, and the page distinguishes machine results from C guarantees.
- Confirmed the division-by-ten record uses a widened product and the recorded shift; no speed guarantee is made.

No arithmetic or compiler-record discrepancy was found. D2 is a gap in exercise coverage rather than a discrepancy in the reference program. Final approval depends on resolving accepted findings and checking their built-page fixes independently.
