# Lesson programmer calculator: review and release record

## Result and scope

Integrate the approved compact calculator as a local course-owned tool, using five explicit lesson presets. Optional disclosures appear after hexadecimal teaching, after the 32-bit reading bridge, after four-bit width retention, beside the constant-building example, and inside the existing register-prediction scratch area. Guides are optional tool-operation practice with fresh typed answers; course assessments still test the concepts. No tool accepts a graded artifact or callback, executes an Arm instruction or sets flags. Notes, exact/whole arithmetic helpers, existing programs and graders remain.

Pure BigInt functions are adapted from the user's programmer-calculator repository with a pinned source record in source.md. The mathematical model lives in the machine package; source provenance, type boundaries and excluded standalone features are explicit. No external runtime dependency or iframe. A supplementary full-calculator link remains a normal new-tab anchor.

## Process and independent reviews

Applied the local learning-design skill, CLAUDE.md authoring rules, style checklist and visual-language guidance. Separate GPT-6.1 Sol Medium draft supplied the canonical strings; separate High implementation agents ported the numeric core and React component. Managing session wired the course and integration tests. Independent High learner/UX reviewers each reviewed one whole lesson at 375×812 and 1280×800 in actual light/dark, using prerequisite source reading and selected earlier-page browser visits before author rationale; no reviewer replayed every earlier lesson. Separate Extra High technical/sceptic reviewer independently checked numeric source, all five placements, state/form boundaries and the learner findings. These are agent/browser checks, not novice-learning evidence.

Full working reports in the execution environment:

- /tmp/course-calc-review-hex.md
- /tmp/course-calc-review-readings.md
- /tmp/course-calc-review-arithmetic.md
- /tmp/course-calc-review-halves.md
- /tmp/course-calc-review-widths.md
- /tmp/course-calc-review-technical.md

## Accepted findings and corrections

- A1: Fixed unsigned arithmetic result was labelled only Decimal. Reading-aware labels now identify Decimal (Unsigned), or the chosen reading in the selector presets, without introducing signedness in the first hexadecimal tool.
- A2: Generic range error referred to applying after Calculate. Use neutral within-range wording valid for both controls.
- H1: Numeric shift amount needed units and distinction from placing a MOVK half. The label names bits; local qualification says it shifts the whole 32-bit pattern and discards bits beyond the width. It does not execute an instruction.
- W1: Optional width worked example named the start but omitted a completed resize. It now shows the B example through 64→32→64. Fresh task uses a distinct 9 pattern; neither fills course answers.
- W2: Long decimal value could split inside its last comma group. Protect complete groups, permit breaks between groups and use a smaller long-value font. Technical sibling inspection found the same issue in the full/retained arithmetic result codes; those now reuse the group renderer and are checked with a large64-bit sum.
- Parent layout finding: existing figure-card selector defeated an initial specificity override, wasting width with a second card. The effective override removes the redundant outer card. Container queries now show 8 cells in the full-width 375px lesson calculator and 32 on a wide course page. The narrower calculator inside the register challenge can use fewer columns according to its actual container. Four-bit rows stay four fixed cells; visible faces remain 26×24, indices11px, digits16px. Touch activation is40×40, fine-pointer wide-container activation28×40.

Each learner reviewer independently confirmed its applicable final fixes on served build b4adc867b117c287cd73ccc036ee91222d420dc39cf5ba1f98f0a853254cce6e. Technical reconciliation and final checker evidence are in the technical report. A later technical sibling check found the arithmetic-result extension of W2; build097f7beb01186df52d7ce7dec2f66dd19d05c736e36155ea8dd196e0596a27cb changes only that decimal-result formatting and has separate independent 320/375px light/dark checks.

## Rejected concerns and limits

Correct guide submissions establish operation of the tool, not unaided calculation, overflow understanding or conceptual mastery. The surrounding lessons supply the mechanisms. The four-bit fresh guide case does not wrap; separate implementation boundary tests prove wrapping behaviour, not learning it. Keep the existing fresh course tasks as assessments.

Lesson capabilities are contextual presets, not a persistent lock/unlock progression or an assertion that every later keypad must expose all earlier tools. Direct entry to later lessons works. Closing/reopening retains transient working; coordinated update handoff restores it once, while ordinary refresh starts transient calculators closed. No ordinary-navigation/reload persistence promise is made. Notes retain their existing independent persistence/failure fallback.

Do not equate this numeric tool's resizing with W-register writes, sign extension, C overflow rules or architectural flags. The upstream standalone subtraction flag convention differs from AArch64; no flags were imported. No opcode or native/differential corpus change was needed for a mathematical scratch tool.

## Validation before commit

- Numeric-model focused run:56 tests passed, including all512 four-bit add/sub input pairs checked in both readings, shift counts, exact64 bounds and half preservation. Complete machine suite:10 files/535 passed. Independent technical oracle additionally checked699 assertions using BigInt.asUintN/asIntN and quotient/remainder.
- Component focused run:9 passed. Initial run had8 pass/1 test-selector failure because a broad Retained bits query matched copy and result. Scoped the meaningful result assertion and reran successfully. Initial typecheck also rejected three unsupported exact options in test-only ByRoleOptions; those were removed, preserving default exact string matching. Original results remain separate from passes.
- First managing-session integration run:5 files/36 passed. Final overlapping numeric/component/notes/content run:5 files/78 passed. These overlap and are not additive.
- Strict repository typecheck passed after the test-option correction. Core-only strict compile also passed. Initial full typecheck while concurrent UI files had not yet landed failed on missing imports; no numeric diagnostic was present.
- Initial full-tree formatter found the new copy file; formatting it corrected whitespace only. Final formatter, copyright and diff-whitespace checks passed. Canonical fenced copy matches the final source exactly.
- Production build passed before and after supported refinements; the broader b4adc build14.60 seconds and the focused097f result-format rebuild17.22 seconds, with existing bundle/annotation warnings. Preview4254 served that build for final reviews.
- Initial focused browser run:32 passed/no skips, including earlier scalar tools, new presets, offline interaction and prediction/notes isolation. Final rerun adds a same-viewport container-only 4/8/16/32-column regression check:33 passed/1 skipped (the desktop fine-pointer geometry test is intentionally skipped by the phone project). The first subsequent eight-case targeted run had4 passed/4 failed: its geometry assertion incorrectly required one DOM rectangle per inline number group. Independent inspection showed separate digit/comma rectangles on the same visual line. The corrected assertion requires all nonempty rectangles of each group to have matching top/bottom within1px, preserving detection of a group splitting across lines. The original command remains failed; corrected outcome is recorded separately below/with release evidence.
- Independent technical browser checks include all20 preset/device/theme combinations, exact-container checks, long64 at320px, field errors, scratch Enter isolation, one-shot handoff restoration, note-storage failure recovery through editor reset, and unchanged scalar division helpers. Handoff browser evidence seeds the supported snapshot; it is not a claim to have triggered every service-worker restart path.

Evidence paths: /tmp/course-calculator-{integration-tests,focused-final,types,types-rerun,types-final,format,format-final,build,build-final,browser,browser-final}.log and the independent reports' linked harnesses/screenshots. Some exploratory reviewer harnesses failed on guessed/ambiguous labels or exact native-select label expectations. Their corrected actual-label runs are recorded separately; do not count the original commands as passes.

Full required CI, exact tested tree, merge commit, Pages deployment and public checks are recorded in the pull request after completion. Full-suite outcomes/skips remain distinct from focused results. Physical devices, screen readers, a novice study, complete external-calculator arithmetic/flag equivalence and non-Chromium browsers were not audited.


## Final focused outcomes

The corrected targeted browser run passed8/8 (34.9s), separately from the initial4pass/4fail geometry-assumption run. The assertion now also requires nonempty groups, so removing the renderer cannot pass vacuously. Independent technical and width/arithmetic learner checks closed the result-format follow-up on097f, with exact values unchanged, readable complete groups at320/375 in both themes and no overflow. The final managing-session local browser script passed20 preset/device/theme combinations, including all five guide checks, exact64 arithmetic, actual external popup/source-state preservation, notes/gate isolation, keyboard focus and container geometry. Its original run stopped on the same rectangle-count assumption; /tmp/course-calculator-local-first.log retains that failure, and /tmp/course-calculator-local-rerun.log plus /tmp/course-calculator-local.json record the corrected20-case pass. Representative final phone/desktop screenshots were visually inspected. Full required CI and public deployment verification are still recorded separately after completion.
