# Logger layout review record

## Decision and implementation

Keep the existing page-count address example, arithmetic, registers, lesson route, stored activity ID, independent width prediction and exercise. Move setup into the section's ordinary prose, with three semantic input/transform/destination bullets. Keep one outer heading. The card starts with labelled starting registers and its single executable instruction. A visible instruction note gives the equivalent plain spelling; local action guidance precedes Run. Optional limits follow the controls, including after execution/reset. Decimal prose uses grouping; assembly and computed state strings retain valid ungrouped syntax.

The shared component conditionally renders empty title/prose and supports optional instruction/action prose at those locations. Its paragraph reset now selects direct status/result paragraphs, leaving nested Markdown prose with ordinary paragraph spacing. No platform files, machine implementation or native program/calls changed. The new layout retains all byte/address definitions, consecutive-byte numbering, page-count-to-distance mechanism, human readability reason and non-memory-access qualification before optional details.

The numeric provenance test normalises valid comma-grouped decimal prose into a whole integer before comparing against the same model-backed fact set. It does not whitelist the fragments or remove numeric assertions. The existing meaningful browser cases retain their arithmetic, restored state, references, theme, overflow and gate checks, adding one-heading/list structure and control-before-note order. The existing view cases now use the same note/action/empty-title setup as the actual activity, including exact large X values.

## Separate passes

Draft: fresh GPT-6.1 Sol Medium agent, /tmp/logger-layout-draft.md; suggested wording retained in draft.md. Independent learner/UX: fresh GPT-6.1 Sol High, /tmp/logger-layout-learner.md. Independent technical/sceptic: fresh GPT-6.1 Sol Extra High, /tmp/logger-layout-technical.md. These state configured selections, not hidden runtime internals. Both reviewers received actual lesson/prerequisites/sources before the author brief, judged the whole built M1 L7 page in actual phone/desktop light/dark themes and checked shared primitive siblings.

Accepted low finding: the parent accidentally stripped a word boundary while transferring the separate draft, producing “instructionto”. Corrected source and both current canonical records; the original draft was already correct. Final rebuild and independent rendered checks confirm the space. No arithmetic, gate or timeout changes were needed. Additional review conclusions and exact final evidence are recorded in the PR; do not treat this record as novice validation.

## Verification

Initial focused run: six files / 89 tests passed. Final focused rerun after source correction and view-case alignment: six files / 89 tests passed. These overlapping runs are separate, not 178 distinct tests. Existing adapted browser cases: eight passed, no skips, in 25.5 seconds. Final production build, standalone types, formatting, copyright and whitespace checks passed. Original parent patch script assertion exited before writing files; its corrected application succeeded. No failed test result was relabelled as a pass.

Final parent Chromium matrix: 375×812 and 1280×800, each actual light/dark. Exact current copy, three outer bullets, one heading, starting X state, formed distance, pending/Run boundary, keyboard Run/reset and Tab to optional note, reload/restored/reset state, legacy-state isolation, independent width gate, default W shifted-register and introductory caller views, no horizontal overflow or page/console errors. Results: /tmp/logger-layout-local.json and /tmp/logger-layout-local.log. Phone/light and desktop/dark whole-section screenshots were visually inspected.

The technical reviewer independently checked the unchanged native operand corpus: one program / six calls / 18 instruction states / zero differences, plus matching 91400c02 encodings for plain and explicit forms. Its own browser matrix covered both shared siblings and measured paragraph separation inside the optional note. Reports give those checks' exact bounds. Focused and review results do not replace the complete check. Required full CI, its skips/failures, merged-tree identity, Pages release and public checks are recorded separately in the PR when complete.

No beginner study, physical phone observation, screen-reader session, complete accessibility audit or general mixed-width/wide-prediction redesign is claimed. This is a layout and wording organisation change to the same worked application; the existing independent exercise remains unchanged. Its learnability improvement is supported by bounded independent review, not measured novice learning.
