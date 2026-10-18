# Clarity review 2: Subtracting, and the tick counter

Reviewed 18 October 2026, against the immutable preview at `http://127.0.0.1:4253/assembly-lab/#/lesson/subtracting-and-the-tick-counter`. Scope: one lesson, index 04; front-page prerequisites and preceding lessons only. Review only. No learner prose or challenge answers are supplied here.

## Findings

### C04-1 — Medium — The operand numbering changes meaning

Source: `content/lessons/subtracting-and-the-tick-counter.prose.ts:42,100`.

> “The figures below show the same steps for the real 32-bit `subs`: the second operand, its bits changed, the carry in of 1, the result and the carry out.”

> “A subtraction is done as an addition of the second operand with every bit changed, plus 1.”

Module 0 defines all parts after the instruction name as operands. Its subtraction hint states “`sub` writes its first operand as its second operand minus its third” (`meet-the-machine.prose.ts:73`). Following that established numbering identifies the wrong input to invert here. The figures correctly label the changed bits as belonging to `w1`, so a learner trying to connect the sentence to the figure meets conflicting instructions.

Direction: distinguish the mathematical second number from the numbered assembly operands and consistently identify the input being subtracted.

Earlier-review status: duplicate of retained **M1**, still present. Independently identified before consulting that review.

### C04-2 — Medium — The “full sum” omits an input

Source: `content/lessons/subtracting-and-the-tick-counter.prose.ts:41,100`.

> “Adding 1 gives 4294967296 minus `b`, or 2³² minus `b`. This is the full sum, before keeping only the low 32 bits. When `b` is 0, the full sum is 4294967296: the low 32 bits are 0, with a carry out of the top bit.”

The preceding explanation explicitly adds the inverted bits to `a`, and the four-bit worked example includes `a`. This paragraph suddenly calculates only the contribution from `b` and calls it the full sum. It does not announce that it has temporarily left out `a`. Consequently its zero case can read as a statement about the complete subtraction regardless of the first input. The reflection's quoted sentence in C04-1 also omits that first input. The later explanation restores it, after the learner has already encountered the construction exercise.

Direction: name the intermediate quantity and distinguish it from the complete addition containing both inputs; include the first input in the reflection's mechanism.

Earlier-review status: duplicate of retained **M2**, still present. Independently identified before consulting that review.

### C04-3 — Low — A correct statement appears under “Common mistake”

Source: `content/lessons/subtracting-and-the-tick-counter.prose.ts:93` (`stepHints[1]`); heading is supplied by the shared challenge interface.

> “COMMON MISTAKE”
>
> “0 is smaller than 4294967295 under the unsigned reading.”

The heading presents the correct mathematical statement as the mistake. The reader has to infer that the intended warning is about neglecting that comparison, rather than making it. The construction hint “No test for the wrap is needed” under the same heading is easier to interpret as a warning, because it explicitly rejects an unnecessary action; this closing hint provides no such distinction.

Direction: make the hint identify the mistaken reasoning or otherwise fit the heading's stated purpose. Keep the platform copy intact.

Earlier-review status: an additional location of retained **M6**, the same hint-heading problem previously illustrated in Counting down and Memory and addresses. Do not count it as a separate new category. The old lesson-specific report did not list this occurrence.

## Prior knowledge and clean results

The front page assumes elementary C functions and binary arithmetic. Module 0 provides instruction operands, argument/result registers, GCC and stepping. Module 1 supplies hexadecimal, signed/unsigned readings, register widths and discarded high bits. Adding, and the flags supplies column addition, carry, N/Z/C/V, signed overflow, QEMU and the architectural model. This lesson defines tick, wrap, `subs`, borrow, negation and modulo where they are used. No additional unexplained prerequisite was identified beyond the operand conflict.

The timing and reset assumptions are explicit at the beginning and repeated where needed. The ring and enlarged strip support the explanation of counting across the wrap. The later explanation clearly separates the two orderings of the readings. Predictions, failed-test cards, labels, reflection disclosure and model note yielded no further substantive English finding. No style-only changes are proposed.

## Exact coverage and evidence

Read all lesson prose, objectives, titles, labels, captions, option text, both tasks, all ten hints, solved-construction note, reflection answer and model note in `.prose.ts`, `.labels.ts`, the lesson configuration and displayed listings. Read the arithmetic figure and feedback strings in `packages/views/src/strings.arith.ts`. Checked relevant prior-course definitions and the front-page prerequisites against source. Formed the findings above before consulting [the earlier lesson review](../english-review/04-subtracting-and-the-tick-counter.md) and [its ranked findings](../english-review/README.md).

In Chromium/Playwright, inspected the rendered page at **1280 × 900 and 375 × 900**, each in **light and dark** themes. In all four configurations: captured initial and revealed text/screenshots; checked both predictions with an incorrect choice; opened the ring and two subtraction figures; ran the construction's starting program; revealed all ten hints; submitted incorrect closing-challenge fields; opened the reflection and model disclosures. Inspected focused screenshots of the disputed explanation in all four configurations. No page-wide horizontal overflow occurred. The preformatted arithmetic example has its own scrollable region on the phone.

Additionally, at desktop/light only, passed the construction to inspect the unlocked figure/note, advanced the negation stepper, and reset and advanced an available adder figure. Read the solved-construction note in source and rendered text. This does not claim every input or control was exercised in all configurations, and no general test suite or rebuild was run.

Local temporary evidence (not repository assets):

- [Initial/browser script](/tmp/clarity2-04.cjs), [revealed-state script](/tmp/clarity2-04-states.cjs), [focused-view script](/tmp/clarity2-04-focus.cjs), [additional interaction script](/tmp/clarity2-04-pass.cjs).
- [Desktop light explanation](/tmp/clarity2-04-1280-light-focus.png), [desktop dark explanation](/tmp/clarity2-04-1280-dark-focus.png), [phone light explanation](/tmp/clarity2-04-375-light-focus.png), [phone dark explanation](/tmp/clarity2-04-375-dark-focus.png).
- Four corresponding `/tmp/clarity2-04-{1280,375}-{light,dark}-states.txt` files and screenshots contain revealed interaction states; [additional desktop state](/tmp/clarity2-04-passed.txt).
