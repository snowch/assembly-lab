# Learner review: lesson 05, Masks and fields

Reviewed 18 October 2026 as an independent one-lesson reader. Read `CLAUDE.md`,
`docs/style.md` and this work's `brief.md`. Assumed only “Before you start” and
lessons 00–04. This review changes no implementation, test or lesson prose.

## Findings

No new finding against the snippet-alignment change. The revealed GCC comparison
keeps the whole C function and both instructions visible. The C expression wraps
without separating it from its related instructions. On a phone, the source and
instructions form one consecutive group. The separate explanation “Returns to the
code that called this function” distinguishes the return instruction's job.

“Compiler's C line references” is initially closed and opens to an explicitly
labelled compiler record. Its explanation says, “They may point to a brace instead
of the C operation an instruction carries out.” The displayed references remain
separate from the normal C/instruction relationship. This example's complete C is
one recorded line, so it needs no separate complete-source disclosure or repeated
excerpts. The normal paired display contains the complete function, including its
signature and closing brace.

The bit-operation selector shows each complete C function with its relevant
instruction. Its figures are static results rather than source-stepping views.
The GCC comparison likewise has no stepping source highlight to assess. The two
assembly-only steppers retain their instruction highlights and acquire no invented
C panel or mapping.

### Existing low-severity findings, not regressions

These match [the prior review](../clarity-review-2/05-masks.md); they should not be
counted again as new alignment findings.

- **C05-1, low:** “A prediction about the constant in the listing.” The prediction
  supplies inline expressions and an instruction, rather than a separate listing.
  Smallest direction: refer directly to that instruction. This does not prevent
  the learner making the prediction.
- **C05-2, low:** “the figure shows the word after each one”. The first step of a
  submitted solution can show the other input register. The browser still labels
  that display as that register, so the introduction overgeneralises it as the
  warning word. Smallest direction: describe the register the instruction writes.
- **C05-3, low:** “Status words, packed dates and colours keep several small
  numbers in one word in the same way.” These application representations remain
  unexplained in the allowed prerequisites. Smallest direction: identify the
  component values in one application.
- **C05-4, low:** “Common mistake” heads text stating correct requirements. This
  was confirmed in the lesson source and shared heading, not exercised through
  every hint in this focused browser review. Smallest direction: identify the
  mistake the hint addresses. It remains the existing hint-heading issue.

## Assumed knowledge

The new comparison text assumes C statements, functions, callers, compiler output,
line numbers and braces. These fit the prerequisite panel or lesson00. In
particular, lesson00's note explains, “The course pairs instructions with the C
operations they perform,” and distinguishes those relationships from GCC's
original references. Its compiler note explains GCC, Compiler Explorer and `-O1`.

The C suffix in the displayed functions is already taught by lesson02:
“The `u` in `4294967295u` marks the constant as `unsigned`.” It is not a new
prerequisite defect here. Earlier lessons establish hexadecimal, signed readings,
bit positions, set/clear, register widths and return values. This lesson introduces
the bit operators, masks, fields and the shift/extract instructions before the
relevant figures. The named warning constants are explained in the local prose.
The unexplained application vocabulary listed in C05-3 is the only retained
knowledge gap found in this focused pass. No later lesson was used to justify it.

## Actual browser checks

Used installed Playwright Chromium through Node. Initial reconnaissance read the
rendered lesson at `http://127.0.0.1:4263/assembly-lab/#/lesson/masks`. After the
coordinator supplied the updated immutable preview, all four complete runs used
`http://127.0.0.1:4264/assembly-lab/#/lesson/masks`:

- 1280 × 900, light and dark;
- 375 × 900, light and dark.

Each run used a fresh browser page/context, selected the theme with the actual
control, captured the initial page, selected and committed an incorrect prediction
for each gate, visited all four bit-operation function selectors, ran the initial
challenge submission, then typed the repository's documented reference program
through the real editor and ran its checks. This was solely to reveal the gated
comparison. The report does not reproduce exercise answers.

Verified no prediction outcome before commitment; the comparison remained locked
after the failed submission. Five initial lock panels were present, and no GCC
comparison listing was mounted before the challenge passed. Opened the compiler
references after passing. Stepped the learner solution and the assembly-only
failure example once. No storage seed or direct state mutation was used.

Inspected actual screenshots of the comparison in all four combinations, including
open compiler detail at desktop/light and phone/light, plus the dark desktop
bit-operation figure, both phone bit-operation layouts, the phone/light solution
stepper and desktop/dark failure stepper. The long C expression wraps legibly in
both layouts; there was no overlapping text. Measured document width equalled the
viewport in all four runs, and the open comparison contained no element with
horizontal content overflow. No page errors were recorded. This is a focused
learner review, not a complete technical verification of every source association
or a full test-suite run.

## Evidence

- Script: `/tmp/snippet05-review.cjs`.
- Initial reconnaissance: `/tmp/snippet05-initial.txt` (preview4263).
- Per-configuration checks: `/tmp/snippet05-{1280,375}-{light,dark}-checks.json`.
- Rendered lesson text: `/tmp/snippet05-{1280,375}-{light,dark}-revealed.txt`.
- Screenshots: `/tmp/snippet05-{1280,375}-{light,dark}-{initial,comparison,comparison-open,solution-step,no-clear-step}.png`.
- Bit-operation screenshots: the same prefix with `{clear_door,warn_fuel,toggle_lights,gear_of}.png`.

These local evidence captures include revealed exercise material. No challenge
answer is quoted in this review.
