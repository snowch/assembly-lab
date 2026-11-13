# Independent learner review: lesson footer

Scope: the built `register-widths` lesson only, read with earlier lessons as the learner's prior knowledge. I did not author the footer implementation or its copy. The v1 visual finding below is independently closed against v2; the final verdict for the reviewed scope is **accepted, with no remaining finding**.

## Candidate and checks

The v1 build served at `http://localhost:4480/assembly-lab/` has build ID `d64cd20325c1e32b240c911f89c057837e1bdc93781d14c0d1fdb5215533b57c`. Its release metadata SHA-256 is `21389b9db56b23c37372a5869414a3e7484d6bbb1a144830bc7514c81b6572db`. The footer identifies parent commit `2c907d04b246c9258eb385413c8526ae5b1ed7cf`, because the candidate source was uncommitted when built. This is not a final committed-source full-suite result.

Independently drove 375, 834 and 1280px in actual light/dark themes, six width/theme cases. The script `/tmp/footer-learner-check.mjs` exited 0; log `/tmp/footer-learner-check.log` and measurements `/tmp/footer-learner-check.json` retain the evidence. Each case checks initial, marked, reload-restored and keyboard-undone states. Enter marks and Space undoes; the same button DOM node retains focus. Marking keeps the lesson route, leaves typed practice work unchanged, and does not grade the exercise. The visible saving note describes browser/device scope. The completion button is outside navigation, at least 44px high and transparent in both states. The actual body colours are the intended light/dark colours, and pages do not overflow horizontally.

| Width | Last section to footer boundary | Last section to button | Each nav card width × height |
| --- | --- | --- | --- |
| 375px | 40px | 57px | 165.5 × 100.22px |
| 834px | 48px | 65px | 292 × 85.83px |
| 1280px | 48px | 65px | 374 × 85.83px |

Both themes have matching geometry. Previous and Next share their top, height and width. The reduced final gap makes the ending feel attached to the conclusion while leaving a clear boundary. The quiet reading mark and paired navigation communicate different jobs. The keyboard focus ring is a visible 3px solid outline; this is expected accessibility feedback rather than an unwanted shaded container.

Six additional width/theme storage-failure cases passed in `/tmp/footer-learner-storage.mjs`, exit 0; log `/tmp/footer-learner-storage.log` and measurements `/tmp/footer-learner-storage.json`. A blocked manual-mark write preserves the in-visit mark and shows the full truthful live warning. Undoing the mark does not falsely restore the saving claim. The warning remains legible and contained, with `role=status`.

Visually inspected light completed and dark initial screenshots at all three widths (`/tmp/footer-learner-{375,834,1280}-{light,dark}-{initial,complete}.png`). Navigation and the saving note are readable, and the alignment is a substantial improvement over the staggered screenshot supplied by the user.

## Finding requiring correction

**Minor visual/reading-flow issue.** The completed control reads “Lesson complete · Undo”, but “Undo” drops onto a second line at every reviewed width while the dot remains with “Lesson complete”. At 834px the button is 208.58px wide, its label 160.98px, and the status alone 125.33px; the suffix fragments over two lines. The initial “Mark lesson complete” similarly wraps at all three widths despite ample room in its row. This looks like accidental wrapping rather than a deliberate quiet control. Keep each normal-size control on a coherent baseline, and keep the separator with its action if wrapping becomes necessary at constrained/enlarged sizes. No reduction in text size or hit area is needed. Parent has accepted this finding and is preparing a v2 build; closure is pending that actual build.

No finding against the focus ring: it appears because the reviewer deliberately used the keyboard, remains visible in both themes and is not a persistent filled box. No finding against two navigation cards on a 375px phone: both titles wrap legibly and their equal card dimensions preserve the directional pair.

## Assumed knowledge and limits

The footer introduces no architecture term, C feature or arithmetic prerequisite. “Undo”, Previous/Next and a reading mark are ordinary controls; the note explicitly explains where marks are stored. The underlying lesson has already introduced its register naming before this ending. I found no new unexplained technical assumption caused by the footer change. This narrow review does not re-audit the lesson's arithmetic explanations or disclose challenge answers.

First/final lessons, other lesson titles and other browser engines belong to the technical/shared review and were not checked here. The parent's focused 18-pass completion suite is separate evidence and is not substituted for this independent browser review. I changed no product or test file.

## V2 independent closure

Checked the actual immutable revision at `http://localhost:4482/assembly-lab/`, built under `/workspace/scratch/lesson-footer-v2`. Its build ID is `5b238a85979e3fbcc7c231684642d42a229512add6acd2089b9e83caacaade6d`; release metadata SHA-256 is `13c5cbde0861dd9814382fce7c18f326125cc35e097038d48054f40d4626b172`. Metadata still names parent `2c907d0`, so this remains an independently reviewed candidate, not the final committed-source check.

Reran all six width/theme cases against v2 with explicit line-fragment checks for both button states. `/tmp/footer-learner-v2-check.mjs` exited 0; log `/tmp/footer-learner-v2-check.log`, full measurements `/tmp/footer-learner-v2-check.json`. The incomplete label has one text fragment at every reviewed width. The completed status and Undo each have one fragment and share the same text bottom/baseline; the complete group occupies one 20px text line. At375px their bottoms are both467.44px; at834px both577.61px; at1280px both577.86px, matching in both themes. The button remains44px high, transparent and outside navigation. Card alignment, reduced spacing, same-node focus, Enter/Space, restoration, exercise preservation and absence of automatic navigation/grading all pass again.

Visually inspected v2 completed375px light, initial834px light and completed1280px dark, alongside the retained matrix captures. The control now reads as one quiet row, with Undo visually secondary and clearly attached to its status. This independently closes the accidental-wrapping finding. The screenshot's keyboard outline remains intentional focus feedback. V1 findings/screenshots are preserved separately rather than overwritten.

Repeated all six storage-failure width/theme states against v2 as well: `/tmp/footer-learner-v2-storage.mjs`, exit0, with log and JSON beside it. The full live warning remains legible and contained, and remains truthful after undo. This is final v2 evidence rather than assuming the earlier row measurements apply after the width correction.

No new unexplained learner knowledge or remaining design finding in this scoped footer revision. Full-suite checks and final-source/publication identity remain the parent's responsibility.
