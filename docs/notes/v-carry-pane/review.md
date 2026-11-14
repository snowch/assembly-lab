<!-- Copyright © 2026 Christopher Snow -->

# Independent review: dedicated carry-rule pane

Reviewer: separate `carry_review` agent, which did not draft or implement the new pane. Reviewed actual source and built content before the author's brief. This replaces neither the earlier callout review nor its evidence: the user requested a different placement and a causal explanation. No product edits by this reviewer.

## Learner/interface pass

The new section 04, “Why unequal carries mean signed overflow”, is visible between the signed-range teaching and programme-choice comparisons. It has its own outline entry, title and highlighted rule. Eight lesson sections are rendered. The rule is discoverable without opening a tab or disclosure.

The pane demonstrates the reason, rather than restating the inequality: each complete four-bit addition is followed by an enlarged sign-bit column, incoming/outgoing carries and the stored sign bit. Its prose explains why two non-negative inputs cannot produce a negative exact sum, and why two negative inputs cannot produce a non-negative exact sum. The wrong stored sign follows from the exact sum failing to fit. Both overflow directions are covered. The lower paragraphs cover matching carries and opposite-sign inputs.

The matching paragraphs are related but do different work. The first connects matching signs and bounded opposite-sign sums to representability; the second derives carry equality from the sign column. Removing the second would weaken the requested explanation of why the carry test works. Neither introduces XOR terminology before its later optional explanation.

Prerequisites reviewed in source: `one-pattern-three-readings.prose.ts` teaches two readings and the top bit's signed weight; `four-bit-arithmetic.prose.ts` teaches column addition, incoming/outgoing carries, retained bits and four-bit ranges. The new lead defines the sign bit locally and names the width. The preceding section defines signed overflow through range. No new unexplained prerequisite was found. Familiarity with those terms does not itself establish that a novice can explain this mechanism.

The fresh task supplies different starting inputs from the worked examples and subsequent assessment. It asks for V and what it means for the signed sum, with an initially closed reasoning check. That check is keyboard accessible. No existing challenge's exact input pair or worked solution is exposed. As in any teaching example, later exercises may share flag values; this is not itself answer leakage.

## Built evidence

Inspected candidate JavaScript `index-VZ_BjEoe.js` at port 4174. Chromium contexts: 320, 375, 834, 1101, 1200 and 1280 CSS pixels in light/dark; additionally 375 and 1280 System theme with a dark browser preference. These are 14 contexts. Measured actual theme/foreground, page overflow, bit-row widths and sign-column text bounds. No page overflow, bit-row overflow, equation clipping or page errors occurred. The smallest central sign-column box is about 100px wide at 320px, while its longest equation text is about 86px. Intermediate widths 1101/1200 were checked to challenge the two-column layout breakpoint.

Inspected captures at phone, tablet and desktop in both themes. Phone examples stack and remain readable; desktop examples sit side by side. The unchanged shell can appear across a stitched element screenshot; normal layout probes were unmodified. Such capture artefacts do not establish content overlap. The reasoning summary is 44px high in every context. Enter opens/closes it and the initially hidden feedback is revealed correctly. No assistive-technology check was performed.

Evidence: `/workspace/output/v-carry-pane-review/evidence.json`, screenshot PNGs and `review.cjs`. These checks concern the built pane, not a standalone mock. Full lesson/browser suite outcomes remain the managing session's record.

## Technical pass

`carry-proof.ts` consumes course `FlagsModel` instances. Bits, carries, sign-column inputs/total, stored sign and signed readings come from that model. `controller.ts` passes the existing positive/negative comparison models and a fresh four-bit model. No scripted arithmetic replaces the model.

Checked the rendered two worked cases against their model columns, signed sums and stored signs. The sign-column arithmetic is explicitly labelled binary, so the two-bit total is not misrepresented as decimal. The lead and existing 32-bit bridge distinguish the miniature's bit 3 from the instruction's bit 31.

Bundled the actual `fourBitFlags` implementation into a review-only harness and exhaustively checked all 256 four-bit input pairs. In every case V equals carry inequality and equals failure of the exact signed sum to fit −8 through 7. Recorded the fresh model separately in `model-evidence.json`. This supports the general criterion as well as both worked examples. The unchanged simulator's `addWithCarry` sets V using the same top-carry inequality. Architecture provenance remains the repository's recorded Arm DDI0602/AddWithCarry review; this pass did not rerun GNU/QEMU or fetch Arm documentation.

The same-sign explanation covers the possible sign-column cases. When the two input sign bits are zero, unequal carries force a stored sign bit of one; when both are one, unequal carries force a stored sign bit of zero. Matching carries preserve the common input sign. With opposite signs, the column adds one plus the incoming carry, so outgoing equals incoming; their sum lies between the operands and fits. These claims hold for zero and boundary cases too.

## Findings and challenged concerns

No blocking learner, layout or technical finding.

- **Low, accessible pattern name (`carry-proof.ts`, `bits`).** The bit pattern's generic `span` has `aria-label`, while all digit children are `aria-hidden`. A generic span is not a reliable named accessible object. The surrounding exact-sum and sign-column text still exposes the taught mechanism. Direction: give the pattern an appropriate named role or provide a text alternative. This is a source-semantics finding; no screen-reader result is claimed. Verification pending if corrected.
- Rejected: matching/opposite paragraphs merely repeat one another. They respectively connect the range meaning and derive carry equality; both support the requested causal explanation.
- Rejected: two desktop columns necessarily collide near their breakpoint. At 1101/1200 the narrower example and its formula remain contained; measured bounds and 320px checks challenge both likely extremes.
- Rejected: displaying the carries makes the fresh task meaningless. The task intentionally asks the learner to apply the taught comparison and explain its implication. The result explanation remains behind the reasoning check. It is a supported application, not proof of independent learning by itself.

No novice study was performed. This independent expert review and model enumeration do not establish learning effectiveness or full accessibility conformance.

## Final candidate: accepted finding corrected

The accessibility finding was accepted. The managing session added `role="img"` to each pattern and made its name contextual, including the row label and all four bits. No teaching copy, model calculation or geometry changed.

Independently rechecked actual final assets `index-CgauTEBe.js` in four fresh Chromium contexts: 375/1280px, light/dark. All six input/result patterns are now exposed by their image role and exact contextual accessible name in both role locators and the browser accessibility snapshot. The hidden digit children no longer leave the pattern unnamed. Enter still opens/closes the reasoning check, the actual theme is correct and there is no page overflow. This closes the source-semantics finding; it is not a screen-reader-user test.

Clean final captures hide only the sticky shell header for capture, after normal geometry/interaction checks. See `final-375-light.png`, `final-375-dark.png`, `final-1280-light.png`, `final-1280-dark.png`, `final-evidence.json` and `final-recheck.cjs` under `/workspace/output/v-carry-pane-review/`. No remaining blocking finding identified. The earlier 14-context geometry/model review remains applicable because the final product change affects only role/name semantics.
