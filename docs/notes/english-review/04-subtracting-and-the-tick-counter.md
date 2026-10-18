# English review: Subtracting, and the tick counter

Reviewed 18 October 2026. Scope: Module 2 lesson 2 only, as a learner who has completed the front-page prerequisites and the four preceding lessons. Review only; no course text changed. No challenge answers or replacement wording are supplied here.

## Findings

1. **Medium: “second operand” conflicts with the taught assembly meaning.**
   - Exact text: “The figures below show the same steps for the real 32-bit `subs`: the second operand, its bits changed, the carry in of 1, the result and the carry out.” (`content/lessons/subtracting-and-the-tick-counter.prose.ts:42`). Also: “A subtraction is done as an addition of the second operand with every bit changed, plus 1.” (same file, line 100).
   - Effect: Module 0 explicitly calls all parts after the instruction name operands and numbers the destination first. Its subtraction feedback says the third operand is subtracted from the second (`meet-the-machine.prose.ts:65`). Consequently a learner following that convention can understand this lesson to change the bits of the wrong register. The displayed figures distinguish the original two input registers, so the mismatch matters while connecting the prose to the diagram.
   - Direction: distinguish the second number in the mathematical subtraction from the numbered operands in the assembly instruction. Use the established operand convention consistently in both passages.

2. **Medium: “the full sum” loses the first number being added.**
   - Exact text: “For 32 bits, changing every bit of `b` gives 4294967295 minus `b`. Adding 1 gives 4294967296 minus `b`, or 2³² minus `b`. This is the full sum, before keeping only the low 32 bits. When `b` is 0, the full sum is 4294967296: the low 32 bits are 0, with a carry out of the top bit.” (`content/lessons/subtracting-and-the-tick-counter.prose.ts:41`).
   - Effect: the preceding explanation and worked example describe adding the changed bits to `a`, then adding the carry in. Here “the full sum” can naturally mean that entire addition, although the expression being discussed contains only the changed `b` and the extra 1. The learner has to infer that `a` has temporarily been left out. This makes the zero case especially difficult to reconcile with the earlier instructions. The later explanation adds `now` back explicitly, but it comes after the construction and negation activities.
   - Direction: name precisely which intermediate quantity is being calculated, and distinguish it from the complete addition involving `a`.

## Prerequisite audit

Read `CLAUDE.md`, all of `docs/style.md`, the front-page “Before you start” panel (`apps/course/src/strings.ts`), and the learner prose of Meet the machine; One pattern, three readings; Constants and widths; Adding, and the flags. Verified order against `content/lessons/index.ts`.

- GCC, a listing, registers, instruction operands, `sub`, return conventions and stepping are introduced in Module 0. Its compiler note explains `-O1`; this lesson does not require a new compiler setting.
- Binary/decimal arithmetic is a declared prerequisite. Hexadecimal, signed/unsigned readings and the top bit are taught in One pattern, three readings. Dropping bits beyond the register width is demonstrated there.
- Register widths and `w`/`x` names, constants, optional `#`, and remainder are taught in Constants and widths.
- The adder, column numbering, carry in/out, flags N/Z/C/V, signed overflow, QEMU and “architecture” are taught in Adding, and the flags. The prior model note explains QEMU and architecture explicitly.
- Tick and wrap are defined at the start of this lesson; the timing/reset and less-than-one-turn assumptions are stated there. `subs`, borrow, `neg`/`negs` and modulo are explained locally. No additional unexplained prerequisite identified beyond the operand conflict above.

## Coverage and browser evidence

Read every lesson string in the `.prose.ts` and `.labels.ts` files, the complete lesson configuration and displayed listings. This includes objectives; all ten sections; both predictions and explanations; both tasks; all five hints for each challenge; the solved construction note; reflection and its answer disclosure; and model-versus-reality note. Read the applicable shared strings in `packages/views/src/strings.ts`, `strings.arith.ts`, and the challenge runtime strings, plus the register and outcome grader paths for the feedback they select.

Used the existing built site at `http://localhost:4220/assembly-lab/#/lesson/subtracting-and-the-tick-counter` with local Chromium/Playwright at 1280 × 900 and 375 × 900, each with light and dark colour preferences. Inspected rendered screenshots and extracted visible text. In all four combinations, checked both predictions, opened the ring and both subtraction figures, revealed all ten hints, ran the initial construction to see failed test cards, passed construction to open its additional figure and note, and opened details. Also submitted incorrect numeric answers in the closing challenge to inspect its failure messages, and checked the empty-answer feedback. Reviewed the final-state adder labels, carry summaries, controls and unlocked negation stepper labels. No additional English finding arose from those states or from theme/width changes.

Local evidence: `/tmp/english04/1280-light-states.png`, `/tmp/english04/1280-dark-states.png`, `/tmp/english04/375-light-states.png`, `/tmp/english04/375-dark-states.png`; corresponding `*-states.txt` and `*-passed.txt`; initial-state screenshots/text; and `/tmp/english04/wrong-fields.txt`. These temporary files include exercised answer states and are not part of this answer-free review note. No rebuild or full test suite run.
