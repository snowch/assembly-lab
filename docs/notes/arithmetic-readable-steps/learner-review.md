<!-- Copyright © 2026 Christopher Snow -->

# Independent learner review: arithmetic lists

Reviewed 4 November 2026. Requested reviewer configuration: GPT-6.1 Sol, High.
No implementation edits or commits were made by this reviewer.

## Verdict and findings

No supported learner-facing findings. Severity: none. The eleven new list blocks distinguish
facts from procedures, retain the relevant qualifications, and render clearly in the checked
browser matrix. No correction is requested.

This judgement comes from the actual lesson sources and rendered pages. I did not read the
change's brief, draft, canonical prose notes or author's rationale before forming it. I read
`CLAUDE.md`, `docs/authoring.md`, both closing passes of `docs/style.md`, the front page's stated
prerequisites, the relevant earlier lesson material, the three changed prose modules, and their
actual published lesson mappings. The final subtraction lead was read again in source and in the
built page after it identified both inputs.

## Evidence for the judgement

- **Arithmetic with four bits:** “Start at the right with carry 0” precedes adding the two bits
  and incoming carry. The next step explicitly sends the carry to the column on the left. The
  diagram revealed the rightmost result first and then moved left, matching that procedure.
  The weights and binary-addition cases use bullets; the calculation uses numbering. “These
  four-bit miniatures are not Arm registers” stays directly above them. “Revealing a column
  does not execute another instruction” remains before the control it explains.
- **Subtracting by addition:** “Calculate `0011` (3) minus `0101` (5)” gives first and second
  inputs before the numbered procedure refers to them. Invert, add one, then add to the first
  input matches the complete diagram. The cancellation explanation and the qualification
  “These signed values fit” remain nearby.
- **Practice order, considered and rejected as a finding:** “Enter the opposite”, “Enter the
  retained result” and “Decide what to do with an extra leftmost carry” correspond to two
  text fields followed by the carry-choice group. This reads as an answer-entry sequence.
  The worked calculation and width example above already explain how to obtain those
  entries. The list adds no fresh-task solution. The solved note stayed absent initially,
  after an incomplete submission and after an incorrect submission.
- **Loading a constant:** the three hexadecimal representations remain paired with their
  decimal numbers, with the half-boundary space preserved inside code formatting. The
  “Some other patterns load too” qualification is visible before the prediction. The
  bullets supply the same evidence the original prose supplied; they do not print the
  prediction's checked explanation. The number tester stayed locked until checking.
- **Building a constant:** “To split a non-negative 32-bit integer into halves” remains the
  scope of all three numbered steps. Division, taking the whole-number part for the upper
  half, and taking the remainder for the lower half retain their order and meaning. The
  local definition “This amount is the remainder” and the worked equality immediately
  following the list connect the rule to an example. The worked stepper distinguishes the
  replaced upper half from the retained lower half. The fresh construction's solution
  stepper remains gated on a passing submission.
- **Two’s complement:** bullets distinguish the unsigned and signed readings of the same
  pattern, the four-bit ranges, and the later 32-bit ranges. The negation procedure keeps
  the explicit low-four-bit step. “When that value fits at the original width” remains
  before the procedure. Changing the first figure left the separate negation figure's
  starting pattern unchanged. The zero and minimum-value controls demonstrated the
  width and representability qualifications; reset restored the stated starting pattern.

Headings still expose the progression: adding columns, keeping four places, subtracting by
addition; loading a constant, building a constant; one pattern with two readings, negation,
and the return to 32 bits. List markers and continuation-line indentation remain visible at
phone width. Numbers, code spans, signs and half boundaries remain readable in both themes.

## Preparation, demonstration and practice

The addition procedure defines carry before use, demonstrates a complete four-column addition,
and then supports the subtraction example and fresh subtraction task. A smaller one-column
addition would omit the repeated carry propagation that this example makes visible. The width
boundary is demonstrated separately before the fresh task needs it. No additional bridge is
needed for this list edit.

The construction page defines `movk` and the position of its half, demonstrates a small complete
construction, then gives the division procedure before the fresh construction. A smaller
example with identical halves would make “new” versus “kept” less distinct; the existing worked
example is suitable preparation. The appendix demonstrates the signed-weight rule and complete
negation before inviting changes to the original pattern. These are exploration controls, not
unannounced required exercises.

## Assumed prior knowledge

No newly unexplained prerequisite was found in the changed passages. The review checked these
possible assumptions against their earlier or local introductions:

- Binary digits, place values and basic arithmetic are explicit front-page prerequisites.
- Hexadecimal, `0x`, set and clear bits, signed and unsigned weights, and a top bit's negative
  weight occur in the earlier published Reading hexadecimal and Signed and unsigned readings
  material. The appendix also restates its four-bit weight rule locally.
- Registers and instructions are defined in `fundamentals.prose.ts` before this material.
  Its function introduction explains “GCC, a compiler” and calls `-O1` “an optimisation
  setting that asks it to make code shorter and faster”; it also locates the argument and
  result in `w0` and explains `ret`. The constant-loading page explicitly defines its
  no-argument `void` syntax and the distinction between the halves before using them.
- Carry and invert are defined on the four-bit page before the procedures need them.
- `movk`, `lsl 16`, the optional `#`, whole-number division and remainder are explained locally
  on the construction page. Width is defined locally in the appendix.

This is a focused review of the changed explanations and their prerequisites, not a new audit
of every earlier lesson.

## Browser coverage and limits

Chromium drove the production preview at `http://localhost:4173/assembly-lab/`. The preview
contained the final prose recorded by commit `f38e5a2`; its earlier footer SHA was outside this
review's scope. All four routes were checked at each of 375 and 1280 pixels, in both light and
dark themes: sixteen route/width/theme combinations. I inspected full-page captures for every
combination, individual list captures, and representative stepped and edge-state figures.

For every combination, the actual `data-theme` and body colours matched the selection. The
light background was `rgb(243, 246, 245)` and dark was `rgb(16, 22, 21)`. The document width equalled
the viewport width. The new unordered lists used visible disc markers and the new ordered lists
used decimal markers. No console or page errors were recorded.

The following states were exercised at both widths in both themes:

- Four-bit addition: initial hidden columns, each successive column, completed columns, reset.
- Four-bit practice: incomplete submission, incorrect submission with solved note still gated,
  passing submission, restored completion after reload, and cleared work with the note gated again.
- Constant prediction: unselected, selected, checked, and number-tester gate opening only after
  checking. The initial prose and listing were also inspected for premature solution disclosure.
- Constant construction: initial example, first and second instruction, reset; initial invalid
  challenge and blocked submission; passing challenge, revealed solution stepper, restored
  completion, and cleared work with its stepper gated again.
- Appendix: initial figures, changed reading bit with the other figure unchanged, reading reset,
  zero, minimum signed input, negation reset.

Temporary evidence is in `/tmp/arithmetic-learner-review/`: `browser-records.json`,
`state-records.json`, the browser-driving scripts and route/width/theme PNGs. Representative
phone captures are `four-bit-arithmetic-375-light-initial.png` and
`building-constants-375-dark-stepped.png`.

No repository test suite was run by this reviewer. These were focused browser observations,
not a claim about the full suite. External C/Arm documents, screen-reader output, other browser
engines and exhaustive input combinations were not checked. No beginner learning session was
observed; an independent learner review does not establish measured learning outcomes.
