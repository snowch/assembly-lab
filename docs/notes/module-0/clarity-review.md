# Module 0 clarity review, 17 October 2026

Final repository validation: `npm run check` passed after all lesson edits, with 1,924 unit
and integration tests and 758 browser tests passing (16 skipped). Formatting, copyright,
platform-copy integrity, strict type checking and the production build also passed.

The author requested the same plain-English review and revision applied to Module 1.
Separate Codex agents reviewed and drafted the lesson using the session's selected model
and inherited effort. No model or effort overrides were set.

## Findings and changes

- Defined instruction, assembly language and listing in the opening, before learners need them.
- Explained the trip's legs and that their distances already include the private detour.
- Corrected the `-O0` account: this listing stores variables in memory but performs arithmetic
  in registers. Removed the misleading claim that every value stays outside registers.
- Limited the argument and result register description to this lesson's `int` functions.
  Removed the unsupported claim that longer functions necessarily have more instructions.
- Explained `ret` as returning to the caller in the first completed run.
- Clarified that the odometer argument was recorded before the current trip. Split the
  challenge and compiler explanation into paragraphs with one purpose each.

The review rejected additional explanations of `-O1`, `#` and label colons: the lesson already
explains them. It also rejected the claim that subtraction order was wholly untaught; the
stepper and hints teach it. These did not justify expanding the lesson.

## Evidence and validation

The recorded `trip_distance` listings support the instruction counts and memory/register
description. The lesson's functions support the argument and result wording. Canonical prose
and lesson strings were revised together; one browser assertion follows the new end note.
All 56 scoped prose, facts and lesson tests passed. Independent source review found no
remaining material clarity, accuracy or premature-answer issue.

Independent browser review covered desktop 1280×800 and phone 375×812 in light and dark themes.
The reviewer inspected the opening, listing, compiler note, generalisation, challenge and
completed stepper. The return-to-caller note appeared at the right stage; prediction feedback
stayed hidden before commitment. No material layout issue, horizontal overflow or page error
was found.

## Follow-up: naming the first sum

The author found "in place of `leg1`" confusing and approved "In `w0`, which now holds
`leg1 + leg2`." The option and canonical prose now use that wording. Independent source review
confirmed that it matches the first instruction and the prediction's first-write measurement.
All 56 scoped tests, formatting and the production build passed for this follow-up.
