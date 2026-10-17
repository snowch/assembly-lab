# Module 1 clarity review, 17 October 2026

The author requested a plain-English review of both lessons, then approved the recommended
changes. Drafting and review used separate Codex agents with the session's selected model and
inherited effort; no model or effort overrides were set.

## Findings and changes

- **Hexadecimal and interpretation:** replaced the claim that hexadecimal is not a reading as a
  number. The text now distinguishes writing a bit pattern from interpreting it as signed or unsigned.
- **Instruction space:** explained that instruction bits also identify the operation and
  destination register. The size limit now has a reason the learner can follow.
- **The constant prediction:** the one-half rule guarantees some constants fit but cannot
  establish that others fail. The question now asks which option the rule guarantees will fit.
  Feedback separates that guarantee from the assembler's rejection of the other options.
- **C types:** replaced the claim that a type only determines a later reading. The summary now
  covers both width and interpretation, consistent with the recorded `long` and `int` examples.
- **Division into halves:** specified division without the fractional part and the remainder,
  limited the recipe to non-negative 32-bit integers, and connected it to the existing worked example.
- **Wording and captions:** replaced "worths", shortened captions, moved the explanation of
  `void` into the opening prose, counted constant-loading instructions separately from `ret`,
  and described the register's halves after each instruction. The `movk` summary now states
  its scope when a `w` name is used.

An independent review of the fixes also found a sentence in Lesson 1 claiming that C types
first affect instructions in later modules. It now refers specifically to choosing instructions
for signed and unsigned readings.

The review rejected the stronger claims that the one-half rule itself was false or that the
prediction's expected result was wrong. The problem was the justification supplied to the learner.
Teaching every constant encoding was not necessary to correct it.

## Evidence and validation

The recorded compiler listings in `listings.md`, the course assembler's immediate-move
selection, and the existing facts tests support the changes. The worked-example test now also
checks the quotient and remainder against the simulator's result. The prediction test checks
that the taught rule identifies one option and that the assembler confirms it.

The canonical prose in `prose.md` and the lesson strings were changed together.
The scoped unit and integration run passed all 235 tests, including the prose synchronisation,
facts, lesson structure and figure tests. Type checking, the production build, formatting and
copyright checks passed. After the final wording correction, the affected prose and facts tests
passed again (40 tests) and the production build passed.

The Module 1 browser suite passed 244 tests with two skipped. Two checks initially failed
because a rebuild removed assets while their pages were loading; both passed when rerun
against the completed build. Independent source and visual review found no remaining blockers.
Both lessons were inspected at desktop and phone widths in light and dark themes, including
the changed prediction, construction and C-type sections. No clipping or horizontal overflow
was found.
