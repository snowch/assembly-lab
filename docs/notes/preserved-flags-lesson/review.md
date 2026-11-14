# Independent review: instruction that last wrote the flags

Reviewed by the independent carry-review session, which did not author this change. Applied CLAUDE.md, docs/authoring.md, docs/style.md and the local learning-design skill. Actual changed source and the initial built page were read before the author’s brief. Separate learner/interface and technical passes followed. The available reviewer model was retained; no claim is made that a different model would establish teaching quality.

## Learner and interface pass

**Decision: keep the narrowed three-section lesson.** Its observable task is to identify which executed instruction supplied the flags beside a later result. The initial question, prediction and gated walkthrough remain discoverable. The final paragraph states flag lifetime without repeating the preceding lesson’s range/carry teaching or six-case practice.

Prerequisites checked in source and the preceding built lesson: 32-bit register patterns and hexadecimal notation in Module 1; instruction stepping and register writes earlier in the course; `sub` in Subtraction and reuse; `adds`, N/Z/C/V, signed/unsigned interpretation and carry reasoning in Addition and its flags. The reminder gives the `add`/`adds` distinction locally. No new unsupported prerequisite was found. No later branch or condition-code knowledge is required.

The earlier single-addition work defines and demonstrates flags, and practises their calculation. This lesson composes two familiar additions and asks about their provenance. A smaller example containing only `add` would require an artificial unexplained initial flag state. Keeping the first `adds` provides an observable source and makes “preserved”, “recomputed” and “cleared” distinguishable. The existing before-commit prediction is the fresh application; the following stepped example supplies feedback. A separate repeat overflow task adds no distinct evidence for this objective. This route is a learning-design judgement, not evidence that beginners have learned it.

Independent Chromium checks at 320, 375, 834 and 1280 pixels, light and dark, used final reviewed asset `index-Du8GqUMV.js`. Actual `data-theme` matched the preference in all eight contexts. At each size:

- Fresh prediction has no outcome; selecting an option does not reveal one or open the stepper. Wrong and matching checked predictions produce distinct feedback. The gate requires checking, not guessing correctly.
- Keyboard Enter advances the focused Next button. The first instruction writes a register and changes flag values; the next writes its result while leaving the flags intact; return retains those flags. Words and outlines distinguish register writes from changed flag values.
- Back and Reset work. Reset restores the starting register and removes write/change tags. Reload retains the checked prediction and open gate; no step-position persistence is asserted.
- The removed challenge is absent. The shared completion control works and remains marked after reload, plan return and re-entry. No deleted obligation blocks completion.
- Previous/Next travel through Addition and its flags and Measuring elapsed ticks and return to the stable `flags-and-overflow` route with the new title. The course-plan link has the new title too.
- Page scroll width equals viewport width. Text, flags and controls remain readable, with flags in two rows on phones. Actual screenshot inspection covered phone/tablet/desktop and both themes. No browser page errors occurred.

The preceding carry teaching and calculator were checked in the separately recorded follow-up-removal and operand-layout reviews; this change does not edit their model or rendering. This review does not subsume the later, separately reviewed removal of duplicate inline calculators.

## Technical and sceptic pass

The published pacing selects exactly introduction, the unchanged failure-experiment prediction/stepper, and the short flag-lifetime explanation. The canonical challenge, mount, labels and recap prose were removed together. Canonical prose records match the narrowed explanation. The same stable lesson identity/order is retained. C/V cross-references that needed range teaching now point to Addition and its flags.

Read the retained SUM_FLAGS listing, call inputs, RunPrediction calculation/gating and StepperFigure state logic, and corresponding facts/browser tests. Browser-observed register/flag transitions agree with independent 32-bit arithmetic and the `add` versus `adds` rule. Prediction outcome is calculated from `traceOf`; feedback is not a hard-coded answer selector. The source already ties this assembly-only example to the GNU/QEMU differential corpus. No fresh QEMU or physical-hardware run was performed by this reviewer.

### Accepted finding

**Medium, release verification blocker: stale regression test depends on the deleted exercise.** `packages/views/src/feedback-regressions.test.ts:54–65` asks `exercise("smallest-overflow")` for three out-of-range cases, but this challenge is correctly absent from LESSONS after the change. Independent `npx vitest run packages/views/src/feedback-regressions.test.ts` exited 1 with 3 failures and 14 passes, all three reporting `Missing challenge smallest-overflow`. Direction: preserve the grader’s range/no-invented-flags assertions with an explicit fixture or equivalent surviving task; do not restore the redundant learner activity. This is a test dependency issue, not a broken learner interaction. The managing session replaced the lookup with a schema-parsed local fixture using the same arithmetic program and grader, an explicit numeric field and the same three invalid submissions. The original range and no-invented-flags assertions remain. Independently read the fixture and reran the same file: exit 0, 17 passed. No product source changed for this correction, so the built-page evidence remains applicable. Closed; no open review blocker remains.

### Rejected concerns

- **“The short explanation leaks the prediction.”** It states the already taught instruction rule, without the worked numeric outcome. The actual computed answer and explanation remain behind commitment. Tested initial and merely selected states contain no outcome, and the stepper is closed.
- **“Removing the final challenge removes all application.”** The retained prediction composes an earlier flag writer with a later non-writing instruction and distinguishes plausible incorrect rules. The preceding six-case calculation practice remains. Completion is a saved lesson mark, not proof of understanding; the review makes no such equivalence.
- **“`sub` is a new assumption in the final paragraph.”** It is introduced and practised earlier in Subtraction and reuse; the introduction map confirms that ordering.
- **“The old URL is inconsistent with the new title.”** It preserves saved links and navigation; the visible course-plan, page and neighbouring navigation labels use the new title. No technical meaning depends on the URL spelling.

## Evidence and limits

Scripts, screenshots and per-context results are outside the repository in `/workspace/output/preserved-flags-lesson-review/`. `initial.json` records the source-first initial page read; `browser.json` records all eight context results, actual themes, asset and stepped states. `*-step.png`, `*-end.png` and `*-preserved.png` show the inspected states. Element screenshots can include the sticky header over the top of the long captured figure; normal viewport inspection did not identify a layout overlap defect.

The first evidence script attempt imported `expect` from the wrong package; two later attempts used incorrect course-plan selectors (first an individual lesson as a module, then a label without its `L2:` prefix). These were harness failures. Corrected selection uses the actual stable route link and all eight contexts passed. The initial data probe used an ambiguous repeated heading locator; targeting the h1 fixed it. None is reported as a product fault.

The managing session reports 105 targeted source/prose/pacing/state tests passed. This reviewer independently recorded the original feedback-file failure and the corrected 17-test pass separately above; a full-suite result is not claimed here. There was no novice study, screen-reader or other assistive-technology user session, fresh native execution, or exhaustive accessibility audit. The remaining learning-evidence gap is whether a prepared novice can explain flag provenance on another unfamiliar sequence without coaching.

## Canonical-copy addendum after the initial full check

The managing session’s initial full check on `8405225` stopped with two unit failures and 3,537 passes: the exact canonical-copy assertions in `pacing-1-4.prose.test.ts` and `pacing-10-a.test.tsx`. Independently inspected `/workspace/output/calculator-and-flags-full-check-initial.log`; these were record-equality failures. The initial failure remains a failure; no browser/full-suite pass is inferred from the focused correction.

**Accepted medium source-record finding, now closed.** `docs/notes/course-pacing-implementation/copy.md` still recorded the former title and two former C/V links, and lacked the new explanation heading. This second canonical record was missed in the earlier source-record review. Direction: mirror the already reviewed source, preserving the source’s complete JSON shape and wording. The correction changes only this document’s new title, explanation heading and two links; product source and built UI are unchanged.

Independent correction verification bundled each actual copy module and deep-compared its complete exported object with the corresponding parsed JSON block in this document: `pacing-1-4.copy.ts`’s `COPY` and `pacing-10-a.copy.ts`’s `pacing10A` both match exactly. The managing session’s focused log `/workspace/output/canonical-copy-final.log` records two suites passing, 31 tests. One preliminary reviewer comparison used an unbundled transform and could not resolve the first module’s prose import; the corrected bundled comparison resolved the real dependencies and passed. No assertion was weakened. Existing UI evidence applies because only a drafting record changed. A fresh fixed-HEAD full check remains the managing session’s next step.
