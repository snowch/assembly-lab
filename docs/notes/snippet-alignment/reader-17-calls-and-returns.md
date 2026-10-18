<!-- Copyright © 2026 Christopher Snow -->

# Reader 17: Calls, returns and the stack

Independent learner review of lesson 17, `calls-and-returns`, with only Before you start and lessons 00–16 assumed. Read `CLAUDE.md`, `docs/style.md` and the snippet-alignment brief. Reviewed the immutable production preview on port 4265, then the final note build on port 4266 for bounded stepper and control checks. No application or test files changed.

## Findings

No new material snippet-alignment finding.

- “The instructions stay in their original order. A C line appears again when later instructions also relate to it.” This explains the repeated line 7 without implying repeated C execution. The full eight-line source remains available separately. Function labels retain the helper/report boundary.
- “No C statement is linked to this instruction.” The save, frame-pointer, reserve-preservation and restore groups use this label. Executing those groups clears the source highlight rather than pointing at a brace. The surrounding investigation explains their purpose.
- “Returns to the code that called this function.” This note is accurate for the two recorded `REPORT` returns: the helper resumes the report, and the report restores its incoming return address before returning. It does not appear as an unconditional claim on the deliberately broken assembly-only recording. The motivation explicitly qualifies the instruction mechanism: “By default, `ret` branches to the address in `x30`; it does not necessarily end the whole program.”
- “These are the compiler's original line references. They may point to a brace instead of the C operation an instruction carries out.” The optional detail retains the recorded helper C4, setup C6 and report C7/C8 references. Normal highlighting instead follows displayed C3 and C7. This distinction is understandable without assuming compiler debug metadata expertise.

The shared multiple-source-lines ambiguity does not occur here: each mapped instruction in this lesson has one associated C line. Several instructions serving the same statement are visible, but that is a different relationship and is explained by the paired grouping and repeated-line note.

## Live viewport and controls

The bounded listing is 495 pixels high in the checked 900-pixel viewport. With its top at 20 pixels, the active C/instruction pair, Back/Next/Reset, slider and status fit in the viewport at both widths. The phone view stacks each C excerpt immediately above its instruction group and wraps the long return expression without splitting its association.

At the call and helper-return transitions, the next target can lie outside the internally scrolled listing on the phone. This is not a finding: the just-run pair remains visible, the status names the next instruction, and the following press reveals that operation. For example, “Ran `ret`. Next: `add w0, w0, w19`.” The whole helper return pair is visible at that point. There is no need to keep both functions visible simultaneously.

The active source highlight follows caller C7 to helper C3 and back, including both returns. Both appearances of caller C7 highlight together, consistent with the stated repetition rule. Save/restore steps do not inherit an old source highlight. The assembly-only failure recording has no invented C column or compiler-reference control.

## Earlier baseline issues, kept separate

The existing `docs/notes/clarity-review-2/17-calls-and-returns.md` findings are outside this change: medium M3, “at consecutive addresses”; low L16, “the first pair of slots”; and the local low M6 hint-heading mismatch. The first phrase remains visible in the checked build. I did not reopen challenge hints for this focused review, so the two hint findings are baseline references, not fresh browser verification. No challenge solution is included here.

## Assumed knowledge

No new prerequisite gap introduced by the aligned snippets was found. C functions, arguments and returns are prerequisites; earlier lessons supply register widths, unsigned shifts, byte addresses, load/store widths and pre/post indexing. This lesson locally explains caller/callee, link register, stack and frame, preservation, alignment, calling convention, leaf function and inlining. The compiler detail explains its own reference numbers. The existing stack-slot assumption belongs to baseline L16.

## Actual checks and evidence

Chromium through installed Playwright, at 375 × 900 and 1280 × 900, explicit light and dark themes:

- Read the rendered lesson and static paired listing; expanded the compiler-reference detail in all four configurations.
- Confirmed three gated steppers before prediction submission. Used the ordinary radio selection and Check your prediction controls, including a nonmatching first prediction, to open them; no storage seeding or bypass.
- Stepped all three steppers to their terminal positions in all four configurations. Recorded every position's source highlight, last/next instruction and status. Confirmed final Next was disabled.
- Took and inspected static listing/raw-reference captures and actual viewport captures during execution, including the cross-function transitions.
- Checked page width in each configuration: scroll width equals viewport width. No browser page errors were recorded.
- On the final port 4266 build, repeated the caller/helper transition captures in all four configurations. On phone, exercised Back, slider keyboard increment, Reset and closing/reopening Complete C source; their states changed as expected.

Evidence is temporary under `/tmp`: scripts `reader17-browser.mjs`, `reader17-final.mjs`, `reader17-controls.mjs`; state/text records `reader17-{375,1280}-{light,dark}.{json,txt}`; static captures with `-listing.png` and `-raw.png`; viewport captures with `-step-calls-and-returns-{0,5,7}-viewport.png` (and corresponding investigation/failure names). Final-build viewport evidence is `reader17-final-{375,1280}-{light,dark}-{0,5,6,7}.png`.

This was a focused independent learner review, not a technical mapping audit or full test-suite run. Did not edit exercises, reveal solution hints, submit successful challenge solutions, or audit assistive-technology behaviour.
