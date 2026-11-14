<!-- Copyright © 2026 Christopher Snow -->

# Independent review: overflow-direction tabs

Reviewer: separate `carry_review` agent, which did not author the new tabs. Reviewed the actual diff and built page before the author's brief, under the repository authoring and learning-design guidance. No product edits made. The earlier dedicated-pane review remains a separate record.

## Learner and interface pass

The dedicated pane now shows one complete worked addition at a time. “Too positive” is initially selected and “Too negative” is visibly available beside it. Each selected example retains its input/result bits, enlarged sign column, carries, causal explanation and verdict. The always-visible rule and new summary still identify both possible overflow directions. The matching-carry explanation and fresh reasoning check remain outside the tabs.

This meets the requested reduction in simultaneous content without turning the essential rule into a disclosure. The learner can apply the visible carry criterion without visiting the second tab. Visiting “Too negative” supplies the second complete causal demonstration; tab visitation is not treated as successful assessment.

No new prerequisite gap was found. The new labels use directions already taught in the preceding signed-range pane. “Signed overflow” and the sign bit are defined before this control; XOR remains deferred. The existing sign-column explanations and miniature limitations are unchanged.

Inspected the built candidate at port 4184, asset `index-CygIb_mG.js`, in ten Chromium contexts: 320/375/834/1280 CSS pixels, light/dark, plus 375/1280 System theme with dark browser preference. Verified the actual theme and colours. Both selected states have correct model-derived carries, stored sign, binary column and contextual bit-pattern names. No page overflow, equation clipping or runtime errors occurred. Tab targets are at least 44px high. Phone/tablet and desktop captures show a contained selector and complete example.

The labelled tablist, each tab's selected state/control target, and the panel's labelled role are exposed correctly. The inactive panel is absent from the browser accessibility snapshot. Arrow Left/Right wrap; Home/End select the first/last tab. Focus follows keyboard selection. Tab moves from the selected tab to its panel and then to the reasoning check; the inactive tab and hidden panel are skipped. Clicking or keyboard-switching tabs preserves an open reasoning disclosure and the saved miniature answer. Reload retains that answer and restores the intended positive default. This is browser accessibility-tree/keyboard evidence, not a screen-reader-user test.

## Height comparison

Measured the untabbed live course at the same widths and browser settings, waiting for fonts. Its asset was `index-cs4PToL0.js`, with two visible examples and no tabs. Measurements are whole dedicated-section heights with the reasoning check closed. Local new positive/negative heights match across light/dark.

| Width | Previous | Too positive | Too negative |
| --- | ---: | ---: | ---: |
| 320px | 3221px | 2575px | 2603px |
| 375px | 2822px | 2283px | 2310px |
| 834px | 2378px | 1893px | 1920px |
| 1280px | 1839px | 1817px | 1844px |

The default view is about 19–20% shorter on phone/tablet. Desktop height is effectively unchanged: the previous version showed both examples side by side, so tabs mainly reduce simultaneous information there. Do not claim a substantial desktop height reduction.

## Technical pass

The arithmetic, example inputs and existing explanatory strings are unchanged. Rendering wraps each complete example in a labelled tabpanel and hides the negative panel initially. Switching changes only `hidden`, active styling, `aria-selected` and roving `tabIndex`; it does not rerun arithmetic, recreate the examples, call the save path or change prediction work.

Both visible states match their original model columns and signed-range interpretation. The additional summary correctly describes positive overflow becoming a negative retained reading and negative overflow becoming non-negative. The four-bit scope and later 32-bit bridge remain intact. No assessment inputs or worked assessment answers were added. The earlier independent exhaustive 256-pair criterion check remains applicable because no arithmetic or model code changed.

## Findings and challenged concerns

No blocking learner, interface or technical finding; no correction requested.

- Rejected: hiding the second example removes the essential rule. The rule, both-direction summary, one complete example and matching-case explanation remain visible. The second direction has a named, keyboard-accessible tab, explicitly requested by the user.
- Rejected: a hidden tabpanel still exposes its example to assistive browsing. Actual browser accessibility snapshots exclude the inactive example's heading and include only the selected panel.
- Rejected: tab switching resets reasoning or saved work. The open disclosure, checked miniature selection and exact saved lesson JSON remain unchanged through switching, with the miniature selection restored after reload.
- Rejected: the change substantially shortens desktop. The measured desktop height is almost unchanged. The supported benefit there is reduced simultaneous content.

## Evidence and limits

`/workspace/output/v-carry-tabs-review/evidence.json` contains the ten contexts, role snapshots, model values, geometry, theme and page errors. `baseline.json` contains the live comparison measurements and asset identity. Scripts and positive/negative screenshots are in that directory. Screenshot capture hides only the sticky shell header after normal checks, to avoid a stitched-image artefact.

The managing session owns focused/full test-suite and release results. This reviewer did not run the full suite. No novice study or assistive-technology user test was performed; the review does not establish learning effectiveness or complete accessibility conformance.
