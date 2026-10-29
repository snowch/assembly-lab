# Remove the published-draft label

Copyright © 2026 Christopher Snow

## Brief

The user requested removing Published draft and merging when done. Remove the
published-module badge and the notice that explains it, including the no-JavaScript
front page. Keep computed lesson availability and navigation. Unavailable modules
may still use the existing Planned/Being written labels. This is a deletion of
approved text; no new learner-facing prose is drafted.

Update existing static and browser expectations for absent published badges while
retaining the plan, title/number/description, lesson-link and no-script checks.
Remove the obsolete styling-only check of badges absent from the current plan.
Historical review/plan records describe past work and are not learner-facing UI.

## Independent review

Independently reviewed in separate learner and technical passes by GPT-6.1 Sol
(`gpt-6.1-sol`), High effort. Read the repository rules, brief, actual diff and
existing static/shell coverage. No product or test edits by the reviewer.

**Learner pass.** Inspected final front-page screenshots at 375/1280px, light/dark,
with JavaScript on/off. The published badge and explanatory notice are absent,
without an empty notice/badge gap. Cover, plan headings, module text and lesson
entries remain clear and ordered. With scripts enabled, prerequisites remain
accessible from their keyboard-operated disclosure and the start link opens the
first lesson. This removes approved text and introduces no new prerequisite or
learner claim. No finding.

**Technical pass.** An independent Chromium script passed all eight configurations
against the final 8.97s build on port 4401, after fonts loaded. Checked actual theme
and computed backgrounds, including CSS colour-scheme rendering with scripts off.
All 15 modules and five parts retain matching ordered title/number/description
vectors across script modes. Inspected all 34 interactive lesson hrefs, verified
Start navigation, opened/closed prerequisites, and followed the no-script footer's
Where next anchor. No published status element or notice remains; no horizontal
overflow, console error or page error occurred. Source review confirms statusOf,
lesson availability/navigation and Planned/Being written labels remain intact.

The no-script renderer already provides a cover/plan/footer summary, rather than
the interactive prerequisite panel or lesson links; those existing boundaries were
preserved. Unavailable-module labels were source-reviewed because every current
module has available lessons. Updated tests retain module title/number/description,
lesson links, ordering, cover alignment and no-script/footer checks; only obsolete
published-label expectations and the absent-badge styling check are removed.

Evidence: /tmp/remove-published-label-independent-review/review.mjs, results.json
and screenshots. Limits: Chromium viewport review, not physical devices or other
browser engines; no lesson/model sweep or deployment verification. The separate
focused shell result below retains its expected desktop-only phone skip.

## Validation

Strict TypeScript, the existing strings/static-page unit tests (2 files, 22 tests),
and the production build (8.97s) passed. Focused front-page/no-script browser checks:
11 passed and 1 expected phone skip (desktop-only column geometry), in 36.5s.
No new low-impact implementation-mirroring tests were added. Existing tests now
verify absent publication badges while retaining plan and navigation coverage.
Full CI and deployment results will be recorded in the PR.
