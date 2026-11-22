<!-- Copyright © 2026 Christopher Snow -->

# Direct text entry for elapsed arithmetic

The user rejected Tap mode for the short arithmetic exercise after identifying the mode switch and symbol toolbar as clutter. This change removes both from Calculate elapsed ticks. The input table, editable code, instruction reference, diagnostics, tests and hints retain their current roles. No new learner-facing wording is introduced.

The exercise opts in to text-only presentation through application-owned editor metadata. The shared editor continues to offer both modes unless a lesson explicitly opts in. An empty symbol list now omits its toolbar wrapper too. No arithmetic, grading, instruction gate or model changes are required.

A saved global Tap preference must not hide the text editor and must not be overwritten. Existing learner text, including legacy ret instructions, remains byte-for-byte editable and is never migrated or reset. Other exercises still honour that preference and retain their controls.

Verification covers saved pre-change artifacts/preferences, ordinary typing on phones and desktop, reference focus return, diagnostics, successful and failed runs, reload, clearing and page reflow in both actual themes. Existing browser tests that specifically required Tap in this exercise are updated to exercise direct text entry instead; the shared editor's Tap tests remain. Independent learner and technical reviews inspect the final built page. These functional checks do not establish learning effectiveness.
