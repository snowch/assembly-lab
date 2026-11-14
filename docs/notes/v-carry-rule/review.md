<!-- Copyright © 2026 Christopher Snow -->

# Independent review of the visible carry rule

Reviewer: separate `carry_review` agent, which did not draft or edit the product. Read repository guidance and the actual lesson, prerequisites and model before the author's design brief. Two distinct passes covered learner/interface concerns and technical accuracy. No product edits made.

## Learner and interface pass

Reviewed the built course at `http://localhost:4174/assembly-lab/#/lesson/adding-and-the-flags`, at 320, 375 and 1280 CSS pixels in explicit light and dark themes. Verified the rendered `data-theme` and actual callout foreground/background. Inspected section 04 captures, including phone light/dark and desktop light/dark.

No blocking finding. The prominent sentence, “V = 1 when the carry into the sign bit differs from the carry out”, is adjacent to the carry diagram and stays visible with the optional circuit closed. Its 16px text wraps to three lines in the narrow contexts and one line at desktop. The caption defines the sign bit as the leftmost retained bit, bit 3 here. The caption stays contained at its existing 11px size; neither it nor the carry arrows overlaps. No horizontal page overflow occurred in any of the six contexts. All four comparison controls remain 44px high.

Keyboard Enter selects the V-only example and opens/closes the optional circuit disclosure. Visible keyboard focus is present in the captures. Dynamic verdicts give both matching and differing carry cases. Definition, example and fresh application remain distinct: section 03 establishes the signed-range meaning; section 04 demonstrates the carry criterion; the later miniature and real instruction tasks apply the flag rules. This change does not add an explanation-only pane or another interaction.

Prerequisites inspected in source: `one-pattern-three-readings.prose.ts` and `four-bit-arithmetic.prose.ts` teach the top bit's signed weight, retained bits, four-bit ranges and incoming/outgoing column carries. This lesson introduces flags and sets/clears locally. No additional unexplained prerequisite was introduced by the two new sentences. The required rule does not depend on opening the XOR disclosure.

## Technical pass

The diff is limited to section 04's highlighted rule/caption and its scoped theme-token CSS. Section 03, arithmetic, state, grading and prediction gates are unchanged.

`fourBitFlags` sets `v: top.carryIn !== top.carryOut`. `flagsModel` reads those top-column carries, and the 32-bit simulator's `addWithCarry` uses the same carry inequality. The controller renders both carries from that model and selects its verdict from their equality. The new sentence states exactly this addition criterion. “Bit 3 here” correctly qualifies the four-bit miniature; it does not redefine the real instruction width. The existing 32-bit bridge uses bit 31.

Browser checks exercised all four existing presets in all six width/theme contexts. Matching carries produce the clear-V verdict; differing carries produce the set-V verdict. Negative overflow and simultaneous C/V are represented correctly. No page errors occurred. The inherited architecture provenance is the recorded Arm DDI0602/AddWithCarry review in `docs/notes/flag-primer/technical-review.md`; no fresh Arm fetch, GNU/QEMU run or physical-hardware claim is part of this narrow wording review.

## Challenged findings

- Rejected: a separate pane is necessary for the added explanation. The rule occupies 54px at desktop and 105px at phone widths and immediately precedes the existing diagram. The range pane is unchanged; another pane would duplicate the existing comparison.
- Rejected: the rule must repeat “otherwise V = 0” in the callout. The default C-only example visibly supplies matching carries and the existing explicit “The carries match, so V = 0” verdict. Repeating that sentence is unnecessary for this change.
- Rejected: the phone element screenshots establish a new heading occlusion defect. The sticky course header is captured across an earlier section-heading position while Playwright stitches the tall element. The rule and diagram are below that position and unobscured. The diff changes neither header nor anchor offsets.

## Evidence and limits

`/workspace/output/v-carry-review/evidence.json` records viewport/theme, geometry, control sizes, preset carries and page errors. Six section captures and `review-carry.mjs` are in the same directory. This review did not run the full suite; the managing session owns focused automated-check results. No novice study or assistive-technology test was performed. These expert checks establish local presentation and model agreement, not demonstrated learning effectiveness or complete accessibility conformance.
