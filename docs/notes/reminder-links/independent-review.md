# Independent learner and technical review

Copyright © 2026 Christopher Snow

Reviewer: independent GPT-6 agent, separate from the reminder and returned-reading authors. Applied `CLAUDE.md`, `docs/authoring.md`, both closing passes of `docs/style.md`, and `.agents/skills/learning-design/SKILL.md`. This is an agent review, not an observed novice study.

## Source review

Read the 75-route published inventory and the changed lesson copy and assembly points. Reconciled the three audit tables against the inventory: Modules 0–4 enumerate 27 routes, Modules 5–9 enumerate 22, and Modules 10–Appendix B enumerate 26. There are no missing, duplicate or extra routes. Decisions include reasons for retaining local explanations without adding another link. Coverage does not mean every lesson needs an added reminder.

The reminders retrieve concrete mechanisms: state carried across instructions, whole versus partial replacement, bit weights, flag provenance, conditions, shift fill, widening, product halves, saved values and native build provenance. Read the target concepts in the earlier lesson data as well as the link labels. New mechanisms, syntax and essential exercise directions stay visible locally. Existing forward references and the supplementary appendix are distinct from prerequisite retrieval links.

For the returned-bit explanation, inspected the model-derived lower contribution, top-bit weight and both sums, the C type statement, the opt-in lesson property and prediction/call gating. The smaller worked candidate already exists in the four-bit readings and arithmetic lessons; this addition supplies the bridge to the actual 32-bit result, rather than another subtraction exercise. The new computation occurs after the calls. The application distinguishes interpreting the same bits from executing arithmetic, and distinguishes the C return type from a register type tag. The implementation recomputes values from the recorded programs on restoration.

Compared the final export with the original inventory: all 39 newly introduced lesson-target relationships resolve to published lessons earlier in the course. The runtime explanation’s additional reading link also targets earlier preparation.

No blocking source finding. Generic links on every route, requiring a worked answer before an exploratory prediction, and rejecting all pre-existing forward links would not improve this change. They were not adopted as review requirements. Reminder usefulness remains a teaching hypothesis; no person new to the material was observed.

## Built-site verification

Checked the final production build served at `http://localhost:4341/assembly-lab/` using Chromium at 375 × 900 and 1280 × 900, each in light and dark themes. Verified the actual `data-theme` and distinct computed background colours. No page errors or document horizontal overflow occurred.

Clicked six representative reminder links in each configuration: `meet-the-machine`, `compare-and-choose`, `loading-widths`, `recursive-calls`, `checked-addition` and `a32-division-helper`. Verified both the destination URL and its rendered lesson heading after navigation. Thus browser coverage samples Modules 0, 4, 6, 9, 11 and A; the remaining routes were reviewed in source only.

On `arithmetic-on-register-bits`, verified the new explanation is absent before prediction commitment and after commitment before calling. Keyboard Space runs both calls; the explanation then shows the model’s bit contributions and typed values. Its screenshot is readable at phone and desktop widths. Verified no page scroll occurs on calling, returned explanations survive reload with the same content, Reset calls removes them, and that reset survives reload. Viewed the phone dark and desktop light screenshots directly; DOM checks covered all four configurations. Evidence: `/workspace/scratch/reminder-links/review-browser.json`, `review-browser.log`, `review-browser.cjs` and `reading-*.png`.

Nonblocking inherited behaviour: Call both functions becomes disabled after activation, so Chromium reports BODY as the active element. A focused rerun confirmed the next Tab reaches Reset calls at both widths; no keyboard trap or call-induced scrolling occurs. The new explanation does not change these control semantics. The suggestion to change the button was challenged against this evidence and retained as a possible separate control improvement, rather than a prerequisite to this prose change.

Keep the reminders and the worked bridge. No blocking finding remains for this change. Browser checks and passing automated checks establish behaviour and presentation, not novice learning effectiveness. No assistive-technology study or physical Pi boot test is part of this review. Full-suite results are recorded separately by the managing session.
