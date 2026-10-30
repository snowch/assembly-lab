<!-- Copyright © 2026 Christopher Snow -->

# Independent learner review: two’s complement

Reviewer: separate GPT-6.1 Codex agent (`gpt-6.1-sol`), High effort, 30 October 2026. The managing session supplied that exact configuration after the initial assessment. This reviewer did not draft or edit the lesson. Initial judgement used the actual lesson diff, rendered lessons and earlier teaching, without reading the author's change rationale or drafting brief.

## Verdict

Pass for the requested explanation within the existing lessons. No blocking or major learner finding. Two’s complement is named where the signed representation is explained; the later negation rule has a fixed width and sits beside the signed-limit investigation. A separate chapter is unnecessary.

## Evidence and severity

- **Pass, representation mechanism.** “The signed reading does the same, except the top bit counts as minus 2147483648” precedes “This way of reading signed bits is called two’s complement.” The following sentence, “The top bit contributes a negative value; it is not a separate minus sign for the other bits,” directly addresses a likely sign-and-magnitude misunderstanding. The live bit diagram and its top-bit/other-bits breakdown demonstrate the rule before the learner uses it.
- **Pass, exercise gate.** The additional explanation following “Make −1” was absent on fresh work, appeared after a successful submission, survived reload, and disappeared after Clear work and its Discard work confirmation. A failing submission did not reveal it. This was checked at both widths in both actual rendered themes. No challenge answer is reproduced in this review.
- **Pass, negation mechanism and qualification.** “Inverting changes each 0 to 1 and each 1 to 0. Keep only the low 32 bits” makes both the operation and width explicit. The preceding sentence connects the procedure to the instruction's “same 32 result bits.” The page does not promise that every mathematical negative fits: after committing the prediction, its explanation says “The negative does not fit the signed range.” The subsequent observed instruction state supports that qualification.
- **Pass, placement and repetition.** The term is introduced in “Signed and unsigned readings”; the calculation procedure appears later in “Subtraction flags and negation,” where the learner has a reason to use it. These additions explain different parts of the idea rather than repeating a full exposition.

No correction is requested from this review. These are assessment results, not substitute prose.

## Preparation, demonstration and practice

For the representation, the definition precedes the existing register experiment. The initial dense pattern is a complete demonstrated reading because the figure separates the top contribution from the total of the other bits. The existing bit-construction and fresh-pattern exercises practise that reading. I compared the initial example with a smaller candidate containing only the top bit, then one additional low bit, using the actual controls. That smaller case is useful to explore, but an extra required bridge is unnecessary: the displayed two-part calculation already keeps the dense example manageable and the controls allow the smaller experiment immediately.

For negation, the section begins by defining negation as subtraction from zero. Earlier on the same page, “How an adder subtracts” supplies a complete four-bit example of inversion, an incoming one, the full sum and the kept low bits. The new inversion-plus-one sentence therefore names a mechanism already demonstrated in subtraction before composing it with the signed-limit prediction. A small ordinary negative would be another possible first example, but it would add a second demonstration of this same calculation; the existing four-bit bridge is sufficient. The prediction provides an application at the exceptional signed limit, with feedback and a runnable stepper after commitment.

## Prerequisite audit

No new unexplained prerequisite was found in the changed material.

- The front page explicitly requires conversion between binary and decimal, and familiarity with small C functions using `int`, `unsigned` and `return`.
- Fundamentals introduces registers, instruction operands, destination-first order, reuse of an input register, subtraction order, instruction stepping, GCC and the meaning of `-O1`. “Returning to the caller” explains `ret` and incoming/returned register values.
- The preceding “Reading hexadecimal” lesson explains hexadecimal groups, the `0x` marker, set/clear terminology and editing bits or hexadecimal. The signed-reading page does not require prior knowledge of two’s complement: it defines the term locally.
- Before the negation page, “Arithmetic on register bits” demonstrates keeping low result bits, “Writing w and x registers” explains widths, and addition lessons introduce columns, carry, flags and signed overflow. “Measuring elapsed ticks” introduces `subs`, borrow and counter wrap. The negation page defines inversion locally and explains modulo before relying on that term.

The review did not assume familiarity with a bitwise-not operator, a complement instruction, sign extension or C's signed-overflow rules. None is required to follow these additions.

## Checks and limits

Browser: existing production build served independently at port 4461, without rebuilding or editing tests. Chromium at 375 × 812 and 1280 × 800; Light and Dark selected through the visible theme selector, and `html[data-theme]` checked against each choice. Checked the signed-reading diagram, optional calculation, a smaller top-bit experiment, challenge failure/success/restoration/clear states, and the negation prediction before and after commitment, followed by instruction stepping and Reset. On reload the checked prediction remained available while the stepper began at its initial instruction. Inspected screenshots in the actual themes. The page widths remained 375 and 1280 respectively, with no document horizontal overflow or page exceptions in the four primary combinations.

Source: actual `git diff` for lesson prose, split lesson structure, term introductions and focused checks; the two rendered lesson definitions; prerequisite prose and front-page requirements; `AGENTS.md`, `CLAUDE.md`, `docs/style.md` and `docs/authoring.md`. Canonical author/draft rationale was not used to form the assessment. Existing test code was consulted for control and state identifiers, not treated as evidence that the explanation is understandable.

This is a learner review, not an independent Arm/C semantics audit. No full test suite or rebuild was run by this reviewer. Temporary browser scripts, screenshots and results are under `/tmp/twos-learner-review`; these are review artifacts, not product changes.

Final wording recheck: passed on the final build produced at 21:49:07 UTC, 30 October 2026. In fresh browser contexts at both widths and both actual themes, the success note includes the intended hexadecimal pattern as a rendered code element. It remains absent initially and after a failing submission, appears after success, survives reload and disappears after Clear work. Screenshots of the final note were inspected in all four combinations; the code and explanatory sums are readable, with no document horizontal overflow. The final addition changes neither the learner verdict nor the prerequisite assessment. The independent port-4461 preview was stopped after these checks.
