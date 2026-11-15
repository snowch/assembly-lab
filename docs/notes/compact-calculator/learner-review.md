# Compact calculator: independent production learner review

Reviewed 15 November 2026 by a separate Codex session that did not write the production implementation. Applied `CLAUDE.md`, `docs/authoring.md`, `docs/style.md` and the local learning-design skill's attention, state, representation and access criteria. The actual changed source and built UI were assessed before `brief.md` or the author's implementation account. The initial assessment is preserved outside the repository in `/workspace/output/compact-calculator-learner/pre-brief-assessment.txt`.

The approved mock supplied context, not production evidence. This review used the actual course at `http://localhost:4211/assembly-lab/` in `/workspace/calculator-redesign`.

**Final learner verdict: both accepted findings below are closed. No remaining learner/UX blocker was found within the reviewed scope.** This does not replace the separate technical review or required repository checks.

## Findings

### L1: restore the visible flags-checkbox state

**Medium. Accepted, corrected and independently verified. Closed.**

In the initial production build, `Show arithmetic flags` inherited the general text-input reset. The input computed to `appearance: none` and `padding: 8px` inside an 18-pixel box. Its label computed to `display: block`, placing the caption below the box. The checkbox changed its accessible state and opened the flags, but its native checked tick was not visible. This is an observed control-state problem, not a claim about a novice's response.

The smallest correction was a scoped checkbox reset and a sufficiently specific flex-label rule, preserving the label's 44-pixel target. The author applied `appearance: auto`, zero padding, native border/background treatment and flex alignment in `calculator-workspace.css`.

Independent final check on served assets **`index-DOm1WZdt.js` / `index-Cx7F71II.css`** passed at 320 × 500, 375 × 667 and 1280 × 900, in both themes. All six cases computed `display: flex`, `appearance: auto`, zero padding and a 44-pixel label height. Unchecked and checked screenshots visibly differ; clicking the label and using Space operated the checkbox, and unchecking hid the optional flags. Screenshots and measurements are in `final-checkbox.json`, `checkbox-unchecked-*`, `checkbox-checked-*` and `checkbox-final-*` under the external evidence directory.

### L2: identify the half editor's operand

**Low. Accepted, clarified and independently verified. Closed.**

The reviewed initial production disclosure said `Edit a 16-bit half`. It is available beneath a comparison containing A, B and Result, even when `Edit A bits` has not been enabled. The half controls themselves do not name A. The source and interaction show that the action changes A.

Suggested direction: identify A in the half-editor heading or immediate label. This retains the established operation while removing an avoidable inference about which row will change. The managing session was already checking this local clarification when it was discussed; this is not presented as a blind follow-up finding.

The final heading is **`Edit a 16-bit half of A`**. Independent built checks on **`index-9xdr-AQh.js` / `index-Cx7F71II.css`** passed at 320 × 500, 375 × 667 and 1280 × 900, in both themes. The explicit heading was visible with bit editing off; Enter opened it, applying an upper half changed A while preserving B, and Calculate used the changed value. The same heading remained present with the controls usable. Screenshots and results are in `half-final-*` and `final-half.json`. Some immediate mobile captures preceded the horizontal rows' paint; a settled capture after two animation frames confirmed the rows remain visible after half replacement (`half-rows-settled-375.png`). That transient capture state was not accepted as a product finding.

## Learner assessment

The initial decimal route requires no optional disclosure. Width and reading controls are compact, the prefix hint is beside entry, the operands are presented symmetrically, and one Calculate action leads to a numeric result before the bit investigation. Desktop shows the two operands alongside each other; phone stacks them within the page width.

At 320/375 × 667, Calculate starts around y=544 and is visible. A 500-pixel-high phone requires ordinary modal scrolling to reach it. That is an explicit limit of the observed compact layout, not a finding that the control is unreachable. The real mobile dialog is modal, its heading/Close control stays available while scrolling, and Escape/Close return focus to the header trigger. Desktop retains the existing non-modal panel behaviour.

The calculated value, hexadecimal pattern, exact sum/difference and range qualification appear before `Inspect bits and carries`. Changing only the reading preserves the completed retained pattern and updates its decimal interpretation. Editing an operand, a bit, a half, or reusing a result invalidates the prior result instead of leaving an apparently current answer beside changed inputs. A width change also invalidates the result; the feedback distinguishes valid resized patterns from an invalid draft left unchanged.

Calculate's hover colours remained readable in all ten initial geometry cases: approximately **4.98:1** in light and **9.69:1** in dark. The live calculator's pale hover label was not reproduced.

Flags and carries remain optional. The default calculated state has no visible flags. Opting in presents names and values, while the local explanation says no instruction runs and describes N/Z/V. Subtraction uses the distinct no-borrow label and explanation in source; the separate technical review owns the complete arithmetic/architecture check. Carry derivation remains an addition inspection. The required decimal route does not rely on understanding this terminology.

On short phones, explicit oversized-entry submission focused A and placed its input and complete error below the sticky heading. Invalid half submission likewise focused the half input and kept its error inside the visible dialog. Recovery, mixed-prefix entry and Enter-to-calculate worked. Ordinary typing did not invoke that submission-driven focus behaviour.

Keyboard bit editing worked with Space, Home, End and ArrowLeft. The selected bit remained the accessible focus target; editing A removed the old result and flags. Half replacement and result reuse worked. No page-level horizontal overflow or page/console error was found in the main matrix.

## Prerequisites and teaching assumptions

The global scratch tool is available before the hexadecimal, signed-reading and flags lessons. Its basic route assumes familiarity with decimal whole numbers and choosing a width; it must not require the optional arithmetic-flags inspection.

The compact visible hint identifies the hex/binary prefixes. On the corrected build, `Entry & width help` locally supplies `Unsigned: zero or positive`, `Signed: the highest bit has negative weight`, `Hex: digits 0–9 and A–F; four bits per digit`, and binary's 0/1 notation. These are sufficient local meanings for optional tool exploration; this review does not equate reading them with having practised signed arithmetic. The lessons remain responsible for defining, demonstrating and practising those mechanisms.

No extra worked example or exercise is required by this presentation change: it is an optional calculator, and the course's existing explanation/practice gates remain separate. Claims that the more compact route will improve novice understanding remain hypotheses until observed with learners.

## Saved work and lesson isolation

A separate browser pass used entered register predictions, saved notes and an existing failed grading state. Calculator input, calculation, optional flags/carries, closing/reopening, theme changes and navigation to another lesson left those lesson artifacts unchanged. They restored after reload, and the independent prediction gate remained closed. Calculator scratch operands, result and open inspection state survived the promised close/reopen and lesson-navigation transitions.

This pass tested the actual shared header tool, not a calculator embedded in the lesson. It does not claim ordinary reload persistence for calculator scratch work, which the visible tab-scoped persistence statement does not promise.

## Rejected or bounded concerns

- **All controls must fit a 500-pixel-high phone without scrolling.** The useful route is substantially shorter, but the native dialog scrolls. The relevant errors and Close control remain reachable and visible. No such no-scroll requirement was established.
- **Advanced flag terms need to occupy the initial route.** That would make the tool harder to use before the flags lessons. Optional flags plus local help preserve the intended prerequisite boundary.
- **The approved mock proves the production interaction.** It does not. Production integration produced L1 despite the mock's correct checkbox, and required separate geometry/state checks.

## Evidence and limits

Artifacts are outside the repository at `/workspace/output/compact-calculator-learner/`.

- `inspect.cjs` / `results.json`: **10 combinations**, exit 0, using 320/375 pixels at heights 500/667 and desktop 1280 × 900, in both themes. Checked actual theme, native modality, heading/error geometry, hover contrast, result ordering, reading changes, optional flags/carries, width/error recovery, bit keys, half editing, reuse and close/reopen. Served asset: **`index-BjTQibQn.js`**.
- `isolation.cjs` / `isolation.json`: **4 combinations**, exit 0, using 375 × 667 and 1280 × 900 in both themes. Checked saved lesson work, scratch continuity through theme/routes, focus return and unchanged prediction gating. Served asset: **`index-BQKm2lQQ.js`**.
- `final-checkbox.cjs` / `final-checkbox.json`: **6 combinations**, exit 0, on **`index-DOm1WZdt.js` / `index-Cx7F71II.css`**. Independently closed L1 and verified restored local definitions, native keyboard toggling, the 44-pixel label target, reflow and errors. Only the changed checkbox/help states were repeated; earlier unaffected flows are not represented as having been rerun on that asset.
- `final-half.cjs` / `final-half.json`: **6 combinations**, exit 0, on **`index-9xdr-AQh.js` / `index-Cx7F71II.css`**. Independently closed L2, checking the explicit A heading with editing off, disclosure keyboard access, half replacement, unchanged B, subsequent calculation and page containment. This copy-only follow-up did not repeat unrelated model or lesson-state checks.

The external harness initially used a broad `status` locator that also matched operand outputs; it was narrowed to the feedback paragraph. A half-summary selector was also corrected before completing the matrix. These were review-harness corrections, not product failures. No broad suite or source-drafting pass was run by this reviewer, and no full-suite result is claimed here.

Screenshots were inspected for phone short-height states, desktop, both themes, local validation and the final checkbox/help correction. Source-only review covered the workspace state transitions, restored-trace checks and model-derived flag wiring. This is Chromium/keyboard/layout evidence, not a screen-reader or novice study, proof of all arithmetic cases, or verification of every offline-update handoff. The independent technical review and repository checks remain separate.
