# Building a constant: learning and copy brief

## Observation and outcome

The user reports that the whole explanation is difficult to follow and specifically questions “with a w name”. This is direct feedback about the text, not a measured novice performance study.

The outcome is to construct a fresh positive constant in w0 using mov and movk, explaining which 16-bit half each instruction writes and which previous bits it retains. Long division speed is not the learning goal. The following page retains w/x aliases and the upper-32-bit clearing effect.

## Preparation and checked facts

- One addition already defines and illustrates the x/w naming relationship in its visible register-view caption. The next width lesson develops write effects. Concrete w0 wording is a clarity improvement here, not a remedy for a wholly missing definition.
- Loading a constant defines w0's 32 bits, the upper and lower 16-bit halves, their four-digit hexadecimal forms, and constants fitting one mov. It includes 65536 as the lowest set bit in the upper half. Read the published prerequisite, not only the unsplit source lesson.
- The baseline page defines movk, both operand placements, a worked sequence, a division method, remainder and optional # notation before showing its figure. Its reminder repeats the mov definition. Readers must hold these rules while waiting to see them in use.
- Existing MOVK_EXAMPLE is mov w0, 3; movk w0, 2, lsl 16; ret. The model gives 0x0000 0003, then 0x0002 0003, or 131075. The second instruction retains the low half.
- With w0, movk replaces one 16-bit half. Its optional lsl 16 selects the upper half; omitting it selects the lower half. This local syntax can be explained without assuming the learner knows general shift instructions.
- The unsigned value is upper half times 65536 plus lower half. Thus the existing example is 2 times 65536 plus 3. For a positive number fitting w0, whole groups of 65536 give the upper half and the remainder gives the lower half.
- Writing # before these numeric operands is optional. The editor may display it, so explain that notation beside its use.
- Facts are checked in packages/machine/src/run.ts and regs.ts, content/lessons/constants-and-widths.facts.test.ts, the recorded/example programs and the prior official Arm review in docs/notes/mov-w0-width/review.md. Reuse existing model-computed examples; no new hardcoded figure states.

## Misconceptions and evidence

- Treating mov as updating just one half: an attempted second mov erases the previously built part. Existing exercise cases reject this and accept movk solutions.
- Treating movk as always updating the upper half: require a visible explanation of both forms, with the actual w0 operand in each.
- Treating lsl 16 as a separate instruction or unexplained arithmetic: show it as part of the instruction's syntax and name its local effect.
- Treating an upper-half value as its ordinary decimal contribution: connect the existing 2/3 example to the 65536 unit before asking the learner to decompose another number.
- Overload from abstract wording and the current order is a hypothesis supported by the user's report; do not claim a learning outcome merely because the page passes tests.

## Route and assessment constraints

Use one small complete worked example, then the existing fresh Build 1000000 exercise. Keep both movk forms visible and all essential instructions available without opening optional notes. Put each explanation near the figure or action it supports. Reduce repeated definitions and use the concrete register name w0 instead of “a w name”.

The independent baseline review found the first figure at document y approximately 1116 on desktop and 1547 on phone, after all the explanatory topics. Its model rendering already supported the mechanism. Keep that model figure and move the arithmetic method to the existing challenge's lead, after the worked figure. Put the optional # convention with that editor-adjacent guidance. This uses the existing figure lead/prose mechanism; no new control or platform change is needed.

Accepted baseline findings: excessive pre-figure explanation; abstract naming at first movk use; the need to connect 65536 to the observed halves; both movk placements needing a clear local definition; repeated mov definitions; syntax notation interrupting the mechanism. Reject the initial claim that no earlier page defines w/x names: the One addition caption explicitly does so. The naming issue is clarity/attention, not a missing prerequisite.

Keep the model figure, allowed instructions, step controls, reference answers, existing hint ladder and solution gate. Do not reveal the fresh exercise's halves or instructions in the main explanation. Calculators may be allowed because the outcome is constructing and preserving halves. A new calculator control is outside this copy/sequence change.

Synchronise docs/notes/module-1/prose.md and docs/notes/course-pacing-implementation/copy.md. Follow docs/style.md's two closing passes. Obtain a separate Medium-effort drafting pass, a High-effort learner review and an Extra High technical review under docs/authoring.md. Inspect the built page at phone and desktop widths in actual light/dark themes, including initial/stepped/reset/hint/restored states as relevant. Record focused and full-suite results separately and preserve failed commands. No novice participant is available; expert reviews and browser checks are the evidence available here.
