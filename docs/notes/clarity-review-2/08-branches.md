# Second clarity review: Branches, and the run that skips

Copyright © 2026 Christopher Snow

Independent learner review of lesson 08 against `CLAUDE.md`, `docs/style.md` and
[this review's brief](brief.md). The reader assumes the current front-page
prerequisites and lessons 00–07 only. Reviewed source and the immutable preview at
`http://127.0.0.1:4253/assembly-lab/#/lesson/branches`.

## Result

No new substantive clarity finding. The lesson defines its new vocabulary, explains
how a branch chooses the next instruction, and connects the explanation to the
computed path. One earlier low-severity finding remains unresolved: **L9**.

### L9 retained, low: undefined “block” in corrective feedback

Source: [`fuelWarningFeedback.fellThrough`](../../../content/lessons/branches.prose.ts)
(the repository path is `content/lessons/branches.prose.ts:71`).

> The run for a `litres` of 0 went on into the next block instead of returning. Does every block end in `ret` or `b`?

Effect: a learner who knows C braces and has just learnt assembly labels cannot tell
which instructions this feedback calls a “block”. It asks them to inspect a unit
whose boundaries have not been explained, precisely when execution order has gone
wrong. The earlier prose files and front-page prerequisites do not define an
assembly block.

Direction: refer to the labelled groups of instructions using the terms already
introduced, or explain the intended grouping before using “block” in feedback.
No exercise solution is needed to clarify that instruction.

The wording remains in the current source and was reproduced by submitting a
faulty path that continues into the following labelled instructions. Reproduced at
both widths and in both themes. This is a duplicate of
[the first reader's finding](../english-review/08-branches.md), retained as L9 in
[the first review's ranked list](../english-review/README.md), not a new issue.

## Assumed knowledge

Checked the earlier teaching before treating a term as unexplained:

- Module 0 supplies GCC, instructions, argument/result registers, `ret`, execution
  order and the `-O1` setting. The expanded compiler note now also gives the command.
- Module 1 supplies hexadecimal, signed and unsigned readings, register widths,
  constants and the GNU assembler. Constants and widths calls it “the program GCC
  uses to turn its listings into instructions”.
- Module 2 supplies flags, NZCV, arithmetic and persistence of flags.
- Module 3 supplies bit numbering and the service-due bit used here.
- Compare and choose supplies `cmp`, `cmn`, `csel`, `cset`, and the conditions used by
  these branches; it explicitly relates each condition to its flags.
- This lesson defines label, branch, taken/not taken, `wzr`, alternate branch
  spelling and register-testing branches before the learner uses them. Its optional
  note explains `void` locally. Its label-naming guidance supplies the syntax
  needed by the editor.

No other unexplained prerequisite found. “Straight-line path” in the optional
`maybe_beep` note is supported locally by the two-instruction excerpt and the
explicit account of what follows when the branch is not taken. No earlier rejected
finding is reopened. Shared editor wording remains covered by the shared review;
there is no additional lesson-specific occurrence to count separately.

## Coverage and evidence

Read all of `branches.prose.ts`, `branches.labels.ts`, `branches.ts` and
`branches.listings.ts`, plus the applicable shared strings in
`packages/views/src/strings.ts` and `strings.branch.ts`. This includes ten sections,
objectives, labels, captions, both prediction explanations, both tasks, all ten
hints, five fuel-warning feedback variants, count feedback, all closed notes,
reflection and model-versus-reality note. Source-only solutions were read but are
not reproduced here.

Actual browser coverage at **1280 × 900 and 375 × 900, light and dark**:

- Read initial rendered text and opened all disclosures.
- Selected and checked every option in both predictions.
- Advanced both steppers to completion and read their intermediate messages.
- Chose each of the four offered gradients and read the resulting path and labels.
- Ran the initial assembly challenge, submitted the empty counting form, and
  revealed all five hints in each challenge.
- Submitted four deliberately faulty assembly variants to exercise the feedback
  about falling into a following group, checking conditions in the wrong order,
  overwritten input, and signed comparison. The initial program displayed the
  generic wrong-label feedback. These runs cover all five named feedback variants.
- Inspected the branch-path screenshots in all four configurations. Text and
  annotations fit; document width matched viewport width in every configuration.

This did not exercise every possible input, an all-correct submission or every
assembler error. Numeric wrong-answer feedback was reviewed in source; the browser
numeric submission was empty.

Temporary local evidence:

- [Browser driver](/tmp/clarity2-08.mjs), [run log](/tmp/clarity2-08-browser.log).
- `/tmp/clarity2-08-{1280,375}-{light,dark}.txt`: complete initial and interaction text.
- `/tmp/clarity2-08-{1280,375}-{light,dark}-{initial,arrows}.png`: screenshots.
- [Targeted feedback driver](/tmp/clarity2-08-feedback.cjs),
  `/tmp/clarity2-08-feedback-{1280,375}-{light,dark}.txt`: feedback observations.

No application files changed, and no build or test suite was run by this reader.
