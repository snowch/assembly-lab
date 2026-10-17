# Module 3 clarity review, 17 October 2026

Final repository validation: `npm run check` passed after all lesson edits, with 1,924 unit
and integration tests and 758 browser tests passing (16 skipped). Formatting, copyright,
platform-copy integrity, strict type checking and the production build also passed.

The author requested the same plain-English review and revision applied to Module 1.
Separate Codex agents reviewed and drafted both lessons using the session's selected model
and inherited effort. No model or effort overrides were set.

## Findings and changes

- Explained AND's bit rule before the mask prediction, and C's `>>` beside the field-reading
  example. Clarified that clearing one bit leaves every other bit unchanged.
- Distinguished an unsigned C constant's bits from GCC's signed notation for those bits.
- Counted field extraction or writing separately from the return instruction.
- Replaced "come out as they went in" with "stay unchanged" and made the mask summary explicit.
- Qualified halving as a shift by one place, then explained repeated halving for larger shifts.
- Made the fill prediction ask for the rule for every input, since the displayed example alone
  cannot distinguish all the offered rules.
- Explained why GCC's division correction also works for negative even inputs.
- Removed the claim that this is the first type-dependent instruction choice. Stated the
  equal-width signed/unsigned distinction and scoped the C mapping to the recorded GCC output.

The review rejected adding truth tables for every operation: the existing mask rules and
figures suffice once AND is explained before use. Operand is taught in Module 0. The existing
C note already covers signed-shift qualifications, so it did not need a new digression.

## Evidence and validation

Recorded listings and the shift, mask and division facts tests support the revised claims.
The lesson's examples, options and grading rules are unchanged. Canonical prose and lesson
strings were revised together. All 139 scoped tests passed; the final prediction wording
also passed both prose suites (23 tests).
Independent source review found no remaining material clarity, accuracy or premature-answer issue.

Independent browser review covered both lessons at desktop 1280×800 and phone 375×812 in light
and dark themes. The reviewer inspected the changed prose, diagrams, notes, revealed
explanations and locked captions. Outcomes remained hidden before commitment. No material
layout issue, horizontal overflow, console error or page error was found.
