<!-- Copyright © 2026 Christopher Snow -->

# Independent review: optional addition carries

Reviewer: separate `carry_review` agent, which did not implement or draft the inspector. Reviewed actual source and initial built UI before the author's brief, under repository authoring/learning-design guidance. Work and evidence were kept separate from the prefix-entry checkout while its full suite ran. No product edits made.

## Learner and interface pass

Show carries is initially off and appears only for Add in Calculate view. Its pressed state and control target are accurate. When enabled, Carry in is a distinct dashed row above A/B/Result inside their existing shared scroll region. The local help says each carry joins the same bit column, that bit 0 starts with carry 0, and which selected-width bit is the sign bit. That column is highlighted consistently. High/Low bits remain available.

The highest carry-row entry is the carry **into** the sign bit. The outgoing carry is separately labelled “outside the retained word”; it is not appended to the retained result as another stored bit. The summary gives the two carry ports, C as the outgoing carry, and V as their XOR. XOR is defined before the numeric V equation. C is explicitly labelled unsigned and V signed, so changing the decimal reading does not silently change the flags' interpretation.

The initial copy called V “signed overflow” without stating its range meaning. Because the global header can open before the flags lesson, this was a local prerequisite gap. The accepted correction now defines the exact signed sum falling outside the selected width's signed range before the XOR explanation and equations. It adds a meaning, not a duplicate carry-proof lesson.

The inspector stays optional: when off, it adds no carry rows or teaching summary to the usual calculation. When on, its extra rows/labels have a comparison job and remain together. On a phone, C/V equations stack and the prose wraps legibly; on larger screens, the two ports and equations remain paired. Existing scratch-work guidance still says the controls do not run instructions. The new help qualifies this as ordinary addition; no physical CPU circuit, timing or instruction execution is claimed.

## Built checks

Final candidate asset `index-QJiaUdUb.js`, port 4206, was independently checked at 320/375/834/1280 CSS pixels in light/dark. Each of the eight contexts exercised all four sign-bit carry pairs at both 32/64 bits and both unsigned/signed readings: 16 combinations per context. Numeric carry ports, C/V and carry-row lengths/top/low cells matched the independently expected combinations. Bit 0 is zero after calculation. Values do not depend on the chosen decimal reading.

Checked all shared-row bit coordinates: corresponding carry/A/B/result cells align to within 0.1px. High bits exposes the labelled highest column; the sign-column marker is visible and indexed correctly. Toggling by Space keeps focus on the toggle and preserves an arbitrary horizontal offset of 137px. The offset and carry preference also survive close/reopen.

Before Calculate, enabled carry cells are unknown and no numeric C/V summary exists. Changing B removes the old summary, including when the replacement is invalid. Use result as A also returns to unknown until calculated again. An unapplied A draft correctly leaves the valid loaded-A calculation unchanged. Source inspection confirms the existing settings/apply/edit invalidation path clears traces for other applied changes; the managing session's focused component/browser checks cover those paths separately.

Edit bits hides the Calculate inspector from the accessibility tree while preserving a valid calculation and preference. Subtract and Shift left remove the control, row and summary, even after their own valid calculations; returning to Add preserves the preference and requires a fresh calculation. A real lesson-route change preserves the workspace/preference and leaves saved lesson work unchanged. Reset returns carries to off.

No page/dialog overflow or page errors occurred in the eight-context pass. Toggle targets remain at least 44px high. Final phone-light and desktop-dark carry-summary captures were inspected; the new range definition and XOR help are readable and precede the equations. No screen-reader-user, zoom/high-contrast or physical-touch test was performed.

## Technical pass

`calculatorAdditionCarries` validates patterns through the existing unsigned calculator addition and obtains the exact raw sum. The existing simulator identity `(A XOR B XOR sum) & mask` produces carry **into** each bit. The helper extracts the highest incoming carry and the separate outgoing bit, then derives C/V. Both operands are bounded word patterns; the initial incoming carry is zero. Signed reading never changes those patterns. The new helper makes no claim about a processor's physical implementation.

Independently bundled the actual helper and compared it with a separate per-column carry recurrence and exact signed-range test for 520 cases: all 256 four-bit pairs, every top-carry combination at 32/64 bits, and deterministic additional wide patterns. All passed. Invalid negative or oversized patterns reject. The four-bit enumeration verifies the primitive; the header still offers only 32/64 bits. The managing session separately owns its simulator-comparison tests. This reviewer did not rerun GNU/QEMU or hardware.

The component derives carries only from a valid Add trace's A/B/width, rather than from live B text or persisted flag values. Existing trace invalidation is preserved. Calculating a signed full result and computing unsigned carry from the same operand patterns is correct: C and V answer different questions. There is no Subtract borrow or shift-carry inference.

Only `showCarries` is added to workspace state. Earlier snapshots default off; derived carries/C/V are not saved as authoritative state. Independently seeded browser handoffs with forged saved carry/flag/output numbers: valid source metadata restores the visibility preference and regenerates the correct row/C/V; mismatching source metadata yields unknown carries with no numeric flags; an older snapshot without the preference stays off. One-shot handoff storage is consumed. Reviewed the actual component handoff test as source. These seed checks are narrower than a full service-worker upgrade transaction.

## Findings and challenged concerns

- **Low, initial local V meaning (`strings.calculator-carries.ts`). Accepted and corrected.** “Signed overflow” was named without its range meaning for users opening the header before that lesson. The final `overflowHelp` defines the exact signed sum falling outside the selected-width signed range before XOR/V use. Final built screenshots/source confirm its placement and eight-context layout remains contained. No further correction requested.
- Rejected: the top entry of the carry row should be treated as carry out. It is aligned under the retained sign-bit index and is explicitly an incoming carry. Carry out is separately labelled outside the word.
- Rejected: Signed mode should suppress or reinterpret C. Addition's bit-pattern carries are independent of the decimal reading. The separate unsigned C and signed V labels make their roles explicit.
- Rejected: a pending A draft should clear valid carries immediately. Apply has not changed loaded A. Preserving the current trace until Apply succeeds is consistent with the existing workspace; B changes invalidate directly.
- Rejected: carry values should remain visible for Subtract/Shift when the preference is on. The ordinary-addition inspector would then imply incorrect borrow/shift semantics. Those operations deliberately hide it.
- Rejected: restoring saved numeric carry/flag fields is necessary to preserve work. Valid source trace metadata suffices and is safer against stale fields; the browser fixtures confirm regeneration rather than trust.

No remaining blocking learner/interface or technical finding identified. An explanation from a novice on fresh inputs would still be needed to assess learning; agent inspection is not that evidence.

## Evidence and harness history

Scripts, JSON and screenshots are under `/workspace/output/calculator-carries-review/`: `browser.json` records eight contexts and 128 selected-width/reading/top-carry combinations; `model.json` records the 520 independent checks; `handoff.json` records valid/stale/old snapshot cases. Initial UI evidence used `index-CgOGwat-.js`; final matrix and handoff fixtures used `index-QJiaUdUb.js` after the local definition correction.

The first functional harness timed out waiting for the lesson's initial miniature input during an overlapping helper rebuild. The initial page had not mounted that input. A later source/page probe found the normal controls, and the retry after the build stabilised passed all eight contexts. The exact transient cause was not independently established; no arithmetic or product navigation defect was inferred. The original harness is retained as `browser-first.cjs`; its failed command is separate from the successful retry.

Full repository checks, eventual rebase/revision identity, publishing and live verification belong to the managing session. The original review did not run the full suite or claim a release result; later log inspection is recorded in the addendum below. No novice study or assistive-technology user test was performed; this review does not establish learning effectiveness or complete accessibility conformance.

## CI viewport assertion: independent follow-up

The initial pushed CI run `43632175425` and the separate initial PR-triggered CI run each failed four new carry-inspector cases, covering both themes in both browser projects. Each log records 3,546 passing unit tests, 1,511 passing browser tests, 21 skipped and four failures. Each failure resolves the correct sign cell (bit 31, value 1) but reports viewport ratio 0 after High bits. Separately, the local full run pinned at `e802b1b` passed: 3,546 units, 1,515 browser tests and 21 skipped, ending with “All checks passed.” Read the CI logs (`carries-ci-initial-failure.log`, `carries-ci-pr-initial-failure.log`) and local log (`carries-check.log`) under `/workspace/output/`. The local pass does not erase either failed CI result.

The original test combined two independent scroll dimensions. High bits changes the comparison region's horizontal offset; it does not move the surrounding dialog vertically. Its test immediately required the sign cell to intersect the viewport, even when the row could remain below the dialog's visible area.

Independently reproduced that failure mode in four 320×900 contexts, desktop/phone browser settings and light/dark. Placed High bits near the viewport bottom, a valid position obtainable by scrolling the dialog. The button bottom was about 882px. Clicking it set horizontal scroll to 0 and fully exposed the sign cell horizontally after the sticky row label, but left dialog vertical scroll at 413px. The cell's top was about 1,119px, below the 900px viewport, so its intersection ratio was 0. Its bit/value and C/V remained correct. Explicitly bringing the cell into view moved the dialog to vertical scroll 1,096px; intersection ratio became 1 and horizontal scroll remained 0.

This is a measured reproduction of the same failure signature, not recovered CI geometry. No CI trace artifact was available to this review, so the exact original runner's vertical state is unknown. Source inspection and the reproduction establish that the original combined viewport assertion was not justified by the horizontal-only action; no product defect is established by that assertion.

The accepted test-only correction keeps the horizontal-scroll-zero check, adds whole-cell containment after the sticky label and within the scroll region's right edge, then explicitly scrolls the sign cell vertically into view and rechecks horizontal zero and viewport intersection. Read the actual diff: the original alignment/value checks remain, and the final viewport assertion is retained. This separates horizontal correctness from vertical reachability and also catches a genuine overlap with the sticky label. Product source is unchanged.

Repeated the forced-bottom reproduction after inspecting that test correction; all four contexts satisfy the new horizontal-bound checks and the explicit vertical-reachability endpoint. Inspected before/after phone captures. Evidence is `ci-repro.json`, `ci-repro-before-test-fix.json`, `ci-repro.cjs` and `ci-*-beforevertical.png` / `ci-*-aftervertical.png` under `/workspace/output/calculator-carries-review/`. Read the subsequent corrected focused-run log `/workspace/output/carries-viewport-fix-browser.log`: all six carry browser cases pass. This is a separate rerun result and changes neither original CI outcome. The managing session also reports a passing strict typecheck. Final-head full remote CI remains pending; this addendum does not claim its outcome. No new learner-facing change or novice/assistive-technology validation is involved.
