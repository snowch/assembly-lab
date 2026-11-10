# Introducing flags before using them

10 November 2026. The change is limited to the opening motivation of “Addition and its
flags”, and its identical canonical passage in `prose.md`. It identifies `w0` as a 32-bit
register name and defines flags before the `add`/`adds` comparison. No figure, exercise,
answer, instruction, width or lesson order changed.

The drafting brief checked the existing 32-bit examples, `Flags` in `types.ts`,
`addWithCarry` in `run.ts`, and the Module 2 facts tests. The learner already knows register
names, signed/unsigned readings and fixed-width addition. The revised sequence names the
width, defines a stored 0/1 flag and NZCV, then distinguishes retaining previous flag values
from updating them. The suffix explanation says each new flag value can be 0 or 1.

A separate GPT-6.1 Sol Medium agent drafted the passage; a Sol High learner reviewer and
Sol Extra High technical reviewer independently checked it. The technical reviewer checked
Arm DDI0602 2025-12 ADD/ADDS operation pseudocode and the course simulator. ADD discards the
calculated NZCV; ADDS writes all four. These sources support the same-input result comparison.

Accepted and independently verified: the old closing sentence's “must read a flag” was
too broad and could suggest that flags retained by ADD describe its new sum. The new text
specifically says the program can check a flag after ADDS. The old “same operands” wording
was simplified to “same 32-bit inputs”. An asserted prerequisite gap for “operands” was
rejected: Module 0 already defines the term, including the destination operand.

Both reviewers inspected the final built route at 375×812 and 1280×800 in actual light and
dark themes, including rendered backgrounds. Paragraph/definition/bullet order, code and
bold text, initial prediction gate, committed/restored state and adder stepping/reset remain
usable. No console/page errors or horizontal overflow were observed. The learner's initial
inspection scripts used a wrong button label and a stale sentence prefix; their corrected
four-state final run passed. These are recorded as harness failures, not product failures.

The existing focused checks passed: four files and 99 tests, with the final canonical-text
fidelity rerun passing 31 tests. Full `npm run check` started before pushing; the PR's CI
and deployment results are recorded separately. No new tests were added for this prose-only
change. Agent review and browser checks are not a novice study or screen-reader validation.
