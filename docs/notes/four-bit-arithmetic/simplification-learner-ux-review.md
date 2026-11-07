# Carry simplification: independent learner and UX review

Copyright © 2026 Christopher Snow.

## Role and evidence boundary

Independent reviewer; no lesson prose, controls, product code or tests authored. The review uses the repository learning-design skill, authoring/style rules and visual-language guidance. No standalone UX skill is installed; attention, state, representation and access criteria are supplemented by ordinary UX checks for visible status, consistency, minimal controls and recoverable actions. This is expert review, not a novice study or proof of learning transfer. Reviewer configuration confirmed by the managing session: `gpt-6.1-sol`, high effort, fresh session (`fork_turns: none`).

The actual lesson, Module 0 fundamentals and synthesis, the actual split `same-bits-two-readings` lesson in `pacing-1-4.ts`, and `READING_SEQUENCE` copy were read before the author’s simplification brief. The legacy aggregate reading lesson was also inspected, but the prerequisite conclusions below come from the actual split route. The simplification brief was read only after forming the initial assessment.

## Independent learning assessment

The useful outcome is to trace a column with two operand bits and an incoming carry, then distinguish the kept bit from the bit passed to the next column. Width retention and constructing a subtraction compose that mechanism in the retained page. Circuit gates and ALU architecture can stay deferred to Bit Lab; Module 0 has already defined, demonstrated and practised ADD input/destination roles.

Prerequisites are supported: Module 0 teaches registers, ADD/SUB operand roles and sequences. Signed and unsigned readings defines positional contribution, demonstrates a complete four-place example, gives fresh small-pattern practice, bridges to 32 bits and asks for fresh application. The retained page still needs to define and demonstrate carry and invert locally; those are not assumed to have been practised earlier.

The 3 + 3 example earns its size: bit 0 supplies the incoming carry that joins two operand ones at bit 1. A smaller one-column example cannot demonstrate that hand-off. Its separate Carry/Kept outputs and the later four-place boundary serve different jobs. The subtraction walkthrough is a complete worked composition before the fresh exercise. The exercise checks the broader method, not a learner’s verbal account of carry weight. No new diagnostic activity is required for this authorised simplification; transfer of the carry explanation remains unmeasured.

## Source checks

The simplified route defines a carry before its first figure, names the incoming carry as a third input, explicitly explains the two output roles and their different places, and retains the note that revealing a column does not execute another instruction. It preserves the width boundary, invert/add-one method and fresh exercise. Removing the ALU objective and closing activity removes a second teaching task; the new carry paragraph develops the mechanism already being demonstrated rather than adding another task or control.

Bit Lab’s updated ALU backlink was inspected only in source (`/workspace/bit-lab/content/index.ts`, with its canonical paragraph in `docs/notes/adder-architecture-copy.md`). It points to `#/lesson/one-addition`, an existing first Module 0 lesson whose actual content runs ADD and identifies its inputs and destination. Its promise matches the destination. No Bit Lab browser behaviour or other Bit Lab activities were reviewed.

## Challenged and rejected items

- **Candidate: a missing prerequisite for the small signed weights. Rejected.** The actual prerequisite route teaches, demonstrates and practises the top negative weight and unchanged lower weights, then bridges width explicitly. The current lesson’s four-place reminder is sufficient.
- **Candidate: the required three-input case should become another exercise. Rejected for this change.** The required worked route encounters it at bit 1 and the user authorised a smaller page, not another assessment. It remains a learning-evidence limitation rather than a product defect.
- **Candidate: deleting the closing architecture activity removes essential ADD preparation. Rejected.** Module 0’s first lesson already teaches input/destination roles and gives fresh practice. The retained bridge names the move to 32-place subtraction.

## Browser review

Reviewed the managing session’s final production build at `http://localhost:4511/assembly-lab/#/lesson/four-bit-arithmetic` on 7 November 2026, after notification that the copy/build was stable. Used the existing Playwright Chromium installation; installed no dependencies, built nothing and ran no product test suite. An ad hoc read/interaction script and raw screenshots/measurements are temporary artifacts in `/tmp/carry-ux-review/` (`report.json`). The browser process and contexts were closed before releasing the browser to the technical reviewer.

| Actual browser check | Evidence and result |
| --- | --- |
| 375 × 812, light and dark; 1280 × 900, light and dark | Stepped and visually inspected initial, bit 0, bit 1, complete and reset screenshots in each combination. Actual `html[data-theme]` and computed backgrounds agreed with the theme: light `rgb(243, 246, 245)`, dark `rgb(16, 22, 21)`. No page errors. |
| Initial state and reset | Both outputs and unrevealed result bits show `?`; initial carry is 0; no connector remains. Reset returns to this same state and preserves focus on Reset. |
| Required bit-1 mechanism | The built prose says “the incoming carry adds a third 1” and gives separate Keep/Carry bullets. After the second reveal, the equation visibly has A = 1, B = 1, Carry in = 1 and two distinct outputs of 1. The kept bit stays in bit 1; the connector reaches bit 2’s carry input. The same labels appear in accessible descriptions. No optional note or extra mode is required. |
| Full carry connectors | Measured path start at the outgoing Carry box’s bottom centre and path end at the destination’s top centre for bit 0, bit 1 and complete in all four combinations. All four coordinate deltas were 0 px. The last 16 px of shaft remained vertical, with marker reference 8 matching the arrowhead tip. Visually inspected the full elbow and head; they reach the next-column input or final outside-width box. |
| Complete state | Four retained bits form the computed worked sum; final carry is separately labelled outside the grid. Next column exposes `aria-disabled="true"` while retaining focus, and Tab reaches Reset. No extra instruction is represented. |
| Keyboard and scrolling | Space steps Next column while focus stays there. Scroll position before/after the first reveal stayed 1445 px on phones and 1055 px on desktops in both themes. Tab then Enter operates Reset. Exercise digit typing advances focus and ArrowLeft moves to the preceding digit. Focus outlines remain visible. |
| Reflow and retained figures | Page/body width equals the viewport at both required widths. The retained width-boundary diagram and invert/add-one figure remain readable; the subtraction flow stacks vertically on phones. A supplementary 700 px light check shows the addition explanation and bit-1 view without overflow (`body`/`html` widths 700 px). |
| Exercise gates, restore and clear | In every required width/theme combination: blank submission is blocked; deliberately incorrect work fails and keeps the solved note closed; reload restores that work and optional scratch notes without opening the solution; corrected work completes; reload restores completion and the solved note; Clear work → Discard work empties answers/notes and closes completion/solution again. The answer is intentionally omitted from this review. |
| Page scope | Rendered objectives contain only the three retained outcomes. There is one column walkthrough and three topic sections; no closing ALU activity. The short bridge to 32-place subtraction remains visible before completing the exercise. |

No assistive-technology user, screen-reader audio, forced-colours mode, non-Chromium browser or real mobile device was tested. Accessible equation/cell descriptions and live-status semantics were inspected in the DOM, not claimed as a screen-reader experience. No learner was observed; the review cannot establish transfer or retention. Build/typecheck/full-suite results belong to the managing session’s validation record, not this browser review.

## Findings and decision

**No supported learner or UX defect remains in this change.** Severity: none; no corrective product direction is requested. The built page supports the source assessment: keep the smaller route and its existing worked carry demonstration, boundary and fresh subtraction practice. The remaining uncertainty is whether a novice can independently explain carry weight after the page; a novice session would provide that evidence.

The candidate that an extra arrow must also connect the Kept output to its cell was challenged in the built page and rejected: both top and destination use the explicit Kept label, while the current column is labelled Revealed. An additional connector would add competing movement to the one distinction being taught. The complete Carry arrow already carries the non-local relation that requires a path.
