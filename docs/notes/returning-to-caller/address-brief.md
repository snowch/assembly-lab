# Visible caller addresses

Copyright © 2026 Christopher Snow

The user asks to put example addresses to the left of the caller instructions and show
the saved address in x30. Retain the approved handwritten/compiler-generated wording.

## Checked facts and scope

- The existing assembler assigns addresses to every instruction. `trace.lineAt` maps
  instruction addresses to displayed source indexes; use these values, never invented numbers.
- The caller shows `bl increment_int` followed by `add w1, w0, w0`. BL saves the address of
  that addition in x30. Existing facts tests assert the saved value equals the next instruction
  address and the model's caller continuation symbol. RET preserves x30 and resumes there.
- Initial x30 is a harness return address. Keep the current “Not yet set for this call” label
  until BL runs. Then show the actual saved numeric value beside x30 and the existing
  Caller’s addition label. Back/reset must restore the initial display.
- Show caller addresses as decimal numbers, avoiding an unexplained hexadecimal notation
  before Module 1. Explain the address column locally. These are this simulator run's
  addresses, not addresses guaranteed for every compiled program.
- Retain the existing paired C/function listing. No additional instructions, ISA changes,
  grades, challenge answers or saved-state changes are needed.

## Separate prose draft

Draft only the short local address explanation and Address/Instruction labels. Read the
full current lesson and the earlier Fundamentals prerequisites with docs/style.md. Amend
the prose/strings and canonical record consistently. Avoid another heading or a long
explanation. The user is asking to see the existing return-address mechanism concretely.

Independent learner and technical reviews must inspect the final built initial, stepped,
returned, back, reset and restored states at phone/desktop widths in actual light/dark themes.

## Validation

The existing canonical/facts suites passed all 9 tests (0.83 seconds), strict TypeScript
checking passed, and formatting/whitespace checks passed. The initial address build passed
(8.99 seconds) and the existing lesson browser suite passed all 6 tests (20.6 seconds).
Those tests now compare the visible consecutive addresses and the saved x30 value through
BL, the function addition, RET, reload, reset and Back to before BL.

Independent review found the address code badge's padding extended its digits outside the
background. Removing padding/background from the address gutter keeps the column narrow
and aligns its numbers. The final production build passed (10.19 seconds), and all 6 browser
tests passed again (20.8 seconds). The reviewer records final visual verification separately
in address-review.md. Full CI and merge/deployment results will be recorded in the PR.
