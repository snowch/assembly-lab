# Rounding and precision: independent learner review

Reviewed 10 November 2026. Reviewer: independent Codex learner-review agent, inherited model and effort (the interface did not expose their exact names). This agent did not author or edit the lesson and did not read an author rationale. No implementation files changed.

## Scope and evidence

Read `AGENTS.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md` and `.agents/skills/learning-design/SKILL.md`. Used the learning-design essential-route, preparation, assessment, state and access checks. The learner is assumed to have completed Floating-point bits and earlier course lessons, with no prior rounding instruction.

Reviewed the actual built page at `http://localhost:4258/assembly-lab/#/lesson/floating-point-rounding` using Chromium/Playwright at 375×812 and 1280×800, explicitly selecting and confirming both light and dark themes. The page footer showed commit `fc7b2a8`; the HTML build ID was `695b68e99ebfb2d8ae8998d1b325b65023c84d7db8eda6518c87a9dd8e410dfa`. These are observations of this preview, not a claim about later builds.

Browser evidence covers initial state, required decimal comparison and large-integer Add 1 route, neighbouring-value steps, format changes, reset, malformed input, input Enter, fresh-question submission/revision, signed zero, NaN and both infinities. Also checked a binary64 subnormal with its exact-value disclosure open on the phone. No lesson implementation or model source was used to decide these findings. No novice participant or assistive technology was tested; this is an agent review, not evidence of learning effectiveness.

Local reproducibility artifacts are in `/tmp/fp-rounding-review/`: `inspect.mjs`, `states.mjs`, `layout.mjs`, `semantics.mjs`, `assessment.mjs`, `edge-layout.mjs`, `positions.mjs` and screenshots. Temporary logs can contain the submitted assessment and its computed result; this report deliberately omits the assessment answer.

## Findings for sceptic review

### R1. High: required action text is unreadable in dark theme

Quote/location: “Apply value”, “Step to next smaller value”, “Step to next larger value”, “Add 1 to the stored value”, “Reset example” and “Check answer”.

All these controls use text `rgb(232, 238, 237)` on background `rgb(239, 239, 239)` in the actual dark theme. The contrast ratio is approximately 1.02:1. They look almost blank in both tested viewports. This prevents a learner from reliably following the named required actions, despite the controls remaining operable.

Direction: give the floating-point action buttons explicit theme-aware foreground/background/border styles. Check the initial, focus and activated states in both themes. Since this appears to be shared floating-point UI, inspect its other uses as required by CLAUDE.

Evidence: `phone-dark-add1-viewport.png`, `desktop-dark-add1-viewport.png`; DOM-computed colours in `semantics.mjs`. Light-theme text was readable.

### R2. Medium: format changes silently widen the current stored value

Quotes: “The local calculator below reads the decimal as an exact fraction before rounding it to binary32”; “More fraction bits make the steps smaller at the same scale”; controls “Format” and “Enter a decimal value”.

Reproduction: reset the example, retain the entered `12.35`, then select binary64. The short display stays `12.350000381469727`, and the pattern becomes `0x4028b33340000000`. The format switch has widened the already rounded binary32 value. It has not rounded the exact entered decimal to the newly selected format. The decimal field still reads `12.35`, and the only status says “The current bits have been decoded.” After a neighbouring-value step, a format change similarly preserves that stepped stored value while leaving the entry unchanged.

The learner can reasonably use the format selector to compare the two formats for the displayed input. The unexplained state transition instead preserves an earlier rounding error and can obscure the lesson's precision comparison. Keeping the current value is a legitimate operation, but its provenance needs to be stated.

Direction: decide whether selecting a format rounds the exact entered decimal again or converts the current stored value. Make the selected behavior explicit beside the selector, and distinguish the draft decimal from the value whose bits are currently being shown. Verify fresh, applied, stepped, Add 1 and invalid-entry states.

### R3. Medium: the neighbour caption suggests the wrong two rounding candidates

Quotes: “An exact local calculation of the entered decimal and its binary32 neighbours”; “Nearest rounding chooses the closer of two representable neighbours”; result labels “Next smaller value” and “Next larger value”.

At default input `12.35`, the selected stored value is `12.3500003814697265625`. The two displayed next-value outputs are approximately `12.34999942779541` and `12.350001335144043`: neighbours of the stored result, rather than the two candidates surrounding the exact entered decimal. The upper output lies beyond the already selected rounded result. After stepping or Add 1, the unchanged entry makes the referent less clear still.

A beginner trying to see *why* nearest rounding chose the result can mistake those two outputs for the two alternatives the rounding rule compared. The required large-integer route happens to use an exactly representable starting value, which conceals this ambiguity.

Direction: name the current stored value as the reference for next-value operations and caption. If the initial figure is also intended to demonstrate the nearest choice for the entered decimal, make the actual two candidates around that exact input identifiable. Keep the current-value neighbourhood and rounding-candidate comparison distinct.

### R4. Medium: special values are presented as ordered neighbours

Quotes: with NaN selected, “Next smaller value” = “NaN” and “Next larger value” = “NaN”; with positive infinity selected, “Next larger value” = “Infinity”. The corresponding step buttons remain active.

The page correctly says NaN “is not a finite distance”, but the surrounding UI still presents it as its own smaller and larger neighbour. The infinity endpoint similarly claims that an unchanged infinity is larger than itself. Clicking these controls gives the general decoded status without explaining why the value did not move. This conflicts with the preceding instruction that these buttons “move between representable values”.

Direction: explain endpoint/non-ordered states locally and disable nonexistent directions, or label these outputs as endpoints rather than smaller/larger values. Preserve the valid direction from infinity to its finite neighbour. Recheck NaN, both infinities, both zeros and the smallest subnormals.

### R5. Low: the repeated decoder separates the required input from the rounding controls

Quote: “Enter 16777216 and press Apply value. Read Next larger value, then press Add 1 to the stored value.”

At 375×812, the entry field begins at document y≈1982, “Next larger value” at y≈3728, and Add 1 at y≈3911. The learner must cross more than two screen heights of bits, field definitions and value reconstruction between entering the required input and operating the rounding comparison. These views repeat mechanisms the prerequisite lesson has already taught. The final-bit evidence also sits well above the comparison it supports.

Direction: keep the relevant retained bit, current value, neighbouring values and Add 1 comparison close together. Consider moving the full field decoder/reconstruction into a clearly optional detail while preserving all evidence needed for the essential rounding route. This is a teaching-load recommendation, not a claim that the page overflows.

## Preparation and essential route

Main observable outcome: decide how an unfamiliar exact input rounds at a known binary32 spacing, using the final retained binary bit to distinguish a tie from decimal digit parity. Deferred topics are other rounding modes and Arm execution/FP control state.

- **Defined:** exact decimal versus stored value; rounding; nearest choice; binary ties to even; 24 significant binary digits and exponent-dependent spacing. The sentence saying that “Even” concerns binary digits rather than the last printed decimal digit makes the intended distinction explicit.
- **Demonstrated:** the initial pump value exposes a finite-binary representation error. The named required action at `16777216` gives an exact integer sum followed by one format rounding, with distinct “Exact sum before rounding” and “Stored sum after rounding” labels. It does not require discovering an optional preset. The prose after the figure explicitly connects two-unit spacing to a lost one-unit increment.
- **Practised:** the visible, independent fresh question uses another input and requires a stored decimal value. Its result is not present before submission. A result matching the computed value receives “That matches the computed result.” Other submissions receive “Compare your answer with the calculation below, then revise your answer.” This accurately claims a numeric comparison, not proof of the learner's reasoning. Editing the answer hides the previous feedback; Enter submits. The assessment does not request or grade an explanation, so successful guessing or copying after reveal remains possible and should not be called demonstrated conceptual mastery.

Skipping optional disclosures does not remove the essential facts: the initial stored expansion is printed in the prose, nearest-even is defined visibly, and the large-integer Add 1 action is explicitly required. Opening Exact stored value is a named action rather than an unannounced dependency.

The large integer is a useful small *complete* rounding example despite its digit count: the neighbouring gap and the increment are small integers in the real binary32 format. A smaller-magnitude real-binary32 example would require long fractional decimal candidates, while a miniature format would add a width-mapping bridge. A toy width is unnecessary here. The bridge from scale to spacing is present after the figure; a stronger local comparison of both candidate retained bits would reduce dependence on mental reconstruction. R2–R3 currently blur what value and candidates the explorer represents.

## Prerequisite assumptions

The page reuses sign/exponent/fraction, normal values, bias, implied leading 1, binary32/binary64, hexadecimal patterns, signed zero, infinity and NaN. These are within the stipulated Floating-point bits prerequisite, rather than newly unintroduced mechanisms for this review. The page defines rounding, significant binary digits and the final-bit even rule locally. Ordinary fraction reduction, powers of two and halfway arithmetic are assumed.

“Parity” appears in “rather than the parity of the input” without a local gloss. I did not inspect every earlier course lesson to establish whether that word has already been taught, so I do not assert it as a confirmed prerequisite violation. The correction direction, if earlier preparation does not introduce it, is to use or gloss the familiar even/odd distinction.

## State and access checks that passed

- Apply via Enter updates the explorer. Invalid decimal text produces a nearby alert and `aria-invalid`; the previous numeric state remains. Reset returns format, entry, stored bits and operation output to the default example.
- Width changes and steps clear stale Add 1 output. The fresh question retains its own fixed format and input independently of explorer changes.
- Signed zero has the expected distinct sign display and exact-value disclosure. Special-value field explanations are visible; no normal-value reconstruction formula is presented as the NaN/infinity formula.
- No horizontal page overflow at either tested width in either theme, including a binary64 subnormal's expanded exact decimal. No checked rendered lesson text was below 11px. All lesson controls met the repository's 40px phone height rule; bit targets were approximately 36.8px wide and 40px tall.
- Keyboard Tab reaches Apply value after the decimal entry; a visible 3px focus outline appears, and Enter activates it. Explorer and question fields have associated visible labels. Error/status nodes expose alert/status roles. These checks do not substitute for a screen-reader review.

## Decision and outstanding evidence

Keep the exact-decimal opening, explicit named Add 1 route, binary-versus-decimal even distinction and independent numerical application. Resolve R1 before accepting the required dark-theme route. Clarify R2–R4 before treating explorer outcomes as an unambiguous demonstration; consider R5 when reducing phone reading load.

All findings are proposals for independent sceptic review, not self-certified accepted fixes. No fixes or later-build verification are recorded here yet. No full suite was run for this read-only review. Browser inspection found usability and state evidence; it does not establish beginner learning or all model edge-case correctness.

## Independent correction check, 10 November 2026

After `/tmp/fp-build4.log` reported a completed build, this same independent reviewer checked the corrected rendered page without reading implementation edits. The checked HTML build ID was `fde59fca615e4faaa7c78168b7d026d8dc38ee8dcbbc54ea4a7808ea52387828`. The footer still reports the repository's previous committed revision; the build ID distinguishes this check from the initial review.

All four viewport/theme combinations passed the focused interaction rerun: 375×812 light and dark, 1280×800 light and dark. Requested theme and actual `data-theme` were checked together. Screenshots were inspected as well as DOM text and computed styles. No remaining blocker was found in this lesson's required route.

| Finding | Correction observed in the built page | Independent result |
| --- | --- | --- |
| R1 | Action buttons now have explicit readable surfaces and borders in both themes. | Closed. Active floating-point action text contrast measured approximately 17.75:1 in light and 14.42:1 in dark. Phone action heights measured approximately 45.9px. Screenshots confirm readable labels. |
| R2 | The visible note says: “Changing Format converts the current stored value. To encode the decimal in the entry field directly in the selected format, press Apply value again.” | Closed by explaining the chosen conversion behavior. Switching the default stored value to binary64 preserves it; pressing Apply value then encodes the entered decimal in binary64. Reset restores binary32 and the original example. |
| R3 | The caption now says: “A local calculation of the stored value and its next smaller and next larger representable values.” | Closed. The caption and format note identify stored-value provenance before the operations, without claiming that the outputs are the entered decimal's two rounding candidates. |
| R4 | NaN says it “has no place in numeric order” and “has no next smaller or next larger value”; its two step controls and Add 1 are disabled. Infinities display “No larger value in this format” or “No smaller value in this format”, with the corresponding nonexistent direction disabled and the finite direction enabled. | Closed for the reviewed UI ambiguity. NaN no longer supplies NaN as an ordered neighbour. Both infinity endpoint states were checked in all four combinations. |
| R5 | Rounding rule, neighbouring values, step controls and Add 1 now precede the full field decoder. | Closed. Entry-to-Add 1 separation is approximately 652px on the phone and 318px on desktop, compared with approximately 1928px on the original phone layout. The required calculation is reached before traversing the repeated decoder. |

The unconfirmed vocabulary concern was also removed: the independent-task direction now says “whether the input is even or odd” instead of using “parity”.

The focused rerun checked initial state, exact decimal application, widening followed by Apply value, required large-integer Add 1, both neighbour steps, stale operation-output removal, invalid input via Enter, alert/invalid state, reset, NaN, both infinities, independent-question Enter submission, computed-match feedback and feedback clearing on edit. It found no page errors or page overflow in these states. Feedback now refers to the “explanation and computed result”, accurately describing what is revealed. No assessment answer is reproduced here.

Artifacts: `/tmp/fp-rounding-review/fixcheck.mjs`, `fixcheck.txt`, `fixed-phone-light-initial.png`, `fixed-phone-dark-initial.png`, `fixed-desktop-light-initial.png`, `fixed-desktop-dark-initial.png`, and the corresponding `fixed-*-add1.png` screenshots.

Two preliminary Node harness runs exited unsuccessfully before completing: the first assertion inadvertently matched a persistent instruction's label when checking removed operation output; the second expected the previous feedback sentence. Inspection of the rendered page established both as harness problems, and only those assertions were corrected. The final focused run passed all four combinations. No full suite was run by this reviewer, and these focused results do not change the status of any separately run suite.

This closes the five learner-review findings for the identified corrected build. The original limitations still apply: no novice learning observation or screen-reader validation was conducted. No implementation edits were made by this reviewer.
